---
title: Transaction lifecycle
description: Where every input and output must sit in a ChainBloom transaction, operation by operation, with the value and script type each position requires.
updated: 2026-07-31
order: 2
verified: "@chainbloom/protocol@0.1.0"
keywords: [transaction, psbt, inputs, outputs, vin, vout, carrier, segwit]
related: [reference/protocol-architecture, reference/validation-rules, reference/data-structures]
cta:
  title: Then check it the way an indexer will
  body: Every rule the validator applies, grouped and named by the issue code it emits.
  label: Validation rules
  href: /docs/reference/validation-rules
---

:::lead
ChainBloom does not search a transaction for meaning. Each operation has fixed positions, and a transaction either sits in them or is not an event. Build against the tables on this page and your transaction will be read the same way by every indexer, first time.
:::

## What every action shares

Five rules apply to all {{OPERATION_COUNT}} operations, whichever one you are building.

**Version {{TX_VERSION}}.** Every ChainBloom transaction uses transaction version {{TX_VERSION}}.

**Every input signals replacement.** Every `nSequence`, on carrier inputs and fee inputs alike, must be exactly {{RBF_SEQUENCE_HEX}}. One input with a different sequence raises `NON_CANONICAL_SEQUENCE`. This is not a preference: a waiting contribution must stay replaceable, so [[rbf]] is part of the shape rather than an option.

**No input twice.** The same outpoint appearing at two positions raises `DUPLICATE_INPUT`.

**The [[marker]] owns `vout 0`.** Zero satoshis, one minimal `OP_RETURN` push, exactly one ChainBloom-looking output in the whole transaction. See [protocol architecture](/docs/reference/protocol-architecture) for the byte layout.

**Path outputs are exact.** Every [[carrier]] output, root or successor, is exactly {{CARRIER_VALUE_SATS_RAW}} satoshis and a standard P2TR script: {{P2TR_SCRIPT_BYTES}} bytes beginning `0x51 0x20`. A different value raises `INVALID_CARRIER_VALUE`; a different script type raises `INVALID_CARRIER_SCRIPT`. There is no rounding and no tolerance.

:::note
Fee inputs must spend native SegWit outputs: P2WPKH (22 bytes, `0x00 0x14`), P2WSH (34 bytes, `0x00 0x20`), or P2TR ({{P2TR_SCRIPT_BYTES}} bytes, `0x51 0x20`). Anything else raises `NON_NATIVE_SEGWIT_FEE_INPUT`. The validator also needs prevout context for each fee input, or it raises `MISSING_PREVOUT`.
:::

## CREATE

`CREATE` opens a world. It spends no path because none exist yet, and it creates one root output for every lane the marker declares.

| Position | Contents | Rule |
| --- | --- | --- |
| `vin 0` and up | Fee inputs only | Native SegWit. Spending a live carrier raises `CREATE_SPENDS_CARRIER` |
| `vout 0` | The marker | Zero satoshis |
| `vout 1` to `vout laneCount` | Root path outputs, one per lane | {{CARRIER_VALUE_SATS_RAW}} satoshis, P2TR. A missing one raises `MISSING_ROOT_CARRIER` |
| `vout laneCount + 1` and up | Change and anything else you need | May not contain a second ChainBloom marker |

Lane numbering follows output order and starts at 0, so the lane at `vout 1` is lane `0`. Once the transaction confirms at height `h`, its txid becomes the world id, every lane id becomes `<worldId>:<laneNumber>`, and `endHeightExclusive` is set to `h + durationBlocks`.

## BLOOM and GRAFT

These two move one [[path]] forward by one step, and they have the same shape. `BLOOM` adds a moment; `GRAFT` adds a moment that names an earlier confirmed event.

| Position | Contents | Rule |
| --- | --- | --- |
| `vin 0` | The live carrier of the path being advanced | Must be the only recognised carrier input, or `CARRIER_INPUT_MAPPING` |
| `vin 1` and up | Fee inputs | Native SegWit |
| `vout 0` | The marker | Zero satoshis |
| `vout 1` | The successor path output | {{CARRIER_VALUE_SATS_RAW}} satoshis, P2TR. Missing raises `MISSING_CARRIER_OUTPUT` |
| `vout 2` and up | Change | Optional |

`GRAFT` carries one extra obligation. Its `targetEventTxid` must name an event the indexer already knows (`UNKNOWN_GRAFT_TARGET`), on the same network (`GRAFT_NETWORK_MISMATCH`), confirmed in a strictly earlier block (`UNCONFIRMED_GRAFT_TARGET`). The target may be on any path in any world, including the one you are standing on.

