---
title: Security model
description: What ChainBloom protects, what it cannot protect, and the small number of things that are yours to do. Written so you can decide before you sign anything.
socialTitle: The ChainBloom security model
socialDescription: Real transactions, real fees, keys that stay in your wallet, and one output that holds each path. What is guaranteed and what is not.
updated: 2026-07-31
order: 13
keywords: [security, safety, keys, irreversible, trust, risk, custody]
related: [participate/protect-your-path, reference/reliability, learn/confirmed-and-unconfirmed]
cta:
  title: The practical version of this page
  body: What to check before you sign, and how to keep a path safe once you hold one.
  label: Protect your path
  href: /docs/participate/protect-your-path
---

:::lead
ChainBloom is deliberately small, and a small system is one you can hold in your head. This page says exactly what it guarantees, exactly what it does not, and the handful of habits that keep a path safe. There are fewer things to worry about than you might expect -- but the ones that matter are worth reading twice.
:::

## What ChainBloom protects

**The order of confirmed events.** Once your step is in a block, everybody who reads the [[world]] places it at the same point. That agreement does not come from this project. It comes from Bitcoin, which thousands of independent machines already maintain, and which nobody involved in ChainBloom can influence.

**A path cannot fork.** Each [[path]] is held by exactly one live output. Moving the path forward spends that output and creates the next one. Bitcoin refuses to let the same output be spent twice, so two competing versions of a path cannot both confirm. There is no branch to reconcile and no "which copy is real" question to answer later.

**A finished world stays finished.** A world records the ruleset it was created under. Future rule changes get a new ruleset rather than a new reading of an old one, so a story that already ended cannot be quietly reinterpreted. [Governance](/docs/reference/governance) says how that is looked after.

**Nobody can edit or remove a confirmed moment.** Including the people who wrote ChainBloom. There is no administrative override, because there is nowhere for one to live.

## What you are actually signing

Every contribution is a real Bitcoin transaction. That is the source of every guarantee above, and it is also the source of every risk on this page.

- You pay a real network fee, to Bitcoin miners. ChainBloom takes nothing, and no part of the fee comes back.
- Each live path holds exactly {{CARRIER_VALUE_SATS}} satoshis. That is not a price, a deposit, or a stake -- it is the smallest practical output that can carry a path forward. It travels from step to step and returns to you when the path is completed.
- Once a transaction confirms, **no one can reverse it**. Not the world's creator, not this project, not the software you used. There is no support queue that can undo a step.

:::warning
Read the whole transaction in your wallet before you sign: the amounts, the outputs, and the fee. A signed and broadcast transaction is a decision you cannot take back. If anything looks wrong, cancel -- rebuilding a step costs a few seconds, and undoing one is impossible.
:::

## Your keys, and the other kind of seed

Your keys stay in your wallet. ChainBloom tools build an unsigned [[psbt]] -- a draft transaction -- and hand it to your wallet to review and sign. The draft contains no secrets, and signing happens where your keys already live.

**Nobody in ChainBloom ever needs your seed phrase.** Not to create a world, not to join one, not to recover a path, not to support you. There is no situation in which typing a seed phrase into a ChainBloom page, form, or chat is correct. Anyone asking for one is attacking you, whatever they say about verification, migration, or rescue.

A separate word causes real confusion, so it is worth naming: a world has a [[seed]] too. That is {{SEED_BYTES}} random bytes chosen when the world is created, written into the marker, and used by galleries to lay out the same world consistently. It is public, it holds no secret, and it has nothing to do with a wallet seed phrase.

:::safety
If you think a key has been exposed, stop signing, move remaining funds with a wallet you trust, and get qualified help. Report the weakness through the private path described in [governance](/docs/reference/governance) -- never with keys or a seed phrase in the report.
:::

## One output holds a path

This is the single most important operational fact in ChainBloom, and it is the one that surprises people.

A path is its live [[carrier]] output. Whoever controls that output controls what happens next on that path. There is no separate registry, no account, and no recovery list -- the output *is* the claim. If it is spent by an ordinary transaction, that path ends.

That is a genuine single point of failure, and it is worth being plain about it. It has one honest mitigation today: know which output it is, and keep it out of ordinary spending.

:::note
No wallet has ChainBloom support yet, so no wallet will currently warn you before spending a carrier. Treat that as a task rather than a hazard: note the outpoint (`txid:vout`) of your path, and if your wallet supports freezing or labelling a specific output, use it. For wallet authors, [wallet integration](/docs/reference/integration-wallets) describes what recognising a carrier involves.
:::

## When a carrier is spent by something else

The system fails closed, and it fails visibly.

If a confirmed transaction spends a live carrier and is not a valid ChainBloom action, the path becomes `ABANDONED` with the terminal reason `INVALID_CONFIRMED_SPEND`. The spend is recorded, with the codes explaining why it did not qualify. What does **not** happen is just as important: nothing is invented to replace it. No substitute output is adopted, no story is patched, no "probably meant" repair is applied.

That behaviour is not a limitation to apologise for. A shared history is only worth having if it refuses to guess. An abandoned path is legible: everyone can see where it stopped and why.

## A preview is not history

Between broadcasting and confirming, a transaction sits in the [[mempool]]. During that window every honest view may show something slightly different, and the software says so rather than pretending otherwise. Previews are computed from unconfirmed transactions, and they never create lineage -- an unconfirmed step cannot be the parent of another step.

Two things follow. A waiting transaction can be replaced, dropped, or confirmed in a different order than it arrived. And a very recent block can still be replaced: shallow reorganizations are a normal part of Bitcoin, and ChainBloom views drop the events on the replaced branch and replay the new one.

So: treat the newest block as provisional, and a handful of confirmations as settled. A screenshot proves nothing at all -- a transaction id and a block do. [Confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed) covers the reading of that window in more detail.

## What holding an output does not mean

Control of a carrier is a fact about Bitcoin. It is not a fact about people, and stretching it into one is the mistake most likely to hurt someone.

Control of a path output does **not** establish:

- **Identity.** It shows a key signed, not who held it. Keys are shared, delegated, borrowed, and stolen.
- **Authorship.** Broadcasting a step does not mean you made the work it refers to.
- **Copyright or any licence.** A four-number bloom is a reference, not a work, and confirming it grants and transfers nothing.
- **Legal title or ownership** of anything outside the transaction.

What it does establish is narrow and real: this output was spent, in this order, at this height, by someone who could sign for it. Every claim beyond that comes from context outside the chain -- an announcement, a programme, a room full of people who watched it happen. Build that context deliberately; do not ask the chain to supply it.

## What is yours to do

A short list. It is genuinely the whole job.

:::checklist id=security-habits
- Read the amounts, outputs, and fee in your wallet before signing
- Keep the outpoint of any path you hold, and keep it out of ordinary spending
- Keep the txid of any contribution that matters to you
- Treat unconfirmed and very recent steps as provisional
- Never enter a seed phrase or private key anywhere for ChainBloom
- Check a claim against a Bitcoin explorer rather than a screenshot
:::

None of that requires trusting this project. That is the intended shape: [reliability](/docs/reference/reliability) explains why the history survives even if every service that displays it disappears.
