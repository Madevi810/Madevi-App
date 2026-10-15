import { randomUUID } from 'node:crypto';

import type { PoolClient } from 'pg';

import { quotedSchema } from '@/db/schema-name';
import { redactLogFields } from '@/server/logger';

export async function appendAuditEvent(
  client: PoolClient,
  input: {
    actorPrincipalId?: string;
    eventType: string;
    objectType: string;
    objectId?: string;
    requestId?: string;
    details?: Record<string, unknown>;
    fixture?: boolean;
    schema?: string;
  },
) {
  const schema = quotedSchema(input.schema);
  const id = randomUUID();
  await client.query(
    `INSERT INTO ${schema}.audit_events
       (id, actor_principal_id, event_type, object_type, object_id, request_id, details, is_test)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)`,
    [
      id,
      input.actorPrincipalId ?? null,
      input.eventType,
      input.objectType,
      input.objectId ?? null,
      input.requestId ?? null,
      JSON.stringify(redactLogFields(input.details ?? {})),
      input.fixture ?? false,
    ],
  );
  return id;
}
