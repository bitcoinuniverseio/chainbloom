# ChainBloom launch and media kit

This kit contains release-ready factual language for the experimental
ChainBloom v1 protocol and reference implementation. It intentionally contains
no launch date, production URL, usage count, partner list, audit claim, live
network statistic, or deployment claim. At publication time, link the exact
commit or signed tag and only the environments that a release operator has
independently verified.

The [specification](../SPECIFICATION.md) is normative. The
[brand guidelines](./brand-guidelines.md) govern name, terminology, and asset
use. Product operators must complete security and counsel review before
adapting this kit to a commercial service.

## Release truth standard

Every external claim should answer three questions: **what exactly exists,
where is the evidence, and what remains experimental?** Use an exact commit,
test artifact, public security report, or observable deployment as evidence.
Do not turn an intention or passing local test into a statement of availability.

### Approved core facts

- ChainBloom v1 is an experimental Bitcoin-native fixed-lane UTXO relay
  protocol and open-source reference implementation.
- A valid world has one to eight fixed lanes, each represented by one live
  exact 1,000-satoshi P2TR carrier at a time.
- Valid confirmed events use `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, or
  `CLOSE`; independent indexers can reconstruct state from Bitcoin data.
- Confirmed best-chain state is canonical. Mempool views are provisional, and
  indexers must roll back and replay reorganizations.
- Rendering is non-consensus and may differ between implementations.
- The protocol has no token, balance or ownership market, reward, royalty,
  public mint, protocol fee, transfer/trade primitive, or official marketplace.
- The repository is MIT licensed and should be identified by an exact release
  or commit when reproducibility matters.

### Claims that require separate evidence

Do not say **deployed**, **live**, **production-ready**, **audited**, **secure**,
**battle-tested**, **adopted**, **trusted by**, **fastest**, **permanent**,
**immutable art**, **legally compliant**, or **available in a named wallet or
platform** unless the statement links to current, independently reviewable
evidence and accurately states scope. A test suite is not an independent
security audit. Bitcoin confirmation does not guarantee a hosted service or
media file will remain available.

## Message library

### One-sentence description

> ChainBloom is an experimental Bitcoin-native fixed-lane UTXO relay protocol
> for collaborative, confirmed creative state.

### Fifty-word description

> ChainBloom lets a creator start one to eight finite carrier lanes whose
> compact creative events are ordered by confirmed Bitcoin transactions.
> Participants continue or close exact 1,000-satoshi Taproot carriers, and
> deterministic indexers reconstruct the history. It is an experimental
> protocol with no token, rewards, royalties, protocol fee, or marketplace.

### Project boilerplate

> ChainBloom is an open-source protocol experiment and TypeScript reference
> implementation for collaborative state on Bitcoin. A world contains a fixed
> set of carrier UTXO lanes. Five compact operations create, advance, reference,
> coordinate, or close those lanes, while confirmed best-chain order provides
> the canonical history. ChainBloom separates strict protocol validation from
> non-consensus rendering and hosted services. Version 1 defines no token,
> balance ledger, rewards, royalties, public mint, protocol fee, transfer/trade
> primitive, or official marketplace. The project is MIT licensed and intended
> for regtest and signet experimentation until independent review and
> integration evidence support any broader use.

### Technical summary

> ChainBloom v1 uses one canonical bounded marker at transaction output zero
> and exact 1,000-satoshi P2TR carrier outputs. Required inputs and successors
> occupy deterministic positions, all inputs use planned RBF, and accepted
> signatures commit to every output. Confirmed parents must be at a lower block
> height, invalid confirmed carrier spends abandon affected lanes, and
> reorganizations restore and replay derived state. The specification, vectors,
> fixtures, validator, state engine, PSBT builders, CLI, renderer, tests, and
> operational guides are available in the reference repository.

## Primary project announcement

Use this version when the exact repository commit is publicly accessible and
the release checks cited with it have been verified:

> **Introducing ChainBloom v1 for public experimentation**
>
> ChainBloom asks a focused protocol-design question: what can people build
> together when a small set of real Bitcoin UTXOs becomes a finite creative
> relay?
>
> A ChainBloom world begins with one to eight 1,000-satoshi Taproot carrier
> lanes. Confirmed transactions can create a world, add a compact bloom,
> reference an earlier confirmed event, coordinate two lanes while preserving
> both, or close a lane. Deterministic indexers replay Bitcoin history to derive
> the same lane state; renderers remain free to interpret that state in
> different ways.
>
> The v1 repository includes the normative specification, TypeScript codec and
> parser, state-aware validator, atomic replay and rollback engine, PSBT
> builders, CLI, vectors, fixtures, tests, deterministic reference renderer,
> security guidance, and integration documentation.
>
> ChainBloom is deliberately not a token or market protocol. It has no rewards,
> royalties, public mint, protocol fee, transfer or trade operation, or
> official marketplace. Carrier control is the ability to spend a Bitcoin UTXO,
> not a protocol-defined claim of authorship, legal title, or price.
>
> Version 1 is experimental. Developers should begin on regtest; public trials
> should use signet. Mainnet use requires independent security review,
> wallet-integration testing, reorg and restore exercises, incident planning,
> and product-specific legal review. Read the specification, run the vectors,
> inspect the signing risks, and tell us where independent implementations
> disagree.

## Audience-specific announcements

### For Bitcoin and protocol developers

> ChainBloom v1 is ready for technical review as an experimental fixed-lane
> UTXO relay. The protocol makes lineage explicit through exact Taproot carrier
> outpoints, bounded markers, fixed input/output mappings, confirmed-parent
> ordering, atomic invalid-spend handling, and deterministic reorg replay. The
> repository includes a reference codec, transaction parser, validator, state
> engine, builders, CLI, vectors, fixtures, and tests. Review the normative
> specification, run an independent implementation against the vectors, and
> challenge the failure model. No token or marketplace layer is part of v1.

### For creators and communities

> ChainBloom is a finite creative relay carried by confirmed Bitcoin UTXOs. A
> world can open one to eight lanes; participants add compact choices, point to
> an earlier event, bring two lanes together without merging them, or close a
> lane. The visual result depends on the renderer, so the same history can
> support different accessible and artistic interpretations. This is an
> experiment, not a mint or investment. Start on signet, protect carrier keys,
> and publish clear participation and moderation rules.

### For wallet and infrastructure teams

> ChainBloom v1 offers a concrete integration test for carrier isolation,
> all-output signing, fresh-state checks, multi-party PSBT coordination,
> previous-output validation, provisional mempool UX, and deterministic reorg
> recovery. Wallets should fail closed on stale or unavailable indexer state
> and revalidate the extracted transaction before broadcast. Indexers should
> expose both indexed and Bitcoin-node tips. The integration guide documents
> those contracts without treating an API as consensus.

## Press release

**FOR IMMEDIATE RELEASE**

### ChainBloom publishes experimental Bitcoin UTXO relay protocol for collaborative creative state

ChainBloom contributors have published the version 1 specification and
reference implementation of ChainBloom, an open-source experiment that uses a
fixed set of Bitcoin Taproot UTXOs as lanes in a finite collaborative history.

A valid ChainBloom world begins with one to eight carrier outputs. Participants
who control a current carrier can publish a compact event in a precisely shaped
Bitcoin transaction and continue or close the lane. The five operations are
`CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, and `CLOSE`. A rendezvous coordinates
two lanes in one transaction while preserving both lane identities; a graft
references an earlier confirmed event without merging or transferring a lane.

