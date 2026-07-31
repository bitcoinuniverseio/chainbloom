---
title: Example worlds
nav: Example worlds
description: Eight worlds worked out in full — the invitation to send, the settings to type in, the moment the paths meet, and how each one ends.
socialTitle: Eight example ChainBloom worlds
socialDescription: Complete plans you can copy — paths, duration, step limit, meeting, ending, and what it feels like to take part.
updated: 2026-07-31
order: 0
keywords: [examples, ideas, world design, invitation, settings, templates]
related: [participate/create-a-world, learn/when-paths-meet, start/chainbloom-in-60-seconds]
cta:
  title: Start with the garden
  body: Six beds, three months, one bed per neighbour — the easiest of the eight to run for real.
  label: A collaborative digital garden
  href: /docs/examples/collaborative-garden
---

:::lead
The hard part of a [[world]] is not the software. It is deciding what a moment means, how many [[path|paths]] there should be, and how the thing ends. These eight worlds answer those questions in full, so you can copy one instead of inventing from nothing.
:::

:::simulation
None of these eight worlds exists. Nothing here has been created on any network, and no numbers are reported from live activity — the public index is not switched on. See [what is running](/docs/help/status). Every setting in every example sits inside the limits the protocol enforces, so each one could be created exactly as written.
:::

## How to read an example

Each page is a plan, not an essay. They all carry the same six parts, in the same order:

- **The invitation.** The actual message you could send. If you cannot write a good invitation, the world is not ready.
- **The settings.** A table of the numbers to type into the creation form: paths, duration in blocks, steps per path, title.
- **What a contribution means.** The protocol stores small numbers. The invitation decides what they stand for — a sowing, a set, a chord, a memory.
- **The meeting.** Which paths meet, when, and what the two people are agreeing to.
- **The ending.** Who closes what, in what order, and what happens if nobody does.
- **The journey.** What a week in that world feels like from the inside.

Read the invitation and the ending first. Those two decide whether people take part.

## The limits every example respects

Four numbers are fixed by the protocol and cannot be argued with:

| Setting | Allowed | Notes |
| --- | --- | --- |
| Paths | {{MIN_LANES}} to {{MAX_LANES}} | Chosen once, at creation |
| Duration | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks | About {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days |
| Steps per path | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} | Counted per path, not per world |
| Held in each path | {{CARRIER_VALUE_SATS}} satoshis | Released when the path is completed |

Duration is counted in blocks, not days. Roughly 144 blocks is a day, 1,008 is a week, 4,320 is a month. Blocks arrive faster or slower than that, so the end of a world is a [[block height]], never a date on a calendar. Plan around the height, and let the date float.

## The eight worlds

:::cards
[**A collaborative digital garden**
Six neighbours, one bed each, three months from first sowing to last pull.](/docs/examples/collaborative-garden)

[**A festival history**
Five stages, five paths, and four meetings on the closing night.](/docs/examples/festival-history)

[**A musical composition**
Four voices over a month, where a meeting is two players signing one chord.](/docs/examples/musical-composition)

[**A community time capsule**
One path per year of a group's life, held for a year and opened out loud.](/docs/examples/community-time-capsule)

[**A classroom constellation**
One path per student across a term, so a class learns what confirmed means by waiting for it.](/docs/examples/classroom-constellation)

[**A museum exhibition**
Visitors shape a bounded work across the run of a show, at one staffed station.](/docs/examples/museum-exhibition)

[**A city or neighbourhood story**
One path per street, meeting where the streets meet, holding no names and no addresses.](/docs/examples/neighbourhood-story)

[**An artist and an audience**
One path belongs to the artist, the rest to the people answering back.](/docs/examples/artist-and-audience)
:::

## Changing one to fit you

Take an example and change one thing at a time. Fewer paths make a quieter world. A shorter duration makes people act. A lower step limit makes each moment count, because once a path reaches its limit the only move left is to complete it.

Two changes are worth thinking about hardest. The first is the ending: a world that nobody closes does not finish, it expires when the duration runs out. The second is the meeting, which is the only place two paths touch — read [when paths meet](/docs/learn/when-paths-meet) before you promise one in an invitation.
