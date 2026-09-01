# The technical story of ChainBloom

> This page has moved. The
> [technical reference](https://bitcoinuniverseio.github.io/chainbloom/docs/reference/)
> now carries the exact rules, byte layouts, data structures, error codes, and
> test vectors. This page keeps the plain-language account.

## Design goal

ChainBloom creates a shared creative history that independent observers can
reconstruct from confirmed Bitcoin transactions. It keeps shared agreement
small and leaves visual, musical, and social interpretation open.

## Worlds and paths

A world begins once and contains a fixed set of paths. Each path is represented
by a small Bitcoin output controlled by its current participant. A valid
contribution consumes the current output and creates the next one, producing a
clear lineage rather than an ambiguous collection of messages.

The world also has a bounded duration and contribution limit. These boundaries
make costs, participation, and completion understandable from the beginning.

## Five creative actions

- **Create** begins the world and its paths.
- **Bloom** adds a compact expressive choice to one path.
- **Echo** points back to an earlier confirmed moment.
- **Meet** connects two paths in one shared moment while both continue.
- **Close** completes one path without a successor.

The names seen in creative experiences can vary, but the meaning of each action
remains stable across compatible services.

## Confirmation and lineage

Only confirmed parents can become part of confirmed history. This keeps the
ordering clear and prevents two unconfirmed steps from pretending to be a
settled chain. Unconfirmed contributions can still appear as previews, but they
remain visibly provisional.

If a confirmed Bitcoin transaction spends a live path without continuing it in
a valid ChainBloom action, that path ends. This fail-closed behavior avoids
inventing history after the controlling output is gone.

## Meetings without merging

A meeting consumes the current outputs of two paths and creates one successor
for each. The paths acknowledge a shared moment while preserving their own
lineage. It is collaboration, not a swap, sale, or transfer of a ChainBloom
asset.

## Reorganizations

Bitcoin can occasionally replace its newest blocks. ChainBloom views remove
events from the displaced branch and replay the resulting confirmed order.
Because the rules are deterministic, independent services can return to the
same history.

## Presentation is intentionally open

The shared history describes actions, relationships, timing, and compact
creative parameters. It does not canonize pixels, audio, layout, profiles,
moderation, or hosting. This makes ChainBloom durable as a medium while giving
artists room to create experiences that do not all look alike.

## Safety properties

Every contribution is a real Bitcoin spend. A careful wallet protects live
path outputs from ordinary spending and presents the complete transaction
before signing. Confirmed actions cannot be undone by ChainBloom, and control
of a path does not by itself prove identity, authorship, copyright, or legal
ownership.

## Economic boundaries

ChainBloom has no project token, balance ledger, reward, royalty, public mint,
protocol price, or official trading market. Sustainable activity comes from
valuable experiences around the medium: art, curation, education, exhibitions,
accessibility, hosting, and community support.
