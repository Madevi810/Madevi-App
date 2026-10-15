-- 0036: Ruang pencarian Tutorial & Problem Solve (R7)
-- Menambah key ruang kanonis `tutorial` secara forward-only. Tidak mengubah
-- index/entry lama; proyeksi taxonomy R7 akan menulis entry baru saat promote.

BEGIN;

ALTER TABLE __SCHEMA__.search_index_entries
  DROP CONSTRAINT IF EXISTS search_index_entries_space_key_check;

ALTER TABLE __SCHEMA__.search_index_entries
  ADD CONSTRAINT search_index_entries_space_key_check
  CHECK (
    space_key IS NULL OR space_key IN (
      'explore', 'tutorial', 'school', 'line', 'services', 'shop', 'tools'
    )
  );

COMMIT;
