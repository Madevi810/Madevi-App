import { randomUUID } from 'node:crypto';

import type { Pool, PoolClient } from 'pg';

import type { ModerationDecision, Principal } from '@/contracts/services';
import { LocalModerationEngine, ModerationService } from '@/services/moderation';

// ============================================================
// TIPE DOMAIN ARTIKEL
// ============================================================

export type ArticleStatus =
  | 'DRAFT'
  | 'AUTO_CHECK'
  | 'AWAITING_OWNER'
  | 'NEEDS_REVISION'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'TRASH';

export type AccessLevel = 'PUBLIC' | 'MEMBER';
export type AttributionType = 'DEVELOPED_BY' | 'COMPILED_FROM' | 'COLLABORATED';
export type BlockType =
  | 'HEADING'
  | 'PARAGRAPH'
  | 'LIST'
  | 'IMAGE'
  | 'TABLE'
  | 'FORMULA'
  | 'CODE'
  | 'QUOTE'
  | 'NOTE'
  | 'WARNING'
  | 'EXAMPLE'
  | 'STEP'
  | 'VIDEO'
  | 'LINK';

export type IssueType = 'FACTUAL' | 'TYPO' | 'OUTDATED' | 'BROKEN_LINK' | 'OTHER';
export type SourceType =
  | 'INSTITUTION'
  | 'STANDARD'
  | 'JOURNAL'
  | 'BOOK'
  | 'UNIVERSITY'
  | 'OFFICIAL_DOC'
  | 'WEBSITE'
  | 'OTHER';

export interface ArticleRow {
  id: string;
  business_code: string;
  taxonomy_node_id: string | null;
  title: string;
  slug: string;
  summary: string;
  language: 'id' | 'en';
  reading_minutes: number;
  creator_name: string | null;
  creator_principal_id: string | null;
  access_level: AccessLevel;
  is_indexed: boolean;
  status: ArticleStatus;
  published_at: Date | null;
  scheduled_at: Date | null;
  archived_at: Date | null;
  trash_at: Date | null;
  purge_after: Date | null;
  owner_notes: string;
  attribution_type: AttributionType;
  version: number;
  is_test: boolean;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateArticleInput {
  taxonomyNodeId?: string;
  title: string;
  slug: string;
  summary?: string;
  language?: 'id' | 'en';
  readingMinutes?: number;
  creatorName?: string;
  creatorPrincipalId?: string;
  accessLevel?: AccessLevel;
  isIndexed?: boolean;
  ownerNotes?: string;
  attributionType?: AttributionType;
  isTest?: boolean;
}

export interface UpdateArticleInput {
  taxonomyNodeId?: string | null;
  title?: string;
  slug?: string;
  summary?: string;
  language?: 'id' | 'en';
  readingMinutes?: number;
  creatorName?: string | null;
  creatorPrincipalId?: string | null;
  accessLevel?: AccessLevel;
  isIndexed?: boolean;
  ownerNotes?: string;
  attributionType?: AttributionType;
}

export interface ArticleBlock {
  id: string;
  articleId: string;
  blockType: BlockType;
  position: number;
  content: Record<string, unknown>;
  storageObjectId: string | null;
  caption: string | null;
}

export interface ArticleSource {
  id: string;
  articleId: string;
  position: number;
  title: string;
  authorOrOrg: string;
  publisher: string;
  publicationDate: string | null;
  accessedDate: string | null;
  url: string | null;
  isbn: string | null;
  doi: string | null;
  documentNumber: string | null;
  sectionReference: string;
  mediaLicense: string;
  sourceType: SourceType;
  linkStatus: 'ACTIVE' | 'DEAD' | 'PAYWALLED' | 'PENDING_REVIEW';
  isPrimary: boolean;
}

export interface ArticleSuggestion {
  id: string;
  principalId: string;
  topic: string;
  reason: string;
  sourcesNote: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  supportCount: number;
  idempotencyKey: string;
}

export interface ArticleCorrection {
  id: string;
  articleId: string;
  principalId: string;
  locationHint: string;
  issueType: IssueType;
  description: string;
  suggestion: string;
  sourceReference: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  idempotencyKey: string;
}

export interface QuestionBank {
  id: string;
  articleId: string;
  language: 'id' | 'en';
  version: number;
  status: 'DRAFT' | 'VALIDATED' | 'SUPERSEDED';
}

export interface QuestionMC {
  id: string;
  bankId: string;
  position: number;
  stem: string;
  options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }>;
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuestionEssay {
  id: string;
  bankId: string;
  position: number;
  stem: string;
  rubric: string;
  maxScore: number;
}

// Kesalahan bisnis
export class ArticleError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = 'ArticleError';
  }
}

// ============================================================
// ARTICLE READ POLICY — implementasi kontrak ArticleReadPolicy
// ============================================================

export class ArticleReadPolicyImpl {
  constructor(
    private readonly pool: Pool,
    private readonly schema: string,
  ) {}

