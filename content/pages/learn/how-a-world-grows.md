---
title: How a world grows
nav: How a world grows
description: An invitation, a fixed number of paths, steps that each wait for the one before them, and an ending that was set on the first day.
socialTitle: How a world grows
socialDescription: The whole life of a ChainBloom world in plain words — invitation, paths, confirmed steps, and an ending nobody can move.
updated: 2026-07-31
order: 1
keywords: [how it works, growth, lineage, steps, confirmation, ending, invitation]
related: [learn/worlds-paths-and-history, learn/the-five-actions, examples/collaborative-garden]
cta:
  title: Learn the five moves
  body: Create, bloom, echo, meet, complete — and what each one asks of you.
  label: The five actions
  href: /docs/learn/the-five-actions
---

:::lead
By the end of this page you will be able to describe the whole life of a ChainBloom world out loud: how it opens, how it grows, why its order cannot be argued with, and how it stops. No code and no Bitcoin knowledge required.
:::

## It begins with an invitation

Somebody opens a [[world]]. That is one Bitcoin transaction, and it does two things at once: it writes down the rules of the world, and it opens every [[path]] the world will ever have.

The rules are short. A title of at most {{MAX_TITLE_BYTES}} characters. How many paths — between {{MIN_LANES}} and {{MAX_LANES}}. How long the world stays open, in blocks. How many steps a single path may take. A {{SEED_BYTES}}-byte [[seed]] that gives the world its own look when somebody draws it.

That is an invitation, not a plan. "Eight paths, thirty days, twelve steps each, called `Winter Garden`" tells people what they are joining and what they are committing to, and it fits on a postcard. What actually happens inside those limits is not the creator's to decide. Once the transaction confirms, the creator has no more authority than anybody else. There is no edit, no admin, no takedown, no way to add a ninth path because a ninth person turned up.

:::tip
The interesting design work is all in the invitation. Three long paths and thirty short ones produce completely different work. Look at the [example worlds](/docs/examples) before you pick numbers.
:::

## The paths are fixed before anyone answers

The creating transaction hands out one small Bitcoin output per path, each worth exactly {{CARRIER_VALUE_SATS}} satoshis. That output is the path's [[carrier]] — the playing piece, the thing whose position *is* the state of that path. It is not a coin you collect, an edition, or a certificate of anything; it is the smallest workable way to keep one thread pinned to one spot.

Whoever holds a path's carrier can take the next step on it. Nobody else can, and no two people can hold the same one. Paths can be handed to specific people at creation, taken by whoever is quickest, or passed along later as the world runs.

Everything that follows is the same move repeated: **spend the carrier, create the next carrier.** A [[step]] is that move plus whatever the person wants to say — a bloom, an echo, a meeting, or a closing.

## Every step waits for the one before it

A path is a chain of transactions, each one spending the output the last one made. That is not a metaphor, and it is worth seeing laid out.

:::demo name=path-lineage
**Step 0 — the world opens.** The creating transaction makes this path's first carrier: one output of {{CARRIER_VALUE_SATS}} satoshis. Confirmed in block *H*.

**Step 1 — the first bloom.** A transaction spends that output and creates a new one of the same value. Its only parent is step 0. Confirmed in some block after *H*.

**Step 2 — the second step.** A transaction spends the output made by step 1 and creates another. Its only parent is step 1. Confirmed in a block after that one.

**Step 3 — the third step.** A transaction spends the output made by step 2. Its only parent is step 2.

Read the arrows backwards and you get one line with no branches and no gaps: 3 → 2 → 1 → 0. Every link is a spend, so there is exactly one possible reading. The path's history is not a list somebody maintains — it is the shape of the spending itself.
:::

There is one rule that makes this strict rather than approximate: **a step's parent must already be confirmed in an earlier block.** Not the same block, not "probably fine" — earlier. A transaction that breaks this is rejected with the issue code `UNCONFIRMED_LINEAGE_PARENT`.

The cost of that rule is patience. Two steps on the same path cannot land together, so a path moves at most one step per block, and in practice much slower. The benefit is that every step on every path carries a block height that everyone reads identically, forever.

## Why one live holder per path makes the order undeniable

Here is the whole trick in plain words, with no jargon.

Bitcoin's job is to stop the same coin being spent twice. It is very good at it, and it is good at it for everybody at once, without anyone asking permission. ChainBloom uses that and nothing else.

A path has exactly one live carrier at any moment. To take a step you must spend it. If two people try to take the next step at the same time, they are trying to spend the same output, and Bitcoin will let only one of those transactions into a block. The other one is not "resolved later by a moderator" — it simply cannot exist alongside the first.

So there is never a version A and a version B of a path. There is never a merge conflict, a lost update, or a support ticket about whose contribution should have come first. The question "what came next?" has a single answer that anyone can check from public data.

:::note
If you already know Bitcoin: the carrier is an ordinary [[utxo]], and the path is its spend chain. If you do not, you have lost nothing — "one live holder, spend it to move" is the complete idea.
:::

This is also why nothing is invented to patch a broken path. If a confirmed transaction spends a carrier without following the rules, the path does not roll back and does not get replaced. It is marked `ABANDONED`, with the reason `INVALID_CONFIRMED_SPEND`, and that is the honest end of it. The record says what happened rather than what was meant.

## The ending was written into the invitation

Two limits run from the first block, and both are public from the start.

**The world's lifetime.** The creator fixes a duration between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks — about {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days. Add that to the height where the world was created and you get the height at which it stops. Reach it and the world expires, along with every path still alive. Attempts to act after that fail with `WORLD_ENDED`.

**The steps per path.** The creator also fixes a cap between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}. A path that hits it can take no more creative steps: further attempts fail with `MAX_STEPS_REACHED`. It can still be closed on purpose, which matters — you can always finish deliberately, even when you can no longer add.

There is a third ending, and it is the good one: someone decides a path is done and completes it. The closing step spends the carrier and creates no successor, so the {{CARRIER_VALUE_SATS}} satoshis return to an address of their choosing and the path is sealed. When the last live path in a world is finished, the world itself is over.

## What a finished world leaves behind

Not a file, and not a page on this site. What remains is a set of confirmed Bitcoin transactions, which is enough for anyone to rebuild the world exactly: the same worlds, the same paths, the same events, in the same order, sorted the same way. Two people doing that independently get identical results — that is the point of settling order on a chain instead of a server.

What it leaves behind is a shape with an author list you did not have to maintain, a timeline nobody can quietly straighten, and an ending everybody could see coming.

Next, learn what a world fixes and what a path can be when you find it in [worlds, paths, and history](/docs/learn/worlds-paths-and-history) — or see the whole idea in one worked case, [the collaborative garden](/docs/examples/collaborative-garden).
