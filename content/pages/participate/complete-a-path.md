---
title: Completing a path
nav: Complete a path
description: An ending is a contribution, not an exit: what completing does to a path, what it returns to you, and how it differs from letting a world run out.
socialTitle: Completing a ChainBloom path
socialDescription: Why endings matter, what CLOSE actually does, and the three very different ways a path can stop.
updated: 2026-07-31
order: 4
keywords: [complete, close, ending, reason code, expired, abandoned, finish]
related: [participate/protect-your-path, learn/worlds-paths-and-history, examples/community-time-capsule]
cta:
  title: Do not lose a path by accident
  body: The small output that holds your path is exactly what ordinary wallets sweep. Here is how to stop that.
  label: Protect your path
  href: /docs/participate/protect-your-path
---

:::lead
Ending a [[path]] on purpose is the last creative decision you get to make in a world, and it is the one that turns a run of moments into a shape. This page covers what completing actually does, what comes back to you, and why an ending you chose reads very differently from one that just happened.
:::

## Why endings matter here

Nothing else you use finishes. A feed does not end, a thread does not end, a document keeps a cursor blinking at the bottom of it forever. Because nothing ends, nothing ever becomes a whole.

A ChainBloom path can end, and the ending is recorded as an event like any other. Someone reading the world in five years sees not just what you added but that you decided you were done. That is information. It says the shape was intended.

There is a practical side too. A world becomes `ENDED` once it has no live paths left. If your path is the last one and you close it, you are the person who finished the world. If you simply stop and let the clock expire, the world ends anyway, but it ends by timeout, and every reading of it will say so.

:::tip
Decide what an ending means for your world before anyone reaches one. "We close when the harvest comes in" gives a person something to aim at. "Just stop whenever" produces a world full of paths that trail off.
:::

## What completing does

Completing a path is the [[close|CLOSE]] operation in the protocol's vocabulary. It spends the path's [[carrier]] output (the small output that has been carrying your path from step to step) and creates no successor for it. The transaction has this shape:

| Position | What belongs there |
| --- | --- |
| Input 0 | Your path output, exactly {{CARRIER_VALUE_SATS}} satoshis |
| Input 1 and after | Your funding inputs, all native SegWit |
| Output 0 | The marker, value 0 |
| Output 1 and after | Your change |

The absence is the point. Every other step creates a new {{CARRIER_VALUE_SATS}}-satoshi output at output 1, and that output is what the next step spends. A completion creates nothing to spend. There is no output left that could extend this path, so the path can never be extended: not by you, not by the creator, not by anyone who acquires anything later. It is finished in the strongest sense the chain can express.

Once it confirms, the path's status becomes `CLOSED` and its terminal reason is recorded as `CLOSE_` followed by the reason code you chose.

### Your satoshis come back

The {{CARRIER_VALUE_SATS}} satoshis that have been carried from step to step stop being locked in a path output. They go in as input 0 and come back out in your change, along with whatever your funding inputs contributed, minus the miner fee.

There is no fee to ChainBloom at any point in a path's life: not at the start, not at the end. You paid miners to have your steps confirmed, and that is all you paid.

:::warning
Completing is a confirmed Bitcoin transaction and cannot be undone. There is no reopening a closed path, no matter who asks. If you are unsure whether you are finished, you are not finished. A path can sit unused for as long as the world stays open.
:::

### Completing is always available

One rule is worth knowing in advance. When a path reaches its step limit, further steps are refused with `MAX_STEPS_REACHED`, but completing is still allowed at that point. A full path can always be ended properly rather than left hanging.

## Reason codes

A completion carries one byte: a reason code from 0 to 255. It is the only thing in the payload.

The protocol does not define what any of those numbers mean. It stores the number and nothing else. Meaning is set by the application, the world, or the group, exactly like the glyph and palette numbers in a bloom.

That gives you a convention to agree on, and it is worth agreeing on it in the invitation rather than after the fact. A world might decide that 0 means finished as planned, 1 means finished early, 2 means the contributor withdrew. A different world will decide something else, and both are correct. What is recorded is `CLOSE_0`, `CLOSE_1`, `CLOSE_2`. What those mean lives in the world's own writing.

:::simulation
The codes above are an invented example to show the shape of a convention. No standard set of reason codes exists, and the protocol does not favour any.
:::

## Three ways a path stops, and they are not the same

This is the distinction most worth carrying away.

### Completed on purpose

You signed a completion. Status `CLOSED`, terminal reason `CLOSE_<reason>`. The ending is an event with a height and a place in the order, and it reads as a decision.

### The world ran out

The world reached its end height and your path was still live. Status [[expired|EXPIRED]], terminal reason `WORLD_DURATION_ELAPSED`. No transaction was signed; the clock did it. Any later attempt to add a step is refused with `WORLD_ENDED`.

This is not a failure. Some worlds are designed to end this way, with everything still open at the last block. But it is not the same statement as choosing to stop, and a reader can tell the difference.

Your {{CARRIER_VALUE_SATS}} satoshis are still yours in this case. The output is an ordinary Bitcoin output you control. It has just stopped meaning anything to the world.

### The output was spent carelessly

Somebody spent the path output in a transaction that was not a valid step: usually a wallet consolidating small outputs, or a sweep to an exchange. Once that spend confirms, the path becomes [[abandoned|ABANDONED]] with the terminal reason `INVALID_CONFIRMED_SPEND`, and the spend is recorded separately as an invalid carrier spend.

Nothing is invented to replace it. No successor is guessed, no path is restored, and no support request can change it. The world's history keeps the fact that the path ended this way, permanently and visibly.

The gap between the second and third case is small in mechanics and large in meaning, which is why [Protect your path](/docs/participate/protect-your-path) exists and why it is worth reading before you hold a path rather than after.

## When the last path closes

A world becomes `ENDED` once no live paths remain in it. Nothing new can be added.

Everything stays readable. The world's history is on the chain, and anyone who replays the same rules over the same blocks rebuilds the same worlds, the same paths, and the same order of events, with or without this site. That is what [Worlds, paths and history](/docs/learn/worlds-paths-and-history) means when it says nobody hosts the truth.

A finished world is also the only kind you can look at whole. While it is open, you are reading a thing in motion. Once the last path closes, the shape stops moving and you can finally see what the group made, including the endings, and who chose them. [The community time capsule](/docs/examples/community-time-capsule) is worked through end to end with that reading in mind.

## You have finished the creator guide

If you have read the pages on the "create a world" path, you have covered the whole arc: how a world grows, the five actions, every setting you fix at creation, what it costs, how to look after the people who answer your invitation, and how a path ends.

:::demo name=completion-card guide=creator
This is where a card appears once you have marked every page on the "create a world" path as read. It records that you read a guide. It carries no protocol meaning, no ownership, and no privilege of any kind.
:::
