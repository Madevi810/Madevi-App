-- Batch 153: 1 artikel Keterampilan (Public Speaking) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 34)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0011-4000-8000-000000000011', 'EXP-KET-161', 'b8888888-8888-8888-8888-888888888888', 'Public Speaking untuk Pemula yang Pemalu', 'public-speaking-pemula-pemalu', 'Teknik mengatasi demam panggung: persiapan, latihan, dan struktur presentasi 3 bagian.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KET-161';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Kenapa Gugup Itu Normal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jantung berdebar dan tangan dingin adalah respons fight-or-flight. 75% orang mengalaminya. Kabar baik: bisa dilatih.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Struktur 3 Bagian')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pembuka: hook — pertanyaan, data mengejutkan, atau cerita singkat$li$,
      $li$Isi: maksimal 3 poin utama, tiap poin 1 contoh$li$,
      $li$Penutup: rangkuman + ajakan bertindak$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Latihan Praktis')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rekam diri dengan HP, tonton ulang$li$,
      $li$Latihan di depan cermin 3x$li$,
      $li$Presentasi ke 1-2 teman dulu$li$,
      $li$Teknik napas 4-7-8 sebelum naik panggung$li$
    ])));
END $doblk$;
