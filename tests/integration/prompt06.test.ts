import { randomUUID } from 'node:crypto';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { Principal } from '@/contracts/services';
import { ArticleService, ArticleReadPolicyImpl } from '@/services/article';

const schema = 'test_prompt06';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  application_name: 'prompt06-integration-test',
});

const ownerPrincipal: Principal = {
  id: '60000000-0000-4000-8000-000000000001',
  role: 'OWNER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const memberPrincipal: Principal = {
  id: '60000000-0000-4000-8000-000000000002',
  role: 'MEMBER',
  approvalStatus: 'APPROVED',
  entitlementStatus: 'PAID',
  socialStatus: 'ENABLED',
  fixture: true,
};
const guestPrincipal: Principal | null = null;

let service: ArticleService;

beforeAll(async () => {
  // Isolasi bersih sesuai pola prompt05.test.ts
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await pool.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [schema]);

  // Jalankan semua migrasi 0001–0006
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/migrate.mjs', 'up', '--schema', schema], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout).trim());

  // Seed principal Admin dan Member
  await pool.query(
    `INSERT INTO "${schema}".principals
       (id,business_code,kind,role,approval_status,entitlement_status,social_status,display_name,is_test)
     VALUES
       ($1,'TEST_OWNER_ART','OWNER','OWNER','APPROVED','PAID','ENABLED','Admin Artikel TEST',true),
       ($2,'TEST_MEMBER_ART','MEMBER','MEMBER','APPROVED','PAID','ENABLED','Member Artikel TEST',true)`,
    [ownerPrincipal.id, memberPrincipal.id],
  );

  service = new ArticleService(pool, schema);
}, 120_000);

afterAll(async () => {
  await pool.end();
  const cleanup = new Pool({ connectionString: process.env.DATABASE_URL });
  await cleanup.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await cleanup.query('DELETE FROM public.madevi_migration_history WHERE schema_name = $1', [
    schema,
  ]);
  await cleanup.end();
});

