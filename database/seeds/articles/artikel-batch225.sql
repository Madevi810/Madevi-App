-- Batch 225: 1 artikel Agama (Menuntut Ilmu) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 276)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0083-4000-8000-000000000083', 'EXP-AGA-233', 'b8888888-8888-8888-8888-888888888888', 'Menuntut Ilmu: Kewajiban Setiap Muslim', 'menuntut-ilmu-kewajiban', 'Keutamaan ilmu dalam Islam dan adab penuntut ilmu.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-233';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Keutamaan Ilmu')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Menuntut ilmu itu wajib atas setiap muslim" (HR. Ibnu Majah). "Allah akan meninggikan orang-orang yang beriman dan berilmu beberapa derajat" (QS. Al-Mujadilah: 11).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Adab Penuntut Ilmu')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ikhlas karena Allah$li$,
      $li$Hormati guru$li$,
      $li$Sabar & tekun$li$,
      $li$Amalkan ilmu$li$,
      $li$Jangan sombong$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Ilmu Duniawi')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Sains, teknologi, kedokteran = fardhu kifayah. Umat butuh dokter, insinyur, dan ilmuwan muslim.$txt$));
END $doblk$;
