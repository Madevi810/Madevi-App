import { errorResponse, successResponse } from '@/api/response';
import { authenticateMemberOrOwner, assertSchoolAccess } from '@/app/api/v1/exams/route-utils';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema, quotedSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';

export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // L03 AC4: daftar katalog School penuh bukan brosur publik.
    // Fail-closed: tamu/Free tanpa entitlement mendapat AUTHENTICATION_REQUIRED /
    // PACKAGE_INSUFFICIENT; UI menampilkan brosur/modal sebagai konsekuensi,
    // bukan pengganti gate. Brosur statis tetap di `/brosur-sekolah`.
    const auth = await authenticateMemberOrOwner(request);
    await assertSchoolAccess(auth.principal.id);
    const limit = Math.min(
      Math.max(Number(new URL(request.url).searchParams.get('limit') ?? '50'), 1),
      100,
    );
    const { pool } = getDatabaseClients();
    const schema = quotedSchema(getDatabaseSchema());
    const result = await pool.query(
      `SELECT lp.id, lp.name, lp.description, lp.difficulty, lp.minimum_score, lp.estimated_hours, lp.status,
              (SELECT COUNT(*)::int FROM ${schema}.learning_path_articles lpa WHERE lpa.path_id = lp.id) AS "articleCount"
         FROM ${schema}.learning_paths lp
        WHERE lp.status = 'ACTIVE'
        ORDER BY lp.created_at ASC, lp.id ASC
        LIMIT $1`,
      [limit],
    );
    return successResponse(result.rows, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
