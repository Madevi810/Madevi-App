# Rencana Kerja Madevi per Bidang

**Sifat:** arah pekerjaan, bukan status atau izin eksekusi. Status dan lock tetap berada di
[`../INDEX.md`](../INDEX.md). Satu bidang direncanakan sebagai satu hasil utuh; rincian teknis
dan temuan audit dikerjakan di dalam cakupan itu, tanpa membuat deret D1/D2/D3 atau tahap
mikro untuk hasil yang sama.

| Bidang | Hasil yang dituju | Batas dan bukti selesai |
|---|---|---|
| Desain | Tiga tema, navigasi, halaman, state, dan motion membentuk pengalaman yang konsisten pada tujuh ruang. | Satu pekerjaan desain mencakup tampilan terkait sekaligus; cek aksesibilitas, mobile, reduced motion, serta batas artikel/Admin. `UX-REDESIGN-002` tetap mengikuti lock dan QA aktifnya. |
| Konten dan pengetahuan | Atlas, Tutorial, School, serta informasi publik punya isi bersumber, status penerbitan, koreksi, dan pemilik review yang jelas. | Policy Content Packet, taxonomy, safety, dan alur Owner harus cocok; draft tidak tampil sebagai terbit. Isi atau publikasi baru memerlukan sumber dan keputusan yang sah. |
| Fungsi pengguna | Search, Line, Services, Shop, Tools, Asisten, serta akun menyelesaikan pekerjaan nyata dari input sampai hasil dan pemulihan. | Route, data, izin, state kosong/gagal, dan retensi diperiksa bersama; tidak ada kontrol atau transaksi simulasi yang tampak aktif. |
| Operasi dan keamanan | Owner dapat mengelola, meninjau, mengaudit, dan memulihkan perubahan dengan hak akses yang benar. | Auth, CSRF, IDOR, privasi, backup/restore, dan kompatibilitas dinilai dalam satu cakupan operasi; tindakan data/destruktif mengikuti wewenang Owner. |
| Kesiapan online | Keputusan arsitektur dan migrasi siap ketika Owner membuka tahap online. | Tetap proposal terpisah di `Madevi-Online-Plan`; tidak mengubah runtime lokal tanpa keputusan Owner. |

## Cara memakai rencana

- Ambil satu bidang dan tetapkan satu hasil yang dapat diperiksa beserta batas file/kontrak,
  dependency nyata, risiko, dan kriteria terima. Kerjakan bagian yang saling terkait sebagai
  satu paket; pecah menjadi item baru hanya jika ada batas izin, lock yang bertabrakan,
  migrasi berisiko, atau hasil yang memang independen.
- Bidang lain dapat dikerjakan bersamaan bila batas file dan data tidak bertabrakan. Urutan
  tabel bukan urutan wajib. Item aktif, dependency, dan lock di `../INDEX.md` tetap berlaku.
- Verifikasi hanya diklaim untuk metode yang benar-benar dijalankan. Kondisi yang belum dapat
  diperiksa dicatat `BELUM-DIVERIFIKASI`, bukan dijadikan tahap rencana baru.

Rincian hasil per route ada di [inventaris](INVENTARIS-HALAMAN.md),
[spesifikasi publik/akun](SPESIFIKASI-HALAMAN-PUBLIK-DAN-AKUN.md),
[spesifikasi Owner/Admin](SPESIFIKASI-OWNER-ADMIN.md), dan
[rencana isi](RENCANA-ISI-PER-RUANG.md). Dokumen tersebut adalah referensi cakupan,
bukan daftar pekerjaan berurutan.
