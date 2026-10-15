-- Migrasi 0007: Pembelajaran, Ujian, dan Sertifikat
-- Prompt 07 — Madevi Offline
-- Bank soal sudah ada di 0006. Migrasi ini menambah mesin ujian, jalur belajar, dan sertifikat.

-- Metadata validasi Prompt 07 untuk bank soal dari migrasi 0006.
-- Bank Inggris tidak dapat dipakai sebelum review Admin.
ALTER TABLE __SCHEMA__.question_banks
  ADD COLUMN reviewed_by uuid REFERENCES __SCHEMA__.principals(id),
  ADD COLUMN reviewed_at timestamptz;

ALTER TABLE __SCHEMA__.questions_mc
  ADD COLUMN source_id uuid REFERENCES __SCHEMA__.article_sources(id),
  ADD COLUMN difficulty text NOT NULL DEFAULT 'MEDIUM'
    CHECK (difficulty IN ('EASY','MEDIUM','HARD'));

ALTER TABLE __SCHEMA__.questions_essay
  ADD COLUMN source_id uuid REFERENCES __SCHEMA__.article_sources(id),
  ADD COLUMN difficulty text NOT NULL DEFAULT 'MEDIUM'
    CHECK (difficulty IN ('EASY','MEDIUM','HARD'));

CREATE UNIQUE INDEX questions_mc_bank_stem_unique_idx
  ON __SCHEMA__.questions_mc (bank_id, lower(btrim(stem)));
CREATE UNIQUE INDEX questions_essay_bank_stem_unique_idx
  ON __SCHEMA__.questions_essay (bank_id, lower(btrim(stem)));

-- ============================================================
-- JALUR BELAJAR (hanya Admin membuat)
-- ============================================================

CREATE TABLE __SCHEMA__.learning_paths (
  id uuid PRIMARY KEY,
  business_code text NOT NULL UNIQUE
    CHECK (business_code ~ '^[A-Z0-9_-]{3,80}$'),
  name text NOT NULL CHECK (length(name) BETWEEN 3 AND 200),
  description text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'BEGINNER'
    CHECK (difficulty IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
  -- Snapshot versi untuk audit sertifikat
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  minimum_score smallint NOT NULL DEFAULT 80 CHECK (minimum_score = 80),
  estimated_hours smallint CHECK (estimated_hours > 0),
  is_test boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  updated_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX learning_paths_status_idx
  ON __SCHEMA__.learning_paths (status, created_at DESC);

-- Urutan artikel dalam jalur
CREATE TABLE __SCHEMA__.learning_path_articles (
  path_id uuid NOT NULL REFERENCES __SCHEMA__.learning_paths(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 0),
  is_exam_required boolean NOT NULL DEFAULT true,
  -- Prasyarat: article_id dari jalur yang sama harus sudah lulus sebelum ini
  prerequisite_article_id uuid REFERENCES __SCHEMA__.articles(id),
  PRIMARY KEY (path_id, article_id)
);

CREATE INDEX lpa_path_position_idx
  ON __SCHEMA__.learning_path_articles (path_id, position);

-- Satu baris per siklus membuktikan bahwa reset bukan sekadar mengosongkan counter.
CREATE TABLE __SCHEMA__.learning_cycles (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  path_id uuid NOT NULL REFERENCES __SCHEMA__.learning_paths(id),
  cycle integer NOT NULL CHECK (cycle >= 1),
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','RESET_REQUIRED','COMPLETED')),
  started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz,
  reset_reason text,
  UNIQUE (principal_id, path_id, cycle)
);

CREATE UNIQUE INDEX learning_cycles_one_active_idx
  ON __SCHEMA__.learning_cycles (principal_id, path_id)
  WHERE status = 'ACTIVE';

-- ============================================================
-- PROGRESS BELAJAR PENGGUNA
-- ============================================================

CREATE TABLE __SCHEMA__.learning_progress (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  path_id uuid NOT NULL REFERENCES __SCHEMA__.learning_paths(id),
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id),

  -- Artikel dianggap selesai setelah pengguna membukanya
  read_at timestamptz,

  -- Siklus ulang jalur (reset setelah gagal 3 attempt dan mengulang prasyarat)
  cycle integer NOT NULL DEFAULT 1 CHECK (cycle >= 1),

  -- Ringkasan attempt ujian
  attempts_used smallint NOT NULL DEFAULT 0 CHECK (attempts_used BETWEEN 0 AND 3),
  best_score numeric(5,2) CHECK (best_score BETWEEN 0 AND 100),
  passed boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (principal_id, path_id, article_id, cycle)
);

CREATE INDEX learning_progress_principal_path_idx
  ON __SCHEMA__.learning_progress (principal_id, path_id, cycle);

-- ============================================================
-- ATTEMPT UJIAN (satu aktif per principal+article+cycle)
-- ============================================================

CREATE TABLE __SCHEMA__.exam_attempts (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  article_id uuid NOT NULL REFERENCES __SCHEMA__.articles(id),
  path_id uuid REFERENCES __SCHEMA__.learning_paths(id),
  cycle integer NOT NULL DEFAULT 1,

  -- Snapshot bank soal saat attempt dimulai (tidak berubah walau bank diedit)
  bank_snapshot_id uuid NOT NULL REFERENCES __SCHEMA__.question_banks(id),

  -- Timer server; durasi tetap 90 menit
  started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deadline_at timestamptz NOT NULL,
  submitted_at timestamptz,
  timed_out boolean NOT NULL DEFAULT false,

  -- Status attempt
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN (
      'ACTIVE',      -- sedang dikerjakan
      'SUBMITTED',   -- dikirim, menunggu penilaian esai
      'GRADING',     -- sedang dinilai Admin
      'REVIEW',      -- diminta tinjau ulang
      'GRADED'       -- selesai dinilai
    )),

  -- Skor
  pg_score numeric(5,2) CHECK (pg_score BETWEEN 0 AND 60),
  essay_score numeric(5,2) CHECK (essay_score BETWEEN 0 AND 40),
  total_score numeric(5,2) CHECK (total_score BETWEEN 0 AND 100),
  passed boolean,

  -- Identitas Admin (samaran saat menilai)
  graded_by uuid REFERENCES __SCHEMA__.principals(id),
  graded_at timestamptz,

  -- Audit score change
  score_revision_count integer NOT NULL DEFAULT 0,

  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (deadline_at = started_at + INTERVAL '90 minutes')
);

