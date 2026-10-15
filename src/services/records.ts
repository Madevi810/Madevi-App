import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { decodeCursor, encodeCursor } from '@/api/pagination';
import { canReadOwnedRecord, requireApproved, requirePrincipal } from '@/api/policy';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import type { Principal } from '@/contracts/services';
import { beginIdempotentOperation, completeIdempotentOperation } from '@/api/idempotency';
import { appendAuditEvent } from '@/services/audit';

interface RecordRow {
  id: string;
  business_code: string;
  owner_principal_id: string;
  label: string;
  created_at: Date;
  version: string;
}

export class RecordsService {
  constructor(
    private readonly pool: Pool,
    private readonly schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {}

  async list(input: {
    principal: Principal | null;
    limit: number;
    cursor: string | null;
    ownerPrincipalId?: string;
    filter?: string;
    sort?: 'createdAt:asc' | 'createdAt:desc';
  }) {
    const principal = requirePrincipal(input.principal);
    requireApproved(principal);
    const schema = quotedSchema(this.schemaName);
    const cursor = decodeCursor(input.cursor);
    const owner =
      principal.role === 'OWNER' && input.ownerPrincipalId ? input.ownerPrincipalId : principal.id;
    const sort = input.sort ?? 'createdAt:desc';
    const direction = sort === 'createdAt:asc' ? 'ASC' : 'DESC';
    const comparator = direction === 'ASC' ? '>' : '<';
    const values: unknown[] = [owner];
    const conditions = ['owner_principal_id = $1', 'deleted_at IS NULL'];
    if (cursor) {
      values.push(cursor.occurredAt, cursor.id);
      conditions.push(
        `(created_at, id) ${comparator} ($${values.length - 1}::timestamptz, $${values.length}::uuid)`,
      );
    }
    if (input.filter) {
      values.push(`%${input.filter}%`);
      conditions.push(`label ILIKE $${values.length}`);
    }
    values.push(input.limit + 1);
    const result = await this.pool.query<RecordRow>(
      `SELECT id, business_code, owner_principal_id, label, created_at, version
         FROM ${schema}.api_records
        WHERE ${conditions.join(' AND ')}
        ORDER BY created_at ${direction}, id ${direction}
        LIMIT $${values.length}`,
      values,
    );
    const hasMore = result.rows.length > input.limit;
    const rows = result.rows.slice(0, input.limit);
    const last = rows.at(-1);
    return {
      data: rows.map(publicRecord),
      page: {
        limit: input.limit,
        nextCursor:
          hasMore && last
            ? encodeCursor({ occurredAt: last.created_at.toISOString(), id: last.id })
            : null,
      },
    };
  }

  async get(input: { principal: Principal | null; id: string }) {
    const principal = requirePrincipal(input.principal);
    requireApproved(principal);
    requireUuid(input.id);
    const schema = quotedSchema(this.schemaName);
    const result = await this.pool.query<RecordRow>(
      `SELECT id, business_code, owner_principal_id, label, created_at, version
         FROM ${schema}.api_records
        WHERE id = $1 AND deleted_at IS NULL`,
      [input.id],
    );
    const row = result.rows[0];
    if (!row || !canReadOwnedRecord(principal, row.owner_principal_id)) {
      throw new ApiError('NOT_FOUND', 'Objek tidak ditemukan');
    }
    return publicRecord(row);
  }

  async create(input: { principal: Principal | null; label: string; idempotencyKey: string }) {
    const principal = requirePrincipal(input.principal);
    requireApproved(principal);
    const schema = quotedSchema(this.schemaName);
    return inTransaction(this.pool, async (client) => {
      const operation = 'api-record.create';
      const idempotency = await beginIdempotentOperation(client, {
        principalId: principal.id,
        operation,
        key: input.idempotencyKey,
        payload: { label: input.label },
        schema: this.schemaName,
      });
      if (idempotency.replay) return idempotency.body;
      const id = randomUUID();
      const inserted = await client.query<RecordRow>(
        `INSERT INTO ${schema}.api_records
           (id, owner_principal_id, label, visibility, created_by, updated_by)
         VALUES ($1, $2, $3, 'OWNER_ADMIN', $2, $2)
         RETURNING id, business_code, owner_principal_id, label, created_at, version`,
        [id, principal.id, input.label],
      );
      const body = publicRecord(inserted.rows[0]!);
      await appendAuditEvent(client, {
        actorPrincipalId: principal.id,
        eventType: 'API_RECORD_CREATED',
        objectType: 'api_record',
        objectId: id,
        details: { label: input.label },
        fixture: principal.fixture,
        schema: this.schemaName,
      });
      await completeIdempotentOperation(client, {
        principalId: principal.id,
        operation,
        key: input.idempotencyKey,
        status: 201,
        body,
        schema: this.schemaName,
      });
      return body;
    });
  }

  async update(input: {
    principal: Principal | null;
    id: string;
    label: string;
    expectedVersion: number;
  }) {
    const principal = requirePrincipal(input.principal);
    requireApproved(principal);
    requireUuid(input.id);
    if (!Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 1) {
      throw new ApiError('VALIDATION_FAILED', 'Versi objek tidak valid');
    }
    const schema = quotedSchema(this.schemaName);
    return inTransaction(this.pool, async (client) => {
      const updated = await client.query<RecordRow>(
        `UPDATE ${schema}.api_records
            SET label = $3, updated_at = CURRENT_TIMESTAMP,
                updated_by = $2, version = version + 1
          WHERE id = $1 AND owner_principal_id = $2
            AND version = $4 AND deleted_at IS NULL
        RETURNING id, business_code, owner_principal_id, label, created_at, version`,
        [input.id, principal.id, input.label, input.expectedVersion],
      );
      const row = updated.rows[0];
      if (!row) {
        const current = await client.query<{ owner_principal_id: string; version: string }>(
          `SELECT owner_principal_id, version FROM ${schema}.api_records
            WHERE id = $1 AND deleted_at IS NULL`,
          [input.id],
        );
        if (
          !current.rows[0] ||
          !canReadOwnedRecord(principal, current.rows[0].owner_principal_id)
        ) {
          throw new ApiError('NOT_FOUND', 'Objek tidak ditemukan');
        }
        throw new ApiError('VERSION_CONFLICT', 'Objek telah berubah; muat ulang versi terbaru');
      }
      await appendAuditEvent(client, {
        actorPrincipalId: principal.id,
        eventType: 'API_RECORD_UPDATED',
        objectType: 'api_record',
        objectId: input.id,
        details: { expectedVersion: input.expectedVersion },
        fixture: principal.fixture,
        schema: this.schemaName,
      });
      return publicRecord(row);
    });
  }
}

function publicRecord(row: RecordRow) {
  return {
    id: row.id,
    code: row.business_code,
    label: row.label,
    ownerPrincipalId: row.owner_principal_id,
    createdAt: row.created_at.toISOString(),
    version: Number(row.version),
  };
}

function requireUuid(value: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new ApiError('VALIDATION_FAILED', 'ID tidak valid', { id: 'UUID' });
  }
}
