# Blueprint Pengembangan Web Madevi — Audit Menyeluruh dan Portofolio Hasil

**Versi:** 1.0-draft · 2026-09-28  
**Peran:** Agent 1 — Perencana  
**Status:** DRAFT PERENCANAAN; bukan status implementasi, bukan izin publikasi, dan bukan pengganti `blueprint/INDEX.md`.  
**Sumber kebenaran status/lock:** `../INDEX.md`  
**Root source yang diaudit:** `../../Madevi_Off`  

## 0. Cara membaca dokumen ini

Dokumen ini memisahkan empat hal:

- **Fakta source:** hasil pencocokan statis pada tanggal di atas.
- **Gap:** perbedaan antara kontrak blueprint dan perilaku/isi yang terlihat dari source.
- **Usul:** pekerjaan yang dapat dipertimbangkan Agent 5 untuk backlog; belum aktif.
- **Target verifikasi:** bukti yang harus dikumpulkan Agent 2–4, bukan klaim bahwa fitur sudah siap.

Tidak ada route, API, service, fixture, atau komponen yang dianggap siap hanya karena berkasnya
ada. Route aktif harus dibuktikan melalui input → validasi → proses/data → hasil → recovery.

---

## 1. Snapshot web yang dipetakan

### 1.1 Peta ukuran source

| Area | Fakta statis | Implikasi perencanaan |
|---|---:|---|
| Halaman App Router | 57 `page.tsx` terdeteksi | Inventaris target sebelumnya menyebut 55 pola; perlu rekonsiliasi dua route baru/alias sebelum membuat route tambahan. |
| API Route Handler | sekitar 200 `route.ts` | Risiko terbesar adalah kontrak silang, bukan ketiadaan endpoint. Setiap hasil harus memilih domain dan kontrak yang jelas. |
| Service domain | sekitar 30 service TypeScript | Banyak logika bisnis sudah berada di service; perubahan UI tidak boleh melewati permission server. |
| Migration SQL | 80 file terdeteksi | Schema sudah berisiko tinggi untuk perubahan sembarangan; item baru wajib migration kompatibel dan rollback aman. |
| Test | sekitar 80 file terdeteksi | Coverage ada per prompt/domain, tetapi runtime/DB/browser tetap harus dibedakan dari test source. |
| Runtime content | `runtime-menu.ts`, `service-catalog.ts`, `starter-articles.ts` | Fixture dan paket draft harus selalu berlabel; tidak boleh mengisi kekosongan publik seolah data terbit. |
| Tema/UI | tokens, globals, redesign, interface-refresh, madevi-on, atlas | Sistem visual kaya tetapi cascade dan verifikasi breakpoint perlu satu gerbang konsistensi. |

### 1.2 Tujuh ruang dan hasil pengguna

| Ruang | Nilai yang harus selesai | Gap prioritas yang perlu dibuktikan |
|---|---|---|
| Explore & Learn | pengguna menemukan artikel terbit, sumber, relasi, dan freshness | density/kelengkapan konten terbit, canonical taxonomy, zero-result, structured data artikel |
| Tutorial & Problem Solve | pengguna mendapat langkah yang dapat diuji atau STOP aman | safety gate, hasil langkah, freshness, laporan koreksi, bukan hanya browser taxonomy |
| Madevi School | jalur, materi, progres, assessment versi, hasil | bank soal/entitlement/attempt perlu data nyata dan resume/recovery end-to-end |
| Madevi Line | komunikasi dan moderasi yang privat serta dapat dipulihkan | moderasi, upload, request, block/mute, retention, notifikasi, dan failure recovery |
| Madevi Services | katalog nyata → brief/order → status → hasil | form undangan masih menyatakan “akan diimplementasikan”; status quote/harga/hasil harus dibedakan |
| Madevi Shop | katalog terverifikasi → detail → simpan/tanya/tautan | sourceRef draft, partner/product freshness, external URL safety, larangan checkout semu |
| Tools & Equipment | input tervalidasi → proses lokal → hasil → simpan/unduh | registry published, quota/trial, output retention, emulator belum runtime-terverifikasi |

### 1.3 Lapis lintas web

