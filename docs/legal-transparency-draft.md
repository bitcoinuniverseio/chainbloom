# ChainBloom legal and transparency bundle

> **DRAFT FOR COUNSEL REVIEW - NOT APPROVED TERMS OR LEGAL ADVICE**
>
> This repository does not identify a commercial operator, contracting entity,
> service jurisdiction, production deployment, or legal contact. The material
> below is a product-drafting resource, not an operative agreement or notice.
> Do not publish, accept users, process personal data, or rely on this bundle
> until qualified counsel has reviewed the exact service, operator, custody
> model, target jurisdictions, transaction flow, vendors, and marketing.

This bundle is jurisdiction-neutral by design. It does not classify ChainBloom
or any integration under financial, consumer, privacy, intellectual-property,
tax, gambling, sanctions, or other law. Rights and obligations that cannot be
stated responsibly without an operator and governing law are called out rather
than invented.

The [ChainBloom Protocol Specification](../SPECIFICATION.md) is normative for
protocol behavior. Legal text cannot change whether a transaction is valid,
restore a key, reverse a spend, recover a carrier, or alter canonical history.

## 1. Reference-project transparency statement

The following facts describe the material checked into this repository. They
are not claims about a separately deployed service.

| Topic                | Repository fact                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status               | ChainBloom v1 and its reference implementation are experimental.                                                                                     |
| Protocol actions     | V1 defines `CREATE`, `BLOOM`, `GRAFT`, `RENDEZVOUS`, and `CLOSE`.                                                                                    |
| Carrier              | A live lane uses one exact 1,000-satoshi P2TR carrier outpoint; the spending key controls its next Bitcoin transaction.                              |
| Financial layer      | The protocol defines no token, balance/ownership ledger, reward, royalty, public mint, protocol fee, price oracle, or governance asset.              |
| Market layer         | V1 defines no sale, listing, bid, transfer/trade operation, settlement, or official marketplace.                                                     |
| Custody and recovery | The protocol and reference library do not hold keys, recover keys, freeze carriers, or reverse confirmed transactions.                               |
| Canonical state      | Confirmed Bitcoin best-chain state is canonical; mempool projections are provisional and reorganizations require replay.                             |
| Rendering            | Visual or other rendering is non-consensus and can differ or become unavailable.                                                                     |
| License              | The reference software is distributed under the [MIT License](../LICENSE).                                                                           |
| Security posture     | The repository describes mainnet use as requiring independent security review and wallet-integration testing; no audit claim is made here.           |
| Deployment posture   | This repository does not represent that a production or mainnet service is deployed.                                                                 |
| Reference site data  | The checked-in static site has no account, analytics, advertising, or application-cookie integration; a deployment host may separately log requests. |
| Governance           | Protocol changes follow the checked-in governance and release process; marketing and hosted services cannot amend v1 rules.                          |

Reverify this table against the exact release before publication. If a hosted
operator adds accounts, analytics, cookies, custody, payments, enrichment,
moderation, vendors, or a marketplace-like service, this statement is no longer
a complete description of that product.

## 2. Draft terms for a reference site or hosted service

> **DRAFT FOR COUNSEL REVIEW.** These clauses are not effective until a named
> operator supplies legally required identity, contact, effective date,
> governing terms, and assent flow, and counsel approves them for the actual
> product and jurisdictions.

### 2.1 Scope and relationship to the protocol

These draft terms govern access to an operator's website, application, API,
renderer, support channel, or other hosted service that uses or describes
ChainBloom. They do not govern Bitcoin, create rights in a Bitcoin transaction,
or modify the ChainBloom specification. The ChainBloom protocol is open-source
software and a deterministic interpretation of certain confirmed Bitcoin
transactions; it is not an entity, counterparty, custodian, broker, exchange,
marketplace, financial institution, or dispute-resolution system.

A service should identify every function it actually provides. Source-code
access under the MIT License, a hosted user interface, an indexer API, key
custody, transaction construction, transaction broadcast, creative services,
and community moderation are distinct functions and may have different terms.

### 2.2 Eligibility and lawful use

