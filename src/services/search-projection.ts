import { randomUUID, createHash } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import {
  resolveSearchTarget,
  SEARCH_ENTRY_SPACE,
  type SearchProjectionInput,
} from '@/contracts/search';
import { quotedSchema } from '@/db/schema-name';

/**
 * UUID stabil dari string arbitrer (menu base memakai id slug seperti
 * `space-explore`, sedangkan kolom object_id bertipe uuid). Algoritma sama
 * dengan deterministicUuid taxonomy (sha256 + bit versi/varian).
 */
export function stableUuid(value: string): string {
  const bytes = Buffer.from(createHash('sha256').update(`madevi-search-v1\0${value}`).digest().subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * SearchProjectionService L06 — satu proyektor menulis/menonaktifkan indeks
 * memakai source_key idempoten dalam transaksi domain yang sama.
 *
 * - Article hanya diproyeksikan saat PUBLISHED + is_indexed; archive/trash/
 *   member-lock menonaktifkan atau membatasi payload.
 * - Social memakai author ID sebagai subject (bukan post ID sebagai principal).
 * - Katalog Services/Shop/Software hanya menulis entry bila record benar-benar
 *   published/visible dan route detailnya ada.
 * - Base menu ruang diproyeksikan dari kontrak navigation aktif;
 *   package node hanya masuk setelah record runtime package terbit.
 * - Entry lama tanpa metadata (space/target/subject) diperlakukan fail-closed
 *   oleh SearchService sampai direbuild resmi.
 */
export class SearchProjectionService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string,
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /**
   * Tulis/nonaktifkan satu entry indeks. Idempoten via source_key.
   * Target tidak valid → entry dinonaktifkan (fail-closed), bukan dibuang diam-diam.
   */
  async project(input: SearchProjectionInput, client?: PoolClient): Promise<{ indexed: boolean }> {
    const target = resolveSearchTarget(input.targetHref);
    const spaceKey = input.spaceKey ?? SEARCH_ENTRY_SPACE[input.entryType];
    const shouldIndex = input.indexed && target !== null;
    const exec = client ?? this.pool;
    const title = input.title.slice(0, 220) || 'Konten Madevi';
    const summary = input.summary.slice(0, 500);
    const body = input.searchableBody.slice(0, 100000);
    await exec.query(
      `INSERT INTO ${this.schema}.search_index_entries
         (id, entry_type, object_id, title, slug, summary, searchable_body,
          access_level, source_key, language, is_indexed, is_test,
          space_key, target_href, subject_principal_id, visibility, publication_state)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (source_key) DO UPDATE SET
         entry_type = EXCLUDED.entry_type,
         object_id = EXCLUDED.object_id,
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         summary = EXCLUDED.summary,
         searchable_body = EXCLUDED.searchable_body,
         access_level = EXCLUDED.access_level,
         language = EXCLUDED.language,
         is_indexed = EXCLUDED.is_indexed,
         space_key = EXCLUDED.space_key,
         target_href = EXCLUDED.target_href,
         subject_principal_id = EXCLUDED.subject_principal_id,
         visibility = EXCLUDED.visibility,
         publication_state = EXCLUDED.publication_state,
         updated_at = CURRENT_TIMESTAMP`,
      [
        randomUUID(),
        input.entryType,
        input.objectId,
        title,
        input.slug,
        summary,
        body,
        input.accessLevel,
        input.sourceKey,
        input.language ?? 'id',
        shouldIndex,
        input.isTest ?? false,
        spaceKey,
        target,
        input.subjectPrincipalId ?? null,
        input.visibility ?? (input.accessLevel === 'MEMBER' ? 'MEMBER' : 'PUBLIC'),
        input.publicationState ?? (shouldIndex ? 'PUBLISHED' : 'ARCHIVED'),
      ],
    );
    return { indexed: shouldIndex };
  }

  /** Nonaktifkan entry tanpa menghapus baris (archive/trash/lock/block). */
  async deindex(sourceKey: string, client?: PoolClient): Promise<void> {
    const exec = client ?? this.pool;
    await exec.query(
      `UPDATE ${this.schema}.search_index_entries
          SET is_indexed = false,
              visibility = CASE WHEN visibility = 'DRAFT' THEN 'DRAFT' ELSE visibility END,
              publication_state = 'ARCHIVED',
              updated_at = CURRENT_TIMESTAMP
        WHERE source_key = $1`,
      [sourceKey],
    );
  }

  // ---- Helper domain: ARTICLE ----

  /** Proyeksi artikel: hanya PUBLISHED + is_indexed yang boleh terindeks. */
  async projectArticle(
    row: {
      id: string;
      title: string;
      slug: string;
      summary: string;
      access_level: 'PUBLIC' | 'MEMBER';
      status: string;
      is_indexed: boolean;
      is_test?: boolean;
    },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    const publishable = row.status === 'PUBLISHED' && row.is_indexed === true;
    return this.project(
      {
        entryType: 'ARTICLE',
        objectId: row.id,
        sourceKey: `ARTICLE:${row.id}`,
        title: row.title,
        slug: row.slug,
        summary: row.summary ?? '',
        searchableBody: `${row.title}\n${row.summary ?? ''}`,
        accessLevel: row.access_level,
        spaceKey: 'explore',
        targetHref: `/artikel/${row.id}`,
        visibility: publishable ? row.access_level : 'DRAFT',
        publicationState: row.status === 'PUBLISHED' ? 'PUBLISHED' : 'ARCHIVED',
        indexed: publishable,
        isTest: row.is_test ?? false,
      },
      client,
    );
  }

  // ---- Helper domain: SERVICE / PRODUCT / SOFTWARE ----

  async projectServiceItem(
    row: { id: string; title: string; slug: string; summary: string; published: boolean; isTest?: boolean },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    return this.project(
      {
        entryType: 'SERVICE',
        objectId: row.id,
        sourceKey: `SERVICE:${row.id}`,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        searchableBody: `${row.title}\n${row.summary}`,
        accessLevel: 'PUBLIC',
        spaceKey: 'services',
        targetHref: `/jasa/${row.slug}`,
        visibility: row.published ? 'PUBLIC' : 'DRAFT',
        publicationState: row.published ? 'PUBLISHED' : 'ARCHIVED',
        indexed: row.published,
        isTest: row.isTest ?? false,
      },
      client,
    );
  }

  async projectProduct(
    row: { id: string; title: string; slug: string; summary: string; published: boolean; isTest?: boolean },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    return this.project(
      {
        entryType: 'PRODUCT',
        objectId: row.id,
        sourceKey: `PRODUCT:${row.id}`,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        searchableBody: `${row.title}\n${row.summary}`,
        accessLevel: 'PUBLIC',
        spaceKey: 'shop',
        targetHref: `/belanja/${row.id}`,
        visibility: row.published ? 'PUBLIC' : 'DRAFT',
        publicationState: row.published ? 'PUBLISHED' : 'ARCHIVED',
        indexed: row.published,
        isTest: row.isTest ?? false,
      },
      client,
    );
  }

  async projectSoftware(
    row: { id: string; name: string; slug: string; description: string; active: boolean; isTest?: boolean },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    return this.project(
      {
        entryType: 'SOFTWARE',
        objectId: row.id,
        sourceKey: `SOFTWARE:${row.id}`,
        title: row.name,
        slug: row.slug,
        summary: row.description.slice(0, 500),
        searchableBody: `${row.name}\n${row.description}`,
        accessLevel: 'PUBLIC',
        spaceKey: 'tools',
        targetHref: `/alat-bantu/${row.slug}`,
        visibility: row.active ? 'PUBLIC' : 'DRAFT',
        publicationState: row.active ? 'PUBLISHED' : 'ARCHIVED',
        indexed: row.active,
        isTest: row.isTest ?? false,
      },
      client,
    );
  }

  // ---- Helper domain: SOCIAL (author sebagai subject) ----

  async projectSocialPost(
    row: { id: string; body: string; authorId: string; indexable: boolean; isTest?: boolean },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    return this.project(
      {
        entryType: 'POST',
        objectId: row.id,
        sourceKey: `SOCIAL_POST:${row.id}`,
        title: row.body.slice(0, 220) || 'Posting Madevi Line',
        slug: `line/${row.id}`,
        summary: row.body.slice(0, 500),
        searchableBody: row.body,
        accessLevel: 'PUBLIC',
        spaceKey: 'line',
        targetHref: '/sosial',
        subjectPrincipalId: row.authorId,
        visibility: row.indexable ? 'PUBLIC' : 'DRAFT',
        publicationState: row.indexable ? 'PUBLISHED' : 'ARCHIVED',
        indexed: row.indexable,
        isTest: row.isTest ?? false,
      },
      client,
    );
  }

  // ---- Helper domain: MENU/PAGE base (ruang utama + brosur) ----

  async projectBaseMenu(
    row: { id: string; label: string; slug: string; href: string; space: 'explore' | 'tutorial' | 'school'; isTest?: boolean },
    client?: PoolClient,
  ): Promise<{ indexed: boolean }> {
    return this.project(
      {
        entryType: 'MENU',
        // id menu base berupa slug (space-explore); turunkan UUID stabil
        // karena kolom object_id bertipe uuid.
        objectId: stableUuid(`MENU:${row.id}`),
        sourceKey: `MENU:${row.id}`,
        title: row.label,
        slug: row.slug,
        summary: row.label,
        searchableBody: row.label,
        accessLevel: 'PUBLIC',
        spaceKey: row.space,
        targetHref: row.href,
        visibility: 'PUBLIC',
        publicationState: 'PUBLISHED',
        indexed: true,
        isTest: row.isTest ?? false,
      },
      client,
    );
  }
}
