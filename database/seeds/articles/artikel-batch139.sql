-- Batch 139: 9 artikel Bahasa tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-BHS-139: Imbuhan: Awalan, Akhiran, Sisipan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0001-4000-8000-000000000001', 'EXP-BHS-139', 'b8888888-8888-8888-8888-888888888888', 'Imbuhan: Awalan, Akhiran, Sisipan', 'imbuhan-awalan-akhiran', 'Bentuk kata berimbuhan: me-, di-, ber-, ter-, ke-an, pe-an — dengan aturan luluh dan contoh.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-139';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$me-: aktif (memasak, melihat). Luluh: me- + sapu = menyapu; me- + pukul = memukul$li$,
      $li$di-: pasif (dimasak, dilihat)$li$,
      $li$ber-: memiliki/melakukan (berlari, berumah)$li$,
      $li$ter-: paling/tidak sengaja (terbaik, terjatuh)$li$,
      $li$ke-an: keadaan (kebersihan); pe-an: proses/hasil (pembangunan)$li$,
      $li$Sisipan -el-, -em-, -er-: telunjuk, gemetar, serabut (jarang produktif)$li$
  ])));
END $doblk$;

-- EXP-BHS-140: Kata Ganti dan Kata Sapa yang Tepat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0002-4000-8000-000000000002', 'EXP-BHS-140', 'b8888888-8888-8888-8888-888888888888', 'Kata Ganti dan Kata Sapa yang Tepat', 'kata-ganti-sapa-tepat', 'Saya, aku, gue, kamu, Anda, beliau — kapan memakai yang mana agar sopan dan tepat.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$saya: formal/netral — aman untuk semua situasi resmi$li$,
      $li$aku/kamu: akrab — dengan teman sebaya$li$,
      $li$gue/lo: sangat kasual — hanya dengan yang sudah dekat$li$,
      $li$Anda: hormat — untuk orang lebih tua/atasan/pelanggan$li$,
      $li$beliau: untuk orang yang dihormati (orang ketiga)$li$,
      $li$Hindari "kau" ke orang tua (terkesan kasar di banyak daerah)$li$
  ])));
END $doblk$;

-- EXP-BHS-141: Tenses Inggris Paling Sering Dipakai
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0003-4000-8000-000000000003', 'EXP-BHS-141', 'b8888888-8888-8888-8888-888888888888', 'Tenses Inggris Paling Sering Dipakai', 'tenses-inggris-sering-dipakai', '5 tenses yang mencakup 90% percakapan: present, past, future, present perfect, present continuous.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Simple present: kebiasaan/fakta — "I work every day"$li$,
      $li$Present continuous: sedang berlangsung — "I am working now"$li$,
      $li$Simple past: sudah selesai — "I worked yesterday"$li$,
      $li$Present perfect: ada kaitan dengan kini — "I have worked here since 2020"$li$,
      $li$Simple future: akan — "I will work tomorrow"$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Kuasai 5 ini dulu; 11 tenses lain jarang dipakai sehari-hari. Latihan: ceritakan kegiatanmu kemarin (past), hari ini (present), besok (future).$txt$));
END $doblk$;

-- EXP-BHS-142: Public Speaking untuk Pemula
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0004-4000-8000-000000000004', 'EXP-BHS-142', 'b8888888-8888-8888-8888-888888888888', 'Public Speaking untuk Pemula', 'public-speaking-pemula', 'Mengatasi demam panggung: persiapan, struktur pembuka-isi-penutup, dan latihan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Persiapan: kuasai materi; latihan bersuara (bukan dalam hati) 3x$li$,
      $li$Pembuka: hook (pertanyaan/fakta mengejutkan), bukan "selamat pagi, perkenalkan..."$li$,
      $li$Isi: maksimal 3 poin utama; satu slide satu ide$li$,
      $li$Penutup: rangkum + ajakan bertindak$li$,
      $li$Atasi grogi: napas dalam, kontak mata bergantian, bicara pelan di awal$li$
  ])));
END $doblk$;

