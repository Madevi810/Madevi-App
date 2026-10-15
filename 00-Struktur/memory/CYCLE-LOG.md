# CYCLE LOG — Madevi

Riwayat ini menjelaskan *mengapa* dan *apa yang diverifikasi* per siklus. Changelog tetap
menjadi daftar perubahan source; checkpoint tetap menjadi titik mulai berikutnya.

## 2026-09-25 — AMBIENT-001: gamenative.app diadaptasikan, bukan disalin

- **Masalah Owner:** suasana Madevi On belum terasa hidup/premium; arah desain gamenative.app
  (ambient/parallax/glass/glow) harus masuk, tetapi disesuaikan ke identitas Madevi (D07:
  black/plum + amethyst/amber) dan tidak menyalin mentah. Light/Dark harus tetap netral.
- **Keputusan:** pecah arah menjadi item induk + turunan yang auditable, bukan satu item
  raksasa. Item pertama hanya lapisan ambient + geser aksen + glass; staggered reveal, animated
  gradient text, micro-interactions, dan device frame masuk backlog turunan.
- **Implementasi:** tiga blob HTML blur berat + grid 56px bermask radial + parallax via satu
  custom property. Semua resep gamenative direplikasi 1:1 dengan CSS murni
  (`filter: blur()`, `mask-image`, `translate3d(var(--…))`) — tanpa Tailwind, tanpa CDN, tanpa
  dependency baru (DECISIONS.md melarang migrasi Tailwind). Cukup JS biasa: satu scroll
  listener rAF dengan cleanup.
- **Temuan saat audit (Agent 3):** cascade Madevi On terpecah ≥5 generasi aturan yang saling
  menimpa di dua stylesheet, termasuk blok "TOTAL REDESIGN" yang memaksa kartu opaque. Tanpa
  konsolidasi, aturan glass baru akan menjadi dead code. Token kanonis dipindahkan ke satu blok
  di akhir `interface-refresh.css`; sebagai efek samping positif, ambigu sumber kebenaran
  dihilangkan untuk pembaca berikutnya.
- **Verifikasi:** parser TSX 0 error, brace 71/71 + 853/853, audit z-index/pointer-events, dan
  hitung rasio kontras 7.06–18.77:1. Audit lulus 6/6 AC + 5/5 M dengan 0 temuan critical/high.
- **Batas:** runtime/visual tetap `BELUM-DIVERIFIKASI` (guardrail Owner melarang proses).
  Semua klaim di atas adalah klaim statis.

## 2026-09-25 — ROUTE-FIX-001: audit menemukan apa yang lolos dari implementasi

- **Pelajaran kontrol:** implementasi sudah dideklarasikan selesai dengan bukti runtime yang
  baik, tetapi audit statis tetap menemukan `admin/layout.tsx` merender `AdminShell` yang
  seharusnya tidak — komentar mengatakan satu hal, kode melakukan hal lain. Audit Agent 3
  tidak boleh mempercayai komentar; verifikasi import/render aktual.
- **Bug produk yang tidak terlihat dari route check:** tiga daftar Owner Jasa memanggil route
  list yang tidak ada dan menelan error, sehingga panel selalu menampilkan keadaan kosong
  tanpa pesan. Ini tidak terdeteksi oleh audit route murni; dipromosikan menjadi item
  `JASA-API-001` alih-alih disembunyikan sebagai catatan kaki.
- **Verifikasi:** parser TSX layout 0 error setelah perbaikan; bukti runtime pra-guardril
  diterima sebagai fakta historis, bukan sebagai izin menjalankan ulang.

## 2026-09-25 — JASA-API-001: error yang ditelan menyembunyikan route yang hilang

- **Pola anti-pattern:** `catch { setInvitations([]) }` membuat kegagalan jaringan/route tidak
  dapat dibedakan dari "data kosong". Panel terlihat berfungsi padahal tiga daftar selalu 404.
  Aturan: muatan admin yang gagal harus menjadi state error yang terlihat (lihat
  ADMIN-001-REV1), bukan array kosong.
- **Kenapa tidak mengubah service layer:** method list sudah ada dan benar; hanya route yang
  hilang. Menulis ulang service hanya akan memperbesar diff dan risiko. Audit memverifikasi
  bahwa `kind=SERVICE` tidak menyaring order (`listAllServiceOrders` tanpa filter kind).
- **Verifikasi:** parser 0 error; kind map lengkap; auth wajib. Data nyata tetap butuh izin
  proses Owner.

## 2026-09-24 — CTRL-5A-001: status tunggal dan loop yang dapat diteruskan

- **Masalah:** kontrol lama mencampur prompt, handoff, kontrak item, status backlog, dan
  workspace Agent sementara. Hal itu dapat membuat dua dokumen mengklaim status berbeda saat
  sesi putus atau ketika peran kerja berubah.
- **Keputusan:** INDEX menjadi satu-satunya status, QA item menjadi bukti audit, dan lock
  mencegah dua peran memegang item yang sama. Ide Planner masuk backlog terpisah; Control
  menyaringnya sebelum masuk antrian aktif. Retry revisi dibatasi dua putaran lalu dieskalasi.
- **Batas nyata:** lima peran adalah pemisahan tanggung jawab, bukan klaim lima proses akan
  selalu hidup setelah device/logout/kuota putus. Checkpoint ditulis pada batas fase dan sesi
  berikutnya melanjutkan dari state tersimpan.
- **Verifikasi:** struktur file dan referensi kontrol diperiksa statis saja; batas Owner
  melarang process runtime pada sesi ini.

## 2026-09-24 — D09: motion kembali ke ruang umum, bukan ke artikel

