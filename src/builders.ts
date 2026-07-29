import { Psbt, Transaction } from 'bitcoinjs-lib';

import {
  CARRIER_VALUE_SATS,
  RBF_SEQUENCE,
  TX_VERSION,
  type NetworkId,
} from './constants.js';
import { hexToBytes, normalizeTxid } from './bytes.js';
import { encodeMarker } from './codec.js';
import { ChainBloomError } from './errors.js';
import {
  classifyNativeSegwit,
  encodeMinimalOpReturn,
  isP2trScript,
  isPotentialChainBloomScript,
  p2trScriptHex,
} from './script.js';
import type {
  BloomPayload,
  ClosePayload,
  CreatePayload,
  GraftPayload,
  RendezvousPayload,
} from './types.js';

export interface PsbtInput {
  readonly txid: string;
  readonly vout: number;
  readonly value: bigint;
  readonly scriptPubKeyHex: string;
  readonly tapInternalKeyHex?: string;
  readonly witnessScriptHex?: string;
}

export interface CarrierInput extends PsbtInput {
  readonly laneId: string;
}

export interface ExtraOutput {
  readonly value: bigint;
  readonly scriptPubKeyHex: string;
}

interface CommonBuildOptions {
  readonly network: NetworkId;
  readonly feeInputs?: readonly PsbtInput[];
  readonly extraOutputs?: readonly ExtraOutput[];
  readonly locktime?: number;
}

export interface CreatePsbtOptions extends CommonBuildOptions {
  readonly payload: CreatePayload;
  readonly rootOutputKeysHex: readonly string[];
}

export interface BloomPsbtOptions extends CommonBuildOptions {
  readonly payload: BloomPayload;
  readonly carrier: CarrierInput;
  readonly successorOutputKeyHex: string;
}

export interface GraftPsbtOptions extends CommonBuildOptions {
  readonly payload: GraftPayload;
  readonly carrier: CarrierInput;
  readonly successorOutputKeyHex: string;
}

export interface RendezvousParticipant {
  readonly carrier: CarrierInput;
  readonly successorOutputKeyHex: string;
}

export interface RendezvousPsbtOptions extends CommonBuildOptions {
  readonly payload: RendezvousPayload;
  readonly participants: readonly [RendezvousParticipant, RendezvousParticipant];
}

export interface ClosePsbtOptions extends CommonBuildOptions {
  readonly payload: ClosePayload;
  readonly carrier: CarrierInput;
}

function checkedOutputKey(hex: string): Uint8Array {
  const key = hexToBytes(hex, 'outputKey');
  if (key.length !== 32)
    throw new ChainBloomError('INVALID_XONLY_KEY', 'Output key must be 32 bytes');
  return key;
}

function checkInput(input: PsbtInput, carrier: boolean): void {
  normalizeTxid(input.txid);
  if (!Number.isInteger(input.vout) || input.vout < 0 || input.vout > 0xffff_ffff) {
    throw new ChainBloomError('INVALID_VOUT', 'Input vout must be a uint32');
  }
  if (input.value < 0n)
    throw new ChainBloomError('INVALID_INPUT_VALUE', 'Input value cannot be negative');
  const type = classifyNativeSegwit(input.scriptPubKeyHex);
  if (type === null)
    throw new ChainBloomError(
      'NON_NATIVE_SEGWIT_INPUT',
      'Every input must be native SegWit',
    );
  if (
    carrier &&
    (input.value !== CARRIER_VALUE_SATS || !isP2trScript(input.scriptPubKeyHex))
  ) {
    throw new ChainBloomError(
      'INVALID_CARRIER_INPUT',
      'Carrier must be an exact 1,000-sat P2TR UTXO',
    );
  }
}

function addInput(psbt: Psbt, input: PsbtInput, carrier: boolean): void {
  checkInput(input, carrier);
  const type = classifyNativeSegwit(input.scriptPubKeyHex);
  psbt.addInput({
    hash: normalizeTxid(input.txid),
    index: input.vout,
    sequence: RBF_SEQUENCE,
    witnessUtxo: { script: Buffer.from(input.scriptPubKeyHex, 'hex'), value: input.value },
    ...(input.tapInternalKeyHex === undefined
      ? {}
      : { tapInternalKey: Buffer.from(checkedOutputKey(input.tapInternalKeyHex)) }),
    ...(input.witnessScriptHex === undefined
      ? {}
      : {
          witnessScript: Buffer.from(hexToBytes(input.witnessScriptHex, 'witnessScript')),
        }),
    ...(type === 'p2tr' ? {} : { sighashType: Transaction.SIGHASH_ALL }),
  });
}