-- EXP-BHS-143: Menulis CV yang Dilirik HRD
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0005-4000-8000-000000000005', 'EXP-BHS-143', 'b8888888-8888-8888-8888-888888888888', 'Menulis CV yang Dilirik HRD', 'menulis-cv-dilirik-hrd', 'CV 1-2 halaman yang lolos screening 7 detik: struktur, kata kerja aksi, dan kesalahan fatal.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$HRD memindai 7 detik: nama, posisi terakhir, pendidikan harus langsung terlihat$li$,
      $li$Pakai angka: "Meningkatkan penjualan 30%" bukan "bertanggung jawab atas penjualan"$li$,
      $li$Sesuaikan dengan lowongan (mirror keywords)$li$,
      $li$Kesalahan fatal: typo, foto tidak profesional, email alay, kebohongan$li$,
      $li$Fresh graduate: tonjolkan magang, organisasi, proyek$li$
  ])));
END $doblk$;

-- EXP-BHS-144: Bahasa Tubuh dalam Komunikasi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0006-4000-8000-000000000006', 'EXP-BHS-144', 'b8888888-8888-8888-8888-888888888888', 'Bahasa Tubuh dalam Komunikasi', 'bahasa-tubuh-komunikasi', 'Komunikasi nonverbal: kontak mata, postur, jabat tangan — dan maknanya dalam budaya Indonesia.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kontak mata: percaya diri, tapi jangan menatap terus (tidak sopan)$li$,
      $li$Jabat tangan: mantap tidak lemas; di Indonesia sering disertai anggukan$li$,
      $li$Postur terbuka (tidak menyilangkan tangan) = ramah$li$,
      $li$Menunduk saat lewat di depan orang tua = sopan (budaya)$li$,
      $li$55% kesan dari bahasa tubuh (penelitian Mehrabian) — kata-kata hanya 7%$li$
  ])));
END $doblk$;

-- EXP-BHS-145: Majas: Gaya Bahasa dalam Sastra
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0007-4000-8000-000000000007', 'EXP-BHS-145', 'b8888888-8888-8888-8888-888888888888', 'Majas: Gaya Bahasa dalam Sastra', 'majas-gaya-bahasa-sastra', '20 majas populer: metafora, personifikasi, hiperbola — dengan contoh dari puisi dan lagu Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Metafora: perbandingan langsung ("kau adalah mentari")$li$,
      $li$Simile: dengan kata seperti/bagai ("bagai pinang dibelah dua")$li$,
      $li$Personifikasi: benda mati seolah hidup ("angin berbisik")$li$,
      $li$Hiperbola: berlebihan ("rindu sejuta rasanya")$li$,
      $li$Ironi & sarkasme: makna berlawanan ("wah, rajin sekali" untuk yang malas)$li$,
      $li$Eufemisme: penghalus ("meninggal dunia" untuk "mati")$li$
  ])));
END $doblk$;

-- EXP-BHS-146: Wawancara Kerja: Persiapan dan Jawaban
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0008-4000-8000-000000000008', 'EXP-BHS-146', 'b8888888-8888-8888-8888-888888888888', 'Wawancara Kerja: Persiapan dan Jawaban', 'wawancara-kerja-persiapan', '7 pertanyaan jebakan interview dan cara menjawabnya dengan metode STAR.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$"Ceritakan dirimu": 2 menit, fokus relevansi posisi$li$,
      $li$"Kelemahanmu?": sebut yang sedang diperbaiki + buktinya$li$,
      $li$"Kenapa resign?": jangan menjelekkan atasan lama$li$,
      $li$Metode STAR: Situation, Task, Action, Result untuk pertanyaan pengalaman$li$,
      $li$Siapkan 2-3 pertanyaan balik (tunjukkan minat)$li$
  ])));
END $doblk$;

-- EXP-BHS-147: Membaca Cepat: Skimming dan Scanning
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f6f6f6f6-0009-4000-8000-000000000009', 'EXP-BHS-147', 'b8888888-8888-8888-8888-888888888888', 'Membaca Cepat: Skimming dan Scanning', 'membaca-cepat-skimming-scanning', 'Teknik membaca cepat untuk ujian dan kerja: kapan skimming, kapan scanning, kapan baca mendalam.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-147';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Skimming: baca cepat untuk gagasan utama (judul, kalimat pertama tiap paragraf)$li$,
      $li$Scanning: cari info spesifik (nama, angka, tanggal) — mata memindai kata kunci$li$,
      $li$Jangan subvokalisasi (membaca dalam hati kata per kata) jika ingin cepat$li$,
      $li$Untuk pemahaman mendalam (sastra, kontrak): tetap baca pelan$li$
  ])));
END $doblk$;