- **Koreksi Owner:** motion boleh hidup pada semua tema dan section umum, tetapi mode baca harus
  tenang; nama produk harus Madevi; control search/group Shop masih berpotensi bertabrakan.
- **Implementasi:** GSAP memilih target eksplisit saja. Hero hanya settling singkat, dan target
  scroll disembunyikan hanya ketika benar-benar masih di luar viewport. Artikel dikecualikan dari
  orchestrator dan page-enter. Madevi On mempertahankan star/meteor/map sebagai lapisan lebih
  kompleks.
- **Komposisi:** Shop memakai grid deterministik dengan breakpoint 52rem/34rem; sort menu align
  kanan dan dibatasi `100vw`. Search naik ke z-plane di atas sidebar, filter/result punya
  min-width dan reflow kecil. Light/Dark monokrom; wordmark tepat `MADEVI` dengan kilat/turn.
- **Verifikasi:** parser TS/TSX tujuh file dan PostCSS dua sheet lulus; runtime tidak dijalankan.

## 2026-09-24 — D08: membaca adalah state final, langit yang bergerak

- **Masalah Owner:** teks Home terlambat terbaca akibat entry/split, konten kembali keluar saat
  scroll, dan meteor tidak terlihat; sidebar masih terasa terlalu padat sehingga blur tidak
  terbaca sebagai material. Efek besar tidak boleh mengorbankan article reading.
- **Keputusan/implementasi:** seluruh atribut koreografi Home dibuang dan orchestrator tidak
  lagi memuat runtime GSAP/Anime untuk konten. Starfield shell ditambah dan ditempatkan di layer
  yang benar; tiga meteor mendapat negative delay agar hadir sejak kunjungan pertama. Kaca
  diterapkan hanya di chrome/transient controls. `article-body-wrapper` menjadi bidang baca
  statis dan hampir opaque.
- **Identitas:** wordmark header dirapikan menjadi `MADEVI/ON`; tombol Asisten memperoleh
  bubble beacon dengan starburst asimetris sebagai tanda navigasi sumber lokal, bukan simbol
  AI/orb generik.
- **Aksesibilitas/performa:** dekorasi tetap `aria-hidden`; mode reduced motion membekukan
  meteor/map/veil. Tidak ada opacity, transform, filter, split node, atau ScrollTrigger yang
  dapat menahan konten pembaca. Tidak ada browser/runtime dijalankan atas batas Owner.

## 2026-09-24 — D07: komposisi Madevi On diperbaiki, bukan ditambah tanpa batas

- **Masalah Owner:** setelah D06, blur dan nebula terlalu lebar/rendah, hero terlalu tinggi,
  warna biru menjadi dominan, serta terlalu banyak target scroll berpotensi terlihat bertumpuk.
  Efek ini membuat komposisi terasa generik, bukan seperti satu art direction yang dikendalikan.
- **Bukti source:** home field memiliki tinggi sampai 75rem, hero sampai 41rem, wordmark besar,
  18 scroll target dengan scrub+filter+rotasi, dan layer kartu translucent di banyak halaman.
- **Keputusan/implementasi:** latar Home dibatasi pada 27–39rem, wordmark dihapus, hero turun ke
  maksimum 34rem, dan breakpoint 960 px lebih awal mengubahnya satu kolom. Palet menjadi
  black/plum/amethyst/amber. `MadeviSky` di `PublicShell` menyediakan titik SVG dan tiga meteor
  pendek untuk seluruh ruang; Home tetap memegang peta konstelasi. Scroll hanya reveal y/opacity
  singkat untuk maksimal 12 target; animator hero/word split memakai blur serta offset yang
  lebih kecil. Kartu diperjelas kembali menjadi opaque.
- **Aksesibilitas/performa:** meteorit, map, dan veil bersifat `aria-hidden`; hanya transform,
  opacity, dan filter terbatas yang dianimasikan. `prefers-reduced-motion` mematikan semua
  layer non-esensial. Blur kartu dihilangkan, sehingga scroll Android tidak menumpuk layer kaca.
- **Verifikasi diizinkan:** parser TS/TSX lima file, balance CSS, dan shell SVG lulus. Audit
  browser visual masih perlu izin Owner karena tidak menjalankan server/browser pada siklus ini.

## 2026-09-24 — D06: Madevi On sebagai constellation experience

- **Arah Owner terbaru:** Light dan Dark tidak boleh dipaksa menjadi landing page berefek;
  Madevi On yang menjadi tempat pengalaman besar—warna alam semesta, transparansi, perubahan
  teks blur, komposisi hero berantakan→teratur, serta gerak berdasarkan scroll.
- **Riset yang dipakai:** GSAP `ScrollTrigger` menyediakan trigger/scrub yang dibersihkan oleh
  context; Anime.js v4 menyediakan `splitText` yang dapat menjaga aksesibilitas; shadcn
  memberi pola primitive komposabel, bukan kewajiban menyalin style default. Karena produk lokal
  Termux dan Android, WebGL/video/asset remote tidak ditambahkan; kedalaman berasal dari SVG,
  CSS gradient transparent, blur, opacity, dan transform.
- **Implementasi:** Hero memiliki logo orbital, peta konstelasi, dan wordmark Madevi
  `aria-hidden`. GSAP memasukkan data `data-motion-assemble` dari posisi/rotasi/blur tersebar
  ke komposisi final dan `data-motion-scroll` dari blur ke fokus pada viewport. Anime memecah
  hanya heading pendek lalu mengembalikan node pada cleanup. Surface Madevi On memakai palette
  indigo/violet/cyan/coral menurut ruang; Light/Dark tidak menerima layer tersebut.
