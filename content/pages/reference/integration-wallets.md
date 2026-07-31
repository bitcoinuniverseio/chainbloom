---
title: Wallet integration
nav: For wallets
description: The three things a wallet owes a ChainBloom user, in priority order, with the exact rule for recognising a path output and the exact rules for signing one.
updated: 2026-07-31
order: 9
verified: "@chainbloom/protocol@0.1.0"
keywords: [wallet, coin selection, sighash, review, signing, integration]
related: [reference/validation-rules, reference/sdk, participate/wallet-and-review]
cta:
  title: Check your work against the validator
  body: Every rule on this page is one the reference validator enforces, with an issue code you can test for.
  label: Read the validation rules
  href: /docs/reference/validation-rules
---

:::lead
A wallet that gets three things right makes ChainBloom safe to use: it never spends a live [[path]] by accident, it shows the person what they are agreeing to before they sign, and it never lets a broadcast masquerade as a [[confirmation]]. Everything else is polish.
:::

## What is actually at stake

A live path is held by one Bitcoin output worth {{CARRIER_VALUE_SATS_RAW}} satoshis. There is no lock on it, no covenant, no special script — it is a plain [[taproot]] output that the owner's key can spend into anything.

So when a wallet sweeps dust, consolidates, or picks the smallest input to fund a coffee payment, it can end a piece of a shared history without anyone intending it. The chain will confirm that spend, and every index following the rules will do the only correct thing: mark the path `ABANDONED` with the terminal reason `INVALID_CONFIRMED_SPEND`, record the offending txid, and invent nothing to replace it. There is no repair, no support ticket, no rollback.

That single failure mode is why the priority order below is what it is.

## Priority one: never spend a path by accident

### The recognition rule

An output is a live [[carrier]] when **both** of these hold:

1. It pays exactly {{CARRIER_VALUE_SATS_RAW}} satoshis to a P2TR script — {{P2TR_SCRIPT_BYTES}} bytes beginning `0x51 0x20`.
2. A ChainBloom index, asked about that outpoint, reports it as the current output of a live path.

The first condition alone is not a rule, it is a coincidence. Plenty of ordinary {{CARRIER_VALUE_SATS_RAW}}-satoshi Taproot outputs exist and belong to nobody's world. Treating them all as protected would freeze funds users are entitled to spend.

The second condition is the real test. An index that follows [the indexer requirements](/docs/reference/indexer-requirements) can answer "is this outpoint a live path" for any txid and vout, and returns the world id, the lane id, the step count, and the status along with it.

Use the cheap check first and the lookup second: value and script are a filter, the index answer is the decision.

### When you cannot reach an index

Fail closed, not open.

If an output passes the value-and-script filter and you cannot get an index answer, do not quietly feed it into coin selection. Hold it back, mark it as unconfirmed-status in the interface, and say why. A user who cannot spend {{CARRIER_VALUE_SATS_RAW}} satoshis for an hour is inconvenienced. A user whose path is abandoned has lost something that cannot be rebuilt.

:::warning
There is no public ChainBloom index switched on today, so a wallet building this now needs its own, or an agreement with an operator. [What is running](/docs/help/status) is the honest current picture.
:::

### What "keep it out of coin selection" means

- Exclude recognised carriers from automatic input selection, always — including dust consolidation, fee bumping of unrelated transactions, and "send max".
- Show them in a separate place in the interface, with the world and path they belong to, not as an unexplained locked balance.
- Let the user spend one deliberately, after an explicit warning that names the consequence: the path ends as `ABANDONED` and cannot be continued by anyone.
- Never auto-select one to pay a fee. That is the most likely way this goes wrong in practice.

## Priority two: show the action before the signature

A ChainBloom transaction looks like noise in a generic PSBT viewer: an OP_RETURN worth nothing, a {{CARRIER_VALUE_SATS_RAW}}-satoshi output, and change. Signing it blind is signing a sentence in a language the screen refuses to translate.

Before the signing prompt, show:

