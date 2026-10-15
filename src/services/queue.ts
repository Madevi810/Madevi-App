import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { payloadHash } from '@/api/idempotency';
import { quotedSchema } from '@/db/schema-name';

export class PostgresJobQueue {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async enqueue(input: { jobType: string; payload: unknown; idempotencyKey: string }) {
    const result = await this.pool.query<{ id: string }>(
      `INSERT INTO ${this.schema}.jobs (id, job_type, payload, idempotency_key)
       VALUES ($1, $2, $3::jsonb, $4)
       ON CONFLICT (idempotency_key) DO NOTHING
       RETURNING id`,
      [randomUUID(), input.jobType, JSON.stringify(input.payload), input.idempotencyKey],
    );
    let jobId = result.rows[0]?.id;
    if (!jobId) {
      const existing = await this.pool.query<{ id: string; job_type: string; payload: unknown }>(
        `SELECT id, job_type, payload FROM ${this.schema}.jobs WHERE idempotency_key = $1`,
        [input.idempotencyKey],
      );
      const row = existing.rows[0]!;
      if (
        row.job_type !== input.jobType ||
        payloadHash(row.payload) !== payloadHash(input.payload)
      ) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key job dipakai untuk payload berbeda');
      }
      jobId = row.id;
    }
    return { jobId };
  }

  async claim(workerId: string) {
    const result = await this.pool.query(
      `UPDATE ${this.schema}.jobs
          SET status = 'LEASED', lease_owner = $1,
              leased_until = CURRENT_TIMESTAMP + INTERVAL '30 seconds',
              attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = (
          SELECT id FROM ${this.schema}.jobs
           WHERE status IN ('PENDING', 'LEASED')
             AND available_at <= CURRENT_TIMESTAMP
             AND (status = 'PENDING' OR leased_until < CURRENT_TIMESTAMP)
           ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1
        )
      RETURNING id, job_type, payload, attempts, max_attempts`,
      [workerId],
    );
    return result.rows[0] ?? null;
  }

  async complete(jobId: string, workerId: string) {
    const result = await this.pool.query(
      `UPDATE ${this.schema}.jobs
          SET status = 'DONE', leased_until = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'LEASED' AND lease_owner = $2
      RETURNING id`,
      [jobId, workerId],
    );
    return result.rowCount === 1;
  }

  async fail(jobId: string, workerId: string, errorCode: string) {
    const result = await this.pool.query(
      `UPDATE ${this.schema}.jobs
          SET status = CASE WHEN attempts >= max_attempts THEN 'DEAD' ELSE 'PENDING' END,
              available_at = CURRENT_TIMESTAMP + INTERVAL '1 second' * LEAST(300, power(2, attempts)),
              leased_until = NULL, lease_owner = NULL, last_error_code = $3,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'LEASED' AND lease_owner = $2
      RETURNING status`,
      [jobId, workerId, errorCode.slice(0, 80)],
    );
    return result.rows[0]?.status ?? null;
  }
}
