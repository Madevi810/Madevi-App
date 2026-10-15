# CHANGELOG

## 2026-09-26 — Prototipe terisolasi dan perbaikan CLI diizinkan

- AGENTS root/kontrol, README, buku panduan, GUARDRAIL, dan WORKFLOW kini mengizinkan
  eksperimen kecil di direktori sementara serta perbaikan lingkungan CLI yang terarah.
- Batas test/build/server aplikasi tetap berlaku. Tidak ada prototipe atau perbaikan
  lingkungan yang dijalankan; source aplikasi dan status item aktif tidak berubah.

## 2026-09-26 — Izin terarah untuk alat kerja AI/Agent

- AGENTS root/kontrol, README, buku panduan, GUARDRAIL, dan WORKFLOW kini mengizinkan
  pemasangan alat CLI yang benar-benar diperlukan secara otomatis dengan pemeriksaan
  sumber, versi, lisensi, kompatibilitas, serta catatan instalasi.
- Larangan npm lama disesuaikan hanya untuk pemasangan alat kerja; dependency runtime
  aplikasi dan operasi lain tetap mengikuti item/guardrail. Tidak ada alat yang dipasang
  atau source aplikasi yang diubah pada pembaruan aturan ini.

## 2026-09-26 — Buku panduan dan aturan disiplin agent

- `Madevi/BUKU-PANDUAN-KELANJUTAN.md` dibuat dari saran kesiapan pindah alat/langganan;
  README dan CONTROL-INDEX menautkannya.
- AGENTS root/kontrol, GUARDRAIL, dan WORKFLOW menegaskan sumber tugas, bukti masalah,
  batas pekerjaan, usul backlog, serta larangan pekerjaan acak/klaim tanpa verifikasi.
- Tidak ada source aplikasi, status item aktif, database, atau proses runtime yang diubah.

## 2026-09-26 — Aturan pemindaian dan proses akhir kerja

- README/AGENTS root dan AGENTS/GUARDRAIL/WORKFLOW kontrol kini mengarahkan pencarian
  terfokus, melewati dependency/cache/output generasi secara default, dengan pengecualian
  terarah bila diperlukan.
- Penutupan kerja melarang task manager/job background yang tidak perlu, kecuali jalur
  Agent 1 Perencanaan sesuai runner aktif. Tidak ada source aplikasi atau runtime yang diubah.

## 2026-09-26 — README root untuk AI CLI/Agent

- `Madevi/README.md` menjelaskan tujuan, lokasi kanonis, urutan baca, kelanjutan checkpoint,
  dan perintah jeda/lanjut Owner/Admin. `Madevi/AGENTS.md` mengarahkan agent ke README.
- Aturan AGENTS dan WORKFLOW kontrol diselaraskan; keputusan serta checkpoint dicatat.
- Tidak ada source aplikasi, item aktif, atau proses runtime yang diubah.

## 2026-09-26 — Aturan perencanaan kontinu dan kelanjutan lima peran

- AGENTS, guardrail, control plane, workflow, peran Agent 1/5, master scope, INDEX, dan
  indeks kontrol diselaraskan dengan mandat Owner terbaru.
- Jalur Agent 1 boleh meneliti dan menulis usul blueprint di latar belakang saat runner
  tersedia; Agent 2–5 melanjutkan item siap dari checkpoint ke audit/revisi/kontrol.
- Luas sumber riset disertai catatan provenance dan verifikasi. Tidak ada proses latar belakang
  atau source aplikasi yang dijalankan/diubah dalam pekerjaan aturan ini.

## 2026-09-26 — Rencana kontrol diringkas per bidang

- Roadmap berlapis P0–P9 diganti lima rencana bidang dengan hasil dan batas pemeriksaan.
- Backlog dibersihkan dari proposal yang sudah dipromosikan serta riwayat pekerjaan selesai;
  dua kandidat yang belum ditriase tetap dicatat.
- Aturan Agent 1, INDEX, workflow, control plane, dan master scope diselaraskan agar pekerjaan
  terkait berada dalam satu cakupan, dengan pemisahan hanya bila batas nyata menuntutnya.
- Arsip QA dan status item aktif tidak diubah. Tidak ada pemeriksaan runtime atau aplikasi.

## 2026-09-26 — UX-REDESIGN-002: Fieldbook, Night Ledger, dan Signal Atlas (`DESAIN`)

- **Sistem tiga tema:** cascade akhir `src/styles/atlas-redesign.css` membedakan Fieldbook
  (kertas editorial hangat), Night Ledger (grafit data-padat), dan Signal Atlas (plum, amethyst,
  amber). Token surface, border, radius, tipografi, serta ritme motion masing-masing berbeda.
- **Header kinetik:** `MADEVI` memakai enam span huruf dengan entrance berbasis font,
  bolt SVG biru-kuning, dan pulse acak 9,5–15,5 detik hanya pada Madevi On publik non-baca.
  Lebar lockup tetap dialokasikan sehingga action header tidak terdorong.
- **Ambient terarah:** PublicShell menambah peta SVG tujuh ruang, grid, scan, dan meteor acak
  sebagai overlay belakang tanpa pointer. Efek bergerak hanya pada Beranda/landing ruang
  kanonis Madevi On; artikel menghentikannya dan Owner/Admin berada di luar shell ini.
- **Aksesibilitas dan kontrak:** semua motion memiliki fallback final dan berhenti pada
  `prefers-reduced-motion`; kartu/tombol tidak menerima hover transform generik. Struktur,
  label, href, grouping, dan expand/collapse sidebar tidak disentuh. Route, API, auth, data,
  dan migration tidak berubah.
- **Aset dan perapian:** Space Grotesk serta Instrument Serif dilayani lokal dengan atribusi
  OFL di `public/fonts/README.md`. `header-fx.css` yang tidak lagi diimpor dan masih memuat font
  remote dihapus.
- **Verifikasi statis Agent 2:** parser TSX 4/4, balance stylesheet, pencarian import font
  remote/header-fx, dan hitung tujuh node atlas lulus. Tidak ada server, npm, lint, build, test,
  browser, database, atau request API dijalankan. Item tetap `PROSES` sampai audit independen.
- **Revisi Owner:** menghapus `// ATLAS` dan kartu dekoratif hero berhuruf M. Cascade akhir
  menonaktifkan pseudo-text `Madevi` warisan serta glass header agar tidak menumpuk; header kini
  opak. Tiga blob aurora On bergerak dengan transform/opacity terpisah, dan entrance hero/wordmark
  memakai motion CSS yang tersedia tanpa menunggu JavaScript.
- **Revisi header dan Dark:** header publik kini sticky pada `top:0`, z-index 700, lebar penuh,
  dan overflow terbuka bagi SVG Kinetic Bolt. Siklus pulse On dipercepat menjadi 4,5–7 detik dan
  enam huruf berangkat dari posisi/urutan berbeda sebelum membentuk `MADEVI`. Night Ledger beralih
  dari aksen hijau-tosca ke palet grafit abu-perak; Fieldbook tetap hijau-petrol.

## 2026-09-25 — AMBIENT-001: lapisan ambient Madevi On mengacu gamenative.app (`DESAIN`)

- **Arah:** gamenative.app (ambient glow, parallax, fading grid, glass) diadaptasikan ke Madevi
  On sesuai D07 — bukan disalin mentah. Light/Dark tetap tema kerja netral dan tidak disentuh.
- **Ambient glow blobs:** tiga elemen HTML lingkaran `aria-hidden` di `.madevi-sky`
  (`public-shell.tsx`): `--amethyst`, `--ember`, `--plum`; masing-masing `filter: blur(120px)`,
  `pointer-events: none`, `will-change: transform`, animasi drift 34–47s (transform saja).
