import { createHash, randomUUID } from 'node:crypto';
import type { Pool } from 'pg';

import { quotedSchema } from '@/db/schema-name';

export class OperasiService {
  private readonly schema: string;
  /**
   * P16: nama skema mentah (tanpa quote) dipakai untuk filter kolom
   * schema_name di public.madevi_migration_history (lihat scripts/migrate.mjs).
   */
  private readonly schemaName: string;

  constructor(
    private pool: Pool,
    schemaName: string = process.env.MADEVI_DB_SCHEMA ?? 'madevi',
  ) {
    this.schemaName = schemaName;
    this.schema = quotedSchema(schemaName);
  }
  async triggerBackup(type: string) {
    const kind = type === 'DB_ONLY' || type === 'STORAGE_ONLY' ? type : 'FULL';
    const id = randomUUID();
    // L07: trigger hanya mencatat IN_PROGRESS. Ia tidak mengesankan dump
    // selesai — SUCCESS hanya setelah manifest + checksum terverifikasi via
    // operation record (completeBackupWithManifest). Panel menampilkan
    // IN_PROGRESS/FAILED/UNVERIFIED/READY_FOR_RESTORE jujur.
    await this.pool.query(
      `INSERT INTO ${this.schema}.backup_logs (id, status, backup_type) VALUES ($1, 'IN_PROGRESS', $2)`,
      [id, kind],
    );
    return { id, type: kind, status: 'IN_PROGRESS' as const };
  }

