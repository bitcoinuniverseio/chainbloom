/** Types for the documentation renderer, so tests and editors see its shape. */

export interface TocEntry {
  readonly level: number;
  readonly id: string;
  readonly text: string;
}

export interface RenderedCodeBlock {
  readonly language: string;
  readonly code: string;
  readonly title: string | null;
  readonly verify: boolean;
  readonly expect: string | null;
}

export interface RenderResult {
  readonly html: string;
  readonly toc: readonly TocEntry[];
  readonly codeBlocks: readonly RenderedCodeBlock[];
  readonly demos: readonly string[];
  readonly checklists: readonly string[];
  readonly glossaryTerms: readonly string[];
  readonly generatedUsed: readonly string[];
}

export interface GlossaryEntry {
  readonly short: string;
  readonly long?: string;
}

export interface RenderOptions {
  readonly facts?: Readonly<Record<string, unknown>>;
  readonly glossary?: ReadonlyMap<string, GlossaryEntry>;
  readonly generated?: ReadonlyMap<string, string>;
  readonly resolveLink?: (href: string) => string;
  readonly label?: string;
}

export function escapeHtml(value: unknown): string;
export function slugify(value: string): string;
export function renderMarkdown(source: string, options: RenderOptions): RenderResult;
export function toPlainText(html: string): string;
