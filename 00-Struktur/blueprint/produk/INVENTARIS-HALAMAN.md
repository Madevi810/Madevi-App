# Inventaris Halaman dan Isi Web Madevi

**Dasar inventaris:** `Madevi_Off/src/app/**/page.tsx` dan
`Madevi_Off/src/contracts/navigation.ts`, dibaca statis 2026-09-25.  
**Arti tabel:** route **ada di source**, sedangkan kolom isi/hasil adalah **kontrak target**.
Keberadaan file tidak berarti alur telah lolos audit runtime atau siap dipublikasikan.
Status implementasi dan lock tetap di `../INDEX.md`.

**Cakupan statis saat penulisan:** 55/55 pola route `page.tsx` tercantum di berkas ini dan
memiliki bagian sendiri pada [spesifikasi publik/akun](SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md)
atau [spesifikasi Owner/Admin](SPESIFIKASI-OWNER-ADMIN.md). Hitungan ini adalah kelengkapan
**rencana per route**, bukan kelengkapan implementasi. Agent 1 mengulang pencocokan saat
route berubah dan menambah spesifikasi sebelum mengusulkan pembangunan route baru.

## A. Halaman publik, pengetahuan, dan belajar

| Route | Tujuan dan isi wajib | Tindakan/hasil dan sumber |
|---|---|---|
| `/` | Orientasi singkat Madevi, tujuh kebutuhan ruang, jalur cepat, konten terbit yang benar-benar ada. Tidak ada angka/CTA dekoratif. | Buka route kanonis dari `navigation.ts`; contoh artikel berlabel jelas. |
| `/ruang/jelajahi-pengetahuan` | Atlas Explore: breadcrumb, kategori→kelompok→jalur→judul, filter/pencarian, artikel terbit, empty/error. | `?path=` kanonis, taxonomy lokal + artikel terbit; sumber dan relasi di artikel. |
| `/ruang/tutorial-problem-solve` | Browser praktik: kebutuhan/gejala, domain R7, risiko, panduan yang lolos review. Saat belum ada materi terbit, state jujur. | `?path=` kanonis; buka panduan atau berhenti bila `STOP`. |
| `/ruang/pendidikan-sekolah` | Jalur School, jenjang, kurikulum, akses, materi berikutnya. | Masuk materi/jalur berizin; taxonomy R1, learning paths, entitlement. |
| `/ruang/[slug]` dan `/ruang/[slug]/[...path]` | Route taxonomy/deep link dan alias lama yang masih didukung; heading serta breadcrumb mengikuti node nyata. | Redirect alias ke kanonis, 404 untuk path tidak sah; jangan buat node contoh seolah terbit. |
| `/artikel/[id]` | Judul, ringkasan, body, sumber, status/edisi/tanggal, safety dan koreksi bila relevan. | Baca sesuai permission, jelajah relasi, lapor koreksi; artikel + packet bila tersedia. |
| `/brosur-sekolah` | Penjelasan School untuk pengunjung, cakupan, batas akses, materi `CONTOH` bila ada. | Buka School/auth; jangan klaim kurikulum/sertifikat penuh dari contoh. |
| `/belajar` | Daftar jalur berizin, progres, langkah berikutnya dan state terkunci. | Lanjut jalur; learning paths/progress server. |
| `/belajar/[pathId]` | Tujuan, urutan materi, progres, prasyarat, status tiap langkah. | Baca/tandai sesuai aturan server, kembali ke daftar. |
| `/ujian` | Ujian yang memenuhi eligibility, aturan dari versi assessment, riwayat/status. | Mulai/lanjut hanya jika server mengizinkan. |
| `/ujian/[attemptId]` | Soal, penyimpanan jawaban, sisa waktu/aturan jika benar-benar dikonfigurasi, kirim dan review. | Resume aman, submit idempoten, tampilkan status penilaian nyata. |
| `/software` | Katalog software yang datanya terbit, versi/sumber/lisensi/risiko, laporan. | Lihat detail/unduh bila resource ada; pengajuan/review sesuai izin. |