| Lapis | Fakta/gap source | Hasil yang direncanakan |
|---|---|---|
| Navigasi | kontrak `navigation.ts` menjadi sumber ruang; source memiliki route legacy/alias | satu manifest route kanonis + alias, checker link internal dan halaman 404 nyata |
| Search | API search dan overlay ada | bukti permission-aware, filter ruang/kategori, pagination, zero-result, dan freshness |
| Akun | auth/profile/recovery/data-request API tersedia | matriks akses per route, state session expired, export/delete status, no account enumeration |
| Owner | banyak panel dan API sudah ada | dashboard berbasis antrean nyata, bukan statistik dekoratif; aksi sensitif perlu audit |
| Konten | artikel, taxonomy, package, feedback tersedia | pipeline dossier → review → publish → correction → supersede |
| UI/UX | beberapa lapisan CSS dan komponen UI sudah ada | baseline komponen, mobile/focus/reduced-motion, state contract, visual regression |
| Operasi | health/backup/restore/outbox/telemetry tersedia | drill non-production, recovery evidence, retry/idempotency, local Android performance |
| SEO | metadata/noindex tersebar per route | canonical/noindex/404/JSON-LD policy per jenis halaman; tidak mengindeks privat/draft |

---

## 2. Temuan gap yang dapat ditindaklanjuti

### G-01 — Route ada, pekerjaan utama belum selesai

**Bukti:** `src/app/jasa/undangan/order/page.tsx` masih menampilkan teks bahwa form akan
diimplementasikan. Inventaris menargetkan form data acara, template terbit, preview, validasi,
dan order yang dapat dilacak.

**Dampak:** pengguna dapat masuk ke route kanonis tetapi belum dapat menyelesaikan pekerjaan
utama. Ini lebih serius daripada masalah kosmetik karena mematahkan kontrak ruang Services.

**Batas usul:** form undangan saja; jangan mengubah API umum jasa, payment, atau database tanpa
kontrak dan migration terpisah. Reuse service/order yang sudah ada. Data rahasia tidak boleh
masuk URL selain token privat yang sudah memiliki jalur khusus.

### G-02 — Draft package masih memiliki referensi eksternal/pensiun

**Bukti:** `feature-package-panel.tsx` memuat tiga `sourceRef` draft menuju folder export yang
tidak ditemukan pada root source saat pencarian terarah. Komponen memang memberi label `DRAFT`,
tetapi manifest yang tidak dapat dibuka mengurangi auditability.

**Dampak:** Owner tidak dapat membedakan “draft belum tersedia” dari “manifest rusak”; risiko
promosi paket salah.

**Batas usul:** cocokkan hanya dengan manifest lokal yang benar-benar ada; jika tidak ada,
tampilkan `UNAVAILABLE/DRAFT` dan alasan. Jangan membuat path rekaan atau menghasilkan paket baru
sebagai bagian perbaikan ini.

### G-03 — 55 vs 57 route perlu rekonsiliasi kontrak

**Bukti:** inventaris menyatakan 55 pola route, sedangkan pencarian source menemukan 57 `page.tsx`.
Tambahan dapat berupa route baru yang sah, alias, atau route yang belum punya spesifikasi.

**Dampak:** route tanpa kontrak berisiko luput dari auth, metadata, breadcrumb, state, dan QA.

**Batas usul:** buat matriks otomatis/static route-to-inventory; jangan menghapus route atau
mengubah URL kanonis sebelum dampak alias dan backlink ditetapkan.

### G-04 — Stub/deferred state belum menjadi katalog kemampuan yang terukur

**Bukti:** grep source menemukan deferred/placeholder pada jasa, AI, taxonomy, operasi, artikel
media, dan tools trial. Sebagian adalah state jujur yang baik; sebagian adalah pekerjaan utama
yang belum selesai.

**Dampak:** pengguna sulit membedakan unavailable, locked, empty, draft, dan error.

**Batas usul:** definisikan enum state lintas domain (`LOADING`, `EMPTY`, `UNAVAILABLE`, `LOCKED`,
`ERROR`, `SUCCESS`, `DRAFT`, `PUBLISHED`) beserta copy dan tindakan pemulihan. Jangan mengubah
state unavailable menjadi tombol palsu.

