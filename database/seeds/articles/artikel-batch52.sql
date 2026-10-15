-- ============================================================
-- Madevi artikel batch 52 (idempoten, bisa dijalankan ulang)
-- 6 artikel: 2 Tutorial + 2 Explore + 2 School, status DRAFT
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- ============================================================
BEGIN;

-- ---------- ARTIKEL ----------
INSERT INTO madevi.articles
  (id, business_code, taxonomy_node_id, title, slug, summary, language,
   reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES
  ('e5200001-0001-4001-8001-000000000001', 'TUT-KOMPUTER9-001',
   'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Zoom Meeting: Tips Profesional',
   'zoom-meeting-tips-profesional',
   'Panduan tampil profesional di meeting online: persiapan perangkat, etika, dan checklist anti gagal.',
   'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5200002-0002-4002-8002-000000000002', 'TUT-KESEHATAN13-001',
   'b5555555-5555-5555-5555-555555555555',
   'Sakit Gigi: Pertolongan Pertama',
   'sakit-gigi-pertolongan-pertama',
   'Cara meredakan sakit gigi sementara di rumah dan tanda bahaya yang mengharuskan ke dokter gigi.',
   'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5200003-0003-4003-8003-000000000003', 'EXP-ANTROPOLOGI8-001',
   'c8888888-8888-8888-8888-888888888888',
   'Suku Bugis: Pelaut Ulung Nusantara',
   'suku-bugis-pelaut-ulung',
   'Mengenal suku Bugis: tradisi maritim, kapal pinisi, filosofi hidup, dan nilai siri serta pesse.',
   'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5200004-0004-4004-8004-000000000004', 'EXP-KIMIA11-001',
   'c4444444-4444-4444-4444-444444444444',
   'Senyawa Organik: Dasar Kehidupan',
   'senyawa-organik-dasar-kehidupan',
   'Apa itu senyawa organik, keistimewaan karbon, kelompok utamanya, dan perannya dalam tubuh makhluk hidup.',
   'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5200005-0005-4005-8005-000000000005', 'SCH-SMP-BIO5-001',
   'd4444444-4444-4444-4444-444444444444',
   'IPA Kelas 8: Sistem Ekskresi',
   'ipa-kelas-8-sistem-ekskresi',
   'Materi IPA kelas 8: organ ekskresi, proses pembentukan urine, gangguan, latihan soal, dan kunci jawaban.',
   'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e5200006-0006-4006-8006-000000000006', 'SCH-SD-IPS9-001',
   'd3333333-3333-3333-3333-333333333333',
   'IPS Kelas 5: Kerajaan Hindu-Buddha di Indonesia',
   'ips-kelas-5-kerajaan-hindu-buddha',
   'Materi IPS kelas 5: masuknya Hindu-Buddha, kerajaan-kerajaan besar, peninggalan, latihan, dan kunci jawaban.',
   'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (id) DO NOTHING;

-- Hapus block lama agar re-run idempoten
DELETE FROM madevi.article_blocks WHERE article_id IN (
  'e5200001-0001-4001-8001-000000000001',
  'e5200002-0002-4002-8002-000000000002',
  'e5200003-0003-4003-8003-000000000003',
  'e5200004-0004-4004-8004-000000000004',
  'e5200005-0005-4005-8005-000000000005',
  'e5200006-0006-4006-8006-000000000006'
);

-- ---------- BLOCKS: TUT-KOMPUTER9-001 (12) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Meeting Online yang Terasa Berantakan$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak orang mengikuti meeting online dengan kamera mati, suara putus-putus, dan latar berisik. Hasilnya pesan tidak tersampaikan, citra profesional menurun, dan meeting berubah menjadi buang-buang waktu. Masalahnya jarang terletak pada aplikasinya, melainkan pada persiapan pesertanya.$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 2, jsonb_build_object('text', $txt$Kenapa Meeting Online Sering Gagal$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Tiga penyebab utama: koneksi internet yang tidak stabil, perangkat yang tidak disiapkan (mic, kamera, baterai), dan etika meeting yang diabaikan seperti berbicara tanpa mute atau sibuk mengerjakan hal lain. Ketiganya bisa dicegah hanya dengan persiapan sekitar sepuluh menit.$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 4, jsonb_build_object('text', $txt$Alat yang Perlu Disiapkan$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'LIST', 5, jsonb_build_object('items', ARRAY[$txt$Laptop atau HP dengan aplikasi Zoom versi terbaru$txt$, $txt$Earphone atau headset agar suara jernih dan tidak menimbulkan gema$txt$, $txt$Koneksi internet stabil (minimal 1,5 Mbps untuk video HD)$txt$, $txt$Charger atau baterai yang terisi penuh$txt$, $txt$Latar yang rapi atau virtual background yang sopan$txt$])),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 6, jsonb_build_object('text', $txt$Langkah: Tampil Profesional di Zoom$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'LIST', 7, jsonb_build_object('items', ARRAY[$txt$Uji kamera, mic, dan speaker lewat menu Settings lalu Audio dan Video sebelum meeting dimulai$txt$, $txt$Bergabung lima menit lebih awal untuk mengantisipasi masalah teknis$txt$, $txt$Nyalakan kamera, posisikan sejajar mata, dan pastikan wajah mendapat cahaya cukup$txt$, $txt$Jadikan mute sebagai posisi default; tahan tombol spasi untuk bicara sementara$txt$, $txt$Gunakan fitur Raise Hand dan Chat untuk bertanya dengan tertib$txt$, $txt$Tutup aplikasi berat lain agar perangkat tidak lemot saat meeting$txt$])),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 8, jsonb_build_object('text', $txt$Risiko dan Jebakan Umum$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'LIST', 9, jsonb_build_object('items', ARRAY[$txt$Berbagi layar tanpa menutup tab pribadi: selalu periksa dulu apa yang tampil di layar$txt$, $txt$Lupa mute saat ada suara latar: biasakan mengecek status mic$txt$, $txt$Koneksi drop di tengah presentasi: siapkan hotspot HP sebagai cadangan$txt$])),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'HEADING', 10, jsonb_build_object('text', $txt$Checklist Dua Menit Sebelum Meeting$txt$)),
(gen_random_uuid(), 'e5200001-0001-4001-8001-000000000001', 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Periksa satu per satu: kamera menyala dan terang, mic berfungsi, earphone terpasang, baterai atau charger aman, tab pribadi sudah tertutup, dan latar terlihat rapi. Jika semuanya centang, Anda siap tampil profesional. Ingat: meeting yang baik dimulai dari persiapan, bukan dari aplikasinya.$txt$));

-- ---------- BLOCKS: TUT-KESEHATAN13-001 (12) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Sakit Gigi Menyerang Tiba-tiba$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Sakit gigi bisa datang kapan saja, termasuk malam hari saat klinik sudah tutup. Rasa nyeri berdenyut membuat sulit tidur, makan, dan beraktivitas. Pertolongan pertama yang tepat dapat meredakan nyeri untuk sementara sampai Anda bisa pergi ke dokter gigi.$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 2, jsonb_build_object('text', $txt$Kenapa Gigi Bisa Sakit$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Penyebab paling umum adalah gigi berlubang yang sudah mencapai saraf, radang gusi, gigi retak, atau sisa makanan yang tersangkut di sela gigi. Nyeri adalah sinyal bahwa ada masalah di dalam gigi: obat pereda hanya menutupi gejalanya, bukan menyembuhkan penyebabnya.$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 4, jsonb_build_object('text', $txt$Yang Perlu Disiapkan$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'LIST', 5, jsonb_build_object('items', ARRAY[$txt$Air hangat dan garam dapur untuk berkumur$txt$, $txt$Es batu dan kain bersih untuk kompres dingin$txt$, $txt$Obat pereda nyeri yang biasa Anda pakai, diminum sesuai dosis kemasan$txt$, $txt$Benang gigi untuk membersihkan sela gigi$txt$, $txt$Nomor klinik atau dokter gigi terdekat$txt$])),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 6, jsonb_build_object('text', $txt$Langkah Pertolongan Pertama$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'LIST', 7, jsonb_build_object('items', ARRAY[$txt$Bersihkan sela gigi dengan benang gigi: kadang nyeri hanya karena makanan tersangkut$txt$, $txt$Kumur air garam hangat (satu sendok teh garam dalam segelas air) selama 30 detik$txt$, $txt$Kompres dingin pipi bagian yang sakit selama 15 menit untuk mengurangi bengkak$txt$, $txt$Minum obat pereda nyeri sesuai dosis bila nyeri tidak tertahankan$txt$, $txt$Hindari makanan dan minuman yang sangat panas, dingin, atau manis pada gigi yang sakit$txt$, $txt$Tidur dengan posisi kepala lebih tinggi untuk mengurangi denyutan$txt$])),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 8, jsonb_build_object('text', $txt$Tanda Bahaya: Segera ke Dokter Gigi$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'LIST', 9, jsonb_build_object('items', ARRAY[$txt$Nyeri tidak hilang lebih dari dua hari meski sudah minum obat$txt$, $txt$Gusi atau pipi bengkak, apalagi disertai demam$txt$, $txt$Gigi patah, goyang, atau terlepas karena benturan$txt$, $txt$Nyeri menyebar ke telinga, rahang, atau leher$txt$, $txt$Bau mulut tak sedap disertai rasa pahit, tanda kemungkinan infeksi$txt$])),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'HEADING', 10, jsonb_build_object('text', $txt$Yang Tidak Boleh Dilakukan$txt$)),
(gen_random_uuid(), 'e5200002-0002-4002-8002-000000000002', 'PARAGRAPH', 11, jsonb_build_object('text', $txt$Jangan menaruh obat langsung di gusi karena bisa melukai jaringan, jangan mencabut gigi sendiri, jangan minum antibiotik tanpa resep dokter, dan jangan menunda ke dokter gigi hanya karena nyeri sudah reda: lubang yang dibiarkan hanya akan semakin dalam. Catatan: artikel ini berisi informasi umum, bukan pengganti nasihat medis. Segera konsultasikan ke dokter gigi untuk diagnosis dan penanganan yang tepat.$txt$));

-- ---------- BLOCKS: EXP-ANTROPOLOGI8-001 (10) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'HEADING', 0, jsonb_build_object('text', $txt$Siapa Suku Bugis?$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Suku Bugis adalah kelompok etnis terbesar di Sulawesi Selatan, berpusat di wilayah seperti Bone, Wajo, Soppeng, dan Sidrap. Mereka terkenal di seluruh Nusantara sebagai pelaut dan pedagang ulung yang menjelajah lautan jauh sebelum era modern.$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'HEADING', 2, jsonb_build_object('text', $txt$Tradisi Maritim yang Melegenda$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sejak abad ke-17, pelaut Bugis berlayar hingga ke Malaka, Jawa, dan Kalimantan untuk berdagang. Mereka membaca bintang, angin muson, dan arus laut sebagai kompas alami: pengetahuan navigasi yang diwariskan turun-temurun dari generasi ke generasi.$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'HEADING', 4, jsonb_build_object('text', $txt$Pinisi: Mahakarya Kapal Layar$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Kapal pinisi adalah kebanggaan Bugis: kapal layar tradisional yang dibangun tanpa gambar teknik modern, hanya mengandalkan keahlian turun-temurun para pembuat kapal di Tana Beru, Bulukumba. Keahlian pembuatan pinisi diakui UNESCO sebagai Warisan Budaya Takbenda pada tahun 2017.$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'HEADING', 6, jsonb_build_object('text', $txt$Filosofi Hidup Pelaut$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Orang Bugis memegang prinsip kerja keras tanpa putus asa yang diyakini akan mendatangkan berkah. Semangat merantau membuat diaspora Bugis tersebar dari Sumatera hingga Papua dan Malaysia, banyak yang sukses sebagai pedagang dan pengusaha.$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'HEADING', 8, jsonb_build_object('text', $txt$Sistem Nilai: Siri dan Pesse$txt$)),
(gen_random_uuid(), 'e5200003-0003-4003-8003-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Dua nilai utama masyarakat Bugis adalah siri, yaitu harga diri yang wajib dijaga, dan pesse, yaitu empati dan solidaritas terhadap sesama. Keduanya mengatur perilaku sosial mulai dari urusan dagang hingga penyelesaian konflik, dan masih hidup kuat hingga saat ini.$txt$));

-- ---------- BLOCKS: EXP-KIMIA11-001 (10) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Senyawa Organik?$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Senyawa organik adalah senyawa kimia yang mengandung unsur karbon (C), umumnya berikatan dengan hidrogen (H), oksigen (O), dan nitrogen (N). Hampir semua molekul penyusun makhluk hidup, dari gula hingga DNA, adalah senyawa organik.$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'HEADING', 2, jsonb_build_object('text', $txt$Kenapa Karbon Istimewa?$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Karbon memiliki empat elektron valensi sehingga dapat membentuk empat ikatan kovalen sekaligus, termasuk ikatan dengan sesama atom karbon. Kemampuan ini memungkinkan karbon menyusun rantai panjang, cabang, dan cincin: kerangka bagi jutaan senyawa yang berbeda.$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'HEADING', 4, jsonb_build_object('text', $txt$Kelompok Utama Senyawa Organik$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'LIST', 5, jsonb_build_object('items', ARRAY[$txt$Hidrokarbon: hanya tersusun dari C dan H, contoh metana dan bensin$txt$, $txt$Alkohol: mengandung gugus -OH, contoh etanol$txt$, $txt$Asam karboksilat: mengandung gugus -COOH, contoh asam cuka$txt$, $txt$Karbohidrat: gula dan pati, sumber energi tubuh$txt$, $txt$Protein: tersusun dari asam amino, pembangun sel dan enzim$txt$, $txt$Lipid: lemak dan minyak, cadangan energi dan penyusun membran sel$txt$])),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'HEADING', 6, jsonb_build_object('text', $txt$Senyawa Organik dalam Tubuh$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tubuh manusia adalah pabrik senyawa organik: karbohidrat menjadi bahan bakar, protein membangun otot dan enzim, lipid menyusun membran sel, sedangkan asam nukleat seperti DNA dan RNA menyimpan serta mewariskan informasi genetik.$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'HEADING', 8, jsonb_build_object('text', $txt$Organik versus Anorganik$txt$)),
(gen_random_uuid(), 'e5200004-0004-4004-8004-000000000004', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Senyawa anorganik umumnya tidak mengandung ikatan karbon-hidrogen, misalnya air (H2O), garam dapur (NaCl), dan karbon dioksida (CO2). Batasnya tidak mutlak, tetapi penggolongan ini tetap berguna untuk memahami kimia kehidupan.$txt$));

-- ---------- BLOCKS: SCH-SMP-BIO5-001 (12) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan pengertian sistem ekskresi, (2) menyebutkan organ-organ ekskresi beserta zat yang dikeluarkan, (3) menjelaskan tiga tahap pembentukan urine pada ginjal, dan (4) menyebutkan gangguan pada sistem ekskresi serta cara pencegahannya.$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 2, jsonb_build_object('text', $txt$Pengertian Sistem Ekskresi$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Ekskresi adalah proses pengeluaran zat sisa metabolisme yang sudah tidak berguna dan berbahaya bila menumpuk, misalnya karbon dioksida, urea, serta kelebihan air dan garam. Ekskresi berbeda dengan defekasi: defekasi mengeluarkan sisa makanan yang tidak dicerna, sedangkan ekskresi mengeluarkan sisa hasil metabolisme sel.$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 4, jsonb_build_object('text', $txt$Organ-organ Ekskresi$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'LIST', 5, jsonb_build_object('items', ARRAY[$txt$Ginjal: menyaring darah dan menghasilkan urine yang mengandung urea, air, dan garam$txt$, $txt$Kulit: mengeluarkan keringat yang mengandung air, garam, dan sedikit urea$txt$, $txt$Paru-paru: mengeluarkan karbon dioksida dan uap air saat bernapas$txt$, $txt$Hati: mengolah zat beracun dan menghasilkan empedu$txt$])),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 6, jsonb_build_object('text', $txt$Proses Pembentukan Urine$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Di dalam ginjal, darah disaring melalui tiga tahap. Filtrasi terjadi di glomerulus dan menghasilkan urine primer. Reabsorpsi terjadi di tubulus: zat yang masih berguna seperti glukosa dan sebagian air diserap kembali ke darah. Augmentasi menambahkan sisa zat berbahaya sehingga terbentuk urine sesungguhnya yang dialirkan ke kandung kemih.$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 8, jsonb_build_object('text', $txt$Gangguan dan Pencegahannya$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'LIST', 9, jsonb_build_object('items', ARRAY[$txt$Batu ginjal: endapan mineral di ginjal; cegah dengan cukup minum air putih$txt$, $txt$Gagal ginjal: ginjal tidak mampu menyaring darah; cegah dengan pola hidup sehat dan batasi obat sembarangan$txt$, $txt$Diabetes insipidus: urine berlebihan karena gangguan hormon; perlu penanganan dokter$txt$, $txt$Infeksi saluran kemih: cegah dengan menjaga kebersihan dan tidak menahan buang air kecil$txt$])),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
(gen_random_uuid(), 'e5200005-0005-4005-8005-000000000005', 'LIST', 11, jsonb_build_object('items', ARRAY[$txt$Soal 1: Sebutkan empat organ ekskresi beserta zat sisa yang dikeluarkannya!$txt$, $txt$Soal 2: Jelaskan perbedaan filtrasi, reabsorpsi, dan augmentasi!$txt$, $txt$Soal 3: Mengapa urine orang yang kekurangan air berwarna lebih pekat?$txt$, $txt$Kunci 1: ginjal menghasilkan urine, kulit mengeluarkan keringat, paru-paru mengeluarkan CO2, hati menghasilkan empedu$txt$, $txt$Kunci 2: filtrasi adalah penyaringan darah, reabsorpsi adalah penyerapan kembali zat yang masih berguna, augmentasi adalah penambahan zat sisa$txt$, $txt$Kunci 3: karena ginjal menyerap kembali lebih banyak air sehingga urine menjadi lebih pekat$txt$]));

-- ---------- BLOCKS: SCH-SD-IPS9-001 (12) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Setelah belajar materi ini, kamu diharapkan bisa: (1) menceritakan bagaimana agama Hindu dan Buddha masuk ke Indonesia, (2) menyebutkan kerajaan Hindu dan Buddha yang pernah berdiri di Indonesia, dan (3) menyebutkan peninggalan kerajaan-kerajaan tersebut yang masih bisa kita lihat sampai sekarang.$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 2, jsonb_build_object('text', $txt$Masuknya Hindu-Buddha ke Indonesia$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sekitar abad ke-4 Masehi, para pedagang dari India datang ke Nusantara untuk berdagang. Selain berdagang, mereka juga membawa ajaran agama Hindu dan Buddha. Para raja di Nusantara tertarik lalu memeluk agama tersebut, sehingga berdirilah kerajaan-kerajaan Hindu dan Buddha.$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 4, jsonb_build_object('text', $txt$Kerajaan Hindu di Indonesia$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'LIST', 5, jsonb_build_object('items', ARRAY[$txt$Kerajaan Kutai di Kalimantan Timur: kerajaan Hindu tertua, rajanya Mulawarman$txt$, $txt$Kerajaan Tarumanegara di Jawa Barat: rajanya Purnawarman$txt$, $txt$Kerajaan Mataram Kuno di Jawa Tengah$txt$, $txt$Kerajaan Kediri dan Singasari di Jawa Timur$txt$, $txt$Kerajaan Majapahit: kerajaan Hindu terbesar di Nusantara$txt$])),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 6, jsonb_build_object('text', $txt$Kerajaan Buddha di Indonesia$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'LIST', 7, jsonb_build_object('items', ARRAY[$txt$Kerajaan Sriwijaya di Sumatera: kerajaan maritim Buddha yang sangat kuat$txt$, $txt$Wangsa Syailendra di Jawa Tengah: pembangun Candi Borobudur$txt$])),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 8, jsonb_build_object('text', $txt$Peninggalan yang Masih Ada$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Peninggalan kerajaan Hindu-Buddha masih bisa kita lihat sampai sekarang, misalnya Candi Borobudur peninggalan Buddha dan Candi Prambanan peninggalan Hindu. Selain candi, ada juga prasasti berisi tulisan kuno, serta pengaruh bahasa Sanskerta dalam bahasa Indonesia.$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
(gen_random_uuid(), 'e5200006-0006-4006-8006-000000000006', 'LIST', 11, jsonb_build_object('items', ARRAY[$txt$Soal 1: Bagaimana agama Hindu dan Buddha bisa masuk ke Indonesia?$txt$, $txt$Soal 2: Sebutkan dua kerajaan Hindu dan satu kerajaan Buddha di Indonesia!$txt$, $txt$Soal 3: Sebutkan dua peninggalan kerajaan Hindu-Buddha yang masih ada sampai sekarang!$txt$, $txt$Kunci 1: dibawa oleh para pedagang dari India sekitar abad ke-4 Masehi$txt$, $txt$Kunci 2: kerajaan Hindu misalnya Kutai dan Majapahit; kerajaan Buddha misalnya Sriwijaya$txt$, $txt$Kunci 3: Candi Borobudur dan Candi Prambanan$txt$]));

COMMIT;
