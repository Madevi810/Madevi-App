ALTER TABLE __SCHEMA__.principals
  DROP CONSTRAINT IF EXISTS principals_ui_theme_check;

ALTER TABLE __SCHEMA__.principals
  ADD CONSTRAINT principals_ui_theme_check
  CHECK (ui_theme IN ('light', 'dark', 'madevi-on'));
