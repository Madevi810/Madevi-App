import { errorResponse, successResponse } from '@/api/response';
import { guardToolExecution } from '@/api/tools-gate';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { UtilitiesService } from '@/services/utilities';
import { getDatabaseClients } from '@/db/client';

export const dynamic = 'force-dynamic';

const service = () => new UtilitiesService(getDatabaseClients().pool);

/** GET /api/v1/utilities/rumus?category=MATH — daftar rumus (publik, hanya baca) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const valid =
      category === 'MATH' || category === 'PHYSICS' || category === 'FINANCE'
        ? category
        : undefined;
    return successResponse(service().listFormulas(valid), requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/utilities/rumus — eksekusi rumus.
 *
 * L03: eksekusi memakan slot Tools (kontrak 05). Wajib sesi MEMBER + CSRF +
 * gate trial/paket, idempoten via `idempotencyKey`. Input tidak valid atau
 * proses gagal → release (tidak mengurangi sisa trial Free).
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const body = await parseJsonObject(request, 64 * 1024);
    const formulaId = typeof body.formulaId === 'string' ? body.formulaId : '';
    const values =
      body.values && typeof body.values === 'object' && !Array.isArray(body.values)
        ? (body.values as Record<string, string>)
        : {};

    const rawKey = body.idempotencyKey;
    const idempotencyKey =
      typeof rawKey === 'string' && rawKey.trim().length > 0
        ? rawKey.trim()
        : `rumus-${formulaId}-${Date.now()}`;
    const gate = await guardToolExecution(request, `rumus-${formulaId}`, idempotencyKey);

    try {
      const result = service().computeFormula(formulaId, values);
      await gate.accounts.commitToolsTrial(gate.auth.principal, {
        toolKind: `rumus-${formulaId}`,
        idempotencyKey,
      });
      return successResponse(result, requestId);
    } catch (error) {
      await gate.accounts.releaseToolsTrial(gate.auth.principal, idempotencyKey).catch(() => {
        /* best-effort cleanup: jangan menutup error asli */
      });
      throw error;
    }
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
