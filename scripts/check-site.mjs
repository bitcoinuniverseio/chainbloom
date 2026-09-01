import { access, readFile } from 'node:fs/promises';

const required = [
  '../site/index.html',
  '../site/404.html',
  '../site/styles.css',
  '../site/app.js',
  '../site/assets/chainbloom-logo.svg',
  '../site/assets/chainbloom-mark.svg',
  '../site/assets/chainbloom-og.png',
  '../site/assets/docs.css',
  '../site/assets/docs.js',
  '../site/assets/demos.js',
  '../site/assets/marker.mjs',
  '../site/robots.txt',
  '../site/sitemap.xml',
  '../site/llms.txt',
  '../site/docs.manifest.json',
];

await Promise.all(required.map((path) => access(new URL(path, import.meta.url))));
const html = await readFile(new URL('../site/index.html', import.meta.url), 'utf8');
const socialImage = await readFile(
  new URL('../site/assets/chainbloom-og.png', import.meta.url),
);

for (const requiredText of [
  'ChainBloom',
  'Shared creation',
  'See how a world grows',
  'https://inscribe.bitcoinuniverse.io/chainbloom',
  'Possibilities',
  'Your choices',
  'Built in the open',
  'No project token',
  'Questions worth asking',
  'theme-toggle',
  './docs/',
]) {
  if (!html.includes(requiredText)) {
    throw new Error(`site/index.html is missing required public copy: ${requiredText}`);
  }
}

for (const requiredMetadata of ['og:image', 'twitter:card', 'summary_large_image']) {
  if (!html.includes(requiredMetadata)) {
    throw new Error(`site/index.html is missing social metadata: ${requiredMetadata}`);
  }
}

const forbiddenPublicCopy = [
  /[\u2013\u2014]/,
  /\bv1\b/i,
  /\bversion\b/i,
  /\bexperimental\b/i,
  /\bmainnet\b/i,
  /\bsignet\b/i,
  /\bregtest\b/i,
  /\boperator\b/i,
  /\bdeveloper\b/i,
  /reference implementation/i,
  /data-status-endpoint/i,
  /SPECIFICATION\.md/i,
];
for (const pattern of forbiddenPublicCopy) {
  if (pattern.test(html)) {
    throw new Error(`site/index.html contains internal or provisional copy: ${pattern}`);
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

for (const asset of [
  './assets/chainbloom-logo.svg',
  './assets/chainbloom-mark.svg',
  '/chainbloom/assets/chainbloom-og.png',
]) {
  if (!html.includes(asset)) {
    throw new Error(`site/index.html does not use required asset: ${asset}`);
  }
}

console.log('Public site checks passed.');
