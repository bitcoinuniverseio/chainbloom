---
title: Create, Bloom, Echo, Meet and Close
nav: The five actions
description: Five moves build every ChainBloom world: open it, add a moment, answer an earlier one, share a moment with someone, and end a path on purpose.
socialTitle: The five actions in ChainBloom
socialDescription: Create, Bloom, Echo, Meet and Close. What each one means to you, what it does to the world, and when to reach for it.
updated: 2026-07-31
order: 3
keywords: [create, bloom, echo, graft, meet, rendezvous, close, operations, opcode]
related: [learn/when-paths-meet, participate/create-a-world, reference/protocol-architecture]
cta:
  title: Meeting is the one worth understanding
  body: Two paths share a moment and both carry on. Nothing is merged and nothing changes hands.
  label: Read how two paths meet
  href: /docs/learn/when-paths-meet
---

:::lead
Five moves is the whole language. Learn them once and you can read any world someone else built, and design one people will want to answer. Nothing here needs code, and none of it is hard.
:::

The vocabulary is deliberately small. A [[world]] is not built from clever features; it is built from {{OPERATION_COUNT}} plain moves repeated by different people in an order nobody can rearrange afterwards.

Each move below gets the same three answers: what it means to you, what it does to the world, and when to reach for it.

## Create: opening the world

**To you** it is writing an invitation. You choose a title of up to {{MAX_TITLE_BYTES}} ASCII bytes, how many [[path|paths]] the world has ({{MIN_LANES}} to {{MAX_LANES}}), how long it stays open ({{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days), and how many steps each path may take ({{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}}). You also set a {{SEED_BYTES}}-byte seed, which is what makes a world look like itself when it is drawn.

**To the world** one transaction opens the space and hands out its starting [[carrier|carriers]], one per path, each holding exactly {{CARRIER_VALUE_SATS}} satoshis. Those outputs are the paths. Whoever can spend one can move it forward.

**Reach for it when** you have a shape you want other people to fill: a season, a room, a piece of music, a question. Say the shape out loud in the title, because after this the shape cannot change.

:::warning
Every Create choice is permanent once the transaction confirms. Lane count, duration and step limit cannot be edited, extended or repaired afterwards, by you or by anyone else. Decide slowly, then create.
:::

## Bloom: one moment on one path

**To you** it is the ordinary act: you add your moment to a path you hold. Most of what happens in a world is blooms.

A [[bloom]] carries four small numbers: [[glyph]] 0-{{MAX_GLYPH}}, palette 0-{{MAX_PALETTE}}, motion 0-{{MAX_MOTION}}, and magnitude 0-255. Four bytes, and that is the entire payload.

**To the world** it spends the path's live carrier and creates the next one, again exactly {{CARRIER_VALUE_SATS}} satoshis. The path's step count goes up by one. The old carrier is gone, so nothing can be inserted before your moment later on.

**Reach for it when** your contribution stands on its own: a new plant in the bed, a new bar of the tune, a new day of the trip.

## Echo: a moment that points back

**To you** it is a reply. You add a moment and say which earlier moment it is answering.

An [[echo]] carries the earlier event's transaction id, plus a relation number 0-{{MAX_RELATION}}, and its own glyph and palette. The relation is the *kind* of answer: agreement, contrast, continuation, whatever the world has agreed those numbers mean.

**To the world** it does everything a bloom does, and it also draws a line across the world back to the moment it names. That line is what turns a set of parallel threads into a conversation.

The target has to be real. It must exist, be on the same network, and be confirmed in a strictly earlier block. If it is not, validation returns `UNKNOWN_GRAFT_TARGET`, `GRAFT_NETWORK_MISMATCH`, or `UNCONFIRMED_GRAFT_TARGET` and the step is not an event.

**Reach for it when** your moment only makes sense next to someone else's. An echo is how you credit an influence without editing the thing you were influenced by.

## Meet: two paths, one shared moment

**To you** it is the moment you and another person do something together, on purpose, at a time you both chose.

A [[meeting]] carries a bridge style 0-{{MAX_BRIDGE_STYLE}} and an intensity 0-255, plus its own glyph and palette. The bridge style is the character of the meeting; the intensity is how much of it there is.

**To the world** one transaction spends both paths' live carriers and creates one successor for each. Both people sign. Both paths carry on. Neither path is merged into the other, and nothing moves from one person to the other.

**Reach for it when** two threads genuinely touch: two voices landing on one chord, two stages sharing a closing night, two students noticing they were making the same thing. The full mechanics, and why this is not a transfer, are in [how two paths meet](/docs/learn/when-paths-meet).

## Close: an ending you chose

**To you** it is finishing. You decide the path is done and you say so, with a reason number 0-255.

**To the world** the carrier is spent and no successor is created. The path's status becomes closed, with a terminal reason recorded, and the {{CARRIER_VALUE_SATS}} satoshis stop being a path and go back into ordinary outputs of your transaction, minus the network fee.

Closing is allowed even when a path has used all of its steps. Once step count reaches the world's limit, any further Bloom, Echo or Meet is rejected with `MAX_STEPS_REACHED`. Close still works. It is the one move that is always available while a path is alive.

**Reach for it when** the work is finished rather than abandoned. An ending you chose reads completely differently from a path that simply stopped, and the difference is visible in the record forever.

:::note
A path that is never closed does not stay open forever. When the world reaches its end height, every live path becomes expired with the reason `WORLD_DURATION_ELAPSED`. Ending on purpose is a statement; expiring is what happens when nobody makes one.
:::

## The numbers are references, not pictures

Nothing you write with these five moves is an image. There are {{GLYPH_COUNT}} glyph values, {{PALETTE_COUNT}} palette values, {{MOTION_COUNT}} motion values, {{RELATION_COUNT}} relation values and {{BRIDGE_STYLE_COUNT}} bridge styles. A whole marker is at most {{MAX_MARKER_BYTES}} bytes. You could not fit a picture in there if you tried.

What goes on chain is a reference: *glyph 12, palette 3, motion 5, magnitude 200, on this path, after this parent, in this block*. What that looks like is a separate question, answered by whoever is drawing it.

The reference renderer in [`src/render.ts`](repo:src/render.ts) is explicit about this. `projectBloom` places each point from a sha256 of the world seed, the event id and the operation name, and colours it from {{PALETTE_COUNT}} fixed colours. It is marked non-consensus in the source, and that is not a hedge. It is the design.

So two galleries can draw the same bloom completely differently and both be right. One might render glyph 12 as a stem, another as a chord voicing, a third as a footstep. None of them is the true picture, because there is no true picture. What everyone must agree on is which numbers, on which path, in which order. That part is settled by Bitcoin, not by a renderer.

:::tip
If you are designing a world, write down what your glyph and relation numbers mean before anyone joins. The protocol will never enforce your meanings, so the shared meaning has to come from you, in the invitation.
:::

## The names in the code

Friendly names are an application's choice. The bytes are not.

:::generated name=operations-table
:::

The names in that table (`CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, `CLOSE`) are what a validator, an indexer or a decoder will show you. The friendly names on this page are what a person reading a world is more likely to see. One application may say Meet, another may say Rendezvous or Bridge; one may say Complete where this page says Close.

That is allowed, and it will happen. What may not change is the meaning: the same opcode, the same payload, the same rules, checked the same way by everyone. When a friendly name and a wire name disagree in something you are reading, trust the wire name and check [protocol architecture](/docs/reference/protocol-architecture).
