# Indexer and infrastructure guide

Run a fully validating Bitcoin node for the selected network. Configure RPC on
a private interface with least-privilege credentials, TLS or an authenticated
local transport, timeouts, and no wallet methods for a read-only indexer. Do not
use block explorers as the canonical ingestion source.

## Ingestion loop

1. Read the stored tip hash and height.
2. Ask the node for the canonical next block and raw transactions.
3. Resolve fee-input prevouts from the node or a local UTXO/transaction cache.
4. Apply the complete block in one database transaction.
5. Persist world, lane, event, invalid-spend, and undo-journal rows.
6. Commit the new tip only after every row succeeds.

At startup, compare the stored tip with the node's active chain. Walk back to a
common ancestor, execute undo journals in reverse block order, then replay the
new branch. Retain enough undo depth for the operational risk model and rebuild
from a trusted checkpoint when exceeded.

## Suggested schema and indexes

Use unique keys for world txid, lane ID, event txid, and live outpoint. Index
events by `(height, tx_index)`, lanes by world, GRAFT targets by txid, and undo
records by block hash. Enforce one live-outpoint owner. Store raw marker bytes
and issue codes for audit, but do not store secrets or RPC authorization.

## Operations

Monitor canonical height lag, RPC latency/errors, block apply duration, reorg
depth, marker counts, valid-event counts by opcode, invalid carrier spends,
mempool conflicts, and database growth. Alert on stalled tips, failed atomic
apply, impossible duplicate live outpoints, and repeated rollback loops.

Backups must include schema version, canonical tip, state, and undo data. Test a
restore and replay against fixture snapshots. Rate-limit public APIs, escape all
titles, set restrictive CORS and content-security policy, and keep mempool data
visually and structurally separate from confirmed state.
