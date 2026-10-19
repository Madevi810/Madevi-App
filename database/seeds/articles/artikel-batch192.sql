-- Batch 192: 1 artikel Agama (Doa Harian) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 166)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0050-4000-8000-000000000050', 'EXP-AGA-200', 'b8888888-8888-8888-8888-888888888888', 'Kumpulan Doa Harian dan Artinya', 'doa-harian-artinya', 'Doa bangun tidur, makan, masuk-keluar rumah, dan bepergian beserta artinya.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-200';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Doa Bangun Tidur')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$"Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur" — Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Doa Makan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$"Allahumma barik lana fima razaqtana wa qina 'adzaban nar" — Ya Allah berkahilah rezeki kami dan jauhkan dari siksa neraka.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Doa Keluar Rumah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$"Bismillahi tawakkaltu 'alallah la haula wa la quwwata illa billah" — Dengan nama Allah aku bertawakal, tiada daya kecuali dengan Allah.$txt$));
END $doblk$;
