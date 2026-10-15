import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import {
  beginIdempotentOperation,
  completeIdempotentOperation,
  payloadHash,
} from '@/api/idempotency';
import { decodeCursor, encodeCursor } from '@/api/pagination';
import { requireApproved } from '@/api/policy';
import type { NotificationOutbox, OwnerInbox, Principal } from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';

export class PostgresNotificationOutbox implements NotificationOutbox {
  private readonly schemaName: string;
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schemaName = schemaName;
    this.schema = quotedSchema(schemaName);
  }

  async enqueue(input: {
    principal: Principal;
    notificationType: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
  }) {
    requireApproved(input.principal);
    if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(input.notificationType)) {
      throw new ApiError('VALIDATION_FAILED', 'Jenis notifikasi tidak valid');
    }
    if (!/^[A-Za-z0-9._:-]{8,128}$/.test(input.idempotencyKey)) {
      throw new ApiError('VALIDATION_FAILED', 'Idempotency key tidak valid');
    }
    return inTransaction(this.pool, async (client) => {
      const operation = `notification-outbox.enqueue:${input.notificationType}`;
      const idempotency = await beginIdempotentOperation(client, {
        principalId: input.principal.id,
        operation,
        key: input.idempotencyKey,
        payload: input.payload,
        schema: this.schemaName,
      });
      if (idempotency.replay) return idempotency.body as { outboxId: string };

      const id = randomUUID();
      const storedPayload = redactStoredNotificationFields(input.payload);
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO ${this.schema}.notification_outbox
           (id, principal_id, notification_type, payload, idempotency_key)
         VALUES ($1, $2, $3, $4::jsonb, $5)
         ON CONFLICT (principal_id, notification_type, idempotency_key)
         DO NOTHING
         RETURNING id`,
        [
          id,
          input.principal.id,
          input.notificationType,
          JSON.stringify(storedPayload),
          input.idempotencyKey,
        ],
      );
      let outboxId = inserted.rows[0]?.id;
      if (!outboxId) {
        const existing = await client.query<{ id: string; payload: Record<string, unknown> }>(
          `SELECT id, payload FROM ${this.schema}.notification_outbox
            WHERE principal_id = $1 AND notification_type = $2 AND idempotency_key = $3`,
          [input.principal.id, input.notificationType, input.idempotencyKey],
        );
        const row = existing.rows[0]!;
        if (payloadHash(row.payload) !== payloadHash(storedPayload)) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key outbox dipakai untuk payload berbeda');
        }
        outboxId = row.id;
      } else {
        await appendAuditEvent(client, {
          actorPrincipalId: input.principal.id,
          eventType: 'OUTBOX_ENQUEUED',
          objectType: 'notification_outbox',
          objectId: outboxId,
          details: { notificationType: input.notificationType },
          fixture: input.principal.fixture,
          schema: this.schema.slice(1, -1),
        });
      }
      const response = { outboxId };
      await completeIdempotentOperation(client, {
        principalId: input.principal.id,
        operation,
        key: input.idempotencyKey,
        status: 202,
        body: response,
        schema: this.schemaName,
      });
      return response;
    });
  }

  async deliverNext(input: {
    workerId: string;
    simulateFailure?: boolean;
    simulateCrashBeforeCommit?: boolean;
  }) {
    if (!/^[a-zA-Z0-9._-]{3,80}$/.test(input.workerId)) throw new Error('Worker ID tidak valid');
    return inTransaction(this.pool, async (client) => {
      const claimed = await client.query<{
        id: string;
        principal_id: string;
        notification_type: string;
        payload: Record<string, unknown>;
        attempts: number;
        max_attempts: number;
      }>(
        `SELECT id, principal_id, notification_type, payload, attempts, max_attempts
           FROM ${this.schema}.notification_outbox
          WHERE status IN ('PENDING', 'LEASED')
            AND available_at <= CURRENT_TIMESTAMP
            AND (status = 'PENDING' OR leased_until < CURRENT_TIMESTAMP)
          ORDER BY created_at
          FOR UPDATE SKIP LOCKED
          LIMIT 1`,
      );
      const row = claimed.rows[0];
      if (!row) return null;
      await client.query(
        `UPDATE ${this.schema}.notification_outbox
            SET status = 'LEASED', lease_owner = $2,
                leased_until = CURRENT_TIMESTAMP + INTERVAL '30 seconds',
                attempts = attempts + 1
          WHERE id = $1`,
        [row.id, input.workerId],
      );
      if (input.simulateFailure) {
        const dead = row.attempts + 1 >= row.max_attempts;
        await client.query(
          `UPDATE ${this.schema}.notification_outbox
              SET status = $2,
                  available_at = CURRENT_TIMESTAMP + INTERVAL '1 second' * LEAST(300, power(2, attempts)),
                  leased_until = NULL, lease_owner = NULL, last_error_code = 'SIMULATED_FAILURE'
            WHERE id = $1`,
          [row.id, dead ? 'DEAD' : 'PENDING'],
        );
        return { outboxId: row.id, status: dead ? 'DEAD' : 'PENDING' };
      }
      const subject = `[${row.notification_type}] ${row.principal_id.slice(0, 8)}`;
      const body = JSON.stringify(row.payload);
      await client.query(
        `INSERT INTO ${this.schema}.owner_mailbox
           (id, outbox_id, recipient_principal_id, subject, body_text)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (outbox_id) DO NOTHING`,
        [randomUUID(), row.id, row.principal_id, subject, body],
      );
      if (input.simulateCrashBeforeCommit) throw new Error('SIMULATED_CRASH_BEFORE_COMMIT');
      await client.query(
        `UPDATE ${this.schema}.notification_outbox
            SET status = 'DELIVERED', delivered_at = CURRENT_TIMESTAMP,
                leased_until = NULL, lease_owner = NULL, last_error_code = NULL
          WHERE id = $1`,
        [row.id],
      );
      return { outboxId: row.id, status: 'DELIVERED' as const };
    });
  }
}

const STORED_SECRET_KEYS = /password|secret|token|cookie|authorization|database_url|code|guardian/i;

function redactStoredNotificationFields(fields: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      STORED_SECRET_KEYS.test(key) ? '[REDACTED]' : redactStoredNotificationValue(value),
    ]),
  );
}

function redactStoredNotificationValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactStoredNotificationValue);
  if (value && typeof value === 'object') {
    return redactStoredNotificationFields(value as Record<string, unknown>);
  }
  return value;
}

export class LocalOwnerInbox implements OwnerInbox {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schema = quotedSchema(schemaName);
  }

  async list(input: { principal: Principal; cursor?: string; limit?: number }) {
    requireApproved(input.principal);
    const limit = input.limit ?? 20;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ApiError('VALIDATION_FAILED', 'Limit mailbox tidak valid');
    }
    const cursor = decodeCursor(input.cursor ?? null);
    const values: unknown[] = [input.principal.id, limit + 1];
    let cursorSql = '';
    if (cursor) {
      values.push(cursor.occurredAt, cursor.id);
      cursorSql = 'AND (created_at, id) < ($3::timestamptz, $4::uuid)';
    }
    const result = await this.pool.query<{
      id: string;
      subject: string;
      body_text: string;
      simulation_label: string;
      created_at: Date;
    }>(
      `SELECT id, subject, body_text, simulation_label, created_at
         FROM ${this.schema}.owner_mailbox
        WHERE recipient_principal_id = $1 ${cursorSql}
        ORDER BY created_at DESC, id DESC LIMIT $2`,
      values,
    );
    const rows = result.rows.slice(0, limit);
    const last = rows.at(-1);
    return {
      data: rows.map((row) => ({
        id: row.id,
        subject: row.subject,
        bodyText: row.body_text,
        simulationLabel: row.simulation_label,
        createdAt: row.created_at.toISOString(),
      })),
      page: {
        limit,
        nextCursor:
          result.rows.length > limit && last
            ? encodeCursor({ occurredAt: last.created_at.toISOString(), id: last.id })
            : null,
      },
    };
  }
}
