-- artikel-batch106.sql — 6 artikel (2 Tutorial, 2 Explore, 2 School), idempoten
-- Dibuat: batch 106. Aman dijalankan ulang (ON CONFLICT + hapus block lama).
-- KOREKSI: SCH-SMP-MAT16-001 diganti dari Teorema Pythagoras menjadi Relasi dan Fungsi
-- (duplikasi topik dengan SCH-SMP-MAT-001/SCH-SMP-MAT7-001).

BEGIN;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('623049ab-eaf7-48cb-aeb7-51e04493ce5a', 'TUT-KOMPUTER27-001', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', $$Disk Cleanup: Membersihkan Ruang Penyimpanan Windows$$, 'disk-cleanup-bersihkan-windows', $$Panduan membersihkan file sampah dan file sistem yang tidak perlu di Windows memakai Disk Cleanup bawaan agar penyimpanan lega dan komputer lebih responsif.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('1ec27fa6-e2ac-466c-b8ba-aae7c3eaa079', 'TUT-KESEHATAN49-001', 'b5555555-5555-5555-5555-555555555555', $$Pinggang Sakit: Peregangan yang Aman di Rumah$$, 'pinggang-sakit-peregangan-aman', $$Cara mengenali penyebab umum sakit pinggang dan melakukan peregangan ringan yang aman di rumah, lengkap dengan tanda bahaya yang mengharuskan ke dokter.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('40f513e4-ec00-4342-9b91-bda13e4add10', 'EXP-ANTROPOLOGI26-001', 'c8888888-8888-8888-8888-888888888888', $$Suku Toraja: Mengenal Upacara Rambu Solo$$, 'suku-toraja-upacara-rambu-solo', $$Mengenal masyarakat Toraja di Sulawesi Selatan dan upacara pemakaman adat Rambu Solo — ritual penghormatan terakhir yang sarat makna filosofis.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('584cadf6-b306-4e7b-87fb-459125ae4b69', 'EXP-KIMIA44-001', 'c4444444-4444-4444-4444-444444444444', $$Kalsium: Mineral Penjaga Tulang dan Gigi$$, 'kalsium-mineral-tulang-dan-gigi', $$Mengenal kalsium — unsur kimia dan mineral penting pembentuk tulang dan gigi, sumber makanannya, serta peran vitalnya bagi tubuh manusia.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('c093d3c3-b790-4363-8bba-adb2202b78ab', 'SCH-SMP-MAT16-001', 'd4444444-4444-4444-4444-444444444444', $$Matematika Kelas 8: Relasi dan Fungsi$$, 'matematika-kelas-8-relasi-dan-fungsi', $$Materi Relasi dan Fungsi untuk kelas 8 SMP: pengertian relasi, fungsi, domain kodomain range, notasi fungsi, latihan soal, dan kunci jawaban.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary,
    language, reading_minutes, creator_principal_id, access_level, status,
    attribution_type, created_by, updated_by)
VALUES ('71d54b63-5cca-49aa-a2f4-186e2cbe81d7', 'SCH-SD-IPS30-001', 'd1000003-0000-0000-0000-000000000003', $$IPS Kelas 3: Mengenal Jenis-Jenis Pekerjaan$$, 'ips-kelas-3-jenis-jenis-pekerjaan', $$Materi IPS kelas 3 SD tentang jenis-jenis pekerjaan di sekitar kita: pekerjaan yang menghasilkan barang dan jasa, serta sikap menghargai setiap pekerjaan.$$,
    'id', 5, 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'MEMBER', 'DRAFT',
    'DEVELOPED_BY', 'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a')
