import fs from 'node:fs';
import path from 'node:path';

const APP_ENVIRONMENTS = new Set(['development', 'test', 'production-local']);
const LOG_LEVELS = new Set(['debug', 'info', 'warn', 'error']);
const WORKSPACE_ROOTS = ['/sdcard/project/Madevi', '/home/agentuser/.hermes/workspace/madevi'];

export function projectRoot(metaUrl) {
  let current = path.dirname(new URL(metaUrl).pathname);
  while (current !== '/' && current !== '.' && !fs.existsSync(path.join(current, 'package.json'))) {
    current = path.resolve(current, '..');
  }
  return current;
}

export function parseEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const result = {};
  for (const [index, rawLine] of fs.readFileSync(file, 'utf8').split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (!match) throw new Error(`Baris env ${index + 1} tidak valid`);
    if (Object.hasOwn(result, match[1])) throw new Error(`Variabel env ganda: ${match[1]}`);
    result[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return result;
}

export function loadLocalConfig(root, overrides = process.env) {
  const fileValues = parseEnvFile(path.join(root, '.env.local'));
  const source = { ...fileValues };
  for (const key of [
    'APP_ENV',
    'APP_HOST',
    'APP_PORT',
    'APP_ORIGIN',
    'DATABASE_URL',
    'MADEVI_RUNTIME_ROOT',
    'MADEVI_DB_SCHEMA',
    'LOG_LEVEL',
  ]) {
    if (overrides[key] !== undefined) source[key] = overrides[key];
  }

  const errors = [];
  const port = Number(source.APP_PORT);
  if (!APP_ENVIRONMENTS.has(source.APP_ENV)) errors.push('APP_ENV tidak valid');
  if (source.APP_HOST !== '127.0.0.1') errors.push('APP_HOST harus 127.0.0.1');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) errors.push('APP_PORT tidak valid');
  if (!LOG_LEVELS.has(source.LOG_LEVEL)) errors.push('LOG_LEVEL tidak valid');
  validateLocalOrigin(source.APP_ORIGIN, port, errors);
  validatePostgresUrl(source.DATABASE_URL, errors);
  const runtimeRoot = source.MADEVI_RUNTIME_ROOT
    ? path.resolve(source.MADEVI_RUNTIME_ROOT)
    : path.join(root, 'cloud-local');
  if (!isWithinPhysicalRoot(root, runtimeRoot)) {
    errors.push('MADEVI_RUNTIME_ROOT harus berada di dalam folder proyek');
  }
  const databaseSchema = source.MADEVI_DB_SCHEMA ?? 'madevi';
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(databaseSchema)) {
    errors.push('MADEVI_DB_SCHEMA tidak valid');
  }
  if (errors.length) throw new Error(`Konfigurasi lokal tidak valid: ${errors.join('; ')}`);
  return {
    ...source,
    APP_PORT: port,
    MADEVI_RUNTIME_ROOT: runtimeRoot,
    MADEVI_DB_SCHEMA: databaseSchema,
  };
}

function validateLocalOrigin(value, port, errors) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'http:' ||
      !['localhost', '127.0.0.1'].includes(url.hostname) ||
      Number(url.port || 80) !== port ||
      url.pathname !== '/'
    ) {
      errors.push('APP_ORIGIN harus HTTP localhost pada APP_PORT');
    }
  } catch {
    errors.push('APP_ORIGIN tidak valid');
  }
}

function validatePostgresUrl(value, errors) {
  try {
    const url = new URL(value);
    if (
      !['postgres:', 'postgresql:'].includes(url.protocol) ||
      !['localhost', '127.0.0.1'].includes(url.hostname)
    ) {
      errors.push('DATABASE_URL harus PostgreSQL lokal');
    }
  } catch {
    errors.push('DATABASE_URL tidak valid');
  }
}

export function assertWorkspaceProject(root) {
  const resolved = fs.realpathSync(root);
  if (!isWithinWorkspaceRoot(resolved)) {
    throw new Error(
      `Proyek harus dijalankan langsung dari salah satu workspace yang diizinkan: ${WORKSPACE_ROOTS.join(', ')}`,
    );
  }
  return resolved;
}

function isWithinWorkspaceRoot(candidate) {
  return WORKSPACE_ROOTS.some((workspaceRoot) => {
    let workspaceStats;
    try {
      workspaceStats = fs.statSync(workspaceRoot);
    } catch {
      return false;
    }
    let current = path.resolve(candidate);
    while (true) {
      try {
        const currentStats = fs.statSync(current);
        if (currentStats.dev === workspaceStats.dev && currentStats.ino === workspaceStats.ino) {
          return true;
        }
      } catch {
        // Kandidat yang tidak dapat diinspeksi tidak dapat menjadi workspace sah.
      }
      const parent = path.dirname(current);
      if (parent === current) return false;
      current = parent;
    }
  });
}

function isWithinPhysicalRoot(root, candidate) {
  let rootStats;
  try {
    rootStats = fs.statSync(root);
  } catch {
    return false;
  }
  let current = path.resolve(candidate);
  while (true) {
    try {
      const currentStats = fs.statSync(current);
      if (currentStats.dev === rootStats.dev && currentStats.ino === rootStats.ino) {
        return true;
      }
    } catch {
      // Runtime yang tidak dapat diinspeksi tidak dapat berada di root proyek.
    }
    const parent = path.dirname(current);
    if (parent === current) return false;
    current = parent;
  }
}

export function safeConfigForOutput(config) {
  return {
    APP_ENV: config.APP_ENV,
    APP_HOST: config.APP_HOST,
    APP_PORT: config.APP_PORT,
    APP_ORIGIN: config.APP_ORIGIN,
    MADEVI_RUNTIME_ROOT: config.MADEVI_RUNTIME_ROOT,
    MADEVI_DB_SCHEMA: config.MADEVI_DB_SCHEMA,
    LOG_LEVEL: config.LOG_LEVEL,
    DATABASE_URL: '[REDACTED]',
  };
}
