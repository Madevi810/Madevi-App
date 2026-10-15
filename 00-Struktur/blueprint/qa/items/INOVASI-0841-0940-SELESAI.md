# INOVASI-0841 + INOVASI-0940 — 4 Ide Fitur (Verifikasi)

**Tanggal:** 14 Okt 2026
**Asal:** INOVASI-20261014-0841.md (Zona Tenang + Peta Kebaikan) +
INOVASI-20261014-0940.md (Dongeng Bareng + Bundel Ongkir Tetangga)
**Status:** SELESAI — verifikasi static (tsc + vitest) sesuai INSTRUKSI-02

## Ringkasan

| # | Item | Fitur | Bukti |
|---|------|-------|-------|
| 1 | LINE-CALM-001 | Zona Tenang (Line) | tsc EXIT 0 · 7/7 render test (`calm-post-card.test.tsx`) |
| 2 | LINE-KINDNESS-001 | Peta Kebaikan (Line) | tsc EXIT 0 · 18/18 unit test gabungan |
| 3 | LINE-STORY-001 | Dongeng Bareng (Line) | tsc EXIT 0 · 18/18 unit test gabungan |
| 4 | SHOP-BUNDLE-001 | Bundel Ongkir Tetangga (Shop) | tsc EXIT 0 · rumus hemat teruji |

**Total:** 15/15 test file lulus, 169/169 unit test lulus (5 skipped),
tsc EXIT 0.

## Item 1 — LINE-CALM-001 "Zona Tenang" (INOVASI-0841 IDE 1)

**Tujuan:** Mode baca anti-engagement — feed tenang tanpa angka like,
komentar, badge, atau counter. Ketenangan dari KETIADAAN elemen.

**Yang dibuat:**
- `src/services/calm-mode.ts` — helper pure (resolveCalmMode,
  readCalmModeFromPreferences, calmSupportLabel, serializeCalmMode).
- `src/components/use-calm-mode.tsx` — provider + context; tamu:
  localStorage `madevi_calm_mode` + label jujur "preferensi hanya di
  perangkat ini"; login: `ui_preferences` JSONB via PATCH profile.
- `src/components/calm-post-card.tsx` — CalmPostCard: isi + penulis +
  waktu + baris kecil "Kirim semangat · Laporkan"; counter "N orang"
  diganti teks netral "Ada dukungan untuk postingan ini"; tombol
  Laporkan reuse REPORT_CATEGORIES INSTRUKSI-03.
- `src/components/calm-mode-toggle.tsx` — toggle inline di header
  dashboard Line (ikon daun, `aria-pressed`, tanpa popup).
- Integrasi `social-feed.tsx` (render kondisional CalmPostCard) +
  `social-dashboard.tsx` (CalmModeProvider + toggle) + CSS
  `.line-post--calm` / `.line-calm__*`.
- Backend: `accounts.updateProfile` menerima `calmModePreference`;
  `loadUiPreferences` + `mergeCalmModePreference` (pure, merge tanpa
  menimpa key lain); `privateProfile` mengembalikan `ui_preferences`.

**Verifikasi:**
- `tsc --noEmit` EXIT 0.
- `tests/unit/calm-post-card.test.tsx` 7/7 lulus: render isi/penulis/
  waktu; TIDAK ada `line-action__count`/`line-badge`; label dukungan
  tanpa angka; tombol Laporkan + Kirim semangat tetap ada.
- `tests/unit/innovation-0841-0940.test.ts` — resolveCalmMode
  (server vs localStorage prioritas), readCalmModeFromPreferences
  (hanya boolean), mergeCalmModePreference (tidak menimpa key lain).

**Koordinat anti-balik:** vote_count = COUNT(*) (Dongeng), calm
preference hanya boolean tunggal (tidak bisa dioptimistic-replay).

## Item 2 — LINE-KINDNESS-001 "Peta Kebaikan" (INOVASI-0841 IDE 2)

**Tujuan:** Kontra-narasi positif berbasis bukti — kebaikan nyata per
kota, mencegah bias negatif yang berbahaya bagi pembaca rapuh.

**Yang dibuat:**
- Migrasi `0042-kindness-story.up.sql` — tabel `kindness_report`
  (title 3–120, story 10–500, kota dari CHECK dropdown terkunci,
  kategori 5 nilai, status ANTRI/TAYANG/DITOLAK + trigger guard agar
  dari ANTRI hanya bisa ke TAYANG/DITOLAK dan status final tidak
  bisa diubah).
