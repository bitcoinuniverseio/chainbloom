---
title: An artist and audience collaboration
nav: Artist and audience
description: The artist keeps one line and hands the other four to the audience, and every answer the artist gives is a signature both people put on the same moment.
socialTitle: An artist and audience collaboration
socialDescription: Five paths over eight weeks. How to hand paths to an audience, how an answer works, and what a path does and does not prove.
updated: 2026-07-31
order: 8
keywords: [artist, audience, collaboration, credit, permission, copyright, relay]
related: [audiences/artists-and-curators, participate/join-a-world, reference/security-model]
cta:
  title: Design the piece before you design the world
  body: What you are asking for, what you will answer, and what you will promise about credit.
  label: Read the artists and curators notes
  href: /docs/audiences/artists-and-curators
---

:::lead
You keep one line and give the other four away for eight weeks. Everything the audience sends you, you can answer — and an answer is not a reply in a comment box, it is one transaction that you and the other person both signed, sitting permanently beside their moment. That is the strongest form of credit this medium can give, and it costs you a step to give it.
:::

:::simulation
*Nine Bells* is invented as a worked example. There is no such piece and no such record on any network. The settings are values the protocol accepts; the artist is made up.
:::

## The invitation

Posted once, at the start, and not explained again afterwards.

> **Nine Bells**
>
> Eight weeks. Five lines. I am keeping the first one.
>
> The other four belong to you, in turn. When you have a line, you add one moment to it: a shape, a colour set, a movement, and how strongly it lands. Then you pass the line to the next person, and they do the same.
>
> I answer what I can. An answer means your line and mine meet in a single transaction that we both sign, and afterwards both lines carry on. I cannot answer everything — I have as many moments in total as any one of you does, and every answer spends one of them.
>
> When the eight weeks are up I end my line on purpose. Yours end however you decide to end them.
>
> Nothing here is for sale, nothing here can be edited afterwards, and holding a line does not make anyone the author of anything.

## The settings

A [[world]] is fixed at creation. For a piece with a shape, that is a gift rather than a limit: the audience can see the whole frame on day one.

:::figure caption="Nine Bells — the settings, and the range the protocol allows"
| Setting | This world | What the protocol allows |
| --- | --- | --- |
| Title | `Nine Bells` | up to {{MAX_TITLE_BYTES}} ASCII bytes, pattern `{{TITLE_PATTERN}}` |
| Paths | 5 — one artist, four audience | {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 8,000 blocks, about eight weeks | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 96 | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held per live path | {{CARRIER_VALUE_SATS}} satoshis | fixed by the protocol |
| Most moments possible | 480 | five paths of 96 steps |
:::

### The constraint that shapes the whole piece

Your line has 96 steps, exactly like everybody else's. Every answer you give spends one of them, and so does every moment you make alone. The four audience [[path|paths]] between them have 384 steps to spend asking.

So you cannot answer everything, and you should say so on the first day rather than disappoint people in week six. Decide the split in advance and publish it: sixty answers and thirty-six moments of your own, say. Scarcity that is announced is a form of the work. Scarcity that is discovered feels like being ignored.

### Handing the four paths out

Two ways, and you can mix them.

**Assign at creation.** The world's four other root outputs go to keys the first four participants give you, so those four hold their paths from the first block. Good when you know who is starting.

**Run them as relays.** You hold all five at creation and pass a path on as part of an ordinary moment: when a step is built, the next holder's key is chosen there, so a moment and a handover are the same transaction. See [src/builders.ts](repo:src/builders.ts). Four relay lines passing through eight weeks can reach far more people than four fixed holders.

:::note
There is no wallet with ChainBloom support yet, so an audience member takes part through the ChainBloom workspace in [InScribe](app) rather than in a wallet they already use. Say this in the invitation. It is the step where people who assumed a one-click experience will stop, and it is much better to lose them on day one than in the middle of your piece.
:::

## What one contribution means

An audience moment is a [[bloom]] — four small numbers on the chain:

- **Glyph** — the shape. {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}}.
- **Palette** — the colour set. {{PALETTE_COUNT}} values, 0 to {{MAX_PALETTE}}.
- **Motion** — how it moves. {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}.
- **Magnitude** — one byte for how strongly it lands.

Nothing a contributor writes, records, or photographs goes on the chain. If someone sends you a voice memo and you turn it into glyph 7, what is recorded is `7` — the memo stays in your inbox and is governed by ordinary law and ordinary manners, not by the protocol.

Publish the legend at the start and do not change its meanings mid-run. A contributor choosing glyph 7 in week two and glyph 7 in week seven must be choosing the same thing, or the record is a list of numbers with no story in it.

