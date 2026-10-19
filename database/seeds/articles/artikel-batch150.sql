-- Batch 150: 1 artikel Sejarah (Proklamasi) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 24)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0008-4000-8000-000000000008', 'EXP-SEJ-158', 'b8888888-8888-8888-8888-888888888888', 'Detik-detik Proklamasi 17 Agustus 1945', 'detik-detik-proklamasi-1945', 'Kronologi lengkap proklamasi kemerdekaan Indonesia: dari Rengasdengklok hingga pembacaan teks.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-158';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Latar Belakang')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jepang menyerah 14 Agustus 1945. Golongan muda mendesak proklamasi segera, golongan tua ingin melalui PPKI. Perbedaan ini memuncak pada peristiwa Rengasdengklok.$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Kronologi 16-17 Agustus')),
    (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$16 Agu dini hari: Soekarno-Hatta dibawa ke Rengasdengklok$li$,
      $li$16 Agu malam: kembali ke Jakarta, rapat di rumah Maeda$li$,
      $li$17 Agu pukul 03.00: naskah proklamasi selesai dirumuskan$li$,
      $li$17 Agu pukul 10.00: dibacakan di Jl. Pegangsaan Timur 56$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Tokoh Kunci')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Soekarno-Hatta: proklamator$li$,
      $li$Sjahrir & Wikana: penggerak golongan muda$li$,
      $li$Ahmad Soebardjo: perumus kalimat$li$,
      $li$Fatmawati: penjahit Sang Saka$li$
    ]))),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 6, jsonb_build_object('text', $txt$Proklamasi bukan akhir, melainkan awal perjuangan mempertahankan kemerdekaan — dari agresi militer hingga diplomasi.$txt$));
END $doblk$;
