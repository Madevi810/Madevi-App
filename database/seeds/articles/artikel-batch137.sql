-- Batch 137: 9 artikel Kesehatan tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)
-- CATATAN: edukasi umum, bukan pengganti saran medis.

-- EXP-KES-137: Jantung Sehat: Kenali dan Cegah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0001-4000-8000-000000000001', 'EXP-KES-137', 'b8888888-8888-8888-8888-888888888888', 'Jantung Sehat: Kenali dan Cegah', 'jantung-sehat-kenali-cegah', 'Penyakit jantung pembunuh nomor 1: faktor risiko, tanda serangan jantung, dan pencegahan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-137';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Faktor risiko: merokok, darah tinggi, kolesterol, diabetes, obesitas, kurang gerak$li$,
      $li$Tanda serangan: nyeri dada seperti ditekan, menjalar ke lengan kiri/leher, keringat dingin, sesak$li$,
      $li$Pencegahan: berhenti merokok, olahraga 150 mnt/minggu, batasi garam-gula-lemak$li$,
      $li$Darurat: segera ke IGD, jangan menyetir sendiri; nomor 119$li$
  ])));
END $doblk$;

-- EXP-KES-138: Diabetes: Pahami dan Kendalikan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0002-4000-8000-000000000002', 'EXP-KES-138', 'b8888888-8888-8888-8888-888888888888', 'Diabetes: Pahami dan Kendalikan', 'diabetes-pahami-kendalikan', 'Diabetes tipe 1 vs 2, gejala, gula darah normal, dan pola hidup untuk penderita.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-138';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Diabetes = gula darah tinggi kronis. Tipe 1: pankreas tidak memproduksi insulin (butuh suntik). Tipe 2: insulin tidak efektif (terkait gaya hidup). Gejala: sering haus, sering kencing, lemas, luka sulit sembuh. Gula puasa normal <100 mg/dL.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batasi gula tambahan, nasi putih berlebih, minuman manis$li$,
      $li$Olahraga rutin menurunkan gula darah$li$,
      $li$Cek gula berkala; minum obat sesuai resep$li$,
      $li$Rawat kaki (luka kecil bisa serius pada diabetesi)$li$
  ])));
END $doblk$;

-- EXP-KES-139: Imunisasi: Jadwal dan Manfaat
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0003-4000-8000-000000000003', 'EXP-KES-139', 'b8888888-8888-8888-8888-888888888888', 'Imunisasi: Jadwal dan Manfaat', 'imunisasi-jadwal-manfaat', 'Imunisasi dasar lengkap untuk anak Indonesia: jadwal, manfaat, dan meluruskan hoaks vaksin.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-139';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$0-1 bulan: HB0; 2-4 bulan: BCG, DPT-HB-Hib, Polio$li$,
      $li$9 bulan: Campak; 18 bulan & kelas 1-2 SD: lanjutan$li$,
      $li$Manfaat: mencegah polio, campak, difteri, hepatitis — penyakit yang bisa cacat/mematikan$li$,
      $li$Hoaks: vaksin menyebabkan autisme SUDAH TERBUKTI SALAH (penelitian dicabut)$li$,
      $li$Gratis di posyandu/puskesmas$li$
  ])));
END $doblk$;

-- EXP-KES-140: Kesehatan Mata di Era Layar
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0004-4000-8000-000000000004', 'EXP-KES-140', 'b8888888-8888-8888-8888-888888888888', 'Kesehatan Mata di Era Layar', 'kesehatan-mata-era-layar', 'Mata lelah digital (digital eye strain): gejala, aturan 20-20-20, dan kapan perlu kacamata.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Aturan 20-20-20: tiap 20 menit, lihat 20 kaki (6 m) selama 20 detik$li$,
      $li$Jarak layar 50-70 cm, posisi sedikit di bawah mata$li$,
      $li$Kedipkan mata; ruangan tidak terlalu gelap dibanding layar$li$,
      $li$Tanda butuh periksa: sering sakit kepala, menyipitkan mata, buram$li$
  ])));
END $doblk$;

