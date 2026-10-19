-- Batch 191: 1 artikel Kesehatan (TBC) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 162)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0049-4000-8000-000000000049', 'EXP-KES-199', 'b8888888-8888-8888-8888-888888888888', 'TBC: Gejala, Penularan, dan Pengobatan', 'tbc-gejala-pengobatan', 'Tuberkulosis bisa disembuhkan: kenali gejala, cegah penularan, tuntaskan obat 6 bulan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-199';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Gejala')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batuk >2 minggu$li$,
      $li$Berat turun$li$,
      $li$Keringat malam$li$,
      $li$Demam meriang$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Penularan & Pencegahan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Menular lewat droplet batuk. Cegah: etika batuk, ventilasi, masker bila kontak erat. Tidak menular lewat alat makan.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Pengobatan')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Obat 6 bulan GRATIS di puskesmas. WAJIB tuntas — berhenti di tengah memicu TBC kebal obat. Ada pengawas menelan obat (PMO).$txt$));
END $doblk$;