ChainBloom relies on Bitcoin for transaction validity, spend authorization,
confirmation order, and the canonical chain. Deterministic ChainBloom indexers
apply the additional marker and lineage rules. Confirmed best-chain state is
canonical, unconfirmed events remain provisional, and indexers restore and
replay state after a reorganization. If a confirmed transaction spends a live
carrier without making a valid ChainBloom transition, the affected lane is
recorded as abandoned.

The MIT-licensed reference repository includes the normative specification,
TypeScript implementation, command-line tools, PSBT builders, test vectors,
golden transaction fixtures, security and integration guidance, and a
deterministic non-consensus renderer. Renderer appearance is intentionally not
part of the protocol, allowing independent visual and accessible
interpretations of the same event history.

ChainBloom v1 does not define a token, protocol balance, rewards, royalties,
public mint, protocol fee, transfer or trade operation, or official marketplace.
The exact 1,000-satoshi carrier value is a transaction-shape invariant, not a
price or reward. Third-party wallets, indexers, hosting, creative services, and
commercial products remain separate from the protocol and responsible for
their own terms, security, privacy, availability, and legal obligations.

The project describes v1 as experimental. Its documentation recommends regtest
for development and signet for public trials. Mainnet use should follow an
independent security review, wallet-integration testing, reorganization and
restore exercises, incident planning, and product-specific legal review.

