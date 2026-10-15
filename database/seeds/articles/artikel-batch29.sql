-- Artikel konten Madevi batch 29 — 2026-10-13
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- 6 artikel: 2 Tutorial + 2 Explore + 2 School

-- ============ 1. TUT-PERNIKAHAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0001-4000-8000-000000000001', 'TUT-PERNIKAHAN-001', 'b2222222-2222-2222-2222-222222222222',
'Persiapan Nikah: Checklist 6 Bulan Menuju Hari H', 'persiapan-nikah-checklist-6-bulan',
'Panduan lengkap mempersiapkan pernikahan dari 6 bulan sebelum hari H: budget, gedung, vendor, dokumen, hingga hari pelaksanaan.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Persiapan Nikah yang Kacau$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Banyak pasangan kewalahan menjelang hari H: vendor belum lunas, gedung bentrok jadwal, dokumen KUA belum lengkap, dan budget membengkak tanpa terkendali. Akar masalahnya hampir selalu sama: tidak ada timeline persiapan yang jelas sejak awal.$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kenapa Butuh 6 Bulan$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Gedung dan vendor bagus biasanya penuh 3-6 bulan sebelumnya. Dokumen administrasi (KUA/catatan sipil) butuh waktu 1-3 bulan. Dengan timeline 6 bulan, setiap keputusan bisa diambil dengan tenang tanpa terburu-buru dan tanpa membayar harga "mepet".$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Spreadsheet/anggaran pernikahan (template gratis banyak tersedia)$$, $$Grup chat keluarga inti untuk koordinasi$$, $$Map dokumen: KTP, KK, akta lahir, surat pengantar RT/RW$$, $$Dana darurat 10-15% dari total budget$$])),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Checklist per Bulan$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$H-6: Tetapkan budget total, booking gedung, tentukan tanggal, diskusikan konsep acara$$, $$H-5: Booking katering, fotografer/videografer, MUA; mulai urus dokumen KUA$$, $$H-4: Pesan undangan, fitting baju pengantin, booking hiburan/MC$$, $$H-3: Finalisasi daftar tamu, sebar undangan, technical meeting dengan semua vendor$$, $$H-2: Gladi resik, konfirmasi ulang semua vendor, siapkan souvenir$$, $$H-1: Istirahat cukup, siapkan amplop/uang tunai cadangan, briefing keluarga$$])),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan bayar lunas vendor jauh sebelum hari H — gunakan termin (DP 30-50%). Waspadai calo gedung yang meminta "uang booking" tanpa kwitansi resmi. Jangan tambah daftar tamu di menit terakhir; setiap 50 tamu ekstra bisa menambah biaya katering belasan juta rupiah.$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '7100a001-0001-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Dengan checklist ini, H-7 semua sudah beres dan minggu terakhir tinggal menenangkan pikiran. Kunci sukses: satu orang penanggung jawab (koordinator), semua keputusan tercatat tertulis, dan tidak ada perubahan konsep besar setelah H-2.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 2. TUT-KARYAWAN-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0002-4000-8000-000000000002', 'TUT-KARYAWAN-001', 'b3333333-3333-3333-3333-333333333333',
'Naik Gaji: Strategi Negosiasi yang Masuk Akal', 'naik-gaji-strategi-negosiasi',
'Cara meminta kenaikan gaji dengan persiapan data, timing yang tepat, dan teknik negosiasi profesional — bukan sekadar mengeluh.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Gaji Stagnan Bertahun-tahun$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Beban kerja bertambah, tanggung jawab melebar, tapi gaji tidak bergerak. Banyak karyawan takut meminta kenaikan karena khawatir dianggap tidak bersyukur atau malah dipecat. Padahal negosiasi gaji adalah hal normal dalam dunia kerja profesional.$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Cara Perusahaan Menilai$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Atasan memutuskan kenaikan berdasarkan tiga hal: kontribusi terukur, harga pasar posisi Anda, dan budget tim. Argumen "sudah lama kerja" lemah; argumen "saya menghasilkan X dan pasar membayar Y" kuat. Maka persiapan data adalah 80% keberhasilan negosiasi.$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat yang Dibutuhkan$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Daftar pencapaian 6-12 bulan terakhir (angka, bukan perasaan)$$, $$Data gaji pasar: survei JobStreet, Glassdoor, atau info komunitas profesi$$, $$Jadwal 1-on-1 dengan atasan (jangan dadakan di koridor)$$, $$Angka target: gaji ideal + angka minimum yang masih diterima$$])),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Langkah Negosiasi$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Minta waktu khusus: "Boleh diskusi 30 menit soal perkembangan karier saya minggu ini?"$$, $$2. Buka dengan kontribusi: sampaikan 3 pencapaian terbesar dengan angka$$, $$3. Sampaikan riset pasar: "Untuk posisi dan pengalaman seperti ini, kisarannya X-Y"$$, $$4. Ajukan angka spesifik: "Saya berharap penyesuaian ke angka X" (bukan "terserah bapak/ibu")$$, $$5. Jika ditolak, tanya syaratnya: "Apa yang perlu saya capai agar 6 bulan lagi bisa didiskusikan ulang?" — minta tertulis$$])),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan mengancam resign kecuali Anda benar-benar siap pergi dan sudah punya tawaran lain — bluffing yang ketahuan merusak kredibilitas. Jangan bandingkan gaji dengan rekan kerja secara spesifik ("si A digaji sekian"); itu melanggar etika dan membuat atasan defensif. Jangan ajukan saat perusahaan sedang PHK atau rugi besar.$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), '7100a001-0002-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Hasil terbaik biasanya kenaikan 10-20% untuk karyawan berkinerja baik. Jika gaji tidak bisa naik, negosiasikan kompensasi lain: bonus, tunjangan, WFH, atau budget training. Dan jika setelah dua kali diskusi tidak ada progres sama sekali, itu sinyal kuat untuk mulai melamar ke tempat lain — pasarlah yang akan menilai harga Anda dengan jujur.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 3. EXP-FILSAFAT2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0003-4000-8000-000000000003', 'EXP-FILSAFAT2-001', 'c8888888-8888-8888-8888-888888888888',
'Eksistensialisme: Mencari Makna Hidup di Dunia yang Absurd', 'eksistensialisme-makna-hidup',
'Pengantar filsafat eksistensialisme: dari Sartre dan "eksistensi mendahului esensi" hingga cara menghadapi kebebasan dan tanggung jawab hidup.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Pertanyaan Tertua Manusia$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Untuk apa saya hidup? Apakah hidup ini punya makna bawaan, atau kitalah yang harus menciptakannya? Eksistensialisme — aliran filsafat yang populer di abad ke-20 — menjawab dengan tegas: tidak ada makna yang sudah jadi. Andalah yang menulisnya lewat pilihan-pilihan Anda.$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$"Eksistensi Mendahului Esensi"$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Jean-Paul Sartre merumuskannya begini: sebuah pisau dibuat dengan tujuan memotong — esensinya ada sebelum ia ada. Manusia sebaliknya: kita lahir dulu ke dunia tanpa "tujuan bawaan", lalu lewat pilihan kitalah esensi (siapa kita) terbentuk. Kita "terkutuk untuk bebas" — bahkan tidak memilih pun adalah sebuah pilihan.$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Kebebasan yang Menakutkan$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Kebebasan total terdengar indah, tapi Sartre menyebutnya sumber "anguish" (kegelisahan): karena bebas, kita bertanggung jawab penuh atas hidup kita. Tidak bisa menyalahkan nasib, orang tua, atau keadaan. Inilah mengapa banyak orang lari ke "bad faith" (ketidakjujuran pada diri sendiri) — berpura-pura tidak punya pilihan agar tidak perlu bertanggung jawab.$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Camus dan Si Absurd$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Albert Camus menambahkan sudut pandang "absurd": manusia haus makna, dunia diam tak menjawab. Responsnya bukan bunuh diri (fisik maupun filosofis), melainkan pemberontakan: hidup sepenuh hati meski tahu hidup ini absurd — seperti Sisyphus yang terus mendorong batu ke puncak dengan senyuman. "Kita harus membayangkan Sisyphus bahagia."$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Tokoh-tokoh Kunci$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Soren Kierkegaard — bapak eksistensialisme; iman sebagai "lompatan"$$, $$Friedrich Nietzsche — "Tuhan telah mati"; manusia menciptakan nilainya sendiri$$, $$Jean-Paul Sartre — kebebasan radikal dan tanggung jawab$$, $$Simone de Beauvoir — eksistensialisme feminis ("seseorang tidak lahir, melainkan menjadi perempuan")$$, $$Albert Camus — filsafat absurd dan pemberontakan$$])),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'HEADING', 11, jsonb_build_object('text', $$Apa Artinya Buat Kita$$)),
(gen_random_uuid(), '7100a001-0003-4000-8000-000000000003', 'PARAGRAPH', 12, jsonb_build_object('text', $$Eksistensialisme bukan ajaran putus asa — ia justru pemberdayaan: karena tidak ada skenario yang ditulis untuk Anda, setiap pilihan adalah karya Anda. Makna hidup bukan ditemukan seperti harta karun, melainkan dibangun: lewat pekerjaan yang jujur, hubungan yang tulus, dan keberanian memikul akibat pilihan sendiri.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 4. EXP-KIMIA4-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0004-4000-8000-000000000004', 'EXP-KIMIA4-001', 'c4444444-4444-4444-4444-444444444444',
'Radioaktivitas: Manfaat dan Bahaya di Balik Peluruhan Atom', 'radioaktivitas-manfaat-bahaya',
'Mengenal radioaktivitas: jenis radiasi alfa-beta-gamma, manfaat di medis dan energi, serta bahaya dan cara berlindung.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Radioaktivitas$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Inti atom yang tidak stabil (seperti uranium-238 atau karbon-14) meluruh spontan menjadi inti yang lebih stabil sambil memancarkan energi sebagai radiasi. Proses ini ditemukan Henri Becquerel pada 1896 dan dipelajari mendalam oleh Marie Curie — yang akhirnya wafat karena paparan radiasi penelitiannya sendiri.$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Tiga Jenis Radiasi$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'LIST', 4, jsonb_build_object('items', ARRAY[$$Alfa (α): partikel helium; daya tembus lemah — tertahan kertas, tapi sangat berbahaya jika terhirup/tertelan$$, $$Beta (β): elektron berkecepatan tinggi; tertahan aluminium tipis$$, $$Gamma (γ): gelombang elektromagnetik energi tinggi; butuh timbal atau beton tebal untuk menahan$$])),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Manfaatnya Nyata$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Medis: radioterapi membunuh sel kanker; sinar-X dan CT-scan untuk diagnosis; iodin-131 mengobati gangguan tiroid$$, $$Energi: PLTN menghasilkan listrik tanpa emisi karbon — 1 kg uranium setara ±3.000 ton batu bara$$, $$Industri & riset: penanggalan karbon-14 untuk fosil; sterilisasi alat medis; sensor asap amerisium$$])),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Bahaya yang Serius$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Radiasi pengion merusak DNA: dosis tinggi menyebabkan luka bakar radiasi dan kematian dalam hitungan hari; dosis menengah-terus-menerus meningkatkan risiko kanker dan mutasi genetik. Kecelakaan Chernobyl (1986) dan Fukushima (2011) menunjukkan betapa mahalnya kelalaian keselamatan nuklir.$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Prinsip Perlindungan$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Waktu: batasi durasi paparan sesingkat mungkin$$, $$Jarak: intensitas berkurang kuadrat terhadap jarak — menjauhlah$$, $$Perisai: gunakan penahan sesuai jenis radiasi$$, $$Pantau: pekerja nuklir memakai dosimeter film/badge$$])),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'HEADING', 11, jsonb_build_object('text', $$Kesimpulan$$)),
(gen_random_uuid(), '7100a001-0004-4000-8000-000000000004', 'PARAGRAPH', 12, jsonb_build_object('text', $$Radioaktivitas bukan "jahat" atau "baik" — ia adalah fenomena fisika netral. Seperti api, ia menghangatkan atau membakar tergantung cara kita mengelolanya. Kuncinya: pemahaman ilmiah, regulasi ketat, dan rasa hormat pada risikonya.$$))
ON CONFLICT (id) DO NOTHING;

-- ============ 5. SCH-SMP-SEJ2-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0005-4000-8000-000000000005', 'SCH-SMP-SEJ2-001', 'd4444444-4444-4444-4444-444444444444',
'IPS Kelas 9: Globalisasi — Dunia Tanpa Batas', 'ips-kelas-9-globalisasi',
'Materi IPS kelas 9: pengertian globalisasi, faktor pendorong, dampak positif-negatif, dan sikap menghadapi era global.',
'id', 7, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian globalisasi, (2) mengidentifikasi faktor pendorongnya, (3) menganalisis dampak positif dan negatif, serta (4) menentukan sikap yang tepat sebagai pelajar Indonesia di era global.$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Globalisasi$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Globalisasi adalah proses mendunianya berbagai aspek kehidupan — ekonomi, budaya, teknologi, dan informasi — sehingga batas antarnegara menjadi kabur. Contoh sederhana: kamu memakai HP buatan Korea, menonton film Amerika di aplikasi, dan memesan makanan lewat perusahaan Singapura. Itulah globalisasi dalam kehidupan sehari-hari.$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Faktor Pendorong$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Kemajuan teknologi komunikasi dan transportasi (internet, pesawat jet)$$, $$Perdagangan bebas dan pasar internasional (WTO, ASEAN)$$, $$Arus modal dan investasi asing$$, $$Migrasi penduduk dan pertukaran budaya$$])),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Dampak Positif$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Akses informasi dan ilmu pengetahuan makin mudah; pilihan barang/jasa makin beragam dan murah; lapangan kerja dan investasi bertambah; kerja sama antarnegara (misalnya penanganan pandemi) makin erat.$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Dampak Negatif$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Budaya lokal tergerus budaya asing (westernisasi); kesenjangan ekonomi melebar antara yang mampu bersaing dan yang tidak; ketergantungan pada produk/utang luar negeri; masuknya paham yang bertentangan dengan Pancasila jika tidak disaring.$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Sebutkan 3 faktor pendorong globalisasi!$$, $$2. Jelaskan 2 dampak positif dan 2 dampak negatif globalisasi bagi Indonesia!$$, $$3. Sebagai pelajar, sikap apa yang tepat menghadapi globalisasi? Jelaskan!$$])),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'HEADING', 13, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), '7100a001-0005-4000-8000-000000000005', 'LIST', 14, jsonb_build_object('items', ARRAY[$$1. Teknologi komunikasi/transportasi, perdagangan bebas, arus modal/investasi (atau migrasi budaya)$$, $$2. Positif: akses info mudah, barang murah beragam. Negatif: budaya lokal tergerus, kesenjangan melebar$$, $$3. Selektif menyaring budaya asing, mencintai produk dalam negeri, meningkatkan kompetensi agar mampu bersaing$$]))
ON CONFLICT (id) DO NOTHING;

