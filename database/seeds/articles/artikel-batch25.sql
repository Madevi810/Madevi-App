-- Batch 25: 6 artikel (2 Tutorial, 2 Explore, 2 School)
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a | status='DRAFT', language='id'

-- ================= 1. TUT-RESEP-001: Soto Ayam Lamongan =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000001-0000-4000-8000-000000000001', 'TUT-RESEP-001', 'b2222222-2222-2222-2222-222222222222',
'Soto Ayam Lamongan: Resep Autentik Khas Jawa Timur', 'soto-ayam-lamongan-resep-autentik',
'Resep soto ayam Lamongan autentik: kuah bening berempah, koya gurih, dan pelengkap lengkap seperti di warung aslinya.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Soto Buatan Rumah Kurang "Nendang"$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'PARAGRAPH', 2, jsonb_build_object('text', $$Soto ayam buatan sendiri sering terasa hambar: kuahnya encer, bumbunya kurang meresap, dan tidak ada aroma khas seperti soto Lamongan di warung. Padahal soto Lamongan punya ciri khas yang bisa ditiru: kuah bening kekuningan dari kunyit, aroma serai dan daun jeruk yang kuat, serta taburan koya yang gurih.$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Kunci Kelezatan Soto Lamongan$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'PARAGRAPH', 4, jsonb_build_object('text', $$Tiga kunci soto Lamongan autentik: pertama, bumbu halus yang ditumis sampai benar-benar matang dan harum sebelum masuk kuah. Kedua, kaldu ayam kampung yang direbus lama hingga gurih alami. Ketiga, koya — campuran kerupuk udang dan bawang putih goreng yang dihaluskan — inilah pembeda utama soto Lamongan dari soto daerah lain.$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 5, jsonb_build_object('text', $$Bahan dan Alat$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'LIST', 6, jsonb_build_object('items', ARRAY[$$1 ekor ayam kampung (potong 4 bagian)$$, $$2 liter air$$, $$Bumbu halus: 8 bawang merah, 5 bawang putih, 4 kemiri sangrai, 3 cm kunyit, 2 cm jahe, 1 sdt ketumbar, 1/2 sdt merica$$, $$Bumbu cemplung: 3 batang serai geprek, 5 lembar daun jeruk, 3 lembar daun salam, 3 cm lengkuas geprek$$, $$Koya: 50 g kerupuk udang + 5 siung bawang putih goreng, haluskan$$, $$Pelengkap: soun, tauge, kol iris, telur rebus, seledri, bawang goreng, jeruk nipis, sambal$$])),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 7, jsonb_build_object('text', $$Langkah Memasak$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'LIST', 8, jsonb_build_object('items', ARRAY[$$1. Rebus ayam dengan 2 liter air hingga mendidih, buang busa kotorannya. Kecilkan api, rebus 45 menit sampai empuk. Angkat ayam, suwir-suwir dagingnya. Saring kaldu.$$,
$$2. Tumis bumbu halus dengan sedikit minyak hingga matang, harum, dan berubah warna lebih gelap (sekitar 10 menit). Masukkan bumbu cemplung, tumis 2 menit lagi.$$,
$$3. Masukkan tumisan bumbu ke dalam kaldu. Tambahkan garam, gula, dan kaldu bubuk secukupnya. Didihkan 15 menit agar bumbu meresap.$$,
$$4. Goreng suwiran ayam sebentar hingga kecokelatan untuk aroma smokey, atau langsung pakai jika suka versi rebus.$$,
$$5. Tata di mangkuk: nasi/soun, tauge, kol, suwiran ayam, telur rebus. Siram kuah panas. Taburi koya, seledri, dan bawang goreng. Sajikan dengan jeruk nipis dan sambal.$$])),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Kesalahan Umum$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'PARAGRAPH', 10, jsonb_build_object('text', $$Kesalahan paling sering: bumbu tidak ditumis sampai matang sehingga kuah berbau langu. Jangan masukkan bumbu mentah langsung ke kuah. Hindari api besar saat merebus kaldu karena membuat kuah keruh. Koya jangan dibuat terlalu jauh hari karena melempem — buat maksimal 3 hari sebelum disajikan dan simpan dalam wadah kedap udara.$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian dan Penyajian$$)),
(gen_random_uuid(), 'a0000001-0000-4000-8000-000000000001', 'PARAGRAPH', 12, jsonb_build_object('text', $$Soto paling nikmat disajikan panas-panas. Kuah sisa bisa disimpan di kulkas 3 hari atau dibekukan 2 minggu — panaskan ulang dengan api kecil. Untuk 6 porsi, total biaya bahan sekitar Rp60–80 ribu, jauh lebih hemat dari beli di warung. Selamat mencoba!$$))
ON CONFLICT (id) DO NOTHING;

