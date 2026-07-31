---
title: A classroom constellation
nav: Classroom constellation
description: One path per student across a term, so a class learns what "confirmed" means by waiting for it instead of being told about it.
socialTitle: A classroom constellation
socialDescription: Eight students, eight paths, one term. The invitation, the settings, and the teacher's notes on consent, cost, and keys.
updated: 2026-07-31
order: 5
keywords: [classroom, school, students, teaching, term, education, lesson]
related: [programs/education, audiences/educators, learn/confirmed-and-unconfirmed]
cta:
  title: Plan the term before the first block
  body: Consent forms, who funds the fees, who holds the keys, and what to do when a student leaves.
  label: Read the education notes
  href: /docs/programs/education
---

:::lead
A class of eight finishes the term with one picture none of them could have made alone, and every student can point at the exact part that is theirs. The teaching happens on the way there: a student who wants to add a second moment before the first one has confirmed learns what confirmation is in about ten minutes, from the network rather than from you.
:::

:::simulation
This world is invented as a worked example. It is not a real class, a real school, or a real record on any network. The settings are legal values you could use; the names are made up.
:::

## The invitation

Print this. Read it out on the first day. It is the whole design, and it fits on one side of paper.

> **Ridge Valley Term 3**
>
> There are eight lines in this picture and one of them is yours for the whole term. Once a week you add one moment to your line. You pick a shape, a colour set, a movement, and how strong it is: four numbers you choose and have to be able to explain.
>
> Twice this term your line may meet someone else's. A meeting means you and one other person sign the same transaction on the same day, and afterwards both lines keep going. Nobody's line gets absorbed.
>
> On the last day you end your own line on purpose. That ending is part of the picture.
>
> Nothing you add can be edited afterwards. Not by you, not by another student, not by me.

The last sentence is the lesson. Everything else is scaffolding for it.

## The settings

A [[world]] fixes its shape at creation and can never be edited, so these five decisions are the ones to argue about before you spend anything.

:::figure caption="Ridge Valley Term 3: the settings, and the range the protocol allows"
| Setting | This world | What the protocol allows |
| --- | --- | --- |
| Title | `Ridge Valley Term 3` | up to {{MAX_TITLE_BYTES}} ASCII bytes, pattern `{{TITLE_PATTERN}}` |
| Paths | 8 (one per student) | {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 6,000 blocks, about six weeks | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 20 | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held per live path | {{CARRIER_VALUE_SATS}} satoshis | fixed by the protocol |
| Most moments possible | 160 | eight paths of 20 steps |
:::

Eight paths is the most a world can hold, so eight is the largest class this shape fits. A class of thirty needs pairs or table groups sharing a [[path]], which is a different and slightly harder lesson about who speaks for a group.

Twenty steps sounds generous for six weekly moments, and it should be. A step gets used up by a meeting as well as by a moment, and students make mistakes that confirm anyway. Headroom is kindness. When a path reaches its limit the next step is refused with `MAX_STEPS_REACHED`, though ending the path is still allowed at that point, so a student can always finish even if they have run out of moments.

## What one contribution means

A weekly moment is a [[bloom]], and on the chain it is four small numbers:

- **Glyph**: the shape. {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}}.
- **Palette**: the colour set. {{PALETTE_COUNT}} values, 0 to {{MAX_PALETTE}}.
- **Motion**: how it moves. {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}.
- **Magnitude**: one byte for how strongly it lands.

That is all that is written. No text, no image, no name. The meaning lives in the class key you print and pin up: *glyph 12 is "something I finished", palette 3 is "the week it rained"*. Two classes can use the same numbers to mean different things, and both are right.

Say this out loud, because it changes how students treat the exercise: the drawing on the screen is one reading of those numbers, not the record itself. Positions are derived from the world's seed and each event's transaction id, and rendering is deliberately outside the rules everyone must agree on. A different viewer may lay the same term out differently and still be correct.

## The meeting moment

A [[meeting]] is the only action that needs two people at once. Both paths' outputs are spent by one transaction, so both students have to sign the same thing before it goes anywhere. There is no way to meet somebody by accident and no way to meet them without their key.

Run it as a scheduled event, not a surprise. Two students agree what the meeting is about, pick a bridge style (one of {{BRIDGE_STYLE_COUNT}}) plus a shared glyph and palette, and one of them builds the transaction. When it confirms, both paths have advanced one step and both are still their own line.

