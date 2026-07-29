# Security model

## Trust boundary

Bitcoin consensus proves that an outpoint was spent and that its script
authorized the spend. It does not enforce ChainBloom marker bytes, output
positions, successor creation, lifespan, or creative meaning. The indexer's
deterministic rules supply that interpretation. A carrier holder can always
spend outside the protocol, closing the economic UTXO while causing the lane to
be abandoned in ChainBloom.

The reference library trusts its caller to supply canonical block order,
correct prevout data, and transactions already accepted by a validating Bitcoin
node. It parses raw transactions independently and does not trust a block
explorer's interpretation. When witness-policy inspection is enabled it checks
common sighash encodings, but this is not a replacement for Bitcoin script
verification.

## Threats and controls

| Threat                                   | Consequence                          | Primary control                                     |
| ---------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| Ordinary coin selection spends a carrier | Permanent lane abandonment           | Dedicated wallet/account, UTXO lock and labels      |
| Change inserted before carrier outputs   | Invalid event and abandonment        | Canonical PSBT builder; verify positions on signer  |
| Partial-output sighash                   | Attacker changes marker or successor | DEFAULT/ALL-only policy; hardware display review    |
| Same-block child                         | Child invalid, carrier abandoned     | Wait for one confirmation before building a child   |
| Reorg                                    | Previously visible state disappears  | Atomic snapshots and common-ancestor replay         |
| Mempool conflict/RBF                     | Provisional event replaced           | Never treat mempool state as canonical              |
| Malformed marker flood                   | CPU or memory pressure               | 72-byte cap, exact parsing, bounded block ingestion |
| Malicious title or metadata              | UI injection                         | ASCII protocol title; escape every rendered value   |
| Compromised package                      | Key or transaction theft             | Lockfile, provenance, review, minimal dependencies  |

## Wallet signing checklist

Before signing, verify the network byte, operation and payload, current carrier
outpoint, exact 1,000-sat successor(s), marker at output zero, lane-to-output
mapping, fee and change, `0xfffffffd` sequences, and DEFAULT/ALL sighash. Keep
carrier keys backed up like any other Bitcoin key. A lost key freezes the UTXO
and lane; ChainBloom has no administrator or recovery key.

## Denial of service

Parsers must reject early, bound marker work, and never fetch GRAFT targets
recursively during transaction validation. Indexers should use local indexed
lookups, transaction/block batch limits, RPC timeouts, durable checkpoints, and
metrics for invalid carrier spends. Public APIs should paginate worlds and
events and rate-limit arbitrary txid queries.

## Privacy

Repeated lane transitions form a public graph. RENDEZVOUS links two lanes in
one transaction, and fee inputs/change can link additional wallet activity.
Fresh keys reduce address reuse but do not erase transaction-graph linkage.
Do not put personal information in a title or public metadata.
