# DECISIONS

## 2026-10-09 — Izin tes lokal untuk revisi UI/UX

- **Instruksi Owner:** revisi penuh efek, animasi, komponen, elemen, warna, tema, layout global dan konten untuk HP/tablet/desktop, lalu test apakah aplikasi berjalan normal.
- **Batas izin:** build/test/browser smoke di lingkungan Linux lokal yang sudah tersedia untuk task UI/UX boleh dijalankan. Tidak mengizinkan database/migration, online/API eksternal, perubahan data, pembayaran nyata, atau menyentuh emulator yang masih dikunci. Catat hasil apa adanya; verifikasi Termux tetap diperlukan.
- **Kontrol:** GUARDRAIL §Operasi butir 1 diperbarui agar larangan build/test lokal dapat dikecualikan oleh izin Owner yang eksplisit dan tercatat. Perubahan UI/UX memakai lock `UX-REFINE-001`.


- **Instruksi Owner:** Madevi saat ini adalah prototype/demo yang hanya dijalankan di perangkat
  Owner (Termux, localhost). Tidak ada pembukaan online. Owner ingin simulasi penuh, tetapi
  dengan sistem yang tetap aktif seperti saat nanti online.
- **Tafsir yang dicatat:** "simulasi penuh" berarti alur lengkap (input → validasi → proses →
  hasil → recovery) berjalan dengan data demo lokal yang berlabel `DEMO`/`DRAFT`/`CONTOH`.
  Ini tidak berarti tombol, angka, atau status palsu yang tampil sebagai nyata; aturan
  kejujuran di MASTER §2 dan GUARDRAIL §Produk tetap berlaku.
- **Yang berubah dari sisi operasi:** Owner mengizinkan server localhost, database lokal,
  migration, build, dan verifikasi runtime di perangkat Owner untuk mode demo ini.
  Pembukaan online, API eksternal, publikasi luar, pembayaran, dan kredensial produksi
  tetap dilarang.
- **Status dokumen:** instruksi ini menggantikan larangan runtime di GUARDRAIL untuk
  lingkungan demo lokal. Teks GUARDRAIL belum direvisi; Agent 5 perlu menulis revisi resmi
  sebelum item runtime dipromosikan ke INDEX.
- **Lingkungan kerja agent:** eksekusi sesi ini berjalan di mesin Linux agent
  (`/home/agentuser/.hermes/workspace/madevi`), bukan di Termux Owner. Bukti runtime dari
  sini hanya berlaku untuk mesin tersebut sampai dijalankan ulang di Termux.
- **Batas yang tetap berlaku:** data pengguna nyata, kredensial, dan publikasi konten
  Tutorial `CONTROLLED`/`STOP` tetap memerlukan gerbang Owner dan review.
- **Konsekuensi untuk data yang sudah dibuat:** member01 (di-approve dan diberi entitlement
  lewat SQL) dan taxonomy pilot revisi 1 dianggap data demo; keduanya ditandai demo, dapat
  diulang, dan dapat diperiksa ulang oleh Owner.


## 2026-09-28 — EMULATOR-001 memakai stack lokal Next.js

- Instruksi Owner terbaru meminta mengerjakan ide `Madevi-Blueprint-Teknis.md`, mengecualikan Laravel Octane, dan mempertahankan Next.js. Pilihan eksplisit: tetap pada aplikasi lokal Next.js + PostgreSQL yang sudah berjalan; jangan memperkenalkan Laravel API, Filament, Redis/queue, VPS/Vercel, atau service eksternal.
- Scope produk: simulator edukasi rangkaian DC linear dengan editor Canvas dan solver MNA di Web Worker. Batas komponen awal, validasi, privasi save, migration source, dan acceptance criteria ditetapkan pada `blueprint/qa/items/EMULATOR-001.md`.
- Tidak menyimpulkan peta entitlement Free/Plus/Pro atau harga dari blueprint lama; model belum diputuskan di source dan bukan izin membuat paywall baru. Tidak membuat klaim transient, komponen nonlinear, overheating, PCB, atau keselamatan hardware.
- Migration schema dibuat sebagai source kompatibel tetapi tidak dijalankan; server, DB, API runtime, lint, build, test, dan browser tetap dilarang sesuai guardrail.

## 2026-09-26 — Prototipe terisolasi dan perbaikan lingkungan CLI

- Owner menyetujui usul 1 dan 2: agent boleh membuat prototipe kecil di direktori
  sementara untuk pekerjaan sulit dan memperbaiki alat/lingkungan CLI yang rusak atau
  tidak lengkap secara terarah. Keduanya harus terkait tugas sah, tercatat, dan dapat
  dibersihkan atau dipulihkan.
- Prototipe memakai data contoh tanpa rahasia; hasil tidak otomatis masuk aplikasi.
  Perbaikan lingkungan tidak mereset/menghapus massal atau mengubah source, lockfile
  aplikasi, data, dan proses Owner secara sembarangan. Perubahan produk tetap lewat
  item, lock, dan QA.
- Usul 3 tentang verifikasi test/build **belum disetujui**. Larangan server, lint,
  build, test, database, dan request API aplikasi tetap berlaku.

## 2026-09-26 — Pemasangan alat kerja agent secara terarah

- Owner mengizinkan AI/Agent mana pun memasang alat CLI/pendukung secara otomatis saat
  pekerjaan sah membutuhkan kemampuan yang belum tersedia, termasuk untuk desain kompleks.
  Izin ini memperbarui larangan npm sebelumnya hanya untuk pemasangan alat kerja yang
  diperlukan; larangan server, lint, build, test, database, dan request API aplikasi
  tetap berlaku sampai diubah Owner.
