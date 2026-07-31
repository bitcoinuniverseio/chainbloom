---
title: A musical composition
nav: Musical composition
description: Four players hold four voices for a month, a meeting is a chord two people sign together, and the piece is finished only when every voice has ended itself.
socialTitle: A musical composition
socialDescription: A complete ChainBloom plan — four paths, 4,320 blocks, 64 steps, and a score nobody hosts.
updated: 2026-07-31
order: 3
keywords: [music, composition, score, voices, example world]
related: [examples/festival-history, examples/artist-and-audience, learn/when-paths-meet]
cta:
  title: The one part to get right
  body: A chord is the only moment two voices touch. Read what a meeting actually is before you promise one.
  label: When paths meet
  href: /docs/learn/when-paths-meet
---

:::lead
Four people write one piece over a month without a conductor, a shared file, or an argument about whose version is current. Each voice keeps its own line. A chord happens only when two players sign the same moment together. The piece is not finished when a deadline passes — it is finished when every voice has decided to stop.
:::

:::simulation
Four Voices: Winter is an illustration. It does not exist on any network, no recording of it exists, and nothing here is a report of live activity. Every setting is inside the limits the protocol enforces.
:::

## The invitation

> **Four Voices: Winter**
>
> Four of us, one piece, one month.
>
> You hold one voice: bass, tenor, alto, or soprano. It is yours for the whole month and nobody else can write into it.
>
> A moment is one utterance in your voice — a pitch, a colour, an articulation, a dynamic. Your voice holds 64 of them. That is about two a day, and it is deliberately not enough to write a symphony. Choose.
>
> You may answer any moment already in the piece, including one of your own from three weeks ago, and say how you are answering it: as a reply, upside down, backwards, or moved to another pitch.
>
> Twice in the month we make a chord. Two of us sign one transaction together, at the same minute, and both voices carry on afterwards. A chord is the only place two voices touch, and it does not merge them.
>
> The piece runs for 4,320 blocks, about thirty days. It ends when all four of us have ended our own voice with a final cadence. If one of us disappears and never ends, the piece does not finish — it expires, and that will be visible in the record forever.
>
> Each moment is a real Bitcoin transaction with a real fee. {{CARRIER_VALUE_SATS}} satoshis sit in your voice until you end it. There is nothing to buy.

## The settings

:::figure caption="Four Voices: Winter — everything fixed at creation"
| Setting | Value | Why this number |
| --- | --- | --- |
| Title | `Four Voices: Winter` | 19 bytes, inside the {{MAX_TITLE_BYTES}}-byte limit; the colon is allowed |
| Paths | 4 | One per voice. The limit is {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 4,320 blocks | About 30 days. The limit is {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per voice | 64 | About two a day. The limit is {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held in each voice | {{CARRIER_VALUE_SATS}} satoshis | Released when that voice ends |
| Most moments possible | 256 | Four voices of 64 steps |
:::

Sixty-four steps in a month sounds generous until the second week. It is the constraint doing the composing: at two a day you cannot noodle, so each utterance has to be worth a fee and a block.

## What one moment means

A [[bloom]] carries four numbers, and the protocol has no idea they are music. The four of you agree the mapping before the first note and publish it with the piece:

| Field | Range | In this piece |
| --- | --- | --- |
| Glyph | {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}} | Pitch, chromatic, across two and a half octaves |
| Palette | {{PALETTE_COUNT}} values, 0 to {{MAX_PALETTE}} | Timbre — bowed, plucked, breathed, struck, and so on |
| Motion | {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}} | Articulation — held, short, swelling, falling |
| Magnitude | One byte | Dynamic, from silence to as loud as you can |

An [[echo]] is how a voice quotes. It points at one earlier moment anywhere in the piece and carries a relation — one of {{RELATION_COUNT}} values, 0 to {{MAX_RELATION}} — that says what it is doing to it. Agree four of them and leave the rest empty: 0 answer, 1 inversion, 2 retrograde, 3 transposition.

The moment you point at must be confirmed in a strictly earlier block, and on the same network. You can only quote something already in the piece. That single rule is what stops the score being rearranged after the fact.

:::note
The protocol stores the numbers, not the sound. Two ensembles reading this record will produce two different performances, and neither is wrong — the same way two galleries can draw the same [[world]] completely differently and both be correct. What is fixed is the order and the content of the moments, not their realisation.
:::

## A chord is two people signing at once

A [[meeting|meet]] joins exactly two [[path|paths]]. One transaction spends both voices' outputs and produces a new one for each, so both players sign the same transaction within the same few minutes. That is unusually true to what a chord is.

Two are scheduled:

- **Day 10, bass and soprano.** The outer voices agree once, early, so the piece has a frame.
- **Day 24, tenor and alto.** The inner voices answer it, late, when there is something to answer.

The chord carries a bridge style — one of {{BRIDGE_STYLE_COUNT}} values, 0 to {{MAX_BRIDGE_STYLE}} — for the interval, and an intensity byte for how hard it lands. Decide those two numbers together in the room, not over three days of messages. The arranging is the piece.

After a chord, both voices carry on with their own histories. Neither is absorbed into the other, and the record shows both of them continuing.

:::tip
Give each chord its own evening. The two players cannot both sign at leisure — the transaction is one object and it needs both signatures before it goes anywhere. Treat it as a rehearsal, because that is what it is.
:::

## How the piece ends

Ending a voice is a move, not a deadline. Each player finishes their own voice with a final cadence, using a reason byte the four of you agreed: 0 full close, 1 half close, 2 broken off. Ending releases the {{CARRIER_VALUE_SATS}} satoshis held in that voice.

The piece is finished when the fourth voice ends. Not before — a world is over only when it has no live paths left.

There are two ways it goes wrong, and both are worth saying out loud at the start:

- **Somebody runs out of steps.** Once a voice reaches 64 moments it can take no further step, though it may still be ended. A voice that spent everything by week two can only cadence.
- **Somebody disappears.** If a player stops answering, their voice stays open until the 4,320th block passes. Then the world expires and that voice is marked expired, with a reason recording that the duration elapsed. The piece exists, and it is complete in the sense that no more can be added, but the record shows three cadences and one silence.

The second is a real risk with four people and thirty days. It is also, if you are honest about it in the invitation, an interesting thing for a piece of music to be able to record.

## What the month feels like

**Days 1 to 3.** Everyone posts too much. Two moments a day feels like nothing until you have used eight of your 64 introducing yourself.

**Week one.** The voices are still four monologues. Nobody has quoted anybody. This is normal and it is uncomfortable.

**Day 10.** The first chord. Two players in a room signing one transaction and watching it confirm. Afterwards the piece stops being four diaries — the outer voices are joined at a fixed point and everyone can hear the frame.

**Week two and three.** The echoes start. Somebody inverts a phrase from day 4. Somebody answers it backwards. This is the part that only works because nothing can be edited: quoting is exact, because the thing being quoted cannot change afterwards.

**Day 24.** The second chord, and the arithmetic of the step limit becomes public. Everyone can see who has moments left.

**The last week.** People start writing towards their cadence. The final moments are slower and heavier, because everyone knows how few they have.

**The end.** Four cadences, and a fixed object: four lines of different length, two crossings, and an order that nobody can rearrange.
