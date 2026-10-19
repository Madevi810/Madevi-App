import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import type { Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';

import {
  resolveSearchTarget,
  SEARCH_ENTRY_SPACE,
  type SearchSpaceKey,
} from '@/contracts/search';

export type SearchEntryType =
  | 'MENU'
  | 'ARTICLE'
  | 'PROFILE'
  | 'SOFTWARE'
  | 'PAGE'
  | 'SERVICE'
  | 'PRODUCT'
  | 'POST';

export interface SearchResultItem {
  entryType: SearchEntryType;
  objectId: string;
  title: string;
  slug: string;
  summary: string;
  accessLevel: 'PUBLIC' | 'MEMBER';
  snippet: string;
  /** L06: ruang kanonis; null hanya untuk entry legacy pra-0031. */
  spaceKey: SearchSpaceKey | null;
  /** L06: deep-link kanonis tervalidasi server; UI wajib memakai ini. */
  targetHref: string;
  subjectPrincipalId: string | null;
}

export interface SearchInput {
  query: string;
  categories?: SearchEntryType[];
  /** L06: filter ruang kanonis. */
  spaces?: SearchSpaceKey[];
  cursor?: string;
  limit?: number;
}

export interface SearchResult {
  items: SearchResultItem[];
  nextCursor: string | null;
  total: number;
}

const ALLOWED_TYPES: SearchEntryType[] = [
  'MENU',
  'ARTICLE',
  'PROFILE',
  'SOFTWARE',
  'PAGE',
  'SERVICE',
  'PRODUCT',
  'POST',
];

// Sinonim ringan Indonesia/Inggris + perbaikan typo sederhana (tanpa engine eksternal).
const SYNONYMS: Record<string, string[]> = {
  beranda: ['home', 'menu'],
  belanja: ['shop', 'store', 'beli', 'produk', 'hardware', 'komponen'],
  belajar: ['learning', 'kursus', 'learn', 'sekolah', 'materi'],
  artikel: ['article', 'articles', 'tulisan', 'panduan'],
  software: ['aplikasi', 'app', 'software', 'tools', 'alat', 'kalkulator'],
  jasa: ['service', 'services', 'layanan', 'desain', 'undangan', 'logo', 'pcb', 'layout'],
  sosial: ['line', 'social', 'komunitas', 'profil', 'postingan'],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class SearchError extends Error {
  constructor(
    public readonly code: 'NOT_FOUND' | 'FORBIDDEN' | 'VALIDATION_FAILED' | 'INVALID_TRANSITION',
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = 'SearchError';
  }
}

export class SearchService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  private encodeCursor(ts: string, id: string): string {
    return Buffer.from(JSON.stringify({ ts, id }), 'utf8').toString('base64url');
  }

  private decodeCursor(cursor: string): { ts: string; id: string } {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as Record<
        string,
        unknown
      >;
    } catch {
      throw new SearchError('VALIDATION_FAILED', 'Cursor pencarian tidak valid', 400);
    }
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      typeof parsed.ts !== 'string' ||
      Number.isNaN(Date.parse(parsed.ts)) ||
      typeof parsed.id !== 'string' ||
      !uuid.test(parsed.id)
    ) {
      throw new SearchError('VALIDATION_FAILED', 'Cursor pencarian tidak valid', 400);
    }
    return { ts: parsed.ts, id: parsed.id };
  }

  /**
   * D08: grup istilah per kata (kata + sinonimnya). Antar-grup bersifat AND
   * (semua kata harus cocok di salah satu kolom) agar kueri sampah tidak
   * mengembalikan hasil parsial; dalam grup bersifat OR (sinonim/typo).
   */
  private expandTermGroups(query: string): string[][] {
    const words = normalize(query).split(' ').filter(Boolean);
    return words.map((word) => {
      const group = new Set<string>([word]);
      for (const [key, syns] of Object.entries(SYNONYMS)) {
        if (word === key) syns.forEach((s) => group.add(s));
      }
      return [...group];
    });
  }

  async search(principal: Principal | null, input: SearchInput): Promise<SearchResult> {
    const query = input.query.trim();
    if (query.length < 2 || query.length > 200) {
      throw new SearchError('VALIDATION_FAILED', 'Kueri pencarian harus 2–200 karakter', 400);
    }
    const categories = input.categories?.filter((c) => ALLOWED_TYPES.includes(c)) ?? ALLOWED_TYPES;
    if (categories.length === 0) {
      throw new SearchError('VALIDATION_FAILED', 'Kategori tidak valid', 400);
    }
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const spaces = (input.spaces ?? []).filter((s) =>
      ['explore', 'school', 'line', 'services', 'shop', 'tools'].includes(s),
    );

    const groups = this.expandTermGroups(query);
    // $g1..$gN: pola ILIKE per grup kata, lalu kategori; filter hak,
    // fixture, cursor, dan limit menyusul dengan indeks dinamis.
    const params: unknown[] = [];
    const matchConds: string[] = [];
    for (const group of groups) {
      params.push(group.map((t) => `%${t}%`));
      const g = params.length;
      matchConds.push(
        `(title ILIKE ANY($${g}) OR summary ILIKE ANY($${g}) OR searchable_body ILIKE ANY($${g}))`,
      );
    }
    const matchCond = `AND (${matchConds.join(' AND ')})`;
    params.push(categories);
    const categoriesIdx = params.length;
    // Hak baca (cermin ArticleReadPolicy): MEMBER hanya untuk login + APPROVED + entitlement.
    const canReadMember =
      principal !== null &&
      principal.approvalStatus === 'APPROVED' &&
      (principal.entitlementStatus !== 'NONE' || principal.role === 'OWNER');
    let accessCond = '';
    if (!canReadMember) {
      accessCond = `AND access_level = 'PUBLIC'`;
    }

    // Filter privasi sosial L06: pakai subject_principal_id (author) bila ada,
    // fallback ke object_id untuk entry legacy pra-0031 (POST lama menyimpan
    // post ID sebagai object_id). PROFILE/POST dari pasangan block disembunyikan.
    let blockCond = '';
    let legacyBlock = '';
    let pIdx = 0;
    if (principal) {
      params.push(principal.id);
      pIdx = params.length;
      blockCond = `AND NOT (
        entry_type IN ('PROFILE', 'POST') AND EXISTS (
          SELECT 1 FROM ${this.schema}.social_blocks sb
          WHERE (sb.blocker_principal_id = $${pIdx} AND sb.blocked_principal_id = COALESCE(subject_principal_id, object_id))
             OR (sb.blocker_principal_id = COALESCE(subject_principal_id, object_id) AND sb.blocked_principal_id = $${pIdx})
        )
      )`;
      // Varian pra-0031: tanpa subject_principal_id (kolom belum ada).
      legacyBlock = `AND NOT (
        entry_type IN ('PROFILE', 'POST') AND EXISTS (
          SELECT 1 FROM ${this.schema}.social_blocks sb
          WHERE (sb.blocker_principal_id = $${pIdx} AND sb.blocked_principal_id = object_id)
             OR (sb.blocker_principal_id = object_id AND sb.blocked_principal_id = $${pIdx})
        )
      )`;
    }

    // L06: School lock tidak dilewati via snippet — entry ARTICLE MEMBER hanya
    // untuk principal ber-entitlement (accessCond di atas). Draft/private tidak
    // pernah terindeks (is_indexed=false di proyektor), ditambah guard di sini
    // agar entry legacy yang lolos tetap tertutup bila kolom baru tersedia.
    let spaceCond = '';
    if (spaces.length > 0) {
      params.push(spaces);
      spaceCond = `AND space_key = ANY($${params.length})`;
    }

    // Entri uji (is_test) hanya terlihat oleh principal fixture; pengguna
    // nyata tidak pernah melihat data simulasi.
    params.push(principal?.fixture === true);
    const fixtureIdx = params.length;
    const testCond = `AND (is_test = false OR $${fixtureIdx} = true)`;

    let cursorCond = '';
    if (input.cursor !== undefined) {
      const cursor = this.decodeCursor(input.cursor);
      params.push(cursor.ts, cursor.id);
      cursorCond = `AND (updated_at, id) < ($${params.length - 1}::timestamptz, $${params.length}::uuid)`;
    }
    params.push(limit);

    type SearchRow = {
      id: string;
      entry_type: SearchEntryType;
      object_id: string;
      title: string;
      slug: string;
      summary: string;
      access_level: 'PUBLIC' | 'MEMBER';
      updated_at: Date;
      space_key: string | null;
      target_href: string | null;
      subject_principal_id: string | null;
    };

    // L06: baca metadata baru (0031) bila tersedia; fallback ke skema lama
    // pra-0031 agar instalasi yang belum migrasi tetap berfungsi (target
    // dihitung server-side dari pola kanonis, bukan ditebak klien).
    let rawRows: SearchRow[];
    try {
      const rows = await this.pool.query<SearchRow>(
        `SELECT id, entry_type, object_id, title, slug, summary, access_level, updated_at,
                space_key, target_href, subject_principal_id
           FROM ${this.schema}.search_index_entries
          WHERE is_indexed
            AND entry_type = ANY($${categoriesIdx})
            ${testCond}
            ${accessCond}
            ${blockCond}
            ${spaceCond}
            ${matchCond}
            ${cursorCond}
          ORDER BY updated_at DESC, id DESC
          LIMIT $${params.length}`,
        params,
      );
      rawRows = rows.rows;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const missingColumn =
        msg.includes('space_key') ||
        msg.includes('target_href') ||
        msg.includes('subject_principal_id');
      if (!missingColumn) throw err;
      // Fallback pra-0031: tanpa filter space (kolom belum ada).
      // Block tetap ditegakkan via object_id (semantik L05) agar instalasi
      // lama tidak membuka data pasangan block.
      const fallback = await this.pool.query<{
        id: string;
        entry_type: SearchEntryType;
        object_id: string;
        title: string;
        slug: string;
        summary: string;
        access_level: 'PUBLIC' | 'MEMBER';
        updated_at: Date;
      }>(
        `SELECT id, entry_type, object_id, title, slug, summary, access_level, updated_at
           FROM ${this.schema}.search_index_entries
          WHERE is_indexed
            AND entry_type = ANY($${categoriesIdx})
            ${testCond}
            ${accessCond}
            ${legacyBlock}
            ${matchCond}
            ${cursorCond}
          ORDER BY updated_at DESC, id DESC
          LIMIT $${params.length}`,
        params,
      );
      rawRows = fallback.rows.map((r) => ({
        ...r,
        space_key: null,
        target_href: null,
        subject_principal_id: null,
      }));
    }

    const items: SearchResultItem[] = [];
    for (const row of rawRows) {
      // Fail-closed: entry tanpa target valid tidak dirender sebagai link akses.
      const stored = resolveSearchTarget(row.target_href);
      const computed = stored ?? this.fallbackTarget(row);
      if (!computed) continue;
      items.push({
        entryType: row.entry_type,
        objectId: row.object_id,
        // Kontrak API selalu teks mentah. Highlight dilakukan React sebagai node
        // ter-escape, bukan menyisipkan HTML dari indeks pencarian.
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        accessLevel: row.access_level,
        snippet: row.summary || row.title,
        spaceKey: (row.space_key as SearchSpaceKey | null) ?? SEARCH_ENTRY_SPACE[row.entry_type] ?? null,
        targetHref: computed,
        subjectPrincipalId: row.subject_principal_id,
      });
    }

    const last = rawRows[rawRows.length - 1];
    const nextCursor =
      rawRows.length === limit && last
        ? this.encodeCursor(new Date(last.updated_at).toISOString(), last.id)
        : null;

    return { items, nextCursor, total: items.length };
  }

  /**
   * L06: fallback target server-side untuk entry legacy pra-0031.
   * Hanya pola kanonis yang dikenal; sub-menu bukan route ruang
   * (mis. brosur-program) diarahkan ke route kanonisnya.
   */
  private fallbackTarget(row: {
    entry_type: SearchEntryType;
    object_id: string;
    slug: string;
  }): string | null {
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    switch (row.entry_type) {
      case 'ARTICLE':
        if (uuid.test(row.object_id)) return `/artikel/${row.object_id}`;
        return resolveSearchTarget(`/artikel/${row.slug}`);
      case 'MENU': {
        if (row.slug === 'brosur-program' || row.slug === 'brosur-sekolah') return '/brosur-sekolah';
        return resolveSearchTarget(`/ruang/${row.slug}`);
      }
      case 'PROFILE':
        return resolveSearchTarget(`/profil/${row.slug}`);
      case 'SOFTWARE':
        return resolveSearchTarget(`/alat-bantu/${row.slug}`);
      case 'PAGE':
        return resolveSearchTarget(`/${row.slug}`);
      case 'SERVICE':
        return '/jasa';
      case 'PRODUCT':
        if (uuid.test(row.object_id)) return `/belanja/${row.object_id}`;
        return '/belanja';
      case 'POST':
        return '/sosial';
      default:
        return null;
    }
  }

  async enqueueIndexJob(input: {
    entryType: SearchEntryType;
    objectId: string;
    action: 'UPSERT' | 'DELETE';
    idempotencyKey: string;
    isTest?: boolean;
  }) {
    const id = randomUUID();
    const inserted = await this.pool.query<{ id: string }>(
      `INSERT INTO ${this.schema}.search_index_jobs
         (id, entry_type, object_id, action, idempotency_key, is_test)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (idempotency_key) DO NOTHING
       RETURNING id`,
      [
        id,
        input.entryType,
        input.objectId,
        input.action,
        input.idempotencyKey,
        input.isTest ?? false,
      ],
    );
    // Idempoten: kembalikan id BARU bila tersisip, atau id LAMA bila key
    // sudah ada (bukan UUID acak baru setiap panggilan).
    if (inserted.rows[0]) return { jobId: inserted.rows[0].id };
    const existing = await this.pool.query<{ id: string }>(
      `SELECT id FROM ${this.schema}.search_index_jobs WHERE idempotency_key = $1`,
      [input.idempotencyKey],
    );
    return { jobId: existing.rows[0]?.id ?? id };
  }

  // Retur total terindeks per jenis untuk dashboard/report.
  async upsize(entryType: SearchEntryType): Promise<{
    entryType: SearchEntryType;
    objectId: string;
    title: string;
    slug: string;
  } | null> {
    const res = await this.pool.query<{
      entry_type: SearchEntryType;
      object_id: string;
      title: string;
      slug: string;
    }>(
      `SELECT entry_type, object_id, title, slug
         FROM ${this.schema}.search_index_entries
        WHERE entry_type = $1 AND is_indexed
        ORDER BY updated_at DESC LIMIT 1`,
      [entryType],
    );
    const row = res.rows[0];
    if (!row) return null;
    return { entryType: row.entry_type, objectId: row.object_id, title: row.title, slug: row.slug };
  }
}
