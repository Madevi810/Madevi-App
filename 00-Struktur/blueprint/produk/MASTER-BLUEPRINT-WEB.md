# Blueprint Produk Web Madevi — Peta Induk Perencanaan

**Versi:** 1.0 · 2026-09-25  
**Sifat:** rancangan produk menyeluruh, bukan status implementasi atau izin publikasi.  
**Status kerja kanonis:** tetap `../INDEX.md`; rencana ini tidak menambah item aktif/lock.

## 1. Tujuan dan janji produk

Madevi membantu orang **memahami sesuatu, menyelesaikan pekerjaan, belajar, berkomunikasi,
meminta layanan, dan memilih alat/produk** dalam satu web yang dapat ditelusuri. Hasil setiap
kunjungan harus jelas: pembaca memperoleh pengetahuan bersumber, pelaku mendapat panduan dengan
batas aman, pelajar melihat kemajuan nyata, pengguna alat memperoleh berkas/hasil yang dapat
diperiksa, dan pengelola dapat meninjau serta memperbaiki data. Madevi saat ini adalah aplikasi
**lokal di Termux/Android** dengan PostgreSQL dan API lokal. Akses publik online merupakan
tahap terpisah yang belum aktif.

### Siapa yang dilayani

| Pelaku | Kebutuhan | Hasil yang harus terlihat |
|---|---|---|
| Pengunjung | mencari pengetahuan, panduan umum, alat/katalog publik | jawaban, sumber, batas, langkah lanjut, atau keadaan kosong yang jujur |
| Pengguna terdaftar | progres belajar, simpanan, pekerjaan privat, komunikasi | riwayat miliknya, kontrol privasi, hasil yang dapat dibuka lagi |
| Pemesan layanan | memilih layanan yang sungguh tersedia, memberi brief, memantau pesanan | rincian cakupan/harga atau status penawaran, nomor/status pesanan, jalur tanya/revisi |
| Kontributor/editor | mengusulkan dan memperbaiki konten | draft, bukti, status review, alasan keputusan |
| Owner/Admin | menjaga konten, taxonomy, pengguna, keamanan, layanan, dan operasi | antrean terprioritas, tindakan berizin, audit, serta pemulihan |

### Prinsip pengalaman

1. Masuk lewat kebutuhan pengguna: **pahami → lakukan → pelajari → bicarakan → pesan layanan → pilih produk → olah dengan alat**. Ketujuh ruang bukan tujuh dashboard seragam.
2. Setiap tampilan membedakan fakta terbit, data privat, contoh berlabel, dan rencana. Route yang ada belum membuktikan data/fitur siap; hanya alur yang lolos verifikasi yang boleh dipromosikan.
3. Satu tindakan utama per konteks. Alur lengkap: input → validasi → proses/data lokal → hasil → pemulihan. Empty, error, forbidden, pending, dan success dirancang bersama alur normal.
4. URL menyimpan konteks yang dapat dibagikan. Search, breadcrumb, sidebar, dan tautan balik membantu pengguna melanjutkan tanpa kehilangan tempat.
5. Artikel menjelaskan klaim dan sumber; tutorial berisiko melewati policy `GENERAL`/`CONTROLLED`/`STOP`. Kesehatan, hukum, uang, dan keselamatan fisik tidak boleh disajikan sebagai kepastian tanpa dasar.
6. Penggunaan di Android, keyboard, pembaca layar, tiga tema, dan reduced motion adalah bagian dari definisi selesai. Animasi berada di belakang informasi.

## 2. Arsitektur informasi dan isi setiap ruang

Kontrak route aktif dan urutan tujuh ruang berada di `../../Madevi_Off/src/contracts/navigation.ts`.
Rincian **seluruh halaman** ada di [INVENTARIS-HALAMAN.md](INVENTARIS-HALAMAN.md),
[spesifikasi 35 halaman publik/akun](SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md), dan
[spesifikasi 20 halaman Owner/Admin](SPESIFIKASI-OWNER-ADMIN.md). Rencana produksi isi dan
data setiap ruang ada di [RENCANA-ISI-PER-RUANG.md](RENCANA-ISI-PER-RUANG.md). Di bawah ini
adalah kontrak produk yang harus dipakai saat memperluas tiap ruang.

