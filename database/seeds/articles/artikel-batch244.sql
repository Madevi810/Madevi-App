-- Batch 244: 1 artikel Kesehatan (Demam Berdarah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 339)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0102-4000-8000-000000000102', 'EXP-KES-252', 'b8888888-8888-8888-8888-888888888888', 'DBD: Waspada Nyamuk Aedes di Musim Hujan', 'dbd-waspada-aedes', 'Gejala DBD, fase kritis, dan pemberantasan sarang nyamuk 3M Plus.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-252';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Demam tinggi mendadak 2-7 hari$li$,
      $li$Nyeri otot & sendi$li$,
      $li$Bintik merah$li$,
      $li$Mual muntah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Fase Kritis')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Hari 3-7: demam turun TAPI ini fase kritis! Waspada syok: tangan kaki dingin, gelisah. Segera ke RS.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', '3M Plus')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Menguras bak mandi$li$,
      $li$Menutup tempat air$li$,
      $li$Mengubur barang bekas$li$,
      $li$Plus: abate, ikan cupang, kelambu$li$
    ])));
END $doblk$;
