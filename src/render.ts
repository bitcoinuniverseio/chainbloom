import { createHash } from 'node:crypto';

import type { EventState, WorldState } from './types.js';

export interface BloomPoint {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly color: string;
  readonly eventTxid: string;
}

const PALETTE = [
  '#ff6b6b',
  '#ff922b',
  '#fcc419',
  '#94d82d',
  '#20c997',
  '#22b8cf',
  '#339af0',
  '#5c7cfa',
  '#845ef7',
  '#cc5de8',
  '#f06595',
  '#e64980',
  '#12b886',
  '#15aabf',
  '#4c6ef5',
  '#7950f2',
] as const;

function unit(hash: Buffer, offset: number): number {
  return hash.readUInt16BE(offset % (hash.length - 1)) / 0xffff;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** A stable visual interpretation. Its output is explicitly non-consensus. */
export function projectBloom(
  world: WorldState,
  events: readonly EventState[],
): readonly BloomPoint[] {
  return events
    .filter((event) => event.worldIds.includes(world.id))
    .sort((left, right) => left.height - right.height || left.txIndex - right.txIndex)
    .map((event, index) => {
      const hash = createHash('sha256')
        .update(world.seed, 'hex')
        .update(event.txid, 'hex')
        .update(event.operation)
        .digest();
      const payload = event.payload;
      const palette = 'palette' in payload ? payload.palette : index % PALETTE.length;
      const magnitude =
        'magnitude' in payload
          ? payload.magnitude
          : 'intensity' in payload
            ? payload.intensity
            : 128;
      return {
        x: 40 + unit(hash, 0) * 720,
        y: 40 + unit(hash, 2) * 420,
        radius: 4 + (magnitude / 255) * 18,
        color: PALETTE[palette % PALETTE.length]!,
        eventTxid: event.txid,
      };
    });
}

export function renderWorldSvg(world: WorldState, events: readonly EventState[]): string {
  const points = projectBloom(world, events);
  const circles = points
    .map(
      (point) =>
        `<circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${point.radius.toFixed(2)}" fill="${point.color}" fill-opacity="0.82"><title>${point.eventTxid}</title></circle>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-labelledby="title desc"><title id="title">${escapeXml(world.title || 'Untitled ChainBloom world')}</title><desc id="desc">Deterministic non-consensus rendering of ${points.length} confirmed events.</desc><rect width="800" height="500" rx="28" fill="#07111f"/><g>${circles}</g></svg>`;
}
