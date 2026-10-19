-- Batch 136: 10 artikel Teknologi tambahan (idempoten)
-- Dibuat: 2026-10-19 (Fase 4, Explore)

-- EXP-TEK-136: Cloud: Menyimpan Data di Internet
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0001-4000-8000-000000000001', 'EXP-TEK-136', 'b8888888-8888-8888-8888-888888888888', 'Cloud: Menyimpan Data di Internet', 'cloud-menyimpan-data-internet', 'Apa itu cloud storage: cara kerja, Google Drive vs lokal, keamanan, dan tips mengelola.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-136';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Cloud = komputer orang lain yang disewakan. File kamu disimpan di data center, bisa diakses dari mana saja. Kelebihan: tidak hilang jika HP rusak, hemat memori. Kekurangan: butuh internet, privasi tergantung penyedia.$txt$));
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 1, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Aktifkan backup otomatis foto (Google Photos)$li$,
      $li$File penting: simpan di 2 tempat (cloud + lokal)$li$,
      $li$Aktifkan 2FA di akun cloud$li$
  ])));
END $doblk$;

-- EXP-TEK-137: WiFi Lambat? Diagnosis dan Solusi
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0002-4000-8000-000000000002', 'EXP-TEK-137', 'b8888888-8888-8888-8888-888888888888', 'WiFi Lambat? Diagnosis dan Solusi', 'wifi-lambat-diagnosis-solusi', 'Mengapa WiFi lambat dan cara mempercepat: posisi router, interferensi, bandwidth, dan kapan ganti paket.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-137';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Posisi router: tengah rumah, tinggi, jauh dari tembok tebal dan microwave$li$,
      $li$Restart router seminggu sekali$li$,
      $li$Cek pengguna: tetangga nebeng? Ganti password berkala$li$,
      $li$Pita 5 GHz lebih cepat tapi jangkauan pendek; 2,4 GHz sebaliknya$li$,
      $li$Tes kecepatan (speedtest) di dekat router vs di kamar — beda jauh = masalah jangkauan$li$
  ])));
END $doblk$;

-- EXP-TEK-138: Backup Data: 3-2-1 Rule
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0003-4000-8000-000000000003', 'EXP-TEK-138', 'b8888888-8888-8888-8888-888888888888', 'Backup Data: 3-2-1 Rule', 'backup-data-321-rule', 'Aturan backup 3-2-1: 3 salinan, 2 media berbeda, 1 di luar lokasi — agar foto dan dokumen tak pernah hilang.', 'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-138';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Aturan 3-2-1: 3 salinan data, di 2 media berbeda (misal HP + cloud), 1 salinan di lokasi berbeda (cloud/hard disk di rumah orang tua). Untuk HP: aktifkan backup Google (Android) atau iCloud (iPhone) + backup foto ke Google Photos.$txt$));
END $doblk$;

-- EXP-TEK-139: E-Wallet dan QRIS: Cara Kerja
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0004-4000-8000-000000000004', 'EXP-TEK-139', 'b8888888-8888-8888-8888-888888888888', 'E-Wallet dan QRIS: Cara Kerja', 'e-wallet-qris-cara-kerja', 'Dompet digital dan QRIS: cara kerja, keamanan, dan tips menghindari penipuan.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-139';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$QRIS = standar QR nasional dari Bank Indonesia: satu QR untuk semua e-wallet dan m-banking. Cara kerja: scan → masukkan nominal → konfirmasi PIN/biometrik → dana pindah real-time. Keamanan: PIN tidak boleh dibagi, waspada QR palsu yang ditempel di atas QR asli (cek nama merchant sebelum bayar).$txt$));
END $doblk$;

-- EXP-TEK-140: Memilih Laptop untuk Kebutuhanmu
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0005-4000-8000-000000000005', 'EXP-TEK-140', 'b8888888-8888-8888-8888-888888888888', 'Memilih Laptop untuk Kebutuhanmu', 'memilih-laptop-kebutuhan', 'Panduan beli laptop: sesuaikan spesifikasi dengan kebutuhan (kantor, kuliah, desain, gaming) tanpa overspend.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-140';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Kantor/kuliah: i3/Ryzen 3, RAM 8GB, SSD 256GB — cukup$li$,
      $li$Desain/video: i5/Ryzen 5+, RAM 16GB, GPU diskrit$li$,
      $li$Gaming: i7/Ryzen 7, RTX, RAM 16GB+$li$,
      $li$Prioritas: SSD wajib (jangan beli HDD saja), RAM bisa upgrade belakangan$li$,
      $li$Cek garansi resmi Indonesia (bukan distributor)$li$
  ])));
END $doblk$;