ON CONFLICT (business_code) DO NOTHING;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KOMPUTER27-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Masalah yang Dipecahkan$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Ruang penyimpanan (disk) komputer yang hampir penuh membuat Windows berjalan lambat: program lama dibuka, pembaruan sistem gagal terunduh, dan penyimpanan file baru ditolak. Penyebab umum yang jarang disadari adalah menumpuknya file sampah: file sementara (temporary files), cache pembaruan Windows, isi Recycle Bin yang tidak pernah dikosongkan, dan file sistem lama dari pembaruan besar Windows. Disk Cleanup adalah utilitas bawaan Windows yang dirancang khusus untuk menghapus kategori-kategori file yang aman dihapus, tanpa perlu menginstal aplikasi pihak ketiga yang justru sering membawa iklan atau malware.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Penjelasan Singkat$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Disk Cleanup memindai drive dan menampilkan daftar kategori file yang bisa dihapus beserta perkiraan ukuran masing-masing. Kategori tersebut antara lain Temporary Internet Files, Delivery Optimization Files, Recycle Bin, Temporary files, Thumbnails, dan setelah mengklik "Clean up system files" akan muncul kategori tambahan seperti Windows Update Cleanup dan Previous Windows installation(s). Yang terpenting: Disk Cleanup hanya menghapus file yang sudah tidak dibutuhkan sistem — dokumen, foto, dan program Anda tidak akan disentuh kecuali Anda mencentang kotak yang salah.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Persiapan Alat$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Yang dibutuhkan hanyalah komputer Windows 10 atau Windows 11 dengan akun yang memiliki hak akses administrator (untuk membersihkan file sistem). Tidak perlu mengunduh apa pun. Sebelum mulai, simpan dan tutup dokumen yang sedang dibuka — sebagai langkah aman, meskipun Disk Cleanup pada dasarnya tidak mengganggu file pengguna.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Langkah-Langkah$$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Buka Disk Cleanup: tekan tombol Windows, ketik "Disk Cleanup", lalu klik hasilnya. Jika ingin membersihkan file sistem sekaligus, klik kanan hasil pencarian lalu pilih "Run as administrator".$txt$, $txt$Pilih drive yang ingin dibersihkan — biasanya drive C: (sistem). Klik OK dan tunggu pemindaian selesai.$txt$, $txt$Pada jendela hasil, centang kategori file yang ingin dihapus. Yang aman untuk dicentang: Temporary Internet Files, Delivery Optimization Files, Recycle Bin, Temporary files, dan Thumbnails.$txt$, $txt$Klik "Clean up system files" untuk memindai ulang dengan hak administrator. Kini kategori tambahan muncul: centang "Windows Update Cleanup" (file pembaruan lama yang sudah tidak diperlukan) untuk hasil pembersihan terbesar.$txt$, $txt$Jangan centang "Downloads" kecuali Anda yakin isi folder Downloads sudah tidak diperlukan — mencentangnya akan menghapus SEMUA file di folder Downloads Anda.$txt$, $txt$Klik OK, lalu klik "Delete Files" untuk konfirmasi. Tunggu proses selesai; jangan matikan komputer saat proses berjalan.$txt$, $txt$Setelah selesai, periksa ruang kosong drive C: dengan membuka File Explorer > This PC. Ulangi proses ini tiap 1-2 bulan.$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Hal yang Harus Dihindari$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Risiko terbesar adalah mencentang kategori "Downloads" tanpa sadar, karena itu menghapus file pribadi Anda. Hindari juga mencentang kategori yang tidak Anda pahami maksudnya. Jangan menggunakan "cleaner" pihak ketiga yang menjanjikan pembersihan registry — utilitas semacam itu tidak membuat Windows lebih cepat dan berisiko merusak sistem. Jangan menghapus file langsung dari folder C:\Windows secara manual; selalu lewat Disk Cleanup agar hanya file aman yang dibuang.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Penyelesaian dan Tindak Lanjut$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Setelah pembersihan, komputer biasanya mendapat ruang bebas tambahan mulai dari ratusan MB hingga belasan GB, tergantung seberapa lama file sampah menumpuk. Agar kondisi ini bertahan: kosongkan Recycle Bin secara rutin, pindahkan file besar (video, installer) ke drive eksternal atau penyimpanan cloud, dan aktifkan Storage Sense di Settings > System > Storage agar Windows membersihkan file sementara secara otomatis. Jika drive tetap penuh setelah dibersihkan, pertimbangkan menambah SSD atau mengganti hard disk dengan kapasitas lebih besar.$$));
    END IF;
