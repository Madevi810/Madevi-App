import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { assertWorkspaceProject, parseEnvFile, projectRoot } from './lib/config.mjs';
import { checkPort } from './lib/process-state.mjs';

const command = process.argv[2];
const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);

if (process.platform !== 'android') {
  throw new Error(
    'Gunakan script ini dari Termux native sebagai pengguna aplikasi, bukan root/PRoot',
  );
}

const runtimeRoot = path.join(root, 'cloud-local');
const termuxPrefix = path.resolve(path.dirname(process.execPath), '..');
if (!termuxPrefix.startsWith('/data/data/com.termux/files/usr')) {
  throw new Error('Prefix Termux native tidak dikenali');
}
const dataDirectory = path.join(termuxPrefix, 'var', 'lib', 'postgresql', 'madevi');
const socketDirectory = path.join(termuxPrefix, 'var', 'run', 'madevi-postgres');
const logDirectory = path.join(runtimeRoot, 'logs');
const logFile = path.join(logDirectory, 'postgres.log');
const envFile = path.join(root, '.env.local');
const host = '127.0.0.1';
const port = 5432;

for (const directory of [runtimeRoot, logDirectory, dataDirectory, socketDirectory]) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
}

switch (command) {
  case 'bootstrap':
    await bootstrap();
    break;
  case 'start':
    await start();
    break;
  case 'status':
    status();
    break;
  case 'stop':
    stop();
    break;
  default:
    throw new Error('Perintah PostgreSQL: bootstrap | start | status | stop');
}

