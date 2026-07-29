# ChainBloom litepaper

> **One-page introduction.** ChainBloom is an experimental protocol and
> reference implementation. The [v1 specification](../SPECIFICATION.md) is the
> only normative source. Nothing here is financial, investment, tax, or legal
> advice.

## A living shared history on Bitcoin

ChainBloom is a small, finite way for people to build a shared creative history
through confirmed Bitcoin transactions. A creator starts a **world** with one
to eight parallel **lanes**. Each lane is carried by one real Bitcoin output:
a 1,000-satoshi Taproot UTXO. Whoever can spend that output can make the next
valid event for the lane, continue it to a fresh carrier, or close it.

Bitcoin provides transaction validity, spend authorization, confirmation order,
and the canonical chain. ChainBloom adds a strict interpretation of a compact
marker and the carrier's input/output path. Independent indexers can replay the
same confirmed transactions to reconstruct the world's lanes and events.

The result is a relay, not a ledger of tradable things. ChainBloom has no token,
protocol balance, reward, royalty, public mint, protocol fee, transfer or trade
operation, or official marketplace.

## How a world grows

1. **Create.** A valid `CREATE` fixes the world's lane count, lifetime, maximum
   steps per lane, seed, and short title. Its root outputs begin the lanes.
2. **Hand off a carrier.** A participant controls the current lane UTXO. They
   use a compatible wallet to construct and review an exact ChainBloom
   transaction, sign it, and broadcast it.
3. **Confirm an event.** Once included in a block, a valid operation advances
   or closes the lane. Mempool activity remains provisional.
4. **Repeat within the limits.** A successor must confirm before it can be the
   parent of another valid event. The lane continues until it is closed,
   abandoned, expired, or reaches its maximum advancing steps.

Every advancing operation recreates the full 1,000-satoshi carrier in a fixed
output position. Separate Bitcoin inputs normally fund the miner fee. The
carrier amount is a protocol shape requirement, not a price, reward, or unit of
account.

## Five actions, one clear vocabulary

| Action       | Plain-language meaning                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `CREATE`     | Begin a finite world and its fixed set of lanes.                                               |
| `BLOOM`      | Add one compact creative step to a lane and continue it.                                       |
| `GRAFT`      | Add a step that references an earlier confirmed ChainBloom event; no lane or ownership merges. |
| `RENDEZVOUS` | Coordinate two lanes in one transaction, then continue each lane separately.                   |
| `CLOSE`      | End one lane intentionally without a successor.                                                |

Glyph, palette, motion, magnitude, relation, bridge style, intensity, and close
reason are compact application inputs. A renderer decides how to present them.
Different renderers may produce different visuals while agreeing on the same
protocol history.

## What Bitcoin proves, and what it does not

Bitcoin proves that a transaction was accepted into the canonical chain and
that each input satisfied its spending conditions. It does not enforce
ChainBloom output positions, creative payloads, world expiry, or successor
creation. ChainBloom indexers apply those additional deterministic rules.

That boundary creates an important failure mode: the carrier holder can make an
ordinary or malformed Bitcoin spend. The UTXO is then gone. A ChainBloom
indexer marks the lane abandoned rather than pretending the old carrier is
still spendable. There is no administrator, recovery key, or protocol rollback.
A Bitcoin chain reorganization is the only way a confirmed spend can leave the
canonical history.

## Participant safety

Use regtest for development and signet for trials. A compatible wallet should
isolate carrier outputs from ordinary coin selection, label and lock them,
show all inputs and outputs, enforce all-output-committing signatures, and
revalidate the extracted transaction before broadcast. Always verify the
network, current carrier, successor value and script, operation, fee, change,
and lane mapping. Wait for confirmation before attempting the next event.

Keys deserve ordinary Bitcoin security. Losing a carrier key can freeze a lane;
sharing it gives someone else the ability to spend the UTXO. Support personnel
should never ask for a seed phrase or private key.

Every lane is also public transaction-graph data. A rendezvous visibly links
two lanes, and fee inputs or change may link other wallet activity. Do not put
personal or confidential information in a world title or related public
content.

## A protocol, not a product promise

The open-source reference includes a codec, parser, validator, deterministic
state engine, PSBT builders, command-line tools, vectors, fixtures, tests, a
renderer, and documentation. A deployed wallet, indexer, API, gallery, hosted
renderer, or support service is a separate product with its own operator,
availability, data practices, and terms.

Third parties may charge for their own custody, wallet, hosting, rendering,
moderation, support, or creative work. Those charges are not ChainBloom
protocol fees. No service should imply that the protocol guarantees value,
scarcity, resale, royalties, uptime, permanent media hosting, or identical
rendering.

## Who can experiment

- **Creators** can design a finite collaborative prompt and distribute lane
  control with clear participation and moderation rules.
- **Participants** can add compact confirmed choices while seeing exactly how
  their carrier continues.
- **Wallet teams** can study safe UTXO isolation, multi-party signing, and
  post-signing validation.
- **Indexer teams** can test deterministic replay, reorganization handling,
  provisional mempool views, and state agreement.
- **Renderer teams** can explore visual, audio, tactile, and accessible
  interpretations of the same confirmed event graph.
- **Researchers** can evaluate hand-off behavior, failure rates, privacy,
  comprehension, and interoperability without a protocol incentive layer.

## Start with evidence

Read the [participant guide](./user-guide.md) or
[creator guide](./creator-guide.md), then use regtest. Developers should begin
with the [technical whitepaper](./technical-whitepaper.md),
[specification](../SPECIFICATION.md), and
[security model](./security-model.md). Run the published vectors and fixtures
and identify the exact commit under test.

ChainBloom v1 should be described as experimental. Mainnet use requires work
beyond a passing test suite: independent security review, wallet-integration
testing, indexer restore and reorg exercises, incident planning, and
product-specific legal review.
