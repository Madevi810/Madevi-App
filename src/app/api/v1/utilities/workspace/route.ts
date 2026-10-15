import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { UtilitiesService } from '@/services/utilities';
import { getDatabaseClients } from '@/db/client';
import { validateCircuit } from '@/lib/emulator/circuit-model';

export const dynamic = 'force-dynamic';

const service = () => new UtilitiesService(getDatabaseClients().pool);

/** GET /api/v1/utilities/workspace?kind=RUMUS — daftar tersimpan (pemilik) */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind') || 'RUMUS';
    const validKinds = ['RUMUS', 'PDF', 'CV', 'PORTOFOLIO', 'IMAGE', 'EMULATOR'];
    if (!validKinds.includes(kind)) {
      throw new ApiError('VALIDATION_FAILED', 'Kind workspace tidak valid.');
    }
    const result = await service().listSaved(auth.principal.id, kind);
    return successResponse(result.rows, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** POST /api/v1/utilities/workspace — simpan privat (login-only) */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
    const body = await parseJsonObject(request, 256 * 1024);
    const kind = typeof body.kind === 'string' ? body.kind : '';
    const validKinds = ['RUMUS', 'PDF', 'CV', 'PORTOFOLIO', 'IMAGE', 'EMULATOR'];
    if (!validKinds.includes(kind)) {
      throw new ApiError('VALIDATION_FAILED', 'Kind tidak valid.');
    }
    const maximumBodyBytes = kind === 'EMULATOR' ? 256 * 1024 : 64 * 1024;
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > maximumBodyBytes) {
      throw new ApiError('PAYLOAD_TOO_LARGE', 'Payload terlalu besar');
    }

    let inputPayload: Record<string, unknown>;
    let resultPayload: Record<string, unknown>;
    let title: string;
    let isPrivate: boolean;
    if (kind === 'EMULATOR') {
      const allowedKeys = ['kind', 'title', 'input', 'result', 'isPrivate'];
      if (Object.keys(body).some((key) => !allowedKeys.includes(key))) {
        throw new ApiError('VALIDATION_FAILED', 'Field workspace emulator tidak valid.');
      }
      const input = body.input;
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new ApiError('VALIDATION_FAILED', 'Skema emulator tidak valid.');
      }
      const inputRecord = input as Record<string, unknown>;
      if (Object.keys(inputRecord).length !== 1 || !Object.prototype.hasOwnProperty.call(inputRecord, 'circuit')) {
        throw new ApiError('VALIDATION_FAILED', 'Payload emulator hanya menerima skema circuit.');
      }
      if (body.result !== undefined) {
        if (!body.result || typeof body.result !== 'object' || Array.isArray(body.result) || Object.keys(body.result).length > 0) {
          throw new ApiError('VALIDATION_FAILED', 'Hasil emulator dihitung lokal dan tidak diterima dari klien.');
        }
      }
      if (body.isPrivate !== true) {
        throw new ApiError('VALIDATION_FAILED', 'Workspace emulator harus privat.');
      }
      const rawTitle = typeof body.title === 'string' ? body.title.trim() : '';
      if (!rawTitle || rawTitle.length > 200) {
        throw new ApiError('VALIDATION_FAILED', 'Judul workspace harus 1–200 karakter.');
      }
      inputPayload = { circuit: validateCircuit(inputRecord.circuit) };
      resultPayload = {};
      title = rawTitle;
      isPrivate = true;
    } else {
      inputPayload = (body.input as Record<string, unknown>) ?? {};
      resultPayload = (body.result as Record<string, unknown>) ?? {};
      title = typeof body.title === 'string' ? body.title : 'Tanpa judul';
      isPrivate = body.isPrivate !== false;
    }

    const saved = await service().saveResult(auth.principal.id, {
      kind: kind as 'RUMUS' | 'PDF' | 'CV' | 'PORTOFOLIO' | 'IMAGE' | 'EMULATOR',
      title,
      inputPayload,
      resultPayload,
      isPrivate,
    });
    return successResponse(saved, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** DELETE /api/v1/utilities/workspace/[id] — hapus (pemilik saja) */
