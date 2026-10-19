-- Batch 274: 1 artikel Lingkungan (Karhutla) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 439)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0132-4000-8000-000000000132', 'EXP-LING-282', 'b8888888-8888-8888-8888-888888888888', 'Karhutla: Asap yang Melumpuhkan', 'karhutla-asap-melumpuhkan', 'Penyebab kebakaran hutan & lahan dan dampak kabut asapnya.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-282';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Penyebab')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pembakaran lahan$li$,
      $li$Gambut kering (sulit padam)$li$,
      $li$El Nino$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Dampak')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$ISPA massal$li$,
      $li$Sekolah & penerbangan lumpuh$li$,
      $li$Asap lintas negara$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pencegahan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sekat kanal gambut$li$,
      $li$Patroli & water bombing$li$,
      $li$Penegakan hukum pembakar$li$
    ])));
END $doblk$;
