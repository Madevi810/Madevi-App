/**
 * Data Madevi School (Fase 4).
 * 8 program × 8 bab, tiap bab: materi + latihan soal.
 * Format: jenjang → kelas → bab → materi → latihan.
 */
import type { Bab, Materi, Soal } from '@/services/school';

export interface BabLengkap extends Bab {
  jenjang: string;
  kelas: string;
  materi: Materi[];
  latihan: Soal[];
}

export const SCHOOL_BAB: BabLengkap[] = [
  // ===== SD KELAS 4 (8 bab) =====
  {
    id: 'sd4-pecahan', judul: 'Pecahan Sederhana', deskripsi: 'Mengenal pecahan, membaca dan menulis pecahan, membandingkan pecahan.', urutan: 1,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pecahan-m1', babId: 'sd4-pecahan', judul: 'Apa itu Pecahan?', konten: 'Pecahan adalah bagian dari keseluruhan. Contoh: 1/2 artinya satu dari dua bagian sama besar. Pembilang (atas) = bagian yang diambil. Penyebut (bawah) = total bagian.', urutan: 1, estimasiMenit: 10 },
      { id: 'sd4-pecahan-m2', babId: 'sd4-pecahan', judul: 'Membandingkan Pecahan', konten: 'Jika penyebut sama, pembilang besar = pecahan besar. Contoh: 3/4 > 2/4. Jika pembilang sama, penyebut kecil = pecahan besar. Contoh: 1/2 > 1/4.', urutan: 2, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-pecahan-s1', tipe: 'pilihan_ganda', pertanyaan: 'Manakah yang lebih besar: 3/5 atau 2/5?', opsi: ['3/5', '2/5', 'Sama besar'], kunciJawaban: '3/5', pembahasan: 'Penyebut sama, pembilang 3 > 2.', bobot: 10 },
      { id: 'sd4-pecahan-s2', tipe: 'pilihan_ganda', pertanyaan: '1/2 dibanding 1/4, mana lebih besar?', opsi: ['1/2', '1/4', 'Sama'], kunciJawaban: '1/2', pembahasan: 'Pembilang sama, penyebut kecil = lebih besar.', bobot: 10 },
      { id: 'sd4-pecahan-s3', tipe: 'isian', pertanyaan: 'Tulis pecahan: tiga per empat = ...', kunciJawaban: '3/4', pembahasan: 'Pembilang 3, penyebut 4.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-perkalian', judul: 'Perkalian Bilangan Cacah', deskripsi: 'Perkalian sampai 100 dan soal cerita.', urutan: 2,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-perkalian-m1', babId: 'sd4-perkalian', judul: 'Konsep Perkalian', konten: 'Perkalian = penjumlahan berulang. 3 × 4 = 4 + 4 + 4 = 12. Sifat komutatif: 3 × 4 = 4 × 3.', urutan: 1, estimasiMenit: 10 },
      { id: 'sd4-perkalian-m2', babId: 'sd4-perkalian', judul: 'Perkalian Bersusun', konten: 'Contoh: 23 × 4. Kalikan satuan dulu: 3×4=12 (tulis 2, simpan 1). Lalu puluhan: 2×4=8, tambah 1 = 9. Hasil: 92.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-perkalian-s1', tipe: 'pilihan_ganda', pertanyaan: '7 × 8 = ?', opsi: ['54', '56', '63'], kunciJawaban: '56', pembahasan: '7×8=56.', bobot: 10 },
      { id: 'sd4-perkalian-s2', tipe: 'isian', pertanyaan: '12 × 5 = ...', kunciJawaban: '60', pembahasan: '10×5=50, 2×5=10, total 60.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bindo-karangan', judul: 'Menulis Karangan Narasi', deskripsi: 'Menyusun karangan dengan urutan peristiwa jelas.', urutan: 3,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-bindo-m1', babId: 'sd4-bindo-karangan', judul: 'Struktur Karangan', konten: 'Karangan narasi: pembuka (perkenalan), isi (rangkaian peristiwa), penutup (kesan/pesan). Gunakan kata penghubung: lalu, kemudian, setelah itu.', urutan: 1, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-bindo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian pembuka karangan berisi...', opsi: ['Perkenalan', 'Klimaks', 'Kesimpulan'], kunciJawaban: 'Perkenalan', pembahasan: 'Pembuka memperkenalkan tokoh/latar.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ipa-gaya', judul: 'Gaya dan Gerak', deskripsi: 'Macam-macam gaya dan pengaruhnya pada benda.', urutan: 4,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-ipa-m1', babId: 'sd4-ipa-gaya', judul: 'Macam-macam Gaya', konten: 'Gaya otot, gaya magnet, gaya gravitasi, gaya gesek. Gaya dapat mengubah bentuk, arah, dan kecepatan benda.', urutan: 1, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-ipa-s1', tipe: 'pilihan_ganda', pertanyaan: 'Buah jatuh dari pohon karena gaya...', opsi: ['Magnet', 'Gravitasi', 'Otot'], kunciJawaban: 'Gravitasi', pembahasan: 'Gravitasi menarik benda ke bumi.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-peta', judul: 'Membaca Peta', deskripsi: 'Unsur peta: judul, legenda, skala, mata angin.', urutan: 5,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-ips-m1', babId: 'sd4-ips-peta', judul: 'Unsur-unsur Peta', konten: 'Judul, legenda (keterangan simbol), skala (perbandingan), mata angin (8 arah), simbol.', urutan: 1, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-ips-s1', tipe: 'pilihan_ganda', pertanyaan: 'Legenda pada peta berfungsi untuk...', opsi: ['Menunjukkan arah', 'Menjelaskan simbol', 'Mengukur jarak'], kunciJawaban: 'Menjelaskan simbol', pembahasan: 'Legenda = keterangan simbol.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ppkn-pancasila', judul: 'Pancasila sebagai Dasar Negara', deskripsi: 'Lima sila dan contoh pengamalan.', urutan: 6,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-ppkn-m1', babId: 'sd4-ppkn-pancasila', judul: 'Lima Sila', konten: '1. Ketuhanan YME 2. Kemanusiaan yang adil dan beradab 3. Persatuan Indonesia 4. Kerakyatan... 5. Keadilan sosial...', urutan: 1, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-ppkn-s1', tipe: 'pilihan_ganda', pertanyaan: 'Gotong royong mencerminkan sila ke...', opsi: ['1', '3', '5'], kunciJawaban: '3', pembahasan: 'Gotong royong = persatuan.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-sbdp-menggambar', judul: 'Menggambar Ilustrasi', deskripsi: 'Teknik dasar menggambar ilustrasi cerita.', urutan: 7,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-sbdp-m1', babId: 'sd4-sbdp-menggambar', judul: 'Langkah Menggambar Ilustrasi', konten: 'Tentukan tema → buat sketsa → beri warna → tambah detail. Perhatikan proporsi dan komposisi.', urutan: 1, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-sbdp-s1', tipe: 'benar_salah', pertanyaan: 'Sketsa dibuat dengan garis tegas langsung.', kunciJawaban: 'Salah', pembahasan: 'Sketsa = garis tipis dulu.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-pjok-gerak', judul: 'Gerak Dasar Lokomotor', deskripsi: 'Berjalan, berlari, melompat dengan teknik benar.', urutan: 8,
    jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pjok-m1', babId: 'sd4-pjok-gerak', judul: 'Macam Gerak Lokomotor', konten: 'Berjalan, berlari, melompat, meloncat. Lakukan pemanasan sebelum berolahraga.', urutan: 1, estimasiMenit: 10 },
    ],
    latihan: [
      { id: 'sd4-pjok-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sebelum olahraga sebaiknya...', opsi: ['Langsung lari', 'Pemanasan', 'Duduk'], kunciJawaban: 'Pemanasan', pembahasan: 'Pemanasan mencegah cedera.', bobot: 10 },
    ],
  },
];

export function babById(id: string): BabLengkap | undefined {
  return SCHOOL_BAB.find((b) => b.id === id);
}

export function babByJenjangKelas(jenjang: string, kelas: string): BabLengkap[] {
  return SCHOOL_BAB.filter((b) => b.jenjang === jenjang && b.kelas === kelas)
    .sort((a, b) => a.urutan - b.urutan);
}

export const SCHOOL_BAB_2: BabLengkap[] = [
  // ===== SMP KELAS 8 (8 bab) =====
  {
    id: 'smp8-aljabar', judul: 'Aljabar: Bentuk dan Operasi', deskripsi: 'Suku, koefisien, operasi tambah kurang kali bagi bentuk aljabar.', urutan: 1, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-aljabar-m1', babId: 'smp8-aljabar', judul: 'Unsur Bentuk Aljabar', konten: 'Variabel (x, y), koefisien (angka di depan variabel), konstanta (tanpa variabel). Contoh: 3x + 5 → koefisien 3, konstanta 5.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'smp8-aljabar-s1', tipe: 'pilihan_ganda', pertanyaan: 'Koefisien dari 7x - 2 adalah...', opsi: ['7', '-2', 'x'], kunciJawaban: '7', pembahasan: 'Koefisien = angka di depan variabel.', bobot: 10 }],
  },
  {
    id: 'smp8-spldv', judul: 'SPLDV', deskripsi: 'Sistem persamaan linear dua variabel: metode eliminasi, substitusi.', urutan: 2, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-spldv-m1', babId: 'smp8-spldv', judul: 'Metode Eliminasi', konten: 'Samakan koefisien salah satu variabel, lalu jumlah/kurangkan. Contoh: x+y=10, x-y=2 → jumlahkan: 2x=12 → x=6, y=4.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smp8-spldv-s1', tipe: 'isian', pertanyaan: 'x + y = 7, x - y = 1. Nilai x = ...', kunciJawaban: '4', pembahasan: 'Jumlahkan: 2x=8 → x=4.', bobot: 10 }],
  },
  {
    id: 'smp8-teks-eksposisi', judul: 'Teks Eksposisi', deskripsi: 'Struktur dan kaidah teks eksposisi.', urutan: 3, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-eksposisi-m1', babId: 'smp8-teks-eksposisi', judul: 'Struktur Eksposisi', konten: 'Tesis (pendapat) → argumen (bukti) → penegasan ulang. Bahasa baku, fakta, tidak memihak.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smp8-eksposisi-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian pembuka teks eksposisi disebut...', opsi: ['Tesis', 'Koda', 'Resolusi'], kunciJawaban: 'Tesis', pembahasan: 'Tesis = pernyataan pendapat.', bobot: 10 }],
  },
  {
    id: 'smp8-gaya-newton', judul: 'Hukum Newton', deskripsi: 'Tiga hukum Newton dan penerapannya.', urutan: 4, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-newton-m1', babId: 'smp8-gaya-newton', judul: 'Tiga Hukum Newton', konten: 'Hukum I: kelembaman. Hukum II: F = m × a. Hukum III: aksi = reaksi.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'smp8-newton-s1', tipe: 'pilihan_ganda', pertanyaan: 'Rumus hukum II Newton...', opsi: ['F = m/a', 'F = m × a', 'F = m + a'], kunciJawaban: 'F = m × a', pembahasan: 'Gaya = massa × percepatan.', bobot: 10 }],
  },
  {
    id: 'smp8-asean', judul: 'ASEAN', deskripsi: 'Sejarah, tujuan, dan peran Indonesia di ASEAN.', urutan: 5, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-asean-m1', babId: 'smp8-asean', judul: 'Latar Berdirinya ASEAN', konten: 'Deklarasi Bangkok 8 Agustus 1967 oleh 5 negara: Indonesia, Malaysia, Singapura, Thailand, Filipina.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smp8-asean-s1', tipe: 'pilihan_ganda', pertanyaan: 'ASEAN didirikan tahun...', opsi: ['1945', '1967', '1998'], kunciJawaban: '1967', pembahasan: 'Deklarasi Bangkok 1967.', bobot: 10 }],
  },
  {
    id: 'smp8-salat-jamaah', judul: 'Salat Berjamaah', deskripsi: 'Hukum, syarat, dan tata cara salat berjamaah.', urutan: 6, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-jamaah-m1', babId: 'smp8-salat-jamaah', judul: 'Keutamaan Berjamaah', konten: 'Pahala 27 derajat dibanding sendirian. Syarat: imam dan makmum, niat mengikuti imam.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smp8-jamaah-s1', tipe: 'benar_salah', pertanyaan: 'Salat berjamaah pahalanya 27 kali lipat.', kunciJawaban: 'Benar', pembahasan: 'Hadis riwayat Bukhari Muslim.', bobot: 10 }],
  },
  {
    id: 'smp8-senam', judul: 'Senam Lantai', deskripsi: 'Gerakan dasar: guling depan, guling belakang.', urutan: 7, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-senam-m1', babId: 'smp8-senam', judul: 'Guling Depan', konten: 'Jongkok → tangan di matras → dagu ke dada → guling → berdiri. Gunakan matras.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smp8-senam-s1', tipe: 'benar_salah', pertanyaan: 'Guling depan diawali sikap jongkok.', kunciJawaban: 'Benar', pembahasan: 'Ya, dari jongkok.', bobot: 10 }],
  },
  {
    id: 'smp8-gambar-poster', judul: 'Menggambar Poster', deskripsi: 'Prinsip desain poster yang komunikatif.', urutan: 8, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [{ id: 'smp8-poster-m1', babId: 'smp8-gambar-poster', judul: 'Unsur Poster', konten: 'Judul menarik, gambar dominan, teks singkat, warna kontras. Pesan harus jelas dalam 3 detik.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smp8-poster-s1', tipe: 'pilihan_ganda', pertanyaan: 'Ciri poster yang baik...', opsi: ['Teks panjang', 'Pesan jelas & singkat', 'Warna pucat semua'], kunciJawaban: 'Pesan jelas & singkat', pembahasan: 'Poster komunikatif.', bobot: 10 }],
  },

  // ===== SMA KELAS 11 (8 bab) =====
  {
    id: 'sma11-fungsi-komposisi', judul: 'Fungsi Komposisi', deskripsi: 'Operasi dan invers fungsi komposisi.', urutan: 1, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-fk-m1', babId: 'sma11-fungsi-komposisi', judul: 'Definisi Komposisi', konten: '(f∘g)(x) = f(g(x)). Kerjakan dari dalam ke luar. Contoh: f(x)=2x, g(x)=x+1 → (f∘g)(x)=2(x+1)=2x+2.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'sma11-fk-s1', tipe: 'isian', pertanyaan: 'f(x)=x+2, g(x)=3x. (f∘g)(2) = ...', kunciJawaban: '8', pembahasan: 'g(2)=6, f(6)=8.', bobot: 10 }],
  },
  {
    id: 'sma11-limit', judul: 'Limit Fungsi', deskripsi: 'Konsep limit dan teknik menyelesaikannya.', urutan: 2, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-limit-m1', babId: 'sma11-limit', judul: 'Konsep Limit', konten: 'Limit = nilai pendekatan. lim(x→2) (x+3) = 5. Untuk bentuk 0/0: faktorkan atau kali sekawan.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'sma11-limit-s1', tipe: 'isian', pertanyaan: 'lim(x→3) (2x - 1) = ...', kunciJawaban: '5', pembahasan: 'Substitusi langsung: 6-1=5.', bobot: 10 }],
  },
  {
    id: 'sma11-teks-prosedur', judul: 'Teks Prosedur Kompleks', deskripsi: 'Struktur teks prosedur dan konjungsi temporal.', urutan: 3, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-prosedur-m1', babId: 'sma11-teks-prosedur', judul: 'Struktur Prosedur', konten: 'Tujuan → bahan/alat → langkah-langkah → penegasan ulang. Ciri: kalimat imperatif, konjungsi temporal (kemudian, setelah itu).', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'sma11-prosedur-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kalimat imperatif contohnya...', opsi: ['Ambil gelas itu.', 'Gelas itu diambil.', 'Mengambil gelas.'], kunciJawaban: 'Ambil gelas itu.', pembahasan: 'Imperatif = perintah.', bobot: 10 }],
  },
  {
    id: 'sma11-koloid', judul: 'Sistem Koloid', deskripsi: 'Jenis, sifat, dan pembuatan koloid.', urutan: 4, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-koloid-m1', babId: 'sma11-koloid', judul: 'Sifat Koloid', konten: 'Efek Tyndall (menghamburkan cahaya), gerak Brown, adsorpsi, koagulasi. Contoh: susu, kabut, agar-agar.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'sma11-koloid-s1', tipe: 'pilihan_ganda', pertanyaan: 'Contoh koloid...', opsi: ['Larutan gula', 'Susu', 'Minyak murni'], kunciJawaban: 'Susu', pembahasan: 'Susu = emulsi (koloid).', bobot: 10 }],
  },
  {
    id: 'sma11-perang-dingin', judul: 'Perang Dingin', deskripsi: 'Latar, blok, dan dampak Perang Dingin.', urutan: 5, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-pd-m1', babId: 'sma11-perang-dingin', judul: 'Dua Blok', konten: 'Blok Barat (AS, NATO) vs Blok Timur (USSR, Pakta Warsawa). Indonesia: politik luar negeri bebas aktif, pelopor GNB.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'sma11-pd-s1', tipe: 'pilihan_ganda', pertanyaan: 'Indonesia dalam Perang Dingin menganut...', opsi: ['Blok Barat', 'Bebas aktif', 'Blok Timur'], kunciJawaban: 'Bebas aktif', pembahasan: 'Tidak memihak blok manapun.', bobot: 10 }],
  },
  {
    id: 'sma11-ekonomi-pasar', judul: 'Mekanisme Pasar', deskripsi: 'Permintaan, penawaran, dan harga keseimbangan.', urutan: 6, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-pasar-m1', babId: 'sma11-ekonomi-pasar', judul: 'Hukum Permintaan & Penawaran', konten: 'Harga naik → permintaan turun, penawaran naik. Titik temu = harga keseimbangan (ekuilibrium).', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'sma11-pasar-s1', tipe: 'pilihan_ganda', pertanyaan: 'Jika harga naik, penawaran akan...', opsi: ['Turun', 'Naik', 'Tetap'], kunciJawaban: 'Naik', pembahasan: 'Hukum penawaran.', bobot: 10 }],
  },
  {
    id: 'sma11-bola-voly', judul: 'Bola Voli', deskripsi: 'Teknik dasar: servis, passing, smash.', urutan: 7, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-voly-m1', babId: 'sma11-bola-voly', judul: 'Teknik Dasar', konten: 'Servis bawah/atas, passing bawah/atas, smash, block. Rotasi posisi tiap pindah servis.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'sma11-voly-s1', tipe: 'benar_salah', pertanyaan: 'Smash dilakukan untuk menyerang.', kunciJawaban: 'Benar', pembahasan: 'Smash = pukulan menyerang.', bobot: 10 }],
  },
  {
    id: 'sma11-seni-musik', judul: 'Musik Tradisional Nusantara', deskripsi: 'Gamelan, angklung, dan alat musik daerah.', urutan: 8, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [{ id: 'sma11-musik-m1', babId: 'sma11-seni-musik', judul: 'Alat Musik Daerah', konten: 'Gamelan (Jawa/Bali), angklung (Sunda), sasando (NTT), tifa (Papua). Angklung diakui UNESCO 2010.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'sma11-musik-s1', tipe: 'pilihan_ganda', pertanyaan: 'Angklung berasal dari...', opsi: ['Jawa Barat', 'Bali', 'Sumatra'], kunciJawaban: 'Jawa Barat', pembahasan: 'Sunda, Jawa Barat.', bobot: 10 }],
  },
];

export const SCHOOL_BAB_3: BabLengkap[] = [
  // ===== PAUD KELOMPOK B (8 bab) =====
  {
    id: 'paud-mengenal-angka', judul: 'Mengenal Angka 1-10', deskripsi: 'Berhitung sambil bernyanyi dan bermain.', urutan: 1, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-angka-m1', babId: 'paud-mengenal-angka', judul: 'Berhitung 1-10', konten: 'Satu, dua, tiga... sepuluh! Berhitung dengan jari, benda, dan lagu.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-angka-s1', tipe: 'pilihan_ganda', pertanyaan: 'Setelah angka 3 adalah...', opsi: ['5', '4', '2'], kunciJawaban: '4', pembahasan: 'Urutan: 3, 4.', bobot: 10 }],
  },
  {
    id: 'paud-mengenal-huruf', judul: 'Mengenal Huruf A-Z', deskripsi: 'Huruf vokal dan konsonan lewat lagu.', urutan: 2, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-huruf-m1', babId: 'paud-mengenal-huruf', judul: 'Huruf Vokal', konten: 'A, I, U, E, O — huruf vokal. Sisanya konsonan. Nyanyikan alfabet!', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-huruf-s1', tipe: 'pilihan_ganda', pertanyaan: 'Huruf vokal adalah...', opsi: ['B, C, D', 'A, I, U, E, O', 'X, Y, Z'], kunciJawaban: 'A, I, U, E, O', pembahasan: 'Lima huruf vokal.', bobot: 10 }],
  },
  {
    id: 'paud-warna-bentuk', judul: 'Warna dan Bentuk', deskripsi: 'Mengenal warna dasar dan bentuk geometri.', urutan: 3, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-warna-m1', babId: 'paud-warna-bentuk', judul: 'Warna & Bentuk', konten: 'Merah, kuning, biru. Lingkaran, segitiga, segiempat. Cari di sekitarmu!', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-warna-s1', tipe: 'pilihan_ganda', pertanyaan: 'Roda itu bentuknya...', opsi: ['Segitiga', 'Lingkaran', 'Kotak'], kunciJawaban: 'Lingkaran', pembahasan: 'Roda = lingkaran.', bobot: 10 }],
  },
  {
    id: 'paud-anggota-tubuh', judul: 'Anggota Tubuh', deskripsi: 'Nama dan fungsi anggota tubuh.', urutan: 4, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-tubuh-m1', babId: 'paud-anggota-tubuh', judul: 'Panca Indera', konten: 'Mata melihat, telinga mendengar, hidung mencium, lidah mengecap, kulit meraba.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-tubuh-s1', tipe: 'pilihan_ganda', pertanyaan: 'Untuk mendengar kita pakai...', opsi: ['Mata', 'Telinga', 'Hidung'], kunciJawaban: 'Telinga', pembahasan: 'Telinga untuk mendengar.', bobot: 10 }],
  },
  {
    id: 'paud-hewan', judul: 'Hewan Kesayangan', deskripsi: 'Kucing, ayam, ikan: suara dan makanannya.', urutan: 5, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-hewan-m1', babId: 'paud-hewan', judul: 'Suara Hewan', konten: 'Kucing: meong. Ayam: kukuruyuk. Bebek: kwek kwek. Sapi: moo.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-hewan-s1', tipe: 'pilihan_ganda', pertanyaan: 'Suara kucing...', opsi: ['Guk guk', 'Meong', 'Moo'], kunciJawaban: 'Meong', pembahasan: 'Kucing bersuara meong.', bobot: 10 }],
  },
  {
    id: 'paud-berbagi', judul: 'Berbagi dan Berteman', deskripsi: 'Akhlak: berbagi mainan dan berkata baik.', urutan: 6, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-berbagi-m1', babId: 'paud-berbagi', judul: 'Indahnya Berbagi', konten: 'Berbagi mainan dengan teman itu baik. Katakan tolong, terima kasih, dan maaf.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-berbagi-s1', tipe: 'benar_salah', pertanyaan: 'Berbagi mainan dengan teman itu baik.', kunciJawaban: 'Benar', pembahasan: 'Berbagi = akhlak mulia.', bobot: 10 }],
  },
  {
    id: 'paud-doa-harian', judul: 'Doa Sehari-hari', deskripsi: 'Doa makan, tidur, dan masuk rumah.', urutan: 7, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-doa-m1', babId: 'paud-doa-harian', judul: 'Doa Makan', konten: 'Allahumma barik lana... Hafalkan pelan-pelan bersama ayah bunda.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'paud-doa-s1', tipe: 'benar_salah', pertanyaan: 'Berdoa sebelum makan.', kunciJawaban: 'Benar', pembahasan: 'Adab makan.', bobot: 10 }],
  },
  {
    id: 'paud-mewarnai', judul: 'Mewarnai Gambar', deskripsi: 'Melatih motorik halus lewat mewarnai.', urutan: 8, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [{ id: 'paud-warna2-m1', babId: 'paud-mewarnai', judul: 'Teknik Mewarnai', konten: 'Pegang krayon dengan benar. Warnai dari luar ke dalam, searah.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'paud-warna2-s1', tipe: 'benar_salah', pertanyaan: 'Mewarnai melatih tangan.', kunciJawaban: 'Benar', pembahasan: 'Motorik halus.', bobot: 10 }],
  },

  // ===== SMK KELAS 11 TKJ (8 bab) =====
  {
    id: 'smk-jaringan-dasar', judul: 'Dasar Jaringan Komputer', deskripsi: 'Topologi, IP address, dan perangkat jaringan.', urutan: 1, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-jar-m1', babId: 'smk-jaringan-dasar', judul: 'IP Address', konten: 'IPv4: 4 oktet, contoh 192.168.1.1. Kelas A/B/C. Subnet mask memisahkan network & host.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smk-jar-s1', tipe: 'pilihan_ganda', pertanyaan: 'IP 192.168.1.1 termasuk kelas...', opsi: ['A', 'B', 'C'], kunciJawaban: 'C', pembahasan: '192.x = kelas C.', bobot: 10 }],
  },
  {
    id: 'smk-perakitan-pc', judul: 'Perakitan PC', deskripsi: 'Komponen dan langkah merakit komputer.', urutan: 2, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-rakit-m1', babId: 'smk-perakitan-pc', judul: 'Komponen Utama', konten: 'CPU, motherboard, RAM, storage, PSU, casing. Urutan: PSU → motherboard → CPU+cooler → RAM → storage → kabel.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smk-rakit-s1', tipe: 'pilihan_ganda', pertanyaan: 'Otak komputer disebut...', opsi: ['RAM', 'CPU', 'PSU'], kunciJawaban: 'CPU', pembahasan: 'CPU = processor.', bobot: 10 }],
  },
  {
    id: 'smk-instalasi-os', judul: 'Instalasi Sistem Operasi', deskripsi: 'Install Windows/Linux dan driver.', urutan: 3, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-os-m1', babId: 'smk-instalasi-os', judul: 'Tahapan Instalasi', konten: 'Backup → buat bootable → atur BIOS boot priority → partisi → install → driver → update.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smk-os-s1', tipe: 'benar_salah', pertanyaan: 'Backup data sebelum install ulang.', kunciJawaban: 'Benar', pembahasan: 'Wajib backup.', bobot: 10 }],
  },
  {
    id: 'smk-troubleshooting', judul: 'Troubleshooting Komputer', deskripsi: 'Diagnosis masalah hardware & software.', urutan: 4, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-trouble-m1', babId: 'smk-troubleshooting', judul: 'Metode Diagnosis', konten: 'Identifikasi gejala → isolasi (hardware/software) → uji satu per satu → perbaiki → verifikasi.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smk-trouble-s1', tipe: 'pilihan_ganda', pertanyaan: 'PC tidak menyala sama sekali, cek pertama...', opsi: ['RAM', 'Kabel power/PSU', 'VGA'], kunciJawaban: 'Kabel power/PSU', pembahasan: 'Mulai dari sumber daya.', bobot: 10 }],
  },
  {
    id: 'smk-desain-grafis', judul: 'Desain Grafis Dasar', deskripsi: 'Prinsip desain untuk kebutuhan cetak & digital.', urutan: 5, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-desain-m1', babId: 'smk-desain-grafis', judul: 'Prinsip Desain', konten: 'Kontras, repetisi, alignment, proximity (CRAP). Resolusi cetak 300 DPI.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'smk-desain-s1', tipe: 'pilihan_ganda', pertanyaan: 'Resolusi standar untuk cetak...', opsi: ['72 DPI', '300 DPI', '30 DPI'], kunciJawaban: '300 DPI', pembahasan: 'Cetak butuh 300 DPI.', bobot: 10 }],
  },
  {
    id: 'smk-kewirausahaan', judul: 'Kewirausahaan', deskripsi: 'Membuat rencana usaha jasa komputer.', urutan: 6, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-wira-m1', babId: 'smk-kewirausahaan', judul: 'Business Plan Sederhana', konten: 'Produk/jasa, target pasar, modal, harga, promosi, proyeksi untung. Mulai dari jasa servis sekitar.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'smk-wira-s1', tipe: 'benar_salah', pertanyaan: 'Rencana usaha membantu meminimalkan risiko.', kunciJawaban: 'Benar', pembahasan: 'Perencanaan = persiapan.', bobot: 10 }],
  },
  {
    id: 'smk-keamanan-jaringan', judul: 'Keamanan Jaringan Dasar', deskripsi: 'Firewall, password, dan ancaman umum.', urutan: 7, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-sec-m1', babId: 'smk-keamanan-jaringan', judul: 'Ancaman Umum', konten: 'Malware, phishing, MITM. Pertahanan: firewall, update, password kuat, waspada.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'smk-sec-s1', tipe: 'pilihan_ganda', pertanyaan: 'Email palsu yang mencuri data disebut...', opsi: ['Spam', 'Phishing', 'Hoax'], kunciJawaban: 'Phishing', pembahasan: 'Phishing = memancing data.', bobot: 10 }],
  },
  {
    id: 'smk-pkl', judul: 'Persiapan PKL', deskripsi: 'Etika kerja dan laporan praktik kerja lapangan.', urutan: 8, jenjang: 'smk', kelas: 'Kelas 11',
    materi: [{ id: 'smk-pkl-m1', babId: 'smk-pkl', judul: 'Etika PKL', konten: 'Disiplin, inisiatif, jaga nama sekolah. Catat kegiatan harian untuk laporan.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'smk-pkl-s1', tipe: 'benar_salah', pertanyaan: 'Jurnal harian membantu menyusun laporan PKL.', kunciJawaban: 'Benar', pembahasan: 'Catat tiap hari.', bobot: 10 }],
  },
];

export const SCHOOL_BAB_4: BabLengkap[] = [
  // ===== SARJANA SEMESTER 1 (8 bab) =====
  {
    id: 's1-logika-informatika', judul: 'Logika Informatika', deskripsi: 'Proposisi, tabel kebenaran, dan penalaran.', urutan: 1, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-logika-m1', babId: 's1-logika-informatika', judul: 'Proposisi & Operator', konten: 'Proposisi: pernyataan benar/salah. Operator: NOT, AND, OR, implikasi, biimplikasi. Tabel kebenaran untuk evaluasi.', urutan: 1, estimasiMenit: 20 }],
    latihan: [{ id: 's1-logika-s1', tipe: 'pilihan_ganda', pertanyaan: 'p AND q benar jika...', opsi: ['Salah satu benar', 'Keduanya benar', 'Keduanya salah'], kunciJawaban: 'Keduanya benar', pembahasan: 'AND butuh keduanya benar.', bobot: 10 }],
  },
  {
    id: 's1-algoritma', judul: 'Algoritma & Pemrograman Dasar', deskripsi: 'Flowchart, pseudocode, dan struktur kontrol.', urutan: 2, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-algo-m1', babId: 's1-algoritma', judul: 'Struktur Kontrol', konten: 'Sequence, selection (if-else), iteration (loop). Algoritma yang baik: benar, efisien, jelas.', urutan: 1, estimasiMenit: 20 }],
    latihan: [{ id: 's1-algo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Simbol belah ketupat pada flowchart untuk...', opsi: ['Proses', 'Keputusan', 'Input'], kunciJawaban: 'Keputusan', pembahasan: 'Diamond = decision.', bobot: 10 }],
  },
  {
    id: 's1-matdis', judul: 'Matematika Diskrit', deskripsi: 'Himpunan, relasi, dan fungsi.', urutan: 3, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-matdis-m1', babId: 's1-matdis', judul: 'Operasi Himpunan', konten: 'Union (∪), irisan (∩), komplemen, selisih. Diagram Venn untuk visualisasi.', urutan: 1, estimasiMenit: 20 }],
    latihan: [{ id: 's1-matdis-s1', tipe: 'isian', pertanyaan: 'A={1,2,3}, B={3,4}. A ∪ B = ... (tulis {1,2,3,4})', kunciJawaban: '{1,2,3,4}', pembahasan: 'Gabungan tanpa duplikat.', bobot: 10 }],
  },
  {
    id: 's1-pancasila', judul: 'Pendidikan Pancasila', deskripsi: 'Pancasila sebagai sistem filsafat dan ideologi.', urutan: 4, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-pancasila-m1', babId: 's1-pancasila', judul: 'Pancasila sebagai Ideologi Terbuka', konten: 'Nilai dasar tetap, penjabaran dinamis. Beda dengan ideologi tertutup yang kaku.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 's1-pancasila-s1', tipe: 'benar_salah', pertanyaan: 'Pancasila adalah ideologi terbuka.', kunciJawaban: 'Benar', pembahasan: 'Nilai dasar tetap, implementasi dinamis.', bobot: 10 }],
  },
  {
    id: 's1-bindo-akademik', judul: 'Bahasa Indonesia Akademik', deskripsi: 'Karya tulis ilmiah dan sitasi.', urutan: 5, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-bindo-m1', babId: 's1-bindo-akademik', judul: 'Struktur Karya Ilmiah', konten: 'Pendahuluan, tinjauan pustaka, metode, hasil, pembahasan, kesimpulan. Sitasi: APA/IEEE.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 's1-bindo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Daftar pustaka ditulis...', opsi: ['Acak', 'Alfabetis', 'Berdasarkan panjang'], kunciJawaban: 'Alfabetis', pembahasan: 'Urut abjad nama penulis.', bobot: 10 }],
  },
  {
    id: 's1-statistika', judul: 'Statistika Dasar', deskripsi: 'Mean, median, modus, dan distribusi.', urutan: 6, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-stat-m1', babId: 's1-statistika', judul: 'Ukuran Pemusatan', konten: 'Mean (rata-rata), median (tengah), modus (sering muncul). Pilih sesuai jenis data.', urutan: 1, estimasiMenit: 20 }],
    latihan: [{ id: 's1-stat-s1', tipe: 'isian', pertanyaan: 'Mean dari 2, 4, 6, 8 = ...', kunciJawaban: '5', pembahasan: '20/4 = 5.', bobot: 10 }],
  },
  {
    id: 's1-kalkulus', judul: 'Kalkulus I: Turunan', deskripsi: 'Konsep turunan dan aplikasinya.', urutan: 7, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-kalkulus-m1', babId: 's1-kalkulus', judul: 'Aturan Turunan', konten: 'f(x)=x^n → f\'(x)=n·x^(n-1). Aturan rantai untuk fungsi komposisi.', urutan: 1, estimasiMenit: 20 }],
    latihan: [{ id: 's1-kalkulus-s1', tipe: 'isian', pertanyaan: 'Turunan dari x³ adalah ... (tulis 3x^2)', kunciJawaban: '3x^2', pembahasan: '3·x^(3-1).', bobot: 10 }],
  },
  {
    id: 's1-english-academic', judul: 'Academic English', deskripsi: 'Reading jurnal dan academic writing dasar.', urutan: 8, jenjang: 'sarjana', kelas: 'Semester 1',
    materi: [{ id: 's1-eng-m1', babId: 's1-english-academic', judul: 'Skimming & Scanning', konten: 'Skimming: baca cepat untuk gagasan utama. Scanning: cari info spesifik. Keduanya kunci baca jurnal.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 's1-eng-s1', tipe: 'pilihan_ganda', pertanyaan: 'Skimming bertujuan...', opsi: ['Detail spesifik', 'Gagasan utama cepat', 'Menghafal'], kunciJawaban: 'Gagasan utama cepat', pembahasan: 'Skim = sapu cepat.', bobot: 10 }],
  },

  // ===== KEBUTUHAN KHUSUS TINGKAT DASAR (8 bab) =====
  {
    id: 'khusus-motorik-halus', judul: 'Melatih Motorik Halus', deskripsi: 'Menggenggam, menjumput, dan menggunting.', urutan: 1, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-motorik-m1', babId: 'khusus-motorik-halus', judul: 'Latihan Jari', konten: 'Meras plastisin, memungut kacang dengan pinset, menggunting garis. Lakukan 10 menit tiap hari dengan pendamping.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-motorik-s1', tipe: 'benar_salah', pertanyaan: 'Bermain plastisin melatih jari.', kunciJawaban: 'Benar', pembahasan: 'Motorik halus.', bobot: 10 }],
  },
  {
    id: 'khusus-komunikasi', judul: 'Komunikasi Dasar', deskripsi: 'Ekspresi, gestur, dan kata pertama.', urutan: 2, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-kom-m1', babId: 'khusus-komunikasi', judul: 'Bahasa Tubuh', konten: 'Menunjuk, anggukan, dan ekspresi wajah sebagai komunikasi. Hargai setiap usaha berkomunikasi.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-kom-s1', tipe: 'benar_salah', pertanyaan: 'Menunjuk termasuk komunikasi.', kunciJawaban: 'Benar', pembahasan: 'Komunikasi nonverbal.', bobot: 10 }],
  },
  {
    id: 'khusus-mandiri-makan', judul: 'Mandiri: Makan Sendiri', deskripsi: 'Langkah makan mandiri bertahap.', urutan: 3, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-makan-m1', babId: 'khusus-mandiri-makan', judul: 'Tahapan', konten: 'Pegang sendok → ambil makanan → suap ke mulut. Beri pujian tiap keberhasilan kecil.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-makan-s1', tipe: 'benar_salah', pertanyaan: 'Pujian membantu anak belajar mandiri.', kunciJawaban: 'Benar', pembahasan: 'Penguatan positif.', bobot: 10 }],
  },
  {
    id: 'khusus-mandiri-pakaian', judul: 'Mandiri: Berpakaian', deskripsi: 'Memakai baju dan sepatu sendiri.', urutan: 4, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-pakaian-m1', babId: 'khusus-mandiri-pakaian', judul: 'Urutkan Langkah', konten: 'Baju: kepala dulu → lengan. Sepatu: kanan-kiri. Gunakan gambar urutan sebagai panduan visual.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-pakaian-s1', tipe: 'benar_salah', pertanyaan: 'Panduan gambar membantu anak berurutan.', kunciJawaban: 'Benar', pembahasan: 'Visual support.', bobot: 10 }],
  },
  {
    id: 'khusus-sosialisasi', judul: 'Bermain Bersama', deskripsi: 'Berbagi dan bergiliran.', urutan: 5, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-sosial-m1', babId: 'khusus-sosialisasi', judul: 'Aturan Bergiliran', konten: 'Main bergiliran dengan timer visual. Mulai dari 1 teman, durasi pendek.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-sosial-s1', tipe: 'benar_salah', pertanyaan: 'Bergiliran bisa dilatih.', kunciJawaban: 'Benar', pembahasan: 'Dengan struktur dan visual.', bobot: 10 }],
  },
  {
    id: 'khusus-emosi', judul: 'Mengenali Emosi', deskripsi: 'Senang, sedih, marah lewat gambar wajah.', urutan: 6, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-emosi-m1', babId: 'khusus-emosi', judul: 'Kartu Emosi', konten: 'Tunjukkan kartu wajah; anak meniru dan menamai. Kaitkan dengan pengalaman sehari-hari.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-emosi-s1', tipe: 'pilihan_ganda', pertanyaan: 'Wajah tersenyum artinya...', opsi: ['Sedih', 'Senang', 'Marah'], kunciJawaban: 'Senang', pembahasan: 'Senyum = senang.', bobot: 10 }],
  },
  {
    id: 'khusus-angka-dasar', judul: 'Angka 1-5', deskripsi: 'Berhitung konkret dengan benda.', urutan: 7, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-angka-m1', babId: 'khusus-angka-dasar', judul: 'Berhitung Benda', konten: 'Hitung benda nyata: 1 apel, 2 apel... Pasangkan angka dengan jumlah benda.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-angka-s1', tipe: 'pilihan_ganda', pertanyaan: 'Dua apel + satu apel = ... apel', opsi: ['2', '3', '4'], kunciJawaban: '3', pembahasan: '2+1=3.', bobot: 10 }],
  },
  {
    id: 'khusus-keamanan-diri', judul: 'Keamanan Diri', deskripsi: 'Bagian tubuh privat dan berani berkata tidak.', urutan: 8, jenjang: 'khusus', kelas: 'Tingkat Dasar',
    materi: [{ id: 'khusus-aman-m1', babId: 'khusus-keamanan-diri', judul: 'Tubuhku Milikku', konten: 'Area privat tidak boleh disentuh orang lain. Berani bilang TIDAK dan lapor ke orang tua/guru.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'khusus-aman-s1', tipe: 'benar_salah', pertanyaan: 'Boleh bilang TIDAK jika tidak nyaman disentuh.', kunciJawaban: 'Benar', pembahasan: 'Hak atas tubuh sendiri.', bobot: 10 }],
  },

  // ===== AGAMA TINGKAT IBTIDAIYAH (8 bab) =====
  {
    id: 'agama-wudu', judul: 'Tata Cara Wudu', deskripsi: 'Rukun wudu dan yang membatalkannya.', urutan: 1, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-wudu-m1', babId: 'agama-wudu', judul: 'Rukun Wudu', konten: 'Niat, membasuh muka, tangan sampai siku, mengusap kepala, membasuh kaki, tertib.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'agama-wudu-s1', tipe: 'pilihan_ganda', pertanyaan: 'Rukun wudu yang pertama...', opsi: ['Membasuh kaki', 'Niat', 'Berkumur'], kunciJawaban: 'Niat', pembahasan: 'Niat mengawali.', bobot: 10 }],
  },
  {
    id: 'agama-salat', judul: 'Tata Cara Salat', deskripsi: 'Rukun salat dan bacaan wajib.', urutan: 2, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-salat-m1', babId: 'agama-salat', judul: 'Rukun Salat', konten: 'Niat, takbiratul ihram, berdiri, baca Al-Fatihah, rukuk, iktidal, sujud, duduk, tasyahud, salam, tertib.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'agama-salat-s1', tipe: 'benar_salah', pertanyaan: 'Al-Fatihah wajib dibaca tiap rakaat.', kunciJawaban: 'Benar', pembahasan: 'Rukun salat.', bobot: 10 }],
  },
  {
    id: 'agama-rukun-iman', judul: 'Rukun Iman', deskripsi: 'Enam rukun iman dan maknanya.', urutan: 3, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-iman-m1', babId: 'agama-rukun-iman', judul: 'Enam Rukun Iman', konten: 'Iman kepada Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar.', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'agama-iman-s1', tipe: 'pilihan_ganda', pertanyaan: 'Rukun iman berjumlah...', opsi: ['5', '6', '7'], kunciJawaban: '6', pembahasan: 'Enam rukun iman.', bobot: 10 }],
  },
  {
    id: 'agama-kisah-nabi', judul: 'Kisah Nabi Muhammad', deskripsi: 'Kelahiran hingga kenabian.', urutan: 4, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-nabi-m1', babId: 'agama-kisah-nabi', judul: 'Masa Kecil Nabi', konten: 'Lahir di Mekkah tahun Gajah (571 M), diasuh Halimatus Sakdiyah, yatim piatu, jujur (Al-Amin).', urutan: 1, estimasiMenit: 12 }],
    latihan: [{ id: 'agama-nabi-s1', tipe: 'pilihan_ganda', pertanyaan: 'Nabi Muhammad lahir tahun...', opsi: ['571 M', '622 M', '610 M'], kunciJawaban: '571 M', pembahasan: 'Tahun Gajah.', bobot: 10 }],
  },
  {
    id: 'agama-juz-amma', judul: 'Hafalan Juz Amma', deskripsi: 'Surah pendek: Al-Ikhlas hingga An-Nas.', urutan: 5, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-juz-m1', babId: 'agama-juz-amma', judul: 'Metode Hafalan', konten: 'Dengarkan → tirukan per ayat → ulang 10x → sambung ayat. Setor ke guru/orang tua.', urutan: 1, estimasiMenit: 15 }],
    latihan: [{ id: 'agama-juz-s1', tipe: 'benar_salah', pertanyaan: 'Mengulang 10x membantu hafalan.', kunciJawaban: 'Benar', pembahasan: 'Pengulangan = kunci.', bobot: 10 }],
  },
  {
    id: 'agama-akhlak', judul: 'Akhlak Terpuji', deskripsi: 'Jujur, amanah, dan berbakti.', urutan: 6, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-akhlak-m1', babId: 'agama-akhlak', judul: 'Jujur & Amanah', konten: 'Jujur: berkata benar. Amanah: menjaga titipan. Keduanya sifat wajib rasul.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'agama-akhlak-s1', tipe: 'pilihan_ganda', pertanyaan: 'Menjaga titipan disebut...', opsi: ['Jujur', 'Amanah', 'Sabar'], kunciJawaban: 'Amanah', pembahasan: 'Amanah = dapat dipercaya.', bobot: 10 }],
  },
  {
    id: 'agama-puasa', judul: 'Puasa Ramadan', deskripsi: 'Syarat, rukun, dan hikmah puasa.', urutan: 7, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-puasa-m1', babId: 'agama-puasa', judul: 'Rukun Puasa', konten: 'Niat malam hari, menahan makan/minum dan yang membatalkan dari fajar hingga magrib.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'agama-puasa-s1', tipe: 'benar_salah', pertanyaan: 'Puasa dimulai sejak terbit fajar.', kunciJawaban: 'Benar', pembahasan: 'Hingga magrib.', bobot: 10 }],
  },
  {
    id: 'agama-doa', judul: 'Doa Sehari-hari', deskripsi: 'Doa makan, tidur, belajar.', urutan: 8, jenjang: 'agama', kelas: 'Tingkat Ibtidaiyah',
    materi: [{ id: 'agama-doa-m1', babId: 'agama-doa', judul: 'Adab Berdoa', konten: 'Menghadap kiblat, angkat tangan, mulai dengan pujian, tutup dengan salawat. Yakin dikabulkan.', urutan: 1, estimasiMenit: 10 }],
    latihan: [{ id: 'agama-doa-s1', tipe: 'benar_salah', pertanyaan: 'Berdoa dengan yakin.', kunciJawaban: 'Benar', pembahasan: 'Adab doa.', bobot: 10 }],
  },
];

