-- Batch 134: 9 artikel Sains tambahan (idempoten) — melengkapi 15/kategori
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-FIS-134: Listrik Statis dan Dinamis
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0001-4000-8000-000000000001', 'EXP-FIS-134', 'b8888888-8888-8888-8888-888888888888', 'Listrik Statis dan Dinamis', 'listrik-statis-dinamis', 'Muatan listrik, listrik statis (penggaris gosok rambut), arus listrik, dan rangkaian seri-paralel.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Listrik Statis$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Gosokkan penggaris plastik ke rambut kering — penggaris bisa menarik potongan kertas kecil. Ini listrik statis: muatan yang menumpuk tidak mengalir. Petir adalah listrik statis raksasa antara awan dan bumi.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Arus dan Rangkaian$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Arus listrik = aliran muatan (elektron). Rangkaian seri: komponen berderet, arus sama, jika satu putus semua mati (lampu hias murah). Rangkaian paralel: tiap cabang mandiri — instalasi rumah memakai paralel agar satu lampu mati tidak mematikan yang lain.$txt$));
END $doblk$;

-- EXP-FIS-135: Cahaya: Pemantulan dan Pembiasan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0002-4000-8000-000000000002', 'EXP-FIS-135', 'b8888888-8888-8888-8888-888888888888', 'Cahaya: Pemantulan dan Pembiasan', 'cahaya-pemantulan-pembiasan', 'Sifat cahaya: pemantulan di cermin, pembiasan (sedotan bengkok), lensa, dan dispersi pelangi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Pemantulan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Cahaya memantul dengan sudut datang = sudut pantul. Cermin datar: bayangan tegak sama besar. Cermin cembung (spion): bayangan kecil, jangkauan luas. Cermin cekung (reflektor lampu): memfokuskan cahaya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Pembiasan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Cahaya berbelok saat pindah medium (udara ke air) — itulah mengapa sedotan di gelas terlihat bengkok dan kolam terlihat dangkal. Lensa kacamata memakai pembiasan untuk memfokuskan cahaya ke retina. Pelangi = dispersi: cahaya putih terurai menjadi warna-warni oleh tetes air.$txt$));
END $doblk$;

-- EXP-FIS-136: Tata Surya: Planet-Planet Kita
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0003-4000-8000-000000000003', 'EXP-FIS-136', 'b8888888-8888-8888-8888-888888888888', 'Tata Surya: Planet-Planet Kita', 'tata-surya-planet', 'Mengenal 8 planet: ciri khas tiap planet, sabuk asteroid, dan mengapa Pluto bukan planet lagi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FIS-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Merkurius: terdekat matahari, siang sangat panas malam sangat dingin$li$,
      $li$Venus: terpanas (efek rumah kaca ekstrem), berputar terbalik$li$,
      $li$Bumi: satu-satunya dengan kehidupan (sejauh diketahui)$li$,
      $li$Mars: planet merah, target misi manusia$li$,
      $li$Jupiter: terbesar, badai Great Red Spot lebih besar dari Bumi$li$,
      $li$Saturnus: cincin es dan batu yang ikonik$li$,
      $li$Uranus: miring 98 derajat, menggelinding mengorbit$li$,
      $li$Neptunus: terjauh, angin tercepat (2.100 km/jam)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Pluto direklasifikasi 2006 menjadi planet katai karena orbitnya berpotongan dan tidak "membersihkan" orbitnya. Sabuk asteroid antara Mars dan Jupiter berisi jutaan batuan sisa pembentukan tata surya.$txt$));
END $doblk$;

-- EXP-KIM-134: Minyak dan Lemak: Jenuh vs Tak Jenuh
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0004-4000-8000-000000000004', 'EXP-KIM-134', 'b8888888-8888-8888-8888-888888888888', 'Minyak dan Lemak: Jenuh vs Tak Jenuh', 'minyak-lemak-jenuh-tak-jenuh', 'Kimia minyak goreng: lemak jenuh, tak jenuh, trans — dan berapa kali minyak boleh dipakai ulang.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIM-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Lemak jenuh: dari hewani, padat di suhu ruang (mentega) — batasi$li$,
      $li$Lemak tak jenuh: dari nabati, cair (minyak zaitun, kanola) — lebih baik$li$,
      $li$Lemak trans: dari hidrogenasi parsial — hindari (margarin murah)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Minyak jelantah: maksimal 2-3x pakai. Tanda harus dibuang: warna gelap pekat, berbusa, bau tengik, berasap di suhu rendah. Minyak bekas jangan dibuang ke wastafel (menyumbat) — kumpulkan untuk diolah jadi biodiesel/sabun.$txt$));
END $doblk$;

