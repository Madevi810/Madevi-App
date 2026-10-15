# Spesifikasi Konsol Owner/Admin — Madevi

**Cakupan:** 20 route `page.tsx` pada `/owner/**` dan `/admin` yang ditemukan secara
statis 2026-09-25. Ini adalah kontrak target halaman dan operasi; keberadaan route bukan
bukti bahwa tiap aksi telah lulus. Pelaksanaan tunduk pada `../INDEX.md`, guardrail,
permission server, dan review Owner untuk data/publikasi sensitif.

## Kontrak konsol yang berlaku pada setiap halaman

- **Identitas dan izin:** autentikasi Owner di server untuk page/API; setiap record dicek
  resource permission. `401`, `403`, gangguan layanan, dan data kosong dibedakan. Tidak ada
  informasi privat dalam URL, log, atau error.
- **Daftar:** judul, konteks dan jumlah dari data nyata bila tersedia; filter yang sesuai
  pekerjaan, pagination/cursor, loading/empty/error/retry, timestamp dan status yang tidak
  ambigu. Tabel reflow pada ponsel.
- **Mutasi:** preview dampak, validasi server, CSRF/idempotensi bila perlu, konfirmasi
  proporsional, hasil sukses/gagal, audit pelaku-waktu-alasan, serta jalan koreksi/rollback.
  Mutasi destruktif/uang/akses/publikasi harus membawa target tepat.
- **Editorial:** draft, review, publish, archive, correction, dan supersession adalah state
  berbeda. UI tidak boleh mempromosikan draft hanya karena body lengkap.
- **Aksesibilitas:** fokus keyboard, label, pesan status `role=alert/status`, tombol target
  cukup, dan urutan form logis. Panel Admin tetap alat kerja yang tenang pada tiga tema.

## 1. Akses, dashboard, dan antrean

### `/admin` — Alias akses Admin

- **Isi:** tidak membuat konsol kedua; arahkan ke `/owner` atau login sesuai kontrak route.
- **Aksi/data:** redirect kanonis tanpa loop dan tanpa kehilangan tujuan yang diizinkan.
- **Selesai bila:** bookmark lama mencapai satu dashboard sah dan tidak melewati izin.

### `/owner/login` — Masuk Owner

- **Isi:** form sesuai credential lokal aktif, pesan error aman, bantuan pemulihan/challenge
  yang benar-benar didukung; tidak mengiklankan faktor autentikasi fiktif.
- **Aksi/data:** endpoint Owner login/session, rate limit, audit kegagalan tanpa membocorkan
  identifier, redirect hanya ke path internal yang sah.
- **Selesai bila:** sesi valid membuka konsol, sesi salah/gagal jaringan dibedakan, dan
  logout mengakhiri akses dengan aman.

### `/owner` — Dashboard pekerjaan

- **Isi:** antrean prioritas dari operasi nyata, ringkasan keadaan sistem, tugas belum
  selesai, kesalahan yang butuh tindakan, waktu pembaruan, tautan ke route yang ada.
- **Aksi/data:** `/api/v1/owner/operasi` dan layanan relevan; tidak menebak angka saat API
  gagal. Tiap kartu menjawab keputusan kerja berikutnya, bukan sekadar telemetry.
- **Selesai bila:** Owner dapat memilih tugas paling mendesak, membedakan kosong/layanan
  gagal/sesi habis, dan semua tautan menuju target yang benar.

### `/owner/inbox` — Intake lintas domain

- **Isi:** sumber pesan/permintaan, kategori, prioritas, waktu, penanggung jawab, status,
  hubungan ke perkara/akun/order/koreksi.
- **Aksi/data:** Owner inbox lokal; triase, buka detail, tandai tindak lanjut hanya jika
  endpoint mendukung; sembunyikan data sensitif dalam daftar ringkas.
- **Selesai bila:** tidak ada permintaan hilang karena filter/default, duplikasi dapat
  dikenali, dan penutupan meninggalkan alasan/audit.

## 2. Konten, taxonomy, dan halaman situs

### `/owner/artikel/baru` — Editor artikel

- **Isi:** identitas artikel/canonical key, rumah taxonomy, profil Atlas/Praktik/School,
  outline/body, sumber/hak pakai, claim map, safety/freshness, preview dan riwayat versi.
- **Aksi/data:** simpan draft, tambah sumber/blok, ajukan review, publish hanya bila
  policy server yang berlaku meluluskan semua gate; migrasi Content Packet 0039 masih pending
  sehingga rencana UI harus kompatibel dengan lifecycle `articles.status` yang ada.
- **Selesai bila:** draft aman setelah gangguan, konten berisiko tak bisa publish tanpa
  review, koreksi/edisi tidak menimpa publikasi lama tanpa jejak.

