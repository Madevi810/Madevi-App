-- Batch 352: 1 artikel Lingkungan (Energi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 699)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0210-4000-8000-000000000210', 'EXP-LING-360', 'b8888888-8888-8888-8888-888888888888', 'PLTS Atap: Listrik dari Matahari', 'plts-atap-listrik-matahari', 'Cara kerja, biaya, & balik modal PLTS atap rumah.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-360';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Panel → inverter → listrik AC. Kelebihan diekspor ke PLN (net metering).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Biaya')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$±Rp15 juta/kWp. Rumah 1300VA butuh ~2 kWp = Rp30 juta.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Balik Modal')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$5-7 tahun. Panel awet 25 tahun.$txt$));
END $doblk$;
