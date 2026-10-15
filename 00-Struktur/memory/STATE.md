# STATE — Madevi_Off (MASTER otonom, 2026-09-26)

- Aturan kontrol terbaru 2026-09-26: Agent 1 memprioritaskan riset dan usul blueprint
  selama runner aktif; Agent 2–5 melanjutkan checkpoint serta item siap secara otomatis
  dalam batas lock/guardrail. Ini perubahan dokumen kontrol saja; belum ada runner
  latar belakang yang dinyalakan atau implementasi aplikasi pada pekerjaan ini.

- Perencanaan kontrol 2026-09-26: rencana baru memakai satu hasil per bidang, bukan tahap
  mikro. Roadmap dan backlog di `Madevi-Control` telah diringkas; audit/INDEX historis tetap
  menjadi bukti. Pekerjaan ini tidak membaca atau mengubah source `Madevi_Off`.

> **Migrasi control-plane (CTRL-5A-001):** `../blueprint/INDEX.md` adalah satu-satunya sumber
> status item aktif. Label status di bawah adalah fakta/riwayat kerja sebelumnya, bukan status
> aktif kecuali INDEX menyatakannya demikian.

- `UX-REDESIGN-002` adalah satu-satunya lock aktif (`PROSES`) per 2026-09-26. Source publik
  telah menerima cascade Fieldbook/Night Ledger/Signal Atlas, overlay Signal Atlas, header
  `MADEVI` dengan enam huruf bergerak dan Kinetic Bolt terjadwal, serta font lokal.
  Sidebar, route, API, auth, dan data tidak berubah. Parser TSX dan pemeriksaan CSS statis
  lulus; runtime, visual breakpoint, fokus keyboard, dan reduced-motion di browser belum
  diverifikasi sehingga status INDEX tidak berubah.

- Perencanaan produk 2026-09-25: Agent 1 kini memiliki peta induk web, inventaris route/isi,
  spesifikasi per route untuk 35 halaman publik/akun dan 20 halaman Owner/Admin, rencana
  produksi isi tiap ruang, dan roadmap dependency di `../blueprint/produk/`. Dokumen tersebut adalah target produk
  berdasarkan pemeriksaan statis source, bukan hasil audit runtime atau status implementasi.
  Tidak ada source aplikasi, migration, data, atau item aktif INDEX yang diubah pada pekerjaan
  perencanaan ini.

- Status: `AKTIF-OTONOM` (kontrol Agent dipusatkan di `Madevi-Control`; siklus statis UX-001, CONTENT-001, PROFILE-001, ADMIN-001, SEARCH-001 selesai PASS).
- Per 2026-09-25 INDEX menandai `ADMIN-001-REV1`, `ASSESS-001`, `SEC-001`, `AMBIENT-001`,
  `ROUTE-FIX-001`, dan `JASA-API-001` sebagai `PASS`. Item aktif tersisa: `RECOVERY-001`
  (BELUM, butuh izin Owner untuk drill restore non-production). Turunan AMBIENT (staggered
  reveal, animated gradient text, micro-interactions, device frame) ada di backlog menunggu
  triase.
- `ROUTE-FIX-001` (PROSES, sesi ini): `/admin` kini alias pengalihan ke `/owner` kanonis
  (`next.config.ts` redirects; sebelumnya `/admin` redirect ke `/admin/operasi` yang tidak
  ada), 7 href capability `AdminService.getCapabilities()` dialihkan ke `/owner/*`, path
  paket taxonomy pada test dipindahkan ke `content-local/packages/taxonomy/` (folder
  `Menu/` eksternal sudah dipensiunkan), dan 5 assertion kontrak desain `prompt03`
  diperbarui ke nilai pasca-UX-REDESIGN-001. Bukti di `memory/TEST-REPORT.md`.
