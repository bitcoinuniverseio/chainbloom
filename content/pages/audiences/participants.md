---
title: If you want to take part
nav: Take part
description: What you need before your first step, what it actually costs, what stays yours afterwards, and the three things that can never be undone.
socialTitle: Taking part in ChainBloom
socialDescription: What you need, what it costs, what you keep, and what you cannot undo.
updated: 2026-07-31
order: 2
keywords: [join, participate, cost, fees, first step, wallet]
related: [participate/join-a-world, participate/protect-your-path, participate/fees-and-confirmation]
cta:
  title: Take your first step
  body: A walkthrough of one contribution, from the invitation to the block that confirms it.
  label: Join a world
  href: /docs/participate/join-a-world
---

:::lead
Taking part means adding one moment to a story other people are also writing, and leaving it somewhere nobody can quietly edit. This page tells you what that needs, what it costs, and what you are agreeing to before you sign anything.
:::

## What you need

Three things, and no account anywhere.

**An invitation.** A world id and the [[path]] you are being handed. Because the public index is not switched on yet, this comes from whoever is running the [[world]] — a message, a post, a card at an event. There is no directory to browse today.

**A Bitcoin wallet you control** that can sign a [[psbt]] and hold Taproot outputs. [InScribe](app) builds the transaction unsigned and hands it to you; your keys never leave your wallet.

**A little bitcoin.** Enough for the miner fee plus {{CARRIER_VALUE_SATS}} satoshis. That is the whole requirement.

## What it costs

Two amounts, and nothing else. ChainBloom charges nothing and there is no subscription.

The first is an ordinary Bitcoin network fee, paid to miners, set by how busy the network is when you go. The second is {{CARRIER_VALUE_SATS}} satoshis, which sits in the [[carrier]] output that holds your path. It is not spent — each step moves it into the next carrier — and it comes back to an address you choose when you finish the path.

[Fees and confirmation](/docs/participate/fees-and-confirmation) has the real arithmetic.

## Four steps to your first moment

:::steps
### Get the world id and your path

From the person running the world. Check the network matches — a world on signet and a world on mainnet are different things, and a step built for the wrong one is rejected with `NETWORK_MISMATCH`.

### Build the step in InScribe

Choose the action and its few small numbers. A moment carries a glyph, a palette, a motion and a magnitude — that is all the chain holds.

### Read the review before you sign

The build gives you an unsigned transaction and a preview — which path is being moved, every output, the total going in, the miner fee, the change, the fee rate, and any warnings. Read the fee and the change. That is the screen where mistakes are still free.

### Sign, broadcast, wait for a block

Until a block includes it, your step is only in the [[mempool]]. Your next step on the same path cannot go into the same block as this one; try it and validation returns `UNCONFIRMED_LINEAGE_PARENT`.
:::

## What you keep

The path stays with whichever wallet holds its carrier output. Hold it and you can take the next step; move it and whoever receives it can.

You keep the record too. The order of your moments is settled by Bitcoin, so anyone replaying the chain rebuilds the same history in the same order, with or without this site.

And you keep the satoshis. Completing a path releases the {{CARRIER_VALUE_SATS}} back to you.

:::note
Holding a carrier is not proof of identity, authorship, or copyright. It means your wallet can take the next step on that path. Credit and licensing live in what you publish and in law, not in an outpoint.
:::

## What you cannot undo

**A confirmed step.** Not by you, not by the world's creator, not by us. There is no delete.

**Completing a path.** Ending it is deliberate and final; there is no reopening. The world itself ends on its own at a fixed height, and every path still live at that moment expires with it.

**Spending the carrier by accident.** This is the real risk. If your wallet spends that output in an ordinary transaction — consolidating, sweeping, paying a fee with it — the path becomes [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`, and nothing is invented to replace it. The story simply stops there.

:::warning
No wallet has ChainBloom support today, so no wallet will stop you from spending a carrier by mistake. Until one does, freeze or label that output yourself. [Protect your path](/docs/participate/protect-your-path) shows how.
:::

## Before your first step

:::checklist id=audience-participants
- I have the world id, my path, and the network it runs on
- My wallet can sign a PSBT and I control the keys
- I have enough for the miner fee plus the carrier amount
- I have read the fee and the change on the review screen
- I have marked the carrier output so I do not spend it by accident
- I accept that a confirmed step cannot be undone by anyone
:::
