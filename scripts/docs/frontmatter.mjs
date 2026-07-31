/**
 * A small front matter reader for ChainBloom documentation pages.
 *
 * It reads the subset of YAML the content actually uses: scalars, inline
 * arrays, block arrays, and one level of nested maps. Anything outside that
 * subset raises an error instead of being guessed at, so a typo in a page
 * fails the build rather than producing a page with a missing title.
 */

const SCALAR_TRUE = new Set(['true', 'yes']);
const SCALAR_FALSE = new Set(['false', 'no']);

function stripQuotes(value) {
  const first = value[0];
  const last = value.at(-1);
  if (value.length >= 2 && (first === '"' || first === "'") && last === first) {
    return value.slice(1, -1);
  }
  return value;
}

function parseScalar(raw) {
  const value = raw.trim();
  if (value === '') return '';
  if (value.startsWith('[')) {
    if (!value.endsWith(']')) {
      throw new Error(`Unterminated inline list: ${raw}`);
    }
    const inner = value.slice(1, -1).trim();
    if (inner === '') return [];
    return inner.split(',').map((item) => parseScalar(item));
  }
  if (SCALAR_TRUE.has(value)) return true;
  if (SCALAR_FALSE.has(value)) return false;
  if (/^-?\d+$/u.test(value)) return Number(value);
  return stripQuotes(value);
}

function indentOf(line) {
  return line.length - line.trimStart().length;
}

function parseBlock(lines, start, baseIndent) {
  const result = {};
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      index += 1;
      continue;
    }
    const indent = indentOf(line);
    if (indent < baseIndent) break;
    if (indent > baseIndent) {
      throw new Error(`Unexpected indentation in front matter: ${line}`);
    }
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      throw new Error(`List item without a key in front matter: ${line}`);
    }
    const separator = trimmed.indexOf(':');
    if (separator === -1) {
      throw new Error(`Front matter line is not a key and value: ${line}`);
    }
    const key = trimmed.slice(0, separator).trim();
    const rest = trimmed.slice(separator + 1).trim();
    index += 1;
    if (rest !== '') {
      result[key] = parseScalar(rest);
      continue;
    }
    const items = [];
    while (index < lines.length) {
      const next = lines[index];
      if (next.trim() === '') {
        index += 1;
        continue;
      }
      if (indentOf(next) <= baseIndent) break;
      if (!next.trim().startsWith('- ')) break;
      items.push(parseScalar(next.trim().slice(2)));
      index += 1;
    }
    if (items.length > 0) {
      result[key] = items;
      continue;
    }
    const nested = [];
    while (index < lines.length) {
      const next = lines[index];
      if (next.trim() === '') {
        nested.push(next);
        index += 1;
        continue;
      }
      if (indentOf(next) <= baseIndent) break;
      nested.push(next);
      index += 1;
    }
    result[key] =
      nested.length === 0 ? {} : parseBlock(nested, 0, indentOf(nested[0])).data;
  }
  return { data: result, next: index };
}

/**
 * Split a documentation file into its front matter and its body.
 *
 * @param {string} source raw file contents
 * @param {string} label file name used in error messages
 * @returns {{ data: Record<string, unknown>, body: string }}
 */
export function readFrontMatter(source, label = 'page') {
  const normalized = source.replace(/\r\n/gu, '\n');
  if (!normalized.startsWith('---\n')) {
    throw new Error(`${label} must begin with a front matter block`);
  }
  const end = normalized.indexOf('\n---\n', 3);
  if (end === -1) {
    throw new Error(`${label} has an unterminated front matter block`);
  }
  const head = normalized.slice(4, end + 1).split('\n');
  const body = normalized.slice(end + 5);
  try {
    const { data } = parseBlock(head, 0, 0);
    return { data, body };
  } catch (error) {
    throw new Error(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