END $do$;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'TUT-KESEHATAN49-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Masalah yang Dipecahkan$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Sakit pinggang (low back pain) adalah keluhan yang sangat umum: rasa pegal, kaku, atau nyeri tumpul di area punggung bawah yang membuat sulit membungkuk, duduk lama, atau bangun dari tempat tidur. Penyebab paling umum adalah ketegangan otot akibat duduk terlalu lama dengan postur buruk, mengangkat beban berat dengan cara yang salah, atau kurang gerak. Kabar baiknya, sebagian besar sakit pinggang ringan-moderat membaik dengan perawatan mandiri dalam beberapa hari hingga minggu.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Penjelasan Singkat$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Otot dan ligamen di sekitar tulang belakang bawah bekerja keras menopang tubuh. Ketika tegang atau mengalami cedera ringan, area tersebut meradang dan nyeri. Peregangan ringan membantu mengendurkan otot yang kaku, melancarkan aliran darah, dan mengembalikan rentang gerak. Prinsipnya: gerakan lembut dan terkontrol, bukan paksaan. Rasa tarikan ringan saat meregang adalah normal; rasa nyeri tajam berarti Anda harus berhenti.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Persiapan Alat$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Siapkan matras atau alas yang nyaman di lantai, bantal kecil, dan kenakan pakaian longgar. Lakukan di ruangan yang cukup luas dan tidak licin. Minum air putih secukupnya. Tidak diperlukan alat olahraga khusus.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Langkah-Langkah Peregangan$$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Knee-to-chest: berbaring telentang, tekuk kedua lutut. Tarik satu lutut perlahan ke arah dada dengan kedua tangan, tahan 20-30 detik sambil bernapas normal. Ulangi 3 kali tiap kaki.$txt$, $txt$Pelvic tilt: tetap berbaring telentang dengan lutut ditekuk. Kencangkan otot perut sehingga punggung bawah menempel ke lantai, tahan 5 detik, lepaskan. Ulangi 10 kali.$txt$, $txt$Cat-cow: posisikan tubuh seperti merangkak (tangan di bawah bahu, lutut di bawah pinggul). Lengkungkan punggung ke atas seperti kucing (buang napas), lalu turunkan perlahan membentuk cekungan (tarik napas). Ulangi 10 kali dengan gerakan lambat.$txt$, $txt$Child's pose: dari posisi merangkak, dudukkan bokong ke tumit sambil merentangkan tangan ke depan di lantai. Tahan 30 detik. Gerakan ini meregangkan punggung bawah dengan lembut.$txt$, $txt$Piriformis stretch: berbaring telentang, silangkan pergelangan kaki kanan di atas lutut kiri. Tarik paha kiri ke arah dada hingga terasa regangan di bokong kanan. Tahan 20-30 detik, ganti sisi.$txt$, $txt$Jalan kaki ringan 10-15 menit setelah peregangan untuk melancarkan peredaran darah. Hindari duduk diam terlalu lama sesudahnya.$txt$, $txt$Lakukan rangkaian ini 1-2 kali sehari. Jika suatu gerakan menambah nyeri, lewati gerakan tersebut.$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Risiko dan Hal yang Harus Dihindari$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Hindari gerakan memutar pinggang secara paksa, membungkuk menyentuh jari kaki dengan kaki lurus saat nyeri akut, mengangkat beban berat, dan duduk membungkuk berjam-jam. Jangan memijat area yang nyeri dengan tekanan keras atau menggunakan obat oles/pereda nyeri terus-menerus tanpa berkonsultasi. Waspadai tanda bahaya yang mengharuskan segera ke dokter: nyeri setelah jatuh atau kecelakaan, nyeri menjalar ke kaki disertai kesemutan atau lemas, mati rasa di area selangkangan, sulit buang air kecil/besar, demam, atau nyeri yang tidak membaik setelah 2 minggu perawatan mandiri.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Penyelesaian dan Tindak Lanjut$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Artikel ini bersifat informasi umum dan bukan pengganti diagnosis dokter. Jika keluhan membaik, pertahankan kebiasaan baik: perbaiki postur duduk (kursi menopang punggung bawah), bangun dan bergerak tiap 30-60 menit, angkat beban dengan lutut ditekuk bukan punggung membungkuk, dan perkuat otot inti (core) dengan olahraga rutin seperti berenang atau jalan cepat. Jika nyeri berulang atau disertai tanda bahaya di atas, segera konsultasikan ke dokter atau fisioterapis untuk penanganan yang tepat.$$));
    END IF;
