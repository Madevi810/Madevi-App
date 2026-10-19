-- Batch 162: 1 artikel Biologi (Sistem Pencernaan) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 66)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0020-4000-8000-000000000020', 'EXP-BIO-170', 'b8888888-8888-8888-8888-888888888888', 'Perjalanan Makanan di Sistem Pencernaan', 'sistem-pencernaan-manusia', 'Dari mulut hingga usus besar: organ, enzim, dan cara menjaga pencernaan sehat.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-170';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Urutan Organ')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulut: kunyah + amilase$li$,
      $li$Kerongkongan: gerak peristaltik$li$,
      $li$Lambung: asam + pepsin (protein)$li$,
      $li$Usus halus: penyerapan sari makanan$li$,
      $li$Usus besar: penyerapan air$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Enzim Penting')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Amilase (karbohidrat), pepsin & tripsin (protein), lipase (lemak). Empedu dari hati membantu emulsifikasi lemak.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Menjaga Pencernaan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Serat cukup: sayur, buah, biji-bijian$li$,
      $li$Minum air 2 liter/hari$li$,
      $li$Kunyah perlahan$li$,
      $li$Batasi gorengan & pedas berlebih$li$
    ])));
END $doblk$;
