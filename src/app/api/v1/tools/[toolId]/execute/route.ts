import { NextRequest, NextResponse } from 'next/server';

import { errorMessage } from '@/api/error-message';
import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { AccountsService } from '@/services/accounts';
import { ToolRegistry, validateToolInput, type ToolContext } from '@/contracts/tools-registry';
import { ALL_TOOLS } from '@/services/tools-registry-data';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * Inisialisasi registry sekali per proses (P10: registry tunggal).
 * Registrasi terjadi di import time; route generik membaca dari sini.
 */
const REGISTRY = new ToolRegistry();
for (const tool of ALL_TOOLS) REGISTRY.register(tool);

/**
 * Eksekusi alat generik (P10): route tunggal untuk SEMUA tool.
 *
 * Alur wajib (P10 + P06):
 *  1. Lookup tool di registry (404 bila tidak ada).
 *  2. Reserve trial SEBELUM proses (idempoten via idempotencyKey).
 *  3. Validasi input — byte nyata untuk file, batas total.
 *  4. Jalankan handler.
 *  5. Sukses → COMMIT trial (mengurangi sisa).
 *     Gagal/divalidasi gagal → RELEASE trial (tidak mengurangi).
 *  6. Kembalikan output + disclaimer kontekstual bila ada.
 *
 * P10 logika ekstra: "idempotency serta cleanup walau proses gagal".
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    // P17: rate limit per aksi — eksekusi tool memakai kuota trial/berbayar;
    // pembatasan IP mencegah pembakaran kuota via automation.
    // 0024 harus terpasang agar rate_limits_by_action tersedia.
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(
      clientIp(req),
      'tools_execute',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Batas penggunaan alat tercapai. Coba lagi nanti.'),
        requestId,
      );
    }
    const { toolId } = await params;
    const tool = REGISTRY.lookup(toolId);
    if (!tool) {
      return errorResponse(
        new ApiError('NOT_FOUND', `Alat "${toolId}" tidak ditemukan`),
        requestId,
      );
    }

    // Otentikasi: tool butuh sesi (trial/paket terikat principal).
    const auth = await authenticateRequest(req, 'MEMBER');
    await assertRequestCsrf(req, auth.sessionId, 'MEMBER');

    const body = await parseJsonObject(req);
    const idempotencyKey =
      typeof body.idempotencyKey === 'string' && body.idempotencyKey.trim().length > 0
        ? body.idempotencyKey.trim()
        : `tools-${toolId}-${Date.now()}`;

    const pool = await getPool();
    const accounts = new AccountsService(pool);

    // Pengecekan izin paket alat (L03):
    if (tool.packageAccess !== 'TRIAL') {
      const currentPkg = await accounts.currentEntitlementPackage(auth.principal.id);
      if (tool.packageAccess === 'PRO' && currentPkg !== 'PRO' && currentPkg !== 'LOVE') {
        return errorResponse(
          new ApiError('PACKAGE_INSUFFICIENT', 'Alat ini membutuhkan paket Pro.', {
            required: 'PRO',
            current: currentPkg,
          }),
          requestId,
          
        );
      }
      if (
        tool.packageAccess === 'PLUS' &&
        currentPkg !== 'PLUS' &&
        currentPkg !== 'PRO' &&
        currentPkg !== 'LOVE'
      ) {
        return errorResponse(
          new ApiError('PACKAGE_INSUFFICIENT', 'Alat ini membutuhkan paket Plus atau Pro.', {
            required: 'PLUS',
            current: currentPkg,
          }),
          requestId,
          
        );
      }
    }

    // 1. Reserve trial SEBELUM proses (P10: "Trial dipesan sebelum proses").
    const reserved = await accounts.reserveToolsTrial(auth.principal, {
      toolKind: toolId,
      idempotencyKey,
    });

    if (!reserved.allowed) {
      return errorResponse(
        new ApiError(
          'TRIAL_EXHAUSTED',
          'Masa trial Tools Anda sudah habis (5/5). Silakan upgrade ke paket Plus atau Pro.',
          { remaining: '0', total: '5', upgradeHint: 'PLUS' },
        ),
        requestId,
        
      );
    }

    // 2. Validasi input (byte nyata + batas).
    const ctx: ToolContext = {
      values: (body.values as Record<string, unknown>) ?? {},
    };
    const check = validateToolInput(tool, ctx);
    if (!check.valid) {
      // Validasi gagal → lepas reservasi, JANGAN kurangi trial.
      await accounts.releaseToolsTrial(auth.principal, idempotencyKey);
      return errorResponse(new ApiError('VALIDATION_FAILED', check.message), requestId);
    }

    try {
      // 3. Jalankan handler.
      const result = await tool.handler(ctx);

      // 4. Sukses → COMMIT (hanya inilah yang mengurangi trial).
      await accounts.commitToolsTrial(auth.principal, {
        toolKind: toolId,
        idempotencyKey,
      });

      return successResponse(
        {
          toolId,
          version: tool.version,
          output: result.output,
          steps: result.steps,
          file: result.file
            ? {
                name: result.file.name,
                mimeType: result.file.mimeType,
                sizeBytes: result.file.bytes.byteLength,
              }
            : undefined,
          reserved,
          disclaimer: tool.disclaimerKind ?? undefined,
        },
        requestId,
        { status: 200 },
      );
    } catch (err) {
      // 5. Proses gagal → RELEASE; pengguna tidak kehilangan jatah.
      await accounts.releaseToolsTrial(auth.principal, idempotencyKey).catch(() => {
        /* cleanup best-effort: jangan menutup error asli */
      });
      throw err;
    }
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/** Metadata tool untuk UI: schema + sisa trial (P10: "Free melihat sisa trial"). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  const requestId = requestIdFromHeaders(req.headers);
  try {
    const { toolId } = await params;
    const tool = REGISTRY.lookup(toolId);
    if (!tool) {
      return errorResponse(
        new ApiError('NOT_FOUND', `Alat "${toolId}" tidak ditemukan`),
        requestId,
      );
    }

    // Sisa trial untuk principal (bila login); guest lihat 0.
    let trialRemaining: number | null = null;
    try {
      const auth = await authenticateRequest(req, 'MEMBER');
      const pool = await getPool();
      const profile = await new AccountsService(pool).privateProfile(auth.principal);
      trialRemaining = profile.toolsTrial?.remaining ?? null;
    } catch {
      // Guest/tidak login: null = UI tunjukkan total paket saja.
    }

    return successResponse(
      {
        id: tool.id,
        version: tool.version,
        category: tool.category,
        name: tool.nameId,
        family: tool.family,
        risk: tool.risk,
        packageAccess: tool.packageAccess,
        retention: tool.retention,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
        maxInputBytes: tool.maxInputBytes,
        disclaimerKind: tool.disclaimerKind ?? undefined,
        trialRemaining,
      },
      requestId,
    );
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: errorMessage(error) }, requestId },
      { status: 500 },
    );
  }
}
