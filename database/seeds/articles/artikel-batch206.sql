-- Batch 206: 1 artikel Sejarah (Kemerdekaan 2) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 212)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0064-4000-8000-000000000064', 'EXP-SEJ-214', 'b8888888-8888-8888-8888-888888888888', 'Proklamasi 1945: Detik-detik Menuju Merdeka', 'proklamasi-1945-detik', 'Rengasdengklok, naskah proklamasi, dan pembacaan teks di Pegangsaan Timur 56.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-214';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Rengasdengklok')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$16 Agustus 1945: pemuda menculik Soekarno-Hatta ke Rengasdengklok, mendesak proklamasi segera — tidak menunggu PPKI.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penyusunan Naskah')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Malam 17 Agustus di rumah Laksamana Maeda: Soekarno menulis draf, Hatta-BM Diah-Sayuti Melik merumuskan. Diketik Sayuti Melik.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pembacaan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$10.00 WIB, Jl. Pegangsaan Timur 56 Jakarta: "Kami bangsa Indonesia dengan ini menjatakan kemerdekaan Indonesia." Bendera dijahit Fatmawati.$txt$));
END $doblk$;
