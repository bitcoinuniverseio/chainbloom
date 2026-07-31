---
title: Network fees and confirmation expectations
nav: Fees and confirmation
description: There are only two costs — a miner fee, and the small amount of bitcoin carried inside each path output that returns to you when the path completes — and this page shows how both behave.
socialTitle: What a ChainBloom step actually costs
socialDescription: The two costs, the shape of each transaction, how fee rate decides your wait, and what confirmation changes.
updated: 2026-07-31
order: 6
keywords: [fees, fee rate, sat/vB, confirmation, mempool, cost, satoshis]
related: [learn/confirmed-and-unconfirmed, participate/wallet-and-review, help/troubleshooting]
cta:
  title: Something stuck or unexpected?
  body: Slow confirmations, replaced transactions, and rejected steps all have plain explanations.
  label: Open troubleshooting
  href: /docs/help/troubleshooting
---

:::lead
Taking part in a world costs a Bitcoin network fee and nothing else. The {{CARRIER_VALUE_SATS}} satoshis that sit inside your path are not a payment — they travel with the path and return to you when you complete it. This page tells you what to expect for both.
:::

## The two costs

**A miner fee.** Every ChainBloom step is an ordinary Bitcoin transaction, so it pays the same fee any transaction pays, to the miners, for being included in a block. ChainBloom charges nothing on top and takes no cut. Nobody can refund a fee once the transaction is mined.

**{{CARRIER_VALUE_SATS}} [[satoshi|satoshis]] per live path.** Each path is held in place by one output of exactly {{CARRIER_VALUE_SATS}} satoshis. Every step spends that output and creates the next one at the same value, so the amount never grows. When you complete a path, no successor is created and those {{CARRIER_VALUE_SATS}} satoshis come back to you along with your change.

That is the entire cost model. There is no fee to join a world, no subscription, and nothing to buy.

:::note
A world with the maximum of {{MAX_LANES}} paths locks up {{MAX_LANES}} × {{CARRIER_VALUE_SATS}} satoshis while it is running, held by whoever holds each path. The creator funds the first set at creation; after that, each step's signer funds their own successor.
:::

## What you are paying to put on chain

Fees scale with how big a transaction is, not with how much value it moves. So the shape of the action decides most of the cost.

:::demo name=fee-explorer
Every ChainBloom transaction has one marker output at `vout 0` — an OP_RETURN carrying zero value and at most {{MAX_MARKER_BYTES}} bytes. What changes is the number of path inputs and path outputs around it.

| Action | Path inputs | Path outputs | Note |
| --- | --- | --- | --- |
| Create a world with three paths | none | 3, at `vout 1`–`vout 3` | one root [[carrier]] per path |
| Bloom | 1, at `vin 0` | 1, at `vout 1` | the successor replaces the parent |
| Echo | 1, at `vin 0` | 1, at `vout 1` | same shape as a bloom, different payload |
| Meeting | 2, at `vin 0` and `vin 1` | 2, at `vout 1` and `vout 2` | both paths carry on |
| Complete a path | 1, at `vin 0` | none | the {{CARRIER_VALUE_SATS}} satoshis are released |

Fee inputs come after the path inputs — from `vin 1` for a bloom, echo or completion, and from `vin 2` for a meeting — and change comes back to you at the end. Every path output is exactly {{CARRIER_VALUE_SATS}} satoshis.

Reading the table as cost: a meeting is the largest of the ordinary steps, because it carries two inputs and two outputs plus the marker. Completing a path is the smallest, because it creates no successor. Creating a world grows with the number of paths you open.
:::

## Choosing a fee rate

A [[fee rate]] is stated in **sat/vB** — satoshis per virtual byte. Multiply it by the size of your transaction and you get the fee. Miners fill each block from the top by rate, so a rate is really a queue position.

Two consequences worth internalising:

- **A low rate does not fail, it waits.** Your transaction sits in the [[mempool]] until the backlog above it clears. That can be one block or many, and nobody can promise which.
- **The same rate costs more for a bigger action.** At an identical sat/vB, a meeting costs more than a completion, because there is more of it to store.

Bitcoin aims for one block roughly every ten minutes, which is why {{MIN_DURATION_BLOCKS}} blocks is about {{MIN_DURATION_DAYS}} day of world lifetime. Fee estimates from a public mempool source will tell you what rate is currently clearing quickly. The ChainBloom workspace inside [InScribe](app) returns the miner fee, the change, and the fee rate it used in the preview it hands you before you sign, so you can check the arithmetic yourself.

:::tip
If nothing about your step is urgent — and in a world that stays open for weeks, very little is — a modest rate is the sensible default. What you cannot do is take the *next* step on the same path until this one confirms, so pick a rate you are willing to wait out.
:::

## While it waits

An unconfirmed transaction is a proposal, not a fact. Two things follow.

**It is replaceable.** ChainBloom requires every input to carry sequence {{RBF_SEQUENCE_HEX}} and the transaction to be version {{TX_VERSION}}. That sequence is the standard opt-in signal for [[rbf|replace-by-fee]], so a step that is waiting can be replaced by another version of itself paying a higher fee. This is a feature: it is how you rescue a step you sent at too low a rate.

**Two versions cannot both survive.** A replacement spends the same path output as the original, so only one of them can ever confirm. Tooling that projects unconfirmed transactions reports the other candidates as conflicts rather than pretending both exist.

:::warning
Anything you see before confirmation is a preview. A preview can be replaced, dropped, or overtaken. Never treat a screenshot, a preview, or a mempool listing as proof that a contribution is part of a world.
:::

## When it confirms

A [[confirmation]] is the moment your contribution stops being yours alone and becomes shared history. Before it, the step exists in your wallet and in some mempools. After it, it has a block height and a position inside that block, and every independent reader replaying the chain places it at exactly the same point in the world's order.

That is the whole reason Bitcoin is in this design — not payment, but agreement about order, without a referee.

Confirmation also unlocks the next move. A step is rejected with `UNCONFIRMED_LINEAGE_PARENT` if the path's own previous event is in the same block or later, because a parent must already be confirmed in a strictly earlier block. In practice: contribute, wait for a block, then contribute again. An echo has the same rule about the moment it points at — the target must be confirmed earlier than the echo.

:::note
Very deep reorganizations can move a recently confirmed transaction back into the mempool. Indexers handle this by rolling back one block at a time to a common ancestor and replaying. It is rare, it is expected, and it is a reason to treat a single confirmation as strong rather than absolute.
:::

## What none of this costs

No transaction fee is charged by ChainBloom, no value accrues to a path, and holding a path is not an investment or a claim on anything. The {{CARRIER_VALUE_SATS}} satoshis are a place-holder that makes the ordering rule work — small enough to be unimportant, large enough to be a valid output.

If a step of yours seems stuck, replaced, or rejected, [troubleshooting](/docs/help/troubleshooting) walks through what each case means and what to do next.