Users must have legal capacity to accept the operative terms and may use the
service only where doing so is lawful for them and the operator. The operator
must obtain counsel-approved rules for age, restricted regions, sanctions,
consumer eligibility, business use, and any regulated features. This draft does
not set a universal age threshold or conclude that geographic restrictions are
required or sufficient.

### 2.3 No account, custody, or financial promise by default

Unless a separately identified service expressly says otherwise in
counsel-approved terms, users retain control of their Bitcoin keys and
transactions. The reference protocol cannot access, freeze, recover, or replace
a carrier key. A user should never send a seed phrase or private key to a
maintainer, moderator, renderer, indexer, or support agent.

The protocol provides no token, account balance, reward, yield, royalty, public
mint, protocol fee, investment return, price support, transfer/trade operation,
or official marketplace. An operator that separately takes custody, transmits
value, charges a service fee, facilitates an arrangement involving keys or
UTXOs, offers a contest or prize, or displays third-party listings must describe
that product on its own terms and obtain applicable legal review. It must not
attribute its promises to ChainBloom.

### 2.4 User transaction responsibilities

Users are responsible for selecting the intended network, protecting keys and
backups, confirming the current carrier, reviewing every input and output,
understanding miner fees, using compatible signature-hash modes, validating the
extracted transaction, and deciding whether to broadcast. A service should not
state that a transaction is safe merely because it was built, signed, accepted
to a mempool, or displayed by one indexer.

Bitcoin transactions may be delayed, rejected, replaced, conflicted, confirmed,
or removed from the active chain in a reorganization. A valid Bitcoin spend can
still be invalid under ChainBloom. A confirmed invalid spend of a live carrier
abandons the affected lane. Key loss can freeze a carrier. The protocol has no
administrator or recovery transaction.

### 2.5 Fees and payments

ChainBloom charges no protocol fee. Bitcoin miners may receive transaction fees
under Bitcoin's fee market. An operator may charge a separately disclosed
service price only under its own agreement. The operative checkout or signing
flow should show the service price, currency, estimated miner fee, taxes where
applicable, recurring nature if any, refund rule, and who is authorized to move
funds. No fee estimate or confirmation time should be guaranteed.

### 2.6 Content and intellectual property

Users must have the rights needed for titles, prompts, artwork, metadata,
comments, recordings, trademarks, and other content they submit to a hosted
service. A compact ChainBloom marker does not prove authorship, originality,
license, or legal ownership. A `GRAFT` reference does not grant rights over its
target, and carrier control does not assign copyright or other intellectual
property.

The operative terms must state what license, if any, a user grants the operator
to host, cache, reproduce, transform, render, moderate, and display submitted
off-chain content. The license should be limited to actual service needs and
should not purport to erase non-waivable rights. Third-party licenses and
attribution must be preserved.

### 2.7 Acceptable use

Users may not use the hosted service to:

- violate applicable law or another person's rights;
- distribute malware, phishing, credential theft, or instructions designed to
  obtain seeds, private keys, or unauthorized signatures;
- threaten, harass, exploit, impersonate, defraud, dox, or publish personal or
  confidential data without authority;
- submit infringing content or falsely claim authorship, affiliation,
  endorsement, protocol validity, audit status, or legal ownership;
- manipulate, overload, scrape contrary to published limits, probe without
  authorization, evade access controls, or interfere with the node, indexer,
  API, wallet, renderer, or community;
- promote a nonexistent ChainBloom token, mint, reward, royalty, protocol fee,
  transfer market, or official marketplace;
- conceal paid promotion, conflicts of interest, or material service terms; or
- use the service for content or activity the operator has lawfully prohibited
  in a published, consistently enforced product policy.

Enforcement can suspend access, remove hosted content, limit API use, or close a
service account. It cannot delete a Bitcoin transaction, rewrite canonical
ChainBloom history, or recover a spent carrier. The operator should give notice
and an appeal path when safe and appropriate, while preserving emergency
authority for credible security or safety threats.

### 2.8 Third-party systems