- Agent harus memilih sumber tepercaya, memeriksa versi/lisensi/kompatibilitas/biaya/izin,
  mengutamakan instalasi terisolasi, serta mencatat alat, tujuan, lokasi, dan cara melepasnya.
  Biaya, credential/hak sistem baru, dan perubahan dependency runtime/data tetap mengikuti
  gerbang Owner. Pemasangan bukan alasan menambah pekerjaan acak atau proses background.

## 2026-09-26 — Buku panduan kelanjutan dan disiplin kerja semua agent

- Owner meminta saran kesiapan sebelum berhenti berlangganan disimpan sebagai buku panduan
  root Madevi. Buku memprioritaskan salinan source/data yang aman, bukti restore terisolasi,
  handoff ringkas, panduan operasi lokal, dan uji AI CLI pengganti. Buku bukan status item
  atau izin menjalankan drill.
- Semua AI/CLI diwajibkan bekerja dari instruksi Owner/Admin atau item INDEX yang siap;
  Agent 1 boleh membuat usul, tetapi tidak mengubah source. Perubahan material harus
  mempunyai masalah/bukti, hasil, batas, risiko, dan cara verifikasi. Pekerjaan acak,
  refactor tanpa kaitan, scope yang melebar diam-diam, dan klaim tanpa bukti dilarang.
- Sumber status, lock, dan gerbang Owner tidak berubah. Perubahan aturan dicatat pada
  AGENTS root/kontrol, GUARDRAIL, dan WORKFLOW.

## 2026-09-26 — Pemindaian terarah dan penutupan proses

- Arahan Owner: AI CLI/Agent tidak memindai `node_modules`, cache, output build, atau hasil
  generasi yang tidak terkait secara default untuk menghemat kuota dan waktu. Bila pekerjaan
  membutuhkannya, pemindaian terarah boleh dilakukan langsung dengan alasan yang dicatat.
- Setelah pekerjaan selesai, agent tidak menjalankan/meninggalkan task manager atau proses
  latar belakang yang tidak perlu. Proses sementara yang agent sendiri mulai ditutup bila
  aman; proses Owner/agent lain tidak dihentikan sembarangan. Agent 1 Perencanaan tetap
  boleh berjalan selama runner aktif menurut guardrail.

## 2026-09-26 — Pintu masuk root dan jeda/lanjut Owner

- Owner meminta `Madevi/README.md` menjadi pengarahan awal AI CLI/Agent. `Madevi/AGENTS.md`
  menunjuk README agar agent yang membaca instruksi folder mendapat pintu masuk yang sama.
- Instruksi langsung Owner/Admin menjeda siklus otonom dan didahulukan. Agent menyimpan
  checkpoint aman tanpa mengubah status item menjadi PASS atau mencabut lock secara diam-diam.
  Pesan `next`, `lanjut`, atau `next agent` melanjutkan pekerjaan terakhir setelah status,
  lock, dan source pada batas kerja diperiksa kembali.
- README dan aturan tidak membuat proses background hidup sendiri. Sumber status tetap INDEX;
  aturan rinci jeda dan resume berada di WORKFLOW.

## 2026-09-26 — Mandat Owner untuk perencanaan kontinu dan siklus otomatis

- Owner meminta setiap AI/Agent memprioritaskan Agent 1: cari peluang web secara luas,
  teliti sumber internet/buku/komunitas/media sosial/tokoh, dan catat ide sebagai usul
  blueprint. Agent 2–5 harus langsung melanjutkan checkpoint sampai implementasi serta
  audit item siap, tanpa menunggu instruksi teknis rutin.
- Revisi guardrail: kerja latar belakang **perencanaan** diizinkan selama platform menyediakan
  runner aktif. Larangan server, npm, lint, build, test, database, dan request API aplikasi
  belum dicabut. Dokumen tidak dapat menjalankan agent ketika perangkat/sesi/runner mati;
  checkpoint menjadi mekanisme kelanjutan.
- Luas riset tidak menghapus kebutuhan verifikasi, atribusi/hak pakai, keselamatan, privasi,
  lock, audit, atau gerbang Owner untuk tindakan sulit dipulihkan. Usul baru tidak mengubah
  item yang sedang dikerjakan; Agent 5 mempromosikannya saat siap dan tidak konflik.

## 2026-09-26 — Rencana per bidang, satu hasil utuh

- Arahan Owner: rencana Madevi dibuat ringkas per bidang dan dikerjakan sebagai satu paket
  terkait; desain tidak dipecah menjadi D1/D2/D3. Pola yang sama berlaku pada bidang lain.
- Dipilih: roadmap P0–P9 diganti rencana desain, konten, fungsi, operasi, dan kesiapan online.
  Backlog hanya menyimpan kandidat yang belum aktif; item selesai/punya status tetap di INDEX
  dan QA. Item baru dipisah hanya bila hasilnya independen, lock konflik, atau izin/migrasi/
  risiko menuntut batas tersendiri.
- Laporan audit dan riwayat keputusan tetap disimpan sebagai bukti. Perubahan ini hanya pada
  `Madevi-Control`; tidak memeriksa atau mengubah `Madevi_Off`.

## 2026-09-25 — ROUTE-FIX-001: /admin diredirect, bukan dibangun ulang

- Fakta: `/admin` hanya berisi `layout.tsx` + `page.tsx` (redirect ke `/admin/operasi` yang
  tidak ada). Semua 19 halaman + shell + cookie + login ada di `/owner/*`. `AdminShell`
  menaut 16 item ke `/admin/*` (semua 404) dan tombol logout-nya memanggil
  `/api/v1/admin/logout` yang tidak ada. Sebaliknya `OwnerShell` dan `AdminService`
  getPriorityQueue sudah benar menunjuk `/owner/*`.
