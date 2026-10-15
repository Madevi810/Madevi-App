-- 0048: LINE-LINEAGE — "Silsilah Karya" (INOVASI-20261014-1245 IDE 1, Sosial Karya).
--
-- Pohon turunan karya remix: karya yang di-remix/dilanjutkan dari karya
-- orang lain tercatat sebagai turunan, atribusi otomatis ke pencipta
-- asli, badge Induk Ide (>= 5 turunan langsung) / Kakek Ide (>= 25 total).
--
-- Perubahan:
--   A. social_posts.parent_karya_id (nullable) — induk langsung sebuah karya
--   B. tabel karya_lineage (karya_id, ancestor_id, depth) — query turunan cepat
--
-- Anti-sirkular: karya tidak boleh menjadi turunan dari turunannya sendiri
-- (diperiksa di service layer via karya_lineage existing).

-- =========================================================================
-- A. Kolom induk pada social_posts (karya = post dengan post_type='KARYA')
-- =========================================================================
ALTER TABLE __SCHEMA__.social_posts
  ADD COLUMN IF NOT EXISTS parent_karya_id uuid;

CREATE INDEX IF NOT EXISTS social_posts_parent_karya_idx
  ON __SCHEMA__.social_posts (parent_karya_id)
  WHERE post_type = 'KARYA';

-- =========================================================================
-- B. karya_lineage — jalur ancestor lengkap per karya (transitive closure)
-- =========================================================================
CREATE TABLE IF NOT EXISTS __SCHEMA__.karya_lineage (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  karya_id    uuid NOT NULL,
  ancestor_id uuid NOT NULL,
  depth       integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT karya_lineage_depth_check CHECK (depth >= 1),
  CONSTRAINT karya_lineage_unique UNIQUE (karya_id, ancestor_id)
);

CREATE INDEX IF NOT EXISTS karya_lineage_karya_idx
  ON __SCHEMA__.karya_lineage (karya_id, depth);
CREATE INDEX IF NOT EXISTS karya_lineage_ancestor_idx
  ON __SCHEMA__.karya_lineage (ancestor_id);

-- Badge "Induk Ide" (>= 5 turunan langsung) / "Kakek Ide" (>= 25 total).
-- Disimpan sebagai flag pada principals; dihitung ulang oleh job/trigger.
CREATE TABLE IF NOT EXISTS __SCHEMA__.karya_badges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principal_id uuid NOT NULL,
  badge       text NOT NULL,
  awarded_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT karya_badges_badge_check CHECK (badge IN ('INDUK_IDE', 'KAKEK_IDE')),
  CONSTRAINT karya_badges_unique UNIQUE (principal_id, badge)
);

CREATE INDEX IF NOT EXISTS karya_badges_principal_idx
  ON __SCHEMA__.karya_badges (principal_id);

-- Hitung ulang badge setiap kali lineage berubah (induk langsung =
-- parent_karya_id yang menunjuk ke karya milik principal ini).
CREATE OR REPLACE FUNCTION __SCHEMA__.refresh_karya_badges()
RETURNS void AS $$
BEGIN
  -- Hapus badge yang tidak lagi valid, lalu isi yang valid.
  DELETE FROM __SCHEMA__.karya_badges
   WHERE principal_id NOT IN (
     SELECT p.principal_id FROM __SCHEMA__.social_posts p
      WHERE p.post_type = 'KARYA'
        AND p.deleted_at IS NULL
        AND EXISTS (SELECT 1 FROM __SCHEMA__.social_posts c
                     WHERE c.parent_karya_id = p.id)
   );

  INSERT INTO __SCHEMA__.karya_badges (principal_id, badge)
  SELECT DISTINCT p.principal_id, 'INDUK_IDE'
    FROM __SCHEMA__.social_posts p
   WHERE p.post_type = 'KARYA'
     AND p.deleted_at IS NULL
     AND (SELECT COUNT(*) FROM __SCHEMA__.social_posts c
           WHERE c.parent_karya_id = p.id) >= 5
  ON CONFLICT (principal_id, badge) DO NOTHING;

  INSERT INTO __SCHEMA__.karya_badges (principal_id, badge)
  SELECT DISTINCT p.principal_id, 'KAKEK_IDE'
    FROM __SCHEMA__.social_posts p
   WHERE p.post_type = 'KARYA'
     AND p.deleted_at IS NULL
     AND (SELECT COUNT(*) FROM __SCHEMA__.karya_lineage l
           WHERE l.ancestor_id = p.id) >= 25
  ON CONFLICT (principal_id, badge) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
