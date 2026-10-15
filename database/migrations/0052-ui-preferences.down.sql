-- 0052 down: hapus kolom ui_preferences dari principals.
BEGIN;
ALTER TABLE __SCHEMA__.principals
  DROP COLUMN IF EXISTS ui_preferences;
COMMIT;
