-- Batch 140: 9 artikel Sejarah tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-SEJ-140: Zaman Prasejarah Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0001-4000-8000-000000000001', 'EXP-SEJ-140', 'b8888888-8888-8888-8888-888888888888', 'Zaman Prasejarah Indonesia', 'zaman-prasejarah-indonesia', 'Dari Meganthropus hingga Austronesia: jejak manusia purba dan migrasi nenek moyang bangsa Indonesia.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Meganthropus palaeojavanicus (Sangiran): manusia raksasa tertua$li$,
      $li$Pithecanthropus erectus / Homo erectus (Trinil, Eugene Dubois 1891)$li$,
      $li$Homo floresiensis ("hobbit" Liang Bua, Flores)$li$,
      $li$Zaman batu: Paleolitikum (berburu), Mesolitikum (kjokkenmodding), Neolitikum (bertani), Megalitikum (batu besar)$li$,
      $li$Zaman logam: perunggu & besi (nekara, kapak corong)$li$,
      $li$Nenek moyang Austronesia datang dari Taiwan ~2000 SM membawa bahasa dan perahu cadik$li$
  ])));
END $doblk$;

-- EXP-SEJ-141: Masuknya Islam ke Nusantara
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0002-4000-8000-000000000002', 'EXP-SEJ-141', 'b8888888-8888-8888-8888-888888888888', 'Masuknya Islam ke Nusantara', 'islam-nusantara-masuk', 'Jalur perdagangan, perkawinan, dan dakwah Walisongo: bagaimana Islam menjadi agama mayoritas.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Teori masuknya Islam: Gujarat (Snouck Hurgronje), Persia, Tiongkok, dan Arab langsung. Bukti awal: makam Fatimah binti Maimun (1082) di Gresik, dan Samudra Pasai (abad 13) sebagai kerajaan Islam pertama.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Perdagangan: pedagang muslim menikahi putri raja/bangsawan$li$,
      $li$Walisongo (9 wali) di Jawa: Sunan Gresik, Ampel, Drajat, Bonang, Giri, Gunung Jati, Kalijaga, Muria, Kudus$li$,
      $li$Sunan Kalijaga: dakwah lewat wayang dan gamelan (akulturasi)$li$,
      $li$Pendidikan: pesantren sebagai pusat penyebaran$li$
  ])));
END $doblk$;

-- EXP-SEJ-142: VOC: Dari Dagang Menjadi Penjajah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0003-4000-8000-000000000003', 'EXP-SEJ-142', 'b8888888-8888-8888-8888-888888888888', 'VOC: Dari Dagang Menjadi Penjajah', 'voc-dagang-penjajah', 'Kongsi dagang Belanda 1602-1799: hak istimewa, monopoli rempah, dan kebangkrutannya.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$VOC (1602) adalah perusahaan multinasional pertama dunia — punya hak mencetak uang, punya tentara, dan boleh perang. Monopoli rempah: memusnahkan pohon cengkeh di luar Ambon (hongi tochten), memaksa tanam dengan harga murah.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Perlawanan: Sultan Agung (Mataram), Sultan Hasanuddin (Gowa, "Ayam Jantan dari Timur"), Pattimura (Maluku). VOC bangkrut 1799 karena korupsi, perang mahal, dan saingan Inggris — asetnya diambil alih pemerintah Belanda (Hindia Belanda).$txt$));
END $doblk$;

-- EXP-SEJ-143: Kebangkitan Nasional 1908
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0004-4000-8000-000000000004', 'EXP-SEJ-143', 'b8888888-8888-8888-8888-888888888888', 'Kebangkitan Nasional 1908', 'kebangkitan-nasional-1908', 'Budi Utomo, Sumpah Pemuda, dan organisasi pergerakan: lahirnya kesadaran nasional Indonesia.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$20 Mei 1908: Budi Utomo (dr. Soetomo) — organisasi modern pertama; diperingati Harkitnas$li$,
      $li$Sarekat Islam (1912): awalnya dagang, menjadi politik massa$li$,
      $li$Indische Partij (1912): Douwes Dekker, Cipto, Ki Hajar — "Het Exces"$li$,
      $li$28 Okt 1928: Sumpah Pemuda — satu tanah air, satu bangsa, satu bahasa$li$,
      $li$PNI (1927): Soekarno, non-kooperasi$li$
  ])));
END $doblk$;