Bitcoin nodes, wallets, signers, browsers, hosting providers, code forges,
content stores, analytics vendors, and external services are independent. Their
availability, security, policies, and terms can change. The operator should
identify material vendors and links, but a link or compatibility statement does
not mean endorsement or control.

### 2.9 Availability, changes, and termination

Experimental software may contain defects or change. A hosted service should
describe its actual availability objective, maintenance process, version
support, data export, shutdown notice, and treatment of paid periods. Suspending
or ending a hosted service does not stop Bitcoin, invalidate prior confirmed
events, or make another indexer preserve the same renderer output.

A backward-incompatible protocol rule requires a new specified version. A
service may stop supporting v1, but it should not silently reinterpret v1
history.

### 2.10 Warranty and liability drafting boundary

The MIT License supplies the warranty disclaimer for the licensed software. A
hosted operator may have separate mandatory duties and consumer obligations
that an open-source license does not waive. Counsel must draft any service
warranty, statutory-rights notice, limitation of liability, indemnity,
insurance, refund, and remedy terms for the actual entity and jurisdictions.
This bundle intentionally does not invent a liability cap, waiver of mandatory
rights, arbitration clause, class waiver, governing law, or forum.

### 2.11 Notices, complaints, and changes

Before launch, the operator must publish a durable way to receive legal notices,
privacy requests, content complaints, accessibility reports, billing disputes,
and support requests. Sensitive security reports must use the private
[vulnerability disclosure process](./vulnerability-disclosure.md), not a public
issue. The operative terms should state how material changes are announced,
when they take effect, and how a user can stop using and export from the hosted
service.

## 3. Draft privacy notice

> **DRAFT FOR COUNSEL REVIEW.** A privacy notice must describe what the actual
> operator and its vendors do, not what this reference repository could do.
> Identify controller/processor roles, contact details, lawful bases, required
> disclosures, and rights for each launch jurisdiction before processing data.

### 3.1 Data that may exist

**Public Bitcoin and ChainBloom data.** Transactions, txids, outpoints, scripts,
amounts, marker fields, block position, lane relationships, GRAFT references,
RENDEZVOUS links, and derived status are public or derivable from Bitcoin. A
world title is compact public data. This information can be copied and retained
by independent nodes, indexers, archives, and observers.

**Service request data.** A deployed site, API, or renderer host may receive IP
address, request time, route, user agent, response status, abuse signal, and
similar network logs. The checked-in static reference site does not add
analytics or application cookies, but the chosen host or CDN may still process
request data.

**Wallet and account data.** A separate wallet or hosted product may process
public keys, descriptors, addresses, outpoints, transaction drafts, device
data, account identifiers, authentication records, preferences, or billing
records. None of that processing is inherent to the ChainBloom protocol. Never
collect a seed phrase or private key for analytics or support.

**Communications.** Contributions, issues, community posts, support messages,
security reports, accessibility feedback, content complaints, and event
registrations may include identifiers and user-supplied content. Public code
forge or community activity is governed partly by the platform operator.

**Off-chain creative content.** A renderer or gallery may receive prompts,
media, metadata, attribution, licenses, moderation records, and content hashes.
Keep these records separate from canonical protocol state.

### 3.2 Purposes and minimization

An operator should collect only data needed to provide and secure the service,
maintain canonical state, respond to support and rights requests, moderate
hosted content, prevent abuse, process a disclosed payment, meet applicable
obligations, and publish privacy-preserving aggregate reliability evidence.

Do not collect address-level behavioral analytics merely because the chain is
public. Do not join public lane history to accounts, IP addresses, advertising
identifiers, or support records without a documented necessity, lawful basis,
access restriction, retention limit, and clear notice. Disable sensitive fields
in logs and error trackers.

Counsel must identify each lawful basis or equivalent authorization required by
the target jurisdiction. "Blockchain data is public" is not, by itself, a
universal answer to privacy obligations for an operator that indexes,
organizes, enriches, profiles, or republishes it.

### 3.3 Sharing and processors

A notice should name or categorize actual hosting, infrastructure, monitoring,
support, payment, communications, security, and professional-service providers;
explain why they receive data; and link their applicable policies where
required. Contractual processors should receive only necessary data under
appropriate instructions and safeguards.

