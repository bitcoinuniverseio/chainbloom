---
title: Protocol architecture
description: The design in one page: what ChainBloom fixes for everyone, what it leaves open, and the exact bytes of the marker that names an action.
updated: 2026-07-31
order: 1
verified: "@chainbloom/protocol@0.1.0"
keywords: [protocol, marker, op_return, cblm, design, opcode, network]
related: [reference/transaction-lifecycle, reference/validation-rules, reference/sdk]
cta:
  title: Now read the transaction shapes
  body: The exact input and output positions for all five operations, in tables you can build against.
  label: Transaction lifecycle
  href: /docs/reference/transaction-lifecycle
---

:::lead
Read this page and you will know exactly what every independent reader of the chain must compute the same way, and exactly what is yours to decide. That line is the whole design. Everything above it is fixed forever; everything below it is where your product gets to be different.
:::

## Five ideas

### Keep the shared agreement small

The consensus surface is one [[op-return]] output of at most {{MAX_MARKER_BYTES}} bytes. Nothing else in a ChainBloom transaction carries meaning that two indexers could read differently.

That is a deliberate ceiling, not a limitation waiting to be lifted. Every byte you add to a shared format is a byte two implementations can disagree about, and a byte every future reader must keep parsing. The record holds numbers that name choices. It holds no images, no text beyond a world title, and no instructions about how anything should look.

### A world is created by one transaction

One CREATE transaction fixes the shape of a [[world]] and its identity at the same time. The world id **is** the txid of that transaction. There is no registry, no name reservation, and no second step.

CREATE fixes five things that can never be edited:

| Field | Range | What it decides |
| --- | --- | --- |
| `ruleset` | {{RULESET_VERSION}} | Which version of these rules the world follows |
| `laneCount` | {{MIN_LANES}} to {{MAX_LANES}} | How many paths exist |
| `durationBlocks` | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} | How long the world stays open, in blocks |
| `maxSteps` | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} | How far one path may travel |
| `seed` | {{SEED_BYTES}} bytes | A shared starting point for arranging the world |

A title of at most {{MAX_TITLE_BYTES}} ASCII bytes matching `{{TITLE_PATTERN}}` rides along. `durationBlocks` is measured in blocks because blocks are the only clock everybody already shares: {{MIN_DURATION_BLOCKS}} blocks is roughly {{MIN_DURATION_DAYS}} day, {{MAX_DURATION_BLOCKS}} is roughly {{MAX_DURATION_DAYS}} days.

### One live output per path

Each [[path]] holds exactly one live Bitcoin output, called a [[carrier]] and called a *lane* everywhere in the code. To move a path forward you spend that output and create the next one, worth exactly {{CARRIER_VALUE_SATS_RAW}} satoshis and always [[taproot|P2TR]].

This is the load-bearing idea. Bitcoin will not let one output be spent twice, so a path cannot fork, cannot be reordered, and cannot be rewritten by whoever shouts loudest. The state engine keeps this as a map from outpoint to lane id (`liveOutpoints` in [src/state.ts](repo:src/state.ts)), and `getLiveLaneByOutpoint` is how a transaction is recognised as touching a path at all.

The same idea has a sharp edge. A confirmed transaction that spends a live carrier and is *not* a valid ChainBloom event ends that path as `ABANDONED`. Nothing is invented to replace it.

### Five operations

There are {{OPERATION_COUNT}} operations and no plans for a sixth in ruleset {{RULESET_VERSION}}.

| Opcode | Byte | Path inputs | Path outputs | Payload bytes |
| --- | --- | --- | --- | --- |
| `CREATE` | `0x01` | 0 | one per lane | 23 + title length |
| `BLOOM` | `0x02` | 1 | 1 | 4 |
| `GRAFT` | `0x03` | 1 | 1 | 35 |
| `RENDEZVOUS` | `0x04` | 2 | 2 | 4 |
| `CLOSE` | `0x05` | 1 | 0 | 1 |

`GRAFT` is shown to people as an *echo* and `RENDEZVOUS` as a [[meeting]]. The code never uses the friendly names, and neither should your API.

### Presentation is left open

[src/render.ts](repo:src/render.ts) ships `projectBloom` and `renderWorldSvg`, and both are explicitly non-consensus. They place events by hashing the world seed, the event txid, and the operation with sha256, and they draw from {{PALETTE_COUNT}} fixed colours.

None of that is binding. Two galleries may render the same confirmed world completely differently and both be correct, because the record says `glyph` is 7, not what a 7 looks like. If you want a house style, build one. You cannot be wrong about it.

## The marker

### Where it must sit

A ChainBloom transaction must contain **exactly one** ChainBloom-looking output, and it must be at `vout 0` with a value of zero satoshis.

"ChainBloom-looking" is decided by `isPotentialChainBloomScript` in [src/script.ts](repo:src/script.ts): an `OP_RETURN` output whose first push begins with the four magic bytes `{{PROTOCOL_MAGIC_HEX}}`. Two such outputs, or one sitting at `vout 1`, raises `MARKER_POSITION`. A non-zero value at `vout 0` raises `MARKER_VALUE`.