Budget for it: a meeting spends a step on **each** of the two paths, not one between them. Two meetings per student across the term is four of a student's twenty steps.

## How the term ends

Two endings exist, and the difference is worth teaching.

**On purpose.** Each student ends their own path with a [[close|complete]], carrying a reason number the class agrees in advance, say `1` for finished and `2` for stopped early. When the last live path is completed the world's status becomes `ENDED`. Everything about that ending was chosen by somebody.

**By the clock.** The world's end height is its creation height plus its duration, and it is exclusive: at that block the world becomes `EXPIRED`, and every path still live becomes `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. Nothing is broken, but nobody decided it.

Plan the last lesson at least a week before the end height so the class gets the first kind. 6,000 blocks is *about* six weeks. Blocks do not arrive on a timetable, and a slow fortnight can move your deadline by a day or more.

## What a student does, start to finish

:::steps
### Pick the four numbers
On paper first, with a reason for each. This is the actual creative work and it should take longer than the rest.

### Build the step
In the ChainBloom workspace in [InScribe](app), the Act surface turns the four numbers into an unsigned transaction and shows a preview: which path it moves, what the outputs are, the miner fee, the change, and any warnings.

### Read the preview out loud
Before signing. Every time. The habit is the point.

### Sign and broadcast
The transaction now sits in the waiting room every Bitcoin transaction sits in. Nothing about it is final yet.

### Wait for the block
When a miner includes it, the step is [[confirmation|confirmed]] and joins the shared order. This is the wait that teaches.
:::

The wait is not dead time. A path can take at most one step per block, because the protocol rejects a step whose own parent is not yet confirmed in an earlier block. The issue code is `UNCONFIRMED_LINEAGE_PARENT`. A student who tries to add two moments in one lesson will meet that rule directly, which is a far better explanation than any diagram.

## The teacher's notes

### Consent

The record is public and permanent, and you cannot take it back for a family that changes its mind in week four. Get written permission before the world is created, and be specific about what is actually published: four numbers per moment, a timestamp, and Bitcoin addresses, with no names and no images. The linking risk is off-chain. If the school newsletter says which student holds path 3, that link is now permanent too.

### Cost

Two costs, both real. Each live path holds {{CARRIER_VALUE_SATS}} satoshis while it is alive, carried from step to step. Each step also pays a miner fee that changes with demand and is not refundable. See [fees and confirmation](/docs/participate/fees-and-confirmation) before you budget. Eight paths taking twenty steps each is up to 160 confirmed moments, so estimate at the top of the range, not the bottom. Fund it from a school account, not a student's.

### Who holds the keys

:::safety
Decide this before the world exists, because it cannot be renegotiated later.

**You hold all eight keys.** Students choose the numbers, you sign. Simplest, cheapest, and no student can lose a path. The custody lesson is lost with it.

**Each student holds their own key.** The lesson is real, and so is the loss. If a key goes, that path can never move again: no reset, no recovery, no administrator. It will sit still until the world's duration elapses and it becomes `EXPIRED`.

A middle option works well: you hold the keys, and each student keeps a written record of the numbers they chose and the transaction ids they produced, so they can verify their own line independently of you.
:::

### A student who leaves

You have three options and no fourth.

1. **End the path.** Complete it with a reason that means "stopped early". The line has a deliberate ending in the picture and stops costing anything.
2. **Hand it on.** A path's next holder is decided when a step is built. The successor output can be sent to a different key than the one that signed, so a normal weekly moment can also pass the path to a new student. The builder takes the successor key as an argument, in [src/builders.ts](repo:src/builders.ts).
3. **Leave it.** It sits at its last moment until the world expires. Honest, and sometimes the truest record of what happened.

:::warning
What you must not do is move that output with an ordinary wallet send. Any confirmed spend of a live path output that is not a valid ChainBloom event marks the path `ABANDONED` with the reason `INVALID_CONFIRMED_SPEND`. Nothing is invented to replace it, and there is no undo. Keep path outputs in a wallet that will not sweep them into a payment.
:::

### What is running today

Students can build, sign, and broadcast. What they cannot yet do is open a public page that lists every world and browse the class constellation from home. The public index is not switched on. Check [what is running](/docs/help/status) before you promise a class anything, and keep your own copy of the transaction ids in the meantime.
