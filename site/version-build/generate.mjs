import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const site = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (typeof version !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(version)) {
  throw new Error('package.json version must be valid semver');
}

// The checkout is authoritative: GITHUB_SHA may refer to the workflow revision
// rather than the selected ref on workflow_dispatch. BUILD_SHA is for archives
// or containers without a Git checkout, and must identify their source revision.
let sha;
try {
  sha = execFileSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  sha = process.env.BUILD_SHA;
}
if (typeof sha !== 'string' || !/^[0-9a-f]{40,64}$/i.test(sha)) {
  throw new Error('A checked-out Git revision or full BUILD_SHA is required');
}
const channel = process.env.BUILD_CHANNEL || 'development';
if (!/^[a-z][a-z0-9-]*$/.test(channel)) throw new Error('Invalid BUILD_CHANNEL');
const metadata = { version, sha: sha.toLowerCase(), builtAt: new Date().toISOString(), channel };
const json = JSON.stringify(metadata, null, 2) + '\n';
await mkdir(new URL('public/', site), { recursive: true });
await writeFile(new URL('version.json', site), json);
await writeFile(new URL('public/version-build.js', site), `Object.defineProperty(globalThis, 'APP_VERSION_METADATA', { value: Object.freeze(${JSON.stringify(metadata)}), writable: false, configurable: false });\n`);
