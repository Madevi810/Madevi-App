-- 0041: LINE-PROTECT — perlindungan pengguna Madevi Line (INSTRUKSI-03).
--
-- Menambahkan:
--   1. social_posts.post_type        — KARYA vs CURHAT (visi 2 tipe sosial Ade)
--   2. social_reports.reason_category — kategori laporan (item #2)
--   3. social_posts.is_anonymous     — mode anonim aman untuk curhat (item #5)
--   4. social_comments.is_anonymous  — komentar anonim (opsional, konsistensi)
--
-- Semua kolom nullable/DEFAULT agar migrasi aman pada data yang sudah ada:
-- post_type default 'KARYA' (tipe mayoritas); is_anonymous default false;
-- reason_category null (laporan lama tidak punya kategori — tetap valid).

-- 1. Tipe postingan: KARYA (share ide/karya/inovasi) vs CURHAT (isi hati/masalah).
ALTER TABLE __SCHEMA__.social_posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'KARYA';

ALTER TABLE __SCHEMA__.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_post_type_check;

ALTER TABLE __SCHEMA__.social_posts
  ADD CONSTRAINT social_posts_post_type_check CHECK (post_type IN ('KARYA', 'CURHAT'));

-- 2. Kategori laporan pengguna (pornografi/ancaman/kekerasan/pelecehan/spam/lainnya).
ALTER TABLE __SCHEMA__.social_reports
  ADD COLUMN IF NOT EXISTS reason_category text;

ALTER TABLE __SCHEMA__.social_reports
  DROP CONSTRAINT IF EXISTS social_reports_reason_category_check;

ALTER TABLE __SCHEMA__.social_reports
  ADD CONSTRAINT social_reports_reason_category_check
  CHECK (reason_category IS NULL OR reason_category IN (
    'PORNOGRAFI', 'ANCAMAN', 'KEKERASAN', 'PELECEHAN', 'SARA', 'SPAM', 'LAINNYA'
  ));

-- Index kategori untuk query antrean moderasi per kategori.
CREATE INDEX IF NOT EXISTS social_reports_reason_category_idx
  ON __SCHEMA__.social_reports (reason_category);

-- 3. Mode anonim aman untuk Sosial Curhat (item #5).
--    Identitas asli (principal_id) TETAP tercatat di sisi server untuk
--    moderasi; is_anonymous hanya mengontrol tampilan publik.
ALTER TABLE __SCHEMA__.social_posts
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;

-- Hanya postingan CURHAT yang boleh anonim (KARYA = karya yang dibanggakan,
-- identitas pembuat adalah bagian dari nilai karya).
ALTER TABLE __SCHEMA__.social_posts
  DROP CONSTRAINT IF EXISTS social_posts_anonymous_scope_check;

ALTER TABLE __SCHEMA__.social_posts
  ADD CONSTRAINT social_posts_anonymous_scope_check
  CHECK (is_anonymous = false OR post_type = 'CURHAT');

-- 4. Komentar anonim (opsional; komentar di post anonim boleh ikut anonim).
ALTER TABLE __SCHEMA__.social_comments
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;