END $do$;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-ANTROPOLOGI26-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Siapa Suku Toraja$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Suku Toraja adalah masyarakat adat yang mendiami daerah pegunungan Tana Toraja dan Toraja Utara di Provinsi Sulawesi Selatan. Mereka dikenal dengan rumah adat tongkonan yang atapnya melengkung menyerupai perahu, ukiran kayu yang rumit, dan sistem kepercayaan adat Aluk Todolo yang mengatur seluruh aspek kehidupan — mulai dari kelahiran, perkawinan, hingga kematian. Meski mayoritas masyarakat Toraja kini memeluk agama Kristen atau Islam, adat istiadat warisan leluhur tetap dijaga dan dijalankan berdampingan dengan keyakinan agama.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Filosofi Hidup dan Mati$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Dalam pandangan adat Toraja, kehidupan manusia terbagi menjadi dua upacara besar: Rambu Tuka (upacara kehidupan — syukuran, pernikahan, panen) dan Rambu Solo (upacara kematian). Kematian tidak dipandang sebagai akhir yang menakutkan, melainkan perjalanan menuju Puya — alam keabadian tempat arwah berkumpul dengan para leluhur. Karena itu, mengantar jenazah dengan layak adalah kewajiban suci keluarga, bukan sekadar ritual duka.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Rangkaian Upacara Rambu Solo$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Rambu Solo adalah upacara pemakaman adat yang bisa berlangsung berhari-hari, bahkan berminggu-minggu untuk keluarga bangsawan. Jenazah disemayamkan di rumah tongkonan dalam peti, dan selama upacara belum dilaksanakan, orang yang meninggal dianggap "sakit" (belum benar-benar wafat). Puncak upacara diisi dengan penyembelihan kerbau dan babi — jumlah hewan kurban mencerminkan status sosial almarhum — disertai tarian, musik, dan jamuan bagi ratusan hingga ribuan tamu yang datang dari berbagai daerah.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Makam Tebing dan Tau-Tau$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$Salah satu ciri paling ikonik budaya Toraja adalah makam di tebing batu. Peti jenazah ditempatkan di ceruk tebing yang dipahat di dinding gunung kapur, misalnya di Londa dan Lemo. Di depan ceruk makam keluarga bangsawan dipasang tau-tau — patung kayu berukir yang menyerupai wajah almarhum, lengkap dengan pakaian adatnya. Tau-tau dipercaya menjaga dan mewakili kehadiran leluhur yang telah pergi.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Makna Sosial dan Ekonomi$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Rambu Solo bukan hanya urusan spiritual, tetapi juga peristiwa sosial-ekonomi besar. Keluarga besar bergotong-royong menanggung biaya upacara yang tidak sedikit, tamu membawa sumbangan sebagai bentuk solidaritas, dan seluruh kampung terlibat dalam persiapan. Tradisi ini mempererat ikatan kekerabatan lintas generasi — banyak perantau Toraja pulang kampung khusus untuk menghadiri Rambu Solo keluarganya, menjadikannya momen reuni akbar sekaligus pewarisan nilai adat kepada generasi muda.$$));
    END IF;
