import {
  HEADER_BYTES,
  MAX_BRIDGE_STYLE,
  MAX_GLYPH,
  MAX_LANES,
  MAX_MARKER_BYTES,
  MAX_MAX_STEPS,
  MAX_MOTION,
  MAX_PALETTE,
  MAX_RELATION,
  MAX_TITLE_BYTES,
  MAX_DURATION_BLOCKS,
  MIN_DURATION_BLOCKS,
  MIN_LANES,
  MIN_MAX_STEPS,
  NETWORK,
  NETWORK_NAME,
  OPCODE,
  OPERATION_NAME,
  PROTOCOL_MAGIC,
  PROTOCOL_MAGIC_BYTES,
  PROTOCOL_VERSION,
  RULESET_VERSION,
  SEED_BYTES,
  TITLE_PATTERN,
  TXID_BYTES,
  type NetworkId,
  type NetworkName,
  type Opcode,
} from './constants.js';
import {
  assertIntegerInRange,
  bytesToHex,
  concatBytes,
  decodeAscii,
  encodeAscii,
  hexToBytes,
  normalizeTxid,
  readU16BE,
  writeU16BE,
} from './bytes.js';
import { ChainBloomError } from './errors.js';
import type {
  BloomPayload,
  ClosePayload,
  CreatePayload,
  DecodedMarker,
  GraftPayload,
  OperationPayload,
  RendezvousPayload,
} from './types.js';

const NETWORK_IDS = new Set<number>(Object.values(NETWORK));
const OPCODES = new Set<number>(Object.values(OPCODE));

export function isNetworkId(value: number): value is NetworkId {
  return NETWORK_IDS.has(value);
}

export function networkIdFromName(name: string): NetworkId {
  const normalized = name.toLowerCase();
  for (const [id, candidate] of Object.entries(NETWORK_NAME)) {
    if (candidate === normalized) return Number(id) as NetworkId;
  }
  throw new ChainBloomError('UNKNOWN_NETWORK_NAME', `Unknown ChainBloom network: ${name}`);
}

export function networkName(network: NetworkId): NetworkName {
  return NETWORK_NAME[network];
}

function validateCreate(payload: CreatePayload): Uint8Array {
  if (payload.ruleset !== RULESET_VERSION) {
    throw new ChainBloomError('UNSUPPORTED_RULESET', 'CREATE ruleset must be 1');
  }
  assertIntegerInRange(payload.laneCount, MIN_LANES, MAX_LANES, 'laneCount');
  assertIntegerInRange(
    payload.durationBlocks,
    MIN_DURATION_BLOCKS,
    MAX_DURATION_BLOCKS,
    'durationBlocks',
  );
  assertIntegerInRange(payload.maxSteps, MIN_MAX_STEPS, MAX_MAX_STEPS, 'maxSteps');
  const seed = hexToBytes(payload.seed, 'seed');
  if (seed.length !== SEED_BYTES) {
    throw new ChainBloomError('INVALID_SEED_LENGTH', `seed must be ${SEED_BYTES} bytes`);
  }
  const title = encodeAscii(payload.title, 'title');
  if (title.length > MAX_TITLE_BYTES || !TITLE_PATTERN.test(payload.title)) {
    throw new ChainBloomError(
      'INVALID_TITLE',
      'title must be 0..32 ASCII bytes from [A-Za-z0-9 ._:-]',
    );
  }
  return concatBytes(
    Uint8Array.from([payload.ruleset, payload.laneCount]),
    writeU16BE(payload.durationBlocks),
    writeU16BE(payload.maxSteps),
    seed,
    Uint8Array.from([title.length]),
    title,
  );
}

function validateBloom(payload: BloomPayload): Uint8Array {
  assertIntegerInRange(payload.glyph, 0, MAX_GLYPH, 'glyph');
  assertIntegerInRange(payload.palette, 0, MAX_PALETTE, 'palette');
  assertIntegerInRange(payload.motion, 0, MAX_MOTION, 'motion');
  assertIntegerInRange(payload.magnitude, 0, 0xff, 'magnitude');
  return Uint8Array.from([
    payload.glyph,
    payload.palette,
    payload.motion,
    payload.magnitude,
  ]);
}

