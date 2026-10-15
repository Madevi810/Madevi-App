-- Artikel batch 7 Madevi — 2026-10-13
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a

-- ============ 1. TUT-OTOMOTIF-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'TUT-OTOMOTIF-001', 'b4444444-4444-4444-4444-444444444444',
'Motor Mogok: Diagnosis Cepat di Jalan', 'motor-mogok-diagnosis-cepat-di-jalan',
'Panduan diagnosis cepat motor mogok di jalan: cek bensin, busi, aki, dan kelistrikan dalam 10 menit.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Motor Tiba-tiba Mogok di Jalan$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'PARAGRAPH', 2, jsonb_build_object('text', $$Motor yang sedang melaju tiba-tiba mati dan tidak bisa distarter. Panik di pinggir jalan tanpa bengkel terdekat adalah situasi yang harus ditangani dengan diagnosis cepat dan sistematis.$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Tiga Syarat Mesin Hidup$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'PARAGRAPH', 4, jsonb_build_object('text', $$Mesin bensin butuh tiga hal: bahan bakar, pengapian (api busi), dan kompresi. Jika satu saja hilang, mesin mati. Diagnosis berarti memeriksa ketiganya satu per satu dari yang paling mudah.$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kunci busi (biasanya ada di toolkit bawaan motor)$$, $$Obeng plus/minus$$, $$Kain lap$$, $$Bensin cadangan 1 liter (jika memungkinkan)$$])),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 7, jsonb_build_object('text', $$Langkah Diagnosis (Urut)$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Cek bensin: goyang tangki, dengarkan suara bensin. Tangki kosong adalah penyebab nomor satu.$$ , $$2. Cek keran bensin: pastikan posisi ON, bukan OFF atau RES.$$ , $$3. Cek busi: lepas cop busi, tempelkan ke bodi mesin, starter — lihat ada percikan api atau tidak. Tidak ada api = masalah pengapian.$$ , $$4. Cek aki: lampu indikator redup dan starter lemah = aki drop. Coba starter kaki (engkol) jika ada.$$ , $$5. Cek sekring: sekring putus mematikan kelistrikan total. Ganti dengan cadangan.$$])),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan bongkar karburator atau injektor di pinggir jalan jika tidak paham — risiko salah pasang lebih besar. Jangan paksa starter elektrik berulang-ulang saat aki lemah; bisa merusak dinamo starter.$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '7a1f3c2e-8b4d-4e5f-a6c7-d8e9f0a1b2c3', 'PARAGRAPH', 12, jsonb_build_object('text', $$70% motor mogok di jalan disebabkan bensin habis, busi kotor/mati, atau aki drop — ketiganya bisa ditangani sendiri dalam 10 menit. Jika semua cek normal tapi tetap mogok, kemungkinan CDI/koil atau kompresi bocor: dorong ke bengkel terdekat, jangan dipaksa jalan.$$));

-- ============ 2. TUT-KOMPUTER-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'TUT-KOMPUTER-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Cara Install Ulang Windows 11 yang Benar', 'cara-install-ulang-windows-11-yang-benar',
'Panduan install ulang Windows 11 dari awal: backup, bootable USB, partisi, hingga driver dan aktivasi.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Windows Rusak Parah / Ingin Mulai dari Nol$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'PARAGRAPH', 2, jsonb_build_object('text', $$Windows sering blue screen, terkena virus bandel, atau melambat tidak tertolong. Install ulang bersih (clean install) adalah solusi paling tuntas — tapi salah langkah bisa menghilangkan data penting selamanya.$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Clean Install$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'PARAGRAPH', 4, jsonb_build_object('text', $$Clean install menghapus seluruh partisi sistem dan memasang Windows baru dari nol. Berbeda dengan "reset", cara ini benar-benar menghilangkan sisa virus, driver rusak, dan file sampah. Konsekuensinya: semua data di drive C hilang.$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Flashdisk 8 GB atau lebih$$, $$Komputer lain untuk membuat bootable$$, $$Koneksi internet$$, $$Catatan lisensi Windows (jika punya)$$, $$Backup data penting ke drive D / harddisk eksternal$$])),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 7, jsonb_build_object('text', $$Langkah Install Ulang$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. BACKUP DULU: pindahkan dokumen, foto, dan file penting dari drive C ke drive D atau eksternal. Cek folder Desktop, Documents, Downloads.$$ , $$2. Buat bootable: unduh Media Creation Tool dari situs resmi Microsoft, jalankan, pilih flashdisk sebagai target.$$ , $$3. Boot dari USB: restart, masuk BIOS/UEFI (biasanya F2/Del/F12), atur boot priority ke USB.$$ , $$4. Instalasi: pilih bahasa, klik Install Now, pilih "Custom", hapus partisi sistem lama (biasanya partisi 1-3), buat partisi baru di ruang kosong, lanjutkan.$$ , $$5. Setup awal: ikuti wizard, lewati login Microsoft jika ingin akun lokal (pilih opsi offline).$$ , $$6. Driver & update: sambungkan internet, jalankan Windows Update sampai selesai, lalu install driver VGA/chipset dari situs produsen.$$])),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'PARAGRAPH', 10, jsonb_build_object('text', $$Risiko terbesar: salah hapus partisi berisi data (drive D). Perhatikan ukuran partisi sebelum menghapus. Jangan matikan komputer saat instalasi berjalan. Unduh ISO hanya dari microsoft.com — ISO bajakan sering disusupi malware.$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '7b2e4d3f-9c5e-4f6a-b7d8-e9f0a1b2c3d4', 'PARAGRAPH', 12, jsonb_build_object('text', $$Total waktu: 1–2 jam termasuk update. Setelah selesai, install antivirus bawaan (Windows Defender sudah cukup), browser, dan aplikasi kerja. Aktivasi: jika sebelumnya Windows asli dan terhubung akun Microsoft, lisensi digital biasanya aktif otomatis.$$));