| Ruang | Pertanyaan pengguna | Isi inti yang harus tersedia | Hasil/tindakan utama | Sumber kanonis |
|---|---|---|---|---|
| Beranda | Ke mana saya mulai? | orientasi Madevi, tujuh kebutuhan ruang, jalur cepat ke route nyata | masuk ke ruang yang sesuai | kontrak navigasi; konten terbit |
| Explore & Learn | Apa ini dan bagaimana hubungannya? | Atlas `R→D→K→M→T`, artikel konsep, relasi, sumber, kepastian, freshness | jelajah, baca, cari konsep terkait | taxonomy + artikel/packet terbit |
| Tutorial & Problem Solve | Apa yang aman saya lakukan? | gejala/tujuan, prasyarat, alat, langkah, uji hasil, berhenti/eskalasi | ikuti panduan atau berhenti dengan aman | taxonomy R7 + artikel dengan safety gate |
| Madevi School | Apa yang saya pelajari berikutnya? | jalur, kurikulum, materi, progres, evaluasi dan aturan versi | lanjut belajar, ujian bila berhak | learning path, assessment, entitlement |
| Madevi Line | Dengan siapa saya berbicara dan berbagi? | feed, grup, pesan, profil publik, moderasi, pengaturan privasi | posting, ikut grup, kirim pesan, lapor/blokir | data sosial berizin |
| Madevi Services | Layanan apa yang bisa diminta? | katalog template terbit, brief custom, PCB/layanan tersedia, syarat, status | ajukan brief/pesanan, cek status | katalog/quote/order lokal yang diverifikasi |
| Madevi Shop | Produk apa yang sesuai? | katalog terbit, sumber/mitra, kategori, detail, harga bila sah, pertanyaan | simpan/tanya; keputusan di luar checkout semu | produk/mitra terverifikasi |
| Tools & Equipment | Tolong proses pekerjaan saya | pilihan alat aktif, input, batas, output, retensi, recovery | hitung/olah/unduh/simpan hasil | registry + engine lokal |

### Konten pendukung lintas ruang

- **Search:** indeks izin pengguna, ruang/jenis/filter, hasil dengan alasan kecocokan, zero-result yang memberi jalan kembali. Jangan mencampur draft atau data privat orang lain.
- **Asisten:** retrieval sumber lokal yang dapat dirujuk, batas kemampuan dan availability yang jujur; jawaban tanpa sumber yang relevan harus mengaku belum menemukan dasar.
- **Profil dan akun:** data identitas, keamanan, simpanan, riwayat, kontribusi, permintaan ekspor/hapus dengan status nyata. Profil publik hanya menampilkan bidang yang diizinkan.
- **Halaman informasi:** Tentang/FAQ, Ketentuan, Privasi, Review, dan Laporkan Masalah harus memuat isi versi/tanggal, pemilik perawatan, serta kanal tindak lanjut yang benar-benar bekerja.
- **Admin/Owner:** semua perubahan publik dan tindakan sensitif masuk lewat izin server, antrean review, catatan keputusan, dan audit. Dashboard menyajikan pekerjaan nyata, bukan metrik dekoratif.

## 3. Pola isi, bukti, dan penerbitan

### Model konten

| Jenis | Struktur isi minimum | Gate sebelum tampil publik |
|---|---|---|
| Artikel Atlas | pertanyaan pembaca, ringkasan, penjelasan bertahap, bukti/kepastian, hubungan, sumber, tanggal tinjau | rumah taxonomy, canonical key, dossier, claim map, hak pakai, review sesuai sensitivitas |
| Panduan Praktik | tujuan/gejala, prasyarat, alat, level risiko, langkah yang dapat diuji, hasil, stop condition, bantuan | safety profile dan review; `STOP` tidak berisi prosedur |
| Materi School | tujuan belajar, prasyarat, bagian materi, latihan/evaluasi, hubungan ke jalur, versi | akses/entitlement, kurikulum dan aturan assessment dari server |
| Template/layanan | preview nyata, cakupan, input pemesan, keluaran, versi, lisensi, status harga/revisi | item `PUBLISHED`, harga/quote sah, jalur order/review aktif |
| Produk Shop | identitas, gambar/sumber, spesifikasi yang diketahui, mitra, harga/status, batas pembelian | mitra/produk terverifikasi, aksi nyata; tanpa checkout fiktif |
| Tool Brief | pekerjaan, input, validasi, mesin, output, retensi, risiko, state/recovery | implementasi dan verifikasi lokal; status `PUBLISHED` |
| Halaman kebijakan | pemilik, versi/tanggal, isi yang sesuai operasi, perubahan penting, kontak/aksi | persetujuan Owner untuk teks legal/publik |

