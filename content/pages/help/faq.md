---
title: Questions worth asking
nav: Questions
description: Short honest answers to what people actually ask about ChainBloom, including the several where the answer is no, and the ones where it is not yet.
updated: 2026-07-31
order: 2
keywords: [faq, questions, answers, cost, ownership, privacy, delete]
related: [help/status, help/glossary, start/chainbloom-in-60-seconds]
cta:
  title: Check the answer for yourself
  body: What exists today, what does not, and what was checked to find out.
  label: What is running today
  href: /docs/help/status
---

:::lead
These are the questions people ask before they decide whether to take part. Each answer is short, and none of them is a sales pitch. Where the true answer is "no" or "not yet", that is what it says.
:::

## What this is, and what it is not

### Is this a token or an investment?

No. There is no coin, no supply, no balance, no yield, no listing, and nothing to buy or sell. Nobody profits when you take part and nobody profits when you stop.

The {{CARRIER_VALUE_SATS}} satoshis you keep hearing about are not a price, a stake, or a deposit. A Bitcoin output has to hold some value to exist, and {{CARRIER_VALUE_SATS}} satoshis is the small amount ChainBloom fixed on so that every [[path]] looks the same to software. Each step spends the current output and creates the next one with the same amount inside. When someone completes a path, that output is spent with no successor, and the value goes back to the wallet that signed, less the miner fee. It is a baton, not a balance.

### Who owns a world?

Nobody. A [[world]] is one confirmed Bitcoin transaction and everything descended from it. The person who created it chose how many paths it has, how long it stays open, how many steps each path may take, its seed, and its title, and after that transaction confirmed they gained no special power at all. They cannot edit a step, remove one, close somebody else's path, extend the duration, or take a world down.

The only thing anyone controls is what happens next on a path whose [[carrier]] they can spend, and only on that path.

### Does holding a path prove I made something?

It proves one narrow thing: whoever signed that transaction could spend that output at that moment. That is all.

It does not prove who they are, that they made the work, that they had permission, or that anybody has a legal claim to anything. Keys can be shared, sold, stolen, or held by a group. Treat a path as evidence of a sequence, never as evidence of a person.

### Can two galleries show the same world differently?

Yes, and both can be right. The shared record is numbers, not pictures. A bloom carries a glyph, a palette, a motion, and a magnitude, and nothing in the protocol says what a glyph looks like or which colours a palette contains.

The package includes one reading of those numbers, `projectBloom` and `renderWorldSvg`, and marks it as explicitly not part of consensus. Positions come from a hash of the world seed, the event's transaction id, and the operation, so two independent viewers can look related without ever talking to each other. A gallery that draws the same world as a garden and another that plays it as music are not in conflict.

## Money, keys, and privacy

### What does it cost?

Two things and no more. A Bitcoin miner fee for each contribution, at whatever the fee rate is when you send it. And {{CARRIER_VALUE_SATS}} satoshis held in each path output while that path is alive, released when the path is completed.

There is no price to join, no subscription, no listing fee, and no cut taken by anyone. The application shows you the total input, the miner fee, the change, and the fee rate before you sign. [Fees and confirmation](/docs/participate/fees-and-confirmation) has the details.

### Can I take part without spending anything?

Reading, planning, and checking cost nothing. Beyond that, the protocol supports test networks alongside mainnet, so you can encode and decode markers, build unsigned drafts, and replay state with the command line tool without touching real money.

Adding a moment to a world on mainnet always costs a real fee. And there is a blunter answer today: there is no public index of live worlds, so there is nothing public to join yet. See [what is running today](/docs/help/status).

### What if I lose my keys?

Any path held by that wallet can never move again. There is no recovery, no support desk, no override, and nobody who can sign on your behalf. The paths simply stop where they are, and eventually expire with the world.

What is already confirmed stays in the history and stays readable by anyone, forever. What has not happened yet can never happen.

:::safety
Back up your wallet before you take a path, not after. Losing keys does not damage the world or anyone else's paths, but the thread you were holding ends there and no one can pick it up.
:::

### Is my Bitcoin address public?

Yes, in the same way every Bitcoin transaction is public. Anyone reading the chain can see which outputs your contribution spent and created, and that record does not expire.

