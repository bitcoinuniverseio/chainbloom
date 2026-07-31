---
title: If you run a community
nav: Communities
description: How to build a ritual that repeats, keep many voices instead of flattening them into one, moderate before the invitation goes out, and avoid turning taking part into a score.
socialTitle: ChainBloom for community organisers
socialDescription: Repeatable rituals, many voices kept apart, moderation up front, and no leaderboards.
updated: 2026-07-31
order: 5
keywords: [community, organiser, ritual, moderation, participation, group]
related: [examples/community-time-capsule, programs/moderation-and-privacy, audiences/world-creators]
cta:
  title: Decide the rules before you open anything
  body: What you can and cannot moderate, what becomes public forever, and how to write a brief that holds.
  label: Moderation and privacy
  href: /docs/programs/moderation-and-privacy
---

:::lead
A community does not need another feed. It can use a thing that starts, holds several voices without merging them, finishes on a known day, and can be done again next season. That is the shape ChainBloom gives you; this page is about running it well.
:::

## Rituals that repeat

A [[world]] ends. That is the feature to build on.

Pick a lifetime that matches something your group already does: a growing season, a term, six weeks of Thursdays. Anything from {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks is allowed, roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days, but the good number is the one that already has a rhythm around it.

Then run it again. The second world is better than the first every time, because everyone now knows what a step feels like and what the ending is for. Call the first one a rehearsal out loud; it lowers the stakes and raises the turnout.

Announce the end date in ordinary dates, not in blocks. People plan around Saturdays, not heights.

## Keep many voices, not one voice

Most group projects flatten: one document, one loudest editor, one final version that quietly overwrote three others.

Here each [[path]] stays its own line for the whole life of the world. Two paths can meet and share a moment, and both carry on afterwards. Nothing is merged, absorbed, or replaced. If you have watched a shared doc lose somebody's contribution, that is the difference.

A world holds at most {{MAX_LANES}} paths. If more people want in, run two or three worlds side by side rather than crowding one. Small worlds finish; crowded worlds stall.

:::tip
Pair people on a path. Two named humans behind one path survives one of them getting busy, which is the most common way a thread dies.
:::

## Moderation happens before the invitation goes out

Nothing can be removed after a block confirms it. There is no delete, no hide, no edit: not by you, not by the world's creator, not by us.

So your moderation decisions are the guest list and the brief, made before the creating transaction is broadcast. After that you are a host, not an administrator.

Two things make this easier than it sounds. A moment carries a [[glyph]] number and a few other small numbers. There is no free text after the world's title, so the format itself limits what can be put there. And every path is handed to a named person, not claimed from a queue.

What is left is public, permanent and outside your control:

- The Bitcoin addresses people use are visible forever, and so is the timing of every step.
- Anyone can watch a world as it fills. There is no private mode.
- A person who leaves cannot take their moments with them.

Say all three in the invitation. [Moderation and privacy](/docs/programs/moderation-and-privacy) has the longer version, including people who want to take part without linking their usual addresses.

## Do not turn taking part into points

The step limit is a limit, not a score. Whoever spends fastest runs out of path first and pays the most in fees.

Leaderboards, streaks and prizes for most-steps wreck a world quickly. They reward volume in a medium whose shape depends on restraint and on an ending, they turn contributors into competitors, and they cost real money to lose at. Every step carries a miner fee and {{CARRIER_VALUE_SATS}} satoshis held in its [[carrier]].

Reward the ending instead. A finished path, a good meeting, a world that closed on time and got shown to people.

## Four steps to your first community world

:::steps
### Pick a rhythm you already have

Borrow the calendar of something that works. Do not invent a cadence.

### Decide who is invited, before you open anything

That decision is the moderation. Write the brief in the same sitting.

### Say the cost and the risks in your own words

The fee, the held satoshis, the permanence, the public addresses. Nobody should learn any of it at a signing screen.

### Open the world and hand out the paths in public

Publish the world id and who holds which path.
:::

## Before you invite anyone

:::checklist id=audience-communities
- The lifetime matches a rhythm my community already keeps
- I have written the end date as a real date, not a block count
- The guest list and the brief are decided, because nothing can be removed later
- Participants know their addresses and timing are public forever
- Nobody is being scored, ranked, or rewarded for volume
- I know who to ask if a path goes quiet halfway through
:::
