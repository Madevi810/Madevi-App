import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { OperasiService } from '@/services/operasi';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';


/**
 * P16: Backup/Restore — inspect & verify. P16 Batas: agent TIDAK menjalankan
 * backup/restore/server/DB. Route ini menyediakan:
 *  - GET  /backup/[backupId]?targetRoot=... : dry-run restore (read-only,
 *      mengembalikan rencana langkah; menolak target salah)
 *  - POST /backup/[backupId]                : verifikasi checksum backup
 *
 * Eksekusi restore nyata adalah langkah manual di runbook P16 (documented),
 * BUKAN otomatis — sengaja demikian agar Admin selalu memutuskan.
 */

// GET /api/v1/owner/operasi/backup/[backupId]/inspect?targetRoot=...
export async function GET(request: Request, { params }: { params: Promise<{ backupId: string }> }) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    await authenticateRequest(request, 'OWNER', { humanActivity: true });
    const { backupId } = await params;
    const url = new URL(request.url);
    // P16: target aman tunggal; default eksplisit.
    const targetRoot = url.searchParams.get('targetRoot') ?? '/sdcard/project/Madevi';
    const svc = new OperasiService(await getPool());
    const plan = await svc.inspectForRestore(backupId, targetRoot);
    return successResponse(plan, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

// POST /api/v1/owner/operasi/backup/[backupId]/verify
// Body: { readMode: 'disk' } — verifikasi membaca ulang file di disk.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ backupId: string }> },
) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const { backupId } = await params;
    await parseJsonObject(request).catch(() => ({}));

    // P16: verifikasi membaca ulang byte file. fs hanya di Node server;
    // import dinamis agar route tetap ringan saat tidak dipakai.
    const { readFile } = await import('node:fs/promises');
    const svc = new OperasiService(await getPool());
    const result = await svc.verifyBackup(backupId, async (filePath) => {
      return readFile(filePath);
    });

    return successResponse({ backupId, ...result, note: 'Backup terverifikasi' }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