The source repository should be used for the latest specification, exact
release evidence, contribution process, and security contact. The project does
not make an adoption, deployment, audit, performance, or legal-compliance claim
in this release.

### About ChainBloom

ChainBloom is an open-source Bitcoin protocol experiment for collaborative,
confirmed creative state. It follows a small number of exact carrier UTXOs
through five compact operations and leaves visual rendering outside consensus.
ChainBloom is specification-led, MIT licensed, and has no protocol token or
marketplace.

## Frequently asked questions

### Is ChainBloom a token, NFT, inscription, or marketplace?

No. ChainBloom v1 defines a transaction marker and state machine for fixed
carrier lanes. It has no token, balance or ownership registry, public mint,
sale, listing, transfer/trade operation, rewards, royalties, protocol fee, or
official marketplace. An external service may offer separate functionality
under its own terms, but that is not a ChainBloom operation.

### What is a carrier?

A carrier is the current exact 1,000-satoshi P2TR output for one lane. The key
able to spend that output controls the lane's next Bitcoin transaction. The
amount is a protocol invariant, not a denomination, price, reward, or ownership
certificate.

### What does ChainBloom store on Bitcoin?

Each valid event has one compact, bounded ChainBloom marker in an `OP_RETURN`
output and spends or creates required carrier outputs. The normative
specification defines the exact bytes and positions. Large media and renderer
output are not stored or guaranteed by the protocol.

### What can participants do?

They can create a finite world, advance one lane with a bloom, advance one lane
while referencing an earlier confirmed event with a graft, coordinate and
continue two lanes with a rendezvous, or close a lane. Creative numeric fields
are interpreted by renderers and do not encode price, rarity, or rights.

### Does a rendezvous merge or exchange lanes?

No. It consumes exactly two ordered live carriers and creates one distinct
successor for each lane. It records coordination without combining lane values,
identities, or protocol-defined ownership.

### Does a graft copy or acquire the target?

No. It records a reference to an earlier confirmed ChainBloom event. The target
need not be in the same world, and the operation grants no license, ownership,
endorsement, or control over it.

### Why can a lane be abandoned?

Bitcoin permits the key holder to spend the UTXO in any valid Bitcoin
transaction. If that confirmed spend fails ChainBloom rules, there is no live
successor to follow. The indexer records abandonment instead of inventing an
unspent carrier. There is no administrator or recovery transaction.

### Can an event be unconfirmed?

An indexer may preview a mempool transaction, but it is provisional. It cannot
become a confirmed lineage parent or increment confirmed counters. It may be
replaced, conflict, fail to confirm, or disappear.

### What happens in a chain reorganization?

Canonical ChainBloom state follows Bitcoin's active best chain. An indexer must
roll back to the common ancestor and replay the new branch. Applications should
identify the indexed tip and distinguish provisional or reorged data.

### Will every renderer show the same image?

