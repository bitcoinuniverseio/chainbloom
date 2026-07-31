---
title: Watch a world grow
nav: Watch a world grow
description: A three-path world from its first moment to its last, in nine steps you can follow with no wallet, no signing, and nothing spent.
socialTitle: Watch a world grow
socialDescription: Three paths open, blooms appear, an echo answers, two paths meet, one path is completed. Two minutes, no wallet needed.
updated: 2026-07-31
order: 3
keywords: [demo, walkthrough, simulation, example, visual, see it]
related: [learn/how-a-world-grows, learn/the-five-actions, participate/join-a-world]
cta:
  title: Now read how it really works
  body: The same nine moments, explained as rules instead of pictures.
  label: How a world grows
  href: /docs/learn/how-a-world-grows
---

:::lead
Two minutes here and you will be able to explain ChainBloom to someone else. Watch three paths open, grow, answer each other, meet once, and end. Nothing below asks for a wallet, a signature, or a satoshi.
:::

:::simulation
This world is invented for this page. It is not a real Bitcoin history, the transactions do not exist, and no live worlds can be read yet — [what is running](/docs/help/status) says why.
:::

## The nine moments

:::demo name=world-growth
**1. The world opens.** One transaction creates the [[world]] and, in the same moment, all three of its [[path|paths]]. The creator has already fixed everything that cannot change: three paths, how many blocks the world stays open, and how many steps each path may take. Paths are numbered from zero, so this world holds path 0, path 1, and path 2. In the walkthrough below they are called paths 1, 2 and 3 to keep the reading easy.

**2. Path 1 blooms.** Someone adds the first moment to path 1 — a [[bloom]]. It is a small set of choices: a shape, a colour, a movement, a size. It waits in the queue and then a block confirms it. Now path 1 has a first step and a fixed place in the order.

**3. Path 2 blooms.** A different person adds the first moment to path 2, in a later block. Path 2 knows nothing about path 1. It does not need to.

**4. Path 3 blooms.** A third person opens path 3 the same way. Three paths are now alive, each one step long, each held by its own small output.

**5. Path 2 echoes path 1.** The next person on path 2 adds a moment that names the first bloom on path 1 by its transaction id — an [[echo]]. It is a reply that reaches across, and it changes nothing on path 1. The moment it points at stays exactly as it was. An echo can only name something already confirmed in an earlier block, so it can never point at the future.

**6. Paths 1 and 2 meet.** Two people act together in one transaction: a [[meeting]]. The moment belongs to both paths at once. Afterwards there are still three paths, all three still separate, and both participants still hold their own. Nothing merged and nothing was absorbed.

**7. Path 3 keeps going.** Path 3 has been growing the whole time, ignoring the other two, and adds another bloom here. Paths are not obliged to interact. A world where only one path ever speaks to another is still a world.

**8. Path 1 blooms again.** After the meeting, path 1 carries on under whoever holds it. The meeting is now part of its history, not the end of it.

**9. Path 1 is completed.** Its holder ends it on purpose — a close. No further step can ever be added to path 1. The {{CARRIER_VALUE_SATS}} satoshis that were being carried from step to step go back to an address they choose. Paths 2 and 3 are untouched and still open, and the world stays open until its last live path is finished or its time runs out.
:::

## The order comes from blocks, not from this page

Every moment above waited for a block. That is not decoration — it is the only reason the order can be argued about at all.

A step is refused if the step it builds on is not already confirmed in an **earlier** block. Two steps on the same path cannot share a block, and they cannot be reordered later by anyone with a database. The protocol has a name for the refusal, `UNCONFIRMED_LINEAGE_PARENT`, listed with every other check in the [validation rules](/docs/reference/validation-rules).

So when a reader in five years asks whether the echo in moment 5 came before or after the meeting in moment 6, there is nothing to discuss. The blocks already answered.

## The paths stay separate the whole time

Each path is held by exactly one live output of {{CARRIER_VALUE_SATS}} satoshis, its [[carrier]]. Taking a step means spending that output and creating the next one. A path is therefore a single chain with no branches, because Bitcoin lets an output be spent once and once only.

Three paths means three of those chains running side by side. They can be held by three different people, or by one person, or change hands over the life of the world. Path 3 in the walkthrough never interacts with anything and is no less part of the finished history.

A world may have between {{MIN_LANES}} and {{MAX_LANES}} paths. The number is fixed when the world opens and cannot grow later, so an invitation for four people stays an invitation for four people.

## A meeting is not a merge

This is the part most people expect to work differently, so it is worth being blunt.

At moment 6, paths 1 and 2 share one moment. What that does **not** do:

- It does not join the two paths into one.
- It does not move either path's earlier steps.
- It does not let either participant act for the other afterwards.
- It does not reduce the world to two paths.

What it does: it puts one moment in both histories, signed by both holders in the same transaction, and hands each path back its own next step. Both carry on independently the moment it confirms.

That is the whole design position. Collaboration that costs somebody their thread is not collaboration, it is absorption. See [when paths meet](/docs/learn/when-paths-meet) for how the two sides are ordered and what they each have to sign.

## The ending was decided when the world opened

Nothing in moments 2 through 9 changed how the world can end. That was set in moment 1.

The creator fixed a lifetime in blocks, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}}. When the chain reaches that height, the world expires and every path still alive expires with it — no vote, no extension, no appeal to anyone. The creator also fixed how many steps a single path may take, between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}. A path that reaches its limit can no longer bloom, echo, or meet. It can still be completed on purpose, which is the difference between stopping and finishing.

So there are two clocks running from the first second, and everyone taking part can read both. That is what makes the last few steps of a world feel like the last few steps rather than more of the same.

## What this walkthrough leaves out

It is a picture, so it hides the parts that cost you something:

- Every one of those nine moments is a real Bitcoin transaction with a real miner fee. See [fees and confirmation](/docs/participate/fees-and-confirmation).
- Each one has to be signed in a wallet, and once confirmed it cannot be undone by anybody.
- The colours and positions you see are one gallery's reading. Rendering is not part of the rules, so two viewers may draw the same confirmed world differently and both be right.
- No wallet protects a path's carrier yet, so ordinary coin selection can spend it by accident and end the path. [Protect your path](/docs/participate/protect-your-path) explains what to check.

When you are ready to take a step yourself rather than watch one, [join a world](/docs/participate/join-a-world) is the shortest route in.
