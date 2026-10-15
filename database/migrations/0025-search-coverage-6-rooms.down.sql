-- 0025 rollback: Kembalikan check constraint ke 5 tipe awal

BEGIN;

ALTER TABLE __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_entry_type_check;

ALTER TABLE __SCHEMA__.search_index_entries
  ADD CONSTRAINT search_index_entries_entry_type_check
  CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE'));

ALTER TABLE __SCHEMA__.search_index_jobs
  DROP CONSTRAINT IF EXISTS search_index_jobs_entry_type_check;

ALTER TABLE __SCHEMA__.search_index_jobs
  ADD CONSTRAINT search_index_jobs_entry_type_check
  CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE'));

COMMIT;
