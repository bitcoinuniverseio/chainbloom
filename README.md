# ChainBloom

ChainBloom is a Bitcoin-native, fixed-lane UTXO relay protocol. A world begins
with one to eight 1,000-satoshi P2TR carrier outputs. Participants move those
carriers through confirmed Bitcoin transactions while publishing compact
creative actions. Deterministic indexers reconstruct the same lineage and
visual state from transaction and block data.

ChainBloom has no token, marketplace, protocol fee, reward, rarity payout, or
price-based progression. Its unit of participation is a valid carrier
transition.

> Status: experimental v1 reference implementation. Mainnet use requires an
> independent security review and wallet-integration testing.

## Protocol at a glance

- Protocol identifier: `CBLM`
- Version: `1`
- Networks: mainnet (`0`), testnet4 (`1`), signet (`2`), regtest (`3`)
- Marker: one minimal direct-push `OP_RETURN` at `vout 0`, at most 72 pushed
  bytes
- Carrier: exactly 1,000 sats in a standard P2TR output
- Operations: `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, `CLOSE`
- Ordering: confirmed parents only; same-block descendants are invalid
- Failure rule: a confirmed invalid spend of a live carrier abandons that lane
- Canonical chain: confirmed best chain; mempool projections are provisional

The normative format and transition rules are in [SPECIFICATION.md](./SPECIFICATION.md).

## Package layout

- `src/codec.ts` — canonical binary marker codec
- `src/transaction.ts` — raw Bitcoin transaction parser
- `src/validator.ts` — strict transaction and state-aware validation
- `src/state.ts` — deterministic block, mempool-preview, replay, and rollback engine
- `src/builders.ts` — `bitcoinjs-lib` PSBT builders for all five operations
- `src/render.ts` — deterministic, non-consensus visual projection
- `src/cli.ts` — marker, transaction, PSBT, vector, and replay CLI
- `vectors/` — valid and invalid binary codec vectors
- `fixtures/` — golden structural Bitcoin transaction fixtures
- `test/` — unit, property, fuzz-style, state, builder, and fixture tests
- `docs/` — technical, user, integration, launch, governance, security, and
  counsel-review documentation
- `site/` — dependency-free static public site and SVG brand assets

## Documentation

- [Protocol specification](./SPECIFICATION.md) - normative v1 bytes,
  validation, and state transitions
- [Technical whitepaper](./docs/technical-whitepaper.md) and
  [litepaper](./docs/litepaper.md) - design rationale and accessible overview
- [Participant](./docs/user-guide.md), [creator](./docs/creator-guide.md),
  [developer](./docs/developer-guide.md), and
  [infrastructure](./docs/infrastructure-guide.md) guides
- [Commercial and ecosystem integration](./docs/commercial-integration.md) -
  wallet, indexer, API, renderer, service, and marketplace boundaries
- [Brand guidelines](./docs/brand-guidelines.md) and
  [launch and media kit](./docs/launch-media-kit.md) - official asset use,
  factual announcements, press, demo, community, support, and incident content
- [Draft legal and transparency bundle](./docs/legal-transparency-draft.md) and
  [legal review checklist](./docs/legal-review.md) - jurisdiction-neutral
  drafting inputs that require qualified counsel review before use
- [Documentation map](./docs/README.md) - complete reader paths and governance
  references

## Requirements

- Node.js 22.x
- npm 10 or newer

## Development

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

Additional checks:

```bash
npm run test:coverage
npm run check:vectors
npm run check:site
npm pack --dry-run
```

## CLI examples

```bash
chainbloom marker encode --network signet --operation bloom \
  --json '{"glyph":7,"palette":3,"motion":2,"magnitude":200}'

chainbloom marker decode --hex 43424c4d01020204070302c8

chainbloom tx parse --hex <raw-transaction-hex>

chainbloom vectors verify

chainbloom psbt build --operation create --file create-input.json
```

The CLI writes machine-readable JSON to stdout and errors to stderr.

## Safety model

Bitcoin consensus validates spends, not ChainBloom semantics. There is no
covenant forcing a successor carrier. A holder can close, abandon, lose, or
mis-spend a lane. Wallets must therefore isolate and label carrier UTXOs, show
the exact carrier mapping before signing, and never use them in ordinary coin
selection. See [docs/security-model.md](./docs/security-model.md) and
[docs/user-guide.md](./docs/user-guide.md).

## License

MIT. See [LICENSE](./LICENSE). This is experimental software and not
financial, investment, or legal advice.
