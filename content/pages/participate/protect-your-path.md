---
title: Protecting a live path
nav: Protect your path
description: A live path is one specific small Bitcoin output, and an ordinary payment that spends it ends the path for good — here is how to make sure that never happens.
socialTitle: Protecting a live ChainBloom path
socialDescription: Why a path can be lost by accident, four habits that prevent it, and exactly what the protocol does if it happens.
updated: 2026-07-31
order: 7
keywords: [protect, safety, coin control, sweep, consolidate, abandoned, outpoint]
related: [participate/wallet-and-review, reference/security-model, help/troubleshooting]
cta:
  title: Check the transaction before it is too late
  body: Six things to read on any signing screen, and a checklist that tells you when to stop.
  label: Read wallet and review
  href: /docs/participate/wallet-and-review
---

:::lead
Your place in a world is not stored in an account. It sits in one specific small Bitcoin output, and whoever spends that output decides what happens next. Four habits keep it safe, and they take about a minute to set up.
:::

## Your path lives in one output

When you take a [[path]] forward, the step you sign creates a new output worth {{CARRIER_VALUE_SATS}} satoshis. That output *is* your position in the world. Spending it with a valid ChainBloom action moves the path one step on. Spending it any other way ends the path.

There is nothing else holding your place. No password, no record on a server, no way to restore it. If that output is spent by an ordinary payment, the path stops there and nothing can bring it back — not the world's creator, not an indexer, not us.

:::warning
Nobody can reverse a confirmed spend. Not because of policy, but because a spent output cannot be unspent. This is the one irreversible risk in taking part, and it is entirely avoidable.
:::

## How it happens by accident

No released wallet knows what a ChainBloom output is. To your wallet, a live path looks like an ordinary {{CARRIER_VALUE_SATS}}-satoshi [[utxo|coin]] with no label. Wallets are built to be helpful with coins like that, which is exactly the problem.

The three usual ways people lose one:

- **Sweeping.** "Send max" empties an address, and a {{CARRIER_VALUE_SATS}}-satoshi output goes with everything else.
- **Consolidating.** Combining small coins into one to save on future fees is good practice, and it will eat your path without asking.
- **Automatic coin selection.** A wallet picking inputs for an unrelated payment may reach for the smallest coin it has. Yours is very small.

In every case the transaction is a valid Bitcoin payment. Nothing warns you, because nothing knows.

## Four habits that keep it safe

### Keep path outputs where you do not spend from

Use a separate account, wallet, or at minimum a dedicated address for paths you hold. If the only coins in that place are [[carrier|carriers]], no ordinary payment can reach them by accident. This single habit removes most of the risk.

### Write down the outpoint

The moment a step confirms, record the [[outpoint]] — the `txid:vout` pair of the new output. Not just the transaction id; the output index matters. Keep it with the world id and the path id, which reads `<worldId>:<laneNumber>` and is numbered from 0.

You need this to return to the path later, to verify a signing screen is spending the right thing, and to look the path up in any tool that reads confirmed state.

### Check before you sweep or consolidate

Before any transaction that empties or tidies a wallet, ask one question: does this spend an output I am holding for a path? Compare the input list against your written outpoints. Use coin control and deselect anything you cannot account for.

### Label it where you will actually look

Most wallets let you freeze or label a coin. Label it with the world title and the path number, not "do not spend" — six months later you will want to know *which* path it was.

:::tip
Do all four when you are calm, not when you are mid-transaction. The habit is what protects you; a rule you have to remember under pressure is not a habit.
:::

## What the protocol does if it happens

The protocol is honest about this rather than clever. When a confirmed transaction spends a live carrier and is not a valid ChainBloom event, every path it spent becomes **[[abandoned|ABANDONED]]** with the terminal reason `INVALID_CONFIRMED_SPEND`, and the offending spend is recorded in the state's list of invalid carrier spends, with its transaction id, block height, and the issue codes that made it invalid.

Nothing is invented to replace the path. No successor is conjured, no substitute output is nominated, and the path does not quietly continue somewhere else. Every independent reader replaying the chain reaches the same conclusion: this path ended here, this way.

The events the path already contributed remain part of the world's history exactly as they were. What ends is the ability to add more.

:::note
An abandoned path is different from a completed one. Completing a path is a `CLOSE` action you sign on purpose, it records a reason, and it releases the {{CARRIER_VALUE_SATS}} satoshis back to you. Abandoning is an accident, and the satoshis went wherever your unrelated payment sent them.
:::

## The other ways a path ends

Not every ending is a mistake. Knowing the full list makes the accidental one easier to recognise:

| Status | How it happens | Reason recorded |
| --- | --- | --- |
| `CLOSED` | You sign a `CLOSE` action deliberately | `CLOSE_<reason>` |
| `EXPIRED` | The world reaches the end of its lifetime | `WORLD_DURATION_ELAPSED` |
| `ABANDONED` | A confirmed spend was not a valid ChainBloom action | `INVALID_CONFIRMED_SPEND` |

A world's end height is fixed when it is created — the creation height plus its duration in blocks, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks, roughly {{MIN_DURATION_DAYS}} day to {{MAX_DURATION_DAYS}} days. At that height the world becomes [[expired|EXPIRED]] and every path still live expires with it. Separately, once a path has taken its maximum number of steps — up to {{MAX_MAX_STEPS}} — further steps are refused with `MAX_STEPS_REACHED`, though you may still complete it deliberately.

So write down the end height along with your outpoint. A path you meant to complete, left until after the world expired, ends as expired instead — and the {{CARRIER_VALUE_SATS}} satoshis stay in an output you can still spend, but the ending is no longer yours to write.

## Nobody ever needs your recovery phrase

:::safety
Your recovery phrase — the twelve or twenty-four words your wallet gave you — restores every coin you own. Nothing in ChainBloom needs it, ever.

Not to join a world. Not to return to a path. Not to recover an abandoned one. Not for support, verification, a migration, a snapshot, or an airdrop. There is no situation in which typing those words into a website or sending them to a person is the right move.

Anyone who asks for them is stealing from you, whatever else they say. Anyone who offers to "recover" a lost path in exchange for them is stealing from you twice — a spent output cannot be recovered by anybody, including whoever is asking.

Keep the words offline, on paper or metal, where a fire or a flood cannot take both copies.
:::

If something has already gone wrong, [troubleshooting](/docs/help/troubleshooting) explains how to tell an abandoned path from one that is merely waiting for a block, and [the security model](/docs/reference/security-model) sets out exactly what the protocol does and does not protect.
