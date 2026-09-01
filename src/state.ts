import { NETWORK, type NetworkId } from './constants.js';
import { ChainBloomError } from './errors.js';
import { parseTransactionHex } from './transaction.js';
import type {
  AppliedBlock,
  AppliedTransaction,
  EventState,
  IndexedBlock,
  IndexedTransaction,
  InvalidCarrierSpend,
  LaneState,
  MempoolProjection,
  Outpoint,
  Prevout,
  StateSnapshot,
  StateView,
  WorldState,
} from './types.js';
import { laneId, outpointKey, validateProtocolTransaction } from './validator.js';

interface HistoryEntry {
  readonly block: IndexedBlock;
  readonly before: StateSnapshot;
}

export interface StateEngineOptions {
  readonly network?: NetworkId;
  readonly requireWitnessSignatures?: boolean;
}

function compareId(left: { readonly id: string }, right: { readonly id: string }): number {
  return left.id.localeCompare(right.id);
}

function cloneOutpoint(outpoint: Outpoint | null): Outpoint | null {
  return outpoint === null ? null : { ...outpoint };
}

function cloneWorld(world: WorldState): WorldState {
  return { ...world, laneIds: [...world.laneIds] };
}

function cloneLane(lane: LaneState): LaneState {
  return {
    ...lane,
    currentOutpoint: cloneOutpoint(lane.currentOutpoint),
    eventTxids: [...lane.eventTxids],
  };
}

function cloneEvent(event: EventState): EventState {
  return {
    ...event,
    payload: { ...event.payload },
    worldIds: [...event.worldIds],
    laneIds: [...event.laneIds],
    parentOutpoints: event.parentOutpoints.map((outpoint) => ({ ...outpoint })),
    successorOutpoints: event.successorOutpoints.map((outpoint) => ({ ...outpoint })),
  };
}

function cloneInvalidSpend(spend: InvalidCarrierSpend): InvalidCarrierSpend {
  return { ...spend, laneIds: [...spend.laneIds], issueCodes: [...spend.issueCodes] };
}

function prevoutMap(transaction: IndexedTransaction): ReadonlyMap<string, Prevout> {
  return new Map(transaction.prevouts.map((prevout) => [outpointKey(prevout), prevout]));
}

/** Deterministic confirmed-chain state with atomic apply and one-block rollback. */
export class ChainBloomState implements StateView {
  public readonly network: NetworkId;
  private readonly requireWitnessSignatures: boolean;
  private tipHashValue: string | null = null;
  private tipHeightValue: number | null = null;
  private worlds = new Map<string, WorldState>();
  private lanes = new Map<string, LaneState>();
  private events = new Map<string, EventState>();
  private liveOutpoints = new Map<string, string>();
  private invalidSpends: InvalidCarrierSpend[] = [];
  private history: HistoryEntry[] = [];

  public constructor(options: StateEngineOptions = {}) {
    this.network = options.network ?? NETWORK.REGTEST;
    this.requireWitnessSignatures = options.requireWitnessSignatures ?? false;
  }

  public get tipHash(): string | null {
    return this.tipHashValue;
  }

  public get tipHeight(): number | null {
    return this.tipHeightValue;
  }

  public getLiveLaneByOutpoint(outpoint: Outpoint): LaneState | undefined {
    const id = this.liveOutpoints.get(outpointKey(outpoint));
    const lane = id === undefined ? undefined : this.lanes.get(id);
    return lane === undefined ? undefined : cloneLane(lane);
  }

  public getWorld(worldId: string): WorldState | undefined {
    const world = this.worlds.get(worldId.toLowerCase());
    return world === undefined ? undefined : cloneWorld(world);
  }

  public getLane(id: string): LaneState | undefined {
    const lane = this.lanes.get(id.toLowerCase());
    return lane === undefined ? undefined : cloneLane(lane);
  }

  public getEvent(txid: string): EventState | undefined {
    const event = this.events.get(txid.toLowerCase());
    return event === undefined ? undefined : cloneEvent(event);
  }

  public snapshot(): StateSnapshot {
    return {
      tipHash: this.tipHashValue,
      tipHeight: this.tipHeightValue,
      worlds: [...this.worlds.values()].sort(compareId).map(cloneWorld),
      lanes: [...this.lanes.values()].sort(compareId).map(cloneLane),
      events: [...this.events.values()]
        .sort((left, right) => left.height - right.height || left.txIndex - right.txIndex)
        .map(cloneEvent),
      invalidCarrierSpends: this.invalidSpends.map(cloneInvalidSpend),
    };
  }