function validateGraft(payload: GraftPayload): Uint8Array {
  const target = hexToBytes(normalizeTxid(payload.targetEventTxid, 'targetEventTxid'));
  assertIntegerInRange(payload.relation, 0, MAX_RELATION, 'relation');
  assertIntegerInRange(payload.glyph, 0, MAX_GLYPH, 'glyph');
  assertIntegerInRange(payload.palette, 0, MAX_PALETTE, 'palette');
  return concatBytes(
    target,
    Uint8Array.from([payload.relation, payload.glyph, payload.palette]),
  );
}

function validateRendezvous(payload: RendezvousPayload): Uint8Array {
  assertIntegerInRange(payload.bridgeStyle, 0, MAX_BRIDGE_STYLE, 'bridgeStyle');
  assertIntegerInRange(payload.glyph, 0, MAX_GLYPH, 'glyph');
  assertIntegerInRange(payload.palette, 0, MAX_PALETTE, 'palette');
  assertIntegerInRange(payload.intensity, 0, 0xff, 'intensity');
  return Uint8Array.from([
    payload.bridgeStyle,
    payload.glyph,
    payload.palette,
    payload.intensity,
  ]);
}

function validateClose(payload: ClosePayload): Uint8Array {
  assertIntegerInRange(payload.reason, 0, 0xff, 'reason');
  return Uint8Array.from([payload.reason]);
}

function opcodeAndPayload(payload: OperationPayload): {
  readonly opcode: Opcode;
  readonly bytes: Uint8Array;
} {
  switch (payload.operation) {
    case 'CREATE':
      return { opcode: OPCODE.CREATE, bytes: validateCreate(payload) };
    case 'BLOOM':
      return { opcode: OPCODE.BLOOM, bytes: validateBloom(payload) };
    case 'GRAFT':
      return { opcode: OPCODE.GRAFT, bytes: validateGraft(payload) };
    case 'RENDEZVOUS':
      return { opcode: OPCODE.RENDEZVOUS, bytes: validateRendezvous(payload) };
    case 'CLOSE':
      return { opcode: OPCODE.CLOSE, bytes: validateClose(payload) };
  }
}

export function encodeMarker(network: NetworkId, payload: OperationPayload): Uint8Array {
  if (!isNetworkId(network)) {
    throw new ChainBloomError(
      'RESERVED_NETWORK',
      `Network byte ${String(network)} is reserved`,
    );
  }
  const encoded = opcodeAndPayload(payload);
  const result = concatBytes(
    PROTOCOL_MAGIC_BYTES,
    Uint8Array.from([PROTOCOL_VERSION, network, encoded.opcode, encoded.bytes.length]),
    encoded.bytes,
  );
  if (result.length > MAX_MARKER_BYTES) {
    throw new ChainBloomError(
      'MARKER_TOO_LARGE',
      `Marker exceeds ${MAX_MARKER_BYTES} bytes`,
      { length: result.length },
    );
  }
  return result;
}

function requirePayloadLength(
  payload: Uint8Array,
  expected: number,
  operation: string,
): void {
  if (payload.length !== expected) {
    throw new ChainBloomError(
      'INVALID_PAYLOAD_LENGTH',
      `${operation} payload must be exactly ${expected} bytes`,
      { expected, actual: payload.length },
    );
  }
}

function decodeCreate(payload: Uint8Array): CreatePayload {
  if (payload.length < 23) {
    throw new ChainBloomError('INVALID_PAYLOAD_LENGTH', 'CREATE payload is truncated');
  }
  const ruleset = payload[0];
  const laneCount = payload[1];
  const titleLength = payload[22];
  if (ruleset !== RULESET_VERSION || laneCount === undefined || titleLength === undefined) {
    throw new ChainBloomError('INVALID_CREATE', 'CREATE contains invalid fixed fields');
  }
  if (payload.length !== 23 + titleLength) {
    throw new ChainBloomError('INVALID_TITLE_LENGTH', 'CREATE title length is not exact', {
      titleLength,
      payloadLength: payload.length,
    });
  }
  const result: CreatePayload = {
    operation: 'CREATE',
    ruleset,
    laneCount,
    durationBlocks: readU16BE(payload, 2),
    maxSteps: readU16BE(payload, 4),
    seed: bytesToHex(payload.slice(6, 22)),
    title: decodeAscii(payload.slice(23)),
  };
  validateCreate(result);
  return result;
}

