# ChainBloom technical whitepaper

Status: experimental v1 design rationale. This paper is explanatory, not
normative. The [ChainBloom Protocol Specification](../SPECIFICATION.md) is the
sole authority for byte encodings, validation rules, and state transitions.
Implementations must use the specification, vectors, and fixtures rather than
derive consensus behavior from this paper.

## Abstract

ChainBloom is a Bitcoin-native protocol experiment for building a finite,
collaborative history from a small set of spendable UTXOs. A valid `CREATE`
transaction starts a world with one to eight fixed lanes. Each lane has one
live 1,000-satoshi P2TR carrier at a time. A participant advances a lane by
spending its current carrier in a confirmed transaction, publishing one of
five compact operations and creating any required successor carrier. A
deterministic indexer follows those outpoints and reconstructs the same event
graph from Bitcoin transaction and block data.

The design deliberately does less than an asset protocol. It defines no
token, balance ledger, ownership registry, transfer or trade operation,
reward, royalty, public mint, protocol fee, price, or official marketplace.
Control follows the Bitcoin key that can spend the current carrier. The
protocol records valid creative transitions; it does not promise the
continued existence, market value, or uniform appearance of a lane.

ChainBloom explores a narrow question: can a small number of real Bitcoin
outputs act as durable hand-off points for an ordered, shared creative process
without introducing a parallel financial system?

## 1. Problem and constraints

Collaborative applications often rely on a server to decide event order,
authorize updates, preserve history, and recover state. Bitcoin can provide a
widely replicated order of confirmed spends, but Bitcoin consensus does not
understand application-specific creative actions. A protocol built on that
foundation must clearly separate what Bitcoin proves from what an indexer
derives.

ChainBloom starts with these constraints:

- Bitcoin validates transaction and script correctness. It does not enforce
  ChainBloom markers, successor positions, lane limits, or creative meaning.
- A spendable UTXO cannot be forced to continue a lane without a covenant.
  Whoever controls a carrier can spend it outside the protocol.
- Unconfirmed transactions can be replaced, conflict, or disappear. They
  cannot safely define canonical lineage.
- Chain reorganizations can remove events that previously appeared confirmed.
- Compact on-chain data should remain bounded and deterministically parsed.
- Rendering should be free to evolve without changing protocol history.

These constraints produce a protocol whose failure states are visible rather
than hidden. A valid transition advances a lane. A deliberate `CLOSE` ends it.
An invalid confirmed spend abandons it. Expiry ends its permitted activity.
There is no administrative repair transaction.

## 2. Design goals and non-goals

### Goals

1. **Deterministic reconstruction.** Independent implementations given the
   same canonical chain and prior-output data should derive the same worlds,
   lanes, events, and terminal states.
2. **Bounded interpretation.** Markers, world sizes, lifetimes, and step counts
   are explicitly limited so validation does not require unbounded metadata or
   recursive network lookups.
3. **Explicit continuity.** Every advancing event must consume the exact live
   carrier and create its exact successor in a known output position.
4. **Visible collaboration.** A two-lane rendezvous records interaction while
   preserving both lane identities and values.
5. **Bitcoin-aligned finality.** Confirmed best-chain state is canonical;
   mempool views are clearly provisional and reorganizations are replayable.
6. **Renderer freedom.** Creative presentation is downstream of validated
   state and cannot silently alter protocol meaning.
7. **Conservative wallet behavior.** Builders constrain transaction shape,
   while wallets retain responsibility for coin selection, signing, fee review,
   validation, and broadcast.

### Non-goals

ChainBloom is not a token standard, collectible ownership registry, trading
protocol, payment network, royalty engine, rewards program, naming system, or
permanent storage layer. It does not determine the legal owner or author of a
work. It does not make metadata available forever. It does not provide key
recovery, transaction reversal, censorship resistance for hosted interfaces,
or identical output across renderers.

## 3. The fixed-lane model