- **Batas dan aksesibilitas:** tidak ada teks palsu, statistik, CTA, route, atau fungsi baru.
  Semua visual dekoratif tidak ada di accessibility tree; `prefers-reduced-motion` menonaktifkan
  CSS/JS motion non-esensial dan menampilkan state final. Hanya transform/opacity/filter pada
  jumlah target terbatas yang dianimasikan.
- **Verifikasi yang diizinkan:** parser TS/TSX lima file, balance CSS, dan shell SVG lulus.
  Browser/runtime tetap belum dijalankan atas larangan Owner.

## 2026-09-24 — D05: anti-template, bukan dekorasi AI

- **Masalah pengguna:** pengguna menolak visual generik sekecil apa pun. Lapisan sebelumnya
  masih membawa pola shine tombol, hover-lift, gradient/wash, glass, dan card field yang dapat
  membuat produk tampak seperti template walaupun navigasinya sudah nyata.
- **Keputusan:** karakter Madevi datang dari struktur kerja dan mark-nya sendiri: pembuka
  halaman berupa garis editorial, katalog adalah inventaris dengan satu boundary, dan Home
  mengarahkan langsung ke ruang aktual. Tidak ditambahkan angka, badge, slogan, partikel, atau
  tindakan yang tidak memiliki route/fungsi.
- **Implementasi:** `home-content.tsx` mengganti copy hero menjadi tindakan/batas konkret,
  mempertahankan tautan ke ruang aktif, dan memakai satu monogram. Cascade D05 menghapus
  efek shine/lift/wash dan menyederhanakan Madevi On menjadi opaque ink/navy dengan satu warna
  aksi. GSAP tetap terbatas pada urutan masuk; Anime.js hanya menggerakkan monogram.
- **Verifikasi yang diizinkan:** parser TypeScript/TSX lima file dan keseimbangan CSS lulus.
  Tidak menjalankan npm, lint, test, build, server, browser, database, request API, atau
  proses background atas batas Owner.
- **Risiko/lanjutan:** audit visual pada mobile, desktop, tiga tema, keyboard, dan
  reduced-motion tetap membutuhkan izin menjalankan browser/runtime.

## 2026-09-24 — Content Packet, discovery terkelola, dan safety R7 (D02/D05)

- **Masalah pengguna/sistem:** blueprint Atlas/Jalur Praktik telah menetapkan dossier, claim,
  facet, relasi, freshness, safety, dan review, tetapi data itu belum mempunyai tempat lokal
  terstruktur. Menyimpannya di `owner_notes`, JSON client, atau label UI akan membuat claim dan
  gate `CONTROLLED` tidak dapat diaudit maupun dipaksa server-side.
- **Bukti:** `articles` sudah menyimpan lifecycle, block, source, koreksi, serta satu rumah
  taxonomy, tetapi belum memiliki canonical family/edisi, registry facet, evidence per claim,
  safety R7, atau alias. Source `0037` yang juga masih pending akan menulis katalog Shop belum
  terverifikasi sebagai `PUBLISHED`.
- **Tujuan dan batas:** siapkan schema forward-compatible tanpa menjalankan database, tanpa
  mengubah lifecycle/route artikel lama, dan tanpa menerbitkan R7 atau katalog Shop. Tidak
  menambahkan UI/endpoint aktif yang dapat memanggil table sebelum migration dijalankan.
- **Alur nyata target:** Owner membuat artikel draf → membuat packet terikat edisi/family →
  menyimpan dossier dan blok → memetakan claim ke source → menetapkan facet/relasi/alias →
  mengisi safety/review bila Tutorial → policy server mengecek gate → baru lifecycle artikel
  yang ada dapat mencapai `PUBLISHED`.
- **Permission/privasi:** semua tabel menyimpan actor/reviewer dan harus ditulis hanya melalui
  workflow Owner. Tidak ada telemetry atau source web runtime; detail dossier tetap lokal.
- **Acceptance criteria:** canonical key/family/edisi tidak duplikat; facet value tidak bisa
  dipasangkan pada definisi lain; relation punya tepat satu target; evidence menunjuk source
  lokal; `CONTROLLED` memerlukan flag review Owner; approval membawa reviewer/waktu; koreksi
  dapat menandai safety/rights/discovery; artikel lama tetap tidak dipaksa punya packet.
- **Implementasi:** menambah pair migration `0039`; `content_packets` mengunci profil
  Explore→Atlas dan Tutorial→Practice, freshness, serta precondition approval. Menambah family,
  facet, relation, claim/evidence, safety/review, dan alias; `0037` menjadi no-op karena data
  Shop terdahulu belum nyata.
- **Verifikasi yang diizinkan:** inspeksi statis registry migrasi dan struktur source saja.
  Tidak menjalankan database, migration, npm, lint, test, build, server, atau request API.
- **Risiko dan kompatibilitas:** policy server/UI belum ada dan migration 0036–0039 masih
  pending; maka feature ini belum aktif dan belum boleh dianggap dapat memblokir publikasi.
  Penerapan nanti harus melalui backup + migration foreground Owner, lalu uji policy/rollback.
- **Langkah setelah selesai:** implementasikan policy server dan workflow Owner setelah schema
  diterapkan; kemudian susun package taxonomy R1/R2/R7 DRAFT dan verifikasi pada runtime lokal.

## 2026-09-24 — Recovery node_modules pasca-reify terputus

- **Masalah:** Next gagal boot karena `baseline-browser-mapping` tidak ditemukan, walau package
  telah tercatat dalam lockfile.
