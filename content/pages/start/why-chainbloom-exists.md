---
title: Why ChainBloom exists
nav: Why it exists
description: Three ordinary problems ruin shared creative work — a feed with no shape, a group voice that flattens into one, and a record only its host can vouch for. One structure answers all three.
socialTitle: Why ChainBloom exists
socialDescription: A feed has no ending, group work flattens, and shared records depend on whoever hosts them. Here is what a bounded world settled by Bitcoin does about that.
updated: 2026-07-31
order: 2
keywords: [why chainbloom, motivation, feed, collaboration, shared record, permanence, early]
related: [start/chainbloom-in-60-seconds, learn/how-a-world-grows, audiences/world-creators]
cta:
  title: See the shape for yourself
  body: A three-path world from its first moment to its last, with nothing to install and nothing to sign.
  label: Watch a world grow
  href: /docs/start/watch-a-world-grow
---

:::lead
If you have ever finished something with other people and then could not point at the thing you made, this page is for you. ChainBloom exists because three ordinary problems keep spoiling group creative work, and one bounded structure answers all three at once.
:::

## A feed has no shape, so nothing in it becomes a whole

A feed has no first page anyone remembers and no last page at all. It cannot finish. Because it cannot finish, nothing inside it finishes either. You do not re-read a feed; you scroll further away from it. Work posted into one is not part of a work — it is a sediment layer.

Shape needs edges. A [[world]] has them from its first second. Whoever opens one fixes how many [[path|paths]] it contains, how long it stays open — anywhere from {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days — and how far any single path may travel, up to {{MAX_MAX_STEPS}} steps. Those numbers are written into the transaction that opens the world. Nobody can edit them afterwards, including the person who chose them.

That changes what people make. If you know a path has a handful of steps left and a fixed date after which it takes none, you spend them differently. You save the good idea for the end. You answer somebody instead of talking over them. Deadlines and endings are not administrative details in creative work; they are half the form. A sonnet is interesting partly because it stops.

## Group creative work usually flattens into one voice

Put five people in a shared document and you get one document. The loudest editor wins the introduction. The last save decides the wording. A wiki keeps only the result and throws away the argument that produced it. A band's shared folder ends up as one mix, and the three rejected mixes vanish. The record survives; the plurality does not.

ChainBloom keeps the threads apart on purpose. Each path is its own line and stays its own line for the whole life of the world. Nothing in the protocol edits or deletes somebody else's step, because no such action exists. There are {{OPERATION_COUNT}} things anyone can do, and none of them reaches backwards to change what is already there.

Two paths can still speak to each other, in two ways:

- An **echo** adds a new moment on your path that names an earlier moment on another path. It points at that moment. It does not touch it, move it, or claim it.
- A **[[meeting]]** is a single moment shared by two paths at once. Both paths keep going afterwards. Neither is absorbed into the other, and the world still has the same number of paths the next morning.

That is the difference worth caring about. Most collaboration tools give you agreement by erasure. This one gives you contact without erasure — you can answer somebody and leave their answer intact.

## Shared records usually depend on whoever hosts them

The third problem is the quiet one. Ask who decides the order of a shared archive and the answer is almost always a company, a server, or a volunteer with database access. The order is whatever the rows say. If a row changes, nobody outside can tell. If the host stops paying the bill, the order is gone and the work becomes a folder of files with no story.

This is why Bitcoin is here, and the reason is narrower than people expect. Not money. Not price. **Agreement about order.**

Bitcoin already solves one specific thing for everyone, continuously: it settles what came first without a referee. ChainBloom borrows exactly that and nothing else. Each path is held in place by a single small output worth {{CARRIER_VALUE_SATS}} satoshis — the [[carrier]]. Adding a step to a path spends that output and creates the next one. Bitcoin refuses to let one output be spent twice, so a path cannot fork into two rival versions and no two people can both claim to have gone next. The block that confirms your step puts it at a point everybody reads the same way.

:::note
The practical result is replay. Anyone applying the same rules to the same blocks rebuilds the same worlds, the same paths, and the same order — no shared server, no agreed index, no trust in this site. If this documentation disappeared, the histories would not.
:::

## One structure, three answers

Put those together and the three problems have one shape between them:

- **The world is bounded**, so the thing you make can be finished and looked at as a whole.
- **The paths stay separate**, so a group can make something plural instead of something averaged.
- **The order is settled by Bitcoin**, so the record does not need a host to vouch for it.

None of those is a feature added to the others. Remove any one and the other two stop working — an unbounded world has nothing to complete, merged paths lose the plurality, and a hosted order makes the whole record a claim rather than a fact.

## What is honestly not settled yet

This is early, and pretending otherwise would waste your time.

The protocol is written and tested against published [test vectors](/docs/reference/test-vectors), and the flow for building and signing a world runs inside [InScribe](app). The public index that would let anyone browse confirmed worlds is not switched on, so there is nothing to browse today and no counts of anything to show you. [What is running](/docs/help/status) states exactly where each piece stands, and it is kept current.

No wallet understands ChainBloom yet either. That means the {{CARRIER_VALUE_SATS}}-satoshi output holding a path looks like ordinary dust to ordinary software, and ordinary software may spend it by accident. [Protect your path](/docs/participate/protect-your-path) explains what to check yourself in the meantime.

Then there is the larger unsettled thing, which is not a bug: **nobody knows yet what a good world looks like.** How long should one stay open before it goes slack? Is a meeting better when it is rare? Does an ending feel earned if the last step is the smallest one? What makes an invitation that strangers actually answer? Those are questions about a medium, and a medium is defined by its early work, not by its specification.

## That is the actual reason to take part now

Not urgency. There is no countdown and nothing runs out. The reason is that the conventions are still open, and conventions get set by the people who make the first honest attempts and then say plainly what worked.

If you make a world in the next few months, you are not a late user of a settled form. You are one of the people deciding what the form is. The most useful contribution available right now is a world you would genuinely want to be inside, followed by a clear account of what went well and what did not.

:::warning
Taking part means signing real Bitcoin transactions and paying real fees to miners. A confirmed step cannot be undone by anyone, including us. Read [fees and confirmation](/docs/participate/fees-and-confirmation) before you spend anything.
:::

If you want to design one, [for world creators](/docs/audiences/world-creators) is written for exactly that, and the [example worlds](/docs/examples) show eight shapes that already make sense on paper.
