# World creator guide

A creator chooses a 16-byte seed, an ASCII title, lane count, duration, and
maximum creative steps. These bounds are permanent properties of the world.
They do not grant the creator ongoing control over distributed carriers.

## Design choices

- More lanes enable parallel participation but require more carrier outputs and
  careful distribution.
- Duration is measured in confirmed block heights, not wall-clock promises.
  The end height is exclusive.
- `max_steps` bounds each lane separately; rendezvous advances both.
- The seed should be random if unpredictable rendering is desired. It is public,
  not a secret and not a wallet seed.
- Titles are 0..32 bytes from the restricted ASCII alphabet; keep them useful
  without including personal information or third-party marks.

Generate a fresh P2TR output key for each root. Build `CREATE` with fee inputs
first in the PSBT input list, while the transaction outputs remain marker zero,
then roots one through N, then change. Confirm every root is exactly 1,000 sats.
After confirmation, record the world txid and distribute control of root keys or
subsequent carrier keys through a secure channel.

Publish participation rules separately and state clearly that they are social,
not protocol-enforced. Avoid prize, investment-return, resale-price, or token
language without qualified legal review. Have a moderation and incident plan
for any public renderer or community service.
