import { readFile } from 'node:fs/promises';

import { bytesToHex } from '../src/bytes.js';
import { decodeMarkerHex, encodeMarker } from '../src/codec.js';
import { ChainBloomError } from '../src/errors.js';
import type { OperationPayload } from '../src/types.js';
import type { NetworkId } from '../src/constants.js';

interface ValidVector {
  readonly name: string;
  readonly network: NetworkId;
  readonly markerHex: string;
  readonly payload: OperationPayload;
}

interface InvalidVector {
  readonly name: string;
  readonly markerHex: string;
  readonly errorCode: string;
}

async function json<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8')) as unknown as T;
}

const valid = await json<readonly ValidVector[]>('../vectors/valid-markers.json');
const invalid = await json<readonly InvalidVector[]>('../vectors/invalid-markers.json');

for (const vector of valid) {
  const decoded = decodeMarkerHex(vector.markerHex);
  const encoded = bytesToHex(encodeMarker(vector.network, vector.payload));
  if (decoded.operation !== vector.payload.operation || encoded !== vector.markerHex) {
    throw new Error(`Valid vector failed: ${vector.name}`);
  }
}

for (const vector of invalid) {
  try {
    decodeMarkerHex(vector.markerHex);
    throw new Error(`Invalid vector was accepted: ${vector.name}`);
  } catch (error) {
    if (!(error instanceof ChainBloomError) || error.code !== vector.errorCode) {
      throw new Error(`Invalid vector ${vector.name} returned the wrong error`, {
        cause: error,
      });
    }
  }
}

process.stdout.write(
  `Verified ${valid.length} valid and ${invalid.length} invalid marker vectors.\n`,
);
