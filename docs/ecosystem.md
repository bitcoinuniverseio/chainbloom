# The ChainBloom ecosystem

> This page has moved. Read
> [What is running today](https://bitcoinuniverseio.github.io/chainbloom/docs/help/status/)
> for a dated, checked account of every part.

ChainBloom is one shared creative history with several kinds of software around
it. Some of those parts exist now, and some do not. The list below says which is
which, because a plan should never be written as if it had already shipped.

## What exists

- **The protocol package** in this repository: the marker format, the
  transaction builders, the validator, the state engine with rollback, a
  deterministic renderer, a command line tool, and published test vectors.
- **InScribe** at <https://inscribe.bitcoinuniverse.io/chainbloom>, where a
  world is created and a contribution is built, reviewed, signed, and broadcast.

## What does not exist yet

- A public index that anyone can read confirmed worlds from.
- A wallet that recognises a ChainBloom path output and keeps it out of ordinary
  spending.
- A public browsing surface with timelines, profiles, bookmarks, watchlists, or
  notifications.
- A published npm package. The library is built from this repository.

## What anyone can build

Because the rules are deterministic, any service that follows them rebuilds the
same worlds. No gallery owns the history. A museum can pair an installation with
a lasting public record, a community can create a recurring ritual, an artist
can invite an audience into a bounded work, and a school can make ordering and
shared state something students handle rather than hear about.

The people who build the first of these decide what the conventions become. See
[Integration guides](https://bitcoinuniverseio.github.io/chainbloom/docs/reference/integration-wallets/)
to start.
