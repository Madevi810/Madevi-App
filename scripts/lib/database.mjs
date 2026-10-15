import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import pg from 'pg';

import { assertWorkspaceProject, loadLocalConfig, projectRoot } from './config.mjs';

export function databaseScriptContext(metaUrl) {
  const root = projectRoot(metaUrl);
  assertWorkspaceProject(root);
  const config = loadLocalConfig(root);
  return { root, config };
}

export function databaseUrl(config, override = process.env.DATABASE_URL) {
  return override ?? config.DATABASE_URL;
}

export function createScriptPool(config, override) {
  return new pg.Pool({
    connectionString: databaseUrl(config, override),
    max: 4,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 10_000,
    application_name: 'madevi-off-script',
  });
}

export function safeSchema(value = process.env.MADEVI_DB_SCHEMA ?? 'madevi') {
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(value)) {
    throw new Error('Nama schema hanya boleh huruf kecil, angka, dan underscore');
  }
  return value;
}

export function quoteIdentifier(value) {
  return `"${safeSchema(value)}"`;
}

export function migrationFiles(root) {
  const directory = path.join(root, 'database', 'migrations');
  const names = fs
    .readdirSync(directory)
    .filter((name) => /^\d{4}-[a-z0-9-]+\.up\.sql$/.test(name))
    .sort();
  const migrations = names.map((upName) => {
    const id = upName.slice(0, 4);
    const slug = upName.slice(5, -7);
    const downName = `${id}-${slug}.down.sql`;
    const up = fs.readFileSync(path.join(directory, upName), 'utf8');
    const downPath = path.join(directory, downName);
    if (!fs.existsSync(downPath)) throw new Error(`Rollback migrasi hilang: ${downName}`);
    const down = fs.readFileSync(downPath, 'utf8');
    return {
      id,
      name: slug,
      up,
      down,
      checksum: crypto.createHash('sha256').update(up).digest('hex'),
    };
  });
  const seenIds = new Set();
  for (const migration of migrations) {
    if (seenIds.has(migration.id)) {
      throw new Error(`ID migrasi ganda: ${migration.id}`);
    }
    seenIds.add(migration.id);
  }
  return migrations;
}

export function sqlForSchema(sql, schema) {
  return sql.replaceAll('__SCHEMA__', quoteIdentifier(schema));
}

export function parseOptions(args) {
  const result = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      throw new Error('Argumen harus berpasangan --nama nilai');
    }
    result[key.slice(2)] = value;
  }
  return result;
}

export function printSafe(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}