- Revisi aktif: `ADMIN-001-REV1` memisahkan error layanan dari autentikasi/otorisasi dashboard Admin dan menghapus fragmen navigasi pengguna tanpa target; `UX-001-REV1` mengubah fondasi ke Layered Editorial: tanpa hover-lift generik, fokus keyboard jelas, Basic teal yang hidup, Hero Home sebelumnya dipulihkan utuh tanpa baris dekorasi kosong, serta signal On terbatas pada navigasi/CTA/AI. Keduanya berstatus `PROSES` pada INDEX, dengan bukti implementasi statis di CHECKPOINT; runtime/visual belum diverifikasi.
- Redesign aktif `UX-REDESIGN-001` tetap `PROSES` pada INDEX. Source sudah memuat
  dua tingkat motion, starfield dan meteor acak pada shell publik Madevi On,
  entrance teks non-baca, wordmark Home, serta reskin sidebar visual. Setelah
  disconnect, nama keyframe sinyal sidebar yang bertabrakan dipisahkan dan
  selector pseudo-element `:is()` yang tidak sah diperbaiki. Route artikel
  menghentikan animasi chrome/navigasi/Asisten. Parser CSS/TSX terkait lulus;
  audit terpisah dan visual/runtime belum diverifikasi.
- Lanjutan `UX-REDESIGN-001`: Basic kini memilih section utama pada halaman
  fitur publik untuk entrance singkat; Madevi On memakai direktori ruang
  asimetris yang responsif, bidang hero art opak tanpa blur, dan starfield
  dengan rasio SVG terjaga. Kartu, header fitur/artikel, panel kerja, dan input
  On kini opak; glass tersisa pada chrome serta overlay sementara. Struktur
  sidebar, route, API, dan data tetap sama.
- Stack: Next 16.3.4 App Router, React 19.2.8, TS 5.9.3, drizzle/pg, Vitest.
- DB lokal: aktif menurut checkpoint sebelumnya; migrasi 0001–0035 tercatat `applied:true`.
  Source migration `0036-search-space-tutorial-problem-solve`, `0037` (no-op kompatibilitas
  agar data Shop belum terverifikasi tidak disemai), `0038`, dan `0039-content-packets-discovery-and-safety`
  masih `PENDING / TIDAK-DIJALANKAN` atas batas operasi Owner.
