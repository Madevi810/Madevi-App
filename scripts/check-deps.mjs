import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

import {
  assertWorkspaceProject,
  loadLocalConfig,
  projectRoot,
  safeConfigForOutput,
} from './lib/config.mjs';

const root = projectRoot(import.meta.url);
const workspaceProject = assertWorkspaceProject(root);
const config = loadLocalConfig(root);
const packageManifest = readJson(new URL('../package.json', import.meta.url));
const packageLock = readJson(new URL('../package-lock.json', import.meta.url));
const packageLockRoot = packageLock.value?.packages?.[''];
const lockfile = {
  ok:
    packageManifest.ok &&
    packageLock.ok &&
    packageLock.value.lockfileVersion === 3 &&
    packageManifest.value.name === packageLock.value.name &&
    packageManifest.value.version === packageLock.value.version &&
    packageManifest.value.name === packageLockRoot?.name &&
    packageManifest.value.version === packageLockRoot?.version,
  path: 'package-lock.json',
  lockfileVersion: packageLock.value?.lockfileVersion ?? null,
  error: packageManifest.error ?? packageLock.error ?? null,
};
const required = [
  ['node', ['--version']],
  ['npm', ['--version']],
  ['psql', ['--version']],
];
const commands = Object.fromEntries(
  required.map(([command, args]) => {
    const result = spawnSync(command, args, { encoding: 'utf8' });
    return [
      command,
      {
        ok: result.status === 0,
        version: (result.stdout || result.stderr || '').trim().split(/\r?\n/)[0] || null,
      },
    ];
  }),
);
const pgConfig = spawnSync('pg_config', ['--bindir'], { encoding: 'utf8' });
const postgresCommand = pgConfig.status === 0 ? `${pgConfig.stdout.trim()}/postgres` : 'postgres';
const postgresVersion = spawnSync(postgresCommand, ['--version'], {
  encoding: 'utf8',
});
commands.postgres = {
  ok: postgresVersion.status === 0,
  version:
    (postgresVersion.stdout || postgresVersion.stderr || '').trim().split(/\r?\n/)[0] || null,
};
const nodeMajor = Number(process.versions.node.split('.')[0]);
const result = {
  ok:
    nodeMajor >= 20 &&
    Object.values(commands).every((command) => command.ok) &&
    fs.existsSync(new URL('../node_modules/next/package.json', import.meta.url)) &&
    lockfile.ok,
  platform: process.platform,
  architecture: process.arch,
  projectRoot: workspaceProject,
  node: process.version,
  commands,
  nextInstalled: fs.existsSync(new URL('../node_modules/next/package.json', import.meta.url)),
  lockfile,
  config: safeConfigForOutput(config),
};
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;

function readJson(file) {
  try {
    return { ok: true, value: JSON.parse(fs.readFileSync(file, 'utf8')), error: null };
  } catch {
    return { ok: false, value: null, error: 'metadata-package-tidak-valid' };
  }
}
