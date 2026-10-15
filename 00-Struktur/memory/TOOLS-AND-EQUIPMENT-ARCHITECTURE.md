# Tools & Equipment — Arsitektur Pertumbuhan Lokal

Status: `ACTIVE` — arsitektur kontrol. Dokumen ini bukan daftar fitur yang sudah tersedia di antarmuka.

Tanggal pembaruan: 2026-09-24

## 1. Mandat produk

Ruang **Tools & Equipment** adalah bengkel kerja Madevi: pengguna memasukkan data atau berkas, menjalankan proses lokal yang jelas, lalu memperoleh hasil yang dapat diperiksa, disalin, diunduh, atau disimpan secara privat. Ia tidak boleh menjadi katalog kartu yang mengaku memiliki kemampuan yang belum ada.

| Ruang | Pertanyaan pengguna | Hasil utama |
| --- | --- | --- |
| Explore | Apa yang perlu saya pahami? | peta pengetahuan, konteks, relasi |
| Tutorial & Problem Solve | Bagaimana saya melakukan atau memperbaikinya? | langkah, bahan, risiko, verifikasi |
| Tools & Equipment | Tolong proses, hitung, susun, atau periksa ini. | keluaran kerja yang nyata |

Sebuah alat hanya layak tampil apabila masukan atau formulirnya nyata, proses lokal benar-benar dijalankan, keluarannya dapat diverifikasi, risiko dan retensi data dijelaskan, serta keadaan kosong, proses, berhasil, gagal, dan pemulihan tersedia.

Tidak ada API online, AI processing palsu, unggahan tiruan, tombol mati, atau status simulasi. Jika mesin lokal belum ada, kandidat tetap berada di blueprint dan tidak tampil sebagai fitur aktif.

## 2. Model skala: Group → Family → Tool → Operation

Katalog dapat tumbuh sampai ribuan atau jutaan alat tanpa berubah menjadi daftar datar.

```text
Group (pekerjaan besar)
  └─ Family (opsional; rumpun dengan pola data atau risiko sama)
       └─ Tool (ruang kerja mandiri)
            └─ Operation (aksi dalam satu siklus kerja alat)
```

- **Group** menjawab jenis pekerjaan besar, misalnya Dokumen atau Generator.
- **Family** muncul hanya saat sebuah kelompok sudah terlalu besar, misalnya Dokumen → PDF, Dokumen Teks, Spreadsheet, Arsip.
- **Tool** mempunyai kontrak input, proses, output, dan batas sendiri, misalnya Pecah PDF atau Konverter Satuan.
- **Operation** bukan alat baru bila input, izin, dan output masih satu siklus, misalnya putar, hapus halaman, dan urutkan halaman dalam editor PDF.

Buat Tool baru bila pengguna membawa masukan baru, memahami risiko baru, atau menerima jenis keluaran baru. Jangan menggandakan alat menjadi puluhan kartu hanya karena tombolnya berbeda.

## 3. Fondasi navigasi dan layout kanonis

Pola yang sudah dipilih untuk Tools dipertahankan sebagai fondasi:

```text
breadcrumb kecil
judul ruang + deskripsi pendek
────────────────────────────────────────
[ Kelompok alat: … ▾ ] [ Pilihan alat: … ▾ ]
menu kelompok / menu alat (hanya satu yang terbuka)
────────────────────────────────────────
workspace alat aktif
```

### Aturan interaksi selector

- Kedua pemilih berbentuk tombol kapsul di kiri atas workspace, bukan kartu.
- Klik **Kelompok alat** membuka daftar kelompok ke bawah.
- Memilih kelompok langsung membuka **Pilihan alat** di sebelah kanan agar pengguna melanjutkan alur tanpa tumpang-tindih.
- Pilihan alat hanya menampilkan alat milik kelompok yang dipilih.
- Satu menu saja boleh terbuka pada satu waktu. Klik di luar area atau `Escape` menutup menu; fokus dan label ARIA harus tetap benar.
- Perubahan kelompok tidak menjalankan atau menghapus pekerjaan aktif. Alat berganti hanya setelah pengguna memilih alat.
- Pada layar sempit, tombol dapat turun ke baris berikutnya, tetapi urutannya tetap kelompok lalu alat dan area kerja tidak dipersempit oleh sidebar palsu.

