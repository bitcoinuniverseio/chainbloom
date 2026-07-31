---
title: Developers
nav: Developers
description: What the ChainBloom package gives you today, the shape of an integration, and which four files to read first.
updated: 2026-07-31
order: 9
keywords: [sdk, typescript, node, esm, install, psbt, validation, cli]
related: [reference/sdk, reference/cli, reference/validation-rules]
cta:
  title: Read the SDK reference
  body: Every exported function, its arguments, and the codes it throws.
  label: Open the SDK reference
  href: /docs/reference/sdk
---

:::lead
Everything ChainBloom does lives in one MIT-licensed TypeScript package: encode a [[marker]], build an unsigned [[psbt]], validate a transaction against the rules, and replay confirmed blocks into state. There is no service to call, no key to obtain, and no account to create.
:::

## What exists today

{{PACKAGE_NAME}} at {{PACKAGE_VERSION}}. ESM only, Node {{NODE_ENGINE}}, MIT licensed. Two runtime dependencies, `bitcoinjs-lib` and `commander`. It ships a library and a `chainbloom` command.

:::warning
It is not on npm yet. `npm install {{PACKAGE_NAME}}` returns 404. Build it from the repository instead.
:::

```bash title="build from source"
git clone https://github.com/bitcoinuniverse/chainbloom.git
cd chainbloom
npm install
npm run build
npm test
```

`npm run check:vectors` replays the published marker vectors and prints how many valid and invalid cases passed. If that is green, your build agrees with the specification. `npm run ci` runs lint, typecheck, coverage, build, vectors, and the site checks in one pass.

## The shape of an integration

Four jobs. Most integrations need one or two, not all four.

### Read

`parseTransactionHex(hex)` gives you a parsed transaction. `decodeMarker(bytes)` and `decodeMarkerHex(hex)` turn the [[op-return]] payload — at most {{MAX_MARKER_BYTES}} bytes, with a {{HEADER_BYTES}}-byte header — into a typed operation. Anything wrong throws a `ChainBloomError` carrying a code such as `INVALID_MAGIC`, `RESERVED_OPCODE`, or `NON_MINIMAL_OP_RETURN`. Branch on the code, never on the message.

### Write

`buildCreatePsbt`, `buildBloomPsbt`, `buildGraftPsbt`, `buildRendezvousPsbt`, and `buildClosePsbt` return an unsigned `bitcoinjs-lib` PSBT: version {{TX_VERSION}}, every input sequence {{RBF_SEQUENCE_HEX}}, and [[carrier]] inputs that must be exactly {{CARRIER_VALUE_SATS}} satoshis and Taproot. `buildRendezvousPsbt` sorts the two participants by lane id itself, because getting that order wrong is a rejected transaction. You sign elsewhere — the package never touches keys.

### Check

`validateProtocolTransaction` is the arbiter. It returns issue codes: `MARKER_POSITION`, `INVALID_CARRIER_VALUE`, `CARRIER_INPUT_MAPPING`, `UNCONFIRMED_LINEAGE_PARENT`, `MAX_STEPS_REACHED`, and the rest. Run it against your own output before broadcasting, in tests and in the live path.

### Replay

`ChainBloomState` holds confirmed state only. `applyBlock` refuses a block that does not extend the tip and throws `NON_CONTIGUOUS_BLOCK`. `rollbackTip` undoes exactly one block. `snapshot()` returns worlds and lanes sorted by id, with events sorted by height then transaction index — that sort order is what makes two independent replays identical.

## Where to start reading

In this order, and together they are shorter than most integration guides:

- [src/constants.ts](repo:src/constants.ts) — every number the protocol enforces, in one short file.
- [src/codec.ts](repo:src/codec.ts) — the header layout and each operation's payload.
- [src/validator.ts](repo:src/validator.ts) — every rule, next to the issue code it emits.
- [src/state.ts](repo:src/state.ts) — replay, rollback, and the mempool overlay.

The `chainbloom` command is the fastest way to watch behaviour without writing code. `chainbloom marker decode --hex <hex>` prints a decoded operation as JSON on stdout; failures print `{"error":"CODE","message":"..."}` on stderr and exit 1. The [CLI reference](/docs/reference/cli) lists every command it has.

## Before you ship

:::checklist id=developer-first-integration
- Build from source and get `npm run check:vectors` passing locally
- Decode a marker you did not create, and handle every codec error by code
- Run `validateProtocolTransaction` on your own transactions before broadcast, not after
- Test a rollback: apply blocks, roll one back, replay, and compare snapshots exactly
- Treat a {{CARRIER_VALUE_SATS}}-satoshi Taproot output as unspendable by anything but a ChainBloom action
- Pin Node to {{NODE_ENGINE}} in CI, since the package is ESM only
:::

Next: [Validation rules](/docs/reference/validation-rules) is the page you will keep open while writing the code.