function build(
  network: NetworkId,
  payload: CreatePayload | BloomPayload | GraftPayload | RendezvousPayload | ClosePayload,
  carriers: readonly PsbtInput[],
  carrierOutputKeys: readonly string[],
  options: CommonBuildOptions,
): Psbt {
  const allInputs = [...carriers, ...(options.feeInputs ?? [])];
  const seenInputs = new Set<string>();
  for (const input of allInputs) {
    const key = `${normalizeTxid(input.txid)}:${input.vout}`;
    if (seenInputs.has(key)) {
      throw new ChainBloomError('DUPLICATE_INPUT', `Input ${key} is listed more than once`);
    }
    seenInputs.add(key);
  }
  const psbt = new Psbt();
  psbt.setVersion(TX_VERSION);
  psbt.setLocktime(options.locktime ?? 0);
  carriers.forEach((input) => addInput(psbt, input, true));
  (options.feeInputs ?? []).forEach((input) => addInput(psbt, input, false));
  psbt.addOutput({
    script: Buffer.from(encodeMinimalOpReturn(encodeMarker(network, payload))),
    value: 0n,
  });
  carrierOutputKeys.forEach((key) => {
    psbt.addOutput({
      script: Buffer.from(p2trScriptHex(checkedOutputKey(key)), 'hex'),
      value: CARRIER_VALUE_SATS,
    });
  });
  (options.extraOutputs ?? []).forEach((output) => {
    if (output.value < 0n)
      throw new ChainBloomError('INVALID_OUTPUT_VALUE', 'Output value cannot be negative');
    if (isPotentialChainBloomScript(output.scriptPubKeyHex)) {
      throw new ChainBloomError(
        'DUPLICATE_MARKER_OUTPUT',
        'Extra outputs may not contain another ChainBloom marker',
      );
    }
    psbt.addOutput({
      script: Buffer.from(hexToBytes(output.scriptPubKeyHex, 'scriptPubKey')),
      value: output.value,
    });
  });
  const inputTotal = allInputs.reduce((total, input) => total + input.value, 0n);
  const outputTotal =
    BigInt(carrierOutputKeys.length) * CARRIER_VALUE_SATS +
    (options.extraOutputs ?? []).reduce((total, output) => total + output.value, 0n);
  if (outputTotal > inputTotal)
    throw new ChainBloomError('INSUFFICIENT_INPUT_VALUE', 'Outputs exceed inputs');
  return psbt;
}

export function buildCreatePsbt(options: CreatePsbtOptions): Psbt {
  if (options.rootOutputKeysHex.length !== options.payload.laneCount) {
    throw new ChainBloomError(
      'LANE_COUNT_MISMATCH',
      'CREATE requires exactly lane_count root output keys',
    );
  }
  return build(options.network, options.payload, [], options.rootOutputKeysHex, options);
}

export function buildBloomPsbt(options: BloomPsbtOptions): Psbt {
  return build(
    options.network,
    options.payload,
    [options.carrier],
    [options.successorOutputKeyHex],
    options,
  );
}

export function buildGraftPsbt(options: GraftPsbtOptions): Psbt {
  return build(
    options.network,
    options.payload,
    [options.carrier],
    [options.successorOutputKeyHex],
    options,
  );
}

export function buildRendezvousPsbt(options: RendezvousPsbtOptions): Psbt {
  const participants = [...options.participants].sort((left, right) =>
    left.carrier.laneId.localeCompare(right.carrier.laneId),
  );
  if (participants[0]!.carrier.laneId === participants[1]!.carrier.laneId) {
    throw new ChainBloomError('DUPLICATE_LANE', 'RENDEZVOUS requires two different lanes');
  }
  return build(
    options.network,
    options.payload,
    participants.map((item) => item.carrier),
    participants.map((item) => item.successorOutputKeyHex),
    options,
  );
}

export function buildClosePsbt(options: ClosePsbtOptions): Psbt {
  return build(options.network, options.payload, [options.carrier], [], options);
}
