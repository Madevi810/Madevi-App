import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { ArticleError, ArticleService } from '@/services/article';
import type { BlockType } from '@/services/article';

type RouteParams = { params: Promise<{ id: string }> };

const BLOCK_TYPES: BlockType[] = [
  'HEADING',
  'PARAGRAPH',
  'LIST',
  'IMAGE',
  'TABLE',
  'FORMULA',
  'CODE',
  'QUOTE',
  'NOTE',
  'WARNING',
  'EXAMPLE',
  'STEP',
  'VIDEO',
  'LINK',
];

// POST /api/v1/articles/[id]/blocks — simpan blok yang sudah disanitasi (Admin).
export async function POST(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  const { id } = await params;
  try {
    const auth = await authenticateRequest(req, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(req, auth.sessionId, 'OWNER');
    const body = (await req.json()) as Record<string, unknown>;
    const blockType = body.blockType;
    const position = body.position;
    if (typeof blockType !== 'string' || !BLOCK_TYPES.includes(blockType as BlockType)) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Tipe blok tidak valid'), requestId);
    }
    if (!Number.isInteger(position) || (position as number) < 0) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Posisi blok tidak valid'), requestId);
    }
    if (!body.content || typeof body.content !== 'object' || Array.isArray(body.content)) {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'Konten blok diperlukan'), requestId);
    }
    const { pool } = getDatabaseClients();
    const service = new ArticleService(pool, getDatabaseSchema());
    const block = await service.upsertBlock(auth.principal, id, {
      blockType: blockType as BlockType,
      position: position as number,
      content: body.content as Record<string, unknown>,
      caption: typeof body.caption === 'string' ? body.caption : null,
    });
    return successResponse(block, requestId, { status: 201 });
  } catch (err) {
    if (err instanceof ArticleError) {
      return errorResponse(
        new ApiError(err.code === 'FORBIDDEN' ? 'ACCESS_DENIED' : 'VALIDATION_FAILED', err.message),
        requestId,
      );
    }
    return errorResponse(err, requestId);
  }
}