A world is identified by the display-order transaction ID of its valid
`CREATE`. Creation fixes its network, lane count, duration, maximum steps,
seed, and compact title. The world has one through eight lanes numbered from
zero. Each lane begins at a root carrier output in the creation transaction.

A lane is not an account and does not hold a protocol balance. It is a lineage:

```text
root carrier -> confirmed event -> successor carrier -> confirmed event -> ...
```

At any confirmed state, an active lane has at most one live carrier outpoint.
Every carrier contains exactly 1,000 satoshis in a standard P2TR output. That
amount is a shape invariant, not a unit of account, price floor, reward, or
valuation. The participant also needs separate Bitcoin inputs to pay miner
fees because an advancing event must recreate the full carrier value.

Possession of the spending key controls what happens to a carrier. Control is
operational authority, not a protocol-defined claim of copyright, authorship,
title, or market ownership. A key can be lost, compromised, or used to make a
non-protocol spend. ChainBloom has no covenant, administrator, or recovery key
that can restore the lane.

### Finite worlds

Two independent limits bound participation. A world has an exclusive end
height derived from its creation height and duration. Each lane also has a
maximum number of advancing steps. The world expires when block processing
reaches its end height; a lane at its step limit cannot advance further.
`CLOSE` remains valid at the step limit so a holder can intentionally terminate
the lane. The specification defines the exact status transitions.

This finite shape lets creators describe a known maximum activity envelope. It
does not guarantee that every lane will advance or reach its limit.

## 4. The five operations

The marker identifies exactly one of five v1 operations. The summary below is
conceptual; payload ranges and transaction positions remain normative only in
the [specification](../SPECIFICATION.md).

| Operation    | Effect                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `CREATE`     | Starts a finite world and creates one ordered root carrier for each lane.                           |
| `BLOOM`      | Advances one lane with compact glyph, palette, motion, and magnitude choices.                       |
| `GRAFT`      | Advances one lane while referencing an earlier confirmed ChainBloom event; it does not merge lanes. |
| `RENDEZVOUS` | Advances exactly two ordered lanes atomically and preserves a distinct successor for each.          |
| `CLOSE`      | Intentionally ends one lane without creating a designated successor.                                |

`GRAFT` is a reference edge, not a transfer, license, endorsement, or claim
over its target. Its target must already be a valid confirmed event at a lower
height, which makes validation a bounded indexed lookup and prevents
same-block reference ambiguity.

`RENDEZVOUS` is a coordinated transition, not a pool or merge. Its two carrier
inputs are ordered by lane ID, and each output continues the corresponding
lane. Both lanes increment independently. The transaction can require
coordination between different signers, but the protocol does not define how
they communicate, negotiate, or allocate miner fees.

`CLOSE` has no ChainBloom successor. It is distinct from abandonment because
it is a valid protocol event with an explicit application-defined reason byte.
Neither the reason byte nor any other creative field carries protocol-level
financial or legal meaning.

## 5. Transaction discipline

Every event uses one canonical, tightly bounded marker at output zero. Required
carrier inputs and outputs occupy fixed positions. Every input uses planned
RBF sequence, and accepted signature-hash modes commit to every output. Fee
inputs and fee/change outputs may be added only after required carrier
positions. These constraints make the transaction's intended lane mapping
auditable before signing.

Fixed positions do not make a builder or PSBT safe by itself. A wallet must
verify the complete transaction after signing and before broadcast. In
particular, it must confirm the network, operation, payload, live carrier
outpoints, successor scripts and values, lane ordering, fee, change, sequence,
and signature-hash policy. A validating Bitcoin node remains responsible for
script execution and Bitcoin consensus.

All required carrier parents must be confirmed below the candidate event's
block height. A child transaction in the same block as its parent is invalid
under ChainBloom even if Bitcoin accepts the transaction package. Wallets
should therefore wait for confirmation before treating a successor as
spendable for another ChainBloom event.

## 6. Derived state and invalid spends