No. Rendering is non-consensus. Implementations can differ in layout, color,
motion, medium, and accessibility while agreeing on the same protocol events.
Identify the renderer and version when visual reproducibility matters.

### Who pays fees?

The participant or sponsoring service pays ordinary Bitcoin miner fees under
their own arrangement. ChainBloom itself charges no protocol fee. A third party
may charge for its own service, but must label that charge separately.

### Can the project recover a lost key or reverse a transaction?

No. The protocol has no administrator, recovery key, freeze function, or
rollback authority. A lost carrier key can freeze the lane; a compromised key
can spend it. Only a Bitcoin chain reorganization can remove a previously
confirmed spend from canonical history.

### Is ChainBloom private?

No. Lane transitions form a public transaction graph. Rendezvous events, fee
inputs, and change can create additional links. Services can create still more
linkage by combining chain data with accounts, network logs, or support data.

### Is v1 ready for mainnet?

The project describes v1 as experimental and does not make that claim. The
recommended path is regtest development and signet trials, followed by
independent security review, wallet testing, reorg and restore exercises,
incident readiness, and product-specific legal review before any mainnet use.

### How can someone evaluate it?

Read the normative specification and security model, identify the exact commit,
run the vectors and fixtures, inspect the tests, reproduce the release checks,
and compare an independent implementation's derived state. Report security
issues through the repository's vulnerability-disclosure process.

## Social copy

Attach the [official social image](../site/assets/chainbloom-og.png) and the
exact repository release link. Do not append price, token, mint, or trading
hashtags.

### Short post

> ChainBloom v1 is an experimental fixed-lane UTXO relay for collaborative,
> confirmed creative state on Bitcoin. Five operations. Exact Taproot carriers.
> Deterministic replay. Open-ended rendering. No token, rewards, royalties,
> protocol fee, or marketplace. Read the spec and test it on regtest or signet.

### Developer post

> New protocol-review surface: ChainBloom v1 follows exact 1,000-sat P2TR
> carrier lanes through confirmed Bitcoin transactions. The reference repo has
> the spec, codec, parser, validator, rollback/replay state engine, PSBT
> builders, CLI, vectors, fixtures, and tests. Find a disagreement. No token or
> trading layer.

### Eight-post thread

1. > ChainBloom v1 is a small Bitcoin protocol experiment: a fixed set of
   > spendable UTXOs becomes a finite collaborative history. This thread
   > explains the model and its limits.
2. > `CREATE` opens 1-8 lanes. Each has one live exact 1,000-sat Taproot
   > carrier. The spending key controls the next transaction; there is no admin
   > or recovery key.
3. > `BLOOM` adds a compact creative step. `GRAFT` references an earlier
   > confirmed event. Neither creates a token or ownership claim.
4. > `RENDEZVOUS` coordinates two lanes in one transaction, but each gets its
   > own successor. It is not a merge, swap, or sale. `CLOSE` ends one lane.
5. > Bitcoin validates spends and orders confirmed transactions. ChainBloom
   > indexers apply additional marker, carrier, timing, and state rules.
6. > An invalid confirmed carrier spend abandons the lane. Mempool events are
   > provisional. Reorgs require rollback and deterministic replay. Wallet
   > isolation and full-output signing matter.
7. > Rendering is intentionally outside consensus. Two renderers can produce
   > different visuals while agreeing on every confirmed event.
8. > V1 is experimental: begin on regtest or signet, run the vectors, review
   > the security model, and identify the exact commit. No token, rewards,
   > royalties, protocol fee, transfer/trade primitive, or official marketplace.

## Email announcement

**Subject:** ChainBloom v1: an experimental creative UTXO relay on Bitcoin