  private restore(snapshot: StateSnapshot): void {
    this.tipHashValue = snapshot.tipHash;
    this.tipHeightValue = snapshot.tipHeight;
    this.worlds = new Map(snapshot.worlds.map((world) => [world.id, cloneWorld(world)]));
    this.lanes = new Map(snapshot.lanes.map((lane) => [lane.id, cloneLane(lane)]));
    this.events = new Map(snapshot.events.map((event) => [event.txid, cloneEvent(event)]));
    this.invalidSpends = snapshot.invalidCarrierSpends.map(cloneInvalidSpend);
    this.liveOutpoints = new Map();
    for (const lane of this.lanes.values()) {
      if (lane.status === 'LIVE' && lane.currentOutpoint !== null) {
        this.liveOutpoints.set(outpointKey(lane.currentOutpoint), lane.id);
      }
    }
  }

  private expireAt(height: number): string[] {
    const expired: string[] = [];
    for (const world of this.worlds.values()) {
      if (world.status !== 'ACTIVE' || height < world.endHeightExclusive) continue;
      this.worlds.set(world.id, { ...world, status: 'EXPIRED' });
      for (const id of world.laneIds) {
        const lane = this.lanes.get(id);
        if (lane?.status !== 'LIVE') continue;
        if (lane.currentOutpoint !== null)
          this.liveOutpoints.delete(outpointKey(lane.currentOutpoint));
        this.lanes.set(id, {
          ...lane,
          status: 'EXPIRED',
          currentOutpoint: null,
          currentScriptPubKeyHex: null,
          terminalReason: 'WORLD_DURATION_ELAPSED',
        });
        expired.push(id);
      }
    }
    return expired.sort();
  }

  private refreshWorldStatus(worldIds: readonly string[]): void {
    for (const worldId of new Set(worldIds)) {
      const world = this.worlds.get(worldId);
      if (world === undefined || world.status === 'EXPIRED') continue;
      const hasLiveLane = world.laneIds.some((id) => this.lanes.get(id)?.status === 'LIVE');
      this.worlds.set(worldId, { ...world, status: hasLiveLane ? 'ACTIVE' : 'ENDED' });
    }
  }

  private abandonLanes(
    laneIds: readonly string[],
    txid: string,
    height: number,
    blockHash: string,
    issueCodes: readonly string[],
  ): void {
    const affectedWorlds: string[] = [];
    for (const id of new Set(laneIds)) {
      const lane = this.lanes.get(id);
      if (lane?.status !== 'LIVE') continue;
      if (lane.currentOutpoint !== null)
        this.liveOutpoints.delete(outpointKey(lane.currentOutpoint));
      this.lanes.set(id, {
        ...lane,
        status: 'ABANDONED',
        currentOutpoint: null,
        currentScriptPubKeyHex: null,
        terminalTxid: txid,
        terminalReason: 'INVALID_CONFIRMED_SPEND',
      });
      affectedWorlds.push(lane.worldId);
    }
    if (laneIds.length > 0) {
      this.invalidSpends.push({
        txid,
        height,
        blockHash,
        laneIds: [...laneIds],
        issueCodes: [...issueCodes],
      });
    }
    this.refreshWorldStatus(affectedWorlds);
  }

