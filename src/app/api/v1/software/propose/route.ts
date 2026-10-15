import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { softwareService } from '@/app/api/v1/software/route-utils';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { SoftwareError } from '@/services/software';

// POST /api/v1/software/propose — usulan software (pengguna login)
export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  try {
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');
    const principal = auth.principal;

    const body = (await req.json()) as Record<string, unknown>;
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'Nama software diperlukan', { name: 'wajib diisi' }),
        requestId,
      );
    }
    if (!body.officialUrl || typeof body.officialUrl !== 'string') {
      return errorResponse(
        new ApiError('VALIDATION_FAILED', 'URL resmi diperlukan', { officialUrl: 'wajib diisi' }),
        requestId,
      );
    }

    const result = await softwareService().proposeUpdate(principal, {
      name: body.name,
      officialUrl: body.officialUrl,
      reason: typeof body.reason === 'string' ? body.reason : undefined,
    });

    return successResponse(result, requestId, { status: 201 });
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