> We have published ChainBloom v1 for technical and creative experimentation.
>
> ChainBloom follows one to eight exact Taproot carrier lanes through confirmed
> Bitcoin transactions. Five compact operations create a world, add a creative
> step, reference an earlier event, coordinate two lanes while preserving both,
> or close a lane. Independent indexers can reconstruct the same confirmed
> history, while renderers remain free to interpret it differently.
>
> The reference repository includes the normative specification, TypeScript
> implementation, CLI, PSBT builders, vectors, fixtures, tests, deterministic
> renderer, security guidance, and integration documentation.
>
> ChainBloom does not have a token, rewards, royalties, public mint, protocol
> fee, transfer or trade operation, or official marketplace. Version 1 is
> experimental. Start on regtest or signet, protect carrier keys, verify the
> complete transaction before broadcast, and do not treat a mempool preview as
> confirmed history.
>
> The most useful contributions are specification review, independent vector
> implementations, wallet-signing critique, indexer replay tests, accessible
> renderers, and clear reports of disagreement. Please read the security and
> vulnerability-disclosure guidance before testing.

## Sixty-second video script

**Visual:** Two separate lines, each with several nodes, move toward a central
bloom and continue as two lines.

**Narration:**

> What if a small Bitcoin UTXO could carry the next step in a shared creative
> history? ChainBloom is an experimental fixed-lane relay. A world starts with
> one to eight exact Taproot carriers. Control the current carrier, and a valid
> confirmed transaction can add a bloom, point back to an earlier event, bring
> two lanes together without merging them, or close a lane.
>
> Bitcoin proves and orders the spends. ChainBloom indexers apply the compact
> marker and lineage rules. Mempool events stay provisional, and renderers can
> interpret the same history in different ways.
>
> There is no ChainBloom token, reward, royalty, protocol fee, transfer market,
> or official marketplace. V1 is open source and experimental. Read the spec,
> run it on regtest or signet, protect the carrier keys, and help test where the
> model holds up - and where it does not.

**End card:** ChainBloom v1. Experimental Bitcoin protocol. Read the
specification. No token or marketplace.

Caption the complete narration. The visual must not show a price chart, token,
sale button, or unconfirmed node as confirmed.

## Demonstration script

Use regtest for a deterministic recorded demonstration. A signet demo is
appropriate only when the node, indexer, funding, confirmation wait, and error
handling have been rehearsed without faking live state.

### 1. Establish evidence

Show the exact repository commit, configured network, Bitcoin node tip, indexer
tip, and synchronization state. Say:

> This is an experimental reference flow on regtest. The displayed state comes
> from this indexed chain at this height; it is not a production or mainnet
> claim.

### 2. Create a world

Use two lanes so later coordination is visible. Show the decoded `CREATE`
fields, marker at output zero, two exact carrier roots, fee input, and change.
Before mining, label the transaction provisional. Mine a block, refresh node
and indexer heights, and show both confirmed lane outpoints.

### 3. Advance one lane

Build a `BLOOM`. Demonstrate that the current carrier is isolated from ordinary
coin selection and that the successor stays exactly 1,000 satoshis while
separate inputs fund the miner fee. Review every output and signature-hash mode,
extract, revalidate, broadcast, and confirm.

### 4. Explain a graft

Build or decode a `GRAFT` that references the confirmed `BLOOM`. State that the
reference does not transfer or merge a lane and grants no rights over the
target. Do not use a same-block target.

### 5. Coordinate a rendezvous

Show the two lane IDs sorted, carrier inputs zero and one, and distinct
successors at outputs one and two. If multiple signers participate, show the
PSBT handoff without exposing keys. Explain that both lanes are at risk if the
final transaction shape is wrong.

### 6. Show provisional and confirmed state

Before mining, display the rendezvous in a visibly separate mempool area while
the confirmed carriers remain present. After mining, show atomic advancement.
If the interface cannot make this distinction obvious, do not use it for the
demo.

### 7. Close and recap

Use `CLOSE` on one lane and show that no output is designated as a ChainBloom
successor. End with the other lane still separate. Recap key loss, invalid
spend, expiry, reorg, public-graph, and renderer limits. Link the exact raw
transactions and commit used in the demo when they can be safely published.

