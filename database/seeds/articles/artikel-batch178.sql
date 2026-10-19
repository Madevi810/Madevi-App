-- Batch 178: 1 artikel Kesehatan (Mata) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 119)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0036-4000-8000-000000000036', 'EXP-KES-186', 'b8888888-8888-8888-8888-888888888888', 'Menjaga Kesehatan Mata di Era Layar', 'jaga-kesehatan-mata', 'Aturan 20-20-20, tanda mata lelah, dan kapan harus ke dokter mata.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-186';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Aturan 20-20-20')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tiap 20 menit menatap layar, alihkan pandangan ke objek 20 kaki (~6 m) selama 20 detik. Sederhana tapi efektif mencegah mata lelah.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Tanda Mata Lelah')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mata kering/perih$li$,
      $li$Pandangan buram sementara$li$,
      $li$Sakit kepala$li$,
      $li$Sulit fokus$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kapan ke Dokter')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Penglihatan menurun bertahap$li$,
      $li$Nyeri mata hebat$li$,
      $li$Melihat kilatan cahaya / bintik mengambang banyak$li$,
      $li$Mata merah tidak sembuh 3 hari$li$
    ])));
END $doblk$;