- **Parallax scroll:** satu scroll listener pasif throttled `requestAnimationFrame` memperbarui
  custom property `--madevi-sky-parallax` pada `documentElement`; setiap blob memakai
  `translate3d(0, calc(var(--madevi-sky-parallax) * <faktor>), 0)` dengan faktor unik
  (0.18 / 0.30 / 0.12). Berhenti pada `prefers-reduced-motion`, `document.hidden`, dan route
  `/artikel/*` (`paused`); cleanup melepas listener dan properti.
- **Fading grid:** satu lapisan CSS `.madevi-sky__grid` — dua `linear-gradient` 56px tipis +
  `mask-image: radial-gradient(ellipse 78% 62% at 50% 34%, black 40%, transparent 100%)`.
- **Geser aksen D07:** token kanonis Madevi On dipindahkan ke satu blok di akhir
  `interface-refresh.css` — `--accent: #a487ff`, `--accent-strong: #ece4ff`,
  `--accent-hover: #c3adff`, `--focus-ring: #ffd29b`, background `#0b0910` (plum-hitam).
  Gradient scan/sidebar-signal/beacon tombol/orb/button amethyst-amber. Kontras pasangan utama
  7.06–18.77:1 (semua ≥ 4.5:1).
- **Konsolidasi cascade:** audit menemukan aturan Madevi On tersebar di ≥5 generasi yang saling
  menimpa (tiga blok token + "TOTAL REDESIGN" kartu opaque). Token kanonis kini satu blok di
  akhir `interface-refresh.css`; blok kalah-cascade di `madevi-on.css` ditandai sebagai
  fallback agar tidak menyesatkan.
- **Glass tipis + glow-on-hover:** chrome (header/sidebar/dialog) dan kartu non-bacaan dapat
  blur 14–20px + glow amethyst saat hover; `.article-card` eksplisit opaque dan
  `backdrop-filter: none` (D08).
- **Tidak diubah:** route, API, data, auth/CSRF, migration, token Light/Dark, struktur
  sidebar/header, kontrak `home-content.tsx`, komponen artikel.
- **Verifikasi statis (guardrail):** `transpileModule` `public-shell.tsx` 0 diagnostic;
  keseimbangan brace `madevi-on.css` 71/71 + `interface-refresh.css` 853/853; audit z-index
  dan pointer-events; hitung rasio kontras. Audit: `blueprint/qa/audits/AMBIENT-001.md`
  (6/6 AC wajib, 5/5 M, 0 critical/high). Runtime/visual `BELUM-DIVERIFIKASI`.

## 2026-09-25 — ROUTE-FIX-001: audit lulus, satu perbaikan saat audit, satu bug dipromosikan (`PERBAIKAN-BUG`)

- **Status:** PASS (audit 5/5 AC + 5/5 M; lihat `blueprint/qa/audits/ROUTE-FIX-001.md`).
- **Perbaikan saat audit:** `src/app/admin/layout.tsx` masih merender `AdminShell` meskipun
  komentarnya menyatakan tidak, sehingga menu `/admin/*` yang 404 dapat tampil jika request
  lolos redirect. Layout kini hanya merender `children`; import `AdminShell` dihapus. Parser TS
  0 error.
- **Bug dipromosikan ke INDEX 8.3 `JASA-API-001` (BELUM):** `owner-jasa-panel.tsx` memanggil
  `GET /api/v1/admin/jasa/orders?kind=UNDANGAN|LOGO|SERVICE` untuk tiga daftar, tetapi route
  list tersebut tidak ada — hanya `/jasa/queue` (dengan param berbeda) dan
  `/jasa/orders/[id]/*`. Daftar diam-diam gagal (error ditelan → array kosong).
- **Verifikasi:** bukti runtime pra-guardril di `memory/TEST-REPORT.md` (`tsc` EXIT 0,
  `prompt-l07` 6/6, curl smoke 307/200/404) + verifikasi statis sesudahnya.

## 2026-09-25 — JASA-API-001: route list order Jasa yang hilang (`PERBAIKAN-BUG`)

- **Bug:** panel Owner Jasa memanggil `GET /api/v1/admin/jasa/orders?kind=UNDANGAN|LOGO|SERVICE`
  untuk tiga daftar, tetapi route list tersebut **tidak ada** (hanya `/jasa/queue` dan
  `/jasa/orders/[id]/*`). Akibatnya ketiga daftar selalu memuat array kosong dan error ditelan
  (`catch { setInvitations([]) }`) — panel menampilkan keadaan kosong yang menyesatkan.
- **Fix:** route baru `src/app/api/v1/admin/jasa/orders/route.ts` memetakan kind ke method
  service yang sudah ada (`listAllInvitationOrders` / `listAllLogoOrders` /
  `listAllServiceOrders`); kind tidak dikenal → `ApiError('VALIDATION_FAILED', …)` → 400.
  Panel: `!r.ok || !Array.isArray(j.data)` melempar; state `ordersLoadError` bilingual
  ditampilkan dengan `role="alert"`.
- **Tidak diubah:** service layer, schema, migration, auth/CSRF, route publik, tema.
- **Verifikasi statis:** parser TS 0 error untuk route, panel, dan `admin/layout.tsx`; audit
  endpoint existence, mapping kind, dan auth. Audit: `blueprint/qa/audits/JASA-API-001.md`
  (5/5 AC, 4/4 M). Runtime `BELUM-DIVERIFIKASI`.

## 2026-09-25 — ROUTE-FIX-001: route /admin buntu, lokasi paket taxonomy, assertion kontrak desain (`PERBAIKAN-BUG`, `REFACTOR`)

- **Route `/admin` buntu (D03):** audit source menemukan `/admin` hanya memiliki layout + page
  yang me-redirect ke `/admin/operasi` — route yang **tidak ada**. Semua 19 halaman Admin nyata
  berada di `/owner/*`; sidebar `AdminShell` (16 item) dan 7 href capability di
  `AdminService.getCapabilities()` menunjuk `/admin/*` yang 404. Sesuai urutan kebenaran
  (perilaku source di atas rencana lama), `/admin` kini alias pengalihan ke `/owner` kanonis.
  - `next.config.ts`: `redirects()` `/admin` → `/owner` dan `/admin/:path*` → `/owner/:path*`
    (`permanent:false`, deep link lama pulih, bukan 404).
  - `src/app/admin/page.tsx`: redirect fallback ke `/owner` (bukan `/admin/operasi`).
  - `src/services/admin.ts`: 7 href capability `/admin/*` → `/owner/*` agar dashboard
    hanya menunjuk route nyata (5 href antrean prioritas sudah `/owner/*` sebelumnya).
  - `src/app/admin/layout.tsx` + `src/components/admin-shell.tsx`: penanda jelas bahwa
    surface Admin kanonis adalah `/owner/*`; AdminShell tidak lagi dirender.
  - **Verifikasi:** sebelum guardrail Owner diketahui, dev server lokal + curl membuktikan
    `/admin` → 307 `/owner`, `/admin/operasi` → 307 `/owner/operasi`, `/admin/pengguna` → 307
    `/owner/pengguna`, `/owner` → 200, route tak dikenal → 404. Setelah guardrail diketahui,
    server dihentikan dan verifikasi beralih ke statis.
- **Lokasi paket taxonomy kanonis (D02):** `Menu/Export/menu-pilot-explore-release-v1.json`
  di luar proyek sudah tidak ada (folder kontrol direstrukturisasi). STATE mencatat paket
  dipindahkan ke `content-local/packages/taxonomy/`. Test dipindahkan ke path kanonis baru:
  `tests/unit/taxonomy-source.test.ts` dan `tests/integration/prompt05-package.test.ts`
  sekarang membaca `content-local/packages/taxonomy/madevi-explore-pilot-v1.json` (16 node,
  byte-identik dengan arsip lama). Komentar `taxonomy-source.mjs` dan hint error
  `taxonomy-import.mjs` disesuaikan. Ini memulihkan 3 kegagalan unit taxonomy-source.