An operator may need to disclose information to protect users, investigate
abuse, exercise legal rights, or comply with valid process. Counsel should
define review, minimization, notice, and transparency-report rules. Do not
promise that data will never be disclosed.

### 3.4 International transfers

Repository access and Bitcoin observation can cross borders. A deployed
operator must map storage and support locations, subprocessors, and remote
access, then implement and disclose any transfer mechanism required by the
relevant laws. This draft does not declare a universal transfer mechanism.

### 3.5 Security

Apply least privilege, encryption in transit, secrets isolation, credential
rotation, dependency review, access logging, tested backups, incident response,
and deletion controls appropriate to each data category. Keep Bitcoin RPC away
from public interfaces. Do not place private keys, seeds, authentication tokens,
or unredacted PSBT secrets in logs, analytics, screenshots, support tools, or
issue trackers.

No security measure eliminates risk. A privacy notice must not use "secure" or
"encrypted" as an absolute claim; describe verified scope and current controls.

### 3.6 Individual rights and chain-data limits

The operative notice must explain applicable access, correction, deletion,
restriction, objection, portability, consent-withdrawal, complaint, and appeal
rights, plus how identity is verified without collecting excessive data.

An operator may be able to delete an account, support record, IP log, or hosted
media while being unable to delete a Bitcoin transaction or copies held by
independent parties. State that limit plainly. Do not write personal or
confidential data into a world title or encourage users to encode it in
transactions.

### 3.7 Children

Do not knowingly design a public transaction or key-management flow for
children without specialist review, age-appropriate design, guardian rules,
and jurisdiction-specific consent and safety controls. A generic age sentence
is not a substitute for that work.

## 4. Draft cookie notice

> **DRAFT FOR COUNSEL REVIEW.** As checked in, the reference static site does
> not set application cookies and contains no analytics or advertising
> integration. Verify the deployed page, response headers, consent platform,
> embedded content, and hosting provider before making the same statement about
> a live site.

If a deployment uses only strictly necessary storage for security, load
balancing, authentication, or user-requested settings, explain each item,
provider, purpose, duration, and whether it is first- or third-party. Do not
label analytics, personalization, or advertising storage "necessary" merely to
avoid a choice flow.

Before adding non-essential cookies, pixels, local storage, fingerprinting,
embedded media, or cross-site measurement, complete privacy and security review,
update the notice, provide any required prior choice, honor withdrawal and
browser signals where applicable, and verify that rejected tags do not fire.
Do not use wallet addresses or lane activity for ad targeting.

## 5. Risk disclosures

Product surfaces should present the relevant risk near the decision, not only
in this document.

### Protocol and transaction risk

- Bitcoin consensus does not enforce ChainBloom semantics. A confirmed Bitcoin
  transaction can be an invalid ChainBloom event.
- An invalid confirmed spend of a live carrier abandons every affected lane.
  There is no ChainBloom recovery or administrative reversal.
- A `CLOSE` intentionally ends a lane. Expiry and the per-lane step limit also
  prevent further advancing events under v1.
- A child whose parent confirms in the same block is invalid under ChainBloom.
- Required positions, exact carrier values/scripts, sequence, payload, network,
  and all-output signature policy must all be correct.
- A two-lane rendezvous is atomic and can put both carriers at risk if the
  final transaction is malformed.

### Key and custody risk

- A lost key can freeze the carrier and make its Bitcoin inaccessible.
- A stolen, shared, or compromised key can spend the carrier without permission.
- Generic coin selection, consolidation, fee bumping, or send-max behavior can
  spend a carrier unintentionally.
- Multi-party signing introduces coordination, substitution, privacy, and
  incomplete-signature risks. A builder does not prove signer intent.
- A custodian or hosted wallet introduces counterparty, operational,
  authorization, insolvency, and regulatory risks outside the protocol.

### Bitcoin network risk

- Fees, confirmation time, mempool policy, relay, miner behavior, and chain
  reorganizations are not controlled by ChainBloom.
- Planned RBF means an unconfirmed transaction may be replaced. Mempool
  visibility is not confirmation.
