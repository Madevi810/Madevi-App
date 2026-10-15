# Spesifikasi Halaman Publik dan Akun — Madevi

**Cakupan:** 35 route non-Owner dari 55 `page.tsx` yang ditemukan 2026-09-25.
**Sifat:** rencana hasil akhir per route, bukan pernyataan bahwa fungsi telah lulus. Setiap
route di bawah tetap tunduk pada `../INDEX.md`, data lokal aktif, dan guardrail. Peta ringkas
ada di [INVENTARIS-HALAMAN.md](INVENTARIS-HALAMAN.md).

## Kontrak bersama untuk semua halaman di berkas ini

Setiap halaman harus memiliki judul H1 yang tepat, konteks posisi, satu tindakan utama,
sumber data jelas, teks yang tidak melebih-lebihkan kemampuan, serta status memuat/kosong/
gagal/akses ditolak/berhasil sesuai alur. Daftar besar memakai cursor atau pagination; form
mempertahankan input saat gagal; tindakan mutasi memberi hasil yang dapat dibaca pembaca layar.
Deep link, Back/Forward, fokus keyboard, target sentuh, reflow ponsel, tiga tema, dan reduced
motion diuji pada halaman yang berubah. Jangan mempublikasikan contoh sebagai data nyata.

## 1. Masuk dan penemuan

### `/` — Beranda

- **Isi:** identitas Madevi dan tujuan konkret; jalur cepat `pahami`, `lakukan`, `olah`;
  direktori tujuh ruang dari kontrak navigasi; konten terbit pilihan bila benar-benar ada;
  akses akun serta tautan informasi.
- **Data/aksi:** sumber ruang `navigation.ts`; setiap CTA menuju route kanonis. Artikel
  starter wajib diberi label `CONTOH`/`DRAFT`, tanpa angka statistik atau status terbit buatan.
- **Selesai bila:** pengguna dapat memilih ruang berdasarkan kebutuhannya dalam satu layar
  orientasi, semua tautan valid, dan ketiadaan konten terbit tidak diganti card palsu.

### `/ruang/jelajahi-pengetahuan` — Explore & Learn

- **Isi:** breadcrumb ringkas; pertanyaan/tujuan ruang; domain→kelompok→fokus→rak dari
  taxonomy; judul artikel terbit, filter dan relasi yang bersumber; konteks `?path=`.
- **Data/aksi:** baca taxonomy aktif dan artikel yang diizinkan; cursor untuk node/judul;
  search menuju artikel atau jalur kanonis; konsep terkait mengarah ke Tutorial bila berupa
  tindakan, tanpa menduplikasi panduan.
- **Selesai bila:** reload/back/deep link mempertahankan jalur; alias lama mengarah benar;
  nol judul, gagal memuat, dan artikel ditarik punya pesan serta tindakan pemulihan.

### `/ruang/tutorial-problem-solve` — Tutorial & Problem Solve

- **Isi:** pilihan kebutuhan/gejala, domain R7, panduan terbit, tingkat risiko, prasyarat,
  kondisi berhenti, dan jalur bantuan. Domain yang baru rencana diberi status jujur.
- **Data/aksi:** taxonomy R7 lokal dan artikel dengan review/safety; `?path=` kanonis;
  `GENERAL`/`CONTROLLED`/`STOP` berasal dari data/policy, bukan badge UI semata.
- **Selesai bila:** materi `STOP` tidak memberi prosedur, `CONTROLLED` tidak terbit tanpa
  review, serta pengguna tahu apakah boleh lanjut, berhenti, atau mencari bantuan.

### `/ruang/pendidikan-sekolah` — Madevi School

- **Isi:** jenjang dan jalur yang benar-benar tersedia, tujuan belajar, urutan materi,
  prasyarat, akses, progres dan langkah berikutnya bila login.
- **Data/aksi:** taxonomy R1 dan learning path server; bedakan materi publik, contoh,
  terkunci, dan terbit; arahkan ke `/belajar` atau `/auth` hanya bila relevan.
