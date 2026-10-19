-- Batch 138: 9 artikel Keuangan tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-KEU-138: Reksa Dana untuk Pemula
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0001-4000-8000-000000000001', 'EXP-KEU-138', 'b8888888-8888-8888-8888-888888888888', 'Reksa Dana untuk Pemula', 'reksa-dana-pemula', 'Jenis reksa dana dari pasar uang hingga saham, cara beli, dan biaya yang perlu diketahui.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-138';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pasar uang: paling aman, return ~4-5%/tahun, likuid$li$,
      $li$Pendapatan tetap (obligasi): sedang$li$,
      $li$Campuran: saham + obligasi$li$,
      $li$Saham: paling agresif, untuk jangka >5 tahun$li$,
      $li$Beli via aplikasi APERD terdaftar OJK; mulai Rp10rb; cek expense ratio$li$
  ])));
END $doblk$;

-- EXP-KEU-139: Emas: Investasi Klasik
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0002-4000-8000-000000000002', 'EXP-KEU-139', 'b8888888-8888-8888-8888-888888888888', 'Emas: Investasi Klasik', 'emas-investasi-klasik', 'Emas batangan vs digital vs perhiasan: spread, tempat beli aman, dan strategi menabung emas.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-139';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Batangan (Antam/UBS): spread kecil, untuk investasi$li$,
      $li$Digital: mulai Rp5rb, praktis, tapi cek biaya cetak saat tarik fisik$li$,
      $li$Perhiasan: spread besar (ongkos buat), lebih untuk pakai$li$,
      $li$Beli di butik resmi/pegadaian; simpan sertifikat; emas cocok jangka panjang 5+ tahun$li$
  ])));
END $doblk$;

-- EXP-KEU-140: Kartu Kredit: Pedang Bermata Dua
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0003-4000-8000-000000000003', 'EXP-KEU-140', 'b8888888-8888-8888-8888-888888888888', 'Kartu Kredit: Pedang Bermata Dua', 'kartu-kredit-pedang-bermata-dua', 'Cara kerja kartu kredit, bunga, dan aturan main agar untung bukan buntung.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Bayar PENUH tiap bulan = bebas bunga + dapat poin/cashback$li$,
      $li$Bayar minimum = bunga ~2%/bulan (±24%/tahun) — jebakan$li$,
      $li$Tarik tunai: kena biaya + bunga langsung, hindari$li$,
      $li$Manfaatkan promo yang memang kamu butuhkan; jangan belanja demi promo$li$
  ])));
END $doblk$;

-- EXP-KEU-141: Asuransi: Kapan Perlu, Kapan Tidak
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0004-4000-8000-000000000004', 'EXP-KEU-141', 'b8888888-8888-8888-8888-888888888888', 'Asuransi: Kapan Perlu, Kapan Tidak', 'asuransi-kapan-perlu', 'Prinsip asuransi: lindungi dari risiko besar yang tak tertahankan — kesehatan, jiwa (jika ada tanggungan), kendaraan.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Wajib pertimbangkan: kesehatan (di luar BPJS untuk kelas lebih baik), jiwa jika ada yang dinafkahi$li$,
      $li$BPJS Kesehatan: dasar yang wajib dimiliki WNI$li$,
      $li$Hindari: asuransi yang digabung investasi (unit link) jika tujuanmu proteksi murni — biayanya tinggi$li$,
      $li$Baca pengecualian polis; klaim ditolak biasanya karena ini$li$
  ])));
END $doblk$;

-- EXP-KEU-142: Side Hustle untuk Karyawan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0005-4000-8000-000000000005', 'EXP-KEU-142', 'b8888888-8888-8888-8888-888888888888', 'Side Hustle untuk Karyawan', 'side-hustle-karyawan', 'Penghasilan tambahan yang realistis: freelance skill, jualan online, konten — plus manajemen waktu.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Jual skill: desain, tulis, terjemah, coding (Sribulancer, Projects.co.id)$li$,
      $li$Jualan: reseller, PO makanan, produk digital$li$,
      $li$Konten: butuh konsistensi 6-12 bulan sebelum menghasilkan$li$,
      $li$Aturan: jangan ganggu pekerjaan utama; pisahkan keuangan; bayar pajak$li$
  ])));
