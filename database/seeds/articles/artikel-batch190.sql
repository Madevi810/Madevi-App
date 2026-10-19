-- Batch 190: 1 artikel Matematika (Bangun Ruang) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 159)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0048-4000-8000-000000000048', 'EXP-MTK-198', 'b8888888-8888-8888-8888-888888888888', 'Volume Bangun Ruang: Rumus Cepat', 'volume-bangun-ruang', 'Kubus, balok, tabung, kerucut, bola — rumus volume dan contoh hitung.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-198';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rumus Volume')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kubus: s³$li$,
      $li$Balok: p×l×t$li$,
      $li$Tabung: πr²t$li$,
      $li$Kerucut: 1/3πr²t$li$,
      $li$Bola: 4/3πr³$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Hitung')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tangki tabung r=1m, t=2m: V = 3,14 × 1 × 2 = 6,28 m³ = 6.280 liter.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips Hafal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Ingat pola: prisma = luas alas × tinggi. Kerucut & limas = 1/3 nya. Bola hafalkan khusus.$txt$));
END $doblk$;
