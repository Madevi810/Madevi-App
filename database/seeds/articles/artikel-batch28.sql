-- Artikel konten Madevi batch 28 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- 6 artikel, semua status='DRAFT', language='id'

-- ============ 1. TUT-KEUARGA2-001: Budget Nikah ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a12ad77c-6131-4818-9ede-866a124185c8', 'TUT-KEUARGA2-001', 'b8888888-8888-8888-8888-888888888888',
'Budget Nikah: Resepsi Hemat tapi Berkesan', 'budget-nikah-resepsi-hemat-berkesan',
'Panduan menyusun anggaran pernikahan yang realistis: prioritas biaya, trik hemat tiap pos, dan cara menghindari utang setelah resepsi.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Biaya Nikah Membengkak$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'PARAGRAPH', 2, jsonb_build_object('text', $$Rata-rata resepsi pernikahan di Indonesia menelan biaya Rp100–300 juta. Banyak pasangan terjebak gengsi: gedung mewah, katering premium, dekorasi megah — lalu memulai rumah tangga dengan utang. Masalah sebenarnya bukan besarnya biaya, melainkan tidak adanya anggaran yang disepakati sejak awal.$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Ke Mana Saja Uang Pergi$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pos biaya terbesar biasanya: gedung/sewa tempat (25–35%), katering (30–40%), dekorasi dan dokumentasi (15–20%), busana dan rias (10%), sisanya untuk undangan, souvenir, dan tak terduga. Katering hampir selalu pos termahal karena dihitung per pax — setiap tambahan 100 tamu bisa menambah Rp15–30 juta.$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Spreadsheet atau buku catatan anggaran$$, $$Daftar tamu realistis (bukan daftar keinginan orang tua)$$, $$3–5 penawaran vendor per pos biaya untuk perbandingan$$, $$Kesepakatan tertulis pembagian biaya kedua keluarga$$])),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 7, jsonb_build_object('text', $$Langkah Menyusun Budget$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tetapkan total budget MAKSIMAL yang disepakati berdua, bukan perkiraan longgar$$, $$2. Bagi ke tiap pos dengan persentase: tempat 30%, katering 35%, dekorasi+dokumentasi 15%, busana+rias 10%, cadangan 10%$$, $$3. Pangkas daftar tamu dulu sebelum pilih gedung — jumlah tamu menentukan hampir semua biaya$$, $$4. Pilih 2–3 pos yang paling penting bagi kalian (misal foto dan makanan), hemat di sisanya$$, $$5. Minta penawaran tertulis dan waspadai biaya tersembunyi (overtime, cleaning fee, parkir)$$, $$6. Sisakan dana cadangan minimal 10% untuk biaya tak terduga di H-7$$])),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan berutang konsumtif (pinjol, kartu kredit, KTA) untuk resepsi — bunga 2–4% per bulan bisa menggandakan beban. Waspadai vendor yang meminta DP di atas 50% tanpa kontrak jelas. Tekanan keluarga soal gengsi adalah risiko terbesar pembengkakan; selesaikan lewat musyawarah sebelum booking apa pun.$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a12ad77c-6131-4818-9ede-866a124185c8', 'PARAGRAPH', 12, jsonb_build_object('text', $$Resepsi berkesan tidak harus mahal: tamu mengingat makanan enak, suasana hangat, dan kelancaran acara — bukan harga dekorasi. Dengan budget tertulis, daftar tamu realistis, dan disiplin pada 2–3 prioritas, resepsi Rp50–80 juta bisa terasa sama mewahnya dengan yang Rp200 juta. Target akhir: H+1 pernikahan dimulai tanpa utang.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-SEHAT2-001: Jalan Kaki 30 Menit ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a14daccd-f3ea-4b67-b802-4053120c2989', 'TUT-SEHAT2-001', 'b5555555-5555-5555-5555-555555555555',
'Jalan Kaki 30 Menit: Manfaat Luar Biasa', 'jalan-kaki-30-menit-manfaat',
'Jalan kaki adalah olahraga termurah dan termudah. Panduan memulai kebiasaan jalan 30 menit sehari: teknik, jadwal, dan manfaat yang terbukti.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Mager Olahraga$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak orang tahu olahraga itu penting tapi tidak mulai-mulai: gym mahal, lari melelahkan, tidak ada waktu. Akibatnya gaya hidup sedentari memicu obesitas, diabetes, dan nyeri punggung. Padahal ada satu aktivitas yang gratis, tidak butuh alat, dan bisa dilakukan siapa saja: jalan kaki.$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa 30 Menit$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'PARAGRAPH', 4, jsonb_build_object('text', $$Organisasi kesehatan dunia merekomendasikan minimal 150 menit aktivitas aerobik sedang per minggu — setara 30 menit jalan cepat, 5 hari seminggu. Jalan cepat membakar 150–200 kalori per 30 menit, melancarkan sirkulasi darah, menurunkan tekanan darah, memperbaiki kualitas tidur, dan merangsang hormon endorfin yang memperbaiki suasana hati.$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Sepatu yang nyaman (tidak harus sepatu lari mahal)$$, $$Pakaian menyerap keringat$$, $$Botol air minum$$, $$Aplikasi pedometer di HP (opsional, untuk motivasi)$$])),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memulai$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Minggu 1–2: jalan santai 15–20 menit, 3x seminggu — bangun kebiasaan dulu$$, $$2. Minggu 3–4: naikkan ke 30 menit dengan kecepatan sedang (masih bisa ngobrol)$$, $$3. Terapkan postur benar: tegak, pandangan ke depan, ayunkan lengan$$, $$4. Pilih rute aman: trotoar, taman, atau komplek — hindari jalan raya tanpa trotoar$$, $$5. Jadwalkan di waktu yang sama tiap hari (pagi sebelum kerja atau sore) agar jadi rutinitas$$, $$6. Setelah terbiasa, variasikan: tanjakan, interval cepat-lambat, atau ajak teman$$])),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan langsung memaksakan 10.000 langkah jika sebelumnya tidak aktif — naikkan bertahap untuk menghindari nyeri lutut dan betis. Penderita jantung, diabetes, atau nyeri sendi kronis sebaiknya konsultasi dokter dulu. Selalu pemanasan 3–5 menit dan pendinginan di akhir.$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a14daccd-f3ea-4b67-b802-4053120c2989', 'PARAGRAPH', 12, jsonb_build_object('text', $$Target realistis: dalam 1 bulan, 30 menit jalan cepat 5x seminggu terasa ringan. Ukur progres dengan lingkar pinggang, kualitas tidur, dan energi harian — bukan cuma timbangan. Konsistensi mengalahkan intensitas: jalan santai tiap hari jauh lebih baik daripada lari seminggu sekali lalu berhenti.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-SASTRA-001: Sastra Indonesia ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('0c2aff58-e633-43e2-b802-6f4061547366', 'EXP-SASTRA-001', 'c8888888-8888-8888-8888-888888888888',
'Sastra Indonesia: Dari Balai Pustaka hingga Kini', 'sastra-indonesia-balai-pustaka-hingga-kini',
'Perjalanan sastra Indonesia: angkatan Balai Pustaka, Pujangga Baru, Angkatan 45, hingga sastra kontemporer — karya dan tokoh pentingnya.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Sastra Indonesia$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sastra Indonesia adalah karya sastra yang ditulis dalam bahasa Indonesia, tumbuh seiring lahirnya bahasa persatuan itu sendiri. Perkembangannya biasa dibagi ke dalam angkatan-angkatan — kelompok sastrawan sezaman dengan corak dan semangat yang khas. Pembagian ini membantu kita memetakan bagaimana sastra merekam perubahan zaman.$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'HEADING', 3, jsonb_build_object('text', $$Angkatan Balai Pustaka (1920-an)$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'PARAGRAPH', 4, jsonb_build_object('text', $$Lahir dari penerbit kolonial Balai Pustaka. Ciri: bahasa Melayu tinggi, tema adat dan kawin paksa, akhir cerita yang "mendidik". Karya terkenal: Siti Nurbaya (Marah Rusli, 1922) — kisah tragis perempuan korban perjodohan; Salah Asuhan (Abdul Muis, 1928) — kritik terhadap westernisasi buta. Meski dibatasi sensor kolonial, angkatan ini meletakkan fondasi novel Indonesia modern.$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'HEADING', 5, jsonb_build_object('text', $$Pujangga Baru dan Angkatan 45$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pujangga Baru (1933, dipimpin Sutan Takdir Alisjahbana) mengusung semangat kebangsaan dan pembaruan bahasa lewat majalah Poedjangga Baroe. Angkatan 45 lahir dari semangat revolusi kemerdekaan — Chairil Anwar dengan sajak "Aku" dan "Karawang-Bekasi" menjadi ikonnya: bahasa yang meledak-ledak, individualistis, dan merdeka. Sastrawan seperti Idrus dan Pramoedya Ananta Toer mulai menulis realisme sosial yang tajam.$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'HEADING', 7, jsonb_build_object('text', $$Angkatan 66 hingga Reformasi$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'PARAGRAPH', 8, jsonb_build_object('text', $$Angkatan 66 (Taufiq Ismail, Rendra) menyuarakan kritik sosial di tengah pergolakan politik. Era Orde Baru melahirkan sastra yang simbolik karena sensor — Mahabharata versi Yudhistira, puisi-puisi protes Rendra yang dibaca di panggung. Pramoedya menulis Tetralogi Buru di penjara tanpa boleh menulis — dikarang lewat hafalan dan diceritakan ke tahanan lain. Pasca-reformasi 1998, sastra meledak bebas: sastra wangi (Ayu Utami, Dewi Lestari), novel pop, hingga puisi Instagram.$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'HEADING', 9, jsonb_build_object('text', $$Sastra Indonesia Kini$$)),
(gen_random_uuid(), '0c2aff58-e633-43e2-b802-6f4061547366', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kini sastra Indonesia hidup di banyak medium: novel cetak, cerpen koran, puisi media sosial, podcast sastra, dan adaptasi film (Laskar Pelangi, Dilan, Bumi Manusia). Penghargaan seperti Kusala Sastra Khatulistiwa menjaga mutu, sementara komunitas literasi di tiap kota menumbuhkan penulis baru. Sastra tetap menjadi cermin — dari Siti Nurbaya yang melawan adat hingga novel hari ini yang melawan algoritma.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-TEKNOLOGI3-001: 5G ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'EXP-TEKNOLOGI3-001', 'c5000003-0000-0000-0000-000000000003',
'5G: Revolusi Konektivitas', '5g-revolusi-konektivitas',
'Memahami teknologi 5G: cara kerja, perbedaan dengan 4G, spektrum frekuensi, dan dampaknya bagi industri dan kehidupan sehari-hari.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu 5G$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'PARAGRAPH', 2, jsonb_build_object('text', $$5G adalah generasi kelima teknologi jaringan seluler — penerus 4G LTE. Ia bukan sekadar "internet lebih cepat", melainkan arsitektur jaringan baru yang dirancang untuk tiga hal sekaligus: kecepatan ekstrem, latensi super rendah, dan koneksi perangkat dalam jumlah masif. Standarnya ditetapkan oleh 3GPP mulai Release 15 (2018).$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'HEADING', 3, jsonb_build_object('text', $$5G vs 4G: Perbedaan Nyata$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kecepatan puncak 5G mencapai 10–20 Gbps (teoretis), sekitar 10–100x lipat 4G. Latensi turun dari 30–50 ms di 4G menjadi sekitar 1 ms — sepersekian kedipan mata. Kapasitasnya pun jauh lebih besar: satu sel 5G dapat melayani hingga 1 juta perangkat per kilometer persegi, fondasi bagi Internet of Things (IoT).$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'HEADING', 5, jsonb_build_object('text', $$Cara Kerja: Spektrum dan Gelombang Milimeter$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'PARAGRAPH', 6, jsonb_build_object('text', $$5G memakai tiga lapis spektrum frekuensi. Pita rendah (<1 GHz) menjangkau luas seperti 4G. Pita menengah (1–6 GHz, misal 3,5 GHz) menyeimbangkan kecepatan dan jangkauan — inilah tulang punggung 5G di banyak negara. Pita tinggi atau mmWave (24–100 GHz) memberi kecepatan tertinggi tetapi jangkauan hanya ratusan meter dan terhalang tembok, sehingga butuh banyak pemancar kecil (small cells). Teknologi beamforming mengarahkan sinyal tepat ke perangkat, dan massive MIMO memakai puluhan antena dalam satu panel.$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'HEADING', 7, jsonb_build_object('text', $$Tiga Layanan Utama 5G$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'LIST', 8, jsonb_build_object('items', ARRAY[$$eMBB (Enhanced Mobile Broadband): internet super cepat untuk HP, streaming 4K/8K, dan hotspot$$, $$URLLC (Ultra-Reliable Low-Latency): latensi 1 ms untuk mobil otonom, operasi jarak jauh, dan robot industri$$, $$mMTC (Massive Machine-Type Communications): jutaan sensor IoT — pertanian pintar, kota pintar, pabrik otomatis$$])),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'HEADING', 9, jsonb_build_object('text', $$Dampak dan Tantangan$$)),
(gen_random_uuid(), 'ed21ec18-0bfa-44bf-9967-ffa041e5e913', 'PARAGRAPH', 10, jsonb_build_object('text', $$5G memungkinkan pabrik nirkabel, telemedicine, dan kendaraan terhubung. Namun tantangannya nyata: biaya infrastruktur sangat besar, mmWave butuh kepadatan menara tinggi, dan kesenjangan digital bisa melebar antara kota dan desa. Isu keamanan rantai pasok perangkat pun menjadi perhatian geopolitik global. Bagi pengguna biasa, manfaat paling terasa adalah kecepatan unduh dan kestabilan di keramaian — revolusi sesungguhnya terjadi di industri.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-BIO2-001: Pewarisan Sifat ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'SCH-SMA-BIO2-001', 'd5555555-5555-5555-5555-555555555555',
'Biologi Kelas 12: Pewarisan Sifat', 'biologi-kelas-12-pewarisan-sifat',
'Materi genetika kelas 12: hukum Mendel, persilangan monohibrid dan dihibrid, serta penyimpangan semu hukum Mendel — lengkap dengan contoh soal.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan hukum I dan II Mendel, (2) menentukan gamet dan rasio fenotipe/genotipe persilangan monohibrid dan dihibrid, (3) mengidentifikasi penyimpangan semu hukum Mendel seperti epistasis dan kriptomeri.$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 3, jsonb_build_object('text', $$Hukum I Mendel: Segregasi$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'PARAGRAPH', 4, jsonb_build_object('text', $$Hukum I Mendel (segregasi) menyatakan bahwa pasangan alel akan memisah saat pembentukan gamet, sehingga setiap gamet hanya membawa satu alel dari tiap pasangan gen. Contoh: tanaman bergenotipe Bb (B = bulat dominan, b = kisut resesif) menghasilkan gamet B dan b masing-masing 50%. Persilangan Bb × Bb menghasilkan rasio genotipe 1 BB : 2 Bb : 1 bb dan rasio fenotipe 3 bulat : 1 kisut.$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 5, jsonb_build_object('text', $$Hukum II Mendel: Berpasangan Bebas$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'PARAGRAPH', 6, jsonb_build_object('text', $$Hukum II Mendel (independent assortment) menyatakan gen-gen yang berbeda berpasangan secara bebas saat pembentukan gamet. Pada persilangan dihibrid BbKk × BbKk (B = bulat, b = kisut, K = kuning, k = hijau), dihasilkan rasio fenotipe klasik 9 : 3 : 3 : 1, yaitu 9 bulat-kuning : 3 bulat-hijau : 3 kisut-kuning : 1 kisut-hijau.$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 7, jsonb_build_object('text', $$Penyimpangan Semu Hukum Mendel$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Epistasis: satu gen menutupi ekspresi gen lain (rasio 12:3:1), misal warna bulu tikus$$, $$Hipostasis: gen yang ditutupi oleh gen epistasis$$, $$Kriptomeri: gen dominan tampak tersembunyi bila berdiri sendiri (rasio 9:3:4), misal warna bunga Linaria$$, $$Komplementer: dua gen dominan bekerja sama memunculkan sifat baru (rasio 9:7), misal warna bunga Lathyrus$$])),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'PARAGRAPH', 10, jsonb_build_object('text', $$Soal 1: Kelinci berbulu hitam (HH) disilangkan dengan kelinci berbulu putih (hh). Hitam dominan terhadap putih. Tentukan rasio fenotipe F2! Jawab: F1 semuanya Hh (hitam). F2: 1 HH : 2 Hh : 1 hh → fenotipe 3 hitam : 1 putih. Soal 2: Pada persilangan dihibrid, berapa persen keturunan yang bergenotipe bbkk dari BbKk × BbKk? Jawab: peluang bb = 1/4, peluang kk = 1/4, maka bbkk = 1/4 × 1/4 = 1/16 = 6,25%.$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), '3d587c3f-71a7-4ba4-9270-c0d93dd15ca0', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tanaman ercis berbiji bulat heterozigot (Bb) disilangkan sesamanya. Berapa perbandingan fenotipe keturunannya?$$, $$2. Jelaskan perbedaan epistasis dan kriptomeri beserta contohnya!$$, $$3. Seorang petani menyilangkan ayam berpial walnut (RrPp) sesamanya. Jika walnut dominan, tentukan rasio fenotipe F2! (Kunci: 9 walnut : 3 rose : 3 pea : 1 single)$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-IPS4-001: Proklamasi Kemerdekaan ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'SCH-SD-IPS4-001', 'd3333333-3333-3333-3333-333333333333',
'IPS Kelas 6: Proklamasi Kemerdekaan Indonesia', 'ips-kelas-6-proklamasi-kemerdekaan',
'Materi IPS kelas 6 SD: peristiwa proklamasi 17 Agustus 1945 — latar belakang, tokoh-tokoh, teks proklamasi, dan maknanya bagi bangsa.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu diharapkan mampu: (1) menjelaskan latar belakang proklamasi kemerdekaan Indonesia, (2) menyebutkan tokoh-tokoh penting peristiwa proklamasi, (3) menceritakan kembali peristiwa 17 Agustus 1945 secara runtut, (4) menjelaskan makna proklamasi bagi bangsa Indonesia.$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 3, jsonb_build_object('text', $$Latar Belakang$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pada 6 dan 9 Agustus 1945, bom atom dijatuhkan di Hiroshima dan Nagasaki. Pada 14 Agustus 1945 Jepang menyerah kepada Sekutu — Indonesia menjadi vakum kekuasaan. Golongan muda mendesak Soekarno-Hatta segera memproklamasikan kemerdekaan tanpa menunggu PPKI, sedangkan golongan tua ingin melalui sidang resmi. Perbedaan pendapat ini memuncak pada peristiwa Rengasdengklok: pada 16 Agustus dini hari, Soekarno dan Hatta dibawa pemuda ke Rengasdengklok agar tidak terpengaruh Jepang.$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 5, jsonb_build_object('text', $$Perumusan Teks Proklamasi$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'PARAGRAPH', 6, jsonb_build_object('text', $$Malam 16 Agustus 1945, di rumah Laksamana Maeda (Jl. Imam Bonjol No. 1, Jakarta), Soekarno, Hatta, dan Ahmad Subardjo merumuskan teks proklamasi. Sayuti Melik mengetik naskah tersebut. Teksnya berbunyi: "Kami bangsa Indonesia dengan ini menjatakan kemerdekaan Indonesia..." — ditandatangani Soekarno-Hatta atas nama bangsa Indonesia.$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 7, jsonb_build_object('text', $$Detik-Detik Proklamasi$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jumat, 17 Agustus 1945 pukul 10.00 WIB, di Jalan Pegangsaan Timur No. 56 Jakarta, Soekarno membacakan teks proklamasi di depan hadirin. Sang Saka Merah Putih dikibarkan — dijahit oleh Fatmawati. Hadirin menyanyikan Indonesia Raya bersama. Sejak saat itu, Indonesia resmi menjadi negara merdeka dan berdaulat.$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 9, jsonb_build_object('text', $$Tokoh-Tokoh Penting$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Ir. Soekarno — pembaca teks proklamasi, presiden pertama$$, $$Drs. Mohammad Hatta — wakil presiden pertama, ikut merumuskan teks$$, $$Ahmad Subardjo — ikut merumuskan teks proklamasi$$, $$Sayuti Melik — pengetik naskah proklamasi$$, $$Fatmawati — penjahit bendera Sang Saka Merah Putih$$, $$Sukarni, Chaerul Saleh, Wikana — tokoh golongan muda pendesak proklamasi$$])),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'b60de195-2ee2-46bc-af43-7bbae5d6f5c4', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Kapan dan di mana teks proklamasi dibacakan? (Kunci: 17 Agustus 1945 pukul 10.00, Jl. Pegangsaan Timur No. 56 Jakarta)$$, $$2. Sebutkan 3 tokoh golongan muda dalam peristiwa proklamasi! (Kunci: Sukarni, Chaerul Saleh, Wikana)$$, $$3. Apa makna proklamasi kemerdekaan bagi bangsa Indonesia? (Kunci: Indonesia bebas dari penjajahan, berdaulat, dan berhak menentukan nasib sendiri)$$]))
ON CONFLICT (id) DO NOTHING;