### `/owner/taxonomy` — Pengelolaan struktur pengetahuan

- **Isi:** root R1/R2/R7, node/parent, slug/code, status, alias, dampak perubahan,
  preview paket dan riwayat promosi.
- **Aksi/data:** stage/preview/promote/export dari API taxonomy; cek duplikasi, siklus,
  kedalaman `R→D→K→M→T`, artikel yang terdampak, dan redirect URL lama.
- **Selesai bila:** perubahan tidak memutus artikel/search/deep link, rollback/pemulihan
  terdokumentasi, serta node yang belum terbit tidak muncul di publik.

### `/owner/halaman-situs` — Halaman informasi

- **Isi:** versi/tanggal, preview, pemilik editorial, isi Tentang/FAQ, Ketentuan,
  Privasi, Review, dan bantuan; perbedaan draft vs terbit.
- **Aksi/data:** API site-pages; perubahan hukum/privasi menunggu persetujuan Owner dan
  catatan versi; tautan serta formulir pendukung diperiksa.
- **Selesai bila:** teks publik sesuai operasi nyata dan versi sebelumnya dapat ditelusuri.

### `/owner/feature-packages` — Paket fitur/template

- **Isi:** manifest, versi, jenis, sumber/provenance, status, perubahan, preview dan
  dependensi route/data/permission.
- **Aksi/data:** import/review/promote hanya paket yang memenuhi kontrak; jangan membaca
  Draft-HTML/Export langsung sebagai katalog runtime.
- **Selesai bila:** paket draft tidak menjadi fitur aktif, rollback terdefinisi, dan
  penerbitan satu paket tidak memutus item lama.

### `/owner/jalur` — Jalur belajar

- **Isi:** tujuan, jenjang, prasyarat, urutan materi, akses/entitlement, status terbit,
  versi dan dampak pada progres yang sudah tersimpan.
- **Aksi/data:** buat/edit/publish learning path; validasi artikel yang dapat dibaca,
  urutan tanpa lubang, aturan versi dan backward compatibility.
- **Selesai bila:** jalur terbit memiliki langkah nyata; revisi tidak mereset progres
  pengguna secara diam-diam.

## 3. Evaluasi, layanan, dan produk

### `/owner/ujian` — Antrean evaluasi

- **Isi:** daftar attempt, status, kapasitas, waktu, jalur/versi assessment, pemeriksa,
  alasan pending, serta riwayat keputusan.
- **Aksi/data:** claim/grade/release sesuai API; cegah dua pemeriksa mengklaim attempt
  sama; nilai mengikuti aturan versi yang tersimpan.
- **Selesai bila:** hasil tidak berubah karena konfigurasi baru, status menunggu/dinilai
  jelas, dan penilaian dapat diaudit.

### `/owner/ujian/bank-soal` — Bank soal

- **Isi:** soal, tujuan kompetensi, jawaban/rubrik, versi, tingkat akses, sumber,
  review, duplikasi, status publish.
- **Aksi/data:** buat/revisi/ajukan review/publish dengan API question bank; jangan
  membocorkan kunci jawaban ke route publik/attempt yang belum berhak.
- **Selesai bila:** versi attempt menunjuk soal/rubrik yang tetap, soal draft tidak
  masuk ujian, dan perubahan mempunyai reviewer/alasan.

### `/owner/jasa` — Pengelolaan layanan

- **Isi:** katalog/template terbit, brief, order, quote/harga snapshot, lisensi,
  revision limit, penanggung jawab, progres dan hasil.
- **Aksi/data:** buat/review template, terbit/arsip, tanggapi brief, transisi order
  sesuai state machine; harga/quote hanya setelah keputusan Owner.
- **Selesai bila:** pemesan melihat status yang sama, revisi tidak melampaui kontrak,
  dan tindakan uang/hasil memiliki jejak audit.

### `/owner/order` — Antrean pesanan

- **Isi:** pesanan lintas alur yang memang ada, pemilik, jenis, timestamp, harga/quote,
  pembayaran, pekerjaan tertunda dan hasil.
- **Aksi/data:** membuka detail ke workflow layanan yang sah; hindari daftar duplikat
  dengan status yang saling bertentangan antara `/owner/order` dan `/owner/jasa`.
- **Selesai bila:** order tidak hilang dari antrean saat berubah state, filter berfungsi,
  serta tindakan berikutnya jelas dan berizin.

### `/owner/produk` — Katalog dan pertanyaan Shop

- **Isi:** produk/mitra, provenance, gambar/hak pakai, spesifikasi, harga/status,
  pertanyaan pengguna, tanggal verifikasi dan alasan arsip.