-- ============ 3. EXP-BIOLOGI2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'EXP-BIOLOGI2-001', 'c2222222-2222-2222-2222-222222222222',
'Sel: Unit Terkecil Kehidupan', 'sel-unit-terkecil-kehidupan',
'Mengenal sel: organel-organel penyusunnya dan perbedaan sel hewan dengan sel tumbuhan.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Sel?$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sel adalah unit struktural dan fungsional terkecil makhluk hidup. Teori sel menyatakan: semua makhluk hidup tersusun dari sel, sel adalah unit dasar kehidupan, dan semua sel berasal dari sel yang sudah ada sebelumnya (omnis cellula e cellula).$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'HEADING', 3, jsonb_build_object('text', $$Organel-organel Sel$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Membran sel: lapisan pembatas yang mengatur keluar-masuk zat (permeabel selektif).$$, $$Sitoplasma: cairan tempat organel melayang dan reaksi kimia berlangsung.$$, $$Nukleus (inti sel): pusat kendali berisi DNA; mengatur seluruh aktivitas sel.$$, $$Mitokondria: "pembangkit listrik" sel — menghasilkan energi ATP lewat respirasi.$$ , $$Ribosom: pabrik protein, menempel di retikulum endoplasma atau melayang bebas.$$ , $$Retikulum endoplasma: RE kasar (sintesis protein) dan RE halus (sintesis lipid).$$ , $$Badan Golgi: "kantor pos" sel — memodifikasi, mengemas, dan mengirim protein.$$ , $$Lisosom: kantong enzim pencerna untuk menghancurkan zat asing dan organel rusak.$$])),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'HEADING', 5, jsonb_build_object('text', $$Perbedaan Sel Hewan dan Sel Tumbuhan$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Dinding sel: hanya tumbuhan (dari selulosa) — memberi bentuk kaku; hewan tidak punya.$$ , $$Kloroplas: hanya tumbuhan — tempat fotosintesis, berisi klorofil hijau.$$ , $$Vakuola: tumbuhan punya vakuola besar di tengah; hewan punya vakuola kecil-kecil.$$ , $$Sentriol: hanya hewan — berperan dalam pembelahan sel.$$ , $$Bentuk: sel tumbuhan cenderung kotak/kaku, sel hewan bulat/lentur.$$])),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'HEADING', 7, jsonb_build_object('text', $$Prokariotik vs Eukariotik$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'PARAGRAPH', 8, jsonb_build_object('text', $$Sel prokariotik (bakteri) tidak punya membran inti — DNA melayang bebas di sitoplasma, dan tidak punya organel bermembran. Sel eukariotik (hewan, tumbuhan, jamur) punya nukleus sejati dan organel lengkap. Ukuran bakteri hanya 1–10 mikrometer, jauh lebih kecil dari sel eukariotik.$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'HEADING', 9, jsonb_build_object('text', $$Mengapa Sel Penting Dipelajari?$$)),
(gen_random_uuid(), '7c3f5e4a-0d6f-4a7b-c8e9-f0a1b2c3d4e5', 'PARAGRAPH', 10, jsonb_build_object('text', $$Semua penyakit bermula di level sel: kanker adalah sel yang membelah tak terkendali, diabetes berkaitan dengan sel pankreas, infeksi adalah sel asing menyerang. Memahami sel adalah fondasi kedokteran, bioteknologi, dan seluruh ilmu kehidupan.$$));

