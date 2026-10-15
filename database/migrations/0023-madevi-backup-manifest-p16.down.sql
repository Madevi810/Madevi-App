-- ============================================================
-- 0023 DOWN: Backup manifest, verifikasi, retensi — P16
-- ============================================================
-- PERINGATAN (sama seperti 0021/0022): DOWN bersifat destruktif terhadap
-- kolom baru. Jalankan HANYA bila 0023 harus dibuang penuh.
-- Forward-fix lebih aman. Jangan tanpa backup (lihat P16 runbook).

BEGIN;

DROP INDEX IF EXISTS __SCHEMA__.backup_logs_kind_completed_idx;

ALTER TABLE __SCHEMA__.backup_logs
  DROP COLUMN IF EXISTS source_kind,
  DROP COLUMN IF EXISTS retention_until,
  DROP COLUMN IF EXISTS verification_result,
  DROP COLUMN IF EXISTS verified_at,
  DROP COLUMN IF EXISTS schema_version,
  DROP COLUMN IF EXISTS manifest;

COMMIT;