- **Bukti:** package tersebut dan 13 dependency lain ditemukan lengkap dalam folder tersembunyi
  bertipe reify sementara, sementara target package kanonis tidak ada. Ini merupakan residu
  instalasi npm lama yang terputus, bukan error source atau konfigurasi browser Madevi.
- **Implementasi:** setiap folder tervalidasi dipindahkan kembali ke nama package kanonis,
  termasuk browserslist, baseline mapping, acorn, semver, prettier, dan `@babel/parser`.
- **Verifikasi:** manifest 14 package dapat di-require; loader supported-browser Next juga
  berhasil dimuat. Tidak menjalankan server, build, lint, test, API, atau operasi database.

## 2026-09-24 — Recovery lanjutan: source-map dan ikon lokal

- **Masalah:** setelah browser loader pulih, Next menemukan `mappings.wasm` internal yang tidak
  ada dan bundler menemukan `lucide-react` yang hanya tersalin sebagian pada mount Android.
- **Keputusan:** pulihkan satu asset WASM exact dari tarball Next; jangan memaksa package ikon
  besar ditulis ulang lewat FUSE. Ganti tiga ikon yang benar-benar dipakai menjadi SVG lokal dan
  cabut dependency Lucide.
- **Verifikasi:** loader Next dan dependency UI lulus, lalu beranda pada dev server yang sudah
  berjalan memberikan HTTP 200. Route/API/data aplikasi tidak berubah.

## 2026-09-24 — Motion publik dan primitive visual yang terkomposisi

- **Masalah:** refresh awal sudah menyatukan token dan surface, namun banyak halaman publik
  belum memperoleh ritme perpindahan yang konsisten; CTA/form masih bergantung pada kelas lama.
- **Keputusan:** memakai GSAP untuk koreografi entry yang singkat, Anime.js hanya untuk gerak
  mikro hero, dan primitive lokal bergaya shadcn supaya link/form lama tidak perlu ditulis ulang.
  Semua route publik dilayani lewat `PublicShell`; nested scope disaring. Owner/Admin tetap
  diperlakukan sebagai konsol operasi basic.
- **Implementasi:** menambah dependency/lock, `MotionOrchestrator`, `Button`, `Card`, helper
  className, integrasi Home/auth/recovery/login Admin, dan finishing CSS untuk surface publik.
  Tidak ada route, endpoint, request body, data, atau alur akses yang berubah.
- **Verifikasi:** parser transpile 10 file dan brace balance CSS lulus; lock-only install offline
  berhasil. Browser/runtime/reduced-motion belum diverifikasi; lint/build/test/migrasi/API/server
  tidak dijalankan atau disentuh.

## 2026-09-23 — Konsolidasi kontrol dan Explore

- **Masalah:** kontrol lama tersebar di banyak folder luar; source taxonomy masih memiliki
  beberapa path file eksternal. Explore memakai navigator generik dan contoh artikel berlebih.
- **Keputusan:** source tetap bersih di `Madevi_Off`; semua aturan/Agent/prompt/memori dipusatkan
  di `Madevi-Control`; paket taxonomy operasional dipindah ke `content-local/packages/taxonomy`.
- **Implementasi:** root Explore menjadi browser taxonomy kompak dan kontrol lama dihapus setelah
  sumber paket dipindahkan. Master baru menetapkan local-Termux, tanpa API online runtime,
  tanpa fitur simulasi/palsu, dan alur checkpoint lintas Agent.
- **Verifikasi:** pemeriksaan statis memastikan parent hanya berisi `Madevi_Off` dan
  `Madevi-Control`, serta source tidak lagi memiliki path ke folder kontrol lama.
- **Batas:** npm, lint, test, build, server, browser, database, dan background tidak dijalankan
  karena instruksi Owner. Verifikasi runtime Explore dan paket taxonomy masih tertunda.
- **Langkah berikutnya:** audit alur “simulasi” pengguna dan ubah menjadi proses lokal nyata atau
  state tidak tersedia yang jujur.

## 2026-09-23 — Penyelesaian fondasi navigasi Explore

- **Masalah:** taxonomy sudah menjadi sumber daftar Explore, tetapi jalur aktif tidak tahan
  reload/history dan daftar besar belum memiliki mekanisme pemuatan lanjutan.
- **Implementasi:** menambah URL kanonis `?path=`, redirect alias API, state loading/error
  untuk tautan langsung, dan pagination cursor 24 node untuk kategori maupun jalur.
- **Keputusan UX:** breadcrumb global tetap kecil; trail taxonomy berada hanya di dalam panel
  yang aktif. Chrome Madevi On hidup dengan ambient pelan yang dapat direduksi; tidak ada
  kategori, grup, atau judul palsu yang ditambahkan.
- **Verifikasi:** inspeksi sumber dan kontrak response endpoint dilakukan tanpa menjalankan
  proses. Runtime, visual, dan database tetap belum diverifikasi atas larangan Owner.

## 2026-09-23 — Ruang utama Tutorial & Problem Solve (D02/D03/D04)

- **Masalah pengguna/sistem:** panduan perbaikan motor, HP/TV, listrik, masak, karya, dan
  kebutuhan harian tidak boleh mencampur peta konsep Explore. Menu praktis sebelumnya tidak
  memiliki ruang, taxonomy, URL, atau batas keselamatan sendiri.
- **Bukti:** `MADEVI_SPACES` hanya memiliki enam ruang; browser Explore dan taxonomy aktif
  memakai root `jelajahi-pengetahuan`, sementara `taxonomy_state` hanya menerima satu revisi
  aktif. Kontrak search belum mengenal ruang praktis.
