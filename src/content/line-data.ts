/**
 * Data Madevi Line (Fase 4): 30 profil fiktif, 50 kiriman, 100 komentar, 20 percakapan.
 * SEMUA tokoh fiktif — tidak meniru orang nyata.
 */

export interface ProfilLine {
  id: string;
  nama: string;
  username: string;
  bio: string;
  minat: string[];
}

export interface KirimanLine {
  id: string;
  penulisId: string;
  tipe: 'karya' | 'curhat';
  judul: string;
  isi: string;
  suka: number;
}

export interface KomentarLine {
  id: string;
  kirimanId: string;
  penulisId: string;
  isi: string;
}

export interface PercakapanLine {
  id: string;
  peserta: [string, string];
  pesan: { dari: string; isi: string }[];
}

const NAMA_FIKTIF = [
  'Rina Wulandari', 'Budi Santoso', 'Siti Aminah', 'Agus Prasetyo', 'Dewi Lestari',
  'Joko Susilo', 'Maya Putri', 'Rudi Hartono', 'Nina Kurnia', 'Dedi Saputra',
  'Lina Marlina', 'Eko Wijaya', 'Fitri Handayani', 'Yoga Pratama', 'Rani Puspita',
  'Hendra Gunawan', 'Sari Melati', 'Tono Suharto', 'Wulan Dari', 'Irfan Hakim',
  'Dian Pertiwi', 'Fajar Nugroho', 'Intan Permata', 'Rizky Ramadhan', 'Ayu Lestari',
  'Danu Saputra', 'Nadia Rahma', 'Galih Prakoso', 'Tania Wijaya', 'Bayu Aditya',
  'Citra Ayu', 'Dimas Prasaja', 'Eka Sari', 'Farhan Malik', 'Gita Candra',
];

const MINAT = ['teknologi', 'masakan', 'fotografi', 'musik', 'olahraga', 'buku', 'traveling', 'kerajinan', 'berkebun', 'game'];

export const PROFIL_LINE: ProfilLine[] = NAMA_FIKTIF.map((nama, i) => ({
  id: `line-user-${i + 1}`,
  nama,
  username: nama.toLowerCase().replace(/\s/g, '.') + (i + 1),
  bio: `Pengguna Madevi yang suka berbagi tentang ${MINAT[i % MINAT.length]}.`,
  minat: [MINAT[i % MINAT.length], MINAT[(i + 3) % MINAT.length]],
}));

const JUDUL_KARYA = [
  'Rangkaian Lampu LED Otomatis', 'Resep Rendang Empuk', 'Foto Sunset di Pantai',
  'Lagu Ciptaan: Senja', 'Program Kasir Sederhana', 'Kerajinan dari Botol Bekas',
  'Kebun Hidroponik Mini', 'Desain Poster Kemerdekaan', 'Aplikasi Catatan Harian',
  'Kue Bolu Kukus Mekar', 'Robot Line Follower', 'Cerpen: Hujan Pertama',
  'Infografis Kesehatan', 'Taman Vertikal dari Palet', 'Cover Lagu Akustik',
  'Game Tebak Angka', 'Sambal Terasi Homemade', 'Kaligrafi Nama',
  'Drone Rakitan Sendiri', 'Puisi: Ibu', 'Website Portofolio',
  'Tempe Bacem Manis', 'Lukisan Pemandangan', 'Irigasi Tetes Otomatis', 'Podcast Pertama',
];

const ISI_CURHAT = [
  'Capek kerja lembur terus, tapi butuh buat keluarga. Semangat buat yang sama-sama berjuang!',
  'Anakku demam 3 hari, khawatir banget. Doakan cepat sembuh ya.',
  'Baru di-PHK, bingung mulai dari mana. Ada saran usaha kecil-kecilan?',
  'Skripsian stuck di bab 3, dosen susah dihubungi. Ada yang pernah ngalamin?',
  'Uang belanja makin tipis, harga-harga naik semua. Gimana cara hemat kalian?',
  'Lagi overthinking soal masa depan. Umur 25 belum punya apa-apa.',
  'Ibu sakit, bolak-balik RS. Mohon doanya teman-teman.',
  'Gagal ujian CPNS kedua kalinya. Rasanya mau nyerah.',
  'Baru pindah kota, belum punya teman. Sepi banget rasanya.',
  'Usaha warung sepi pembeli sejak ada minimarket baru. Ada ide?',
  'Anak susah makan, tiap hari drama. Tipsnya dong bunda-bunda.',
  'Kecelakaan motor kemarin, Alhamdulillah selamat. Lebih hati-hati sekarang.',
  'Mau nikah tapi budget pas-pasan. Bagi pengalaman nikah sederhana dong.',
  'Ditinggal teman dekat, rasanya kehilangan banget.',
  'Kerja dari rumah bikin kesepian. Gimana cara tetap waras?',
  'Bapak masuk RS, butuh donor darah golongan O. Info dong.',
  'Nilai anak turun sejak main HP terus. Gimana batasinnya?',
  'Baru mulai jualan online, belum ada yang beli. Semangat!',
  'Hutang pinjol numpuk, nyesel banget. Ada yang pernah lolos?',
  'Mau hijrah, tapi lingkungan tidak mendukung. Minta saran.',
  'Kucing kesayangan hilang 3 hari. Sedih banget.',
  'Lulus kuliah tapi belum dapat kerja 8 bulan. Frustasi.',
  'Rumah kebanjiran lagi. Capek beres-beres terus.',
  'Suami kerja di luar kota, LDR 2 tahun. Kangen.',
  'Mau berhenti merokok, gagal terus. Butuh support system.',
];

const KIRIMAN_TAMBAHAN: KirimanLine[] = [
  { id: 'line-post-51', penulisId: 'line-user-3', tipe: 'karya', judul: 'Tutorial Merajut untuk Pemula', isi: 'Halo! Saya buat panduan merajut: tusuk dasar, pola sederhana, dan tips benang. Cocok untuk isi waktu luang!', suka: 12 },
  { id: 'line-post-52', penulisId: 'line-user-8', tipe: 'karya', judul: 'Aquascape Nano 30cm', isi: 'Aquascape mini di meja kerja: tanaman low-tech, tanpa CO2 injeksi. Biaya total di bawah 300rb!', suka: 18 },
  { id: 'line-post-53', penulisId: 'line-user-14', tipe: 'karya', judul: 'Sketsa Wajah Pensil', isi: 'Belajar sketsa wajah 30 hari: proporsi, shading, dan tekstur kulit. Progress harian saya lampirkan.', suka: 22 },
  { id: 'line-post-54', penulisId: 'line-user-21', tipe: 'karya', judul: 'Kompos dari Sampah Dapur', isi: 'Cara membuat kompos dengan ember bekas: lapisan coklat-hijau, aduk 3 hari sekali, panen 1 bulan.', suka: 9 },
  { id: 'line-post-55', penulisId: 'line-user-27', tipe: 'karya', judul: 'Lagu: Pagi yang Cerah', isi: 'Lagu ciptaan saya tentang semangat pagi. Lirik dan chord gitar saya tulis lengkap!', suka: 15 },
];

export const KIRIMAN_LINE: KirimanLine[] = [
  ...JUDUL_KARYA.map((judul, i) => ({
    id: `line-post-${i + 1}`,
    penulisId: `line-user-${(i % 30) + 1}`,
    tipe: 'karya' as const,
    judul,
    isi: `Halo teman-teman! Saya ingin berbagi karya saya: ${judul}. Dibuat dengan penuh ketelitian dan cinta. Semoga menginspirasi! Silakan komen dan beri masukan ya.`,
    suka: 5 + ((i * 7) % 50),
  })),
  ...ISI_CURHAT.map((isi, i) => ({
    id: `line-post-${26 + i}`,
    penulisId: `line-user-${((i + 5) % 30) + 1}`,
    tipe: 'curhat' as const,
    judul: `Curhat #${i + 1}`,
    isi,
    suka: 3 + ((i * 11) % 40),
  })),
  ...KIRIMAN_TAMBAHAN,
]

const ISI_KOMEN = [
  'Keren banget! Inspiratif.',
  'Semangat ya, kamu pasti bisa!',
  'Makasih sudah berbagi, bermanfaat!',
  'Saya pernah ngalamin juga, sabar ya.',
  'Mau coba juga nih, izin tiru ya.',
  'Tetap semangat, jangan menyerah!',
  'Bagus! Ditunggu karya berikutnya.',
  'Doa terbaik untukmu.',
  'Ini yang saya cari-cari, thanks!',
  'Hebat! Lanjutkan!',
];

export const KOMENTAR_LINE: KomentarLine[] = Array.from({ length: 100 }, (_, i) => ({
  id: `line-comment-${i + 1}`,
  kirimanId: `line-post-${(i % 50) + 1}`,
  penulisId: `line-user-${((i * 7) % 30) + 1}`,
  isi: ISI_KOMEN[i % ISI_KOMEN.length],
}));

export const PERCAKAPAN_LINE: PercakapanLine[] = Array.from({ length: 20 }, (_, i) => {
  const a = `line-user-${(i % 30) + 1}`;
  const b = `line-user-${((i + 7) % 30) + 1}`;
  return {
    id: `line-dm-${i + 1}`,
    peserta: [a, b],
    pesan: [
      { dari: a, isi: 'Halo! Salam kenal ya.' },
      { dari: b, isi: 'Halo juga! Senang berkenalan.' },
      { dari: a, isi: 'Saya lihat kirimanmu menarik, boleh tanya-tanya?' },
      { dari: b, isi: 'Boleh banget! Silakan.' },
    ],
  };
});

const PERCAKAPAN_TAMBAHAN: PercakapanLine[] = [
  {
    id: 'line-dm-21', peserta: ['line-user-2', 'line-user-9'],
    pesan: [
      { dari: 'line-user-2', isi: 'Kak, resep rendangnya boleh dibagi?' },
      { dari: 'line-user-9', isi: 'Boleh! Nanti saya kirim takarannya ya.' },
      { dari: 'line-user-2', isi: 'Makasih banyak! Mau coba buat lebaran.' },
    ],
  },
  {
    id: 'line-dm-22', peserta: ['line-user-5', 'line-user-12'],
    pesan: [
      { dari: 'line-user-5', isi: 'Halo, hidroponiknya pakai nutrisi apa?' },
      { dari: 'line-user-12', isi: 'Pakai AB mix, ppm 800-1000 untuk sayur daun.' },
    ],
  },
  {
    id: 'line-dm-23', peserta: ['line-user-7', 'line-user-19'],
    pesan: [
      { dari: 'line-user-7', isi: 'Semangat ya, saya doakan ibumu cepat sembuh.' },
      { dari: 'line-user-19', isi: 'Aamiin, terima kasih banyak atas doanya.' },
      { dari: 'line-user-7', isi: 'Sama-sama. Kabari kalau butuh bantuan.' },
    ],
  },
  {
    id: 'line-dm-24', peserta: ['line-user-11', 'line-user-25'],
    pesan: [
      { dari: 'line-user-11', isi: 'Posternya keren! Pakai aplikasi apa?' },
      { dari: 'line-user-25', isi: 'Pakai Canva, template gratisan lalu dimodif.' },
    ],
  },
  {
    id: 'line-dm-25', peserta: ['line-user-16', 'line-user-29'],
    pesan: [
      { dari: 'line-user-16', isi: 'Les privatnya masih buka slot?' },
      { dari: 'line-user-29', isi: 'Masih! Hari Selasa dan Kamis sore.' },
      { dari: 'line-user-16', isi: 'Oke, saya daftar untuk Selasa ya.' },
    ],
  },
];

const KIRIMAN_TAMBAHAN_2: KirimanLine[] = [
  { id: 'line-post-56', penulisId: 'line-user-3', tipe: 'curhat', judul: 'Lelah Akhir-akhir Ini', isi: 'Capek banget akhir-akhir ini. Kerjaan numpuk, istirahat kurang. Ada yang punya tips atur waktu?', suka: 12 },
  { id: 'line-post-57', penulisId: 'line-user-8', tipe: 'curhat', judul: 'Anak Susah Makan Sayur', isi: 'Anakku susah makan sayur. Sudah coba berbagai cara. Ibu-ibu di sini ada saran?', suka: 18 },
  { id: 'line-post-58', penulisId: 'line-user-14', tipe: 'curhat', judul: 'Baru Pindah Kota', isi: 'Baru pindah kota, belum punya teman. Rasanya sepi banget.', suka: 25 },
  { id: 'line-post-59', penulisId: 'line-user-21', tipe: 'curhat', judul: 'Usaha Sepi', isi: 'Usaha kecilku sepi pembeli bulan ini. Lagi mikir strategi baru.', suka: 9 },
  { id: 'line-post-60', penulisId: 'line-user-27', tipe: 'curhat', judul: 'Lulus Sertifikasi!', isi: 'Alhamdulillah lulus ujian sertifikasi! Terima kasih buat yang kemarin kasih semangat.', suka: 31 },
];

const KOMENTAR_TAMBAHAN: KomentarLine[] = [
  { id: 'line-cmt-101', kirimanId: 'line-post-56', penulisId: 'line-user-9', isi: 'Coba teknik pomodoro, 25 menit fokus + 5 menit istirahat. Lumayan membantu!' },
  { id: 'line-cmt-102', kirimanId: 'line-post-57', penulisId: 'line-user-12', isi: 'Anakku dulu juga gitu. Coba libatkan dia masak bareng, jadi penasaran.' },
  { id: 'line-cmt-103', kirimanId: 'line-post-58', penulisId: 'line-user-5', isi: 'Semangat! Coba ikut komunitas hobi di kotamu, cepat dapat teman.' },
  { id: 'line-cmt-104', kirimanId: 'line-post-60', penulisId: 'line-user-7', isi: 'Selamat! Kerja kerasmu terbayar.' },
  { id: 'line-cmt-105', kirimanId: 'line-post-59', penulisId: 'line-user-19', isi: 'Coba jualan lewat status WA dan titip di warung tetangga.' },
];

const KOMENTAR_TAMBAHAN_2: KomentarLine[] = [
  { id: 'line-cmt-106', kirimanId: 'line-post-61', penulisId: 'line-user-8', isi: 'Wah boleh nih dicoba akhir pekan!' },
  { id: 'line-cmt-107', kirimanId: 'line-post-63', penulisId: 'line-user-14', isi: 'Murah banget 150rb. Spill toko komponennya dong.' },
  { id: 'line-cmt-108', kirimanId: 'line-post-62', penulisId: 'line-user-19', isi: 'MasyaAllah bagus. Lanjutkan!' },
  { id: 'line-cmt-109', kirimanId: 'line-post-64', penulisId: 'line-user-5', isi: 'Ide bagus buat kos sempit. Izin tiru ya.' },
  { id: 'line-cmt-110', kirimanId: 'line-post-65', penulisId: 'line-user-12', isi: 'Puisinya dalam. Ditunggu karya berikutnya.' },
];

const KOMENTAR_TAMBAHAN_3: KomentarLine[] = [
  { id: 'line-cmt-111', kirimanId: 'line-post-66', penulisId: 'line-user-9', isi: 'Coba ikut tes minat bakat online dulu biar ada gambaran.' },
  { id: 'line-cmt-112', kirimanId: 'line-post-67', penulisId: 'line-user-12', isi: 'Istirahat yang beneran ya, bukan scroll HP. Semangat!' },
  { id: 'line-cmt-113', kirimanId: 'line-post-68', penulisId: 'line-user-19', isi: 'Peluk jauh! Semoga bisa pulang tahun depan.' },
  { id: 'line-cmt-114', kirimanId: 'line-post-69', penulisId: 'line-user-7', isi: 'Kamu pasti bisa! Latihan sekali lagi malam ini.' },
  { id: 'line-cmt-115', kirimanId: 'line-post-70', penulisId: 'line-user-5', isi: 'Alhamdulillah! Ikut senang dengarnya.' },
];

const KOMENTAR_TAMBAHAN_4: KomentarLine[] = [
  { id: 'line-cmt-116', kirimanId: 'line-post-71', penulisId: 'line-user-8', isi: 'Jazakallah khair! Sangat bermanfaat.' },
  { id: 'line-cmt-117', kirimanId: 'line-post-72', penulisId: 'line-user-14', isi: 'Langitnya bagus banget gradasinya.' },
  { id: 'line-cmt-118', kirimanId: 'line-post-73', penulisId: 'line-user-19', isi: 'Praktis! Cocok untuk UMKM.' },
  { id: 'line-cmt-119', kirimanId: 'line-post-74', penulisId: 'line-user-5', isi: 'Kangkungnya subur ya. Mau coba juga.' },
  { id: 'line-cmt-120', kirimanId: 'line-post-75', penulisId: 'line-user-12', isi: 'Suaranya merdu. Lanjutkan berkarya!' },
];

const KOMENTAR_TAMBAHAN_5: KomentarLine[] = [
  { id: 'line-cmt-121', kirimanId: 'line-post-76', penulisId: 'line-user-9', isi: 'Coba tulis jurnal sebelum tidur, lumayan membantu.' },
  { id: 'line-cmt-122', kirimanId: 'line-post-77', penulisId: 'line-user-12', isi: 'Siapkan dana darurat dulu sebelum resign ya.' },
  { id: 'line-cmt-123', kirimanId: 'line-post-78', penulisId: 'line-user-19', isi: 'Semoga cepat sembuh anaknya. Kompres hangat terus.' },
  { id: 'line-cmt-124', kirimanId: 'line-post-79', penulisId: 'line-user-7', isi: 'Semangat! Datangi dosen di jam konsultasi.' },
  { id: 'line-cmt-125', kirimanId: 'line-post-80', penulisId: 'line-user-5', isi: 'Alhamdulillah! Jaga kesehatan ibumu ya.' },
];

const KOMENTAR_TAMBAHAN_6: KomentarLine[] = [
  { id: 'line-cmt-126', kirimanId: 'line-post-81', penulisId: 'line-user-15', isi: 'Gaya kedua cocok buat wajahku. Makasih!' },
  { id: 'line-cmt-127', kirimanId: 'line-post-82', penulisId: 'line-user-22', isi: 'Kreatif banget. Polanya bisa dishare?' },
  { id: 'line-cmt-128', kirimanId: 'line-post-83', penulisId: 'line-user-4', isi: 'Skemanya rapi. Trafo berapa ampere?' },
  { id: 'line-cmt-129', kirimanId: 'line-post-84', penulisId: 'line-user-11', isi: 'Auto coba besok. Bumbunya mantap kayaknya.' },
  { id: 'line-cmt-130', kirimanId: 'line-post-85', penulisId: 'line-user-18', isi: 'Endingnya ngena banget. Ditunggu karya berikutnya.' },
];

const KOMENTAR_TAMBAHAN_7: KomentarLine[] = [
  { id: 'line-cmt-131', kirimanId: 'line-post-86', penulisId: 'line-user-17', isi: 'Fokus ke 1 bab per hari, jangan semua sekaligus.' },
  { id: 'line-cmt-132', kirimanId: 'line-post-87', penulisId: 'line-user-21', isi: 'Ajak ngobrol baik-baik. Biasanya cuma salah paham.' },
  { id: 'line-cmt-133', kirimanId: 'line-post-88', penulisId: 'line-user-25', isi: 'Al-fatihah untuk ayahmu. Semoga husnul khatimah.' },
  { id: 'line-cmt-134', kirimanId: 'line-post-89', penulisId: 'line-user-13', isi: 'Bangkit! Pengalaman 3 tahun itu modal.' },
  { id: 'line-cmt-135', kirimanId: 'line-post-90', penulisId: 'line-user-9', isi: 'Selamat! Tunjukkan yang terbaik di tempat baru.' },
];

const KOMENTAR_TAMBAHAN_8: KomentarLine[] = [
  { id: 'line-cmt-136', kirimanId: 'line-post-91', penulisId: 'line-user-20', isi: 'Suaranya adem. Ditunggu cover berikutnya!' },
  { id: 'line-cmt-137', kirimanId: 'line-post-92', penulisId: 'line-user-23', isi: 'Izin share ke grup WA ya.' },
  { id: 'line-cmt-138', kirimanId: 'line-post-93', penulisId: 'line-user-24', isi: 'Sensornya pakai apa? Bagi link belinya dong.' },
  { id: 'line-cmt-139', kirimanId: 'line-post-94', penulisId: 'line-user-26', isi: 'Teksturnya lembut banget. Resepnya mantap.' },
  { id: 'line-cmt-140', kirimanId: 'line-post-95', penulisId: 'line-user-27', isi: 'Setuju! Pendidikan desa butuh perhatian serius.' },
];

const KOMENTAR_TAMBAHAN_9: KomentarLine[] = [
  { id: 'line-cmt-141', kirimanId: 'line-post-96', penulisId: 'line-user-28', isi: 'Coba variasikan bentuk & warna makanan.' },
  { id: 'line-cmt-142', kirimanId: 'line-post-97', penulisId: 'line-user-29', isi: 'Lapor RT dulu, ada aturannya soal kebisingan.' },
  { id: 'line-cmt-143', kirimanId: 'line-post-98', penulisId: 'line-user-30', isi: 'Selamat! Gelar barunya berkah.' },
  { id: 'line-cmt-144', kirimanId: 'line-post-99', penulisId: 'line-user-31', isi: 'Semoga cepat ketemu. Kunci ganda lain kali.' },
  { id: 'line-cmt-145', kirimanId: 'line-post-100', penulisId: 'line-user-32', isi: 'Sama-sama! Makin solid komunitasnya.' },
];

const KOMENTAR_TAMBAHAN_10: KomentarLine[] = [
  { id: 'line-cmt-146', kirimanId: 'line-post-101', penulisId: 'line-user-33', isi: 'Merdu! Lanjutin seri covernya.' },
  { id: 'line-cmt-147', kirimanId: 'line-post-102', penulisId: 'line-user-34', isi: 'Desainnya clean. Fontnya apa?' },
  { id: 'line-cmt-148', kirimanId: 'line-post-103', penulisId: 'line-user-35', isi: 'Keren! Total biaya berapa?' },
  { id: 'line-cmt-149', kirimanId: 'line-post-104', penulisId: 'line-user-1', isi: 'Plotnya menjanjikan. Lanjut bab 2!' },
  { id: 'line-cmt-150', kirimanId: 'line-post-105', penulisId: 'line-user-2', isi: 'Setuju, pendidikan desa butuh perhatian.' },
];

const KOMENTAR_TAMBAHAN_11: KomentarLine[] = [
  { id: 'line-cmt-151', kirimanId: 'line-post-106', penulisId: 'line-user-3', isi: 'Sajikan dengan bentuk lucu, anak suka.' },
  { id: 'line-cmt-152', kirimanId: 'line-post-107', penulisId: 'line-user-4', isi: 'Rekam sebagai bukti, lapor berjenjang.' },
  { id: 'line-cmt-153', kirimanId: 'line-post-108', penulisId: 'line-user-5', isi: 'Luar biasa! Inspirasi buat kami.' },
  { id: 'line-cmt-154', kirimanId: 'line-post-109', penulisId: 'line-user-6', isi: 'Cek CCTV sekitar, semoga ada petunjuk.' },
  { id: 'line-cmt-155', kirimanId: 'line-post-110', penulisId: 'line-user-7', isi: 'Setuju! Komunitas terbaik.' },
];