- **Assertion kontrak desain usai redesign (D04):** 5 kegagalan `prompt03.test.ts` dipetakan
  statis; semuanya nilai kontrak lama yang sengaja diganti `UX-REDESIGN-001` (audited PASS),
  bukan regresi produk. Assertion diperbarui ke kontrak baru (tidak dihapus, sesuai MASTER §4):
  - F03-04: placeholder "On Style" di tokens.css → tema terdaftar sebagai
    `[data-theme='madevi-on']` di `madevi-on.css`.
  - F03-07: `--content-width` kini `min(100% - 2rem, 72rem)`; `--content-gap` kini
    `clamp(1rem, 3vw, 1.5rem)`.
  - F03-10: popup AI bukan lagi placeholder "belum aktif" (mock adapter dihapus); kini
    memberi sinyal kesiapan "Sumber lokal".
  - F03-11: footer copyright tahun → tagline produk "Pengetahuan dan tindakan".
- **Verifikasi statis (guardrail Owner: tanpa npm/lint/build/test/server):** transpile parser
  TypeScript (`transpileModule`, 0 diagnostic) untuk 8 file berubah; verifikasi grep untuk
  setiap target assertion; sisa link `/admin` hanya di `admin-shell.tsx` yang kini tidak
  dapat dicapai. Runtime sesudah guardril: `BELUM-DIVERIFIKASI`.

## 2026-09-25 — Blueprint produk web dan mandat Agent Perencana

- `PERENCANAAN`: Menambah peta induk produk, inventaris isi seluruh route halaman, dan
  roadmap/dependency di `blueprint/produk/` sebagai arah pembangunan tujuh ruang, halaman
  pendukung, akun, serta Owner/Admin. Spesifikasi rinci mencakup 35 halaman publik/akun,
  20 halaman Owner/Admin, dan unit isi/data per ruang beserta gate penerbitannya.
- `AGEN-1`: Memperjelas loop bukti→gap→dependency→proposal backlog, format handoff, dan batas
  kewenangan tanpa mengubah control plane atau status item aktif.
- `BATAS`: Berdasarkan pemeriksaan statis; tidak ada perubahan source, database, runtime,
  migrasi, server, npm, lint, build, atau test. Konflik draft backend online ditandai sebagai
  keputusan yang menunggu tahap online.

## 2026-09-25 — UX-REDESIGN-001: pemulihan CSS setelah disconnect

- `PERBAIKAN-MOTION`: Nama keyframe sinyal sidebar dipisahkan dari rail menu
  aktif sehingga animasi tepi sidebar tidak ditimpa oleh deklarasi terakhir.
- `PERBAIKAN-AKSESIBILITAS`: Selector pseudo-element yang tidak sah di dalam
  `:is()` diperbaiki pada aturan reduced-motion dan mode baca. Pada route
  artikel, animasi header, sidebar, menu aktif, dan Asisten berhenti; meteor
  tetap disembunyikan.
- `REDESIGN-LANJUTAN`: Entrance Basic 300 ms menjangkau section utama ruang
  publik; CSS entrance lama tidak berjalan ganda. Fase awal meteor acak per
  jalur. Madevi On memakai indeks tujuh ruang asimetris yang reflow menjadi
  satu kolom pada tablet/ponsel, hero art dan jalur cepat opak tanpa glass,
  serta rule heading yang menyatukan halaman kerja. Label jalur cepat boleh
  membungkus sehingga tidak terpotong pada 320–375 px.
- `PERFORMA-MOBILE`: Starfield SVG mempertahankan lingkaran pada rasio layar
  berbeda dan tidak lagi memberi filter glow pada setiap titik.
- `PERBAIKAN-PERMUKAAN`: Deklarasi glass lama pada kartu taxonomy, katalog,
  panel Tools/Services, header fitur/artikel, serta input ditimpa dengan bidang
  opak. Blur tetap berada pada chrome dan overlay sementara; tombol ghost
  mempertahankan latar transparan tanpa blur.
- `VERIFIKASI-STATIS`: Empat sheet CSS lulus parser PostCSS dan tiga komponen
  publik TSX lulus parser transpile. Tidak ada npm, lint, test runner, build,
  server, browser, database, atau request API. Audit terpisah dan visual/runtime
  masih `BELUM-DIVERIFIKASI`.

## 2026-09-25 — UX-001-REV1: umpan balik global tanpa pergeseran

- `PERBAIKAN-DESAIN`: Seluruh kelompok selector kartu dan permukaan kerja generik
  di `redesign.css` dan `interface-refresh.css` tidak lagi memakai
  `translateY` atau `will-change: transform`. Umpan balik hover tetap berupa
  border/shadow sehingga posisi konten, workspace, dan fokus tidak berpindah.
- `PERBAIKAN-AKSESIBILITAS`: State keyboard `:focus-visible` untuk field pada
  stylesheet terakhir kini memakai outline `3px`; state `:focus` pointer pada
  global polish dibatasi dengan `:not(:focus-visible)` sehingga tidak dapat
  menimpa indikator keyboard.
- `PERBAIKAN-DARK`: Token Dark kini membedakan background, surface, card, dan
  hover dalam rentang hitam/abu netral; teks/aksi memakai off-white/silver
  yang dapat dibaca tanpa menjadi bidang putih. Pratinjau Karier, notice
  artikel, badge, tab aktif, input, dan kartu Home mengikuti cascade Dark.
- `PERBAIKAN-NAVIGASI`: Beranda kini memusatkan tujuh ruang aktif dalam menu
  **Kebutuhan ruang** yang besar. Setiap pilihan menyatakan kebutuhan dan
  rencana langkah berikutnya secara jujur lalu memakai `space.href` dari
  kontrak kanonis; sidebar menggunakan istilah yang sama.
- `PERBAIKAN-BASIC`: Light dan Dark kini mengembalikan warna setiap ruang pada
  bingkai tipis, rule sisi, ikon, dan state navigator kontekstual. Kanvas dan
  teks utama tetap netral; tidak ada gradien dekoratif massal atau perubahan
  pada Madevi On.
- `PERBAIKAN-BASIC-GLOBAL`: Variasi warna Basic sekarang juga menjangkau chrome
  dan navigasi (biru), perimeter panel (teal atau warna ruang), kontrol/fokus
  (violet), data/tabel (amber), serta notice status semantik. Peran disimpan
  sebagai 5 token Light/Dark dan tidak mengubah surface baca atau Madevi On.
- `PERBAIKAN-LAYERED-EDITORIAL`: Basic Light/Dark kini memakai teal sebagai
  identitas di atas kanvas hangat/charcoal bertingkat. Hero Home versi
  sebelumnya dipulihkan: judul, deskripsi, autentikasi, tautan kebutuhan ruang,
  visual Hero, dan jalur cepat kanonis. **Kebutuhan ruang** mengikutinya sebagai
  H2. Konstelasi kini On-only sehingga SVG dekoratif tidak lagi membentuk baris
  kosong pada Basic. Tiga ruang awal tetap berbeda ukuran dan bacaan tetap
  daftar editorial. Basic hanya menganimasikan orientasi Home dan feedback
  baca; On memusatkan signal pada header, menu aktif, CTA, dan Asisten.
- `BATAS-SCOPE`: Route, API, data, kontrak ruang, dan JavaScript tidak diubah.
  Motion/efek Asisten dan Madevi On hanya diubah pada selector signal yang
  eksplisit; article, form, tabel, serta dashboard tidak menerima ambience baru.
- `VERIFIKASI-STATIS-SEBAGIAN`: Keseimbangan brace CSS lulus (`tokens` 2/2,
  `globals` 1087/1087, `redesign` 1620/1620, `interface-refresh` 693/693);
  parser TypeScript untuk Beranda/Owner Console lulus, Hero lengkap dipulihkan,
  konstelasi Basic tersembunyi, pemetaan kebutuhan 7/7 memakai `space.href`,
  dan pasangan teks/aksi utama Light/Dark berada pada
  4.74:1–16.53:1 terhadap surface.
  Tidak ada npm, lint, build, test, server, browser, database, atau request API
  dijalankan. Item tetap `PROSES` sampai audit terpisah selesai.

