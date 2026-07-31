---
title: Test vectors
description: Eleven fixed byte strings that tell you whether your ChainBloom reader agrees with every other one. Five markers that must parse and six that must be refused.
socialTitle: ChainBloom test vectors
socialDescription: The five valid and six invalid marker vectors, the real hex, and what each one proves about an implementation.
updated: 2026-07-31
order: 11
verified: "@chainbloom/protocol@0.1.0"
keywords: [test vectors, conformance, interoperability, marker hex, decoder, fixtures]
related: [reference/protocol-architecture, reference/errors, reference/cli]
cta:
  title: Then read the rules a marker cannot express
  body: The vectors pin down eleven byte strings. Whole transactions are checked by a longer list of rules.
  label: Read the validation rules
  href: /docs/reference/validation-rules
---

:::lead
If you are writing ChainBloom software, start on this page. Eleven fixed byte strings decide whether your reader agrees with every other reader, and checking them takes one command. Everything else in this section is easier to trust once these pass.
:::

## Start with the bytes, not with the prose

Prose can be read two ways. Bytes cannot. The eleven vectors in `vectors/` are the smallest complete statement of the [[marker]] format: five strings your decoder must accept and turn into exactly the listed fields, and six it must refuse with exactly the listed error code.

The check is a round trip, not just a parse. For each valid vector, `scripts/check-vectors.ts` decodes the hex **and** re-encodes the payload, then compares the result byte for byte with the original string. That pins the encoder as well as the decoder, and it makes one promise you can build on: for a given network and payload there is exactly one legal marker. There is no optional padding, no alternative field order, and no second way to say the same thing.

## The five valid vectors

Each vector names a network byte, a full marker in hex, and the payload it must decode to. The first {{HEADER_BYTES}} bytes are always the same shape: magic `{{PROTOCOL_MAGIC_HEX}}`, version `{{PROTOCOL_VERSION}}`, network, [[opcode]], payload length.

:::figure caption="vectors/valid-markers.json — every byte an encoder must produce"
| Vector | Network | Marker hex |
| --- | --- | --- |
| `create-two-lanes` | `3` regtest | `43424c4d0103011b010200900005000102030405060708090a0b0c0d0e0f044461776e` |
| `bloom` | `3` regtest | `43424c4d01030204070302c8` |
| `graft-display-order-txid` | `3` regtest | `43424c4d01030323000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f020c05` |
| `rendezvous` | `2` signet | `43424c4d01020404041209dc` |
| `close` | `0` mainnet | `43424c4d0100050101` |
:::

### create-two-lanes

The only operation whose payload changes length, so it is the one that catches lazy parsing.

```text title="create-two-lanes, field by field"
43424c4d   magic
01         version
03         network: regtest
01         opcode: CREATE
1b         payload length: 27 bytes
01         ruleset
02         laneCount
0090       durationBlocks: 144, big endian
0005       maxSteps: 5, big endian
000102…0f  seed: 16 bytes
04         title length
4461776e   title: "Dawn"
```

It proves four things at once: the two multi-byte numbers are big endian, the seed sits at a fixed offset, the title carries its own length byte, and the declared payload length is 23 plus the title length. Decode this one wrongly and every [[world]] you read will have the wrong duration.

### bloom

The most common step in any world, and the shortest fixed payload: glyph `07`, palette `03`, motion `02`, magnitude `c8`. Magnitude is 200, which uses more than half the byte range on purpose -- a decoder that treats these fields as signed gets a different number. Compare this string with `bloom-glyph-out-of-range` below; they differ by one byte.

### graft-display-order-txid

The vector name is a warning. An echo carries the [[txid]] of the event it answers, and inside the marker those 32 bytes appear in **display order**, exactly as the id is written and searched for. They are not reversed.

That matters because the same id appears reversed elsewhere in the same transaction: a Bitcoin input stores its previous transaction hash in internal byte order. `scripts/generate-fixtures.ts` shows both conventions side by side. Reversing the marker bytes is the single most common implementation mistake, and it fails silently -- the marker still decodes, it just names an event nobody can find, which surfaces later as `UNKNOWN_GRAFT_TARGET`.

The payload is 35 bytes: 32 for the target, then relation `02`, glyph `0c`, palette `05`.

### rendezvous

Signet, byte `02`, so only the sixth byte differs from the regtest examples. The payload is bridge style `04`, glyph `12` (18), palette `09`, intensity `dc` (220) -- four bytes, the same size as a bloom.

That is the point worth noticing: a [[meeting]] joins two paths, but its marker is no bigger than a single step. The second path is expressed by the shape of the transaction, not by the marker. Nothing in these bytes tells you which paths met.

### close

Nine bytes, and the smallest legal marker there is: header plus a single reason byte. Mainnet is network `00`, so this vector also proves that the mainnet byte is a real value and not an unset default. A decoder that treats a zero network byte as missing fails here.

## The six invalid vectors

Each of these must be refused, and refused with the exact code. A reader that repairs any of them has stopped agreeing with everyone else.

