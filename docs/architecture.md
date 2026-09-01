# How the ChainBloom experience comes together

> This page has moved. Read
> [Protocol architecture](https://bitcoinuniverseio.github.io/chainbloom/docs/reference/protocol-architecture/)
> for the current version, and
> [What is running today](https://bitcoinuniverseio.github.io/chainbloom/docs/help/status/)
> for the state of each part.

ChainBloom keeps four jobs apart.

## Creation

InScribe turns an idea into a guided flow. A creator shapes a world, previews
the paths, and sees the complete Bitcoin transaction before signing. This part
exists today at <https://inscribe.bitcoinuniverse.io/chainbloom>.

## Control

A ChainBloom path lives in one specific small Bitcoin output. A wallet should
recognise that output, keep it out of ordinary coin selection, and explain the
action being signed. No released wallet does this yet, so the person holding a
path has to keep it apart themselves. See
[what a wallet should do](https://bitcoinuniverseio.github.io/chainbloom/docs/reference/integration-wallets/).

## Shared history

Bitcoin confirms and orders contributions. A ChainBloom index reads that public
order and rebuilds each world from it, including meetings, completed paths, and
changes caused by a chain reorganization. The rules for doing that are in this
repository. A public index is not switched on yet.

## Creative interpretation

The confirmed history is common; the presentation is not fixed. One gallery may
show a botanical animation, another a soundscape, another a plain timeline. All
of them can be faithful to the same events.

Keeping these four jobs apart is what lets the history stay reliable while the
way it looks stays free.
