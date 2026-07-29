import {
  CARRIER_VALUE_SATS,
  NETWORK_NAME,
  OPCODE,
  RBF_SEQUENCE,
  SIGHASH_ALL,
  ZERO_VALUE,
} from './constants.js';
import { normalizeTxid } from './bytes.js';
import { ChainBloomError } from './errors.js';
import {
  classifyNativeSegwit,
  decodeMinimalOpReturn,
  isP2trScript,
  isPotentialChainBloomScript,
} from './script.js';
import { decodeMarker } from './codec.js';
import type {
  DecodedMarker,
  LaneState,
  Outpoint,
  ParsedTransaction,
  Prevout,
  StateView,
  SuccessorMapping,
  ValidationContext,
  ValidationIssue,
  ValidationResult,
  WorldState,
} from './types.js';

export function outpointKey(outpoint: Outpoint): string {
  return `${normalizeTxid(outpoint.txid)}:${outpoint.vout}`;
}

export function laneId(worldId: string, laneNumber: number): string {
  return `${normalizeTxid(worldId)}:${laneNumber}`;
}

function issue(code: string, message: string, path: string): ValidationIssue {
  return { code, message, path };
}

function lookupPrevout(
  source: ValidationContext['prevouts'],
  outpoint: Outpoint,
): Prevout | undefined {
  const key = outpointKey(outpoint);
  return source instanceof Map
    ? (source as ReadonlyMap<string, Prevout>).get(key)
    : (source as Readonly<Record<string, Prevout>>)[key];
}

function parseMarker(
  transaction: ParsedTransaction,
  issues: ValidationIssue[],
): DecodedMarker | null {
  const matching = transaction.outputs
    .map((output, index) => ({ output, index }))
    .filter(({ output }) => isPotentialChainBloomScript(output.scriptPubKeyHex));

  if (matching.length !== 1 || matching[0]?.index !== 0) {
    issues.push(
      issue(
        'MARKER_POSITION',
        'Transaction must contain exactly one ChainBloom marker at vout 0',
        'outputs',
      ),
    );
  }
  const output = transaction.outputs[0];
  if (output === undefined) {
    issues.push(issue('MISSING_MARKER', 'Transaction has no vout 0', 'outputs[0]'));
    return null;
  }
  if (output.value !== ZERO_VALUE) {
    issues.push(
      issue('MARKER_VALUE', 'vout 0 marker value must be zero', 'outputs[0].value'),
    );
  }
  try {
    const markerBytes = decodeMinimalOpReturn(Buffer.from(output.scriptPubKeyHex, 'hex'));
    return decodeMarker(markerBytes);
  } catch (error) {
    const chainBloomError =
      error instanceof ChainBloomError
        ? error
        : new ChainBloomError('INVALID_MARKER', String(error));
    issues.push(
      issue(chainBloomError.code, chainBloomError.message, 'outputs[0].scriptPubKey'),
    );
    return null;
  }
}

function recognizedCarrierLanes(
  transaction: ParsedTransaction,
  view: StateView,
): readonly (LaneState | undefined)[] {
  return transaction.inputs.map((input) =>
    view.getLiveLaneByOutpoint({ txid: input.txid, vout: input.vout }),
  );
}

function checkInputBasics(transaction: ParsedTransaction, issues: ValidationIssue[]): void {
  const seen = new Set<string>();
  transaction.inputs.forEach((input, index) => {
    if (input.sequence !== RBF_SEQUENCE) {
      issues.push(
        issue(
          'NON_CANONICAL_SEQUENCE',
          `Every input nSequence must be ${RBF_SEQUENCE.toString(16)}`,
          `inputs[${index}].sequence`,
        ),
      );
    }
    const key = outpointKey(input);
    if (seen.has(key)) {
      issues.push(
        issue('DUPLICATE_INPUT', 'Duplicate transaction input', `inputs[${index}]`),
      );
    }
    seen.add(key);
  });
}