## 2026-09-25 — ADMIN-001-REV1: kejujuran state operasi dan navigasi Admin

- `PERBAIKAN-STATE`: Dashboard Admin membedakan HTTP 401 (sesi perlu masuk ulang),
  403 (akses Admin tidak diizinkan), serta respons jaringan/server/data yang gagal.
  Kegagalan layanan kini menampilkan pesan `role=alert` dan aksi Coba lagi, bukan
  menyamar sebagai sesi yang kedaluwarsa.
- `PERBAIKAN-NAVIGASI`: Menghapus empat fragmen pengguna tanpa target dari menu
  dashboard, sidebar, dan antrean prioritas; rute `/owner/pengguna` tetap menjadi
  tujuan generik yang benar.
- `VERIFIKASI-STATIS-SEBAGIAN`: Parser TypeScript untuk tiga file yang diubah lulus;
  pencarian source tidak menemukan lagi `/owner/pengguna#banding` atau
  `/owner/pengguna#recovery`. Tidak ada server, request API, database, npm, lint,
  build, atau test dijalankan. Item tetap `PROSES` sampai audit terpisah selesai.

## 2026-09-24 — CTRL-5A-001: control-plane 5-Agent

- `PENGEMBANGAN-KONTROL`: blueprint aktif kini memiliki INDEX status tunggal, GUARDRAIL,
  role card Planner → Execution → Audit → Audit-Revisi serta Control, workflow lock/retry/
  checkpoint, dan acceptance register yang dapat diaudit.
- `MIGRASI-ARSIP`: blueprint desain, konten, taxonomy, tools, safety, release, dan backlog
  lama dipetakan ke struktur baru tanpa menghapus memori sumber. Protokol single-agent yang
  fungsinya telah digantikan, termasuk roadmap status paralel, dihapus agar tidak menghasilkan
  aturan ganda.
- `VERIFIKASI-STATIS`: hanya pemeriksaan struktur dan tautan dokumentasi dilakukan. Tidak ada
  source aplikasi, runtime, database, npm, lint, test, build, server, atau request API dijalankan.

## 2026-09-24 — D09: motion lintas tema, Madevi wordmark, dan perbaikan search
- `PERBAIKAN-MOTION` : GSAP kembali untuk route umum: arrival singkat pada hero dan reveal
  scroll 14px/360ms bagi target yang masih di bawah viewport. Trigger boleh reverse di section
  umum; `/artikel/*` tidak menjalankan motion konten dan page-entry CSS juga dimatikan.
- `PERBAIKAN-BRAND` : Nama header kembali tepat `MADEVI`; tiap huruf mendapat turn lambat dan
  sweep kilat biru-kuning CSS, berlaku di seluruh tema dan berhenti pada reduced-motion.
- `PERBAIKAN-LAYOUT` : filter Shop menjadi grid responsif; menu sort align sisi aman serta
  dibatasi viewport. Search mode berada di atas sidebar, sedangkan filter dan hasil kecil dapat
  reflow tanpa saling menutup.
- `PERBAIKAN-TEMA` : Light/Dark memakai token putih/hitam monokrom; palet kosmik hanya untuk
  Madevi On. Parser 7 TS/TSX dan PostCSS dua sheet lulus; tidak ada runtime dijalankan.

## 2026-09-24 — D08: Madevi On yang aktif tanpa mengganggu baca
- `PERBAIKAN-MOTION` : Menghapus seluruh entrance/reveal JavaScript untuk teks, kartu, dan
  scroll. Konten sekarang hadir final sejak first paint dan tidak mundur/hilang ketika pembaca
  kembali scroll. `MotionOrchestrator` dipertahankan sebagai boundary terdokumentasi tanpa
  koreografi konten; atmosfer memakai CSS yang tunduk pada reduced-motion.
- `PERBAIKAN-ATMOSFER` : `MadeviSky` diberi starfield lebih rapat, stacking layer di depan
  background tetapi di belakang shell, dan fase tiga meteor yang terlihat sejak kunjungan awal.
  Palet tetap plum/amber, tanpa wash biru.
- `PENGEMBANGAN-CHROME` : Sidebar, header, popup Asisten/pengaturan/navigator, serta pencarian
  memakai kaca semi-transparan berlapis. Kolom artikel sengaja tidak: ia tidak bergerak dan
  memakai surface padat untuk long-form reading. Wordmark menjadi `MADEVI/ON`; ikon Asisten
  berubah dari orb-plus generik menjadi bubble beacon bintang milik Madevi.
- `VERIFIKASI-STATIS` : inspeksi source untuk transform/reveal konten, markup SVG, dan cascade
  akhir dilakukan. Tidak ada npm, lint, test, build, server, browser, database, atau request API.

## 2026-09-24 — D07: perbaikan komposisi dan meteor Madevi On
- `PERBAIKAN-LAYOUT` : Mengecilkan tinggi hero, amplitudo entry, title scale, medan konstelasi,
  dan blur. Breakpoint 960 px mengubah hero menjadi satu kolom sebelum artwork dan copy dapat
  saling bertumpuk.
- `PERBAIKAN-MOTION` : ScrollTrigger tidak lagi scrub/rotate/filter pada 18 target. Ia hanya
  menjalankan reveal pendek pada maksimal 12 elemen bertanda; Anime word split juga memakai blur
  dan jarak yang lebih sempit.
- `PENGEMBANGAN-TEMA` : Palet Madevi On menjadi black/plum + amethyst/amber. Starfield SVG dan
  tiga meteor kecil dipasang pada `PublicShell`; Home hanya mempertahankan constellation map
  konteksnya sendiri. Kartu reguler dibuat opaque agar tidak saling menembus/menumpuk.
- `VERIFIKASI-STATIS` : Parser TypeScript/TSX lima file, keseimbangan CSS, dan shell SVG lulus.
  Tidak ada npm, lint, test, build, server, browser, database, atau request API.

## 2026-09-24 — D06: Madevi On constellation experience
- `PENGEMBANGAN-IDENTITAS` : Emblem Madevi menjadi monogram M orbital dengan lintasan
  konstelasi; hero memakai versi SVG yang konsisten dengan peta ruang, bukan aset stok.
- `PENGEMBANGAN-DESAIN` : Light/Dark tidak menerima atmosfer besar. Khusus Madevi On, layer
  terakhir memberi nebula transparent indigo/violet/cyan/coral, wordmark blur-exit, map SVG,
  panel transparan, dan kartu yang mengambil hue dari ruang nyata, tanpa metrik/badge/menu
  buatan.
- `PENGEMBANGAN-MOTION` : GSAP dengan ScrollTrigger menyusun elemen hero dari posisi tersebar
  kemudian mengungkap heading/kartu bertanda pada scroll. Anime.js v4 memakai `splitText` yang
  aksesibel untuk kata heading blur→focus dan menjaga orbit mark; cleanup route mengembalikan
  split node, transform, serta trigger.
- `VERIFIKASI-STATIS` : Parser TypeScript/TSX lima file, keseimbangan brace CSS, dan shell SVG
  lulus. Tidak ada npm, lint, test, build, server, browser, database, atau request API.

## 2026-09-24 — D05: Madevi sebagai direktori kerja, bukan template visual
- `PENGEMBANGAN-DESAIN` : Home memakai monogram Madevi dan tiga tautan ruang nyata sebagai
  entry point; copy menerangkan tindakan dan batas yang benar-benar tersedia, bukan slogan
  umum. Ruang inti dan artikel dikelompokkan sebagai direktori bergaris, bukan field kartu
  mengambang.
- `PENGURANGAN-GENERIK` : Cascade akhir mencabut shine tombol, hover-lift promosi, wash warna,
  gradient dan glass dekoratif pada halaman publik. Header/pembuka memakai satu ritme editorial;
  katalog, sosial, dan learning mengelompokkan pilihan setara dalam satu boundary.
