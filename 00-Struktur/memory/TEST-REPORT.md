# TEST-REPORT — 2026-09-25

## ROUTE-FIX-001 — bukti verifikasi 2026-09-25

> **Transparansi proses:** sesi ini dimulai dari MASTER scope versi lama yang mengizinkan
> runtime otonom. Guardrail Owner terbaru (folder `Madevi-Control`, 2026-09-25) melarang
> background/server/npm/lint/build/test tanpa izin. Sebelum guardrail tersebut ditemukan,
> perintah berikut sudah berjalan di lingkungan lokal non-produksi: `check-deps.mjs`,
> `postgres-termux.mjs status/start`, `migrate.mjs status`, `tsc --noEmit`, dua run
> `run-vitest.mjs` (unit terpotong timeout 400s; `prompt-l07` setelah DB dinyalakan ulang),
> `start.mjs --mode development`, dan curl smoke. Begitu guardrail diketahui, dev server
> dihentikan via `stop.mjs` dan verifikasi beralih sepenuhnya ke metode statis. Tidak ada
> produksi, data pengguna, atau publikasi yang disentuh.

### Verifikasi runtime (sebelum guardrail diketahui — bukti jujur, bukan klaim baru)

- `tsc --noEmit` → EXIT 0 (0 error).
- `migrate.mjs status` → 35/35 migrasi `applied:true` (schema `madevi`).
- `run-vitest.mjs run tests/integration/prompt-l07.test.ts` → **6/6 PASS** setelah DB
  dinyalakan ulang; termasuk AC-04 capability dengan assertion baru `href /owner/`.
  (Sebelum DB dinyalakan ulang: ECONNREFUSED 127.0.0.1:5432 — postgres berhenti akibat
  restart server, bukan bug source.)
- Dev server lokal + curl:
  - `/admin` → 307 → `/owner`; `/admin/operasi` → 307 → `/owner/operasi`;
    `/admin/pengguna` → 307 → `/owner/pengguna`; `/admin/artikel/baru` → 307.
  - `/owner` → 200; `/owner/operasi` → 200; `/owner/login` → 200; `/` → 200;
    `/ruang/jelajahi-pengetahuan` → 200; `/api/health` → 200 (app+db ok).
  - Route tak dikenal → 404.
- `GET /api/v1/search?q=cuaca` (guest) → 3 hasil MENU deep-link kanonis `/ruang/...`,
  akses PUBLIC. `?q=zzzznotexist12345` → `data: []` + pagination kosong (zero-result
  recovery di UI: loading / error+retry / empty hint / load-more).

### Verifikasi statis (setelah guardrail — metode yang diizinkan)

- Transpile parser TypeScript `transpileModule` (jsx React, reportDiagnostics) untuk 8 file
  berubah → **0 diagnostic**: `next.config.ts`, `src/services/admin.ts`,
  `src/app/admin/page.tsx`, `src/app/admin/layout.tsx`, `tests/unit/prompt03.test.ts`,
  `tests/unit/taxonomy-source.test.ts`, `tests/integration/prompt05-package.test.ts`,
  `scripts/taxonomy-import.mjs`.
- Verifikasi target assertion prompt03 via grep ke source (semua cocok):
  - `src/styles/madevi-on.css` mengandung `[data-theme='madevi-on']` (43 deklarasi).
  - `src/styles/tokens.css`: `--content-width: min(100% - 2rem, 72rem)` dan
    `--content-gap: clamp(1rem, 3vw, 1.5rem)`; `--accent: #0d9488` tetap (case-insensitive
    assertion lama sudah benar); `[data-theme='dark']` ada.
  - `src/components/footer.tsx` mengandung tagline "Pengetahuan dan tindakan" + 4 tautan
    (`/tentang`, `/review`, `/ketentuan`, `/privasi`).
  - `src/components/ai-button.tsx` mengandung "Sumber lokal" + `/ai-asisten`.
  - Assertion prompt03 lain yang diperiksategaskan lulus statis: F03-01/02/15 existence
    (12 komponen, 5 halaman info, 6 route), F03-03 Noto Sans (import + 3 wght + family),
    F03-05 `min-height: 44px` (34x) & `.button` 44px, F03-06 reduced-motion/focus-visible/
    skip-link/sr-only, F03-07 breakpoint 640px/1024px, F03-08 `80vw` + `.sidebar-backdrop`,
    F03-09 THEME_SCRIPT/localStorage/dangerouslySetInnerHTML/suppressHydrationWarning,
    F03-13 `Daftar / Login` (1x) + GuestProfileCard + GuestMenuItems,
    F03-14 tanpa `pwa`/service-worker, F03-15 openapi 0.5.0 + `/public-feedback` +
    text-size-adjust + overflow-x clip.
