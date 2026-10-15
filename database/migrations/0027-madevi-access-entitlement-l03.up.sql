-- ============================================================================
-- Migrasi 0027 — L03: Akses, Pembayaran, Trial, dan Lock (M-WEB-FOUNDATION)
-- Menambahkan kolom package_kind ke payment_orders, target_entitlement ke payment_codes,
-- serta mempertegas konfigurasi harga paket Madevi dan indeks performa.
-- ============================================================================

BEGIN;

-- 1. Tambah kolom package_kind ke payment_orders untuk mencatat paket yang dibeli
ALTER TABLE __SCHEMA__.payment_orders
  ADD COLUMN IF NOT EXISTS package_kind text
    CHECK (package_kind IS NULL OR package_kind IN ('PLUS', 'PRO', 'UPGRADE'));

-- 2. Tambah target_entitlement pada payment_codes
ALTER TABLE __SCHEMA__.payment_codes
  ADD COLUMN IF NOT EXISTS target_entitlement text
    CHECK (target_entitlement IS NULL OR target_entitlement IN ('PLUS', 'PRO', 'LOVE'));

-- 3. Pastikan konfigurasi harga paket tersedia di payment_settings
INSERT INTO __SCHEMA__.payment_settings (key, amount, active) VALUES
  ('PLUS_PRICE', 25000, true),
  ('PRO_PRICE', 75000, true),
  ('UPGRADE_PLUS_TO_PRO', 50000, true)
ON CONFLICT (key) DO UPDATE
  SET amount = EXCLUDED.amount, active = true
  WHERE payment_settings.amount IS NULL;

-- 4. Indeks komposit untuk lookup idempotensi reservasi trial
CREATE INDEX IF NOT EXISTS tools_trial_reservations_principal_key_idx
  ON __SCHEMA__.tools_trial_reservations (principal_id, idempotency_key);

COMMIT;
