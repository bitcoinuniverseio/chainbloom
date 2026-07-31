---
title: A community time capsule
nav: Community time capsule
description: One path for each year of a group's life, filled quietly over twelve months and opened out loud on a single evening that everyone can put in the diary.
socialTitle: A community time capsule
socialDescription: A complete ChainBloom plan: eight paths, the longest duration the protocol allows, 24 steps each, and an ending held in public.
updated: 2026-07-31
order: 4
keywords: [time capsule, anniversary, memory, community, example world]
related: [examples/collaborative-garden, examples/classroom-constellation, programs/organizations]
cta:
  title: Doing this as a group
  body: What a choir, club, school, or society should agree before it opens a year-long world in public.
  label: Public programs for organizations
  href: /docs/programs/organizations
---

:::lead
A buried box is a good idea with one weakness: somebody has to still have the key, the box, and the address in ten years. This [[world]] does the same job without a custodian. Eight years of a group's life, one [[path]] each, filled across twelve months, and opened deliberately on one evening in front of everybody.
:::

:::simulation
Ridgeway Choir 2018-2025 is an illustration. No such world exists on any network, and no membership or activity numbers appear anywhere on this page. Every setting is inside the limits the protocol enforces.
:::

## The invitation

> **Ridgeway Choir 2018-2025: the capsule**
>
> Eight years, eight paths. One for every year since we started.
>
> Each year has a keeper: somebody who was there. Over the next twelve months you put up to 24 moments into your year: a first, a loss, a joke that stopped being funny, a place we sang, a person who left. Two a month is the pace. It is not many, and that is the point.
>
> You can answer another year. If 2019 records the church with the broken heater, 2023 can point straight at that moment and answer it. You can only point at something already in the record, so the capsule builds forwards and nothing behind you moves.
>
> Halfway through, in the spring, two years that shared a lot of people will meet: one moment signed by both keepers together, in the same room.
>
> On the anniversary evening we open it. We close the eight paths one at a time, in year order, and read out what is in each of them as it closes. When the eighth closes, the capsule is sealed and nobody can add to it again, including the eight of us.
>
> Two things to know before you say yes. Each moment is a real Bitcoin transaction with a real fee, paid from the choir account. And {{CARRIER_VALUE_SATS}} satoshis sit inside each year for the whole twelve months. If that output is spent by accident, that year cannot be continued and nothing takes its place. Keeper training is on the 14th and it is not optional.

## The settings

:::figure caption="Ridgeway Choir 2018-2025: everything fixed at creation"
| Setting | Value | Why this number |
| --- | --- | --- |
| Title | `Ridgeway Choir 2018-2025` | 24 bytes, inside the {{MAX_TITLE_BYTES}}-byte limit; digits and `-` are allowed |
| Paths | {{MAX_LANES}} | One per year, and the most a world may have |
| Duration | {{MAX_DURATION_BLOCKS}} blocks | About {{MAX_DURATION_DAYS}} days, and the longest a world may stay open |
| Steps per path | 24 | Two a month. The limit is {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held in each path | {{CARRIER_VALUE_SATS}} satoshis | Held for the whole year, released when that year is closed |
| Most moments possible | 192 | Eight paths of 24 steps |
:::

This world sits on two ceilings at once. Eight paths is the most the protocol allows, and {{MAX_DURATION_BLOCKS}} blocks is the longest duration it allows. A ninth year would need a second world. Thirteen months would need a second world too.

:::warning
The end is a [[block height]], not a date. {{MAX_DURATION_BLOCKS}} blocks is about {{MAX_DURATION_DAYS}} days only if blocks arrive every ten minutes, and over a year the drift can be a fortnight in either direction. Work out the end height on the day the world is created, write it on the wall, and book the anniversary evening comfortably before it, not on the calendar date you first had in mind.
:::

## What one moment means

A [[bloom]] carries four small numbers. The choir decides what they stand for, writes it on one sheet of paper, and does not change it afterwards:

- **Glyph** stands for the kind of memory. {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}}: 0 a first, 1 a place, 2 a person joining, 3 a person leaving, 4 a performance, 5 a mistake, 6 a joke, 7 a loss.
- **Palette** is one of {{PALETTE_COUNT}} colours, 0 to {{MAX_PALETTE}}. Give each year its own colour and the finished capsule reads as eight bands.
- **Motion** has {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}: quiet, sudden, slow, ongoing.
- **Magnitude** is one byte. How much it mattered, judged by the keeper. Say plainly in the invitation that this is one person's judgement, so nobody mistakes it for a fact.

