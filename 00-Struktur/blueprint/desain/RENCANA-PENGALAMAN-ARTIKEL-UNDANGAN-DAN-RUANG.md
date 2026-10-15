# Rencana Pengalaman Pengguna: Artikel, Undangan, dan Ruang Madevi

**Status:** pekerjaan pengguna sekarang mencakup seluruh isi/source pengalaman web. Perbaikan pertama diterapkan pada indeks ruang beranda; item kedua, `ARTICLE-READER-001`, sudah diimplementasikan dan diverifikasi pada build lokal (audit independen/Termux belum). Alur undangan/jasa dan audit seluruh route masih terbuka; belum berarti semua route selesai.
**Sumber kebutuhan:** instruksi Owner tentang pengalaman yang keren, nyaman, mudah dan modern; fitur pembaca artikel; alur template/pemesanan undangan; dan penataan seluruh isi/source web.
**Control plane:** status dan lock hanya ditentukan `../INDEX.md`. Item aktif `UX-REFINE-001` tetap pada batas shell/tema; rencana ini tidak memperluas lock aktif.

## Prinsip produk

1. Mulai dari pekerjaan pengguna, bukan dari dekorasi: menemukan → memahami → bertindak → mendapat hasil → kembali tanpa kehilangan konteks.
2. Setiap halaman punya satu tindakan utama yang jelas, konteks yang cukup, dan state loading/kosong/gagal/akses/berhasil yang jujur.
3. Tata visual khas sesuai tugas. Artikel adalah permukaan membaca tenang; galeri adalah ruang menjelajah dan membandingkan; form adalah workspace; hasil undangan adalah halaman personal yang menjaga privasi. Jangan menyamakan semuanya menjadi kartu generik.
4. Pertahankan route, API, izin, data, bahasa, aksesibilitas dan tiga tema. Jangan menerbitkan contoh sebagai template order, jangan mengarang harga/jadwal/fitur RSVP, dan jangan meminta data acara sebelum pengguna memahami kegunaannya.
5. Semua fitur tambahan harus progressive enhancement pada perangkat lokal. Kalau kemampuan perangkat tidak tersedia, beri fallback dan pesan yang ramah—jangan membuat tombol yang pura-pura bekerja.

## Baseline yang sudah terkonfirmasi

### Artikel

- `/artikel/[id]` menggunakan satu page entry untuk artikel database maupun starter berlabel `CONTOH · DRAFT`.
- `ArticlePageClient` sudah memuat tindakan simpan, salin tautan, bahasa, ajukan koreksi, tautan jalur belajar, daftar isi, sumber, navigasi serial, serta akses/empty states.
- Belum ditemukan kontrol ukuran huruf, Text-to-Speech, ataupun mode baca khusus pada komponen pembaca. Mode baca bebas gangguan memang menjadi target spesifikasi halaman, belum bukti implementasi fitur tersebut.
- Rute memakai `id` (artikel nyata saat ini UUID); jangan mengasumsikan slug atau mengubah URL dalam pekerjaan presentasi.

### Undangan dan jasa

- `/jasa?tab=LAYOUTS` sudah mempunyai galeri; katalog API memprioritaskan template produksi, dan contoh lokal diberi label preview-only serta tidak dapat dipesan.
- `InvitationOrderForm` dan endpoint order sudah ada pada jalur galeri.
- `/jasa/undangan/order` saat ini hanya menampilkan judul dan teks “akan diimplementasikan”; jadi halaman itu belum menjadi workspace form mandiri.
- `/undangan/[slug]` sudah membaca order `APPROVED`/`COMPLETED`, tetapi komponen presentasi sekarang menampilkan nama, tanggal, tempat, catatan, dan opsi cetak. Jangan menjanjikan RSVP, peta interaktif, musik, animasi, atau pemakaian seluruh `template_layout` sebelum memeriksa kontrak dan source.

