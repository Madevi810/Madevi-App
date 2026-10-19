-- Batch 184: 1 artikel Agama (Akhlak) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 139)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0042-4000-8000-000000000042', 'EXP-AGA-192', 'b8888888-8888-8888-8888-888888888888', 'Akhlak Mulia: Fondasi Kepribadian Muslim', 'akhlak-mulia-muslim', 'Pengertian akhlak, contoh akhlak Rasulullah, dan cara melatihnya sehari-hari.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-192';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Pengertian Akhlak')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Akhlak = budi pekerti yang melekat. Rasulullah diutus untuk menyempurnakan akhlak (HR. Ahmad). Timbangan terberat di hari kiamat adalah akhlak mulia (HR. Tirmidzi).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Akhlak Mulia')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jujur (shiddiq)$li$,
      $li$Amanah$li$,
      $li$Sabar$li$,
      $li$Pemaaf$li$,
      $li$Rendah hati$li$,
      $li$Dermawan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Melatih Sehari-hari')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Biasakan salam & senyum$li$,
      $li$Tahan amarah: diam/wudhu$li$,
      $li$Tepati janji sekecil apapun$li$,
      $li$Berkumpul dengan orang shalih$li$
    ])));
END $doblk$;
