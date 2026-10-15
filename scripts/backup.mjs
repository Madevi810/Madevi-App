import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { databaseScriptContext, parseOptions, printSafe, safeSchema } from './lib/database.mjs';
import { runPostgresTool } from './lib/postgres-tools.mjs';

const options = parseOptions(process.argv.slice(2));
const { root, config } = databaseScriptContext(import.meta.url);
const schema = safeSchema(options.schema ?? config.MADEVI_DB_SCHEMA);
const backupCode = `backup-${new Date().toISOString().replace(/[-:.TZ]/g, '')}-${crypto
  .randomBytes(4)
  .toString('hex')}`;
const backupsRoot = path.join(root, 'backup-local');
const backupDirectory = path.join(backupsRoot, backupCode);
const storageSource = path.join(config.MADEVI_RUNTIME_ROOT, 'storage');
const storageTarget = path.join(backupDirectory, 'storage');
const dumpFile = path.join(backupDirectory, 'database.dump');
const manifestFile = path.join(backupDirectory, 'manifest.json');

fs.mkdirSync(backupDirectory, { recursive: true, mode: 0o700 });
try {
  runPostgresTool(
    'pg_dump',
    ['--format=custom', '--no-owner', '--no-privileges', `--file=${dumpFile}`],
    config.DATABASE_URL,
  );
  ensureNonEmptyRegularFile(dumpFile, 'Dump PostgreSQL');
  if (fs.existsSync(storageSource)) {
    // L07 G-07: tolak symlink/path keluar root; kecualikan log/cache/key/env
    // dari salinan storage agar manifest kebijakan exclusion jelas.
    copyStorageFiltered(storageSource, storageTarget);
  } else {
    fs.mkdirSync(storageTarget, { recursive: true, mode: 0o700 });
  }
  const files = listFiles(backupDirectory)
    .filter((file) => file !== manifestFile)
    .map((file) => ({
      path: path.relative(backupDirectory, file).split(path.sep).join('/'),
      size: fs.statSync(file).size,
      sha256: sha256File(file),
    }));
  const dump = files.find((file) => file.path === 'database.dump');
  if (!dump || dump.size < 1) {
    throw new Error('Manifest backup tidak memiliki dump PostgreSQL yang tidak kosong');
  }
  // L07: manifest memuat scope/exclusions/checksum agregat tanpa secret.
  const exclusions = [
    '**/*.log',
    '**/.env*',
    '**/*.key',
    '**/*.pem',
    '**/cache/**',
    '**/.npm-cache/**',
    'cloud-local/logs/**',
  ];
  const scope = { database: true, storage: true, exclusions };
  const aggregateChecksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(files.map((f) => `${f.path}:${f.sha256}:${f.size}`).sort()))
    .digest('hex');
  const manifest = {
    manifestVersion: 1,
    schemaVersion: 1,
    status: 'COMPLETE',
    backupCode,
    sourceSchema: schema,
    sourceDatabase: new URL(config.DATABASE_URL).pathname.slice(1),
    createdAt: new Date().toISOString(),
    scope,
    exclusions,
    aggregateChecksum,
    files,
    fileListSha256: crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex'),
  };
  const temporary = `${manifestFile}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, manifestFile);
  printSafe({ ok: true, backupCode, schema, manifest: manifestFile, files: files.length });
} catch (error) {
  fs.writeFileSync(
    path.join(backupDirectory, 'FAILED.txt'),
    `Backup gagal pada ${new Date().toISOString()}; periksa output command yang sudah disanitasi.\n`,
    { mode: 0o600 },
  );
  throw error;
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    // L07: symlink di dalam backup ditolak fail-closed (tanpa mengikuti link).
    if (entry.isSymbolicLink()) {
      throw new Error(`Symlink ditolak di backup: ${target}`);
    }
    return entry.isDirectory() ? listFiles(target) : [target];
  });
}

/**
 * L07: salin storage dengan filter exclusion + tolak symlink.
 * Log/cache/key/env tidak ikut ke backup; path keluar root ditolak.
 */
function copyStorageFiltered(source, target) {
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) throw new Error('Storage source adalah symlink; ditolak.');
  fs.mkdirSync(target, { recursive: true, mode: 0o700 });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dst = path.join(target, entry.name);
    const st = fs.lstatSync(src);
    if (st.isSymbolicLink()) throw new Error(`Symlink ditolak: ${src}`);
    if (entry.isDirectory()) {
      if (['cache', '.npm-cache', 'logs', 'tmp'].includes(entry.name)) continue;
      copyStorageFiltered(src, dst);
      continue;
    }
    if (!st.isFile()) throw new Error(`Bukan file biasa: ${src}`);
    if (/\.(log|key|pem)$/i.test(entry.name) || entry.name.startsWith('.env')) continue;
    fs.copyFileSync(src, dst);
  }
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function ensureNonEmptyRegularFile(file, label) {
  const stat = fs.statSync(file);
  if (!stat.isFile() || stat.size < 1) {
    throw new Error(`${label} kosong atau bukan file biasa`);
  }
}
