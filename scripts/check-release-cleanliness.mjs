#!/usr/bin/env node
/**
 * L07: release scanner — menerapkan Aturan 08 (manifest kebersihan).
 * Menolak runtime log/dump/backup/env/cache/build/private key/agent artifact
 * tanpa membocorkan isi secret. Menghasilkan daftar temuan aman (path/kategori).
 * False positive exception eksplisit dan teruji (lihat tests/integration/prompt-l07).
 *
 * Admin: node scripts/check-release-cleanliness.mjs [--root <path>]
 * Agent tidak menjalankan script ini; hanya memeriksa rules statis.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv.includes('--root')
  ? path.resolve(process.argv[process.argv.indexOf('--root') + 1])
  : process.cwd();

const DENY_PATTERNS = [
  { re: /(^|\/)backup-local(\/|$)/, category: 'BACKUP' },
  { re: /(^|\/)cloud-local\/logs\/.*\.log$/, category: 'RUNTIME_LOG' },
  { re: /\.dump$/, category: 'DUMP' },
  { re: /(^|\/)\.env\.local$/, category: 'ENV' },
  { re: /(^|\/)\.env$/, category: 'ENV' },
  { re: /\.pem$|\.key$/, category: 'PRIVATE_KEY' },
  { re: /(^|\/)node_modules(\/|$)/, category: 'DEPS' },
  { re: /(^|\/)\.next(\/|$)/, category: 'BUILD' },
  { re: /(^|\/)coverage(\/|$)/, category: 'COVERAGE' },
  { re: /\.tsbuildinfo$/, category: 'BUILD' },
  { re: /(^|\/)\.npm-cache(\/|$)/, category: 'CACHE' },
  { re: /\.orig$|\.rej$/, category: 'PATCH_ARTIFACT' },
  { re: /(^|\/)scratch(\/|$)/, category: 'AGENT_ARTIFACT' },
  { re: /\.log$/, category: 'LOG' },
  { re: /\.pid$/, category: 'PID' },
];

const ALLOW_EXCEPTIONS = new Set([
  '.env.example',
  'scripts/check-release-cleanliness.mjs',
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024;

function listFiles(dir, out = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isSymbolicLink()) {
      out.push(full);
    } else if (e.isDirectory()) {
      if (e.name === '.git') continue;
      listFiles(full, out);
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const files = listFiles(root);
const findings = [];
for (const full of files) {
  const rel = path.relative(root, full).split(path.sep).join('/');
  if (ALLOW_EXCEPTIONS.has(rel)) continue;
  let stat = null;
  try {
    stat = fs.lstatSync(full);
  } catch {
    findings.push({ path: rel, category: 'UNREADABLE' });
    continue;
  }
  if (stat.isSymbolicLink()) {
    findings.push({ path: rel, category: 'SYMLINK' });
    continue;
  }
  for (const { re, category } of DENY_PATTERNS) {
    if (re.test(rel)) {
      findings.push({ path: rel, category });
      break;
    }
  }
  try {
    const size = fs.statSync(full).size;
    if (size > MAX_FILE_BYTES) findings.push({ path: rel, category: 'OVERSIZE' });
  } catch {
    // abaikan
  }
  // Absolute path lama di dalam file teks kecil (tanpa membaca secret).
  if (/\.(ts|tsx|js|mjs|json|md)$/.test(rel)) {
    try {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('/sdcard/project/Madevi/Madevi_Off/backup-local')) {
        findings.push({ path: rel, category: 'ABSOLUTE_BACKUP_PATH' });
      }
    } catch {
      // biner/terlalu besar — lewati
    }
  }
}

const ok = findings.length === 0;
process.stdout.write(`${JSON.stringify({ ok, findings }, null, 2)}\n`);
if (!ok) process.exitCode = 1;
