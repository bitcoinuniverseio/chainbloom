---
title: Accessibility for creative worlds
nav: Accessibility
description: What a ChainBloom experience owes its audience: text for every visual, a still for anything that moves, colour that is never the only signal, keyboard access, and plain words about cost.
socialTitle: Accessibility for ChainBloom worlds
socialDescription: Text alternatives, reduced motion, colour independence, keyboard operation, readable transactions, and the plain ordered list.
updated: 2026-07-31
order: 5
keywords: [accessibility, alt text, reduced motion, screen reader, keyboard, contrast, plain language]
related: [programs/exhibitions, participate/wallet-and-review, learn/worlds-paths-and-history]
cta:
  title: See what a signer has to read
  body: The review screen, the fee, and the moment before a transaction becomes permanent.
  label: Wallet connection and review
  href: /docs/participate/wallet-and-review
---

:::lead
A ChainBloom [[world]] is a confirmed sequence of events. The picture is an interpretation of it, not the thing itself. That means an accessible version is not a reduced version. Get this right and the same work reaches somebody using a screen reader, somebody who cannot use a mouse, and somebody who finds moving graphics unbearable, without any of them being sent to a lesser page.
:::

## The idea that makes this tractable

Rendering is deliberately outside the rules. Two galleries can draw the same world completely differently and both are correct. That is stated in the code, in [`src/render.ts`](repo:src/render.ts), which labels its own output as a non-consensus interpretation.

So there is no authoritative appearance to be faithful to. The record is the constraint; the picture is a choice. A version that is entirely words is as legitimate as a version that is entirely colour, because both are readings of the same confirmed history.

That flips the usual argument. You are not adding accommodations to a visual work. You are producing several equally valid presentations of one non-visual object.

## Text alternatives for every visual interpretation

Every rendering needs a description that carries the same information, written for a person rather than for a compliance report.

The reference renderer sets a floor. It emits an image with a role, a title taken from the world's title, and a description reading `Deterministic non-consensus rendering of N confirmed events.` Each point carries the transaction id of its [[event]] as a tooltip.

That floor is not enough on its own, and it is worth saying why. A 64-character transaction id read aloud is noise. A count of events is a fact, not a description. Neither tells anybody what happened in the world.

A usable text alternative says, in order, what the world is and what happened in it. For example, in place of a static image:

> Six paths, opened in March, numbered 0 to 5. Path 1 has taken eleven steps and is still live. Path 3 met path 5 at block height 892,140 and both continued. Path 4 was completed on purpose after four steps. Forty-one events in total, the most recent nine blocks ago.

:::simulation
Those figures are invented for illustration. There are no public worlds to read today, because the index is not switched on. See [what is running](/docs/help/status).
:::

Rules that hold generally:

- Describe the state and the shape, not the pixels. "Two paths met" beats "two clusters overlap".
- Put the description in the page, not only in an `alt` attribute, so everybody gets it.
- Update it when the world changes. A stale alternative is worse than none, because it is confidently wrong.
- Never describe a colour as if it were the meaning. It is one renderer's choice.

## Motion, and the still that replaces it

A [[bloom]] carries a motion value from 0 to {{MAX_MOTION}}, which is {{MOTION_COUNT}} possibilities. That is an instruction to a renderer, not a requirement placed on it.

Because interpretation is not part of the rules, a renderer that draws every motion value as a still image is still a correct renderer. This is not a loophole; it is the design. Build the still version first and treat animation as the enhancement.

- Ship a still image of the current state that is complete on its own. Not a paused first frame, but a considered composition.
- Honour `prefers-reduced-motion`. When it is set, show the still and do not start anything, including subtle drift, parallax and slow fades.
- Give an explicit pause control that is visible without hovering, and let the paused state persist while the visitor reads.
- Never use motion alone to say something. If movement marks a recent event, mark it in the text as well.
- At an exhibition station, run the still version by default and let a visitor turn motion on. The reverse asks people to identify themselves as needing something.

## Colour is never the only signal