- `PENGEMBANGAN-TEMA` : Madevi On berubah menjadi ink black/navy opaque dengan satu sinyal aksi
  cyan. Gerak dipertahankan hanya untuk entry GSAP yang singkat dan drift monogram Anime.js.
- `VERIFIKASI-STATIS` : Parser TypeScript/TSX lima file serta keseimbangan brace
  `interface-refresh.css` lulus. Tidak ada npm, lint, test, build, server, browser, database,
  atau request API yang dijalankan.

## 2026-09-24 — Fondasi Content Packet, discovery, dan safety Tutorial
- `PENGEMBANGAN-SCHEMA-PENDING` : Menambah source migration `0039` untuk content family dan
  packet per artikel/edisi, facet terkelola, relasi beralasan, alias, claim→evidence ledger,
  profile safety `GENERAL`/`CONTROLLED`/`STOP`, review record, serta kategori koreksi
  `SAFETY`/`RIGHTS`/`DISCOVERY`.
- `KOMPATIBILITAS` : Lifecycle `articles` dan artikel lama tidak berubah; packet menjadi lapisan
  metadata tambahan yang akan dipakai gate server sesudah migration disetujui.
- `PERBAIKAN-INTEGRITAS` : Mengubah source migration `0037` yang belum diterapkan menjadi no-op
  agar tidak lagi menyemai katalog dan tautan mitra yang belum terverifikasi sebagai `PUBLISHED`.
- `VERIFIKASI-STATIS` : Registry migrasi mengenali pasangan `0039` up/down dan seluruh struktur
  yang direncanakan; tidak ada database, migration, npm, lint, test, build, server, atau request
  API yang dijalankan.

## 2026-09-24 — Pemulihan dependency Next yang terputus
- `PERBAIKAN-DEPENDENSI` : Memulihkan 14 folder reify tersembunyi menjadi package kanonis,
  termasuk `baseline-browser-mapping`, `browserslist`, `update-browserslist-db`, `acorn`,
  `semver`, `prettier`, dan `@babel/parser`. Ini menutup error Next
  `Cannot find module 'baseline-browser-mapping'` tanpa mengubah source aplikasi atau versi lock.
- `VERIFIKASI-STATIS` : Package manifest ketiganya sesuai lock dan loader supported-browser
  milik Next berhasil di-require. Dev server/build tidak dijalankan.

## 2026-09-24 — Recovery source-map Next dan dependency ikon
- `PERBAIKAN-DEPENDENSI` : Memulihkan `source-map08/mappings.wasm` dari tarball `next@16.3.4`
  yang dikunci, menutup error invalid source map saat Next membentuk stack trace.
- `PENGURANGAN-DEPENDENSI` : Menghapus `lucide-react` yang tidak tersalin utuh pada filesystem
  Android dan mengganti tiga ikon yang dipakai dengan SVG lokal semantik pada Home/login Admin.
- `VERIFIKASI-RUNTIME-RINGAN` : Loader Next/dependency UI resolve dan beranda dev server menjawab
  HTTP 200 tanpa referensi error `lucide-react`, `mappings.wasm`, atau module-not-found.

## 2026-09-24 — Komponen shadcn-style dan motion publik terarah
- `PENGEMBANGAN-KOMPONEN` : Menambahkan primitive lokal `Button`/`Card` berbasis Radix Slot,
  CVA, dan `cn`, lalu menerapkannya pada Home, autentikasi, pemulihan akun, serta login Admin.
  Ikon CTA dan login memakai SVG lokal.
- `PENGEMBANGAN-MOTION` : Menambah `MotionOrchestrator`: GSAP mengatur entry hero, kartu, dan
  reveal secara client-only dengan `gsap.context()`/cleanup saat berpindah route; Anime.js hanya
  menangani drift mikro pada mark hero. `PublicShell` mencakup halaman publik lain secara
  selektif dan scope bertingkat tidak dianimasikan ganda.
- `PENGEMBANGAN-DESAIN` : Finishing layer sekarang mencakup kartu katalog/belajar/sosial/profil/
  layanan/tools, kapsul pilihan, fokus form, serta variant Button/Card. Madevi On memperoleh
  variant glass berwarna yang tetap dibatasi pada surface interaktif. Konsol Admin/Owner tidak
  ditambah motion agar tetap basic dan kerja-sentris.
- `DEPENDENSI` : Menambahkan `gsap`, `animejs`, Radix Slot, CVA, dan clsx pada
  manifest/lock (`npm install --package-lock-only --offline --ignore-scripts`).
- `VERIFIKASI-STATIS` : Transpile parser 10 file TS/TSX dan balance CSS lulus. Tidak ada lint,
  build, test, request API, migrasi, browser, atau server baru yang dijalankan.

## 2026-09-24 — Refresh antarmuka global: putih, pure dark, dan Madevi On frosted glass
- `PENGEMBANGAN-DESAIN` : Menambah `src/styles/interface-refresh.css` sebagai lapisan cascade
  terakhir. Ia menyatukan sistem elevasi/shadow, focus state, form, tombol, card, header,
  sidebar, Home, login, dan Admin tanpa mengganti route, API, data, atau aksi form.
- `PENGEMBANGAN-TEMA` : Light memakai background putih; Dark memakai black-on-black yang
  benar-benar gelap. Madevi On memperluas chrome dan panel kerja menjadi frosted glass black/navy
  dengan blur berlapis serta fallback opaque; surface bacaan tetap cukup solid untuk keterbacaan.
- `PENGEMBANGAN-MOTION` : Entry halaman/kartu, hover, press, dan perpindahan ikon menggunakan
  transform/opacity serta berhenti penuh pada `prefers-reduced-motion`.
- `PENGEMBANGAN-NAVIGASI` : Kelompok navigasi konsol Admin/Owner kini memiliki SVG semantik
  (ringkasan, pengguna, konten, sosial, sistem), tanpa menambah destinasi/menu baru.
- `VERIFIKASI-STATIS` : Transpile parser TypeScript untuk `layout.tsx`, `owner-shell.tsx`, dan
  `admin-shell.tsx` lulus; keseimbangan brace CSS lulus. Tidak ada npm, lint, test, build,
  server, browser, database, atau proses background yang dijalankan atas batas Owner.

## 2026-09-24 — S03 Payment dan Webhook (Integritas Lokal)
- `PENGEMBANGAN-IDENTITAS` : Mengganti nama `handleWebhookMock` menjadi `handleManualConfirmation`
  dan memindahkan route dari `webhook-mock` menjadi `manual-confirm`. Secret diubah menjadi
  `PAYMENT_MANUAL_CONFIRM_SECRET` dan header menjadi `x-madevi-manual-signature`.
- `RETIRE-SIMULASI` : Menghapus bahasa "simulasi chargeback" karena mekanisme tersebut 
  secara arsitektur benar-benar membekukan akun lokal yang disengketakan.

## 2026-09-24 — S04 Retensi Sosial (Integritas Lokal)
- `RETIRE-SIMULASI` : Mekanisme `purgeInactiveFixtureConversations` yang sebelumnya sekadar simulasi
  hanya membuang data fixture telah diubah menjadi `runRetentionPurge`, sebuah penerapan kebijakan 
  retensi yang riil (menghapus pesan inaktif > 12 bulan). Event audit juga disesuaikan.

## 2026-09-24 — S05 Fixture Konten (Integritas Lokal)
- `RETIRE-SIMULASI` : `ArticleEditor` diubah untuk bisa menerbitkan konten nyata, dengan checkbox `isTest` 
  alih-alih hardcode nilai fixture. Label form diubah agar tidak menyebut pembuatan artikel sebagai pembuatan 
  "fixture". Halaman statis kebijakan/informasi diperbarui agar tidak merujuk diri sebagai "sekadar simulasi".

