-- Batch 167: 1 artikel Keterampilan (Mengetik 10 Jari) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 82)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0025-4000-8000-000000000025', 'EXP-KET-175', 'b8888888-8888-8888-8888-888888888888', 'Belajar Mengetik 10 Jari untuk Pemula', 'mengetik-10-jari-pemula', 'Posisi jari, latihan bertahap, dan target kecepatan mengetik.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-175';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Posisi Dasar (Home Row)')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jari di ASDF (kiri) dan JKL; (kanan). Ibu jari di spasi. Tonjolan di F dan J sebagai penanda tanpa melihat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tahapan Latihan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Minggu 1: home row saja, 15 menit/hari$li$,
      $li$Minggu 2: tambah baris atas$li$,
      $li$Minggu 3: tambah baris bawah + angka$li$,
      $li$Minggu 4: kalimat lengkap tanpa melihat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Target Realistis')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Pemula: 20 WPM. Terampil: 40 WPM. Profesional: 60+ WPM. Akurasi > kecepatan di awal — jangan buru-buru.$txt$));
END $doblk$;
