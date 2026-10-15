-- ============================================================
-- 0035: Konsistensi tanggal terbit pada ARSIP/SAMPAH — D05
-- ============================================================
-- CHECK lama `(status='PUBLISHED')=(published_at IS NOT NULL)` membuat
-- pengarsipan artikel terbit SELALU gagal: transisi sah PUBLISHED→ARCHIVED
-- mempertahankan published_at (benar secara produk) tetapi melanggar CHECK.
-- Perbaikan: status pra-terbit tidak boleh membawa tanggal terbit;
-- PUBLISHED wajib; ARCHIVED/TRASH boleh mempertahankannya.

BEGIN;

ALTER TABLE __SCHEMA__.articles DROP CONSTRAINT IF EXISTS articles_check;
ALTER TABLE __SCHEMA__.articles
  ADD CONSTRAINT articles_published_at_check
    CHECK (
      (status = 'PUBLISHED') = (published_at IS NOT NULL)
      OR status IN ('ARCHIVED', 'TRASH')
    );

COMMIT;
