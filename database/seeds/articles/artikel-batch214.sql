-- Batch 214: 1 artikel Agama (Akhlak) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 239)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0072-4000-8000-000000000072', 'EXP-AGA-222', 'b8888888-8888-8888-8888-888888888888', 'Akhlak Mulia: Buah Keimanan Sejati', 'akhlak-mulia-keimanan', 'Akhlak dalam Islam: jujur, amanah, dan adab sehari-hari.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-222';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Akhlak = Timbangan Terberat')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Tidak ada sesuatu yang lebih berat dalam timbangan (amal) seorang mukmin pada hari kiamat selain akhlak yang baik" (HR. Tirmidzi).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Akhlak Sehari-hari')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jujur dalam ucapan & janji$li$,
      $li$Amanah menjaga titipan$li$,
      $li$Sopan pada orang tua & guru$li$,
      $li$Ramah pada tetangga$li$,
      $li$Menepati janji$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Melatih Akhlak')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bergaul dengan orang saleh$li$,
      $li$Muhasabah tiap malam$li$,
      $li$Baca sirah Nabi$li$
    ])));
END $doblk$;
