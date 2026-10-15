-- Artikel konten Madevi batch 12 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempotent: ON CONFLICT DO NOTHING

-- ============ 1. TUT-TIDUR-001: Insomnia ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200001-0000-0000-0000-000000000001', 'TUT-TIDUR-001', 'b5555555-5555-5555-5555-555555555555',
'Insomnia: Cara Tidur Nyenyak Tanpa Obat', 'insomnia-cara-tidur-nyenyak-tanpa-obat',
'Panduan mengatasi susah tidur: dari kebiasaan malam hari, teknik relaksasi, sampai kapan harus ke dokter.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Susah Tidur Setiap Malam$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sudah berbaring 1-2 jam tapi mata tetap terjaga, pikiran berputar memikirkan pekerjaan, tagihan, atau hal kecil yang sebenarnya sepele. Akibatnya bangun dengan badan lelah, sulit konsentrasi, dan emosi mudah tersulut. Jika terjadi 3 malam atau lebih dalam seminggu selama sebulan, ini masuk kategori insomnia.$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Otak Susah Mati$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tubuh punya jam biologis (ritme sirkadian) yang diatur cahaya dan hormon melatonin. Layar HP memancarkan cahaya biru yang menipu otak seolah masih siang, sehingga melatonin tertahan. Kafein sore hari, tidur siang terlalu lama, dan kecemasan memicu hormon kortisol yang membuat tubuh siaga. Insomnia primer (tanpa penyakit penyerta) umumnya disebabkan kombinasi ketiganya.$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Persiapan: Perbaiki Kamar dan Rutinitas$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kamar gelap, sejuk (suhu 18-22 derajat), dan tenang$$, $$Kasur dan bantal yang nyaman$$, $$Jam weker ditaruh jauh dari jangkauan (biar tidak sering mengecek jam)$$, $$Buku catatan kecil di meja untuk menulis hal yang mengganggu pikiran$$])),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah: Protokol Tidur 7 Hari$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Tetapkan jam tidur dan jam bangun yang SAMA setiap hari, termasuk akhir pekan$$, $$2. Stop kafein setelah jam 14.00 dan hindari tidur siang lebih dari 20 menit$$, $$3. Matikan layar 60 menit sebelum tidur; ganti dengan baca buku fisik atau mandi air hangat$$, $$4. Teknik 4-7-8: tarik napas 4 detik, tahan 7 detik, buang 8 detik, ulangi 4 siklus$$, $$5. Jika 20 menit belum tidur, bangun dan lakukan aktivitas membosankan (baca kamus) sampai mengantuk, lalu kembali$$, $$6. Tulis semua kekhawatiran di kertas sebelum tidur agar otak merasa sudah ditangani$$])),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan mengonsumsi obat tidur tanpa resep dokter — berisiko ketergantungan dan efek samping keesokan harinya. Jangan juga begadang lalu mengganti tidur di siang hari karena merusak ritme sirkadian. Waspadai tanda bahaya: mendengkur keras disertai napas berhenti (sleep apnea), kaki gelisah tak tertahankan, atau kantuk berat hingga tertidur saat menyetir — semua itu butuh pemeriksaan medis, bukan sekadar tips tidur.$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e1200001-0000-0000-0000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Kebanyakan insomnia ringan membaik dalam 1-2 minggu rutinitas konsisten. Catat jam tidur-bangun setiap hari untuk melihat pola. Jika setelah sebulan tidak ada perbaikan, atau disertai depresi/kecemasan berat, konsultasikan ke dokter umum atau psikolog — terapi perilaku kognitif untuk insomnia (CBT-I) terbukti lebih efektif jangka panjang daripada obat.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-INTERNET-001: WiFi Lemot ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200002-0000-0000-0000-000000000002', 'TUT-INTERNET-001', 'b4444444-4444-4444-4444-444444444444',
'WiFi Lemot: Diagnosis dan Solusi Lengkap', 'wifi-lemot-diagnosis-solusi',
'Internet lemot padahal paket mahal? Ikuti diagnosis bertahap: dari posisi router sampai gangguan ISP.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: WiFi Lemot Padahal Paket Mahal$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Video buffering terus, Zoom patah-patah, game lag, padahal langganan 50 Mbps. Kecepatan yang diterima jauh di bawah yang dibayar. Masalah bisa dari router, posisi, interferensi, perangkat yang boros bandwidth, atau memang gangguan dari ISP.$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kecepatan vs Kenyataan$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Kecepatan iklan ISP diukur via kabel LAN langsung ke modem, dalam kondisi ideal. WiFi 2,4 GHz punya jangkauan jauh tapi lambat dan mudah terganggu microwave, bluetooth, dan WiFi tetangga. WiFi 5 GHz cepat tapi lemah menembus tembok. Satu perangkat yang mengunduh besar (update game, backup cloud) bisa menyedot seluruh bandwidth rumah.$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$HP atau laptop dengan aplikasi speedtest$$, $$Akses admin router (biasanya 192.168.1.1)$$, $$Kabel LAN (untuk uji pembanding)$$])),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Diagnosis (Urut)$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Uji dengan kabel LAN langsung: jika cepat, masalahnya di WiFi; jika tetap lambat, masalah di ISP$$, $$2. Pindahkan router ke tengah rumah, posisi tinggi, jauh dari microwave dan tembok beton tebal$$, $$3. Pisahkan jaringan 2,4 GHz dan 5 GHz; sambungkan perangkat kerja ke 5 GHz$$, $$4. Cek daftar perangkat di admin router — putuskan yang tidak dikenal (bisa jadi tetangga menumpang)$$, $$5. Ganti password WiFi dan aktifkan WPA3/WPA2$$, $$6. Restart router (cabut 30 detik) — lakukan seminggu sekali$$, $$7. Jika semua gagal, hubungi ISP dengan data hasil speedtest via kabel sebagai bukti$$])),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan reset factory router sembarangan tanpa mencatat username/password PPPoE dari ISP — bisa hilang koneksi total. Jangan beli repeater murah tanpa riset karena sering memperparah latensi; mesh WiFi lebih baik untuk rumah bertingkat. Hati-hati aplikasi penguat sinyal abal-abal yang meminta akses berlebihan.$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'e1200002-0000-0000-0000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$80 persen kasus selesai di langkah 1-5 tanpa biaya. Jika terbukti ISP yang bermasalah (speedtest via kabel jauh di bawah paket), minta teknisi datang — itu hak pelanggan. Untuk rumah 2 lantai ke atas, investasi mesh WiFi (mulai Rp800 ribu) jauh lebih efektif daripada gonta-ganti router murah.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-LOGIKA-001: Berpikir Kritis ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200003-0000-0000-0000-000000000003', 'EXP-LOGIKA-001', 'c5555555-5555-5555-5555-555555555555',
'Berpikir Kritis: Sesat Pikir yang Sering Terjadi', 'berpikir-kritis-sesat-pikir',
'Kenali 7 sesat pikir (logical fallacy) yang paling sering menjebak: dari strawman hingga appeal to authority.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Sesat Pikir?$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sesat pikir (logical fallacy) adalah kesalahan dalam penalaran yang membuat argumen terlihat meyakinkan padahal cacat logika. Mengenali pola-pola ini adalah fondasi berpikir kritis — berguna saat membaca berita, berdebat, atau mengambil keputusan penting.$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$1. Strawman (Orang-orangan Sawah)$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Mendistorsi argumen lawan menjadi versi yang lebih lemah lalu menyerang versi palsu itu. Contoh: A berkata kita perlu mengatur jam kerja ojek online, B menjawab jadi kamu mau mematikan rezeki semua driver? B tidak menjawab argumen A sama sekali.$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$2. Ad Hominem dan 3. Appeal to Authority$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Ad hominem menyerang pribadi, bukan argumen: pendapatnya soal ekonomi tidak sah karena dia cuma lulusan SMA. Sebaliknya, appeal to authority menerima klaim hanya karena diucapkan orang terkenal: kata artis X suplemen ini ampuh. Keduanya mengabaikan isi argumen dan bukti.$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$4. False Dilemma dan 5. Slippery Slope$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$False dilemma menyajikan dua pilihan ekstrem seolah tidak ada jalan tengah: kalau tidak setuju RUU ini berarti kamu anti kemajuan. Slippery slope mengklaim satu langkah kecil pasti memicu bencana beruntun tanpa bukti: kalau ganja dilegalkan, semua orang akan jadi pecandu berat. Keduanya memaksa kesimpulan tanpa menunjukkan rantai sebab-akibat yang valid.$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$6. Bandwagon dan 7. Anecdotal$$)),
(gen_random_uuid(), 'e1200003-0000-0000-0000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Bandwagon: semua orang pakai, pasti bagus — popularitas bukan bukti kebenaran. Anecdotal: memakai satu pengalaman pribadi untuk menyimpulkan umum: saya tidak divaksin dan sehat-sehat saja. Data statistik dari ribuan sampel selalu lebih kuat daripada satu cerita. Cara melatih diri: setiap mendengar klaim kuat, tanyakan buktinya apa, sumbernya siapa, dan apakah ada penjelasan alternatif.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-ENERGI-001: Energi Terbarukan ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200004-0000-0000-0000-000000000004', 'EXP-ENERGI-001', 'c6000001-0000-0000-0000-000000000001',
'Energi Terbarukan: Masa Depan Listrik Indonesia', 'energi-terbarukan-masa-depan-indonesia',
'Potensi surya, air, angin, dan panas bumi Indonesia — serta tantangan transisi dari batu bara.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Kenapa Harus Beralih?$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Sebagian besar listrik Indonesia masih dari batu bara — sumber emisi karbon terbesar dan pencemar udara. Energi terbarukan (surya, air, angin, panas bumi, biomassa) tidak habis dipakai dan emisinya nyaris nol saat beroperasi. Transisi energi bukan soal gaya hidup, tapi soal ketahanan pasokan dan kesehatan publik jangka panjang.$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Surya: Potensi Terbesar$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Indonesia di garis khatulistiwa menerima radiasi matahari sekitar 4,8 kWh per meter persegi per hari — termasuk tertinggi di dunia. Panel surya mengubah foton menjadi listrik lewat efek fotovoltaik pada sel silikon. Kendalanya: hanya menghasilkan saat siang, butuh lahan luas, dan biaya baterai penyimpan masih mahal — meski harga panel turun lebih dari 80 persen dalam satu dekade.$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Air, Panas Bumi, dan Angin$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$PLTA memanfaatkan aliran sungai memutar turbin — andal tapi butuh bendungan besar. Indonesia punya cadangan panas bumi terbesar kedua dunia (cincin api vulkanik), ideal untuk listrik 24 jam nonstop. Angin potensial di pesisir selatan Jawa dan Nusa Tenggara, meski kecepatannya tidak sekonsisten Eropa utara.$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Tantangan Transisi$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Tiga hambatan utama: pertama, intermitensi — surya dan angin tidak stabil sehingga butuh baterai atau cadangan gas. Kedua, jaringan listrik (grid) Indonesia dibangun untuk pembangkit besar terpusat, belum siap menampung ribuan PLTS atap yang tersebar. Ketiga, ekonomi politik: ribuan pekerja dan daerah bergantung pada tambang batu bara, sehingga transisi harus adil (just transition) dengan pelatihan ulang dan kompensasi.$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Apa yang Bisa Dilakukan?$$)),
(gen_random_uuid(), 'e1200004-0000-0000-0000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Skala rumah tangga: pasang PLTS atap (skema net-metering memotong tagihan), hemat listrik di jam beban puncak sore hari. Skala kebijakan: target bauran energi nasional terus dinaikkan, lelang PLTS terapung di waduk (seperti Cirata) jadi model baru. Transisi energi adalah maraton puluhan tahun — dimulai dari memahami bahwa setiap kWh punya jejak karbon.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMA-SEJ-001: Kerajaan Hindu-Buddha ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200005-0000-0000-0000-000000000005', 'SCH-SMA-SEJ-001', 'd5555555-5555-5555-5555-555555555555',
'Sejarah Kelas 10: Kerajaan Hindu-Buddha di Indonesia', 'sejarah-kelas-10-kerajaan-hindu-buddha',
'Materi sejarah kelas 10: masuknya Hindu-Buddha, Kerajaan Kutai, Tarumanegara, Sriwijaya, dan Majapahit.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu menjelaskan proses masuknya pengaruh Hindu-Buddha ke Nusantara, menyebutkan kerajaan-kerajaan besar beserta bukti peninggalannya, dan menganalisis faktor kejayaan serta keruntuhannya.$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Masuknya Hindu-Buddha ke Nusantara$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Sekitar abad ke-1 hingga ke-4 Masehi, pedagang India berlayar ke Nusantara mengikuti angin muson untuk berdagang rempah. Bersama barang dagangan, mereka membawa bahasa Sanskerta, aksara Pallawa, sistem kasta, dan konsep dewa-raja. Para brahmana kemudian diundang raja-raja lokal untuk upacara penobatan — inilah jalur utama indianisasi: bukan penjajahan, melainkan akulturasi damai lewat perdagangan dan perkawinan.$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Kerajaan-Kerajaan Besar$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Kutai Martadipura (Kalimantan Timur, abad ke-4) adalah kerajaan Hindu tertua — buktinya tujuh Prasasti Yupa peninggalan Raja Mulawarman. Tarumanegara (Jawa Barat, abad ke-5) di bawah Raja Purnawarman meninggalkan Prasasti Ciaruteun dan Tugu. Sriwijaya (Sumatera, abad ke-7 hingga 13) menjadi pusat maritim dan pembelajaran Buddha — peziarah Tiongkok I-Tsing belajar di sini sebelum ke India. Majapahit (Jawa Timur, 1293-1527) mencapai puncak di bawah Hayam Wuruk dan Mahapatih Gajah Mada dengan Sumpah Palapa; peninggalan sastranya antara lain Kitab Negarakertagama dan Sutasoma (sumber semboyan Bhinneka Tunggal Ika).$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Faktor Kejayaan dan Keruntuhan$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Kejayaan umumnya ditopang tiga hal: letak strategis di jalur dagang (Selat Malaka untuk Sriwijaya), pertanian subur (lembah Brantas untuk Majapahit), dan pemimpin kuat. Keruntuhan biasanya karena perebutan takhta, serangan dari luar (Singasari menyerang Sriwijaya; Demak menyerang Majapahit), dan pergeseran jalur dagang. Pola ini berulang — hafalkan polanya, bukan sekadar tahunnya.$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Sebutkan dua bukti bahwa Kutai adalah kerajaan Hindu tertua di Indonesia!$$, $$2. Mengapa Sriwijaya disebut kerajaan maritim? Jelaskan!$$, $$3. Apa isi Sumpah Palapa dan siapa yang mengucapkannya?$$])),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e1200005-0000-0000-0000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Tujuh Prasasti Yupa peninggalan Raja Mulawarman yang berbahasa Sanskerta dan beraksara Pallawa, berisi upacara kurban (yajna).$$, $$2. Karena kekuasaannya bertumpu pada penguasaan jalur pelayaran dan perdagangan di Selat Malaka, memiliki armada laut kuat, dan menjadi bandar transit internasional.$$ , $$3. Sumpah untuk tidak beristirahat sebelum menyatukan Nusantara di bawah Majapahit, diucapkan Mahapatih Gajah Mada.$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-MAT3-001: Pecahan Sederhana ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('e1200006-0000-0000-0000-000000000006', 'SCH-SD-MAT3-001', 'd3333333-3333-3333-3333-333333333333',
'Matematika Kelas 4: Pecahan Sederhana', 'matematika-kelas-4-pecahan-sederhana',
'Materi matematika kelas 4 SD: mengenal pecahan, pembilang-penyebut, dan pecahan senilai dengan contoh gambar.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar materi ini, kamu bisa menjelaskan arti pecahan, menyebutkan pembilang dan penyebut, menentukan pecahan senilai, dan membandingkan dua pecahan sederhana.$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Pecahan?$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Bayangkan satu buah pizza dipotong menjadi 4 bagian sama besar. Jika kamu makan 1 potong, kamu makan 1 per 4 bagian pizza — ditulis 1/4 (dibaca seperempat). Angka di atas garis disebut pembilang (bagian yang diambil), angka di bawah disebut penyebut (jumlah seluruh bagian sama besar). Jadi pada 3/8, pembilangnya 3 dan penyebutnya 8.$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Pecahan Senilai$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pecahan senilai adalah pecahan berbeda yang nilainya sama. Cara membuatnya: kalikan atau bagi pembilang DAN penyebut dengan angka yang sama. Contoh: 1/2 = 2/4 (keduanya dikali 2) = 3/6 (dikali 3). Sebaliknya, 4/8 = 2/4 = 1/2 (dibagi 2, lalu dibagi 2 lagi). Ingat: yang dikali atau dibagi harus pembilang dan penyebut sekaligus, tidak boleh salah satu saja!$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Membandingkan Pecahan$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Jika penyebutnya sama, lihat pembilangnya: 3/5 lebih besar dari 2/5 karena 3 potong lebih banyak dari 2 potong. Jika penyebutnya beda, samakan dulu dengan mencari pecahan senilai. Contoh: bandingkan 1/2 dan 1/3. Ubah 1/2 = 3/6 dan 1/3 = 2/6. Karena 3/6 lebih besar dari 2/6, maka 1/2 lebih besar dari 1/3. Trik cepat: semakin besar penyebutnya (dengan pembilang sama), semakin kecil potongannya.$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Ibu memotong semangka menjadi 8 bagian sama besar. Adi makan 3 bagian. Tuliskan pecahannya dan sebutkan pembilang serta penyebutnya!$$, $$2. Tentukan pecahan senilai dari 2/3 dengan mengalikan pembilang dan penyebut dengan 4!$$, $$3. Manakah yang lebih besar: 2/4 atau 3/4? Jelaskan alasanmu!$$])),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), 'e1200006-0000-0000-0000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Pecahannya 3/8. Pembilang = 3 (bagian yang dimakan), penyebut = 8 (seluruh bagian).$$, $$2. (2x4)/(3x4) = 8/12. Jadi pecahan senilainya adalah 8/12.$$ , $$3. 3/4 lebih besar karena penyebut sama (4), dan pembilang 3 lebih besar dari 2.$$]))
ON CONFLICT (id) DO NOTHING;