  async decide(input: {
    principal: Principal | null;
    articleId: string;
  }): Promise<{ allowed: boolean; reason: string }> {
    const row = await this.pool
      .query<{ access_level: AccessLevel; status: ArticleStatus }>(
        `SELECT access_level, status FROM "${this.schema}".articles WHERE id = $1`,
        [input.articleId],
      )
      .then((r) => r.rows[0] ?? null);

    if (!row) return { allowed: false, reason: 'NOT_FOUND' };
    if (row.status !== 'PUBLISHED') {
      // Hanya Admin boleh baca non-terbit
      if (input.principal?.role !== 'OWNER') {
        return { allowed: false, reason: 'NOT_PUBLISHED' };
      }
    }
    if (row.access_level === 'PUBLIC') return { allowed: true, reason: 'PUBLIC' };

    // MEMBER: wajib login, disetujui, dan punya entitlement
    if (!input.principal) return { allowed: false, reason: 'LOGIN_REQUIRED' };
    if (input.principal.approvalStatus !== 'APPROVED')
      return { allowed: false, reason: 'NOT_APPROVED' };
    if (input.principal.entitlementStatus === 'NONE' && input.principal.role !== 'OWNER')
      return { allowed: false, reason: 'ENTITLEMENT_REQUIRED' };

    return { allowed: true, reason: 'MEMBER' };
  }
}

// ============================================================
// ARTICLE SERVICE
// ============================================================

export class ArticleService {
  private readonly moderation: ModerationService;

  constructor(
    private readonly pool: Pool,
    private readonly schema: string,
    moderator: ModerationDecision = new LocalModerationEngine(),
  ) {
    this.moderation = new ModerationService(pool, schema, moderator);
  }

