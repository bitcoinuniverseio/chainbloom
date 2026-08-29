---
title: Explorer and gallery integration
nav: For explorers
description: What a viewer must show for a reader to trust it, what it must never claim, and why a rendering of a world is a reading rather than the record.
updated: 2026-07-31
order: 10
verified: "@chainbloom/protocol@0.1.0"
keywords: [explorer, gallery, viewer, rendering, lineage, provisional]
related: [reference/indexer-requirements, reference/reorganizations, audiences/wallet-and-explorer-integrators]
cta:
  title: The data has to come from somewhere
  body: A viewer is only as honest as the index behind it, and the index has rules of its own.
  label: Read the indexer requirements
  href: /docs/reference/indexer-requirements
---

:::lead
A good ChainBloom viewer lets a reader check it. Every event it shows carries the block height and the txid that put it there, so anybody who doubts the picture can go and look at the chain instead of taking your word. That is the only reason a picture of a shared history is worth anything.
:::

## What a viewer owes the reader

An [[explorer]] or gallery is a reading of a history, not the history. The history is a set of confirmed Bitcoin transactions, and it exists whether or not your site does.

That relationship should be visible in the interface, not buried in an about page. It costs almost nothing to show a txid next to an [[event]], and it changes what your site is: a convenience rather than an authority.

## Show these things

### Confirmed and provisional, visibly different

An unconfirmed action has no height and no fixed order. It can be replaced by a fee bump, dropped, or reorganized out after appearing in a block.

Show it if you like, since seeing your action accepted is genuinely useful, but never in the same visual language as a confirmed event. Different colour, different label, different section, and the word "pending" or "provisional" written out. If your source of provisional data reports conflicts, show those too: two transactions spending the same outpoint means one of them will lose.

And when a provisional event disappears, say that it disappeared. Silently removing a row is the failure mode readers cannot detect.

### The block height and the txid of every event

Every event gets both. Not on a details panel three clicks away, but on the thing itself, or one hover from it.

An event is identified by its txid. A world is identified by the txid of its `CREATE`. A path is identified by `<worldId>:<laneNumber>`. These are the names everyone else uses, including every other index, so use them rather than inventing your own display ids.

Show your own tip height somewhere permanent as well. A reader cannot judge whether your view is current without knowing how far you have read.

### Path lineage, in order

A path is a chain of events, each one spending the output the previous one created. That order is the point of the whole design, so render it as a sequence: creation, each step in block order, and the ending if it has one.

Useful things to show along it: the step count, the maximum steps the world allows, the height of the last event, and the height at which the world expires. A reader who can see that a path has taken 4 of 5 permitted steps understands the shape of what is left.

### Echoes as links

An [[echo]] answers an earlier event. It carries the target's txid, so the relationship is exact. It is not a guess from timing or from similar-looking content.

Render it as a real link in both directions: from the echo to what it answers, and from the answered event to everything that has answered it. A history where you cannot see what a moment was replying to is a list, not a conversation.

### Meetings as shared points

A [[meeting]] is one transaction that continues two paths at once. Both paths carry on afterwards. Neither is merged into the other, neither is consumed, and nothing is transferred.

So draw it as a shared point on two lines that continue, and resist the tempting metaphors: it is not a merge, not a trade, not an acquisition. If your layout makes one participant look like the main one, the layout is wrong.

### Terminal reasons, in plain words

A path stops for one of a few reasons, and they are not the same thing. Show which:

| Status | What happened |
| --- | --- |
| `CLOSED` | Someone ended it deliberately, with `CLOSE` and a reason code |
| `EXPIRED` | The world reached the end of its duration with this path still live |
| `ABANDONED` | The path's output was spent by something that was not a valid action |

[[abandoned]] deserves particular care. It usually means an accident (a wallet sweep, a consolidation), and it carries the txid that did it. Show that txid. Do not soften the wording, and do not display an abandoned path as if it were completed. They mean opposite things about the work.

## Rendering is a reading, not the record

{{PACKAGE_NAME}} can draw a world. `projectBloom` places one point per confirmed event and `renderWorldSvg` returns an SVG document. It is deterministic: positions come from a sha256 of the world seed, the event txid, and the operation name, with {{PALETTE_COUNT}} fixed colours. The same events always produce the same picture.

Deterministic is not the same as authoritative. That function is explicitly non-consensus, and the source file says so.

Two galleries can render the same world completely differently, with different geometry, different motion, and different colours. Both can still be correct, because the record is the events and their order, not anyone's drawing of them. Build the visual language you want. Just do not confuse yours with the thing itself.

:::tip
A quiet way to keep this honest: make every rendered mark clickable through to the txid it came from. If a mark cannot be traced back to an event, it is decoration, and it should look like decoration.
:::

## Two things a viewer must not do

**Do not present your rendering as the history.** If your site vanished, the worlds would still exist and anyone could rebuild them. Say that. A viewer that implies the picture is the record teaches readers to trust a website when they could be trusting a chain.

**Do not imply that holding a path proves authorship.** Control of the key means one thing: the ability to take the next step. It is not proof of identity, not proof that a person made anything, and not a legal claim over the content of a world. Address labels, badges, and "creator" language quietly assert all three. Write what you can actually verify: that this key signed this step at this height. Stop there.

A screenshot proves nothing either. If someone shows you an event, the check is the txid, not the image.

## Where the data comes from

You need an index. The rules it must follow are in [indexer requirements](/docs/reference/indexer-requirements), and they matter to you directly: an index that repairs invalid spends, or applies blocks out of order, will hand you a history that no one else can reproduce.

Two practical notes:

- There is no public ChainBloom index switched on today. [What is running](/docs/help/status) says exactly where things stand, and a viewer built now needs its own index or an arrangement with an operator.
- The InScribe API does not send an `Access-Control-Allow-Origin` header for this documentation site's origin, so a browser-only gallery hosted elsewhere cannot assume it may fetch from it. Plan for your own backend, or run the index yourself.

When your index rolls back a [[reorganization]], your interface has to follow it. Events you displayed can stop existing. Handle that as a state change with a message, not as a page that silently looks different on the next reload.