-- ============ 6. SCH-SD-MAT7-001 ============
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('7100a001-0006-4000-8000-000000000006', 'SCH-SD-MAT7-001', 'd2000001-0000-0000-0000-000000000001',
'Matematika Kelas 1: Mengukur Panjang dengan Satuan Tidak Baku', 'matematika-kelas-1-pengukuran-panjang',
'Materi matematika kelas 1 SD: mengukur panjang benda dengan jengkal, hasta, dehasta, dan langkah — lengkap dengan contoh dan latihan.',
'id', 6, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah belajar, adik-adik bisa: (1) menyebutkan alat ukur panjang tidak baku, (2) mengukur panjang benda dengan jengkal dan hasta, (3) membandingkan panjang dua benda (lebih panjang/lebih pendek).$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Satuan Tidak Baku$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Sebelum ada penggaris, orang mengukur dengan anggota tubuh! Ini namanya satuan tidak baku karena hasilnya beda-beda tiap orang. Contohnya: jengkal (jarak ibu jari ke kelingking saat direntangkan), hasta (siku ke ujung jari), depa (ujung jari kiri ke kanan saat tangan direntangkan), dan langkah kaki.$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Contoh: Mengukur Meja$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'PARAGRAPH', 6, jsonb_build_object('text', $$Rentangkan jarimu dari ibu jari sampai kelingking — itu 1 jengkal. Tempelkan di ujung meja, tandai, ulangi sampai ujung satunya. Misalnya meja panjangnya 6 jengkal. Coba ukur dengan jengkal ayah — hasilnya bisa 5 jengkal karena tangan ayah lebih besar! Inilah kenapa disebut "tidak baku".$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Membandingkan Panjang$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'LIST', 8, jsonb_build_object('items', ARRAY[$$Pensil 2 jengkal, penggaris kayu 3 jengkal → penggaris LEBIH PANJANG$$, $$Buku 4 jengkal, kotak pensil 4 jengkal → SAMA PANJANG$$, $$Meja 6 jengkal, kursi 4 jengkal → kursi LEBIH PENDEK$$])),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'LIST', 10, jsonb_build_object('items', ARRAY[$$1. Ukur panjang buku tulismu dengan jengkal. Berapa jengkal?$$, $$2. Mana lebih panjang: meja belajarmu atau tempat tidurmu? Ukur dengan langkah!$$, $$3. Sebutkan 3 benda yang bisa diukur dengan hasta!$$])),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Kunci Jawaban$$)),
(gen_random_uuid(), '7100a001-0006-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Jawaban tergantung tanganmu — yang penting caranya benar: tempel-tandai-ulangi$$, $$2. Tempat tidur lebih panjang (biasanya 6-8 langkah vs meja 3-4 langkah)$$, $$3. Contoh: papan tulis, pintu, kain, karpet$$]))
ON CONFLICT (id) DO NOTHING;
