---
title: Running a world as an exhibition
nav: Exhibitions
description: The floor-level detail of putting a ChainBloom world in a gallery — the staffed station, the wall text, visitors with no wallet, fees on an institutional budget, and what survives after closing night.
socialTitle: Running a ChainBloom world as an exhibition
socialDescription: Station, wall text, throughput, fees, dates versus block heights, and the archive you keep afterwards.
updated: 2026-07-31
order: 2
keywords: [exhibition, gallery, museum, station, wall text, install, opening, closing]
related: [programs/organizations, programs/accessibility, examples/museum-exhibition]
cta:
  title: Make the room work for everyone
  body: Text alternatives, stills for motion, keyboard access, and cost explained in plain language.
  label: Accessibility for creative worlds
  href: /docs/programs/accessibility
---

:::lead
An exhibition is the easiest home for a ChainBloom world, because a show already has an opening, a closing and a shape. This page is the practical half — the desk, the sign, the queue, the money, and the box of information you keep when the walls come down.
:::

## The station

Put one staffed station in the room. Not a kiosk. A person.

A visitor at the station is going to sign a real Bitcoin transaction, and the moment they hesitate is the moment your programme either earns trust or loses it. The station needs a member of staff who can say, in their own words, what happens when the visitor presses the last button and why nobody can take it back.

What the station holds:

- A screen running the ChainBloom workspace inside [InScribe](app). It has four surfaces — Explore for confirmed [[world|worlds]], Lanes for the live [[path|paths]] held by the connected address, Act to build a plan and review, sign and broadcast it, and Learn.
- A dedicated wallet holding only the coins for this programme. Never the institution's general wallet. A wallet that does not know about ChainBloom can spend a [[carrier]] output as ordinary change, and if that spend confirms, the path becomes abandoned with the reason `INVALID_CONFIRMED_SPEND`. Nothing replaces it. Keeping programme coins apart is the cheapest insurance you will buy.
- A printed one-page briefing for staff, including the sentence about irreversibility and what to say when a transaction is slow.
- A second screen or a print showing the world so far, so people waiting can see what they are joining.

### How many people can actually contribute

There is a hard limit worth knowing before you design the queue. A step is rejected if the path's own previous event is in the same block or later, and the validation rules emit `UNCONFIRMED_LINEAGE_PARENT`. A path advances at most once per block.

About {{MIN_DURATION_BLOCKS}} blocks arrive in a day, so a single path can take at most about that many steps in a day, and in practice far fewer. With {{MAX_LANES}} paths open you have {{MAX_LANES}} independent queues, not one. If you expect a crowd, more paths help; a longer opening does not.

:::note
The person at the front of the queue does not have to wait for confirmation before leaving. Their transaction sits in the [[mempool]] and confirms without them. The station should tell them how to check it later, and [confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed) explains what they are checking.
:::

## What the wall text must say

Wall text is where institutions get careless, because the honest sentences are less exciting than the dishonest ones. Five things belong on the wall, in plain words.

1. **What the world is.** The invitation, in one paragraph. How many paths, how long it stays open, what a step is asked to mean.
2. **What taking part costs.** A network fee paid to Bitcoin miners, plus {{CARRIER_VALUE_SATS}} satoshis held in the path while it is alive and released when the path is completed. Say who pays it — the visitor or the venue.
3. **That it cannot be undone.** Once a step is confirmed in a block, no one can remove it, edit it or reorder it. Not the visitor, not the artist, not the museum.
4. **That there is nothing to own.** No token, no edition, no certificate, nothing to sell later. If your marketing department writes otherwise, this is the sentence that has to win.
5. **Where to read more.** A short URL to your own programme page, and from there to [what is running](/docs/help/status), so nobody is misled about what can be browsed today.

What must not be on the wall: any number describing future value, any claim that the record proves who made something, and any implication that the museum can withdraw a contribution on request.

:::warning
The public index is not switched on, so a wall panel cannot promise "browse every world online". Today the honest sentence is that the history is on Bitcoin and readable by anyone running an indexer, and that public browsing is not available yet.
:::

## Visitors who do not have a wallet

Most of your audience will not have one, and it is a mistake to build the programme around the few who do. Offer three tiers and let people choose without embarrassment.

