---
title: Validation rules
description: Every check validateProtocolTransaction runs, grouped and named by the issue code it emits, including the two rules people get wrong most often.
updated: 2026-07-31
order: 4
verified: "@chainbloom/protocol@0.1.0"
keywords: [validation, issue codes, validator, rules, sighash, lineage]
related: [reference/transaction-lifecycle, reference/errors, reference/indexer-requirements]
cta:
  title: Now handle the chain moving under you
  body: What a view must do when Bitcoin replaces its newest blocks, and why determinism is what makes replay agree.
  label: Reorganizations
  href: /docs/reference/reorganizations
---

:::lead
One function decides whether a Bitcoin transaction is a ChainBloom event: `validateProtocolTransaction` in [src/validator.ts](repo:src/validator.ts). This page lists every rule it applies and names the issue code each one emits, so you can build a transaction that passes and explain to a person exactly why one did not.
:::

## How a result is shaped

The validator never throws for a bad transaction. It collects `ValidationIssue` records, each with a `code`, a human `message`, and a `path` such as `inputs[1]` or `outputs[0].value`, and it returns `valid: issues.length === 0`.

Two things follow from that, and both matter when you write an interface.

First, you get **all** the reasons, not the first one. A transaction with a wrong sequence and a wrong [[carrier]] value reports both.

Second, one failure is special. If the [[marker]] cannot be decoded at all, the validator returns immediately with `marker: null` and skips every per-operation rule. Your error display should say the marker is unreadable rather than listing everything else as fine.

## Marker rules

Checked first, in `parseMarker`.

| Rule | Issue code |
| --- | --- |
| Exactly one ChainBloom-looking output, and it is at `vout 0` | `MARKER_POSITION` |
| The transaction has a `vout 0` at all | `MISSING_MARKER` |
| That output holds zero satoshis | `MARKER_VALUE` |
| The script is an `OP_RETURN` | `NOT_OP_RETURN` |
| One minimal direct push, 1 to {{MAX_MARKER_BYTES}} bytes, nothing trailing | `NON_MINIMAL_OP_RETURN` |
| At least {{HEADER_BYTES}} header bytes | `TRUNCATED_HEADER` |
| The header begins `{{PROTOCOL_MAGIC_HEX}}` | `INVALID_MAGIC` |
| The whole marker is at most {{MAX_MARKER_BYTES}} bytes | `MARKER_TOO_LARGE` |
| The version byte is {{PROTOCOL_VERSION}} | `UNSUPPORTED_VERSION` |
| The network byte is 0, 1, 2, or 3 | `RESERVED_NETWORK` |
| The opcode is `0x01` to `0x05` | `RESERVED_OPCODE` |
| The declared length consumes exactly the remaining bytes | `INVALID_PAYLOAD_LENGTH` |
| CREATE fixed fields decode and the ruleset is {{RULESET_VERSION}} | `INVALID_CREATE`, `UNSUPPORTED_RULESET` |
| CREATE title length matches the payload length | `INVALID_TITLE_LENGTH` |
| CREATE title is at most {{MAX_TITLE_BYTES}} ASCII bytes matching `{{TITLE_PATTERN}}` | `INVALID_TITLE` |
| CREATE seed is exactly {{SEED_BYTES}} bytes | `INVALID_SEED_LENGTH` |
| Every numeric field is inside its range | `INTEGER_OUT_OF_RANGE` |

One rule sits just after the marker decodes: the marker's network must match the network the validator was configured with, or `NETWORK_MISMATCH`. An indexer set to mainnet does not half-read a signet marker; it refuses it.

## Input rules

Applied to every input, whatever the operation.

| Rule | Issue code |
| --- | --- |
| Every `nSequence` is exactly {{RBF_SEQUENCE_HEX}} | `NON_CANONICAL_SEQUENCE` |
| No outpoint appears at two input positions | `DUPLICATE_INPUT` |
| Recognised carriers sit at exactly the positions the operation requires | `CARRIER_INPUT_MAPPING` |
| Every fee input has prevout context supplied | `MISSING_PREVOUT` |
| Every fee input spends a native SegWit output | `NON_NATIVE_SEGWIT_FEE_INPUT` |

`CARRIER_INPUT_MAPPING` is stricter than it looks. It does not only check that the required positions hold carriers; it checks that **no other input** is a recognised live carrier. Adding a second path's carrier as a "fee input" to a `BLOOM` fails here, which is exactly what you want, because that carrier would otherwise be quietly destroyed.

## Per-operation rules

### CREATE

| Rule | Issue code |
| --- | --- |
| No input spends a live carrier | `CREATE_SPENDS_CARRIER` |
| An output exists at `vout 1` through `vout laneCount` | `MISSING_ROOT_CARRIER` |
| Each root output is exactly {{CARRIER_VALUE_SATS_RAW}} satoshis | `INVALID_CARRIER_VALUE` |
| Each root output is standard P2TR, {{P2TR_SCRIPT_BYTES}} bytes | `INVALID_CARRIER_SCRIPT` |

Fee inputs are checked from `vin 0`, because a CREATE has no path inputs.

### BLOOM and GRAFT

| Rule | Issue code |
| --- | --- |
| Exactly one recognised carrier, at `vin 0` | `CARRIER_INPUT_MAPPING` |
| A successor output exists at `vout 1` | `MISSING_CARRIER_OUTPUT` |
| It is exactly {{CARRIER_VALUE_SATS_RAW}} satoshis | `INVALID_CARRIER_VALUE` |
| It is standard P2TR | `INVALID_CARRIER_SCRIPT` |

