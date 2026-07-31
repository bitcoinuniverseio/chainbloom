/**
 * The ChainBloom documentation renderer.
 *
 * It reads a small, strict Markdown dialect plus a handful of block
 * directives. The dialect is deliberately narrow: every construct here is one
 * the documentation actually uses, and anything else raises an error so a
 * mistake shows up in the build instead of on the published page.
 *
 * Extensions beyond ordinary Markdown:
 *   :::note / :::tip / :::warning / :::safety / :::simulation   callouts
 *   :::figure caption="..."                                     framed block
 *   :::cards                                                    link grid
 *   :::steps                                                    numbered flow
 *   :::checklist id=...                                         saved progress
 *   :::demo name=...                                            interactive part
 *   :::codetabs + :::tab label="..."                            language tabs
 *   :::grid                                                     two column block
 *   [[term]] or [[term|shown text]]                             glossary link
 *   {{CONSTANT}}                                                verified value
 *   ```ts title="a.ts" verify                                   checked sample
 */

const CALLOUTS = {
  note: { label: 'Note', icon: '◆' },
  tip: { label: 'Tip', icon: '✦' },
  warning: { label: 'Before you sign', icon: '▲' },
  safety: { label: 'Safety', icon: '⬢' },
  simulation: { label: 'Simulation', icon: '◈' },
};

const CONTAINER_NAMES = new Set([
  ...Object.keys(CALLOUTS),
  'figure',
  'cards',
  'steps',
  'checklist',
  'demo',
  'codetabs',
  'tab',
  'grid',
  'lead',
  'generated',
]);

/* Code spans are lifted out before the text is escaped and put back at the
   end. The marker is spelled out so it can never collide with prose. */
const CODE_MARKER = '%%cb-code-';

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[`*[\]()]/gu, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 64);
}

function parseAttributes(raw, label) {
  const attributes = {};
  const pattern = /([a-zA-Z][\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"']+)))?/gu;
  let match = pattern.exec(raw);
  while (match !== null) {
    attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? true;
    match = pattern.exec(raw);
  }
  if (raw.trim() !== '' && Object.keys(attributes).length === 0) {
    throw new Error(`${label}: could not read attributes from "${raw}"`);
  }
  return attributes;
}

/** Replace {{TOKEN}} with a verified value, failing on an unknown token. */
function applyFacts(source, facts, label) {
  return source.replace(/\{\{([A-Z][A-Z0-9_]*)\}\}/gu, (_match, token) => {
    if (!Object.prototype.hasOwnProperty.call(facts, token)) {
      throw new Error(`${label}: unknown verified value {{${token}}}`);
    }
    return String(facts[token]);
  });
}

class InlineRenderer {
  constructor(context) {
    this.context = context;
    this.codeSpans = [];
  }

  render(text) {
    this.codeSpans = [];
    let working = text.replace(/`([^`]+)`/gu, (_match, code) => {
      this.codeSpans.push(code);
      return `${CODE_MARKER}${this.codeSpans.length - 1}%%`;
    });
    working = escapeHtml(working);
    working = this.renderGlossary(working);
    working = this.renderLinks(working);
    working = working.replace(/\*\*([^*]+)\*\*/gu, '<strong>$1</strong>');
    working = working.replace(/(^|[\s(])\*([^*\n]+)\*/gu, '$1<em>$2</em>');
    working = working.replace(/(^|[\s(])_([^_\n]+)_/gu, '$1<em>$2</em>');
    working = working.replaceAll(' -- ', ' — ');
    working = working.replace(
      new RegExp(`${CODE_MARKER}(\\d+)%%`, 'gu'),
      (_match, index) => `<code>${escapeHtml(this.codeSpans[Number(index)])}</code>`,
    );
    return working;
  }

  renderGlossary(text) {
    return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/gu, (_match, term, shown) => {
      const key = slugify(term);
      const entry = this.context.glossary.get(key);
      if (entry === undefined) {
        throw new Error(`${this.context.label}: unknown glossary term "${term}"`);
      }
      this.context.usedGlossary.add(key);
      const label = shown ?? term;
      return (
        `<button type="button" class="glossary-term" data-term="${key}"` +
        ` aria-describedby="glossary-tip">${label}` +
        `<span class="glossary-inline">${escapeHtml(entry.short)}</span></button>`
      );
    });
  }

  renderLinks(text) {
    return text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/gu, (_match, label, href) => {
      const resolved = this.context.resolveLink(href);
      const external = /^https?:/u.test(resolved);
      const attributes = external ? ' target="_blank" rel="noreferrer noopener"' : '';
      const marker = external ? '<span class="link-out" aria-hidden="true">↗</span>' : '';
      return `<a href="${escapeHtml(resolved)}"${attributes}>${label}${marker}</a>`;
    });
  }
}

