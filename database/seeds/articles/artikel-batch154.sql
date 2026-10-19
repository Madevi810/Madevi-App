-- Batch 154: 1 artikel Biologi (Fotosintesis) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 38)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0012-4000-8000-000000000012', 'EXP-BIO-162', 'b8888888-8888-8888-8888-888888888888', 'Fotosintesis: Dapur Makanan Tumbuhan', 'fotosintesis-dapur-tumbuhan', 'Proses tumbuhan membuat makanan dari cahaya: reaksi terang, siklus Calvin, dan faktor yang memengaruhi.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-162';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Persamaan Dasar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$6CO2 + 6H2O + cahaya → C6H12O6 + 6O2. Tumbuhan menangkap energi cahaya lewat klorofil dan menyimpannya sebagai glukosa.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dua Tahap')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Reaksi terang (di tilakoid): cahaya → ATP + NADPH + O2$li$,
      $li$Siklus Calvin (di stroma): CO2 → glukosa pakai ATP/NADPH$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Faktor Pembatas')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Intensitas cahaya$li$,
      $li$Konsentrasi CO2$li$,
      $li$Suhu (enzim rusak bila terlalu panas)$li$,
      $li$Ketersediaan air$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Eksperimen Sederhana')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tutup sebagian daun dengan aluminium foil 3 hari, lalu uji dengan larutan iodin: bagian tertutup tidak membiru (tanpa amilum), bagian terbuka membiru.$txt$));
END $doblk$;
