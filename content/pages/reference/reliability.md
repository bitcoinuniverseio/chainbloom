---
title: Reliability and continuity
nav: Reliability
description: Why a ChainBloom history survives the failure of any website that shows it, what a good service does while it is behind, and how to check a moment yourself.
socialTitle: ChainBloom reliability and continuity
socialDescription: Bitcoin holds the order, the rules are deterministic, and anyone following them rebuilds the same worlds. What that means in practice.
updated: 2026-07-31
order: 14
keywords: [reliability, continuity, determinism, replay, outage, independent verification]
related: [reference/reorganizations, reference/indexer-requirements, help/status]
cta:
  title: What is actually running right now
  body: An honest list of which parts of ChainBloom are live, which are not, and what that means for reading worlds today.
  label: See the current status
  href: /docs/help/status
---

:::lead
Nothing you put into a ChainBloom [[world]] depends on this project staying alive. The order lives in Bitcoin, the rules are written down and deterministic, and any service that follows them rebuilds the same worlds from the same blocks. This page explains why that is true, and how to check it without asking anyone.
:::

## Why the history does not depend on one website

Three separate things have to be true for a shared history to outlive its software, and ChainBloom is arranged so that all three are.

**Bitcoin holds the order.** Which step came first is not stored in a database that someone administers. It is settled by which block confirmed each transaction, and by the position of the transaction inside that block. Nobody involved in ChainBloom can change either.

**The rules are deterministic.** Reading a world is a pure function of the blocks. Given the same chain, the marker format, the validation rules, and the state rules produce one answer -- there is no configuration, no heuristic, and no place where a service gets to make a judgement call.

**Every ingredient is public.** The magic bytes `{{PROTOCOL_MAGIC_HEX}}`, the field layouts, the transaction shapes, the lifetime rules, and the [test vectors](/docs/reference/test-vectors) are all published under the MIT licence. An [[indexer]] written by someone with no connection to this project produces the same worlds as ours, and can be checked against ours byte for byte.

The consequence is worth stating plainly: a service that displays ChainBloom is a *view*. If it goes away, the history does not. Someone else can rebuild it from the same blocks, and you can check that they did.

## What deterministic means here

It is a strong claim, so here is the mechanism rather than the adjective.

The state engine keeps confirmed state only. Blocks arrive one at a time, and each must extend the current tip: height plus one, and a matching previous hash. Anything else is refused with `NON_CONTIGUOUS_BLOCK`, so a view can never quietly skip a block or apply one twice. If a transaction inside a block fails part way, the whole block is restored from the snapshot taken before it -- no half-applied block exists.

Output is sorted, not incidental. `snapshot()` returns worlds and paths ordered by id, and events ordered by [[block height]] and then by transaction index within the block. That ordering is what makes independent replay comparable: two indexers that read the same chain produce the same structure in the same order, so a difference is a real disagreement rather than an artefact of iteration order.

A [[reorganization]] is handled the same way, in reverse. `rollbackTip()` undoes exactly one block from a stored snapshot. A view that has drifted onto a replaced branch rolls back to the common ancestor and replays the new branch, and lands where every other honest view lands. [Reorganizations](/docs/reference/reorganizations) covers the details.

:::note
Determinism is also what makes the fixtures useful. `fixtures/transactions.json` replays to one exact snapshot, so a new implementation can compare against it before it ever touches mainnet.
:::

## What a good service does while it is behind

Interruptions happen. A node falls behind, a database needs work, a deployment goes badly. None of that changes the chain, so none of it should change what a service claims to know. What separates a trustworthy view from a misleading one is entirely in how it behaves during the gap.

A good service:

- **Says how far it has read.** A visible last-processed height, next to the data, is the difference between "quiet world" and "service two hours behind".
- **Serves confirmed data it already has**, and marks it with the height it was read at.
- **Refuses to guess.** No filling gaps from a cache of unconfirmed transactions, no assuming a step landed because it was broadcast, no extrapolating a world's state forward.
- **Fails closed on writes.** If it cannot verify current state, it declines to build a transaction rather than building one against stale assumptions.
- **Recovers by replaying, not by patching.** When the node catches up, the service replays the missing blocks through the same rules and arrives at the same place as everyone else. There is no manual repair step, because there is nothing to repair.

The honest version of an outage message names the state: reading is paused, here is the last block height read, nothing has been lost. That is a much better sentence than an empty page, and a service can always write it, because it always knows the height it stopped at.

## Continuity for a world that is already finished

A finished world raises a different question from a live one. Nothing more will be added to it, so the only way to damage it is to change what its existing events *mean*.

That is the failure this protocol takes most seriously, and it is guarded structurally rather than by promise. Each world records the ruleset it was created under -- ruleset {{RULESET_VERSION}} today. A future rule change gets a new ruleset number; it does not redefine an old one. A world created under ruleset {{RULESET_VERSION}} is read under ruleset {{RULESET_VERSION}} forever.

That is also why unknown opcodes are refused rather than ignored. A reader that skipped operations it did not recognise would let a later addition change how an existing world reads, which is exactly the silent redefinition this rule exists to prevent.

Presentation is a separate layer, and it is allowed to change. Rendering is explicitly non-consensus: positions come from a hash of the world seed, the event txid, and the operation, and any gallery may draw a world however it likes. Two galleries can render the same world completely differently and both be correct. What none of them may do is change which events happened, in what order, on which path.

:::tip
If you are building a view, keep the two layers apart in your code as well as in your words. The record is what you replayed from blocks. Everything else -- colour, layout, motion, naming -- is interpretation, and should be labelled as yours.
:::

## Check something yourself

You do not have to take any service's word for a moment, including ours. The check takes a minute and needs nothing but a [[txid]].

:::steps
### Keep the transaction id

Every contribution has one. Save it when you make a step that matters to you -- it is the only thing you need later.

### Look it up on any Bitcoin explorer

Any public [[explorer]] will do; they are independent of ChainBloom. You are looking for two things: that the transaction is confirmed, and which block confirmed it. That block, and the transaction's position in it, is the moment's place in the history.

### Read the marker for yourself

Find the `OP_RETURN` output at index 0 and copy its data. Decode it with the CLI:

```bash
chainbloom marker decode --hex 43424c4d0100050101
```

The example above is the `close` test vector -- a mainnet completion with reason 1. Substitute your own bytes and you get the operation and every field it carries, checked by the same code the vectors pin down.

### Compare the two readings

If a service shows you something the bytes and the block do not support, the bytes and the block are right.
:::

Screenshots prove nothing; a txid and a block prove a great deal. That asymmetry is the whole point of putting the record on Bitcoin, and it belongs to you as much as to any service.

## What is running today

Honesty about reliability includes honesty about what exists. The protocol, its vectors, and the state engine are written and checked. The public index that would let anyone browse confirmed worlds is **not switched on**, so there are no live worlds to read from a public read API today, and no counts of anything.

That does not weaken anything on this page -- it is precisely why the page matters. The rules and the vectors are what let a public index be turned on, replaced, or run by someone else later without asking anyone's permission or losing a single confirmed moment. [What is running](/docs/help/status) is kept current and says exactly where things stand.