### G-05 — Verifikasi pengalaman Android belum menjadi gerbang produk

**Bukti:** blueprint mengharuskan Android, keyboard, tiga tema, reduced motion, dan recovery;
namun audit terbaru masih statis untuk visual/runtime pada banyak item.

**Dampak:** CSS yang lulus parser dapat tetap rusak pada viewport nyata, fokus tertutup drawer,
atau interaksi lambat.

**Batas usul:** setelah Owner membuka guardrail, lakukan smoke matrix route utama pada perangkat
nyata/emulator yang disetujui; jangan menjadikan skor Lighthouse sebagai satu-satunya bukti.

### G-06 — Performance dan observability belum terhubung ke keputusan produk

**Bukti:** ada telemetry/health/operasi, tetapi blueprint belum menetapkan baseline per route,
budget interaksi, atau segmentasi Android. Web.dev merekomendasikan Core Web Vitals LCP, INP,
dan CLS; target umum “good” yang dirujuk sumber adalah LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 pada
persentil 75, tetapi Madevi belum memiliki baseline lokal.

**Dampak:** optimasi dapat mengejar angka yang tidak mewakili perangkat dan mode lokal.

**Batas usul:** ukur dulu baseline; baru tetapkan target Madevi per kelas route. Jangan menambah
telemetry yang mengirim data ke pihak eksternal atau merekam data privat.

### G-07 — SEO publik dan privasi perlu policy per tipe halaman

**Bukti:** beberapa route sudah memakai `noindex` (misalnya tracking/emulator), tetapi policy
canonical, JSON-LD, 404, dan draft/private belum diringkas sebagai matriks.

**Dampak:** konten privat/draft dapat terindeks, atau halaman publik kehilangan konteks mesin
pencari. Google merekomendasikan server-side redirect untuk perpindahan permanen dan JSON-LD yang
menggambarkan konten yang benar-benar terlihat.

**Batas usul:** artikel, produk, jasa terbit, undangan publik, taxonomy, akun, token tracking,
dan tools memiliki aturan berbeda; tidak menambahkan structured data untuk data yang belum nyata.

---

## 3. Struktur portofolio pengembangan

Ini adalah **hasil bidang** yang dapat menjadi kandidat backlog. Agent 5 tetap menentukan
promosi, lock, status, dan urutan. Tidak ada kandidat di bawah yang aktif hanya karena tertulis.

### P-01 — Keandalan alur Services: katalog → brief/order → tracking → hasil

**Tujuan pengguna:** pemesan dapat memilih layanan yang benar-benar tersedia, mengisi brief,
menerima status yang jujur, dan membuka hasil tanpa link mati.

**Cakupan:** `/jasa`, `/jasa/undangan/order`, `/jasa/order`, `/jasa/tracking`, komponen form jasa,
API katalog/order yang sudah ada, permission order, token privat, dan panel Owner Jasa.

**Bukan cakupan:** checkout online baru, provider pembayaran baru, perubahan harga tanpa Owner,
atau backend eksternal.

**Acceptance criteria usulan:**

1. Katalog hanya menampilkan item `PUBLISHED` dengan cakupan/status harga yang bersumber.
2. Form undangan memiliki validasi field, error per field, state submit, success, retry, dan
   private tracking link yang memakai route kanonis.
3. Brief custom/PCB/logo tetap membedakan `QUOTE_PENDING`, `QUOTED`, dan harga final.
4. Token tracking tidak menampilkan identitas berlebih dan link lama memiliki redirect kompatibel.
5. Owner melihat antrean/status order yang sama dengan data pelanggan; perubahan tercatat.
6. Test kontrak route/service dan audit parser lulus; runtime hanya diklaim setelah izin.

**Risiko:** data acara sensitif, token URL, order ganda, harga semu, dan perubahan status tanpa
audit. **Rollback:** UI/form dapat dicabut tanpa menghapus order; migration hanya jika kontrak
schema terbukti kurang.

### P-02 — Pipeline pengetahuan dan taxonomy yang dapat dipercaya

**Tujuan pengguna:** menemukan pengetahuan/panduan yang terbit, bersumber, dapat dikoreksi, dan
memiliki jalur kembali.

