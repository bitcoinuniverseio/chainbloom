import fc from 'fast-check';

import { bytesToHex } from '../src/bytes.js';
import { decodeMarker, encodeMarker } from '../src/codec.js';
import { NETWORK } from '../src/constants.js';
import { ChainBloomError } from '../src/errors.js';

describe('property and fuzz-style checks', () => {
  it('round-trips every valid BLOOM tuple', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 31 }),
        fc.integer({ min: 0, max: 15 }),
        fc.integer({ min: 0, max: 7 }),
        fc.integer({ min: 0, max: 255 }),
        (glyph, palette, motion, magnitude) => {
          const payload = {
            operation: 'BLOOM' as const,
            glyph,
            palette,
            motion,
            magnitude,
          };
          expect(decodeMarker(encodeMarker(NETWORK.SIGNET, payload)).payload).toEqual(
            payload,
          );
        },
      ),
    );
  });

  it('round-trips bounded CREATE values and titles', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 8 }),
        fc.integer({ min: 144, max: 52_560 }),
        fc.integer({ min: 1, max: 512 }),
        fc.stringMatching(/^[A-Za-z0-9 ._:-]{0,32}$/u),
        fc.uint8Array({ minLength: 16, maxLength: 16 }),
        (laneCount, durationBlocks, maxSteps, title, seed) => {
          const payload = {
            operation: 'CREATE' as const,
            ruleset: 1 as const,
            laneCount,
            durationBlocks,
            maxSteps,
            title,
            seed: bytesToHex(seed),
          };
          expect(decodeMarker(encodeMarker(NETWORK.REGTEST, payload)).payload).toEqual(
            payload,
          );
        },
      ),
      { numRuns: 200 },
    );
  });

  it('never leaks unexpected exceptions for arbitrary marker bytes', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 100 }), (bytes) => {
        try {
          const decoded = decodeMarker(bytes);
          expect(encodeMarker(decoded.network, decoded.payload)).toEqual(bytes);
        } catch (error) {
          expect(error).toBeInstanceOf(ChainBloomError);
        }
      }),
      { numRuns: 2_000 },
    );
  });
});
