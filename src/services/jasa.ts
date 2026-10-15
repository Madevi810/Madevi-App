/**
 * Jasa Service — Undangan Nikah & Logo/Banner (Prompt 06)
 *
 * Kontrak:
 *  - Item katalog memakai harga tetap; jasa custom menunggu penetapan Admin.
 *  - Setelah persetujuan, pelanggan isi form private (pasangan, tanggal, foto, dst).
 *  - Order memakai tautan acak rahasia TIDAK TERINDEKS.
 *  - Halaman online final boleh slug bersih /undangan/ade-devi-121026.
 *  - Dua template: Online interaktif + Printable; paket Online/Print/keduanya.
 *  - Admin dapat tambah/edit/arsip/terbit template dan versinya.
 */

import { Pool } from 'pg';
import { randomUUID, randomBytes } from 'crypto';
import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import type {
  ServiceOrderSnapshot,
  PcbBrief,
  PcbSafetyFlags,
  PcbRiskLevel,
  ServiceOrder,
} from '@/contracts/services';

export type InvitationFormat = 'ONLINE' | 'PRINT' | 'BOTH';
export type OrderStatus =
  'PENDING_APPROVAL' | 'APPROVED' | 'IN_REVISION' | 'COMPLETED' | 'REJECTED' | 'ARCHIVED';

/** Token rahasia: 32 byte hex => tidak bisa ditebak, tidak terindeks. */
function generateSecretToken(): string {
  return randomBytes(32).toString('hex');
}

/** L04 AC1: ID katalog/template harus UUID valid agar tidak mismatch dengan FK. */
function requireUuid(value: string, field: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError('VALIDATION_FAILED', `${field} tidak valid`);
  }
  return value;
}

/**
 * Slug bersih dari nama pasangan + tanggal, mis. "Ade & Devi 12-10-2026"
 * -> "ade-devi-121026". Hanya huruf, angka, tanda hubung.
 */
function buildPublicSlug(groom: string, bride: string, date?: Date): string {
  const names = `${groom} ${bride}`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const stamp = date
    ? `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${date.getFullYear()}`
    : '';
  return [names, stamp].filter(Boolean).join('-');
}

