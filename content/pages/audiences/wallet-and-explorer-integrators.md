---
title: Wallet and explorer integrators
nav: Wallets and explorers
description: Two behaviours decide whether ChainBloom is safe inside your product: never spend a live path output in an ordinary payment, and never show a preview as if it were confirmed.
updated: 2026-07-31
order: 10
keywords: [wallet, explorer, coin selection, freeze utxo, unconfirmed, preview, sighash]
related: [reference/integration-wallets, reference/integration-explorers, reference/validation-rules]
cta:
  title: Build the wallet side
  body: Coin selection, PSBT review, sighash rules, and the exact checks to run before signing.
  label: Read wallet integration
  href: /docs/reference/integration-wallets
---

:::lead
No wallet and no explorer supports ChainBloom today. That is an opening rather than a warning: the first product to do this properly sets the conventions everyone else copies. Two behaviours matter more than all the rest, and both are about not destroying something quietly.
:::

## Job one: never spend a live path output by accident

A live path is held by one [[carrier]] output: exactly {{CARRIER_VALUE_SATS}} satoshis, Taproot, a {{P2TR_SCRIPT_BYTES}}-byte script. To ordinary coin selection it looks like a small [[utxo]] worth sweeping up. It is not.

If a normal payment spends it, the transaction is valid Bitcoin and confirms as usual, but the path is marked [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`. Nothing is invented to replace it. Somebody's thread through a shared history stops there permanently, and they will not find out until they look.

What a wallet should do:

- Recognise the shape: {{CARRIER_VALUE_SATS}} satoshis exactly, with a Taproot output script. `isP2trScript` in the package does the script half.
- Exclude those [[outpoint|outpoints]] from automatic coin selection, dust sweeps, consolidation, and send-max.
- Label them in the interface as part of something, not as spare change.
- Require an explicit, typed confirmation before including one in a normal spend, and name what will be lost.
- Confirm liveness against an [[indexer]] before deciding. Value and script together are a strong hint, not proof.

:::warning
This is the one failure that cannot be repaired later. Everything else in an integration can be fixed with a redeploy.
:::

## Job two: never show a preview as if it were confirmed

An unconfirmed ChainBloom transaction is a proposal, not an event. The package models this honestly: `MempoolOverlay` projects unconfirmed transactions on top of confirmed state, it never creates lineage parents, and it exposes `conflictsWith`, the transactions spending the same outpoint.

What that means for an interface:

- Draw unconfirmed events differently from confirmed ones, and say so in words, not only in colour.
- Show the conflict set when one exists. A replacement and the thing it replaces both look real until a block picks one.
- Never present a rendering or a screenshot as evidence that something happened. The record is the confirmed transaction.
- Do not offer to chain two steps on one path inside a single block. A step whose parent is not already confirmed in an earlier block is rejected with `UNCONFIRMED_LINEAGE_PARENT`. Queue it and explain why.

For an explorer the same rule takes a different shape: a world page must make obvious which part of what it shows is settled and which part is a guess about the next block. Rendering sits outside the rules by design, so two explorers can draw the same world differently and both be correct. Say which renderer produced the picture.

## What the first integration decides

Because nobody has shipped this yet, several conventions are simply undecided. What does a carrier look like in a UTXO list. What does a path timeline look like beside an ordinary transaction history. Whether an explorer shows renderings at all, given that they are not consensus. How a wallet explains a [[reorganization]] that moves an event to a different height.

If you build one, write the choices down. These reference pages will link real implementations rather than invent recommended ones.

## Checks before you ship

:::checklist id=wallet-integration-guardrails
- Carrier-shaped outputs are excluded from every automatic selection path, including send-max
- No user can spend one without an explicit confirmation naming the consequence
- Liveness is confirmed against an index, not guessed from value and script alone
- Unconfirmed events are distinct from confirmed ones in both visuals and text
- Conflicting transactions are shown, not hidden
- Signing enforces the sighash rules: SIGHASH_DEFAULT or SIGHASH_ALL for Taproot, SIGHASH_ALL for P2WPKH and P2WSH
- `validateProtocolTransaction` runs against the finished transaction before broadcast
:::

Next: [Explorer integration](/docs/reference/integration-explorers) covers the read side. That means timelines, world pages, and what to do when history moves underneath you.
