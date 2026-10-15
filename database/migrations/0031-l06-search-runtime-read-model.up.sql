-- 0031: Read-model runtime L06 — metadata Search berotorisasi + deep-link tervalidasi
-- Pendekatan B rencana L06. Aditif saja; tidak mengubah migration historis.
-- Menambah metadata policy/deep-link pada search_index_entries agar Search/AI
-- dapat menegakkan block, School lock, entitlement, dan target route kanonis
-- tanpa menebak URL di klien. Entry lama yang tidak dapat direkonstruksi
-- dinonaktifkan fail-closed oleh proyektor resmi (bukan oleh migration ini
-- yang menerbitkan draft).

BEGIN;

-- Metadata ruang kanonis (enam ruang Madevi) + target deep-link tervalidasi
-- server-side + subject/visibility untuk policy per jenis.
ALTER TABLE __SCHEMA__.search_index_entries
  ADD COLUMN IF NOT EXISTS space_key text,
  ADD COLUMN IF NOT EXISTS target_href text,
  ADD COLUMN IF NOT EXISTS subject_principal_id uuid,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN IF NOT EXISTS publication_state text NOT NULL DEFAULT 'PUBLISHED';

-- Batas nilai: space_key hanya enam ruang kanonis bila diisi.
-- NULL berarti entry legacy yang belum diproyeksikan ulang (fail-closed di service).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'search_index_entries_space_key_check'
  ) THEN
    ALTER TABLE __SCHEMA__.search_index_entries
      ADD CONSTRAINT search_index_entries_space_key_check
      CHECK (
        space_key IS NULL OR space_key IN (
          'explore', 'school', 'line', 'services', 'shop', 'tools'
        )
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'search_index_entries_visibility_check'
  ) THEN
    ALTER TABLE __SCHEMA__.search_index_entries
      ADD CONSTRAINT search_index_entries_visibility_check
      CHECK (visibility IN ('PUBLIC', 'MEMBER', 'PRIVATE', 'DRAFT'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'search_index_entries_pubstate_check'
  ) THEN
    ALTER TABLE __SCHEMA__.search_index_entries
      ADD CONSTRAINT search_index_entries_pubstate_check
      CHECK (publication_state IN ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'));
  END IF;
END
$$;

-- target_href wajib relative dan termasuk whitelist route kanonis bila diisi.
-- Validasi penuh dilakukan di service (resolver whitelist); constraint ini
-- hanya menolak skema absolut/eksternal yang jelas berbahaya.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'search_index_entries_target_check'
  ) THEN
    ALTER TABLE __SCHEMA__.search_index_entries
      ADD CONSTRAINT search_index_entries_target_check
      CHECK (
        target_href IS NULL
        OR (
          target_href ~ '^/[a-z0-9/_.-]*$'
          AND target_href !~ '^//'
          AND length(target_href) BETWEEN 1 AND 500
        )
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS search_index_space_target_idx
  ON __SCHEMA__.search_index_entries (space_key, updated_at DESC, id DESC)
  WHERE is_indexed;

CREATE INDEX IF NOT EXISTS search_index_subject_idx
  ON __SCHEMA__.search_index_entries (subject_principal_id)
  WHERE subject_principal_id IS NOT NULL;

-- Perluas job entry-type bila ada instalasi yang belum menjalankan 0025.
-- Idempoten: constraint di-drop lalu dibuat ulang dengan cakupan L06.
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