- **Selesai bila:** pengguna memahami apa yang bisa dipelajari sekarang, jalur yang belum
  terbit tidak terlihat seperti kurikulum lengkap, serta akses ditentukan server.

### `/ruang/[slug]` — Root ruang dan alias

- **Isi:** judul dan pengantar sesuai ruang kanonis atau halaman legacy yang memang masih
  didukung; bukan label yang dihasilkan dari slug mentah.
- **Data/aksi:** `resolveSpaceSlug` dan alias terdaftar; redirect alias ke URL kanonis,
  render navigator sesuai domain, 404 untuk slug tidak dikenal.
- **Selesai bila:** tidak ada route generik yang menampilkan menu kosong seolah kategori sah;
  URL lama tetap mengantar ke konteks benar.

### `/ruang/[slug]/[...path]` — Jalur taxonomy mendalam

- **Isi:** breadcrumb satu baris, heading node yang benar, anak node atau artikel terbit,
  konteks root, serta tautan naik satu tingkat.
- **Data/aksi:** path dari taxonomy aktif; alias/redirect aman, termasuk redirect Tutorial
  ke root `?path=`; pagination; 404 untuk path tak sah.
- **Selesai bila:** reload, Back/Forward, path lama, dan jalur yang sudah ditarik memiliki
  hasil yang dapat dipahami tanpa kehilangan orientasi.

### `/artikel/[id]` — Pembaca artikel

- **Isi:** judul, ringkasan, body asli, identitas jenis (Atlas/Praktik/School), rumah
  taxonomy, penulis/reviewer bila sah, sumber, tanggal tinjau/edisi, koreksi dan relasi.
- **Data/aksi:** read policy server; sumber/claim map saat tersedia; aksi laporan koreksi;
  `STOP` hanya batas/bantuan, bukan prosedur; artikel privat/draft tidak bocor.
- **Selesai bila:** pembaca dapat membedakan fakta, interpretasi, instruksi, dan tingkat
  kepastian; versi ditarik/forbidden/not-found memiliki state tepat; mode baca bebas gangguan.

### `/brosur-sekolah` — Penjelasan School bagi pengunjung

- **Isi:** manfaat School, cara kerja jalur/progres/ujian, batas akses, daftar materi
  `CONTOH` yang jelas, serta cara masuk.
- **Data/aksi:** contoh lokal tidak menjadi klaim kurikulum/sertifikat resmi; tautan ke
  School/auth/ketentuan terkait.
- **Selesai bila:** pengunjung tahu cakupan nyata dan prasyarat sebelum mendaftar, tanpa
  janji sertifikat atau jumlah jalur yang tidak didukung data.

### `/software` — Katalog software

- **Isi:** daftar item terbit, fungsi, platform/versi, sumber resmi/lisensi, risiko,
  tanggal tinjau, filter dan detail yang dapat dibuka.
- **Data/aksi:** API software lokal; proposal/review/report hanya bila endpoint serta izin
  mendukung; unduhan harus berasal dari resource yang sah, bukan tautan dekoratif.
- **Selesai bila:** item yang ditarik tidak tampak sebagai rekomendasi aktif; pengguna
  dapat memeriksa asal dan hak pakai sebelum mengunduh.

## 2. Belajar dan evaluasi

### `/belajar` — Indeks jalur belajar

- **Isi:** jalur tersedia untuk akun, ringkasan tujuan dan progres, prasyarat, materi
  berikutnya, serta penjelasan state terkunci.
- **Data/aksi:** learning paths dan progress milik akun; pilih/lanjut jalur;
  daftar besar dipaginasi, bukan memuat semua materi.
- **Selesai bila:** pengguna bisa melanjutkan dari tempat terakhir dan tidak diberi
  progres/kelulusan yang dihitung dari fixture atau state browser saja.

### `/belajar/[pathId]` — Jalur belajar tertentu

