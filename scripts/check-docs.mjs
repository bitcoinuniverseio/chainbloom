/**
 * Checks the built documentation before it is published.
 *
 * It fails on a broken internal link, a missing or badly sized description, a
 * heading that skips a level, an image with no alt text, a control with no
 * accessible name, a page missing from the sitemap or the search index, a
 * claim this project does not allow, and a code sample marked `verify` that
 * does not run and print what the page says it prints.
 *
 * Run it with `npm run check:docs` after `npm run build:docs`.
 */

import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { SITE } from '../content/site.mjs';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS_DIR = join(ROOT, 'site', 'docs');
const CONTENT_DIR = join(ROOT, 'content');
const problems = [];

function fail(where, message) {
  problems.push(`${where}: ${message}`);
}

async function collect(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full, extension)));
    else if (entry.name.endsWith(extension)) files.push(full);
  }
  return files;
}

/* -------------------------------------------------------------- the pages */

const pageFiles = await collect(DOCS_DIR, '.html');
if (pageFiles.length === 0) {
  console.error('No built pages found. Run "npm run build:docs" first.');
  process.exit(1);
}

const builtUrls = new Set(
  pageFiles.map((file) => {
    const inside = relative(DOCS_DIR, dirname(file)).replaceAll('\\', '/');
    return inside === '' || inside === '.'
      ? `${SITE.docsPath}/`
      : `${SITE.docsPath}/${inside}/`;
  }),
);

function attribute(html, pattern) {
  const match = pattern.exec(html);
  return match === null ? null : match[1];
}

for (const file of pageFiles) {
  const where = relative(ROOT, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');

  if (!/<html lang="en"/u.test(html)) fail(where, 'the page has no language');
  const title = attribute(html, /<title>([^<]*)<\/title>/u);
  if (title === null || title.trim() === '') fail(where, 'the page has no title');
  else if (title.length > 70)
    fail(where, `the title is ${title.length} characters, over 70`);

  const description = attribute(html, /<meta name="description" content="([^"]*)"/u);
  if (description === null || description.trim() === '') {
    fail(where, 'the page has no description');
  } else if (description.length < 50 || description.length > 200) {
    fail(where, `the description is ${description.length} characters, outside 50 to 200`);
  }

  for (const required of [
    /<link rel="canonical" href="https:\/\//u,
    /<meta property="og:title"/u,
    /<meta property="og:description"/u,
    /<meta property="og:image"/u,
    /<meta name="twitter:card" content="summary_large_image"/u,
    /<script type="application\/ld\+json">/u,
  ]) {
    if (!required.test(html)) fail(where, `missing required metadata: ${required.source}`);
  }

  const headingLevels = [...html.matchAll(/<h([1-4])[\s>]/gu)].map((match) =>
    Number(match[1]),
  );
  if (headingLevels.filter((level) => level === 1).length !== 1) {
    fail(where, 'a page must have exactly one h1');
  }
  let previous = 0;
  for (const level of headingLevels) {
    if (previous !== 0 && level > previous + 1) {
      fail(where, `heading level jumps from h${previous} to h${level}`);
    }
    previous = level;
  }

  for (const image of html.matchAll(/<img\b([^>]*)>/gu)) {
    if (!/\balt=/u.test(image[1])) fail(where, 'an image has no alt attribute');
  }

  for (const control of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gu)) {
    const text = control[2].replace(/<[^>]+>/gu, '').trim();
    if (text === '' && !/aria-label=/u.test(control[1])) {
      fail(where, 'a button has neither text nor an accessible name');
    }
  }

  for (const link of html.matchAll(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gu)) {
    const href = link[2];
    const text = link[4].replace(/<[^>]+>/gu, '').trim();
    const imageName = /\balt="([^"]+)"/u.exec(link[4]);
    const named =
      text !== '' || /aria-label=/u.test(link[1] + link[3]) || imageName !== null;
    if (!named) fail(where, `a link to ${href} has no accessible name`);
    if (href === '#' || href === '') fail(where, 'a link has an empty target');
    if (!href.startsWith(SITE.basePath)) continue;
    const [path] = href.split('#');
    if (path.endsWith('/')) {
      if (
        !builtUrls.has(path) &&
        !existsSync(join(ROOT, 'site', path.slice(SITE.basePath.length + 1), 'index.html'))
      ) {
        if (path !== `${SITE.basePath}/`) fail(where, `internal link is broken: ${path}`);
      }
    } else {
      const asset = join(ROOT, 'site', path.slice(SITE.basePath.length));
      if (!existsSync(asset)) fail(where, `internal link is broken: ${path}`);
    }
  }

  for (const source of html.matchAll(/\b(?:src|href)="(\/chainbloom\/assets\/[^"]+)"/gu)) {
    const asset = join(ROOT, 'site', source[1].slice(SITE.basePath.length));
    if (!existsSync(asset)) fail(where, `missing asset: ${source[1]}`);
  }

  if (/:::/u.test(html)) fail(where, 'an unparsed ":::" block reached the page');
  if (/\{\{[A-Z_]+\}\}/u.test(html))
    fail(where, 'an unreplaced {{TOKEN}} reached the page');
}

/* --------------------------------------------------- sitemap and search */

const sitemap = await readFile(join(ROOT, 'site', 'sitemap.xml'), 'utf8');
for (const url of builtUrls) {
  if (!sitemap.includes(`${SITE.origin}${url}<`))
    fail('site/sitemap.xml', `missing ${url}`);
}

