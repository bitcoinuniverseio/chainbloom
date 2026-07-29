document.documentElement.classList.add('js');

const themeButton = document.getElementById('theme-toggle');
const themeLabel = themeButton?.querySelector('.theme-label');
const requestedTheme = new URLSearchParams(window.location.search).get('theme');
let storedTheme = null;
try {
  storedTheme = window.localStorage.getItem('chainbloom-theme');
} catch {
  // Storage is optional; the system preference remains available.
}

const initialTheme =
  requestedTheme === 'light' || requestedTheme === 'dark'
    ? requestedTheme
    : storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeButton) themeButton.setAttribute('aria-pressed', String(theme === 'light'));
  if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Dark' : 'Light';
}

setTheme(initialTheme);
themeButton?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
  try {
    window.localStorage.setItem('chainbloom-theme', nextTheme);
  } catch {
    // Theme switching does not depend on persistent storage.
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealItems.forEach((item) => observer.observe(item));
}

const statusSection = document.querySelector('[data-status-endpoint]');
const statusPanel = statusSection?.querySelector('.status-panel');
const statusEndpoint = statusSection?.dataset.statusEndpoint?.trim();

function writeStatus(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function finiteInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

const statusNames = new Set([
  'synced',
  'unavailable',
  'network-mismatch',
  'node-syncing',
  'lagging',
  'ahead',
  'checkpoint-missing',
  'forked',
]);
const networkNames = new Set(['mainnet', 'testnet4', 'signet', 'regtest']);
const blockHashPattern = /^[0-9a-f]{64}$/;

async function loadStatus() {
  if (!statusEndpoint || !statusPanel) return;

  try {
    const response = await fetch(statusEndpoint, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const status = await response.json();
    const expectedCoreChain = status?.network === 'mainnet' ? 'main' : status?.network;
    const valid =
      networkNames.has(status?.network) &&
      finiteInteger(status?.indexedHeight) &&
      finiteInteger(status?.tipHeight) &&
      finiteInteger(status?.headerHeight) &&
      finiteInteger(status?.lag) &&
      typeof status?.synced === 'boolean' &&
      typeof status?.degraded === 'boolean' &&
      typeof status?.nodeAvailable === 'boolean' &&
      typeof status?.initialBlockDownload === 'boolean' &&
      statusNames.has(status?.syncStatus) &&
      status?.coreChain === expectedCoreChain &&
      (status?.nodeError === null || typeof status?.nodeError === 'string') &&
      blockHashPattern.test(status?.indexedHash) &&
      blockHashPattern.test(status?.tipHash) &&
      status.lag === Math.max(0, status.tipHeight - status.indexedHeight) &&
      status.degraded === !status.synced &&
      (status.syncStatus === 'synced') === status.synced;
    if (!valid) throw new Error('Malformed status response');

    const canonicalReady =
      status.nodeAvailable &&
      status.synced &&
      !status.degraded &&
      status.syncStatus === 'synced' &&
      !status.initialBlockDownload &&
      status.nodeError === null &&
      status.indexedHeight === status.tipHeight &&
      status.tipHeight === status.headerHeight &&
      status.lag === 0 &&
      status.indexedHash === status.tipHash;
    const state = canonicalReady ? 'synced' : 'degraded';
    statusPanel.dataset.state = state;
    writeStatus(
      'network-status-title',
      state === 'synced' ? 'Public indexer synchronized' : 'Public indexer degraded',
    );
    writeStatus('network-status-badge', status.syncStatus ?? state);
    writeStatus('status-network', status.network);
    writeStatus('status-indexed-height', status.indexedHeight.toLocaleString());
    writeStatus('status-tip-height', status.tipHeight.toLocaleString());
    writeStatus('status-lag', status.lag.toLocaleString());
    writeStatus(
      'status-message',
      state === 'synced'
        ? 'Live status reported by the configured indexer. Verify important state against Bitcoin Core.'
        : 'The indexer reports that it is not ready for transaction construction or broadcast.',
    );
  } catch {
    statusPanel.dataset.state = 'degraded';
    writeStatus('network-status-title', 'Public indexer unavailable');
    writeStatus('network-status-badge', 'Unavailable');
    writeStatus(
      'status-message',
      'No live claim is shown because the configured status endpoint did not return a valid response.',
    );
  }
}

void loadStatus();
