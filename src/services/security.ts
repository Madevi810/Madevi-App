import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

import { quotedSchema } from '@/db/schema-name';

/**
 * P17: batas rate per aksi berisiko — dipilih berdasarkan
 * impact × exploitability × exposure (P17 logika ekstra).
 *
 * Login/admin   : brute-force kredensial → ketat (10/15m).
 * Register      : spam akun + trial abuse  → ketat (5/jam).
 * Recovery      : pengintipan akun lewat reset → ketat (5/jam).
 * Payment       : replay/snitfikasi       → ketat (10/jam).
 * AI/upload/tools: resource abuse (kuota)  → sedang (20-30/jam).
 *
 * 'general' adalah fallback aman untuk aksi tak terdaftar.
 */
export const ACTION_RATE_LIMITS: Record<string, { limit: number; windowMinutes: number }> = {
  general: { limit: 100, windowMinutes: 15 },
  login: { limit: 10, windowMinutes: 15 },
  login_account: { limit: 5, windowMinutes: 15 },
  login_admin: { limit: 5, windowMinutes: 15 },
  register: { limit: 5, windowMinutes: 60 },
  recovery: { limit: 5, windowMinutes: 60 },
  ai_conversation: { limit: 20, windowMinutes: 60 },
  verify_contact: { limit: 10, windowMinutes: 15 },
  upload: { limit: 30, windowMinutes: 60 },
  tools_execute: { limit: 20, windowMinutes: 60 },
  message_request: { limit: 10, windowMinutes: 60 },
  payment_create: { limit: 10, windowMinutes: 60 },
  jasa_order: { limit: 10, windowMinutes: 60 },
  telemetry: { limit: 60, windowMinutes: 60 },
  public_feedback: { limit: 10, windowMinutes: 60 },
};

export const RATE_LIMITED_ACTIONS = new Set(Object.keys(ACTION_RATE_LIMITS));