END $do$;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'EXP-KIMIA44-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Kalsium sebagai Unsur Kimia$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Kalsium (simbol Ca, nomor atom 20) adalah logam alkali tanah berwarna keperakan yang relatif lunak dan reaktif. Di alam, kalsium tidak pernah ditemukan dalam bentuk logam murni karena mudah bereaksi dengan udara dan air — ia selalu terikat dalam senyawa seperti kalsium karbonat (batu kapur, kapur tulis), kalsium sulfat (gipsum), dan kalsium fosfat. Senyawa-senyawa kalsium inilah yang menjadi bahan baku semen, kapur bangunan, dan pupuk pertanian.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Peran Kalsium dalam Tubuh$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Kalsium adalah mineral paling melimpah dalam tubuh manusia — sekitar 99 persennya tersimpan di tulang dan gigi dalam bentuk kalsium fosfat yang memberi kekerasan dan struktur. Satu persen sisanya beredar di darah dan jaringan, menjalankan fungsi yang tak kalah penting: membantu kontraksi otot (termasuk otot jantung), menghantarkan sinyal saraf, membantu pembekuan darah saat luka, dan menjaga irama jantung tetap stabil.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Sumber Kalsium dari Makanan$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Sumber kalsium terbaik dan termudah diserap tubuh adalah susu dan produk olahannya seperti keju dan yoghurt. Sumber nabati antara lain tahu dan tempe (terutama yang diolah dengan kalsium), sayuran hijau seperti bayam, kangkung, dan daun singkong, serta ikan teri dan ikan sarden yang dimakan beserta tulangnya. Vitamin D — yang didapat dari sinar matahari pagi dan makanan seperti telur serta ikan — membantu tubuh menyerap kalsium secara optimal.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Kekurangan dan Kelebihan Kalsium$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 7, jsonb_build_object('text', $$Kekurangan kalsium dalam jangka panjang membuat tulang keropos (osteoporosis), terutama pada lansia dan perempuan pascamenopause — tulang menjadi rapuh dan mudah patah. Pada anak, kekurangan kalsium dan vitamin D dapat menyebabkan rakhitis (tulang melengkung dan pertumbuhan terhambat). Sebaliknya, kelebihan kalsium dari suplemen dosis tinggi tanpa anjuran dokter dapat menyebabkan batu ginjal dan gangguan penyerapan mineral lain. Kebutuhan kalsium paling aman dipenuhi dari makanan sehari-hari yang seimbang.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Kalsium dalam Kehidupan Sehari-hari$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 9, jsonb_build_object('text', $$Di luar tubuh manusia, senyawa kalsium ada di mana-mana: kalsium karbonat adalah bahan utama semen dan kapur tulis; gipsum (kalsium sulfat) dipakai untuk plafon dan gips pembalut patah tulang; cangkang telur dan cangkang kerang pun tersusun dari kalsium karbonat. Dari gedung tempat kita tinggal hingga tulang yang menopang tubuh kita — kalsium adalah unsur yang diam-diam menopang banyak hal dalam kehidupan.$$));
    END IF;
