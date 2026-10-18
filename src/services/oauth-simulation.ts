import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import { inTransaction } from '@/db/transaction';
import { quotedSchema } from '@/db/schema-name';
import { hashPassword } from '@/auth/crypto';
import { assertSimulationEnabled } from '@/server/simulation';
import {
  isSimulatedOAuthProvider,
  SIMULATED_OAUTH_PROVIDER_LABELS,
  type SimulatedOAuthProvider,
} from '@/contracts/simulation';
import type { AccountsService } from '@/services/accounts';

const STATE_TTL_MS = 10 * 60_000;
const CODE_TTL_MS = 10 * 60_000;

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * OAuth tiruan (Mode Simulasi) — meniru authorization-code flow milik
 * provider (Google/GitHub) tetapi seluruhnya berjalan lokal:
 *
 *   authorize -> state (anti-CSRF, single-use, 10 menit)
 *   consent   -> layar persetujuan tiruan -> code (single-use, 10 menit)
 *   callback  -> tukar code -> find-or-create akun -> sesi Madevi
 *
 * JUJUR: tidak ada provider asli yang dihubungi; identitas "terverifikasi"
 * hanya klaim pengguna di layar tiruan. Akun baru berstatus approval
 * PENDING seperti pendaftaran biasa; login password untuk akun OAuth-only
 * tidak mungkin (hash acak langsung dibuang).
 */
export class OAuthSimulationService {
  private readonly schema: string;
  private readonly rawSchema: string;

  constructor(
    private pool: Pool,
    private accounts: AccountsService,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.rawSchema = schemaName.replace(/^"|"$/g, '');
    this.schema = quotedSchema(this.rawSchema);
  }

  private requireProvider(value: string): SimulatedOAuthProvider {
    assertSimulationEnabled();
    if (!isSimulatedOAuthProvider(value)) {
      throw new ApiError('VALIDATION_FAILED', 'Provider OAuth tidak dikenal');
    }
    return value;
  }