-- EXP-KES-141: Demam Berdarah: Kenali dan Cegah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0005-4000-8000-000000000005', 'EXP-KES-141', 'b8888888-8888-8888-8888-888888888888', 'Demam Berdarah: Kenali dan Cegah', 'dbd-kenali-cegah', 'DBD di Indonesia: gejala, fase kritis, 3M Plus, dan kapan harus ke rumah sakit.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gejala: demam tinggi mendadak 2-7 hari, nyeri sendi/otot, bintik merah$li$,
      $li$Fase kritis hari 3-7: demam turun TAPI waspada syok — ini fase berbahaya$li$,
      $li$3M Plus: Menguras, Menutup, Mendaur ulang + larvasida/ikan pemakan jentik$li$,
      $li$Segera ke RS: muntah terus, nyeri perut hebat, perdarahan, lemas$li$,
      $li$Nyamuk Aedes aktif pagi-sore; senang air bersih tergenang$li$
  ])));
END $doblk$;

-- EXP-KES-142: Kesehatan Gigi dan Mulut
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0006-4000-8000-000000000006', 'EXP-KES-142', 'b8888888-8888-8888-8888-888888888888', 'Kesehatan Gigi dan Mulut', 'kesehatan-gigi-mulut', 'Merawat gigi: teknik sikat yang benar, flossing, dan makanan yang merusak gigi.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Sikat 2x sehari 2 menit dengan pasta berfluoride; teknik: 45 derajat ke gusi$li$,
      $li$Jangan langsung sikat setelah makan asam (tunggu 30 menit)$li$,
      $li$Flossing/benang gigi untuk sela yang tak terjangkau sikat$li$,
      $li$Batasi minuman bersoda dan permen lengket$li$,
      $li$Kontrol 6 bulan sekali, meski tidak sakit$li$
  ])));
END $doblk$;

-- EXP-KES-143: Anemia: Kurang Darah
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0007-4000-8000-000000000007', 'EXP-KES-143', 'b8888888-8888-8888-8888-888888888888', 'Anemia: Kurang Darah', 'anemia-kurang-darah', 'Anemia defisiensi besi yang umum di Indonesia: gejala 5L, makanan sumber zat besi, dan tablet tambah darah.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Gejala 5L: Lemah, Letih, Lesu, Lunglai (pucat). Penyebab tersering: kurang zat besi. Sumber: hati ayam, daging merah, bayam, kacang-kacangan. Vitamin C membantu penyerapan zat besi; teh/kopi menghambat (jangan diminum bersamaan). Remaja putri dianjurkan tablet tambah darah seminggu sekali.$txt$));
END $doblk$;

-- EXP-KES-144: Hipertensi: Si Pembunuh Senyap
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0008-4000-8000-000000000008', 'EXP-KES-144', 'b8888888-8888-8888-8888-888888888888', 'Hipertensi: Si Pembunuh Senyap', 'hipertensi-pembunuh-senyap', 'Tekanan darah tinggi tanpa gejala: angka normal, penyebab, dan cara menurunkannya tanpa obat dulu.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Normal: <120/80; hipertensi: ≥140/90 (konsisten)$li$,
      $li$Sering tanpa gejala — cek rutin satu-satunya cara tahu$li$,
      $li$Kurangi garam (<1 sdt/hari), berhenti merokok, turunkan berat badan$li$,
      $li$DASH diet: banyak sayur-buah, rendah lemak jenuh$li$,
      $li$Jika diresepkan obat, JANGAN berhenti sendiri$li$
  ])));
END $doblk$;

-- EXP-KES-145: Kesehatan Reproduksi Remaja
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f4f4f4f4-0009-4000-8000-000000000009', 'EXP-KES-145', 'b8888888-8888-8888-8888-888888888888', 'Kesehatan Reproduksi Remaja', 'kesehatan-reproduksi-remaja', 'Edukasi kesehatan reproduksi untuk remaja: pubertas, menstruasi, dan menjaga kebersihan — dengan bahasa yang tepat.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KES-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Pubertas: perubahan fisik karena hormon (usia 9-14 perempuan, 10-15 laki-laki). Menstruasi: siklus 21-35 hari normal; ganti pembalut 4-6 jam sekali. Mimpi basah pada laki-laki adalah normal. Jaga kebersihan area kewanitaan/kejantanan; hindari sabun berpewangi kuat.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Jika ada yang memaksamu melakukan hal yang tidak nyaman terkait tubuhmu, itu salah — ceritakan ke orang dewasa terpercaya. Kamu berhak atas tubuhmu.$txt$));
END $doblk$;
