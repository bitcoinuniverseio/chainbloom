import { createHash } from 'node:crypto';

export function sha256Hex(...chunks: readonly Uint8Array[]): string {
  const hash = createHash('sha256');
  for (const chunk of chunks) hash.update(chunk);
  return hash.digest('hex');
}
