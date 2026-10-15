import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

import { errorResponse } from '@/api/response';
import { socialService } from '@/app/api/v1/social/route-utils';
import { authenticateRequest } from '@/auth/http';
import { getServerEnv } from '@/server/env';
import { requestIdFromHeaders } from '@/server/request-id';

type Context = { params: Promise<{ id: string; attachmentId: string }> };
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: Context) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const { id, attachmentId } = await context.params;
    // L05 AC-01: teruskan viewer opsional agar pasangan block ditolak generik.
    let viewerId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      viewerId = auth.principal.id;
    } catch {
      viewerId = undefined;
    }
    const attachment = await socialService().resolvePublicAttachment(id, attachmentId, viewerId);
    const storageRoot = path.resolve(getServerEnv().MADEVI_RUNTIME_ROOT, 'storage');
    const filePath = path.resolve(storageRoot, attachment.relativePath);
    if (!filePath.startsWith(`${storageRoot}${path.sep}`))
      throw new Error('Storage path keluar root');
    const stream = fs.createReadStream(filePath);
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        'content-type': attachment.mediaType,
        'content-length': String(attachment.sizeBytes),
        'cache-control': 'private, no-store',
        'content-security-policy': "default-src 'none'; sandbox",
        'x-content-type-options': 'nosniff',
        'x-request-id': requestId,
        etag: `\"${attachment.sha256}\"`,
      },
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