Saat katalog bertambah, daftar tidak berubah menjadi ratusan tombol di halaman awal. Tambahkan pencarian lokal, filter tag, favorit privat, riwayat pekerjaan privat, dan virtualisasi daftar hanya ketika ambang ukuran benar-benar tercapai. Tampilan awal menonjolkan alat terakhir, alat yang dipin, dan tugas relevan; bukan semua alat sekaligus.

`?tab=` saat ini tetap dijaga sebagai kompatibilitas navigasi alat yang sudah ada. Identitas jangka panjang adalah `toolId` stabil; format URL baru seperti `?tool=<id>` hanya diterapkan setelah alias lama, deep-link, dan pemulihan state telah dirancang serta diperiksa.

## 4. Peta kelompok alat

Kode group stabil dan tidak mengandung urutan visual. Semua isi di bawah adalah rencana kandidat, kecuali inventaris aktif pada bagian 5.

| ID | Kelompok | Tujuan kerja | Rumpun saat skala meningkat |
| --- | --- | --- | --- |
| G01 | Hitung, Satuan & Rumus | menghitung, mengonversi, memeriksa nilai | satuan; geometri; keuangan personal; sains; rumah tangga |
| G02 | Dokumen, Tabel & Arsip | membaca, menyusun, memeriksa, mengolah berkas kerja | PDF; dokumen teks; spreadsheet; arsip |
| G03 | Data, Teks & Format | membersihkan, mengubah, memvalidasi data atau teks | JSON/CSV; teks; kode ringan; encoding |
| G04 | Gambar & Visual | mengubah dan menyiapkan visual secara lokal | dasar gambar; metadata; layout cetak; diagram |
| G05 | Audio & Video | memeriksa atau mengolah media secara lokal | audio; video; subtitle; metadata |
| G06 | Generator & Template | menyusun keluaran praktis yang dapat diedit | kerja; surat; proyek; belajar; kehidupan |
| G07 | Web & Developer Workbench | membantu pekerjaan web dan data pengembang | request lokal; format; schema; aset; debug aman |
| G08 | Privasi & Keamanan Pribadi | melindungi data milik sendiri secara defensif | sandi; hash; metadata; audit berkas |
| G09 | Proyek & Kebutuhan Harian | merencanakan dan menyelesaikan pekerjaan nyata | rumah; kendaraan; masak; perawatan; daftar kerja |
| G10 | Perangkat & Diagnostik Lokal | membaca keadaan perangkat yang diizinkan dan memberi langkah aman | penyimpanan; jaringan lokal; Termux; laporan diagnostik |

Kelompok bukan janji bahwa semua mesin di dalamnya sudah tersedia. Ia adalah akar informasi agar penambahan berikutnya konsisten, aman, dan dapat dicari.

## 5. Inventaris yang benar-benar aktif saat ini

Hanya tiga ruang kerja berikut yang boleh diklaim aktif sampai implementasi berikutnya selesai dan lolos kriteria publikasi:

| Group | Alat aktif | Hasil nyata saat ini |
| --- | --- | --- |
| G01 | Rumus & Kalkulasi | sepuluh kalkulasi deterministik dengan input dan hasil yang diperiksa |
| G02 | PDF Workspace | info, gabung, pecah, putar, hapus halaman, urut ulang, dan kompres PDF sesuai kemampuan implementasi lokal saat ini |
| G06 | Career Workspace | CV, surat lamaran, portofolio, pratinjau, ekspor HTML, cetak atau simpan PDF, serta simpan privat |

Word atau DOCX, Excel atau XLSX, OCR, editor gambar, editor media, pemindai perangkat, dan kandidat lain bukan fitur aktif kecuali sudah mempunyai mesin lokal, kontrak data, UI hasil, dan bukti verifikasi yang lengkap.

## 6. Kontrak wajib setiap alat

Sebelum satu alat ditulis ke UI, buat satu **Tool Brief** yang dapat dibaca manusia dan data registry yang dapat dibaca aplikasi. Minimal memuat:

