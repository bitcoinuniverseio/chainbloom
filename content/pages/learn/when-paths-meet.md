---
title: How two paths meet without losing themselves
nav: When paths meet
description: A meeting lets two people share one moment in one transaction while both paths carry on unchanged: nothing is merged, swapped or handed over.
socialTitle: How two paths meet in ChainBloom
socialDescription: The emotional answer and the mechanical one. One transaction, two signatures, two paths that both continue.
updated: 2026-07-31
order: 4
keywords: [meet, meeting, rendezvous, collaboration, two paths, shared moment, both sign]
related: [learn/the-five-actions, participate/join-a-world, examples/musical-composition]
cta:
  title: Try it on a path of your own
  body: Take a path in a world someone opened, and you can arrange a meeting with anyone else holding one.
  label: Join a world
  href: /docs/participate/join-a-world
---

:::lead
Most ways of working together ask you to give something up: your version gets merged, your draft gets overwritten, your name moves down the list. A [[meeting]] in ChainBloom does the opposite. Two people share one moment, and afterwards both [[path|paths]] are still there, still separate, still theirs.
:::

## The thing people are actually afraid of

Ask someone why they did not join a collaborative project and the answer is rarely "I had nothing to add". It is usually some version of: *my part will disappear into it*.

That fear is well earned. A shared document keeps the last edit. A group mix keeps whoever mastered it. A merged branch keeps the merge. The record of who did what survives only as long as somebody bothers to maintain it, and only in one place, controlled by one party.

A meeting is designed against exactly that. It is a moment that belongs to two paths at once. It appears in both histories, at the same block, with the same shared numbers. Neither history swallows the other. A year later, someone reading either path finds the meeting, and finds the other person's path still running on its own line.

You can have the shared moment and keep the separate voice. That is the whole idea, and everything below is just how it is enforced.

## What actually happens

One transaction. Here is the shape of it, exactly as [`src/validator.ts`](repo:src/validator.ts) checks it.

**Two inputs, at the front.** The live [[carrier]] of the first path goes at input 0, the live carrier of the second at input 1. Each is exactly {{CARRIER_VALUE_SATS}} satoshis. Any fee inputs come after them, from input 2 onward.

**Ordered by lane id.** The two carriers must be sorted lexicographically by lane id, which is written `<worldId>:<laneNumber>`. Get the order wrong and validation returns `RENDEZVOUS_LANE_ORDER`. You are unlikely to hit this by hand: `buildRendezvousPsbt` sorts the two participants for you before it builds anything.

**Three outputs that matter.** Output 0 is the marker, value zero, holding the operation and its numbers: bridge style 0-{{MAX_BRIDGE_STYLE}}, intensity 0-255, glyph 0-{{MAX_GLYPH}}, palette 0-{{MAX_PALETTE}}. Output 1 is the successor carrier for the path that came in at input 0. Output 2 is the successor carrier for the path that came in at input 1. Each successor is exactly {{CARRIER_VALUE_SATS}} satoshis and a Taproot output, the same {{P2TR_SCRIPT_BYTES}}-byte script shape the paths already used.

**Two signatures.** Each person signs for their own carrier. Nobody can sign for the other. Until both signatures are present the transaction is not valid and cannot confirm; a missing one shows up as `MISSING_WITNESS` or `MISSING_TAPROOT_SIGNATURE`.

Count the [[outpoint|outpoints]] and the arithmetic tells the story on its own: two paths in, two paths out. There is no output anywhere in that transaction that represents a combined path, because the protocol has no such thing.

:::note
The successor for each path must be {{CARRIER_VALUE_SATS}} satoshis and a Taproot output. The protocol does not require it to use the same key as before, which is how a path can be moved to a fresh key while continuing. What it will never accept is one successor where two are required.
:::

## What a meeting needs in practice

Three conditions, and they are all checkable before anyone signs.

**Both paths must be live.** A path that has been closed, expired, or abandoned has no carrier left to spend. There is nothing to bring to the meeting.

**Each path must still be allowed to move.** Every carrier is checked against its own [[world]]. If that world is no longer active, or the current block height has reached its end height, the step fails with `WORLD_ENDED`. If the path has already used all of the steps its world allows (up to {{MAX_MAX_STEPS}}), it fails with `MAX_STEPS_REACHED`. And each path's previous event must already be confirmed in an earlier block, or the step fails with `UNCONFIRMED_LINEAGE_PARENT`. Two people cannot meet on a path that moved a moment ago; the parent step has to settle first.

**Two people have to coordinate.** This is the real cost of a meeting, and no protocol can remove it. One side builds the unsigned [[psbt]], both sides read it, both sides sign, and one of them broadcasts. You are agreeing on a shared moment, so you have to actually agree.

:::simulation
An invented example, because the public index is not switched on yet. Two people are inside a music world. Ana holds path 2, Ben holds path 5. They agree that bar 32 is where their lines cross, and pick bridge style 4 with intensity 180. Ben builds the transaction, sends the unsigned PSBT to Ana, and she checks that it spends exactly her carrier and returns exactly one successor for path 2. Both sign. One transaction confirms. Path 2 has a new moment; path 5 has a new moment; the two moments name each other; both paths keep going, and both step counts went up by one.
:::

## What a meeting is not

It helps to be blunt, because every other system that puts two people in one transaction means something financial by it.

- **Not a transfer.** No value moves from one person to the other. Each side puts in {{CARRIER_VALUE_SATS}} satoshis and each side gets {{CARRIER_VALUE_SATS}} satoshis back out on its own successor.
- **Not a trade or a swap.** The paths do not change hands. After the meeting each person still controls the successor of the path they brought.
- **Not a merge.** Neither path is absorbed. The world still has the same paths it had before, up to {{MAX_LANES}} of them, each with its own line of history.
- **Not a claim over the other person.** A meeting records that two paths shared a moment. It records nothing about identity, authorship, credit, or any right over what the other person makes next.
- **Not permission for anything later.** Meeting once does not let either side act on the other's path afterwards. The next step on each path needs that path's own signature, exactly as before.

## Why this shape matters

Collaboration usually forces a choice between two bad options: stay separate and never really make anything together, or combine and let the strongest voice define the result. A meeting is a third option, and it is only possible because the ordering is settled by Bitcoin rather than by whoever hosts the project.

That has some practical effects worth planning for.

It makes meetings **rare and deliberate**. Because both people must sign, a meeting cannot happen by accident or be done to you. Worlds tend to end up with a few meetings that mean something, rather than a constant blur of interaction.

It makes them **legible years later**. The shared numbers are in both histories at the same block height. Anyone replaying the chain reconstructs the same meeting, in the same place, without asking this site or any other for permission.

It makes them **a good structure to design around**. A festival world where the stages meet on the closing night, a class where two students meet when their projects converge, a composition where two voices meet at a chord: these are the same move each time, and it means the same thing each time.

For a longer worked version, read [a musical composition](/docs/examples/musical-composition), where every meeting is a chord and the paths are voices that keep singing afterwards.
