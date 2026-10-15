# Usulan UX-REDESIGN-002 — Tiga Cara Memakai Madevi

**Status:** `DISETUJUI OWNER / implementasi UX-REDESIGN-002 sedang berjalan`  
**Jenis:** arah desain baru yang menjadi acuan item aktif `UX-REDESIGN-002`  
**Menggantikan saat disetujui:** bagian arah visual dari `UI-UX-DAN-TEMA.md` dan
`UX-REDESIGN-001`; riwayat serta bukti item lama tetap dipertahankan.

## 1. Tujuan dan keputusan desain

Madevi perlu terasa sebagai satu produk dengan tiga cara bekerja yang berbeda, bukan satu
UI generik yang hanya berganti warna. Perubahan ini menutup pola lama yang berulang:
kanvas kosmik biru, kartu kaca seragam, border/shadow sama pada semua peran, dan motion
yang menyentuh terlalu banyak elemen.

Ketiga tema berbagi struktur informasi, route, dan data. Perbedaannya berada pada kanvas,
tipografi, bentuk permukaan, kepadatan, serta ritme interaksi.

| Tema | Nama kerja | Pekerjaan yang didukung | Karakter visual |
|---|---|---|---|
| Light | **Fieldbook** | membaca, menemukan, dan menyusun langkah | kertas hangat, tinta gelap, garis editorial, ruang longgar |
| Dark | **Night Ledger** | fokus lama, alat, tabel, dan keputusan | grafit abu-abu, informasi rapat, kontras tinggi, penanda netral |
| Madevi On | **Signal Atlas** | orientasi produk dan eksplorasi ruang | black-plum, jalur atlas, cahaya amethyst/amber, atmosfer terbatas |

## 2. Batas yang tidak dapat berubah

1. **Sidebar:** urutan, label, target link, grouping, serta expand/collapse tidak berubah.
   Styling sidebar boleh berubah agar menyatu dengan masing-masing tema.
2. **Bacaan:** artikel dan konten baca tidak memakai starfield bergerak, meteor,
   split-word, blur entrance, parallax, atau reveal. Latar artikel opak dan teks tersedia
   pada first paint.
3. **Motion:** seluruh motion berhenti pada `prefers-reduced-motion: reduce`; tidak ada
   state awal yang menyembunyikan teks atau kontrol ketika JavaScript gagal berjalan.
4. **Administrasi:** Owner/Admin selalu memakai permukaan kerja statis. Madevi On dapat
   memberi token warna, tetapi tidak memberi atmosfer atau motion pada konsol.
5. **Kontrak produk:** route, auth, data pengguna, dan kontrak API dipertahankan. Markup
   serta komponen presentasi boleh dirombak. API hanya boleh berubah bila interaksi baru
   membutuhkan data yang belum dapat disediakan; perubahan itu harus menjadi item API
   terpisah dengan kontrak kompatibel.

## 3. Sistem visual baru

### 3.1 Light — Fieldbook

Light bukan lagi halaman putih dengan kumpulan card netral. Ia adalah meja kerja editorial:
kanvas tulang `#F7F4EE`, tinta `#16201E`, hijau-petrol untuk tindakan, dan terra-cotta hanya
untuk penanda pilihan atau peringatan yang juga memiliki label teks/ikon.

- Artikel memakai kolom baca yang bersih dengan garis margin, metadata kecil, dan pemisah
  tipis. Tidak ada kartu membungkus setiap paragraf.
- Halaman ruang memakai **rail orientasi**: heading, konteks ruang, lalu pekerjaan nyata.
  Blok dapat berupa lembar informasi, daftar, atau workspace; bukan semua dipaksa menjadi
  card yang sama.
- Radius: 6px untuk data/form, 12px untuk panel kerja, sudut asimetris hanya pada hero atau
  feature yang benar-benar besar. Shadow hanya modal, popup, dan elemen yang memang mengambang.
- Heading memakai keluarga display serif lokal berlisensi yang tercatat sebelum ditambahkan;
  body tetap sans yang stabil. Tidak ada font remote atau CDN.
- Motion Basic: maksimal tiga section semantik per layar boleh opacity + `translateY(6px)`
  sekali, sekitar 300ms. Artikel, form, tabel, dialog, dan daftar hasil tidak dianimasikan.

### 3.2 Dark — Night Ledger

Dark adalah meja kerja malam. Kain dasarnya grafit `#121315`, surface `#1D1F21`, teks
`#F0F1F1`, dan aksen abu-perak `#C5C8CA`; amber dan merah semantik tetap dibedakan dengan
label serta ikon.

