import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { assertWorkspaceProject, parseEnvFile, projectRoot } from './lib/config.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);
if (process.platform !== 'linux' || process.getuid?.() !== 0) {
  throw new Error(
    'Bootstrap ini khusus Ubuntu PRoot sebagai root; jangan pakai untuk Termux native',
  );
}
const runtimeRoot = path.join(root, 'cloud-local');
const socketDirectory = path.join(runtimeRoot, 'postgres-socket');
const envFile = path.join(root, '.env.local');
const existing = parseEnvFile(envFile);
let password;
if (existing.DATABASE_URL) {
  const existingUrl = new URL(existing.DATABASE_URL);
  password = decodeURIComponent(existingUrl.password);
}
password ||= crypto.randomBytes(32).toString('base64url');

const escapedPassword = password.replaceAll("'", "''");
const sql = `
SELECT 'CREATE ROLE madevi_local LOGIN' WHERE NOT EXISTS
  (SELECT 1 FROM pg_roles WHERE rolname = 'madevi_local')\\gexec
ALTER ROLE madevi_local PASSWORD '${escapedPassword}';
SELECT 'CREATE DATABASE madevi_off OWNER madevi_local' WHERE NOT EXISTS
  (SELECT 1 FROM pg_database WHERE datname = 'madevi_off')\\gexec
REVOKE ALL ON DATABASE madevi_off FROM PUBLIC;
`;
const result = spawnSync(
  'runuser',
  [
    '-u',
    'postgres',
    '--',
    'psql',
    '-h',
    socketDirectory,
    '-d',
    'postgres',
    '-v',
    'ON_ERROR_STOP=1',
  ],
  { input: sql, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
);
if (result.status !== 0) {
  throw new Error(
    `Bootstrap PostgreSQL gagal: ${(result.stderr || '').trim().split(/\r?\n/).at(-1)}`,
  );
}

const databaseUrl = new URL('postgresql://127.0.0.1:5432/madevi_off');
databaseUrl.username = 'madevi_local';
databaseUrl.password = password;
const env = [
  'APP_ENV=development',
  'APP_HOST=127.0.0.1',
  'APP_PORT=3000',
  'APP_ORIGIN=http://localhost:3000',
  `DATABASE_URL=${databaseUrl.toString()}`,
  `MADEVI_RUNTIME_ROOT=${runtimeRoot}`,
  'MADEVI_DB_SCHEMA=madevi',
  'LOG_LEVEL=info',
  '',
].join('\n');
fs.writeFileSync(envFile, env, { mode: 0o600 });
fs.chmodSync(envFile, 0o600);
console.log(
  JSON.stringify({
    ok: true,
    database: 'madevi_off',
    role: 'madevi_local',
    socketDirectory,
    envFile,
    secretPrinted: false,
  }),
);
