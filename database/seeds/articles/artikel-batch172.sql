-- Batch 172: 1 artikel Fisika (Tekanan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 99)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0030-4000-8000-000000000030', 'EXP-FIS-180', 'b8888888-8888-8888-8888-888888888888', 'Tekanan: Kenapa Pisau Tajam Mudah Memotong', 'tekanan-pisau-tajam', 'Konsep tekanan P=F/A: sepatu salju, paku payung, dan dongkrak hidrolik.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-180';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rumus Dasar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$P = F/A. Gaya sama, luas kecil → tekanan besar. Itulah kenapa pisau tajam (luas mata kecil) mudah memotong.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Sehari-hari')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sepatu salju: luas besar → tidak tenggelam$li$,
      $li$Paku payung: ujung runcing → mudah menancap$li$,
      $li$Traktor: ban lebar → tidak merusak tanah$li$,
      $li$Dongkrak hidrolik: prinsip Pascal$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Hitungan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Gaya 100 N pada luas 0,01 m² → P = 10.000 Pa. Pada luas 1 m² → hanya 100 Pa. Beda 100x!$txt$));
END $doblk$;