  private applyValidEvent(
    transactionHex: string,
    height: number,
    txIndex: number,
    blockHash: string,
    validation: ReturnType<typeof validateProtocolTransaction>,
  ): void {
    const transaction = parseTransactionHex(transactionHex);
    const marker = validation.marker;
    if (marker === null) return;

    if (marker.payload.operation === 'CREATE') {
      const worldId = transaction.txid;
      const ids = Array.from({ length: marker.payload.laneCount }, (_, index) =>
        laneId(worldId, index),
      );
      const world: WorldState = {
        id: worldId,
        network: this.network,
        ruleset: marker.payload.ruleset,
        laneCount: marker.payload.laneCount,
        durationBlocks: marker.payload.durationBlocks,
        maxSteps: marker.payload.maxSteps,
        seed: marker.payload.seed,
        title: marker.payload.title,
        createdHeight: height,
        endHeightExclusive: height + marker.payload.durationBlocks,
        status: 'ACTIVE',
        laneIds: ids,
      };
      this.worlds.set(worldId, world);
      const successors: Outpoint[] = [];
      ids.forEach((id, index) => {
        const outputIndex = index + 1;
        const output = transaction.outputs[outputIndex]!;
        const currentOutpoint = { txid: transaction.txid, vout: outputIndex };
        const lane: LaneState = {
          id,
          worldId,
          laneNumber: index,
          status: 'LIVE',
          currentOutpoint,
          currentScriptPubKeyHex: output.scriptPubKeyHex,
          stepCount: 0,
          createdHeight: height,
          lastEventHeight: height,
          eventTxids: [transaction.txid],
          terminalTxid: null,
          terminalReason: null,
        };
        this.lanes.set(id, lane);
        this.liveOutpoints.set(outpointKey(currentOutpoint), id);
        successors.push(currentOutpoint);
      });
      this.events.set(transaction.txid, {
        txid: transaction.txid,
        network: this.network,
        operation: marker.operation,
        payload: marker.payload,
        height,
        txIndex,
        blockHash,
        worldIds: [worldId],
        laneIds: ids,
        parentOutpoints: [],
        successorOutpoints: successors,
        graftTargetTxid: null,
      });
      return;
    }

    const laneIds = validation.carrierLaneIds;
    const parentOutpoints = laneIds
      .map((id) => this.lanes.get(id)?.currentOutpoint)
      .filter((value): value is Outpoint => value !== null && value !== undefined);
    const worldIds = [
      ...new Set(
        laneIds
          .map((id) => this.lanes.get(id)?.worldId)
          .filter((value): value is string => value !== undefined),
      ),
    ];
    const successors: Outpoint[] = [];

    for (const id of laneIds) {
      const lane = this.lanes.get(id);
      if (lane === undefined) continue;
      if (lane.currentOutpoint !== null)
        this.liveOutpoints.delete(outpointKey(lane.currentOutpoint));
      const mapping = validation.successorMappings.find((item) => item.laneId === id);
      if (marker.payload.operation === 'CLOSE') {
        this.lanes.set(id, {
          ...lane,
          status: 'CLOSED',
          currentOutpoint: null,
          currentScriptPubKeyHex: null,
          lastEventHeight: height,
          eventTxids: [...lane.eventTxids, transaction.txid],
          terminalTxid: transaction.txid,
          terminalReason: `CLOSE_${marker.payload.reason}`,
        });
      } else if (mapping !== undefined) {
        this.lanes.set(id, {
          ...lane,
          currentOutpoint: { ...mapping.outpoint },
          currentScriptPubKeyHex: mapping.scriptPubKeyHex,
          stepCount: lane.stepCount + 1,
          lastEventHeight: height,
          eventTxids: [...lane.eventTxids, transaction.txid],
        });
        this.liveOutpoints.set(outpointKey(mapping.outpoint), id);
        successors.push({ ...mapping.outpoint });
      }
    }

    this.events.set(transaction.txid, {
      txid: transaction.txid,
      network: this.network,
      operation: marker.operation,
      payload: marker.payload,
      height,
      txIndex,
      blockHash,
      worldIds,
      laneIds: [...laneIds],
      parentOutpoints,
      successorOutpoints: successors,
      graftTargetTxid:
        marker.payload.operation === 'GRAFT' ? marker.payload.targetEventTxid : null,
    });
    this.refreshWorldStatus(worldIds);
  }

