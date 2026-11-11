/** Generate the static site's running-build metadata and public version endpoint. */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const site = new URL('../', import.meta.url);
const root = new URL('../../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

// A channel describes this build, not the production endpoint being checked.
const channel = process.env.APP_BUILD_CHANNEL;
if (!channel || !/^[a-z0-9][a-z0-9-]*$/u.test(channel)) {
  throw new Error('Set APP_BUILD_CHANNEL to the build channel (for example, production).');
}
if (typeof pkg.version !== 'string' ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u.test(pkg.version)) {
  throw new Error('Root package version must be valid semver.');
}
const sha = execFileSync('git', ['rev-parse', '--verify', 'HEAD'], {
  cwd: fileURLToPath(root),
  encoding: 'utf8',
}).trim();
if (!/^[0-9a-f]{40,64}$/u.test(sha)) throw new Error('Could not determine the build revision.');

const metadata = { version: pkg.version, sha, builtAt: new Date().toISOString(), channel };
const json = JSON.stringify(metadata, null, 2) + '\n';
// The page loads this local build artifact; fetching version.json must never mutate it.
const script = `/* Generated at build time. */\nObject.defineProperty(globalThis, 'APP_VERSION', { value: Object.freeze(${JSON.stringify(metadata)}), writable: false, configurable: false });\n`;
await mkdir(new URL('public/', site), { recursive: true });
await Promise.all([
  writeFile(new URL('version.json', site), json),
  writeFile(new URL('public/version-build.js', site), script),
]);
