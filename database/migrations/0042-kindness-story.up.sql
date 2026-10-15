-- 0042: LINE-KINDNESS + LINE-STORY — Peta Kebaikan & Dongeng Bareng (INOVASI-0841/0940).
--
-- Menambahkan:
--   A. kindness_report  — laporan kebaikan per kota (INOVASI-0841 IDE 2)
--   B. story_threads   — utas cerita fiksi bersambung (INOVASI-0940 IDE 1)
--   C. story_chapters  — bab ajukan/vote/kanon (INOVASI-0940 IDE 1)
--   D. story_votes     — vote member per bab (1 vote per user per bab)
--
-- Semua kolom baru nullable/DEFAULT agar migrasi aman pada data yang sudah ada.
-- Tabel baru memakai status tekstual dengan CHECK constraint agar nilai
-- tidak memutar di luar domain yang ditetapkan.

-- =========================================================================
-- A. kindness_report — Peta Kebaikan (INOVASI-0841 IDE 2)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.kindness_report (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id     uuid NOT NULL,
  title           text NOT NULL,
  story           text NOT NULL,
  city            text NOT NULL,
  category        text NOT NULL,
  is_anonymous    boolean NOT NULL DEFAULT false,
  photo_url       text,
  status          text NOT NULL DEFAULT 'ANTRI',
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kindness_report_status_check
    CHECK (status IN ('ANTRI', 'TAYANG', 'DITOLAK')),
  CONSTRAINT kindness_report_category_check
    CHECK (category IN ('BANTU_TETANGGA', 'BANTU_JALAN', 'LINGKUNGAN', 'PENDIDIKAN', 'LAINNYA')),
  CONSTRAINT kindness_report_title_len   CHECK (char_length(title) BETWEEN 3 AND 120),
  CONSTRAINT kindness_report_story_len   CHECK (char_length(story) BETWEEN 10 AND 500)
);

CREATE INDEX IF NOT EXISTS kindness_report_city_idx
  ON __SCHEMA__.kindness_report (city, created_at DESC);
CREATE INDEX IF NOT EXISTS kindness_report_status_idx
  ON __SCHEMA__.kindness_report (status, created_at DESC);

-- Status ANTRI → TAYANG/DITOLAK hanya melalui antrean moderasi admin
-- (reuse pipeline INSTRUKSI-03). Trigger ini mencegah UPDATE langsung
-- yang melompati review: dari ANTRI hanya boleh ke TAYANG/DITOLAK,
-- dan setelah TAYANG/DITOLAK tidak boleh berubah lagi.
CREATE OR REPLACE FUNCTION __SCHEMA__.kindness_report_status_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status <> 'ANTRI' AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'kindness_report: status final tidak dapat diubah dari %', OLD.status;
  END IF;
  IF OLD.status = 'ANTRI' AND NEW.status NOT IN ('TAYANG', 'DITOLAK') THEN
    RAISE EXCEPTION 'kindness_report: dari ANTRI hanya boleh ke TAYANG/DITOLAK, bukan %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS kindness_report_status_guard ON __SCHEMA__.kindness_report;
CREATE TRIGGER kindness_report_status_guard
  BEFORE UPDATE OF status ON __SCHEMA__.kindness_report
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.kindness_report_status_guard();

-- =========================================================================
-- B. story_threads — Dongeng Bareng (INOVASI-0940 IDE 1)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.story_threads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  synopsis    text NOT NULL,
  genre       text NOT NULL,
  created_by  uuid NOT NULL,
  status      text NOT NULL DEFAULT 'TERBUKA',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT story_threads_status_check
    CHECK (status IN ('TERBUKA', 'SELESAI')),
  CONSTRAINT story_threads_genre_check
    CHECK (genre IN ('HOROR', 'KOMEDI', 'DRAMA', 'FANTASI', 'PETUALANGAN', 'ROMANSA', 'LAINNYA')),
  CONSTRAINT story_threads_title_len    CHECK (char_length(title) BETWEEN 3 AND 120),
  CONSTRAINT story_threads_synopsis_len CHECK (char_length(synopsis) BETWEEN 10 AND 500)
);

CREATE INDEX IF NOT EXISTS story_threads_status_idx
  ON __SCHEMA__.story_threads (status, created_at DESC);

-- =========================================================================
-- C. story_chapters — bab ajuan (maks 300 kata), vote, kanonisasi mingguan
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.story_chapters (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id     uuid NOT NULL REFERENCES __SCHEMA__.story_threads(id) ON DELETE CASCADE,
  author_id     uuid NOT NULL,
  body          text NOT NULL,
  is_canon      boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'AJUAN',
  week_number   integer NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT story_chapters_status_check
    CHECK (status IN ('AJUAN', 'KANON', 'ARSIP')),
  -- RENCANA #2: maks 300 kata per bab (dipisah spasi; bahasa Indonesia
  -- tidak menggunakan tanda hubung sebagai pemisah kata).
  CONSTRAINT story_chapters_word_count CHECK (
    array_length(string_to_array(trim(body), ' '), 1) <= 300
  ),
  CONSTRAINT story_chapters_body_len CHECK (char_length(body) BETWEEN 20 AND 2400)
);

CREATE INDEX IF NOT EXISTS story_chapters_thread_idx
  ON __SCHEMA__.story_chapters (thread_id, week_number, created_at);
CREATE INDEX IF NOT EXISTS story_chapters_canon_idx
  ON __SCHEMA__.story_chapters (thread_id, is_canon, week_number);

-- Satu bab = salah satu KANON atau AJUAN; KANON wajib unik per (thread, week).
CREATE UNIQUE INDEX IF NOT EXISTS story_chapters_canon_unique_idx
  ON __SCHEMA__.story_chapters (thread_id, week_number)
  WHERE is_canon = true AND status = 'KANON';

-- =========================================================================
-- D. story_votes — 1 vote per user per bab (idempoten)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.story_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  uuid NOT NULL REFERENCES __SCHEMA__.story_chapters(id) ON DELETE CASCADE,
  voter_id    uuid NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT story_votes_unique UNIQUE (chapter_id, voter_id)
);

CREATE INDEX IF NOT EXISTS story_votes_chapter_idx
  ON __SCHEMA__.story_votes (chapter_id);
