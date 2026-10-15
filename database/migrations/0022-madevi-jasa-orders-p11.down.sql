-- ============================================================
-- 0022 DOWN: Jasa orders — P11
-- ============================================================
-- PERINGATAN (sama seperti 0021): DOWN bersifat destruktif terhadap kolom
-- baru. Jalankan HANYA bila 0022 benar-benar harus dibuang penuh.
-- Forward-fix (ALTER kolom/VIEW) lebih aman daripada down ini.
-- Jangan jalankan tanpa backup (lihat P16).

BEGIN;

DROP VIEW IF EXISTS __SCHEMA__.jasa_order_queue;

ALTER TABLE __SCHEMA__.logo_orders
  DROP COLUMN IF EXISTS schema_version,
  DROP COLUMN IF EXISTS revision_limit,
  DROP COLUMN IF EXISTS token_revoked_at,
  DROP COLUMN IF EXISTS token_expires_at;

ALTER TABLE __SCHEMA__.invitation_orders
  DROP COLUMN IF EXISTS schema_version,
  DROP COLUMN IF EXISTS revision_limit,
  DROP COLUMN IF EXISTS token_revoked_at,
  DROP COLUMN IF EXISTS token_expires_at;

COMMIT;
