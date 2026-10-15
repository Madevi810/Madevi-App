# UX-REFINE-001 — Revisi Sistem UI/UX Global

## Tujuan Owner
Rapikan seluruh pengalaman visual Madevi: komponen, efek, animasi, tema, layout global, header/sidebar, dan konten untuk HP, tablet, desktop. Hindari AI slop dan kode CSS yang saling menimpa. Madevi On memiliki animasi penuh hanya saat dipilih; tema lain tetap memiliki feedback/transisi halus. Tidak boleh ada teks/control terpotong, bertumpuk, atau keluar batas.

## Temuan terverifikasi
- Keadaan kontrol menu pada 375px: header 64px; tombol pencarian/menu 44×44px; drawer memenuhi tinggi viewport; Pengaturan/Tutup 44×44px; jam/tanggal muat; `.sidebar__menu-area` scroll independen (911px isi dalam 562px viewport). Setelah restart terkoordinasi server project asli, semua lima stylesheet yang direferensikan homepage HTTP 200.
- Browser build produksi project asli pada viewport 320/375/768/1024/1280px: `scrollWidth===clientWidth` setiap ukuran (selisih desktop `innerWidth-clientWidth=10px` adalah scrollbar). Hero grid dan brand tampil; screenshot settled 375px tidak menunjukkan clipping/overlap nyata pada header/hero. Termux belum diuji.
- Audit motion browser pada build sehat: Light 0 loop, Dark 0 loop, Madevi On 91 loop; `prefers-reduced-motion` menghentikan loop hingga 0 di semua tema. Gerak Madevi On dibatasi ke theme aktif.
- Bukti awal sebelum restart (historis): chunk CSS `1th0-4bj59bmz.css` membalas 500 dari aset build lama dan tidak ada pada `.next/static/chunks`; tidak dipakai sebagai hasil render final. Server asli telah direstart dengan izin Owner, port yang sama 3000.
- Pemeriksaan source project asli: parsing PostCSS 6 stylesheet lulus, `tsc --noEmit` exit 0, tes `prompt04-ui` 4/4. Build Turbopack pada project asli exit 0 (4 warning filesystem tracing yang telah ada); tes reader+undangan+prompt UI 11/11.
- Handoff Agent 3 statis awal: AC-01 PASS statis; AC-02 FAIL karena aturan Madevi On tersebar pada `madevi-on.css`, `interface-refresh.css`, `atlas-redesign.css`, dan `redesign.css`; AC-03–AC-07 saat itu BELUM-DIVERIFIKASI. Laporan awal tetap sebagai catatan histori di `blueprint/qa/audits/UX-REFINE-001.md`; lock tidak dilepas.
- Scope tes regresi kini terdaftar resmi pada `INDEX.md` dan batas file item ini: `Madevi_Off/tests/unit/madevi-on-css-contract.test.ts`. Implementasi keyframe aktif sudah dilakukan dalam scope itu; AC-02 selector lainnya tetap terbuka. EMULATOR-001 tetap terlindungi; bug telemetry/profiles tetap dikecualikan.
- Inventaris PostCSS source: 15 theme rules di `redesign.css`, 275 di `interface-refresh.css`, 49 di `atlas-redesign.css`; 7 rule-list interface-refresh, 2 redesign memuat selector tema+umum bersama. Hitungan yang dapat direproduksi lebih luas: 336 theme-scoped rule nodes; 9 keyframe aktif prefiks `madevi-on-*` asalnya di interface-refresh.
- Tes `tests/unit/madevi-on-css-contract.test.ts` pada awalnya gagal dengan 9 definisi keyframe aktif di luar file tema. Sembilan body definisi dipindahkan tanpa mengubah animasi callers ke `src/styles/madevi-on.css`. Tes kontrak setelah scope diperhalus 1/1 PASS; tes prompt04 gabungan 5/5; parse PostCSS kedua stylesheet PASS; tsc --noEmit exit 0. Tidak ada selector tema yang dipindahkan; karena itu AC-02 masih FAIL parsial.
- Snapshot computed style sebelum selektor disentuh pada homepage `Madevi On`, `light`, `dark`: header bg masing-masing rgb(25,15,36), rgb(255,253,248), rgb(29,31,33); color tetap theme-specific. Hero tema on punya entrance animation dan 704.94px tinggi selama fase animasi; kedua tema kerja punya 651.36px, animasi none. Perlu audit browser setelah build selanjutnya.
- Build project asli Turbopack lulus (4 warning tracing filesystem di storage/shop image). Server dihentikan lewat `scripts/stop.mjs` lalu dinyalakan resmi `scripts/start.mjs --mode production-local` pada port 3000; status runner milik task dan API health 200 application+database OK. Semua lima stylesheet homepage merespons HTTP 200.
- Runtime browser pascaperubahan: header background computed sama seperti baseline pada Light `rgb(255,253,248)`, Dark `rgb(29,31,33)`, Madevi On `rgb(25,15,36)`; foreground theme masing-masing `rgb(22,32,30)`, `rgb(240,241,241)`, `rgb(245,238,248)`. Loop Light/Dark 0, Madevi On 94; reduced-motion menurunkan loop ke 0. Smoke viewport 320/375/768/1024/1280 tanpa overflow. Drawer 375: header 64px, target cari/menu/settings/close 44×44px, clock/date terlihat, menu scroll mandiri. Bukti Linux; Termux belum diuji.
- Pemeriksaan fokus/kontras awal terbatas: Tab keyboard menyorot skip-link dengan outline solid 2px warna `rgb(245,193,92)`; tombol pencarian `rgb(245,238,248)` pada background `rgb(26,18,35)`, kontras 15.99:1. Rasio teks dalam elemen transparan/gradient tidak dihitung karena butuh komposit latar; AC-05 tetap BELUM-DIVERIFIKASI.
- Lanjutan: kontrak keyframe aktif selesai. Berikutnya petakan AST selector Madevi On per cluster; pisahkan hanya aturan khusus yang tidak berbagi selector dengan tema lain, sambil mengunci computed styles baseline/cascade Light, Dark, Madevi On. Tes yang ada menguji kepemilikan sembilan keyframe aktif saja; jangan menganggap tes itu membuktikan seluruh selector terpusat. AC-05 (contrast/focus) dan AC-06 (baseline routes) masih perlu bukti; minta audit final Agent 3 setelah revisi penuh. Tidak membuat salinan/server baru; gunakan project asli dan port 3000 yang sama jika restart diperlukan.