function checkWitnessSighash(
  transaction: ParsedTransaction,
  index: number,
  prevout: Prevout,
  issues: ValidationIssue[],
): void {
  const input = transaction.inputs[index]!;
  const type = classifyNativeSegwit(prevout.scriptPubKeyHex);
  if (input.witness.length === 0) {
    issues.push(
      issue(
        'MISSING_WITNESS',
        'Confirmed input must contain witness data',
        `inputs[${index}]`,
      ),
    );
    return;
  }
  if (type === 'p2tr') {
    const signatures = input.witness
      .map((hex) => Buffer.from(hex, 'hex'))
      .filter((item) => item.length === 64 || item.length === 65);
    if (signatures.length === 0) {
      issues.push(
        issue(
          'MISSING_TAPROOT_SIGNATURE',
          'No Taproot signature found',
          `inputs[${index}]`,
        ),
      );
    }
    for (const signature of signatures) {
      if (signature.length === 65 && signature[64] !== SIGHASH_ALL) {
        issues.push(
          issue(
            'UNSAFE_SIGHASH',
            'Taproot signatures must use SIGHASH_DEFAULT or SIGHASH_ALL',
            `inputs[${index}].witness`,
          ),
        );
      }
    }
  } else if (type === 'p2wpkh') {
    const signature = Buffer.from(input.witness[0] ?? '', 'hex');
    if (signature.length === 0 || signature.at(-1) !== SIGHASH_ALL) {
      issues.push(
        issue(
          'UNSAFE_SIGHASH',
          'P2WPKH signature must use SIGHASH_ALL',
          `inputs[${index}]`,
        ),
      );
    }
  } else if (type === 'p2wsh') {
    const signatures = input.witness
      .map((hex) => Buffer.from(hex, 'hex'))
      .filter((item) => item.length > 8 && item[0] === 0x30);
    if (
      signatures.length === 0 ||
      signatures.some((signature) => signature.at(-1) !== SIGHASH_ALL)
    ) {
      issues.push(
        issue(
          'UNSAFE_SIGHASH',
          'P2WSH signatures must use SIGHASH_ALL',
          `inputs[${index}]`,
        ),
      );
    }
  }
}

function checkFeeInputs(
  transaction: ParsedTransaction,
  startIndex: number,
  context: ValidationContext,
  issues: ValidationIssue[],
): void {
  for (let index = startIndex; index < transaction.inputs.length; index += 1) {
    const input = transaction.inputs[index]!;
    const prevout = lookupPrevout(context.prevouts, input);
    if (prevout === undefined) {
      issues.push(
        issue(
          'MISSING_PREVOUT',
          'Fee input prevout context is required',
          `inputs[${index}]`,
        ),
      );
      continue;
    }
    if (classifyNativeSegwit(prevout.scriptPubKeyHex) === null) {
      issues.push(
        issue(
          'NON_NATIVE_SEGWIT_FEE_INPUT',
          'Fee inputs must spend native SegWit outputs',
          `inputs[${index}]`,
        ),
      );
    }
    if (context.requireWitnessSignatures === true) {
      checkWitnessSighash(transaction, index, prevout, issues);
    }
  }
}

function checkCarrierWitness(
  transaction: ParsedTransaction,
  index: number,
  lane: LaneState,
  context: ValidationContext,
  issues: ValidationIssue[],
): void {
  if (context.requireWitnessSignatures !== true || lane.currentScriptPubKeyHex === null)
    return;
  checkWitnessSighash(
    transaction,
    index,
    {
      txid: transaction.inputs[index]!.txid,
      vout: transaction.inputs[index]!.vout,
      value: CARRIER_VALUE_SATS,
      scriptPubKeyHex: lane.currentScriptPubKeyHex,
      confirmedHeight: lane.lastEventHeight,
    },
    issues,
  );
}