| Show this | Read it from |
| --- | --- |
| The action name | The marker at vout 0, decoded: one of `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, `CLOSE` |
| The world | Its id and title |
| The path | Its lane id, and its step count before and after |
| Every output | Value in satoshis, and which output continues which path |
| The miner fee | In satoshis and as a [[fee rate]], not as a slider position alone |
| The change output | Including the {{CARRIER_VALUE_SATS_RAW}} satoshis returning to you on a `CLOSE` |
| Anything irreversible | `CLOSE` ends the path permanently. Say so in words. |

For a `GRAFT`, also show which earlier event is being answered. For a `RENDEZVOUS`, show both paths and make it obvious that a second person must sign the same transaction.

:::note
The InScribe build endpoint already returns this material: an unsigned PSBT together with a preview holding the lane mappings, the outputs, the total input, the miner fee, the change, the fee rate, the locktime, and any warnings. A wallet integrating against it does not have to derive the review from raw bytes.
:::

## Priority three: a broadcast is not a confirmation

The moment a transaction is accepted by a node, nothing has happened yet.

It sits in the [[mempool]] with no height and no fixed position. It can be replaced — every ChainBloom input carries sequence {{RBF_SEQUENCE_HEX}}, which marks it replaceable on purpose. It can be dropped. It can be reorganized out after it appears in a block.

The protocol itself takes this seriously enough to enforce it: the next step on a path is rejected with `UNCONFIRMED_LINEAGE_PARENT` unless the parent event is already confirmed in an **earlier** block. A wallet that reports "done" the instant it broadcasts has told the user they can take the next step, which they cannot.

Show three visibly different states, and never let the first two borrow the language of the third:

- **Signed** — bytes exist, nobody has seen them.
- **Broadcast** — accepted by a node, provisional, replaceable.
- **Confirmed at height N** — in a block, and now part of the history.

## Signing rules

Sign what you are given. The shape is load-bearing, and a helpful wallet that "tidies" it produces an invalid event.

- **Sequence.** Every input uses {{RBF_SEQUENCE_HEX}}. Changing it produces `NON_CANONICAL_SEQUENCE` and the transaction stops being a ChainBloom event.
- **Version.** Transaction version is {{TX_VERSION}}.
- **Sighash on Taproot inputs.** `SIGHASH_DEFAULT` or `SIGHASH_ALL`, nothing else. Anything else is `UNSAFE_SIGHASH`, because any other flag would let somebody else change the outputs you just approved.
- **Sighash elsewhere.** P2WPKH and P2WSH signatures must use `SIGHASH_ALL`.
- **Fee inputs.** They must spend native SegWit outputs. A legacy or wrapped input gives `NON_NATIVE_SEGWIT_FEE_INPUT`.
- **Do not reorder inputs.** Carriers sit at fixed positions — vin 0, or vin 0 and vin 1 for a `RENDEZVOUS` in lexicographic lane order. Reordering gives `CARRIER_INPUT_MAPPING` or `RENDEZVOUS_LANE_ORDER`.
- **Do not add, remove, or reorder outputs.** The marker is vout 0 and successors follow it. Inserting your own output shifts them and gives `MARKER_POSITION` or `MISSING_CARRIER_OUTPUT`.
- **Do not finalize a half-signed `RENDEZVOUS`.** Two people sign one PSBT. Pass it on with your input signed and the other input untouched.

You can check all of this before you show the prompt: run `validateProtocolTransaction` from [the package](/docs/reference/sdk) against the transaction you are about to sign and refuse anything with issues.

## Nothing released does this yet

No wallet on the market recognises ChainBloom path outputs today, and that includes Universe Wallet, which has no ChainBloom code in it at all. Everything above is written for wallet authors, as the behaviour to build — not as behaviour a user can rely on now.

Until a wallet ships it, the safest habit for a person taking part is to keep path outputs in a wallet or account they do not use for ordinary spending.

:::safety
Holding the key to a path lets you take the next step on it. That is all it means. It is not proof of identity, not proof of authorship, and not a legal claim over anything the world contains.
:::

## Integration checklist

:::checklist id=wallet-integration
- Recognised carriers are excluded from every automatic coin selection path
- An unreachable index holds the output back instead of releasing it
- Spending a carrier deliberately requires an explicit warning naming `ABANDONED`
- The review screen shows action, world, path, every output, and the fee in satoshis
- `CLOSE` is labelled as permanent before signing
- Sequence, version, and sighash rules are asserted, not assumed
- Broadcast and confirmed are visibly different states in the interface
- The transaction is run through the validator before the signing prompt
:::

## You have finished the integration guide

If you have read the pages on the "build an integration" path, you have seen the marker format, the transaction shapes, the package, the command line tool, every validation rule, the published vectors, and what a wallet owes the person using it.

:::demo name=completion-card guide=integrator
This is where a card appears once you have marked every page on the "build an integration" path as read. It records reading, nothing more. There is no certification programme and no approved list.
:::
