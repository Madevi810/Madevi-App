-- Batch 219: 1 artikel Agama (Tafsir) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 256)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0077-4000-8000-000000000077', 'EXP-AGA-227', 'b8888888-8888-8888-8888-888888888888', 'Memahami Al-Quran: Ilmu Tafsir untuk Pemula', 'ilmu-tafsir-pemula', 'Apa itu tafsir, jenisnya, dan cara membaca tafsir dengan benar.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-227';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Apa Itu Tafsir')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tafsir = penjelasan makna Al-Quran. Tanpa tafsir, kita rawan salah paham ayat.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Jenis Tafsir')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tafsir bil ma'tsur: dari Nabi/sahabat$li$,
      $li$Tafsir bir ra'yi: dengan ijtihad$li$,
      $li$Tafsir tematik (maudhui)$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Untuk Pemula')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulai dari Tafsir Jalalain / Ibnu Katsir ringkas$li$,
      $li$Baca asbabun nuzul$li$,
      $li$Tanya ustadz bila ragu$li$,
      $li$Jangan tafsir sendiri ayat hukum$li$
    ])));
END $doblk$;