Never substitute a prerecorded success response while calling the flow live.
If a dependency fails, show the explicit unavailable state and continue with a
clearly labeled recording or fixture.

## Livestream run of show

**Total time:** 45 minutes, plus an optional 15-minute technical appendix.

| Time  | Segment                     | Content                                                                                     |
| ----- | --------------------------- | ------------------------------------------------------------------------------------------- |
| 0-4   | Scope and safety            | Experimental status, exact environment, no token/market claims, key and transaction warning |
| 4-10  | Why fixed lanes             | Problem, Bitcoin/ChainBloom boundary, goals and non-goals                                   |
| 10-18 | Protocol walkthrough        | World, carrier, five operations, expiry, step limit, abandonment                            |
| 18-30 | Rehearsed regtest demo      | Create, bloom, rendezvous, provisional/confirmed view, close                                |
| 30-35 | Architecture and evidence   | Node, validator, state engine, API, wallet, renderer, vectors                               |
| 35-41 | Risks and open questions    | Coin selection, signatures, reorgs, privacy, accessibility, coordination                    |
| 41-45 | Contribution paths          | Review spec, reproduce tests, implement vectors, report vulnerabilities                     |
| 45-60 | Optional technical appendix | Raw marker decode, fixture comparison, rollback/replay exercise                             |

Assign a host, protocol presenter, demo operator, moderator, and incident lead.
The demo operator should not moderate chat or answer press questions while
signing. Use a separate, disposable demonstration wallet. Never screen-share a
seed phrase, private key, RPC credential, access token, personal notification,
or unredacted wallet path.

The moderator opens with:

> Today covers an experimental protocol and a controlled demonstration. Nothing
> shown is a token sale, investment offer, custody service, mainnet activation,
> or guarantee of availability. Do not send funds or keys to anyone in chat.

If live state diverges, pause and say what is known. Do not mine, edit, or
replace a hidden transaction solely to manufacture a successful narrative.

## Community event playbook

Run the first workshop on regtest or a controlled signet environment. Publish
the exact software commit, prerequisites, funding method, expected miner fees,
data collection, code of conduct, and support boundary before registration.
Provide a no-wallet observer path so participation does not require key control.

A safe workshop has three tracks:

1. **Observe:** decode fixtures, follow a lane, compare confirmed and
   provisional views, and inspect renderer differences.
2. **Build:** run a local node/indexer, validate vectors, or implement a
   read-only renderer without handling participant keys.
3. **Transact:** use a dedicated test-only wallet to build, review, and confirm
   a carrier transition with direct facilitator supervision.

Facilitators must not collect seeds or private keys, promise recovery, or move
participant funds. Record only the minimum telemetry described in the event
notice. For public creative prompts, state content rules, licenses, moderation
scope, and the fact that a service can hide content but cannot delete a Bitcoin
transaction.

After the event, publish reproducible technical findings, not a victory metric.
Include environment, commit, participant methodology, failures, invalid spends,
indexer disagreements, reorg observations, and privacy limitations. Obtain
consent before quoting or identifying participants.

## Moderator brief

Pin these facts in every public channel:

- ChainBloom v1 is experimental; regtest and signet are the default learning
  environments.
- There is no token, sale, airdrop, reward, royalty, protocol fee, or official
  marketplace. Posts claiming otherwise are not project announcements.
- Maintainers and moderators never request a seed phrase or private key.
- A mempool event is provisional. A screenshot is not proof of confirmation.
- Control of a carrier UTXO is not a protocol-defined legal ownership or IP
  claim.
- Security reports follow the private vulnerability-disclosure process; public
  issues are for non-sensitive bugs and discussion.

Remove impersonation, phishing, malicious downloads, seed requests, doxxing,
credible threats, illegal content, undisclosed promotions, spam, and repeated
misrepresentation under the [Code of Conduct](../CODE_OF_CONDUCT.md) and
[draft acceptable-use rules](./legal-transparency-draft.md). Preserve evidence
according to the published retention policy and escalate security or safety
issues privately. Do not debate a reporter into disclosing exploit details in
public chat.