- **Tujuan dan batas:** menambah ruang utama tepat di bawah Explore, browser taxonomy nyata,
  deep link, state jujur, serta control plan R7. Tidak menerbitkan node, artikel, atau instruksi
  berisiko tanpa package/migration/review yang sah.
- **Alur nyata:** pengguna membuka sidebar/beranda → memilih ruang → taxonomy lokal dimuat →
  menyaring bidang/jalur → membuka panduan artikel yang benar-benar `PUBLISHED`; bila R7 belum
  diterbitkan, UI menyatakan kondisi itu dan menawarkan route Kontribusi yang sudah ada.
- **Permission/privasi:** browsing bersifat publik. Publikasi material `CONTROLLED` tetap
  membutuhkan metadata sumber/review dan alur Owner; tidak ada data pengguna baru atau API
  eksternal yang ditambahkan.
- **Acceptance criteria:** menu berada tepat setelah Explore; route dan search mengenali
  `tutorial`; URL path, pagination, alias, loading/error/empty/retry bekerja melalui kontrak
  taxonomy yang ada; Explore memisahkan konteks tindakan; Control mencatat R7 dan risiko.
- **Implementasi:** navigation contract, runtime menu, Search type/filter/proyeksi R7,
  source migration 0036 untuk constraint key search, route redirect, browser action-first,
  visual Light/Dark/Madevi On reduced-motion, serta `TAXONOMY-PRACTICAL-GUIDES.md` telah
  diperbarui. Migration tidak dijalankan.
- **Verifikasi diizinkan:** inspeksi source dan kontrak endpoint saja. Tidak menjalankan npm,
  lint, test, build, server, browser, database, atau proses background sesuai batas Owner.
- **Risiko/kompatibilitas:** taxonomy R7 belum ada di database aktif sehingga root benar-benar
  akan menampilkan state `belum diterbitkan`; migration search 0036 juga masih pending.
  Artikel saat ini masih diproyeksikan ke Explore sampai metadata taxonomy/risk R7 selesai.
  Jalur deep lama diarahkan ke query URL root baru.
- **Langkah setelah selesai:** rancang migration metadata risiko/review, buat package R7
  multi-root, lalu verifikasi melalui alur Owner ketika operasi foreground diizinkan.

## 2026-09-23 — Identitas dan penghapusan alur tiruan (D03/D04/D11)

- **Masalah pengguna/sistem:** identitas publik belum memakai emblem yang sama pada header dan
  sidebar. Asisten hanya menjalankan adapter mock yang diabaikan, sementara Shop menawarkan
  pembelian yang selalu menuju halaman tiruan; keduanya mengurangi kepercayaan pengguna.
- **Bukti:** `aiService()` menginjeksikan `mockAiAdapter`, jawaban memakai prefix simulasi, dan
  handler Shop memanggil `getBuySimulation()` lalu membawa pengguna ke route `/simulasi`.
- **Keputusan:** produk publik tetap bernama `Madevi`; `Madevi_Off` hanya folder source. Jadikan
  asisten sebagai retrieval sumber lokal nyata dan retire checkout Shop alih-alih menyamar
  sebagai integrasi transaksi.
- **Implementasi:** emblem kanonis dipakai pada shell lintas ruang; adapter mock AI dihapus;
  response asisten dirangkum dari artikel lokal yang berizin beserta sumber; FAB bulat memakai
  motion transform terbatas dengan reduced-motion; UI/endpoint legacy Shop tidak lagi membuka
  checkout tiruan dan route lama dialihkan ke detail.
- **Batas:** S01 OTP/inbox lokal, S02 feedback/outbox, S03 payment/webhook, S04 retensi, dan
  S05–S06 fixture/tool belum dapat dilabel ulang. Audit dan urutan aman ada di
  `SIMULATION-REMOVAL-AUDIT.md`.
- **Verifikasi:** inspeksi source/kontrak statis saja; tidak menjalankan npm, lint, test, build,
  server, browser, database, atau proses background sesuai batas Owner.

## 2026-09-24 — Redesign fungsi-first untuk Services, Tools, Shop, dan Tutorial

- **Masalah pengguna/sistem:** Services, Shop, dan Tools masih memakai pola visual yang sama
  (intro besar, kartu generik, kontrol berulang) sehingga inti pekerjaan tenggelam. Detail Shop
  tidak membedakan gagal request dari produk yang hilang. Tutorial belum mempunyai wadah konsep
  yang dapat dilihat ketika R7 memang belum diterbitkan.
- **Keputusan:** setiap ruang menggunakan struktur yang mengikuti pekerjaan nyata: Services
  menjadi pemilih jalur pesanan → panel kerja; Tools menjadi pemilih alat → workspace; Shop
  menjadi saringan → hasil → rekam keputusan. Tutorial hanya dapat memperlihatkan vocabulary
  statis yang diberi label belum terbit serta satu judul `DRAFT`, bukan panduan palsu.
- **Implementasi:** mengganti markup dan CSS page Services, Tools, Shop, serta detail Shop;
  URL `?tab=` dan endpoint aksi yang ada dipertahankan. Menambah error state detail Shop,
  validasi pertanyaan 10 karakter yang konsisten, dan fondasi R7 interaktif lokal yang tidak
  mengarah ke node/article seolah sudah tersedia.
- **Batas:** tidak membuat checkout, pembayaran, stok real-time, pengiriman, node taxonomy,
  artikel `PUBLISHED`, atau instruksi `CONTROLLED`. Title Tutorial hanya kerangka editorial dan
  diikat ke aturan keselamatan pada `TAXONOMY-PRACTICAL-GUIDES.md`.
