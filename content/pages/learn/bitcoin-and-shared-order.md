---
title: How Bitcoin confirmations create shared ordering
nav: Bitcoin and shared order
description: Bitcoin is in ChainBloom for one job: letting strangers agree on what came first, with no referee and no host to trust.
socialTitle: How Bitcoin gives ChainBloom a shared order
socialDescription: Blocks as a clock everyone can read, why a step waits for its parent, and why none of this is about money.
updated: 2026-07-31
order: 5
keywords: [bitcoin, confirmation, block, ordering, timestamp, why bitcoin, no money]
related: [learn/confirmed-and-unconfirmed, reference/transaction-lifecycle, help/faq]
cta:
  title: The other half of the story
  body: What a preview is, why it can change, and how to tell a draft from a settled moment.
  label: Confirmed and unconfirmed activity
  href: /docs/learn/confirmed-and-unconfirmed
---

:::lead
You do not need to understand Bitcoin to take part in a [[world]], but ten minutes here will explain the one thing that makes ChainBloom different from every shared album, thread and document you have used. It is not storage. It is agreement about order.
:::

## The question nobody can answer alone

Two people add a moment to a shared story at the same instant, from different cities. Which one came first?

You cannot settle this by asking each person, because both are honest and both saw their own first. You cannot settle it by clock, because computer clocks disagree and can be set to anything. Usually a company settles it: a server takes both, decides an order, and everyone accepts the answer because there is nowhere else to look.

That works, right up until it does not. The server's order is only as durable as the company, the database backup, and the willingness of whoever runs it to leave the record alone. If the answer to "what came first" can be edited later by one party, then the history was never really shared. It was borrowed.

So the question is: can a group of strangers agree on an order, permanently, with no referee?

## Blocks are a clock everyone can read

Bitcoin answers exactly that question, and it answers it continuously, for everyone, without being asked.

Bitcoin collects transactions into **blocks**. Each block points at the one before it, so the blocks form a single line. Roughly every ten minutes, on average, a new block is added to the end. Everyone running Bitcoin software sees the same line of blocks and agrees on the same order.

The position of a block in that line is its [[block height]]. Height is the clock. Not "3:14 pm on Tuesday", which nobody else can check, but "in this block and no earlier one", which anyone can check, forever, without asking you.

A [[confirmation]] is simply your transaction being included in a block. From that moment, its place in the order is fixed relative to everything in earlier blocks. Two moments in the same block are ordered by their position within it, which is why replaying a ChainBloom world sorts events by height and then by transaction index. Give two people the same blocks and the same rules, and they rebuild the same world, point for point.

This is also why worlds are measured in blocks and not in days. A world stays open for {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks. That is about {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days, but "about" is the honest word. Blocks are the unit everyone can check.

:::note
This is why a world's history survives things that would end a normal project. There is no ChainBloom server holding the order. Anyone with a Bitcoin node and the published rules can rebuild every world from the chain itself. If this site disappeared tomorrow, the histories would still be there.
:::

## Why a step waits for its parent

Each [[path]] is held by one small output: its [[carrier]], worth exactly {{CARRIER_VALUE_SATS}} satoshis. Adding to a path spends that output and creates the next one. Bitcoin will not allow the same output to be spent twice, so a path can only ever be one chain, never a fork.

There is one more rule on top of that, and it is the one people trip over. A step is rejected unless its path's previous event is confirmed in a **strictly earlier** block. If the parent is in the same block, or somehow later, validation returns `UNCONFIRMED_LINEAGE_PARENT` and the step is not an event at all. The same rule applies to an Echo's target: it must already be confirmed in an earlier block, or you get `UNCONFIRMED_GRAFT_TARGET`.

The practical effect is simple: **a path moves at most once per block.** If your step just confirmed, the next one waits for the next block.

That feels strict until you see what it prevents. Without it, someone could build five steps in a row, broadcast them together, get them into one block, and present a path that appears to have grown over hours of consideration. Nothing in the raw transactions would contradict them. With the rule, each step must be separated by a real block boundary, which means real elapsed time that no participant controls. The pace of a world is set by Bitcoin, not by whoever has the fastest script.

It also stops the softer version of the same trick: two unconfirmed steps chained together and shown as though they were settled history. A careful index will not even offer that as a possibility, because a mempool overlay never invents the parent link. Until the parent is in a block, the child has nothing to attach to.

## From draft to settled

Every step you take passes through the same five states. Watch one move through them.

:::demo name=confirmation-lifecycle
A step goes through five states, in this order:

1. **Draft**: an unsigned transaction has been built. It exists only on your screen. Nothing has been broadcast, nothing has been spent, and abandoning it costs nothing.
2. **Signed**: you have signed it with your key. It is now a valid transaction that anyone could broadcast, but it is still only on your device.
3. **Waiting**: it has been broadcast and is sitting in the [[mempool]], the pool of transactions nodes have accepted but not yet mined. It has a transaction id. It has no place in the order yet, and it can still be replaced or dropped.
4. **Confirmed**: it is in a block. It now has a height, a position, and a fixed place in the story. Every reader who replays the chain puts it in the same spot.
5. **Settled**: more blocks have been built on top. Reversing the block that holds your step now means outrunning all of that work, which gets less plausible with every block.

Only states 4 and 5 count as history. States 1 to 3 are intentions.
:::

The gap between "waiting" and "confirmed" is where almost every confusing experience lives, and it deserves its own page: [confirmed and unconfirmed activity](/docs/learn/confirmed-and-unconfirmed).

## Bitcoin is here for order, not for money

Say it plainly, because the assumption runs the other way.

ChainBloom uses Bitcoin the way a notary uses a calendar. There is no token, no coin, no balance, no yield, no mint, no marketplace, and nothing to buy or sell. The {{CARRIER_VALUE_SATS}} satoshis in a carrier are not a price or a stake; they are the smallest practical way to keep a path pinned to a single unspent output so that its order cannot be argued with. When a path is closed, those satoshis stop being a carrier and return to ordinary outputs.

Two things are genuinely real, and this site will not soften either. You pay a Bitcoin network fee to miners for each step, the same as any other transaction, and ChainBloom takes none of it. And a confirmed step cannot be undone: not by you, not by the world's creator, not by us.

Everything else is just the calendar doing its job: agreeing, with no referee, on what came first.
