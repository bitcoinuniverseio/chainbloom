---
title: Data structures
description: Every field of WorldState, LaneState, EventState and the rest, with the exact rule behind each lane status and world status.
updated: 2026-07-31
order: 3
verified: "@chainbloom/protocol@0.1.0"
keywords: [types, worldstate, lanestate, eventstate, snapshot, status, lane id]
related: [reference/validation-rules, reference/reorganizations, reference/indexer-requirements]
cta:
  title: See how these are produced
  body: The rules that decide whether a transaction becomes an event at all, and which lanes it touches.
  label: Validation rules
  href: /docs/reference/validation-rules
---

:::lead
These are the shapes your database, your API, and your user interface will end up mirroring. Get the identifiers and the statuses right and two independent services describe the same world in the same words. Every field below is copied from [src/types.ts](repo:src/types.ts).
:::

## Identity first

Two identifiers carry the whole model, and both are derived rather than assigned.

**A world id is the txid of its CREATE transaction.** There is no counter, no registry, and no chance of a collision. Lowercase hex, 64 characters.

**A lane id is `<worldId>:<laneNumber>`.** Lane numbers start at 0 and run to `laneCount - 1`, matching output order in the CREATE: the [[path]] rooted at `vout 1` is lane `0`. The helper is `laneId(worldId, laneNumber)` in [src/validator.ts](repo:src/validator.ts), and it lowercases the txid, so ids compare as plain strings.

**An outpoint key is `txid:vout`.** Same shape, different meaning. `outpointKey` builds it, and the state engine uses it to answer the one question that matters on every transaction: does this input spend a live [[carrier]]?

:::note
Because a lane id is text, sorting lane ids is a string sort. That is not a detail you can skip: a [[meeting]] requires its two path inputs in lexicographic lane id order, so the world txid is compared first and the lane number second, as characters. Lane `10` sorts before lane `2`.
:::

## The world and its paths

### WorldState

Everything fixed at creation, plus the status that follows from height.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | The txid of the CREATE |
| `network` | `NetworkId` | 0 mainnet, 1 testnet4, 2 signet, 3 regtest |
| `ruleset` | `1` | Always {{RULESET_VERSION}} in this version |
| `laneCount` | `number` | {{MIN_LANES}} to {{MAX_LANES}} |
| `durationBlocks` | `number` | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} |
| `maxSteps` | `number` | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}}, per path |
| `seed` | `string` | {{SEED_BYTES}} bytes as hex |
| `title` | `string` | Up to {{MAX_TITLE_BYTES}} ASCII bytes, possibly empty |
| `createdHeight` | `number` | The block that confirmed the CREATE |
| `endHeightExclusive` | `number` | `createdHeight + durationBlocks` |
| `status` | `WorldStatus` | ACTIVE, ENDED, or EXPIRED |
| `laneIds` | `readonly string[]` | One id per lane, in lane order |

`endHeightExclusive` is exclusive, as the name says. A world created at height 812,000 with `durationBlocks` of 1,008 ends at 813,008: the last height at which a step can confirm is 813,007.

### LaneState

One row per [[path]]. This is the record your application will read most often.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | `<worldId>:<laneNumber>` |
| `worldId` | `string` | The world this path belongs to |
| `laneNumber` | `number` | From 0 |
| `status` | `LaneStatus` | LIVE, CLOSED, ABANDONED, or EXPIRED |
| `currentOutpoint` | `Outpoint` | Null once the path is no longer LIVE |
| `currentScriptPubKeyHex` | `string` | Null once the path is no longer LIVE |
| `stepCount` | `number` | Compared against the world's `maxSteps` |
| `createdHeight` | `number` | The height of the CREATE |
| `lastEventHeight` | `number` | Height of the most recent event on this path |
| `eventTxids` | `readonly string[]` | Every event, in order, starting with the CREATE |
| `terminalTxid` | `string` | Null while LIVE |
| `terminalReason` | `string` | Null while LIVE |

`stepCount` starts at 0 for a root path even though `eventTxids` already holds the CREATE txid. The CREATE is not a step: it opens the path rather than moving it.

## Events and what they record

### EventState

One row per confirmed, valid ChainBloom transaction.

| Field | Type | Notes |
| --- | --- | --- |
| `txid` | `string` | The event id |
| `network` | `NetworkId` | The network of the view that recorded it |
| `operation` | `OperationName` | CREATE, BLOOM, GRAFT, RENDEZVOUS, or CLOSE |
| `payload` | `OperationPayload` | The decoded fields of that operation |
| `height` | `number` | The block that confirmed it |
| `txIndex` | `number` | Position within the block |
| `blockHash` | `string` | The block it belongs to |
| `worldIds` | `readonly string[]` | Usually one, two when a meeting crosses worlds |
| `laneIds` | `readonly string[]` | The paths this event touched |
| `parentOutpoints` | `readonly Outpoint[]` | The carriers it spent, empty on a CREATE |
| `successorOutpoints` | `readonly Outpoint[]` | The carriers it created, empty on a CLOSE |
| `graftTargetTxid` | `string` | The echo target, null on every other operation |