- Opsi A (dipilih): jadikan `/admin` alias pengalihan ke `/owner` di `next.config.ts`
  (`permanent:false`) + perbaiki href capability di `admin.ts`. Alasan: irisan terkecil yang
  menutup seluruh dead-end, mempertahankan deep link lama sebagai recovery path jujur
  (MASTER §10.2), dan tidak menghapus apa pun yang masih bekerja.
- Opsi B (ditolak): bangun ulang 19 halaman di `/admin/*`. Alasan: menduplikasi seluruh
  surface Admin melawan MASTER §4 (tidak membuat duplikasi route) hanya untuk memenuhi
  narasi "canonical" lama; narasi itu kalah terhadap bukti source.
- Opsi C (ditolak): hapus folder `src/app/admin/` dan `admin-shell.tsx`. Alasan: tidak ada
  VCS untuk pemulihan; redirect di config sudah membuatnya tidak terjangkau; penanda
  jejak migrasi lebih aman daripada penghapusan tanpa backup (MASTER §4).
- Catatan peran: auditan ADMIN-001-REV1 (2026-09-25) menyatakan PASS untuk tiga file
  lock-nya dan INDEX kini menandai `PASS`. Perubahan `admin.ts` getCapabilities di sesi ini
  terjadi setelah jendela audit tersebut; bila audit ulang atas file itu diperlukan,
  letakkan dalam ROUTE-FIX-001. Bukti audit sebelumnya untuk `owner-console.tsx` dan
  `owner-shell.tsx` tetap berlaku (tidak disentuh sesi ini).

## 2026-09-25 — ROUTE-FIX-001: assertion prompt03 diperbarui, bukan dihapus

- Fakta: 5 kegagalan `prompt03.test.ts` (dari suite unit yang berjalan sebelum guardrail
  diketahui) seluruhnya adalah nilai kontrak desain lama: footer "copyright 2027", popup AI
  "belum aktif", token `--content-width: calc(100% - 24px)` / `--content-gap: 12px`, dan
  placeholder "On Style" di tokens.css. Kelima nilai diganti oleh `UX-REDESIGN-001`
  (audited PASS) dan D08/D09; produk tidak mundur.
- Opsi A (dipilih): perbarui assertion ke kontrak baru dengan komentar yang menyebut
  alasan dan sumber perubahan. Alasan: test tetap menjaga kontrak desain (fungsi aslinya),
  sesuai MASTER §4 yang melarang menghapus test gagal demi status hijau, dan mengikuti pola
  DECISIONS proyek ("test legacy di-skip/perbarui, bukan dihapus").
- Opsi B (ditolak): hapus 5 test. Alasan: melanggar MASTER §4 dan menghapus pengawasan
  kontrak desain.
- Opsi C (ditolak): skip dengan `runIf`. Alasan: sumber nilai baru tersedia dan stabil
  (bukan arsip yang hilang seperti kasus legacy Prompt 05), jadi skip hanya mengurangi
  cakupan tanpa alasan.
- Verifikasi tanpa runner: setiap target assertion diverifikasi dengan grep ke source
  (tokens.css, madevi-on.css, globals.css, footer.tsx, ai-button.tsx); transpile parser
  lulus untuk file test yang diubah.

## 2026-09-25 — D10: Hero utuh tanpa baris dekoratif Basic

- Fakta: `home-cosmos` hanya memiliki posisi absolut di Madevi On. Pada Basic,
  SVG dekoratif menjadi item grid pertama tanpa isi visual sehingga menyisakan
  ruang kosong sebelum konten.
- Dipilih: pulihkan Hero sebelumnya secara utuh—judul, deskripsi, autentikasi,
  tautan kebutuhan ruang, visual, serta jalur cepat ber-route kanonis.
  **Kebutuhan ruang** menjadi H2 tepat setelahnya. Konstelasi tetap tersedia
  eksklusif untuk Madevi On dan disembunyikan pada Light/Dark.
- Alasan: Owner memilih orientasi Hero lengkap. Perbaikan ruang kosong tetap
  terpisah dari komposisi Hero agar Basic tidak membuat item grid dekoratif.

## 2026-09-24 — CTRL-5A-001: control-plane 5-Agent

- Dipilih: Planner, Execution, Auditor, Audit-Revisi, dan Control adalah peran formal. Mereka
  boleh dijalankan berurutan oleh satu Agent atau oleh beberapa Agent bila kapasitas tersedia,
  namun state bersama dan lock selalu mengalahkan koordinasi informal.
- Dipilih: `blueprint/INDEX.md` adalah satu-satunya sumber status aktif. `memory/` menyimpan
  fakta, backlog belum ditriase, checkpoint, bukti, dan keputusan; ia tidak membuat status
  paralel.
- Dipilih: item hanya `PASS` jika semua kriteria wajib lulus dan kesalahan terukur tidak lebih
  dari 1%; untuk kriteria biner/visual, satu kegagalan wajib berarti gagal audit sampai direvisi.
  Agent 4 mendapat maksimum dua putaran revisi sebelum Agent 5 mengeskalasi ke Owner.
- Dipilih: review Owner diperlukan tiap lima item pass, pada perubahan ber-blast-radius besar,
  atau konflik guardrail. Tidak ada komponen sistem yang mengklaim mampu melanjutkan setelah
  device off/logout/limit kuota; ia hanya meninggalkan checkpoint yang jujur.

## 2026-09-24 — D09: motion dibedakan oleh konteks membaca, bukan oleh tema

- Dipilih: GSAP dipakai untuk entrance/reveal target eksplisit di seluruh tema, tetapi hanya
  target luar viewport yang boleh disiapkan invisible. Route artikel tidak memakai motion atau
  page-entry; reduced-motion tetap state final.