- `src/services/kindness.ts` — KindnessService (createReport dengan
  findBlockedWord reuse INSTRUKSI-03, listApproved cursor-based,
  listPending, approveReport, rejectReport, cityCounts bulan
  berjalan alfabetis tanpa ranking) + KINDNESS_CITIES (76 kota
  Indonesia) + KINDNESS_CATEGORIES + kindnessReporterLabel ("Seorang
  warga [kota]") + countWords.
- API: `GET/POST /api/v1/line/kindness`, `GET .../kindness/cities`.
- UI `src/components/kindness-map.tsx` — peta SVG Indonesia (20 pin
  kota statis, ukuran pin = jumlah laporan), daftar kartu terbaru,
  form inline 1 layar (dropdown kota mencegah alamat bebas), filter
  kota, panel inline per kota. Tanpa library peta eksternal.
- Tab "Kolaborasi → Peta Kebaikan" di dashboard Line.

**Verifikasi:** tsc EXIT 0 · 18/18 unit test (label anonim,
daftar kota unik ≥20, 5 kategori tetap, countWords).

## Item 3 — LINE-STORY-001 "Dongeng Bareng" (INOVASI-0940 IDE 1)

**Tujuan:** Cerita fiksi bersambung bergiliran — alasan member kembali
tiap hari, menghidupkan feed tanpa algoritma.

**Yang dibuat:**
- Migrasi 0042 (tabel `story_threads`, `story_chapters`,
  `story_votes`) — bab maks 300 kata (CHECK word_count), status
  AJUAN/KANON/ARSIP, unique canon per (thread, week), 1 vote per
  user per bab (UNIQUE constraint).
- `src/services/story.ts` — StoryService:
  - `createThread()` — validasi judul/sinopsis/genre dari daftar tetap.
  - `submitChapter()` — tolak ajuan kedua aktif di utas yang sama;
    findBlockedWord sebelum simpan.
  - `voteChapter()` — toggle idempoten, voteCount = COUNT(*).
  - `canonizeWeekly(week)` — SIMULASI cron berlabel jujur: MAX(vote)
    per utas per pekan, tie → created_at ASC, kalah → ARSIP (tetap
    terbaca).
  - `closeThread()` — hanya pembuat utas.
- API: `GET/POST /api/v1/line/stories`, `GET/PATCH .../stories/[id]`,
  `POST .../stories/[id]/chapters`, `POST .../chapters/[id]/vote`.
- UI `src/components/story-weave.tsx` — buku digital: bab kanon
  bernomor romawi, body serif, daftar ajuan pekan berjalan dengan
  tombol Vote inline, form "Ajukan Bab Saya" inline (bukan modal),
  filter genre, kartu utas. Semua tanpa popup.
- Tab "Kolaborasi → Dongeng Bareng" di dashboard Line.

**Verifikasi:** tsc EXIT 0 · 18/18 unit test (weekNumber stabil
& monoton, BUNDLE_SLOT_MAX=5, konstanta batas bab).

## Item 4 — SHOP-BUNDLE-001 "Bundel Ongkir Tetangga" (INOVASI-0940 IDE 2)

**Tujuan:** Patungan ongkir sekota — hambatan beli nomor 1 di Indonesia
diubah jadi fitur sosial. Tidak ada uang lewat Madevi (murni koordinasi).

**Yang dibuat:**
- Migrasi `0043-shop-bundle.up.sql` — `shipping_bundles` (status
  TERBUKA/PENUH/DITUTUP, slot_maks 2–5) + `bundle_items` (snapshot
  JSONB wajib berkey name/price/link, UNIQUE (bundle_id, user_id)
  = 1 slot per user).
- `src/services/bundle.ts` — BundleService + SHIPPING_TARIFFS (12
  kota, tarif statis admin) + estimateSaving rumus
  `(single × n − bundle) ÷ n` (dibulatkan, tidak negatif, capped
  di slot maks):
  - `createBundle()` — pembuat = anggota #1; tolak double-slot
    sekota.
  - `joinBundle()` — tolak jika PENUH/DITUTUP/sudah tergabung;
    autoClose saat n = slot_maks → PENUH.
  - `leaveBundle()` — hanya sebelum PENUH; bundel kosong → DITUTUP.
  - `listBundles()` — items.mine menandai keanggotaan viewer.
- API: `GET/POST /api/v1/ebelanja/bundles`,
  `POST .../bundles/[id]/join`, `DELETE .../bundles/[id]/leave`.
- UI `src/components/shipping-bundle-section.tsx` — kartu bundel
  (sisa slot n/5, estimasi hemat angka besar + label "simulasi",
  daftar item dengan link `rel="sponsored"`), form bentuk bundel
  inline, form gabung inline per kartu (bukan window.prompt —
  prompt asli dilarang), tombol keluar, filter kota.
- Section ditanam di `shop-page.tsx` (paling bawah katalog).
- CSS `.bundle__*` di `social-redesign.css`.

**Verifikasi:** tsc EXIT 0 · rumus estimateSaving teruji:
  - n=1 → 0
  - Jakarta n=5: (15000×5 − 22000) ÷ 5 = 10600 ✓
  - n=0/negatif → 0 (tidak pernah merugikan)
  - n=100 → capped di 5 (slot maks)

## Catatan Eksekusi (prinsip INOVASI-0841)

- **Tidak ada dependency baru** — SVG peta murni, form inline,
  serial angka romawi manual. Hanya Termux-friendly.
- **Tidak ada popup/modal** — semua aksi (vote, ajukan, lapor,
  gabung, filter) inline. window.prompt() yang muncul di draft awal
  diganti form inline sebelum commit.
- **Tidak menambah ruang ke-8** — kedua fitur Line masuk ke tab
  "Kolaborasi" yang masih dalam ruang Line (7 ruang utuh).
- **Mode online = SIMULASI** — kanonisasi mingguan adalah method
  yang dipanggil operator server (bukan cron betulan), estimasi
  hemat = tabel tarif statis admin berlabel "simulasi".

## Known Issue (pre-existing, BUKAN dari pekerjaan ini)

- `tests/unit/invitation-order-form.test.tsx` — "keeps field IDs
  unique" gagal: expect 12 field, actual 6. Saya TIDAK menyentuh
  file ini; kemungkinan efek dari port JASA-PORT-001 (form undangan
  di-split ke standalone component). Perlu triase terpisah.
- `tests/unit/prompt03-behavior.test.tsx` — hang (SearchOverlay
  infinite re-render, K-02). Tetap di-exclude seperti sesi sebelumnya.
