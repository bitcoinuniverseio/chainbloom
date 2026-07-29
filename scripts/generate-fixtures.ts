import { Transaction } from 'bitcoinjs-lib';

import { encodeMarker } from '../src/codec.js';
import { NETWORK, RBF_SEQUENCE } from '../src/constants.js';
import { encodeMinimalOpReturn, p2trScriptHex } from '../src/script.js';
import type { OperationPayload, Prevout } from '../src/types.js';

const p2tr = (byte: number): string =>
  p2trScriptHex(Uint8Array.from({ length: 32 }, () => byte));
const p2wpkh = (byte: number): string =>
  `0014${byte.toString(16).padStart(2, '0').repeat(20)}`;
const txid = (byte: number): string => byte.toString(16).padStart(2, '0').repeat(32);

interface Input {
  readonly txid: string;
  readonly vout: number;
}

interface Output {
  readonly value: bigint;
  readonly script: string;
}

function transaction(
  payload: OperationPayload,
  inputs: readonly Input[],
  outputs: readonly Output[],
): Transaction {
  const tx = new Transaction();
  tx.version = 2;
  inputs.forEach((input) => {
    tx.addInput(Buffer.from(input.txid, 'hex').reverse(), input.vout, RBF_SEQUENCE);
  });
  tx.addOutput(
    Buffer.from(encodeMinimalOpReturn(encodeMarker(NETWORK.REGTEST, payload))),
    0n,
  );
  outputs.forEach((output) =>
    tx.addOutput(Buffer.from(output.script, 'hex'), output.value),
  );
  inputs.forEach((_input, index) => tx.setWitness(index, [Buffer.alloc(64, index + 1)]));
  return tx;
}

function feePrevout(byte: number, value = 5_000n): Prevout {
  return {
    txid: txid(byte),
    vout: 0,
    value,
    scriptPubKeyHex: p2wpkh(byte),
    confirmedHeight: 1,
  };
}

const createFee = feePrevout(0x11, 50_000n);
const create = transaction(
  {
    operation: 'CREATE',
    ruleset: 1,
    laneCount: 2,
    durationBlocks: 144,
    maxSteps: 5,
    seed: '000102030405060708090a0b0c0d0e0f',
    title: 'Dawn',
  },
  [createFee],
  [
    { value: 1_000n, script: p2tr(0xaa) },
    { value: 1_000n, script: p2tr(0xbb) },
    { value: 47_000n, script: p2wpkh(0x11) },
  ],
);

const bloomFee = feePrevout(0x22);
const bloom = transaction(
  { operation: 'BLOOM', glyph: 7, palette: 3, motion: 2, magnitude: 200 },
  [{ txid: create.getId(), vout: 1 }, bloomFee],
  [
    { value: 1_000n, script: p2tr(0xcc) },
    { value: 4_000n, script: p2wpkh(0x22) },
  ],
);

const graftFee = feePrevout(0x33);
const graft = transaction(
  {
    operation: 'GRAFT',
    targetEventTxid: bloom.getId(),
    relation: 2,
    glyph: 12,
    palette: 5,
  },
  [{ txid: bloom.getId(), vout: 1 }, graftFee],
  [
    { value: 1_000n, script: p2tr(0xdd) },
    { value: 4_000n, script: p2wpkh(0x33) },
  ],
);

const rendezvousFee = feePrevout(0x44);
const rendezvous = transaction(
  { operation: 'RENDEZVOUS', bridgeStyle: 4, glyph: 18, palette: 9, intensity: 220 },
  [{ txid: graft.getId(), vout: 1 }, { txid: create.getId(), vout: 2 }, rendezvousFee],
  [
    { value: 1_000n, script: p2tr(0xee) },
    { value: 1_000n, script: p2tr(0xff) },
    { value: 4_000n, script: p2wpkh(0x44) },
  ],
);

const closeFee = feePrevout(0x55);
const close = transaction(
  { operation: 'CLOSE', reason: 1 },
  [{ txid: rendezvous.getId(), vout: 1 }, closeFee],
  [{ value: 5_000n, script: p2wpkh(0x55) }],
);

const entries = [
  { name: 'create', height: 100, tx: create, prevouts: [createFee] },
  { name: 'bloom', height: 101, tx: bloom, prevouts: [bloomFee] },
  { name: 'graft', height: 102, tx: graft, prevouts: [graftFee] },
  { name: 'rendezvous', height: 103, tx: rendezvous, prevouts: [rendezvousFee] },
  { name: 'close', height: 104, tx: close, prevouts: [closeFee] },
];

process.stdout.write(
  `${JSON.stringify(
    entries.map((entry, index) => ({
      name: entry.name,
      height: entry.height,
      blockHash: txid(0x80 + index),
      previousHash: index === 0 ? null : txid(0x80 + index - 1),
      txid: entry.tx.getId(),
      hex: entry.tx.toHex(),
      prevouts: entry.prevouts.map((prevout) => ({
        ...prevout,
        value: prevout.value.toString(),
      })),
    })),
    null,
    2,
  )}\n`,
);
