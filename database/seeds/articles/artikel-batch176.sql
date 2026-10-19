-- Batch 176: 1 artikel Matematika (Persentase) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 112)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0034-4000-8000-000000000034', 'EXP-MTK-184', 'b8888888-8888-8888-8888-888888888888', 'Persentase dalam Kehidupan Sehari-hari', 'persentase-sehari-hari', 'Diskon, pajak, tips, dan bunga — menguasai persen untuk keputusan cerdas.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-MTK-184';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Konsep Dasar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Persen = per seratus. 25% = 25/100 = 1/4. Trik cepat: 10% = geser koma 1 digit. 10% dari 250rb = 25rb.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Nyata')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Diskon 30% dari Rp200rb = Rp60rb, bayar Rp140rb$li$,
      $li$Pajak 11%: harga Rp100rb → total Rp111rb$li$,
      $li$Tips 10% di restoran$li$,
      $li$Bunga tabungan 4%/tahun$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Jebakan Persen')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$"Naik 50% lalu turun 50%" tidak kembali ke awal! Rp100rb naik 50% = Rp150rb, turun 50% = Rp75rb. Selalu hitung dari nilai terkini.$txt$));
END $doblk$;
