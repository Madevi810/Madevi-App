ALTER TABLE __SCHEMA__.principals
  ADD COLUMN ui_theme text CHECK (ui_theme IN ('light', 'dark')),
  ADD COLUMN ui_language text CHECK (ui_language IN ('id', 'en')),
  ADD COLUMN ui_preferences_updated_at timestamptz;
