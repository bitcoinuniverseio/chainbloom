# ChainBloom brand guidelines

These guidelines keep ChainBloom recognizable without overstating what the
protocol does. They apply to the reference project, release materials, social
cards, presentations, demos, press use, and third-party community work.

## Brand foundation

**Name:** ChainBloom

**Primary descriptor:** A Bitcoin-native fixed-lane UTXO relay protocol for
collaborative, confirmed creative state.

**Campaign line:** A living shared history on Bitcoin.

The campaign line describes an evolving event graph. It is not a permanence,
availability, biological life, or investment claim. Pair it with the primary
descriptor or an experimental-protocol label when the audience may not have
context.

### Promise

ChainBloom makes a small, shared Bitcoin history legible: fixed carrier lanes,
five compact actions, deterministic confirmed state, and open-ended rendering.
The voice should invite experimentation while being exact about the boundary
between Bitcoin consensus, ChainBloom validation, and third-party services.

### Personality

- **Precise, not sterile.** Explain carrier lineage and confirmation in plain
  language, then link to the normative specification.
- **Creative, not mystical.** Use garden and relay metaphors as orientation,
  not as substitutes for protocol facts.
- **Open, not inflated.** Welcome wallets, indexers, renderers, researchers,
  creators, and participants without claiming adoption.
- **Cautious, not alarmist.** State key loss, invalid-spend, reorg, privacy, and
  experimental-software risks directly.
- **Bitcoin-native, not financialized.** Treat miner fees and UTXOs accurately;
  never imply a ChainBloom asset economy.

## Messaging hierarchy

Use the shortest layer that gives the audience enough context.

### One line

> ChainBloom is a Bitcoin-native fixed-lane UTXO relay protocol for
> collaborative, confirmed creative state.

### Short explanation

> A ChainBloom world begins with one to eight 1,000-satoshi Taproot carrier
> lanes. Valid confirmed transactions add compact creative events and continue
> or close those lanes. Independent indexers reconstruct the same history from
> Bitcoin data.

### Required experimental qualifier

On a first product page, press release, wallet opt-in, or demo introduction,
include:

> Experimental v1 protocol and reference implementation. No token, reward,
> royalty, protocol fee, or official marketplace.

For signing surfaces, use the stronger safety copy from the
[participant guide](./user-guide.md) rather than a marketing summary.

## Names and terminology

Write **ChainBloom** as one word with capital C and B. Use `CBLM` only for the
four-byte protocol identifier or in technical contexts. The version is
**ChainBloom v1**, not "ChainBloom 1.0" until a release explicitly adopts that
product version.

Preferred nouns are **world**, **lane**, **carrier**, **event**, **successor**,
and **renderer**. Use the operation names `CREATE`, `BLOOM`, `GRAFT`,
`RENDEZVOUS`, and `CLOSE` in code style or uppercase in protocol-facing text.

Avoid **mint**, **holder rewards**, **asset**, **collectible**, **ownership
token**, **floor price**, **yield**, **royalty**, **liquidity**, and **market**
when describing the protocol. "Carrier holder" is acceptable only when the
text immediately makes clear that control means the ability to spend a UTXO,
not legal title or a protocol balance. Prefer "participant who controls the
current carrier."

Do not call a `GRAFT` a transfer or merge. Do not call a `RENDEZVOUS` a swap,
pool, sale, or ownership combination. Do not describe an ordinary carrier-key
handoff as a protocol transfer operation; v1 defines none.

## Visual identity

The visual system joins a technical transaction graph with an organic bloom.
The two stems represent distinct lanes that can meet while continuing as
distinct lineages. Nodes suggest confirmed events; the flower suggests a
renderer interpretation rather than a consensus symbol.

### Core palette

| Role              | Name       | Hex       | Typical use                                     |
| ----------------- | ---------- | --------- | ----------------------------------------------- |
| Primary dark      | Deep Ink   | `#07111F` | Background, mark field, high-contrast dark text |
| Secondary dark    | Ink Soft   | `#0D1B2D` | Panels and depth                                |
| Primary light     | Warm Paper | `#F3F0E8` | Main light text and light surfaces              |
| Lane accent       | Mint       | `#7EE0BD` | Primary lane, safe action, technical emphasis   |
| Meeting accent    | Coral      | `#FF8B70` | Secondary lane, warnings, human emphasis        |
| Bloom accent      | Sun        | `#F4CC62` | Bloom, confirmed highlight, restrained callout  |
| Supporting accent | Blue       | `#72AEF8` | Optional diagrams and secondary data            |

Warm Paper on Deep Ink is the default high-contrast pair. Check WCAG contrast
for every new combination and state; the palette does not excuse unreadable
small text. Mint, Coral, Sun, and Blue are accents, not body-text defaults.
Never use color alone to distinguish lane status, validity, confirmation, or
risk. Add labels, shapes, patterns, or icons.

### Typography

Use Georgia or a compatible editorial serif for expressive display headings.
Use Inter or a system sans-serif stack for interface copy and body text. Use a
monospace face for txids, outpoints, marker bytes, and operation fields. Do not
compress transaction identifiers into decorative textures when a reader needs
to verify them.

### Graphic language

