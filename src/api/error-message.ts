import { ApiError } from '@/api/errors';

/** Never mirror driver/network exceptions to browser responses. */
export function errorMessage(error: unknown, fallback = 'Layanan lokal sementara tidak tersedia') {
  return error instanceof ApiError ? error.message : fallback;
}

export function isDependencyUnavailable(error: unknown) {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND'].includes(String(error.code))
  );
}
