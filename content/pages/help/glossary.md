---
title: Complete glossary
nav: Glossary
description: Every word this documentation uses, defined once in full, in alphabetical order, with links to the pages where each one actually matters.
updated: 2026-07-31
order: 3
keywords: [glossary, definitions, terms, vocabulary, words]
related: [help/faq, learn/worlds-paths-and-history, reference/data-structures]
cta:
  title: Put the words to work
  body: Worlds, paths, and how a history is built out of confirmed steps.
  label: Worlds, paths, and history
  href: /docs/learn/worlds-paths-and-history
---

:::lead
Every other page links its terms here. This is the page that defines them, so you can read anything else in this documentation without holding a second tab open. Definitions are in one alphabetical run, not grouped by topic, because you arrive looking for a word rather than a subject.
:::

## How to read this page

Each entry gives the full definition, not the tooltip version, and ends with the pages where the word does real work. Where the code uses a different name for the same thing, the entry says so, and the table near the bottom collects all of those in one place.

Two habits will save you time. When a definition names something in `code style`, that is a real identifier you can search for in the repository. When it names a rule such as `MAX_STEPS_REACHED`, that is a real message you may one day see on your screen, and the [error reference](/docs/reference/errors) explains it in full.

## Every term, A to Z

### A to C

#### abandoned

A path is abandoned when its carrier is spent by a confirmed transaction that is not a valid ChainBloom action. The state machine marks every path that spend touched, records the terminal reason `INVALID_CONFIRMED_SPEND`, and keeps the offending spend in a list called `invalidCarrierSpends` so any reader can see exactly what ended the thread. Nothing is invented to take its place, and nothing restores it. The likeliest cause today is an ordinary wallet consolidating or sweeping small outputs, because no released wallet can tell a carrier from loose change.

Where it matters: [Protect your path](/docs/participate/protect-your-path), [Troubleshooting](/docs/help/troubleshooting).

#### block height

The number of the block that a transaction was confirmed in. Bitcoin adds a block roughly every ten minutes on average, so height works as a clock nobody owns and nobody can wind back. ChainBloom measures a world's life in blocks rather than in days: a world runs for {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, and the height at which it stops accepting steps is called `endHeightExclusive`.

Where it matters: [Bitcoin and shared order](/docs/learn/bitcoin-and-shared-order), [Fees and confirmation](/docs/participate/fees-and-confirmation).

#### bloom

One creative moment added to a path. A bloom carries four numbers and nothing else: a glyph, a palette, a motion, and a magnitude. There is no image, no text, and no file anywhere in it. Those four numbers are the entire shared record, and how a viewer draws, animates, or plays them is left open on purpose. That is why the same bloom can look like a flower in one gallery and sound like a chord in another without either being wrong.

Where it matters: [The five actions](/docs/learn/the-five-actions), [Join a world](/docs/participate/join-a-world).

#### carrier

The single Bitcoin output that holds a path in place. It is a Taproot output worth exactly {{CARRIER_VALUE_SATS}} satoshis, with a script of {{P2TR_SCRIPT_BYTES}} bytes. Whoever can spend it decides what happens next on that path, and on no other. Each step spends the current carrier and creates the next one, which is how Bitcoin's own rule that an output can be spent once becomes a rule that a path cannot fork. Spending a carrier outside a ChainBloom action ends the path permanently.

Where it matters: [Protect your path](/docs/participate/protect-your-path), [Wallet connection and review](/docs/participate/wallet-and-review), [Data structures](/docs/reference/data-structures).

#### close

The deliberate ending of one path. A close spends the path's carrier and creates no successor output, so there is nothing left to continue from. It carries a single reason byte, and the state machine records the terminal reason as `CLOSE_` followed by that value. Closing is allowed even when the path has already taken every step the world permits, so a thread can always be given an ending rather than merely stopping. The value in the carrier returns to the wallet that signed, less the miner fee. In this documentation the action is called completing a path.

Where it matters: [Complete a path](/docs/participate/complete-a-path), [The five actions](/docs/learn/the-five-actions).

#### confirmation

A transaction being included in a Bitcoin block. Confirmation is what turns a provisional contribution into shared history: before it, different people may see different things; after it, everyone reading the same chain places the step at the same point. ChainBloom treats unconfirmed work as a preview and nothing more. A step whose parent is not yet confirmed in a strictly earlier block is refused with `UNCONFIRMED_LINEAGE_PARENT`.

Where it matters: [Confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed), [Fees and confirmation](/docs/participate/fees-and-confirmation).

### E to G

#### echo