- Informasi operasional menggunakan kolom, aturan garis, angka tabular, dan header yang
  mengunci konteks. Kepadatan meningkat tanpa mengecilkan teks tubuh di bawah 16px pada
  mobile.
- Panel penting dibedakan dengan inset border atau surface kedua, bukan glow dan shadow gelap
  berlapis. Card konten tetap datar dan tenang.
- Kartu, daftar, dan tabel memiliki grammar yang berbeda: kartu untuk pilihan besar, daftar
  untuk bacaan, tabel untuk operasi. Tidak ada treatment hero yang menempel ke semua ruang.
- Motion mengikuti aturan Basic Fieldbook. Hover/focus memakai perubahan border, surface,
  dan outline; tidak memakai `translate`, `scale`, atau glow berdenyut umum.

### 3.3 Madevi On — Signal Atlas

Madevi On menjadi identitas ekspresif, tetapi kosmos tidak boleh menjadi dekorasi generik.
Atlas menggambar tujuh ruang Madevi sebagai node dan jalur yang berhubungan dengan route nyata.
Black-plum `#110B18` menjadi dasar, amethyst `#C99BFF` menjadi sinyal, amber `#F2B869`
menjadi cahaya keputusan, dan biru tidak dipakai sebagai wash global.

- **Shell:** field bintang SVG statis dan grid sangat halus boleh berada di balik shell publik
  non-Admin. Meteor, parallax, dan ambience bergerak hanya berjalan di Beranda dan landing
  ruang publik; artikel, workspace, form, tabel, detail produk, profil, dan Admin tenang.
- **Hero:** satu momen besar per layar. Wordmark Madevi di Beranda menjalankan gelombang pendek
  antarhuruf, satu sweep amber→amethyst, lalu selesai. Sidebar memakai wordmark statis;
  header mengikuti aturan Kinetic Bolt yang dibatasi pada bagian 3.4.
- **Permukaan:** chrome, modal, dan panel Asisten boleh translucent. Artikel, kartu data,
  workspace, serta daftar hasil opak. Border bercahaya hanya CTA utama, panel AI, atau
  feature hero yang memang memiliki satu aksi primer.
- **Bentuk:** data/utility 8px; feature/hero asimetris; daftar bacaan hampir datar. Ikon
  unggulan memakai satu set SVG garis Madevi; ikon utilitas tetap memakai set yang telah ada
  dengan ketebalan stroke konsisten.
- **Motion:** paling banyak dua target intro yang diberi `data-motion-intro` pada satu route;
  blur-to-focus berjalan sekali saat target terlihat. Selector generik `h2` atau seluruh kartu
  tidak boleh otomatis di-split atau di-reveal. Meteor berjalan 1,2–1,8 detik dan dipicu ulang
  bebas tiap 3,5–7 detik, hanya ketika tab terlihat dan motion diizinkan.

### 3.4 Header baru — `MADEVI` dan Atlas Assembly

Header menjadi tanda tangan visual. Lockup yang ditampilkan adalah **`MADEVI`**, sebagai nama
produk dan satu-satunya teks pada wordmark. Accessibility name dan metadata tetap menyebut Madevi.

- Wordmark memakai **Space Grotesk Variable** yang di-host lokal, dengan huruf besar, tracking
  rapat, dan potongan diagonal pada garis miring pemisah. Tidak ada font CDN. Fallback-nya
  `ui-sans-serif` agar header tetap stabil ketika aset belum termuat.
- Fieldbook dapat memakai **Instrument Serif** yang di-host lokal hanya untuk heading editorial
  besar. Night Ledger dan Signal Atlas memakai Space Grotesk untuk heading, label, serta angka;
  body text memakai sans sistem yang mudah dibaca. Lisensi dan sumber font harus dicatat lokal
  sebelum aset ditambahkan.
- Emblem tetap berada di sisi wordmark, tetapi diberi ring atlas tipis. Icon navigasi dan
  utilitas tidak berubah ke font glyph; tetap SVG semantik dengan label aksesibel.

Wordmark `MADEVI` bukan teks diam yang diberi glow. Setiap huruf adalah span visual tersendiri
di dalam satu area berukuran tetap, sehingga dapat bergerak tanpa mendorong search atau tombol
menu. Label link tetap satu nama aksesibel, sementara span huruf bersifat dekoratif untuk screen
reader. Koreografi **Atlas Assembly** bersifat sinematik dan orisinal: gerak huruf membentuk
ritme Madevi sendiri, bukan menyalin urutan atau karakter logo studio mana pun.

- **M** menjadi jangkar: sedikit condong lalu kembali tegak.
- **A**, **D**, dan **E** muncul melalui lengkung vertikal yang berbeda dan mendarat dengan
  squash ringan.
