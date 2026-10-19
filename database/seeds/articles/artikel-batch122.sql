-- Batch 122: 5 artikel Fisika - Sains (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)
-- Format: artikel utuh dengan blocks

-- EXP-FISIKA-122: Apa Itu Gaya? Pengertian dan Contoh Sehari-hari
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d1d1d1d1-0001-4000-8000-000000000001', 'EXP-FISIKA-122', 'b8888888-8888-8888-8888-888888888888', 'Apa Itu Gaya? Pengertian dan Contoh Sehari-hari', 'apa-itu-gaya-pengertian-contoh', 'Memahami konsep gaya dalam fisika: pengertian, satuan newton, jenis-jenis gaya, dan contohnya dalam kehidupan sehari-hari.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA-122';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Pengertian Gaya$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Gaya adalah dorongan atau tarikan yang dapat mengubah gerak suatu benda. Saat kamu mendorong meja, menarik pintu, atau menendang bola, kamu sedang memberikan gaya. Dalam fisika, gaya diukur dalam satuan newton (N), diambil dari nama ilmuwan Isaac Newton.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Jenis-Jenis Gaya$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gaya otot: dari aktivitas otot manusia atau hewan, misalnya mendorong gerobak$li$,
      $li$Gaya gravitasi: tarikan bumi ke segala benda, membuat buah jatuh dari pohon$li$,
      $li$Gaya gesek: hambatan saat dua permukaan bersentuhan, misalnya rem sepeda$li$,
      $li$Gaya magnet: tarikan atau tolakan magnet pada benda logam$li$,
      $li$Gaya pegas: dorongan dari pegas yang diregangkan atau ditekan$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Pengaruh Gaya pada Benda$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Gaya dapat mengubah tiga hal: bentuk benda (plastisin ditekan menjadi pipih), arah gerak (bola dibelokkan), dan kecepatan (sepeda direm menjadi lambat). Semakin besar gaya, semakin besar perubahannya.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $txt$Contoh Sehari-hari$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Pagi hari kamu membuka pintu (gaya tarik), menekan tombol lampu (gaya tekan), dan berjalan karena gaya gesek antara sepatu dan lantai mencegahmu terpeleset. Semua aktivitasmu melibatkan gaya.$txt$));
END $doblk$;

-- EXP-FISIKA-123: Hukum Newton I, II, dan III dengan Contoh Nyata
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d1d1d1d1-0002-4000-8000-000000000002', 'EXP-FISIKA-123', 'b8888888-8888-8888-8888-888888888888', 'Hukum Newton I, II, dan III dengan Contoh Nyata', 'hukum-newton-contoh-nyata', 'Tiga hukum gerak Newton dijelaskan dengan bahasa sederhana dan contoh kehidupan sehari-hari: dari penumpang bus hingga roket.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA-123';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Hukum I Newton: Kelembaman$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Benda cenderung mempertahankan keadaannya: yang diam tetap diam, yang bergerak tetap bergerak lurus beraturan, kecuali ada gaya yang bekerja. Ini disebut kelembaman atau inersia. Contoh: saat bus tiba-tiba berhenti, penumpang terdorong ke depan karena tubuh ingin terus bergerak.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Hukum II Newton: F = m x a$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Percepatan benda berbanding lurus dengan gaya dan berbanding terbalik dengan massa: F = m x a. Artinya: mendorong gerobak kosong (massa kecil) lebih mudah daripada gerobak penuh pasir (massa besar) dengan gaya yang sama.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Hukum III Newton: Aksi-Reaksi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Setiap aksi menimbulkan reaksi yang sama besar dan berlawanan arah. Saat kamu berjalan, kakimu mendorong tanah ke belakang, tanah mendorong kakimu ke depan. Roket melesat karena gas panas disemburkan ke bawah, mendorong roket ke atas.$txt$));
END $doblk$;

