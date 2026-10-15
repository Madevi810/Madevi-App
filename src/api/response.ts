import { ApiError } from '@/api/errors';
import { logEvent } from '@/server/logger';

export interface PageInfo {
  nextCursor: string | null;
  limit: number;
}

export function successResponse<T>(
  data: T,
  requestId: string,
  options: { status?: number; page?: PageInfo } = {},
) {
  return Response.json(
    { data, requestId, ...(options.page ? { page: options.page } : {}) },
    {
      status: options.status ?? 200,
      headers: { 'cache-control': 'no-store', 'x-request-id': requestId },
    },
  );
}

export function errorResponse(error: unknown, requestId: string) {
  const isApiError =
    error instanceof ApiError ||
    (error &&
      typeof error === 'object' &&
      'code' in error &&
      'status' in error &&
      (error as Record<string, unknown>).name === 'ApiError');

  const apiError =
    isApiError
      ? (error as ApiError)
      : isUnavailableDependency(error)
        ? new ApiError('DEPENDENCY_UNAVAILABLE', 'Layanan lokal sementara tidak tersedia')
        : new ApiError('INTERNAL_ERROR', 'Terjadi kesalahan internal');
  if (!isApiError) {
    logEvent('error', 'api_internal_error', {
      requestId,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
  }
  return Response.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
        ...(apiError.fields ? { fields: apiError.fields } : {}),
      },
      requestId,
    },
    {
      status: apiError.status,
      headers: { 'cache-control': 'no-store', 'x-request-id': requestId },
    },
  );
}

function isUnavailableDependency(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) return false;
  return ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND'].includes(String(error.code));
}