`height` and `txIndex` together are the sort key for history. They are why two services that read the same blocks list the same events in the same order without talking to each other.

### InvalidCarrierSpend

A path can also end by accident, and that is recorded rather than hidden.

| Field | Type | Notes |
| --- | --- | --- |
| `txid` | `string` | The confirmed transaction that spent a live carrier |
| `height` | `number` | Where it confirmed |
| `blockHash` | `string` | Which block |
| `laneIds` | `readonly string[]` | Every path it ended |
| `issueCodes` | `readonly string[]` | Why it was not a valid event |

When this happens the lanes become `ABANDONED` with `terminalReason` set to `INVALID_CONFIRMED_SPEND`. Nothing is invented to replace them. Keeping the spend, with its issue codes, is what lets you explain to a participant exactly what happened.

### SuccessorMapping

Produced by validation, consumed when the event is applied. It says which output continues which path.

| Field | Type | Notes |
| --- | --- | --- |
| `laneId` | `string` | The path being advanced |
| `inputIndex` | `number` | Which input held its old carrier |
| `outputIndex` | `number` | Which output holds its new one |
| `outpoint` | `Outpoint` | The new carrier, as txid and vout |
| `scriptPubKeyHex` | `string` | The new carrier script |

## Reading a whole view

### StateSnapshot

What `snapshot()` returns, and what a restore puts back.

| Field | Type | Notes |
| --- | --- | --- |
| `tipHash` | `string` | Null before any block has been applied |
| `tipHeight` | `number` | Null before any block has been applied |
| `worlds` | `readonly WorldState[]` | Sorted by id |
| `lanes` | `readonly LaneState[]` | Sorted by id |
| `events` | `readonly EventState[]` | Sorted by height, then by `txIndex` |
| `invalidCarrierSpends` | `readonly InvalidCarrierSpend[]` | In the order they were seen |

That sorting is deliberate. Two services that applied the same blocks produce byte-identical snapshots, which makes a snapshot something you can diff, hash, or compare across machines.

### MempoolProjection

What an unconfirmed transaction looks like. A projection, never history.

| Field | Type | Notes |
| --- | --- | --- |
| `txid` | `string` | The waiting transaction |
| `valid` | `boolean` | Whether it would be valid at the next height |
| `conflictsWith` | `readonly string[]` | Other waiting transactions spending the same outpoint |
| `laneIds` | `readonly string[]` | The paths it would touch |
| `issueCodes` | `readonly string[]` | Empty when valid |

`MempoolOverlay` in [src/state.ts](repo:src/state.ts) never creates lineage parents. A step whose parent is still in the [[mempool]] does not become spendable-from just because both are waiting.

### ValidationResult

What `validateProtocolTransaction` hands back.

| Field | Type | Notes |
| --- | --- | --- |
| `valid` | `boolean` | True only when `issues` is empty |
| `marker` | `DecodedMarker` | Null when the marker could not be decoded at all |
| `issues` | `readonly ValidationIssue[]` | Each with a `code`, a `message`, and a `path` |
| `carrierLaneIds` | `readonly string[]` | Live paths this transaction spends |
| `successorMappings` | `readonly SuccessorMapping[]` | Path continuations it creates |

`carrierLaneIds` is populated even when `valid` is false, and that is the field that turns a bad transaction into abandoned paths rather than a silent gap.

## Statuses, and the exact rule for each

### Lane statuses

| Status | The rule |
| --- | --- |
| `LIVE` | The path holds an unspent carrier and can be advanced |
| `CLOSED` | A valid CLOSE spent the carrier. `terminalReason` is `CLOSE_` plus the one-byte reason |
| `ABANDONED` | A confirmed transaction spent the live carrier and was not a valid event. `terminalReason` is `INVALID_CONFIRMED_SPEND` |
| `EXPIRED` | A block arrived at or above `endHeightExclusive` while the path was LIVE. `terminalReason` is `WORLD_DURATION_ELAPSED` |

Three of those four are terminal endings with different meanings, and it is worth carrying that difference into your interface. Closed is a decision. [[expired]] is the ending the creator chose at the start. [[abandoned]] is a mistake, and it is the only one worth warning people about in advance.

### World statuses

| Status | The rule |
| --- | --- |
| `ACTIVE` | At least one lane is still LIVE and the height has not reached `endHeightExclusive` |
| `ENDED` | Every lane has stopped, but the world's own duration has not run out |
| `EXPIRED` | A block arrived at or above `endHeightExclusive`. Every LIVE lane expired with it |

Expiry wins. `refreshWorldStatus` skips a world that is already EXPIRED, so a world never travels back from EXPIRED to ENDED. A world can reach ENDED early, when the last path is closed or abandoned before its time runs out.

:::tip
Store `endHeightExclusive` rather than a date. Blocks are the only clock the protocol has, and turning a height into a wall-clock time is a display choice your interface makes, not a fact the chain states.
:::