**Cakupan:** Explore, Tutorial, artikel, taxonomy, search projection, content package, feedback,
Owner artikel/taxonomy, freshness, claim/safety metadata.

**Acceptance criteria usulan:**

1. Setiap hasil publik memiliki canonical key, status publikasi, tanggal tinjau, sumber, dan
   pemilik review yang terlihat sesuai sensitivitas.
2. Draft/fixture/unavailable tidak muncul sebagai publikasi atau katalog aktif.
3. Alias route dipetakan ke canonical; path invalid menghasilkan 404 nyata, bukan soft 200.
4. Search menyaring berdasarkan izin dan status; zero-result memberi jalur pemulihan.
5. Tutorial memiliki `GENERAL/CONTROLLED/STOP`, prasyarat, hasil cek, dan eskalasi.
6. Owner dapat menerima koreksi, menerbitkan revisi, supersede, dan mempertahankan jejak keputusan.

**Risiko:** klaim tak bersumber, konten usang, safety overclaim, perubahan taxonomy merusak URL.
**Rollback:** stage/preview/abort package; jangan menimpa taxonomy aktif langsung.

### P-03 — Madevi School: jalur belajar dan assessment yang selesai end-to-end

**Tujuan pengguna:** peserta mengetahui materi berikutnya, dapat melanjutkan progres, dan
menyelesaikan assessment dengan aturan versi yang konsisten.

**Cakupan:** `/belajar`, `/belajar/[pathId]`, `/ujian`, `/ujian/[attemptId]`, learning paths,
question banks, attempts, certificates, entitlement, Owner review/grade.

**Acceptance criteria usulan:**

1. Jalur hanya menampilkan materi dan akses yang server izinkan.
2. Progres idempoten, dapat di-resume, dan tidak hilang ketika sesi terputus.
3. Attempt memakai versi assessment immutable; submit ganda aman dan grade dapat diaudit.
4. State locked/forbidden/capacity/expired/error memiliki tindakan yang benar.
5. Sertifikat hanya muncul bila aturan penerbitan benar-benar terpenuhi.

**Risiko:** data pendidikan pribadi, fairness penilaian, kebocoran bank soal. **Rollback:**
nonaktifkan versi baru tanpa mengubah attempt lama.

### P-04 — Madevi Line: komunikasi, moderasi, dan privasi yang dapat dipulihkan

**Tujuan pengguna:** berkomunikasi tanpa kehilangan kendali atas pesan, blokir, laporan, dan
banding.

**Cakupan:** sosial/feed, grup, pesan, profil publik, moderasi, uploads, notifications, quota,
retention, Owner moderation.

**Acceptance criteria usulan:**

1. Read/write selalu memeriksa ownership, block/mute, membership, dan status moderasi di server.
2. Pengiriman idempoten atau memiliki recovery dari duplicate/failed state.
3. Upload memiliki ukuran/tipe/retensi dan tidak membocorkan URL privat.
4. Laporan, keputusan, banding, dan alasan memiliki audit trail.
5. Pengguna melihat status nyata: pending, rejected, removed, appealed, resolved.

**Risiko:** abuse, data privat, konten berbahaya, biaya storage. **Rollback:** quarantine dan
retention run harus reversibel bila aman; hapus permanen memerlukan izin eksplisit.

### P-05 — Tools Registry: alat lokal yang jelas batas, biaya, dan outputnya

**Tujuan pengguna:** memilih alat aktif dan memahami input, batas, hasil, retensi, dan recovery.

**Cakupan:** `/alat-bantu`, emulator, rumus, PDF, career tools, tools registry, trial reserve/
commit/release, utility workspace, AI local adapter bila tersedia.

**Acceptance criteria usulan:**

1. Registry hanya menampilkan tool yang benar-benar executable pada mode lokal.
2. Setiap tool memiliki schema input/output, batas ukuran, quota/entitlement, dan state recovery.
3. Output privat mempunyai owner, retensi, delete, dan tidak masuk URL/log.
4. Emulator menyelesaikan M-01 setelah test runner diizinkan; fitur lain tidak diklaim aktif.
5. PDF/AI menyatakan dependency unavailable secara jujur dan tidak menyediakan kontrol palsu.

