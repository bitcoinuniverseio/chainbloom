import { ChainBloomError } from './errors.js';

const HEX_PATTERN = /^(?:[0-9a-fA-F]{2})*$/u;
const TXID_PATTERN = /^[0-9a-fA-F]{64}$/u;

export function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

export function hexToBytes(hex: string, field = 'hex'): Uint8Array {
  if (!HEX_PATTERN.test(hex)) {
    throw new ChainBloomError('INVALID_HEX', `${field} must be even-length hexadecimal`, {
      field,
    });
  }
  return Uint8Array.from(Buffer.from(hex, 'hex'));
}

export function normalizeTxid(txid: string, field = 'txid'): string {
  if (!TXID_PATTERN.test(txid)) {
    throw new ChainBloomError('INVALID_TXID', `${field} must be 32-byte hexadecimal`, {
      field,
    });
  }
  return txid.toLowerCase();
}

export function concatBytes(...chunks: readonly Uint8Array[]): Uint8Array {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export function writeU16BE(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
    throw new ChainBloomError(
      'INVALID_U16',
      'Value does not fit in an unsigned 16-bit integer',
      {
        value,
      },
    );
  }
  return Uint8Array.from([(value >>> 8) & 0xff, value & 0xff]);
}

export function readU16BE(bytes: Uint8Array, offset: number): number {
  const high = bytes[offset];
  const low = bytes[offset + 1];
  if (high === undefined || low === undefined) {
    throw new ChainBloomError('TRUNCATED_U16', 'Cannot read an unsigned 16-bit integer', {
      offset,
      length: bytes.length,
    });
  }
  return (high << 8) | low;
}

export function encodeAscii(value: string, field: string): Uint8Array {
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) > 0x7f) {
      throw new ChainBloomError('NON_ASCII_TEXT', `${field} must contain ASCII only`, {
        field,
      });
    }
  }
  return Uint8Array.from(Buffer.from(value, 'ascii'));
}

export function decodeAscii(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('ascii');
}

export function reverseBytes(bytes: Uint8Array): Uint8Array {
  return Uint8Array.from(bytes).reverse();
}

export function assertIntegerInRange(
  value: number,
  minimum: number,
  maximum: number,
  field: string,
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new ChainBloomError(
      'INTEGER_OUT_OF_RANGE',
      `${field} must be an integer from ${minimum} through ${maximum}`,
      { field, value, minimum, maximum },
    );
  }
}

export function jsonStringify(value: unknown, space = 2): string {
  return JSON.stringify(
    value,
    (_key, item: unknown) => (typeof item === 'bigint' ? item.toString() : item),
    space,
  );
}