class BlockParser {
  constructor(lines, context) {
    this.lines = lines;
    this.context = context;
    this.index = 0;
    this.inline = new InlineRenderer(context);
  }

  peek() {
    return this.index < this.lines.length ? this.lines[this.index] : null;
  }

  parse(depth = 0) {
    const out = [];
    while (this.index < this.lines.length) {
      const line = this.lines[this.index];
      if (line.trim() === '') {
        this.index += 1;
        continue;
      }
      if (line.trimStart().startsWith(':::')) {
        const trimmed = line.trim();
        if (trimmed === ':::') {
          if (depth === 0) {
            throw new Error(`${this.context.label}: stray closing ":::"`);
          }
          return out.join('\n');
        }
        out.push(this.parseContainer(trimmed, depth));
        continue;
      }
      if (line.startsWith('```')) {
        out.push(this.parseFence());
        continue;
      }
      if (/^#{2,4}\s/u.test(line)) {
        out.push(this.parseHeading(line));
        this.index += 1;
        continue;
      }
      if (line.startsWith('> ')) {
        out.push(this.parseQuote());
        continue;
      }
      if (line.startsWith('|')) {
        out.push(this.parseTable());
        continue;
      }
      if (/^[-*]\s/u.test(line.trimStart()) || /^\d+\.\s/u.test(line.trimStart())) {
        out.push(this.parseList(0));
        continue;
      }
      if (line.trim() === '---') {
        out.push('<hr />');
        this.index += 1;
        continue;
      }
      out.push(this.parseParagraph());
    }
    if (depth > 0) {
      throw new Error(`${this.context.label}: a ":::" block was never closed`);
    }
    return out.join('\n');
  }

