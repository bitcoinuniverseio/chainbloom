---
title: Wallet connection and transaction review
nav: Wallet and review
description: Connecting a wallet shares one address and never your keys — this page shows exactly what to read on a signing screen before you approve a ChainBloom step, and what should make you stop.
socialTitle: What to read before you sign a ChainBloom step
socialDescription: Six things to check on every signing screen, a stop list, and what wallet authors still need to build.
updated: 2026-07-31
order: 5
keywords: [wallet, connect, sign, signing, psbt, review, address, safety]
related: [participate/protect-your-path, participate/fees-and-confirmation, reference/integration-wallets]
cta:
  title: Know what you are protecting
  body: Your path lives in one small output, and an ordinary payment can end it by accident.
  label: Read protecting a live path
  href: /docs/participate/protect-your-path
---

:::lead
Signing is the one moment in ChainBloom you cannot take back. Read this once and you will recognise a correct step on sight — and spot a wrong one while it still costs you nothing.
:::

## What connecting a wallet does

Connecting a wallet does one thing: it hands an application an address, and permission to ask you to sign something.

From that address alone, an application can work out which [[path|paths]] you currently hold, assemble an unsigned transaction that spends the right output, and hand it back to you for checking. In the ChainBloom workspace inside [InScribe](app), that build step returns an unsigned [[psbt]] together with a plain preview: which path maps to which input, every output, the total input value, the miner fee, the change, the fee rate, the locktime, and any warnings.

The preview is a proposal. Nothing has happened yet.

## What it does not do

It does not share your private keys or your recovery phrase. Those stay in your wallet, and a PSBT is designed exactly so they never have to leave it.

It does not grant a standing permission. Bitcoin has no allowance to switch on and forget about. Every step is one transaction, signed once, by you, and then it is over.

It does not prove who you are. Holding the output that carries a path lets you take that path forward. It is not evidence of identity, authorship, or any legal claim over what the world contains.

:::note
An address is public information. Handing one to an application is closer to giving out a postal address than a key. What matters is what you sign afterwards.
:::

## What to read before you sign

Six things, in this order. Each one takes seconds.

### The action

Every ChainBloom transaction carries a [[marker]] naming one operation: `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, or `CLOSE` — opening a world, adding a moment, answering an earlier moment, meeting another path, or ending a path on purpose. If the screen says `CLOSE` and you meant to add a moment, stop. Completing a path is deliberate and final.

### The world

A world id is the transaction id of the `CREATE` that opened it. Compare it with the world you think you are joining, character by character at both ends.

The marker also carries a network byte. A marker built for one network is invalid on another and validators report `NETWORK_MISMATCH`, so a mismatch here is a sign that something upstream is wrong.

### The path

A path id reads `<worldId>:<laneNumber>`, numbered from 0. Check that the input at `vin 0` is the [[outpoint]] you recorded when you last took this path forward — the `txid:vout` pair, not just the txid.

For a meeting there are two path inputs, at `vin 0` and `vin 1`, and the protocol orders them by path id. Two inputs are correct for a meeting and wrong for anything else.

### Every output

Read the whole list, not the first line:

- `vout 0` is the marker: an OP_RETURN output carrying zero value and at most {{MAX_MARKER_BYTES}} bytes. It must be first, and it must be the only ChainBloom marker in the transaction.
- The successor [[carrier|carriers]] come next — one at `vout 1` for a bloom or an echo, two at `vout 1` and `vout 2` for a meeting, one per path for a create. Each is exactly {{CARRIER_VALUE_SATS}} satoshis and each is a Taproot output.
- Change comes back to you. A completed path has no successor at all; its {{CARRIER_VALUE_SATS}} satoshis return to you with the change.

### The amount

Add it up. Total input, minus every output, is the fee. The {{CARRIER_VALUE_SATS}} satoshis in a path output are not spent — they are carried to the next step and released when the path is completed. If the numbers do not resolve to something close to the fee you chose, do not sign.

### The fee

Fees are real money and they are paid to miners, not to ChainBloom. Check the rate in sat/vB and the total in satoshis. [Network fees and confirmation](/docs/participate/fees-and-confirmation) explains what a sensible rate looks like and what happens while you wait.

## The life of one step

:::demo name=tx-journey
A ChainBloom contribution passes through seven stages. Nothing before stage six can be relied on, and nothing after it can be undone.

1. **Plan.** You choose an action and a path. Nothing is signed and nothing is spent.
2. **Build.** An unsigned PSBT is assembled: the marker at `vout 0`, the successor carrier or carriers, the path input at `vin 0`, fee inputs after it, and change.
3. **Review.** You read the decoded plan — action, world, path, outputs, amount, fee — and compare it with what you meant to do.
4. **Sign.** Your wallet signs the inputs it owns. Keys never leave it. Every input carries sequence {{RBF_SEQUENCE_HEX}} and the transaction is version {{TX_VERSION}}.
5. **Broadcast.** The signed transaction reaches nodes and waits in the [[mempool]]. It is visible, it is replaceable, and it is not yet part of the world.
6. **Confirm.** A miner includes it in a block. This is the moment the step becomes real for everyone.
7. **Settle.** Indexers apply that block and the path advances by one step. Until the next block arrives, that step cannot be built on — a parent must already be confirmed in an earlier block, or validation returns `UNCONFIRMED_LINEAGE_PARENT`.
:::

## Stop if any of these is not true

Tick a line only when you have actually checked it. If one of them fails, do not sign — nothing is lost by walking away at this point.

:::checklist id=review-before-signing
- The action shown is the action I intended.
- The world id matches the world I meant to take part in.
- The input at `vin 0` is my path's outpoint, and I recorded that outpoint myself.
- There is exactly one OP_RETURN output, it is `vout 0`, and it carries zero value.
- Every path output is exactly {{CARRIER_VALUE_SATS}} satoshis and every one of them is a Taproot output.
- The number of path inputs matches the action — one for a bloom, echo or completion, two for a meeting.
- The change address belongs to me.
- The fee is an amount I would pay knowingly.
:::

:::warning
Two more stop signals, both outside the transaction. If somebody sends you a ready-made transaction to sign and you cannot decode it yourself, do not sign it. If anybody asks for your recovery phrase for any reason — support, recovery, verification, a prize — that is theft, without exception.
:::

## What no wallet does for you yet

No released wallet recognises a ChainBloom path output. To a wallet today, a live path is an ordinary {{CARRIER_VALUE_SATS}}-satoshi coin: small, unlabelled, and a prime candidate to be swept into the next payment you make. That is the single most likely way to lose a path, and it is covered in [protecting a live path](/docs/participate/protect-your-path).

Until that changes, protection is something you do by hand:

- Hold path outputs in an account or wallet you never spend from.
- Write down the outpoint the moment a step confirms.
- Use coin control, and refuse any transaction that includes an output you cannot account for.
- Check before you sweep or consolidate, every time.

If you write wallet software, the same problem is solvable properly: recognise the marker, label the carrier, warn before it is spent by an ordinary payment, and show the decoded action on the signing screen instead of a bare OP_RETURN. [Wallet integration](/docs/reference/integration-wallets) sets out what to parse, what to display, and what never to claim on a user's behalf.

## After you sign

Broadcasting puts the transaction in the mempool, not in the world. A [[confirmation]] is what makes your contribution part of the shared history, and only a confirmed step can be built on. Until then it can still be replaced by a version of itself paying a higher fee, which is sometimes exactly what you want.