  /** Langkah 1: mulai authorize — terbitkan state lalu arahkan ke consent tiruan. */
  async beginAuthorize(providerName: string) {
    const provider = this.requireProvider(providerName);
    const state = randomBytes(32).toString('base64url');
    await this.pool.query(
      `INSERT INTO ${this.schema}.oauth_states (id, provider, state_hash, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [randomUUID(), provider, sha256(state), new Date(Date.now() + STATE_TTL_MS)],
    );
    return {
      provider,
      providerLabel: SIMULATED_OAUTH_PROVIDER_LABELS[provider],
      state,
      consentUrl: `/auth/oauth/consent?provider=${provider}&state=${encodeURIComponent(state)}`,
    };
  }

  /**
   * Langkah 2: pengguna menyetujui di layar consent tiruan — tukar state
   * menjadi authorization code sekali pakai.
   */
  async handleConsent(
    providerName: string,
    input: { state: string; subject: string; name: string; email: string },
  ) {
    const provider = this.requireProvider(providerName);
    const subject = String(input.subject ?? '').trim().slice(0, 128);
    const name = String(input.name ?? '').trim().slice(0, 120);
    const email = String(input.email ?? '').trim().toLowerCase().slice(0, 254);
    if (!subject || !name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new ApiError('VALIDATION_FAILED', 'Data akun tiruan tidak valid');
    }

    return inTransaction(this.pool, async (client) => {
      const st = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.oauth_states
          WHERE provider = $1 AND state_hash = $2
            AND consumed_at IS NULL AND expires_at > NOW()
          FOR UPDATE`,
        [provider, sha256(String(input.state ?? ''))],
      );
      if (!st.rowCount) {
        throw new ApiError('VALIDATION_FAILED', 'State OAuth tidak valid atau kedaluwarsa');
      }
      const stateId = st.rows[0].id;
      await client.query(
        `UPDATE ${this.schema}.oauth_states SET consumed_at = NOW() WHERE id = $1`,
        [stateId],
      );

      const code = randomBytes(32).toString('base64url');
      await client.query(
        `INSERT INTO ${this.schema}.oauth_codes
           (id, provider, code_hash, state_id, provider_subject, provider_name, provider_email, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          randomUUID(),
          provider,
          sha256(code),
          stateId,
          subject,
          name,
          email,
          new Date(Date.now() + CODE_TTL_MS),
        ],
      );
      return { code, state: String(input.state) };
    });
  }

  /**
   * Langkah 3: callback — validasi state + code (keduanya sekali pakai),
   * lalu find-or-create akun Madevi dan selesaikan login (termasuk 2FA
   * bila aktif).
   */
  async handleCallback(providerName: string, input: { code: string; state: string }) {
    const provider = this.requireProvider(providerName);

    const principalId = await inTransaction(this.pool, async (client) => {
      const st = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.oauth_states
          WHERE provider = $1 AND state_hash = $2 AND expires_at > NOW()`,
        [provider, sha256(String(input.state ?? ''))],
      );
      if (!st.rowCount) {
        throw new ApiError('VALIDATION_FAILED', 'State OAuth tidak valid atau kedaluwarsa');
      }

      const cd = await client.query<{
        id: string;
        provider_subject: string;
        provider_name: string;
        provider_email: string;
      }>(
        `SELECT id, provider_subject, provider_name, provider_email
           FROM ${this.schema}.oauth_codes
          WHERE provider = $1 AND code_hash = $2 AND state_id = $3
            AND consumed_at IS NULL AND expires_at > NOW()
          FOR UPDATE`,
        [provider, sha256(String(input.code ?? '')), st.rows[0].id],
      );
      const row = cd.rows[0];
      if (!row) {
        throw new ApiError('VALIDATION_FAILED', 'Kode OAuth tidak valid atau kedaluwarsa');
      }
      await client.query(
        `UPDATE ${this.schema}.oauth_codes SET consumed_at = NOW() WHERE id = $1`,
        [row.id],
      );

      // 1) Sudah tertaut sebelumnya -> pakai akun itu.
      const linked = await client.query<{ principal_id: string }>(
        `SELECT principal_id FROM ${this.schema}.oauth_links
          WHERE provider = $1 AND provider_subject = $2`,
        [provider, row.provider_subject],
      );
      if (linked.rows[0]) return linked.rows[0].principal_id;

      // 2) Email sudah punya akun Madevi -> tautkan (klaim kepemilikan
      //    email dianggap valid karena "diverifikasi" provider tiruan).
      const byEmail = await client.query<{ id: string }>(
        `SELECT id FROM ${this.schema}.principals
          WHERE lower(email) = $1 AND deleted_at IS NULL LIMIT 1`,
        [row.provider_email.toLowerCase()],
      );
      const pid = byEmail.rows[0]
        ? byEmail.rows[0].id
        : await this.createOAuthPrincipal(client, row.provider_name, row.provider_email);

      await client.query(
        `INSERT INTO ${this.schema}.oauth_links
           (id, principal_id, provider, provider_subject, provider_email)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [randomUUID(), pid, provider, row.provider_subject, row.provider_email],
      );
      return pid;
    });

    // Di luar transaksi code: buat sesi (termasuk 2FA bila aktif).
    return this.accounts.completeOAuthLogin(principalId);
  }

  /**
   * Buat akun MEMBER baru dari identitas tiruan. Email dianggap terverifikasi
   * oleh provider; approval tetap PENDING untuk review Admin.
   */
  private async createOAuthPrincipal(
    client: PoolClient,
    name: string,
    email: string,
  ): Promise<string> {
    const principalId = randomUUID();
    const username = await this.uniqueUsername(client, email);
    // Hash dari secret acak yang langsung dibuang: akun OAuth-only tidak
    // akan pernah bisa login dengan password.
    const unusableHash = await hashPassword(randomBytes(48).toString('hex'));
    await client.query(
      `INSERT INTO ${this.schema}.principals
         (id, business_code, kind, role, approval_status, entitlement_status,
          social_status, display_name, email, contact_verified_at, is_test,
          username, full_name)
       VALUES ($1, $2, 'MEMBER', 'MEMBER', 'PENDING', 'NONE', 'ENABLED',
               $3, $4, NOW(), false, $5, $3)`,
      [
        principalId,
        `USER-${principalId.replaceAll('-', '').slice(0, 16).toUpperCase()}`,
        name,
        email.toLowerCase(),
        username,
      ],
    );
    await client.query(
      `INSERT INTO ${this.schema}.account_credentials (principal_id, password_hash)
       VALUES ($1, $2)`,
      [principalId, unusableHash],
    );
    return principalId;
  }

  private async uniqueUsername(client: PoolClient, email: string): Promise<string> {
    const base =
      email
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 20) || 'pengguna';
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `${base}_${randomBytes(3).toString('hex')}`;
      const exists = await client.query(
        `SELECT 1 FROM ${this.schema}.principals WHERE lower(username) = $1`,
        [candidate],
      );
      if (!exists.rowCount) return candidate;
    }
    return `${base}_${randomUUID().slice(0, 8)}`;
  }
}
