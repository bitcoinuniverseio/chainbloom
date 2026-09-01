---
title: Command line
nav: CLI
description: Every command the chainbloom binary has, with a real invocation, the JSON it prints, and the error shape it uses when something goes wrong.
updated: 2026-07-31
order: 8
verified: "@chainbloom/protocol@0.1.0"
keywords: [cli, command line, marker, psbt, replay, vectors]
related: [reference/sdk, reference/test-vectors, reference/indexer-requirements]
cta:
  title: The same rules, as a library
  body: Every command here wraps one exported function you can call from TypeScript instead.
  label: Read the SDK reference
  href: /docs/reference/sdk
---

:::lead
Six commands, all offline. You can encode a [[marker]] and decode one, take a raw transaction apart, build an unsigned [[psbt]], check the published vectors, and rebuild a whole history from blocks, with no node, no API key, no account, and JSON on stdout that pipes straight into a test.
:::

## Getting the command

The package is not on npm yet, so the binary arrives with the repository. Build it once:

```bash
git clone https://github.com/bitcoinuniverse/chainbloom.git
cd chainbloom
npm ci
npm run build
```

After that, `node dist/cli.js …` works immediately, and `npm link` puts `chainbloom` on your PATH. The examples below use the short form.

Every command answers `--help`, and an error prints the usage after it:

```console
$ chainbloom --help
Usage: chainbloom [options] [command]

Create and explore ChainBloom histories on Bitcoin

Options:
  -h, --help      display help for command

Commands:
  marker          Encode or decode protocol markers
  tx              Parse a raw Bitcoin transaction
  psbt            Build a deterministic unsigned PSBT from JSON
  vectors         Verify bundled interoperability vectors
  state           Replay indexed blocks and print deterministic state
  help [command]  display help for command
```

Those five groups are all there is. There is no `send`, no `wallet`, no key handling, and nothing that touches a network. The CLI never signs and never broadcasts.

## Markers

### marker encode

```
chainbloom marker encode -n <network> -o <operation> -j <json>
```

`-n` takes a network name: `mainnet`, `testnet4`, `signet`, or `regtest`. An unknown name fails with `UNKNOWN_NETWORK_NAME`. `-o` takes an operation name in any case and is upper-cased for you. `-j` takes the payload fields as JSON, without the `operation` key. The flag supplies that.

```console
$ chainbloom marker encode -n signet -o bloom \
    -j '{"glyph":7,"palette":3,"motion":2,"magnitude":200}'
{
  "markerHex": "43424c4d01020204070302c8"
}
```

Every field is range-checked as it is encoded, so this is a cheap way to find out that a value is out of bounds before it costs a fee. The result is the exact byte string that belongs in the OP_RETURN at vout 0, at most {{MAX_MARKER_BYTES}} bytes.

### marker decode

```
chainbloom marker decode --hex <hex>
```

The inverse, and stricter than you might expect: the payload length byte must consume the marker exactly, so a trailing byte is a rejection, not a warning.

```console
$ chainbloom marker decode --hex 43424c4d01020204070302c8
{
  "magic": "CBLM",
  "version": 1,
  "network": 2,
  "opcode": 2,
  "operation": "BLOOM",
  "payloadLength": 4,
  "payload": {
    "operation": "BLOOM",
    "glyph": 7,
    "palette": 3,
    "motion": 2,
    "magnitude": 200
  },
  "bytesHex": "43424c4d01020204070302c8"
}
```

`network` and `opcode` come back as the raw bytes as well as their names, which is what you want when you are checking another implementation's output byte by byte.

## Transactions and PSBTs

### tx parse

```
chainbloom tx parse --hex <hex>
```

Takes a raw transaction and returns its identifiers, weight, inputs, outputs, and witness. It reads the transaction only; it does not judge it. Here is a real `CLOSE` from the bundled fixtures, with the trailing `hex` field cut for length:

```console
$ chainbloom tx parse --hex 02000000000102b191a5ca…
{
  "txid": "04d7b86a4e80cf4519993ff609a8961175f51767a130250f453dee2ef5b6a3aa",
  "wtxid": "db1989e811741eb5d15db6e31b7782674b0734755eb27fd11a80dd6642ca4311",
  "version": 2,
  "locktime": 0,
  "virtualSize": 177,
  "weight": 706,
  "hasWitness": true,
  "inputs": [
    {
      "txid": "c35321f99354dd162d4a6ce86d1b04f0a0fe1ede0738026f7f9244c6caa591b1",
      "vout": 1,
      "sequence": 4294967293,
      "scriptSigHex": "",
      "witness": ["0101010101…"]
    },
    {
      "txid": "5555555555555555555555555555555555555555555555555555555555555555",
      "vout": 0,
      "sequence": 4294967293,
      "scriptSigHex": "",
      "witness": ["0202020202…"]
    }
  ],
  "outputs": [
    { "value": "0", "scriptPubKeyHex": "6a0943424c4d0103050101" },
    { "value": "5000", "scriptPubKeyHex": "0014555555…" }
  ],
  "hex": "0200000000010…"
}
```

Two things to read there. `sequence` is `4294967293`, the decimal form of {{RBF_SEQUENCE_HEX}}, which every ChainBloom input must use. And the {{CARRIER_VALUE_SATS_RAW}} satoshis that were riding the [[path]] are gone from the outputs. A `CLOSE` produces no successor, so the value comes back through change.