### Dokumen sumber yang mengikat

- `../produk/INVENTARIS-HALAMAN.md` — route dan isi target.
- `../produk/SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md` — kontrak pembaca artikel, jasa, form undangan, hasil undangan.
- `../artikel/ATLAS-DAN-JALUR-PRAKTIK.md` — komposisi artikel, provenance, safety dan lifecycle.
- `../desain/UI-UX-DAN-TEMA.md` — konsistensi tema/motion dan kebutuhan baca yang stabil.
- `../qa/items/UX-REFINE-001.md` — lock aktif; dilarang menambahkan file artikel/undangan ke cakupannya di tengah siklus.

## Pengalaman artikel yang direncanakan

### 1. Pembuka dan orientasi

- Breadcrumb ringkas; jenis artikel/ruang; judul dan ringkasan; waktu baca hanya bila nilainya berasal dari data.
- Status edisi/review/sumber/safety tampil dekat konteks yang relevan. Label contoh/draft tetap terlihat.
- Desktop: kolom teks nyaman dibaca dengan daftar isi sebagai navigasi sekunder. HP: daftar isi collapsible yang tidak menutupi artikel.

### 2. Reader toolbar (satu baris responsif, tidak memenuhi layar)

- Kontrol ukuran teks: kecilkan/perbesar dengan ukuran minimum dan maksimum yang ditetapkan desain; tampilkan reset dan ukuran aktif secara aksesibel. Ubah body bacaan saja, tidak merusak heading, navigasi, atau layout.
- Mode baca: menyembunyikan chrome non-esensial, mempersempit gangguan, mempertahankan judul/konteks, teks, gambar/caption, sumber, safety, daftar isi, dan tombol keluar. Tidak mengubah artikel menjadi layar gelap paksa; ikut tema terpilih serta kontras.
- Baca dengan suara: hanya tampil bila browser memiliki `speechSynthesis` yang dapat digunakan. Play/pause/lanjut/stop dan posisi bagian saat ini; hentikan dengan aman saat ganti route, tab disembunyikan bila perlu, atau pengguna memilih stop. Baca konten utama saja—bukan tombol, breadcrumb, TOC, sumber ganda, atau dialog. Hormati `prefers-reduced-motion`; pengaturan motion tidak mematikan suara yang sengaja dimulai pengguna.
- Bahasa/voice mengikuti bahasa artikel sejauh browser menyediakan voice lokal. Jelaskan bahwa pilihan suara bergantung perangkat; jangan kirim teks artikel ke provider online atau mengklaim voice offline tersedia jika belum terdeteksi.
- Preferensi ukuran/mode dapat disimpan hanya sebagai preferensi tampilan lokal yang ringan bila sudah ada pola penyimpanan yang aman. Jangan menyimpan teks artikel, audio, token, atau riwayat bacaan baru tanpa keputusan dan kebijakan retensi.

### 3. Konten dan akhir bacaan

- Lebar baris/ukuran font/line-height stabil, teks panjang dan URL membungkus, link/fokus jelas, gambar tidak melampaui kolom.
- Elemen interaktif punya label serta target sentuh yang layak; tidak ada animasi yang menggeser teks.
- Penutup: sumber dan tanggal tinjau, koreksi, artikel/jalur berikutnya dari data nyata. Jangan menyisipkan CTA ujian yang tidak terkait akses/eligibility.
- State: loading skeleton yang tidak melompat, tidak ditemukan/ditarik, akses terbatas, body kosong, sumber tidak ada, gagal memuat/ulang, dan dukungan speech tidak ada.

## Pengalaman template dan pemesanan undangan

### 1. Galeri `/jasa?tab=LAYOUTS`

