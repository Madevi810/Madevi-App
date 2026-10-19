-- Batch 253: 1 artikel Lingkungan (Sampah Elektronik) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 369)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0111-4000-8000-000000000111', 'EXP-LING-261', 'b8888888-8888-8888-8888-888888888888', 'Sampah Elektronik: Racun di Balik Gadget', 'sampah-elektronik-racun', 'Bahaya e-waste dan cara membuang elektronik dengan benar.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-261';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Bahaya')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Timbal, merkuri, kadmium mencemari tanah & air$li$,
      $li$Baterai bisa meledak/terbakar$li$,
      $li$Indonesia: 2 juta ton/tahun$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Buang dengan Benar')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jangan buang ke tempat sampah biasa$li$,
      $li$Dropbox e-waste (mall, toko elektronik)$li$,
      $li$Program trade-in produsen$li$,
      $li$Bank sampah elektronik$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kurangi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Perbaiki dulu sebelum beli baru. Gadget awet = sampah berkurang.$txt$));
END $doblk$;