- Sisa link `/admin/*` di source hanya 11 baris di `src/components/admin-shell.tsx` yang
  sekarang tidak dapat dicapai (redirect config menembak sebelum render).
- File paket kanonis: `content-local/packages/taxonomy/madevi-explore-pilot-v1.json` ada
  (13762 byte, identik dengan arsip lama → checksum `0384683d…` pada test tetap valid).

### BELUM-DIVERIFIKASI (atas guardrail Owner)

- Suite unit/integrasi penuh dengan runner (termasuk `prompt03` setelah update assertion dan
  `taxonomy-source` setelah pemindahan path) — `BELUM-DIVERIFIKASI`; bukti saat ini statis.
- Lint, build production, typecheck penuh pasca-perubahan — `BELUM-DIVERIFIKASI`.
- Visual audit browser untuk perubahan apa pun — `BELUM-DIVERIFIKASI`.
- Respons 401/403 dashboard Admin di browser (tugas ADMIN-001-REV1) — `BELUM-DIVERIFIKASI`.

## UX-REDESIGN-001 — pemeriksaan statis 2026-09-25

- PostCSS parse: `tokens.css`, `redesign.css`, `madevi-on.css`, dan
  `interface-refresh.css` lulus tanpa error sintaks.
- Transpile parser TypeScript: `public-shell.tsx`, `motion-orchestrator.tsx`,
  dan `home-content.tsx` lulus tanpa diagnostic parse.
- Source scan: tidak ada pseudo-element di dalam `:is()` pada empat sheet
  tersebut; nama `madevi-on-sidebar-signal` hanya didefinisikan sekali, sedangkan
  rail aktif memakai `madevi-on-active-rail`.
- Browser visual, breakpoint nyata, reduced-motion runtime, lint, typecheck
  penuh, test runner, build, server, dan API: `BELUM-DIVERIFIKASI` sesuai batas
  operasi Owner.
- Setelah perluasan layout/motion, PostCSS parse empat sheet dan transpile
  parser tiga komponen publik diulang: lulus tanpa diagnostic parse. Pemeriksaan
  source memastikan dua keyframe sidebar masing-masing hanya satu definisi,
  nol pola pseudo-element di dalam `:is()`, serta breakpoint satu kolom untuk
  direktori On dan jalur cepat pada ukuran tablet/ponsel. Ini bukti statis,
  bukan hasil render visual.
- Setelah koreksi bidang opak lintas ruang, parser PostCSS dan pemeriksaan
  source terfokus diulang; hasil akhir dicatat pada checkpoint item. Kontras
  terkomposisi dan performa render Android tetap memerlukan audit visual/runtime.

## Motion/component publik — 2026-09-24

- Static transpile parser untuk 10 file yang diubah (`layout`, `public-shell`, `home-content`,
  `auth-card`, `recovery-form`, `owner-login-form`, `motion-orchestrator`, `Button`, `Card`, dan
  `cn`) → lulus tanpa diagnostic parse.
- Pemeriksaan brace balance `interface-refresh.css` dan `tokens.css` → lulus.
- `npm install --package-lock-only --offline --no-audit --no-fund --ignore-scripts` → berhasil;
  hanya menyelaraskan lock dependency, tanpa lifecycle script atau reify penuh.
- Import modul ESM `gsap` dan `animejs` → export `gsap.context` serta `animate` tersedia.
- Tidak ada lint, typecheck penuh, build, test runner, request API, migrasi, browser, atau
  server baru yang dijalankan. Dev server yang sudah berjalan sebelum audit hanya teramati dan
  tidak disentuh. Visual/runtime semua tema serta `prefers-reduced-motion` masih
  `BELUM-DIVERIFIKASI-RUNTIME`.

## Pemulihan dependency Next — 2026-09-24