export class SecurityService {
  private readonly schema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }
  async inspectPayload(payload: unknown, endpoint: string, ip: string) {
    void endpoint;
    void ip;
    let text = '';
    try {
      text = JSON.stringify(payload) ?? '';
    } catch {
      throw new Error('Blocked: payload tidak dapat dibaca');
    }
    const lower = text.toLowerCase();
    if (/<\s*script\b|<\s*iframe\b|<\s*object\b|<\s*embed\b/i.test(text))
      throw new Error('Blocked: XSS');
    if (/javascript\s*:|on\w+\s*=\s*["']/i.test(text)) throw new Error('Blocked: XSS');
    if (
      /(\bor\b|\band\b)\s+['"]?\d['"]?\s*=\s*['"]?\d|union\s+select|;\s*drop\s+table|--\s*$/i.test(
        lower,
      )
    ) {
      throw new Error('Blocked: SQLi');
    }
    if (/\.\.\/|%2e%2e|%252e/i.test(text)) throw new Error('Blocked: path traversal');
    if (
      /localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d|192\.168\.|169\.254\.|::1|metadata\.google|instance-data/i.test(
        lower,
      )
    ) {
      throw new Error('Blocked: SSRF');
    }
    if (/[;&|`$]\s*(cat|ls|curl|wget|rm|sh|bash|nc|python|perl)\b|\$\(.+\)/i.test(text)) {
      throw new Error('Blocked: command injection');
    }
    return { safe: true };
  }
  async quarantineFile(fileId: string, reason: string, reviewedBy: string) {
    if (!/^[0-9a-f-]{36}$/i.test(fileId)) throw new Error('fileId tidak valid');
    if (!/^[^\u0000-\u001f\u007f]{10,1000}$/.test(reason.trim())) {
      throw new Error('Alasan karantina harus 10–1000 karakter');
    }
    if (!/^[0-9a-f-]{36}$/i.test(reviewedBy)) throw new Error('reviewedBy tidak valid');
    const id = randomUUID();
    const result = await this.pool.query(
      `INSERT INTO ${this.schema}.quarantined_files
         (id, original_file_id, reason, reviewed_by)
       SELECT $1, id, $2, $3
         FROM ${this.schema}.storage_objects
        WHERE id = $4 AND deleted_at IS NULL
       RETURNING id, original_file_id, review_status, quarantined_at`,
      [id, reason.trim(), reviewedBy, fileId],
    );
    if (!result.rowCount) throw new Error('File tidak ditemukan');
    await this.pool.query(
      `UPDATE ${this.schema}.storage_objects
          SET storage_state = 'QUARANTINE', assessment_status = 'UNSAFE',
              updated_at = CURRENT_TIMESTAMP, version = version + 1
        WHERE id = $1 AND deleted_at IS NULL`,
      [fileId],
    );
    return { status: 'QUARANTINED', ...result.rows[0] };
  }

  async checkRateLimit(ipAddress: string) {
    const res = await this.pool.query(
      `SELECT request_count, blocked_until FROM ${this.schema}.rate_limits WHERE ip_address = $1`,
      [ipAddress],
    );

    if (res.rowCount && res.rowCount > 0) {
      const rate = res.rows[0];
      if (rate.blocked_until && new Date(rate.blocked_until) > new Date()) {
        return { allowed: false, remaining: 0 };
      }

      if (rate.request_count > 100) {
        await this.pool.query(
          `UPDATE ${this.schema}.rate_limits SET blocked_until = NOW() + INTERVAL '15 minutes' WHERE ip_address = $1`,
          [ipAddress],
        );
        return { allowed: false, remaining: 0 };
      }

      await this.pool.query(
        `UPDATE ${this.schema}.rate_limits SET request_count = request_count + 1, last_request_at = NOW() WHERE ip_address = $1`,
        [ipAddress],
      );
      return { allowed: true, remaining: 100 - rate.request_count };
    } else {
      await this.pool.query(
        `INSERT INTO ${this.schema}.rate_limits (ip_address, request_count) VALUES ($1, 1)`,
        [ipAddress],
      );
      return { allowed: true, remaining: 99 };
    }
  }

  /**
   * P17: rate limit PER AKSI — atomik via row-lock (SELECT FOR UPDATE dalam
   * transaksi) agar concurrent request tidak melewati limit (L07 G-04).
   *
   * Tiap aksi punya limit + window sendiri (tabel 0024). Bila window sudah
   * lewat, hitungan reset (bukan akumulasi selamanya). Mengembalikan sisa
   * kuota + Retry-After akurat agar UI bisa tampilkan.
   */
  async checkActionRateLimit(
    ipAddress: string,
    action: string,
  ): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
    const config = ACTION_RATE_LIMITS[action] ?? ACTION_RATE_LIMITS.general;
    const windowMs = config.windowMinutes * 60_000;
    
    // O(1) single-trip atomic UPSERT query. No explicit transaction/locking roundtrips required.
    const result = await this.pool.query<{
      request_count: number;
      window_started_at: Date;
      blocked_until: Date | null;
    }>(
      `INSERT INTO ${this.schema}.rate_limits_by_action AS r
        (ip_address, action, request_count, window_started_at, blocked_until, last_request_at)
       VALUES ($1, $2, 1, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP)
       ON CONFLICT (ip_address, action) DO UPDATE SET
         request_count = CASE 
           WHEN r.blocked_until > CURRENT_TIMESTAMP THEN r.request_count
           WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 millisecond' * $3) THEN 1
           ELSE r.request_count + 1
         END,
         window_started_at = CASE
           WHEN r.blocked_until > CURRENT_TIMESTAMP THEN r.window_started_at
           WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 millisecond' * $3) THEN CURRENT_TIMESTAMP
           ELSE r.window_started_at
         END,
         blocked_until = CASE
           WHEN r.blocked_until > CURRENT_TIMESTAMP THEN r.blocked_until
           WHEN (CASE WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 millisecond' * $3) THEN 1 ELSE r.request_count + 1 END) > $4 
             THEN (CASE WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 millisecond' * $3) THEN CURRENT_TIMESTAMP ELSE r.window_started_at END) + (INTERVAL '1 millisecond' * $3)
           ELSE NULL
         END,
         last_request_at = CURRENT_TIMESTAMP
       RETURNING request_count, window_started_at, blocked_until`,
      [ipAddress, action, windowMs, config.limit]
    );

    const row = result.rows[0];
    const now = Date.now();
    
    if (row.blocked_until && row.blocked_until.getTime() > now) {
      return { 
        allowed: false, 
        remaining: 0, 
        retryAfterSeconds: Math.ceil((row.blocked_until.getTime() - now) / 1000) 
      };
    }
    
    if (row.request_count > config.limit) {
       return { 
        allowed: false, 
        remaining: 0, 
        retryAfterSeconds: Math.ceil(windowMs / 1000) 
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, config.limit - row.request_count),
      retryAfterSeconds: 0,
    };
  }

  /**
   * L07 G-04: threat log dengan schema ketat + redaksi + pagination cursor.
   * - type: enum terbatas (bukan string bebas).
   * - path: 1–500 char, tanpa query secret.
   * - payload: fingerprint/size saja; body mentah sensitif tidak disimpan.
   * - GET memakai cursor + redaksi; tanpa SELECT *.
   */
  async logThreat(
    type: string,
    ip: string,
    path: string,
    payload: string,
    principalId?: string,
  ) {
    // Enum sama persis dengan CHECK database (0015-security): nama di luar
    // daftar ini gagal di INSERT, jadi validasi awal memberi error jelas.
    const allowedTypes = new Set([
      'CSRF_ATTEMPT',
      'SQLI_ATTEMPT',
      'XSS_ATTEMPT',
      'SSRF_ATTEMPT',
      'PATH_TRAVERSAL',
      'UNKNOWN',
    ]);
    if (!allowedTypes.has(type)) throw new Error('Jenis threat tidak valid');
    const cleanPath = path.slice(0, 500);
    if (cleanPath.length < 1) throw new Error('Path threat tidak valid');
    // Simpan fingerprint + size, bukan body mentah (redaksi L07).
    const { createHash } = await import('node:crypto');
    const fingerprint = createHash('sha256').update(payload.slice(0, 8000)).digest('hex');
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.security_threat_logs (id, threat_type, ip_address, principal_id, request_path, request_payload)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        type,
        ip.slice(0, 64),
        principalId ?? null,
        cleanPath,
        `sha256:${fingerprint}:len=${payload.length}`,
      ],
    );
    return { id };
  }

  /** Alias kompatibel: logThreat lama → versi redact L07. */
  async logThreatLegacy(type: string, ip: string, path: string, payload: string, principalId?: string) {
    return this.logThreat(type, ip, path, payload, principalId);
  }
}
