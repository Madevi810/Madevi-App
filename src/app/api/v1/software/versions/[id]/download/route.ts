import { randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { softwareService } from '@/app/api/v1/software/route-utils';
import { SoftwareError } from '@/services/software';

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  const requestId = randomUUID();
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return errorResponse(new ApiError('VALIDATION_FAILED', 'ID versi tidak valid'), requestId);
    }

    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const result = await softwareService().prepareDownload(auth.principal, id);

    return successResponse(
      {
        downloadId: result.downloadId,
        storageObjectId: result.storageObjectId,
        status: 'READY',
      },
      requestId,
    );
  } catch (err) {
    if (err instanceof SoftwareError) {
      const code =
        err.code === 'NOT_FOUND'
          ? 'NOT_FOUND'
          : err.code === 'FORBIDDEN'
            ? 'ACCESS_DENIED'
            : 'VALIDATION_FAILED';
      return errorResponse(new ApiError(code as ApiError['code'], err.message), requestId);
    }
    return errorResponse(err, requestId);
  }
}
