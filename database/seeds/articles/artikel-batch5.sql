-- Artikel Batch 5 — 2026-10-13
-- 4 artikel baru: Tutorial Keuangan, Explore Astronomi, Explore Teknologi, School Fisika SMA

\set ON_ERROR_STOP on
BEGIN;

-- ================= ARTIKEL 1: TUT-KEUANGAN-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'TUT-KEUANGAN-001',
    'b8888888-8888-8888-8888-888888888888',
    'Cara Mengatur Uang Jajan/Bulanan untuk Pemula',
    'cara-mengatur-uang-jajan-bulanan-pemula',
    'Panduan mengatur uang jajan atau gaji bulanan untuk pemula: budgeting 50/30/20, dana darurat, dan cara menghindari utang konsumtif.',
    'id', 7, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Masalah: Uang Selalu Habis Sebelum Akhir Bulan$$),
  ('PARAGRAPH','text',2, $$Gaji atau uang jajan masuk di awal bulan, tapi minggu ketiga dompet sudah kosong. Pengeluaran kecil-kecil — jajan, kopi, langganan, ongkir — ternyata menumpuk jadi besar. Akhirnya gali lubang tutup lubang: pinjam ke teman, pakai paylater, atau gesek kartu kredit untuk kebutuhan sehari-hari.$$),
  ('HEADING','text',3, $$Penjelasan: Kenapa Uang Bocor$$),
  ('PARAGRAPH','text',4, $$Masalahnya jarang soal jumlah uang, melainkan soal tidak ada rencana. Otak manusia buruk memperkirakan total pengeluaran kecil yang berulang. Tanpa anggaran tertulis, setiap keputusan belanja terasa "kecil" padahal akumulasinya besar. Utang konsumtif memperparah: bunga paylater/kartu kredit 2-4% per bulan bisa membuat utang Rp1 juta membengkak jauh dalam setahun.$$),
  ('HEADING','text',5, $$Alat yang Dibutuhkan$$),
  ('LIST','list',6, $$Catatan atau aplikasi pencatat (bisa buku tulis, spreadsheet, atau aplikasi gratis)
Kalkulator
Rekening/tabungan terpisah untuk dana darurat$$),
  ('HEADING','text',7, $$Langkah: Metode 50/30/20$$),
  ('LIST','list',8, $$1. Catat SEMUA pengeluaran selama 7 hari — jangan ubah kebiasaan dulu, catat saja.
2. Kelompokkan: Kebutuhan (50%) = makan, transport, kos, pulsa. Keinginan (30%) = nongkrong, hiburan, belanja. Tabungan (20%) = dana darurat + investasi.
3. Contoh gaji Rp3 juta: Kebutuhan Rp1,5 jt | Keinginan Rp900 rb | Tabungan Rp600 rb.
4. Bayar tabungan DULUAN saat uang masuk (auto-debit ke rekening terpisah), bukan dari sisa.
5. Untuk Keinginan, pakai amplop digital: begitu jatah 30% habis, berhenti — tanpa kecuali.
6. Evaluasi tiap akhir bulan: kategori mana yang jebol, sesuaikan bulan depan.$$),
  ('HEADING','text',9, $$Risiko$$),
  ('PARAGRAPH','text',10, $$Jangan pakai paylater/kartu kredit untuk menutup kekurangan bulanan — itu bukan solusi, itu jebakan bunga berbunga. Waspadai juga "gaya hidup naik mengikuti gaji": tiap kali penghasilan naik, tahan keinginan menaikkan standar belanja selama 3 bulan pertama. Hindari investasi/judi online berkedok "cepat kaya"; pemula cukup fokus ke dana darurat dulu.$$),
  ('HEADING','text',11, $$Penyelesaian$$),
  ('PARAGRAPH','text',12, $$Target 3 bulan pertama: punya dana darurat 1x pengeluaran bulanan di rekening terpisah. Target 1 tahun: 3-6x pengeluaran bulanan. Setelah dana darurat aman, 20% tabungan bisa dibagi: separuh tetap ditabung, separuh mulai belajar investasi reksa dana pasar uang. Kunci keberhasilan bukan nominalnya, tapi konsistensinya — Rp100 ribu per bulan yang rutin jauh lebih baik daripada Rp1 juta sekali lalu berhenti.$$)
) AS b(block_type, kind, position, body)
ON CONFLICT DO NOTHING;

