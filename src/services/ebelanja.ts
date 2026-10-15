import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';
import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';

export interface Partner {
  id: string;
  domain: string;
  name: string;
  contractExpiresAt: Date | null;
  createdAt: Date;
}

export interface Product {
  id: string;
  partnerId: string;
  title: string;
  slug: string;
  imageUrl: string;
  originalPrice: number;
  currency: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  brand: string;
  category: string;
  subcategory: string;
  condition: string;
  sourceDescription: string;
  ownerDescription: string;
  externalUrl: string;
  lastCheckedAt: Date;
  lifecycleStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isTest: boolean;
  viewsCount: number;
  clicksCount: number;
}

export interface CreateProductInput {
  title: string;
  imageUrl: string;
  mediaUrls?: string[];
  originalPrice: number;
  brand?: string;
  category: string;
  subcategory?: string;
  condition?: string;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  sourceDescription: string;
  ownerDescription?: string;
  externalUrl: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  productTitle?: string;
  authorLabel: string;
  questionText: string;
  answerText: string;
  status: 'PENDING' | 'ANSWERED' | 'HIDDEN';
  createdAt: Date;
  answeredAt: Date | null;
}

export class EBelanjaService {
  private readonly schema: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async searchProducts(filters: {
    category?: string;
    subcategory?: string;
    brand?: string;
    condition?: string;
    stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    sortBy?: 'RELEVANT' | 'NEWEST' | 'PRICE' | 'PRICE_ASC' | 'PRICE_DESC' | 'VIEWS' | 'A-Z';
    limit?: number;
    offset?: number;
  }) {
    const where = [`lifecycle_status = 'PUBLISHED'`];
    const params: unknown[] = [];
    const add = (cond: string, value: unknown) => {
      params.push(value);
      where.push(`${cond} $${params.length}`);
    };

    if (filters.category) add('category =', filters.category);
    if (filters.subcategory) add('subcategory =', filters.subcategory);
    if (filters.brand) add('brand ILIKE', `%${filters.brand}%`);
    if (filters.condition) add('condition =', filters.condition);
    if (filters.stockStatus) add('stock_status =', filters.stockStatus);
    if (filters.minPrice !== undefined && Number.isFinite(filters.minPrice))
      add('original_price >=', filters.minPrice);
    if (
      filters.maxPrice !== undefined &&
      Number.isFinite(filters.maxPrice) &&
      (filters.maxPrice as number) >= 0
    ) {
      add('original_price <=', filters.maxPrice);
    }

    const q = filters.query?.trim();
    if (q) {
      params.push(`%${q}%`);
      where.push(
        `(title ILIKE $${params.length} OR brand ILIKE $${params.length} OR category ILIKE $${params.length})`,
      );
    }
    const whereSql = where.join(' AND ');

    let orderBy = 'created_at DESC';
    if (filters.sortBy === 'PRICE' || filters.sortBy === 'PRICE_ASC') {
      orderBy = 'original_price ASC, created_at DESC';
    } else if (filters.sortBy === 'PRICE_DESC') {
      orderBy = 'original_price DESC, created_at DESC';
    } else if (filters.sortBy === 'VIEWS') {
      orderBy = 'views_count DESC, created_at DESC';
    } else if (filters.sortBy === 'A-Z') {
      orderBy = 'title ASC';
    } else if (filters.sortBy === 'NEWEST') {
      orderBy = 'created_at DESC';
    } else if (filters.sortBy === 'RELEVANT' && q) {
      // Relevansi: judul diawali query dulu, lalu judul mengandung, lalu terbaru.
      params.push(`${q}%`, `%${q}%`);
      const p1 = params.length - 1;
      const p2 = params.length;
      orderBy = `CASE WHEN title ILIKE $${p1} THEN 0 WHEN title ILIKE $${p2} THEN 1 ELSE 2 END, created_at DESC`;
    }

    const limit = Math.min(filters.limit || 20, 100);
    const offset = Math.max(filters.offset || 0, 0);
    params.push(limit, offset);
    const result = await this.pool.query(
      `SELECT * FROM ${this.schema}.ebelanja_products WHERE ${whereSql} ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const countResult = await this.pool.query(
      `SELECT count(*) FROM ${this.schema}.ebelanja_products WHERE ${whereSql}`,
      params.slice(0, params.length - 2),
    );
    return { data: result.rows, total: parseInt(countResult.rows[0].count, 10) };
  }

  /** Validates a partner URL without fetching it (SSRF-safe local boundary). */
  async parseExternalProduct(url: string, partnerId: string) {
    void partnerId;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new ApiError('VALIDATION_FAILED', 'URL partner tidak valid');
    }
    if (parsed.protocol !== 'https:' || isIP(parsed.hostname) ||
      parsed.hostname === 'localhost' || parsed.hostname.endsWith('.localhost') ||
      parsed.hostname === '127.0.0.1' || parsed.hostname === '::1') {
      throw new ApiError('ACCESS_DENIED', 'URL partner tidak diizinkan');
    }
    return { url: parsed.toString(), status: 'NOT_FETCHED' as const };
  }

  async listPublishedCategories() {
    const result = await this.pool.query<{ category: string }>(
      `SELECT DISTINCT category
         FROM ${this.schema}.ebelanja_products
        WHERE lifecycle_status = 'PUBLISHED' AND trim(category) <> ''
        ORDER BY category ASC`,
    );
    return result.rows.map((row) => row.category);
  }

  async getHomepageProducts() {
    const result = await this.pool.query(`
      SELECT * FROM ${this.schema}.ebelanja_products 
      WHERE lifecycle_status = 'PUBLISHED' 
      ORDER BY created_at DESC LIMIT 3
    `);
    return result.rows;
  }

  async trackClick(productId: string) {
    await this.pool.query(
      `UPDATE ${this.schema}.ebelanja_products
          SET clicks_count = clicks_count + 1
        WHERE id = $1 AND lifecycle_status = 'PUBLISHED'`,
      [productId],
    );
  }

  // Tanya produk masuk ke antrean Q&A Owner. Hanya pertanyaan yang sudah dijawab tampil publik.
  async askAbout(principalId: string, productId: string, message: string) {
    const text = requiredText(message, 'Pertanyaan', 10, 1000);
    const normalized = normalizeQuestion(text);
    if (normalized.length < 10) {
      throw new ApiError('VALIDATION_FAILED', 'Pertanyaan harus memuat setidaknya 10 huruf atau angka yang bermakna.');
    }
    const product = await this.pool.query(
      `SELECT id, title FROM ${this.schema}.ebelanja_products WHERE id = $1 AND lifecycle_status = 'PUBLISHED'`,
      [productId],
    );
    if (!product.rows[0]) throw new ApiError('NOT_FOUND', 'Produk tidak ditemukan');

    const existing = await this.pool.query<ProductQuestion>(
      `SELECT id, product_id AS "productId", author_label AS "authorLabel", question_text AS "questionText",
              answer_text AS "answerText", status, created_at AS "createdAt", answered_at AS "answeredAt"
         FROM ${this.schema}.ebelanja_product_questions
        WHERE product_id = $1 AND normalized_text = $2`,
      [productId, normalized],
    );
    if (existing.rows[0]) return { created: false, duplicate: true, question: existing.rows[0] };

    try {
      const inserted = await this.pool.query<ProductQuestion>(
        `INSERT INTO ${this.schema}.ebelanja_product_questions
           (id, product_id, principal_id, author_label, question_text, normalized_text)
         VALUES ($1, $2, $3, 'Pengguna Madevi', $4, $5)
         RETURNING id, product_id AS "productId", author_label AS "authorLabel", question_text AS "questionText",
                   answer_text AS "answerText", status, created_at AS "createdAt", answered_at AS "answeredAt"`,
        [randomUUID(), productId, principalId, text, normalized],
      );
      return { created: true, duplicate: false, question: inserted.rows[0] };
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      const duplicate = await this.pool.query<ProductQuestion>(
        `SELECT id, product_id AS "productId", author_label AS "authorLabel", question_text AS "questionText",
                answer_text AS "answerText", status, created_at AS "createdAt", answered_at AS "answeredAt"
           FROM ${this.schema}.ebelanja_product_questions
          WHERE product_id = $1 AND normalized_text = $2`,
        [productId, normalized],
      );
      return { created: false, duplicate: true, question: duplicate.rows[0] };
    }
  }

  async listPublicProductQuestions(productId: string) {
    const result = await this.pool.query<ProductQuestion>(
      `SELECT q.id, q.product_id AS "productId", q.author_label AS "authorLabel",
              q.question_text AS "questionText", q.answer_text AS "answerText", q.status,
              q.created_at AS "createdAt", q.answered_at AS "answeredAt"
         FROM ${this.schema}.ebelanja_product_questions q
         JOIN ${this.schema}.ebelanja_products p ON p.id = q.product_id
        WHERE q.product_id = $1 AND q.status = 'ANSWERED' AND p.lifecycle_status = 'PUBLISHED'
        ORDER BY q.answered_at DESC, q.created_at DESC
        LIMIT 100`,
      [productId],
    );
    return result.rows;
  }

  async listOwnerProductQuestions() {
    const result = await this.pool.query<ProductQuestion>(
      `SELECT q.id, q.product_id AS "productId", p.title AS "productTitle", q.author_label AS "authorLabel",
              q.question_text AS "questionText", q.answer_text AS "answerText", q.status,
              q.created_at AS "createdAt", q.answered_at AS "answeredAt"
         FROM ${this.schema}.ebelanja_product_questions q
         JOIN ${this.schema}.ebelanja_products p ON p.id = q.product_id
        WHERE q.status <> 'HIDDEN'
        ORDER BY CASE WHEN q.status = 'PENDING' THEN 0 ELSE 1 END, q.created_at DESC
        LIMIT 100`,
    );
    return result.rows;
  }

  async answerProductQuestion(ownerId: string, questionId: string, answer: string) {
    const answerText = requiredText(answer, 'Jawaban', 2, 4000);
    const result = await this.pool.query<ProductQuestion>(
      `UPDATE ${this.schema}.ebelanja_product_questions q
          SET answer_text = $1, status = 'ANSWERED', answered_by = $2,
              answered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE q.id = $3 AND q.status <> 'HIDDEN'
        RETURNING q.id, q.product_id AS "productId", q.author_label AS "authorLabel",
                  q.question_text AS "questionText", q.answer_text AS "answerText", q.status,
                  q.created_at AS "createdAt", q.answered_at AS "answeredAt"`,
      [answerText, ownerId, questionId],
    );
    if (!result.rows[0]) throw new ApiError('NOT_FOUND', 'Pertanyaan tidak ditemukan.');
    return result.rows[0];
  }

  // K-20: form kerja sama mitra — domain unik, duplikat mengembalikan mitra lama (idempoten).
  async requestPartner(input: { name: string; domain: string }) {
    const name = input.name?.trim() ?? '';
    const domain = input.domain?.trim().toLowerCase() ?? '';
    if (name.length < 2 || name.length > 160) throw new Error('Nama mitra 2–160 karakter');
    if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(domain))
      throw new Error('Domain mitra tidak valid');
    const existing = await this.pool.query(
      `SELECT id, domain, name FROM ${this.schema}.ebelanja_partners WHERE domain = $1`,
      [domain],
    );
    if (existing.rows[0]) return { ...existing.rows[0], duplicate: true };
    const id = randomUUID();
    const created = await this.pool.query(
      `INSERT INTO ${this.schema}.ebelanja_partners (id, domain, name)
       VALUES ($1, $2, $3) RETURNING id, domain, name`,
      [id, domain, name],
    );
    return { ...created.rows[0], duplicate: false };
  }

  async saveProduct(principalId: string, productId: string) {
    const product = await this.pool.query(
      `SELECT id FROM ${this.schema}.ebelanja_products WHERE id = $1 AND lifecycle_status = 'PUBLISHED'`,
      [productId],
    );
    if (!product.rows[0]) throw new Error('Produk tidak ditemukan');
    await this.pool.query(
      `INSERT INTO ${this.schema}.ebelanja_saved_products (id, principal_id, product_id)
       VALUES ($1, $2, $3) ON CONFLICT (principal_id, product_id) DO NOTHING`,
      [randomUUID(), principalId, productId],
    );
    return { saved: true };
  }

  async unsaveProduct(principalId: string, productId: string) {
    await this.pool.query(
      `DELETE FROM ${this.schema}.ebelanja_saved_products WHERE principal_id = $1 AND product_id = $2`,
      [principalId, productId],
    );
    return { saved: false };
  }

  async listSavedProducts(principalId: string) {
    const result = await this.pool.query(
      `SELECT p.* FROM ${this.schema}.ebelanja_products p
        JOIN ${this.schema}.ebelanja_saved_products s ON s.product_id = p.id
       WHERE s.principal_id = $1 ORDER BY p.created_at DESC LIMIT 100`,
      [principalId],
    );
    return result.rows;
  }

  async createProduct(input: CreateProductInput) {
    const title = requiredText(input.title, 'Nama produk', 2, 200);
    const category = requiredText(input.category, 'Kategori', 2, 120);
    const subcategory = optionalText(input.subcategory, 'Subkategori', 120);
    const brand = optionalText(input.brand, 'Merek', 120);
    const sourceDescription = requiredText(input.sourceDescription, 'Deskripsi', 20, 4000);
    const ownerDescription = optionalText(input.ownerDescription, 'Catatan Owner', 2000);
    const imageUrl = localProductImageUrl(input.imageUrl);
    const mediaUrls = uniqueMediaUrls([imageUrl, ...(input.mediaUrls ?? [])]);
    const originalPrice = Number(input.originalPrice);
    if (!Number.isFinite(originalPrice) || originalPrice < 0 || originalPrice > 999_999_999) {
      throw new ApiError('VALIDATION_FAILED', 'Harga harus antara Rp0 dan Rp999.999.999.');
    }

    let affiliateUrl: URL;
    try {
      affiliateUrl = new URL(input.externalUrl.trim());
    } catch {
      throw new ApiError('VALIDATION_FAILED', 'Tautan afiliasi tidak valid.');
    }
    if (
      affiliateUrl.protocol !== 'https:' ||
      affiliateUrl.username ||
      affiliateUrl.password ||
      isPrivateNetworkHost(affiliateUrl.hostname)
    ) {
      throw new ApiError(
        'VALIDATION_FAILED',
        'Tautan afiliasi wajib HTTPS, tanpa kredensial, dan tidak boleh menunjuk jaringan lokal.',
      );
    }

    const stockStatus = input.stockStatus ?? 'UNKNOWN';
    if (!['IN_STOCK', 'OUT_OF_STOCK', 'UNKNOWN'].includes(stockStatus)) {
      throw new ApiError('VALIDATION_FAILED', 'Status stok tidak valid.');
    }
    const condition = optionalText(input.condition, 'Kondisi', 40) || 'NEW';
    const partnerName = `Mitra ${affiliateUrl.hostname.replace(/^www\./, '')}`;
    const id = randomUUID();
    const slug = `${slugify(title)}-${id.slice(0, 8)}`;
    const inserted = await this.pool.query(
      `WITH partner AS (
         INSERT INTO ${this.schema}.ebelanja_partners (id, domain, name)
         VALUES ($1, $2, $3)
         ON CONFLICT (domain) DO UPDATE SET name = EXCLUDED.name
         RETURNING id
       ), product AS (
       INSERT INTO ${this.schema}.ebelanja_products (
         id, partner_id, title, slug, image_url, original_price, currency, stock_status,
         brand, category, subcategory, condition, source_description, owner_description,
         external_url, lifecycle_status, is_test
       ) SELECT
         $4, partner.id, $5, $6, $7, $8, 'IDR', $9,
         $10, $11, $12, $13, $14, $15,
         $16, 'PUBLISHED', false
       FROM partner
       RETURNING *
       ), media AS (
         INSERT INTO ${this.schema}.ebelanja_product_media (id, product_id, image_url, alt_text, sort_order)
         SELECT item.id, product.id, item.image_url, $5, item.position - 1
           FROM product
           CROSS JOIN UNNEST($17::uuid[], $18::text[]) WITH ORDINALITY AS item(id, image_url, position)
         ON CONFLICT (product_id, image_url) DO UPDATE SET
           alt_text = EXCLUDED.alt_text,
           sort_order = EXCLUDED.sort_order
       )
       SELECT * FROM product`,
      [
        randomUUID(),
        affiliateUrl.hostname.toLowerCase(),
        partnerName,
        id,
        title,
        slug,
        imageUrl,
        originalPrice,
        stockStatus,
        brand,
        category,
        subcategory,
        condition,
        sourceDescription,
        ownerDescription,
        affiliateUrl.toString(),
        mediaUrls.map(() => randomUUID()),
        mediaUrls,
      ],
    );
    if (!inserted.rows[0]) {
      throw new ApiError('INTERNAL_ERROR', 'Produk tidak dapat diterbitkan.');
    }
    return inserted.rows[0];
  }

  /**
   * L06: sinkron satu produk ke indeks Search.
   * Hanya PUBLISHED yang terindeks; DRAFT/ARCHIVED dinonaktifkan fail-closed.
   * Dipanggil lifecycle produk (publish/unpublish) — bukan oleh daftar baca.
   */
  async syncProductToSearch(productId: string): Promise<{ indexed: boolean }> {
    const row = await this.pool
      .query<{ id: string; title: string; slug: string; lifecycle_status: string }>(
        `SELECT id, title, slug, lifecycle_status FROM ${this.schema}.ebelanja_products WHERE id = $1`,
        [productId],
      )
      .then((r) => r.rows[0] ?? null);
    if (!row) return { indexed: false };
    const { SearchProjectionService } = await import('@/services/search-projection');
    const projector = new SearchProjectionService(this.pool, this.schema.replaceAll('"', ''));
    return projector.projectProduct({
      id: row.id,
      title: row.title,
      slug: row.slug,
      summary: row.title,
      published: row.lifecycle_status === 'PUBLISHED',
    });
  }
}

function requiredText(value: unknown, label: string, min: number, max: number) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text.length < min || text.length > max) {
    throw new ApiError('VALIDATION_FAILED', `${label} harus berisi ${min}–${max} karakter.`);
  }
  return text;
}

function optionalText(value: unknown, label: string, max: number) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text.length > max) throw new ApiError('VALIDATION_FAILED', `${label} maksimal ${max} karakter.`);
  return text;
}

function localProductImageUrl(value: unknown) {
  const imageUrl = typeof value === 'string' ? value.trim() : '';
  const uploaded = /^\/api\/v1\/ebelanja\/images\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i;
  const foundation = /^\/shop\/[a-z0-9-]+\.svg$/i;
  if (!uploaded.test(imageUrl) && !foundation.test(imageUrl)) {
    throw new ApiError('VALIDATION_FAILED', 'Foto produk harus berasal dari penyimpanan lokal Madevi.');
  }
  return imageUrl;
}

function uniqueMediaUrls(values: unknown[]) {
  const urls = [...new Set(values.map(localProductImageUrl))];
  if (urls.length < 1 || urls.length > 8) {
    throw new ApiError('VALIDATION_FAILED', 'Produk harus memiliki 1–8 foto lokal.');
  }
  return urls;
}

function normalizeQuestion(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('id-ID')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(value: string) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);
  return normalized || 'produk-madevi';
}

/** Tautan partner hanya disimpan sebagai tujuan navigasi browser; server lokal tidak
 * pernah mengambil URL ini. Host privat tetap ditolak agar tautan berbahaya tidak
 * masuk ke katalog. */
function isPrivateNetworkHost(value: string) {
  const host = value
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  const family = isIP(host);
  if (family === 4) {
    const [a, b] = host.split('.').map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  if (family === 6) {
    return (
      host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')
    );
  }
  return false;
}
