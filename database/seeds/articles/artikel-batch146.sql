-- Batch 146: 1 artikel Fisika (Gaya Gesek) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 11)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0004-4000-8000-000000000004', 'EXP-FIS-154', 'b8888888-8888-8888-8888-888888888888', 'Gaya Gesek: Statis vs Kinetis', 'gaya-gesek-statis-kinetis', 'Mengapa benda sulit didorong lalu tiba-tiba meluncur? Memahami gaya gesek statis dan kinetis dengan contoh sehari-hari.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-154';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Dua Jenis Gesekan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Gesek statis menahan benda diam (maksimum μs×N). Sekali bergerak, gesek kinetis (μk×N) lebih kecil — makanya mendorong awal paling berat, lalu terasa ringan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Sehari-hari')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ban mobil mencengkeram aspal: gesek statis$li$,
      $li$Rem cakram: gesek kinetis mengubah gerak jadi panas$li$,
      $li$Es licin: μk sangat kecil$li$,
      $li$Amplas menghaluskan kayu: gesek kinetis$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hitungan Sederhana')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Lemari 50 kg di lantai (μs=0,4): gaya minimum = 0,4 × 50 × 9,8 = 196 N. Setelah bergerak (μk=0,3): cukup 147 N untuk menjaga gerak.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', 'Coba Sendiri')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Dorong buku di meja dengan jari: rasakan "sentakan" saat mulai bergerak. Itulah peralihan statis → kinetis.$txt$));
END $doblk$;
