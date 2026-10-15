-- 0045: SHOP-DUEL — "Duel Produk" (INOVASI-20261014-1045 IDE 2, Shop affiliate).
--
-- Komparasi head-to-head antara DUA produk afilasi sejenis: kartu
-- pro/kontra per produk, member memilih pemenang dengan alasan wajib
-- (>= 30 karakter). Pemenang mendapat badge "Pilihan Komunitas" di
-- katalog Shop. Produk harus dari katalog afiliasi yang sudah ada.
--
-- Tabel:
--   A. product_duels  — duel (TERBUKA/SELESAI, winner_id nullable)
--   B. duel_points    — pro/kontra per produk (PRO/KONTRA)
--   C. duel_votes     — 1 vote per user per duel + alasan wajib

-- =========================================================================
-- A. product_duels
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.product_duels (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  product_a_id uuid NOT NULL,
  product_b_id uuid NOT NULL,
  status       text NOT NULL DEFAULT 'TERBUKA',
  winner_id    uuid,
  ends_at      timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_by   uuid NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_duels_status_check CHECK (status IN ('TERBUKA', 'SELESAI')),
  CONSTRAINT product_duels_distinct_products CHECK (product_a_id <> product_b_id),
  CONSTRAINT product_duels_title_len CHECK (char_length(title) BETWEEN 5 AND 120),
  CONSTRAINT product_duels_winner_is_participant CHECK (
    winner_id IS NULL OR winner_id = product_a_id OR winner_id = product_b_id
  )
);

CREATE INDEX IF NOT EXISTS product_duels_status_idx
  ON __SCHEMA__.product_duels (status, ends_at);
CREATE INDEX IF NOT EXISTS product_duels_products_idx
  ON __SCHEMA__.product_duels (product_a_id, product_b_id);

-- Transisi: TERBUKA → SELESAI; winner hanya boleh diisi saat menutup.
CREATE OR REPLACE FUNCTION __SCHEMA__.product_duels_status_guard()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'SELESAI' AND NEW.status <> OLD.status THEN
    RAISE EXCEPTION 'product_duels: duel SELESAI tidak dapat diubah';
  END IF;
  IF OLD.status = 'TERBUKA' AND NEW.status NOT IN ('TERBUKA', 'SELESAI') THEN
    RAISE EXCEPTION 'product_duels: dari TERBUKA hanya boleh ke SELESAI, bukan %', NEW.status;
  END IF;
  IF NEW.status = 'TERBUKA' AND NEW.winner_id IS NOT NULL THEN
    RAISE EXCEPTION 'product_duels: winner hanya boleh diisi saat duel ditutup';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_duels_status_guard ON __SCHEMA__.product_duels;
CREATE TRIGGER product_duels_status_guard
  BEFORE UPDATE OF status, winner_id ON __SCHEMA__.product_duels
  FOR EACH ROW EXECUTE FUNCTION __SCHEMA__.product_duels_status_guard();

-- =========================================================================
-- B. duel_points — pro/kontra per produk (komunitas)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.duel_points (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id    uuid NOT NULL REFERENCES __SCHEMA__.product_duels(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  side       text NOT NULL,
  body       text NOT NULL,
  author_id  uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT duel_points_side_check CHECK (side IN ('PRO', 'KONTRA')),
  CONSTRAINT duel_points_body_len CHECK (char_length(body) BETWEEN 20 AND 500)
);

CREATE INDEX IF NOT EXISTS duel_points_duel_idx
  ON __SCHEMA__.duel_points (duel_id, product_id, side);

-- =========================================================================
-- C. duel_votes — 1 vote per user per duel, alasan wajib >= 30 karakter
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.duel_votes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id           uuid NOT NULL REFERENCES __SCHEMA__.product_duels(id) ON DELETE CASCADE,
  voter_id          uuid NOT NULL,
  chosen_product_id uuid NOT NULL,
  reason            text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT duel_votes_unique UNIQUE (duel_id, voter_id),
  CONSTRAINT duel_votes_reason_len CHECK (char_length(reason) >= 30)
);

CREATE INDEX IF NOT EXISTS duel_votes_duel_idx
  ON __SCHEMA__.duel_votes (duel_id, chosen_product_id);
