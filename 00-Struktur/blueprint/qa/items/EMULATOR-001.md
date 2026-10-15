# Item QA: EMULATOR-001 — Emulator Sirkuit DC lokal

**Area:** Tools / Pendidikan Elektronika  
**Sumber ide:** `../produk/USULAN-EMULATOR.md` (berakar dari blueprint teknis awal, kini
dipensiunkan) §6  
**Arsitektur yang dipilih Owner:** Next.js App Router + React Client Component + Web Worker; API/data memakai jalur lokal Next.js/PostgreSQL yang sudah ada. Laravel, Laravel Octane, Filament, Redis/queue, VPS, Vercel, layanan cloud, dan runtime API eksternal tidak termasuk.

## Tujuan dan keputusan batas

Bangun simulator edukasi rangkaian DC linear yang berjalan di browser: resistor, sumber tegangan DC terbatas, kapasitor pada kondisi tunak DC, sakelar ideal terbuka/tertutup, kabel, dan ground. Solver MNA berada di Web Worker dan menghitung ulang setelah perubahan rangkaian; tidak ada perhitungan server.

Model awal tidak berpura-pura menjadi CircuitJS, simulator transien, simulator nonlinear/analog presisi, pembuat layout PCB, atau panduan keselamatan instalasi nyata. Dioda, op-amp, induktor, datasheet, pembakaran komponen, short-fault diagnosis grafis, tier/pricing/upgrade, serta pemetaan komponen ke Free/Plus/Pro ditahan sampai model dan aksesnya ditetapkan dengan bukti. Jangan tampilkan kontrol atau state palsu untuk hal tersebut. Simulator dibatasi ke sumber 0–24 V DC dan menyatakan hasilnya hanya untuk edukasi.

**Model akses runtime:** simulator publik dapat dirakit/diubah secara lokal tanpa login; menjalankan perhitungan pertama memerlukan akun MEMBER terautentikasi dan reservasi Tools trial/paket melalui API lokal. Akun trial dikenai satu konsumsi saat simulasi valid pertama dalam sesi tab, bukan per perubahan rangkaian; skema tetap tersimpan secara privat per akun. Tanpa login, simulasi dan penyimpanan privat dinonaktifkan UI dan ditolak oleh endpoint server.


## Dependensi dan batas perubahan

- Dependency kontrol: `ROUTE-FIX-001` (PASS); tidak ada dependency Laravel/online.
- Lock source: route `/alat-bantu/emulator`, komponen Tools selector, model/solver/worker emulator, API workspace, `UtilitiesService`, migration source `0040`, dan uji unit solver.
- Dokumen terkait: blueprint emulator, `blueprint/fitur/WORKSPACE-DAN-TOOLS.md`, inventaris halaman, QA/audit, TEST-REPORT, dan memori checkpoint/log.
- Dilarang mengubah auth umum, package/price entitlement, data aktif, migration lama, service jasa, serta API/worker eksternal.

## Acceptance criteria wajib

- [ ] AC-01 — Route kanonis `/alat-bantu/emulator` dirender Next.js `PublicShell`, mengikuti kebijakan noindex root, dan memberi breadcrumb kembali ke Tools. Tidak menambah backend/framework/hosting online.
- [ ] AC-02 — Pengguna dapat membuat, memilih, memindahkan, mengubah nilai, menghapus komponen, dan menghubungkan terminal lewat kabel pada workspace Canvas responsif; ada state kosong dan contoh berlabel. Kontrol dan status dapat diakses lewat UI berlabel, bukan hanya gambar.
- [ ] AC-03 — Web Worker menjalankan MNA deterministik untuk model DC yang dinyatakan di atas. Dukungan kondisi tunak dinyatakan jujur; sumber dibatasi 0–24 V, resistor finite dan positif, dan sirkuit mengambang/tidak konsisten menghasilkan error yang bisa dipahami, bukan angka palsu.
- [ ] AC-04 — Hasil menampilkan tegangan node serta tegangan/arus cabang hasil solver. Contoh 9 V dengan resistor 1 kΩ harus menunjukkan 9 V dan 9 mA (arus positif mengikuti orientasi terminal). Hasil menyebut batas: konsep DC edukasi, bukan uji hardware atau arahan keselamatan fisik.
- [ ] AC-05 — Skema dapat disimpan, didaftar, dibuka kembali, dan dihapus hanya sebagai workspace privat akun. API lokal memeriksa MEMBER, CSRF untuk POST/DELETE, ukuran/struktur payload, serta kepemilikan saat GET/DELETE per ID. Tidak ada secret/data privat pada URL/log.
- [ ] AC-06 — Migration `0040` memperluas kind `utilities_workspaces` secara kompatibel; rollback tidak menghapus data diam-diam. Migration tidak dieksekusi dan database tidak diubah.
- [ ] AC-07 — Tidak mengklaim dukungan tier/komponen, transient simulation, overheating/burning, atau fitur Laravel yang belum tersedia; tidak ada tautan alat aktif menuju kemampuan yang belum bekerja.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | Skenario solver | Uji unit untuk contoh, resistor seri/paralel, sakelar/kapasitor DC tunak, dan input/topologi tak valid | 100% hasil analitik cocok dalam toleransi absolut/relatif yang dicatat; error topology jujur | belum |
| M-02 | Batas input | Inspeksi + uji validasi skema/payload | komponen ≤64, kabel ≤256, JSON ≤256 KiB, sumber 0–24 V, resistor finite dan positif dalam batas | belum |
| M-03 | Keamanan penyimpanan | Inspeksi route/service/migration | auth + CSRF mutasi + ownership GET/DELETE + rollback migration non-destruktif | belum |
| M-04 | Parser source terubah | Parser TS/TSX/SQL statis tanpa menyalakan aplikasi | 0 diagnostic/error | belum |

## Verifikasi yang diizinkan

- Statis: inspeksi source/batas lock, parser TS/TSX, pemeriksaan SQL source, dan uji perhitungan solver dalam prototipe terisolasi di scratch bila perlu. Catat terpisah dari test runner aplikasi.
- Tidak boleh: dev server, browser/runtime aplikasi, API aplikasi, PostgreSQL/database, migrasi, `npm test`, lint, build, full typecheck, atau task manager/background.
- Bukti test runner aplikasi, visual breakpoint nyata, dan alur simpan dengan DB harus `BELUM-DIVERIFIKASI` sampai Owner mengubah guardrail. Bukti prototipe solver bukan klaim UI/runtime end-to-end.

## Risiko dan rollback

- **Risiko teknis:** matriks singular karena node tak di-ground atau sumber tegangan ideal bertentangan, serta schema JSON lama/invalid. Solver harus menolak state itu dengan pesan pemulihan dan tidak menyimpan hasil yang menyesatkan.
- **Risiko keselamatan:** simulator dapat disalahartikan untuk hardware nyata. Batasi ke edukasi DC ideal, jangan berikan instruksi mains/aki/charging/PCB, dan tampilkan disclaimer terlihat.
- **Kompatibilitas:** ID `0040` menyusul migration source `0039` yang masih pending. DB runtime belum memiliki kind `EMULATOR` sampai urutan migration disetujui/dijalankan Owner; POST harus gagal jujur sebelum itu.
- **Rollback:** cabut route/entry selector dan worker/component; migration down boleh memulihkan CHECK hanya jika tidak ada row EMULATOR. Down migration harus gagal aman bila ada data tersebut, bukan menghapusnya.
