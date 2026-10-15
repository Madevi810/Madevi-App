-- 0047: LINE-CLINIC — "Klinik Ide" (INOVASI-20261014-1145 IDE 2, Sosial Karya).
--
-- Protokol kritik karya 3 fase: BERTANYA → MEMBEDAH → APRESIASI.
-- kind feedback divalidasi terhadap fase aktif (PERTANYAAN hanya di
-- BERTANYA, SARAN hanya di MEMBEDAH); pelanggaran ditolak sistem.
-- Vote "Pilihan Klinik" hanya di fase APRESIASI, 1x per user.
--
-- Tabel:
--   A. clinic_sessions  — sesi klinik per karya (1 aktif per karya)
--   B. clinic_feedback  — feedback PERTANYAAN/SARAN/APRESIASI
--   C. clinic_votes     — vote Pilihan Klinik (apresiasi)

-- =========================================================================
-- A. clinic_sessions
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.clinic_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       uuid NOT NULL,
  status        text NOT NULL DEFAULT 'BERTANYA',
  phase_ends_at timestamptz,
  created_by    uuid NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  closed_at     timestamptz,
  CONSTRAINT clinic_sessions_status_check
    CHECK (status IN ('BERTANYA', 'MEMBEDAH', 'APRESIASI', 'SELESAI'))
);

-- 1 klinik aktif per karya: indeks unik parsial pada karya yang belum SELESAI.
CREATE UNIQUE INDEX IF NOT EXISTS clinic_sessions_active_unique_idx
  ON __SCHEMA__.clinic_sessions (post_id)
  WHERE status <> 'SELESAI';

CREATE INDEX IF NOT EXISTS clinic_sessions_post_idx
  ON __SCHEMA__.clinic_sessions (post_id, status);

-- Transisi: BERTANYA → MEMBEDAH → APRESIASI → SELESAI; urutan ditegakkan.
CREATE OR REPLACE FUNCTION __SCHEMA__.clinic_session_phase_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'SELESAI' AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'clinic_sessions: klinik SELESAI tidak dapat diubah';
  END IF;
  IF NEW.status = 'BERTANYA' AND OLD.status <> 'BERTANYA' THEN
    RAISE EXCEPTION 'clinic_sessions: tidak bisa kembali ke BERTANYA';
  END IF;
  IF NEW.status = 'MEMBEDAH' AND OLD.status NOT IN ('BERTANYA', 'MEMBEDAH') THEN
    RAISE EXCEPTION 'clinic_sessions: MEMBEDAH hanya dari BERTANYA, bukan %', OLD.status;
  END IF;
  IF NEW.status = 'APRESIASI' AND OLD.status NOT IN ('MEMBEDAH', 'APRESIASI') THEN
    RAISE EXCEPTION 'clinic_sessions: APRESIASI hanya dari MEMBEDAH, bukan %', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clinic_session_phase_guard ON __SCHEMA__.clinic_sessions;
CREATE TRIGGER clinic_session_phase_guard
  BEFORE UPDATE OF status ON __SCHEMA__.clinic_sessions
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.clinic_session_phase_guard();

-- =========================================================================
-- B. clinic_feedback
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.clinic_feedback (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES __SCHEMA__.clinic_sessions(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL,
  kind       text NOT NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT clinic_feedback_kind_check
    CHECK (kind IN ('PERTANYAAN', 'SARAN', 'APRESIASI')),
  CONSTRAINT clinic_feedback_body_len CHECK (char_length(body) BETWEEN 5 AND 500)
);

CREATE INDEX IF NOT EXISTS clinic_feedback_session_idx
  ON __SCHEMA__.clinic_feedback (session_id, kind, created_at);

-- =========================================================================
-- C. clinic_votes — 1 vote per user per klinik
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.clinic_votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES __SCHEMA__.clinic_sessions(id) ON DELETE CASCADE,
  voter_id   uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT clinic_votes_unique UNIQUE (session_id, voter_id)
);

CREATE INDEX IF NOT EXISTS clinic_votes_session_idx
  ON __SCHEMA__.clinic_votes (session_id);
