import { access, readFile } from 'node:fs/promises';

const required = [
  '../site/index.html',
  '../site/styles.css',
  '../site/app.js',
  '../site/assets/chainbloom-logo.svg',
  '../site/assets/chainbloom-mark.svg',
  '../site/assets/chainbloom-og.png',
  '../site/robots.txt',
  '../site/sitemap.xml',
];

await Promise.all(required.map((path) => access(new URL(path, import.meta.url))));
const html = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
const socialImage = await readFile(
  new URL('../site/assets/chainbloom-og.png', import.meta.url),
);
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

for (const requiredMetadata of ['og:image', 'twitter:card', 'summary_large_image']) {
  if (!html.includes(requiredMetadata)) {
    throw new Error(`site/index.html is missing social metadata: ${requiredMetadata}`);
  }
}

const pngSignature = '89504e470d0a1a0a';
if (socialImage.subarray(0, 8).toString('hex') !== pngSignature) {
  throw new Error('site/assets/chainbloom-og.png is not a valid PNG');
}
const imageWidth = socialImage.readUInt32BE(16);
const imageHeight = socialImage.readUInt32BE(20);
const imageRatio = imageWidth / imageHeight;
if (imageWidth < 1200 || imageHeight < 630 || imageRatio < 1.8 || imageRatio > 2) {
  throw new Error(
    `social image must be at least 1200x630 and approximately 1.91:1; received ${imageWidth}x${imageHeight}`,
  );
}

if (!html.includes('data-status-endpoint=""')) {
  throw new Error('the static release must not claim an unverified public status endpoint');
}

console.log('Static site checks passed.');
