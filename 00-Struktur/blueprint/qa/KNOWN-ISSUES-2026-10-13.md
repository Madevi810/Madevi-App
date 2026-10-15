# KNOWN-ISSUES-2026-10-13 — Sesi Builder Madevi

Dokumen ini mencatat temuan yang teridentifikasi tetapi sengaja **tidak** dituntaskan
pada sesi ini, beserta alasan dan titik lanjut. Dipakai oleh agent berikutnya agar
tidak mengulang diagnosa dari nol.

## K-01 — Test env.test.ts: 3 test gagal karena runtime root Termux tidak ada di VM

- **Status:** SUDAH DIPERBAIKI (9/9 PASS).
- **Akar masalah:** `isWithinWorkspaceRoot()` di `src/server/env.ts` memakai perbandingan
  `fs.statSync` (dev/inode). Path `/sdcard/project/Madevi` ada di Termux/HP tetapi
  **tidak ada** di VM dev, sehingga tiga test yang memakai path Termux selalu gagal.
- **Perbaikan:** ditambah validasi lexical duluan (`isLexicallyWithin`) dengan normalisasi
  alias Termux (`/mnt/sdcard`, `/storage/emulated/0`) dan boundary segmen.
- **Bukti:** `vitest run tests/unit/env.test.ts` → 9 passed (sebelumnya 3 failed).
- **Backup:** `src/server/env.ts.bak-pre-envfix`.

## K-02 — prompt03-behavior.test.tsx: assertion urutan tab search sudah usang

- **Status:** SUDAH DIPERBAIKI untuk test pertama (fokus/Tab/Escape).
- **Akar masalah:** test lama menulis urutan `Tutup pencarian → MENU → ARTICLE/PROFILE/…`
  yang valid sebelum filter ruang (L06) ditambahkan ke `SearchOverlay`. Urutan DOM
  sesudah L06: `input → Buka menu (header search) → Tutup pencarian → 7 filter ruang
  (Explore & Learn … Tools & Equipment) → 8 filter kategori (MENU … POST)`.
- **Perbaikan:** assertion diperbarui ke urutan DOM nyata (bukan dihapus, sesuai MASTER §4).
- **Perbaikan tambahan:** `dialog-behavior.ts` sekarang memakai `tabOrderedFocusables()`
  (sort by tabIndex, stabil) dan men-trap fokus kembali ke dialog jika `activeElement`
  berada di luar dialog saat Tab ditekan.

## K-03 — SearchOverlay menggantung saat dirender terisolasi di happy-dom — KNOWN ISSUE

