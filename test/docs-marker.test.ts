import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { bytesToHex as packageBytesToHex } from '../src/bytes.js';
import { encodeMarker as packageEncodeMarker } from '../src/codec.js';
import type { NetworkId } from '../src/constants.js';
import type { OperationPayload } from '../src/types.js';
import {
  LIMITS,
  MAX_MARKER_BYTES,
  bytesToHex,
  encodeMarker,
  estimateVirtualSize,
} from '../site/assets/marker.mjs';

interface Vector {
  readonly name: string;
  readonly network: NetworkId;
  readonly markerHex: string;
  readonly payload: OperationPayload;
}

const vectors = JSON.parse(
  readFileSync(new URL('../vectors/valid-markers.json', import.meta.url), 'utf8'),
) as Vector[];

/**
 * The documentation ships its own encoder so the marker figure can run in a
 * browser with no bundler. These tests are what stop it from drifting away
 * from the package: if the two ever disagree, the build fails.
 */
describe('the encoder used by the documentation figures', () => {
  it.each(vectors)('matches the published vector "$name"', (vector) => {
    const encoded = encodeMarker(vector.network, vector.payload);
    expect(bytesToHex(encoded.bytes)).toBe(vector.markerHex);
  });

  it.each(vectors)('matches the package encoder for "$name"', (vector) => {
    const fromDocs = bytesToHex(encodeMarker(vector.network, vector.payload).bytes);
    const fromPackage = packageBytesToHex(
      packageEncodeMarker(vector.network, vector.payload),
    );
    expect(fromDocs).toBe(fromPackage);
  });

  it('describes every byte it produced exactly once', () => {
    for (const vector of vectors) {
      const encoded = encodeMarker(vector.network, vector.payload);
      const covered = encoded.fields.reduce((total, field) => total + field.length, 0);
      expect(covered).toBe(encoded.bytes.length);
      let cursor = 0;
      for (const field of encoded.fields) {
        expect(field.start).toBe(cursor);
        cursor += field.length;
      }
    }
  });

  it('refuses values the protocol would reject', () => {
    expect(() =>
      encodeMarker(0, {
        operation: 'BLOOM',
        glyph: 32,
        palette: 0,
        motion: 0,
        magnitude: 0,
      }),
    ).toThrow(/glyph/u);
    expect(() => encodeMarker(9 as NetworkId, { operation: 'CLOSE', reason: 0 })).toThrow(
      /reserved/u,
    );
    expect(() =>
      encodeMarker(0, {
        operation: 'CREATE',
        ruleset: 1,
        laneCount: 9,
        durationBlocks: 144,
        maxSteps: 1,
        seed: '000102030405060708090a0b0c0d0e0f',
        title: '',
      }),
    ).toThrow(/laneCount/u);
    expect(() =>
      encodeMarker(0, {
        operation: 'CREATE',
        ruleset: 1,
        laneCount: 1,
        durationBlocks: 144,
        maxSteps: 1,
        seed: '000102030405060708090a0b0c0d0e0f',
        title: 'no commas, please',
      }),
    ).toThrow(/title/u);
  });

  it('keeps the same limits as the package', () => {
    expect(MAX_MARKER_BYTES).toBe(72);
    expect(LIMITS.laneCount).toEqual([1, 8]);
    expect(LIMITS.durationBlocks).toEqual([144, 52_560]);
    expect(LIMITS.maxSteps).toEqual([1, 512]);
  });
});

describe('the size estimate shown on the fees page', () => {
  it('grows with each extra input and output', () => {
    const bloom = estimateVirtualSize({ carriers: 1, successors: 1, feeInputs: 1 });
    const meeting = estimateVirtualSize({ carriers: 2, successors: 2, feeInputs: 1 });
    const close = estimateVirtualSize({ carriers: 1, successors: 0, feeInputs: 1 });
    expect(close).toBeLessThan(bloom);
    expect(bloom).toBeLessThan(meeting);
  });

  it('stays in the range a real ChainBloom transaction occupies', () => {
    const bloom = estimateVirtualSize({ carriers: 1, successors: 1, feeInputs: 1 });
    expect(bloom).toBeGreaterThan(150);
    expect(bloom).toBeLessThan(400);
  });
});
