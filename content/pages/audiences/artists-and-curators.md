---
title: If you make or curate work
nav: Artists and curators
description: A bounded, ordered, openly interpretable record behaves like a material you work with, not a platform you publish on — and holding a path is not a copyright claim.
socialTitle: ChainBloom for artists and curators
socialDescription: A bounded ordered record as material. What it fixes, what it leaves open, and what it does not claim.
updated: 2026-07-31
order: 4
keywords: [artist, curator, exhibition, material, rendering, attribution]
related: [examples/artist-and-audience, programs/exhibitions, learn/the-five-actions]
cta:
  title: See it used as material
  body: One artist, one audience, and a world where the audience holds the paths the artist answers.
  label: Artist and audience
  href: /docs/examples/artist-and-audience
---

:::lead
The interesting thing here is not that a record is permanent. It is that the record is bounded, strictly ordered, and openly interpretable — three constraints you can compose with. ChainBloom is closer to a stretcher and a set of pigments than to a place you upload things.
:::

## A material, not a platform

A platform decides how your work is displayed, ranked, and eventually removed. This does not, because there is nowhere for those decisions to live.

What you get instead is three properties you can build against.

**Bounded.** A [[world]] has an ending fixed before the first mark — between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks, at most {{MAX_LANES}} [[path|paths]], at most {{MAX_MAX_STEPS}} steps on any one of them. Everyone can see the frame from the start. Constraint is a material property, and this one is legible to the audience as well as to you.

**Ordered.** Which moment came before which is settled by Bitcoin blocks, not by a database anyone administers. Sequence becomes something you can compose with and nobody can retouch.

**Openly interpretable.** The chain fixes the score. It does not fix the performance.

## What the record fixes, and what it leaves open

Each moment carries very little: a [[glyph]] chosen from {{GLYPH_COUNT}}, a [[palette]] from {{PALETTE_COUNT}}, a motion from {{MOTION_COUNT}}, and a magnitude. An answer to an earlier moment adds a relation, one of {{RELATION_COUNT}}. Two paths meeting choose a bridge style, one of {{BRIDGE_STYLE_COUNT}}.

That is the entire vocabulary on the chain. The image is not there. Nothing you make is stored on Bitcoin — what is stored is a small, exact, ordered set of choices.

Drawing follows from a hash of the world's [[seed]], each event's [[txid]], and the operation, and the reference renderer is explicitly outside consensus. Two galleries can render the same world in completely different ways and both be right. For a curator that is the whole opportunity: a room, a screen, a print series and a score can each be a reading of the same fixed sequence, and no reading invalidates another.

:::note
Because the same events can be drawn many ways, a screenshot proves nothing on its own. If a reading matters, publish the renderer alongside it, so anyone can replay the chain and get your image back.
:::

## Holding a path is not a copyright claim

This needs saying flatly, because adjacent fields have been careless about it.

Holding the output that carries a path means one thing: your wallet can take the next step on that path. It is not evidence of identity, not evidence of authorship, and not a transfer or assertion of copyright. Nothing on this site will tell a collector otherwise, and neither should your wall text.

Attribution, licensing, moral rights and credit live where they always have — in the documents you publish, the agreements you sign, and the law that applies to you. Write them down. A world is a good reason to be explicit about them early, while everyone is still enthusiastic.

## Four steps to a first piece

:::steps
### Decide what one moment means

A frame, a bar, a stanza, a day. If you cannot say it in a sentence, the piece will not read.

### Choose who holds the paths

You holding all of them is a series. Other people holding them is a collaboration, and the difference is not reversible once the world is open.

### Make the work outside the chain, and the record on it

Keep the correspondence tight — one moment on the chain per real thing you made, in the same order.

### Publish your reading

The renderer, the mapping, the wall text. A reading nobody can reproduce is not a reading.
:::

## Before you commit to a world

:::checklist id=audience-artists-and-curators
- I can state what one moment means in one sentence
- I have decided who holds the paths, and I know that is fixed once the world opens
- I know the chain stores a few small numbers, not my images or audio
- My wall text does not claim ownership, authorship, or copyright from holding a path
- Attribution and licensing are written down somewhere outside the chain
- My reading can be reproduced by someone else from the same events
:::
