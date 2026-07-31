---
title: A festival history
nav: Festival history
description: Five stages keep five separate records across six days, and on the closing night they meet — so the festival ends as one thing instead of five.
socialTitle: A festival history
socialDescription: A complete ChainBloom plan — five paths, 900 blocks, 32 steps, and four meetings on the last night.
updated: 2026-07-31
order: 2
keywords: [festival, event, stages, live, example world]
related: [examples/musical-composition, examples/museum-exhibition, programs/organizations]
cta:
  title: Running one for an organization
  body: What a venue, festival, or council needs to agree before it opens a world in public.
  label: Public programs for organizations
  href: /docs/programs/organizations
---

:::lead
A festival produces a mountain of photographs and no record of what actually happened. This [[world]] gives each stage its own line, keeps those lines apart for six days, and brings them together once, on the last night, in front of people. What is left afterwards is not hosted by the festival and cannot be quietly edited by it.
:::

:::simulation
Harbour Lights 2026 is an illustration. It does not exist on any network, and no attendance or activity figures appear anywhere on this page. Every setting is inside the limits the protocol enforces.
:::

## The invitation

Two audiences need two messages. This is the one for the five stage managers, who are the people actually holding the [[path|paths]].

> **Harbour Lights 2026 — the stage record**
>
> Each of the five stages gets one path. You hold yours for the whole festival.
>
> After every set, add one moment: which act, how it went, one colour. Thirty seconds on your phone between changeovers. Your path holds 32 moments, which is five or six a day — enough for every set and not enough for a running commentary.
>
> You cannot add two moments to your stage inside the same block, so do not try to catch up on six sets at once. Post them as they happen.
>
> The world runs for 900 blocks from the moment it is created on Wednesday morning. That is about six days. Blocks are not clocks, so it may run out on Monday evening or Tuesday afternoon. Assume Monday.
>
> On the closing night the stages meet. Four meetings, arranged on stage, each one signed by two of you together, so that the five records end up joined. Be at the desk by 22:00 and stay until all four confirm.
>
> Then you finish your path and say how your stage ended: played out, cut short, or rained off. When the fifth path is finished, the festival record is closed for good.
>
> Each moment is a real Bitcoin transaction with a real fee, paid by the festival. Nothing here is for sale.

## The settings

:::figure caption="Harbour Lights 2026 — everything fixed at creation"
| Setting | Value | Why this number |
| --- | --- | --- |
| Title | `Harbour Lights 2026` | 19 bytes, inside the {{MAX_TITLE_BYTES}}-byte limit |
| Paths | 5 | One per stage. The limit is {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 900 blocks | About six days. The limit is {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 32 | About five a day. The limit is {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held in each path | {{CARRIER_VALUE_SATS}} satoshis | Released when the stage finishes its path |
| Most moments possible | 160 | Five paths of 32 steps |
:::

Create the world on the Wednesday morning, not the week before. The clock starts at the block that confirms the creation, and 900 blocks spent waiting for the gates to open are 900 blocks you do not have on the closing night.

## What one contribution means

Each moment is a [[bloom]] carrying four numbers. The festival publishes what they mean, once, in the crew handbook:

- **Glyph** — the kind of moment. Out of {{GLYPH_COUNT}} values (0 to {{MAX_GLYPH}}): 0 doors, 1 set started, 2 set ended, 3 guest appearance, 4 technical fault, 5 weather, 6 crowd moment, 7 last song.
- **Palette** — one of {{PALETTE_COUNT}} colours, 0 to {{MAX_PALETTE}}. Give each stage a fixed colour so the finished picture reads as five bands.
- **Motion** — {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}, for the shape of it: building, steady, sudden, falling away.
- **Magnitude** — one byte the stage manager judges. Use it for how hard the room went, and write down what your scale means before day one so it stays consistent.

The other move worth teaching the crew is the [[echo]]: a moment that points back at a specific earlier moment somewhere in the world. The main stage answers the fault on the small stage that pushed an act across. The moment it points at has to be confirmed in a strictly earlier block, so an echo can only answer something already fixed in the record.

## The closing night

A [[meeting|meet]] joins exactly two paths. Five stages therefore do not meet in one move — they meet in four, and the shape you choose is a decision about the festival.

The order that works on the night:

:::steps
### First pair, 22:00
Harbour and Quay sign together. Kiln and Long Field sign at the same time. These two meetings touch four different paths, so both can confirm in the same block.

### Second pair, once those confirm
Quay and Chapel sign. Then Long Field and Chapel. Each of these has to wait for the previous moment on its own path to be confirmed in an earlier block, so this takes at least two more blocks.

### Check before you celebrate
All four meetings must be confirmed, not merely broadcast. Only then is every stage joined to every other through the record.
:::

That is four meetings across at least three blocks. Allow an hour and be ready for it to take two. Blocks do not care that the headliner is finishing at 23:30.

:::warning
Do not schedule a chain of meetings back to back. A path cannot take its next step until its previous step is confirmed in an earlier block; try it too soon and the step is rejected as an unconfirmed lineage parent. Pair the stages so that independent meetings can share a block, as above.
:::

## How it ends

Each stage manager finishes their own path when their stage is done, giving a reason your handbook has already named: 1 played out, 2 cut short, 3 rained off. Finishing releases the {{CARRIER_VALUE_SATS}} satoshis held in that path.

When the fifth path is finished, the world has no live paths left and the record is closed. That is the outcome you want, because it means five people each decided their stage was done.

The other outcome is expiry. If the 900th block passes with paths still open, the world expires and each open path is marked expired, with a reason recording that the duration elapsed. It is not a failure of the record — everything confirmed is still there — but it reads as a festival that ran out rather than one that finished. Put "close the paths" on the get-out sheet, next to "return the radios".

## What the six days feel like

**Wednesday** is awkward. Five people who have never done this each add a doors moment and watch it confirm. It takes about ten minutes and then nobody thinks about it again until the first changeover.

**Thursday and Friday** the habit forms. A moment after each set becomes as normal as a set list photograph, except that it lands in a place the festival cannot rearrange in December when the story has become tidier.

**Saturday** somebody notices the step limit. Thirty-two is not many. Stages start choosing what deserves a moment, which is the point of the number.

**Sunday** the echoes start, because by then there is enough behind everyone to point at.

**The closing night** the four meetings happen on stage with the counts read out as they confirm. The crowd is watching five separate records become one joined record in about forty minutes, and nothing about that can be undone afterwards.

**Monday morning** five endings, one at a time, and a world that is complete.

:::note
The public index that would let a visitor browse this world is not switched on yet, so a festival running one today should plan to show it from its own screen rather than pointing people at a public site. See [what is running](/docs/help/status) before you print the programme.
:::
