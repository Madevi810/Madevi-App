-- Batch 226: 1 artikel Kesehatan (TBC 2) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 279)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0084-4000-8000-000000000084', 'EXP-KES-234', 'b8888888-8888-8888-8888-888888888888', 'TBC Bisa Sembuh: Jangan Putus Obat', 'tbc-bisa-sembuh', 'Tuberkulosis: gejala, pengobatan 6 bulan, dan kenapa tidak boleh putus obat.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-234';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batuk >2 minggu$li$,
      $li$Berat badan turun$li$,
      $li$Keringat malam$li$,
      $li$Batuk darah$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Pengobatan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$6 bulan obat, GRATIS di puskesmas. Jangan putus: bisa jadi TBC kebal obat (MDR) yang pengobatannya 2 tahun!$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Mencegah Penularan')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tutup mulut saat batuk$li$,
      $li$Ventilasi rumah baik$li$,
      $li$2 minggu obat = tidak menular$li$,
      $li$Jangan stigma pasien TBC$li$
    ])));
END $doblk$;
