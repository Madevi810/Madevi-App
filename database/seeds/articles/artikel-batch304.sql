-- Batch 304: 1 artikel Lingkungan (Banjir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 539)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0162-4000-8000-000000000162', 'EXP-LING-312', 'b8888888-8888-8888-8888-888888888888', 'Banjir: Penyebab & Mitigasi', 'banjir-penyebab-mitigasi', 'Kenapa banjir terus berulang dan apa yang bisa dilakukan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-312';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Curah hujan ekstrem$li$,
      $li$Drainase tersumbat$li$,
      $li$Alih fungsi lahan$li$,
      $li$Penurunan muka tanah (Jakarta)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Saat Banjir')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Matikan listrik$li$,
      $li$Amankan dokumen & barang berharga$li$,
      $li$Mengungsi bila >lutut$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Mitigasi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Normalisasi sungai, sumur resapan, ruang terbuka hijau.$txt$));
END $doblk$;