export class JasaService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /* ---------------- UNDANGAN: galeri template (publik) ---------------- */

  async listPublishedTemplates() {
    const result = await this.pool.query(
      `SELECT id, slug, name, description, formats, price_starts_from, currency,
              cover_image_url, preview_url
         FROM ${this.schema}.invitation_templates
        WHERE lifecycle_status = 'PUBLISHED'
        ORDER BY sort_order ASC, created_at ASC`,
    );
    return result.rows;
  }

  async getTemplateBySlug(slug: string) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.schema}.invitation_templates
        WHERE slug = $1 AND lifecycle_status = 'PUBLISHED'`,
      [slug],
    );
    return result.rows[0] ?? null;
  }

  /* ---------------- ORDER UNDANGAN ---------------- */

  /**
   * Buat order baru. Tahap 1: Ekspresi minat + data pasangan.
   * Status PENDING_APPROVAL. Secret token dibuat untuk akses private.
   */
  async createInvitationOrder(input: {
    principalId?: string;
    templateId?: string;
    groomName: string;
    brideName: string;
    eventDate?: Date;
    venue: string;
    city: string;
    note: string;
    packageFormat: InvitationFormat;
  }) {
    const id = randomUUID();
    const secretToken = generateSecretToken();
    const publicSlug = buildPublicSlug(input.groomName, input.brideName, input.eventDate);

    // L04 AC1: templateId fallback teks (mis. 'layout-undangan-a') tidak boleh
    // masuk kolom FK UUID. Validasi di sini (fail-closed), bukan error DB mentah.
    let templateUuid: string | null = null;
    if (input.templateId !== undefined && input.templateId !== '') {
      requireUuid(input.templateId, 'templateId');
      const tpl = await this.pool.query(
        `SELECT id FROM ${this.schema}.invitation_templates WHERE id = $1 AND lifecycle_status = 'PUBLISHED'`,
        [input.templateId],
      );
      if (!tpl.rows[0]) {
        throw new ApiError('VALIDATION_FAILED', 'Template tidak tersedia atau belum diterbitkan');
      }
      templateUuid = input.templateId;
    }

    await inTransaction(this.pool, async (client) => {
      // Pastikan slug unik (tambah suffix ringkas bila bentrok)
      let slug = publicSlug;
      let attempt = 0;
      while (attempt < 20) {
        const exists = await client.query(
          `SELECT 1 FROM ${this.schema}.invitation_orders WHERE public_slug = $1`,
          [slug],
        );
        if (exists.rowCount === 0) break;
        attempt += 1;
        slug = `${publicSlug}-${randomBytes(2).toString('hex')}`;
      }

      await client.query(
        `INSERT INTO ${this.schema}.invitation_orders
           (id, secret_token, template_id, principal_id, groom_name, bride_name,
            event_date, venue, city, note, package_format, public_slug, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'PENDING_APPROVAL')`,
        [
          id,
          secretToken,
          templateUuid,
          input.principalId || null,
          input.groomName.slice(0, 120),
          input.brideName.slice(0, 120),
          input.eventDate ?? null,
          input.venue.slice(0, 200),
          input.city.slice(0, 120),
          input.note.slice(0, 2000),
          input.packageFormat,
          slug,
        ],
      );
    });

    return { id, secretToken, publicSlug: await this.getOrderPublicSlug(id) };
  }

  private async getOrderPublicSlug(orderId: string) {
    const result = await this.pool.query(
      `SELECT public_slug FROM ${this.schema}.invitation_orders WHERE id = $1`,
      [orderId],
    );
    return result.rows[0]?.public_slug ?? null;
  }

  /** Ambil order via secret token (akses private pemilik). */
  async getInvitationOrderByToken(secretToken: string) {
    const result = await this.pool.query<{
      token_expires_at: Date | null;
      token_revoked_at: Date | null;
      [key: string]: unknown;
    }>(
      `SELECT o.*, t.name AS template_name, t.layout AS template_layout
         FROM ${this.schema}.invitation_orders o
         LEFT JOIN ${this.schema}.invitation_templates t ON t.id = o.template_id
        WHERE o.secret_token = $1`,
      [secretToken],
    );
    const row = result.rows[0];
    if (!row) return null;
    // P11: "Tautan privat memakai token kuat, expiry/revoke, dan tidak diindeks."
    // robots noindex ditangani halaman; expiry/revoke ditolak di sini.
    if (row.token_revoked_at) return null;
    if (row.token_expires_at && row.token_expires_at < this.now()) return null;
    return row;
  }

  /**
   * Update data detail order via secret token (form private).
   * Hanya diizinkan saat APPROVED atau IN_REVISION — sesuai kontrak:
   * pelanggan mengisi form private SETELAH persetujuan.
   */
  async updateInvitationOrderByToken(
    secretToken: string,
    patch: {
      groomName?: string;
      brideName?: string;
      eventDate?: Date;
      venue?: string;
      city?: string;
      note?: string;
    },
  ) {
    const current = await this.pool.query<{
      id: string;
      status: string;
      token_expires_at: Date | null;
      token_revoked_at: Date | null;
    }>(
      `SELECT id, status, token_expires_at, token_revoked_at
         FROM ${this.schema}.invitation_orders WHERE secret_token = $1`,
      [secretToken],
    );
    const row = current.rows[0];
    if (!row) return { updated: false, reason: 'Order tidak ditemukan.' };
    // P11: token privat punya expiry/revoke — tolong akses bila kedaluwarsa/dicabut.
    if (row.token_revoked_at) return { updated: false, reason: 'Tautan telah dicabut Admin.' };
    if (row.token_expires_at && row.token_expires_at < this.now()) {
      return { updated: false, reason: 'Tautan telah kedaluwarsa.' };
    }
    if (row.status !== 'APPROVED' && row.status !== 'IN_REVISION') {
      return {
        updated: false,
        reason: 'Pengisian form private hanya tersedia setelah persetujuan Admin.',
      };
    }

    const fields: string[] = [];
    const args: unknown[] = [];
    let n = 0;
    if (patch.groomName !== undefined) {
      fields.push(`groom_name = $${++n}`);
      args.push(patch.groomName.slice(0, 120));
    }
    if (patch.brideName !== undefined) {
      fields.push(`bride_name = $${++n}`);
      args.push(patch.brideName.slice(0, 120));
    }
    if (patch.eventDate !== undefined) {
      fields.push(`event_date = $${++n}`);
      args.push(patch.eventDate);
    }
    if (patch.venue !== undefined) {
      fields.push(`venue = $${++n}`);
      args.push(patch.venue.slice(0, 200));
    }
    if (patch.city !== undefined) {
      fields.push(`city = $${++n}`);
      args.push(patch.city.slice(0, 120));
    }
    if (patch.note !== undefined) {
      fields.push(`note = $${++n}`);
      args.push(patch.note.slice(0, 2000));
    }
    if (fields.length === 0) return { updated: false, reason: 'Tidak ada perubahan.' };

    // Slug publik dihitung ulang bila nama pasangan berubah.
    let newSlug: string | null = null;
    if (patch.groomName || patch.brideName) {
      const groom =
        patch.groomName ??
        (
          await this.pool.query(
            `SELECT groom_name FROM ${this.schema}.invitation_orders WHERE id = $1`,
            [row.id],
          )
        ).rows[0]?.groom_name ??
        '';
      const bride =
        patch.brideName ??
        (
          await this.pool.query(
            `SELECT bride_name FROM ${this.schema}.invitation_orders WHERE id = $1`,
            [row.id],
          )
        ).rows[0]?.bride_name ??
        '';
      const eventRow = await this.pool.query(
        `SELECT event_date FROM ${this.schema}.invitation_orders WHERE id = $1`,
        [row.id],
      );
      newSlug = buildPublicSlug(groom, bride, eventRow.rows[0]?.event_date ?? undefined);
      fields.push(`public_slug = $${++n}`);
      args.push(newSlug);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    args.push(row.id);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.invitation_orders SET ${fields.join(', ')} WHERE id = $${++n}`,
      args,
    );
    return { updated: (result.rowCount ?? 0) > 0, publicSlug: newSlug };
  }

  /** Ambil order via slug publik (halaman online final). */
  async getInvitationByPublicSlug(slug: string) {
    const result = await this.pool.query(
      `SELECT o.*, t.name AS template_name, t.layout AS template_layout
         FROM ${this.schema}.invitation_orders o
         LEFT JOIN ${this.schema}.invitation_templates t ON t.id = o.template_id
        WHERE o.public_slug = $1 AND o.status IN ('APPROVED', 'COMPLETED')`,
      [slug],
    );
    return result.rows[0] ?? null;
  }

  async listMyOrders(principalId: string) {
    const result = await this.pool.query(
      `SELECT id, secret_token, template_id, groom_name, bride_name, event_date,
              city, package_format, public_slug, status, revision_count, updated_at
         FROM ${this.schema}.invitation_orders
        WHERE principal_id = $1
        ORDER BY updated_at DESC LIMIT 100`,
      [principalId],
    );
    return result.rows;
  }

  /* ---------------- LOGO / BANNER ---------------- */

  async createLogoOrder(input: {
    principalId?: string;
    kind: 'LOGO' | 'BANNER';
    title: string;
    widthPx?: number;
    heightPx?: number;
    primaryColor: string;
    styleNote: string;
    referenceUrl: string;
  }) {
    const id = randomUUID();
    const secretToken = generateSecretToken();

    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.logo_orders
           (id, secret_token, principal_id, kind, title, width_px, height_px,
            primary_color, style_note, reference_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING_APPROVAL')`,
        [
          id,
          secretToken,
          input.principalId || null,
          input.kind,
          input.title.slice(0, 200),
          input.widthPx ?? null,
          input.heightPx ?? null,
          input.primaryColor.slice(0, 32),
          input.styleNote.slice(0, 2000),
          input.referenceUrl.slice(0, 2000),
        ],
      );
    });

    return { id, secretToken };
  }

  async getLogoOrderByToken(secretToken: string) {
    const result = await this.pool.query<{
      token_expires_at: Date | null;
      token_revoked_at: Date | null;
      [key: string]: unknown;
    }>(`SELECT * FROM ${this.schema}.logo_orders WHERE secret_token = $1`, [secretToken]);
    const row = result.rows[0];
    if (!row) return null;
    // P11: expiry/revoke token privat (sama seperti undangan).
    if (row.token_revoked_at) return null;
    if (row.token_expires_at && row.token_expires_at < this.now()) return null;
    return row;
  }

  async listMyLogoOrders(principalId: string) {
    const result = await this.pool.query(
      `SELECT id, secret_token, kind, title, status, revision_count, updated_at
         FROM ${this.schema}.logo_orders
        WHERE principal_id = $1
        ORDER BY updated_at DESC LIMIT 100`,
      [principalId],
    );
    return result.rows;
  }

  /* ---------------- OWNER: manajemen template & order ---------------- */

  async createTemplate(input: {
    slug: string;
    name: string;
    description?: string;
    formats?: string[];
    priceStartsFrom?: number;
    currency?: string;
    coverImageUrl?: string;
    previewUrl?: string;
    layout?: unknown;
    sortOrder?: number;
  }) {
    const id = randomUUID();
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.invitation_templates
           (id, slug, name, description, formats, price_starts_from, currency,
            cover_image_url, preview_url, layout, sort_order, lifecycle_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'DRAFT')`,
        [
          id,
          input.slug.slice(0, 120),
          input.name.slice(0, 120),
          (input.description ?? '').slice(0, 2000),
          Array.isArray(input.formats) && input.formats.length ? input.formats : ['ONLINE'],
          input.priceStartsFrom ?? 0,
          input.currency || 'IDR',
          input.coverImageUrl ?? '',
          input.previewUrl ?? '',
          JSON.stringify(input.layout ?? {}),
          input.sortOrder ?? 0,
        ],
      );
    });
    return { id };
  }

  async updateTemplate(
    id: string,
    patch: {
      name?: string;
      description?: string;
      formats?: string[];
      priceStartsFrom?: number;
      coverImageUrl?: string;
      previewUrl?: string;
      sortOrder?: number;
    },
  ) {
    const fields: string[] = [];
    const args: unknown[] = [id];
    let n = 1;
    if (patch.name !== undefined) {
      fields.push(`name = $${++n}`);
      args.push(patch.name.slice(0, 120));
    }
    if (patch.description !== undefined) {
      fields.push(`description = $${++n}`);
      args.push(patch.description.slice(0, 2000));
    }
    if (patch.formats !== undefined) {
      fields.push(`formats = $${++n}`);
      args.push(patch.formats);
    }
    if (patch.priceStartsFrom !== undefined) {
      fields.push(`price_starts_from = $${++n}`);
      args.push(patch.priceStartsFrom);
    }
    if (patch.coverImageUrl !== undefined) {
      fields.push(`cover_image_url = $${++n}`);
      args.push(patch.coverImageUrl);
    }
    if (patch.previewUrl !== undefined) {
      fields.push(`preview_url = $${++n}`);
      args.push(patch.previewUrl);
    }
    if (patch.sortOrder !== undefined) {
      fields.push(`sort_order = $${++n}`);
      args.push(patch.sortOrder);
    }
    if (fields.length === 0) return { updated: false };
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.invitation_templates SET ${fields.join(', ')} WHERE id = $1`,
      args,
    );
    return { updated: (result.rowCount ?? 0) > 0 };
  }

  /** Terbit / arsip / jadikan draft lagi. */
  async setTemplateLifecycle(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
    const result = await this.pool.query(
      `UPDATE ${this.schema}.invitation_templates
          SET lifecycle_status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 RETURNING id, slug, name, lifecycle_status`,
      [id, status],
    );
    const row = result.rows[0] as
      { id: string; slug: string; name: string; lifecycle_status: string } | undefined;
    // L06: sinkron proyeksi Search — hanya PUBLISHED yang terindeks.
    if (row) {
      try {
        const { SearchProjectionService } = await import('@/services/search-projection');
        const projector = new SearchProjectionService(this.pool, this.schema.replaceAll('"', ''));
        await projector.projectServiceItem({
          id: row.id,
          title: row.name,
          slug: row.slug,
          summary: row.name,
          published: row.lifecycle_status === 'PUBLISHED',
        });
      } catch {
        // Best-effort; lifecycle tetap sah pra-0031.
      }
    }
    return { updated: (result.rowCount ?? 0) > 0 };
  }

  async listAllTemplates() {
    const result = await this.pool.query(
      `SELECT id, slug, name, lifecycle_status, price_starts_from, sort_order, updated_at
         FROM ${this.schema}.invitation_templates
        ORDER BY sort_order ASC, created_at ASC`,
    );
    return result.rows;
  }

  async listAllInvitationOrders() {
    const result = await this.pool.query(
      `SELECT id, groom_name, bride_name, city, package_format, status,
              revision_count, price_agreed, event_date, created_at
         FROM ${this.schema}.invitation_orders
        ORDER BY updated_at DESC LIMIT 200`,
    );
    return result.rows;
  }

  async listAllLogoOrders() {
    const result = await this.pool.query(
      `SELECT id, kind, title, status, revision_count, price_agreed, created_at
         FROM ${this.schema}.logo_orders
        ORDER BY updated_at DESC LIMIT 200`,
    );
    return result.rows;
  }

  /** Karya selesai untuk galeri publik (portofolio, tanpa data privat). */
  async listCompletedLogoWorks() {
    const result = await this.pool.query(
      `SELECT id, kind, title, width_px, height_px, primary_color, style_note
         FROM ${this.schema}.logo_orders
        WHERE status = 'COMPLETED'
        ORDER BY completed_at DESC NULLS LAST, updated_at DESC LIMIT 24`,
    );
    return result.rows;
  }

  /**
   * Transisi status order undangan. Hanya boleh maju sesuai alur:
   * PENDING_APPROVAL -> APPROVED | REJECTED
   * APPROVED -> IN_REVISION | COMPLETED
   * IN_REVISION -> COMPLETED | APPROVED
   *
   * P11: batas revisi ditegakkan di sini — memasuki IN_REVISION melebihi
   * revision_limit ditolak (kecuali Admin menambah limit via setRevisionLimit).
   */
  async transitionInvitationOrder(orderId: string, next: OrderStatus, priceAgreed?: number) {
    const FLOW: Record<string, OrderStatus[]> = {
      PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
      APPROVED: ['IN_REVISION', 'COMPLETED'],
      IN_REVISION: ['COMPLETED', 'APPROVED'],
    };
    const current = await this.pool.query<{
      status: string;
      revision_count: number;
      revision_limit: number | null;
    }>(
      `SELECT status, revision_count, revision_limit
         FROM ${this.schema}.invitation_orders WHERE id = $1`,
      [orderId],
    );
    const from = current.rows[0]?.status as OrderStatus | undefined;
    if (!from) return { transitioned: false, reason: 'Order tidak ditemukan.' };
    if (from === next) return { transitioned: false, reason: 'Sudah berstatus itu.' };
    if (!(FLOW[from] ?? []).includes(next)) {
      return { transitioned: false, reason: `Transisi ${from} -> ${next} tidak diizinkan.` };
    }
    // P11: batas revisi (NULL = 2 default).
    const limit = current.rows[0]?.revision_limit ?? 2;
    const used = current.rows[0]?.revision_count ?? 0;
    if (next === 'IN_REVISION' && used >= limit) {
      return {
        transitioned: false,
        reason: `Batas revisi (${limit}) telah tercapai. Tambah batas untuk melanjutkan.`,
      };
    }
    const bumpRevision = next === 'IN_REVISION' ? 1 : 0;
    const result = await this.pool.query(
      `UPDATE ${this.schema}.invitation_orders
          SET status = $2,
              revision_count = revision_count + $3,
              price_agreed = COALESCE($4, price_agreed),
              completed_at = CASE WHEN $2 = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE completed_at END,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [orderId, next, bumpRevision, priceAgreed ?? null],
    );
    return { transitioned: (result.rowCount ?? 0) > 0, from, to: next };
  }

  async transitionLogoOrder(orderId: string, next: OrderStatus, priceAgreed?: number) {
    const FLOW: Record<string, OrderStatus[]> = {
      PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
      APPROVED: ['IN_REVISION', 'COMPLETED'],
      IN_REVISION: ['COMPLETED', 'APPROVED'],
    };
    const current = await this.pool.query<{
      status: string;
      revision_count: number;
      revision_limit: number | null;
    }>(
      `SELECT status, revision_count, revision_limit
         FROM ${this.schema}.logo_orders WHERE id = $1`,
      [orderId],
    );
    const from = current.rows[0]?.status as OrderStatus | undefined;
    if (!from) return { transitioned: false, reason: 'Order tidak ditemukan.' };
    if (from === next) return { transitioned: false, reason: 'Sudah berstatus itu.' };
    if (!(FLOW[from] ?? []).includes(next)) {
      return { transitioned: false, reason: `Transisi ${from} -> ${next} tidak diizinkan.` };
    }
    // P11: batas revisi (NULL = 2 default).
    const limit = current.rows[0]?.revision_limit ?? 2;
    const used = current.rows[0]?.revision_count ?? 0;
    if (next === 'IN_REVISION' && used >= limit) {
      return {
        transitioned: false,
        reason: `Batas revisi (${limit}) telah tercapai. Tambah batas untuk melanjutkan.`,
      };
    }
    const bumpRevision = next === 'IN_REVISION' ? 1 : 0;
    const result = await this.pool.query(
      `UPDATE ${this.schema}.logo_orders
          SET status = $2,
              revision_count = revision_count + $3,
              price_agreed = COALESCE($4, price_agreed),
              completed_at = CASE WHEN $2 = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE completed_at END,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [orderId, next, bumpRevision, priceAgreed ?? null],
    );
    return { transitioned: (result.rowCount ?? 0) > 0, from, to: next };
  }

  /* ---------------- P11: Antrean Admin + manajemen token ---------------- */

  /**
   * Antrean Admin terpadu dengan filter urgensi (P11: "Antrean Admin harus
   * dapat difilter berdasarkan urgensi dan menunggu siapa").
   *
   * Urgensi dihitung server-side di view `jasa_order_queue` (0022):
   * HIGH (IN_REVISION > 3hari / menunggu Admin terlalu lama), MEDIUM
   * (PENDING_APPROVAL > 1hari), NORMAL.
   *
   * `waitingOn` = siapa yang diharapkan bertindak: ADMIN / USER / NONE.
   */
  async adminQueue(
    filter: {
      urgency?: 'HIGH' | 'MEDIUM' | 'NORMAL';
      waitingOn?: 'ADMIN' | 'USER' | 'NONE';
      kind?: 'UNDANGAN' | 'LOGO' | 'LAYOUT' | 'CUSTOM_DESIGN' | 'PCB_LAYOUT';
    } = {},
  ) {
    const where: string[] = [];
    const args: unknown[] = [];
    let n = 0;
    if (filter.urgency) {
      where.push(`urgency = $${++n}`);
      args.push(filter.urgency);
    }
    if (filter.waitingOn) {
      where.push(`waiting_on = $${++n}`);
      args.push(filter.waitingOn);
    }
    if (filter.kind) {
      where.push(`kind = $${++n}`);
      args.push(filter.kind);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const result = await this.pool.query(
      `SELECT id, kind, status, revision_count, revision_limit, schema_version,
              price_agreed, created_at, updated_at, completed_at,
              urgency, waiting_on, public_slug
         FROM ${this.schema}.jasa_order_queue ${clause}
        ORDER BY
          CASE urgency WHEN 'HIGH' THEN 0 WHEN 'MEDIUM' THEN 1 ELSE 2 END,
          updated_at ASC
        LIMIT 200`,
      args,
    );
    return result.rows;
  }

  /**
   * Cabut tautan privat order (P11: "revoke"). Token lama tidak lagi berlaku;
   * pelanggan membutuhkan token baru dari Admin. Hanya Admin (route OWNER).
   * L04: juga melayani order generik (CUSTOM_DESIGN/PCB_LAYOUT/LAYOUT).
   */
  async revokeOrderToken(kind: 'UNDANGAN' | 'LOGO' | 'SERVICE', orderId: string) {
    const table =
      kind === 'LOGO' ? 'logo_orders' : kind === 'SERVICE' ? 'service_orders' : 'invitation_orders';
    const result = await this.pool.query(
      `UPDATE ${this.schema}.${table}
          SET token_revoked_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND token_revoked_at IS NULL`,
      [orderId],
    );
    return { revoked: (result.rowCount ?? 0) > 0 };
  }

  /**
   * Atur kedaluwarsa tautan privat (P11: "expiry"). Dipakai saat order selesai
   * atau Admin ingin membatasi umur link sensitif.
   */
  async setOrderTokenExpiry(
    kind: 'UNDANGAN' | 'LOGO' | 'SERVICE',
    orderId: string,
    expiresAt: Date,
  ) {
    const table =
      kind === 'LOGO' ? 'logo_orders' : kind === 'SERVICE' ? 'service_orders' : 'invitation_orders';
    const result = await this.pool.query(
      `UPDATE ${this.schema}.${table}
          SET token_expires_at = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [orderId, expiresAt],
    );
    return { set: (result.rowCount ?? 0) > 0 };
  }

  /**
   * Tetapkan batas revisi untuk order (P11: "batas revisi"). Dipanggil saat
   * APPROVED; memungkinkan Admin menambah batas bila pelanggan butuh lebih.
   * L04: juga melayani order generik.
   */
  async setRevisionLimit(kind: 'UNDANGAN' | 'LOGO' | 'SERVICE', orderId: string, limit: number) {
    if (!Number.isInteger(limit) || limit < 0 || limit > 10) {
      throw new ApiError('VALIDATION_FAILED', 'Batas revisi harus 0–10');
    }
    const table =
      kind === 'LOGO' ? 'logo_orders' : kind === 'SERVICE' ? 'service_orders' : 'invitation_orders';
    const result = await this.pool.query(
      `UPDATE ${this.schema}.${table}
          SET revision_limit = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [orderId, limit],
    );
    return { set: (result.rowCount ?? 0) > 0 };
  }

  /* ---------------- GENERAL SERVICES & PCB ORDERS (L04, F02, F03) ---------------- */

  assessPcbRisk(flags: PcbSafetyFlags, maxVolt: number, maxAmpere: number) {
    return assessPcbRisk(flags, maxVolt, maxAmpere);
  }

  async createPcbOrder(input: {
    principalId?: string;
    catalogItemId?: string;
    brief: PcbBrief;
    fixedPrice: number;
    revisionLimit?: number;
  }) {
    if (!input.brief.disclaimerAcknowledged) {
      throw new ApiError(
        'VALIDATION_FAILED',
        'Pernyataan batasan tanggung jawab (disclaimer) PCB wajib disetujui',
      );
    }
    if (
      input.brief.layerCount <= 0 ||
      input.brief.dimensions.widthMm <= 0 ||
      input.brief.dimensions.heightMm <= 0
    ) {
      throw new ApiError('VALIDATION_FAILED', 'Dimensi board dan jumlah layer tidak valid');
    }
    if (![1, 2, 4, 6, 8].includes(input.brief.layerCount)) {
      throw new ApiError('VALIDATION_FAILED', 'Jumlah layer harus 1, 2, 4, 6, atau 8');
    }

    const { riskLevel } = this.assessPcbRisk(
      input.brief.safetyFlags,
      input.brief.operatingVoltage.maxVolt,
      input.brief.operatingCurrent.maxAmpere,
    );
    input.brief.riskLevel = riskLevel;

    // L04 AC1: katalog opsional tetapi bila diberikan harus item terbit yang valid;
    // snapshot memakai harga katalog sebagai sumber tunggal.
    let catalog: Awaited<ReturnType<JasaService['resolveCatalogItem']>> | null = null;
    if (input.catalogItemId !== undefined && input.catalogItemId !== '') {
      catalog = await this.resolveCatalogItem(input.catalogItemId);
    }
    const snapshotPrice = catalog ? Number(catalog.fixed_price) : input.fixedPrice;
    if (!Number.isFinite(snapshotPrice) || snapshotPrice < 0) {
      throw new ApiError('VALIDATION_FAILED', 'Harga snapshot tidak valid');
    }

    const id = randomUUID();
    const briefRowId = randomUUID();
    const secretToken = generateSecretToken();
    const revisionLimit = Math.min(Math.max(input.revisionLimit ?? 2, 0), 10);

    const priceSnapshot: ServiceOrderSnapshot = {
      orderId: id,
      catalogItemId: catalog?.id ?? input.catalogItemId,
      serviceTitle: catalog?.title ?? 'Jasa Desain Layout PCB',
      serviceKind: 'PCB_LAYOUT',
      snapshotPrice,
      currency: 'IDR',
      // Tanpa item katalog berharga tetap, PCB mengikuti alur quote custom.
      // Nilai input awal hanya placeholder internal, bukan klaim "Gratis".
      agreedAt: catalog ? this.now().toISOString() : '',
      revisionLimit,
      license: catalog?.license ?? 'MADEVI_COMMERCIAL',
      version: catalog?.version ?? '1.0.0',
      pricingStatus: catalog ? 'FIXED' : 'QUOTE_PENDING',
    };

    return inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.service_orders
           (id, secret_token, principal_id, kind, catalog_item_id, brief_version,
            brief_data, price_snapshot, status, revision_count, revision_limit)
         VALUES ($1, $2, $3, 'PCB_LAYOUT', $4, 1, $5::jsonb, $6::jsonb, 'PENDING_APPROVAL', 0, $7)`,
        [
          id,
          secretToken,
          input.principalId ?? null,
          catalog?.id ?? null,
          JSON.stringify(input.brief),
          JSON.stringify(priceSnapshot),
          revisionLimit,
        ],
      );
      // L04 Pendekatan B: brief type-safe di tabel relasi (0029).
      const b = input.brief;
      await client.query(
        `INSERT INTO ${this.schema}.pcb_briefs
           (id, order_id, width_mm, height_mm, shape, layer_count,
            component_count_est, critical_footprints, max_volt, max_ampere,
            target_fab_house, safety_flags, manufacturing, input_files,
            deliverables, risk_level, disclaimer_version)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb, $15, $16, $17)`,
        [
          briefRowId,
          id,
          b.dimensions.widthMm,
          b.dimensions.heightMm,
          b.dimensions.shape,
          b.layerCount,
          b.componentCountEst ?? null,
          b.criticalFootprints ?? [],
          b.operatingVoltage.maxVolt,
          b.operatingCurrent.maxAmpere,
          b.manufacturing.targetFabHouse ?? '',
          JSON.stringify(b.safetyFlags),
          JSON.stringify(b.manufacturing),
          JSON.stringify(
            (b.inputFiles ?? []).map((f) => ({
              fileName: f.fileName,
              fileType: f.fileType,
              sha256: f.sha256,
            })),
          ),
          b.requestedDeliverables ?? [],
          riskLevel,
          '1.0.0',
        ],
      );
      const row = await client.query(
        `SELECT id, secret_token, status, created_at FROM ${this.schema}.service_orders WHERE id = $1`,
        [id],
      );
      return row.rows[0];
    });
  }

  async getServiceOrder(idOrToken: string): Promise<ServiceOrder | null> {
    const isToken = idOrToken.length >= 32 && !idOrToken.includes('-');
    const cond = isToken ? 'secret_token = $1' : 'id = $1';
    const result = await this.pool.query<ServiceOrder>(
      `SELECT id, secret_token AS "secretToken", principal_id AS "principalId",
              kind, catalog_item_id AS "catalogItemId", brief_version AS "briefVersion",
              brief_data AS "briefData", price_snapshot AS "priceSnapshot",
              status, revision_count AS "revisionCount", revision_limit AS "revisionLimit",
              deliverables, timeline, token_expires_at AS "tokenExpiresAt",
              token_revoked_at AS "tokenRevokedAt", created_at AS "createdAt",
              updated_at AS "updatedAt", completed_at AS "completedAt"
         FROM ${this.schema}.service_orders
        WHERE ${cond}
          AND (token_revoked_at IS NULL)
          AND (token_expires_at IS NULL OR token_expires_at > CURRENT_TIMESTAMP)`,
      [idOrToken],
    );
    return result.rows[0] ?? null;
  }

  /* ---------------- L04: katalog, custom, transisi, antrean generik ---------------- */

  /** Daftar item katalog terbit (sumber tunggal preview + order, L04 AC1/AC2). */
  async listPublishedCatalogItems() {
    const result = await this.pool.query(
      `SELECT id, kind, title, slug, summary, description, preview_url,
              fixed_price, is_free, currency, license, version, status,
              deliverable_formats
         FROM ${this.schema}.service_catalog_items
        WHERE status = 'PUBLISHED'
        ORDER BY kind ASC, title ASC`,
    );
    return result.rows;
  }

  async createCatalogItem(input: {
    kind: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    fixedPrice: number;
    isFree: boolean;
    previewUrl?: string;
    deliverableFormats?: string[];
  }) {
    const id = randomUUID();
    await inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.service_catalog_items
           (id, kind, title, slug, summary, description, fixed_price, is_free, preview_url, deliverable_formats, status, version)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'DRAFT', '1.0.0')`,
        [
          id,
          input.kind,
          input.title,
          input.slug,
          input.summary,
          input.description,
          input.fixedPrice,
          input.isFree,
          input.previewUrl ?? '',
          JSON.stringify(input.deliverableFormats ?? []),
        ],
      );
    });
    return { id };
  }

  async updateCatalogItem(id: string, patch: {
    title?: string;
    summary?: string;
    description?: string;
    fixedPrice?: number;
    isFree?: boolean;
    previewUrl?: string;
    deliverableFormats?: string[];
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }) {
    const fields: string[] = [];
    const args: unknown[] = [id];
    let n = 1;
    if (patch.title !== undefined) {
      fields.push(`title = $${++n}`);
      args.push(patch.title);
    }
    if (patch.summary !== undefined) {
      fields.push(`summary = $${++n}`);
      args.push(patch.summary);
    }
    if (patch.description !== undefined) {
      fields.push(`description = $${++n}`);
      args.push(patch.description);
    }
    if (patch.fixedPrice !== undefined) {
      fields.push(`fixed_price = $${++n}`);
      args.push(patch.fixedPrice);
    }
    if (patch.isFree !== undefined) {
      fields.push(`is_free = $${++n}`);
      args.push(patch.isFree);
    }
    if (patch.previewUrl !== undefined) {
      fields.push(`preview_url = $${++n}`);
      args.push(patch.previewUrl);
    }
    if (patch.deliverableFormats !== undefined) {
      fields.push(`deliverable_formats = $${++n}`);
      args.push(JSON.stringify(patch.deliverableFormats));
    }
    if (patch.status !== undefined) {
      fields.push(`status = $${++n}`);
      args.push(patch.status);
    }
    if (fields.length === 0) return { updated: false };
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    const result = await this.pool.query(
      `UPDATE ${this.schema}.service_catalog_items SET ${fields.join(', ')} WHERE id = $1`,
      args,
    );
    return { updated: (result.rowCount ?? 0) > 0 };
  }

  async deleteCatalogItem(id: string) {
    const result = await this.pool.query(
      `DELETE FROM ${this.schema}.service_catalog_items WHERE id = $1`,
      [id]
    );
    return { deleted: (result.rowCount ?? 0) > 0 };
  }

  /**
   * Resolve item katalog terbit untuk snapshot order (L04 AC1).
   * ID teks fallback (mis. 'layout-undangan-a') ditolak fail-closed di sini
   * agar tidak menjadi error FK mentah atau order yatim.
   */
  async resolveCatalogItem(catalogItemId: string) {
    requireUuid(catalogItemId, 'catalogItemId');
    const result = await this.pool.query(
      `SELECT id, kind, title, fixed_price, is_free, currency, license, version
         FROM ${this.schema}.service_catalog_items
        WHERE id = $1 AND status = 'PUBLISHED'`,
      [catalogItemId],
    );
    const row = result.rows[0];
    if (!row) {
      throw new ApiError('VALIDATION_FAILED', 'Item katalog tidak tersedia atau belum diterbitkan');
    }
    return row as {
      id: string;
      kind: string;
      title: string;
      fixed_price: string | number;
      is_free: boolean;
      currency: string;
      license: string;
      version: string;
    };
  }

  /**
   * Buat order custom (L04 AC3). Harga snapshot mengikuti katalog bila item
   * diberikan, sonst 0 = penetapan Admin setelah brief diperiksa (bukan nego bebas).
   */
  async createCustomOrder(input: {
    principalId?: string;
    catalogItemId?: string;
    category:
      | 'UNDANGAN_CUSTOM'
      | 'LOGO_CUSTOM'
      | 'CV_PORTFOLIO'
      | 'CERTIFICATE'
      | 'PHOTO_EDIT'
      | 'LAYOUT_CUSTOM'
      | 'LAINNYA';
    title: string;
    description: string;
    referenceUrls?: string[];
    revisionLimit?: number;
  }) {
    const CATEGORIES = [
      'UNDANGAN_CUSTOM',
      'LOGO_CUSTOM',
      'CV_PORTFOLIO',
      'CERTIFICATE',
      'PHOTO_EDIT',
      'LAYOUT_CUSTOM',
      'LAINNYA',
    ];
    if (!CATEGORIES.includes(input.category)) {
      throw new ApiError('VALIDATION_FAILED', 'Kategori custom tidak valid');
    }
    const title = input.title.trim();
    const description = input.description.trim();
    if (title.length < 3 || title.length > 200) {
      throw new ApiError('VALIDATION_FAILED', 'Judul brief wajib 3–200 karakter');
    }
    if (description.length < 20 || description.length > 8000) {
      throw new ApiError('VALIDATION_FAILED', 'Deskripsi brief wajib 20–8000 karakter');
    }
    const referenceUrls = (input.referenceUrls ?? [])
      .filter((u) => typeof u === 'string' && u.trim().length > 0)
      .slice(0, 10);
    for (const u of referenceUrls) {
      if (u.length > 2000 || !/^https?:\/\//i.test(u.trim())) {
        throw new ApiError('VALIDATION_FAILED', 'URL referensi harus http(s) dan ≤ 2000 karakter');
      }
    }

    let catalog: Awaited<ReturnType<JasaService['resolveCatalogItem']>> | null = null;
    if (input.catalogItemId !== undefined && input.catalogItemId !== '') {
      catalog = await this.resolveCatalogItem(input.catalogItemId);
    }
    const snapshotPrice = catalog ? Number(catalog.fixed_price) : 0;

    const id = randomUUID();
    const briefId = randomUUID();
    const secretToken = generateSecretToken();
    const revisionLimit = Math.min(Math.max(input.revisionLimit ?? 2, 0), 10);
    const priceSnapshot: ServiceOrderSnapshot = {
      orderId: id,
      catalogItemId: catalog?.id,
      serviceTitle: catalog?.title ?? `Jasa Custom: ${title}`,
      serviceKind: 'CUSTOM_DESIGN',
      snapshotPrice,
      currency: 'IDR',
      // Nilai 0 pada jasa custom bukan "Gratis". Admin harus menerbitkan
      // quote eksplisit (termasuk Rp0 bila memang hibah) sebelum status APPROVED.
      agreedAt: catalog ? this.now().toISOString() : '',
      revisionLimit,
      license: catalog?.license ?? 'MADEVI_COMMERCIAL',
      version: catalog?.version ?? '1.0.0',
      pricingStatus: catalog ? 'FIXED' : 'QUOTE_PENDING',
    };

    return inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.service_orders
           (id, secret_token, principal_id, kind, catalog_item_id, brief_version,
            brief_data, price_snapshot, status, revision_count, revision_limit)
         VALUES ($1, $2, $3, 'CUSTOM_DESIGN', $4, 1, $5::jsonb, $6::jsonb, 'PENDING_APPROVAL', 0, $7)`,
        [
          id,
          secretToken,
          input.principalId ?? null,
          catalog?.id ?? null,
          JSON.stringify({ category: input.category, title, description, referenceUrls }),
          JSON.stringify(priceSnapshot),
          revisionLimit,
        ],
      );
      await client.query(
        `INSERT INTO ${this.schema}.custom_briefs
           (id, order_id, category, title, description, reference_urls)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [briefId, id, input.category, title, description, referenceUrls],
      );
      const row = await client.query(
        `SELECT id, secret_token, status, created_at FROM ${this.schema}.service_orders WHERE id = $1`,
        [id],
      );
      return row.rows[0];
    });
  }

  /** Order milik saya (baca privat, tanpa tokenImpersonasi). */
  async listMyServiceOrders(principalId: string, kinds?: string[]) {
    const args: unknown[] = [principalId];
    let kindClause = '';
    if (kinds && kinds.length) {
      kindClause = `AND kind = ANY($2)`;
      args.push(kinds);
    }
    const result = await this.pool.query(
      `SELECT id, kind, catalog_item_id, status, revision_count, revision_limit,
              price_snapshot, created_at, updated_at, completed_at
         FROM ${this.schema}.service_orders
        WHERE principal_id = $1 ${kindClause}
        ORDER BY updated_at DESC LIMIT 100`,
      args,
    );
    return result.rows;
  }

  /** Baca satu order milik sendiri (ownership check, L04 AC4). */
  async getMyServiceOrder(principalId: string, orderId: string) {
    requireUuid(orderId, 'orderId');
    const result = await this.pool.query(
      `SELECT id, kind, catalog_item_id, brief_data, price_snapshot, status,
              revision_count, revision_limit, deliverables, timeline,
              token_expires_at, token_revoked_at, created_at, updated_at, completed_at
         FROM ${this.schema}.service_orders
        WHERE id = $1 AND principal_id = $2
          AND (token_revoked_at IS NULL)
          AND (token_expires_at IS NULL OR token_expires_at > CURRENT_TIMESTAMP)`,
      [orderId, principalId],
    );
    return result.rows[0] ?? null;
  }

  /** Daftar semua order generik untuk Admin (tanpa data privat file). */
  async listAllServiceOrders() {
    const result = await this.pool.query(
      `SELECT o.id, o.kind, o.status, o.revision_count, o.revision_limit,
              o.price_snapshot, o.created_at, o.updated_at, o.completed_at,
              p.username AS principal_username
         FROM ${this.schema}.service_orders o
         LEFT JOIN ${this.schema}.principals p ON p.id = o.principal_id
        ORDER BY o.updated_at DESC LIMIT 200`,
    );
    return result.rows;
  }

  /**
   * Transisi status order generik (L04 AC5). Alur sama dengan undangan/logo;
   * setiap transisi dicatat ke `timeline` JSON sehingga dapat dilacak Admin.
   */
  async transitionServiceOrder(
    orderId: string,
    next: OrderStatus,
    options: { priceAgreed?: number; actor?: string } = {},
  ) {
    const FLOW: Record<string, OrderStatus[]> = {
      PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
      APPROVED: ['IN_REVISION', 'COMPLETED'],
      IN_REVISION: ['COMPLETED', 'APPROVED'],
    };
    requireUuid(orderId, 'orderId');
    return inTransaction(this.pool, async (client) => {
      const current = await client.query<{
        status: string;
        revision_count: number;
        revision_limit: number;
        timeline: unknown;
        price_snapshot: unknown;
      }>(
        `SELECT status, revision_count, revision_limit, timeline, price_snapshot
           FROM ${this.schema}.service_orders WHERE id = $1`,
        [orderId],
      );
      const row = current.rows[0];
      const from = row?.status as OrderStatus | undefined;
      if (!from) return { transitioned: false, reason: 'Order tidak ditemukan.' };
      if (from === next) return { transitioned: false, reason: 'Sudah berstatus itu.' };
      if (!(FLOW[from] ?? []).includes(next)) {
        return { transitioned: false, reason: `Transisi ${from} -> ${next} tidak diizinkan.` };
      }
      if (next === 'IN_REVISION' && (row.revision_count ?? 0) >= (row.revision_limit ?? 2)) {
        return {
          transitioned: false,
          reason: `Batas revisi (${row.revision_limit ?? 2}) telah tercapai. Tambah batas untuk melanjutkan.`,
        };
      }
      const snapshotBase =
        row.price_snapshot && typeof row.price_snapshot === 'object'
          ? { ...(row.price_snapshot as Record<string, unknown>) }
          : {};
      const needsQuote = snapshotBase.pricingStatus === 'QUOTE_PENDING';
      if (from === 'PENDING_APPROVAL' && next === 'APPROVED' && needsQuote) {
        if (
          options.priceAgreed === undefined ||
          !Number.isSafeInteger(options.priceAgreed) ||
          options.priceAgreed < 0
        ) {
          return {
            transitioned: false,
            reason: 'Tetapkan harga penawaran IDR sebelum menyetujui jasa custom.',
          };
        }
      }

      const bumpRevision = next === 'IN_REVISION' ? 1 : 0;
      const timeline = Array.isArray(row.timeline) ? [...row.timeline] : [];
      timeline.push({
        from,
        to: next,
        at: this.now().toISOString(),
        actor: options.actor ?? 'ADMIN',
      });
      let snapshot: unknown = snapshotBase;
      if (options.priceAgreed !== undefined) {
        snapshotBase.snapshotPrice = options.priceAgreed;
        snapshotBase.agreedAt = this.now().toISOString();
        snapshotBase.pricingStatus = 'QUOTED';
        snapshot = snapshotBase;
      }
      const result = await client.query(
        `UPDATE ${this.schema}.service_orders
            SET status = $2,
                revision_count = revision_count + $3,
                price_snapshot = $4::jsonb,
                timeline = $5::jsonb,
                completed_at = CASE WHEN $2 = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE completed_at END,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [orderId, next, bumpRevision, JSON.stringify(snapshot), JSON.stringify(timeline)],
      );
      return { transitioned: (result.rowCount ?? 0) > 0, from, to: next };
    });
  }
}

/**
 * Penilai risiko kelistrikan dan kompleksitas manufaktur PCB (Prompt L04 / F03).
 */
export function assessPcbRisk(
  flags: PcbSafetyFlags,
  maxVolt: number,
  maxAmpere: number,
): {
  riskLevel: PcbRiskLevel;
  warningFlags: string[];
} {
  const warningFlags: string[] = [];
  let riskLevel: PcbRiskLevel = 'LOW';

  if (flags.isSafetyCritical) {
    riskLevel = 'EXTREME';
    warningFlags.push(
      'Aplikasi safety-critical/medis/otomotif memerlukan verifikasi laboratorium independen.',
    );
  } else if (flags.hasMainsVoltage || maxVolt >= 50) {
    riskLevel = 'HIGH';
    warningFlags.push(
      'Tegangan tinggi (>= 50V / Mains AC) membutuhkan jarak isolasi (creepage/clearance) ketat.',
    );
  } else if (flags.hasLithiumBattery) {
    riskLevel = 'HIGH';
    warningFlags.push(
      'Rangkaian baterai litium wajib memiliki proteksi overcharge, overdischarge, dan suhu.',
    );
  } else if (flags.hasHighCurrent || maxAmpere > 5) {
    riskLevel = 'MEDIUM';
    warningFlags.push(
      'Arus tinggi (> 5A) memerlukan perhitungan lebar track tembaga dan thermal relief khusus.',
    );
  } else if (flags.hasRfWireless) {
    riskLevel = 'MEDIUM';
    warningFlags.push(
      'Frekuensi tinggi RF memerlukan kontrol impedansi jalur transmisi (impedance matching).',
    );
  }

  return { riskLevel, warningFlags };
}

export { PCB_SAFETY_DISCLAIMER } from '@/contracts/services';
