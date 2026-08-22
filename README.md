# ChainBloom

ChainBloom is a shared creative experience carried by Bitcoin. People open
bounded worlds, add expressive moments, let paths meet, and come back later to
see how the history has grown.

**Documentation: <https://bitcoinuniverse.github.io/chainbloom/docs/>**

This repository holds the protocol: the marker format, the transaction
builders, the validator, the state engine, the command line tool, the published
test vectors, and the public site.

Repository, site, and package checks run through PowerShell on the shared
`universe-ci` pool, allowing the same trusted revision to use certified Linux
or Windows workers. Fork pull requests cannot execute on private runners.

## Why ChainBloom is shaped this way

- **Shared without becoming chaotic.** Each participant follows a distinct
  path, so collaboration stays readable even when stories connect.
- **Bitcoin provides the order.** Confirmations give everyone the same public
  sequence for creative moments, with no referee.
- **Interpretation stays open.** The history is stable while galleries can
  present it in many ways.
- **Every world has shape.** A world has a beginning, an arc, and an ending
  instead of an endless feed.
- **People keep control.** Every contribution is a real Bitcoin transaction the
  person reviews and signs themselves.

ChainBloom has no project token, reward scheme, royalty engine, public mint,
price mechanic, or official trading market. Its purpose is collaborative
creation and shared memory.

## The five actions

1. **Create** opens a world and its paths.
2. **Bloom** adds one creative moment to a path.
3. **Echo** adds a moment that points back at an earlier one.
4. **Meet** lets two paths share a moment while both continue.
5. **Complete** ends a path on purpose.

## What is running today

The protocol package builds and passes its tests and its published vectors. The
creation flow exists inside [InScribe](https://inscribe.bitcoinuniverse.io/chainbloom).
A public read index is not switched on yet, no released wallet recognises
ChainBloom path outputs, and the package is not published to npm.
[What is running today](https://bitcoinuniverse.github.io/chainbloom/docs/help/status/)
keeps that list current.

## Use the package

```bash
git clone https://github.com/bitcoinuniverse/chainbloom.git
cd chainbloom
npm ci
npm run build
node dist/cli.js vectors verify
```

Node 24.19.0 and npm 11.17.0 are required. See the
[SDK guide](https://bitcoinuniverse.github.io/chainbloom/docs/reference/sdk/) and
the [CLI reference](https://bitcoinuniverse.github.io/chainbloom/docs/reference/cli/).

## Develop

```bash
npm ci
npm run ci
```

`npm run ci` runs lint, type checking, tests with coverage, the package build,
the interoperability vectors, the documentation build, and the site and
documentation checks. To preview the site exactly as GitHub Pages serves it:

```bash
npm run build && npm run build:docs && npm run serve:docs
```

## Bitcoin safety

A ChainBloom contribution is a real Bitcoin transaction. It costs a network fee
and cannot be undone after confirmation. Review the complete transaction before
signing, never share a seed phrase, and keep a live path output away from
ordinary spending. Unconfirmed activity is a preview; confirmed history is the
shared record.

ChainBloom is open source under the MIT License.
