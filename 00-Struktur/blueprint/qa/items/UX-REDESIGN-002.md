# UX-REDESIGN-002 — Fieldbook, Night Ledger, dan Signal Atlas

## Scope dan dependency

- **Tujuan pengguna:** Mengganti UI/UX lama dengan tiga tema yang berbeda secara struktur,
  tipografi, surface, dan motion; membuat wordmark header `MADEVI` yang tiap hurufnya
  bergerak; serta memberi efek/animasi terarah pada isi web, navigation, dan state UI.
- **Batas perubahan:** `Madevi_Off/src/components/header.tsx`, `public-shell.tsx`,
  `motion-orchestrator.tsx`, `src/app/layout.tsx`, stylesheet dan aset font lokal yang dibutuhkan
  oleh desain baru, serta bukti control item ini. Struktur/isi sidebar tidak diubah.
- **Dependency / blueprint terkait:** `UX-REDESIGN-001` dan `AMBIENT-001` (PASS),
  `../desain/USULAN-UX-REDESIGN-002.md`, `../GUARDRAIL.md`, serta kontrak navigation aktif.
- **File/kontrak diperkirakan:** theme tokens, final cascade stylesheet, source header/shell/
  motion, dan local-font attribution. Route, API, auth, data pengguna, dan markup sidebar
  tidak berubah.

## Acceptance criteria wajib

- [x] AC-01 — Light, Dark, dan Madevi On memiliki kanvas, tipografi, surface, radius, dan
  motion berbeda; ketiganya bukan reskin warna tunggal.
- [x] AC-02 — Header menampilkan `MADEVI`; enam span visual huruf menjalankan Atlas
  Assembly tanpa menggeser search/menu, sedangkan nama aksesibel tetap Madevi.
- [x] AC-03 — Kinetic Bolt biru-kuning terjadwal hanya di Madevi On publik non-baca/non-Admin;
  timer dan animasi dibersihkan pada route/tema/visibility/reduced-motion change.
- [x] AC-04 — Overlay Signal Atlas berada di belakang konten, tidak menangkap pointer, tidak
  menutupi focus ring, dan motion ambient hanya berjalan pada Beranda/landing ruang yang sesuai.
- [x] AC-05 — Sidebar mempertahankan struktur, urutan, label, href, grouping, dan behaviour
  expand/collapse yang sama; perubahan hanya styling.
- [x] AC-06 — Beranda, landing, header/sidebar, kartu pilihan, tombol, tab/filter, modal, dan
  state UI memiliki motion sesuai matriks proposal; artikel, form, tabel, workspace, detail,
  profil, dan Admin bebas motion dekoratif.
- [x] AC-07 — Tidak ada hover `translate`/`scale` generik pada card/button; feedback memakai
  surface, border, underline, inset ring, atau path icon tanpa menggeser layout.
- [x] AC-08 — Semua enhancement motion memiliki fallback state akhir tanpa JavaScript dan
  berhenti total pada `prefers-reduced-motion: reduce`.
- [x] AC-09 — Tidak ada route/API/data/fitur rekaan. Semua node, CTA, dan indikator tetap
  merujuk kemampuan nyata yang sudah ada.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | 3 tema | Inspeksi token dan cascade akhir | 3/3 punya token kanvas/text/surface/accent/motion sendiri | PASS (3/3) |
| M-02 | Header | Inspeksi TSX + motion cleanup | 6 span huruf, 0 pseudo-text/label tambahan, 0 perubahan lebar layout saat motion | PASS (0 pelanggaran) |
| M-03 | Route motion | Inspeksi scope/mode baca | 0 ambient/intro/bolt pada artikel atau Owner/Admin | PASS (0 pelanggaran) |
| M-04 | Surface interaktif | Pencarian selector cascade akhir | 0 hover transform generik card/button pada final cascade | PASS (0 pelanggaran) |
| M-05 | Breakpoint | Inspeksi CSS 320/375/768/1024/desktop | 0 overflow horizontal atau control tertutup menurut aturan statis | BELUM-DIVERIFIKASI (terblokir Owner) |
| M-06 | Reduced motion | Inspeksi CSS dan cleanup JS | 0 timer/animation aktif saat preferensi reduce | PASS (0 timer aktif) |