- Dipilih: `MADEVI` adalah satu nama wordmark. Kilat biru-kuning dan turn CSS hanya treatment
  logo; Madevi On sendiri mempertahankan lapisan kosmik tambahan.
- Dipilih: Shop memakai grid responsif dan search berada di atas sidebar; menu dibatasi viewport.
  Light/Dark memakai token netral, sementara warna kosmik hanya berada di Madevi On.

## 2026-09-24 — D08: gerak adalah atmosfer, bukan prasyarat membaca

- Fakta: JS choreography menyebabkan state antara—teks belum terbaca, heading terpecah, atau
  section bergerak kembali ketika scroll—yang terasa seperti error pada dokumen dan artikel.
- Dipilih: tidak ada reveal, splitText, atau trigger scroll untuk konten. Madevi On tetap hidup
  dengan starfield/meteor/map CSS yang berada di belakang layout dan berhenti pada reduced
  motion. Ini menggantikan keputusan D06/D07 yang memberi koreografi konten.
- Dipilih: translucency digunakan pada navigasi dan panel sementara; article body tetap padat,
  stabil, dan tanpa backdrop blur. Palet untuk layer ini black-plum, rose-amethyst, dan amber,
  bukan wash biru multiwarna.
- Alasan: tampilan dapat terasa hidup pada glance pertama tanpa menunda orientasi, mengaburkan
  teks, menggeser layout, atau mengganggu pembacaan panjang di Android.

## 2026-09-24 — D07: atmosfer harus berada di belakang struktur, bukan menggantikannya

- Fakta: efek kosmik yang memiliki bidang blur besar, wordmark raksasa, hero tinggi, banyak
  target scrub, dan kartu translucent dapat berbenturan dengan grid nyata. Menambah efek lain
  bukan perbaikan atas tabrakan tersebut.
- Dipilih: palet Madevi On dibatasi ke black/plum sebagai dasar dengan amethyst/amber sebagai
  cahaya; biru tidak lagi menjadi wash global. Starfield SVG dan meteor kecil hidup di shell
  sebagai atmosfer tunggal. Home memiliki constellation map lokal, bukan wordmark dekoratif
  tambahan. Panel/kartu normal opaque dan hanya chrome/hero yang menerima transparansi terukur.
- Dipilih: scatter hero, splitText, dan scroll reveal menjadi motion pendek dengan amplitudo
  kecil. Tidak ada `scrub` per kartu, rotasi scroll, atau filter kontinu. Breakpoint layout
  hero dinaikkan ke 960 px untuk melindungi medium tablet.
- Alasan: tetap terasa besar saat Madevi On dipilih, tetapi hierarchy, grid, fokus, baca, dan
  performa Android tidak dikorbankan untuk efek yang tidak membawa makna.

## 2026-09-24 — D06: Madevi On memegang ekspresi besar; Light/Dark memegang kerja

- Fakta: Owner meminta pengalaman kompetisi desain dengan warna kosmik, transparansi, wordmark
  blur, motion masuk yang merakit komposisi, dan reveal scroll; namun Light/Dark harus tetap
  merupakan tema dasar yang tidak mengganggu kerja rutin.
- Dipilih: hanya Madevi On menerima constellation experience. Brand mark berbentuk M orbital;
  nebula dibuat dari layer CSS + SVG lokal, bukan gambar generik atau resource remote. Surface
  transparan dibatasi pada chrome, hero, dan workspace; teks bacaan mempertahankan kontras.
- Dipilih: GSAP (context + ScrollTrigger) menangani susunan masuk serta scroll trigger;
  Anime.js v4 `splitText` hanya untuk heading pendek blur→fokus dan Anime orbit untuk mark.
  Split node/trigger harus direvert di route cleanup. Tidak menggunakan GSAP SplitText/plugin
  tambahan atau WebGL agar dependency, lisensi, dan beban Android tidak membesar.
- Batas: motion tunduk pada `prefers-reduced-motion`, tidak mengunci input/navigasi, dan tidak
  menciptakan content/status/CTA khayal. shadcn-style primitive lokal tetap dipakai untuk
  semantik Button/Card; ia bukan alasan untuk mengadopsi visual default shadcn.

## 2026-09-24 — D05: identitas berasal dari struktur kerja, bukan efek template

- Fakta: visual yang mengandalkan glass, gradient ambient, lift, shine, badge, atau kartu
  berulang dapat terasa generik tanpa menambah orientasi maupun kemampuan pengguna.
- Dipilih: setiap bentuk harus menjelaskan struktur nyata—header sebagai pembuka, boundary
  bersama untuk pilihan setara, workspace untuk pekerjaan, dan satu monogram Madevi sebagai
  visual hero. Copy menyebut tindakan serta batas yang tersedia; tidak boleh menjanjikan fungsi,
  angka, status, atau kedalaman komunitas yang tidak berasal dari data/route nyata.
- Motion dibatasi: GSAP untuk entry yang singkat, Anime.js hanya untuk monogram; hover tidak
  mengangkat kartu atau memberi shine. Reduced-motion mematikan semuanya.
- Madevi On dipilih sebagai ink black/navy opaque dengan satu sinyal cyan, bukan frosted glass
  dekoratif. Alasan: lebih khas, mudah dipindai, lebih ringan pada Android, dan tidak mengubah
  konten operasional menjadi dekorasi.

## 2026-09-24 — Content Packet melengkapi lifecycle artikel, bukan menggantikannya

- Fakta: `articles` sudah memiliki lifecycle, body aman, sumber, revisi, dan policy baca yang
  dipakai route aktif; menggantinya sekaligus akan berisiko memutus data dan kontrak lama.