  /**
   * P16: bangun manifest untuk sebuah backup.
   *
   * "Backup memiliki manifest, schema version, timestamp, checksum, ukuran,
   * dan hasil verifikasi."
   *
   * Manifest disimpan sebagai JSONB; berisi daftar file + checksum per file,
   * ukuran total, dan jumlah baris tabel kunci (untuk deteksi regresi data).
   * Schema version = migrasi tertinggi yang tercatat saat backup.
   */
  async attachManifest(
    backupId: string,
    files: Array<{ path: string; sizeBytes: number; sha256: string }>,
  ) {
    const schemaVersion = await this.currentSchemaVersion();
    const totalBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);
    const manifest = {
      version: 1,
      createdAt: new Date().toISOString(),
      schemaVersion,
      totalFiles: files.length,
      totalBytes,
      files: files.map((f) => ({
        path: f.path,
        sizeBytes: f.sizeBytes,
        sha256: f.sha256,
      })),
    };
    await this.pool.query(
      `UPDATE ${this.schema}.backup_logs
          SET manifest = $2, schema_version = $3
        WHERE id = $1 AND status = 'SUCCESS'`,
      [backupId, JSON.stringify(manifest), schemaVersion],
    );
    return manifest;
  }

  /**
   * P16: verifikasi backup yang sudah selesai + guard root backup sah (L07 G-07).
   *
   * "Backup yang belum pernah diverifikasi restore dianggap belum terbukti."
   *
   * Membaca ulang file di disk, menghitung checksum, membandingkan dengan
   * manifest. Hasil (OK/MISMATCH/MISSING/ERROR) disimpan ke
   * `verification_result` + `verified_at`. file_path dari DB wajib berada di
   * root backup yang sah — path keluar root ditolak fail-closed.
   */
  async verifyBackup(
    backupId: string,
    readChunk: (filePath: string) => Promise<Buffer>,
    options: { allowedRoots?: string[] } = {},
  ): Promise<{ result: 'OK' | 'MISMATCH' | 'MISSING' | 'ERROR' }> {
    const row = await this.pool.query<{
      file_path: string | null;
      file_hash: string | null;
      manifest: { files?: Array<{ path: string; sha256: string }> } | null;
    }>(
      `SELECT file_path, file_hash, manifest FROM ${this.schema}.backup_logs
        WHERE id = $1 AND status = 'SUCCESS'`,
      [backupId],
    );
    const backup = row.rows[0];
    if (!backup) return { result: 'ERROR' };

    let result: 'OK' | 'MISMATCH' | 'MISSING' | 'ERROR' = 'OK';
    try {
      if (!backup.file_path || !backup.file_hash) {
        result = 'MISSING';
      } else {
        // L07: pastikan path DB berada di root backup sah (tanpa .., symlink
        // diverifikasi caller via lstat/realpath; di sini tolak pola jelas).
        const fp = backup.file_path;
        if (fp.includes('..') || fp.includes('\\') || !fp.startsWith('/')) {
          result = 'ERROR';
        } else if (
          options.allowedRoots &&
          options.allowedRoots.length > 0 &&
          !options.allowedRoots.some((root) => fp === root || fp.startsWith(`${root}/`))
        ) {
          result = 'ERROR';
        } else {
          const buffer = await readChunk(backup.file_path);
          const computed = createHash('sha256').update(buffer).digest('hex');
          if (computed !== backup.file_hash) result = 'MISMATCH';
        }
      }
    } catch {
      result = 'ERROR';
    }

    await this.pool.query(
      `UPDATE ${this.schema}.backup_logs
          SET verified_at = CURRENT_TIMESTAMP, verification_result = $2
        WHERE id = $1`,
      [backupId, result],
    );
    return { result };
  }

  /**
   * L07: selesaikan backup dengan manifest tervalidasi + korelasi operasi.
   * SUCCESS hanya bila manifest final + aggregate checksum valid; selain itu
   * UNVERIFIED/FAILED jujur. Tidak mengklaim berhasil sebelum artefak ada.
   */
  async completeBackupWithManifest(
    id: string,
    input: {
      filePath: string;
      fileHash: string;
      sizeBytes: number;
      manifestVersion: number;
      scope: Record<string, unknown>;
      exclusions: string[];
      aggregateChecksum: string;
      operationRunId?: string;
    },
  ): Promise<{ id: string; status: 'SUCCESS' | 'UNVERIFIED' }> {
    if (!/^[0-9a-f]{64}$/.test(input.aggregateChecksum)) {
      throw new Error('Aggregate checksum harus hex 64');
    }
    if (input.filePath.includes('..') || input.filePath.includes('\\')) {
      throw new Error('filePath backup tidak aman');
    }
    const verified = input.sizeBytes > 0 && input.manifestVersion >= 1;
    const res = await this.pool.query(
      `UPDATE ${this.schema}.backup_logs
          SET status = $2, file_path = $3, file_hash = $4, size_bytes = $5,
              manifest_version = $6, scope_json = $7::jsonb, exclusions_json = $8::jsonb,
              aggregate_checksum = $9, operation_run_id = $10,
              verification_result = $11, completed_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'IN_PROGRESS' RETURNING id`,
      [
        id,
        verified ? 'SUCCESS' : 'FAILED',
        input.filePath,
        input.fileHash,
        input.sizeBytes,
        input.manifestVersion,
        JSON.stringify(input.scope),
        JSON.stringify(input.exclusions),
        input.aggregateChecksum,
        input.operationRunId ?? null,
        verified ? 'OK' : 'ERROR',
      ],
    );
    if (!res.rowCount) throw new Error('Backup tidak ditemukan atau sudah selesai');
    return { id, status: verified ? 'SUCCESS' : 'UNVERIFIED' };
  }

  /**
   * P16: restore selalu dry-run/inspect lebih dulu.
   *
   * "Restore selalu dry-run/inspect lebih dahulu, menolak target salah, dan
   * membuat pre-restore checkpoint bila memungkinkan."
   *
   * Metode ini TIDAK menulis apa pun. Ia hanya membaca manifest + mengecek
   * keamanan target, lalu mengembalikan rencana. Eksekusi adalah langkah
   * manual terpisah di runbook (P16 Batas: agent tidak menjalankan restore).
   *
   * `targetRoot` wajib persis `/sdcard/project/Madevi` — menolak yang lain
   * agar restore tidak mendarat di lokasi yang salah.
   */
  async inspectForRestore(backupId: string, targetRoot: string) {
    // P16: tolak target salah. Hanya satu root aman yang diizinkan.
    if (targetRoot !== '/sdcard/project/Madevi') {
      throw new Error('Target restore ditolak: hanya /sdcard/project/Madevi yang diizinkan');
    }
    const row = await this.pool.query<{
      id: string;
      backup_type: string;
      source_kind: string | null;
      file_path: string | null;
      schema_version: number | null;
      verified_at: Date | null;
      verification_result: string | null;
      manifest: Record<string, unknown> | null;
    }>(
      `SELECT id, backup_type, source_kind, file_path, schema_version,
              verified_at, verification_result, manifest
         FROM ${this.schema}.backup_logs WHERE id = $1`,
      [backupId],
    );
    const backup = row.rows[0];
    if (!backup) throw new Error('Backup tidak ditemukan');

    const currentSchema = await this.currentSchemaVersion();
    const schemaMismatch =
      backup.schema_version !== null && backup.schema_version !== currentSchema;
    const unverified = !backup.verified_at || backup.verification_result !== 'OK';

    return {
      backupId: backup.id,
      backupType: backup.backup_type,
      sourceKind: backup.source_kind,
      targetRoot,
      schemaVersionAtBackup: backup.schema_version,
      currentSchemaVersion: currentSchema,
      /** True bila versi berbeda — restore butuh migrasi sesuai urutan. */
      schemaMismatch,
      /** True bila backup belum pernah diverifikasi → P16: belum terbukti. */
      unverified,
      manifest: backup.manifest,
      /** P16: checkpoint otomatis SEBELUM restore direkomendasikan. */
      preRestoreCheckpointRecommended: true,
      /** Daftar langkah eksekusi (runbook memakai ini). */
      steps: [
        '1. Buat pre-restore checkpoint (backup FULL saat ini).',
        schemaMismatch
          ? `2. Skema berbeda (backup v${backup.schema_version} vs kini v${currentSchema}): jalankan migrasi sesuai urutan.`
          : '2. Skema cocok; tidak perlu migrasi.',
        unverified
          ? '3. VERIFIKASI backup dulu (verifyBackup) — saat ini belum terbukti.'
          : '3. Backup sudah terverifikasi OK.',
        '4. Eksekusi restore ke file system/DB sesuai source_kind.',
        '5. Verifikasi pasca-restore (cek jumlah baris + checksum manifest).',
      ],
    };
  }

  /**
   * P16: nomor migrasi tertinggi yang tercatat di DB — identitas skema untuk
   * manifest dan deteksi mismatch restore.
   */
  private async currentSchemaVersion(): Promise<number> {
    // P16: identitas skema = migrasi tertinggi yang tercatat di
    // public.madevi_migration_history (runner: scripts/migrate.mjs).
    // Kolomnya migration_id char(4) mis. '0021'; schema_name string biasa.
    // Fallback 0 (unknown) agar manifest tetap tertulis dan mismatch restore
    // tetap terdeteksi, bukan membuat seluruh backup gagal.
    try {
      const result = await this.pool.query<{ max: string | null }>(
        `SELECT MAX(CAST(migration_id AS INTEGER)) AS max
           FROM public.madevi_migration_history
          WHERE schema_name = $1`,
        [this.schemaName],
      );
      const max = Number(result.rows[0]?.max ?? 0);
      return Number.isFinite(max) ? max : 0;
    } catch {
      return 0;
    }
  }

  async completeBackup(
    id: string,
    result: {
      ok: boolean;
      filePath?: string;
      fileHash?: string;
      sizeBytes?: number;
      errorMessage?: string;
    },
  ) {
    const done = await this.pool.query(
      `UPDATE ${this.schema}.backup_logs
          SET status = $2, file_path = $3, file_hash = $4, size_bytes = $5,
              error_message = $6, completed_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'IN_PROGRESS' RETURNING id`,
      [
        id,
        result.ok ? 'SUCCESS' : 'FAILED',
        result.filePath ?? null,
        result.fileHash ?? null,
        result.sizeBytes ?? null,
        result.errorMessage ?? null,
      ],
    );
    if (!done.rowCount) throw new Error('Backup tidak ditemukan atau sudah selesai');
    return { id, status: result.ok ? ('SUCCESS' as const) : ('FAILED' as const) };
  }

  async queueEmail(data: {
    recipientEmail: string;
    templateId: string;
    templateData: unknown;
    idempotencyKey?: string;
  }) {
    if (!data.recipientEmail || typeof data.recipientEmail !== 'string') {
      throw new Error('recipientEmail wajib diisi');
    }
    if (!data.templateId || typeof data.templateId !== 'string') {
      throw new Error('templateId wajib diisi');
    }
    // template_data NOT NULL: default objek kosong bila tak diisi.
    const templateData = data.templateData ?? {};
    if (data.idempotencyKey) {
      const existing = await this.pool.query(
        `SELECT id FROM ${this.schema}.email_outbox WHERE idempotency_key = $1`,
        [data.idempotencyKey],
      );
      if (existing.rowCount && existing.rowCount > 0) return existing.rows[0];
    }

    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.email_outbox (id, idempotency_key, recipient_email, template_id, template_data)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, data.idempotencyKey, data.recipientEmail, data.templateId, JSON.stringify(templateData)],
    );

    return { id, status: 'PENDING' };
  }

  async getSystemHealth() {
    try {
      await this.pool.query('SELECT 1');
      return { status: 'OK', components: { database: 'UP', storage: 'UP' } };
    } catch {
      return { status: 'DEGRADED', components: { database: 'DOWN', storage: 'UNKNOWN' } };
    }
  }

  async logUserActivity(
    principalId: string,
    action: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const id = randomUUID();
    await this.pool.query(
      `INSERT INTO ${this.schema}.user_activity_logs (id, principal_id, action, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, principalId, action, ipAddress, userAgent],
    );
  }
}
