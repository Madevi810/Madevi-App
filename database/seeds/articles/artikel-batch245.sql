-- Batch 245: 1 artikel Teknologi (Metaverse) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 342)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0103-4000-8000-000000000103', 'EXP-TEK-253', 'b8888888-8888-8888-8888-888888888888', 'Metaverse: Hype atau Masa Depan', 'metaverse-hype-masa-depan', 'Apa itu metaverse, perkembangannya, dan penilaian realistisnya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-253';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Konsep')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Dunia virtual 3D tempat orang berinteraksi via avatar. VR + AR + blockchain digadang sebagai fondasinya.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Hype 2021-2022')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Meta investasi $36 miliar. Hasil: sepi pengguna, PHK massal. Pelajaran: teknologi tanpa kebutuhan nyata = gagal.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Yang Bertahan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gaming (Roblox, Fortnite)$li$,
      $li$Training VR industri$li$,
      $li$Meeting virtual$li$,
      $li$Digital twin pabrik$li$
    ])));
END $doblk$;
