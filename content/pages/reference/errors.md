---
title: Error and issue codes
nav: Errors and issues
description: Every code ChainBloom can produce, the difference between a thrown error and a recorded issue, and what to do about the five you will meet most.
socialTitle: ChainBloom error and issue codes
socialDescription: A thrown ChainBloomError means your call did not happen. A validation issue means a transaction is not a ChainBloom event. Both are listed here.
updated: 2026-07-31
order: 12
verified: "@chainbloom/protocol@0.1.0"
keywords: [errors, error codes, issue codes, validation, troubleshooting, ChainBloomError]
related: [reference/validation-rules, reference/test-vectors, help/troubleshooting]
cta:
  title: Seeing one of these in the application?
  body: The same codes, matched to what you were trying to do and what to try next.
  label: Open troubleshooting
  href: /docs/help/troubleshooting
---

:::lead
Every failure in ChainBloom has a short stable code, and knowing which of two kinds it is tells you who has to act. One kind says your call was wrong. The other says a Bitcoin transaction is not a ChainBloom event -- which is a fact about the chain, not a bug in your software.
:::

## Two kinds of failure

### A `ChainBloomError` is thrown

`ChainBloomError` extends `Error`. Its `name` is `ChainBloomError`, and it carries a `code`, a human message, and sometimes a `details` object with the numbers involved.

```ts title="catching one"
import { ChainBloomError, decodeMarkerHex } from '@chainbloom/protocol';

try {
  decodeMarkerHex('43424c4d01030204070302c800');
} catch (error) {
  if (error instanceof ChainBloomError) {
    console.log(error.code); // INVALID_PAYLOAD_LENGTH
  }
}
```

A throw means **nothing happened**. No [[marker]] was produced, no PSBT was built, no block was applied to state. Three parts of the library throw: the codec when bytes or fields are wrong, the builders when a draft transaction cannot be assembled honestly, and the state engine when blocks arrive out of order. The thing to fix is the call.

Anything unexpected is wrapped rather than leaked. `asChainBloomError` turns an unknown throw into `UNEXPECTED_ERROR` with the original message, so callers only ever have to handle one shape.

### A validation issue is recorded

`validateProtocolTransaction` does not throw when a transaction is bad. It returns a `ValidationResult` with `valid`, the decoded `marker` if there was one, and an `issues` array. Each issue is `{ code, message, path }`, where `path` points at the part of the transaction that failed, such as an input index.

An issue is not a complaint about your code. It is the answer to a question: is this transaction a ChainBloom event? `MARKER_VALUE`, `WORLD_ENDED` and `RENDEZVOUS_LANE_ORDER` all mean the same thing at that level -- no.

## Why the difference matters

The two kinds lead to different behaviour, and mixing them up is how software starts inventing history.

A thrown error stops you before anything is signed or stored. Show it, fix the input, try again.

A recorded issue may describe a transaction that is already confirmed and can never change. If that transaction spent a live [[carrier]], the path it spent becomes `ABANDONED` with the terminal reason `INVALID_CONFIRMED_SPEND`, and the spend is kept in `invalidCarrierSpends` with its issue codes. The path stops there. Nothing is substituted, guessed, or rolled forward to keep a story going.

:::note
This is why a wallet that does not know about ChainBloom is a real risk to a path: an ordinary spend of a carrier is a valid Bitcoin transaction and an invalid ChainBloom event. See [the security model](/docs/reference/security-model).
:::

## Every code

The table below is built from the source at build time, so it cannot fall behind the implementation. The third column names the file that raises each code, which is usually the fastest way to understand one.

:::generated name=error-index
:::

## The five you will meet most

### `INVALID_MAGIC`

You handed the decoder an `OP_RETURN` that is not ChainBloom. Expected, and not a fault, if you are scanning every output of every block -- most data outputs on Bitcoin belong to something else.

**What to do:** call `isChainBloomMagic` on the bytes first and skip anything that does not match. Do not use exceptions as a filter in a hot indexing loop.

### `INVALID_PAYLOAD_LENGTH`

The declared payload length did not consume every remaining byte. Almost always a hand-assembled marker with a spare byte, or a payload built for a different operation. The `trailing-byte` [test vector](/docs/reference/test-vectors) is this exact case.

**What to do:** build markers with `encodeMarker` rather than by hand. If you must assemble bytes yourself, decode the result before you spend anything.

### `INSUFFICIENT_INPUT_VALUE`

A builder refused because the inputs do not cover the outputs plus the fee. Easy to hit because the successor carriers are part of the outputs: every path a transaction continues needs another {{CARRIER_VALUE_SATS}} satoshis, and a [[meeting]] creates two of them.

**What to do:** add a fee input, or lower the fee rate. The builder will not silently shrink a carrier or drop the change output to make the numbers work.

### `UNCONFIRMED_LINEAGE_PARENT`

You tried to move a path forward while its own last event is in the same block or later. Lineage is strict: a parent must already be confirmed in an **earlier** block.

**What to do:** wait for one confirmation. This is a fact about timing, not a broken transaction -- the same bytes will be valid a block later. In an interface, say "waiting for the previous step to confirm", not "invalid".

### `NON_CONTIGUOUS_BLOCK`

`applyBlock` was given a block that does not extend the current tip. The state engine requires height plus one and a matching previous hash, every time.

**What to do:** feed blocks in order. If you are following a [[reorganization]], call `rollbackTip()` until the tip is the common ancestor, then apply the new branch. A failure inside a block leaves state exactly as it was before that block, so you never have to reason about a half-applied block.

## Codes that mean the world said no

Three codes look like errors and are not. They are a world working correctly:

- `WORLD_ENDED` -- the world is no longer `ACTIVE`, or the chain has reached its `endHeightExclusive`. Every live path became `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`.
- `MAX_STEPS_REACHED` -- the path has taken every step the world allows. A `CLOSE` is still accepted, so the path can still be completed on purpose.
- `CREATE_SPENDS_CARRIER` -- someone tried to open a new world with a live carrier as a fee input. The carrier is protected from being consumed by accident.

Present these as endings and limits, not as failures. A world that ran out of time did the thing it was designed to do.

## How a code reaches you

The CLI prints one JSON object per outcome. Success goes to standard output; a failure goes to standard error and sets exit code 1:

```json title="stderr on failure"
{"error":"RESERVED_OPCODE","message":"Opcode byte 9 is reserved"}
```

That shape is stable, so a script can branch on `error` without parsing prose. Codes are the contract; messages may be reworded for clarity, and `details` may gain fields.
