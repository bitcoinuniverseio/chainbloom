---
title: If you want to create a world
nav: Create a world
description: The four choices that can never be changed once you broadcast, how to write an invitation people actually answer, and how to look after the people who answer it.
socialTitle: Creating a ChainBloom world
socialDescription: The choices you cannot change, the invitation, and the people who answer it.
updated: 2026-07-31
order: 3
keywords: [create, world, invitation, duration, paths, host]
related: [participate/create-a-world, learn/the-five-actions, programs/moderation-and-privacy]
cta:
  title: Open your first world
  body: The full creation walkthrough, with every field explained and the review screen read line by line.
  label: Create a world
  href: /docs/participate/create-a-world
---

:::lead
Creating a world is mostly writing, not spending. You design a shape — how wide, how long, how far — then ask people to fill it. This page covers the decisions that lock the moment you broadcast, and the ones you can keep improving.
:::

## The choices you can never change

A [[world]] is created by one transaction, and what it says is what the world is. There is no settings page later.

| Fixed at creation | Range |
| --- | --- |
| Number of [[path|paths]] | {{MIN_LANES}} to {{MAX_LANES}} |
| Lifetime, in blocks | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} (about {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days) |
| Steps allowed per path | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Title | up to {{MAX_TITLE_BYTES}} plain ASCII characters |

The title accepts letters, digits, spaces and the characters `. _ : -`. Nothing else, and no second chance — this is a name, not a description.

A {{SEED_BYTES}}-byte [[seed]] goes in too. It changes nothing about what is allowed; it only feeds how galleries place things when they draw the world.

The lifetime counts from the [[block height]] your creation confirms in. When the chain reaches that height plus the duration, the world expires and every live path expires with it, finished or not. Choose a length you can hold people's attention across.

## Writing an invitation people answer

The chain holds {{MAX_TITLE_BYTES}} characters of title and a few very small numbers. Everything that makes people want to join — the prompt, the rhythm, the reason — lives outside it. Write that first, before you spend anything.

A good invitation says four things plainly:

- **What one step means here.** "One photograph from the walk." "One chord." Vague briefs produce vague worlds.
- **The rhythm.** Once a week for six weeks reads very differently from whenever you like.
- **When it ends, in dates.** Translate the block count into a real day and say it.
- **What it costs the person answering.** A miner fee plus {{CARRIER_VALUE_SATS}} satoshis held in their [[carrier]] while their path is alive, returned when they finish it. Say this before they arrive, not at the signing screen.

:::tip
Fewer paths, more steps usually makes a better first world. {{MAX_LANES}} paths is a lot of people to keep moving at one pace, and a path nobody takes is just a gap in the picture.
:::

## Looking after the people who answer

You are not an administrator here. You cannot remove a step, edit a moment, or take a path back — once a block confirms it, it is part of the world for good. Your influence is all front-loaded, so the guest list and the brief are the moderation. [Moderation and privacy](/docs/programs/moderation-and-privacy) covers that in full.

What is left is the ordinary hosting work:

- **Publish the world id and the path list** somewhere permanent. Paths are numbered from 0, and a path id reads `<worldId>:<laneNumber>`. Without that list, nobody can find their own thread — there is no public index to look them up in yet.
- **Warn people about the carrier.** No wallet protects it today. If someone sweeps it by accident their path is abandoned and stays that way.
- **Plan for silence.** Someone will go quiet. Decide in advance whether that path is left open as part of the record or completed by its holder, and say so at the start.
- **Help people [[meeting|meet]].** When two paths meet, one transaction spends both carriers, so both holders sign the same transaction. That takes coordination — a time, a channel, a person who nudges.

## Four steps to opening a world

:::steps
### Decide the three numbers

Paths, lifetime, steps per path. Write them down with a reason next to each.

### Write and publish the invitation

Before you spend anything. If you cannot describe one step in a sentence, the design is not finished.

### Build the creation in InScribe and read the preview

You fund one carrier per path, each exactly {{CARRIER_VALUE_SATS}} satoshis, plus the miner fee. The preview shows every output and the total before you sign.

### Hand out the paths in public

Post the world id and who holds which path, so nobody has to take your word for it.
:::

## Before you broadcast

:::checklist id=audience-world-creators
- I can justify the path count, the lifetime, and the step limit out loud
- The title fits in {{MAX_TITLE_BYTES}} ASCII characters and I am happy with it forever
- The invitation is written and published somewhere permanent
- I have translated the block duration into a real end date
- I have told participants the cost and the carrier risk in advance
- I accept that I cannot remove or edit anything once it confirms
:::
