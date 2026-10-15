-- Batch 45: 6 artikel (DRAFT, id). Idempotent: ON CONFLICT DO NOTHING.
-- Owner principal: f7125028-187e-44e0-b95b-88b69b8d5c9a
BEGIN;

-- 1. TUT-ELEKTRONIK5-001: Sensor Ultrasonik: Ukur Jarak dengan Arduino (R1.D3)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500001-0000-0000-0000-000000000001', 'TUT-ELEKTRONIK5-001', 'b4444444-4444-4444-4444-444444444444',
  'Sensor Ultrasonik: Ukur Jarak dengan Arduino',
  'sensor-ultrasonik-ukur-jarak-arduino',
  'Panduan lengkap merangkai sensor ultrasonik HC-SR04 dengan Arduino untuk membuat alat ukur jarak digital sendiri.',
  'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Ingin Membuat Alat Ukur Jarak Sendiri, tapi Tidak Tahu Mulai dari Mana$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Banyak pemula Arduino sudah bisa menyalakan LED, tetapi bingung naik ke proyek yang lebih berguna. Alat ukur jarak digital adalah proyek ideal berikutnya: hasilnya nyata terlihat di layar, komponennya murah, dan prinsip kerjanya mudah dipahami. Artikel ini memandu Anda dari nol sampai sensor berhasil menampilkan angka jarak.$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Cara Kerja Sensor Ultrasonik HC-SR04$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sensor HC-SR04 bekerja seperti kelelawar: ia memancarkan gelombang suara ultrasonik (di atas 20 kHz, tidak terdengar manusia) dari pin Trigger, lalu menunggu pantulannya kembali di pin Echo. Arduino mengukur lama waktu perjalanan bolak-balik gelombang tersebut. Karena kecepatan suara di udara sekitar 340 meter per detik, jarak benda dihitung dengan rumus: jarak = (waktu tempuh x 340) / 2. Angka dibagi dua karena gelombang menempuh jarak pergi-pulang.$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 4, jsonb_build_object('text', $txt$Alat dan Bahan yang Diperlukan$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'LIST', 5, jsonb_build_object('text', $txt$Arduino Uno (atau yang kompatibel)