const KOMENTAR_TAMBAHAN_12: KomentarLine[] = [
  { id: 'line-cmt-156', kirimanId: 'line-post-111', penulisId: 'line-user-8', isi: 'Lukisannya hidup! Teknik apa?' },
  { id: 'line-cmt-157', kirimanId: 'line-post-112', penulisId: 'line-user-9', isi: 'Resepnya simpel, akan dicoba.' },
  { id: 'line-cmt-158', kirimanId: 'line-post-113', penulisId: 'line-user-10', isi: 'Semangat! Komunitas mendukungmu.' },
  { id: 'line-cmt-159', kirimanId: 'line-post-114', penulisId: 'line-user-11', isi: 'Hasilnya rapi banget.' },
  { id: 'line-cmt-160', kirimanId: 'line-post-115', penulisId: 'line-user-12', isi: 'Bagus! Lanjut berkarya.' },
];

const KOMENTAR_TAMBAHAN_13: KomentarLine[] = [
  { id: 'line-cmt-161', kirimanId: 'line-post-116', penulisId: 'line-user-13', isi: 'Coba variasikan tekstur makanan.' },
  { id: 'line-cmt-162', kirimanId: 'line-post-117', penulisId: 'line-user-14', isi: 'Buat list pro-kontra, bantu memutuskan.' },
  { id: 'line-cmt-163', kirimanId: 'line-post-118', penulisId: 'line-user-15', isi: 'Bawa mainan favorit bayi.' },
  { id: 'line-cmt-164', kirimanId: 'line-post-119', penulisId: 'line-user-16', isi: 'Semangat! Tinggal sedikit lagi.' },
  { id: 'line-cmt-165', kirimanId: 'line-post-120', penulisId: 'line-user-17', isi: 'Setuju, komunitas terbaik!' },
];

const KOMENTAR_TAMBAHAN_14: KomentarLine[] = [
  { id: 'line-cmt-166', kirimanId: 'line-post-121', penulisId: 'line-user-18', isi: 'Puisinya menyentuh!' },
  { id: 'line-cmt-167', kirimanId: 'line-post-122', penulisId: 'line-user-19', isi: 'Kemasannya premium.' },
  { id: 'line-cmt-168', kirimanId: 'line-post-123', penulisId: 'line-user-20', isi: 'Bisa buat tutorialnya?' },
  { id: 'line-cmt-169', kirimanId: 'line-post-124', penulisId: 'line-user-21', isi: 'Ditunggu cerpen berikutnya!' },
  { id: 'line-cmt-170', kirimanId: 'line-post-125', penulisId: 'line-user-22', isi: 'Vlognya informatif.' },
];

const KOMENTAR_TAMBAHAN_15: KomentarLine[] = [
  { id: 'line-cmt-171', kirimanId: 'line-post-126', penulisId: 'line-user-23', isi: 'Sajikan bersama, jangan dipaksa.' },
  { id: 'line-cmt-172', kirimanId: 'line-post-127', penulisId: 'line-user-24', isi: 'Hitung tabungan 6 bulan dulu.' },
  { id: 'line-cmt-173', kirimanId: 'line-post-128', penulisId: 'line-user-25', isi: 'Bawa perlengkapan lengkap.' },
  { id: 'line-cmt-174', kirimanId: 'line-post-129', penulisId: 'line-user-26', isi: 'Kamu pasti bisa!' },
  { id: 'line-cmt-175', kirimanId: 'line-post-130', penulisId: 'line-user-27', isi: 'Luar biasa!' },
];

const KOMENTAR_TAMBAHAN_16: KomentarLine[] = [
  { id: 'line-cmt-176', kirimanId: 'line-post-131', penulisId: 'line-user-28', isi: 'Detailnya keren!' },
  { id: 'line-cmt-177', kirimanId: 'line-post-132', penulisId: 'line-user-29', isi: 'Warna yang pas.' },
  { id: 'line-cmt-178', kirimanId: 'line-post-133', penulisId: 'line-user-30', isi: 'Enak didengar.' },
  { id: 'line-cmt-179', kirimanId: 'line-post-134', penulisId: 'line-user-31', isi: 'Sangat membantu!' },
  { id: 'line-cmt-180', kirimanId: 'line-post-135', penulisId: 'line-user-32', isi: 'Akan dicoba!' },
];

const KOMENTAR_TAMBAHAN_17: KomentarLine[] = [
  { id: 'line-cmt-181', kirimanId: 'line-post-141', penulisId: 'line-user-29', isi: 'Style-nya unik!' },
  { id: 'line-cmt-182', kirimanId: 'line-post-142', penulisId: 'line-user-30', isi: 'Profesional banget.' },
  { id: 'line-cmt-183', kirimanId: 'line-post-143', penulisId: 'line-user-31', isi: 'Keren aransemennya.' },
  { id: 'line-cmt-184', kirimanId: 'line-post-144', penulisId: 'line-user-32', isi: 'Sudah diunduh, thanks!' },
  { id: 'line-cmt-185', kirimanId: 'line-post-145', penulisId: 'line-user-33', isi: 'Sambalnya nendang!' },
];

const KOMENTAR_TAMBAHAN_18: KomentarLine[] = [
  { id: 'line-cmt-186', kirimanId: 'line-post-151', penulisId: 'line-user-30', isi: 'Menyentuh puisinya.' },
  { id: 'line-cmt-187', kirimanId: 'line-post-152', penulisId: 'line-user-31', isi: 'Mirip banget!' },
  { id: 'line-cmt-188', kirimanId: 'line-post-153', penulisId: 'line-user-32', isi: 'Suaranya bagus.' },
  { id: 'line-cmt-189', kirimanId: 'line-post-154', penulisId: 'line-user-33', isi: 'Desainnya clean.' },
  { id: 'line-cmt-190', kirimanId: 'line-post-155', penulisId: 'line-user-34', isi: 'Lanjut part 2 dong!' },
];

const KOMENTAR_TAMBAHAN_19: KomentarLine[] = [
  { id: 'line-cmt-191', kirimanId: 'line-post-156', penulisId: 'line-user-29', isi: 'Semoga segera cair.' },
  { id: 'line-cmt-192', kirimanId: 'line-post-157', penulisId: 'line-user-30', isi: 'Lapor RT aja.' },
  { id: 'line-cmt-193', kirimanId: 'line-post-158', penulisId: 'line-user-31', isi: 'Syukurlah ada yang bantu.' },
  { id: 'line-cmt-194', kirimanId: 'line-post-159', penulisId: 'line-user-32', isi: 'Tetap semangat!' },
  { id: 'line-cmt-195', kirimanId: 'line-post-160', penulisId: 'line-user-33', isi: 'Semoga cepat surut.' },
];

const KOMENTAR_TAMBAHAN_20: KomentarLine[] = [
  { id: 'line-cmt-196', kirimanId: 'line-post-161', penulisId: 'line-user-30', isi: 'Indah banget!' },
  { id: 'line-cmt-197', kirimanId: 'line-post-162', penulisId: 'line-user-31', isi: 'Akan dicoba akhir pekan.' },
  { id: 'line-cmt-198', kirimanId: 'line-post-163', penulisId: 'line-user-32', isi: 'Gampang diikuti.' },
  { id: 'line-cmt-199', kirimanId: 'line-post-164', penulisId: 'line-user-33', isi: 'Sudah disimpan playlistnya.' },
  { id: 'line-cmt-200', kirimanId: 'line-post-165', penulisId: 'line-user-34', isi: 'Inspiratif!' },
];

const KOMENTAR_TAMBAHAN_21: KomentarLine[] = [
  { id: 'line-cmt-201', kirimanId: 'line-post-166', penulisId: 'line-user-29', isi: 'Sabar ya, macet memang.' },
  { id: 'line-cmt-202', kirimanId: 'line-post-167', penulisId: 'line-user-30', isi: 'Lacak via Find My Device.' },
  { id: 'line-cmt-203', kirimanId: 'line-post-168', penulisId: 'line-user-31', isi: 'Cek ke PLN.' },
  { id: 'line-cmt-204', kirimanId: 'line-post-169', penulisId: 'line-user-32', isi: 'Coba tahun depan lagi.' },
  { id: 'line-cmt-205', kirimanId: 'line-post-170', penulisId: 'line-user-33', isi: 'Cepat sembuh ya!' },
];

const KOMENTAR_TAMBAHAN_22: KomentarLine[] = [
  { id: 'line-cmt-206', kirimanId: 'line-post-171', penulisId: 'line-user-34', isi: 'Keren! Lanjutkan.' },
  { id: 'line-cmt-207', kirimanId: 'line-post-172', penulisId: 'line-user-35', isi: 'Indah puisinya.' },
  { id: 'line-cmt-208', kirimanId: 'line-post-173', penulisId: 'line-user-29', isi: 'Detail banget!' },
  { id: 'line-cmt-209', kirimanId: 'line-post-174', penulisId: 'line-user-30', isi: 'Mau coba resepnya.' },
  { id: 'line-cmt-210', kirimanId: 'line-post-175', penulisId: 'line-user-31', isi: 'Kreatif!' },
];

const KOMENTAR_TAMBAHAN_23: KomentarLine[] = [
  { id: 'line-cmt-211', kirimanId: 'line-post-176', penulisId: 'line-user-32', isi: 'Jaga kesehatan ya.' },
  { id: 'line-cmt-212', kirimanId: 'line-post-177', penulisId: 'line-user-33', isi: 'Semoga cepat sembuh.' },
  { id: 'line-cmt-213', kirimanId: 'line-post-178', penulisId: 'line-user-34', isi: 'Lapor RT saja.' },
  { id: 'line-cmt-214', kirimanId: 'line-post-179', penulisId: 'line-user-35', isi: 'Besok mulai lagi!' },
  { id: 'line-cmt-215', kirimanId: 'line-post-180', penulisId: 'line-user-29', isi: 'Beli jas hujan baru.' },
];

const KOMENTAR_TAMBAHAN_24: KomentarLine[] = [
  { id: 'line-cmt-216', kirimanId: 'line-post-181', penulisId: 'line-user-32', isi: 'Suaranya bagus!' },
  { id: 'line-cmt-217', kirimanId: 'line-post-182', penulisId: 'line-user-33', isi: 'Lanjut part 2!' },
  { id: 'line-cmt-218', kirimanId: 'line-post-183', penulisId: 'line-user-34', isi: 'Berguna banget.' },
  { id: 'line-cmt-219', kirimanId: 'line-post-184', penulisId: 'line-user-35', isi: 'Bagi resepnya dong.' },
  { id: 'line-cmt-220', kirimanId: 'line-post-185', penulisId: 'line-user-29', isi: 'Cantik tamannya.' },
];

const KOMENTAR_TAMBAHAN_25: KomentarLine[] = [
  { id: 'line-cmt-221', kirimanId: 'line-post-186', penulisId: 'line-user-30', isi: 'Tetap semangat!' },
  { id: 'line-cmt-222', kirimanId: 'line-post-187', penulisId: 'line-user-31', isi: 'Panggil bengkel.' },
  { id: 'line-cmt-223', kirimanId: 'line-post-188', penulisId: 'line-user-32', isi: 'Panggil tukang kunci.' },
  { id: 'line-cmt-224', kirimanId: 'line-post-189', penulisId: 'line-user-33', isi: 'Backup ke cloud lain kali.' },
  { id: 'line-cmt-225', kirimanId: 'line-post-190', penulisId: 'line-user-34', isi: 'Semoga cepat surut.' },
];

const KOMENTAR_TAMBAHAN_26: KomentarLine[] = [
  { id: 'line-cmt-226', kirimanId: 'line-post-191', penulisId: 'line-user-35', isi: 'Mirip banget!' },
  { id: 'line-cmt-227', kirimanId: 'line-post-192', penulisId: 'line-user-29', isi: 'Mudah diikuti.' },
  { id: 'line-cmt-228', kirimanId: 'line-post-193', penulisId: 'line-user-30', isi: 'Enak didengar.' },
  { id: 'line-cmt-229', kirimanId: 'line-post-194', penulisId: 'line-user-31', isi: 'Pedasnya nampol!' },
  { id: 'line-cmt-230', kirimanId: 'line-post-195', penulisId: 'line-user-32', isi: 'Sejuk dilihat.' },
];

const KOMENTAR_TAMBAHAN_27: KomentarLine[] = [
  { id: 'line-cmt-231', kirimanId: 'line-post-201', penulisId: 'line-user-29', isi: 'Indah sekali.' },
  { id: 'line-cmt-232', kirimanId: 'line-post-202', penulisId: 'line-user-30', isi: 'Warnanya hidup.' },
  { id: 'line-cmt-233', kirimanId: 'line-post-203', penulisId: 'line-user-31', isi: 'Menyentuh.' },
  { id: 'line-cmt-234', kirimanId: 'line-post-204', penulisId: 'line-user-32', isi: 'Kreatif!' },
  { id: 'line-cmt-235', kirimanId: 'line-post-205', penulisId: 'line-user-33', isi: 'Bagi resep dong.' },
];

const KOMENTAR_TAMBAHAN_28: KomentarLine[] = [
  { id: 'line-cmt-236', kirimanId: 'line-post-211', penulisId: 'line-user-34', isi: 'Seram!' },
  { id: 'line-cmt-237', kirimanId: 'line-post-212', penulisId: 'line-user-35', isi: 'Detail banget.' },
  { id: 'line-cmt-238', kirimanId: 'line-post-213', penulisId: 'line-user-29', isi: 'Suaranya bagus.' },
  { id: 'line-cmt-239', kirimanId: 'line-post-214', penulisId: 'line-user-30', isi: 'Desainnya rapi.' },
  { id: 'line-cmt-240', kirimanId: 'line-post-215', penulisId: 'line-user-31', isi: 'Lapar lihatnya.' },
];

const KOMENTAR_TAMBAHAN_29: KomentarLine[] = [
  { id: 'line-cmt-241', kirimanId: 'line-post-221', penulisId: 'line-user-29', isi: 'Bagus sekali.' },
  { id: 'line-cmt-242', kirimanId: 'line-post-222', penulisId: 'line-user-30', isi: 'Mau belajar.' },
  { id: 'line-cmt-243', kirimanId: 'line-post-223', penulisId: 'line-user-31', isi: 'Asyik didengar.' },
  { id: 'line-cmt-244', kirimanId: 'line-post-224', penulisId: 'line-user-32', isi: 'Enak!' },
  { id: 'line-cmt-245', kirimanId: 'line-post-225', penulisId: 'line-user-33', isi: 'Sejuk.' },
];

const KOMENTAR_TAMBAHAN_30: KomentarLine[] = [
  { id: 'line-cmt-246', kirimanId: 'line-post-231', penulisId: 'line-user-34', isi: 'Indah.' },
  { id: 'line-cmt-247', kirimanId: 'line-post-232', penulisId: 'line-user-35', isi: 'Keren!' },
  { id: 'line-cmt-248', kirimanId: 'line-post-233', penulisId: 'line-user-29', isi: 'Merdu.' },
  { id: 'line-cmt-249', kirimanId: 'line-post-234', penulisId: 'line-user-30', isi: 'Kreatif.' },
  { id: 'line-cmt-250', kirimanId: 'line-post-235', penulisId: 'line-user-31', isi: 'Mau coba.' },
];

const KOMENTAR_TAMBAHAN_31: KomentarLine[] = [
  { id: 'line-cmt-251', kirimanId: 'line-post-241', penulisId: 'line-user-37', isi: 'Bagus.' },
  { id: 'line-cmt-252', kirimanId: 'line-post-242', penulisId: 'line-user-38', isi: 'Seram!' },
  { id: 'line-cmt-253', kirimanId: 'line-post-243', penulisId: 'line-user-39', isi: 'Enak didengar.' },
  { id: 'line-cmt-254', kirimanId: 'line-post-244', penulisId: 'line-user-40', isi: 'Rapi.' },
  { id: 'line-cmt-255', kirimanId: 'line-post-245', penulisId: 'line-user-36', isi: 'Profesional.' },
];

const KOMENTAR_TAMBAHAN_32: KomentarLine[] = [
  { id: 'line-cmt-256', kirimanId: 'line-post-251', penulisId: 'line-user-37', isi: 'Mirip.' },
  { id: 'line-cmt-257', kirimanId: 'line-post-252', penulisId: 'line-user-38', isi: 'Menyentuh.' },
  { id: 'line-cmt-258', kirimanId: 'line-post-253', penulisId: 'line-user-39', isi: 'Detail.' },
  { id: 'line-cmt-259', kirimanId: 'line-post-254', penulisId: 'line-user-40', isi: 'Enak.' },
  { id: 'line-cmt-260', kirimanId: 'line-post-255', penulisId: 'line-user-36', isi: 'Indah.' },
];

const KOMENTAR_TAMBAHAN_33: KomentarLine[] = [
  { id: 'line-cmt-261', kirimanId: 'line-post-261', penulisId: 'line-user-37', isi: 'Bagus.' },
  { id: 'line-cmt-262', kirimanId: 'line-post-262', penulisId: 'line-user-38', isi: 'Lucu.' },
  { id: 'line-cmt-263', kirimanId: 'line-post-263', penulisId: 'line-user-39', isi: 'Mau coba.' },
  { id: 'line-cmt-264', kirimanId: 'line-post-264', penulisId: 'line-user-40', isi: 'Rapi.' },
  { id: 'line-cmt-265', kirimanId: 'line-post-265', penulisId: 'line-user-36', isi: 'Keren.' },
];

const KOMENTAR_TAMBAHAN_34: KomentarLine[] = [
  { id: 'line-cmt-266', kirimanId: 'line-post-271', penulisId: 'line-user-32', isi: 'Ceritanya bagus.' },
  { id: 'line-cmt-267', kirimanId: 'line-post-272', penulisId: 'line-user-33', isi: 'Momennya pas.' },
  { id: 'line-cmt-268', kirimanId: 'line-post-273', penulisId: 'line-user-34', isi: 'Suaranya merdu.' },
  { id: 'line-cmt-269', kirimanId: 'line-post-274', penulisId: 'line-user-35', isi: 'Rajin sekali.' },
  { id: 'line-cmt-270', kirimanId: 'line-post-275', penulisId: 'line-user-36', isi: 'Data jelas.' },
];

const KOMENTAR_TAMBAHAN_35: KomentarLine[] = [
  { id: 'line-cmt-271', kirimanId: 'line-post-281', penulisId: 'line-user-32', isi: 'Puisinya menyentuh.' },
  { id: 'line-cmt-272', kirimanId: 'line-post-282', penulisId: 'line-user-33', isi: 'Mirip sekali.' },
  { id: 'line-cmt-273', kirimanId: 'line-post-283', penulisId: 'line-user-34', isi: 'Mau resepnya.' },
  { id: 'line-cmt-274', kirimanId: 'line-post-284', penulisId: 'line-user-35', isi: 'Enak kelihatannya.' },
  { id: 'line-cmt-275', kirimanId: 'line-post-285', penulisId: 'line-user-36', isi: 'Indah tulisannya.' },
];

const KOMENTAR_TAMBAHAN_36: KomentarLine[] = [
  { id: 'line-cmt-276', kirimanId: 'line-post-291', penulisId: 'line-user-32', isi: 'Logonya keren.' },
  { id: 'line-cmt-277', kirimanId: 'line-post-292', penulisId: 'line-user-33', isi: 'Sinematik.' },
  { id: 'line-cmt-278', kirimanId: 'line-post-293', penulisId: 'line-user-34', isi: 'Menyentuh.' },
  { id: 'line-cmt-279', kirimanId: 'line-post-294', penulisId: 'line-user-35', isi: 'Rapih anyamannya.' },
  { id: 'line-cmt-280', kirimanId: 'line-post-295', penulisId: 'line-user-36', isi: 'Seram tapi bagus.' },
];

const KOMENTAR_TAMBAHAN_37: KomentarLine[] = [
  { id: 'line-cmt-281', kirimanId: 'line-post-301', penulisId: 'line-user-32', isi: 'Desainnya oke.' },
  { id: 'line-cmt-282', kirimanId: 'line-post-302', penulisId: 'line-user-33', isi: 'Indah banget.' },
  { id: 'line-cmt-283', kirimanId: 'line-post-303', penulisId: 'line-user-34', isi: 'Mau coba masak.' },
  { id: 'line-cmt-284', kirimanId: 'line-post-304', penulisId: 'line-user-35', isi: 'Seru vlognya.' },
  { id: 'line-cmt-285', kirimanId: 'line-post-305', penulisId: 'line-user-36', isi: 'Bagus pantunnya.' },
];

const KOMENTAR_TAMBAHAN_38: KomentarLine[] = [
  { id: 'line-cmt-286', kirimanId: 'line-post-306', penulisId: 'line-user-37', isi: 'Semangat.' },
  { id: 'line-cmt-287', kirimanId: 'line-post-307', penulisId: 'line-user-38', isi: 'Coba lagi.' },
  { id: 'line-cmt-288', kirimanId: 'line-post-308', penulisId: 'line-user-39', isi: 'Ke dokter ya.' },
  { id: 'line-cmt-289', kirimanId: 'line-post-311', penulisId: 'line-user-40', isi: 'Bagus bannernya.' },
  { id: 'line-cmt-290', kirimanId: 'line-post-312', penulisId: 'line-user-36', isi: 'Keren lukisannya.' },
];

const KOMENTAR_TAMBAHAN_39: KomentarLine[] = [
  { id: 'line-cmt-291', kirimanId: 'line-post-316', penulisId: 'line-user-38', isi: 'Sabar ya.' },
  { id: 'line-cmt-292', kirimanId: 'line-post-317', penulisId: 'line-user-39', isi: 'Lapor PLN.' },
  { id: 'line-cmt-293', kirimanId: 'line-post-318', penulisId: 'line-user-40', isi: 'Pulang gih.' },
  { id: 'line-cmt-294', kirimanId: 'line-post-321', penulisId: 'line-user-36', isi: 'Cantik undangannya.' },
  { id: 'line-cmt-295', kirimanId: 'line-post-322', penulisId: 'line-user-37', isi: 'Mau resepnya.' },
];

const KOMENTAR_TAMBAHAN_40: KomentarLine[] = [
  { id: 'line-cmt-296', kirimanId: 'line-post-326', penulisId: 'line-user-39', isi: 'Semangat antre.' },
  { id: 'line-cmt-297', kirimanId: 'line-post-327', penulisId: 'line-user-40', isi: 'Reset pabrik coba.' },
  { id: 'line-cmt-298', kirimanId: 'line-post-328', penulisId: 'line-user-36', isi: 'Video call gih.' },
  { id: 'line-cmt-299', kirimanId: 'line-post-331', penulisId: 'line-user-37', isi: 'Bagus logonya.' },
  { id: 'line-cmt-300', kirimanId: 'line-post-332', penulisId: 'line-user-38', isi: 'Enak kayaknya.' },
];