-- Hanya satu attempt ACTIVE per principal+article+cycle.
CREATE UNIQUE INDEX exam_attempts_one_active_idx
  ON __SCHEMA__.exam_attempts (principal_id, article_id, cycle)
  WHERE status = 'ACTIVE';

CREATE INDEX exam_attempts_principal_idx
  ON __SCHEMA__.exam_attempts (principal_id, article_id, cycle, status);
CREATE INDEX exam_attempts_grading_queue_idx
  ON __SCHEMA__.exam_attempts (status, submitted_at)
  WHERE status IN ('SUBMITTED','GRADING','REVIEW');

-- Admin dapat menjeda attempt baru ketika kapasitas penilaian penuh.
CREATE TABLE __SCHEMA__.exam_capacity_control (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  accepting_new_attempts boolean NOT NULL DEFAULT true,
  pause_reason text NOT NULL DEFAULT '',
  updated_by uuid REFERENCES __SCHEMA__.principals(id),
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO __SCHEMA__.exam_capacity_control (singleton) VALUES (true);

-- ============================================================
-- JAWABAN PG (disimpan setiap autosave; tidak bocor sebelum grade-final)
-- ============================================================

CREATE TABLE __SCHEMA__.attempt_mc_answers (
  attempt_id uuid NOT NULL REFERENCES __SCHEMA__.exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES __SCHEMA__.questions_mc(id),
  position_snapshot smallint NOT NULL CHECK (position_snapshot BETWEEN 1 AND 20),
  -- Snapshot teks soal + pilihan saat attempt dimulai
  stem_snapshot text NOT NULL,
  options_snapshot jsonb NOT NULL,
  -- Jawaban pengguna (null = belum dijawab)
  selected_key text CHECK (selected_key IN ('A','B','C','D')),
  -- Snapshot privat untuk scoring server; tidak pernah dikirim sebelum GRADED.
  correct_key_snapshot text NOT NULL CHECK (correct_key_snapshot IN ('A','B','C','D')),
  explanation_snapshot text NOT NULL DEFAULT '',
  -- Kunci hanya tersedia setelah grade-final (null sampai itu)
  correct_key_revealed text CHECK (correct_key_revealed IN ('A','B','C','D')),
  is_correct boolean, -- null sampai grade-final
  points_earned numeric(4,2) CHECK (points_earned BETWEEN 0 AND 3),
  saved_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attempt_id, question_id)
);

