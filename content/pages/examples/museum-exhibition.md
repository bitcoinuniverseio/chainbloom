---
title: A museum exhibition
nav: Museum exhibition
description: Visitors shape a bounded work across the run of a show, and the finished history stays readable long after the walls come down.
socialTitle: A museum exhibition
socialDescription: Six paths, six months, one staffed station. The invitation, the labels, the wall text, and how a show should end on purpose.
updated: 2026-07-31
order: 6
keywords: [museum, gallery, exhibition, visitors, curator, wall text, accessibility]
related: [programs/exhibitions, audiences/museums-and-cultural-organizations, programs/accessibility]
cta:
  title: Run this as a programme, not a gadget
  body: Staffing, consent, budgets, and the archive you keep after the show closes.
  label: Read the exhibitions notes
  href: /docs/programs/exhibitions
---

:::lead
A visitor spends four minutes at a table in Hall Four and leaves one deliberate mark on a work that six months of other visitors are also making. The gallery gets something rare from it: a participatory piece whose history is still legible years later, in an order nobody — including the gallery — can rearrange afterwards.
:::

:::simulation
Hall Four: Tides is invented as a worked example. There is no such show and no such record on any network. The settings are values the protocol accepts; the institution is made up.
:::

## The invitation

This is the text on the station, at the height a seated visitor reads it.

> **Hall Four: Tides**
>
> This work has six lines and it is being made by the people who walk through this room. It opened with the show and it closes with the show.
>
> If you take a turn, you add one moment to one line: a shape, a colour set, a movement, and how strongly it lands. Four choices. The attendant will show you what each one means and will not choose for you.
>
> Sometimes two lines meet. A meeting is arranged between two visitors who both agree to it, and afterwards both lines carry on separately. Nothing is merged and nothing is overwritten.
>
> Your moment is recorded on the Bitcoin network. It is public, it has a time, and it cannot be edited or removed afterwards — not by you, and not by this museum.

Everything a participatory work usually promises and then quietly fails to deliver is in the last line, and here it is enforced by something outside the building.

## The settings

A [[world]] fixes its shape when it is created. Nothing in this table can be changed later, so this is the meeting to get right.

:::figure caption="Hall Four: Tides — the settings, and the range the protocol allows"
| Setting | This world | What the protocol allows |
| --- | --- | --- |
| Title | `Hall Four: Tides` | up to {{MAX_TITLE_BYTES}} ASCII bytes, pattern `{{TITLE_PATTERN}}` |
| Paths | 6 — one per room theme | {{MIN_LANES}} to {{MAX_LANES}} |
| Duration | 26,000 blocks, about six months | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks |
| Steps per path | 64 | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} |
| Held per live path | {{CARRIER_VALUE_SATS}} satoshis | fixed by the protocol |
| Most moments possible | 384 | six paths of 64 steps |
:::

### The number that will surprise you

Six [[path|paths]] at 64 steps is at most 384 moments for the entire run. Spread across roughly 180 days that is about two a day.

A station open to every visitor would exhaust the work in a busy weekend and then stand there for five and a half months with nothing left to give. The scarce resource in this design is **steps, not time**, and the curatorial decision is how you ration them. Three approaches that work:

- **A booked slot.** Two turns a day, free, bookable like a tour. Turns the constraint into an invitation.
- **A nominated contributor.** Each week a different group — a school, a resident artist, a local society — holds the turns.
- **A slow burn with a finale.** One turn a day for five months, then the remaining steps released across the closing weekend.

If you want a station any visitor can walk up to, do not stretch this world. Create a shorter one — {{MIN_DURATION_BLOCKS}} blocks is about a day — and run a series.

## What one contribution means

A visitor's moment is a [[bloom]], and on the chain it is four small numbers:

- **Glyph** — the shape. {{GLYPH_COUNT}} values, 0 to {{MAX_GLYPH}}.
- **Palette** — the colour set. {{PALETTE_COUNT}} values, 0 to {{MAX_PALETTE}}.
- **Motion** — how it moves. {{MOTION_COUNT}} values, 0 to {{MAX_MOTION}}.
- **Magnitude** — one byte for how strongly it lands.

No text, no image, no name is written. That is a privacy protection and a curatorial burden at once: the meaning of glyph 9 lives entirely in the legend the museum publishes beside the work. Print the legend, put it in the catalogue, and archive it with the show. If the legend is lost, the record survives and its meaning does not.

Tell visitors plainly that the animation on the wall is one rendering, not the work's only true form. Positions come from the world's seed and each event's transaction id, and drawing is deliberately outside the rules everyone must agree on. Another institution could render the same six lines in a different style and be equally correct.

## The meeting moment

A [[meeting]] spends both paths' outputs in a single transaction, so both holders must sign the same thing. In a gallery that makes it an event rather than a click: two visitors, two attendants, one screen, one signature each.

