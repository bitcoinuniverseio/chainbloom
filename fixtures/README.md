# Golden transaction fixtures

`transactions.json` contains deterministic witness-v1 transactions for every
ChainBloom operation. Signatures are 64-byte placeholders: the fixtures prove
serialization, ordering, txid, and protocol-state behavior, not Bitcoin script
validity. Regenerate the JSON to stdout with `npx tsx
scripts/generate-fixtures.ts` and review any byte-level diff before accepting
it.
