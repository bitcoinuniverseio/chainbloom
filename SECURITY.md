# Security policy

Do not use ChainBloom on mainnet without an independent review of the protocol,
wallet integration, signing flow, and deployment. This repository is an
experimental reference implementation, not a custody product.

## Supported versions

Only the latest released minor version receives security fixes while the
project is pre-1.0. No version is currently represented as production-ready.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Follow
[docs/vulnerability-disclosure.md](./docs/vulnerability-disclosure.md) and send
an encrypted report through the private security-advisory channel configured on
the repository. Include affected version or commit, impact, reproduction steps,
and whether the issue is already public. If private advisories are unavailable,
contact the maintainers named in `CODEOWNERS` and request a secure channel
without sending exploit details.

Maintainers aim to acknowledge reports within three business days, provide an
initial assessment within seven, and coordinate disclosure after a fix is
available. These are goals, not service-level guarantees.

## High-risk areas

- carrier UTXO isolation and ordinary wallet coin selection;
- output ordering and fee/change insertion after designated outputs;
- SIGHASH policy and what a signing device actually displays;
- reorg rollback, same-block parents, and block/transaction ordering;
- malformed OP_RETURN parsing and resource-exhaustion inputs;
- untrusted titles, RPC data, SVG output, and web rendering;
- supply-chain integrity and published-package provenance.

Never include seed phrases, private keys, descriptors, wallet dumps, or live
RPC credentials in a report, fixture, issue, or log.
