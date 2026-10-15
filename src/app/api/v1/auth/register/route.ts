import { ApiError } from '@/api/errors';
import { errorResponse, successResponse } from '@/api/response';
import { parseJsonObject } from '@/api/validation';
import { requestIdFromHeaders } from '@/server/request-id';
import { clientIp } from '@/server/client-ip';
import { getPool } from '@/db/pool';
import { SecurityService } from '@/services/security';
import { accountsService, bodyText, optionalBodyText } from '@/app/api/v1/auth/route-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // P17: rate limit per aksi — register adalah spam/trial-abuse vector.
    // 0024 harus terpasang agar rate_limits_by_action tersedia.
    const guard = await new SecurityService(await getPool()).checkActionRateLimit(
      clientIp(request),
      'register',
    );
    if (!guard.allowed) {
      return errorResponse(
        new ApiError('RATE_LIMITED', 'Terlalu banyak pendaftaran. Coba lagi nanti.'),
        requestId,
      );
    }
    const body = await parseJsonObject(request, 128 * 1024);
    // L03: pendaftaran baru tidak menerima wali. Field legacy `guardian` /
    // `noGuardianReason` bila dikirim client lama sengaja diabaikan: tidak
    // diteruskan ke service sehingga tidak memberi efek akses. Data legacy
    // yang sudah tersimpan tidak dihapus (retensi terpisah).
    const result = await accountsService().register({
      fullName: bodyText(body, 'fullName', 120),
      username: bodyText(body, 'username', 32),
      email: optionalBodyText(body, 'email'),
      phone: optionalBodyText(body, 'phone'),
      password: bodyText(body, 'password', 128),
      gender: body.gender as 'PEREMPUAN' | 'LAKI_LAKI' | 'LAINNYA',
      birthDate: bodyText(body, 'birthDate', 10),
      city: bodyText(body, 'city', 120),
      educationStatus: body.educationStatus as
        'TIDAK_BERSEKOLAH' | 'ALUMNI' | 'SD' | 'SMP' | 'SMA_SMK' | 'PERGURUAN_TINGGI',
    });
    return successResponse(result, requestId, { status: 202 });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