-- EXP-FISIKA-124: Energi: Bentuk, Perubahan, dan Kekekalannya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d1d1d1d1-0003-4000-8000-000000000003', 'EXP-FISIKA-124', 'b8888888-8888-8888-8888-888888888888', 'Energi: Bentuk, Perubahan, dan Kekekalannya', 'energi-bentuk-perubahan-kekekalan', 'Mengenal berbagai bentuk energi, bagaimana energi berubah dari satu bentuk ke bentuk lain, dan hukum kekekalan energi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA-124';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Energi?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Energi adalah kemampuan untuk melakukan usaha atau kerja. Satuan energi adalah joule (J). Tanpa energi, tidak ada gerak, tidak ada panas, tidak ada kehidupan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Bentuk-Bentuk Energi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Energi kinetik: energi gerak, misalnya mobil melaju atau bola menggelinding$li$,
      $li$Energi potensial: energi karena posisi, misalnya air di bendungan atau buah di pohon$li$,
      $li$Energi panas (kalor): dari gerakan partikel, misalnya api kompor$li$,
      $li$Energi listrik: dari aliran muatan listrik, misalnya baterai$li$,
      $li$Energi kimia: tersimpan dalam ikatan kimia, misalnya makanan dan bensin$li$,
      $li$Energi cahaya: dari matahari atau lampu$li$,
      $li$Energi bunyi: dari getaran, misalnya suara gitar$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Perubahan dan Kekekalan Energi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk. Ini hukum kekekalan energi. Contoh: setrika listrik mengubah energi listrik menjadi panas. Lampu mengubah listrik menjadi cahaya (dan sedikit panas). Tubuhmu mengubah energi kimia dari makanan menjadi gerak dan panas.$txt$));
END $doblk$;

-- EXP-FISIKA-125: Tekanan: Konsep, Rumus, dan Penerapannya
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d1d1d1d1-0004-4000-8000-000000000004', 'EXP-FISIKA-125', 'b8888888-8888-8888-8888-888888888888', 'Tekanan: Konsep, Rumus, dan Penerapannya', 'tekanan-konsep-rumus-penerapan', 'Memahami tekanan (P = F/A): mengapa pisau tajam mudah memotong, bagaimana rem hidrolik bekerja, dan tekanan udara di sekitar kita.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA-125';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Rumus Tekanan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Tekanan (P) adalah gaya (F) dibagi luas bidang tekan (A): P = F/A. Satuan tekanan adalah pascal (Pa) atau N/m2. Artinya: gaya yang sama menghasilkan tekanan lebih besar jika luasnya lebih kecil.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Mengapa Pisau Tajam Mudah Memotong?$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Pisau tajam memiliki mata yang sangat tipis (luas A kecil), sehingga tekanan yang dihasilkan besar meski gaya dorongnya sama. Sebaliknya, sepatu salju lebar mencegah orang tenggelam di salju karena luas besar membuat tekanan kecil.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Tekanan Hidrolik dan Udara$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Dongkrak hidrolik memakai prinsip Pascal: tekanan yang diberikan pada cairan diteruskan sama besar ke segala arah, sehingga gaya kecil bisa mengangkat mobil. Sementara itu, kita hidup di dasar "lautan udara" — tekanan udara sekitar 101.325 Pa menekan tubuh kita dari segala arah tanpa kita sadari.$txt$));
END $doblk$;

-- EXP-FISIKA-126: Getaran, Gelombang, dan Bunyi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('d1d1d1d1-0005-4000-8000-000000000005', 'EXP-FISIKA-126', 'b8888888-8888-8888-8888-888888888888', 'Getaran, Gelombang, dan Bunyi', 'getaran-gelombang-bunyi', 'Dari senar gitar hingga gempa bumi: memahami getaran, jenis gelombang, frekuensi, dan bagaimana bunyi merambat.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $doblk$
DECLARE v_id uuid;
BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-FISIKA-126';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Getaran$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Getaran adalah gerak bolak-balik di sekitar titik setimbang. Contoh: senar gitar yang dipetik, bandul jam, atau garpu tala. Jumlah getaran per detik disebut frekuensi (satuan: hertz/Hz). Waktu untuk satu getaran disebut periode.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Gelombang$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Gelombang adalah getaran yang merambat membawa energi. Ada dua jenis: gelombang transversal (arah getar tegak lurus arah rambat, misalnya gelombang tali dan cahaya) dan gelombang longitudinal (arah getar sejajar arah rambat, misalnya bunyi).$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $txt$Bunyi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Bunyi adalah gelombang longitudinal yang merambat lewat medium (udara, air, zat padat). Di ruang hampa tidak ada bunyi karena tidak ada medium. Bunyi merambat sekitar 340 m/detik di udara. Tinggi-rendahnya nada ditentukan frekuensi; keras-lemahnya ditentukan amplitudo.$txt$));
END $doblk$;