function checkWorldCanAdvance(
  world: WorldState | undefined,
  lane: LaneState,
  height: number,
  allowAtMaxSteps: boolean,
  issues: ValidationIssue[],
  path: string,
): void {
  if (world === undefined) {
    issues.push(issue('MISSING_WORLD', 'Carrier world is missing', path));
    return;
  }
  if (world.status !== 'ACTIVE' || height >= world.endHeightExclusive) {
    issues.push(issue('WORLD_ENDED', 'World is no longer active', path));
  }
  if (!allowAtMaxSteps && lane.stepCount >= world.maxSteps) {
    issues.push(issue('MAX_STEPS_REACHED', 'Lane has reached max_steps', path));
  }
  if (lane.lastEventHeight >= height) {
    issues.push(
      issue(
        'UNCONFIRMED_LINEAGE_PARENT',
        'Carrier parent must be confirmed in a prior block',
        path,
      ),
    );
  }
}

function requireCarrierOutput(
  transaction: ParsedTransaction,
  outputIndex: number,
  lane: LaneState,
  inputIndex: number,
  issues: ValidationIssue[],
): SuccessorMapping | null {
  const output = transaction.outputs[outputIndex];
  if (output === undefined) {
    issues.push(
      issue(
        'MISSING_CARRIER_OUTPUT',
        'Required successor output is missing',
        `outputs[${outputIndex}]`,
      ),
    );
    return null;
  }
  if (output.value !== CARRIER_VALUE_SATS) {
    issues.push(
      issue(
        'INVALID_CARRIER_VALUE',
        `Carrier output must be exactly ${CARRIER_VALUE_SATS} sats`,
        `outputs[${outputIndex}].value`,
      ),
    );
  }
  if (!isP2trScript(output.scriptPubKeyHex)) {
    issues.push(
      issue(
        'INVALID_CARRIER_SCRIPT',
        'Carrier successor must be standard P2TR',
        `outputs[${outputIndex}]`,
      ),
    );
  }
  return {
    laneId: lane.id,
    inputIndex,
    outputIndex,
    outpoint: { txid: transaction.txid, vout: outputIndex },
    scriptPubKeyHex: output.scriptPubKeyHex,
  };
}

function requireCarrierPositions(
  recognized: readonly (LaneState | undefined)[],
  positions: readonly number[],
  issues: ValidationIssue[],
): readonly LaneState[] {
  const recognizedPositions = recognized
    .map((lane, index) => ({ lane, index }))
    .filter((item): item is { lane: LaneState; index: number } => item.lane !== undefined);
  if (
    recognizedPositions.length !== positions.length ||
    recognizedPositions.some((item, index) => item.index !== positions[index])
  ) {
    issues.push(
      issue(
        'CARRIER_INPUT_MAPPING',
        `Recognized carriers must be exactly at vin ${positions.join(', ')}`,
        'inputs',
      ),
    );
  }
  return positions
    .map((position) => recognized[position])
    .filter((lane): lane is LaneState => lane !== undefined);
}