A step that moves a path forward and points back at an earlier confirmed moment at the same time. It is called GRAFT in the code and the API. An echo carries the target's transaction id, a relation number, a glyph, and a palette. The target must exist, sit on the same network, and be confirmed in a strictly earlier block, or the step is refused with `UNKNOWN_GRAFT_TARGET`, `GRAFT_NETWORK_MISMATCH`, or `UNCONFIRMED_GRAFT_TARGET`. Quoting, answering, and homage become part of the record rather than a caption beside it.

Where it matters: [The five actions](/docs/learn/the-five-actions), [Worlds, paths, and history](/docs/learn/worlds-paths-and-history).

#### event

One confirmed ChainBloom transaction, read as part of a world. An event records which of the {{OPERATION_COUNT}} actions happened, which paths it touched, which carrier it consumed, which carrier it created, and the block that confirmed it. Events come out of a snapshot sorted by height and then by position within the block, which is precisely what lets two independent readers rebuild an identical history without talking to each other.

Where it matters: [Data structures](/docs/reference/data-structures), [Worlds, paths, and history](/docs/learn/worlds-paths-and-history).

#### expired

What a path becomes when its world runs past its last block. At `endHeightExclusive` the world itself becomes EXPIRED and every path still live inside it becomes EXPIRED with the reason `WORLD_DURATION_ELAPSED`. Expiry is not neglect and not failure. It is the ending the creator chose when they set the duration, and the history stays readable exactly as it was.

Where it matters: [How a world grows](/docs/learn/how-a-world-grows), [Create a world](/docs/participate/create-a-world).

#### explorer

A public website for looking up Bitcoin transactions and blocks. An explorer has nothing to do with ChainBloom, and that is the point: checking a transaction id on an explorer you picked yourself is the simplest way to confirm a moment happened without trusting whoever told you about it. No public explorer presents ChainBloom worlds today.

Where it matters: [What is running today](/docs/help/status), [Explorer integration](/docs/reference/integration-explorers).

#### fee rate

What you pay Bitcoin miners per unit of transaction size, measured in satoshis per virtual byte. A higher rate usually confirms sooner, because miners take the most valuable transactions first. The fee goes to miners; ChainBloom has no fee of its own and takes nothing. Before you sign, the application shows the total input, the fee rate, the miner fee, and the change.

Where it matters: [Fees and confirmation](/docs/participate/fees-and-confirmation), [Wallet connection and review](/docs/participate/wallet-and-review).

#### glyph

One of the shape choices carried by a bloom or an echo: one of {{GLYPH_COUNT}} values, numbered from zero. It names a shape without describing how the shape looks, and nothing in the protocol says what any particular glyph is. That gap is deliberate. It is what allows two galleries to draw the same moment differently and both be faithful to the record.

Where it matters: [The five actions](/docs/learn/the-five-actions), [Artists and curators](/docs/audiences/artists-and-curators).

### I to O

#### indexer

A service that reads Bitcoin blocks and rebuilds ChainBloom worlds from them. Any indexer following the same rules reconstructs the same worlds, which is what stops a single website from owning the history. An indexer must apply blocks strictly in order, since `applyBlock` refuses a gap with `NON_CONTIGUOUS_BLOCK`; it must roll back one block at a time when the chain reorganises; and its snapshot must be sorted deterministically so its output can be compared with anyone else's.

Where it matters: [Indexer requirements](/docs/reference/indexer-requirements), [Indexers and operators](/docs/audiences/indexers-and-operators), [What is running today](/docs/help/status).

#### marker

The short piece of data in a transaction that says what the action is. It lives in one OP_RETURN output at index zero, holds zero value, and is at most {{MAX_MARKER_BYTES}} bytes long. The first {{HEADER_BYTES}} bytes are the header: the letters {{PROTOCOL_MAGIC}}, a version, a network, an operation, and a payload length. The operation's own fields follow. It must be pushed as one minimal direct push with nothing after it, or the decoder rejects it.

Where it matters: [Protocol architecture](/docs/reference/protocol-architecture), [Data structures](/docs/reference/data-structures).

#### meeting

One transaction in which two paths share a moment and both carry on. It is called RENDEZVOUS in the code and the API. A meeting spends the live carrier of two paths and creates one successor for each, so the paths acknowledge one another without merging, swapping, or trading anything. The two carriers must sit at input zero and input one, ordered lexicographically by lane id, or the transaction is refused with `RENDEZVOUS_LANE_ORDER`.

Where it matters: [When paths meet](/docs/learn/when-paths-meet), [A piece of music](/docs/examples/musical-composition).

#### mempool

