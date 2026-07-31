---
title: Organizations, exhibitions and public programs
nav: Organizations
description: What kinds of public programme suit a ChainBloom world, what the budget actually buys, the promises you must never make, and how to judge success without counting trades.
socialTitle: Running ChainBloom inside an organisation
socialDescription: Programme shapes, budget lines, forbidden promises, and honest measures of success.
updated: 2026-07-31
order: 1
keywords: [organization, museum, gallery, festival, commission, budget, programme, curation]
related: [programs/exhibitions, programs/moderation-and-privacy, audiences/museums-and-cultural-organizations]
cta:
  title: Now put it on a wall
  body: The staffed station, the wall text, and what happens to the work after closing night.
  label: Running a world as an exhibition
  href: /docs/programs/exhibitions
---

:::lead
You can commission a ChainBloom world the way you commission anything else: a brief, a budget, a schedule, a duty of care. What is different is that the finished work is a public record that nobody can edit afterwards, including you. This page covers what fits, what the money buys, the promises that would get you into trouble, and how to tell whether it worked.
:::

## What kinds of programme fit

ChainBloom offers one shape and it is narrow. A [[world]] has {{MIN_LANES}} to {{MAX_LANES}} [[path|paths]]. It stays open for a fixed span of {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, which is about {{MIN_DURATION_DAYS}} day to about {{MAX_DURATION_DAYS}} days. Each path may take at most {{MAX_MAX_STEPS}} steps. All three numbers are fixed in the block that confirms the world and can never be edited afterwards.

Pick a programme that wants that shape rather than one you have to bend into it.

### Exhibitions

A show already has a private view and a closing night, so it arrives with the ending ChainBloom insists on. One path per room, per commissioned artist, or per week of the run. [Running a world as an exhibition](/docs/programs/exhibitions) covers the floor-level detail.

### Festivals

Each stage or strand takes a path. The paths run in parallel through the weekend and [[meeting|meet]] on the last night, so the programme's real structure becomes the work's structure. A festival that already publishes a grid of stages has done most of the design work.

### Membership rituals

A monthly gathering where one member takes the next step on the group's path. Twelve steps, twelve months, one visible line. It is small, cheap, and it makes attendance legible without a leaderboard or a score.

### Learning programmes

A term has a start date and an end date, which maps onto a world duration with no argument. See [education and classroom use](/docs/programs/education).

### Artist collaborations

Two or three artists who have not worked together each hold a path, answer each other with echoes, and meet once. Nobody's line is absorbed into anyone else's. That is normally the sticking point in a collaboration, and the reason many of them quietly fail.

:::note
A programme that needs to be edited after the fact does not fit. If your legal or curatorial process requires the ability to withdraw a contribution from the record, read [community moderation and participant privacy](/docs/programs/moderation-and-privacy) before you commit to anything.
:::

## What the organisation actually pays for

Nobody pays ChainBloom. There is no licence, no platform fee and no cut. Your budget goes to the same places it always does.

| Line | What it buys |
| --- | --- |
| Curation | The invitation. How many paths, how long the world stays open, what a step is asked to mean, who is invited to take one. This is the work; everything else is delivery. |
| Production | The physical or on-screen presence: the station, the display, the printed text, the interpretation that turns confirmed events into something worth looking at. |
| Access | Text alternatives, a still version of anything that moves, keyboard operation, plain-language explanations of cost. Budget it as a line, not as a favour. See [accessibility](/docs/programs/accessibility). |
| Hosting | Reading confirmed worlds needs an [[indexer]] following the chain. Either you run one or you pay someone who does. [Indexer requirements](/docs/reference/indexer-requirements) says what that involves. |
| Support | Staff time. Someone explains what a confirmed step is, answers "can I take it back", and handles the visitor whose transaction is still waiting. This is the largest hidden line in most programmes. |
| Chain costs | A network fee per contribution, paid to miners, plus {{CARRIER_VALUE_SATS}} satoshis held in each live path. |

The {{CARRIER_VALUE_SATS}} satoshis are not spent. They sit in the [[carrier]] output that holds the path in place, move to the next output at each step, and come back when the path is completed. The money that genuinely leaves the budget is the miner fee on each transaction, and that depends on the fee rate on the day. [Fees and confirmation](/docs/participate/fees-and-confirmation) has the real numbers and how to read them before signing.

:::warning
Every contribution is a signed Bitcoin transaction. Once it confirms, no refund, reversal or takedown exists. Write that sentence into the artist agreement, the visitor-facing text, and the staff briefing, in those words.
:::

## What you must not promise

This is where public programmes get organisations into trouble, and the rules are simple because ChainBloom has none of the machinery these promises would need.

- **Not a reward.** There is no payout, no yield, no distribution, no revenue share. Taking a step costs a fee; it does not earn anything.
- **Not an asset.** Do not describe a path as an edition, a mint, a collectible, a token or a certificate. It is a Bitcoin output holding {{CARRIER_VALUE_SATS}} satoshis so that a sequence of steps stays in one order.
- **Not resale value.** Never suggest a contribution will be worth something later. Do not put a number, a projection or a comparison anywhere near it.
- **Not proof of authorship.** Controlling a wallet does not prove identity, authorship, copyright or legal ownership of anything. If your programme needs to attribute work to a named artist, do that in your own records and your own wall text, with a normal contract.
- **Not permanence of meaning.** Bitcoin keeps the order of events. It does not keep your interpretation. Rendering is not part of the rules, so two galleries can draw the same world completely differently and both are correct.

Useful replacements: "your step joins a shared history in a fixed order" instead of "you own a piece"; "the network fee goes to miners" instead of "the cost of minting"; "the record cannot be edited" instead of "guaranteed forever".

## How to tell whether it worked

Trading volume is the wrong measure and it is also unavailable, since there is nothing to trade. Use measures that describe the work.

- **Deliberate endings.** How many paths were completed on purpose rather than running out the clock? A completed path records a terminal reason of `CLOSE_<reason>`; a path still live when the world reaches `endHeightExclusive` becomes expired with the reason `WORLD_DURATION_ELAPSED`. A programme where most paths expired is one where people stopped caring halfway through.
- **Returning contributors.** How many people took a second step on a path they had already touched? One-step participation is a queue; repeat participation is a practice.
- **Meetings.** A meeting needs two people to coordinate across two paths. Count them. They are the hardest thing in the medium and the clearest sign that a group actually formed.
- **Accidents.** How many paths became [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`? That happens when a wallet spends a carrier output as ordinary change. It is an operational failure, not an artistic one, and it means your briefing or your tooling let someone down.
- **Retelling.** Can a visitor describe the world to somebody else a week later? No indexer measures this. Ask them.

:::note
Today you cannot pull these figures from a public service, because the index is not switched on. You can compute them yourself by replaying the blocks you care about with `chainbloom state replay` (see [the CLI](/docs/reference/cli)), or by running an indexer. [What is running](/docs/help/status) is the current status.
:::

## Plan the programme

Work through this before the budget goes to committee. Each item is a decision somebody has to own by name.

:::checklist id=program-planning
- Name the ending. What date does the programme finish, and what should the last step feel like?
- Choose the path count between {{MIN_LANES}} and {{MAX_LANES}}, and say what each path represents.
- Choose the duration in blocks, with margin past your closing date, and write down the number you chose.
- Choose the step limit up to {{MAX_MAX_STEPS}}, and check it against how often you expect people to contribute.
- Write the invitation in one paragraph a visitor can read standing up.
- Decide who holds the keys for each path, and who signs when that person is away.
- Decide who is invited to take a step, and how you tell somebody they are not.
- Write the visitor-facing sentence about irreversibility and get it approved by whoever approves your other copy.
- Set the chain budget: fee per contribution times expected contributions, plus {{CARRIER_VALUE_SATS}} satoshis locked per live path.
- Decide who runs or pays for the indexer that lets people read the world.
- Book the access work as a production line item, not as a review at the end.
- Agree the moderation policy before the invitation goes out, not after the first problem.
- Decide what happens to the world after the programme closes, and who keeps the world id and the seed.
- Name the person who will answer questions on the day, and brief them on what cannot be undone.
:::