export function validateProtocolTransaction(
  transaction: ParsedTransaction,
  context: ValidationContext,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const successors: SuccessorMapping[] = [];
  const marker = parseMarker(transaction, issues);
  const recognized = recognizedCarrierLanes(transaction, context.view);
  const carrierLaneIds = recognized
    .filter((lane): lane is LaneState => lane !== undefined)
    .map((lane) => lane.id);

  checkInputBasics(transaction, issues);

  if (marker === null) {
    return { valid: false, marker: null, issues, carrierLaneIds, successorMappings: [] };
  }
  if (marker.network !== context.network) {
    issues.push(
      issue(
        'NETWORK_MISMATCH',
        `Marker network ${NETWORK_NAME[marker.network]} does not match indexer network ${NETWORK_NAME[context.network]}`,
        'marker.network',
      ),
    );
  }

  if (marker.opcode === OPCODE.CREATE) {
    if (carrierLaneIds.length !== 0) {
      issues.push(
        issue('CREATE_SPENDS_CARRIER', 'CREATE may not spend a live carrier', 'inputs'),
      );
    }
    checkFeeInputs(transaction, 0, context, issues);
    const payload = marker.payload;
    if (payload.operation === 'CREATE') {
      for (let laneNumber = 0; laneNumber < payload.laneCount; laneNumber += 1) {
        const outputIndex = laneNumber + 1;
        const output = transaction.outputs[outputIndex];
        if (output === undefined) {
          issues.push(
            issue(
              'MISSING_ROOT_CARRIER',
              'CREATE root carrier output is missing',
              `outputs[${outputIndex}]`,
            ),
          );
          continue;
        }
        if (output.value !== CARRIER_VALUE_SATS) {
          issues.push(
            issue(
              'INVALID_CARRIER_VALUE',
              `Root carrier must be exactly ${CARRIER_VALUE_SATS} sats`,
              `outputs[${outputIndex}].value`,
            ),
          );
        }
        if (!isP2trScript(output.scriptPubKeyHex)) {
          issues.push(
            issue(
              'INVALID_CARRIER_SCRIPT',
              'Root carrier must be standard P2TR',
              `outputs[${outputIndex}]`,
            ),
          );
        }
      }
    }
  } else if (marker.opcode === OPCODE.RENDEZVOUS) {
    const lanes = requireCarrierPositions(recognized, [0, 1], issues);
    if (lanes.length === 2) {
      if (lanes[0]!.id.localeCompare(lanes[1]!.id) >= 0) {
        issues.push(
          issue(
            'RENDEZVOUS_LANE_ORDER',
            'Rendezvous carrier inputs must be ordered lexicographically by lane ID',
            'inputs[0..1]',
          ),
        );
      }
      lanes.forEach((lane, index) => {
        checkWorldCanAdvance(
          context.view.getWorld(lane.worldId),
          lane,
          context.height,
          false,
          issues,
          `inputs[${index}]`,
        );
        checkCarrierWitness(transaction, index, lane, context, issues);
        const mapping = requireCarrierOutput(transaction, index + 1, lane, index, issues);
        if (mapping !== null) successors.push(mapping);
      });
    }
    checkFeeInputs(transaction, 2, context, issues);
  } else {
    const lanes = requireCarrierPositions(recognized, [0], issues);
    const lane = lanes[0];
    if (lane !== undefined) {
      const isClose = marker.opcode === OPCODE.CLOSE;
      checkWorldCanAdvance(
        context.view.getWorld(lane.worldId),
        lane,
        context.height,
        isClose,
        issues,
        'inputs[0]',
      );
      checkCarrierWitness(transaction, 0, lane, context, issues);
      if (!isClose) {
        const mapping = requireCarrierOutput(transaction, 1, lane, 0, issues);
        if (mapping !== null) successors.push(mapping);
      }
      if (marker.opcode === OPCODE.GRAFT && marker.payload.operation === 'GRAFT') {
        const target = context.view.getEvent(marker.payload.targetEventTxid);
        if (target === undefined) {
          issues.push(
            issue(
              'UNKNOWN_GRAFT_TARGET',
              'GRAFT target event does not exist',
              'payload.target',
            ),
          );
        } else {
          if (target.network !== context.network) {
            issues.push(
              issue(
                'GRAFT_NETWORK_MISMATCH',
                'GRAFT target network differs',
                'payload.target',
              ),
            );
          }
          if (target.height >= context.height) {
            issues.push(
              issue(
                'UNCONFIRMED_GRAFT_TARGET',
                'GRAFT target must be confirmed in a prior block',
                'payload.target',
              ),
            );
          }
        }
      }
    }
    checkFeeInputs(transaction, 1, context, issues);
  }

  return {
    valid: issues.length === 0,
    marker,
    issues,
    carrierLaneIds,
    successorMappings: successors,
  };
}