END $do$;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SMP-MAT16-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan pengertian relasi dan fungsi; (2) menentukan domain, kodomain, dan range suatu fungsi; (3) menyatakan relasi dengan diagram panah, himpunan pasangan berurutan, dan grafik Cartesius; (4) menentukan nilai fungsi dengan notasi f(x); (5) menentukan apakah suatu relasi merupakan fungsi atau bukan.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Materi Pokok: Relasi dan Fungsi$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Relasi adalah hubungan yang memasangkan anggota himpunan A dengan anggota himpunan B. Fungsi (pemetaan) adalah relasi KHUSUS: setiap anggota himpunan A (domain) dipasangkan TEPAT SATU kali dengan anggota himpunan B (kodomain). Himpunan hasil pasangan di B disebut range (daerah hasil). Ciri fungsi: tidak boleh ada anggota domain yang tidak punya pasangan, dan tidak boleh ada anggota domain yang punya lebih dari satu pasangan. Fungsi biasa ditulis dengan notasi f: A -> B atau f(x) = 2x + 1, yang dibaca "fungsi f memetakan x ke 2x + 1". Relasi dapat dinyatakan dengan tiga cara: diagram panah, himpunan pasangan berurutan, dan grafik pada bidang Cartesius.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Contoh dan Pembahasan$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Contoh 1: Diketahui himpunan A = {1, 2, 3} dan B = {a, b}. Relasi R = {(1,a), (2,a), (3,b)}. Apakah R fungsi? Jawab: Ya, karena setiap anggota A (1, 2, 3) punya tepat satu pasangan di B. Domain = {1,2,3}, kodomain = {a,b}, range = {a,b}. Contoh 2: Relasi S = {(1,a), (1,b), (2,a)}. Apakah S fungsi? Jawab: Bukan, karena anggota 1 punya dua pasangan (a dan b). Contoh 3: Diketahui f(x) = 3x - 2. Tentukan f(4)! Jawab: f(4) = 3(4) - 2 = 12 - 2 = 10. Contoh 4: Jika f(x) = x^2 + 1 dan domainnya {0, 1, 2}, tentukan range-nya! Jawab: f(0)=1, f(1)=2, f(2)=5, jadi range = {1, 2, 5}.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Latihan Soal$$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Diketahui A = {2, 4, 6} dan B = {p, q}. Relasi R = {(2,p), (4,p), (6,q)}. Apakah R merupakan fungsi? Tentukan domain, kodomain, dan range-nya!$txt$, $txt$Relasi T = {(1,x), (2,y), (2,z)}. Apakah T merupakan fungsi? Jelaskan alasanmu!$txt$, $txt$Diketahui fungsi f(x) = 2x + 5. Tentukan nilai f(-3) dan f(0)!$txt$, $txt$Jika g(x) = x^2 - 4 dengan domain {-2, -1, 0, 1, 2}, tentukan range fungsi g!$txt$, $txt$Buatlah diagram panah dari fungsi h: P -> Q dengan P = {1, 2, 3}, Q = {2, 4, 6, 8}, dan aturan h(x) = 2x. Tuliskan juga himpunan pasangan berurutannya!$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Kunci Jawaban dan Pembahasan$$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Ya, fungsi. Domain = {2,4,6}, kodomain = {p,q}, range = {p,q}.$txt$, $txt$Bukan fungsi, karena anggota 2 memiliki dua pasangan (y dan z).$txt$, $txt$f(-3) = 2(-3)+5 = -1; f(0) = 2(0)+5 = 5.$txt$, $txt$g(-2)=0, g(-1)=-3, g(0)=-4, g(1)=-3, g(2)=0, jadi range = {-4, -3, 0}.$txt$, $txt$Pasangan berurutan: {(1,2), (2,4), (3,6)}. Diagram panah: 1->2, 2->4, 3->6.$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Rangkuman$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Relasi adalah pemasangan anggota dua himpunan, sedangkan fungsi adalah relasi khusus di mana setiap anggota domain punya tepat satu pasangan. Tiga unsur fungsi yang wajib dihafal: domain (daerah asal), kodomain (daerah kawan), dan range (daerah hasil). Cara cepat menguji fungsi: periksa apakah ada anggota domain yang kosong pasangannya atau punya pasangan ganda -- jika ada, itu bukan fungsi. Notasi f(x) dibaca sebagai nilai fungsi f untuk x, dan dihitung dengan mengganti setiap x pada rumus dengan bilangan yang diberikan.$$));
    END IF;
END $do$;

