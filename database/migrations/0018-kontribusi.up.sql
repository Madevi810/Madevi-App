-- Migrasi 0018: Modul Kontribusi Offline
-- Menyimpan usulan artikel/ide, dukungan, komentar, sumber.
-- Status: SUBMIT, REVIEW, NEED_REVISION, SAVED, PUBLISHED.
-- Arsip dan kredit tetap ada bila akun pengguna dihapus/ban.

CREATE TABLE __SCHEMA__.user_contributions (
  id uuid PRIMARY KEY,
  principal_id uuid, -- Bisa NULL jika akun dihapus, arsip tetap ada
  creator_name text NOT NULL, -- Nama fallback/kredit kreator tetap ada
  title text NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 5000),
  sources text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'SUBMIT'
    CHECK (status IN ('SUBMIT', 'REVIEW', 'NEED_REVISION', 'SAVED', 'PUBLISHED')),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX user_contributions_principal_idx
  ON __SCHEMA__.user_contributions (principal_id, created_at DESC);

CREATE INDEX user_contributions_status_idx
  ON __SCHEMA__.user_contributions (status, created_at DESC);