## 2026-09-24 — S06 Tools, Scanner, Adapter Deferred (Integritas Lokal)
- `PENGEMBANGAN-IDENTITAS` : Menghapus ekspektasi simulasi dan deferred online dari `PaymentAdapter`, 
  `ProductSourceAdapter`, dan `ScannerAdapter`. Status mereka diset menjadi `NOT_IMPLEMENTED` 
  atau `REAL_LOCAL`. Antrean banding pengguna juga disesuaikan untuk menghapus label `SIMULASI` 
  dari subjek dan status pengembalian.



## 2026-09-24 — S01 OTP/verifikasi kontak lokal (keamanan)
- `RETIRE-SIMULASI` : Kode OTP tidak lagi dikembalikan ke response API browser untuk semua
  alur verifikasi (register, login MFA, aktifkan 2FA email, ganti kontak). `simulationDelivery`
  dan `MAILBOX_SIMULATION` dihapus dari `accounts.ts`, `auth-card.tsx`, dan `profile-dashboard.tsx`.
- `PENGEMBANGAN-KEAMANAN` : Kode OTP cleartext kini hanya ditulis ke `owner_inbox_items`
  (hanya bisa dibaca Owner melalui endpoint `listOwnerInbox` yang terotorisasi). Kode tetap
  disimpan sebagai `sha256(code)` di tabel verifikasi; verifikasi tetap memakai `constantTimeHashMatch`.
  Rate-limit 5 percobaan dan masa berlaku tetap berlaku server-side.
- `PENGEMBANGAN-UX` : UI verifikasi kini menampilkan instruksi "Kode ada di mailbox Owner lokal"
  sebagai pengganti kode yang tampil langsung; `CodeForm` tidak lagi menerima prop `simulationCode`.
- `PERUBAHAN-KONTRAK` : `transportMode` berubah dari `'MAILBOX_SIMULATION'` menjadi `'LOCAL_INBOX'`
  pada semua return service yang relevan. Type union login() diperbarui sesuai.
- `VERIFIKASI-STATIS` : grep tidak menemukan sisa `simulationDelivery`/`MAILBOX_SIMULATION` di
  seluruh `src/`; keseimbangan brace tiga file yang diubah tetap 0.
- `BELUM-DIVERIFIKASI-RUNTIME` : npm, lint, test, build, server, database tidak dijalankan
  sesuai batas operasi Owner.

## 2026-09-24 — S02 Feedback publik dan outbox Owner (integritas)
- `RETIRE-SIMULASI` : `PublicFeedbackService` tidak lagi mencari `fixtureOwner` (Owner is_test)
  dan tidak lagi memakai `PostgresNotificationOutbox` dengan label SIMULASI--DATA FIKTIF.
  Feedback ditulis langsung ke `owner_inbox_items` (item_kind=REPORT) -- hanya bisa dibaca
  Owner melalui konsol Admin -> Inbox. Mode berubah dari SIMULASI menjadi LOCAL_DELIVERY.
- `RETIRE-SIMULASI` : `outbox.ts deliverNext()` tidak lagi memberi prefix [SIMULASI] pada
  subject saat delivery ke `owner_mailbox`.
- `PERBAIKAN-UX` : `feedback-form.tsx` menghapus checkbox "konfirmasi data fiktif" dan pesan
  sukses simulasi. Placeholder dan status teks diperbarui agar jujur tentang pengiriman lokal.
- `PERBAIKAN-ROUTE` : `public-feedback/route.ts` menghapus validasi confirmFixture; whitelist
  field diperbarui. `jasa/my-orders/[id]/review/route.ts` meneruskan senderPrincipalId.
- `VERIFIKASI-STATIS` : grep bersih untuk target simulasi S02; brace balance 0 di 4 file.
- `BELUM-DIVERIFIKASI-RUNTIME` : npm, lint, test, build, server, database tidak dijalankan.

## 2026-09-23 — Identitas Madevi dan realitas alur lokal
- `PENGEMBANGAN-IDENTITAS` : Header dan sidebar memakai emblem Madevi kanonis; nama publik
  tetap Madevi dan footer tidak lagi memakai tahun rilis dekoratif yang tidak dapat dibuktikan.
- `PENGEMBANGAN-FUNGSI` : Adapter mock Asisten dihapus. Asisten Madevi sekarang melakukan
  retrieval dari indeks artikel lokal yang lolos policy, menyimpan percakapan/sumber, dan tidak
  mengklaim provider/model online.
- `PENGEMBANGAN-INTERAKSI` : Orb Asisten dibuat bulat, kecil, dan hidup melalui transform ringan
  saat retrieval tersedia; reduced-motion dan focus menghentikan gerak agar aksesibilitas tetap
  terjaga.
- `RETIRE-SIMULASI` : Shop tidak lagi menampilkan pembelian/halaman simulasi. Simpan produk dan
  pertanyaan Owner tetap aktif; endpoint beli legacy menolak checkout secara eksplisit dan URL
  lama dialihkan ke detail produk.
- `PENGEMBANGAN-KONTROL` : Menambah `SIMULATION-REMOVAL-AUDIT.md` untuk S01–S06 agar sisa
  simulator diganti dengan alur lokal nyata atau diretir secara aman, bukan hanya dilabel ulang.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build, server,
  browser, database, atau proses background.

## 2026-09-23
- `PENGEMBANGAN-TAXONOMY` : Membangun paket taxonomy multi-root School (R1) dan Explore (R2) menjadi satu package (madevi-explore-pilot-v1 revisi 3) untuk menghindari RETIRED pada R2.
- `PENGEMBANGAN-TAXONOMY` : Promosi paket multi-root berhasil (revisi 3) melalui `taxonomy-import.mjs`.

## 2026-09-23 — Siklus D03/D04/D07/D11 UI dan alur Admin
- `PERBAIKAN-BUG` : Menghapus selector Madevi On lama yang memberi `position: relative` pada drawer `.sidebar`; drawer kembali mengikuti kontrak fixed/right dan z-index yang benar.
- `PENGEMBANGAN-DESAIN` : Sidebar menjadi navigasi ruang yang berkelompok, memiliki status sinkronisasi runtime, target sentuh konsisten, dan penanganan reduced-motion.
- `PENGEMBANGAN-DESAIN` : Light/Dark tetap basic; Madevi On dibedakan lewat chrome black/navy, fallback blur, ambient pelan, border aktif terbatas, dan penghormatan `prefers-reduced-motion`.
- `REFACTOR` : Konsol Admin membuang label sci-fi, style inline, serta hover mutation. Ringkasan, antrean prioritas, error sesi, dan menu kini memakai data/route yang nyata dari kontrak operasi.
- `PENGEMBANGAN-DESAIN` : Profil menghapus tab ganda yang bertentangan dengan navigasi profil; informasi akun, kontrol keamanan, dan tindakan data memiliki hirarki jelas serta aksi hapus akun dibedakan.
- `PERBAIKAN-DESAIN` : Shop dan Madevi Line memperoleh konteks halaman sebelum kontrol; kartu layanan ketiga diselaraskan dengan PCB Layout yang benar-benar tersedia.
- `TERUJI-SEBAGIAN` : Parser TypeScript lulus untuk 7 komponen yang disentuh dan keseimbangan brace CSS lulus. Tidak mengklaim runtime/visual lulus karena browser dan test lengkap belum dijalankan pada siklus ini.
- `PENGEMBANGAN-FITUR` : Kontrak katalog Shop menerima `PRICE_ASC` dan `PRICE_DESC` (dengan kompatibilitas `PRICE` lama), serta mengirim facet kategori dari katalog terbit. UI menampilkan kategori, harga terformat, status stok, retry error, dan tidak menganggap error sebagai katalog kosong.
- `PERBAIKAN-DATA` : School tidak lagi mengklaim format ujian global yang hardcode; informasi minimum per jalur tetap berasal dari response jalur.
- `PENGEMBANGAN-DESAIN` : Tools menerjemahkan status internal menjadi ketersediaan yang jujur dan memakai total trial dari profil; Services memberi tindakan ke panel yang sesuai.
- `PERBAIKAN-NAVIGASI` : URL menjadi sumber state Line (`tab`), Services (`tab`), Tools (`tab`), dan Profil (`section`), mendukung deep link serta history browser.
- `PENGEMBANGAN-DESAIN` : Beranda mengelompokkan ruang berdasarkan tujuan agar Tools tidak tenggelam sebagai kartu keenam yang setara tanpa konteks.
- `DIRENCANAKAN` : Perubahan setelah verifikasi terakhir belum menjalankan proses uji/background baru sesuai arahan Admin.