- Taxonomy: revisi 3 `ACTIVE` — paket `madevi-explore-pilot-v1` 2.0.0 (27 node, multi-root R1 School dan R2 Explore).
- Siklus terbaru `TERIMPLEMENTASI / TERUJI-SEBAGIAN`:
  - Drawer sidebar tetap `position: fixed; right: 0`; konflik Madevi On yang mengubah posisi sudah dihilangkan.
  - Sidebar menyinkronkan menu runtime saat drawer terbuka/focus/visibility event, dengan interval terbatas 45 detik.
  - Tema Light/Dark tetap berbasis token; Madevi On dibangun ulang sebagai tema dark premium yang terpisah: atmosfer warna bergerak lambat, sinyal chrome terarah, active-state hidup, dan orb Asisten lokal. Tema secara eksplisit mengembalikan header ke `sticky`, sidebar ke `fixed` di kanan, dan popup Asisten ke `fixed`; motion tidak boleh mengubah layout serta selalu tunduk pada reduced-motion.
  - Profil kini memakai satu sumber navigasi (sidebar profil), bukan sidebar ditambah tab duplikat; informasi, keamanan, dan tindakan data dipisah jelas.
  - Permintaan ekspor/hapus data menangani gagal jaringan; penghapusan meminta konfirmasi lokal dan tetap hanya membuat request untuk review Admin.
  - Konsol Admin menggunakan ringkasan dan antrean dari `/api/v1/owner/operasi`, bukan telemetry dekoratif; menu hanya menunjuk route nyata.
  - Shop kini menyampaikan error katalog, kategori dari data terbit, dan urutan harga API yang benar (`PRICE_ASC`/`PRICE_DESC`); School tidak lagi mengklaim aturan ujian global yang hardcode; Tools memakai status siap/belum tersedia yang dapat dibaca pengguna.
  - Shop, Line, dan Services memiliki heading/aksi yang selaras dengan panel aktual; kartu cloud palsu diganti menjadi PCB Layout.
  - Line, Services, Tools, dan Profil memakai URL sebagai sumber pilihan ruang/section sehingga deep link, reload, dan Back/Forward tidak memulihkan state lokal yang salah; Beranda mengelompokkan ruang menurut tujuan.
  - Tools kini memiliki tiga workspace yang konsisten dan seluruhnya aktif: rumus deterministik dengan validasi/input-result-copy-save, pemrosesan PDF dengan validasi operasi dan lifecycle output aman, serta dokumen karier dengan template, preview hidup, ekspor HTML, dan cetak/simpan PDF.
  - Katalog undangan tidak lagi memesan data contoh. Ia hanya menerima template `PUBLISHED`; ketika kosong, brief undangan custom tetap dapat dibuat. Owner sekarang dapat membuat draft template lewat UI, lalu menerbitkan/arsipkan dari tabel yang sama.
  - Jalur School membedakan state loading/akses/tidak ditemukan, ringkasan progres, langkah berikutnya, dan kurikulum. UI tidak lagi mengklaim durasi ujian atau batas percobaan universal yang tidak berasal dari konfigurasi server.
  - Shop memiliki aksi simpan/tanya dengan pending, login, dan pesan gagal yang jelas; kata kunci diterapkan saat form cari dikirim agar katalog tidak memuat ulang pada setiap karakter. Aksi pembelian tiruan telah diretir; checkout legacy kini menyatakan tidak tersedia secara jujur.
  - Services sekarang memakai pemilih tiga jalur di samping workspace aktif, bukan rangkaian kartu promosi dan tab yang menggandakan pilihan. URL `?tab=` tetap menjadi sumber state untuk Layout terbit, brief custom, dan brief PCB; tiap alur memperlihatkan tahapan review yang benar-benar relevan.
  - Tools sekarang memakai arsitektur tiga tingkat yang siap bertumbuh: kapsul Kelompok alat → kapsul Pilihan alat di kanannya → workspace aktif. Masing-masing kapsul membuka daftar pilihan kecil; memilih kelompok yang berbeda meminta pengguna memilih alat, bukan mengganti workspace diam-diam. Tiga kelompok nyata awal adalah Hitung & Rumus, Dokumen & Berkas (PDF), dan Generator (Dokumen Karier). Kuota/akses berada dekat konteks ruang tanpa menyembunyikan panel yang menjalankan fungsi aktual; URL `?tab=` tetap mempertahankan pilihan.
  - Shop sekarang adalah permukaan keputusan katalog: pencarian/saringan, jumlah hasil, catatan operasi lokal, detail produk, simpan, dan pertanyaan Owner dipisahkan secara jelas. Detail produk kini membedakan rekam data, status mitra, catatan sumber, dan pertanyaan; tidak ada checkout terselubung.
  - Root Explore & Learn kini memakai browser pengetahuan khusus: breadcrumb satu baris yang ringkas, heading kiri, kategori dan jalur yang selalu dimuat dari taxonomy aktif, state gagal/empty yang jujur, serta tepat satu artikel fixture berlabel DRAFT sebagai contoh struktur judul. Jalur aktif disimpan sebagai `?path=` kanonis sehingga tautan, reload, alias, Back/Forward, dan retry tetap berada pada konteks taxonomy yang sama; menu besar memakai cursor API per 24 node. Fondasi informasi memisahkan kategori → kelompok → jalur → judul agar katalog dapat bertumbuh tanpa membesarkan halaman awal.
  - Tutorial & Problem Solve adalah ruang utama ketujuh, tepat setelah Explore pada sidebar dan Beranda. Ia memakai browser action-first berbasis taxonomy lokal, deep link menuju URL `?path=`, pagination cursor, daftar panduan artikel terbit pada daun taxonomy, serta state jujur ketika R7 belum dipublikasikan. Dalam state itu, fondasi katalog statis memperlihatkan tujuh vocabulary R7 dan satu judul `DRAFT` lintas domain tanpa mengklaim artikel/node sudah terbit. Explore sekarang menautkan kebutuhan tindakan ke ruang ini; keduanya tidak lagi menyamar sebagai ruang yang sama.
  - Arsitektur ekspansi R2/R7 kini kanonis di `memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`: menu tetap memakai pohon `R→D→K→M→T`, sedangkan facet/relasi menangani discovery berskala besar. Artikel memakai profil Madevi Atlas atau Jalur Praktik, bukan template ensiklopedia dan bukan hasil salinan struktur web luar.
  - Identitas publik kini konsisten menggunakan emblem Madevi pada header/sidebar; nama produk tetap Madevi, sedangkan `Madevi_Off` hanya nama source. Orb Asisten Madevi hadir sebagai aksi sumber lokal lintas ruang; ia bergerak halus saat sumber lokal tersedia dan berhenti pada reduced-motion.
  - Adapter mock Asisten telah dihapus: jawaban berasal dari retrieval artikel lokal yang diizinkan dan menyertakan sumber. Shop tidak lagi menyediakan alur pembelian tiruan; hanya simpan produk dan pertanyaan Owner yang tetap aktif. Sisa simulasi direkam secara terurut di `SIMULATION-REMOVAL-AUDIT.md` dan tidak disamarkan sebagai fungsi nyata.
  - Paket taxonomy yang masih diperlukan sudah dipindahkan ke `Madevi_Off/content-local/packages/taxonomy/`; source tidak lagi boleh bergantung pada folder `Menu/` di luar proyek.
  - Lapisan visual global `interface-refresh.css` kini menyatukan elevasi, state fokus, tombol, form, card, header, sidebar, login, dan konsol Admin tanpa mengubah route/API/form action. Light memakai kanvas putih; Dark memakai dasar hitam murni; setiap ruang memiliki cue warna sendiri tanpa menambah menu atau data palsu.
  - Madevi On kini menjadi tema ekspresif yang terpisah: dasar hitam/plum dengan aksen amethyst/amber, konstelasi SVG di Home, serta bintang kecil dan meteor singkat yang hidup di seluruh shell publik. Blur/nebula dibatasi pada zona atas dan chrome; panel/kartu reguler tetap opaque agar tidak tumpang tindih atau mengganggu baca. Light/Dark tetap tema kerja yang tenang; dekorasi tidak menambah angka, status, menu, atau tindakan palsu. Kartu bacaan tetap padat agar kontras dan biaya render Android tetap aman. Menu Admin/Owner menggunakan SVG semantik per kelompok, bukan ikon dekoratif acak.
  - Tahap lanjutan UI memakai GSAP untuk hero yang merakit dari posisi tersebar dengan amplitudo kecil dan reveal scroll yang tidak scrub/bergeser terus-menerus, Anime.js untuk split kata blur→fokus yang sempit pada heading pendek serta orbit emblem, dan primitive lokal bergaya shadcn (`Button`/`Card` berbasis Slot + CVA). `PublicShell` menjadi satu titik motion lintas halaman publik; scope bertingkat disaring agar tidak ada animasi ganda. Home menyajikan direktori ruang nyata dan tautan aktif di atas constellation background SVG; tidak ada statistik/slogan palsu atau tombol fiktif. Ikon CTA/login memakai SVG lokal agar tidak menambah dependency ikon besar yang rentan pada storage Android. Konsol Admin/Owner sengaja tidak diberi koreografi baru dan tetap panel kerja dasar.
  - **D08 menggantikan koreografi konten di atas:** teks, kartu, dan artikel kini selalu state
    final sejak first paint; tidak ada GSAP/Anime split/reveal/scroll-trigger yang dapat membuat
    konten terlambat terbaca atau keluar lagi saat scroll. Madevi On tetap bergerak pada layer
    CSS atmosfer di belakang shell (starfield SVG dan tiga meteor berfase awal terlihat), lalu
    dihentikan oleh `prefers-reduced-motion`. Header/sidebar/popup/search memakai kaca
    semi-transparan blur terukur; body artikel sengaja opaque serta motion-free. Wordmark header
    menjadi `MADEVI/ON` dan ikon Asisten menjadi bubble beacon bintang lokal, menggantikan
    orb-plus generik. Tidak ada route/API/data/functionality palsu yang ditambahkan.
  - **D09 mengoreksi batas tersebut menurut konteks:** GSAP kembali pada target eksplisit untuk
    route umum di seluruh tema, tetapi hanya target yang masih di bawah viewport yang boleh
    disiapkan untuk scroll reveal. `/artikel/*` tidak memuat motion content maupun page-entry;
    nama kanonis header dikembalikan menjadi `MADEVI` dengan treatment kilat biru-kuning dan
    letter turn yang berhenti pada reduced-motion. Light/Dark memakai token monokrom dan Madevi
    On tetap satu-satunya atmosfer kosmik. Grid Shop serta z-plane Search diperbaiki agar
    dropdown/input/action/sidebar tidak saling menutup. Parser tujuh TS/TSX + PostCSS dua sheet
    lulus; tidak ada browser/server dijalankan.