The script must be one minimal direct push and nothing else: `OP_RETURN`, one length byte from 1 to {{MAX_MARKER_BYTES}}, then exactly that many bytes. A second push, an `OP_PUSHDATA1` where a direct push would fit, or any trailing opcode raises `NON_MINIMAL_OP_RETURN` from `decodeMinimalOpReturn`.

### The header

The first {{HEADER_BYTES}} bytes are fixed for every operation.

:::generated name=marker-layout
:::

Each header field has its own refusal. Fewer than {{HEADER_BYTES}} bytes is `TRUNCATED_HEADER`. Wrong magic is `INVALID_MAGIC`. More than {{MAX_MARKER_BYTES}} bytes is `MARKER_TOO_LARGE`. A version other than {{PROTOCOL_VERSION}} is `UNSUPPORTED_VERSION`. A network byte outside the table below is `RESERVED_NETWORK`, an opcode outside `0x01` to `0x05` is `RESERVED_OPCODE`, and a declared payload length that does not consume exactly the remaining bytes is `INVALID_PAYLOAD_LENGTH`.

Note the last one carefully: the length byte is not a maximum. `decodeMarker` in [src/codec.ts](repo:src/codec.ts) requires `bytes.length === HEADER_BYTES + payloadLength`, so one stray trailing byte fails the whole marker.

### What each payload carries

| Operation | Fields, in order |
| --- | --- |
| `CREATE` | ruleset, laneCount, durationBlocks (2 bytes), maxSteps (2 bytes), seed ({{SEED_BYTES}} bytes), title length, title |
| `BLOOM` | glyph, palette, motion, magnitude |
| `GRAFT` | targetEventTxid (32 bytes), relation, glyph, palette |
| `RENDEZVOUS` | bridgeStyle, glyph, palette, intensity |
| `CLOSE` | reason |

Every field is one byte unless the table says otherwise, and every one is range-checked on both encode and decode. `glyph` is 0 to {{MAX_GLYPH}}, `palette` 0 to {{MAX_PALETTE}}, `motion` 0 to {{MAX_MOTION}}, `relation` 0 to {{MAX_RELATION}}, `bridgeStyle` 0 to {{MAX_BRIDGE_STYLE}}. `magnitude`, `intensity`, and `reason` use the full byte, 0 to 255. Anything outside a range raises `INTEGER_OUT_OF_RANGE`.

## Networks

The network byte is part of the header, so a marker built for one network is refused on another rather than being read into the wrong world.

:::generated name=networks-table
:::

The validator compares the marker's network against the context it was given and raises `NETWORK_MISMATCH` on a difference. An indexer configured for mainnet therefore ignores signet markers instead of half-reading them.

## Build a marker by hand

:::demo name=marker-explorer
Without scripts, work the header out on paper. Take a `CREATE` on mainnet for a world called `Dawn Chorus` with three lanes.

| Offset | Bytes | Value | Meaning |
| --- | --- | --- | --- |
| 0 | 4 | `{{PROTOCOL_MAGIC_HEX}}` | the letters CBLM |
| 4 | 1 | `01` | version {{PROTOCOL_VERSION}} |
| 5 | 1 | `00` | mainnet |
| 6 | 1 | `01` | `CREATE` |
| 7 | 1 | `22` | 34 payload bytes follow |

The payload length is 34 because `CREATE` is 23 fixed bytes plus the title, and `Dawn Chorus` is 11 ASCII bytes. The whole marker is 42 bytes, comfortably under the {{MAX_MARKER_BYTES}}-byte ceiling. Change the title to something 50 bytes long and the encoder raises `MARKER_TOO_LARGE` before the transaction is ever built.

With scripts, the same encoder that ships in the package runs here in your browser and shows every byte as you change a field. Nothing is sent anywhere.
:::

## What is deliberately absent

It is worth being blunt about the things the protocol does not do, because integrators keep looking for them.

There is no owner field. A path is controlled by whoever can spend its carrier, and that is all the chain says. It is not a claim about identity, authorship, or any legal right.

There is no transfer operation, no price, no fee to the protocol, and no marketplace. The {{CARRIER_VALUE_SATS_RAW}} satoshis in a carrier are the smallest practical amount that can carry a path forward, and they come back to the spender when a path is completed.

There is no naming registry and no uniqueness rule on titles. Two worlds may share a title. They can never share a world id, because the id is a txid.

There is no content in the marker beyond the numbers listed above. If a world needs images, audio, or long text, those live in your application and are referenced by txid, not carried on chain.

:::note
One optional check sits outside the marker entirely. When a validator runs with `requireWitnessSignatures` on, it also inspects sighash flags on each spent input. See [validation rules](/docs/reference/validation-rules) for what it accepts.
:::