- Headline menerangkan hasil dan langkah; tab layanan tetap mempertahankan URL `?tab=`.
- Galeri memakai template yang benar-benar `PUBLISHED`; pencarian/filter/kategori hanya ditambahkan bila data/kontrak mendukungnya.
- Kartu memprioritaskan preview yang dapat dipahami, nama, gaya, format, harga/quote dari data, dan label availability. Contoh lokal tetap label contoh dan tidak menampilkan harga produksi atau tombol pesan.
- Pilih template membuka detail/preview yang dapat diakses keyboard (dialog atau panel; pilihan desain ditetapkan setelah audit komponen yang tersedia), menampilkan format, isi/contoh, lisensi/syarat, harga/quote dan keterbatasan. Preview diberi caption “contoh tata letak, bukan undangan final”.
- Error katalog berbeda dari katalog kosong; tombol coba ulang hanya saat error; kondisi kosong menawarkan brief custom hanya jika jalur/API memang tersedia.

### 2. Order `/jasa/undangan/order`

- Jadikan route form mandiri yang bisa dibuka langsung. Bila template dipilih dari galeri, teruskan `templateId` lewat mekanisme route/state yang kompatibel dan validasi lagi terhadap data terbit; bila tidak valid/arsip, jangan diam-diam memilih template lain.
- Urutan: pilihan template/brief → data acara minimum → format → catatan opsional → ringkasan/privasi → tinjau dan kirim. Pertahankan nama, tanggal, venue/kota, catatan, format yang sudah didukung kontrak; jangan menambah field sensitif tanpa alasan produk.
- Labelkan wajib/opsional, jelaskan mengapa data dipakai dan siapa dapat melihatnya. Validasi dekat field; nilai tidak hilang saat gagal; cegah submit ganda dan umumkan status melalui live region.
- Setelah submit, tampilkan hasil server yang nyata, status review, serta tautan tracking privat yang kanonis. Token tidak ditulis ke analitik/log atau dibagikan di tampilan umum.
- Tidak ada checkout, pembayaran, harga, tenggat produksi atau janji revisi baru tanpa data/policy Owner.

### 3. Halaman hasil `/undangan/[slug]`

- Jadikan hasil terbit sebagai halaman acara yang terasa personal, bukan formulir/kartu dashboard: hierarki nama → tanggal → lokasi → pesan; komposisi dipilih oleh versi template tersimpan yang terverifikasi.
- Konten hanya berasal dari order terbit yang sah. Beri layout responsif, tipografi dan kontras tinggi, print layout bersih bila format mendukung.
- RSVP, add-to-calendar, peta, galeri foto, musik, animasi pembuka, QR, analytics dan sharing lanjutan adalah kandidat—aktif hanya setelah ada kontrak/data/API, izin privasi, kontrol pemilik, dan fallback. Tidak dimasukkan diam-diam ke implementasi UI.
- Empty/tidak disetujui/slug salah/arsip tidak membocorkan nama, token, ataupun detail acara.

## Sistem untuk halaman lain

Gunakan blueprint route yang sudah ada; jangan membuat ulang 55 route atau menerapkan satu template visual ke semua:

- **Atlas/Tutorial/School:** orientasi dan breadcrumb → navigasi/facet → isi bersumber → relasi/jalur → state akses/safety. Reader artikel tetap sama lintas ruang.
- **Services/Shop:** jelaskan pilihan dan batas → detail/asal/harga yang sah → tindakan nyata → hasil/status.
- **Tools/Workspace:** input dan batas → proses lokal → preview hasil → ekspor/bersihkan → error/pemulihan.
- **Akun/Sosial/Profil:** privasi dan konteks pemilik → tindakan berizin → status → pengelolaan/keluar.
- **Owner/Admin:** kepadatan kerja dan tabel lebih penting dari promosi; tabel reflow/scroll terkontrol, aksi berbahaya diberi konfirmasi proporsional.

Setiap route mempertahankan identitas ruang dan kebutuhan tugasnya sambil memakai token, fokus, form-control, border, jarak dan state semantik bersama.

