-- 0052: tambah kolom ui_preferences (JSONB) pada principals.
-- Temuan audit 2026-10-16: fitur "Zona Tenang" (INOVASI-0841) membaca/menulis
-- principals.ui_preferences (accounts.ts: privateProfile, loadUiPreferences,
-- updateProfile; route /api/v1/profile), tetapi tidak ada migrasi yang membuat
-- kolomnya — setiap pemanggilan melempar "column ui_preferences does not exist"
-- (HTTP 500). Migrasi 0017 hanya membuat ui_theme/ui_language/
-- ui_preferences_updated_at.
BEGIN;
ALTER TABLE __SCHEMA__.principals
  ADD COLUMN IF NOT EXISTS ui_preferences jsonb;
COMMIT;
