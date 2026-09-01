import { Transaction } from 'bitcoinjs-lib';

import {
  buildBloomPsbt,
  buildClosePsbt,
  buildCreatePsbt,
  buildGraftPsbt,
  buildRendezvousPsbt,
  type CarrierInput,
  type PsbtInput,
} from '../src/builders.js';
import { bytesToHex, reverseBytes } from '../src/bytes.js';
import { decodeMarker } from '../src/codec.js';
import { CARRIER_VALUE_SATS, NETWORK, RBF_SEQUENCE } from '../src/constants.js';
import { decodeMinimalOpReturn, p2trScriptHex } from '../src/script.js';

const key = (byte: number): string => byte.toString(16).padStart(2, '0').repeat(32);
const taproot = (byte: number): string => p2trScriptHex(Buffer.from(key(byte), 'hex'));
const fee = (byte: number): PsbtInput => ({
  txid: key(byte),
  vout: 0,
  value: 10_000n,
  scriptPubKeyHex: `0014${byte.toString(16).padStart(2, '0').repeat(20)}`,
});
const carrier = (byte: number, laneId: string): CarrierInput => ({
  txid: key(byte),
  vout: 1,
  value: CARRIER_VALUE_SATS,
  scriptPubKeyHex: taproot(byte),
  laneId,
});

function operation(psbt: ReturnType<typeof buildBloomPsbt>): string {
  return decodeMarker(decodeMinimalOpReturn(psbt.txOutputs[0]!.script)).operation;
}

describe('deterministic PSBT builders', () => {
  it('builds CREATE with marker, roots, then extras', () => {
    const psbt = buildCreatePsbt({
      network: NETWORK.REGTEST,
      payload: {
        operation: 'CREATE',
        ruleset: 1,
        laneCount: 2,
        durationBlocks: 144,
        maxSteps: 5,
        seed: '00'.repeat(16),
        title: 'Garden',
      },
      rootOutputKeysHex: [key(0xaa), key(0xbb)],
      feeInputs: [fee(0x11)],
      extraOutputs: [{ value: 7_000n, scriptPubKeyHex: `0014${'44'.repeat(20)}` }],
    });
    expect(operation(psbt)).toBe('CREATE');
    expect(psbt.txOutputs.map((output) => output.value)).toEqual([
      0n,
      1_000n,
      1_000n,
      7_000n,
    ]);
    expect(psbt.txInputs[0]?.sequence).toBe(RBF_SEQUENCE);
  });

  it('builds every one-to-one operation', () => {
    const common = {
      network: NETWORK.SIGNET,
      carrier: carrier(0x20, `${key(1)}:0`),
      feeInputs: [fee(0x21)],
    };
    const bloom = buildBloomPsbt({
      ...common,
      payload: { operation: 'BLOOM', glyph: 1, palette: 2, motion: 3, magnitude: 4 },
      successorOutputKeyHex: key(0x30),
    });
    const graft = buildGraftPsbt({
      ...common,
      payload: {
        operation: 'GRAFT',
        targetEventTxid: key(9),
        relation: 2,
        glyph: 3,
        palette: 4,
      },
      successorOutputKeyHex: key(0x31),
    });
    const close = buildClosePsbt({ ...common, payload: { operation: 'CLOSE', reason: 8 } });
    expect(operation(bloom)).toBe('BLOOM');
    expect(operation(graft)).toBe('GRAFT');
    expect(operation(close)).toBe('CLOSE');
    expect(close.txOutputs).toHaveLength(1);
  });

  it('sorts RENDEZVOUS carriers and preserves lane-to-output mapping', () => {
    const firstLane = `${key(1)}:0`;
    const secondLane = `${key(2)}:0`;
    const psbt = buildRendezvousPsbt({
      network: NETWORK.REGTEST,
      payload: {
        operation: 'RENDEZVOUS',
        bridgeStyle: 1,
        glyph: 2,
        palette: 3,
        intensity: 4,
      },
      participants: [
        { carrier: carrier(0x42, secondLane), successorOutputKeyHex: key(0xbb) },
        { carrier: carrier(0x41, firstLane), successorOutputKeyHex: key(0xaa) },
      ],
      feeInputs: [fee(0x43)],
    });
    expect(operation(psbt)).toBe('RENDEZVOUS');
    expect(bytesToHex(reverseBytes(psbt.txInputs[0]!.hash))).toBe(key(0x41));
    expect(bytesToHex(psbt.txOutputs[1]!.script)).toBe(taproot(0xaa));
    expect(bytesToHex(psbt.txOutputs[2]!.script)).toBe(taproot(0xbb));
    expect(psbt.data.inputs[2]?.sighashType).toBe(Transaction.SIGHASH_ALL);
  });

  it('rejects unsafe structure before returning a PSBT', () => {
    expect(() =>
      buildBloomPsbt({
        network: NETWORK.REGTEST,
        payload: { operation: 'BLOOM', glyph: 1, palette: 1, motion: 1, magnitude: 1 },
        carrier: { ...carrier(1, `${key(1)}:0`), value: 999n },
        successorOutputKeyHex: key(2),
      }),
    ).toThrow(/Carrier/u);

    const repeated = carrier(3, `${key(3)}:0`);
    expect(() =>
      buildClosePsbt({
        network: NETWORK.REGTEST,
        payload: { operation: 'CLOSE', reason: 0 },
        carrier: repeated,
        feeInputs: [repeated],
      }),
    ).toThrow(/listed more than once/u);

    expect(() =>
      buildClosePsbt({
        network: NETWORK.REGTEST,
        payload: { operation: 'CLOSE', reason: 0 },
        carrier: carrier(4, `${key(4)}:0`),
        extraOutputs: [{ value: 0n, scriptPubKeyHex: '6a0443424c4d' }],
      }),
    ).toThrow(/another ChainBloom marker/u);
  });
});
