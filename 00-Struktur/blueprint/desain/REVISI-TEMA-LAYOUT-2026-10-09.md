# Rencana Revisi Tema, Layout, dan Animasi — 2026-10-09

Sumber arahan: instruksi langsung Owner (mode prototype/demo lokal, lihat DECISIONS 2026-10-08).
Status: fase UI-shell, motion gating, dan verifikasi lokal selesai. Pemuatan kondisional file CSS Madevi On dan audit visual semua halaman masih tersisa; verifikasi ulang di Termux diperlukan.

## Tujuan
1. Madevi On menjadi satu-satunya tema dengan animasi penuh. Dipanggil hanya saat dipilih.
2. Light dan Dark hanya punya transisi ringan dan respek reduced motion.
3. Layout global (header, sidebar, footer, shell) ditata ulang untuk HP, tablet, dan desktop.
4. Tidak ada teks keluar batas, menumpuk, atau terpotong di semua ukuran.
5. Border dan kartu konten konsisten.

## Temuan dari kode (bukti)
- `layout.tsx` memuat 5 lapis CSS sekaligus: globals, redesign (10.772 baris), madevi-on,
  interface-refresh (6.811 baris), atlas-redesign (1.295 baris).
- Keyframes penuh (aurora, meteor, starfield, letter, scan, bolt, node-pulse, orbit) berada di
  interface-refresh.css dan atlas-redesign.css tanpa gerbang tema.
- Gerbang tema yang sudah ada: `motion-orchestrator.tsx` dan `header.tsx` (data-theme).
- Logo "MADEVI" terpotong di desktop (1280px) dan tampak di screenshot.
- Hierarki tombol utama dan sekunder sama (gradien identik).
- Nama brand tidak seragam ("MADEV" di logo, "Madevi" di hero).

## Hasil UI global terbaru (build/restart lokal, 2026-10-09)
- Sidebar: header awal terukur ~377px; setelah diringkas 282px pada viewport 1280×577. Menu tetap scroll mandiri, 9 kartu menu ada. Tombol Settings/X terukur 44×44px. Surface drawer diikat ke `--surface` agar konten belakang tidak tembus.
- Logo: wordmark utuh di desktop; slot disesuaikan pada layar kecil. Screenshot akhir browser disimpan di scratch `shots/release-final-{320,375,768,1280}.png`.
- Device metrics CDP berhasil mengatur 320, 375, 768, 1024, dan 1280px. Tidak ada horizontal overflow (`scrollWidth <= clientWidth`) di lima ukuran; logo, drawer, kontrol, dan sembilan item navigasi tampil setelah hidrasi.
- Motion pada bundle terakhir: light 0 loop, dark 0 loop, madevi-on 94 loop. Dengan `prefers-reduced-motion: reduce`, loop 0.
- Semua 5 stylesheet terlayani 200; parsing PostCSS 6 CSS pass; TypeScript exit 0; `tests/unit/prompt04-ui.test.tsx` 4/4 pass; build Turbopack exit 0; `/api/health`, `/`, `/jasa`, `/jasa/undangan/order`, `/belanja`, `/alat-bantu`, `/ruang/jelajahi-pengetahuan` semua 200.
- Tidak menghapus CSS umum besar atau keyframes massal; komponen, API, data, emulator dan bug yang sebelumnya dikecualikan tidak disentuh.
- Batas tersisa: `madevi-on.css` masih diimpor bersama stylesheet global; selector memang digate tema, namun lazy-loading file saat tema dipilih belum diterapkan. Tidak ada audit penuh seluruh halaman/semua teks. Build dan browser ini di Linux Agent; Owner perlu uji ulang di Termux.
- Diagnostik layout 768/1024/1280 menunjukkan `documentElement.clientWidth` 10px lebih kecil dari viewport, tetapi `scrollWidth === clientWidth` sehingga bukan scroll horizontal; penyebab scrollbar gutter belum diusut.

## Langkah kerja (berurutan, tiap langkah diverifikasi)
L0. Ukur animasi aktif per tema di browser (getAnimations) — BASELINE SELESAI.
L1. Pindahkan semua keyframes dan pemakaian animasi "penuh" ke themes/madevi-on.css dengan
    selector [data-theme='madevi-on'].
L2. Sisakan di file umum hanya transisi ringan (opacity/transform, ≤200ms, tanpa loop, tanpa blur).
L3. Verifikasi per tema: light dan dark tanpa animasi loop; madevi-on dengan animasi penuh. SELESAI — 0/0/94 loop; reduced-motion 0.
L4. Layout global: header/sidebar diringkas; sidebar stabil; tombol tutup dan pengaturan 44×44; logo HP tidak terpotong. SELESAI — browser smoke lokal.
L5. Tombol dan elemen: satu gaya primer, satu sekunder, target sentuh minimal 44px,
    kontras teks memenuhi standar. SEBAGIAN — target Settings/X terukur 44px; audit kontras/hierarki seluruh komponen belum dilakukan.
L6. Layout konten: lebar baca artikel 680–760px, border kartu seragam, satu template artikel. BELUM DIAUDIT penuh pada tahap ini.
L7. Verifikasi responsif: 320, 375, 768, 1024, 1280 — device metrics browser, scrollWidth tidak melewati clientWidth, logo/sidebar tidak keluar batas pada shell. SELESAI untuk shell; belum seluruh halaman.

## Batas
- Tidak mengubah kontrak route, data, auth, atau API.
- Tidak ada online, API eksternal, atau pembayaran nyata.
- Setiap langkah dicatat di CHECKPOINT.md setelah verifikasi, bukan sebelum.

## Risiko
- Penyatuan CSS mengubah tampilan seluruh halaman. Dilakukan bertahap dengan screenshot sebelum/sesudah.
- Keyframes yang dipakai komponen di luar madevi-on harus dicek satu per satu sebelum dipindah.

## Hasil L0–L3 (terverifikasi, 2026-10-09)
Baseline sebelum: light 5 anim (1 loop), dark 8 anim (1 loop), madevi-on 114 anim (94 loop).
Bocor ke Light/Dark: atlas-pixar-letter (logo), madevi-assistant-orb (ikon asisten), madevi-header-wave (gelombang huruf brand).
Perbaikan: ketiganya dipagari dengan [data-theme='madevi-on'] di atlas-redesign.css, redesign.css, interface-refresh.css.
Sesudah: light 1 anim (transisi, 0 loop), dark 1 anim (transisi, 0 loop), madevi-on 114 anim (94 loop, utuh).
Build exit 0, health 200. Belum memindahkan keyframes penuh ke madevi-on.css (itu L1 lanjutan, belum dikerjakan).