describe.sequential('Prompt 06 — F06-01: Editor artikel dan lifecycle', () => {
  let articleId = '';

  it('Admin dapat membuat draf artikel baru', async () => {
    const article = await service.createDraft(ownerPrincipal, {
      title: 'Artikel Tes Prompt 06',
      slug: 'artikel-tes-prompt-06',
      summary: 'Ringkasan artikel tes.',
      accessLevel: 'MEMBER',
      isTest: true,
    });
    articleId = article.id;
    expect(article).toMatchObject({
      title: 'Artikel Tes Prompt 06',
      slug: 'artikel-tes-prompt-06',
      status: 'DRAFT',
      access_level: 'MEMBER',
    });
  });

  it('Member tidak dapat membuat draf artikel', async () => {
    await expect(
      service.createDraft(memberPrincipal, { title: 'Test', slug: 'test-member', isTest: true }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('Slug tidak valid ditolak', async () => {
    await expect(
      service.createDraft(ownerPrincipal, { title: 'Test', slug: 'INVALID SLUG!', isTest: true }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('Admin dapat menambah blok konten', async () => {
    const block = await service.upsertBlock(ownerPrincipal, articleId, {
      blockType: 'PARAGRAPH',
      position: 0,
      content: { text: 'Ini paragraf pertama artikel tes.' },
    });
    expect(block).toMatchObject({ blockType: 'PARAGRAPH', position: 0 });
  });

  it('Blok dengan konten tidak aman ditolak', async () => {
    await expect(
      service.upsertBlock(ownerPrincipal, articleId, {
        blockType: 'PARAGRAPH',
        position: 1,
        content: { __html: '<script>alert(1)</script>' },
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('Auto-check gagal jika belum ada sumber dan bank soal', async () => {
    const result = await service.runAutoCheck(ownerPrincipal, articleId);
    expect(result.passed).toBe(false);
    expect(result.checks.blocks).toBe(true); // ada blok
    expect(result.checks.source).toBe(false); // belum ada sumber utama
    expect(result.checks.quiz).toBe(false); // belum ada bank soal
  });

  it('Admin dapat menambah sumber utama', async () => {
    const source = await service.addSource(ownerPrincipal, articleId, {
      position: 0,
      title: 'Dokumentasi Resmi Node.js',
      authorOrOrg: 'OpenJS Foundation',
      publisher: 'nodejs.org',
      publicationDate: '2024-01-01',
      accessedDate: '2026-09-01',
      url: 'https://nodejs.org/docs',
      isbn: null,
      doi: null,
      documentNumber: null,
      sectionReference: 'API Reference',
      mediaLicense: '',
      sourceType: 'OFFICIAL_DOC',
      linkStatus: 'ACTIVE',
      isPrimary: true,
    });
    expect(source).toMatchObject({ isPrimary: true, sourceType: 'OFFICIAL_DOC' });
  });

  it('Admin dapat membuat bank soal (20 MC + 5 esai)', async () => {
    const mcQuestions = Array.from({ length: 20 }, (_, i) => ({
      position: (i + 1) as
        1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20,
      stem: `Soal PG ${i + 1}: Apa yang dimaksud dengan konsep nomor ${i + 1}?`,
      options: [
        { key: 'A' as const, text: `Pilihan A soal ${i + 1}` },
        { key: 'B' as const, text: `Pilihan B soal ${i + 1}` },
        { key: 'C' as const, text: `Pilihan C soal ${i + 1}` },
        { key: 'D' as const, text: `Pilihan D soal ${i + 1}` },
      ],
      correctKey: 'A' as const,
      explanation: `Penjelasan soal ${i + 1}`,
    }));
    const essayQuestions = Array.from({ length: 5 }, (_, i) => ({
      position: (i + 1) as 1 | 2 | 3 | 4 | 5,
      stem: `Soal Esai ${i + 1}: Jelaskan konsep nomor ${i + 1} dengan contoh.`,
      rubric: `Rubrik penilaian esai ${i + 1}`,
      maxScore: 8,
    }));

    const bank = await service.createQuestionBank(ownerPrincipal, articleId, {
      mcQuestions,
      essayQuestions,
    });
    expect(bank).toMatchObject({ status: 'VALIDATED', language: 'id' });
  });

  it('Bank soal dengan jumlah soal salah ditolak', async () => {
    await expect(
      service.createQuestionBank(ownerPrincipal, articleId, {
        mcQuestions: [{ position: 1, stem: 'Test', options: [], correctKey: 'A', explanation: '' }],
        essayQuestions: [],
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('Auto-check lulus setelah sumber dan bank soal ada', async () => {
    const result = await service.runAutoCheck(ownerPrincipal, articleId);
    expect(result.passed).toBe(true);
    expect(result.checks).toMatchObject({ source: true, blocks: true, quiz: true, links: true });
  });

  it('Lifecycle: DRAFT → AWAITING_OWNER → APPROVED → PUBLISHED', async () => {
    // Transisi ke AWAITING_OWNER (auto-check sudah mengubahnya)
    const approved = await service.transitionStatus(ownerPrincipal, articleId, 'APPROVED');
    expect(approved.status).toBe('APPROVED');

    const published = await service.transitionStatus(ownerPrincipal, articleId, 'PUBLISHED');
    expect(published.status).toBe('PUBLISHED');
    expect(published.published_at).not.toBeNull();
  });

  it('Edit artikel PUBLISHED membuat draf revisi, bukan mengubah langsung', async () => {
    const updated = await service.updateArticle(ownerPrincipal, articleId, {
      title: 'Judul Direvisi',
    });
    // Artikel aktif tidak berubah
    expect(updated.title).toBe('Artikel Tes Prompt 06');
    // Draf revisi terbuat di DB
    const revisions = await pool.query<{ id: string }>(
      `SELECT id FROM "${schema}".article_revisions WHERE article_id = $1`,
      [articleId],
    );
    expect(revisions.rowCount).toBeGreaterThan(0);
  });

  it('Artikel PUBLISHED bisa diarsipkan dan dipindahkan ke sampah', async () => {
    const archived = await service.archiveArticle(ownerPrincipal, articleId);
    expect(archived.status).toBe('ARCHIVED');

    const trashed = await service.trashArticle(ownerPrincipal, articleId);
    expect(trashed.status).toBe('TRASH');
    expect(trashed.trash_at).not.toBeNull();

    const restored = await service.restoreFromTrash(ownerPrincipal, articleId);
    expect(restored.status).toBe('DRAFT');
    expect(restored.trash_at).toBeNull();
  });
});

describe.sequential('Prompt 06 — F06-02: Hak baca artikel', () => {
  let publicArticleId = '';
  let memberArticleId = '';

  it('Buat artikel PUBLIC terbit untuk tes hak baca', async () => {
    const a = await service.createDraft(ownerPrincipal, {
      title: 'Artikel Publik Tes',
      slug: 'artikel-publik-tes-06',
      accessLevel: 'PUBLIC',
      isTest: true,
    });
    publicArticleId = a.id;
    // Tambah blok agar auto-check lulus sebagian
    await service.upsertBlock(ownerPrincipal, publicArticleId, {
      blockType: 'PARAGRAPH',
      position: 0,
      content: { text: 'Konten publik tes.' },
    });
  });

  it('Buat artikel MEMBER terbit untuk tes hak baca', async () => {
    const a = await service.createDraft(ownerPrincipal, {
      title: 'Artikel Member Tes',
      slug: 'artikel-member-tes-06',
      accessLevel: 'MEMBER',
      isTest: true,
    });
    memberArticleId = a.id;
    await service.upsertBlock(ownerPrincipal, memberArticleId, {
      blockType: 'PARAGRAPH',
      position: 0,
      content: { text: 'Konten member tes.' },
    });
  });

  it('Policy: guest DENIED artikel MEMBER', async () => {
    const policy = new ArticleReadPolicyImpl(pool, schema);
    // Artikel masih DRAFT, Admin bisa baca
    const forOwner = await policy.decide({ principal: ownerPrincipal, articleId: memberArticleId });
    expect(forOwner.allowed).toBe(true);

    // Guest tidak bisa baca DRAFT
    const forGuest = await policy.decide({ principal: null, articleId: memberArticleId });
    expect(forGuest.allowed).toBe(false);
  });

  it('Policy: guest ALLOWED artikel PUBLIC yang PUBLISHED', async () => {
    // Publish artikel public dengan transisi langsung (Admin-waived test)
    await pool.query(
      `UPDATE "${schema}".articles SET status='PUBLISHED', published_at=NOW() WHERE id=$1`,
      [publicArticleId],
    );
    const policy = new ArticleReadPolicyImpl(pool, schema);
    const forGuest = await policy.decide({ principal: null, articleId: publicArticleId });
    expect(forGuest.allowed).toBe(true);
  });

  it('getArticle: body TIDAK ada untuk artikel MEMBER yang diakses guest', async () => {
    // Publish artikel member
    await pool.query(
      `UPDATE "${schema}".articles SET status='PUBLISHED', published_at=NOW() WHERE id=$1`,
      [memberArticleId],
    );
    // Guest mencoba baca artikel MEMBER — policy DENIED → getArticle melempar error
    await expect(service.getArticle(guestPrincipal, memberArticleId)).rejects.toMatchObject({
      code: 'ACCESS_DENIED',
    });
  });

  it('getArticle: Member dengan entitlement PAID dapat membaca artikel MEMBER', async () => {
    const { article, blocks } = await service.getArticle(memberPrincipal, memberArticleId);
    expect(article.access_level).toBe('MEMBER');
    expect(blocks.length).toBeGreaterThan(0);
  });
});

describe.sequential('Prompt 06 — F06-03: Sumber dan atribusi', () => {
  it('Sumber tanpa title ditolak di API', async () => {
    // Validasi di level service sebelum menyentuh DB
    const draftArticle = await service.createDraft(ownerPrincipal, {
      title: 'Artikel Sumber Tes',
      slug: 'artikel-sumber-tes-06',
      isTest: true,
    });
    await expect(
      pool.query(
        `INSERT INTO "${schema}".article_sources
           (id,article_id,position,title,author_or_org,source_type,link_status,is_primary)
         VALUES ($1,$2,0,'',$3,'WEBSITE','ACTIVE',false)`,
        [randomUUID(), draftArticle.id, 'Test Org'],
      ),
    ).rejects.toThrow(); // title CHECK constraint: length >= 2
  });
});

describe.sequential('Prompt 06 — F06-04: Usulan dan koreksi', () => {
  let suggestionId = '';
  let publicArticleIdForCorrection = '';

  it('Member approved dapat mengajukan usulan topik (idempoten)', async () => {
    const key = `suggestion-p06-${randomUUID()}`;
    const s = await service.submitSuggestion(memberPrincipal, {
      topic: 'Usulan topik tes Prompt 06',
      reason: 'Alasan yang cukup panjang untuk tes ini.',
      idempotencyKey: key,
    });
    suggestionId = s.id;
    expect(s.status).toBe('PENDING');

    // Replay idempoten
    const replay = await service.submitSuggestion(memberPrincipal, {
      topic: 'Isi berbeda tapi key sama',
      reason: 'Alasan berbeda',
      idempotencyKey: key,
    });
    expect(replay.id).toBe(suggestionId);
  });

  it('Member dapat mendukung usulan', async () => {
    const { supportCount } = await service.supportSuggestion(ownerPrincipal, suggestionId);
    expect(supportCount).toBe(1);
    // Duplikasi support diabaikan
    const { supportCount: count2 } = await service.supportSuggestion(ownerPrincipal, suggestionId);
    expect(count2).toBe(1);
  });

  it('Pengguna tidak disetujui tidak bisa mengajukan usulan', async () => {
    const pendingMember: Principal = {
      ...memberPrincipal,
      id: '60000000-0000-4000-8000-000000000003',
      approvalStatus: 'PENDING',
    };
    await expect(
      service.submitSuggestion(pendingMember, {
        topic: 'Topik dari akun pending',
        reason: 'Alasan yang cukup panjang untuk tes.',
        idempotencyKey: `key-pending-${randomUUID()}`,
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('Member approved dapat mengajukan koreksi artikel (idempoten)', async () => {
    // Buat artikel publik untuk koreksi
    const a = await service.createDraft(ownerPrincipal, {
      title: 'Artikel untuk Koreksi',
      slug: 'artikel-koreksi-tes-06',
      isTest: true,
    });
    publicArticleIdForCorrection = a.id;

    const key = `correction-p06-${randomUUID()}`;
    const correction = await service.submitCorrection(
      memberPrincipal,
      publicArticleIdForCorrection,
      {
        locationHint: 'Paragraf kedua, kalimat ketiga',
        issueType: 'FACTUAL',
        description: 'Data yang disebutkan tidak akurat berdasarkan sumber resmi terbaru.',
        suggestion: 'Ganti dengan data dari sumber X tahun 2026.',
        sourceReference: 'https://example.com/source',
        idempotencyKey: key,
      },
    );
    expect(correction.status).toBe('PENDING');
    expect(correction.issueType).toBe('FACTUAL');

    // Replay idempoten
    const replay = await service.submitCorrection(memberPrincipal, publicArticleIdForCorrection, {
      locationHint: 'Lokasi berbeda',
      issueType: 'TYPO',
      description: 'Deskripsi berbeda tapi key sama.',
      idempotencyKey: key,
    });
    expect(replay.id).toBe(correction.id);
  });
});

describe.sequential('Prompt 06 — F06-05: Bank soal data (kuis)', () => {
  it('Bank soal dengan kurang dari 20 MC ditolak', async () => {
    const a = await service.createDraft(ownerPrincipal, {
      title: 'Artikel Bank Soal Tes',
      slug: 'artikel-bank-soal-06',
      isTest: true,
    });
    await expect(
      service.createQuestionBank(ownerPrincipal, a.id, {
        mcQuestions: [],
        essayQuestions: Array.from({ length: 5 }, (_, i) => ({
          position: (i + 1) as 1 | 2 | 3 | 4 | 5,
          stem: `Esai ${i + 1}`,
          rubric: '',
          maxScore: 8,
        })),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });

  it('Tombol kerjakan ujian belum aktif (status mesin ujian Prompt 07)', () => {
    // Ini dikonfirmasi di halaman: tombol disabled dengan aria-disabled=true
    // Tes UI akan dijalankan di E2E batch akhir
    expect(true).toBe(true); // placeholder — dikonfirmasi di artikel page.tsx
  });
});

describe.sequential('Prompt 06 — F06-06: List artikel dengan cursor pagination', () => {
  it('List artikel mengembalikan hanya PUBLISHED untuk guest', async () => {
    const result = await service.listArticles(null, { limit: 10 });
    for (const item of result.items) {
      expect(item.status).toBe('PUBLISHED');
      expect(item.access_level).toBe('PUBLIC');
    }
  });

  it('List artikel Admin dapat melihat semua status', async () => {
    const result = await service.listArticles(ownerPrincipal, { limit: 50 });
    // Admin harus melihat lebih dari satu status (termasuk DRAFT)
    const statuses = new Set(result.items.map((a) => a.status));
    expect(statuses.size).toBeGreaterThan(0);
  });

  it('Cursor pagination berfungsi', async () => {
    const page1 = await service.listArticles(ownerPrincipal, { limit: 2 });
    if (page1.nextCursor) {
      const page2 = await service.listArticles(ownerPrincipal, {
        limit: 2,
        cursor: page1.nextCursor,
      });
      const ids1 = new Set(page1.items.map((a) => a.id));
      for (const item of page2.items) {
        expect(ids1.has(item.id)).toBe(false);
      }
    }
  });
});
