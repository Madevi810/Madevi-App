-- 0044: LINE-LISTEN — "Giliran Dengar" (INOVASI-20261014-1045 IDE 1, Sosial Curhat).
--
-- Sesi curhat terstruktur berbasis giliran: pembicara didengar 20 menit,
-- pendengar hanya boleh respons refleksi empati; SARAN ditolak di service
-- layer bila pembicara belum membuka "Saya butuh saran".
--
-- Tabel:
--   A. listen_sessions  — sesi curhat (status ANTRI/BERJALAN/SELESAI)
--   B. listen_responses — respons pendengar (REFLEKSI/SEMANGAT/SARAN)

-- =========================================================================
-- A. listen_sessions
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.listen_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id     uuid NOT NULL,
  topic          text NOT NULL,
  is_anonymous   boolean NOT NULL DEFAULT false,
  needs_advice   boolean NOT NULL DEFAULT false,
  status         text NOT NULL DEFAULT 'ANTRI',
  listener_count integer NOT NULL DEFAULT 0,
  starts_at      timestamptz,
  ends_at        timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listen_sessions_status_check
    CHECK (status IN ('ANTRI', 'BERJALAN', 'SELESAI')),
  CONSTRAINT listen_sessions_topic_len CHECK (char_length(topic) BETWEEN 5 AND 200)
);

CREATE INDEX IF NOT EXISTS listen_sessions_status_idx
  ON __SCHEMA__.listen_sessions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS listen_sessions_speaker_idx
  ON __SCHEMA__.listen_sessions (speaker_id, created_at DESC);

-- Transisi status: ANTRI → BERJALAN → SELESAI; setelah SELESAI tidak berubah.
CREATE OR REPLACE FUNCTION __SCHEMA__.listen_session_status_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'SELESAI' AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'listen_sessions: sesi SELESAI tidak dapat diubah';
  END IF;
  IF OLD.status = 'BERJALAN' AND NEW.status NOT IN ('BERJALAN', 'SELESAI') THEN
    RAISE EXCEPTION 'listen_sessions: dari BERJALAN hanya boleh ke SELESAI, bukan %', NEW.status;
  END IF;
  IF OLD.status = 'ANTRI' AND NEW.status NOT IN ('ANTRI', 'BERJALAN', 'SELESAI') THEN
    RAISE EXCEPTION 'listen_sessions: dari ANTRI hanya boleh ke BERJALAN/SELESAI, bukan %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listen_session_status_guard ON __SCHEMA__.listen_sessions;
CREATE TRIGGER listen_session_status_guard
  BEFORE UPDATE OF status ON __SCHEMA__.listen_sessions
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.listen_session_status_guard();

-- =========================================================================
-- B. listen_responses
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.listen_responses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES __SCHEMA__.listen_sessions(id) ON DELETE CASCADE,
  listener_id uuid NOT NULL,
  response_kind text NOT NULL,
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listen_responses_kind_check
    CHECK (response_kind IN ('REFLEKSI', 'SEMANGAT', 'SARAN')),
  CONSTRAINT listen_responses_body_len CHECK (char_length(body) BETWEEN 2 AND 280)
);

CREATE INDEX IF NOT EXISTS listen_responses_session_idx
  ON __SCHEMA__.listen_responses (session_id, created_at);
CREATE INDEX IF NOT EXISTS listen_responses_listener_idx
  ON __SCHEMA__.listen_responses (listener_id, created_at DESC);

-- =========================================================================
-- C. listen_session_listeners — keanggotaan pendengar (maks 12 per sesi)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.listen_session_listeners (
  session_id  uuid NOT NULL REFERENCES __SCHEMA__.listen_sessions(id) ON DELETE CASCADE,
  listener_id uuid NOT NULL,
  joined_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, listener_id)
);

-- Maks 12 pendengar per sesi: trigger menolak insert ke-13.
CREATE OR REPLACE FUNCTION __SCHEMA__.listen_listeners_cap()
RETURNS trigger AS $$
DECLARE
  n integer;
BEGIN
  SELECT COUNT(*)::int INTO n
    FROM __SCHEMA__.listen_session_listeners
   WHERE session_id = NEW.session_id;
  IF n >= 12 THEN
    RAISE EXCEPTION 'listen_session_listeners: maksimum 12 pendengar per sesi';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listen_listeners_cap ON __SCHEMA__.listen_session_listeners;
CREATE TRIGGER listen_listeners_cap
  BEFORE INSERT ON __SCHEMA__.listen_session_listeners
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.listen_listeners_cap();
