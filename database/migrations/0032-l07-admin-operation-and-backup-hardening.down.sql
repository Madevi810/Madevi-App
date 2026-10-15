-- Rollback 0032 (L07). Aman hanya bila belum ada operation/manifest records
-- yang tidak bisa direpresentasikan ulang.
-- Tidak menghapus audit, batch result yang sudah COMPLETED/PARTIAL, manifest
-- backup yang sudah diverifikasi, backup file, atau session aktif.
-- Bila data sudah bergantung, gunakan reader compat/migration maju korektif;
-- nonaktifkan execute menjadi preview-only; jangan hapus buta.

BEGIN;

ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS restore_inspected_at;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS restore_inspection_json;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS operation_run_id;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS aggregate_checksum;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS exclusions_json;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS scope_json;
ALTER TABLE IF EXISTS __SCHEMA__.backup_logs DROP COLUMN IF EXISTS manifest_version;

DROP TABLE IF EXISTS __SCHEMA__.admin_operation_items;
DROP TABLE IF EXISTS __SCHEMA__.admin_operation_runs;

COMMIT;