## 2026-09-23 — Siklus workspace aktif dan katalog template nyata
- `PENGEMBANGAN-FITUR` : Tools mengubah registry dekoratif menjadi tiga jalur kerja aktif. Rumus memvalidasi nilai sebelum memakai kuota, menampilkan langkah/hasil yang dapat disalin atau disimpan; PDF memvalidasi operasi dan membersihkan object URL hasil; Karier menawarkan tiga template, pratinjau hidup, ekspor HTML, serta cetak/simpan PDF.
- `PERBAIKAN-KEJUJURAN-DATA` : Penyimpanan dokumen Karier disajikan sebagai workspace privat karena backend belum menyediakan URL publik; berbagi dilakukan melalui ekspor HTML atau cetak/simpan PDF, bukan sakelar “publik” palsu.
- `PERBAIKAN-FUNGSI` : Form undangan serta simpan privat hasil Rumus/PDF/Karier kini menyertakan CSRF ketika sesi Member ada; pesanan dan workspace dapat dipautkan ke akun, sementara guest undangan tetap didukung sesuai kontrak.
- `PERBAIKAN-KEJUJURAN-DATA` : Galeri undangan tidak lagi menjadikan katalog fallback sebagai produk demo yang dapat dipesan. Hanya template `PUBLISHED` yang dapat dipilih; katalog kosong mengarahkan ke brief undangan custom yang benar-benar membuat order.
- `PENGEMBANGAN-FITUR` : Panel Owner Jasa memperoleh editor draft template dengan slug, metadata, harga, format, media, dan urutan katalog. Draft tetap tersembunyi sampai Owner menerbitkannya.
- `PENGEMBANGAN-DESAIN` : School menjadi workspace progres dan kurikulum yang terstruktur; klaim durasi/batas attempt global dihapus. Services menghapus janji unduh/optimasi yang tidak sesuai alur. Shop memperjelas pending/error action dan menerapkan kata kunci hanya saat pencarian dikirim.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-ADMIN` : Tidak menjalankan npm, lint, test, build, server, atau proses background apa pun pada siklus ini.

## 2026-09-23 — Fondasi Explore yang padat dan taxonomy-first
- `PENGEMBANGAN-DESAIN` : Root Explore & Learn tidak lagi memakai navigator popup generik atau grid tiga artikel contoh. Breadcrumb dipertahankan sebagai satu baris kecil agar konteks ada tanpa mengambil ruang isi; setelahnya heading kiri ringkas langsung mengarah ke panel peta Explore.
- `PENGEMBANGAN-FITUR` : Panel Explore memuat kategori dan setiap menu lanjutan dari `/api/v1/taxonomy`, menyediakan filter lokal, jalur kembali, state loading/error/empty dan retry. Tidak ada kategori klik palsu yang dibuat hanya untuk memperbesar tampilan.
- `PENGEMBANGAN-IA` : Susunan kategori → kelompok → jalur → judul menjadi fondasi eksplorasi pengetahuan kehidupan. Satu fixture saja tetap tampil sebagai `DRAFT` untuk memperlihatkan bentuk judul artikel sebelum katalog konten resmi diperluas.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-ADMIN` : Tidak menjalankan npm, lint, test, build, server, browser, atau proses background apa pun.

## 2026-09-23 — Explore: navigasi kanonis dan skala katalog
- `PERBAIKAN-NAVIGASI` : Jalur taxonomy Explore sekarang menjadi parameter URL kanonis
  (`/ruang/jelajahi-pengetahuan?path=…`). Membuka ulang tautan serta Back/Forward
  memulihkan jalur yang dipilih, bukan state tab yang hilang.
- `PENGEMBANGAN-FITUR` : Browser taxonomy meminta 24 node per halaman dan memakai cursor
  endpoint untuk memuat menu berikutnya secara bertahap. Daftar besar tidak dipenuhi
  placeholder maupun dipaksa dimuat sekaligus.
- `PERBAIKAN-KONTRAK` : Alias taxonomy dari API kini dikembalikan ke jalur kanonisnya;
  gagal memuat halaman lanjutan tetap terlihat sebagai error yang dapat dicoba ulang.
- `PENGEMBANGAN-TEMA` : Madevi On memberi ambient lambat hanya pada chrome panel Explore;
  isi menu tetap kontras dan diam, sementara `prefers-reduced-motion` mematikannya.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build,
  server, browser, database, atau proses background apa pun.

## 2026-09-23 — Tutorial & Problem Solve sebagai ruang utama
- `PENGEMBANGAN-NAVIGASI` : Menambah ruang utama ketujuh `Tutorial & Problem Solve` tepat
  setelah Explore pada sidebar dan Beranda, dengan route `/ruang/tutorial-problem-solve`,
  icon, presentasi header, runtime-menu, serta filter Search yang bertipe `tutorial`.
- `PENGEMBANGAN-FITUR` : Root ruang baru memakai browser taxonomy action-first: URL kanonis
  `?path=`, pagination cursor, alias redirect, filter lokal, retry/error/empty state, serta
  daftar artikel terbit pada daun taxonomy. Deep link taxonomy kembali ke browser ini.
- `PERBAIKAN-IA` : Explore kini secara ringkas mengarahkan kebutuhan tindakan ke ruang baru;
  tidak lagi mencampur peta konsep dengan panduan memperbaiki atau membuat sesuatu.
- `PENGEMBANGAN-KONTROL` : Menambah `TAXONOMY-PRACTICAL-GUIDES.md`, memperbarui master,
  prompt, content plan, roadmap, dan checkpoint dengan root R7, tujuh domain awal, serta
  kelas risiko `GENERAL`/`CONTROLLED`/`STOP`.
- `PENGEMBANGAN-SCHEMA-PENDING` : Menambah source migration 0036 agar index pencarian menerima
  key ruang `tutorial`. Migration tidak diterapkan dan R7 tidak dipromosikan pada siklus ini.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build,
  server, browser, database, atau proses background. R7 belum dipromosikan ke taxonomy aktif.

## 2026-09-23 — Sistem kerja Agent mandiri
- `REFACTOR` : Memusatkan entry point Agent (`AGENTS.md`), master scope, prompt operasional,
  checkpoint, riwayat, dan backlog di `Madevi-Control`; `Madevi_Off` kembali bersih sebagai
  source aplikasi tanpa aturan/prompt/agent.
- `DEPRECATION` : Menghapus sembilan folder dan tujuh file kontrol lama dari parent Madevi
  setelah source package dipindahkan. Penghapusan langsung karena mount Termux tidak memiliki
  trash; `Madevi_Off` dan `Madevi-Control` tetap dipertahankan.
- `PERBAIKAN-DATA` : Paket taxonomy yang diperlukan dipindahkan ke
  `Madevi_Off/content-local/packages/taxonomy/`; package scripts dan generator historis tidak
  lagi membaca atau menulis folder `Menu/` di luar source.
- `PENGEMBANGAN-ATURAN` : Kontrak baru menegaskan local-Termux tanpa API online runtime,
  riset artikel yang disimpan dan diverifikasi lokal, larangan fitur simulasi/palsu, dan
  checkpoint yang wajib diperbarui agar Agent lain dapat meneruskan kerja.
