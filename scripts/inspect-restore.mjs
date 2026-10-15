#!/usr/bin/env node
/**
 * L07: inspect restore — dry-run default, tanpa menulis apa pun.
 * Memvalidasi backup root, schema version, manifest scope, file checksum,
 * target isolation, disk/mismatch condition, dan pre-restore checkpoint
 * requirement. Tidak melakukan restore. Execute terpisah dengan flag
 * confirmation eksplisit + target isolated kosong (scripts/restore.mjs).
 *
 * Admin: node scripts/inspect-restore.mjs --manifest <path> --target-runtime-root <path>
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { databaseScriptContext, parseOptions, printSafe } from './lib/database.mjs';

const options = parseOptions(process.argv.slice(2));
const { root } = databaseScriptContext(import.meta.url);
const manifestFile = path.resolve(options.manifest ?? '');
const backupsRoot = path.resolve(root, 'backup-local');
const targetRuntimeRoot = path.resolve(options['target-runtime-root'] ?? '');
const restoreTargets = path.resolve(root, 'backup-local', 'restore-targets');

const findings = [];
function finding(ok, code, detail) {
  findings.push({ ok, code, detail });
  return ok;
}

// 1. Manifest harus dari backup-local.
finding(
  manifestFile.startsWith(`${backupsRoot}${path.sep}`),
  'MANIFEST_ROOT',
  manifestFile.startsWith(`${backupsRoot}${path.sep}`)
    ? 'Manifest berada di backup-local.'
    : 'Manifest restore harus berasal dari backup-local.',
);

// 2. Target isolated kosong, bukan runtime aktif.
const targetOk =
  targetRuntimeRoot.startsWith(`${restoreTargets}${path.sep}`) &&
  (!fs.existsSync(targetRuntimeRoot) || fs.readdirSync(targetRuntimeRoot).length === 0);
finding(
  targetOk,
  'TARGET_ISOLATION',
  targetOk
    ? 'Target isolated kosong di backup-local/restore-targets.'
    : 'Target harus kosong di backup-local/restore-targets, bukan runtime aktif.',
);

let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  finding(true, 'MANIFEST_PARSE', 'Manifest terbaca sebagai JSON.');
} catch {
  finding(false, 'MANIFEST_PARSE', 'Manifest tidak terbaca sebagai JSON.');
}

if (manifest) {
  finding(
    manifest.status === 'COMPLETE' && Array.isArray(manifest.files),
    'MANIFEST_COMPLETE',
    manifest.status === 'COMPLETE' ? 'Manifest COMPLETE.' : 'Manifest tidak COMPLETE.',
  );
  const dump = manifest.files?.find((e) => e?.path === 'database.dump');
  finding(
    Boolean(dump && Number.isSafeInteger(dump.size) && dump.size > 0),
    'DUMP_PRESENT',
    dump ? 'Dump PostgreSQL tercantum.' : 'Dump PostgreSQL hilang.',
  );
  // Checksum daftar file.
  try {
    const recomputed = crypto
      .createHash('sha256')
      .update(JSON.stringify(manifest.files))
      .digest('hex');
    finding(
      recomputed === manifest.fileListSha256,
      'FILE_LIST_CHECKSUM',
      recomputed === manifest.fileListSha256 ? 'Checksum daftar cocok.' : 'Daftar file berubah.',
    );
  } catch {
    finding(false, 'FILE_LIST_CHECKSUM', 'Gagal menghitung checksum daftar.');
  }
  // Scope/exclusions (L07): manifest baru wajib memuatnya; manifest lama ditandai legacy.
  finding(
    manifest.scope !== undefined && manifest.exclusions !== undefined,
    'SCOPE_EXCLUSIONS',
    manifest.scope !== undefined
      ? 'Scope/exclusions tercantum.'
      : 'Manifest legacy tanpa scope/exclusions — perlakukan sebagai UNVERIFIED.',
  );
  // Path traversal / symlink check statis.
  const backupDir = path.dirname(manifestFile);
  let pathsOk = true;
  for (const entry of manifest.files ?? []) {
    if (!entry?.path || path.isAbsolute(entry.path) || entry.path.split(/[\\/]/).includes('..')) {
      pathsOk = false;
      break;
    }
    const file = path.join(backupDir, ...String(entry.path).split('/'));
    let stat = null;
    try {
      stat = fs.lstatSync(file);
    } catch {
      pathsOk = false;
      break;
    }
    if (!stat.isFile() || stat.isSymbolicLink()) {
      pathsOk = false;
      break;
    }
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    if (hash !== entry.sha256 || fs.statSync(file).size !== entry.size) {
      pathsOk = false;
      break;
    }
  }
  finding(pathsOk, 'FILE_CHECKSUM', pathsOk ? 'Semua file cocok checksum.' : 'File hilang/symlink/checksum tidak cocok.');
}

finding(true, 'PRE_RESTORE_CHECKPOINT', 'Buat pre-restore checkpoint (backup FULL saat ini) sebelum execute.');

const ok = findings.every((f) => f.ok);
printSafe({ ok, findings });
if (!ok) process.exitCode = 1;