**Risiko:** file upload, biaya CPU/memori Android, hasil AI tanpa sumber, trial abuse.

### P-06 — Design system dan performance Android yang terukur

**Tujuan pengguna:** tujuh ruang terasa satu produk, mudah disentuh/dibaca, dan tidak meloncat
atau macet pada Android.

**Cakupan:** token, komponen UI, public/owner shell, header/sidebar/search/dialog, state pattern,
three themes, reduced motion, performance telemetry lokal.

**Acceptance criteria usulan:**

1. Komponen form/button/card/dialog/input/dropdown memiliki API visual dan state konsisten.
2. Fokus keyboard tidak tertutup overlay/drawer; target utama sekurang-kurangnya 44px sebagai
   target produk, sambil memenuhi WCAG 2.2 minimum 24px bila pengecualian tidak berlaku.
3. Reduced motion menghapus perpindahan layout dan tidak menyembunyikan informasi.
4. Baseline LCP/INP/CLS diukur pada route prioritas dan perangkat target; target tidak dikarang.
5. Tidak ada overflow horizontal pada breakpoint yang disepakati; visual audit mencakup light,
   dark, Madevi On, keyboard, touch, dan screen reader smoke.

**Risiko:** cascade regression, bundle besar, ambient animation, aksesibilitas palsu karena hanya
parser pass. **Rollback:** token/component layer dapat dikembalikan tanpa mengubah API/data.

### P-07 — Owner Operations, security, backup, dan release evidence

**Tujuan pengguna/Owner:** perubahan publik dan tindakan sensitif dapat dipantau, dibatalkan,
dipulihkan, serta dibuktikan.

**Cakupan:** owner console, approvals, operations, health, outbox, telemetry, security,
backup/restore, release checks, audit events, local Android runbook.

**Acceptance criteria usulan:**

1. Setiap aksi sensitif memiliki permission server, confirmation, idempotency, audit actor/time,
   dan error recovery.
2. Backup manifest, restore inspection, dan rollback diuji di target non-production setelah izin.
3. Health membedakan dependency down, stale, empty, dan healthy; bukan angka fixture.
4. Release checklist menyatukan route/source/schema/test/backup evidence dan open risks.
5. Tidak ada secret atau data privat dalam telemetry, source, fixture, atau control documents.

---

## 4. Rekomendasi urutan keputusan, bukan urutan implementasi wajib

1. **Rekonsiliasi kontrol:** route 57 vs inventaris 55, active locks, legacy aliases, dan
   sourceRef. Ini mengurangi risiko perencanaan salah.
2. **Tutup jalur Services yang paling jelas patah:** form undangan dan tracking/order states.
3. **Tetapkan content/taxonomy publishing gate:** tanpa isi sah, UI cantik tidak memberi nilai.
4. **Pilih satu vertical slice School atau Line:** buktikan alur penuh daripada menambah dashboard.
5. **Stabilkan Tools Registry:** publish/unavailable/quota/output sebelum menambah tool baru.
6. **Lakukan design/performance pass berdasarkan baseline:** bukan menambah gradient/animasi.
7. **Tutup operations/recovery evidence:** baru pertimbangkan promosi ke tahap online.

Dependency lintas portofolio:

```text
route/source-of-truth
        ↓
publishing + permission contracts
        ↓
vertical slices (Services / Content / School / Line / Tools)
        ↓
design + performance evidence
        ↓
operations + recovery + release gate
        ↓
online architecture decision (Owner only)
```

Tidak semua bidang harus menunggu bidang sebelumnya bila lock dan data tidak bertabrakan. Namun
perubahan schema, auth, permission, data pribadi, harga, dan destructive operation tetap melewati
gerbang Owner/Agent 5.

---

## 5. Matriks verifikasi dan Definition of Done

