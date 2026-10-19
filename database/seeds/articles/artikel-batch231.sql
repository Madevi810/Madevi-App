-- Batch 231: 1 artikel Agama (Nikah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 296)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0089-4000-8000-000000000089', 'EXP-AGA-239', 'b8888888-8888-8888-8888-888888888888', 'Pernikahan dalam Islam: Rukun dan Tujuannya', 'pernikahan-islam-rukun', 'Rukun nikah, mahar, dan tujuan membangun keluarga sakinah.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-239';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rukun Nikah')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Calon suami & istri$li$,
      $li$Wali$li$,
      $li$Dua orang saksi$li$,
      $li$Shighat (ijab qabul)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Mahar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Mahar = hak istri, wajib disebutkan. Jumlahnya disepakati — tidak memberatkan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sakinah Mawaddah Rahmah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sakinah: ketenangan$li$,
      $li$Mawaddah: cinta$li$,
      $li$Rahmah: kasih sayang$li$,
      $li$Kunci: komunikasi & saling memaafkan$li$
    ])));
END $doblk$;
