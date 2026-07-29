# Governance

ChainBloom is specification-led. The checked-in specification, tagged source,
vectors, and fixtures define a release; social posts and hosted renderers do
not. Maintainers merge routine implementation and documentation changes after
review. Protocol changes require an issue, a written proposal, two independent
maintainer approvals, public review of at least 21 days, and updated vectors.

No maintainer may unilaterally reinterpret confirmed history. Emergency fixes
may disable unsafe software distribution, but changing accepted protocol state
still follows the normal process. Decisions, dissent, conflicts of interest,
and security-driven embargoes are recorded when disclosure is safe.

The project has no token-weighted voting, paid priority, foundation allocation,
or on-chain governance key. Implementers remain free to reject a release. A
backward-incompatible rule requires a new protocol version; version 1 data is
never mutated in place. See [docs/governance.md](./docs/governance.md) for roles
and the proposal lifecycle.