```text
identity        id stabil, versi, nama, group atau family, tag, pemilik kode
job             masalah yang diselesaikan dan keluaran yang dijanjikan
boundaries      yang tidak dikerjakan; kapan pengguna perlu tutorial atau ahli
input           tipe, MIME + magic bytes bila berkas, ukuran, jumlah, validasi
execution       mesin lokal, dependensi, izin, waktu kerja, pembatalan
output          format, lokasi, cara unduh atau salin, cara memeriksa hasil
risk            tingkat risiko, peringatan, data sensitif, konsekuensi salah pakai
retention       apa yang disimpan, durasi, cara menghapus, apakah masuk riwayat
states          initial, invalid, ready, processing, success, empty, error, recovery
accessibility   label, instruksi, fokus keyboard, pesan kesalahan, kontras
acceptance      skenario nyata yang membuktikan hasil dan kegagalan aman
```

Tool Brief tidak boleh mengatakan AI membuat bila prosesnya hanya template tetap. Generator dapat memakai aturan atau formulir lokal selama hasilnya nyata, dapat diedit, dan sumber logikanya jujur.

## 7. Mode eksekusi lokal

Setiap alat memilih mode dengan izin paling kecil. Tidak ada mode yang diizinkan mengirim data pengguna ke layanan online.

| Mode | Dipakai untuk | Aturan |
| --- | --- | --- |
| `LOCAL_BROWSER` | kalkulasi, transformasi teks, generator ringan, visual sederhana | proses di browser; tidak mengunggah data |
| `LOCAL_LIGHT` | operasi berkas yang ditangani dependensi aplikasi lokal | berkas tervalidasi; keluaran eksplisit; artefak sementara dibersihkan |
| `TEMP_FILE` | pekerjaan multi-berkas atau hasil besar | direktori sementara terisolasi per pekerjaan; batas ukuran dan waktu; pembersihan terukur |
| `TERMUX_ALLOWLIST` | kemampuan perangkat yang membutuhkan lingkungan lokal Termux | perintah dan argumen di-allowlist, tanpa shell bebas, persetujuan jelas, laporan dapat ditinjau |

`TERMUX_ALLOWLIST` tidak berarti terminal bebas. Alat tidak boleh menerima perintah mentah, menyimpan credential, mengubah sistem diam-diam, memindai target pihak ketiga, atau mengakses direktori di luar ruang kerja yang disetujui.

## 8. Privasi, berkas, dan batas keamanan

Klasifikasi retensi harus tampak pada Tool Brief dan UI:

| Kelas | Makna |
| --- | --- |
| `NONE` | data hanya hidup dalam memori selama sesi dan hilang saat selesai |
| `DOWNLOAD_ONLY` | hasil diberikan sebagai unduhan tanpa salinan aplikasi |
| `PRIVATE_METADATA` | hanya judul, waktu, atau parameter non-rahasia disimpan privat |
| `PRIVATE_CONTENT` | isi disimpan lokal secara eksplisit oleh pengguna, dengan hapus yang nyata |

Aturan minimum untuk input berkas:

- Periksa jenis berkas dengan MIME **dan** signature atau magic bytes bila relevan; ekstensi saja tidak cukup.
- Tetapkan batas ukuran, jumlah berkas, halaman atau baris atau dimensi, dan waktu kerja.
- Tolak path traversal, arsip bertingkat atau zip bomb, macro dokumen yang tidak diproses aman, formula spreadsheet berbahaya, dan metadata tak wajar.
- Jangan memasukkan isi dokumen, isi CV, kata sandi, token, atau data sensitif ke log. Catat metadata minimum untuk diagnosis privat saja.
- Keluaran tidak boleh menimpa berkas asli tanpa pilihan sadar; nama keluaran berbeda dan proses dapat dibatalkan bila teknis memungkinkan.
- Hapus berkas sementara ketika pekerjaan selesai atau gagal dan sediakan tindakan bersihkan riwayat atau data privat.

G08 bersifat defensif untuk data dan perangkat pengguna sendiri. Ia tidak memuat alat eksploitasi, pengambilan credential, pemindaian target tanpa izin, atau instruksi mengganggu pihak lain. Alat finansial, kesehatan, hukum, atau keselamatan fisik wajib menyebut asumsi dan batas; ia membantu perhitungan atau persiapan, bukan menggantikan ahli.

