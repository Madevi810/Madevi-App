import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { loadLocalConfig } from '../../scripts/lib/config.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const startScript = path.join(root, 'scripts/start.mjs');
const stopScript = path.join(root, 'scripts/stop.mjs');
const statusScript = path.join(root, 'scripts/status.mjs');
const basePort = Number(process.env.MADEVI_LIFECYCLE_PORT ?? 3220);
const baseConfig = loadLocalConfig(root);

function run(script, port, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      APP_PORT: String(port),
      APP_ORIGIN: `http://localhost:${port}`,
      APP_ENV: 'production-local',
    },
    timeout: 75_000,
  });
}

for (let cycle = 0; cycle < 3; cycle += 1) {
  const port = basePort + cycle;
  const start = run(startScript, port, ['--mode', 'production-local']);
  assert.equal(start.status, 0, start.stderr || start.stdout);
  const status = run(statusScript, port);
  assert.equal(status.status, 0, status.stderr || status.stdout);
  assert.match(status.stdout, /milik-task/);
  const stop = run(stopScript, port);
  assert.equal(stop.status, 0, stop.stderr || stop.stdout);
  assert.match(stop.stdout, /berhenti/);
}

const collisionPort = basePort + 10;
const marker = `foreign-${Date.now()}`;
const foreignServer = http.createServer((_request, response) => response.end(marker));
await new Promise((resolve) => foreignServer.listen(collisionPort, '127.0.0.1', resolve));
try {
  const refused = run(startScript, collisionPort, ['--mode', 'production-local']);
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /sedang dipakai/);
  const response = await fetch(`http://127.0.0.1:${collisionPort}`);
  assert.equal(await response.text(), marker);
} finally {
  await new Promise((resolve) => foreignServer.close(resolve));
}

const stalePort = basePort + 20;
assert.equal(run(startScript, stalePort, ['--mode', 'production-local']).status, 0);
const envRoot = baseConfig.MADEVI_RUNTIME_ROOT;
const recordFile = path.join(envRoot, 'run', 'app-process.json');
const record = JSON.parse(fs.readFileSync(recordFile, 'utf8'));
process.kill(-record.pid, 'SIGKILL');
await new Promise((resolve) => setTimeout(resolve, 300));
const stale = run(statusScript, stalePort);
assert.notEqual(stale.status, 0);
const cleanup = run(statusScript, stalePort, ['--cleanup-stale']);
assert.equal(cleanup.status, 0, cleanup.stderr || cleanup.stdout);
assert.equal(run(stopScript, stalePort).status, 0);

console.log(
  JSON.stringify({
    ok: true,
    cycles: 3,
    portCollisionPreserved: true,
    staleCheckpointRecovered: true,
  }),
);
