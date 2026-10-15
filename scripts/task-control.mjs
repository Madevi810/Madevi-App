import fs from 'node:fs';
import path from 'node:path';

const command = process.argv[2];
const options = parseOptions(process.argv.slice(3));
const taskId = safeIdentifier(options.task, 'task');
const sessionId = safeIdentifier(options.session, 'session');
const project = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const root = path.resolve(
  process.env.MADEVI_TASK_LOCK_ROOT ??
    path.join(process.env.MADEVI_RUNTIME_ROOT ?? path.dirname(project), '.task-locks'),
);
const workspaceRoot = '/sdcard/project/Madevi';
if (!isInsideWorkspace(root, workspaceRoot)) {
  fail('Lock harus berada langsung di dalam workspace project Madevi');
}
fs.mkdirSync(root, { recursive: true, mode: 0o700 });
const lockDirectory = path.join(root, `${taskId}.lock`);
const ownerFile = path.join(lockDirectory, 'owner.json');

switch (command) {
  case 'acquire':
    acquire();
    break;
  case 'heartbeat':
  case 'checkpoint':
    updateOwner((owner) => ({
      ...owner,
      heartbeatAt: new Date().toISOString(),
      lastCheckpoint: options.checkpoint ?? owner.lastCheckpoint,
    }));
    break;
  case 'mark':
    updateOwner((owner) => markOwner(owner));
    break;
  case 'recover':
    recover();
    break;
  case 'status':
    print(readOwner());
    break;
  case 'release':
    release();
    break;
  default:
    fail('Perintah: acquire | heartbeat | checkpoint | mark | recover | status | release');
}

function acquire() {
  try {
    fs.mkdirSync(lockDirectory, { mode: 0o700 });
  } catch (error) {
    if (error.code === 'EEXIST') fail(`Task ${taskId} sudah dikunci`);
    throw error;
  }
  const now = new Date().toISOString();
  const owner = {
    taskId,
    sessionId,
    processId: numericPid(options.pid),
    startedAt: now,
    heartbeatAt: now,
    host: 'android-local',
    status: 'AKTIF',
    pendingReason: null,
    lastCheckpoint: options.checkpoint ?? 'Kunci diperoleh',
  };
  try {
    fs.writeFileSync(ownerFile, `${JSON.stringify(owner, null, 2)}\n`, {
      flag: 'wx',
      mode: 0o600,
    });
    print(owner);
  } catch (error) {
    fs.rmdirSync(lockDirectory);
    throw error;
  }
}

function markOwner(owner) {
  const allowed = new Set(['AKTIF', 'PENDING', 'ERROR', 'MENUNGGU-OWNER']);
  const status = options.status;
  if (!allowed.has(status)) fail('Status lock tidak sah');
  const pendingReason = status === 'PENDING' ? options.reason : null;
  if (
    status === 'PENDING' &&
    !['OWNER', 'SESI', 'DEPENDENSI', 'LINGKUNGAN'].includes(pendingReason)
  ) {
    fail('PENDING membutuhkan reason yang sah');
  }
  return {
    ...owner,
    status,
    pendingReason,
    heartbeatAt: new Date().toISOString(),
    lastCheckpoint: options.checkpoint ?? owner.lastCheckpoint,
  };
}

function recover() {
  const owner = readOwner();
  if (owner.sessionId === sessionId) {
    print(owner);
    return;
  }
  if (owner.status === 'PENDING' && owner.pendingReason === 'OWNER') {
    fail('PENDING/OWNER tidak boleh dilanjutkan otomatis');
  }
  if (options['confirm-no-mutation'] !== 'true') {
    fail('Pemulihan memerlukan --confirm-no-mutation true');
  }
  if (processAlive(owner.processId)) fail('Proses pemilik lama masih hidup');
  if (!['AKTIF', 'ERROR', 'PENDING'].includes(owner.status)) fail('Status tidak dapat dipulihkan');
  const previousSessionId = owner.sessionId;
  const recovered = {
    ...owner,
    sessionId,
    processId: numericPid(options.pid),
    heartbeatAt: new Date().toISOString(),
    status: 'AKTIF',
    pendingReason: null,
    recoveredFrom: previousSessionId,
    lastCheckpoint: options.checkpoint ?? owner.lastCheckpoint,
  };
  atomicWrite(recovered);
  print(recovered);
}

function release() {
  const owner = readOwner();
  requireSession(owner);
  if (!['DONE', 'MENUNGGU-OWNER', 'PENDING', 'ERROR'].includes(options.status)) {
    fail('Release memerlukan status akhir yang sah');
  }
  fs.unlinkSync(ownerFile);
  fs.rmdirSync(lockDirectory);
  print({ ok: true, taskId, sessionId, releasedAs: options.status });
}

function updateOwner(transform) {
  const owner = readOwner();
  requireSession(owner);
  const updated = transform(owner);
  atomicWrite(updated);
  print(updated);
}

function readOwner() {
  if (!fs.existsSync(ownerFile)) fail(`Task ${taskId} belum dikunci`);
  return JSON.parse(fs.readFileSync(ownerFile, 'utf8'));
}

function atomicWrite(owner) {
  const temporary = `${ownerFile}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(owner, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, ownerFile);
}

function requireSession(owner) {
  if (owner.sessionId !== sessionId) fail('Session bukan pemilik lock');
}

function processAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function numericPid(value) {
  const pid = value === undefined ? process.pid : Number(value);
  if (!Number.isInteger(pid) || pid <= 1) fail('PID tidak sah');
  return pid;
}

function safeIdentifier(value, label) {
  if (!value || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(value)) {
    fail(`${label} ID tidak sah`);
  }
  return value;
}

function isInsideWorkspace(candidate, workspace) {
  let workspaceStats;
  try {
    workspaceStats = fs.statSync(workspace);
  } catch {
    return false;
  }
  let current = path.resolve(candidate);
  while (true) {
    try {
      const currentStats = fs.statSync(current);
      if (currentStats.dev === workspaceStats.dev && currentStats.ino === workspaceStats.ino) {
        return true;
      }
    } catch {
      // Kandidat yang tidak dapat diinspeksi tidak dapat menjadi lock sah.
    }
    const parent = path.dirname(current);
    if (parent === current) return false;
    current = parent;
  }
}

function parseOptions(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || value === undefined) fail('Argumen harus --nama nilai');
    parsed[key.slice(2)] = value;
  }
  return parsed;
}

function print(value) {
  console.log(JSON.stringify({ ok: true, ...value }));
}

function fail(message) {
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exit(1);
}