- Lockfile memuat `baseline-browser-mapping@2.11.25`, `browserslist@4.29.0`, dan
  `update-browserslist-db@1.3.3`; ketiganya bersama 11 package lain ditemukan dalam folder
  sementara tersembunyi akibat reify terdahulu. Sesudah seluruh 14 folder dipulihkan ke nama
  package kanonis, semua manifest dapat di-require dan
  `next/dist/build/get-supported-browsers.js` berhasil dimuat.
- Dev server, build, lint, typecheck, test, API, dan database tidak dijalankan untuk repair ini.

## Recovery source-map dan ikon — 2026-09-24

- `mappings.wasm` ditarik dari tarball exact `next@16.3.4` dan sekarang berukuran 48,693 byte.
- `lucide-react` tidak dapat diandalkan setelah copy FUSE terputus; import di source dan entry
  manifest/root lock dihapus, diganti tiga SVG lokal.
- Static parser empat komponen terkait, JSON lockfile, Radix/CVA/clsx/GSAP, dan loader
  browser/source-map Next → lulus. Request `GET http://127.0.0.1:3000/` ke dev server yang
  sudah berjalan → HTTP 200, 39,855 byte, tanpa teks error Lucide/source-map pada respons.

## Refresh antarmuka global — 2026-09-24

- Static transpile parser `layout.tsx`, `owner-shell.tsx`, dan `admin-shell.tsx` → lulus tanpa
  diagnostic error.
- Pemeriksaan keseimbangan brace `tokens.css` dan `interface-refresh.css` → lulus.
- Tidak ada npm, lint, test runner, build, server, browser, database, atau request API yang
  dijalankan sesuai batas operasi Owner. Visual dark/light/Madevi On tetap
  `BELUM-DIVERIFIKASI-RUNTIME`.

- `node scripts/check-deps.mjs` → ok (android/arm64, node 24, psql 18.2, next installed).
- `tsc --noEmit` → EXIT 0, nol error.
- `migrate up` → 33 applied (0033 baru diterapkan sesi ini).
- `taxonomy preview --package release-v1` → ok, 16 node, hash `0384683d…` = validator M08.
- `taxonomy stage` → rev 1, loaded 16, validation ok (root 1, leaf 3, orphan 0).
- `taxonomy promote --confirm-owner true` → rev 1 `ACTIVE`.
- `taxonomy export` → `content-local/taxonomy-pilot-v1.json`, 16 node, sha `7934f4be…`.
- `vitest tests/unit/taxonomy-source.test.ts` → 3 passed, 5 skipped (legacy absen).
- `vitest tests/integration/prompt05-package.test.ts` → MENUNGGU (background).
- Hasil: 8 passed (5 integrasi incl. proyeksi search + 3 unit paket), 5 skipped legacy.
- D08: `promote()` kini memproyeksikan node ke `search_index_entries` (MENU);
  rev 2 ACTIVE; `GET /api/v1/search?q=cuaca` → 3 hasil MENU deep-link `/ruang/…`.
- HTTP smoke: `/api/health` ok (app+db), `/ruang/jelajahi-pengetahuan` 200 (18KB).
- Visual audit screenshot TERBLOKIR: tidak ada desktop browser terhubung ke sesi
  ini (butuh aplikasi desktop + experimental browser). Verifikasi DOM via curl saja.
- Suite unit penuh (pra-pembunuhan proses, tanpa eslint per instruksi Admin):
  `prompt04-ui.test.tsx` 3 gagal (auth tab, profil tab, login Admin) +
  1 gagal OpenAPI feedback — file terkait TIDAK disentuh sesi ini
  → dicatat sebagai kegagalan pra-ada, antre triase (bukan klaim hijau).
- Triase selesai: prompt04-ui 4/4 LULUS (gerbang O-01, 4 tab profil, kontrak
  login Admin); prompt03 69/69 LULUS (token ruang, label sidebar, popup AI,
  nilai mobile-first); kontrak api-contract LULUS (openapi.json dihasilkan).
- Sisa pra-ada lain dari suite penuh awal belum diulang per-file (instruksi
  tanpa eslint/npm; vitest satuan dijalankan per-file bila dibutuhkan).
