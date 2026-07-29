import { readFile } from 'node:fs/promises';

import type { IndexedBlock, Prevout } from '../src/types.js';

export interface TransactionFixture {
  readonly name: string;
  readonly height: number;
  readonly blockHash: string;
  readonly previousHash: string | null;
  readonly txid: string;
  readonly hex: string;
  readonly prevouts: readonly (Omit<Prevout, 'value'> & { readonly value: string })[];
}

export async function loadFixtures(): Promise<readonly TransactionFixture[]> {
  return JSON.parse(
    await readFile(new URL('../fixtures/transactions.json', import.meta.url), 'utf8'),
  ) as unknown as readonly TransactionFixture[];
}

export function fixtureBlock(fixture: TransactionFixture): IndexedBlock {
  return {
    hash: fixture.blockHash,
    previousHash: fixture.previousHash,
    height: fixture.height,
    transactions: [
      {
        hex: fixture.hex,
        prevouts: fixture.prevouts.map((prevout) => ({
          ...prevout,
          value: BigInt(prevout.value),
        })),
      },
    ],
  };
}