**Perluasan isi Explore/Tutorial:** domain kandidat, struktur artikel, safety, claim map,
freshness, dan relasi ada di `../../memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`.
**Perluasan School:** setiap jenjang/jalur perlu tujuan, prasyarat, urutan materi, aturan
assessment versi, metode penilaian, sertifikat bila benar-benar dihasilkan, dan audit izin.

## B. Sosial, komunikasi, dan ruang pribadi

| Route | Tujuan dan isi wajib | Tindakan/hasil dan sumber |
|---|---|---|
| `/sosial` | Feed yang diizinkan, konteks pembuat, waktu, privasi, moderasi, empty state. | Buat/baca/reaksi/komentar/simpan/lapor sesuai permission sosial. |
| `/grup` | Grup yang bisa ditemukan, aturan, anggota, permintaan, status keanggotaan. | Gabung/keluar/banding dengan hasil server. |
| `/pesan` | Percakapan privat, permintaan pesan, preferensi, status pengiriman. | Kirim, hapus/lapor/blokir menurut kontrak; tidak bocor ke pengguna lain. |
| `/profil/[username]` | Profil publik terbatas, konten/relasi yang pemiliknya izinkan. | Hubungi/ikuti bila tersedia; 404/terbatas untuk blokir/privasi. |
| `/profile` | Ringkasan akun, kontak, keamanan, data pribadi, permintaan ekspor/hapus. | Ubah dengan CSRF dan izin; status request Owner yang sebenarnya. |
| `/simpan` | Item tersimpan milik akun dengan tipe/sumber dan state item yang ditarik. | Buka/hapus simpanan; tidak tampilkan data orang lain. |
| `/riwayat` | Aktivitas pribadi yang benar-benar direkam, filter/retensi, konteks. | Buka item terkait dan kelola riwayat sesuai izin. |
| `/kontribusi` | Usulan/kontribusi milik akun, syarat sumber, status review dan alasan. | Buat/koreksi usulan; tidak menyamakan usulan dengan publikasi. |
| `/moderasi/banding` | Perkara yang dapat dibanding, alasan, bukti, tenggat bila ada. | Ajukan banding dan lihat keputusan/status nyata. |
| `/ai-asisten` | Kemampuan retrieval lokal, percakapan milik akun, sumber jawaban, kuota bila berlaku. | Tanya dan buka sumber; akui bila tidak ada dasar lokal. |

## C. Layanan, belanja, dan alat

| Route | Tujuan dan isi wajib | Tindakan/hasil dan sumber |
|---|---|---|
| `/jasa` | Pilihan layanan nyata: layout terbit, brief custom, PCB/jenis aktif; cakupan, harga/quote, hasil, waktu/status. | Pilih alur lalu buat brief/order; katalog dan kebijakan layanan lokal. |
| `/jasa/order` | Pemantauan pesanan privat, status penawaran, pembayaran manual jika sah, revisi dan hasil. | Buka invoice/status, review, tindak lanjut; ownership wajib. |
| `/jasa/tracking` | Pelacakan pesanan publik/privat (undangan dan logo) via parameter token. | Tampilkan status/hasil tanpa membocorkan identitas pemesan. |
| `/jasa/undangan/order` | Form pesanan undangan dengan template terbit/brief, data acara, preview dan validasi. | Buat pesanan yang dapat dipantau; jangan pakai katalog fallback sebagai harga produksi. |
| `/undangan/[slug]` | Hasil undangan yang benar-benar terbit/diizinkan, identitas acara, konten/RSVP jika mesin ada. | Lihat/bagikan sesuai izin; 404 untuk draft/slug tak sah. |
| `/belanja` | Katalog terbit, cari/saring/urut, jumlah hasil nyata, keterangan proses pembelian yang tersedia. | Buka detail, simpan, tanya; produk/mitra terverifikasi. |
| `/belanja/[id]` | Foto, spesifikasi yang diketahui, sumber, status mitra, harga sah, batas informasi. | Simpan atau tanya Owner; tidak menjanjikan checkout aktif. |
| `/belanja/[id]/simulasi` | Route legacy yang ada: jelaskan ketersediaan transaksi secara jujur atau arahkan ke tindakan aktif. | Jangan memproses pembelian/hasil palsu; rencana pensiun route perlu redirect kompatibel. |
| `/alat-bantu` | Selector kelompok→alat aktif→workspace; input, batas, output, retensi dan pemulihan. | Rumus, PDF, Dokumen Karier yang telah punya mesin lokal; tool lain menunggu gate. |

