import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';

const PAGE_KEYS = ['ABOUT', 'FAQ', 'TERMS', 'PRIVACY', 'REVIEW'] as const;
type PageKey = (typeof PAGE_KEYS)[number];

function unsafeText(value: string) {
  return /<\s*script\b|javascript\s*:|\bon\w+\s*=/i.test(value);
}

// GET /api/v1/owner/site-pages — daftar draf halaman statis (Admin saja).
export async function GET(req: NextRequest) {
  const requestId = randomUUID();
  try {
    await authenticateRequest(req, 'OWNER');
    const { pool } = getDatabaseClients();
    const rows = await pool.query(
      `SELECT id, page_key, title, language, status, published_at, updated_at
         FROM "${getDatabaseSchema()}".site_pages ORDER BY page_key`,
    );
    return successResponse(rows.rows, requestId);
  } catch (err) {
    return errorResponse(err, requestId);
  }
}

// POST /api/v1/owner/site-pages — simpan draf/publikasi halaman situs; tanpa bank soal.
export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json()) as Record<string, unknown>;
    const pageKey = body.pageKey;
    const title = body.title;
    const content = body.content;
    const status = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    if (typeof pageKey !== 'string' || !PAGE_KEYS.includes(pageKey as PageKey)) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Jenis halaman tidak valid'),
        requestId,
      );
    }
    if (typeof title !== 'string' || title.trim().length < 2 || title.length > 200) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Judul halaman harus 2–200 karakter'),
        requestId,
      );
    }
    if (typeof content !== 'string' || !content.trim() || unsafeText(content)) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Isi halaman tidak aman atau kosong'),
        requestId,
      );
    }
    const { pool } = getDatabaseClients();
    const schema = getDatabaseSchema();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const page = await client.query<{ id: string }>(
        `INSERT INTO "${schema}".site_pages
           (id, page_key, title, language, status, published_at, is_test, created_by, updated_by)
         VALUES ($1,$2,$3,$4,$5,CASE WHEN $5='PUBLISHED' THEN CURRENT_TIMESTAMP ELSE NULL END,$6,$7,$7)
         ON CONFLICT (page_key) DO UPDATE SET
           title=EXCLUDED.title, language=EXCLUDED.language, status=EXCLUDED.status,
           published_at=CASE WHEN EXCLUDED.status='PUBLISHED' THEN CURRENT_TIMESTAMP ELSE NULL END,
           is_test=EXCLUDED.is_test, updated_by=EXCLUDED.updated_by, updated_at=CURRENT_TIMESTAMP
         RETURNING id, page_key, title, language, status, published_at, updated_at`,
        [
          randomUUID(),
          pageKey,
          title.trim(),
          body.language === 'en' ? 'en' : 'id',
          status,
          auth.principal.fixture,
          auth.principal.id,
        ],
      );
      const id = page.rows[0]!.id;
      await client.query(`DELETE FROM "${schema}".site_page_blocks WHERE page_id=$1`, [id]);
      await client.query(
        `INSERT INTO "${schema}".site_page_blocks (id, page_id, block_type, position, content)
         VALUES ($1,$2,'PARAGRAPH',0,$3)`,
        [randomUUID(), id, JSON.stringify({ text: content.trim() })],
      );
      await client.query('COMMIT');
      return successResponse(page.rows[0], requestId, { status: 201 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    return errorResponse(err, requestId);
  }
}
