import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { LocalStorageService } from '@/services/storage';
import { getServerEnv } from '@/server/env';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * P13: "Batasi kuota media dan bersihkan orphan files."
 *
 * reconcile() sebelumnya tidak pernah dipanggil siapa pun (audit P13 menemukan
 * dead method). Route ini adalah satu-satunya pintu untuk menjalankannya:
 *  - OWNER-only + CSRF (operasi maintenance, menyinggung byte di disk).
 *  - Mengembalikan laporan: orphan ditemukan / dihapus / dipertahankan /
 *    hilang (DB bilang ada, disk tidak).
 *
 * `expireReservations()` juga dipanggil agar kuota media lepas dari reservasi
 * kedaluwarsa sebelum reconcile — keduanya adalah pasangan pembersihan.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { pool } = getDatabaseClients();
    const storage = new LocalStorageService(
      pool,
      getServerEnv().MADEVI_RUNTIME_ROOT,
      getDatabaseSchema(),
    );
    await storage.expireReservations();
    const report = await storage.reconcile();
    return successResponse(
      {
        orphanFilesFound: report.orphanBytes.length,
        orphansDeleted: report.deletedOrphans.length,
        quarantineOrphansRetained: report.retainedQuarantineOrphans.length,
        missingMarkedRejected: report.missingBytes.length,
        deletedPaths: report.deletedOrphans,
      },
      requestId,
    );
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
