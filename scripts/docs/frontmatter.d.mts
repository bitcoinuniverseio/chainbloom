/** Types for the front matter reader. */

export interface FrontMatter {
  readonly data: Record<string, unknown>;
  readonly body: string;
}

export function readFrontMatter(source: string, label?: string): FrontMatter;