So do not use an address you have already tied to your name unless you are content with the connection being made permanently. For a world you would rather not have linked to you, use a wallet you keep for that purpose alone. [Moderation and privacy](/docs/programs/moderation-and-privacy) goes through this properly, including what an organisation running a public world owes the people taking part.

### Do I need to understand Bitcoin?

To take part, no. You need a wallet, a small amount of bitcoin, and the patience to wait for a block.

Two ideas do help, and they are both one sentence long. [[confirmation|Confirmation]]: until a block includes your step, nothing about it is settled. Irreversibility: once a block does include it, nobody can undo it, including the people who wrote this software. If those two are comfortable, the rest is detail you can pick up later in [Bitcoin and shared order](/docs/learn/bitcoin-and-shared-order).

## What you can and cannot change

### Can I delete a contribution?

No. Nothing removes a confirmed step: not you, not the world's creator, not the people who wrote the protocol, not a court order aimed at this website. That is the same property that makes the history worth having.

What you can do instead:

- Complete the path, so it takes no further steps and has a deliberate ending.
- Leave it and let the world reach its last block.
- Ask viewers and galleries not to display it. A viewer can always choose what to draw, and that is a real remedy, but be clear about what it is: the record still exists and anyone reading the chain still sees it.
- Best of all, decide before you sign. Never put anything on chain that you would later need removed.

### What happens when the world ends?

A world ends in one of two ways. It reaches `endHeightExclusive`, the height it was created at plus its duration, and becomes EXPIRED, taking every live path with it under the reason `WORLD_DURATION_ELAPSED`. Or every path in it has already been completed or ended, and the world becomes ENDED.

Either way, no further step is accepted, and everything already confirmed stays readable by anyone who reads Bitcoin. An ending is not a failure. Knowing there is one is part of why people bother to make the last moment good.

### Can I change a world after I create it?

No. The create transaction fixes the number of paths, between {{MIN_LANES}} and {{MAX_LANES}}; the duration; the maximum steps per path, between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}; the {{SEED_BYTES}}-byte seed; and the title, at most {{MAX_TITLE_BYTES}} plain ASCII characters.

Write all of that down and read it back before you sign. If you get it wrong, the remedy is to create another world, not to fix the first one. [Create a world](/docs/participate/create-a-world) has a checklist for exactly this.

### How long does a world stay open?

Between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks, which is roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days.

Note that it is measured in blocks, not in days. Blocks arrive about every ten minutes on average, but the average is only an average, so a world's calendar length drifts. If a world must line up with a real date, such as the last night of a festival, leave yourself room.

## Proof, tools, and what exists today

### How do I know a moment is real?

Keep the [[txid]]. That is the whole answer.

With a transaction id, anyone can look the transaction up on any Bitcoin [[explorer]] they choose and see which block holds it. To check that it is a ChainBloom action rather than an ordinary payment, decode it: `chainbloom tx parse --hex <raw transaction>` reads the marker and tells you which operation it is. A valid marker sits at output zero, holds zero value, and begins with the letters {{PROTOCOL_MAGIC}}, which is `{{PROTOCOL_MAGIC_HEX}}` in hex.

A screenshot proves nothing. A website saying so, including this one, proves nothing. The chain is the only thing that settles it.

### What if this website disappears?

The histories do not live here. They live in Bitcoin, and anyone with a Bitcoin node and the same rules rebuilds the same worlds from scratch. That is what `chainbloom state replay` does, and snapshots come out sorted by id and by height so two independent readers land on identical results.

The rules, the package, and the published test vectors are all in [the repository](https://github.com/bitcoinuniverse/chainbloom), under a licence that lets anyone keep a copy. The honest caveat: today rebuilding means running an indexer yourself, because the public one is not switched on.

### Is there a mobile app?

No, and none is promised here. What exists is the ChainBloom workspace inside InScribe, which runs in a web browser, and a command line tool for people who want to build or check transactions themselves.

### Where can I browse existing worlds?

Not publicly, not yet. The public status endpoint answers HTTP 503 because the indexer URL is not configured, and no public block explorer has a ChainBloom surface. Any site showing you a count of worlds today would be showing you an invention.

[What is running today](/docs/help/status) states precisely what was checked, on what date, and what it returned.