**Watch.** The world on a screen, with the ordered history beside it. No wallet, no cost, no account. This is the default experience and it should be good on its own — see [accessibility](/docs/programs/accessibility) for the plain ordered list that makes it work for everyone.

**Contribute through the host.** The visitor chooses what the step should be, and the station signs from the programme wallet. This is the tier most people will use. It is honest as long as the wall text says the venue holds the keys — the record shows the venue's address, and the visitor's authorship lives in your own documentation, not on the chain.

**Contribute themselves.** The visitor connects their own wallet and signs. Reserve this for people who arrive wanting it. Do not spend twenty minutes of a queue installing a wallet for someone who came to see a show.

:::safety
Never help a visitor create a wallet, and never touch anybody's seed words or private keys at a station. If someone asks, point them at documentation and let them do it at home, on their own device, at their own pace.
:::

## Network fees on an institutional budget

The fee is not a fixed price. It is the fee rate on the day multiplied by the size of the transaction, and fee rates move.

For budgeting, the useful shape is: total fees are roughly the number of contributions times the fee for one step. Set an internal ceiling per contribution, and have the station check the fee before signing rather than after. When ChainBloom is connected to an index, the build response returns an unsigned transaction plus a preview with the path mappings, outputs, total input, miner fee, change, fee rate, locktime and any warnings. Read the miner fee off that preview and stop if it is above your ceiling.

Two more budget facts worth having in the paperwork:

- The {{CARRIER_VALUE_SATS}} satoshis per live path are held, not spent. They come back when the path is completed. Finance will ask; that is the answer.
- Creating the world funds one root carrier per path, so a world with the maximum {{MAX_LANES}} paths locks {{MAX_LANES}} times {{CARRIER_VALUE_SATS}} satoshis from the first day.

[Fees and confirmation](/docs/participate/fees-and-confirmation) explains how to read a fee before signing and what to do when a transaction sits unconfirmed for longer than you would like.

## Opening and closing dates versus block heights

Your show closes on a date. The world closes at a [[block height]]. These are not the same thing and confusing them is the most common planning mistake.

When the world is created, the creator picks a duration in blocks, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}}. The end point is `endHeightExclusive`, which is the height of the block that confirmed the creation plus the duration. It is fixed at that moment and cannot be moved, extended or shortened by anyone.

Blocks are not a calendar. A run of slow blocks pushes the real end date later; a run of fast ones pulls it earlier. So:

- Convert your closing date to blocks using about {{MIN_DURATION_BLOCKS}} blocks a day, then add real margin — days, not hours.
- Create the world well before the private view, not on the morning of it. The world does not exist until the creating transaction confirms, and every path's first step must come in a strictly later block.
- End the show deliberately. On the last night, complete each path on purpose. A completed path records a terminal reason of `CLOSE_<reason>`, and the world becomes ended once no live paths remain. A path left running until the duration elapses expires with the reason `WORLD_DURATION_ELAPSED`, which reads on the record as an exhibition that stopped rather than finished.

:::tip
Set the duration longer than the show and close the paths by hand on the final evening. That gives you a real ending, a public ceremony, and a safety margin if the closing date slips.
:::

## After the show

The work does not need your website to survive, but it does need you to write down four things before the install comes down.

- The **world id**, which is the transaction id of the creating transaction.
- The **network** it was made on.
- The **[[seed]]**, {{SEED_BYTES}} bytes, which any renderer needs to reproduce the same visual arrangement.
- The **event list** — each contribution's transaction id and the block height it confirmed in.

With those, anyone can rebuild the world from the chain, in the same order, without you. An independent replay sorts worlds and paths by id and events by height and then by position within the block, which is exactly why two people replaying separately get the same result.

What you cannot archive is the look. Rendering is deliberately outside the rules — see [`src/render.ts`](repo:src/render.ts) — so a gallery in ten years may draw your world in a way you would not recognise, and it will not be wrong. If the specific appearance matters to the work, archive your renderer's source and a high-resolution capture alongside the four items above, and label the capture as one interpretation rather than as the record.

The carriers are the loose end. Any path you did not complete still holds {{CARRIER_VALUE_SATS}} satoshis on an address somebody has to keep the keys to. Decide before deinstall who that somebody is, and put it in the same document as the world id.
