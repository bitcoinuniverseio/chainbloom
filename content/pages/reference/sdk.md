---
title: TypeScript SDK
nav: SDK
description: Install the package from the repository, encode markers, build every PSBT, validate a transaction, and replay blocks with the reference state engine.
updated: 2026-07-31
order: 7
verified: "@chainbloom/protocol@0.1.0"
keywords: [sdk, typescript, psbt, encode, decode, replay]
related: [reference/cli, reference/validation-rules, reference/test-vectors]
cta:
  title: Same rules, from a terminal
  body: Every function on this page has a command-line equivalent you can pipe into a test.
  label: Read the CLI reference
  href: /docs/reference/cli
---

:::lead
{{PACKAGE_NAME}} is the rules, not a client for someone else's rules. With it you can build a valid ChainBloom transaction, reject an invalid one, and rebuild an entire history from raw blocks, offline, with no service in the middle and nobody to ask.
:::

## Install it from the repository

The package is **not published to npm yet**. There is no registry install, and any page that tells you otherwise is wrong. Today you build it from source:

```bash
git clone https://github.com/bitcoinuniverse/chainbloom.git
cd chainbloom
npm ci
npm run build
```

That produces `dist/index.js`, `dist/index.d.ts`, and `dist/cli.js`. To use it from another project, point npm at the checkout:

```bash
npm install ../chainbloom
```

Two constraints, both enforced:

- **Node {{NODE_ENGINE}}.** The `engines` field is exact, not a suggestion.
- **ESM only.** The package sets `"type": "module"` and its export map offers `import` alone. `require('@chainbloom/protocol')` does not work and is not going to.

Runtime dependencies are `bitcoinjs-lib` and `commander`. Nothing else, and nothing that talks to a network.

## Encode and decode a marker

A [[marker]] is the {{HEADER_BYTES}}-byte header plus a payload, at most {{MAX_MARKER_BYTES}} bytes in total, carried in the OP_RETURN at vout 0. `encodeMarker` builds one from a typed payload and refuses anything out of range. `decodeMarker` reverses it and refuses anything malformed.

```ts verify title="marker-round-trip.ts"
import {
  NETWORK,
  bytesToHex,
  decodeMarker,
  encodeMarker,
} from '@chainbloom/protocol';

const marker = encodeMarker(NETWORK.SIGNET, {
  operation: 'BLOOM',
  glyph: 7,
  palette: 3,
  motion: 2,
  magnitude: 200,
});

const decoded = decodeMarker(marker);

console.log(bytesToHex(marker));
console.log(decoded.operation, decoded.payloadLength, marker.length);
```

That prints:

```text
43424c4d01020204070302c8
BLOOM 4 12
```

Twelve bytes in total: the {{HEADER_BYTES}}-byte header, plus the payload length the decoder reports back. Push `glyph` past {{MAX_GLYPH}} and `encodeMarker` throws `INTEGER_OUT_OF_RANGE` with the field name, the value, and the bounds in `details`, rather than writing a marker no indexer will accept.

## Read a published vector

The repository ships the interoperability vectors under `vectors/`. Decoding one is the fastest way to prove your build is wired up, and the fastest way to check a decoder you wrote in another language against a byte string somebody else can also read.

```ts verify title="decode-vector.ts"
import { decodeMarkerHex } from '@chainbloom/protocol';

const marker = decodeMarkerHex(
  '43424c4d0103011b010200900005000102030405060708090a0b0c0d0e0f044461776e',
);

console.log(marker.operation, marker.network, marker.payloadLength);
console.log(JSON.stringify(marker.payload, null, 2));
```

That prints:

```text
CREATE 3 27
{
  "operation": "CREATE",
  "ruleset": 1,
  "laneCount": 2,
  "durationBlocks": 144,
  "maxSteps": 5,
  "seed": "000102030405060708090a0b0c0d0e0f",
  "title": "Dawn"
}
```