- Software or network rules can change, and a service may stop supporting a
  network or protocol version.
- The 1,000-satoshi carrier remains Bitcoin value subject to key, fee, dust
  policy, and market-price conditions; the protocol makes no value promise.

### Indexer and software risk

- A node or indexer can be unavailable, lagging, misconfigured, on the wrong
  network, corrupted, or incorrect during rollback and replay.
- An API, cache, explorer, or wallet can mislabel stale state as current.
- Parsers, builders, dependencies, signers, browsers, extensions, and updates
  can contain vulnerabilities or supply-chain compromise.
- Test coverage and deterministic vectors reduce some implementation risk but
  are not proof of security, correctness, availability, or independent audit.

### Rendering, content, and availability risk

- Rendering is non-consensus. Appearance can vary by implementation and version.
- Off-chain images, metadata, APIs, domains, or hosted media can change,
  disappear, be blocked, or be moderated.
- A title or reference can involve inaccurate, offensive, unlawful, infringing,
  or deceptive content. Protocol validation does not review content rights.
- A service can hide content from its interface but cannot erase a Bitcoin
  transaction or compel independent services to follow its decision.

### Privacy risk

- Carrier lineage is public. A rendezvous links two lanes; fee inputs and
  change can link other wallet activity.
- Address rotation does not eliminate transaction-graph analysis.
- Accounts, IP logs, support messages, event registration, analytics, and
  off-chain content can create additional linkage.
- Public-chain data and third-party copies may not be erasable even when a
  hosted operator honors deletion of data it controls.

### Legal, tax, and counterparty risk

- Legal and tax treatment depends on the product, actors, jurisdictions, key
  control, payments, content, marketing, contests, and other facts.
- Carrier control does not establish legal title, authorship, IP ownership,
  licensing, or entitlement to value.
- An off-protocol service can create custody, consumer, financial, sanctions,
  advertising, privacy, contest/gambling, tax, or record-retention obligations.
- A counterparty may refuse to coordinate, fail to sign, misrepresent intent,
  lose a key, or broadcast a conflicting transaction.

## 6. Reusable point-of-action disclosures

These short notices are factual starting points. A real product must place them
where the risk arises and have counsel approve the surrounding flow.

### Experimental software

> ChainBloom v1 is experimental. Software defects, incompatible integrations,
> and unexpected chain or wallet behavior can cause loss of lane continuity or
> Bitcoin. Use regtest or signet unless the exact product has completed the
> independent review required for broader use.

### Non-custodial reference flow

> This reference flow does not hold or recover your keys. Anyone with the
> carrier key can spend the UTXO. Never share a seed phrase or private key with
> support, maintainers, moderators, or other participants.

### Protocol versus service

> ChainBloom defines transaction and state rules. This interface, indexer,
> renderer, wallet, and support service are separate components with their own
> availability, security, data practices, and terms.

### Signing warning

> Review every input and output. An ordinary or malformed confirmed spend of a
> live carrier abandons the lane. Confirm the current outpoint, exact successor,
> lane mapping, operation, fee, change, network, and all-output signature policy
> before signing.

### Provisional state

> Unconfirmed events are provisional. They may be replaced, conflict, fail to
> confirm, or disappear, and they cannot be confirmed lineage parents.

### No market layer

> ChainBloom has no token, protocol balance, reward, royalty, public mint,
> protocol fee, transfer/trade operation, or official marketplace. Carrier
> control is not a protocol-defined ownership or investment claim.

### Service and miner fees

> ChainBloom charges no protocol fee. Bitcoin miner fees and any separately
> identified service charge are distinct. Fees and confirmation timing can
> change and are not guaranteed.

### Public graph

> Lane activity is public Bitcoin transaction data. Rendezvous, fee inputs, and
> change can link activity. Do not include personal or confidential information
> in public titles or content.

### Renderer interpretation

> This view is a non-consensus renderer interpretation. Other renderers may look
> different while agreeing on the same confirmed events.

## 7. Creator, content, and intellectual-property policy