- **Isi:** tujuan, urutan materi, prasyarat, progres per langkah, bahan pendukung,
  evaluasi berikutnya, dan alasan akses bila terkunci.
- **Data/aksi:** path/steps/progress server; aksi tandai baca/restart mengikuti kontrak
  dan konfirmasi bila menghapus progres.
- **Selesai bila:** pindah perangkat/reload mempertahankan progres sah, materi arsip
  tidak memutus jalur tanpa penjelasan, dan akses ditolak tidak membocorkan isi.

### `/ujian` — Pusat ujian

- **Isi:** ujian yang boleh diambil, status attempt, aturan yang berasal dari versi
  assessment, kapasitas/antrian bila nyata, dan riwayat hasil.
- **Data/aksi:** eligibility server dan daftar attempt; mulai/lanjut hanya setelah cek
  izin serta kapasitas; tidak hardcode durasi/jumlah percobaan di UI.
- **Selesai bila:** pengguna tahu mengapa boleh/tidak boleh ujian dan dapat membuka attempt
  yang belum selesai atau hasil yang sah.

### `/ujian/[attemptId]` — Pengerjaan dan review attempt

- **Isi:** soal sesuai versi, navigasi soal, status simpan jawaban, aturan waktu bila ada,
  konfirmasi submit, hasil/review sesuai status penilaian.
- **Data/aksi:** save/submit/review dari API attempt milik akun; cegah submit ganda dan
  jelaskan konflik sesi/attempt habis.
- **Selesai bila:** jawaban pulih setelah gangguan yang didukung, status `menunggu dinilai`
  tidak disamarkan sebagai nilai, dan data attempt orang lain tidak terbuka.

## 3. Komunikasi dan data pribadi

### `/sosial` — Madevi Line

- **Isi:** feed berizin, pembuat/waktu/konteks, composer, tab yang benar-benar memiliki
  data, kontrol simpan/lapor/blokir, dan panduan privasi singkat.
- **Data/aksi:** API post, comment, reaction, save, report, quota; konten blokir/mute
  disaring server; upload diproses sesuai quarantine.
- **Selesai bila:** setiap aksi punya status pending/success/error, feed tidak bocor
  ke pihak terblokir, dan moderasi/empty state dapat dipahami.

### `/grup` — Kelompok sosial

- **Isi:** daftar grup, tujuan/aturan, jumlah anggota hanya dari data, status gabung,
  permintaan/banding, serta detail anggota yang diizinkan.
- **Data/aksi:** API grup dan membership; join/leave/review berizin; keputusan Owner
  mempunyai alasan dan status.
- **Selesai bila:** pengguna melihat status keanggotaan yang sama setelah reload,
  tidak dapat mengubah grup/anggota lain lewat ID, dan ada pemulihan saat request gagal.

### `/pesan` — Pesan pribadi

- **Isi:** daftar percakapan, permintaan pesan, pesan terpilih, status kirim/baca yang
  benar-benar tersedia, blokir/mute/lapor, serta keadaan tanpa percakapan.
- **Data/aksi:** conversations/messages server; pagination; operasi hanya untuk peserta
  yang berhak, konten pesan tidak masuk log.
- **Selesai bila:** pesan gagal tidak terlihat terkirim, duplikasi tertangani, blokir
  berlaku konsisten, dan pengguna dapat kembali ke percakapan via URL/state yang sah.

### `/profil/[username]` — Profil publik

- **Isi:** nama/info yang diizinkan, konten publik, konteks hubungan, jalur laporan;
  jangan menampilkan email, data privat atau aktivitas tersembunyi.
- **Data/aksi:** profil publik dan policy blokir server; aksi sosial sesuai hubungan.
- **Selesai bila:** profil privat/nonaktif/terblokir tidak bocor lewat markup, search,
  atau direct link; 404/forbidden sesuai kontrak.

### `/profile` — Pusat akun privat

- **Isi:** identitas, kontak, keamanan (password/2FA jika tersedia), preferensi,
  status entitlement, permintaan data, ekspor/hapus, serta navigasi ke simpan/riwayat.
