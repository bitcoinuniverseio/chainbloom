---
title: Worlds, paths, and history
nav: Worlds, paths, history
description: What a world fixes forever the moment it is created, what a path actually is, what counts as history, and the four states a path can be in when you find it.
socialTitle: Worlds, paths, and history
socialDescription: The settings a world locks at creation, what a path really is, and the four ways a path can end.
updated: 2026-07-31
order: 2
keywords: [world, path, lane, history, settings, expired, abandoned, closed, live]
related: [learn/the-five-actions, participate/create-a-world, reference/data-structures]
cta:
  title: Design your own invitation
  body: Pick the paths, the lifetime, and the step limit — then see what your choices ask of the people who join.
  label: Create a world
  href: /docs/participate/create-a-world
---

:::lead
Everything a world will ever be is decided in its first transaction. This page tells you which choices are permanent, what you are actually holding when you hold a path, and how to read a world someone else made — including one that has already ended.
:::

## What a world fixes at creation

A [[world]] is created by one transaction. That transaction carries the settings below, and none of them can be changed afterwards by anyone, including the person who chose them. There is no settings screen, because there is nowhere for settings to live.

:::figure caption="Every world setting, fixed by the creating transaction"
| Setting | Allowed range | What it decides |
| --- | --- | --- |
| Paths | {{MIN_LANES}} to {{MAX_LANES}} | How many separate threads the world will ever have |
| Duration | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, about {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days | When the world stops accepting anything at all |
| Steps per path | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} | How far one thread can travel before it can only be closed |
| Seed | exactly {{SEED_BYTES}} bytes | The world's own look when a gallery draws it |
| Title | at most {{MAX_TITLE_BYTES}} characters, matching `{{TITLE_PATTERN}}` | What people see when they find it |
| Network | mainnet, testnet4, signet, or regtest | Which chain the world lives on |
:::

Two things follow from that table that surprise people.

**The paths cannot grow in number.** If you open a world with four paths and six friends want in, two of them are not in this world. Decide the count while you are still writing the invitation, not after.

**The title is short and plain on purpose.** It holds ASCII letters, digits, spaces and `. _ : -` and nothing else — no emoji, no accents, no punctuation beyond that set. It is a label, not a description. The description lives wherever you invite people.

The world's own name is its creating transaction's [[txid]]. That is the identifier anyone anywhere can use to refer to it without a directory, an account, or a link to this site.

:::note
The seed does not affect any rule. It feeds the drawing: where blooms sit, how a world looks laid out. Two galleries may render the same confirmed world completely differently and both be correct, because rendering is deliberately outside the rules.
:::

## What a path is

A [[path]] is one thread inside a world, and there is nothing to it except a chain of confirmed steps and one live output.

Paths are numbered from zero. A path's identifier is the world's id, a colon, then its number — so path three of a world is `<worldId>:3`. That is the name that appears when software talks about it.

What you hold when you hold a path is a single Bitcoin output worth exactly {{CARRIER_VALUE_SATS}} satoshis: the [[carrier]]. Holding it is the whole of your ability to act on that path. To take a step you spend it and create the next one. To pass the path to someone else, that carrier ends up in their hands.

:::safety
Holding a carrier means you can take the next step. It does not prove who you are, who made the earlier steps, or who owns anything. It is a turn in a game, not a title deed — and if you lose the key that controls it, the path stops where it is. Nobody can restore it for you.
:::

## What counts as history

History is the confirmed events, and nothing else.

Each event records the operation, the world and paths it touched, the transaction it lives in, the block height and the position of the transaction within that block. Order comes from that pair: block height first, then position inside the block. Sort by it and everybody gets the same sequence, in the same order, every time — which is what makes independent replay possible.

Three things are deliberately *not* history:

- **Unconfirmed transactions.** A step sitting in the queue may be replaced or dropped. It is a projection until a block takes it. See [confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed).
- **Anything a website adds.** Likes, comments, follower counts, badges. None of it exists in the record, so none of it survives the site that stored it.
- **The picture.** How the world was drawn is one reading of history, not part of it.

## The four ways a path can end

When you find a path, it is in exactly one of four states. Three are endings; the fourth is the interesting one.

### Closed — somebody finished it

The holder took a closing step on purpose. It spends the carrier and creates no successor, so the {{CARRIER_VALUE_SATS}} satoshis go back to an address they chose, and no step can ever be added again. The record keeps the reason given with the close.

This is the ending worth aiming for. It is also available even after a path has used all its steps — you can always finish deliberately, even when you can no longer add.

### Expired — the world's time ran out

Every world has a height at which it stops, worked out at creation as the creating height plus the duration. It is exclusive: at that height the world is over. Every path still alive at that moment becomes [[expired]], with the reason `WORLD_DURATION_ELAPSED`.

Nobody triggers this and nobody can postpone it. A path can expire mid-sentence, and plenty will. That is a real ending too, and often an honest one.

### Abandoned — a spend broke the path

If a confirmed transaction spends a live carrier but is not a valid ChainBloom step, the path becomes [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`. The most likely cause today is ordinary wallet software treating the {{CARRIER_VALUE_SATS}}-satoshi output as spare change and sweeping it up with everything else.

Nothing is invented to repair it. There is no rewind and no replacement carrier. The record states what happened and stops, which is why [protect your path](/docs/participate/protect-your-path) is worth five minutes before you take a step.

### Live — it is still somebody's turn

The path has a carrier, has not used all its steps, and its world is still open. Somebody can act on it right now.

A world is `ACTIVE` while it still has at least one live path. When the last one is closed or abandoned, the world is `ENDED`. If the height runs out first, the world is `EXPIRED`. Those three words are the whole vocabulary for a world's condition.

## Reading a world that is still open

A live world is not a draft. Every confirmed step in it is already final and already ordered; the only thing outstanding is what comes next.

So when you find one, the useful questions are concrete: how many of its paths are still live, how many steps each has left, and how many blocks remain before the whole thing stops. Those four numbers tell you whether there is room for you and how much of it.

You cannot browse worlds from this site yet — the public index is not switched on, and [what is running](/docs/help/status) says exactly why. What you can do today is read the rules that govern all of them, in [the five actions](/docs/learn/the-five-actions), or the exact shapes software sees, in [data structures](/docs/reference/data-structures).
