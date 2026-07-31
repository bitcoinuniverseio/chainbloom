---
title: Troubleshooting and common errors
nav: Troubleshooting
description: What the message on your screen means, why it happened, and the next thing to do, arranged by what you see rather than by which part of the code complained.
updated: 2026-07-31
order: 1
keywords: [errors, troubleshooting, rejected, stuck, unconfirmed, abandoned]
related: [help/status, reference/errors, participate/fees-and-confirmation]
cta:
  title: Still stuck?
  body: Every code the protocol can emit, with the rule behind it and the file it lives in.
  label: Error reference
  href: /docs/reference/errors
---

:::lead
Almost every ChainBloom problem has one of about eight causes, and most are fixed by waiting one block, changing one input, or building the draft again. This page starts from the sentence on your screen and ends with the next thing to do.
:::

## Two checks before anything else

**Is it confirmed?** Until a block includes your transaction, nothing about it is settled. Look up the transaction id on any Bitcoin explorer you trust. If the explorer says "unconfirmed", you have a waiting problem, not a rejection problem.

**Is the read index switched on?** It is not. Requests for worlds, events, and counts fail today by design, not by accident. [What is running today](/docs/help/status) says exactly what does and does not answer.

## The application says ChainBloom is unavailable

**What it means.** The site you are using has no index to read from, so it cannot show you anything that happened on chain.

**Why it happened.** The public read endpoint answers with HTTP 503 and the message `ChainBloom is unavailable because CHAINBLOOM_INDEXER_URL is not configured`. The indexer software exists; it is not connected to a public address. Every read surface, including explore, depends on it, so all of them are empty at once. This documentation site cannot read that API either, so no page here shows a live number.

**What to do.** Nothing on your side will fix it, and refreshing will not help. If you need to read confirmed state today, run an indexer yourself or replay blocks with `chainbloom state replay -n <network> -f <path>` from the package. If you only wanted to look around, read an [example world](/docs/examples) instead: they are worked out end to end.

## My wallet has no verified BTC-only outputs to pay the fee

**What it means.** The application looked at your spendable outputs and found none it is willing to use for the miner fee.

**Why it happened.** Three separate rules narrow the list, and any one of them can empty it.

- Fee inputs must be native SegWit. An older output type is refused with `NON_NATIVE_SEGWIT_FEE_INPUT`.
- A [[carrier]] is never used to pay a fee. A carrier is exactly {{CARRIER_VALUE_SATS}} satoshis in a {{P2TR_SCRIPT_BYTES}}-byte Taproot script, and spending one outside a ChainBloom action ends that path for good.
- An output that has not been checked, or that turns out to hold something other than plain bitcoin, is left alone rather than risked.

**What to do.** Receive an ordinary bitcoin payment into a native SegWit address in the same wallet, wait for one confirmation, and build the draft again. Do not send that top-up to an address that already holds a path.

:::safety
Never sweep, consolidate, or empty a wallet that holds a carrier. No released wallet knows what a carrier is, so to your wallet it looks like {{CARRIER_VALUE_SATS}} satoshis of dust, and dust is exactly what a consolidation eats. Keep carriers in a wallet you do not use for ordinary spending.
:::

## My transaction has been waiting a long time

**What it means.** Your transaction is sitting in the [[mempool]]. Miners have not put it in a block yet.

**Why it happened.** Usually the fee rate you chose is below what the rest of the network is paying right now. Demand moves; a rate that was generous an hour ago can be ignored this hour. It can also happen when the transaction spends an output that is itself still unconfirmed, because miners must take the parent first.

**What to do, in order.**

1. Check the transaction id on an explorer. If it is present and unconfirmed, it is fine, just slow.
2. Wait. Fee pressure drops and rises through the day.
3. If you cannot wait, use [[rbf|replace by fee]]. Every ChainBloom transaction is built for it: transaction version {{TX_VERSION}}, and every input carries sequence {{RBF_SEQUENCE_HEX}}. Re-send the same action with a higher fee.

:::warning
Replacing a transaction gives it a new transaction id. Record the new one, because the old id will never appear in a block. Until yours confirms, someone else holding the same path can take a step first, and if their step confirms, yours can never confirm at all: the carrier it wanted to spend is gone.
:::

## My contribution was rejected as UNCONFIRMED_LINEAGE_PARENT

**What it means.** You tried to build on top of a step that is not confirmed yet, or that was confirmed in the very same block.

**Why it happened.** The rule is `Carrier parent must be confirmed in a prior block`. A [[path]] moves one confirmed step at a time, and the check is strict: if the path's last event height is greater than or equal to the height of your step, it is refused. This is what stops two people from racing chains of unconfirmed steps and disagreeing about the result.

