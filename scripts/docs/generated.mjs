/**
 * Reference tables built from the implementation, not written by hand.
 *
 * A page asks for one with `:::generated name=error-index`. If a constant
 * changes, a new error code appears, or an export is renamed, the table
 * changes with it on the next build.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { escapeHtml } from './markdown.mjs';

const SRC = fileURLToPath(new URL('../../src', import.meta.url));

function table(headings, rows, label) {
  const head = headings.map((cell) => `<th>${escapeHtml(cell)}</th>`).join('');
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
  return (
    `<div class="table-scroll" tabindex="0" role="region" aria-label="${escapeHtml(label)}">` +
    `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
  );
}

function code(value) {
  return `<code>${escapeHtml(String(value))}</code>`;
}

/** Every error code the package can raise, with the file that raises it. */
export async function readErrorCodes() {
  const files = (await readdir(SRC)).filter((name) => name.endsWith('.ts'));
  const found = new Map();
  for (const name of files) {
    const source = await readFile(join(SRC, name), 'utf8');
    const patterns = [
      /new ChainBloomError\(\s*'([A-Z_0-9]+)',\s*(?:`([^`]*)`|'([^']*)')/gu,
      /\bissue\(\s*'([A-Z_0-9]+)',\s*(?:`([^`]*)`|'([^']*)')/gu,
    ];
    for (const pattern of patterns) {
      let match = pattern.exec(source);
      while (match !== null) {
        const message = (match[2] ?? match[3] ?? '').replace(/\$\{[^}]*\}/gu, '…').trim();
        if (!found.has(match[1])) {
          found.set(match[1], { code: match[1], message, file: `src/${name}` });
        }
        match = pattern.exec(source);
      }
    }
  }
  return [...found.values()].sort((left, right) => left.code.localeCompare(right.code));
}

const CONSTANT_NOTES = {
  PROTOCOL_MAGIC: 'The four letters that begin every marker.',
  PROTOCOL_VERSION: 'The marker format version.',
  RULESET_VERSION: 'The rules a world is created under.',
  HEADER_BYTES: 'Bytes before the operation fields begin.',
  MAX_MARKER_BYTES: 'The largest a whole marker may be.',
  CARRIER_VALUE_SATS: 'The exact value of every path output.',
  RBF_SEQUENCE: 'The nSequence every input must use.',
  TX_VERSION: 'The transaction version every action uses.',
  MIN_LANES: 'The fewest paths a world may have.',
  MAX_LANES: 'The most paths a world may have.',
  MIN_DURATION_BLOCKS: 'The shortest a world may stay open.',
  MAX_DURATION_BLOCKS: 'The longest a world may stay open.',
  MIN_MAX_STEPS: 'The smallest step limit a world may set.',
  MAX_MAX_STEPS: 'The largest step limit a world may set.',
  SEED_BYTES: 'The size of a world seed.',
  MAX_TITLE_BYTES: 'The longest a world title may be.',
  MAX_GLYPH: 'The highest glyph number.',
  MAX_PALETTE: 'The highest palette number.',
  MAX_MOTION: 'The highest motion number.',
  MAX_RELATION: 'The highest relation number on an echo.',
  MAX_BRIDGE_STYLE: 'The highest bridge style on a meeting.',
  P2TR_SCRIPT_BYTES: 'The length of a Taproot output script.',
  OP_RETURN: 'The Bitcoin opcode that begins the marker output.',
  SIGHASH_DEFAULT: 'The Taproot signature type a signer may use.',
  SIGHASH_ALL: 'The signature type every other input must use.',
  TXID_BYTES: 'The length of a transaction id.',
};

const CONSTANT_ORDER = Object.keys(CONSTANT_NOTES);

export async function buildGeneratedBlocks(facts) {
  const module = facts.module;
  const errors = await readErrorCodes();

  const constants = table(
    ['Name', 'Value', 'What it is'],
    CONSTANT_ORDER.filter((name) => module[name] !== undefined).map((name) => {
      const value = module[name];
      const shown =
        typeof value === 'bigint'
          ? `${value.toString()}`
          : typeof value === 'number' && value > 255 && name.includes('SEQUENCE')
            ? `0x${value.toString(16)}`
            : String(value);
      return [code(name), code(shown), escapeHtml(CONSTANT_NOTES[name])];
    }),
    'Protocol constants',
  );

  const operationRows = [
    [
      'CREATE',
      'Create',
      'Opens a world and its paths',
      '0',
      'lane count',
      '23 + title length',
    ],
    ['BLOOM', 'Bloom', 'Adds one moment to a path', '1', '1', '4'],
    ['GRAFT', 'Echo', 'Adds a moment that names an earlier event', '1', '1', '35'],
    ['RENDEZVOUS', 'Meet', 'Two paths share a moment and both continue', '2', '2', '4'],
    ['CLOSE', 'Complete', 'Ends a path with no successor', '1', '0', '1'],
  ];
  const operations = table(
    [
      'Opcode name',
      'Shown as',
      'What it does',
      'Path inputs',
      'Path outputs',
      'Payload bytes',
    ],
    operationRows.map((row) => {
      const opcode = module.OPCODE[row[0]];
      return [
        `${code(row[0])} <span class="tag">${`0x${opcode.toString(16).padStart(2, '0')}`}</span>`,
        escapeHtml(row[1]),
        escapeHtml(row[2]),
        code(row[3]),
        code(row[4]),
        code(row[5]),
      ];
    }),
    'The five operations',
  );

  const networks = table(
    ['Network', 'Byte', 'Constant'],
    facts.networks.map((item) => [
      escapeHtml(item.name),
      code(item.id),
      code(`NETWORK.${item.constant}`),
    ]),
    'Network bytes',
  );

  const errorIndex = table(
    ['Code', 'Message', 'Raised in'],
    errors.map((item) => [code(item.code), escapeHtml(item.message), code(item.file)]),
    'Error and issue codes',
  );

  const KIND_LABEL = {
    function: 'function',
    class: 'class',
    const: 'value',
    type: 'type',
    interface: 'type',
    enum: 'type',
  };
  const apiSurface = table(
    ['Export', 'Kind'],
    facts.declarations.map((item) => [
      code(item.name),
      escapeHtml(KIND_LABEL[item.kind] ?? item.kind),
    ]),
    'Exported names',
  );

  const markerLayout = table(
    ['Offset', 'Bytes', 'Field', 'Value'],
    [
      ['0', '4', 'magic', `${code(facts.values.PROTOCOL_MAGIC_HEX)} — the letters CBLM`],
      ['4', '1', 'version', `${code(facts.values.PROTOCOL_VERSION)}`],
      ['5', '1', 'network', 'mainnet 0, testnet4 1, signet 2, regtest 3'],
      ['6', '1', 'opcode', '0x01 to 0x05'],
      ['7', '1', 'payload length', 'the exact number of bytes that follow'],
      ['8', 'varies', 'payload', 'the fields of the chosen action'],
    ].map((row) => [code(row[0]), code(row[1]), code(row[2]), row[3]]),
    'Marker layout',
  );

  return new Map([
    ['constants-table', constants],
    ['operations-table', operations],
    ['networks-table', networks],
    ['error-index', errorIndex],
    ['api-surface', apiSurface],
    ['marker-layout', markerLayout],
  ]);
}
