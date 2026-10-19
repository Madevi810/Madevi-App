-- Batch 169: 1 artikel Bahasa (Tanda Baca) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 89)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0027-4000-8000-000000000027', 'EXP-BHS-177', 'b8888888-8888-8888-8888-888888888888', 'Tanda Baca yang Sering Salah Pakai', 'tanda-baca-sering-salah', 'Koma, titik dua, tanda seru, dan tanda tanya — aturan pakai yang benar dengan contoh.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-177';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Koma (,)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pemisah unsur setara: "Saya membeli apel, jeruk, dan mangga." Setelah kata seru: "Wah, bagus sekali!" Jangan pakai koma sebelum "dan" terakhir kecuali perlu kejelasan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Titik Dua (:)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sebelum perincian atau kutipan: "Ada tiga warna: merah, kuning, hijau." Tidak dipakai setelah kata "adalah".$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tanda Seru (!) dan Tanya (?)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Seru untuk perintah/seruan kuat — jangan dobel (!!) di tulisan formal. Tanya hanya untuk kalimat tanya langsung, bukan kalimat berita.$txt$));
END $doblk$;
