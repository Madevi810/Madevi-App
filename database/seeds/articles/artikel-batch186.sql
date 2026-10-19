-- Batch 186: 1 artikel Biologi (Ekosistem) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 146)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0044-4000-8000-000000000044', 'EXP-BIO-194', 'b8888888-8888-8888-8888-888888888888', 'Ekosistem: Jaring Kehidupan yang Saling Terkait', 'ekosistem-jaring-kehidupan', 'Rantai makanan, jaring makanan, dan piramida ekologi dengan contoh Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-194';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Komponen Ekosistem')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Produsen: tumbuhan (fotosintesis)$li$,
      $li$Konsumen: herbivora, karnivora, omnivora$li$,
      $li$Pengurai: bakteri & jamur$li$,
      $li$Faktor abiotik: air, cahaya, tanah, suhu$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Rantai Makanan Sawah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Padi → belalang → katak → ular → elang. Hilangnya satu tingkat mengguncang semua: ledakan hama bila predator dibasmi.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Menjaga Keseimbangan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jangan buang sampah ke sungai$li$,
      $li$Kurangi pestisida berlebih$li$,
      $li$Tanam pohon$li$,
      $li$Dukung kawasan konservasi$li$
    ])));
END $doblk$;