Two more things to say plainly, because artists get asked both: the drawing is one rendering, not the piece itself — positions come from the world's seed and each event's transaction id, and another viewer may draw the same five lines differently and be equally correct. And the record is the transaction ids, not any image of it. A screenshot proves nothing.

## The meeting moment

An answer is a [[meeting]], and it is the reason to build this piece this way rather than as a mailing list.

Both paths' outputs are spent in one transaction. You sign, the contributor signs, and neither of you can produce it alone. When it confirms, both lines have advanced one step and both are still their own line — yours did not absorb theirs and theirs did not become yours. Choose a bridge style — one of {{BRIDGE_STYLE_COUNT}} — so an answer reads differently from a moment.

In practice, run answers on a rhythm the audience can rely on: one evening a week, announced, where you and whoever is holding a line are both available to sign within the same hour. Coordination is the real cost of a meeting, not the fee.

:::tip
Answer *early* moments as well as good ones. A meeting is the only mark in this medium that two people made together, and the first one you give sets the audience's expectation of whether answers are earned or handed out. Both are defensible. Decide which piece you are making.
:::

## How it ends

At the end height — creation height plus duration, exclusive — the world becomes `EXPIRED` and every line still live becomes `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. That is a real ending but not an authored one.

Do it deliberately instead. In the last week, [[close|complete]] your own line with a reason number your notes explain, and ask each current holder to complete theirs. When the last live line is completed the world's status becomes `ENDED`. If a line reaches its 96th step first, further moments are refused with `MAX_STEPS_REACHED` — but completing it is still allowed, so nobody is ever trapped mid-line without an ending.

8,000 blocks is *about* eight weeks; blocks arrive when they arrive. Announce the closing date a week early and hold that margin.

## What an audience member does

:::steps
### Receive the line
Someone passes it on, or the artist assigned it at the start. Holding it means holding the key that can move it, and nothing else.

### Decide the four numbers
Using the published legend. This is the contribution — the rest is mechanics.

### Build and review
The Act surface in the ChainBloom workspace shows an unsigned transaction and a preview: which line moves, the outputs, the miner fee, the change, and any warnings. Read it before signing.

### Sign and broadcast
One signature. The step is not final until a block includes it, and a line can take at most one step per block — a step whose own parent is not yet confirmed in an earlier block is rejected with `UNCONFIRMED_LINEAGE_PARENT`.

### Pass it on, or wait to be answered
The handover is itself a step. Keep the transaction id: it is how this person shows what they did, without you vouching for them.
:::

:::warning
The line is held by a [[carrier]] output of {{CARRIER_VALUE_SATS}} satoshis. If any confirmed transaction spends it and is not a valid ChainBloom event — an ordinary payment, a wallet consolidating small outputs — that line is marked `ABANDONED` with the reason `INVALID_CONFIRMED_SPEND`. It stops there permanently and nothing is invented to replace it. Tell every new holder this in one sentence when you hand a line over.
:::

## Credit, permission, and what a path does not prove

### Credit

A meeting is the cleanest credit this medium offers, because the record shows two lines advancing in one transaction that needed two signatures. Nobody has to be believed for it to be true, and you cannot take it back later.

That is also the limit of it. The record shows that two keys signed together at a certain height. It does not show who those people are. If you want names attached, publish a credit list yourself, keep it with the transaction ids, and keep it accurate — the chain will not maintain it for you.

### Permission for contributed material

Whatever people send you outside the chain is theirs, and the protocol has no opinion about it.

- Ask for permission in writing before you use a recording, a photograph, a text, or a name in the piece, in publicity, or in documentation.
- Say up front, in the invitation, what you intend to do with what people send.
- Someone can withdraw permission for their material. They cannot withdraw a confirmed step, and neither can you. Keep those two things clearly separate when you explain the project, or you will promise something you cannot deliver.

### What holding a path proves

:::safety
Holding a path means one thing: you control the output that path currently sits on, so you are the only one who can move it next.

It does not prove who you are. It does not make you the author of the moments on that line. It does not create, transfer, or record any copyright, licence, or legal ownership of anything — not of the piece, not of the rendering, not of the contributed material. It is not a certificate and there is nothing in it to hold as property.

If a collaboration needs an agreement about rights, write the agreement. The chain settles the order of events and nothing else. [Security model](/docs/reference/security-model) sets out exactly what the protocol does and does not decide.
:::

Where you would point an audience at a public page showing the piece so far, there is nothing to point at yet — the public index is not switched on. See [what is running](/docs/help/status). Until it is, publish the world's transaction id and the running list of event ids yourself, on the same page as the legend, and let people verify their own moments from that.
