---
title: Museums and cultural organizations
nav: Museums
description: Programme a ChainBloom world as a commission: what to budget for real network fees, how to keep it accessible, what survives the run, and what to put on the wall.
updated: 2026-07-31
order: 6
keywords: [museum, gallery, exhibition, curator, wall text, archive, accessibility, budget]
related: [programs/exhibitions, examples/museum-exhibition, programs/accessibility]
cta:
  title: Plan the run
  body: The room, the invigilation, the opening hours, and what happens on the last day.
  label: Read Exhibitions
  href: /docs/programs/exhibitions
---

:::lead
A ChainBloom [[world]] gives a programme something a wall of screens cannot: a public record of what visitors made, in order, that stays readable after the run ends and after your website is redesigned. Your organisation funds the artist, the production, and the invigilation. The record itself belongs to nobody, including you.
:::

## What you are commissioning

A world is a bounded brief. Three numbers are fixed the moment it opens and can never be edited:

- how many [[path|paths]] it has: {{MIN_LANES}} to {{MAX_LANES}}
- how long it stays open: {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days
- how many steps each path may take: {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}}

These are curatorial decisions, not settings. {{MAX_LANES}} paths across a six-week run is a different show from two paths across a year. Settle them with the artist before anything is signed, because there is no later.

The only free text anywhere in a world is its title: at most {{MAX_TITLE_BYTES}} ASCII characters matching {{TITLE_PATTERN}}. Everything a visitor contributes afterwards is numbers: a glyph, a palette, a motion, a magnitude. Nobody can type a message into the chain, which shrinks the moderation problem to almost nothing. [Moderation and privacy](/docs/programs/moderation-and-privacy) covers what is left.

## What it costs, and what the budget line is for

Two real costs, and no others:

1. A Bitcoin network fee for every contribution, paid to miners. ChainBloom charges nothing and receives nothing. The fee depends on how busy the network is that minute, so nobody can quote you a figure months ahead.
2. {{CARRIER_VALUE_SATS}} satoshis held in each live path's [[carrier]] output. It moves forward with every step and is released when the path is completed.

Budget fees the way you budget consumables: a rate per contribution, times the number of contributions you expect, with headroom for a busy week. [Fees and confirmation](/docs/participate/fees-and-confirmation) shows how to read the current rate before you commit.

Decide early who signs. If the organisation pays and signs on a visitor's behalf, one staff wallet makes every step, and your register of who contributed what is a piece of your own paperwork. The chain records the step, not the person. Holding the wallet is not evidence of authorship.

:::warning
Fees are real money, and a confirmed step cannot be undone by anyone, including you. Rehearse the exact wording of the world title before you create it.
:::

## Access and the room

The picture is not the record. Positions and colours come from the world's [[seed]] and each event's [[txid]], and the renderer sits deliberately outside the rules. Two galleries can render the same world completely differently and both be correct.

Plan for two readings side by side: the visual one, and a written one. A short text account of every event (which path, which action, which block) serves a visitor using a screen reader, a visitor who would rather not stand in front of a projection, and your own archive. [Accessibility](/docs/programs/accessibility) has the detail.

## What survives the run

Keep four things in the accession file: the world id, which is the txid of the transaction that created it; its {{SEED_BYTES}}-byte seed; the ordered list of event txids; and the exact version of the renderer you exhibited. With those, anyone can rebuild the same history from Bitcoin later, without you and without this site.

The world becomes [[expired]] at a fixed block height: the height it was created at plus its duration. Every path still open expires with it. That point is knowable from day one, so print it in the programme.

:::note
There is no public browser for confirmed worlds yet. [What is running](/docs/help/status) states exactly what works today, which is the page to show a funder.
:::

## What the wall text should say

A template that is true:

> *[Title]* is a shared history recorded on Bitcoin. Anyone can add a moment to one of its [N] paths until [date]; every contribution is permanent and public, and cannot be edited or removed by the gallery or the artist. [Organisation] funded the commission and the production. The history is not owned by anyone.

Do not write "own", "collect", "token", "mint", or anything about value. It would be false, and it would bring in exactly the wrong audience for the work.

## Before you commit to a date

:::checklist id=museum-programme
- Agree paths, duration, and steps with the artist, and write them into the commissioning agreement
- Decide who signs and who holds the keys, and name a second person who can
- Set a fee budget with headroom, and a rule for what happens if it runs out mid-run
- Approve the world title exactly as it will be recorded
- Draft the wall text and the text-only account together, not one after the other
- Rehearse the whole flow on a test network before the private view
- Record the world id, seed, event list, and renderer version in the accession file
:::

Next: [A museum exhibition](/docs/examples/museum-exhibition) is a worked example with its invitation, its paths, and how the last day is handled.
