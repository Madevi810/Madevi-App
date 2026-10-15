import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

import { quotedSchema } from '@/db/schema-name';

export class AdminService {
  private readonly schema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async logAudit(data: {
    principalId?: string;
    deviceId?: string;
    action: string;
    targetResource: string;
    targetId?: string;
    reason?: string;
    beforeState?: unknown;
    afterState?: unknown;
    result: 'SUCCESS' | 'FAILURE' | 'DENIED';
    requestId: string;
  }) {
    const redactedBefore = this.redactSensitive(data.beforeState);
    const redactedAfter = this.redactSensitive(data.afterState);
    const id = randomUUID();

    await this.pool.query(
      `INSERT INTO ${this.schema}.admin_audit_logs (
        id, principal_id, device_id, action, target_resource, target_id, reason, before_state, after_state, result, request_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        id,
        data.principalId,
        data.deviceId,
        data.action,
        data.targetResource,
        data.targetId,
        data.reason || '',
        redactedBefore ? JSON.stringify(redactedBefore) : null,
        redactedAfter ? JSON.stringify(redactedAfter) : null,
        data.result,
        data.requestId,
      ],
    );

    return { id, ...data, beforeState: redactedBefore, afterState: redactedAfter };
  }

  private redactSensitive(data: unknown): unknown {
    // L07 G-05: redactor rekursif berbasis allowlist/denylist — satu redactor
    // dipakai logger, admin audit, API error, threat/backup metadata.
    // Payload, cookie, password, token, secret, URL credential, bukti privat,
    // dan byte file tidak boleh masuk log/audit.
    return redactDeep(data);
  }

  /**
   * L07 AC-02: capability dashboard dari endpoint server — hanya layanan
   * nyata (bukan dua array menu/kartu palsu). Setiap capability menunjuk
   * route/service yang terverifikasi ada.
   */
  async getCapabilities(): Promise<
    Array<{ key: string; label: string; href: string; available: boolean; reason?: string }>
  > {
    const caps: Array<{ key: string; label: string; href: string; available: boolean; reason?: string }> = [];
    const checks: Array<[string, string, string, string]> = [
      ['users', 'Pengguna & Persetujuan', '/owner/pengguna', `SELECT 1 FROM ${this.schema}.principals LIMIT 1`],
      ['moderation', 'Moderasi Line', '/owner/moderasi', `SELECT 1 FROM ${this.schema}.moderation_cases LIMIT 1`],
      ['orders', 'Order Jasa', '/owner/jasa', `SELECT 1 FROM ${this.schema}.service_orders LIMIT 1`],
      ['products', 'Produk Shop', '/owner/produk', `SELECT 1 FROM ${this.schema}.ebelanja_products LIMIT 1`],
      ['articles', 'Artikel', '/owner/artikel/baru', `SELECT 1 FROM ${this.schema}.articles LIMIT 1`],
      ['audit', 'Audit & Keamanan', '/owner/keamanan', `SELECT 1 FROM ${this.schema}.audit_events LIMIT 1`],
      ['backup', 'Backup & Operasi', '/owner/operasi', `SELECT 1 FROM ${this.schema}.backup_logs LIMIT 1`],
    ];
    for (const [key, label, href, sql] of checks) {
      try {
        await this.pool.query(sql);
        caps.push({ key, label, href, available: true });
      } catch {
        caps.push({ key, label, href, available: false, reason: 'UNAVAILABLE' });
      }
    }
    return caps;
  }

  /**
   * P15: antrean prioritas tunggal untuk satu Admin.
   *
   * "Karena hanya satu Admin, dashboard harus memprioritaskan antrean
   * berdasarkan risiko dan batas waktu."
   *
   * Mengagregat 5 sumber aksi menjadi SATU daftar terurut:
   *  - moderation cases (HIGH risk lebih dulu, kasus tua lebih dulu)
   *  - essay ujian menunggu penilaian (siswa menunggu)
   *  - data requests / pemulihan (privacy-sensitive, ada batas waktu)
   *  - pendaftaran user menunggu persetujuan
   *  - order jasa urgensi HIGH (0022 view)
   *
   * Skor = bobot risiko + bobot umur. BUKAN metrik dekoratif — setiap item
   * punya satu aksi jelas (P15: "Jangan membuat metrik dekoratif yang tidak
   * membantu tindakan").
   */
  async getPriorityQueue(limit = 25) {
    type QueueItem = {
      kind: string;
      id: string;
      title: string;
      reasonId: string;
      reasonEn: string;
      risk: 'HIGH' | 'MEDIUM' | 'LOW';
      waitingSince: Date;
      /** Hari menuju batas; null = tidak ada batas eksplisit. */
      deadlineInDays: number | null;
      href: string;
    };

    const items: QueueItem[] = [];
    const now = Date.now();
    const dayMs = 86_400_000;

    // 1. Moderation cases (risk + umur).
    const cases = await this.pool.query<{
      id: string;
      target_type: string;
      status: string;
      created_at: Date;
    }>(
      `SELECT id, target_type, status, created_at
         FROM ${this.schema}.moderation_cases
        WHERE status IN ('OPEN', 'IN_REVIEW')
        ORDER BY created_at ASC LIMIT 20`,
    );
    for (const c of cases.rows) {
      const ageDays = Math.floor((now - c.created_at.getTime()) / dayMs);
      items.push({
        kind: 'MODERATION',
        id: c.id,
        title: `Kasus moderasi ${c.target_type}`,
        reasonId: `Status ${c.status}, menunggu keputusan Admin`,
        reasonEn: `Status ${c.status}, awaiting Admin decision`,
        risk: ageDays > 3 ? 'HIGH' : ageDays > 1 ? 'MEDIUM' : 'LOW',
        waitingSince: c.created_at,
        deadlineInDays: ageDays > 3 ? 0 : null,
        href: '/owner/moderasi',
      });
    }

    // 2. Essay ujian menunggu penilaian (siswa terblokir sampai dinilai).
    const essays = await this.pool.query<{ id: string; submitted_at: Date }>(
      `SELECT id, submitted_at FROM ${this.schema}.exam_attempts
        WHERE status IN ('SUBMITTED', 'GRADING', 'REVIEW')
        ORDER BY submitted_at ASC LIMIT 20`,
    );
    for (const e of essays.rows) {
      const ageDays = Math.floor((now - e.submitted_at.getTime()) / dayMs);
      items.push({
        kind: 'ESSAY_GRADING',
        id: e.id,
        title: 'Penilaian esai ujian',
        reasonId: 'Attempt sudah diserahkan, menunggu nilai Admin',
        reasonEn: 'Attempt submitted, awaiting Admin grading',
        risk: ageDays > 2 ? 'HIGH' : 'MEDIUM',
        waitingSince: e.submitted_at,
        deadlineInDays: null,
        href: '/owner/ujian',
      });
    }

    // 3. Data requests / pemulihan (privacy; beri batas 30 hari).
    const dataReq = await this.pool.query<{ id: string; created_at: Date }>(
      `SELECT id, created_at FROM ${this.schema}.account_data_requests
        WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 20`,
    );
    for (const d of dataReq.rows) {
      const ageDays = Math.floor((now - d.created_at.getTime()) / dayMs);
      items.push({
        kind: 'DATA_REQUEST',
        id: d.id,
        title: 'Permintaan data / pemulihan',
        reasonId: 'Permintaan data pengguna menunggu pemenuhan',
        reasonEn: 'User data request awaiting fulfillment',
        risk: ageDays > 14 ? 'HIGH' : 'MEDIUM',
        waitingSince: d.created_at,
        deadlineInDays: Math.max(0, 30 - ageDays),
        href: '/owner/pengguna',
      });
    }

    // 4. Pendaftaran menunggu persetujuan.
    const pendingUsers = await this.pool.query<{ id: string; created_at: Date }>(
      `SELECT id, created_at FROM ${this.schema}.principals
        WHERE approval_status = 'PENDING' ORDER BY created_at ASC LIMIT 20`,
    );
    for (const u of pendingUsers.rows) {
      const ageDays = Math.floor((now - u.created_at.getTime()) / dayMs);
      items.push({
        kind: 'APPROVAL',
        id: u.id,
        title: 'Persetujuan pendaftaran',
        reasonId: 'Pengguna baru menunggu persetujuan Admin',
        reasonEn: 'New user awaiting Admin approval',
        risk: ageDays > 1 ? 'MEDIUM' : 'LOW',
        waitingSince: u.created_at,
        deadlineInDays: null,
        href: '/owner/pengguna',
      });
    }

    // 5. Order jasa urgensi tinggi (view 0022;abaikan bila belum terpasang).
    try {
      const jasa = await this.pool.query<{
        id: string;
        kind: string;
        urgency: string;
        updated_at: Date;
      }>(
        `SELECT id, kind, urgency, updated_at FROM ${this.schema}.jasa_order_queue
          WHERE urgency = 'HIGH' ORDER BY updated_at ASC LIMIT 20`,
      );
      for (const j of jasa.rows) {
        items.push({
          kind: 'JASA_ORDER',
          id: j.id,
          title: `Order jasa ${j.kind} mendesak`,
          reasonId: 'Revisi tertunda lebih dari 3 hari',
          reasonEn: 'Revision pending more than 3 days',
          risk: 'HIGH',
          waitingSince: j.updated_at,
          deadlineInDays: 0,
          href: '/owner/jasa',
        });
      }
    } catch {
      // View 0022 belum terpasang — antrean jasa dilewati, bukan error fatal.
    }

    const riskRank: Record<QueueItem['risk'], number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    items.sort((a, b) => {
      const byRisk = riskRank[a.risk] - riskRank[b.risk];
      if (byRisk !== 0) return byRisk;
      // Risiko sama: yang menunggu paling lama lebih dulu (FIFO).
      return a.waitingSince.getTime() - b.waitingSince.getTime();
    });

    return items.slice(0, limit);
  }

  async getDashboardSummary() {
    const alertsResult = await this.pool.query(
      `SELECT * FROM ${this.schema}.admin_alerts WHERE is_resolved = false ORDER BY created_at DESC LIMIT 20`,
    );

    // Quick stats without heavy queries (using system catalogs or rough estimates for large tables)
    const usersCount = await this.pool.query(`SELECT count(id) FROM ${this.schema}.principals`);
    const inboxCount = await this.pool.query(
      `SELECT count(id) FROM ${this.schema}.owner_inbox WHERE status = 'NEW'`,
    );

    return {
      alerts: alertsResult.rows,
      stats: {
        users: parseInt(usersCount.rows[0].count, 10),
        newMessages: parseInt(inboxCount.rows[0].count, 10),
      },
    };
  }

  async validateSession(tokenHash: string) {
    // L07 G-02: admin_sessions lama hanya reader kompatibel. Sumber keputusan
    // tunggal adalah auth_sessions/SessionService; method ini dipertahankan
    // untuk kompatibilitas baca dan tidak boleh dipakai untuk sesi baru.
    // 1-hour idle timeout check
    const result = await this.pool.query(
      `SELECT id, expires_at FROM ${this.schema}.admin_sessions WHERE token_hash = $1`,
      [tokenHash],
    );
    if (result.rowCount === 0) return { isValid: false, needsReAuth: false };

    const session = result.rows[0];
    if (new Date(session.expires_at) < new Date()) {
      return { isValid: false, needsReAuth: true };
    }

    // Bump idle timeout
    await this.pool.query(
      `UPDATE ${this.schema}.admin_sessions SET last_active_at = NOW(), expires_at = NOW() + INTERVAL '1 hour' WHERE id = $1`,
      [session.id],
    );

    return { isValid: true, needsReAuth: false };
  }
}

/**
 * L07: redactor rekursif — allowlist struktur, denylist nilai sensitif.
 * Dipakai admin audit, logger, threat, manifest (satu redactor).
 */
const SENSITIVE_KEY_RE =
  /password|passwd|secret|token|cookie|authorization|database_url|api_key|apikey|private_key|bukti|wali|guardian|message|body|payload|file|buffer|bytes/i;

function redactDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactDeep);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_RE.test(k)) out[k] = '[REDACTED]';
      else out[k] = redactDeep(v);
    }
    return out;
  }
  if (typeof value === 'string' && value.length > 2000) return '[TRUNCATED]';
  return value;
}