## Urutan pengerjaan yang disarankan

1. **Tutup dan audit item shell aktif (`UX-REFINE-001`)** melalui jalur kontrolnya; jangan menambah scope artikel/jasa pada lock itu.
2. **Kenyamanan reader artikel (`ARTICLE-READER-001`)** dikerjakan sebagai item terpisah dengan lock file komponen reader, disusul audit independen.
3. **Alur undangan/jasa** menjadi item berikutnya tersendiri setelah inspeksi kontrak/lock: galeri → preview → order → tracking/hasil; tidak boleh memasukkan pembayaran/RSVP yang belum punya kontrak.
4. **Audit UX per route berbasis inventaris/spesifikasi**: artikel/Explore, Tutorial/School, Services, Shop/Tools, akun/Sosial, Owner/Admin. Catat temuan dan bukti, prioritaskan masalah yang menghalangi tugas; jangan melakukan reskin seluruh 55 halaman tanpa alur dan acceptance yang terukur.
5. **Verifikasi tiap item**: unit kontrak, build/typecheck, browser tema 320/375/768/1024/1280, keyboard/focus, dan check route/state; Termux perlu diverifikasi terpisah oleh Owner.

## Acceptance criteria kandidat

- **R1 Artikel:** kontrol ukuran dapat dioperasikan dengan keyboard/sentuh, batas/reset jelas, hanya konten artikel berubah dan nilai muat ulang sesuai keputusan preferensi.
- **R2 Suara:** membaca teks utama dalam urutan yang benar; play/pause/lanjut/stop bisa dipakai; route change/unsupported voice tidak meninggalkan suara; tidak ada jaringan/provider eksternal.
- **R3 Mode baca:** masuk/keluar mudah, menjaga URL/posisi baca sejauh kontrak memungkinkan, sumber/safety tetap tersedia, semua tema terbaca dan tak ada layout shift konten.
- **R4 Galeri:** hanya data terbit bisa dipesan; contoh diberi label; detail preview dan harga/format tidak direka; loading/empty/error/retry bisa dibedakan.
- **R5 Undangan:** halaman order mandiri dan menerima konteks template terverifikasi; input/field errors/order result/tracking jujur; submit ganda dicegah; tidak ada pembayaran atau RSVP palsu.
- **R6 Hasil:** hanya order yang boleh dipublikasikan tampil; data personal terlindungi; template/version benar-benar dipakai atau keterbatasan ditampilkan jujur; cetak dan responsif berfungsi.
- **R7 Lintas perangkat/akses:** 320/375/768/1024/1280 tanpa scroll horizontal, teks/control tidak keluar, fokus selalu terlihat, kontras/state dapat dipahami, reduced-motion tidak menghilangkan informasi.
- **R8 Batas produk:** tidak ada route/API/database/auth/permission/payment/schema/data pribadi berubah tanpa bukti kebutuhan, lock baru, dependency, kompatibilitas dan izin yang sesuai.

## Risiko dan keputusan terbuka untuk triase

- Web Speech API/voice berbeda antar-browser/Android; dukungan perangkat nyata mesti diuji. Jangan menjanjikan TTS universal.
- Template registry menyimpan layout dinamis; perlu audit sanitizer/renderer dan versioning sebelum menggunakannya untuk membuat hasil publik.
- Route order yang sekarang placeholder perlu menerima konteks template tanpa membocorkan token pada query/log; putuskan URL/state dengan analisis kontrak.
- Preferensi reader: putuskan apakah session-only atau local preference sebelum implementasi, jelaskan privasi, dan hindari migrasi/data akun.
- Contoh lokal galeri harus tetap tidak bisa dipesan; jangan mengubah aturan visibilitas demi mengisi halaman.
- Item ini adalah usulan perencanaan. Agent 5 perlu memeriksa konflik/lock aktif dan menentukan promosi; tidak ada source yang disentuh oleh rencana ini.