Where a broadcast transaction waits before it is confirmed. A transaction in the mempool is a preview: it can be replaced, dropped, or confirmed in a different order than it arrived. ChainBloom's mempool overlay projects unconfirmed transactions so you can see what is coming, but it never creates a lineage parent out of one, and it lists any transaction spending the same output under `conflictsWith`.

Where it matters: [Confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed), [Troubleshooting](/docs/help/troubleshooting).

#### opcode

The single byte in a marker header that names which of the {{OPERATION_COUNT}} actions the transaction performs. Any other value is not a ChainBloom action, and the decoder refuses it with `RESERVED_OPCODE` rather than guessing. Because the byte sits in the header, a reader can tell what a transaction is without parsing the rest of it.

Where it matters: [Data structures](/docs/reference/data-structures), [Protocol architecture](/docs/reference/protocol-architecture).

#### OP_RETURN

A Bitcoin output that stores a small amount of data and holds no spendable value. It is the standard way to attach data to a Bitcoin transaction, and it is not unique to ChainBloom. A ChainBloom transaction uses exactly one, at output index zero, worth zero satoshis, containing the marker and nothing else. A ChainBloom-looking marker anywhere other than output zero makes the transaction invalid with `MARKER_POSITION`.

Where it matters: [Protocol architecture](/docs/reference/protocol-architecture), [Validation rules](/docs/reference/validation-rules).

#### outpoint

The address of one specific Bitcoin output: a transaction id and an output index, written `txid:vout`. At any moment a path is identified by the outpoint of its live carrier, which is why software can look a path up by outpoint alone, and why the outpoint changes every time the path takes a step.

Where it matters: [Return to a path](/docs/participate/return-to-a-path), [Data structures](/docs/reference/data-structures).

### P to R

#### palette

One of the colour choices carried by a bloom or an echo: one of {{PALETTE_COUNT}} values, numbered from zero. Like a glyph it is a reference, not a picture. The protocol does not say which colours a palette contains, so a printed exhibition and a screen can interpret the same number in ways that suit each medium.

Where it matters: [The five actions](/docs/learn/the-five-actions), [Artists and curators](/docs/audiences/artists-and-curators).

#### path

One thread inside a world, moving forward one confirmed step at a time. It is called a lane in the code and the API, where you will see `laneId`, `laneCount`, and `laneNumber`. A world has between {{MIN_LANES}} and {{MAX_LANES}} paths, fixed when the world is created, and a lane id is written as the world id, a colon, and the lane number, counting from zero. A path holds exactly one live carrier, and its status is LIVE, CLOSED, ABANDONED, or EXPIRED.

Where it matters: [Worlds, paths, and history](/docs/learn/worlds-paths-and-history), [Join a world](/docs/participate/join-a-world), [Return to a path](/docs/participate/return-to-a-path).

#### PSBT

A partially signed Bitcoin transaction: a draft that your wallet can inspect and sign. ChainBloom tools build one for you, unsigned, at transaction version {{TX_VERSION}}, with every input carrying sequence {{RBF_SEQUENCE_HEX}}. The point of a draft is that your wallet can show exactly which outputs will be spent and created before any key is used. Reading it is the last moment at which you are in control.

Where it matters: [Wallet connection and review](/docs/participate/wallet-and-review), [SDK](/docs/reference/sdk).

#### reorganization

Bitcoin replacing its most recent blocks with a different branch. Reorganizations are normal and usually shallow. A correct reader drops the events on the replaced branch, rolls back to the last block both branches share, and replays forward, so every honest view converges on the same history again. A step that disappears usually reappears in the new branch at a different height, as the same step.

Where it matters: [Reorganizations](/docs/reference/reorganizations), [Troubleshooting](/docs/help/troubleshooting).

#### replace by fee

Re-sending a transaction that is still waiting, with a higher fee, so miners prefer the new version. ChainBloom transactions are built for it: every input carries sequence {{RBF_SEQUENCE_HEX}}. It is also the reason an unconfirmed contribution is never treated as settled, since the version in the mempool can still change. Replacing gives the transaction a new id, so record the new one.

Where it matters: [Fees and confirmation](/docs/participate/fees-and-confirmation), [Confirmed and unconfirmed](/docs/learn/confirmed-and-unconfirmed).

#### ruleset

The version of the rules a world was created under. The current ruleset is {{RULESET_VERSION}}. A world records its ruleset so that a later change to the protocol can never quietly redefine a story that has already finished. A decoder that meets a ruleset it does not know refuses the marker with `UNSUPPORTED_RULESET` instead of guessing at the author's intent.

Where it matters: [Governance](/docs/reference/governance), [Protocol architecture](/docs/reference/protocol-architecture).

### S to W

#### satoshi

