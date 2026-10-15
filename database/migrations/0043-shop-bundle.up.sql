-- 0043: SHOP-BUNDLE — "Bundel Ongkir Tetangga" (INOVASI-20261014-0940 IDE 2).
--
-- Patungan ongkir berbasis kota: user satu kota mengelompokkan item wishlist
-- afiliasi ke satu "bundel", estimasi ongkir dibagi rata antar anggota
-- (maks 5 orang), lalu tiap orang tetap checkout sendiri lewat link
-- marketplace masing-masing. Tidak ada uang yang lewat Madevi.
--
-- Tabel baru:
--   A. shipping_bundles — bundel per kota (slot_maks=5, status)
--   B. bundle_items    — item wishlist per anggota dalam bundel
--
-- Status bundel: TERBUKA → PENUH (otomatis saat 5 anggota) → DITUTUP.

-- =========================================================================
-- A. shipping_bundles
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.shipping_bundles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city             text NOT NULL,
  status           text NOT NULL DEFAULT 'TERBUKA',
  slot_maks        integer NOT NULL DEFAULT 5,
  created_by       uuid NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  closed_at        timestamptz,
  CONSTRAINT shipping_bundles_status_check
    CHECK (status IN ('TERBUKA', 'PENUH', 'DITUTUP')),
  CONSTRAINT shipping_bundles_slots_check CHECK (slot_maks BETWEEN 2 AND 5),
  CONSTRAINT shipping_bundles_city_len CHECK (char_length(city) BETWEEN 2 AND 60)
);

CREATE INDEX IF NOT EXISTS shipping_bundles_city_idx
  ON __SCHEMA__.shipping_bundles (city, status, created_at DESC);

-- =========================================================================
-- B. bundle_items — item wishlist afiliasi tiap anggota (snapshot JSON)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.bundle_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id   uuid NOT NULL REFERENCES __SCHEMA__.shipping_bundles(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  product_snapshot jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bundle_items_snapshot_keys CHECK (
    (product_snapshot ? 'name') AND (product_snapshot ? 'price') AND (product_snapshot ? 'link')
  )
);

CREATE INDEX IF NOT EXISTS bundle_items_bundle_idx
  ON __SCHEMA__.bundle_items (bundle_id, user_id);

-- Satu user hanya boleh punya satu item per bundel (slot = user, bukan item).
CREATE UNIQUE INDEX IF NOT EXISTS bundle_items_user_unique_idx
  ON __SCHEMA__.bundle_items (bundle_id, user_id);