- `src/app/layout.tsx` mengimpor lima stylesheet besar tanpa CSS layer yang mengunci urutan: `globals.css`, `redesign.css` (10.773 baris), `madevi-on.css` (406), `interface-refresh.css` (6.815), `atlas-redesign.css` (1.296).
- Pengukuran browser setelah patch menunjukkan Light: 1 transisi/0 loop; Dark: 1 transisi/0 loop; Madevi On: 114 animasi/94 loop. Tiga animasi bocor yang terbukti dipagari: logo `atlas-pixar-letter`, ikon `madevi-assistant-orb`, wordmark `madevi-header-wave`.
- Source Sidebar: jam/tanggal tiap detik, tombol Settings dan X, tab Website/Profil, kartu akun, dan navigasi 7 ruang; hanya area menu yang scroll.
- **Perbaikan awal beranda (2026-10-09):** cascade final `.public-shell .home-needs__item` di `interface-refresh.css` kini membatalkan feature spans lama Madevi On, merapatkan tinggi baris mengikuti konten dan mengurangi ukuran judul indeks pada layar luas. Tidak mengubah route, isi, atau status layanan.
- **Verifikasi perbaikan:** `tsc --noEmit` lulus; parsing PostCSS untuk kedua stylesheet berubah lulus; `tests/unit/prompt04-ui.test.tsx` 4/4 lulus; build Turbopack lulus (4 warning tracing filesystem yang tidak terkait). Browser dengan device metrics 1280/1024/768/375/320: tidak ada horizontal overflow; baris indeks 102/97/97/136/156–191px; tinggi section turun dari 1.149 ke 858px di 1280. Pada layar sempit tinggi tetap mengikuti pembungkusan teks; harus ditinjau lagi setelah audit mobile halaman penuh.
- **Batas bukti:** runtime di Linux agent saja, bukan Termux. Server lama milik proses lain di port 3000 tetap tak disentuh; server sementara di 3002 sudah tidak mendengarkan setelah uji. Audit seluruh route dan fitur reader/order belum dilakukan.
- Desktop viewport browser saat pemeriksaan 1280px dengan document scrollWidth 1270px. Penyebab selisih 10px belum ditentukan; tidak boleh disebut bug horizontal overflow sebelum direproduksi.
- Emulator masih PROSES dan dikunci; file komponen emulator/worker/API/migration tidak boleh disentuh.

## Batas file
`Madevi_Off/src/styles/globals.css`, `tokens.css`, `redesign.css`, `interface-refresh.css`, `madevi-on.css`, `atlas-redesign.css`, `src/app/layout.tsx`, `src/components/public-shell.tsx`, `header.tsx`, `sidebar.tsx`, `motion-orchestrator.tsx`, `home-content.tsx`, `Madevi_Off/tests/unit/madevi-on-css-contract.test.ts`; dokumen QA/checkpoint terkait.

## Eksklusi
Route/API/auth/data/database/migration, settings behavior, katalog/artikel content, `utilities-page.tsx`, seluruh emulator/circuit solver/workspace, dependencies, dan stylesheet module emulator.

## AC wajib
1. Hanya Madevi On menjalankan efek full/loop; Light dan Dark tidak memiliki dekorasi bergerak loop. Reduced motion menghentikan seluruh gerak dekoratif di semua tema.
2. Tema Madevi On tetap dalam file khusus; selektor/animasi sepenuhnya terscope pada theme aktif, tidak mengubah Light/Dark.
3. Header/sidebar: brand tidak terpotong; tanggal/jam wrap atau ringkas; setting dan tutup berukuran sentuh memadai dan tidak bertabrakan; sidebar menu dapat discroll independen.
4. Layout public shell tidak memaksa scroll horizontal/overlap di 320, 375, 768, 1024, 1280px.
5. Border, surface, hierarki tombol, fokus, kontras dan state mengikuti token; tidak menambahkan card/gradient/animasi dekoratif generik.
6. Tidak ada rute, konten, aksi atau status baru/palsu. Markup kontrak navigasi sidebar tetap.
7. Uji build/type/static CSS dan browser smoke dilakukan setelah perubahan; hasil/l keterbatasan dicatat dengan jujur. Target Termux tetap perlu diverifikasi oleh Owner.

## Risiko
Cascade lama dapat menyembunyikan error style; CSS global berdampak ke banyak halaman. Ubah satu kelompok aturan pada satu waktu, jangan hapus blok tanpa memeriksa consumer. Verifikasi tiga tema dan reduced motion.

## Rencana
1. Ambil baseline source/runtime dan rapikan animasi bocor yang terbukti.
2. Bikin satu kontrak token/cascade tema dan scope Madevi On terpisah.
3. Tata ulang shell/header/sidebar dan sistem feedback komponen.
4. Cek tampilan responsif dan artikel/ruang/layanan di viewport yang tersedia.
5. Jalankan parsing, typecheck/build, dan browser smoke; dokumentasikan breakpoint/perangkat yang belum dapat diemulasi.
