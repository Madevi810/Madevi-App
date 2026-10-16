-- Batch 42: 6 artikel konten Madevi (DRAFT, id)
-- Idempotent: re-run aman (ON CONFLICT DO NOTHING + hapus block lama sebelum insert)
BEGIN;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, created_by, updated_by, status)
VALUES
('e4200001-0001-4001-8001-000000000001','TUT-ELEKTRONIK4-001','b4444444-4444-4444-4444-444444444444','Arduino untuk Pemula: LED Pertama','arduino-untuk-pemula-led-pertama','Panduan langkah demi langkah menyalakan LED pertama dengan Arduino Uno: dari instalasi sampai kode blink.','id',8,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT'),
('e4200002-0002-4002-8002-000000000002','TUT-MASAK7-001','b7777777-7777-7777-7777-777777777777','Sate Ayam Madura: Resep Bumbu Kacang','sate-ayam-madura-resep-bumbu-kacang','Resep sate ayam khas Madura dengan bumbu kacang kental: marinasi, teknik bakar, dan sambal pelengkap.','id',7,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT'),
('e4200003-0003-4003-8003-000000000003','EXP-BIOLOGI6-001','caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Fotosintesis: Dapur Energi Bumi','fotosintesis-dapur-energi-bumi','Bagaimana tumbuhan mengubah cahaya matahari menjadi makanan — proses yang menghidupi hampir semua kehidupan di Bumi.','id',6,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT'),
('e4200004-0004-4004-8004-000000000004','EXP-SEJARAH8-001','c8888888-8888-8888-8888-888888888888','Proklamasi 1945: Detik-detik Kemerdekaan','proklamasi-1945-detik-detik-kemerdekaan','Kisah di balik pembacaan teks Proklamasi 17 Agustus 1945: dari Rengasdengklok hingga Pegangsaan Timur 56.','id',6,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT'),
('e4200005-0005-4005-8005-000000000005','SCH-SMP-BIO4-001','d4444444-4444-4444-4444-444444444444','IPA Kelas 9: Bioteknologi','ipa-kelas-9-bioteknologi','Materi bioteknologi konvensional dan modern untuk kelas 9: fermentasi, kultur jaringan, hingga rekayasa genetika, plus latihan soal.','id',8,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT'),
('e4200006-0006-4006-8006-000000000006','SCH-SD-AGAMA3-001','d9999999-9999-9999-9999-999999999999','Pendidikan Agama Kelas 6: Zakat','pendidikan-agama-kelas-6-zakat','Materi zakat untuk kelas 6 SD: pengertian, zakat fitrah dan zakat mal, 8 golongan penerima, plus latihan soal.','id',7,'f7125028-187e-44e0-b95b-88b69b8d5c9a','f7125028-187e-44e0-b95b-88b69b8d5c9a','DRAFT')
ON CONFLICT (id) DO NOTHING;

DELETE FROM madevi.article_blocks WHERE article_id IN
('e4200001-0001-4001-8001-000000000001','e4200002-0002-4002-8002-000000000002','e4200003-0003-4003-8003-000000000003','e4200004-0004-4004-8004-000000000004','e4200005-0005-4005-8005-000000000005','e4200006-0006-4006-8006-000000000006');

-- Artikel 1: TUT-ELEKTRONIK4-001 (12 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',0,jsonb_build_object('text',$t$Masalah: Ingin Belajar Elektronika, tapi Bingung Mulai dari Mana$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','PARAGRAPH',1,jsonb_build_object('text',$t$Banyak pemula tertarik membuat alat elektronik sendiri — lampu otomatis, sensor, robot kecil — tetapi mundur karena mengira harus paham rangkaian rumit dan mahal. Padahal ada jalan masuk yang murah dan aman: Arduino, papan mikrokontroler yang dirancang khusus untuk belajar.$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',2,jsonb_build_object('text',$t$Penjelasan: Apa Itu Arduino?$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','PARAGRAPH',3,jsonb_build_object('text',$t$Arduino adalah papan sirkuit kecil berisi mikrokontroler yang bisa diprogram untuk membaca sensor dan mengendalikan lampu, motor, atau perangkat lain. Arduino Uno adalah model paling populer untuk pemula: murah, banyak tutorial, dan komunitasnya besar. Program ditulis dalam bahasa mirip C++ lewat aplikasi gratis bernama Arduino IDE.$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',4,jsonb_build_object('text',$t$Alat dan Bahan yang Dibutuhkan$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','LIST',5,jsonb_build_object('text',$t$Arduino Uno (asli atau klon yang kompatibel)
Kabel USB tipe A ke tipe B (biasanya sudah termasuk dalam paket)
LED (satu buah, warna bebas)
Resistor 220 ohm (satu buah — penting sebagai pengaman LED)
Breadboard dan kabel jumper (opsional, tapi sangat memudahkan)
Komputer/laptop dengan Arduino IDE terinstal$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',6,jsonb_build_object('text',$t$Langkah-langkah: Menyalakan LED Pertama$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','LIST',7,jsonb_build_object('text',$t$Pasang resistor 220 ohm seri dengan LED: kaki panjang LED (anoda) ke resistor, kaki pendek (katoda) ke pin GND Arduino.
Sambungkan ujung resistor ke pin digital 13 pada Arduino.
Hubungkan Arduino ke komputer dengan kabel USB.
Buka Arduino IDE, pilih menu Tools > Board > Arduino Uno, lalu Tools > Port > port yang terdeteksi.
Buka contoh program: File > Examples > 01.Basics > Blink.
Tekan tombol Upload (panah kanan). Tunggu hingga muncul tulisan "Done uploading".
LED akan berkedip setiap satu detik — selamat, proyek pertama Anda berhasil!$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',8,jsonb_build_object('text',$t$Risiko dan Kesalahan Umum$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','LIST',9,jsonb_build_object('text',$t$JANGAN menghubungkan LED langsung ke pin tanpa resistor — LED bisa terbakar dan pin Arduino bisa rusak.
JANGAN menyambungkan pin 5V langsung ke GND (korsleting) — ini bisa merusak papan.
Upload gagal? Periksa lagi pilihan Board dan Port di menu Tools.
LED tidak menyala? Kemungkinan kaki LED terbalik — kaki panjang harus ke arah positif.$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','HEADING',10,jsonb_build_object('text',$t$Pemeriksaan Hasil dan Tindak Lanjut$t$)),
(gen_random_uuid(),'e4200001-0001-4001-8001-000000000001','PARAGRAPH',11,jsonb_build_object('text',$t$Jika LED berkedip ritmis, rangkaian dan program Anda benar. Coba ubah angka delay(1000) menjadi delay(200) lalu upload ulang untuk melihat kedipan lebih cepat — inilah cara belajar pemrograman Arduino: ubah satu hal, lihat hasilnya. Langkah berikut: coba dua LED bergantian, lalu tambahkan tombol (push button) sebagai sakelar.$t$));

-- Artikel 2: TUT-MASAK7-001 (12 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',0,jsonb_build_object('text',$t$Masalah: Sate Ayam Buatan Sendiri Kurang "Nendang"$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','PARAGRAPH',1,jsonb_build_object('text',$t$Sate ayam Madura terkenal dengan bumbu kacangnya yang kental, gurih, dan sedikit manis, plus aroma bakaran arang yang khas. Banyak yang mencoba di rumah tetapi hasilnya hambar: daging kering, bumbu encer, dan tidak ada aroma bakaran. Masalahnya biasanya ada di tiga hal: marinasi yang terlalu singkat, bumbu kacang yang kurang dimasak, dan api yang salah.$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',2,jsonb_build_object('text',$t$Penjelasan: Kunci Kelezatan Sate Madura$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','PARAGRAPH',3,jsonb_build_object('text',$t$Ciri khas sate Madura ada dua. Pertama, potongan ayamnya kecil-kecil sehingga bumbu meresap dan cepat matang. Kedua, bumbu kacangnya dimasak hingga berminyak dan kental — bukan sekadar kacang yang diulek lalu disiram air panas. Ditambah kecap manis dan sambal rawit sebagai pendamping, inilah cita rasa yang membuatnya legendaris.$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',4,jsonb_build_object('text',$t$Bahan-bahan$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','LIST',5,jsonb_build_object('text',$t$500 gram fillet ayam, potong dadu kecil (sekitar 2 cm)
Tusuk sate secukupnya, rendam air 15 menit agar tidak mudah gosong
Bumbu marinasi: 3 siung bawang putih halus, 1 sdt ketumbar bubuk, 2 sdm kecap manis, 1 sdt garam, 1 sdm minyak
Bumbu kacang: 200 gram kacang tanah goreng, 3 siung bawang putih, 4 buah cabai merah (sesuai selera), 2 sdm gula merah, 1 sdt garam, 300 ml air, 2 sdm minyak untuk menumis
Pelengkap: kecap manis, sambal rawit, irisan bawang merah, lontong$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',6,jsonb_build_object('text',$t$Langkah Memasak$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','LIST',7,jsonb_build_object('text',$t$Marinasi: campur potongan ayam dengan bumbu marinasi, diamkan minimal 30 menit (lebih lama lebih meresap).
Tusukkan 4–5 potong ayam ke setiap tusuk sate.
Bumbu kacang: haluskan kacang tanah goreng, bawang putih, dan cabai. Tumis dengan minyak, masukkan gula merah, garam, dan air. Masak dengan api kecil sambil diaduk hingga kental dan keluar minyak di permukaan — sekitar 15 menit.
Bakar sate di atas bara arang (atau teflon dengan api sedang), olesi dengan sedikit bumbu kacang encer dan kecap manis. Bolak-balik hingga matang merata dan ada bagian yang sedikit gosong — sekitar 8–10 menit.
Sajikan sate di atas piring, siram dengan bumbu kacang kental, tambah kecap manis dan sambal sesuai selera.$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',8,jsonb_build_object('text',$t$Risiko dan Kesalahan Umum$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','LIST',9,jsonb_build_object('text',$t$Ayam terlalu besar dipotong → luar gosong, dalam mentah. Potong kecil dan seragam.
Bumbu kacang encer → kurang dimasak. Masak hingga benar-benar kental dan berminyak.
Api terlalu besar → sate gosong pahit. Pakai api sedang dan sering dibolak-balik.
Awas bara dan asap saat membakar — lakukan di area berventilasi baik.$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','HEADING',10,jsonb_build_object('text',$t$Pemeriksaan Hasil dan Tindak Lanjut$t$)),
(gen_random_uuid(),'e4200002-0002-4002-8002-000000000002','PARAGRAPH',11,jsonb_build_object('text',$t$Sate berhasil jika dagingnya empuk dan juicy, ada aroma bakaran, dan bumbu kacangnya kental menempel. Simpan sisa bumbu kacang di kulkas (tahan 3–4 hari) — bisa dipakai untuk batagor atau gado-gado. Untuk variasi, coba ganti ayam dengan kambing muda menggunakan resep yang sama.$t$));
-- Artikel 3: EXP-BIOLOGI6-001 (10 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','HEADING',0,jsonb_build_object('text',$t$Fotosintesis: Dapur Energi yang Menghidupi Bumi$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','PARAGRAPH',1,jsonb_build_object('text',$t$Setiap gigitan makanan yang Anda makan — nasi, sayur, bahkan daging — pada akhirnya berasal dari satu proses: fotosintesis. Tumbuhan, alga, dan beberapa bakteri mampu menangkap energi cahaya matahari dan mengubahnya menjadi gula, bahan bakar kimia bagi hampir seluruh kehidupan di Bumi.$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','HEADING',2,jsonb_build_object('text',$t$Resep Kimia Fotosintesis$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','PARAGRAPH',3,jsonb_build_object('text',$t$Bahan bakunya sederhana: karbon dioksida dari udara dan air dari tanah, ditambah energi cahaya matahari. Hasilnya: glukosa (gula) dan oksigen. Persamaan sederhananya: 6CO2 + 6H2O + cahaya → C6H12O6 + 6O2. Oksigen yang Anda hirup saat ini sebagian besar adalah "limbah" dari proses ini — limbah yang justru memungkinkan hewan bernapas.$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','HEADING',4,jsonb_build_object('text',$t$Di Mana Prosesnya Terjadi?$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','PARAGRAPH',5,jsonb_build_object('text',$t$Fotosintesis terjadi di dalam kloroplas, organel kecil di sel daun yang mengandung pigmen hijau bernama klorofil. Klorofil inilah yang menangkap cahaya — terutama cahaya merah dan biru — dan membuat daun tampak hijau karena cahaya hijau justru dipantulkan, bukan diserap.$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','HEADING',6,jsonb_build_object('text',$t$Dua Tahap: Terang dan Gelap$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','PARAGRAPH',7,jsonb_build_object('text',$t$Tahap pertama, reaksi terang, membutuhkan cahaya langsung untuk memecah air dan menghasilkan energi pembawa. Tahap kedua, siklus Calvin (reaksi gelap), memakai energi tersebut untuk merakit karbon dioksida menjadi gula — tahap ini tidak butuh cahaya langsung, tetapi bergantung pada hasil tahap pertama. Keduanya bekerja berpasangan seperti lini produksi pabrik.$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','HEADING',8,jsonb_build_object('text',$t$Mengapa Ini Penting bagi Kita?$t$)),
(gen_random_uuid(),'e4200003-0003-4003-8003-000000000003','PARAGRAPH',9,jsonb_build_object('text',$t$Fotosintesis adalah fondasi rantai makanan: produsen (tumbuhan) dimakan konsumen (hewan), yang dimakan konsumen lain. Ia juga menyeimbangkan atmosfer — menyerap karbon dioksida dan melepas oksigen. Hutan hujan tropis dan fitoplankton di laut adalah "paru-paru" raksasa yang menjalankan proses ini dalam skala planet, sehingga menjaga keduanya berarti menjaga dapur energi Bumi tetap menyala.$t$));

-- Artikel 4: EXP-SEJARAH8-001 (10 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','HEADING',0,jsonb_build_object('text',$t$Proklamasi 1945: Detik-detik Kelahiran Indonesia$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','PARAGRAPH',1,jsonb_build_object('text',$t$Jumat pagi, 17 Agustus 1945, sekitar pukul 10.00. Di sebuah rumah sederhana di Jalan Pegangsaan Timur Nomor 56, Jakarta, Soekarno membacakan teks singkat — hanya dua paragraf — yang mengubah nasib sebuah bangsa: Indonesia merdeka. Di balik momen singkat itu tersimpan malam penuh ketegangan.$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','HEADING',2,jsonb_build_object('text',$t$Rengasdengklok: Tekanan dari Para Pemuda$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','PARAGRAPH',3,jsonb_build_object('text',$t$Sehari sebelumnya, 16 Agustus dini hari, para pemuda "menculik" Soekarno dan Hatta ke Rengasdengklok, Karawang. Mereka mendesak agar kemerdekaan diproklamasikan segera, tanpa menunggu badan bentukan Jepang (PPKI). Para pemuda khawatir momentum hilang jika menunggu. Setelah perundingan alot, disepakati: proklamasi dibacakan keesokan harinya di Jakarta.$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','HEADING',4,jsonb_build_object('text',$t$Malam Perumusan Naskah$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','PARAGRAPH',5,jsonb_build_object('text',$t$Malam harinya di rumah Laksamana Maeda, Soekarno, Hatta, dan Ahmad Subardjo merumuskan teks proklamasi. Soekarno menulis konsepnya, Hatta dan Subardjo memberi masukan kalimat per kalimat. Sayuti Melik mengetik naskah final. Setiap kata dipilih hati-hati karena teks ini akan dibaca dunia.$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','HEADING',6,jsonb_build_object('text',$t$Detik-detik Pembacaan$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','PARAGRAPH',7,jsonb_build_object('text',$t$Pagi itu suasana tegang: tentara Jepang masih berpatroli dan bisa menggagalkan acara kapan saja. Soekarno membacakan teks dengan suara tegas, didampingi Hatta. Bendera Merah Putih — yang dijahit Fatmawati — dikibarkan, dan hadirin menyanyikan Indonesia Raya. Momen yang hanya beberapa menit itu menandai lahirnya Republik Indonesia.$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','HEADING',8,jsonb_build_object('text',$t$Makna bagi Kita Hari Ini$t$)),
(gen_random_uuid(),'e4200004-0004-4004-8004-000000000004','PARAGRAPH',9,jsonb_build_object('text',$t$Proklamasi bukan akhir perjuangan — setelahnya Indonesia harus mempertahankan kemerdekaan lewat perang dan diplomasi selama bertahun-tahun. Pelajarannya: kemerdekaan lahir dari keberanian mengambil keputusan di saat genting, persatuan antara golongan tua dan muda, dan ketelitian merumuskan gagasan. Nilai-nilai inilah yang tetap relevan setiap kali bangsa menghadapi persimpangan.$t$));
-- Artikel 5: SCH-SMP-BIO4-001 (12 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',0,jsonb_build_object('text',$t$Tujuan Pembelajaran$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','PARAGRAPH',1,jsonb_build_object('text',$t$Setelah mempelajari materi ini, kamu diharapkan mampu: (1) menjelaskan pengertian bioteknologi; (2) membedakan bioteknologi konvensional dan modern beserta contohnya; (3) menyebutkan manfaat bioteknologi dalam kehidupan sehari-hari.$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',2,jsonb_build_object('text',$t$Pengertian Bioteknologi$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','PARAGRAPH',3,jsonb_build_object('text',$t$Bioteknologi adalah pemanfaatan makhluk hidup (atau bagian-bagiannya) untuk menghasilkan produk atau jasa yang bermanfaat bagi manusia. Kata kuncinya: memanfaatkan proses biologis — terutama oleh mikroorganisme seperti bakteri dan jamur — secara terencana.$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',4,jsonb_build_object('text',$t$Bioteknologi Konvensional$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','PARAGRAPH',5,jsonb_build_object('text',$t$Bioteknologi konvensional sudah dikenal sejak ribuan tahun lalu dan memanfaatkan fermentasi — proses penguraian bahan oleh mikroorganisme tanpa rekayasa genetika. Contoh yang dekat dengan kita: tempe (fermentasi kedelai oleh jamur Rhizopus), tape (fermentasi oleh ragi Saccharomyces), yoghurt dan keju (fermentasi susu oleh bakteri Lactobacillus), serta kecap.$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',6,jsonb_build_object('text',$t$Bioteknologi Modern$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','PARAGRAPH',7,jsonb_build_object('text',$t$Bioteknologi modern melibatkan rekayasa di tingkat sel atau DNA, misalnya: kultur jaringan (memperbanyak tanaman unggul dari sepotong kecil jaringan), rekayasa genetika (memindahkan gen antarorganisme, contohnya padi tahan hama), bayi tabung, dan produksi insulin dengan bakteri hasil rekayasa genetika untuk penderita diabetes.$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',8,jsonb_build_object('text',$t$Perbandingan Keduanya$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','LIST',9,jsonb_build_object('text',$t$Konvensional: teknik sederhana (fermentasi), biaya murah, sudah lama dikenal — contoh: tempe, tape, yoghurt.
Modern: teknik canggih (rekayasa DNA, kultur jaringan), hasil lebih presisi, butuh laboratorium — contoh: insulin hasil rekayasa genetika, tanaman transgenik.
Persamaan: keduanya memanfaatkan makhluk hidup untuk menghasilkan produk bermanfaat.$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','HEADING',10,jsonb_build_object('text',$t$Latihan Soal$t$)),
(gen_random_uuid(),'e4200005-0005-4005-8005-000000000005','LIST',11,jsonb_build_object('text',$t$1. Jelaskan perbedaan bioteknologi konvensional dan modern, masing-masing beri dua contoh!
2. Mikroorganisme apa yang berperan dalam pembuatan tempe dan yoghurt?
3. Sebutkan dua manfaat bioteknologi modern di bidang kesehatan!
Kunci jawaban:
1. Konvensional memakai fermentasi alami tanpa rekayasa genetika (contoh: tempe, tape); modern memakai rekayasa DNA/sel di laboratorium (contoh: insulin rekayasa genetika, tanaman transgenik).
2. Tempe: jamur Rhizopus; yoghurt: bakteri Lactobacillus.
3. Produksi insulin untuk penderita diabetes dan produksi vaksin/antibiotik.$t$));

-- Artikel 6: SCH-SD-AGAMA3-001 (12 block)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content) VALUES
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',0,jsonb_build_object('text',$t$Tujuan Pembelajaran$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','PARAGRAPH',1,jsonb_build_object('text',$t$Setelah belajar materi ini, kamu diharapkan bisa: (1) menjelaskan pengertian zakat; (2) menyebutkan macam-macam zakat; (3) menyebutkan 8 golongan yang berhak menerima zakat; (4) mempraktikkan sikap peduli terhadap sesama.$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',2,jsonb_build_object('text',$t$Pengertian Zakat$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','PARAGRAPH',3,jsonb_build_object('text',$t$Zakat artinya membersihkan atau menyucikan. Menurut istilah, zakat adalah mengeluarkan sebagian harta tertentu yang wajib diberikan kepada orang-orang yang berhak menerimanya, sebagai salah satu rukun Islam. Dengan berzakat, harta kita menjadi bersih dan berkah, sekaligus membantu saudara yang membutuhkan.$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',4,jsonb_build_object('text',$t$Macam-macam Zakat$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','PARAGRAPH',5,jsonb_build_object('text',$t$Ada dua macam zakat yang wajib kita kenal. Pertama, zakat fitrah: zakat yang dikeluarkan setiap bulan Ramadan sebelum salat Idulfitri, berupa makanan pokok (di Indonesia umumnya beras) sebanyak 2,5 kg atau 3,5 liter per jiwa. Kedua, zakat mal: zakat harta kekayaan seperti emas, perak, uang tabungan, hasil pertanian, dan hasil perdagangan yang sudah mencapai nisab (batas minimal) dan haul (satu tahun).$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',6,jsonb_build_object('text',$t$Delapan Golongan Penerima Zakat$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','LIST',7,jsonb_build_object('text',$t$Fakir: orang yang sangat miskin dan tidak punya penghasilan.
Miskin: orang yang penghasilannya tidak cukup untuk kebutuhan hidup.
Amil: petugas yang mengurus pengumpulan dan pembagian zakat.
Mualaf: orang yang baru masuk Islam dan butuh dikuatkan.
Riqab: budak yang ingin memerdekakan diri (konteks zaman dahulu).
Gharim: orang yang berutang dan tidak mampu membayar.
Fisabilillah: orang yang berjuang di jalan Allah.
Ibnu sabil: musafir yang kehabisan bekal di perjalanan.$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',8,jsonb_build_object('text',$t$Hikmah Berzakat$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','PARAGRAPH',9,jsonb_build_object('text',$t$Zakat mengajarkan kita banyak hal baik: membersihkan hati dari sifat kikir, menumbuhkan kepedulian kepada sesama, mengurangi kesenjangan antara kaya dan miskin, serta membuat harta menjadi berkah. Orang yang rajin berzakat dicintai Allah dan disayangi sesama manusia.$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','HEADING',10,jsonb_build_object('text',$t$Latihan Soal$t$)),
(gen_random_uuid(),'e4200006-0006-4006-8006-000000000006','LIST',11,jsonb_build_object('text',$t$1. Apa pengertian zakat menurut istilah?
2. Sebutkan dua macam zakat beserta pengertiannya!
3. Berapa besar zakat fitrah yang wajib dikeluarkan setiap jiwa?
4. Sebutkan empat dari delapan golongan penerima zakat!
Kunci jawaban:
1. Mengeluarkan sebagian harta tertentu yang wajib diberikan kepada yang berhak, sebagai rukun Islam.
2. Zakat fitrah (dikeluarkan tiap Ramadan sebelum Idulfitri) dan zakat mal (zakat harta kekayaan yang mencapai nisab dan haul).
3. 2,5 kg atau 3,5 liter makanan pokok (beras).
4. Contoh: fakir, miskin, amil, mualaf (atau empat lainnya yang benar).$t$));

COMMIT;
