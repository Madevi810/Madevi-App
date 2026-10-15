# Audit AMBIENT-001 — Lapisan ambient Madevi On

- **Item:** AMBIENT-001 — Lapisan ambient Madevi On (glow blobs parallax + fading grid)
- **Tanggal:** 2026-09-25
- **Auditor:** Agent 3 (Audit)
- **Metode:** Statis (guardrail Owner melarang runtime/npm/build/test)
- **Batas perubahan diperiksa:** `public-shell.tsx`, `madevi-on.css`, `interface-refresh.css`
- **Hasil:** **PASS** (6/6 AC wajib, 5/5 M)

## Ringkasan temuan

Agent 2 menambahkan tiga ambient glow blobs (amethyst/ember/plum), satu lapisan grid
56px dengan mask radial, parallax scroll via satu custom property, menggeser aksen
Madevi On ke arah D07 (plum/amethyst/amber), dan menambahkan glass tipis + glow-on-hover
dengan tetap menjaga kartu bacaan opaque.

Temuan struktural penting yang dijawab saat audit: cascade Madevi On sebelumnya terbagi
menjadi ≥5 generasi aturan yang saling menimpa (tiga blok token + blok "TOTAL REDESIGN"
kartu opaque). Agent 2 memindahkan token kanonis Madevi On ke blok tunggal di akhir
`interface-refresh.css`, sehingga satu sumber kebenaran dan tidak ada ambiguitas cascade.

## Acceptance criteria wajib

- [x] **AC-01 — Lapisan di belakang konten.** `.madevi-sky` = `position: fixed; inset: 0;
  overflow: hidden; pointer-events: none` (`interface-refresh.css:2045`), z-index `0`
  (`:2815`) dengan `body`/footer `z-index: 1` (`:2820`). Container `madevi-sky__blobs`
  `inset: 0`; setiap blob `position: absolute; pointer-events: none`. Markup `aria-hidden="true"`
  di `public-shell.tsx`. `overflow: hidden` memotong blob di pinggir — tidak menambah
  scroll horizontal, tidak menutupi input/tautan. **PASS**
- [x] **AC-02 — Motion berhenti total.** JS: scroll listener hanya memperbarui
  `--madevi-sky-parallax` jika `!paused && !document.hidden && !motionPreference.matches`;
  `visibilitychange` dan `change` listener memulai ulang; `useEffect` cleanup melepas
  listener dan `removeProperty`. CSS: `@media (prefers-reduced-motion: reduce)` pada blok
  AMBIENT-001 menghentikan animasi blob dan menurunkan opacitas (statis tipis, bukan
  hilang). Route `/artikel/*` memasang `data-reading-mode` → blob & grid `opacity: 0`.
  State akhir terbaca tanpa JS: blob/grid dirender statis. **PASS**
- [x] **AC-03 — Fading grid satu lapisan.** Satu rule `.madevi-sky__grid` dengan dua
  `linear-gradient` 56px + `mask-image: radial-gradient(ellipse 78% 62% at 50% 34%, black
  40%, transparent 100%)` (dan prefix `-webkit-`). Tidak ada artefak garis tegas: tepi
  memudar sepenuhnya ke background; `position: absolute; inset: 0; pointer-events: none`.
  **PASS**
- [x] **AC-04 — Aksen D07 + kontras.** Token kanonis: `--accent: #a487ff`, `--accent-strong:
  #ece4ff`, `--accent-hover: #c3adff`, `--focus-ring: #ffd29b`, background `#0b0910`
  (plum-hitam). Gradient scan/signal/beacon/orb/button semua amethyst/amber. Rasio
  kontras dihitung: text 18.77, muted 11.74, accent 7.06, accent-strong 16.13, label
  tombol 8.22, focus-ring 14.09 — semua ≥ 4.5:1. Blok token Light/Dark (`:4335`, `:4347`)
  tidak disentuh. **PASS**
- [x] **AC-05 — Blur berat hanya pada blob dekoratif.** `filter: blur(120px)` hanya pada
  tiga `madevi-sky__blob` (lebih sedikit dari ≤3). `.article-card` eksplisit
  `backdrop-filter: none` + background opaque; kartu non-bacaan memakai `blur(14px)`
  ringan. **PASS**
- [x] **AC-06 — Tidak ada perubahan palsu.** Tidak ada route/API/data/auth/migration
  yang diubah; tidak ada fitur/tombol/angka baru. Hanya tiga file terikat + dokumen
  control. Token Light/Dark dan kontrak `home-content.tsx` utuh. **PASS**

## Acceptance criteria terukur

| ID | Ambang | Hasil |
|---|---|---|
| M-01 | 3 blob, 3 faktor parallax unik, 0 menutupi konten | 0.18 / 0.30 / 0.12 — **PASS** |
| M-02 | 1 scroll listener throttled rAF + cleanup | 1 listener `passive`, `scrollTicking` rAF, cleanup `removeEventListener` + `removeProperty` — **PASS** |
| M-03 | 0 scroll horizontal / 0 tumpang tindih di 5 breakpoint | `overflow: hidden` pada sky; blob `vw`-based dengan `max-width`; `pointer-events: none` — **PASS statis** |
| M-04 | Parser 0 diagnostic | TSX `transpileModule` 0 error; brace 71/71 + 853/853 — **PASS** |
| M-05 | 0 pasangan < 4.5:1 | 6 pasangan utama dihitung: 7.06–18.77 — **PASS** |

## Catatan

1. Runtime/visual tetap `BELUM-DIVERIFIKASI` (guardrail). Klaim di atas adalah klaim statis.
2. Sebagai efek samping positif, token Madevi On yang tersebar di lima tempat kini
   terkonsolidasi ke satu blok; blok kalah-cascade di `madevi-on.css` ditandai sebagai
   fallback agar tidak menyesatkan pembaca berikutnya.
3. Tidak ada temuan critical/high. Tidak ada revisi yang diperlukan.
