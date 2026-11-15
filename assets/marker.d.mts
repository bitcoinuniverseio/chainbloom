/** Types for the marker encoder used by the documentation figures. */

export interface MarkerField {
  readonly label: string;
  readonly start: number;
  readonly length: number;
  readonly value: string;
}

export interface EncodedMarker {
  readonly bytes: number[];
  readonly fields: readonly MarkerField[];
}

export interface NetworkEntry {
  readonly id: number;
  readonly name: string;
}

/** The fields any of the five actions may carry. */
export interface MarkerPayload {
  readonly operation: string;
  readonly ruleset?: number;
  readonly laneCount?: number;
  readonly durationBlocks?: number;
  readonly maxSteps?: number;
  readonly seed?: string;
  readonly title?: string;
  readonly glyph?: number;
  readonly palette?: number;
  readonly motion?: number;
  readonly magnitude?: number;
  readonly targetEventTxid?: string;
  readonly relation?: number;
  readonly bridgeStyle?: number;
  readonly intensity?: number;
  readonly reason?: number;
}

export interface SizeOptions {
  readonly carriers?: number;
  readonly successors?: number;
  readonly feeInputs?: number;
  readonly markerBytes?: number;
  readonly change?: boolean;
}

export declare const MAGIC: readonly number[];
export declare const VERSION: 1;
export declare const RULESET: 1;
export declare const HEADER_BYTES: 8;
export declare const MAX_MARKER_BYTES: 72;
export declare const NETWORKS: readonly NetworkEntry[];
export declare const OPERATIONS: Readonly<Record<string, number>>;
export declare const LIMITS: Readonly<Record<string, readonly [number, number]>>;

export function bytesToHex(bytes: readonly number[]): string;
export function encodeMarker(network: number, payload: MarkerPayload): EncodedMarker;
export function estimateVirtualSize(options: SizeOptions): number;