-- ============ 4. EXP-FISIKA2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'EXP-FISIKA2-001', 'c3333333-3333-3333-3333-333333333333',
'Gelombang: Bunyi dan Cahaya', 'gelombang-bunyi-dan-cahaya',
'Memahami gelombang: sifat-sifatnya, gelombang bunyi, gelombang cahaya, dan rumusnya.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Gelombang?$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'PARAGRAPH', 2, jsonb_build_object('text', $$Gelombang adalah getaran yang merambat membawa energi tanpa memindahkan materi. Air yang dilempar batu: riaknya merambat, tapi airnya sendiri hanya naik-turun di tempat. Konsep kunci: panjang gelombang (λ), frekuensi (f, getaran per detik), periode (T), amplitudo, dan cepat rambat (v). Rumus fundamental: v = λ × f.$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'HEADING', 3, jsonb_build_object('text', $$Jenis-jenis Gelombang$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Berdasarkan medium: mekanik (butuh medium: bunyi, gempa) vs elektromagnetik (tanpa medium: cahaya, radio, sinar-X).$$, $$Berdasarkan arah: transversal (tegak lurus arah rambat: cahaya, tali) vs longitudinal (searah: bunyi, pegas).$$])),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'HEADING', 5, jsonb_build_object('text', $$Gelombang Bunyi$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'PARAGRAPH', 6, jsonb_build_object('text', $$Bunyi adalah gelombang longitudinal mekanik — butuh medium (udara, air, zat padat) dan tidak merambat di ruang hampa. Cepat rambat di udara ≈ 340 m/s. Frekuensi menentukan nada: 20 Hz–20.000 Hz terdengar manusia (audiosonik), di bawahnya infrasonik (gajah, gempa), di atasnya ultrasonik (kelelawar, USG medis). Amplitudo menentukan keras-lemahnya bunyi (desibel).$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'HEADING', 7, jsonb_build_object('text', $$Gelombang Cahaya$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'PARAGRAPH', 8, jsonb_build_object('text', $$Cahaya adalah gelombang elektromagnetik transversal yang merambat tanpa medium dengan kecepatan 300.000 km/s (c). Spektrum tampak hanya sebagian kecil: merah–jingga–kuning–hijau–biru–nila–ungu. Di luar itu ada inframerah, ultraviolet, sinar-X, dan gamma. Sifat cahaya: dapat dipantulkan (cermin), dibiaskan (lensa, pelangi), dan terdifraksi.$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'HEADING', 9, jsonb_build_object('text', $$Contoh Hitungan$$)),
(gen_random_uuid(), '7d4a6f5b-1e7a-4b8c-d9f0-a1b2c3d4e5f6', 'PARAGRAPH', 10, jsonb_build_object('text', $$Petir terlihat, 3 detik kemudian guntur terdengar. Jarak petir = v × t = 340 × 3 = 1.020 meter ≈ 1 km. Aturan praktis: tiap 3 detik jeda ≈ 1 km jarak. Untuk cahaya: gelombang radio FM 100 MHz memiliki panjang gelombang λ = c/f = 300.000.000/100.000.000 = 3 meter.$$));