Moderators may correct protocol facts but must not give individualized legal,
tax, investment, or key-recovery advice. A useful response is: "The protocol
does not define that feature; here is the relevant specification section. A
separate service may have its own terms."

## Support response library

These responses are deliberately product-neutral. A hosted operator must add
its verified status and private support path without requesting secrets.

### "My transaction is pending"

> A mempool transaction is provisional and may be replaced, conflict, confirm,
> or disappear. Check that you are viewing the intended network and compare the
> transaction with a current Bitcoin node and indexer. Do not build a child as a
> valid ChainBloom parent until the carrier event is confirmed in an earlier
> block. Never share a seed phrase or private key with support.

### "The indexer says my lane disappeared"

> First compare the indexer's configured network, indexed height and hash, node
> tip, lag, and availability. A reorganization can remove a previously visible
> event, and an invalid confirmed spend can abandon a lane. Preserve the txid,
> raw transaction, lane ID, heights, and non-secret logs. Do not rebroadcast or
> spend another carrier until the canonical state is clear.

### "I accidentally spent the carrier"

> If the spend confirms without a valid ChainBloom successor, the lane is
> abandoned under v1. ChainBloom has no administrator or recovery transaction.
> If the transaction is still unconfirmed, replacement options depend on the
> wallet, signatures, policy, and Bitcoin mempool conditions; do not accept
> instructions from anyone asking for keys. A Bitcoin specialist can review
> the public transaction, but no recovery is guaranteed.

### "I lost the key"

> ChainBloom has no password reset or recovery key. Restore only through your
> wallet's documented backup process. Never send a seed phrase or private key to
> a maintainer, moderator, or support agent. Without the spending key, the
> carrier UTXO and lane may remain frozen until world expiry, and the Bitcoin
> value may be inaccessible.

### "Two renderers look different"

> Rendering is not consensus. Compare the world, lane, event txids, operation
> fields, confirmation heights, and renderer versions. Different visuals can be
> valid interpretations of the same protocol state. Report a protocol mismatch
> only if the decoded or derived event state differs.

### "Where can I buy, sell, or mint one?"

> ChainBloom v1 has no public mint, transfer/trade operation, rewards, royalties,
> protocol fee, or official marketplace. Be cautious of accounts or sites that
> imply otherwise. A third-party service is separate from the protocol and must
> be evaluated under its own identity, security, and terms.

### "How much does it cost?"

> ChainBloom itself charges no protocol fee. A transaction needs ordinary
> Bitcoin miner fees, and an advancing lane recreates its exact 1,000-satoshi
> carrier. A third-party wallet, host, or service may charge separately; review
> its disclosed price and refund terms. No fee or confirmation time is
> guaranteed by the protocol.

### "I found a security issue"

> Please do not post exploit details publicly. Follow the repository's
> vulnerability-disclosure instructions and include affected versions,
> reproduction steps, impact, and a safe contact method. Do not include private
> keys, seed phrases, production credentials, or unnecessary personal data.

## Crisis communications

Security and chain-state incidents reward precision. Designate one incident
lead, preserve evidence, stop scheduled promotional content, and separate
confirmed facts from hypotheses. Do not promise recovery, attribution,
reimbursement, legal conclusions, or a resolution time before authority and
evidence exist.

### Severity guide

- **Critical:** credible risk of unauthorized signing/key exposure, malformed
  builder output that can abandon carriers, supply-chain compromise, or
  deterministic state corruption across implementations.
- **High:** indexer publishes false freshness, rollback/replay is incorrect,
  wallet fails to isolate carriers, or public API exposes sensitive service
  data.
- **Moderate:** renderer or API outage, stale gallery data with correct safety
  labeling, content incident, documentation error, or degraded performance that
  does not affect signing decisions.

