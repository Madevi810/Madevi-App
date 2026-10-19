-- Batch 165: 1 artikel Agama (Shalat Jenazah) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 76)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0023-4000-8000-000000000023', 'EXP-AGA-173', 'b8888888-8888-8888-8888-888888888888', 'Tata Cara Shalat Jenazah', 'tata-cara-shalat-jenazah', 'Panduan shalat jenazah: 4 takbir, bacaan tiap takbir, dan adab mengiringi.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-173';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Hukum dan Syarat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Shalat jenazah hukumnya fardhu kifayah. Syarat: jenazah muslim, sudah dimandikan & dikafani, menghadap kiblat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', '4 Takbir dan Bacaannya')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Takbir 1: Al-Fatihah$li$,
      $li$Takbir 2: Shalawat$li$,
      $li$Takbir 3: Doa untuk jenazah$li$,
      $li$Takbir 4: Doa, lalu salam$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Adab')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Berwudhu sebelum shalat$li$,
      $li$Berdiri menghadap jenazah$li$,
      $li$Tidak ruku dan sujud$li$,
      $li$Mendoakan dengan khusyuk$li$
    ])));
END $doblk$;
