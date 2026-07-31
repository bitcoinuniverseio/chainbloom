---
title: Returning to an existing path
nav: Return to a path
description: Three things to write down before you close the tab, how to check where your path stands weeks later, and what to do if the world moved on without you.
socialTitle: Returning to a ChainBloom path
socialDescription: Find your way back to a path you started months ago, using only an explorer and two strings you wrote down.
updated: 2026-07-31
order: 3
keywords: [return, resume, find my path, outpoint, txid, explorer, expired]
related: [participate/complete-a-path, participate/follow-and-return, help/troubleshooting]
cta:
  title: Decide how this one ends
  body: What a deliberate ending does, and why it is not the same as letting the clock run out.
  label: Completing a path
  href: /docs/participate/complete-a-path
---

:::lead
Most people come back to a path weeks after they last touched it, from a different device, with no memory of what they did. This page is about making that easy, and it is mostly about three strings you write down before you walk away.
:::

## Write down three things

There is no account, no login, and no server holding your place. Your way back is whatever you kept. Keep these three, in something durable such as a notes file, a paper card, or a pinned message:

**Your path id.** The world id followed by a colon and a number counting from zero, like `a1b2c3…:2`. The world id is the [[txid]] of the transaction that created the world. This is the only name your path has.

**The txid of your last step.** Every step you sign has one. It is how you find the moment you last added, and it is how anyone else points back at it.

**The [[outpoint]] of your live path output.** An outpoint is a txid plus an output number, written `txid:vout`. For a normal step, your path continues at output 1, so it is your last step's txid followed by `:1`. This is the exact coin your next step must spend.

:::tip
Write the three down at the moment you broadcast, not later. The txid is on screen then and hard to reconstruct afterwards, especially if the world's index is not readable.
:::

## Check where your path stands

Everything you need is public. You do not need permission from anyone to look.

### On an explorer

Look up the outpoint of your path output on any Bitcoin [[explorer]]. There is exactly one question worth asking, and the answer is binary:

- **Unspent.** Your path is where you left it. You can take the next step from here.
- **Spent.** Something moved it. Follow the spending transaction and read the next section.

If it is spent by a valid step, the next path output is at output 1 of that transaction, and that is your new outpoint. If it is spent by anything else, the path stopped being a path at that moment.

:::note
No Bitcoin explorer shows ChainBloom worlds today. An explorer will show you an ordinary transaction with a small output and an `OP_RETURN`. That is enough to answer the unspent-or-spent question, which is the one that matters most.
:::

### In the workspace

The ChainBloom workspace in [InScribe](app) has a Lanes surface that lists the live paths held by the address you connected, and its backend can look up a path directly from an outpoint. That saves you the manual check, when the index it reads from is switched on. [What is running](/docs/help/status) says where that stands right now.

## What changed while you were away

A world does not pause because you did. Four things move without you.

**Blocks passed.** Every block brings the world closer to its end [[block height|height]], which is the height it was created at plus its duration. That duration is between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks. The window is not a countdown anyone shows you. Work it out and write down the number.

**Other paths moved.** Other people added moments, and some of those may point back at yours. An echo aimed at your step does not change your step; it sits alongside it in the history.

**Your step budget did not.** The step limit is per path and was fixed when the world was created, somewhere between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}. Count what you have used.

**Fees changed.** A rate that felt fine two months ago may not get you into a block this week. Check before you build.

The one thing that does not change is what is already confirmed. Earlier steps cannot be edited, reordered, or removed by anyone, including the world's creator.

## When you cannot go on

Sometimes the answer is that the path is finished, and the useful thing is to know which kind of finished.

Each path holds one of four statuses. Two of them, [[expired]] and [[abandoned]], mean the path stopped without anyone choosing to end it.

| Status | What happened |
| --- | --- |
| `LIVE` | The path output is unspent and the world is still open |
| `CLOSED` | Somebody ended it on purpose |
| `EXPIRED` | The world reached its end height while this path was still live |
| `ABANDONED` | The path output was spent by something that was not a valid step |

Worlds have their own three: `ACTIVE`, `ENDED` once no live paths remain, and `EXPIRED` once the end height arrives.

### The world ended or expired

If the world reached its end height, every path still live became `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. Any attempt to add a step now is refused with `WORLD_ENDED`. There is no extension, no grace period, and no setting anyone can change. The duration was fixed in the creation transaction.

Your {{CARRIER_VALUE_SATS}} satoshis are still yours. The output is an ordinary Bitcoin output that you control and can spend whenever you like. It has simply stopped meaning anything to the world.

### Your path reached its step limit

Further steps are refused with `MAX_STEPS_REACHED`. Ending the path deliberately is still allowed, and while the world is still open that is worth doing. See [Completing a path](/docs/participate/complete-a-path).

### The path output was spent by something else

This is the one that hurts, and it is usually a wallet consolidating small outputs without being told not to. Once that spend confirms, the path is `ABANDONED` with the reason `INVALID_CONFIRMED_SPEND`. Nothing is invented to replace it, and no one can restore it. The history keeps what happened, including the fact that it stopped this way.

If you cannot tell which of these applies, [Troubleshooting](/docs/help/troubleshooting) walks through the checks in order, starting from the outpoint.

## Coming back well

If the path is still live and the world is still open, you are in the ordinary case, and the ordinary case is easy. Take your outpoint, build the next step, check that output 1 is a fresh {{CARRIER_VALUE_SATS}}-satoshi output to an address you control, and sign.

One rule to remember from the last time: your previous step must be confirmed in an earlier block than this one. Two steps cannot share a block, and trying gives `UNCONFIRMED_LINEAGE_PARENT`.

Then write down the new txid and the new outpoint, and close the tab knowing you can find your way back again.

## You have finished the participant guide

If you have read the pages on the "join a world" path, you have covered everything a person needs before taking part: what a world is, what a contribution costs, what your wallet shows you, how to keep a live path safe, and how to come back to it.

:::demo name=completion-card guide=participant
This is where a card appears once you have marked every page on the "join a world" path as read. It records that you read a guide. It is not a badge, a balance, a certificate, a token, or anything the protocol knows about. Nothing on Bitcoin changes because you finished reading.
:::
