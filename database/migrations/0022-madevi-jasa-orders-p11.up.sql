-- ============================================================
-- 0021 → 0022: Jasa orders — P11 (additive only)
-- ============================================================
-- Perubahan hanya MENAMBAH kolom; tidak mengubah/menghapus yang ada (04).
-- Tujuan: menutup celah P11 yang ditemukan saat audit:
--   1. Token privat tidak punya expiry/revoke  → token_expires_at / token_revoked_at
--   2. Tidak ada batas revisi                  → revision_limit
--   3. Tidak ada schema version per jenis jasa → schema_version
--   4. Antrean Admin belum bisa filter urgensi → view jasa_order_queue
--
-- Down migration tidak disarankan dijalankan (lihat 0021.down.sql):
-- forward-fix lebih aman daripada destructive down.

BEGIN;

-- 1. Token expiry & revoke (P11: "expiry/revoke, dan tidak diindeks")
ALTER TABLE __SCHEMA__.invitation_orders
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS token_revoked_at TIMESTAMPTZ NULL;

ALTER TABLE __SCHEMA__.logo_orders
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS token_revoked_at TIMESTAMPTZ NULL;

-- 2. Batas revisi per order (P11: "batas revisi")
--    NULL = belum disepakati (default 2 revisi saat APPROVED).
ALTER TABLE __SCHEMA__.invitation_orders
  ADD COLUMN IF NOT EXISTS revision_limit INTEGER NULL
  CHECK (revision_limit IS NULL OR revision_limit BETWEEN 0 AND 10);

ALTER TABLE __SCHEMA__.logo_orders
  ADD COLUMN IF NOT EXISTS revision_limit INTEGER NULL
  CHECK (revision_limit IS NULL OR revision_limit BETWEEN 0 AND 10);

-- 3. Schema version per jenis jasa (P11 logika ekstra: "tambah schema
--    version, bukan field acak tanpa jejak"). Versi brief berubah saat
--    field tambahan diperlukan; migrasi data eksplisit, bukan field acak.
ALTER TABLE __SCHEMA__.invitation_orders
  ADD COLUMN IF NOT EXISTS schema_version INTEGER NOT NULL DEFAULT 1
  CHECK (schema_version >= 1);

ALTER TABLE __SCHEMA__.logo_orders
  ADD COLUMN IF NOT EXISTS schema_version INTEGER NOT NULL DEFAULT 1
  CHECK (schema_version >= 1);

-- 4. Antrean Admin terpadu: urgensi + "menunggu siapa" (P11).
--    urgensi dihitung dari status + waktu tunggu:
--      - IN_REVISION lama > 3 hari = HIGH ( Admin harus bertindak )
--      - PENDING_APPROVAL > 1 hari = MEDIUM
--      - lainnya = NORMAL
--    waiting_on: siapa yang diharapkan bertindak (ADMIN / USER).
CREATE OR REPLACE VIEW __SCHEMA__.jasa_order_queue AS
SELECT
  o.id,
  'UNDANGAN'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION'
      AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL'
      AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  o.public_slug
FROM __SCHEMA__.invitation_orders o
UNION ALL
SELECT
  o.id,
  'LOGO'::TEXT AS kind,
  o.status,
  o.revision_count,
  o.revision_limit,
  o.schema_version,
  o.price_agreed,
  o.created_at,
  o.updated_at,
  o.completed_at,
  CASE
    WHEN o.status = 'IN_REVISION'
      AND o.updated_at < CURRENT_TIMESTAMP - INTERVAL '3 days' THEN 'HIGH'
    WHEN o.status = 'PENDING_APPROVAL'
      AND o.created_at < CURRENT_TIMESTAMP - INTERVAL '1 days' THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS urgency,
  CASE
    WHEN o.status IN ('PENDING_APPROVAL', 'APPROVED') THEN 'ADMIN'
    WHEN o.status = 'IN_REVISION' THEN 'USER'
    ELSE 'NONE'
  END AS waiting_on,
  NULL::TEXT AS public_slug
FROM __SCHEMA__.logo_orders o;

COMMENT ON VIEW __SCHEMA__.jasa_order_queue IS
  'P11: antrean Admin terpadu dengan filter urgensi (HIGH/MEDIUM/NORMAL) dan waiting_on (ADMIN/USER/NONE).';

COMMIT;
