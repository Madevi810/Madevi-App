-- Batch 129: 5 artikel Bahasa Indonesia (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-BHS-129: Ejaan: Kapital, Tanda Baca, dan Kata Baku
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d8d8d8d8-0001-4000-8000-000000000001', 'EXP-BHS-129', 'b8888888-8888-8888-8888-888888888888', 'Ejaan: Kapital, Tanda Baca, dan Kata Baku', 'ejaan-kapital-tanda-baca', 'Aturan ejaan Bahasa Indonesia yang sering salah: huruf kapital, koma, titik, dan kata baku vs tidak baku.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-129';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Huruf Kapital$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Awal kalimat dan nama orang: "Ade pergi ke Jakarta."$li$,
      $li$Nama tempat, hari, bulan: Senin, Januari, Indonesia$li$,
      $li$Jabatan diikuti nama: "Presiden Prabowo", tapi "presiden itu"$li$,
      $li$Tidak kapital untuk kata ganti Tuhan? Justru kapital: "Allah", "Tuhan"$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Kata Baku$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$apotek (bukan apotik), atlet (bukan atlit), bus (bukan bis)$li$,
      $li$hierarki (bukan hirarki), ijazah (bukan ijasah), karier (bukan karir)$li$,
      $li$nasihat (bukan nasehat), risiko (bukan resiko), survei (bukan survey)$li$,
      $li$Cek di KBBI daring untuk yang ragu$li$
  ])));
END $doblk$;

-- EXP-BHS-130: Kalimat Efektif: Jelas, Padat, dan Benar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d8d8d8d8-0002-4000-8000-000000000002', 'EXP-BHS-130', 'b8888888-8888-8888-8888-888888888888', 'Kalimat Efektif: Jelas, Padat, dan Benar', 'kalimat-efektif-jelas-padat', 'Syarat kalimat efektif: kesatuan, kepaduan, keparalelan, kehematan, ketepatan — dengan contoh perbaikan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-130';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Lima Syarat$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kesatuan: satu ide pokok. Salah: "Saya suka membaca dan adik saya suka berenang dan ibu memasak."$li$,
      $li$Kepaduan: hubungan antarunsur jelas. Salah: "Buku yang dibeli kemarin hilang." (siapa membeli?)$li$,
      $li$Keparalelan: bentuk sejajar. Salah: "Dia suka membaca, menulis, dan berenang-renang." → "membaca, menulis, berenang"$li$,
      $li$Kehematan: tidak bertele-tele. Salah: "demi untuk" → "demi" atau "untuk"$li$,
      $li$Ketepatan: pilihan kata tepat. Salah: "memakan waktu" → "membutuhkan waktu"$li$
  ])));
END $doblk$;

-- EXP-BHS-131: Paragraf: Struktur dan Jenisnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d8d8d8d8-0003-4000-8000-000000000003', 'EXP-BHS-131', 'b8888888-8888-8888-8888-888888888888', 'Paragraf: Struktur dan Jenisnya', 'paragraf-struktur-jenis', 'Membangun paragraf yang baik: kalimat utama, deduktif vs induktif, dan jenis paragraf narasi, deskripsi, eksposisi, argumentasi, persuasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-131';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Struktur$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Paragraf yang baik punya satu kalimat utama + kalimat penjelas. Deduktif: utama di awal ("Olahraga penting bagi kesehatan. ..."). Induktif: utama di akhir (fakta-fakta dulu, simpulan di akhir). Campuran: utama di awal dan ditegaskan di akhir.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Lima Jenis$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Narasi: menceritakan peristiwa (cerpen, novel)$li$,
      $li$Deskripsi: melukiskan objek seolah pembaca melihatnya$li$,
      $li$Eksposisi: menjelaskan informasi (artikel ini!)$li$,
      $li$Argumentasi: meyakinkan dengan alasan dan bukti$li$,
      $li$Persuasi: mengajak pembaca melakukan sesuatu$li$
  ])));
END $doblk$;

-- EXP-BHS-132: Kosakata Inggris Sehari-hari: 100 Kata Pertama
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d8d8d8d8-0004-4000-8000-000000000004', 'EXP-BHS-132', 'b8888888-8888-8888-8888-888888888888', 'Kosakata Inggris Sehari-hari: 100 Kata Pertama', 'kosakata-inggris-100-kata', '100 kata Inggris paling sering dipakai sehari-hari, dikelompokkan per tema, plus tips menghafal.', 'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-132';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Kata Kerja (20)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$go, come, eat, drink, sleep, wake, work, study, read, write, speak, listen, buy, sell, open, close, help, need, want, like.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Kata Benda (30)$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$time, day, house, food, water, money, phone, car, book, school, friend, family, work, hand, eye, door, window, table, chair, bed, morning, night, week, month, year, man, woman, child, people, thing.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Tips Menghafal$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Hafalkan dalam kalimat, bukan kata lepas ("I eat rice" bukan "eat = makan"). Ulangi dengan jeda (spaced repetition): hari 1, 3, 7, 30. Tempel label Inggris di benda rumah.$txt$));
END $doblk$;

-- EXP-BHS-133: Menulis Email Formal yang Baik
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d8d8d8d8-0005-4000-8000-000000000005', 'EXP-BHS-133', 'b8888888-8888-8888-8888-888888888888', 'Menulis Email Formal yang Baik', 'menulis-email-formal', 'Struktur email formal: subjek, salam, isi, penutup — plus contoh lamaran kerja dan komplain.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BHS-133';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Struktur$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Subjek: jelas dan spesifik ("Lamaran: Staff Admin - Ade")$li$,
      $li$Salam: "Yth. Bapak/Ibu ..." atau "Halo Tim Rekrutmen,"$li$,
      $li$Isi: maksud, latar singkat, lampiran$li$,
      $li$Penutup: "Hormat saya," + nama + kontak$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Hindari: subjek kosong, "P" atau "Assalamualaikum" saja tanpa isi jelas, huruf kapital semua (terkesan berteriak), dan lampiran tanpa penjelasan. Baca ulang sebelum kirim.$txt$));
END $doblk$;
