---
title: Indexers and operators
nav: Indexers and operators
description: What it takes to serve the same ChainBloom history as everyone else: a Bitcoin node, deterministic replay, rollback on reorganization, and failing closed on an invalid spend.
updated: 2026-07-31
order: 11
keywords: [indexer, bitcoin node, replay, reorg, rollback, operations, monitoring]
related: [reference/indexer-requirements, reference/reorganizations, reference/validation-rules]
cta:
  title: Read the indexer requirements
  body: Ingest, ordering, storage, rollback, and the behaviour a conforming index must have.
  label: Open indexer requirements
  href: /docs/reference/indexer-requirements
---

:::lead
An [[indexer]] that disagrees with another indexer is worse than no indexer at all, because both look authoritative. ChainBloom is built so agreement is achievable by construction: the same blocks in, the same history out, with no room for house style.
:::

## What "the same history" means

Determinism here is a property you can test, not an aspiration. `snapshot()` returns worlds and lanes sorted by id, and [[event|events]] sorted by [[block height]] and then by transaction index within the block. Ids are not chosen by you: a world id is the txid of the transaction that created it, and a path id is `<worldId>:<laneNumber>`, numbered from zero.

Two implementations reading the same chain therefore produce identical output. Any difference is a bug in one of them, not a matter of interpretation. Make that comparison part of your test suite rather than something you run after a complaint.

## What you need to run

- **A Bitcoin node you trust.** You need block order and you need previous outputs, because validation depends on the value and script of the output every input spends. A node without that history is not enough.
- **Confirmed ingest, and optionally mempool.** Confirmed state is the product. A mempool view is a convenience and must be labelled as one everywhere it appears.
- **Contiguous application.** `applyBlock` requires the block to extend the current tip (height plus one, with a matching previous hash) and throws `NON_CONTIGUOUS_BLOCK` otherwise. If anything fails part way through a block, the state restores the snapshot taken before that block. Never half-apply.
- **Somewhere to put it.** The reference implementation uses Bitcoin Core JSON-RPC with ZMQ for notifications, MySQL 8.4 for storage, REST with an OpenAPI description, Socket.IO for live updates, and repair, reindex, and verify commands. None of those choices are required by the protocol.
- **One writer.** The reference implementation elects a single ingest leader using leases. Two processes writing one index is how histories diverge.

## Rollback is routine, not an incident

A [[reorganization]] is ordinary and your index must survive one without a human. `rollbackTip(expectedHash?)` undoes exactly one block from a stored snapshot. It throws `NO_BLOCK_TO_ROLLBACK` when there is nothing to undo and `ROLLBACK_HASH_MISMATCH` when the hash you named is not the tip. Roll back one block at a time to the common ancestor, then apply the new chain forward.

Two consequences for anyone reading your API: an event can move to a different height or disappear entirely, and a path that looked closed can become live again. Return the tip height and hash on every response so a client can tell when it is holding a stale view.

## Fail closed

The hard rule. When a confirmed transaction spends a live carrier and is not a valid ChainBloom event, every path it spent becomes [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`, and the spend is recorded in `invalidCarrierSpends`. Nothing is invented to replace it.

Do not be helpful here. Do not guess which action was meant, do not reconstruct a plausible successor, and do not skip the spend because it looks like an accident. It probably was an accident. Recording it exactly is the whole job.

The same applies upstream. A marker carrying a reserved network or a reserved [[opcode]] is not a ChainBloom event and must not be stored as an unknown one. The codec throws `RESERVED_NETWORK` and `RESERVED_OPCODE` for exactly this reason.

:::note
The hosted index is not switched on today. `GET https://inscribe.bitcoinuniverse.io/api/chainbloom/status` returns HTTP 503 because no indexer URL is configured. If you run one, you are not duplicating a working service. [What is running](/docs/help/status) is kept current.
:::

## Before you serve public data

:::checklist id=indexer-readiness
- Replay a fixed block range and compare snapshots against a second implementation
- Prove a rollback end to end: apply, reorganise, roll back to the common ancestor, replay, compare
- Confirm a failure part way through a block leaves no partial state behind
- Verify against the published marker vectors, both the valid and the invalid ones
- Return tip height and tip hash with every response
- Mark mempool-derived data as unconfirmed inside the payload, not only in your documentation
- Alert on ingest lag and on any snapshot mismatch, and stop serving rather than serve a divergent history
:::

Next: [Reorganizations](/docs/reference/reorganizations) has the rollback path in detail, including what to tell clients when history changes underneath them.