  public applyBlock(block: IndexedBlock): AppliedBlock {
    if (!Number.isSafeInteger(block.height) || block.height < 0) {
      throw new ChainBloomError(
        'INVALID_BLOCK_HEIGHT',
        'Block height must be a non-negative safe integer',
      );
    }
    if (this.tipHeightValue !== null) {
      if (
        block.height !== this.tipHeightValue + 1 ||
        block.previousHash !== this.tipHashValue
      ) {
        throw new ChainBloomError(
          'NON_CONTIGUOUS_BLOCK',
          'Block does not extend the current best chain tip',
        );
      }
    }
    const before = this.snapshot();
    const expiredLaneIds = this.expireAt(block.height);
    const applied: AppliedTransaction[] = [];
    try {
      block.transactions.forEach((indexed, txIndex) => {
        const transaction = parseTransactionHex(indexed.hex);
        const spentLaneIds = transaction.inputs
          .map((input) => this.getLiveLaneByOutpoint(input)?.id)
          .filter((id): id is string => id !== undefined);
        const validation = validateProtocolTransaction(transaction, {
          network: this.network,
          height: block.height,
          view: this,
          prevouts: prevoutMap(indexed),
          requireWitnessSignatures: this.requireWitnessSignatures,
        });
        if (validation.valid && validation.marker !== null) {
          this.applyValidEvent(indexed.hex, block.height, txIndex, block.hash, validation);
        } else if (spentLaneIds.length > 0) {
          this.abandonLanes(
            spentLaneIds,
            transaction.txid,
            block.height,
            block.hash,
            validation.issues.map((item) => item.code),
          );
        }
        applied.push({
          txid: transaction.txid,
          validProtocolEvent: validation.valid,
          operation: validation.marker?.operation ?? null,
          affectedLaneIds: validation.valid ? validation.carrierLaneIds : spentLaneIds,
          issueCodes: validation.issues.map((item) => item.code),
        });
      });
      this.tipHashValue = block.hash;
      this.tipHeightValue = block.height;
      this.history.push({ block, before });
      return {
        hash: block.hash,
        height: block.height,
        transactions: applied,
        expiredLaneIds,
      };
    } catch (error) {
      this.restore(before);
      throw error;
    }
  }

  public rollbackTip(expectedHash?: string): IndexedBlock {
    const entry = this.history.at(-1);
    if (entry === undefined)
      throw new ChainBloomError('NO_BLOCK_TO_ROLLBACK', 'State has no applied block');
    if (expectedHash !== undefined && entry.block.hash !== expectedHash) {
      throw new ChainBloomError(
        'ROLLBACK_HASH_MISMATCH',
        'Expected hash is not the current best chain tip',
      );
    }
    this.history.pop();
    this.restore(entry.before);
    return entry.block;
  }

  public reset(): void {
    this.tipHashValue = null;
    this.tipHeightValue = null;
    this.worlds.clear();
    this.lanes.clear();
    this.events.clear();
    this.liveOutpoints.clear();
    this.invalidSpends = [];
    this.history = [];
  }

  public replay(blocks: readonly IndexedBlock[]): readonly AppliedBlock[] {
    this.reset();
    return blocks.map((block) => this.applyBlock(block));
  }

  public preview(
    transaction: IndexedTransaction,
    height = (this.tipHeightValue ?? -1) + 1,
  ): MempoolProjection {
    const parsed = parseTransactionHex(transaction.hex);
    const validation = validateProtocolTransaction(parsed, {
      network: this.network,
      height,
      view: this,
      prevouts: prevoutMap(transaction),
      requireWitnessSignatures: this.requireWitnessSignatures,
    });
    return {
      txid: parsed.txid,
      valid: validation.valid,
      conflictsWith: [],
      laneIds: validation.carrierLaneIds,
      issueCodes: validation.issues.map((item) => item.code),
    };
  }
}

/** A non-consensus mempool overlay. It never creates lineage parents. */
export class MempoolOverlay {
  private readonly projections = new Map<string, MempoolProjection>();
  private readonly spends = new Map<string, string>();

  public constructor(private readonly confirmed: ChainBloomState) {}

  public project(
    transaction: IndexedTransaction,
    replaceConflicts = false,
  ): MempoolProjection {
    const parsed = parseTransactionHex(transaction.hex);
    const conflicts = [
      ...new Set(
        parsed.inputs
          .map(outpointKey)
          .map((key) => this.spends.get(key))
          .filter((txid): txid is string => txid !== undefined && txid !== parsed.txid),
      ),
    ].sort();
    if (replaceConflicts) conflicts.forEach((txid) => this.remove(txid));
    const base = this.confirmed.preview(transaction);
    const projection = { ...base, conflictsWith: conflicts };
    this.projections.set(parsed.txid, projection);
    parsed.inputs.forEach((input) => this.spends.set(outpointKey(input), parsed.txid));
    return projection;
  }

  public remove(txid: string): boolean {
    const deleted = this.projections.delete(txid);
    for (const [key, spender] of this.spends) if (spender === txid) this.spends.delete(key);
    return deleted;
  }

  public clear(): void {
    this.projections.clear();
    this.spends.clear();
  }

  public list(): readonly MempoolProjection[] {
    return [...this.projections.values()].sort((left, right) =>
      left.txid.localeCompare(right.txid),
    );
  }
}