Creators should publish the world prompt, participation rules, content license,
attribution method, moderation scope, renderer dependency, key handoff process,
and treatment of expiry before distributing carriers. Those are social or
service rules; the protocol does not enforce them after key control changes.

A world title is restricted compact ASCII data, not a rights registry. Creative
operation fields are numbers, and a `GRAFT` target is a transaction reference.
None proves that a submitter owns a name, image, idea, trademark, or referenced
work. Participants remain responsible for the rights needed to submit and use
content.

For hosted off-chain content, obtain a clear, limited license to store, cache,
transform, render, display, distribute, and moderate only as required by the
service. State whether the license survives account closure for backups,
published compilations, or legal preservation. Provide attribution and license
metadata where promised. Do not imply that putting a reference on Bitcoin
grants the public a license.

A content-notice process should accept identification of the work or right,
location in the hosted service, complainant authority and contact, requested
action, and a good-faith statement where applicable. Counsel should define
counter-notice, repeat-abuse, preservation, and jurisdiction-specific processes.
Operators may restrict a hosted view while explaining that they cannot delete
the underlying Bitcoin transaction.

Avoid placing sensitive personal data, secrets, access tokens, defamatory
claims, or content requiring deletion into titles or transaction-linked public
metadata. A creator who needs editable or access-controlled content should keep
it off-chain and understand that its link may still persist.

## 8. Community standards

The project's [Code of Conduct](../CODE_OF_CONDUCT.md) governs project spaces.
Community participation should remain technically honest, safe, and welcoming.

Moderators may act against harassment, threats, hate, sexual exploitation,
impersonation, fraud, phishing, secret solicitation, doxxing, infringement,
malware, spam, service abuse, undisclosed paid promotion, and repeated false
claims about tokens, sales, rewards, audits, or official status. Apply rules
consistently, document material decisions, manage conflicts of interest, and
offer an appeal path where safe.

Never ask a participant to prove a problem by sharing a seed phrase or private
key. Route vulnerability details privately. Do not provide personalized legal,
tax, investment, or recovery advice. Community status, contributor role, or
control of a carrier does not authorize someone to speak for the project.

Publish event recording, photography, quote, and accessibility practices before
an event. Obtain consent where required and provide a meaningful non-recorded or
observer path when feasible.

## 9. Data-retention baseline

> **DRAFT FOR COUNSEL REVIEW.** Retention must match the actual product,
> purpose, legal obligations, security needs, user promises, backup design, and
> rights process. The following is a conservative operational baseline, not a
> statement of current service practice.

| Data category                      | Proposed baseline                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Bitcoin and derived protocol state | Retain while operating the indexer and as needed for deterministic replay; disclose that independent public copies may persist indefinitely. |
| Raw web/API security logs          | Minimize fields and delete or de-identify within 30 days unless a documented incident requires restricted preservation.                      |
| Account and preferences            | Retain while active; delete or de-identify after closure on a documented schedule, subject to required records and backups.                  |
| Billing and transaction records    | Retain only for the period required by applicable accounting, tax, consumer, fraud, and dispute rules.                                       |
| Support communications             | Delete or de-identify within 12 months after closure unless the user requests earlier deletion or an open dispute requires retention.        |
| Security reports and incident logs | Restrict access and retain for 24 months after remediation, then review for deletion, anonymization, or justified extension.                 |
| Moderation and abuse records       | Retain for up to 24 months where needed for safety, appeals, repeat abuse, or legal preservation; segregate sensitive data.                  |
| Event registration and recordings  | State a specific event period; delete unused registration data promptly and retain recordings only with disclosed consent and purpose.       |
| Product analytics                  | Prefer short-lived event data and aggregate, de-identified reports; do not retain address-level behavioral profiles by default.              |
| Backups                            | Use a documented rolling schedule and ensure deletion propagates when backups expire or are restored.                                        |

Create an owner, deletion job, access rule, backup treatment, legal-hold
procedure, and verification test for every row actually used. "Keep forever"
is not an acceptable default for service logs merely because chain data is
public. Publish material retention changes before they take effect.

## 10. Responsible-marketing standard

