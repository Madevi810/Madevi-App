-- ============================================================
-- 0034: Kebijakan assessment terpusat berversi — D09
-- ============================================================
-- Aturan ujian (batas attempt, durasi, bentuk bank, skor esai) sebelumnya
-- tersebar sebagai literal di application service. MASTER D09 mewajibkan
-- konfigurasi terpusat dan versioned: perubahan aturan tidak boleh mengubah
-- hasil attempt lama secara diam-diam (attempt menyimpan snapshot versi).
--
-- Nilai default v1 sama persis dengan literal lama (3 / 90 / 20 / 5 / 8):
-- tidak ada perubahan perilaku, hanya relokasi ke tabel kebijakan.
-- CHECK 90-menit kaku dilonggarkan menjadi batas wajar 8 jam agar versi
-- kebijakan berikut dapat berlaku tanpa migrasi darurat.

BEGIN;

CREATE TABLE __SCHEMA__.assessment_policies (
  version integer PRIMARY KEY CHECK (version >= 1),
  max_attempts integer NOT NULL CHECK (max_attempts BETWEEN 1 AND 10),
  duration_minutes integer NOT NULL CHECK (duration_minutes BETWEEN 10 AND 480),
  mc_count integer NOT NULL CHECK (mc_count BETWEEN 1 AND 100),
  essay_count integer NOT NULL CHECK (essay_count BETWEEN 0 AND 20),
  essay_max_score integer NOT NULL CHECK (essay_max_score BETWEEN 1 AND 100),
  effective_from timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  superseded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO __SCHEMA__.assessment_policies
  (version, max_attempts, duration_minutes, mc_count, essay_count, essay_max_score)
VALUES (1, 3, 90, 20, 5, 8);

ALTER TABLE __SCHEMA__.exam_attempts
  ADD COLUMN IF NOT EXISTS policy_version integer NOT NULL DEFAULT 1
    REFERENCES __SCHEMA__.assessment_policies(version);

ALTER TABLE __SCHEMA__.exam_attempts DROP CONSTRAINT IF EXISTS exam_attempts_check;
ALTER TABLE __SCHEMA__.exam_attempts
  ADD CONSTRAINT exam_attempts_deadline_check
    CHECK (deadline_at > started_at AND deadline_at <= started_at + INTERVAL '8 hours');

COMMIT;
