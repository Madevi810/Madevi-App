import crypto from 'node:crypto';

import type { PoolClient } from 'pg';

import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';

export function payloadHash(payload: unknown) {
  return crypto.createHash('sha256').update(stableJson(payload)).digest('hex');
}

export async function beginIdempotentOperation(
  client: PoolClient,
  input: {
    principalId: string;
    operation: string;
    key: string;
    payload: unknown;
    schema?: string;
  },
) {
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(input.key)) {
    throw new ApiError('VALIDATION_FAILED', 'Idempotency-Key tidak valid', {
      idempotencyKey: '8–128 karakter aman',
    });
  }
  const schema = quotedSchema(input.schema);
  const hash = payloadHash(input.payload);
  const inserted = await client.query(
    `INSERT INTO ${schema}.idempotency_records
       (principal_id, operation, idempotency_key, payload_hash, expires_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP + INTERVAL '24 hours')
     ON CONFLICT DO NOTHING
     RETURNING payload_hash`,
    [input.principalId, input.operation, input.key, hash],
  );
  if (inserted.rowCount === 1) return { replay: false as const, hash };
  const existing = await client.query<{
    payload_hash: string;
    state: 'STARTED' | 'COMPLETED';
    response_status: number | null;
    response_body: unknown;
  }>(
    `SELECT payload_hash, state, response_status, response_body
       FROM ${schema}.idempotency_records
      WHERE principal_id = $1 AND operation = $2 AND idempotency_key = $3
      FOR UPDATE`,
    [input.principalId, input.operation, input.key],
  );
  const row = existing.rows[0];
  if (!row || row.payload_hash !== hash) {
    throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key sudah dipakai untuk payload berbeda');
  }
  if (row.state !== 'COMPLETED') {
    throw new ApiError('IDEMPOTENCY_CONFLICT', 'Operasi dengan key ini sedang diproses');
  }
  return {
    replay: true as const,
    status: row.response_status ?? 200,
    body: row.response_body,
    hash,
  };
}

export async function completeIdempotentOperation(
  client: PoolClient,
  input: {
    principalId: string;
    operation: string;
    key: string;
    status: number;
    body: unknown;
    schema?: string;
  },
) {
  const schema = quotedSchema(input.schema);
  await client.query(
    `UPDATE ${schema}.idempotency_records
        SET state = 'COMPLETED', response_status = $4, response_body = $5::jsonb
      WHERE principal_id = $1 AND operation = $2 AND idempotency_key = $3`,
    [input.principalId, input.operation, input.key, input.status, JSON.stringify(input.body)],
  );
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}