- **Aksi/data:** buat/edit/publish/retire hanya setelah validasi sumber/mitra; jawab
  pertanyaan lewat API yang ada; migrasi Shop tidak menyemai katalog palsu.
- **Selesai bila:** produk publik hanya item terverifikasi, perubahan harga tertelusur,
  dan pertanyaan tersampaikan tanpa menyiratkan checkout.

## 4. Orang, sosial, dan keselamatan

### `/owner/pengguna` — Akun dan permintaan data

- **Isi:** identitas minimum, status approval/entitlement, pembatasan, permintaan
  ekspor/hapus, banding, tanggal dan alasan perubahan.
- **Aksi/data:** approve/restrict/review request dengan permission ketat, CSRF,
  konfirmasi untuk tindakan destruktif, audit; jangan tampilkan secret/OTP.
- **Selesai bila:** akses pengguna mengikuti keputusan server, ekspor/hapus punya status
  dan jejak yang benar, serta salah ID tidak mengubah akun lain.

### `/owner/grup` — Tata kelola grup

- **Isi:** usulan grup, aturan, pengelola, keanggotaan, laporan/banding dan bukti.
- **Aksi/data:** setujui/tolak/ganti manager dengan alasan; periksa konflik kepemilikan
  dan dampak terhadap anggota.
- **Selesai bila:** perubahan grup tampak konsisten di `/grup` dan aktivitas lama tidak
  hilang tanpa kebijakan retensi.

### `/owner/sosial` — Operasi Line

- **Isi:** laporan post/pesan/profil yang diizinkan, antrean prioritas, quota/retensi,
  tindakan blokir/mute dan status tindak lanjut.
- **Aksi/data:** review dan tindakan sesuai policy sosial; pisahkan data privat pesan
  dari ringkasan umum; jangan menjalankan retensi tanpa target/izin.
- **Selesai bila:** kasus tertangani dengan alasan, pihak terdampak melihat status sesuai
  haknya, dan kebijakan blokir konsisten di semua surface.

### `/owner/moderasi` — Kasus dan banding

- **Isi:** bukti, pelanggaran/kebijakan, severity, keputusan sebelumnya, banding,
  batas retensi, waktu dan reviewer.
- **Aksi/data:** preview lalu putuskan kasus/banding; tindakan berat memerlukan
  konfirmasi eksplisit; jangan menghapus bukti sebelum prosedur retensi.
- **Selesai bila:** keputusan dapat diaudit/dibanding, error tidak tampak sebagai
  sukses, dan satu kasus tidak menerima keputusan kontradiktif.

### `/owner/keamanan` — Keamanan defensif

- **Isi:** perangkat/sesi yang diizinkan, ancaman/karantina, permintaan recovery,
  audit aktivitas dan rekomendasi tindakan terbatas.
- **Aksi/data:** tindakan admin defensif dengan target tepat, rate limit, konfirmasi,
  catatan alasan; jangan menampilkan token/credential atau kontrol yang belum bekerja.
- **Selesai bila:** Owner dapat menutup akses berisiko tanpa mengganggu akun lain dan
  setiap tindakan dapat ditinjau kembali.

## 5. Operasi dan pemulihan

### `/owner/operasi` — Kesehatan sistem

- **Isi:** health lokal, backup, antrean/outbox, kegagalan, kapasitas dasar,
  timestamp dan langkah pemulihan; angka hanya dari sumber operasi nyata.
- **Aksi/data:** API operasi/backup yang ada; aksi backup, reconcile atau retry
  memerlukan target/izin dan tidak boleh menyembunyikan kegagalan.
- **Selesai bila:** Owner tahu apakah sistem dapat bekerja, data terakhir kapan
  diperbarui, dan cara melanjutkan setelah kegagalan tanpa mengarang status hijau.

## Matriks kepemilikan keputusan

| Jenis keputusan | Penanggung jawab | Bukti wajib |
|---|---|---|
| Artikel/taxonomy/jalur terbit | Owner/editor berizin menurut policy server | sumber, review, dampak URL/progres, audit |
| Harga, quote, mitra, pembayaran | Owner dengan data sah | snapshot, alasan, status transaksi, audit |
| Akses akun, hapus/ekspor data, moderasi berat | Owner dengan izin sesuai policy | target, alasan, konfirmasi, bukti, recovery |
| Backup/restore/migration | Owner/operasi | checkpoint, backup yang sah, rencana rollback, hasil drill bila diizinkan |
| Arsitektur online | Owner setelah kesiapan online | decision brief biaya, keamanan, pemilik domain, migrasi |

Agent 1 membandingkan tiap baris dengan route, API, service, dan migration aktual. Gap harus
menjadi proposal terpisah; dokumen ini tidak memberi izin menjalankan tindakan Owner.
