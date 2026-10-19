/**
 * Data 60 Tutorial Madevi (Fase 4).
 * Format baku: masalah → penjelasan → persiapan → cara → risiko → penyelesaian.
 * 10 kategori × 6 tutorial.
 */
import type { Tutorial } from '@/services/tutorial';

export const SEMUA_TUTORIAL: Tutorial[] = [
  // ===== KEHIDUPAN (6) =====
  {
    id: 'tut-hidup-01', slug: 'cara-mencuci-baju-manual', judul: 'Cara Mencuci Baju Manual yang Bersih',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Baju bau apek dan noda tidak hilang meski sudah dicuci.',
    penjelasan: 'Mencuci manual butuh teknik: pisahkan warna, rendam dulu, kucek noda membandel.',
    persiapanAlat: ['Ember/baskom', 'Deterjen', 'Sikat lembut'],
    langkah: [
      { judul: 'Pisahkan', detail: 'Putih, berwarna, dan jeans dipisah.' },
      { judul: 'Rendam', detail: 'Rendam 15-30 menit dengan deterjen.' },
      { judul: 'Kucek noda', detail: 'Sikat lembut pada noda; jangan disikat kasar.' },
      { judul: 'Bilas 2x', detail: 'Bilas hingga busa hilang agar tidak apek.' },
      { judul: 'Jemur', detail: 'Balik baju; jemur di tempat berangin, tidak langsung panas terik untuk berwarna.' },
    ],
    risiko: [{ risiko: 'Luntur', pencegahan: 'Pisahkan warna; cuci baru terpisah dulu.' }],
    penyelesaian: 'Baju bersih, wangi, tidak apek. Jika noda membandel tetap ada, ulangi rendam atau bawa ke laundry.',
    tags: ['cuci', 'baju'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-hidup-02', slug: 'cara-menghilangkan-bau-kulkas', judul: 'Cara Menghilangkan Bau Kulkas',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Kulkas bau tidak sedap meski makanan tertutup.',
    penjelasan: 'Bau dari tumpahan dan makanan basi yang menempel.',
    persiapanAlat: ['Baking soda', 'Lap', 'Air hangat'],
    langkah: [
      { judul: 'Kosongkan', detail: 'Keluarkan semua isi; buang yang basi.' },
      { judul: 'Lap', detail: 'Lap rak dan dinding dengan air hangat + baking soda.' },
      { judul: 'Netralkan', detail: 'Taruh mangkuk baking soda terbuka 24 jam.' },
    ],
    risiko: [{ risiko: 'Bau kembali', pencegahan: 'Bersihkan tumpahan segera; cek kedaluwarsa rutin.' }],
    penyelesaian: 'Kulkas segar. Jika bau menetap, cek saluran pembuangan di belakang.',
    tags: ['kulkas', 'bau'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-hidup-03', slug: 'cara-mengusir-semut', judul: 'Cara Mengusir Semut dari Dapur',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Semut berkerumun di gula dan makanan.',
    penjelasan: 'Semut mengikuti jejak feromon; putus jalurnya dan hilangkan sumber.',
    persiapanAlat: ['Cuka', 'Kapur anti serangga / bedak'],
    langkah: [
      { judul: 'Bersihkan sumber', detail: 'Simpan gula/makanan di wadah rapat.' },
      { judul: 'Hapus jejak', detail: 'Lap jalur semut dengan cuka.' },
      { judul: 'Barikade', detail: 'Tabur bedak/kapur di titik masuk.' },
    ],
    risiko: [{ risiko: 'Racun berbahaya', pencegahan: 'Hindari insektisida semprot dekat makanan.' }],
    penyelesaian: 'Semut hilang dalam 1-2 hari. Jika sarang di dinding, panggil pest control.',
    tags: ['semut', 'dapur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-hidup-04', slug: 'cara-merawat-tanaman-hias', judul: 'Cara Merawat Tanaman Hias agar Subur',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tanaman hias layu padahal disiram tiap hari.',
    penjelasan: 'Kebanyakan mati karena overwatering, bukan kekurangan air.',
    persiapanAlat: ['Pot berlubang', 'Media tanam', 'Pupuk'],
    langkah: [
      { judul: 'Cek tanah', detail: 'Tusuk jari 2 cm; kering baru siram.' },
      { judul: 'Cahaya', detail: 'Terang tak langsung untuk kebanyakan hias daun.' },
      { judul: 'Pupuk', detail: 'Sebulan sekali dosis setengah.' },
      { judul: 'Pangkas', detail: 'Buang daun kuning agar energi ke daun sehat.' },
    ],
    risiko: [{ risiko: 'Busuk akar', pencegahan: 'Pot berlubang + jangan biarkan tergenang.' }],
    penyelesaian: 'Tanaman segar. Jika tetap layu, cek hama di bawah daun.',
    tags: ['tanaman', 'hias'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-hidup-05', slug: 'cara-menghemat-listrik-rumah', judul: 'Cara Menghemat Listrik Rumah Tangga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Tagihan listrik membengkak tanpa tahu penyebabnya.',
    penjelasan: 'AC, kulkas tua, dan standby power adalah penyumbang terbesar.',
    persiapanAlat: ['Catatan tagihan', 'Termometer ruangan (opsional)'],
    langkah: [
      { judul: 'Audit', detail: 'Catat daya tiap alat; hitung pemakaian.' },
      { judul: 'AC 26°C', detail: 'Naikkan suhu; bersihkan filter tiap 2 minggu.' },
      { judul: 'Cabut standby', detail: 'TV, charger, dispenser dicabut jika tak dipakai.' },
      { judul: 'LED', detail: 'Ganti semua lampu ke LED.' },
    ],
    risiko: [{ risiko: 'Tidak nyaman', pencegahan: 'Ubah bertahap; prioritaskan yang boros.' }],
    penyelesaian: 'Tagihan turun 15-30%. Jika tetap tinggi, cek kebocoran atau alat rusak.',
    tags: ['listrik', 'hemat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-hidup-06', slug: 'cara-mengatur-keuangan-bulanan', judul: 'Cara Mengatur Keuangan Bulanan',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'Gaji habis sebelum akhir bulan, tidak tahu ke mana.',
    penjelasan: 'Tanpa pencatatan, kebocoran tak terlihat.',
    persiapanAlat: ['Buku/catatan atau aplikasi', 'Slip gaji'],
    langkah: [
      { judul: 'Catat 1 bulan', detail: 'Catat SEMUA pengeluaran, sekecil apapun.' },
      { judul: 'Kelompokkan', detail: 'Kebutuhan, keinginan, tabungan.' },
      { judul: 'Terapkan 50/30/20', detail: 'Sesuaikan dengan kondisimu.' },
      { judul: 'Otomatiskan tabungan', detail: 'Auto-debit di tanggal gajian.' },
    ],
    risiko: [{ risiko: 'Menyerah', pencegahan: 'Mulai sederhana; jangan terlalu ketat di awal.' }],
    penyelesaian: 'Arus kas terkendali. Evaluasi tiap bulan; sesuaikan target.',
    tags: ['keuangan', 'budget'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== KERJA & KARIER (6) =====
  {
    id: 'tut-kerja-01', slug: 'cara-menulis-lamaran-kerja', judul: 'Cara Menulis Lamaran Kerja yang Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 60,
    masalah: 'Lamaran tidak pernah dipanggil interview.',
    penjelasan: 'HRD memindai 7 detik; lamaran generik langsung tersisih.',
    persiapanAlat: ['CV', 'Info lowongan', 'Email profesional'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Pahami bisnis dan budaya mereka.' },
      { judul: 'Sesuaikan CV', detail: 'Mirror keywords dari lowongan.' },
      { judul: 'Surat lamaran 3 paragraf', detail: 'Siapa kamu, kenapa cocok, ajakan.' },
      { judul: 'Kirim', detail: 'Subjek jelas; lampiran PDF.' },
    ],
    risiko: [{ risiko: 'Typo', pencegahan: 'Baca ulang 2x; minta orang lain cek.' }],
    penyelesaian: 'Lamaran terkirim profesional. Follow up sopan setelah 1-2 minggu.',
    tags: ['lamaran', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-kerja-02', slug: 'cara-menghadapi-interview', judul: 'Cara Menghadapi Interview Kerja',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 90,
    masalah: 'Gugup saat interview, jawaban berantakan.',
    penjelasan: 'Persiapan + struktur jawaban (STAR) mengalahkan grogi.',
    persiapanAlat: ['Riset perusahaan', 'Daftar pertanyaan umum', 'Pakaian rapi'],
    langkah: [
      { judul: 'Latihan STAR', detail: 'Situation-Task-Action-Result untuk tiap pengalaman.' },
      { judul: 'Simulasi', detail: 'Latihan bersuara di depan cermin/teman.' },
      { judul: 'Datang 15 menit awal', detail: 'Tenang dan observasi.' },
      { judul: 'Tanya balik', detail: 'Siapkan 2-3 pertanyaan cerdas.' },
    ],
    risiko: [{ risiko: 'Blank', pencegahan: 'Bawa catatan poin; minta waktu berpikir itu wajar.' }],
    penyelesaian: 'Interview lancar. Kirim ucapan terima kasih setelahnya.',
    tags: ['interview', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-kerja-03', slug: 'cara-meminta-kenaikan-gaji', judul: 'Cara Meminta Kenaikan Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 60,
    masalah: 'Gaji stagnan bertahun-tahun, takut meminta naik.',
    penjelasan: 'Kenaikan didapat dengan bukti nilai, bukan keluhan.',
    persiapanAlat: ['Data pencapaian', 'Riset gaji pasar'],
    langkah: [
      { judul: 'Kumpulkan bukti', detail: 'Pencapaian terukur 6-12 bulan terakhir.' },
      { judul: 'Riset pasar', detail: 'Gaji posisi sejenis di kotamu.' },
      { judul: 'Pilih momen', detail: 'Setelah pencapaian besar / review tahunan.' },
      { judul: 'Sampaikan profesional', detail: 'Fakta + permintaan spesifik + fleksibel (benefit alternatif).' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Tanya syaratnya; minta timeline review berikutnya.' }],
    penyelesaian: 'Keputusan jelas. Jika ditolak tanpa alasan, pertimbangkan opsi lain.',
    tags: ['gaji', 'negosiasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-kerja-04', slug: 'cara-mengatur-waktu-kerja', judul: 'Cara Mengatur Waktu Kerja (Time Management)',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Pekerjaan menumpuk, lembur terus, tetap tidak selesai.',
    penjelasan: 'Masalahnya prioritas, bukan jam kerja.',
    persiapanAlat: ['To-do list', 'Kalender'],
    langkah: [
      { judul: 'Eisenhower Matrix', detail: 'Bagi tugas: penting-mendesak, penting, mendesak, buang.' },
      { judul: 'Time blocking', detail: 'Jadwalkan tugas penting di jam fokus.' },
      { judul: 'Batasi gangguan', detail: 'Notifikasi mati saat deep work.' },
      { judul: 'Review harian', detail: '10 menit sore: rencanakan besok.' },
    ],
    risiko: [{ risiko: 'Terlalu kaku', pencegahan: 'Sisakan buffer 20% untuk darurat.' }],
    penyelesaian: 'Pekerjaan terkendali. Jika beban memang berlebih, komunikasikan ke atasan dengan data.',
    tags: ['produktivitas', 'waktu'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-kerja-05', slug: 'cara-menghadapi-atasan-sulit', judul: 'Cara Menghadapi Atasan yang Sulit',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 45,
    masalah: 'Atasan mikro-manage / tidak jelas / emosional.',
    penjelasan: 'Ubah yang bisa diubah: komunikasimu.',
    persiapanAlat: ['Catatan insiden', 'Empati'],
    langkah: [
      { judul: 'Pahami polanya', detail: 'Kapan ia sulit? Apa pemicunya?' },
      { judul: 'Proaktif lapor', detail: 'Update sebelum ditanya (untuk mikro-manager).' },
      { judul: 'Minta klarifikasi tertulis', detail: 'Untuk atasan tidak jelas.' },
      { judul: 'Tetap profesional', detail: 'Jangan terbawa emosi; dokumentasikan.' },
    ],
    risiko: [{ risiko: 'Bullying serius', pencegahan: 'Dokumentasikan; lapor HR/serikat jika melewati batas.' }],
    penyelesaian: 'Hubungan membaik atau minimal terkendali. Jika toksik berat, rencanakan keluar.',
    tags: ['atasan', 'konflik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-kerja-06', slug: 'cara-resign-profesional', judul: 'Cara Resign yang Profesional',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Ingin resign tapi takut merusak hubungan.',
    penjelasan: 'Resign baik = pintu tetap terbuka.',
    persiapanAlat: ['Surat resign', 'Rencana handover'],
    langkah: [
      { judul: 'Cek kontrak', detail: 'Notice period (umumnya 30 hari).' },
      { judul: 'Bicara dulu ke atasan', detail: 'Sebelum gosip menyebar.' },
      { judul: 'Surat resmi', detail: 'Singkat, profesional, terima kasih.' },
      { judul: 'Handover rapi', detail: 'Dokumentasikan pekerjaanmu.' },
    ],
    risiko: [{ risiko: 'Ditahan/dipersulit', pencegahan: 'Ikuti prosedur; simpan bukti.' }],
    penyelesaian: 'Keluar dengan baik. Jaga silaturahmi — dunia kerja itu kecil.',
    tags: ['resign', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export function tutorialBySlug(slug: string): Tutorial | undefined {
  return SEMUA_TUTORIAL.find((t) => t.slug === slug);
}

export function tutorialByKategori(kategori: Tutorial['kategori']): Tutorial[] {
  return SEMUA_TUTORIAL.filter((t) => t.kategori === kategori);
}

export const TUTORIAL_BATCH2: Tutorial[] = [
  // ===== ALAT & PERANGKAT (6) =====
  {
    id: 'tut-alat-01', slug: 'cara-membersihkan-laptop', judul: 'Cara Membersihkan Laptop dengan Aman',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Laptop panas, kipas berisik, layar kotor.',
    penjelasan: 'Debu menumpuk menghambat pendinginan.',
    persiapanAlat: ['Kain microfiber', 'Blower/compressed air', 'Obeng (jika berani buka)'],
    langkah: [
      { judul: 'Matikan & cabut', detail: 'Selalu matikan total, bukan sleep.' },
      { judul: 'Layar', detail: 'Kain microfiber sedikit lembap; jangan semprot langsung.' },
      { judul: 'Keyboard', detail: 'Balik, ketuk pelan; blower sela-selanya.' },
      { judul: 'Ventilasi', detail: 'Blower dari luar; jangan putar kipas paksa.' },
    ],
    risiko: [{ risiko: 'Cairan masuk', pencegahan: 'Kain lembap saja, tidak basah.' }],
    penyelesaian: 'Laptop lebih adem. Jika masih panas, pasta thermal mungkin perlu diganti (bawa ke teknisi).',
    tags: ['laptop', 'bersih'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-alat-02', slug: 'cara-mempercepat-hp-android', judul: 'Cara Mempercepat HP Android yang Lemot',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'HP lemot, aplikasi sering force close.',
    penjelasan: 'Penyimpanan penuh dan aplikasi latar belakang adalah penyebab utama.',
    persiapanAlat: ['HP', 'Koneksi WiFi (untuk backup)'],
    langkah: [
      { judul: 'Cek penyimpanan', detail: 'Hapus cache, foto duplikat, aplikasi tak dipakai.' },
      { judul: 'Batasi background', detail: 'Matikan auto-start aplikasi tak penting.' },
      { judul: 'Update sistem', detail: 'Update OS dan aplikasi.' },
      { judul: 'Restart rutin', detail: 'Restart seminggu sekali.' },
    ],
    risiko: [{ risiko: 'Data hilang', pencegahan: 'Backup dulu sebelum factory reset.' }],
    penyelesaian: 'HP lebih responsif. Jika tetap lemot, factory reset sebagai opsi terakhir.',
    tags: ['android', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-alat-03', slug: 'cara-backup-data-hp', judul: 'Cara Backup Data HP',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 40,
    masalah: 'Takut data hilang saat HP rusak/hilang.',
    penjelasan: 'Backup 3-2-1: 3 salinan, 2 media, 1 offsite.',
    persiapanAlat: ['Akun Google', 'WiFi'],
    langkah: [
      { judul: 'Aktifkan backup Google', detail: 'Settings → Google → Backup.' },
      { judul: 'Foto ke cloud', detail: 'Google Photos / galeri cloud.' },
      { judul: 'Chat penting', detail: 'Backup WhatsApp ke Google Drive.' },
      { judul: 'Verifikasi', detail: 'Cek backup benar-benar tersimpan.' },
    ],
    risiko: [{ risiko: 'Lupa password akun', pencegahan: 'Catat dan amankan kredensial.' }],
    penyelesaian: 'Data aman. Tes restore sekali agar yakin.',
    tags: ['backup', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-alat-04', slug: 'cara-memasang-wifi-rumah', judul: 'Cara Memasang dan Mengamankan WiFi Rumah',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'WiFi lemot / takut dibobol tetangga.',
    penjelasan: 'Posisi router dan keamanan dasar menentukan.',
    persiapanAlat: ['Router', 'Kabel LAN', 'HP/laptop'],
    langkah: [
      { judul: 'Posisi tengah', detail: 'Taruh di tengah rumah, agak tinggi.' },
      { judul: 'Ganti password admin', detail: 'Jangan pakai default.' },
      { judul: 'WPA3/WPA2', detail: 'Matikan WPS.' },
      { judul: 'SSID', detail: 'Nama tidak menunjukkan alamat.' },
    ],
    risiko: [{ risiko: 'Lupa password', pencegahan: 'Catat di tempat aman.' }],
    penyelesaian: 'WiFi aman dan optimal. Jika masih lemot, cek interferensi / upgrade paket.',
    tags: ['wifi', 'router'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-alat-05', slug: 'cara-mengganti-layar-hp-pecah', judul: 'Pertolongan Pertama HP Layar Pecah',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Layar HP pecah, takut makin parah.',
    penjelasan: 'Lindungi dulu sebelum ke service.',
    persiapanAlat: ['Tempered glass / lakban bening', 'Plastik'],
    langkah: [
      { judul: 'Amankan pecahan', detail: 'Tempel lakban/tempered glass agar tidak melukai jari.' },
      { judul: 'Backup segera', detail: 'Selagi layar masih bisa disentuh.' },
      { judul: 'Bawa ke service', detail: 'Pilih service resmi/terpercaya; tanya garansi.' },
    ],
    risiko: [{ risiko: 'Servis abal-abal', pencegahan: 'Minta nota; cek review.' }],
    penyelesaian: 'HP aman dibawa. Pasang pelindung setelah diperbaiki.',
    tags: ['hp', 'layar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-alat-06', slug: 'cara-merawat-baterai-hp', judul: 'Cara Merawat Baterai HP agar Awet',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Baterai cepat habis dan drop.',
    penjelasan: 'Panas dan charge penuh terus-menerus mempercepat degradasi.',
    persiapanAlat: ['Charger ori'],
    langkah: [
      { judul: 'Jaga 20-80%', detail: 'Hindari 0% dan 100% terus.' },
      { judul: 'Hindari panas', detail: 'Jangan main game sambil charge di tempat panas.' },
      { judul: 'Charger ori', detail: 'KW merusak sirkuit.' },
      { judul: 'Matikan fitur boros', detail: 'GPS, brightness tinggi saat tak perlu.' },
    ],
    risiko: [{ risiko: 'Baterai kembung', pencegahan: 'Segera ganti jika menggelembung; jangan ditusuk.' }],
    penyelesaian: 'Baterai lebih awet. Ganti baterai di service resmi jika health <80%.',
    tags: ['baterai', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== BELAJAR (6) =====
  {
    id: 'tut-belajar-01', slug: 'cara-belajar-efektif-pomodoro', judul: 'Cara Belajar Efektif dengan Teknik Pomodoro',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Belajar berjam-jam tapi tidak masuk.',
    penjelasan: 'Otak fokus optimal dalam interval pendek.',
    persiapanAlat: ['Timer', 'Catatan target'],
    langkah: [
      { judul: 'Tentukan 1 target', detail: 'Satu sesi = satu topik.' },
      { judul: '25 menit fokus', detail: 'Tanpa HP, tanpa gangguan.' },
      { judul: 'Istirahat 5 menit', detail: 'Bergerak, minum.' },
      { judul: 'Ulangi 4x', detail: 'Lalu istirahat panjang 15-30 menit.' },
    ],
    risiko: [{ risiko: 'Terputus di tengah', pencegahan: 'Siapkan semua sebelum mulai.' }],
    penyelesaian: 'Belajar lebih efektif. Sesuaikan interval (misal 50/10) sesuai kenyamanan.',
    tags: ['pomodoro', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-belajar-02', slug: 'cara-menghafal-cepat', judul: 'Cara Menghafal dengan Cepat dan Tahan Lama',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Hafalan hilang saat ujian.',
    penjelasan: 'Pengulangan berjeda (spaced repetition) mengalahkan begadang.',
    persiapanAlat: ['Kartu/flashcard', 'Jadwal'],
    langkah: [
      { judul: 'Pahami dulu', detail: 'Jangan hafal yang tak dipahami.' },
      { judul: 'Chunking', detail: 'Pecah jadi bagian kecil.' },
      { judul: 'Ulangi berjeda', detail: 'Hari 1, 3, 7, 14.' },
      { judul: 'Uji diri', detail: 'Tutup catatan, tulis ulang.' },
    ],
    risiko: [{ risiko: 'Hafal semalam', pencegahan: 'Mulai H-7 minimal.' }],
    penyelesaian: 'Hafalan menempel. Gunakan aplikasi Anki untuk otomatisasi jadwal.',
    tags: ['hafalan', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-belajar-03', slug: 'cara-menulis-esai', judul: 'Cara Menulis Esai yang Baik',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 90,
    masalah: 'Esai berantakan, nilai jelek.',
    penjelasan: 'Struktur jelas = setengah nilai.',
    persiapanAlat: ['Topik', 'Referensi'],
    langkah: [
      { judul: 'Thesis statement', detail: 'Satu kalimat argumen utama.' },
      { judul: 'Outline', detail: 'Pendahuluan - isi (3 argumen) - kesimpulan.' },
      { judul: 'Tulis draf', detail: 'Jangan edit saat menulis.' },
      { judul: 'Revisi', detail: 'Potong yang tidak mendukung thesis.' },
    ],
    risiko: [{ risiko: 'Plagiarisme', pencegahan: 'Parafrase + sitasi.' }],
    penyelesaian: 'Esai selesai. Minta teman baca untuk sudut pandang baru.',
    tags: ['esai', 'menulis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-belajar-04', slug: 'cara-mengerjakan-soal-cerita-matematika', judul: 'Cara Mengerjakan Soal Cerita Matematika',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 40,
    masalah: 'Bingung mengubah cerita jadi hitungan.',
    penjelasan: 'Soal cerita = terjemahan bahasa ke simbol.',
    persiapanAlat: ['Kertas', 'Pensil'],
    langkah: [
      { judul: 'Baca 2x', detail: 'Tandai yang diketahui dan ditanya.' },
      { judul: 'Gambar/sketsa', detail: 'Visualisasikan.' },
      { judul: 'Tulis model matematika', detail: 'Misalkan x = ...' },
      { judul: 'Hitung & cek', detail: 'Masuk akal? Cek ulang.' },
    ],
    risiko: [{ risiko: 'Salah baca', pencegahan: 'Garis bawahi kata kunci (total, selisih, tiap).' }],
    penyelesaian: 'Soal selesai sistematis. Latihan rutin = kunci.',
    tags: ['matematika', 'soal'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-belajar-05', slug: 'cara-belajar-bahasa-inggris-mandiri', judul: 'Cara Belajar Bahasa Inggris Mandiri',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'Belajar bertahun-tahun tapi tidak bisa bicara.',
    penjelasan: 'Input tanpa output = pasif. Perlu keduanya.',
    persiapanAlat: ['Aplikasi', 'Konten favorit berbahasa Inggris'],
    langkah: [
      { judul: 'Input harian', detail: '15 menit dengar/baca konten menarik.' },
      { judul: 'Catat frasa', detail: 'Bukan kata tunggal, tapi frasa.' },
      { judul: 'Output', detail: 'Bicara/tulis tiap hari, meski salah.' },
      { judul: 'Konsisten 90 hari', detail: 'Sedikit tiap hari > banyak sesekali.' },
    ],
    risiko: [{ risiko: 'Malu salah', pencegahan: 'Salah = belajar; cari partner yang suportif.' }],
    penyelesaian: 'Kemampuan naik bertahap. Ukur dengan tes berkala.',
    tags: ['inggris', 'bahasa'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-belajar-06', slug: 'cara-menghadapi-ujian', judul: 'Cara Menghadapi Ujian Tanpa Panik',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Panik saat ujian, blank padahal sudah belajar.',
    penjelasan: 'Persiapan + strategi mengerjakan mengalahkan panik.',
    persiapanAlat: ['Alat tulis cadangan', 'Jadwal ujian'],
    langkah: [
      { judul: 'H-7: ringkas', detail: 'Buat rangkuman 1 halaman per bab.' },
      { judul: 'H-1: tidur cukup', detail: 'Jangan begadang.' },
      { judul: 'Saat ujian: baca semua dulu', detail: 'Kerjakan yang mudah dulu.' },
      { judul: 'Kelola waktu', detail: 'Alokasikan per soal; jangan macet di satu soal.' },
    ],
    risiko: [{ risiko: 'Blank', pencegahan: 'Tarik napas; tulis apapun yang diingat; kembali nanti.' }],
    penyelesaian: 'Ujian terkendali. Evaluasi setelahnya untuk perbaikan.',
    tags: ['ujian', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_BATCH3: Tutorial[] = [
  // ===== PERBAIKAN & DIY (6) =====
  {
    id: 'tut-baik-01', slug: 'cara-menambal-ban-tubeless', judul: 'Cara Menambal Ban Tubeless Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ban tubeless kena paku di jalan.',
    penjelasan: 'Tambal cacing bisa dilakukan sendiri sebagai pertolongan.',
    persiapanAlat: ['Kit tambal cacing', 'Pompa', 'Tang'],
    langkah: [
      { judul: 'Cabut paku', detail: 'Tandai posisinya.' },
      { judul: 'Kikir lubang', detail: 'Masukkan alat kikir, putar beberapa kali.' },
      { judul: 'Masukkan string', detail: 'String berlem via jarum; tarik hingga sisa 1 cm.' },
      { judul: 'Pompa & cek', detail: 'Cek dengan air sabun.' },
    ],
    risiko: [{ risiko: 'Bocor lagi', pencegahan: 'Ini sementara; ke tukang ban untuk tambal permanen.' }],
    penyelesaian: 'Bisa jalan lagi. Jangan ngebut; segera perbaiki permanen.',
    tags: ['ban', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-baik-02', slug: 'cara-memperbaiki-kran-bocor', judul: 'Cara Memperbaiki Kran Air Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Kran menetes terus, tagihan air naik.',
    penjelasan: 'Umumnya seal/karet washer aus.',
    persiapanAlat: ['Kunci inggris', 'Seal tape', 'Karet washer cadangan'],
    langkah: [
      { judul: 'Tutup air utama', detail: 'Wajib sebelum bongkar.' },
      { judul: 'Buka kran', detail: 'Lepas handle dan drat.' },
      { judul: 'Ganti washer', detail: 'Pasang yang baru; lilit seal tape.' },
      { judul: 'Pasang & tes', detail: 'Buka air perlahan; cek tetesan.' },
    ],
    risiko: [{ risiko: 'Banjir', pencegahan: 'Pastikan air utama tertutup.' }],
    penyelesaian: 'Kran rapat. Jika masih bocor, drat mungkin rusak — ganti kran.',
    tags: ['kran', 'air'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-baik-03', slug: 'cara-mengganti-lampu', judul: 'Cara Mengganti Lampu dengan Aman',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati, takut kesetrum saat ganti.',
    penjelasan: 'Matikan listrik = aman.',
    persiapanAlat: ['Lampu baru (watt & fitting sama)', 'Tangga stabil'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Lebih aman: matikan MCB.' },
      { judul: 'Dinginkan', detail: 'Tunggu lampu lama dingin.' },
      { judul: 'Lepas & pasang', detail: 'Putar berlawanan jarum jam untuk lepas.' },
      { judul: 'Nyalakan', detail: 'Tes.' },
    ],
    risiko: [{ risiko: 'Kesetrum', pencegahan: 'Jangan sentuh fitting logam; tangan kering.' }],
    penyelesaian: 'Lampu menyala. Buang lampu lama (khusus CFL/merkuri) dengan benar.',
    tags: ['lampu', 'listrik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-baik-04', slug: 'cara-menjahit-kancing', judul: 'Cara Menjahit Kancing yang Lepas',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Kancing baju lepas.',
    penjelasan: 'Jahitan dasar yang wajib bisa.',
    persiapanAlat: ['Jarum', 'Benang sewarna', 'Gunting'],
    langkah: [
      { judul: 'Masukkan benang', detail: 'Buat simpul di ujung.' },
      { judul: 'Tandai posisi', detail: 'Sesuai bekas jahitan lama.' },
      { judul: 'Jahit silang', detail: 'Melalui lubang kancing 6-8x; buat tangkai.' },
      { judul: 'Kunci', detail: 'Lilit benang di tangkai; simpul.' },
    ],
    risiko: [{ risiko: 'Tertusuk', pencegahan: 'Gunakan bidal jika ada.' }],
    penyelesaian: 'Kancing kuat. Latihan di kain perca dulu jika baru pertama.',
    tags: ['jahit', 'kancing'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-baik-05', slug: 'cara-mengecat-dinding', judul: 'Cara Mengecat Dinding Sendiri',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 180,
    masalah: 'Dinding kusam, ingin cat ulang hemat.',
    penjelasan: 'Persiapan 70% hasil; pengecatan 30%.',
    persiapanAlat: ['Cat tembok', 'Roller + kuas', 'Lakban kertas', 'Amplas'],
    langkah: [
      { judul: 'Bersihkan & amplas', detail: 'Hilangkan debu dan cat mengelupas.' },
      { judul: 'Tutup area', detail: 'Lakban untuk list, stop kontak.' },
      { judul: 'Cat dasar', detail: 'Sealer jika dinding baru/bermasalah.' },
      { judul: 'Cat 2 lapis', detail: 'Tunggu kering antar lapis (2-4 jam).' },
    ],
    risiko: [{ risiko: 'Belang', pencegahan: 'Aduk rata; cat basah bertemu basah.' }],
    penyelesaian: 'Dinding baru. Bersihkan alat segera setelah selesai.',
    tags: ['cat', 'dinding'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-baik-06', slug: 'cara-memperbaiki-resleting', judul: 'Cara Memperbaiki Resleting Macet/Rusak',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Resleting macet atau terbuka sendiri.',
    penjelasan: 'Umumnya slider longgar atau gigi kotor.',
    persiapanAlat: ['Lilin/sabun', 'Tang kecil'],
    langkah: [
      { judul: 'Macet: lumasi', detail: 'Gosok lilin/sabun di gigi.' },
      { judul: 'Terbuka: jepit slider', detail: 'Jepit pelan sisi slider dengan tang.' },
      { judul: 'Tes', detail: 'Tarik naik-turun beberapa kali.' },
    ],
    risiko: [{ risiko: 'Patah', pencegahan: 'Jangan paksa; jepit sedikit-sedikit.' }],
    penyelesaian: 'Resleting lancar. Jika gigi hilang, bawa ke tukang jahit.',
    tags: ['resleting', 'jahit'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== MENTAL & PIKIRAN (6) =====
  {
    id: 'tut-mental-01', slug: 'cara-mengatasi-cemas', judul: 'Cara Mengatasi Rasa Cemas',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Cemas berlebihan mengganggu aktivitas.',
    penjelasan: 'Cemas = alarm palsu otak; bisa dilatih.',
    persiapanAlat: ['Tempat tenang', 'Jurnal (opsional)'],
    langkah: [
      { judul: 'Napas 4-7-8', detail: 'Tarik 4 detik, tahan 7, hembus 8.' },
      { judul: 'Grounding 5-4-3-2-1', detail: 'Sebut 5 yang dilihat, 4 didengar, dst.' },
      { judul: 'Tulis kekhawatiran', detail: 'Pisahkan yang bisa dikontrol.' },
      { judul: 'Aksi kecil', detail: 'Kerjakan satu hal kecil yang bisa dikontrol.' },
    ],
    risiko: [{ risiko: 'Cemas berat berkepanjangan', pencegahan: 'Cari psikolog/psikiater; hubungi 119 ext 8 jika krisis.' }],
    penyelesaian: 'Cemas mereda. Jika sering kambuh, pertimbangkan konseling profesional.',
    tags: ['cemas', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-mental-02', slug: 'cara-tidur-cepat-insomnia', judul: 'Cara Mengatasi Susah Tidur (Insomnia Ringan)',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Sulit tidur meski lelah.',
    penjelasan: 'Sleep hygiene: kebiasaan sebelum tidur menentukan.',
    persiapanAlat: ['Kamar gelap & sejuk'],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Bangun sama tiap hari, termasuk weekend.' },
      { judul: 'No layar 1 jam', detail: 'Ganti dengan baca/mandi hangat.' },
      { judul: 'Batasi kafein', detail: 'Stop setelah jam 2 siang.' },
      { judul: 'Jika tak tidur 20 menit', detail: 'Bangun, lakukan hal membosankan, kembali.' },
    ],
    risiko: [{ risiko: 'Insomnia kronis', pencegahan: 'Ke dokter jika >3 minggu.' }],
    penyelesaian: 'Tidur membaik bertahap. Konsisten 2 minggu untuk hasil.',
    tags: ['tidur', 'insomnia'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-mental-03', slug: 'cara-mengelola-marah', judul: 'Cara Mengelola Emosi Marah',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Mudah meledak, menyesal setelahnya.',
    penjelasan: 'Marah punya jeda 6 detik sebelum meledak — manfaatkan.',
    persiapanAlat: ['Kesadaran diri'],
    langkah: [
      { judul: 'Jeda', detail: 'Tarik napas; hitung sampai 10.' },
      { judul: 'Jauhi pemicu', detail: 'Keluar ruangan jika perlu.' },
      { judul: 'Namai emosi', detail: '"Saya frustrasi karena..." bukan "dia brengsek".' },
      { judul: 'Sampaikan dengan "aku"', detail: '"Aku merasa... saat..." bukan tuduhan.' },
    ],
    risiko: [{ risiko: 'Kekerasan', pencegahan: 'Jika tak terkendali, cari bantuan profesional.' }],
    penyelesaian: 'Konflik terselesaikan lebih sehat. Latihan = kemajuan.',
    tags: ['marah', 'emosi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-mental-04', slug: 'cara-membangun-kepercayaan-diri', judul: 'Cara Membangun Kepercayaan Diri',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 40,
    masalah: 'Tidak percaya diri bicara/bertindak.',
    penjelasan: 'PD dibangun dari bukti kecil, bukan motivasi.',
    persiapanAlat: ['Jurnal'],
    langkah: [
      { judul: 'Tantangan mikro', detail: 'Lakukan 1 hal sedikit di luar nyaman tiap hari.' },
      { judul: 'Catat kemenangan', detail: 'Tulis 3 hal berhasil tiap malam.' },
      { judul: 'Postur', detail: 'Tegak, kontak mata — tubuh memengaruhi pikiran.' },
      { judul: 'Siapkan kompetensi', detail: 'PD = persiapan + pengalaman.' },
    ],
    risiko: [{ risiko: 'Self-talk negatif', pencegahan: 'Tantang pikiran: "buktinya apa?"' }],
    penyelesaian: 'PD tumbuh bertahap. Rayakan progres kecil.',
    tags: ['pd', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-mental-05', slug: 'cara-mengatasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Pikiran muter terus, tidak bisa berhenti.',
    penjelasan: 'Overthinking = mencoba memecahkan yang tak bisa dikontrol.',
    persiapanAlat: ['Kertas', 'Timer'],
    langkah: [
      { judul: 'Worry time', detail: 'Jadwalkan 15 menit khusus khawatir; di luar itu tunda.' },
      { judul: 'Tulis & kategorikan', detail: 'Bisa dikontrol / tidak. Fokus ke yang bisa.' },
      { judul: 'Aksi terkecil', detail: 'Satu langkah nyata mengalahkan 1 jam mikir.' },
      { judul: 'Gerak', detail: 'Jalan 10 menit memutus loop.' },
    ],
    risiko: [{ risiko: 'Mengganggu fungsi harian', pencegahan: 'Pertimbangkan terapi jika parah.' }],
    penyelesaian: 'Pikiran lebih tenang. Praktik rutin = otot mental.',
    tags: ['overthinking', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-mental-06', slug: 'cara-memaafkan-dan-move-on', judul: 'Cara Memaafkan dan Move On',
    kategori: 'mental', tingkat: 'menengah', estimasiMenit: 60,
    masalah: 'Sakit hati berkepanjangan, sulit melupakan.',
    penjelasan: 'Memaafkan = melepaskan bebanmu, bukan membenarkan mereka.',
    persiapanAlat: ['Jurnal', 'Waktu tenang'],
    langkah: [
      { judul: 'Akui rasa', detail: 'Tulis apa yang terjadi dan rasanya.' },
      { judul: 'Pisahkan orang & luka', detail: 'Pahami tanpa harus setuju.' },
      { judul: 'Putuskan melepas', detail: 'Keputusan sadar, bukan perasaan.' },
      { judul: 'Bangun batas', detail: 'Maaf ≠ harus dekat lagi.' },
    ],
    risiko: [{ risiko: 'Trauma berat', pencegahan: 'Terapi profesional untuk luka dalam.' }],
    penyelesaian: 'Hati lebih ringan. Proses, bukan sekali jadi.',
    tags: ['maaf', 'move-on'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_BATCH4: Tutorial[] = [
  // ===== KEUANGAN (6) =====
  {
    id: 'tut-uang-01', slug: 'cara-membuat-dana-darurat', judul: 'Cara Membangun Dana Darurat',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'Setiap ada darurat, terpaksa berutang.',
    penjelasan: 'Dana darurat = bantalan sebelum investasi.',
    persiapanAlat: ['Rekening terpisah', 'Catatan pengeluaran'],
    langkah: [
      { judul: 'Hitung target', detail: '3-6x pengeluaran bulanan.' },
      { judul: 'Mulai kecil', detail: 'Target pertama Rp1 juta.' },
      { judul: 'Auto-debit', detail: 'Pisahkan di tanggal gajian.' },
      { judul: 'Jangan diutak-atik', detail: 'Hanya untuk darurat nyata.' },
    ],
    risiko: [{ risiko: 'Terpakai untuk non-darurat', pencegahan: 'Rekening terpisah tanpa kartu ATM.' }],
    penyelesaian: 'Dana terbangun bertahap. Setelah target, alihkan ke investasi.',
    tags: ['dana-darurat', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-uang-02', slug: 'cara-melunasi-utang', judul: 'Cara Melunasi Utang dengan Metode Snowball',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 60,
    masalah: 'Utang banyak, bingung mulai dari mana.',
    penjelasan: 'Snowball: lunasi terkecil dulu untuk momentum.',
    persiapanAlat: ['Daftar semua utang', 'Kalkulator'],
    langkah: [
      { judul: 'Daftar semua', detail: 'Nominal, bunga, cicilan minimum.' },
      { judul: 'Urut terkecil', detail: 'Bayar minimum semua; ekstra ke terkecil.' },
      { judul: 'Gulung', detail: 'Setelah lunas, alihkan cicilannya ke utang berikutnya.' },
      { judul: 'Stop tambah utang', detail: 'Potong kartu/gali lubang.' },
    ],
    risiko: [{ risiko: 'Gagal di tengah', pencegahan: 'Otomatiskan pembayaran.' }],
    penyelesaian: 'Utang lunas satu per satu. Rayakan tiap pelunasan.',
    tags: ['utang', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-uang-03', slug: 'cara-mulai-investasi-reksadana', judul: 'Cara Mulai Investasi Reksa Dana',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 60,
    masalah: 'Ingin investasi tapi takut dan bingung.',
    penjelasan: 'Reksa dana = dikelola manajer investasi; cocok pemula.',
    persiapanAlat: ['KTP', 'Rekening bank', 'Aplikasi APERD resmi'],
    langkah: [
      { judul: 'Tentukan tujuan & jangka', detail: 'Jangka pendek = pasar uang; panjang = saham.' },
      { judul: 'Pilih APERD resmi', detail: 'Terdaftar OJK.' },
      { judul: 'Mulai kecil', detail: 'Rp10-100 ribu untuk belajar.' },
      { judul: 'Rutin', detail: 'Dollar cost averaging tiap bulan.' },
    ],
    risiko: [{ risiko: 'Bodong', pencegahan: 'Cek OJK; janji return pasti = penipuan.' }],
    penyelesaian: 'Investasi berjalan. Evaluasi tahunan; jangan panik saat turun.',
    tags: ['investasi', 'reksadana'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-uang-04', slug: 'cara-mengenali-pinjol-ilegal', judul: 'Cara Mengenali dan Menghindari Pinjol Ilegal',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tawaran pinjaman mudah via WA/SMS.',
    penjelasan: 'Pinjol ilegal = bunga mencekik + teror data.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Cek OJK', detail: 'Pastikan terdaftar di OJK.' },
      { judul: 'Waspadai ciri', detail: 'Tanpa izin akses berlebihan, bunga tak jelas, teror.' },
      { judul: 'Jangan klik link', detail: 'Unduh hanya dari Play Store resmi.' },
      { judul: 'Lapor', detail: 'Ke OJK/Satgas PASTI jika jadi korban.' },
    ],
    risiko: [{ risiko: 'Data disebar', pencegahan: 'Jangan beri akses kontak/galeri ke aplikasi pinjaman.' }],
    penyelesaian: 'Aman dari jerat. Edukasi keluarga juga.',
    tags: ['pinjol', 'waspada'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-uang-05', slug: 'cara-menabung-untuk-nikah', judul: 'Cara Menabung untuk Biaya Nikah',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'Ingin nikah tapi biaya besar.',
    penjelasan: 'Nikah sederhana yang direncanakan > mewah berutang.',
    persiapanAlat: ['Kesepakatan pasangan', 'Rincian biaya'],
    langkah: [
      { judul: 'Sepakati konsep', detail: 'Sederhana vs besar; libatkan keluarga.' },
      { judul: 'Rinci biaya', detail: 'Gedung, catering, dokumentasi, dll.' },
      { judul: 'Tentukan timeline', detail: 'Hitung tabungan/bulan yang dibutuhkan.' },
      { judul: 'Prioritaskan', detail: 'Potong yang tidak esensial.' },
    ],
    risiko: [{ risiko: 'Gengsi', pencegahan: 'Ingat: yang penting sah dan berkah, bukan mewah.' }],
    penyelesaian: 'Dana terkumpul sesuai rencana. Hindari utang konsumtif untuk pesta.',
    tags: ['nikah', 'tabungan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-uang-06', slug: 'cara-membaca-slip-gaji', judul: 'Cara Membaca Slip Gaji dan Potongannya',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gaji tidak sesuai ekspektasi, bingung potongannya.',
    penjelasan: 'Pahami komponen: bruto, potongan, neto.',
    persiapanAlat: ['Slip gaji'],
    langkah: [
      { judul: 'Identifikasi bruto', detail: 'Gaji pokok + tunjangan.' },
      { judul: 'Cek potongan', detail: 'PPh 21, BPJS, pinjaman.' },
      { judul: 'Verifikasi', detail: 'Cocokkan dengan kontrak.' },
      { judul: 'Tanya HRD', detail: 'Jika ada yang janggal.' },
    ],
    risiko: [{ risiko: 'Potongan salah', pencegahan: 'Simpan slip tiap bulan.' }],
    penyelesaian: 'Paham alur gajimu. Gunakan untuk perencanaan keuangan.',
    tags: ['gaji', 'slip'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== KESEHATAN (6) =====
  {
    id: 'tut-sehat-01', slug: 'cara-pertolongan-pertama-luka', judul: 'Pertolongan Pertama Luka Ringan',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Luka berdarah, panik tidak tahu harus apa.',
    penjelasan: 'Tekan, bersihkan, tutup — urutan dasar.',
    persiapanAlat: ['Kasa/plester', 'Antiseptik', 'Air bersih'],
    langkah: [
      { judul: 'Tekan', detail: 'Tekan dengan kain bersih 5-10 menit.' },
      { judul: 'Bersihkan', detail: 'Bilas air mengalir; jangan tiup.' },
      { judul: 'Antiseptik', detail: 'Oles tipis di sekitar (bukan dalam luka dalam).' },
      { judul: 'Tutup', detail: 'Plester/kasa; ganti tiap hari.' },
    ],
    risiko: [{ risiko: 'Infeksi', pencegahan: 'Ke faskes jika merah, bengkak, bernanah, atau dalam.' }],
    penyelesaian: 'Luka tertangani. Pantau 2-3 hari.',
    tags: ['p3k', 'luka'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-sehat-02', slug: 'cara-menangani-demam-anak', judul: 'Cara Menangani Demam pada Anak',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Anak demam, orang tua panik.',
    penjelasan: 'Demam = respons imun; yang penting pantau tanda bahaya.',
    persiapanAlat: ['Termometer', 'Paracetamol anak', 'Air'],
    langkah: [
      { judul: 'Ukur suhu', detail: 'Demam jika ≥38°C.' },
      { judul: 'Kompres hangat', detail: 'Bukan dingin/es.' },
      { judul: 'Cairan cukup', detail: 'ASI/air lebih sering.' },
      { judul: 'Obat jika perlu', detail: 'Paracetamol sesuai dosis berat badan.' },
    ],
    risiko: [
      { risiko: 'Kejang demam', pencegahan: 'Tetap tenang; miringkan; jangan masukkan apapun ke mulut.' },
      { risiko: 'Tanda bahaya', pencegahan: 'Segera ke RS: sesak, dehidrasi, ruam, lemas, demam >3 hari.' },
    ],
    penyelesaian: 'Anak terpantau. Jangan beri aspirin pada anak.',
    tags: ['demam', 'anak'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-sehat-03', slug: 'cara-mulai-olahraga-pemula', judul: 'Cara Mulai Olahraga untuk Pemula',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Ingin olahraga tapi tidak tahu mulai dari mana.',
    penjelasan: 'Mulai ringan + konsisten > berat tapi kapok.',
    persiapanAlat: ['Sepatu nyaman', 'Air minum'],
    langkah: [
      { judul: 'Pilih yang disuka', detail: 'Jalan, sepeda, renang — yang penting mau.' },
      { judul: 'Mulai 15 menit', detail: '3x seminggu.' },
      { judul: 'Pemanasan & pendinginan', detail: '5 menit tiap sisi.' },
      { judul: 'Naikkan bertahap', detail: '+10% per minggu.' },
    ],
    risiko: [{ risiko: 'Cedera', pencegahan: 'Dengarkan tubuh; istirahat jika nyeri tajam.' }],
    penyelesaian: 'Rutinitas terbentuk. Konsultasi dokter jika punya kondisi khusus.',
    tags: ['olahraga', 'pemula'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-sehat-04', slug: 'cara-mengatasi-maag-kambuh', judul: 'Cara Mengatasi Maag Kambuh',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Perut perih/mual saat telat makan.',
    penjelasan: 'Asam lambung naik; pola makan adalah kunci.',
    persiapanAlat: ['Antasida (jika ada)', 'Air hangat'],
    langkah: [
      { judul: 'Makan sedikit', detail: 'Bubur/roti; jangan kosong.' },
      { judul: 'Hindari pemicu', detail: 'Pedas, asam, kopi, soda saat kambuh.' },
      { judul: 'Jangan rebahan', detail: 'Duduk tegak 2-3 jam setelah makan.' },
      { judul: 'Kelola stres', detail: 'Stres memperparah.' },
    ],
    risiko: [{ risiko: 'Muntah darah / BAB hitam', pencegahan: 'Segera ke dokter — tanda bahaya.' }],
    penyelesaian: 'Gejala mereda. Jika sering kambuh, periksa ke dokter.',
    tags: ['maag', 'lambung'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-sehat-05', slug: 'cara-menjaga-kesehatan-mata', judul: 'Cara Menjaga Kesehatan Mata di Era Layar',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mata lelah, kering, buram setelah lama menatap layar.',
    penjelasan: 'Aturan 20-20-20 + ergonomi.',
    persiapanAlat: ['-'],
    langkah: [
      { judul: '20-20-20', detail: 'Tiap 20 menit, lihat 20 kaki (6m) selama 20 detik.' },
      { judul: 'Kedip sadar', detail: 'Berkedip penuh tiap beberapa menit.' },
      { judul: 'Jarak & cahaya', detail: 'Layar 50-70 cm; cahaya ruangan cukup.' },
      { judul: 'Batasi sebelum tidur', detail: 'Kurangi 1 jam sebelum tidur.' },
    ],
    risiko: [{ risiko: 'Gangguan menetap', pencegahan: 'Periksa mata tahunan; kacamata sesuai resep.' }],
    penyelesaian: 'Mata lebih nyaman. Jika buram menetap, ke dokter mata.',
    tags: ['mata', 'layar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-sehat-06', slug: 'cara-berhenti-merokok', judul: 'Cara Berhenti Merokok',
    kategori: 'kesehatan', tingkat: 'menengah', estimasiMenit: 60,
    masalah: 'Ingin berhenti merokok tapi selalu gagal.',
    penjelasan: 'Kecanduan fisik + kebiasaan; butuh rencana.',
    persiapanAlat: ['Niat tertulis', 'Dukungan orang terdekat'],
    langkah: [
      { judul: 'Tentukan tanggal', detail: '2-4 minggu ke depan; umumkan.' },
      { judul: 'Identifikasi pemicu', detail: 'Kopi, stres, nongkrong — siapkan pengganti.' },
      { judul: 'Buang semua', detail: 'Rokok, asbak, korek di hari-H.' },
      { judul: 'Hadapi sakau', detail: 'Puncak 3 hari; alihkan dengan jalan/air.' },
    ],
    risiko: [{ risiko: 'Kamubu', pencegahan: 'Satu batang = kembali; minta bantuan jika perlu (layanan berhenti merokok Kemenkes).' }],
    penyelesaian: 'Bebas rokok selangkah demi selangkah. Gagal = coba lagi, bukan menyerah.',
    tags: ['rokok', 'berhenti'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== TEKNOLOGI (6) =====
  {
    id: 'tut-tekno-01', slug: 'cara-membuat-password-kuat', judul: 'Cara Membuat Password yang Kuat',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Akun diretas karena password lemah/sama semua.',
    penjelasan: 'Panjang > kompleksitas; unik per akun.',
    persiapanAlat: ['Password manager (misal Bitwarden)'],
    langkah: [
      { judul: 'Pakai frasa', detail: '4+ kata acak: "kuda-terbang-makan-soto".' },
      { judul: 'Unik per akun', detail: 'Jangan pakai ulang.' },
      { judul: 'Password manager', detail: 'Simpan semua di sana; ingat 1 master.' },
      { judul: 'Aktifkan 2FA', detail: 'Untuk email, bank, sosmed.' },
    ],
    risiko: [{ risiko: 'Lupa master password', pencegahan: 'Tulis di kertas, simpan di brankas.' }],
    penyelesaian: 'Akun aman. Ganti password yang bocor (cek di haveibeenpwned).',
    tags: ['password', 'keamanan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-tekno-02', slug: 'cara-mengenali-phishing', judul: 'Cara Mengenali Email/WA Phishing',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Banyak pesan mencurigakan mengatasnamakan bank/kurir.',
    penjelasan: 'Phishing = memancing data; kenali polanya.',
    persiapanAlat: ['Kewaspadaan'],
    langkah: [
      { judul: 'Cek pengirim', detail: 'Domain aneh = curiga.' },
      { judul: 'Jangan klik buru-buru', detail: 'Ancaman "akun diblokir" = taktik.' },
      { judul: 'Verifikasi jalur resmi', detail: 'Hubungi bank via nomor resmi, bukan dari pesan.' },
      { judul: 'Jangan beri OTP', detail: 'Pihak resmi TIDAK PERNAH minta OTP.' },
    ],
    risiko: [{ risiko: 'Sudah klik/isi', pencegahan: 'Segera ganti password; hubungi bank; lapor.' }],
    penyelesaian: 'Terhindar dari jebakan. Edukasi orang tua — target utama.',
    tags: ['phishing', 'keamanan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-tekno-03', slug: 'cara-video-call-zoom', judul: 'Cara Menggunakan Zoom untuk Rapat',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Bingung ikut rapat online.',
    penjelasan: 'Dasar-dasar cukup untuk 90% kebutuhan.',
    persiapanAlat: ['HP/laptop', 'Koneksi stabil', 'Tempat tenang'],
    langkah: [
      { judul: 'Install & tes', detail: 'Tes audio/video sebelum rapat.' },
      { judul: 'Join via link', detail: 'Masukkan nama yang jelas.' },
      { judul: 'Mute/unmute', detail: 'Mute saat tidak bicara.' },
      { judul: 'Share screen', detail: 'Tutup tab pribadi dulu.' },
    ],
    risiko: [{ risiko: 'Gangguan privasi', pencegahan: 'Pakai virtual background; kunci rapat jika host.' }],
    penyelesaian: 'Rapat lancar. Latihan sekali = percaya diri.',
    tags: ['zoom', 'rapat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-tekno-04', slug: 'cara-scan-dokumen-hp', judul: 'Cara Scan Dokumen dengan HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Butuh scan KTP/dokumen tapi tidak ada scanner.',
    penjelasan: 'Kamera HP + aplikasi = hasil setara scanner.',
    persiapanAlat: ['HP', 'Aplikasi scan (misal bawaan Files/Google Drive)'],
    langkah: [
      { judul: 'Taruh di permukaan rata', detail: 'Cahaya cukup, tidak berbayang.' },
      { judul: 'Foto tegak lurus', detail: 'Sejajar dokumen.' },
      { judul: 'Crop & filter', detail: 'Potong tepi; mode dokumen/BW.' },
      { judul: 'Simpan PDF', detail: 'Beri nama jelas.' },
    ],
    risiko: [{ risiko: 'Dokumen sensitif', pencegahan: 'Jangan upload ke layanan tak dikenal.' }],
    penyelesaian: 'Dokumen digital rapi. Simpan backup.',
    tags: ['scan', 'dokumen'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-tekno-05', slug: 'cara-mengatasi-wifi-lemot', judul: 'Cara Mengatasi WiFi Lemot',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'WiFi lambat padahal paket besar.',
    penjelasan: 'Diagnosis bertahap: perangkat, router, ISP.',
    persiapanAlat: ['HP/laptop'],
    langkah: [
      { judul: 'Tes kecepatan', detail: 'Speedtest dekat router vs jauh.' },
      { judul: 'Restart router', detail: 'Cabut 30 detik.' },
      { judul: 'Cek pengguna', detail: 'Terlalu banyak perangkat?' },
      { judul: 'Ganti channel', detail: 'Di admin router, pilih channel sepi.' },
    ],
    risiko: [{ risiko: 'Tetap lemot', pencegahan: 'Hubungi ISP; minta teknisi.' }],
    penyelesaian: 'Kecepatan pulih. Jika sering, pertimbangkan router baru/upgrade.',
    tags: ['wifi', 'internet'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-tekno-06', slug: 'cara-backup-chat-whatsapp', judul: 'Cara Backup Chat WhatsApp',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Takut chat penting hilang saat ganti HP.',
    penjelasan: 'Backup otomatis ke cloud.',
    persiapanAlat: ['Akun Google', 'WiFi'],
    langkah: [
      { judul: 'Buka Pengaturan', detail: 'WhatsApp → Settings → Chats → Chat backup.' },
      { judul: 'Pilih akun Google', detail: 'Dan frekuensi (harian).' },
      { judul: 'Backup sekarang', detail: 'Tunggu selesai di WiFi.' },
      { judul: 'Restore', detail: 'Di HP baru, login nomor sama → restore.' },
    ],
    risiko: [{ risiko: 'Backup tidak enkripsi E2E default', pencegahan: 'Aktifkan backup terenkripsi end-to-end.' }],
    penyelesaian: 'Chat aman. Cek backup berjalan rutin.',
    tags: ['whatsapp', 'backup'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },

  // ===== UMKM & USAHA (6) =====
  {
    id: 'tut-umkm-01', slug: 'cara-mulai-jualan-online', judul: 'Cara Mulai Jualan Online dari Nol',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 90,
    masalah: 'Ingin jualan online tapi bingung mulai.',
    penjelasan: 'Mulai dari 1 produk, 1 platform.',
    persiapanAlat: ['Produk', 'HP kamera', 'Rekening'],
    langkah: [
      { judul: 'Pilih 1 produk', detail: 'Yang kamu paham/kuasai.' },
      { judul: 'Foto menarik', detail: 'Cahaya alami, background bersih.' },
      { judul: 'Buka 1 marketplace', detail: 'Lengkapi profil toko.' },
      { judul: 'Tentukan harga', detail: 'Modal + margin + ongkir.' },
      { judul: 'Promosi awal', detail: 'Ke lingkaran terdekat dulu.' },
    ],
    risiko: [{ risiko: 'Stok menumpuk', pencegahan: 'Mulai dengan sistem PO/dropship.' }],
    penyelesaian: 'Toko online jalan. Fokus ke repeat order & review.',
    tags: ['jualan', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-umkm-02', slug: 'cara-membuat-nib-umkm', judul: 'Cara Membuat NIB untuk UMKM',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'Usaha ingin resmi tapi bingung izin.',
    penjelasan: 'NIB via OSS = identitas resmi usaha, gratis.',
    persiapanAlat: ['KTP', 'NPWP (jika ada)', 'Email & HP'],
    langkah: [
      { judul: 'Buka oss.go.id', detail: 'Daftar akun.' },
      { judul: 'Isi data usaha', detail: 'Nama, alamat, KBLI yang sesuai.' },
      { judul: 'Terbitkan NIB', detail: 'Unduh dan simpan.' },
      { judul: 'Lengkapi komitmen', detail: 'Jika KBLI-nya mensyaratkan.' },
    ],
    risiko: [{ risiko: 'KBLI salah', pencegahan: 'Cari yang paling sesuai; konsultasi DPMPTSP jika ragu.' }],
    penyelesaian: 'Usaha berizin. NIB membuka akses pembiayaan & marketplace resmi.',
    tags: ['nib', 'izin'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-umkm-03', slug: 'cara-menghitung-hpp', judul: 'Cara Menghitung HPP Produk',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 60,
    masalah: 'Jualan laris tapi tidak tahu untung/rugi.',
    penjelasan: 'HPP = fondasi harga jual.',
    persiapanAlat: ['Kalkulator', 'Catatan biaya'],
    langkah: [
      { judul: 'Biaya bahan', detail: 'Per unit produk.' },
      { judul: 'Biaya tenaga', detail: 'Upah per unit.' },
      { judul: 'Biaya overhead', detail: 'Listrik, sewa, dibagi jumlah produksi.' },
      { judul: 'Total = HPP', detail: 'Harga jual = HPP + margin (30-100%).' },
    ],
    risiko: [{ risiko: 'Lupa biaya tersembunyi', pencegahan: 'Catat kemasan, ongkir, fee marketplace.' }],
    penyelesaian: 'Harga berbasis data. Review HPP tiap ada kenaikan bahan.',
    tags: ['hpp', 'harga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-umkm-04', slug: 'cara-promosi-di-medsos', judul: 'Cara Promosi Efektif di Media Sosial',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 60,
    masalah: 'Posting tiap hari tapi tidak ada yang beli.',
    penjelasan: 'Konten jualan terus = di-skip; campur edukasi & hiburan.',
    persiapanAlat: ['HP', 'Akun bisnis'],
    langkah: [
      { judul: 'Kenali audiens', detail: 'Siapa pembelimu? Di mana mereka?' },
      { judul: 'Rumus 4-1', detail: '4 konten nilai/hiburan : 1 jualan.' },
      { judul: 'Konsisten', detail: 'Jadwal rutin, misal 3x seminggu.' },
      { judul: 'Interaksi', detail: 'Balas komen/DM cepat.' },
    ],
    risiko: [{ risiko: 'Akun diblokir', pencegahan: 'Jangan spam; ikuti aturan platform.' }],
    penyelesaian: 'Engagement naik. Ukur: mana konten yang menghasilkan chat/order.',
    tags: ['promosi', 'medsos'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-umkm-05', slug: 'cara-mencatat-keuangan-umkm', judul: 'Cara Mencatat Keuangan UMKM Sederhana',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 40,
    masalah: 'Uang usaha campur dengan uang pribadi.',
    penjelasan: 'Pisahkan dulu, catat kemudian — dua langkah wajib.',
    persiapanAlat: ['Rekening/dompet terpisah', 'Buku/aplikasi kas'],
    langkah: [
      { judul: 'Pisahkan', detail: 'Rekening khusus usaha.' },
      { judul: 'Catat harian', detail: 'Masuk & keluar, tiap hari.' },
      { judul: 'Rekap mingguan', detail: 'Untung/rugi minggu ini?' },
      { judul: 'Gaji diri sendiri', detail: 'Ambil gaji tetap, bukan seenaknya.' },
    ],
    risiko: [{ risiko: 'Malas mencatat', pencegahan: 'Cukup 5 menit tiap malam.' }],
    penyelesaian: 'Keuangan terpantau. Data ini modal untuk pinjaman/pengembangan.',
    tags: ['keuangan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
  {
    id: 'tut-umkm-06', slug: 'cara-menghadapi-komplain-pelanggan', judul: 'Cara Menghadapi Komplain Pelanggan',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Dapat komplain/ulasan buruk, emosi terpancing.',
    penjelasan: 'Komplain = kesempatan; respons menentukan reputasi.',
    persiapanAlat: ['SOP komplain sederhana'],
    langkah: [
      { judul: 'Dengarkan penuh', detail: 'Jangan potong; catat masalahnya.' },
      { judul: 'Minta maaf tulus', detail: 'Untuk pengalamannya, bukan selalu mengaku salah.' },
      { judul: 'Tawarkan solusi', detail: 'Ganti, refund, atau voucher — cepat.' },
      { judul: 'Follow up', detail: 'Pastikan puas setelahnya.' },
    ],
    risiko: [{ risiko: 'Viral negatif', pencegahan: 'Respons cepat & profesional; jangan berdebat publik.' }],
    penyelesaian: 'Pelanggan puas; kadang jadi lebih loyal. Jadikan bahan perbaikan.',
    tags: ['komplain', 'pelanggan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

// Gabungan semua tutorial untuk konsumsi aplikasi
export const TUTORIAL_TAMBAHAN_1: Tutorial[] = [
  {
    id: 'tut-teknologi-07', slug: 'cara-mengatasi-hp-android-lemot', judul: 'Cara Mengatasi HP Android yang Lemot',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'HP Android makin lambat: aplikasi lama dibuka, sering macet.',
    penjelasan: 'Lemot biasanya karena penyimpanan penuh, cache menumpuk, atau aplikasi berjalan di latar.',
    persiapanAlat: ['HP Android', 'Koneksi internet (untuk update)'],
    langkah: [
      { judul: 'Cek penyimpanan', detail: 'Pengaturan > Penyimpanan. Jika >85% penuh, hapus file/foto/video yang tidak perlu atau pindahkan ke cloud.' },
      { judul: 'Hapus cache', detail: 'Pengaturan > Aplikasi > pilih aplikasi besar > Hapus cache. Jangan hapus data kecuali siap login ulang.' },
      { judul: 'Hapus aplikasi tak dipakai', detail: 'Uninstall aplikasi yang jarang dibuka; nonaktifkan bloatware bawaan bila bisa.' },
      { judul: 'Batasi latar belakang', detail: 'Pengaturan > Baterai > batasi aktivitas latar untuk aplikasi boros.' },
      { judul: 'Update sistem', detail: 'Pengaturan > Pembaruan perangkat lunak > unduh dan pasang versi terbaru.' },
      { judul: 'Restart', detail: 'Restart HP setelah bersih-bersih agar RAM segar.' },
    ],
    risiko: [{ risiko: 'Data hilang', pencegahan: 'Backup foto/kontak dulu; jangan hapus data aplikasi penting.' }],
    penyelesaian: 'HP lebih responsif. Jika tetap lemot parah setelah semua langkah, pertimbangkan reset pabrik (backup dulu) atau cek ke service center.',
    tags: ['android', 'hp lemot', 'performa'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_2: Tutorial[] = [
  {
    id: 'tut-keuangan-07', slug: 'cara-membuat-budget-bulanan', judul: 'Cara Membuat Budget Bulanan Anti Bokek',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Gaji habis sebelum akhir bulan, tidak tahu uang lari ke mana.',
    penjelasan: 'Budget 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan. Catat semua pengeluaran 1 bulan dulu.',
    persiapanAlat: ['Kertas/aplikasi catatan', 'Data gaji & pengeluaran'],
    langkah: [
      { judul: 'Catat pemasukan', detail: 'Tulis semua sumber pemasukan bersih per bulan.' },
      { judul: 'Kelompokkan pengeluaran', detail: 'Bagi ke kebutuhan (makan, transport, kos), keinginan (jajan, hiburan), tabungan.' },
      { judul: 'Terapkan 50/30/20', detail: 'Alokasikan sesuai rumus; sesuaikan bila kos mahal (kebutuhan bisa 60%).' },
      { judul: 'Siapkan dana darurat', detail: 'Target 3x pengeluaran bulanan, simpan terpisah.' },
      { judul: 'Evaluasi mingguan', detail: 'Cek tiap minggu; geser pos yang jebol ke bulan depan.' },
    ],
    risiko: [{ risiko: 'Gagal konsisten', pencegahan: 'Mulai dari 1 kategori dulu (mis. jajan), jangan langsung ketat semua.' }],
    penyelesaian: 'Arus kas terkendali dan ada tabungan. Jika masih minus, cari pos keinginan terbesar untuk dipangkas.',
    tags: ['budget', 'keuangan', 'hemat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_3: Tutorial[] = [
  {
    id: 'tut-kesehatan-07', slug: 'cara-tidur-nyenyak', judul: 'Cara Tidur Nyenyak Tanpa Begadang',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Susah tidur, main HP sampai larut, bangun lemas.',
    penjelasan: 'Kualitas tidur ditentukan rutinitas, bukan durasi saja. Atur jam tidur konsisten dan kurangi layar 1 jam sebelum tidur.',
    persiapanAlat: ['Kamar gelap & sejuk', 'Alarm'],
    langkah: [
      { judul: 'Tetapkan jam tidur', detail: 'Pilih jam yang sama tiap malam, mis. 22.30. Konsisten termasuk akhir pekan.' },
      { judul: 'Matikan layar 1 jam sebelumnya', detail: 'Ganti dengan baca buku atau stretching ringan.' },
      { judul: 'Hindari kafein sore hari', detail: 'Kopi/teh terakhir maksimal jam 14.00.' },
      { judul: 'Buat kamar nyaman', detail: 'Gelap, sejuk (24-26C), dan hening.' },
      { judul: 'Bangun di jam sama', detail: 'Alarm sekali, langsung bangun — jangan snooze berkali-kali.' },
    ],
    risiko: [{ risiko: 'Tetap insomnia >2 minggu', pencegahan: 'Konsultasi ke dokter; bisa jadi gangguan tidur yang butuh penanganan.' }],
    penyelesaian: 'Bangun segar dan fokus. Bila masih lelah meski 7-8 jam, evaluasi kualitas (mendengkur? sering terbangun?).',
    tags: ['tidur', 'kesehatan', 'rutinitas'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_4: Tutorial[] = [
  {
    id: 'tut-teknologi-08', slug: 'cara-backup-data-hp', judul: 'Cara Backup Data HP Sebelum Servis',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'HP mau diservis, takut foto dan kontak hilang.',
    penjelasan: 'Backup = salinan cadangan. Lakukan sebelum HP diserahkan ke teknisi atau direset.',
    persiapanAlat: ['Koneksi WiFi', 'Akun Google'],
    langkah: [
      { judul: 'Backup foto/video', detail: 'Aktifkan Google Photos > Backup. Tunggu sampai 100% (cek di photos.google.com).' },
      { judul: 'Backup kontak', detail: 'Kontak tersimpan di akun Google otomatis tersinkron. Cek di contacts.google.com.' },
      { judul: 'Backup chat WhatsApp', detail: 'WA > Setelan > Chat > Cadangan chat > Cadangkan ke Google Drive.' },
      { judul: 'Catat akun penting', detail: 'Pastikan ingat password email, mobile banking, dan PIN.' },
      { judul: 'Keluarkan kartu & logout', detail: 'Ambil SIM/microSD. Logout akun Google bila HP ditinggal.' },
    ],
    risiko: [{ risiko: 'Backup tidak lengkap', pencegahan: 'Verifikasi di web (photos.google.com) sebelum serahkan HP.' }],
    penyelesaian: 'Data aman. Setelah HP kembali, login akun Google dan restore — semua kembali seperti semula.',
    tags: ['backup', 'android', 'servis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_5: Tutorial[] = [
  {
    id: 'tut-kerja-07', slug: 'cara-menulis-cv-ats', judul: 'Cara Menulis CV yang Lolos ATS',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Lamar puluhan lowongan, tidak ada panggilan.',
    penjelasan: 'ATS (Applicant Tracking System) memfilter CV sebelum dibaca manusia. Format sederhana + kata kunci = peluang lolos.',
    persiapanAlat: ['Data riwayat pendidikan & kerja', 'Deskripsi lowongan target'],
    langkah: [
      { judul: 'Gunakan format sederhana', detail: 'Satu kolom, font standar, tanpa tabel/gambar/header-footer. Simpan sebagai PDF.' },
      { judul: 'Tulis ringkasan 3 baris', detail: 'Siapa kamu, pengalaman berapa tahun, keahlian utama.' },
      { judul: 'Sesuaikan kata kunci', detail: 'Ambil istilah dari deskripsi lowongan (mis. "administrasi", "Excel").' },
      { judul: 'Kuantifikasi pencapaian', detail: '"Meningkatkan penjualan 20%" lebih kuat dari "bertanggung jawab atas penjualan".' },
      { judul: 'Maksimal 2 halaman', detail: 'Fresh graduate cukup 1 halaman.' },
    ],
    risiko: [{ risiko: 'Data tidak jujur', pencegahan: 'Jangan mengarang pengalaman — mudah terbongkar saat interview.' }],
    penyelesaian: 'CV siap kirim. Lamar 5-10 lowongan relevan per minggu dan catat hasilnya.',
    tags: ['cv', 'kerja', 'lamaran'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_6: Tutorial[] = [
  {
    id: 'tut-belajar-07', slug: 'cara-hafal-cepat', judul: 'Cara Menghafal Cepat dengan Teknik Mnemonik',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Sudah baca berkali-kali tapi cepat lupa saat ujian.',
    penjelasan: 'Otak mengingat gambar dan cerita, bukan teks mentah. Mnemonik mengubah info abstrak jadi visual.',
    persiapanAlat: ['Materi yang mau dihafal', 'Kertas coretan'],
    langkah: [
      { judul: 'Pecah jadi kelompok kecil', detail: 'Chunking: 7±2 item per kelompok. Nomor HP diingat per 3-4 digit.' },
      { judul: 'Buat akronim', detail: 'Contoh: warna pelangi MEJIKUHIBINIU (merah, jingga, kuning, hijau, biru, nila, ungu).' },
      { judul: 'Metode loci (istana memori)', detail: 'Tempelkan tiap item di lokasi rumah yang familiar, lalu "jalan" melewatinya.' },
      { judul: 'Ulangi berjeda', detail: 'Spaced repetition: ulangi setelah 1 jam, 1 hari, 3 hari, 1 minggu.' },
      { judul: 'Uji diri aktif', detail: 'Tutup buku, tulis dari ingatan. Jangan cuma baca ulang.' },
    ],
    risiko: [{ risiko: 'Hafal tanpa paham', pencegahan: 'Pahami konsep dulu, mnemonik hanya untuk fakta (nama, tanggal, rumus).' }],
    penyelesaian: 'Materi melekat lebih lama. Kombinasikan dengan latihan soal untuk pemahaman.',
    tags: ['hafalan', 'belajar', 'mnemonik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_7: Tutorial[] = [
  {
    id: 'tut-mental-07', slug: 'cara-mengatasi-overthinking', judul: 'Cara Mengatasi Overthinking Sebelum Tidur',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Pikiran berputar terus, susah tidur karena khawatir.',
    penjelasan: 'Overthinking = otak mencoba menyelesaikan masalah tanpa aksi. Solusinya: keluarkan dari kepala ke kertas.',
    persiapanAlat: ['Buku catatan / HP'],
    langkah: [
      { judul: 'Tulis semua kekhawatiran', detail: 'Brain dump 10 menit: tulis apapun yang mengganggu, tanpa sensor.' },
      { judul: 'Pisahkan yang bisa dikontrol', detail: 'Bagi dua kolom: "bisa saya pengaruhi" vs "di luar kendali". Fokus ke kolom pertama.' },
      { judul: 'Tulis 1 aksi kecil', detail: 'Untuk tiap khawatir yang terkontrol, tulis 1 langkah kecil besok.' },
      { judul: 'Tutup dengan syukur', detail: 'Tulis 3 hal baik hari ini. Mengalihkan fokus otak.' },
      { judul: 'Tutup buku, tutup hari', detail: 'Setelah ditulis, janji ke diri: "besok dipikir, sekarang istirahat".' },
    ],
    risiko: [{ risiko: 'Kecemasan berkepanjangan >2 minggu', pencegahan: 'Konsultasi ke psikolog; bukan kelemahan, tapi perawatan diri.' }],
    penyelesaian: 'Pikiran lebih tenang. Jadikan rutinitas malam bila sering kambuh.',
    tags: ['overthinking', 'mental', 'tidur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_8: Tutorial[] = [
  {
    id: 'tut-perbaikan-07', slug: 'cara-memperbaiki-keran-bocor', judul: 'Cara Memperbaiki Keran Air yang Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Keran menetes terus, tagihan air membengkak.',
    penjelasan: '90% keran bocor karena seal/karet washer aus. Ganti washer = selesai.',
    persiapanAlat: ['Kunci inggris', 'Obeng', 'Washer/karet seal baru', 'Isolasi pipa (seal tape)'],
    langkah: [
      { judul: 'Tutup keran utama', detail: 'Putar katup utama air sampai berhenti total.' },
      { judul: 'Buka gagang keran', detail: 'Lepas tutup gagang, buka baut dengan obeng.' },
      { judul: 'Ganti washer', detail: 'Lepas washer lama yang aus, pasang yang baru dengan ukuran sama.' },
      { judul: 'Pasang ulang', detail: 'Rakit kembali, lilit seal tape di ulir bila perlu.' },
      { judul: 'Tes', detail: 'Buka keran utama perlahan, cek tidak ada tetesan.' },
    ],
    risiko: [{ risiko: 'Ulir dol / pipa pecah', pencegahan: 'Jangan paksa bila macet; panggil tukang bila pipa sudah korosi.' }],
    penyelesaian: 'Keran berhenti menetes. Bila masih bocor, kemungkinan dudukannya aus — panggil tukang.',
    tags: ['keran', 'perbaikan', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_9: Tutorial[] = [
  {
    id: 'tut-umkm-07', slug: 'cara-jualan-di-medsos', judul: 'Cara Mulai Jualan di Media Sosial',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Punya produk tapi bingung cara jualan online.',
    penjelasan: 'Mulai dari yang gratis: WhatsApp Status, Instagram, dan TikTok. Fokus 1 produk dulu.',
    persiapanAlat: ['HP dengan kamera', 'Produk siap foto'],
    langkah: [
      { judul: 'Foto produk yang jelas', detail: 'Cahaya alami pagi/sore, background polos, 3-5 angle.' },
      { judul: 'Buat akun khusus jualan', detail: 'Nama jelas, bio berisi produk + cara order + lokasi.' },
      { judul: 'Posting rutin', detail: 'Minimal 1x sehari: foto produk, testimoni, proses pembuatan.' },
      { judul: 'Permudah order', detail: 'Cantumkan format order (nama-alamat-jumlah) dan nomor WA.' },
      { judul: 'Minta testimoni', detail: 'Setiap pembeli puas, minta izin screenshot chatnya.' },
    ],
    risiko: [{ risiko: 'Penipuan / PHP', pencegahan: 'Terapkan DP 50% untuk order besar; waspada transfer bukti palsu.' }],
    penyelesaian: 'Order pertama masuk. Evaluasi produk terlaris tiap minggu.',
    tags: ['jualan', 'umkm', 'medsos'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_10: Tutorial[] = [
  {
    id: 'tut-keuangan-08', slug: 'cara-hindari-pinjol-ilegal', judul: 'Cara Mengenali dan Menghindari Pinjol Ilegal',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Butuh dana cepat, takut terjebak pinjol ilegal.',
    penjelasan: 'Pinjol ilegal: bunga mencekik, teror debt collector, sebar data. Kenali cirinya sebelum pinjam.',
    persiapanAlat: ['HP', 'Akses internet'],
    langkah: [
      { judul: 'Cek legalitas di OJK', detail: 'Buka ojk.go.id atau WA OJK 081-157-157-157. Hanya pinjam dari yang terdaftar.' },
      { judul: 'Waspadai ciri ilegal', detail: 'Tawaran via SMS/WA random, bunga tidak jelas, minta akses kontak/galeri.' },
      { judul: 'Hitung total bayar', detail: 'Bunga legal maks ~0,3%/hari. Hitung total sebelum setuju.' },
      { judul: 'Jangan gali lubang', detail: 'Pinjam baru untuk bayar pinjol lama = jebakan.' },
      { judul: 'Lapor bila jadi korban', detail: 'Lapor ke OJK, polisi, dan blokir akses aplikasi ke data HP.' },
    ],
    risiko: [{ risiko: 'Teror dan sebar data', pencegahan: 'Jangan beri akses kontak/galeri ke aplikasi pinjaman apapun.' }],
    penyelesaian: 'Aman dari jerat pinjol. Bila butuh dana, prioritaskan koperasi/Bank resmi.',
    tags: ['pinjol', 'keuangan', 'waspada'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_11: Tutorial[] = [
  {
    id: 'tut-kehidupan-07', slug: 'cara-mengatur-keuangan-kos', judul: 'Cara Mengatur Keuangan Anak Kos',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Uang saku selalu habis sebelum akhir bulan.',
    penjelasan: 'Anak kos punya 3 pos besar: makan, kos, transport. Kendalikan ketiganya.',
    persiapanAlat: ['Catatan pengeluaran', 'Aplikasi e-wallet'],
    langkah: [
      { judul: 'Hitung uang saku bersih', detail: 'Total transfer ortu dikurangi kos & pulsa = uang hidup.' },
      { judul: 'Bagi harian', detail: 'Uang hidup ÷ 30 hari = jatah harian. Jangan ambil jatah besok.' },
      { judul: 'Masak 3x seminggu', detail: 'Nasi + telur + sayur jauh lebih murah dari beli.' },
      { judul: 'Pisahkan dana darurat', detail: 'Sisihkan 50rb/bulan untuk keperluan mendadak.' },
      { judul: 'Cari side income', detail: 'Jasa ketik, desain, atau jualan kecil-kecilan.' },
    ],
    risiko: [{ risiko: 'Berutang ke teman', pencegahan: 'Jangan gengsi makan sederhana; utang merusak pertemanan.' }],
    penyelesaian: 'Bulan berjalan tanpa minus. Naikkan tabungan bertahap tiap bulan.',
    tags: ['kos', 'keuangan', 'mahasiswa'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_12: Tutorial[] = [
  {
    id: 'tut-alat-07', slug: 'cara-mengasah-pisau', judul: 'Cara Mengasah Pisau Dapur yang Tumpul',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Pisau tumpul, motong jadi susah dan berbahaya.',
    penjelasan: 'Pisau tumpul lebih berbahaya dari yang tajam (tergelincir). Asah dengan batu asah sudut 20 derajat.',
    persiapanAlat: ['Batu asah / honing steel', 'Air', 'Lap'],
    langkah: [
      { judul: 'Rendam batu asah', detail: 'Rendam 5-10 menit sampai tidak ada gelembung.' },
      { judul: 'Posisikan sudut 20 derajat', detail: 'Seperti mengiris tipis permukaan batu.' },
      { judul: 'Asah bergantian', detail: '10x tiap sisi, tekanan ringan dan konsisten.' },
      { judul: 'Tes ketajaman', detail: 'Iris kertas: tajam bila bersih tanpa robek.' },
      { judul: 'Bersihkan & simpan', detail: 'Cuci, keringkan, simpan di sarung/blok pisau.' },
    ],
    risiko: [{ risiko: 'Tangan tergores', pencegahan: 'Jari jauh dari mata pisau; gerakan menjauhi tubuh.' }],
    penyelesaian: 'Pisau tajam kembali. Asah ringan tiap 1-2 minggu.',
    tags: ['pisau', 'dapur', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_13: Tutorial[] = [
  {
    id: 'tut-kesehatan-08', slug: 'cara-pertolongan-pertama-luka', judul: 'Pertolongan Pertama untuk Luka Ringan',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Terluka (pisau, jatuh) dan bingung pertolongan pertama.',
    penjelasan: 'Prinsip: hentikan darah, bersihkan, lindungi. Kenali kapan harus ke dokter.',
    persiapanAlat: ['Kasa steril', 'Plester', 'Air bersih', 'Antiseptik'],
    langkah: [
      { judul: 'Cuci tangan dulu', detail: 'Sebelum menyentuh luka, cuci tangan dengan sabun.' },
      { judul: 'Hentikan perdarahan', detail: 'Tekan dengan kasa bersih 10-15 menit. Jangan diintip.' },
      { judul: 'Bersihkan luka', detail: 'Bilas dengan air mengalir. Jangan pakai alkohol langsung ke luka dalam.' },
      { judul: 'Tutup luka', detail: 'Oles antiseptik di sekitar, tutup dengan kasa/plester.' },
      { judul: 'Pantau', detail: 'Ganti perban tiap hari. Waspada tanda infeksi: bengkak, nanah, demam.' },
    ],
    risiko: [{ risiko: 'Luka dalam / tidak berhenti berdarah', pencegahan: 'Segera ke IGD bila darah menyembur atau luka lebar.' }],
    penyelesaian: 'Luka tertangani. Jaga kebersihan sampai sembuh total.',
    tags: ['p3k', 'luka', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_14: Tutorial[] = [
  {
    id: 'tut-kerja-08', slug: 'cara-interview-kerja', judul: 'Cara Menghadapi Interview Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Gugup saat interview, jawaban berantakan.',
    penjelasan: 'Interview menilai 3 hal: kompetensi, attitude, kecocokan. Siapkan cerita dengan metode STAR.',
    persiapanAlat: ['CV', 'Pakaian rapi', 'Riset perusahaan'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Ketahui produk, visi, dan berita terbarunya.' },
      { judul: 'Siapkan 3 cerita STAR', detail: 'Situation-Task-Action-Result untuk pertanyaan pengalaman.' },
      { judul: 'Latihan jawab umum', detail: '"Ceritakan dirimu", "kelebihan/kekurangan", "kenapa kami".' },
      { judul: 'Siapkan pertanyaan balik', detail: '"Bagaimana tim ini bekerja?" menunjukkan antusiasme.' },
      { judul: 'Tindak lanjut', detail: 'Kirim ucapan terima kasih via email 1 hari setelahnya.' },
    ],
    risiko: [{ risiko: 'Terlambat / tidak sopan', pencegahan: 'Datang 15 menit awal; matikan HP.' }],
    penyelesaian: 'Interview berjalan lancar. Evaluasi dan perbaiki untuk berikutnya.',
    tags: ['interview', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_15: Tutorial[] = [
  {
    id: 'tut-belajar-08', slug: 'cara-fokus-belajar', judul: 'Cara Fokus Belajar Tanpa Distraksi HP',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Baru belajar 5 menit, tangan gatal buka HP.',
    penjelasan: 'Fokus adalah skill yang dilatih. Atur lingkungan, bukan andalkan kemauan.',
    persiapanAlat: ['Timer', 'Tempat belajar rapi'],
    langkah: [
      { judul: 'Jauhkan HP', detail: 'Taruh di ruangan lain atau mode pesawat. Bukan silent — jauh.' },
      { judul: 'Pakai pomodoro', detail: '25 menit fokus penuh, 5 menit istirahat. Ulangi 4x lalu istirahat panjang.' },
      { judul: 'Satu tugas satu waktu', detail: 'Tulis 1 target sesi ini. Tutup tab/aplikasi lain.' },
      { judul: 'Siapkan semua dulu', detail: 'Air minum, buku, alat tulis — biar tidak ada alasan berdiri.' },
      { judul: 'Catat distraksi', detail: 'Kepikiran sesuatu? Tulis di kertas, lanjutkan belajar.' },
    ],
    risiko: [{ risiko: 'Kecanduan HP parah', pencegahan: 'Pakai aplikasi screen time lock bila perlu; cari bantuan bila mengganggu hidup.' }],
    penyelesaian: 'Sesi belajar produktif. Naikkan durasi pomodoro bertahap.',
    tags: ['fokus', 'belajar', 'produktivitas'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_16: Tutorial[] = [
  {
    id: 'tut-mental-08', slug: 'cara-mengatasi-insecure', judul: 'Cara Mengatasi Rasa Insecure',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Selalu merasa kurang dibanding orang lain di medsos.',
    penjelasan: 'Insecure = membandingkan behind-the-scenes kita dengan highlight orang lain. Tidak adil dan tidak akurat.',
    persiapanAlat: ['Buku catatan'],
    langkah: [
      { judul: 'Sadari pemicunya', detail: 'Catat kapan insecure muncul: setelah buka medsos? Ketemu siapa?' },
      { judul: 'Batasi medsos', detail: 'Unfollow akun yang bikin minder. Kurangi screen time.' },
      { judul: 'Tulis kelebihanmu', detail: 'Daftar 10 hal yang kamu bisa/baik. Baca saat insecure.' },
      { judul: 'Bandingkan dengan dirimu kemarin', detail: 'Satu-satunya perbandingan sehat: progress diri sendiri.' },
      { judul: 'Fokus kontribusi', detail: 'Bantu orang lain — mengalihkan fokus dari kekurangan.' },
    ],
    risiko: [{ risiko: 'Depresi / gangguan makan', pencegahan: 'Cari bantuan profesional bila mengganggu aktivitas harian.' }],
    penyelesaian: 'Lebih damai dengan diri sendiri. Insecure sesekali itu normal.',
    tags: ['insecure', 'mental', 'percaya-diri'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_17: Tutorial[] = [
  {
    id: 'tut-perbaikan-08', slug: 'cara-mengganti-lampu', judul: 'Cara Mengganti Lampu dan Stop Kontak dengan Aman',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Lampu mati atau stop kontak longgar.',
    penjelasan: 'Pekerjaan listrik ringan bisa dilakukan sendiri ASAL matikan MCB dulu. Keselamatan nomor satu.',
    persiapanAlat: ['Obeng tespen', 'Lampu/stop kontak baru', 'Isolasi listrik'],
    langkah: [
      { judul: 'MATIKAN MCB', detail: 'Turunkan MCB di box listrik. Ini WAJIB, bukan opsional.' },
      { judul: 'Tes dengan tespen', detail: 'Pastikan tidak ada arus di kabel yang akan dipegang.' },
      { judul: 'Lepas yang lama', detail: 'Foto dulu susunan kabel sebagai referensi.' },
      { judul: 'Pasang yang baru', detail: 'Sambung sesuai foto: fasa ke fasa, netral ke netral.' },
      { judul: 'Nyalakan & tes', detail: 'Naikkan MCB, tes fungsi. Bila MCB trip, matikan dan periksa.' },
    ],
    risiko: [{ risiko: 'Kesetrum', pencegahan: 'JANGAN kerjakan bila MCB tidak bisa dimatikan — panggil teknisi.' }],
    penyelesaian: 'Lampu/stop kontak berfungsi. Bila ragu sedikit pun, panggil teknisi listrik.',
    tags: ['listrik', 'lampu', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_18: Tutorial[] = [
  {
    id: 'tut-teknologi-09', slug: 'cara-amankan-akun-medsos', judul: 'Cara Mengamankan Akun Media Sosial',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Akun IG/WA dibajak orang.',
    penjelasan: 'Pembajakan 90% karena password lemah + tanpa 2FA. Amankan dalam 10 menit.',
    persiapanAlat: ['HP', 'Akses email'],
    langkah: [
      { judul: 'Aktifkan 2FA', detail: 'IG: Pengaturan > Keamanan > Autentikasi dua faktor. WA: Verifikasi dua langkah.' },
      { judul: 'Ganti password kuat', detail: 'Minimal 12 karakter, unik per akun.' },
      { judul: 'Cek sesi aktif', detail: 'Keluarkan perangkat yang tidak dikenal.' },
      { judul: 'Waspada link phising', detail: '"Akunmu akan diblokir, klik di sini" = jebakan.' },
      { judul: 'Backup kode', detail: 'Simpan kode pemulihan 2FA di tempat aman.' },
    ],
    risiko: [{ risiko: 'Kehilangan akun permanen', pencegahan: 'Jangan pernah berikan kode OTP ke siapapun.' }],
    penyelesaian: 'Akun aman. Ulangi cek keamanan tiap 6 bulan.',
    tags: ['keamanan', 'medsos', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_19: Tutorial[] = [
  {
    id: 'tut-kehidupan-08', slug: 'cara-menghemat-listrik', judul: 'Cara Menghemat Listrik di Rumah',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tagihan listrik membengkak tiap bulan.',
    penjelasan: '80% tagihan biasanya dari 3 alat: AC, kulkas, dan pemanas air. Atur ketiganya.',
    persiapanAlat: ['Tagihan listrik 3 bulan terakhir'],
    langkah: [
      { judul: 'Atur AC 24-26 derajat', detail: 'Tiap 1 derajat lebih dingin = +6% daya. Bersihkan filter tiap bulan.' },
      { judul: 'Cabut charger menganggur', detail: 'Standby power 5-10% tagihan. Pakai stop kontak saklar.' },
      { judul: 'Ganti ke LED', detail: 'LED 80% lebih hemat dari pijar dengan terang sama.' },
      { judul: 'Atur kulkas bijak', detail: 'Suhu 3-5C cukup; jangan buka-tutup sering.' },
      { judul: 'Cuci baju menumpuk', detail: 'Mesin cuci penuh 2x seminggu lebih hemat dari tiap hari sedikit.' },
    ],
    risiko: [{ risiko: 'MCB sering trip', pencegahan: 'Jangan tambah daya sendiri; hubungi PLN bila instalasi bermasalah.' }],
    penyelesaian: 'Tagihan turun 15-30%. Pantau tiap bulan.',
    tags: ['listrik', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_20: Tutorial[] = [
  {
    id: 'tut-umkm-08', slug: 'cara-hitung-hpp', judul: 'Cara Menghitung HPP Produk Jualan',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Jualan laris tapi untung tipis atau malah rugi.',
    penjelasan: 'HPP (Harga Pokok Produksi) = semua biaya untuk 1 produk. Harga jual minimal = HPP + margin.',
    persiapanAlat: ['Catatan biaya bahan', 'Kalkulator'],
    langkah: [
      { judul: 'Hitung biaya bahan', detail: 'Total semua bahan untuk 1 batch, bagi jumlah produk.' },
      { judul: 'Hitung biaya kemasan', detail: 'Plastik, stiker, box — jangan lupa.' },
      { judul: 'Hitung biaya tenaga', detail: 'Upah per jam × waktu pengerjaan ÷ jumlah produk.' },
      { judul: 'Tambah overhead', detail: 'Listrik, gas, sewa — alokasikan 10-20%.' },
      { judul: 'Tentukan harga jual', detail: 'HPP × 1,5 sampai 2 untuk margin sehat.' },
    ],
    risiko: [{ risiko: 'Harga kemahalan / kemurahan', pencegahan: 'Bandingkan dengan kompetitor sejenis; jangan perang harga.' }],
    penyelesaian: 'Tahu persis untung per produk. Naikkan efisiensi bila margin tipis.',
    tags: ['hpp', 'umkm', 'jualan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_21: Tutorial[] = [
  {
    id: 'tut-keuangan-09', slug: 'cara-mulai-investasi-kecil', judul: 'Cara Mulai Investasi dengan Modal Kecil',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Penghasilan pas-pasan, ingin investasi tapi bingung mulai dari mana.',
    penjelasan: 'Investasi bisa mulai Rp10rb. Kuncinya: dana darurat dulu, lalu investasi rutin.',
    persiapanAlat: ['KTP', 'Rekening bank', 'Aplikasi sekuritas/bank digital resmi'],
    langkah: [
      { judul: 'Amankan dana darurat dulu', detail: '3x pengeluaran bulanan di tabungan terpisah.' },
      { judul: 'Pilih instrumen sesuai profil', detail: 'Konservatif: reksa dana pasar uang / SBN. Berani risiko: saham/reksa dana saham.' },
      { judul: 'Mulai kecil & rutin', detail: 'Rp100rb/bulan rutin > Rp5 juta sekali lalu berhenti.' },
      { judul: 'Jangan pinjam untuk investasi', detail: 'Investasi pakai uang dingin, bukan utang.' },
      { judul: 'Evaluasi tahunan', detail: 'Cek performa 1x setahun, jangan tiap hari.' },
    ],
    risiko: [{ risiko: 'Tergiur imbal hasil tak wajar', pencegahan: 'Waspada investasi bodong: cek legalitas di OJK.' }],
    penyelesaian: 'Portofolio berjalan. Naikkan nominal seiring naiknya penghasilan.',
    tags: ['investasi', 'keuangan', 'pemula'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_22: Tutorial[] = [
  {
    id: 'tut-alat-08', slug: 'cara-merawat-sepatu', judul: 'Cara Merawat Sepatu Biar Awet',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sepatu cepat rusak, bau, dan kusam.',
    penjelasan: 'Perawatan rutin 10 menit seminggu menggandakan umur sepatu.',
    persiapanAlat: ['Sikat lembut', 'Lap microfiber', 'Shoe tree / koran'],
    langkah: [
      { judul: 'Bersihkan tiap pakai', detail: 'Lap debu dengan kain kering/microfiber.' },
      { judul: 'Cuci sesuai bahan', detail: 'Kanvas: sikat + sabun lembut. Kulit: cairan khusus kulit.' },
      { judul: 'Keringkan alami', detail: 'Angin-anginkan, jangan dijemur langsung / hairdryer.' },
      { judul: 'Simpan benar', detail: 'Masukkan shoe tree/koran agar bentuk terjaga.' },
      { judul: 'Rotasi pakai', detail: 'Jangan pakai sepatu yang sama tiap hari.' },
    ],
    risiko: [{ risiko: 'Jamur & bau', pencegahan: 'Pastikan kering total sebelum disimpan; pakai silica gel.' }],
    penyelesaian: 'Sepatu awet dan tetap bagus. Hemat beli sepatu baru.',
    tags: ['sepatu', 'perawatan', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_23: Tutorial[] = [
  {
    id: 'tut-kesehatan-09', slug: 'cara-mengatasi-maag', judul: 'Cara Mengatasi Maag Kambuh',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Perut perih, mual, maag kambuh.',
    penjelasan: 'Maag kambuh karena telat makan, stres, atau makanan pemicu. Tangani cepat, cegah berulang.',
    persiapanAlat: ['Air hangat', 'Obat maag (antasida)'],
    langkah: [
      { judul: 'Makan sedikit', detail: 'Bubur/nasi lembek + lauk lembut. Jangan kosongkan perut.' },
      { judul: 'Hindari pemicu', detail: 'Kopi, pedas, asam, gorengan, dan rokok.' },
      { judul: 'Minum air hangat', detail: 'Sedikit-sedikit tapi sering.' },
      { judul: 'Kelola stres', detail: 'Stres memicu asam lambung naik.' },
      { judul: 'Obat bila perlu', detail: 'Antasida sesuai aturan pakai.' },
    ],
    risiko: [{ risiko: 'Muntah darah / BAB hitam', pencegahan: 'Segera ke dokter — tanda bahaya.' }],
    penyelesaian: 'Gejala mereda. Jaga pola makan 3x sehari teratur.',
    tags: ['maag', 'kesehatan', 'lambung'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_24: Tutorial[] = [
  {
    id: 'tut-kerja-09', slug: 'cara-kerja-remote', judul: 'Cara Mendapatkan Kerja Remote',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Ingin kerja dari rumah tapi tidak tahu caranya.',
    penjelasan: 'Kerja remote butuh 3 modal: skill digital, portofolio, dan profil online yang meyakinkan.',
    persiapanAlat: ['Laptop + internet stabil', 'Akun LinkedIn'],
    langkah: [
      { judul: 'Kuasai 1 skill digital', detail: 'Desain, nulis, coding, atau digital marketing — pilih 1 dulu.' },
      { judul: 'Buat portofolio', detail: '3-5 contoh kerja nyata, tampilkan di web/portofolio online.' },
      { judul: 'Rapi-kan profil', detail: 'LinkedIn lengkap + foto profesional.' },
      { judul: 'Lamar di platform', detail: 'Upwork, Freelancer, LinkedIn Jobs, Kalibrr.' },
      { judul: 'Mulai dari proyek kecil', detail: 'Bangun rating dengan proyek kecil dulu.' },
    ],
    risiko: [{ risiko: 'Penipuan lowongan', pencegahan: 'Jangan bayar untuk dapat kerja; waspada yang minta data bank di awal.' }],
    penyelesaian: 'Proyek pertama didapat. Jaga kualitas untuk repeat order.',
    tags: ['remote', 'kerja', 'freelance'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_25: Tutorial[] = [
  {
    id: 'tut-belajar-09', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat dan Tetap Paham',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 25,
    masalah: 'Buku tebal, waktu sedikit, bacaan tidak selesai-selesai.',
    penjelasan: 'Speed reading = kurangi subvokalisasi dan regresi. Paham struktur dulu, detail kemudian.',
    persiapanAlat: ['Buku/materi', 'Timer'],
    langkah: [
      { judul: 'Skimming dulu', detail: 'Baca judul, subjudul, dan kalimat pertama tiap paragraf — 5 menit.' },
      { judul: 'Tanya sebelum baca', detail: 'Tulis 3 pertanyaan yang ingin dijawab bacaan ini.' },
      { judul: 'Jangan baca kata per kata', detail: 'Tangkap frasa 3-4 kata sekaligus; kurangi gerakan bibir.' },
      { judul: 'Gunakan penunjuk', detail: 'Jari/pena sebagai pacer mempercepat 20-30%.' },
      { judul: 'Rangkum setelahnya', detail: 'Tulis 5 poin utama dari ingatan.' },
    ],
    risiko: [{ risiko: 'Cepat tapi tidak paham', pencegahan: 'Ukur dengan kuis diri; lambatkan untuk materi sulit.' }],
    penyelesaian: 'Kecepatan naik 1,5-2x dengan pemahaman terjaga.',
    tags: ['membaca', 'belajar', 'cepat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_26: Tutorial[] = [
  {
    id: 'tut-mental-09', slug: 'cara-mengatasi-burnout', judul: 'Cara Pulih dari Burnout Kerja',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Lelah terus, sinis ke pekerjaan, performa turun.',
    penjelasan: 'Burnout = kelelahan kronis akibat stres kerja berkepanjangan. Butuh pemulihan aktif, bukan sekadar libur.',
    persiapanAlat: ['Waktu untuk diri sendiri'],
    langkah: [
      { judul: 'Akui kondisinya', detail: 'Bukan malas — ini sinyal tubuh butuh perubahan.' },
      { judul: 'Istirahat beneran', detail: 'Cuti 2-3 hari tanpa mikir kerjaan. Bukan rebahan sambil cek email.' },
      { judul: 'Identifikasi sumber', detail: 'Beban berlebih? Tidak dihargai? Tidak cocok? Tulis jujur.' },
      { judul: 'Bicarakan', detail: 'Diskusi dengan atasan/HR tentang beban atau ekspektasi.' },
      { judul: 'Bangun batas', detail: 'Jam kerja jelas, notifikasi mati di luar jam kerja.' },
    ],
    risiko: [{ risiko: 'Depresi klinis', pencegahan: 'Bila >1 bulan tidak membaik, konsultasi ke psikolog/psikiater.' }],
    penyelesaian: 'Energi pulih bertahap. Jaga batas agar tidak kambuh.',
    tags: ['burnout', 'kerja', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_27: Tutorial[] = [
  {
    id: 'tut-kehidupan-09', slug: 'cara-packing-ransel', judul: 'Cara Packing Ransel untuk Traveling',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Bawaan berantakan, ransel penuh padahal cuma 3 hari.',
    penjelasan: 'Packing efisien = gulung baju, prioritaskan, dan bawa yang multifungsi.',
    persiapanAlat: ['Ransel', 'Packing cube / plastik'],
    langkah: [
      { judul: 'Buat daftar dulu', detail: 'Tulis semua yang dibawa, coret yang "mungkin perlu".' },
      { judul: 'Gulung, jangan lipat', detail: 'Baju digulung hemat tempat dan anti kusut.' },
      { judul: 'Berat di bawah, dekat punggung', detail: 'Sepatu & toiletries di bawah; yang sering dipakai di atas.' },
      { judul: 'Bawa 3-4-5', detail: '3 bawahan, 4 atasan, 5 hari maksimal — cuci di jalan.' },
      { judul: 'Dokumen di 1 pouch', detail: 'KTP, tiket, uang — selalu di tempat sama.' },
    ],
    risiko: [{ risiko: 'Kelebihan bagasi', pencegahan: 'Timbang sebelum berangkat; pakai baju terberat.' }],
    penyelesaian: 'Ransel rapi dan ringan. Traveling lebih nyaman.',
    tags: ['traveling', 'packing', 'kehidupan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_28: Tutorial[] = [
  {
    id: 'tut-umkm-09', slug: 'cara-promosi-gratis', judul: 'Cara Promosi Gratis untuk UMKM',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Budget promosi nol tapi ingin dikenal.',
    penjelasan: 'Promosi gratis = manfaatkan platform yang sudah ada: medsos, komunitas, dan mulut ke mulut.',
    persiapanAlat: ['HP', 'Akun medsos'],
    langkah: [
      { judul: 'Optimasi Google Bisnisku', detail: 'Daftar gratis, lengkapi foto & jam buka.' },
      { judul: 'Konten rutin di medsos', detail: 'Behind the scenes, testimoni, proses — 3x seminggu.' },
      { judul: 'Gabung komunitas', detail: 'Grup WA/FB lokal, perkenalkan usaha dengan sopan.' },
      { judul: 'Program referral', detail: 'Diskon untuk yang bawa teman.' },
      { judul: 'Kolaborasi', detail: 'Tukar promosi dengan usaha tetangga.' },
    ],
    risiko: [{ risiko: 'Spam & diblokir', pencegahan: 'Jangan spam grup; beri value dulu sebelum promosi.' }],
    penyelesaian: 'Usaha mulai dikenal. Ukur dari mana pelanggan datang.',
    tags: ['promosi', 'umkm', 'gratis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_29: Tutorial[] = [
  {
    id: 'tut-keuangan-10', slug: 'cara-bagi-thr', judul: 'Cara Bijak Mengelola THR & Bonus',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'THR habis dalam seminggu tanpa bekas.',
    penjelasan: 'Rumus 40-30-20-10: kebutuhan, tabungan, senang-senang, sedekah.',
    persiapanAlat: ['Kalkulator'],
    langkah: [
      { judul: 'Sisihkan 40% untuk kebutuhan', detail: 'Bayar utang/kewajiban dulu.' },
      { judul: 'Tabung 30%', detail: 'Dana darurat atau investasi.' },
      { judul: '10% sedekah', detail: 'Berkah dan melatih empati.' },
      { judul: '20% senang-senang', detail: 'Boleh belanja — tapi dibatasi.' },
      { judul: 'Catat semua', detail: 'Agar tidak "bocor halus".' },
    ],
    risiko: [{ risiko: 'Kalap belanja', pencegahan: 'Tunggu 3 hari sebelum beli barang non-esensial.' }],
    penyelesaian: 'THR bermanfaat jangka panjang, bukan sekadar euforia.',
    tags: ['thr', 'keuangan', 'bonus'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_30: Tutorial[] = [
  {
    id: 'tut-alat-09', slug: 'cara-memilih-laptop', judul: 'Cara Memilih Laptop Sesuai Kebutuhan',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Bingung pilih laptop, takut salah beli.',
    penjelasan: 'Pilih berdasarkan kebutuhan, bukan spesifikasi tertinggi. 3 profil: kerja ringan, kreator, gamer.',
    persiapanAlat: ['Budget', 'Daftar kebutuhan'],
    langkah: [
      { judul: 'Tentukan kebutuhan', detail: 'Ketik & browsing: spek rendah cukup. Edit video: butuh RAM 16GB+.' },
      { judul: 'Prioritaskan 3 ini', detail: 'Prosesor, RAM, SSD — lebih penting dari merk.' },
      { judul: 'Cek garansi', detail: 'Minimal 1 tahun resmi Indonesia.' },
      { judul: 'Baca review', detail: 'Cari review pemakaian 6+ bulan, bukan unboxing.' },
      { judul: 'Beli di tempat terpercaya', detail: 'Toko resmi / marketplace official store.' },
    ],
    risiko: [{ risiko: 'Barang rekondisi / palsu', pencegahan: 'Cek segel & serial number di situs resmi.' }],
    penyelesaian: 'Laptop sesuai kebutuhan dan budget. Rawat dengan baik.',
    tags: ['laptop', 'belanja', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_31: Tutorial[] = [
  {
    id: 'tut-kesehatan-10', slug: 'cara-menjaga-imun', judul: 'Cara Menjaga Daya Tahan Tubuh',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gampang sakit, flu berulang.',
    penjelasan: 'Imun kuat = gaya hidup, bukan suplemen mahal. 5 pilar utama.',
    persiapanAlat: ['Komitmen rutin'],
    langkah: [
      { judul: 'Tidur cukup', detail: '7-8 jam. Kurang tidur menurunkan imun 70%.' },
      { judul: 'Makan beragam', detail: 'Sayur-buah 5 porsi, protein cukup.' },
      { judul: 'Olahraga rutin', detail: '30 menit x 5/minggu, intensitas sedang.' },
      { judul: 'Kelola stres', detail: 'Stres kronis menekan imun.' },
      { judul: 'Vaksinasi', detail: 'Lengkapi vaksin sesuai anjuran.' },
    ],
    risiko: [{ risiko: 'Mengandalkan suplemen saja', pencegahan: 'Suplemen pelengkap, bukan pengganti gaya hidup.' }],
    penyelesaian: 'Jarang sakit. Konsisten 3 bulan terasa bedanya.',
    tags: ['imun', 'kesehatan', 'gaya-hidup'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_32: Tutorial[] = [
  {
    id: 'tut-kerja-10', slug: 'cara-naik-gaji', judul: 'Cara Negosiasi Kenaikan Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Kerja bertahun-tahun, gaji stagnan.',
    penjelasan: 'Kenaikan gaji = tunjukkan value + timing tepat + angka jelas.',
    persiapanAlat: ['Data pencapaian', 'Riset gaji pasar'],
    langkah: [
      { judul: 'Kumpulkan bukti', detail: 'Daftar pencapaian terukur 1 tahun terakhir.' },
      { judul: 'Riset pasar', detail: 'Cek kisaran gaji posisimu di Jobstreet/LinkedIn.' },
      { judul: 'Pilih timing', detail: 'Setelah proyek sukses / review tahunan.' },
      { judul: 'Sampaikan profesional', detail: '"Berdasarkan kontribusi X, saya mohon penyesuaian ke RpY."' },
      { judul: 'Siapkan plan B', detail: 'Bila ditolak: minta timeline review berikutnya / benefit lain.' },
    ],
    risiko: [{ risiko: 'Dinilai tidak loyal', pencegahan: 'Fokus pada kontribusi, bukan ancaman resign.' }],
    penyelesaian: 'Gaji naik atau ada kejelasan timeline. Keduanya progress.',
    tags: ['gaji', 'karier', 'negosiasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_33: Tutorial[] = [
  {
    id: 'tut-belajar-10', slug: 'cara-bikin-catatan-efektif', judul: 'Cara Membuat Catatan yang Efektif',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Catatan menumpuk tapi tidak pernah dibaca ulang.',
    penjelasan: 'Catatan efektif = ringkas, terstruktur, dan mudah di-review. Metode Cornell terbukti efektif.',
    persiapanAlat: ['Buku/kertas', 'Stabilo'],
    langkah: [
      { judul: 'Gunakan metode Cornell', detail: 'Bagi halaman: catatan kanan, kata kunci kiri, rangkuman bawah.' },
      { judul: 'Tulis dengan kata sendiri', detail: 'Parafrase, bukan salin. Tanda paham.' },
      { judul: 'Singkat & visual', detail: 'Poin-poin, panah, diagram. Hindari kalimat panjang.' },
      { judul: 'Review 24 jam', detail: 'Baca ulang keesokan harinya, lengkapi yang kurang.' },
      { judul: 'Digital bila perlu', detail: 'Foto/scan agar tidak hilang.' },
    ],
    risiko: [{ risiko: 'Terlalu rapi sampai buang waktu', pencegahan: 'Fungsi > estetika. Jangan dekorasi berlebihan.' }],
    penyelesaian: 'Catatan siap jadi bahan ujian. Review rutin tiap minggu.',
    tags: ['catatan', 'belajar', 'cornell'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_34: Tutorial[] = [
  {
    id: 'tut-mental-10', slug: 'cara-bangun-pagi', judul: 'Cara Bangun Pagi Tanpa Malas',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Alarm bunyi 5x, tetap tidak bangun.',
    penjelasan: 'Bangun pagi = soal malam harinya. Perbaiki rutinitas malam, paginya mengikuti.',
    persiapanAlat: ['Alarm'],
    langkah: [
      { judul: 'Tidur lebih awal', detail: 'Mundur 15 menit tiap 3 hari sampai target.' },
      { judul: 'Jauhkan HP dari kasur', detail: 'Paksa bangun untuk matikan alarm.' },
      { judul: 'Siapkan pagi malam ini', detail: 'Baju, tas, sarapan — kurangi keputusan pagi.' },
      { judul: 'Cahaya pagi', detail: 'Buka gorden / keluar 5 menit. Cahaya reset jam tubuh.' },
      { judul: 'Alasan kuat', detail: 'Tulis 1 alasan bangun pagi di kertas dekat alarm.' },
    ],
    risiko: [{ risiko: 'Kurang tidur kronis', pencegahan: 'Jangan pangkas tidur — majukan jam tidur, bukan kurangi.' }],
    penyelesaian: 'Bangun pagi jadi kebiasaan dalam 3 minggu.',
    tags: ['bangun-pagi', 'rutinitas', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_35: Tutorial[] = [
  {
    id: 'tut-kehidupan-10', slug: 'cara-atur-keuangan-keluarga', judul: 'Cara Mengatur Keuangan Keluarga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Penghasilan cukup tapi selalu kurang.',
    penjelasan: 'Masalahnya bukan jumlah, tapi sistem. Terapkan amplop digital.',
    persiapanAlat: ['Data gaji & pengeluaran', 'Rekening terpisah / e-wallet'],
    langkah: [
      { judul: 'Catat 1 bulan penuh', detail: 'Tanpa mengubah kebiasaan dulu — data dulu.' },
      { judul: 'Bagi ke amplop', detail: 'Wajib (50%), tabungan (20%), gaya hidup (20%), darurat (10%).' },
      { judul: 'Otomatisasi', detail: 'Auto-debit tabungan tiap gajian.' },
      { judul: 'Rapat keuangan', detail: 'Diskusi dengan pasangan 1x bulan.' },
      { judul: 'Evaluasi triwulan', detail: 'Sesuaikan amplop dengan perubahan.' },
    ],
    risiko: [{ risiko: 'Konflik pasangan soal uang', pencegahan: 'Transparan penuh; tidak ada pengeluaran sembunyi.' }],
    penyelesaian: 'Arus kas terkendali, tabungan tumbuh.',
    tags: ['keuangan', 'keluarga', 'budget'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_36: Tutorial[] = [
  {
    id: 'tut-umkm-10', slug: 'cara-bikin-logo-sendiri', judul: 'Cara Bikin Logo Sendiri untuk UMKM',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Butuh logo tapi budget desainer belum ada.',
    penjelasan: 'Logo sederhana bisa dibuat sendiri dengan tools gratis. Fokus: mudah diingat.',
    persiapanAlat: ['HP/laptop', 'Aplikasi Canva'],
    langkah: [
      { judul: 'Tentukan konsep', detail: '1 ikon + nama usaha. Hindari terlalu ramai.' },
      { judul: 'Pilih 2 warna', detail: 'Warna utama + aksen. Konsisten di semua media.' },
      { judul: 'Buat di Canva', detail: 'Pakai template logo, modifikasi ikon & font.' },
      { judul: 'Tes keterbacaan', detail: 'Perkecil sampai 2cm — masih terbaca?' },
      { judul: 'Simpan multi format', detail: 'PNG transparan + versi hitam putih.' },
    ],
    risiko: [{ risiko: 'Mirip logo orang', pencegahan: 'Cek Google Images; jangan jiplak mentah.' }],
    penyelesaian: 'Logo siap dipakai. Upgrade ke desainer saat usaha berkembang.',
    tags: ['logo', 'umkm', 'desain'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_37: Tutorial[] = [
  {
    id: 'tut-kehidupan-11', slug: 'cara-hemat-belanja-bulanan', judul: 'Cara Hemat Belanja Bulanan',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Belanja bulanan selalu over budget.',
    penjelasan: 'Hemat belanja = daftar + disiplin + timing. Bukan pelit, tapi cerdas.',
    persiapanAlat: ['Daftar belanja', 'Kalkulator HP'],
    langkah: [
      { judul: 'Buat daftar & patuhi', detail: 'Tulis sebelum berangkat. Tidak di daftar = tidak beli.' },
      { judul: 'Jangan belanja lapar', detail: 'Perut kenyang = 30% lebih hemat (terbukti riset).' },
      { judul: 'Bandingkan harga per satuan', detail: 'Kemasan besar belum tentu murah — hitung per 100g.' },
      { judul: 'Manfaatkan promo bijak', detail: 'Beli yang memang dipakai, bukan karena diskon.' },
      { judul: 'Belanja 2x sebulan', detail: 'Kurangi frekuensi = kurangi godaan.' },
    ],
    risiko: [{ risiko: 'Stok menumpuk kedaluwarsa', pencegahan: 'Cek tanggal kedaluwarsa; FIFO (yang dulu dipakai dulu).' }],
    penyelesaian: 'Belanja cukup, tidak kurang tidak lebih.',
    tags: ['belanja', 'hemat', 'kehidupan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_38: Tutorial[] = [
  {
    id: 'tut-teknologi-10', slug: 'cara-backup-data-hp', judul: 'Cara Backup Data HP agar Aman',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'HP hilang/rusak, semua data ikut hilang.',
    penjelasan: 'Backup rutin = asuransi data. 3-2-1: 3 salinan, 2 media, 1 di luar rumah.',
    persiapanAlat: ['Koneksi internet', 'Akun Google/iCloud'],
    langkah: [
      { judul: 'Aktifkan backup otomatis', detail: 'Android: Google One. iPhone: iCloud.' },
      { judul: 'Backup foto terpisah', detail: 'Google Photos / iCloud Photos — aktifkan sinkron.' },
      { judul: 'Ekspor chat penting', detail: 'WhatsApp: backup ke Drive tiap minggu.' },
      { judul: 'Salin ke laptop/PC', detail: '1x sebulan, file penting ke hard disk.' },
      { judul: 'Catat akun & password', detail: 'Simpan di password manager.' },
    ],
    risiko: [{ risiko: 'Backup cloud penuh', pencegahan: 'Hapus file duplikat; upgrade bila perlu.' }],
    penyelesaian: 'Data aman meski HP hilang. Restore dalam hitungan jam.',
    tags: ['backup', 'hp', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_39: Tutorial[] = [
  {
    id: 'tut-keuangan-10', slug: 'cara-mulai-investasi-saham', judul: 'Cara Mulai Investasi Saham untuk Pemula',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Ingin investasi tapi takut rugi dan tidak tahu mulai dari mana.',
    penjelasan: 'Saham = kepemilikan perusahaan. Mulai kecil, pelajari dulu, jangan FOMO.',
    persiapanAlat: ['KTP', 'Rekening bank', 'Aplikasi sekuritas'],
    langkah: [
      { judul: 'Buka rekening saham', detail: 'Pilih sekuritas terdaftar OJK. Proses online 1-3 hari.' },
      { judul: 'Pelajari dasar', detail: 'Pahami PER, PBV, dividen. Mulai dari saham blue chip.' },
      { judul: 'Mulai kecil', detail: '1 lot (100 lembar). Anggap uang belajar.' },
      { judul: 'Diversifikasi', detail: 'Jangan taruh semua di 1 saham.' },
      { judul: 'Jangka panjang', detail: 'Saham untuk 5+ tahun, bukan judi harian.' },
    ],
    risiko: [{ risiko: 'Rugi modal', pencegahan: 'Jangan pakai uang kebutuhan/dana darurat. Jangan utang untuk saham.' }],
    penyelesaian: 'Portofolio tumbuh seiring waktu. Evaluasi tahunan.',
    tags: ['saham', 'investasi', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_40: Tutorial[] = [
  {
    id: 'tut-mental-11', slug: 'cara-atasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Pikiran tidak berhenti memutar skenario terburuk.',
    penjelasan: 'Overthinking = otak mencoba mengontrol yang tak terkontrol. Teknik: batasi & alihkan.',
    persiapanAlat: ['Kertas', 'Timer'],
    langkah: [
      { judul: 'Tulis semua kekhawatiran', detail: 'Keluarkan dari kepala ke kertas. 10 menit.' },
      { judul: 'Pisahkan bisa/tidak dikontrol', detail: 'Coret yang di luar kontrolmu.' },
      { judul: 'Jadwalkan waktu khawatir', detail: '15 menit/hari. Di luar itu, tunda.' },
      { judul: 'Aksi kecil', detail: '1 langkah nyata untuk 1 kekhawatiran.' },
      { judul: 'Alihkan fisik', detail: 'Jalan kaki / olahraga ringan memutus loop.' },
    ],
    risiko: [{ risiko: 'Menekan pikiran malah makin kuat', pencegahan: 'Jangan lawan — akui lalu alihkan. Bila parah, konsultasi profesional.' }],
    penyelesaian: 'Pikiran lebih tenang. Ulangi teknik tiap kambuh.',
    tags: ['overthinking', 'mental', 'cemas'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_41: Tutorial[] = [
  {
    id: 'tut-alat-10', slug: 'cara-pakai-multimeter', judul: 'Cara Pakai Multimeter untuk Pemula',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Punya multimeter tapi bingung cara pakainya.',
    penjelasan: 'Multimeter = 3 alat dalam 1: ukur tegangan, arus, dan hambatan. Kuasai 3 mode ini.',
    persiapanAlat: ['Multimeter digital', 'Baterai AA bekas'],
    langkah: [
      { judul: 'Kenali probe', detail: 'Merah = positif, hitam = negatif/COM.' },
      { judul: 'Ukur tegangan DC', detail: 'Putar ke V⎓, probe ke kutub baterai. Baca: ~1.5V.' },
      { judul: 'Ukur hambatan', detail: 'Putar ke Ω. Jangan ukur komponen yang masih bertegangan!' },
      { judul: 'Ukur arus', detail: 'Pindah probe merah ke lubang A. Rangkai SERI dengan beban.' },
      { judul: 'Matikan setelah pakai', detail: 'Hemat baterai multimeter.' },
    ],
    risiko: [{ risiko: 'Korsleting / multimeter rusak', pencegahan: 'Jangan ukur arus PARALEL. Mulai dari range terbesar.' }],
    penyelesaian: 'Bisa cek baterai, kabel putus, dan tegangan dasar.',
    tags: ['multimeter', 'elektronik', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_42: Tutorial[] = [
  {
    id: 'tut-perbaikan-10', slug: 'cara-perbaiki-keran-bocor', judul: 'Cara Perbaiki Keran Air Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Keran menetes terus, tagihan air bengkak.',
    penjelasan: '90% keran bocor = seal/karet aus. Ganti karetnya, bukan kerannya.',
    persiapanAlat: ['Obeng', 'Kunci inggris', 'Karet seal baru'],
    persiapanBahan: ['Karet seal keran'],
    langkah: [
      { judul: 'Tutup saluran air utama', detail: 'Putar katup utama sampai air berhenti.' },
      { judul: 'Buka tutup keran', detail: 'Congkel tutup plastik, buka bautnya.' },
      { judul: 'Lepas katup', detail: 'Putar berlawanan arah jarum jam dengan kunci inggris.' },
      { judul: 'Ganti karet seal', detail: 'Lepas karet lama, pasang yang baru.' },
      { judul: 'Pasang kembali & tes', detail: 'Rakit balik, buka air utama, cek tetesan.' },
    ],
    risiko: [{ risiko: 'Banjir bila lupa tutup air', pencegahan: 'Pastikan air utama TERTUTUP sebelum bongkar.' }],
    penyelesaian: 'Keran rapat kembali. Hemat air & tagihan.',
    tags: ['keran', 'plumbing', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_43: Tutorial[] = [
  {
    id: 'tut-kesehatan-11', slug: 'cara-jaga-kesehatan-mata', judul: 'Cara Menjaga Kesehatan Mata',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mata lelah, kering, dan penglihatan menurun karena layar.',
    penjelasan: 'Mata butuh istirahat terjadwal. Aturan 20-20-20 terbukti membantu.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Terapkan 20-20-20', detail: 'Tiap 20 menit, lihat 20 kaki (6m) selama 20 detik.' },
      { judul: 'Kedipkan mata', detail: 'Di depan layar kita jarang berkedip — sadari & kedipkan.' },
      { judul: 'Atur jarak & cahaya', detail: 'Layar 50-70cm, tidak lebih terang dari ruangan.' },
      { judul: 'Batasi sebelum tidur', detail: 'Stop layar 1 jam sebelum tidur.' },
      { judul: 'Periksa rutin', detail: 'Ke dokter mata 1-2 tahun sekali.' },
    ],
    risiko: [{ risiko: 'Minus bertambah', pencegahan: 'Perbanyak aktivitas luar ruangan — terbukti memperlambat.' }],
    penyelesaian: 'Mata lebih nyaman. Bila buram menetap, periksa ke dokter.',
    tags: ['mata', 'kesehatan', 'layar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_44: Tutorial[] = [
  {
    id: 'tut-kerja-11', slug: 'cara-bikin-linkedin-menarik', judul: 'Cara Membuat Profil LinkedIn yang Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Profil LinkedIn sepi, tidak ada recruiter yang menghubungi.',
    penjelasan: 'LinkedIn = CV online. Optimasi kata kunci + bukti hasil.',
    persiapanAlat: ['Foto profesional', 'Riwayat kerja'],
    langkah: [
      { judul: 'Foto & headline', detail: 'Foto jelas + headline berisi skill, bukan sekadar jabatan.' },
      { judul: 'About yang menjual', detail: '3 paragraf: siapa, pencapaian, yang dicari.' },
      { judul: 'Experience terukur', detail: 'Setiap peran: 3-5 bullet dengan angka.' },
      { judul: 'Skills & endorsement', detail: 'Tambah 10+ skill relevan.' },
      { judul: 'Aktif berkomentar', detail: 'Komentar bermakna di postingan industri tiap minggu.' },
    ],
    risiko: [{ risiko: 'Terlihat sombong', pencegahan: 'Fakta terukur, bukan klaim kosong.' }],
    penyelesaian: 'Profil muncul di pencarian recruiter. Peluang interview naik.',
    tags: ['linkedin', 'karier', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_45: Tutorial[] = [
  {
    id: 'tut-belajar-11', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat tapi Paham',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bacaan menumpuk, waktu terbatas.',
    penjelasan: 'Speed reading = kurangi subvokalisasi + baca per frasa. Bukan untuk semua teks.',
    persiapanAlat: ['Buku/artikel', 'Timer'],
    langkah: [
      { judul: 'Preview dulu', detail: 'Baca judul, subjudul, kesimpulan — 2 menit.' },
      { judul: 'Baca per frasa', detail: 'Tangkap 3-4 kata sekaligus, bukan per kata.' },
      { judul: 'Jangan mundur', detail: 'Terus maju; konteks akan menjelaskan.' },
      { judul: 'Tandai & catat', detail: 'Stabilo poin penting, tulis 3 kalimat ringkasan.' },
      { judul: 'Latihan harian', detail: '15 menit/hari, ukur wpm tiap minggu.' },
    ],
    risiko: [{ risiko: 'Paham turun', pencegahan: 'Untuk teks sulit (hukum, sains), baca normal saja.' }],
    penyelesaian: 'Kecepatan 2x dengan pemahaman tetap.',
    tags: ['membaca', 'belajar', 'cepat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_46: Tutorial[] = [
  {
    id: 'tut-mental-12', slug: 'cara-memaafkan', judul: 'Cara Memaafkan yang Menyakiti',
    kategori: 'mental', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Sakit hati bertahun-tahun tidak kunjung sembuh.',
    penjelasan: 'Memaafkan = melepaskan bebanmu, bukan membenarkan perbuatannya.',
    persiapanAlat: ['Kertas'],
    langkah: [
      { judul: 'Akui lukanya', detail: 'Tulis apa yang terjadi & rasamu. Jangan ditutup-tutupi.' },
      { judul: 'Pahami motifnya', detail: 'Kebanyakan orang menyakiti karena luka mereka sendiri.' },
      { judul: 'Putuskan melepaskan', detail: 'Keputusan sadar, bukan menunggu "merasa" memaafkan.' },
      { judul: 'Batasi akses', detail: 'Memaafkan ≠ harus dekat lagi. Jaga jarak bila perlu.' },
      { judul: 'Ulangi bila kambuh', detail: 'Ingatan muncul lagi? Ulangi keputusan.' },
    ],
    risiko: [{ risiko: 'Disakiti lagi', pencegahan: 'Maaf + batasan. Tanpa batasan = undangan diulang.' }],
    penyelesaian: 'Hati lebih ringan. Energi kembali untuk hidupmu.',
    tags: ['memaafkan', 'mental', 'hati'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_47: Tutorial[] = [
  {
    id: 'tut-kehidupan-12', slug: 'cara-packing-travel', judul: 'Cara Packing Efektif untuk Traveling',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Koper penuh tapi ada yang kurang, atau kelebihan barang.',
    penjelasan: 'Packing efektif = daftar + lipat gulung + aturan 5-4-3-2-1.',
    persiapanAlat: ['Koper/tas', 'Packing cube (opsional)'],
    langkah: [
      { judul: 'Buat daftar', detail: 'Tulis semua kebutuhan per kategori: pakaian, mandi, dokumen, elektronik.' },
      { judul: 'Aturan 5-4-3-2-1', detail: '5 atasan, 4 bawahan, 3 pasang sepatu, 2 jaket, 1 topi (7 hari).' },
      { judul: 'Gulung pakaian', detail: 'Rolling hemat 30% ruang dan anti kusut.' },
      { judul: 'Dokumen di tas kecil', detail: 'KTP, tiket, uang — selalu di tas yang dibawa.' },
      { judul: 'Sisakan ruang', detail: '20% kosong untuk oleh-oleh.' },
    ],
    risiko: [{ risiko: 'Overweight bagasi', pencegahan: 'Timbang di rumah. Batas kabin 7kg.' }],
    penyelesaian: 'Traveling ringan dan nyaman.',
    tags: ['packing', 'traveling', 'kehidupan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_48: Tutorial[] = [
  {
    id: 'tut-umkm-11', slug: 'cara-daftar-nib', judul: 'Cara Daftar NIB untuk UMKM',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Usaha jalan tapi belum punya legalitas.',
    penjelasan: 'NIB (Nomor Induk Berusaha) = KTP-nya usaha. Gratis via OSS.',
    persiapanAlat: ['KTP', 'NPWP (bila ada)', 'HP/laptop'],
    langkah: [
      { judul: 'Buka oss.go.id', detail: 'Daftar akun dengan NIK.' },
      { judul: 'Isi data usaha', detail: 'Nama, alamat, bidang usaha (KBLI), modal.' },
      { judul: 'Pilih skala', detail: 'Mikro/kecil/menengah sesuai omzet.' },
      { judul: 'Terbitkan NIB', detail: 'Unduh NIB + sertifikat standar bila perlu.' },
      { judul: 'Urus izin lanjutan', detail: 'PIRT/halal bila usaha makanan.' },
    ],
    risiko: [{ risiko: 'KBLI salah', pencegahan: 'Cek KBLI yang tepat di oss.go.id sebelum submit.' }],
    penyelesaian: 'Usaha legal. Bisa ikut tender & akses KUR.',
    tags: ['nib', 'umkm', 'legalitas'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_49: Tutorial[] = [
  {
    id: 'tut-teknologi-11', slug: 'cara-aman-wifi-publik', judul: 'Cara Aman Pakai WiFi Publik',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'WiFi gratis rawan disadap.',
    penjelasan: 'WiFi publik = jalan tol tanpa pagar. Lindungi data dengan 4 langkah.',
    persiapanAlat: ['HP/laptop'],
    langkah: [
      { judul: 'Pastikan HTTPS', detail: 'Cek gembok di browser. Jangan login di situs HTTP.' },
      { judul: 'Matikan auto-connect', detail: 'Jangan otomatis sambung ke WiFi asing.' },
      { judul: 'Pakai VPN', detail: 'VPN mengenkripsi trafikmu.' },
      { judul: 'Hindari transaksi penting', detail: 'M-banking & belanja: pakai data seluler saja.' },
      { judul: 'Lupakan jaringan', detail: 'Forget network setelah selesai.' },
    ],
    risiko: [{ risiko: 'Akun dibajak', pencegahan: 'Aktifkan 2FA di semua akun penting.' }],
    penyelesaian: 'Browsing aman di WiFi publik.',
    tags: ['wifi', 'keamanan', 'teknologi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_50: Tutorial[] = [
  {
    id: 'tut-keuangan-11', slug: 'cara-bebas-utang', judul: 'Cara Bebas dari Jerat Utang',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Gaji habis untuk bayar utang, gali lubang tutup lubang.',
    penjelasan: 'Bebas utang = daftar semua + strategi snowball/avalanche + stop gali baru.',
    persiapanAlat: ['Daftar semua utang'],
    langkah: [
      { judul: 'Daftar semua utang', detail: 'Kreditur, jumlah, bunga, cicilan. Jujur penuh.' },
      { judul: 'Pilih strategi', detail: 'Snowball: lunas terkecil dulu. Avalanche: bunga terbesar dulu.' },
      { judul: 'Stop utang baru', detail: 'Potong kartu kredit. Hapus paylater.' },
      { judul: 'Tambah pemasukan', detail: 'Side job khusus untuk cicilan.' },
      { judul: 'Nego ke kreditur', detail: 'Minta restrukturisasi bila macet.' },
    ],
    risiko: [{ risiko: 'Godaan utang lagi', pencegahan: 'Dana darurat kecil dulu agar tak utang saat darurat.' }],
    penyelesaian: 'Satu per satu lunas. Hidup tanpa cicilan.',
    tags: ['utang', 'keuangan', 'bebas'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_51: Tutorial[] = [
  {
    id: 'tut-perbaikan-11', slug: 'cara-ganti-lampu-led', judul: 'Cara Ganti Lampu ke LED Hemat Energi',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tagihan listrik bengkak karena lampu pijar.',
    penjelasan: 'LED 80% lebih hemat dari pijar. Ganti sendiri itu mudah.',
    persiapanAlat: ['Tangga', 'Lampu LED baru'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Pastikan lampu mati & dingin.' },
      { judul: 'Lepas lampu lama', detail: 'Putar berlawanan arah jarum jam.' },
      { judul: 'Cek fitting', detail: 'E27 (besar) atau E14 (kecil) — samakan.' },
      { judul: 'Pasang LED', detail: 'Putar searah jarum jam sampai kencang.' },
      { judul: 'Nyalakan & tes', detail: 'Pilih warna: warm white untuk kamar, cool white untuk kerja.' },
    ],
    risiko: [{ risiko: 'Sengatan listrik', pencegahan: 'Jangan sentuh fitting dengan tangan basah. Bila ragu, matikan MCB.' }],
    penyelesaian: 'Ruangan terang, tagihan turun.',
    tags: ['lampu', 'led', 'hemat-energi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_52: Tutorial[] = [
  {
    id: 'tut-kesehatan-12', slug: 'cara-tidur-nyenyak', judul: 'Cara Tidur Nyenyak Setiap Malam',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sulit tidur, bangun tidak segar.',
    penjelasan: 'Tidur berkualitas = rutinitas + lingkungan. 7-9 jam untuk dewasa.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Tidur & bangun jam sama tiap hari, termasuk weekend.' },
      { judul: 'Ritual 30 menit', detail: 'Mandi hangat, baca buku, redupkan lampu.' },
      { judul: 'Kamar ideal', detail: 'Gelap, sejuk (22-24°C), sunyi.' },
      { judul: 'Batasi kafein', detail: 'Stop kopi/teh setelah jam 14.00.' },
      { judul: 'Jangan main HP', detail: 'Taruh HP di luar jangkauan 1 jam sebelum tidur.' },
    ],
    risiko: [{ risiko: 'Insomnia kronis', pencegahan: 'Bila >3 minggu sulit tidur, konsultasi ke dokter.' }],
    penyelesaian: 'Bangun segar dan fokus.',
    tags: ['tidur', 'kesehatan', 'insomnia'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_53: Tutorial[] = [
  {
    id: 'tut-mental-13', slug: 'cara-bangun-kepercayaan-diri', judul: 'Cara Membangun Kepercayaan Diri',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Minder, takut salah, takut dinilai orang.',
    penjelasan: 'Percaya diri = skill, bukan bakat. Dibangun lewat bukti kecil yang menumpuk.',
    persiapanAlat: ['Jurnal/catatan'],
    langkah: [
      { judul: 'Kumpulkan kemenangan kecil', detail: 'Catat 3 hal yang berhasil tiap hari.' },
      { judul: 'Siapkan diri', detail: 'Riset & latihan sebelum presentasi/ujian.' },
      { judul: 'Postur tubuh', detail: 'Duduk tegak, kontak mata. Tubuh memengaruhi pikiran.' },
      { judul: 'Berani tampil', detail: 'Mulai dari forum kecil: tanya di kelas, ngobrol dengan tetangga.' },
      { judul: 'Terima kegagalan', detail: 'Gagal = data, bukan vonis.' },
    ],
    risiko: [{ risiko: 'Jadi arogan', pencegahan: 'Percaya diri + rendah hati. Dengarkan orang lain.' }],
    penyelesaian: 'Berani tampil dan mengambil peluang.',
    tags: ['percaya-diri', 'mental', 'minder'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_54: Tutorial[] = [
  {
    id: 'tut-kehidupan-13', slug: 'cara-rawat-tanaman-hias', judul: 'Cara Merawat Tanaman Hias untuk Pemula',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tanaman hias selalu mati dalam sebulan.',
    penjelasan: '90% tanaman mati karena overwatering. Kuasai 3 hal: cahaya, air, media.',
    persiapanAlat: ['Pot berlubang', 'Media tanam'],
    langkah: [
      { judul: 'Pilih yang mudah', detail: 'Lidah mertua, sirih gading, ZZ plant — tahan banting.' },
      { judul: 'Cahaya tepat', detail: 'Tidak langsung untuk indoor. Dekat jendela ideal.' },
      { judul: 'Siram bila kering', detail: 'Tusuk jari 2cm: kering = siram, basah = tunda.' },
      { judul: 'Drainase wajib', detail: 'Pot harus berlubang. Genangan = akar busuk.' },
      { judul: 'Pupuk sebulan sekali', detail: 'NPK dosis kecil. Jangan berlebihan.' },
    ],
    risiko: [{ risiko: 'Hama', pencegahan: 'Cek daun rutin. Semprot air sabun bila ada kutu.' }],
    penyelesaian: 'Tanaman subur dan rumah lebih segar.',
    tags: ['tanaman', 'hias', 'berkebun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_55: Tutorial[] = [
  {
    id: 'tut-kerja-12', slug: 'cara-hadapi-bos-sulit', judul: 'Cara Menghadapi Bos yang Sulit',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bos galak, tidak jelas, atau tidak adil.',
    penjelasan: 'Tidak bisa mengubah bos — bisa mengubah strategimu menghadapinya.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Pahami tipenya', detail: 'Mikromanajer? Butuh laporan detail. Pelupa? Kirim pengingat tertulis.' },
      { judul: 'Komunikasi tertulis', detail: 'Konfirmasi instruksi via chat/email. Bukti bila disalahkan.' },
      { judul: 'Jangan baper', detail: 'Pisahkan kritik kerja vs serangan personal.' },
      { judul: 'Cari sekutu', detail: 'Bangun hubungan baik dengan rekan & atasan lain.' },
      { judul: 'Rencana keluar', detail: 'Bila toksik parah: siapkan CV & tabungan, lalu resign elegan.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Jaga batasan. Bila kesehatan terganggu, prioritaskan dirimu.' }],
    penyelesaian: 'Lingkungan kerja terkendali atau jalan keluar yang terhormat.',
    tags: ['bos', 'kerja', 'kantor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_56: Tutorial[] = [
  {
    id: 'tut-belajar-12', slug: 'cara-fokus-belajar', judul: 'Cara Fokus Belajar Tanpa Distraksi',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Baru belajar 5 menit sudah pegang HP.',
    penjelasan: 'Fokus = lingkungan + teknik. Otak butuh 15 menit untuk masuk "zona".',
    persiapanAlat: ['Timer'],
    langkah: [
      { judul: 'Jauhkan HP', detail: 'Taruh di ruangan lain / mode pesawat. Bukan di saku.' },
      { judul: 'Pomodoro', detail: '25 menit fokus, 5 menit istirahat. 4 sesi = istirahat panjang.' },
      { judul: 'Satu tugas', detail: 'Tutup tab lain. Multitasking = mitos.' },
      { judul: 'Lingkungan rapi', detail: 'Meja bersih, cahaya cukup.' },
      { judul: 'Tulis distraksi', detail: 'Pikiran muncul? Catat, lanjutkan belajar.' },
    ],
    risiko: [{ risiko: 'FOMO', pencegahan: 'Ingat: 25 menit offline tidak membuatmu ketinggalan apa-apa.' }],
    penyelesaian: 'Sesi belajar produktif dan tuntas.',
    tags: ['fokus', 'belajar', 'pomodoro'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_57: Tutorial[] = [
  {
    id: 'tut-umkm-12', slug: 'cara-jualan-di-marketplace', judul: 'Cara Jualan di Marketplace untuk Pemula',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Punya produk tapi tidak tahu cara jualan online.',
    penjelasan: 'Marketplace = pasar dengan jutaan pengunjung. Kunci: foto, judul, harga, rating.',
    persiapanAlat: ['HP', 'KTP', 'Rekening bank'],
    langkah: [
      { judul: 'Daftar seller', detail: 'Shopee/Tokopedia/TikTok Shop. Verifikasi KTP.' },
      { judul: 'Foto produk bagus', detail: 'Cahaya terang, background bersih, 5+ foto.' },
      { judul: 'Judul mengandung keyword', detail: '"Tas Selempang Wanita Kulit Premium" bukan "Tas Bagus".' },
      { judul: 'Harga kompetitif', detail: 'Cek 5 kompetitor. Awal: sedikit lebih murah.' },
      { judul: 'Ikut promo', detail: 'Gratis ongkir & flash sale menaikkan traffic.' },
      { judul: 'Jaga rating', detail: 'Packing rapi, kirim cepat, balas chat ramah.' },
    ],
    risiko: [{ risiko: 'Rugi karena biaya admin', pencegahan: 'Hitung margin setelah potongan 5-10%.' }],
    penyelesaian: 'Toko online berjalan dan dapat order pertama.',
    tags: ['marketplace', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_58: Tutorial[] = [
  {
    id: 'tut-teknologi-12', slug: 'cara-bikin-qr-code', judul: 'Cara Membuat QR Code Sendiri',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Butuh QR code untuk link/WhatsApp/pembayaran.',
    penjelasan: 'QR code bisa dibuat gratis dalam 1 menit. Tidak perlu aplikasi khusus.',
    persiapanAlat: ['HP/laptop'],
    langkah: [
      { judul: 'Buka generator', detail: 'qr-code-generator.com atau sejenisnya.' },
      { judul: 'Pilih tipe', detail: 'URL, teks, WiFi, atau vCard.' },
      { judul: 'Masukkan data', detail: 'Tempel link / tulis teksnya.' },
      { judul: 'Unduh', detail: 'Simpan sebagai PNG resolusi tinggi.' },
      { judul: 'Tes scan', detail: 'Scan dengan HP lain sebelum disebar.' },
    ],
    risiko: [{ risiko: 'QR mengarah ke situs jahat', pencegahan: 'Jangan scan QR dari sumber tidak dikenal.' }],
    penyelesaian: 'QR code siap dipakai.',
    tags: ['qr', 'teknologi', 'gratis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_59: Tutorial[] = [
  {
    id: 'tut-perbaikan-12', slug: 'cara-bersihkan-ac', judul: 'Cara Membersihkan AC Sendiri',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 45,
    masalah: 'AC tidak dingin dan bau apek.',
    penjelasan: 'Filter kotor = 80% penyebab AC tidak dingin. Bersihkan tiap 2-3 bulan.',
    persiapanAlat: ['Obeng', 'Sikat gigi bekas', 'Semprotan air', 'Plastik penampung'],
    langkah: [
      { judul: 'Matikan listrik AC', detail: 'Cabut steker / matikan MCB. Keselamatan utama.' },
      { judul: 'Buka cover', detail: 'Angkat panel depan, lepas filter.' },
      { judul: 'Cuci filter', detail: 'Sikat + air mengalir. Keringkan sebelum pasang.' },
      { judul: 'Bersihkan evaporator', detail: 'Semprot kisi-kisi dengan air. Tampung dengan plastik.' },
      { judul: 'Bersihkan outdoor', detail: 'Sikat debu kipas & kondensor.' },
      { judul: 'Pasang & tes', detail: 'Nyalakan, cek dingin & tidak bocor.' },
    ],
    risiko: [{ risiko: 'Sengatan listrik / AC rusak', pencegahan: 'Pastikan listrik MATI. Jangan semprot bagian elektrik.' }],
    penyelesaian: 'AC dingin kembali, listrik lebih hemat.',
    tags: ['ac', 'bersih', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_60: Tutorial[] = [
  {
    id: 'tut-mental-14', slug: 'cara-atasi-kecanduan-hp', judul: 'Cara Mengatasi Kecanduan HP',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Screen time 8+ jam sehari, susah lepas dari HP.',
    penjelasan: 'Kecanduan HP = desain aplikasi yang adiktif. Lawan dengan desain lingkunganmu.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cek screen time', detail: 'Lihat data 7 hari. Sadar dulu.' },
      { judul: 'Hapus pemicu', detail: 'Hapus / sembunyikan aplikasi paling menyita waktu.' },
      { judul: 'Grayscale', detail: 'Layar hitam-putih bikin HP membosankan.' },
      { judul: 'Zona bebas HP', detail: 'Kamar tidur & meja makan = no HP.' },
      { judul: 'Ganti aktivitas', detail: 'Siapkan buku/olahraga sebagai pengganti.' },
    ],
    risiko: [{ risiko: 'Kam buh', pencegahan: 'Target realistis: kurangi 1 jam/minggu, bukan langsung 0.' }],
    penyelesaian: 'Screen time turun, waktu untuk hal penting bertambah.',
    tags: ['hp', 'kecanduan', 'digital-detox'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_61: Tutorial[] = [
  {
    id: 'tut-kehidupan-14', slug: 'cara-hemat-listrik', judul: 'Cara Hemat Listrik di Rumah',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tagihan listrik membengkak tiap bulan.',
    penjelasan: 'Hemat listrik = kenali pemakai besar + ubah kebiasaan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Ganti ke LED', detail: 'Semua lampu pijar → LED. Hemat 80%.' },
      { judul: 'Cabut standby', detail: 'TV, charger, dispenser: cabut bila tidak dipakai.' },
      { judul: 'AC bijak', detail: '26°C + timer. Bersihkan filter rutin.' },
      { judul: 'Kulkas efisien', detail: 'Jangan buka-tutup sering. Suhu 3-5°C.' },
      { judul: 'Gunakan timer', detail: 'Pompa air, water heater pakai timer.' },
    ],
    risiko: [{ risiko: 'Tidak nyaman', pencegahan: 'Hemat ≠ menderita. Prioritaskan yang boros.' }],
    penyelesaian: 'Tagihan turun 20-40%.',
    tags: ['listrik', 'hemat', 'kehidupan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_62: Tutorial[] = [
  {
    id: 'tut-keuangan-12', slug: 'cara-bikin-dana-darurat', judul: 'Cara Membangun Dana Darurat',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keadaan darurat selalu berujung utang.',
    penjelasan: 'Dana darurat = 3-6x pengeluaran bulanan di rekening terpisah yang mudah diakses.',
    persiapanAlat: ['Rekening terpisah'],
    langkah: [
      { judul: 'Hitung target', detail: 'Pengeluaran bulanan × 3 (lajang) / × 6 (berkeluarga).' },
      { judul: 'Mulai kecil', detail: 'Target awal 1 juta. Sisihkan 10% gaji.' },
      { judul: 'Otomatisasi', detail: 'Auto-debit tiap gajian ke rekening darurat.' },
      { judul: 'Jangan diutak-atik', detail: 'Bukan untuk diskon / liburan. Darurat saja.' },
      { judul: 'Isi ulang', detail: 'Terpakai? Isi lagi sampai target.' },
    ],
    risiko: [{ risiko: 'Tergoda pakai', pencegahan: 'Rekening tanpa kartu ATM / di bank berbeda.' }],
    penyelesaian: 'Tenang menghadapi keadaan tak terduga.',
    tags: ['dana-darurat', 'keuangan', 'tabungan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_63: Tutorial[] = [
  {
    id: 'tut-perbaikan-13', slug: 'cara-tambal-ban-tubles', judul: 'Cara Menambal Ban Tubles Bocor',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Ban bocor kena paku di jalan.',
    penjelasan: 'Ban tubles bisa ditambal tanpa lepas ban: pakai cacing tambal.',
    persiapanAlat: ['Kit tambal tubles', 'Pompa'],
    langkah: [
      { judul: 'Temukan lubang', detail: 'Cabut paku, tandai lubangnya.' },
      { judul: 'Lebarkan lubang', detail: 'Tusuk dengan alat kikir dari kit.' },
      { judul: 'Pasang cacing', detail: 'Masukkan cacing tambal dengan aplikator, tarik cepat.' },
      { judul: 'Potong sisa', detail: 'Potong cacing yang menonjol.' },
      { judul: 'Pompa & cek', detail: 'Pompa sampai tekanan pas, cek tidak bocor.' },
    ],
    risiko: [{ risiko: 'Tambalan lepas', pencegahan: 'Lubang >6mm / di dinding ban = ganti ban, jangan tambal.' }],
    penyelesaian: 'Ban bisa dipakai lagi. Cek tekanan tiap minggu.',
    tags: ['ban', 'tubles', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_64: Tutorial[] = [
  {
    id: 'tut-belajar-13', slug: 'cara-hafal-cepat', judul: 'Cara Menghafal Cepat dan Tahan Lama',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Sudah hafal malam ini, besok lupa lagi.',
    penjelasan: 'Menghafal = encoding + repetisi berjarak. Otak butuh pengulangan terjadwal.',
    persiapanAlat: ['Kartu/flashcard'],
    langkah: [
      { judul: 'Pahami dulu', detail: 'Jangan hafal yang tidak dipahami. Paham = 50% hafal.' },
      { judul: 'Chunking', detail: 'Potong jadi bagian kecil (7±2 item).' },
      { judul: 'Mnemonik', detail: 'Singkatan, lagu, atau cerita lucu.' },
      { judul: 'Spaced repetition', detail: 'Ulangi: 1 jam, 1 hari, 1 minggu, 1 bulan.' },
      { judul: 'Ajarkan orang lain', detail: 'Mengajar = hafalan terkuat.' },
    ],
    risiko: [{ risiko: 'Hafal mati tanpa paham', pencegahan: 'Uji dengan soal aplikasi, bukan sekadar tulis ulang.' }],
    penyelesaian: 'Hafalan tahan lama sampai ujian.',
    tags: ['hafal', 'belajar', 'mnemonik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_65: Tutorial[] = [
  {
    id: 'tut-mental-15', slug: 'cara-kelola-emosi', judul: 'Cara Mengelola Emosi Marah',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mudah meledak, menyesal kemudian.',
    penjelasan: 'Marah = sinyal, bukan musuh. Kelola sebelum meledak.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jeda 6 detik', detail: 'Tarik napas dalam. Reaksi kimia marah mereda dalam 90 detik.' },
      { judul: 'Pergi sejenak', detail: 'Walk away. Kembali saat tenang.' },
      { judul: 'Namai emosimu', detail: '"Saya kecewa karena..." — menamai mengurangi intensitas.' },
      { judul: 'Tulis, jangan kirim', detail: 'Tulis unek-unek. Baca ulang besok.' },
      { judul: 'Bicara saat tenang', detail: 'Sampaikan dengan "saya merasa", bukan tuduhan.' },
    ],
    risiko: [{ risiko: 'Menekan emosi terus', pencegahan: 'Kelola ≠ pendam. Salurkan: olahraga, bicara, tulis.' }],
    penyelesaian: 'Konflik selesai tanpa penyesalan.',
    tags: ['marah', 'emosi', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_66: Tutorial[] = [
  {
    id: 'tut-kehidupan-15', slug: 'cara-atur-waktu-ibu-rumah-tangga', judul: 'Cara Mengatur Waktu untuk Ibu Rumah Tangga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Seharian sibuk tapi tidak ada yang selesai.',
    penjelasan: 'IRT = manajer rumah tangga. Butuh sistem, bukan sekadar niat.',
    persiapanAlat: ['Buku agenda'],
    langkah: [
      { judul: 'Time blocking', detail: 'Bagi hari: pagi (masak), siang (anak), sore (bersih), malam (me time).' },
      { judul: 'Batching', detail: 'Masak 2x sehari. Cuci 2x seminggu. Belanja 1x seminggu.' },
      { judul: 'Libatkan keluarga', detail: 'Anak & suami punya tugas masing-masing.' },
      { judul: 'Me time wajib', detail: '1 jam/hari untuk diri sendiri. Bukan egois.' },
      { judul: 'Fleksibel', detail: 'Jadwal = panduan, bukan penjara.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Istirahat bukan kemalasan. Minta bantuan bila kewalahan.' }],
    penyelesaian: 'Rumah teratur, ibu bahagia.',
    tags: ['irt', 'waktu', 'keluarga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_67: Tutorial[] = [
  {
    id: 'tut-kerja-13', slug: 'cara-kerja-remote', judul: 'Cara Mendapatkan Kerja Remote',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Ingin kerja dari rumah tapi tidak tahu caranya.',
    penjelasan: 'Remote work butuh skill digital + portofolio + tempat cari yang tepat.',
    persiapanAlat: ['Laptop', 'Internet stabil'],
    langkah: [
      { judul: 'Kuasai 1 skill', detail: 'Desain, coding, writing, atau digital marketing.' },
      { judul: 'Bangun portofolio', detail: '3-5 karya terbaik di website/portofolio online.' },
      { judul: 'Daftar platform', detail: 'Upwork, Freelancer, LinkedIn, grup Telegram loker remote.' },
      { judul: 'Lamar massal & rapi', detail: '10 lamaran/hari dengan proposal personal.' },
      { judul: 'Siapkan workspace', detail: 'Internet backup, headset, ruangan tenang.' },
    ],
    risiko: [{ risiko: 'Penipuan loker', pencegahan: 'Jangan transfer uang untuk "diterima kerja". Cek reputasi perusahaan.' }],
    penyelesaian: 'Pekerjaan remote pertama didapat.',
    tags: ['remote', 'kerja', 'freelance'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_68: Tutorial[] = [
  {
    id: 'tut-mental-16', slug: 'cara-hadapi-bullying', judul: 'Cara Menghadapi Bullying',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Dibully di sekolah/kantor/medsos.',
    penjelasan: 'Bullying = penyalahgunaan kuasa. Kamu tidak salah — pelakunya yang salah.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jangan balas', detail: 'Pelaku ingin reaksi. Tenang = kekuatannya hilang.' },
      { judul: 'Dokumentasikan', detail: 'Screenshot, catat waktu & saksi.' },
      { judul: 'Lapor', detail: 'Guru, HRD, orang tua, atau polisi (bila fisik/ancaman).' },
      { judul: 'Blokir & batasi', detail: 'Di medsos: blokir, laporkan akun.' },
      { judul: 'Cari dukungan', detail: 'Cerita ke orang terpercaya. Jangan pendam sendiri.' },
    ],
    risiko: [{ risiko: 'Trauma', pencegahan: 'Bila mengganggu tidur/nafsu makan, konsultasi psikolog. Bukan aib.' }],
    penyelesaian: 'Bullying berhenti atau pelaku ditindak.',
    tags: ['bullying', 'mental', 'aman'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_69: Tutorial[] = [
  {
    id: 'tut-teknologi-13', slug: 'cara-aman-wifi-publik', judul: 'Cara Aman Pakai WiFi Publik',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'WiFi gratis rawan disadap.',
    penjelasan: 'WiFi publik = jaringan terbuka. Data bisa diintip. Amankan dengan langkah sederhana.',
    persiapanAlat: ['HP/laptop'],
    langkah: [
      { judul: 'Pakai HTTPS', detail: 'Pastikan ada gembok di browser.' },
      { judul: 'Nyalakan VPN', detail: 'VPN mengenkripsi semua trafik.' },
      { judul: 'Matikan auto-connect', detail: 'Jangan otomatis gabung WiFi asing.' },
      { judul: 'Hindari transaksi', detail: 'Jangan buka m-banking di WiFi publik.' },
      { judul: 'Lupakan jaringan', detail: 'Setelah selesai, hapus dari daftar tersimpan.' },
    ],
    risiko: [{ risiko: 'Akun dibajak', pencegahan: 'Aktifkan 2FA di semua akun penting.' }],
    penyelesaian: 'Internetan aman di kafe/bandara.',
    tags: ['wifi', 'keamanan', 'vpn'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_70: Tutorial[] = [
  {
    id: 'tut-umkm-13', slug: 'cara-daftar-qriss', judul: 'Cara Daftar QRIS untuk Usaha',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Pelanggan ingin bayar non-tunai.',
    penjelasan: 'QRIS = 1 QR untuk semua e-wallet & m-banking. Daftar via bank/PJSP.',
    persiapanAlat: ['KTP', 'Rekening bank', 'Foto usaha'],
    langkah: [
      { judul: 'Pilih PJSP', detail: 'Bank atau e-wallet (DANA, GoPay, OVO).' },
      { judul: 'Isi form', detail: 'Data usaha + upload dokumen.' },
      { judul: 'Verifikasi', detail: 'Tunggu 1-7 hari kerja.' },
      { judul: 'Terima QR', detail: 'Cetak & pasang di kasir.' },
      { judul: 'Uji transaksi', detail: 'Coba bayar 1x untuk memastikan.' },
    ],
    risiko: [{ risiko: 'QR palsu ditempel', pencegahan: 'Cek nama merchant di layar sebelum bayar. Pasang QR di tempat aman.' }],
    penyelesaian: 'Usaha menerima pembayaran digital.',
    tags: ['qris', 'umkm', 'pembayaran'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_71: Tutorial[] = [
  {
    id: 'tut-keuangan-13', slug: 'cara-baca-slip-gaji', judul: 'Cara Membaca Slip Gaji',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gaji terpotong tapi tidak paham potongannya.',
    penjelasan: 'Slip gaji = gaji kotor − potongan. Pahami tiap komponen.',
    persiapanAlat: ['Slip gaji'],
    langkah: [
      { judul: 'Gaji pokok', detail: 'Dasar perhitungan lembur & THR.' },
      { judul: 'Tunjangan', detail: 'Tetap (jabatan) & tidak tetap (transport, makan).' },
      { judul: 'Potongan wajib', detail: 'PPh 21, BPJS Kesehatan 1%, JHT 2%, JP 1%.' },
      { judul: 'Potongan lain', detail: 'Pinjaman, koperasi, absensi.' },
      { judul: 'Take home pay', detail: 'Gaji kotor − semua potongan = yang diterima.' },
    ],
    risiko: [{ risiko: 'Potongan salah', pencegahan: 'Simpan slip tiap bulan. Tanya HRD bila janggal.' }],
    penyelesaian: 'Paham hak & kewajiban gaji.',
    tags: ['gaji', 'slip', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_72: Tutorial[] = [
  {
    id: 'tut-alat-13', slug: 'cara-pakai-bor-listrik', judul: 'Cara Aman Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Takut pakai bor, takut salah.',
    penjelasan: 'Bor = alat putar. Kunci aman: mata bor tepat + kecepatan pas.',
    persiapanAlat: ['Bor listrik', 'Mata bor', 'Kacamata safety'],
    langkah: [
      { judul: 'Pilih mata bor', detail: 'Kayu: mata spiral. Tembok: mata beton + mode hammer.' },
      { judul: 'Tandai titik', detail: 'Titik + lakban agar tidak selip.' },
      { judul: 'Kecepatan rendah dulu', detail: 'Mulai pelan, tekan ringan.' },
      { judul: 'Tegak lurus', detail: 'Bor 90 derajat terhadap permukaan.' },
      { judul: 'Cabut berkala', detail: 'Bersihkan serbuk agar tidak panas.' },
    ],
    risiko: [{ risiko: 'Mata bor patah / kena kabel', pencegahan: 'Pakai kacamata. Cek tidak ada kabel/pipa di balik dinding.' }],
    penyelesaian: 'Lubang rapi untuk gantungan/rak.',
    tags: ['bor', 'alat', 'diy'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_73: Tutorial[] = [
  {
    id: 'tut-perbaikan-14', slug: 'cara-perbaiki-kipas-angin', judul: 'Cara Memperbaiki Kipas Angin Mati Total',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Kipas angin mati total.',
    penjelasan: 'Umumnya: kapasitor lemah, sekring putus, atau bushing seret.',
    persiapanAlat: ['Obeng', 'Multimeter', 'Kapasitor pengganti'],
    langkah: [
      { judul: 'Cek kabel & colokan', detail: 'Pastikan listrik masuk.' },
      { judul: 'Putar manual', detail: 'Seret? Bersihkan & beri pelumas bushing.' },
      { judul: 'Cek kapasitor', detail: 'Baling lemah = kapasitor lemah. Ganti sesuai ukuran.' },
      { judul: 'Cek sekring thermal', detail: 'Putus = ganti (jangan jumper permanen).' },
      { judul: 'Rakit & uji', detail: 'Nyalakan, cek semua kecepatan.' },
    ],
    risiko: [{ risiko: 'Sengatan listrik', pencegahan: 'Cabut colokan sebelum bongkar. Jangan sentuh kapasitor langsung.' }],
    penyelesaian: 'Kipas berputar normal kembali.',
    tags: ['kipas', 'elektronik', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_74: Tutorial[] = [
  {
    id: 'tut-kesehatan-13', slug: 'cara-cegah-asam-urat', judul: 'Cara Mencegah Asam Urat Kambuh',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sendi jempol kaki nyeri berulang.',
    penjelasan: 'Asam urat = kristal urat di sendi. Pemicu: purin tinggi + dehidrasi.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Batasi purin', detail: 'Kurangi jeroan, seafood, daging merah, alkohol.' },
      { judul: 'Banyak minum', detail: '2-3 liter air/hari membantu buang urat.' },
      { judul: 'Jaga berat badan', detail: 'Obesitas menaikkan asam urat.' },
      { judul: 'Hindari fruktosa berlebih', detail: 'Minuman bersoda & bersirup.' },
      { judul: 'Obat bila perlu', detail: 'Allopurinol sesuai resep dokter.' },
    ],
    risiko: [{ risiko: 'Batu ginjal', pencegahan: 'Asam urat tinggi kronis → cek ginjal rutin.' }],
    penyelesaian: 'Sendi bebas nyeri.',
    tags: ['asam-urat', 'sendi', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_75: Tutorial[] = [
  {
    id: 'tut-belajar-14', slug: 'cara-bikin-mind-map', judul: 'Cara Membuat Mind Map yang Efektif',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Catatan panjang sulit diingat.',
    penjelasan: 'Mind map = peta pikiran. Visual + kata kunci = ingatan kuat.',
    persiapanAlat: ['Kertas', 'Spidol warna'],
    langkah: [
      { judul: 'Topik di tengah', detail: 'Tulis topik utama di tengah kertas.' },
      { judul: 'Cabang utama', detail: '5-7 cabang untuk sub-topik.' },
      { judul: 'Kata kunci', detail: '1 kata per cabang, bukan kalimat.' },
      { judul: 'Warna & gambar', detail: 'Warna beda per cabang + gambar sederhana.' },
      { judul: 'Review', detail: 'Baca ulang & ceritakan tanpa melihat.' },
    ],
    risiko: [{ risiko: 'Terlalu ramai', pencegahan: 'Maks 7 cabang utama. Detail di cabang anak.' }],
    penyelesaian: 'Materi kompleks jadi mudah diingat.',
    tags: ['mind-map', 'belajar', 'catatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_76: Tutorial[] = [
  {
    id: 'tut-kerja-14', slug: 'cara-bikin-cv-ats', judul: 'Cara Membuat CV Lolos ATS',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Lamar banyak, tidak ada panggilan.',
    penjelasan: 'ATS = software saring CV. Format salah = tidak terbaca.',
    persiapanAlat: ['Word/Google Docs'],
    langkah: [
      { judul: 'Format sederhana', detail: 'Tanpa tabel/kolom/gambar. Font standar.' },
      { judul: 'Keyword', detail: 'Salin kata kunci dari iklan lowongan.' },
      { judul: 'Judul jelas', detail: '"Pengalaman Kerja", bukan "Perjalananku".' },
      { judul: 'File PDF/DOCX', detail: 'Ikuti permintaan. Nama file: Nama-Posisi.pdf.' },
      { judul: '1-2 halaman', detail: 'Relevan saja. Terlalu panjang = dilewat.' },
    ],
    risiko: [{ risiko: 'CV kreatif ditolak ATS', pencegahan: 'Punya 2 versi: ATS-friendly & kreatif (untuk email langsung).' }],
    penyelesaian: 'CV terbaca sistem & HRD.',
    tags: ['cv', 'ats', 'lamar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_77: Tutorial[] = [
  {
    id: 'tut-mental-17', slug: 'cara-hadapi-kecemasan', judul: 'Cara Menghadapi Kecemasan Berlebih',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Cemas terus tentang hal yang belum terjadi.',
    penjelasan: 'Kecemasan = alarm palsu otak. Bisa dilatih tenang.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Grounding 5-4-3-2-1', detail: 'Sebut 5 yang dilihat, 4 didengar, 3 disentuh, 2 dicium, 1 dirasa.' },
      { judul: 'Napas kotak', detail: 'Tarik 4 detik, tahan 4, hembus 4, tahan 4.' },
      { judul: 'Tulis kekhawatiran', detail: 'Tulis + tanya: "bukti nyatanya apa?"' },
      { judul: 'Batasi kafein & begadang', detail: 'Keduanya memperparah cemas.' },
      { judul: 'Gerak', detail: 'Jalan 20 menit menurunkan kortisol.' },
    ],
    risiko: [{ risiko: 'Gangguan cemas', pencegahan: 'Bila cemas mengganggu fungsi harian >2 minggu, konsultasi profesional.' }],
    penyelesaian: 'Tenang & bisa berpikir jernih.',
    tags: ['cemas', 'mental', 'grounding'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_78: Tutorial[] = [
  {
    id: 'tut-umkm-14', slug: 'cara-hitung-hpp', judul: 'Cara Menghitung HPP Produk',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Jualan laris tapi tidak untung.',
    penjelasan: 'HPP = Harga Pokok Produksi. Tanpa HPP, harga jual = tebak-tebakan.',
    persiapanAlat: ['Kalkulator', 'Catatan biaya'],
    langkah: [
      { judul: 'Bahan baku', detail: 'Total biaya bahan per batch / jumlah unit.' },
      { judul: 'Tenaga kerja', detail: 'Upah per unit (termasuk waktu sendiri).' },
      { judul: 'Overhead', detail: 'Listrik, gas, sewa, kemasan — alokasikan per unit.' },
      { judul: 'Total HPP', detail: 'Bahan + tenaga + overhead per unit.' },
      { judul: 'Harga jual', detail: 'HPP × (1 + margin). Margin UMKM sehat: 30-50%.' },
    ],
    risiko: [{ risiko: 'Lupa biaya tersembunyi', pencegahan: 'Catat SEMUA: ongkir, kemasan, retur, sampel.' }],
    penyelesaian: 'Harga jual tepat, untung jelas.',
    tags: ['hpp', 'umkm', 'harga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_79: Tutorial[] = [
  {
    id: 'tut-teknologi-14', slug: 'cara-backup-data', judul: 'Cara Backup Data Penting',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'HP hilang/rusak = semua data hilang.',
    penjelasan: 'Aturan 3-2-1: 3 salinan, 2 media, 1 di luar lokasi.',
    persiapanAlat: ['Akun cloud', 'Flashdisk/HDD eksternal'],
    langkah: [
      { judul: 'Pilih yang penting', detail: 'Foto, dokumen, kontak, chat penting.' },
      { judul: 'Cloud otomatis', detail: 'Google Photos, iCloud, Google Drive — nyalakan sinkron.' },
      { judul: 'Backup lokal', detail: 'Salin ke HDD eksternal tiap bulan.' },
      { judul: 'Enkripsi sensitif', detail: 'Dokumen penting: zip dengan password.' },
      { judul: 'Uji restore', detail: 'Coba kembalikan 1 file — pastikan bisa.' },
    ],
    risiko: [{ risiko: 'Ransomware', pencegahan: 'Backup offline yang tidak selalu tersambung.' }],
    penyelesaian: 'Data aman dari kehilangan.',
    tags: ['backup', 'data', 'cloud'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_80: Tutorial[] = [
  {
    id: 'tut-kehidupan-16', slug: 'cara-pindah-rumah', judul: 'Cara Pindah Rumah Tanpa Ribet',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Pindahan berantakan & melelahkan.',
    penjelasan: 'Pindahan = proyek logistik. Rencana matang = hemat waktu & biaya.',
    persiapanAlat: ['Kardus', 'Lakban', 'Spidol'],
    langkah: [
      { judul: 'Sortir 2 minggu sebelum', detail: 'Buang/sumbang yang tidak dipakai.' },
      { judul: 'Packing per ruangan', detail: 'Labeli tiap kardus: isi + ruangan tujuan.' },
      { judul: 'Box esensial', detail: '1 box: dokumen, charger, obat, baju 2 hari.' },
      { judul: 'Pilih jasa', detail: 'Bandingkan 3 jasa pindahan. Asuransi untuk barang mahal.' },
      { judul: 'Hari-H', detail: 'Foto meteran listrik/air lama & baru.' },
    ],
    risiko: [{ risiko: 'Barang rusak/hilang', pencegahan: 'Foto barang berharga. Awasi bongkar muat.' }],
    penyelesaian: 'Pindah dengan tenang.',
    tags: ['pindahan', 'rumah', 'logistik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_81: Tutorial[] = [
  {
    id: 'tut-perbaikan-15', slug: 'cara-perbaiki-resleting', judul: 'Cara Memperbaiki Resleting Macet',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Resleting macet/tidak mau menutup.',
    penjelasan: 'Umumnya: kotor, kering, atau slider longgar.',
    persiapanAlat: ['Lilin/sabun', 'Tang kecil'],
    langkah: [
      { judul: 'Bersihkan', detail: 'Sikat kotoran di gigi resleting.' },
      { judul: 'Lumasi', detail: 'Oles lilin/sabun di sepanjang gigi.' },
      { judul: 'Gerakkan pelan', detail: 'Tarik-turun perlahan, jangan paksa.' },
      { judul: 'Kencangkan slider', detail: 'Jepit slider dengan tang bila longgar.' },
      { judul: 'Ganti bila rusak', detail: 'Gigi patah = ganti resleting.' },
    ],
    risiko: [{ risiko: 'Kain robek', pencegahan: 'Jangan tarik paksa saat macet.' }],
    penyelesaian: 'Resleting lancar kembali.',
    tags: ['resleting', 'perbaikan', 'pakaian'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_82: Tutorial[] = [
  {
    id: 'tut-kesehatan-14', slug: 'cara-turunkan-demam', judul: 'Cara Menurunkan Demam di Rumah',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Demam 38-39°C, belum bisa ke dokter.',
    penjelasan: 'Demam = respons imun. Tangani gejala, waspadai tanda bahaya.',
    persiapanAlat: ['Termometer', 'Paracetamol'],
    langkah: [
      { judul: 'Ukur suhu', detail: 'Demam = ≥38°C.' },
      { judul: 'Kompres hangat', detail: 'Dahi, ketiak, lipat paha. Bukan air dingin/es.' },
      { judul: 'Banyak cairan', detail: 'Air, oralit, sup hangat.' },
      { judul: 'Paracetamol', detail: 'Sesuai dosis kemasan. Jangan aspirin untuk anak.' },
      { judul: 'Istirahat', detail: 'Jangan selimuti tebal.' },
    ],
    risiko: [{ risiko: 'Tanda bahaya', pencegahan: 'Ke IGD bila: >3 hari, kejang, sesak, ruam, dehidrasi.' }],
    penyelesaian: 'Demam turun atau tertangani medis.',
    tags: ['demam', 'kesehatan', 'pertolongan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_83: Tutorial[] = [
  {
    id: 'tut-alat-14', slug: 'cara-pakai-mesin-cuci', judul: 'Cara Merawat Mesin Cuci',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mesin cuci bau & cepat rusak.',
    penjelasan: 'Mesin cuci butuh perawatan rutin agar awet 10+ tahun.',
    persiapanAlat: ['Cuka', 'Baking soda'],
    langkah: [
      { judul: 'Jangan overload', detail: 'Isi 3/4 tabung. Overload = motor cepat rusak.' },
      { judul: 'Deterjen secukupnya', detail: 'Berlebih = residu & bau.' },
      { judul: 'Tub clean bulanan', detail: 'Jalankan mode pembersih + cuka.' },
      { judul: 'Buka pintu setelah cuci', detail: 'Cegah jamur & bau apek.' },
      { judul: 'Cek filter', detail: 'Bersihkan filter serat tiap 2 minggu.' },
    ],
    risiko: [{ risiko: 'Bocor', pencegahan: 'Cek selang tiap 6 bulan. Matikan keran bila lama pergi.' }],
    penyelesaian: 'Mesin cuci awet & bersih.',
    tags: ['mesin-cuci', 'rumah', 'perawatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_84: Tutorial[] = [
  {
    id: 'tut-mental-18', slug: 'cara-bangun-pagi', judul: 'Cara Konsisten Bangun Pagi',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Alarm bunyi 5x, tetap bangun siang.',
    penjelasan: 'Bangun pagi = kebiasaan tidur, bukan kemauan.',
    persiapanAlat: ['Alarm'],
    langkah: [
      { judul: 'Tidur cukup', detail: '7-8 jam. Mundurkan jam tidur bertahap 15 mnt/hari.' },
      { judul: 'Alarm jauh', detail: 'Taruh HP jauh dari kasur — harus bangun mematikan.' },
      { judul: 'Cahaya pagi', detail: 'Buka gorden / lampu terang segera.' },
      { judul: 'Ritual pagi', detail: 'Air putih + gerak ringan + sarapan.' },
      { judul: 'Konsisten weekend', detail: 'Jangan begadang di akhir pekan.' },
    ],
    risiko: [{ risiko: 'Kurang tidur kronis', pencegahan: 'Bangun pagi tanpa cukup tidur = tidak sehat. Prioritaskan durasi.' }],
    penyelesaian: 'Bangun pagi jadi otomatis.',
    tags: ['bangun-pagi', 'kebiasaan', 'tidur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_85: Tutorial[] = [
  {
    id: 'tut-keuangan-14', slug: 'cara-atur-gaji-ump', judul: 'Cara Mengatur Gaji UMP/UMR',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gaji UMP habis sebelum akhir bulan.',
    penjelasan: 'Gaji kecil butuh strategi ketat: 50-30-20 dimodifikasi.',
    persiapanAlat: ['Buku catatan'],
    langkah: [
      { judul: 'Catat semua', detail: '1 bulan penuh catat tiap rupiah.' },
      { judul: '50% kebutuhan', detail: 'Makan, kos, transport, pulsa.' },
      { judul: '20% tabungan', detail: 'Pisahkan di awal, bukan sisa.' },
      { judul: '30% keinginan', detail: 'Batasi. Nongkrong = budget.' },
      { judul: 'Side income', detail: 'Cari tambahan: freelance, jualan.' },
    ],
    risiko: [{ risiko: 'Gali lubang tutup lubang', pencegahan: 'Pinjol = jebakan. Potong keinginan dulu.' }],
    penyelesaian: 'Gaji cukup sampai gajian berikut.',
    tags: ['gaji', 'ump', 'budget'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_86: Tutorial[] = [
  {
    id: 'tut-teknologi-15', slug: 'cara-kenali-phishing', judul: 'Cara Mengenali Phishing',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Banyak pesan penipuan mengatasnamakan bank.',
    penjelasan: 'Phishing = pancingan. Pelaku meniru institusi resmi untuk mencuri data.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cek pengirim', detail: 'Email resmi pakai domain resmi, bukan gmail acak.' },
      { judul: 'Jangan klik panik', detail: '"Akun diblokir!" = taktik menakut-nakuti.' },
      { judul: 'Hover link', detail: 'Arahkan kursor: lihat URL asli sebelum klik.' },
      { judul: 'Jangan beri OTP', detail: 'Bank TIDAK PERNAH minta OTP/password.' },
      { judul: 'Verifikasi mandiri', detail: 'Hubungi call center resmi, bukan nomor di pesan.' },
    ],
    risiko: [{ risiko: 'Rekening dikuras', pencegahan: 'Aktifkan notifikasi transaksi. Lapor bank bila sudah terlanjur.' }],
    penyelesaian: 'Aman dari penipuan digital.',
    tags: ['phishing', 'keamanan', 'penipuan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_87: Tutorial[] = [
  {
    id: 'tut-umkm-15', slug: 'cara-foto-produk-hp', judul: 'Cara Foto Produk Pakai HP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Foto produk buram & tidak menarik.',
    penjelasan: 'Foto bagus = cahaya + background + angle. HP cukup.',
    persiapanAlat: ['HP', 'Kertas putih', 'Lampu'],
    langkah: [
      { judul: 'Cahaya alami', detail: 'Dekat jendela pagi/sore. Hindari flash.' },
      { judul: 'Background bersih', detail: 'Kertas putih/kain polos.' },
      { judul: 'Angle bervariasi', detail: 'Depan, 45°, atas, detail.' },
      { judul: 'Fokus & stabil', detail: 'Tap fokus. Tangan stabil / tripod.' },
      { judul: 'Edit ringan', detail: 'Cerahkan + crop. Jangan filter berlebihan.' },
    ],
    risiko: [{ risiko: 'Foto tidak sesuai asli', pencegahan: 'Warna harus akurat — hindari komplain.' }],
    penyelesaian: 'Foto produk siap upload.',
    tags: ['foto', 'umkm', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_88: Tutorial[] = [
  {
    id: 'tut-kehidupan-17', slug: 'cara-atur-keuangan-keluarga', judul: 'Cara Mengatur Keuangan Keluarga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Suami-istri sering ribut soal uang.',
    penjelasan: 'Keuangan keluarga = tim. Transparan + sistem = damai.',
    persiapanAlat: ['Rekening bersama'],
    langkah: [
      { judul: 'Transparan penuh', detail: 'Saling tahu penghasilan & utang.' },
      { judul: 'Budget bersama', detail: 'Susun tiap awal bulan berdua.' },
      { judul: 'Dana darurat keluarga', detail: '6x pengeluaran bulanan.' },
      { judul: 'Uang saku masing-masing', detail: 'Bebas dipakai tanpa lapor.' },
      { judul: 'Evaluasi bulanan', detail: 'Review 30 menit tiap akhir bulan.' },
    ],
    risiko: [{ risiko: 'Utang tersembunyi', pencegahan: 'Jujur soal utang. Selesaikan bersama.' }],
    penyelesaian: 'Keuangan sehat, rumah tangga harmonis.',
    tags: ['keluarga', 'keuangan', 'budget'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_89: Tutorial[] = [
  {
    id: 'tut-perbaikan-16', slug: 'cara-ganti-lampu', judul: 'Cara Mengganti Lampu & Saklar',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Lampu mati / saklar rusak.',
    penjelasan: 'Pekerjaan listrik ringan — asal matikan MCB dulu.',
    persiapanAlat: ['Lampu baru', 'Obeng', 'Tespen'],
    langkah: [
      { judul: 'Matikan MCB', detail: 'WAJIB. Tes dengan tespen untuk memastikan.' },
      { judul: 'Lepas lampu lama', detail: 'Putar / tarik sesuai jenis fitting.' },
      { judul: 'Pasang lampu baru', detail: 'Sesuai watt & fitting.' },
      { judul: 'Ganti saklar', detail: 'Foto kabel dulu, pasang sama persis.' },
      { judul: 'Nyalakan & uji', detail: 'MCB on, tes saklar.' },
    ],
    risiko: [{ risiko: 'Sengatan listrik', pencegahan: 'Jangan kerjakan saat MCB on. Bila ragu, panggil tukang.' }],
    penyelesaian: 'Lampu menyala normal.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_90: Tutorial[] = [
  {
    id: 'tut-kerja-15', slug: 'cara-negosiasi-gaji', judul: 'Cara Negosiasi Gaji Saat Interview',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ditawari gaji di bawah ekspektasi.',
    penjelasan: 'Negosiasi = wajar. Siapkan data, bukan emosi.',
    persiapanAlat: ['Riset gaji pasar'],
    langkah: [
      { judul: 'Riset dulu', detail: 'Cek range gaji posisi & kotamu.' },
      { judul: 'Jangan sebut duluan', detail: 'Biarkan HRD menyebut angka dulu.' },
      { judul: 'Beri range', detail: '"Ekspektasi saya 6-7 juta" — bukan angka mati.' },
      { judul: 'Justifikasi', detail: 'Sebutkan skill & pencapaian.' },
      { judul: 'Negosiasi total paket', detail: 'Gaji + tunjangan + WFH + cuti.' },
    ],
    risiko: [{ risiko: 'Kehilangan tawaran', pencegahan: 'Tetap sopan. Jangan ultimatum bila tidak siap mundur.' }],
    penyelesaian: 'Gaji sesuai nilai pasarmu.',
    tags: ['gaji', 'negosiasi', 'interview'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_91: Tutorial[] = [
  {
    id: 'tut-belajar-15', slug: 'cara-fokus-belajar', judul: 'Cara Fokus Belajar Tanpa Gangguan HP',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Baru buka buku 5 menit, sudah pegang HP.',
    penjelasan: 'Fokus = otot. Latih dengan teknik Pomodoro + lingkungan.',
    persiapanAlat: ['Timer'],
    langkah: [
      { judul: 'Pomodoro', detail: '25 menit fokus, 5 menit istirahat. 4x = istirahat panjang.' },
      { judul: 'HP jauh', detail: 'Mode pesawat / taruh di ruangan lain.' },
      { judul: 'Satu tugas', detail: 'Tulis 1 target sesi ini.' },
      { judul: 'Lingkungan', detail: 'Meja rapi, cahaya cukup, sepi.' },
      { judul: 'Catat distraksi', detail: 'Pikiran muncul? Tulis, lanjutkan nanti.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Istirahat = bagian dari belajar. Tidur cukup.' }],
    penyelesaian: 'Belajar efektif 2-3 jam/hari.',
    tags: ['fokus', 'belajar', 'pomodoro'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_92: Tutorial[] = [
  {
    id: 'tut-mental-19', slug: 'cara-hadapi-kegagalan', judul: 'Cara Bangkit dari Kegagalan',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gagal ujian/bisnis/lamaran — ingin menyerah.',
    penjelasan: 'Gagal = data, bukan identitas. Semua orang sukses pernah gagal.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Rasakan dulu', detail: 'Kecewa itu wajar. Beri waktu 1-3 hari.' },
      { judul: 'Pisahkan fakta & cerita', detail: '"Gagal ujian" ≠ "saya bodoh".' },
      { judul: 'Analisis', detail: 'Apa yang salah? Apa yang bisa diubah?' },
      { judul: 'Rencana baru', detail: '1 langkah kecil mulai besok.' },
      { judul: 'Cari dukungan', detail: 'Cerita ke orang yang mendukung.' },
    ],
    risiko: [{ risiko: 'Menyerah total', pencegahan: 'Istirahat ≠ berhenti. Kembali saat siap.' }],
    penyelesaian: 'Bangkit dengan pelajaran baru.',
    tags: ['gagal', 'bangkit', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_93: Tutorial[] = [
  {
    id: 'tut-umkm-16', slug: 'cara-daftar-nib', judul: 'Cara Daftar NIB Online',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Usaha belum punya izin resmi.',
    penjelasan: 'NIB = Nomor Induk Berusaha. Syarat legalitas UMKM via OSS.',
    persiapanAlat: ['KTP', 'NPWP (bila ada)'],
    langkah: [
      { judul: 'Buka OSS', detail: 'oss.go.id → daftar akun.' },
      { judul: 'Isi data usaha', detail: 'Nama, alamat, bidang usaha (KBLI).' },
      { judul: 'Pilih skala', detail: 'Mikro/kecil/menengah.' },
      { judul: 'Terbit NIB', detail: 'Otomatis bila data lengkap.' },
      { judul: 'Cetak & simpan', detail: 'Unduh sertifikat NIB.' },
    ],
    risiko: [{ risiko: 'KBLI salah', pencegahan: 'Pilih KBLI sesuai kegiatan usaha sebenarnya.' }],
    penyelesaian: 'Usaha berizin resmi.',
    tags: ['nib', 'oss', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_94: Tutorial[] = [
  {
    id: 'tut-kehidupan-18', slug: 'cara-hemat-listrik', judul: 'Cara Menghemat Tagihan Listrik',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tagihan listrik membengkak.',
    penjelasan: 'Boros listrik = boros uang. Audit & ubah kebiasaan.',
    persiapanAlat: ['Tagihan listrik'],
    langkah: [
      { judul: 'Cek pemakaian', detail: 'Bandingkan kWh 3 bulan terakhir.' },
      { judul: 'Ganti LED', detail: 'Hemat 80% dibanding pijar.' },
      { judul: 'Cabut standby', detail: 'TV, charger, dispenser — cabut bila tidak dipakai.' },
      { judul: 'AC bijak', detail: '25-26°C + timer. Bersihkan filter.' },
      { judul: 'Jam hemat', detail: 'Setrika & pompa di luar jam beban puncak.' },
    ],
    risiko: [{ risiko: 'MCB jeglek', pencegahan: 'Jangan nyalakan semua alat berat bersamaan.' }],
    penyelesaian: 'Tagihan turun 20-30%.',
    tags: ['listrik', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_95: Tutorial[] = [
  {
    id: 'tut-perbaikan-17', slug: 'cara-tambal-panci', judul: 'Cara Menambal Panci Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Panci bocor kecil.',
    penjelasan: 'Bocor kecil bisa ditambal sementara — tapi ganti bila parah.',
    persiapanAlat: ['Lem besi/epoxy', 'Amplas'],
    langkah: [
      { judul: 'Bersihkan area', detail: 'Amplas & keringkan sekitar lubang.' },
      { judul: 'Oles lem besi', detail: 'Campur & oleskan menutup lubang.' },
      { judul: 'Tunggu kering', detail: '24 jam sebelum dipakai.' },
      { judul: 'Uji', detail: 'Isi air, cek tidak rembes.' },
      { judul: 'Batasi', detail: 'Tambalan = sementara. Ganti panci bila bocor besar.' },
    ],
    risiko: [{ risiko: 'Lem terkelupas', pencegahan: 'Jangan untuk masak asam/panas ekstrem.' }],
    penyelesaian: 'Panci bisa dipakai lagi sementara.',
    tags: ['panci', 'dapur', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_96: Tutorial[] = [
  {
    id: 'tut-kesehatan-15', slug: 'cara-jaga-kesehatan-mata', judul: 'Cara Menjaga Kesehatan Mata',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mata lelah & minus bertambah.',
    penjelasan: 'Mata butuh istirahat & nutrisi. Aturan 20-20-20.',
    persiapanAlat: [],
    langkah: [
      { judul: '20-20-20', detail: 'Tiap 20 menit, lihat 20 kaki (6m) selama 20 detik.' },
      { judul: 'Cahaya cukup', detail: 'Jangan baca di gelap / silau.' },
      { judul: 'Jarak aman', detail: 'HP 30-40 cm, monitor 50-70 cm.' },
      { judul: 'Nutrisi', detail: 'Vitamin A, lutein: wortel, bayam, telur.' },
      { judul: 'Cek rutin', detail: 'Periksa mata tiap 1-2 tahun.' },
    ],
    risiko: [{ risiko: 'Minus bertambah cepat', pencegahan: 'Batasi screen time anak. Main di luar ruangan.' }],
    penyelesaian: 'Mata sehat & nyaman.',
    tags: ['mata', 'kesehatan', 'layar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_97: Tutorial[] = [
  {
    id: 'tut-alat-15', slug: 'cara-pakai-multimeter', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Punya multimeter tapi tidak bisa pakai.',
    penjelasan: 'Multimeter = ukur tegangan, arus, hambatan. Alat wajib tukang & hobi elektronik.',
    persiapanAlat: ['Multimeter digital'],
    langkah: [
      { judul: 'Kenali probe', detail: 'Merah (+), hitam (-) / COM.' },
      { judul: 'Ukur tegangan', detail: 'Putar ke V, tempel paralel ke sumber.' },
      { judul: 'Ukur hambatan', detail: 'Putar ke Ω, pastikan tidak ada tegangan.' },
      { judul: 'Ukur arus', detail: 'Putar ke A, rangkai SERI. Hati-hati!' },
      { judul: 'Continuity', detail: 'Mode bunyi untuk cek kabel putus.' },
    ],
    risiko: [{ risiko: 'Korsleting / rusak', pencegahan: 'Jangan ukur arus paralel. Mulai dari range terbesar.' }],
    penyelesaian: 'Bisa diagnosis listrik dasar.',
    tags: ['multimeter', 'listrik', 'elektronik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_98: Tutorial[] = [
  {
    id: 'tut-mental-20', slug: 'cara-kelola-stres', judul: 'Cara Mengelola Stres Sehari-hari',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Stres menumpuk: kerja, keluarga, keuangan.',
    penjelasan: 'Stres = respons normal. Kelola sumbernya, bukan gejalanya.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Identifikasi sumber', detail: 'Tulis 3 hal paling menekan.' },
      { judul: 'Pisahkan kontrol', detail: 'Fokus yang bisa diubah. Lepaskan yang tidak.' },
      { judul: 'Jadwal istirahat', detail: 'Micro-break tiap 90 menit.' },
      { judul: 'Gerak & tidur', detail: '2 senjata utama anti-stres.' },
      { judul: 'Bicara', detail: 'Curhat ke orang terpercaya.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Stres kronis → kelelahan total. Ambil cuti bila perlu.' }],
    penyelesaian: 'Stres terkendali, hidup seimbang.',
    tags: ['stres', 'mental', 'seimbang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_99: Tutorial[] = [
  {
    id: 'tut-keuangan-15', slug: 'cara-hindari-pinjol', judul: 'Cara Terhindar dari Jerat Pinjol',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Terlilit pinjol, bunga membengkak.',
    penjelasan: 'Pinjol ilegal = bunga >100%/tahun + teror debt collector.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cek legalitas', detail: 'Pastikan terdaftar OJK. Cek di ojk.go.id.' },
      { judul: 'Jangan gali lubang', detail: 'Pinjam baru untuk bayar lama = jebakan.' },
      { judul: 'Negosiasi', detail: 'Minta restrukturisasi ke pinjol legal.' },
      { judul: 'Lapor', detail: 'Pinjol ilegal: lapor OJK 157 / polisi.' },
      { judul: 'Blokir teror', detail: 'Jangan takut ancaman — itu ilegal.' },
    ],
    risiko: [{ risiko: 'Data disebar', pencegahan: 'Jangan beri akses kontak. Lapor bila disebar.' }],
    penyelesaian: 'Bebas dari jerat pinjol.',
    tags: ['pinjol', 'utang', 'ojk'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_100: Tutorial[] = [
  {
    id: 'tut-belajar-16', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat (Speed Reading)',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bahan bacaan menumpuk, waktu terbatas.',
    penjelasan: 'Speed reading = kurangi subvokalisasi & regresi.',
    persiapanAlat: ['Buku', 'Timer'],
    langkah: [
      { judul: 'Pratinjau', detail: 'Baca judul, subjudul, kesimpulan dulu.' },
      { judul: 'Jari penunjuk', detail: 'Ikuti baris dengan jari untuk pacu mata.' },
      { judul: 'Kurangi suara dalam', detail: 'Jangan ucapkan tiap kata.' },
      { judul: 'Chunking', detail: 'Tangkap 3-4 kata sekali lihat.' },
      { judul: 'Latihan harian', detail: '15 menit/hari dengan timer.' },
    ],
    risiko: [{ risiko: 'Pemahaman turun', pencegahan: 'Untuk teks teknis, tetap baca lambat.' }],
    penyelesaian: 'Kecepatan baca naik 2x dengan pemahaman terjaga.',
    tags: ['baca', 'belajar', 'cepat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_101: Tutorial[] = [
  {
    id: 'tut-kerja-15', slug: 'cara-minta-naik-gaji', judul: 'Cara Meminta Kenaikan Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Gaji stagnan bertahun-tahun.',
    penjelasan: 'Naik gaji = negosiasi berbasis nilai, bukan keluhan.',
    persiapanAlat: ['Data pencapaian', 'Riset gaji pasar'],
    langkah: [
      { judul: 'Kumpulkan bukti', detail: 'Catat kontribusi & hasil kerjamu.' },
      { judul: 'Riset pasar', detail: 'Bandingkan gaji posisi serupa.' },
      { judul: 'Pilih momen', detail: 'Setelah pencapaian besar / review tahunan.' },
      { judul: 'Sampaikan profesional', detail: 'Fokus nilai, bukan kebutuhan pribadi.' },
      { judul: 'Siap ditolak', detail: 'Minta feedback & timeline berikutnya.' },
    ],
    risiko: [{ risiko: 'Dianggap tidak loyal', pencegahan: 'Sampaikan dengan sopan & data, bukan ancaman resign.' }],
    penyelesaian: 'Gaji naik atau jalur jelas ke depan.',
    tags: ['gaji', 'karier', 'negosiasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_102: Tutorial[] = [
  {
    id: 'tut-teknologi-15', slug: 'cara-amankan-akun', judul: 'Cara Mengamankan Akun Digital',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Akun diretas / dibobol.',
    penjelasan: 'Keamanan akun = password kuat + 2FA + waspada phishing.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Aktifkan 2FA', detail: 'Di semua akun penting: email, bank, sosmed.' },
      { judul: 'Password manager', detail: 'Satu password kuat per akun, simpan di manager.' },
      { judul: 'Cek phishing', detail: 'Jangan klik link mencurigakan. Cek domain.' },
      { judul: 'Backup code', detail: 'Simpan kode pemulihan di tempat aman.' },
      { judul: 'Audit berkala', detail: 'Cek sesi aktif & hapus perangkat asing.' },
    ],
    risiko: [{ risiko: 'Kehilangan akses', pencegahan: 'Jangan bagikan OTP ke SIAPAPUN.' }],
    penyelesaian: 'Akun aman berlapis.',
    tags: ['keamanan', 'akun', '2fa'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_103: Tutorial[] = [
  {
    id: 'tut-umkm-17', slug: 'cara-foto-produk-hp', judul: 'Cara Foto Produk dengan HP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Foto produk jelek, pembeli tidak tertarik.',
    penjelasan: 'Foto bagus = 70% keputusan beli online.',
    persiapanAlat: ['HP', 'Kertas putih', 'Lampu'],
    langkah: [
      { judul: 'Background putih', detail: 'Kertas/kain putih sebagai alas.' },
      { judul: 'Cahaya alami', detail: 'Dekat jendela, pagi/sore. Hindari flash.' },
      { judul: 'Sudut 45°', detail: 'Tampilkan bentuk & detail produk.' },
      { judul: 'Fokus tajam', detail: 'Tap layar di produk, kunci fokus.' },
      { judul: 'Edit ringan', detail: 'Terang & kontras secukupnya. Jangan berlebihan.' },
    ],
    risiko: [{ risiko: 'Warna tidak akurat', pencegahan: 'Jangan oversaturasi. Cantumkan disclaimer warna.' }],
    penyelesaian: 'Foto produk menarik pembeli.',
    tags: ['foto', 'produk', 'jualan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_104: Tutorial[] = [
  {
    id: 'tut-kesehatan-16', slug: 'cara-turunkan-kolesterol', judul: 'Cara Menurunkan Kolesterol',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Kolesterol tinggi, risiko jantung.',
    penjelasan: 'LDL tinggi = plak pembuluh. Target LDL <100 mg/dL.',
    persiapanAlat: ['Hasil lab'],
    langkah: [
      { judul: 'Kurangi gorengan', detail: 'Ganti kukus/rebus/panggang.' },
      { judul: 'Serat larut', detail: 'Oat, apel, kacang-kacangan.' },
      { judul: 'Olahraga 150 mnt/minggu', detail: 'Jalan cepat, bersepeda.' },
      { judul: 'Hindari rokok & alkohol', detail: 'Keduanya merusak pembuluh.' },
      { judul: 'Kontrol rutin', detail: 'Cek lipid tiap 6-12 bulan.' },
    ],
    risiko: [{ risiko: 'Serangan jantung', pencegahan: 'Kolesterol >240 = konsultasi dokter, mungkin perlu obat.' }],
    penyelesaian: 'Kolesterol terkendali.',
    tags: ['kolesterol', 'jantung', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_105: Tutorial[] = [
  {
    id: 'tut-perbaikan-18', slug: 'cara-service-ac', judul: 'Cara Service AC Sendiri',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'AC tidak dingin, bau apek.',
    penjelasan: '90% AC tidak dingin = filter kotor. Cuci sendiri tiap 3 bulan.',
    persiapanAlat: ['Tangga', 'Sikat', 'Air sabun'],
    langkah: [
      { judul: 'Matikan listrik', detail: 'Cabut steker / matikan MCB.' },
      { judul: 'Buka cover', detail: 'Angkat panel depan indoor.' },
      { judul: 'Cuci filter', detail: 'Lepas, sikat, bilas, keringkan.' },
      { judul: 'Bersihkan sirip', detail: 'Sikat lembut + semprot air.' },
      { judul: 'Cek drainase', detail: 'Pastikan selang tidak mampet.' },
    ],
    risiko: [{ risiko: 'Korsleting', pencegahan: 'Jangan semprot bagian elektrik. Service besar → teknisi.' }],
    penyelesaian: 'AC dingin & segar kembali.',
    tags: ['ac', 'service', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_106: Tutorial[] = [
  {
    id: 'tut-alat-16', slug: 'cara-pakai-bor-listrik', judul: 'Cara Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Perlu pasang rak/foto tapi takut pakai bor.',
    penjelasan: 'Bor = alat serbaguna. Kunci: mata bor tepat & pegangan stabil.',
    persiapanAlat: ['Bor listrik', 'Mata bor', 'Pensil', 'Fischer'],
    langkah: [
      { judul: 'Tandai titik', detail: 'Ukur & tandai dengan pensil.' },
      { judul: 'Pilih mata bor', detail: 'Beton → masonry, kayu → twist.' },
      { judul: 'Bor perlahan', detail: 'Tekan ringan, biarkan mata bekerja.' },
      { judul: 'Pasang fischer', detail: 'Masukkan fischer, lalu sekrup.' },
      { judul: 'Uji kekuatan', detail: 'Goyang perlahan sebelum digantung.' },
    ],
    risiko: [{ risiko: 'Kena kabel/pipa', pencegahan: 'Hindari area dekat stopkontak. Pakai detektor bila ada.' }],
    penyelesaian: 'Rak/foto terpasang kokoh.',
    tags: ['bor', 'tukang', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_107: Tutorial[] = [
  {
    id: 'tut-kehidupan-19', slug: 'cara-pindah-rumah', judul: 'Cara Pindah Rumah Tanpa Stres',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Pindahan berantakan, barang rusak/hilang.',
    penjelasan: 'Pindahan = proyek logistik. Rencana 2 minggu sebelumnya.',
    persiapanAlat: ['Kardus', 'Lakban', 'Spidol', 'Bubble wrap'],
    langkah: [
      { judul: 'Sortir H-14', detail: 'Buang/sumbangkan yang tidak perlu.' },
      { judul: 'Packing per ruangan', detail: 'Label tiap kardus: ruangan + isi.' },
      { judul: 'Dokumen penting', detail: 'Pisahkan di tas khusus, bawa sendiri.' },
      { judul: 'Sewa armada', detail: 'Sesuaikan dengan volume barang.' },
      { judul: 'Unpacking prioritas', detail: 'Dapur & kamar dulu, sisanya bertahap.' },
    ],
    risiko: [{ risiko: 'Barang pecah', pencegahan: 'Wrap barang pecah belah. Tulis FRAGILE.' }],
    penyelesaian: 'Pindahan rapi & tenang.',
    tags: ['pindah', 'rumah', 'logistik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_108: Tutorial[] = [
  {
    id: 'tut-mental-21', slug: 'cara-atasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran tidak berhenti, cemas berlebihan.',
    penjelasan: 'Overthinking = simulasi bencana yang tidak terjadi.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Tulis kekhawatiran', detail: 'Keluarkan dari kepala ke kertas.' },
      { judul: 'Uji fakta', detail: 'Bukti apa yang mendukung/tidak?' },
      { judul: 'Batasi waktu khawatir', detail: '15 menit/hari, selebihnya stop.' },
      { judul: 'Fokus aksi', detail: 'Satu langkah kecil yang bisa dilakukan.' },
      { judul: 'Grounding 5-4-3-2-1', detail: 'Sebut 5 yang dilihat, 4 didengar, dst.' },
    ],
    risiko: [{ risiko: 'Gangguan cemas', pencegahan: 'Bila mengganggu fungsi harian → psikolog.' }],
    penyelesaian: 'Pikiran tenang & terkendali.',
    tags: ['overthinking', 'cemas', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_109: Tutorial[] = [
  {
    id: 'tut-kerja-16', slug: 'cara-hadapi-bos-sulit', judul: 'Cara Menghadapi Atasan yang Sulit',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Atasan galak / tidak adil.',
    penjelasan: 'Hadapi dengan strategi, bukan emosi.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Pahami polanya', detail: 'Catat kapan & kenapa ia marah.' },
      { judul: 'Komunikasi tertulis', detail: 'Instruksi penting → minta via chat/email.' },
      { judul: 'Jangan baper', detail: 'Pisahkan kritik kerja vs pribadi.' },
      { judul: 'Cari sekutu', detail: 'Bangun relasi dengan tim & atasan lain.' },
      { judul: 'Rencana keluar', detail: 'Bila toxic parah: siapkan pindah divisi/kerja.' },
    ],
    risiko: [{ risiko: 'Kesehatan mental', pencegahan: 'Jangan bertahan di lingkungan toxic terlalu lama.' }],
    penyelesaian: 'Kerja tetap profesional & waras.',
    tags: ['atasan', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_110: Tutorial[] = [
  {
    id: 'tut-teknologi-16', slug: 'cara-backup-hp', judul: 'Cara Backup Data HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'HP hilang/rusak, data ikut hilang.',
    penjelasan: 'Backup = asuransi data. 3-2-1: 3 salinan, 2 media, 1 offsite.',
    persiapanAlat: ['HP', 'Akun Google/iCloud'],
    langkah: [
      { judul: 'Aktifkan backup cloud', detail: 'Google One / iCloud backup otomatis.' },
      { judul: 'Foto & video', detail: 'Google Photos / iCloud Photos.' },
      { judul: 'Chat penting', detail: 'Backup WhatsApp ke cloud.' },
      { judul: 'Salinan lokal', detail: 'Copy ke laptop/HDD tiap bulan.' },
      { judul: 'Uji restore', detail: 'Pastikan backup bisa dikembalikan.' },
    ],
    risiko: [{ risiko: 'Backup tidak jalan', pencegahan: 'Cek status backup tiap bulan.' }],
    penyelesaian: 'Data aman dari bencana.',
    tags: ['backup', 'hp', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_111: Tutorial[] = [
  {
    id: 'tut-umkm-18', slug: 'cara-daftar-qrismd', judul: 'Cara Daftar QRIS untuk Usaha',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Usaha belum terima pembayaran digital.',
    penjelasan: 'QRIS = 1 QR untuk semua e-wallet & m-banking.',
    persiapanAlat: ['KTP', 'Rekening bank'],
    langkah: [
      { judul: 'Pilih PJSP', detail: 'Bank / e-wallet penyedia QRIS.' },
      { judul: 'Daftar', detail: 'Isi data usaha & rekening.' },
      { judul: 'Verifikasi', detail: 'Tunggu 1-7 hari kerja.' },
      { judul: 'Terima QR', detail: 'Cetak & pasang di kasir.' },
      { judul: 'Uji transaksi', detail: 'Coba bayar nominal kecil.' },
    ],
    risiko: [{ risiko: 'Dana tidak masuk', pencegahan: 'Cek mutasi. Lapor PJSP bila bermasalah.' }],
    penyelesaian: 'Usaha terima semua pembayaran digital.',
    tags: ['qris', 'pembayaran', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_112: Tutorial[] = [
  {
    id: 'tut-kesehatan-17', slug: 'cara-atasi-susah-tidur', judul: 'Cara Mengatasi Susah Tidur (Insomnia)',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Susah tidur, bangun tidak segar.',
    penjelasan: 'Insomnia = sulit mulai/pertahankan tidur. 90% karena kebiasaan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Tidur & bangun jam yang sama tiap hari.' },
      { judul: 'Stop layar 1 jam', detail: 'Blue light menghambat melatonin.' },
      { judul: 'Kamar gelap & dingin', detail: '18-22°C ideal.' },
      { judul: 'Hindari kafein sore', detail: 'Batas terakhir jam 14.00.' },
      { judul: 'Ritual tenang', detail: 'Mandi hangat, baca buku, doa.' },
    ],
    risiko: [{ risiko: 'Insomnia kronis', pencegahan: '>3 minggu → konsultasi dokter.' }],
    penyelesaian: 'Tidur nyenyak & bangun segar.',
    tags: ['tidur', 'insomnia', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_113: Tutorial[] = [
  {
    id: 'tut-kehidupan-20', slug: 'cara-hemat-air', judul: 'Cara Menghemat Air di Rumah',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tagihan air membengkak / air sumur menipis.',
    penjelasan: 'Hemat air = hemat uang + jaga lingkungan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Perbaiki bocor', detail: 'Keran menetes = 20 liter/hari terbuang.' },
      { judul: 'Shower hemat', detail: '5 menit cukup. Matikan saat sabunan.' },
      { judul: 'Tampung air hujan', detail: 'Untuk siram tanaman & cuci.' },
      { judul: 'Cuci sekaligus', detail: 'Mesin cuci penuh, bukan setengah.' },
      { judul: 'Siram bijak', detail: 'Pagi/sore, secukupnya.' },
    ],
    risiko: [{ risiko: 'Kekeringan sumur', pencegahan: 'Jangan boros di musim kemarau.' }],
    penyelesaian: 'Air cukup & tagihan turun.',
    tags: ['air', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_114: Tutorial[] = [
  {
    id: 'tut-mental-22', slug: 'cara-bangun-kepercayaan-diri', judul: 'Cara Membangun Kepercayaan Diri',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Minder, takut bicara, takut gagal.',
    penjelasan: 'Percaya diri = skill yang dilatih, bukan bakat.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Mulai kecil', detail: 'Tantangan kecil tiap hari: sapa orang, tanya sesuatu.' },
      { judul: 'Siapkan diri', detail: 'Persiapan matang = 50% percaya diri.' },
      { judul: 'Postur tegak', detail: 'Bahasa tubuh memengaruhi pikiran.' },
      { judul: 'Catat kemenangan', detail: 'Jurnal hal baik tiap malam.' },
      { judul: 'Bandingkan ke diri sendiri', detail: 'Kemarin vs hari ini, bukan vs orang lain.' },
    ],
    risiko: [{ risiko: 'Menarik diri', pencegahan: 'Isolasi memperparah minder. Tetap bersosialisasi.' }],
    penyelesaian: 'Berani tampil & mencoba.',
    tags: ['percaya-diri', 'mental', 'minder'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_115: Tutorial[] = [
  {
    id: 'tut-keuangan-16', slug: 'cara-buat-anggaran', judul: 'Cara Membuat Anggaran Bulanan',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gaji habis sebelum akhir bulan.',
    penjelasan: 'Anggaran = peta uangmu. 50/30/20: kebutuhan/keinginan/tabungan.',
    persiapanAlat: ['Catatan pengeluaran'],
    langkah: [
      { judul: 'Catat pemasukan', detail: 'Total bersih per bulan.' },
      { judul: 'Kelompokkan', detail: '50% kebutuhan, 30% keinginan, 20% tabungan.' },
      { judul: 'Batasi kategori', detail: 'Set plafon tiap kategori.' },
      { judul: 'Otomatiskan tabungan', detail: 'Potong di awal, bukan sisa.' },
      { judul: 'Evaluasi mingguan', detail: 'Cek & sesuaikan.' },
    ],
    risiko: [{ risiko: 'Gagal konsisten', pencegahan: 'Mulai sederhana. Fleksibel tapi disiplin.' }],
    penyelesaian: 'Uang terkendali & tabungan tumbuh.',
    tags: ['anggaran', 'keuangan', 'budget'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_116: Tutorial[] = [
  {
    id: 'tut-belajar-17', slug: 'cara-buat-catatan-efektif', judul: 'Cara Membuat Catatan yang Efektif',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Catatan berantakan, tidak pernah dibaca ulang.',
    penjelasan: 'Catatan baik = ringkas, terstruktur, & bisa direview cepat.',
    persiapanAlat: ['Buku / aplikasi catatan'],
    langkah: [
      { judul: 'Metode Cornell', detail: 'Bagi halaman: catatan, kata kunci, rangkuman.' },
      { judul: 'Tulis dengan kata sendiri', detail: 'Jangan salin mentah.' },
      { judul: 'Highlight seperlunya', detail: 'Maks 20% halaman.' },
      { judul: 'Review 24 jam', detail: 'Baca ulang keesokan harinya.' },
      { judul: 'Digital backup', detail: 'Foto/scan catatan penting.' },
    ],
    risiko: [{ risiko: 'Menumpuk tidak terbaca', pencegahan: 'Review rutin tiap minggu.' }],
    penyelesaian: 'Catatan jadi senjata belajar.',
    tags: ['catatan', 'belajar', 'cornell'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_117: Tutorial[] = [
  {
    id: 'tut-perbaikan-19', slug: 'cara-tambal-ban-tubles', judul: 'Cara Menambal Ban Tubles',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ban tubles bocor kena paku.',
    penjelasan: 'Tubles bisa ditambal tanpa buka ban.',
    persiapanAlat: ['Tire repair kit', 'Tang', 'Kompresor/pompa'],
    langkah: [
      { judul: 'Cabut paku', detail: 'Pakai tang, tandai lubang.' },
      { judul: 'Kikir lubang', detail: 'Pakai reamer dari kit.' },
      { judul: 'Pasang sumbat', detail: 'Oles lem, tusukkan sumbat karet.' },
      { judul: 'Potong sisa', detail: 'Potong sumbat rata dengan ban.' },
      { judul: 'Pompa & cek', detail: 'Pompa, semprot air sabun — tidak berbuih = aman.' },
    ],
    risiko: [{ risiko: 'Tambalan lepas', pencegahan: 'Bocor besar/samping → ganti ban.' }],
    penyelesaian: 'Ban bisa dipakai lagi.',
    tags: ['ban', 'tubles', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_118: Tutorial[] = [
  {
    id: 'tut-kehidupan-21', slug: 'cara-rawat-tanaman', judul: 'Cara Merawat Tanaman Hias',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tanaman layu / mati terus.',
    penjelasan: '3 kebutuhan: cahaya, air, media tepat.',
    persiapanAlat: ['Pot', 'Media tanam', 'Pupuk'],
    langkah: [
      { judul: 'Kenali jenis', detail: 'Indoor vs outdoor, kebutuhan cahaya.' },
      { judul: 'Siram tepat', detail: 'Cek 2 cm tanah: kering = siram.' },
      { judul: 'Drainase baik', detail: 'Pot berlubang, jangan tergenang.' },
      { judul: 'Pupuk rutin', detail: '2 minggu sekali, dosis ringan.' },
      { judul: 'Pangkas', detail: 'Buang daun kering/mati.' },
    ],
    risiko: [{ risiko: 'Busuk akar', pencegahan: 'Jangan siram berlebihan. Itu pembunuh nomor 1.' }],
    penyelesaian: 'Tanaman subur & hijau.',
    tags: ['tanaman', 'hobi', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_119: Tutorial[] = [
  {
    id: 'tut-keuangan-17', slug: 'cara-hitung-bunga-deposito', judul: 'Cara Menghitung Bunga Deposito',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Bingung membandingkan penawaran deposito bank.',
    penjelasan: 'Bunga deposito = pokok × suku bunga × tenor. Kena pajak 20%.',
    persiapanAlat: ['Kalkulator'],
    langkah: [
      { judul: 'Catat suku bunga', detail: 'Bandingkan beberapa bank.' },
      { judul: 'Hitung bruto', detail: 'Pokok × % × (hari/365).' },
      { judul: 'Kurangi pajak', detail: 'Bunga kena PPh 20%.' },
      { judul: 'Banding neto', detail: 'Pilih hasil bersih tertinggi.' },
      { judul: 'Cek LPS', detail: 'Pastikan bank peserta LPS.' },
    ],
    risiko: [{ risiko: 'Penalti pecah', pencegahan: 'Jangan cairkan sebelum jatuh tempo.' }],
    penyelesaian: 'Pilih deposito paling menguntungkan.',
    tags: ['deposito', 'bunga', 'bank'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_120: Tutorial[] = [
  {
    id: 'tut-mental-23', slug: 'cara-kelola-emosi', judul: 'Cara Mengelola Emosi Negatif',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mudah marah, menyesal setelahnya.',
    penjelasan: 'Emosi = sinyal. Kelola responsnya, bukan menekannya.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jeda 6 detik', detail: 'Tarik napas sebelum bereaksi.' },
      { judul: 'Namai emosi', detail: '"Aku marah karena..." — menamai menurunkan intensitas.' },
      { judul: 'Cari kebutuhan', detail: 'Di balik marah ada kebutuhan tak terpenuhi.' },
      { judul: 'Salurkan sehat', detail: 'Olahraga, tulis, bicara.' },
      { judul: 'Minta maaf', detail: 'Bila sudah meledak, perbaiki.' },
    ],
    risiko: [{ risiko: 'Merusak relasi', pencegahan: 'Ledakan berulang → konseling.' }],
    penyelesaian: 'Emosi terkendali & relasi terjaga.',
    tags: ['emosi', 'marah', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_121: Tutorial[] = [
  {
    id: 'tut-alat-17', slug: 'cara-pakai-gerinda', judul: 'Cara Menggunakan Gerinda dengan Aman',
    kategori: 'alat', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Perlu potong besi/keramik tapi takut gerinda.',
    penjelasan: 'Gerinda = alat berbahaya bila salah. Safety dulu.',
    persiapanAlat: ['Gerinda', 'Mata potong', 'Kacamata', 'Sarung tangan'],
    langkah: [
      { judul: 'APD lengkap', detail: 'Kacamata, sarung tangan, masker.' },
      { judul: 'Cek mata gerinda', detail: 'Tidak retak, terpasang kencang.' },
      { judul: 'Jepit benda', detail: 'Benda kerja harus stabil.' },
      { judul: 'Potong perlahan', detail: 'Jangan tekan keras. Biarkan putaran bekerja.' },
      { judul: 'Arah percikan', detail: 'Jauh dari badan & orang.' },
    ],
    risiko: [{ risiko: 'Mata pecah / luka', pencegahan: 'Jangan pakai mata retak. Jangan lepas guard.' }],
    penyelesaian: 'Potongan rapi & aman.',
    tags: ['gerinda', 'tukang', 'safety'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_122: Tutorial[] = [
  {
    id: 'tut-kehidupan-22', slug: 'cara-atur-keuangan-keluarga', judul: 'Cara Mengatur Keuangan Keluarga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Suami-istri sering ribut soal uang.',
    penjelasan: 'Transparansi + anggaran bersama = kunci.',
    persiapanAlat: ['Catatan / aplikasi'],
    langkah: [
      { judul: 'Terbuka soal pemasukan', detail: 'Semua tahu total & sumber.' },
      { judul: 'Anggaran bersama', detail: 'Susun tiap awal bulan.' },
      { judul: 'Dana darurat', detail: 'Target 6x pengeluaran.' },
      { judul: 'Uang saku masing-masing', detail: 'Bebas dipakai tanpa lapor.' },
      { judul: 'Rapat keuangan', detail: 'Evaluasi tiap bulan.' },
    ],
    risiko: [{ risiko: 'Konflik berkepanjangan', pencegahan: 'Jangan sembunyikan utang/belanja besar.' }],
    penyelesaian: 'Keuangan keluarga harmonis.',
    tags: ['keluarga', 'keuangan', 'rumah-tangga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_123: Tutorial[] = [
  {
    id: 'tut-perbaikan-20', slug: 'cara-ganti-lampu', judul: 'Cara Mengganti Lampu dengan Aman',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati, takut kesetrum.',
    penjelasan: 'Ganti lampu = mudah & aman bila listrik dimatikan.',
    persiapanAlat: ['Lampu baru', 'Tangga'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Pastikan lampu mati total.' },
      { judul: 'Tunggu dingin', detail: 'Lampu pijar panas — tunggu 5 menit.' },
      { judul: 'Lepas lampu lama', detail: 'Putar berlawanan jarum jam / tarik (downlight).' },
      { judul: 'Pasang yang baru', detail: 'Sesuaikan tipe & watt.' },
      { judul: 'Nyalakan & cek', detail: 'Pastikan menyala normal.' },
    ],
    risiko: [{ risiko: 'Kesetrum', pencegahan: 'Matikan MCB bila ragu. Jangan sentuh fitting logam.' }],
    penyelesaian: 'Ruangan terang kembali.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_124: Tutorial[] = [
  {
    id: 'tut-keuangan-18', slug: 'cara-pilih-asuransi', judul: 'Cara Memilih Asuransi yang Tepat',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bingung pilih asuransi: kesehatan, jiwa, atau keduanya?',
    penjelasan: 'Asuransi = proteksi, bukan investasi.',
    persiapanAlat: ['Data keuangan'],
    langkah: [
      { judul: 'Prioritaskan kesehatan', detail: 'Biaya RS paling merusak keuangan.' },
      { judul: 'Hitung kebutuhan jiwa', detail: '10-15x pengeluaran tahunan.' },
      { judul: 'Baca pengecualian', detail: 'Pahami yang TIDAK ditanggung.' },
      { judul: 'Cek klaim', detail: 'Rasio klaim & reputasi perusahaan.' },
      { judul: 'Review tahunan', detail: 'Sesuaikan dengan kondisi.' },
    ],
    risiko: [{ risiko: 'Premi hangus sia-sia', pencegahan: 'Jangan over-insured. Sesuai kebutuhan.' }],
    penyelesaian: 'Terproteksi dengan tepat.',
    tags: ['asuransi', 'proteksi', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_125: Tutorial[] = [
  {
    id: 'tut-belajar-18', slug: 'cara-hafal-cepat', judul: 'Cara Menghafal dengan Cepat',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Hafalan tidak nempel-nempel.',
    penjelasan: 'Otak ingat lewat asosiasi & pengulangan berjeda.',
    persiapanAlat: ['Materi hafalan'],
    langkah: [
      { judul: 'Pahami dulu', detail: 'Jangan hafal yang tidak dimengerti.' },
      { judul: 'Chunking', detail: 'Potong jadi bagian kecil.' },
      { judul: 'Mnemonik', detail: 'Singkatan, lagu, atau cerita lucu.' },
      { judul: 'Spaced repetition', detail: 'Ulangi: 1 jam, 1 hari, 1 minggu.' },
      { judul: 'Uji aktif', detail: 'Tutup & tulis ulang dari ingatan.' },
    ],
    risiko: [{ risiko: 'Lupa saat ujian', pencegahan: 'Jangan begadang. Tidur mengkonsolidasi memori.' }],
    penyelesaian: 'Hafalan nempel lama.',
    tags: ['hafalan', 'memori', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_126: Tutorial[] = [
  {
    id: 'tut-mental-24', slug: 'cara-hadapi-kegagalan', judul: 'Cara Menghadapi Kegagalan',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gagal: ujian, bisnis, hubungan.',
    penjelasan: 'Gagal = data, bukan vonis.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Rasakan dulu', detail: 'Wajar sedih/kecewa. Jangan ditahan.' },
      { judul: 'Pisahkan diri dari hasil', detail: '"Aku gagal" beda dengan "aku pecundang".' },
      { judul: 'Analisis', detail: 'Apa yang bisa dikontrol lain kali?' },
      { judul: 'Cari pelajaran', detail: 'Tulis 3 hal yang dipelajari.' },
      { judul: 'Coba lagi', detail: 'Dengan strategi baru.' },
    ],
    risiko: [{ risiko: 'Menyerah total', pencegahan: 'Istirahat boleh, berhenti jangan.' }],
    penyelesaian: 'Bangkit lebih kuat.',
    tags: ['gagal', 'bangkit', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_127: Tutorial[] = [
  {
    id: 'tut-kehidupan-23', slug: 'cara-beli-rumah-pertama', judul: 'Cara Membeli Rumah Pertama',
    kategori: 'kehidupan', tingkat: 'menengah', estimasiMenit: 25,
    masalah: 'Ingin punya rumah tapi bingung mulai dari mana.',
    penjelasan: 'Beli rumah = keputusan finansial terbesar. Rencanakan matang.',
    persiapanAlat: ['Slip gaji', 'Rekening koran'],
    langkah: [
      { judul: 'Cek kemampuan', detail: 'Cicilan maks 30% penghasilan.' },
      { judul: 'Kumpulkan DP', detail: 'Minimal 10-20%.' },
      { judul: 'Cek legalitas', detail: 'SHM/HGB, IMB, tidak sengketa.' },
      { judul: 'Bandingkan KPR', detail: 'Suku bunga & biaya tiap bank.' },
      { judul: 'Survey lokasi', detail: 'Banjir, akses, fasilitas.' },
    ],
    risiko: [{ risiko: 'Gagal bayar', pencegahan: 'Punya dana darurat 6 bulan cicilan.' }],
    penyelesaian: 'Punya rumah pertama dengan aman.',
    tags: ['rumah', 'kpr', 'properti'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_128: Tutorial[] = [
  {
    id: 'tut-keuangan-19', slug: 'cara-hitung-pph21', judul: 'Cara Menghitung PPh 21',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Slip gaji ada potongan PPh 21 tapi tidak paham.',
    penjelasan: 'PPh 21 = pajak penghasilan karyawan. TER & tarif progresif.',
    persiapanAlat: ['Slip gaji'],
    langkah: [
      { judul: 'Hitung penghasilan bruto', detail: 'Gaji + tunjangan setahun.' },
      { judul: 'Kurangi biaya jabatan', detail: '5% maks 6 juta/tahun.' },
      { judul: 'Kurangi PTKP', detail: '54 juta (TK/0) + tanggungan.' },
      { judul: 'Terapkan tarif', detail: '5%-35% progresif per lapis.' },
      { judul: 'Bagi 12', detail: 'Potongan bulanan.' },
    ],
    risiko: [{ risiko: 'Kurang bayar', pencegahan: 'Lapor SPT tahunan dengan benar.' }],
    penyelesaian: 'Paham potongan gajimu.',
    tags: ['pajak', 'pph21', 'gaji'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_129: Tutorial[] = [
  {
    id: 'tut-alat-18', slug: 'cara-pakai-mesin-cuci', judul: 'Cara Menggunakan Mesin Cuci',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Baju tidak bersih / mesin cepat rusak.',
    penjelasan: 'Mesin cuci awet bila dipakai dengan benar.',
    persiapanAlat: ['Deterjen', 'Baju kotor'],
    langkah: [
      { judul: 'Pisahkan baju', detail: 'Putih, berwarna, & jeans terpisah.' },
      { judul: 'Jangan overload', detail: 'Isi 70-80% kapasitas.' },
      { judul: 'Deterjen tepat', detail: 'Sesuai takaran. Terlalu banyak = residu.' },
      { judul: 'Pilih mode', detail: 'Normal, delicate, quick sesuai jenis.' },
      { judul: 'Bersihkan berkala', detail: 'Tub clean tiap bulan.' },
    ],
    risiko: [{ risiko: 'Mesin rusak', pencegahan: 'Ratakan posisi. Jangan cuci sepatu.' }],
    penyelesaian: 'Baju bersih & mesin awet.',
    tags: ['mesin-cuci', 'rumah', 'laundry'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_130: Tutorial[] = [
  {
    id: 'tut-kehidupan-24', slug: 'cara-rawat-motor', judul: 'Cara Merawat Motor Harian',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Motor cepat rusak / boros.',
    penjelasan: 'Perawatan rutin = motor awet & irit.',
    persiapanAlat: ['Oli', 'Lap'],
    langkah: [
      { judul: 'Ganti oli rutin', detail: 'Tiap 2000-3000 km.' },
      { judul: 'Cek tekanan ban', detail: 'Tiap minggu.' },
      { judul: 'Bersihkan filter udara', detail: 'Tiap 4000 km.' },
      { judul: 'Cek rem & rantai', detail: 'Jangan sampai aus.' },
      { judul: 'Panaskan 1 menit', detail: 'Sebelum jalan pagi hari.' },
    ],
    risiko: [{ risiko: 'Mogok di jalan', pencegahan: 'Service berkala di bengkel resmi.' }],
    penyelesaian: 'Motor awet & irit.',
    tags: ['motor', 'perawatan', 'kendaraan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_131: Tutorial[] = [
  {
    id: 'tut-teknologi-18', slug: 'cara-backup-whatsapp', judul: 'Cara Backup Chat WhatsApp',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Ganti HP tapi chat hilang.',
    penjelasan: 'Backup ke Google Drive / iCloud.',
    persiapanAlat: ['Akun Google / iCloud'],
    langkah: [
      { judul: 'Buka Pengaturan', detail: 'WA > Pengaturan > Chat > Cadangan chat.' },
      { judul: 'Pilih akun', detail: 'Pilih akun Google/iCloud.' },
      { judul: 'Cadangkan sekarang', detail: 'Tunggu sampai selesai. Pakai WiFi.' },
      { judul: 'Di HP baru', detail: 'Login nomor sama > pulihkan saat diminta.' },
    ],
    risiko: [{ risiko: 'Backup gagal', pencegahan: 'Pastikan storage cukup & baterai penuh.' }],
    penyelesaian: 'Chat aman & bisa dipulihkan.',
    tags: ['whatsapp', 'backup', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_132: Tutorial[] = [
  {
    id: 'tut-kesehatan-18', slug: 'cara-turunkan-berat-badan', judul: 'Cara Menurunkan Berat Badan Sehat',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Berat badan naik terus.',
    penjelasan: 'Defisit kalori + gerak = turun sehat 0,5 kg/minggu.',
    persiapanAlat: ['Timbangan'],
    langkah: [
      { judul: 'Hitung kebutuhan', detail: 'BMR & TDEE. Kurangi 500 kkal/hari.' },
      { judul: 'Makan seimbang', detail: 'Protein cukup, kurangi gula & gorengan.' },
      { judul: 'Olahraga', detail: '150 menit/minggu. Jalan kaki cukup.' },
      { judul: 'Tidur cukup', detail: 'Kurang tidur = lapar terus.' },
      { judul: 'Catat progres', detail: 'Timbang 1x seminggu, waktu sama.' },
    ],
    risiko: [{ risiko: 'Diet ekstrem', pencegahan: 'Jangan <1200 kkal/hari tanpa dokter.' }],
    penyelesaian: 'Berat turun & sehat.',
    tags: ['diet', 'berat-badan', 'sehat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_133: Tutorial[] = [
  {
    id: 'tut-kerja-24', slug: 'cara-bikin-cv-ats', judul: 'Cara Membuat CV Lolos ATS',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Lamar banyak tapi tidak dipanggil.',
    penjelasan: 'ATS = sistem filter CV otomatis. Format sederhana menang.',
    persiapanAlat: ['Data riwayat kerja'],
    langkah: [
      { judul: 'Format sederhana', detail: 'Tanpa tabel/gambar aneh. Font standar.' },
      { judul: 'Keyword lowongan', detail: 'Samakan istilah dengan iklan lowongan.' },
      { judul: 'Struktur jelas', detail: 'Kontak - ringkasan - pengalaman - pendidikan - skill.' },
      { judul: 'Angka prestasi', detail: '"Naikkan penjualan 30%" > "bertanggung jawab".' },
      { judul: 'PDF', detail: 'Kirim dalam format PDF, bukan Word.' },
    ],
    risiko: [{ risiko: 'Tertolak ATS', pencegahan: 'Hindari header/footer & kolom ganda.' }],
    penyelesaian: 'CV lolos filter & dibaca HRD.',
    tags: ['cv', 'ats', 'lamaran'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_134: Tutorial[] = [
  {
    id: 'tut-umkm-18', slug: 'cara-daftar-merek', judul: 'Cara Mendaftarkan Merek Dagang',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Brand dicuri orang lain.',
    penjelasan: 'Daftar merek di DJKI = perlindungan hukum 10 tahun.',
    persiapanAlat: ['Logo', 'KTP'],
    langkah: [
      { judul: 'Cek ketersediaan', detail: 'Cari di pdki-indonesia.dgip.go.id.' },
      { judul: 'Siapkan dokumen', detail: 'Logo, KTP, surat pernyataan.' },
      { judul: 'Daftar online', detail: 'merek.dgip.go.id. Biaya ±1,8 juta/kelas.' },
      { judul: 'Pemeriksaan', detail: 'Tunggu 9-12 bulan.' },
      { judul: 'Terima sertifikat', detail: 'Lindungi 10 tahun, bisa diperpanjang.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Jangan mirip merek terkenal.' }],
    penyelesaian: 'Brand terlindungi hukum.',
    tags: ['merek', 'haki', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_135: Tutorial[] = [
  {
    id: 'tut-perbaikan-21', slug: 'cara-perbaiki-kran-bocor', judul: 'Cara Memperbaiki Kran Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Kran menetes terus, tagihan air membengkak.',
    penjelasan: 'Umumnya seal/karet aus. Ganti murah & mudah.',
    persiapanAlat: ['Kunci inggris', 'Seal karet baru', 'Isolasi pipa'],
    langkah: [
      { judul: 'Tutup air utama', detail: 'Putar katup meteran air.' },
      { judul: 'Buka kran', detail: 'Lepas handle & mur dengan kunci.' },
      { judul: 'Ganti seal', detail: 'Lepas karet lama, pasang baru.' },
      { judul: 'Pasang kembali', detail: 'Kencangkan, buka air, cek bocor.' },
    ],
    risiko: [{ risiko: 'Ulir rusak', pencegahan: 'Jangan paksa. Pakai isolasi pipa.' }],
    penyelesaian: 'Kran tidak bocor lagi.',
    tags: ['kran', 'plumbing', 'bocor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_136: Tutorial[] = [
  {
    id: 'tut-belajar-19', slug: 'cara-ikut-olimpiade', judul: 'Cara Mengikuti Olimpiade Sains',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin ikut OSN tapi tidak tahu caranya.',
    penjelasan: 'OSN = Olimpiade Sains Nasional. Seleksi berlapis.',
    persiapanAlat: ['Materi pelajaran'],
    langkah: [
      { judul: 'Pilih bidang', detail: 'Matematika, IPA, IPS, dsb.' },
      { judul: 'Ikut seleksi sekolah', detail: 'Minta info ke guru.' },
      { judul: 'Latihan soal', detail: 'Soal tahun lalu + pembahasan.' },
      { judul: 'Ikut seleksi kabupaten', detail: 'Lolos → provinsi → nasional.' },
      { judul: 'Jaga konsistensi', detail: 'Latihan rutin tiap hari.' },
    ],
    risiko: [{ risiko: 'Gagal seleksi', pencegahan: 'Jadikan pengalaman. Coba tahun depan.' }],
    penyelesaian: 'Siap bertanding di olimpiade.',
    tags: ['olimpiade', 'osn', 'sains'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_137: Tutorial[] = [
  {
    id: 'tut-mental-25', slug: 'cara-atasi-insomnia', judul: 'Cara Mengatasi Insomnia',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sulit tidur / sering terbangun.',
    penjelasan: 'Higiene tidur memperbaiki kualitas tidur.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Tidur & bangun jam sama tiap hari.' },
      { judul: 'Kurangi layar', detail: 'Stop HP 1 jam sebelum tidur.' },
      { judul: 'Kamar gelap dingin', detail: 'Suhu 18-22°C ideal.' },
      { judul: 'Hindari kafein', detail: 'Stop kopi setelah jam 2 siang.' },
      { judul: 'Ritual relaksasi', detail: 'Baca buku / mandi hangat.' },
    ],
    risiko: [{ risiko: 'Ketergantungan obat tidur', pencegahan: 'Jangan minum obat tanpa resep dokter.' }],
    penyelesaian: 'Tidur nyenyak & segar.',
    tags: ['insomnia', 'tidur', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_138: Tutorial[] = [
  {
    id: 'tut-keuangan-20', slug: 'cara-hitung-bunga-deposito', judul: 'Cara Menghitung Bunga Deposito',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Bingung hitung hasil deposito.',
    penjelasan: 'Bunga deposito kena pajak 20%.',
    persiapanAlat: ['Kalkulator'],
    langkah: [
      { judul: 'Lihat suku bunga', detail: 'Contoh: 4% per tahun.' },
      { judul: 'Hitung bruto', detail: 'Pokok × 4% × (tenor/12).' },
      { judul: 'Kurangi pajak', detail: '× 80% (pajak 20%).' },
      { judul: 'Bandingkan', detail: 'Dengan inflasi & obligasi.' },
    ],
    risiko: [{ risiko: 'Kalah inflasi', pencegahan: 'Deposito untuk dana darurat, bukan investasi utama.' }],
    penyelesaian: 'Paham hasil depositomu.',
    tags: ['deposito', 'bunga', 'investasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_139: Tutorial[] = [
  {
    id: 'tut-alat-19', slug: 'cara-pakai-multimeter', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tidak bisa cek tegangan/baterai.',
    penjelasan: 'Multimeter = alat ukur listrik serbaguna.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Kenali bagian', detail: 'Display, selektor, probe merah/hitam.' },
      { judul: 'Ukur tegangan DC', detail: 'Selektor V⎓, probe ke + dan -.' },
      { judul: 'Ukur tegangan AC', detail: 'Selektor V~, colok ke stop kontak (hati-hati).' },
      { judul: 'Ukur resistansi', detail: 'Selektor Ω. Pastikan tidak bertegangan.' },
      { judul: 'Cek kontinuitas', detail: 'Mode buzzer. Bunyi = tersambung.' },
    ],
    risiko: [{ risiko: 'Sengatan listrik', pencegahan: 'Jangan ukur tegangan tinggi tanpa pengalaman.' }],
    penyelesaian: 'Bisa ukur listrik dasar.',
    tags: ['multimeter', 'listrik', 'ukur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_140: Tutorial[] = [
  {
    id: 'tut-kehidupan-25', slug: 'cara-packing-pindahan', judul: 'Cara Packing Barang Pindahan',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Pindahan berantakan & barang rusak.',
    penjelasan: 'Packing sistematis = pindahan lancar.',
    persiapanAlat: ['Kardus', 'Bubble wrap', 'Lakban', 'Spidol'],
    langkah: [
      { judul: 'Sortir dulu', detail: 'Buang/sumbangkan yang tidak perlu.' },
      { judul: 'Packing per ruangan', detail: 'Label tiap kardus jelas.' },
      { judul: 'Barang pecah belah', detail: 'Bubble wrap + tulis FRAGILE.' },
      { judul: 'Dokumen penting', detail: 'Tas terpisah, bawa sendiri.' },
      { judul: 'Essentials box', detail: '1 kardus kebutuhan hari pertama.' },
    ],
    risiko: [{ risiko: 'Barang hilang', pencegahan: 'Foto isi tiap kardus.' }],
    penyelesaian: 'Pindahan rapi & aman.',
    tags: ['pindahan', 'packing', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_141: Tutorial[] = [
  {
    id: 'tut-kerja-25', slug: 'cara-negosiasi-gaji', judul: 'Cara Negosiasi Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Dapat tawaran tapi gaji kurang.',
    penjelasan: 'Negosiasi = wajar & profesional.',
    persiapanAlat: ['Data gaji pasar'],
    langkah: [
      { judul: 'Riset dulu', detail: 'Cek range gaji posisi di job portal.' },
      { judul: 'Jangan sebut duluan', detail: 'Biarkan HRD buka angka.' },
      { judul: 'Berikan range', detail: 'Bukan angka mati. Contoh: 8-10 juta.' },
      { judul: 'Tekankan value', detail: 'Prestasi yang relevan.' },
      { judul: 'Negosiasi total', detail: 'Bonus, cuti, WFH juga bisa.' },
    ],
    risiko: [{ risiko: 'Tawaran ditarik', pencegahan: 'Tetap sopan. Jangan bluff.' }],
    penyelesaian: 'Gaji sesuai kemampuanmu.',
    tags: ['gaji', 'negosiasi', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_142: Tutorial[] = [
  {
    id: 'tut-teknologi-19', slug: 'cara-amankan-wifi', judul: 'Cara Mengamankan WiFi Rumah',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'WiFi lemot / dipakai tetangga.',
    penjelasan: 'Amankan router dalam 10 menit.',
    persiapanAlat: ['Akses admin router'],
    langkah: [
      { judul: 'Ganti password admin', detail: 'Jangan pakai default admin/admin.' },
      { judul: 'Password WiFi kuat', detail: 'Min 12 karakter, WPA2/WPA3.' },
      { judul: 'Matikan WPS', detail: 'Celah keamanan umum.' },
      { judul: 'Update firmware', detail: 'Cek berkala di panel admin.' },
      { judul: 'Sembunyikan SSID', detail: 'Opsional, untuk privasi ekstra.' },
    ],
    risiko: [{ risiko: 'Lupa password', pencegahan: 'Catat di tempat aman.' }],
    penyelesaian: 'WiFi aman & cepat.',
    tags: ['wifi', 'keamanan', 'router'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_143: Tutorial[] = [
  {
    id: 'tut-umkm-19', slug: 'cara-jualan-di-shopee', judul: 'Cara Jualan di Shopee untuk Pemula',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin jualan online tapi bingung mulai.',
    penjelasan: 'Shopee = marketplace terbesar. Mulai gratis.',
    persiapanAlat: ['KTP', 'Produk', 'HP'],
    langkah: [
      { judul: 'Daftar akun seller', detail: 'Gratis. Verifikasi KTP.' },
      { judul: 'Foto produk bagus', detail: 'Terang, banyak angle.' },
      { judul: 'Tulis judul SEO', detail: 'Kata kunci yang dicari pembeli.' },
      { judul: 'Atur ongkir', detail: 'Aktifkan semua ekspedisi.' },
      { judul: 'Promosi', detail: 'Voucher toko & ikut campaign.' },
    ],
    risiko: [{ risiko: 'Penipuan', pencegahan: 'Jangan transaksi di luar aplikasi.' }],
    penyelesaian: 'Toko online berjalan.',
    tags: ['shopee', 'jualan', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_144: Tutorial[] = [
  {
    id: 'tut-kesehatan-19', slug: 'cara-jaga-kesehatan-mata', judul: 'Cara Menjaga Kesehatan Mata',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Mata lelah & minus bertambah.',
    penjelasan: 'Aturan 20-20-20 & cahaya cukup.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Aturan 20-20-20', detail: 'Tiap 20 menit, lihat 20 kaki selama 20 detik.' },
      { judul: 'Cahaya cukup', detail: 'Jangan baca di tempat gelap.' },
      { judul: 'Jarak layar', detail: '50-70 cm dari mata.' },
      { judul: 'Jangan kucek', detail: 'Bisa iritasi & infeksi.' },
      { judul: 'Periksa rutin', detail: 'Ke optik/dokter tiap 1-2 tahun.' },
    ],
    risiko: [{ risiko: 'Minus bertambah', pencegahan: 'Batasi screen time anak.' }],
    penyelesaian: 'Mata sehat & nyaman.',
    tags: ['mata', 'kesehatan', 'layar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_145: Tutorial[] = [
  {
    id: 'tut-belajar-20', slug: 'cara-bikin-mind-mapping', judul: 'Cara Membuat Mind Mapping',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Catatan membosankan & sulit diingat.',
    penjelasan: 'Mind map = visualisasi ide bercabang.',
    persiapanAlat: ['Kertas', 'Spidol warna'],
    langkah: [
      { judul: 'Topik di tengah', detail: 'Tulis topik utama di tengah kertas.' },
      { judul: 'Cabang utama', detail: '5-7 cabang ide besar.' },
      { judul: 'Sub-cabang', detail: 'Detail tiap cabang.' },
      { judul: 'Warna & gambar', detail: 'Otak ingat visual lebih baik.' },
      { judul: 'Review', detail: 'Baca ulang & tambah yang kurang.' },
    ],
    risiko: [{ risiko: 'Terlalu ramai', pencegahan: 'Satu kata kunci per cabang.' }],
    penyelesaian: 'Catatan visual yang mudah diingat.',
    tags: ['mindmap', 'catatan', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_146: Tutorial[] = [
  {
    id: 'tut-mental-26', slug: 'cara-kelola-emosi', judul: 'Cara Mengelola Emosi',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mudah marah / meledak-ledak.',
    penjelasan: 'Emosi = sinyal, bukan musuh. Kelola, jangan tekan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Kenali pemicu', detail: 'Catat kapan emosi muncul.' },
      { judul: 'Jeda 6 detik', detail: 'Tarik napas sebelum bereaksi.' },
      { judul: 'Namai emosi', detail: '"Aku marah karena..." menenangkan otak.' },
      { judul: 'Salurkan sehat', detail: 'Olahraga, tulis, bicara.' },
      { judul: 'Evaluasi', detail: 'Apa yang bisa beda lain kali?' },
    ],
    risiko: [{ risiko: 'Menyesal kemudian', pencegahan: 'Jangan ambil keputusan saat emosi puncak.' }],
    penyelesaian: 'Lebih tenang & terkendali.',
    tags: ['emosi', 'marah', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_147: Tutorial[] = [
  {
    id: 'tut-kehidupan-26', slug: 'cara-hemat-air', judul: 'Cara Menghemat Air di Rumah',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tagihan air membengkak.',
    penjelasan: 'Hemat air = hemat uang + lingkungan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Perbaiki bocor', detail: 'Kran menetes = 20 liter/hari terbuang.' },
      { judul: 'Shower singkat', detail: 'Maks 5 menit.' },
      { judul: 'Tampung air hujan', detail: 'Untuk siram tanaman.' },
      { judul: 'Cuci sekaligus', detail: 'Mesin cuci penuh, bukan setengah.' },
      { judul: 'Siram tanaman pagi', detail: 'Minim penguapan.' },
    ],
    risiko: [{ risiko: 'Kekurangan saat kemarau', pencegahan: 'Siapkan tandon cadangan.' }],
    penyelesaian: 'Tagihan turun & air cukup.',
    tags: ['air', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_148: Tutorial[] = [
  {
    id: 'tut-keuangan-21', slug: 'cara-baca-slip-gaji', judul: 'Cara Membaca Slip Gaji',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tidak paham potongan di slip gaji.',
    penjelasan: 'Kenali tiap komponen gajimu.',
    persiapanAlat: ['Slip gaji'],
    langkah: [
      { judul: 'Gaji pokok', detail: 'Dasar perhitungan tunjangan.' },
      { judul: 'Tunjangan', detail: 'Jabatan, transport, makan.' },
      { judul: 'Potongan', detail: 'PPh 21, BPJS, pinjaman.' },
      { judul: 'Take home pay', detail: 'Bruto − potongan.' },
      { judul: 'Cek tiap bulan', detail: 'Pastikan tidak ada salah hitung.' },
    ],
    risiko: [{ risiko: 'Gaji kurang tanpa sadar', pencegahan: 'Simpan slip tiap bulan.' }],
    penyelesaian: 'Paham gajimu sendiri.',
    tags: ['gaji', 'slip', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_149: Tutorial[] = [
  {
    id: 'tut-alat-20', slug: 'cara-pakai-bor-listrik', judul: 'Cara Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut pakai bor / hasil tidak rapi.',
    penjelasan: 'Bor aman bila tekniknya benar.',
    persiapanAlat: ['Bor', 'Mata bor', 'Kacamata'],
    langkah: [
      { judul: 'Pilih mata bor', detail: 'Kayu, besi, beton beda mata.' },
      { judul: 'Tandai titik', detail: 'Paku kecil / spidol.' },
      { judul: 'Kecepatan rendah dulu', detail: 'Tekan perlahan, jangan dipaksa.' },
      { judul: 'Tegak lurus', detail: 'Hasil lubang rapi.' },
      { judul: 'Bersihkan', detail: 'Debu bor dibersihkan.' },
    ],
    risiko: [{ risiko: 'Terluka', pencegahan: 'Pakai kacamata & sarung tangan.' }],
    penyelesaian: 'Bisa mengebor dengan aman.',
    tags: ['bor', 'tukang', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_150: Tutorial[] = [
  {
    id: 'tut-perbaikan-22', slug: 'cara-ganti-ban-tubles', judul: 'Cara Mengganti Ban Tubles',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Ban bocor di jalan.',
    penjelasan: 'Tambal tubles = cepat & praktis.',
    persiapanAlat: ['Kit tambal tubles', 'Pompa'],
    langkah: [
      { judul: 'Temukan lubang', detail: 'Air sabun: gelembung = bocor.' },
      { judul: 'Bersihkan', detail: 'Kikir lubang dengan alat.' },
      { judul: 'Pasang cacing', detail: 'Tusukkan tambalan karet.' },
      { judul: 'Potong sisa', detail: 'Ratakan dengan permukaan.' },
      { judul: 'Pompa', detail: 'Cek tekanan sesuai standar.' },
    ],
    risiko: [{ risiko: 'Tambalan lepas', pencegahan: 'Bila lubang >6mm, ganti ban.' }],
    penyelesaian: 'Ban bisa dipakai lagi.',
    tags: ['ban', 'tubles', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_151: Tutorial[] = [
  {
    id: 'tut-belajar-21', slug: 'cara-efektif-les-privat', judul: 'Cara Memaksimalkan Les Privat',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Les mahal tapi nilai tidak naik.',
    penjelasan: 'Les efektif bila aktif, bukan pasif.',
    persiapanAlat: ['Materi sulit'],
    langkah: [
      { judul: 'Siapkan pertanyaan', detail: 'Catat yang tidak paham sebelum les.' },
      { judul: 'Fokus 1 topik', detail: 'Jangan lompat-lompat.' },
      { judul: 'Praktik langsung', detail: 'Kerjakan soal saat itu juga.' },
      { judul: 'Minta PR', detail: 'Latihan mandiri setelah les.' },
      { judul: 'Review', detail: 'Ulangi materi 1 hari kemudian.' },
    ],
    risiko: [{ risiko: 'Uang terbuang', pencegahan: 'Evaluasi tiap bulan. Ganti tutor bila tidak cocok.' }],
    penyelesaian: 'Les berbuah nilai.',
    tags: ['les', 'privat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_152: Tutorial[] = [
  {
    id: 'tut-mental-27', slug: 'cara-atasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran tidak berhenti berputar.',
    penjelasan: 'Overthinking = khawatir masa depan yang belum terjadi.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Tulis kekhawatiran', detail: 'Keluarkan dari kepala ke kertas.' },
      { judul: 'Pisahkan fakta vs takut', detail: 'Mana bukti, mana asumsi.' },
      { judul: 'Batasi waktu khawatir', detail: '15 menit/hari, lalu stop.' },
      { judul: 'Fokus aksi', detail: 'Satu langkah kecil yang bisa dilakukan.' },
      { judul: 'Grounding', detail: '5 hal terlihat, 4 terdengar, 3 tersentuh.' },
    ],
    risiko: [{ risiko: 'Cemas berkepanjangan', pencegahan: 'Bila >2 minggu, konsultasi psikolog.' }],
    penyelesaian: 'Pikiran lebih tenang.',
    tags: ['overthinking', 'cemas', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_153: Tutorial[] = [
  {
    id: 'tut-kehidupan-27', slug: 'cara-urus-ktp-hilang', judul: 'Cara Mengurus KTP Hilang',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'KTP hilang, butuh ganti cepat.',
    penjelasan: 'Urus surat kehilangan + ke Dukcapil.',
    persiapanAlat: ['KK'],
    langkah: [
      { judul: 'Lapor polisi', detail: 'Minta surat keterangan kehilangan.' },
      { judul: 'Ke Dukcapil', detail: 'Bawa KK + surat polisi.' },
      { judul: 'Foto & rekam', detail: 'Biometrik ulang bila perlu.' },
      { judul: 'Tunggu cetak', detail: 'Atau KTP digital via IKD.' },
    ],
    risiko: [{ risiko: 'Disalahgunakan', pencegahan: 'Lapor secepatnya. Cek SLIK OJK berkala.' }],
    penyelesaian: 'KTP baru terbit.',
    tags: ['ktp', 'dukcapil', 'dokumen'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_154: Tutorial[] = [
  {
    id: 'tut-teknologi-20', slug: 'cara-pakai-google-drive', judul: 'Cara Menggunakan Google Drive',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'File berserakan & hilang.',
    penjelasan: 'Drive = penyimpanan cloud 15GB gratis.',
    persiapanAlat: ['Akun Google'],
    langkah: [
      { judul: 'Upload file', detail: 'Drag & drop ke drive.google.com.' },
      { judul: 'Buat folder', detail: 'Organisasi per kategori.' },
      { judul: 'Share', detail: 'Atur: lihat/komentar/edit.' },
      { judul: 'Backup HP', detail: 'Aktifkan backup foto.' },
      { judul: 'Offline', detail: 'Aktifkan file penting offline.' },
    ],
    risiko: [{ risiko: 'Akun diretas', pencegahan: 'Aktifkan 2FA.' }],
    penyelesaian: 'File aman & terorganisir.',
    tags: ['drive', 'cloud', 'backup'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_155: Tutorial[] = [
  {
    id: 'tut-umkm-20', slug: 'cara-foto-produk-hp', judul: 'Cara Foto Produk dengan HP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Foto produk jelek, pembeli kabur.',
    penjelasan: 'Foto bagus = HP + cahaya + komposisi.',
    persiapanAlat: ['HP', 'Kertas putih'],
    langkah: [
      { judul: 'Cahaya alami', detail: 'Dekat jendela, jangan backlight.' },
      { judul: 'Background polos', detail: 'Kertas putih / kain.' },
      { judul: 'Banyak angle', detail: 'Depan, samping, detail, lifestyle.' },
      { judul: 'Fokus tajam', detail: 'Tap layar untuk fokus.' },
      { judul: 'Edit ringan', detail: 'Brightness & crop saja.' },
    ],
    risiko: [{ risiko: 'Warna tidak akurat', pencegahan: 'Jangan over-filter.' }],
    penyelesaian: 'Foto produk menarik pembeli.',
    tags: ['foto', 'produk', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_156: Tutorial[] = [
  {
    id: 'tut-kesehatan-20', slug: 'cara-cegah-flu', judul: 'Cara Mencegah Flu',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Sering flu saat musim hujan.',
    penjelasan: 'Imun kuat = flu menjauh.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cuci tangan', detail: 'Sabun 20 detik, sering.' },
      { judul: 'Vitamin C & D', detail: 'Buah & sinar matahari pagi.' },
      { judul: 'Tidur cukup', detail: '7-8 jam.' },
      { judul: 'Hindari kerumunan sakit', detail: 'Masker bila perlu.' },
      { judul: 'Vaksin flu', detail: 'Tahunan, terutama lansia.' },
    ],
    risiko: [{ risiko: 'Komplikasi', pencegahan: 'Ke dokter bila >3 hari / sesak.' }],
    penyelesaian: 'Jarang sakit flu.',
    tags: ['flu', 'imun', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_157: Tutorial[] = [
  {
    id: 'tut-kerja-26', slug: 'cara-lolos-interview', judul: 'Cara Lolos Interview Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gagal interview berkali-kali.',
    penjelasan: 'Interview = jual diri dengan jujur.',
    persiapanAlat: ['CV', 'Riset perusahaan'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Visi, produk, berita terbaru.' },
      { judul: 'Latihan STAR', detail: 'Situation-Task-Action-Result.' },
      { judul: 'Datang 15 menit awal', detail: 'Rapi & sopan.' },
      { judul: 'Jawab jujur', detail: 'Jangan mengarang pengalaman.' },
      { judul: 'Tanya balik', detail: 'Tunjukkan antusiasme.' },
    ],
    risiko: [{ risiko: 'Gugup', pencegahan: 'Latihan di depan cermin.' }],
    penyelesaian: 'Peluang lolos naik.',
    tags: ['interview', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_158: Tutorial[] = [
  {
    id: 'tut-umkm-21', slug: 'cara-hitung-hpp', judul: 'Cara Menghitung HPP Produk',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Jualan laris tapi tidak untung.',
    penjelasan: 'HPP = semua biaya produksi per unit.',
    persiapanAlat: ['Data biaya'],
    langkah: [
      { judul: 'Biaya bahan', detail: 'Total bahan ÷ jumlah unit.' },
      { judul: 'Biaya tenaga', detail: 'Upah ÷ unit.' },
      { judul: 'Overhead', detail: 'Listrik, sewa, dibagi unit.' },
      { judul: 'Total HPP', detail: 'Jumlahkan ketiganya.' },
      { judul: 'Tentukan harga', detail: 'HPP + margin 30-50%.' },
    ],
    risiko: [{ risiko: 'Rugi diam-diam', pencegahan: 'Hitung ulang tiap harga bahan naik.' }],
    penyelesaian: 'Harga jual menguntungkan.',
    tags: ['hpp', 'umkm', 'harga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_159: Tutorial[] = [
  {
    id: 'tut-belajar-22', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat (Speed Reading)',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Buku menumpuk, tidak selesai dibaca.',
    penjelasan: 'Speed reading = kurangi subvokalisasi.',
    persiapanAlat: ['Buku'],
    langkah: [
      { judul: 'Jangan baca kata per kata', detail: 'Lihat frasa, bukan kata.' },
      { judul: 'Gunakan jari', detail: 'Pandu mata lebih cepat.' },
      { judul: 'Jangan mundur', detail: 'Terus maju, percaya pemahaman.' },
      { judul: 'Skimming dulu', detail: 'Judul & subjudul sebelum detail.' },
      { judul: 'Latihan 15 menit', detail: 'Tiap hari, ukur WPM.' },
    ],
    risiko: [{ risiko: 'Pemahaman turun', pencegahan: 'Untuk fiksi/hobi. Materi sulit tetap baca normal.' }],
    penyelesaian: 'Baca 2x lebih cepat.',
    tags: ['baca', 'cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_160: Tutorial[] = [
  {
    id: 'tut-mental-28', slug: 'cara-bangkit-dari-kegagalan', judul: 'Cara Bangkit dari Kegagalan',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Terpuruk setelah gagal.',
    penjelasan: 'Bangkit = proses, bukan tombol.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Terima perasaan', detail: 'Sedih itu wajar, jangan ditolak.' },
      { judul: 'Jeda sejenak', detail: 'Istirahat, bukan menyerah.' },
      { judul: 'Analisis objektif', detail: 'Apa yang salah? Apa yang benar?' },
      { judul: 'Rencana baru', detail: 'Strategi berbeda, bukan usaha sama.' },
      { judul: 'Langkah kecil', detail: 'Mulai dari yang paling mudah.' },
    ],
    risiko: [{ risiko: 'Depresi', pencegahan: 'Bila >2 minggu tidak membaik, cari bantuan profesional.' }],
    penyelesaian: 'Bangkit lebih kuat.',
    tags: ['gagal', 'bangkit', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_161: Tutorial[] = [
  {
    id: 'tut-kehidupan-28', slug: 'cara-urus-sim', judul: 'Cara Mengurus SIM Baru',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin punya SIM tapi bingung alurnya.',
    penjelasan: 'SIM via Satpas / online (SINAR).',
    persiapanAlat: ['KTP', 'Surat sehat'],
    langkah: [
      { judul: 'Daftar', detail: 'Online via aplikasi SINAR / datang ke Satpas.' },
      { judul: 'Tes kesehatan', detail: 'Di lokasi / dokter.' },
      { judul: 'Ujian teori', detail: 'Belajar soal di aplikasi.' },
      { judul: 'Ujian praktik', detail: 'Latihan zig-zag & angka 8.' },
      { judul: 'Foto & cetak', detail: 'SIM jadi hari itu juga.' },
    ],
    risiko: [{ risiko: 'Gagal ujian', pencegahan: 'Bisa mengulang. Latihan dulu.' }],
    penyelesaian: 'Punya SIM resmi.',
    tags: ['sim', 'kendaraan', 'dokumen'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_162: Tutorial[] = [
  {
    id: 'tut-keuangan-29', slug: 'cara-atur-gaji-ump', judul: 'Cara Mengatur Gaji UMP',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gaji UMP habis sebelum akhir bulan.',
    penjelasan: 'Anggaran 50-30-20 versi realistis.',
    persiapanAlat: ['Catatan pengeluaran'],
    langkah: [
      { judul: 'Catat semua pengeluaran', detail: '1 bulan penuh, jujur.' },
      { judul: '50% kebutuhan', detail: 'Kontrakan, makan, transport.' },
      { judul: '30% keinginan', detail: 'Batasi, bukan hilangkan.' },
      { judul: '20% tabungan', detail: 'Otomatis di awal bulan.' },
      { judul: 'Dana darurat', detail: 'Target 3x pengeluaran.' },
    ],
    risiko: [{ risiko: 'Pinjol', pencegahan: 'Jangan gali lubang tutup lubang.' }],
    penyelesaian: 'Gaji cukup & ada tabungan.',
    tags: ['gaji', 'ump', 'anggaran'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_163: Tutorial[] = [
  {
    id: 'tut-teknologi-21', slug: 'cara-hemat-kuota', judul: 'Cara Menghemat Kuota Internet',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Kuota cepat habis.',
    penjelasan: 'Atur aplikasi & kualitas konten.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Batasi background data', detail: 'Matikan data latar aplikasi boros.' },
      { judul: 'Turunkan kualitas video', detail: '480p cukup untuk HP.' },
      { judul: 'Download via WiFi', detail: 'Musik & video offline.' },
      { judul: 'Mode hemat data', detail: 'Aktifkan di browser & sosmed.' },
      { judul: 'Cek pemakaian', detail: 'Pantau per aplikasi.' },
    ],
    risiko: [{ risiko: 'Update gagal', pencegahan: 'Update aplikasi penting via WiFi.' }],
    penyelesaian: 'Kuota awet 2x lipat.',
    tags: ['kuota', 'internet', 'hemat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_164: Tutorial[] = [
  {
    id: 'tut-perbaikan-21', slug: 'cara-perbaiki-keran', judul: 'Cara Memperbaiki Keran Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keran menetes terus.',
    penjelasan: 'Biasanya seal/karet aus.',
    persiapanAlat: ['Kunci inggris', 'Seal karet'],
    langkah: [
      { judul: 'Tutup air utama', detail: 'Putar stop kran.' },
      { judul: 'Bongkar keran', detail: 'Lepas handle & drat.' },
      { judul: 'Ganti seal', detail: 'Pasang karet baru.' },
      { judul: 'Pasang kembali', detail: 'Kencangkan secukupnya.' },
      { judul: 'Tes', detail: 'Buka air, cek tetesan.' },
    ],
    risiko: [{ risiko: 'Drat rusak', pencegahan: 'Jangan paksa kunci.' }],
    penyelesaian: 'Keran rapat kembali.',
    tags: ['keran', 'bocor', 'perbaikan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_165: Tutorial[] = [
  {
    id: 'tut-alat-19', slug: 'cara-pakai-multimeter', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin ukur tegangan tapi takut salah.',
    penjelasan: 'Multimeter = ukur V, A, Ohm.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V~ untuk AC, V- untuk DC.' },
      { judul: 'Pasang probe', detail: 'Hitam COM, merah V.' },
      { judul: 'Ukur', detail: 'Tempel paralel ke titik ukur.' },
      { judul: 'Baca display', detail: 'Catat hasilnya.' },
      { judul: 'Matikan', detail: 'Cabut probe, putar ke OFF.' },
    ],
    risiko: [{ risiko: 'Korsleting', pencegahan: 'Jangan ukur arus paralel. Mulai dari range terbesar.' }],
    penyelesaian: 'Bisa ukur listrik dengan aman.',
    tags: ['multimeter', 'listrik', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_166: Tutorial[] = [
  {
    id: 'tut-kerja-27', slug: 'cara-buat-linkedin', judul: 'Cara Membuat LinkedIn yang Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Profil LinkedIn sepi, tidak dilirik recruiter.',
    penjelasan: 'LinkedIn = CV hidup.',
    persiapanAlat: ['Foto profesional'],
    langkah: [
      { judul: 'Foto & headline', detail: 'Headline = keahlian, bukan jabatan.' },
      { judul: 'Ringkasan', detail: '3 paragraf: siapa, bisa apa, cari apa.' },
      { judul: 'Pengalaman', detail: 'Bullets hasil, bukan tugas.' },
      { judul: 'Skill & endorsemen', detail: 'Isi 10 skill relevan.' },
      { judul: 'Aktif posting', detail: 'Share insight tiap minggu.' },
    ],
    risiko: [{ risiko: 'Scam lowongan', pencegahan: 'Jangan bayar untuk melamar.' }],
    penyelesaian: 'Dililihat recruiter.',
    tags: ['linkedin', 'karier', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_167: Tutorial[] = [
  {
    id: 'tut-umkm-22', slug: 'cara-daftar-nib', judul: 'Cara Mendaftar NIB via OSS',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Usaha belum berizin.',
    penjelasan: 'NIB = izin usaha via oss.go.id.',
    persiapanAlat: ['KTP', 'NPWP (bila ada)'],
    langkah: [
      { judul: 'Buka oss.go.id', detail: 'Daftar akun.' },
      { judul: 'Isi data', detail: 'Data diri & usaha.' },
      { judul: 'Pilih KBLI', detail: 'Sesuai jenis usaha.' },
      { judul: 'Verifikasi', detail: 'Cek email.' },
      { judul: 'Unduh NIB', detail: 'Gratis, langsung terbit.' },
    ],
    risiko: [{ risiko: 'Data salah', pencegahan: 'Periksa sebelum submit.' }],
    penyelesaian: 'Usaha resmi berizin.',
    tags: ['nib', 'oss', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_168: Tutorial[] = [
  {
    id: 'tut-kesehatan-21', slug: 'cara-turunkan-demam', judul: 'Cara Menurunkan Demam Anak',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Anak demam, orang tua panik.',
    penjelasan: 'Demam = respons imun. Tangani bertahap.',
    persiapanAlat: ['Termometer'],
    langkah: [
      { judul: 'Ukur suhu', detail: 'Demam = >37,5 C.' },
      { judul: 'Kompres hangat', detail: 'Dahi & ketiak, bukan dingin.' },
      { judul: 'Cukupi cairan', detail: 'Air, ASI, oralit.' },
      { judul: 'Paracetamol', detail: 'Sesuai dosis berat badan.' },
      { judul: 'Pakaian tipis', detail: 'Jangan diselimuti tebal.' },
    ],
    risiko: [{ risiko: 'Kejang demam', pencegahan: 'Ke dokter bila >39 C / kejang / lemas.' }],
    penyelesaian: 'Demam turun, anak nyaman.',
    tags: ['demam', 'anak', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_169: Tutorial[] = [
  {
    id: 'tut-belajar-23', slug: 'cara-buat-mindmap', judul: 'Cara Membuat Mind Map',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Catatan linear sulit diingat.',
    penjelasan: 'Mind map = visualisasi ide bercabang.',
    persiapanAlat: ['Kertas', 'Spidol warna'],
    langkah: [
      { judul: 'Topik di tengah', detail: 'Tulis & lingkari.' },
      { judul: 'Cabang utama', detail: '5-7 cabang ide besar.' },
      { judul: 'Sub-cabang', detail: 'Detail tiap ide.' },
      { judul: 'Warna & gambar', detail: 'Visual bantu ingatan.' },
      { judul: 'Review', detail: 'Jelaskan ulang dari peta.' },
    ],
    risiko: [{ risiko: 'Terlalu ramai', pencegahan: 'Maks 3 level cabang.' }],
    penyelesaian: 'Materi mudah diingat.',
    tags: ['mindmap', 'catatan', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_170: Tutorial[] = [
  {
    id: 'tut-mental-29', slug: 'cara-atasi-insomnia', judul: 'Cara Mengatasi Insomnia',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sulit tidur tiap malam.',
    penjelasan: 'Sleep hygiene = kunci tidur nyenyak.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Tidur & bangun jam sama.' },
      { judul: 'Jauhi layar 1 jam', detail: 'Sebelum tidur.' },
      { judul: 'Kamar gelap & sejuk', detail: '18-22 C ideal.' },
      { judul: 'Hindari kafein sore', detail: 'Batas jam 2 siang.' },
      { judul: 'Ritual relaksasi', detail: 'Baca / meditasi ringan.' },
    ],
    risiko: [{ risiko: 'Gangguan tidur kronis', pencegahan: 'Ke dokter bila >1 bulan.' }],
    penyelesaian: 'Tidur nyenyak tiap malam.',
    tags: ['insomnia', 'tidur', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_171: Tutorial[] = [
  {
    id: 'tut-kehidupan-29', slug: 'cara-urus-akta', judul: 'Cara Mengurus Akta Kelahiran',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Anak belum punya akta kelahiran.',
    penjelasan: 'Akta via Disdukcapil, kini bisa online.',
    persiapanAlat: ['KK', 'Surat lahir RS'],
    langkah: [
      { judul: 'Siapkan dokumen', detail: 'KK, KTP ortu, surat lahir.' },
      { judul: 'Daftar online', detail: 'Aplikasi Dukcapil daerah.' },
      { judul: 'Verifikasi', detail: 'Datang bila diminta.' },
      { judul: 'Akta terbit', detail: 'Gratis, 1-14 hari.' },
      { judul: 'Update KK', detail: 'Nama anak masuk KK.' },
    ],
    risiko: [{ risiko: 'Denda keterlambatan', pencegahan: 'Urus <60 hari setelah lahir.' }],
    penyelesaian: 'Anak punya identitas resmi.',
    tags: ['akta', 'dokumen', 'dukcapil'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_172: Tutorial[] = [
  {
    id: 'tut-keuangan-30', slug: 'cara-buka-rekening', judul: 'Cara Membuka Rekening Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Belum punya rekening bank.',
    penjelasan: 'Buka rekening kini bisa online.',
    persiapanAlat: ['KTP', 'HP'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Bandingkan biaya admin.' },
      { judul: 'Daftar online', detail: 'Via aplikasi bank.' },
      { judul: 'Video call verifikasi', detail: 'Siapkan KTP asli.' },
      { judul: 'Setoran awal', detail: 'Rp50-500rb tergantung bank.' },
      { judul: 'Aktifkan m-banking', detail: 'Buat PIN aman.' },
    ],
    risiko: [{ risiko: 'Penipuan', pencegahan: 'Hanya via aplikasi resmi bank.' }],
    penyelesaian: 'Punya rekening & m-banking.',
    tags: ['bank', 'rekening', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_173: Tutorial[] = [
  {
    id: 'tut-teknologi-22', slug: 'cara-aktifkan-2fa', judul: 'Cara Mengaktifkan 2FA',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Akun mudah diretas.',
    penjelasan: '2FA = password + kode kedua.',
    persiapanAlat: ['HP', 'Aplikasi authenticator'],
    langkah: [
      { judul: 'Buka pengaturan keamanan', detail: 'Akun Google/sosmed.' },
      { judul: 'Aktifkan verifikasi 2 langkah', detail: 'Pilih authenticator.' },
      { judul: 'Scan QR', detail: 'Dengan aplikasi authenticator.' },
      { judul: 'Simpan kode cadangan', detail: 'Di tempat aman.' },
      { judul: 'Tes login', detail: 'Pastikan kode berfungsi.' },
    ],
    risiko: [{ risiko: 'Terkunci akun', pencegahan: 'Simpan kode cadangan & nomor pemulihan.' }],
    penyelesaian: 'Akun jauh lebih aman.',
    tags: ['2fa', 'keamanan', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_174: Tutorial[] = [
  {
    id: 'tut-umkm-23', slug: 'cara-pasang-iklan-fb', judul: 'Cara Pasang Iklan Facebook',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Jualan sepi, butuh pembeli baru.',
    penjelasan: 'FB Ads = target presisi.',
    persiapanAlat: ['Akun FB', 'Budget Rp50rb'],
    langkah: [
      { judul: 'Buka Ads Manager', detail: 'business.facebook.com.' },
      { judul: 'Pilih objektif', detail: 'Traffic / konversi.' },
      { judul: 'Target audiens', detail: 'Usia, lokasi, minat.' },
      { judul: 'Budget kecil dulu', detail: 'Rp20rb/hari untuk tes.' },
      { judul: 'Analisis & skala', detail: 'Naikkan yang ROAS bagus.' },
    ],
    risiko: [{ risiko: 'Boncos', pencegahan: 'Tes kecil dulu, jangan langsung besar.' }],
    penyelesaian: 'Iklan jalan & terukur.',
    tags: ['iklan', 'facebook', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_175: Tutorial[] = [
  {
    id: 'tut-belajar-24', slug: 'cara-ikut-olimpiade', judul: 'Cara Mengikuti Olimpiade Sains',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Ingin ikut OSN tapi tidak tahu mulai dari mana.',
    penjelasan: 'Olimpiade = latihan soal + konsistensi.',
    persiapanAlat: ['Buku OSN'],
    langkah: [
      { judul: 'Pilih bidang', detail: 'Matematika, IPA, dll.' },
      { judul: 'Pelajari silabus', detail: 'Di atas kurikulum sekolah.' },
      { judul: 'Latihan soal tahun lalu', detail: 'Minimal 3 tahun.' },
      { judul: 'Ikut seleksi sekolah', detail: 'OSK → OSP → OSN.' },
      { judul: 'Konsisten 1 jam/hari', detail: 'Sedikit tapi rutin.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Jaga istirahat & main.' }],
    penyelesaian: 'Siap seleksi olimpiade.',
    tags: ['olimpiade', 'osn', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_176: Tutorial[] = [
  {
    id: 'tut-kehidupan-30', slug: 'cara-urus-paspor', judul: 'Cara Mengurus Paspor Baru',
    kategori: 'kehidupan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin ke luar negeri tapi belum punya paspor.',
    penjelasan: 'Paspor via M-Paspor / kantor imigrasi.',
    persiapanAlat: ['KTP', 'KK', 'Akta'],
    langkah: [
      { judul: 'Daftar M-Paspor', detail: 'Pilih jadwal & kantor.' },
      { judul: 'Datang wawancara', detail: 'Bawa dokumen asli.' },
      { judul: 'Foto & biometrik', detail: 'Di lokasi.' },
      { judul: 'Bayar', detail: 'Rp350rb (biasa) / Rp650rb (elektronik).' },
      { judul: 'Ambil paspor', detail: '3-4 hari kerja.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Dokumen lengkap & jujur.' }],
    penyelesaian: 'Paspor terbit.',
    tags: ['paspor', 'imigrasi', 'dokumen'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_177: Tutorial[] = [
  {
    id: 'tut-kerja-28', slug: 'cara-negosiasi-gaji', judul: 'Cara Negosiasi Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Tawaran gaji di bawah ekspektasi.',
    penjelasan: 'Negosiasi = data + percaya diri.',
    persiapanAlat: ['Riset gaji pasar'],
    langkah: [
      { judul: 'Riset range gaji', detail: 'Glassdoor, Jobstreet.' },
      { judul: 'Tunggu tawaran dulu', detail: 'Jangan sebut angka duluan.' },
      { judul: 'Minta waktu', detail: 'Pikir 1-2 hari.' },
      { judul: 'Ajukan counter', detail: '10-20% di atas tawaran.' },
      { judul: 'Negosiasi benefit', detail: 'Bila gaji mentok.' },
    ],
    risiko: [{ risiko: 'Tawaran ditarik', pencegahan: 'Tetap sopan & realistis.' }],
    penyelesaian: 'Gaji sesuai nilai.',
    tags: ['gaji', 'negosiasi', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_178: Tutorial[] = [
  {
    id: 'tut-perbaikan-22', slug: 'cara-tambal-ban', judul: 'Cara Menambal Ban Tubeless',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ban bocor di jalan.',
    penjelasan: 'Tubeless bisa ditambal cacing.',
    persiapanAlat: ['Kit tambal cacing'],
    langkah: [
      { judul: 'Temukan lubang', detail: 'Dengar desis / air sabun.' },
      { judul: 'Bersihkan', detail: 'Cabut paku.' },
      { judul: 'Tusuk cacing', detail: 'Masukkan karet cacing.' },
      { judul: 'Potong sisa', detail: 'Ratakan.' },
      { judul: 'Pompa', detail: 'Cek tekanan.' },
    ],
    risiko: [{ risiko: 'Bocor lagi', pencegahan: 'Ke tambal ban bila lubang besar.' }],
    penyelesaian: 'Ban bisa dipakai lagi.',
    tags: ['ban', 'tambal', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_179: Tutorial[] = [
  {
    id: 'tut-alat-20', slug: 'cara-pakai-bor', judul: 'Cara Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin pasang rak tapi tidak bisa bor.',
    penjelasan: 'Bor = putar + tekan, pilih mata tepat.',
    persiapanAlat: ['Bor', 'Mata bor'],
    langkah: [
      { judul: 'Pilih mata bor', detail: 'Kayu, beton, besi berbeda.' },
      { judul: 'Tandai titik', detail: 'Pensil / paku.' },
      { judul: 'Mode bor', detail: 'Bukan hammer untuk kayu.' },
      { judul: 'Bor perlahan', detail: 'Tekan stabil, jangan goyang.' },
      { judul: 'Pasang fisher', detail: 'Untuk dinding beton.' },
    ],
    risiko: [{ risiko: 'Kena kabel listrik', pencegahan: 'Cek detektor kabel di dinding.' }],
    penyelesaian: 'Lubang rapi, rak terpasang.',
    tags: ['bor', 'tukang', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_180: Tutorial[] = [
  {
    id: 'tut-keuangan-31', slug: 'cara-hindari-pinjol', judul: 'Cara Keluar dari Jerat Pinjol',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Terjebak pinjol ilegal.',
    penjelasan: 'Stop gali lubang, hadapi dengan strategi.',
    persiapanAlat: ['Daftar semua utang'],
    langkah: [
      { judul: 'Stop pinjam baru', detail: 'Tutup semua aplikasi.' },
      { judul: 'Daftar utang', detail: 'Pokok, bunga, tenor.' },
      { judul: 'Lapor pinjol ilegal', detail: 'Ke OJK / SWI.' },
      { judul: 'Negosiasi', detail: 'Minta keringanan / cicil pokok.' },
      { judul: 'Fokus lunasi', detail: 'Bunga terbesar dulu.' },
    ],
    risiko: [{ risiko: 'Teror debt collector', pencegahan: 'Blokir nomor. Lapor bila ancaman.' }],
    penyelesaian: 'Bebas pinjol.',
    tags: ['pinjol', 'utang', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_181: Tutorial[] = [
  {
    id: 'tut-teknologi-23', slug: 'cara-backup-hp', judul: 'Cara Backup HP Android',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Data hilang saat HP rusak.',
    penjelasan: 'Backup otomatis ke cloud.',
    persiapanAlat: ['Akun Google'],
    langkah: [
      { judul: 'Aktifkan backup', detail: 'Pengaturan > Google > Backup.' },
      { judul: 'Backup foto', detail: 'Google Photos.' },
      { judul: 'Backup chat WA', detail: 'Ke Google Drive.' },
      { judul: 'Catat akun', detail: 'Email & password.' },
      { judul: 'Tes restore', detail: 'Di HP lain bila perlu.' },
    ],
    risiko: [{ risiko: 'Lupa password', pencegahan: 'Simpan di password manager.' }],
    penyelesaian: 'Data aman & bisa dipulihkan.',
    tags: ['backup', 'android', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_182: Tutorial[] = [
  {
    id: 'tut-umkm-24', slug: 'cara-buat-toko-shopee', judul: 'Cara Membuka Toko di Shopee',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin jualan online tapi bingung mulai.',
    penjelasan: 'Shopee = marketplace termudah untuk pemula.',
    persiapanAlat: ['KTP', 'Rekening'],
    langkah: [
      { judul: 'Daftar akun', detail: 'Via aplikasi Shopee.' },
      { judul: 'Buka toko', detail: 'Isi nama & deskripsi.' },
      { judul: 'Upload produk', detail: 'Foto bagus + deskripsi jelas.' },
      { judul: 'Atur ongkir', detail: 'Aktifkan jasa kirim.' },
      { judul: 'Promosikan', detail: 'Voucher & live.' },
    ],
    risiko: [{ risiko: 'Penipuan buyer', pencegahan: 'Hanya via sistem Shopee.' }],
    penyelesaian: 'Toko online aktif.',
    tags: ['shopee', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_183: Tutorial[] = [
  {
    id: 'tut-belajar-25', slug: 'cara-efektif-belajar', judul: 'Cara Belajar yang Efektif',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Belajar lama tapi tidak paham.',
    penjelasan: 'Active recall + spaced repetition.',
    persiapanAlat: ['Materi'],
    langkah: [
      { judul: 'Baca sekilas', detail: 'Pahami struktur.' },
      { judul: 'Tutup & ingat', detail: 'Active recall.' },
      { judul: 'Ulangi besok', detail: 'Spaced repetition.' },
      { judul: 'Kerjakan soal', detail: 'Tanpa lihat jawaban.' },
      { judul: 'Ajari orang lain', detail: 'Teknik Feynman.' },
    ],
    risiko: [{ risiko: 'Hafal tanpa paham', pencegahan: 'Fokus konsep, bukan kata.' }],
    penyelesaian: 'Belajar efisien & paham.',
    tags: ['belajar', 'efektif', 'ujian'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_184: Tutorial[] = [
  {
    id: 'tut-mental-30', slug: 'cara-kelola-emosi', judul: 'Cara Mengelola Emosi',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Mudah marah & menyesal.',
    penjelasan: 'Emosi = sinyal, bukan perintah.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Kenali pemicu', detail: 'Catat kapan marah.' },
      { judul: 'Jeda 10 detik', detail: 'Tarik napas sebelum bicara.' },
      { judul: 'Namai emosi', detail: '"Aku sedang frustrasi".' },
      { judul: 'Salurkan sehat', detail: 'Olahraga / tulis.' },
      { judul: 'Bicara saat tenang', detail: 'Bukan saat meledak.' },
    ],
    risiko: [{ risiko: 'Merusak hubungan', pencegahan: 'Minta maaf bila kelepasan.' }],
    penyelesaian: 'Emosi terkendali.',
    tags: ['emosi', 'marah', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_185: Tutorial[] = [
  {
    id: 'tut-kehidupan-31', slug: 'cara-urus-kk', judul: 'Cara Mengurus Kartu Keluarga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'KK hilang / perlu update.',
    penjelasan: 'KK via Disdukcapil, bisa online.',
    persiapanAlat: ['KTP', 'Dokumen pendukung'],
    langkah: [
      { judul: 'Siapkan dokumen', detail: 'KTP, akta, surat nikah.' },
      { judul: 'Daftar online', detail: 'Aplikasi Dukcapil.' },
      { judul: 'Verifikasi', detail: 'Datang bila diminta.' },
      { judul: 'KK terbit', detail: 'Barcode, tanpa tanda tangan basah.' },
      { judul: 'Cetak mandiri', detail: 'Kertas HVS biasa.' },
    ],
    risiko: [{ risiko: 'Data tidak sinkron', pencegahan: 'Cek NIK di Dukcapil.' }],
    penyelesaian: 'KK baru terbit.',
    tags: ['kk', 'dukcapil', 'dokumen'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_186: Tutorial[] = [
  {
    id: 'tut-keuangan-32', slug: 'cara-buka-deposito', judul: 'Cara Membuka Deposito',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tabungan tergerus inflasi.',
    penjelasan: 'Deposito = bunga lebih tinggi, dana dikunci.',
    persiapanAlat: ['Rekening', 'Dana minimal'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Bandingkan suku bunga.' },
      { judul: 'Tentukan tenor', detail: '1, 3, 6, 12 bulan.' },
      { judul: 'Buka via m-banking', detail: 'Atau ke cabang.' },
      { judul: 'Setor dana', detail: 'Minimal Rp1-10 juta.' },
      { judul: 'Perpanjang otomatis', detail: 'ARO bila mau.' },
    ],
    risiko: [{ risiko: 'Dana terkunci', pencegahan: 'Sisakan dana darurat di tabungan.' }],
    penyelesaian: 'Dana tumbuh lebih cepat.',
    tags: ['deposito', 'tabungan', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_187: Tutorial[] = [
  {
    id: 'tut-teknologi-24', slug: 'cara-amankan-wifi', judul: 'Cara Mengamankan WiFi Rumah',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'WiFi lemot karena dipakai tetangga.',
    penjelasan: 'Amankan router dari akses liar.',
    persiapanAlat: ['Akses admin router'],
    langkah: [
      { judul: 'Ganti password admin', detail: 'Jangan pakai default.' },
      { judul: 'Password WiFi kuat', detail: 'WPA2/WPA3, 12+ karakter.' },
      { judul: 'Sembunyikan SSID', detail: 'Opsional.' },
      { judul: 'Update firmware', detail: 'Rutin.' },
      { judul: 'Cek perangkat', detail: 'Blokir yang asing.' },
    ],
    risiko: [{ risiko: 'Lupa password admin', pencegahan: 'Catat di tempat aman.' }],
    penyelesaian: 'WiFi aman & cepat.',
    tags: ['wifi', 'keamanan', 'router'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_188: Tutorial[] = [
  {
    id: 'tut-umkm-25', slug: 'cara-hitung-ongkir', judul: 'Cara Menghitung Ongkir yang Tepat',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Rugi karena salah hitung ongkir.',
    penjelasan: 'Ongkir = berat volumetrik.',
    persiapanAlat: ['Timbangan'],
    langkah: [
      { judul: 'Timbang paket', detail: 'Berat aktual.' },
      { judul: 'Hitung volumetrik', detail: 'P×L×T ÷ 6000.' },
      { judul: 'Ambil terbesar', detail: 'Aktual vs volumetrik.' },
      { judul: 'Cek tarif', detail: 'Per zona.' },
      { judul: 'Tambah margin', detail: 'Packing & asuransi.' },
    ],
    risiko: [{ risiko: 'Customer kabur', pencegahan: 'Ongkir transparan di awal.' }],
    penyelesaian: 'Ongkir akurat & adil.',
    tags: ['ongkir', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_189: Tutorial[] = [
  {
    id: 'tut-belajar-26', slug: 'cara-hafal-cepat', judul: 'Cara Menghafal dengan Cepat',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sulit menghafal pelajaran.',
    penjelasan: 'Mnemonik + repetisi.',
    persiapanAlat: ['Materi hafalan'],
    langkah: [
      { judul: 'Pecah kecil', detail: 'Chunking 7±2 item.' },
      { judul: 'Buat asosiasi', detail: 'Gambar lucu / cerita.' },
      { judul: 'Istana memori', detail: 'Tempel di rute familiar.' },
      { judul: 'Ulangi terjadwal', detail: '1 jam, 1 hari, 1 minggu.' },
      { judul: 'Tulis ulang', detail: 'Dari ingatan.' },
    ],
    risiko: [{ risiko: 'Lupa saat ujian', pencegahan: 'Simulasi kondisi ujian.' }],
    penyelesaian: 'Hafalan melekat lama.',
    tags: ['hafal', 'mnemonik', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_190: Tutorial[] = [
  {
    id: 'tut-mental-31', slug: 'cara-atasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran tidak berhenti berputar.',
    penjelasan: 'Overthinking = takut masa depan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Tulis kekhawatiran', detail: 'Keluarkan dari kepala.' },
      { judul: 'Pisahkan fakta & asumsi', detail: 'Fokus yang bisa dikontrol.' },
      { judul: 'Batasi waktu mikir', detail: '15 menit, lalu aksi.' },
      { judul: 'Aksi kecil', detail: 'Satu langkah nyata.' },
      { judul: 'Grounding 5-4-3-2-1', detail: 'Kembali ke saat ini.' },
    ],
    risiko: [{ risiko: 'Anxiety berat', pencegahan: 'Ke psikolog bila mengganggu fungsi.' }],
    penyelesaian: 'Pikiran lebih tenang.',
    tags: ['overthinking', 'cemas', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_191: Tutorial[] = [
  {
    id: 'tut-kehidupan-32', slug: 'cara-hadapi-kegagalan', judul: 'Cara Menghadapi Kegagalan',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gagal & ingin menyerah.',
    penjelasan: 'Gagal = data, bukan vonis.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Terima emosi', detail: 'Sedih itu wajar.' },
      { judul: 'Jeda', detail: 'Istirahat, bukan berhenti.' },
      { judul: 'Evaluasi', detail: 'Apa yang bisa diperbaiki?' },
      { judul: 'Rencana baru', detail: 'Pendekatan berbeda.' },
      { judul: 'Coba lagi', detail: 'Langkah kecil.' },
    ],
    risiko: [{ risiko: 'Putus asa', pencegahan: 'Cari dukungan / profesional bila perlu.' }],
    penyelesaian: 'Bangkit lebih bijak.',
    tags: ['gagal', 'bangkit', 'motivasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_192: Tutorial[] = [
  {
    id: 'tut-keuangan-33', slug: 'cara-buat-dana-darurat', judul: 'Cara Membangun Dana Darurat',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Panik saat ada kejadian tak terduga.',
    penjelasan: 'Dana darurat = 3-6x pengeluaran.',
    persiapanAlat: ['Rekening terpisah'],
    langkah: [
      { judul: 'Hitung pengeluaran', detail: 'Rata-rata bulanan.' },
      { judul: 'Target awal', detail: '1x pengeluaran dulu.' },
      { judul: 'Sisihkan otomatis', detail: '10% gaji.' },
      { judul: 'Naikkan bertahap', detail: 'Sampai 6x.' },
      { judul: 'Jangan diutak-atik', detail: 'Hanya darurat.' },
    ],
    risiko: [{ risiko: 'Terpakai untuk keinginan', pencegahan: 'Rekening tanpa kartu ATM.' }],
    penyelesaian: 'Tidur lebih tenang.',
    tags: ['dana darurat', 'tabungan', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_193: Tutorial[] = [
  {
    id: 'tut-teknologi-25', slug: 'cara-backup-data', judul: 'Cara Backup Data Penting',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut data hilang.',
    penjelasan: '3-2-1: 3 salinan, 2 media, 1 offsite.',
    persiapanAlat: ['Cloud / HDD eksternal'],
    langkah: [
      { judul: 'Identifikasi penting', detail: 'Foto, dokumen, kerja.' },
      { judul: 'Backup cloud', detail: 'Google Drive / OneDrive.' },
      { judul: 'Backup fisik', detail: 'HDD eksternal.' },
      { judul: 'Otomatisasi', detail: 'Jadwal rutin.' },
      { judul: 'Test restore', detail: 'Pastikan bisa dibuka.' },
    ],
    risiko: [{ risiko: 'Ransomware', pencegahan: 'Backup offline terpisah.' }],
    penyelesaian: 'Data aman.',
    tags: ['backup', 'data', 'keamanan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_194: Tutorial[] = [
  {
    id: 'tut-umkm-26', slug: 'cara-daftar-merek', judul: 'Cara Mendaftarkan Merek Dagang',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Merek dipakai orang lain.',
    penjelasan: 'Daftar ke DJKI Kemenkumham.',
    persiapanAlat: ['Logo', 'KTP', 'NPWP'],
    langkah: [
      { judul: 'Cek ketersediaan', detail: 'Di dgip.go.id.' },
      { judul: 'Siapkan dokumen', detail: 'Logo, KTP, NPWP.' },
      { judul: 'Daftar online', detail: 'Isi form DJKI.' },
      { judul: 'Bayar PNBP', detail: '~Rp1,8 juta.' },
      { judul: 'Tunggu pemeriksaan', detail: '6-12 bulan.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Pastikan unik & tidak deskriptif.' }],
    penyelesaian: 'Merek terlindungi 10 tahun.',
    tags: ['merek', 'haki', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_195: Tutorial[] = [
  {
    id: 'tut-belajar-27', slug: 'cara-fokus-belajar', judul: 'Cara Fokus Saat Belajar',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Belajar 5 menit langsung pegang HP.',
    penjelasan: 'Fokus = otot yang dilatih.',
    persiapanAlat: ['Timer'],
    langkah: [
      { judul: 'Singkirkan HP', detail: 'Mode pesawat / ruangan lain.' },
      { judul: 'Pomodoro', detail: '25 menit fokus, 5 istirahat.' },
      { judul: 'Satu tugas', detail: 'Multitasking itu mitos.' },
      { judul: 'Lingkungan rapi', detail: 'Meja bersih.' },
      { judul: 'Target jelas', detail: 'Tulis sebelum mulai.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Istirahat cukup.' }],
    penyelesaian: 'Belajar lebih efektif.',
    tags: ['fokus', 'pomodoro', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_196: Tutorial[] = [
  {
    id: 'tut-kehidupan-33', slug: 'cara-atur-waktu', judul: 'Cara Mengatur Waktu Harian',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Sehari terasa kurang.',
    penjelasan: 'Time blocking + prioritas.',
    persiapanAlat: ['Agenda / aplikasi'],
    langkah: [
      { judul: 'Catat semua tugas', detail: 'Brain dump.' },
      { judul: 'Prioritaskan', detail: 'Eisenhower matrix.' },
      { judul: 'Blok waktu', detail: 'Kalender harian.' },
      { judul: 'Buffer', detail: '30 menit antar blok.' },
      { judul: 'Review malam', detail: 'Evaluasi & rencanakan besok.' },
    ],
    risiko: [{ risiko: 'Terlalu padat', pencegahan: 'Sisakan waktu luang.' }],
    penyelesaian: 'Hari lebih terkendali.',
    tags: ['waktu', 'produktivitas', 'hidup'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_197: Tutorial[] = [
  {
    id: 'tut-keuangan-34', slug: 'cara-pilih-asuransi', judul: 'Cara Memilih Asuransi yang Tepat',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bingung pilih asuransi.',
    penjelasan: 'Proteksi dulu, investasi belakangan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Hitung kebutuhan', detail: 'UP = 10x pengeluaran tahunan.' },
      { judul: 'Prioritas kesehatan', detail: 'BPJS + top up.' },
      { judul: 'Pilih term life', detail: 'Murah & murni proteksi.' },
      { judul: 'Cek klaim ratio', detail: 'Perusahaan terpercaya.' },
      { judul: 'Baca pengecualian', detail: 'Pahami polis.' },
    ],
    risiko: [{ risiko: 'Unit link merugikan', pencegahan: 'Pisahkan proteksi & investasi.' }],
    penyelesaian: 'Proteksi keluarga aman.',
    tags: ['asuransi', 'proteksi', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_198: Tutorial[] = [
  {
    id: 'tut-teknologi-26', slug: 'cara-kenali-phishing', judul: 'Cara Mengenali Phishing',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Takut kena tipu online.',
    penjelasan: 'Phishing = pancingan data.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cek pengirim', detail: 'Domain resmi?' },
      { judul: 'Jangan klik sembarang', detail: 'Hover link dulu.' },
      { judul: 'Waspada urgensi', detail: '"Akun diblokir" = jebakan.' },
      { judul: 'Cek ejaan', detail: 'Typo = palsu.' },
      { judul: 'Verifikasi jalur resmi', detail: 'Buka aplikasi langsung.' },
    ],
    risiko: [{ risiko: 'Kehilangan akun', pencegahan: '2FA aktif.' }],
    penyelesaian: 'Lebih waspada digital.',
    tags: ['phishing', 'keamanan', 'penipuan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_199: Tutorial[] = [
  {
    id: 'tut-umkm-27', slug: 'cara-foto-produk-hp', judul: 'Cara Foto Produk Pakai HP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Foto produk jelek, pembeli kabur.',
    penjelasan: 'Cahaya + komposisi cukup.',
    persiapanAlat: ['HP', 'Kertas putih'],
    langkah: [
      { judul: 'Cahaya alami', detail: 'Dekat jendela.' },
      { judul: 'Background putih', detail: 'Kertas / kain.' },
      { judul: 'Stabil', detail: 'Tripod / sandaran.' },
      { judul: 'Beberapa angle', detail: 'Depan, samping, detail.' },
      { judul: 'Edit ringan', detail: 'Cerahkan, crop.' },
    ],
    risiko: [{ risiko: 'Warna tidak akurat', pencegahan: 'Jangan over-filter.' }],
    penyelesaian: 'Foto menarik pembeli.',
    tags: ['foto produk', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_200: Tutorial[] = [
  {
    id: 'tut-belajar-28', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat & Paham',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Buku menumpuk tidak terbaca.',
    penjelasan: 'Speed reading + pemahaman.',
    persiapanAlat: ['Buku'],
    langkah: [
      { judul: 'Preview', detail: 'Daftar isi & heading.' },
      { judul: 'Tanya dulu', detail: 'Apa yang dicari?' },
      { judul: 'Chunking', detail: 'Baca per frasa.' },
      { judul: 'Jangan subvokal', detail: 'Kurangi suara dalam.' },
      { judul: 'Rangkum', detail: 'Tulis poin penting.' },
    ],
    risiko: [{ risiko: 'Tidak paham', pencegahan: 'Lambat di bagian sulit.' }],
    penyelesaian: 'Baca 2x lebih cepat.',
    tags: ['baca cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_201: Tutorial[] = [
  {
    id: 'tut-kerja-26', slug: 'cara-lolos-interview', judul: 'Cara Lolos Interview Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Selalu gagal di interview.',
    penjelasan: 'Persiapan + STAR method.',
    persiapanAlat: ['CV', 'Riset perusahaan'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Visi, produk, budaya.' },
      { judul: 'Latihan STAR', detail: 'Situasi-Tugas-Aksi-Hasil.' },
      { judul: 'Siapkan pertanyaan', detail: 'Tanya balik.' },
      { judul: 'Penampilan', detail: 'Rapi & tepat waktu.' },
      { judul: 'Follow up', detail: 'Email terima kasih.' },
    ],
    risiko: [{ risiko: 'Gugup', pencegahan: 'Simulasi dengan teman.' }],
    penyelesaian: 'Peluang diterima naik.',
    tags: ['interview', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_202: Tutorial[] = [
  {
    id: 'tut-mental-32', slug: 'cara-tidur-nyenyak', judul: 'Cara Tidur Nyenyak',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Insomnia & tidur tidak berkualitas.',
    penjelasan: 'Sleep hygiene.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Sama tiap hari.' },
      { judul: 'Kamar gelap dingin', detail: '18-22 derajat.' },
      { judul: 'No gadget 1 jam', detail: 'Sebelum tidur.' },
      { judul: 'Hindari kafein sore', detail: 'Setelah jam 14.' },
      { judul: 'Ritual relaksasi', detail: 'Baca / mandi hangat.' },
    ],
    risiko: [{ risiko: 'Gangguan tidur kronis', pencegahan: 'Ke dokter bila >1 bulan.' }],
    penyelesaian: 'Bangun segar.',
    tags: ['tidur', 'insomnia', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_203: Tutorial[] = [
  {
    id: 'tut-kehidupan-34', slug: 'cara-hadapi-tetangga', judul: 'Cara Menghadapi Tetangga Berisik',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tetangga berisik mengganggu.',
    penjelasan: 'Komunikasi dulu, hukum belakangan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Tegur baik-baik', detail: 'Sopan & langsung.' },
      { judul: 'Catat bukti', detail: 'Waktu & rekaman.' },
      { judul: 'Mediasi RT', detail: 'Libatkan perangkat.' },
      { judul: 'Surat tertulis', detail: 'Bila berlanjut.' },
      { judul: 'Lapor polisi', detail: 'Terakhir.' },
    ],
    risiko: [{ risiko: 'Konflik memanas', pencegahan: 'Tetap tenang, jangan emosi.' }],
    penyelesaian: 'Lingkungan kembali tenang.',
    tags: ['tetangga', 'konflik', 'hidup'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_204: Tutorial[] = [
  {
    id: 'tut-kerja-27', slug: 'cara-naik-gaji', judul: 'Cara Negosiasi Kenaikan Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Gaji stagnan bertahun-tahun.',
    penjelasan: 'Data + timing + alternatif.',
    persiapanAlat: ['Data pencapaian'],
    langkah: [
      { judul: 'Kumpulkan bukti', detail: 'Pencapaian terukur.' },
      { judul: 'Riset pasar', detail: 'Gaji posisi sejenis.' },
      { judul: 'Pilih momen', detail: 'Setelah sukses / review.' },
      { judul: 'Ajukan angka', detail: 'Spesifik & wajar.' },
      { judul: 'Siap alternatif', detail: 'Bonus / fleksibilitas.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Tanya syarat kenaikan berikutnya.' }],
    penyelesaian: 'Gaji naik / roadmap jelas.',
    tags: ['gaji', 'negosiasi', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_205: Tutorial[] = [
  {
    id: 'tut-umkm-28', slug: 'cara-buka-toko-shopee', judul: 'Cara Membuka Toko di Shopee',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin jualan online tapi bingung mulai.',
    penjelasan: 'Daftar seller Shopee langkah demi langkah.',
    persiapanAlat: ['KTP', 'Rekening', 'Foto produk'],
    langkah: [
      { judul: 'Daftar akun', detail: 'Aplikasi Shopee.' },
      { judul: 'Aktifkan seller', detail: 'Verifikasi KTP.' },
      { judul: 'Isi toko', detail: 'Nama, deskripsi, logo.' },
      { judul: 'Upload produk', detail: 'Foto + deskripsi jelas.' },
      { judul: 'Atur pengiriman', detail: 'Aktifkan jasa kirim.' },
    ],
    risiko: [{ risiko: 'Akun dibatasi', pencegahan: 'Ikuti aturan, jangan spam.' }],
    penyelesaian: 'Toko online siap jualan.',
    tags: ['shopee', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_206: Tutorial[] = [
  {
    id: 'tut-teknologi-27', slug: 'cara-bersihkan-hp', judul: 'Cara Membersihkan HP yang Lemot',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'HP lemot & memori penuh.',
    penjelasan: 'Bersihkan tanpa aplikasi aneh.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Hapus cache', detail: 'Pengaturan > penyimpanan.' },
      { judul: 'Uninstall jarang dipakai', detail: 'Bebaskan ruang.' },
      { judul: 'Pindah ke cloud', detail: 'Foto & video.' },
      { judul: 'Matikan animasi', detail: 'Opsi developer.' },
      { judul: 'Restart rutin', detail: 'Seminggu sekali.' },
    ],
    risiko: [{ risiko: 'Data terhapus', pencegahan: 'Backup dulu.' }],
    penyelesaian: 'HP lebih responsif.',
    tags: ['hp', 'lemot', 'bersih'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_207: Tutorial[] = [
  {
    id: 'tut-belajar-29', slug: 'cara-buat-mind-map', judul: 'Cara Membuat Mind Map',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Catatan berantakan & sulit diingat.',
    penjelasan: 'Peta pikiran visual.',
    persiapanAlat: ['Kertas / aplikasi'],
    langkah: [
      { judul: 'Topik di tengah', detail: 'Kata kunci utama.' },
      { judul: 'Cabang utama', detail: '5-7 cabang.' },
      { judul: 'Kata kunci', detail: '1 kata per cabang.' },
      { judul: 'Warna & gambar', detail: 'Visual membantu ingat.' },
      { judul: 'Kembangkan', detail: 'Sub-cabang detail.' },
    ],
    risiko: [{ risiko: 'Terlalu rumit', pencegahan: 'Sederhana dulu.' }],
    penyelesaian: 'Materi terpetakan jelas.',
    tags: ['mind map', 'catatan', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_208: Tutorial[] = [
  {
    id: 'tut-kerja-28', slug: 'cara-hadapi-bos', judul: 'Cara Menghadapi Bos yang Sulit',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Bos toxic & menekan.',
    penjelasan: 'Profesional + batasan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Pahami polanya', detail: 'Apa pemicunya?' },
      { judul: 'Dokumentasikan', detail: 'Simpan bukti tertulis.' },
      { judul: 'Komunikasi asertif', detail: 'Fakta, bukan emosi.' },
      { judul: 'Cari sekutu', detail: 'HR / atasan atas.' },
      { judul: 'Rencana keluar', detail: 'Bila tidak berubah.' },
    ],
    risiko: [{ risiko: 'Karier terhambat', pencegahan: 'Bangun reputasi & jaringan.' }],
    penyelesaian: 'Lingkungan kerja membaik / pindah.',
    tags: ['bos', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_209: Tutorial[] = [
  {
    id: 'tut-umkm-29', slug: 'cara-hitung-hpp', judul: 'Cara Menghitung HPP Produk',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Tidak tahu untung atau rugi.',
    penjelasan: 'HPP = bahan + tenaga + overhead.',
    persiapanAlat: ['Data biaya'],
    langkah: [
      { judul: 'Hitung bahan', detail: 'Per unit produk.' },
      { judul: 'Tenaga kerja', detail: 'Upah per unit.' },
      { judul: 'Overhead', detail: 'Listrik, sewa, dibagi unit.' },
      { judul: 'Total HPP', detail: 'Jumlahkan semua.' },
      { judul: 'Tentukan harga', detail: 'HPP + margin 30-50%.' },
    ],
    risiko: [{ risiko: 'Harga kemahalan', pencegahan: 'Efisiensi bahan & proses.' }],
    penyelesaian: 'Harga jual tepat & untung.',
    tags: ['hpp', 'harga', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_210: Tutorial[] = [
  {
    id: 'tut-mental-33', slug: 'cara-atasi-kesepian', judul: 'Cara Mengatasi Kesepian',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Merasa sendirian & kesepian.',
    penjelasan: 'Koneksi > jumlah teman.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Akui perasaan', detail: 'Wajar & umum.' },
      { judul: 'Hubungi satu orang', detail: 'Chat / telepon.' },
      { judul: 'Ikut komunitas', detail: 'Hobi / volunteering.' },
      { judul: 'Batasi sosmed', detail: 'Bandingkan diri = racun.' },
      { judul: 'Rutinitas sosial', detail: 'Jadwalkan ketemu.' },
    ],
    risiko: [{ risiko: 'Depresi', pencegahan: 'Ke profesional bila menetap.' }],
    penyelesaian: 'Merasa terhubung.',
    tags: ['kesepian', 'sosial', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_211: Tutorial[] = [
  {
    id: 'tut-kehidupan-35', slug: 'cara-hemat-listrik', judul: 'Cara Menghemat Listrik Rumah',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tagihan listrik membengkak.',
    penjelasan: 'Audit pemakaian & kebiasaan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Ganti LED', detail: 'Hemat 80%.' },
      { judul: 'Cabut standby', detail: 'TV, charger.' },
      { judul: 'AC 25 derajat', detail: 'Tiap derajat = 6%.' },
      { judul: 'Cuci sekaligus', detail: 'Mesin cuci penuh.' },
      { judul: 'Monitor token', detail: 'Pantau harian.' },
    ],
    risiko: [{ risiko: 'Tidak nyaman', pencegahan: 'Bertahap, bukan drastis.' }],
    penyelesaian: 'Tagihan turun 20-30%.',
    tags: ['listrik', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_212: Tutorial[] = [
  {
    id: 'tut-keuangan-35', slug: 'cara-hindari-pinjol', judul: 'Cara Terhindar dari Pinjol Ilegal',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Terjebak pinjol ilegal.',
    penjelasan: 'Kenali ciri & laporkan.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Cek OJK', detail: 'Hanya yang terdaftar.' },
      { judul: 'Waspada bunga', detail: '>0,3%/hari = ilegal.' },
      { judul: 'Jangan berikan akses', detail: 'Kontak & galeri.' },
      { judul: 'Lapor', detail: 'OJK 157 / polisi.' },
      { judul: 'Negosiasi', detail: 'Bila sudah terlanjur.' },
    ],
    risiko: [{ risiko: 'Teror debt collector', pencegahan: 'Lapor & blokir.' }],
    penyelesaian: 'Bebas jerat pinjol.',
    tags: ['pinjol', 'keuangan', 'waspada'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_213: Tutorial[] = [
  {
    id: 'tut-teknologi-28', slug: 'cara-pasang-2fa', judul: 'Cara Mengaktifkan 2FA',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Akun diretas.',
    penjelasan: 'Verifikasi dua langkah.',
    persiapanAlat: ['Aplikasi authenticator'],
    langkah: [
      { judul: 'Buka pengaturan keamanan', detail: 'Akun Google / sosmed.' },
      { judul: 'Aktifkan 2FA', detail: 'Pilih authenticator.' },
      { judul: 'Scan QR', detail: 'Dengan aplikasi.' },
      { judul: 'Simpan kode cadangan', detail: 'Di tempat aman.' },
      { judul: 'Test login', detail: 'Pastikan berfungsi.' },
    ],
    risiko: [{ risiko: 'Kunci akun sendiri', pencegahan: 'Simpan kode cadangan.' }],
    penyelesaian: 'Akun jauh lebih aman.',
    tags: ['2fa', 'keamanan', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_214: Tutorial[] = [
  {
    id: 'tut-umkm-30', slug: 'cara-live-selling', judul: 'Cara Live Selling yang Laris',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Live sepi penonton.',
    penjelasan: 'Energi + interaksi + promo.',
    persiapanAlat: ['HP', 'Ring light'],
    langkah: [
      { judul: 'Jadwal rutin', detail: 'Penonton tahu kapan.' },
      { judul: 'Hook 10 detik', detail: 'Promo di awal.' },
      { judul: 'Interaksi', detail: 'Sapa & jawab komen.' },
      { judul: 'Demo produk', detail: 'Tunjukkan detail.' },
      { judul: 'CTA jelas', detail: 'Checkout sekarang.' },
    ],
    risiko: [{ risiko: 'Kelelahan', pencegahan: 'Durasi 1-2 jam, bergantian.' }],
    penyelesaian: 'Penjualan naik.',
    tags: ['live', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_215: Tutorial[] = [
  {
    id: 'tut-belajar-30', slug: 'cara-ikut-olimpiade', judul: 'Cara Ikut Olimpiade Sains',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Ingin ikut OSN tapi tidak tahu mulai.',
    penjelasan: 'Persiapan olimpiade sains.',
    persiapanAlat: ['Buku olimpiade'],
    langkah: [
      { judul: 'Pilih bidang', detail: 'Matematika, IPA, dll.' },
      { judul: 'Pelajari silabus', detail: 'OSN kabupaten.' },
      { judul: 'Latihan soal', detail: 'Soal tahun lalu.' },
      { judul: 'Ikut seleksi', detail: 'Sekolah > kabupaten > provinsi.' },
      { judul: 'Konsisten', detail: 'Latihan harian.' },
    ],
    risiko: [{ risiko: 'Burnout', pencegahan: 'Jaga keseimbangan.' }],
    penyelesaian: 'Siap berkompetisi.',
    tags: ['olimpiade', 'osn', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_216: Tutorial[] = [
  {
    id: 'tut-kerja-29', slug: 'cara-buat-portofolio', judul: 'Cara Membuat Portofolio Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Lamaran ditolak terus.',
    penjelasan: 'Portofolio = bukti kerja.',
    persiapanAlat: ['Hasil kerja'],
    langkah: [
      { judul: 'Pilih 5-10 terbaik', detail: 'Kualitas > jumlah.' },
      { judul: 'Ceritakan proses', detail: 'Masalah-solusi-hasil.' },
      { judul: 'Buat online', detail: 'Website / PDF.' },
      { judul: 'Update rutin', detail: 'Tiap proyek baru.' },
      { judul: 'Sesuaikan lowongan', detail: 'Tonjolkan relevan.' },
    ],
    risiko: [{ risiko: 'Plagiarisme', pencegahan: 'Hanya karya sendiri.' }],
    penyelesaian: 'Lamaran lebih meyakinkan.',
    tags: ['portofolio', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_217: Tutorial[] = [
  {
    id: 'tut-alat-26', slug: 'cara-pakai-multimeter', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tidak tahu cara ukur listrik.',
    penjelasan: 'Multimeter: volt, ampere, ohm.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V, A, atau ohm.' },
      { judul: 'Colok probe', detail: 'Hitam COM, merah V.' },
      { judul: 'Ukur tegangan', detail: 'Paralel dengan beban.' },
      { judul: 'Ukur resistansi', detail: 'Matikan daya dulu.' },
      { judul: 'Baca hasil', detail: 'Perhatikan satuan.' },
    ],
    risiko: [{ risiko: 'Korsleting', pencegahan: 'Jangan ukur arus paralel.' }],
    penyelesaian: 'Bisa ukur dasar listrik.',
    tags: ['multimeter', 'listrik', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_218: Tutorial[] = [
  {
    id: 'tut-perbaikan-26', slug: 'cara-tambal-ban', judul: 'Cara Menambal Ban Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ban bocor di jalan.',
    penjelasan: 'Tambal tubeless darurat.',
    persiapanAlat: ['Kit tambal', 'Pompa'],
    langkah: [
      { judul: 'Temukan lubang', detail: 'Air sabun.' },
      { judul: 'Bersihkan', detail: 'Kikir lubang.' },
      { judul: 'Pasang cacing', detail: 'Dengan alat.' },
      { judul: 'Potong sisa', detail: 'Ratakan.' },
      { judul: 'Pompa', detail: 'Tekanan sesuai.' },
    ],
    risiko: [{ risiko: 'Tambalan lepas', pencegahan: 'Ke bengkel untuk permanen.' }],
    penyelesaian: 'Bisa jalan lagi.',
    tags: ['ban', 'tambal', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_219: Tutorial[] = [
  {
    id: 'tut-kerja-30', slug: 'cara-atur-gaji', judul: 'Cara Mengatur Gaji Bulanan',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Gaji habis sebelum akhir bulan.',
    penjelasan: '50-30-20 + pos wajib.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Catat pemasukan', detail: 'Gaji bersih.' },
      { judul: '50% kebutuhan', detail: 'Makan, kos, transport.' },
      { judul: '30% keinginan', detail: 'Hiburan.' },
      { judul: '20% tabungan', detail: 'Otomatis di awal.' },
      { judul: 'Evaluasi', detail: 'Tiap akhir bulan.' },
    ],
    risiko: [{ risiko: 'Gaya hidup naik', pencegahan: 'Naikkan tabungan dulu.' }],
    penyelesaian: 'Gaji cukup & ada sisa.',
    tags: ['gaji', 'atur', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_220: Tutorial[] = [
  {
    id: 'tut-umkm-31', slug: 'cara-buat-nib', judul: 'Cara Membuat NIB Online',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Usaha belum berizin.',
    penjelasan: 'NIB via OSS.',
    persiapanAlat: ['KTP', 'NPWP'],
    langkah: [
      { judul: 'Buka OSS', detail: 'oss.go.id.' },
      { judul: 'Daftar akun', detail: 'NIK & email.' },
      { judul: 'Isi data usaha', detail: 'KBLI sesuai.' },
      { judul: 'Terbitkan NIB', detail: 'Otomatis.' },
      { judul: 'Unduh', detail: 'Simpan PDF.' },
    ],
    risiko: [{ risiko: 'KBLI salah', pencegahan: 'Cek KBLI dengan teliti.' }],
    penyelesaian: 'Usaha resmi berizin.',
    tags: ['nib', 'izin', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_221: Tutorial[] = [
  {
    id: 'tut-belajar-31', slug: 'cara-ikut-beasiswa', judul: 'Cara Mendapatkan Beasiswa',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin kuliah tapi terkendala biaya.',
    penjelasan: 'Beasiswa dalam & luar negeri.',
    persiapanAlat: ['Rapor / transkrip'],
    langkah: [
      { judul: 'Cari info', detail: 'LPDP, Bidikmisi, swasta.' },
      { judul: 'Siapkan dokumen', detail: 'Rapor, sertifikat, esai.' },
      { judul: 'Tes bahasa', detail: 'TOEFL/IELTS bila perlu.' },
      { judul: 'Ikut seleksi', detail: 'Administrasi, tes, wawancara.' },
      { judul: 'Persiapkan mental', detail: 'Gagal = coba lagi.' },
    ],
    risiko: [{ risiko: 'Dokumen palsu', pencegahan: 'Jujur, blacklist bila ketahuan.' }],
    penyelesaian: 'Kuliah gratis.',
    tags: ['beasiswa', 'kuliah', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_222: Tutorial[] = [
  {
    id: 'tut-keuangan-29', slug: 'cara-hitung-bunga', judul: 'Cara Menghitung Bunga Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tidak paham bunga tabungan.',
    penjelasan: 'Bunga flat vs efektif.',
    persiapanAlat: ['Kalkulator'],
    langkah: [
      { judul: 'Cari suku bunga', detail: 'Di brosur bank.' },
      { judul: 'Hitung flat', detail: 'Pokok x % x waktu.' },
      { judul: 'Pahami efektif', detail: 'Sisa pokok menurun.' },
      { judul: 'Bandingkan', detail: 'Pilih paling untung.' },
      { judul: 'Cek biaya', detail: 'Admin & pajak.' },
    ],
    risiko: [{ risiko: 'Salah hitung', pencegahan: 'Minta simulasi bank.' }],
    penyelesaian: 'Paham bunga & memilih.',
    tags: ['bunga', 'bank', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_223: Tutorial[] = [
  {
    id: 'tut-kesehatan-28', slug: 'cara-hitung-imt', judul: 'Cara Menghitung IMT',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tidak tahu status berat badan.',
    penjelasan: 'IMT = BB / TB kuadrat.',
    persiapanAlat: ['Timbangan', 'Meteran'],
    langkah: [
      { judul: 'Timbang BB', detail: 'Dalam kg.' },
      { judul: 'Ukur TB', detail: 'Dalam meter.' },
      { judul: 'Hitung', detail: 'BB / (TB x TB).' },
      { judul: 'Kategorikan', detail: '18,5-24,9 normal.' },
      { judul: 'Tindak lanjut', detail: 'Atur pola makan.' },
    ],
    risiko: [{ risiko: 'IMT bukan segalanya', pencegahan: 'Konsultasi bila ragu.' }],
    penyelesaian: 'Tahu status & langkah.',
    tags: ['imt', 'berat', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_224: Tutorial[] = [
  {
    id: 'tut-teknologi-29', slug: 'cara-backup-hp', judul: 'Cara Backup Data HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut data hilang.',
    penjelasan: 'Backup cloud & lokal.',
    persiapanAlat: ['Koneksi internet'],
    langkah: [
      { judul: 'Aktifkan backup', detail: 'Google Drive / iCloud.' },
      { judul: 'Foto & video', detail: 'Google Photos.' },
      { judul: 'Kontak', detail: 'Sinkron akun.' },
      { judul: 'Chat', detail: 'Backup WA ke cloud.' },
      { judul: 'Verifikasi', detail: 'Cek hasil backup.' },
    ],
    risiko: [{ risiko: 'Kuota penuh', pencegahan: 'Bersihkan file besar.' }],
    penyelesaian: 'Data aman.',
    tags: ['backup', 'hp', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_225: Tutorial[] = [
  {
    id: 'tut-alat-27', slug: 'cara-pakai-bor', judul: 'Cara Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut pakai bor.',
    penjelasan: 'Dasar bor listrik.',
    persiapanAlat: ['Bor', 'Mata bor'],
    langkah: [
      { judul: 'Pasang mata', detail: 'Kencangkan chuck.' },
      { judul: 'Tandai titik', detail: 'Pensil / paku.' },
      { judul: 'Kecepatan rendah', detail: 'Mulai pelan.' },
      { judul: 'Tekan lurus', detail: 'Jangan miring.' },
      { judul: 'Bersihkan', detail: 'Lepas mata.' },
    ],
    risiko: [{ risiko: 'Luka', pencegahan: 'Kacamata & sarung tangan.' }],
    penyelesaian: 'Bisa mengebor dasar.',
    tags: ['bor', 'tukang', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_226: Tutorial[] = [
  {
    id: 'tut-perbaikan-27', slug: 'cara-ganti-lampu', judul: 'Cara Mengganti Lampu Sendiri',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati.',
    penjelasan: 'Ganti bohlam aman.',
    persiapanAlat: ['Bohlam baru', 'Tangga'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Cabut sekring bila perlu.' },
      { judul: 'Dinginkan', detail: 'Tunggu 5 menit.' },
      { judul: 'Lepas bohlam', detail: 'Putar berlawanan.' },
      { judul: 'Pasang baru', detail: 'Putar searah.' },
      { judul: 'Nyalakan', detail: 'Cek menyala.' },
    ],
    risiko: [{ risiko: 'Kesetrum', pencegahan: 'Pastikan daya mati.' }],
    penyelesaian: 'Lampu menyala.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_227: Tutorial[] = [
  {
    id: 'tut-kerja-31', slug: 'cara-buat-cv', judul: 'Cara Membuat CV yang Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'CV tidak dilirik HRD.',
    penjelasan: 'CV 1 halaman yang menjual.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Data diri singkat', detail: 'Nama, kontak.' },
      { judul: 'Ringkasan profil', detail: '3 baris.' },
      { judul: 'Pengalaman', detail: 'Hasil terukur.' },
      { judul: 'Skill relevan', detail: 'Sesuai lowongan.' },
      { judul: 'Rapi 1 halaman', detail: 'Font jelas.' },
    ],
    risiko: [{ risiko: 'Terlalu panjang', pencegahan: 'HRD baca 6 detik.' }],
    penyelesaian: 'CV dilirik.',
    tags: ['cv', 'lamaran', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_228: Tutorial[] = [
  {
    id: 'tut-umkm-32', slug: 'cara-daftar-halal', judul: 'Cara Sertifikasi Halal BPJPH',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Produk belum bersertifikat halal.',
    penjelasan: 'Halal via SIHALAL.',
    persiapanAlat: ['NIB', 'Daftar bahan'],
    langkah: [
      { judul: 'Daftar SIHALAL', detail: 'ptsp.halal.go.id.' },
      { judul: 'Isi data produk', detail: 'Bahan & proses.' },
      { judul: 'Pilih LPH', detail: 'Pemeriksa.' },
      { judul: 'Audit', detail: 'Kunjungan.' },
      { judul: 'Sidang fatwa', detail: 'Terbit sertifikat.' },
    ],
    risiko: [{ risiko: 'Bahan kritis', pencegahan: 'Ganti bahan bersertifikat.' }],
    penyelesaian: 'Produk bersertifikat halal.',
    tags: ['halal', 'sertifikasi', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_229: Tutorial[] = [
  {
    id: 'tut-belajar-32', slug: 'cara-baca-cepat', judul: 'Cara Membaca Cepat',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Bacaan menumpuk.',
    penjelasan: 'Speed reading dasar.',
    persiapanAlat: ['Buku'],
    langkah: [
      { judul: 'Hilangkan subvokalisasi', detail: 'Jangan baca dalam hati.' },
      { judul: 'Chunking', detail: '3-4 kata sekali pandang.' },
      { judul: 'Jangan mundur', detail: 'Terus maju.' },
      { judul: 'Preview', detail: 'Judul & subjudul dulu.' },
      { judul: 'Latihan', detail: '15 menit/hari.' },
    ],
    risiko: [{ risiko: 'Pemahaman turun', pencegahan: 'Sesuaikan kecepatan materi sulit.' }],
    penyelesaian: 'Baca 2x lebih cepat.',
    tags: ['baca', 'cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_230: Tutorial[] = [
  {
    id: 'tut-keuangan-30', slug: 'cara-buka-rekening', judul: 'Cara Membuka Rekening Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Belum punya rekening.',
    penjelasan: 'Buka rekening online/offline.',
    persiapanAlat: ['KTP', 'NPWP (bila ada)'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Biaya admin rendah.' },
      { judul: 'Daftar online', detail: 'Video call verifikasi.' },
      { judul: 'Setor awal', detail: '50-100rb.' },
      { judul: 'Aktifkan m-banking', detail: 'PIN & password.' },
      { judul: 'Coba transaksi', detail: 'Transfer kecil.' },
    ],
    risiko: [{ risiko: 'Penipuan', pencegahan: 'Hanya via aplikasi resmi.' }],
    penyelesaian: 'Rekening aktif.',
    tags: ['rekening', 'bank', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_231: Tutorial[] = [
  {
    id: 'tut-kesehatan-29', slug: 'cara-atur-pola-tidur', judul: 'Cara Mengatur Pola Tidur',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Insomnia & begadang.',
    penjelasan: 'Sleep hygiene.',
    persiapanAlat: [],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Tidur-bangun sama.' },
      { judul: 'Hindari layar', detail: '1 jam sebelum.' },
      { judul: 'Kamar gelap', detail: 'Dingin & tenang.' },
      { judul: 'Batasi kafein', detail: 'Setelah jam 2 siang.' },
      { judul: 'Ritual malam', detail: 'Baca / mandi hangat.' },
    ],
    risiko: [{ risiko: 'Begadang kronis', pencegahan: 'Konsultasi bila >1 bulan.' }],
    penyelesaian: 'Tidur berkualitas.',
    tags: ['tidur', 'insomnia', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_232: Tutorial[] = [
  {
    id: 'tut-teknologi-30', slug: 'cara-amankan-akun', judul: 'Cara Mengamankan Akun Online',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Akun diretas.',
    penjelasan: 'Keamanan akun dasar.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Password kuat', detail: '12+ karakter unik.' },
      { judul: 'Aktifkan 2FA', detail: 'Authenticator app.' },
      { judul: 'Cek sesi', detail: 'Logout perangkat asing.' },
      { judul: 'Waspada phishing', detail: 'Jangan klik link aneh.' },
      { judul: 'Backup kode', detail: 'Simpan recovery code.' },
    ],
    risiko: [{ risiko: 'Terkunci', pencegahan: 'Simpan kode pemulihan.' }],
    penyelesaian: 'Akun aman.',
    tags: ['keamanan', 'akun', '2fa'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_233: Tutorial[] = [
  {
    id: 'tut-alat-28', slug: 'cara-pakai-gerinda', judul: 'Cara Menggunakan Gerinda Aman',
    kategori: 'alat', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Gerinda berbahaya.',
    penjelasan: 'Dasar gerinda tangan.',
    persiapanAlat: ['Gerinda', 'Mata potong'],
    langkah: [
      { judul: 'APD lengkap', detail: 'Kacamata, masker, sarung.' },
      { judul: 'Pasang mata', detail: 'Sesuai arah putar.' },
      { judul: 'Jepit benda', detail: 'Jangan pegang.' },
      { judul: 'Potong stabil', detail: 'Jangan tekan keras.' },
      { judul: 'Matikan', detail: 'Tunggu berhenti.' },
    ],
    risiko: [{ risiko: 'Mata pecah', pencegahan: 'Jangan paksa & cek retak.' }],
    penyelesaian: 'Potong aman.',
    tags: ['gerinda', 'tukang', 'aman'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_234: Tutorial[] = [
  {
    id: 'tut-perbaikan-28', slug: 'cara-tambal-panci', judul: 'Cara Menambal Panci Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Panci bocor.',
    penjelasan: 'Tambal darurat aluminium.',
    persiapanAlat: ['Tambal panci', 'Amplas'],
    langkah: [
      { judul: 'Bersihkan', detail: 'Amplas area bocor.' },
      { judul: 'Tempel', detail: 'Tambal dari luar.' },
      { judul: 'Panaskan', detail: 'Sesuai petunjuk.' },
      { judul: 'Dinginkan', detail: 'Tunggu kering.' },
      { judul: 'Tes air', detail: 'Isi & cek.' },
    ],
    risiko: [{ risiko: 'Tidak awet', pencegahan: 'Ganti bila parah.' }],
    penyelesaian: 'Panci bisa dipakai.',
    tags: ['panci', 'dapur', 'tambal'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_235: Tutorial[] = [
  {
    id: 'tut-kerja-32', slug: 'cara-interview', judul: 'Cara Menghadapi Interview Kerja',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Gugup saat interview.',
    penjelasan: 'Persiapan interview.',
    persiapanAlat: ['CV', 'Pakaian rapi'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Visi & produk.' },
      { judul: 'Latihan jawab', detail: 'STAR method.' },
      { judul: 'Datang 15 mnt awal', detail: 'Tenang.' },
      { judul: 'Bahasa tubuh', detail: 'Kontak mata.' },
      { judul: 'Tanya balik', detail: 'Tunjukkan minat.' },
    ],
    risiko: [{ risiko: 'Jawaban ngawur', pencegahan: 'Jujur & singkat.' }],
    penyelesaian: 'Interview percaya diri.',
    tags: ['interview', 'kerja', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_236: Tutorial[] = [
  {
    id: 'tut-umkm-33', slug: 'cara-daftar-merek', judul: 'Cara Mendaftarkan Merek Dagang',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Merek belum dilindungi.',
    penjelasan: 'Merek via DJKI.',
    persiapanAlat: ['Logo', 'KTP'],
    langkah: [
      { judul: 'Cek merek', detail: 'dgip.go.id.' },
      { judul: 'Daftar akun', detail: 'DJKI online.' },
      { judul: 'Isi form', detail: 'Kelas barang.' },
      { judul: 'Bayar PNBP', detail: '500rb-1jt.' },
      { judul: 'Tunggu 1-2 thn', detail: 'Pemeriksaan.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Cek kemiripan dulu.' }],
    penyelesaian: 'Merek terdaftar.',
    tags: ['merek', 'hki', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_237: Tutorial[] = [
  {
    id: 'tut-belajar-33', slug: 'cara-mind-mapping', judul: 'Cara Membuat Mind Mapping',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Catatan berantakan.',
    penjelasan: 'Peta pikiran visual.',
    persiapanAlat: ['Kertas', 'Spidol warna'],
    langkah: [
      { judul: 'Topik di tengah', detail: 'Kata kunci.' },
      { judul: 'Cabang utama', detail: '5-7 cabang.' },
      { judul: 'Sub-cabang', detail: 'Detail tiap cabang.' },
      { judul: 'Warna & gambar', detail: 'Visual memori.' },
      { judul: 'Review', detail: 'Bacakan ulang.' },
    ],
    risiko: [{ risiko: 'Terlalu ramai', pencegahan: 'Satu kata per cabang.' }],
    penyelesaian: 'Catatan visual rapi.',
    tags: ['mindmap', 'catatan', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_238: Tutorial[] = [
  {
    id: 'tut-keuangan-31', slug: 'cara-hitung-pajak', judul: 'Cara Menghitung Pajak Penghasilan',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bingung hitung PPh.',
    penjelasan: 'PPh 21 progresif.',
    persiapanAlat: ['Slip gaji'],
    langkah: [
      { judul: 'Hitung bruto', detail: 'Gaji setahun.' },
      { judul: 'Kurangi PTKP', detail: '54jt single.' },
      { judul: 'Terapkan tarif', detail: '5-35% progresif.' },
      { judul: 'Bagi 12', detail: 'Potongan bulanan.' },
      { judul: 'Lapor SPT', detail: 'DJP Online.' },
    ],
    risiko: [{ risiko: 'Denda', pencegahan: 'Lapor sebelum 31 Maret.' }],
    penyelesaian: 'Pajak terhitung & lapor.',
    tags: ['pajak', 'pph', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_239: Tutorial[] = [
  {
    id: 'tut-kesehatan-30', slug: 'cara-cek-tensi', judul: 'Cara Mengukur Tekanan Darah',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tidak tahu cara pakai tensimeter.',
    penjelasan: 'Ukur tensi digital.',
    persiapanAlat: ['Tensimeter digital'],
    langkah: [
      { judul: 'Istirahat 5 mnt', detail: 'Duduk tenang.' },
      { judul: 'Pasang manset', detail: 'Sejajar jantung.' },
      { judul: 'Tekan start', detail: 'Diam & rileks.' },
      { judul: 'Catat hasil', detail: 'Sistolik/diastolik.' },
      { judul: 'Bandingkan', detail: 'Normal <120/80.' },
    ],
    risiko: [{ risiko: 'Hasil bias', pencegahan: 'Jangan habis kopi/rokok.' }],
    penyelesaian: 'Tahu tekanan darah.',
    tags: ['tensi', 'darah', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_240: Tutorial[] = [
  {
    id: 'tut-teknologi-31', slug: 'cara-pasang-wifi', judul: 'Cara Memasang WiFi di Rumah',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin pasang internet rumah.',
    penjelasan: 'Pilih ISP & pasang.',
    persiapanAlat: ['KTP'],
    langkah: [
      { judul: 'Bandingkan ISP', detail: 'Harga & kecepatan.' },
      { judul: 'Daftar', detail: 'Online / gerai.' },
      { judul: 'Jadwal teknisi', detail: 'Instalasi.' },
      { judul: 'Atur router', detail: 'Nama & password.' },
      { judul: 'Tes kecepatan', detail: 'Speedtest.' },
    ],
    risiko: [{ risiko: 'Sinyal lemah', pencegahan: 'Posisi router tengah rumah.' }],
    penyelesaian: 'WiFi aktif.',
    tags: ['wifi', 'internet', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_241: Tutorial[] = [
  {
    id: 'tut-alat-29', slug: 'cara-pakai-las', judul: 'Cara Mengelas Dasar',
    kategori: 'alat', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin belajar las.',
    penjelasan: 'Las listrik dasar.',
    persiapanAlat: ['Mesin las', 'Elektroda'],
    langkah: [
      { judul: 'APD lengkap', detail: 'Topeng las wajib.' },
      { judul: 'Atur ampere', detail: 'Sesuai ketebalan.' },
      { judul: 'Strike', detail: 'Gores seperti korek.' },
      { judul: 'Gerak zigzag', detail: 'Stabil.' },
      { judul: 'Bersihkan slag', detail: 'Palu & sikat.' },
    ],
    risiko: [{ risiko: 'Luka bakar & mata', pencegahan: 'Jangan lihat api langsung.' }],
    penyelesaian: 'Las dasar bisa.',
    tags: ['las', 'bengkel', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_242: Tutorial[] = [
  {
    id: 'tut-perbaikan-29', slug: 'cara-perbaiki-kipas', judul: 'Cara Memperbaiki Kipas Angin Mati',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Kipas mati total.',
    penjelasan: 'Diagnosa kipas angin.',
    persiapanAlat: ['Obeng', 'Multimeter'],
    langkah: [
      { judul: 'Cek kabel', detail: 'Putus / longgar.' },
      { judul: 'Cek sekring', detail: 'Ganti bila putus.' },
      { judul: 'Cek kapasitor', detail: 'Ganti bila kembung.' },
      { judul: 'Bersihkan', detail: 'Debu & minyak.' },
      { judul: 'Rakit & tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Kesetrum', pencegahan: 'Cabut steker dulu.' }],
    penyelesaian: 'Kipas menyala.',
    tags: ['kipas', 'elektronik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_243: Tutorial[] = [
  {
    id: 'tut-kerja-33', slug: 'cara-negosiasi-gaji', judul: 'Cara Negosiasi Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Tawaran gaji rendah.',
    penjelasan: 'Negosiasi profesional.',
    persiapanAlat: ['Data pasar gaji'],
    langkah: [
      { judul: 'Riset range', detail: 'Jobstreet / Glassdoor.' },
      { judul: 'Tentukan target', detail: 'Min-maks.' },
      { judul: 'Tunjukkan value', detail: 'Pencapaian.' },
      { judul: 'Jangan sebut dulu', detail: 'Biarkan mereka.' },
      { judul: 'Pertimbangkan total', detail: 'Benefit juga.' },
    ],
    risiko: [{ risiko: 'Kehilangan tawaran', pencegahan: 'Sopan & realistis.' }],
    penyelesaian: 'Gaji sesuai.',
    tags: ['gaji', 'negosiasi', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_244: Tutorial[] = [
  {
    id: 'tut-umkm-34', slug: 'cara-hitung-hpp', judul: 'Cara Menghitung HPP Produk',
    kategori: 'umkm', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Tidak tahu modal per produk.',
    penjelasan: 'HPP = bahan + tenaga + overhead.',
    persiapanAlat: ['Catatan biaya'],
    langkah: [
      { judul: 'Catat bahan', detail: 'Per unit.' },
      { judul: 'Hitung tenaga', detail: 'Upah / unit.' },
      { judul: 'Overhead', detail: 'Listrik, sewa.' },
      { judul: 'Jumlahkan', detail: 'Total HPP.' },
      { judul: 'Tentukan harga', detail: 'HPP + margin.' },
    ],
    risiko: [{ risiko: 'Rugi', pencegahan: 'Jangan lupa overhead.' }],
    penyelesaian: 'Harga jual tepat.',
    tags: ['hpp', 'modal', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_245: Tutorial[] = [
  {
    id: 'tut-belajar-34', slug: 'cara-olimpiade-2', judul: 'Cara Lolos Seleksi Olimpiade',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Gagal di seleksi.',
    penjelasan: 'Strategi lolos OSN.',
    persiapanAlat: ['Soal tahun lalu'],
    langkah: [
      { judul: 'Analisis pola', detail: 'Topik sering keluar.' },
      { judul: 'Kecepatan', detail: 'Latihan timed.' },
      { judul: 'Teori kuat', detail: 'Konsep dulu.' },
      { judul: 'Simulasi', detail: 'Try out.' },
      { judul: 'Mental', detail: 'Tenang saat tes.' },
    ],
    risiko: [{ risiko: 'Panik', pencegahan: 'Simulasi berkali-kali.' }],
    penyelesaian: 'Lolos seleksi.',
    tags: ['olimpiade', 'seleksi', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_246: Tutorial[] = [
  {
    id: 'tut-keuangan-32', slug: 'cara-buka-deposito', judul: 'Cara Membuka Deposito Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tabungan bunganya kecil.',
    penjelasan: 'Deposito: bunga lebih tinggi.',
    persiapanAlat: ['Dana 10jt+'],
    langkah: [
      { judul: 'Bandingkan bunga', detail: 'Antar bank.' },
      { judul: 'Pilih tenor', detail: '1-12 bulan.' },
      { judul: 'Buka via m-banking', detail: 'Mudah.' },
      { judul: 'Pahami penalti', detail: 'Cair sebelum jatuh tempo.' },
      { judul: 'Perpanjang', detail: 'ARO otomatis.' },
    ],
    risiko: [{ risiko: 'Dana terkunci', pencegahan: 'Sisakan dana darurat.' }],
    penyelesaian: 'Deposito aktif.',
    tags: ['deposito', 'bank', 'investasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_247: Tutorial[] = [
  {
    id: 'tut-kesehatan-31', slug: 'cara-p3k', judul: 'Cara P3K Dasar',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Kecelakaan kecil.',
    penjelasan: 'Pertolongan pertama.',
    persiapanAlat: ['Kotak P3K'],
    langkah: [
      { judul: 'Amankan', detail: 'Jauhkan bahaya.' },
      { judul: 'Cek sadar', detail: 'Panggil & tepuk.' },
      { judul: 'Hentikan darah', detail: 'Tekan kasa.' },
      { judul: 'Balut luka', detail: 'Perban bersih.' },
      { judul: 'Bawa ke RS', detail: 'Bila parah.' },
    ],
    risiko: [{ risiko: 'Salah tangani', pencegahan: 'Jangan pindah korban patah.' }],
    penyelesaian: 'Korban tertangani.',
    tags: ['p3k', 'darurat', 'kesehatan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_248: Tutorial[] = [
  {
    id: 'tut-teknologi-32', slug: 'cara-scan-dokumen', judul: 'Cara Scan Dokumen dengan HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Butuh scan cepat.',
    penjelasan: 'Scan via aplikasi.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Buka aplikasi', detail: 'Notes / Drive.' },
      { judul: 'Foto dokumen', detail: 'Rata & terang.' },
      { judul: 'Crop', detail: 'Sesuaikan tepi.' },
      { judul: 'Simpan PDF', detail: 'Export.' },
      { judul: 'Kirim', detail: 'Email / WA.' },
    ],
    risiko: [{ risiko: 'Buram', pencegahan: 'Cahaya cukup.' }],
    penyelesaian: 'Dokumen terscan.',
    tags: ['scan', 'dokumen', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_249: Tutorial[] = [
  {
    id: 'tut-alat-30', slug: 'cara-pakai-kompresor', judul: 'Cara Menggunakan Kompresor Angin',
    kategori: 'alat', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Butuh angin bertekanan.',
    penjelasan: 'Kompresor dasar.',
    persiapanAlat: ['Kompresor', 'Selang'],
    langkah: [
      { judul: 'Cek oli', detail: 'Level cukup.' },
      { judul: 'Nyalakan', detail: 'Tunggu penuh.' },
      { judul: 'Atur tekanan', detail: 'Sesuai kebutuhan.' },
      { judul: 'Pakai', detail: 'Semprot / cat.' },
      { judul: 'Buang air', detail: 'Drain tiap pakai.' },
    ],
    risiko: [{ risiko: 'Ledakan tabung', pencegahan: 'Jangan overpressure.' }],
    penyelesaian: 'Kompresor siap pakai.',
    tags: ['kompresor', 'bengkel', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_250: Tutorial[] = [
  {
    id: 'tut-perbaikan-30', slug: 'cara-servis-ac', judul: 'Cara Membersihkan AC Sendiri',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'AC tidak dingin.',
    penjelasan: 'Cuci filter & indoor.',
    persiapanAlat: ['Sikat', 'Air'],
    langkah: [
      { judul: 'Matikan', detail: 'Cabut steker.' },
      { judul: 'Buka cover', detail: 'Lepas filter.' },
      { judul: 'Cuci filter', detail: 'Air & sabun.' },
      { judul: 'Lap indoor', detail: 'Kain lembab.' },
      { judul: 'Pasang & tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Rusak', pencegahan: 'Jangan semprot PCB.' }],
    penyelesaian: 'AC dingin lagi.',
    tags: ['ac', 'dingin', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_251: Tutorial[] = [
  {
    id: 'tut-kerja-34', slug: 'cara-freelance', judul: 'Cara Memulai Freelance',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin kerja fleksibel.',
    penjelasan: 'Freelance dari nol.',
    persiapanAlat: ['Laptop', 'Internet'],
    langkah: [
      { judul: 'Pilih skill', detail: 'Desain, tulis, coding.' },
      { judul: 'Buat portofolio', detail: '3-5 sampel.' },
      { judul: 'Daftar platform', detail: 'Upwork, Sribulancer.' },
      { judul: 'Bid proyek', detail: 'Proposal personal.' },
      { judul: 'Jaga reputasi', detail: 'Tepat waktu.' },
    ],
    risiko: [{ risiko: 'Klien kabur', pencegahan: 'Milestone & DP.' }],
    penyelesaian: 'Dapat klien pertama.',
    tags: ['freelance', 'kerja', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_252: Tutorial[] = [
  {
    id: 'tut-belajar-35', slug: 'cara-baca-cepat-2', judul: 'Cara Membaca Cepat',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Bacaan menumpuk.',
    penjelasan: 'Speed reading dasar.',
    persiapanAlat: ['Buku'],
    langkah: [
      { judul: 'Skimming', detail: 'Judul & subjudul.' },
      { judul: 'Chunking', detail: 'Kelompok kata.' },
      { judul: 'Kurangi subvokal', detail: 'Jangan bersuara.' },
      { judul: 'Fokus', detail: 'Tanpa gangguan.' },
      { judul: 'Uji paham', detail: 'Ringkas.' },
    ],
    risiko: [{ risiko: 'Tidak paham', pencegahan: 'Perlambat bagian sulit.' }],
    penyelesaian: 'Baca 2x lebih cepat.',
    tags: ['baca', 'cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_253: Tutorial[] = [
  {
    id: 'tut-mental-30', slug: 'cara-atasi-overthinking', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran tidak berhenti.',
    penjelasan: 'Teknik hentikan overthinking.',
    persiapanAlat: ['Jurnal'],
    langkah: [
      { judul: 'Sadari', detail: 'Labeli pikiran.' },
      { judul: 'Tulis', detail: 'Keluarkan ke kertas.' },
      { judul: 'Uji bukti', detail: 'Fakta vs asumsi.' },
      { judul: 'Batasi waktu', detail: '10 menit khawatir.' },
      { judul: 'Aksi kecil', detail: 'Lakukan 1 langkah.' },
    ],
    risiko: [{ risiko: 'Makin parah', pencegahan: 'Cari profesional bila 2 minggu.' }],
    penyelesaian: 'Pikiran lebih tenang.',
    tags: ['overthinking', 'mental', 'tenang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_254: Tutorial[] = [
  {
    id: 'tut-keuangan-33', slug: 'cara-buka-reksadana', judul: 'Cara Membuka Reksa Dana',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin investasi kecil.',
    penjelasan: 'Reksa dana dari 100rb.',
    persiapanAlat: ['KTP', 'Rekening'],
    langkah: [
      { judul: 'Pilih platform', detail: 'Bibit, Bareksa.' },
      { judul: 'KYC', detail: 'Foto KTP.' },
      { judul: 'Pilih jenis', detail: 'Pasar uang dulu.' },
      { judul: 'Setor rutin', detail: 'Auto debit.' },
      { judul: 'Pantau', detail: 'Jangka panjang.' },
    ],
    risiko: [{ risiko: 'Nilai turun', pencegahan: 'Jangan panik jual.' }],
    penyelesaian: 'Investasi berjalan.',
    tags: ['reksadana', 'investasi', 'pemula'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_255: Tutorial[] = [
  {
    id: 'tut-kesehatan-32', slug: 'cara-cuci-tangan', judul: 'Cara Mencuci Tangan yang Benar',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Tangan kotor.',
    penjelasan: '6 langkah WHO.',
    persiapanAlat: ['Sabun', 'Air'],
    langkah: [
      { judul: 'Basahi', detail: 'Air mengalir.' },
      { judul: 'Sabun', detail: 'Telapak & punggung.' },
      { judul: 'Sela jari', detail: 'Gosok.' },
      { judul: 'Kuku', detail: 'Putar ujung jari.' },
      { judul: 'Bilas & kering', detail: 'Tisu / angin.' },
    ],
    risiko: [{ risiko: 'Kuman sisa', pencegahan: 'Minimal 20 detik.' }],
    penyelesaian: 'Tangan bersih.',
    tags: ['tangan', 'bersih', 'who'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_256: Tutorial[] = [
  {
    id: 'tut-umkm-35', slug: 'cara-toko-shopee-2', judul: 'Cara Membuka Toko di Shopee',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin jualan online.',
    penjelasan: 'Buka toko Shopee.',
    persiapanAlat: ['HP', 'KTP', 'Rekening'],
    langkah: [
      { judul: 'Daftar akun', detail: 'Nomor HP.' },
      { judul: 'Verifikasi', detail: 'KTP & selfie.' },
      { judul: 'Isi toko', detail: 'Nama & deskripsi.' },
      { judul: 'Upload produk', detail: 'Foto & harga.' },
      { judul: 'Aktifkan ongkir', detail: 'Ekspedisi.' },
    ],
    risiko: [{ risiko: 'Penipuan', pencegahan: 'Transaksi di platform.' }],
    penyelesaian: 'Toko aktif.',
    tags: ['shopee', 'toko', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_257: Tutorial[] = [
  {
    id: 'tut-perbaikan-31', slug: 'cara-ganti-ban-2', judul: 'Cara Mengganti Ban Mobil',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Ban kempes di jalan.',
    penjelasan: 'Ganti ban serep.',
    persiapanAlat: ['Dongkrak', 'Kunci roda', 'Ban serep'],
    langkah: [
      { judul: 'Parkir aman', detail: 'Segitiga pengaman.' },
      { judul: 'Kendorkan baut', detail: 'Sebelum dongkrak.' },
      { judul: 'Dongkrak', detail: 'Titik angkat.' },
      { judul: 'Ganti ban', detail: 'Pasang serep.' },
      { judul: 'Kencangkan', detail: 'Pola bintang.' },
    ],
    risiko: [{ risiko: 'Mobil jatuh', pencegahan: 'Dongkrak di permukaan rata.' }],
    penyelesaian: 'Ban terganti.',
    tags: ['ban', 'mobil', 'darurat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_258: Tutorial[] = [
  {
    id: 'tut-teknologi-33', slug: 'cara-backup-hp-2', judul: 'Cara Backup HP Android',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut data hilang.',
    penjelasan: 'Backup otomatis.',
    persiapanAlat: ['Akun Google'],
    langkah: [
      { judul: 'Buka Setelan', detail: 'Sistem > Cadangan.' },
      { judul: 'Aktifkan', detail: 'Google One.' },
      { judul: 'Foto', detail: 'Google Foto.' },
      { judul: 'WA', detail: 'Chat backup.' },
      { judul: 'Restore', detail: 'Saat HP baru.' },
    ],
    risiko: [{ risiko: 'Kuota penuh', pencegahan: 'Bersihkan berkala.' }],
    penyelesaian: 'Data aman.',
    tags: ['backup', 'android', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_259: Tutorial[] = [
  {
    id: 'tut-alat-31', slug: 'cara-pakai-gerinda-2', judul: 'Cara Menggunakan Gerinda',
    kategori: 'alat', tingkat: 'menengah', estimasiMenit: 15,
    masalah: 'Butuh potong besi.',
    penjelasan: 'Gerinda aman.',
    persiapanAlat: ['Gerinda', 'Mata potong', 'APD'],
    langkah: [
      { judul: 'Pasang mata', detail: 'Kencang.' },
      { judul: 'APD', detail: 'Kacamata & sarung.' },
      { judul: 'Posisi', detail: 'Stabil.' },
      { judul: 'Potong', detail: 'Perlahan.' },
      { judul: 'Dinginkan', detail: 'Jangan paksa.' },
    ],
    risiko: [{ risiko: 'Mata pecah', pencegahan: 'Jangan miring.' }],
    penyelesaian: 'Besi terpotong.',
    tags: ['gerinda', 'besi', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_260: Tutorial[] = [
  {
    id: 'tut-kerja-35', slug: 'cara-cv-2', judul: 'Cara Membuat CV yang Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'CV tidak dilirik.',
    penjelasan: 'CV ATS-friendly.',
    persiapanAlat: ['Laptop'],
    langkah: [
      { judul: 'Foto formal', detail: 'Rapi.' },
      { judul: 'Data diri', detail: 'Kontak jelas.' },
      { judul: 'Pengalaman', detail: 'Terbaru dulu.' },
      { judul: 'Skill', detail: 'Relevan.' },
      { judul: '1 halaman', detail: 'Ringkas.' },
    ],
    risiko: [{ risiko: 'Bohong', pencegahan: 'Jujur, bisa dicek.' }],
    penyelesaian: 'CV siap kirim.',
    tags: ['cv', 'lamaran', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_261: Tutorial[] = [
  {
    id: 'tut-belajar-36', slug: 'cara-mind-map-2', judul: 'Cara Membuat Mind Map',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sulit hafal.',
    penjelasan: 'Peta pikiran.',
    persiapanAlat: ['Kertas', 'Spidol warna'],
    langkah: [
      { judul: 'Topik tengah', detail: 'Tulis besar.' },
      { judul: 'Cabang utama', detail: '5-7 cabang.' },
      { judul: 'Kata kunci', detail: '1-2 kata.' },
      { judul: 'Warna', detail: 'Tiap cabang.' },
      { judul: 'Gambar', detail: 'Ikon kecil.' },
    ],
    risiko: [{ risiko: 'Terlalu ramai', pencegahan: 'Batasi cabang.' }],
    penyelesaian: 'Materi terpeta.',
    tags: ['mindmap', 'hafal', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_262: Tutorial[] = [
  {
    id: 'tut-mental-31', slug: 'cara-tidur-cepat-2', judul: 'Cara Tidur Cepat',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Susah tidur.',
    penjelasan: 'Teknik 4-7-8.',
    persiapanAlat: ['Kamar gelap'],
    langkah: [
      { judul: 'Matikan layar', detail: '30 menit sebelum.' },
      { judul: 'Napas 4-7-8', detail: 'Tarik 4, tahan 7, hembus 8.' },
      { judul: 'Rileks otot', detail: 'Dari kaki ke kepala.' },
      { judul: 'Visualisasi', detail: 'Tempat tenang.' },
      { judul: 'Konsisten', detail: 'Jam sama tiap hari.' },
    ],
    risiko: [{ risiko: 'Insomnia kronis', pencegahan: 'Ke dokter bila >3 minggu.' }],
    penyelesaian: 'Tidur lebih cepat.',
    tags: ['tidur', 'insomnia', 'rileks'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_263: Tutorial[] = [
  {
    id: 'tut-keuangan-34', slug: 'cara-hindari-pinjol', judul: 'Cara Menghindari Jebakan Pinjol',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Terlilit pinjol.',
    penjelasan: 'Kenali & hindari.',
    persiapanAlat: ['Cek OJK'],
    langkah: [
      { judul: 'Cek legal', detail: 'Daftar OJK.' },
      { judul: 'Hitung bunga', detail: 'Jangan asal klik.' },
      { judul: 'Jangan gali lubang', detail: 'Tutup satu-satu.' },
      { judul: 'Negosiasi', detail: 'Minta restruktur.' },
      { judul: 'Lapor', detail: 'Bila diteror.' },
    ],
    risiko: [{ risiko: 'Teror debt collector', pencegahan: 'Lapor OJK/polisi.' }],
    penyelesaian: 'Bebas pinjol.',
    tags: ['pinjol', 'utang', 'ojk'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_264: Tutorial[] = [
  {
    id: 'tut-perbaikan-32', slug: 'cara-perbaiki-kipas-2', judul: 'Cara Memperbaiki Kipas Angin',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Kipas mati total.',
    penjelasan: 'Cek kapasitor & fuse.',
    persiapanAlat: ['Obeng', 'Multimeter'],
    langkah: [
      { judul: 'Cabut listrik', detail: 'Aman dulu.' },
      { judul: 'Buka casing', detail: 'Lepas baut.' },
      { judul: 'Cek fuse', detail: 'Ganti bila putus.' },
      { judul: 'Cek kapasitor', detail: 'Ganti bila kembung.' },
      { judul: 'Rakit & tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Sengatan', pencegahan: 'Pastikan tercabut.' }],
    penyelesaian: 'Kipas berputar lagi.',
    tags: ['kipas', 'elektronik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_265: Tutorial[] = [
  {
    id: 'tut-teknologi-34', slug: 'cara-wifi-2', judul: 'Cara Mempercepat WiFi',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'WiFi lemot.',
    penjelasan: 'Optimasi router.',
    persiapanAlat: ['Akses router'],
    langkah: [
      { judul: 'Restart', detail: 'Cabut 30 detik.' },
      { judul: 'Posisi', detail: 'Tengah & tinggi.' },
      { judul: 'Ganti channel', detail: 'Hindari padat.' },
      { judul: 'Update firmware', detail: 'Via admin.' },
      { judul: 'Repeater', detail: 'Bila luas.' },
    ],
    risiko: [{ risiko: 'Salah setting', pencegahan: 'Catat sebelum ubah.' }],
    penyelesaian: 'WiFi lebih cepat.',
    tags: ['wifi', 'internet', 'cepat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_266: Tutorial[] = [
  {
    id: 'tut-alat-32', slug: 'cara-pakai-bor-2', judul: 'Cara Menggunakan Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Butuh lubang di dinding.',
    penjelasan: 'Bor dasar.',
    persiapanAlat: ['Bor', 'Mata bor'],
    langkah: [
      { judul: 'Tandai', detail: 'Titik bor.' },
      { judul: 'Pilih mata', detail: 'Sesuai material.' },
      { judul: 'Kecepatan rendah', detail: 'Mulai pelan.' },
      { judul: 'Tekan lurus', detail: 'Jangan miring.' },
      { judul: 'Bersihkan', detail: 'Debu.' },
    ],
    risiko: [{ risiko: 'Kena kabel', pencegahan: 'Cek detektor.' }],
    penyelesaian: 'Lubang rapi.',
    tags: ['bor', 'dinding', 'tukang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_267: Tutorial[] = [
  {
    id: 'tut-kerja-36', slug: 'cara-interview-2', judul: 'Cara Lolos Interview Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gagal interview.',
    penjelasan: 'Teknik interview.',
    persiapanAlat: ['CV', 'Pakaian rapi'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Profil & visi.' },
      { judul: 'Latihan STAR', detail: 'Situasi-tugas-aksi-hasil.' },
      { judul: 'Tepat waktu', detail: '15 menit awal.' },
      { judul: 'Tanya balik', detail: 'Tunjukkan minat.' },
      { judul: 'Follow up', detail: 'Email terima kasih.' },
    ],
    risiko: [{ risiko: 'Gugup', pencegahan: 'Simulasi dengan teman.' }],
    penyelesaian: 'Lolos interview.',
    tags: ['interview', 'kerja', 'hrd'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_268: Tutorial[] = [
  {
    id: 'tut-belajar-37', slug: 'cara-ikut-lomba-2', judul: 'Cara Mengikuti Lomba Karya Tulis',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin ikut lomba.',
    penjelasan: 'Lomba esai & KTI.',
    persiapanAlat: ['Laptop'],
    langkah: [
      { judul: 'Cari info', detail: 'IG & web kampus.' },
      { judul: 'Baca pedoman', detail: 'Tema & format.' },
      { judul: 'Riset', detail: 'Data valid.' },
      { judul: 'Tulis', detail: 'Struktur jelas.' },
      { judul: 'Kirim', detail: 'Sebelum deadline.' },
    ],
    risiko: [{ risiko: 'Plagiat', pencegahan: 'Tulis sendiri.' }],
    penyelesaian: 'Naskah terkirim.',
    tags: ['lomba', 'kti', 'esai'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_269: Tutorial[] = [
  {
    id: 'tut-mental-32', slug: 'cara-atasi-cemas-2', judul: 'Cara Mengatasi Kecemasan',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Cemas berlebihan.',
    penjelasan: 'Grounding 5-4-3-2-1.',
    persiapanAlat: ['Tempat tenang'],
    langkah: [
      { judul: '5 lihat', detail: 'Sebut 5 benda.' },
      { judul: '4 sentuh', detail: 'Rasakan 4 tekstur.' },
      { judul: '3 dengar', detail: 'Dengar 3 suara.' },
      { judul: '2 cium', detail: 'Cium 2 aroma.' },
      { judul: '1 rasa', detail: 'Rasakan 1 rasa.' },
    ],
    risiko: [{ risiko: 'Panik berat', pencegahan: 'Ke profesional bila sering.' }],
    penyelesaian: 'Cemas mereda.',
    tags: ['cemas', 'grounding', 'mental'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_270: Tutorial[] = [
  {
    id: 'tut-keuangan-35', slug: 'cara-buka-rekening-2', judul: 'Cara Membuka Rekening Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Belum punya rekening.',
    penjelasan: 'Buka rekening online.',
    persiapanAlat: ['KTP', 'HP'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Biaya admin rendah.' },
      { judul: 'Download app', detail: 'Registrasi.' },
      { judul: 'KYC', detail: 'Foto KTP & selfie.' },
      { judul: 'Setor awal', detail: 'Sesuai ketentuan.' },
      { judul: 'Aktifkan', detail: 'Kartu & m-banking.' },
    ],
    risiko: [{ risiko: 'Data bocor', pencegahan: 'App resmi.' }],
    penyelesaian: 'Rekening aktif.',
    tags: ['rekening', 'bank', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_271: Tutorial[] = [
  {
    id: 'tut-kesehatan-33', slug: 'cara-tensi-2', judul: 'Cara Mengukur Tekanan Darah',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Ingin cek tensi.',
    penjelasan: 'Tensimeter digital.',
    persiapanAlat: ['Tensimeter'],
    langkah: [
      { judul: 'Duduk tenang', detail: '5 menit istirahat.' },
      { judul: 'Pasang manset', detail: 'Sejajar jantung.' },
      { judul: 'Tekan start', detail: 'Diam & rileks.' },
      { judul: 'Catat', detail: 'Sistolik/diastolik.' },
      { judul: 'Ulangi', detail: 'Bila ragu.' },
    ],
    risiko: [{ risiko: 'Salah baca', pencegahan: 'Ikuti manual.' }],
    penyelesaian: 'Tensi terukur.',
    tags: ['tensi', 'darah', 'sehat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_272: Tutorial[] = [
  {
    id: 'tut-umkm-36', slug: 'cara-hitung-ongkir-2', judul: 'Cara Menghitung Ongkir',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Ongkir tidak akurat.',
    penjelasan: 'Hitung berat volumetrik.',
    persiapanAlat: ['Timbangan'],
    langkah: [
      { judul: 'Timbang', detail: 'Berat aktual.' },
      { judul: 'Ukur', detail: 'PxLxT.' },
      { judul: 'Volumetrik', detail: 'Bagi 6000.' },
      { judul: 'Ambil terbesar', detail: 'Aktual vs volumetrik.' },
      { judul: 'Cek tarif', detail: 'Ekspedisi.' },
    ],
    risiko: [{ risiko: 'Rugi ongkir', pencegahan: 'Timbang akurat.' }],
    penyelesaian: 'Ongkir tepat.',
    tags: ['ongkir', 'ekspedisi', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_273: Tutorial[] = [
  {
    id: 'tut-perbaikan-33', slug: 'cara-servis-motor-2', judul: 'Cara Servis Motor Sendiri',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Motor brebet.',
    penjelasan: 'Servis ringan.',
    persiapanAlat: ['Kunci pas', 'Oli'],
    langkah: [
      { judul: 'Ganti oli', detail: 'Tiap 2000 km.' },
      { judul: 'Bersihkan filter', detail: 'Udara.' },
      { judul: 'Cek busi', detail: 'Ganti bila aus.' },
      { judul: 'Setel rantai', detail: 'Kendor pas.' },
      { judul: 'Cek rem', detail: 'Kampas.' },
    ],
    risiko: [{ risiko: 'Baut dol', pencegahan: 'Kunci pas.' }],
    penyelesaian: 'Motor halus.',
    tags: ['motor', 'servis', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_274: Tutorial[] = [
  {
    id: 'tut-teknologi-35', slug: 'cara-2fa-2', judul: 'Cara Mengaktifkan 2FA',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Akun mudah dibobol.',
    penjelasan: 'Autentikasi 2 faktor.',
    persiapanAlat: ['HP', 'App authenticator'],
    langkah: [
      { judul: 'Buka keamanan', detail: 'Setelan akun.' },
      { judul: 'Aktifkan 2FA', detail: 'Pilih authenticator.' },
      { judul: 'Scan QR', detail: 'App authenticator.' },
      { judul: 'Simpan backup', detail: 'Kode pemulihan.' },
      { judul: 'Tes', detail: 'Login ulang.' },
    ],
    risiko: [{ risiko: 'Terkunci', pencegahan: 'Simpan kode backup.' }],
    penyelesaian: 'Akun lebih aman.',
    tags: ['2fa', 'keamanan', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_275: Tutorial[] = [
  {
    id: 'tut-alat-33', slug: 'cara-pakai-multimeter-2', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin cek listrik.',
    penjelasan: 'Multimeter dasar.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V, A, Ohm.' },
      { judul: 'Pasang probe', detail: 'Merah-hitam.' },
      { judul: 'Ukur', detail: 'Tempel titik.' },
      { judul: 'Baca', detail: 'Layar digital.' },
      { judul: 'Matikan', detail: 'Hemat baterai.' },
    ],
    risiko: [{ risiko: 'Korslet', pencegahan: 'Mode benar.' }],
    penyelesaian: 'Pengukuran selesai.',
    tags: ['multimeter', 'listrik', 'ukur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_276: Tutorial[] = [
  {
    id: 'tut-keuangan-36', slug: 'cara-bayar-pajak-2', judul: 'Cara Membayar Pajak Motor',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pajak mati.',
    penjelasan: 'Bayar via Samsat.',
    persiapanAlat: ['STNK', 'KTP'],
    langkah: [
      { judul: 'Cek nominal', detail: 'App Samsat.' },
      { judul: 'Datang', detail: 'Bawa dokumen.' },
      { judul: 'Bayar', detail: 'Loket / online.' },
      { judul: 'Ambil STNK', detail: 'Sudah cap.' },
      { judul: 'Simpan', detail: 'Foto arsip.' },
    ],
    risiko: [{ risiko: 'Denda', pencegahan: 'Bayar tepat waktu.' }],
    penyelesaian: 'Pajak lunas.',
    tags: ['pajak', 'motor', 'samsat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_277: Tutorial[] = [
  {
    id: 'tut-kesehatan-34', slug: 'cara-cek-gula-2', judul: 'Cara Mengecek Gula Darah',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Ingin cek gula.',
    penjelasan: 'Glukometer rumahan.',
    persiapanAlat: ['Glukometer', 'Strip'],
    langkah: [
      { judul: 'Cuci tangan', detail: 'Keringkan.' },
      { judul: 'Pasang strip', detail: 'Ke alat.' },
      { judul: 'Tusuk jari', detail: 'Lancet.' },
      { judul: 'Tetes darah', detail: 'Ke strip.' },
      { judul: 'Baca', detail: 'Catat hasil.' },
    ],
    risiko: [{ risiko: 'Infeksi', pencegahan: 'Alkohol swab.' }],
    penyelesaian: 'Gula terukur.',
    tags: ['gula', 'diabetes', 'cek'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_278: Tutorial[] = [
  {
    id: 'tut-umkm-37', slug: 'cara-live-jualan-2', judul: 'Cara Live Jualan di TikTok',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin jualan live.',
    penjelasan: 'Live TikTok Shop.',
    persiapanAlat: ['HP', 'Tripod', 'Lampu'],
    langkah: [
      { judul: 'Siapkan produk', detail: 'Display rapi.' },
      { judul: 'Jadwal', detail: 'Jam ramai.' },
      { judul: 'Mulai live', detail: 'Sapa penonton.' },
      { judul: 'Demo', detail: 'Tunjukkan produk.' },
      { judul: 'Closing', detail: 'CTA beli.' },
    ],
    risiko: [{ risiko: 'Sepi penonton', pencegahan: 'Promosi dulu.' }],
    penyelesaian: 'Live berjalan.',
    tags: ['live', 'tiktok', 'jualan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_279: Tutorial[] = [
  {
    id: 'tut-perbaikan-34', slug: 'cara-ganti-lampu-2', judul: 'Cara Mengganti Lampu',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati.',
    penjelasan: 'Ganti bohlam.',
    persiapanAlat: ['Bohlam baru', 'Tangga'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Aman.' },
      { judul: 'Tunggu dingin', detail: 'Jangan pegang panas.' },
      { judul: 'Lepas', detail: 'Putar berlawanan.' },
      { judul: 'Pasang baru', detail: 'Putar searah.' },
      { judul: 'Tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Sengatan', pencegahan: 'Saklar mati.' }],
    penyelesaian: 'Lampu menyala.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_280: Tutorial[] = [
  {
    id: 'tut-teknologi-36', slug: 'cara-scan-qr-2', judul: 'Cara Scan QR Code',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 5,
    masalah: 'Tidak bisa scan QR.',
    penjelasan: 'Kamera bawaan.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Buka kamera', detail: 'Mode foto.' },
      { judul: 'Arahkan', detail: 'Ke QR.' },
      { judul: 'Tunggu', detail: 'Notifikasi muncul.' },
      { judul: 'Tap', detail: 'Buka link.' },
      { judul: 'Verifikasi', detail: 'Pastikan aman.' },
    ],
    risiko: [{ risiko: 'Phishing', pencegahan: 'Cek URL dulu.' }],
    penyelesaian: 'QR terbuka.',
    tags: ['qr', 'scan', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_281: Tutorial[] = [
  {
    id: 'tut-kerja-34', slug: 'cara-nego-gaji-2', judul: 'Cara Negosiasi Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Tawaran gaji rendah.',
    penjelasan: 'Negosiasi yang sopan.',
    persiapanAlat: ['Data UMR', 'Portofolio'],
    langkah: [
      { judul: 'Riset', detail: 'Range pasar.' },
      { judul: 'Tunda angka', detail: 'Biarkan HR dulu.' },
      { judul: 'Ajukan', detail: 'Angka + alasan.' },
      { judul: 'Diam', detail: 'Jangan buru-buru.' },
      { judul: 'Deal', detail: 'Tulis tertulis.' },
    ],
    risiko: [{ risiko: 'Gagal', pencegahan: 'Punya opsi lain.' }],
    penyelesaian: 'Gaji disepakati.',
    tags: ['gaji', 'negosiasi', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_282: Tutorial[] = [
  {
    id: 'tut-belajar-34', slug: 'cara-ikut-olimpiade-2', judul: 'Cara Mengikuti Olimpiade',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 25,
    masalah: 'Ingin ikut olimpiade.',
    penjelasan: 'OSN & seleksi.',
    persiapanAlat: ['Nilai rapor', 'Motivasi'],
    langkah: [
      { judul: 'Pilih bidang', detail: 'Sains/matematika.' },
      { judul: 'Daftar', detail: 'Via sekolah.' },
      { judul: 'Latihan', detail: 'Soal tahun lalu.' },
      { judul: 'Seleksi', detail: 'Tingkat kabupaten.' },
      { judul: 'Final', detail: 'Provinsi/nasional.' },
    ],
    risiko: [{ risiko: 'Gagal', pencegahan: 'Coba lagi tahun depan.' }],
    penyelesaian: 'Pengalaman berharga.',
    tags: ['olimpiade', 'osn', 'lomba'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_283: Tutorial[] = [
  {
    id: 'tut-mental-35', slug: 'cara-atasi-cemas-3', judul: 'Cara Mengatasi Cemas',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Sering cemas.',
    penjelasan: 'Teknik grounding.',
    persiapanAlat: ['Tempat tenang'],
    langkah: [
      { judul: 'Napas 4-7-8', detail: 'Tarik 4, tahan 7, buang 8.' },
      { judul: 'Grounding', detail: 'Sebut 5 benda terlihat.' },
      { judul: 'Tulis', detail: 'Ketakutan di kertas.' },
      { judul: 'Gerak', detail: 'Jalan 10 menit.' },
      { judul: 'Cerita', detail: 'Ke orang tepercaya.' },
    ],
    risiko: [{ risiko: 'Panik berat', pencegahan: 'Ke psikolog.' }],
    penyelesaian: 'Cemas mereda.',
    tags: ['cemas', 'mental', 'tenang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_284: Tutorial[] = [
  {
    id: 'tut-keuangan-37', slug: 'cara-buka-deposito-3', judul: 'Cara Membuka Deposito',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tabungan tergerus.',
    penjelasan: 'Deposito bank.',
    persiapanAlat: ['KTP', 'Dana'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Bunga terbaik.' },
      { judul: 'Datang/CS', detail: 'Bawa KTP.' },
      { judul: 'Isi form', detail: 'Nominal & tenor.' },
      { judul: 'Setor', detail: 'Transfer/tunai.' },
      { judul: 'Terima bilyet', detail: 'Simpan baik.' },
    ],
    risiko: [{ risiko: 'Denda cair awal', pencegahan: 'Pilih tenor pas.' }],
    penyelesaian: 'Deposito aktif.',
    tags: ['deposito', 'bank', 'tabungan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_285: Tutorial[] = [
  {
    id: 'tut-perbaikan-35', slug: 'cara-ganti-keran-3', judul: 'Cara Mengganti Keran Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keran menetes.',
    penjelasan: 'Ganti seal/keran.',
    persiapanAlat: ['Kunci inggris', 'Seal tape'],
    langkah: [
      { judul: 'Tutup air', detail: 'Stop kran utama.' },
      { judul: 'Lepas keran', detail: 'Putar kunci.' },
      { judul: 'Bersihkan', detail: 'Ulir pipa.' },
      { judul: 'Lilit seal', detail: 'Tape teflon.' },
      { judul: 'Pasang', detail: 'Tes bocor.' },
    ],
    risiko: [{ risiko: 'Banjir', pencegahan: 'Air mati dulu.' }],
    penyelesaian: 'Keran rapat.',
    tags: ['keran', 'air', 'plumbing'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_286: Tutorial[] = [
  {
    id: 'tut-teknologi-37', slug: 'cara-backup-hp-3', judul: 'Cara Backup Data HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut data hilang.',
    penjelasan: 'Backup cloud & lokal.',
    persiapanAlat: ['HP', 'Akun Google'],
    langkah: [
      { judul: 'Buka setelan', detail: 'Sistem > Backup.' },
      { judul: 'Aktifkan', detail: 'Backup Google.' },
      { judul: 'Foto', detail: 'Google Photos.' },
      { judul: 'Chat', detail: 'Backup WA.' },
      { judul: 'Verifikasi', detail: 'Cek drive.' },
    ],
    risiko: [{ risiko: 'Kuota penuh', pencegahan: 'Bersihkan dulu.' }],
    penyelesaian: 'Data aman.',
    tags: ['backup', 'hp', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_287: Tutorial[] = [
  {
    id: 'tut-kesehatan-35', slug: 'cara-cuci-tangan-3', judul: 'Cara Mencuci Tangan yang Benar',
    kategori: 'kesehatan', tingkat: 'pemula', estimasiMenit: 5,
    masalah: 'Kuman di tangan.',
    penjelasan: '6 langkah WHO.',
    persiapanAlat: ['Sabun', 'Air mengalir'],
    langkah: [
      { judul: 'Basahi', detail: 'Air mengalir.' },
      { judul: 'Sabun', detail: 'Secukupnya.' },
      { judul: 'Gosok', detail: '20 detik, 6 langkah.' },
      { judul: 'Bilas', detail: 'Bersih.' },
      { judul: 'Keringkan', detail: 'Tisu/handuk.' },
    ],
    risiko: [{ risiko: 'Kulit kering', pencegahan: 'Hand lotion.' }],
    penyelesaian: 'Tangan bersih.',
    tags: ['cuci tangan', 'higiene', 'who'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_288: Tutorial[] = [
  {
    id: 'tut-umkm-38', slug: 'cara-hitung-hpp-3', judul: 'Cara Menghitung HPP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Harga jual asal.',
    penjelasan: 'HPP & margin.',
    persiapanAlat: ['Nota belanja', 'Kalkulator'],
    langkah: [
      { judul: 'Catat bahan', detail: 'Per porsi.' },
      { judul: 'Tambah overhead', detail: 'Gas, listrik.' },
      { judul: 'Bagi porsi', detail: 'HPP per unit.' },
      { judul: 'Tentukan margin', detail: '30-50%.' },
      { judul: 'Harga jual', detail: 'HPP + margin.' },
    ],
    risiko: [{ risiko: 'Rugi', pencegahan: 'Hitung teliti.' }],
    penyelesaian: 'Harga tepat.',
    tags: ['hpp', 'umkm', 'harga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_289: Tutorial[] = [
  {
    id: 'tut-perbaikan-36', slug: 'cara-ganti-ban-3', judul: 'Cara Mengganti Ban Motor',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Ban bocor di jalan.',
    penjelasan: 'Tambal & ganti ban.',
    persiapanAlat: ['Ban dalam', 'Pompa', 'Kunci'],
    langkah: [
      { judul: 'Dongkrak', detail: 'Angkat motor.' },
      { judul: 'Lepas roda', detail: 'Buka baut as.' },
      { judul: 'Congkel ban', detail: 'Keluarkan dalam.' },
      { judul: 'Pasang baru', detail: 'Ratakan.' },
      { judul: 'Pompa', detail: 'Tekanan pas.' },
    ],
    risiko: [{ risiko: 'Jepit jari', pencegahan: 'Sarung tangan.' }],
    penyelesaian: 'Ban terpasang.',
    tags: ['ban', 'motor', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_290: Tutorial[] = [
  {
    id: 'tut-kerja-35', slug: 'cara-buat-cv-3', judul: 'Cara Membuat CV Menarik',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'CV tidak dilirik.',
    penjelasan: 'CV ATS-friendly.',
    persiapanAlat: ['Laptop', 'Data diri'],
    langkah: [
      { judul: 'Kontak', detail: 'Nama, HP, email.' },
      { judul: 'Ringkasan', detail: '2-3 baris.' },
      { judul: 'Pengalaman', detail: 'Terbaru dulu.' },
      { judul: 'Skill', detail: 'Relevan posisi.' },
      { judul: 'Format', detail: 'PDF, 1-2 halaman.' },
    ],
    risiko: [{ risiko: 'Ditolak ATS', pencegahan: 'Hindari tabel/gambar.' }],
    penyelesaian: 'CV siap kirim.',
    tags: ['cv', 'lamaran', 'kerja'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_291: Tutorial[] = [
  {
    id: 'tut-belajar-35', slug: 'cara-baca-cepat-3', judul: 'Cara Membaca Cepat',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Bacaan menumpuk.',
    penjelasan: 'Speed reading.',
    persiapanAlat: ['Buku', 'Timer'],
    langkah: [
      { judul: 'Skimming', detail: 'Judul & subjudul.' },
      { judul: 'Chunking', detail: 'Kelompok kata.' },
      { judul: 'Tanpa subvokal', detail: 'Kurangi gumam.' },
      { judul: 'Pointer', detail: 'Jari sebagai panduan.' },
      { judul: 'Latihan', detail: '15 menit/hari.' },
    ],
    risiko: [{ risiko: 'Paham turun', pencegahan: 'Seimbang kecepatan.' }],
    penyelesaian: 'Bacaan selesai.',
    tags: ['baca', 'cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_292: Tutorial[] = [
  {
    id: 'tut-mental-36', slug: 'cara-atasi-insomnia-3', judul: 'Cara Mengatasi Insomnia',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Susah tidur.',
    penjelasan: 'Sleep hygiene.',
    persiapanAlat: ['Kamar gelap'],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Bangun sama tiap hari.' },
      { judul: 'Hindari layar', detail: '1 jam sebelum tidur.' },
      { judul: 'Kamar dingin', detail: '18-22 derajat.' },
      { judul: 'Relaksasi', detail: 'Napas dalam.' },
      { judul: 'Batasi kafein', detail: 'Setelah jam 2 siang.' },
    ],
    risiko: [{ risiko: 'Kronis', pencegahan: 'Ke dokter.' }],
    penyelesaian: 'Tidur nyenyak.',
    tags: ['insomnia', 'tidur', 'sehat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_293: Tutorial[] = [
  {
    id: 'tut-keuangan-38', slug: 'cara-atasi-pinjol-3', judul: 'Cara Mengatasi Jeratan Pinjol',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Terjerat pinjol.',
    penjelasan: 'Keluar dari utang.',
    persiapanAlat: ['Daftar utang', 'Bukti transfer'],
    langkah: [
      { judul: 'Stop gali lobang', detail: 'Jangan pinjam baru.' },
      { judul: 'Negosiasi', detail: 'Minta keringanan.' },
      { judul: 'Prioritas', detail: 'Bunga terbesar dulu.' },
      { judul: 'Lapor OJK', detail: 'Bila ilegal/ancam.' },
      { judul: 'Cicil', detail: 'Konsisten bayar.' },
    ],
    risiko: [{ risiko: 'Teror DC', pencegahan: 'Lapor polisi.' }],
    penyelesaian: 'Utang lunas.',
    tags: ['pinjol', 'utang', 'ojk'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_294: Tutorial[] = [
  {
    id: 'tut-teknologi-38', slug: 'cara-cek-spesifikasi-3', judul: 'Cara Mengecek Spesifikasi HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Ingin tahu spek.',
    penjelasan: 'Cek di setelan.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Buka setelan', detail: 'Tentang ponsel.' },
      { judul: 'Lihat RAM', detail: 'Memori.' },
      { judul: 'Lihat storage', detail: 'Penyimpanan.' },
      { judul: 'Cek versi', detail: 'Android/iOS.' },
      { judul: 'Baterai', detail: 'Kesehatan baterai.' },
    ],
    risiko: [{ risiko: 'Tertipu', pencegahan: 'Cek fisik juga.' }],
    penyelesaian: 'Spek diketahui.',
    tags: ['hp', 'spek', 'cek'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_295: Tutorial[] = [
  {
    id: 'tut-perbaikan-37', slug: 'cara-servis-kipas-3', judul: 'Cara Menservis Kipas Angin',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Kipas lambat.',
    penjelasan: 'Bersihkan & oli.',
    persiapanAlat: ['Obeng', 'Oli', 'Kuas'],
    langkah: [
      { judul: 'Cabut listrik', detail: 'Aman dulu.' },
      { judul: 'Buka grill', detail: 'Lepas baut.' },
      { judul: 'Bersihkan', detail: 'Debu baling.' },
      { judul: 'Oli bushing', detail: '2-3 tetes.' },
      { judul: 'Rakit', detail: 'Tes putaran.' },
    ],
    risiko: [{ risiko: 'Sengatan', pencegahan: 'Cabut steker.' }],
    penyelesaian: 'Kipas kencang.',
    tags: ['kipas', 'servis', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_296: Tutorial[] = [
  {
    id: 'tut-keuangan-39', slug: 'cara-buka-rekening-3', judul: 'Cara Membuka Rekening Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Belum punya rekening.',
    penjelasan: 'Buka tabungan.',
    persiapanAlat: ['KTP', 'NPWP (opsional)'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Dekat rumah.' },
      { judul: 'Datang/CS', detail: 'Ambil antrean.' },
      { judul: 'Isi form', detail: 'Data diri.' },
      { judul: 'Setor awal', detail: '50-500rb.' },
      { judul: 'Terima kartu', detail: 'Aktifkan PIN.' },
    ],
    risiko: [{ risiko: 'Biaya admin', pencegahan: 'Pilih tabungan murah.' }],
    penyelesaian: 'Rekening aktif.',
    tags: ['rekening', 'bank', 'tabungan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_297: Tutorial[] = [
  {
    id: 'tut-teknologi-39', slug: 'cara-aktifkan-2fa-3', judul: 'Cara Mengaktifkan 2FA',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Akun mudah dibobol.',
    penjelasan: 'Autentikasi 2 faktor.',
    persiapanAlat: ['HP', 'App authenticator'],
    langkah: [
      { judul: 'Buka keamanan', detail: 'Setelan akun.' },
      { judul: 'Aktifkan 2FA', detail: 'Pilih authenticator.' },
      { judul: 'Scan QR', detail: 'App authenticator.' },
      { judul: 'Simpan backup', detail: 'Kode pemulihan.' },
      { judul: 'Tes', detail: 'Login ulang.' },
    ],
    risiko: [{ risiko: 'Terkunci', pencegahan: 'Simpan kode backup.' }],
    penyelesaian: 'Akun lebih aman.',
    tags: ['2fa', 'keamanan', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_298: Tutorial[] = [
  {
    id: 'tut-alat-34', slug: 'cara-pakai-multimeter-3', judul: 'Cara Menggunakan Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Ingin cek listrik.',
    penjelasan: 'Multimeter dasar.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V, A, Ohm.' },
      { judul: 'Pasang probe', detail: 'Merah-hitam.' },
      { judul: 'Ukur', detail: 'Tempel titik.' },
      { judul: 'Baca', detail: 'Layar digital.' },
      { judul: 'Matikan', detail: 'Hemat baterai.' },
    ],
    risiko: [{ risiko: 'Korslet', pencegahan: 'Mode benar.' }],
    penyelesaian: 'Pengukuran selesai.',
    tags: ['multimeter', 'listrik', 'ukur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_299: Tutorial[] = [
  {
    id: 'tut-perbaikan-38', slug: 'cara-servis-motor-3', judul: 'Cara Servis Motor Sendiri',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 45,
    masalah: 'Motor brebet.',
    penjelasan: 'Servis ringan.',
    persiapanAlat: ['Kunci set', 'Oli', 'Busi'],
    langkah: [
      { judul: 'Ganti oli', detail: 'Tiap 2000 km.' },
      { judul: 'Bersihkan filter', detail: 'Udara.' },
      { judul: 'Cek busi', detail: 'Ganti bila aus.' },
      { judul: 'Setel rantai', detail: 'Kekencangan pas.' },
      { judul: 'Tes jalan', detail: 'Pastikan halus.' },
    ],
    risiko: [{ risiko: 'Salah pasang', pencegahan: 'Foto sebelum bongkar.' }],
    penyelesaian: 'Motor prima.',
    tags: ['motor', 'servis', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_300: Tutorial[] = [
  {
    id: 'tut-kehidupan-36', slug: 'cara-atur-keuangan-3', judul: 'Cara Mengatur Keuangan Rumah Tangga',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Gaji habis duluan.',
    penjelasan: 'Budgeting 50-30-20.',
    persiapanAlat: ['Catatan', 'Kalkulator'],
    langkah: [
      { judul: 'Catat pemasukan', detail: 'Semua sumber.' },
      { judul: '50% kebutuhan', detail: 'Makan, sewa.' },
      { judul: '30% keinginan', detail: 'Hiburan.' },
      { judul: '20% tabung', detail: 'Dana darurat.' },
      { judul: 'Evaluasi', detail: 'Tiap bulan.' },
    ],
    risiko: [{ risiko: 'Bocor', pencegahan: 'Pisahkan rekening.' }],
    penyelesaian: 'Keuangan terkendali.',
    tags: ['keuangan', 'budget', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_301: Tutorial[] = [
  {
    id: 'tut-perbaikan-39', slug: 'cara-ganti-lampu-3', judul: 'Cara Mengganti Lampu',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati.',
    penjelasan: 'Ganti bohlam.',
    persiapanAlat: ['Bohlam baru', 'Tangga'],
    langkah: [
      { judul: 'Matikan saklar', detail: 'Aman.' },
      { judul: 'Tunggu dingin', detail: 'Jangan pegang panas.' },
      { judul: 'Lepas', detail: 'Putar berlawanan.' },
      { judul: 'Pasang baru', detail: 'Putar searah.' },
      { judul: 'Tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Sengatan', pencegahan: 'Saklar mati.' }],
    penyelesaian: 'Lampu menyala.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_302: Tutorial[] = [
  {
    id: 'tut-kehidupan-37', slug: 'cara-hidup-sehat-3', judul: 'Cara Hidup Sehat Sederhana',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Badan mudah sakit.',
    penjelasan: 'Pola hidup sehat.',
    persiapanAlat: ['Niat', 'Jadwal'],
    langkah: [
      { judul: 'Makan seimbang', detail: 'Isi piringku.' },
      { judul: 'Olahraga', detail: '30 menit/hari.' },
      { judul: 'Tidur cukup', detail: '7-8 jam.' },
      { judul: 'Kelola stres', detail: 'Relaksasi.' },
      { judul: 'Cek rutin', detail: 'Medical checkup.' },
    ],
    risiko: [{ risiko: 'Kambuh', pencegahan: 'Konsisten.' }],
    penyelesaian: 'Badan bugar.',
    tags: ['sehat', 'gaya hidup', 'bugar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_303: Tutorial[] = [
  {
    id: 'tut-perbaikan-40', slug: 'cara-ganti-keran-4', judul: 'Cara Mengganti Keran Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keran menetes.',
    penjelasan: 'Ganti seal/keran.',
    persiapanAlat: ['Kunci inggris', 'Seal tape'],
    langkah: [
      { judul: 'Tutup air', detail: 'Stop kran utama.' },
      { judul: 'Lepas keran', detail: 'Putar kunci.' },
      { judul: 'Bersihkan', detail: 'Ulir pipa.' },
      { judul: 'Lilit seal', detail: 'Tape teflon.' },
      { judul: 'Pasang', detail: 'Tes bocor.' },
    ],
    risiko: [{ risiko: 'Banjir', pencegahan: 'Air mati dulu.' }],
    penyelesaian: 'Keran rapat.',
    tags: ['keran', 'air', 'plumbing'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_304: Tutorial[] = [
  {
    id: 'tut-teknologi-40', slug: 'cara-scan-qr-3', judul: 'Cara Scan QR Code',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 5,
    masalah: 'Tidak bisa scan QR.',
    penjelasan: 'Kamera bawaan.',
    persiapanAlat: ['HP'],
    langkah: [
      { judul: 'Buka kamera', detail: 'Mode foto.' },
      { judul: 'Arahkan', detail: 'Ke QR.' },
      { judul: 'Tunggu', detail: 'Notifikasi muncul.' },
      { judul: 'Tap', detail: 'Buka link.' },
      { judul: 'Verifikasi', detail: 'Pastikan aman.' },
    ],
    risiko: [{ risiko: 'Phishing', pencegahan: 'Cek URL dulu.' }],
    penyelesaian: 'QR terbuka.',
    tags: ['qr', 'scan', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_305: Tutorial[] = [
  {
    id: 'tut-perbaikan-41', slug: 'cara-ganti-ban-4', judul: 'Cara Mengganti Ban Motor',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Ban bocor di jalan.',
    penjelasan: 'Tambal & ganti ban.',
    persiapanAlat: ['Ban dalam', 'Pompa', 'Kunci'],
    langkah: [
      { judul: 'Dongkrak', detail: 'Angkat motor.' },
      { judul: 'Lepas roda', detail: 'Buka baut as.' },
      { judul: 'Congkel ban', detail: 'Keluarkan dalam.' },
      { judul: 'Pasang baru', detail: 'Ratakan.' },
      { judul: 'Pompa', detail: 'Tekanan pas.' },
    ],
    risiko: [{ risiko: 'Jepit jari', pencegahan: 'Sarung tangan.' }],
    penyelesaian: 'Ban terpasang.',
    tags: ['ban', 'motor', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_306: Tutorial[] = [
  {
    id: 'tut-kerja-36', slug: 'cara-interview-3', judul: 'Cara Menghadapi Interview Kerja',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 25,
    masalah: 'Gugup interview.',
    penjelasan: 'Persiapan & STAR.',
    persiapanAlat: ['CV', 'Pakaian rapi'],
    langkah: [
      { judul: 'Riset perusahaan', detail: 'Profil & visi.' },
      { judul: 'Latihan STAR', detail: 'Situasi-tugas-aksi-hasil.' },
      { judul: 'Datang awal', detail: '15 menit.' },
      { judul: 'Jawab tenang', detail: 'Kontak mata.' },
      { judul: 'Follow up', detail: 'Email terima kasih.' },
    ],
    risiko: [{ risiko: 'Blank', pencegahan: 'Latihan mock.' }],
    penyelesaian: 'Interview lancar.',
    tags: ['interview', 'kerja', 'lamaran'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_307: Tutorial[] = [
  {
    id: 'tut-belajar-36', slug: 'cara-ikut-lomba-3', judul: 'Cara Mengikuti Lomba',
    kategori: 'belajar', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin ikut lomba.',
    penjelasan: 'Persiapan lomba.',
    persiapanAlat: ['Info lomba', 'Karya'],
    langkah: [
      { judul: 'Cari info', detail: 'Medsos & sekolah.' },
      { judul: 'Baca syarat', detail: 'Kategori & deadline.' },
      { judul: 'Siapkan karya', detail: 'Sesuai tema.' },
      { judul: 'Daftar', detail: 'Form & biaya.' },
      { judul: 'Tampil', detail: 'Percaya diri.' },
    ],
    risiko: [{ risiko: 'Kalah', pencegahan: 'Jadikan pengalaman.' }],
    penyelesaian: 'Lomba diikuti.',
    tags: ['lomba', 'kompetisi', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_308: Tutorial[] = [
  {
    id: 'tut-mental-37', slug: 'cara-atasi-overthinking-3', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran berputar.',
    penjelasan: 'Batasi ruminasi.',
    persiapanAlat: ['Jurnal'],
    langkah: [
      { judul: 'Sadari', detail: 'Labeli pikiran.' },
      { judul: 'Batasi waktu', detail: '15 menit khawatir.' },
      { judul: 'Fakta vs opini', detail: 'Tulis bukti.' },
      { judul: 'Aksi kecil', detail: 'Satu langkah.' },
      { judul: 'Alihkan', detail: 'Aktivitas fisik.' },
    ],
    risiko: [{ risiko: 'Kronis', pencegahan: 'Ke psikolog.' }],
    penyelesaian: 'Pikiran tenang.',
    tags: ['overthinking', 'mental', 'tenang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_309: Tutorial[] = [
  {
    id: 'tut-keuangan-40', slug: 'cara-bayar-pajak-3', judul: 'Cara Membayar Pajak Motor',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pajak mati.',
    penjelasan: 'Bayar via Samsat.',
    persiapanAlat: ['STNK', 'KTP'],
    langkah: [
      { judul: 'Cek nominal', detail: 'App Samsat.' },
      { judul: 'Datang', detail: 'Bawa dokumen.' },
      { judul: 'Bayar', detail: 'Loket / online.' },
      { judul: 'Ambil STNK', detail: 'Sudah cap.' },
      { judul: 'Simpan', detail: 'Foto arsip.' },
    ],
    risiko: [{ risiko: 'Denda', pencegahan: 'Bayar tepat waktu.' }],
    penyelesaian: 'Pajak lunas.',
    tags: ['pajak', 'motor', 'samsat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_310: Tutorial[] = [
  {
    id: 'tut-umkm-39', slug: 'cara-hitung-hpp-4', judul: 'Cara Menghitung HPP',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Harga jual asal.',
    penjelasan: 'Hitung HPP akurat.',
    persiapanAlat: ['Kalkulator', 'Nota belanja'],
    langkah: [
      { judul: 'Bahan baku', detail: 'Per porsi.' },
      { judul: 'Tenaga kerja', detail: 'Per jam.' },
      { judul: 'Overhead', detail: 'Listrik & sewa.' },
      { judul: 'Total', detail: 'Jumlahkan.' },
      { judul: 'Margin', detail: 'Tambah 30%.' },
    ],
    risiko: [{ risiko: 'Rugi', pencegahan: 'HPP akurat.' }],
    penyelesaian: 'Harga jual sehat.',
    tags: ['hpp', 'umkm', 'harga'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_311: Tutorial[] = [
  {
    id: 'tut-kehidupan-38', slug: 'cara-bersihkan-rumah-3', judul: 'Cara Membersihkan Rumah Cepat',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Rumah berantakan.',
    penjelasan: 'Metode 15 menit.',
    persiapanAlat: ['Sapu', 'Lap', 'Kantong sampah'],
    langkah: [
      { judul: 'Musik on', detail: 'Semangat.' },
      { judul: 'Kumpulkan', detail: 'Barang berserakan.' },
      { judul: 'Sapu', detail: 'Per ruangan.' },
      { judul: 'Lap', detail: 'Meja & kaca.' },
      { judul: 'Buang', detail: 'Sampah keluar.' },
    ],
    risiko: [{ risiko: 'Lelah', pencegahan: 'Istirahat tiap 15 menit.' }],
    penyelesaian: 'Rumah rapi.',
    tags: ['rumah', 'bersih', 'rapi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_312: Tutorial[] = [
  {
    id: 'tut-perbaikan-42', slug: 'cara-ganti-lampu-4', judul: 'Cara Mengganti Lampu Mati',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Lampu mati.',
    penjelasan: 'Ganti aman.',
    persiapanAlat: ['Lampu baru', 'Tangga'],
    langkah: [
      { judul: 'Matikan listrik', detail: 'MCB off.' },
      { judul: 'Dinginkan', detail: 'Tunggu dingin.' },
      { judul: 'Lepas', detail: 'Putar berlawanan.' },
      { judul: 'Pasang', detail: 'Watt sama.' },
      { judul: 'Nyalakan', detail: 'Tes.' },
    ],
    risiko: [{ risiko: 'Setrum', pencegahan: 'Listrik mati.' }],
    penyelesaian: 'Lampu menyala.',
    tags: ['lampu', 'listrik', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_313: Tutorial[] = [
  {
    id: 'tut-keuangan-41', slug: 'cara-buka-rekening-4', judul: 'Cara Membuka Rekening Bank',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Belum punya rekening.',
    penjelasan: 'Buka via app.',
    persiapanAlat: ['KTP', 'HP'],
    langkah: [
      { judul: 'Pilih bank', detail: 'Bandingkan biaya.' },
      { judul: 'Download app', detail: 'Resmi.' },
      { judul: 'Isi data', detail: 'KTP & selfie.' },
      { judul: 'Verifikasi', detail: 'Video call.' },
      { judul: 'Setor awal', detail: 'Minimal.' },
    ],
    risiko: [{ risiko: 'Penipuan', pencegahan: 'App resmi.' }],
    penyelesaian: 'Rekening aktif.',
    tags: ['rekening', 'bank', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_314: Tutorial[] = [
  {
    id: 'tut-teknologi-41', slug: 'cara-backup-hp-4', judul: 'Cara Backup Data HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut data hilang.',
    penjelasan: 'Backup rutin.',
    persiapanAlat: ['HP', 'Cloud'],
    langkah: [
      { judul: 'Aktifkan sinkron', detail: 'Google/Apple.' },
      { judul: 'Foto', detail: 'Google Photos.' },
      { judul: 'Chat', detail: 'Backup WA.' },
      { judul: 'Dokumen', detail: 'Drive.' },
      { judul: 'Jadwal', detail: 'Otomatis mingguan.' },
    ],
    risiko: [{ risiko: 'Bocor', pencegahan: '2FA aktif.' }],
    penyelesaian: 'Data aman.',
    tags: ['backup', 'hp', 'data'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_315: Tutorial[] = [
  {
    id: 'tut-alat-35', slug: 'cara-pakai-multimeter-4', judul: 'Cara Memakai Multimeter',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tidak tahu ukur listrik.',
    penjelasan: 'Volt & ohm.',
    persiapanAlat: ['Multimeter', 'Baterai'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V DC.' },
      { judul: 'Pasang probe', detail: 'Merah-hitam.' },
      { judul: 'Ukur', detail: 'Tempel kutub.' },
      { judul: 'Baca', detail: 'Layar digital.' },
      { judul: 'Matikan', detail: 'Hemat baterai.' },
    ],
    risiko: [{ risiko: 'Konslet', pencegahan: 'Mode benar.' }],
    penyelesaian: 'Pengukuran tepat.',
    tags: ['multimeter', 'listrik', 'ukur'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_316: Tutorial[] = [
  {
    id: 'tut-perbaikan-43', slug: 'cara-perbaiki-keran-5', judul: 'Cara Memperbaiki Keran Bocor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keran menetes.',
    penjelasan: 'Ganti seal.',
    persiapanAlat: ['Kunci inggris', 'Seal tape'],
    langkah: [
      { judul: 'Tutup air', detail: 'Stop kran.' },
      { judul: 'Bongkar', detail: 'Lepas handle.' },
      { judul: 'Ganti seal', detail: 'Karet baru.' },
      { judul: 'Rakit', detail: 'Kencangkan.' },
      { judul: 'Tes', detail: 'Buka air.' },
    ],
    risiko: [{ risiko: 'Banjir', pencegahan: 'Air mati.' }],
    penyelesaian: 'Keran rapat.',
    tags: ['keran', 'bocor', 'plumbing'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_317: Tutorial[] = [
  {
    id: 'tut-kerja-37', slug: 'cara-freelance-3', judul: 'Cara Mulai Freelance',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Ingin penghasilan tambahan.',
    penjelasan: 'Freelance dari nol.',
    persiapanAlat: ['Skill', 'Portofolio'],
    langkah: [
      { judul: 'Pilih skill', detail: 'Yang dikuasai.' },
      { judul: 'Buat portofolio', detail: '3-5 contoh.' },
      { judul: 'Daftar platform', detail: 'Sribulancer/Upwork.' },
      { judul: 'Bid proyek', detail: 'Proposal menarik.' },
      { judul: 'Deliver', detail: 'Tepat waktu.' },
    ],
    risiko: [{ risiko: 'Klien kabur', pencegahan: 'DP 50%.' }],
    penyelesaian: 'Proyek pertama selesai.',
    tags: ['freelance', 'kerja', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_318: Tutorial[] = [
  {
    id: 'tut-belajar-37', slug: 'cara-baca-cepat-4', judul: 'Cara Membaca Cepat',
    kategori: 'belajar', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Lambat baca.',
    penjelasan: 'Skimming & scanning.',
    persiapanAlat: ['Buku', 'Timer'],
    langkah: [
      { judul: 'Preview', detail: 'Judul & sub.' },
      { judul: 'Skimming', detail: 'Kalimat pertama.' },
      { judul: 'Chunking', detail: 'Kelompok kata.' },
      { judul: 'Tanpa subvokal', detail: 'Kurangi gumam.' },
      { judul: 'Latihan', detail: 'Timer harian.' },
    ],
    risiko: [{ risiko: 'Tidak paham', pencegahan: 'Ulangi bagian penting.' }],
    penyelesaian: '2x lebih cepat.',
    tags: ['baca', 'cepat', 'belajar'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_319: Tutorial[] = [
  {
    id: 'tut-mental-38', slug: 'cara-atasi-cemas-4', judul: 'Cara Mengatasi Rasa Cemas',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Cemas berlebihan.',
    penjelasan: 'Grounding 5-4-3-2-1.',
    persiapanAlat: ['Tempat tenang'],
    langkah: [
      { judul: 'Sadari', detail: 'Ini cemas.' },
      { judul: 'Napas 4-7-8', detail: 'Tarik-tahan-buang.' },
      { judul: 'Grounding', detail: '5 hal terlihat.' },
      { judul: 'Tulis', detail: 'Apa yang ditakutkan.' },
      { judul: 'Aksi', detail: 'Satu hal kecil.' },
    ],
    risiko: [{ risiko: 'Panik', pencegahan: 'Ke profesional.' }],
    penyelesaian: 'Cemas mereda.',
    tags: ['cemas', 'mental', 'grounding'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_320: Tutorial[] = [
  {
    id: 'tut-keuangan-42', slug: 'cara-hitung-deposito-4', judul: 'Cara Menghitung Deposito',
    kategori: 'keuangan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Bingung deposito.',
    penjelasan: 'Bunga & pajak.',
    persiapanAlat: ['Kalkulator'],
    langkah: [
      { judul: 'Pilih tenor', detail: '1-12 bulan.' },
      { judul: 'Cek suku bunga', detail: 'Bank.' },
      { judul: 'Hitung bruto', detail: 'Pokok x bunga x tenor/12.' },
      { judul: 'Kurangi pajak', detail: '20%.' },
      { judul: 'Bandingkan', detail: 'Antar bank.' },
    ],
    risiko: [{ risiko: 'Penalti', pencegahan: 'Jangan cairkan awal.' }],
    penyelesaian: 'Deposito optimal.',
    tags: ['deposito', 'bank', 'investasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_321: Tutorial[] = [
  {
    id: 'tut-perbaikan-44', slug: 'cara-servis-kipas-4', judul: 'Cara Memperbaiki Kipas Angin Mati',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 30,
    masalah: 'Kipas mati total.',
    penjelasan: 'Cek kapasitor.',
    persiapanAlat: ['Obeng', 'Multimeter'],
    langkah: [
      { judul: 'Cabut listrik', detail: 'Aman dulu.' },
      { judul: 'Bongkar', detail: 'Buka casing.' },
      { judul: 'Cek kapasitor', detail: 'Gembung = rusak.' },
      { judul: 'Ganti', detail: 'Nilai sama.' },
      { judul: 'Rakit & tes', detail: 'Putar lancar.' },
    ],
    risiko: [{ risiko: 'Setrum', pencegahan: 'Cabut colokan.' }],
    penyelesaian: 'Kipas berputar.',
    tags: ['kipas', 'servis', 'elektronik'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_322: Tutorial[] = [
  {
    id: 'tut-umkm-40', slug: 'cara-jualan-shopee-4', judul: 'Cara Jualan di Shopee',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Ingin jualan online.',
    penjelasan: 'Buka toko Shopee.',
    persiapanAlat: ['KTP', 'Produk', 'HP'],
    langkah: [
      { judul: 'Daftar seller', detail: 'App Shopee.' },
      { judul: 'Upload produk', detail: 'Foto bagus.' },
      { judul: 'Atur ongkir', detail: 'Gratis ongkir.' },
      { judul: 'Promosi', detail: 'Voucher & live.' },
      { judul: 'Kirim', detail: 'Resi otomatis.' },
    ],
    risiko: [{ risiko: 'Retur', pencegahan: 'Deskripsi jujur.' }],
    penyelesaian: 'Toko berjalan.',
    tags: ['shopee', 'jualan', 'online'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_323: Tutorial[] = [
  {
    id: 'tut-perbaikan-45', slug: 'cara-ganti-oli-4', judul: 'Cara Mengganti Oli Motor',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Oli hitam.',
    penjelasan: 'Ganti tiap 2000 km.',
    persiapanAlat: ['Oli baru', 'Kunci ring', 'Wadah'],
    langkah: [
      { judul: 'Panaskan', detail: '2 menit.' },
      { judul: 'Buka baut', detail: 'Tampung oli.' },
      { judul: 'Tutup', detail: 'Kencangkan.' },
      { judul: 'Tuang', detail: 'Takaran pas.' },
      { judul: 'Cek', detail: 'Dipstick.' },
    ],
    risiko: [{ risiko: 'Tumpah', pencegahan: 'Corong.' }],
    penyelesaian: 'Mesin halus.',
    tags: ['oli', 'motor', 'servis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_324: Tutorial[] = [
  {
    id: 'tut-teknologi-42', slug: 'cara-scan-dokumen-4', judul: 'Cara Scan Dokumen HP',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Butuh scan cepat.',
    penjelasan: 'Scan via kamera.',
    persiapanAlat: ['HP', 'Dokumen'],
    langkah: [
      { judul: 'Buka app', detail: 'Kamera/notes.' },
      { judul: 'Posisikan', detail: 'Rata & terang.' },
      { judul: 'Jepret', detail: 'Otomatis crop.' },
      { judul: 'Simpan PDF', detail: 'Ekspor.' },
      { judul: 'Kirim', detail: 'WA/email.' },
    ],
    risiko: [{ risiko: 'Blur', pencegahan: 'Tahan stabil.' }],
    penyelesaian: 'Dokumen PDF jadi.',
    tags: ['scan', 'dokumen', 'hp'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_325: Tutorial[] = [
  {
    id: 'tut-perbaikan-46', slug: 'cara-servis-motor-4', judul: 'Cara Servis Motor Sendiri',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 40,
    masalah: 'Motor brebet.',
    penjelasan: 'Servis ringan.',
    persiapanAlat: ['Oli', 'Busi', 'Kunci'],
    langkah: [
      { judul: 'Ganti oli', detail: 'Sesuai takaran.' },
      { judul: 'Bersihkan filter', detail: 'Udara.' },
      { judul: 'Cek busi', detail: 'Ganti bila aus.' },
      { judul: 'Setel rantai', detail: 'Kendor pas.' },
      { judul: 'Tes jalan', detail: 'Stabil.' },
    ],
    risiko: [{ risiko: 'Salah pasang', pencegahan: 'Foto sebelum bongkar.' }],
    penyelesaian: 'Motor halus.',
    tags: ['motor', 'servis', 'bengkel'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_326: Tutorial[] = [
  {
    id: 'tut-kehidupan-39', slug: 'cara-tidur-nyenyak-4', judul: 'Cara Tidur Nyenyak',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Insomnia.',
    penjelasan: 'Sleep hygiene.',
    persiapanAlat: ['Kamar gelap'],
    langkah: [
      { judul: 'Jadwal tetap', detail: 'Jam sama.' },
      { judul: 'Jauhi layar', detail: '1 jam sebelum.' },
      { judul: 'Kamar dingin', detail: 'Nyaman.' },
      { judul: 'Relaksasi', detail: 'Napas dalam.' },
      { judul: 'Hindari kafein', detail: 'Sore hari.' },
    ],
    risiko: [{ risiko: 'Kronis', pencegahan: 'Ke dokter.' }],
    penyelesaian: 'Tidur pulas.',
    tags: ['tidur', 'insomnia', 'sehat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_327: Tutorial[] = [
  {
    id: 'tut-perbaikan-47', slug: 'cara-ganti-ban-5', judul: 'Cara Menambal Ban Tubeless',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ban tubeless bocor.',
    penjelasan: 'Tambal cacing.',
    persiapanAlat: ['Cacing tambal', 'Lem', 'Pompa'],
    langkah: [
      { judul: 'Temukan lubang', detail: 'Air sabun.' },
      { judul: 'Kikir', detail: 'Perbesar sedikit.' },
      { judul: 'Oles lem', detail: 'Pada cacing.' },
      { judul: 'Tusuk', detail: 'Alat cacing.' },
      { judul: 'Potong & pompa', detail: 'Rata.' },
    ],
    risiko: [{ risiko: 'Bocor lagi', pencegahan: 'Ke tukang bila besar.' }],
    penyelesaian: 'Ban rapat.',
    tags: ['ban', 'tubeless', 'tambal'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_328: Tutorial[] = [
  {
    id: 'tut-alat-36', slug: 'cara-pakai-bor-4', judul: 'Cara Memakai Bor Listrik',
    kategori: 'alat', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Takut pakai bor.',
    penjelasan: 'Bor aman.',
    persiapanAlat: ['Bor', 'Mata bor', 'Kacamata'],
    langkah: [
      { judul: 'Pasang mata', detail: 'Kencangkan chuck.' },
      { judul: 'Tandai', detail: 'Titik bor.' },
      { judul: 'Bor pelan', detail: 'Tekan ringan.' },
      { judul: 'Dinginkan', detail: 'Jeda.' },
      { judul: 'Bersihkan', detail: 'Serbuk.' },
    ],
    risiko: [{ risiko: 'Luka', pencegahan: 'Kacamata & sarung.' }],
    penyelesaian: 'Lubang rapi.',
    tags: ['bor', 'tukang', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_329: Tutorial[] = [
  {
    id: 'tut-perbaikan-48', slug: 'cara-perbaiki-kompresor-4', judul: 'Cara Merawat Kompresor AC',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 25,
    masalah: 'AC tidak dingin.',
    penjelasan: 'Cek freon & filter.',
    persiapanAlat: ['Obeng', 'Vacuum'],
    langkah: [
      { judul: 'Cek filter', detail: 'Bersihkan.' },
      { judul: 'Cek freon', detail: 'Tekanan.' },
      { judul: 'Cek kapasitor', detail: 'Outdoor.' },
      { judul: 'Cuci unit', detail: 'Jet cleaner.' },
      { judul: 'Tes', detail: 'Dingin merata.' },
    ],
    risiko: [{ risiko: 'Freon bocor', pencegahan: 'Teknisi bila ragu.' }],
    penyelesaian: 'AC dingin.',
    tags: ['ac', 'kompresor', 'servis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_330: Tutorial[] = [
  {
    id: 'tut-keuangan-43', slug: 'cara-hitung-reksadana-4', judul: 'Cara Menghitung Reksa Dana',
    kategori: 'keuangan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Ingin investasi.',
    penjelasan: 'NAB & return.',
    persiapanAlat: ['Kalkulator', 'Aplikasi'],
    langkah: [
      { judul: 'Pilih jenis', detail: 'Pasar uang/saham.' },
      { judul: 'Cek NAB', detail: 'Harian.' },
      { judul: 'Hitung unit', detail: 'Dana/NAB.' },
      { judul: 'Pantau return', detail: 'Bulanan.' },
      { judul: 'Evaluasi', detail: '1 tahun.' },
    ],
    risiko: [{ risiko: 'Rugi', pencegahan: 'Diversifikasi.' }],
    penyelesaian: 'Investasi jalan.',
    tags: ['reksadana', 'investasi', 'keuangan'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_331: Tutorial[] = [
  {
    id: 'tut-perbaikan-49', slug: 'cara-perbaiki-gerinda-4', judul: 'Cara Merawat Gerinda',
    kategori: 'perbaikan', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Gerinda panas.',
    penjelasan: 'Carbon brush.',
    persiapanAlat: ['Obeng', 'Carbon brush'],
    langkah: [
      { judul: 'Cabut listrik', detail: 'Aman.' },
      { judul: 'Buka casing', detail: 'Belakang.' },
      { judul: 'Cek brush', detail: 'Pendek = ganti.' },
      { judul: 'Ganti', detail: 'Pasang baru.' },
      { judul: 'Tes', detail: 'Putar halus.' },
    ],
    risiko: [{ risiko: 'Setrum', pencegahan: 'Cabut colokan.' }],
    penyelesaian: 'Gerinda normal.',
    tags: ['gerinda', 'tukang', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_332: Tutorial[] = [
  {
    id: 'tut-kehidupan-40', slug: 'cara-hemat-listrik-4', judul: 'Cara Menghemat Listrik',
    kategori: 'kehidupan', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Tagihan bengkak.',
    penjelasan: 'Audit energi.',
    persiapanAlat: ['Tagihan', 'Kalkulator'],
    langkah: [
      { judul: 'Catat pemakaian', detail: 'Per alat.' },
      { judul: 'Ganti LED', detail: 'Hemat 80%.' },
      { judul: 'Cabut standby', detail: 'Vampire load.' },
      { judul: 'AC 25 derajat', detail: 'Efisien.' },
      { judul: 'Pantau', detail: 'Tiap bulan.' },
    ],
    risiko: [{ risiko: 'Tidak nyaman', pencegahan: 'Bertahap.' }],
    penyelesaian: 'Tagihan turun.',
    tags: ['listrik', 'hemat', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_333: Tutorial[] = [
  {
    id: 'tut-perbaikan-50', slug: 'cara-ganti-lampu-5', judul: 'Cara Memasang Lampu LED Strip',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Ingin dekorasi lampu.',
    penjelasan: 'Pasang LED strip.',
    persiapanAlat: ['LED strip', 'Adaptor', 'Gunting'],
    langkah: [
      { judul: 'Ukur', detail: 'Panjang area.' },
      { judul: 'Potong', detail: 'Garis potong.' },
      { judul: 'Tempel', detail: 'Lepas 3M.' },
      { judul: 'Sambung', detail: 'Adaptor.' },
      { judul: 'Tes', detail: 'Nyalakan.' },
    ],
    risiko: [{ risiko: 'Konslet', pencegahan: 'Adaptor sesuai watt.' }],
    penyelesaian: 'Ruangan estetik.',
    tags: ['led', 'lampu', 'dekorasi'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_334: Tutorial[] = [
  {
    id: 'tut-umkm-41', slug: 'cara-live-jualan-4', judul: 'Cara Live Jualan',
    kategori: 'umkm', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Sepi pembeli.',
    penjelasan: 'Live shopping.',
    persiapanAlat: ['HP', 'Ring light', 'Produk'],
    langkah: [
      { judul: 'Jadwal', detail: 'Rutin.' },
      { judul: 'Siapkan', detail: 'Produk & harga.' },
      { judul: 'Sapa', detail: 'Interaktif.' },
      { judul: 'Demo', detail: 'Tunjukkan.' },
      { judul: 'Closing', detail: 'Voucher.' },
    ],
    risiko: [{ risiko: 'Sepi penonton', pencegahan: 'Promosi dulu.' }],
    penyelesaian: 'Order masuk.',
    tags: ['live', 'jualan', 'umkm'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_335: Tutorial[] = [
  {
    id: 'tut-perbaikan-51', slug: 'cara-ganti-keran-6', judul: 'Cara Memasang Keran Air Baru',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Keran rusak total.',
    penjelasan: 'Pasang keran baru.',
    persiapanAlat: ['Keran baru', 'Kunci inggris', 'Seal tape'],
    langkah: [
      { judul: 'Tutup air', detail: 'Stop kran.' },
      { judul: 'Lepas lama', detail: 'Putar.' },
      { judul: 'Bersihkan ulir', detail: 'Sikat.' },
      { judul: 'Lilit seal', detail: 'Teflon.' },
      { judul: 'Pasang & tes', detail: 'Kencang.' },
    ],
    risiko: [{ risiko: 'Bocor', pencegahan: 'Seal cukup.' }],
    penyelesaian: 'Keran baru terpasang.',
    tags: ['keran', 'air', 'plumbing'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_336: Tutorial[] = [
  {
    id: 'tut-kerja-40', slug: 'cara-raport-kerja-4', judul: 'Cara Membuat Laporan Kerja',
    kategori: 'kerja', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Bingung bikin laporan.',
    penjelasan: 'Format laporan.',
    persiapanAlat: ['Laptop', 'Data'],
    langkah: [
      { judul: 'Kumpulkan data', detail: 'Mingguan.' },
      { judul: 'Buat ringkasan', detail: 'Executive summary.' },
      { judul: 'Tabel & grafik', detail: 'Visual.' },
      { judul: 'Analisis', detail: 'Insight.' },
      { judul: 'Kirim', detail: 'Tepat waktu.' },
    ],
    risiko: [{ risiko: 'Data salah', pencegahan: 'Verifikasi.' }],
    penyelesaian: 'Laporan rapi.',
    tags: ['laporan', 'kerja', 'kantor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_337: Tutorial[] = [
  {
    id: 'tut-perbaikan-52', slug: 'cara-ganti-ban-6', judul: 'Cara Menambal Ban Tubeless',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Ban bocor paku.',
    penjelasan: 'Tambal cacing.',
    persiapanAlat: ['Kit tambal', 'Pompa'],
    langkah: [
      { judul: 'Cari bocor', detail: 'Air sabun.' },
      { judul: 'Cabut paku', detail: 'Tang.' },
      { judul: 'Reamer', detail: 'Lubang.' },
      { judul: 'Masukkan cacing', detail: 'Lem.' },
      { judul: 'Potong & pompa', detail: 'Tekanan.' },
    ],
    risiko: [{ risiko: 'Bocor lagi', pencegahan: 'Tambal tip-top.' }],
    penyelesaian: 'Ban aman.',
    tags: ['ban', 'tubeless', 'motor'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_338: Tutorial[] = [
  {
    id: 'tut-mental-44', slug: 'cara-atasi-overthinking-4', judul: 'Cara Mengatasi Overthinking',
    kategori: 'mental', tingkat: 'pemula', estimasiMenit: 15,
    masalah: 'Pikiran berputar.',
    penjelasan: 'Teknik grounding.',
    persiapanAlat: ['Jurnal'],
    langkah: [
      { judul: 'Sadari', detail: 'Stop sejenak.' },
      { judul: 'Tulis', detail: 'Keluarkan.' },
      { judul: 'Fakta vs takut', detail: 'Pisahkan.' },
      { judul: 'Aksi kecil', detail: 'Satu langkah.' },
      { judul: 'Istirahat', detail: 'Tidur cukup.' },
    ],
    risiko: [{ risiko: 'Cemas berat', pencegahan: 'Profesional bila perlu.' }],
    penyelesaian: 'Pikiran tenang.',
    tags: ['overthinking', 'mental', 'tenang'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_339: Tutorial[] = [
  {
    id: 'tut-perbaikan-53', slug: 'cara-servis-oli-5', judul: 'Cara Ganti Oli Mesin',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 30,
    masalah: 'Oli hitam.',
    penjelasan: 'Ganti oli rutin.',
    persiapanAlat: ['Oli baru', 'Filter', 'Kunci'],
    langkah: [
      { judul: 'Panaskan', detail: '2 menit.' },
      { judul: 'Buang', detail: 'Baut bawah.' },
      { judul: 'Ganti filter', detail: 'Oles oli.' },
      { judul: 'Isi baru', detail: 'Sesuai spek.' },
      { judul: 'Cek dipstick', detail: 'Level.' },
    ],
    risiko: [{ risiko: 'Oli tumpah', pencegahan: 'Wadah.' }],
    penyelesaian: 'Mesin halus.',
    tags: ['oli', 'motor', 'servis'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_340: Tutorial[] = [
  {
    id: 'tut-kerja-41', slug: 'cara-negosiasi-gaji-5', judul: 'Cara Negosiasi Gaji',
    kategori: 'kerja', tingkat: 'menengah', estimasiMenit: 20,
    masalah: 'Gaji kurang.',
    penjelasan: 'Negosiasi data.',
    persiapanAlat: ['Data pasar'],
    langkah: [
      { judul: 'Riset pasar', detail: 'Range gaji.' },
      { judul: 'Catat prestasi', detail: 'Bukti.' },
      { judul: 'Tentukan target', detail: 'Angka.' },
      { judul: 'Sampaikan', detail: 'Tenang.' },
      { judul: 'Kompromi', detail: 'Benefit.' },
    ],
    risiko: [{ risiko: 'Ditolak', pencegahan: 'Tetap profesional.' }],
    penyelesaian: 'Gaji naik.',
    tags: ['gaji', 'negosiasi', 'karier'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_341: Tutorial[] = [
  {
    id: 'tut-perbaikan-54', slug: 'cara-perbaiki-kipas-5', judul: 'Cara Memperbaiki Kipas Angin',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 25,
    masalah: 'Kipas tidak berputar.',
    penjelasan: 'Cek kapasitor & bos.',
    persiapanAlat: ['Obeng', 'Kapasitor', 'Oli'],
    langkah: [
      { judul: 'Cabut listrik', detail: 'Aman.' },
      { judul: 'Buka cover', detail: 'Belakang.' },
      { judul: 'Cek kapasitor', detail: 'Ganti bila kembung.' },
      { judul: 'Oli bos', detail: 'Teteskan.' },
      { judul: 'Tes', detail: 'Putar.' },
    ],
    risiko: [{ risiko: 'Setrum', pencegahan: 'Cabut colokan.' }],
    penyelesaian: 'Kipas berputar.',
    tags: ['kipas', 'angin', 'rumah'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_342: Tutorial[] = [
  {
    id: 'tut-teknologi-45', slug: 'cara-aktifkan-2fa-5', judul: 'Cara Mengaktifkan 2FA',
    kategori: 'teknologi', tingkat: 'pemula', estimasiMenit: 10,
    masalah: 'Akun diretas.',
    penjelasan: 'Autentikasi 2 faktor.',
    persiapanAlat: ['HP', 'Aplikasi authenticator'],
    langkah: [
      { judul: 'Buka pengaturan', detail: 'Keamanan.' },
      { judul: 'Aktifkan 2FA', detail: 'Pilih metode.' },
      { judul: 'Scan QR', detail: 'Authenticator.' },
      { judul: 'Simpan kode', detail: 'Backup.' },
      { judul: 'Tes login', detail: 'Verifikasi.' },
    ],
    risiko: [{ risiko: 'Kunci akun', pencegahan: 'Simpan backup.' }],
    penyelesaian: 'Akun aman.',
    tags: ['2fa', 'keamanan', 'akun'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const TUTORIAL_TAMBAHAN_343: Tutorial[] = [
  {
    id: 'tut-perbaikan-55', slug: 'cara-perbaiki-multimeter-5', judul: 'Cara Memakai Multimeter',
    kategori: 'perbaikan', tingkat: 'pemula', estimasiMenit: 20,
    masalah: 'Tidak tahu ukur listrik.',
    penjelasan: 'Dasar multimeter.',
    persiapanAlat: ['Multimeter'],
    langkah: [
      { judul: 'Pilih mode', detail: 'V, A, ohm.' },
      { judul: 'Ukur tegangan', detail: 'Paralel.' },
      { judul: 'Ukur arus', detail: 'Seri.' },
      { judul: 'Ukur resistansi', detail: 'Tanpa daya.' },
      { judul: 'Baca hasil', detail: 'Display.' },
    ],
    risiko: [{ risiko: 'Konslet', pencegahan: 'Mode benar.' }],
    penyelesaian: 'Bisa ukur listrik.',
    tags: ['multimeter', 'listrik', 'alat'], dibuatPada: '2026-10-19', diperbaruiPada: '2026-10-19',
  },
];

export const ALL_TUTORIALS: Tutorial[] = [
  ...SEMUA_TUTORIAL,
  ...TUTORIAL_TAMBAHAN_1,
  ...TUTORIAL_TAMBAHAN_2,
  ...TUTORIAL_TAMBAHAN_3,
  ...TUTORIAL_TAMBAHAN_4,
  ...TUTORIAL_TAMBAHAN_5,
  ...TUTORIAL_TAMBAHAN_6,
  ...TUTORIAL_TAMBAHAN_7,
  ...TUTORIAL_TAMBAHAN_8,
  ...TUTORIAL_TAMBAHAN_9,
  ...TUTORIAL_TAMBAHAN_10,
  ...TUTORIAL_TAMBAHAN_11,
  ...TUTORIAL_TAMBAHAN_12,
  ...TUTORIAL_TAMBAHAN_13,
  ...TUTORIAL_TAMBAHAN_14,
  ...TUTORIAL_TAMBAHAN_15,
  ...TUTORIAL_TAMBAHAN_16,
  ...TUTORIAL_TAMBAHAN_17,
  ...TUTORIAL_TAMBAHAN_18,
  ...TUTORIAL_TAMBAHAN_19,
  ...TUTORIAL_TAMBAHAN_20,
  ...TUTORIAL_TAMBAHAN_21,
  ...TUTORIAL_TAMBAHAN_22,
  ...TUTORIAL_TAMBAHAN_23,
  ...TUTORIAL_TAMBAHAN_24,
  ...TUTORIAL_TAMBAHAN_25,
  ...TUTORIAL_TAMBAHAN_26,
  ...TUTORIAL_TAMBAHAN_27,
  ...TUTORIAL_TAMBAHAN_28,
  ...TUTORIAL_TAMBAHAN_29,
  ...TUTORIAL_TAMBAHAN_30,
  ...TUTORIAL_TAMBAHAN_31,
  ...TUTORIAL_TAMBAHAN_32,
  ...TUTORIAL_TAMBAHAN_33,
  ...TUTORIAL_TAMBAHAN_34,
  ...TUTORIAL_TAMBAHAN_35,
  ...TUTORIAL_TAMBAHAN_36,
  ...TUTORIAL_TAMBAHAN_37,
  ...TUTORIAL_TAMBAHAN_38,
  ...TUTORIAL_TAMBAHAN_39,
  ...TUTORIAL_TAMBAHAN_40,
  ...TUTORIAL_TAMBAHAN_41,
  ...TUTORIAL_TAMBAHAN_42,
  ...TUTORIAL_TAMBAHAN_43,
  ...TUTORIAL_TAMBAHAN_44,
  ...TUTORIAL_TAMBAHAN_45,
  ...TUTORIAL_TAMBAHAN_46,
  ...TUTORIAL_TAMBAHAN_47,
  ...TUTORIAL_TAMBAHAN_48,
  ...TUTORIAL_TAMBAHAN_49,
  ...TUTORIAL_TAMBAHAN_50,
  ...TUTORIAL_TAMBAHAN_51,
  ...TUTORIAL_TAMBAHAN_52,
  ...TUTORIAL_TAMBAHAN_53,
  ...TUTORIAL_TAMBAHAN_54,
  ...TUTORIAL_TAMBAHAN_55,
  ...TUTORIAL_TAMBAHAN_56,
  ...TUTORIAL_TAMBAHAN_57,
  ...TUTORIAL_TAMBAHAN_58,
  ...TUTORIAL_TAMBAHAN_59,
  ...TUTORIAL_TAMBAHAN_60,
  ...TUTORIAL_TAMBAHAN_61,
  ...TUTORIAL_TAMBAHAN_62,
  ...TUTORIAL_TAMBAHAN_63,
  ...TUTORIAL_TAMBAHAN_64,
  ...TUTORIAL_TAMBAHAN_65,
  ...TUTORIAL_TAMBAHAN_66,
  ...TUTORIAL_TAMBAHAN_67,
  ...TUTORIAL_TAMBAHAN_68,
  ...TUTORIAL_TAMBAHAN_69,
  ...TUTORIAL_TAMBAHAN_70,
  ...TUTORIAL_TAMBAHAN_71,
  ...TUTORIAL_TAMBAHAN_72,
  ...TUTORIAL_TAMBAHAN_73,
  ...TUTORIAL_TAMBAHAN_74,
  ...TUTORIAL_TAMBAHAN_75,
  ...TUTORIAL_TAMBAHAN_76,
  ...TUTORIAL_TAMBAHAN_77,
  ...TUTORIAL_TAMBAHAN_78,
  ...TUTORIAL_TAMBAHAN_79,
  ...TUTORIAL_TAMBAHAN_80,
  ...TUTORIAL_TAMBAHAN_81,
  ...TUTORIAL_TAMBAHAN_82,
  ...TUTORIAL_TAMBAHAN_83,
  ...TUTORIAL_TAMBAHAN_84,
  ...TUTORIAL_TAMBAHAN_85,
  ...TUTORIAL_TAMBAHAN_86,
  ...TUTORIAL_TAMBAHAN_87,
  ...TUTORIAL_TAMBAHAN_88,
  ...TUTORIAL_TAMBAHAN_89,
  ...TUTORIAL_TAMBAHAN_90,
  ...TUTORIAL_TAMBAHAN_91,
  ...TUTORIAL_TAMBAHAN_92,
  ...TUTORIAL_TAMBAHAN_93,
  ...TUTORIAL_TAMBAHAN_94,
  ...TUTORIAL_TAMBAHAN_95,
  ...TUTORIAL_TAMBAHAN_96,
  ...TUTORIAL_TAMBAHAN_97,
  ...TUTORIAL_TAMBAHAN_98,
  ...TUTORIAL_TAMBAHAN_99,
  ...TUTORIAL_TAMBAHAN_100,
  ...TUTORIAL_TAMBAHAN_101,
  ...TUTORIAL_TAMBAHAN_102,
  ...TUTORIAL_TAMBAHAN_103,
  ...TUTORIAL_TAMBAHAN_104,
  ...TUTORIAL_TAMBAHAN_105,
  ...TUTORIAL_TAMBAHAN_106,
  ...TUTORIAL_TAMBAHAN_107,
  ...TUTORIAL_TAMBAHAN_108,
  ...TUTORIAL_TAMBAHAN_109,
  ...TUTORIAL_TAMBAHAN_110,
  ...TUTORIAL_TAMBAHAN_111,
  ...TUTORIAL_TAMBAHAN_112,
  ...TUTORIAL_TAMBAHAN_113,
  ...TUTORIAL_TAMBAHAN_114,
  ...TUTORIAL_TAMBAHAN_115,
  ...TUTORIAL_TAMBAHAN_116,
  ...TUTORIAL_TAMBAHAN_117,
  ...TUTORIAL_TAMBAHAN_118,
  ...TUTORIAL_TAMBAHAN_119,
  ...TUTORIAL_TAMBAHAN_120,
  ...TUTORIAL_TAMBAHAN_121,
  ...TUTORIAL_TAMBAHAN_122,
  ...TUTORIAL_TAMBAHAN_123,
  ...TUTORIAL_TAMBAHAN_124,
  ...TUTORIAL_TAMBAHAN_125,
  ...TUTORIAL_TAMBAHAN_126,
  ...TUTORIAL_TAMBAHAN_127,
  ...TUTORIAL_TAMBAHAN_128,
  ...TUTORIAL_TAMBAHAN_129,
  ...TUTORIAL_TAMBAHAN_130,
  ...TUTORIAL_TAMBAHAN_131,
  ...TUTORIAL_TAMBAHAN_132,
  ...TUTORIAL_TAMBAHAN_133,
  ...TUTORIAL_TAMBAHAN_134,
  ...TUTORIAL_TAMBAHAN_135,
  ...TUTORIAL_TAMBAHAN_136,
  ...TUTORIAL_TAMBAHAN_137,
  ...TUTORIAL_TAMBAHAN_138,
  ...TUTORIAL_TAMBAHAN_139,
  ...TUTORIAL_TAMBAHAN_140,
  ...TUTORIAL_TAMBAHAN_141,
  ...TUTORIAL_TAMBAHAN_142,
  ...TUTORIAL_TAMBAHAN_143,
  ...TUTORIAL_TAMBAHAN_144,
  ...TUTORIAL_TAMBAHAN_145,
  ...TUTORIAL_TAMBAHAN_146,
  ...TUTORIAL_TAMBAHAN_147,
  ...TUTORIAL_TAMBAHAN_148,
  ...TUTORIAL_TAMBAHAN_149,
  ...TUTORIAL_TAMBAHAN_150,
  ...TUTORIAL_TAMBAHAN_151,
  ...TUTORIAL_TAMBAHAN_152,
  ...TUTORIAL_TAMBAHAN_153,
  ...TUTORIAL_TAMBAHAN_154,
  ...TUTORIAL_TAMBAHAN_155,
  ...TUTORIAL_TAMBAHAN_156,
  ...TUTORIAL_TAMBAHAN_157,
  ...TUTORIAL_TAMBAHAN_158,
  ...TUTORIAL_TAMBAHAN_159,
  ...TUTORIAL_TAMBAHAN_160,
  ...TUTORIAL_TAMBAHAN_161,
  ...TUTORIAL_TAMBAHAN_162,
  ...TUTORIAL_TAMBAHAN_163,
  ...TUTORIAL_TAMBAHAN_164,
  ...TUTORIAL_TAMBAHAN_165,
  ...TUTORIAL_TAMBAHAN_166,
  ...TUTORIAL_TAMBAHAN_167,
  ...TUTORIAL_TAMBAHAN_168,
  ...TUTORIAL_TAMBAHAN_169,
  ...TUTORIAL_TAMBAHAN_170,
  ...TUTORIAL_TAMBAHAN_171,
  ...TUTORIAL_TAMBAHAN_172,
  ...TUTORIAL_TAMBAHAN_173,
  ...TUTORIAL_TAMBAHAN_174,
  ...TUTORIAL_TAMBAHAN_175,
  ...TUTORIAL_TAMBAHAN_176,
  ...TUTORIAL_TAMBAHAN_177,
  ...TUTORIAL_TAMBAHAN_178,
  ...TUTORIAL_TAMBAHAN_179,
  ...TUTORIAL_TAMBAHAN_180,
  ...TUTORIAL_TAMBAHAN_181,
  ...TUTORIAL_TAMBAHAN_182,
  ...TUTORIAL_TAMBAHAN_183,
  ...TUTORIAL_TAMBAHAN_184,
  ...TUTORIAL_TAMBAHAN_185,
  ...TUTORIAL_TAMBAHAN_186,
  ...TUTORIAL_TAMBAHAN_187,
  ...TUTORIAL_TAMBAHAN_188,
  ...TUTORIAL_TAMBAHAN_189,
  ...TUTORIAL_TAMBAHAN_190,
  ...TUTORIAL_TAMBAHAN_191,
  ...TUTORIAL_TAMBAHAN_192,
  ...TUTORIAL_TAMBAHAN_193,
  ...TUTORIAL_TAMBAHAN_194,
  ...TUTORIAL_TAMBAHAN_195,
  ...TUTORIAL_TAMBAHAN_196,
  ...TUTORIAL_TAMBAHAN_197,
  ...TUTORIAL_TAMBAHAN_198,
  ...TUTORIAL_TAMBAHAN_199,
  ...TUTORIAL_TAMBAHAN_200,
  ...TUTORIAL_TAMBAHAN_201,
  ...TUTORIAL_TAMBAHAN_202,
  ...TUTORIAL_TAMBAHAN_203,
  ...TUTORIAL_TAMBAHAN_204,
  ...TUTORIAL_TAMBAHAN_205,
  ...TUTORIAL_TAMBAHAN_206,
  ...TUTORIAL_TAMBAHAN_207,
  ...TUTORIAL_TAMBAHAN_208,
  ...TUTORIAL_TAMBAHAN_209,
  ...TUTORIAL_TAMBAHAN_210,
  ...TUTORIAL_TAMBAHAN_211,
  ...TUTORIAL_TAMBAHAN_212,
  ...TUTORIAL_TAMBAHAN_213,
  ...TUTORIAL_TAMBAHAN_214,
  ...TUTORIAL_TAMBAHAN_215,
  ...TUTORIAL_TAMBAHAN_216,
  ...TUTORIAL_TAMBAHAN_217,
  ...TUTORIAL_TAMBAHAN_218,
  ...TUTORIAL_TAMBAHAN_219,
  ...TUTORIAL_TAMBAHAN_220,
  ...TUTORIAL_TAMBAHAN_221,
  ...TUTORIAL_TAMBAHAN_222,
  ...TUTORIAL_TAMBAHAN_223,
  ...TUTORIAL_TAMBAHAN_224,
  ...TUTORIAL_TAMBAHAN_225,
  ...TUTORIAL_TAMBAHAN_226,
  ...TUTORIAL_TAMBAHAN_227,
  ...TUTORIAL_TAMBAHAN_228,
  ...TUTORIAL_TAMBAHAN_229,
  ...TUTORIAL_TAMBAHAN_230,
  ...TUTORIAL_TAMBAHAN_231,
  ...TUTORIAL_TAMBAHAN_232,
  ...TUTORIAL_TAMBAHAN_233,
  ...TUTORIAL_TAMBAHAN_234,
  ...TUTORIAL_TAMBAHAN_235,
  ...TUTORIAL_TAMBAHAN_236,
  ...TUTORIAL_TAMBAHAN_237,
  ...TUTORIAL_TAMBAHAN_238,
  ...TUTORIAL_TAMBAHAN_239,
  ...TUTORIAL_TAMBAHAN_240,
  ...TUTORIAL_TAMBAHAN_241,
  ...TUTORIAL_TAMBAHAN_242,
  ...TUTORIAL_TAMBAHAN_243,
  ...TUTORIAL_TAMBAHAN_244,
  ...TUTORIAL_TAMBAHAN_245,
  ...TUTORIAL_TAMBAHAN_246,
  ...TUTORIAL_TAMBAHAN_247,
  ...TUTORIAL_TAMBAHAN_248,
  ...TUTORIAL_TAMBAHAN_249,
  ...TUTORIAL_TAMBAHAN_250,
  ...TUTORIAL_TAMBAHAN_251,
  ...TUTORIAL_TAMBAHAN_252,
  ...TUTORIAL_TAMBAHAN_253,
  ...TUTORIAL_TAMBAHAN_254,
  ...TUTORIAL_TAMBAHAN_255,
  ...TUTORIAL_TAMBAHAN_256,
  ...TUTORIAL_TAMBAHAN_257,
  ...TUTORIAL_TAMBAHAN_258,
  ...TUTORIAL_TAMBAHAN_259,
  ...TUTORIAL_TAMBAHAN_260,
  ...TUTORIAL_TAMBAHAN_261,
  ...TUTORIAL_TAMBAHAN_262,
  ...TUTORIAL_TAMBAHAN_263,
  ...TUTORIAL_TAMBAHAN_264,
  ...TUTORIAL_TAMBAHAN_265,
  ...TUTORIAL_TAMBAHAN_266,
  ...TUTORIAL_TAMBAHAN_267,
  ...TUTORIAL_TAMBAHAN_268,
  ...TUTORIAL_TAMBAHAN_269,
  ...TUTORIAL_TAMBAHAN_270,
  ...TUTORIAL_TAMBAHAN_271,
  ...TUTORIAL_TAMBAHAN_272,
  ...TUTORIAL_TAMBAHAN_273,
  ...TUTORIAL_TAMBAHAN_274,
  ...TUTORIAL_TAMBAHAN_275,
  ...TUTORIAL_TAMBAHAN_276,
  ...TUTORIAL_TAMBAHAN_277,
  ...TUTORIAL_TAMBAHAN_278,
  ...TUTORIAL_TAMBAHAN_279,
  ...TUTORIAL_TAMBAHAN_280,
  ...TUTORIAL_TAMBAHAN_281,
  ...TUTORIAL_TAMBAHAN_282,
  ...TUTORIAL_TAMBAHAN_283,
  ...TUTORIAL_TAMBAHAN_284,
  ...TUTORIAL_TAMBAHAN_285,
  ...TUTORIAL_TAMBAHAN_286,
  ...TUTORIAL_TAMBAHAN_287,
  ...TUTORIAL_TAMBAHAN_288,
  ...TUTORIAL_TAMBAHAN_289,
  ...TUTORIAL_TAMBAHAN_290,
  ...TUTORIAL_TAMBAHAN_291,
  ...TUTORIAL_TAMBAHAN_292,
  ...TUTORIAL_TAMBAHAN_293,
  ...TUTORIAL_TAMBAHAN_294,
  ...TUTORIAL_TAMBAHAN_295,
  ...TUTORIAL_TAMBAHAN_296,
  ...TUTORIAL_TAMBAHAN_297,
  ...TUTORIAL_TAMBAHAN_298,
  ...TUTORIAL_TAMBAHAN_299,
  ...TUTORIAL_TAMBAHAN_300,
  ...TUTORIAL_TAMBAHAN_301,
  ...TUTORIAL_TAMBAHAN_302,
  ...TUTORIAL_TAMBAHAN_303,
  ...TUTORIAL_TAMBAHAN_304,
  ...TUTORIAL_TAMBAHAN_305,
  ...TUTORIAL_TAMBAHAN_306,
  ...TUTORIAL_TAMBAHAN_307,
  ...TUTORIAL_TAMBAHAN_308,
  ...TUTORIAL_TAMBAHAN_309,
  ...TUTORIAL_TAMBAHAN_310,
  ...TUTORIAL_TAMBAHAN_311,
  ...TUTORIAL_TAMBAHAN_312,
  ...TUTORIAL_TAMBAHAN_313,
  ...TUTORIAL_TAMBAHAN_314,
  ...TUTORIAL_TAMBAHAN_315,
  ...TUTORIAL_TAMBAHAN_316,
  ...TUTORIAL_TAMBAHAN_317,
  ...TUTORIAL_TAMBAHAN_318,
  ...TUTORIAL_TAMBAHAN_319,
  ...TUTORIAL_TAMBAHAN_320,
  ...TUTORIAL_TAMBAHAN_321,
  ...TUTORIAL_TAMBAHAN_322,
  ...TUTORIAL_TAMBAHAN_323,
  ...TUTORIAL_TAMBAHAN_324,
  ...TUTORIAL_TAMBAHAN_325,
  ...TUTORIAL_TAMBAHAN_326,
  ...TUTORIAL_TAMBAHAN_327,
  ...TUTORIAL_TAMBAHAN_328,
  ...TUTORIAL_TAMBAHAN_329,
  ...TUTORIAL_TAMBAHAN_330,
  ...TUTORIAL_TAMBAHAN_331,
  ...TUTORIAL_TAMBAHAN_332,
  ...TUTORIAL_TAMBAHAN_333,
  ...TUTORIAL_TAMBAHAN_334,
  ...TUTORIAL_TAMBAHAN_335,
  ...TUTORIAL_TAMBAHAN_336,
  ...TUTORIAL_TAMBAHAN_337,
  ...TUTORIAL_TAMBAHAN_338,
  ...TUTORIAL_TAMBAHAN_339,
  ...TUTORIAL_TAMBAHAN_340,
  ...TUTORIAL_TAMBAHAN_341,
  ...TUTORIAL_TAMBAHAN_342,
  ...TUTORIAL_TAMBAHAN_343,
  ...TUTORIAL_BATCH2,
  ...TUTORIAL_BATCH3,
  ...TUTORIAL_BATCH4,
];
