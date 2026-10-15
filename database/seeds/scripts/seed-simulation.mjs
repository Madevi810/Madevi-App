import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  createScriptPool,
  databaseScriptContext,
  printSafe,
  quoteIdentifier,
} from '../../../scripts/lib/database.mjs';
import { parseEnvFile } from '../../../scripts/lib/config.mjs';

const { config, root } = databaseScriptContext(import.meta.url);
const localSecrets = parseEnvFile(path.join(root, '.env.local'));
if (!['development', 'test'].includes(config.APP_ENV)) {
  throw new Error('Seed simulasi ditolak di luar mode development/test');
}
if (config.APP_HOST !== '127.0.0.1') throw new Error('Seed simulasi hanya boleh bind 127.0.0.1');

const ownerPassword = requiredEnv('SIMULATION_ADMIN_PASSWORD', localSecrets);
const memberPassword = requiredEnv('SIMULATION_USER_PASSWORD', localSecrets);
// L03 AC3: username simulasi dari konfigurasi lokal, bukan hardcode.
// Default sesuai keputusan: Madevi.Adminku123 / Madevi.Userku123 (case-insensitive:
// dibandingkan dan dinormalisasi via lower-case). Password tidak punya default dan
// tidak pernah dicetak; bila terlalu pendek, hashPassword menolak dengan instruksi.
const ownerUsername = (
  process.env.MADEVI_SIMULATION_ADMIN_USERNAME ??
  localSecrets.MADEVI_SIMULATION_ADMIN_USERNAME ??
  'Madevi.Adminku123'
).trim();
const memberUsername = (
  process.env.MADEVI_SIMULATION_USER_USERNAME ??
  localSecrets.MADEVI_SIMULATION_USER_USERNAME ??
  'Madevi.Userku123'
).trim();
const ownerUsernameCanonical = ownerUsername.toLowerCase();
const memberUsernameCanonical = memberUsername.toLowerCase();
const schema = quoteIdentifier(config.MADEVI_DB_SCHEMA);
const pool = createScriptPool(config);
const ownerId = '71000000-0000-4000-8000-000000000001';
const memberId = '71000000-0000-4000-8000-000000000002';
const deviceId = '72000000-0000-4000-8000-000000000001';
const ownerAuditId = '73000000-0000-4000-8000-000000000001';
const deviceAuditId = '73000000-0000-4000-8000-000000000002';
const memberAuditId = '73000000-0000-4000-8000-000000000003';
const now = new Date();
const trialExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