**Aturan konten komersial:** harga, lisensi, partner, lingkup jasa, revision limit, invoice,
pembayaran, dan kebijakan pengembalian tidak boleh disimpulkan dari UI contoh. Owner menetapkan
data serta izin sebelum dipublikasikan. Shop tidak memiliki checkout aktif yang boleh
dijanjikan. Kontrak tool rinci ada di `../../memory/TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`.

## D. Akses, dukungan, dan informasi

| Route | Tujuan dan isi wajib | Tindakan/hasil dan sumber |
|---|---|---|
| `/auth` | Daftar/login, syarat data, error yang tidak membocorkan akun, jalur pemulihan. | Sesi server yang sah; status approval/entitlement bila relevan. |
| `/recovery` | Permintaan pemulihan yang aman dengan instruksi dan status generik. | Jalur review/pemulihan lokal; tidak mengungkap keberadaan akun. |
| `/tentang` | Misi, tujuh ruang, batas lokal dan FAQ yang faktual. | Tautan ke ruang/dukungan nyata; pemilik serta tanggal tinjau. |
| `/ketentuan` | Aturan penggunaan, konten, akun, layanan, pembatasan dan versi. | Persetujuan/kontak yang diperlukan; teks legal diputuskan Owner. |
| `/privasi` | Data yang dikumpulkan, tujuan, retensi, akses, ekspor/hapus, perubahan versi. | Tautan permintaan data nyata di Profil; Owner review. |
| `/review` | Cara memberi penilaian/umpan balik yang benar-benar diproses. | Kirim melalui jalur tersedia atau tampilkan keadaan belum tersedia secara jujur. |
| `/laporkan-masalah` | Jenis laporan, data minimum, privasi, status tindak lanjut. | Kirim feedback/masalah ke antrean lokal yang ada. |

## E. Konsol Owner/Admin

Konsol adalah area kerja berizin. Setiap daftar memerlukan loading/empty/error/403,
paginasi bila besar, filter yang berguna, dan audit tindakan. Tombol publikasi,
perubahan harga/izin, penghapusan, serta keputusan moderasi memerlukan pemeriksaan server dan
konfirmasi proporsional.

| Route | Isi dan keputusan yang perlu tersedia | Hasil/kontrak |
|---|---|---|
| `/admin` | Alias/redirect Admin. | Satu tujuan kanonis, tidak menduplikasi dashboard. |
| `/owner/login` | Autentikasi Owner dengan error aman. | Sesi berizin; recovery/challenge sesuai kontrak aktif. |
| `/owner` | Ringkasan antrean prioritas, kesehatan operasi, tindakan lanjut dari data asli. | Tautan ke route nyata; bukan telemetry dekoratif. |
| `/owner/artikel/baru` | Editor artikel: rumah taxonomy, body, sumber, status, preview. | Draft/revisi; publish hanya setelah policy review terpenuhi. |
| `/owner/feature-packages` | Paket fitur/template, versi, provenance, status import. | Preview dan keputusan promosi sesuai manifest yang sah. |
| `/owner/grup` | Permintaan grup/anggota, laporan, keputusan dan banding. | Keputusan beralasan dan tercatat. |
| `/owner/halaman-situs` | Isi halaman informasi, versi, preview, jadwal review. | Publikasi halaman yang telah disetujui Owner. |
| `/owner/inbox` | Masukan/permintaan terurut, identitas minimum, prioritas dan status. | Triase dan tindak lanjut; tidak menghapus jejak. |
| `/owner/jalur` | Jalur belajar, urutan materi, akses, status terbit. | Revisi/publish dengan kompatibilitas progres. |
| `/owner/jasa` | Katalog, template, brief/order, quote, revisi, status hasil. | Keputusan layanan/harga yang sah dan audit. |
| `/owner/keamanan` | Keamanan akun/perangkat/ancaman dan tindakan yang diizinkan. | Tindakan defensif yang dapat diaudit; tidak bocor secret. |
| `/owner/moderasi` | Kasus, bukti, kebijakan, banding, keputusan. | Alasan, pelaku, waktu, pemulihan/eskalasi. |
| `/owner/operasi` | Health, backup, outbox, aktivitas dan kegagalan. | Perintah yang benar-benar didukung; recovery terukur. |
| `/owner/order` | Pesanan lintas layanan dengan status dan pemilik. | Tindak lanjut/rekonsiliasi yang aman. |
| `/owner/pengguna` | Akun, approval, akses, data request, banding. | Perubahan izin dan data dengan audit/konfirmasi. |
| `/owner/produk` | Produk/mitra Shop, sumber, status, pertanyaan pelanggan. | Terbit/arsip hanya data tervalidasi. |
| `/owner/sosial` | Laporan sosial, pembatasan, retensi, kapasitas moderasi. | Keputusan dan audit, bukan hitungan statis. |
| `/owner/taxonomy` | Node, alias, paket, dampak perubahan, riwayat. | Stage/preview/promote sesuai policy; URL lama tetap hidup. |
| `/owner/ujian` | Antrean attempt, kapasitas, penilaian. | Klaim/grade dengan aturan versi dan audit. |
| `/owner/ujian/bank-soal` | Soal, versi, review, akses dan kualitas. | Publish bank soal setelah review. |