- **Data/aksi:** API profile/account/auth dengan CSRF; hapus adalah **permintaan review**
  sampai proses nyata selesai, bukan penghapusan instan palsu.
- **Selesai bila:** perubahan sensitif memerlukan revalidasi yang sesuai, error tidak
  menghapus input, status permintaan data terbaca, dan sesi habis membawa ke login.

### `/simpan` — Item tersimpan

- **Isi:** jenis item, judul, sumber/ruang, waktu simpan, status jika item telah ditarik,
  filter yang membantu saat daftar berkembang.
- **Data/aksi:** saved items milik akun; buka atau lepas simpanan, dengan pemulihan
  jika sumber tidak lagi dapat dibaca.
- **Selesai bila:** tidak ada item milik orang lain, perubahan simpan sinkron dengan ruang
  asal, dan item arsip tidak mengarah ke halaman buntu.

### `/riwayat` — Riwayat aktivitas

- **Isi:** aktivitas yang memang direkam, waktu, kategori, target, penjelasan retensi,
  serta state ketika riwayat tidak tersedia.
- **Data/aksi:** history milik akun; filter/pagination; tautan ke target hanya bila
  permission sekarang masih mengizinkan.
- **Selesai bila:** daftar tidak mengklaim aktivitas yang tidak direkam, target privat tetap
  terlindung, dan retensi sesuai kebijakan.

### `/kontribusi` — Kontribusi pengguna

- **Isi:** pedoman usulan, jenis kontribusi, kebutuhan sumber/hak pakai, daftar kiriman,
  status review dan alasan koreksi/penolakan.
- **Data/aksi:** API kontribusi; form validasi; draft/usulan tidak masuk konten terbit.
- **Selesai bila:** pengguna dapat mengetahui apa yang terjadi setelah kirim dan Owner
  memiliki antrean untuk meninjau/menindaklanjuti.

### `/moderasi/banding` — Banding moderasi

- **Isi:** keputusan yang dapat dibanding, alasan, bukti yang boleh diserahkan,
  batas waktu jika benar-benar berlaku, status dan hasil review.
- **Data/aksi:** moderation appeals; identitas pelapor/pemohon diverifikasi; cegah
  pengiriman berulang yang tak sah.
- **Selesai bila:** banding tidak mengubah keputusan sebelum review, pemohon mendapat
  status yang benar, dan bukti privat tetap terlindung.

### `/ai-asisten` — Asisten sumber lokal

- **Isi:** cakupan kemampuan, percakapan privat, jawaban dan kutipan/tautan sumber lokal,
  ketidakpastian, kuota/ketersediaan bila berlaku.
- **Data/aksi:** retrieval artikel yang boleh dibaca akun; history percakapan milik akun;
  tidak mengklaim akses web/AI online saat runtime lokal.
- **Selesai bila:** tanpa sumber relevan Asisten mengaku tidak tahu; jawaban tidak
  membocorkan artikel privat dan percakapan gagal dapat dicoba ulang secara aman.

## 4. Layanan, katalog produk, dan alat

### `/jasa` — Madevi Services

- **Isi:** tiga jalur kerja yang tersedia sesuai data, pratinjau layanan/template terbit,
  cakupan, keluaran, versi, harga tetap atau `quote pending`, syarat revisi dan lisensi.
- **Data/aksi:** katalog jasa lokal; pilih layout/brief custom/PCB tanpa mengganti
  workspace diam-diam; URL `?tab=` mempertahankan pilihan.
- **Selesai bila:** pengguna tahu layanan mana yang dapat dipesan sekarang, harga tidak
  berasal dari fallback contoh, dan setiap brief menghasilkan status order nyata.

### `/jasa/order` — Status pesanan layanan

- **Isi:** identitas pesanan privat, item/brief, status, snapshot harga/quote, invoice,
  pesan/revisi, hasil dan batas lisensi.
