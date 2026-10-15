import { createHash, randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';

/**
 * AdminOperationService L07 — operasi massal baku:
 * filter → preview dampak (read-only) → konfirmasi kuat (terikat
 * actor/action/filter/version/TTL) → idempotency → hasil per item → audit.
 * Tidak ada batch untuk fitur yang belum memiliki action nyata.
 * Tidak ada tombol destruktif sekali klik.
 */

export interface OperationPreview {
  runId: string;
  action: string;
  filterHash: string;
  filterVersion: number;
  confirmationToken: string;
  confirmationExpiresAt: string;
  itemTotal: number;
  items: Array<{ targetType: string; targetId: string }>;
}

export class AdminOperationService {
  private readonly schema: string;

  constructor(
    private readonly pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    private readonly now: () => Date = () => new Date(),
  ) {
    this.schema = quotedSchema(schemaName);
  }

  /** Hash filter deterministik untuk binding preview→execute. */
  static filterHash(filter: unknown): string {
    return createHash('sha256').update(JSON.stringify(filter ?? {})).digest('hex').slice(0, 64);
  }

  /**
   * Preview read-only: tidak menulis domain, hanya mencatat run PREVIEW +
   * item PENDING. Confirmation terikat actor/action/filter/version/TTL.
   */
  async preview(input: {
    actorId: string;
    action: string;
    filter: unknown;
    targets: Array<{ targetType: string; targetId: string }>;
    idempotencyKey: string;
    ttlMinutes?: number;
    requestId?: string;
  }): Promise<OperationPreview> {
    const action = input.action.trim();
    if (action.length < 3 || action.length > 120) {
      throw new ApiError('VALIDATION_FAILED', 'Aksi operasi tidak valid');
    }
    if (input.targets.length > 200) {
      throw new ApiError('VALIDATION_FAILED', 'Maksimal 200 target per operasi');
    }
    if (!/^[0-9A-Za-z-]{8,128}$/.test(input.idempotencyKey)) {
      throw new ApiError('VALIDATION_FAILED', 'Idempotency key tidak valid');
    }
    const filterHash = AdminOperationService.filterHash(input.filter);
    const ttl = Math.min(Math.max(input.ttlMinutes ?? 15, 5), 60);
    const expiresAt = new Date(this.now().getTime() + ttl * 60_000);
    const runId = randomUUID();
    const confirmationToken = randomUUID().replace(/-/g, '').slice(0, 32);

    return inTransaction(this.pool, async (client) => {
      // Idempotency replay: kembalikan preview yang sama bila key dipakai ulang
      // untuk payload identik; tolak bila payload berbeda.
      const existing = await client.query<{
        id: string;
        filter_hash: string;
        confirmation_token: string;
        confirmation_expires_at: Date;
      }>(
        `SELECT id, filter_hash, confirmation_token, confirmation_expires_at
           FROM ${this.schema}.admin_operation_runs
          WHERE actor_principal_id = $1 AND action = $2 AND idempotency_key = $3`,
        [input.actorId, action, input.idempotencyKey],
      );
      if (existing.rows[0]) {
        const row = existing.rows[0];
        if (row.filter_hash !== filterHash) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key dipakai untuk filter berbeda');
        }
        const items = await client.query<{ target_type: string; target_id: string }>(
          `SELECT target_type, target_id FROM ${this.schema}.admin_operation_items WHERE run_id = $1 ORDER BY target_id`,
          [row.id],
        );
        return {
          runId: row.id,
          action,
          filterHash: row.filter_hash,
          filterVersion: 1,
          confirmationToken: row.confirmation_token,
          confirmationExpiresAt: new Date(row.confirmation_expires_at).toISOString(),
          itemTotal: items.rows.length,
          items: items.rows.map((r) => ({ targetType: r.target_type, targetId: r.target_id })),
        };
      }

      await client.query(
        `INSERT INTO ${this.schema}.admin_operation_runs
           (id, actor_principal_id, action, filter_hash, filter_version,
            confirmation_token, confirmation_expires_at, idempotency_key,
            status, item_total, request_id)
         VALUES ($1,$2,$3,$4,1,$5,$6,$7,'PREVIEW',$8,$9)`,
        [
          runId,
          input.actorId,
          action,
          filterHash,
          confirmationToken,
          expiresAt,
          input.idempotencyKey,
          input.targets.length,
          input.requestId ?? null,
        ],
      );
      for (const t of input.targets) {
        await client.query(
          `INSERT INTO ${this.schema}.admin_operation_items (id, run_id, target_type, target_id, status)
           VALUES ($1,$2,$3,$4,'PENDING')`,
          [randomUUID(), runId, t.targetType.slice(0, 80), t.targetId.slice(0, 200)],
        );
      }
      await appendAuditEvent(client, {
        actorPrincipalId: input.actorId,
        eventType: 'ADMIN_OPERATION_PREVIEW',
        objectType: 'admin_operation_run',
        objectId: runId,
        requestId: input.requestId,
        details: { action, itemTotal: input.targets.length },
        schema: this.schema.replaceAll('"', ''),
      });
      return {
        runId,
        action,
        filterHash,
        filterVersion: 1,
        confirmationToken,
        confirmationExpiresAt: expiresAt.toISOString(),
        itemTotal: input.targets.length,
        items: input.targets,
      };
    });
  }

  /**
   * Execute: verifikasi confirmation terikat actor/action/filter/version/TTL,
   * lalu jalankan executor per item dalam transaksi per item (partial OK).
   * Executor disediakan caller domain (hanya action nyata).
   */
  async execute(input: {
    actorId: string;
    runId: string;
    confirmationToken: string;
    executor: (target: { targetType: string; targetId: string }) => Promise<void>;
    requestId?: string;
  }): Promise<{ status: 'COMPLETED' | 'PARTIAL' | 'FAILED'; succeeded: number; failed: number }> {
    return inTransaction(this.pool, async (client) => {
      const run = await client
        .query<{
          id: string;
          actor_principal_id: string;
          action: string;
          confirmation_token: string;
          confirmation_expires_at: Date;
          status: string;
        }>(
          `SELECT id, actor_principal_id, action, confirmation_token, confirmation_expires_at, status
             FROM ${this.schema}.admin_operation_runs WHERE id = $1 FOR UPDATE`,
          [input.runId],
        )
        .then((r) => r.rows[0] ?? null);
      if (!run) throw new ApiError('NOT_FOUND', 'Operation run tidak ditemukan');
      if (run.actor_principal_id !== input.actorId) {
        throw new ApiError('ACCESS_DENIED', 'Bukan operasi Anda');
      }
      if (run.confirmation_token !== input.confirmationToken) {
        throw new ApiError('ACCESS_DENIED', 'Confirmation token tidak cocok');
      }
      if (new Date(run.confirmation_expires_at).getTime() <= this.now().getTime()) {
        await client.query(
          `UPDATE ${this.schema}.admin_operation_runs SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [input.runId],
        );
        throw new ApiError('VALIDATION_FAILED', 'Confirmation kedaluwarsa; buat preview baru');
      }
      if (!['PREVIEW', 'CONFIRMED'].includes(run.status)) {
        throw new ApiError('IDEMPOTENCY_CONFLICT', `Run sudah ${run.status}`);
      }
      await client.query(
        `UPDATE ${this.schema}.admin_operation_runs SET status = 'EXECUTING', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [input.runId],
      );
      const items = await client.query<{ id: string; target_type: string; target_id: string }>(
        `SELECT id, target_type, target_id FROM ${this.schema}.admin_operation_items WHERE run_id = $1 ORDER BY target_id`,
        [input.runId],
      );
      let succeeded = 0;
      let failed = 0;
      for (const item of items.rows) {
        try {
          await input.executor({ targetType: item.target_type, targetId: item.target_id });
          await client.query(
            `UPDATE ${this.schema}.admin_operation_items SET status = 'SUCCESS' WHERE id = $1`,
            [item.id],
          );
          succeeded += 1;
        } catch (err) {
          await client.query(
            `UPDATE ${this.schema}.admin_operation_items SET status = 'FAILED', error_message = $2 WHERE id = $1`,
            [item.id, err instanceof Error ? err.message.slice(0, 500) : 'FAILED'],
          );
          failed += 1;
        }
      }
      const status = failed === 0 ? 'COMPLETED' : succeeded === 0 ? 'FAILED' : 'PARTIAL';
      await client.query(
        `UPDATE ${this.schema}.admin_operation_runs
            SET status = $2, item_succeeded = $3, item_failed = $4, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1`,
        [input.runId, status, succeeded, failed],
      );
      await appendAuditEvent(client, {
        actorPrincipalId: input.actorId,
        eventType: 'ADMIN_OPERATION_EXECUTE',
        objectType: 'admin_operation_run',
        objectId: input.runId,
        requestId: input.requestId,
        details: { action: run.action, succeeded, failed, status },
        schema: this.schema.replaceAll('"', ''),
      });
      return { status, succeeded, failed };
    });
  }

  /** Batalkan preview sebelum execute (tanpa menghapus audit). */
  async cancel(actorId: string, runId: string): Promise<{ cancelled: boolean }> {
    const res = await this.pool.query(
      `UPDATE ${this.schema}.admin_operation_runs
          SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND actor_principal_id = $2 AND status IN ('PREVIEW','CONFIRMED')`,
      [runId, actorId],
    );
    return { cancelled: (res.rowCount ?? 0) > 0 };
  }
}
