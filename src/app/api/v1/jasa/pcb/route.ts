import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { ApiError } from '@/api/errors';
import { JasaService } from '@/services/jasa';
import { getDatabaseClients } from '@/db/client';
import { SecurityService } from '@/services/security';
import { clientIp } from '@/server/client-ip';

export const dynamic = 'force-dynamic';

const service = () => new JasaService(getDatabaseClients().pool);

const LAYERS = [1, 2, 4, 6, 8];
const SHAPES = ['RECTANGULAR', 'CIRCULAR', 'CUSTOM'];
const DELIVERABLES = [
  'GERBER_RS274X',
  'DRILL_NC',
  'BOM_CSV',
  'PICK_AND_PLACE',
  'STEP_3D',
  'SCHEMATIC_PRINT',
];

function num(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

/** GET /api/v1/jasa/pcb — order PCB milik saya (login). */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const auth = await authenticateRequest(request, 'MEMBER');
    const orders = await service().listMyServiceOrders(auth.principal.id, ['PCB_LAYOUT']);
    return successResponse(orders, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

/**
 * POST /api/v1/jasa/pcb — buat order desain layout PCB dari brief.
 * Guest boleh mulai; principal & CSRF hanya bila ada sesi member.
 * Disclaimer wajib disetujui; bukan jaminan produksi/keamanan perangkat.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P1 fix (audit 2026-10-15): rate limit order jasa.
    const guard = await new SecurityService(getDatabaseClients().pool).checkActionRateLimit(
      clientIp(request),
      'jasa_order',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Terlalu banyak order. Coba lagi nanti.'),
        requestId,
      );
    }

    let principalId: string | undefined;
    try {
      const auth = await authenticateRequest(request, 'MEMBER');
      await assertRequestCsrf(request, auth.sessionId, 'MEMBER');
      principalId = auth.principal.id;
    } catch {
      principalId = undefined;
    }

    const body = await parseJsonObject(request, 128 * 1024);
    const brief = (body.brief && typeof body.brief === 'object' ? body.brief : {}) as Record<
      string,
      unknown
    >;
    const dimensions = (brief.dimensions && typeof brief.dimensions === 'object' ? brief.dimensions : {}) as Record<string, unknown>;
    const voltage = (brief.operatingVoltage && typeof brief.operatingVoltage === 'object' ? brief.operatingVoltage : {}) as Record<string, unknown>;
    const current = (brief.operatingCurrent && typeof brief.operatingCurrent === 'object' ? brief.operatingCurrent : {}) as Record<string, unknown>;
    const mech = (brief.mechanicalConstraints && typeof brief.mechanicalConstraints === 'object' ? brief.mechanicalConstraints : {}) as Record<string, unknown>;
    const mfg = (brief.manufacturing && typeof brief.manufacturing === 'object' ? brief.manufacturing : {}) as Record<string, unknown>;
    const flags = (brief.safetyFlags && typeof brief.safetyFlags === 'object' ? brief.safetyFlags : {}) as Record<string, unknown>;

    const layerCount = num(brief.layerCount);
    if (layerCount === undefined || !LAYERS.includes(layerCount)) {
      throw new ApiError('VALIDATION_FAILED', 'Jumlah layer harus 1, 2, 4, 6, atau 8');
    }
    const shape = typeof brief.shape === 'string' && SHAPES.includes(brief.shape) ? brief.shape : 'RECTANGULAR';
    const widthMm = num(dimensions.widthMm);
    const heightMm = num(dimensions.heightMm);
    if (widthMm === undefined || heightMm === undefined || widthMm <= 0 || heightMm <= 0) {
      throw new ApiError('VALIDATION_FAILED', 'Dimensi board tidak valid');
    }
    const circuitDescription =
      typeof brief.circuitDescription === 'string' ? brief.circuitDescription.trim() : '';
    if (circuitDescription.length < 20 || circuitDescription.length > 8000) {
      throw new ApiError('VALIDATION_FAILED', 'Deskripsi rangkaian wajib 20–8000 karakter');
    }
    const deliverables = Array.isArray(brief.requestedDeliverables)
      ? brief.requestedDeliverables.filter((d): d is string => typeof d === 'string' && DELIVERABLES.includes(d))
      : [];
    if (!deliverables.length) {
      throw new ApiError('VALIDATION_FAILED', 'Pilih minimal satu deliverable');
    }
    const bool = (v: unknown) => v === true;
    const fixedPrice = num(body.fixedPrice) ?? 0;

    const order = await service().createPcbOrder({
      principalId,
      catalogItemId: typeof body.catalogItemId === 'string' ? body.catalogItemId : undefined,
      fixedPrice,
      brief: {
        circuitDescription,
        dimensions: {
          widthMm,
          heightMm,
          shape: shape as 'RECTANGULAR' | 'CIRCULAR' | 'CUSTOM',
        },
        layerCount: layerCount as 1 | 2 | 4 | 6 | 8,
        stackUpNotes: typeof brief.stackUpNotes === 'string' ? brief.stackUpNotes.slice(0, 2000) : undefined,
        componentCountEst: num(brief.componentCountEst),
        criticalFootprints: Array.isArray(brief.criticalFootprints)
          ? brief.criticalFootprints.filter((f): f is string => typeof f === 'string').slice(0, 50)
          : [],
        operatingVoltage: {
          minVolt: num(voltage.minVolt) ?? 0,
          maxVolt: num(voltage.maxVolt) ?? 0,
        },
        operatingCurrent: { maxAmpere: num(current.maxAmpere) ?? 0 },
        mechanicalConstraints: {
          mountingHoles: bool(mech.mountingHoles),
          mountingHoleDiaMm: num(mech.mountingHoleDiaMm),
          keepOutZones: typeof mech.keepOutZones === 'string' ? mech.keepOutZones.slice(0, 2000) : undefined,
          enclosureFit: typeof mech.enclosureFit === 'string' ? mech.enclosureFit.slice(0, 2000) : undefined,
        },
        manufacturing: {
          targetFabHouse: typeof mfg.targetFabHouse === 'string' ? mfg.targetFabHouse.slice(0, 120) : undefined,
        },
        safetyFlags: {
          hasMainsVoltage: bool(flags.hasMainsVoltage),
          hasLithiumBattery: bool(flags.hasLithiumBattery),
          hasRfWireless: bool(flags.hasRfWireless),
          hasHighCurrent: bool(flags.hasHighCurrent),
          isSafetyCritical: bool(flags.isSafetyCritical),
        },
        riskLevel: 'LOW',
        inputFiles: [],
        requestedDeliverables: deliverables as Array<
          'GERBER_RS274X' | 'DRILL_NC' | 'BOM_CSV' | 'PICK_AND_PLACE' | 'STEP_3D' | 'SCHEMATIC_PRINT'
        >,
        deadlineNotes: typeof brief.deadlineNotes === 'string' ? brief.deadlineNotes.slice(0, 2000) : undefined,
        disclaimerAcknowledged: brief.disclaimerAcknowledged === true,
      },
    });

    return successResponse(order, requestId, { status: 201 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
