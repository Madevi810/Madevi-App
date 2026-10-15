# UX-001-REV1 — Revisi umpan balik global tanpa pergeseran

## Scope dan dependency

- **Tujuan pengguna:** Fondasi Madevi menjadi *Layered Editorial Interface*, bukan katalog card: hover workspace tetap tidak menggeser permukaan; fokus keyboard jelas; Basic Light/Dark hidup sebagai tema baca-teal dengan motion pendek yang tunduk pada reduced-motion; On menjadi *Deep Signal* hanya pada Home/navigasi/CTA/Asisten; Dashboard langsung ke operasi tanpa hero/copy dekoratif; menu **Kebutuhan ruang** memberi rencana tindakan untuk seluruh ruang kanonis.
- **Batas perubahan:** Hanya `Madevi_Off/src/components/home-content.tsx`, `sidebar.tsx`, `src/styles/tokens.css`, `globals.css`, `redesign.css`, `interface-refresh.css`, dan bukti control item ini. Tidak mengubah route, API, data, kontrak `MADEVI_SPACES`, atau JavaScript motion yang sudah bertarget.
- **Dependency / blueprint terkait:** `UX-001` (PASS), `blueprint/GUARDRAIL.md`, `blueprint/desain/UI-UX-DAN-TEMA.md`, dan keputusan D05 tentang antarmuka kerja tanpa hover-lift generik.
- **File/kontrak diperkirakan:** selector generik `.card`, `.article-card`, `.mdv-card--interactive`, kelompok permukaan kerja `:is(...)`, state form `:focus`/`:focus-visible`, token semantik Dark, override komponen global Dark, serta pemetaan presentasi dari `MADEVI_SPACES` pada Beranda/sidebar.

## Acceptance criteria wajib

