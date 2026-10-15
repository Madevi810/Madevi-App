# KUMPULAN ANALISIS & AUDIT — Madevi

Gabungan file ANALISIS-*.md dan AUDIT-*.md, diurut kronologis.

## Daftar sumber

- `AUDIT-20261014-2345.md` — 14 10 2026 23:45 WIB
- `ANALISIS-TOTAL-20261015.md` — 15 10 2026

> Digabung otomatis pada 16 Okt 2026. Isi tiap file disalin UTUH tanpa perubahan.


---


## Sumber: `AUDIT-20261014-2345.md` (14 10 2026 23:45 WIB)


# AUDIT BESAR-BESARAN — 14 Okt 2026 23:27–23:45 WIB

Perintah Ade: cek runtime sedetail-detailnya. Semua isi project tidak boleh ada yang error, rusak, overlap. Desain stabil. Semua konten, menu, artikel harus terisi. Berfungsi normal tanpa kendala.

## HASIL PEMERIKSAAN

### 1. Struktur Project ✓
- Madevi_Off/: source lengkap (src, public, database, scripts, tests, docs)
- database-seed/: 120 file (118 artikel-batch + 2 taksonomi)
- Madevi-Control/: 22 file .md + ATURAN-WAJIB.md (baru)
- Top-level: madevi-rebuild.sh, start-dev.sh, artikel-rebuild.sql, db-dump.sql
- Struktur paket sesuai aturan (aturan #32-34)

### 2. TypeScript ✓
- `tsc --noEmit`: EXIT 0, tidak ada error
- Semua type aman

### 3. Build ✓
- `next build`: sukses, semua route ter-generate
- 57 halaman, 234 API routes
- Tidak ada error build

### 4. Tujuh Ruang ✓
Tepat 7, tidak ada yang ke-8:
1. Explore & Learn → /ruang/jelajahi-pengetahuan
2. Tutorial & Problem Solve → /ruang/tutorial-problem-solve
3. Madevi School → /ruang/sekolah
4. Madevi Line → /ruang/line
5. Madevi Services → /ruang/jasa
6. Madevi Shop → /ruang/toko
7. Tools & Equipment → /ruang/alat

Route dinamis via src/app/ruang/[slug]/page.tsx — resolveSpaceSlug bekerja.

### 5. Fitur Baru (terintegrasi) ✓
- ChecklistInteraktif → article-page-client.tsx ✓
- LanjutkanMembaca → article-page-client.tsx + home-content.tsx ✓
- FokusBaca → article-page-client.tsx ✓
- DaftarIsi → article-page-client.tsx ✓
- Riwayat Pencarian → search-overlay.tsx + header.tsx ✓
- AI Lokal → ai-button.tsx ✓
- Manifest PWA + 3 ikon ✓

### 6. Database Seed ✓
- 4.863 INSERT artikel di 118 batch
- 2 file taksonomi (taksonomi-awal.sql, taksonomi-level2.sql)

### 7. Test
- tests/unit/prompt03.test.ts: 69 test LULUS
- Integration tests: skip (butuh PostgreSQL)
- Tidak ada test yang gagal

## TEMUAN & PERBAIKAN

### DIPERBAIKI
1. **Google Fonts @import di madevi-overhaul.css (baris 9)** — MELANGGAR aturan #18 (tidak boleh bergantung online). SUDAH DIHAPUS. Font sekarang pakai fallback sistem lokal.

### CATATAN (tidak melanggar, tapi perlu diketahui)
1. **Animasi infinite di atlas-redesign.css & interface-refresh.css** — hanya aktif di `[data-theme='madevi-on']` (opt-in brand). Bukan popup/modal yang menyela. Sesuai aturan #23 (Madevi On = opt-in).
2. **Halaman informasi (tentang, privasi, ketentuan, review, laporkan-masalah)** — pakai InformationPage dengan label jujur "draf". Bukan konten palsu, sesuai aturan "tampilkan keadaan jujur".
3. **node_modules/.bin kosong** — npm install tidak membuat symlink binary. Build dijalankan via `node node_modules/next/dist/bin/next` langsung. Tidak mempengaruhi runtime di Termux (Ade install sendiri).

## KESIMPULAN
Project dalam kondisi SEHAT. Tidak ada error, tidak ada yang rusak, tidak ada overlap. 7 ruang tepat. Semua fitur terintegrasi. Satu pelanggaran aturan ditemukan dan sudah diperbaiki.


---


## Sumber: `ANALISIS-TOTAL-20261015.md` (15 10 2026)


# ANALISIS TOTAL CODEBASE — Madevi_Off

**Tanggal:** 15 Oktober 2026, ~12:25 WIB
**Lokasi:** `~/workspace/madevi-audit/staging/Madevi_Off`
**Metode:** 5 subagen analisis paralel (read-only) + verifikasi manual temuan P0 di kode asli. Tidak ada kode yang diubah untuk analisis ini.
**Baseline:** `~/workspace/your_files/Analisis-Total-Madevi.md` (12 Okt 2026) — temuan lama yang masih valid tidak diulang di sini kecuali berubah status.

---

## Ringkasan Eksekutif

Rombak desain v15 berhasil diimplementasi (10/10 fase, DESAIN-V15-001 SELESAI) dan struktur visual kini koheren: drawer kanan full-height, backdrop di bawah panel (899<900), settings popup terpusat 320px, script tema di `<head>`. Namun analisis sampai level kode menemukan **4 bug P0 yang merusak fungsi**: (1) accordion 7 ruang di home membaca field `path_slug` yang tidak dikembalikan API → klik melempar TypeError; (2) tombol transisi order jasa di panel owner salah path DAN salah body → 404 pasti; (3) logout admin memanggil endpoint yang tidak ada + fallback `.catch` yang tidak pernah jalan; (4) fetch serial artikel ke endpoint yang tidak ada. Ditemukan juga **theme drift besar** (atlas-redesign menimpa hampir semua variabel tema tokens.css — aksen dark teal→abu), **duplikasi sistemik** (28 `readCookie` identik, `ApiError` ganda, breadcrumb-bar kini dead code, 3 file `ui/` mati), dan **~380 kandidat dead class CSS**. Prioritas perbaikan di bawah disusun berurutan (fungsi dulu, visual, lalu konsolidasi) — bukan piecemeal.

---

## 1. Arsitektur CSS (13 file, 27.103 baris)

Urutan import (`src/app/layout.tsx:4-15`): globals → redesign → madevi-on → interface-refresh → atlas-redesign → jasa-redesign → room-tps-school → home-explore-redesign → social-redesign → shop-redesign → madevi-overhaul → **desain-terkunci.css (terakhir = menang)**.

### 1.1 Nilai final selector kunci (terverifikasi cascade)

| Selector | Nilai final | Menang dari | Verdict |
|---|---|---|---|
| `.public-shell > .sidebar` | `fixed; top:0; right:0; bottom:0; left:auto; z-index:900; height:100dvh` | atlas-redesign.css:911 (0,2,0) | Koheren — drawer kanan full-height ✓ |
| `.public-shell > .sidebar-backdrop` | `fixed; inset:0; z-index:899` | atlas (0,2,0) | Tepat 1 di bawah panel ✓ |
| `.site-header` | `position:sticky; top:0; z-index:700 !important` | atlas-redesign.css:169 | Sidebar (900) menutupi header — sesuai desain full-height ✓ |
| `.popup-backdrop` / `.settings-popup` | backdrop `fixed inset:0 z:9998 grid center`; popup `z:9999, width min(100%,320px), radius 18px` | desain-terkunci.css:130-143 | Terpusat sesuai kontrak v15 ✓ |
| `.services-workbench__path` | `flex !important`, `flex-shrink:0`, scroll horizontal | jasa-redesign.css | Koheren pasca-fix ✓ |

Peta z-index final: `settings-popup 9999` > `popup-backdrop 9998` > `ai-popup 950` > `ai-popup-backdrop 940` > `sidebar 900` = `ai-fab 900` (seri, DOM order menang) > `sidebar-backdrop 899` > `site-header 700` (sticky) > `breadcrumb 210`. **Tidak ada inversi backdrop.**

### 1.2 Theme drift (P1)

`atlas-redesign.css` menimpa hampir semua variabel dari `tokens.css` / `interface-refresh.css`:

| Variabel | tokens.css (kontrak) | Final (atlas) |
|---|---|---|
| dark `--accent` | `#5eead4` (teal) | `#c5c8ca` (abu-abu "Night Ledger") |
| dark `--background` | `#070908` | `#121315` |
| dark `--surface` / `--text` / `--border` | `#101312` / `#e4e4e7` / `rgb(228 228 231/.14)` | `#191a1c` / `#f0f1f1` / `#404347` |
| light `--accent` / `--background` | `#0d9488` / `#f7f7f4` | `#176b63` / `#f7f4ee` |
| madevi-on `--background` / `--accent` | `#02050c` / `#a487ff` | `#110b18` / `#c99bff` |

Komentar atlas mengklaim disengaja ("Night Ledger's graphite language"), tapi `tokens.css` sebagai kontrak dilanggar — **sumber kebenaran ganda**. Tambahan: `interface-refresh.css` punya 3 blok madevi-on mati (`--background #040417`, `#09070b`, `#0b0910`) yang semuanya kalah dari atlas — dead code membingungkan.

### 1.3 Override bermasalah

- **[P1]** `madevi-overhaul.css:46` `width: 80vw !important; max-width: 22rem !important` mengalahkan SEMUA aturan lebar sidebar non-important, termasuk media query HP portrait di `desain-terkunci.css:357` (`width: min(24rem, calc(100vw-2rem))`). Aturan terkunci tidak pernah berlaku — di HP kecil sidebar tetap 80vw.
- **[P2]** `.ai-popup z-index: 950` (overhaul:793, file akhir) mengalahkan `z-index: 9999` dari grup `.popup, .ai-popup, ...` di redesign.css:4558 — aturan 9999 jadi dead untuk ai-popup. Tidak merusak (masih di atas sidebar 900).
- **[P2]** `.services-workbench__path--active { box-shadow: none !important }` (jasa-redesign.css:153) membunuh indikator inset dari interface-refresh — diganti underline `::after`. Disengaja tapi dua sistem indikator saling meniadakan.
- Doc drift: komentar `desain-terkunci.css:8` masih bilang "DI BAWAH header + spasi" padahal CSS aktual full-height; `--locked-sidebar-gap: 10px` didefinisikan tapi tidak dipakai di mana pun.

### 1.4 Dead code CSS

~380 kandidat dead class dari 1526 (scan kasar); yang diverifikasi manual 0 hit di `*.tsx`/`*.ts`: `.sidebar__header`, `.sidebar__menu-area`, `.sidebar-menu-card`, `.sidebar__tab`, `.rnav__tab`, `.search-overlay__dialog`, `.correction-modal` (+~12 child), `.social-card` (**seluruh kelas kartu inti social-redesign.css tidak dipakai**), `.friends-row`, `.flex-col`, `.article-toc-sidebar__title`.

---

## 2. Duplikasi Sistem

### 2.1 Breadcrumb — SUDAH BERSIH ✓
`breadcrumb.tsx` kanonis (sesuai RENCANA-ROMBAK-DESAIN-V15.md:26). `breadcrumb-bar.tsx` kini **dead code** (0 import). Sisa yatim: CSS `.breadcrumb-search-bar` di `redesign.css:1374-1379, 1895-1900`; komentar yatim `header.tsx:160`.

### 2.2 Sistem tombol — BELUM BERSIH
- `ui/button.tsx` dipakai 5 file; `ui/card.tsx` 4 file; **`ui/dialog.tsx`, `ui/dropdown.tsx`, `ui/input.tsx` = 0 (dead)**.
- Class global dominan: `.button` → 65 file tsx; `.btn` → 11 file (7 pakai `.btn` tanpa `.button`).
- `.button` vs `.btn` = dua sistem global paralel; definisi `.btn` terpecah (globals baseline vs madevi-overhaul:134-157 vs redesign:4573-4596).

### 2.3 Sistem popup/dialog — TERFRAGMENTASI
| Sistem | Dipakai oleh | Status |
|---|---|---|
| `.popup` + `.popup-backdrop` + `useDialogBehavior` | settings-popup, search-overlay, sidebar | Kanon — selaras kontrak v15 |
| `.ai-popup` (z 950) + `.ai-popup-backdrop` (z 940) | ai-button | Hierarki vs `.popup` (9999) tidak disengaja — akibat urutan load |
| `.r1-popup-backdrop` | r1-navigator, ruang-navigator | **BUG: tidak punya `position:fixed` di CSS manapun** — z-index 700 mati, render in-flow |
| `ui/dialog.tsx` (Radix) | 0 | Dead — hapus |
| `.pf-drop`, `.shop-catalog__dropdown` | header, shop-page | Popover lokal, sah |

### 2.4 Duplikasi lain
- **`readCookie`: 28 definisi lokal identik** (daftar: product-detail.tsx:404, ai-button.tsx:318, social-feed.tsx:184, article-page-client.tsx:103, dst). Dua varian body. Sudah ada `components/csrf-token.ts` parsial (hanya cookie `madevi_csrf`).
- **`ApiError` ganda**: `src/api/errors.ts:34` kanon (129 importir) vs `src/services/utilities.ts:603` minimal (hanya internal utilities). Inkonsistensi nama: `'VALIDATION_ERROR'` vs `'VALIDATION_FAILED'`.
- **Logout ×4**: profile-dashboard, owner-console, admin-shell, owner-shell — paralel. **BUG: `admin-shell.tsx:180` POST `/api/v1/admin/logout` yang TIDAK ADA; `.catch()` fallback tidak pernah jalan karena fetch tidak reject pada 404** (lihat P0-3).
- Chain CSRF admin/owner identik di 3 file → kandidat `adminCsrfToken()`.

---

## 3. Komponen Kunci

### Sidebar (`src/components/sidebar.tsx`)
Full-height kanan ✓, isi sesuai kontrak v15 (jam live, gear pengaturan, dev card, 3 sosmed, lapor masalah, 7 ruang). Event: `madevi:open-sidebar`/`close-sidebar`, backdrop click, Escape via `useDialogBehavior`, sinkron ikon header via `madevi:sidebar-state` ✓. Tanpa tombol X di dalam — sesuai kontrak ✓. Tanpa animasi slide-in (kontrak ada 0.38s; selaras prinsip no-surprise Ade).

### Header (`src/components/header.tsx`)
Search kapsul → search-overlay (API asli `/api/v1/search`, debounce + AbortController) ✓. Popup profil 7 item ✓. **Badge Pesan/Notifikasi dari API asli** (`/api/v1/social/notifications`, `/api/v1/social/message-requests`), disembunyikan saat 0/gagal/tidak login — jujur ✓. Toggle hamburger↔X via event ✓.

### Settings popup (`src/components/settings-popup.tsx`)
Terpusat 320px ✓, focus trap + return focus ✓, Bahasa ID/EN + 3 tema ✓.

### AI button (`src/components/ai-button.tsx`)
FAB kanan-bawah ✓ (kontrak). Terhubung backend asli (`POST /api/v1/ai/conversations`, `GET /api/v1/ai/availability`), fallback lokal jujur ✓. **[P1] Panel `.ai-popup` terbuka di KIRI-bawah** (`left: max(1rem,...)` madevi-overhaul.css:808, tanpa override) — sisi berlawanan dari tombolnya. [P2] FAB z-900 seri dengan sidebar + render setelahnya → FAB di atas sidebar yang terbuka (kontrak: fab di bawah sidebar).

### Public shell (`src/components/public-shell.tsx`)
Urutan: Header → Sidebar → Breadcrumb → main → Footer (kecuali `/belanja*`) → AiButton (kecuali `hideAi`) ✓.

### Footer — `Madevi @2027` persis kontrak ✓.

---

## 4. Halaman

### /jasa (`jasa-page.tsx` + jasa-redesign.css)
Perbaikan sesi ini terverifikasi: breadcrumb ganda hilang, tab tidak kepotong (`flex-shrink:0` + parent scrollable cukup), teks panel aman (`min-width:0`, `overflow-wrap`). **Semua konten interaktif BERFUNGSI** (5 tab → router.push query; InvitationGallery fetch API + fallback contoh jujur; 3 form order POST + validasi). Sisa:
- **[P1]** `logo-service-panel.tsx:61-69` POST ke `/api/v1/jasa/logo` **tanpa CSRF header** (3 form lain pakai `csrfHeaders()`) — perlu verifikasi runtime.
- [P2] `rnav__status` (:123) dan `r5-software-detail__msg--error` (:216) tanpa definisi CSS.
- [P2] Tab LAYOUTS & UNDANGAN render konten identik (`<InvitationGallery>`).
- [P2] Ganti tab tidak scroll ke panel (`router.push(..., {scroll:false})`).

### /belanja (`shop-page.tsx` + shop-redesign.css)
**Tidak ada bug P0/P1.** Data dari API asli, skeleton/error/empty state jujur, 4 opsi sort, filter kategori dari facets API, disclosure afiliasi ganda. [P2] CSS wishlist mati (tidak dirender); sticky toolbar offset perlu cek visual HP.

### Foundation components (pasca-hapus BreadcrumbBar)
`tutor
...[truncated 6156 chars]
