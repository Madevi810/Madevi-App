import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './lib/config.mjs';
import {
  checkPort,
  ensureRuntimeDirectories,
  inspectOwnedProcess,
  processStartTicks,
  readProcessRecord,
  removeProcessRecord,
  terminateProcess,
  waitForHealth,
  writeProcessRecord,
} from './lib/process-state.mjs';

const root = projectRoot(import.meta.url);
const workspaceProject = assertWorkspaceProject(root);
const requestedMode = process.argv.includes('--mode')
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : 'production-local';
if (!['development', 'production-local'].includes(requestedMode)) {
  throw new Error('Mode start harus development atau production-local');
}
// Development mengompilasi route saat pertama diakses. Pada shared storage Android,
// kompilasi dingin health pernah terukur sekitar 137 detik. Production memakai build
// siap, tetapi tetap memerlukan margin scheduling setelah build berat pada perangkat.
const healthTimeoutMs = requestedMode === 'development' ? 240_000 : 60_000;
const config = loadLocalConfig(root, { ...process.env, APP_ENV: requestedMode });
ensureRuntimeDirectories(config);

const existing = readProcessRecord(config);
if (existing) {
  const state = inspectOwnedProcess(existing, workspaceProject);
  if (state.alive) throw new Error(`Record proses masih aktif (${state.reason}); start dibatalkan`);
  throw new Error(
    'Record proses mati ditemukan; jalankan npm run status -- --cleanup-stale dahulu',
  );
}
const port = await checkPort(config.APP_HOST, config.APP_PORT);
if (!port.available) {
  throw new Error(
    `Port ${config.APP_HOST}:${config.APP_PORT} sedang dipakai; proses lain tidak disentuh`,
  );
}

const logFile = path.join(
  config.MADEVI_RUNTIME_ROOT,
  'logs',
  `app-${requestedMode}-${new Date().toISOString().replace(/[:.]/g, '-')}.log`,
);
const logHandle = fs.openSync(logFile, 'a', 0o600);
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const args =
  requestedMode === 'development'
    ? [
        nextBin,
        'dev',
        '--webpack',
        '--hostname',
        config.APP_HOST,
        '--port',
        String(config.APP_PORT),
      ]
    : [nextBin, 'start', '--hostname', config.APP_HOST, '--port', String(config.APP_PORT)];
const instanceId = randomUUID();
const child = spawn(process.execPath, args, {
  cwd: root,
  detached: true,
  env: {
    ...process.env,
    ...config,
    APP_ENV: requestedMode,
    MADEVI_INSTANCE_ID: instanceId,
    NEXT_SWC_PATH: path.join(root, '.npm-cache', 'next-swc'),
  },
  stdio: ['ignore', logHandle, logHandle],
});
fs.closeSync(logHandle);
child.unref();
await new Promise((resolve) => setTimeout(resolve, 80));
const startTicks = processStartTicks(child.pid);
if (!startTicks) throw new Error('Identitas proses baru tidak dapat dibaca');
const record = {
  pid: child.pid,
  startTicks,
  projectRoot: workspaceProject,
  instanceId,
  mode: requestedMode,
  host: config.APP_HOST,
  port: config.APP_PORT,
  startedAt: new Date().toISOString(),
  logFile,
};
writeProcessRecord(config, record);

try {
  const health = await waitForHealth(config.APP_ORIGIN, healthTimeoutMs);
  console.log(JSON.stringify({ ok: true, record, health }));
} catch (error) {
  const state = inspectOwnedProcess(record, workspaceProject);
  if (state.owned) terminateProcess(record.pid, 'SIGTERM');
  removeProcessRecord(config);
  throw error;
}
