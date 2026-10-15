import fs from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';

export const APP_ENVIRONMENTS = ['development', 'test', 'production-local', 'production'] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

export interface ServerEnv {
  APP_ENV: AppEnvironment;
  APP_HOST: '127.0.0.1';
  APP_PORT: number;
  APP_ORIGIN: string;
  DATABASE_URL: string;
  MADEVI_RUNTIME_ROOT: string;
  MADEVI_DB_SCHEMA: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const problems: string[] = [];
  const isVercel = !!source.VERCEL || !!process.env.VERCEL;
  const appEnvironment = source.APP_ENV;
  const host = source.APP_HOST;
  const port = Number(source.APP_PORT);
  const logLevel = source.LOG_LEVEL;
  const runtimeRoot = source.MADEVI_RUNTIME_ROOT ? path.resolve(source.MADEVI_RUNTIME_ROOT) : '';
  const databaseSchema = source.MADEVI_DB_SCHEMA ?? 'madevi';

  if (!APP_ENVIRONMENTS.includes(appEnvironment as AppEnvironment)) {
    problems.push('APP_ENV harus development, test, production-local, atau production');
  }
  // Di Vercel, host/port/runtime-root tidak dikontrol aplikasi — lewati validasi localhost.
  if (!isVercel) {
    if (host !== '127.0.0.1') problems.push('APP_HOST harus 127.0.0.1');
    if (!Number.isInteger(port) || port < 1024 || port > 65535) {
      problems.push('APP_PORT harus bilangan 1024–65535');
    }
    if (!runtimeRoot || !isWithinWorkspaceRoot(runtimeRoot)) {
      problems.push('MADEVI_RUNTIME_ROOT harus berada di dalam workspace project Madevi');
    }
    validateLocalUrl('APP_ORIGIN', source.APP_ORIGIN, port, problems);
  } else {
    if (!source.APP_ORIGIN) problems.push('APP_ORIGIN harus diisi di Vercel');
  }
  if (!/^[a-z][a-z0-9_]{0,47}$/.test(databaseSchema)) {
    problems.push('MADEVI_DB_SCHEMA tidak valid');
  }
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel ?? '')) {
    problems.push('LOG_LEVEL tidak dikenal');
  }

  validateDatabaseUrl(source.DATABASE_URL, problems, isVercel);

  if (problems.length > 0) {
    throw new Error(`Konfigurasi lokal tidak valid: ${problems.join('; ')}`);
  }

  return {
    APP_ENV: appEnvironment as AppEnvironment,
    APP_HOST: (isVercel ? (host as '127.0.0.1' | undefined) : '127.0.0.1') ?? '127.0.0.1',
    APP_PORT: isVercel ? (Number.isInteger(port) ? port : 443) : port,
    APP_ORIGIN: source.APP_ORIGIN as string,
    DATABASE_URL: source.DATABASE_URL as string,
    MADEVI_RUNTIME_ROOT: runtimeRoot || process.cwd(),
    MADEVI_DB_SCHEMA: databaseSchema,
    LOG_LEVEL: logLevel as ServerEnv['LOG_LEVEL'],
  };
}

function isWithinWorkspaceRoot(candidate: string) {
  const workspaceRoots = ['/sdcard/project/Madevi', '/home/agentuser/.hermes/workspace/madevi'];
  const current = path.resolve(candidate);
  return workspaceRoots.some((workspaceRoot) => {
    // Validasi lexical duluan: path Termux (/sdcard, /mnt/sdcard, /storage/emulated/0)
    // umumnya tidak ada di VM dev, tapi tetap merupakan workspace yang sah.
    if (isLexicallyWithin(current, workspaceRoot)) return true;

    let workspaceStats: fs.Stats;
    try {
      workspaceStats = fs.statSync(workspaceRoot);
    } catch {
      return false;
    }
    let node: string = current;
    for (;;) {
      try {
        const nodeStats = fs.statSync(node);
        if (nodeStats.dev === workspaceStats.dev && nodeStats.ino === workspaceStats.ino) {
          return true;
        }
      } catch {
        // Path yang tidak dapat diperiksa tidak dapat menjadi runtime yang sah.
      }
      const parent = path.dirname(node);
      if (parent === node) return false;
      node = parent;
    }
  });
}

function isLexicallyWithin(candidate: string, root: string): boolean {
  // Normalisasi alias Termux ke kanonik /sdcard/project/Madevi.
  const termuxAliases = ['/mnt/sdcard', '/storage/emulated/0'];
  let normalized = candidate;
  for (const alias of termuxAliases) {
    if (normalized === alias || normalized.startsWith(alias + '/')) {
      normalized = '/sdcard' + normalized.slice(alias.length);
      break;
    }
  }
  const normalizedRoot = root;
  if (normalized === normalizedRoot) return true;
  if (!normalized.startsWith(normalizedRoot + path.sep)) return false;
  // Cegah prefix palsu: '/sdcard/project/Madevi-foo' tidak boleh lolos.
  const remainder = normalized.slice(normalizedRoot.length + 1);
  return remainder.length > 0 && !remainder.startsWith('..');
}

function validateLocalUrl(
  name: string,
  value: string | undefined,
  port: number,
  problems: string[],
) {
  try {
    const url = new URL(value ?? '');
    const localHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const urlPort = Number(url.port || (url.protocol === 'http:' ? 80 : 443));
    if (url.protocol !== 'http:' || !localHost || urlPort !== port || url.pathname !== '/') {
      problems.push(`${name} harus origin HTTP localhost pada APP_PORT`);
    }
  } catch {
    problems.push(`${name} bukan URL yang valid`);
  }
}

function validateDatabaseUrl(value: string | undefined, problems: string[], isVercel: boolean = false) {
  try {
    const url = new URL(value ?? '');
    // Di Vercel, database boleh remote (Supabase pooler) — hanya cek protocol valid.
    if (isVercel) {
      if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
        problems.push('DATABASE_URL bukan URL PostgreSQL yang valid');
      }
      return;
    }
    const localHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (
      !['postgres:', 'postgresql:'].includes(url.protocol) ||
      !localHost ||
      isIP(url.hostname) === 6
    ) {
      problems.push('DATABASE_URL harus PostgreSQL lokal IPv4/localhost');
    }
  } catch {
    problems.push('DATABASE_URL bukan URL PostgreSQL yang valid');
  }
}

let cachedEnvironment: ServerEnv | undefined;

export function getServerEnv() {
  cachedEnvironment ??= parseServerEnv(process.env);
  return cachedEnvironment;
}

export function resetServerEnvForTests() {
  cachedEnvironment = undefined;
}
