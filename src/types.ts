import type { NetworkId, Opcode, OperationName } from './constants.js';

export interface CreatePayload {
  readonly operation: 'CREATE';
  readonly ruleset: 1;
  readonly laneCount: number;
  readonly durationBlocks: number;
  readonly maxSteps: number;
  readonly seed: string;
  readonly title: string;
}

export interface BloomPayload {
  readonly operation: 'BLOOM';
  readonly glyph: number;
  readonly palette: number;
  readonly motion: number;
  readonly magnitude: number;
}

export interface GraftPayload {
  readonly operation: 'GRAFT';
  readonly targetEventTxid: string;
  readonly relation: number;
  readonly glyph: number;
  readonly palette: number;
}

export interface RendezvousPayload {
  readonly operation: 'RENDEZVOUS';
  readonly bridgeStyle: number;
  readonly glyph: number;
  readonly palette: number;
  readonly intensity: number;
}

export interface ClosePayload {
  readonly operation: 'CLOSE';
  readonly reason: number;
}

export type OperationPayload =
  CreatePayload | BloomPayload | GraftPayload | RendezvousPayload | ClosePayload;

export interface DecodedMarker {
  readonly magic: 'CBLM';
  readonly version: 1;
  readonly network: NetworkId;
  readonly opcode: Opcode;
  readonly operation: OperationName;
  readonly payloadLength: number;
  readonly payload: OperationPayload;
  readonly bytesHex: string;
}

export interface TransactionInput {
  readonly txid: string;
  readonly vout: number;
  readonly sequence: number;
  readonly scriptSigHex: string;
  readonly witness: readonly string[];
}

export interface TransactionOutput {
  readonly value: bigint;
  readonly scriptPubKeyHex: string;
}

export interface ParsedTransaction {
  readonly txid: string;
  readonly wtxid: string;
  readonly version: number;
  readonly locktime: number;
  readonly virtualSize: number;
  readonly weight: number;
  readonly hasWitness: boolean;
  readonly inputs: readonly TransactionInput[];
  readonly outputs: readonly TransactionOutput[];
  readonly hex: string;
}

export interface Outpoint {
  readonly txid: string;
  readonly vout: number;
}

export type NativeSegwitType = 'p2wpkh' | 'p2wsh' | 'p2tr';

export interface Prevout extends Outpoint {
  readonly value: bigint;
  readonly scriptPubKeyHex: string;
  readonly confirmedHeight: number;
}

export type LaneStatus = 'LIVE' | 'CLOSED' | 'ABANDONED' | 'EXPIRED';
export type WorldStatus = 'ACTIVE' | 'ENDED' | 'EXPIRED';

export interface LaneState {
  readonly id: string;
  readonly worldId: string;
  readonly laneNumber: number;
  readonly status: LaneStatus;
  readonly currentOutpoint: Outpoint | null;
  readonly currentScriptPubKeyHex: string | null;
  readonly stepCount: number;
  readonly createdHeight: number;
  readonly lastEventHeight: number;
  readonly eventTxids: readonly string[];
  readonly terminalTxid: string | null;
  readonly terminalReason: string | null;
}

export interface WorldState {
  readonly id: string;
  readonly network: NetworkId;
  readonly ruleset: 1;
  readonly laneCount: number;
  readonly durationBlocks: number;
  readonly maxSteps: number;
  readonly seed: string;
  readonly title: string;
  readonly createdHeight: number;
  readonly endHeightExclusive: number;
  readonly status: WorldStatus;
  readonly laneIds: readonly string[];
}

export interface EventState {
  readonly txid: string;
  readonly network: NetworkId;
  readonly operation: OperationName;
  readonly payload: OperationPayload;
  readonly height: number;
  readonly txIndex: number;
  readonly blockHash: string;
  readonly worldIds: readonly string[];
  readonly laneIds: readonly string[];
  readonly parentOutpoints: readonly Outpoint[];
  readonly successorOutpoints: readonly Outpoint[];
  readonly graftTargetTxid: string | null;
}

export interface InvalidCarrierSpend {
  readonly txid: string;
  readonly height: number;
  readonly blockHash: string;
  readonly laneIds: readonly string[];
  readonly issueCodes: readonly string[];
}

export interface ValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path: string;
}

export interface SuccessorMapping {
  readonly laneId: string;
  readonly inputIndex: number;
  readonly outputIndex: number;
  readonly outpoint: Outpoint;
  readonly scriptPubKeyHex: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly marker: DecodedMarker | null;
  readonly issues: readonly ValidationIssue[];
  readonly carrierLaneIds: readonly string[];
  readonly successorMappings: readonly SuccessorMapping[];
}

export interface StateView {
  getLiveLaneByOutpoint(outpoint: Outpoint): LaneState | undefined;
  getWorld(worldId: string): WorldState | undefined;
  getEvent(txid: string): EventState | undefined;
}

export interface ValidationContext {
  readonly network: NetworkId;
  readonly height: number;
  readonly view: StateView;
  readonly prevouts: ReadonlyMap<string, Prevout> | Readonly<Record<string, Prevout>>;
  readonly requireWitnessSignatures?: boolean;
}

export interface IndexedTransaction {
  readonly hex: string;
  readonly prevouts: readonly Prevout[];
}

export interface IndexedBlock {
  readonly hash: string;
  readonly previousHash: string | null;
  readonly height: number;
  readonly transactions: readonly IndexedTransaction[];
}

export interface AppliedTransaction {
  readonly txid: string;
  readonly validProtocolEvent: boolean;
  readonly operation: OperationName | null;
  readonly affectedLaneIds: readonly string[];
  readonly issueCodes: readonly string[];
}

export interface AppliedBlock {
  readonly hash: string;
  readonly height: number;
  readonly transactions: readonly AppliedTransaction[];
  readonly expiredLaneIds: readonly string[];
}

export interface StateSnapshot {
  readonly tipHash: string | null;
  readonly tipHeight: number | null;
  readonly worlds: readonly WorldState[];
  readonly lanes: readonly LaneState[];
  readonly events: readonly EventState[];
  readonly invalidCarrierSpends: readonly InvalidCarrierSpend[];
}

export interface MempoolProjection {
  readonly txid: string;
  readonly valid: boolean;
  readonly conflictsWith: readonly string[];
  readonly laneIds: readonly string[];
  readonly issueCodes: readonly string[];
}
