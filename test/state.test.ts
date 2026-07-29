import { ChainBloomState, MempoolOverlay } from '../src/state.js';
import { NETWORK } from '../src/constants.js';
import type { IndexedBlock } from '../src/types.js';
import { fixtureBlock, loadFixtures } from './fixtures.js';

describe('deterministic confirmed state', () => {
  it('replays the golden chain and rolls back exactly', async () => {
    const fixtures = await loadFixtures();
    const state = new ChainBloomState({ network: NETWORK.REGTEST });
    const applied = state.replay(fixtures.map(fixtureBlock));
    expect(applied.every((block) => block.transactions[0]?.validProtocolEvent)).toBe(true);
    const snapshot = state.snapshot();
    expect(snapshot.events.map((event) => event.operation)).toEqual([
      'CREATE',
      'BLOOM',
      'GRAFT',
      'RENDEZVOUS',
      'CLOSE',
    ]);
    expect(snapshot.worlds[0]?.status).toBe('ACTIVE');
    expect(
      snapshot.lanes.map((lane) => [lane.laneNumber, lane.status, lane.stepCount]),
    ).toEqual([
      [0, 'CLOSED', 3],
      [1, 'LIVE', 1],
    ]);
    const removed = state.rollbackTip(fixtures.at(-1)?.blockHash);
    expect(removed.height).toBe(104);
    expect(state.snapshot().lanes[0]?.status).toBe('LIVE');
    state.applyBlock(fixtureBlock(fixtures.at(-1)!));
    expect(state.snapshot()).toEqual(snapshot);
  });

  it('rejects a same-block child and abandons the spent lane', async () => {
    const [create, bloom] = await loadFixtures();
    const block: IndexedBlock = {
      hash: create!.blockHash,
      previousHash: null,
      height: create!.height,
      transactions: [
        fixtureBlock(create!).transactions[0]!,
        fixtureBlock(bloom!).transactions[0]!,
      ],
    };
    const state = new ChainBloomState({ network: NETWORK.REGTEST });
    const applied = state.applyBlock(block);
    expect(applied.transactions[1]?.issueCodes).toContain('UNCONFIRMED_LINEAGE_PARENT');
    expect(state.snapshot().lanes[0]?.status).toBe('ABANDONED');
  });

  it('keeps mempool state provisional and reports conflicts', async () => {
    const [create, bloom] = await loadFixtures();
    const state = new ChainBloomState({ network: NETWORK.REGTEST });
    state.applyBlock(fixtureBlock(create!));
    const overlay = new MempoolOverlay(state);
    const transaction = fixtureBlock(bloom!).transactions[0]!;
    const first = overlay.project(transaction);
    const second = overlay.project(transaction);
    expect(first.valid).toBe(true);
    expect(second.conflictsWith).toEqual([]);
    expect(state.snapshot().events).toHaveLength(1);
    expect(overlay.list()).toHaveLength(1);
    expect(overlay.remove(first.txid)).toBe(true);
  });

  it('expires live lanes at the exclusive end height', async () => {
    const [create] = await loadFixtures();
    const state = new ChainBloomState({ network: NETWORK.REGTEST });
    state.applyBlock(fixtureBlock(create!));
    let previousHash = create!.blockHash;
    for (let height = 101; height <= 244; height += 1) {
      const hash = height.toString(16).padStart(64, '0');
      state.applyBlock({ hash, previousHash, height, transactions: [] });
      previousHash = hash;
    }
    expect(state.snapshot().worlds[0]?.status).toBe('EXPIRED');
    expect(state.snapshot().lanes.every((lane) => lane.status === 'EXPIRED')).toBe(true);
  });
});
