import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

export function ensureRuntimeDirectories(config) {
  const directories = [
    config.MADEVI_RUNTIME_ROOT,
    path.join(config.MADEVI_RUNTIME_ROOT, 'run'),
    path.join(config.MADEVI_RUNTIME_ROOT, 'logs'),
    path.join(config.MADEVI_RUNTIME_ROOT, 'storage', 'quarantine'),
    path.join(config.MADEVI_RUNTIME_ROOT, 'storage', 'objects'),
    path.join(config.MADEVI_RUNTIME_ROOT, 'backups'),
  ];
  for (const directory of directories) fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  return directories;
}

export function processRecordFile(config) {
  return path.join(config.MADEVI_RUNTIME_ROOT, 'run', 'app-process.json');
}

export function readProcessRecord(config) {
  const file = processRecordFile(config);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeProcessRecord(config, record) {
  const file = processRecordFile(config);
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

export function removeProcessRecord(config) {
  const file = processRecordFile(config);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

export function processStartTicks(pid) {
  try {
    const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
    const end = stat.lastIndexOf(')');
    const fieldsAfterCommand = stat
      .slice(end + 2)
      .trim()
      .split(/\s+/);
    return fieldsAfterCommand[19] ?? null;
  } catch {
    return null;
  }
}

export function inspectOwnedProcess(record, expectedProjectRoot) {
  if (!record || !Number.isInteger(record.pid) || record.pid <= 1) {
    return { alive: false, owned: false, reason: 'record-tidak-valid' };
  }
  try {
    process.kill(record.pid, 0);
  } catch {
    return { alive: false, owned: false, reason: 'proses-mati' };
  }
  const ticks = processStartTicks(record.pid);
  if (!ticks || ticks !== record.startTicks) {
    return { alive: true, owned: false, reason: 'identitas-pid-berubah' };
  }
  if (path.resolve(record.projectRoot) !== path.resolve(expectedProjectRoot)) {
    return { alive: true, owned: false, reason: 'root-proyek-berbeda' };
  }
  return { alive: true, owned: true, reason: 'milik-task' };
}

export function checkPort(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(700);
    socket.once('connect', () => {
      socket.destroy();
      resolve({ available: false, reason: 'terhubung' });
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve({ available: false, reason: 'timeout' });
    });
    socket.once('error', (error) => {
      socket.destroy();
      resolve({ available: error.code === 'ECONNREFUSED', reason: error.code ?? 'error' });
    });
  });
}

export async function waitForHealth(origin, timeoutMs = 30_000) {
  const deadline = performance.now() + timeoutMs;
  let lastError = 'belum-diperiksa';
  while (performance.now() < deadline) {
    try {
      const response = await fetch(`${origin}/api/health`, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(2_000),
      });
      const body = await response.json();
      if (response.ok && body?.data?.status === 'ok' && body?.requestId) return body;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.name : 'error';
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Health belum siap dalam ${timeoutMs} ms (${lastError})`);
}

export async function waitForExit(pid, timeoutMs) {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    try {
      process.kill(pid, 0);
    } catch {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return false;
}

export function terminateProcess(pid, signal = 'SIGTERM') {
  try {
    process.kill(-pid, signal);
    return true;
  } catch (groupError) {
    if (groupError.code === 'ESRCH') return false;
    try {
      process.kill(pid, signal);
      return true;
    } catch (singleError) {
      if (singleError.code === 'ESRCH') return false;
      throw singleError;
    }
  }
}
