# Contributing

ChainBloom welcomes protocol review, test vectors, interoperability reports,
documentation, and narrowly scoped implementation changes. By participating,
you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Before changing consensus-derived behavior

Open a design issue. State the current rule, proposed byte or state change,
compatibility effect, abuse cases, migration plan, and new valid and invalid
vectors. A change to parsing, ordering, carrier recognition, expiry, or failure
handling is a protocol change even when the TypeScript diff looks small.

## Local workflow

Use Node 22 and npm 10. Create a topic branch, run `npm ci`, and keep commits
focused. Before requesting review run:

```bash
npm run ci
npm pack --dry-run
```

Tests should include the positive path and the closest malformed cases. New
wire fields require canonical vectors. New transaction behavior requires a
golden fixture or a builder assertion. State changes require rollback/replay
coverage. Do not update a golden txid without explaining every byte-level
difference in the pull request.

Use conventional commit prefixes (`feat:`, `fix:`, `docs:`, `test:`,
`chore:`). Contributions are licensed under the repository's MIT license.
Security reports follow [SECURITY.md](./SECURITY.md), not the issue tracker.
