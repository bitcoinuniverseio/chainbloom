/**
 * A local preview of the published site.
 *
 * GitHub Pages serves this project under /chainbloom/, so this server does the
 * same. That way every link, asset path, and page address behaves locally
 * exactly as it will in production.
 *
 *   npm run build && npm run build:docs && npm run serve:docs
 */

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = fileURLToPath(new URL('../site', import.meta.url));
const BASE = '/chainbloom';
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolve(pathname) {
  if (!pathname.startsWith(BASE)) return null;
  const relative = decodeURIComponent(pathname.slice(BASE.length)) || '/';
  const target = normalize(join(SITE, relative)).replace(/[\\/]+$/u, '');
  if (!target.startsWith(SITE)) return null;
  try {
    const info = await stat(target);
    if (info.isDirectory()) return join(target, 'index.html');
    return target;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  if (url.pathname === '/') {
    response.writeHead(302, { location: `${BASE}/` });
    response.end();
    return;
  }
  const file = await resolve(url.pathname);
  if (file === null) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(`Not found: ${url.pathname}`);
    return;
  }
  try {
    await stat(file);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(`Not found: ${url.pathname}`);
    return;
  }
  response.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`ChainBloom preview: http://localhost:${PORT}${BASE}/docs/`);
});
