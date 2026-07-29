export const PROTOCOL_MAGIC = 'CBLM' as const;
export const PROTOCOL_MAGIC_BYTES = Uint8Array.from([0x43, 0x42, 0x4c, 0x4d]);
export const PROTOCOL_VERSION = 1 as const;
export const RULESET_VERSION = 1 as const;

export const NETWORK = {
  MAINNET: 0,
  TESTNET4: 1,
  SIGNET: 2,
  REGTEST: 3,
} as const;

export type NetworkId = (typeof NETWORK)[keyof typeof NETWORK];

export const NETWORK_NAME = {
  [NETWORK.MAINNET]: 'mainnet',
  [NETWORK.TESTNET4]: 'testnet4',
  [NETWORK.SIGNET]: 'signet',
  [NETWORK.REGTEST]: 'regtest',
} as const satisfies Record<NetworkId, string>;

export type NetworkName = (typeof NETWORK_NAME)[NetworkId];

export const OPCODE = {
  CREATE: 0x01,
  BLOOM: 0x02,
  GRAFT: 0x03,
  RENDEZVOUS: 0x04,
  CLOSE: 0x05,
} as const;

export type Opcode = (typeof OPCODE)[keyof typeof OPCODE];

export const OPERATION_NAME = {
  [OPCODE.CREATE]: 'CREATE',
  [OPCODE.BLOOM]: 'BLOOM',
  [OPCODE.GRAFT]: 'GRAFT',
  [OPCODE.RENDEZVOUS]: 'RENDEZVOUS',
  [OPCODE.CLOSE]: 'CLOSE',
} as const satisfies Record<Opcode, string>;

export type OperationName = (typeof OPERATION_NAME)[Opcode];

export const OP_RETURN = 0x6a;
export const MAX_MARKER_BYTES = 72;
export const HEADER_BYTES = 8;
export const CARRIER_VALUE_SATS = 1_000n;
export const RBF_SEQUENCE = 0xffff_fffd;
export const TX_VERSION = 2;

export const MIN_LANES = 1;
export const MAX_LANES = 8;
export const MIN_DURATION_BLOCKS = 144;
export const MAX_DURATION_BLOCKS = 52_560;
export const MIN_MAX_STEPS = 1;
export const MAX_MAX_STEPS = 512;
export const SEED_BYTES = 16;
export const MAX_TITLE_BYTES = 32;
export const TITLE_PATTERN = /^[A-Za-z0-9 ._:-]*$/u;

export const MAX_GLYPH = 31;
export const MAX_PALETTE = 15;
export const MAX_MOTION = 7;
export const MAX_RELATION = 15;
export const MAX_BRIDGE_STYLE = 15;

export const P2TR_SCRIPT_BYTES = 34;
export const TXID_BYTES = 32;
export const ZERO_VALUE = 0n;

export const SIGHASH_DEFAULT = 0x00;
export const SIGHASH_ALL = 0x01;