- **Data/aksi:** API my-orders dengan ownership; bayar manual/review hanya bila proses
  sah; perubahan state harus terlihat setelah reload.
- **Selesai bila:** pesanan orang lain tidak bisa dibaca/diubah, status pembayaran yang
  belum terkonfirmasi tidak tampak lunas, dan pengguna tahu tindakan berikutnya.

### `/jasa/undangan/order` — Form undangan

- **Isi:** template terbit atau brief custom, data acara, preview, validasi tanggal/
  identitas, harga/quote, lisensi, privasi data undangan.
- **Data/aksi:** API undangan order; simpan order dengan idempotensi; data acara privat
  sampai hasil diterbitkan sesuai izin.
- **Selesai bila:** refresh/error tidak membuat order ganda, template tidak terbit tak
  dapat dipesan, dan pemesan memperoleh token/status yang bisa dibuka lagi.

### `/undangan/[slug]` — Hasil undangan

- **Isi:** informasi acara yang disetujui pemesan, tata letak dari versi template,
  aksesibilitas, metadata berbagi dan kontak/RSVP hanya bila fungsi benar-benar ada.
- **Data/aksi:** lookup slug terbit/berizin; tidak menampilkan draft atau data acara
  yang belum disetujui.
- **Selesai bila:** URL tidak sah/arsip punya state yang tepat, informasi pribadi tak
  bocor dari preview, dan perubahan versi tidak merusak hasil lama.

### `/belanja` — Madevi Shop

- **Isi:** pencarian, kategori nyata, hasil, sumber/mitra, penjelasan proses pembelian
  yang saat ini tersedia, serta katalog kosong yang jujur.
- **Data/aksi:** API produk `PUBLISHED`; saring/urut harga sesuai kontrak; masuk ke detail;
  tidak menampilkan total, promo atau stok rekaan.
- **Selesai bila:** saringan dan URL dapat dipulihkan, error katalog dibedakan dari kosong,
  dan aksi yang ditampilkan hanya `simpan`/`tanya` yang didukung.

### `/belanja/[id]` — Detail produk

- **Isi:** judul/gambar, spesifikasi yang dibuktikan, sumber dan tanggal verifikasi,
  mitra, harga/status, batas informasi, pertanyaan dan item terkait yang sah.
- **Data/aksi:** produk terbit dan saved/questions; lindungi ID tak sah/produk ditarik;
  tidak menyisipkan tautan afiliasi yang belum diverifikasi.
- **Selesai bila:** calon pembeli dapat membedakan informasi Madevi dan mitra, pertanyaan
  mendapat state jelas, dan tidak ada checkout terselubung.

### `/belanja/[id]/simulasi` — Route legacy pembelian

- **Isi:** keterangan jujur bahwa transaksi pada route ini tidak tersedia bila memang
  belum ada alur sah, serta jalan ke detail/tanya Owner.
- **Data/aksi:** jangan membuat order, pembayaran, stok, atau kuitansi buatan; rencana
  redirect/pensiun harus mempertahankan tautan lama.
- **Selesai bila:** tidak ada pengguna yang salah mengira simulasi sebagai pembelian
  dan semua tautan lama berakhir pada informasi yang aman.

### `/alat-bantu` — Tools & Equipment

- **Isi:** kapsul kelompok→alat, Tool Brief ringkas (input, output, risiko, retensi),
  workspace aktif dan hasil; tiga alat awal hanya Rumus, PDF, Dokumen Karier.
- **Data/aksi:** registry/engine lokal, `?tab=` kompatibel; operasi PDF tetap satu
  workspace; kandidat baru harus melewati lifecycle `PUBLISHED`.
- **Selesai bila:** input tidak valid dicegah, output dapat diperiksa/diunduh/disimpan,
  file sementara dibersihkan dan error/quota punya pemulihan.

## 5. Akses dan informasi publik

### `/auth` — Daftar dan masuk

