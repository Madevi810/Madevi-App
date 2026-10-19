-- Batch 385: 1 artikel Lingkungan (Banjir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 809)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0243-4000-8000-000000000243', 'EXP-LING-393', 'b8888888-8888-8888-8888-888888888888', 'Banjir: Mitigasi & Siaga', 'banjir-mitigasi-siaga', 'Penyebab banjir kota & cara siaga menghadapinya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-393';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Drainase tersumbat sampah$li$,
      $li$Alih fungsi lahan$li$,
      $li$Rob & curah hujan ekstrem$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Siaga')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tas siaga: dokumen, obat, senter$li$,
      $li$Matikan listrik saat banjir$li$,
      $li$Evakuasi ke tempat tinggi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Setelah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bersihkan lumpur, waspada leptospirosis & DBD.$txt$));
END $doblk$;