DO $do$
DECLARE v_id uuid;
BEGIN
    SELECT id INTO v_id FROM madevi.articles WHERE business_code = 'SCH-SD-IPS30-001';
    IF v_id IS NOT NULL THEN
        DELETE FROM madevi.article_blocks WHERE article_id = v_id;
        INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
        VALUES
    (gen_random_uuid(), v_id, 'HEADING', 0, jsonb_build_object('text', $$Tujuan Pembelajaran$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 1, jsonb_build_object('text', $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menyebutkan contoh pekerjaan yang ada di lingkungan sekitar; (2) membedakan pekerjaan yang menghasilkan barang dan pekerjaan yang menghasilkan jasa; (3) menjelaskan bahwa setiap pekerjaan penting dan saling membutuhkan; (4) menunjukkan sikap menghargai semua jenis pekerjaan yang halal dan bermanfaat.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 2, jsonb_build_object('text', $$Materi Pokok: Apa Itu Pekerjaan$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 3, jsonb_build_object('text', $$Pekerjaan adalah kegiatan yang dilakukan seseorang untuk mendapatkan penghasilan guna memenuhi kebutuhan hidup. Setiap orang tua kita bekerja: ada yang menjadi petani, pedagang, guru, dokter, sopir, penjahit, polisi, dan masih banyak lagi. Pekerjaan dibagi menjadi dua jenis besar. Pertama, pekerjaan yang menghasilkan BARANG — benda yang bisa dilihat dan dipegang, misalnya petani menghasilkan padi, penjahit menghasilkan baju, dan tukang roti menghasilkan roti. Kedua, pekerjaan yang menghasilkan JASA — layanan atau bantuan, misalnya guru mengajar, dokter mengobati orang sakit, dan sopir mengantar penumpang.$$)),
    (gen_random_uuid(), v_id, 'HEADING', 4, jsonb_build_object('text', $$Contoh Pekerjaan di Sekitar Kita$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 5, jsonb_build_object('text', $$Mari perhatikan lingkungan sekitar. Di pasar ada pedagang yang menjual sayur dan buah (barang) — mereka membeli dari petani di desa. Di sekolah ada guru (jasa mengajar) dan penjaga sekolah (jasa keamanan dan kebersihan). Di jalan ada sopir angkot dan ojek (jasa antar), polisi lalu lintas (jasa mengatur jalan). Di rumah sakit ada dokter dan perawat (jasa kesehatan). Di kantor pos ada pak pos (jasa antar surat). Semua pekerjaan ini saling berkaitan: petani butuh sopir untuk mengangkut hasil panen, pedagang butuh pembeli, dan kita semua butuh guru untuk belajar!$$)),
    (gen_random_uuid(), v_id, 'HEADING', 6, jsonb_build_object('text', $$Latihan Soal$$)),
    (gen_random_uuid(), v_id, 'LIST', 7, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Sebutkan 5 contoh pekerjaan yang ada di lingkungan tempat tinggalmu!$txt$, $txt$Kelompokkan pekerjaan berikut menjadi penghasil barang atau penghasil jasa: petani, dokter, penjahit, guru, nelayan, sopir.$txt$, $txt$Pak Budi membuat meja dan kursi dari kayu lalu menjualnya. Apakah pekerjaan Pak Budi menghasilkan barang atau jasa? Jelaskan!$txt$, $txt$Mengapa kita harus menghargai pekerjaan petugas kebersihan? Tuliskan pendapatmu!$txt$, $txt$Sebutkan pekerjaan cita-citamu dan jelaskan apakah pekerjaan itu menghasilkan barang atau jasa!$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 8, jsonb_build_object('text', $$Kunci Jawaban$$)),
    (gen_random_uuid(), v_id, 'LIST', 9, jsonb_build_object('items', to_jsonb(ARRAY[$txt$Jawaban beragam sesuai lingkungan siswa, contoh: petani, pedagang, guru, bidan/perawat, tukang ojek, penjahit.$txt$, $txt$Penghasil barang: petani, penjahit, nelayan. Penghasil jasa: dokter, guru, sopir.$txt$, $txt$Menghasilkan barang, karena meja dan kursi adalah benda yang bisa dilihat dan dipegang.$txt$, $txt$Karena tanpa petugas kebersihan lingkungan menjadi kotor dan sumber penyakit; setiap pekerjaan yang halal itu mulia dan bermanfaat.$txt$, $txt$Jawaban beragam; yang penting siswa dapat menjelaskan dengan benar apakah cita-citanya menghasilkan barang atau jasa.$txt$]))),
    (gen_random_uuid(), v_id, 'HEADING', 10, jsonb_build_object('text', $$Rangkuman$$)),
    (gen_random_uuid(), v_id, 'PARAGRAPH', 11, jsonb_build_object('text', $$Pekerjaan adalah kegiatan untuk memenuhi kebutuhan hidup. Ada pekerjaan yang menghasilkan barang (petani, penjahit, tukang roti) dan ada yang menghasilkan jasa (guru, dokter, sopir). Semua pekerjaan saling membutuhkan dan sama-sama penting — tidak ada pekerjaan halal yang hina. Sikap yang benar adalah menghargai setiap pekerja, misalnya dengan berterima kasih kepada petugas kebersihan, mendengarkan guru dengan baik, dan tidak meremehkan pekerjaan orang lain.$$));
    END IF;
END $do$;

COMMIT;
