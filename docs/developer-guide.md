# Developer guide

## SDK surface

The package exports constants, marker codec, script utilities, raw transaction
parser, strict validator, confirmed state engine, mempool overlay, five PSBT
builders, shared TypeScript types, and a deterministic non-consensus SVG
renderer.

```ts
import {
  NETWORK,
  decodeMarkerHex,
  buildBloomPsbt,
  ChainBloomState,
} from '@chainbloom/protocol';
```

Amounts are `bigint`; txids are lowercase display-order hex. Raw transaction
inputs are converted from Bitcoin serialization's internal little-endian hash
to display order. GRAFT embeds display order directly. Never reverse it a
second time.

## Validation integration

Parse raw bytes with `parseTransactionHex`. Pass the resulting transaction to
`validateProtocolTransaction` with network, candidate height, a `StateView`, and
a prevout map keyed by `<txid>:<vout>`. Prevout context is required for fee
inputs. Use a trusted full node to validate scripts and chain membership.

`ChainBloomState.applyBlock` is atomic, enforces contiguous tips, expires worlds
before processing the block, and journals a pre-block snapshot. `rollbackTip`
restores the exact prior state. `MempoolOverlay` reports projections/conflicts
but deliberately cannot make an unconfirmed successor into a parent.

## PSBT integration

Builders accept explicit native-SegWit prevout value and script, set transaction
version 2 and sequence `0xfffffffd`, and place marker/carriers before extras.
RENDEZVOUS sorts complete participant pairs so each successor stays attached to
its lane. Builders do not select coins, estimate fees, sign, or broadcast.
Reparse the extracted transaction and run the validator before broadcast.

## Interoperability discipline

Run `npm run check:vectors` in every implementation. Treat fixture witness
items as placeholders, never as valid signatures. Compare txids, output order,
and state snapshots. Reject unknown bytes instead of retaining them for a
future interpretation. Use a new protocol version for incompatible behavior.
