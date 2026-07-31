---
title: Exploring timelines and relationships
nav: Explore timelines
description: A world's history is a fixed order of confirmed events, and that order can be drawn as a picture, played as a score, or listed as plain text — all three are faithful readings.
socialTitle: How to read a ChainBloom world
socialDescription: What there is to look at inside a world, why the same history can be drawn in many ways, and which part everyone must agree on.
updated: 2026-07-31
order: 9
keywords: [timeline, explore, visualise, render, svg, graph, relationships]
related: [participate/follow-and-return, learn/worlds-paths-and-history, help/status]
cta:
  title: Understand what you are looking at
  body: Worlds, paths and history — the three ideas that make every view of a world make sense.
  label: Read worlds, paths and history
  href: /docs/learn/worlds-paths-and-history
---

:::lead
A world hands you something rare: a set of creative moments whose order nobody can argue about. What you do with that order is wide open — draw it, play it, or read it as a list. This page is about what is in there to find.
:::

## What there is to look at

Five things, and every view of a world is built from some combination of them.

### The order of events by block

Every confirmed [[event]] carries a block height and a position inside that block. Sort by height, then by transaction index within the block, and you have the world's timeline. Not roughly — exactly. That sort is what makes two people replaying the same chain produce the same history, which is why the protocol's own state snapshot returns events in precisely that order.

A world therefore has a real chronology, with real gaps. Two moments in the same block are simultaneous in a way that matters, and a week of silence between blocks is part of the shape too.

### Each path as a line

A path is a chain of steps, each one spending the output the previous step created. Nothing can be inserted into the middle later, and no step can be moved. So a path reads naturally as a line: first moment, second moment, third, ending.

Each step carries small numbers rather than pictures — a [[glyph]] from 0 to {{MAX_GLYPH}}, a [[palette]] from 0 to {{MAX_PALETTE}}, a motion from 0 to {{MAX_MOTION}}, and a magnitude. What those numbers *mean* is decided by whoever is showing them. The protocol only guarantees they were chosen at that moment by whoever held the path.

### Echoes as links between moments

An [[echo]] names an earlier moment by its transaction id and adds a relation value from 0 to {{MAX_RELATION}} describing the kind of answer it is. The target must be confirmed in a strictly earlier block, so an echo always points backwards in time and no loop can form.

Echoes are what turn a set of parallel lines into a conversation. Drawn, they are arcs across the timeline. Listed, they are footnotes. Either way they are the record of somebody noticing what somebody else did.

### Meetings as shared points

When two paths meet, one transaction spends both of their outputs and creates a new one for each. Both paths carry on. Neither is merged, absorbed, or renamed.

That gives you a point where two lines touch and separate again, with a bridge style from 0 to {{MAX_BRIDGE_STYLE}} and an intensity attached to it. In a timeline view it is the moment two histories were briefly the same history. There is no way to fake one, because it requires both holders to sign.

### Endings

A path ends in one of three ways, and the difference is visible: completed on purpose with a recorded reason, expired because the world reached its end height, or abandoned because its output was spent by something that was not a valid action. A world becomes ended once no live paths remain.

Endings matter to a reader. A world where every path was completed deliberately looks nothing like one where half of them ran out of time, and both of those are true things worth being able to see.

## Presentation is deliberately open

Here is the part people find surprising: the protocol takes no position on what a world looks like.

The order of events is consensus. The interpretation is not. The same confirmed history can honestly be shown as:

- **a drawing** — paths as strokes, blooms as marks, meetings as crossings
- **a score** — each path a voice, each step a note, meetings as chords
- **a plain list** — block height, action, path, and payload, one row each
- **a graph** — events as nodes, lineage and echoes as edges

None of these is more correct than the others. A gallery, a classroom, and a screen reader can each present the same world in the form that suits them, and every one of those readings is faithful, because every one of them is derived from the same fixed order.

:::note
This is a deliberate split. Consensus covers what happened and in what order. Everything above that — colour, layout, sound, motion, language — is a rendering choice, and rendering choices are allowed to differ. Two galleries can show the same world completely differently and both be right.
:::

## What the package can render

The `@chainbloom/protocol` package includes a small reference renderer. Given a world and its confirmed events, it produces an SVG: one circle per event, positioned by hashing the world [[seed]] together with the event's transaction id and its operation name, coloured from a fixed set of {{PALETTE_COUNT}} colours, sized by the event's magnitude, with the transaction id as the title of each shape.

Because the input is a hash of values that cannot change, the same world always renders identically. That makes it useful for tests and for a quick look at a world's shape.

It is explicitly **not** part of what anyone must agree on. The source says so, and it matters: an [[indexer]] that produced different pictures would still be correct, and a renderer is never the thing to check when two views of a world disagree. Compare the event order instead.

:::tip
If you are building a view of a world, start from the sorted event list rather than from anyone's picture. Every honest presentation is a function of that list, and any presentation that needs more than the list is adding something the chain did not say.
:::

## What you cannot browse yet

There is no public browsing surface for ChainBloom worlds today. The ChainBloom workspace inside [InScribe](app) has an Explore view built for confirmed worlds, and the backend exposes read routes for worlds, events, graphs and renders — but the index behind them is not connected, so those routes return an error rather than data. No block explorer decodes ChainBloom markers either.

That is the whole honest picture, and [what is running](/docs/help/status) keeps it current. Until it changes, a world can still be read the slow way: pull the transactions, decode the markers, sort by height and index. That is all any timeline view is doing.

If you are keeping track of a world you care about, [bookmarks and returning](/docs/participate/follow-and-return) covers what to write down now so you can find it the moment browsing exists.