The reference palette is a fixed list of {{PALETTE_COUNT}} colours, and a bloom's palette index runs from 0 to {{MAX_PALETTE}}. A [[glyph]] index runs from 0 to {{MAX_GLYPH}}, giving {{GLYPH_COUNT}} shapes.

Because there are more glyphs than colours, and because the glyph is a distinct field, shape can always carry meaning that colour also carries. Use both.

- Pair every colour with a shape, a label, or a position, so nothing depends on distinguishing two hues.
- Check contrast against the background you actually ship, including on a projector in a bright room, which is usually worse than any monitor.
- Do not rely on hue to separate one path from another. Number the paths (they are numbered in the record anyway, from 0 upward) and print the number.
- Offer a high-contrast presentation and a monochrome presentation. Both are legitimate readings of the same world.

## Keyboard access and focus

Everything a visitor can do with a pointer must be reachable with a keyboard, in an order that matches the visible layout.

What to check on any surface you build or commission:

- Tab order follows the reading order, and focus is visible against every background used.
- The picture is not a keyboard trap. A canvas or SVG that swallows focus strands anybody who uses a keyboard.
- Individual events are reachable and announced, so a person can move through the history one step at a time.
- Nothing important lives behind a hover. Tooltips that never appear on focus do not exist for keyboard users.
- The signing flow works end to end without a pointer, including the review screen and the confirmation.

## Transaction details people can read

The moment before signing carries the most consequence and usually the worst typography.

When ChainBloom is connected to an index, the build response returns an unsigned [[psbt]] together with a preview containing the path mappings, the outputs, the total input, the miner fee, the change, the fee rate, the locktime and any warnings. Those are the fields to present, and they should be a labelled list a screen reader can read straight through.

- Show the miner fee as a labelled number in a heading-level position, not as a footnote next to a hex string.
- Never make raw hex the primary display. Offer it, collapsed, for people who want it.
- Break long identifiers so they can be read and copied, and give each one a label saying what it is.
- Announce warnings as warnings, and put them before the sign button rather than beside it.
- Do not put a countdown on the review screen. Nobody should be hurried into an irreversible action.

## Plain language about cost and irreversibility

Two sentences do most of the work, and they should appear in the same size type as everything else.

**Cost.** "You will pay a Bitcoin network fee to miners for this step. {{CARRIER_VALUE_SATS}} satoshis stay in your path while it is alive and come back to you when you complete it. Nothing else is charged."

**Irreversibility.** "Once this is confirmed in a block, it cannot be changed, removed or undone by anyone, including us."

Say them before the sign button, not after. Avoid metaphors such as "written in stone", "for eternity" and "immutable", because they are either vague or frightening. Avoid jargon that hides the point: "broadcast" and "finality" mean nothing to most people, while "sent" and "cannot be undone" mean exactly what they say. And say who is paying: at a staffed station, "the museum pays this fee" removes a real anxiety in five words.

## The plain ordered list is the accessible version

The most accessible presentation of a ChainBloom world is also the most faithful one.

A world's history is a deterministic sequence. An independent replay sorts worlds and paths by id, and events by [[block height]] and then by their position within the block, so everybody who reconstructs it arrives at the same order. That order is the work.

So a table like this is not a fallback. It is the record, rendered honestly:

| Step | Block | Action | Path | Note |
| --- | --- | --- | --- | --- |
| 1 | 892,101 | Bloom | Path 1 | Opening mark |
| 2 | 892,118 | Bloom | Path 3 | |
| 3 | 892,140 | Meeting | Paths 3 and 5 | Both continue |
| 4 | 892,205 | Completion | Path 4 | Ended on purpose |

:::simulation
The heights above are invented to show the shape of the table.
:::

Publish that alongside the picture, on the same page, with the same prominence. Everybody uses it: people using screen readers, people on slow connections, people checking a detail, and curators writing a catalogue. An accessibility feature that only some visitors use is a burden nobody maintains. This one is the thing you would have built anyway.