const ownerHash = await hashPassword(ownerPassword);
const memberHash = await hashPassword(memberPassword);
const device = crypto.generateKeyPairSync('ed25519');
const publicKeyPem = device.publicKey.export({ type: 'spki', format: 'pem' });
const privateKeyPem = device.privateKey.export({ type: 'pkcs8', format: 'pem' });
const deviceHash = crypto.createHash('sha256').update(publicKeyPem).digest('hex');
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const existing = await client.query(
    `SELECT id, username, email FROM ${schema}.principals
      WHERE id IN ($1, $2)
         OR lower(username) IN ($3, $4)
         OR lower(email) IN ('owner@madevi.test', 'user@madevi.test')
      FOR UPDATE`,
    [ownerId, memberId, ownerUsernameCanonical, memberUsernameCanonical],
  );
  const conflicts = existing.rows.filter(
    (row) =>
      ((row.username?.toLowerCase() === ownerUsernameCanonical ||
        row.email?.toLowerCase() === 'owner@madevi.test') &&
        row.id !== ownerId) ||
      ((row.username?.toLowerCase() === memberUsernameCanonical ||
        row.email?.toLowerCase() === 'user@madevi.test') &&
        row.id !== memberId),
  );
  if (conflicts.length) {
    await client.query('ROLLBACK');
    printSafe({ ok: false, label: 'SIMULATION_ACCOUNT_CONFLICT_REQUIRES_OWNER' });
    // A conflict must never masquerade as a successful idempotent seed. The
    // existing account is deliberately left untouched for the Admin to review.
    process.exit(1);
  }

  const principals = await client.query(
    `INSERT INTO ${schema}.principals
      (id, business_code, kind, role, approval_status, entitlement_status, social_status,
       display_name, email, is_test, username, full_name, gender, birth_date, city,
       education_status, contact_verified_at, approval_decided_at, trial_started_at, trial_expires_at,
       terms_version_seen)
     VALUES
      ($1, 'SIM-OWNER', 'OWNER', 'OWNER', 'APPROVED', 'PAID', 'ENABLED',
       'Admin Simulasi', 'owner@madevi.test', true, $6, 'Admin Simulasi',
       'LAINNYA', '1990-01-01', 'Localhost', 'PERGURUAN_TINGGI', $3, $3, NULL, NULL, NULL),
      ($2, 'SIM-USER', 'MEMBER', 'MEMBER', 'APPROVED', 'TRIAL', 'ENABLED',
       'User Simulasi', 'user@madevi.test', true, $7, 'User Simulasi',
       'LAINNYA', '2000-01-01', 'Localhost', 'PERGURUAN_TINGGI', $3, $3, $4, $5, 'offline-simulation-v1')
     ON CONFLICT DO NOTHING`,
    [ownerId, memberId, now, now, trialExpires, ownerUsername, memberUsername],
  );
  await client.query(
    `INSERT INTO ${schema}.account_credentials (principal_id, password_hash)
     VALUES ($1, $3), ($2, $4)
     ON CONFLICT (principal_id) DO NOTHING`,
    [ownerId, memberId, ownerHash, memberHash],
  );
  await client.query(
    `INSERT INTO ${schema}.owner_devices
      (id, owner_principal_id, device_label, public_key_pem, public_key_sha256, status, verified_at)
     VALUES ($1, $2, 'Localhost simulation device', $3, $4, 'ACTIVE', $5)
     ON CONFLICT (id) DO NOTHING`,
    [deviceId, ownerId, publicKeyPem, deviceHash, now],
  );
  await client.query(
    `INSERT INTO ${schema}.quota_accounts (principal_id) VALUES ($1), ($2) ON CONFLICT DO NOTHING`,
    [ownerId, memberId],
  );
  await client.query(
    `INSERT INTO ${schema}.audit_events
      (id, actor_principal_id, event_type, object_type, object_id, details, is_test)
     VALUES
      ($1, $2, 'SIMULATION_ACCOUNT_CREATED', 'principal', $2, $5::jsonb, true),
      ($3, $2, 'SIMULATION_DEVICE_REGISTERED', 'owner_device', $4, $6::jsonb, true),
      ($7, $2, 'SIMULATION_MEMBER_CREATED', 'principal', $8, $9::jsonb, true)
     ON CONFLICT (id) DO NOTHING`,
    [
      ownerAuditId,
      ownerId,
      deviceAuditId,
      deviceId,
      JSON.stringify({ username: ownerUsername, email: 'owner@madevi.test' }),
      JSON.stringify({ deviceId, status: 'ACTIVE' }),
      memberAuditId,
      memberId,
      JSON.stringify({ username: memberUsername, email: 'user@madevi.test' }),
    ],
  );
  await client.query('COMMIT');

  const privateKeyPath = path.join(
    config.MADEVI_RUNTIME_ROOT,
    'simulation-owner-device-private.pem',
  );
  fs.mkdirSync(config.MADEVI_RUNTIME_ROOT, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(privateKeyPath)) {
    fs.writeFileSync(privateKeyPath, privateKeyPem, { mode: 0o600, flag: 'wx' });
  }
  printSafe({
    ok: true,
    created: principals.rowCount > 0,
    ownerId,
    memberId,
    deviceId,
    trialExpiresAt: trialExpires.toISOString(),
    privateKeyPath,
  });
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}

function requiredEnv(name, localValues) {
  const value = process.env[name] ?? localValues[name];
  if (!value) throw new Error(`${name} wajib diisi di .env.local dan tidak boleh dicetak`);
  return value;
}

function hashPassword(password) {
  if (
    password.length < 12 ||
    password.length > 128 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw new Error(
      'Password simulasi harus 12-128 karakter dan memiliki huruf besar, kecil, angka, serta simbol',
    );
  }
  const salt = crypto.randomBytes(16);
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      64,
      { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => {
        if (error) return reject(error);
        resolve(
          `scrypt$N=16384,r=8,p=1,l=64$${salt.toString('base64url')}$${key.toString('base64url')}`,
        );
      },
    );
  });
}