:::figure caption="vectors/invalid-markers.json — what a reader must refuse, and how"
| Vector | Marker hex | Error code | What it proves |
| --- | --- | --- | --- |
| `truncated-header` | `4342` | `TRUNCATED_HEADER` | Length is checked before any byte is interpreted. Two bytes is shorter than the {{HEADER_BYTES}}-byte header. |
| `wrong-magic` | `58424c4d01030204070302c8` | `INVALID_MAGIC` | All four magic bytes are compared. Here only the first differs. |
| `reserved-network` | `43424c4d01090204070302c8` | `RESERVED_NETWORK` | An unknown network byte is refused, never treated as mainnet. |
| `reserved-opcode` | `43424c4d01030904070302c8` | `RESERVED_OPCODE` | An unknown opcode is refused, never skipped as a future extension. |
| `trailing-byte` | `43424c4d01030204070302c800` | `INVALID_PAYLOAD_LENGTH` | The declared length must consume every remaining byte. One spare byte is fatal. |
| `bloom-glyph-out-of-range` | `43424c4d01030204200302c8` | `INTEGER_OUT_OF_RANGE` | Field ranges are checked after the structure parses. Glyph `20` is 32; the highest glyph is {{MAX_GLYPH}}. |
:::

Four of the six are one byte away from the valid `bloom` vector, which is deliberate. It is easy to write a decoder that reads the fields it wants and ignores the rest; these strings catch that decoder immediately.

The shared principle is: refuse, do not repair. There is no lenient mode, no best-effort parse, and no rule that lets an unknown opcode through so a later version can define it. If two implementations disagree about whether a string is a marker, they will eventually disagree about what a world contains -- so the format admits no discretion.

:::note
`RESERVED_OPCODE` is the one people argue with. Ignoring unknown operations sounds tolerant, but it would let a future rule change quietly alter the meaning of a world that is already finished. A new operation gets a new ruleset instead. See [governance](/docs/reference/governance).
:::

## Running them

The vectors ship in the repository and run without a Bitcoin node, a network, or a key.

```bash title="check every vector"
npm run check:vectors
```

On success it prints one line and exits zero:

```text
Verified 5 valid and 6 invalid marker vectors.
```

Any failure throws and names the vector, so `Valid vector failed: graft-display-order-txid` tells you where to look without a debugger. The command is also part of `npm run ci`, which means the numbers in that sentence are checked on every change.

The CLI has a narrower version of the same idea:

```bash title="the packaged command"
chainbloom vectors verify
```

It re-encodes the five valid vectors and prints `{"valid":true,"verified":5}`. It does not run the invalid set -- use `npm run check:vectors` for that.

:::note
{{PACKAGE_NAME}} {{PACKAGE_VERSION}} is not published to npm. Clone [the repository](https://github.com/bitcoinuniverse/chainbloom), install, and build it there. Node {{NODE_ENGINE}} is required.
:::

## Whole transactions: the fixtures

Markers are only the inner layer. `fixtures/transactions.json` holds five complete regtest transactions -- create, bloom, graft, rendezvous, close -- confirmed at heights 100 to 104, one per block. Each entry carries a name, a height, a block hash, the previous block hash, the txid, the raw transaction hex, and the fee prevouts that transaction spends.

That sequence is a whole small world from first to last moment: a two-path world opens, one path blooms, that path echoes its own bloom, it then meets the second root path, and one of the successors is completed. Replay it and you have something to compare a snapshot against.

The file is generated, not hand-written. `scripts/generate-fixtures.ts` builds the five transactions with the same encoder the library uses and prints the JSON to standard output, so the fixtures cannot drift away from the code that made them. Read it when you want a worked example of a valid transaction shape -- input order, the {{CARRIER_VALUE_SATS}}-satoshi carrier outputs, the change output, and the reversed input txids.

:::tip
Feed the sequence to `chainbloom state replay -n regtest -f <file>` to watch a world change. Each fixture entry is one transaction in one block, so wrap each into a block with a single transaction before replaying.
:::

## What the vectors do not cover

They cover markers, and one happy path through the fixtures. They say nothing about:

- carrier values, output positions, or input ordering;
- the `0xfffffffd` sequence number and version {{TX_VERSION}} rules;
- signature types, when witness checking is switched on;
- whether a world is still open, or a path still has steps left;
- what happens to a path whose [[carrier]] is spent by something that is not a ChainBloom action.

Those live in [validation rules](/docs/reference/validation-rules), and every code either set can produce is listed in [error and issue codes](/docs/reference/errors).

:::checklist id=marker-decoder
- All five valid vectors decode to the listed fields
- All five re-encode to the identical hex string
- All six invalid vectors are refused with the exact error code
- A GRAFT target txid survives a decode and encode round trip unreversed
- The decoder refuses a marker larger than {{MAX_MARKER_BYTES}} bytes
- Nothing in the reader treats an unknown opcode as a future extension
:::