  // ----------------------------------------------------------
  // BUAT DRAF ARTIKEL BARU (hanya Admin)
  // ----------------------------------------------------------
  async createDraft(principal: Principal, input: CreateArticleInput): Promise<ArticleRow> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat membuat artikel', 403);
    }
    this.validateSlug(input.slug);
    this.validateTitle(input.title);
    await this.assertTaxonomyPlacementIsJ(input.taxonomyNodeId);

    const id = randomUUID();
    const businessCode = `ART-${id.slice(0, 8).toUpperCase()}`;

    const result = await this.pool.query<ArticleRow>(
      `INSERT INTO "${this.schema}".articles
         (id, business_code, taxonomy_node_id, title, slug, summary, language,
          reading_minutes, creator_name, creator_principal_id, access_level,
          is_indexed, status, owner_notes, attribution_type, is_test,
          created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'DRAFT',$13,$14,$15,$16,$16)
       RETURNING *`,
      [
        id,
        businessCode,
        input.taxonomyNodeId ?? null,
        input.title,
        input.slug,
        input.summary ?? '',
        input.language ?? 'id',
        input.readingMinutes ?? 5,
        input.creatorName ?? null,
        input.creatorPrincipalId ?? null,
        input.accessLevel ?? 'MEMBER',
        input.isIndexed ?? true,
        input.ownerNotes ?? '',
        input.attributionType ?? 'DEVELOPED_BY',
        input.isTest ?? false,
        principal.id,
      ],
    );
    return result.rows[0]!;
  }

  // ----------------------------------------------------------
  // BACA ARTIKEL (dengan policy cek)
  // ----------------------------------------------------------
  async getPublicMetadata(
    articleId: string,
  ): Promise<
    Pick<
      ArticleRow,
      | 'id'
      | 'title'
      | 'slug'
      | 'summary'
      | 'language'
      | 'reading_minutes'
      | 'creator_name'
      | 'access_level'
      | 'is_indexed'
      | 'status'
      | 'published_at'
      | 'updated_at'
    >
  > {
    const result = await this.pool.query<
      Pick<
        ArticleRow,
        | 'id'
        | 'title'
        | 'slug'
        | 'summary'
        | 'language'
        | 'reading_minutes'
        | 'creator_name'
        | 'access_level'
        | 'is_indexed'
        | 'status'
        | 'published_at'
        | 'updated_at'
      >
    >(
      `SELECT id, title, slug, summary, language, reading_minutes, creator_name,
              access_level, is_indexed, status, published_at, updated_at
         FROM "${this.schema}".articles
        WHERE id = $1 AND status IN ('PUBLISHED', 'SCHEDULED') AND is_indexed = true`,
      [articleId],
    );
    const article = result.rows[0];
    if (!article) throw new ArticleError('NOT_FOUND', 'Artikel tidak ditemukan', 404);
    return article;
  }

  async getArticle(
    principal: Principal | null,
    articleId: string,
  ): Promise<{ article: ArticleRow; blocks: ArticleBlock[]; sources: ArticleSource[] }> {
    const policy = new ArticleReadPolicyImpl(this.pool, this.schema);
    const decision = await policy.decide({ principal, articleId });
    if (!decision.allowed) {
      const status = decision.reason === 'NOT_FOUND' ? 404 : 403;
      throw new ArticleError('ACCESS_DENIED', decision.reason, status);
    }

    const [articleResult, blocksResult, sourcesResult] = await Promise.all([
      this.pool.query<ArticleRow>(`SELECT * FROM "${this.schema}".articles WHERE id = $1`, [
        articleId,
      ]),
      this.pool.query<{
        id: string;
        article_id: string;
        block_type: BlockType;
        position: number;
        content: Record<string, unknown>;
        storage_object_id: string | null;
        caption: string | null;
      }>(
        `SELECT id, article_id, block_type, position, content, storage_object_id, caption
           FROM "${this.schema}".article_blocks
          WHERE article_id = $1
          ORDER BY position`,
        [articleId],
      ),
      this.pool.query<{
        id: string;
        article_id: string;
        position: number;
        title: string;
        author_or_org: string;
        publisher: string;
        publication_date: string | null;
        accessed_date: string | null;
        url: string | null;
        isbn: string | null;
        doi: string | null;
        document_number: string | null;
        section_reference: string;
        media_license: string;
        source_type: SourceType;
        link_status: 'ACTIVE' | 'DEAD' | 'PAYWALLED' | 'PENDING_REVIEW';
        is_primary: boolean;
      }>(
        `SELECT id, article_id, position, title, author_or_org, publisher,
                publication_date, accessed_date, url, isbn, doi, document_number,
                section_reference, media_license, source_type, link_status, is_primary
           FROM "${this.schema}".article_sources
          WHERE article_id = $1
          ORDER BY position`,
        [articleId],
      ),
    ]);

    const article = articleResult.rows[0];
    if (!article) throw new ArticleError('NOT_FOUND', 'Artikel tidak ditemukan', 404);

    const blocks: ArticleBlock[] = blocksResult.rows.map((r) => ({
      id: r.id,
      articleId: r.article_id,
      blockType: r.block_type,
      position: r.position,
      content: r.content,
      storageObjectId: r.storage_object_id,
      caption: r.caption,
    }));

    const sources: ArticleSource[] = sourcesResult.rows.map((r) => ({
      id: r.id,
      articleId: r.article_id,
      position: r.position,
      title: r.title,
      authorOrOrg: r.author_or_org,
      publisher: r.publisher,
      publicationDate: r.publication_date,
      accessedDate: r.accessed_date,
      url: r.url,
      isbn: r.isbn,
      doi: r.doi,
      documentNumber: r.document_number,
      sectionReference: r.section_reference,
      mediaLicense: r.media_license,
      sourceType: r.source_type,
      linkStatus: r.link_status,
      isPrimary: r.is_primary,
    }));

    return { article, blocks, sources };
  }

  // ----------------------------------------------------------
  // UPDATE METADATA ARTIKEL (hanya Admin, artikel bukan TRASH)
  // Artikel PUBLISHED: otomatis buat draf revisi, jangan ubah langsung
  // ----------------------------------------------------------
  async updateArticle(
    principal: Principal,
    articleId: string,
    input: UpdateArticleInput,
  ): Promise<ArticleRow> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat mengubah artikel', 403);
    }

    const existing = await this.pool
      .query<ArticleRow>(`SELECT * FROM "${this.schema}".articles WHERE id = $1`, [articleId])
      .then((r) => r.rows[0] ?? null);
    if (!existing) throw new ArticleError('NOT_FOUND', 'Artikel tidak ditemukan', 404);
    if (existing.status === 'TRASH')
      throw new ArticleError('INVALID_STATUS', 'Artikel di sampah tidak dapat diubah', 400);

    if (existing.status === 'PUBLISHED') {
      // Buat draf revisi; jangan ubah artikel aktif
      await this.createRevisionDraft(principal, existing, input);
      return existing; // kembalikan artikel aktif yang tidak berubah
    }

    if (input.slug) this.validateSlug(input.slug);
    if (input.title) this.validateTitle(input.title);
    if (input.taxonomyNodeId !== undefined) {
      await this.assertTaxonomyPlacementIsJ(input.taxonomyNodeId);
    }

    const result = await this.pool.query<ArticleRow>(
      `UPDATE "${this.schema}".articles
          SET taxonomy_node_id    = COALESCE($3, taxonomy_node_id),
              title               = COALESCE($4, title),
              slug                = COALESCE($5, slug),
              summary             = COALESCE($6, summary),
              language            = COALESCE($7, language),
              reading_minutes     = COALESCE($8, reading_minutes),
              creator_name        = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE creator_name END,
              creator_principal_id= CASE WHEN $10::uuid IS NOT NULL THEN $10 ELSE creator_principal_id END,
              access_level        = COALESCE($11, access_level),
              is_indexed          = COALESCE($12, is_indexed),
              owner_notes         = COALESCE($13, owner_notes),
              attribution_type    = COALESCE($14, attribution_type),
              updated_by          = $2,
              updated_at          = CURRENT_TIMESTAMP,
              version             = version + 1
        WHERE id = $1
        RETURNING *`,
      [
        articleId,
        principal.id,
        input.taxonomyNodeId,
        input.title,
        input.slug,
        input.summary,
        input.language,
        input.readingMinutes,
        input.creatorName,
        input.creatorPrincipalId,
        input.accessLevel,
        input.isIndexed,
        input.ownerNotes,
        input.attributionType,
      ],
    );
    return result.rows[0]!;
  }

  // ----------------------------------------------------------
  // LIFECYCLE TRANSITIONS (hanya Admin)
  // ----------------------------------------------------------
  async transitionStatus(
    principal: Principal,
    articleId: string,
    targetStatus: ArticleStatus,
    options?: { scheduledAt?: Date; revisionNotes?: string },
  ): Promise<ArticleRow> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat mengubah status artikel', 403);
    }

    const existing = await this.pool
      .query<ArticleRow>(`SELECT * FROM "${this.schema}".articles WHERE id = $1`, [articleId])
      .then((r) => r.rows[0] ?? null);
    if (!existing) throw new ArticleError('NOT_FOUND', 'Artikel tidak ditemukan', 404);

    this.assertTransitionAllowed(existing.status, targetStatus);

    const now = new Date();
    let publishedAt: Date | null = existing.published_at;
    let scheduledAt: Date | null = existing.scheduled_at;
    let archivedAt: Date | null = existing.archived_at;
    let trashAt: Date | null = existing.trash_at;
    // K-24: sampah artikel di-purge 30 hari setelah trash.
    let purgeAfter: Date | null = existing.purge_after ?? null;

    if (targetStatus === 'PUBLISHED') publishedAt = now;
    if (targetStatus === 'SCHEDULED') scheduledAt = options?.scheduledAt ?? null;
    if (targetStatus === 'ARCHIVED') archivedAt = now;
    if (targetStatus === 'TRASH') {
      trashAt = now;
      purgeAfter = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const result = await this.pool.query<ArticleRow>(
      `UPDATE "${this.schema}".articles
          SET status       = $2,
              published_at = $3,
              scheduled_at = $4,
              archived_at  = $5,
              trash_at     = $6,
              purge_after  = $7,
              updated_by   = $8,
              updated_at   = CURRENT_TIMESTAMP,
              version      = version + 1
        WHERE id = $1
        RETURNING *`,
      [
        articleId,
        targetStatus,
        publishedAt,
        scheduledAt,
        archivedAt,
        trashAt,
        purgeAfter,
        principal.id,
      ],
    );
    const updated = result.rows[0]!;
    // L06: sinkron proyeksi Search dalam lifecycle yang sama.
    // PUBLISHED + is_indexed → terindeks; selain itu dinonaktifkan fail-closed.
    // Bypass bila kolom 0031 belum ada (instalasi pra-migrasi): SearchService
    // tetap fail-closed via fallback, index lama tidak dihapus diam-diam.
    try {
      const { SearchProjectionService } = await import('@/services/search-projection');
      const projector = new SearchProjectionService(this.pool, this.schema);
      await projector.projectArticle({
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        summary: updated.summary ?? '',
        access_level: updated.access_level,
        status: updated.status,
        is_indexed: updated.is_indexed,
        is_test: updated.is_test,
      });
    } catch {
      // Proyeksi best-effort; status artikel tetap sah. Auditor memverifikasi
      // entry via pemeriksaan statis + uji Admin (matriks publish/archive).
    }
    return updated;
  }

  // ----------------------------------------------------------
  // AUTO CHECK — periksa kelengkapan sebelum ke Admin
  // ----------------------------------------------------------
  async runAutoCheck(
    principal: Principal,
    articleId: string,
  ): Promise<{
    passed: boolean;
    issues: string[];
    checks: {
      source: boolean;
      blocks: boolean;
      quiz: boolean;
      links: boolean;
    };
  }> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat menjalankan auto-check', 403);
    }

    const article = await this.pool
      .query<ArticleRow>(`SELECT * FROM "${this.schema}".articles WHERE id = $1`, [articleId])
      .then((r) => r.rows[0] ?? null);
    if (!article) throw new ArticleError('NOT_FOUND', 'Artikel tidak ditemukan', 404);

    const [sourceCount, blockCount, bankCount, deadLinkCount] = await Promise.all([
      this.pool
        .query<{ c: string }>(
          `SELECT COUNT(*) c FROM "${this.schema}".article_sources WHERE article_id=$1 AND is_primary=true`,
          [articleId],
        )
        .then((r) => Number(r.rows[0]?.c ?? 0)),
      this.pool
        .query<{ c: string }>(
          `SELECT COUNT(*) c FROM "${this.schema}".article_blocks WHERE article_id=$1`,
          [articleId],
        )
        .then((r) => Number(r.rows[0]?.c ?? 0)),
      this.pool
        .query<{ c: string }>(
          `SELECT COUNT(*) c FROM "${this.schema}".question_banks WHERE article_id=$1 AND status='VALIDATED'`,
          [articleId],
        )
        .then((r) => Number(r.rows[0]?.c ?? 0)),
      this.pool
        .query<{ c: string }>(
          `SELECT COUNT(*) c FROM "${this.schema}".article_sources WHERE article_id=$1 AND link_status='DEAD'`,
          [articleId],
        )
        .then((r) => Number(r.rows[0]?.c ?? 0)),
    ]);

    const checks = {
      source: sourceCount >= 1,
      blocks: blockCount >= 1,
      quiz: bankCount >= 1,
      links: deadLinkCount === 0,
    };
    const issues: string[] = [];
    if (!checks.source) issues.push('Minimal satu sumber utama diperlukan');
    if (!checks.blocks) issues.push('Artikel harus memiliki minimal satu blok konten');
    if (!checks.quiz) issues.push('Bank soal tervalidasi diperlukan sebelum terbit');
    if (!checks.links) issues.push('Terdapat sumber dengan link mati yang perlu ditinjau');

    const passed = issues.length === 0;
    const checkId = randomUUID();

    await this.pool.query(
      `INSERT INTO "${this.schema}".article_auto_checks
         (id, article_id, passed, issues, check_source_ok, check_blocks_ok, check_quiz_ok, check_links_ok)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        checkId,
        articleId,
        passed,
        JSON.stringify(issues),
        checks.source,
        checks.blocks,
        checks.quiz,
        checks.links,
      ],
    );

    // Transisi ke AWAITING_OWNER jika lulus (termasuk dari AUTO_CHECK yang
    // sebelumnya gagal — jika tidak, artikel gagal-pertama terjebak selamanya).
    if (
      article.status === 'DRAFT' ||
      article.status === 'NEEDS_REVISION' ||
      article.status === 'AUTO_CHECK'
    ) {
      if (passed) {
        await this.pool.query(
          `UPDATE "${this.schema}".articles SET status='AWAITING_OWNER', updated_at=CURRENT_TIMESTAMP WHERE id=$1`,
          [articleId],
        );
      } else {
        await this.pool.query(
          `UPDATE "${this.schema}".articles SET status='AUTO_CHECK', updated_at=CURRENT_TIMESTAMP WHERE id=$1`,
          [articleId],
        );
      }
    }

    return { passed, issues, checks };
  }

  // ----------------------------------------------------------
  // BLOK KONTEN
  // ----------------------------------------------------------
  async upsertBlock(
    principal: Principal,
    articleId: string,
    block: {
      id?: string;
      blockType: BlockType;
      position: number;
      content: Record<string, unknown>;
      storageObjectId?: string | null;
      caption?: string | null;
    },
  ): Promise<ArticleBlock> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat mengubah blok', 403);
    }
    // Sanitasi konten — pastikan tidak ada HTML aktif
    this.sanitizeBlockContent(block.content, block.blockType);

    const id = block.id ?? randomUUID();
    const result = await this.pool.query<{
      id: string;
      article_id: string;
      block_type: BlockType;
      position: number;
      content: Record<string, unknown>;
      storage_object_id: string | null;
      caption: string | null;
    }>(
      `INSERT INTO "${this.schema}".article_blocks
         (id, article_id, block_type, position, content, storage_object_id, caption)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (article_id, position) DO UPDATE
         SET block_type = EXCLUDED.block_type,
             content = EXCLUDED.content,
             storage_object_id = EXCLUDED.storage_object_id,
             caption = EXCLUDED.caption,
             updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        id,
        articleId,
        block.blockType,
        block.position,
        JSON.stringify(block.content),
        block.storageObjectId ?? null,
        block.caption ?? null,
      ],
    );
    const r = result.rows[0]!;
    return {
      id: r.id,
      articleId: r.article_id,
      blockType: r.block_type,
      position: r.position,
      content: r.content,
      storageObjectId: r.storage_object_id,
      caption: r.caption,
    };
  }

  async deleteBlock(principal: Principal, articleId: string, blockId: string): Promise<void> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat menghapus blok', 403);
    }
    await this.pool.query(
      `DELETE FROM "${this.schema}".article_blocks WHERE id=$1 AND article_id=$2`,
      [blockId, articleId],
    );
  }

  // ----------------------------------------------------------
  // SUMBER
  // ----------------------------------------------------------
  async addSource(
    principal: Principal,
    articleId: string,
    input: Omit<ArticleSource, 'id' | 'articleId'>,
  ): Promise<ArticleSource> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat menambah sumber', 403);
    }
    const id = randomUUID();
    const result = await this.pool.query<{
      id: string;
      article_id: string;
      position: number;
      title: string;
      author_or_org: string;
      publisher: string;
      publication_date: string | null;
      accessed_date: string | null;
      url: string | null;
      isbn: string | null;
      doi: string | null;
      document_number: string | null;
      section_reference: string;
      media_license: string;
      source_type: SourceType;
      link_status: 'ACTIVE' | 'DEAD' | 'PAYWALLED' | 'PENDING_REVIEW';
      is_primary: boolean;
    }>(
      `INSERT INTO "${this.schema}".article_sources
         (id, article_id, position, title, author_or_org, publisher,
          publication_date, accessed_date, url, isbn, doi, document_number,
          section_reference, media_license, source_type, link_status, is_primary)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        id,
        articleId,
        input.position,
        input.title,
        input.authorOrOrg,
        input.publisher,
        input.publicationDate,
        input.accessedDate,
        input.url,
        input.isbn,
        input.doi,
        input.documentNumber,
        input.sectionReference,
        input.mediaLicense,
        input.sourceType,
        input.linkStatus,
        input.isPrimary,
      ],
    );
    const r = result.rows[0]!;
    return {
      id: r.id,
      articleId: r.article_id,
      position: r.position,
      title: r.title,
      authorOrOrg: r.author_or_org,
      publisher: r.publisher,
      publicationDate: r.publication_date,
      accessedDate: r.accessed_date,
      url: r.url,
      isbn: r.isbn,
      doi: r.doi,
      documentNumber: r.document_number,
      sectionReference: r.section_reference,
      mediaLicense: r.media_license,
      sourceType: r.source_type,
      linkStatus: r.link_status,
      isPrimary: r.is_primary,
    };
  }

  // ----------------------------------------------------------
  // USULAN TOPIK
  // ----------------------------------------------------------
  async submitSuggestion(
    principal: Principal,
    input: {
      topic: string;
      reason: string;
      sourcesNote?: string;
      idempotencyKey: string;
    },
  ): Promise<ArticleSuggestion> {
    if (principal.approvalStatus !== 'APPROVED') {
      throw new ArticleError('FORBIDDEN', 'Akun belum disetujui', 403);
    }
    if (input.topic.trim().length < 5) {
      throw new ArticleError('VALIDATION_FAILED', 'Topik minimal 5 karakter', 400);
    }

    // Idempotency check
    const existing = await this.pool
      .query<{
        id: string;
        status: string;
        support_count: number;
        topic: string;
        reason: string;
        sources_note: string;
        principal_id: string;
      }>(
        `SELECT id, status, support_count, topic, reason, sources_note, principal_id
           FROM "${this.schema}".article_suggestions WHERE idempotency_key=$1`,
        [input.idempotencyKey],
      )
      .then((r) => r.rows[0] ?? null);
    if (existing) {
      return {
        id: existing.id,
        principalId: existing.principal_id,
        topic: existing.topic,
        reason: existing.reason,
        sourcesNote: existing.sources_note,
        status: existing.status as ArticleSuggestion['status'],
        supportCount: existing.support_count,
        idempotencyKey: input.idempotencyKey,
      };
    }

    const id = randomUUID();
    const moderation = await this.moderation.assessAndRecord({
      principal,
      targetType: 'ARTICLE_SUGGESTION',
      targetId: id,
      contentText: `${input.topic}\n${input.reason}\n${input.sourcesNote ?? ''}`,
    });
    const result = await this.pool.query<{
      id: string;
      principal_id: string;
      topic: string;
      reason: string;
      sources_note: string;
      status: string;
      support_count: number;
    }>(
      `INSERT INTO "${this.schema}".article_suggestions
         (id, principal_id, topic, reason, sources_note, idempotency_key, is_test,
          moderation_status, moderation_reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        id,
        principal.id,
        input.topic,
        input.reason,
        input.sourcesNote ?? '',
        input.idempotencyKey,
        principal.fixture,
        moderation.status,
        moderation.reason,
      ],
    );
    const r = result.rows[0]!;
    return {
      id: r.id,
      principalId: r.principal_id,
      topic: r.topic,
      reason: r.reason,
      sourcesNote: r.sources_note,
      status: r.status as ArticleSuggestion['status'],
      supportCount: r.support_count,
      idempotencyKey: input.idempotencyKey,
    };
  }

  async supportSuggestion(
    principal: Principal,
    suggestionId: string,
  ): Promise<{ supportCount: number }> {
    if (principal.approvalStatus !== 'APPROVED') {
      throw new ArticleError('FORBIDDEN', 'Akun belum disetujui', 403);
    }
    await this.pool.query(
      `INSERT INTO "${this.schema}".suggestion_supports (suggestion_id, principal_id)
       VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [suggestionId, principal.id],
    );
    await this.pool.query(
      `UPDATE "${this.schema}".article_suggestions
          SET support_count = (
            SELECT COUNT(*) FROM "${this.schema}".suggestion_supports WHERE suggestion_id=$1
          )
        WHERE id=$1`,
      [suggestionId],
    );
    const r = await this.pool.query<{ support_count: number }>(
      `SELECT support_count FROM "${this.schema}".article_suggestions WHERE id=$1`,
      [suggestionId],
    );
    return { supportCount: r.rows[0]?.support_count ?? 0 };
  }

  // ----------------------------------------------------------
  // KOREKSI ARTIKEL
  // ----------------------------------------------------------
  async submitCorrection(
    principal: Principal,
    articleId: string,
    input: {
      locationHint: string;
      issueType: IssueType;
      description: string;
      suggestion?: string;
      sourceReference?: string;
      idempotencyKey: string;
    },
  ): Promise<ArticleCorrection> {
    if (principal.approvalStatus !== 'APPROVED') {
      throw new ArticleError('FORBIDDEN', 'Akun belum disetujui', 403);
    }

    // Idempotency
    const existing = await this.pool
      .query<{
        id: string;
        article_id: string;
        principal_id: string;
        location_hint: string;
        issue_type: string;
        description: string;
        suggestion: string;
        source_reference: string;
        status: string;
      }>(`SELECT * FROM "${this.schema}".article_corrections WHERE idempotency_key=$1`, [
        input.idempotencyKey,
      ])
      .then((r) => r.rows[0] ?? null);
    if (existing) {
      return {
        id: existing.id,
        articleId: existing.article_id,
        principalId: existing.principal_id,
        locationHint: existing.location_hint,
        issueType: existing.issue_type as IssueType,
        description: existing.description,
        suggestion: existing.suggestion,
        sourceReference: existing.source_reference,
        status: existing.status as ArticleCorrection['status'],
        idempotencyKey: input.idempotencyKey,
      };
    }

    const id = randomUUID();
    const moderation = await this.moderation.assessAndRecord({
      principal,
      targetType: 'ARTICLE_CORRECTION',
      targetId: id,
      contentText: `${input.locationHint}\n${input.description}\n${input.suggestion ?? ''}\n${input.sourceReference ?? ''}`,
    });
    const result = await this.pool.query<{
      id: string;
      article_id: string;
      principal_id: string;
      location_hint: string;
      issue_type: string;
      description: string;
      suggestion: string;
      source_reference: string;
      status: string;
    }>(
      `INSERT INTO "${this.schema}".article_corrections
         (id, article_id, principal_id, location_hint, issue_type, description,
          suggestion, source_reference, idempotency_key, is_test,
          moderation_status, moderation_reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        id,
        articleId,
        principal.id,
        input.locationHint,
        input.issueType,
        input.description,
        input.suggestion ?? '',
        input.sourceReference ?? '',
        input.idempotencyKey,
        principal.fixture,
        moderation.status,
        moderation.reason,
      ],
    );
    const r = result.rows[0]!;
    return {
      id: r.id,
      articleId: r.article_id,
      principalId: r.principal_id,
      locationHint: r.location_hint,
      issueType: r.issue_type as IssueType,
      description: r.description,
      suggestion: r.suggestion,
      sourceReference: r.source_reference,
      status: r.status as ArticleCorrection['status'],
      idempotencyKey: input.idempotencyKey,
    };
  }

  // ----------------------------------------------------------
  // BANK SOAL (data saja — mesin ujian di Prompt 07)
  // ----------------------------------------------------------
  async createQuestionBank(
    principal: Principal,
    articleId: string,
    input: {
      language?: 'id' | 'en';
      mcQuestions: Array<Omit<QuestionMC, 'id' | 'bankId'>>;
      essayQuestions: Array<Omit<QuestionEssay, 'id' | 'bankId'>>;
    },
  ): Promise<QuestionBank> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat membuat bank soal', 403);
    }
    if (input.mcQuestions.length !== 20) {
      throw new ArticleError('VALIDATION_FAILED', 'Bank soal harus memiliki tepat 20 soal PG', 400);
    }
    if (input.essayQuestions.length !== 5) {
      throw new ArticleError(
        'VALIDATION_FAILED',
        'Bank soal harus memiliki tepat 5 soal esai',
        400,
      );
    }

    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Supersede bank lama untuk bahasa yang sama
      await client.query(
        `UPDATE "${this.schema}".question_banks
            SET status='SUPERSEDED', updated_at=CURRENT_TIMESTAMP
          WHERE article_id=$1 AND language=$2 AND status != 'SUPERSEDED'`,
        [articleId, input.language ?? 'id'],
      );

      const versionResult = await client.query<{ max: number }>(
        `SELECT COALESCE(MAX(version), 0) max FROM "${this.schema}".question_banks WHERE article_id=$1 AND language=$2`,
        [articleId, input.language ?? 'id'],
      );
      const newVersion = (versionResult.rows[0]?.max ?? 0) + 1;

      const bankId = randomUUID();
      await client.query(
        `INSERT INTO "${this.schema}".question_banks
           (id, article_id, language, version, status, is_test, created_by)
         VALUES ($1,$2,$3,$4,'DRAFT',$5,$6)`,
        [bankId, articleId, input.language ?? 'id', newVersion, principal.fixture, principal.id],
      );

      for (const q of input.mcQuestions) {
        await client.query(
          `INSERT INTO "${this.schema}".questions_mc
             (id, bank_id, position, stem, options, correct_key, explanation, is_test)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            randomUUID(),
            bankId,
            q.position,
            q.stem,
            JSON.stringify(q.options),
            q.correctKey,
            q.explanation,
            principal.fixture,
          ],
        );
      }

      for (const q of input.essayQuestions) {
        await client.query(
          `INSERT INTO "${this.schema}".questions_essay
             (id, bank_id, position, stem, rubric, max_score, is_test)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [randomUUID(), bankId, q.position, q.stem, q.rubric, q.maxScore, principal.fixture],
        );
      }

      // Validasi otomatis: periksa jumlah soal
      await client.query(
        `UPDATE "${this.schema}".question_banks
            SET status='VALIDATED', validated_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP
          WHERE id=$1`,
        [bankId],
      );

      await client.query('COMMIT');
      return {
        id: bankId,
        articleId,
        language: input.language ?? 'id',
        version: newVersion,
        status: 'VALIDATED',
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ----------------------------------------------------------
  // LIST ARTIKEL (dengan cursor pagination)
  // ----------------------------------------------------------
  async listArticles(
    principal: Principal | null,
    options: {
      status?: ArticleStatus;
      accessLevel?: AccessLevel;
      taxonomyNodeId?: string;
      cursor?: string;
      limit?: number;
    } = {},
  ): Promise<{ items: ArticleRow[]; nextCursor: string | null }> {
    const limit = Math.min(options.limit ?? 20, 100);
    const conditions: string[] = [];
    const params: unknown[] = [];
    let p = 1;

    // Guest hanya lihat PUBLISHED artikel
    if (!principal || principal.role !== 'OWNER') {
      conditions.push(`a.status = 'PUBLISHED'`);
      if (!principal || principal.approvalStatus !== 'APPROVED') {
        conditions.push(`a.access_level = 'PUBLIC'`);
      }
    } else if (options.status) {
      conditions.push(`a.status = $${p++}`);
      params.push(options.status);
    }

    if (options.taxonomyNodeId) {
      conditions.push(`a.taxonomy_node_id = $${p++}`);
      params.push(options.taxonomyNodeId);
    }
    if (options.accessLevel) {
      conditions.push(`a.access_level = $${p++}`);
      params.push(options.accessLevel);
    }
    if (options.cursor) {
      const [cursorDate, cursorId] = options.cursor.split('__');
      conditions.push(`(a.published_at, a.id) < ($${p++}::timestamptz, $${p++}::uuid)`);
      params.push(cursorDate, cursorId);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit + 1);
    const result = await this.pool.query<ArticleRow>(
      `SELECT a.* FROM "${this.schema}".articles a
       ${where}
       ORDER BY a.published_at DESC NULLS LAST, a.id DESC
       LIMIT $${p}`,
      params,
    );

    const rows = result.rows;
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const lastItem = items.at(-1);
    const nextCursor =
      hasMore && lastItem ? `${lastItem.published_at?.toISOString() ?? ''}__${lastItem.id}` : null;

    return { items, nextCursor };
  }

  // ----------------------------------------------------------
  // ARSIP dan SAMPAH
  // ----------------------------------------------------------
  async archiveArticle(principal: Principal, articleId: string): Promise<ArticleRow> {
    return this.transitionStatus(principal, articleId, 'ARCHIVED');
  }

  async trashArticle(principal: Principal, articleId: string): Promise<ArticleRow> {
    return this.transitionStatus(principal, articleId, 'TRASH');
  }

  async restoreFromTrash(principal: Principal, articleId: string): Promise<ArticleRow> {
    if (principal.role !== 'OWNER') {
      throw new ArticleError('FORBIDDEN', 'Hanya Admin dapat memulihkan artikel', 403);
    }
    const result = await this.pool.query<ArticleRow>(
      // Kembali menjadi DRAFT segar: tanggal terbit/arsip lama dibersihkan
      // agar baris konsisten (DRAFT tanpa klaim tanggal publikasi basi).
      `UPDATE "${this.schema}".articles
          SET status='DRAFT', trash_at=NULL, purge_after=NULL,
              published_at=NULL, archived_at=NULL, scheduled_at=NULL,
              updated_by=$2, updated_at=CURRENT_TIMESTAMP, version=version+1
        WHERE id=$1 AND status='TRASH'
        RETURNING *`,
      [articleId, principal.id],
    );
    if (result.rowCount === 0) {
      throw new ArticleError('NOT_FOUND', 'Artikel tidak ada di sampah', 404);
    }
    return result.rows[0]!;
  }

  // ----------------------------------------------------------
  // HELPER PRIVATE
  // ----------------------------------------------------------
  private async createRevisionDraft(
    principal: Principal,
    existing: ArticleRow,
    input: UpdateArticleInput,
  ): Promise<void> {
    await this.pool.query(
      `INSERT INTO "${this.schema}".article_revisions
         (id, article_id, title_draft, summary_draft, owner_notes_draft, status, created_by)
       VALUES ($1,$2,$3,$4,$5,'DRAFT',$6)`,
      [
        randomUUID(),
        existing.id,
        input.title ?? existing.title,
        input.summary ?? existing.summary,
        input.ownerNotes ?? existing.owner_notes,
        principal.id,
      ],
    );
  }

  private assertTransitionAllowed(from: ArticleStatus, to: ArticleStatus): void {
    const allowed: Partial<Record<ArticleStatus, ArticleStatus[]>> = {
      DRAFT: ['AUTO_CHECK', 'AWAITING_OWNER'],
      AUTO_CHECK: ['AWAITING_OWNER', 'NEEDS_REVISION'],
      AWAITING_OWNER: ['APPROVED', 'NEEDS_REVISION'],
      NEEDS_REVISION: ['DRAFT', 'AUTO_CHECK'],
      APPROVED: ['SCHEDULED', 'PUBLISHED'],
      SCHEDULED: ['PUBLISHED', 'DRAFT'],
      PUBLISHED: ['ARCHIVED', 'TRASH'],
      ARCHIVED: ['PUBLISHED', 'DRAFT', 'TRASH'],
      TRASH: ['DRAFT'],
    };
    if (!allowed[from]?.includes(to)) {
      throw new ArticleError(
        'INVALID_TRANSITION',
        `Tidak dapat mengubah status dari ${from} ke ${to}`,
        400,
      );
    }
  }

  private validateSlug(slug: string): void {
    if (!/^[a-z0-9-]{3,200}$/.test(slug)) {
      throw new ArticleError(
        'VALIDATION_FAILED',
        'Slug hanya boleh huruf kecil, angka, dan tanda hubung (3-200 karakter)',
        400,
      );
    }
  }

  private validateTitle(title: string): void {
    if (title.trim().length < 3 || title.length > 200) {
      throw new ArticleError('VALIDATION_FAILED', 'Judul harus antara 3 dan 200 karakter', 400);
    }
  }

  /**
   * Artikel pendidikan hanya boleh ditempatkan pada daun J dari taxonomy aktif.
   * UUID yang tidak ada, tidak aktif, atau berada di R1--I sengaja ditolak agar
   * draf tidak muncul pada kategori yang salah.
   */
  private async assertTaxonomyPlacementIsJ(
    taxonomyNodeId: string | undefined | null,
  ): Promise<void> {
    if (!taxonomyNodeId) return;
    const node = await this.pool
      .query<{ level: string }>(
        `SELECT n.level
           FROM "${this.schema}".taxonomy_nodes n
           JOIN "${this.schema}".taxonomy_state s ON s.active_revision_id = n.revision_id
          WHERE n.node_id = $1 AND n.lifecycle_status = 'ACTIVE'`,
        [taxonomyNodeId],
      )
      .then((result) => result.rows[0] ?? null);
    if (!node || node.level !== 'J') {
      throw new ArticleError(
        'VALIDATION_FAILED',
        'Penempatan artikel harus memakai node J aktif pada taxonomy',
        400,
      );
    }
  }

  private sanitizeBlockContent(content: Record<string, unknown>, blockType: BlockType): void {
    // Pastikan tidak ada HTML/JS aktif. CODE adalah teks pembelajaran (dirender escaped),
    // sehingga polanya boleh ada di sana; tipe lain yang dirender sebagai teks/flow
    // tetap ditolak bila mengandung markup aktif agar tak tersimpan sebagai HTML.
    const dangerousKeys = [
      '__html',
      'dangerouslySetInnerHTML',
      'script',
      'onclick',
      'onerror',
      'onload',
    ];
    const visit = (v: unknown): void => {
      if (typeof v === 'string') {
        if (blockType !== 'CODE' && /<\s*script\b|javascript\s*:|\bon\w+\s*=/i.test(v)) {
          throw new ArticleError(
            'VALIDATION_FAILED',
            `Blok ${blockType} mengandung konten tidak aman`,
            400,
          );
        }
        return;
      }
      if (Array.isArray(v)) {
        for (const item of v) visit(item);
        return;
      }
      if (v && typeof v === 'object') {
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          if (dangerousKeys.includes(k)) {
            throw new ArticleError(
              'VALIDATION_FAILED',
              `Blok ${blockType} mengandung konten tidak aman`,
              400,
            );
          }
          visit(val);
        }
      }
    };
    visit(content);
  }
}
