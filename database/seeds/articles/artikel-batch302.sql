-- Batch 302: 1 artikel Teknologi (5G) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 532)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0160-4000-8000-000000000160', 'EXP-TEK-310', 'b8888888-8888-8888-8888-888888888888', '5G: Lebih dari Sekadar Cepat', '5g-lebih-dari-sekadar-cepat', 'Kecepatan, latensi rendah, dan use case 5G.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-310';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Tiga Pilar')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$eMBB: kecepatan hingga 10 Gbps$li$,
      $li$URLLC: latensi <1 ms$li$,
      $li$mMTC: 1 juta perangkat/km²$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Use Case')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Operasi jarak jauh$li$,
      $li$Mobil otonom$li$,
      $li$Smart factory$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Di Indonesia')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Telkomsel & Indosat gelar bertahap sejak 2021. Fokus kota besar dulu.$txt$));
END $doblk$;
