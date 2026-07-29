# Participant guide

ChainBloom is an experiment in collaborative, Bitcoin-confirmed state. You do
not buy a protocol token. You receive or create control of a 1,000-sat Taproot
carrier, then spend it in a precisely shaped transaction to add an event and
continue or close its lane.

## Safer first run

Use regtest for development and signet for a public trial. Use a wallet that can
lock and label UTXOs and can show every PSBT input/output. Create a dedicated
account or descriptor for carrier keys. Fund fees separately with native
SegWit. Back up the carrier key before receiving the lane.

For a `BLOOM` or `GRAFT`, wait until the current carrier's event has at least one
confirmation. Choose the creative fields, build the PSBT, and independently
check marker network and payload. Confirm the carrier is input zero and the new
1,000-sat P2TR carrier is output one. Fee inputs and change follow. Sign only
with DEFAULT/ALL sighash, broadcast, and treat the event as provisional until
confirmed.

A `RENDEZVOUS` needs both current carriers and usually both signers. The builder
sorts the lane IDs; output one must continue input zero's lane and output two
must continue input one's lane. It is collaboration, not a merge or transfer.

`CLOSE` intentionally ends a lane and creates no ChainBloom successor. An
ordinary or malformed spend also ends the Bitcoin UTXO, but the indexer calls
that lane abandoned. Neither action is reversible after confirmation except by
a Bitcoin reorganization.

## What the numbers mean

Glyph, palette, motion, magnitude, relation, bridge style, intensity, and close
reason are compact creative inputs. They do not encode rarity, yield, price, or
ownership rights beyond the spendable UTXO. Renderer appearance may differ.

## Recovery and support

There is no password reset, admin override, or protocol recovery. If a key is
lost before the world expires, the UTXO remains controlled by that key and the
lane cannot advance. Preserve your PSBTs and transaction IDs, but never send a
private key or seed phrase to a support person.
