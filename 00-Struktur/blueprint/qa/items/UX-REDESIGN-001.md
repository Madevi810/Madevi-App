# UX-REDESIGN-001 — Redesign total UI/UX Madevi

## Scope dan dependency

- Tujuan pengguna: tiga tema memiliki identitas jelas, halaman kerja mudah dipindai,
  Home memberi satu momen brand kuat, dan halaman baca tetap stabil.
- Batas perubahan: `public-shell.tsx`, `motion-orchestrator.tsx`, `home-content.tsx`,
  `tokens.css`, `redesign.css`, `madevi-on.css`, `interface-refresh.css`, serta
  dokumen control item ini. Sidebar hanya diubah melalui styling CSS.
- Dependency: arahan Owner 2026-09-25, `UX-001` dan implementasi historis
  `UX-001-REV1`. Kontrak route, API backend, data, auth, dan navigasi sidebar
  tidak berubah.

## Acceptance criteria wajib

- [ ] AC-01 — Struktur, urutan, label, link, dan expand/collapse sidebar identik.
- [ ] AC-02 — Definisi keyframe meteor tunggal; shell publik On memuat bintang
  statis dan 2–4 jalur meteor dengan jeda acak 3,5–7 detik per jalur.
- [ ] AC-03 — Route artikel dan Admin tidak menjalankan meteor, blur-text, atau
  entrance konten; permukaan baca tetap opaque.
- [ ] AC-04 — Semua CSS/JS motion baru berhenti pada reduced motion; elemen tidak
  pernah memerlukan animasi untuk dapat dibaca/dioperasikan.
- [ ] AC-05 — Heading dan paragraf pembuka pada halaman publik non-baca dapat
  menjalankan blur entrance sekali, tanpa replay scroll atau merusak teks/link.
- [ ] AC-06 — Wordmark Home On punya gelombang pendek dan kilat sekali; logo
  kecil header/sidebar tidak terus-menerus berputar atau berkedip.
- [ ] AC-07 — Basic Light/Dark bebas starfield/blur, memakai motion section
  singkat, hierarki tipografi lebih jelas, dan card biasa tanpa shadow/hover lift.
- [ ] AC-08 — Radius/border/icon mengikuti peran; glass hanya chrome/modal/AI,
  bukan kartu baca atau seluruh panel kerja.
- [ ] AC-09 — Fokus keyboard dan contrast tetap jelas; layout 320/375/768/1024px
  dirancang tanpa scroll horizontal atau tumpang tindih.
- [ ] AC-10 — Tidak ada route/API/data/fitur rekaan; perubahan komponen mengikuti
  kontrak yang ada.

## Verifikasi yang diizinkan

- Statis: pemeriksaan source, kontrak, selector/cascade, keseimbangan CSS,
  serta parsing TS/TSX lokal tanpa npm.
- Runtime/visual: tertunda sampai Owner mengubah guardrail proses.

## Bukti implementasi Agent 2 — 2026-09-25

- Source memuat starfield publik On, tiga jalur meteor dengan interval acak
  3,5–7 detik, token Basic/On, entrance teks On sekali per target, wordmark
  Home, serta styling sidebar tanpa perubahan struktur/isi.
- Setelah disconnect, konflik keyframe `madevi-on-sidebar-signal` dengan rail
  menu aktif dihilangkan. Selector `:is()` yang memuat pseudo-element pada
  reduced-motion dan mode baca diganti; artikel menghentikan animasi chrome,
  menu aktif, dan Asisten.
- Parser PostCSS empat sheet dan parser transpile tiga komponen publik lulus.
  Pemeriksaan visual/runtime dan audit AC-01–AC-10 masih
  `BELUM-DIVERIFIKASI`; checkbox acceptance sengaja tetap milik audit terpisah.
- Lanjutan: Basic menjangkau section utama halaman fitur; On memperoleh
  direktori ruang asimetris desktop dan reflow satu kolom di bawah 58rem,
  hero art/jalur cepat opak, teks jalur cepat yang membungkus, serta starfield
  SVG yang menjaga rasio dan tidak memakai filter glow pada tiap titik.
- Cascade lama yang masih memakai blur pada header fitur, kartu, panel kerja,
  dan input telah ditutup dengan permukaan opak; modal/dropdown/chrome tetap
  mendapat treatment glass sesuai peran.

## Risiko dan pemulihan

- Risiko: animation overlap, performa Android, dan regresi layout tiga tema.
- Pemulihan: perubahan terbatas ke CSS dan komponen presentasi; tidak ada
  migration/data/API. Semua temuan runtime dicatat `BELUM-DIVERIFIKASI`.