-- EXP-SEJ-144: Orde Baru: Pembangunan dan Otoritarianisme
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0005-4000-8000-000000000005', 'EXP-SEJ-144', 'b8888888-8888-8888-8888-888888888888', 'Orde Baru: Pembangunan dan Otoritarianisme', 'orde-baru-pembangunan', '32 tahun Soeharto (1966-1998): stabilisasi ekonomi, pembangunan, tetapi juga otoritarianisme dan KKN.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Lahir dari Supersemar (11 Mar 1966) pasca G30S. Capaian: swasembada beras (1984), KB sukses, infrastruktur, pertumbuhan ekonomi tinggi (dana minyak + utang luar negeri). Sisi gelap: pembungkaman pers & oposisi, KKN merajalela, pelanggaran HAM (Timtim, Aceh, 1965-66). Berakhir oleh krisis 1998.$txt$));
END $doblk$;

-- EXP-SEJ-145: Perang Dunia II dan Dampaknya untuk Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0006-4000-8000-000000000006', 'EXP-SEJ-145', 'b8888888-8888-8888-8888-888888888888', 'Perang Dunia II dan Indonesia', 'pd2-dampak-indonesia', 'Pendudukan Jepang 1942-1945: romusha, janji kemerdekaan, dan pelatihan militer yang melahirkan TNI.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$8 Mar 1942: Belanda menyerah di Kalijati; Jepang berkuasa$li$,
      $li$Romusha: kerja paksa; ratusan ribu tewas$li$,
      $li$Janji Koiso (Sep 1944): kemerdekaan "di kemudian hari"$li$,
      $li$BPUPKI & PPKI dibentuk; pemuda dilatih (PETA, Heiho) — cikal bakal TNI$li$,
      $li$14 Agt 1945: Jepang menyerah → momentum proklamasi$li$
  ])));
END $doblk$;

-- EXP-SEJ-146: Pahlawan Nasional yang Wajib Dikenal
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0007-4000-8000-000000000007', 'EXP-SEJ-146', 'b8888888-8888-8888-8888-888888888888', 'Pahlawan Nasional yang Wajib Dikenal', 'pahlawan-nasional-wajib-dikenal', '12 pahlawan dari berbagai era dan daerah: dari Cut Nyak Dien hingga Ki Hajar Dewantara.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cut Nyak Dien (Aceh): gerilya melawan Belanda$li$,
      $li$Pangeran Diponegoro (Jawa): Perang Jawa 1825-1830$li$,
      $li$R.A. Kartini (Jepara): emansipasi perempuan, "Habis Gelap Terbitlah Terang"$li$,
      $li$Ki Hajar Dewantara: Taman Siswa, "Tut Wuri Handayani"$li$,
      $li$Soekarno-Hatta: proklamator$li$,
      $li$Jenderal Soedirman: panglima gerilya$li$,
      $li$Bung Tomo: membakar semangat Surabaya$li$,
      $li$Moh. Natsir, Sjahrir: diplomasi dan pemikiran$li$,
      $li$Cut Nyak Meutia, Martha Christina Tiahahu: pejuang perempuan$li$
  ])));
END $doblk$;

-- EXP-SEJ-147: Sejarah Uang: Dari Barter hingga QRIS
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0008-4000-8000-000000000008', 'EXP-SEJ-147', 'b8888888-8888-8888-8888-888888888888', 'Sejarah Uang: Dari Barter hingga QRIS', 'sejarah-uang-barter-qris', 'Evolusi alat tukar: barter, uang barang, koin, kertas, hingga digital — dan sejarah rupiah.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-147';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Barter: tukar langsung (masalah: butuh kebetulan ganda)$li$,
      $li$Uang barang: garam, kerang, ternak$li$,
      $li$Logam & koin: Lydia (600 SM); di Nusantara: picis, gobog$li$,
      $li$Kertas: Tiongkok abad 7; VOC memperkenalkan di Nusantara$li$,
      $li$Rupiah: dari "roepiah" Hindia Belanda; ORI pertama 1946$li$,
      $li$Digital: kartu, e-wallet, QRIS (2019)$li$
  ])));
END $doblk$;

-- EXP-SEJ-148: Candi Prambanan dan Kisah Roro Jonggrang
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f7f7f7f7-0009-4000-8000-000000000009', 'EXP-SEJ-148', 'b8888888-8888-8888-8888-888888888888', 'Candi Prambanan dan Roro Jonggrang', 'prambanan-roro-jonggrang', 'Candi Hindu terbesar Indonesia: sejarah Rakai Pikatan, arsitektur Trimurti, dan legenda seribu candi.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-SEJ-148';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Dibangun abad ke-9 oleh Rakai Pikatan (Mataram Kuno) untuk Trimurti: Siwa (tertinggi, 47 m), Wisnu, Brahma. Relief Ramayana menghiasi dinding. Legenda: Bandung Bondowoso membangun 1000 candi semalam untuk meminang Roro Jonggrang; kurang satu, ia dikutuk menjadi arca ke-1000.$txt$));
END $doblk$;
