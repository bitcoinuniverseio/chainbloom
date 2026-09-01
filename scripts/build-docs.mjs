/**
 * Build the ChainBloom documentation into static pages under site/docs.
 *
 * Every page is written to disk complete: navigation, table of contents,
 * previous and next links, breadcrumbs, and body text are all in the HTML.
 * The build also writes the search index, the sitemap, and the journey data
 * the "Start here" picker reads.
 *
 * Run it with `npm run build:docs` after `npm run build`.
 */

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GLOSSARY, JOURNEYS, SECTIONS, SITE } from '../content/site.mjs';
import { loadFacts } from './docs/facts.mjs';
import { buildGeneratedBlocks } from './docs/generated.mjs';
import { readFrontMatter } from './docs/frontmatter.mjs';
import { renderMarkdown, toPlainText } from './docs/markdown.mjs';
import { renderPage } from './docs/shell.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'content', 'pages');
const OUTPUT_DIR = join(ROOT, 'site', 'docs');

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files.sort();
}

function requireString(data, key, label) {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label}: front matter needs a ${key}`);
  }
  return value.trim();
}

function pageUrl(id) {
  return id === '' ? `${SITE.docsPath}/` : `${SITE.docsPath}/${id}/`;
}

function makeLinkResolver(label, collected) {
  return (href) => {
    if (/^(?:https?:|mailto:)/u.test(href)) return href;
    if (href.startsWith('#')) return href;
    if (href === 'app') return SITE.appUrl;
    if (href.startsWith('repo:')) return `${SITE.repoUrl}/blob/main/${href.slice(5)}`;
    if (href.startsWith('/docs/')) {
      const rest = href.slice(6).replace(/\/$/u, '');
      const [path, hash] = rest.split('#');
      collected.push({ from: label, target: path });
      return `${pageUrl(path)}${hash === undefined ? '' : `#${hash}`}`;
    }
    if (href.startsWith('/')) return `${SITE.basePath}${href}`;
    const [path, hash] = href.replace(/\/$/u, '').split('#');
    collected.push({ from: label, target: path });
    return `${pageUrl(path)}${hash === undefined ? '' : `#${hash}`}`;
  };
}

function breadcrumbsFor(page, section) {
  const crumbs = [{ label: 'Documentation', href: `${SITE.docsPath}/` }];
  if (page.id === '') return crumbs;
  crumbs.push({ label: section.title, href: `${SITE.docsPath}/${section.id}/` });
  if (page.id !== section.id) {
    crumbs.push({ label: page.navTitle ?? page.title, href: page.url });
  }
  return crumbs;
}

/** `learn/index.md` is the landing page for the learn section, not a child page. */
function normalizeId(rawId) {
  return rawId.endsWith('/index') ? rawId.slice(0, -'/index'.length) : rawId;
}

function readingMinutes(text) {
  const words = text.split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.round(words / 210));
}

async function main() {
  const facts = await loadFacts();
  const generated = await buildGeneratedBlocks(facts);
  const glossary = new Map(
    GLOSSARY.map((entry) => [entry.term, { short: entry.short, long: entry.long }]),
  );

  const files = [join(ROOT, 'content', 'home.md'), ...(await collectFiles(CONTENT_DIR))];
  if (files.length <= 1) throw new Error('No documentation pages found in content/pages');

  const linkTargets = [];
  const pages = [];

  for (const file of files) {
    const label = relative(ROOT, file).replaceAll('\\', '/');
    const source = await readFile(file, 'utf8');
    const { data, body } = readFrontMatter(source, label);
    const isHome = label === 'content/home.md';
    const id = isHome
      ? ''
      : normalizeId(
          relative(CONTENT_DIR, file).replaceAll('\\', '/').replace(/\.md$/u, ''),
        );
    const section = isHome
      ? { id: 'start', title: 'Documentation', tier: 'participant' }
      : SECTIONS.find((item) => item.id === id.split('/')[0]);
    if (section === undefined) {
      throw new Error(`${label}: "${id.split('/')[0]}" is not a known section`);
    }
    const rendered = renderMarkdown(body, {
      facts: facts.values,
      glossary,
      generated,
      resolveLink: makeLinkResolver(id, linkTargets),
      label,
    });
    const plain = toPlainText(rendered.html);
    const cta =
      data.cta === undefined
        ? null
        : {
            title: requireString(data.cta, 'title', `${label} cta`),
            body: typeof data.cta.body === 'string' ? data.cta.body : null,
            label: requireString(data.cta, 'label', `${label} cta`),
            href: makeLinkResolver(
              id,
              linkTargets,
            )(requireString(data.cta, 'href', `${label} cta`)),
          };

    pages.push({
      id,
      isHome,
      section: section.id,
      sectionTitle: section.title,
      tier: section.tier,
      url: pageUrl(id),
      title: requireString(data, 'title', label),
      navTitle: typeof data.nav === 'string' ? data.nav : null,
      description: requireString(data, 'description', label),
      socialTitle: typeof data.socialTitle === 'string' ? data.socialTitle : null,
      socialDescription:
        typeof data.socialDescription === 'string' ? data.socialDescription : null,
      order: typeof data.order === 'number' ? data.order : 999,
      updated: requireString(data, 'updated', label),
      verified:
        typeof data.verified === 'string'
          ? data.verified
          : `${facts.values.PACKAGE_NAME}@${facts.values.PACKAGE_VERSION}`,
      audiences: Array.isArray(data.audiences) ? data.audiences : [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      relatedIds: Array.isArray(data.related) ? data.related : [],
      cta,
      body: rendered.html,
      toc: rendered.toc,
      codeBlocks: rendered.codeBlocks,
      demos: rendered.demos,
      checklists: rendered.checklists,
      glossaryTerms: rendered.glossaryTerms,
      plain,
      readingMinutes: readingMinutes(plain),
      label,
    });
  }

  const byId = new Map(pages.map((page) => [page.id, page]));

  for (const link of linkTargets) {
    if (!byId.has(link.target)) {
      throw new Error(
        `${link.from}: link points at a page that does not exist: ${link.target}`,
      );
    }
  }
  for (const journey of JOURNEYS) {
    for (const step of journey.steps) {
      if (!byId.has(step)) {
        throw new Error(
          `Journey "${journey.id}" lists a page that does not exist: ${step}`,
        );
      }
    }
  }

  const nav = SECTIONS.map((section) => ({
    ...section,
    url: `${SITE.docsPath}/${section.id}/`,
    pages: pages
      .filter((page) => page.section === section.id && !page.isHome)
      .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))
      .map((page) => ({
        id: page.id,
        url: page.url,
        title: page.title,
        navTitle: page.navTitle,
        description: page.description,
      })),
  })).filter((section) => section.pages.length > 0);

  const flat = nav.flatMap((section) => section.pages);

  await rm(OUTPUT_DIR, { recursive: true, force: true });

  const written = [];
  for (const page of pages) {
    const section = nav.find((item) => item.id === page.section);
    const position = flat.findIndex((item) => item.id === page.id);
    const previous = page.isHome || position <= 0 ? null : flat[position - 1];
    const next = page.isHome
      ? (flat[0] ?? null)
      : position >= 0 && position < flat.length - 1
        ? flat[position + 1]
        : null;
    const related = page.relatedIds.map((id) => {
      const target = byId.get(id);
      if (target === undefined) {
        throw new Error(`${page.label}: related page does not exist: ${id}`);
      }
      return {
        url: target.url,
        title: target.title,
        description: target.description,
        sectionTitle: target.sectionTitle,
      };
    });

    const html = renderPage(
      {
        ...page,
        breadcrumbs: breadcrumbsFor(page, section),
        previous,
        next,
        related,
        socialImage: SITE.socialImage,
      },
      nav,
    );
    const outFile = join(OUTPUT_DIR, page.id, 'index.html');
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');
    written.push(page.url);
  }

  await writeFile(
    join(OUTPUT_DIR, 'search-index.json'),
    JSON.stringify(buildSearchIndex(pages)),
    'utf8',
  );
  await writeFile(
    join(OUTPUT_DIR, 'journeys.json'),
    JSON.stringify(buildJourneyData(byId)),
    'utf8',
  );
  await writeSitemap(written);
  const manifest = await publishManifest();
  await writeLlmsTxt(pages, nav, manifest);

  console.log(
    `Documentation built: ${pages.length} pages, ${flat.length} in navigation, ` +
      `${GLOSSARY.length} glossary entries.`,
  );
}

function buildSearchIndex(pages) {
  return {
    generated: pages.length,
    pages: pages.map((page) => ({
      i: page.id,
      u: page.url,
      t: page.title,
      d: page.description,
      s: page.sectionTitle,
      r: page.tier,
      k: page.keywords.join(' '),
      h: page.toc.map((entry) => ({ t: entry.text, a: entry.id })),
      b: page.plain.slice(0, 1400),
    })),
  };
}

function buildJourneyData(byId) {
  return JOURNEYS.map((journey) => ({
    id: journey.id,
    label: journey.label,
    summary: journey.summary,
    detail: journey.detail,
    icon: journey.icon,
    steps: journey.steps.map((step) => {
      const page = byId.get(step);
      return {
        id: page.id,
        url: page.url,
        title: page.title,
        description: page.description,
        minutes: page.readingMinutes,
      };
    }),
  }));
}

/**
 * Write site/llms.txt: one absolute link per published page, with the
 * description that page already carries in its front matter. It is generated
 * from the same page list as the sitemap, so it cannot name a page that was
 * not built.
 */
async function writeLlmsTxt(pages, nav, manifest) {
  const byId = new Map(pages.map((page) => [page.id, page]));
  const home = byId.get('');
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}`,
    '>',
    '> ChainBloom is a Bitcoin protocol for shared creative history. People join',
    '> a world, add to a path, and every step is a real Bitcoin transaction that',
    '> anyone can replay from the chain.',
    '',
    'ChainBloom has no project token, no custody, and no trading venue. The',
    'Bitcoin Universe capability snapshot records no marketplace for ChainBloom,',
    'so no Bitcoin Universe product implements a buy, sell, or settle path for',
    'anything created with it.',
    '',
    'Every link below is a page this site publishes.',
    '',
    '## Site',
    '',
    `- [${SITE.name}](${SITE.origin}${SITE.basePath}/): the public introduction,`,
    '  with the five actions and the questions worth asking before you take part.',
    `- [${home.title}](${SITE.origin}${home.url}): ${home.description}`,
    '',
  ];

  for (const section of nav) {
    lines.push(`## ${section.title}`, '');
    for (const page of section.pages) {
      lines.push(`- [${page.title}](${SITE.origin}${page.url}): ${page.description}`);
    }
    lines.push('');
  }

  lines.push(
    '## Machine readable',
    '',
    `- [docs.manifest.json](${SITE.origin}${SITE.basePath}/docs.manifest.json): the`,
    '  documentation manifest for this repository.',
    `- [sitemap.xml](${SITE.origin}${SITE.basePath}/sitemap.xml): every page above,`,
    '  as a sitemap.',
    `- [robots.txt](${SITE.origin}${SITE.basePath}/robots.txt): the crawl policy.`,
    '',
    '## Source',
    '',
    `- [Repository](https://github.com/${manifest.repository}): the protocol`,
    '  library, the command line tool, the interoperability vectors, and the',
    '  source of these pages.',
    '',
  );

  await writeFile(join(ROOT, 'site', 'llms.txt'), lines.join('\n'), 'utf8');
}

/**
 * Publish the repository manifest at the site root. The authored copy stays at
 * the repository root; this is the copy tooling can fetch over HTTP. Returns
 * the parsed manifest so llms.txt can name the same repository.
 */
async function publishManifest() {
  const source = await readFile(join(ROOT, 'docs.manifest.json'), 'utf8');
  await writeFile(join(ROOT, 'site', 'docs.manifest.json'), source, 'utf8');
  return JSON.parse(source);
}

async function writeSitemap(docsUrls) {
  const urls = [`${SITE.basePath}/`, ...docsUrls];
  const body = urls
    .map(
      (url) =>
        `  <url><loc>${SITE.origin}${url}</loc><changefreq>weekly</changefreq>` +
        `<priority>${url === `${SITE.basePath}/` ? '1.0' : '0.7'}</priority></url>`,
    )
    .join('\n');
  await writeFile(
    join(ROOT, 'site', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    'utf8',
  );
}

await main();