- Dipilih: `0039` menambahkan `content_families` dan satu `content_packet` per artikel/edisi.
  Packet menampung canonical key, dossier, claim map, freshness, quality gate, dan handoff;
  `articles.status` tetap lifecycle publikasi kanonis. Artikel legacy tetap kompatibel tanpa
  packet, sedangkan policy server baru kelak wajib memaksa packet/safety/review untuk Tutorial.
- Alasan: informasi editorial dapat diaudit tanpa menyimpan data di client/owner notes atau
  memaksa migrasi data massal sebelum workflow Owner dan verifikasi database tersedia.

## 2026-09-24 — Migrasi Shop tidak boleh menyemai katalog belum terverifikasi

- Fakta: `0037` belum diterapkan namun sebelumnya akan membuat produk dan mitra `PUBLISHED`
  dengan detail serta tautan yang belum tervalidasi.
- Dipilih: pertahankan ID migrasi sebagai no-op agar rantai historis tetap utuh, tetapi jangan
  membuat data katalog. Katalog hanya dibuat oleh Owner saat rekam sumber/status mitra dan
  tindakan yang nyata tersedia.
- Alasan: mencegah katalog atau alur afiliasi palsu masuk ke database saat migrasi berikutnya
  dijalankan.

## 2026-09-24 — Motion bersifat terarah dan primitive tetap lokal

- Fakta: User meminta referensi GSAP, Anime.js, dan shadcn/ui untuk seluruh permukaan, tetapi
  basis aplikasi memakai CSS biasa (tanpa Tailwind) dan konsol Admin/Owner harus tetap basic.
- Dipilih: GSAP hanya mengatur urutan masuk halaman/kartu/reveal melalui scope lokal dan cleanup
  route; Anime.js hanya untuk micro-motion emblem hero. `Button`/`Card` mengikuti pola komposisi
  shadcn (Slot + variant) tetapi dimiliki lokal dengan CSS token, bukan migrasi Tailwind atau
  menyalin katalog komponen penuh. Owner/Admin tidak menerima entrance choreografi baru.
- Alasan: hasil terasa hidup tanpa transform layout, animasi ganda, bundle/markup berlebihan,
  atau panel kerja yang sulit dibaca. Reduced-motion tetap menghentikan seluruh motion JS/CSS.

## 2026-09-24 — Madevi On memakai frosted glass secara fungsional, bukan pada semua bacaan

- Fakta: Owner meminta Madevi On yang lebih transparan/blur seperti iPhone, sementara keputusan
  D04 sebelumnya membatasi efek agar Android tetap ringan dan informasi tetap mudah dibaca.
- Dipilih: glass black/navy berlapis dipakai untuk chrome, menu, dialog, login, panel kerja,
  dan shell Admin. Kartu bacaan tetap lebih opaque; setiap ruang memperoleh cue warna pada
  tujuan/aksi tanpa menyamakan semua isi menjadi gradient atau kartu kembar.
- Alasan: identitas terasa hidup dan variatif, tetapi struktur informasi, kontras, performa,
  serta reduced-motion tetap dijaga. Fallback opaque tersedia untuk browser tanpa blur.

## 2026-09-23 — Kontrol Agent dipusatkan di Madevi-Control

- Fakta: aturan, prompt, template relay, history, dan paket menu lama tersebar di sembilan
  folder di luar source inti. Sebagian script taxonomy masih hardcode ke folder `Menu/` itu.
- Dipilih: `Madevi-Control` menjadi satu-satunya rumah master scope, prompt, checkpoint,
  dan memori Agent. Source aplikasi tetap bersih di `Madevi_Off`; paket taxonomy yang memang
  dipakai aplikasi ditempatkan di `Madevi_Off/content-local/packages/taxonomy/`.
- Alasan: Agent berikutnya cukup membuka satu kontrol dan satu root source, tanpa konteks
  bercabang atau dependensi kontrol eksternal yang lama.
- Risiko: paket taxonomy yang dipindah belum divalidasi pada runtime di sesi ini karena Owner
  melarang proses. Metadata `sourceRef` lama dipertahankan sebagai provenance, bukan path baca.

## 2026-09-23 — Fitur pengguna tidak lagi boleh berupa simulasi

- Dipilih: setiap alur pengguna harus tersambung ke data/proses lokal nyata atau menampilkan
  ketersediaan yang jujur. Fixture hanya untuk development dan harus berlabel; tidak boleh
  menyamar sebagai hasil, pesanan, pembayaran, atau data pengguna.
- Alasan: Owner menetapkan Madevi sebagai produk lokal yang berfungsi, bukan template demo.

# DECISIONS

## 2026-09-23 — Madevi On hidup hanya pada chrome dan state aktif (D04)
- Fakta: style Madevi On lama pernah mengubah posisi drawer, sementara efek
  dekoratif lama tersebar sampai kartu konten.
- Opsi A (dipilih): gerakkan background secara lambat dan beri border motion
  hanya pada header, sidebar, dialog, AI, serta pilihan aktif; konten baca tetap
  solid. Semua gerak berhenti di `prefers-reduced-motion` dan blur punya fallback.
- Opsi B (ditolak): animasi/blur untuk setiap card atau gradient warna-warni.
- Alasan: sesuai MASTER D04, mempertahankan kontras dan biaya render Android,
  tanpa membuat Madevi On hanya menjadi Dark yang diganti warna.

## 2026-09-23 — Profil memakai satu navigasi kanonis (D03/D07)
- Fakta: ProfileShell sudah memiliki sidebar enam tujuan, sedangkan
  ProfileDashboard menampilkan tab kedua untuk tujuan yang bertumpang tindih.
- Dipilih: sidebar profil adalah navigator kanonis; dashboard profil fokus pada
  informasi akun, keamanan, dan data pribadi.