-- ================= ARTIKEL 2: EXP-ASTRONOMI-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'EXP-ASTRONOMI-001',
    'c6666666-6666-6666-6666-666666666666',
    'Tata Surya: Tetangga Kosmik Kita',
    'tata-surya-tetangga-kosmik-kita',
    'Jelajah tata surya: Matahari, 8 planet, sabuk asteroid, dan komet — struktur, ciri khas, dan fakta menariknya.',
    'id', 6, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position, jsonb_build_object('text', b.body)
FROM art, (VALUES
  ('HEADING',1, $$Tata Surya: Rumah Kita di Alam Semesta$$),
  ('PARAGRAPH',2, $$Tata surya adalah sistem bintang yang terdiri dari satu bintang — Matahari — dan semua benda langit yang terikat gravitasinya: 8 planet, 5 planet katai, ratusan bulan, jutaan asteroid, dan komet. Usianya sekitar 4,6 miliar tahun, terbentuk dari runtuhnya awan gas dan debu raksasa.$$),
  ('HEADING',3, $$Matahari: Jantung Tata Surya$$),
  ('PARAGRAPH',4, $$Matahari adalah bintang katai kuning yang menyimpan 99,86% seluruh massa tata surya. Di intinya, suhu 15 juta °C memicu fusi nuklir: hidrogen berubah menjadi helium dan melepaskan energi raksasa. Setiap detik, Matahari mengubah 600 juta ton hidrogen menjadi energi. Cahayanya butuh 8 menit 20 detik untuk sampai ke Bumi.$$),
  ('HEADING',5, $$8 Planet: Dari Merkurius hingga Neptunus$$),
  ('PARAGRAPH',6, $$Planet dalam (terestrial, berbatu): Merkurius (terkecil, terpanas-terdingin ekstrem), Venus (terpanas, 465 °C, efek rumah kaca tak terkendali), Bumi (satu-satunya dengan kehidupan), Mars (planet merah, punya gunung tertinggi Olympus Mons, 22 km). Planet luar (raksasa gas/es): Jupiter (terbesar, 1.300x volume Bumi, Bintik Merah badai raksasa), Saturnus (cincin es spektakuler), Uranus (berputar miring 98°), Neptunus (terjauh, angin tercepat 2.100 km/jam).$$),
  ('HEADING',7, $$Sabuk Asteroid dan Planet Katai$$),
  ('PARAGRAPH',8, $$Di antara Mars dan Jupiter ada sabuk asteroid: jutaan batuan sisa pembentukan planet. Ceres — benda terbesar di sabuk — kini digolongkan planet katai bersama Pluto, Haumea, Makemake, dan Eris. Pluto "diturunkan" jadi planet katai pada 2006 karena tidak membersihkan orbitnya dari benda lain.$$),
  ('HEADING',9, $$Komet: Bola Salju Kotor$$),
  ('PARAGRAPH',10, $$Komet adalah bongkahan es, debu, dan batuan dari pinggiran tata surya (Sabuk Kuiper dan Awan Oort). Saat mendekati Matahari, esnya menguap membentuk koma dan ekor bercahaya yang bisa jutaan kilometer panjangnya. Komet Halley yang terkenal muncul tiap 76 tahun — terakhir 1986, berikutnya 2061.$$)
) AS b(block_type, position, body)
ON CONFLICT DO NOTHING;

-- ================= ARTIKEL 3: EXP-TEKNOLOGI-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'EXP-TEKNOLOGI-001',
    'c7777777-7777-7777-7777-777777777777',
    'Cara Kerja Internet: Dari Kabel hingga Cloud',
    'cara-kerja-internet-kabel-hingga-cloud',
    'Memahami cara kerja internet: paket data, alamat IP, DNS, server, dan cloud — dari klik hingga halaman tampil.',
    'id', 6, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position, jsonb_build_object('text', b.body)