END $doblk$;

-- EXP-KEU-143: Menabung untuk Nikah: Rencana Realistis
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0006-4000-8000-000000000006', 'EXP-KEU-143', 'b8888888-8888-8888-8888-888888888888', 'Menabung untuk Nikah: Rencana Realistis', 'menabung-untuk-nikah', 'Merencanakan biaya nikah tanpa utang: hitung kebutuhan, strategi menabung, dan prioritas.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Rumus: (target biaya - tabungan kini) / bulan tersisa = tabungan per bulan. Contoh: butuh Rp50 jt, punya Rp10 jt, waktu 20 bulan → Rp2 jt/bulan. Tips: akad sederhana (KUA) + resepsi intim jauh lebih murah; cincin emas bisa dibeli bertahap (kunci harga); hindari utang konsumtif untuk pesta sehari.$txt$));
END $doblk$;

-- EXP-KEU-144: Waspada Pinjol Ilegal dan Investasi Bodong
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0007-4000-8000-000000000007', 'EXP-KEU-144', 'b8888888-8888-8888-8888-888888888888', 'Waspada Pinjol Ilegal dan Investasi Bodong', 'waspada-pinjol-ilegal', 'Ciri pinjol ilegal dan investasi bodong, cara cek legalitas di OJK, dan langkah jika terjerat.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Pinjol ilegal: bunga tak masuk akal, teror kontak HP, sebar data — cek daftar OJK sebelum pinjam$li$,
      $li$Investasi bodong: janji return tetap tinggi, skema member-get-member, tidak ada izin$li$,
      $li$Cek: ojk.go.id / kontak 157; waspada 2L (Legal & Logis)$li$,
      $li$Terjerat: jangan gali lubang baru; lapor ke polisi/OJK; konsultasi LBH$li$
  ])));
END $doblk$;

-- EXP-KEU-145: Dana Pensiun Sejak Muda
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0008-4000-8000-000000000008', 'EXP-KEU-145', 'b8888888-8888-8888-8888-888888888888', 'Dana Pensiun Sejak Muda', 'dana-pensiun-sejak-muda', 'Kekuatan bunga berbunga: mulai Rp500rb/bulan di usia 25 vs 35 — bedanya puluhan juta.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Bunga berbunga: return ikut diinvestasikan sehingga tumbuh eksponensial. Ilustrasi (return 10%/tahun): nabung Rp500rb/bulan sejak 25 → di usia 55 terkumpul ~Rp1,1 M. Mulai di 35 → ~Rp380 jt. Selisih 10 tahun = 3x lipat. Opsi: DPLK, reksa dana saham, SBN.$txt$));
END $doblk$;

-- EXP-KEU-146: Membaca Slip Gaji dan THR
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f5f5f5f5-0009-4000-8000-000000000009', 'EXP-KEU-146', 'b8888888-8888-8888-8888-888888888888', 'Membaca Slip Gaji dan THR', 'membaca-slip-gaji-thr', 'Komponen gaji: pokok, tunjangan, potongan — plus aturan THR keagamaan Indonesia.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KEU-146';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Gaji pokok + tunjangan tetap = dasar perhitungan lembur & THR$li$,
      $li$Potongan: PPh 21, BPJS Kesehatan (1%), BPJS Ketenagakerjaan (2% JHT + 1% JP)$li$,
      $li$THR: wajib bagi yang kerja ≥1 bulan; <12 bulan = proporsional; dibayar H-7 hari raya$li$,
      $li$Take home pay = bruto - potongan; pastikan sesuai kontrak$li$
  ])));
END $doblk$;
