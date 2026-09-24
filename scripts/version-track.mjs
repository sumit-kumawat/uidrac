#!/usr/bin/env node
/**
 * Tracks completed changes and bumps PATCH version every 10 changes.
 * Updates root package.json, app packages, and packages/shared/src/version.ts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STATE_PATH = path.join(ROOT, '.idrac-version-state.json');
const VERSION_TS = path.join(ROOT, 'packages/shared/src/version.ts');
const RELEASE_HISTORY_PATH = path.join(ROOT, 'packages/shared/src/release-history.json');

const PACKAGE_JSON_PATHS = [
  path.join(ROOT, 'package.json'),
  path.join(ROOT, 'apps/web/package.json'),
  path.join(ROOT, 'apps/api/package.json'),
  path.join(ROOT, 'apps/console-gw/package.json'),
  path.join(ROOT, 'packages/shared/package.json'),
  path.join(ROOT, 'packages/db/package.json'),
  path.join(ROOT, 'packages/adapters/package.json'),
  path.join(ROOT, 'packages/ui/package.json'),
];

function readState() {
  const raw = fs.readFileSync(STATE_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function bumpPatch(version) {
  const parts = version.split('.').map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid semver: ${version}`);
  }
  parts[2] += 1;
  return parts.join('.');
}

function syncPackageJson(version) {
  for (const pkgPath of PACKAGE_JSON_PATHS) {
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}

function syncVersionTs(version) {
  const content = `/**
 * Central application version — updated by scripts/version-track.mjs (do not edit by hand).
 */
export const APP_VERSION = '${version}';

export const APP_VERSION_LABEL = \`v\${APP_VERSION}\`;
`;
  fs.writeFileSync(VERSION_TS, content);
}

function ensurePatchReleaseInHistory(version) {
  if (!fs.existsSync(RELEASE_HISTORY_PATH)) return;
  const catalog = JSON.parse(fs.readFileSync(RELEASE_HISTORY_PATH, 'utf8'));
  if (!Array.isArray(catalog.releases)) catalog.releases = [];
  if (catalog.releases.some((r) => r.version === version)) return;
  catalog.releases.unshift({
    version,
    released: new Date().toISOString().slice(0, 10),
    kind: 'patch',
    title: 'Maintenance release',
    coreImplementation: [
      'Bug fixes, stability improvements, and product refinements from ongoing development.',
    ],
  });
  fs.writeFileSync(RELEASE_HISTORY_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`[version-track] Added v${version} to release-history.json`);
}

function main() {
  const state = readState();
  state.changeCount = (state.changeCount || 0) + 1;

  if (state.changeCount >= 10) {
    state.version = bumpPatch(state.version || '1.0.0');
    state.changeCount = 0;
    console.log(`[version-track] Bumped to v${state.version}`);
    ensurePatchReleaseInHistory(state.version);
  } else {
    console.log(`[version-track] Change ${state.changeCount}/10 (v${state.version})`);
  }

  writeState(state);
  syncPackageJson(state.version);
  syncVersionTs(state.version);
}

main();