-- ============================================================
-- JAWABAN ESAI (autosave teks; kunci/nilai tidak bocor sebelum grade-final)
-- ============================================================

CREATE TABLE __SCHEMA__.attempt_essay_answers (
  attempt_id uuid NOT NULL REFERENCES __SCHEMA__.exam_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES __SCHEMA__.questions_essay(id),
  position_snapshot smallint NOT NULL CHECK (position_snapshot BETWEEN 1 AND 5),
  -- Snapshot teks soal dan rubrik saat attempt dimulai
  stem_snapshot text NOT NULL,
  rubric_snapshot text NOT NULL,
  max_score_snapshot smallint NOT NULL,
  -- Jawaban pengguna (teks; null = kosong)
  answer_text text DEFAULT '',
  -- Penilaian Admin (null sampai GRADED)
  score_given numeric(4,2) CHECK (score_given BETWEEN 0 AND 8),
  owner_note text,
  -- Identitas samaran (disamarkan saat Admin menilai; bisa dibuka Admin)
  identity_masked boolean NOT NULL DEFAULT true,
  saved_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attempt_id, question_id)
);

-- ============================================================
-- AUDIT PERUBAHAN SKOR
-- ============================================================

CREATE TABLE __SCHEMA__.score_revisions (
  id uuid PRIMARY KEY,
  attempt_id uuid NOT NULL REFERENCES __SCHEMA__.exam_attempts(id),
  revised_by uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  revised_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  old_total_score numeric(5,2),
  new_total_score numeric(5,2),
  reason text NOT NULL CHECK (length(reason) BETWEEN 5 AND 1000)
);

-- ============================================================
-- PERMOHONAN TINJAU NILAI (pengguna → Admin)
-- ============================================================

CREATE TABLE __SCHEMA__.grade_reviews (
  id uuid PRIMARY KEY,
  attempt_id uuid NOT NULL REFERENCES __SCHEMA__.exam_attempts(id),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  reason text NOT NULL CHECK (length(reason) BETWEEN 10 AND 2000),
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','RESOLVED','REJECTED')),
  owner_response text NOT NULL DEFAULT '',
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SERTIFIKAT INTERNAL
-- ============================================================

CREATE TABLE __SCHEMA__.certificates (
  id uuid PRIMARY KEY,
  -- Nomor unik sertifikat (untuk QR/verifikasi)
  certificate_number text NOT NULL UNIQUE
    CHECK (certificate_number ~ '^MDV-[0-9]{4}-[A-Z0-9]{8}$'),
  principal_id uuid NOT NULL REFERENCES __SCHEMA__.principals(id),
  path_id uuid NOT NULL REFERENCES __SCHEMA__.learning_paths(id),

  -- Snapshot jalur saat sertifikat diterbitkan (untuk audit)
  path_version_snapshot integer NOT NULL,
  path_name_snapshot text NOT NULL,

  -- Nama lengkap dari data pendaftaran
  full_name_snapshot text NOT NULL CHECK (length(full_name_snapshot) BETWEEN 1 AND 200),

  -- Tanggal jalur diselesaikan
  completed_at timestamptz NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Status
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','REPLACED','REVOKED')),
  revoked_at timestamptz,
  revoke_reason text,
  replaced_by uuid REFERENCES __SCHEMA__.certificates(id),

  is_test boolean NOT NULL DEFAULT false
);

CREATE INDEX certificates_principal_idx
  ON __SCHEMA__.certificates (principal_id);
CREATE INDEX certificates_number_idx
  ON __SCHEMA__.certificates (certificate_number);
CREATE UNIQUE INDEX certificates_one_active_path_idx
  ON __SCHEMA__.certificates (principal_id, path_id)
  WHERE status = 'ACTIVE';

-- Audit sertifikat
CREATE TABLE __SCHEMA__.certificate_audits (
  id uuid PRIMARY KEY,
  certificate_id uuid NOT NULL REFERENCES __SCHEMA__.certificates(id),
  action text NOT NULL CHECK (action IN ('ISSUED','REPLACED','REVOKED','VERIFIED')),
  performed_by uuid REFERENCES __SCHEMA__.principals(id),
  performed_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note text NOT NULL DEFAULT ''
);