## 9. Registry, data model, dan pencarian

Satu sumber data registry mencegah label, group, URL, izin, dan status alat berbeda-beda di sidebar, selector, pencarian, atau halaman detail. Pertahankan struktur yang telah bekerja; jangan migrasi schema hanya demi arsitektur di atas kertas.

```text
ToolDefinition
  id, version, groupId, familyId?, status, name, summary, tags
  executionMode, riskLevel, retentionClass, inputContract, outputContract
  route, availabilityReason?, briefRef, capabilityFlags

ToolGroup
  id, label, orderHint, icon, description

ToolFamily
  id, groupId, label, description

ToolJob / ToolOutput
  dipakai hanya ketika riwayat pekerjaan lokal sungguh dibutuhkan
```

- `id` dan data kontrak tidak bergantung pada nama yang tampil.
- Status alat adalah data, bukan teks dekoratif di komponen.
- Pencarian lokal mencari nama, sinonim, tag, pekerjaan, jenis input, dan format output; bukan hanya nama kartu.
- Hasil pencarian menjelaskan alasan kecocokan dan batas alat.
- Favorit, terakhir dipakai, dan riwayat tidak boleh memblokir penggunaan dasar serta tetap privat pada perangkat.

Penyimpanan seperti `tool_groups`, `tool_families`, `tool_versions`, `tool_jobs`, dan `tool_outputs` baru dibuat saat penyimpanan lokal diperlukan oleh lebih dari satu alat. Tidak ada migrasi database dalam tahap blueprint ini.

## 10. Lifecycle: tidak ada fitur setengah jadi di katalog aktif

```text
IDEA
  → CONTRACTED
  → IMPLEMENTED_UNVERIFIED
  → VERIFIED_LOCAL
  → PUBLISHED
  → SUSPENDED / RETIRED
```

- `IDEA`: tercatat sebagai kandidat, belum memiliki UI.
- `CONTRACTED`: Tool Brief dan batas risiko selesai, belum memiliki UI aktif.
- `IMPLEMENTED_UNVERIFIED`: kode ada tetapi belum layak dinyatakan aktif.
- `VERIFIED_LOCAL`: alur inti dan kegagalan aman sudah diperiksa secara lokal.
- `PUBLISHED`: satu-satunya status yang tampil di selector utama.
- `SUSPENDED`: disembunyikan karena regresi, risiko, atau dependensi hilang.
- `RETIRED`: diganti atau dihentikan dengan migrasi atau penjelasan yang jujur.

Kandidat dapat tampil dalam dokumen roadmap, namun tidak sebagai tombol yang terlihat dapat dipakai. Placeholder visual, label segera hadir, dan hasil demo tidak menggantikan lifecycle ini.

## 11. Roadmap implementasi berdasarkan kemampuan nyata

Urutan ini adalah urutan membangun, bukan janji rilis sekaligus. Satu alat dituntaskan sampai `PUBLISHED` sebelum alat berikutnya menambah utang UI.

| Tahap | Fokus | Keluaran yang harus selesai sebelum lanjut |
| --- | --- | --- |
| R0 | fondasi katalog | Tool Brief, registry status, deep-link aman, state workspace, pola error atau hasil atau retensi konsisten |
| R1 | alat ringan bernilai tinggi | konversi, kalkulator praktis, teks atau data deterministik, QR, hash atau UUID lokal bila kontraknya selesai |
| R2 | dokumen & struktur berkas | perluasan PDF yang benar; pembaca atau ekstraktor DOCX, spreadsheet, dan arsip hanya setelah parser lokal aman tersedia |
| R3 | gambar & dokumen visual | resize atau crop atau konversi atau metadata, lalu OCR hanya jika engine lokal benar-benar tersedia dan terukur |
| R4 | generator & template | template kerja atau kehidupan yang editable, ekspor nyata, penyimpanan privat opsional |
| R5 | data & developer workbench | JSON atau CSV atau schema atau encoding atau aset serta request lokal yang dibatasi aman |
| R6 | audio & video | inspect atau konversi atau edit dasar setelah mesin lokal dan batas sumber daya jelas |
| R7 | diagnostik Termux & kebutuhan praktis | laporan perangkat lokal berizin, checklist proyek, estimator, perawatan, dengan batas keselamatan |

