---
title: A collaborative digital garden
nav: Collaborative garden
description: Six neighbours, six beds, one shared record of a growing season that nobody can tidy up or rewrite once it is over.
socialTitle: A collaborative digital garden
socialDescription: A complete ChainBloom plan: six paths, 13,000 blocks, 48 steps, and the invitation to send your neighbours.
updated: 2026-07-31
order: 1
keywords: [garden, allotment, season, community, example world]
related: [examples/neighbourhood-story, examples/community-time-capsule, participate/create-a-world]
cta:
  title: Run this one yourself
  body: The settings below go straight into the creation form: paths, duration, and step limit.
  label: Create a world
  href: /docs/participate/create-a-world
---

:::lead
Here is a whole [[world]] you can copy: the message to send your neighbours, the numbers to type into the form, what a moment means, and what to do on the day it ends. Six beds, three months, one moment at a time.
:::

:::simulation
Elm Row Beds 2026 is an illustration. It does not exist on any network and nothing here is a report of live activity. Every setting is inside the limits the protocol enforces, so it could be created exactly as written.
:::

## The invitation

This is the part people actually read. Send it as it stands.

> **Elm Row Beds 2026**
>
> Six beds, six of us, one shared record of the season.
>
> You get one bed and one path. Whenever something happens in your bed you add a moment to it: a sowing, a first leaf, a failure, a harvest. Anything you would have told the person next to you anyway.
>
> Your path holds 48 moments. That is roughly one every other day for three months. When it is full, the only thing left to do is finish it.
>
> The world stays open for 13,000 blocks, which is about three months. It is measured in Bitcoin blocks, not dates, so the last day will drift by a few days either way. I will tell you the week before.
>
> On seed swap Saturday, beds pair up and record one moment together. Both beds carry on afterwards. Nothing gets merged and nobody's bed disappears into anybody else's.
>
> When your bed is done for the year, you finish your path and say why: cropped, given up, or lost to weather. When the sixth path is finished, the season is closed and nobody can add to it again, including me.
>
> It costs a Bitcoin network fee each time you add a moment, and {{CARRIER_VALUE_SATS}} satoshis sit inside your path until you finish it, then come back. There is nothing to buy and nothing to join.
>
> If none of that means anything to you, come to the shed on Sunday and we will set it up together in twenty minutes.

## The settings

:::figure caption="Everything fixed at creation for Elm Row Beds 2026"
| Setting | Value | Why this number |
| --- | --- | --- |
| Title | `Elm Row Beds 2026` | 17 bytes, inside the {{MAX_TITLE_BYTES}}-byte limit, and only characters the title rule allows |
| Paths | 6 | One per bed. The limit is {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 13,000 blocks | About 90 days. The limit is {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 48 | About one every other day. The limit is {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held in each path | {{CARRIER_VALUE_SATS}} satoshis | Carried from moment to moment, released when the path is finished |
| Most moments possible | 288 | Six paths of 48 steps, if every bed fills up |
:::

Every one of those is fixed the moment the world is created. There is no editing a duration afterwards, no adding a seventh bed in July, and no raising the step limit because somebody was chatty in May.

:::note
The title has to match `{{TITLE_PATTERN}}`: letters, digits, spaces, and `. _ : -` only. No apostrophes, no accents, no emoji. `Elm Row Beds 2026` passes. `Elm Row's Beds` does not.
:::

## What one contribution means

A [[bloom]] carries four small numbers, and the protocol has no opinion about what they mean. Your invitation supplies the meaning. For this world:

- **Glyph**: what happened. {{GLYPH_COUNT}} values, numbered 0 to {{MAX_GLYPH}}. Publish a list: 0 sown, 1 germinated, 2 thinned, 3 fed, 4 flowered, 5 fruited, 6 pest, 7 disease, 8 harvested, 9 pulled. Ten is plenty; leave the rest for next year.
- **Palette**: which colour it draws in. {{PALETTE_COUNT}} colours, 0 to {{MAX_PALETTE}}. Let each bed keep one colour all season, so the record is readable at a glance.
- **Motion** is how it felt. {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}: steady, sudden, slow, stalled.
- **Magnitude**: one byte for how much. Weight of the pick, number of seedlings, or a plain 0 when it does not apply.

An [[echo]] is the second kind of moment, and it is the one that makes the beds talk to each other. It points back at a specific earlier moment in the world and says how it relates to it. Bed 4 answers bed 2's blackfly with the thing that worked. The moment it points at must already be confirmed in an earlier block, which means you can only answer something that is genuinely already in the record.

## When the beds meet

Seed swap Saturday, about halfway through the season, is the only scheduled meeting.

A [[meeting|meet]] joins exactly two paths. One transaction spends both beds' path outputs and creates a new one for each, so both people sign the same transaction, standing next to each other. Three pairs means three meetings, and they can all happen the same afternoon.

What the pair records is one shared moment: what was swapped, in one glyph. Afterwards each bed carries on with its own history. Nothing is merged. The record simply shows that on one afternoon, two beds were in the same place.

:::tip
Do the meetings in person. The whole point of the mechanism is that two people agreed at one moment, and standing in a shed together is a better way of arranging that than three days of messages.
:::

## How it ends

There are two ways this season can finish, and only one of them is any good.

**The good one.** Each person finishes their own path when their bed is done, [[close|completing]] it with a reason byte your invitation has already named: 1 cropped, 2 given up, 3 lost to weather. Finishing releases the {{CARRIER_VALUE_SATS}} satoshis back to the person who held it. When the sixth path is finished, the world has no live paths left and is over.

**The other one.** Somebody moves house in August and never finishes their bed. When the 13,000th block passes, the world expires and every path still open is marked expired, with a reason recording that the duration elapsed. Nothing is lost and nothing is corrupted. But the record shows that the season ran out rather than being finished, and that difference is visible forever.

So tell people in advance: the last week is for finishing, not for planting.

## What a season feels like

**Week one** is loud. Six people all sow within a day of each other and the world fills with early glyphs. Everyone checks whether their moment has confirmed, because it is new. Beds pick their colours.

**Weeks two to six** settle. Somebody posts once a week, somebody posts twice a day and burns through a quarter of their 48 steps by June. That is not a fault; it is the world telling you something about the person.

**The swap** in the middle is the first time the paths touch. It is also the first time most people understand that the world is one thing rather than six diaries.

**August** is where a season is won or lost. Beds that ran out of steps sit finished and quiet. Beds still going take on weight, because the record shows who is still working.

**The last week** is a set of small ceremonies. One at a time, people finish their paths and say why. When the last one confirms, the season becomes a fixed thing: six lines of different length, a few crossings in the middle, and six endings, one of which will say "lost to weather".

:::warning
Every moment is a real Bitcoin transaction with a real fee, and a confirmed moment cannot be undone by you, by the person who made the world, or by anyone else. No wallet knows what a ChainBloom path is yet, so the {{CARRIER_VALUE_SATS}}-satoshi output that holds your bed can be spent by an ordinary payment if you are not careful. A path spent that way is marked abandoned and cannot be continued. Read [protect your path](/docs/participate/protect-your-path) before the season starts, and [fees and confirmation](/docs/participate/fees-and-confirmation) before the first sowing.
:::
