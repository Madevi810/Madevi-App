-- =====================================================
-- Madevi Content Batch 63 — 6 artikel (DRAFT, id)
-- 2 Tutorial, 2 Explore, 2 School
-- Owner: f7125028-187e-44e0-b95b-88b69b8d5c9a
-- Idempoten: aman dijalankan ulang (ON CONFLICT + hapus block lama)
-- =====================================================
BEGIN;

-- ---------- ARTIKEL ----------
INSERT INTO madevi.articles
  (id, business_code, taxonomy_node_id, title, slug, summary, language,
   reading_minutes, creator_principal_id, created_by, updated_by, status)
VALUES
  ('e6300001-0001-0001-0001-000000000001', 'TUT-ELEKTRONIK11-001',
   'b4444444-4444-4444-4444-444444444444',
   'Resistor: Membaca Kode Warna',
   'resistor-membaca-kode-warna',
   'Panduan membaca nilai resistor dari pita warna: urutan pita, tabel warna, dan contoh latihan.',
   'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e6300002-0002-0002-0002-000000000002', 'TUT-MASAK16-001',
   'b7777777-7777-7777-7777-777777777777',
   'Soto Betawi: Resep Kuah Santan',
   'soto-betawi-resep-kuah-santan',
   'Resep soto Betawi kuah santan gurih dengan daging sapi empuk, plus trik agar santan tidak pecah.',
   'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e6300003-0003-0003-0003-000000000003', 'EXP-KIMIA18-001',
   'c4444444-4444-4444-4444-444444444444',
   'Karbon Dioksida: Gas Rumah Kaca',
   'karbon-dioksida-gas-rumah-kaca',
   'Mengenal CO2: sifat, sumber, mekanisme efek rumah kaca, dampaknya, dan upaya menguranginya.',
   'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e6300004-0004-0004-0004-000000000004', 'EXP-SEJARAH17-001',
   'c8888888-8888-8888-8888-888888888888',
   'Tsunami Aceh 2004',
   'tsunami-aceh-2004',
   'Kisah gempa dan tsunami 26 Desember 2004: penyebab, dampak, respons dunia, dan pelajarannya.',
   'id', 8, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e6300005-0005-0005-0005-000000000005', 'SCH-SMA-FIS5-001',
   'd5555555-5555-5555-5555-555555555555',
   'Fisika Kelas 12: Induksi Elektromagnetik',
   'fisika-kelas-12-induksi-elektromagnetik',
   'Materi induksi elektromagnetik: hukum Faraday, hukum Lenz, contoh soal, latihan, dan kunci jawaban.',
   'id', 12, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT'),
  ('e6300006-0006-0006-0006-000000000006', 'SCH-SD-MAT16-001',
   'd3333333-3333-3333-3333-333333333333',
   'Matematika Kelas 6: Lingkaran',
   'matematika-kelas-6-lingkaran',
   'Materi lingkaran kelas 6: unsur lingkaran, keliling, luas, contoh soal, latihan, dan kunci jawaban.',
   'id', 10, 'f7125028-187e-44e0-b95b-88b69b8d5c9a',
   'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'DRAFT')
ON CONFLICT (business_code) DO NOTHING;

-- Hapus block lama agar re-run tidak duplikat
DELETE FROM madevi.article_blocks WHERE article_id IN
  ('e6300001-0001-0001-0001-000000000001','e6300002-0002-0002-0002-000000000002',
   'e6300003-0003-0003-0003-000000000003','e6300004-0004-0004-0004-000000000004',
   'e6300005-0005-0005-0005-000000000005','e6300006-0006-0006-0006-000000000006');

-- ---------- ARTIKEL 1: TUT-ELEKTRONIK11-001 (12 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',1, jsonb_build_object('text',$txt$Masalah: Bingung Membaca Nilai Resistor$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','PARAGRAPH',2, jsonb_build_object('text',$txt$Resistor kecil tidak bisa ditulis angka nilainya, sehingga pabrik memakai pita-pita warna melingkar di badannya. Banyak pemula salah baca karena tidak tahu dari sisi mana mulai membaca, atau lupa arti warna pita ketiga. Akibatnya nilai resistor meleset jauh dan rangkaian tidak bekerja sesuai rancangan.$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',3, jsonb_build_object('text',$txt$Penjelasan: Cara Kerja Kode Warna$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','PARAGRAPH',4, jsonb_build_object('text',$txt$Pada resistor 4 pita yang paling umum: pita 1 dan 2 menyatakan dua digit angka, pita 3 adalah pengali (kelipatan 10), dan pita 4 adalah toleransi, yaitu seberapa jauh nilai sebenarnya boleh menyimpang. Untuk tahu sisi awal pembacaan, cari pita toleransi yang berwarna emas atau perak — pita itu selalu di ujung kanan, dan biasanya jaraknya sedikit lebih lebar dari pita lain.$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',5, jsonb_build_object('text',$txt$Persiapan Alat dan Bahan$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','LIST',6, jsonb_build_object('items', ARRAY[$i$Beberapa resistor 4 pita warna (berbagai nilai)$i$,$i$Multimeter digital untuk verifikasi hasil bacaan$i$,$i$Tabel kode warna resistor (cetak atau dari artikel ini)$i$,$i$Lampu meja atau kaca pembesar bila warna pita sulit dibedakan$i$])),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',7, jsonb_build_object('text',$txt$Langkah 1: Kenali Urutan Pita$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','PARAGRAPH',8, jsonb_build_object('text',$txt$Pegang resistor dengan pita emas atau perak di kanan. Baca dari kiri ke kanan: dua pita pertama adalah angka, pita ketiga pengali, pita keempat toleransi. Rumus sederhananya: nilai = (digit1 digit2) x 10 pangkat warna pita ketiga. Pita toleransi emas berarti nilai asli boleh menyimpang 5 persen, perak 10 persen.$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',9, jsonb_build_object('text',$txt$Langkah 2: Hafalkan Tabel Warna$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','LIST',10, jsonb_build_object('items', ARRAY[$i$Hitam = 0, Coklat = 1, Merah = 2$i$,$i$Oranye = 3, Kuning = 4, Hijau = 5$i$,$i$Biru = 6, Ungu = 7, Abu-abu = 8, Putih = 9$i$,$i$Emas sebagai pengali = kali 0,1 dan toleransi 5 persen$i$,$i$Perak sebagai pengali = kali 0,01 dan toleransi 10 persen$i$])),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','HEADING',11, jsonb_build_object('text',$txt$Langkah 3: Latihan Membaca$txt$)),
(gen_random_uuid(),'e6300001-0001-0001-0001-000000000001','PARAGRAPH',12, jsonb_build_object('text',$txt$Contoh 1: Merah - Merah - Coklat - Emas. Digit 22, pengali coklat = kali 10, jadi 220 ohm dengan toleransi 5 persen. Contoh 2: Kuning - Ungu - Merah - Emas. Digit 47, pengali merah = kali 100, jadi 4700 ohm atau 4,7 kilo-ohm. Setelah membaca, selalu verifikasi dengan multimeter. Checklist selesai: kamu bisa membaca 5 resistor berbeda dan hasil bacaan cocok dengan multimeter dalam batas toleransinya.$txt$));

-- ---------- ARTIKEL 2: TUT-MASAK16-001 (12 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',1, jsonb_build_object('text',$txt$Masalah: Kuah Soto Betawi Pecah atau Hambar$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','PARAGRAPH',2, jsonb_build_object('text',$txt$Soto Betawi terkenal dengan kuah santannya yang gurih dan kental. Masalah paling umum saat membuatnya di rumah: santan pecah menjadi gumpalan, kuah terasa hambar, atau daging masih alot. Ketiganya bisa dihindari dengan urutan memasak yang benar.$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',3, jsonb_build_object('text',$txt$Penjelasan: Kunci Soto Betawi$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','PARAGRAPH',4, jsonb_build_object('text',$txt$Berbeda dari soto bening, soto Betawi memakai santan kental sebagai dasar kuah, dengan daging sapi dan kadang jeroan sebagai isi. Rasa gurihnya berasal dari santan segar, serai, lengkuas, dan daun jeruk. Kunci suksesnya ada dua: daging direbus sampai benar-benar empuk, dan santan dimasak dengan api kecil sambil terus diaduk agar tidak pecah.$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',5, jsonb_build_object('text',$txt$Persiapan Bahan dan Alat$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','LIST',6, jsonb_build_object('items', ARRAY[$i$500 gram daging sapi (sandung lamur atau sengkel), potong dadu$i$,$i$800 ml santan dari 1 butir kelapa, pisahkan santan kental dan encer$i$,$i$2 batang serai, 3 cm lengkuas memarkan, 4 lembar daun jeruk$i$,$i$Bumbu halus: 8 bawang merah, 4 bawang putih, 4 kemiri, 2 cm kunyit, 1 sdt ketumbar, garam dan gula$i$,$i$Pelengkap: emping, kentang goreng, tomat, daun bawang, bawang goreng, sambal, jeruk nipis$i$])),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',7, jsonb_build_object('text',$txt$Langkah 1: Rebus Daging hingga Empuk$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','PARAGRAPH',8, jsonb_build_object('text',$txt$Rebus daging dalam air mendidih selama 10 menit, buang buih kotoran yang mengapung, lalu ganti air dan rebus kembali 1 sampai 1,5 jam hingga empuk. Cara ini membuat kuah lebih bersih dan tidak berbau. Simpan air rebusan sebagai kaldu.$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',9, jsonb_build_object('text',$txt$Langkah 2: Tumis Bumbu dan Masak Kuah$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','PARAGRAPH',10, jsonb_build_object('text',$txt$Tumis bumbu halus bersama serai, lengkuas, dan daun jeruk hingga harum dan matang. Masukkan ke dalam kaldu bersama daging, tuang santan encer, didihkan dengan api sedang. Terakhir tuang santan kental, kecilkan api, dan aduk perlahan terus-menerus selama 10 menit hingga kuah mengental dan berminyak di permukaan. Koreksi garam dan gula.$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','HEADING',11, jsonb_build_object('text',$txt$Risiko dan Kesalahan Umum$txt$)),
(gen_random_uuid(),'e6300002-0002-0002-0002-000000000002','PARAGRAPH',12, jsonb_build_object('text',$txt$Santan pecah terjadi karena api terlalu besar atau kuah dibiarkan tanpa diaduk setelah santan kental masuk. Daging alot berarti waktu rebus kurang — jangan terburu-buru mengecilkan api sebelum daging empuk. Kuah hambar biasanya karena garam ditambahkan di awal; bumbui di akhir setelah santan masuk agar rasa pas. Sajikan selagi panas dengan nasi, emping, dan sambal. Checklist selesai: kuah kental tidak pecah, daging empuk, rasa gurih seimbang.$txt$));

-- ---------- ARTIKEL 3: EXP-KIMIA18-001 (10 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','HEADING',1, jsonb_build_object('text',$txt$Apa Itu Karbon Dioksida?$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','PARAGRAPH',2, jsonb_build_object('text',$txt$Karbon dioksida (CO2) adalah gas tidak berwarna dan tidak berbau yang terdiri dari satu atom karbon dan dua atom oksigen. Gas ini ada secara alami di atmosfer dalam jumlah kecil, sekitar 0,04 persen, tetapi jumlahnya terus bertambah akibat aktivitas manusia.$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','HEADING',3, jsonb_build_object('text',$txt$Sumber Karbon Dioksida$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','LIST',4, jsonb_build_object('items', ARRAY[$i$Pernapasan makhluk hidup: manusia dan hewan mengeluarkan CO2$i$,$i$Pembakaran bahan bakar fosil: batu bara, minyak, dan gas untuk listrik dan kendaraan$i$,$i$Pembusukan bahan organik dan kebakaran hutan$i$,$i$Aktivitas vulkanik dan proses geologi$i$])),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','HEADING',5, jsonb_build_object('text',$txt$Efek Rumah Kaca$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','PARAGRAPH',6, jsonb_build_object('text',$txt$CO2 disebut gas rumah kaca karena cara kerjanya mirip kaca rumah kaca: cahaya matahari masuk dan menghangatkan bumi, tetapi panas yang dipantulkan kembali ke angkasa sebagian ditahan oleh CO2 di atmosfer. Tanpa efek rumah kaca alami, bumi akan terlalu dingin untuk kehidupan. Masalah muncul ketika CO2 berlebihan membuat bumi menahan terlalu banyak panas.$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','HEADING',7, jsonb_build_object('text',$txt$Dampak Kelebihan CO2$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','LIST',8, jsonb_build_object('items', ARRAY[$i$Pemanasan global: suhu rata-rata bumi naik$i$,$i$Mencairnya es kutub dan naiknya permukaan air laut$i$,$i$Cuaca ekstrem: banjir, kekeringan, dan badai yang lebih sering$i$,$i$Pengasaman laut yang mengancam terumbu karang$i$])),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','HEADING',9, jsonb_build_object('text',$txt$Upaya Mengurangi$txt$)),
(gen_random_uuid(),'e6300003-0003-0003-0003-000000000003','PARAGRAPH',10, jsonb_build_object('text',$txt$Emisi CO2 bisa ditekan dengan beralih ke energi terbarukan, hemat energi, menanam pohon yang menyerap CO2 lewat fotosintesis, dan mengurangi pembakaran tidak perlu. Setiap orang bisa ikut berperan: berjalan kaki untuk jarak dekat, mematikan alat elektronik yang tidak dipakai, dan mengurangi sampah adalah langkah kecil yang nyata.$txt$));

-- ---------- ARTIKEL 4: EXP-SEJARAH17-001 (10 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','HEADING',1, jsonb_build_object('text',$txt$Bencana 26 Desember 2004$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','PARAGRAPH',2, jsonb_build_object('text',$txt$Pada pagi hari Minggu, 26 Desember 2004, gempa berkekuatan sekitar 9,1 skala Richter mengguncang dasar laut di lepas pantai barat Sumatera. Gempa itu memicu gelombang tsunami raksasa yang menghantam pesisir Aceh dan 13 negara lain di sekitar Samudra Hindia. Bencana ini menewaskan lebih dari 230.000 jiwa dan menjadi salah satu bencana alam paling mematikan dalam sejarah modern.$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','HEADING',3, jsonb_build_object('text',$txt$Penyebab Tsunami$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','PARAGRAPH',4, jsonb_build_object('text',$txt$Gempa terjadi karena lempeng samudra Indo-Australia menyusup ke bawah lempeng Eurasia di zona subduksi Sumatera. Setelah ratusan tahun terkunci, lempeng itu tiba-tiba melompat naik beberapa meter, mendorong kolom air laut setinggi belasan meter. Gelombang tsunami kemudian merambat ke segala arah dengan kecepatan ratusan kilometer per jam.$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','HEADING',5, jsonb_build_object('text',$txt$Dampak Bencana$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','LIST',6, jsonb_build_object('items', ARRAY[$i$Aceh menjadi wilayah terdampak terparah dengan lebih dari 160.000 korban jiwa$i$,$i$Kota-kota pesisir seperti Banda Aceh dan Meulaboh hancur rata dengan tanah$i$,$i$Negara lain terdampak: Thailand, Sri Lanka, India, hingga Maladewa$i$,$i$Ratusan ribu orang kehilangan rumah dan mata pencaharian$i$])),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','HEADING',7, jsonb_build_object('text',$txt$Respons Dunia$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','PARAGRAPH',8, jsonb_build_object('text',$txt$Bencana ini memicu gelombang solidaritas internasional terbesar pada masanya. Puluhan negara mengirim bantuan darurat, tim medis, dan dana rekonstruksi. Di Indonesia dibentuk Badan Rehabilitasi dan Rekonstruksi (BRR) Aceh-Nias untuk membangun kembali rumah, sekolah, dan infrastruktur yang hancur.$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','HEADING',9, jsonb_build_object('text',$txt$Pelajaran yang Dipetik$txt$)),
(gen_random_uuid(),'e6300004-0004-0004-0004-000000000004','PARAGRAPH',10, jsonb_build_object('text',$txt$Sebelum 2004, Samudra Hindia belum memiliki sistem peringatan dini tsunami. Setelah bencana, Indonesia membangun InaTEWS, sistem peringatan dini tsunami dengan sensor gempa, pelampung laut, dan sirene di pesisir. Pelajaran terpentingnya: masyarakat pesisir harus tahu tanda alam tsunami — gempa kuat yang lama, air laut surut tiba-tiba — dan segera lari ke tempat tinggi tanpa menunggu peringatan resmi.$txt$));

-- ---------- ARTIKEL 5: SCH-SMA-FIS5-001 (12 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',1, jsonb_build_object('text',$txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','LIST',2, jsonb_build_object('items', ARRAY[$i$Menjelaskan pengertian induksi elektromagnetik$i$,$i$Menyebutkan bunyi hukum Faraday dan hukum Lenz$i$,$i$Menghitung GGL induksi pada kumparan$i$,$i$Menentukan arah arus induksi dengan kaidah tangan kanan$i$])),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',3, jsonb_build_object('text',$txt$Pengertian Induksi Elektromagnetik$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','PARAGRAPH',4, jsonb_build_object('text',$txt$Induksi elektromagnetik adalah peristiwa timbulnya arus listrik pada kumparan karena perubahan medan magnet di sekitarnya. Peristiwa ini ditemukan Michael Faraday pada tahun 1831. Syaratnya: harus ada perubahan jumlah garis gaya magnet (fluks magnetik) yang menembus kumparan — medan magnet yang diam tidak menghasilkan arus.$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',5, jsonb_build_object('text',$txt$Hukum Faraday$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','PARAGRAPH',6, jsonb_build_object('text',$txt$Hukum Faraday menyatakan besarnya GGL (gaya gerak listrik) induksi sebanding dengan laju perubahan fluks magnetik. Rumusnya: epsilon = -N dikali delta phi dibagi delta t, dengan N jumlah lilitan dan phi fluks magnetik. Artinya: semakin cepat perubahan medan magnet dan semakin banyak lilitan, semakin besar tegangan yang dihasilkan. Prinsip inilah yang dipakai generator listrik.$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',7, jsonb_build_object('text',$txt$Hukum Lenz$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','PARAGRAPH',8, jsonb_build_object('text',$txt$Hukum Lenz menjelaskan arah arus induksi: arus induksi selalu melawan perubahan yang menimbulkannya. Itulah makna tanda negatif pada rumus Faraday. Jika kutub utara magnet didekatkan ke kumparan, kumparan menjadi kutub utara juga sehingga menolak magnet — seolah kumparan berusaha mempertahankan keadaan semula.$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',9, jsonb_build_object('text',$txt$Contoh Soal$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','PARAGRAPH',10, jsonb_build_object('text',$txt$Contoh: sebuah kumparan 200 lilitan mengalami perubahan fluks dari 0,05 weber menjadi 0,01 weber dalam 0,2 sekon. Besar GGL induksi = -200 x (0,01 - 0,05) / 0,2 = -200 x (-0,04) / 0,2 = 40 volt. Tanda positif pada hasil akhir menunjukkan besarnya, sedangkan arahnya ditentukan hukum Lenz.$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','HEADING',11, jsonb_build_object('text',$txt$Latihan$txt$)),
(gen_random_uuid(),'e6300005-0005-0005-0005-000000000005','LIST',12, jsonb_build_object('items', ARRAY[$i$Soal 1: Kumparan 100 lilitan, fluks berubah dari 0,06 Wb ke 0,02 Wb dalam 0,1 s. Hitung GGL induksi. (Kunci: 40 volt)$i$,$i$Soal 2: Mengapa memutar magnet di dalam kumparan menghasilkan arus, tetapi magnet diam tidak? (Kunci: perlu perubahan fluks)$i$,$i$Soal 3: Kutub utara magnet dijauhkan dari kumparan. Ujung kumparan yang menghadap magnet menjadi kutub apa? (Kunci: kutub selatan, agar menarik kembali)$i$]));

-- ---------- ARTIKEL 6: SCH-SD-MAT16-001 (12 block) ----------
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',1, jsonb_build_object('text',$txt$Tujuan Pembelajaran$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','LIST',2, jsonb_build_object('items', ARRAY[$i$Menyebutkan unsur-unsur lingkaran: titik pusat, jari-jari, diameter$i$,$i$Menghitung keliling lingkaran$i$,$i$Menghitung luas lingkaran$i$,$i$Menyelesaikan soal cerita tentang lingkaran$i$])),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',3, jsonb_build_object('text',$txt$Mengenal Lingkaran$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','PARAGRAPH',4, jsonb_build_object('text',$txt$Lingkaran adalah bangun datar yang semua titik pada sisinya berjarak sama dari satu titik tengah yang disebut titik pusat. Jarak dari titik pusat ke sisi lingkaran disebut jari-jari (r). Garis lurus yang melewati titik pusat dan menghubungkan dua sisi lingkaran disebut diameter (d), yang panjangnya dua kali jari-jari. Contoh benda berbentuk lingkaran: uang koin, tutup botol, dan roda sepeda.$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',5, jsonb_build_object('text',$txt$Keliling Lingkaran$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','PARAGRAPH',6, jsonb_build_object('text',$txt$Keliling lingkaran dihitung dengan rumus K = 2 x pi x r atau K = pi x d. Nilai pi adalah perbandingan keliling terhadap diameter, kira-kira 3,14. Gunakan pi = 22/7 jika jari-jari atau diameternya kelipatan 7, dan pi = 3,14 untuk yang lain agar hitungan mudah.$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',7, jsonb_build_object('text',$txt$Luas Lingkaran$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','PARAGRAPH',8, jsonb_build_object('text',$txt$Luas lingkaran dihitung dengan rumus L = pi x r x r. Ingat, yang dikuadratkan adalah jari-jarinya, bukan diameternya. Jika soal memberi diameter, bagi dua dulu untuk mendapatkan jari-jari.$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',9, jsonb_build_object('text',$txt$Contoh Soal$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','PARAGRAPH',10, jsonb_build_object('text',$txt$Contoh 1: sebuah tutup panci berjari-jari 14 cm. Kelilingnya = 2 x 22/7 x 14 = 88 cm. Luasnya = 22/7 x 14 x 14 = 616 cm persegi. Contoh 2: roda sepeda berdiameter 70 cm, jari-jarinya 35 cm. Keliling roda = 22/7 x 70 = 220 cm.$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','HEADING',11, jsonb_build_object('text',$txt$Latihan$txt$)),
(gen_random_uuid(),'e6300006-0006-0006-0006-000000000006','LIST',12, jsonb_build_object('items', ARRAY[$i$Soal 1: Jari-jari lingkaran 7 cm. Hitung keliling dan luasnya! (Kunci: keliling 44 cm, luas 154 cm persegi)$i$,$i$Soal 2: Diameter sebuah jam dinding 28 cm. Berapa luasnya? (Kunci: 616 cm persegi)$i$,$i$Soal 3: Keliling sebuah lingkaran 62,8 cm. Berapa jari-jarinya? (Kunci: 10 cm)$i$]));

COMMIT;
