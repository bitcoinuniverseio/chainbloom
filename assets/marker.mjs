/**
 * The ChainBloom marker encoder used by the documentation figures.
 *
 * It mirrors `src/codec.ts` byte for byte. A test in `test/docs-marker.test.ts`
 * encodes every published vector with this module and with the package itself
 * and fails if the two ever disagree, so an interactive figure can never show
 * a layout the protocol would reject.
 */

export const MAGIC = [0x43, 0x42, 0x4c, 0x4d];
export const VERSION = 1;
export const RULESET = 1;
export const HEADER_BYTES = 8;
export const MAX_MARKER_BYTES = 72;

export const NETWORKS = [
  { id: 0, name: 'mainnet' },
  { id: 1, name: 'testnet4' },
  { id: 2, name: 'signet' },
  { id: 3, name: 'regtest' },
];

export const OPERATIONS = {
  CREATE: 0x01,
  BLOOM: 0x02,
  GRAFT: 0x03,
  RENDEZVOUS: 0x04,
  CLOSE: 0x05,
};

export const LIMITS = {
  laneCount: [1, 8],
  durationBlocks: [144, 52560],
  maxSteps: [1, 512],
  titleBytes: [0, 32],
  glyph: [0, 31],
  palette: [0, 15],
  motion: [0, 7],
  magnitude: [0, 255],
  relation: [0, 15],
  bridgeStyle: [0, 15],
  intensity: [0, 255],
  reason: [0, 255],
};

const TITLE_PATTERN = /^[A-Za-z0-9 ._:-]*$/u;

function checkRange(value, field) {
  const bounds = LIMITS[field];
  if (!Number.isInteger(value) || value < bounds[0] || value > bounds[1]) {
    throw new Error(`${field} must be a whole number from ${bounds[0]} to ${bounds[1]}`);
  }
}

function u16(value) {
  return [(value >>> 8) & 0xff, value & 0xff];
}

function hexToBytes(hex) {
  if (!/^(?:[0-9a-fA-F]{2})*$/u.test(hex)) throw new Error('Value must be hexadecimal');
  const bytes = [];
  for (let index = 0; index < hex.length; index += 2) {
    bytes.push(Number.parseInt(hex.slice(index, index + 2), 16));
  }
  return bytes;
}

export function bytesToHex(bytes) {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Encode one marker and describe each field's position, so a figure can point
 * at the exact bytes a choice produced.
 *
 * @returns {{ bytes: number[], fields: { label: string, start: number, length: number, value: string }[] }}
 */
export function encodeMarker(network, payload) {
  if (!NETWORKS.some((item) => item.id === network)) {
    throw new Error(`Network ${network} is reserved`);
  }
  const body = [];
  const fields = [];
  const push = (label, value, bytes) => {
    fields.push({ label, start: HEADER_BYTES + body.length, length: bytes.length, value });
    body.push(...bytes);
  };

  const operation = payload.operation;
  if (operation === 'CREATE') {
    checkRange(payload.laneCount, 'laneCount');
    checkRange(payload.durationBlocks, 'durationBlocks');
    checkRange(payload.maxSteps, 'maxSteps');
    const seed = hexToBytes(payload.seed);
    if (seed.length !== 16) throw new Error('seed must be 16 bytes');
    if (!TITLE_PATTERN.test(payload.title)) {
      throw new Error('title may use letters, numbers, space, and . _ : -');
    }
    const title = [...payload.title].map((character) => character.charCodeAt(0));
    if (title.length > 32) throw new Error('title must be 32 bytes or fewer');
    push('ruleset', String(RULESET), [RULESET]);
    push('paths', String(payload.laneCount), [payload.laneCount]);
    push('duration', `${payload.durationBlocks} blocks`, u16(payload.durationBlocks));
    push('max steps', String(payload.maxSteps), u16(payload.maxSteps));
    push('seed', payload.seed, seed);
    push('title length', String(title.length), [title.length]);
    if (title.length > 0) push('title', payload.title, title);
  } else if (operation === 'BLOOM') {
    checkRange(payload.glyph, 'glyph');
    checkRange(payload.palette, 'palette');
    checkRange(payload.motion, 'motion');
    checkRange(payload.magnitude, 'magnitude');
    push('glyph', String(payload.glyph), [payload.glyph]);
    push('palette', String(payload.palette), [payload.palette]);
    push('motion', String(payload.motion), [payload.motion]);
    push('magnitude', String(payload.magnitude), [payload.magnitude]);
  } else if (operation === 'GRAFT') {
    const target = hexToBytes(payload.targetEventTxid);
    if (target.length !== 32) throw new Error('the echoed event id must be 32 bytes');
    checkRange(payload.relation, 'relation');
    checkRange(payload.glyph, 'glyph');
    checkRange(payload.palette, 'palette');
    push('echoed event', payload.targetEventTxid, target);
    push('relation', String(payload.relation), [payload.relation]);
    push('glyph', String(payload.glyph), [payload.glyph]);
    push('palette', String(payload.palette), [payload.palette]);
  } else if (operation === 'RENDEZVOUS') {
    checkRange(payload.bridgeStyle, 'bridgeStyle');
    checkRange(payload.glyph, 'glyph');
    checkRange(payload.palette, 'palette');
    checkRange(payload.intensity, 'intensity');
    push('bridge style', String(payload.bridgeStyle), [payload.bridgeStyle]);
    push('glyph', String(payload.glyph), [payload.glyph]);
    push('palette', String(payload.palette), [payload.palette]);
    push('intensity', String(payload.intensity), [payload.intensity]);
  } else if (operation === 'CLOSE') {
    checkRange(payload.reason, 'reason');
    push('reason', String(payload.reason), [payload.reason]);
  } else {
    throw new Error(`Unknown operation ${operation}`);
  }

  const opcode = OPERATIONS[operation];
  const bytes = [...MAGIC, VERSION, network, opcode, body.length, ...body];
  if (bytes.length > MAX_MARKER_BYTES) {
    throw new Error(`Marker exceeds ${MAX_MARKER_BYTES} bytes`);
  }
  const header = [
    { label: 'magic', start: 0, length: 4, value: 'CBLM' },
    { label: 'version', start: 4, length: 1, value: String(VERSION) },
    {
      label: 'network',
      start: 5,
      length: 1,
      value: NETWORKS.find((item) => item.id === network).name,
    },
    { label: 'action', start: 6, length: 1, value: operation },
    { label: 'payload length', start: 7, length: 1, value: String(body.length) },
  ];
  return { bytes, fields: [...header, ...fields] };
}

/**
 * A size estimate for a ChainBloom transaction, in virtual bytes.
 *
 * The numbers below are the standard sizes of the pieces a ChainBloom
 * transaction is built from: a Taproot key-path input is about 57.5 vB, a
 * Taproot output is 43 vB, and the fixed overhead of a version-2 SegWit
 * transaction is about 10.5 vB. The marker output costs its own byte count
 * plus 9 bytes of output framing.
 */
export function estimateVirtualSize(options) {
  const carriers = options.carriers ?? 0;
  const successors = options.successors ?? 0;
  const feeInputs = options.feeInputs ?? 1;
  const markerBytes = options.markerBytes ?? 12;
  const change = options.change === false ? 0 : 1;
  const overhead = 10.5;
  const input = 57.5;
  const output = 43;
  const markerOutput = 9 + markerBytes;
  return Math.ceil(
    overhead +
      (carriers + feeInputs) * input +
      (successors + change) * output +
      markerOutput,
  );
}
