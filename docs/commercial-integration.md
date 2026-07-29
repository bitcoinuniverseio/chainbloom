# Commercial and ecosystem integration

ChainBloom v1 is a protocol experiment, not a vertically integrated product.
The protocol defines how five confirmed transaction shapes affect a fixed set
of carrier lanes. Wallets, indexers, APIs, explorers, renderers, hosted
services, and communities sit outside that protocol boundary.

This guide describes integration responsibilities and truthful commercial
positioning. It is not legal, tax, financial, or security advice. The
[specification](../SPECIFICATION.md) remains normative for protocol behavior,
and every operator needs product-specific review before launch.

## Non-negotiable protocol boundary

ChainBloom has no token, balance or ownership ledger, sale mechanism, bid,
listing, transfer or trade operation, royalty, reward, public mint, protocol
fee, price oracle, governance asset, or official marketplace. Its five
operations are `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, and `CLOSE`.

Every live lane is represented by an exact 1,000-satoshi P2TR carrier. The
Bitcoin key that can spend the carrier controls its next transaction. That fact
does not create protocol-defined legal title, authorship, intellectual-property
rights, market ownership, or a balance owed by anyone. A service must not add
those meanings to the protocol through product copy.

Third parties may charge separately for wallet, custody, indexing, API,
hosting, rendering, moderation, support, or creative services. State the
contracting party, price, miner fees, refunds, service scope, and data practices
as product terms. Never describe a service charge as a ChainBloom fee or imply
that the protocol enforces a service payment.

## Responsibility map

| Layer                          | Responsible for                                                                                              | Not evidence of                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Bitcoin node                   | Canonical headers, blocks, transaction inclusion, script validation, previous-output data                    | ChainBloom validity, current API availability, or creative meaning                                   |
| ChainBloom validator/state     | Exact v1 decoding, state-aware validation, atomic lane transitions, expiry, abandonment, rollback and replay | Bitcoin script validity, key control, wallet intent, legal rights, or renderer appearance            |
| Indexer and data API           | Node synchronization, durable checkpoints, queries, pagination, freshness and error reporting                | A new consensus layer, custody, guaranteed uptime, or a complete view when lagging                   |
| Wallet                         | Carrier discovery, isolation, PSBT construction, signing review, miner fees, post-signing validation         | Recovery, safe custody by default, counterparty identity, or eventual confirmation                   |
| Explorer or renderer           | Human-readable state, accessibility, visualization, provenance labels                                        | Canonical artwork, protocol ownership, identical output elsewhere, or permanent media availability   |
| Hosted product or business     | Accounts, keys if any, pricing, moderation, support, privacy, security, legal terms and incidents            | Protocol endorsement, protocol-enforced promises, or immunity from jurisdiction-specific obligations |
| Creator or community organizer | Participation prompt, key handoff process, social rules, licenses, moderation and communications             | Continuing control over distributed carriers or the ability to reverse confirmed spends              |

An integration can implement more than one layer. It should still document the
boundaries internally and expose them in user-facing language. In particular,
"the app says valid" and "Bitcoin confirmed the transaction" are different
claims.

## Wallet integration contract

A ChainBloom-aware wallet carries the greatest direct loss risk because one
malformed or ordinary spend can abandon a lane. Add a dedicated workflow rather
than reusing generic send logic with a hidden marker.

### Discovery and freshness

The wallet should query a versioned indexer for the lane by its current
outpoint, then verify that:

- the API identifies the expected network and protocol version;
- the indexer's node is available, initial block download is complete, and the
  indexed height and hash are tied to an explicit node tip;
- lag is within the wallet's documented signing threshold;
- the world is active at the candidate height and below its exclusive end
  height;
- the outpoint is the current confirmed carrier for exactly one lane;
- the operation is allowed at the lane's step count; and
- no cached or mempool-only successor is being treated as the confirmed parent.

On unavailable, stale, contradictory, or malformed state, fail closed. A
gallery can show stale data with a banner; a signing workflow should not guess.
For higher assurance, query the carrier prevout and current best-chain identity
from a trusted Bitcoin node or an independent backend.

### Coin control and key scope

Use a dedicated account, descriptor, or policy for carriers. Persistently label
and lock every current carrier against ordinary coin selection. Do not use a
carrier as a fee input, consolidate it, mix it into a send-max transaction, or
include it in automatic UTXO maintenance.

Generate a fresh successor P2TR key under a recoverable wallet policy. Keep
fee inputs distinct and restrict them to the native SegWit forms permitted by
the specification. If a wallet cannot safely represent an allowed script type
or signature policy, it may adopt a documented narrower policy; it must not
quietly claim complete compatibility.

### Construction, signing, and broadcast

Use a canonical builder for shape, then independently check the unsigned and
signed transaction. Show the user:

- operation, network, world, lane IDs, and current carrier outpoints;
- exact marker meaning in readable form;
- required successor outputs, values, scripts, and lane mapping;
- every fee input, change output, recipient output, absolute miner fee, and fee
  rate;
- planned-RBF sequence and accepted all-output signature-hash mode; and
- whether the view is confirmed, provisional, stale, or unavailable.

For `RENDEZVOUS`, bind each complete input/successor pair before sorting by lane
ID. Do not let a UI reorder labels independently from transaction data. Explain
that both carriers can be put at risk if a jointly signed transaction is
malformed.

After finalization, parse the extracted raw transaction and run complete
state-aware validation against a fresh view before broadcast. Builders and
successful signatures do not prove protocol validity. Preserve the raw
transaction, PSBT where appropriate, validation result, source heights, and
user confirmation without retaining private keys.

### Wallet language

Use **control carrier**, **advance lane**, and **close lane**. Avoid **buy**,
**sell**, **mint**, **own artwork**, **earn**, and **claim royalty** unless a
separate product genuinely provides that function and the copy clearly says it
is off-protocol. Never display a market price as a protocol field.

## Indexer and data-platform contract

An indexer is a deterministic interpreter of a supplied Bitcoin chain. It is
not an oracle that can override confirmed history.

### Canonical ingestion

Use a fully validating Bitcoin node for the selected network, independently
parse raw transactions, resolve previous outputs, and apply complete blocks in
canonical order. Persist the indexed height and block hash separately from the
node's current height and tip hash. Detect divergence, roll back to the common
ancestor, and replay the active branch atomically.

Expose enough status for consumers to make a freshness decision:

- protocol and API version;
- configured network;
- indexed height and block hash;
- Bitcoin node height and tip hash when available;
- node availability, initial-block-download state, and lag;
- an explicit synchronization state whose failure mode is not "synced"; and
- last successful apply time and a machine-readable error class where useful.

Do not synthesize node tip data from the indexer's own checkpoint. If the node
is unreachable, return an explicit unavailable state rather than an optimistic
zero-lag result.

### Query semantics

Keep confirmed and mempool records structurally distinct. A provisional event
must not replace a lane's confirmed carrier or increment confirmed counters.
Return block height/hash and confirmation status with events. Bound and
document pagination, filters, graph depth, and render work. Escape titles and
untrusted labels in every output context.

Provide lookup by world, lane ID, event txid, and current outpoint where the
product needs it. An outpoint lookup should distinguish a live carrier from an
ordinary P2TR output, an ended lane, an unknown transaction, an indexer gap,
and an unavailable upstream. Do not turn every request failure into "not a
carrier"; wallets need fail-closed errors.

For analytics, publish definitions and query windows. Counts are observations
from a named indexer at a named height, not protocol promises or adoption
claims. Prefer aggregate measures, minimum reporting thresholds, and no
address-level behavioral profiles. The public graph remains public, but a
business can still create additional privacy harm by joining it to accounts,
IP addresses, or support records.

### Data provenance and portability

Identify the node network, indexed tip, software version or commit, renderer
version, and retrieval time. Offer stable machine-readable records and a path
to replay from the canonical chain. Cache invalidation must follow reorgs.
Backups should include schema version, state, checkpoints, and undo data, with
regular restore tests.

If a platform enriches events with off-chain metadata, store the source,
retrieval time, content hash where appropriate, license, moderation state, and
availability separately from protocol state. Missing enrichment must not make a
valid protocol event disappear.

## Explorer, gallery, and renderer boundaries

A renderer is an interpretation. Label its name and version, offer textual
event data, and make clear when animation, color, glyph shape, or layout is not
consensus. Provide accessible alternatives and respect reduced-motion
preferences.

An explorer or gallery can hide abusive off-chain content under its service
rules without claiming to remove the confirmed transaction from Bitcoin. It
can also stop rendering a world without declaring the protocol state invalid.
Document this distinction in moderation notices.

A read-only gallery may show links to independent services. It should not label
them an official marketplace or imply that ChainBloom validates listings,
buyers, sellers, settlement, rights, or royalties. V1 has no transfer or trade
primitive. A service that facilitates an off-protocol key or UTXO arrangement
assumes its own security, custody, consumer, market, and legal responsibilities
and must not present the arrangement as a native ChainBloom operation.

## Service and business models

Examples of separable services include:

- a wallet subscription for safer carrier coin control;
- managed Bitcoin-node or indexer hosting;
- API capacity, archives, monitoring, and service-level support;
- commissioned renderer design or accessible presentation;
- creator facilitation, key-distribution operations, or moderated events;
- independent security review, interoperability testing, or data analysis; and
- custody offered under an appropriate product and legal framework.

The commercial agreement should name the service provider, customer, service,
price, currency, miner-fee responsibility, data handling, support boundary,
availability objective, termination behavior, and remedies. If the service
controls keys, say exactly whose keys, under what authorization model, and what
happens on outage, insolvency, compromise, account loss, expiry, or a disputed
instruction.

Do not bundle the 1,000-satoshi carrier amount into a claim that the customer is
buying a ChainBloom asset. Do not promise that a lane will continue, that a
counterparty will cooperate, that miner fees remain economical, that an event
will confirm by a time, or that a renderer remains available.

## Product disclosure minimum

Before a person creates, receives, or spends a carrier through a service, show
plain-language disclosures that cover:

1. the experimental status and exact software/protocol version;
2. whether the service or user controls each carrier and fee key;
3. the exact service price and separately estimated Bitcoin miner fee;
4. the fact that an invalid or ordinary confirmed spend abandons a lane;
5. key-loss, compromise, reorg, mempool replacement, expiry, and step-limit
   behavior;
6. public transaction linkage and any account or telemetry linkage;
7. the difference between confirmed state, provisional data, and rendering;
8. support, incident, refund, retention, and complaint paths; and
9. the absence of a protocol token, rewards, royalties, transfer/trade
   primitive, protocol fee, and official marketplace.

Do not hide these facts only in terms. Repeat the material risk at the signing
decision.

## Integration acceptance gates

An integration is not ready merely because it can build a transaction. Before
public use, require evidence that:

- normative vectors and golden fixtures pass against the pinned v1 commit;
- valid and invalid cases for all five operations are covered;
- same-block chaining, exclusive expiry, maximum steps, valid `CLOSE` at the
  step limit, invalid carrier spends, and two-lane atomicity are tested;
- wallet output ordering, all-output signature hashes, fresh outpoints, and
  post-signing validation are enforced;
- indexer node unavailability, lag, reorg, crash recovery, and restore are
  exercised;
- APIs distinguish unknown, ended, stale, provisional, and unavailable states;
- accessibility, privacy, content moderation, support, incident response, and
  data retention are reviewed;
- claims link to an exact release, test evidence, and any independent security
  report rather than using an unsupported "audited" label; and
- qualified counsel has reviewed the exact product, custody model, target
  jurisdictions, marketing, terms, and transaction flow.

Mainnet activation should be a separate, reversible product decision with
tighter limits and monitoring after signet evidence. No document in this
repository represents that a production deployment, independent audit, or
legal approval already exists.

## Reference disclosures

Short, reusable disclosure language is maintained in the
[draft legal and transparency bundle](./legal-transparency-draft.md). Public
communications should follow the [brand guidelines](./brand-guidelines.md) and
[launch and media kit](./launch-media-kit.md). Technical teams should also read
the [security model](./security-model.md),
[developer guide](./developer-guide.md), and
[infrastructure guide](./infrastructure-guide.md).
