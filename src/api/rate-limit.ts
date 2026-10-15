import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';

export async function consumeRateLimit(
  pool: Pool,
  input: {
    principalId: string;
    bucket: string;
    maximum: number;
    windowSeconds: number;
    schema?: string;
  },
) {
  if (input.maximum < 1 || input.windowSeconds < 1) throw new Error('Konfigurasi rate limit salah');
  const schema = quotedSchema(input.schema);
  
  // Single atomic UPSERT to avoid SELECT FOR UPDATE locking overhead (O(1))
  const result = await pool.query<{ request_count: number }>(
    `INSERT INTO ${schema}.api_rate_limits AS r
       (principal_id, bucket, window_started_at, request_count)
     VALUES ($1, $2, CURRENT_TIMESTAMP, 1)
     ON CONFLICT (principal_id, bucket) DO UPDATE SET
       request_count = CASE
         WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 second' * $3) THEN 1
         ELSE r.request_count + 1
       END,
       window_started_at = CASE
         WHEN CURRENT_TIMESTAMP > r.window_started_at + (INTERVAL '1 second' * $3) THEN CURRENT_TIMESTAMP
         ELSE r.window_started_at
       END
     RETURNING request_count`,
    [input.principalId, input.bucket, input.windowSeconds]
  );

  const requestCount = result.rows[0].request_count;
  if (requestCount > input.maximum) {
    throw new ApiError('RATE_LIMITED', 'Batas permintaan terlampaui');
  }

  return { remaining: Math.max(0, input.maximum - requestCount) };
}