- Verifikasi siklus sebelumnya: parser TS/TSX untuk 8 file dan cek keseimbangan CSS lulus; unit `prompt04-ui` 4/4 lulus; smoke HTTP lokal 200 untuk ruang inti dan Profile. API katalog menjawab 200 untuk urutan harga, tetapi database lokal kosong (0 produk terbit). Implementasi setelah titik ini belum menjalankan proses apa pun sesuai arahan Admin untuk tidak menjalankan background/npm/lint/test.
- Verifikasi untuk rangkaian perubahan terbaru sengaja belum dijalankan: arahan Admin melarang background, npm, lint, test, atau proses lain. Parser transpile TypeScript untuk layout + dua shell Admin dan keseimbangan brace CSS lapisan baru lulus; tidak ada klaim runtime/visual baru untuk redesign Services, Tools, Shop, detail Shop, atau fondasi Tutorial sampai arahan itu berubah.
- Verifikasi statis motion/component terbaru: transpile parser berhasil untuk 10 file TS/TSX (layout, public shell, Home, auth, recovery, owner login, orchestrator, dan primitive UI); balance CSS `tokens.css`/`interface-refresh.css` lulus. Dependensi GSAP, Anime.js, Radix Slot, CVA, dan clsx tercatat pada manifest/lock melalui `npm install --package-lock-only --offline --ignore-scripts`; tidak ada lint, build, test, request API, migrasi, atau server baru yang dijalankan. Proses `npm run dev` yang sudah ada ditemukan dan dibiarkan tidak disentuh.
- Pemulihan dependency lokal: error Next `Cannot find module 'baseline-browser-mapping'` berasal dari folder package yang tertinggal tersembunyi setelah reify npm yang pernah terputus. Semua 14 package terdampak—termasuk baseline-browser-mapping, browserslist, update-browserslist-db, acorn, semver, prettier, serta `@babel/parser`—dipulihkan ke nama kanonis sesuai lock; require `next/dist/build/get-supported-browsers.js` kini lulus. Tidak ada package baru, lockfile baru, atau dev server yang dijalankan untuk perbaikan ini.
- Recovery lanjutan: `mappings.wasm` internal Next dipulihkan dari tarball `next@16.3.4` yang sesuai lock. `lucide-react` terbukti tersalin tidak utuh pada filesystem Android, sehingga tiga import ikon diganti SVG lokal dan dependency/lock Lucide dihapus. Beranda dari dev server yang sudah berjalan menjawab HTTP 200 tanpa error module/source-map pada respons.
- Audit statis terbaru memperbaiki navigator workspace yang dapat tertutup header sticky, target kontrol Shop di bawah 44 px, dan error pertanyaan Owner yang sebelumnya hanya terlihat jauh di atas form. Gambar listing Shop kini lazy/async; fungsi endpoint tidak diubah. Semua perubahan ini belum diuji runtime atas batas operasi yang sama.
- Audit statis Tools terbaru memisahkan pemilih kelompok dari pemilih alat: dua kapsul ringkas berada di kiri atas workspace, dengan Pilihan alat di kanan Kelompok alat. Daftar dropdown ditutup oleh klik di luar area atau Escape; state `aria-expanded`, fokus, dan target sentuh dipertahankan. Breakpoint kecil menumpuk kedua kapsul tanpa horizontal scroll. Tidak ada Word/Excel atau alat rencana lain yang dipublikasikan sebagai interaksi aktif; panel PDF tetap menyediakan tujuh operasi lokal yang ada (info, gabung, pisah, putar, hapus halaman, susun ulang, optimasi), Formula dan Generator Karier tetap memakai alur nyata yang ada. Semua perubahan ini belum diuji runtime atas batas operasi yang sama.
- Perbaikan state dropdown: aturan CSS eksplisit `.tools-workbench__selector-menu[hidden] { display: none; }` kini mengalahkan display grid milik panel. Dua daftar tidak lagi dapat terlihat/bertumpuk bersamaan; memilih Dokumen menutup daftar kelompok lalu langsung membuka daftar Pilihan alat.
- Arsitektur jangka panjang Tools diperluas menjadi blueprint kanonis setara skala Explore/Tutorial: sepuluh kelompok pekerjaan, model Group → Family → Tool → Operation, kontrak Tool Brief, mode lokal, retensi, lifecycle `IDEA` hingga `PUBLISHED`, dan roadmap R0–R7. Ini perubahan kontrol saja; tiga workspace aktif tetap satu-satunya alat yang boleh tampil sebagai aktif.
  - Blueprint Explore/Tutorial versi 1.1 kini memiliki source migration `0039` yang belum diterapkan: Content Packet/family-edition, facet registry, relasi beralasan, claim→evidence ledger, profile safety/review R7, alias, dan kategori koreksi baru. Lifecycle `articles` lama tidak diganti; policy server/workflow Owner dan migration database masih langkah berikutnya.
