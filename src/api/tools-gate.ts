import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { AccountsService } from '@/services/accounts';

/**
 * Gate eksekusi Tools untuk endpoint yang melayani UI Tools secara langsung
 * (PDF process & rumus compute) sehingga TIDAK bisa dilewati guest.
 *
 * Route generik `tools/[toolId]/execute` memakai logika yang sama; helper ini
 * untuk endpoint lama yang masih dipanggi langsung oleh UI jasa/alat bantu.
 *
 * Kontrak `05-KONTRAK-AKSES` + L03:
 *  - wajib sesi MEMBER: trial/paket terikat principal, guest tidak bisa bypass.
 *  - CSRF wajib (double-submit token).
 *  - paket PLUS/PRO/LOVE → Tools penuh, tidak memakan trial.
 *  - Free → reserve SEBELUM proses; COMMIT hanya pada sukses; RELEASE pada gagal.
 *  - idempoten terhadap retry/refresh ganda via `idempotencyKey`.
 *
 * Lempar `ApiError` (dipetakan otomatis oleh errorResponse) bila:
 *  - `AUTHENTICATION_REQUIRED` (guest), atau
 *  - `TRIAL_EXHAUSTED` (Free 5/5 habis) — UI memakai kode ini untuk
 *    menampilkan status akses yang dapat ditindaklanjuti.
 */
export async function guardToolExecution(
  request: Request,
  toolKind: string,
  idempotencyKey: string,
) {
  const auth = await authenticateRequest(request, 'MEMBER');
  await assertRequestCsrf(request, auth.sessionId, 'MEMBER');

  const accounts = new AccountsService(await getPool());
  const reserved = await accounts.reserveToolsTrial(auth.principal, {
    toolKind,
    idempotencyKey,
  });
  if (!reserved.allowed) {
    throw new ApiError(
      'TRIAL_EXHAUSTED',
      'Masa trial Tools Anda sudah habis (5 dari 5 eksekusi). Silakan upgrade ke paket Plus atau Pro.',
      { remaining: '0', total: '5', upgradeHint: 'PLUS' },
    );
  }
  return { auth, accounts, reserved };
}
