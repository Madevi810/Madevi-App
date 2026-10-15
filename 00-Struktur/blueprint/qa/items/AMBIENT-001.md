# AMBIENT-001 — Lapisan ambient Madevi On (glow blobs parallax + fading grid)

## Scope dan dependency

- **Tujuan pengguna:** suasana Madevi On terasa hidup dan premium mengacu gamenative.app
  (disesuaikan, bukan disalin): cahaya ambient lembut yang bergerak saat scroll, peta grid
  memudar di tepi, serta aksen berpindah dari biru kerja ke arah **black/plum + amethyst/amber**
  sesuai D07. Semua tetap di lapisan belakang: struktur, navigasi, dan konten tidak bergerak.
- **Batas perubahan:** `Madevi_Off/src/components/public-shell.tsx` (lapisan ambient),
  `Madevi_Off/src/styles/madevi-on.css`, `Madevi_Off/src/styles/interface-refresh.css`
  (hanya aturan yang menyentuh `.madevi-sky`/ambient Madevi On), serta bukti control untuk
  item ini. **Tidak mengubah** route, API, data, auth, migration, token Light/Dark, struktur
  sidebar/header, kontrak `home-content.tsx`, atau komponen artikel.
- **Dependency / blueprint terkait:** `UX-REDESIGN-001` (PASS), `blueprint/desain/UI-UX-DAN-TEMA.md`,
  `GUARDRAIL.md`, `DECISIONS.md` D05–D10, serta riwayat item `AMBIENT-001` di `INDEX.md`.
- **Fakta awal:** `MadeviSky` saat ini memakai starfield SVG statis + 3 meteor WAAPI; aksen
  token `--accent` masih biru (#54b8ff) sedangkan D07 menetapkan arah plum/amethyst/amber.
  `MotionOrchestrator` sudah punya IntersectionObserver + cleanup + reduced-motion gate.
  Route `/artikel/*` sudah memakai `data-reading-mode` dan `paused` untuk menghentikan meteor.

## Rancangan (adaptasi ke Madevi, bukan menyalin)

1. **Ambient glow blobs (mesh gradient)** — 3 elemen HTML lingkaran `aria-hidden` di
   `.madevi-sky` (bukan gambar), blur berat (filter CSS, `will-change: transform`),
   warna plum/amethyst/amber sesuai D07. Posisi tetap di latar z-index -1, pointer-events none.
2. **Parallax scroll blob** — JS ringan memperbarui satu CSS custom property
   (`--madevi-sky-parallax`) pada `scroll` (throttled via `requestAnimationFrame`); blob memakai
   `transform: translate3d(0, calc(var(--madevi-sky-parallax) * <faktor>), 0)` dengan faktor
   berbeda per blob. **Tidak** memakai plugin; pasif (hanya scroll listener + cleanup).
   Berhenti total saat `prefers-reduced-motion` dan saat route artikel.
3. **Fading grid** — satu lapisan CSS di `.madevi-sky`: `background-image: linear-gradient`
   tipis 56px + `mask-image: radial-gradient(ellipse, black 40%, transparent 100%)` agar tepi
   memudar ke background. `aria-hidden`; tidak menambah node yang menutupi konten.
4. **Aksen warna ke arah D07** — geser token aksen Madevi On dari biru ke
   plum/amethyst/amber: `--accent`, `--accent-strong`, `--accent-hover`, `--accent-subtle`,
   `--focus-ring`, `--border-glow`, dan warna meteor/scan/signal/orb mengikuti. Pertahankan
   kontras teks (periksa pasangan utama ≥ 4.5:1). **Tidak** mengubah Light/Dark.
5. **Glass tipis + glow-on-hover** — pertajam glass card Madevi On: background gradien
   `from-white/[0.06] to-white/[0.02]` setara (sangat transparan) + border terang tipis +
   `backdrop-filter` dengan fallback; tombol primer mendapat `box-shadow` berwarna pada hover.
   Kartu bacaan/artikel **tetap opaque** (D08) — glass hanya pada chrome, panel sementara,
   dan kartu non-bacaan.

## Acceptance criteria wajib

- [x] AC-01 — Lapisan ambient hanya berada di belakang konten (`z-index: -1`, `position: fixed`,
  `pointer-events: none`, `aria-hidden`); tidak menutupi, menggeser, atau menghalangi input,
  tautan, dan navigasi.
- [x] AC-02 — Semua motion baru (blob parallax, pulse blob) berhenti total pada
  `prefers-reduced-motion`, saat `document.hidden`, dan saat route `/artikel/*`; state akhir
  tetap terbaca tanpa JS.
- [x] AC-03 — Grid memudar hanya satu lapisan CSS dengan mask radial; tidak ada artefak
  garis tegas di tepi viewport pada 320/375/768/1024px.
- [x] AC-04 — Aksen warna pindah ke arah black/plum + amethyst/amber (D07); kontras teks
  utama tetap ≥ 4.5:1 dan tombol tetap dapat dibaca; Light/Dark tidak berubah.
- [x] AC-05 — Tidak ada blur berat pada kartu bacaan/artikel; blur berat hanya pada ≤3 blob
  dekoratif demi biaya render Android.
- [x] AC-06 — Tidak ada route, API, data, fitur, tombol, atau angka palsu yang ditambahkan;
  kontrak route, auth/session, CSRF, migration, dan token Light/Dark tidak berubah.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 3 blob ambient | Inspeksi DOM/CSS + faktor parallax berbeda | 0 blob menutupi konten; 3 faktor unik | PASS |
| M-02 | 1 scroll listener | Inspeksi throttle rAF + cleanup `useEffect` | 1 listener, dibersihkan | PASS |
| M-03 | 5 breakpoint (320/375/768/1024/desktop) | Inspeksi statis reflow + z-layer | 0 scroll horizontal, 0 tumpang tindih | PASS |
| M-04 | 5 file terkait | Parser TypeScript/CSS balance | 0 diagnostic | PASS |
| M-05 | 8 pasangan warna teks/aksi | Pemeriksaan statis rasio kontras | 0 pasangan < 4.5:1 | PASS |

## Verifikasi yang diizinkan

- **Statis:** inspeksi source, parser TypeScript `transpileModule`, keseimbangan brace CSS,
  pencarian z-index/pointer-events, perhitungan rasio kontras, dan audit cascade stylesheet.
- **Runtime (jika Owner mengizinkan):** pindahan blob saat scroll pada browser, perilaku
  reduced-motion, dan tampilan grid pada breakpoint nyata.
- **Yang sengaja tidak dijalankan dan alasannya:** npm, lint, build, test, server, database,
  atau request API, karena guardrail Owner masih melarang proses tersebut.

## Risiko dan rollback

- **Risiko:** Geser aksen biru → amethyst dapat membuat pasangan warna lama jatuh di bawah
  kontras. Mitigasi: token semantik dipertahankan strukturnya, hanya nilainya; verifikasi
  rasio pada pasangan utama sebelum klaim.
- **Risiko:** blur berat 3 blob pada Android dapat membebani render. Mitigasi: blob pasif
  (transform saja), `will-change` terbatas, dan blur pada lapisan terisolasi.
- **Compatibility/migration:** Tidak ada schema, route, atau kontrak server yang diubah.
  Token Light/Dark tidak disentuh, jadi tema kerja tetap stabil.
- **Recovery:** Kembalikan `public-shell.tsx` + bagian ambient `madevi-on.css`/
  `interface-refresh.css`; tidak ada data atau migrasi yang terlibat.