- **V** melakukan sweep diagonal pendek sebagai penghubung gerak, sedangkan **I** menutup
  komposisi dengan rebound kecil. Semua huruf berakhir tepat pada baseline yang sama.
- Transform hanya berjalan di layer visual absolut; wordmark memiliki `inline-size` tetap,
  tidak mengubah flow header, dan tidak memindahkan elemen lain.

Light dan Dark mendapat versi masuk satu kali ketika route publik terbuka: **Fieldbook Press**
selama 520ms dan **Ledger Snap** selama 420ms. Keduanya hanya menggerakkan huruf 2–4px dengan
opacity/transform; tidak berulang dan tidak memakai kilat. Madevi On mendapat versi penuh
**Atlas Assembly** selama sekitar 1,35 detik saat masuk Beranda, lalu versi header ringkas yang
berjalan terjadwal.

Pada Madevi On, Atlas Assembly dipadukan dengan **Kinetic Bolt** yang kuat namun singkat:

1. Saat header terlihat dan route bukan artikel/Admin, scheduler memilih jeda acak **4,5–7
   detik**. Satu siklus header selama **1,32 detik**: koreografi huruf berjalan pada 0–620ms;
   tiga charge biru @80ms dimulai pada 320ms; jalur petir kuning berjalan pada 520–680ms;
   cabang biru pada 620–810ms; dan ekor amethyst/amber memudar pada 800–1180ms. Tahapnya
   saling tumpang tindih agar terasa seperti satu gerak hidup, bukan antrean efek. Tidak ada
   CSS `infinite` yang terus menerus berkedip.
2. Kilat digambar sebagai SVG path dengan `stroke-dashoffset`, bukan gambar raster atau efek
   flash layar penuh. Petir melintasi baseline setelah huruf menyatu, sehingga font tetap
   menjadi pusat gerakan.
3. Hover/focus pada brand boleh memicu Atlas Assembly mini 380ms sekali. Fokus keyboard
   mempertahankan ring yang jelas dan tidak pernah bergantung pada animasi.
4. Saat artikel, Admin, tab tersembunyi, atau `prefers-reduced-motion` aktif, wordmark tampil
   statis dengan garis biru-kuning berkontras. Tidak ada timer, petir, glow berdenyut, atau
   perubahan layout.

Setiap koreografi dibatalkan ketika route/tema berubah. Dengan begitu header benar-benar berubah
dari UI lama di semua tema, sementara Madevi On memegang momen "super extra" yang diminta.

### 3.5 Overlay dan kedalaman Signal Atlas

Overlay harus menambah orientasi dan suasana tanpa menutup informasi. Ia memiliki empat lapisan
yang masing-masing `pointer-events: none` dan berada di belakang konten/focus ring:

| Lapisan | Isi | Perilaku |
|---|---|---|
| Canvas | black-plum solid | selalu statis, fondasi kontras |
| Atlas grid | grid 56px bermask radial + noise SVG halus | statis, opacity rendah |
| Route field | bintang SVG serta tujuh node yang mengikuti ruang Madevi nyata | statis di shell publik; node aktif berubah melalui token route |
| Signal pass | meteor, dua blob transform, dan scan arc | hanya Beranda/landing ruang, berhenti pada artikel/Admin/reduced motion |

Panel konten menutup overlay dengan permukaan opak. Overlay tidak memakai `backdrop-filter`,
tidak berada di atas input/tabel/bacaan, dan tidak mengubah posisi atau ukuran konten. Efek
layering ini memberi perubahan yang terasa besar tanpa mengulang pola lama berupa gradien biru
global atau glass di semua card.

### 3.6 Motion pada isi web dan komponen UI

Efek tidak berhenti di header. Setiap ruang mendapatkan respons visual yang sesuai dengan fungsi
komponennya. Satu layar hanya memiliki satu motion besar dan dua motion pendukung agar perubahan
terasa hidup tanpa menjadi ramai.

