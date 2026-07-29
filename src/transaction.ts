import { Transaction } from 'bitcoinjs-lib';

import { bytesToHex, hexToBytes, reverseBytes } from './bytes.js';
import { ChainBloomError } from './errors.js';
import type { ParsedTransaction } from './types.js';

export function parseTransactionHex(hex: string): ParsedTransaction {
  const normalized = bytesToHex(hexToBytes(hex, 'transaction'));
  let transaction: Transaction;
  try {
    transaction = Transaction.fromHex(normalized);
  } catch (error) {
    throw new ChainBloomError(
      'INVALID_TRANSACTION',
      'Unable to parse Bitcoin transaction',
      {
        cause: error instanceof Error ? error.message : String(error),
      },
    );
  }
  const inputs = transaction.ins.map((input) => ({
    txid: bytesToHex(reverseBytes(input.hash)),
    vout: input.index,
    sequence: input.sequence,
    scriptSigHex: bytesToHex(input.script),
    witness: input.witness.map((item) => bytesToHex(item)),
  }));
  const outputs = transaction.outs.map((output) => ({
    value: output.value,
    scriptPubKeyHex: bytesToHex(output.script),
  }));
  return {
    txid: transaction.getId(),
    wtxid: bytesToHex(reverseBytes(transaction.getHash(true))),
    version: transaction.version,
    locktime: transaction.locktime,
    virtualSize: transaction.virtualSize(),
    weight: transaction.weight(),
    hasWitness: transaction.hasWitnesses(),
    inputs,
    outputs,
    hex: normalized,
  };
}
