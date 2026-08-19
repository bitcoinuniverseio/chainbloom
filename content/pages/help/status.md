---
title: What is running today
nav: What is running
description: What is live today, what remains unsupported, and how the production ChainBloom read path is verified.
updated: 2026-08-19
order: 4
keywords: [status, availability, indexer, npm, wallets, explorer]
related: [help/faq, reference/changelog, audiences/developers]
cta:
  title: The part that is finished
  body: The rules are written, tested, and published as vectors, whatever the index is doing.
  label: Protocol architecture
  href: /docs/reference/protocol-architecture
---

:::lead
This page tells you what you can actually do today, in plain terms, with no roadmap and no dates. ChainBloom is early. That is a fact about the calendar, and the most useful thing this documentation can do is be exact about it.
:::

## What exists and works

### The protocol package

{{PACKAGE_NAME}} at version {{PACKAGE_VERSION}}. MIT licensed, ESM only, Node {{NODE_ENGINE}}. It builds, it typechecks, its tests pass, and it verifies its own published marker vectors:

```text
$ npm run check:vectors
Verified 5 valid and 6 invalid marker vectors.
```

It is **not published to npm**. There is no package to install by name; the registry has nothing under that name to serve. You get it by checking out [the repository](https://github.com/bitcoinuniverse/chainbloom) and building it. Every code sample in this documentation assumes that, and any page anywhere that shows a registry install line for ChainBloom is wrong.

The command line tool comes with it, as the binary `chainbloom`. It can encode a marker, decode one, parse a raw transaction, build an unsigned draft, verify the vectors, and replay confirmed state from a file. Those commands are the whole surface; the [CLI reference](/docs/reference/cli) lists them exactly.

### The creation and contribution flow

The flow for making a [[world]] and adding to one exists inside InScribe, at [https://inscribe.bitcoinuniverse.io/chainbloom](app). It has four surfaces:

- **Explore**, for confirmed worlds.
- **Your paths**, for the live paths held by the connected address. The code and the API call these lanes.
- **Act**, where you build a plan, review it, sign it, and broadcast it. The review shows the lane mappings, the outputs, the total input, the miner fee, the change, the fee rate, the locktime, and any warnings, before you sign anything.
- **Learn**, for the explanation alongside the tool.

Signing there is real. A real miner fee, a real {{CARRIER_VALUE_SATS}}-satoshi output, and a result that nobody can undo afterwards.

### The public read index

The production read index is live. InScribe uses it for confirmed worlds, paths,
events, graphs, renders, statistics, fees, transaction planning, and broadcast
validation. The public status path is:

```text
GET https://inscribe.bitcoinuniverse.io/api/chainbloom/status

HTTP/1.1 200 OK
network: mainnet
nodeAvailable: true
synced: true
degraded: false
confirmedLag: 0
```

The response also publishes the Bitcoin tip, confirmed indexed height, parser
version, deployed source revision, last successful block and mempool times, and
state root. InScribe checks that evidence before allowing ChainBloom actions. It
fails closed if the node is unavailable, the evidence is stale, the network or
source revision differs from the configured values, the confirmation policy is
not six blocks, or confirmed lag is above zero.

## What is not switched on

### Wallet support

No released wallet recognises ChainBloom path outputs. There is no ChainBloom code in any shipped wallet.

That matters more than it sounds. A [[carrier]] is an ordinary-looking [[taproot|Taproot]] output holding exactly {{CARRIER_VALUE_SATS}} satoshis. To a wallet that has never heard of ChainBloom it is small change, and small change is the first thing a consolidation spends. If that happens, the path is marked abandoned and nothing brings it back.

So every wallet page in this documentation is written as guidance for people building wallets, or as what you should check for yourself before you sign. None of it describes something your wallet already does. Until one does, keep carriers in a wallet you do not use for ordinary spending, and freeze the outputs if you have coin control.

### Independent explorer support

InScribe presents the production ChainBloom explore and timeline surfaces. No
separate released wallet or independent explorer currently advertises native
ChainBloom protection and display. You can verify a marker independently with
raw transaction bytes from a Bitcoin node you operate and
`chainbloom tx parse --hex <raw transaction>`.

## What this means for you today

### If you want to read

Use the Explore surface in InScribe to browse confirmed worlds and paths. Treat
unconfirmed activity as provisional, and check the status response when you
need to verify index freshness. The [example worlds](/docs/examples) remain
worked examples rather than claims about live activity.

### If you want to take part

You can. The flow works and the public index follows confirmed results. Read
[fees and confirmation](/docs/participate/fees-and-confirmation) and
[protect your path](/docs/participate/protect-your-path) first because released
wallets still do not protect carrier outputs automatically. Keep your own
transaction ids as an independent record.

### If you want to build

This is the strongest position of the three. The rules are written and tested, the vectors are published, the validator reports named issues you can code against, and nothing about the conventions of this medium is settled yet. Start at [protocol architecture](/docs/reference/protocol-architecture), run `chainbloom vectors verify` against your own implementation's output, and read [validation rules](/docs/reference/validation-rules). If you are writing a wallet or an explorer, the integration pages are specifications waiting for a first implementation, not descriptions of one.

## How this page is kept honest

Every deployment claim above was checked on 19 August 2026 by reading the
deployed configuration and calling both the direct indexer health paths and the
public InScribe status path. Where checking was not possible, this page says
nothing rather than something hopeful.

There is no roadmap here on purpose. A plan is not a status, and a date is not a fact. This page describes only what answered when asked.

It will be wrong the moment something changes, and it will not know. If the index comes up, if a wallet ships support, if the package is published, this page will still say what it says now until somebody edits it. So treat it as a dated observation, not a live signal. [The repository](https://github.com/bitcoinuniverse/chainbloom) is the thing that is always current, and if the code and this page disagree, the code is right and this page is a defect worth reporting.

Being early is the point. The rules are finished and the conventions are not, which means the first worlds anyone makes will decide what a good world looks like, how long it should stay open, and what an ending should mean. That question is open to you in a way it will never be open again.
