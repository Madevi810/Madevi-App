-- Rollback 0036: hanya aman bila tidak ada entry `tutorial` yang masih aktif.
-- Jalankan melalui prosedur recovery Owner, bukan sebagai penghapusan data diam-diam.

BEGIN;

ALTER TABLE __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_space_key_check;

ALTER TABLE __SCHEMA__.search_index_entries
  ADD CONSTRAINT search_index_entries_space_key_check
  CHECK (
    space_key IS NULL OR space_key IN (
      'explore', 'school', 'line', 'services', 'shop', 'tools'
    )
  );

COMMIT;