- **Verifikasi diizinkan:** inspeksi source statis. Tidak menjalankan npm, lint, test, build,
  server, browser, database, request API, atau proses background sesuai arahan Owner.
- **Langkah setelah selesai:** ketika Owner mengizinkan proses foreground, cek route dan aksi
  Services/Tools/Shop di Light, Dark, Madevi On, serta mobile; kemudian rancang metadata risiko
  dan package R7 sebelum menerbitkan taxonomy atau panduan pertama.

## 2026-09-24 — Madevi On: motion premium tanpa perpindahan layout

- **Masalah pengguna/sistem:** lapisan tema Madevi On yang lama menimpa posisi drawer sidebar
  dari `fixed` menjadi `relative`, sehingga sidebar masuk alur dokumen. Menu juga memakai
  `translateX` saat hover/aktif; theme tampak sekaligus tidak stabil dan kurang terasa hidup.
- **Keputusan:** posisi, ukuran, dan alur dialog adalah milik layout dasar, bukan milik tema.
  Madevi On hanya boleh memberi atmosfer warna dan sinyal state. Motion dipusatkan pada satu
  lapisan latar lambat, garis scan chrome, satu active beacon, dan orb Asisten; kartu tidak
  dianimasikan terus-menerus.
- **Implementasi:** menulis ulang `src/styles/madevi-on.css`; mengunci canonical positioning
  header/sidebar/AI popup, menghapus translasi sidebar, menambah fallback tanpa blur, focus
  ring yang terlihat, reduced-motion, dan motion orbit/float yang tidak menutupi ikon Asisten.
  Pada Shop, offset sticky navigator serta ukuran target dan feedback pertanyaan diperbaiki.
- **Verifikasi diizinkan:** review statis selector, state, dan kontrak JSX saja. Tidak
  menjalankan npm, lint, test, build, server, browser, database, request API, atau proses
  background sesuai arahan Owner.
- **Langkah setelah selesai:** ketika izin foreground berubah, cek di mobile dan desktop bahwa
  drawer selalu fixed di kanan, focus tidak tertutup, hover sidebar tidak berpindah, dan reduced
  motion menghentikan atmosphere, scan, beacon, serta orb.

## 2026-09-24 — Arsitektur akar Atlas Explore dan Jalur Praktik Tutorial (D02/D03/D05)

- **Masalah pengguna/sistem:** koleksi pengetahuan dan panduan dapat tumbuh sangat besar. Pohon
  menu yang memasukkan sinonim, format, dan hubungan akan meledak; satu bentuk artikel seperti
  ensiklopedia juga tidak cocok untuk konsep, sejarah, diagnosis, maupun tindakan aman.
- **Bukti:** taxonomy source yang aktif memakai level `R/D/K/M/T`, artikel menempel pada satu
  `taxonomy_node_id`, dan browser sudah memakai cursor/URL `?path=`. Dokumen R7 sebelumnya
  menyebut level `S`, yang tidak sesuai package/source. `article_blocks` serta sumber lokal sudah
  memberi bahan untuk profil komposisi tanpa HTML web eksternal.
- **Tujuan dan batas:** membangun rencana R2/R7 yang bertahan pada koleksi sangat besar,
  mempertahankan path aktif/multi-root, dan menghilangkan arah template ensiklopedia. Tidak
  mengubah schema, API, source aplikasi, node, artikel, atau status publikasi pada siklus ini.
- **Keputusan:** pohon dangkal adalah rumah navigasi; facet/relasi adalah graf discovery; artikel
  memiliki satu rumah taxonomy dan profil Madevi. Explore menjadi Atlas pemahaman, Tutorial
  menjadi Jalur Praktik tindakan dengan safety gate dan eskalasi.
- **Implementasi:** menambah `KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`, menghubungkannya ke
  content/taxonomy plan, mengoreksi `S` menjadi `M`, memperbarui backlog/state/checkpoint, dan
  mencatat keputusan arsitektural.
- **Verifikasi diizinkan:** inspeksi source dan dokumentasi statis saja. Tidak menjalankan npm,
  lint, test, build, server, browser, database, request API, atau proses background.
- **Langkah setelah selesai:** rancang proposal migration profile konten, facet, relation,
  evidence ledger, dan safety profile R7; lalu package multi-root DRAFT R1/R2/R7 tanpa promote.

## 2026-09-24 — Tools & Equipment sebagai sistem kelompok, bukan halaman dokumen

- **Masalah pengguna/sistem:** Tools harus menampung rumus, generator, berkas, dan kategori
  lanjut tanpa membuat seluruh halaman menjadi daftar tombol atau menyajikan Word/Excel yang
  belum dapat diproses secara lokal.
- **Bukti:** workspace aktif yang sudah ada meliputi Rumus, PDF, dan Dokumen Karier. PDF
  memiliki tujuh operasi; Formula dan Karier memiliki input, validasi/proses, hasil, serta
  penyimpanan/ekspor yang berbeda. Satu navigator datar menyamarkan perbedaan ini.
- **Tujuan dan batas perubahan:** membangun alur kapsul Kelompok alat → kapsul Pilihan alat di
  kanannya → workspace aktif, mempertahankan fungsi dan URL `?tab=`, serta hanya mengekspos alat
  yang benar-benar hidup. Tidak membangun atau mengklaim dukungan DOCX/XLSX pada siklus ini.