// Semua bab school
export const SCHOOL_BAB_5: BabLengkap[] = [
  {
    id: 'sma11-statistika', judul: 'Statistika Dasar', deskripsi: 'Mean, median, modus, dan penyajian data.', urutan: 9, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-stat-m1', babId: 'sma11-statistika', judul: 'Ukuran Pemusatan', konten: 'Mean = jumlah/n. Median = nilai tengah setelah diurutkan. Modus = nilai paling sering muncul. Pilih sesuai jenis data.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-stat-m2', babId: 'sma11-statistika', judul: 'Penyajian Data', konten: 'Tabel frekuensi, histogram, diagram batang, dan diagram lingkaran. Pilih yang paling jelas untuk audiens.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-stat-s1', tipe: 'pilihan_ganda', pertanyaan: 'Data: 5, 7, 7, 8, 9. Mediannya...', opsi: ['6', '7', '8'], kunciJawaban: '7', pembahasan: 'Urutkan, ambil tengah: 7.', bobot: 10 },
      { id: 'sma11-stat-s2', tipe: 'isian', pertanyaan: 'Rata-rata dari 4, 6, 8, 10 = ...', kunciJawaban: '7', pembahasan: '(4+6+8+10)/4 = 7.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-statistika', judul: 'Statistika SMP', deskripsi: 'Rata-rata, diagram, dan menafsir data.', urutan: 9, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-stat-m1', babId: 'smp8-statistika', judul: 'Mean Median Modus', konten: 'Mean: jumlah data dibagi banyaknya. Median: nilai tengah. Modus: paling sering muncul. Contoh: nilai 6,7,7,8,9 → mean 7,4; median 7; modus 7.', urutan: 1, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp8-stat-s1', tipe: 'pilihan_ganda', pertanyaan: 'Modus dari 3,5,5,6,6,6,7 adalah...', opsi: ['5', '6', '7'], kunciJawaban: '6', pembahasan: '6 muncul 3 kali, paling sering.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bangun-datar', judul: 'Bangun Datar', deskripsi: 'Sifat persegi, persegi panjang, dan segitiga.', urutan: 10, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-bd-m1', babId: 'sd4-bangun-datar', judul: 'Sifat-sifat', konten: 'Persegi: 4 sisi sama, 4 sudut siku-siku. Persegi panjang: sisi berhadapan sama. Segitiga: 3 sisi, 3 sudut.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-bd-m2', babId: 'sd4-bangun-datar', judul: 'Keliling dan Luas', konten: 'Keliling persegi = 4×sisi. Luas persegi = sisi×sisi. Keliling persegi panjang = 2×(p+l). Luas = p×l.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sd4-bd-s1', tipe: 'pilihan_ganda', pertanyaan: 'Luas persegi sisi 5 cm = ...', opsi: ['20 cm²', '25 cm²', '30 cm²'], kunciJawaban: '25 cm²', pembahasan: '5×5 = 25.', bobot: 10 },
      { id: 'sd4-bd-s2', tipe: 'isian', pertanyaan: 'Keliling persegi panjang p=8, l=3 = ...', kunciJawaban: '22', pembahasan: '2×(8+3) = 22.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-peluang', judul: 'Peluang', deskripsi: 'Ruang sampel, peluang kejadian, dan frekuensi harapan.', urutan: 11, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-pl-m1', babId: 'smp8-peluang', judul: 'Ruang Sampel', konten: 'Ruang sampel = semua hasil mungkin. Koin: {A,G} → n(S)=2. Dadu: {1..6} → n(S)=6. Peluang = n(A)/n(S).', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-pl-m2', babId: 'smp8-peluang', judul: 'Frekuensi Harapan', konten: 'Fh = P(A) × banyak percobaan. Contoh: peluang angka genap dadu = 3/6 = 1/2. Dilempar 60x → Fh = 30.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-pl-s1', tipe: 'pilihan_ganda', pertanyaan: 'Peluang muncul angka 5 pada dadu = ...', opsi: ['1/6', '1/3', '5/6'], kunciJawaban: '1/6', pembahasan: 'Satu sisi dari enam.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-trigonometri', judul: 'Trigonometri Lanjut', deskripsi: 'Identitas, persamaan, dan grafik fungsi trigonometri.', urutan: 12, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-trig-m1', babId: 'sma11-trigonometri', judul: 'Identitas Dasar', konten: 'sin²x + cos²x = 1. tan x = sin x / cos x. Identitas ini kunci menyederhanakan persamaan trigonometri.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-trig-m2', babId: 'sma11-trigonometri', judul: 'Persamaan Trigonometri', konten: 'Selesaikan sin x = 1/2 → x = 30° + k·360° atau x = 150° + k·360°. Selalu tulis solusi umum dengan k bilangan bulat.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-trig-s1', tipe: 'pilihan_ganda', pertanyaan: 'Nilai sin²30° + cos²30° = ...', opsi: ['0', '1', '2'], kunciJawaban: '1', pembahasan: 'Identitas dasar selalu 1.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ipa-gaya', judul: 'Gaya dan Gerak', deskripsi: 'Macam gaya dan pengaruhnya pada benda.', urutan: 13, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-gaya-m1', babId: 'sd4-ipa-gaya', judul: 'Macam-macam Gaya', konten: 'Gaya otot (mendorong), gaya gravitasi (menarik ke bawah), gaya gesek (menahan), gaya magnet. Semua bisa mengubah gerak benda.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-gaya-m2', babId: 'sd4-ipa-gaya', judul: 'Pengaruh Gaya', konten: 'Gaya bisa: membuat diam jadi bergerak, bergerak jadi diam, mengubah arah, mengubah bentuk (plastisin ditekan).', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-gaya-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bola menggelinding lalu berhenti karena ...', opsi: ['gaya otot', 'gaya gesek', 'gaya magnet'], kunciJawaban: 'gaya gesek', pembahasan: 'Gesekan dengan lantai memperlambat bola.', bobot: 10 },
    ],
  },
  {
    id: 'paud-b-angka', judul: 'Mengenal Angka 1-20', deskripsi: 'Berhitung sambil bernyanyi dan bermain.', urutan: 14, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [
      { id: 'paud-angka-m1', babId: 'paud-b-angka', judul: 'Berhitung 1-10', konten: 'Bernyanyi "satu dua tiga..." sambil menunjukkan jari. Hitung benda nyata: kelereng, balok, buah.', urutan: 1, estimasiMenit: 15 },
      { id: 'paud-angka-m2', babId: 'paud-b-angka', judul: 'Angka 11-20', konten: 'Lanjutkan dengan lagu dan kartu angka. Pasangkan kartu angka dengan jumlah benda.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'paud-angka-s1', tipe: 'pilihan_ganda', pertanyaan: 'Setelah angka 7 adalah ...', opsi: ['6', '8', '9'], kunciJawaban: '8', pembahasan: 'Urutan: 7 lalu 8.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-teorema-pythagoras', judul: 'Teorema Pythagoras', deskripsi: 'Hubungan sisi segitiga siku-siku dan tripel Pythagoras.', urutan: 15, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-pyt-m1', babId: 'smp8-teorema-pythagoras', judul: 'Rumus Dasar', konten: 'a² + b² = c² (c = sisi miring). Contoh: a=3, b=4 → c = √(9+16) = 5.', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-pyt-m2', babId: 'smp8-teorema-pythagoras', judul: 'Tripel Pythagoras', konten: 'Pasangan (3,4,5), (5,12,13), (6,8,10), (8,15,17). Hafalkan untuk hitung cepat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-pyt-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sisi siku 6 dan 8, sisi miring = ...', opsi: ['10', '12', '14'], kunciJawaban: '10', pembahasan: '√(36+64) = √100 = 10.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-limit', judul: 'Limit Fungsi', deskripsi: 'Konsep limit, sifat, dan limit fungsi aljabar.', urutan: 16, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-limit-m1', babId: 'sma11-limit', judul: 'Pengertian Limit', konten: 'lim(x→a) f(x) = L artinya f(x) mendekati L saat x mendekati a. Nilai fungsi di a belum tentu sama dengan limitnya.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-limit-m2', babId: 'sma11-limit', judul: 'Limit Bentuk Tak Tentu', konten: 'Bentuk 0/0: faktorkan lalu coret. Contoh: lim(x→2) (x²-4)/(x-2) = lim(x→2) (x+2) = 4.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-limit-s1', tipe: 'pilihan_ganda', pertanyaan: 'lim(x→3) (x²-9)/(x-3) = ...', opsi: ['3', '6', '9'], kunciJawaban: '6', pembahasan: 'Faktorkan: (x-3)(x+3)/(x-3) = x+3 → 6.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-peta', judul: 'Membaca Peta', deskripsi: 'Unsur peta, arah mata angin, dan simbol.', urutan: 17, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-peta-m1', babId: 'sd4-ips-peta', judul: 'Unsur-unsur Peta', konten: 'Judul, legenda, skala, arah mata angin, simbol. Legenda menjelaskan arti simbol di peta.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-peta-m2', babId: 'sd4-ips-peta', judul: 'Arah Mata Angin', konten: '8 arah: utara, timur laut, timur, tenggara, selatan, barat daya, barat, barat laut. Matahari terbit di timur.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-peta-s1', tipe: 'pilihan_ganda', pertanyaan: 'Simbol pada peta dijelaskan di ...', opsi: ['judul', 'legenda', 'skala'], kunciJawaban: 'legenda', pembahasan: 'Legenda = keterangan simbol.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-lingkaran', judul: 'Lingkaran', deskripsi: 'Unsur, keliling, dan luas lingkaran.', urutan: 18, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-ling-m1', babId: 'smp8-lingkaran', judul: 'Unsur-unsur', konten: 'Jari-jari (r), diameter (d=2r), tali busur, busur, juring, tembereng. Diameter adalah tali busur terpanjang.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-ling-m2', babId: 'smp8-lingkaran', judul: 'Keliling dan Luas', konten: 'K = 2πr = πd. L = πr². Gunakan π = 22/7 bila r kelipatan 7, π = 3,14 bila tidak.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp8-ling-s1', tipe: 'pilihan_ganda', pertanyaan: 'Luas lingkaran r = 7 cm (π=22/7) = ...', opsi: ['144 cm²', '154 cm²', '164 cm²'], kunciJawaban: '154 cm²', pembahasan: '22/7 × 49 = 154.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-turunan', judul: 'Turunan Fungsi Aljabar', deskripsi: 'Definisi turunan, rumus dasar, dan aplikasinya.', urutan: 19, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-tur-m1', babId: 'sma11-turunan', judul: 'Rumus Dasar', konten: 'f(x) = ax^n → f\'(x) = n·ax^(n-1). Contoh: f(x) = 3x² → f\'(x) = 6x.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-tur-m2', babId: 'sma11-turunan', judul: 'Aplikasi: Gradien & Maksimum', konten: 'Turunan = gradien garis singgung. Titik stasioner: f\'(x) = 0. Uji untuk min/maks.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-tur-s1', tipe: 'pilihan_ganda', pertanyaan: 'Turunan dari f(x) = 4x³ adalah ...', opsi: ['12x²', '12x', '4x²'], kunciJawaban: '12x²', pembahasan: '3·4x² = 12x².', bobot: 10 },
    ],
  },
  {
    id: 'paud-b-huruf', judul: 'Mengenal Huruf A-Z', deskripsi: 'Fonik dan bentuk huruf lewat lagu dan kartu.', urutan: 20, jenjang: 'paud', kelas: 'Kelompok B',
    materi: [
      { id: 'paud-huruf-m1', babId: 'paud-b-huruf', judul: 'Lagu ABC', konten: 'Nyanyikan lagu ABC sambil menunjuk kartu huruf. Fokus bunyi tiap huruf (fonik), bukan cuma nama.', urutan: 1, estimasiMenit: 15 },
      { id: 'paud-huruf-m2', babId: 'paud-b-huruf', judul: 'Huruf dan Benda', konten: 'A untuk Apel, B untuk Bola. Pasangkan kartu huruf dengan gambar benda.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'paud-huruf-s1', tipe: 'pilihan_ganda', pertanyaan: 'Huruf setelah B adalah ...', opsi: ['A', 'C', 'D'], kunciJawaban: 'C', pembahasan: 'Urutan: A, B, C.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-bangun-ruang', judul: 'Bangun Ruang Sisi Datar', deskripsi: 'Kubus, balok, prisma, limas: volume dan luas permukaan.', urutan: 21, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-br-m1', babId: 'smp8-bangun-ruang', judul: 'Kubus dan Balok', konten: 'Kubus: V = s³, LP = 6s². Balok: V = p×l×t, LP = 2(pl+pt+lt).', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-br-m2', babId: 'smp8-bangun-ruang', judul: 'Prisma dan Limas', konten: 'Prisma: V = La×t. Limas: V = 1/3×La×t. La = luas alas.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp8-br-s1', tipe: 'pilihan_ganda', pertanyaan: 'Volume kubus s=5 cm = ...', opsi: ['125 cm³', '150 cm³', '100 cm³'], kunciJawaban: '125 cm³', pembahasan: '5³ = 125.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-keragaman', judul: 'Keragaman Budaya Indonesia', deskripsi: 'Suku, bahasa, dan rumah adat nusantara.', urutan: 22, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-bud-m1', babId: 'sd4-ips-keragaman', judul: 'Suku dan Bahasa', konten: 'Indonesia punya 1.300+ suku bangsa. Bahasa persatuan: Indonesia. Contoh: Jawa, Sunda, Batak, Minang, Bugis, Papua.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-bud-m2', babId: 'sd4-ips-keragaman', judul: 'Rumah Adat', konten: 'Joglo (Jawa), Gadang (Minang), Tongkonan (Toraja), Honai (Papua). Tiap rumah mencerminkan budaya dan alam daerahnya.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-bud-s1', tipe: 'pilihan_ganda', pertanyaan: 'Rumah Gadang berasal dari ...', opsi: ['Jawa', 'Minangkabau', 'Bali'], kunciJawaban: 'Minangkabau', pembahasan: 'Gadang = rumah adat Minang, Sumatera Barat.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-statistika-2', judul: 'Statistika Inferensia Dasar', deskripsi: 'Populasi, sampel, dan estimasi sederhana.', urutan: 23, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-si-m1', babId: 'sma11-statistika-2', judul: 'Populasi vs Sampel', konten: 'Populasi = seluruh objek. Sampel = sebagian yang mewakili. Sampel acak menghindari bias.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-si-m2', babId: 'sma11-statistika-2', judul: 'Estimasi Rata-rata', konten: 'Rata-rata sampel dipakai menaksir rata-rata populasi. Makin besar sampel, makin akurat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-si-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sampel yang baik harus ...', opsi: ['acak & mewakili', 'dipilih yang disuka', 'sekecil mungkin'], kunciJawaban: 'acak & mewakili', pembahasan: 'Sampel acak menghindari bias.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bindo-karangan', judul: 'Menulis Karangan Narasi', deskripsi: 'Struktur karangan: pembuka, isi, penutup.', urutan: 24, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-kar-m1', babId: 'sd4-bindo-karangan', judul: 'Struktur Karangan', konten: 'Pembuka: pengenalan. Isi: rangkaian peristiwa urut. Penutup: kesan/pesan. Gunakan bahasa sendiri.', urutan: 1, estimasiMenit: 20 },
      { id: 'sd4-kar-m2', babId: 'sd4-bindo-karangan', judul: 'Contoh Narasi', konten: '"Pagi itu aku pergi ke pasar dengan ibu..." — tulis urut dari berangkat sampai pulang, sertakan perasaanmu.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-kar-s1', tipe: 'isian', pertanyaan: 'Tulis 1 kalimat pembuka karangan tentang liburan!', kunciJawaban: 'bebas', pembahasan: 'Contoh: "Liburan kemarin aku pergi ke rumah nenek."', bobot: 10 },
    ],
  },
  {
    id: 'smp8-plsv', judul: 'Persamaan Linear Satu Variabel', deskripsi: 'Menyelesaikan PLSV dan aplikasinya.', urutan: 25, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-plsv-m1', babId: 'smp8-plsv', judul: 'Bentuk Umum', konten: 'ax + b = 0, a ≠ 0. Contoh: 2x + 6 = 0.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-plsv-m2', babId: 'smp8-plsv', judul: 'Cara Menyelesaikan', konten: 'Pindahkan ruas: 2x + 6 = 10 → 2x = 4 → x = 2. Ingat: pindah ruas ganti tanda.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp8-plsv-s1', tipe: 'pilihan_ganda', pertanyaan: 'Nilai x dari 3x − 9 = 0 adalah ...', opsi: ['2', '3', '4'], kunciJawaban: '3', pembahasan: '3x = 9 → x = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-peluang', judul: 'Peluang Kejadian Majemuk', deskripsi: 'Aturan perkalian, komplemen, dan kejadian bersyarat.', urutan: 26, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-pel-m1', babId: 'sma11-peluang', judul: 'Kaidah Pencacahan', konten: 'Aturan perkalian: bila ada m cara tahap 1 dan n cara tahap 2 → m×n cara. Permutasi: P(n,r) = n!/(n-r)!. Kombinasi: C(n,r) = n!/(r!(n-r)!).', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-pel-m2', babId: 'sma11-peluang', judul: 'Peluang Bersyarat', konten: 'P(A|B) = P(A∩B)/P(B). Contoh: peluang kartu As diberi tahu kartunya merah.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-pel-s1', tipe: 'pilihan_ganda', pertanyaan: 'C(5,2) = ...', opsi: ['10', '20', '25'], kunciJawaban: '10', pembahasan: '5!/(2!3!) = 10.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ipa-gaya', judul: 'Gaya dan Gerak', deskripsi: 'Macam-macam gaya dan pengaruhnya pada benda.', urutan: 27, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-gay-m1', babId: 'sd4-ipa-gaya', judul: 'Macam Gaya', konten: 'Gaya otot, gaya magnet, gaya gravitasi, gaya gesek. Gaya bisa mengubah bentuk, arah, dan kecepatan benda.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-gay-m2', babId: 'sd4-ipa-gaya', judul: 'Contoh Sehari-hari', konten: 'Menendang bola (gaya otot), magnet menempel di kulkas, apel jatuh (gravitasi), rem sepeda (gesek).', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-gay-s1', tipe: 'pilihan_ganda', pertanyaan: 'Gaya yang membuat apel jatuh ke tanah adalah gaya ...', opsi: ['otot', 'magnet', 'gravitasi'], kunciJawaban: 'gravitasi', pembahasan: 'Gravitasi menarik benda ke bumi.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ips-asean', judul: 'Negara-negara ASEAN', deskripsi: 'Profil negara ASEAN dan kerja samanya.', urutan: 28, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-ase-m1', babId: 'smp8-ips-asean', judul: '10 Negara Anggota', konten: 'Indonesia, Malaysia, Singapura, Thailand, Filipina, Brunei, Vietnam, Laos, Myanmar, Kamboja. Timor Leste bergabung 2025.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-ase-m2', babId: 'smp8-ips-asean', judul: 'Bentuk Kerja Sama', konten: 'Ekonomi (AFTA), sosial budaya (pertukaran pelajar), politik (ZOPFAN). Sekretariat di Jakarta.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-ase-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sekretariat ASEAN berkedudukan di ...', opsi: ['Jakarta', 'Kuala Lumpur', 'Bangkok'], kunciJawaban: 'Jakarta', pembahasan: 'Sekretariat ASEAN di Jakarta, Indonesia.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-kim-larutan', judul: 'Larutan Asam Basa', deskripsi: 'Teori asam basa, pH, dan titrasi.', urutan: 29, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-kim-m1', babId: 'sma11-kim-larutan', judul: 'Teori Asam Basa', konten: 'Arrhenius: asam melepas H+, basa melepas OH-. Bronsted-Lowry: asam donor proton, basa akseptor proton. Lewis: asam akseptor pasangan elektron.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-kim-m2', babId: 'sma11-kim-larutan', judul: 'pH dan Titrasi', konten: 'pH = -log[H+]. pH < 7 asam, = 7 netral, > 7 basa. Titrasi: menentukan konsentrasi dengan larutan baku.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-kim-s1', tipe: 'pilihan_ganda', pertanyaan: 'Larutan dengan [H+] = 10^-3 M memiliki pH ...', opsi: ['3', '11', '7'], kunciJawaban: '3', pembahasan: 'pH = -log(10^-3) = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bing-describe', judul: 'Describing Animals', deskripsi: 'Mendeskripsikan hewan dalam bahasa Inggris.', urutan: 30, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-bing-m1', babId: 'sd4-bing-describe', judul: 'Kosa Kata', konten: 'big/small, long/short, fast/slow, fur/feather/scale. Contoh: "An elephant is big. It has a long trunk."', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-bing-m2', babId: 'sd4-bing-describe', judul: 'Pola Kalimat', konten: 'It is + adjective. It has + noun. It can + verb. Contoh: "A bird can fly."', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-bing-s1', tipe: 'pilihan_ganda', pertanyaan: '"A cat ... whiskers." Kata yang tepat:', opsi: ['has', 'have', 'is'], kunciJawaban: 'has', pembahasan: 'Subjek tunggal (a cat) → has.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-bing-past', judul: 'Simple Past Tense', deskripsi: 'Menceritakan kejadian lampau dalam bahasa Inggris.', urutan: 31, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-bing-m1', babId: 'smp8-bing-past', judul: 'Pola Kalimat', konten: 'S + V2. Regular: +ed (play→played). Irregular: hafal (go→went, eat→ate). Negatif: did not + V1.', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-bing-m2', babId: 'smp8-bing-past', judul: 'Time Signal', konten: 'yesterday, last night/week, two days ago. Contoh: "I visited my grandma yesterday."', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-bing-s1', tipe: 'pilihan_ganda', pertanyaan: '"She ___ to school yesterday."', opsi: ['go', 'went', 'goes'], kunciJawaban: 'went', pembahasan: 'Yesterday → past tense → went.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fis-gelombang', judul: 'Gelombang Bunyi dan Cahaya', deskripsi: 'Sifat gelombang, bunyi, dan optik.', urutan: 32, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-fis-m1', babId: 'sma11-fis-gelombang', judul: 'Besaran Gelombang', konten: 'v = λ × f. Cepat rambat bunyi di udara ±340 m/s. Nada: frekuensi tinggi = nada tinggi.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-fis-m2', babId: 'sma11-fis-gelombang', judul: 'Cahaya dan Cermin', konten: 'Hukum pemantulan: sudut datang = sudut pantul. Lensa cembung mengumpulkan cahaya (kacamata plus).', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-fis-s1', tipe: 'pilihan_ganda', pertanyaan: 'Gelombang dengan λ=2m, f=170Hz memiliki cepat rambat ...', opsi: ['340 m/s', '85 m/s', '172 m/s'], kunciJawaban: '340 m/s', pembahasan: 'v = 2 × 170 = 340 m/s.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ppkn-pancasila', judul: 'Pancasila sebagai Dasar Negara', deskripsi: 'Lima sila dan pengamalannya.', urutan: 33, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-ppk-m1', babId: 'sd4-ppkn-pancasila', judul: 'Lima Sila', konten: '1. Ketuhanan YME 2. Kemanusiaan yang adil dan beradab 3. Persatuan Indonesia 4. Kerakyatan dipimpin hikmat kebijaksanaan 5. Keadilan sosial.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-ppk-m2', babId: 'sd4-ppkn-pancasila', judul: 'Pengamalan', konten: 'Sila 1: beribadah. Sila 2: menolong. Sila 3: cinta tanah air. Sila 4: musyawarah. Sila 5: adil.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-ppk-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sila ke-3 Pancasila berbunyi ...', opsi: ['Persatuan Indonesia', 'Keadilan sosial', 'Ketuhanan YME'], kunciJawaban: 'Persatuan Indonesia', pembahasan: 'Sila 3 = Persatuan Indonesia.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ipa-sistem-gerk', judul: 'Sistem Gerak Manusia', deskripsi: 'Rangka, otot, dan sendi.', urutan: 34, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-gerak-m1', babId: 'smp8-ipa-sistem-gerk', judul: 'Rangka', konten: '206 tulang dewasa. Fungsi: penopang, pelindung organ, tempat otot melekat, pembentuk sel darah.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-gerak-m2', babId: 'smp8-ipa-sistem-gerk', judul: 'Otot & Sendi', konten: 'Otot lurik (sadar), polos (tak sadar), jantung. Sendi: engsel (siku), peluru (bahu), putar (leher).', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-gerak-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sendi pada siku termasuk sendi ...', opsi: ['engsel', 'peluru', 'putar'], kunciJawaban: 'engsel', pembahasan: 'Siku bergerak satu arah seperti engsel pintu.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-sej-kolonial', judul: 'Penjajahan Belanda di Indonesia', deskripsi: 'VOC, tanam paksa, dan perlawanan rakyat.', urutan: 35, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-sej-m1', babId: 'sma11-sej-kolonial', judul: 'VOC & Tanam Paksa', konten: 'VOC (1602-1799): monopoli rempah. Cultuurstelsel (1830-1870): tanam paksa, penderitaan rakyat, keuntungan Belanda.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-sej-m2', babId: 'sma11-sej-kolonial', judul: 'Perlawanan', konten: 'Diponegoro (1825-1830), Imam Bonjol, Pattimura, Cut Nyak Dien. Politik Etis membuka pendidikan → lahir nasionalisme.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-sej-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tanam paksa (cultuurstelsel) dimulai tahun ...', opsi: ['1830', '1602', '1908'], kunciJawaban: '1830', pembahasan: 'Cultuurstelsel oleh Van den Bosch, 1830.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-sbd-seni-rupa', judul: 'Seni Rupa: Menggambar Pemandangan', deskripsi: 'Teknik menggambar pemandangan sederhana.', urutan: 36, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-sbd-m1', babId: 'sd4-sbd-seni-rupa', judul: 'Unsur Gambar', konten: 'Garis, bentuk, warna. Komposisi: gunung di belakang, sawah di tengah, matahari di atas.', urutan: 1, estimasiMenit: 20 },
      { id: 'sd4-sbd-m2', babId: 'sd4-sbd-seni-rupa', judul: 'Mewarnai', konten: 'Gradasi: tekan ringan untuk muda, kuat untuk tua. Langit: biru muda ke putih.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sd4-sbd-s1', tipe: 'isian', pertanyaan: 'Gambar pemandangan dengan 3 unsur: gunung, sawah, matahari. Warnai dengan gradasi.', kunciJawaban: 'bebas', pembahasan: 'Dinilai kreativitas & kerapian.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-mtk-bangun-ruang', judul: 'Bangun Ruang Sisi Datar', deskripsi: 'Kubus, balok, prisma, limas: luas & volume.', urutan: 37, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-br-m1', babId: 'smp8-mtk-bangun-ruang', judul: 'Luas Permukaan', konten: 'Kubus: 6s². Balok: 2(pl+pt+lt). Prisma segitiga: 2×luas alas + keliling alas × tinggi.', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-br-m2', babId: 'smp8-mtk-bangun-ruang', judul: 'Volume', konten: 'Kubus: s³. Balok: p×l×t. Prisma: luas alas × tinggi. Limas: 1/3 × luas alas × tinggi.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp8-br-s1', tipe: 'pilihan_ganda', pertanyaan: 'Volume kubus dengan rusuk 5 cm adalah ...', opsi: ['125 cm³', '150 cm³', '25 cm³'], kunciJawaban: '125 cm³', pembahasan: '5³ = 125.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-eko-pasar', judul: 'Pasar dan Terbentuknya Harga', deskripsi: 'Permintaan, penawaran, dan harga keseimbangan.', urutan: 38, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-eko-m1', babId: 'sma11-eko-pasar', judul: 'Hukum Permintaan-Penawaran', konten: 'Harga naik → permintaan turun, penawaran naik. Hukum permintaan: ceteris paribus.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-eko-m2', babId: 'sma11-eko-pasar', judul: 'Harga Keseimbangan', konten: 'Titik temu kurva permintaan & penawaran. Surplus bila harga di atas, kekurangan bila di bawah.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-eko-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bila harga naik, jumlah yang diminta akan ...', opsi: ['turun', 'naik', 'tetap'], kunciJawaban: 'turun', pembahasan: 'Hukum permintaan: harga naik → permintaan turun.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-mtk-pecahan', judul: 'Pecahan Senilai dan Sederhana', deskripsi: 'Menyederhanakan dan membandingkan pecahan.', urutan: 39, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pec-m1', babId: 'sd4-mtk-pecahan', judul: 'Pecahan Senilai', konten: '2/4 = 1/2. Kalikan/bagi pembilang & penyebut dengan angka sama.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-pec-m2', babId: 'sd4-mtk-pecahan', judul: 'Menyederhanakan', konten: 'Bagi dengan FPB. Contoh: 6/9 = 2/3 (bagi 3). Membandingkan: samakan penyebut dulu.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-pec-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bentuk sederhana dari 8/12 adalah ...', opsi: ['2/3', '4/6', '3/4'], kunciJawaban: '2/3', pembahasan: 'Bagi 4: 8/12 = 2/3.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-bindo-puisi', judul: 'Puisi Rakyat: Pantun dan Syair', deskripsi: 'Ciri pantun, syair, dan cara membuatnya.', urutan: 40, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-pui-m1', babId: 'smp8-bindo-puisi', judul: 'Pantun', konten: '4 baris: 2 sampiran + 2 isi. Rima a-b-a-b. Contoh: "Jalan-jalan ke kota Blitar / Jangan lupa membeli sukun / Rajin belajar pangkal pintar / Masa depan cerah menanti."', urutan: 1, estimasiMenit: 20 },
      { id: 'smp8-pui-m2', babId: 'smp8-bindo-puisi', judul: 'Syair & Gurindam', konten: 'Syair: 4 baris isi semua, rima a-a-a-a. Gurindam: 2 baris sebab-akibat. Contoh gurindam: "Barang siapa tiada memegang agama / Sekali-kali tiada boleh dibilangkan nama."', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-pui-s1', tipe: 'pilihan_ganda', pertanyaan: 'Baris 1-2 pantun disebut ...', opsi: ['sampiran', 'isi', 'rima'], kunciJawaban: 'sampiran', pembahasan: 'Sampiran = baris 1-2, isi = baris 3-4.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-bio-sistem-koord', judul: 'Sistem Koordinasi Manusia', deskripsi: 'Saraf, hormon, dan indera.', urutan: 41, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-bio-m1', babId: 'sma11-bio-sistem-koord', judul: 'Sistem Saraf', konten: 'Neuron: dendrit → badan sel → akson. Saraf pusat (otak & sumsum tulang belakang) vs tepi. Gerak refleks via sumsum.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-bio-m2', babId: 'sma11-bio-sistem-koord', judul: 'Hormon & Indera', konten: 'Kelenjar: tiroid, pankreas (insulin), adrenal. Indera: mata (retina), telinga (koklea), kulit, hidung, lidah.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-bio-s1', tipe: 'pilihan_ganda', pertanyaan: 'Hormon insulin dihasilkan oleh ...', opsi: ['pankreas', 'tiroid', 'adrenal'], kunciJawaban: 'pankreas', pembahasan: 'Sel beta pankreas menghasilkan insulin.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-peta', judul: 'Peta dan Arah Mata Angin', deskripsi: 'Membaca peta, simbol, dan skala.', urutan: 42, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-peta-m1', babId: 'sd4-ips-peta', judul: 'Unsur Peta', konten: 'Judul, legenda (simbol), skala, arah mata angin, garis lintang & bujur.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-peta-m2', babId: 'sd4-ips-peta', judul: 'Arah Mata Angin', konten: '8 arah: utara, timur laut, timur, tenggara, selatan, barat daya, barat, barat laut.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-peta-s1', tipe: 'pilihan_ganda', pertanyaan: 'Arah antara utara dan timur adalah ...', opsi: ['timur laut', 'tenggara', 'barat laut'], kunciJawaban: 'timur laut', pembahasan: 'Timur laut = antara utara & timur.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-mtk-himpunan', judul: 'Himpunan', deskripsi: 'Anggota himpunan, operasi, dan diagram Venn.', urutan: 43, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-him-m1', babId: 'smp7-mtk-himpunan', judul: 'Konsep Himpunan', konten: 'Himpunan = kumpulan objek jelas. Notasi: A = {1,2,3}. Anggota: ∈, bukan anggota: ∉.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-him-m2', babId: 'smp7-mtk-himpunan', judul: 'Operasi & Venn', konten: 'Irisan (∩), gabungan (∪), selisih. Diagram Venn memudahkan.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp7-him-s1', tipe: 'pilihan_ganda', pertanyaan: 'A={1,2,3}, B={2,3,4}. A ∩ B = ...', opsi: ['{2,3}', '{1,2,3,4}', '{1}'], kunciJawaban: '{2,3}', pembahasan: 'Irisan = anggota yang sama.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ipa-rantai-makanan', judul: 'Rantai Makanan & Jaring-Jaring Makanan', deskripsi: 'Produsen, konsumen, pengurai.', urutan: 44, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-rm-m1', babId: 'sd5-ipa-rantai-makanan', judul: 'Komponen', konten: 'Produsen (tumbuhan) → konsumen I (herbivora) → konsumen II (karnivora) → pengurai.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-rm-m2', babId: 'sd5-ipa-rantai-makanan', judul: 'Jaring-Jaring & Piramida', konten: 'Jaring = banyak rantai terhubung. Piramida energi: makin ke atas makin sedikit.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-rm-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tumbuhan berperan sebagai ...', opsi: ['produsen', 'konsumen', 'pengurai'], kunciJawaban: 'produsen', pembahasan: 'Tumbuhan membuat makanan sendiri = produsen.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-geo-litosfer', judul: 'Litosfer: Batuan dan Tenaga Bumi', deskripsi: 'Jenis batuan, tektonik lempeng, dan gempa.', urutan: 45, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-geo-m1', babId: 'sma10-geo-litosfer', judul: 'Batuan', konten: 'Beku (magma), sedimen (endapan), metamorf (tekanan/panas). Siklus batuan.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-geo-m2', babId: 'sma10-geo-litosfer', judul: 'Tektonik & Gempa', konten: 'Lempeng: divergen, konvergen, transform. Indonesia di 3 lempeng = rawan gempa.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma10-geo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Batuan dari pendinginan magma disebut ...', opsi: ['beku', 'sedimen', 'metamorf'], kunciJawaban: 'beku', pembahasan: 'Magma mendingin = batuan beku.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ipa-listrik-statis', judul: 'Listrik Statis', deskripsi: 'Muatan, gaya Coulomb, dan medan listrik.', urutan: 46, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-ls-m1', babId: 'smp9-ipa-listrik-statis', judul: 'Muatan Listrik', konten: 'Proton (+), elektron (-). Sejenis tolak, beda tarik. Penggaris digosok rambut menarik kertas.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-ls-m2', babId: 'smp9-ipa-listrik-statis', judul: 'Hukum Coulomb', konten: 'F = k·q1·q2/r². Makin jauh makin lemah. Petir = loncatan muatan raksasa.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'smp9-ls-s1', tipe: 'pilihan_ganda', pertanyaan: 'Dua muatan sejenis akan ...', opsi: ['tolak-menolak', 'tarik-menarik', 'netral'], kunciJawaban: 'tolak-menolak', pembahasan: 'Sejenis tolak, beda jenis tarik.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ipa-tata-surya', judul: 'Tata Surya', deskripsi: 'Planet, matahari, dan gerhana.', urutan: 47, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-ts-m1', babId: 'sd6-ipa-tata-surya', judul: 'Planet', konten: '8 planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus. Terbesar: Jupiter.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-ts-m2', babId: 'sd6-ipa-tata-surya', judul: 'Gerhana', konten: 'Gerhana matahari: bulan menutupi matahari. Gerhana bulan: bumi menutupi bulan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-ts-s1', tipe: 'pilihan_ganda', pertanyaan: 'Planet terdekat dari matahari adalah ...', opsi: ['Merkurius', 'Venus', 'Mars'], kunciJawaban: 'Merkurius', pembahasan: 'Urutan: Merkurius paling dekat.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fis-momentum', judul: 'Momentum dan Impuls', deskripsi: 'Hukum kekekalan momentum & tumbukan.', urutan: 48, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-mom-m1', babId: 'sma11-fis-momentum', judul: 'Momentum & Impuls', konten: 'p = m·v. Impuls I = F·Δt = Δp. Contoh: airbag memperpanjang Δt.', urutan: 1, estimasiMenit: 20 },
      { id: 'sma11-mom-m2', babId: 'sma11-fis-momentum', judul: 'Tumbukan', konten: 'Lenting sempurna (e=1), lenting sebagian, tidak lenting (e=0, menyatu).', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-mom-s1', tipe: 'pilihan_ganda', pertanyaan: 'Dua benda menempel setelah tumbukan: ...', opsi: ['tidak lenting', 'lenting sempurna', 'lenting sebagian'], kunciJawaban: 'tidak lenting', pembahasan: 'Menempel = tidak lenting sama sekali.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ips-asean', judul: 'ASEAN: Kerja Sama Asia Tenggara', deskripsi: 'Sejarah, tujuan, dan peran Indonesia di ASEAN.', urutan: 49, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-ase-m1', babId: 'smp8-ips-asean', judul: 'Sejarah ASEAN', konten: '8 Agustus 1967, Bangkok. 5 pendiri: Indonesia, Malaysia, Filipina, Singapura, Thailand. Kini 10 anggota.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-ase-m2', babId: 'smp8-ips-asean', judul: 'Kerja Sama', konten: 'Ekonomi (AFTA), sosial budaya (SEA Games), politik keamanan (ZOPFAN).', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-ase-s1', tipe: 'pilihan_ganda', pertanyaan: 'ASEAN didirikan tahun ...', opsi: ['1967', '1945', '1997'], kunciJawaban: '1967', pembahasan: 'Deklarasi Bangkok 8 Agustus 1967.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bindo-karangan', judul: 'Menulis Karangan Narasi', deskripsi: 'Unsur karangan & menulis pengalaman.', urutan: 50, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-kar-m1', babId: 'sd4-bindo-karangan', judul: 'Unsur Karangan', konten: 'Judul, pembuka, isi, penutup. Gunakan bahasa sendiri & runtut.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-kar-m2', babId: 'sd4-bindo-karangan', judul: 'Karangan Narasi', konten: 'Menceritakan kejadian: siapa, kapan, di mana, bagaimana. Contoh: pengalamanku berlibur.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sd4-kar-s1', tipe: 'pilihan_ganda', pertanyaan: 'Karangan yang menceritakan kejadian disebut ...', opsi: ['narasi', 'deskripsi', 'argumentasi'], kunciJawaban: 'narasi', pembahasan: 'Narasi = cerita kejadian.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-kimia-polimer', judul: 'Polimer', deskripsi: 'Jenis polimer & kegunaannya.', urutan: 51, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-pol-m1', babId: 'sma12-kimia-polimer', judul: 'Jenis Polimer', konten: 'Alam: protein, selulosa, karet. Sintetis: plastik (PE, PVC), nilon, teflon.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-pol-m2', babId: 'sma12-kimia-polimer', judul: 'Plastik & Lingkungan', konten: 'Plastik sulit terurai. Solusi: reduce, reuse, recycle, biodegradable.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-pol-s1', tipe: 'pilihan_ganda', pertanyaan: 'Contoh polimer alam adalah ...', opsi: ['protein', 'PVC', 'nilon'], kunciJawaban: 'protein', pembahasan: 'Protein & selulosa = polimer alam.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ips-peta-asean', judul: 'Peta ASEAN', deskripsi: 'Letak & kondisi geografis negara ASEAN.', urutan: 52, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-pa-m1', babId: 'smp7-ips-peta-asean', judul: 'Letak Geografis', konten: 'ASEAN: 6°LU - 11°LS, 95°BT - 141°BT. Iklim tropis. Indonesia = negara kepulauan terbesar.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-pa-m2', babId: 'smp7-ips-peta-asean', judul: 'Kondisi Alam', konten: 'Gunung api (cincin api), hutan hujan tropis, laut kaya. Sumber daya: tambang, pertanian, perikanan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-pa-s1', tipe: 'pilihan_ganda', pertanyaan: 'Iklim negara-negara ASEAN adalah ...', opsi: ['tropis', 'subtropis', 'dingin'], kunciJawaban: 'tropis', pembahasan: 'ASEAN di sekitar khatulistiwa = tropis.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-bio-virus', judul: 'Virus', deskripsi: 'Ciri virus, replikasi, & peran.', urutan: 53, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-vir-m1', babId: 'sma10-bio-virus', judul: 'Ciri Virus', konten: 'Bukan sel: hanya asam nukleat + kapsid. Hidup hanya di inang. Contoh: influenza, corona.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-vir-m2', babId: 'sma10-bio-virus', judul: 'Replikasi & Peran', konten: 'Litik (hancurkan sel) vs lisogenik (menyatu). Peran: vaksin, terapi gen.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-vir-s1', tipe: 'pilihan_ganda', pertanyaan: 'Virus tersusun dari ...', opsi: ['asam nukleat + kapsid', 'sel lengkap', 'kloroplas'], kunciJawaban: 'asam nukleat + kapsid', pembahasan: 'Virus bukan sel.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-bindo-teks-laporan', judul: 'Teks Laporan Hasil Observasi', deskripsi: 'Struktur & kaidah teks LHO.', urutan: 54, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-lho-m1', babId: 'smp9-bindo-teks-laporan', judul: 'Struktur', konten: 'Definisi umum → deskripsi bagian → deskripsi manfaat. Bahasa objektif & baku.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-lho-m2', babId: 'smp9-bindo-teks-laporan', judul: 'Kaidah', konten: 'Kata kerja, konjungsi, istilah teknis. Contoh: laporan observasi kantin sekolah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-lho-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian awal teks LHO adalah ...', opsi: ['definisi umum', 'penutup', 'simpulan'], kunciJawaban: 'definisi umum', pembahasan: 'Struktur: definisi umum dulu.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-bindo-iklan', judul: 'Iklan', deskripsi: 'Unsur & bahasa iklan.', urutan: 55, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-ikl-m1', babId: 'sd5-bindo-iklan', judul: 'Unsur Iklan', konten: 'Gambar menarik, slogan, nama produk, keunggulan. Contoh slogan: "Segar alami!"', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-ikl-m2', babId: 'sd5-bindo-iklan', judul: 'Bahasa Iklan', konten: 'Persuasif, singkat, positif. Hindari berbohong.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-ikl-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tujuan iklan adalah ...', opsi: ['mempengaruhi pembeli', 'menghibur', 'melapor'], kunciJawaban: 'mempengaruhi pembeli', pembahasan: 'Iklan bersifat persuasif.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-kimia-larutan', judul: 'Larutan', deskripsi: 'Konsentrasi & sifat koligatif.', urutan: 56, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-lar-m1', babId: 'sma11-kimia-larutan', judul: 'Konsentrasi', konten: 'Molaritas (M) = mol/L. Contoh: 1 M NaCl = 58,5 g/L.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-lar-m2', babId: 'sma11-kimia-larutan', judul: 'Sifat Koligatif', konten: 'Penurunan titik beku, kenaikan titik didih, tekanan osmosis. Contoh: antibeku radiator.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'sma11-lar-s1', tipe: 'pilihan_ganda', pertanyaan: 'Satuan molaritas adalah ...', opsi: ['mol/L', 'gram', 'liter'], kunciJawaban: 'mol/L', pembahasan: 'M = mol zat / liter larutan.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-mtk-teorema-pythagoras', judul: 'Teorema Pythagoras', deskripsi: 'a² + b² = c² & tripel Pythagoras.', urutan: 57, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-pyt-m1', babId: 'smp8-mtk-teorema-pythagoras', judul: 'Teorema', konten: 'Segitiga siku-siku: c² = a² + b². c = sisi miring.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-pyt-m2', babId: 'smp8-mtk-teorema-pythagoras', judul: 'Tripel Pythagoras', konten: '3-4-5, 5-12-13, 7-24-25, 8-15-17. Hafalkan untuk cepat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-pyt-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sisi siku 6 & 8, sisi miring = ...', opsi: ['10', '14', '12'], kunciJawaban: '10', pembahasan: '√(36+64) = √100 = 10.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ips-asean-negara', judul: 'Negara-Negara ASEAN', deskripsi: 'Profil 10 negara anggota ASEAN.', urutan: 58, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-ana-m1', babId: 'sd6-ips-asean-negara', judul: '10 Anggota', konten: 'Indonesia, Malaysia, Singapura, Thailand, Filipina, Brunei, Vietnam, Laos, Myanmar, Kamboja.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-ana-m2', babId: 'sd6-ips-asean-negara', judul: 'Ciri Khas', konten: 'Ibukota & ciri: Jakarta, Kuala Lumpur, Singapura, Bangkok, Manila, Bandar Seri Begawan, Hanoi, Vientiane, Naypyidaw, Phnom Penh.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-ana-s1', tipe: 'pilihan_ganda', pertanyaan: 'Ibukota Thailand adalah ...', opsi: ['Bangkok', 'Hanoi', 'Manila'], kunciJawaban: 'Bangkok', pembahasan: 'Bangkok = ibukota Thailand.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-bio-evolusi', judul: 'Evolusi', deskripsi: 'Teori evolusi & bukti-buktinya.', urutan: 59, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-evo-m1', babId: 'sma12-bio-evolusi', judul: 'Teori Darwin', konten: 'Seleksi alam: individu adaptif bertahan & mewariskan sifat. Contoh: ngengat Biston betularia.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-evo-m2', babId: 'sma12-bio-evolusi', judul: 'Bukti Evolusi', konten: 'Fosil, homologi organ, embriologi, DNA. Contoh: sayap kelelawar vs tangan manusia.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-evo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Mekanisme utama evolusi menurut Darwin adalah ...', opsi: ['seleksi alam', 'mutasi buatan', 'hibridisasi'], kunciJawaban: 'seleksi alam', pembahasan: 'Seleksi alam memilih individu paling adaptif.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ipa-bioteknologi', judul: 'Bioteknologi', deskripsi: 'Konvensional & modern.', urutan: 60, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-biom-m1', babId: 'smp9-ipa-bioteknologi', judul: 'Konvensional', konten: 'Fermentasi: tempe, tape, yoghurt. Enzim & mikroba.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-biom-m2', babId: 'smp9-ipa-bioteknologi', judul: 'Modern', konten: 'Rekayasa genetika, kloning, kultur jaringan. Contoh: insulin rekombinan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-biom-s1', tipe: 'pilihan_ganda', pertanyaan: 'Contoh bioteknologi konvensional adalah ...', opsi: ['tempe', 'kloning', 'transgenik'], kunciJawaban: 'tempe', pembahasan: 'Tempe = fermentasi mikroba.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-pkn-simbol-pancasila', judul: 'Simbol Pancasila', deskripsi: 'Lima sila & lambangnya.', urutan: 61, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-spm-m1', babId: 'sd4-pkn-simbol-pancasila', judul: 'Lima Simbol', konten: 'Bintang, rantai, beringin, banteng, padi-kapas. Hafalkan urutannya.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-spm-m2', babId: 'sd4-pkn-simbol-pancasila', judul: 'Makna', konten: 'Bintang = Ketuhanan, rantai = kemanusiaan, beringin = persatuan, banteng = kerakyatan, padi-kapas = keadilan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-spm-s1', tipe: 'pilihan_ganda', pertanyaan: 'Simbol sila ke-3 adalah ...', opsi: ['beringin', 'banteng', 'bintang'], kunciJawaban: 'beringin', pembahasan: 'Beringin = persatuan Indonesia.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-sejarah-orde-baru', judul: 'Orde Baru', deskripsi: '1966-1998: pembangunan & otoritarianisme.', urutan: 62, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-orb-m1', babId: 'sma10-sejarah-orde-baru', judul: 'Lahirnya', konten: 'Supersemar 1966 → Soeharto presiden 1968. Fokus stabilitas & pembangunan.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-orb-m2', babId: 'sma10-sejarah-orde-baru', judul: 'Dua Sisi', konten: 'Pertumbuhan ekonomi tinggi, tapi KKN & pembungkaman. Runtuh 1998.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-orb-s1', tipe: 'pilihan_ganda', pertanyaan: 'Orde Baru berkuasa tahun ...', opsi: ['1966-1998', '1945-1965', '1998-2004'], kunciJawaban: '1966-1998', pembahasan: '32 tahun di bawah Soeharto.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ips-peta', judul: 'Peta', deskripsi: 'Unsur peta & membaca peta.', urutan: 63, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-pet-m1', babId: 'smp7-ips-peta', judul: 'Unsur Peta', konten: 'Judul, legenda, skala, orientasi, simbol. Tanpa unsur = bukan peta.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-pet-m2', babId: 'smp7-ips-peta', judul: 'Skala', konten: 'Skala 1:100.000 = 1 cm : 1 km. Hitung jarak sebenarnya.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-pet-s1', tipe: 'pilihan_ganda', pertanyaan: 'Jarak di peta 5 cm, skala 1:200.000. Jarak sebenarnya ...', opsi: ['10 km', '1 km', '100 km'], kunciJawaban: '10 km', pembahasan: '5 × 200.000 cm = 1.000.000 cm = 10 km.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fisika-fluida', judul: 'Fluida', deskripsi: 'Statis & dinamis: tekanan, Bernoulli.', urutan: 64, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-flu-m1', babId: 'sma11-fisika-fluida', judul: 'Fluida Statis', konten: 'Tekanan hidrostatis P = ρgh. Archimedes: gaya apung = berat fluida dipindahkan.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-flu-m2', babId: 'sma11-fisika-fluida', judul: 'Fluida Dinamis', konten: 'Kontinuitas A1v1 = A2v2. Bernoulli: tekanan turun saat kecepatan naik.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-flu-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kapal bisa mengapung karena ...', opsi: ['gaya Archimedes', 'gravitasi nol', 'magnet'], kunciJawaban: 'gaya Archimedes', pembahasan: 'Gaya apung menyeimbangkan berat kapal.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-matematika-bangun-datar', judul: 'Bangun Datar', deskripsi: 'Luas & keliling.', urutan: 65, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-bd-m1', babId: 'sd5-matematika-bangun-datar', judul: 'Luas', konten: 'Persegi s², persegi panjang p×l, segitiga ½×a×t, lingkaran πr².', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-bd-m2', babId: 'sd5-matematika-bangun-datar', judul: 'Keliling', konten: 'Jumlah semua sisi. Lingkaran: 2πr.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-bd-s1', tipe: 'pilihan_ganda', pertanyaan: 'Luas persegi sisi 7 cm adalah ...', opsi: ['49 cm²', '28 cm²', '14 cm²'], kunciJawaban: '49 cm²', pembahasan: '7 × 7 = 49.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-bindo-teks-eksposisi', judul: 'Teks Eksposisi', deskripsi: 'Struktur & kaidah.', urutan: 66, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-eks-m1', babId: 'smp8-bindo-teks-eksposisi', judul: 'Struktur', konten: 'Tesis - argumen - penegasan ulang. Contoh tesis: "Sampah plastik harus dikurangi."', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-eks-m2', babId: 'smp8-bindo-teks-eksposisi', judul: 'Kaidah', konten: 'Kata teknis, konjungsi kausalitas, pronomina. Fakta > opini.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-eks-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian pembuka teks eksposisi adalah ...', opsi: ['tesis', 'orientasi', 'koda'], kunciJawaban: 'tesis', pembahasan: 'Tesis = pendapat awal penulis.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-kimia-polimer', judul: 'Polimer', deskripsi: 'Alami, sintetik, & daur ulang plastik.', urutan: 67, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-pol-m1', babId: 'sma12-kimia-polimer', judul: 'Jenis Polimer', konten: 'Alami: protein, selulosa. Sintetik: plastik, nilon. Termoplastik vs termoset.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-pol-m2', babId: 'sma12-kimia-polimer', judul: 'Kode Daur Ulang', konten: 'Kode 1-7: PET, HDPE, PVC, dst. Kode 1,2,4,5 umumnya aman & bisa didaur ulang.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-pol-s1', tipe: 'pilihan_ganda', pertanyaan: 'Contoh polimer alami adalah ...', opsi: ['protein', 'plastik', 'nilon'], kunciJawaban: 'protein', pembahasan: 'Protein disintesis makhluk hidup.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-matematika-bangun-ruang', judul: 'Bangun Ruang', deskripsi: 'Volume kubus, balok, tabung.', urutan: 68, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-br-m1', babId: 'sd6-matematika-bangun-ruang', judul: 'Kubus & Balok', konten: 'Volume kubus s³, balok p×l×t. Contoh: kubus 5 cm = 125 cm³.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-br-m2', babId: 'sd6-matematika-bangun-ruang', judul: 'Tabung', konten: 'Volume = πr²t. Contoh: r=7, t=10 → 1540 cm³.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-br-s1', tipe: 'pilihan_ganda', pertanyaan: 'Volume balok 4×3×2 adalah ...', opsi: ['24', '18', '12'], kunciJawaban: '24', pembahasan: '4 × 3 × 2 = 24.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-bindo-teks-tanggapan', judul: 'Teks Tanggapan', deskripsi: 'Struktur & kaidah tanggapan kritis.', urutan: 69, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-tg-m1', babId: 'smp9-bindo-teks-tanggapan', judul: 'Struktur', konten: 'Evaluasi - deskripsi teks - penegasan ulang. Contoh: tanggapan terhadap cerpen.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-tg-m2', babId: 'smp9-bindo-teks-tanggapan', judul: 'Kaidah', konten: 'Kata sifat sikap, kata kerja mental, konjungsi. Kritik membangun, bukan menyerang.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-tg-s1', tipe: 'pilihan_ganda', pertanyaan: 'Teks tanggapan berisi ...', opsi: ['penilaian kritis', 'dongeng', 'prosedur'], kunciJawaban: 'penilaian kritis', pembahasan: 'Tanggapan = evaluasi terhadap karya.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-bindo-teks-negosiasi', judul: 'Teks Negosiasi', deskripsi: 'Struktur & strategi negosiasi.', urutan: 70, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-neg-m1', babId: 'sma10-bindo-teks-negosiasi', judul: 'Struktur', konten: 'Orientasi - pengajuan - penawaran - persetujuan. Contoh: tawar-menawar di pasar.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-neg-m2', babId: 'sma10-bindo-teks-negosiasi', judul: 'Strategi', konten: 'BATNA, win-win, jangan terima tawaran pertama. Bahasa sopan & tegas.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-neg-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tujuan negosiasi adalah ...', opsi: ['kesepakatan menguntungkan bersama', 'menang sendiri', 'mengalah total'], kunciJawaban: 'kesepakatan menguntungkan bersama', pembahasan: 'Negosiasi ideal = win-win.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ipa-rantai-makanan', judul: 'Rantai Makanan', deskripsi: 'Produsen, konsumen, pengurai.', urutan: 71, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-rm-m1', babId: 'sd4-ipa-rantai-makanan', judul: 'Komponen', konten: 'Produsen (tumbuhan) → konsumen I (herbivora) → konsumen II → pengurai.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-rm-m2', babId: 'sd4-ipa-rantai-makanan', judul: 'Contoh', konten: 'Padi → belalang → katak → ular → elang. Jaring-jaring makanan = gabungan rantai.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-rm-s1', tipe: 'pilihan_ganda', pertanyaan: 'Produsen dalam rantai makanan adalah ...', opsi: ['tumbuhan', 'hewan', 'jamur'], kunciJawaban: 'tumbuhan', pembahasan: 'Tumbuhan berfotosintesis.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-bindo-teks-prosedur', judul: 'Teks Prosedur', deskripsi: 'Struktur & kaidah prosedur kompleks.', urutan: 72, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-pro-m1', babId: 'sma11-bindo-teks-prosedur', judul: 'Struktur', konten: 'Tujuan - material - langkah. Imperatif & urutan logis.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-pro-m2', babId: 'sma11-bindo-teks-prosedur', judul: 'Kaidah', konten: 'Konjungsi temporal, kata kerja imperatif, bilangan urutan. Jelas & tidak ambigu.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-pro-s1', tipe: 'pilihan_ganda', pertanyaan: 'Ciri teks prosedur adalah ...', opsi: ['langkah berurutan', 'opini penulis', 'tokoh fiksi'], kunciJawaban: 'langkah berurutan', pembahasan: 'Prosedur = cara melakukan sesuatu.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-mtk-bilangan-bulat', judul: 'Bilangan Bulat', deskripsi: 'Operasi & sifat bilangan bulat.', urutan: 73, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-bb-m1', babId: 'smp7-mtk-bilangan-bulat', judul: 'Operasi', konten: 'Negatif × negatif = positif. Contoh: (-3) × (-4) = 12.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-bb-m2', babId: 'smp7-mtk-bilangan-bulat', judul: 'Sifat', konten: 'Komutatif, asosiatif, distributif. Urutan: kurung, kali/bagi, tambah/kurang.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-bb-s1', tipe: 'pilihan_ganda', pertanyaan: 'Hasil (-5) + 8 adalah ...', opsi: ['3', '-3', '13'], kunciJawaban: '3', pembahasan: '8 − 5 = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ips-kerajaan-hindu', judul: 'Kerajaan Hindu-Buddha', deskripsi: 'Kutai, Tarumanegara, Sriwijaya, Majapahit.', urutan: 74, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-khb-m1', babId: 'sd5-ips-kerajaan-hindu', judul: 'Kerajaan Besar', konten: 'Kutai (tertua), Tarumanegara, Sriwijaya (maritim), Majapahit (terbesar).', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-khb-m2', babId: 'sd5-ips-kerajaan-hindu', judul: 'Peninggalan', konten: 'Candi Borobudur, Prambanan, prasasti Yupa.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-khb-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kerajaan tertua di Indonesia adalah ...', opsi: ['Kutai', 'Majapahit', 'Sriwijaya'], kunciJawaban: 'Kutai', pembahasan: 'Abad ke-4 di Kalimantan Timur.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-mtk-statistika', judul: 'Statistika', deskripsi: 'Mean, median, modus, & sebaran data.', urutan: 75, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-st-m1', babId: 'sma12-mtk-statistika', judul: 'Ukuran Pemusatan', konten: 'Mean = rata-rata, median = tengah, modus = terbanyak.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-st-m2', babId: 'sma12-mtk-statistika', judul: 'Sebaran', konten: 'Jangkauan, simpangan baku. Data berkelompok pakai titik tengah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-st-s1', tipe: 'pilihan_ganda', pertanyaan: 'Median dari 3, 5, 7, 9, 11 adalah ...', opsi: ['7', '5', '9'], kunciJawaban: '7', pembahasan: 'Nilai tengah.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ipa-tata-surya', judul: 'Tata Surya', deskripsi: 'Planet, matahari, & gerak benda langit.', urutan: 76, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-ts-m1', babId: 'sd6-ipa-tata-surya', judul: 'Planet', konten: '8 planet. Bumi urutan 3. Terdekat: Merkurius, terjauh: Neptunus.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-ts-m2', babId: 'sd6-ipa-tata-surya', judul: 'Gerak', konten: 'Rotasi = siang-malam (24 jam). Revolusi = tahun (365 hari).', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-ts-s1', tipe: 'pilihan_ganda', pertanyaan: 'Planet terdekat dari matahari adalah ...', opsi: ['Merkurius', 'Venus', 'Mars'], kunciJawaban: 'Merkurius', pembahasan: 'Urutan pertama.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ipa-sistem-ger', judul: 'Sistem Gerak Manusia', deskripsi: 'Tulang, otot, & sendi.', urutan: 77, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-sg-m1', babId: 'smp8-ipa-sistem-ger', judul: 'Tulang', konten: '206 tulang. Fungsi: penopang, pelindung, pembentuk sel darah.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-sg-m2', babId: 'smp8-ipa-sistem-ger', judul: 'Otot & Sendi', konten: 'Otot lurik, polos, jantung. Sendi: engsel, peluru, putar.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-sg-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sendi lutut termasuk sendi ...', opsi: ['engsel', 'peluru', 'putar'], kunciJawaban: 'engsel', pembahasan: 'Hanya satu arah.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-kimia-ikatan', judul: 'Ikatan Kimia', deskripsi: 'Ion, kovalen, & logam.', urutan: 78, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-ik-m1', babId: 'sma10-kimia-ikatan', judul: 'Jenis Ikatan', konten: 'Ion: serah terima elektron. Kovalen: berbagi. Logam: lautan elektron.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-ik-m2', babId: 'sma10-kimia-ikatan', judul: 'Sifat', konten: 'Ion: titik leleh tinggi, hantar listrik (leleh/larutan). Kovalen: rendah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-ik-s1', tipe: 'pilihan_ganda', pertanyaan: 'NaCl berikatan ...', opsi: ['ion', 'kovalen', 'logam'], kunciJawaban: 'ion', pembahasan: 'Logam + nonlogam.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fisika-gelombang', judul: 'Gelombang', deskripsi: 'Jenis, sifat, & persamaan gelombang.', urutan: 79, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-gel-m1', babId: 'sma11-fisika-gelombang', judul: 'Jenis', konten: 'Transversal (cahaya) vs longitudinal (bunyi). v = λ × f.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-gel-m2', babId: 'sma11-fisika-gelombang', judul: 'Sifat', konten: 'Refleksi, refraksi, difraksi, interferensi.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-gel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Gelombang bunyi termasuk ...', opsi: ['longitudinal', 'transversal', 'elektromagnetik'], kunciJawaban: 'longitudinal', pembahasan: 'Arah getar sejajar rambat.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-bindo-teks-diskusi', judul: 'Teks Diskusi', deskripsi: 'Pro-kontra isu & simpulan.', urutan: 80, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-td-m1', babId: 'smp9-bindo-teks-diskusi', judul: 'Struktur', konten: 'Isu - argumen pro - argumen kontra - simpulan.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-td-m2', babId: 'smp9-bindo-teks-diskusi', judul: 'Kaidah', konten: 'Konjungsi pertentangan, modalitas, kata rujukan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-td-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian akhir teks diskusi adalah ...', opsi: ['simpulan', 'isu', 'argumen pro'], kunciJawaban: 'simpulan', pembahasan: 'Simpulan menutup diskusi.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-bindo-karya-ilmiah', judul: 'Karya Ilmiah', deskripsi: 'Struktur & penulisan karya ilmiah.', urutan: 81, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-ki-m1', babId: 'sma12-bindo-karya-ilmiah', judul: 'Struktur', konten: 'Pendahuluan - tinjauan pustaka - metode - hasil - simpulan - daftar pustaka.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-ki-m2', babId: 'sma12-bindo-karya-ilmiah', judul: 'Kaidah', konten: 'Bahasa baku, sitasi APA, hindari plagiarisme.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-ki-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bagian yang berisi rumusan masalah adalah ...', opsi: ['pendahuluan', 'simpulan', 'daftar pustaka'], kunciJawaban: 'pendahuluan', pembahasan: 'Latar belakang & rumusan di pendahuluan.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bindo-puisi', judul: 'Puisi Anak', deskripsi: 'Membaca & menulis puisi sederhana.', urutan: 82, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pu-m1', babId: 'sd4-bindo-puisi', judul: 'Ciri Puisi', konten: 'Bait, baris, rima, & bahasa kiasan.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-pu-m2', babId: 'sd4-bindo-puisi', judul: 'Menulis', konten: 'Pilih tema, gunakan kata indah, baca dengan ekspresi.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-pu-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kumpulan baris dalam puisi disebut ...', opsi: ['bait', 'paragraf', 'bab'], kunciJawaban: 'bait', pembahasan: 'Bait = kumpulan baris.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ips-peta', judul: 'Peta & Komponennya', deskripsi: 'Membaca peta, skala, & simbol.', urutan: 83, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-peta-m1', babId: 'smp7-ips-peta', judul: 'Komponen', konten: 'Judul, legenda, skala, orientasi, garis lintang-bujur.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-peta-m2', babId: 'smp7-ips-peta', judul: 'Skala', konten: 'Skala 1:50.000 = 1 cm : 500 m. Hitung jarak sebenarnya.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-peta-s1', tipe: 'pilihan_ganda', pertanyaan: 'Jarak 4 cm di peta 1:50.000 = ...', opsi: ['2 km', '200 m', '20 km'], kunciJawaban: '2 km', pembahasan: '4 × 500 m = 2000 m.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-mtk-pecahan', judul: 'Pecahan', deskripsi: 'Operasi pecahan & desimal.', urutan: 84, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-pec-m1', babId: 'sd5-mtk-pecahan', judul: 'Operasi', konten: 'Samakan penyebut untuk tambah/kurang. Kali: pembilang × pembilang.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-pec-m2', babId: 'sd5-mtk-pecahan', judul: 'Desimal & Persen', konten: '1/2 = 0,5 = 50%. Ubah pecahan ke desimal dengan pembagian.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-pec-s1', tipe: 'pilihan_ganda', pertanyaan: '1/2 + 1/4 = ...', opsi: ['3/4', '2/6', '1/4'], kunciJawaban: '3/4', pembahasan: 'Samakan penyebut 4.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-bindo-laporan', judul: 'Teks Laporan Hasil Observasi', deskripsi: 'Struktur & kaidah laporan observasi.', urutan: 85, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-lho-m1', babId: 'sma10-bindo-laporan', judul: 'Struktur', konten: 'Definisi umum - deskripsi bagian - deskripsi manfaat.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-lho-m2', babId: 'sma10-bindo-laporan', judul: 'Kaidah', konten: 'Istilah ilmiah, kalimat definisi, kata kerja kopula.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-lho-s1', tipe: 'pilihan_ganda', pertanyaan: 'Teks LHO bersifat ...', opsi: ['objektif & faktual', 'subjektif', 'fiksi'], kunciJawaban: 'objektif & faktual', pembahasan: 'Berdasarkan observasi nyata.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-mtk-teorema-pyth', judul: 'Teorema Pythagoras', deskripsi: 'a² + b² = c² & tripel.', urutan: 86, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-pyt-m1', babId: 'smp8-mtk-teorema-pyth', judul: 'Teorema', konten: 'Segitiga siku-siku: c² = a² + b². c = sisi miring.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-pyt-m2', babId: 'smp8-mtk-teorema-pyth', judul: 'Tripel', konten: '3-4-5, 5-12-13, 7-24-25. Kebalikan: cek siku-siku.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-pyt-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sisi miring segitiga 6 & 8 adalah ...', opsi: ['10', '12', '14'], kunciJawaban: '10', pembahasan: '√(36+64) = 10.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-kimia-larutan', judul: 'Larutan', deskripsi: 'Konsentrasi, pH, & titrasi.', urutan: 87, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-lar-m1', babId: 'sma11-kimia-larutan', judul: 'Konsentrasi', konten: 'Molaritas = mol/L. Pengenceran: M1V1 = M2V2.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-lar-m2', babId: 'sma11-kimia-larutan', judul: 'pH', konten: 'pH = -log[H+]. Asam <7, basa >7.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-lar-s1', tipe: 'pilihan_ganda', pertanyaan: 'pH larutan dengan [H+] = 10^-3 adalah ...', opsi: ['3', '11', '7'], kunciJawaban: '3', pembahasan: 'pH = -log(10^-3) = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ips-asean', judul: 'ASEAN', deskripsi: 'Negara anggota & kerja sama.', urutan: 88, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-ase-m1', babId: 'sd6-ips-asean', judul: 'Anggota', konten: '10 negara Asia Tenggara. Berdiri 1967 di Bangkok.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-ase-m2', babId: 'sd6-ips-asean', judul: 'Kerja Sama', konten: 'Ekonomi (AFTA), sosial budaya (SEA Games), politik.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-ase-s1', tipe: 'pilihan_ganda', pertanyaan: 'ASEAN berdiri tahun ...', opsi: ['1967', '1945', '1998'], kunciJawaban: '1967', pembahasan: 'Deklarasi Bangkok.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ipa-listrik', judul: 'Listrik Dinamis', deskripsi: 'Arus, tegangan, & hukum Ohm.', urutan: 89, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-ld-m1', babId: 'smp9-ipa-listrik', judul: 'Hukum Ohm', konten: 'V = I × R. Arus = tegangan ÷ hambatan.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-ld-m2', babId: 'smp9-ipa-listrik', judul: 'Rangkaian', konten: 'Seri: arus sama. Paralel: tegangan sama.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-ld-s1', tipe: 'pilihan_ganda', pertanyaan: 'Arus bila V=12V, R=4Ω adalah ...', opsi: ['3A', '48A', '16A'], kunciJawaban: '3A', pembahasan: 'I = 12/4 = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-mtk-limit', judul: 'Limit Fungsi', deskripsi: 'Konsep limit & sifatnya.', urutan: 90, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-lim-m1', babId: 'sma12-mtk-limit', judul: 'Definisi', konten: 'Limit = nilai pendekatan. lim x→a f(x).', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-lim-m2', babId: 'sma12-mtk-limit', judul: 'Bentuk Tak Tentu', konten: '0/0: faktorkan / L Hopital.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-lim-s1', tipe: 'pilihan_ganda', pertanyaan: 'lim x→2 (x²-4)/(x-2) = ...', opsi: ['4', '0', '2'], kunciJawaban: '4', pembahasan: 'Faktorkan: (x-2)(x+2)/(x-2) = x+2 = 4.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-bio-sel', judul: 'Sel', deskripsi: 'Organel & fungsinya.', urutan: 91, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-sel-m1', babId: 'sma10-bio-sel', judul: 'Organel', konten: 'Nukleus, mitokondria, kloroplas, ribosom.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-sel-m2', babId: 'sma10-bio-sel', judul: 'Transport', konten: 'Difusi, osmosis, transpor aktif.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-sel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Organel penghasil energi adalah ...', opsi: ['Mitokondria', 'Nukleus', 'Ribosom'], kunciJawaban: 'Mitokondria', pembahasan: 'Respirasi sel di mitokondria.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ipa-gaya', judul: 'Gaya', deskripsi: 'Macam gaya & pengaruhnya.', urutan: 92, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-gay-m1', babId: 'sd5-ipa-gaya', judul: 'Macam Gaya', konten: 'Otot, gesek, magnet, gravitasi, pegas.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-gay-m2', babId: 'sd5-ipa-gaya', judul: 'Pengaruh', konten: 'Menggerakkan, menghentikan, mengubah bentuk & arah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-gay-s1', tipe: 'pilihan_ganda', pertanyaan: 'Gaya yang membuat apel jatuh adalah ...', opsi: ['Gravitasi', 'Magnet', 'Gesek'], kunciJawaban: 'Gravitasi', pembahasan: 'Gravitasi bumi menarik benda.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ips-peta', judul: 'Peta', deskripsi: 'Komponen & membaca peta.', urutan: 93, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-pet-m1', babId: 'smp7-ips-peta', judul: 'Komponen', konten: 'Judul, legenda, skala, mata angin, simbol.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-pet-m2', babId: 'smp7-ips-peta', judul: 'Skala', konten: 'Skala 1:100.000 → 1 cm = 1 km.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-pet-s1', tipe: 'pilihan_ganda', pertanyaan: 'Jarak 5 cm pada peta skala 1:200.000 = ... km', opsi: ['10', '5', '20'], kunciJawaban: '10', pembahasan: '5 × 200.000 = 1.000.000 cm = 10 km.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fis-gelombang', judul: 'Gelombang', deskripsi: 'Jenis, cepat rambat, & bunyi.', urutan: 94, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-gel-m1', babId: 'sma11-fis-gelombang', judul: 'Jenis', konten: 'Transversal & longitudinal. v = λ × f.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-gel-m2', babId: 'sma11-fis-gelombang', judul: 'Bunyi', konten: 'Infrasonik <20 Hz, audiosonik, ultrasonik >20 kHz.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-gel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Cepat rambat bila λ=2m, f=50Hz adalah ...', opsi: ['100 m/s', '25 m/s', '52 m/s'], kunciJawaban: '100 m/s', pembahasan: 'v = 2 × 50 = 100.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-bio-genetika', judul: 'Genetika', deskripsi: 'Pewarisan sifat Mendel.', urutan: 95, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-gen-m1', babId: 'sma12-bio-genetika', judul: 'Hukum Mendel', konten: 'Dominan vs resesif. Papan Punnett.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-gen-m2', babId: 'sma12-bio-genetika', judul: 'DNA', konten: 'Replikasi, transkripsi, translasi.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-gen-s1', tipe: 'pilihan_ganda', pertanyaan: 'Persilangan Aa × Aa menghasilkan rasio ...', opsi: ['3:1', '1:1', '1:2:1'], kunciJawaban: '3:1', pembahasan: 'Fenotip dominan:resesif = 3:1.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-mtk-pecahan', judul: 'Pecahan', deskripsi: 'Mengenal & membandingkan pecahan.', urutan: 96, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pec-m1', babId: 'sd4-mtk-pecahan', judul: 'Konsep', konten: '1/2, 1/3, 1/4. Pembilang & penyebut.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-pec-m2', babId: 'sd4-mtk-pecahan', judul: 'Banding', konten: 'Penyebut sama: pembilang besar menang.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-pec-s1', tipe: 'pilihan_ganda', pertanyaan: 'Yang terbesar dari 1/2, 1/3, 1/4 adalah ...', opsi: ['1/2', '1/3', '1/4'], kunciJawaban: '1/2', pembahasan: 'Potongan setengah paling besar.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ips-kolonial', judul: 'Kolonialisme', deskripsi: 'Kedatangan bangsa Eropa.', urutan: 97, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-kol-m1', babId: 'smp8-ips-kolonial', judul: 'Kedatangan', konten: 'Portugis 1511, Belanda VOC 1602.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-kol-m2', babId: 'smp8-ips-kolonial', judul: 'Perlawanan', konten: 'Diponegoro, Imam Bonjol, Cut Nyak Dien.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-kol-s1', tipe: 'pilihan_ganda', pertanyaan: 'VOC berdiri tahun ...', opsi: ['1602', '1511', '1945'], kunciJawaban: '1602', pembahasan: 'Vereenigde Oostindische Compagnie.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-eko-pasar', judul: 'Pasar', deskripsi: 'Struktur pasar & keseimbangan.', urutan: 98, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-pas-m1', babId: 'sma10-eko-pasar', judul: 'Struktur', konten: 'Sempurna, monopoli, oligopoli, monopolistik.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-pas-m2', babId: 'sma10-eko-pasar', judul: 'Keseimbangan', konten: 'Titik temu demand & supply = harga pasar.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-pas-s1', tipe: 'pilihan_ganda', pertanyaan: 'Satu penjual menguasai pasar disebut ...', opsi: ['Monopoli', 'Oligopoli', 'Sempurna'], kunciJawaban: 'Monopoli', pembahasan: 'Mono = satu.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ipa-tata-surya', judul: 'Tata Surya', deskripsi: 'Planet & gerakannya.', urutan: 99, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-tas-m1', babId: 'sd6-ipa-tata-surya', judul: 'Planet', konten: '8 planet. Bumi planet ke-3.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-tas-m2', babId: 'sd6-ipa-tata-surya', judul: 'Gerakan', konten: 'Rotasi = siang malam. Revolusi = tahun.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-tas-s1', tipe: 'pilihan_ganda', pertanyaan: 'Planet terdekat matahari adalah ...', opsi: ['Merkurius', 'Venus', 'Mars'], kunciJawaban: 'Merkurius', pembahasan: 'Urutan pertama.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ips-globalisasi', judul: 'Globalisasi', deskripsi: 'Dampak & sikap.', urutan: 100, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-glo-m1', babId: 'smp9-ips-globalisasi', judul: 'Bentuk', konten: 'Ekonomi, budaya, teknologi, informasi.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-glo-m2', babId: 'smp9-ips-globalisasi', judul: 'Sikap', konten: 'Saring budaya asing, cintai produk dalam negeri.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-glo-s1', tipe: 'pilihan_ganda', pertanyaan: 'Dampak positif globalisasi adalah ...', opsi: ['Akses informasi cepat', 'Lunturnya budaya', 'Konsumerisme'], kunciJawaban: 'Akses informasi cepat', pembahasan: 'Informasi mudah diakses.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ips-kerajaan', judul: 'Kerajaan Hindu-Buddha', deskripsi: 'Kutai, Tarumanegara, Majapahit.', urutan: 101, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-ker-m1', babId: 'sd5-ips-kerajaan', judul: 'Kerajaan', konten: 'Kutai tertua. Majapahit terbesar (Gajah Mada).', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-ker-m2', babId: 'sd5-ips-kerajaan', judul: 'Peninggalan', konten: 'Candi Borobudur & Prambanan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-ker-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sumpah Palapa diucapkan oleh ...', opsi: ['Gajah Mada', 'Hayam Wuruk', 'Ken Arok'], kunciJawaban: 'Gajah Mada', pembahasan: 'Mahapatih Majapahit.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-kimia-ikatan', judul: 'Ikatan Kimia', deskripsi: 'Ion, kovalen, & logam.', urutan: 102, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-ika-m1', babId: 'sma11-kimia-ikatan', judul: 'Jenis', konten: 'Ion: serah terima elektron. Kovalen: berbagi.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-ika-m2', babId: 'sma11-kimia-ikatan', judul: 'Sifat', konten: 'Ion: titik leleh tinggi. Kovalen: rendah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-ika-s1', tipe: 'pilihan_ganda', pertanyaan: 'NaCl berikatan ...', opsi: ['Ion', 'Kovalen', 'Logam'], kunciJawaban: 'Ion', pembahasan: 'Logam + nonlogam.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-mtk-statistika', judul: 'Statistika', deskripsi: 'Rata-rata, median, modus.', urutan: 103, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-sta-m1', babId: 'sma12-mtk-statistika', judul: 'Ukuran Pusat', konten: 'Mean, median, modus data tunggal & kelompok.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-sta-m2', babId: 'sma12-mtk-statistika', judul: 'Penyebaran', konten: 'Jangkauan, simpangan baku, varians.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-sta-s1', tipe: 'pilihan_ganda', pertanyaan: 'Rata-rata 4, 6, 8, 10 adalah ...', opsi: ['7', '6', '8'], kunciJawaban: '7', pembahasan: '(4+6+8+10)/4 = 7.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-peta', judul: 'Peta Sederhana', deskripsi: 'Membaca peta lingkungan.', urutan: 104, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pet-m1', babId: 'sd4-ips-peta', judul: 'Komponen', konten: 'Judul, arah mata angin, simbol.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-pet-m2', babId: 'sd4-ips-peta', judul: 'Denah', konten: 'Denah kelas & rumah.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-pet-s1', tipe: 'pilihan_ganda', pertanyaan: 'Arah terbit matahari adalah ...', opsi: ['Timur', 'Barat', 'Utara'], kunciJawaban: 'Timur', pembahasan: 'Matahari terbit di timur.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ips-asean', judul: 'ASEAN', deskripsi: 'Negara & kerja sama.', urutan: 105, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-ase-m1', babId: 'smp7-ips-asean', judul: 'Anggota', konten: '10 negara Asia Tenggara.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-ase-m2', babId: 'smp7-ips-asean', judul: 'Kerja Sama', konten: 'Ekonomi, sosial, budaya.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-ase-s1', tipe: 'pilihan_ganda', pertanyaan: 'ASEAN berdiri tahun ...', opsi: ['1967', '1945', '2000'], kunciJawaban: '1967', pembahasan: 'Deklarasi Bangkok 8 Agustus 1967.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ips-perjuangan', judul: 'Perjuangan Kemerdekaan', deskripsi: 'Tokoh & peristiwa.', urutan: 106, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-per-m1', babId: 'sd6-ips-perjuangan', judul: 'Tokoh', konten: 'Soekarno, Hatta, Sjahrir, Tan Malaka.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-per-m2', babId: 'sd6-ips-perjuangan', judul: 'Peristiwa', konten: 'Rengasdengklok, Proklamasi 17-8-1945.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-per-s1', tipe: 'pilihan_ganda', pertanyaan: 'Naskah proklamasi diketik oleh ...', opsi: ['Sayuti Melik', 'Soekarno', 'Hatta'], kunciJawaban: 'Sayuti Melik', pembahasan: 'Diketik Sayuti Melik.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-fisika-gerak', judul: 'Gerak Lurus', deskripsi: 'GLB & GLBB.', urutan: 107, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-ger-m1', babId: 'sma10-fisika-gerak', judul: 'GLB', konten: 'v tetap: s = v.t.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-ger-m2', babId: 'sma10-fisika-gerak', judul: 'GLBB', konten: 'a tetap: vt = vo + a.t.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-ger-s1', tipe: 'pilihan_ganda', pertanyaan: 'Mobil 20 m/s selama 10 s menempuh ...', opsi: ['200 m', '100 m', '20 m'], kunciJawaban: '200 m', pembahasan: 's = 20 x 10 = 200.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ipa-cahaya', judul: 'Cahaya & Alat Optik', deskripsi: 'Pemantulan & pembiasan.', urutan: 108, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-cah-m1', babId: 'smp8-ipa-cahaya', judul: 'Sifat', konten: 'Merambat lurus, dipantulkan, dibiaskan.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-cah-m2', babId: 'smp8-ipa-cahaya', judul: 'Alat Optik', konten: 'Kamera, lup, mikroskop, teleskop.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-cah-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bayangan cermin datar bersifat ...', opsi: ['Maya, sama besar', 'Nyata, diperkecil', 'Maya, diperbesar'], kunciJawaban: 'Maya, sama besar', pembahasan: 'Cermin datar: maya & sama besar.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ipa-gaya', judul: 'Gaya & Gerak', deskripsi: 'Macam gaya.', urutan: 109, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-gay-m1', babId: 'sd5-ipa-gaya', judul: 'Macam', konten: 'Otot, gesek, gravitasi, magnet.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-gay-m2', babId: 'sd5-ipa-gaya', judul: 'Pengaruh', konten: 'Menggerakkan, menghentikan, mengubah bentuk.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-gay-s1', tipe: 'pilihan_ganda', pertanyaan: 'Buah jatuh karena gaya ...', opsi: ['Gravitasi', 'Magnet', 'Otot'], kunciJawaban: 'Gravitasi', pembahasan: 'Gravitasi bumi menarik benda.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-bio-sel', judul: 'Sel & Jaringan', deskripsi: 'Struktur sel.', urutan: 110, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-sel-m1', babId: 'sma11-bio-sel', judul: 'Organel', konten: 'Nukleus, mitokondria, kloroplas.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-sel-m2', babId: 'sma11-bio-sel', judul: 'Jaringan', konten: 'Epitel, otot, saraf, ikat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-sel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tempat fotosintesis adalah ...', opsi: ['Kloroplas', 'Mitokondria', 'Nukleus'], kunciJawaban: 'Kloroplas', pembahasan: 'Klorofil di kloroplas.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ipa-bunyi', judul: 'Bunyi & Pendengaran', deskripsi: 'Sumber bunyi.', urutan: 111, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-bun-m1', babId: 'sd4-ipa-bunyi', judul: 'Sumber', konten: 'Benda bergetar menghasilkan bunyi.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-bun-m2', babId: 'sd4-ipa-bunyi', judul: 'Telinga', konten: 'Daun, gendang, tulang pendengaran.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-bun-s1', tipe: 'pilihan_ganda', pertanyaan: 'Bunyi merambat paling cepat di ...', opsi: ['Benda padat', 'Udara', 'Hampa'], kunciJawaban: 'Benda padat', pembahasan: 'Padat > cair > gas.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ipa-listrik', judul: 'Listrik Dinamis', deskripsi: 'Arus & rangkaian.', urutan: 112, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-lis-m1', babId: 'smp9-ipa-listrik', judul: 'Arus', konten: 'I = Q/t. Satuan ampere.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-lis-m2', babId: 'smp9-ipa-listrik', judul: 'Hukum Ohm', konten: 'V = I.R.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-lis-s1', tipe: 'pilihan_ganda', pertanyaan: 'V=12V, R=4 ohm, I = ...', opsi: ['3 A', '48 A', '8 A'], kunciJawaban: '3 A', pembahasan: 'I = 12/4 = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ipa-tata-surya', judul: 'Tata Surya', deskripsi: 'Planet & gerakannya.', urutan: 113, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-tat-m1', babId: 'sd6-ipa-tata-surya', judul: 'Planet', konten: '8 planet. Bumi ke-3.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-tat-m2', babId: 'sd6-ipa-tata-surya', judul: 'Gerakan', konten: 'Rotasi 24 jam, revolusi 365 hari.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-tat-s1', tipe: 'pilihan_ganda', pertanyaan: 'Planet terdekat matahari adalah ...', opsi: ['Merkurius', 'Venus', 'Mars'], kunciJawaban: 'Merkurius', pembahasan: 'Urutan pertama dari matahari.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-bio-genetika', judul: 'Genetika', deskripsi: 'Pewarisan sifat.', urutan: 114, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-gen-m1', babId: 'sma12-bio-genetika', judul: 'Mendel', konten: 'Hukum I & II Mendel. Dominan-resesif.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-gen-m2', babId: 'sma12-bio-genetika', judul: 'DNA', konten: 'Replikasi, transkripsi, translasi.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-gen-s1', tipe: 'pilihan_ganda', pertanyaan: 'Aa x Aa menghasilkan ...', opsi: ['3:1', '1:1', '9:3:3:1'], kunciJawaban: '3:1', pembahasan: 'Monohibrid dominan.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-kimia-larutan', judul: 'Larutan', deskripsi: 'Konsentrasi & pH.', urutan: 115, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-lar-m1', babId: 'sma10-kimia-larutan', judul: 'Konsentrasi', konten: 'Molaritas = mol/liter.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-lar-m2', babId: 'sma10-kimia-larutan', judul: 'pH', konten: 'Skala 0-14. Asam <7, basa >7.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-lar-s1', tipe: 'pilihan_ganda', pertanyaan: 'pH 3 bersifat ...', opsi: ['Asam', 'Basa', 'Netral'], kunciJawaban: 'Asam', pembahasan: '<7 = asam.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-fisika-gelombang', judul: 'Gelombang', deskripsi: 'Jenis & sifat.', urutan: 116, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-gel-m1', babId: 'sma11-fisika-gelombang', judul: 'Jenis', konten: 'Transversal & longitudinal.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-gel-m2', babId: 'sma11-fisika-gelombang', judul: 'Persamaan', konten: 'v = lambda.f.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-gel-s1', tipe: 'pilihan_ganda', pertanyaan: 'lambda=2m, f=5Hz, v = ...', opsi: ['10 m/s', '7 m/s', '2,5 m/s'], kunciJawaban: '10 m/s', pembahasan: 'v = 2 x 5 = 10.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-ipa-asean', judul: 'Daur Air', deskripsi: 'Siklus hidrologi.', urutan: 117, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-dau-m1', babId: 'sd5-ipa-asean', judul: 'Tahapan', konten: 'Evaporasi, kondensasi, presipitasi.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-dau-m2', babId: 'sd5-ipa-asean', judul: 'Manfaat', konten: 'Air bersih untuk hidup.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-dau-s1', tipe: 'pilihan_ganda', pertanyaan: 'Penguapan air disebut ...', opsi: ['Evaporasi', 'Kondensasi', 'Infiltrasi'], kunciJawaban: 'Evaporasi', pembahasan: 'Evaporasi = penguapan.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-ipa-pengukuran', judul: 'Pengukuran', deskripsi: 'Besaran & satuan.', urutan: 118, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-uku-m1', babId: 'smp7-ipa-pengukuran', judul: 'Besaran', konten: 'Pokok & turunan. 7 besaran pokok.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-uku-m2', babId: 'smp7-ipa-pengukuran', judul: 'Alat Ukur', konten: 'Mistar, jangka sorong, mikrometer.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-uku-s1', tipe: 'pilihan_ganda', pertanyaan: 'Satuan SI panjang adalah ...', opsi: ['Meter', 'Inci', 'Kaki'], kunciJawaban: 'Meter', pembahasan: 'SI: meter.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-biologi-sel', judul: 'Sel', deskripsi: 'Struktur & fungsi sel.', urutan: 119, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-sel-m1', babId: 'sma10-biologi-sel', judul: 'Organel', konten: 'Nukleus, mitokondria, kloroplas.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-sel-m2', babId: 'sma10-biologi-sel', judul: 'Transpor Membran', konten: 'Difusi, osmosis, transport aktif.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-sel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Pabrik energi sel adalah ...', opsi: ['Mitokondria', 'Nukleus', 'Ribosom'], kunciJawaban: 'Mitokondria', pembahasan: 'Mitokondria = respirasi sel.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-bindo-cerita', judul: 'Menulis Cerita', deskripsi: 'Unsur & menulis.', urutan: 120, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-cer-m1', babId: 'sd4-bindo-cerita', judul: 'Unsur Cerita', konten: 'Tokoh, latar, alur.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-cer-m2', babId: 'sd4-bindo-cerita', judul: 'Menulis', konten: 'Kerangka lalu kembangkan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-cer-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tempat & waktu cerita = ...', opsi: ['Latar', 'Tokoh', 'Amanat'], kunciJawaban: 'Latar', pembahasan: 'Latar = tempat/waktu/suasana.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-matematika-aljabar', judul: 'Aljabar', deskripsi: 'Operasi bentuk aljabar.', urutan: 121, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-alj-m1', babId: 'smp8-matematika-aljabar', judul: 'Suku', konten: 'Suku sejenis & tak sejenis.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-alj-m2', babId: 'smp8-matematika-aljabar', judul: 'Faktorisasi', konten: 'Faktor persekutuan & selisih kuadrat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-alj-s1', tipe: 'pilihan_ganda', pertanyaan: 'x^2 - 9 = ...', opsi: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)^2'], kunciJawaban: '(x-3)(x+3)', pembahasan: 'Selisih kuadrat.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-ips-asean', judul: 'ASEAN', deskripsi: 'Negara & kerja sama.', urutan: 122, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-ase-m1', babId: 'sd6-ips-asean', judul: 'Anggota', konten: '10 negara Asia Tenggara.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-ase-m2', babId: 'sd6-ips-asean', judul: 'Kerja Sama', konten: 'Ekonomi, sosial, budaya.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-ase-s1', tipe: 'pilihan_ganda', pertanyaan: 'ASEAN berdiri tahun ...', opsi: ['1967', '1945', '1997'], kunciJawaban: '1967', pembahasan: 'Deklarasi Bangkok 1967.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-kimia-asam', judul: 'Asam Basa', deskripsi: 'Teori & pH.', urutan: 123, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-ab-m1', babId: 'sma11-kimia-asam', judul: 'Teori', konten: 'Arrhenius, Bronsted-Lowry, Lewis.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-ab-m2', babId: 'sma11-kimia-asam', judul: 'pH', konten: 'Skala 0-14. Indikator.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-ab-s1', tipe: 'pilihan_ganda', pertanyaan: 'pH larutan netral = ...', opsi: ['7', '0', '14'], kunciJawaban: '7', pembahasan: 'Netral pH 7.', bobot: 10 },
    ],
  },
  {
    id: 'sd5-matematika-pecahan', judul: 'Pecahan', deskripsi: 'Operasi pecahan.', urutan: 124, jenjang: 'sd', kelas: 'Kelas 5',
    materi: [
      { id: 'sd5-pec-m1', babId: 'sd5-matematika-pecahan', judul: 'Penjumlahan', konten: 'Samakan penyebut dulu.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd5-pec-m2', babId: 'sd5-matematika-pecahan', judul: 'Perkalian', konten: 'Pembilang x pembilang.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd5-pec-s1', tipe: 'pilihan_ganda', pertanyaan: '1/2 + 1/4 = ...', opsi: ['3/4', '2/6', '1/6'], kunciJawaban: '3/4', pembahasan: '2/4 + 1/4 = 3/4.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-ipa-listrik', judul: 'Listrik Statis', deskripsi: 'Muatan & hukum Coulomb.', urutan: 125, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-lis-m1', babId: 'smp9-ipa-listrik', judul: 'Muatan', konten: 'Positif & negatif. Sejenis tolak.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-lis-m2', babId: 'smp9-ipa-listrik', judul: 'Coulomb', konten: 'F = k.q1.q2/r^2.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-lis-s1', tipe: 'pilihan_ganda', pertanyaan: 'Muatan sejenis akan ...', opsi: ['Tolak-menolak', 'Tarik-menarik', 'Netral'], kunciJawaban: 'Tolak-menolak', pembahasan: 'Sejenis tolak, beda tarik.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-fisika-arus', judul: 'Arus Listrik', deskripsi: 'Hukum Ohm & rangkaian.', urutan: 126, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-aru-m1', babId: 'sma12-fisika-arus', judul: 'Hukum Ohm', konten: 'V = I.R.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-aru-m2', babId: 'sma12-fisika-arus', judul: 'Rangkaian', konten: 'Seri & paralel.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-aru-s1', tipe: 'pilihan_ganda', pertanyaan: 'V=12V, R=4 ohm, I = ...', opsi: ['3 A', '48 A', '8 A'], kunciJawaban: '3 A', pembahasan: 'I = 12/4 = 3.', bobot: 10 },
    ],
  },
  {
    id: 'sd6-bindo-puisi', judul: 'Puisi', deskripsi: 'Unsur & menulis puisi.', urutan: 127, jenjang: 'sd', kelas: 'Kelas 6',
    materi: [
      { id: 'sd6-pui-m1', babId: 'sd6-bindo-puisi', judul: 'Unsur', konten: 'Bait, baris, rima, majas.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd6-pui-m2', babId: 'sd6-bindo-puisi', judul: 'Menulis', konten: 'Tema lalu kembangkan.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd6-pui-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kumpulan baris puisi = ...', opsi: ['Bait', 'Paragraf', 'Bab'], kunciJawaban: 'Bait', pembahasan: 'Bait = kumpulan baris.', bobot: 10 },
    ],
  },
  {
    id: 'smp7-matematika-bilangan', judul: 'Bilangan Bulat', deskripsi: 'Operasi bilangan bulat.', urutan: 128, jenjang: 'smp', kelas: 'Kelas 7',
    materi: [
      { id: 'smp7-bil-m1', babId: 'smp7-matematika-bilangan', judul: 'Penjumlahan', konten: 'Aturan tanda.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp7-bil-m2', babId: 'smp7-matematika-bilangan', judul: 'Perkalian', konten: 'Negatif x negatif = positif.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp7-bil-s1', tipe: 'pilihan_ganda', pertanyaan: '(-3) x (-4) = ...', opsi: ['12', '-12', '7'], kunciJawaban: '12', pembahasan: 'Negatif x negatif = positif.', bobot: 10 },
    ],
  },
  {
    id: 'smp8-ipa-gaya', judul: 'Gaya', deskripsi: 'Jenis & hukum Newton.', urutan: 129, jenjang: 'smp', kelas: 'Kelas 8',
    materi: [
      { id: 'smp8-gay-m1', babId: 'smp8-ipa-gaya', judul: 'Jenis', konten: 'Otot, gesek, magnet, gravitasi.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp8-gay-m2', babId: 'smp8-ipa-gaya', judul: 'Newton', konten: '3 hukum gerak.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp8-gay-s1', tipe: 'pilihan_ganda', pertanyaan: 'F = m.a adalah hukum ...', opsi: ['Newton II', 'Newton I', 'Newton III'], kunciJawaban: 'Newton II', pembahasan: 'Hukum II: F=ma.', bobot: 10 },
    ],
  },
  {
    id: 'sd4-ips-peta', judul: 'Peta', deskripsi: 'Unsur & membaca peta.', urutan: 130, jenjang: 'sd', kelas: 'Kelas 4',
    materi: [
      { id: 'sd4-pet-m1', babId: 'sd4-ips-peta', judul: 'Unsur', konten: 'Judul, legenda, skala, mata angin.', urutan: 1, estimasiMenit: 15 },
      { id: 'sd4-pet-m2', babId: 'sd4-ips-peta', judul: 'Membaca', konten: 'Arah & jarak di peta.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sd4-pet-s1', tipe: 'pilihan_ganda', pertanyaan: 'Penunjuk arah di peta = ...', opsi: ['Mata angin', 'Legenda', 'Skala'], kunciJawaban: 'Mata angin', pembahasan: 'Mata angin = arah.', bobot: 10 },
    ],
  },
  {
    id: 'sma10-matematika-trigonometri', judul: 'Trigonometri', deskripsi: 'Sin, cos, tan.', urutan: 131, jenjang: 'sma', kelas: 'Kelas 10',
    materi: [
      { id: 'sma10-tri-m1', babId: 'sma10-matematika-trigonometri', judul: 'Perbandingan', konten: 'Sin = depan/miring.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma10-tri-m2', babId: 'sma10-matematika-trigonometri', judul: 'Sudut Istimewa', konten: '30, 45, 60 derajat.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma10-tri-s1', tipe: 'pilihan_ganda', pertanyaan: 'sin 30 = ...', opsi: ['1/2', 'akar3/2', '1'], kunciJawaban: '1/2', pembahasan: 'Sin 30 = 1/2.', bobot: 10 },
    ],
  },
  {
    id: 'smp9-matematika-bangun', judul: 'Bangun Ruang', deskripsi: 'Volume & luas permukaan.', urutan: 132, jenjang: 'smp', kelas: 'Kelas 9',
    materi: [
      { id: 'smp9-ban-m1', babId: 'smp9-matematika-bangun', judul: 'Kubus & Balok', konten: 'V = s^3, p.l.t.', urutan: 1, estimasiMenit: 15 },
      { id: 'smp9-ban-m2', babId: 'smp9-matematika-bangun', judul: 'Tabung & Bola', konten: 'V = pi.r^2.t, 4/3 pi.r^3.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'smp9-ban-s1', tipe: 'pilihan_ganda', pertanyaan: 'Volume kubus s=3 = ...', opsi: ['27', '9', '18'], kunciJawaban: '27', pembahasan: '3^3 = 27.', bobot: 10 },
    ],
  },
  {
    id: 'sma11-matematika-limit', judul: 'Limit Fungsi', deskripsi: 'Konsep & sifat limit.', urutan: 133, jenjang: 'sma', kelas: 'Kelas 11',
    materi: [
      { id: 'sma11-lim-m1', babId: 'sma11-matematika-limit', judul: 'Konsep', konten: 'Mendekati nilai.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma11-lim-m2', babId: 'sma11-matematika-limit', judul: 'Sifat', konten: 'Jumlah, kali, bagi limit.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma11-lim-s1', tipe: 'pilihan_ganda', pertanyaan: 'lim x->2 (3x+1) = ...', opsi: ['7', '6', '8'], kunciJawaban: '7', pembahasan: '3(2)+1 = 7.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-matematika-turunan', judul: 'Turunan', deskripsi: 'Aturan & aplikasi turunan.', urutan: 134, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-tur-m1', babId: 'sma12-matematika-turunan', judul: 'Aturan', konten: 'x^n -> n.x^(n-1).', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-tur-m2', babId: 'sma12-matematika-turunan', judul: 'Aplikasi', konten: 'Maksimum & minimum.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-tur-s1', tipe: 'pilihan_ganda', pertanyaan: 'Turunan x^3 = ...', opsi: ['3x^2', 'x^2', '3x'], kunciJawaban: '3x^2', pembahasan: 'Aturan pangkat.', bobot: 10 },
    ],
  },
  {
    id: 'sma12-matematika-integral', judul: 'Integral', deskripsi: 'Anti-turunan & luas.', urutan: 135, jenjang: 'sma', kelas: 'Kelas 12',
    materi: [
      { id: 'sma12-int-m1', babId: 'sma12-matematika-integral', judul: 'Tak Tentu', konten: 'Anti-turunan.', urutan: 1, estimasiMenit: 15 },
      { id: 'sma12-int-m2', babId: 'sma12-matematika-integral', judul: 'Tentu', konten: 'Luas di bawah kurva.', urutan: 2, estimasiMenit: 15 },
    ],
    latihan: [
      { id: 'sma12-int-s1', tipe: 'pilihan_ganda', pertanyaan: 'Integral 2x dx = ...', opsi: ['x^2 + C', '2x^2', 'x + C'], kunciJawaban: 'x^2 + C', pembahasan: 'Anti-turunan 2x.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-matematika-statistika', judul: 'Statistika Deskriptif', deskripsi: 'Mean, median, modus.', urutan: 136, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-stat-m1', babId: 'kuliah-matematika-statistika', judul: 'Ukuran Pusat', konten: 'Mean, median, modus.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-stat-m2', babId: 'kuliah-matematika-statistika', judul: 'Sebaran', konten: 'Range, varians, SD.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-stat-s1', tipe: 'pilihan_ganda', pertanyaan: 'Median 1,2,3,4,5 = ...', opsi: ['3', '2', '4'], kunciJawaban: '3', pembahasan: 'Nilai tengah.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-fisika-termodinamika', judul: 'Termodinamika', deskripsi: 'Hukum & entropi.', urutan: 137, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-ter-m1', babId: 'kuliah-fisika-termodinamika', judul: 'Hukum I', konten: 'Kekekalan energi.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ter-m2', babId: 'kuliah-fisika-termodinamika', judul: 'Hukum II', konten: 'Entropi naik.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ter-s1', tipe: 'pilihan_ganda', pertanyaan: 'Hukum I: delta U = ...', opsi: ['Q - W', 'Q + W', 'W - Q'], kunciJawaban: 'Q - W', pembahasan: 'Energi dalam.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-kimia-asam-basa', judul: 'Asam & Basa', deskripsi: 'pH & titrasi.', urutan: 138, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-asb-m1', babId: 'kuliah-kimia-asam-basa', judul: 'Teori', konten: 'Arrhenius, Bronsted-Lowry.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-asb-m2', babId: 'kuliah-kimia-asam-basa', judul: 'Titrasi', konten: 'Titik ekuivalen.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-asb-s1', tipe: 'pilihan_ganda', pertanyaan: 'pH larutan netral = ...', opsi: ['7', '1', '14'], kunciJawaban: '7', pembahasan: 'Netral pH 7.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-biologi-sel', judul: 'Biologi Sel', deskripsi: 'Organel & fungsi.', urutan: 139, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sel-m1', babId: 'kuliah-biologi-sel', judul: 'Organel', konten: 'Nukleus, mitokondria, ribosom.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sel-m2', babId: 'kuliah-biologi-sel', judul: 'Transport', konten: 'Difusi, osmosis.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sel-s1', tipe: 'pilihan_ganda', pertanyaan: 'Pembangkit energi sel = ...', opsi: ['Mitokondria', 'Nukleus', 'Ribosom'], kunciJawaban: 'Mitokondria', pembahasan: 'Powerhouse.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ekonomi-mikro', judul: 'Mikroekonomi', deskripsi: 'Supply, demand, pasar.', urutan: 140, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-mik-m1', babId: 'kuliah-ekonomi-mikro', judul: 'Supply Demand', konten: 'Kurva & ekuilibrium.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-mik-m2', babId: 'kuliah-ekonomi-mikro', judul: 'Elastisitas', konten: 'Respons harga.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-mik-s1', tipe: 'pilihan_ganda', pertanyaan: 'Harga naik, demand ...', opsi: ['Turun', 'Naik', 'Tetap'], kunciJawaban: 'Turun', pembahasan: 'Hukum demand.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sejarah-indonesia', judul: 'Sejarah Indonesia Modern', deskripsi: '1945-sekarang.', urutan: 141, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sej-m1', babId: 'kuliah-sejarah-indonesia', judul: 'Kemerdekaan', konten: 'Proklamasi & revolusi.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sej-m2', babId: 'kuliah-sejarah-indonesia', judul: 'Reformasi', konten: '1998 & demokrasi.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sej-s1', tipe: 'pilihan_ganda', pertanyaan: 'Proklamasi dibacakan di ...', opsi: ['Pegangsaan Timur 56', 'Istana Merdeka', 'Gedung Sate'], kunciJawaban: 'Pegangsaan Timur 56', pembahasan: 'Rumah Soekarno.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sosiologi-stratifikasi', judul: 'Stratifikasi Sosial', deskripsi: 'Kelas & mobilitas.', urutan: 142, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sos-m1', babId: 'kuliah-sosiologi-stratifikasi', judul: 'Kelas', konten: 'Atas, menengah, bawah.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sos-m2', babId: 'kuliah-sosiologi-stratifikasi', judul: 'Mobilitas', konten: 'Vertikal & horizontal.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sos-s1', tipe: 'pilihan_ganda', pertanyaan: 'Naik jabatan = mobilitas ...', opsi: ['Vertikal naik', 'Horizontal', 'Turun'], kunciJawaban: 'Vertikal naik', pembahasan: 'Naik status.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-psikologi-perkembangan', judul: 'Psikologi Perkembangan', deskripsi: 'Tahap & teori.', urutan: 143, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-psi-m1', babId: 'kuliah-psikologi-perkembangan', judul: 'Teori', konten: 'Piaget, Erikson.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-psi-m2', babId: 'kuliah-psikologi-perkembangan', judul: 'Tahap', konten: 'Bayi hingga lansia.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-psi-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sensorimotor usia ...', opsi: ['0-2 tahun', '2-7 tahun', '7-11 tahun'], kunciJawaban: '0-2 tahun', pembahasan: 'Piaget tahap 1.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-filsafat-etika', judul: 'Etika Filsafat', deskripsi: 'Teori moral.', urutan: 144, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-eti-m1', babId: 'kuliah-filsafat-etika', judul: 'Deontologi', konten: 'Kant: kewajiban.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-eti-m2', babId: 'kuliah-filsafat-etika', judul: 'Utilitarianisme', konten: 'Bentham: kebahagiaan terbesar.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-eti-s1', tipe: 'pilihan_ganda', pertanyaan: 'Utilitarianisme tokohnya ...', opsi: ['Bentham', 'Kant', 'Aristoteles'], kunciJawaban: 'Bentham', pembahasan: 'Greatest happiness.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-hukum-pidana', judul: 'Hukum Pidana', deskripsi: 'Asas & delik.', urutan: 145, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-huk-m1', babId: 'kuliah-hukum-pidana', judul: 'Asas', konten: 'Legalitas, culpabilitas.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-huk-m2', babId: 'kuliah-hukum-pidana', judul: 'Delik', konten: 'Formil & materiil.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-huk-s1', tipe: 'pilihan_ganda', pertanyaan: 'Nullum delictum ...', opsi: ['Nulla poena sine praevia lege', 'In dubio pro reo', 'Ne bis in idem'], kunciJawaban: 'Nulla poena sine praevia lege', pembahasan: 'Asas legalitas.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-matematika-kalkulus', judul: 'Kalkulus Dasar', deskripsi: 'Limit, turunan, integral.', urutan: 146, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-kal-m1', babId: 'kuliah-matematika-kalkulus', judul: 'Limit', konten: 'Konsep limit.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-kal-m2', babId: 'kuliah-matematika-kalkulus', judul: 'Turunan', konten: 'Aturan turunan.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-kal-s1', tipe: 'pilihan_ganda', pertanyaan: 'd/dx x^2 = ...', opsi: ['2x', 'x', 'x^2'], kunciJawaban: '2x', pembahasan: 'Aturan pangkat.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-akuntansi-dasar', judul: 'Akuntansi Dasar', deskripsi: 'Jurnal & laporan.', urutan: 147, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-aku-m1', babId: 'kuliah-akuntansi-dasar', judul: 'Jurnal', konten: 'Debit & kredit.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-aku-m2', babId: 'kuliah-akuntansi-dasar', judul: 'Laporan', konten: 'Neraca & laba rugi.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-aku-s1', tipe: 'pilihan_ganda', pertanyaan: 'Aset = ...', opsi: ['Kewajiban + Modal', 'Modal - Kewajiban', 'Kewajiban - Modal'], kunciJawaban: 'Kewajiban + Modal', pembahasan: 'Persamaan dasar.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-manajemen-pemasaran', judul: 'Manajemen Pemasaran', deskripsi: '4P & segmentasi.', urutan: 148, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-pem-m1', babId: 'kuliah-manajemen-pemasaran', judul: '4P', konten: 'Product, price, place, promotion.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-pem-m2', babId: 'kuliah-manajemen-pemasaran', judul: 'Segmentasi', konten: 'STP: segmenting, targeting, positioning.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-pem-s1', tipe: 'pilihan_ganda', pertanyaan: '4P: product, price, place, ...', opsi: ['Promotion', 'People', 'Process'], kunciJawaban: 'Promotion', pembahasan: 'Bauran pemasaran.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sosiologi-masyarakat', judul: 'Sosiologi Masyarakat', deskripsi: 'Interaksi & lembaga sosial.', urutan: 149, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sos-m1', babId: 'kuliah-sosiologi-masyarakat', judul: 'Interaksi', konten: 'Kontak & komunikasi.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sos-m2', babId: 'kuliah-sosiologi-masyarakat', judul: 'Lembaga', konten: 'Keluarga, pendidikan, ekonomi.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sos-s1', tipe: 'pilihan_ganda', pertanyaan: 'Syarat interaksi sosial?', opsi: ['Kontak & komunikasi', 'Kontak saja', 'Komunikasi saja'], kunciJawaban: 'Kontak & komunikasi', pembahasan: 'Dua syarat pokok.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-psikologi-perkembangan', judul: 'Psikologi Perkembangan', deskripsi: 'Tahap tumbuh kembang.', urutan: 150, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-psi-m1', babId: 'kuliah-psikologi-perkembangan', judul: 'Erikson', konten: '8 tahap krisis.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-psi-m2', babId: 'kuliah-psikologi-perkembangan', judul: 'Piaget', konten: '4 tahap kognitif.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-psi-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tahap sensorimotor umur?', opsi: ['0-2 tahun', '2-7 tahun', '7-11 tahun'], kunciJawaban: '0-2 tahun', pembahasan: 'Piaget tahap 1.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-filsafat-logika', judul: 'Logika Filsafat', deskripsi: 'Silogisme & fallacy.', urutan: 151, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-log-m1', babId: 'kuliah-filsafat-logika', judul: 'Silogisme', konten: 'Premis mayor, minor, kesimpulan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-log-m2', babId: 'kuliah-filsafat-logika', judul: 'Fallacy', konten: 'Ad hominem, strawman.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-log-s1', tipe: 'pilihan_ganda', pertanyaan: 'Semua manusia fana. Budi manusia. Jadi...', opsi: ['Budi fana', 'Budi abadi', 'Tidak tahu'], kunciJawaban: 'Budi fana', pembahasan: 'Silogisme valid.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sejarah-indonesia', judul: 'Sejarah Indonesia Modern', deskripsi: 'Kolonial s/d reformasi.', urutan: 152, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sej-m1', babId: 'kuliah-sejarah-indonesia', judul: 'Kolonial', konten: 'VOC s/d Jepang.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sej-m2', babId: 'kuliah-sejarah-indonesia', judul: 'Kemerdekaan', konten: '1945 s/d reformasi.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sej-s1', tipe: 'pilihan_ganda', pertanyaan: 'Proklamasi tahun?', opsi: ['1945', '1949', '1950'], kunciJawaban: '1945', pembahasan: '17 Agustus 1945.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-sipil-dasar', judul: 'Teknik Sipil Dasar', deskripsi: 'Struktur & material.', urutan: 153, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-sip-m1', babId: 'kuliah-teknik-sipil-dasar', judul: 'Statika', konten: 'Gaya & momen.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sip-m2', babId: 'kuliah-teknik-sipil-dasar', judul: 'Material', konten: 'Beton & baja.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sip-s1', tipe: 'pilihan_ganda', pertanyaan: 'Satuan gaya?', opsi: ['Newton', 'Joule', 'Watt'], kunciJawaban: 'Newton', pembahasan: 'Gaya = Newton.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-hukum-perdata', judul: 'Hukum Perdata', deskripsi: 'Perikatan & perjanjian.', urutan: 154, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-per-m1', babId: 'kuliah-hukum-perdata', judul: 'Perikatan', konten: 'Lahir dari perjanjian & UU.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-per-m2', babId: 'kuliah-hukum-perdata', judul: 'Syarat sah', konten: '1320 KUHPerdata.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-per-s1', tipe: 'pilihan_ganda', pertanyaan: 'Syarat sah perjanjian ada?', opsi: ['4', '3', '5'], kunciJawaban: '4', pembahasan: 'Sepakat, cakap, objek, kausa.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ekonomi-mikro', judul: 'Mikroekonomi Dasar', deskripsi: 'Supply, demand, elastisitas.', urutan: 155, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-mik-m1', babId: 'kuliah-ekonomi-mikro', judul: 'Supply Demand', konten: 'Kurva & keseimbangan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-mik-m2', babId: 'kuliah-ekonomi-mikro', judul: 'Elastisitas', konten: 'Sensitivitas harga.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-mik-s1', tipe: 'pilihan_ganda', pertanyaan: 'Harga naik, demand?', opsi: ['Turun', 'Naik', 'Tetap'], kunciJawaban: 'Turun', pembahasan: 'Hukum demand.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-antropologi-budaya', judul: 'Antropologi Budaya', deskripsi: 'Kebudayaan & masyarakat.', urutan: 156, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-ant-m1', babId: 'kuliah-antropologi-budaya', judul: 'Unsur budaya', konten: '7 unsur universal.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ant-m2', babId: 'kuliah-antropologi-budaya', judul: 'Etnografi', konten: 'Metode lapangan.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ant-s1', tipe: 'pilihan_ganda', pertanyaan: 'Unsur budaya menurut Koentjaraningrat ada?', opsi: ['7', '5', '9'], kunciJawaban: '7', pembahasan: 'Bahasa, pengetahuan, organisasi, dll.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-komunikasi-dasar', judul: 'Ilmu Komunikasi Dasar', deskripsi: 'Model & media.', urutan: 157, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-kom-m1', babId: 'kuliah-ilmu-komunikasi-dasar', judul: 'Model', konten: 'Lasswell & Shannon.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-kom-m2', babId: 'kuliah-ilmu-komunikasi-dasar', judul: 'Media', konten: 'Massa & baru.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-kom-s1', tipe: 'pilihan_ganda', pertanyaan: 'Who says what...?', opsi: ['Lasswell', 'Shannon', 'Schramm'], kunciJawaban: 'Lasswell', pembahasan: 'Model Lasswell.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-elektro-dasar', judul: 'Teknik Elektro Dasar', deskripsi: 'Rangkaian & daya.', urutan: 158, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-elk-m1', babId: 'kuliah-teknik-elektro-dasar', judul: 'Hukum Ohm', konten: 'V = I x R.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-elk-m2', babId: 'kuliah-teknik-elektro-dasar', judul: 'Daya', konten: 'P = V x I.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-elk-s1', tipe: 'pilihan_ganda', pertanyaan: 'V=12V, R=4 ohm. I?', opsi: ['3 A', '48 A', '16 A'], kunciJawaban: '3 A', pembahasan: 'I = V/R.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-mesin-dasar', judul: 'Teknik Mesin Dasar', deskripsi: 'Termodinamika & mesin.', urutan: 159, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-mes-m1', babId: 'kuliah-teknik-mesin-dasar', judul: 'Termodinamika', konten: 'Hukum 1 & 2.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-mes-m2', babId: 'kuliah-teknik-mesin-dasar', judul: 'Siklus', konten: 'Otto & diesel.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-mes-s1', tipe: 'pilihan_ganda', pertanyaan: 'Efisiensi Carnot maks?', opsi: ['1 - Tc/Th', 'Tc/Th', 'Th/Tc'], kunciJawaban: '1 - Tc/Th', pembahasan: 'Rumus Carnot.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-hukum-tata-negara', judul: 'Hukum Tata Negara', deskripsi: 'Konstitusi & lembaga.', urutan: 160, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-htn-m1', babId: 'kuliah-hukum-tata-negara', judul: 'UUD 45', konten: 'Pembukaan & pasal.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-htn-m2', babId: 'kuliah-hukum-tata-negara', judul: 'Lembaga', konten: 'MPR, DPR, Presiden, MA, MK.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-htn-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kedaulatan di tangan?', opsi: ['Rakyat', 'Presiden', 'DPR'], kunciJawaban: 'Rakyat', pembahasan: 'Pasal 1 ayat 2.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-farmasi-dasar', judul: 'Farmasi Dasar', deskripsi: 'Obat & dosis.', urutan: 161, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-far-m1', babId: 'kuliah-farmasi-dasar', judul: 'Bentuk sediaan', konten: 'Tablet, kapsul, sirup.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-far-m2', babId: 'kuliah-farmasi-dasar', judul: 'Dosis', konten: 'Perhitungan dosis.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-far-s1', tipe: 'pilihan_ganda', pertanyaan: '500mg x 3/hari = ?', opsi: ['1500 mg', '500 mg', '1000 mg'], kunciJawaban: '1500 mg', pembahasan: 'Dosis harian.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-kedokteran-anatomi', judul: 'Anatomi Dasar', deskripsi: 'Sistem tubuh manusia.', urutan: 162, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-ana-m1', babId: 'kuliah-kedokteran-anatomi', judul: 'Rangka', konten: '206 tulang.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ana-m2', babId: 'kuliah-kedokteran-anatomi', judul: 'Otot', konten: '600+ otot.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ana-s1', tipe: 'pilihan_ganda', pertanyaan: 'Tulang terpanjang?', opsi: ['Femur', 'Tibia', 'Humerus'], kunciJawaban: 'Femur', pembahasan: 'Tulang paha.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-gizi-dasar', judul: 'Ilmu Gizi Dasar', deskripsi: 'Makro & mikro nutrien.', urutan: 163, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-giz-m1', babId: 'kuliah-ilmu-gizi-dasar', judul: 'Makronutrien', konten: 'Karbo, protein, lemak.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-giz-m2', babId: 'kuliah-ilmu-gizi-dasar', judul: 'Mikronutrien', konten: 'Vitamin & mineral.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-giz-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sumber protein hewani?', opsi: ['Telur', 'Beras', 'Gula'], kunciJawaban: 'Telur', pembahasan: 'Protein lengkap.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-politik-dasar', judul: 'Ilmu Politik Dasar', deskripsi: 'Kekuasaan & demokrasi.', urutan: 164, jenjang: 'kuliah', kelas: 'Semester 1',
    materi: [
      { id: 'kul-pol-m1', babId: 'kuliah-ilmu-politik-dasar', judul: 'Kekuasaan', konten: 'Definisi & sumber.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-pol-m2', babId: 'kuliah-ilmu-politik-dasar', judul: 'Demokrasi', konten: 'Prinsip & pemilu.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-pol-s1', tipe: 'pilihan_ganda', pertanyaan: 'Pemilu Indonesia tiap?', opsi: ['5 tahun', '4 tahun', '6 tahun'], kunciJawaban: '5 tahun', pembahasan: 'UUD 45.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-komunikasi-lanjut', judul: 'Komunikasi Massa', deskripsi: 'Media & publik.', urutan: 165, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-kmm-m1', babId: 'kuliah-ilmu-komunikasi-lanjut', judul: 'Teori media', konten: 'Agenda setting.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-kmm-m2', babId: 'kuliah-ilmu-komunikasi-lanjut', judul: 'Jurnalisme', konten: '5W1H.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-kmm-s1', tipe: 'pilihan_ganda', pertanyaan: '5W1H kurang?', opsi: ['Who', 'When', 'Why not'], kunciJawaban: 'Why not', pembahasan: 'What who when where why how.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-sipil-lanjut', judul: 'Struktur Bangunan', deskripsi: 'Beton & baja.', urutan: 166, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-str-m1', babId: 'kuliah-teknik-sipil-lanjut', judul: 'Beton', konten: 'Kuat tekan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-str-m2', babId: 'kuliah-teknik-sipil-lanjut', judul: 'Baja', konten: 'Kuat tarik.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-str-s1', tipe: 'pilihan_ganda', pertanyaan: 'Satuan kuat tekan?', opsi: ['MPa', 'Volt', 'Ampere'], kunciJawaban: 'MPa', pembahasan: 'Megapascal.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-elektro-lanjut', judul: 'Rangkaian Listrik', deskripsi: 'DC & AC dasar.', urutan: 167, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-rl-m1', babId: 'kuliah-teknik-elektro-lanjut', judul: 'Hukum Ohm', konten: 'V=IR.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-rl-m2', babId: 'kuliah-teknik-elektro-lanjut', judul: 'Kirchhoff', konten: 'KCL & KVL.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-rl-s1', tipe: 'pilihan_ganda', pertanyaan: 'V=12V, R=4ohm, I=?', opsi: ['3A', '48A', '16A'], kunciJawaban: '3A', pembahasan: 'I=V/R.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-teknik-mesin-lanjut', judul: 'Termodinamika Lanjut', deskripsi: 'Siklus & entropi.', urutan: 168, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-ter-m1', babId: 'kuliah-teknik-mesin-lanjut', judul: 'Hukum I', konten: 'Energi kekal.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ter-m2', babId: 'kuliah-teknik-mesin-lanjut', judul: 'Siklus Carnot', konten: 'Efisiensi maksimal.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ter-s1', tipe: 'pilihan_ganda', pertanyaan: 'Efisiensi Carnot Th=600K Tc=300K?', opsi: ['50%', '100%', '25%'], kunciJawaban: '50%', pembahasan: '1-Tc/Th.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-psikologi-klinis', judul: 'Psikologi Klinis', deskripsi: 'Gangguan & terapi.', urutan: 169, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-psi-m1', babId: 'kuliah-psikologi-klinis', judul: 'Gangguan mood', konten: 'Depresi & bipolar.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-psi-m2', babId: 'kuliah-psikologi-klinis', judul: 'Terapi CBT', konten: 'Restrukturisasi kognitif.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-psi-s1', tipe: 'pilihan_ganda', pertanyaan: 'CBT fokus pada?', opsi: ['Pikiran', 'Obat', 'Hipnosis'], kunciJawaban: 'Pikiran', pembahasan: 'Kognitif-behavioral.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sosiologi-kota', judul: 'Sosiologi Perkotaan', deskripsi: 'Urbanisasi & masalah kota.', urutan: 170, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-sok-m1', babId: 'kuliah-sosiologi-kota', judul: 'Urbanisasi', konten: 'Desa ke kota.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-sok-m2', babId: 'kuliah-sosiologi-kota', judul: 'Kemacetan', konten: 'Dampak sosial.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-sok-s1', tipe: 'pilihan_ganda', pertanyaan: 'Urbanisasi sebabkan?', opsi: ['Kepadatan', 'Sepi', 'Hutan'], kunciJawaban: 'Kepadatan', pembahasan: 'Migrasi kota.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-antropologi-kota', judul: 'Antropologi Perkotaan', deskripsi: 'Budaya kota.', urutan: 171, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-ank-m1', babId: 'kuliah-antropologi-kota', judul: 'Etnografi', konten: 'Observasi partisipan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ank-m2', babId: 'kuliah-antropologi-kota', judul: 'Subkultur', konten: 'Komunitas kota.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ank-s1', tipe: 'pilihan_ganda', pertanyaan: 'Metode utama antropologi?', opsi: ['Etnografi', 'Survei', 'Eksperimen'], kunciJawaban: 'Etnografi', pembahasan: 'Observasi mendalam.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ekonomi-pembangunan', judul: 'Ekonomi Pembangunan', deskripsi: 'Pertumbuhan & kemiskinan.', urutan: 172, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-ekp-m1', babId: 'kuliah-ekonomi-pembangunan', judul: 'Pertumbuhan', konten: 'GDP & PDB.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ekp-m2', babId: 'kuliah-ekonomi-pembangunan', judul: 'Kemiskinan', konten: 'Garis & indeks.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ekp-s1', tipe: 'pilihan_ganda', pertanyaan: 'PDB naik = ?', opsi: ['Tumbuh', 'Resesi', 'Stagnan'], kunciJawaban: 'Tumbuh', pembahasan: 'Pertumbuhan ekonomi.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-filsafat-etika-lanjut', judul: 'Etika Terapan', deskripsi: 'Bioetika & etika profesi.', urutan: 173, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-etl-m1', babId: 'kuliah-filsafat-etika-lanjut', judul: 'Bioetika', konten: 'Klona & euthanasia.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-etl-m2', babId: 'kuliah-filsafat-etika-lanjut', judul: 'Etika profesi', konten: 'Kode etik.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-etl-s1', tipe: 'pilihan_ganda', pertanyaan: 'Utilitarianisme nilai?', opsi: ['Manfaat terbesar', 'Niat baik', 'Aturan'], kunciJawaban: 'Manfaat terbesar', pembahasan: 'Bentham & Mill.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-hukum-pidana-lanjut', judul: 'Hukum Pidana Khusus', deskripsi: 'Korupsi & ITE.', urutan: 174, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-hpk-m1', babId: 'kuliah-hukum-pidana-lanjut', judul: 'Tipikor', konten: 'UU 31/1999.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-hpk-m2', babId: 'kuliah-hukum-pidana-lanjut', judul: 'UU ITE', konten: 'Pencemaran nama.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-hpk-s1', tipe: 'pilihan_ganda', pertanyaan: 'KPK dibentuk tahun?', opsi: ['2002', '1998', '2010'], kunciJawaban: '2002', pembahasan: 'UU 30/2002.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-farmasi-klinis', judul: 'Farmasi Klinis', deskripsi: 'Interaksi obat.', urutan: 175, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-fak-m1', babId: 'kuliah-farmasi-klinis', judul: 'Interaksi', konten: 'Obat-obat & makanan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-fak-m2', babId: 'kuliah-farmasi-klinis', judul: 'Efek samping', konten: 'ADR & pelaporan.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-fak-s1', tipe: 'pilihan_ganda', pertanyaan: 'Warfarin + vit K = ?', opsi: ['Turun efek', 'Naik efek', 'Aman'], kunciJawaban: 'Turun efek', pembahasan: 'Antagonis.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-gizi-klinis', judul: 'Gizi Klinis', deskripsi: 'Diet penyakit.', urutan: 176, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-gik-m1', babId: 'kuliah-ilmu-gizi-klinis', judul: 'Diet DM', konten: 'Karbo terkontrol.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-gik-m2', babId: 'kuliah-ilmu-gizi-klinis', judul: 'Diet jantung', konten: 'Rendah garam.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-gik-s1', tipe: 'pilihan_ganda', pertanyaan: 'DM hindari?', opsi: ['Gula', 'Protein', 'Serat'], kunciJawaban: 'Gula', pembahasan: 'Indeks glikemik.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-psikologi-perkembangan', judul: 'Psikologi Perkembangan', deskripsi: 'Tahap hidup manusia.', urutan: 177, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-ppk-m1', babId: 'kuliah-psikologi-perkembangan', judul: 'Piaget', konten: '4 tahap kognitif.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-ppk-m2', babId: 'kuliah-psikologi-perkembangan', judul: 'Erikson', konten: '8 krisis.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-ppk-s1', tipe: 'pilihan_ganda', pertanyaan: 'Sensorimotor usia?', opsi: ['0-2', '2-7', '7-11'], kunciJawaban: '0-2', pembahasan: 'Piaget.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-sosiologi-agama', judul: 'Sosiologi Agama', deskripsi: 'Agama & masyarakat.', urutan: 178, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-soa-m1', babId: 'kuliah-sosiologi-agama', judul: 'Durkheim', konten: 'Sakral & profan.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-soa-m2', babId: 'kuliah-sosiologi-agama', judul: 'Weber', konten: 'Etika protestan.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-soa-s1', tipe: 'pilihan_ganda', pertanyaan: 'Totemisme menurut?', opsi: ['Durkheim', 'Marx', 'Weber'], kunciJawaban: 'Durkheim', pembahasan: 'Elementary Forms.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-antropologi-ekonomi', judul: 'Antropologi Ekonomi', deskripsi: 'Ekonomi & budaya.', urutan: 179, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-aek-m1', babId: 'kuliah-antropologi-ekonomi', judul: 'Pertukaran', konten: 'Barter & pasar.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-aek-m2', babId: 'kuliah-antropologi-ekonomi', judul: 'Mauss', konten: 'The Gift.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-aek-s1', tipe: 'pilihan_ganda', pertanyaan: 'Kula ring?', opsi: ['Malinowski', 'Radcliffe', 'Boas'], kunciJawaban: 'Malinowski', pembahasan: 'Trobriand.', bobot: 10 },
    ],
  },
  {
    id: 'kuliah-ilmu-komunikasi-politik', judul: 'Komunikasi Politik', deskripsi: 'Media & kekuasaan.', urutan: 180, jenjang: 'kuliah', kelas: 'Semester 2',
    materi: [
      { id: 'kul-kop-m1', babId: 'kuliah-ilmu-komunikasi-politik', judul: 'Kampanye', konten: 'Strategi media.', urutan: 1, estimasiMenit: 20 },
      { id: 'kul-kop-m2', babId: 'kuliah-ilmu-komunikasi-politik', judul: 'Opini publik', konten: 'Survei & framing.', urutan: 2, estimasiMenit: 20 },
    ],
    latihan: [
      { id: 'kul-kop-s1', tipe: 'pilihan_ganda', pertanyaan: 'Agenda setting?', opsi: ['McCombs', 'Lasswell', 'Shannon'], kunciJawaban: 'McCombs', pembahasan: 'McCombs & Shaw.', bobot: 10 },
    ],
  },
];

export const ALL_SCHOOL_BAB: BabLengkap[] = [
  ...SCHOOL_BAB,
  ...SCHOOL_BAB_5,
  ...SCHOOL_BAB_2,
  ...SCHOOL_BAB_3,
  ...SCHOOL_BAB_4,
];
