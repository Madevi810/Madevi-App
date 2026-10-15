import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { assertWorkspaceProject, parseEnvFile, projectRoot } from './lib/config.mjs';

const root = projectRoot(import.meta.url);
assertWorkspaceProject(root);
const envFile = path.join(root, '.env.local');
if (!fs.existsSync(envFile)) throw new Error('.env.local belum ada; bootstrap PostgreSQL dahulu');

const raw = fs.readFileSync(envFile, 'utf8');
const existing = parseEnvFile(envFile);
const additions = [];
let bootstrapKeyCreated = false;

if (!existing.AUTH_TOKEN_SECRET) {
  additions.push(`AUTH_TOKEN_SECRET=${crypto.randomBytes(48).toString('base64url')}`);
}
if (!existing.ADMIN_BOOTSTRAP_KEY_HASH) {
  const keyPath = path.join(root, 'cloud-local', 'run', 'owner-bootstrap.key');
  fs.mkdirSync(path.dirname(keyPath), { recursive: true, mode: 0o700 });
  const existingBootstrapKey = readExistingBootstrapKey(keyPath);
  if (existingBootstrapKey) {
    additions.push(
      `ADMIN_BOOTSTRAP_KEY_HASH=${crypto.createHash('sha256').update(existingBootstrapKey).digest('hex')}`,
    );
  } else {
    const bootstrapKey = crypto.randomBytes(32).toString('base64url');
    additions.push(
      `ADMIN_BOOTSTRAP_KEY_HASH=${crypto.createHash('sha256').update(bootstrapKey).digest('hex')}`,
    );
    fs.writeFileSync(keyPath, `${bootstrapKey}\n`, { flag: 'wx', mode: 0o600 });
    bootstrapKeyCreated = true;
  }
}

if (additions.length > 0) {
  fs.writeFileSync(envFile, `${raw.trimEnd()}\n${additions.join('\n')}\n`, { mode: 0o600 });
}
fs.chmodSync(envFile, 0o600);
console.log(
  JSON.stringify({
    ok: true,
    authTokenSecret: existing.AUTH_TOKEN_SECRET ? 'dipertahankan' : 'dibuat',
    ownerBootstrapHash: existing.ADMIN_BOOTSTRAP_KEY_HASH ? 'dipertahankan' : 'dibuat',
    bootstrapKeyFile: bootstrapKeyCreated ? 'dibuat-tanpa-mencetak-isi' : 'tidak-diubah',
    secretPrinted: false,
  }),
);

function readExistingBootstrapKey(file) {
  if (!fs.existsSync(file)) return null;
  const metadata = fs.lstatSync(file);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error('owner-bootstrap.key existing bukan file biasa; tidak ditimpa');
  }
  if (metadata.size < 44 || metadata.size > 128) {
    throw new Error('owner-bootstrap.key existing memiliki ukuran tidak sah; tidak ditimpa');
  }
  const value = fs.readFileSync(file, 'utf8').trim();
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) {
    throw new Error('owner-bootstrap.key existing tidak valid; tidak ditimpa');
  }
  return value;
}