## F. Cakupan API dan data yang harus selalu diperiksa bersama halaman

Route API lokal berada di `Madevi_Off/src/app/api/v1/`. Inventaris ini memetakan **domain**,
bukan mengklaim setiap endpoint siap produksi.

| Domain halaman | Keluarga API/data yang terkait | Pemeriksaan wajib ketika berubah |
|---|---|---|
| Explore/Tutorial/Artikel | `taxonomy`, `articles`, `search`, `owner/taxonomy`, `owner/content-packages`, `public-feedback` | status terbit, read policy, claim/safety gate, alias, cursor, koreksi |
| School | `learning-paths`, `exams`, `owner/learning-paths`, `owner/exams`, `owner/question-banks`, `certificates` | entitlement, versi assessment, resume/submit, progres, data pribadi |
| Line | `social`, `groups`, `moderation`, `owner/moderation`, `owner/social` | ownership, blokir/mute, upload, report, appeal, retensi |
| Services | `jasa`, `admin/jasa`, `owner/jasa`, `payment` | harga snapshot, quote, status order, idempotensi, file/akses privat |
| Shop | `ebelanja`, `owner/shop` | status produk/mitra, harga/sumber, saved/questions, larangan checkout semu |
| Tools/Asisten | `utilities`, `pdf`, `tools`, `ai` | validasi input, quota, output/retensi, retrieval sumber lokal |
| Akun/Admin/Operasi | `auth`, `account`, `profile`, `owner`, `admin`, `operasi`, `security` | permission server, CSRF, IDOR, audit, secret, backup/recovery |

## G. Template isi untuk setiap halaman baru atau revisi

Sebelum Agent 1 mengusulkan halaman, isi semua baris berikut dalam proposal backlog:

```text
ID/route kanonis dan alias:
Pelaku, kebutuhan, dan keputusan yang dibantu:
Data/sumber serta pemiliknya:
Struktur halaman: heading → konteks → pilihan → workspace/isi → hasil → bantuan:
Tindakan utama dan hasil server/data yang membuktikannya:
Permission dan keadaan loading/empty/error/forbidden/success/recovery:
URL, search, breadcrumb, back/forward, dan tautan keluar:
Konten yang perlu ditulis, diverifikasi, diberi tanggal, dan direview Owner:
Risiko safety/privasi/harga/legal serta retensi:
Acceptance criteria, bukti statis/runtime, kompatibilitas, dan rollback:
```

Jangan menjadikan tabel target ini bukti bahwa implementasi sudah lulus. Saat membangun,
bandingkan per route dengan source/API/database aktif dan catat gap yang nyata di backlog.
