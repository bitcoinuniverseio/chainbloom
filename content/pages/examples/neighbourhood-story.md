---
title: A city or neighbourhood story
nav: Neighbourhood story
description: One path per street, meeting where the streets actually meet, with a record that holds no addresses and no names.
socialTitle: A city or neighbourhood story
socialDescription: Seven streets, four and a half months, one shared record. Includes the privacy rules that matter when a path stands for a place people live.
updated: 2026-07-31
order: 7
keywords: [neighbourhood, city, community, streets, local history, privacy, place]
related: [programs/moderation-and-privacy, audiences/communities, participate/protect-your-path]
cta:
  title: Agree the rules before the first step
  body: Who speaks for a street, what the legend may name, and what never goes in writing.
  label: Read moderation and privacy
  href: /docs/programs/moderation-and-privacy
---

:::lead
Seven streets keep seven separate lines for four and a half months, and the lines cross exactly where the streets do. What you get at the end is a record of a place that no council, no landlord, and no platform can quietly revise, and that contains no address, no name, and no photograph of anybody.
:::

:::simulation
Eastbank is invented as a worked example. There is no such neighbourhood project and no such record on any network. The settings are values the protocol accepts; the streets are made up.
:::

## The invitation

This went through seven letterboxes and onto the noticeboard outside the shop.

> **Eastbank Seven Streets**
>
> From April to August, each of our seven streets keeps its own line in one shared record.
>
> Roughly twice a week your street adds a moment to its line: a shape, a colour set, a movement, and how strongly it lands. Four numbers. What they mean is written on the legend on the noticeboard, and we agreed it together at the meeting in March.
>
> Where two streets meet in real life, their two lines can meet in the record. Both streets have to agree and both have to sign, on the same day, in the same room. Afterwards both lines carry on as themselves.
>
> Nothing about this record names anybody, and nothing about it can be edited later, including by whoever started it.

The reason to spell out the last sentence on a public noticeboard is that most neighbours have been asked to contribute to something like this before, and have watched it disappear when the organiser lost interest or the website stopped paying its bill.

## The settings

A [[world]] fixes its shape at creation. Nothing below can be edited afterwards, so this belongs on the agenda of the first meeting, not the last.

:::figure caption="Eastbank Seven Streets: the settings, and the range the protocol allows"
| Setting | This world | What the protocol allows |
| --- | --- | --- |
| Title | `Eastbank Seven Streets` | up to {{MAX_TITLE_BYTES}} ASCII bytes, pattern `{{TITLE_PATTERN}}` |
| Paths | 7 (one per street) | {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 20,000 blocks, about four and a half months | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 40 | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held per live path | {{CARRIER_VALUE_SATS}} satoshis | fixed by the protocol |
| Most moments possible | 280 | seven paths of 40 steps |
:::

Seven [[path|paths]] and 40 steps each is at most 280 moments, about two a day across the run, or roughly two a week per street. That rhythm is deliberate. A neighbourhood record made daily becomes a chore by week three; one made twice a week stays something people look forward to.

The harder decision is not in the table. It is **who holds the key for a street**, because a path can only be moved by whoever holds it. Two arrangements work in practice:

- **A steward per street.** One named neighbour holds the key and signs what the street decides. Simple, and it concentrates both the effort and the responsibility.
- **A single operator, seven keys.** One person or organisation signs for all seven, and each street's choices are made in the open and written down before signing. Slower to feel like ownership, harder to lose.

There is no arrangement where a street votes on chain. The protocol has one signature per path and no notion of a group.

## What one contribution means

A street's moment is a [[bloom]], and on the chain it is four small numbers:

- **Glyph**: the shape. {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}}.
- **Palette**: the colour set. {{PALETTE_COUNT}} values, 0 to {{MAX_PALETTE}}.
- **Motion**: how it moves. {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}.
- **Magnitude**: one byte for how strongly it lands.

Nothing else is written. No street name, no coordinate, no photograph, no sentence. That is the single most important fact on this page and the rest of it follows from it.

The meaning lives in the legend: *glyph 4 is a building coming down, glyph 5 is one going up, palette 2 is the week of the flood.* Keep the legend on the noticeboard, in the local paper, and in three people's hands. The record will outlive all of them; the legend will not unless somebody looks after it.

### Pointing back at an earlier moment

An [[echo]] is a step that names an earlier event and says how it relates to it: a relation number, one of {{RELATION_COUNT}}, plus a glyph and a palette. It is the right action for *the same corner, one season later*, or *this is what that argument turned into*.

