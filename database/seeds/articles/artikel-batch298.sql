-- Batch 298: 1 artikel Lingkungan (Energi Terbarukan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 519)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0156-4000-8000-000000000156', 'EXP-LING-306', 'b8888888-8888-8888-8888-888888888888', 'Energi Terbarukan: Masa Depan Indonesia', 'energi-terbarukan-indonesia', 'Potensi surya, angin, air, & panas bumi di Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-306';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Potensi')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Surya: 3.294 GW$li$,
      $li$Angin: 155 GW$li$,
      $li$Air: 95 GW$li$,
      $li$Panas bumi: 24 GW (terbesar dunia)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tantangan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Biaya awal tinggi$li$,
      $li$Intermiten (butuh penyimpanan)$li$,
      $li$Regulasi$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Target')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$RUEN: 23% EBT 2025, net zero 2060.$txt$));
END $doblk$;