-- ============ 5. SCH-SMA-KIMIA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'SCH-SMA-KIMIA-001', 'd5555555-5555-5555-5555-555555555555',
'Kimia Kelas 10: Struktur Atom', 'kimia-kelas-10-struktur-atom',
'Materi kimia kelas 10: partikel penyusun atom, nomor atom dan massa, isotop, konfigurasi elektron.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu dapat: (1) menyebutkan tiga partikel penyusun atom beserta muatan dan massanya, (2) menentukan jumlah proton, neutron, dan elektron dari notasi atom, (3) menjelaskan isotop, isobar, dan isoton, (4) menuliskan konfigurasi elektron sederhana.$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 3, jsonb_build_object('text', $$Partikel Penyusun Atom$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Proton (p): bermuatan positif (+1), massa 1 sma, terletak di inti atom. Jumlah proton = nomor atom (Z), menentukan identitas unsur.$$ , $$Neutron (n): tidak bermuatan (netral), massa 1 sma, terletak di inti atom. Berfungsi sebagai "lem" penstabil inti.$$ , $$Elektron (e): bermuatan negatif (−1), massa sangat kecil (≈ 1/1836 sma, dianggap 0), mengelilingi inti pada kulit-kulit atom.$$])),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 5, jsonb_build_object('text', $$Nomor Atom dan Nomor Massa$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'PARAGRAPH', 6, jsonb_build_object('text', $$Notasi atom ditulis: ^A_Z X. Z = nomor atom = jumlah proton. A = nomor massa = proton + neutron. Contoh: ^23_11 Na berarti natrium punya 11 proton, 12 neutron (23−11), dan 11 elektron (atom netral). Untuk ion: Na+ berarti melepas 1 elektron → elektron tinggal 10.$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 7, jsonb_build_object('text', $$Isotop, Isobar, Isoton$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Isotop: nomor atom SAMA, nomor massa BEDA (jumlah neutron beda). Contoh: karbon-12 dan karbon-14.$$ , $$Isobar: nomor massa SAMA, nomor atom BEDA. Contoh: ^40_18 Ar dan ^40_20 Ca.$$ , $$Isoton: jumlah neutron SAMA. Contoh: ^13_6 C (7 neutron) dan ^14_7 N (7 neutron).$$])),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 9, jsonb_build_object('text', $$Konfigurasi Elektron$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'PARAGRAPH', 10, jsonb_build_object('text', $$Elektron mengisi kulit atom dari yang terdekat dengan inti: kulit K (maks 2), L (maks 8), M (maks 18), N (maks 32) mengikuti rumus 2n². Contoh: oksigen (Z=8) → 2, 6 artinya 2 elektron di kulit K dan 6 di kulit L. Elektron valensi (kulit terluar) menentukan sifat kimia unsur.$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '7e5b7a6c-2f8b-4c9d-e0a1-b2c3d4e5f6a7', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Atom X memiliki 15 proton dan 16 neutron. Tuliskan notasi atomnya dan tentukan jumlah elektronnya.$$ , $$2. Manakah yang merupakan isotop: (a) ^35_17 Cl dan ^37_17 Cl, (b) ^40_18 Ar dan ^40_20 Ca? Jelaskan.$$ , $$3. Tuliskan konfigurasi elektron unsur kalsium (Z = 20) dan tentukan elektron valensinya.$$ , $$Kunci: 1. ^31_15 X, 15 elektron. 2. (a) isotop (Z sama), (b) isobar. 3. 2, 8, 8, 2 → elektron valensi = 2.$$]));

-- ============ 6. SCH-SD-BIN2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'SCH-SD-BIN2-001', 'd1000002-0000-0000-0000-000000000002',
'Bahasa Indonesia Kelas 2: Kalimat Sederhana', 'bahasa-indonesia-kelas-2-kalimat-sederhana',
'Materi bahasa Indonesia kelas 2 SD: mengenal kalimat, huruf kapital, tanda titik, dan menyusun kalimat sederhana.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu dapat: (1) menjelaskan apa itu kalimat, (2) menulis kalimat dengan huruf kapital di awal, (3) memakai tanda titik di akhir kalimat, (4) menyusun kata acak menjadi kalimat yang benar.$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Kalimat?$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kalimat adalah kumpulan kata yang memiliki arti lengkap. Coba bandingkan: "meja di buku" (belum jelas) dengan "Buku ada di atas meja." (jelas!). Kalimat yang baik diawali huruf kapital dan diakhiri tanda titik (.), tanda tanya (?), atau tanda seru (!).$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 5, jsonb_build_object('text', $$Huruf Kapital$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Awal kalimat: "Saya pergi ke sekolah."$$, $$Nama orang: "Budi", "Siti"$$, $$Nama hari dan bulan: "Senin", "Januari"$$, $$Nama tempat: "Jakarta", "Sungai Musi"$$])),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 7, jsonb_build_object('text', $$Menyusun Kalimat$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'PARAGRAPH', 8, jsonb_build_object('text', $$Urutkan kata-kata acak menjadi kalimat: "kucing – mengejar – tikus" → "Kucing mengejar tikus." Pola paling mudah: SIAPA (subjek) + MELAKUKAN APA (kata kerja) + APA/SIAPA (objek). Contoh: "Ibu (siapa) memasak (melakukan apa) nasi goreng (apa).".$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 9, jsonb_build_object('text', $$Contoh Kalimat$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'LIST', 10, jsonb_build_object('items', ARRAY[$$"Ayah membaca koran di teras."$$, $$"Adik bermain bola bersama teman."$$, $$"Burung terbang tinggi di langit."$$, $$"Kami belajar bersama di kelas."$$])),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '7f6c8b7d-3a9c-4d0e-f1b2-c3d4e5f6a7b8', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Susunlah kata acak ini: "siswa – rajin – belajar"$$, $$2. Perbaiki kalimat ini: "siti pergi ke pasar."$$, $$3. Buatlah satu kalimat tentang kegiatanmu pagi ini!$$, $$Kunci: 1. "Siswa rajin belajar." 2. "Siti pergi ke pasar." (S kapital). 3. Contoh: "Saya sarapan roti pagi ini."$$]));
