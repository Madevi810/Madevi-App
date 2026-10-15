-- Rollback 0031 (L06). Aman hanya bila belum ada record yang bergantung
-- pada kolom metadata baru (space_key/target_href/subject/visibility/state).
-- Tidak menghapus artikel, produk, post, package, audit, atau percakapan.
-- Bila data sudah bergantung, Admin memakai reader kompatibel/migrasi maju
-- korektif; jangan menghapus entry/audit/package/percakapan.

BEGIN;

DROP INDEX IF EXISTS __SCHEMA__.search_index_space_target_idx;
DROP INDEX IF EXISTS __SCHEMA__.search_index_subject_idx;

ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_target_check;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_pubstate_check;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_visibility_check;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_space_key_check;

ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP COLUMN IF EXISTS publication_state;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP COLUMN IF EXISTS visibility;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP COLUMN IF EXISTS subject_principal_id;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP COLUMN IF EXISTS target_href;
ALTER TABLE IF EXISTS __SCHEMA__.search_index_entries
  DROP COLUMN IF EXISTS space_key;

COMMIT;
