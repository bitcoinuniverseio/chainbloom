---
title: Joining and contributing to a world
nav: Join a world
description: How to get a path, decide what your one moment adds, and sign your first step, plus the two things you must check before the transaction goes out.
socialTitle: Joining a ChainBloom world
socialDescription: Find a world, get a path, build a contribution, sign it, and wait for the block. What each stage really requires.
updated: 2026-07-31
order: 2
keywords: [join a world, contribute, bloom, echo, path, first step, sign]
related: [participate/wallet-and-review, participate/fees-and-confirmation, learn/the-five-actions]
cta:
  title: Know what you are signing
  body: A line-by-line read of the review screen, and the lines that mean stop and ask.
  label: Wallet connection and review
  href: /docs/participate/wallet-and-review
---

:::lead
Joining a [[world]] takes one signed transaction and about ten minutes. Most of that time goes on the part that matters: deciding what your one moment adds to a story other people are also writing.
:::

## Find a world and read its invitation

A world is not a room you browse into. It is something a person opened and then told people about: in a message, on a poster, at an event, in a class. The world's id and your path id will come to you from that person, not from a search box.

:::note
The public index that would let anyone list confirmed worlds is not switched on yet. There is no directory to scroll today. [What is running](/docs/help/status) states plainly what works now and what changes when the index turns on.
:::

Before anything else, read the invitation the creator wrote. It should tell you three things: what the world is for, what a single contribution should be, and what its ending means. If it does not, ask. A world where nobody agreed what a contribution is fills up with mismatched moments, and none of them can be taken back.

Two numbers from the invitation are worth writing down now, because they set your pace:

- **How long the world stays open.** Somewhere between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks from its creation, which is about {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days. When that height arrives the world becomes `EXPIRED` and nothing more can be added to it.
- **How many steps your path may take.** Between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}. Once you reach the limit, further steps are refused with `MAX_STEPS_REACHED`, though you can still end the path properly.

## Get a path

A [[path]] is held by whoever controls its output. That is the whole permission system. There is no member list, no approval queue, and no admin who can grant or revoke anything.

So a creator hands you a path by **sending it to you**. The path is a {{CARRIER_VALUE_SATS}}-satoshi Taproot output, and it moves the way any Bitcoin output moves: they send it to an address you control, and once that transfer confirms, the path is yours to take forward.

:::warning
Today you need the path output sitting in a wallet you control the keys to. Not an exchange account. Not a custodial balance. Not "somewhere I can see it". You will have to sign a transaction that spends that specific output, and only key control lets you do that.
:::

Small outputs are exactly the kind of thing ordinary software throws away. No wallet has ChainBloom support yet, so nothing on your screen knows that this {{CARRIER_VALUE_SATS}}-satoshi output is different from any other. Read [Protect your path](/docs/participate/protect-your-path) before you accept one. It is short, and it is the page people wish they had read first.

## Decide what to add

Now the interesting part. A contribution is one of two moves.

### A bloom: a moment of your own

A bloom adds a moment to your path and nothing else. It carries four small numbers: a glyph from 0 to {{MAX_GLYPH}}, a palette from 0 to {{MAX_PALETTE}}, a motion from 0 to {{MAX_MOTION}}, and a magnitude from 0 to 255. Four bytes, that is all.

Those numbers do not mean anything by themselves. Meaning comes from the agreement in the invitation: "palette 3 is the days it rained", "magnitude is how many of us showed up". A world where the group agreed what the numbers mean reads as a story. A world where everyone picked at random reads as noise, and it reads that way forever.

### An echo: a moment that answers an earlier one

An echo points back at a specific earlier event anywhere in the world, by its [[txid]], and adds a relation from 0 to {{MAX_RELATION}} alongside a glyph and a palette. It is how you say *this is because of that*.

An echo has one extra rule: the event you point at must already be confirmed in a strictly earlier block. Point at something from the same block and the step is rejected with `UNCONFIRMED_GRAFT_TARGET`. Point at something that is not in this network's history at all and you get `UNKNOWN_GRAFT_TARGET`.

Two paths can also share a moment and both carry on, which needs both holders to sign the same transaction. That is a different shape of contribution and it has its own page. [The five actions](/docs/learn/the-five-actions) covers all five in order.

:::tip
Write the sentence before you pick the numbers. If you cannot say in plain words what this moment records, the numbers will not rescue it, and you cannot edit it afterwards.
:::

## Build it, check it, sign it

The build and sign flow runs inside the ChainBloom workspace in [InScribe](app). It hands you an unsigned [[psbt]] plus a preview: which path is being extended, every output, the total input, the miner fee, the change, the [[fee rate]], and any warnings.

The transaction has a shape you can verify by eye:

| Position | What belongs there |
| --- | --- |
| Input 0 | Your path output, exactly {{CARRIER_VALUE_SATS}} satoshis |
| Input 1 and after | Your funding inputs, all native SegWit |
| Output 0 | The marker, value 0 |
| Output 1 | Your new path output, exactly {{CARRIER_VALUE_SATS}} satoshis |
| Output 2 and after | Your change |

Two checks catch nearly every real mistake. First, output 1 must be exactly {{CARRIER_VALUE_SATS}} satoshis going to an address you control. That is your path continuing. If it is missing, the path stops existing. Second, the miner fee must be a number you meant to pay.

One rule surprises people: **you cannot take two steps in the same block**. Your previous step has to be confirmed in an earlier block than the next one. Try to stack them and the second is rejected with `UNCONFIRMED_LINEAGE_PARENT`. Plan for roughly one step per block at the very fastest.

:::checklist id=join-world
- Read the invitation and write down the world id and your path id.
- Confirm the path output has arrived in a wallet whose keys you control.
- Note the world's end height and your path's step limit.
- Decide in plain words what this moment records.
- Choose the numbers that match the group's agreed meaning.
- Check the network in the plan matches the network of your wallet.
- On the review screen, check input 0 is your {{CARRIER_VALUE_SATS}}-satoshi path output.
- On the review screen, check output 1 is a new {{CARRIER_VALUE_SATS}}-satoshi output to an address you control.
- Check the miner fee and the change address.
- Sign and broadcast.
- Write down the txid of this step before you close the tab.
- Wait for one confirmation before planning the next step.
:::

## Waiting

Broadcasting puts your transaction in the [[mempool]], where it waits for a miner. Until a block includes it, nothing about it is settled: it can be replaced, and it can simply sit there if the fee was low.

Every input carries the sequence value `{{RBF_SEQUENCE_HEX}}`, which is the value that signals replace-by-fee. A step stuck behind a fee spike can be replaced by the same step at a higher fee rather than abandoned. [Fees and confirmation](/docs/participate/fees-and-confirmation) covers how to judge the rate and what to do when it goes wrong.

Once a block confirms your step, it is part of the world's history for good. Anyone replaying the same rules from the same chain reaches the same reading of it. That is the appeal, and it is also the reason to read the review screen carefully: nobody can undo it for you afterwards, including us.
