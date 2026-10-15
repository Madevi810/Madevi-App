# GUARDRAIL — Berlaku untuk Semua Peran dan Semua Item

Dokumen ini diwarisi oleh seluruh folder blueprint. Hanya Owner atau Agent 5 yang dapat
mengubahnya; setiap perubahan harus dicatat di `../memory/DECISIONS.md` sebagai revisi aturan.

## Produk, runtime, dan kejujuran

1. Source kanonis aplikasi hanya `../../Madevi_Off`; `Madevi-Control` tidak boleh menjadi
   dependency runtime.
2. Madevi berjalan lokal di Termux/Android. Tidak ada API online, SaaS, worker, atau provider
   eksternal sebagai syarat runtime tanpa keputusan Owner.
3. Jangan membuat fitur, data, status, angka, tombol, menu, checkout, artikel, atau integrasi
   palsu. Alur aktif harus menyelesaikan input → validasi → proses/data → hasil → recovery.
4. Fixture hanya boleh lokal dan jelas `DRAFT`/`CONTOH`; tidak boleh menyamar sebagai data
   pengguna, artikel terbit, pembayaran, atau layanan aktif.

## Data, security, dan tindakan sulit dipulihkan

1. Pertahankan kontrak route, auth/permission, CSRF, rate limit, validasi, audit log, token
   tema, migration, dan data pengguna yang telah berlaku kecuali ada bukti serta strategi
   kompatibilitas/migration/forward-fix.
2. Jangan simpan secret, token, OTP, credential, atau data privat di source maupun dokumen
   control.
3. Database, publikasi luar, harga/pembelian, legal, credential, penghapusan data, dan tindakan
   destruktif memerlukan target tepat serta wewenang Owner.
4. Panduan listrik, gas/api, kendaraan, bahan kimia, kesehatan, mesin, atau risiko cedera harus
   memakai klasifikasi `GENERAL`/`CONTROLLED`/`STOP`, sumber lokal, review, serta batas berhenti
   yang nyata.

## Operasi, kualitas, dan desain

1. Hormati instruksi Owner terbaru. Jalur perencanaan Agent 1 boleh berjalan di latar belakang
   selama platform/sesi menyediakan runner aktif. Pemasangan alat kerja yang diperlukan
   kini diizinkan sesuai butir 8. Server, lint, build, test, browser, API, dan database aplikasi
   tetap memerlukan izin eksplisit Owner, kecuali ada keputusan terdokumentasi untuk item yang
   sedang dikerjakan. Tanpa izin itu, hanya pemeriksaan statis dan implementasi source yang
   aman diperbolehkan.
2. Jangan mengklaim verifikasi yang tidak dijalankan. Catat `BELUM-DIVERIFIKASI` dan alasannya.
3. Light dan Dark adalah tema kerja netral; Madevi On boleh lebih ekspresif. Motion tidak boleh
   menggeser layout, menyembunyikan input, atau mengganggu membaca artikel, dan selalu tunduk
   pada `prefers-reduced-motion`.
4. Hindari AI slop: tidak ada card/gradient/animasi generik yang menggantikan fungsi, hierarki,
   bukti, atau keterbacaan.
5. Pencarian default harus terarah pada batas pekerjaan dan mengabaikan dependency,
   cache, output build, coverage, serta hasil generasi. Pemindaian area itu boleh dilakukan
   bila ada kebutuhan konkret; batasi lingkupnya dan catat alasan. Jangan habiskan kuota
   membaca seluruh proyek tanpa kebutuhan.
6. Setelah tugas selesai, jangan menjalankan atau meninggalkan task manager/monitor proses,
   daemon, dan job background yang tidak perlu. Proses sementara yang agent mulai ditutup
   bila aman. Agent 1 Perencanaan dikecualikan hanya selama runner aktif dan tetap mengikuti
   lock, checkpoint, serta batas operasi lain.
7. Semua pekerjaan aplikasi harus berasal dari instruksi Owner/Admin atau item INDEX yang
   siap. Sebelum perubahan material, nyatakan masalah berbukti, hasil pengguna, batas
   perubahan, risiko, dan cara verifikasi. Hindari pekerjaan acak, refactor tidak terkait,
   asumsi yang diperlakukan sebagai fakta, serta klaim selesai tanpa bukti. Ide baru hanya
   usul Agent 1 sampai Agent 5 mempromosikannya.
8. Agent boleh memasang alat CLI/pendukung secara otomatis bila diperlukan untuk pekerjaan
   sah dan alat yang tersedia tidak memadai. Periksa sumber, versi, lisensi, kompatibilitas,
   biaya, izin, dan dampaknya. Utamakan lokasi terisolasi; jangan memasang paket acak,
   menjalankan skrip instalasi yang tidak diperiksa, atau mengubah dependency runtime/
   lockfile aplikasi tanpa item dan alasan produk. Catat alat/versi/asal/tujuan serta
   cara melepasnya. Pemasangan berbayar, akses sistem/credential baru, dan perubahan
   data atau runtime yang sulit dipulihkan tetap memerlukan wewenang Owner.
9. Prototipe kecil untuk pekerjaan sulit boleh dibuat di direktori sementara terpisah,
   dengan data contoh tanpa rahasia dan tujuan jelas. Catat temuan, bersihkan artefak
   sementara, dan bawa hanya hasil relevan ke source melalui item/lock/QA yang sah.
   Prototipe bukan bukti bahwa fitur aplikasi sudah bekerja atau terbit.
10. Lingkungan CLI yang rusak/tidak lengkap boleh diperbaiki secara terarah tanpa izin
    ulang untuk langkah rutin: diagnosis dulu, ubah bagian yang perlu, pertahankan
    source/lockfile aplikasi/data/proses Owner, serta catat perubahan dan pemulihan.
    Jangan reset atau hapus massal, menjalankan test/build/server aplikasi, atau
    mengubah runtime/data tanpa item dan wewenang Owner.

## Koordinasi lima peran

1. Koordinasi terjadi lewat `INDEX.md`, file QA, dan memori kanonis; tidak lewat asumsi, chat
   yang hilang, atau status pribadi.
2. Satu item hanya memiliki satu lock. Tidak ada dua Agent menyentuh irisan file sama tanpa
   pembagian tertulis.
3. Agent 1 tidak mengubah rencana aktif; Agent 2 tidak mengaudit hasilnya sendiri; Agent 3 tidak
   memperbaiki source; Agent 4 tidak mengubah guardrail; Agent 5 tidak mengimplementasikan fitur
   yang sedang diawasi kecuali Owner menugaskannya ulang.
4. Sistem hanya aktif selama sesi/perangkat tersedia. Karena kuota, koneksi, dan device tidak
   dapat dipantau sempurna dari dokumen, checkpoint wajib ditulis di setiap pergantian fase dan
   sebelum pekerjaan berisiko besar.
5. Riset perencanaan boleh memakai sumber luas termasuk internet, buku, komunitas, media
   sosial, dan tokoh. Catat asal, tanggal, status verifikasi, dan hak pakai yang diketahui;
   nilai klaim terhadap bukti primer serta konteks Madevi. Riset tidak memberi izin untuk
   menyalin karya, membuka data privat, atau menjadikan layanan luar dependency runtime.