Sensor ultrasonik HC-SR04
Breadboard dan kabel jumper secukupnya
Kabel USB untuk menghubungkan ke laptop
Laptop dengan Arduino IDE terinstal$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 6, jsonb_build_object('text', $txt$Langkah 1: Merangkai Sensor ke Arduino$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'LIST', 7, jsonb_build_object('text', $txt$Cabut kabel USB dari Arduino selama merangkai (rangkaian dalam keadaan mati)
Hubungkan pin VCC sensor ke pin 5V Arduino
Hubungkan pin Trig sensor ke pin digital 9 Arduino
Hubungkan pin Echo sensor ke pin digital 10 Arduino
Hubungkan pin GND sensor ke pin GND Arduino
Periksa ulang setiap sambungan sebelum menyalakan$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 8, jsonb_build_object('text', $txt$Langkah 2: Mengunggah Program dan Menguji$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Buka Arduino IDE, buat program yang mengirim pulsa 10 mikrodetik ke pin Trigger, membaca durasi pantulan di pin Echo dengan fungsi pulseIn, lalu menghitung jarak dan menampilkannya di Serial Monitor. Unggah program ke Arduino, buka Serial Monitor (baud 9600), lalu dekatkan tangan Anda ke sensor — angka jarak dalam sentimeter akan berubah mengikuti gerakan tangan. Jika angka tidak berubah, periksa kembali sambungan kabel.$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'HEADING', 10, jsonb_build_object('text', $txt$Risiko yang Perlu Diwaspadai$txt$)),
(gen_random_uuid(), 'e4500001-0000-0000-0000-000000000001', 'LIST', 11, jsonb_build_object('text', $txt$Hasil pengukuran bisa meleset pada permukaan yang menyerap suara (kain tebal, busa) — gunakan permukaan keras dan rata untuk hasil akurat
Jangkauan efektif sensor hanya 2 cm sampai 4 meter; di luar itu hasil tidak dapat dipercaya
Proyek ini memakai tegangan rendah 5V dari USB sehingga aman disentuh, tetapi jangan pernah menyambungkan rangkaian Arduino langsung ke listrik rumah (220V)
Checklist selesai: sensor menampilkan angka jarak yang berubah saat benda didekatkan dan dijauhkan$txt$))
ON CONFLICT DO NOTHING;

-- 2. TUT-MASAK10-001: Opor Ayam: Resep Lebaran (R1.D1.K4)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500002-0000-0000-0000-000000000002', 'TUT-MASAK10-001', 'b7777777-7777-7777-7777-777777777777',
  'Opor Ayam: Resep Lebaran',
  'opor-ayam-resep-lebaran',
  'Resep opor ayam gurih untuk Lebaran: bumbu lengkap, langkah memasak, dan tips agar kuah santan tidak pecah.',
  'id', 7, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 0, jsonb_build_object('text', $txt$Masalah: Opor Ayam Buatan Sendiri Kurang Gurih dan Kuahnya Pecah$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Opor ayam adalah menu wajib Lebaran di banyak keluarga Indonesia. Namun memasaknya tidak semudah kelihatannya: kuah santan sering pecah (menggumpal), bumbu kurang meresap, atau ayamnya alot. Dengan teknik yang benar, opor rumahan bisa seenak buatan ibu — gurih, harum, dan kuahnya mulus.$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 2, jsonb_build_object('text', $txt$Penjelasan: Rahasia Opor yang Gurih$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Kunci opor enak ada tiga: bumbu yang ditumis sampai benar-benar matang (tidak langu), santan yang dimasak dengan api kecil sambil terus diaduk agar tidak pecah, dan waktu perebusan yang cukup agar bumbu meresap ke dalam ayam. Santan encer dimasukkan lebih dulu, santan kental belakangan — ini trik agar kuah tetap halus.$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 4, jsonb_build_object('text', $txt$Bahan-bahan (untuk 6 porsi)$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'LIST', 5, jsonb_build_object('text', $txt$1 ekor ayam kampung atau ayam negeri, potong 8-10 bagian
1 liter santan encer + 400 ml santan kental (dari 1,5 butir kelapa)
3 lembar daun salam, 3 lembar daun jeruk, 2 batang serai (memarkan)
3 cm lengkuas (memarkan), 1 sdt garam, 1 sdt gula merah
Minyak untuk menumis secukupnya$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 6, jsonb_build_object('text', $txt$Bumbu Halus$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'LIST', 7, jsonb_build_object('text', $txt$8 siung bawang merah
5 siung bawang putih
4 butir kemiri (sangrai)
1 sdt ketumbar (sangrai)
1/2 sdt merica butiran
1/2 sdt jintan
2 cm kunyit$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 8, jsonb_build_object('text', $txt$Langkah Memasak$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'LIST', 9, jsonb_build_object('text', $txt$Tumis bumbu halus bersama daun salam, daun jeruk, serai, dan lengkuas sampai harum dan matang (minyak terpisah dari bumbu)
Masukkan potongan ayam, aduk sampai berubah warna dan terlumuri bumbu
Tuang santan encer, masak dengan api kecil sambil sesekali diaduk agar santan tidak pecah
Setelah ayam empuk (sekitar 30-40 menit), tuang santan kental, aduk perlahan terus-menerus
Tambahkan garam dan gula merah, koreksi rasa, masak 10 menit lagi lalu angkat$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'HEADING', 10, jsonb_build_object('text', $txt$Risiko dan Tips$txt$)),
(gen_random_uuid(), 'e4500002-0000-0000-0000-000000000002', 'LIST', 11, jsonb_build_object('text', $txt$Risiko utama: santan pecah karena api terlalu besar atau jarang diaduk — selalu pakai api kecil setelah santan masuk
Jangan memakai santan instan yang sudah basi baunya; cicipi dulu sebelum dipakai
Opor paling enak dimakan keesokan harinya karena bumbu semakin meresap — simpan di kulkas dan hangatkan kembali
Checklist selesai: kuah halus tidak menggumpal, ayam empuk, rasa gurih seimbang antara asin dan manis$txt$))
ON CONFLICT DO NOTHING;

-- 3. EXP-KIMIA8-001: Karbon: Unsur Kehidupan (R2.D8)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500003-0000-0000-0000-000000000003', 'EXP-KIMIA8-001', 'c4444444-4444-4444-4444-444444444444',
  'Karbon: Unsur Kehidupan',
  'karbon-unsur-kehidupan',
  'Mengenal karbon: unsur nomor atom 6 yang menjadi tulang punggung semua makhluk hidup, dari intan hingga DNA.',
  'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Karbon?$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Karbon adalah unsur kimia dengan nomor atom 6 dan simbol C. Ia bukan unsur paling melimpah di alam semesta, tetapi ia adalah unsur yang paling penting bagi kehidupan. Setiap makhluk hidup — dari bakteri terkecil hingga manusia — tersusun dari senyawa berbasis karbon. Tubuh manusia sendiri mengandung sekitar 18 persen karbon.$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'HEADING', 2, jsonb_build_object('text', $txt$Sifat Istimewa Karbon$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Keistimewaan karbon terletak pada empat elektron valensinya: satu atom karbon bisa membentuk empat ikatan kovalen sekaligus, termasuk ikatan dengan atom karbon lain. Kemampuan ini memungkinkan karbon membentuk rantai panjang, cabang, dan cincin — jutaan senyawa berbeda yang tidak bisa dibentuk unsur lain. Inilah fondasi kimia organik, ilmu tentang senyawa karbon.$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'HEADING', 4, jsonb_build_object('text', $txt$Bentuk-bentuk Karbon Murni$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'LIST', 5, jsonb_build_object('text', $txt$Intan (diamond): atom karbon tersusun tetrahedral — material alami paling keras
Grafit: lapisan atom karbon heksagonal — lunak, dipakai di pensil dan baterai
Grafena: satu lapis atom karbon — sangat kuat, sangat tipis, konduktor hebat
Fullerena: bola molekul karbon (misalnya C60) — dipakai dalam riset material maju$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'HEADING', 6, jsonb_build_object('text', $txt$Karbon dalam Kehidupan$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Empat molekul raksasa kehidupan — karbohidrat, lipid, protein, dan asam nukleat (DNA/RNA) — semuanya berkerangka karbon. Fotosintesis mengubah karbon dioksida dari udara menjadi gula, lalu rantai makanan memindahkan karbon itu ke seluruh ekosistem. Tanpa karbon, tidak ada sel, tidak ada energi, tidak ada kehidupan.$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'HEADING', 8, jsonb_build_object('text', $txt$Karbon dan Iklim Bumi$txt$)),
(gen_random_uuid(), 'e4500003-0000-0000-0000-000000000003', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Karbon terus berputar dalam siklus: dari udara (CO2) ke tumbuhan, ke hewan, kembali ke udara lewat pernapasan dan pembusukan. Masalah muncul ketika manusia membakar bahan bakar fosil — karbon yang terkubur jutaan tahun dilepas sekaligus ke atmosfer sebagai CO2, memperkuat efek rumah kaca. Memahami karbon berarti memahami krisis iklim sekaligus solusinya.$txt$))
ON CONFLICT DO NOTHING;

-- 4. EXP-SEJARAH11-001: Konferensi Meja Bundar 1949 (R2.D12)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500004-0000-0000-0000-000000000004', 'EXP-SEJARAH11-001', 'c8888888-8888-8888-8888-888888888888',
  'Konferensi Meja Bundar 1949',
  'konferensi-meja-bundar-1949',
  'Konferensi Meja Bundar 1949 di Den Haag: perundingan yang mengakhiri revolusi fisik dan mengantar pengakuan kedaulatan Indonesia.',
  'id', 6, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'HEADING', 0, jsonb_build_object('text', $txt$Apa Itu Konferensi Meja Bundar?$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'PARAGRAPH', 1, jsonb_build_object('text', $txt$Konferensi Meja Bundar (KMB) adalah perundingan antara Indonesia dan Belanda yang berlangsung di Den Haag, Belanda, dari 23 Agustus hingga 2 November 1949. Tiga pihak duduk semeja: delegasi Republik Indonesia dipimpin Mohammad Hatta, delegasi Belanda, dan perwakilan Bijeenkomst voor Federaal Overleg (BFO) — kumpulan negara-negara bagian bentukan Belanda. Hasilnya: Belanda mengakui kedaulatan Indonesia.$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'HEADING', 2, jsonb_build_object('text', $txt$Latar Belakang: Mengapa Harus Berunding?$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Setelah Proklamasi 1945, Belanda dua kali melancarkan agresi militer (1947 dan 1948) untuk merebut kembali Indonesia. Perlawanan rakyat begitu gigih, dan dunia internasional — terutama Amerika Serikat dan Perserikatan Bangsa-Bangsa — menekan Belanda agar menghentikan kekerasan. Perundingan Roem-Roijen (Mei 1949) membuka jalan: Belanda setuju mengembalikan pemerintahan Republik ke Yogyakarta dan mengadakan KMB sebagai penyelesaian akhir.$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'HEADING', 4, jsonb_build_object('text', $txt$Jalannya Perundingan$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Selama lebih dari dua bulan, tiga delegasi membahas nasib Indonesia: bentuk negara, utang Hindia Belanda, status Irian Barat, dan hubungan kedua negara pasca-kemerdekaan. Perdebatan paling alot adalah soal Irian Barat — Belanda menolak menyerahkannya. Akhirnya disepakati status Irian Barat ditentukan setahun kemudian melalui perundingan lanjutan.$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'HEADING', 6, jsonb_build_object('text', $txt$Hasil-hasil Penting KMB$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'LIST', 7, jsonb_build_object('text', $txt$Belanda mengakui kedaulatan Republik Indonesia Serikat (RIS) selambat-lambatnya 30 Desember 1949
Penyerahan kedaulatan resmi dilakukan pada 27 Desember 1949
Indonesia berbentuk negara federal (RIS) yang terdiri dari 16 negara bagian
Dibentuk Uni Indonesia-Belanda sebagai kerja sama sukarela kedua negara
Indonesia menanggung sebagian utang pemerintah Hindia Belanda
Status Irian Barat ditunda dan dibahas setahun kemudian$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'HEADING', 8, jsonb_build_object('text', $txt$Dampak bagi Indonesia$txt$)),
(gen_random_uuid(), 'e4500004-0000-0000-0000-000000000004', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$KMB mengakhiri empat tahun revolusi fisik dan mengantar Indonesia diakui dunia sebagai negara berdaulat. Namun hasil KMB juga meninggalkan pekerjaan rumah: bentuk negara federal RIS hanya bertahan delapan bulan sebelum kembali menjadi Negara Kesatuan pada 17 Agustus 1950, dan sengketa Irian Barat berlarut hingga akhirnya kembali ke pangkuan Indonesia tahun 1969. KMB adalah bukti bahwa kemerdekaan diraih lewat perjuangan bersenjata sekaligus diplomasi.$txt$))
ON CONFLICT DO NOTHING;

-- 5. SCH-SMA-BIO3-001: Biologi Kelas 11: Sistem Saraf (R3.D16)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500005-0000-0000-0000-000000000005', 'SCH-SMA-BIO3-001', 'd5555555-5555-5555-5555-555555555555',
  'Biologi Kelas 11: Sistem Saraf',
  'biologi-kelas-11-sistem-saraf',
  'Materi Biologi kelas 11: sel saraf, susunan sistem saraf pusat dan tepi, gerak sadar, gerak refleks, latihan soal dan kunci jawaban.',
  'id', 9, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'LIST', 1, jsonb_build_object('text', $txt$Setelah mempelajari bab ini, kamu diharapkan mampu:
Menjelaskan struktur dan fungsi sel saraf (neuron)
Menguraikan susunan sistem saraf pusat dan sistem saraf tepi
Membedakan mekanisme gerak sadar dan gerak refleks$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 2, jsonb_build_object('text', $txt$Pengertian Sistem Saraf$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Sistem saraf adalah sistem koordinasi tubuh yang menerima rangsang (stimulus), mengolahnya, dan memberikan tanggapan (respons) dengan sangat cepat. Bayangkan kamu menyentuh panci panas: dalam sepersekian detik tanganmu langsung menarik diri — itulah kerja sistem saraf. Sistem ini bekerja sama dengan sistem hormon, tetapi saraf jauh lebih cepat karena memakai impuls listrik.$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 4, jsonb_build_object('text', $txt$Sel Saraf (Neuron)$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'PARAGRAPH', 5, jsonb_build_object('text', $txt$Unit terkecil sistem saraf adalah neuron. Setiap neuron terdiri dari badan sel, dendrit (menerima impuls), dan akson atau neurit (meneruskan impuls). Impuls berjalan satu arah: dendrit ke badan sel ke akson. Antara satu neuron dan neuron berikutnya terdapat celah sinapsis, tempat impuls diteruskan dengan bantuan zat kimia neurotransmiter. Ada tiga jenis neuron: sensorik (membawa impuls dari indra ke pusat), motorik (membawa perintah dari pusat ke otot), dan konektor atau asosiasi (menghubungkan keduanya).$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 6, jsonb_build_object('text', $txt$Susunan Sistem Saraf Manusia$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'LIST', 7, jsonb_build_object('text', $txt$Sistem saraf pusat: otak (serebrum, serebelum, batang otak) dan sumsum tulang belakang — pusat pengolah dan pengambil keputusan
Sistem saraf tepi: 12 pasang saraf kranial dari otak dan 31 pasang saraf spinal dari sumsum tulang belakang
Saraf somatik: mengendalikan gerak sadar otot rangka
Saraf otonom: mengendalikan organ dalam secara tidak sadar — terbagi menjadi simpatik (siaga, misal detak jantung cepat saat takut) dan parasimpatik (tenang, misal detak jantung melambat saat istirahat)$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 8, jsonb_build_object('text', $txt$Gerak Sadar dan Gerak Refleks$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Gerak sadar melewati otak: rangsang diterima indra, dibawa neuron sensorik ke otak, diolah, lalu perintah dikirim lewat neuron motorik ke otot. Contohnya menulis atau menendang bola. Gerak refleks lebih cepat karena tidak lewat otak: impuls dari neuron sensorik langsung diteruskan neuron konektor di sumsum tulang belakang ke neuron motorik. Contohnya menarik tangan dari benda panas atau lutut menendang saat diketuk dokter. Refleks adalah mekanisme perlindungan tubuh.$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'HEADING', 10, jsonb_build_object('text', $txt$Latihan Soal$txt$)),
(gen_random_uuid(), 'e4500005-0000-0000-0000-000000000005', 'LIST', 11, jsonb_build_object('text', $txt$Latihan:
1. Sebutkan tiga bagian utama neuron beserta fungsinya!
2. Jelaskan perbedaan saraf simpatik dan parasimpatik beserta contohnya!
3. Mengapa gerak refleks lebih cepat daripada gerak sadar? Jelaskan alur impulsnya!
Kunci jawaban:
1. Dendrit (menerima impuls), badan sel (mengolah), akson (meneruskan impuls)
2. Simpatik mempercepat kerja organ saat siaga (jantung berdebar saat takut); parasimpatik memperlambat saat tenang (jantung melambat saat istirahat)
3. Karena impuls refleks hanya lewat sumsum tulang belakang tanpa diolah otak, jalurnya lebih pendek sehingga respons lebih cepat$txt$))
ON CONFLICT DO NOTHING;

-- 6. SCH-SD-IPS7-001: IPS Kelas 1: Diri Sendiri (R3.D14.K8)
INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES ('e4500006-0000-0000-0000-000000000006', 'SCH-SD-IPS7-001', 'd1000001-0000-0000-0000-000000000001',
  'IPS Kelas 1: Diri Sendiri',
  'ips-kelas-1-diri-sendiri',
  'Materi IPS kelas 1 SD: mengenal diri sendiri, anggota tubuh, pancaindra, dan hal yang membuat setiap anak istimewa.',
  'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 0, jsonb_build_object('text', $txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'LIST', 1, jsonb_build_object('text', $txt$Setelah belajar bab ini, kamu bisa:
Menyebutkan nama lengkap dan nama panggilanmu sendiri
Menyebutkan anggota tubuh dan kegunaannya
Menyebutkan lima pancaindra dan fungsinya
Menceritakan hal yang kamu sukai tentang dirimu$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 2, jsonb_build_object('text', $txt$Mengenal Diri Sendiri$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'PARAGRAPH', 3, jsonb_build_object('text', $txt$Setiap anak punya nama. Nama lengkapmu biasanya ada di akta kelahiran, sedangkan nama panggilan dipakai teman-temanmu sehari-hari. Kamu juga punya ciri khas: warna kulit, bentuk rambut, tinggi badan. Tidak ada dua anak yang sama persis di dunia ini — bahkan anak kembar pun punya perbedaan. Itulah yang membuat dirimu istimewa.$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 4, jsonb_build_object('text', $txt$Anggota Tubuhku$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'LIST', 5, jsonb_build_object('text', $txt$Kepala: tempat otak, mata, hidung, telinga, dan mulut berada
Tangan: untuk memegang, menulis, dan membantu orang tua
Kaki: untuk berjalan, berlari, dan bermain
Badan: tempat jantung dan perut berada
Setiap anggota tubuh harus dijaga kebersihannya setiap hari$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 6, jsonb_build_object('text', $txt$Pancaindra: Lima Sahabatku$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'PARAGRAPH', 7, jsonb_build_object('text', $txt$Tuhan memberi kita lima indra yang disebut pancaindra. Mata untuk melihat warna pelangi, telinga untuk mendengar suara burung, hidung untuk mencium wangi bunga, lidah untuk merasakan manisnya permen, dan kulit untuk merasakan hangatnya pelukan ibu. Coba tutup matamu sebentar — kamu jadi tahu betapa berharganya setiap indra.$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 8, jsonb_build_object('text', $txt$Aku Istimewa$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'PARAGRAPH', 9, jsonb_build_object('text', $txt$Setiap anak punya kelebihan. Ada yang pandai bernyanyi, ada yang cepat berlari, ada yang suka menggambar. Kamu juga punya kelebihan — mungkin kamu belum menemukannya, dan itu tidak apa-apa. Yang penting, kamu bersyukur atas dirimu, menjaga tubuhmu, dan berbuat baik kepada teman. Anak yang baik hati adalah anak yang istimewa.$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'HEADING', 10, jsonb_build_object('text', $txt$Latihan$txt$)),
(gen_random_uuid(), 'e4500006-0000-0000-0000-000000000006', 'LIST', 11, jsonb_build_object('text', $txt$Latihan:
1. Tuliskan nama lengkap dan nama panggilanmu!
2. Sebutkan tiga anggota tubuhmu dan kegunaannya!
3. Apa saja lima pancaindra? Sebutkan fungsinya masing-masing!
Kunci jawaban:
1. (Jawaban sesuai nama masing-masing anak)
2. Contoh: tangan untuk menulis, kaki untuk berjalan, mata untuk melihat
3. Mata (melihat), telinga (mendengar), hidung (mencium), lidah (mengecap), kulit (meraba)$txt$))
ON CONFLICT DO NOTHING;

COMMIT;