- Alasan: mengurangi ambiguitas, heading/tab semu, serta state yang tidak sesuai
  konteks. Tidak ada API atau aturan akses yang diubah.

## 2026-09-23 — Dashboard Admin menunjukkan kerja nyata, bukan telemetry dekoratif (D11)
- Fakta: endpoint operasi menyediakan statistik, alert, dan antrean prioritas,
  tetapi UI menyebutnya sebagai command/telemetry sci-fi dan menyembunyikan antrean.
- Dipilih: tampilkan angka yang tersedia, antrean prioritas, state loading/sesi,
  dan hanya route Admin yang ada. Logout mempertahankan pola CSRF cookie.
- Alasan: Admin perlu menentukan tindakan berikutnya dengan data yang ada;
  MASTER melarang statistik dekoratif dan menu buntu.

## 2026-09-23 — Repair checksum migrasi 0022–0024 (tercatat, bukan diam-diam)
- Fakta: file `0022/0023/0024` memakai prefix hardcode `madevi.` (satu-satunya
  dari 34 migrasi) → schema uji kustom gagal di 0026 (`revision_limit` hilang).
- Opsi revert DITOLAK: mengembalikan bug fresh-install.
- Opsi forward-only DITOLAK: 0035 tidak bisa mendahului 0026 yang gagal.
- Dipilih: perbaiki file ke `__SCHEMA__.` + update 12 baris history ke checksum
  baru (0022 `5ca16208…`→`fe4bb8d8…`, 0023 `dc0e7f07…`→`f037ddd1…`,
  0024 `18af98b0…`→`1bd7009b…`). Guard checksum tetap aktif sesudahnya.
  Objek live `madevi` tak berubah (sudah benar di sana).

## 2026-09-23 — Test login Admin diselaraskan ke kontrak nyata (D07)
- Opsi membangun UI device-first DITOLAK: endpoint challenge 410 obsolete,
  login hanya identifier+password, device di-LEFT-JOIN server-side.
  UI tanpa endpoint verifikasi = kontrol palsu (dilarang MASTER §4).
- Dipilih: test assert kontrak nyata (identifier+password required, tanpa
  field perangkat). Bukan pelemahan: rate-limit + sesi tetap diuji integrasi.

## 2026-09-23 — Search diproyeksikan saat promote (D08)

- Opsi A (dipilih): SQL proyeksi MENU di `promote()` (cermin `projectBaseMenu`).
- Opsi B (ditolak): worker `search_index_jobs` baru (lebih besar; outbox tetap kosong).
- Alasan: irisan terkecil yang menutup loop taxonomy→search; R1→school, lain explore.

## 2026-09-23 — MASTER primer, runtime dicabut larangannya

- Opsi ditolak: hapus total `Aturan/Aktif/` (menghilangkan jejak + keputusan produk).
- Dipilih: amandemen per-file + keputusan `Disetujui/AMANDEMEN-MASTER-PRIMER-20260923.md`.
- Alasan: traceable, reversibel, keputusan produk (sidebar, paket, role) tetap berlaku.

## 2026-09-23 — Sumber taxonomy: paket JSON, bukan txt legacy

- Opsi A (dipilih): `--package` + `readTaxonomyPackage()`, legacy jadi fallback.
- Opsi B (ditolak): rewrite JSON-only + hapus parser legacy (blast radius besar).
- Alasan: irisan vertikal kecil; root pilot = R2 via alias slug (cocok `roomSlug`).

## 2026-09-23 — Jalur Explore memakai URL kanonis, bukan memori tab

- Fakta: browser Explore sudah memuat taxonomy nyata, tetapi kategori aktif sebelumnya
  hanya hidup di state komponen. Reload, Back/Forward, dan tautan langsung tidak memiliki
  konteks jalur yang sama.
- Dipilih: path aktif disimpan sebagai `?path=` di root Explore dan selalu dimuat kembali
  dari endpoint taxonomy. Alias server diarahkan ke path kanonis; mode contoh judul tetap
  hanya tampilan lokal karena bukan rute katalog.
- Alasan: membuat struktur kategori → kelompok → jalur dapat tumbuh dan dibagikan tanpa
  menambah route palsu atau menyandikan state data di UI.

## 2026-09-23 — Pagination cursor untuk menu Explore

- Dipilih: ambil 24 node per halaman dari endpoint taxonomy dan tampilkan kontrol
  “menu berikutnya” hanya bila server menyediakan cursor.
- Alasan: root pengetahuan dapat berkembang jauh melampaui katalog pilot, tetapi halaman
  awal tetap padat dan responsif pada perangkat Android. Tidak ada penghitungan total atau
  menu buatan yang disajikan sebagai data.

## 2026-09-23 — Tutorial & Problem Solve menjadi ruang utama terpisah

- Fakta: kebutuhan seperti perbaikan motor, HP, TV, listrik, masak, membuat karya, dan masalah
  sehari-hari membutuhkan alur tindakan. Menempatkannya sebagai kategori Explore akan mencampur
  ensiklopedia konsep dengan instruksi kerja serta membuat discovery tidak jelas.
- Dipilih: ruang utama ketujuh `Tutorial & Problem Solve` ditempatkan langsung di bawah
  Explore pada sidebar dan Beranda. Root memakai taxonomy dan artikel lokal sendiri; Explore
  hanya memberi tautan silang untuk konsep terkait.
- Alasan: pengguna dapat memilih antara “memahami” dan “melakukan” sejak navigasi pertama,
  tanpa menduplikasi konten atau membangun menu semu.

## 2026-09-23 — Risiko panduan praktis adalah data publikasi, bukan disclaimer UI

