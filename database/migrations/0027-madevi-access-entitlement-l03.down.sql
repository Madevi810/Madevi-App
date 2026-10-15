-- ============================================================================
-- Migrasi 0027 Rollback — L03: Akses, Pembayaran, Trial, dan Lock
-- ============================================================================

BEGIN;

DROP INDEX IF EXISTS __SCHEMA__.tools_trial_reservations_principal_key_idx;

ALTER TABLE __SCHEMA__.payment_codes
  DROP COLUMN IF EXISTS target_entitlement;

ALTER TABLE __SCHEMA__.payment_orders
  DROP COLUMN IF EXISTS package_kind;

COMMIT;
