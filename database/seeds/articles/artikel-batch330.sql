-- Batch 330: 1 artikel Agama (Shalat Id) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 626)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0188-4000-8000-000000000188', 'EXP-AGA-338', 'b8888888-8888-8888-8888-888888888888', 'Shalat Id: Idul Fitri & Adha', 'shalat-id-fitri-adha', 'Hukum, tata cara, & sunnah shalat Id.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-338';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Hukum')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sunnah muakkad. Dilakukan berjamaah di lapangan/masjid.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tata Cara')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$2 rakaat, takbir 7x (rakaat 1) & 5x (rakaat 2)$li$,
      $li$Khutbah setelah shalat$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Sunnah')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mandi & pakai pakaian terbaik$li$,
      $li$Makan dulu (Fitri) / tunda (Adha)$li$,
      $li$Takbiran$li$,
      $li$Jalan berbeda pergi-pulang$li$
    ])));
END $doblk$;
