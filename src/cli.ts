#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

import { Command } from 'commander';

import {
  buildBloomPsbt,
  buildClosePsbt,
  buildCreatePsbt,
  buildGraftPsbt,
  buildRendezvousPsbt,
} from './builders.js';
import { bytesToHex, jsonStringify } from './bytes.js';
import { decodeMarkerHex, encodeMarker, networkIdFromName } from './codec.js';
import { asChainBloomError } from './errors.js';
import { ChainBloomState } from './state.js';
import { parseTransactionHex } from './transaction.js';
import type { IndexedBlock, OperationPayload } from './types.js';
import type { NetworkId } from './constants.js';

async function readJson<T = Record<string, unknown>>(file: string | URL): Promise<T> {
  return JSON.parse(await readFile(file, 'utf8'), (key, value: unknown) =>
    typeof value === 'string' &&
    (key === 'value' || key.endsWith('Sats')) &&
    /^\d+$/u.test(value)
      ? BigInt(value)
      : value,
  ) as unknown as T;
}

function output(value: unknown): void {
  process.stdout.write(`${jsonStringify(value)}\n`);
}

const program = new Command()
  .name('chainbloom')
  .description('Create and explore ChainBloom histories on Bitcoin')
  .showHelpAfterError();

const marker = program.command('marker').description('Encode or decode protocol markers');
marker
  .command('encode')
  .requiredOption('-n, --network <network>')
  .requiredOption('-o, --operation <operation>')
  .requiredOption('-j, --json <json>')
  .action((options: { network: string; operation: string; json: string }) => {
    const fields = JSON.parse(options.json) as Record<string, unknown>;
    const payload = {
      ...fields,
      operation: options.operation.toUpperCase(),
    } as OperationPayload;
    output({
      markerHex: bytesToHex(encodeMarker(networkIdFromName(options.network), payload)),
    });
  });
marker
  .command('decode')
  .requiredOption('--hex <hex>')
  .action((options: { hex: string }) => output(decodeMarkerHex(options.hex)));

program
  .command('tx')
  .description('Parse a raw Bitcoin transaction')
  .command('parse')
  .requiredOption('--hex <hex>')
  .action((options: { hex: string }) => output(parseTransactionHex(options.hex)));

program
  .command('psbt')
  .description('Build a deterministic unsigned PSBT from JSON')
  .command('build')
  .requiredOption('-o, --operation <operation>')
  .requiredOption('-f, --file <path>')
  .action(async (options: { operation: string; file: string }) => {
    const value = await readJson(options.file);
    const operation = options.operation.toUpperCase();
    const psbt =
      operation === 'CREATE'
        ? buildCreatePsbt(value as unknown as Parameters<typeof buildCreatePsbt>[0])
        : operation === 'BLOOM'
          ? buildBloomPsbt(value as unknown as Parameters<typeof buildBloomPsbt>[0])
          : operation === 'GRAFT'
            ? buildGraftPsbt(value as unknown as Parameters<typeof buildGraftPsbt>[0])
            : operation === 'RENDEZVOUS'
              ? buildRendezvousPsbt(
                  value as unknown as Parameters<typeof buildRendezvousPsbt>[0],
                )
              : operation === 'CLOSE'
                ? buildClosePsbt(value as unknown as Parameters<typeof buildClosePsbt>[0])
                : undefined;
    if (psbt === undefined) throw new Error(`Unknown operation: ${operation}`);
    output({ psbtBase64: psbt.toBase64() });
  });

program
  .command('vectors')
  .description('Verify bundled interoperability vectors')
  .command('verify')
  .action(async () => {
    const vectors = await readJson<
      readonly {
        readonly network: NetworkId;
        readonly markerHex: string;
        readonly payload: OperationPayload;
      }[]
    >(new URL('../vectors/valid-markers.json', import.meta.url));
    for (const vector of vectors) {
      const encoded = bytesToHex(encodeMarker(vector.network, vector.payload));
      if (
        encoded !== vector.markerHex ||
        decodeMarkerHex(encoded).operation !== vector.payload.operation
      ) {
        throw new Error(`Vector mismatch: ${vector.markerHex}`);
      }
    }
    output({ valid: true, verified: vectors.length });
  });

program
  .command('state')
  .description('Replay indexed blocks and print deterministic state')
  .command('replay')
  .requiredOption('-n, --network <network>')
  .requiredOption('-f, --file <path>')
  .action(async (options: { network: string; file: string }) => {
    const blocks = await readJson<readonly IndexedBlock[]>(options.file);
    const state = new ChainBloomState({ network: networkIdFromName(options.network) });
    state.replay(blocks);
    output(state.snapshot());
  });

program.parseAsync().catch((error: unknown) => {
  const converted = asChainBloomError(error);
  process.stderr.write(
    `${jsonStringify({ error: converted.code, message: converted.message })}\n`,
  );
  process.exitCode = 1;
});