  parseHeading(line) {
    const level = line.match(/^#+/u)[0].length;
    const text = line.slice(level).trim();
    const id = slugify(text);
    if (level === 2 || level === 3) {
      this.context.toc.push({ level, id, text: text.replace(/[`*]/gu, '') });
    }
    const rendered = this.inline.render(text);
    return (
      `<h${level} id="${id}">${rendered}` +
      `<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`
    );
  }

  parseParagraph() {
    const buffer = [];
    while (this.index < this.lines.length) {
      const line = this.lines[this.index];
      if (
        line.trim() === '' ||
        line.startsWith('```') ||
        line.trimStart().startsWith(':::') ||
        /^#{2,4}\s/u.test(line) ||
        line.startsWith('|') ||
        line.startsWith('> ') ||
        line.trim() === '---' ||
        /^[-*]\s/u.test(line.trimStart()) ||
        /^\d+\.\s/u.test(line.trimStart())
      ) {
        break;
      }
      buffer.push(line.trim());
      this.index += 1;
    }
    return `<p>${this.inline.render(buffer.join(' '))}</p>`;
  }

  parseQuote() {
    const buffer = [];
    while (this.index < this.lines.length && this.lines[this.index].startsWith('> ')) {
      buffer.push(this.lines[this.index].slice(2).trim());
      this.index += 1;
    }
    return `<blockquote><p>${this.inline.render(buffer.join(' '))}</p></blockquote>`;
  }

  parseList(baseIndent) {
    const first = this.lines[this.index];
    const ordered = /^\d+\.\s/u.test(first.trimStart());
    const tag = ordered ? 'ol' : 'ul';
    const items = [];
    while (this.index < this.lines.length) {
      const line = this.lines[this.index];
      if (line.trim() === '') {
        const next = this.lines[this.index + 1];
        if (next === undefined || next.trim() === '') break;
        const nextIndent = next.length - next.trimStart().length;
        const nextIsItem =
          /^[-*]\s/u.test(next.trimStart()) || /^\d+\.\s/u.test(next.trimStart());
        if (!nextIsItem || nextIndent < baseIndent) break;
        this.index += 1;
        continue;
      }
      const indent = line.length - line.trimStart().length;
      if (indent < baseIndent) break;
      const trimmed = line.trimStart();
      const isItem = /^[-*]\s/u.test(trimmed) || /^\d+\.\s/u.test(trimmed);
      if (!isItem) break;
      if (indent > baseIndent) {
        const nested = this.parseList(indent);
        items[items.length - 1] = `${items.at(-1)}${nested}`;
        continue;
      }
      const content = trimmed.replace(/^(?:[-*]|\d+\.)\s+/u, '');
      this.index += 1;
      items.push(this.inline.render(content));
    }
    const body = items.map((item) => `<li>${item}</li>`).join('');
    return `<${tag}>${body}</${tag}>`;
  }

  parseTable() {
    const rows = [];
    while (this.index < this.lines.length && this.lines[this.index].startsWith('|')) {
      rows.push(this.lines[this.index]);
      this.index += 1;
    }
    if (rows.length < 2) {
      throw new Error(`${this.context.label}: a table needs a header and a divider row`);
    }
    const cells = (row) =>
      row
        .replace(/^\|/u, '')
        .replace(/\|$/u, '')
        .split('|')
        .map((cell) => cell.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    const headHtml = head.map((cell) => `<th>${this.inline.render(cell)}</th>`).join('');
    const bodyHtml = body
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${this.inline.render(cell)}</td>`).join('')}</tr>`,
      )
      .join('');
    return (
      `<div class="table-scroll" tabindex="0" role="region" aria-label="Table">` +
      `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
    );
  }

  parseFence() {
    const opening = this.lines[this.index];
    const meta = opening.slice(3).trim();
    const language = meta.split(/\s+/u)[0] ?? '';
    const attributes = parseAttributes(
      meta.slice(language.length).trim(),
      this.context.label,
    );
    this.index += 1;
    const buffer = [];
    while (this.index < this.lines.length && !this.lines[this.index].startsWith('```')) {
      buffer.push(this.lines[this.index]);
      this.index += 1;
    }
    if (this.index >= this.lines.length) {
      throw new Error(`${this.context.label}: a code block was never closed`);
    }
    this.index += 1;
    const code = buffer.join('\n');
    const record = {
      language,
      code,
      title: typeof attributes.title === 'string' ? attributes.title : null,
      verify: attributes.verify === true,
      expect: typeof attributes.expect === 'string' ? attributes.expect : null,
    };
    this.context.codeBlocks.push(record);
    const label = record.title ?? language.toUpperCase();
    const title =
      label === ''
        ? ''
        : `<div class="code-title"><span>${escapeHtml(label)}</span>${
            record.verify ? '<em class="code-verified">checked by tests</em>' : ''
          }</div>`;
    return (
      `<figure class="code-block" data-language="${escapeHtml(language)}">${title}` +
      `<button type="button" class="copy-button" data-copy>Copy</button>` +
      `<pre><code class="language-${escapeHtml(language)}">${escapeHtml(code)}</code></pre>` +
      `</figure>`
    );
  }

  parseContainer(openingLine, depth) {
    const raw = openingLine.slice(3).trim();
    const name = raw.split(/\s+/u)[0];
    if (!CONTAINER_NAMES.has(name)) {
      throw new Error(`${this.context.label}: unknown block ":::${name}"`);
    }
    const attributes = parseAttributes(raw.slice(name.length).trim(), this.context.label);
    this.index += 1;
    const inner = this.parse(depth + 1);
    this.index += 1;
    return this.wrapContainer(name, attributes, inner);
  }

  wrapContainer(name, attributes, inner) {
    if (Object.prototype.hasOwnProperty.call(CALLOUTS, name)) {
      const { label, icon } = CALLOUTS[name];
      const heading = typeof attributes.title === 'string' ? attributes.title : label;
      return (
        `<aside class="callout callout-${name}" role="note">` +
        `<p class="callout-label"><span aria-hidden="true">${icon}</span>${escapeHtml(heading)}</p>` +
        `<div class="callout-body">${inner}</div></aside>`
      );
    }
    if (name === 'lead') return `<div class="lead">${inner}</div>`;
    if (name === 'grid') return `<div class="prose-grid">${inner}</div>`;
    if (name === 'steps') return `<div class="prose-steps">${inner}</div>`;
    if (name === 'cards') return `<div class="prose-cards">${inner}</div>`;
    if (name === 'figure') {
      const caption =
        typeof attributes.caption === 'string'
          ? `<figcaption>${this.inline.render(attributes.caption)}</figcaption>`
          : '';
      return `<figure class="prose-figure">${inner}${caption}</figure>`;
    }
    if (name === 'checklist') {
      const id = typeof attributes.id === 'string' ? attributes.id : null;
      if (id === null) {
        throw new Error(`${this.context.label}: :::checklist needs an id`);
      }
      this.context.checklists.push(id);
      return `<div class="prose-checklist" data-checklist="${escapeHtml(id)}">${inner}</div>`;
    }
    if (name === 'demo') {
      const demo = typeof attributes.name === 'string' ? attributes.name : null;
      if (demo === null) {
        throw new Error(`${this.context.label}: :::demo needs a name`);
      }
      this.context.demos.push(demo);
      const extra = Object.entries(attributes)
        .filter(([key]) => key !== 'name')
        .map(([key, value]) => ` data-${escapeHtml(key)}="${escapeHtml(String(value))}"`)
        .join('');
      return (
        `<div class="prose-demo" data-demo="${escapeHtml(demo)}"${extra}>` +
        `<div class="demo-fallback">${inner}</div></div>`
      );
    }
    if (name === 'generated') {
      const key = typeof attributes.name === 'string' ? attributes.name : null;
      const html = key === null ? undefined : this.context.generated.get(key);
      if (html === undefined) {
        throw new Error(
          `${this.context.label}: unknown generated block ":::generated ${key}"`,
        );
      }
      this.context.generatedUsed.add(key);
      return html;
    }
    if (name === 'codetabs') {
      return `<div class="code-tabs" data-code-tabs>${inner}</div>`;
    }
    if (name === 'tab') {
      const label = typeof attributes.label === 'string' ? attributes.label : 'Example';
      return `<section class="code-tab" data-tab-label="${escapeHtml(label)}">${inner}</section>`;
    }
    throw new Error(`${this.context.label}: unhandled block ":::${name}"`);
  }
}

/**
 * Render one documentation body.
 *
 * @param {string} source markdown body
 * @param {object} options
 * @param {Record<string, unknown>} options.facts verified values for {{TOKEN}}
 * @param {Map<string, { short: string }>} options.glossary
 * @param {(href: string) => string} options.resolveLink
 * @param {string} options.label file name used in error messages
 */
export function renderMarkdown(source, options) {
  const context = {
    label: options.label ?? 'page',
    facts: options.facts ?? {},
    glossary: options.glossary ?? new Map(),
    resolveLink: options.resolveLink ?? ((href) => href),
    generated: options.generated ?? new Map(),
    generatedUsed: new Set(),
    toc: [],
    codeBlocks: [],
    demos: [],
    checklists: [],
    usedGlossary: new Set(),
  };
  const substituted = applyFacts(
    source.replace(/\r\n/gu, '\n'),
    context.facts,
    context.label,
  );
  const parser = new BlockParser(substituted.split('\n'), context);
  const html = parser.parse(0);
  return {
    html,
    toc: context.toc,
    codeBlocks: context.codeBlocks,
    demos: context.demos,
    checklists: context.checklists,
    glossaryTerms: [...context.usedGlossary],
    generatedUsed: [...context.generatedUsed],
  };
}

/** Plain text for search indexing and meta descriptions. */
export function toPlainText(html) {
  return html
    .replace(/<figure class="code-block"[\s\S]*?<\/figure>/gu, ' ')
    .replace(/<a class="anchor"[\s\S]*?<\/a>/gu, ' ')
    .replace(/<span class="glossary-inline">[\s\S]*?<\/span>/gu, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'")
    .replace(/\s+/gu, ' ')
    .replace(/\s+([.,;:!?)])/gu, '$1')
    .replace(/\(\s+/gu, '(')
    .trim();
}