Kapasitas UI mengikuti kebutuhan: mulai dari group + tool selector, lalu family, pencarian, filter, pinned tools, dan riwayat ketika volume membuktikannya perlu. Jangan menambah sistem kompleks sebelum ada alat aktif yang memerlukannya.

## 12. Antrian kandidat pertama

Tabel ini menyatakan pekerjaan desain dan kontrak yang harus dilalui, bukan status aktif. Prioritas mengikuti nilai guna, risiko rendah, dan kemungkinan eksekusi tanpa layanan online.

| ID kandidat | Group | Nilai kerja nyata | Mode awal | Bukti minimum sebelum `PUBLISHED` |
| --- | --- | --- | --- | --- |
| T-UNIT | G01 | konversi satuan dan satuan turunan | `LOCAL_BROWSER` | rumus atau satuan jelas, hasil dan pembulatan dapat diperiksa |
| T-MATERIAL | G01 | estimator bahan, luas, volume, cat, atau campuran | `LOCAL_BROWSER` | asumsi terlihat, unit konsisten, peringatan keselamatan |
| T-JSON | G03 | format, validasi, dan lihat struktur JSON | `LOCAL_BROWSER` | error menunjukkan lokasi, salin atau unduh hasil, tidak ada jaringan |
| T-CSV | G03 | inspeksi, pembersihan dasar, dan konversi CSV | `LOCAL_BROWSER` / `LOCAL_LIGHT` | delimiter atau encoding jelas, perlindungan formula, hasil dapat diperiksa |
| T-HASH | G08 | checksum berkas milik sendiri | `LOCAL_BROWSER` / `LOCAL_LIGHT` | algoritme terlihat, hasil salin, data tidak keluar perangkat |
| T-SECRET | G08 | generator passphrase, UUID, atau token lokal | `LOCAL_BROWSER` | sumber acak lokal, tidak menyimpan rahasia, tombol salin jujur |
| T-QR | G04/G06 | membuat atau membaca QR untuk data pengguna | `LOCAL_BROWSER` | preview atau unduh, validasi payload dan batas data |
| T-IMAGE-RESIZE | G04 | resize atau crop atau format gambar | `LOCAL_BROWSER` | preview sebelum dan sesudah, metadata dan ukuran output jelas |
| T-IMAGE-PRIVACY | G04/G08 | inspeksi atau hapus metadata gambar | `LOCAL_LIGHT` | perbandingan metadata, salinan baru, peringatan lokasi atau GPS |
| T-PDF-EXTEND | G02 | memperdalam operasi PDF yang sudah nyata | `LOCAL_LIGHT` | berkas hasil dibuka ulang, halaman dan urutan diverifikasi |
| T-DOCX-EXTRACT | G02 | ekstrak teks atau struktur DOCX secara lokal | `LOCAL_LIGHT` | parser aman, batas macro atau arsip, keluaran dapat diperiksa |
| T-SHEET-INSPECT | G02 | baca dan cek spreadsheet tanpa menjalankan formula berbahaya | `LOCAL_LIGHT` | batas file, formula diperlakukan sebagai data, ekspor aman |

Kandidat seperti konverter audio atau video, OCR, pembersih arsip, laporan perangkat, dan generator proyek ditempatkan setelah dependensi lokal, biaya sumber daya, dan pemulihan ditetapkan dalam Tool Brief.

## 13. Pola workspace menurut jenis pekerjaan

Satu halaman layout tidak dipaksakan pada semua alat. Header ringkas dan selector tetap sama, sedangkan tubuh workspace mengikuti pekerjaan:

| Jenis workspace | Cocok untuk | Struktur inti |
| --- | --- | --- |
| Calculator | rumus, estimator, konversi | input berkelompok → asumsi → hasil → cara hitung atau aksi salin |
| File Pipeline | PDF, dokumen, gambar, media | masukan berkas → daftar atau urutan → konfigurasi → proses → hasil atau unduh |
| Editor / Transformer | JSON, CSV, teks, kode ringan | source → validasi → transformasi → diff atau hasil → ekspor |
| Generator | CV, surat, checklist, template | konteks → data → komposisi → preview → edit atau ekspor atau simpan privat |
| Inspector | metadata, hash, berkas, perangkat | sumber → temuan → arti temuan → tindakan aman → laporan |
| Guided Practical | proyek rumah, perawatan, kebutuhan harian | tujuan → kondisi atau batas → hitungan atau checklist → bahan → verifikasi dan keselamatan |

