-- Batch 344: 1 artikel Teknologi (5G) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 672)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0202-4000-8000-000000000202', 'EXP-TEK-352', 'b8888888-8888-8888-8888-888888888888', '5G di Indonesia: Status & Manfaat', '5g-di-indonesia-status', 'Cakupan 5G, kecepatannya, & kapan perlu upgrade.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-352';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Status')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$5G hadir sejak 2021 di kota besar. Cakupan masih terbatas dibanding 4G.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kecepatan')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$4G: 20-50 Mbps$li$,
      $li$5G: 100-500 Mbps$li$,
      $li$Latensi 5G jauh lebih rendah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Perlu Upgrade?')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bila di area cakupan & butuh kecepatan tinggi. HP harus support 5G.$txt$));
END $doblk$;