Programme them. Two announced meetings a month, at a set time, drawing whatever queue they draw. Choose a bridge style — one of {{BRIDGE_STYLE_COUNT}} — with a shared glyph and palette, so a meeting reads differently from an ordinary moment.

Note the budget effect: a meeting spends one step on **each** of the two paths. Twelve meetings across the run costs 24 of your 384 steps.

## How the show ends

The end height is the creation height plus the duration, and it is exclusive. At that block the world becomes `EXPIRED` and every path still live becomes `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. That is a valid ending, but it is an ending by clock, and it will not feel like a closing night.

Do it the other way. In the last week, [[close|complete]] each of the six paths deliberately, with a reason number the catalogue explains — say `1` for a line the room finished and `2` for a line the room left open. When the last live path is completed the world's status becomes `ENDED`. Every one of the six endings was a decision somebody made, which is what a closing should be.

Give yourself margin. 26,000 blocks is *about* six months; blocks do not arrive on a schedule, and a slow week can move the end height by a day or two. Plan the closing ceremony a fortnight early, not the night before.

### What "stays readable" actually means

Anyone with the same blocks rebuilds the same world: the order of events is settled by Bitcoin, and a replay sorts worlds and paths by id and events by height then position in the block, so two independent readers land on the same history. The museum is not the host of the truth and cannot become the single point of failure for it.

:::note
Today there is a gap between that guarantee and public convenience: the public index that would let a visitor look the show up from home is not switched on. See [what is running](/docs/help/status). Until it is, archive the world's transaction id, every event transaction id, and the legend, in the same place you keep the rest of the show's documentation. The chain keeps the record; you keep the key to reading it.
:::

## What a visitor does

:::steps
### Arrive at the station
An attendant explains the six lines, the legend, and the fact that this cannot be undone. Roughly two minutes.

### Choose four numbers
The visitor picks a glyph, a palette, a motion, and a magnitude, and says why. The saying-why is the part people remember.

### Review the transaction
The Act surface in the ChainBloom workspace in [InScribe](app) shows an unsigned transaction and a preview: which path moves, the outputs, the miner fee, the change, and any warnings. The attendant reads it aloud.

### Sign and broadcast
The museum's key signs. The visitor watches.

### Wait for a block
The moment is not final until a miner includes it. The attendant hands over a card with the transaction id so the visitor can check it later from anywhere.
:::

That last card matters more than it looks. It is how a visitor verifies their own moment without asking the museum's permission or trusting the museum's screen.

## The gallery's side

### Staffing the station

Budget one trained attendant whenever the station is open. Their job is explaining the legend, reading the preview aloud, and refusing to choose for the visitor. Keep a paper log beside the screen: date, path, four numbers, transaction id. It takes ten seconds and it is your archive when the software changes.

Pace matters too. Each path is held by one [[carrier]] output, and it can take at most one step per block — roughly ten minutes — because the protocol rejects a step whose own parent is not yet confirmed in an earlier block, with the code `UNCONFIRMED_LINEAGE_PARENT`. Six paths can advance in parallel; one path cannot serve a queue quickly. Run turns across different paths if you want throughput.

### Accessible labels

:::tip
Never let a choice depend on colour alone. Each of the {{PALETTE_COUNT}} palettes needs a printed name and a number, so a visitor who cannot distinguish them can still choose one on purpose. The same goes for the {{GLYPH_COUNT}} glyphs and {{MOTION_COUNT}} motions.
:::

Practical minimums, all of which cost very little:

- Label copy at seated eye height, at least 18pt, dark on light, no text over image.
- Every glyph shown large in outline with its number and its name in words.
- A tactile card set of the glyphs, and a large-print legend at the desk.
- The attendant's script written down, so every visitor gets the same explanation.
- A route to take part that does not require standing: the visitor chooses, the attendant operates.

More detail is in [accessibility](/docs/programs/accessibility).

### What the wall text should say

Wall text carries the claims, so it has to be exact. This is short enough to fit and honest enough to defend:

> *Hall Four: Tides* is made by its visitors between March and September. It has six lines and each line can take up to 64 moments. Every moment is a record on the Bitcoin network: public, timestamped, and permanent. It cannot be edited or deleted by the museum.
>
> The museum pays the network fees. Nothing is for sale here, and taking part costs a visitor nothing.
>
> Each line is held in place by a small Bitcoin output that the museum controls. Holding it is control of that output. It is not a claim of authorship, copyright, or ownership over anything in this room.
>
> The image on this wall is one way of drawing the record. Other viewers may draw the same six lines differently and be equally correct.

:::warning
Two sentences never to put on a wall: that a moment can be removed on request, and that a screenshot of the work proves an event happened. The first is not true and cannot be made true. The second confuses a picture with a record — the transaction id is the proof, and it is the thing to print on the visitor's card.
:::
