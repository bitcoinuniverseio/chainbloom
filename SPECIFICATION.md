# ChainBloom Protocol Specification

Status: experimental, version 1. Keywords **MUST**, **MUST NOT**, **SHOULD**, and
**MAY** are normative in the sense of RFC 2119. Bitcoin consensus remains the
ultimate authority on whether a transaction exists and is spendable;
ChainBloom rules only determine whether a confirmed transaction changes the
derived ChainBloom state.

## 1. Model and identifiers

A **world** is created by a valid `CREATE` transaction. Its identifier is the
display-order, lowercase transaction ID of that transaction. A world contains
one through eight numbered lanes. A **lane ID** is the ASCII string
`<world-txid>:<lane-number>`, where the zero-based lane number is written in
base 10 without leading zeroes.

A **carrier** is the unique live outpoint for a lane. Every carrier output MUST
be exactly 1,000 satoshis and use the standard 34-byte P2TR script form
`OP_1 0x20 <32-byte output key>`. Possession of the spending key controls the
carrier; the protocol adds no covenant or recovery path.

## 2. Marker envelope

Every event transaction contains exactly one output whose first pushed bytes
begin with `CBLM`. It MUST be at `vout 0`, have value zero, and have this script:

```text
OP_RETURN <one minimal direct push of marker_bytes>
```

`marker_bytes` MUST be between 1 and 72 bytes. Because 72 is below 76, the push
is encoded directly as the one-byte length; `OP_PUSHDATA1` and other push
encodings are invalid. There MUST be no second push, trailing opcode, trailing
byte, or second `CBLM`-prefixed OP_RETURN anywhere in the transaction.

The envelope is:

| Offset | Size | Field          | Required value               |
| -----: | ---: | -------------- | ---------------------------- |
|      0 |    4 | magic          | ASCII `CBLM` (`43 42 4c 4d`) |
|      4 |    1 | version        | `01`                         |
|      5 |    1 | network        | table below                  |
|      6 |    1 | opcode         | operation table below        |
|      7 |    1 | payload length | exact remaining-byte count   |
|      8 |    N | payload        | exactly N bytes              |

Network values are mainnet `00`, testnet4 `01`, signet `02`, and regtest `03`.
All other values are reserved and invalid. Opcode values are `CREATE 01`,
`BLOOM 02`, `GRAFT 03`, `RENDEZVOUS 04`, and `CLOSE 05`; all others are
reserved and invalid. Version, network, opcode, and length are unsigned bytes.
Multi-byte integers below are unsigned, big-endian.

## 3. Operation payloads

### 3.1 CREATE (`01`)

```text
ruleset:u8 | lane_count:u8 | duration_blocks:u16 | max_steps:u16 |
seed:16 bytes | title_len:u8 | title:title_len bytes
```

- `ruleset` MUST equal 1.
- `lane_count` MUST be 1 through 8.
- `duration_blocks` MUST be 144 through 52,560.
- `max_steps` MUST be 1 through 512.
- `seed` is an opaque, exact 16-byte value.
- `title_len` MUST be 0 through 32 and consume the exact remaining payload.
- Title bytes MUST be ASCII and each byte MUST represent a character in
  `[A-Za-z0-9 ._:-]`.

The transaction MUST NOT spend a currently live carrier. Outputs 1 through
`lane_count` map, in order, to roots for lane 0 through `lane_count - 1`; each
MUST be an exact carrier. Fee or change outputs MAY follow them.

The creation height is the block height containing `CREATE`. The exclusive end
height is `creation_height + duration_blocks`.

### 3.2 BLOOM (`02`)

```text
glyph:u8 | palette:u8 | motion:u8 | magnitude:u8
```

`glyph` is 0..31, `palette` is 0..15, `motion` is 0..7, and `magnitude`
is 0..255. The exact current carrier MUST be `vin 0`, no other input may be a
live carrier, and the exact successor carrier MUST be `vout 1`. Fee inputs and
fee/change outputs MAY follow their required carrier positions.

### 3.3 GRAFT (`03`)

```text
target_txid:32 bytes | relation:u8 | glyph:u8 | palette:u8
```

