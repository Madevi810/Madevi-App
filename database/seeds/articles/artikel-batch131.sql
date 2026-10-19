-- Batch 131: 5 artikel Lingkungan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-LING-131: Perubahan Iklim: Penyebab dan Dampak
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1e1e1e1-0001-4000-8000-000000000001', 'EXP-LING-131', 'b8888888-8888-8888-8888-888888888888', 'Perubahan Iklim: Penyebab dan Dampak', 'perubahan-iklim-penyebab-dampak', 'Efek rumah kaca, pemanasan global, dampak untuk Indonesia, dan apa yang bisa kita lakukan.', 'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-131';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Efek Rumah Kaca$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Gas rumah kaca (CO2, metana) memerangkap panas matahari di atmosfer — seperti kaca rumah kaca. Tanpa efek ini bumi terlalu dingin; tapi kelebihan gas dari pembakaran fosil dan deforestasi membuat bumi memanas: suhu rata-rata naik ~1,2°C sejak era pra-industri.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Dampak untuk Indonesia$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kenaikan muka air laut mengancam pesisir dan pulau kecil$li$,
      $li$Cuaca ekstrem: banjir dan kekeringan bergantian$li$,
      $li$Gagal panen dan harga pangan naik$li$,
      $li$Terumbu karang memutih (bleaching)$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 4, jsonb_build_object('text', $txt$Yang bisa dilakukan: hemat energi, kurangi plastik sekali pakai, naik transportasi umum, tanam pohon, dan dukung kebijakan hijau. Perubahan besar dimulai dari kebiasaan kecil yang konsisten.$txt$));
END $doblk$;

-- EXP-LING-132: Sampah: Pilah, Olah, Kurangi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1e1e1e1-0002-4000-8000-000000000002', 'EXP-LING-132', 'b8888888-8888-8888-8888-888888888888', 'Sampah: Pilah, Olah, Kurangi', 'sampah-pilah-olah-kurangi', 'Jenis sampah, cara memilah yang benar, kompos dari sampah organik, dan prinsip 3R+1.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-132';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Jenis Sampah$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Organik: sisa makanan, daun — bisa jadi kompos$li$,
      $li$Anorganik: plastik, kertas, kaca, logam — bisa didaur ulang$li$,
      $li$B3: baterai, lampu neon, obat — berbahaya, ke dropbox khusus$li$,
      $li$Residu: tisu kotor, popok — ke TPA$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Prinsip: Reduce (kurangi), Reuse (pakai ulang), Recycle (daur ulang), Replace (ganti dengan ramah lingkungan). Kompos sederhana: campur sampah dapur + daun kering dalam ember berlubang, aduk tiap 3 hari, jadi dalam 1-2 bulan.$txt$));
END $doblk$;

-- EXP-LING-133: Air Bersih: Dari Mana dan Mengapa Harus Hemat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1e1e1e1-0003-4000-8000-000000000003', 'EXP-LING-133', 'b8888888-8888-8888-8888-888888888888', 'Air Bersih: Dari Mana dan Mengapa Harus Hemat', 'air-bersih-hemat', 'Siklus air, krisis air bersih di Indonesia, dan 10 cara menghemat air di rumah.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-133';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Siklus Air$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Air laut menguap, menjadi awan, turun sebagai hujan, meresap menjadi air tanah atau mengalir ke sungai. Hanya 2,5% air bumi yang tawar, dan sebagian besar terkunci di es. Air bersih yang bisa dipakai sangat terbatas.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Hemat Air$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 3, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mandi dengan shower 5 menit, bukan bak berendam$li$,
      $li$Tampung air wudu/cuci sayur untuk menyiram tanaman$li$,
      $li$Perbaiki keran bocor (satu tetes/detik = 11.000 liter/tahun!)$li$,
      $li$Cuci baju dengan muatan penuh$li$
  ])));
END $doblk$;

-- EXP-LING-134: Hutan Indonesia: Paru-Paru Dunia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1e1e1e1-0004-4000-8000-000000000004', 'EXP-LING-134', 'b8888888-8888-8888-8888-888888888888', 'Hutan Indonesia: Paru-Paru Dunia', 'hutan-indonesia-paru-dunia', 'Hutan tropis Indonesia: keanekaragaman hayati, fungsi ekologis, ancaman deforestasi, dan upaya konservasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-134';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Kekayaan$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Indonesia punya hutan hujan tropis terluas ketiga dunia (setelah Brasil dan Kongo). Rumah bagi orangutan, harimau sumatra, badak jawa, komodo — banyak yang tidak ada di tempat lain (endemik). Hutan menyerap karbon, mengatur air, dan sumber obat-obatan.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $txt$Ancaman dan Solusi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Deforestasi untuk sawit, tambang, dan kebakaran hutan mengancam. Solusi: perhutanan sosial, sertifikasi (FSC/RSPO), penegakan hukum, dan restorasi gambut. Konsumen bisa bantu dengan memilih produk bersertifikat.$txt$));
END $doblk$;

-- EXP-LING-135: Energi Terbarukan untuk Indonesia
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('e1e1e1e1-0005-4000-8000-000000000005', 'EXP-LING-135', 'b8888888-8888-8888-8888-888888888888', 'Energi Terbarukan untuk Indonesia', 'energi-terbarukan-indonesia', 'Potensi surya, angin, air, panas bumi, dan biomassa Indonesia — plus cara kerja panel surya atap.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-LING-135';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $txt$Potensi$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Surya: tropis = sinar melimpah sepanjang tahun$li$,
      $li$Panas bumi: 40% cadangan dunia ada di Indonesia (ring of fire)$li$,
      $li$Air: ribuan sungai berpotensi PLTA/mikrohidro$li$,
      $li$Angin: pesisir selatan Jawa, Sulawesi, NTT$li$,
      $li$Biomassa: limbah sawit, sekam padi$li$
  ])));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 2, jsonb_build_object('text', $txt$Panel surya atap: sel fotovoltaik mengubah cahaya menjadi listrik DC, inverter mengubah ke AC untuk rumah. Kelebihan daya bisa dijual ke PLN (net metering). Investasi awal jutaan, balik modal 5-8 tahun, panel awet 25 tahun.$txt$));
END $doblk$;