Artikel memakai `articles.status` sebagai lifecycle publikasi; Content Packet 0039 adalah
metadata tambahan yang **belum diterapkan**. Migration, policy server, dan UI review harus
selaras sebelum batch konten baru. Rincian editorial: `../artikel/ATLAS-DAN-JALUR-PRAKTIK.md`,
`../../memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`, dan
`../../memory/CONTENT-PLAN.md`. Tools: `../../memory/TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`.

### Siklus tiap isi

`usulan → cek duplikasi/rumah taxonomy → dossier sumber/hak pakai → draft → pemeriksaan
klaim/risiko → review Owner yang diperlukan → terbit → pantau freshness/laporan → koreksi,
arsip, atau supersede`. Simpan alasan dan pelaku keputusan. Draft dan contoh tidak masuk hasil
terbit, katalog aktif, atau angka publik. Koreksi penting harus memiliki jejak edisi dan URL
lama tetap dapat menemukan versi kanonis yang benar.

## 4. Alur ujung ke ujung yang harus dituntaskan

| Alur | Awal → akhir yang nyata | Titik gagal dan pemulihan |
|---|---|---|
| Temukan pengetahuan | Beranda/search → taxonomy/filter → artikel terbit → sumber/relasi → kembali ke jalur | nol hasil, data belum terbit, sumber kedaluwarsa, path alias |
| Selesaikan masalah | Tutorial → tentukan situasi → cek prasyarat/risiko → langkah/STOP → cek hasil → lapor koreksi | risiko meningkat, langkah gagal, panduan ditarik; berhenti dan cari bantuan |
| Belajar | School → jalur berizin → materi → progres → assessment versi → review hasil | akses ditolak, ujian terputus, kapasitas, hasil tertunda |
| Berkomunikasi | Line → temukan orang/grup → kirim/terima → atur privasi → lapor/blokir | moderasi, unggahan ditolak, pesan gagal/duplikat, banding |
| Pesan layanan | Services → pilih item terbit/brief → validasi → status penawaran/order → review/revisi → hasil | item arsip, harga belum sah, brief gagal, pembayaran belum dikonfirmasi |
| Pilih produk | Shop → cari/saring → detail sumber/mitra → simpan atau tanya Owner | katalog kosong, produk ditarik, harga berubah, pertanyaan gagal |
| Pakai alat | Tools → pilih alat `PUBLISHED` → input → validasi → proses lokal → cek/unduh/simpan → bersihkan | format salah, quota, timeout, proses gagal, data temporer |
| Kelola akun | auth → profil → keamanan/ekspor/hapus → status permintaan → keputusan Owner | sesi habis, 403, token CSRF, proses data tertunda |
| Kelola penerbitan | Owner → antrean → cek bukti/izin → preview → publish/retire → audit → koreksi | konflik versi, sumber kurang, tindakan ditolak, rollback |

## 5. Kontrak sistem yang menjaga arah pembangunan

### Data dan identitas

- PostgreSQL lokal adalah penyimpanan kanonis saat ini. Ubah schema dengan migration kompatibel, constraint/index, backup/rollback yang dijelaskan, dan ownership entitas yang jelas.
- Akun, session, role, entitlement, moderasi, serta ID pemilik diperiksa di server pada setiap read/mutation. UI hanya menjelaskan keputusan server. Secret dan data privat tidak masuk dokumen, log, atau contoh.
- Hanya satu sumber kebenaran untuk route (`navigation.ts`), status penerbitan tiap domain, dan konfigurasi assessment. Alias/deep link lama dipertahankan atau dimigrasikan dengan redirect.
- Berkas sensitif dan hasil tool harus memiliki validasi tipe/ukuran, retensi, penghapusan, serta kepemilikan. Cek IDOR, CSRF, rate limit, upload, dan audit sesuai dampak.

