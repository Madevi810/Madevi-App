-- Batch 149: 1 artikel Bahasa (Menulis Email Formal) — idempoten
-- Dibuat: 2026-10-19 (Siklus Abadi putaran 21)

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('b1b1b1b1-0007-4000-8000-000000000007', 'EXP-BHS-157', 'b8888888-8888-8888-8888-888888888888', 'Cara Menulis Email Formal yang Benar', 'cara-menulis-email-formal', 'Struktur email formal: subjek jelas, salam, isi singkat, penutup sopan — dengan contoh lengkap.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-157';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', 'Struktur Email Formal')),
    (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Subjek: spesifik, mis. "Lamaran Magang — Budi Santoso"$li$,
      $li$Salam pembuka: "Yth. Bapak/Ibu [Nama],"$li$,
      $li$Paragraf 1: perkenalan + maksud$li$,
      $li$Paragraf 2: detail singkat$li$,
      $li$Penutup: "Hormat saya, [Nama lengkap + kontak]"$li$
    ]))),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', 'Contoh Lengkap')),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Subjek: Permohonan Informasi Beasiswa — Sinta Dewi. "Yth. Bapak/Ibu Admin Beasiswa, Perkenalkan, saya Sinta Dewi, mahasiswi semester 3. Saya ingin menanyakan syarat pendaftaran beasiswa prestasi periode 2026. Terlampir saya sertakan transkrip nilai. Atas perhatiannya saya ucapkan terima kasih. Hormat saya, Sinta Dewi — 0812xxxx."$txt$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', 'Kesalahan Umum')),
    (gen_random_uuid(), v_id, 'LIST', 5, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Subjek kosong atau "halo"$li$,
      $li$Bahasa gaul ("gan", "bro")$li$,
      $li$Terlalu panjang — maksimal 3 paragraf$li$,
      $li$Lupa lampiran yang dijanjikan$li$
    ])));
END $doblk$;
