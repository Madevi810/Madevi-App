-- Artikel konten Madevi batch 22 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempoten: ON CONFLICT DO NOTHING

-- ============ 1. TUT-WIRAUSAHA-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000001-0000-4000-8000-000000000001', 'TUT-WIRAUSAHA-001', 'b3333333-3333-3333-3333-333333333333',
'Mulai Bisnis Online dari Nol: Panduan Praktis Pemula', 'mulai-bisnis-online-dari-nol',
'Panduan langkah demi langkah memulai bisnis online dengan modal kecil: dari menentukan produk sampai promosi pertama.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Ingin Punya Penghasilan Sendiri tapi Bingung Mulai dari Mana$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang ingin punya usaha sendiri agar tidak selalu bergantung pada gaji. Namun modal terbatas, takut rugi, dan tidak tahu cara jualan membuat niat itu berhenti di angan-angan. Kabar baiknya: bisnis online bisa dimulai dengan modal sangat kecil, bahkan dari kamar sendiri.$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Bisnis Online$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Bisnis online adalah kegiatan menjual produk atau jasa melalui internet — lewat marketplace, media sosial, atau website sendiri. Keunggulannya: tidak perlu sewa toko, buka 24 jam, dan pasarnya seluas jangkauan internet. Modelnya beragam: jual produk sendiri, reseller, dropshipper, atau jasa digital seperti desain dan penulisan.$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Modal yang Dibutuhkan$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$HP atau laptop dan koneksi internet yang stabil$$, $$Akun marketplace (Tokopedia, Shopee) dan media sosial untuk promosi$$, $$Modal awal Rp100 ribu – Rp1 juta (untuk stok perdana atau iklan kecil)$$, $$Rekening bank atau e-wallet untuk menerima pembayaran$$, $$Buku catatan atau aplikasi sederhana untuk pembukuan$$])),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memulai$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tentukan produk: pilih yang kamu pahami atau sukai, misal makanan ringan, aksesoris HP, atau jasa desain$$, $$2. Riset pasar: cek harga dan ulasan kompetitor di marketplace$$, $$3. Pilih platform: mulai dari satu marketplace + satu media sosial$$, $$4. Siapkan katalog: foto asli yang jelas dan deskripsi jujur$$, $$5. Tentukan harga: hitung modal + ongkir + margin keuntungan 20–30%$$, $$6. Promosi organik: posting rutin, manfaatkan fitur live dan voucher$$, $$7. Layani pelanggan dengan cepat dan ramah — kecepatan balas chat menaikkan rating$$, $$8. Catat semua pemasukan dan pengeluaran sejak hari pertama$$])),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko yang Perlu Diwaspadai$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Waspadai penipuan (pembeli palsu, bukti transfer editan), stok menumpuk karena salah prediksi, perang harga yang menggerus margin, dan kelelahan karena mengurus semuanya sendirian. Jangan berutang besar di awal — gunakan modal yang siap hilang.$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Mulai Kecil, Validasi, Konsisten$$)),
(gen_random_uuid(), 'e5000001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Mulai dari 5–10 produk dan uji pasar selama satu bulan. Jika ada yang laku, tambah stoknya; jika sepi, ganti produk atau perbaiki foto dan deskripsi. Bisnis online yang bertahan adalah yang konsisten dievaluasi, bukan yang modalnya paling besar.$$))
ON CONFLICT DO NOTHING;

-- ============ 2. TUT-MEDITASI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000002-0000-4000-8000-000000000002', 'TUT-MEDITASI-001', 'b5555555-5555-5555-5555-555555555555',
'Meditasi untuk Pemula: Cukup 10 Menit Sehari', 'meditasi-untuk-pemula-10-menit-sehari',
'Panduan meditasi sederhana untuk pemula: teknik pernapasan 10 menit sehari untuk pikiran lebih tenang dan fokus.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Pikiran Berisik dan Sulit Fokus$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Pikiran terus memutar ulang kejadian kemarin dan mengkhawatirkan hari esok. Sulit fokus bekerja, mudah tersulut emosi, dan tidur tidak nyenyak. Ini tanda pikiran butuh dilatih untuk berhenti sejenak — dan meditasi adalah latihannya.$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Apa Itu Meditasi$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Meditasi adalah latihan melatih perhatian agar tetap pada saat ini, biasanya dengan berfokus pada napas. Kesalahpahaman terbesar: meditasi BUKAN mengosongkan pikiran. Pikiran yang melayang itu normal; latihannya justru menyadari saat pikiran melayang, lalu dengan lembut mengembalikannya. Penelitian menunjukkan latihan rutin dapat menurunkan stres dan memperbaiki fokus.$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Yang Dibutuhkan$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Tempat yang relatif tenang selama 10 menit$$, $$Timer (cukup pakai HP)$$, $$Posisi duduk yang nyaman — kursi atau lantai beralaskan bantal$$, $$Pakaian longgar agar napas lega$$])),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Meditasi 10 Menit$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Duduk dengan punggung tegak tapi rileks, tangan di paha$$, $$2. Pejamkan mata dan atur timer 10 menit$$, $$3. Tarik napas perlahan lewat hidung, rasakan udara masuk, lalu embuskan perlahan$$, $$4. Fokuskan perhatian pada sensasi napas di hidung atau naik-turunnya perut$$, $$5. Saat pikiran melayang ke hal lain, sadari tanpa menghakimi, lalu kembalikan perhatian ke napas$$, $$6. Saat timer berbunyi, buka mata perlahan dan duduk diam sejenak sebelum beraktivitas$$])),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Kesalahpahaman$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Frustrasi di minggu pertama karena merasa "gagal fokus" adalah hal paling umum — padahal menyadari pikiran melayang justru tanda latihan berhasil. Atur postur agar tidak pegal. Penting: meditasi adalah latihan kesehatan mental umum, BUKAN pengganti bantuan profesional untuk depresi, trauma, atau gangguan kecemasan berat — untuk itu, konsultasikan ke psikolog atau psikiater.$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian: Konsistensi Mengalahkan Durasi$$)),
(gen_random_uuid(), 'e5000002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Sepuluh menit setiap hari jauh lebih efektif daripada satu jam seminggu sekali. Pasang pengingat di jam yang sama tiap hari — misal setelah bangun tidur — agar menjadi kebiasaan. Setelah 2–3 minggu rutin, banyak orang merasakan tidur lebih nyenyak dan tidak mudah tersulut emosi.$$))
ON CONFLICT DO NOTHING;
-- ============ 3. EXP-KOSMOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000003-0000-4000-8000-000000000003', 'EXP-KOSMOLOGI-001', 'c5000002-0000-0000-0000-000000000002',
'Big Bang: Awal Mula Alam Semesta', 'big-bang-awal-mula-alam-semesta',
'Teori Big Bang menjelaskan asal-usul alam semesta 13,8 miliar tahun lalu beserta tiga bukti ilmiah terkuatnya.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Pengertian: Apa Itu Big Bang$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Teori Big Bang menyatakan bahwa sekitar 13,8 miliar tahun lalu, seluruh materi dan energi alam semesta terkonsentrasi dalam satu titik yang sangat panas dan padat, lalu mengembang dengan cepat. Nama "Big Bang" sebenarnya misleading — ini bukan ledakan di dalam ruang, melainkan pengembangan ruang itu sendiri. Semua yang ada — galaksi, bintang, planet, termasuk kita — berasal dari peristiwa ini.$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Bukti 1: Pergeseran Merah Galaksi$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada 1929, Edwin Hubble menemukan bahwa galaksi-galaksi jauh bergerak menjauhi kita, dan semakin jauh semakin cepat. Ini seperti titik-titik di permukaan balon yang mengembang — semuanya saling menjauh. Jika alam semesta mengembang sekarang, maka di masa lalu ia pasti lebih kecil dan rapat: persis seperti prediksi Big Bang.$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Bukti 2: Radiasi Latar Kosmik$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pada 1965, Penzias dan Wilson mendeteksi sisa panas Big Bang yang masih memenuhi seluruh langit: radiasi latar gelombang mikro kosmik (CMB) bersuhu 2,7 Kelvin. Ini adalah "foto bayi" alam semesta saat berumur 380.000 tahun — cahaya tertua yang bisa kita amati.$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Bukti 3: Kelimpahan Unsur Ringan$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Alam semesta terdiri dari sekitar 75% hidrogen dan 25% helium — persis seperti yang diprediksi perhitungan nukleosintesis Big Bang pada tiga menit pertama. Kecocokan angka ini dari teori dan pengamatan adalah salah satu kemenangan terbesar kosmologi modern.$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Garis Waktu dan Masa Depan$$)),
(gen_random_uuid(), 'e5000003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Setelah Big Bang: inflasi kosmik (sepersejuta detik pertama), pembentukan inti atom (3 menit), atom netral pertama (380.000 tahun), bintang dan galaksi pertama (ratusan juta tahun), hingga tata surya kita 4,6 miliar tahun lalu. Mengejutkannya, sejak 1998 diketahui pengembangan alam semesta justru dipercepat oleh "energi gelap" yang misterius — nasib akhir alam semesta masih menjadi teka-teki terbesar fisika.$$))
ON CONFLICT DO NOTHING;

-- ============ 4. EXP-VULKANOLOGI-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000004-0000-4000-8000-000000000004', 'EXP-VULKANOLOGI-001', 'c6000001-0000-0000-0000-000000000001',
'Gunung Berapi Indonesia: Hidup di Atas Cincin Api', 'gunung-berapi-indonesia-cincin-api',
'Indonesia punya 127+ gunung aktif di jalur Cincin Api Pasifik: kenapa bisa begitu, letusan bersejarahnya, dan cara hidup berdampingan dengannya.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Indonesia di Atas Cincin Api$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Indonesia memiliki lebih dari 127 gunung berapi aktif — terbanyak di dunia — yang membentang dari Sumatra, Jawa, Bali, Nusa Tenggara, hingga Maluku dan Sulawesi. Semuanya berada di "Ring of Fire" (Cincin Api Pasifik), jalur sepanjang 40.000 km tempat 90% gempa bumi dunia terjadi.$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Tiga Lempeng Bertemu$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Penyebabnya adalah tumbukan tiga lempeng tektonik raksasa: Lempeng Indo-Australia menunjam ke bawah Lempeng Eurasia (membentuk busur Sunda: Sumatra–Jawa), sementara Lempeng Pasifik menekan dari timur (membentuk busur Banda dan Maluku). Gesekan penunjaman ini melelehkan batuan menjadi magma yang naik dan membentuk gunung berapi.$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Letusan yang Mengguncang Dunia$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Tambora 1815 (Sumbawa) adalah letusan terbesar dalam sejarah tercatat — menewaskan puluhan ribu jiwa dan menyebabkan "Tahun Tanpa Musim Panas" 1816 di Eropa dan Amerika. Krakatau 1883 menghasilkan suara terkeras dalam sejarah manusia, terdengar hingga 4.800 km jauhnya. Merapi di Jawa Tengah adalah salah satu gunung paling aktif di dunia dengan erupsi rutin tiap beberapa tahun.$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Tipe Letusan$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Letusan efusif mengeluarkan lava yang mengalir perlahan (seperti di Hawaii), sedangkan letusan eksplosif menyemburkan abu dan material pijar dengan dahsyat (seperti Merapi dan Tambora). Skala kekuatan diukur dengan VEI (Volcanic Explosivity Index) dari 0 hingga 8 — Tambora mencapai VEI 7.$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Berkah di Balik Bahaya$$)),
(gen_random_uuid(), 'e5000004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Abu vulkanik membuat tanah Indonesia termasuk tersubur di dunia — inilah rahasia sawah Jawa dan kebun kopi Sumatra. Panas bumi menjadi sumber energi geotermal bersih, dan kawah-kawah indah menjadi magnet wisata. Kuncinya adalah mitigasi: PVMBG memantau aktivitas dan menetapkan status Normal, Waspada, Siaga, hingga Awas, lengkap dengan zona bahaya yang wajib dipatuhi warga.$$))
ON CONFLICT DO NOTHING;
-- ============ 5. SCH-SMA-GEO2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000005-0000-4000-8000-000000000005', 'SCH-SMA-GEO2-001', 'd5555555-5555-5555-5555-555555555555',
'Geografi Kelas 12: Peta dan Penginderaan Jauh', 'geografi-kelas-12-peta-penginderaan-jauh',
'Materi Geografi kelas 12: komponen peta, jenis proyeksi, prinsip penginderaan jauh, citra, dan SIG beserta latihan soal.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan komponen-komponen peta, (2) membedakan jenis peta dan proyeksi, (3) menjelaskan prinsip dan komponen penginderaan jauh, serta (4) mengidentifikasi manfaat citra dan SIG dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Pengertian dan Komponen Peta$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Peta adalah gambaran permukaan bumi pada bidang datar dengan skala tertentu. Komponen peta yang wajib ada: judul peta, legenda (keterangan simbol), skala (angka, garis, atau inkremental), orientasi (tanda mata angin), garis lintang dan bujur, inset (peta penyisip penunjuk lokasi), serta lettering (tata huruf yang jelas).$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Jenis Peta dan Proyeksi$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Berdasarkan isinya, peta dibagi menjadi peta umum (menampilkan kenampakan umum seperti peta topografi) dan peta tematik/khusus (misal peta curah hujan, peta kepadatan penduduk). Karena bumi bulat digambar di bidang datar, diperlukan proyeksi: azimuthal (bidang datar, cocok untuk kutub), kerucut (cocok untuk lintang tengah), dan silinder seperti proyeksi Mercator (cocok untuk navigasi karena garis lurus = arah kompas tetap).$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Penginderaan Jauh: Definisi dan Komponen$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Penginderaan jauh adalah ilmu memperoleh informasi tentang objek tanpa kontak fisik langsung, menggunakan sensor (kamera, satelit). Tujuh komponennya: sumber tenaga (matahari), atmosfer, interaksi tenaga dan objek, sensor dan wahana, transmisi dan penerimaan data, perolehan data, serta pengguna data.$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Citra dan Sistem Informasi Geografis (SIG)$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Hasil penginderaan jauh disebut citra: citra foto (dari kamera) dan citra nonfoto (dari sensor elektronik, misal citra satelit Landsat). SIG adalah sistem komputer untuk memasukkan, menyimpan, menganalisis, dan menampilkan data geografis — dipakai untuk perencanaan tata ruang, mitigasi bencana, dan pemantauan lingkungan.$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e5000005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan lima komponen peta beserta fungsinya masing-masing!$$, $$2. Jelaskan perbedaan citra foto dan citra nonfoto beserta contohnya!$$, $$3. Pada peta berskala 1:50.000, jarak dua kota 4 cm. Berapa jarak sebenarnya? (Kunci: 4 × 50.000 = 200.000 cm = 2 km)$$, $$Kunci no. 1: judul (identifikasi isi), legenda (arti simbol), skala (perbandingan jarak), orientasi (arah mata angin), garis lintang-bujur (posisi koordinat).$$, $$Kunci no. 2: citra foto direkam kamera (contoh: foto udara); citra nonfoto direkam sensor elektronik (contoh: citra satelit Landsat).$$]))
ON CONFLICT DO NOTHING;

-- ============ 6. SCH-SMP-MAT2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e5000006-0000-4000-8000-000000000006', 'SCH-SMP-MAT2-001', 'd4444444-4444-4444-4444-444444444444',
'Matematika Kelas 9: Bangun Ruang Sisi Lengkung', 'matematika-kelas-9-bangun-ruang-sisi-lengkung',
'Materi Matematika kelas 9: tabung, kerucut, dan bola — unsur, rumus luas permukaan dan volume, contoh soal, dan latihan.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) mengidentifikasi unsur-unsur tabung, kerucut, dan bola, (2) menghitung luas permukaan dan volume ketiganya, serta (3) menyelesaikan masalah sehari-hari yang berkaitan dengan bangun ruang sisi lengkung.$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Tabung: Unsur, Luas, dan Volume$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tabung memiliki 2 sisi berbentuk lingkaran (alas dan tutup) serta 1 sisi lengkung (selimut). Unsur-unsurnya: jari-jari (r), tinggi (t), dan diameter (d = 2r). Rumus: Luas permukaan = 2πr(r + t), Volume = πr²t. Gunakan π = 22/7 jika r kelipatan 7, atau π = 3,14 jika tidak.$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Kerucut: Unsur, Luas, dan Volume$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Kerucut memiliki alas lingkaran, satu titik puncak, dan garis pelukis (s). Hubungan ketiganya: s = √(r² + t²). Rumus: Luas permukaan = πr(r + s), Volume = ⅓πr²t. Perhatikan: volume kerucut tepat sepertiga volume tabung dengan alas dan tinggi yang sama.$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Bola: Luas dan Volume$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Bola hanya memiliki satu sisi lengkung tanpa rusuk maupun titik sudut. Unsur utamanya hanya jari-jari (r). Rumus: Luas permukaan = 4πr², Volume = ⁴⁄₃πr³.$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal 1: Volume Tabung$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'PARAGRAPH', 10, jsonb_build_object('text', $$Sebuah kaleng susu berbentuk tabung berjari-jari 7 cm dan tinggi 10 cm. Berapa volumenya? Penyelesaian: V = πr²t = 22/7 × 7 × 7 × 10 = 22 × 7 × 10 = 1.540 cm³. Jadi volume kaleng tersebut 1.540 cm³.$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan dan Kunci Jawaban$$)),
(gen_random_uuid(), 'e5000006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Hitung luas permukaan bola berjari-jari 14 cm! (Kunci: 4 × 22/7 × 14 × 14 = 2.464 cm²)$$, $$2. Sebuah kerucut berjari-jari 6 cm dan tinggi 8 cm. Tentukan volumenya! (Kunci: s tidak diperlukan; V = ⅓ × 3,14 × 36 × 8 = 301,44 cm³)$$, $$3. Tabung dengan diameter 20 cm dan tinggi 15 cm. Berapa luas permukaannya? (Kunci: r = 10; L = 2 × 3,14 × 10 × (10 + 15) = 1.570 cm²)$$]))
ON CONFLICT DO NOTHING;
