import { readFile } from 'node:fs/promises';

import { bytesToHex } from '../src/bytes.js';
import {
  decodeMarkerHex,
  encodeMarker,
  networkIdFromName,
  networkName,
} from '../src/codec.js';
import { NETWORK, type NetworkId } from '../src/constants.js';
import { ChainBloomError } from '../src/errors.js';
import { sha256Hex } from '../src/hash.js';
import type { OperationPayload } from '../src/types.js';

interface Vector {
  readonly network: NetworkId;
  readonly markerHex: string;
  readonly payload: OperationPayload;
}

describe('binary codec', () => {
  it('matches every valid interoperability vector', async () => {
    const vectors = JSON.parse(
      await readFile(new URL('../vectors/valid-markers.json', import.meta.url), 'utf8'),
    ) as unknown as readonly Vector[];
    for (const vector of vectors) {
      expect(bytesToHex(encodeMarker(vector.network, vector.payload))).toBe(
        vector.markerHex,
      );
      expect(decodeMarkerHex(vector.markerHex).payload).toEqual(vector.payload);
    }
  });

  it('round-trips network names', () => {
    expect(networkIdFromName('SIGNET')).toBe(NETWORK.SIGNET);
    expect(networkName(NETWORK.TESTNET4)).toBe('testnet4');
    expect(() => networkIdFromName('mars')).toThrow(ChainBloomError);
  });

  it('rejects malformed fields and payload lengths', () => {
    expect(() =>
      encodeMarker(NETWORK.REGTEST, {
        operation: 'CREATE',
        ruleset: 1,
        laneCount: 0,
        durationBlocks: 144,
        maxSteps: 1,
        seed: '00'.repeat(16),
        title: '',
      }),
    ).toThrow(/laneCount/u);
    expect(() =>
      encodeMarker(NETWORK.REGTEST, {
        operation: 'CREATE',
        ruleset: 1,
        laneCount: 1,
        durationBlocks: 144,
        maxSteps: 1,
        seed: '00'.repeat(16),
        title: 'bad!',
      }),
    ).toThrow(/title/u);
    expect(() => decodeMarkerHex('43424c4d01030203010203')).toThrow(/exactly 4/u);
  });

  it('preserves GRAFT txids in display byte order', () => {
    const target = Array.from({ length: 32 }, (_, index) =>
      index.toString(16).padStart(2, '0'),
    ).join('');
    const marker = encodeMarker(NETWORK.REGTEST, {
      operation: 'GRAFT',
      targetEventTxid: target,
      relation: 1,
      glyph: 2,
      palette: 3,
    });
    expect(bytesToHex(marker).slice(16, 80)).toBe(target);
    expect(decodeMarkerHex(bytesToHex(marker)).payload).toMatchObject({
      targetEventTxid: target,
    });
  });

  it('exposes deterministic hashing for downstream projections', () => {
    expect(sha256Hex(Buffer.from('abc'))).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });
});
