-- Batch 234: 1 artikel Agama (Sedekah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 306)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0092-4000-8000-000000000092', 'EXP-AGA-242', 'b8888888-8888-8888-8888-888888888888', 'Sedekah: Kecil di Tangan, Besar di Sisi Allah', 'sedekah-kecil-besar', 'Keutamaan sedekah, jenisnya, dan adab bersedekah.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-242';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Keutamaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Perumpamaan orang yang menginfakkan hartanya seperti sebutir biji yang menumbuhkan tujuh tangkai, tiap tangkai seratus biji" (QS. Al-Baqarah: 261).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Jenis Sedekah')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Harta$li$,
      $li$Ilmu yang bermanfaat$li$,
      $li$Senyum & akhlak baik$li$,
      $li$Menyingkirkan duri dari jalan$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Adab')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ikhlas, sembunyikan$li$,
      $li$Dari harta halal$li$,
      $li$Jangan mengungkit$li$,
      $li$Dahulukan yang terdekat$li$
    ])));
END $doblk$;