An [[echo]] is a year answering another year. It points at one earlier moment and carries a relation saying how it answers: an explanation, a consequence, a repetition. The moment it points at must be confirmed in a strictly earlier block, so the capsule can only ever build forwards.

## The one meeting

A [[meeting|meet]] joins exactly two paths, and this world uses a single one, in the spring.

Pick the two years that shared the most people, say 2021 and 2022. The two keepers sit down together and record one shared moment: the thing both years contained. Because it is one transaction spending both years' outputs, both keepers sign it at the same sitting. Afterwards both years carry on independently. Nothing is merged and no year is folded into another.

One meeting is enough. In a capsule the meeting is not a mechanic to be repeated; it is the moment the group says out loud that two of its years were the same story.

## How it is opened

The whole design points at one evening.

:::steps
### Work out the end height early
Take the height the world was created at, add {{MAX_DURATION_BLOCKS}}, and put the result somewhere visible. Any step attempted at or after that height is rejected, and the world is expired by then.

### Book the evening two weeks before it
Two weeks of blocks is a comfortable margin against drift. Do not cut it fine to make the date look neat.

### Close the years in order, one at a time
Eight closes, 2018 first. Each keeper reads their year aloud as it goes. A close carries one reason byte, and it is recorded permanently with that path. Agree the numbering in advance, for example 0 kept, 1 hard year, 2 the year we nearly stopped.

### Wait between closes
Take the time. Each close is a real transaction and the room is watching it confirm, which is a better ceremony than it sounds.

### The eighth close seals it
When the last year closes, the world has no live paths left. It is over. Nobody can add to it again: not the keepers, not whoever made it, not us.
:::

If the evening never happens, the world expires at the end height. Every open year is marked expired, with a reason recording that the duration elapsed. Everything confirmed is still there and still readable. But the capsule was never opened; it simply ran out. For a group marking eight years, that difference is the whole point, so treat the closing evening as the event and the twelve months as the preparation.

## Keeping eight outputs alive for a year

This is the part that needs real care, because the world lasts twelve months.

Each year is held by one {{CARRIER_VALUE_SATS}}-satoshi output. No wallet knows what a ChainBloom path is yet, so an ordinary payment can select that output as an input and spend it. If that spend confirms, the year is marked abandoned, with a reason recording that a confirmed spend was not a valid ChainBloom action. Nothing is invented to replace it. The year stops there.

:::safety
Eight keepers, eight wallets, twelve months. Hold each path in a wallet that is not used for spending, label the output, and check it after any large payment. [Protect your path](/docs/participate/protect-your-path) has the full list of what to check. Do not put all eight in one person's daily wallet because it is simpler. It is simpler right up until the day it is not.
:::

## What the year feels like

**Month one.** Eight keepers each add one moment and watch it confirm. Everyone talks about the mechanics and nobody talks about the memories yet.

**Months two to four.** The pace settles at about two a month, which is slow enough that people think before posting. Somebody drops out and has to be replaced, which is a thing you should plan for on day one. Decide now who the reserve keeper is.

**The spring meeting.** Two keepers in a room signing one transaction. It is the first time the eight lines touch, and it changes how the others treat their years.

**Months six to nine.** The echoes start, because by then there is enough behind everybody to point at. Somebody in 2024 answers a moment from 2018 and the capsule stops being eight lists.

**The last month.** Step counts get read out. Some years have moments to spare, some are full. Nobody is adding filler by this point.

**The evening.** Eight closes, in order, read aloud. Then a fixed thing that nobody hosts, nobody owns, and nobody can quietly correct, which is more than a buried box in a car park ever manages.