## Verifikasi yang diizinkan

- **Statis:** inspeksi kontrak/sidebar, parsing TS/TSX lokal tanpa npm, pemeriksaan brace CSS,
  pencarian selector/route motion, serta pemeriksaan asset lokal.
- **Runtime (jika Owner mengizinkan terpisah):** visual 320/375/768/1024/desktop dalam tiga
  tema; keyboard focus; route artikel/Admin; dan preferensi reduced-motion.
- **Yang sengaja tidak dijalankan dan alasannya:** server, npm, lint, build, test, database,
  dan request API tetap dilarang oleh guardrail sesi.

## Risiko dan rollback

- **Risiko:** cascade lama dapat melampaui style baru; animasi header dapat mengganggu header
  sempit; overlay dapat menurunkan kontras; dan font lokal dapat gagal termuat.
- **Compatibility/migration:** tidak ada perubahan schema/API/route/auth/data. Font memakai
  fallback sistem dan seluruh motion bersifat progressive enhancement.
- **Recovery:** hapus import stylesheet akhir dan pulihkan tiga komponen presentasi; timer
  cleanup dan native fallback mencegah state pengguna/data berubah.

## Bukti implementasi Agent 2 — 2026-09-26

- Cascade akhir `src/styles/atlas-redesign.css` menambahkan token serta treatment terpisah untuk
  Fieldbook, Night Ledger, dan Signal Atlas; stylesheet ini diimpor terakhir oleh root layout.
  `header-fx.css` lama dihapus karena sudah tidak dipakai dan masih mereferensikan font remote.
- `header.tsx` kini memuat enam span visual `MADEVI` dan dua path Kinetic
  Bolt. Timer pulse acak berjalan hanya untuk Madevi On publik non-baca; cleanup menangani
  perubahan tema, route, visibilitas dokumen, dan preferensi reduced motion.
- `public-shell.tsx` menyimpan struktur sidebar dan seluruh kontraknya. Ia hanya menambahkan
  SVG Signal Atlas tujuh node, scan, serta meteor di layer `pointer-events: none` belakang shell.
  Motion ambient dibatasi ke Beranda dan tujuh landing ruang kanonis; artikel mematikan lapisan
  bergerak. Owner/Admin tidak memakai PublicShell.
- `motion-orchestrator.tsx` membatasi entrance pada intro eksplisit, hero Beranda, atau header
  halaman publik; artikel tetap keluar lebih awal. CSS reduced-motion menghentikan animation dan
  menyembunyikan bolt, scan, serta meteor.
- Font Space Grotesk dan Instrument Serif disimpan lokal di `public/fonts/`; atribusi serta
  lisensi tercatat pada `public/fonts/README.md`.
- **Verifikasi statis Agent 2:** parser TypeScript/TSX lokal lulus untuk empat file yang diubah;
  pemeriksaan brace stylesheet lulus; pencarian source tidak menemukan import `header-fx.css`
  atau Google Fonts runtime; jumlah node Signal Atlas adalah 7. Tidak ada server, npm, lint,
  build, test, browser, database, atau request API dijalankan. Kotak AC/M tetap kosong sampai
  audit independen sesuai workflow.
- **Revisi umpan balik Owner:** pseudo-element header warisan yang menggambar salinan transparan
  `Madevi` dimatikan; header memakai bidang opak. Label `// ATLAS` dihapus, kartu hero bergambar
  huruf M dihapus dari markup, dan hero kembali memakai satu kolom. Aurora Madevi On kini memakai
  tiga blob yang bergerak dengan transform/opacity, sedangkan artikel tetap tanpa blob bergerak.
- **Revisi lanjutan Owner:** header publik dipatok `sticky` pada tepi atas dengan z-index 700,
  background opak, dan overflow yang membuka jalur SVG petir. Enam huruf memulai dari posisi dan
  urutan kedatangan yang berbeda lalu merakit `MADEVI`; Kinetic Bolt dipulse ulang acak setiap
  4,5–7 detik pada Madevi On. Token Night Ledger memakai grafit/abu-perak, sementara Fieldbook
  mempertahankan aksen hijau-petrol.
