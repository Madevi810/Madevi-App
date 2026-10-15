import crypto, { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { Pool } from 'pg';

import { ApiError } from '@/api/errors';
import { requireApproved } from '@/api/policy';
import type {
  ModerationDecision,
  Principal,
  StorageService,
  StoredObject,
} from '@/contracts/services';
import { quotedSchema } from '@/db/schema-name';
import { inTransaction } from '@/db/transaction';
import { appendAuditEvent } from '@/services/audit';
import { requireSafeAssessment, UnavailableModerationDecision } from '@/services/moderation';

interface ReservationRow {
  id: string;
  principal_id: string;
  bytes: string;
  status: 'ACTIVE' | 'COMMITTED' | 'RELEASED' | 'EXPIRED';
  expires_at: Date;
}

export class LocalStorageService implements StorageService {
  private readonly schema: string;
  private readonly storageRoot: string;

  constructor(
    private readonly pool: Pool,
    runtimeRoot: string,
    schemaName = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
    private readonly moderator: ModerationDecision = new UnavailableModerationDecision(),
  ) {
    this.schema = quotedSchema(schemaName);
    this.storageRoot = path.resolve(runtimeRoot, 'storage');
    const projectRoot = path.resolve(process.cwd());
    if (!this.storageRoot.startsWith(`${projectRoot}${path.sep}`)) {
      throw new Error('Storage harus berada di dalam runtime proyek');
    }
    if (this.storageRoot.includes(`${path.sep}public${path.sep}`)) {
      throw new Error('Storage tidak boleh berada di public');
    }
  }

  async reserve(input: { principal: Principal; bytes: number; idempotencyKey: string }) {
    requireApproved(input.principal);
    if (!Number.isSafeInteger(input.bytes) || input.bytes < 1) {
      throw new ApiError('VALIDATION_FAILED', 'Jumlah byte tidak valid');
    }
    if (!/^[A-Za-z0-9._:-]{8,128}$/.test(input.idempotencyKey)) {
      throw new ApiError('VALIDATION_FAILED', 'Idempotency key kuota tidak valid');
    }
    return inTransaction(this.pool, async (client) => {
      await client.query(
        `INSERT INTO ${this.schema}.quota_accounts (principal_id)
         VALUES ($1) ON CONFLICT DO NOTHING`,
        [input.principal.id],
      );
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + 15 * 60_000);
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO ${this.schema}.quota_reservations
           (id, principal_id, bytes, status, idempotency_key, expires_at)
         VALUES ($1, $2, $3, 'ACTIVE', $4, $5)
         ON CONFLICT (principal_id, idempotency_key) DO NOTHING
         RETURNING id`,
        [id, input.principal.id, input.bytes, input.idempotencyKey, expiresAt],
      );
      if (inserted.rowCount === 0) {
        const existing = await client.query<ReservationRow>(
          `SELECT id, principal_id, bytes, status, expires_at
             FROM ${this.schema}.quota_reservations
            WHERE principal_id = $1 AND idempotency_key = $2`,
          [input.principal.id, input.idempotencyKey],
        );
        const previous = existing.rows[0];
        if (!previous || Number(previous.bytes) !== input.bytes) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Key reservasi dipakai untuk ukuran berbeda');
        }
        return { reservationId: previous.id, expiresAt: previous.expires_at.toISOString() };
      }
      const quota = await client.query(
        `UPDATE ${this.schema}.quota_accounts
            SET reserved_bytes = reserved_bytes + $2,
                updated_at = CURRENT_TIMESTAMP,
                version = version + 1
          WHERE principal_id = $1
            AND used_bytes + reserved_bytes + $2 <= limit_bytes
          RETURNING principal_id`,
        [input.principal.id, input.bytes],
      );
      if (quota.rowCount !== 1) throw new ApiError('QUOTA_EXCEEDED', 'Kuota penyimpanan penuh');
      return { reservationId: id, expiresAt: expiresAt.toISOString() };
    });
  }

  async storeQuarantined(input: {
    principal: Principal;
    reservationId: string;
    bytes: Uint8Array;
    mediaType: string;
    originalName: string;
    fixture?: boolean;
  }): Promise<StoredObject> {
    requireApproved(input.principal);
    if (input.bytes.byteLength < 1) throw new ApiError('VALIDATION_FAILED', 'File kosong ditolak');
    if (!/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(input.mediaType)) {
      throw new ApiError('VALIDATION_FAILED', 'Media type tidak valid');
    }
    const objectId = randomUUID();
    const relativePath = `quarantine/${objectId}.bin`;
    const directory = path.join(this.storageRoot, 'quarantine');
    const finalPath = path.join(this.storageRoot, relativePath);
    const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    await fs.writeFile(temporaryPath, input.bytes, { flag: 'wx', mode: 0o600 });
    await fs.rename(temporaryPath, finalPath);
    const sha256 = crypto.createHash('sha256').update(input.bytes).digest('hex');
    const originalName = safeOriginalName(input.originalName);
    try {
      return await inTransaction(this.pool, async (client) => {
        const reservationResult = await client.query<ReservationRow>(
          `SELECT id, principal_id, bytes, status, expires_at
             FROM ${this.schema}.quota_reservations
            WHERE id = $1 FOR UPDATE`,
          [input.reservationId],
        );
        const reservation = reservationResult.rows[0];
        const existingObject = await client.query<{
          id: string;
          size_bytes: string;
          sha256: string;
        }>(
          `SELECT id, size_bytes, sha256 FROM ${this.schema}.storage_objects
        WHERE reservation_id = $1`,
          [input.reservationId],
        );
        if (existingObject.rows[0]) {
          const previous = existingObject.rows[0];
          if (
            Number(previous.size_bytes) !== input.bytes.byteLength ||
            previous.sha256 !== sha256
          ) {
            throw new ApiError('IDEMPOTENCY_CONFLICT', 'File berbeda untuk reservasi yang sama');
          }
          // Byte ini baru ditulis oleh percobaan ulang. Metadata kanonis sudah
          // menunjuk byte percobaan pertama, sehingga byte ulang tidak boleh
          // dibiarkan sebagai orphan di karantina.
          await fs.unlink(finalPath).catch(() => undefined);
          return {
            id: previous.id,
            ownerPrincipalId: input.principal.id,
            state: 'QUARANTINE',
            assessment: 'UNASSESSED',
            sizeBytes: Number(previous.size_bytes),
            sha256: previous.sha256,
          };
        }
        if (
          !reservation ||
          reservation.principal_id !== input.principal.id ||
          reservation.status !== 'ACTIVE'
        ) {
          throw new ApiError('NOT_FOUND', 'Reservasi aktif tidak ditemukan');
        }
        if (reservation.expires_at.getTime() <= Date.now()) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Reservasi sudah kedaluwarsa');
        }
        if (Number(reservation.bytes) !== input.bytes.byteLength) {
          throw new ApiError('IDEMPOTENCY_CONFLICT', 'Ukuran file tidak cocok dengan reservasi');
        }
        await client.query(
          `INSERT INTO ${this.schema}.storage_objects
             (id, owner_principal_id, reservation_id, relative_path, media_type,
              size_bytes, sha256, original_name, is_test)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            objectId,
            input.principal.id,
            input.reservationId,
            relativePath,
            input.mediaType,
            input.bytes.byteLength,
            sha256,
            originalName,
            input.fixture ?? false,
          ],
        );
        await client.query(
          `UPDATE ${this.schema}.quota_reservations
              SET status = 'COMMITTED', completed_at = CURRENT_TIMESTAMP
            WHERE id = $1`,
          [input.reservationId],
        );
        await client.query(
          `UPDATE ${this.schema}.quota_accounts
              SET reserved_bytes = reserved_bytes - $2,
                  used_bytes = used_bytes + $2,
                  updated_at = CURRENT_TIMESTAMP,
                  version = version + 1
            WHERE principal_id = $1`,
          [input.principal.id, input.bytes.byteLength],
        );
        await appendAuditEvent(client, {
          actorPrincipalId: input.principal.id,
          eventType: 'STORAGE_QUARANTINED',
          objectType: 'storage_object',
          objectId,
          details: { relativePath, sizeBytes: input.bytes.byteLength },
          fixture: input.fixture,
          schema: this.schema.slice(1, -1),
        });
        return {
          id: objectId,
          ownerPrincipalId: input.principal.id,
          state: 'QUARANTINE',
          assessment: 'UNASSESSED',
          sizeBytes: input.bytes.byteLength,
          sha256,
        };
      });
    } catch (error) {
      await fs.unlink(finalPath).catch(() => undefined);
      throw error;
    }
  }

  async promote(input: { principal: Principal; objectId: string }) {
    requireApproved(input.principal);
    const result = await this.pool.query<{
      owner_principal_id: string;
      relative_path: string;
      storage_state: string;
    }>(
      `SELECT owner_principal_id, relative_path, storage_state
         FROM ${this.schema}.storage_objects
        WHERE id = $1 AND deleted_at IS NULL`,
      [input.objectId],
    );
    const object = result.rows[0];
    if (!object || object.owner_principal_id !== input.principal.id) {
      throw new ApiError('NOT_FOUND', 'Objek tidak ditemukan');
    }
    await requireSafeAssessment(this.moderator, {
      objectId: input.objectId,
      relativePath: object.relative_path,
    });
    throw new ApiError(
      'DEPENDENCY_UNAVAILABLE',
      'Promosi byte aktif baru diintegrasikan pada tahap scanner nyata',
    );
  }

  async reconcile() {
    const databaseObjects = await this.pool.query<{ id: string; relative_path: string }>(
      `SELECT id, relative_path FROM ${this.schema}.storage_objects WHERE deleted_at IS NULL`,
    );
    const known = new Map(databaseObjects.rows.map((row) => [row.relative_path, row.id]));
    const disk = new Set<string>();
    for (const folder of ['quarantine', 'objects']) {
      const directory = path.join(this.storageRoot, folder);
      await fs.mkdir(directory, { recursive: true, mode: 0o700 });
      for (const name of await fs.readdir(directory)) {
        if (/^[0-9a-f-]{36}\.bin$/.test(name)) disk.add(`${folder}/${name}`);
      }
    }
    const orphanBytes = [...disk].filter((file) => !known.has(file));
    const missingBytes = [...known.entries()]
      .filter(([file]) => !disk.has(file))
      .map(([relativePath, id]) => ({ id, relativePath }));
    if (missingBytes.length > 0) {
      await this.pool.query(
        `UPDATE ${this.schema}.storage_objects
            SET storage_state = 'REJECTED', assessment_status = 'UNSAFE',
                updated_at = CURRENT_TIMESTAMP, version = version + 1
          WHERE id = ANY($1::uuid[])`,
        [missingBytes.map((item) => item.id)],
      );
    }

    // P13: "bersihkan orphan files". Orphan di folder `objects/` dihapus karena
    // tidak direferensikan DB sama sekali (bocoran kuota + area sensitif).
    // Orphan di `quarantine/` SENGAJA dipertahankan: bisa menjadi bukti kasus
    // yang masih dalam tinjauan (P13: "Simpan bukti minimum").
    const deletedOrphans: string[] = [];
    for (const file of orphanBytes) {
      if (!file.startsWith('objects/')) continue;
      const absolute = path.join(this.storageRoot, file);
      await fs.unlink(absolute).catch(() => undefined);
      deletedOrphans.push(file);
    }

    return {
      orphanBytes,
      missingBytes,
      /** Orphan yang benar-benar dihapus dari disk (hanya `objects/`). */
      deletedOrphans,
      /** Orphan quarantine yang dipertahankan sebagai bukti. */
      retainedQuarantineOrphans: orphanBytes.filter((f) => f.startsWith('quarantine/')),
    };
  }

  async expireReservations() {
    const result = await this.pool.query<{ principal_id: string; released_bytes: string }>(
      `WITH expired AS (
         UPDATE ${this.schema}.quota_reservations
            SET status = 'EXPIRED', completed_at = CURRENT_TIMESTAMP
          WHERE status = 'ACTIVE' AND expires_at <= CURRENT_TIMESTAMP
        RETURNING principal_id, bytes
       ), totals AS (
         SELECT principal_id, sum(bytes)::bigint AS released_bytes
           FROM expired GROUP BY principal_id
       )
       UPDATE ${this.schema}.quota_accounts AS account
          SET reserved_bytes = greatest(0, account.reserved_bytes - totals.released_bytes),
              updated_at = CURRENT_TIMESTAMP,
              version = version + 1
         FROM totals
        WHERE account.principal_id = totals.principal_id
      RETURNING account.principal_id, totals.released_bytes`,
    );
    return {
      accounts: result.rowCount ?? 0,
      releasedBytes: result.rows.reduce((sum, row) => sum + Number(row.released_bytes), 0),
    };
  }
}

function safeOriginalName(value: string) {
  const name = path.posix
    .basename(value.replaceAll('\\', '/'))
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .slice(0, 255);
  return name || 'unnamed.bin';
}
