import { randomInt, randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import {
  constantTimeHashMatch,
  hashPassword,
  randomToken,
  sha256,
  verifyPassword,
} from '@/auth/crypto';
import { SessionService, type SessionBundle } from '@/auth/session';
import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';

type Gender = 'PEREMPUAN' | 'LAKI_LAKI' | 'LAINNYA';
type EducationStatus =
  'TIDAK_BERSEKOLAH' | 'ALUMNI' | 'SD' | 'SMP' | 'SMA_SMK' | 'PERGURUAN_TINGGI';

interface PrincipalRow {
  id: string;
  role: 'OWNER' | 'MEMBER' | 'SERVICE';
  approval_status: Principal['approvalStatus'];
  entitlement_status: Principal['entitlementStatus'];
  social_status: Principal['socialStatus'];
  is_test: boolean;
  lifecycle_status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  password_hash: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  birth_date: Date | null;
  contact_verified_at: Date | null;
  locked_until: Date | null;
}

export interface RegistrationInput {
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  gender: Gender;
  birthDate: string;
  city: string;
  educationStatus: EducationStatus;
  /**
   * L03: field legacy yang diabaikan pada pendaftaran baru.
   * Dipertahankan opsional agar payload lama/test lama tetap terkompilasi,
   * tetapi `register()` tidak lagi membaca atau menyimpannya.
   */
  guardian?: {
    name: string;
    relationship: 'AYAH' | 'IBU' | 'SAUDARA' | 'LAIN_SAH';
    birthDate: string;
    city: string;
    photoObjectId: string;
  };
  /** L03: diabaikan pada pendaftaran baru (lihat `guardian`). */
  noGuardianReason?: string;
  fixture?: boolean;
}

/**
 * Input reservasi trial Tools (05-KONTRAK-AKSES).
 *
 * `idempotencyKey` dibuat client per operasi (mis. `pdf-compress-${jobId}`).
 * Retry dengan key sama tidak mengurangi counter dua kali; hanya hasil sukses
 * (commit) yang mengurangi.
 */
export interface ReserveToolsTrialInput {
  toolKind: string;
  idempotencyKey: string;
}

const GENERIC_LOGIN_MESSAGE = 'Identifier atau password tidak valid';
const EDUCATION_STATUSES = new Set<EducationStatus>([
  'TIDAK_BERSEKOLAH',
  'ALUMNI',
  'SD',
  'SMP',
  'SMA_SMK',
  'PERGURUAN_TINGGI',
]);
const GENDERS = new Set<Gender>(['PEREMPUAN', 'LAKI_LAKI', 'LAINNYA']);

/**
 * Zona Tenang (INOVASI-0841): gabung flag calmMode ke ui_preferences yang ada.
 * Pure function — dipakai updateProfile + diuji unit test tanpa DB.
 */
export function mergeCalmModePreference(
  existing: Record<string, unknown> | null,
  calmMode: boolean,
): string {
  return JSON.stringify({ ...(existing ?? {}), calmMode });
}

export class AccountsService {
  private readonly schema: string;
  private readonly session: SessionService;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    secret = process.env.AUTH_TOKEN_SECRET ?? '',
    private readonly now: () => Date = () => new Date(),
    private readonly verificationCode: () => string = () =>
      randomInt(0, 1_000_000).toString().padStart(6, '0'),
    private readonly ownerBootstrapHash = process.env.ADMIN_BOOTSTRAP_KEY_HASH ?? '',
  ) {
    this.schema = quotedSchema(schemaName);
    this.session = new SessionService(pool, schemaName, secret, now);
  }

  async register(input: RegistrationInput) {
    const values = validateRegistration(input, this.now());
    const passwordHash = await hashPassword(input.password);
    const code = this.verificationCode();
    const principalId = randomUUID();
    const verificationId = randomUUID();
    try {
      return await inTransaction(this.pool, async (client) => {
        await client.query(
          `INSERT INTO ${this.schema}.principals
             (id, business_code, kind, role, approval_status, entitlement_status,
              social_status, display_name, email, is_test, username, phone, full_name,
              gender, birth_date, city, education_status)
           VALUES ($1, $2, 'MEMBER', 'MEMBER', 'PENDING', 'NONE', 'ENABLED',
                   $3, $4, $5, $6, $7, $3, $8, $9, $10, $11)`,
          [
            principalId,
            `USER-${principalId.replaceAll('-', '').slice(0, 16).toUpperCase()}`,
            values.fullName,
            values.email,
            input.fixture ?? false,
            values.username,
            values.phone,
            values.gender,
            values.birthDate,
            values.city,
            values.educationStatus,
          ],
        );
        await client.query(
          `INSERT INTO ${this.schema}.account_credentials (principal_id, password_hash)
           VALUES ($1, $2)`,
          [principalId, passwordHash],
        );
        const contactKind = values.email ? 'EMAIL' : 'PHONE';
        const contactValue = values.email ?? values.phone!;
        await client.query(
          `INSERT INTO ${this.schema}.contact_verifications
             (id, principal_id, contact_kind, contact_value, code_hash, expires_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            verificationId,
            principalId,
            contactKind,
            contactValue,
            sha256(code),
            new Date(this.now().getTime() + 15 * 60_000),
          ],
        );
        // L03: pendaftaran baru tidak meminta/menyimpan wali. Field legacy
        // `guardian`/`noGuardianReason` sengaja diabaikan: tidak memberi efek
        // akses. Baris legacy yang sudah tersimpan tidak dihapus (retensi pada
        // `guardian_submissions`; alur approval menandainya, bukan menghapus).
        await appendAuditEvent(client, {
          actorPrincipalId: principalId,
          eventType: 'REGISTRATION_CREATED',
          objectType: 'principal',
          objectId: principalId,
          details: { contactKind, minor: values.age < 18 },
          fixture: input.fixture ?? false,
          schema: this.schema.slice(1, -1),
        });
        await client.query(
          `INSERT INTO ${this.schema}.owner_inbox_items
             (id, sender_principal_id, item_kind, subject, body_text)
           VALUES ($1, $2, 'REGISTRATION_REVIEW', $3, $4)`,
          [
            randomUUID(),
            principalId,
            'OTP verifikasi kontak pendaftar',
            `challengeId:${verificationId} | kode:${code} | kontak:${contactKind}:${contactValue} | berlaku 15 menit`,
          ],
        );
        return {
          registrationId: principalId,
          verificationChallengeId: verificationId,
          status: 'VERIFICATION_REQUIRED' as const,
          transportMode: 'LOCAL_INBOX' as const,
        };
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Username atau kontak sudah digunakan');
      }
      throw error;
    }
  }

  async verifyContact(input: { challengeId: string; code: string }) {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        principal_id: string;
        code_hash: string;
        attempts: number;
        expires_at: Date;
        verified_at: Date | null;
        is_test: boolean;
        contact_kind: 'EMAIL' | 'PHONE';
        contact_value: string;
        email: string | null;
        phone: string | null;
      }>(
        `SELECT v.principal_id, v.code_hash, v.attempts, v.expires_at, v.verified_at,
                v.contact_kind, v.contact_value, p.email, p.phone, p.is_test
           FROM ${this.schema}.contact_verifications v
           JOIN ${this.schema}.principals p ON p.id = v.principal_id
          WHERE v.id = $1 FOR UPDATE OF v`,
        [input.challengeId],
      );
      const row = result.rows[0];
      if (
        !row ||
        row.verified_at ||
        row.expires_at.getTime() <= this.now().getTime() ||
        row.attempts >= 5 ||
        !constantTimeHashMatch(input.code, row.code_hash)
      ) {
        if (row && !row.verified_at && row.attempts < 5) {
          await client.query(
            `UPDATE ${this.schema}.contact_verifications SET attempts = attempts + 1 WHERE id = $1`,
            [input.challengeId],
          );
        }
        throw new ApiError('VALIDATION_FAILED', 'Kode verifikasi tidak valid atau kedaluwarsa');
      }
      await client.query(
        `UPDATE ${this.schema}.contact_verifications SET verified_at = $2 WHERE id = $1`,
        [input.challengeId, this.now()],
      );
      const contactChanged =
        (row.contact_kind === 'EMAIL' ? row.email : row.phone) !== row.contact_value;
      try {
        await client.query(
          `UPDATE ${this.schema}.principals
              SET email = CASE WHEN $3 = 'EMAIL' THEN $4 ELSE email END,
                  phone = CASE WHEN $3 = 'PHONE' THEN $4 ELSE phone END,
                  contact_verified_at = $2, updated_at = $2
            WHERE id = $1`,
          [row.principal_id, this.now(), row.contact_kind, row.contact_value],
        );
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Kontak sudah digunakan akun lain');
        }
        throw error;
      }
      if (contactChanged) {
        await this.revokeSessionsWithClient(client, row.principal_id, 'CONTACT_CHANGED');
      }
      await this.insertOwnerInbox(client, {
        senderPrincipalId: row.principal_id,
        kind: 'REGISTRATION_REVIEW',
        subject: 'Pendaftaran menunggu persetujuan',
        body: 'Kontak pendaftar telah diverifikasi; data privat hanya tersedia pada review terotorisasi.',
      });
      return { status: 'PENDING_OWNER_APPROVAL' as const };
    });
  }

  async login(input: { identifier: string; password: string }): Promise<
    | { status: 'AUTHENTICATED'; session: SessionBundle }
    | {
        status: 'MFA_REQUIRED';
        challengeId: string;
        transportMode: 'LOCAL_INBOX';
      }
  > {
    const identifier = normalizeIdentifier(input.identifier);
    const result = await this.pool.query<PrincipalRow>(
      `${principalCredentialSelect(this.schema)}
        WHERE p.role = 'MEMBER' AND p.deleted_at IS NULL
          AND (lower(p.username) = $1 OR lower(p.email) = $1 OR p.phone = $1)
        LIMIT 1`,
      [identifier],
    );
    const row = result.rows[0];
    const valid = row
      ? await verifyPassword(input.password, row.password_hash)
      : await verifyPassword(input.password, await dummyPasswordHash());
    if (!row || !valid || row.lifecycle_status !== 'ACTIVE' || isLocked(row, this.now())) {
      if (row) await this.recordFailedLogin(row.id);
      throw new ApiError('AUTHENTICATION_FAILED', GENERIC_LOGIN_MESSAGE);
    }
    await this.pool.query(
      `UPDATE ${this.schema}.account_credentials SET failed_attempts = 0, locked_until = NULL
        WHERE principal_id = $1`,
      [row.id],
    );
    const mfa = await this.pool.query<{ id: string }>(
      `SELECT id FROM ${this.schema}.mfa_factors
        WHERE principal_id = $1 AND factor_kind = 'EMAIL' AND status = 'ACTIVE'`,
      [row.id],
    );
    if (mfa.rows[0]) {
      const challenge = await this.createMfaChallenge(row.id, 'LOGIN');
      await this.pool.query(
        `INSERT INTO ${this.schema}.owner_inbox_items
           (id, sender_principal_id, item_kind, subject, body_text)
         VALUES ($1, $2, 'APPEAL', $3, $4)`,
        [
          randomUUID(),
          row.id,
          'OTP login 2FA',
          `challengeId:${challenge.id} | kode:${challenge.code} | berlaku 10 menit`,
        ],
      );
      return {
        status: 'MFA_REQUIRED',
        challengeId: challenge.id,
        transportMode: 'LOCAL_INBOX' as const,
      };
    }
    return {
      status: 'AUTHENTICATED',
      session: await this.session.create({ principal: toPrincipal(row), audience: 'MEMBER' }),
    };
  }

  async verifyLoginMfa(input: { challengeId: string; code: string }) {
    const principal = await this.consumeMfaChallenge(input.challengeId, input.code, 'LOGIN');
    return this.session.create({ principal, audience: 'MEMBER' });
  }

  /**
   * Selesaikan login via OAuth tiruan (Mode Simulasi).
   *
   * Identitas sudah "diverifikasi" oleh provider tiruan, jadi tanpa password.
   * Tetap hormati 2FA email bila aktif dan tolak akun non-ACTIVE/terkunci —
   * sama seperti jalur login biasa.
   */
  async completeOAuthLogin(principalId: string): Promise<
    | { status: 'AUTHENTICATED'; session: SessionBundle }
    | {
        status: 'MFA_REQUIRED';
        challengeId: string;
        transportMode: 'LOCAL_INBOX';
      }
  > {
    const result = await this.pool.query<PrincipalRow>(
      `${principalCredentialSelect(this.schema)}
        WHERE p.id = $1 AND p.role = 'MEMBER' AND p.deleted_at IS NULL`,
      [principalId],
    );
    const row = result.rows[0];
    if (!row || row.lifecycle_status !== 'ACTIVE' || isLocked(row, this.now())) {
      throw new ApiError('AUTHENTICATION_FAILED', GENERIC_LOGIN_MESSAGE);
    }
    await this.pool.query(
      `UPDATE ${this.schema}.account_credentials SET failed_attempts = 0, locked_until = NULL
        WHERE principal_id = $1`,
      [row.id],
    );
    const mfa = await this.pool.query<{ id: string }>(
      `SELECT id FROM ${this.schema}.mfa_factors
        WHERE principal_id = $1 AND factor_kind = 'EMAIL' AND status = 'ACTIVE'`,
      [row.id],
    );
    if (mfa.rows[0]) {
      const challenge = await this.createMfaChallenge(row.id, 'LOGIN');
      await this.pool.query(
        `INSERT INTO ${this.schema}.owner_inbox_items
           (id, sender_principal_id, item_kind, subject, body_text)
         VALUES ($1, $2, 'APPEAL', $3, $4)`,
        [
          randomUUID(),
          row.id,
          'OTP login 2FA (OAuth Simulasi)',
          `challengeId:${challenge.id} | kode:${challenge.code} | berlaku 10 menit`,
        ],
      );
      return {
        status: 'MFA_REQUIRED',
        challengeId: challenge.id,
        transportMode: 'LOCAL_INBOX' as const,
      };
    }
    return {
      status: 'AUTHENTICATED',
      session: await this.session.create({ principal: toPrincipal(row), audience: 'MEMBER' }),
    };
  }

  async enableEmailMfa(principal: Principal) {
    const account = await this.pool.query<{
      email: string | null;
      contact_verified_at: Date | null;
    }>(`SELECT email, contact_verified_at FROM ${this.schema}.principals WHERE id = $1`, [
      principal.id,
    ]);
    const row = account.rows[0];
    if (!row?.email || !row.contact_verified_at) {
      throw new ApiError('ACCESS_DENIED', 'Email terverifikasi diperlukan untuk 2FA email');
    }
    const challenge = await this.createMfaChallenge(principal.id, 'ENABLE_FACTOR');
    await this.pool.query(
      `INSERT INTO ${this.schema}.owner_inbox_items
         (id, sender_principal_id, item_kind, subject, body_text)
       VALUES ($1, $2, 'APPEAL', $3, $4)`,
      [
        randomUUID(),
        principal.id,
        'OTP aktifkan 2FA email',
        `challengeId:${challenge.id} | kode:${challenge.code} | berlaku 10 menit`,
      ],
    );
    return {
      challengeId: challenge.id,
      transportMode: 'LOCAL_INBOX' as const,
    };
  }

  async confirmEmailMfa(principal: Principal, challengeId: string, code: string) {
    const challenged = await this.consumeMfaChallenge(challengeId, code, 'ENABLE_FACTOR');
    if (challenged.id !== principal.id)
      throw new ApiError('ACCESS_DENIED', 'Challenge bukan milik akun');
    const account = await this.pool.query<{ email: string }>(
      `SELECT email FROM ${this.schema}.principals WHERE id = $1`,
      [principal.id],
    );
    await this.pool.query(
      `INSERT INTO ${this.schema}.mfa_factors
         (id, principal_id, factor_kind, status, destination_hint, verified_at)
       VALUES ($1, $2, 'EMAIL', 'ACTIVE', $3, $4)
       ON CONFLICT (principal_id, factor_kind) WHERE status = 'ACTIVE' DO NOTHING`,
      [randomUUID(), principal.id, hintContact(account.rows[0]!.email), this.now()],
    );
    return { status: 'ACTIVE' as const };
  }

  async approveRegistration(owner: Principal, principalId: string, approved: boolean) {
    requireOwner(owner);
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        birth_date: Date;
        contact_verified_at: Date | null;
        approval_status: string;
        is_test: boolean;
      }>(
        `SELECT birth_date, contact_verified_at, approval_status, is_test
           FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principalId],
      );
      const row = result.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Pendaftaran tidak ditemukan');
      if (!row.contact_verified_at) {
        throw new ApiError('ACCESS_DENIED', 'Kontak wajib diverifikasi sebelum approval');
      }
      const minor = calculateAge(row.birth_date, this.now()) < 18;
      if (approved && minor && !row.is_test) {
        throw new ApiError(
          'ACCESS_DENIED',
          'Aktivasi akun anak nyata terkunci sampai keputusan O-01',
        );
      }
      const status = approved ? 'APPROVED' : 'REJECTED';
      await client.query(
        `UPDATE ${this.schema}.principals
            SET approval_status = $2, approval_decided_at = $3, updated_at = $3
          WHERE id = $1`,
        [principalId, status, this.now()],
      );
      if (minor) {
        // Lacak jejak wali untuk SEMUA anak (register() baru tidak lagi
        // menyisipkan baris; tanpa ini approval anak tak terlacak).
        // Baris penanda memenuhi CHECK tabel (cabang tanpa-wali).
        await client.query(
          `INSERT INTO ${this.schema}.guardian_submissions (principal_id, no_guardian_reason)
           VALUES ($1, 'Pendaftaran tanpa data wali — pelacakan O-01')
           ON CONFLICT (principal_id) DO NOTHING`,
          [principalId],
        );
        await client.query(
          `UPDATE ${this.schema}.guardian_submissions
              SET review_status = $2, purge_after = $3::timestamptz + INTERVAL '30 days'
            WHERE principal_id = $1`,
          [principalId, approved ? 'SIMULATION_ONLY' : 'REJECTED', this.now()],
        );
      }
      if (!approved) {
        await this.revokeSessionsWithClient(client, principalId, 'REGISTRATION_REJECTED');
      }
      await appendAuditEvent(client, {
        actorPrincipalId: owner.id,
        eventType: approved ? 'REGISTRATION_APPROVED' : 'REGISTRATION_REJECTED',
        objectType: 'principal',
        objectId: principalId,
        details: { minorSimulation: minor && row.is_test },
        fixture: owner.fixture || row.is_test,
        schema: this.schema.slice(1, -1),
      });
      return { status, minorSimulation: minor && row.is_test };
    });
  }

  async submitAppeal(principal: Principal, kind: 'REGISTRATION' | 'NO_GUARDIAN', reason: string) {
    const cleanReason = requiredText(reason, 20, 2000, 'reason');
    const id = randomUUID();
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.account_appeals
           (id, principal_id, appeal_kind, reason) VALUES ($1, $2, $3, $4)`,
        [id, principal.id, kind, cleanReason],
      );
      await this.insertOwnerInbox(client, {
        senderPrincipalId: principal.id,
        kind: 'APPEAL',
        subject: kind === 'NO_GUARDIAN' ? 'Banding tanpa wali' : 'Banding pendaftaran',
        body: cleanReason,
      });
    });
    return { appealId: id, status: 'PENDING' as const, mode: 'LOCAL_QUEUE' as const };
  }

  async startTrial(principal: Principal, termsVersion: string) {
    const version = requiredText(termsVersion, 1, 40, 'termsVersion');
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        approval_status: Principal['approvalStatus'];
        entitlement_status: Principal['entitlementStatus'];
        trial_started_at: Date | null;
        trial_expires_at: Date | null;
      }>(
        `SELECT approval_status, entitlement_status, trial_started_at, trial_expires_at
           FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principal.id],
      );
      const row = result.rows[0];
      if (!row || row.approval_status !== 'APPROVED') {
        throw new ApiError('ACCESS_DENIED', 'Akun belum disetujui');
      }
      if (row.entitlement_status === 'PAID' || row.entitlement_status === 'EDUCATION') {
        return entitlementView(row.entitlement_status, row.trial_expires_at, this.now());
      }
      if (!row.trial_started_at) {
        const startedAt = this.now();
        const expiresAt = new Date(startedAt.getTime() + 30 * 24 * 60 * 60_000);
        await client.query(
          `INSERT INTO ${this.schema}.terms_consents
             (id, principal_id, terms_version, context, accepted_at)
           VALUES ($1, $2, $3, 'FIRST_LOCKED_ARTICLE', $4)
           ON CONFLICT (principal_id, context) DO NOTHING`,
          [randomUUID(), principal.id, version, startedAt],
        );
        await client.query(
          `UPDATE ${this.schema}.principals
              SET entitlement_status = 'TRIAL', trial_started_at = $2,
                  trial_expires_at = $3, terms_version_seen = $4, updated_at = $2
            WHERE id = $1`,
          [principal.id, startedAt, expiresAt, version],
        );
        return entitlementView('TRIAL', expiresAt, this.now());
      }
      return entitlementView('TRIAL', row.trial_expires_at, this.now());
    });
  }

  async publicProfile(username: string) {
    const result = await this.pool.query<{
      display_name: string;
      username: string;
      profile_description: string;
      avatar_object_id: string | null;
    }>(
      `SELECT display_name, username, profile_description, avatar_object_id
         FROM ${this.schema}.principals
        WHERE lower(username) = $1 AND lifecycle_status = 'ACTIVE'
          AND approval_status = 'APPROVED' AND deleted_at IS NULL`,
      [normalizeUsername(username)],
    );
    const row = result.rows[0];
    if (!row) throw new ApiError('NOT_FOUND', 'Profil tidak ditemukan');
    return {
      name: row.display_name,
      username: row.username,
      description: row.profile_description,
      avatarObjectId: row.avatar_object_id,
    };
  }

  async privateProfile(principal: Principal) {
    const result = await this.pool.query(
      `SELECT id, display_name, username, email, phone, full_name, gender, birth_date,
              city, education_status, profile_description, approval_status,
              entitlement_status, social_status, trial_started_at, trial_expires_at,
               tools_trial_total, tools_trial_remaining, ui_theme, ui_language,
               ui_preferences,
               COALESCE(ec.entitlement, 'FREE') AS current_entitlement
          FROM ${this.schema}.principals p
          LEFT JOIN ${this.schema}.principal_entitlement_current ec ON ec.principal_id = p.id
         WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [principal.id],
    );
    const profile = result.rows[0];
    if (!profile) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
    return {
      ...profile,
      // Status dan sisa trial dihitung dari jam server, agar UI tidak dapat
      // mengubah hak akses dengan memundurkan jam perangkat.
      access: entitlementView(profile.entitlement_status, profile.trial_expires_at, this.now()),
      // Trial Tools kontrak 05: lima eksekusi gabungan global, tidak reset harian.
      toolsTrial: toolsTrialView(profile.tools_trial_total, profile.tools_trial_remaining),
    };
  }

  /**
   * Reserve satu eksekusi Tools trial. Idempoten: idempotencyKey unik per
   * principal+operasi, sehingga retry/refresh tidak mengurangi counter dua kali
   * (05-KONTRAK-AKSES). Eksekusi gagal/divalidasi gagal/dibatalkan tidak
   * mengurangi trial — hanya hasil sukses yang dikurangi via commitToolsTrial.
   */
  async reserveToolsTrial(principal: Principal, input: ReserveToolsTrialInput) {
    const toolKind = requiredText(input.toolKind, 1, 64, 'toolKind');
    const idempotencyKey = requiredText(input.idempotencyKey, 1, 120, 'idempotencyKey');
    return inTransaction(this.pool, async (client) => {
      const account = await client.query<{
        approval_status: string;
        entitlement_status: string;
        tools_trial_total: number;
        tools_trial_remaining: number | null;
        tools_trial_setup_at: Date | null;
      }>(
        `SELECT approval_status, entitlement_status, tools_trial_total,
                tools_trial_remaining, tools_trial_setup_at
           FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principal.id],
      );
      const row = account.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
      if (row.approval_status !== 'APPROVED') {
        throw new ApiError('ACCESS_DENIED', 'Akun belum disetujui');
      }
      // Paket berbayar (PLUS, PRO, LOVE) membuka Tools penuh — tidak memakan trial.
      const ent = await client.query<{ entitlement: string }>(
        `SELECT entitlement FROM ${this.schema}.principal_entitlement_current WHERE principal_id = $1`,
        [principal.id],
      );
      const currentTier = ent.rows[0]?.entitlement;
      if (currentTier === 'PLUS' || currentTier === 'PRO' || currentTier === 'LOVE' || row.entitlement_status === 'PAID') {
        return { allowed: true as const, consumedTrial: false, remaining: null };
      }

      // Inisialisasi counter sekali (default 5 dari kontrak).
      if (row.tools_trial_remaining === null) {
        await client.query(
          `UPDATE ${this.schema}.principals
              SET tools_trial_remaining = tools_trial_total,
                  tools_trial_setup_at = $2
            WHERE id = $1`,
          [principal.id, this.now()],
        );
        row.tools_trial_remaining = row.tools_trial_total;
      }
      if (row.tools_trial_remaining <= 0) {
        return { allowed: false as const, consumedTrial: false, remaining: 0 };
      }

      // Idempotensi: reservation COMMITTED/RELEASED punya idempotency_key sama
      // sudah pernah berhasil → jawab hasil yang sama tanpa mengurangi lagi.
      const existing = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, idempotencyKey],
      );
      const prior = existing.rows[0];
      if (prior) {
        // RELEASED berarti percobaan ini sudah dibatalkan → boleh reserve ulang.
        // RESERVED/COMMITTED dengan key sama = jawab hasil yang sama tanpa
        // mengurangi counter lagi (idempoten). RESERVED tetap allowed:true
        // agar retry klien yang sah tidak diblokir.
        if (prior.status !== 'RELEASED') {
          return {
            allowed: true as const,
            consumedTrial: prior.status === 'COMMITTED',
            remaining: row.tools_trial_remaining,
          };
        }
      }

      const reservationId = randomUUID();
      await client.query(
        `INSERT INTO ${this.schema}.tools_trial_reservations
            (id, principal_id, idempotency_key, tool_kind, status, reserved_at)
         VALUES ($1, $2, $3, $4, 'RESERVED', $5)
         ON CONFLICT (principal_id, idempotency_key) DO UPDATE
            SET status = 'RESERVED',
                tool_kind = EXCLUDED.tool_kind,
                reserved_at = EXCLUDED.reserved_at,
                released_at = NULL
          WHERE tools_trial_reservations.status = 'RELEASED'`,
        [reservationId, principal.id, idempotencyKey, toolKind, this.now()],
      );
      return {
        allowed: true as const,
        consumedTrial: false,
        remaining: row.tools_trial_remaining,
      };
    });
  }

  /**
   * Konfirmasi pemakaian trial setelah hasil sukses. Atomik: decrement di dalam
   * transaksi yang sama dengan reservation, FOR UPDATE mencegah race.
   */
  async commitToolsTrial(principal: Principal, input: ReserveToolsTrialInput) {
    const toolKind = requiredText(input.toolKind, 1, 64, 'toolKind');
    const idempotencyKey = requiredText(input.idempotencyKey, 1, 120, 'idempotencyKey');
    return inTransaction(this.pool, async (client) => {
      const reservation = await client.query<{
        id: string;
        status: string;
      }>(
        `SELECT id, status FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, idempotencyKey],
      );
      const res = reservation.rows[0];
      // Tidak ada reservation = tidak ada slot; tolak, jangan tebak.
      if (!res) throw new ApiError('NOT_FOUND', 'Reservasi trial tidak ditemukan');
      // Idempoten: commit kedua tidak mengurangi lagi.
      if (res.status === 'COMMITTED') {
        const current = await this.loadToolsTrialRemaining(client, principal.id);
        return { consumedTrial: false, remaining: current };
      }
      if (res.status === 'RELEASED') {
        throw new ApiError('VALIDATION_FAILED', 'Reservasi sudah dilepaskan');
      }

      const account = await client.query<{ tools_trial_remaining: number }>(
        `SELECT tools_trial_remaining FROM ${this.schema}.principals WHERE id = $1 FOR UPDATE`,
        [principal.id],
      );
      const remaining = account.rows[0]?.tools_trial_remaining ?? 0;
      if (remaining <= 0) {
        // Slot habis antara reserve dan commit; lepas reservasi, jangan paksa.
        await client.query(
          `UPDATE ${this.schema}.tools_trial_reservations
              SET status = 'RELEASED', released_at = $3
            WHERE id = $1 AND idempotency_key = $2`,
          [res.id, idempotencyKey, this.now()],
        );
        return { consumedTrial: false, remaining: 0 };
      }

      const nextRemaining = remaining - 1;
      await client.query(
        `UPDATE ${this.schema}.principals SET tools_trial_remaining = $2 WHERE id = $1`,
        [principal.id, nextRemaining],
      );
      await client.query(
        `UPDATE ${this.schema}.tools_trial_reservations
            SET status = 'COMMITTED', committed_at = $3
          WHERE id = $1 AND idempotency_key = $2`,
        [res.id, idempotencyKey, this.now()],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: principal.id,
        eventType: 'TRIAL_CONSUMED',
        objectType: 'principal',
        objectId: principal.id,
        details: { toolKind, idempotencyKey, remaining: nextRemaining },
        fixture: principal.fixture,
        schema: this.schema.slice(1, -1),
      });
      return { consumedTrial: true as const, remaining: nextRemaining };
    });
  }

  /** Lepaskan reservasi tanpa mengurangi trial (eksekusi gagal/dibatalkan). */
  async releaseToolsTrial(principal: Principal, idempotencyKey: string) {
    const key = requiredText(idempotencyKey, 1, 120, 'idempotencyKey');
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{ status: string }>(
        `SELECT status FROM ${this.schema}.tools_trial_reservations
          WHERE principal_id = $1 AND idempotency_key = $2 FOR UPDATE`,
        [principal.id, key],
      );
      const res = result.rows[0];
      if (!res) return { released: false as const };
      if (res.status === 'COMMITTED') return { released: false as const };
      await client.query(
        `UPDATE ${this.schema}.tools_trial_reservations
            SET status = 'RELEASED', released_at = $3
          WHERE principal_id = $1 AND idempotency_key = $2`,
        [principal.id, key, this.now()],
      );
      return { released: true as const };
    });
  }

  private async loadToolsTrialRemaining(client: PoolClient, principalId: string) {
    const result = await client.query<{ tools_trial_remaining: number | null }>(
      `SELECT tools_trial_remaining FROM ${this.schema}.principals WHERE id = $1`,
      [principalId],
    );
    return result.rows[0]?.tools_trial_remaining ?? 0;
  }

  async currentEntitlementPackage(principalId: string): Promise<'FREE' | 'PLUS' | 'PRO' | 'LOVE'> {
    const res = await this.pool.query<{ entitlement: string }>(
      `SELECT entitlement FROM ${this.schema}.principal_entitlement_current WHERE principal_id = $1 LIMIT 1`,
      [principalId],
    );
    const ent = res.rows[0]?.entitlement;
    if (ent === 'PLUS' || ent === 'PRO' || ent === 'LOVE') return ent as 'PLUS' | 'PRO' | 'LOVE';
    return 'FREE';
  }

  /**
   * Zona Tenang (INOVASI-0841): baca ui_preferences JSONB seorang principal.
   * Mengembalikan objek polos (bisa null bila belum pernah diset).
   */
  async loadUiPreferences(
    principalId: string,
  ): Promise<Record<string, unknown> | null> {
    const res = await this.pool.query<{ ui_preferences: unknown }>(
      `SELECT ui_preferences FROM ${this.schema}.principals
        WHERE id = $1 AND deleted_at IS NULL`,
      [principalId],
    );
    const prefs = res.rows[0]?.ui_preferences;
    if (!prefs || typeof prefs !== 'object' || Array.isArray(prefs)) return null;
    return prefs as Record<string, unknown>;
  }

  /**
   * L03: status pendidikan dapat diubah pemilik akun dengan validasi dan audit,
   * tanpa mengubah entitlement/paket. Perubahan entitlement tetap lewat jalur
   * pembayaran/grant Admin, bukan lewat profil.
   */
  async updateProfile(
    principal: Principal,
    input: {
      description?: string;
      themePreference?: 'light' | 'dark' | 'madevi-on';
      languagePreference?: 'id' | 'en';
      educationStatus?:
        | 'TIDAK_BERSEKOLAH'
        | 'ALUMNI'
        | 'SD'
        | 'SMP'
        | 'SMA_SMK'
        | 'PERGURUAN_TINGGI';
      /** Zona Tenang (INOVASI-0841): flag calmMode di ui_preferences JSONB. */
      calmModePreference?: boolean;
    },
  ) {
    if (input.description !== undefined && input.description.length > 500) {
      throw fieldError('description');
    }
    if (input.educationStatus !== undefined && !EDUCATION_STATUSES.has(input.educationStatus)) {
      throw fieldError('educationStatus');
    }
    return inTransaction(this.pool, async (client) => {
      const before = await client.query<{ education_status: string }>(
        `SELECT education_status FROM ${this.schema}.principals WHERE id = $1 AND deleted_at IS NULL`,
        [principal.id],
      );
      if (!before.rows[0]) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
      const result = await client.query(
        `UPDATE ${this.schema}.principals
            SET profile_description = COALESCE($2, profile_description),
                ui_theme = COALESCE($3, ui_theme),
                ui_language = COALESCE($4, ui_language),
                education_status = COALESCE($5, education_status),
                ui_preferences = COALESCE($6, ui_preferences),
                ui_preferences_updated_at = CASE
                  WHEN $3::text IS NOT NULL OR $4::text IS NOT NULL OR $6::jsonb IS NOT NULL THEN $7
                  ELSE ui_preferences_updated_at
                END,
                updated_at = $7
          WHERE id = $1 AND deleted_at IS NULL
        RETURNING profile_description, ui_theme, ui_language, education_status, ui_preferences`,
        [
          principal.id,
          input.description?.trim() ?? null,
          input.themePreference ?? null,
          input.languagePreference ?? null,
          input.educationStatus ?? null,
          input.calmModePreference === undefined
            ? null
            : mergeCalmModePreference(await this.loadUiPreferences(principal.id), input.calmModePreference),
          this.now(),
        ],
      );
      if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
      if (
        input.educationStatus !== undefined &&
        input.educationStatus !== before.rows[0].education_status
      ) {
        await appendAuditEvent(client, {
          actorPrincipalId: principal.id,
          eventType: 'PROFILE_EDUCATION_CHANGED',
          objectType: 'principal',
          objectId: principal.id,
          details: {
            from: before.rows[0].education_status,
            to: input.educationStatus,
          },
          schema: this.schema.slice(1, -1),
        });
      }
      return result.rows[0];
    });
  }

  async changePassword(principal: Principal, currentPassword: string, newPassword: string) {
    const credential = await this.pool.query<{ password_hash: string }>(
      `SELECT password_hash FROM ${this.schema}.account_credentials WHERE principal_id = $1`,
      [principal.id],
    );
    const row = credential.rows[0];
    if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
      throw new ApiError('AUTHENTICATION_FAILED', 'Password saat ini tidak valid');
    }
    const passwordHash = await hashPassword(newPassword);
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `UPDATE ${this.schema}.account_credentials
            SET password_hash = $2, password_changed_at = $3, updated_at = $3,
                failed_attempts = 0, locked_until = NULL
          WHERE principal_id = $1`,
        [principal.id, passwordHash, this.now()],
      );
      await this.revokeSessionsWithClient(client, principal.id, 'PASSWORD_CHANGED');
    });
    return { status: 'PASSWORD_CHANGED' as const, sessionsRevoked: true };
  }

  async requestContactChange(
    principal: Principal,
    input: { kind: 'EMAIL' | 'PHONE'; value: string; password: string },
  ) {
    const credential = await this.pool.query<{ password_hash: string }>(
      `SELECT password_hash FROM ${this.schema}.account_credentials WHERE principal_id = $1`,
      [principal.id],
    );
    const row = credential.rows[0];
    if (!row || !(await verifyPassword(input.password, row.password_hash))) {
      throw new ApiError('AUTHENTICATION_FAILED', 'Password saat ini tidak valid');
    }
    const value =
      input.kind === 'EMAIL' ? normalizeEmail(input.value) : normalizePhone(input.value);
    const challengeId = randomUUID();
    const code = this.verificationCode();
    await this.pool.query(
      `INSERT INTO ${this.schema}.contact_verifications
         (id, principal_id, contact_kind, contact_value, code_hash, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        challengeId,
        principal.id,
        input.kind,
        value,
        sha256(code),
        new Date(this.now().getTime() + 15 * 60_000),
      ],
    );
    await this.pool.query(
      `INSERT INTO ${this.schema}.owner_inbox_items
         (id, sender_principal_id, item_kind, subject, body_text)
       VALUES ($1, $2, 'APPEAL', $3, $4)`,
      [
        randomUUID(),
        principal.id,
        'OTP ganti kontak',
        `challengeId:${challengeId} | kode:${code} | jenis:${input.kind} | berlaku 15 menit`,
      ],
    );
    return {
      challengeId,
      transportMode: 'LOCAL_INBOX' as const,
    };
  }

  async requestRecovery(identifier: string) {
    const normalized = normalizeIdentifier(identifier);
    const result = await this.pool.query<{ id: string }>(
      `SELECT id FROM ${this.schema}.principals
        WHERE deleted_at IS NULL
          AND (lower(username) = $1 OR lower(email) = $1 OR phone = $1)
        LIMIT 1`,
      [normalized],
    );
    const id = randomUUID();
    const publicReference = `REC-${randomToken(9).toUpperCase()}`;
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.recovery_cases
           (id, principal_id, public_reference) VALUES ($1, $2, $3)`,
        [id, result.rows[0]?.id ?? null, publicReference],
      );
      if (result.rows[0]) {
        await this.insertOwnerInbox(client, {
          senderPrincipalId: result.rows[0].id,
          kind: 'RECOVERY',
          subject: 'Permintaan pemulihan akun',
          body: 'Pemulihan memerlukan bukti penguasaan kontak, perangkat, atau recovery code.',
        });
      }
    });
    return {
      status: 'RECEIVED' as const,
      message: 'Jika akun cocok, permintaan akan ditinjau melalui jalur aman.',
    };
  }

  async verifyRecoveryProof(
    owner: Principal,
    caseId: string,
    proofKind: 'VERIFIED_CONTACT' | 'ACTIVE_DEVICE' | 'RECOVERY_CODE' | 'BIOGRAPHICAL_ONLY',
  ) {
    requireOwner(owner);
    if (proofKind === 'BIOGRAPHICAL_ONLY') {
      throw new ApiError('ACCESS_DENIED', 'Data pendaftaran saja bukan bukti penguasaan akun');
    }
    const result = await this.pool.query<{ principal_id: string | null }>(
      `UPDATE ${this.schema}.recovery_cases
          SET status = 'PROOF_VERIFIED', proof_kind = $2, proof_verified_at = $3,
              owner_principal_id = $4
        WHERE id = $1 AND principal_id IS NOT NULL AND status = 'PENDING'
      RETURNING principal_id`,
      [caseId, proofKind, this.now(), owner.id],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Kasus pemulihan tidak ditemukan');
    return { status: 'PROOF_VERIFIED' as const };
  }

  async requestDataAction(principal: Principal, kind: 'EXPORT' | 'DELETE') {
    const id = randomUUID();
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.account_data_requests
           (id, principal_id, request_kind) VALUES ($1, $2, $3)`,
        [id, principal.id, kind],
      );
      await this.insertOwnerInbox(client, {
        senderPrincipalId: principal.id,
        kind,
        subject: kind === 'EXPORT' ? 'Permintaan ekspor data' : 'Permintaan hapus akun',
        body: 'Permintaan dibuat oleh sesi pemilik akun dan menunggu persetujuan Admin.',
      });
    });
    return { requestId: id, status: 'PENDING' as const };
  }

  async approveDataAction(owner: Principal, requestId: string) {
    requireOwner(owner);
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        principal_id: string;
        request_kind: 'EXPORT' | 'DELETE';
      }>(
        `SELECT principal_id, request_kind FROM ${this.schema}.account_data_requests
          WHERE id = $1 AND status = 'PENDING' FOR UPDATE`,
        [requestId],
      );
      const row = result.rows[0];
      if (!row) throw new ApiError('NOT_FOUND', 'Permintaan data tidak ditemukan');
      if (row.request_kind === 'DELETE') {
        const scheduled = new Date(this.now().getTime() + 30 * 24 * 60 * 60_000);
        await client.query(
          `UPDATE ${this.schema}.account_data_requests
              SET status = 'SCHEDULED', approved_by = $2, approved_at = $3
            WHERE id = $1`,
          [requestId, owner.id, this.now()],
        );
        await client.query(
          `UPDATE ${this.schema}.principals
              SET deletion_scheduled_at = $2, updated_at = $3 WHERE id = $1`,
          [row.principal_id, scheduled, this.now()],
        );
        await this.revokeSessionsWithClient(client, row.principal_id, 'ACCOUNT_DELETE_REQUEST');
        return { status: 'SCHEDULED' as const, purgeAt: scheduled.toISOString() };
      }
      const token = randomToken();
      const expiresAt = new Date(this.now().getTime() + 15 * 60_000);
      await client.query(
        `UPDATE ${this.schema}.account_data_requests
            SET status = 'AVAILABLE', download_token_hash = $2, download_expires_at = $3,
                approved_by = $4, approved_at = $5
          WHERE id = $1`,
        [requestId, sha256(token), expiresAt, owner.id, this.now()],
      );
      return {
        status: 'AVAILABLE' as const,
        downloadToken: token,
        expiresAt: expiresAt.toISOString(),
      };
    });
  }

  async downloadExport(principal: Principal, requestId: string, token: string) {
    const result = await this.pool.query<{
      principal_id: string;
      download_token_hash: string;
      download_expires_at: Date;
      status: string;
    }>(
      `SELECT principal_id, download_token_hash, download_expires_at, status
         FROM ${this.schema}.account_data_requests WHERE id = $1`,
      [requestId],
    );
    const row = result.rows[0];
    if (
      !row ||
      row.principal_id !== principal.id ||
      row.status !== 'AVAILABLE' ||
      row.download_expires_at.getTime() <= this.now().getTime() ||
      !constantTimeHashMatch(token, row.download_token_hash)
    ) {
      throw new ApiError('NOT_FOUND', 'Paket ekspor tidak tersedia');
    }
    const profile = await this.privateProfile(principal);
    await this.pool.query(
      `UPDATE ${this.schema}.account_data_requests
          SET status = 'COMPLETE', download_token_hash = NULL, download_expires_at = NULL
        WHERE id = $1`,
      [requestId],
    );
    return { account: profile, generatedAt: this.now().toISOString() };
  }

  async bootstrapOwner(input: {
    bootstrapKey: string;
    username: string;
    email: string;
    password: string;
    deviceLabel: string;
    publicKeyPem: string;
    fixture?: boolean;
  }) {
    if (
      !this.ownerBootstrapHash ||
      !constantTimeHashMatch(input.bootstrapKey, this.ownerBootstrapHash)
    ) {
      throw new ApiError('ACCESS_DENIED', 'Bootstrap Admin ditolak');
    }
    const username = normalizeUsername(input.username);
    const email = normalizeEmail(input.email);
    const deviceLabel = input.deviceLabel.trim();
    const publicKeyPem = input.publicKeyPem.trim();
    if (deviceLabel.length < 3 || deviceLabel.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Label perangkat Admin harus 3-120 karakter');
    }
    if (publicKeyPem.length < 80 || publicKeyPem.length > 1000) {
      throw new ApiError('VALIDATION_FAILED', 'Public key perangkat Admin tidak valid');
    }
    const passwordHash = await hashPassword(input.password);
    const ownerId = randomUUID();
    return inTransaction(this.pool, async (client) => {
      const existing = await client.query<{ id: string; has_credential: boolean }>(
        `SELECT p.id, (c.principal_id IS NOT NULL) AS has_credential
           FROM ${this.schema}.principals p
      LEFT JOIN ${this.schema}.account_credentials c ON c.principal_id = p.id
          WHERE p.role = 'OWNER' AND p.deleted_at IS NULL
          FOR UPDATE OF p`,
      );
      if (existing.rows.length > 1 || existing.rows.some((row) => row.has_credential)) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Admin sudah dibootstrap');
      }
      const existingOwnerId = existing.rows[0]?.id;
      if (existingOwnerId) {
        await client.query(
          `UPDATE ${this.schema}.principals
              SET approval_status = 'APPROVED', entitlement_status = 'PAID',
                  social_status = 'ENABLED', lifecycle_status = 'ACTIVE', display_name = 'Admin',
                  email = $2, username = $3, full_name = 'Admin', contact_verified_at = $4,
                  updated_at = $4
            WHERE id = $1`,
          [existingOwnerId, email, username, this.now()],
        );
      } else {
        await client.query(
          `INSERT INTO ${this.schema}.principals
           (id, business_code, kind, role, approval_status, entitlement_status,
            social_status, display_name, email, is_test, username, full_name,
            contact_verified_at)
         VALUES ($1, 'OWNER-PRIMARY', 'OWNER', 'OWNER', 'APPROVED', 'PAID',
                 'ENABLED', 'Admin', $2, $3, $4, 'Admin', $5)`,
          [ownerId, email, input.fixture ?? false, username, this.now()],
        );
      }
      const principalId = existingOwnerId ?? ownerId;
      await client.query(
        `INSERT INTO ${this.schema}.account_credentials
           (principal_id, password_hash, password_changed_at)
         VALUES ($1, $2, $3)`,
         [principalId, passwordHash, this.now()],
      );
      await client.query(
        `INSERT INTO ${this.schema}.owner_devices
           (id, owner_principal_id, device_label, public_key_pem, public_key_sha256, status, verified_at)
         VALUES ($1,$2,$3,$4,$5,'ACTIVE',$6)`,
        [randomUUID(), principalId, deviceLabel, publicKeyPem, sha256(publicKeyPem), this.now()],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: principalId,
        eventType: 'OWNER_BOOTSTRAPPED',
        objectType: 'principal',
        objectId: principalId,
        details: { username, email, deviceLabel },
        fixture: input.fixture,
        schema: this.schema.slice(1, -1),
      });
      return { id: principalId, username, email };
    });
  }

  async verifyOwnerDevice(input: { deviceId: string; challengeId: string; code: string }) {
    await this.verifyContact({ challengeId: input.challengeId, code: input.code });
    const result = await this.pool.query(
      `UPDATE ${this.schema}.owner_devices
          SET status = 'ACTIVE', verified_at = $2
        WHERE id = $1 AND status = 'PENDING_EMAIL' RETURNING id`,
      [input.deviceId, this.now()],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Perangkat Admin tidak ditemukan');
    return { status: 'ACTIVE' as const };
  }

  async ownerLogin(input: { identifier: string; password: string }) {
    const identifier = normalizeIdentifier(input.identifier);
    const result = await this.pool.query<PrincipalRow & { owner_device_id?: string }>(
      `${principalCredentialSelect(this.schema, ', d.id AS owner_device_id')}
       LEFT JOIN ${this.schema}.owner_devices d ON d.owner_principal_id = p.id AND d.status = 'ACTIVE'
       WHERE p.role = 'OWNER' AND p.deleted_at IS NULL
         AND (lower(p.username) = $1 OR lower(p.email) = $1)
       LIMIT 1`,
      [identifier],
    );
    const row = result.rows[0];
    const valid = row
      ? await verifyPassword(input.password, row.password_hash)
      : await verifyPassword(input.password, await dummyPasswordHash());
    if (!row || !valid || row.lifecycle_status !== 'ACTIVE') {
      throw new ApiError('AUTHENTICATION_FAILED', GENERIC_LOGIN_MESSAGE);
    }
    return this.session.create({
      principal: toPrincipal(row),
      audience: 'OWNER',
      ownerDeviceId: row.owner_device_id,
    });
  }

  async revokeOwnerDevice(owner: Principal, deviceId: string) {
    requireOwner(owner);
    await inTransaction(this.pool, async (client) => {
      const result = await client.query(
        `UPDATE ${this.schema}.owner_devices
            SET status = 'REVOKED', revoked_at = $3
          WHERE id = $1 AND owner_principal_id = $2 AND status <> 'REVOKED'
        RETURNING id`,
        [deviceId, owner.id, this.now()],
      );
      if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Perangkat Admin tidak ditemukan');
      await client.query(
        `UPDATE ${this.schema}.auth_sessions
            SET revoked_at = COALESCE(revoked_at, $2), revoked_reason = 'DEVICE_REVOKED'
          WHERE owner_device_id = $1 AND revoked_at IS NULL`,
        [deviceId, this.now()],
      );
    });
    return { status: 'REVOKED' as const };
  }

  async submitOwnerInbox(input: {
    principal: Principal;
    kind: 'REPORT' | 'APPEAL' | 'RECOVERY';
    subject: string;
    body: string;
  }) {
    const id = randomUUID();
    await this.insertOwnerInbox(this.pool, {
      id,
      senderPrincipalId: input.principal.id,
      kind: input.kind,
      subject: requiredText(input.subject, 3, 180, 'subject'),
      body: requiredText(input.body, 1, 4000, 'body'),
    });
    return { inboxItemId: id, status: 'OPEN' as const };
  }

  async listOwnerInbox(owner: Principal) {
    requireOwner(owner);
    const result = await this.pool.query(
      `SELECT id, sender_principal_id, item_kind, subject, body_text, status, created_at
         FROM ${this.schema}.owner_inbox_items
        ORDER BY created_at DESC, id DESC LIMIT 100`,
    );
    return result.rows;
  }

  async getOwnInboxItem(principal: Principal, inboxItemId: string) {
    const result = await this.pool.query(
      `SELECT id, item_kind, subject, body_text, status, created_at
         FROM ${this.schema}.owner_inbox_items
        WHERE id = $1 AND sender_principal_id = $2`,
      [inboxItemId, principal.id],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Item inbox tidak ditemukan');
    return result.rows[0];
  }

  private async createMfaChallenge(principalId: string, purpose: 'LOGIN' | 'ENABLE_FACTOR') {
    const id = randomUUID();
    const code = this.verificationCode();
    await this.pool.query(
      `INSERT INTO ${this.schema}.mfa_challenges
         (id, principal_id, purpose, code_hash, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, principalId, purpose, sha256(code), new Date(this.now().getTime() + 10 * 60_000)],
    );
    return { id, code };
  }

  private async consumeMfaChallenge(id: string, code: string, purpose: 'LOGIN' | 'ENABLE_FACTOR') {
    return inTransaction(this.pool, async (client) => {
      const result = await client.query<{
        principal_id: string;
        code_hash: string;
        attempts: number;
        expires_at: Date;
        consumed_at: Date | null;
      }>(
        `SELECT principal_id, code_hash, attempts, expires_at, consumed_at
           FROM ${this.schema}.mfa_challenges WHERE id = $1 AND purpose = $2 FOR UPDATE`,
        [id, purpose],
      );
      const row = result.rows[0];
      if (
        !row ||
        row.consumed_at ||
        row.expires_at.getTime() <= this.now().getTime() ||
        row.attempts >= 5 ||
        !constantTimeHashMatch(code, row.code_hash)
      ) {
        if (row && !row.consumed_at && row.attempts < 5) {
          await client.query(
            `UPDATE ${this.schema}.mfa_challenges SET attempts = attempts + 1 WHERE id = $1`,
            [id],
          );
        }
        throw new ApiError('AUTHENTICATION_FAILED', 'Kode 2FA tidak valid atau kedaluwarsa');
      }
      await client.query(
        `UPDATE ${this.schema}.mfa_challenges SET consumed_at = $2 WHERE id = $1`,
        [id, this.now()],
      );
      const principal = await loadPrincipal(client, this.schema, row.principal_id);
      return toPrincipal(principal);
    });
  }

  private async recordFailedLogin(principalId: string) {
    await this.pool.query(
      `UPDATE ${this.schema}.account_credentials
          SET failed_attempts = failed_attempts + 1,
              locked_until = CASE WHEN failed_attempts + 1 >= 5
                THEN $2::timestamptz + INTERVAL '15 minutes' ELSE locked_until END
        WHERE principal_id = $1`,
      [principalId, this.now()],
    );
  }

  private async insertOwnerInbox(
    client: Pick<Pool, 'query'> | PoolClient,
    input: {
      id?: string;
      senderPrincipalId: string;
      kind: 'REGISTRATION_REVIEW' | 'APPEAL' | 'RECOVERY' | 'REPORT' | 'EXPORT' | 'DELETE';
      subject: string;
      body: string;
    },
  ) {
    await client.query(
      `INSERT INTO ${this.schema}.owner_inbox_items
         (id, sender_principal_id, item_kind, subject, body_text)
       VALUES ($1, $2, $3, $4, $5)`,
      [input.id ?? randomUUID(), input.senderPrincipalId, input.kind, input.subject, input.body],
    );
  }

  private async revokeSessionsWithClient(client: PoolClient, principalId: string, reason: string) {
    await client.query(
      `UPDATE ${this.schema}.auth_sessions
          SET revoked_at = COALESCE(revoked_at, $2), revoked_reason = $3
        WHERE principal_id = $1 AND revoked_at IS NULL`,
      [principalId, this.now(), reason],
    );
  }
}

function validateRegistration(input: RegistrationInput, now: Date) {
  const birthDate = parseBirthDate(input.birthDate, now);
  const age = calculateAge(birthDate, now);
  if (!GENDERS.has(input.gender)) throw fieldError('gender');
  if (!EDUCATION_STATUSES.has(input.educationStatus)) throw fieldError('educationStatus');
  const email = input.email ? normalizeEmail(input.email) : null;
  const phone = input.phone ? normalizePhone(input.phone) : null;
  if (!email && !phone) {
    throw new ApiError('VALIDATION_FAILED', 'Minimal email atau nomor telepon wajib diisi');
  }
  return {
    fullName: requiredText(input.fullName, 2, 120, 'fullName'),
    username: normalizeUsername(input.username),
    email,
    phone,
    gender: input.gender,
    birthDate,
    age,
    city: requiredText(input.city, 2, 120, 'city'),
    educationStatus: input.educationStatus,
  };
}

function normalizeUsername(value: string) {
  const username = value.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) throw fieldError('username');
  return username;
}

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fieldError('email');
  return email;
}

function normalizePhone(value: string) {
  const phone = value.replace(/[\s()-]/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw fieldError('phone');
  return phone;
}

function normalizeIdentifier(value: string) {
  const identifier = value.trim().toLowerCase();
  if (identifier.length < 3 || identifier.length > 254) throw fieldError('identifier');
  return identifier;
}

function requiredText(value: unknown, minimum: number, maximum: number, field: string) {
  if (typeof value !== 'string' || value.trim().length < minimum || value.length > maximum) {
    throw fieldError(field);
  }
  return value.trim();
}

function parseBirthDate(value: string, now: Date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw fieldError('birthDate');
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw fieldError('birthDate');
  }
  const age = calculateAge(date, now);
  if (age < 0 || age > 120) throw fieldError('birthDate');
  return date;
}

export function calculateAge(birthDate: Date, now = new Date()) {
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() && now.getUTCDate() < birthDate.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Tampilan trial Tools kontrak 05: lima eksekusi gabungan global, tidak reset
 * harian. `remaining` NULL = belum pernah dipakai → tampilkan total (5).
 * UI memakai ini untuk menjelaskan "sisa 0–5" tanpa membocorkan logika server.
 */
function toolsTrialView(total: number | null, remaining: number | null) {
  const totalQuota = typeof total === 'number' ? total : 5;
  if (remaining === null || remaining === undefined) {
    return { total: totalQuota, remaining: totalQuota, started: false };
  }
  return { total: totalQuota, remaining, started: true };
}

function entitlementView(
  status: Principal['entitlementStatus'],
  expiresAt: Date | null,
  now: Date,
) {
  if (status === 'PAID') return { status: 'LIFETIME' as const, label: 'Akses Selamanya' };
  if (status === 'EDUCATION') {
    return { status: 'EDUCATION' as const, label: 'Akses Pendidikan Gratis' };
  }
  if (status === 'NONE') {
    return {
      status: 'NOT_STARTED' as const,
      label: 'Masa gratis belum dimulai',
      socialAccess: true,
      memberArticleAccess: false,
    };
  }
  if (!expiresAt || expiresAt.getTime() <= now.getTime()) {
    return {
      status: 'RESTRICTED' as const,
      label: 'Akses Dibatasi',
      socialAccess: true,
      memberArticleAccess: false,
    };
  }
  return {
    status: 'TRIAL' as const,
    label: 'Free — 5 eksekusi Tools',
    expiresAt: expiresAt.toISOString(),
    remainingSeconds: Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)),
  };
}

function principalCredentialSelect(schema: string, extraColumns = '') {
  return `SELECT p.id, p.role, p.approval_status, p.entitlement_status, p.social_status,
                 p.is_test, p.lifecycle_status, p.username, p.email, p.phone, p.birth_date,
                 p.contact_verified_at, c.password_hash, c.locked_until${extraColumns}
            FROM ${schema}.principals p
            JOIN ${schema}.account_credentials c ON c.principal_id = p.id`;
}

async function loadPrincipal(client: PoolClient, schema: string, id: string) {
  const result = await client.query<PrincipalRow>(
    `${principalCredentialSelect(schema)} WHERE p.id = $1`,
    [id],
  );
  if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Akun tidak ditemukan');
  return result.rows[0];
}

function toPrincipal(row: PrincipalRow): Principal {
  return {
    id: row.id,
    role: row.role as 'OWNER' | 'MEMBER',
    approvalStatus: row.approval_status,
    entitlementStatus: row.entitlement_status,
    socialStatus: row.social_status,
    fixture: row.is_test,
  };
}

function requireOwner(principal: Principal) {
  if (principal.role !== 'OWNER' || principal.approvalStatus !== 'APPROVED') {
    throw new ApiError('ACCESS_DENIED', 'Akses Admin diperlukan');
  }
}

function isLocked(row: PrincipalRow, now: Date) {
  return row.locked_until !== null && row.locked_until.getTime() > now.getTime();
}

let dummyHash: Promise<string> | undefined;
function dummyPasswordHash() {
  dummyHash ??= hashPassword('Dummy-Only-Local-2026!');
  return dummyHash;
}

function hintContact(value: string) {
  const [local, domain] = value.split('@');
  return `${local?.slice(0, 2) ?? '**'}***@${domain ?? '***'}`;
}

function isUniqueViolation(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === '23505');
}

function fieldError(field: string) {
  return new ApiError('VALIDATION_FAILED', 'Field tidak valid', { [field]: 'nilai tidak valid' });
}
