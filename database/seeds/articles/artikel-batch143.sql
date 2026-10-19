-- Batch 143: 9 artikel Agama tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)
-- Konten umum menghormati keberagaman.

-- EXP-AGA-143: Zakat: Jenis, Nisab, dan Cara Menghitung
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0001-4000-8000-000000000001', 'EXP-AGA-143', 'b8888888-8888-8888-8888-888888888888', 'Zakat: Jenis, Nisab, dan Cara Menghitung', 'zakat-jenis-nisab-hitung', 'Zakat maal, fitrah, profesi: nisab, kadar, waktu, dan contoh hitungan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Zakat fitrah: 2,5 kg/3,5 liter beras per jiwa, sebelum salat Id$li$,
      $li$Zakat maal: 2,5% harta mencapai nisab (85 gr emas) dan haul 1 tahun$li$,
      $li$Zakat profesi: 2,5% dari penghasilan (pendapat kontemporer)$li$,
      $li$Contoh: tabungan Rp100 jt setahun → zakat Rp2,5 jt$li$,
      $li$Salurkan via BAZNAS/LAZ resmi agar tepat sasaran$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Catatan: nisab mengikuti harga emas terkini; untuk detail fikih, konsultasikan ke ulama/BAZNAS.$txt$));
END $doblk$;

-- EXP-AGA-144: Haji dan Umrah: Rukun dan Persiapan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0002-4000-8000-000000000002', 'EXP-AGA-144', 'b8888888-8888-8888-8888-888888888888', 'Haji dan Umrah: Rukun dan Persiapan', 'haji-umrah-rukun-persiapan', 'Rukun haji/umrah, perbedaan keduanya, antrean Indonesia, dan persiapan fisik-dokumen.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Rukun haji: ihram, wukuf Arafah, tawaf ifadah, sai, tahalul, tertib$li$,
      $li$Umrah: seperti haji tanpa wukuf; bisa kapan saja$li$,
      $li$Antrean haji reguler Indonesia: belasan hingga puluhan tahun (daftar via Kemenag)$li$,
      $li$Persiapan: vaksin meningitis, fisik (banyak jalan kaki), manasik$li$
  ])));
END $doblk$;

-- EXP-AGA-145: Membaca Al-Quran: Tajwid Dasar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0003-4000-8000-000000000003', 'EXP-AGA-145', 'b8888888-8888-8888-8888-888888888888', 'Tajwid Dasar', 'tajwid-dasar-membaca-quran', 'Hukum nun sukun dan mim sukun: izhar, idgham, iqlab, ikhfa — fondasi membaca Al-Quran dengan benar.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Izhar: jelas (nun bertemu ا ح خ ع غ ه) — "min had"$li$,
      $li$Idgham: lebur (bertemu ي ن م و ل ر)$li$,
      $li$Iqlab: berubah jadi mim (bertemu ب)$li$,
      $li$Ikhfa: samar (15 huruf sisanya)$li$,
      $li$Belajar tajwid ideal dengan guru (talaqqi); artikel ini pengantar$li$
  ])));
END $doblk$;

-- EXP-AGA-146: Doa Sehari-hari: Kumpulan Esensial
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0004-4000-8000-000000000004', 'EXP-AGA-146', 'b8888888-8888-8888-8888-888888888888', 'Doa Sehari-hari Esensial', 'doa-sehari-hari-esensial', '15 doa harian: bangun tidur, makan, masuk-keluar rumah, bepergian, belajar — arab, latin, arti.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bangun tidur: Alhamdulillahilladzi ahyana...$li$,
      $li$Sebelum makan: Allahumma barik lana...$li$,
      $li$Sesudah makan: Alhamdulillahilladzi ath-amana...$li$,
      $li$Masuk rumah: Allahumma inni asaluka khairal maulaj...$li$,
      $li$Bepergian: Subhanalladzi sakhkhara lana...$li$,
      $li$Belajar: Rabbi zidni ilma warzuqni fahma$li$,
      $li$Masuk WC: Allahumma inni audzubika minal khubutsi wal khabaits$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Hafalkan bertahap 1-2 per minggu. Pahami artinya agar doa lebih khusyuk.$txt$));
END $doblk$;