-- EXP-KIM-135: Baterai: Cara Kerja dan Jenisnya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0005-4000-8000-000000000005', 'EXP-KIM-135', 'b8888888-8888-8888-8888-888888888888', 'Baterai: Cara Kerja dan Jenisnya', 'baterai-cara-kerja-jenis', 'Elektrokimia sederhana: cara baterai menghasilkan listrik, jenis baterai, dan pembuangan yang benar.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIM-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Baterai mengubah energi kimia menjadi listrik lewat reaksi redoks: di anoda terjadi oksidasi (lepas elektron), di katoda reduksi (terima elektron). Aliran elektron inilah arus listrik.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Primer (sekali pakai): alkaline, zinc-carbon$li$,
      $li$Sekunder (isi ulang): Li-ion (HP/laptop), NiMH, aki timbal-asam (motor/mobil)$li$,
      $li$Baterai bekas = limbah B3: jangan dibuang ke tempat sampah — ke dropbox khusus$li$
  ])));
END $doblk$;

-- EXP-KIM-136: Korosi: Mengapa Besi Berkarat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0006-4000-8000-000000000006', 'EXP-KIM-136', 'b8888888-8888-8888-8888-888888888888', 'Korosi: Mengapa Besi Berkarat', 'korosi-besi-berkarat', 'Proses perkaratan besi, faktor pemercepat, dan 5 cara mencegahnya — dari cat hingga proteksi katodik.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIM-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Karat = besi + oksigen + air menjadi besi(III) oksida. Tanpa salah satu, karat tidak terjadi. Air garam mempercepat (itu sebabnya mobil di daerah pantai cepat karatan).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cat/minyak: menghalangi oksigen dan air$li$,
      $li$Galvanisasi: lapis seng (seng berkorban dulu)$li$,
      $li$Paduan: stainless steel (campur krom)$li$,
      $li$Proteksi katodik: tempel logam lebih reaktif (kapal laut)$li$,
      $li$Jaga kering: simpan perkakas di tempat kering$li$
  ])));
END $doblk$;

-- EXP-BIO-134: Sistem Pernapasan Manusia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0007-4000-8000-000000000007', 'EXP-BIO-134', 'b8888888-8888-8888-8888-888888888888', 'Sistem Pernapasan Manusia', 'sistem-pernapasan-manusia', 'Mekanisme bernapas: hidung hingga alveolus, pertukaran oksigen, dan bahaya rokok bagi paru-paru.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Hidung: menyaring, menghangatkan, melembapkan udara$li$,
      $li$Tenggorokan & bronkus: saluran menuju paru$li$,
      $li$Alveolus: 300 juta kantong kecil tempat O2 masuk darah dan CO2 keluar$li$,
      $li$Diafragma: otot utama pernapasan$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Rokok: tar merusak silia dan alveolus, nikotin adiktif, CO mengikat hemoglobin. Perokok pasif juga berisiko. Berhenti merokok: paru mulai pulih dalam hitungan minggu.$txt$));
END $doblk$;

-- EXP-BIO-135: Sistem Saraf dan Indera
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0008-4000-8000-000000000008', 'EXP-BIO-135', 'b8888888-8888-8888-8888-888888888888', 'Sistem Saraf dan Indera', 'sistem-saraf-indera', 'Otak, sumsum tulang belakang, saraf, dan lima indera: cara tubuh menerima dan merespons rangsang.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Sistem saraf: otak (pusat), sumsum tulang belakang (kabel utama), saraf tepi (kabel cabang). Gerak refleks (tangan menyentuh panas langsung menarik) tidak lewat otak — lewat sumsum tulang belakang agar cepat.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mata: retina menangkap cahaya; rabun jauh/dekat karena fokus meleset$li$,
      $li$Telinga: gendang + tulang pendengaran; jaga dari suara >85 dB$li$,
      $li$Hidung & lidah: penciuman dan pengecap (manis, asin, asam, pahit, umami)$li$,
      $li$Kulit: peraba terbesar; juga mengatur suhu$li$
  ])));
END $doblk$;

-- EXP-BIO-136: Reproduksi Tumbuhan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f1f1f1f1-0009-4000-8000-000000000009', 'EXP-BIO-136', 'b8888888-8888-8888-8888-888888888888', 'Reproduksi Tumbuhan', 'reproduksi-tumbuhan', 'Penyerbukan, pembuahan, penyebaran biji — plus reproduksi vegetatif (stek, cangkok, okulasi).', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-BIO-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Generatif: serbuk sari (jantan) sampai ke putik (betina) lewat angin, serangga, burung, atau manusia. Setelah pembuahan, bakal buah menjadi buah dan bakal biji menjadi biji. Biji tersebar lewat angin (kapuk), air (kelapa), hewan (durian dimakan luwak), atau meledak (kecipir).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Stek: potong batang, tancapkan (singkong, mawar)$li$,
      $li$Cangkok: kupas batang, bungkus tanah (mangga, jambu)$li$,
      $li$Okulasi: tempel mata tunas unggul ke batang bawah$li$,
      $li$Umbi & geragih: kentang, stroberi$li$
  ])));
END $doblk$;