### API dan state tampilan

- API saat ini lokal di Next Route Handlers. Setiap kontrak baru menentukan input/output, izin, idempotensi bila mutasi berulang, pagination cursor untuk daftar besar, error code, dan kompatibilitas klien lama.
- Setiap halaman mencakup `loading`, `empty`, `error`, `forbidden/locked`, `success`, `retry`, serta `not-found` bila relevan. Aksi berbahaya memerlukan konfirmasi yang sesuai dan hasil yang dapat ditelusuri.
- Search dan listing tidak mengungkap data yang tidak dapat dibaca pengguna. Tidak ada data fixture yang mengisi kekosongan publik seolah-olah asli.

### UI, aksesibilitas, dan operasi

- Light/Dark adalah tema kerja; Madevi On adalah identitas ekspresif. Semua memakai token, kontras, target sentuh, fokus, reflow ponsel, dan `prefers-reduced-motion`. Artikel dan formulir tetap stabil untuk dibaca/dikerjakan.
- Kinerja diukur pada Android nyata: waktu halaman/interaksi, ukuran hasil query, memori proses lokal, dan biaya animasi. Batas angka ditetapkan dari baseline perangkat, bukan dikarang di blueprint.
- Backup dan restore perlu bukti drill non-production sebelum perubahan data besar/rilis. Larangan operasi sesi sekarang tetap berlaku: tidak menjalankan server, npm, lint, build, test, database, atau request API tanpa izin Owner.

## 6. Batas lokal dan arah online

Blueprint ini menyelesaikan rancangan **produk**, bukan memilih backend online. Arah online
yang disetujui Owner untuk masa depan tercatat sebagai proposal di `../../../Madevi-Online-Plan/`
(Next + Spring Boot untuk core API online). **Jangan implementasikan berdasarkan inferensi
Agent.** Saat Owner memulai tahap online, Agent 5 perlu keputusan tertulis tentang pembagian
domain, ownership data, autentikasi, operasi, biaya, kompatibilitas, dan migrasi sebelum item
aktif dibuat. Sampai itu terjadi, seluruh rencana di sini memakai runtime lokal yang sudah
ada — aplikasi Next.js monolith lokal + PostgreSQL.

## 7. Cara memakai blueprint untuk membangun

1. Buka [INVENTARIS-HALAMAN.md](INVENTARIS-HALAMAN.md) untuk route, kemudian spesifikasi
   [publik/akun](SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md) atau
   [Owner/Admin](SPESIFIKASI-OWNER-ADMIN.md) untuk isi/aksi/state terperinci. Pakai
   [rencana isi](RENCANA-ISI-PER-RUANG.md) untuk materi/data yang harus diproduksi.
2. Buka [rencana per bidang](ROADMAP-DAN-DEPENDENSI.md) untuk hasil, batas, dan bukti selesai. Status serta lock aktif tetap milik `../INDEX.md`.
3. Agent 1 mencatat kandidat belum aktif sebagai satu hasil per bidang di backlog, dengan bukti, kriteria terima, risiko, dan batas kerja. Agent 5 saja yang mempromosikan ke item aktif/lock.
4. Agent 2–4 memakai `../qa/ITEM-TEMPLATE.md` dan `../WORKFLOW.md`; setiap hasil dicatat sebagai fakta, bukan klaim selesai tanpa bukti.

### Definisi selesai tingkat produk

Sebuah ruang baru layak disebut matang jika pengguna dapat menemukan jalurnya, menyelesaikan
pekerjaan utamanya pada data yang sah, memahami keadaan gagal, memulihkan atau melanjutkan,
dan Owner dapat mengelola konten/risikonya. Seluruh route terkait, permission, data, copy,
state, aksesibilitas, serta recovery harus konsisten. Banyaknya halaman atau card bukan ukuran
kematangan.
