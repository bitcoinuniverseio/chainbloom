import { describe, expect, it } from 'vitest';

import { readFrontMatter } from '../scripts/docs/frontmatter.mjs';
import { renderMarkdown, slugify, toPlainText } from '../scripts/docs/markdown.mjs';

const GLOSSARY = new Map([['world', { short: 'A bounded shared story.' }]]);

function render(body: string, extra: Record<string, unknown> = {}) {
  return renderMarkdown(body, {
    facts: { MAX_LANES: 8, CARRIER_VALUE_SATS: '1,000' },
    glossary: GLOSSARY,
    resolveLink: (href: string) => (href.startsWith('/docs/') ? `${href}/` : href),
    label: 'test.md',
    ...extra,
  });
}

describe('front matter', () => {
  it('reads scalars, lists, and one level of nesting', () => {
    const { data, body } = readFrontMatter(
      [
        '---',
        'title: Join a world',
        'order: 2',
        'draft: false',
        'related: [a/b, c/d]',
        'keywords:',
        '  - fees',
        '  - signing',
        'cta:',
        '  label: Next',
        '  href: /docs/help',
        '---',
        'Body text.',
        '',
      ].join('\n'),
    );
    expect(data.title).toBe('Join a world');
    expect(data.order).toBe(2);
    expect(data.draft).toBe(false);
    expect(data.related).toEqual(['a/b', 'c/d']);
    expect(data.keywords).toEqual(['fees', 'signing']);
    expect(data.cta).toEqual({ label: 'Next', href: '/docs/help' });
    expect(body.trim()).toBe('Body text.');
  });

  it('refuses a file with no front matter', () => {
    expect(() => readFrontMatter('# Hello', 'page.md')).toThrow(/front matter/u);
  });

  it('refuses an unterminated front matter block', () => {
    expect(() => readFrontMatter('---\ntitle: x\n', 'page.md')).toThrow(/unterminated/u);
  });
});

describe('markdown', () => {
  it('numbers headings into a table of contents and gives them ids', () => {
    const result = render('## First part\n\n### Detail\n\n#### Aside\n');
    expect(result.toc).toEqual([
      { level: 2, id: 'first-part', text: 'First part' },
      { level: 3, id: 'detail', text: 'Detail' },
    ]);
    expect(result.html).toContain('<h2 id="first-part">');
    expect(result.html).toContain('<h4 id="aside">');
  });

  it('substitutes verified values and rejects unknown ones', () => {
    expect(render('A world may have {{MAX_LANES}} paths.').html).toContain('8 paths');
    expect(() => render('{{NOT_A_FACT}}')).toThrow(/unknown verified value/u);
  });

  it('links glossary terms and rejects unknown ones', () => {
    const result = render('A [[world]] is bounded.');
    expect(result.html).toContain('data-term="world"');
    expect(result.html).toContain('A bounded shared story.');
    expect(result.glossaryTerms).toEqual(['world']);
    expect(() => render('A [[nonsense]] term.')).toThrow(/unknown glossary term/u);
  });

  it('marks external links and leaves internal links alone', () => {
    const result = render('[Docs](/docs/help) and [Site](https://example.com).');
    expect(result.html).toContain('href="/docs/help/"');
    expect(result.html).toContain('rel="noreferrer noopener"');
    expect(result.html).not.toContain('href="/docs/help/" target');
  });

  it('renders lists, tables, and quotes', () => {
    const result = render(
      [
        '- one',
        '- two',
        '',
        '| A | B |',
        '| --- | --- |',
        '| 1 | 2 |',
        '',
        '> A quote',
      ].join('\n'),
    );
    expect(result.html).toContain('<ul><li>one</li><li>two</li></ul>');
    expect(result.html).toContain('<th>A</th>');
    expect(result.html).toContain('<td>2</td>');
    expect(result.html).toContain('<blockquote><p>A quote</p></blockquote>');
  });

  it('records code blocks and marks the ones the tests run', () => {
    const result = render(
      [
        '```ts title="a.ts" verify',
        'console.log(1);',
        '```',
        '',
        '```bash',
        'ls',
        '```',
      ].join('\n'),
    );
    expect(result.codeBlocks).toHaveLength(2);
    expect(result.codeBlocks[0]).toMatchObject({
      language: 'ts',
      title: 'a.ts',
      verify: true,
    });
    expect(result.codeBlocks[1]).toMatchObject({ language: 'bash', verify: false });
    expect(result.html).toContain('checked by tests');
    expect(result.html).toContain('data-copy');
  });

  it('escapes code so a sample can never inject markup', () => {
    const result = render('```html\n<script>alert(1)</script>\n```');
    expect(result.html).not.toContain('<script>alert');
    expect(result.html).toContain('&lt;script&gt;');
  });

  it('wraps callouts, figures, checklists, and interactive figures', () => {
    const result = render(
      [
        ':::warning',
        'Read before signing.',
        ':::',
        '',
        ':::checklist id=join-world',
        '- Connect a wallet',
        ':::',
        '',
        ':::demo name=world-growth guide=participant',
        'A written fallback.',
        ':::',
      ].join('\n'),
    );
    expect(result.html).toContain('callout-warning');
    expect(result.html).toContain('data-checklist="join-world"');
    expect(result.checklists).toEqual(['join-world']);
    expect(result.html).toContain('data-demo="world-growth"');
    expect(result.html).toContain('data-guide="participant"');
    expect(result.demos).toEqual(['world-growth']);
  });

  it('inserts a generated block and rejects an unknown one', () => {
    const generated = new Map([['error-index', '<table></table>']]);
    const result = render(':::generated name=error-index\n:::', { generated });
    expect(result.html).toBe('<table></table>');
    expect(result.generatedUsed).toEqual(['error-index']);
    expect(() => render(':::generated name=missing\n:::', { generated })).toThrow(
      /unknown generated block/u,
    );
  });

  it('refuses an unknown block and an unclosed block', () => {
    expect(() => render(':::mystery\ntext\n:::')).toThrow(/unknown block/u);
    expect(() => render(':::note\ntext\n')).toThrow(/never closed/u);
  });

  it('turns rendered html back into plain text without code samples', () => {
    const result = render('Some **text**.\n\n```ts\nconst secret = 1;\n```\n');
    const plain = toPlainText(result.html);
    expect(plain).toContain('Some text.');
    expect(plain).not.toContain('secret');
  });
});

describe('slugify', () => {
  it('makes a stable anchor from a heading', () => {
    expect(slugify('How a world grows')).toBe('how-a-world-grows');
    expect(slugify('`CARRIER_VALUE_SATS` and more!')).toBe('carrier-value-sats-and-more');
  });
});
