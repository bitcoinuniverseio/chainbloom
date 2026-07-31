---
title: Confirmed and unconfirmed activity
nav: Confirmed and unconfirmed
description: How to tell a real moment from a hopeful one, why an unconfirmed step can vanish or change position, and what a broadcast receipt is actually worth.
socialTitle: Confirmed and unconfirmed activity in ChainBloom
socialDescription: Previews, replacements, reorganizations, and a rule of thumb for anything that matters.
updated: 2026-07-31
order: 6
keywords: [unconfirmed, mempool, preview, reorg, replacement, broadcast, pending]
related: [learn/bitcoin-and-shared-order, participate/fees-and-confirmation, reference/reorganizations]
cta:
  title: Get your step confirmed the first time
  body: What a fee rate actually buys, how long to expect to wait, and what to do when a step sits there.
  label: Fees and confirmation
  href: /docs/participate/fees-and-confirmation
---

:::lead
Almost every confusing moment in ChainBloom happens in the gap between "I sent it" and "it is in a block". This page tells you what is real in that gap, what is only likely, and one habit that will keep you from ever being caught out by the difference.
:::

## A preview is a good guess, not a small confirmation

The protocol keeps these two things in separate places on purpose.

Confirmed state is built only from blocks. When a world is replayed, blocks are applied one at a time, and a block is refused unless it extends the current tip — right height, matching previous hash — with the error `NON_CONTIGUOUS_BLOCK`. Nothing that has not been mined ever enters that picture.

Unconfirmed activity is handled by a separate overlay that projects what *would* happen if a transaction confirmed right now. It produces a preview: the [[txid]], whether the transaction is valid, which paths it touches, and any issue codes. It is a projection sitting on top of the real state, never part of it.

Two properties of that overlay are worth knowing, because they explain most of what you will see.

**It never invents a parent.** If you build a step on a step that has not confirmed yet, the overlay will not pretend the link exists. Your second step does not preview as valid history; it previews as something with nothing to attach to. This is the same rule as `UNCONFIRMED_LINEAGE_PARENT`, applied before you spend anything.

**It tracks conflicts.** Every preview carries a `conflictsWith` list: other unconfirmed transactions that spend the same outpoint. If two transactions both try to move the same [[carrier]], both can sit in the pool, and only one can ever be mined. The overlay tells you this rather than hiding it.

## Why a preview can vanish or change position

An unconfirmed transaction has no place in the order. It is a request. Four ordinary things can happen to it.

**It can be replaced.** Every input of every ChainBloom transaction uses sequence {{RBF_SEQUENCE_HEX}}, which tells the network that a [[rbf|replacement]] paying a higher fee may take its place. That is deliberate — it is how you rescue a step that is stuck at a low fee rate. It also means an unconfirmed step you are looking at can be superseded by a different one, spending the same carrier, with different numbers in it.

**It can be dropped.** A [[mempool]] is not storage. A node that runs out of room evicts the cheapest transactions, and a node that restarts may forget yours entirely. Nothing is owed to an unconfirmed transaction.

**It can confirm in a different position than you expect.** Two people stepping at the same time have no agreed order until a miner picks one. Within a block, order comes from the transaction index, which nobody bid for.

**It can confirm and still fail.** This is the one that surprises people. A transaction that spends a live carrier is not automatically a ChainBloom event. If it confirms and is not valid under the rules, the path it spent becomes **abandoned**, with the reason `INVALID_CONFIRMED_SPEND`, and the spend is recorded as an invalid carrier spend. Nothing is invented to replace the path. The {{CARRIER_VALUE_SATS}} satoshis went somewhere, and the path is over.

:::warning
This is why the review screen matters more than the broadcast button. An unconfirmed mistake can usually be replaced. A confirmed one is permanent, and it can end a path that took months to build.
:::

## What a broadcast receipt does and does not mean

When an application says "broadcast" and shows you a transaction id, here is exactly what you have.

**What it means.** The transaction is fully formed and signed. At least one node accepted it and put it in its pool. It is now visible to the network and eligible to be mined. That is a real and necessary step.

**What it does not mean.** It does not mean the transaction is in a block. It does not mean it will be. It does not mean your step exists in any world's history, because history is built from blocks only. And the id itself is not evidence of anything: a txid is computed from the transaction's own bytes, so it can be produced before broadcasting and shown by anyone. A screenshot of a receipt is not proof that an event happened.

The only thing that settles the question is a block. Look the transaction up on chain, get a height, and then it is real.

:::note
There is no public ChainBloom index switched on today, so there is no live place to browse confirmed worlds yet. [What is running](/docs/help/status) says exactly where things stand. Until then, confirmation is checked the ordinary Bitcoin way: find the transaction in a block.
:::

## When the chain changes its mind

Even a confirmed block is not absolutely final in its first moments. Two miners can find a block at the same height at nearly the same time. The network briefly holds both, then keeps whichever line gets built on first, and the other block is discarded. This is a [[reorganization]], and it is a normal part of how Bitcoin works rather than a fault.

:::simulation
The walkthrough below is invented. The public index is not switched on, so there is no live activity to show.
:::

:::demo name=reorg-demo
**A one-block reorganization, step by step.**

1. Your Bloom is mined in a block. Call it block N. Everything looks settled: the step has a height, the path's step count went up, and a reader replaying the chain sees your moment in place.
2. A competing block is found at the same height, by a different miner, containing a different set of transactions. For a short time two versions of block N exist on the network.
3. The next block is built on the competing one. That line is now longer, so it wins. Your block N is discarded — it is called a stale block.
4. Every reader must undo it. A correct index rolls the tip back exactly one block, restoring the state it had before, then applies the new blocks in order. The protocol's own state object does this with a stored snapshot, and refuses to roll back the wrong block: if the hash you name does not match the tip, it fails with `ROLLBACK_HASH_MISMATCH`.
5. Your transaction is usually still valid and still in the pool, so it is normally mined again in a later block. But it may now sit at a different height, and at a different position within that block, than it did before.

What changed: the position of your moment. What did not change: the rules. After the dust settles, everyone replaying the chain again reaches the same answer — the new one.
:::

The deeper the block, the more work an attacker would have to outrun to reverse it, which is why patience is the entire security model for anything that matters. The mechanics of rollback and re-application are covered in [reorganizations](/docs/reference/reorganizations).

## How a careful application shows the difference

You can judge software by this, and you should. An application that handles the confirmed and unconfirmed gap well will:

- Label unconfirmed steps as unconfirmed, in words, not by a faint colour difference.
- Show the block height and the number of confirmations for anything it calls history.
- Keep previewed steps visually separate from confirmed ones, rather than mixing them into one list sorted by time.
- Warn you when a step you are building depends on a parent that has not confirmed yet, before you sign.
- Tell you when a transaction conflicts with another one you broadcast, rather than showing two hopeful steps side by side.
- Say plainly when a step was replaced, and by what.

No wallet has ChainBloom support today, so treat that list as what to ask for from wallet and [[explorer]] authors, and as what to check in anything that claims support later.

## A rule of thumb you can keep

:::tip
Treat anything unconfirmed as a draft. It is a request, not a fact, and it can be replaced, dropped or reordered without anyone's permission.

For a moment that matters — a meeting you arranged with someone, the close of a long path, the creation of a world other people are about to join — come back a few blocks later and look again. Confirm the height, confirm the position, then tell people it happened.
:::

That habit costs you an hour of patience and removes an entire category of unpleasant surprise. It is also the honest thing to do, because until a block holds your step, there is genuinely nothing there yet.
