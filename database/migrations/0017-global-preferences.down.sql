ALTER TABLE __SCHEMA__.principals
  DROP COLUMN IF EXISTS ui_preferences_updated_at,
  DROP COLUMN IF EXISTS ui_language,
  DROP COLUMN IF EXISTS ui_theme;