| Area UI | Fieldbook / Night Ledger | Signal Atlas | Batas tetap |
|---|---|---|---|
| Beranda dan landing ruang | section masuk pendek, 300ms, maksimal tiga section | hero membentuk atlas, node route menyala, intro heading dan signal pass | CTA hanya menuju route/aksi nyata |
| Header dan sidebar | Fieldbook Press atau Ledger Snap saat masuk; indikator route bergeser | Atlas Assembly, Kinetic Bolt, garis aktif bergerak sekali | struktur, label, urutan, dan link sidebar tidak berubah |
| Kartu pilihan/feature | border, ikon, dan latar merespons hover/focus; tidak mengangkat card | garis atlas menelusuri edge card, ikon dapat menggambar path sekali | tidak ada `translate`/`scale` generik atau glass untuk kartu isi |
| Tombol dan link | perubahan surface, underline, dan ring dalam 120–180ms | shimmer amber/amethyst yang hanya aktif saat hover/focus pada aksi primer | tidak ada flash layar atau tombol bergerak dari posisi semula |
| Tab, filter, dan pilihan ruang | indikator aktif bergeser ke pilihan baru; label tetap terbaca | signal rail berpindah dan node ruang aktif menyalakan garis terkait | URL/state asli tetap sumber kebenaran |
| Sidebar, pencarian, modal | fade + sheet transform pendek; focus dipindahkan setelah transisi | backdrop atlas redup dan edge signal pendek | Escape, click outside, dan focus trap tetap bekerja |
| Loading, berhasil, dan error | skeleton stabil, success ring sekali, error hadir dekat field | scan pendek hanya pada panel yang sedang memproses | status selalu memakai teks/ikon, bukan warna/animasi saja |
| Artikel, tabel, form, Admin | hover/focus dan transisi state seperlunya | memakai token On yang opak, tanpa dekorasi bergerak | tidak ada entrance, parallax, meteor, split word, atau ambient motion |

Motion komponennya memakai bahasa yang sama: garis/underline untuk navigasi, border/inset ring
untuk pilihan, path untuk ikon, dan opacity/transform untuk sheet atau dialog. Ini membuat UI
terasa dirancang sebagai sistem, bukan kumpulan animasi yang tidak berkaitan.

## 4. Yang diambil dari GameNative, dan yang sengaja tidak diambil

GameNative memperlihatkan hierarki pesan yang singkat, CTA yang langsung, tiga langkah kerja,
dan atmosfer yang mendukung bukti produk. Madevi dapat mengambil bahasa ini sebagai berikut:

| Dipakai untuk Madevi | Implementasi Madevi | Tidak dipakai |
|---|---|---|
| Atmosfer shell | grid redup + node atlas dari tujuh ruang nyata | menyalin palet, layout, atau identitas gaming |
| Alur langsung | Beranda menyatakan ruang → tindakan nyata → hasil/lanjutan melalui route yang benar | statistik, ulasan, perangkat, atau CTA sosial yang tidak punya data nyata |
| Fokus hero | satu wordmark entrance dan satu aksi primer | gradient bergerak pada semua teks atau animasi kecil di semua elemen |
| Umpan balik interaksi | border/surface/arrow yang responsif, fokus keyboard tetap jelas | hover lift/scale universal dan glow pada setiap tombol |
| Kedalaman visual | overlay berlapis yang berada di balik konten | efek penuh layar di atas teks atau kartu kaca menyeluruh |

Rujukan visual hanya dipakai sebagai inspirasi teknis. Tidak ada aset, copy, struktur halaman,
atau klaim GameNative yang dipindahkan ke Madevi.

## 5. Aturan motion dan aksesibilitas

- Setiap animasi memakai `transform` atau `opacity`; blur hanya pada dua intro Madevi On yang
  ditetapkan, bukan isi bacaan.
- Konten mulai dari state akhir. `IntersectionObserver` hanya menambah enhancement setelah
  elemen terlihat; observer harus `unobserve` setelah satu kali dan membatalkan animasi ketika
  tema, route, visibilitas dokumen, atau preferensi motion berubah.
- Tidak ada parallax global per-scroll. Jika dipakai pada Beranda Madevi On, ia memperbarui
  paling banyak dua layer dekoratif melalui satu `requestAnimationFrame`, dinonaktifkan saat
  reduced motion dan tidak memengaruhi layout.
- Atlas Assembly dan Kinetic Bolt memakai timer acak yang dibersihkan ketika route berubah,
  header dibuka dalam mode baca, dokumen tersembunyi, atau preferensi motion berubah. Gerak
  huruf dan petir tidak boleh memicu layout/reflow atau memakai white full-screen flash.
- `:focus-visible` selalu lebih kuat daripada hover. Target sentuh tetap 44px jika konteks
  memungkinkan. Warna tidak menjadi satu-satunya tanda state.
- Tidak ada transform hover generik pada card atau tombol. Feedback dilakukan lewat border,
  background, inset ring, dan shadow yang tidak menggeser batas elemen.

## 6. Penggantian fondasi lama

Implementasi tidak boleh menambah satu lapisan override besar di atas visual lama. Sebelum
merombak komponen, inventaris selector dan tetapkan pemilik tunggal untuk token, shell, card,
dan motion. Duplikasi yang saat ini muncul di beberapa stylesheet—misalnya token Madevi On
blue/cosmic lama, rule `@keyframes` meteor, transform hover, dan hero/card yang saling menimpa—
harus dihapus ketika penggantinya sudah ada.

