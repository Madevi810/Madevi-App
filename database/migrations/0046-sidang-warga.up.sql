-- 0046: LINE-SIDANG — "Sidang Warga" (INOVASI-20261014-1145 IDE 1, grup Line).
--
-- Protokol musyawarah terstruktur 3 fase di grup: TANYA → SANGGAH → VOTING,
-- voting anonim berkuorum (60% anggota aktif), hasil diarsip permanen.
-- Voting terkunci sampai >= 2 argumen SANGGAH tercatat (anti ruang gema).
--
-- Tabel:
--   A. sidang_sessions  — usulan + fase + kuorum + timer fase
--   B. sidang_arguments — argumen TANYA/JAWAB/SANGGAH/DUKUNG
--   C. sidang_votes     — suara anonim (voter_hash = HMAC(user, session))

-- =========================================================================
-- A. sidang_sessions
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.sidang_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      uuid NOT NULL,
  title         text NOT NULL,
  description   text NOT NULL,
  status        text NOT NULL DEFAULT 'TANYA',
  quorum_pct    integer NOT NULL DEFAULT 60,
  phase_ends_at timestamptz,
  created_by    uuid NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  closed_at     timestamptz,
  CONSTRAINT sidang_sessions_status_check
    CHECK (status IN ('TANYA', 'SANGGAH', 'VOTING', 'SELESAI', 'DIBATALKAN')),
  CONSTRAINT sidang_sessions_quorum_check CHECK (quorum_pct BETWEEN 1 AND 100),
  CONSTRAINT sidang_sessions_title_len CHECK (char_length(title) BETWEEN 5 AND 120),
  CONSTRAINT sidang_sessions_desc_len CHECK (char_length(description) BETWEEN 10 AND 1000)
);

CREATE INDEX IF NOT EXISTS sidang_sessions_group_idx
  ON __SCHEMA__.sidang_sessions (group_id, status, created_at DESC);

-- Transisi fase: TANYA → SANGGAH → VOTING → SELESAI/DIBATALKAN.
-- Melompati SANGGAH dilarang; terminal state tidak berubah.
CREATE OR REPLACE FUNCTION __SCHEMA__.sidang_session_phase_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status IN ('SELESAI', 'DIBATALKAN') AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'sidang_sessions: status terminal tidak dapat diubah';
  END IF;
  IF NEW.status = 'TANYA' AND OLD.status <> 'TANYA' THEN
    RAISE EXCEPTION 'sidang_sessions: tidak bisa kembali ke fase TANYA';
  END IF;
  IF NEW.status = 'VOTING' AND OLD.status NOT IN ('SANGGAH', 'VOTING') THEN
    RAISE EXCEPTION 'sidang_sessions: voting hanya bisa dibuka dari fase SANGGAH, bukan %', OLD.status;
  END IF;
  IF NEW.status = 'SANGGAH' AND OLD.status NOT IN ('TANYA', 'SANGGAH') THEN
    RAISE EXCEPTION 'sidang_sessions: fase SANGGAH hanya dari TANYA, bukan %', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sidang_session_phase_guard ON __SCHEMA__.sidang_sessions;
CREATE TRIGGER sidang_session_phase_guard
  BEFORE UPDATE OF status ON __SCHEMA__.sidang_sessions
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.sidang_session_phase_guard();

-- =========================================================================
-- B. sidang_arguments
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.sidang_arguments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES __SCHEMA__.sidang_sessions(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL,
  kind       text NOT NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sidang_arguments_kind_check
    CHECK (kind IN ('TANYA', 'JAWAB', 'SANGGAH', 'DUKUNG')),
  CONSTRAINT sidang_arguments_body_len CHECK (char_length(body) BETWEEN 5 AND 500)
);

CREATE INDEX IF NOT EXISTS sidang_arguments_session_idx
  ON __SCHEMA__.sidang_arguments (session_id, kind, created_at);

-- =========================================================================
-- C. sidang_votes — anonim via voter_hash; 1 suara per anggota
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.sidang_votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES __SCHEMA__.sidang_sessions(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  choice     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sidang_votes_choice_check CHECK (choice IN ('SETUJU', 'TOLAK', 'ABSTAIN')),
  CONSTRAINT sidang_votes_unique UNIQUE (session_id, voter_hash)
);

CREATE INDEX IF NOT EXISTS sidang_votes_session_idx
  ON __SCHEMA__.sidang_votes (session_id, choice);
