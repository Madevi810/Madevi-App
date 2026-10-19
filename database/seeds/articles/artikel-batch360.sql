-- Batch 360: 1 artikel Agama (Kurban) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 726)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0218-4000-8000-000000000218', 'EXP-AGA-368', 'b8888888-8888-8888-8888-888888888888', 'Kurban: Hukum & Pembagian Daging', 'kurban-hukum-pembagian', 'Hukum kurban, hewan yang sah, & cara membagi daging.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-368';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Hukum & Waktu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sunnah muakkad. 10-13 Dzulhijjah (hari tasyrik).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Hewan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kambing/domba: 1 orang$li$,
      $li$Sapi/kerbau/unta: 7 orang$li$,
      $li$Cukup umur & sehat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pembagian')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sepertiga untuk keluarga, sepertiga kerabat, sepertiga fakir miskin.$txt$));
END $doblk$;
