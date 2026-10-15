-- 0033: Lengkapi kategori brief jasa custom dan pertahankan quote eksplisit.
-- Aditif: kategori baru mencerminkan katalog Custom Design Service. Harga/quote
-- sendiri tersimpan pada price_snapshot JSON agar migration tidak mengubah order lama.

BEGIN;

ALTER TABLE __SCHEMA__.custom_briefs
  DROP CONSTRAINT IF EXISTS custom_briefs_category_check;

ALTER TABLE __SCHEMA__.custom_briefs
  ADD CONSTRAINT custom_briefs_category_check
  CHECK (
    category IN (
      'UNDANGAN_CUSTOM',
      'LOGO_CUSTOM',
      'CV_PORTFOLIO',
      'CERTIFICATE',
      'PHOTO_EDIT',
      'LAYOUT_CUSTOM',
      'LAINNYA'
    )
  );

COMMIT;