- D13: `backup.mjs` perbaiki mkdir rekursif → backup OK
  (`backup-20260923142114367-2776baf4`, manifest COMPLETE);
  `inspect-restore` 9/9 checks LULUS (dump ada, checksum cocok) tanpa
  menyentuh DB live. Restore execute tetap butuh jendela khusus (catat
  pre-restore checkpoint dulu).
- D09: migrasi 0034 + `ExamService.loadPolicy()`; regresi prompt07 berjalan.
- D05: migrasi 0035 (CHECK arsip); `runAutoCheck` promosikan AUTO_CHECK lulus;
  prompt06 29/29 LULUS (jebakan AUTO_CHECK + CHECK arsip + restore bersih).

## Siklus D03/D04/D07/D11 — 2026-09-23

- `node --input-type=module` dengan TypeScript parser untuk 7 komponen yang
  diubah (`owner-console`, `owner-shell`, `profile-dashboard`, `profile-shell`,
  `social-dashboard`, `jasa-page`, `shop-page`) → LULUS, tanpa parse diagnostic.
- `awk` balance check untuk `tokens.css`, `globals.css`, `redesign.css`, dan
  `madevi-on.css` → LULUS, tidak ada unmatched/closing brace.
- Pencarian sumber untuk bekas `NEXUS CMD`, `TERMINATE SESSION`,
  `SECURE CONNECTION`, `AUTH_REQUIRED`, inline `style`, dan hover DOM mutation
  pada komponen yang diperbarui → tidak ada hasil.
- Batas: npm/lint/build/e2e/server visual tidak dijalankan karena arahan Admin
  pada siklus ini melarang npm/lint. Status siklus: `TERUJI-SEBAGIAN`.

## Explore: navigasi URL dan pagination — 2026-09-23

- Tidak ada npm, lint, test, build, server, browser, database, atau proses background yang
  dijalankan. Status perubahan ini: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi statis saja: komponen memakai bentuk response taxonomy yang sudah ada
  (`data.children`, `data.breadcrumb`, `data.page.nextCursor`, dan `data.redirectPath`),
  tanpa mengubah kontrak endpoint atau menjalankan request.

## Tutorial & Problem Solve — 2026-09-23

- Tidak ada npm, lint, test, build, server, browser, database, atau proses background yang
  dijalankan. Status: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi source saja: ruang baru memakai kontrak taxonomy dan article endpoint yang sudah ada;
  search mengizinkan key `tutorial`, sementara proyeksi import memetakan root `R7` ke key itu.
  Source migration 0036 diperiksa sebagai perubahan pending saja. Tidak ada request runtime,
  migration, taxonomy stage/promote, atau klaim hasil visual yang dibuat.

## Identitas Madevi dan penghapusan alur tiruan — 2026-09-23

- Tidak ada npm, lint, test, build, server, browser, database, atau proses background yang
  dijalankan. Status: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi statis saja: adapter mock tidak lagi diinjeksikan pada `AiService`; asisten memakai
  query indeks artikel lokal dan mengembalikan sources. UI Shop tidak lagi memanggil endpoint
  buy, endpoint legacy hanya mengembalikan state checkout tidak tersedia, dan route lama
  mengarahkan ke detail produk.

## Workspace Services, Tools, Shop, dan fondasi Tutorial — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi statis source saja: Services dan Tools mempertahankan URL `?tab=` sebagai sumber
  pilihan dan masih merender komponen kerja yang sama; Shop mempertahankan endpoint katalog,
  simpan, dan pertanyaan, tetapi menghapus markup katalog lama yang berulang. Detail Shop kini
  memiliki state terpisah untuk loading, error request, dan not-found.
- Inspeksi statis kontrak Tutorial saja: fondasi tujuh domain tidak memanggil endpoint atau
  membuat `Link` ke taxonomy; ia hanya muncul saat root taxonomy mengembalikan unavailable,
  dan satu judul ditandai `DRAFT`. R7 tetap belum dipromosikan dan migration 0036 tetap pending.

## Madevi On dan audit Shop — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi statis source: `madevi-on.css` mengatur sidebar kembali `position: fixed` dengan
  `right: 0`, header `sticky`, dan popup Asisten `fixed`; selector hover/active sidebar memuat
  `transform: none`. Motion tema dibatasi oleh block `prefers-reduced-motion`.