The state machine processes the canonical best chain in increasing block
height and transaction order. At the start of each height, it expires worlds
whose exclusive end height has arrived. For each transaction it resolves any
live carriers, performs complete state-aware validation, and applies all lane
mappings atomically.

If a confirmed transaction spends a live carrier but fails ChainBloom
validation, the affected lane is marked abandoned. This rule reflects Bitcoin
reality: the outpoint is spent even though the application transition is not
valid. Silently keeping the old carrier live would create a fictional UTXO and
allow indexers to diverge from the chain.

For a two-lane transaction, validation and application are atomic. A malformed
attempt that spends live carriers can abandon every affected lane. This is why
coin isolation, exact output review, and independent pre-broadcast validation
are central to the security model.

Events and invalid-spend records remain useful audit evidence after a lane or
world ends. Derived status should never erase the underlying history.

## 7. Confirmation, mempool, and reorganizations

Confirmed best-chain state is the only canonical state. A mempool transaction
may be shown as a preview, but it cannot become a lineage parent, increment a
confirmed step counter, or hide the last confirmed carrier. Conflicts and RBF
replacements should remain visible as provisional alternatives.

An indexer must pair its checkpoint with the actual chain identity, detect a
reorganization, restore state to the common ancestor, and replay the new
branch in canonical order. A block should be applied in a single database
transaction or through an equivalent reversible journal. A crash must not
publish a half-applied block.

Applications should expose indexed height, node height, lag, and availability
instead of reducing health to a single optimistic flag. Wallets should fail
closed when they cannot establish that the carrier and world view is current.
An API response is evidence from one implementation, not a replacement for
independent validation.

## 8. Rendering and meaning

The compact creative fields are inputs to presentation, not consensus-defined
art. The protocol does not prescribe shapes, colors, animation, layout,
metadata servers, or media formats. Two conforming renderers may look
different while agreeing on every world, lane, and event.

This separation has three benefits. Interfaces can improve without forking
history; accessibility-specific renderers can present the same state in
different ways; and indexers can remain focused on validation rather than media
availability. It also requires honest labeling. A screenshot, animation, or
gallery is a renderer's interpretation and should identify its version when
reproducibility matters.

The reference renderer is deterministic for testing and demonstration, but it
is not privileged by the protocol. Off-chain images or metadata may disappear,
change, or be moderated by a service even while the compact confirmed events
remain reconstructable from chain data.

## 9. Security and privacy analysis

### Key and transaction risk

The highest-impact failure is an unintended carrier spend. Ordinary wallet
coin selection can consume a carrier as a fee input, permanently abandoning
the lane. Integrations should use dedicated accounts or descriptors, persistent
UTXO labels and locks, an explicit ChainBloom signing mode, and a final
transaction-shape check. Support personnel must never request a seed phrase or
private key.

Partial-output signature hashes could permit a counterparty to alter the
marker or successor mapping. Version 1 therefore accepts only the specified
all-output-committing modes. Hardware or remote signers should display every
input and output; a generic "sign transaction" prompt is not adequate for a
multi-party rendezvous.

### Indexer and availability risk

Indexers depend on a trustworthy Bitcoin node, correct previous-output data,
atomic storage, and accurate reorg handling. Malformed-marker traffic can
create resource pressure even when every transaction is ultimately ignored.
Implementations should bound parsing, batch sizes, lookups, response pages,
and RPC timeouts. Public APIs need rate limits and operational monitoring.

An unavailable or lagging indexer should produce an explicit unavailable or
stale state. It must not guess that a cached carrier remains live. Consumers
that make signing decisions need stronger freshness requirements than a public
gallery.

### Privacy

Lane continuity is a public transaction graph. `RENDEZVOUS` links two lanes in
one transaction, and fee inputs or change can link other wallet activity.
Fresh output keys reduce address reuse but do not erase graph analysis. A
world title and any referenced off-chain content should exclude personal,
confidential, or regulated data. Public-chain data generally cannot be removed
by a project operator.

For the detailed threat table and signing controls, see the
[security model](./security-model.md).