Fee inputs are checked from `vin 1`.

### RENDEZVOUS

| Rule | Issue code |
| --- | --- |
| Exactly two recognised carriers, at `vin 0` and `vin 1` | `CARRIER_INPUT_MAPPING` |
| Their lane ids are in strictly increasing lexicographic order | `RENDEZVOUS_LANE_ORDER` |
| Successor outputs exist at `vout 1` and `vout 2` | `MISSING_CARRIER_OUTPUT` |
| Both are exactly {{CARRIER_VALUE_SATS_RAW}} satoshis and standard P2TR | `INVALID_CARRIER_VALUE`, `INVALID_CARRIER_SCRIPT` |

Fee inputs are checked from `vin 2`. Both paths are also put through the world and step rules below, independently.

### CLOSE

| Rule | Issue code |
| --- | --- |
| Exactly one recognised carrier, at `vin 0` | `CARRIER_INPUT_MAPPING` |
| No successor output is required or checked | none |

Fee inputs are checked from `vin 1`.

## World and step rules

Applied to each [[path]] a transaction advances, in `checkWorldCanAdvance`.

| Rule | Issue code |
| --- | --- |
| The path's world is known to this view | `MISSING_WORLD` |
| The world is ACTIVE and the height is below `endHeightExclusive` | `WORLD_ENDED` |
| `stepCount` is below the world's `maxSteps` | `MAX_STEPS_REACHED` |
| The path's own last event confirmed in a strictly earlier block | `UNCONFIRMED_LINEAGE_PARENT` |

## Echo target rules

`GRAFT` alone names an earlier event, and all three checks below run against the view's own record of it.

| Rule | Issue code |
| --- | --- |
| `targetEventTxid` names an event this view knows | `UNKNOWN_GRAFT_TARGET` |
| The target is on the same network | `GRAFT_NETWORK_MISMATCH` |
| The target confirmed in a strictly earlier block | `UNCONFIRMED_GRAFT_TARGET` |

The target may be on any path in any [[world]], including the path making the echo. It cannot be a transaction that is still waiting, and it cannot be in the same block.

## Signature rules

These run only when the validator is given `requireWitnessSignatures: true`. An indexer reading confirmed blocks should turn them on; a tool previewing an unsigned draft should not.

| Rule | Issue code |
| --- | --- |
| A confirmed input carries witness data | `MISSING_WITNESS` |
| A Taproot input carries at least one 64 or 65 byte signature | `MISSING_TAPROOT_SIGNATURE` |
| A 65 byte Taproot signature ends in SIGHASH_ALL, so the type is SIGHASH_DEFAULT or SIGHASH_ALL | `UNSAFE_SIGHASH` |
| A P2WPKH signature ends in SIGHASH_ALL | `UNSAFE_SIGHASH` |
| Every P2WSH signature ends in SIGHASH_ALL | `UNSAFE_SIGHASH` |

The point of the sighash rule is narrow and worth stating: a signature that does not commit to every output would let someone else re-point your successor carrier while keeping your signature valid. Only SIGHASH_DEFAULT and SIGHASH_ALL commit to the whole transaction.

## The two rules people get wrong

Almost every invalid transaction that reaches an indexer fails one of these two. Neither is obvious from the outside, and both are easy to design around once you know.

### A parent must be confirmed in a strictly earlier block

The check is `lane.lastEventHeight >= height`, and it emits `UNCONFIRMED_LINEAGE_PARENT`.

Two steps on the same path cannot share a block. Not "should not" -- cannot. That includes the case that catches people first: a `CREATE` and a `BLOOM` on one of its own root paths, broadcast together and mined together. The `BLOOM` is invalid, and because it confirmed while spending a live carrier, that path becomes ABANDONED.

:::warning
Never chain two steps on the same path in one broadcast. Wait for the parent's [[confirmation]], then build the child. This is the single most expensive mistake available in ChainBloom, because the failure is confirmed and cannot be undone.
:::

### A meeting's two path inputs must be ordered by lane id

The check is `lanes[0].id.localeCompare(lanes[1].id) >= 0`, and it emits `RENDEZVOUS_LANE_ORDER`.

Lane ids are `<worldId>:<laneNumber>` text, so the sort compares the world txid first and then the lane number as characters. Two paths in the same world sort by lane number as a string: lane `10` comes before lane `2`.

The fix is to never do it by hand. `buildRendezvousPsbt` sorts the two participants for you before laying out the transaction.

## Where CLOSE is exempt

`checkWorldCanAdvance` takes an `allowAtMaxSteps` flag, and it is true for exactly one operation: `CLOSE`.

So a path that has reached `maxSteps` refuses `BLOOM`, `GRAFT`, and `RENDEZVOUS` with `MAX_STEPS_REACHED`, but still accepts a `CLOSE`. A path is never trapped at its limit: you can always end it on purpose and release its {{CARRIER_VALUE_SATS_RAW}} satoshis.

The exemption is narrow. It does not extend to `WORLD_ENDED` or to `UNCONFIRMED_LINEAGE_PARENT`. Once a world reaches `endHeightExclusive`, nothing more confirms in it, and the still-live paths become EXPIRED by the passage of the block rather than by anyone acting.
