-- Batch 170: 1 artikel Lingkungan (Energi Surya) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 92)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0028-4000-8000-000000000028', 'EXP-LING-178', 'b8888888-8888-8888-8888-888888888888', 'Panel Surya Rumahan: Worth It atau Tidak', 'panel-surya-rumahan', 'Cara kerja PLTS atap, hitungan balik modal, dan tips memilih instalatur.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-178';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Cara Kerja')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Panel mengubah cahaya jadi listrik DC, inverter mengubah ke AC. Kelebihan daya bisa dijual ke PLN (net metering).$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Hitungan Kasar')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$1 kWp ~ Rp15-20 juta terpasang, hasilkan ~120 kWh/bulan. Tagihan Rp500rb/bulan → balik modal ~6-8 tahun. Panel garansi 25 tahun.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tips Memilih')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pilih instalatur bersertifikat$li$,
      $li$Cek garansi panel & inverter terpisah$li$,
      $li$Pastikan atap kuat & tidak ternaungi$li$,
      $li$Urus izin ke PLN sebelum pasang$li$
    ])));
END $doblk$;
