---
title: Reorganizations
description: How a ChainBloom view stays correct when Bitcoin replaces its newest blocks: contiguous apply, one-block rollback, and replay from a common ancestor.
updated: 2026-07-31
order: 5
verified: "@chainbloom/protocol@0.1.0"
keywords: [reorg, rollback, replay, applyblock, determinism, tip, snapshot]
related: [reference/data-structures, reference/indexer-requirements, reference/reliability]
cta:
  title: Build the service around it
  body: What an indexer must do end to end to serve the same history as every other honest reader.
  label: Indexer requirements
  href: /docs/reference/indexer-requirements
---

:::lead
Bitcoin occasionally throws away its newest block and uses a different one. If your service treats that as an error, it will drift from every other reader and slowly start lying to people. Handled properly it is a non-event, and this page is the whole of proper handling.
:::

## What actually happens

A [[reorganization]] is Bitcoin replacing one or more of its most recent blocks with a different branch. Almost always it is one block deep and resolves within minutes. The transactions in the replaced block are not destroyed; most are simply mined again in the new branch, often at a different height and a different position in the block.

For ChainBloom that has three consequences.

An [[event]] can lose its block. A `BLOOM` confirmed at height 812,455 may, a minute later, not be confirmed anywhere.

A [[path]] can move backwards. If a step is undone, the path returns to its previous [[carrier]], its `stepCount` drops, and its `lastEventHeight` goes back.

An ending can be undone. A path marked `ABANDONED` because a confirmed transaction spent its carrier goes back to `LIVE` if that transaction leaves the chain. A world marked `EXPIRED` because the tip crossed `endHeightExclusive` becomes `ACTIVE` again if the tip falls back below it.

None of that is a special case in the code. It falls out of the way state is applied.

## applyBlock is contiguous and all-or-nothing

`ChainBloomState.applyBlock` in [src/state.ts](repo:src/state.ts) accepts a block only if it extends the current tip.

- If the height is not a non-negative safe integer, it throws `INVALID_BLOCK_HEIGHT`.
- If a tip already exists and the block's height is not `tipHeight + 1`, or its `previousHash` is not `tipHash`, it throws `NON_CONTIGUOUS_BLOCK`.

That is the guard rail. You cannot skip a block, apply one twice, or splice in a block from another branch. If your ingest loop ever sees `NON_CONTIGUOUS_BLOCK`, it has not hit a bug: it has been told, precisely, that the chain moved and it needs to roll back before it can go forward.

Inside the block, everything is atomic. `applyBlock` takes a snapshot before it touches anything, then processes each transaction in order. If anything throws part way through, the snapshot is restored and the error is rethrown. A half-applied block is not a state the engine can be left in, so a crash mid-block cannot leave you with three of five events recorded.

:::note
Expiry happens at the top of `applyBlock`, before its transactions. Any world whose `endHeightExclusive` is at or below the new height becomes `EXPIRED`, and its LIVE paths become `EXPIRED` with `terminalReason` of `WORLD_DURATION_ELAPSED`. The ids are returned in `expiredLaneIds` so you can act on them without diffing.
:::

## rollbackTip undoes exactly one block

`rollbackTip(expectedHash?)` is the only way back, and it moves one block at a time.

- With no argument it undoes the current tip and returns the `IndexedBlock` that was removed.
- With an `expectedHash` it first checks that the hash is the current tip, and throws `ROLLBACK_HASH_MISMATCH` if it is not.
- With no applied block to undo, it throws `NO_BLOCK_TO_ROLLBACK`.

It works by restoring the snapshot taken before that block was applied, so the result is not a reversal computed from the events; it is the earlier state itself. There is no undo logic per operation to get wrong.

Always pass `expectedHash`. It costs nothing and it turns a wrong-branch bug into an exception at the moment it happens rather than a quiet divergence you notice a week later.

## Rolling back to a common ancestor

The full procedure, when your Bitcoin node tells you the chain has changed:

:::steps
### Find the common ancestor

Walk back from your tip, comparing your stored block hash at each height against the node's hash for that height. The highest height where the two agree is the common ancestor. On a one-block reorganization this is your tip minus one.

### Roll back to it, one block at a time

Call `rollbackTip(expectedHash)` repeatedly, passing the hash you believe is the tip each time, until `tipHash` equals the ancestor's hash. Each call is exact and each is checked.

### Apply the new branch in order

Call `applyBlock` for each block of the new branch, lowest height first. Contiguity is enforced on every call, so a gap or an out-of-order block is refused rather than absorbed.

### Re-project the mempool

Confirmed state and the mempool overlay are separate. After the branch changes, clear and re-project the waiting transactions, because a transaction that was valid against the old tip may not be against the new one.
:::

If you have applied blocks since the last `reset()`, the engine holds a snapshot for each of them, so you can walk back as far as that history goes. `replay(blocks)` resets and applies a whole list from scratch, which is what to use when a reorganization is deeper than the history you hold, or when you simply want to rebuild from a checkpoint and compare.

## Watch a block get replaced

:::demo name=reorg-demo
Without scripts, follow the same worked example in words. The heights and events below are invented to make the sequence concrete. Three blocks have been applied: 812,453 holding a `CREATE` and one `BLOOM`, 812,454 holding two more blooms, and 812,455 holding a [[meeting]].

Bitcoin now replaces 812,455. Your node reports a different hash at that height, and your stored hash for 812,454 still matches, so 812,454 is the common ancestor.

You call `rollbackTip` with the hash you have for 812,455. The engine restores the snapshot taken before that block: the meeting is no longer an event, both paths return to the carriers they held at the end of 812,454, and both `stepCount` values drop by one. Your tip is 812,454 again.

You then apply the replacement block at 812,455. If the meeting was mined again there, it becomes an event once more, possibly at a different `txIndex`. If it was not, it goes back to being a waiting transaction, and anyone who was shown it as confirmed must now be shown otherwise.

Nothing about that sequence is unusual, and nothing about it needs a human. The only real failure would have been showing the meeting as permanent while it was one block old.
:::

:::tip
Decide how many confirmations your product calls settled, say it out loud in the interface, and apply it consistently. One block is a reasonable working answer for a shared story. Zero is not, because a waiting transaction can still be replaced.
:::

## Why determinism is the whole point

A reorganization is only survivable because two views that have applied the same blocks are byte-for-byte identical. `snapshot()` makes that true by construction:

- worlds sorted by `id`
- lanes sorted by `id`
- events sorted by `height`, then by `txIndex`

None of that ordering is cosmetic. It means you can hash a snapshot and compare it with another operator's, diff two services to find where they diverged, and replay the same block range twice and get the same answer. A view that ordered events by arrival time or by database insertion would look correct until the first reorganization and then quietly disagree with everyone else.

This is also why nothing in the state engine reads a clock, a random number, or a network service. The only inputs are blocks. The same blocks always produce the same worlds, which is what lets independent services agree without ever talking to each other -- and that agreement, not any single website, is what makes a ChainBloom history durable.