-- EXP-AGA-147: Natal dan Paskah: Makna bagi Umat Kristen
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0005-4000-8000-000000000005', 'EXP-AGA-147', 'b8888888-8888-8888-8888-888888888888', 'Natal dan Paskah', 'natal-paskah-makna', 'Dua hari raya utama Kristen: makna kelahiran dan kebangkitan Yesus, serta tradisi perayaannya.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-147';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Natal (25 Desember): memperingati kelahiran Yesus Kristus — momen kasih dan damai, dirayakan dengan ibadah, pohon natal, dan berbagi. Paskah: memperingati kebangkitan Yesus pada hari ketiga — inti iman Kristen tentang kemenangan atas maut, didahului Jumat Agung dan Paskah dengan telur sebagai simbol kehidupan baru.$txt$));
END $doblk$;

-- EXP-AGA-148: Hari Raya Hindu, Buddha, Konghucu
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0006-4000-8000-000000000006', 'EXP-AGA-148', 'b8888888-8888-8888-8888-888888888888', 'Hari Raya Hindu, Buddha, Konghucu', 'hari-raya-hindu-buddha-konghucu', 'Nyepi, Waisak, Imlek: makna dan tradisi tiga hari raya besar di Indonesia.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-148';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Nyepi (Hindu): tahun baru Saka; catur brata (tidak menyalakan api, tidak bekerja, tidak bepergian, tidak bersenang-senang) — sehari hening$li$,
      $li$Waisak (Buddha): kelahiran, pencerahan, dan wafat Buddha Gautama; puncaknya di Borobudur$li$,
      $li$Imlek (Konghucu): tahun baru lunar; angpao, barongsai, kumpul keluarga$li$
  ])));
END $doblk$;

-- EXP-AGA-149: Etika Digital: Adab di Media Sosial
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0007-4000-8000-000000000007', 'EXP-AGA-149', 'b8888888-8888-8888-8888-888888888888', 'Etika Digital: Adab di Media Sosial', 'etika-digital-medsos', 'Akhlak di dunia maya: tabayyun sebelum share, tidak ghibah online, dan adab berbeda pendapat.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-149';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Tabayyun: verifikasi sebelum menyebar (QS Al-Hujurat: 6) — lawan hoaks$li$,
      $li$Tidak ghibah dan fitnah online; jejak digital abadi$li$,
      $li$Berkata baik atau diam — berlaku juga di kolom komentar$li$,
      $li$Hormati privasi: izin sebelum posting foto orang lain$li$
  ])));
END $doblk$;

-- EXP-AGA-150: Syukur dan Sabar: Kunci Ketenangan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0008-4000-8000-000000000008', 'EXP-AGA-150', 'b8888888-8888-8888-8888-888888888888', 'Syukur dan Sabar', 'syukur-sabar-ketenangan', 'Dua sayap ketenangan hati: syukur atas nikmat dan sabar atas ujian — dengan latihan praktis.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-150';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Syukur: sadari nikmat kecil (napas, makan, atap) — tulis 3 hal disyukuri tiap malam. Sabar: bukan pasif, tapi teguh + ikhtiar. "Sesungguhnya bersama kesulitan ada kemudahan." Latihan: saat marah, diam dan istigfar; saat senang, berbagi.$txt$));
END $doblk$;

-- EXP-AGA-151: Zikir Pagi dan Petang
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('fafafafa-0009-4000-8000-000000000009', 'EXP-AGA-151', 'b8888888-8888-8888-8888-888888888888', 'Zikir Pagi dan Petang', 'zikir-pagi-petang', 'Kumpulan zikir Al-Matsurat: bacaan pagi dan petang untuk ketenangan dan perlindungan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-AGA-151';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Ayat Kursi (1x)$li$,
      $li$Al-Ikhlas, Al-Falaq, An-Nas (3x)$li$,
      $li$Sayyidul istighfar$li$,
      $li$Subhanallah wa bihamdih (100x)$li$,
      $li$Doa: Allahumma inni as-aluka ilman nafia...$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Waktu: setelah Subuh hingga terbit matahari (pagi), setelah Asar hingga Magrib (petang). Mulai dari yang pendek dan konsisten.$txt$));
END $doblk$;