const KOMENTAR_TAMBAHAN_41: KomentarLine[] = [
  { id: 'line-cmt-306', kirimanId: 'line-post-351', penulisId: 'line-user-36', isi: 'Keren desainnya.' },
  { id: 'line-cmt-307', kirimanId: 'line-post-352', penulisId: 'line-user-37', isi: 'Resepnya mantap.' },
  { id: 'line-cmt-308', kirimanId: 'line-post-353', penulisId: 'line-user-38', isi: 'Indah banget.' },
  { id: 'line-cmt-309', kirimanId: 'line-post-354', penulisId: 'line-user-39', isi: 'Menyentuh.' },
  { id: 'line-cmt-310', kirimanId: 'line-post-355', penulisId: 'line-user-40', isi: 'Bagus khatnya.' },
];

export const SEMUA_KOMENTAR: KomentarLine[] = [...KOMENTAR_LINE, ...KOMENTAR_TAMBAHAN, ...KOMENTAR_TAMBAHAN_2, ...KOMENTAR_TAMBAHAN_3, ...KOMENTAR_TAMBAHAN_4, ...KOMENTAR_TAMBAHAN_5, ...KOMENTAR_TAMBAHAN_6, ...KOMENTAR_TAMBAHAN_7, ...KOMENTAR_TAMBAHAN_8, ...KOMENTAR_TAMBAHAN_9, ...KOMENTAR_TAMBAHAN_10, ...KOMENTAR_TAMBAHAN_11, ...KOMENTAR_TAMBAHAN_12, ...KOMENTAR_TAMBAHAN_13, ...KOMENTAR_TAMBAHAN_14, ...KOMENTAR_TAMBAHAN_15, ...KOMENTAR_TAMBAHAN_16, ...KOMENTAR_TAMBAHAN_17, ...KOMENTAR_TAMBAHAN_18, ...KOMENTAR_TAMBAHAN_19, ...KOMENTAR_TAMBAHAN_20, ...KOMENTAR_TAMBAHAN_21, ...KOMENTAR_TAMBAHAN_22, ...KOMENTAR_TAMBAHAN_23, ...KOMENTAR_TAMBAHAN_24, ...KOMENTAR_TAMBAHAN_25, ...KOMENTAR_TAMBAHAN_26, ...KOMENTAR_TAMBAHAN_27, ...KOMENTAR_TAMBAHAN_28, ...KOMENTAR_TAMBAHAN_29, ...KOMENTAR_TAMBAHAN_30, ...KOMENTAR_TAMBAHAN_31, ...KOMENTAR_TAMBAHAN_32, ...KOMENTAR_TAMBAHAN_33, ...KOMENTAR_TAMBAHAN_34, ...KOMENTAR_TAMBAHAN_35, ...KOMENTAR_TAMBAHAN_36, ...KOMENTAR_TAMBAHAN_37, ...KOMENTAR_TAMBAHAN_38, ...KOMENTAR_TAMBAHAN_39, ...KOMENTAR_TAMBAHAN_40, ...KOMENTAR_TAMBAHAN_41];

const KIRIMAN_TAMBAHAN_3: KirimanLine[] = [
  { id: 'line-post-61', penulisId: 'line-user-31', tipe: 'karya', judul: 'Resep Ayam Goreng Lengkuas', isi: 'Ayam goreng lengkuas ala rumahan: bumbu halus, ungkep 30 menit, goreng sampai keemasan. Dijamin nagih!', suka: 20 },
  { id: 'line-post-62', penulisId: 'line-user-32', tipe: 'karya', judul: 'Kaligrafi Arab Pemula', isi: 'Belajar kaligrafi naskhi: alat yang dipakai, latihan huruf dasar, dan contoh karya pertama saya.', suka: 16 },
  { id: 'line-post-63', penulisId: 'line-user-33', tipe: 'karya', judul: 'Robot Line Follower', isi: 'Robot pengikut garis dari Arduino: skema rangkaian, kode, dan video ujinya. Total biaya 150rb!', suka: 28 },
  { id: 'line-post-64', penulisId: 'line-user-34', tipe: 'karya', judul: 'Taman Vertikal Botol Bekas', isi: 'Vertical garden dari botol bekas: hemat tempat, cocok untuk kos. Panduan lengkap dengan foto.', suka: 14 },
  { id: 'line-post-65', penulisId: 'line-user-35', tipe: 'karya', judul: 'Puisi: Hujan di Ujung Senja', isi: 'Sebuah puisi tentang rindu dan hujan. Silakan dibaca dan dikritik ya!', suka: 11 },
];