function decodeBloom(payload: Uint8Array): BloomPayload {
  requirePayloadLength(payload, 4, 'BLOOM');
  const result: BloomPayload = {
    operation: 'BLOOM',
    glyph: payload[0]!,
    palette: payload[1]!,
    motion: payload[2]!,
    magnitude: payload[3]!,
  };
  validateBloom(result);
  return result;
}

function decodeGraft(payload: Uint8Array): GraftPayload {
  requirePayloadLength(payload, TXID_BYTES + 3, 'GRAFT');
  const result: GraftPayload = {
    operation: 'GRAFT',
    targetEventTxid: bytesToHex(payload.slice(0, TXID_BYTES)),
    relation: payload[32]!,
    glyph: payload[33]!,
    palette: payload[34]!,
  };
  validateGraft(result);
  return result;
}

function decodeRendezvous(payload: Uint8Array): RendezvousPayload {
  requirePayloadLength(payload, 4, 'RENDEZVOUS');
  const result: RendezvousPayload = {
    operation: 'RENDEZVOUS',
    bridgeStyle: payload[0]!,
    glyph: payload[1]!,
    palette: payload[2]!,
    intensity: payload[3]!,
  };
  validateRendezvous(result);
  return result;
}

function decodeClose(payload: Uint8Array): ClosePayload {
  requirePayloadLength(payload, 1, 'CLOSE');
  return { operation: 'CLOSE', reason: payload[0]! };
}

export function decodeMarker(bytes: Uint8Array): DecodedMarker {
  if (bytes.length < HEADER_BYTES) {
    throw new ChainBloomError(
      'TRUNCATED_HEADER',
      'ChainBloom marker is shorter than 8 bytes',
    );
  }
  if (PROTOCOL_MAGIC_BYTES.some((value, index) => value !== bytes[index])) {
    throw new ChainBloomError('INVALID_MAGIC', `Marker magic must be ${PROTOCOL_MAGIC}`);
  }
  if (bytes.length > MAX_MARKER_BYTES) {
    throw new ChainBloomError(
      'MARKER_TOO_LARGE',
      `Marker exceeds ${MAX_MARKER_BYTES} bytes`,
    );
  }
  const version = bytes[4];
  const network = bytes[5];
  const opcode = bytes[6];
  const payloadLength = bytes[7];
  if (version !== PROTOCOL_VERSION) {
    throw new ChainBloomError(
      'UNSUPPORTED_VERSION',
      `Unsupported version byte ${String(version)}`,
    );
  }
  if (network === undefined || !isNetworkId(network)) {
    throw new ChainBloomError('RESERVED_NETWORK', `Network byte ${network} is reserved`);
  }
  if (opcode === undefined || !OPCODES.has(opcode)) {
    throw new ChainBloomError('RESERVED_OPCODE', `Opcode byte ${opcode} is reserved`);
  }
  if (payloadLength === undefined || bytes.length !== HEADER_BYTES + payloadLength) {
    throw new ChainBloomError(
      'INVALID_PAYLOAD_LENGTH',
      'Payload length must consume all bytes',
      {
        declared: payloadLength,
        actual: bytes.length - HEADER_BYTES,
      },
    );
  }
  const payloadBytes = bytes.slice(HEADER_BYTES);
  let payload: OperationPayload;
  switch (opcode as Opcode) {
    case OPCODE.CREATE:
      payload = decodeCreate(payloadBytes);
      break;
    case OPCODE.BLOOM:
      payload = decodeBloom(payloadBytes);
      break;
    case OPCODE.GRAFT:
      payload = decodeGraft(payloadBytes);
      break;
    case OPCODE.RENDEZVOUS:
      payload = decodeRendezvous(payloadBytes);
      break;
    case OPCODE.CLOSE:
      payload = decodeClose(payloadBytes);
      break;
  }
  return {
    magic: PROTOCOL_MAGIC,
    version: PROTOCOL_VERSION,
    network,
    opcode: opcode as Opcode,
    operation: OPERATION_NAME[opcode as Opcode],
    payloadLength,
    payload,
    bytesHex: bytesToHex(bytes),
  };
}

export function decodeMarkerHex(hex: string): DecodedMarker {
  return decodeMarker(hexToBytes(hex, 'marker'));
}

export function isChainBloomMagic(bytes: Uint8Array): boolean {
  return (
    bytes.length >= PROTOCOL_MAGIC_BYTES.length &&
    PROTOCOL_MAGIC_BYTES.every((value, index) => value === bytes[index])
  );
}