- **Isi:** form sesuai kontrak identitas aktif, tujuan akses, syarat/privasi,
  error generik, pemulihan, dan status approval bila berlaku.
- **Data/aksi:** register/login server dengan rate limit dan session cookie; jangan
  menampilkan alur device/MFA yang tidak punya endpoint aktif.
- **Selesai bila:** akun salah tidak terungkap dari pesan, sesi tersimpan aman,
  dan pengguna kembali ke tujuan yang diizinkan setelah login.

### `/recovery` — Pemulihan akun

- **Isi:** cara meminta pemulihan, informasi minimum, batas waktu jika ada,
  pesan hasil yang tidak membocorkan keberadaan akun.
- **Data/aksi:** alur recovery lokal/Owner yang ada; rate limit dan audit.
- **Selesai bila:** permintaan tidak mengungkap data akun, proses bisa ditelusuri oleh
  Owner, dan pengguna tahu kapan/di mana mencari tindak lanjut yang nyata.

### `/tentang` — Tentang dan FAQ

- **Isi:** misi, penjelasan tujuh ruang dan batas lokal, cara kerja sumber/review,
  FAQ berbasis pertanyaan yang benar-benar muncul, kontak dukungan yang aktif.
- **Data/aksi:** halaman situs berversi; tautan ke ruang, privasi, dan laporan.
- **Selesai bila:** setiap klaim cocok dengan produk saat ini, tanggal tinjau dan
  pemilik editorial jelas, serta tautan tidak buntu.

### `/ketentuan` — Ketentuan penggunaan

- **Isi:** akun, konten, lisensi, kontribusi, sosial, layanan/Shop, larangan,
  penyelesaian masalah, versi dan tanggal efektif.
- **Data/aksi:** teks yang disetujui Owner; riwayat versi untuk pembuktian persetujuan
  bila fitur memerlukannya.
- **Selesai bila:** ketentuan menyebut alur yang benar-benar ada dan perubahan material
  tidak berlaku diam-diam tanpa proses persetujuan yang diperlukan.

### `/privasi` — Kebijakan privasi

- **Isi:** jenis data, tujuan, tempat/masa simpan, akses Owner, berbagi, hak akses/
  ekspor/hapus, insiden/kontak, versi dan tanggal efektif.
- **Data/aksi:** cocokkan dengan schema, log, backup, upload, sosial, tools, dan alur
  permintaan data di Profil; keputusan hukum oleh Owner.
- **Selesai bila:** pengguna dapat menemukan tindakan data yang nyata dan tidak ada
  janji retensi/penghapusan yang tidak didukung operasi.

### `/review` — Ulasan/masukan

- **Isi:** ruang lingkup review, pedoman, data yang dikirim, status publikasi atau
  privasi, dan cara koreksi laporan.
- **Data/aksi:** hanya gunakan alur feedback/review yang benar-benar ada; jika tidak,
  tampilkan ketersediaan jujur dan tautan bantuan.
- **Selesai bila:** kiriman memperoleh ID/status atau halaman tidak menawarkan form semu;
  moderasi dan izin dapat dilacak.

### `/laporkan-masalah` — Laporan masalah

- **Isi:** jenis masalah, URL/konteks, deskripsi, bukti opsional dengan batas file,
  privasi, urgensi keselamatan, dan harapan tindak lanjut.
- **Data/aksi:** public feedback/Owner inbox lokal dengan validasi dan rate limit;
  laporan bahaya tinggi diarahkan ke bantuan yang tepat.
- **Selesai bila:** laporan punya status/nomor atau pesan hasil yang jujur, gagal kirim
  bisa dicoba ulang, dan data sensitif tidak terbuka publik.

## Penutup audit isi per route

Untuk setiap route, Agent 1 membuat matriks `target | fakta source | gap | ID backlog | bukti`.
Jangan menandai `sesuai` hanya karena komponen dirender. Pemeriksaan minimal mencakup teks,
data, tombol, permission, response API, state gagal, mobile, dan pengelolaan oleh Owner.