Gunakan panel hasil yang menempati bagian utama halaman; jangan mengubur hasil di card kecil. Form panjang dibagi bagian logis, tetapi jangan dibuat wizard bila pengguna perlu membandingkan input dan hasil bersamaan.

## 14. Definition of Done per alat

Sebelum mengubah status menjadi `PUBLISHED`, periksa semuanya:

- Tool Brief, id, group, status, kontrak input atau output, risiko, dan retensi ada.
- Ada proses nyata dengan data baru dari pengguna, bukan contoh yang selalu sama.
- Validasi masukan dan pesan gagal menjelaskan tindakan pemulihan.
- Hasil dapat diperiksa, disalin atau diunduh bila relevan, dan tidak menimpa sumber.
- Alur keyboard, fokus, label form, ARIA, kontras, dan layar sempit terpikirkan.
- Menu group dan alat tidak tumpang-tindih; klik luar serta `Escape` menutupnya.
- Tidak memakai layanan online, token tersembunyi, telemetry data sensitif, atau perintah Termux bebas.
- Input buruk, batas ukuran, pembatalan, dan pembersihan sementara ditangani.
- Bukti pemeriksaan lokal dicatat dalam `TEST-REPORT.md` tanpa menjalankan proses yang dilarang oleh instruksi kerja saat itu.
- Backlog, state, changelog, cycle log, checkpoint, dan keputusan diperbarui bila keputusan arsitektural atau fitur aktif berubah.

## 15. Hubungan dengan Explore dan Tutorial

Tools tidak mengulang artikel ensiklopedia atau tutorial penuh. Sebaliknya, alat dapat mempunyai tautan kontekstual kecil ke:

- **Explore** untuk definisi, konsep, sumber pengetahuan, dan relasi topik.
- **Tutorial** untuk urutan kerja nyata, daftar bahan, risiko, diagnosis, serta cara memeriksa hasil alat pada konteks kehidupan.
- **Service atau Shop** hanya bila ada kebutuhan manusia atau barang nyata; tautan tidak boleh memaksakan transaksi atau menyamarkan konten sponsor.

Setiap hubungan memakai metadata topik stabil, bukan tautan manual yang tersebar di komponen. Saat sistem topik Explore berkembang, alat dapat ditautkan ke concept node dan tutorial dapat menautkan kembali ke tool relevan tanpa mengubah identitas alat.

## 16. Protokol kerja agent untuk ruang Tools

Sebelum mengerjakan alat baru, agent wajib membaca dokumen ini bersama `MADEVI-MASTER-AUTONOMOUS-AGENT-SCOPE.md`, `memory/STATE.md`, `memory/CHECKPOINT.md`, `memory/DECISIONS.md`, dan `memory/TEST-REPORT.md`.

1. Telusuri implementasi dan registry yang sudah ada tanpa menganggap rencana sebagai fakta aktif.
2. Pilih satu masalah pengguna, lalu tulis Tool Brief dan risiko atau batasnya.
3. Tentukan apakah ia Tool baru atau Operation dari workspace yang ada.
4. Bangun proses lokal paling kecil yang memberi output nyata.
5. Rancang state kosong, validasi, proses, berhasil, gagal, pemulihan, dan privasi sebelum memperluas visual.
6. Implementasikan dengan pola selector dan desain Madevi yang telah stabil.
7. Periksa secara proporsional sesuai izin kerja aktif; jangan menjalankan npm, lint, test, server, build, atau proses latar belakang bila dilarang.
8. Catat fakta, batas, dan langkah berikutnya pada memori kontrol.

Aturan akhir: jumlah menu bukan ukuran kemajuan. Satu alat kecil yang jujur, cepat, aman, dan benar-benar menghasilkan keluaran lebih bernilai daripada seratus template kosong.
