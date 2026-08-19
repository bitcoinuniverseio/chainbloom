---
title: Indexer requirements
nav: Indexer requirements
description: What a service must do so that anyone replaying the same Bitcoin blocks rebuilds exactly the same ChainBloom history, event for event.
updated: 2026-07-31
order: 6
verified: "@chainbloom/protocol@0.1.0"
keywords: [indexer, reorg, rollback, replay, determinism, snapshot]
related: [reference/validation-rules, reference/reorganizations, reference/cli]
cta:
  title: Check your index against the package
  body: Replay the same blocks through the reference state engine and compare the two snapshots line by line.
  label: Read the CLI reference
  href: /docs/reference/cli
---

:::lead
An [[indexer]] built to these rules is interchangeable with every other one. Two operators who have never spoken publish the same worlds, the same paths, the same endings. Any reader can settle a disagreement by replaying the chain instead of trusting either of you.
:::

## What "the same history" has to mean

An index is not a database with opinions. It is a function from blocks to state.

Feed two indexers the same chain and they must return the same worlds, the same [[path|paths]], the same order of events, and the same terminal reasons. When they differ, one of them is wrong, and anybody can prove which by replaying the blocks themselves. That is the property that makes ChainBloom worth indexing at all: nobody has to be believed.

Everything below is what it costs to keep that property.

## The six rules

### Follow confirmed blocks only for state

State moves on confirmed blocks and nothing else. A transaction in the [[mempool]] has no height, no position relative to its neighbours, and no promise it will ever be mined. It must not create a world, advance a path, or end one.

This is also why the validator rejects a step whose parent is not yet buried. A [[carrier]] whose own last event landed in the same block or later fails with `UNCONFIRMED_LINEAGE_PARENT`. Lineage is built one block at a time, never inside one.

### Treat the mempool as provisional

Unconfirmed data is still worth showing (it is how a person knows their action was accepted by the network), but it must live in a separate layer that can be thrown away.

`ChainBloomState.preview()` runs the full validator against a transaction at the next height without changing anything. `MempoolOverlay.project()` adds conflict tracking: `conflictsWith` lists the other transactions spending the same [[outpoint]], which is what a fee bump looks like from outside. The overlay never creates lineage parents, so a chain of two unconfirmed steps cannot fabricate a path that does not exist yet.

Anything you serve from that layer must be labelled provisional everywhere it appears.

### Apply blocks contiguously

`applyBlock` accepts a block only when it extends the current tip: `height` is exactly one more than `tipHeight`, and `previousHash` matches `tipHash`. Anything else throws `NON_CONTIGUOUS_BLOCK`. A height that is negative or not a safe integer throws `INVALID_BLOCK_HEIGHT`.

A block is applied whole or not at all. If any transaction inside it raises, the engine restores the snapshot it took before the block started and rethrows. There is no half-applied height.

### Roll back to a common ancestor on a reorganization

When a [[reorganization]] arrives, do not patch forward. Undo.

`rollbackTip(expectedHash)` undoes exactly one block from a stored snapshot and returns the block it removed. Call it until `tipHash` is the last hash both branches share, then apply the new branch from there. Two guards keep the loop honest: `NO_BLOCK_TO_ROLLBACK` when there is nothing left to undo, and `ROLLBACK_HASH_MISMATCH` when the hash you passed is not the current tip.

A path that was advanced in an orphaned block goes back to the step it was on. A world created in an orphaned block stops existing. Both are correct: those events never happened on the chain that survived.

:::warning
Rolling back state is not the same as telling people. Anyone who saw an event before the reorganization needs to be told it is gone. A service that silently drops a world from its list has technically recovered and practically lied.
:::

### Fail closed on an invalid spend

This is the rule most likely to be got wrong, and the one that matters most.

A live path output is an ordinary Bitcoin output worth {{CARRIER_VALUE_SATS_RAW}} satoshis. Anyone holding the key can spend it into anything at all: a wallet sweep, a consolidation, a coin-control mistake. When a confirmed transaction spends a live carrier and is not a valid ChainBloom event, the engine does one thing and only one thing:

- every path that transaction spent becomes `ABANDONED`
- its `terminalReason` becomes `INVALID_CONFIRMED_SPEND`
- the spend is recorded in `invalidCarrierSpends` with its `txid`, `height`, `blockHash`, `laneIds`, and the `issueCodes` the validator produced

Nothing is invented to replace it. No substitute output is adopted, no successor is guessed, no "they probably meant this" heuristic runs. The path stops, the reason is on the record, and the world's status is recalculated. A world with no live paths left becomes `ENDED`.

An index that repairs these spends is not being helpful. It is publishing a history the chain does not contain.

### Produce a deterministic snapshot

`snapshot()` returns worlds and paths sorted by id, and events sorted by height and then by transaction index within the block. That ordering is the whole reason two independent replays can be compared with a diff.

If you serve your own JSON, sort it the same way. An index that returns rows in whatever order the database felt like is not reproducible, however correct its contents are.

## What the state engine already does

{{PACKAGE_NAME}} is not a client library that talks to someone else's index. It contains the rules, and you can run them:

| You get | From |
| --- | --- |
| Marker decoding, including every rejection | `decodeMarker`, `decodeMarkerHex` |
| Transaction parsing to txid, inputs, outputs, witness | `parseTransactionHex` |
| Every validation rule, as issue codes with paths | `validateProtocolTransaction` |
| Confirmed state, contiguity, one-block rollback | `ChainBloomState` |
| Provisional projection and conflict detection | `MempoolOverlay` |
| A deterministic snapshot of worlds, paths, events | `ChainBloomState.snapshot()` |

The engine holds all of that in memory and has no idea where blocks come from. That boundary is deliberate.

## What you have to add

### Storage

The engine keeps state in memory and keeps one snapshot per applied block so it can roll back. That is fine for a replay and wrong for a service. You need durable storage for worlds, paths, events, and invalid spends, plus enough history to roll back further than the deepest reorganization you are willing to survive.

Write the tip height and hash in the same transaction as the state it produced. If those two can disagree after a crash, your restart is a guess.

### Leadership

Two processes ingesting the same chain into the same store will interleave and corrupt it. Exactly one writer at a time (a lease, a lock, an elected leader, whatever your stack gives you), and readers that serve from the store without writing.

### An API

Decide what you expose and what it means. At minimum a reader needs: whether a given outpoint is a live path, a world with its paths, an event by txid, and your current tip height and hash. Publish the tip. A consumer cannot judge how stale you are without it.

## A working indexer exists

`index-chainbloom` implements this contract: a strict {{PROTOCOL_MAGIC}} version {{PROTOCOL_VERSION}} parser, ingestion from Bitcoin Core over JSON-RPC with ZMQ for new blocks and mempool entries, MySQL 8.4 storage, rollback to a common ancestor on a reorganization, single-leader ingestion with leases, a REST API described by OpenAPI, Socket.IO for live updates, admin API keys, Prometheus metrics, and repair, reindex, and verify commands.

:::note
The Universe-operated production deployment is live behind the InScribe
ChainBloom APIs. [What is running](/docs/help/status) lists the public status
path, its fail-closed checks, and the support boundaries that still apply.
:::

## How to check yours

Two checks, both cheap, both worth wiring into your test suite.

**Replay the same blocks through the package.** Feed your indexer and `chainbloom state replay -n <network> -f blocks.json` the same input and compare the snapshots. Any difference is your bug, because the package is the definition.

**Run the published vectors.** `chainbloom vectors verify` prints `{"valid": true, "verified": 5}` when the bundled valid markers round-trip. The invalid set matters more: your parser should reject all six for the reason given, not merely reject them.

Then force the awkward cases in a regtest chain, because they are the ones nobody writes tests for: a reorganization that removes a `CREATE`, a wallet sweep that spends a live carrier, a step whose parent is in the same block, and a world reaching `endHeightExclusive` with paths still live.
