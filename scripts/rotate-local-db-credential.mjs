import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { assertWorkspaceProject, parseEnvFile, projectRoot } from './lib/config.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);
if (process.platform !== 'android' || process.getuid?.() === 0) {
  throw new Error('Rotasi kredensial harus dijalankan dari konteks pengguna Termux native');
}
if (process.argv[2] !== '--confirm-local-rotation') {
  throw new Error('Gunakan --confirm-local-rotation untuk rotasi kredensial lokal');
}
const prefix = path.resolve(path.dirname(process.execPath), '..');
const psql = path.join(prefix, 'bin', 'psql');
const socketDirectory = path.join(prefix, 'var', 'run', 'madevi-postgres');
const envFile = path.join(root, '.env.local');
const existing = parseEnvFile(envFile);
const oldUrl = new URL(existing.DATABASE_URL);
const oldPassword = decodeURIComponent(oldUrl.password);
const newPassword = crypto.randomBytes(32).toString('base64url');
const temporary = `${envFile}.${process.pid}.tmp`;
const newUrl = new URL(oldUrl.toString());
newUrl.password = newPassword;
const envText = fs
  .readFileSync(envFile, 'utf8')
  .split(/\r?\n/)
  .map((line) => (line.startsWith('DATABASE_URL=') ? `DATABASE_URL=${newUrl.toString()}` : line))
  .join('\n');
fs.writeFileSync(temporary, envText, { mode: 0o600, flag: 'wx' });

try {
  alterPassword(newPassword);
  try {
    fs.renameSync(temporary, envFile);
    fs.chmodSync(envFile, 0o600);
  } catch (error) {
    alterPassword(oldPassword);
    throw error;
  }
  process.stdout.write(
    `${JSON.stringify({ ok: true, role: 'madevi_local', rotated: true, secretPrinted: false })}\n`,
  );
} catch (error) {
  if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  throw error;
}

function alterPassword(password) {
  const escaped = password.replaceAll("'", "''");
  const result = spawnSync(
    psql,
    ['-h', socketDirectory, '-U', 'madevi_admin', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1'],
    {
      input: `ALTER ROLE madevi_local PASSWORD '${escaped}';\n`,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );
  if (result.status !== 0) throw new Error('Rotasi role PostgreSQL gagal');
}
