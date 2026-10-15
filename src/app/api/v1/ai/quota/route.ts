import { successResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  return successResponse(
    {
      userQuota: false,
      protection: 'ACTION_RATE_LIMIT',
      note: 'AI Madevi gratis tanpa kuota pengguna. Perlindungan teknis diterapkan sebagai rate limit per aksi.',
    },
    requestId,
  );
}