Two rules bite in practice. The event you point at must already be confirmed in a strictly earlier block, or the step is rejected with `UNCONFIRMED_GRAFT_TARGET`. And it must be an event this reader knows about on the same network, or you get `UNKNOWN_GRAFT_TARGET`. Keep the list of transaction ids somewhere the stewards can reach, or nobody will be able to point at anything.

## The meeting moment

The rule that makes this world worth building: **two lines may meet only where the two streets meet.**

A [[meeting]] spends both paths' outputs in one transaction, so both stewards sign the same thing. Do it standing at the junction. Mill Lane and Rope Street meet at the bridge, so that meeting happens on the bridge; the two streets that never touch never meet in the record either, and their absence says something true about the place.

Choose a bridge style (one of {{BRIDGE_STYLE_COUNT}}) to say what kind of crossing it was, and give the legend a line for each junction. Budget for it: a meeting spends one step on **each** of the two paths. Ten junction meetings costs 20 of your 280 steps.

## How it ends

At the end height (creation height plus duration, exclusive) the world becomes `EXPIRED` and every path still live becomes `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. Nobody chose that; the clock did.

The better ending is to [[close|complete]] each of the seven paths in the last week, each with a reason number the legend explains, and to do it in public. A street that finishes its line at the street party has an ending. A street whose line stops because nobody remembered has a silence, and the record cannot tell the two apart unless you make it.

20,000 blocks is *about* four and a half months. Blocks do not keep to a calendar, so set the closing date a fortnight before the end height and keep the margin.

## What a neighbour does

:::steps
### Bring something to the meeting
The street decides its moment together (an event, a change, a loss, a repair) and translates it into four numbers using the legend.

### Build the step
The steward opens the ChainBloom workspace in [InScribe](app). The Act surface produces an unsigned transaction and a preview showing which path moves, the outputs, the miner fee, the change, and any warnings.

### Read the preview aloud
In front of the people whose moment it is. This is the last point at which anything can be changed.

### Sign and broadcast
One signature, from the steward's key.

### Wait for a block, then write the id on the noticeboard
Until a miner includes it, nothing is settled. Once it confirms, the transaction id is the receipt, and anybody can check it without asking the steward.
:::

A path can take at most one step per block, because a step whose own parent is not yet confirmed in an earlier block is rejected with `UNCONFIRMED_LINEAGE_PARENT`. In practice: one moment per street per meeting, and no rushing two through at once.

## Privacy of place and of people

### Place

The chain holds no addresses. Your legend does, and the legend is the part you control, so set its granularity deliberately.

:::safety
- Make a path a **street or a district**, never a building, a shop, or a household. A path labelled `3 Mill Lane` identifies a family permanently.
- Choose labels that at least twenty households share. If a street has four homes, fold it into a wider district.
- Never publish a schedule saying which street contributes on which evening. That is a public timetable of when specific people are out.
- Do not put a coordinate, a plot number, or a photograph of a front door in the published legend. The record does not need them and cannot forget them.
:::

There is an asymmetry worth stating to the group: the chain record is permanent and the legend is not. You can stop publishing a legend, but you cannot recall copies of it, and you cannot detach it from a record that will still be there. Treat everything you write beside the world as though it is as permanent as the world.

### People

Each step is signed by a key, and a key that gets reused links this project to whatever else that address has done. That is the ordinary Bitcoin privacy problem and it does not go away here.

- Fund the world from a wallet kept for this project only.
- Give each street a fresh key rather than an address a neighbour already uses.
- Do not publish the mapping from steward to key. The street's name in the legend is enough.
- Read [protect your path](/docs/participate/protect-your-path) before the first step, not after.

:::warning
Keep path outputs away from any wallet that might sweep them into an ordinary payment. If a confirmed transaction spends a live path output and is not a valid ChainBloom event, that path is marked `ABANDONED` with the reason `INVALID_CONFIRMED_SPEND`. Nothing is invented to replace it, and no one can undo it. A street's line simply stops, permanently, in a way that looks the same as neglect.
:::

### Stories, photographs, and the things people tell you

Everything a neighbour says at a doorstep stays off the chain, and that is a feature. But the project will collect it anyway (that is usually the point), so agree the rules for that material at the start: written permission before publishing, a named person responsible, and a clear answer to "can I change my mind later" for the parts you can still change. The four numbers are not among them.

Where you would show live activity for the world (who added what, and when), there is nothing to link to yet. The public index is not switched on. See [what is running](/docs/help/status), and keep the noticeboard list of transaction ids in the meantime.
