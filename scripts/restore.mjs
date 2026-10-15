import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import pg from 'pg';

import { databaseScriptContext, parseOptions, printSafe } from './lib/database.mjs';
import { runPostgresTool } from './lib/postgres-tools.mjs';

const options = parseOptions(process.argv.slice(2));
const { root } = databaseScriptContext(import.meta.url);
const manifestFile = path.resolve(options.manifest ?? '');
const backupsRoot = path.resolve(root, 'backup-local');
if (!manifestFile.startsWith(`${backupsRoot}${path.sep}`)) {
  throw new Error('Manifest restore harus berasal dari backup-local');
}
const targetDatabaseUrl = process.env.TARGET_DATABASE_URL;
if (!targetDatabaseUrl) throw new Error('TARGET_DATABASE_URL wajib diberikan melalui environment');
const targetRuntimeRoot = path.resolve(options['target-runtime-root'] ?? '');
const restoreTargets = path.resolve(root, 'backup-local', 'restore-targets');
if (!targetRuntimeRoot.startsWith(`${restoreTargets}${path.sep}`)) {
  throw new Error(
    'Target runtime restore harus berada di backup-local/restore-targets dan bukan runtime aktif',
  );
}
if (fs.existsSync(targetRuntimeRoot) && fs.readdirSync(targetRuntimeRoot).length > 0) {
  throw new Error('Target runtime restore harus kosong');
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
if (manifest.status !== 'COMPLETE' || !Array.isArray(manifest.files)) {
  throw new Error('Manifest backup tidak COMPLETE');
}
const dumpEntry = manifest.files.find((entry) => entry?.path === 'database.dump');
if (!dumpEntry || !Number.isSafeInteger(dumpEntry.size) || dumpEntry.size < 1) {
  throw new Error('Manifest backup tidak memiliki dump PostgreSQL yang tidak kosong');
}
const fileListSha256 = crypto
  .createHash('sha256')
  .update(JSON.stringify(manifest.files))
  .digest('hex');
if (fileListSha256 !== manifest.fileListSha256) throw new Error('Daftar file backup berubah');
const backupDirectory = path.dirname(manifestFile);
for (const entry of manifest.files) {
  if (!entry.path || path.isAbsolute(entry.path) || entry.path.split(/[\\/]/).includes('..')) {
    throw new Error('Path file backup tidak aman');
  }
  const file = path.join(backupDirectory, ...entry.path.split('/'));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new Error(`File backup hilang atau tidak valid: ${entry.path}`);
  }
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (hash !== entry.sha256 || fs.statSync(file).size !== entry.size) {
    throw new Error(`Checksum backup tidak cocok: ${entry.path}`);
  }
}

const targetPool = new pg.Pool({
  connectionString: targetDatabaseUrl,
  max: 1,
  connectionTimeoutMillis: 3_000,
  application_name: 'madevi-restore-check',
});
try {
  const existing = await targetPool.query(
    `SELECT count(*)::integer AS count
       FROM pg_catalog.pg_class c
       JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r' AND n.nspname NOT IN ('pg_catalog', 'information_schema')`,
  );
  if ((existing.rows[0]?.count ?? 0) !== 0) throw new Error('Database target tidak kosong');
} finally {
  await targetPool.end();
}

fs.mkdirSync(targetRuntimeRoot, { recursive: true, mode: 0o700 });
runPostgresTool(
  'pg_restore',
  [
    '--exit-on-error',
    '--no-owner',
    '--no-privileges',
    `--dbname=${new URL(targetDatabaseUrl).pathname.slice(1)}`,
    path.join(backupDirectory, 'database.dump'),
  ],
  targetDatabaseUrl,
);
const storageSource = path.join(backupDirectory, 'storage');
const storageTarget = path.join(targetRuntimeRoot, 'storage');
fs.cpSync(storageSource, storageTarget, { recursive: true, errorOnExist: true });

for (const entry of manifest.files.filter((item) => item.path.startsWith('storage/'))) {
  const restored = path.join(targetRuntimeRoot, ...entry.path.split('/'));
  const hash = crypto.createHash('sha256').update(fs.readFileSync(restored)).digest('hex');
  if (hash !== entry.sha256) throw new Error(`Checksum hasil restore tidak cocok: ${entry.path}`);
}
fs.writeFileSync(
  path.join(targetRuntimeRoot, 'RESTORE-REPORT.json'),
  `${JSON.stringify(
    {
      ok: true,
      backupCode: manifest.backupCode,
      sourceSchema: manifest.sourceSchema,
      targetDatabase: new URL(targetDatabaseUrl).pathname.slice(1),
      restoredAt: new Date().toISOString(),
      checksumVerified: true,
    },
    null,
    2,
  )}\n`,
  { mode: 0o600 },
);
printSafe({
  ok: true,
  backupCode: manifest.backupCode,
  targetDatabase: new URL(targetDatabaseUrl).pathname.slice(1),
  targetRuntimeRoot,
  checksumVerified: true,
});
