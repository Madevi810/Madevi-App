-- Batch 294: 1 artikel Agama (Zikir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 506)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0152-4000-8000-000000000152', 'EXP-AGA-302', 'b8888888-8888-8888-8888-888888888888', 'Zikir: Ketenangan Hati', 'zikir-ketenangan-hati', 'Macam zikir harian, keutamaan, dan cara istiqamah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-302';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Zikir Harian')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pagi & petang (al-Matsurat)$li$,
      $li$Setelah shalat: tasbih 33x$li$,
      $li$Istighfar 100x$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$"Hanya dengan mengingat Allah hati menjadi tenang" (QS Ar-Rad: 28).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Istiqamah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulai sedikit tapi rutin$li$,
      $li$Pasang pengingat$li$,
      $li$Zikir saat antre/jalan$li$
    ])));
END $doblk$;
