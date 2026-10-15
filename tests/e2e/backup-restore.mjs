import crypto, { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import pg from 'pg';

import { parseEnvFile } from '../../scripts/lib/config.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const config = parseEnvFile(path.join(root, '.env.local'));
const sourceUrl = new URL(config.DATABASE_URL);
const databaseName = `madevi_restore_test_${process.pid}`;
const targetUrl = new URL(sourceUrl.toString());
targetUrl.pathname = `/${databaseName}`;
const restoreRoot = path.join(root, 'backup-local', 'restore-targets', databaseName);
const fixtureId = randomUUID();
const fixtureRelative = `quarantine/${fixtureId}.bin`;
const fixturePath = path.join(root, 'cloud-local', 'storage', fixtureRelative);
const fixtureBytes = Buffer.from('MADEVI TEST BACKUP BYTES');
const termuxBin = '/data/data/com.termux/files/usr/bin';
const socket = '127.0.0.1';
let backupDirectory;

try {
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(fixturePath, fixtureBytes, { flag: 'wx', mode: 0o600 });
  const backup = runNode('scripts/backup.mjs');
  const backupResult = JSON.parse(backup.stdout.trim().split(/\r?\n/).at(-1));
  backupDirectory = path.dirname(backupResult.manifest);

  const originalManifest = JSON.parse(fs.readFileSync(backupResult.manifest, 'utf8'));
  const dumpEntry = originalManifest.files.find((entry) => entry.path === 'database.dump');
  if (!dumpEntry || dumpEntry.size < 1) {
    throw new Error('Backup berhasil tanpa dump PostgreSQL yang tidak kosong');
  }
  const tamperedManifest = {
    ...originalManifest,
    files: originalManifest.files.map((entry, index) =>
      index === 0 ? { ...entry, sha256: '0'.repeat(64) } : entry,
    ),
  };
  tamperedManifest.fileListSha256 = crypto
    .createHash('sha256')
    .update(JSON.stringify(tamperedManifest.files))
    .digest('hex');
  const tamperedManifestFile = path.join(backupDirectory, 'manifest-tampered.json');
  fs.writeFileSync(tamperedManifestFile, `${JSON.stringify(tamperedManifest)}\n`, { mode: 0o600 });
  const tampered = runNodeFailure(
    'scripts/restore.mjs',
    ['--manifest', tamperedManifestFile, '--target-runtime-root', restoreRoot],
    { TARGET_DATABASE_URL: targetUrl.toString() },
  );
  if (!/Checksum backup tidak cocok/.test(tampered.stderr)) {
    throw new Error('Restore tidak menolak checksum rusak dengan alasan yang benar');
  }
  fs.unlinkSync(tamperedManifestFile);

  runNative('createdb', ['-h', socket, '-U', 'madevi_admin', '-O', 'madevi_local', databaseName]);
  runNode(
    'scripts/restore.mjs',
    ['--manifest', backupResult.manifest, '--target-runtime-root', restoreRoot],
    { TARGET_DATABASE_URL: targetUrl.toString() },
  );

  const target = new pg.Client({ connectionString: targetUrl.toString() });
  await target.connect();
  const result = await target.query(
    `SELECT
       (SELECT count(*)::integer FROM madevi.principals WHERE is_test) AS principals,
       (SELECT count(*)::integer FROM madevi.fixture_articles WHERE is_test) AS articles,
       (SELECT count(*)::integer FROM public.madevi_migration_history WHERE schema_name = 'madevi') AS migrations`,
  );
  await target.end();
  const restoredBytes = fs.readFileSync(path.join(restoreRoot, 'storage', fixtureRelative));
  if (!restoredBytes.equals(fixtureBytes)) throw new Error('Byte hasil restore tidak identik');
  if (
    result.rows[0].principals < 3 ||
    result.rows[0].articles < 1 ||
    result.rows[0].migrations < 2
  ) {
    throw new Error('Data hasil restore tidak lengkap');
  }
  const repeated = runNodeFailure(
    'scripts/restore.mjs',
    ['--manifest', backupResult.manifest, '--target-runtime-root', restoreRoot],
    { TARGET_DATABASE_URL: targetUrl.toString() },
  );
  if (!/Target runtime restore harus kosong/.test(repeated.stderr)) {
    throw new Error('Restore ulang ke target berisi tidak ditolak');
  }
  process.stdout.write(
    `${JSON.stringify({
      ok: true,
      mode: 'REAL_LOCAL',
      targetDatabase: databaseName,
      principals: result.rows[0].principals,
      articles: result.rows[0].articles,
      migrations: result.rows[0].migrations,
      bytesSha256: crypto.createHash('sha256').update(restoredBytes).digest('hex'),
      checksumVerified: true,
    })}\n`,
  );
} finally {
  runNative(
    'dropdb',
    ['-h', socket, '-U', 'madevi_admin', '--force', '--if-exists', databaseName],
    true,
  );
  fs.rmSync(restoreRoot, { recursive: true, force: true });
  if (backupDirectory) fs.rmSync(backupDirectory, { recursive: true, force: true });
  if (fs.existsSync(fixturePath)) fs.unlinkSync(fixturePath);
}

function runNode(script, args = [], extraEnvironment = {}) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: { ...process.env, ...extraEnvironment },
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout).trim());
  return result;
}

function runNodeFailure(script, args = [], extraEnvironment = {}) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: { ...process.env, ...extraEnvironment },
    encoding: 'utf8',
  });
  if (result.status === 0) throw new Error(`${script} seharusnya gagal aman`);
  return result;
}

function runNative(command, args, ignoreFailure = false) {
  const result = spawnSync(
    'setpriv',
    ['--reuid=10260', '--regid=1023', '--clear-groups', path.join(termuxBin, command), ...args],
    { cwd: root, encoding: 'utf8' },
  );
  if (result.status !== 0 && !ignoreFailure) {
    throw new Error(
      `${command} gagal: ${(result.stderr || result.stdout).trim().split(/\r?\n/).at(-1)}`,
    );
  }
  return result;
}
