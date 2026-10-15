-- 0049: SHOP-PETITION — "Petisi Katalog" (INOVASI-20261014-1245 IDE 2, Shop affiliate).
--
-- Pengguna mengusulkan produk untuk masuk katalog afiliasi Shop dan
-- mem-vote usulan orang lain; usulan mencapai kuorum (50 dukungan)
-- masuk antrean peninjauan admin (Ade) untuk didaftarkan sebagai link
-- afiliasi. Deteksi duplikat link marketplace via normalisasi URL.
--
-- Tabel:
--   A. catalog_petitions — usulan produk (status DIUSULKAN/DITINJAU/TERDAFTAR/DITOLAK)
--   B. petition_votes    — dukungan (1x per user, bisa dicabut)

-- =========================================================================
-- A. catalog_petitions
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.catalog_petitions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name      text NOT NULL,
  marketplace_url   text NOT NULL,
  url_normalized    text NOT NULL,
  category          text NOT NULL,
  reason            text NOT NULL,
  status            text NOT NULL DEFAULT 'DIUSULKAN',
  vote_count        integer NOT NULL DEFAULT 0,
  created_by        uuid NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  reviewed_at       timestamptz,
  review_reason     text,
  CONSTRAINT catalog_petitions_status_check
    CHECK (status IN ('DIUSULKAN', 'DITINJAU', 'TERDAFTAR', 'DITOLAK')),
  CONSTRAINT catalog_petitions_name_len CHECK (char_length(product_name) BETWEEN 3 AND 200),
  CONSTRAINT catalog_petitions_reason_len CHECK (char_length(reason) BETWEEN 20 AND 2000),
  CONSTRAINT catalog_petitions_votes_check CHECK (vote_count >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS catalog_petitions_url_unique_idx
  ON __SCHEMA__.catalog_petitions (url_normalized)
  WHERE status IN ('DIUSULKAN', 'DITINJAU');

CREATE INDEX IF NOT EXISTS catalog_petitions_status_idx
  ON __SCHEMA__.catalog_petitions (status, vote_count DESC);
CREATE INDEX IF NOT EXISTS catalog_petitions_creator_idx
  ON __SCHEMA__.catalog_petitions (created_by, created_at DESC);

-- Transisi: DIUSULKAN → DITINJAU (kuorum) → TERDAFTAR/DITOLAK (admin).
-- DITOLAK/DITERDAFTAR terminal; alasan wajib saat DITOLAK.
CREATE OR REPLACE FUNCTION __SCHEMA__.catalog_petitions_status_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status IN ('TERDAFTAR', 'DITOLAK') AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'catalog_petitions: status terminal tidak dapat diubah';
  END IF;
  IF NEW.status = 'DITOLAK' AND COALESCE(NEW.review_reason, '') = '' THEN
    RAISE EXCEPTION 'catalog_petitions: alasan wajib saat menolak petisi';
  END IF;
  IF NEW.status = 'TERDAFTAR' AND OLD.status <> 'DITINJAU' THEN
    RAISE EXCEPTION 'catalog_petitions: TERDAFTAR hanya dari DITINJAU, bukan %', OLD.status;
  END IF;
  IF NEW.status = 'DITINJAU' AND OLD.status <> 'DIUSULKAN' THEN
    RAISE EXCEPTION 'catalog_petitions: DITINJAU hanya dari DIUSULKAN, bukan %', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS catalog_petitions_status_guard ON __SCHEMA__.catalog_petitions;
CREATE TRIGGER catalog_petitions_status_guard
  BEFORE UPDATE OF status ON __SCHEMA__.catalog_petitions
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.catalog_petitions_status_guard();

-- =========================================================================
-- B. petition_votes — 1x per user, bisa dicabut
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.petition_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id uuid NOT NULL REFERENCES __SCHEMA__.catalog_petitions(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT petition_votes_unique UNIQUE (petition_id, user_id)
);

CREATE INDEX IF NOT EXISTS petition_votes_petition_idx
  ON __SCHEMA__.petition_votes (petition_id);
CREATE INDEX IF NOT EXISTS petition_votes_user_idx
  ON __SCHEMA__.petition_votes (user_id);

-- Jaga konsistensi vote_count: UPDATE/DELETE vote → decrement,
-- INSERT vote → increment (counter sinkron, bukan dihitung ulang terus).
CREATE OR REPLACE FUNCTION __SCHEMA__.petition_votes_count_sync()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE __SCHEMA__.catalog_petitions
       SET vote_count = vote_count + 1 WHERE id = NEW.petition_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE __SCHEMA__.catalog_petitions
       SET vote_count = vote_count - 1 WHERE id = OLD.petition_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS petition_votes_insert_sync ON __SCHEMA__.petition_votes;
CREATE TRIGGER petition_votes_insert_sync
  AFTER INSERT ON __SCHEMA__.petition_votes
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.petition_votes_count_sync();

DROP TRIGGER IF EXISTS petition_votes_delete_sync ON __SCHEMA__.petition_votes;
CREATE TRIGGER petition_votes_delete_sync
  AFTER DELETE ON __SCHEMA__.petition_votes
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.petition_votes_count_sync();
