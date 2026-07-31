/**
 * Verified values for the documentation.
 *
 * Everything here is read from the built package, not typed by hand. A page
 * writes {{MAX_LANES}} and gets the number the code enforces, so a limit can
 * never drift between the protocol and its documentation.
 */

import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function formatNumber(value) {
  return typeof value === 'bigint' || typeof value === 'number'
    ? Number(value).toLocaleString('en-US')
    : String(value);
}

export async function loadFacts() {
  let module;
  try {
    module = await import(new URL('../../dist/index.js', import.meta.url));
  } catch (error) {
    throw new Error(
      'The documentation build needs dist/. Run "npm run build" first. ' +
        (error instanceof Error ? error.message : String(error)),
    );
  }
  const packageJson = require('../../package.json');
  const declarations = await readTypeDeclarations();

  const values = {
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    NODE_ENGINE: packageJson.engines.node,
    PROTOCOL_MAGIC: module.PROTOCOL_MAGIC,
    PROTOCOL_MAGIC_HEX: Buffer.from(module.PROTOCOL_MAGIC_BYTES).toString('hex'),
    PROTOCOL_VERSION: module.PROTOCOL_VERSION,
    RULESET_VERSION: module.RULESET_VERSION,
    HEADER_BYTES: module.HEADER_BYTES,
    MAX_MARKER_BYTES: module.MAX_MARKER_BYTES,
    CARRIER_VALUE_SATS: formatNumber(module.CARRIER_VALUE_SATS),
    CARRIER_VALUE_SATS_RAW: String(module.CARRIER_VALUE_SATS),
    RBF_SEQUENCE_HEX: `0x${module.RBF_SEQUENCE.toString(16)}`,
    TX_VERSION: module.TX_VERSION,
    MIN_LANES: module.MIN_LANES,
    MAX_LANES: module.MAX_LANES,
    MIN_DURATION_BLOCKS: formatNumber(module.MIN_DURATION_BLOCKS),
    MAX_DURATION_BLOCKS: formatNumber(module.MAX_DURATION_BLOCKS),
    MIN_DURATION_DAYS: Math.round(module.MIN_DURATION_BLOCKS / 144),
    MAX_DURATION_DAYS: Math.round(module.MAX_DURATION_BLOCKS / 144),
    MIN_MAX_STEPS: module.MIN_MAX_STEPS,
    MAX_MAX_STEPS: formatNumber(module.MAX_MAX_STEPS),
    SEED_BYTES: module.SEED_BYTES,
    MAX_TITLE_BYTES: module.MAX_TITLE_BYTES,
    TITLE_PATTERN: module.TITLE_PATTERN.source,
    MAX_GLYPH: module.MAX_GLYPH,
    MAX_PALETTE: module.MAX_PALETTE,
    MAX_MOTION: module.MAX_MOTION,
    MAX_RELATION: module.MAX_RELATION,
    MAX_BRIDGE_STYLE: module.MAX_BRIDGE_STYLE,
    GLYPH_COUNT: module.MAX_GLYPH + 1,
    PALETTE_COUNT: module.MAX_PALETTE + 1,
    MOTION_COUNT: module.MAX_MOTION + 1,
    RELATION_COUNT: module.MAX_RELATION + 1,
    BRIDGE_STYLE_COUNT: module.MAX_BRIDGE_STYLE + 1,
    P2TR_SCRIPT_BYTES: module.P2TR_SCRIPT_BYTES,
    OPERATION_COUNT: Object.keys(module.OPCODE).length,
    EXPORT_COUNT: declarations.length,
  };

  const networks = Object.entries(module.NETWORK).map(([name, id]) => ({
    name: module.NETWORK_NAME[id],
    constant: name,
    id,
  }));

  const operations = Object.entries(module.OPCODE).map(([name, opcode]) => ({
    name,
    opcode,
    opcodeHex: `0x${opcode.toString(16).padStart(2, '0')}`,
  }));

  return { values, networks, operations, declarations, module };
}

const DECLARATION_PATTERN =
  /^declare\s+(?<kind>function|class|const|type|interface|enum)\s+(?<name>[A-Za-z_$][\w$]*)/u;

/** Read the exported names and signatures from the generated type declarations. */
export async function readTypeDeclarations() {
  let source;
  try {
    source = await readFile(new URL('../../dist/index.d.ts', import.meta.url), 'utf8');
  } catch {
    return [];
  }
  const lines = source.replace(/\r\n/gu, '\n').split('\n');
  const declarations = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = DECLARATION_PATTERN.exec(line.trim());
    if (match === null) continue;
    const { kind, name } = match.groups;
    const signature = [line.trim()];
    let depth = countBraces(line);
    let cursor = index;
    while (depth > 0 && cursor + 1 < lines.length) {
      cursor += 1;
      signature.push(lines[cursor]);
      depth += countBraces(lines[cursor]);
    }
    declarations.push({
      kind,
      name,
      signature: signature.join('\n').replace(/^declare\s+/u, ''),
    });
  }
  const exported = new Set();
  const exportBlock = /export\s*\{([^}]*)\}/gu;
  let match = exportBlock.exec(source);
  while (match !== null) {
    for (const entry of match[1].split(',')) {
      const parts = entry.trim().split(/\s+as\s+/u);
      const name = (parts[1] ?? parts[0]).replace(/^type\s+/u, '').trim();
      if (name !== '') exported.add(name);
    }
    match = exportBlock.exec(source);
  }
  return declarations
    .filter((item) => exported.size === 0 || exported.has(item.name))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function countBraces(line) {
  let depth = 0;
  for (const character of line) {
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
  }
  return depth;
}