-- ================= 2. TUT-BERSIH-001: Deep Cleaning Rumah =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000002-0000-4000-8000-000000000002', 'TUT-BERSIH-001', 'b7777777-7777-7777-7777-777777777777',
'Deep Cleaning Rumah: Checklist Lengkap per Ruangan', 'deep-cleaning-rumah-checklist-lengkap',
'Panduan deep cleaning rumah menyeluruh: checklist per ruangan, urutan kerja yang efisien, dan bahan pembersih yang tepat.',
'id', 9, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 1, jsonb_build_object('text', $$Masalah: Rumah Terasa Kotor Meski Sering Dibersihkan$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'PARAGRAPH', 2, jsonb_build_object('text', $$Beres-beres harian hanya menyentuh permukaan. Debu menumpuk di balik lemari, kerak di kamar mandi mengeras, dan noda di dapur membandel. Deep cleaning adalah pembersihan menyeluruh yang menjangkau area yang biasanya terlewat — idealnya dilakukan 3–6 bulan sekali.$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 3, jsonb_build_object('text', $$Penjelasan: Prinsip Deep Cleaning$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'PARAGRAPH', 4, jsonb_build_object('text', $$Prinsip utamanya: kerjakan dari atas ke bawah (langit-langit dulu, lantai terakhir) dan dari dalam ke luar (ruangan terjauh dari pintu dulu). Dengan begitu debu yang jatuh tidak mengotori area yang sudah bersih. Siapkan semua alat di awal agar tidak bolak-balik.$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 5, jsonb_build_object('text', $$Alat dan Bahan$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'LIST', 6, jsonb_build_object('items', ARRAY[$$Vacuum cleaner atau sapu + pengki$$, $$Kain microfiber (minimal 5 lembar)$$, $$Sikat gigi bekas untuk sela-sela$$, $$Cairan pembersih serbaguna, pembersih kaca, dan pembersih kerak kamar mandi$$, $$Cuka putih dan baking soda (pembersih alami serbaguna)$$, $$Sarung tangan karet dan masker debu$$, $$Kantong sampah besar$$])),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 7, jsonb_build_object('text', $$Checklist per Ruangan$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'LIST', 8, jsonb_build_object('items', ARRAY[$$KAMAR TIDUR: cuci seprai dan sarung bantal, balik/putar kasur, bersihkan kolong tempat tidur, lap jendela dan kusen, bersihkan kipas angin/lampu.$$,
$$RUANG TAMU: vacuum sofa (termasuk sela-selanya), lap rak dan hiasan, bersihkan remote dan saklar lampu, pel lantai.$$,
$$DAPUR: bersihkan dalam lemari dan kulkas (buang makanan kedaluwarsa), gosok kompor dan cooker hood dari minyak, bersihkan microwave, lap backsplash.$$,
$$KAMAR MANDI: sikat nat keramik, bersihkan kerak shower dan keran dengan cuka, cuci keset, bersihkan cermin, buang botol kosong.$$,
$$AREA UMUM: lap gagang pintu, bersihkan sudut langit-langit dari sarang laba-laba, pel seluruh lantai terakhir.$$])),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 9, jsonb_build_object('text', $$Risiko dan Hal yang Perlu Diwaspadai$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'PARAGRAPH', 10, jsonb_build_object('text', $$Jangan campur pemutih (bleach) dengan cuka atau pembersih lain — menghasilkan gas beracun. Gunakan sarung tangan saat memakai bahan kimia keras. Untuk lantai kayu, hindari air berlebihan karena bisa merusak. Pastikan ventilasi terbuka saat memakai pembersih berbau tajam.$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'HEADING', 11, jsonb_build_object('text', $$Penyelesaian$$)),
(gen_random_uuid(), 'a0000002-0000-4000-8000-000000000002', 'PARAGRAPH', 12, jsonb_build_object('text', $$Deep cleaning rumah tipe 36/45 memakan waktu 4–6 jam untuk satu orang. Bagi tugas jika dikerjakan berdua agar selesai dalam setengah hari. Setelah selesai, buat jadwal perawatan ringan mingguan agar deep cleaning berikutnya lebih ringan. Rumah bersih, pikiran pun tenang.$$))
ON CONFLICT (id) DO NOTHING;

-- ================= 3. EXP-ASTRONOMI3-001: Exoplanet =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000003-0000-4000-8000-000000000003', 'EXP-ASTRONOMI3-001', 'c5000002-0000-0000-0000-000000000002',
'Exoplanet: Perburuan Mencari Bumi Kedua', 'exoplanet-mencari-bumi-kedua',
'Bagaimana para astronom menemukan planet di luar tata surya dan mencari dunia yang mungkin layak huni seperti Bumi.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Exoplanet?$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'PARAGRAPH', 2, jsonb_build_object('text', $$Exoplanet adalah planet yang mengorbit bintang selain Matahari. Exoplanet pertama yang dikonfirmasi ditemukan pada tahun 1992 mengorbit pulsar, dan planet pertama di sekitar bintang mirip Matahari ditemukan tahun 1995 (51 Pegasi b). Hingga kini, lebih dari 5.500 exoplanet telah dikonfirmasi.$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'HEADING', 3, jsonb_build_object('text', $$Metode Transit: Bayangan Planet$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'PARAGRAPH', 4, jsonb_build_object('text', $$Metode paling produktif adalah metode transit: ketika planet melintas di depan bintangnya, kecerahan bintang meredup sedikit secara berkala. Teleskop Kepler milik NASA menggunakan metode ini dan menemukan ribuan exoplanet. Penurunan kecerahan juga memberi tahu ukuran planet — semakin besar planet, semakin besar penurunannya.$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'HEADING', 5, jsonb_build_object('text', $$Metode Kecepatan Radial: Bintang yang Bergoyang$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'PARAGRAPH', 6, jsonb_build_object('text', $$Planet yang besar menarik bintangnya hingga bergoyang sedikit. Goyangan ini terdeteksi sebagai pergeseran Doppler pada cahaya bintang — memerah saat menjauh, membiru saat mendekat. Metode ini mengungkap massa planet, melengkapi data ukuran dari metode transit sehingga kepadatan planet bisa dihitung.$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'HEADING', 7, jsonb_build_object('text', $$Zona Layak Huni$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'PARAGRAPH', 8, jsonb_build_object('text', $$Zona layak huni (habitable zone) adalah jarak dari bintang di mana suhu memungkinkan air cair di permukaan planet — tidak terlalu panas hingga mendidih, tidak terlalu dingin hingga membeku. Namun jarak saja tidak cukup: planet juga butuh atmosfer yang tepat dan medan magnet untuk melindungi dari radiasi bintang.$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'HEADING', 9, jsonb_build_object('text', $$Kandidat Bumi Kedua$$)),
(gen_random_uuid(), 'a0000003-0000-4000-8000-000000000003', 'PARAGRAPH', 10, jsonb_build_object('text', $$Beberapa kandidat menarik: Proxima Centauri b (planet terdekat, 4,2 tahun cahaya, di zona layak huni), TRAPPIST-1e (salah satu dari 7 planet berbatu di satu sistem), dan Kepler-452b ("sepupu Bumi" yang mengorbit bintang mirip Matahari). Teleskop James Webb kini menganalisis atmosfer exoplanet untuk mencari tanda air dan bahkan biosignature — jejak kimia kehidupan.$$))
ON CONFLICT (id) DO NOTHING;

-- ================= 4. EXP-EKOLOGI-001: Hutan Mangrove =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000004-0000-4000-8000-000000000004', 'EXP-EKOLOGI-001', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
'Hutan Mangrove: Penjaga Pantai yang Terlupakan', 'hutan-mangrove-penjaga-pantai',
'Mengenal hutan mangrove: ekosistem unik penghasil oksigen, penahan abrasi, dan rumah bagi ribuan spesies.',
'id', 8, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'HEADING', 1, jsonb_build_object('text', $$Apa Itu Hutan Mangrove?$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'PARAGRAPH', 2, jsonb_build_object('text', $$Mangrove adalah ekosistem hutan di daerah pesisir berlumpur yang tergenang air payau saat pasang. Indonesia memiliki hutan mangrove terluas di dunia — sekitar 3,3 juta hektare atau 20% dari total mangrove global. Tumbuhan utamanya berasal dari genus Rhizophora, Avicennia, dan Sonneratia.$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'HEADING', 3, jsonb_build_object('text', $$Adaptasi Luar Biasa$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pohon mangrove hidup di lingkungan yang mematikan bagi kebanyakan tumbuhan: air asin dan lumpur tanpa oksigen. Mereka mengatasinya dengan akar napas (pneumatofor) yang mencuat dari lumpur untuk bernapas, kelenjar garam di daun untuk membuang kelebihan garam, dan buah yang berkecambah saat masih menempel di pohon (vivipar) agar siap tumbuh begitu jatuh ke lumpur.$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'HEADING', 5, jsonb_build_object('text', $$Perisai Alami Pantai$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'PARAGRAPH', 6, jsonb_build_object('text', $$Akar mangrove yang rapat memperlambat gelombang dan menahan sedimen, mencegah abrasi pantai. Saat tsunami Aceh 2004, daerah yang dilindungi mangrove mengalami kerusakan jauh lebih ringan. Mangrove juga menyerap karbon 3–5 kali lebih efektif per hektare dibanding hutan tropis daratan — menjadikannya senjata penting melawan perubahan iklim.$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'HEADING', 7, jsonb_build_object('text', $$Rumah bagi Kehidupan$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'PARAGRAPH', 8, jsonb_build_object('text', $$Mangrove adalah tempat pemijahan ikan, udang, dan kepiting — menopang perikanan pesisir yang menjadi mata pencaharian jutaan nelayan. Burung migran, monyet bekantan, hingga buaya muara hidup di ekosistem ini. Diperkirakan 80% tangkapan ikan tropis bergantung pada mangrove di suatu tahap hidupnya.$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'HEADING', 9, jsonb_build_object('text', $$Ancaman dan Harapan$$)),
(gen_random_uuid(), 'a0000004-0000-4000-8000-000000000004', 'PARAGRAPH', 10, jsonb_build_object('text', $$Indonesia kehilangan ratusan ribu hektare mangrove akibat konversi tambak, perkebunan, dan pembangunan. Kabar baiknya, mangrove termasuk ekosistem yang bisa direstorasi — program rehabilitasi nasional menargetkan 600 ribu hektare. Setiap orang bisa berkontribusi lewat program tanam mangrove di pesisir terdekat.$$))
ON CONFLICT (id) DO NOTHING;

-- ================= 5. SCH-SMA-FIS3-001: Listrik Arus Searah =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000005-0000-4000-8000-000000000005', 'SCH-SMA-FIS3-001', 'd5555555-5555-5555-5555-555555555555',
'Fisika Kelas 12: Listrik Arus Searah (DC)', 'fisika-kelas-12-listrik-arus-searah',
'Materi fisika kelas 12: hukum Ohm, rangkaian seri-paralel, hukum Kirchhoff, dan daya listrik dengan contoh soal.',
'id', 12, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari bab ini, siswa diharapkan mampu: menjelaskan konsep arus listrik searah, menerapkan hukum Ohm pada rangkaian, menghitung hambatan pengganti rangkaian seri dan paralel, menggunakan hukum Kirchhoff, serta menghitung daya dan energi listrik.$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 3, jsonb_build_object('text', $$Arus Listrik dan Hukum Ohm$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'PARAGRAPH', 4, jsonb_build_object('text', $$Arus listrik (I) adalah aliran muatan listrik per satuan waktu, satuannya ampere (A). Hukum Ohm menyatakan bahwa tegangan (V) berbanding lurus dengan arus: V = I × R, dengan R hambatan dalam ohm (Ω). Artinya, pada hambatan tetap, tegangan dua kali lipat menghasilkan arus dua kali lipat.$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 5, jsonb_build_object('text', $$Rangkaian Seri dan Paralel$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'PARAGRAPH', 6, jsonb_build_object('text', $$Pada rangkaian SERI, arus yang mengalir sama di semua komponen, sedangkan tegangan terbagi. Hambatan pengganti: Rs = R1 + R2 + R3 + ... Pada rangkaian PARALEL, tegangan sama di semua cabang, sedangkan arus terbagi. Hambatan pengganti: 1/Rp = 1/R1 + 1/R2 + 1/R3 + ... Ingat: hambatan paralel selalu LEBIH KECIL dari hambatan terkecil penyusunnya.$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 7, jsonb_build_object('text', $$Hukum Kirchhoff$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'PARAGRAPH', 8, jsonb_build_object('text', $$Hukum I Kirchhoff (hukum titik cabang): jumlah arus yang masuk ke suatu titik sama dengan jumlah arus yang keluar (ΣI_masuk = ΣI_keluar). Hukum II Kirchhoff (hukum loop): jumlah aljabar GGL dan penurunan tegangan dalam satu loop tertutup sama dengan nol (ΣE + ΣIR = 0). Kedua hukum ini adalah kunci menyelesaikan rangkaian majemuk.$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 9, jsonb_build_object('text', $$Contoh Soal$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'PARAGRAPH', 10, jsonb_build_object('text', $$Contoh 1: Tiga resistor 2 Ω, 3 Ω, dan 6 Ω dirangkai paralel lalu dihubungkan ke baterai 12 V. Hitung hambatan pengganti dan arus total! Jawab: 1/Rp = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1, jadi Rp = 1 Ω. Arus total I = V/Rp = 12/1 = 12 A. Contoh 2: Lampu 60 W dinyalakan pada tegangan 220 V selama 5 jam. Energi yang dipakai: W = P × t = 60 × 5 = 300 Wh = 0,3 kWh.$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'HEADING', 11, jsonb_build_object('text', $$Latihan Soal$$)),
(gen_random_uuid(), 'a0000005-0000-4000-8000-000000000005', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Dua resistor 4 Ω dan 6 Ω dirangkai seri dengan baterai 20 V. Hitung arus yang mengalir!$$, $$2. Jelaskan mengapa lampu yang dirangkai paralel tetap menyala terang meski salah satu padam, sedangkan pada rangkaian seri tidak!$$, $$3. Sebuah setrika 350 W dipakai 2 jam sehari. Jika tarif listrik Rp1.500/kWh, hitung biaya listrik setrika selama 30 hari!$$]))
ON CONFLICT (id) DO NOTHING;

-- ================= 6. SCH-SD-BIN4-001: Pidato Kelas 6 =================
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
VALUES ('a0000006-0000-4000-8000-000000000006', 'SCH-SD-BIN4-001', 'd3333333-3333-3333-3333-333333333333',
'Bahasa Indonesia Kelas 6: Berpidato dengan Percaya Diri', 'bahasa-indonesia-kelas-6-pidato',
'Materi bahasa Indonesia kelas 6 SD: struktur pidato (pembuka, isi, penutup), bahasa yang baik, dan tips tampil percaya diri.',
'id', 10, 'DRAFT', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 1, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'PARAGRAPH', 2, jsonb_build_object('text', $$Setelah mempelajari bab ini, siswa diharapkan mampu: menjelaskan struktur teks pidato, menyusun naskah pidato sederhana dengan bahasa yang baik dan benar, serta menyampaikan pidato di depan kelas dengan percaya diri.$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 3, jsonb_build_object('text', $$Apa Itu Pidato?$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'PARAGRAPH', 4, jsonb_build_object('text', $$Pidato adalah kegiatan berbicara di depan umum untuk menyampaikan gagasan, ajakan, atau informasi kepada pendengar. Kita sering mendengar pidato saat upacara bendera, perpisahan sekolah, atau acara peringatan hari besar. Pidato yang baik membuat pendengar memahami dan tergerak oleh pesan yang disampaikan.$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 5, jsonb_build_object('text', $$Struktur Pidato$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'LIST', 6, jsonb_build_object('items', ARRAY[$$PEMBUKA: salam pembuka (Assalamualaikum/selamat pagi), sapaan kepada hadirin, dan ucapan syukur. Contoh: "Selamat pagi, Bapak/Ibu guru dan teman-teman yang saya hormati."$$, $$ISI: pokok pikiran yang ingin disampaikan, disusun runtut dengan contoh atau alasan yang mendukung. Inilah bagian terpanjang pidato.$$, $$PENUTUP: kesimpulan atau ajakan, ucapan terima kasih, dan salam penutup. Contoh: "Marilah kita jaga kebersihan sekolah kita. Terima kasih, wassalamualaikum wr. wb."$$])),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 7, jsonb_build_object('text', $$Bahasa Pidato yang Baik$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'PARAGRAPH', 8, jsonb_build_object('text', $$Gunakan bahasa Indonesia yang baik dan benar, sopan, dan mudah dipahami. Hindari kata-kata kasar atau singkatan yang tidak baku. Kalimat sebaiknya pendek dan jelas. Sapa pendengar dengan ramah agar mereka merasa dihargai dan mau mendengarkan.$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 9, jsonb_build_object('text', $$Tips Tampil Percaya Diri$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'LIST', 10, jsonb_build_object('items', ARRAY[$$Latih pidatomu di depan cermin atau direkam HP, lalu perbaiki bagian yang kurang lancar.$$,
$$Berdiri tegak, tatap pendengar bergantian, jangan hanya menunduk membaca naskah.$$,
$$Bicara dengan suara lantang dan jelas, atur kecepatan — jangan terlalu cepat.$$,
$$Tarik napas dalam sebelum mulai jika merasa gugup; gugup itu wajar!$$])),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'HEADING', 11, jsonb_build_object('text', $$Latihan$$)),
(gen_random_uuid(), 'a0000006-0000-4000-8000-000000000006', 'LIST', 12, jsonb_build_object('items', ARRAY[$$1. Susun naskah pidato singkat (5–7 kalimat) bertema "Menjaga Kebersihan Kelas" dengan struktur pembuka–isi–penutup!$$, $$2. Sebutkan 3 perbedaan bahasa pidato dengan bahasa percakapan sehari-hari!$$, $$3. Praktikkan pidatomu di depan keluarga, lalu minta mereka menilai: apakah suaramu cukup jelas?$$]))
ON CONFLICT (id) DO NOTHING;