The target txid is stored in the same left-to-right display order used by block
explorers and RPC responses; it is not reversed. `relation` is 0..15, `glyph`
is 0..31, and `palette` is 0..15. Carrier mapping is the same one-to-one
mapping as `BLOOM`.

The target MUST be a valid, confirmed ChainBloom event on the marker network
at a height strictly below the `GRAFT` height. The target does not need to be
in the same world and does not transfer or merge ownership.

### 3.4 RENDEZVOUS (`04`)

```text
bridge_style:u8 | glyph:u8 | palette:u8 | intensity:u8
```

`bridge_style` is 0..15, `glyph` is 0..31, `palette` is 0..15, and
`intensity` is 0..255. Exactly two live carriers are consumed. They MUST occupy
`vin 0` and `vin 1`, ordered by ascending lexicographic lane ID. `vout 1`
continues the lane from `vin 0`; `vout 2` continues the lane from `vin 1`.
Both outputs MUST be exact carriers. A rendezvous therefore preserves two
lanes and never combines their values or ownership. Fee inputs begin at
`vin 2`; fee/change outputs begin at `vout 3`.

### 3.5 CLOSE (`05`)

```text
reason:u8
```

`reason` is an application-defined value 0..255. Exactly one live carrier MUST
appear at `vin 0`; no other live carrier may be spent. There is no designated
successor output. Outputs after the marker are ordinary fee/change or recipient
outputs and do not continue the lane, even if one happens to use a P2TR script.

## 4. Common transaction rules

All required carrier parents MUST already be confirmed in a block with a
strictly lower height. A child in the same block as its parent is invalid.
Every input MUST use planned-RBF `nSequence = 0xfffffffd`. All fee inputs MUST
follow required carrier inputs and spend native P2WPKH, P2WSH, or P2TR outputs.
Duplicate inputs are invalid.

Signatures MUST commit to every output: Taproot inputs use `SIGHASH_DEFAULT` or
explicit `SIGHASH_ALL`; v0 SegWit signatures use `SIGHASH_ALL`. A validating
Bitcoin node remains responsible for script and signature correctness. The
reference validator can additionally inspect common witness encodings when
`requireWitnessSignatures` is enabled.

An advancing lane MUST belong to an active world, be below its exclusive end
height, and have `step_count < max_steps`. Each valid `BLOOM`, `GRAFT`, or
`RENDEZVOUS` increments that lane's step count by one. `CREATE` starts at zero.
`CLOSE` remains permitted at the step limit and does not increment it.

## 5. Confirmed state transition

Indexers process the canonical best chain by increasing height and transaction
index. At the start of height H, every active world with
`H >= end_height_exclusive` becomes expired and all of its live lanes become
expired.

For each confirmed transaction:

1. Resolve live carriers from the state produced by prior transactions.
2. Decode and validate the complete transaction against this specification.
3. If valid, apply its exact lane mappings atomically.
4. If invalid but it spends one or more live carriers, mark every affected
   lane abandoned. The spent outpoint can never be restored except by a chain
   reorganization.
5. If it spends no live carrier and is not a valid `CREATE`, ignore it.

When all lanes in a non-expired world are closed or abandoned, its status is
ended. Events and abandoned-spend records are retained for auditability.

## 6. Mempool and reorganizations

Confirmed best-chain state is canonical. Mempool events are projections only:
they MUST NOT become lineage parents, increment confirmed counters, or hide the
confirmed carrier. Implementations SHOULD display conflicts and RBF replacement
and label projections as provisional.

On a reorganization, an indexer MUST restore state to the common ancestor and
replay the new branch in canonical order. Implementations SHOULD keep an atomic
pre-block snapshot or an equivalent reversible journal. A crash MUST never
leave half of a block applied.

## 7. Forward compatibility

Unknown versions, rulesets, networks, opcodes, reserved values, extra payload
bytes, and non-exact encodings are invalid in version 1. Future versions must
use a new envelope version or an explicitly specified ruleset and must not be
silently interpreted under these rules.

## 8. Non-consensus rendering

Glyphs, palettes, motion, bridge styles, visual layout, metadata resolution,
and UI are not Bitcoin or ChainBloom consensus. Two renderers may look
different while agreeing on every protocol event. The reference SVG renderer
is deterministic for reproducibility, not normative.
