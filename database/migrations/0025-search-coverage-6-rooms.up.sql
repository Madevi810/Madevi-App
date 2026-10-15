-- 0025: Perluasan cakupan indeks pencarian 6 ruang (M-WEB-FOUNDATION)
-- Menambahkan SERVICE, PRODUCT, dan POST ke tipe entitas pencarian global.

BEGIN;

ALTER TABLE __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_entry_type_check;

ALTER TABLE __SCHEMA__.search_index_entries
  ADD CONSTRAINT search_index_entries_entry_type_check
  CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE','SERVICE','PRODUCT','POST'));

ALTER TABLE __SCHEMA__.search_index_jobs
  DROP CONSTRAINT IF EXISTS search_index_jobs_entry_type_check;

ALTER TABLE __SCHEMA__.search_index_jobs
  ADD CONSTRAINT search_index_jobs_entry_type_check
  CHECK (entry_type IN ('MENU','ARTICLE','PROFILE','SOFTWARE','PAGE','SERVICE','PRODUCT','POST'));

COMMIT;