`decodeMarkerHex` is `decodeMarker` with a hex string in front of it. Both throw `ChainBloomError` with a code you can switch on: `TRUNCATED_HEADER`, `INVALID_MAGIC`, `UNSUPPORTED_VERSION`, `RESERVED_NETWORK`, `RESERVED_OPCODE`, `INVALID_PAYLOAD_LENGTH`, and the rest are listed in [error reference](/docs/reference/errors).

## Build a PSBT

There are {{OPERATION_COUNT}} builders, one per operation. Every one returns an unsigned `bitcoinjs-lib` [[psbt]] at transaction version {{TX_VERSION}} with every input sequence set to {{RBF_SEQUENCE_HEX}}, the marker at vout 0 with value 0, and any [[carrier]] outputs at exactly {{CARRIER_VALUE_SATS_RAW}} satoshis on [[taproot]] scripts. You supply inputs, output keys, change, and locktime. The builder supplies the shape.

### CREATE

`buildCreatePsbt` opens a world. You pass one x-only output key per path, and the count must match `laneCount` exactly or you get `LANE_COUNT_MISMATCH`. `CREATE` spends no carrier, so every input is a fee input.

```ts verify title="create-world.ts"
import { NETWORK, buildCreatePsbt } from '@chainbloom/protocol';

const psbt = buildCreatePsbt({
  network: NETWORK.SIGNET,
  payload: {
    operation: 'CREATE',
    ruleset: 1,
    laneCount: 2,
    durationBlocks: 144,
    maxSteps: 5,
    seed: '000102030405060708090a0b0c0d0e0f',
    title: 'Dawn',
  },
  rootOutputKeysHex: [
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  ],
  feeInputs: [
    {
      txid: '1111111111111111111111111111111111111111111111111111111111111111',
      vout: 0,
      value: 50_000n,
      scriptPubKeyHex: '00141111111111111111111111111111111111111111',
    },
  ],
  extraOutputs: [
    {
      value: 46_000n,
      scriptPubKeyHex: '00141111111111111111111111111111111111111111',
    },
  ],
});

console.log(psbt.version, psbt.txOutputs.length);
console.log(psbt.txInputs[0].sequence.toString(16));
console.log(psbt.toBase64().slice(0, 32));
```

That prints:

```text
2 4
fffffffd
cHNidP8BANYCAAAAARERERERERERERER
```

Four outputs: the marker, two root carriers of {{CARRIER_VALUE_SATS_RAW}} satoshis each, and change. The 50,000 satoshi input less 48,000 satoshis of outputs leaves 2,000 satoshis for the miner. The builder checks that outputs do not exceed inputs (`INSUFFICIENT_INPUT_VALUE`) but it does not choose your fee. That is yours to set and yours to get right.

### BLOOM and GRAFT

Both take one carrier at vin 0 and produce one successor at vout 1. The shapes are identical; only the payload differs.

```ts title="bloom.ts"
import { NETWORK, buildBloomPsbt } from '@chainbloom/protocol';

const psbt = buildBloomPsbt({
  network: NETWORK.SIGNET,
  payload: { operation: 'BLOOM', glyph: 7, palette: 3, motion: 2, magnitude: 200 },
  carrier: {
    laneId: `${worldId}:0`,
    txid: currentOutpoint.txid,
    vout: currentOutpoint.vout,
    value: 1000n,
    scriptPubKeyHex: currentScriptPubKeyHex,
    tapInternalKeyHex: internalKey,
  },
  successorOutputKeyHex: nextOutputKey,
  feeInputs,
  extraOutputs: [change],
});
```

A carrier input that is not exactly {{CARRIER_VALUE_SATS}} satoshis on a P2TR script is rejected at build time with `INVALID_CARRIER_INPUT`, before you have signed anything. `buildGraftPsbt` is the same call with a `GRAFT` payload carrying `targetEventTxid`, `relation`, `glyph`, and `palette`.

### RENDEZVOUS

Two carriers in, two successors out. You pass the participants in whatever order suits your code and the builder sorts them by `laneId` itself, because the validator requires vin 0 and vin 1 to be in lexicographic lane order and will emit `RENDEZVOUS_LANE_ORDER` if they are not.