Prefer restrained line work, discrete nodes, lane continuity, generous dark
space, and one clearly legible bloom or meeting point. Technical diagrams may
use exact arrows and output labels. Campaign art may be more abstract but
should still show lanes continuing through an interaction rather than melting
into one asset.

Avoid generic neon cryptocurrency imagery, piles of coins, price charts,
trading screens, rockets, luxury cues, token badges, or implied Bitcoin
endorsement. Do not place a Bitcoin currency symbol where viewers could mistake
it for a ChainBloom token symbol.

## Brand implementation and local media

The public site's compact bloom and wordmark are implemented directly in HTML
and CSS so the source repository remains code-only. Exported logos, screenshots,
Open Graph cards, press images, and social-media derivatives are deliberately
not versioned here. Keep local working and rendered copies under the
repository-root `media/` directory, which is ignored by Git, and distribute an
approved media packet separately from a tagged source release.

Record the source release, dimensions, format, creator, license, review date,
and checksum alongside any separately distributed media packet. Do not label a
redrawn, recolored, sharpened, cropped, or generatively edited derivative as an
official project asset without a fresh review.

### Logo clear space and sizing

Keep clear space around the full logo equal to at least one quarter of the
mark's displayed height. Around the square mark, keep at least one eighth of
its width clear. Do not place either asset against a background that obscures
the Deep Ink field or Warm Paper wordmark.

As a practical minimum, display the full logo at least 141 CSS pixels wide on
screen and 30 millimeters wide in print. Display the square mark at least 24
CSS pixels or 8 millimeters. At smaller sizes, use the square mark and provide
the name in accessible text.

Keep the original aspect ratio. Do not rotate, skew, crop through the mark,
separate the bloom from its stems, add a token ticker, append a partner name
inside the lockup, or animate the mark in a way that suggests unconfirmed state
is confirmed.

### Social and press image usage

Use an approved 1.91:1 landscape card uncropped when a platform accepts it. If
a platform forces a square or vertical crop, create a separately reviewed
derivative rather than letting an automatic center crop remove the name or lane
endpoints. Label derivatives with their dimensions and keep the source file in
the ignored local `media/` workspace.

Recommended alt text:

> ChainBloom. A living shared history on Bitcoin. Two parallel event lanes meet
> at a geometric bloom and continue.

Do not use the social image as proof of a deployment, partnership, audit,
adoption level, or Bitcoin endorsement. Place release-specific facts in the
post or caption, not inside an unversioned image.

For press packets, provide the separately managed approved media, this guide, the
[litepaper](./litepaper.md), the [technical whitepaper](./technical-whitepaper.md),
the [launch and media kit](./launch-media-kit.md), the MIT license, and a link
to the exact release commit or tag. A publication may resize the assets for
layout, but should not alter the mark or imply project endorsement of its
coverage.

## Voice examples

### Preferred

> BLOOM advances one confirmed carrier lane with compact creative parameters.
> The renderer decides how those parameters look.

> ChainBloom v1 is experimental. Try the reference flow on regtest or signet
> and verify the complete transaction before broadcast.

> A hosted gallery is one view of the public event graph; it is not the
> protocol's owner or source of consensus.

### Avoid

> Mint a rare ChainBloom and earn as it grows.

> Own permanent art secured forever by Bitcoin.

> Trade lanes in the official ChainBloom market.

> Audited, production-ready, and trusted by creators everywhere.

The avoided examples introduce capabilities or evidence the protocol does not
have. Replace superlatives with a link to reproducible evidence: specification,
commit, test result, security report, or deployment status.

## Partners, communities, and attribution

Third parties may accurately say "built with ChainBloom" or "compatible with
ChainBloom v1" when they identify the implementation version and have tested
against the normative vectors. Compatibility does not imply endorsement. Use a
small unmodified mark beside the statement; do not combine logos into a new
ChainBloom lockup.

Community art inspired by the visual system should be labeled "community
art," include creator attribution and license, and avoid using the official
wordmark in a way that makes the work look like a protocol release. Keep legal
names, copyright, and trademark notices supplied with third-party assets.

## Accessibility and localization

Every meaningful image needs alt text. Videos need captions and a transcript;
livestreams should expose questions in text. Diagrams should explain lane
ordering and status without relying on animation. Respect reduced-motion
preferences and preserve focus indicators.

Localize meaning, not protocol tokens. Do not translate `CBLM`, operation
names in transaction displays, byte-field names, txids, or lane IDs. A
localized explanation may follow the canonical term. Have a technically
informed native speaker review translations of confirmation, carrier, close,
abandonment, expiry, and reorganization.

## Review checklist

Before publishing branded material, confirm that it:

- uses the name and official asset without alteration;
- labels v1 as experimental and distinguishes protocol from hosted services;
- makes no unsupported deployment, adoption, audit, performance, or legal
  claim;
- does not introduce a token, protocol fee, reward, royalty, public mint,
  transfer/trade primitive, or official marketplace;
- distinguishes confirmed state from mempool projections and renderer output;
- includes meaningful alt text, captions, and sufficient contrast;
- links technical claims to the specification or exact release evidence; and
- has product-specific legal and security review where the context requires it.