### psbt build

```
chainbloom psbt build -o <operation> -f <path>
```

Reads the builder options from a JSON file and prints an unsigned PSBT in base64. The file is the same object the matching TypeScript builder takes, with `network` as the numeric id.

```json title="create.json"
{
  "network": 2,
  "payload": {
    "operation": "CREATE",
    "ruleset": 1,
    "laneCount": 2,
    "durationBlocks": 144,
    "maxSteps": 5,
    "seed": "000102030405060708090a0b0c0d0e0f",
    "title": "Dawn"
  },
  "rootOutputKeysHex": [
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  ],
  "feeInputs": [
    {
      "txid": "1111111111111111111111111111111111111111111111111111111111111111",
      "vout": 0,
      "value": "50000",
      "scriptPubKeyHex": "00141111111111111111111111111111111111111111"
    }
  ],
  "extraOutputs": [
    {
      "value": "46000",
      "scriptPubKeyHex": "00141111111111111111111111111111111111111111"
    }
  ]
}
```

```console
$ chainbloom psbt build -o create -f create.json
{
  "psbtBase64": "cHNidP8BANYCAAAAARERERERERERERERERERERERERERERER…"
}
```

The PSBT is unsigned and stays unsigned. Sign it in a wallet that shows you what it contains, and read [wallet integration](/docs/reference/integration-wallets) for what that review should include.

## Vectors and state

### vectors verify

```
chainbloom vectors verify
```

Re-encodes every bundled valid marker vector and checks the bytes match, then decodes the result and checks the operation survived the round trip. No arguments, no files to point at.

```console
$ chainbloom vectors verify
{
  "valid": true,
  "verified": 5
}
```

A mismatch throws before printing anything, naming the vector that failed. Run this first when you suspect your build is stale.

### state replay

```
chainbloom state replay -n <network> -f <path>
```

Reads an array of indexed blocks, applies them in order, and prints the deterministic snapshot. Each block carries `hash`, `previousHash`, `height`, and `transactions` of `{ hex, prevouts }`. This is the command an [[indexer]] author checks their own output against.

```console
$ chainbloom state replay -n regtest -f blocks.json
{
  "tipHash": "8181818181818181818181818181818181818181818181818181818181818181",
  "tipHeight": 101,
  "worlds": [ … ],
  "lanes": [ … ],
  "events": [ … ],
  "invalidCarrierSpends": []
}
```

Replaying the first two fixture blocks gives one world titled `Dawn`, created at height 100 with `endHeightExclusive` 244 and status `ACTIVE`, and two paths: one still at `stepCount` 0, and one moved to `stepCount` 1 by the `BLOOM` in block 101, with its `currentOutpoint` pointing at that transaction's vout 1.

Blocks must be contiguous. Hand it a gap and it stops with `NON_CONTIGUOUS_BLOCK` rather than producing a history with a hole in it.

## How input is read

JSON files given with `-f` go through one extra step: any string under a key named `value`, or under a key ending in `Sats`, that is all decimal digits is converted to a `BigInt`. That is why `"value": "50000"` above is quoted. Write it as a bare number and JavaScript hands you a float, which is exactly the wrong type for satoshis.

The rule applies to files, not to the inline `-j` payload of `marker encode`, which has no satoshi fields in it.

## How output and errors work

Success prints JSON to **stdout**, indented by two spaces, with `BigInt` values rendered as decimal strings. Nothing else is written to stdout, so piping into `jq` or a test assertion is safe.

Failure prints an object with a `code` and a message to **stderr** and sets exit code 1:

```console
$ chainbloom marker decode --hex 43424c4d0103
{
  "error": "TRUNCATED_HEADER",
  "message": "ChainBloom marker is shorter than 8 bytes"
}
$ echo $?
1
```

```console
$ chainbloom marker decode --hex 4242424201030204070302c8
{
  "error": "INVALID_MAGIC",
  "message": "Marker magic must be CBLM"
}
```

The `error` field is the stable part. Match on it in scripts; the message is written for people and may be reworded. Every code is listed in the [error reference](/docs/reference/errors).

## The same job, two ways

Anything the command line does, the package does in a program. Encoding a bloom marker is the shortest example of the pair.

:::codetabs
:::tab label="Command line"
```console
$ chainbloom marker encode -n regtest -o bloom \
    -j '{"glyph":7,"palette":3,"motion":2,"magnitude":200}'
{
  "markerHex": "43424c4d01030204070302c8"
}
```
:::
:::tab label="TypeScript"
```ts title="encode-bloom.ts"
import { NETWORK, bytesToHex, encodeMarker } from '@chainbloom/protocol';

const marker = encodeMarker(NETWORK.REGTEST, {
  operation: 'BLOOM',
  glyph: 7,
  palette: 3,
  motion: 2,
  magnitude: 200,
});

console.log(bytesToHex(marker));
// 43424c4d01030204070302c8
```
:::
:::

Reach for the command line when you are checking something by hand or wiring a
shell script. Reach for the package when the result feeds the next step of a
program. Both produce the same bytes, and both are covered by the same
[test vectors](/docs/reference/test-vectors).
