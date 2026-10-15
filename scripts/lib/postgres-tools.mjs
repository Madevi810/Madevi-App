import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function postgresExecutable(name) {
  const candidates = [
    process.env.PG_TOOLS_BIN ? path.join(process.env.PG_TOOLS_BIN, name) : null,
    `/data/data/com.termux/files/usr/bin/${name}`,
    name,
  ].filter(Boolean);
  return candidates.find((candidate) => candidate === name || fs.existsSync(candidate)) ?? name;
}

export function postgresEnvironment(databaseUrl) {
  const url = new URL(databaseUrl);
  if (
    !['postgres:', 'postgresql:'].includes(url.protocol) ||
    !['127.0.0.1', 'localhost'].includes(url.hostname)
  ) {
    throw new Error('Database backup/restore harus PostgreSQL loopback');
  }
  return {
    ...process.env,
    PGHOST: url.hostname,
    PGPORT: url.port || '5432',
    PGUSER: decodeURIComponent(url.username),
    PGPASSWORD: decodeURIComponent(url.password),
    PGDATABASE: url.pathname.slice(1),
  };
}

export function runPostgresTool(name, args, databaseUrl) {
  const result = spawnSync(postgresExecutable(name), args, {
    encoding: 'utf8',
    env: postgresEnvironment(databaseUrl),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || '')
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .at(-1);
    throw new Error(`${name} gagal: ${message || `exit ${result.status ?? 'null'}`}`);
  }
  return result;
}