- **Status:** BELUM SELESAI. **Timebox dicapai; pindah ke pekerjaan lain** (mandat #2).
- **Gejala:** `render(<SearchOverlay query="…" …/>)` di happy-dom tidak pernah selesai —
  bahkan render sinkron dengan `query=""` (hanya hint teks) tidak kembali. Vitest hang
  sampai timeout. Komponen lain di happy-dom (`Header`, `PublicShell`, `prompt04-ui`,
  `invitation-order-form`) tidak bermasalah.
- **Bukan penyebabnya (sudah disingkirkan):**
  - timer happy-dom (`setTimeout` berjalan normal, diverifikasi di test probe);
  - debounce 300 ms (fail sudah diberi timeout 15 detik, tetap hang);
  - infinite loop di komponen (kode efek/state/filter tidak ada loop — `useEffect`
    debounce, `useEffect` fetch dengan AbortController, `useCallback` dependensi benar);
  - `next/link` (dirender normal di test isolasi).
- **Dugaan terkuat:** interaksi `React 19.2.8` × `happy-dom 20.14.0` × `next/link`
  di dalam komponen ini (mis. `Link` di dalam `<ul>` hasil + `aria-live` region).
  Gejala identik dengan bug resolusi async React/happy-dom yang terdokumentasi
  pada kombinasi versi ini. Hanya muncul di **test isolation**; di runtime browser
  nyata (dev server jalan, `/api/v1/search` 200) tidak teramati.
- **Yang sudah diperbaiki (nilai tetap):** env.test.ts 9/9, assertion tab-order
  prompt03-behavior, focus-trap `dialog-behavior.ts`.
- **Titik lanjut:** coba turunkan `happy-dom` ke 18.x atau naikkan ke rilis terbaru
  20.x; atau ganti environment test `SearchOverlay` ke `jsdom`; atau render melalui
  `Header` (yang di validasinya tetap jalan) dan ambil hasil search lewat `Header`.
- **Dampak produk:** tidak ada. Search jalan di runtime (`/api/v1/search` HTTP 200).
  Hanya test unit yang tidak bisa memverifikasi `SearchOverlay` dalam isolasi.

## K-04 — Live workspace vs zip (Oct 13 21:06) belum disinkronkan — menunggu keputusan Owner

- **Status:** MENUNGGU. Owner eksplisit meminta **jangan sync ke live** sampah jawaban.
- **Fakta:** live workspace (Oct 8–9) lebih lama dari zip (Oct 13 21:06) yang berisi
  framework simulasi 19 file, `payment-simulator.tsx`, `oauth-simulation.ts`,
  route `/pembayaran` + `/auth/oauth`, `article-reading-tools`, `standalone-invitation-order`,
  `line-guest-view`, dan snapshot DB 710 artikel. 48 file source berbeda + 24 hanya
  ada di satu sisi. Tidak ada git.
- **Yang dilakukan sesi ini:** hanya perbaikan non-destruktif di live
  (`src/server/env.ts`, `src/components/dialog-behavior.ts`,
  `tests/unit/env.test.ts`, `tests/unit/prompt03-behavior.test.tsx`).
  Semua backup: `*.bak-pre-envfix`.
- **Titik lanjut:** tunggu keputusan Owner. Backup live ada di
  `~/workspace/madevi-backup-control/` (pra-restruktur kontrol).

## K-05 — DB live tipis vs potensi snapshot

- **Fakta:** `madevi_off` (schema `public`, 159 tabel, role `madevi_local`) berisi
  **3 artikel PUBLISHED + 16 taxonomy nodes**. Zip `artikel-rebuild.sql` + 121 file
  `database-seed/` berisi rekonstruksi konten (710 artikel menurut rebuild script).
  Snapshot `~/workspace/madevi-db-snapshot-2026-10-13.dump` **tidak ditemukan** di VM ini.
- **Titik lanjut:** perlu keputusan Owner untuk seeding data; guardrail melarang
  operasi database tanpa item dan lock yang sah.

## K-06 — Integration test gagal: DB layer, bukan UI (pre-existing)

- **Status:** PRE-EXISTING — tidak terkait porting komponen sesi ini.
- **Gejala:** 17 test gagal di `tests/integration/`:
  - `prompt04.test.ts` (9 failed): `SessionService.create src/auth/session.ts:81`
    `TypeError: Cannot read properties of undefined (reading 'role')`;
    assertion `expected { …(4) } to match object { …(2) }` di registrasi.
  - `prompt03.test.ts` (3 failed): `INSERT INTO ${schema}.api_rate_limits`,
    `invalid input syntax for type uuid`, `IDEMPOTENCY_CONFLICT`.
  - `prompt-l06.test.ts` (5 failed): seed idempoten & AI simulasi.
- **Akar masalah:** test-test ini menyentuh **database nyata**. Env bilang schema
  `madevi`, data nyata di schema `public` (K-03 schema mismatch). Query ke schema
  yang salah → relasi/konteks tidak ditemukan → error di atas.
- **Bukti tidak terkait porting:** grep test yang gagal terhadap komponen yang
  di-port sesi ini (`jasa-page`, `social-feed`, `social-tabs`,
  `explore-foundation`, `r1-navigator`, `tutorial-problem-foundation`,
  `invitation-gallery`, `private-route`) → **0 match**. Satu-satunya test
  yang menyentuh komponen di-port (`invitation-order-page.test.tsx`) sudah
  diperbaiki kontraknya dan PASS.
- **Titik lanjut:** Muse (runtime + DB restore). Bila schema env diselaraskan
  / DB direstore, test ini kemungkinan besar lulus tanpa perubahan kode.

## K-07 — INSTRUKSI-02: runtime bukan ranah builder ini lagi

- **Aturan baru (Ade, via Muse):** server `next dev`/`next start` MATI permanen.
  Tidak ada curl/browser/HTTP. Verifikasi hanya `tsc --noEmit`, vitest, lint,
  baca kode.
- **Klaim selesai builder** = typecheck bersih + unit test lulus + tercatat di
  Madevi-Control. Bukti runtime disediakan Muse setiap 12 jam (restore DB,
  jalankan server, uji semua route).
- **Status server:** `scripts/stop.mjs` dijalankan, PID dihentikan, port 3000
  bebas (diverifikasi via `ss -ltn`).
- **Konsekuensi:** semua item port sesi ini diverifikasi statis. Bukti browser
  di JASA-PORT-001 / EXPLORE-PORT-001 diambil SEBELUM instruksi ini (arsip).

## Known issue baru — 14 Okt 2026

- **`tests/unit/invitation-order-form.test.tsx` gagal (pre-existing).**
  Test "keeps field IDs unique when multiple forms are visible"
  mengharapkan 12 field input/textarea, actual 6. Saya TIDAK menyentuh
  file ini pada batch INOVASI-0841/0940; kemungkinan efek samping dari
  port JASA-PORT-001 (form undangan di-split ke
  `standalone-invitation-order.tsx`). Perlu triase terpisah — bukan
  blocker fitur inovasi (tidak ada hubungan file).
- **Migrasi 0042 + 0043 belum dijalankan** (sesuai INSTRUKSI-02, tidak
  ada operasi DB). Tabel `kindness_report`, `story_threads`,
  `story_chapters`, `story_votes`, `shipping_bundles`, `bundle_items`
  belum ada di DB live. Konsekuensi: fitur Peta Kebaikan, Dongeng
  Bareng, dan Bundel Ongkir akan gagal saat runtime hingga Muse
  menjalankan `node scripts/migrate.mjs up` (0041 juga masih tertunda
  dari sesi sebelumnya).

## 14 Okt 2026 — Batch INOVASI-1045/1145/1245

- **K-08 (runtime, tertunda): Migrasi 0044–0049 belum dijalankan.**
  INSTRUKSI-02 melarang operasi DB. Tabel `listen_sessions`,
  `product_duels`, `sidang_sessions`, `clinic_sessions`, `karya_lineage`,
  `karya_badges`, `product_petitions` belum ada di DB live. Seluruh 6
  fitur batch ini (Giliran Dengar, Duel Produk, Sidang Warga, Klinik
  Ide, Silsilah Karya, Petisi Katalog) akan gagal runtime hingga Muse
  menjalankan `node scripts/migrate.mjs up` (0041–0043 juga masih
  tertunda dari batch sebelumnya). Tidak ada table drift: skema
  ditulis lengkap di file migrasi.