Marketing must be substantiated, reproducible, and scoped. Keep the evidence
with the approved copy.

### Required practices

- Identify the protocol version, software release, network, renderer, indexer
  tip, and measurement window when they matter to a claim.
- Separate observed test results from predictions and separate protocol facts
  from service features.
- Disclose material service prices, miner fees, custody, sponsorship, affiliate
  relationships, paid endorsements, and conflicts of interest.
- Label provisional activity, community art, third-party services, simulations,
  and recorded demonstrations accurately.
- Use aggregate adoption or reliability metrics only with a published method,
  scope, timestamp, privacy review, and correction process.
- Pair creative language with experimental, key, invalid-spend, public-graph,
  and non-consensus-rendering disclosures where material.
- Make accessibility, translation, and risk information as easy to reach as the
  promotional claim.

### Prohibited or unsupported framing

Do not describe ChainBloom as an investment, savings product, passive-income
source, collectible market, guaranteed scarcity, permanent media archive,
ownership registry, audited system, insured product, risk-free wallet,
regulator-approved protocol, or official Bitcoin project. Do not suggest that
price appreciation, royalties, rewards, resale, or a future token will follow.

Do not use fake countdowns, invented waitlists, undisclosed testimonials,
fabricated user counts, purchased engagement, selective outage statistics, or
security superlatives. Do not target people based on financial vulnerability or
market a key-management flow to children.

An independent audit claim must link the complete report, reviewer, date,
version, scope, exclusions, and remediation status. "Audited" cannot describe
unreviewed integrations or later changes. An availability or performance claim
must name the tested environment and time window.

## 11. Ongoing transparency record

A deployed operator should publish a dated, versioned transparency page that
separates protocol, software, and service facts. Each update should contain:

- operator identity and covered products;
- supported ChainBloom and software versions and Bitcoin networks;
- deployed component commits, indexer/node freshness method, and renderer
  version;
- custody and signing model, service prices, miner-fee treatment, and refund
  rules;
- material vendors, data categories, retention schedule, and cookie state;
- security review reports with scope and unresolved findings;
- availability methodology and verified incident summaries;
- moderation policy, aggregate appeals and actions where safe and meaningful;
- aggregate government or legal requests where publication is lawful;
- known limitations, unsupported features, and deprecation dates; and
- correction history with links to prior versions.

Do not publish empty zeroes as evidence that no incident, request, or complaint
occurred unless record collection and scope make that conclusion supportable.
Where publication could expose a reporter, victim, investigation, or security
control, explain the category without unsafe detail.

For the reference repository, release notes and the changelog should identify
the exact implementation changes and validation evidence. A separately hosted
service needs its own operational record; repository activity is not a service
uptime report.

## 12. Counsel and launch acceptance gate

Do not convert this file into operative terms by deleting the draft banner.
Before publication, qualified counsel and accountable product owners should:

1. identify the operator, affiliates, product surfaces, users, vendors, target
   jurisdictions, and legally required contacts;
2. map key control, funds, fees, transaction broadcast, accounts, content,
   analytics, support, and incident flows end to end;
3. determine applicable consumer, privacy, financial, sanctions, advertising,
   IP, accessibility, tax, contest/gambling, employment, and record rules
   without assuming the protocol label decides the answer;
4. draft governing law, dispute, mandatory-rights, liability, indemnity,
   cancellation, refund, age, geography, and complaint terms for the actual
   service;
5. verify the deployed site's cookies, headers, logs, processors, transfer
   mechanisms, deletion, backups, and rights-request workflow;
6. review the exact UI disclosures and signing flow, not only this document;
7. align terms with the [commercial integration guide](./commercial-integration.md),
   [security model](./security-model.md), and [launch kit](./launch-media-kit.md);
8. complete the [legal review checklist](./legal-review.md) and record approvals;
   and
9. assign owners and dates for periodic review after any custody, payment,
   marketplace-like, prize, identity, analytics, content, vendor, or geographic
   change.

Until that work is complete, this document must remain labeled **DRAFT FOR
COUNSEL REVIEW - NOT APPROVED TERMS OR LEGAL ADVICE**.