- Dipilih: R7 memakai level `GENERAL`, `CONTROLLED`, dan `STOP`. Metadata sumber, review,
  alat/prasyarat, serta kondisi berhenti harus tersedia sebelum panduan berisiko diterbitkan.
- Alasan: teks peringatan saja tidak membuat instruksi listrik, kendaraan, gas, bahan kimia,
  atau kesehatan menjadi aman. API/data model harus dapat memaksa alur review ini.

## 2026-09-23 — Test legacy di-skip, bukan dihapus

- `prompt05`/unit legacy: `runIf/skip` bila arsip absen + suite paket baru sebagai pengganti.
- Alasan: MASTER §4 melarang hapus test gagal demi hijau; skip beralasan = jujur.

## 2026-09-24 — Atlas dan Jalur Praktik, bukan ensiklopedia seragam

- Fakta: Explore akan menampung pengetahuan lintas skala, sementara Tutorial akan menampung
  tindakan nyata. Menambah node untuk setiap sinonim, format, atau hubungan akan membuat pohon
  tidak dapat dipakai; format heading ensiklopedia yang seragam juga akan mendorong peniruan
  struktur sumber luar dan tidak cocok untuk diagnosis/tindakan berisiko.
- Opsi A ditolak: satu pohon taxonomy sangat dalam dengan satu template artikel untuk semua
  konten. Ia menduplikasi artikel, memperbesar menu, serta menyamakan pemahaman dengan tindakan.
- Opsi B dipilih: pohon `R→D→K→M→T` yang dangkal sebagai rumah navigasi; facet dan relasi
  sebagai graf discovery; satu rumah taxonomy per artikel; serta profil komposisi Madevi yang
  berbeda untuk Atlas Explore dan Jalur Praktik Tutorial.
- Alasan: skala koleksi dapat bertumbuh tanpa sidebar meledak, discovery tetap dapat ditelusuri,
  sumber dapat menguatkan klaim tanpa menyalin bentuknya, dan safety Tutorial dapat dipaksa oleh
  data/profile server-side. Rincian operasional berada di
  `KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`.

## 2026-09-24 — Tools mengikuti kelompok pekerjaan dan hanya memuat alat nyata

- Fakta: ruang Tools sudah memiliki tiga alur dengan lifecycle berbeda—kalkulasi Rumus,
  pemrosesan PDF, dan pembuatan Dokumen Karier—tetapi pemilih datar mengesankan semua alat
  adalah kategori dokumen. Permintaan Word/Excel, konverter, atau generator berikutnya berisiko
  berubah menjadi tombol aktif tanpa proses lokal.
- Opsi A ditolak: daftar panjang semua format/alat, termasuk item belum tersedia atau disabled.
  Ia memboroskan ruang, tidak berskala, dan melanggar larangan UI fitur palsu.
- Opsi B dipilih: tiga tingkat **kapsul Kelompok alat → kapsul Pilihan alat → workspace aktif**.
  Kedua kapsul membuka dropdown dan ditutup dari luar area/Escape. Kelompok awal hanya Hitung &
  Rumus, Dokumen & Berkas, dan Generator; pilihan alat hanya berisi tool yang menyelesaikan
  input → validasi → proses lokal → hasil → recovery.
- Alasan: menu dapat tumbuh untuk rumus, berkas, data, media, dan generator tanpa mengurangi
  fokus area kerja. Operasi yang punya lifecycle sama, seperti tujuh operasi PDF, tetap berada
  dalam satu workspace. Detail kontrak dan backlog ada di
  `TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`.

## 2026-09-24 — Tools bertumbuh sebagai katalog kemampuan nyata, bukan daftar format

- Fakta: Tools perlu menampung pekerjaan dokumen, data, gambar, media, generator, kebutuhan
  praktis, serta diagnostik lokal, tetapi saat ini hanya Rumus, PDF, dan Dokumen Karier yang
  menyelesaikan alur input → proses → hasil secara nyata.
- Opsi A ditolak: menaruh seluruh nama format atau calon alat pada sidebar/selector sejak awal.
  Ia menjadikan roadmap sebagai fitur palsu, sulit dicari pada skala besar, dan membuat pengguna
  tidak tahu perbedaan risiko serta keluaran setiap kemampuan.
- Opsi B dipilih: sepuluh group pekerjaan sebagai akar informasi, lalu model **Group → Family →
  Tool → Operation** dengan Tool Brief, mode eksekusi lokal paling kecil, retensi data, dan
  lifecycle `IDEA → CONTRACTED → IMPLEMENTED_UNVERIFIED → VERIFIED_LOCAL → PUBLISHED`.
  Hanya `PUBLISHED` yang terlihat sebagai alat pada selector utama.
- Alasan: struktur ini tumbuh ke banyak kemampuan tanpa membuat halaman awal padat, menjaga
  operasi sejenis dalam satu workspace, dan memaksa setiap fungsi memiliki kontrak keamanan serta
  keluaran yang dapat diperiksa. Rincian ada di `TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`.

## 2026-09-24 — Artikel adalah packet yang dapat dikoreksi, bukan halaman sekali tulis

- Fakta: pengetahuan berskala besar memerlukan versi, bahasa, sumber yang dapat ditelusuri,
  koreksi, dan serah-terima lintas-agent. Taxonomy dan profil komposisi saja belum mencegah judul
  ganda, sumber yang melemah, atau artikel DRAFT yang kehilangan konteks pengerjaan.
- Opsi A ditolak: mengandalkan judul, slug, dan daftar sumber akhir sebagai identitas/kualitas
  artikel. Pendekatan ini tidak mampu menyatukan edisi, menautkan klaim ke bukti, atau melanjutkan
  pekerjaan secara andal setelah agent berganti.