-- EXP-TEK-141: Jejak Digital: Apa yang Internet Tahu Tentangmu
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0006-4000-8000-000000000006', 'EXP-TEK-141', 'b8888888-8888-8888-8888-888888888888', 'Jejak Digital: Apa yang Internet Tahu Tentangmu', 'jejak-digital-internet', 'Setiap klik meninggalkan jejak: cara data dikumpulkan, risikonya, dan cara mengendalikan privasi.', 'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-141';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Jejak digital: riwayat pencarian, lokasi, like, bahkan berapa lama kamu menatap satu postingan. Data ini dipakai untuk iklan tertarget. Risiko: profiling, penipuan tertarget, dan data bocor. Kendalikan: cek pengaturan privasi tiap aplikasi, matikan riwayat lokasi jika tak perlu, pikir dua kali sebelum posting (internet tidak lupa).$txt$));
END $doblk$;

-- EXP-TEK-142: Gadget Second: Cara Beli Aman
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0007-4000-8000-000000000007', 'EXP-TEK-142', 'b8888888-8888-8888-8888-888888888888', 'Gadget Second: Cara Beli Aman', 'gadget-second-beli-aman', 'Checklist beli HP/laptop bekas: cek fisik, IMEI, baterai, dan trik menghindari barang curian.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-142';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Cek IMEI di kemenperin.go.id (terdaftar = aman sinyal)$li$,
      $li$Cek semua fungsi: kamera, speaker, mic, sensor, sidik jari$li$,
      $li$Baterai: cek battery health (iPhone) / accubattery (Android)$li$,
      $li$Minta reset pabrik di depanmu; pastikan tidak terkunci akun (iCloud/Google)$li$,
      $li$COD di tempat ramai; minta nota + fotokopi KTP penjual$li$
  ])));
END $doblk$;

-- EXP-TEK-143: Otomatisasi Rumah Sederhana (Smart Home Murah)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0008-4000-8000-000000000008', 'EXP-TEK-143', 'b8888888-8888-8888-8888-888888888888', 'Otomatisasi Rumah Sederhana', 'smart-home-murah-otomatisasi', 'Mulai smart home dengan budget kecil: colokan pintar, lampu pintar, dan skenario otomatis.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-143';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Mulai dari colokan pintar (Rp100rb-an): jadwalkan kipas/lampu$li$,
      $li$Lampu pintar: atur warna & jadwal via HP$li$,
      $li$Skenario: "pulang kerja" = lampu nyala + kipas nyala otomatis$li$,
      $li$Keamanan: ganti password default; pakai merek yang jelas$li$
  ])));
END $doblk$;

-- EXP-TEK-144: Membuat Password Manager Sendiri (Catatan Aman)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0009-4000-8000-000000000009', 'EXP-TEK-144', 'b8888888-8888-8888-8888-888888888888', 'Mengelola Banyak Password dengan Aman', 'mengelola-password-aman', 'Strategi password unik tiap akun tanpa menghafal: password manager, frasa sandi, dan 2FA.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-144';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'PARAGRAPH', 0, jsonb_build_object('text', $txt$Solusi: password manager (Bitwarden gratis, open source) — ingat 1 master password, sisanya disimpan terenkripsi. Alternatif: frasa sandi ("Saya suka makan nasi goreng!") + variasi per situs. Jangan simpan password di notes HP tanpa kunci atau di browser tanpa master password.$txt$));
END $doblk$;

-- EXP-TEK-145: Memahami Notifikasi: Fokus di Era Gangguan
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, status, attribution_type, created_by, updated_by)
VALUES ('f3f3f3f3-0010-4000-8000-000000000010', 'EXP-TEK-145', 'b8888888-8888-8888-8888-888888888888', 'Fokus di Era Gangguan Digital', 'fokus-era-gangguan-digital', 'Mengelola notifikasi dan adiksi HP: mode fokus, digital wellbeing, dan teknik deep work.', 'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT', 'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;
DO $doblk$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-TEK-145';
  IF v_id IS NULL THEN RAISE EXCEPTION 'article missing'; END IF;
  DELETE FROM madevi.article_blocks WHERE article_id = v_id;
  INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES (gen_random_uuid(), v_id, 'LIST', 0, jsonb_build_object('items', to_jsonb(ARRAY[
      $li$Matikan notifikasi non-esensial (cukup WA/telepon penting)$li$,
      $li$Mode fokus/jangan ganggu saat kerja/belajar$li$,
      $li$HP di luar kamar saat tidur$li$,
      $li$Teknik Pomodoro: 25 menit fokus, 5 menit istirahat$li$,
      $li$Cek screen time mingguan — sadari polanya$li$
  ])));
END $doblk$;