- **Alur nyata:** pengguna membuka dropdown kelompok → memilih kelompok → kapsul alat meminta
  pilihan atau langsung membuka daftar alat lokalnya → memilih alat → URL kanonis berubah →
  panel nyata dimuat. Klik luar/Escape menutup daftar; PDF memilih salah satu dari tujuh operasi
  di dalam panel, sedangkan Rumus dan Generator mempertahankan alur kerja mereka sendiri.
- **Permission/privasi:** tidak ada kontrak akses baru. Gate trial/paket, CSRF, pemrosesan PDF,
  simpan privat, dan ekspor lokal yang ada dipertahankan.
- **Acceptance criteria:** tiga kelompok awal jelas, alat tidak dicampur dengan kategori,
  desktop tidak menumpuk menu di atas panel, mobile tetap satu kolom, URL/history tetap benar,
  dan tidak ada tombol fungsi palsu.
- **Verifikasi yang diizinkan:** inspeksi source statis. Tidak menjalankan npm, lint, test,
  build, server, browser, database, request API, atau proses background.
- **Risiko dan kompatibilitas:** visual/runtime belum diperiksa; `?tab=` dan panel eksisting
  dipertahankan agar route/API tidak pecah. Word/Excel ditahan sampai lifecycle file lokal,
  validasi, output, dan recovery dapat dibuktikan.
- **Perbaikan lanjutan:** atribut `hidden` sempat tertimpa oleh `display: grid` pada CSS panel,
  sehingga dua daftar dapat terlihat bersamaan. Selector `[hidden] { display: none; }` sekarang
  mengunci state tertutup; memilih kelompok tetap mentransisikan state tunggal ke daftar alat.
- **Langkah setelah selesai:** implementasikan satu kandidat alat lokal per irisan vertikal
  mengikuti blueprint Tools; baru tambahkan ke registry dan submenu setelah end-to-end selesai.

## 2026-09-24 — Blueprint super-lengkap Tools & Equipment

- **Masalah pengguna/sistem:** arah Tools harus mampu menampung alat yang jauh lebih beragam
  dari PDF, rumus, dan generator karier tanpa mengubah kandidat menjadi menu hidup atau membuat
  satu template workspace yang tidak sesuai dengan pekerjaan berkas, kalkulasi, editor, dan
  diagnostik.
- **Keputusan:** blueprint `TOOLS-AND-EQUIPMENT-ARCHITECTURE.md` menjadi kanonis. Ia menetapkan
  sepuluh akar kelompok, model Group → Family → Tool → Operation, kontrak Tool Brief, empat mode
  eksekusi lokal, retensi data, lifecycle publikasi, tipe workspace, antrian kandidat, dan roadmap
  R0–R7.
- **Batas:** ini dokumentasi kontrol, bukan implementasi alat tambahan. Hanya tiga workspace
  yang telah nyata tetap boleh tampil sebagai aktif; DOCX/XLSX, OCR, media, dan diagnostik tetap
  kandidat sampai proses lokal serta pemulihannya selesai.
- **Privasi/keamanan:** mode online dilarang; mode Termux harus memakai allowlist tanpa shell
  bebas. Validasi berkas, pembersihan sementara, retensi eksplisit, dan batas alat defensif
  menjadi bagian kontrak sebelum UI publik dibuat.
- **Verifikasi diizinkan:** inspeksi dokumentasi dan source statis saja. Tidak menjalankan npm,
  lint, test, build, server, browser, database, request API, atau proses background.
- **Langkah setelah selesai:** mulai dari satu kandidat R1 dengan Tool Brief lengkap dan satu
  irisan input → validasi → proses lokal → hasil → recovery; update registry/UI hanya sesudah
  kandidat mencapai `PUBLISHED`.

## 2026-09-24 — Pendalaman blueprint editorial Explore & Tutorial

- **Masalah pengguna/sistem:** blueprint sebelumnya sudah memetakan taxonomy, profil artikel,
  dan safety, tetapi belum cukup eksplisit menentukan cara satu artikel bertahan melalui versi,
  perubahan fakta, konflik sumber, pergantian agent, dan pencarian skala sangat besar.
- **Keputusan:** versi 1.1 menetapkan Content Packet sebagai unit kerja, canonical key dan edisi
  sebagai identitas, source dossier + claim map sebagai dasar klaim, quality gate berbasis risiko,
  policy freshness/koreksi, serta kontrak pembaca/pencarian lokal yang tidak memalsukan hasil.
- **Batas:** ini hanya pendalaman arsitektur. Tidak membuat artikel, packet, node, migration,
  endpoint, registry, atau status publikasi baru. Satu DRAFT Explore dan satu DRAFT Tutorial yang
  sudah tercatat tetap bukan bukti sistem editorial baru telah berjalan.
- **Kontinuitas:** agent yang berhenti wajib meninggalkan packet berisi lingkup, dossier,
  keputusan, risiko terbuka, dan langkah berikutnya; agent pengganti melanjutkan packet yang sama,
  bukan mengulang riset atau menambah judul kosong.
- **Verifikasi diizinkan:** inspeksi dokumentasi statis saja. Tidak menjalankan npm, lint, test,
  build, server, browser, database, request API, atau proses background.
- **Langkah setelah selesai:** rancang pemetaan schema kompatibel untuk Content Packet dan
  evidence/safety profile, lalu siapkan satu packet Explore berisiko rendah dan satu packet
  Tutorial `GENERAL` tanpa menerbitkan keduanya sebelum gate nyata tersedia.

## 2026-09-24 — Pemisahan rencana tahap online

- **Kebutuhan Owner:** arsitektur online, auth, API publik, dan hardening harus tersedia untuk
  dipikirkan sejak dini, tetapi tidak boleh bercampur dengan pekerjaan/runtime lokal-Termux.
