import { access, readFile } from 'node:fs/promises';

const required = [
  '../site/index.html',
  '../site/styles.css',
  '../site/app.js',
  '../site/robots.txt',
  '../site/sitemap.xml',
];

await Promise.all(required.map((path) => access(new URL(path, import.meta.url))));
const html = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
for (const requiredText of [
  'ChainBloom',
  'How it works',
  'No token',
  'Security',
  'Transparent status',
  'Not in CBLM v1',
  'Questions worth asking',
  'theme-toggle',
]) {
  if (!html.includes(requiredText)) {
    throw new Error(`site/index.html is missing required copy: ${requiredText}`);
  }
}

for (const requiredMetadata of ['og:type', 'twitter:card', 'content="summary"']) {
  if (!html.includes(requiredMetadata)) {
    throw new Error(`site/index.html is missing metadata: ${requiredMetadata}`);
  }
}

for (const forbiddenMediaReference of [
  'site/assets/',
  'og:image',
  'twitter:image',
  'summary_large_image',
]) {
  if (html.includes(forbiddenMediaReference)) {
    throw new Error(
      `site/index.html references repository media: ${forbiddenMediaReference}`,
    );
  }
}

if (!html.includes('data-status-endpoint=""')) {
  throw new Error('the static release must not claim an unverified public status endpoint');
}

console.log('Static site checks passed.');