## 10. Interoperable implementation

The reference architecture separates six concerns:

```text
Bitcoin node -> transaction parser -> codec + state-aware validator
                                      |
                                      v
                         atomic confirmed state engine
                              |                 |
                              v                 v
                          read API     non-consensus renderer

wallet coin isolation -> canonical builder -> signer -> revalidation -> broadcast
```

The codec handles exact bytes without chain state. The parser normalizes
Bitcoin serialization. The validator reads, but does not mutate, state and
previous-output context. The state engine is the sole writer of confirmed
derived state. APIs and renderers consume that state. Builders help wallets
construct valid shapes but cannot assert that keys, fees, chain state, or
signatures are correct.

Independent implementations should compare marker vectors, raw transaction
fixtures, validation issue codes, and state snapshots. Unknown versions,
opcodes, networks, rulesets, reserved values, or extra bytes must be rejected
under v1. Forward compatibility comes from an explicitly specified new version,
not permissive decoding.

## 11. Economic and service boundaries

ChainBloom itself charges no fee. Participants still pay ordinary Bitcoin
miner fees and continue a 1,000-satoshi carrier when an operation requires a
successor. A third party may separately charge for wallet, custody, hosting,
indexing, rendering, moderation, support, or creative services. Those are
service terms outside the protocol and must not be presented as protocol fees,
royalties, or rewards.

The protocol has no native sale, bid, listing, transfer, settlement, or royalty
operation. A data platform can index and display ChainBloom state, and a wallet
can construct its five operations, but neither should imply a protocol-defined
ownership market. The [commercial and ecosystem integration guide](./commercial-integration.md)
defines these boundaries in more detail.

## 12. Limitations and open research

The fixed-lane model intentionally accepts limitations that should be evaluated
through experiments:

- A lane depends on one spendable outpoint and can be frozen by key loss.
- A valid Bitcoin spend can permanently violate ChainBloom continuity.
- Multi-party rendezvous coordination happens outside the protocol.
- Miner-fee conditions can make a small carrier inconvenient to move even
  though its full value must be recreated.
- Confirmation latency limits rapid interaction; same-block chaining is not
  allowed.
- Public transaction linkage conflicts with strong privacy expectations.
- Renderer diversity improves expression but weakens visual uniformity.
- Long-term reconstruction depends on access to chain data and maintained
  software, not a permanence guarantee.

Useful experiment measurements include invalid-spend frequency, confirmation
and reorg UX, signer comprehension, indexer agreement, rendezvous completion
rates, API lag behavior, restore time, and accessible rendering quality. Such
measurements should be published with methodology and privacy protections. No
adoption, reliability, performance, or security result is claimed by this
paper.

## 13. Deployment posture

The v1 repository is an experimental reference implementation. Regtest is the
appropriate environment for deterministic development, and signet is the
appropriate environment for a public trial. Mainnet use should wait for an
independent security review, wallet-integration testing, restore and reorg
exercises, incident procedures, and product-specific legal review.

A responsible release should identify the exact commit or tag, publish test
and vector results, document known limitations, distinguish confirmed from
provisional data, and avoid claims of audit, adoption, permanence, or
production readiness that cannot be independently verified.

## 14. Governance and change control

ChainBloom is specification-led. An incompatible rule change requires a new
protocol version; version 1 history must not be reinterpreted in place. The
project's [governance](../GOVERNANCE.md) and
[release process](./release-process.md) describe review, vectors, and release
evidence. Social posts, hosted APIs, and renderer behavior cannot amend the
specification.

## References

- [Normative v1 specification](../SPECIFICATION.md)
- [Reference architecture](./architecture.md)
- [Developer guide](./developer-guide.md)
- [Infrastructure guide](./infrastructure-guide.md)
- [Security model](./security-model.md)
- [Valid marker vectors](../vectors/valid-markers.json) and
  [invalid marker vectors](../vectors/invalid-markers.json)
- [Golden transaction fixtures](../fixtures/README.md)