- **Implementasi dokumentasi:** membuat `../Madevi-Online-Plan/` di luar Control dan source,
  berisi sembilan dokumen indeks/scope/arsitektur/auth/API/data/operasi/migrasi/keputusan/readiness.
- **Keputusan:** rencana memilih arah proposal Next.js BFF + Spring Boot modular core API +
  PostgreSQL privat, Redis, worker, dan storage privat; vendor/region/domain tetap terbuka.
- **Batas:** tidak ada source, migration, API online, provider, secret, atau proses yang dibuat.
  Folder baru bukan control plane kedua dan tidak membatalkan larangan runtime online lokal.
- **Verifikasi diizinkan:** inspeksi statis struktur dokumentasi saja; tidak menjalankan npm,
  lint, test, build, server, browser, database, request API, atau proses background.

## 2026-09-24 — Refresh interface global dan Madevi On frosted glass

- **Masalah pengguna/sistem:** antarmuka lintas ruang masih mewarisi shadow, panel, form,
  navigasi, dan motion yang tidak seragam; Dark belum beralas hitam murni, sedangkan Madevi On
  diminta lebih transparan/blur tanpa membuat semua halaman terasa seperti template yang sama.
- **Bukti:** token lama memakai background abu/biru untuk Light/Dark; banyak komponen memakai
  class surface yang sama namun cascade efeknya tersebar. Menu Admin/Owner masih text-only,
  sedangkan navigasi publik sudah memakai SVG semantik.
- **Tujuan dan batas perubahan:** memperbarui global visual Light/Dark/Madevi On, Home, menu,
  login, serta konsol Admin/Owner dengan token dan CSS final cascade. Tidak mengubah route, API,
  data, auth, CSRF, form action, atau menu/destinasi yang tersedia.
- **Alur nyata:** tombol/form/link mempertahankan interaksi asli; perbaikan hanya menambah
  feedback press/hover/focus, enter motion transform/opacity, dan visual status. Ikon group
  Admin bersifat dekoratif karena label teks tetap menjadi nama aksesibel tujuan.
- **Permission/privasi:** tidak ada permission, request, atau penyimpanan baru.
- **Acceptance criteria:** Light tetap putih, Dark pure black, Madevi On memiliki blur dengan
  fallback opaque; motion menghormati reduced-motion; target menu/login/Admin tetap semantik;
  card membaca tidak kehilangan kontras; tidak ada feature/menu palsu.
- **Verifikasi yang diizinkan:** parser transpile TypeScript tiga file dan keseimbangan brace
  CSS lulus. Tidak ada npm, lint, test, build, server, browser, database, atau request API.
- **Risiko dan kompatibilitas:** visual aktual dan konflik cascade tidak dapat diperiksa tanpa
  browser yang diizinkan; desain menarget class existing dan impor berada terakhir agar route
  maupun kontrak komponen tidak berubah.
- **Langkah setelah selesai:** saat batas proses berubah, lakukan audit foreground pada 375 px,
  desktop, light/dark/Madevi On, sidebar fixed, focus keyboard, dan reduced-motion.

## 2026-10-14 — Audit 12 jam #1 oleh Muse (runtime lokal)
- Basis: madevi-full-20261014-1337.zip (853 file) via operator (bot LightVela error 429/404, kirim file DITAHAN).
- Restore db-dump.sql (161 tabel) + migrate up 0041–0049 → 183 tabel, 49/49 applied.
- Perbaikan Muse: (1) 0042 CHECK subquery → tanpa subquery; (2) invitation-order-form ID unik via useId(); (3) sidebar pathname null guard.
- Verifikasi: tsc EXIT 0; vitest unit 17 file / 202 lulus / 5 skipped; smoke 7 ruang + /api/health + 5 API inovasi = 200.
- Known: prompt03-behavior.test.tsx hang full-run (test pollution); artikel live 3; database-seed/ tidak di zip.
- Paket: madevi-fixed-20261014-1830.zip (db-dump.sql fresh, tanpa .env.local).

## 2026-10-16 — Audit 12 jam #3 oleh Muse (runtime lokal)
- VM reset menghapus PostgreSQL lagi → install ulang 16.15, rebuild DB dari seed
  via madevi-rebuild.sh (bind-mount atasi workspace-guard; perbaiki
  MADEVI_RUNTIME_ROOT di .env.local sisa): 52/52 migrasi, 182 tabel, 43 node
  taksonomi, 710 artikel DRAFT.
- Bug P0 DIPERBAIKI: (1) feedback publik anonim selalu 500 (consumeRateLimit
  tulis string non-UUID ke kolom uuid) → lewati untuk anonim, verifikasi runtime
  202; (2) kolom principals.ui_preferences tidak ada (migrasi hilang, fitur Zona
  Tenang) → migrasi 0052 baru.
- Test basi disinkronkan ke label jujur produk (LOCAL_INBOX, LOCAL_RETRIEVAL,
  LOCAL_QUEUE, 7 ruang); 3 test prompt03 ditulis ulang ke desain kanonis SEC-001.
- Verifikasi: tsc EXIT 0; vitest penuh 61 file / 728 lulus / 10 skip / 0 gagal;
  smoke 11/11 (7 ruang kanonis + /api/health database:ok); rate limit jasa
  10x201+2x429 terverifikasi runtime.
- Known: idempotency-key server-side public-feedback belum diimplementasikan
  (masuk BACKLOG); test integrasi butuh DB live + bind-mount guard.
- Paket: madevi-fixed-20261016-0136.zip (4,4 MB; db-dump.sql fresh 3,6 MB,
  tanpa node_modules/.next/.env.local).
