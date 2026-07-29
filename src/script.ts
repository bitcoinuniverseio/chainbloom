import {
  MAX_MARKER_BYTES,
  OP_RETURN,
  P2TR_SCRIPT_BYTES,
  PROTOCOL_MAGIC_BYTES,
} from './constants.js';
import { bytesToHex, hexToBytes } from './bytes.js';
import { ChainBloomError } from './errors.js';
import type { NativeSegwitType } from './types.js';

export function encodeMinimalOpReturn(marker: Uint8Array): Uint8Array {
  if (marker.length === 0 || marker.length > MAX_MARKER_BYTES) {
    throw new ChainBloomError(
      'INVALID_OP_RETURN_SIZE',
      `OP_RETURN pushed data must be 1..${MAX_MARKER_BYTES} bytes`,
    );
  }
  return Uint8Array.from([OP_RETURN, marker.length, ...marker]);
}

export function decodeMinimalOpReturn(script: Uint8Array): Uint8Array {
  if (script[0] !== OP_RETURN) {
    throw new ChainBloomError('NOT_OP_RETURN', 'Output is not OP_RETURN');
  }
  const pushedLength = script[1];
  if (
    pushedLength === undefined ||
    pushedLength === 0 ||
    pushedLength > MAX_MARKER_BYTES ||
    script.length !== pushedLength + 2
  ) {
    throw new ChainBloomError(
      'NON_MINIMAL_OP_RETURN',
      'Marker must use one exact minimal direct push with no trailing opcodes',
      { scriptLength: script.length, pushedLength },
    );
  }
  return script.slice(2);
}

export function extractOpReturnFirstPush(scriptHex: string): Uint8Array | null {
  const script = hexToBytes(scriptHex, 'scriptPubKey');
  if (script.length < 2 || script[0] !== OP_RETURN) return null;
  const pushOpcode = script[1]!;
  let length: number;
  let offset: number;
  if (pushOpcode >= 1 && pushOpcode <= 75) {
    length = pushOpcode;
    offset = 2;
  } else if (pushOpcode === 0x4c && script[2] !== undefined) {
    length = script[2];
    offset = 3;
  } else if (pushOpcode === 0x4d && script[2] !== undefined && script[3] !== undefined) {
    length = script[2] | (script[3] << 8);
    offset = 4;
  } else {
    return null;
  }
  if (script.length < offset + length) return null;
  return script.slice(offset, offset + length);
}

export function isPotentialChainBloomScript(scriptHex: string): boolean {
  const firstPush = extractOpReturnFirstPush(scriptHex);
  if (firstPush === null || firstPush.length < PROTOCOL_MAGIC_BYTES.length) return false;
  const possibleMagic = firstPush.slice(0, PROTOCOL_MAGIC_BYTES.length);
  return PROTOCOL_MAGIC_BYTES.every((value, index) => possibleMagic[index] === value);
}

export function isP2trScript(scriptHex: string): boolean {
  const script = hexToBytes(scriptHex, 'scriptPubKey');
  return script.length === P2TR_SCRIPT_BYTES && script[0] === 0x51 && script[1] === 0x20;
}

export function classifyNativeSegwit(scriptHex: string): NativeSegwitType | null {
  const script = hexToBytes(scriptHex, 'scriptPubKey');
  if (script.length === 22 && script[0] === 0x00 && script[1] === 0x14) return 'p2wpkh';
  if (script.length === 34 && script[0] === 0x00 && script[1] === 0x20) return 'p2wsh';
  if (isP2trScript(scriptHex)) return 'p2tr';
  return null;
}

export function p2trScriptHex(xOnlyPublicKey: Uint8Array): string {
  if (xOnlyPublicKey.length !== 32) {
    throw new ChainBloomError('INVALID_XONLY_KEY', 'P2TR output key must be 32 bytes');
  }
  return bytesToHex(Uint8Array.from([0x51, 0x20, ...xOnlyPublicKey]));
}
