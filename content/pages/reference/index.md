---
title: Technical reference
nav: Technical reference
description: Everything ChainBloom enforces, read from the source: marker bytes, transaction shapes, validation codes, state, and reorganization handling.
updated: 2026-07-31
order: 0
verified: "@chainbloom/protocol@0.1.0"
keywords: [reference, protocol, specification, developers, indexer, sdk]
related: [reference/protocol-architecture, reference/validation-rules, audiences/developers]
cta:
  title: Start with the design
  body: What every reader of the chain must agree on, and the exact bytes of the marker that names an action.
  label: Read protocol architecture
  href: /docs/reference/protocol-architecture
---

:::lead
Every number, field name, and error code in this section was read from the source of {{PACKAGE_NAME}} version {{PACKAGE_VERSION}}. You can build a transaction, check one, or index the chain from these pages without guessing at a single byte.
:::

## Who this is for

**Application and wallet authors** need the transaction shapes, the {{CARRIER_VALUE_SATS_RAW}}-satoshi [[carrier]] rule, and the short list of things worth showing someone before they sign.

**Indexer authors and operators** need the validation rules, the state model, and what to do when Bitcoin replaces a block. Any [[indexer]] that follows these pages rebuilds the same worlds as every other one. That is the point of writing them down.

**Anyone checking a claim** needs the [[marker]] layout and the published vectors. You do not have to trust this site: the generated tables are built from the package itself.

:::note
The package is not on npm. Today it is installed from the repository at https://github.com/bitcoinuniverse/chainbloom.
:::

## The sixteen pages

:::cards
[**Protocol architecture**
The design in one page, plus the marker byte layout and the network table.](/docs/reference/protocol-architecture)

[**Transaction lifecycle**
The exact input and output positions for all five operations.](/docs/reference/transaction-lifecycle)

[**Data structures**
Every field of WorldState, LaneState, EventState and the rest.](/docs/reference/data-structures)

[**Validation rules**
Every check the validator runs, with the issue code it emits.](/docs/reference/validation-rules)

[**Reorganizations**
How a view stays correct when Bitcoin replaces its newest blocks.](/docs/reference/reorganizations)

[**Indexer requirements**
What a service must do to serve the same history as everyone else.](/docs/reference/indexer-requirements)

[**SDK**
The TypeScript package: codec, validator, builders, and the state engine.](/docs/reference/sdk)

[**CLI**
The chainbloom commands and the JSON they read and write.](/docs/reference/cli)

[**Wallet integration**
What a wallet should do so a live path is never spent by accident.](/docs/reference/integration-wallets)

[**Explorer integration**
What to show once a transaction turns out to be a ChainBloom event.](/docs/reference/integration-explorers)

[**Test vectors**
The published markers a parser must accept and the ones it must reject.](/docs/reference/test-vectors)

[**Errors**
Every error and issue code in one index, with the file that raises it.](/docs/reference/errors)

[**Security model**
What the protocol protects, what it cannot, and where the sharp edges are.](/docs/reference/security-model)

[**Reliability**
Failure modes, and what a service should do about each one.](/docs/reference/reliability)

[**Governance**
How the ruleset may change, and what a change may never do.](/docs/reference/governance)

[**Changelog**
What changed in the protocol and in these pages.](/docs/reference/changelog)
:::

## How to read a page here

Each page carries a `verified` stamp naming the package version it was read from. Where a page states a limit it writes a token, and the build substitutes the value the code enforces. So if a rule here is wrong, the code is wrong too: report it against the repository, not against the page.

:::tip
Reading in order works: architecture, then lifecycle, then validation. If you have ten minutes and a parser to write, read [protocol architecture](/docs/reference/protocol-architecture) and [test vectors](/docs/reference/test-vectors) instead.
:::
