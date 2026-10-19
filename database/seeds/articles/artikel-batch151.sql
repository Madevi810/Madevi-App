-- Batch 151: 1 artikel Lingkungan (Sampah Plastik) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 28)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0009-4000-8000-000000000009', 'EXP-LING-159', 'b8888888-8888-8888-8888-888888888888', 'Mengurangi Sampah Plastik dari Rumah', 'mengurangi-sampah-plastik-rumah', 'Langkah praktis mengurangi plastik sekali pakai: dari tas belanja sampai memilah sampah.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-159';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Skala Masalah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Indonesia penyumbang sampah plastik laut terbesar kedua dunia. Kantong plastik butuh 400+ tahun terurai. Perubahan dimulai dari rumah tangga.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '5 Langkah Praktis')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bawa tas belanja kain sendiri$li$,
      $li$Pakai botol minum isi ulang$li$,
      $li$Tolak sedotan & sendok plastik sekali pakai$li$,
      $li$Pilah sampah: organik, anorganik, B3$li$,
      $li$Beli isi ulang (refill) untuk sabun & deterjen$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Bank Sampah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kumpulkan botol/kardus bersih, setorkan ke bank sampah terdekat — sampah jadi tabungan. Cari lokasinya lewat kelurahan atau aplikasi.$txt$));
END $doblk$;
