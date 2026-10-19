-- Batch 220: 1 artikel Kesehatan (Stroke) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 259)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0078-4000-8000-000000000078', 'EXP-KES-228', 'b8888888-8888-8888-8888-888888888888', 'Stroke: Kenali FAST, Selamatkan Nyawa', 'stroke-kenali-fast', 'Gejala stroke dengan metode FAST dan golden period penanganannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-228';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Metode FAST')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$F: Face — wajah mencong sebelah$li$,
      $li$A: Arms — lengan tak bisa diangkat$li$,
      $li$S: Speech — bicara pelo$li$,
      $li$T: Time — segera ke RS!$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Golden Period')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$4,5 jam pertama = jendela terapi. Tiap menit 1,9 juta sel otak mati. Jangan tunggu "nanti".$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pencegahan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kontrol tekanan darah$li$,
      $li$Stop merokok & alkohol$li$,
      $li$Olahraga rutin$li$,
      $li$Batasi garam & lemak$li$
    ])));
END $doblk$;