- `PENGEMBANGAN-ATURAN` : Menambah indeks kontrol, kontrak item kerja, protokol handoff, dan
  riwayat siklus terstruktur agar kerja tetap dapat diteruskan setelah kuota/konteks habis atau
  Agent/model berganti.
- `PENGEMBANGAN-ATURAN` : Menetapkan `Madevi-Control/Agent/` sebagai satu-satunya ruang
  sementara untuk Agent tambahan dari AI CLI atau AI apa pun, dengan brief/status, batas file,
  handoff ke memori kanonis, dan pembersihan setelah tugas selesai.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build, server,
  browser, database, atau proses background pada siklus ini.

## 2026-09-24 — Workspace Services, Tools, Shop, dan fondasi Tutorial
- `PENGEMBANGAN-DESAIN` : Services tidak lagi menggandakan pilihan melalui hero, tiga kartu, dan
  tab. Pemilih jalur Layout/Custom/PCB kini berada di samping workspace yang aktif dan menjelaskan
  urutan review yang relevan tanpa mengubah route atau kontrak pesanan.
- `PENGEMBANGAN-DESAIN` : Tools memakai navigator workspace untuk Rumus, PDF, dan Dokumen Karier;
  status akses dipadatkan di header sehingga panel alat nyata menjadi pusat halaman.
- `PENGEMBANGAN-DESAIN` : Shop dan detail produk dibangun ulang sebagai katalog keputusan:
  pencarian, kategori, urutan, hasil, data mitra, simpan, dan pertanyaan Owner memiliki hirarki
  sendiri. Checkout/pembayaran/pengiriman tetap dinyatakan tidak tersedia di Madevi Local.
- `PENGEMBANGAN-FONDASI` : Ketika R7 belum ada di taxonomy aktif, Tutorial menampilkan tujuh
  menu vocabulary R7 dan tepat satu judul lintas bidang berstatus `DRAFT`, bukan daftar panduan
  rekaan atau artikel terbit.
- `PERBAIKAN-FUNGSI` : Detail Shop kini membedakan gagal muat dan produk tidak ditemukan; aksi
  simpan/tanya memiliki pending/error, pertanyaan memakai minimum 10 karakter secara konsisten.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build, server,
  browser, database, atau proses background apa pun.

## 2026-09-24 — Stabilitas Madevi On dan audit interaksi Shop
- `PERBAIKAN-TEMA` : Mengganti lapisan Madevi On yang sebelumnya menimpa posisi komponen
  menjadi `relative`. Header dipulihkan sebagai sticky, sidebar sebagai drawer fixed di kanan,
  dan popup Asisten tetap fixed. Menu sidebar sekarang tidak digeser saat hover maupun aktif.
- `PENGEMBANGAN-TEMA` : Membuat identitas Madevi On yang hidup tetapi terukur: atmosfer warna
  low-frequency, satu scan header, satu sinyal tepi sidebar, beacon pada navigasi aktif, sheen
  sekali saat hover tombol, serta orb Asisten yang bergerak halus. Semua motion hanya memakai
  properti visual dan berhenti pada `prefers-reduced-motion`.
- `PERBAIKAN-INTERAKSI` : Navigator workspace diberi offset header; kontrol filter dan aksi
  Shop dinaikkan ke target minimum 44 px; kegagalan pertanyaan Owner tampil in-context dengan
  `aria-invalid`/`aria-describedby`; gambar katalog dimuat lazy/async.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build, server,
  browser, database, request API, atau proses background apa pun.

## 2026-09-24 — Rencana online dipisahkan dari tahap lokal
- `PENGEMBANGAN-ARSITEKTUR` : Menambah folder eksternal `../Madevi-Online-Plan/` untuk proposal
  online terpisah: target Next.js BFF + Spring Boot modular core API, OIDC/auth, API/WAF/rate
  limit, data/file/privacy, operasi/recovery, migrasi, register keputusan, dan checklist go/no-go.
- `BATAS` : Folder ini bukan control plane, source runtime, konfigurasi cloud, maupun integrasi
  aktif. Tidak ada perubahan API online, credential, provider, database, atau proses pada
  `Madevi_Off`; tahap lokal-Termux tetap kanonis.

## 2026-09-24 — Arsitektur akar Explore dan Tutorial
- `PENGEMBANGAN-ARSITEKTUR` : Menambah `KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md` sebagai
  blueprint kanonis untuk Atlas Explore dan Jalur Praktik Tutorial. Pohon `R→D→K→M→T` dipakai
  hanya untuk navigasi, sementara facet dan relasi menanggung discovery skala besar.
- `PENGEMBANGAN-EDITORIAL` : Menetapkan profil komposisi Madevi yang berbeda untuk artikel
  pemahaman dan panduan tindakan. Ia melarang template ensiklopedia seragam, salinan struktur
  web luar, dan artikel/judul massal tanpa source dossier, provenance, serta review.
- `PERBAIKAN-KONTRAK` : Dokumentasi R7 diperbaiki agar memakai level `M` yang benar sesudah
  `K`; judul/prosedur adalah artikel pada leaf, bukan level taxonomy `S` baru.
- `PENGEMBANGAN-EDITORIAL` : Blueprint Explore/Tutorial versi 1.1 menambah Content Packet,
  canonical key/edisi/supersession, source dossier + claim map, quality gate berbasis risiko,
  freshness/koreksi, kontrak pencarian lokal, dan pembaca artikel yang ringkas. Ini mencegah
  artikel ganda, batch judul kosong, serta hilangnya konteks ketika pekerjaan berpindah agent.
- `BATAS` : Ini hanya desain kontrol; tidak ada source runtime, taxonomy aktif, migration,
  artikel, atau package yang dipromosikan.

## 2026-09-24 — Tools & Equipment: kelompok → alat → workspace
- `PENGEMBANGAN-IA` : Navigator Tools dipisahkan menjadi tiga tingkat agar dapat berkembang
  tanpa mengubah halaman menjadi katalog dokumen: kapsul Kelompok alat di kiri atas dan kapsul
  Pilihan alat di kanannya masing-masing membuka dropdown. Memilih kelompok lain menampilkan
  “Pilih alat” sampai alat nyata dipilih; dropdown ditutup oleh klik luar atau Escape. Pada layar
  kecil, kedua kapsul berubah menjadi susunan vertikal tanpa horizontal scroll.
- `PENGEMBANGAN-FUNGSI` : Kelompok awal memetakan fungsi nyata yang sudah ada: Hitung & Rumus →
  Kalkulator Rumus; Dokumen & Berkas → PDF; Generator → Dokumen Karier. URL `?tab=` tetap
  kanonis untuk reload, tautan langsung, dan Back/Forward.
- `KEJUJURAN-FITUR` : PDF menyediakan info, gabung, pisah, rotasi, hapus halaman, susun ulang,
  dan optimasi. Word/Excel serta alat kandidat lain tidak dirender sebagai menu aktif sampai
  pemroses lokal input → output mereka benar-benar tersedia.
- `PENGEMBANGAN-KONTROL` : Blueprint pertumbuhan alat lokal diperluas menjadi arsitektur
  kanonis: sepuluh kelompok akar, model Group → Family → Tool → Operation, Tool Brief,
  eksekusi/retensi lokal, lifecycle `IDEA` sampai `PUBLISHED`, workspace type, dan roadmap
  R0–R7. Kandidat tetap tidak tampil sebagai menu aktif sebelum input → proses → hasil →
  recovery dibuktikan.
- `PERBAIKAN-STATE` : Memperbaiki konflik CSS antara `hidden` dan `display: grid` pada panel
  dropdown. Daftar yang tertutup sekarang benar-benar `display: none`; pemilihan kelompok hanya
  membuka daftar Pilihan alat, tanpa dua daftar saling menumpuk.
- `BELUM-DIVERIFIKASI-ATAS-ARAHAN-OWNER` : Tidak menjalankan npm, lint, test, build, server,
  browser, database, request API, atau proses background apa pun.