Urutan aman:

1. **Fondasi:** bentuk token semantik untuk tiga tema, skala radius/elevation/typography,
   serta satu registry motion. Hapus keyframe dan selector duplikat setelah pemilik final
   ditetapkan.
2. **Shell, overlay, dan navigasi:** bangun chrome/sidebar sesuai token baru tanpa mengubah
   struktur sidebar. Terapkan batas rute bagi empat lapisan overlay dan motion.
3. **Header dan Beranda:** implementasikan wordmark `MADEVI`, Atlas Assembly,
   Kinetic Bolt terjadwal, rail orientasi Fieldbook/Night Ledger, serta Signal Atlas ber-node
   nyata.
4. **Workspace dan bacaan:** ubah tipe permukaan berdasarkan fungsi, lalu pastikan artikel dan
   Admin berada pada mode statis opak.
5. **Pembersihan legacy dan audit statis:** hapus styling lama yang telah digantikan dan audit
   cascade, responsive layout, focus, kontras, serta reduced-motion.

Tidak diperlukan Tailwind, Framer Motion, API baru, atau aset remote untuk tahap ini. API Web
Animations/`IntersectionObserver` dan dependency yang sudah ada cukup, selama setiap fitur
memiliki fallback statis.

## 7. Acceptance criteria untuk item implementasi berikutnya

- [ ] Struktur dan perilaku sidebar identik; perubahan hanya presentasional.
- [ ] Ketiga tema memiliki token warna, tipografi, surface, radius, dan motion yang berbeda
  secara nyata; perubahan bukan hanya tint warna.
- [ ] Tidak ada rule card/button generik yang memakai hover `translate` atau `scale`.
- [ ] Madevi On tidak mempunyai atmosfer bergerak pada artikel, form, tabel, workspace,
  detail, profil, atau Admin; artikel dan Admin opak serta statis.
- [ ] Header menampilkan wordmark `MADEVI`; tiap huruf bergerak lewat Atlas Assembly
  tanpa menggeser layout. Kinetic Bolt hanya aktif pada Madevi On non-baca, non-Admin, dan
  tab terlihat. Semua gerak menjadi state statis saat reduced-motion aktif.
- [ ] Overlay mempunyai z-layer terdokumentasi, tidak menangkap pointer, tidak menutupi
  focus ring, dan tidak membuat konten bacaan transparan.
- [ ] Beranda, navigasi, kartu pilihan, tombol, tab/filter, modal, serta state loading/error
  memakai motion sesuai matriks UI; artikel, form, tabel, workspace, dan Admin tetap tenang.
- [ ] Setiap layar memiliki paling banyak satu motion besar dan dua motion pendukung; seluruh
  motion memiliki final state yang terbaca tanpa JavaScript dan saat reduced-motion aktif.
- [ ] Intro On hanya untuk target eksplisit dan tidak replay; Basic hanya section semantik.
  Semua konten tetap terlihat tanpa JavaScript dan saat reduced-motion aktif.
- [ ] Tidak ada keyframe meteor atau selector theme yang didefinisikan ganda. Satu pemilik
  stylesheet menentukan setiap token dan animasi.
- [ ] Pada 320px, 375px, 768px, 1024px, dan desktop, tidak ada scroll horizontal, overlap,
  fokus tertutup, atau target sentuh yang sulit dioperasikan.
- [ ] Tidak ada route/API/data/fitur rekaan. Setiap visual node, CTA, indikator, dan langkah
  kerja harus merujuk kemampuan atau data yang benar-benar tersedia.

## 8. Keputusan Owner yang diperlukan sebelum item dipromosikan

1. Konfirmasi bahwa kebebasan perubahan API berarti markup/komponen bebas; kontrak backend
   tetap hanya berubah melalui item API terpisah bila data baru benar-benar diperlukan.
2. Konfirmasi **model hybrid shell**: starfield statis untuk shell publik Madevi On, sedangkan
   meteor/parallax hanya pada Beranda dan landing ruang; Admin serta artikel tanpa motion.
3. Header memakai **`MADEVI`** tanpa descriptor tambahan; Kinetic Bolt biru-kuning terjadwal
   pada Madevi On mengikuti preferensi motion dan batas route.
Setelah tiga keputusan ini disetujui, Agent 5 dapat memecah usulan menjadi item aktif kecil
dan auditable; tahap awal adalah fondasi token, ownership cascade, dan registry motion.