const searchIndex = JSON.parse(await readFile(join(DOCS_DIR, 'search-index.json'), 'utf8'));
const indexed = new Set(searchIndex.pages.map((page) => page.u));
for (const url of builtUrls) {
  if (!indexed.has(url)) fail('search index', `missing ${url}`);
}
for (const page of searchIndex.pages) {
  if (page.b.trim().length < 120) fail('search index', `${page.u} has almost no body text`);
}

const journeys = JSON.parse(await readFile(join(DOCS_DIR, 'journeys.json'), 'utf8'));
if (journeys.length < 6) fail('journeys.json', 'fewer than six reading paths');

/* ------------------------------------------------------- claims in content */

const BANNED = [
  /\bcomprehensive\b/i,
  /\brobust\b/i,
  /\bseamless(?:ly)?\b/i,
  /\bcutting[- ]edge\b/i,
  /\bworld[- ]class\b/i,
  /\brevolutionary\b/i,
  /\bstate[- ]of[- ]the[- ]art\b/i,
  /\bbest[- ]in[- ]class\b/i,
  /\bsuccessfully\b/i,
  /\bgame[- ]chang/i,
  /\bunlock the power\b/i,
  /\bproduction[- ]ready\b/i,
];

const FORBIDDEN_CLAIMS = [
  /\binvestment\b/i,
  /\binvest in\b/i,
  /\bROI\b/,
  /\bAPY\b/,
  /\bairdrop\b/i,
  /\bpresale\b/i,
  /\bwhitelist\b/i,
  /\bfloor price\b/i,
  /\bguaranteed\b/i,
  /\bact now\b/i,
  /\bonly \d+ (?:spots|places|seats) (?:left|remain)/i,
  /\bnpm install @chainbloom\/protocol\b/,
  /\b\d[\d,]*\+? (?:worlds|participants|creators|artists|collectors|users) (?:have|are|joined)/i,
];

/**
 * A page is allowed to name a thing in order to reject it. "This is not an
 * investment" and "if a brief says airdrop, refuse it" are exactly the
 * sentences this project wants; only a straight-faced claim is a problem.
 */
const DENIAL =
  /\b(no|not|never|nor|without|avoid|refuse|refusing|instead|rather than|cannot|isn't|aren't|wrong|mistake|misleading|reject)\b/iu;

function isDenial(text, index, match) {
  const start = Math.max(0, text.lastIndexOf('\n', index) + 1);
  const lineEnd = text.indexOf('\n', index);
  const line = text.slice(start, lineEnd === -1 ? text.length : lineEnd);
  if (line.trimStart().startsWith('#')) return true;
  if (line.includes('?')) return true;
  if (new RegExp(`["'“‘][^"'”’]*${match}`, 'iu').test(line)) return true;
  const sentenceStart = Math.max(
    start,
    text.lastIndexOf('. ', index) + 1,
    text.lastIndexOf('; ', index) + 1,
  );
  const sentenceEnd = text.indexOf('.', index);
  const sentence = text.slice(
    sentenceStart,
    sentenceEnd === -1 ? text.length : sentenceEnd + 1,
  );
  return DENIAL.test(sentence);
}

const contentFiles = await collect(CONTENT_DIR, '.md');
if (contentFiles.length < 60) {
  fail(
    'content',
    `only ${contentFiles.length} pages exist; the manifest expects at least 60`,
  );
}

const samples = [];
for (const file of contentFiles) {
  const where = relative(ROOT, file).replaceAll('\\', '/');
  const source = await readFile(file, 'utf8');
  const body = source.slice(source.indexOf('\n---\n', 3) + 5);
  const prose = body.replace(/```[\s\S]*?```/gu, '');

  for (const pattern of BANNED) {
    const match = pattern.exec(prose);
    if (match !== null) fail(where, `banned word: "${match[0]}"`);
  }
  for (const pattern of FORBIDDEN_CLAIMS) {
    for (const match of prose.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))) {
      if (isDenial(prose, match.index, match[0])) continue;
      fail(where, `claim this project does not make: "${match[0]}"`);
    }
  }
  if (/^#\s/mu.test(body)) fail(where, 'a page must not use a level one heading');
  if (!/:::lead/u.test(body)) fail(where, 'a page must open with a :::lead block');
  if (!/^cta:/mu.test(source))
    fail(where, 'a page must end with a cta in its front matter');

  for (const fence of body.matchAll(/```(\w+)([^\n]*)\n([\s\S]*?)```/gu)) {
    if (!/\bverify\b/u.test(fence[2])) continue;
    samples.push({ where, language: fence[1], code: fence[3] });
  }
}

/* ---------------------------------------------------- runnable code samples */

if (samples.length > 0) {
  const distUrl = join(ROOT, 'dist', 'index.js').replaceAll('\\', '/');
  const directory = await mkdtemp(join(tmpdir(), 'chainbloom-docs-'));
  try {
    for (const [index, sample] of samples.entries()) {
      const file = join(directory, `sample-${index}.ts`);
      await writeFile(
        file,
        sample.code.replaceAll("'@chainbloom/protocol'", `'file:///${distUrl}'`),
        'utf8',
      );
      try {
        const { stdout } = await run('npx', ['tsx', file], {
          cwd: ROOT,
          shell: process.platform === 'win32',
          timeout: 60_000,
        });
        if (stdout.trim() === '') {
          fail(sample.where, 'a sample marked "verify" printed nothing');
        }
      } catch (error) {
        fail(
          sample.where,
          `a sample marked "verify" did not run: ${String(error.stderr ?? error.message).slice(0, 300)}`,
        );
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/* --------------------------------------------------------------- outcome */

if (problems.length > 0) {
  console.error(`Documentation checks failed (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Documentation checks passed: ${pageFiles.length} pages, ${builtUrls.size} routes, ` +
    `${samples.length} runnable samples.`,
);