- `../Madevi-Online-Plan/` kini menjadi ruang dokumentasi masa depan yang terpisah untuk arsitektur online, auth, API publik, hardening, data, operasi, migrasi, dan readiness. Ia bukan control plane, bukan source/runtime, dan tidak mengubah larangan API online pada tahap lokal-Termux.
- Tahap aktif: D02/D03/D04 + D10/D11; prioritas lanjut: policy server/workflow Owner untuk `0039` dan safety/review R7, paket R1/R2/R7 multi-root, perluasan content Explore yang disetujui Admin, penyelarasan visual tujuh ruang pada breakpoint nyata setelah diizinkan, lalu audit D07/D11 state dan permission dari profil/Admin.
- Cara jalan: `node scripts/postgres-termux.mjs status|start`, `node scripts/migrate.mjs status|up`,
  `node scripts/taxonomy-import.mjs status|preview|stage|promote|export`, dev `npm run dev` (jangan dipakai pada siklus ini tanpa perubahan arahan Admin).
- Batas: kredensial/produksi/publikasi nyata tetap butuh jalur Admin (MASTER §3.2).
- 14 Okt 2026: INOVASI-0841 + INOVASI-0940 selesai (4 fitur, INDEX 10.1–10.4).
  Zona Tenang (mode baca anti-engagement), Peta Kebaikan (kontra-narasi
  per kota), Dongeng Bareng (cerita bersambung + vote + kanonisasi
  mingguan), Bundel Ongkir Tetangga (patungan ongkir sekota). Migrasi
  0042 (kindness + story) dan 0043 (shipping bundle) ditulis, menunggu
  dijalankan. Verifikasi: tsc EXIT 0, 169/169 unit test lulus,
  7/7 render test CalmPostCard. Ditunggu Muse: migrate 0041 + 0042 + 0043,
  lalu verifikasi runtime alur Peta Kebaikan + Dongeng + Bundel.