| Lapisan | Bukti minimum | Status saat blueprint dibuat |
|---|---|---|
| Source contract | route/API/service/component cocok dengan blueprint | sebagian dipetakan; perlu checker route-to-inventory |
| Static | parser TS/TSX/SQL, schema/policy inspection, link/metadata scan | sebagian tersedia; bukan bukti runtime |
| Unit/contract | solver, validation, permission, idempotency, state transitions | ada test suite; tiap item menentukan subset |
| Integration | Next route + local DB + auth/CSRF + ownership | belum boleh diklaim tanpa guardrail/izin |
| Browser/mobile | route utama, touch, keyboard, themes, reduced motion, error recovery | belum diverifikasi menyeluruh |
| Content | source dossier, license, freshness, owner, review decision | belum merata; draft tidak boleh dipromosikan |
| Operations | backup/restore, outbox, health, audit, release cleanliness | desain tersedia; drill menunggu izin bila diwajibkan |

Sebuah hasil hanya boleh ditandai selesai jika pengguna dapat menyelesaikan pekerjaan utamanya,
memahami keadaan gagal, memulihkan atau melanjutkan, dan Owner memiliki bukti pengelolaan. “Route
rendered”, “test source ada”, atau “CSS parse” bukan Definition of Done.

---

## 6. Riset eksternal yang dipakai

Riset berikut dipakai sebagai rujukan prinsip, bukan instruksi untuk memasang layanan eksternal:

1. **W3C, WCAG 2.2**, https://www.w3.org/TR/WCAG22/ — fokus terlihat/tidak tertutup,
   dragging alternatives, target size, accessible authentication, dan error/help.
2. **W3C WAI, Understanding 2.5.8 Target Size (Minimum)**,
   https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum — minimum 24×24 CSS px
   dengan pengecualian; Madevi boleh menetapkan target produk 44px untuk kontrol utama.
3. **Google Search Central, JavaScript SEO Basics**,
   https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics —
   hindari soft 404 dan gunakan status server yang bermakna.
4. **Google Search Central, Redirects**,
   https://developers.google.com/search/docs/crawling-indexing/301-redirects — gunakan
   server-side 301/308 bila perpindahan URL memang permanen.
5. **Google Search Central, Structured Data Guidelines**,
   https://developers.google.com/search/docs/appearance/structured-data/sd-policies — data
   harus menggambarkan konten terlihat, lengkap, aktual, dan tidak dipasang pada private/noindex.
6. **web.dev, Defining Core Web Vitals thresholds**,
   https://web.dev/articles/defining-core-web-vitals-thresholds — referensi awal LCP 2.5s,
   INP 200ms, CLS 0.1 pada p75; baseline Madevi belum ditetapkan.
7. **web.dev, Vitals measurement**, https://web.dev/articles/vitals-measurement-getting-started —
   field/RUM berbeda dari lab; gunakan data perangkat target sebelum mengambil keputusan.

Tanggal riset: 2026-09-28. Klaim teknis perlu diverifikasi lagi saat item aktif dibuat dan versi
standar berubah.

---

## 7. Pertanyaan Owner sebelum promosi backlog

1. Apakah `/jasa/undangan/order` diprioritaskan sebagai vertical slice pertama, atau hanya
   dipertahankan sebagai halaman unavailable sampai katalog/template disahkan?
2. Data apa yang boleh dipublikasikan untuk katalog jasa/shop: harga fixed, quote, partner,
   atau hanya request form?
3. Apakah verifikasi test/runtime/database sekarang boleh dibuka untuk `EMULATOR-001`, atau
   tetap static-only?
4. Device Android minimum dan browser target apa yang menjadi baseline resmi?
5. Apakah konten publik awal diprioritaskan Explore, Tutorial, atau School; siapa owner review
   dan jadwal freshness-nya?
6. Apakah operasi backup/restore non-production sudah boleh dijalankan, atau hanya inspection?
7. Apakah tahap online belum berubah: tetap tidak ada Laravel/Spring/external runtime sampai ada
   keputusan arsitektur tertulis?

---

## 8. Handoff Agent 1

- Tidak ada source aplikasi yang diubah.
- Tidak ada status, lock, guardrail, atau QA item aktif yang diubah oleh dokumen ini.
- Kandidat konkret yang sudah ada di backlog tetap dipakai; jangan membuat duplikat.
- Agent 5 menilai P-01—P-07 berdasarkan kapasitas lock, dependency, bukti, dan keputusan Owner.
- Temuan route/stub/sourceRef adalah kandidat pengembangan, bukan izin Agent 1 untuk mengimplementasikan.
