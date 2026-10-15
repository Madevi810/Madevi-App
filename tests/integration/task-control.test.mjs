import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('../../scripts/task-control.mjs', import.meta.url).pathname;
const workspaceRoot = path.resolve(path.dirname(script), '../..');
const testRunRoot = fs.mkdtempSync(path.join(workspaceRoot, '.task-lock-tests-'));

test.after(() => {
  fs.rmSync(testRunRoot, { recursive: true, force: true });
});

function run(root, command, task, session, extra = []) {
  return spawnSync(
    process.execPath,
    [script, command, '--task', task, '--session', session, ...extra],
    { encoding: 'utf8', env: { ...process.env, MADEVI_TASK_LOCK_ROOT: root } },
  );
}

test('lock menolak dua penulis dan recovery menghormati PENDING/OWNER', async () => {
  const root = fs.mkdtempSync(path.join(testRunRoot, 'madevi-lock-test-'));
  const keeper = spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 60000)']);
  try {
    const acquired = run(root, 'acquire', 'offline-01', 'session-a', ['--pid', String(keeper.pid)]);
    assert.equal(acquired.status, 0, acquired.stderr);
    const rejected = run(root, 'acquire', 'offline-01', 'session-b');
    assert.notEqual(rejected.status, 0);

    const pendingOwner = run(root, 'mark', 'offline-01', 'session-a', [
      '--status',
      'PENDING',
      '--reason',
      'OWNER',
    ]);
    assert.equal(pendingOwner.status, 0, pendingOwner.stderr);
    keeper.kill('SIGTERM');
    await new Promise((resolve) => keeper.once('exit', resolve));
    const forbidden = run(root, 'recover', 'offline-01', 'session-b', [
      '--confirm-no-mutation',
      'true',
    ]);
    assert.notEqual(forbidden.status, 0);
    assert.match(forbidden.stderr, /PENDING\/OWNER/);
    assert.equal(
      run(root, 'release', 'offline-01', 'session-a', ['--status', 'PENDING']).status,
      0,
    );
  } finally {
    if (keeper.exitCode === null) keeper.kill('SIGKILL');
  }
});

test('recovery proses mati dan checkpoint bersifat idempoten', () => {
  const root = fs.mkdtempSync(path.join(testRunRoot, 'madevi-recovery-test-'));
  assert.equal(run(root, 'acquire', 'offline-01', 'session-lama', ['--pid', '999999']).status, 0);
  assert.equal(
    run(root, 'mark', 'offline-01', 'session-lama', [
      '--status',
      'PENDING',
      '--reason',
      'SESI',
      '--checkpoint',
      'file aman',
    ]).status,
    0,
  );
  const recovered = run(root, 'recover', 'offline-01', 'session-baru', [
    '--pid',
    String(process.pid),
    '--confirm-no-mutation',
    'true',
  ]);
  assert.equal(recovered.status, 0, recovered.stderr);
  assert.equal(
    run(root, 'recover', 'offline-01', 'session-baru', [
      '--pid',
      String(process.pid),
      '--confirm-no-mutation',
      'true',
    ]).status,
    0,
  );
  assert.equal(
    run(root, 'checkpoint', 'offline-01', 'session-baru', ['--checkpoint', 'file aman']).status,
    0,
  );
  assert.equal(run(root, 'release', 'offline-01', 'session-baru', ['--status', 'DONE']).status, 0);
});

test('mkdir eksklusif hanya memberi satu pemenang pada race', async () => {
  const root = fs.mkdtempSync(path.join(testRunRoot, 'madevi-race-test-'));
  const launch = (session) =>
    new Promise((resolve) => {
      const child = spawn(
        process.execPath,
        [script, 'acquire', '--task', 'race', '--session', session, '--pid', String(process.pid)],
        { env: { ...process.env, MADEVI_TASK_LOCK_ROOT: root } },
      );
      child.on('exit', (code) => resolve(code));
    });
  const results = await Promise.all([launch('writer-a'), launch('writer-b')]);
  assert.deepEqual(results.sort(), [0, 1]);
  const owner = JSON.parse(fs.readFileSync(path.join(root, 'race.lock', 'owner.json'), 'utf8'));
  assert.equal(run(root, 'release', 'race', owner.sessionId, ['--status', 'DONE']).status, 0);
});