**What to do.** Wait for one block, roughly ten minutes on average, then build the step again. If you are adding an echo, the same strictness applies to what you point at: the target must exist, be on the same network, and be confirmed in a strictly earlier block, or you get `UNCONFIRMED_GRAFT_TARGET`.

## A meeting failed with RENDEZVOUS_LANE_ORDER or CARRIER_INPUT_MAPPING

Both mean the same kind of thing: the transaction has the right pieces in the wrong places.

### RENDEZVOUS_LANE_ORDER

**What it means.** The two paths that are meeting appear in the wrong order.

**Why it happened.** A meeting spends both carriers, at input zero and input one, sorted lexicographically by lane id, which is written `<worldId>:<laneNumber>`. The message is `Rendezvous carrier inputs must be ordered lexicographically by lane ID`. The builder does that sorting for you, so seeing this means the input order changed after the draft was made.

### CARRIER_INPUT_MAPPING

**What it means.** The carriers are not at the input positions the action requires.

**Why it happened.** Each action fixes where a carrier sits. A bloom, an echo, and a completion take their carrier at input zero; a meeting takes two, at input zero and input one; fee inputs come after. The message names the positions it wanted, for example `Recognized carriers must be exactly at vin 0, 1`. The usual cause is a wallet that rebuilt the transaction, inserted its own fee input at the front, or picked a carrier as a fee input.

**What to do for either.** Sign the draft as it was handed to you. Turn off any wallet feature that reorders, replaces, or adds inputs. Build the draft again, and before you sign, check that the first input is the carrier you expect, and that a meeting has two carriers before any fee input. [Wallet connection and review](/docs/participate/wallet-and-review) shows what to look at.

## The world says WORLD_ENDED or MAX_STEPS_REACHED

### WORLD_ENDED

**What it means.** The world is finished. Nothing more can be added to it, by anyone.

**Why it happened.** One of two things. Either the world reached `endHeightExclusive`, which is the height it was created at plus its duration, so it became EXPIRED and every live path became EXPIRED with the reason `WORLD_DURATION_ELAPSED`. Or every path in it had already ended, so the world became ENDED. A duration is fixed at creation, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks, roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days.

**What to do.** Nothing repairs this, and nothing needs to. The history stays readable forever. An ending is the shape the creator chose, not a fault. If you want to carry the idea on, create a new world.

### MAX_STEPS_REACHED

**What it means.** This path has taken every step the world allows.

**Why it happened.** The world fixed a maximum when it was created, between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}} steps per path. The message is `Lane has reached max_steps`.

**What to do.** One action is still open to you: completing the path. Closing is deliberately allowed at the maximum, so a path can always be given a proper ending rather than just stopping. See [complete a path](/docs/participate/complete-a-path).

## My path says ABANDONED

**What it means.** The path ended because its carrier was spent by a confirmed transaction that was not a valid ChainBloom action.

**Why it happened.** The state machine marks every path that spend touched as [[abandoned]], records the terminal reason `INVALID_CONFIRMED_SPEND`, and keeps the offending spend in a list called `invalidCarrierSpends` so a reader can see what ended it. The usual cause is an ordinary wallet operation: a consolidation, a sweep, or a send that chose the smallest output available.

**What to do.** Nothing undoes it, and nothing is invented to replace the path. The steps already confirmed stay in the history exactly as they were. What you can do is protect the ones you still hold: move them to a wallet you do not use for spending, and freeze the outputs if your wallet has coin control. [Protect your path](/docs/participate/protect-your-path) is short and worth the five minutes.

## My step vanished after a reorganization

**What it means.** Bitcoin replaced its most recent blocks with a different branch, and your step was on the branch that got dropped.

**Why it happened.** A [[reorganization]] is normal and usually shallow. Any correct reader rolls back to the last block both branches share and replays forward, which is why every honest view agrees again afterwards.

**What to do.** Look up the transaction id. Most of the time it is picked up again in the new branch, at a different height but as the same step. If it did not come back, build the step again. If a step you built on has moved, wait a block before rebuilding so the parent is confirmed in an earlier block again.

**If you run software.** `applyBlock` refuses a block that does not extend the current tip, throwing `NON_CONTIGUOUS_BLOCK`, and a failure inside a block restores the snapshot taken before it. `rollbackTip` undoes exactly one block and can be given the hash it expects to remove, raising `ROLLBACK_HASH_MISMATCH` if it does not match and `NO_BLOCK_TO_ROLLBACK` if there is nothing to undo. [Reorganizations](/docs/reference/reorganizations) covers the whole procedure.

## Where the rest of the codes are

The [error reference](/docs/reference/errors) lists all three families in one place: codec errors thrown as a `ChainBloomError` when a marker cannot be read, builder errors raised while a draft is assembled, and the issues `validateProtocolTransaction` reports about a whole transaction. Each entry names the rule and the file it lives in, so you can check the source yourself in [src/validator.ts](repo:src/validator.ts).