- Opsi B dipilih: **Content Packet** ber-ID dengan canonical key/family, dossier, claim map,
  profil, safety/freshness/review, history, dan titik lanjut. Publication lifecycle, kematangan
  bukti, serta freshness dipisahkan; hanya paket yang lolos gate dapat menjadi `PUBLISHED`.
- Alasan: satuan kerja menjadi dapat diaudit, dikoreksi, dicari, dan diteruskan tanpa menyalin
  artikel atau mempromosikan konten setengah jadi. Rincian ada di
  `KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md` versi 1.1.

## 2026-10-14 — Keputusan INOVASI-0841 + INOVASI-0940

- **Preferensi Zona Tenang disimpan di `principals.ui_preferences`
  (JSONB), bukan kolom baru.** Alasan: tabel `principals` sudah memiliki
  kolom `ui_preferences` + `ui_preferences_updated_at`; memakai JSONB
  menghindari migrasi ALTER TABLE struktural dan cocok untuk preferensi
  UI boolean tunggal. Merge dilakukan pure function
  (`mergeCalmModePreference`) agar key lain tidak tertimpa, dan route
  PATCH memvalidasi tipe sebelum diteruskan ke service.
- **Kanonisasi mingguan Dongeng Bareng adalah method `canonizeWeekly()`
  yang dipanggil operator server, bukan cron betulan.** Alasan: produksi
  lokal-Termux tanpa scheduler terjamin; ide #0940 secara eksplisit
  menyebut "simulasi cron di server, label jujur". Job diberi signature
  `week` agar dapat diuji/dipanggil idempoten per pekan.
- **`vote_count` bab selalu = COUNT(*) dari `story_votes`, bukan kolom
  counter yang di-increment.** Alasan: anti-balik (recount otomatis
  setelah cabut vote); UNIQUE(chapter_id, voter_id) di DB menjamin
  idempotensi tanpa logika aplikasi.
- **Estimasi hemat Bundel bersumber dari `SHIPPING_TARIFFS` statis
  admin, selalu diberi label "estimasi simulasi".** Alasan: Madevi Shop
  adalah afiliasi yang tidak bisa mengetahui tarif marketplace nyata;
  menampilkan angka pasti akan menjadi klaim palsu (melanggar guardrail
  "tidak ada angka palsu"). Rumus (single×n − bundle)÷n dipublikasikan
  di unit test agar transparan.
- **Form gabung bundel menggunakan form inline, bukan
  `window.prompt()`.** Draft awal memakai prompt asli (melanggar
  larangan popup); diganti dengan form inline per kartu sebelum commit.
- **Fitur Line baru masuk tab grup "Kolaborasi" di dashboard Line,
  bukan ruang baru.** Alasan: mandat tepat 7 ruang tidak boleh
  ditambah; tab grup sudah ada polanya (Ruang Saya / Teman & Pesan /
  Komunitas).

## 14 Okt 2026 — Batch INOVASI-1045/1145/1245

- **Validasi fase dipaksa di service layer, bukan hanya UI.** Giliran
  Dengar: SARAN ditolak sampai pembicara aktifkan "Saya butuh saran".
  Sidang: kind argumen dibatasi per fase; voting baru bisa dibuka setelah
  ≥2 argumen SANGGAH. Klinik: kind feedback dibatasi per fase. Alasan:
  UI bypass mudah; server-side enforcement adalah satu-satunya jaminan
  protokol. Pure function-nya (assertResponseAllowed,
  allowedArgumentKinds, allowedFeedbackKind) di-unit-test.
- **Suara Sidang Warga anonim via HMAC hash, bukan id mentah.** Hash =
  HMAC(secret, user_id:session_id); UNIQUE(session, hash) mencegah
  double-vote tanpa menyimpan identitas pemilih. Hasil vote disembunyikan
  sampai voting ditutup (anti-bandwagon).
- **Kuorum Sidang: partisipasi < 60% → DIBATALKAN, bukan hasil minoritas
  yang menang.** quorumMet(votes, activeMembers, pct) — pure, teruji.
- **Silsilah: anti-siklus + maks 3 tingkat.** wouldCreateCycle() menaiki
  chain parent sebelum insert; lineageDepth ≥ 3 ditolak. Mencegah pohon
  remix tak terhingga.
- **Petisi: link harus dari marketplace resmi (Tokopedia/Shopee/
  Bukalapak/Lazada).** Konsisten dengan guardrail "katalog harus SAMA
  PERSIS marketplace aslinya, tidak boleh mengarang produk palsu".
- **Duel: alasan vote minimal 30 karakter.** Mendorong vote beralasan,
  bukan asal pilih; kartu pro/kontra minimal 20 karakter.

## 2026-10-16 — Label jujur vs kontrak test lama (siklus #3)
- **Prinsip:** bila kode produk sengaja memakai label jujur baru dan test masih
  memakai kontrak lama, yang diperbarui adalah TEST, bukan produk — selama label
  baru memang lebih jujur (aturan prototype: simulasi berlabel jujur).
- `MAILBOX_SIMULATION` → `LOCAL_INBOX`: OTP/masukan masuk inbox lokal nyata
  (`owner_inbox_items`), bukan "mailbox simulasi". String lama sudah tidak ada
  di src/ sama sekali.
- Mode AI `SIMULASI` → `LOCAL_RETRIEVAL`: asisten benar-benar retrieval lokal
  dari artikel DB, tidak mengklaim model/provider online. Label SIMULASI justru
  menyesatkan.
- Appeal `SIMULASI` → `LOCAL_QUEUE`: banding masuk antrean lokal nyata.
- `getRuntimeMenu().spaces.length` 6 → 7: kanonis tepat 7 ruang (aturan Ade).