const KIRIMAN_TAMBAHAN_4: KirimanLine[] = [
  { id: 'line-post-66', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Galau Pilih Jurusan', isi: 'Bingung pilih jurusan kuliah. Minat ke desain tapi ortu mau akuntansi. Ada yang pernah di posisi ini?', suka: 17 },
  { id: 'line-post-67', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Burnout Kerja', isi: 'Setiap Senin rasanya berat banget. Apakah ini burnout atau cuma malas?', suka: 22 },
  { id: 'line-post-68', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Kangen Kampung', isi: 'Merantau 3 tahun, kangen masakan ibu. Tahun ini belum bisa pulang.', suka: 19 },
  { id: 'line-post-69', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Takut Presentasi', isi: 'Besok presentasi depan direksi. Jantung dag-dig-dug dari sekarang.', suka: 13 },
  { id: 'line-post-70', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Syukur Hari Ini', isi: 'Hari ini dapat kabar baik: beasiswa lolos tahap 1! Doakan lanjutannya ya.', suka: 27 },
];

const KIRIMAN_TAMBAHAN_5: KirimanLine[] = [
  { id: 'line-post-71', penulisId: 'line-user-31', tipe: 'karya', judul: 'Desain Poster Dakwah', isi: 'Poster dakwah mingguan: tipografi arab + terjemahan. Template saya bagikan gratis!', suka: 18 },
  { id: 'line-post-72', penulisId: 'line-user-32', tipe: 'karya', judul: 'Lukisan Cat Air Senja', isi: 'Lukisan senja di pantai: teknik wet-on-wet untuk langit gradasi.', suka: 24 },
  { id: 'line-post-73', penulisId: 'line-user-33', tipe: 'karya', judul: 'Aplikasi Kasir Sederhana', isi: 'Aplikasi kasir warung pakai spreadsheet: stok, transaksi, laporan otomatis.', suka: 21 },
  { id: 'line-post-74', penulisId: 'line-user-34', tipe: 'karya', judul: 'Kebun Hidroponik Balkon', isi: 'Hidroponik wick system di balkon 2x1m: panen kangkung 3 minggu!', suka: 16 },
  { id: 'line-post-75', penulisId: 'line-user-35', tipe: 'karya', judul: 'Cover Lagu Akustik', isi: 'Cover akustik lagu favorit: gitar + vokal, direkam pakai HP.', suka: 13 },
];

const KIRIMAN_TAMBAHAN_6: KirimanLine[] = [
  { id: 'line-post-76', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Overthinking Malam Hari', isi: 'Tiap malam pikiran muter terus. Ada yang punya cara biar bisa tidur tenang?', suka: 15 },
  { id: 'line-post-77', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Dilema Resign', isi: 'Kerjaan tidak nyaman tapi takut resign karena belum ada pengganti. Saran?', suka: 20 },
  { id: 'line-post-78', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Anak Demam', isi: 'Anak demam 39 derajat dari semalam. Sudah dikompres. Kapan harus ke dokter ya?', suka: 23 },
  { id: 'line-post-79', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Skripsi Mandek', isi: 'Bab 3 tidak kelar-kelar. Dosen susah dihubungi. Stress!', suka: 18 },
  { id: 'line-post-80', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Alhamdulillah Sembuh', isi: 'Ibu sudah keluar RS. Terima kasih untuk doa-doa kalian semua.', suka: 30 },
];

const KIRIMAN_TAMBAHAN_7: KirimanLine[] = [
  { id: 'line-post-81', penulisId: 'line-user-31', tipe: 'karya', judul: 'Tutorial Hijab Segiempat', isi: '3 gaya hijab segiempat simple untuk kuliah: 5 menit jadi!', suka: 19 },
  { id: 'line-post-82', penulisId: 'line-user-32', tipe: 'karya', judul: 'Daur Ulang Kardus', isi: 'Kardus bekas jadi rak mini: potong, lem, cat. Tutorial lengkap dengan pola.', suka: 15 },
  { id: 'line-post-83', penulisId: 'line-user-33', tipe: 'karya', judul: 'Skema Power Supply', isi: 'Power supply variabel 0-30V: skema, daftar komponen, dan hasil pengujian.', suka: 22 },
  { id: 'line-post-84', penulisId: 'line-user-34', tipe: 'karya', judul: 'Resep Seblak Kuah', isi: 'Seblak kuah pedas manis: takaran bumbu untuk 2 porsi.', suka: 25 },
  { id: 'line-post-85', penulisId: 'line-user-35', tipe: 'karya', judul: 'Cerpen: Surat Terakhir', isi: 'Cerpen tentang perpisahan dan keikhlasan. Kritik dan saran ditunggu!', suka: 12 },
];

const KIRIMAN_TAMBAHAN_8: KirimanLine[] = [
  { id: 'line-post-86', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Takut Gagal Ujian', isi: 'Ujian tinggal seminggu, materi belum dikuasai. Panik!', suka: 14 },
  { id: 'line-post-87', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Konflik dengan Rekan Kerja', isi: 'Selisih paham dengan rekan sekantor. Suasana jadi awkward.', suka: 11 },
  { id: 'line-post-88', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Rindu Ayah', isi: 'Ayah sudah tiada 2 tahun. Tiap hujan ingat beliau.', suka: 26 },
  { id: 'line-post-89', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Usaha Bangkrut', isi: 'Warung tutup setelah 3 tahun. Sedih tapi harus bangkit.', suka: 19 },
  { id: 'line-post-90', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Dapat Kerja!', isi: 'Setelah 4 bulan nganggur akhirnya diterima kerja! Terima kasih dukungannya.', suka: 32 },
];

const KIRIMAN_TAMBAHAN_9: KirimanLine[] = [
  { id: 'line-post-91', penulisId: 'line-user-26', tipe: 'karya', judul: 'Kaligrafi Asmaul Husna', isi: 'Kaligrafi digital 99 Asmaul Husna. Free untuk wallpaper HP.', suka: 28 },
  { id: 'line-post-92', penulisId: 'line-user-27', tipe: 'karya', judul: 'Aplikasi Kas Kecil', isi: 'App Android pencatatan kas warung. Source code open.', suka: 17 },
  { id: 'line-post-93', penulisId: 'line-user-28', tipe: 'karya', judul: 'Foto Milky Way', isi: 'Hasil jepretan Milky Way dari Dieng. Setting: ISO 3200, 20 detik.', suka: 35 },
  { id: 'line-post-94', penulisId: 'line-user-29', tipe: 'karya', judul: 'Puisi: Hujan di Kota', isi: 'Puisi tentang rindu dan hujan. Semoga berkenan.', suka: 13 },
  { id: 'line-post-95', penulisId: 'line-user-30', tipe: 'karya', judul: 'Desain Kemasan Kopi', isi: 'Redesign kemasan kopi lokal biar naik kelas. Before-after ada di gambar.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_10: KirimanLine[] = [
  { id: 'line-post-96', penulisId: 'line-user-21', tipe: 'curhat', judul: 'Lelah Jadi Sandwich Generation', isi: 'Biayai orang tua + adik + anak sendiri. Capek tapi ikhlas.', suka: 24 },
  { id: 'line-post-97', penulisId: 'line-user-22', tipe: 'curhat', judul: 'Ditipu Teman Sendiri', isi: 'Uang 5 juta dibawa kabur teman dekat. Pelajaran mahal.', suka: 16 },
  { id: 'line-post-98', penulisId: 'line-user-23', tipe: 'curhat', judul: 'Anak Pertama Masuk SD', isi: 'Haru lihat anak pakai seragam merah putih. Waktu cepat sekali.', suka: 29 },
  { id: 'line-post-99', penulisId: 'line-user-24', tipe: 'curhat', judul: 'Gagal SNBP', isi: 'Tidak lolos SNBP. Sedih, tapi masih ada UTBK.', suka: 18 },
  { id: 'line-post-100', penulisId: 'line-user-25', tipe: 'curhat', judul: '100 Kiriman!', isi: 'Tidak terasa sudah 100 kiriman di Line. Terima kasih komunitas!', suka: 33 },
];

const KIRIMAN_TAMBAHAN_11: KirimanLine[] = [
  { id: 'line-post-101', penulisId: 'line-user-16', tipe: 'karya', judul: 'Cover Lagu Akustik', isi: 'Cover lagu favorit versi akustik. Rekam pakai HP saja.', suka: 23 },
  { id: 'line-post-102', penulisId: 'line-user-17', tipe: 'karya', judul: 'Infografis Kesehatan', isi: 'Infografis bahaya merokok. Silakan share untuk edukasi.', suka: 27 },
  { id: 'line-post-103', penulisId: 'line-user-18', tipe: 'karya', judul: 'Robot Line Follower', isi: 'Robot line follower dari Arduino. Kode & skema lengkap.', suka: 31 },
  { id: 'line-post-104', penulisId: 'line-user-19', tipe: 'karya', judul: 'Resep Kue Lapis', isi: 'Kue lapis legit anti gagal: takaran presisi per lapis.', suka: 19 },
  { id: 'line-post-105', penulisId: 'line-user-20', tipe: 'karya', judul: 'Esai: Pendidikan Desa', isi: 'Esai tentang kesenjangan pendidikan kota-desa. Diskusi yuk!', suka: 16 },
];

const KIRIMAN_TAMBAHAN_12: KirimanLine[] = [
  { id: 'line-post-106', penulisId: 'line-user-11', tipe: 'curhat', judul: 'Anak Susah Makan', isi: 'Anak 3 tahun susah makan sayur. Ada tips?', suka: 12 },
  { id: 'line-post-107', penulisId: 'line-user-12', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Tetangga karaoke tiap malam sampai jam 1. Sudah ditegur tidak mempan.', suka: 15 },
  { id: 'line-post-108', penulisId: 'line-user-13', tipe: 'curhat', judul: 'Lulus S2!', isi: 'Akhirnya lulus S2 setelah 3 tahun berjuang sambil kerja!', suka: 41 },
  { id: 'line-post-109', penulisId: 'line-user-14', tipe: 'curhat', judul: 'Motor Hilang', isi: 'Motor hilang di parkiran. Sudah lapor polisi. Doakan ketemu.', suka: 20 },
  { id: 'line-post-110', penulisId: 'line-user-15', tipe: 'curhat', judul: '110 Kiriman!', isi: 'Line makin rame. Senang jadi bagian komunitas ini.', suka: 30 },
];

const KIRIMAN_TAMBAHAN_13: KirimanLine[] = [
  { id: 'line-post-111', penulisId: 'line-user-6', tipe: 'karya', judul: 'Sketsa Wajah Pensil', isi: 'Sketsa wajah realis pakai pensil 2B-8B. Proses 6 jam.', suka: 34 },
  { id: 'line-post-112', penulisId: 'line-user-7', tipe: 'karya', judul: 'Template Undangan', isi: 'Template undangan digital gratis. Edit nama & tanggal saja.', suka: 26 },
  { id: 'line-post-113', penulisId: 'line-user-8', tipe: 'karya', judul: 'Rangkaian Lampu Otomatis', isi: 'Lampu teras otomatis pakai LDR. Skema sederhana.', suka: 18 },
  { id: 'line-post-114', penulisId: 'line-user-9', tipe: 'karya', judul: 'Novel Bab 1', isi: 'Bab pertama novel fantasiku. Minta masukan plotnya!', suka: 15 },
  { id: 'line-post-115', penulisId: 'line-user-10', tipe: 'karya', judul: 'Video Timelapse', isi: 'Timelapse sunset pantai 2 jam jadi 30 detik.', suka: 29 },
];

const KIRIMAN_TAMBAHAN_14: KirimanLine[] = [
  { id: 'line-post-116', penulisId: 'line-user-1', tipe: 'curhat', judul: 'Berat Badan Naik 10kg', isi: 'Setahun WFH naik 10kg. Mulai diet besok... besok terus.', suka: 14 },
  { id: 'line-post-117', penulisId: 'line-user-2', tipe: 'curhat', judul: 'Ibu Mertua', isi: 'Hubungan dengan mertua membaik setelah kami ngobrol terbuka.', suka: 22 },
  { id: 'line-post-118', penulisId: 'line-user-3', tipe: 'curhat', judul: 'Kangen Kampung', isi: '5 tahun tidak pulang kampung. Lebaran tahun ini harus pulang.', suka: 19 },
  { id: 'line-post-119', penulisId: 'line-user-4', tipe: 'curhat', judul: 'Diterima Beasiswa!', isi: 'Lolos beasiswa S2! Terima kasih untuk semua doanya.', suka: 45 },
  { id: 'line-post-120', penulisId: 'line-user-5', tipe: 'curhat', judul: '120 Kiriman!', isi: 'Komunitas Line makin hidup. Bangga jadi bagian!', suka: 31 },
];

const KIRIMAN_TAMBAHAN_15: KirimanLine[] = [
  { id: 'line-post-121', penulisId: 'line-user-11', tipe: 'karya', judul: 'Fotografi Makro', isi: 'Serangga dari dekat — dunia kecil yang menakjubkan.', suka: 38 },
  { id: 'line-post-122', penulisId: 'line-user-12', tipe: 'karya', judul: 'Poster Hari Pahlawan', isi: 'Desain poster untuk sekolah.', suka: 29 },
  { id: 'line-post-123', penulisId: 'line-user-13', tipe: 'karya', judul: 'Lagu Anak', isi: 'Lagu edukasi untuk PAUD.', suka: 24 },
  { id: 'line-post-124', penulisId: 'line-user-14', tipe: 'karya', judul: 'Aplikasi Kasir', isi: 'Aplikasi kasir sederhana untuk warung.', suka: 41 },
  { id: 'line-post-125', penulisId: 'line-user-15', tipe: 'karya', judul: 'Kebun Vertikal', isi: 'Update kebun vertikal: panen kangkung!', suka: 33 },
];

const KIRIMAN_TAMBAHAN_16: KirimanLine[] = [
  { id: 'line-post-126', penulisId: 'line-user-16', tipe: 'curhat', judul: 'Anak Susah Makan', isi: 'Anak 3 tahun susah makan sayur. Ada tips?', suka: 17 },
  { id: 'line-post-127', penulisId: 'line-user-17', tipe: 'curhat', judul: 'Resign atau Bertahan', isi: 'Gaji pas-pasan tapi atasan baik. Galau.', suka: 21 },
  { id: 'line-post-128', penulisId: 'line-user-18', tipe: 'curhat', judul: 'Pertama Kali Mudik Bawa Bayi', isi: 'Nervous mudik bawa bayi 6 bulan.', suka: 15 },
  { id: 'line-post-129', penulisId: 'line-user-19', tipe: 'curhat', judul: 'Skripsi Bab 4', isi: 'Bab 4 revisi ke-5. Semangat!', suka: 26 },
  { id: 'line-post-130', penulisId: 'line-user-20', tipe: 'curhat', judul: '130 Kiriman!', isi: 'Komunitas makin solid!', suka: 28 },
];

const KIRIMAN_TAMBAHAN_17: KirimanLine[] = [
  { id: 'line-post-131', penulisId: 'line-user-21', tipe: 'karya', judul: 'Puisi Hujan', isi: 'Kumpulan puisi tentang hujan.', suka: 27 },
  { id: 'line-post-132', penulisId: 'line-user-22', tipe: 'karya', judul: 'Desain Kemasan', isi: 'Kemasan produk kopi lokal.', suka: 34 },
  { id: 'line-post-133', penulisId: 'line-user-23', tipe: 'karya', judul: 'Robot Line Follower', isi: 'Robot line follower dari Arduino.', suka: 46 },
  { id: 'line-post-134', penulisId: 'line-user-24', tipe: 'karya', judul: 'Cerpen Perdana', isi: 'Cerpen pertama yang selesai.', suka: 22 },
  { id: 'line-post-135', penulisId: 'line-user-25', tipe: 'karya', judul: 'Vlog Desa', isi: 'Vlog kehidupan desa.', suka: 31 },
];

const KIRIMAN_TAMBAHAN_18: KirimanLine[] = [
  { id: 'line-post-136', penulisId: 'line-user-26', tipe: 'curhat', judul: 'Overthinking Malam Hari', isi: 'Tiap malam kepikiran hal-hal kecil. Capek.', suka: 23 },
  { id: 'line-post-137', penulisId: 'line-user-27', tipe: 'curhat', judul: 'Jauh dari Orang Tua', isi: 'Merantau 3 tahun, rindu masakan ibu.', suka: 19 },
  { id: 'line-post-138', penulisId: 'line-user-28', tipe: 'curhat', judul: 'Gagal Interview ke-10', isi: 'Tetap semangat, rezeki tidak ke mana.', suka: 27 },
  { id: 'line-post-139', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Hujan & Kenangan', isi: 'Hujan selalu bawa kenangan.', suka: 16 },
  { id: 'line-post-140', penulisId: 'line-user-30', tipe: 'curhat', judul: '140 Kiriman!', isi: 'Terima kasih komunitas!', suka: 30 },
];

const KIRIMAN_TAMBAHAN_19: KirimanLine[] = [
  { id: 'line-post-141', penulisId: 'line-user-31', tipe: 'karya', judul: 'Ilustrasi Digital', isi: 'Karakter fantasi original.', suka: 35 },
  { id: 'line-post-142', penulisId: 'line-user-32', tipe: 'karya', judul: 'Logo Komunitas', isi: 'Logo untuk komunitas lari.', suka: 28 },
  { id: 'line-post-143', penulisId: 'line-user-33', tipe: 'karya', judul: 'Aransemen Musik', isi: 'Aransemen lagu daerah.', suka: 31 },
  { id: 'line-post-144', penulisId: 'line-user-34', tipe: 'karya', judul: 'Template Presentasi', isi: 'Template PPT gratis.', suka: 25 },
  { id: 'line-post-145', penulisId: 'line-user-35', tipe: 'karya', judul: 'Resep Sambal', isi: 'Resep sambal andalan keluarga.', suka: 29 },
];

const KIRIMAN_TAMBAHAN_20: KirimanLine[] = [
  { id: 'line-post-146', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Lelah Bekerja', isi: 'Lembur terus, kapan istirahatnya...', suka: 12 },
  { id: 'line-post-147', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Anak Sakit', isi: 'Anak demam 3 hari, khawatir banget.', suka: 15 },
  { id: 'line-post-148', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Usaha Sepi', isi: 'Warung sepi pembeli minggu ini.', suka: 10 },
  { id: 'line-post-149', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Skripsi Macet', isi: 'Revisi ke-5, semangat mulai habis.', suka: 14 },
  { id: 'line-post-150', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Rindu Kampung', isi: '2 tahun belum mudik.', suka: 16 },
];

const KIRIMAN_TAMBAHAN_21: KirimanLine[] = [
  { id: 'line-post-151', penulisId: 'line-user-31', tipe: 'karya', judul: 'Puisi Hujan', isi: 'Puisi tentang rindu & hujan.', suka: 22 },
  { id: 'line-post-152', penulisId: 'line-user-32', tipe: 'karya', judul: 'Sketsa Wajah', isi: 'Sketsa pensil 30 menit.', suka: 27 },
  { id: 'line-post-153', penulisId: 'line-user-33', tipe: 'karya', judul: 'Cover Lagu', isi: 'Cover akustik lagu favorit.', suka: 24 },
  { id: 'line-post-154', penulisId: 'line-user-34', tipe: 'karya', judul: 'Infografis', isi: 'Infografis tips hemat.', suka: 30 },
  { id: 'line-post-155', penulisId: 'line-user-35', tipe: 'karya', judul: 'Cerpen', isi: 'Cerpen 1000 kata tentang persahabatan.', suka: 26 },
];

const KIRIMAN_TAMBAHAN_22: KirimanLine[] = [
  { id: 'line-post-156', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Gaji Telat', isi: 'Gaji telat 2 minggu, tagihan menumpuk.', suka: 11 },
  { id: 'line-post-157', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam sampai jam 1.', suka: 13 },
  { id: 'line-post-158', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Motor mogok di jalan, untung ada yang bantu.', suka: 9 },
  { id: 'line-post-159', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Interview Gagal', isi: 'Sudah 5x interview, belum ada yang lolos.', suka: 12 },
  { id: 'line-post-160', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Hujan & Banjir', isi: 'Rumah kebanjiran lagi.', suka: 14 },
];

const KIRIMAN_TAMBAHAN_23: KirimanLine[] = [
  { id: 'line-post-161', penulisId: 'line-user-31', tipe: 'karya', judul: 'Foto Sunset', isi: 'Sunset di pantai kemarin sore.', suka: 33 },
  { id: 'line-post-162', penulisId: 'line-user-32', tipe: 'karya', judul: 'Resep Kue', isi: 'Bolu kukus anti gagal.', suka: 28 },
  { id: 'line-post-163', penulisId: 'line-user-33', tipe: 'karya', judul: 'Tutorial Origami', isi: 'Origami bangau langkah demi langkah.', suka: 25 },
  { id: 'line-post-164', penulisId: 'line-user-34', tipe: 'karya', judul: 'Playlist Fokus', isi: 'Kumpulan lagu untuk fokus kerja.', suka: 31 },
  { id: 'line-post-165', penulisId: 'line-user-35', tipe: 'karya', judul: 'Tips Berkebun', isi: 'Mulai berkebun di lahan sempit.', suka: 27 },
];

const KIRIMAN_TAMBAHAN_24: KirimanLine[] = [
  { id: 'line-post-166', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Macet Parah', isi: '2 jam di jalan, capek banget.', suka: 8 },
  { id: 'line-post-167', penulisId: 'line-user-32', tipe: 'curhat', judul: 'HP Hilang', isi: 'HP jatuh di angkot, semoga ada yang kembalikan.', suka: 12 },
  { id: 'line-post-168', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Tagihan Listrik Naik', isi: 'Naik 2x lipat, padahal pemakaian sama.', suka: 10 },
  { id: 'line-post-169', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Ditolak Beasiswa', isi: 'Gagal lagi tahun ini.', suka: 11 },
  { id: 'line-post-170', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Kucing Sakit', isi: 'Kucing kesayangan sakit, doakan ya.', suka: 15 },
];

const KIRIMAN_TAMBAHAN_25: KirimanLine[] = [
  { id: 'line-post-171', penulisId: 'line-user-29', tipe: 'karya', judul: 'Lukisan Digital', isi: 'Lukisan digital pertamaku, kritik & saran welcome!', suka: 20 },
  { id: 'line-post-172', penulisId: 'line-user-30', tipe: 'karya', judul: 'Puisi Pagi', isi: 'Embun pagi menyapa mentari...', suka: 18 },
  { id: 'line-post-173', penulisId: 'line-user-31', tipe: 'karya', judul: 'Foto Makro', isi: 'Foto serangga makro dengan HP.', suka: 22 },
  { id: 'line-post-174', penulisId: 'line-user-32', tipe: 'karya', judul: 'Resep Kue', isi: 'Resep bolu kukus anti gagal.', suka: 25 },
  { id: 'line-post-175', penulisId: 'line-user-33', tipe: 'karya', judul: 'Kerajinan Bambu', isi: 'Lampu hias dari bambu bekas.', suka: 19 },
];

const KIRIMAN_TAMBAHAN_26: KirimanLine[] = [
  { id: 'line-post-176', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Lembur Terus', isi: '3 minggu lembur, badan mulai drop.', suka: 9 },
  { id: 'line-post-177', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Anak Demam', isi: 'Anak demam 3 hari, khawatir.', suka: 13 },
  { id: 'line-post-178', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam sampai jam 1.', suka: 7 },
  { id: 'line-post-179', penulisId: 'line-user-30', tipe: 'curhat', judul: 'Gagal Diet', isi: 'Seminggu diet, hari ini khilaf martabak.', suka: 11 },
  { id: 'line-post-180', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Kehujanan', isi: 'Jas hujan robek, basah kuyup di jalan.', suka: 8 },
];

const KIRIMAN_TAMBAHAN_27: KirimanLine[] = [
  { id: 'line-post-181', penulisId: 'line-user-34', tipe: 'karya', judul: 'Cover Lagu', isi: 'Cover akustik lagu favoritku.', suka: 21 },
  { id: 'line-post-182', penulisId: 'line-user-35', tipe: 'karya', judul: 'Cerpen Pendek', isi: 'Cerpen 500 kata tentang hujan.', suka: 17 },
  { id: 'line-post-183', penulisId: 'line-user-29', tipe: 'karya', judul: 'Infografis', isi: 'Infografis tips hemat listrik.', suka: 23 },
  { id: 'line-post-184', penulisId: 'line-user-30', tipe: 'karya', judul: 'Kue Kering', isi: 'Kue kering lebaran, resep keluarga.', suka: 26 },
  { id: 'line-post-185', penulisId: 'line-user-31', tipe: 'karya', judul: 'Taman Mini', isi: 'Taman mini dari barang bekas.', suka: 20 },
];

const KIRIMAN_TAMBAHAN_28: KirimanLine[] = [
  { id: 'line-post-186', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Interview Gagal', isi: 'Gagal interview ke-5 bulan ini.', suka: 10 },
  { id: 'line-post-187', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Mogok di tengah jalan tol.', suka: 9 },
  { id: 'line-post-188', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Kunci Hilang', isi: 'Kunci rumah hilang, terkunci di luar.', suka: 8 },
  { id: 'line-post-189', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Data Hilang', isi: 'Flashdisk corrupt, data skripsi hilang.', suka: 14 },
  { id: 'line-post-190', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Banjir', isi: 'Rumah kebanjiran semata kaki.', suka: 11 },
];

const KIRIMAN_TAMBAHAN_29: KirimanLine[] = [
  { id: 'line-post-191', penulisId: 'line-user-30', tipe: 'karya', judul: 'Sketsa Wajah', isi: 'Sketsa pensil 2 jam.', suka: 19 },
  { id: 'line-post-192', penulisId: 'line-user-31', tipe: 'karya', judul: 'Tutorial Origami', isi: 'Origami burung bangau step by step.', suka: 24 },
  { id: 'line-post-193', penulisId: 'line-user-32', tipe: 'karya', judul: 'Playlist Fokus', isi: 'Playlist lo-fi untuk belajar.', suka: 22 },
  { id: 'line-post-194', penulisId: 'line-user-33', tipe: 'karya', judul: 'Resep Sambal', isi: 'Sambal matah Bali autentik.', suka: 27 },
  { id: 'line-post-195', penulisId: 'line-user-34', tipe: 'karya', judul: 'Aquascape Mini', isi: 'Aquascape 30cm low budget.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_30: KirimanLine[] = [
  { id: 'line-post-196', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Antre RS Lama', isi: 'Antre 4 jam di RS.', suka: 7 },
  { id: 'line-post-197', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Paket Hilang', isi: 'Paket tidak sampai-sampai.', suka: 9 },
  { id: 'line-post-198', penulisId: 'line-user-30', tipe: 'curhat', judul: 'Listrik Padam', isi: 'Mati lampu 6 jam.', suka: 8 },
  { id: 'line-post-199', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Air Keruh', isi: 'Air sumur keruh setelah hujan.', suka: 6 },
  { id: 'line-post-200', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Jalan Rusak', isi: 'Jalan depan rumah rusak parah.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_31: KirimanLine[] = [
  { id: 'line-post-201', penulisId: 'line-user-33', tipe: 'karya', judul: 'Kaligrafi', isi: 'Kaligrafi asmaul husna.', suka: 23 },
  { id: 'line-post-202', penulisId: 'line-user-34', tipe: 'karya', judul: 'Lukisan Cat Air', isi: 'Sunset di sawah.', suka: 26 },
  { id: 'line-post-203', penulisId: 'line-user-35', tipe: 'karya', judul: 'Puisi Rindu', isi: 'Puisi untuk ibu.', suka: 29 },
  { id: 'line-post-204', penulisId: 'line-user-29', tipe: 'karya', judul: 'DIY Rak Buku', isi: 'Rak dari kardus bekas.', suka: 20 },
  { id: 'line-post-205', penulisId: 'line-user-30', tipe: 'karya', judul: 'Kue Kering', isi: 'Resep nastar lumer.', suka: 31 },
];

const KIRIMAN_TAMBAHAN_32: KirimanLine[] = [
  { id: 'line-post-206', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Macet Parah', isi: 'Macet 2 jam pulang kerja.', suka: 8 },
  { id: 'line-post-207', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Harga Naik', isi: 'Semua kebutuhan naik.', suka: 11 },
  { id: 'line-post-208', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam.', suka: 9 },
  { id: 'line-post-209', penulisId: 'line-user-34', tipe: 'curhat', judul: 'HP Lemot', isi: 'HP makin lemot.', suka: 7 },
  { id: 'line-post-210', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Antrean Panjang', isi: 'Antre bank 3 jam.', suka: 6 },
];

const KIRIMAN_TAMBAHAN_33: KirimanLine[] = [
  { id: 'line-post-211', penulisId: 'line-user-29', tipe: 'karya', judul: 'Cerpen Horor', isi: 'Cerpen 500 kata.', suka: 18 },
  { id: 'line-post-212', penulisId: 'line-user-30', tipe: 'karya', judul: 'Foto Macro', isi: 'Foto serangga macro.', suka: 25 },
  { id: 'line-post-213', penulisId: 'line-user-31', tipe: 'karya', judul: 'Cover Lagu', isi: 'Cover akustik.', suka: 22 },
  { id: 'line-post-214', penulisId: 'line-user-32', tipe: 'karya', judul: 'Desain Poster', isi: 'Poster acara kampus.', suka: 19 },
  { id: 'line-post-215', penulisId: 'line-user-33', tipe: 'karya', judul: 'Resep Rendang', isi: 'Rendang empuk 4 jam.', suka: 28 },
];

const KIRIMAN_TAMBAHAN_34: KirimanLine[] = [
  { id: 'line-post-216', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Ujian Susah', isi: 'Ujian kemarin susah banget.', suka: 9 },
  { id: 'line-post-217', penulisId: 'line-user-30', tipe: 'curhat', judul: 'Dompet Hilang', isi: 'Dompet jatuh di jalan.', suka: 12 },
  { id: 'line-post-218', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Ban Bocor', isi: 'Ban bocor di tengah jalan.', suka: 7 },
  { id: 'line-post-219', penulisId: 'line-user-32', tipe: 'curhat', judul: 'Kucing Hilang', isi: 'Kucingku tidak pulang 2 hari.', suka: 14 },
  { id: 'line-post-220', penulisId: 'line-user-33', tipe: 'curhat', judul: 'Laptop Rusak', isi: 'Laptop mati total.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_35: KirimanLine[] = [
  { id: 'line-post-221', penulisId: 'line-user-34', tipe: 'karya', judul: 'Sketsa Masjid', isi: 'Sketsa arsitektur masjid.', suka: 21 },
  { id: 'line-post-222', penulisId: 'line-user-35', tipe: 'karya', judul: 'Tutorial Rajut', isi: 'Rajut syal untuk pemula.', suka: 17 },
  { id: 'line-post-223', penulisId: 'line-user-29', tipe: 'karya', judul: 'Playlist Semangat', isi: 'Lagu penyemangat pagi.', suka: 19 },
  { id: 'line-post-224', penulisId: 'line-user-30', tipe: 'karya', judul: 'Resep Martabak', isi: 'Martabak manis teflon.', suka: 26 },
  { id: 'line-post-225', penulisId: 'line-user-31', tipe: 'karya', judul: 'Terrarium', isi: 'Terrarium kaca mini.', suka: 23 },
];

const KIRIMAN_TAMBAHAN_36: KirimanLine[] = [
  { id: 'line-post-226', penulisId: 'line-user-34', tipe: 'curhat', judul: 'Gagal Interview', isi: 'Gagal interview ketiga kalinya.', suka: 11 },
  { id: 'line-post-227', penulisId: 'line-user-35', tipe: 'curhat', judul: 'Kamar Banjir', isi: 'Kamar kos kebanjiran.', suka: 8 },
  { id: 'line-post-228', penulisId: 'line-user-29', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Motor mogok di tol.', suka: 9 },
  { id: 'line-post-229', penulisId: 'line-user-30', tipe: 'curhat', judul: 'KTP Hilang', isi: 'KTP hilang entah di mana.', suka: 7 },
  { id: 'line-post-230', penulisId: 'line-user-31', tipe: 'curhat', judul: 'Tagihan Bengkak', isi: 'Tagihan listrik bengkak.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_37: KirimanLine[] = [
  { id: 'line-post-231', penulisId: 'line-user-32', tipe: 'karya', judul: 'Puisi Hujan', isi: 'Puisi tentang hujan.', suka: 16 },
  { id: 'line-post-232', penulisId: 'line-user-33', tipe: 'karya', judul: 'Foto Sunset', isi: 'Sunset di pantai.', suka: 27 },
  { id: 'line-post-233', penulisId: 'line-user-34', tipe: 'karya', judul: 'Lagu Ciptaan', isi: 'Lagu tentang ibu.', suka: 24 },
  { id: 'line-post-234', penulisId: 'line-user-35', tipe: 'karya', judul: 'Kerajinan Bambu', isi: 'Lampu dari bambu.', suka: 20 },
  { id: 'line-post-235', penulisId: 'line-user-29', tipe: 'karya', judul: 'Resep Soto', isi: 'Soto ayam lamongan.', suka: 25 },
];

const KIRIMAN_TAMBAHAN_38: KirimanLine[] = [
  { id: 'line-post-236', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Skripsi Revisi', isi: 'Revisi skripsi ke-5.', suka: 9 },
  { id: 'line-post-237', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Macet Parah', isi: 'Macet 2 jam.', suka: 7 },
  { id: 'line-post-238', penulisId: 'line-user-38', tipe: 'curhat', judul: 'HP Hilang', isi: 'HP hilang di angkot.', suka: 11 },
  { id: 'line-post-239', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Gagal Diet', isi: 'Diet gagal lagi.', suka: 8 },
  { id: 'line-post-240', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Listrik Padam', isi: 'Mati lampu 3 jam.', suka: 6 },
];

const KIRIMAN_TAMBAHAN_39: KirimanLine[] = [
  { id: 'line-post-241', penulisId: 'line-user-36', tipe: 'karya', judul: 'Ilustrasi Digital', isi: 'Karakter fantasi.', suka: 19 },
  { id: 'line-post-242', penulisId: 'line-user-37', tipe: 'karya', judul: 'Cerpen Horor', isi: 'Cerpen rumah tua.', suka: 17 },
  { id: 'line-post-243', penulisId: 'line-user-38', tipe: 'karya', judul: 'Cover Lagu', isi: 'Cover akustik.', suka: 21 },
  { id: 'line-post-244', penulisId: 'line-user-39', tipe: 'karya', judul: 'Anyaman Pandan', isi: 'Tikar pandan.', suka: 15 },
  { id: 'line-post-245', penulisId: 'line-user-40', tipe: 'karya', judul: 'Desain Poster', isi: 'Poster kampanye.', suka: 22 },
];

const KIRIMAN_TAMBAHAN_40: KirimanLine[] = [
  { id: 'line-post-246', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Kehujanan', isi: 'Kehujanan di jalan.', suka: 7 },
  { id: 'line-post-247', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Dompet Ketinggalan', isi: 'Dompet ketinggalan.', suka: 8 },
  { id: 'line-post-248', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Antre Panjang', isi: 'Antre 2 jam.', suka: 6 },
  { id: 'line-post-249', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Kunci Hilang', isi: 'Kunci motor hilang.', suka: 9 },
  { id: 'line-post-250', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Kuota Habis', isi: 'Kuota habis tengah jalan.', suka: 7 },
];

const KIRIMAN_TAMBAHAN_41: KirimanLine[] = [
  { id: 'line-post-251', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sketsa Wajah', isi: 'Sketsa pensil.', suka: 18 },
  { id: 'line-post-252', penulisId: 'line-user-37', tipe: 'karya', judul: 'Puisi Ibu', isi: 'Puisi hari ibu.', suka: 23 },
  { id: 'line-post-253', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Macro', isi: 'Serangga macro.', suka: 26 },
  { id: 'line-post-254', penulisId: 'line-user-39', tipe: 'karya', judul: 'Resep Kue', isi: 'Brownies kukus.', suka: 21 },
  { id: 'line-post-255', penulisId: 'line-user-40', tipe: 'karya', judul: 'Kaligrafi', isi: 'Kaligrafi arab.', suka: 24 },
];

const KIRIMAN_TAMBAHAN_42: KirimanLine[] = [
  { id: 'line-post-256', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Ban Bocor', isi: 'Ban bocor tengah malam.', suka: 8 },
  { id: 'line-post-257', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Gagal Ujian', isi: 'Ujian gagal lagi.', suka: 9 },
  { id: 'line-post-258', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kucing Hilang', isi: 'Kucing belum pulang.', suka: 12 },
  { id: 'line-post-259', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Internet Lemot', isi: 'Internet lemot seharian.', suka: 7 },
  { id: 'line-post-260', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Dompet Tipis', isi: 'Akhir bulan dompet tipis.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_43: KirimanLine[] = [
  { id: 'line-post-261', penulisId: 'line-user-36', tipe: 'karya', judul: 'Lukisan Cat Air', isi: 'Pemandangan sawah.', suka: 20 },
  { id: 'line-post-262', penulisId: 'line-user-37', tipe: 'karya', judul: 'Pantun Jenaka', isi: 'Pantun lucu.', suka: 16 },
  { id: 'line-post-263', penulisId: 'line-user-38', tipe: 'karya', judul: 'Video Masak', isi: 'Tutorial rendang.', suka: 25 },
  { id: 'line-post-264', penulisId: 'line-user-39', tipe: 'karya', judul: 'Origami', isi: 'Bangau kertas.', suka: 14 },
  { id: 'line-post-265', penulisId: 'line-user-40', tipe: 'karya', judul: 'Desain Kaos', isi: 'Sablon kaos.', suka: 19 },
];

const KIRIMAN_TAMBAHAN_44: KirimanLine[] = [
  { id: 'line-post-266', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Ketinggalan Kereta', isi: 'Ketinggalan kereta.', suka: 8 },
  { id: 'line-post-267', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Sakit Gigi', isi: 'Sakit gigi semalaman.', suka: 7 },
  { id: 'line-post-268', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Laptop Rusak', isi: 'Laptop mati total.', suka: 10 },
  { id: 'line-post-269', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Kehilangan Dompet', isi: 'Dompet hilang.', suka: 9 },
  { id: 'line-post-270', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Antre RS', isi: 'Antre RS 3 jam.', suka: 8 },
];

const KIRIMAN_TAMBAHAN_45: KirimanLine[] = [
  { id: 'line-post-271', penulisId: 'line-user-36', tipe: 'karya', judul: 'Cerita Pendek', isi: 'Cerpen persahabatan.', suka: 17 },
  { id: 'line-post-272', penulisId: 'line-user-37', tipe: 'karya', judul: 'Foto Jalanan', isi: 'Street photography.', suka: 22 },
  { id: 'line-post-273', penulisId: 'line-user-38', tipe: 'karya', judul: 'Lagu Akustik', isi: 'Gitar akustik.', suka: 20 },
  { id: 'line-post-274', penulisId: 'line-user-39', tipe: 'karya', judul: 'Rajutan', isi: 'Syal rajutan.', suka: 15 },
  { id: 'line-post-275', penulisId: 'line-user-40', tipe: 'karya', judul: 'Infografis', isi: 'Data kesehatan.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_46: KirimanLine[] = [
  { id: 'line-post-276', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Susah Tidur', isi: 'Pikiran terus.', suka: 9 },
  { id: 'line-post-277', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Dimarahi Bos', isi: 'Salah laporan.', suka: 8 },
  { id: 'line-post-278', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Hujan Deras', isi: 'Kebanjiran kos.', suka: 7 },
  { id: 'line-post-279', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Rindu Kampung', isi: 'Pulang setahun sekali.', suka: 11 },
  { id: 'line-post-280', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Gagal Diet', isi: 'Godaan gorengan.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_47: KirimanLine[] = [
  { id: 'line-post-281', penulisId: 'line-user-36', tipe: 'karya', judul: 'Puisi Pagi', isi: 'Puisi tentang pagi.', suka: 14 },
  { id: 'line-post-282', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sketsa Wajah', isi: 'Sketsa pensil.', suka: 19 },
  { id: 'line-post-283', penulisId: 'line-user-38', tipe: 'karya', judul: 'Kue Kering', isi: 'Resep kue kering.', suka: 23 },
  { id: 'line-post-284', penulisId: 'line-user-39', tipe: 'karya', judul: 'Video Masak', isi: 'Tutorial masak.', suka: 21 },
  { id: 'line-post-285', penulisId: 'line-user-40', tipe: 'karya', judul: 'Kaligrafi', isi: 'Kaligrafi arab.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_48: KirimanLine[] = [
  { id: 'line-post-286', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Macet Parah', isi: '2 jam di jalan.', suka: 6 },
  { id: 'line-post-287', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Listrik Mati', isi: 'Mati 5 jam.', suka: 7 },
  { id: 'line-post-288', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kangen Ibu', isi: 'Belum pulang 2 tahun.', suka: 12 },
  { id: 'line-post-289', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Sakit Perut', isi: 'Salah makan.', suka: 5 },
  { id: 'line-post-290', penulisId: 'line-user-40', tipe: 'curhat', judul: 'HP Hilang', isi: 'Jatuh di angkot.', suka: 8 },
];

const KIRIMAN_TAMBAHAN_49: KirimanLine[] = [
  { id: 'line-post-291', penulisId: 'line-user-36', tipe: 'karya', judul: 'Logo Kopi', isi: 'Logo kedai kopi.', suka: 16 },
  { id: 'line-post-292', penulisId: 'line-user-37', tipe: 'karya', judul: 'Poster Film', isi: 'Poster indie.', suka: 20 },
  { id: 'line-post-293', penulisId: 'line-user-38', tipe: 'karya', judul: 'Lagu Piano', isi: 'Komposisi piano.', suka: 18 },
  { id: 'line-post-294', penulisId: 'line-user-39', tipe: 'karya', judul: 'Tas Anyaman', isi: 'Anyaman bambu.', suka: 15 },
  { id: 'line-post-295', penulisId: 'line-user-40', tipe: 'karya', judul: 'Cerpen Horor', isi: 'Cerita horor.', suka: 22 },
];

const KIRIMAN_TAMBAHAN_50: KirimanLine[] = [
  { id: 'line-post-296', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Antre Panjang', isi: 'Antre KTP 4 jam.', suka: 7 },
  { id: 'line-post-297', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Kehujanan', isi: 'Lupa bawa jas hujan.', suka: 6 },
  { id: 'line-post-298', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Dompet Ketat', isi: 'Akhir bulan.', suka: 9 },
  { id: 'line-post-299', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam.', suka: 8 },
  { id: 'line-post-300', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Kangen Ayah', isi: 'Almarhum ayah.', suka: 13 },
];

const KIRIMAN_TAMBAHAN_51: KirimanLine[] = [
  { id: 'line-post-301', penulisId: 'line-user-36', tipe: 'karya', judul: 'Desain Kaos', isi: 'Kaos distro.', suka: 17 },
  { id: 'line-post-302', penulisId: 'line-user-37', tipe: 'karya', judul: 'Foto Sunset', isi: 'Sunset pantai.', suka: 24 },
  { id: 'line-post-303', penulisId: 'line-user-38', tipe: 'karya', judul: 'Resep Rendang', isi: 'Rendang empuk.', suka: 21 },
  { id: 'line-post-304', penulisId: 'line-user-39', tipe: 'karya', judul: 'Vlog Harian', isi: 'Sehari bersamaku.', suka: 16 },
  { id: 'line-post-305', penulisId: 'line-user-40', tipe: 'karya', judul: 'Pantun', isi: 'Pantun nasehat.', suka: 14 },
];

const KIRIMAN_TAMBAHAN_52: KirimanLine[] = [
  { id: 'line-post-306', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Gagal Ujian', isi: 'Remedial lagi.', suka: 8 },
  { id: 'line-post-307', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Ditolak Kerja', isi: 'Lamaran ke-20.', suka: 10 },
  { id: 'line-post-308', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kucing Sakit', isi: 'Muntah-muntah.', suka: 9 },
  { id: 'line-post-309', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Hujan Seharian', isi: 'Jemuran basah.', suka: 6 },
  { id: 'line-post-310', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Lelah', isi: 'Butuh istirahat.', suka: 11 },
];

const KIRIMAN_TAMBAHAN_53: KirimanLine[] = [
  { id: 'line-post-311', penulisId: 'line-user-36', tipe: 'karya', judul: 'Banner Toko', isi: 'Banner warung.', suka: 13 },
  { id: 'line-post-312', penulisId: 'line-user-37', tipe: 'karya', judul: 'Lukisan Alam', isi: 'Cat air.', suka: 19 },
  { id: 'line-post-313', penulisId: 'line-user-38', tipe: 'karya', judul: 'Kopi Susu', isi: 'Racikan kopi.', suka: 17 },
  { id: 'line-post-314', penulisId: 'line-user-39', tipe: 'karya', judul: 'Podcast', isi: 'Episode perdana.', suka: 15 },
  { id: 'line-post-315', penulisId: 'line-user-40', tipe: 'karya', judul: 'Syair', isi: 'Syair rindu.', suka: 12 },
];

const KIRIMAN_TAMBAHAN_54: KirimanLine[] = [
  { id: 'line-post-316', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Macet', isi: '2 jam di jalan.', suka: 7 },
  { id: 'line-post-317', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Listrik Mati', isi: 'Gelap gulita.', suka: 8 },
  { id: 'line-post-318', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Rindu', isi: 'Kangen kampung.', suka: 12 },
  { id: 'line-post-319', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Demam', isi: 'Badan panas.', suka: 9 },
  { id: 'line-post-320', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Bosan', isi: 'Butuh liburan.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_55: KirimanLine[] = [
  { id: 'line-post-321', penulisId: 'line-user-36', tipe: 'karya', judul: 'Undangan Digital', isi: 'Undangan nikah.', suka: 16 },
  { id: 'line-post-322', penulisId: 'line-user-37', tipe: 'karya', judul: 'Kue Lapis', isi: 'Resep kue lapis.', suka: 14 },
  { id: 'line-post-323', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Sunset', isi: 'Pantai selatan.', suka: 20 },
  { id: 'line-post-324', penulisId: 'line-user-39', tipe: 'karya', judul: 'Cerpen', isi: 'Cerpen hujan.', suka: 13 },
  { id: 'line-post-325', penulisId: 'line-user-40', tipe: 'karya', judul: 'Kaligrafi', isi: 'Asmaul husna.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_56: KirimanLine[] = [
  { id: 'line-post-326', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Antre Panjang', isi: 'Urus KTP seharian.', suka: 8 },
  { id: 'line-post-327', penulisId: 'line-user-37', tipe: 'curhat', judul: 'HP Lemot', isi: 'Butuh ganti.', suka: 7 },
  { id: 'line-post-328', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kangen Ibu', isi: 'Belum mudik.', suka: 14 },
  { id: 'line-post-329', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Pusing', isi: 'Kurang tidur.', suka: 9 },
  { id: 'line-post-330', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Galau', isi: 'Bingung pilih.', suka: 11 },
];

const KIRIMAN_TAMBAHAN_57: KirimanLine[] = [
  { id: 'line-post-331', penulisId: 'line-user-36', tipe: 'karya', judul: 'Logo Warung', isi: 'Logo sederhana.', suka: 15 },
  { id: 'line-post-332', penulisId: 'line-user-37', tipe: 'karya', judul: 'Donat Kentang', isi: 'Resep donat.', suka: 17 },
  { id: 'line-post-333', penulisId: 'line-user-38', tipe: 'karya', judul: 'Vlog Pasar', isi: 'Jalan-jalan pasar.', suka: 14 },
  { id: 'line-post-334', penulisId: 'line-user-39', tipe: 'karya', judul: 'Puisi Senja', isi: 'Puisi sore.', suka: 16 },
  { id: 'line-post-335', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Harian', isi: 'Kumpulan doa.', suka: 19 },
];

const KIRIMAN_TAMBAHAN_58: KirimanLine[] = [
  { id: 'line-post-336', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Kehujanan', isi: 'Lupa bawa payung.', suka: 8 },
  { id: 'line-post-337', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Dompet Hilang', isi: 'Panik setengah mati.', suka: 10 },
  { id: 'line-post-338', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Insomnia', isi: 'Sudah jam 3.', suka: 9 },
  { id: 'line-post-339', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Kecewa', isi: 'Janji tinggal janji.', suka: 12 },
  { id: 'line-post-340', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Capek', isi: 'Butuh healing.', suka: 11 },
];

const KIRIMAN_TAMBAHAN_59: KirimanLine[] = [
  { id: 'line-post-341', penulisId: 'line-user-36', tipe: 'karya', judul: 'Banner Kopi', isi: 'Banner kedai.', suka: 14 },
  { id: 'line-post-342', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sambal Matah', isi: 'Resep sambal.', suka: 18 },
  { id: 'line-post-343', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Gunung', isi: 'Sunrise.', suka: 21 },
  { id: 'line-post-344', penulisId: 'line-user-39', tipe: 'karya', judul: 'Pantun', isi: 'Pantun jenaka.', suka: 13 },
  { id: 'line-post-345', penulisId: 'line-user-40', tipe: 'karya', judul: 'Shalawat', isi: 'Lirik shalawat.', suka: 17 },
];

const KIRIMAN_TAMBAHAN_60: KirimanLine[] = [
  { id: 'line-post-346', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Kangen Ayah', isi: 'Sudah lama tidak jumpa.', suka: 13 },
  { id: 'line-post-347', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Gagal Diet', isi: 'Godaan gorengan.', suka: 8 },
  { id: 'line-post-348', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Sepi', isi: 'Kontrakan sepi.', suka: 9 },
  { id: 'line-post-349', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Overthinking', isi: 'Pikiran ke mana-mana.', suka: 11 },
  { id: 'line-post-350', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Lelah Hati', isi: 'Butuh semangat.', suka: 12 },
];

const KIRIMAN_TAMBAHAN_61: KirimanLine[] = [
  { id: 'line-post-351', penulisId: 'line-user-36', tipe: 'karya', judul: 'Desain Kaos', isi: 'Kaos komunitas.', suka: 15 },
  { id: 'line-post-352', penulisId: 'line-user-37', tipe: 'karya', judul: 'Ayam Geprek', isi: 'Resep geprek.', suka: 19 },
  { id: 'line-post-353', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Sawah', isi: 'Pagi berkabut.', suka: 16 },
  { id: 'line-post-354', penulisId: 'line-user-39', tipe: 'karya', judul: 'Cerita Pendek', isi: 'Tentang rindu.', suka: 14 },
  { id: 'line-post-355', penulisId: 'line-user-40', tipe: 'karya', judul: 'Khat', isi: 'Khat naskhi.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_62: KirimanLine[] = [
  { id: 'line-post-356', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Hujan Deras', isi: 'Banjir di gang.', suka: 10 },
  { id: 'line-post-357', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Kucing Hilang', isi: 'Sudah 3 hari.', suka: 14 },
  { id: 'line-post-358', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Gaji Telat', isi: 'Tagihan menumpuk.', suka: 12 },
  { id: 'line-post-359', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Rindu Kampung', isi: 'Lebaran masih lama.', suka: 11 },
  { id: 'line-post-360', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Sakit Gigi', isi: 'Tidak bisa tidur.', suka: 9 },
];

const KIRIMAN_TAMBAHAN_63: KirimanLine[] = [
  { id: 'line-post-361', penulisId: 'line-user-36', tipe: 'karya', judul: 'Poster Maulid', isi: 'Poster peringatan.', suka: 17 },
  { id: 'line-post-362', penulisId: 'line-user-37', tipe: 'karya', judul: 'Soto Ayam', isi: 'Resep soto.', suka: 20 },
  { id: 'line-post-363', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Pantai', isi: 'Senja di pantai.', suka: 22 },
  { id: 'line-post-364', penulisId: 'line-user-39', tipe: 'karya', judul: 'Puisi Ibu', isi: 'Puisi untuk ibu.', suka: 19 },
  { id: 'line-post-365', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Harian', isi: 'Kumpulan doa.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_64: KirimanLine[] = [
  { id: 'line-post-366', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Macet Parah', isi: '2 jam di jalan.', suka: 8 },
  { id: 'line-post-367', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Anak Demam', isi: 'Sudah 2 hari.', suka: 13 },
  { id: 'line-post-368', penulisId: 'line-user-38', tipe: 'curhat', judul: 'PHK', isi: 'Kena efisiensi.', suka: 15 },
  { id: 'line-post-369', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam.', suka: 10 },
  { id: 'line-post-370', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Galau', isi: 'Masa depan kabur.', suka: 12 },
];

const KIRIMAN_TAMBAHAN_65: KirimanLine[] = [
  { id: 'line-post-371', penulisId: 'line-user-36', tipe: 'karya', judul: 'Undangan Digital', isi: 'Template nikah.', suka: 18 },
  { id: 'line-post-372', penulisId: 'line-user-37', tipe: 'karya', judul: 'Rendang', isi: 'Resep rendang.', suka: 23 },
  { id: 'line-post-373', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Kota', isi: 'Malam kota.', suka: 17 },
  { id: 'line-post-374', penulisId: 'line-user-39', tipe: 'karya', judul: 'Lagu Daerah', isi: 'Aransemen baru.', suka: 19 },
  { id: 'line-post-375', penulisId: 'line-user-40', tipe: 'karya', judul: 'Kaligrafi', isi: 'Asmaul husna.', suka: 24 },
];

const KIRIMAN_TAMBAHAN_66: KirimanLine[] = [
  { id: 'line-post-376', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Listrik Mati', isi: 'Sudah 5 jam.', suka: 9 },
  { id: 'line-post-377', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Di tengah jalan.', suka: 11 },
  { id: 'line-post-378', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Ditolak Kerja', isi: 'Interview gagal.', suka: 14 },
  { id: 'line-post-379', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Hujan Terus', isi: 'Jemuran tidak kering.', suka: 7 },
  { id: 'line-post-380', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Kesepian', isi: 'Teman pada sibuk.', suka: 13 },
];

const KIRIMAN_TAMBAHAN_67: KirimanLine[] = [
  { id: 'line-post-381', penulisId: 'line-user-36', tipe: 'karya', judul: 'Logo Warung', isi: 'Logo warung kopi.', suka: 16 },
  { id: 'line-post-382', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sambal Terasi', isi: 'Resep sambal.', suka: 21 },
  { id: 'line-post-383', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Desa', isi: 'Pagi di desa.', suka: 18 },
  { id: 'line-post-384', penulisId: 'line-user-39', tipe: 'karya', judul: 'Cerpen', isi: 'Tentang sahabat.', suka: 15 },
  { id: 'line-post-385', penulisId: 'line-user-40', tipe: 'karya', judul: 'Shalawat Nabi', isi: 'Lirik shalawat.', suka: 20 },
];

const KIRIMAN_TAMBAHAN_68: KirimanLine[] = [
  { id: 'line-post-386', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Ongkir Mahal', isi: 'Belanja online mahal ongkir.', suka: 8 },
  { id: 'line-post-387', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Sakit Kepala', isi: 'Sudah minum obat.', suka: 10 },
  { id: 'line-post-388', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kuota Habis', isi: 'Belum gajian.', suka: 9 },
  { id: 'line-post-389', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Tetangga Gosip', isi: 'Tidak nyaman.', suka: 11 },
  { id: 'line-post-390', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Lelah Bekerja', isi: 'Lembur terus.', suka: 12 },
];

const KIRIMAN_TAMBAHAN_69: KirimanLine[] = [
  { id: 'line-post-391', penulisId: 'line-user-36', tipe: 'karya', judul: 'Banner Toko', isi: 'Banner grand opening.', suka: 17 },
  { id: 'line-post-392', penulisId: 'line-user-37', tipe: 'karya', judul: 'Opor Ayam', isi: 'Resep opor.', suka: 22 },
  { id: 'line-post-393', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Senja', isi: 'Senja keemasan.', suka: 19 },
  { id: 'line-post-394', penulisId: 'line-user-39', tipe: 'karya', judul: 'Pantun', isi: 'Pantun nasehat.', suka: 16 },
  { id: 'line-post-395', penulisId: 'line-user-40', tipe: 'karya', judul: 'Dzikir Pagi', isi: 'Dzikir harian.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_70: KirimanLine[] = [
  { id: 'line-post-396', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Antrean Panjang', isi: 'BPJS antre lama.', suka: 9 },
  { id: 'line-post-397', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Demam Anak', isi: 'Sudah ke puskesmas.', suka: 12 },
  { id: 'line-post-398', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Harga Naik', isi: 'Sembako mahal.', suka: 11 },
  { id: 'line-post-399', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Tetangga Pindah', isi: 'Sedih ditinggal.', suka: 8 },
  { id: 'line-post-400', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Capek Hati', isi: 'Butuh liburan.', suka: 13 },
];

const KIRIMAN_TAMBAHAN_71: KirimanLine[] = [
  { id: 'line-post-401', penulisId: 'line-user-36', tipe: 'karya', judul: 'Desain Spanduk', isi: 'Spanduk warung.', suka: 15 },
  { id: 'line-post-402', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sayur Asem', isi: 'Resep sayur asem.', suka: 19 },
  { id: 'line-post-403', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Bukit', isi: 'Kabut pagi.', suka: 20 },
  { id: 'line-post-404', penulisId: 'line-user-39', tipe: 'karya', judul: 'Sajak Rindu', isi: 'Sajak pendek.', suka: 17 },
  { id: 'line-post-405', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Safar', isi: 'Doa perjalanan.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_72: KirimanLine[] = [
  { id: 'line-post-406', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Air Keruh', isi: 'Sumur keruh.', suka: 7 },
  { id: 'line-post-407', penulisId: 'line-user-37', tipe: 'curhat', judul: 'HP Lemot', isi: 'Mau ganti.', suka: 9 },
  { id: 'line-post-408', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Gagal Ujian', isi: 'Remedial lagi.', suka: 12 },
  { id: 'line-post-409', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Kucing Sakit', isi: 'Tidak mau makan.', suka: 14 },
  { id: 'line-post-410', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Rindu Ayah', isi: 'Sudah tiada.', suka: 16 },
];

const KIRIMAN_TAMBAHAN_73: KirimanLine[] = [
  { id: 'line-post-411', penulisId: 'line-user-36', tipe: 'karya', judul: 'Kartu Lebaran', isi: 'Kartu ucapan.', suka: 18 },
  { id: 'line-post-412', penulisId: 'line-user-37', tipe: 'karya', judul: 'Gudeg', isi: 'Resep gudeg.', suka: 21 },
  { id: 'line-post-413', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Sawah', isi: 'Hijau membentang.', suka: 17 },
  { id: 'line-post-414', penulisId: 'line-user-39', tipe: 'karya', judul: 'Lagu Pop', isi: 'Cover akustik.', suka: 19 },
  { id: 'line-post-415', penulisId: 'line-user-40', tipe: 'karya', judul: 'Kaligrafi', isi: 'Surah pendek.', suka: 22 },
];

const KIRIMAN_TAMBAHAN_74: KirimanLine[] = [
  { id: 'line-post-416', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Lembur Terus', isi: 'Capek banget.', suka: 11 },
  { id: 'line-post-417', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Tetangga Berisik', isi: 'Karaoke tiap malam.', suka: 8 },
  { id: 'line-post-418', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Dompet Hilang', isi: 'Di angkot.', suka: 13 },
  { id: 'line-post-419', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Anak Demam', isi: '3 hari.', suka: 15 },
  { id: 'line-post-420', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Sepi Order', isi: 'Warung sepi.', suka: 10 },
];

const KIRIMAN_TAMBAHAN_75: KirimanLine[] = [
  { id: 'line-post-421', penulisId: 'line-user-36', tipe: 'karya', judul: 'Puisi Hujan', isi: 'Rintik & kenangan.', suka: 19 },
  { id: 'line-post-422', penulisId: 'line-user-37', tipe: 'karya', judul: 'Soto Ayam', isi: 'Resep soto.', suka: 20 },
  { id: 'line-post-423', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Pantai', isi: 'Senja.', suka: 23 },
  { id: 'line-post-424', penulisId: 'line-user-39', tipe: 'karya', judul: 'Cerpen Pendek', isi: 'Tentang rantau.', suka: 16 },
  { id: 'line-post-425', penulisId: 'line-user-40', tipe: 'karya', judul: 'Tips Menabung', isi: '50/30/20.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_76: KirimanLine[] = [
  { id: 'line-post-426', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Macet Parah', isi: '2 jam di jalan.', suka: 9 },
  { id: 'line-post-427', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Listrik Mati', isi: 'Malam-malam.', suka: 10 },
  { id: 'line-post-428', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Ibu Sakit', isi: 'Doakan ya.', suka: 17 },
  { id: 'line-post-429', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Ditolak Kerja', isi: 'Tetap semangat.', suka: 14 },
  { id: 'line-post-430', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Di tanjakan.', suka: 8 },
];

const KIRIMAN_TAMBAHAN_77: KirimanLine[] = [
  { id: 'line-post-431', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Pagi', isi: 'Embun & doa.', suka: 17 },
  { id: 'line-post-432', penulisId: 'line-user-37', tipe: 'karya', judul: 'Rawon', isi: 'Resep rawon.', suka: 19 },
  { id: 'line-post-433', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Gunung', isi: 'Puncak.', suka: 24 },
  { id: 'line-post-434', penulisId: 'line-user-39', tipe: 'karya', judul: 'Lagu Daerah', isi: 'Aransemen baru.', suka: 18 },
  { id: 'line-post-435', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Hujan', isi: 'Allahumma shoyyiban.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_78: KirimanLine[] = [
  { id: 'line-post-436', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Banjir Lagi', isi: 'Air masuk rumah.', suka: 12 },
  { id: 'line-post-437', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Anak Nakal', isi: 'Susah diatur.', suka: 9 },
  { id: 'line-post-438', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Gaji Telat', isi: 'Sudah tanggal 5.', suka: 15 },
  { id: 'line-post-439', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Tetangga Pindah', isi: 'Sepi.', suka: 7 },
  { id: 'line-post-440', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Kangen Kampung', isi: 'Belum mudik.', suka: 13 },
];

const KIRIMAN_TAMBAHAN_79: KirimanLine[] = [
  { id: 'line-post-441', penulisId: 'line-user-36', tipe: 'karya', judul: 'Puisi Senja', isi: 'Jingga & rindu.', suka: 18 },
  { id: 'line-post-442', penulisId: 'line-user-37', tipe: 'karya', judul: 'Gado-gado', isi: 'Resep gado-gado.', suka: 20 },
  { id: 'line-post-443', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Danau', isi: 'Tenang.', suka: 21 },
  { id: 'line-post-444', penulisId: 'line-user-39', tipe: 'karya', judul: 'Cover Sholawat', isi: 'Suara merdu.', suka: 22 },
  { id: 'line-post-445', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Pagi', isi: 'Allahumma inni.', suka: 19 },
];

const KIRIMAN_TAMBAHAN_80: KirimanLine[] = [
  { id: 'line-post-446', penulisId: 'line-user-36', tipe: 'curhat', judul: 'HP Rusak', isi: 'Layar pecah.', suka: 8 },
  { id: 'line-post-447', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Kuliah Online', isi: 'Sinyal jelek.', suka: 11 },
  { id: 'line-post-448', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Rindu Ibu', isi: 'Jauh merantau.', suka: 16 },
  { id: 'line-post-449', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Dana Darurat', isi: 'Habis.', suka: 10 },
  { id: 'line-post-450', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Tetangga Baik', isi: 'Bantuin terus.', suka: 14 },
];

const KIRIMAN_TAMBAHAN_81: KirimanLine[] = [
  { id: 'line-post-451', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Rindu', isi: 'Jauh & dekat.', suka: 19 },
  { id: 'line-post-452', penulisId: 'line-user-37', tipe: 'karya', judul: 'Ayam Goreng', isi: 'Resep kremes.', suka: 21 },
  { id: 'line-post-453', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Kota', isi: 'Malam hari.', suka: 18 },
  { id: 'line-post-454', penulisId: 'line-user-39', tipe: 'karya', judul: 'Puisi Ibu', isi: 'Kasih sayang.', suka: 23 },
  { id: 'line-post-455', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Safar', isi: 'Perjalanan aman.', suka: 20 },
];

const KIRIMAN_TAMBAHAN_82: KirimanLine[] = [
  { id: 'line-post-456', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Air Mati', isi: 'PDAM mati.', suka: 9 },
  { id: 'line-post-457', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Skripsi Macet', isi: 'Revisi terus.', suka: 13 },
  { id: 'line-post-458', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kangen Ayah', isi: 'Sudah tiada.', suka: 17 },
  { id: 'line-post-459', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Order Sepi', isi: 'Tetap buka.', suka: 8 },
  { id: 'line-post-460', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Hujan Deras', isi: 'Jemuran basah.', suka: 7 },
];

const KIRIMAN_TAMBAHAN_83: KirimanLine[] = [
  { id: 'line-post-461', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Hujan', isi: 'Rintik & syukur.', suka: 20 },
  { id: 'line-post-462', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sambal Terasi', isi: 'Resep sambal.', suka: 22 },
  { id: 'line-post-463', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Sawah', isi: 'Pagi berkabut.', suka: 19 },
  { id: 'line-post-464', penulisId: 'line-user-39', tipe: 'karya', judul: 'Lagu Pop', isi: 'Aransemen akustik.', suka: 21 },
  { id: 'line-post-465', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Masuk Rumah', isi: 'Bismillah.', suka: 18 },
];

const KIRIMAN_TAMBAHAN_84: KirimanLine[] = [
  { id: 'line-post-466', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Token Habis', isi: 'Malam-malam.', suka: 8 },
  { id: 'line-post-467', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Tugas Menumpuk', isi: 'Deadline besok.', suka: 12 },
  { id: 'line-post-468', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Rindu Nenek', isi: 'Di kampung.', suka: 15 },
  { id: 'line-post-469', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Warung Tutup', isi: 'Renovasi.', suka: 7 },
  { id: 'line-post-470', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Angin Kencang', isi: 'Jemuran terbang.', suka: 9 },
];

const KIRIMAN_TAMBAHAN_85: KirimanLine[] = [
  { id: 'line-post-471', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Senja', isi: 'Jingga & doa.', suka: 19 },
  { id: 'line-post-472', penulisId: 'line-user-37', tipe: 'karya', judul: 'Opor Ayam', isi: 'Resep opor.', suka: 20 },
  { id: 'line-post-473', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Jembatan', isi: 'Malam.', suka: 18 },
  { id: 'line-post-474', penulisId: 'line-user-39', tipe: 'karya', judul: 'Sholawat Nabi', isi: 'Merdu.', suka: 24 },
  { id: 'line-post-475', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Keluar Rumah', isi: 'Bismillah tawakkaltu.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_86: KirimanLine[] = [
  { id: 'line-post-476', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Motor Mogok', isi: 'Di jalan sepi.', suka: 10 },
  { id: 'line-post-477', penulisId: 'line-user-37', tipe: 'curhat', judul: 'IP Turun', isi: 'Semester berat.', suka: 11 },
  { id: 'line-post-478', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Rindu Rumah', isi: 'Kost sendirian.', suka: 14 },
  { id: 'line-post-479', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Gaji Kecil', isi: 'Cukup-cukupkan.', suka: 12 },
  { id: 'line-post-480', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Hujan Awet', isi: 'Cucian menumpuk.', suka: 8 },
];

const KIRIMAN_TAMBAHAN_87: KirimanLine[] = [
  { id: 'line-post-481', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Pagi', isi: 'Embun & syukur.', suka: 18 },
  { id: 'line-post-482', penulisId: 'line-user-37', tipe: 'karya', judul: 'Sayur Lodeh', isi: 'Resep lodeh.', suka: 19 },
  { id: 'line-post-483', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Pantai', isi: 'Ombak.', suka: 22 },
  { id: 'line-post-484', penulisId: 'line-user-39', tipe: 'karya', judul: 'Nasyid', isi: 'Tanpa musik.', suka: 20 },
  { id: 'line-post-485', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Tidur', isi: 'Bismika.', suka: 21 },
];

const KIRIMAN_TAMBAHAN_88: KirimanLine[] = [
  { id: 'line-post-486', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Kucing Hilang', isi: 'Belum pulang.', suka: 16 },
  { id: 'line-post-487', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Skripsi Revisi', isi: 'Bab 4.', suka: 13 },
  { id: 'line-post-488', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Kangen Ayah', isi: 'Merantau.', suka: 15 },
  { id: 'line-post-489', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Lembur Terus', isi: 'Capek.', suka: 11 },
  { id: 'line-post-490', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Macet Parah', isi: 'Telat kerja.', suka: 9 },
];

const KIRIMAN_TAMBAHAN_89: KirimanLine[] = [
  { id: 'line-post-491', penulisId: 'line-user-36', tipe: 'karya', judul: 'Sajak Hujan', isi: 'Rintik & rindu.', suka: 20 },
  { id: 'line-post-492', penulisId: 'line-user-37', tipe: 'karya', judul: 'Ayam Goreng', isi: 'Resep crispy.', suka: 22 },
  { id: 'line-post-493', penulisId: 'line-user-38', tipe: 'karya', judul: 'Foto Sawah', isi: 'Hijau.', suka: 21 },
  { id: 'line-post-494', penulisId: 'line-user-39', tipe: 'karya', judul: 'Tilawah', isi: 'Juz 1.', suka: 23 },
  { id: 'line-post-495', penulisId: 'line-user-40', tipe: 'karya', judul: 'Doa Safar', isi: 'Perjalanan aman.', suka: 19 },
];

const KIRIMAN_TAMBAHAN_90: KirimanLine[] = [
  { id: 'line-post-496', penulisId: 'line-user-36', tipe: 'curhat', judul: 'Anak Demam', isi: 'Semalaman.', suka: 14 },
  { id: 'line-post-497', penulisId: 'line-user-37', tipe: 'curhat', judul: 'Ujian Susulan', isi: 'Belajar lagi.', suka: 10 },
  { id: 'line-post-498', penulisId: 'line-user-38', tipe: 'curhat', judul: 'Sepi Order', isi: 'Warung sepi.', suka: 11 },
  { id: 'line-post-499', penulisId: 'line-user-39', tipe: 'curhat', judul: 'Atasan Marah', isi: 'Salah input.', suka: 12 },
  { id: 'line-post-500', penulisId: 'line-user-40', tipe: 'curhat', judul: 'Ban Kempes', isi: 'Pagi-pagi.', suka: 8 },
];

export const SEMUA_KIRIMAN: KirimanLine[] = [...KIRIMAN_LINE, ...KIRIMAN_TAMBAHAN, ...KIRIMAN_TAMBAHAN_2, ...KIRIMAN_TAMBAHAN_3, ...KIRIMAN_TAMBAHAN_4, ...KIRIMAN_TAMBAHAN_5, ...KIRIMAN_TAMBAHAN_6, ...KIRIMAN_TAMBAHAN_7, ...KIRIMAN_TAMBAHAN_8, ...KIRIMAN_TAMBAHAN_9, ...KIRIMAN_TAMBAHAN_10, ...KIRIMAN_TAMBAHAN_11, ...KIRIMAN_TAMBAHAN_12, ...KIRIMAN_TAMBAHAN_13, ...KIRIMAN_TAMBAHAN_14, ...KIRIMAN_TAMBAHAN_15, ...KIRIMAN_TAMBAHAN_16, ...KIRIMAN_TAMBAHAN_17, ...KIRIMAN_TAMBAHAN_18, ...KIRIMAN_TAMBAHAN_19, ...KIRIMAN_TAMBAHAN_20, ...KIRIMAN_TAMBAHAN_21, ...KIRIMAN_TAMBAHAN_22, ...KIRIMAN_TAMBAHAN_23, ...KIRIMAN_TAMBAHAN_24, ...KIRIMAN_TAMBAHAN_25, ...KIRIMAN_TAMBAHAN_26, ...KIRIMAN_TAMBAHAN_27, ...KIRIMAN_TAMBAHAN_28, ...KIRIMAN_TAMBAHAN_29, ...KIRIMAN_TAMBAHAN_30, ...KIRIMAN_TAMBAHAN_31, ...KIRIMAN_TAMBAHAN_32, ...KIRIMAN_TAMBAHAN_33, ...KIRIMAN_TAMBAHAN_34, ...KIRIMAN_TAMBAHAN_35, ...KIRIMAN_TAMBAHAN_36, ...KIRIMAN_TAMBAHAN_37, ...KIRIMAN_TAMBAHAN_38, ...KIRIMAN_TAMBAHAN_39, ...KIRIMAN_TAMBAHAN_40, ...KIRIMAN_TAMBAHAN_41, ...KIRIMAN_TAMBAHAN_42, ...KIRIMAN_TAMBAHAN_43, ...KIRIMAN_TAMBAHAN_44, ...KIRIMAN_TAMBAHAN_45, ...KIRIMAN_TAMBAHAN_46, ...KIRIMAN_TAMBAHAN_47, ...KIRIMAN_TAMBAHAN_48, ...KIRIMAN_TAMBAHAN_49, ...KIRIMAN_TAMBAHAN_50, ...KIRIMAN_TAMBAHAN_51, ...KIRIMAN_TAMBAHAN_52, ...KIRIMAN_TAMBAHAN_53, ...KIRIMAN_TAMBAHAN_54, ...KIRIMAN_TAMBAHAN_55, ...KIRIMAN_TAMBAHAN_56, ...KIRIMAN_TAMBAHAN_57, ...KIRIMAN_TAMBAHAN_58, ...KIRIMAN_TAMBAHAN_59, ...KIRIMAN_TAMBAHAN_60, ...KIRIMAN_TAMBAHAN_61, ...KIRIMAN_TAMBAHAN_62, ...KIRIMAN_TAMBAHAN_63, ...KIRIMAN_TAMBAHAN_64, ...KIRIMAN_TAMBAHAN_65, ...KIRIMAN_TAMBAHAN_66, ...KIRIMAN_TAMBAHAN_67, ...KIRIMAN_TAMBAHAN_68, ...KIRIMAN_TAMBAHAN_69, ...KIRIMAN_TAMBAHAN_70, ...KIRIMAN_TAMBAHAN_71, ...KIRIMAN_TAMBAHAN_72, ...KIRIMAN_TAMBAHAN_73, ...KIRIMAN_TAMBAHAN_74, ...KIRIMAN_TAMBAHAN_75, ...KIRIMAN_TAMBAHAN_76, ...KIRIMAN_TAMBAHAN_77, ...KIRIMAN_TAMBAHAN_78, ...KIRIMAN_TAMBAHAN_79, ...KIRIMAN_TAMBAHAN_80, ...KIRIMAN_TAMBAHAN_81, ...KIRIMAN_TAMBAHAN_82, ...KIRIMAN_TAMBAHAN_83, ...KIRIMAN_TAMBAHAN_84, ...KIRIMAN_TAMBAHAN_85, ...KIRIMAN_TAMBAHAN_86, ...KIRIMAN_TAMBAHAN_87, ...KIRIMAN_TAMBAHAN_88, ...KIRIMAN_TAMBAHAN_89, ...KIRIMAN_TAMBAHAN_90];

const PERCAKAPAN_TAMBAHAN_2: PercakapanLine[] = [
  {
    id: 'line-dm-26', peserta: ['line-user-31', 'line-user-3'],
    pesan: [
      { dari: 'line-user-31', isi: 'Resep ayam lengkuasnya mantap! Sudah saya coba.' },
      { dari: 'line-user-3', isi: 'Wah senang dengarnya! Jangan lupa lengkuasnya digeprek ya.' },
    ],
  },
  {
    id: 'line-dm-27', peserta: ['line-user-32', 'line-user-14'],
    pesan: [
      { dari: 'line-user-32', isi: 'Karya kaligrafinya bagus. Belajar di mana?' },
      { dari: 'line-user-14', isi: 'Otodidak dari YouTube, 3 bulan latihan.' },
      { dari: 'line-user-32', isi: 'Keren! Boleh minta channel-nya?' },
    ],
  },
  {
    id: 'line-dm-28', peserta: ['line-user-33', 'line-user-8'],
    pesan: [
      { dari: 'line-user-33', isi: 'Robotnya pakai sensor apa?' },
      { dari: 'line-user-8', isi: 'Pakai 2 sensor IR TCRT5000.' },
    ],
  },
  {
    id: 'line-dm-29', peserta: ['line-user-34', 'line-user-21'],
    pesan: [
      { dari: 'line-user-34', isi: 'Taman vertikalnya butuh sinar matahari langsung?' },
      { dari: 'line-user-21', isi: 'Cukup 3-4 jam sehari, tanaman yang saya pakai tahan teduh.' },
    ],
  },
  {
    id: 'line-dm-30', peserta: ['line-user-35', 'line-user-27'],
    pesan: [
      { dari: 'line-user-35', isi: 'Puisinya menyentuh. Sudah pernah diterbitkan?' },
      { dari: 'line-user-27', isi: 'Belum, baru share di sini. Makasih apresiasinya!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_3: PercakapanLine[] = [
  {
    id: 'line-dm-31', peserta: ['line-user-31', 'line-user-9'],
    pesan: [
      { dari: 'line-user-31', isi: 'Kak, tips pilih jurusan dong. Galau nih.' },
      { dari: 'line-user-9', isi: 'Ikuti tes minat dulu, lalu diskusi dengan ortu bawa data prospek kerja.' },
      { dari: 'line-user-31', isi: 'Oke, makasih sarannya!' },
    ],
  },
  {
    id: 'line-dm-32', peserta: ['line-user-32', 'line-user-12'],
    pesan: [
      { dari: 'line-user-32', isi: 'Burnout itu gejalanya apa aja sih?' },
      { dari: 'line-user-12', isi: 'Lelah terus, sinis ke kerjaan, dan performa turun. Istirahat beneran, bukan sekadar rebahan sambil mikir kerja.' },
    ],
  },
  {
    id: 'line-dm-33', peserta: ['line-user-33', 'line-user-19'],
    pesan: [
      { dari: 'line-user-33', isi: 'Kangen kampung juga. Biasanya obatnya apa?' },
      { dari: 'line-user-19', isi: 'Video call keluarga tiap minggu + masak makanan kampung sendiri.' },
    ],
  },
  {
    id: 'line-dm-34', peserta: ['line-user-34', 'line-user-7'],
    pesan: [
      { dari: 'line-user-34', isi: 'Tips presentasi biar tidak grogi?' },
      { dari: 'line-user-7', isi: 'Latihan 3x, siapkan 3 poin utama, dan ingat: audiens ingin kamu berhasil.' },
    ],
  },
  {
    id: 'line-dm-35', peserta: ['line-user-35', 'line-user-5'],
    pesan: [
      { dari: 'line-user-35', isi: 'Selamat beasiswanya! Tahap 2 kapan?' },
      { dari: 'line-user-5', isi: 'Bulan depan. Doakan ya!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_4: PercakapanLine[] = [
  {
    id: 'line-dm-36', peserta: ['line-user-31', 'line-user-12'],
    pesan: [
      { dari: 'line-user-31', isi: 'Template poster dakwahnya boleh dipakai untuk masjid kami?' },
      { dari: 'line-user-12', isi: 'Silakan! Gratis untuk kegiatan dakwah.' },
    ],
  },
  {
    id: 'line-dm-37', peserta: ['line-user-32', 'line-user-19'],
    pesan: [
      { dari: 'line-user-32', isi: 'Cat air merk apa yang bagus untuk pemula?' },
      { dari: 'line-user-19', isi: 'Mulai dari yang student grade dulu, nanti naik ke artist grade.' },
    ],
  },
  {
    id: 'line-dm-38', peserta: ['line-user-33', 'line-user-5'],
    pesan: [
      { dari: 'line-user-33', isi: 'Template kasir spreadsheetnya boleh dishare?' },
      { dari: 'line-user-5', isi: 'Boleh, nanti saya upload filenya.' },
    ],
  },
  {
    id: 'line-dm-39', peserta: ['line-user-34', 'line-user-8'],
    pesan: [
      { dari: 'line-user-34', isi: 'Nutrisi hidroponiknya pakai apa?' },
      { dari: 'line-user-8', isi: 'AB mix, 5ml per liter air.' },
    ],
  },
  {
    id: 'line-dm-40', peserta: ['line-user-35', 'line-user-14'],
    pesan: [
      { dari: 'line-user-35', isi: 'Chord lagunya boleh dishare?' },
      { dari: 'line-user-14', isi: 'Boleh banget! Nanti saya tulis di kolom komentar.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_5: PercakapanLine[] = [
  {
    id: 'line-dm-41', peserta: ['line-user-31', 'line-user-19'],
    pesan: [
      { dari: 'line-user-31', isi: 'Overthinkingnya sudah membaik? Saya coba teknik nulis jurnal.' },
      { dari: 'line-user-19', isi: 'Alhamdulillah lumayan. Jurnal memang membantu ya.' },
    ],
  },
  {
    id: 'line-dm-42', peserta: ['line-user-32', 'line-user-5'],
    pesan: [
      { dari: 'line-user-32', isi: 'Mau resign tapi takut. Gimana dulu kamu memutuskan?' },
      { dari: 'line-user-5', isi: 'Saya siapkan dana 6 bulan dulu baru berani.' },
    ],
  },
  {
    id: 'line-dm-43', peserta: ['line-user-33', 'line-user-12'],
    pesan: [
      { dari: 'line-user-33', isi: 'Anak demam 39, kapan ke dokter?' },
      { dari: 'line-user-12', isi: 'Bila >3 hari atau ada kejang/sesak, segera ke dokter.' },
    ],
  },
  {
    id: 'line-dm-44', peserta: ['line-user-34', 'line-user-9'],
    pesan: [
      { dari: 'line-user-34', isi: 'Skripsinya sudah sampai mana?' },
      { dari: 'line-user-9', isi: 'Bab 4. Semangat, tinggal dikit lagi!' },
    ],
  },
  {
    id: 'line-dm-45', peserta: ['line-user-35', 'line-user-7'],
    pesan: [
      { dari: 'line-user-35', isi: 'Ibunya sudah sehat total?' },
      { dari: 'line-user-7', isi: 'Alhamdulillah sudah. Makasih banyak doanya.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_6: PercakapanLine[] = [
  {
    id: 'line-dm-46', peserta: ['line-user-31', 'line-user-28'],
    pesan: [
      { dari: 'line-user-31', isi: 'Beasiswa LPDP persyaratannya apa saja?' },
      { dari: 'line-user-28', isi: 'IPK 3.0, IELTS 6.5, dan esai kontribusi. Siapkan dari sekarang.' },
    ],
  },
  {
    id: 'line-dm-47', peserta: ['line-user-32', 'line-user-29'],
    pesan: [
      { dari: 'line-user-32', isi: 'Tanaman cabeku layu terus. Kenapa ya?' },
      { dari: 'line-user-29', isi: 'Mungkin overwatering. Cek drainase potnya.' },
    ],
  },
  {
    id: 'line-dm-48', peserta: ['line-user-33', 'line-user-30'],
    pesan: [
      { dari: 'line-user-33', isi: 'Boleh minta resep rendangmu?' },
      { dari: 'line-user-30', isi: 'Boleh! Nanti saya kirim lengkap dengan takarannya.' },
    ],
  },
  {
    id: 'line-dm-49', peserta: ['line-user-34', 'line-user-9'],
    pesan: [
      { dari: 'line-user-34', isi: 'Belajar bareng yuk buat UTS.' },
      { dari: 'line-user-9', isi: 'Gas! Sabtu jam 9 di perpus ya.' },
    ],
  },
  {
    id: 'line-dm-50', peserta: ['line-user-35', 'line-user-7'],
    pesan: [
      { dari: 'line-user-35', isi: 'Kopdar Line bulan depan ikut?' },
      { dari: 'line-user-7', isi: 'InsyaAllah ikut. Kabari lokasinya ya.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_7: PercakapanLine[] = [
  {
    id: 'line-dm-51', peserta: ['line-user-26', 'line-user-14'],
    pesan: [
      { dari: 'line-user-26', isi: 'Kaligrafinya bagus! Boleh dipakai buat masjid?' },
      { dari: 'line-user-14', isi: 'Silakan, gratis. Semoga berkah.' },
    ],
  },
  {
    id: 'line-dm-52', peserta: ['line-user-27', 'line-user-8'],
    pesan: [
      { dari: 'line-user-27', isi: 'App kasnya error di Android 14.' },
      { dari: 'line-user-8', isi: 'Coba update ke versi 1.2, sudah diperbaiki.' },
    ],
  },
  {
    id: 'line-dm-53', peserta: ['line-user-28', 'line-user-16'],
    pesan: [
      { dari: 'line-user-28', isi: 'Lokasi foto Milky Way-nya di mana?' },
      { dari: 'line-user-16', isi: 'Dieng, jam 1 pagi. Langit cerah total.' },
    ],
  },
  {
    id: 'line-dm-54', peserta: ['line-user-29', 'line-user-20'],
    pesan: [
      { dari: 'line-user-29', isi: 'Puisinya menyentuh. Sudah diterbitkan?' },
      { dari: 'line-user-20', isi: 'Belum, masih koleksi pribadi.' },
    ],
  },
  {
    id: 'line-dm-55', peserta: ['line-user-30', 'line-user-11'],
    pesan: [
      { dari: 'line-user-30', isi: 'Desain kemasannya keren. Tarifnya berapa?' },
      { dari: 'line-user-11', isi: 'Mulai 150rb per desain. Bisa nego.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_8: PercakapanLine[] = [
  {
    id: 'line-dm-56', peserta: ['line-user-16', 'line-user-10'],
    pesan: [
      { dari: 'line-user-16', isi: 'Covernya enak didengar. Pakai mic apa?' },
      { dari: 'line-user-10', isi: 'Mic HP + aplikasi editing gratis.' },
    ],
  },
  {
    id: 'line-dm-57', peserta: ['line-user-17', 'line-user-13'],
    pesan: [
      { dari: 'line-user-17', isi: 'Infografisnya boleh dipakai untuk penyuluhan?' },
      { dari: 'line-user-13', isi: 'Boleh banget! Cantumkan sumber ya.' },
    ],
  },
  {
    id: 'line-dm-58', peserta: ['line-user-18', 'line-user-6'],
    pesan: [
      { dari: 'line-user-18', isi: 'Robotnya bisa belok tajam?' },
      { dari: 'line-user-6', isi: 'Bisa, PID-nya sudah dituning.' },
    ],
  },
  {
    id: 'line-dm-59', peserta: ['line-user-19', 'line-user-22'],
    pesan: [
      { dari: 'line-user-19', isi: 'Kue lapisnya cantik. Jual?' },
      { dari: 'line-user-22', isi: 'Terima pesanan, 50rb per loyang.' },
    ],
  },
  {
    id: 'line-dm-60', peserta: ['line-user-20', 'line-user-3'],
    pesan: [
      { dari: 'line-user-20', isi: 'Esainya bagus. Pernah ke desa yang ditulis?' },
      { dari: 'line-user-3', isi: 'Pernah KKN di sana 2 bulan.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_9: PercakapanLine[] = [
  {
    id: 'line-dm-61', peserta: ['line-user-6', 'line-user-19'],
    pesan: [
      { dari: 'line-user-6', isi: 'Sketsanya detail banget. Terima order?' },
      { dari: 'line-user-19', isi: 'Terima, 100rb per wajah.' },
    ],
  },
  {
    id: 'line-dm-62', peserta: ['line-user-7', 'line-user-23'],
    pesan: [
      { dari: 'line-user-7', isi: 'Template undangannya bisa custom warna?' },
      { dari: 'line-user-23', isi: 'Bisa, kirim kode warnanya.' },
    ],
  },
  {
    id: 'line-dm-63', peserta: ['line-user-8', 'line-user-25'],
    pesan: [
      { dari: 'line-user-8', isi: 'LDR-nya pakai resistor berapa?' },
      { dari: 'line-user-25', isi: '10k ohm, diseri dengan LDR.' },
    ],
  },
  {
    id: 'line-dm-64', peserta: ['line-user-9', 'line-user-27'],
    pesan: [
      { dari: 'line-user-9', isi: 'Novelnya genre apa?' },
      { dari: 'line-user-27', isi: 'Fantasi petualangan.' },
    ],
  },
  {
    id: 'line-dm-65', peserta: ['line-user-10', 'line-user-29'],
    pesan: [
      { dari: 'line-user-10', isi: 'Timelapse pakai aplikasi apa?' },
      { dari: 'line-user-29', isi: 'Kamera HP + interval 2 detik.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_10: PercakapanLine[] = [
  {
    id: 'line-dm-66', peserta: ['line-user-11', 'line-user-31'],
    pesan: [
      { dari: 'line-user-11', isi: 'Foto produknya bisa untuk katalog?' },
      { dari: 'line-user-31', isi: 'Bisa, 50rb per produk.' },
    ],
  },
  {
    id: 'line-dm-67', peserta: ['line-user-12', 'line-user-32'],
    pesan: [
      { dari: 'line-user-12', isi: 'Desain feed IG-nya bagus!' },
      { dari: 'line-user-32', isi: 'Makasih! Template tersedia.' },
    ],
  },
  {
    id: 'line-dm-68', peserta: ['line-user-13', 'line-user-33'],
    pesan: [
      { dari: 'line-user-13', isi: 'Cover lagunya enak didengar.' },
      { dari: 'line-user-33', isi: 'Terima kasih banyak!' },
    ],
  },
  {
    id: 'line-dm-69', peserta: ['line-user-14', 'line-user-34'],
    pesan: [
      { dari: 'line-user-14', isi: 'Web UMKM-nya responsif ya.' },
      { dari: 'line-user-34', isi: 'Iya, mobile-first.' },
    ],
  },
  {
    id: 'line-dm-70', peserta: ['line-user-15', 'line-user-35'],
    pesan: [
      { dari: 'line-user-15', isi: 'Tips hidroponiknya berhasil!' },
      { dari: 'line-user-35', isi: 'Alhamdulillah, lanjutkan!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_11: PercakapanLine[] = [
  {
    id: 'line-dm-71', peserta: ['line-user-16', 'line-user-1'],
    pesan: [
      { dari: 'line-user-16', isi: 'Tips dietnya boleh dishare?' },
      { dari: 'line-user-1', isi: 'Boleh, defisit kalori + olahraga.' },
    ],
  },
  {
    id: 'line-dm-72', peserta: ['line-user-17', 'line-user-2'],
    pesan: [
      { dari: 'line-user-17', isi: 'Komunikasi dengan mertua gimana caranya?' },
      { dari: 'line-user-2', isi: 'Dengarkan dulu, jangan defensif.' },
    ],
  },
  {
    id: 'line-dm-73', peserta: ['line-user-18', 'line-user-3'],
    pesan: [
      { dari: 'line-user-18', isi: 'Tiket mudik sudah pesan?' },
      { dari: 'line-user-3', isi: 'Sudah, H-30 lebih murah.' },
    ],
  },
  {
    id: 'line-dm-74', peserta: ['line-user-19', 'line-user-4'],
    pesan: [
      { dari: 'line-user-19', isi: 'Beasiswanya dari mana?' },
      { dari: 'line-user-4', isi: 'LPDP, coba daftar tahun depan.' },
    ],
  },
  {
    id: 'line-dm-75', peserta: ['line-user-20', 'line-user-5'],
    pesan: [
      { dari: 'line-user-20', isi: 'Komunitasnya aktif banget ya.' },
      { dari: 'line-user-5', isi: 'Iya, gabung grupnya yuk!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_12: PercakapanLine[] = [
  {
    id: 'line-dm-76', peserta: ['line-user-21', 'line-user-6'],
    pesan: [
      { dari: 'line-user-21', isi: 'Order sketsa wajah 2 orang bisa?' },
      { dari: 'line-user-6', isi: 'Bisa, 180rb untuk 2 wajah.' },
    ],
  },
  {
    id: 'line-dm-77', peserta: ['line-user-22', 'line-user-7'],
    pesan: [
      { dari: 'line-user-22', isi: 'Undangan digitalnya bisa revisi berapa kali?' },
      { dari: 'line-user-7', isi: '3x revisi untuk paket hemat.' },
    ],
  },
  {
    id: 'line-dm-78', peserta: ['line-user-23', 'line-user-8'],
    pesan: [
      { dari: 'line-user-23', isi: 'Rangkaian sensornya pakai Arduino?' },
      { dari: 'line-user-8', isi: 'Iya, Arduino Nano.' },
    ],
  },
  {
    id: 'line-dm-79', peserta: ['line-user-24', 'line-user-9'],
    pesan: [
      { dari: 'line-user-24', isi: 'Novelnya sudah terbit?' },
      { dari: 'line-user-9', isi: 'Masih draft, doakan ya!' },
    ],
  },
  {
    id: 'line-dm-80', peserta: ['line-user-25', 'line-user-10'],
    pesan: [
      { dari: 'line-user-25', isi: 'Timelapse-nya pakai interval berapa?' },
      { dari: 'line-user-10', isi: '2 detik per frame.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_13: PercakapanLine[] = [
  {
    id: 'line-dm-81', peserta: ['line-user-26', 'line-user-11'],
    pesan: [
      { dari: 'line-user-26', isi: 'Foto makronya pakai lensa apa?' },
      { dari: 'line-user-11', isi: 'Lensa makro 100mm.' },
    ],
  },
  {
    id: 'line-dm-82', peserta: ['line-user-27', 'line-user-12'],
    pesan: [
      { dari: 'line-user-27', isi: 'Posternya bisa untuk acara kami?' },
      { dari: 'line-user-12', isi: 'Bisa, kirim detail acaranya.' },
    ],
  },
  {
    id: 'line-dm-83', peserta: ['line-user-28', 'line-user-13'],
    pesan: [
      { dari: 'line-user-28', isi: 'Lagu anaknya boleh dipakai di sekolah?' },
      { dari: 'line-user-13', isi: 'Boleh, gratis untuk edukasi.' },
    ],
  },
  {
    id: 'line-dm-84', peserta: ['line-user-29', 'line-user-14'],
    pesan: [
      { dari: 'line-user-29', isi: 'Aplikasi kasirnya open source?' },
      { dari: 'line-user-14', isi: 'Iya, di GitHub.' },
    ],
  },
  {
    id: 'line-dm-85', peserta: ['line-user-30', 'line-user-15'],
    pesan: [
      { dari: 'line-user-30', isi: 'Kebun vertikalnya pakai sistem apa?' },
      { dari: 'line-user-15', isi: 'Wick system, paling simpel.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_14: PercakapanLine[] = [
  {
    id: 'line-dm-86', peserta: ['line-user-31', 'line-user-16'],
    pesan: [
      { dari: 'line-user-31', isi: 'Tips dietnya sudah kucoba seminggu.' },
      { dari: 'line-user-16', isi: 'Hasilnya gimana?' },
    ],
  },
  {
    id: 'line-dm-87', peserta: ['line-user-32', 'line-user-17'],
    pesan: [
      { dari: 'line-user-32', isi: 'Komunikasi dengan mertua membaik?' },
      { dari: 'line-user-17', isi: 'Alhamdulillah, berkat tipsmu.' },
    ],
  },
  {
    id: 'line-dm-88', peserta: ['line-user-33', 'line-user-18'],
    pesan: [
      { dari: 'line-user-33', isi: 'Tiket mudik dapat harga berapa?' },
      { dari: 'line-user-18', isi: '800rb PP.' },
    ],
  },
  {
    id: 'line-dm-89', peserta: ['line-user-34', 'line-user-19'],
    pesan: [
      { dari: 'line-user-34', isi: 'LPDP buka kapan?' },
      { dari: 'line-user-19', isi: 'Cek web resminya tiap awal tahun.' },
    ],
  },
  {
    id: 'line-dm-90', peserta: ['line-user-35', 'line-user-20'],
    pesan: [
      { dari: 'line-user-35', isi: 'Sudah gabung grup komunitas?' },
      { dari: 'line-user-20', isi: 'Sudah, rame banget!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_15: PercakapanLine[] = [
  {
    id: 'line-dm-91', peserta: ['line-user-31', 'line-user-20'],
    pesan: [
      { dari: 'line-user-31', isi: 'Resep sambalnya juara!' },
      { dari: 'line-user-20', isi: 'Senang kamu suka.' },
    ],
  },
  {
    id: 'line-dm-92', peserta: ['line-user-32', 'line-user-21'],
    pesan: [
      { dari: 'line-user-32', isi: 'Logo komunitasnya bagus.' },
      { dari: 'line-user-21', isi: 'Terima kasih!' },
    ],
  },
  {
    id: 'line-dm-93', peserta: ['line-user-33', 'line-user-22'],
    pesan: [
      { dari: 'line-user-33', isi: 'Boleh pakai aransemennya?' },
      { dari: 'line-user-22', isi: 'Boleh, dengan kredit ya.' },
    ],
  },
  {
    id: 'line-dm-94', peserta: ['line-user-34', 'line-user-23'],
    pesan: [
      { dari: 'line-user-34', isi: 'Template PPT-nya rapi.' },
      { dari: 'line-user-23', isi: 'Silakan diunduh.' },
    ],
  },
  {
    id: 'line-dm-95', peserta: ['line-user-35', 'line-user-24'],
    pesan: [
      { dari: 'line-user-35', isi: 'Kapan ngumpul komunitas?' },
      { dari: 'line-user-24', isi: 'Minggu depan.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_16: PercakapanLine[] = [
  {
    id: 'line-dm-96', peserta: ['line-user-31', 'line-user-24'],
    pesan: [
      { dari: 'line-user-31', isi: 'Kerja lembur terus, capek.' },
      { dari: 'line-user-24', isi: 'Semangat, jaga kesehatan!' },
    ],
  },
  {
    id: 'line-dm-97', peserta: ['line-user-32', 'line-user-25'],
    pesan: [
      { dari: 'line-user-32', isi: 'Anak sudah sehat?' },
      { dari: 'line-user-25', isi: 'Sudah, makasih doanya.' },
    ],
  },
  {
    id: 'line-dm-98', peserta: ['line-user-33', 'line-user-26'],
    pesan: [
      { dari: 'line-user-33', isi: 'Warung lagi sepi.' },
      { dari: 'line-user-26', isi: 'Coba promosi di sosmed.' },
    ],
  },
  {
    id: 'line-dm-99', peserta: ['line-user-34', 'line-user-27'],
    pesan: [
      { dari: 'line-user-34', isi: 'Skripsi revisi lagi.' },
      { dari: 'line-user-27', isi: 'Sedikit lagi selesai!' },
    ],
  },
  {
    id: 'line-dm-100', peserta: ['line-user-35', 'line-user-28'],
    pesan: [
      { dari: 'line-user-35', isi: 'Rindu kampung halaman.' },
      { dari: 'line-user-28', isi: 'Rencanakan mudik bareng.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_17: PercakapanLine[] = [
  {
    id: 'line-dm-101', peserta: ['line-user-31', 'line-user-29'],
    pesan: [
      { dari: 'line-user-31', isi: 'Puisinya bagus!' },
      { dari: 'line-user-29', isi: 'Makasih banyak.' },
    ],
  },
  {
    id: 'line-dm-102', peserta: ['line-user-32', 'line-user-30'],
    pesan: [
      { dari: 'line-user-32', isi: 'Bisa request sketsa?' },
      { dari: 'line-user-30', isi: 'Bisa, DM aja.' },
    ],
  },
  {
    id: 'line-dm-103', peserta: ['line-user-33', 'line-user-31'],
    pesan: [
      { dari: 'line-user-33', isi: 'Cover lagunya enak.' },
      { dari: 'line-user-31', isi: 'Terima kasih!' },
    ],
  },
  {
    id: 'line-dm-104', peserta: ['line-user-34', 'line-user-32'],
    pesan: [
      { dari: 'line-user-34', isi: 'Infografisnya informatif.' },
      { dari: 'line-user-32', isi: 'Senang membantu.' },
    ],
  },
  {
    id: 'line-dm-105', peserta: ['line-user-35', 'line-user-33'],
    pesan: [
      { dari: 'line-user-35', isi: 'Cerpennya ditunggu lanjutannya.' },
      { dari: 'line-user-33', isi: 'Segera!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_18: PercakapanLine[] = [
  {
    id: 'line-dm-106', peserta: ['line-user-31', 'line-user-33'],
    pesan: [
      { dari: 'line-user-31', isi: 'Gaji telat juga di tempatmu?' },
      { dari: 'line-user-33', isi: 'Iya, sabar ya.' },
    ],
  },
  {
    id: 'line-dm-107', peserta: ['line-user-32', 'line-user-34'],
    pesan: [
      { dari: 'line-user-32', isi: 'Tetangga berisik banget.' },
      { dari: 'line-user-34', isi: 'Coba tegur baik-baik.' },
    ],
  },
  {
    id: 'line-dm-108', peserta: ['line-user-33', 'line-user-35'],
    pesan: [
      { dari: 'line-user-33', isi: 'Motor mogok lagi.' },
      { dari: 'line-user-35', isi: 'Bawa ke bengkel langganan.' },
    ],
  },
  {
    id: 'line-dm-109', peserta: ['line-user-34', 'line-user-29'],
    pesan: [
      { dari: 'line-user-34', isi: 'Interview gagal lagi.' },
      { dari: 'line-user-29', isi: 'Evaluasi & coba lagi!' },
    ],
  },
  {
    id: 'line-dm-110', peserta: ['line-user-35', 'line-user-30'],
    pesan: [
      { dari: 'line-user-35', isi: 'Banjir masuk rumah.' },
      { dari: 'line-user-30', isi: 'Amankan barang penting dulu.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_19: PercakapanLine[] = [
  {
    id: 'line-dm-111', peserta: ['line-user-31', 'line-user-34'],
    pesan: [
      { dari: 'line-user-31', isi: 'Foto sunsetnya bagus!' },
      { dari: 'line-user-34', isi: 'Makasih!' },
    ],
  },
  {
    id: 'line-dm-112', peserta: ['line-user-32', 'line-user-35'],
    pesan: [
      { dari: 'line-user-32', isi: 'Resep kuenya mau dicoba.' },
      { dari: 'line-user-35', isi: 'Semoga berhasil!' },
    ],
  },
  {
    id: 'line-dm-113', peserta: ['line-user-33', 'line-user-29'],
    pesan: [
      { dari: 'line-user-33', isi: 'Tutorial origaminya jelas.' },
      { dari: 'line-user-29', isi: 'Senang mendengar.' },
    ],
  },
  {
    id: 'line-dm-114', peserta: ['line-user-34', 'line-user-30'],
    pesan: [
      { dari: 'line-user-34', isi: 'Playlistnya enak didengar.' },
      { dari: 'line-user-30', isi: 'Thanks!' },
    ],
  },
  {
    id: 'line-dm-115', peserta: ['line-user-35', 'line-user-31'],
    pesan: [
      { dari: 'line-user-35', isi: 'Tips berkebunnya membantu.' },
      { dari: 'line-user-31', isi: 'Sama-sama!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_20: PercakapanLine[] = [
  {
    id: 'line-dm-116', peserta: ['line-user-31', 'line-user-35'],
    pesan: [
      { dari: 'line-user-31', isi: 'Macet parah hari ini.' },
      { dari: 'line-user-35', isi: 'Lewat jalan alternatif.' },
    ],
  },
  {
    id: 'line-dm-117', peserta: ['line-user-32', 'line-user-29'],
    pesan: [
      { dari: 'line-user-32', isi: 'HP hilang di angkot.' },
      { dari: 'line-user-29', isi: 'Coba hubungi sopirnya.' },
    ],
  },
  {
    id: 'line-dm-118', peserta: ['line-user-33', 'line-user-30'],
    pesan: [
      { dari: 'line-user-33', isi: 'Listrik naik 2x lipat.' },
      { dari: 'line-user-30', isi: 'Cek pemakaian di aplikasi.' },
    ],
  },
  {
    id: 'line-dm-119', peserta: ['line-user-34', 'line-user-31'],
    pesan: [
      { dari: 'line-user-34', isi: 'Beasiswa ditolak lagi.' },
      { dari: 'line-user-31', isi: 'Tetap semangat, coba lagi!' },
    ],
  },
  {
    id: 'line-dm-120', peserta: ['line-user-35', 'line-user-32'],
    pesan: [
      { dari: 'line-user-35', isi: 'Kucingku sakit.' },
      { dari: 'line-user-32', isi: 'Bawa ke dokter hewan ya.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_21: PercakapanLine[] = [
  {
    id: 'line-dm-121', peserta: ['line-user-29', 'line-user-34'],
    pesan: [
      { dari: 'line-user-29', isi: 'Lukisan digitalmu keren!' },
      { dari: 'line-user-34', isi: 'Makasih banyak!' },
    ],
  },
  {
    id: 'line-dm-122', peserta: ['line-user-30', 'line-user-35'],
    pesan: [
      { dari: 'line-user-30', isi: 'Puisinya menyentuh.' },
      { dari: 'line-user-35', isi: 'Terima kasih!' },
    ],
  },
  {
    id: 'line-dm-123', peserta: ['line-user-31', 'line-user-29'],
    pesan: [
      { dari: 'line-user-31', isi: 'Foto makronya detail.' },
      { dari: 'line-user-29', isi: 'Pakai HP saja kok.' },
    ],
  },
  {
    id: 'line-dm-124', peserta: ['line-user-32', 'line-user-30'],
    pesan: [
      { dari: 'line-user-32', isi: 'Resep kuenya mau kucoba.' },
      { dari: 'line-user-30', isi: 'Semoga berhasil!' },
    ],
  },
  {
    id: 'line-dm-125', peserta: ['line-user-33', 'line-user-31'],
    pesan: [
      { dari: 'line-user-33', isi: 'Lampu bambunya unik.' },
      { dari: 'line-user-31', isi: 'Dari bambu bekas!' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_22: PercakapanLine[] = [
  {
    id: 'line-dm-126', peserta: ['line-user-34', 'line-user-29'],
    pesan: [
      { dari: 'line-user-34', isi: 'Lembur terus nih.' },
      { dari: 'line-user-29', isi: 'Istirahat yang cukup ya.' },
    ],
  },
  {
    id: 'line-dm-127', peserta: ['line-user-35', 'line-user-30'],
    pesan: [
      { dari: 'line-user-35', isi: 'Anakku demam.' },
      { dari: 'line-user-30', isi: 'Kompres & bawa ke dokter bila berlanjut.' },
    ],
  },
  {
    id: 'line-dm-128', peserta: ['line-user-29', 'line-user-31'],
    pesan: [
      { dari: 'line-user-29', isi: 'Tetangga karaoke tiap malam.' },
      { dari: 'line-user-31', isi: 'Coba bicara baik-baik dulu.' },
    ],
  },
  {
    id: 'line-dm-129', peserta: ['line-user-30', 'line-user-32'],
    pesan: [
      { dari: 'line-user-30', isi: 'Dietku gagal lagi.' },
      { dari: 'line-user-32', isi: 'Mulai lagi besok, jangan menyerah!' },
    ],
  },
  {
    id: 'line-dm-130', peserta: ['line-user-31', 'line-user-33'],
    pesan: [
      { dari: 'line-user-31', isi: 'Kehujanan di jalan.' },
      { dari: 'line-user-33', isi: 'Minum yang hangat biar tidak masuk angin.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_23: PercakapanLine[] = [
  {
    id: 'line-dm-131', peserta: ['line-user-34', 'line-user-35'],
    pesan: [
      { dari: 'line-user-34', isi: 'Cover lagunya enak!' },
      { dari: 'line-user-35', isi: 'Makasih!' },
    ],
  },
  {
    id: 'line-dm-132', peserta: ['line-user-35', 'line-user-29'],
    pesan: [
      { dari: 'line-user-35', isi: 'Cerpennya bagus.' },
      { dari: 'line-user-29', isi: 'Terima kasih!' },
    ],
  },
  {
    id: 'line-dm-133', peserta: ['line-user-29', 'line-user-30'],
    pesan: [
      { dari: 'line-user-29', isi: 'Infografisnya informatif.' },
      { dari: 'line-user-30', isi: 'Senang membantu.' },
    ],
  },
  {
    id: 'line-dm-134', peserta: ['line-user-30', 'line-user-31'],
    pesan: [
      { dari: 'line-user-30', isi: 'Kue keringnya laris?' },
      { dari: 'line-user-31', isi: 'Alhamdulillah laris!' },
    ],
  },
  {
    id: 'line-dm-135', peserta: ['line-user-31', 'line-user-32'],
    pesan: [
      { dari: 'line-user-31', isi: 'Taman mininya cantik.' },
      { dari: 'line-user-32', isi: 'Dari barang bekas lho.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_24: PercakapanLine[] = [
  {
    id: 'line-dm-136', peserta: ['line-user-32', 'line-user-34'],
    pesan: [
      { dari: 'line-user-32', isi: 'Interview gagal lagi.' },
      { dari: 'line-user-34', isi: 'Evaluasi & coba lagi!' },
    ],
  },
  {
    id: 'line-dm-137', peserta: ['line-user-33', 'line-user-35'],
    pesan: [
      { dari: 'line-user-33', isi: 'Motor mogok di jalan.' },
      { dari: 'line-user-35', isi: 'Sudah panggil bantuan?' },
    ],
  },
  {
    id: 'line-dm-138', peserta: ['line-user-34', 'line-user-29'],
    pesan: [
      { dari: 'line-user-34', isi: 'Kunci rumah hilang.' },
      { dari: 'line-user-29', isi: 'Ada kunci cadangan?' },
    ],
  },
  {
    id: 'line-dm-139', peserta: ['line-user-35', 'line-user-30'],
    pesan: [
      { dari: 'line-user-35', isi: 'Data skripsi hilang.' },
      { dari: 'line-user-30', isi: 'Coba recovery software.' },
    ],
  },
  {
    id: 'line-dm-140', peserta: ['line-user-29', 'line-user-31'],
    pesan: [
      { dari: 'line-user-29', isi: 'Rumah kebanjiran.' },
      { dari: 'line-user-31', isi: 'Amankan barang elektronik dulu.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_25: PercakapanLine[] = [
  {
    id: 'line-dm-141', peserta: ['line-user-35', 'line-user-29'],
    pesan: [
      { dari: 'line-user-35', isi: 'Antre RS lama banget.' },
      { dari: 'line-user-29', isi: 'Coba daftar online.' },
    ],
  },
  {
    id: 'line-dm-142', peserta: ['line-user-29', 'line-user-30'],
    pesan: [
      { dari: 'line-user-29', isi: 'Paketku hilang.' },
      { dari: 'line-user-30', isi: 'Lapor ke ekspedisi.' },
    ],
  },
  {
    id: 'line-dm-143', peserta: ['line-user-30', 'line-user-31'],
    pesan: [
      { dari: 'line-user-30', isi: 'Mati lampu 6 jam.' },
      { dari: 'line-user-31', isi: 'Lapor ke PLN.' },
    ],
  },
  {
    id: 'line-dm-144', peserta: ['line-user-31', 'line-user-32'],
    pesan: [
      { dari: 'line-user-31', isi: 'Air sumur keruh.' },
      { dari: 'line-user-32', isi: 'Pasang filter.' },
    ],
  },
  {
    id: 'line-dm-145', peserta: ['line-user-32', 'line-user-33'],
    pesan: [
      { dari: 'line-user-32', isi: 'Jalan rusak parah.' },
      { dari: 'line-user-33', isi: 'Lapor ke dinas PU.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_26: PercakapanLine[] = [
  {
    id: 'line-dm-146', peserta: ['line-user-33', 'line-user-34'],
    pesan: [
      { dari: 'line-user-33', isi: 'Kaligrafinya bagus.' },
      { dari: 'line-user-34', isi: 'Makasih!' },
    ],
  },
  {
    id: 'line-dm-147', peserta: ['line-user-34', 'line-user-35'],
    pesan: [
      { dari: 'line-user-34', isi: 'Lukisan sunset-nya keren.' },
      { dari: 'line-user-35', isi: 'Terima kasih.' },
    ],
  },
  {
    id: 'line-dm-148', peserta: ['line-user-35', 'line-user-29'],
    pesan: [
      { dari: 'line-user-35', isi: 'Puisinya menyentuh.' },
      { dari: 'line-user-29', isi: 'Untuk ibuku.' },
    ],
  },
  {
    id: 'line-dm-149', peserta: ['line-user-29', 'line-user-30'],
    pesan: [
      { dari: 'line-user-29', isi: 'Rak bukunya kuat?' },
      { dari: 'line-user-30', isi: 'Kuat, lapis 3.' },
    ],
  },
  {
    id: 'line-dm-150', peserta: ['line-user-30', 'line-user-31'],
    pesan: [
      { dari: 'line-user-30', isi: 'Nastar lumernya enak.' },
      { dari: 'line-user-31', isi: 'Resep rahasia.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_27: PercakapanLine[] = [
  {
    id: 'line-dm-151', peserta: ['line-user-31', 'line-user-32'],
    pesan: [
      { dari: 'line-user-31', isi: 'Macet 2 jam tadi.' },
      { dari: 'line-user-32', isi: 'Berangkat lebih pagi.' },
    ],
  },
  {
    id: 'line-dm-152', peserta: ['line-user-32', 'line-user-33'],
    pesan: [
      { dari: 'line-user-32', isi: 'Harga-harga naik.' },
      { dari: 'line-user-33', isi: 'Iya, hemat-hemat.' },
    ],
  },
  {
    id: 'line-dm-153', peserta: ['line-user-33', 'line-user-34'],
    pesan: [
      { dari: 'line-user-33', isi: 'Tetangga karaoke tiap malam.' },
      { dari: 'line-user-34', isi: 'Tegur baik-baik.' },
    ],
  },
  {
    id: 'line-dm-154', peserta: ['line-user-34', 'line-user-35'],
    pesan: [
      { dari: 'line-user-34', isi: 'HP-ku lemot.' },
      { dari: 'line-user-35', isi: 'Hapus cache.' },
    ],
  },
  {
    id: 'line-dm-155', peserta: ['line-user-35', 'line-user-29'],
    pesan: [
      { dari: 'line-user-35', isi: 'Antre bank 3 jam.' },
      { dari: 'line-user-29', isi: 'Pakai mobile banking.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_28: PercakapanLine[] = [
  {
    id: 'line-dm-156', peserta: ['line-user-29', 'line-user-30'],
    pesan: [
      { dari: 'line-user-29', isi: 'Ujian kemarin susah.' },
      { dari: 'line-user-30', isi: 'Semangat!' },
    ],
  },
  {
    id: 'line-dm-157', peserta: ['line-user-30', 'line-user-31'],
    pesan: [
      { dari: 'line-user-30', isi: 'Dompetku hilang.' },
      { dari: 'line-user-31', isi: 'Lapor polisi.' },
    ],
  },
  {
    id: 'line-dm-158', peserta: ['line-user-31', 'line-user-32'],
    pesan: [
      { dari: 'line-user-31', isi: 'Ban bocor di jalan.' },
      { dari: 'line-user-32', isi: 'Panggil tambal ban.' },
    ],
  },
  {
    id: 'line-dm-159', peserta: ['line-user-32', 'line-user-33'],
    pesan: [
      { dari: 'line-user-32', isi: 'Kucingku hilang 2 hari.' },
      { dari: 'line-user-33', isi: 'Cari sekitar rumah.' },
    ],
  },
  {
    id: 'line-dm-160', peserta: ['line-user-33', 'line-user-34'],
    pesan: [
      { dari: 'line-user-33', isi: 'Laptop mati total.' },
      { dari: 'line-user-34', isi: 'Bawa ke servis.' },
    ],
  },
];

const PERCAKAPAN_TAMBAHAN_29: PercakapanLine[] = [
  { id: 'line-dm-161', peserta: ['line-user-36', 'line-user-29'], pesan: [{ dari: 'line-user-36', isi: 'Halo.' }, { dari: 'line-user-29', isi: 'Halo juga.' }] },
  { id: 'line-dm-162', peserta: ['line-user-37', 'line-user-30'], pesan: [{ dari: 'line-user-37', isi: 'Mau tanya.' }, { dari: 'line-user-30', isi: 'Silakan.' }] },
  { id: 'line-dm-163', peserta: ['line-user-38', 'line-user-31'], pesan: [{ dari: 'line-user-38', isi: 'Terima kasih.' }, { dari: 'line-user-31', isi: 'Sama-sama.' }] },
  { id: 'line-dm-164', peserta: ['line-user-39', 'line-user-32'], pesan: [{ dari: 'line-user-39', isi: 'Kapan mulai?' }, { dari: 'line-user-32', isi: 'Besok.' }] },
  { id: 'line-dm-165', peserta: ['line-user-40', 'line-user-33'], pesan: [{ dari: 'line-user-40', isi: 'Sudah selesai?' }, { dari: 'line-user-33', isi: 'Belum.' }] },
];

const PERCAKAPAN_TAMBAHAN_30: PercakapanLine[] = [
  { id: 'line-dm-166', peserta: ['line-user-36', 'line-user-34'], pesan: [{ dari: 'line-user-36', isi: 'Sudah makan?' }, { dari: 'line-user-34', isi: 'Sudah.' }] },
  { id: 'line-dm-167', peserta: ['line-user-37', 'line-user-35'], pesan: [{ dari: 'line-user-37', isi: 'Besok libur?' }, { dari: 'line-user-35', isi: 'Iya.' }] },
  { id: 'line-dm-168', peserta: ['line-user-38', 'line-user-36'], pesan: [{ dari: 'line-user-38', isi: 'Pinjam buku.' }, { dari: 'line-user-36', isi: 'Boleh.' }] },
  { id: 'line-dm-169', peserta: ['line-user-39', 'line-user-37'], pesan: [{ dari: 'line-user-39', isi: 'Nonton yuk.' }, { dari: 'line-user-37', isi: 'Ayo.' }] },
  { id: 'line-dm-170', peserta: ['line-user-40', 'line-user-38'], pesan: [{ dari: 'line-user-40', isi: 'Sudah sampai?' }, { dari: 'line-user-38', isi: 'Otw.' }] },
];

const PERCAKAPAN_TAMBAHAN_31: PercakapanLine[] = [
  { id: 'line-dm-171', peserta: ['line-user-36', 'line-user-39'], pesan: [{ dari: 'line-user-36', isi: 'Lagi apa?' }, { dari: 'line-user-39', isi: 'Kerja.' }] },
  { id: 'line-dm-172', peserta: ['line-user-37', 'line-user-40'], pesan: [{ dari: 'line-user-37', isi: 'Mau ikut?' }, { dari: 'line-user-40', isi: 'Ikut.' }] },
  { id: 'line-dm-173', peserta: ['line-user-38', 'line-user-29'], pesan: [{ dari: 'line-user-38', isi: 'Sudah coba?' }, { dari: 'line-user-29', isi: 'Sudah.' }] },
  { id: 'line-dm-174', peserta: ['line-user-39', 'line-user-30'], pesan: [{ dari: 'line-user-39', isi: 'Kapan pulang?' }, { dari: 'line-user-30', isi: 'Sore.' }] },
  { id: 'line-dm-175', peserta: ['line-user-40', 'line-user-31'], pesan: [{ dari: 'line-user-40', isi: 'Terima kasih.' }, { dari: 'line-user-31', isi: 'Sama-sama.' }] },
];

const PERCAKAPAN_TAMBAHAN_32: PercakapanLine[] = [
  { id: 'line-dm-176', peserta: ['line-user-36', 'line-user-32'], pesan: [{ dari: 'line-user-36', isi: 'Sudah sarapan?' }, { dari: 'line-user-32', isi: 'Sudah.' }] },
  { id: 'line-dm-177', peserta: ['line-user-37', 'line-user-33'], pesan: [{ dari: 'line-user-37', isi: 'Cuaca panas.' }, { dari: 'line-user-33', isi: 'Iya.' }] },
  { id: 'line-dm-178', peserta: ['line-user-38', 'line-user-34'], pesan: [{ dari: 'line-user-38', isi: 'Mau ke mana?' }, { dari: 'line-user-34', isi: 'Pasar.' }] },
  { id: 'line-dm-179', peserta: ['line-user-39', 'line-user-35'], pesan: [{ dari: 'line-user-39', isi: 'Sudah bayar?' }, { dari: 'line-user-35', isi: 'Sudah.' }] },
  { id: 'line-dm-180', peserta: ['line-user-40', 'line-user-36'], pesan: [{ dari: 'line-user-40', isi: 'Besok ketemu.' }, { dari: 'line-user-36', isi: 'Oke.' }] },
];

const PERCAKAPAN_TAMBAHAN_33: PercakapanLine[] = [
  { id: 'line-dm-181', peserta: ['line-user-36', 'line-user-37'], pesan: [{ dari: 'line-user-36', isi: 'Sudah makan?' }, { dari: 'line-user-37', isi: 'Belum.' }] },
  { id: 'line-dm-182', peserta: ['line-user-37', 'line-user-38'], pesan: [{ dari: 'line-user-37', isi: 'Jam berapa?' }, { dari: 'line-user-38', isi: 'Jam 5.' }] },
  { id: 'line-dm-183', peserta: ['line-user-38', 'line-user-39'], pesan: [{ dari: 'line-user-38', isi: 'Di mana?' }, { dari: 'line-user-39', isi: 'Rumah.' }] },
  { id: 'line-dm-184', peserta: ['line-user-39', 'line-user-40'], pesan: [{ dari: 'line-user-39', isi: 'Kapan?' }, { dari: 'line-user-40', isi: 'Besok.' }] },
  { id: 'line-dm-185', peserta: ['line-user-40', 'line-user-36'], pesan: [{ dari: 'line-user-40', isi: 'Sampai jumpa.' }, { dari: 'line-user-36', isi: 'Dadah.' }] },
];

const PERCAKAPAN_TAMBAHAN_34: PercakapanLine[] = [
  { id: 'line-dm-186', peserta: ['line-user-36', 'line-user-38'], pesan: [{ dari: 'line-user-36', isi: 'Sudah sampai?' }, { dari: 'line-user-38', isi: 'Baru jalan.' }] },
  { id: 'line-dm-187', peserta: ['line-user-37', 'line-user-39'], pesan: [{ dari: 'line-user-37', isi: 'Bawa apa?' }, { dari: 'line-user-39', isi: 'Kue.' }] },
  { id: 'line-dm-188', peserta: ['line-user-38', 'line-user-40'], pesan: [{ dari: 'line-user-38', isi: 'Jam 7 ya.' }, { dari: 'line-user-40', isi: 'Oke.' }] },
  { id: 'line-dm-189', peserta: ['line-user-39', 'line-user-36'], pesan: [{ dari: 'line-user-39', isi: 'Hujan nih.' }, { dari: 'line-user-36', isi: 'Bawa payung.' }] },
  { id: 'line-dm-190', peserta: ['line-user-40', 'line-user-37'], pesan: [{ dari: 'line-user-40', isi: 'Makasih ya.' }, { dari: 'line-user-37', isi: 'Sama-sama.' }] },
];

const PERCAKAPAN_TAMBAHAN_35: PercakapanLine[] = [
  { id: 'line-dm-191', peserta: ['line-user-36', 'line-user-39'], pesan: [{ dari: 'line-user-36', isi: 'Lagi apa?' }, { dari: 'line-user-39', isi: 'Nonton.' }] },
  { id: 'line-dm-192', peserta: ['line-user-37', 'line-user-40'], pesan: [{ dari: 'line-user-37', isi: 'Sudah shalat?' }, { dari: 'line-user-40', isi: 'Sudah.' }] },
  { id: 'line-dm-193', peserta: ['line-user-38', 'line-user-36'], pesan: [{ dari: 'line-user-38', isi: 'Besok libur.' }, { dari: 'line-user-36', isi: 'Asik.' }] },
  { id: 'line-dm-194', peserta: ['line-user-39', 'line-user-37'], pesan: [{ dari: 'line-user-39', isi: 'Mau ikut?' }, { dari: 'line-user-37', isi: 'Ikut.' }] },
  { id: 'line-dm-195', peserta: ['line-user-40', 'line-user-38'], pesan: [{ dari: 'line-user-40', isi: 'Sampai kapan?' }, { dari: 'line-user-38', isi: 'Sore.' }] },
];

const PERCAKAPAN_TAMBAHAN_36: PercakapanLine[] = [
  { id: 'line-dm-196', peserta: ['line-user-36', 'line-user-40'], pesan: [{ dari: 'line-user-36', isi: 'Sudah makan?' }, { dari: 'line-user-40', isi: 'Sudah.' }] },
  { id: 'line-dm-197', peserta: ['line-user-37', 'line-user-36'], pesan: [{ dari: 'line-user-37', isi: 'Pinjam buku.' }, { dari: 'line-user-36', isi: 'Boleh.' }] },
  { id: 'line-dm-198', peserta: ['line-user-38', 'line-user-37'], pesan: [{ dari: 'line-user-38', isi: 'Besok pagi.' }, { dari: 'line-user-37', isi: 'Oke.' }] },
  { id: 'line-dm-199', peserta: ['line-user-39', 'line-user-38'], pesan: [{ dari: 'line-user-39', isi: 'Sampai jam berapa?' }, { dari: 'line-user-38', isi: 'Jam 5.' }] },
  { id: 'line-dm-200', peserta: ['line-user-40', 'line-user-39'], pesan: [{ dari: 'line-user-40', isi: 'Hati-hati.' }, { dari: 'line-user-39', isi: 'Makasih.' }] },
];

const PERCAKAPAN_TAMBAHAN_37: PercakapanLine[] = [
  { id: 'line-dm-201', peserta: ['line-user-36', 'line-user-37'], pesan: [{ dari: 'line-user-36', isi: 'Pagi.' }, { dari: 'line-user-37', isi: 'Pagi juga.' }] },
  { id: 'line-dm-202', peserta: ['line-user-38', 'line-user-39'], pesan: [{ dari: 'line-user-38', isi: 'Sudah sampai?' }, { dari: 'line-user-39', isi: 'Baru parkir.' }] },
  { id: 'line-dm-203', peserta: ['line-user-40', 'line-user-36'], pesan: [{ dari: 'line-user-40', isi: 'Mampir yuk.' }, { dari: 'line-user-36', isi: 'Nanti sore.' }] },
  { id: 'line-dm-204', peserta: ['line-user-37', 'line-user-40'], pesan: [{ dari: 'line-user-37', isi: 'Bawa apa?' }, { dari: 'line-user-40', isi: 'Bawa kue.' }] },
  { id: 'line-dm-205', peserta: ['line-user-39', 'line-user-36'], pesan: [{ dari: 'line-user-39', isi: 'Sampai jumpa.' }, { dari: 'line-user-36', isi: 'Dadah.' }] },
];

const PERCAKAPAN_TAMBAHAN_38: PercakapanLine[] = [
  { id: 'line-dm-206', peserta: ['line-user-36', 'line-user-38'], pesan: [{ dari: 'line-user-36', isi: 'Mau tanya.' }, { dari: 'line-user-38', isi: 'Tanya apa?' }] },
  { id: 'line-dm-207', peserta: ['line-user-37', 'line-user-39'], pesan: [{ dari: 'line-user-37', isi: 'Besok bisa?' }, { dari: 'line-user-39', isi: 'Bisa.' }] },
  { id: 'line-dm-208', peserta: ['line-user-38', 'line-user-40'], pesan: [{ dari: 'line-user-38', isi: 'Jam berapa?' }, { dari: 'line-user-40', isi: 'Jam 9.' }] },
  { id: 'line-dm-209', peserta: ['line-user-39', 'line-user-37'], pesan: [{ dari: 'line-user-39', isi: 'Di mana?' }, { dari: 'line-user-37', isi: 'Di kafe.' }] },
  { id: 'line-dm-210', peserta: ['line-user-40', 'line-user-36'], pesan: [{ dari: 'line-user-40', isi: 'Oke deal.' }, { dari: 'line-user-36', isi: 'Sip.' }] },
];

const PERCAKAPAN_TAMBAHAN_39: PercakapanLine[] = [
  { id: 'line-dm-211', peserta: ['line-user-36', 'line-user-39'], pesan: [{ dari: 'line-user-36', isi: 'Lagi sibuk?' }, { dari: 'line-user-39', isi: 'Lumayan.' }] },
  { id: 'line-dm-212', peserta: ['line-user-37', 'line-user-36'], pesan: [{ dari: 'line-user-37', isi: 'Makan yuk.' }, { dari: 'line-user-36', isi: 'Gas.' }] },
  { id: 'line-dm-213', peserta: ['line-user-38', 'line-user-37'], pesan: [{ dari: 'line-user-38', isi: 'Nanti malam.' }, { dari: 'line-user-37', isi: 'Oke.' }] },
  { id: 'line-dm-214', peserta: ['line-user-39', 'line-user-40'], pesan: [{ dari: 'line-user-39', isi: 'Sudah beres?' }, { dari: 'line-user-40', isi: 'Beres.' }] },
  { id: 'line-dm-215', peserta: ['line-user-40', 'line-user-38'], pesan: [{ dari: 'line-user-40', isi: 'Makasih banyak.' }, { dari: 'line-user-38', isi: 'Sama-sama.' }] },
];

const PERCAKAPAN_TAMBAHAN_40: PercakapanLine[] = [
  { id: 'line-dm-216', peserta: ['line-user-36', 'line-user-40'], pesan: [{ dari: 'line-user-36', isi: 'Besok jadi?' }, { dari: 'line-user-40', isi: 'Jadi.' }] },
  { id: 'line-dm-217', peserta: ['line-user-37', 'line-user-38'], pesan: [{ dari: 'line-user-37', isi: 'Pinjam charger.' }, { dari: 'line-user-38', isi: 'Ambil aja.' }] },
  { id: 'line-dm-218', peserta: ['line-user-38', 'line-user-39'], pesan: [{ dari: 'line-user-38', isi: 'Udah makan?' }, { dari: 'line-user-39', isi: 'Belum.' }] },
  { id: 'line-dm-219', peserta: ['line-user-39', 'line-user-36'], pesan: [{ dari: 'line-user-39', isi: 'Hati-hati di jalan.' }, { dari: 'line-user-36', isi: 'Siap.' }] },
  { id: 'line-dm-220', peserta: ['line-user-40', 'line-user-37'], pesan: [{ dari: 'line-user-40', isi: 'Nanti kabari.' }, { dari: 'line-user-37', isi: 'Oke.' }] },
];

export const SEMUA_PERCAKAPAN: PercakapanLine[] = [...PERCAKAPAN_LINE, ...PERCAKAPAN_TAMBAHAN, ...PERCAKAPAN_TAMBAHAN_2, ...PERCAKAPAN_TAMBAHAN_3, ...PERCAKAPAN_TAMBAHAN_4, ...PERCAKAPAN_TAMBAHAN_5, ...PERCAKAPAN_TAMBAHAN_6, ...PERCAKAPAN_TAMBAHAN_7, ...PERCAKAPAN_TAMBAHAN_8, ...PERCAKAPAN_TAMBAHAN_9, ...PERCAKAPAN_TAMBAHAN_10, ...PERCAKAPAN_TAMBAHAN_11, ...PERCAKAPAN_TAMBAHAN_12, ...PERCAKAPAN_TAMBAHAN_13, ...PERCAKAPAN_TAMBAHAN_14, ...PERCAKAPAN_TAMBAHAN_15, ...PERCAKAPAN_TAMBAHAN_16, ...PERCAKAPAN_TAMBAHAN_17, ...PERCAKAPAN_TAMBAHAN_18, ...PERCAKAPAN_TAMBAHAN_19, ...PERCAKAPAN_TAMBAHAN_20, ...PERCAKAPAN_TAMBAHAN_21, ...PERCAKAPAN_TAMBAHAN_22, ...PERCAKAPAN_TAMBAHAN_23, ...PERCAKAPAN_TAMBAHAN_24, ...PERCAKAPAN_TAMBAHAN_25, ...PERCAKAPAN_TAMBAHAN_26, ...PERCAKAPAN_TAMBAHAN_27, ...PERCAKAPAN_TAMBAHAN_28, ...PERCAKAPAN_TAMBAHAN_29, ...PERCAKAPAN_TAMBAHAN_30, ...PERCAKAPAN_TAMBAHAN_31, ...PERCAKAPAN_TAMBAHAN_32, ...PERCAKAPAN_TAMBAHAN_33, ...PERCAKAPAN_TAMBAHAN_34, ...PERCAKAPAN_TAMBAHAN_35, ...PERCAKAPAN_TAMBAHAN_36, ...PERCAKAPAN_TAMBAHAN_37, ...PERCAKAPAN_TAMBAHAN_38, ...PERCAKAPAN_TAMBAHAN_39, ...PERCAKAPAN_TAMBAHAN_40];

export function profilById(id: string): ProfilLine | undefined {
  return PROFIL_LINE.find((p) => p.id === id);
}

export function kirimanByTipe(tipe: 'karya' | 'curhat'): KirimanLine[] {
  return KIRIMAN_LINE.filter((k) => k.tipe === tipe);
}
