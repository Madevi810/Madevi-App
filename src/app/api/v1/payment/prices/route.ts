import { errorResponse, successResponse } from '@/api/response';
import { getPool } from '@/db/pool';
import { quotedSchema } from '@/db/schema-name';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/** Harga publik paket; sumber tunggal tetap payment_settings di server. */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const schema = quotedSchema(process.env.MADEVI_DB_SCHEMA ?? 'madevi');
    const result = await (await getPool()).query<{ key: string; amount: string }>(
      `SELECT key, amount FROM ${schema}.payment_settings
        WHERE key IN ('PLUS_PRICE', 'PRO_PRICE', 'UPGRADE_PLUS_TO_PRO')
          AND active = true`,
    );
    const prices = { PLUS: null as number | null, PRO: null as number | null, UPGRADE: null as number | null };
    for (const row of result.rows) {
      if (row.key === 'PLUS_PRICE') prices.PLUS = Number(row.amount);
      if (row.key === 'PRO_PRICE') prices.PRO = Number(row.amount);
      if (row.key === 'UPGRADE_PLUS_TO_PRO') prices.UPGRADE = Number(row.amount);
    }
    return successResponse(prices, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
