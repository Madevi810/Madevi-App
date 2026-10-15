import { ApiError } from '@/api/errors';
import { errorResponse } from '@/api/response';
import { requestIdFromHeaders } from '@/server/request-id';

// Legacy endpoint: checkout bukan fungsi Madevi Local dan tidak meneruskan pengguna ke alur palsu.
export async function POST(request: Request) {
  return errorResponse(
    new ApiError(
      'DEPENDENCY_UNAVAILABLE',
      'Checkout tidak tersedia di Madevi Local. Simpan produk atau kirim pertanyaan kepada Owner.',
    ),
    requestIdFromHeaders(request.headers),
  );
}