After confirmation the lane's `stepCount` rises by one, `currentOutpoint` moves to `vout 1`, and the txid is appended to `eventTxids`.

## RENDEZVOUS

A [[meeting]] is the only operation that touches two paths, and the only one where input order is part of the rules.

| Position | Contents | Rule |
| --- | --- | --- |
| `vin 0` | The carrier whose lane id sorts first | Ordering is checked, see below |
| `vin 1` | The other carrier | Raises `RENDEZVOUS_LANE_ORDER` if out of order |
| `vin 2` and up | Fee inputs | Native SegWit |
| `vout 0` | The marker | Zero satoshis |
| `vout 1` | Successor for the path spent at `vin 0` | {{CARRIER_VALUE_SATS_RAW}} satoshis, P2TR |
| `vout 2` | Successor for the path spent at `vin 1` | {{CARRIER_VALUE_SATS_RAW}} satoshis, P2TR |
| `vout 3` and up | Change | Optional |

The two carriers must sit at `vin 0` and `vin 1` and nowhere else, and their lane ids must be in lexicographic order. Lane ids are `<worldId>:<laneNumber>` strings, so ordering compares the world txid first and the lane number second, as text. The validator uses `localeCompare` and rejects anything that is not strictly increasing.

Both paths advance. Neither is merged into the other, nothing is swapped, and each keeps its own successor output.

:::tip
Do not sort the inputs yourself if you can avoid it. `buildRendezvousPsbt` in [src/builders.ts](repo:src/builders.ts) sorts the two participants by lane id before it lays out the transaction, which removes the single most common way to build an invalid meeting.
:::

## CLOSE

`CLOSE` ends a path on purpose. It is the only operation that spends a carrier and creates no successor.

| Position | Contents | Rule |
| --- | --- | --- |
| `vin 0` | The live carrier of the path being ended | Must be the only recognised carrier input |
| `vin 1` and up | Fee inputs | Native SegWit |
| `vout 0` | The marker | Zero satoshis |
| `vout 1` and up | Change | There is no successor output |

The {{CARRIER_VALUE_SATS_RAW}} satoshis that were riding the path are released into whatever you build here, minus the miner fee. After confirmation the lane's status becomes `CLOSED`, `currentOutpoint` becomes null, and `terminalReason` is set to `CLOSE_` followed by the one-byte reason from the payload.

`CLOSE` is also the one action still permitted after a path reaches `maxSteps`. A path is never trapped: you can always end it deliberately.

## Building one

The five builders in [src/builders.ts](repo:src/builders.ts) produce exactly the layouts above.

| Builder | Operation |
| --- | --- |
| `buildCreatePsbt` | `CREATE` |
| `buildBloomPsbt` | `BLOOM` |
| `buildGraftPsbt` | `GRAFT` |
| `buildRendezvousPsbt` | `RENDEZVOUS` |
| `buildClosePsbt` | `CLOSE` |

Each returns an unsigned `bitcoinjs-lib` [[psbt]] at version {{TX_VERSION}} with every input sequence already set to {{RBF_SEQUENCE_HEX}}. Carrier inputs you pass in must already be {{CARRIER_VALUE_SATS_RAW}}-satoshi P2TR outputs (`INVALID_CARRIER_INPUT`), fee inputs must be native SegWit (`NON_NATIVE_SEGWIT_INPUT`), and any extra output you add may not contain a second ChainBloom marker (`DUPLICATE_MARKER_OUTPUT`).

:::warning
A builder checks shape, not intent. It will happily build a `CLOSE` for a path you meant to continue. Read the operation, the lane ids, and the output values in your wallet before you sign, because a confirmed action cannot be undone by anyone.
:::

## What happens after you broadcast

While the transaction waits in the [[mempool]] it is a projection, not history. `ChainBloomState.preview` and `MempoolOverlay.project` will tell you whether it *would* be valid at the next height, and `conflictsWith` lists any other transaction spending the same outpoint. Neither creates a lineage parent: a step whose parent is still unconfirmed is never treated as settled.

Confirmation is what fixes it. And one rule catches almost everyone the first time: a path's parent event must be confirmed in a **strictly earlier block** than its child. Two steps on the same path in the same block raises `UNCONFIRMED_LINEAGE_PARENT`, and that includes a `BLOOM` on a root path in the same block as its own `CREATE`.
