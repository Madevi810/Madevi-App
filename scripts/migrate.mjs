import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  createScriptPool,
  databaseScriptContext,
  migrationFiles,
  parseOptions,
  printSafe,
  safeSchema,
  sqlForSchema,
} from './lib/database.mjs';

const command = process.argv[2];
const options = parseOptions(process.argv.slice(3));
const { root, config } = databaseScriptContext(import.meta.url);
const schema = safeSchema(options.schema ?? config.MADEVI_DB_SCHEMA);
const migrations = migrationFiles(root);
const target = command === 'up' ? targetMigration(options.target) : undefined;
const pool = createScriptPool(config);

try {
  await ensureHistory();
  if (command === 'up') await migrateUp();
  else if (command === 'down') await migrateDown();
  else if (command === 'status') await status();
  else throw new Error('Perintah migrasi: up | down | status');
} finally {
  await pool.end();
}

async function ensureHistory() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.madevi_migration_history (
      schema_name text NOT NULL,
      migration_id char(4) NOT NULL,
      migration_name text NOT NULL,
      checksum char(64) NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (schema_name, migration_id)
    )
  `);
}

async function appliedMigrations(client = pool) {
  const result = await client.query(
    `SELECT migration_id, migration_name, checksum, applied_at
       FROM public.madevi_migration_history
      WHERE schema_name = $1
      ORDER BY migration_id`,
    [schema],
  );
  return result.rows;
}

async function migrateUp() {
  const selectedMigrations = target
    ? migrations.filter((migration) => migration.id <= target)
    : migrations;
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(hashtext($1))', [`madevi-migrate:${schema}`]);
    const applied = new Map(
      (await appliedMigrations(client)).map((row) => [row.migration_id, row]),
    );
    for (const migration of selectedMigrations) {
      const previous = applied.get(migration.id);
      if (previous && previous.checksum !== migration.checksum) {
        throw new Error(`Checksum migrasi ${migration.id} berubah setelah diterapkan`);
      }
      if (previous) continue;
      await client.query('BEGIN');
      try {
        await client.query(sqlForSchema(migration.up, schema));
        await client.query(
          `INSERT INTO public.madevi_migration_history
             (schema_name, migration_id, migration_name, checksum)
           VALUES ($1, $2, $3, $4)`,
          [schema, migration.id, migration.name, migration.checksum],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    printSafe({
      ok: true,
      command: 'up',
      schema,
      target: target ?? null,
      applied: selectedMigrations.length,
    });
  } finally {
    await client.query('SELECT pg_advisory_unlock(hashtext($1))', [`madevi-migrate:${schema}`]);
    client.release();
  }
}

function targetMigration(value) {
  if (value === undefined) return undefined;
  if (!/^\d{4}$/.test(value) || !migrations.some((migration) => migration.id === value)) {
    throw new Error('Target migrasi tidak ditemukan');
  }
  return value;
}

async function migrateDown() {
  authorizeRollback();
  const steps = Number(options.steps ?? 1);
  if (!Number.isInteger(steps) || steps < 1 || steps > migrations.length) {
    throw new Error('Jumlah langkah rollback tidak sah');
  }
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock(hashtext($1))', [`madevi-migrate:${schema}`]);
    const applied = await appliedMigrations(client);
    const selected = applied.slice(-steps).reverse();
    for (const row of selected) {
      const migration = migrations.find((item) => item.id === row.migration_id);
      if (!migration || migration.checksum !== row.checksum) {
        throw new Error(`Migrasi terpasang ${row.migration_id} tidak cocok dengan source`);
      }
      await client.query('BEGIN');
      try {
        await client.query(sqlForSchema(migration.down, schema));
        await client.query(
          'DELETE FROM public.madevi_migration_history WHERE schema_name = $1 AND migration_id = $2',
          [schema, migration.id],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    printSafe({ ok: true, command: 'down', schema, rolledBack: selected.length });
  } finally {
    await client.query('SELECT pg_advisory_unlock(hashtext($1))', [`madevi-migrate:${schema}`]);
    client.release();
  }
}

function authorizeRollback() {
  if (schema.startsWith('test_') && options['test-only'] === 'true') return;
  if (options['confirm-schema'] !== schema) {
    throw new Error('Rollback non-test memerlukan --confirm-schema dengan nama schema persis');
  }
  const manifestPath = options['backup-manifest'];
  if (!manifestPath) throw new Error('Rollback non-test memerlukan manifest backup COMPLETE');
  const resolved = path.resolve(manifestPath);
  const backupRoot = path.resolve(root, 'backup-local');
  if (!resolved.startsWith(`${backupRoot}${path.sep}`)) {
    throw new Error('Manifest backup harus berada di backup-local');
  }
  const manifest = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const signature = crypto
    .createHash('sha256')
    .update(JSON.stringify(manifest.files ?? []))
    .digest('hex');
  if (
    manifest.status !== 'COMPLETE' ||
    manifest.sourceSchema !== schema ||
    manifest.fileListSha256 !== signature
  ) {
    throw new Error('Manifest backup tidak lengkap atau bukan untuk schema target');
  }
}

async function status() {
  const applied = await appliedMigrations();
  printSafe({
    ok: true,
    schema,
    migrations: migrations.map((migration) => ({
      id: migration.id,
      name: migration.name,
      applied: applied.some((row) => row.migration_id === migration.id),
    })),
  });
}
