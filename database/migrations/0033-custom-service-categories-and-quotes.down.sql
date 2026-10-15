-- Rollback 0033 aman: jangan buang brief kategori baru demi memaksa constraint lama.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM __SCHEMA__.custom_briefs
     WHERE category IN ('CERTIFICATE', 'PHOTO_EDIT')
  ) THEN
    RAISE EXCEPTION
      'Rollback 0033 diblokir: masih ada brief CERTIFICATE atau PHOTO_EDIT.';
  END IF;
END
$$;

ALTER TABLE __SCHEMA__.custom_briefs
  DROP CONSTRAINT IF EXISTS custom_briefs_category_check;

ALTER TABLE __SCHEMA__.custom_briefs
  ADD CONSTRAINT custom_briefs_category_check
  CHECK (category IN ('UNDANGAN_CUSTOM', 'LOGO_CUSTOM', 'CV_PORTFOLIO', 'LAYOUT_CUSTOM', 'LAINNYA'));

COMMIT;