FROM art, (VALUES
  ('HEADING',1, $$Internet Bukan Awan Ajaib: Ia Infrastruktur Fisik$$),
  ('PARAGRAPH',2, $$Internet adalah jaringan raksasa komputer yang saling terhubung lewat kabel serat optik bawah laut, menara seluler, dan satelit. Ketika kamu membuka sebuah situs, datanya menempuh ribuan kilometer dalam sepersekian detik. Semua keajaiban itu berdiri di atas empat konsep: paket data, alamat IP, DNS, dan server.$$),
  ('HEADING',3, $$Paket Data: Kurir Digital$$),
  ('PARAGRAPH',4, $$Data tidak dikirim utuh, melainkan dipotong jadi paket-paket kecil (biasanya ~1.500 byte). Setiap paket punya "amplop" berisi alamat pengirim, alamat tujuan, dan nomor urut. Paket-paket ini bisa menempuh rute berbeda-beda, lalu disusun ulang di tujuan. Kalau satu paket hilang, pengirim mengirim ulang hanya paket itu — efisien. Inilah protokol TCP/IP, fondasi internet sejak 1983.$$),
  ('HEADING',5, $$Alamat IP: Nomor Rumah Setiap Perangkat$$),
  ('PARAGRAPH',6, $$Setiap perangkat di internet punya alamat IP, misalnya 142.250.190.14 (IPv4) atau deretan lebih panjang di IPv6. IPv4 hanya menyediakan ~4,3 miliar alamat — sudah habis — sehingga IPv6 dengan 340 desiliun alamat menjadi penerusnya. Router memakai alamat IP untuk meneruskan paket ke tujuan yang benar, seperti kantor pos membaca alamat surat.$$),
  ('HEADING',7, $$DNS: Buku Telepon Internet$$),
  ('PARAGRAPH',8, $$Manusia mengingat "google.com", komputer butuh angka IP. DNS (Domain Name System) menerjemahkan nama domain menjadi alamat IP dalam milidetik. Prosesnya berlapis: resolver ISP bertanya ke root server, lalu server TLD (.com, .id), lalu server otoritatif domain itu. Hasilnya disimpan sementara (cache) agar kunjungan berikutnya lebih cepat.$$),
  ('HEADING',9, $$Server dan Cloud: Dapur Tempat Data Dimasak$$),
  ('PARAGRAPH',10, $$Server adalah komputer khusus yang siaga 24 jam melayani permintaan: menyimpan file situs, menjalankan aplikasi, mengelola database. "Cloud" hanyalah server milik orang lain yang disewakan — data fotomu di Google Photos tersimpan di data center raksasa berpendingin masif di berbagai negara. CDN (Content Delivery Network) menyalin konten ke server di banyak kota agar pengguna Jakarta tidak perlu mengambil data dari Amerika — inilah kenapa situs besar terasa cepat.$$)
) AS b(block_type, position, body)
ON CONFLICT DO NOTHING;

-- ================= ARTIKEL 4: SCH-SMA-001 =================
WITH art AS (
  INSERT INTO madevi.articles (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, status, created_by, updated_by)
  VALUES (
    gen_random_uuid(),
    'SCH-SMA-001',
    'd5555555-5555-5555-5555-555555555555',
    'Fisika Kelas 10: Gerak Lurus Beraturan dan Berubah Beraturan',
    'fisika-kelas-10-gerak-lurus-beraturan-berubah',
    'Materi fisika kelas 10: GLB dan GLBB — pengertian, rumus, grafik, contoh soal langkah demi langkah, latihan, dan kunci jawaban.',
    'id', 9, 'DRAFT',
    'f7125028-187e-44e0-b95b-88b69b8d5c9a', 'f7125028-187e-44e0-b95b-88b69b8d5c9a'
  )
  ON CONFLICT (business_code) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
)
INSERT INTO madevi.article_blocks (id, article_id, block_type, position, content)
SELECT gen_random_uuid(), art.id, b.block_type, b.position,
  CASE WHEN b.kind = 'text' THEN jsonb_build_object('text', b.body)
       ELSE jsonb_build_object('items', string_to_array(b.body, E'\n'))
  END