- Inspeksi statis Shop: validasi pertanyaan memiliki `minLength`, `aria-invalid`,
  `aria-describedby`, dan pesan `role=alert` tepat di bawah textarea; filter/aksi/submit memakai
  minimum `2.75rem` dan navigator workspace memakai offset header `calc(64px + 1rem)`.

## Tools & Equipment: kelompok → alat → workspace — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `BELUM-DIVERIFIKASI-RUNTIME-ATAS-ARAHAN-OWNER`.
- Inspeksi statis source: `utilities-page.tsx` menyimpan `?tab=` sebagai pilihan workspace,
  menyelaraskan kelompok terpilih dari URL, dan memiliki dua kapsul dropdown: Kelompok alat
  diikuti Pilihan alat. Listener `pointerdown` di luar selector serta Escape menutup dropdown;
  setiap trigger memiliki `aria-expanded`/`aria-controls`. CSS memakai bar ringkas di atas
  workspace dan berubah satu kolom pada breakpoint kecil.
- Inspeksi kontrak fungsi: `PdfPanel` menyediakan tujuh operasi lokal yang dirender di bawah
  alat PDF; `RumusPanel` dan `CareerPanel` tetap dirender dari workspace yang sama. Tidak ada
  menu Word/Excel yang mengklaim tersedia.
- Inspeksi state CSS: `.tools-workbench__selector-menu[hidden]` secara eksplisit memakai
  `display: none`, sehingga tidak lagi tertimpa `display: grid` dari panel menu. Satu state
  `openSelector` tetap membatasi dropdown aktif menjadi `GROUPS`, `TOOLS`, atau `null`.

## Blueprint pertumbuhan Tools & Equipment — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `INSPEKSI-DOKUMENTASI-STATIS-ATAS-ARAHAN-OWNER`.
- Inspeksi statis dokumentasi: `TOOLS-AND-EQUIPMENT-ARCHITECTURE.md` memisahkan inventaris
  aktif (Rumus, PDF, Dokumen Karier) dari sepuluh kelompok kandidat, dan menetapkan hanya status
  `PUBLISHED` yang boleh masuk selector utama.
- Inspeksi konsistensi kontrol: blueprint merujuk pola dua kapsul yang telah diterapkan, URL
  kompatibel `?tab=`, input → proses → hasil → recovery, eksekusi lokal tanpa API online, serta
  batas Termux allowlist. Tidak ada klaim bahwa kandidat DOCX/XLSX, OCR, media, atau diagnostik
  sudah berjalan.

## Pendalaman blueprint Explore & Tutorial — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `INSPEKSI-DOKUMENTASI-STATIS-ATAS-ARAHAN-OWNER`.
- Inspeksi dokumentasi: versi 1.1 memisahkan judul/slug dari canonical key serta edisi, dan
  menetapkan lifecycle editorial target, supersession, freshness, dan correction trail tanpa
  mengklaim schema/database sudah berubah.
- Inspeksi kelengkapan editorial: Content Packet memuat brief, rumah taxonomy, profil, dossier,
  claim map, hak pakai, safety/review, status, risiko terbuka, dan titik lanjut. Quality gate
  membedakan Explore umum/sensitif serta Tutorial `GENERAL`/`CONTROLLED`/`STOP`.
- Inspeksi kejujuran UI/discovery: pembaca artikel dan pencarian lokal hanya boleh menampilkan
  metadata/relasi/status yang ada; DRAFT/zero-result tidak disamarkan sebagai artikel atau hasil
  nyata. Tidak ada runtime atau UI baru yang diklaim melalui perubahan blueprint ini.

## Rencana tahap online terpisah — 2026-09-24

- Tidak ada npm, lint, test, build, server, browser, database, request API, atau proses
  background yang dijalankan. Status: `INSPEKSI-DOKUMENTASI-STATIS-ATAS-ARAHAN-OWNER`.
- Inspeksi struktur: `../Madevi-Online-Plan/` berada sejajar dengan `Madevi_Off` dan
  `Madevi-Control`, bukan di dalam source atau control. Dokumen memisahkan target arsitektur,
  OIDC/auth, API/anti-abuse, data/privasi, operasi, migrasi, keputusan proposal, dan readiness.
- Inspeksi batas: seluruh dokumen berstatus proposal/tidak aktif, melarang secret/configuration
  deployment, dan menegaskan bahwa rencana tersebut tidak mengubah runtime lokal-Termux.