- 14 Okt 2026: INOVASI-1045 + INOVASI-1145 + INOVASI-1245 selesai (6 fitur,
  INDEX 10.5–10.10). Giliran Dengar (sesi curhat giliran, SARAN dibuka
  pembicara), Duel Produk (komparasi pro/kontra + vote beralasan), Sidang
  Warga (3 fase, voting anonim HMAC, kuorum 60%), Klinik Ide (kritik karya
  3 fase), Silsilah Karya (pohon remix + badge), Petisi Katalog (usulan
  produk afiliasi + vote). Migrasi 0044–0049 ditulis, menunggu dijalankan.
  Verifikasi: tsc EXIT 0, 197/197 unit test lulus (batch ini 32/32).
  Ditunggu Muse: migrate 0044–0049, lalu verifikasi runtime 6 fitur.

- 15 Okt 2026 (siklus 01:36 WIB): DESAIN TERKUNCI 20261015 diimplementasikan
  langsung — header (teks Madevi + search kapsul + toggle hamburger/X via
  event madevi:sidebar-state) dan sidebar baru (jam+tanggal+pengaturan,
  developer card, 3 sosmed kecil, Laporkan masalah, divider, 7 kolom ruang)
  di `src/styles/desain-terkunci.css`. Run paralel menyelesaikan
  DESAIN-V15-001 (10/10 fase) di staging yang sama; v15 mempertahankan
  implementasi ini dan memperluas header (logo per-huruf, dropdown profil +
  badge). Bug infinite loop SearchOverlay standalone diperbaiki
  (EMPTY_FILTER stabil). 4 test failure pre-existing diperbaiki. Verifikasi:
  tsc EXIT 0, 369/369 unit test lulus (5 skip). DB: 49/49 migrasi, rev#1
  ACTIVE 16 node, 3 artikel PUBLISHED (verifikasi sebelum VM reset).
  Keterbatasan: VM reset menghapus PostgreSQL sistem; smoke dev server dan
  db-dump FRESH tertunda ke siklus berikut. Detail:
  `../PERBAIKAN-20261015-0600.md`.