```ts title="meet.ts"
const psbt = buildRendezvousPsbt({
  network: NETWORK.SIGNET,
  payload: { operation: 'RENDEZVOUS', bridgeStyle: 4, glyph: 18, palette: 9, intensity: 220 },
  participants: [
    { carrier: mine, successorOutputKeyHex: myNextKey },
    { carrier: theirs, successorOutputKeyHex: theirNextKey },
  ],
  feeInputs,
  extraOutputs: [change],
});
```

Passing the same lane twice throws `DUPLICATE_LANE`. Because both participants must sign, this PSBT is meant to be handed around: build once, sign twice, broadcast once.

### CLOSE

`buildClosePsbt` takes a carrier and produces no successor. The marker is the only protocol output, so the {{CARRIER_VALUE_SATS_RAW}} satoshis that were riding the [[path]] come back to you through change, minus the fee. This is the one action that cannot be followed by another on that path.

## Validate a transaction

`validateProtocolTransaction` is the same function the state engine runs. It needs to know which outputs are live carriers, which is what the `view` argument is for. Pass a `ChainBloomState` that has already applied the confirmed blocks.

```ts title="validate.ts"
import {
  ChainBloomState,
  NETWORK,
  parseTransactionHex,
  validateProtocolTransaction,
} from '@chainbloom/protocol';

const state = new ChainBloomState({
  network: NETWORK.SIGNET,
  requireWitnessSignatures: true,
});
state.replay(confirmedBlocks);

const transaction = parseTransactionHex(rawHex);
const result = validateProtocolTransaction(transaction, {
  network: NETWORK.SIGNET,
  height: state.tipHeight! + 1,
  view: state,
  prevouts: prevoutsByOutpointKey,
  requireWitnessSignatures: true,
});

if (!result.valid) {
  for (const issue of result.issues) {
    console.error(`${issue.code} at ${issue.path}: ${issue.message}`);
  }
}
```

`result` also carries `marker` (the decoded payload), `carrierLaneIds` (which paths this transaction touches), and `successorMappings` (which output continues which path). Set `requireWitnessSignatures` to `true` only for confirmed transactions with witnesses present; it is what produces `MISSING_WITNESS`, `MISSING_TAPROOT_SIGNATURE`, and `UNSAFE_SIGHASH`.

## Replay blocks

`ChainBloomState` holds confirmed state and nothing else.

```ts title="replay.ts"
const state = new ChainBloomState({ network: NETWORK.SIGNET });

state.replay(blocks);            // reset, then apply in order
state.applyBlock(nextBlock);     // must extend the tip, or NON_CONTIGUOUS_BLOCK
state.rollbackTip(orphanedHash); // undo exactly one block

const snapshot = state.snapshot();
console.log(snapshot.tipHeight, snapshot.worlds.length, snapshot.lanes.length);
```

`snapshot()` sorts worlds and paths by id and events by height then transaction index, so two independent replays of the same blocks produce the same object and can be compared with a diff. That determinism is the point; see [indexer requirements](/docs/reference/indexer-requirements) for what to do with it.

For unconfirmed transactions use `state.preview(transaction)`, or wrap the state in a `MempoolOverlay` when you also want `conflictsWith` populated for fee bumps.

## When something is wrong

Everything the package throws is a `ChainBloomError` with three fields: `name` is always `ChainBloomError`, `code` is a stable string, and `details` carries the numbers behind the message.

```ts title="handle.ts"
import { ChainBloomError } from '@chainbloom/protocol';

try {
  encodeMarker(network, payload);
} catch (error) {
  if (error instanceof ChainBloomError) {
    console.error(error.code, error.details);
  }
}
```

Switch on `code`, never on `message`. Messages are written for people and may be reworded; codes are part of the contract.

## The exported surface

Every declaration the package exports, read from the generated type declarations at build time:

:::generated name=api-surface
:::