The smallest unit of bitcoin: one hundred millionth of one bitcoin. Every ChainBloom carrier is exactly {{CARRIER_VALUE_SATS}} satoshis. That amount is not a price, a deposit, a stake, or a fee. It is the small value an output must hold in order to exist and be passed from step to step, and it returns to the wallet that completes the path.

Where it matters: [Fees and confirmation](/docs/participate/fees-and-confirmation), [Questions worth asking](/docs/help/faq).

#### seed

{{SEED_BYTES}} random bytes chosen when a world is created and written into the create transaction. A world seed gives every viewer the same starting point for arranging that world, so two independent views can look related without their authors ever coordinating. It is not a wallet seed phrase, it holds no secret, and it grants control over nothing.

Where it matters: [Create a world](/docs/participate/create-a-world), [Data structures](/docs/reference/data-structures).

#### step

One confirmed move along a path. Every bloom, echo, and meeting counts as one step for the path it advances. A world fixes the maximum when it is created, between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}} steps per path. Once a path reaches that number, `MAX_STEPS_REACHED` blocks any further step, with one deliberate exception: the path can still be closed, so it can always be given a proper ending.

Where it matters: [How a world grows](/docs/learn/how-a-world-grows), [Complete a path](/docs/participate/complete-a-path).

#### Taproot

The current standard type of Bitcoin output, written P2TR. ChainBloom carriers must be Taproot outputs with a script of {{P2TR_SCRIPT_BYTES}} bytes, which keeps every path the same shape and makes carriers easy for software to recognise. Inputs used to pay the fee are held to a different rule: they must be native SegWit, but they need not be Taproot.

Where it matters: [Validation rules](/docs/reference/validation-rules), [Wallet connection and review](/docs/participate/wallet-and-review).

#### txid

The identifier of a Bitcoin transaction, written as a long hexadecimal fingerprint. Keep it for any contribution that matters to you: it is what lets anyone check the moment on an explorer of their choosing, without trusting the site that told them about it. A world's id is the txid of the transaction that created it.

Where it matters: [Questions worth asking](/docs/help/faq), [Explore timelines](/docs/participate/explore-timelines).

#### UTXO

An unspent transaction output. Bitcoin balances are really just a collection of these, and a ChainBloom carrier is one of them, held apart from ordinary spending. A wallet that has never heard of ChainBloom sees a carrier as small change and may spend it without asking, which is why coin control matters here more than it does for ordinary payments.

Where it matters: [Protect your path](/docs/participate/protect-your-path), [Wallet integration](/docs/reference/integration-wallets).

#### world

A bounded shared story with a fixed number of paths and a known ending. One transaction creates it and fixes everything about its shape: how many paths it has, between {{MIN_LANES}} and {{MAX_LANES}}; how long it stays open, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks; how many steps each path may take; its seed; and its title, at most {{MAX_TITLE_BYTES}} plain ASCII characters. The world's id is the txid of that transaction, and everything inside descends from it. Its status is ACTIVE, ENDED, or EXPIRED. Nobody owns a world, and creating one grants no power to edit it afterwards.

Where it matters: [How a world grows](/docs/learn/how-a-world-grows), [Create a world](/docs/participate/create-a-world), [Worlds, paths, and history](/docs/learn/worlds-paths-and-history).

## The same idea under a different name in the code

This documentation uses the friendlier word. The code, the API, and any error message you see use the other one. They are the same thing.

| In this documentation | In the code and the API |
| --- | --- |
| path | lane, `laneId`, `laneCount`, `laneNumber` |
| echo | `GRAFT` |
| meeting | `RENDEZVOUS` |
| complete a path | `CLOSE` |
| moment, contribution | `BLOOM` or event |
| path output | carrier, sometimes just the {{CARRIER_VALUE_SATS}}-satoshi output |
| last block of a world | `endHeightExclusive` |

If a message on your screen uses a word that is not in either column, the [error reference](/docs/reference/errors) lists every code the protocol can produce.

## Where the definitions come from

Nothing on this page is a description of intent. Each definition follows something the code enforces, and you can read the enforcement yourself.

Limits, opcodes, and the {{CARRIER_VALUE_SATS}}-satoshi carrier value live in [src/constants.ts](repo:src/constants.ts). Marker encoding and decoding, including every rejection reason, live in [src/codec.ts](repo:src/codec.ts). The rules a whole transaction must satisfy live in [src/validator.ts](repo:src/validator.ts). Path and world statuses, terminal reasons, and the replay behaviour live in [src/state.ts](repo:src/state.ts). The explicitly non-consensus drawing of a world lives in [src/render.ts](repo:src/render.ts).