async function bootstrap() {
  if (!fs.existsSync(path.join(dataDirectory, 'PG_VERSION'))) {
    const existing = fs.readdirSync(dataDirectory);
    if (existing.length > 0) {
      throw new Error('Direktori PostgreSQL berisi data parsial; periksa manual sebelum initdb');
    }
    fs.chmodSync(dataDirectory, 0o700);
    const actualMode = fs.statSync(dataDirectory).mode & 0o777;
    if (![0o700, 0o750].includes(actualMode)) {
      throw new Error(
        `Filesystem mempertahankan mode ${actualMode.toString(8).padStart(4, '0')}; ` +
          'PostgreSQL memerlukan 0700 atau 0750 untuk direktori data',
      );
    }
    run('initdb', [
      '-D',
      dataDirectory,
      '--username=madevi_admin',
      '--auth-local=trust',
      '--auth-host=scram-sha-256',
      '--encoding=UTF8',
      '--no-locale',
    ]);
  }

  await start();
  const existing = parseEnvFile(envFile);
  let password;
  if (existing.DATABASE_URL) {
    const url = new URL(existing.DATABASE_URL);
    password = decodeURIComponent(url.password);
  }
  password ||= crypto.randomBytes(32).toString('base64url');
  const authTokenSecret =
    existing.AUTH_TOKEN_SECRET || crypto.randomBytes(48).toString('base64url');
  let ownerBootstrapKeyHash = existing.ADMIN_BOOTSTRAP_KEY_HASH;
  if (!ownerBootstrapKeyHash) {
    const bootstrapKeyPath = path.join(runtimeRoot, 'run', 'owner-bootstrap.key');
    fs.mkdirSync(path.dirname(bootstrapKeyPath), { recursive: true, mode: 0o700 });
    const existingBootstrapKey = readExistingBootstrapKey(bootstrapKeyPath);
    if (existingBootstrapKey) {
      ownerBootstrapKeyHash = crypto
        .createHash('sha256')
        .update(existingBootstrapKey)
        .digest('hex');
    } else {
      const bootstrapKey = crypto.randomBytes(32).toString('base64url');
      ownerBootstrapKeyHash = crypto.createHash('sha256').update(bootstrapKey).digest('hex');
      fs.writeFileSync(bootstrapKeyPath, `${bootstrapKey}\n`, { flag: 'wx', mode: 0o600 });
    }
  }

  const escapedPassword = password.replaceAll("'", "''");
  const sql = `
SELECT 'CREATE ROLE madevi_local LOGIN' WHERE NOT EXISTS
  (SELECT 1 FROM pg_roles WHERE rolname = 'madevi_local')\\gexec
ALTER ROLE madevi_local PASSWORD '${escapedPassword}';
SELECT 'CREATE DATABASE madevi_off OWNER madevi_local' WHERE NOT EXISTS
  (SELECT 1 FROM pg_database WHERE datname = 'madevi_off')\\gexec
REVOKE ALL ON DATABASE madevi_off FROM PUBLIC;
`;
  run(
    'psql',
    ['-h', socketDirectory, '-U', 'madevi_admin', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1'],
    sql,
  );

  const databaseUrl = new URL(`postgresql://${host}:${port}/madevi_off`);
  databaseUrl.username = 'madevi_local';
  databaseUrl.password = password;
  const env = [
    'APP_ENV=development',
    `APP_HOST=${host}`,
    'APP_PORT=3000',
    'APP_ORIGIN=http://localhost:3000',
    `DATABASE_URL=${databaseUrl.toString()}`,
    `MADEVI_RUNTIME_ROOT=${runtimeRoot}`,
    'MADEVI_DB_SCHEMA=madevi',
    `AUTH_TOKEN_SECRET=${authTokenSecret}`,
    `ADMIN_BOOTSTRAP_KEY_HASH=${ownerBootstrapKeyHash}`,
    'LOG_LEVEL=info',
    '',
  ].join('\n');
  fs.writeFileSync(envFile, env, { mode: 0o600 });
  fs.chmodSync(envFile, 0o600);
  print({
    status: 'siap',
    database: 'madevi_off',
    role: 'madevi_local',
    host,
    port,
    dataDirectory,
    secretPrinted: false,
  });
}

async function start() {
  if (postgresStatus().running) {
    print({ status: 'sudah-aktif', host, port, dataDirectory });
    return;
  }
  if (!fs.existsSync(path.join(dataDirectory, 'PG_VERSION'))) {
    throw new Error('Cluster PostgreSQL belum ada; jalankan db:bootstrap:termux');
  }
  const portState = await checkPort(host, port);
  if (!portState.available) {
    throw new Error(`Port ${host}:${port} sedang dipakai; proses lain tidak disentuh`);
  }
  run('pg_ctl', [
    '-D',
    dataDirectory,
    '-l',
    logFile,
    '-o',
    `-h ${host} -p ${port} -k ${socketDirectory}`,
    '-w',
    '-t',
    '30',
    'start',
  ]);
  print({ status: 'aktif', host, port, dataDirectory, logFile });
}

function status() {
  const state = postgresStatus();
  print({ status: state.running ? 'aktif' : 'berhenti', dataDirectory });
  if (!state.running) process.exitCode = 1;
}

function stop() {
  if (!postgresStatus().running) {
    print({ status: 'sudah-berhenti', dataDirectory });
    return;
  }
  run('pg_ctl', ['-D', dataDirectory, '-m', 'fast', '-w', '-t', '30', 'stop']);
  print({ status: 'berhenti', dataDirectory });
}

function postgresStatus() {
  if (!fs.existsSync(path.join(dataDirectory, 'PG_VERSION'))) return { running: false };
  
  let executable = 'pg_ctl';
  let args = ['status', '-D', dataDirectory];
  if (process.getuid?.() === 0) {
    args = ['-u', 'aid_u0_a1004', '--', executable, ...args];
    executable = 'runuser';
  }

  const result = spawnSync(executable, args, { encoding: 'utf8' });
  if (result.status === 0) return { running: true };
  if (result.status === 3) return { running: false };
  throw new Error(safeError('Pemeriksaan PostgreSQL gagal', result));
}

function run(executable, args, input) {
  if (process.getuid?.() === 0) {
    args = ['-u', 'aid_u0_a1004', '--', executable, ...args];
    executable = 'runuser';
  }
  const result = spawnSync(executable, args, {
    cwd: root,
    input,
    encoding: 'utf8',
    stdio: input === undefined ? ['ignore', 'pipe', 'pipe'] : ['pipe', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(safeError(`${executable} gagal`, result));
  return result;
}

function readExistingBootstrapKey(file) {
  if (!fs.existsSync(file)) return null;
  const metadata = fs.lstatSync(file);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error('owner-bootstrap.key existing bukan file biasa; tidak ditimpa');
  }
  if (metadata.size < 44 || metadata.size > 128) {
    throw new Error('owner-bootstrap.key existing memiliki ukuran tidak sah; tidak ditimpa');
  }
  const value = fs.readFileSync(file, 'utf8').trim();
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) {
    throw new Error('owner-bootstrap.key existing tidak valid; tidak ditimpa');
  }
  return value;
}

function safeError(prefix, result) {
  const line = (result.stderr || result.stdout || '').trim().split(/\r?\n/).filter(Boolean).at(-1);
  return `${prefix}: ${line || `exit ${result.status ?? 'null'}`}`;
}

function print(value) {
  console.log(JSON.stringify({ ok: true, ...value }));
}