Severity is an operational triage aid, not a legal conclusion. Escalate privacy,
safety, sanctions, law-enforcement, and regulated-product questions to qualified
personnel.

### Initial holding statement

Publish only after confirming that an incident exists:

> We are investigating a report affecting a ChainBloom-related component. We
> have paused scheduled release communications while we determine the affected
> versions, environments, and user actions. ChainBloom protocol state and hosted
> service status are separate; we will identify each explicitly. Do not share
> seed phrases or private keys with anyone claiming to provide support. We will
> update the repository's incident channel when we have verified information.

### Signing-risk notice

Use when evidence supports pausing a named wallet or builder version:

> Stop creating or signing new ChainBloom transactions with the affected
> component until further notice. Do not move a carrier through an ordinary
> wallet as a workaround; that can abandon the lane. Existing confirmed Bitcoin
> transactions are not reversed by this notice. Preserve the affected version,
> PSBT or raw transaction, txid, and non-secret logs, and follow the private
> security-reporting process. We will publish scope and remediation evidence
> after verification.

Name the exact affected versions and networks immediately around that statement
when known. Do not use it as a generic precaution without a real incident.

### Indexer outage notice

> The affected indexer cannot currently establish a current Bitcoin-node view.
> Its API and gallery data may be unavailable or stale. Wallets should fail
> closed and must not infer that a cached carrier remains live. This is a service
> availability incident, not by itself a change to Bitcoin or canonical
> ChainBloom history. We will report indexed height, node height, common-ancestor
> checks, and replay completion before declaring recovery.

### Resolution report

A resolution report must include exact affected versions and dates, detection
source, impact, confirmed versus potential exposure, technical root cause,
timeline, containment, remediation commit, test and deployment evidence,
carrier or state consequences, user actions, data handling, remaining risks,
and follow-up owners. Publish a correction history. If evidence is incomplete,
say so and schedule the next factual update instead of closing the incident.

## Media interview notes

Lead with the fixed-lane experiment and its limits. Useful answers include:

- **Why Bitcoin?** It supplies widely observable spend authorization and
  confirmed ordering. ChainBloom does not ask Bitcoin consensus to understand
  creative meaning.
- **Why exact carriers?** A single live outpoint gives each lane an explicit
  continuation point that independent indexers can follow.
- **Why no token?** The research question is coordination through carrier
  lineage, not an incentive or ownership economy.
- **What is novel?** Describe the combination precisely - fixed finite lanes,
  compact actions, deterministic confirmed replay, visible abandonment, and
  non-consensus rendering - without asserting patent novelty or priority.
- **What could fail?** Keys can be lost, carriers can be mis-spent, fees and
  confirmations vary, indexers can lag or fail, reorgs change history, public
  graphs reduce privacy, and renderers or hosted services can disappear.
- **Is it launched on mainnet?** Answer only with the presently verified
  environment and evidence. The reference documentation does not claim a
  mainnet or production deployment.

Do not speculate about price, token issuance, regulatory classification,
partner roadmaps, user counts, audit completion, or incident attribution.

## Publication checklist

Before releasing any item in this kit:

1. identify the exact commit or signed tag and confirm repository visibility;
2. reproduce the release checks and preserve their outputs;
3. verify every linked environment, wallet, indexer, API, and renderer rather
   than describing planned infrastructure as live;
4. confirm security-reporting, support, moderation, incident, and rollback
   paths are staffed;
5. review the wallet and data-platform boundaries in the
   [integration guide](./commercial-integration.md);
6. confirm the [official assets](./brand-guidelines.md) render with alt text and
   without automatic destructive cropping;
7. remove scheduled copy that contains unsupported partner, audit, deployment,
   adoption, performance, permanence, or legal claims;
8. have qualified counsel review the exact public product, terms, privacy
   notice, target jurisdictions, and marketing; and
9. archive the published copy and evidence so later corrections are auditable.