- [ ] AC-01 — Selector hover/active generik untuk kartu dan permukaan kerja tidak memakai `transform` yang mengangkat/menggeser elemen.
- [ ] AC-02 — Selector generik tersebut tidak menetapkan `will-change: transform`; `will-change` yang bertarget di komponen animasi lain tidak disentuh.
- [ ] AC-03 — Hover/focus tetap memiliki umpan balik non-posisional melalui token border, shadow, atau warna dan tidak menghapus `focus-visible`.
- [ ] AC-04 — Tidak ada perubahan pada kontrak route/API/data atau motion eksplisit yang bukan bagian selector generik; Madevi On tidak berubah di luar cascade yang dibagi dan perubahan Basic terbatas pada cue ruang.
- [ ] AC-05 — Fokus keyboard pada tautan, tombol, dan field tetap memiliki outline yang jelas pada cascade akhir; style `:focus` pointer tidak dapat menimpa state `:focus-visible`.
- [ ] AC-06 — Dark memetakan latar, surface, card, hover, teks utama, teks pendukung, dan aksi ke token netral berbeda; komponen UI Dark tidak memakai latar putih hard-code.
- [ ] AC-07 — Beranda dan sidebar menyebut menu **Kebutuhan ruang** dan menampilkan seluruh tujuh ruang aktif dari `MADEVI_SPACES`, masing-masing dengan kebutuhan/rencana yang jujur serta href kanonis.
- [ ] AC-08 — Navigator Kebutuhan ruang memberi target sentuh jelas, state hover/focus non-posisional, dan reflow 2→1 kolom tanpa scroll horizontal.
- [ ] AC-09 — Light dan Dark memberi tujuh ruang bingkai warna kontekstual serta aturan sisi yang konsisten, tanpa gradien dekoratif, glow, atau perubahan pada kanvas/teks netral utama.
- [ ] AC-10 — Variasi Basic melampaui menu ruang: chrome/navigasi, panel, kontrol, data/tabel, dan status memakai peran warna yang konsisten; warna tidak menjadi satu-satunya pembawa arti.
- [ ] AC-11 — Beranda memakai hero horizontal padat, tiga ruang awal memiliki hirarki ukuran berbeda pada desktop, bacaan terbaru berbentuk daftar editorial, dan eyebrow/copy dekoratif dipangkas tanpa menghapus informasi tindakan.
- [ ] AC-12 — Basic memiliki feedback masuk/tekan/link/progres-baca yang singkat serta fallback statis; On membatasi animasi signal pada Home/header/menu aktif/CTA/Asisten dan menjaga artikel/form/tabel/Admin tenang.
- [ ] AC-13 — Dashboard Admin memulai langsung dari ringkasan operasi dan state bermakna; header ready serta navigasi tidak mengulang eyebrow/paragraf pembuka.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | Semua kelompok selector kartu/permukaan kerja generik | Inspeksi rule Light/Dark/Madevi On di dua stylesheet | 0 `translateY` / `will-change: transform` generik | belum |
| M-02 | 2 stylesheet | Pemeriksaan keseimbangan brace CSS | 0 brace tak berpasangan | belum |
| M-03 | 4 tipe field global | Inspeksi cascade `:focus` / `:focus-visible` akhir | 1 outline 3px untuk state keyboard; 0 rule pointer yang menimpanya | belum |
| M-04 | 7 token Dark + 3 override global | Inspeksi token/cascade statis | background, surface, card, hover, primary, muted, aksi berbeda; 0 latar putih hard-code pada komponen Dark | belum |
| M-05 | 7 ruang aktif | Inspeksi pemetaan `SpacePresentationKey` dan render `spaces.filter(ACTIVE)` | 7/7 kebutuhan menuju href `MADEVI_SPACES`; 0 route/fungsi rekaan | belum |
| M-06 | Navigator Beranda | Inspeksi CSS breakpoint | desktop 2 kolom, ≤48rem 1 kolom, 0 transform lift | belum |
| M-07 | 7 ruang × 2 tema Basic | Inspeksi token `data-space` dan frame `home-needs` | 14 cue warna; latar/teks utama tetap token netral; 0 override Madevi On | belum |
| M-08 | 5 peran × 2 tema Basic | Inspeksi token/cascade chrome, panel, kontrol, data, status | 10 token peran; 0 gradien/glow/warna kanvas baru; fokus keyboard tetap 3px | belum |
| M-09 | Home + Owner Console | Inspeksi markup dan breakpoint CSS | 0 eyebrow dekoratif pada header Home/Owner ready; hero min-height 0; desktop 3→1 ruang pada ≤48rem | belum |
| M-10 | Motion Basic/On | Inspeksi keyframe, selector scope, dan reduced-motion | Basic ≤3 blok Home + marker baca; On hanya hero/header/menu/CTA/AI; 0 entrance/ambient motion pada form/table/Admin; semua berhenti pada reduce | belum |

## Verifikasi yang diizinkan

- **Statis:** inspeksi selector/cascade akhir dan pemeriksaan keseimbangan brace CSS.
- **Runtime (jika Owner mengizinkan):** hover/focus pada kartu Explore, Shop, Tools, Services, dan Admin pada desktop/touch; menu Kebutuhan ruang 320px/768px/desktop; Light, Dark, dan Madevi On.
- **Yang sengaja tidak dijalankan dan alasannya:** npm, lint, build, test, server, browser, database, atau request API, karena guardrail Owner masih melarang proses tersebut.

## Risiko dan rollback

- **Risiko:** Motion atau pemadatan dapat mengurangi keterbacaan/affordance; semua content mulai pada state akhir ketika reduced-motion aktif, indikator fokus tetap 3px, dan motion hanya memakai opacity/transform/background-position pada zona terbatas. Cue warna Basic dapat menjadi bising atau terbaca sebagai status bila dipakai terlalu luas, maka ia dibatasi pada peran dan disertai nama/ikon/state eksplisit. Copy Kebutuhan ruang tetap hanya memetakan route/kemampuan yang ada di kontrak/source.
- **Compatibility/migration:** Tidak ada schema, API, route, atau data yang diubah.
- **Recovery:** Kembalikan deklarasi CSS atau pemetaan presentasi komponen ini; tidak ada data atau migrasi yang terlibat.