FROM art, (VALUES
  ('HEADING','text',1, $$Tujuan Pembelajaran$$),
  ('PARAGRAPH','text',2, $$Setelah mempelajari materi ini, siswa diharapkan mampu: (1) menjelaskan perbedaan GLB dan GLBB; (2) menggunakan rumus GLB (s = v × t) dan GLBB (vt = v0 + a·t; s = v0·t + ½a·t²; vt² = v0² + 2a·s); (3) membaca grafik v-t dan s-t; (4) menyelesaikan soal gerak lurus dalam kehidupan sehari-hari.$$),
  ('HEADING','text',3, $$GLB: Gerak Lurus Beraturan$$),
  ('PARAGRAPH','text',4, $$GLB adalah gerak benda pada lintasan lurus dengan kecepatan TETAP (percepatan nol). Cirinya: jarak tempuh berbanding lurus dengan waktu. Rumus: s = v × t, dengan s = jarak (m), v = kecepatan (m/s), t = waktu (s). Grafik s-t berupa garis lurus miring; grafik v-t berupa garis horizontal.$$),
  ('HEADING','text',5, $$GLBB: Gerak Lurus Berubah Beraturan$$),
  ('PARAGRAPH','text',6, $$GLBB adalah gerak lurus dengan percepatan TETAP (bisa dipercepat atau diperlambat). Tiga rumus utama: (1) vt = v0 + a·t — kecepatan akhir; (2) s = v0·t + ½·a·t² — jarak tempuh; (3) vt² = v0² + 2·a·s — tanpa variabel waktu. Contoh: mobil direm (a negatif), buah jatuh bebas (a = g = 10 m/s²).$$),
  ('HEADING','text',7, $$Contoh Soal 1 (GLB)$$),
  ('PARAGRAPH','text',8, $$Sepeda motor melaju dengan kecepatan tetap 20 m/s. Berapa jarak yang ditempuh dalam 15 detik? Penyelesaian: s = v × t = 20 × 15 = 300 meter. Jadi motor menempuh 300 m.$$),
  ('HEADING','text',9, $$Contoh Soal 2 (GLBB)$$),
  ('PARAGRAPH','text',10, $$Mobil mula-mula diam, lalu dipercepat beraturan 2 m/s² selama 10 detik. Berapa kecepatan akhir dan jarak tempuhnya? Penyelesaian: vt = v0 + a·t = 0 + 2×10 = 20 m/s. s = v0·t + ½·a·t² = 0 + ½×2×100 = 100 meter. Jadi kecepatan akhir 20 m/s dan jarak 100 m.$$),
  ('HEADING','text',11, $$Latihan Soal$$),
  ('LIST','list',12, $$1. Sebuah bus bergerak dengan kecepatan 72 km/jam. Ubah ke m/s, lalu hitung jarak tempuh dalam 5 menit (GLB).
2. Bola dijatuhkan dari ketinggian 45 m (g = 10 m/s², v0 = 0). Berapa waktu yang dibutuhkan hingga menyentuh tanah? (GLBB, gunakan s = ½·g·t²)
3. Kereta diperlambat beraturan dari 30 m/s hingga berhenti dalam 15 detik. Hitung perlambatannya dan jarak pengereman.$$),
  ('HEADING','text',13, $$Kunci Jawaban$$),
  ('LIST','list',14, $$1. 72 km/jam = 20 m/s. t = 5 menit = 300 s. s = 20 × 300 = 6.000 m = 6 km.
2. 45 = ½ × 10 × t² → t² = 9 → t = 3 detik.
3. a = (0 − 30)/15 = −2 m/s² (perlambatan 2 m/s²). s = v0·t + ½·a·t² = 30×15 + ½×(−2)×225 = 450 − 225 = 225 meter.$$)
) AS b(block_type, kind, position, body)
ON CONFLICT DO NOTHING;

COMMIT;
