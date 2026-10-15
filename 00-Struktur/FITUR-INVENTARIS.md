# INVENTARIS FITUR MADEVI — Anti-Hilang saat Rombak Desain v15

> Dokumen ini WAJIB dibaca sebelum mengubah kode desain apa pun.
> Setiap item harus terverifikasi tetap ada dan berfungsi setelah rombak.
> Dibuat: 15 Oktober 2026. Status: LENGKAP (desain v15 dinyatakan FIX oleh Ade, 15 Okt 2026 ~04:54 WIB).
> Kontrak visual: `~/workspace/your_files/desain-revisi/simulasi-madevi-v15.html`.

## Aturan verifikasi
1. Satu komponen selesai dirombak, cocokkan dengan inventaris ini.
2. Item boleh pindah tampilan, TIDAK boleh hilang fungsi.
3. `tsc --noEmit` EXIT 0 + test suite lulus + build sukses = syarat mutlak.
4. Jika item tidak bisa dipertahankan, catat alasannya di Bagian 8 dan minta keputusan Ade.
5. Source kanonis hanya `~/workspace/madevi-audit/staging/Madevi_Off/`.

## 1. Skala project (hasil hitung nyata, 15 Okt 2026)
- 57 halaman (`src/app/**/page.tsx`) — terverifikasi via `find`
- 234 API route (`src/app/api/**/route.ts`) — terverifikasi via `find`
- 7 ruang (kontrak `src/contracts/navigation.ts`):
  `/ruang/jelajahi-pengetahuan`, `/ruang/tutorial-problem-solve`,
  `/ruang/pendidikan-sekolah`, `/sosial`, `/jasa`, `/belanja`, `/alat-bantu`
- ~130 tabel di skema `madevi` (98 file migrasi up)

## 2. Daftar halaman (57) + checklist fitur

Format per halaman: route — komponen utama — state/fungsi kunci — API/DB — checklist.

### 2A. Publik / Beranda (6)
- [ ] `/` — `HomeContent` (artikel + spaces dari server), `LanjutkanMembaca`.
  Fungsi: hero welcome, 7 kartu ruang, lanjutkan membaca dari riwayat.
  DB: `articles`, `search_index_entries`.
- [ ] `/tentang` — `InformationPage`. Fungsi: Tentang dan FAQ.
- [ ] `/ketentuan` — `InformationPage`. Fungsi: Ketentuan dan Layanan.
- [ ] `/privasi` — `InformationPage`. Fungsi: Kebijakan Privasi.
- [ ] `/review` — `InformationPage`. Fungsi: Fitur Review.
- [ ] `/laporkan-masalah` — `InformationPage` + form. Fungsi: lapor masalah/bug
  (ditaut dari sidebar). API: `POST /v1/public-feedback`.

### 2B. Madevi Shop — affiliate (3)
- [ ] `/belanja` — `ShopPage`. Fungsi: katalog produk affiliate, sort
  (NEWEST / PRICE_ASC / PRICE_DESC), filter kategori (facets), search,
  paginasi PAGE_SIZE 20, seksi bundel kirim (`ShippingBundleSection`),
  duel produk (`DuelCompare`), petisi katalog (`PetisiKatalog`).
  API: `GET /v1/ebelanja/products`. DB: `ebelanja_products`.
  WAJIB: beli terjadi di marketplace (link afiliasi), disclosure afiliasi,
  `rel="sponsored"`, foto/deskripsi sama dengan listing marketplace.
- [ ] `/belanja/[id]` — `ProductDetail`. Fungsi: detail produk, tanya produk
  (antrean QnA), simpan/wishlist, track klik afiliasi.
  API: `GET products/[id]`, `POST products/[id]/track-click`,
  `POST /v1/ebelanja/questions`, `GET/POST/DELETE /v1/ebelanja/saved`.
- [ ] `/belanja/[id]/simulasi` — redirect 307 ke `/belanja/[id]`
  (legacy purchase path, jangan jadikan halaman).

### 2C. Tools and Equipment — gratis (3)
- [ ] `/alat-bantu` — `UtilitiesPage`. Fungsi: daftar tools gratis
  (konverter, kalkulator, rumus). API: `POST /v1/tools/[toolId]/execute`,
  trial reserve/commit/release.
- [ ] `/alat-bantu/emulator` — `CircuitEmulator`. Fungsi: emulator sirkuit DC
  (solver MNA via Web Worker), workspace tersimpan per akun.
  API: `POST /v1/tools/circuit-emulator/session`,
  `GET/POST /v1/utilities/workspace`. DB: `utilities_workspaces`.
- [ ] `/software` — `SoftwarePageClient`. Fungsi: katalog software publik,
  detail, review/rating, usulan software, unduh versi.
  API: `GET /v1/software`, `GET /v1/software/[slug]`,
  `POST /v1/software/[slug]/review`, `POST /v1/software/propose`.
  DB: `software_catalog`, `software_versions`, `software_reviews`.

### 2D. Madevi Services — jasa digital berbayar (5)
- [ ] `/jasa` — `JasaPage`. Fungsi: katalog jasa (tier HEMAT Rp10rb-50rb,
  PRO Rp50rb-150rb), order custom, order logo, order PCB.
  API: `GET /v1/jasa/catalog`, `/v1/jasa/custom`, `/v1/jasa/logo`,
  `/v1/jasa/pcb`, `/v1/jasa/templates`.
- [ ] `/jasa/order` — `PrivateServiceOrderViewer`. Fungsi: status order
  custom/PCB via token privat (tanpa login).
  API: `GET /v1/jasa/order/[token]`.
- [ ] `/jasa/tracking` — `PrivateOrderViewer`. Fungsi: lacak order milik
  sendiri (login). API: `GET /v1/jasa/my-orders`, `/v1/jasa/my-orders/[id]`,
  `GET /v1/jasa/my-orders/[id]/invoice`, `POST .../review` (idempoten).
- [ ] `/jasa/undangan/order` — `StandaloneInvitationOrder`. Fungsi: form order
  undangan digital (data pasangan, tanggal, lokasi, foto).
  API: `POST /v1/jasa/undangan/order`.
- [ ] `/undangan/[slug]` — `InvitationOnline`. Fungsi: undangan online publik
  via slug kanonis. API: `GET /v1/jasa/undangan/order/[token]`.
  WAJIB: akses privat via secret token, bukan tebakan slug.

### 2E. Tutorial, Explore, School — konten (8)
- [ ] `/ruang/[slug]` — `RuangNavigator` (`ExploreFoundation`,
  `TutorialProblemFoundation`). Fungsi: 3 ruang konten
  (jelajahi-pengetahuan, tutorial-problem-solve, pendidikan-sekolah),
  navigasi taksonomi. API: `GET /v1/taxonomy`.
- [ ] `/ruang/[slug]/[...path]` — `R1Navigator`. Fungsi: navigasi node
  taksonomi dalam ruang (daftar isi, bab, materi).
- [ ] `/artikel/[id]` — `ArticlePageClient` / `StarterArticlePage`.
  Fungsi: baca artikel (blok tersanitasi), sumber, ajukan koreksi,
  daftar isi (`DaftarIsi`), mode fokus baca (`FokusBaca`).
  API: `GET/PATCH /v1/articles/[id]`, `POST [id]/corrections`,
  `POST/GET [id]/sources`. DB: `articles`, `article_blocks`,
  `article_corrections`, `article_sources`.
- [ ] `/belajar` — `LearningPathsIndex` (bungkus `PrivateRoute`).
  Fungsi: katalog jalur belajar School penuh.
  API: `GET /v1/learning-paths`. DB: `learning_paths`.
- [ ] `/belajar/[pathId]` — `LearningDashboard`. Fungsi: progres belajar,
  tandai artikel dibaca, restart jalur.
  API: `GET /v1/learning-paths/[id]/progress`,
  `POST .../articles/[articleId]/read`, `POST .../restart`.
  DB: `learning_progress`, `learning_path_articles`.
- [ ] `/ujian` — `ExamsDashboard` (bungkus `PrivateRoute`).
  Fungsi: daftar ujian tersedia. API: `POST /v1/exams/attempts`.
- [ ] `/ujian/[attemptId]` — `ExamAttempt`. Fungsi: kerjakan soal (MC + esai),
  simpan jawaban, submit, review hasil.
  API: `PATCH .../answers`, `POST .../submit`, `GET .../review`.
  DB: `exam_attempts`, `attempt_mc_answers`, `attempt_essay_answers`.
- [ ] `/brosur-sekolah` — `SchoolBrochure`. Fungsi: brosur publik sekolah.

### 2F. Madevi Line — sosial (5)
- [ ] `/sosial` — `SocialDashboard` (bungkus `PrivateRoute`,
  tamu melihat `LineGuestView`). Fungsi: Sosial Karya (posting karya,
  klinik ide, sidang, utas cerita, giliran dengar, peta kebaikan),
  Sosial Curhat, proteksi: filter blocked-words 130+ entri,
  tombol Laporkan + 6 kategori, antrean moderasi admin,
  `CrisisHelpCard` (hanya saat indikasi krisis), mode anonim
  (`is_anonymous`), rate limit posting/komentar.
  API: `GET/POST /v1/social/posts`, `.../comments`, `.../reaction`,
  `POST /v1/social/reports`, `GET /v1/social/notifications`,
  `GET/POST /v1/line/karya`, `/v1/line/clinic`, `/v1/line/sidang`,
  `/v1/line/stories`, `/v1/line/listen`, `/v1/line/kindness`.
  DB: `social_posts`, `social_comments`, `social_reports`,
  `moderation_cases`, `notification_outbox`.
- [ ] `/pesan` — `MessagesPage`. Fungsi: daftar percakapan DM,
  kirim pesan (idempotencyKey), message requests, cari orang,
  daftar teman, blokir, bisu (mute), laporkan pesan, arsip/keluar.
  API: `/v1/social/conversations`, `/v1/social/message-requests`,
  `/v1/social/people`, `/v1/social/friends`, `/v1/social/blocks/*`,
  `/v1/social/mutes`. DB: `direct_conversations`, `direct_messages`,
  `message_requests`, `social_blocks`, `social_mutes`.
- [ ] `/grup` — `GroupsPage`. Fungsi: daftar grup/komunitas publik,
  gabung/keluar, daftar anggota, banding grup.
  API: `GET/POST /v1/groups`, `POST /v1/groups/[id]/join`,
  `POST /v1/groups/[id]/leave`, `POST /v1/groups/[id]/appeals`.
  DB: `public_groups`, `group_memberships`, `group_appeals`.
- [ ] `/profil/[username]` — `PublicProfile`. Fungsi: profil publik user lain
  (viewer-aware). API: `GET /v1/profiles/[username]`.
- [ ] `/profile` — `ProfileShell`. Fungsi: profil sendiri, edit preferensi
  (termasuk Zona Tenang `calmMode`), riwayat, simpan.
  API: `GET/PATCH /v1/profile`.

### 2G. Auth dan akun (7)
- [ ] `/auth` — `AuthCard`. Fungsi: login, register, 2FA email, verifikasi
  kontak (OTP simulasi), persetujuan trial. WAJIB: rate limit login 2 lapis
  (per-akun hash + per-IP), jangan percaya X-Forwarded-For mentah.
  API: `POST /v1/auth/login`, `/register`, `/logout`, `/refresh`,
  `/v1/auth/2fa/email`, `/v1/auth/mfa/verify`,
  `/v1/auth/verify-contact`, `/v1/auth/trial-consent`.
- [ ] `/recovery` — `RecoveryForm`. Fungsi: pemulihan akun.
  API: `POST /v1/recovery`.
- [ ] `/riwayat` — `ActivityHistoryDashboard` (`PrivateRoute`).
  Fungsi: riwayat aktivitas pengguna. DB: `user_activity_logs`.
- [ ] `/simpan` — `SavedItemsDashboard` (`PrivateRoute`).
  Fungsi: item tersimpan (artikel, produk, postingan).
- [ ] `/kontribusi` — `ContributionPage` (`PrivateRoute`).
  Fungsi: kirim kontribusi konten. API: `GET/POST /v1/kontribusi`.
  DB: `user_contributions`.
- [ ] `/moderasi/banding` — `ModerationAppealForm`. Fungsi: ajukan banding
  atas keputusan moderasi. API: `GET/POST /v1/moderation/appeals`.
- [ ] `/ai-asisten` — halaman AI asisten lokal. Fungsi: chat bantuan seputar
  isi web (riwayat percakapan, kuota).
  API: `GET /v1/ai/availability`, `GET/POST /v1/ai/conversations`,
  `GET/DELETE /v1/ai/conversations/[id]`, `GET /v1/ai/quota`.
  DB: `ai_conversations`, `ai_messages`, `ai_quota_days`.

### 2H. Owner / Admin console (20)
- [ ] `/admin` — redirect ke `/owner` (fallback bila redirect
  next.config.ts tertinggal; JANGAN tambah UI di sini).
- [ ] `/owner` — `OwnerConsole`. Fungsi: dashboard admin.
- [ ] `/owner/login` — `OwnerLoginForm`. Fungsi: login admin terpisah
  (rate limit + device challenge). API: `POST /v1/owner/login`,
  `/v1/owner/logout`, `/v1/owner/challenge`,
  `/v1/owner/bootstrap/verify-device`.
- [ ] `/owner/artikel/baru` — `ArticleEditor`. Fungsi: tulis/edit artikel,
  blok tersanitasi, sumber, status lifecycle.
  API: `POST /v1/articles`, `POST /v1/articles/[id]/blocks`,
  `POST/PUT /v1/articles/[id]/status`.
- [ ] `/owner/ujian` + `/owner/ujian/bank-soal` — panel ujian dan
  `QuestionBankEditor` (bank soal MC + esai).
  API: `/v1/owner/question-banks`, `.../[id]/review`,
  `/v1/owner/exams/queue`, `/v1/owner/exams/capacity`,
  `POST .../attempts/[id]/grade`, `POST .../attempts/[id]/claim`.
- [ ] `/owner/jasa` — `OwnerJasaPanel`. Fungsi: antrean order jasa,
  transisi status, revoke, limit, kelola katalog dan template.
  API: `/v1/admin/jasa/orders`, `/v1/owner/jasa/queue`,
  `/v1/owner/jasa/templates`.
- [ ] `/owner/order` — `OwnerDataPanel` (order). Fungsi: daftar semua order.
- [ ] `/owner/produk` — `OwnerShopControl`. Fungsi: kelola produk affiliate,
  jawab pertanyaan produk. API: `POST /v1/owner/shop/products`,
  `GET /v1/owner/shop/questions`,
  `POST /v1/owner/shop/questions/[id]/answer`.
- [ ] `/owner/moderasi` — `OwnerModerationPanel`. Fungsi: antrean kasus
  moderasi, bukti, keputusan, banding, reset window, engine.
  API: `/v1/owner/moderation/cases`, `.../appeals`,
  `POST .../cases/[id]/decision`, `POST .../appeals/[id]/decision`.
- [ ] `/owner/sosial` — panel sosial admin (posting, bukti, retensi).
  API: `POST /v1/owner/social/evidence/[id]`,
  `POST /v1/owner/social/retention/run`.
- [ ] `/owner/grup` — `OwnerDataPanel` (grup). Fungsi: kelola grup,
  keputusan, manager, banding.
  API: `/v1/owner/groups`, `POST /v1/owner/groups/[id]/decision`,
  `PATCH /v1/owner/groups/[id]/manager`,
  `POST /v1/owner/groups/appeals/[id]`.
- [ ] `/owner/taxonomy` — `OwnerTaxonomyPanel`. Fungsi: kelola node
  taksonomi, riwayat, export, paket menu, analisis dampak.
  API: `/v1/owner/taxonomy`, `/v1/owner/taxonomy/nodes`,
  `PATCH /v1/owner/taxonomy/nodes/[id]`,
  `GET /v1/owner/taxonomy/nodes/[id]/impact`,
  `GET /v1/owner/taxonomy/history`, `GET /v1/owner/taxonomy/export`,
  `POST /v1/owner/taxonomy/packages/[action]`.
- [ ] `/owner/jalur` — `LearningPathEditor`. Fungsi: susun jalur belajar,
  publish. API: `/v1/owner/learning-paths`,
  `POST /v1/owner/learning-paths/[id]/publish`.
- [ ] `/owner/halaman-situs` — `SitePageEditor`. Fungsi: kelola halaman
  statis (tentang/ketentuan/privasi/review).
  API: `GET/POST /v1/owner/site-pages`.
- [ ] `/owner/inbox` — `OwnerDataPanel` (inbox). Fungsi: kotak masuk admin.
  API: `GET/POST /v1/owner/inbox`.
- [ ] `/owner/pengguna` — `OwnerDataPanel` (pengguna). Fungsi: kelola user,
  data requests. API: `POST /v1/owner/data-requests/[id]`.
- [ ] `/owner/keamanan` — `OwnerDataPanel` (keamanan). Fungsi: inspeksi
  ancaman, karantina, log. API: `POST /v1/security/inspect`,
  `POST /v1/security/quarantine`, `POST/GET /v1/security/threats`.
- [ ] `/owner/operasi` — `OwnerDataPanel` (operasi). Fungsi: kesehatan
  sistem, backup/restore, antrean prioritas, operasi massal
  (preview read-only + execute idempoten).
  API: `GET /v1/owner/operasi`, `POST /v1/operasi/backup`,
  `GET/POST /v1/owner/operasi/backup/[backupId]`,
  `POST /v1/admin/operations/preview`,
  `POST /v1/admin/operations/execute`.
- [ ] `/owner/feature-packages` — `FeaturePackagePanel`. Fungsi: paket
  fitur/konten. API: `GET /v1/owner/content-packages`.

## 3. Daftar API (234) per domain

Format: `METHOD` `route` — fungsi singkat.

### 3.1 health (1)
- [ ] `GET` `/health` — cek hidup server.

### 3.2 auth (8) — proteksi: rate limit 2 lapis, IP via helper terpusat
- [ ] `POST` `/v1/auth/login` — login (rate limit per-akun hash + per-IP).
- [ ] `POST` `/v1/auth/register` — daftar (rate limit anti spam).
- [ ] `POST` `/v1/auth/logout` — keluar, cabut sesi.
- [ ] `POST` `/v1/auth/refresh` — perbarui token sesi.
- [ ] `POST` `/v1/auth/2fa/email` — kirim kode 2FA (simulasi).
- [ ] `POST` `/v1/auth/mfa/verify` — verifikasi MFA.
- [ ] `POST` `/v1/auth/verify-contact` — verifikasi kontak OTP (rate limit,
  validasi UUID; simulasi, jangan kirim SMS/OTP nyata).
- [ ] `POST` `/v1/auth/trial-consent` — persetujuan masa trial.

### 3.3 account (5)
- [ ] `POST` `/v1/account/appeal` — banding akun.
- [ ] `POST` `/v1/account/contact` — ubah kontak.
- [ ] `POST` `/v1/account/data-request` — minta data pribadi.
- [ ] `GET` `/v1/account/export/[id]` — unduh ekspor data.
- [ ] `POST` `/v1/account/password` — ganti kata sandi.

### 3.4 ai (4)
- [ ] `GET` `/v1/ai/availability` — ketersediaan AI (guest/member).
- [ ] `GET,POST` `/v1/ai/conversations` — daftar/buat percakapan.
- [ ] `GET,DELETE` `/v1/ai/conversations/[id]` — baca/hapus percakapan.
- [ ] `GET` `/v1/ai/quota` — sisa kuota AI.

### 3.5 articles (6)
- [ ] `POST,GET` `/v1/articles` — buat draf (admin) / daftar.
- [ ] `GET,PATCH` `/v1/articles/[id]` — baca artikel (policy cek) / edit.
- [ ] `POST` `/v1/articles/[id]/blocks` — simpan blok tersanitasi (admin).
- [ ] `POST` `/v1/articles/[id]/corrections` — ajukan koreksi (login).
- [ ] `POST,GET` `/v1/articles/[id]/sources` — tambah/daftar sumber (admin).
- [ ] `POST,PUT` `/v1/articles/[id]/status` — ubah lifecycle status (admin).

### 3.6 certificates (2)
- [ ] `POST` `/v1/certificates` — terbitkan sertifikat.
- [ ] `GET,PATCH` `/v1/certificates/[number]` — verifikasi per nomor.

### 3.7 ebelanja / shop (19)
- [ ] `GET` `/v1/ebelanja/products` — katalog (sort, filter, cursor).
- [ ] `GET` `/v1/ebelanja/products/[id]` — detail (+ info partner/domain).
- [ ] `POST` `/v1/ebelanja/products/[id]/track-click` — catat klik afiliasi.
- [ ] `POST` `/v1/ebelanja/products/[id]/buy` — LEGACY non-fungsi; jangan
  jadikan checkout (pembelian di marketplace).
- [ ] `GET` `/v1/ebelanja/products/[id]/questions` — QnA produk.
- [ ] `POST` `/v1/ebelanja/questions` — tanya produk (login, antrean).
- [ ] `GET,POST,DELETE` `/v1/ebelanja/saved` — wishlist produk (login).
- [ ] `GET,POST` `/v1/ebelanja/bundles` — daftar/buat bundel kirim (publik).
- [ ] `POST` `/v1/ebelanja/bundles/[id]/join` — gabung bundel terbuka (member).
- [ ] `DELETE` `/v1/ebelanja/bundles/[id]/leave` — keluar sebelum PENUH.
- [ ] `GET,POST` `/v1/ebelanja/duels` — daftar/buat duel produk (publik).
- [ ] `GET` `/v1/ebelanja/duels/[id]` — detail duel + kartu pro/kontra.
- [ ] `POST` `/v1/ebelanja/duels/[id]/vote` — vote produk pilihan + alasan.
- [ ] `POST` `/v1/ebelanja/duels/[id]/points` — tambah kartu pro/kontra.
- [ ] `GET,POST` `/v1/ebelanja/petitions` — daftar/buat usulan produk.
- [ ] `POST` `/v1/ebelanja/petitions/[id]/vote` — dukung usulan produk.
- [ ] `POST` `/v1/ebelanja/petitions/[id]/outcome` — tutup usulan (owner).
- [ ] `POST` `/v1/ebelanja/partners/request` — form kerja sama mitra.
- [ ] `GET` `/v1/ebelanja/images/[name]` — gambar produk.

### 3.8 exams (5)
- [ ] `POST` `/v1/exams/attempts` — mulai attempt ujian.
- [ ] `GET` `/v1/exams/attempts/[id]` — status attempt.
- [ ] `PATCH` `/v1/exams/attempts/[id]/answers` — simpan jawaban.
- [ ] `POST` `/v1/exams/attempts/[id]/submit` — kumpulkan jawaban.
- [ ] `POST` `/v1/exams/attempts/[id]/review` — minta review/nilai.

### 3.9 foundation (2)
- [ ] `GET,POST` `/v1/foundation/records` — catat fondasi (explore).
- [ ] `GET` `/v1/foundation/records/[id]` — baca catatan fondasi.

### 3.10 groups (7)
- [ ] `GET,POST` `/v1/groups` — daftar/buat grup.
- [ ] `GET` `/v1/groups/[id]` — detail + status membership viewer.
- [ ] `POST` `/v1/groups/[id]/join` — gabung grup.
- [ ] `POST` `/v1/groups/[id]/leave` — keluar grup.
- [ ] `GET` `/v1/groups/[id]/members` — daftar anggota.
- [ ] `POST` `/v1/groups/[id]/members/[principalId]` — kelola anggota.
- [ ] `POST` `/v1/groups/[id]/appeals` — banding grup.

### 3.11 jasa / services (14)
- [ ] `GET` `/v1/jasa/catalog` — katalog jasa terbit (publik).
- [ ] `GET,POST` `/v1/jasa/custom` — order custom milik sendiri.
- [ ] `GET,POST` `/v1/jasa/logo` — order logo / galeri karya.
- [ ] `GET,POST` `/v1/jasa/pcb` — order PCB milik sendiri.
- [ ] `GET` `/v1/jasa/templates` — daftar template; `GET /v1/jasa/templates/[slug]`.
- [ ] `GET` `/v1/jasa/my-orders` — order milik sendiri.
- [ ] `GET` `/v1/jasa/my-orders/[id]` — detail order.
- [ ] `GET` `/v1/jasa/my-orders/[id]/invoice` — invoice order.
- [ ] `POST` `/v1/jasa/my-orders/[id]/review` — ulasan order (idempoten).
- [ ] `GET` `/v1/jasa/order/[token]` — status via token privat.
- [ ] `GET` `/v1/jasa/undangan` — galeri template undangan.
- [ ] `POST` `/v1/jasa/undangan/order` — buat order undangan.
- [ ] `GET,PATCH` `/v1/jasa/undangan/order/[token]` — akses privat via token.

### 3.12 kontribusi (1)
- [ ] `GET,POST` `/v1/kontribusi` — daftar/kirim kontribusi konten.

### 3.13 learning-paths (4)
- [ ] `GET` `/v1/learning-paths` — katalog jalur belajar penuh.
- [ ] `GET` `/v1/learning-paths/[id]/progress` — progres belajar.
- [ ] `POST` `/v1/learning-paths/[id]/articles/[articleId]/read` — tandai dibaca.
- [ ] `POST` `/v1/learning-paths/[id]/restart` — ulangi jalur.

### 3.14 line (23) — Sosial Karya dan Curhat
- [ ] `GET,POST` `/v1/line/karya` — daftar/buat karya (filter badge).
- [ ] `GET` `/v1/line/karya/[id]/lineage` — pohon silsilah karya ke bawah.
- [ ] `DELETE` `/v1/line/karya/[id]/parent` — hapus parent (karya mandiri).
- [ ] `GET,POST` `/v1/line/clinic` — daftar/buat klinik ide aktif.
- [ ] `GET` `/v1/line/clinic/[id]` — detail klinik (feedback per kelompok).
- [ ] `POST` `/v1/line/clinic/[id]/feedback` — tambah feedback.
- [ ] `POST` `/v1/line/clinic/[id]/vote` — vote Pilihan Klinik.
- [ ] `POST` `/v1/line/clinic/[id]/advance` — pemilik memajukan fase.
- [ ] `GET,POST` `/v1/line/sidang` — daftar sidang per grup.
- [ ] `GET` `/v1/line/sidang/[id]` — detail sidang (argumen per fase).
- [ ] `POST` `/v1/line/sidang/[id]/arguments` — tambah argumen.
- [ ] `POST` `/v1/line/sidang/[id]/vote` — suara anonim (fase VOTING).
- [ ] `POST` `/v1/line/sidang/[id]/advance` — maju fase sidang.
- [ ] `GET,POST` `/v1/line/stories` — daftar utas cerita (publik).
- [ ] `GET,PATCH` `/v1/line/stories/[id]` — baca utas (bab kanon + ajuan).
- [ ] `POST` `/v1/line/stories/[id]/chapters` — ajukan bab lanjutan (member).
- [ ] `POST` `/v1/line/chapters/[id]/vote` — vote bab (idempoten).
- [ ] `GET,POST` `/v1/line/listen` — daftar sesi Giliran Dengar (publik).
- [ ] `POST` `/v1/line/listen/[id]/join` — gabung pendengar (maks 12).
- [ ] `POST` `/v1/line/listen/[id]/needs-advice` — pembicara toggle butuh saran.
- [ ] `GET,POST` `/v1/line/listen/[id]/responses` — detail sesi + respons.
- [ ] `GET,POST` `/v1/line/kindness` — daftar kebaikan TAYANG (publik).
- [ ] `GET` `/v1/line/kindness/cities` — jumlah kebaikan tayang per kota.

### 3.15 moderation (1)
- [ ] `GET,POST` `/v1/moderation/appeals` — daftar/ajukan banding moderasi.

### 3.16 notifications (1)
- [ ] `GET` `/v1/notifications/stream` — SSE stream notifikasi web.

### 3.17 operasi (4)
- [ ] `GET` `/v1/operasi/health` — kesehatan sistem.
- [ ] `POST` `/v1/operasi/backup` — trigger backup (catat IN_PROGRESS).
- [ ] `POST` `/v1/operasi/activity` — catat aktivitas operasi.
- [ ] `POST` `/v1/operasi/email` — kirim email operasi (simulasi).

### 3.18 owner / admin (54)
- [ ] `POST` `/v1/owner/login` — login admin (rate limit + device).
- [ ] `POST` `/v1/owner/logout` — keluar admin.
- [ ] `POST` `/v1/owner/refresh` — refresh sesi admin.
- [ ] `POST` `/v1/owner/challenge` — tantangan device admin.
- [ ] `POST` `/v1/owner/bootstrap` — bootstrap owner awal.
- [ ] `POST` `/v1/owner/bootstrap/verify-device` — verifikasi device.
- [ ] `DELETE` `/v1/owner/devices/[id]` — cabut device admin.
- [ ] `GET` `/v1/admin/capabilities` — kapabilitas server (hanya nyata).
- [ ] `POST` `/v1/owner/approvals/[id]` — persetujuan admin.
- [ ] `GET,POST` `/v1/owner/inbox` — inbox admin.
- [ ] `POST` `/v1/owner/data-requests/[id]` — proses permintaan data.
- [ ] `GET` `/v1/admin/jasa/orders` — daftar order per kind (panel Owner Jasa).
- [ ] `GET` `/v1/owner/jasa/orders` — daftar semua order jasa (admin).
- [ ] `GET,PATCH` `/v1/owner/jasa/queue` — antrean admin (urgensi + menunggu siapa).
- [ ] `GET` `/v1/admin/jasa/queue` — antrean jasa (admin).
- [ ] `PUT` `/v1/owner/jasa/orders/[id]` — update order (?kind=UNDANGAN|LOGO|SERVICE).
- [ ] `PUT` `/v1/admin/jasa/orders/[id]/transition` — transisi status order.
- [ ] `PUT` `/v1/admin/jasa/orders/[id]/limit` — batasi order.
- [ ] `PUT` `/v1/admin/jasa/orders/[id]/revoke` — cabut order.
- [ ] `GET,POST` `/v1/owner/jasa/templates` — daftar/buat template.
- [ ] `PATCH,PUT` `/v1/owner/jasa/templates/[id]` — edit template.
- [ ] `PUT` `/v1/admin/jasa/templates/[id]` — update template (admin).
- [ ] `PUT` `/v1/admin/jasa/templates/[id]/lifecycle` — lifecycle template.
- [ ] `POST` `/v1/admin/jasa/catalog` — tambah item katalog jasa.
- [ ] `PUT,DELETE` `/v1/admin/jasa/catalog/[id]` — edit/hapus item katalog.
- [ ] `GET` `/v1/owner/moderation/cases` — antrean kasus moderasi.
- [ ] `POST` `/v1/owner/moderation/cases/[id]/decision` — keputusan kasus.
- [ ] `POST` `/v1/owner/moderation/cases/[id]/evidence` — tambah bukti.
- [ ] `GET` `/v1/owner/moderation/appeals` — daftar banding.
- [ ] `POST` `/v1/owner/moderation/appeals/[id]/decision` — keputusan banding.
- [ ] `GET` `/v1/owner/moderation/engine` — status engine moderasi.
- [ ] `POST` `/v1/owner/moderation/reset-window` — reset jendela moderasi.
- [ ] `POST` `/v1/owner/social/evidence/[id]` — bukti sosial admin.
- [ ] `POST` `/v1/owner/social/retention/run` — jalankan retensi sosial.
- [ ] `GET` `/v1/owner/groups` — daftar grup (admin).
- [ ] `POST` `/v1/owner/groups/[id]/decision` — keputusan grup.
- [ ] `PATCH` `/v1/owner/groups/[id]/manager` — atur manager grup.
- [ ] `POST` `/v1/owner/groups/appeals/[id]` — putuskan banding grup.
- [ ] `GET` `/v1/owner/taxonomy` — baca taksonomi (admin).
- [ ] `POST` `/v1/owner/taxonomy/nodes` — buat node taksonomi.
- [ ] `PATCH` `/v1/owner/taxonomy/nodes/[id]` — edit node.
- [ ] `GET` `/v1/owner/taxonomy/nodes/[id]/impact` — analisis dampak node.
- [ ] `GET` `/v1/owner/taxonomy/history` — riwayat perubahan taksonomi.
- [ ] `GET` `/v1/owner/taxonomy/export` — ekspor taksonomi.
- [ ] `POST` `/v1/owner/taxonomy/packages/[action]` — paket menu taksonomi.
- [ ] `GET,POST` `/v1/owner/learning-paths` — kelola jalur belajar.
- [ ] `POST` `/v1/owner/learning-paths/[id]/publish` — terbitkan jalur.
- [ ] `GET,POST` `/v1/owner/question-banks` — kelola bank soal.
- [ ] `POST` `/v1/owner/question-banks/[id]/review` — review bank soal.
- [ ] `GET` `/v1/owner/exams/queue` — antrean ujian.
- [ ] `PATCH` `/v1/owner/exams/capacity` — atur kapasitas ujian.
- [ ] `POST` `/v1/owner/exams/attempts/[id]/grade` — nilai attempt.
- [ ] `POST` `/v1/owner/exams/attempts/[id]/claim` — klaim attempt.
- [ ] `POST` `/v1/owner/shop/products` — kelola produk (admin).
- [ ] `GET` `/v1/owner/shop/questions` — daftar pertanyaan produk.
- [ ] `POST` `/v1/owner/shop/questions/[id]/answer` — jawab pertanyaan.
- [ ] `GET,POST` `/v1/owner/site-pages` — kelola halaman statis.
- [ ] `GET` `/v1/owner/operasi` — ringkasan + antrean prioritas operasi.
- [ ] `GET,POST` `/v1/owner/operasi/backup/[backupId]` — inspect/verify backup.
- [ ] `POST` `/v1/admin/operations/preview` — preview operasi massal (read-only).
- [ ] `POST` `/v1/admin/operations/execute` — eksekusi operasi (idempoten).
- [ ] `POST` `/v1/admin/automation/process-outbox` — proses outbox otomasi.
- [ ] `GET` `/v1/admin/telemetry` — telemetri admin.
- [ ] `POST` `/v1/owner/payment/chargeback` — bekukan order sengketa.
- [ ] `POST` `/v1/owner/payment/grants` — kode bantuan admin.
- [ ] `POST` `/v1/owner/recovery/[id]` — proses recovery akun.
- [ ] `POST` `/v1/owner/storage/reconcile` — bersih orphan files.
- [ ] `GET` `/v1/owner/content-packages` — paket konten admin.
- [ ] `GET` `/v1/runtime-menu` — menu runtime dari storage nyata.

### 3.19 payment (4) — simulasi jujur, harga dari server
- [ ] `GET` `/v1/payment/prices` — harga publik (sumber: `payment_settings`).
- [ ] `POST` `/v1/payment/orders` — buat order (harga dihitung server).
- [ ] `POST` `/v1/payment/manual-confirm` — konfirmasi manual (simulasi).
- [ ] `POST` `/v1/payment/redeem` — redeem kode.

### 3.20 pdf (1)
- [ ] `POST` `/v1/pdf/process` — proses PDF tools.

### 3.21 profile (2)
- [ ] `GET,PATCH` `/v1/profile` — profil sendiri (+ `calmMode`).
- [ ] `GET` `/v1/profiles/[username]` — profil publik viewer-aware.

### 3.22 public-feedback / recovery / suggestions (3)
- [ ] `POST` `/v1/public-feedback` — umpan balik publik / lapor masalah.
- [ ] `POST` `/v1/recovery` — ajukan pemulihan akun.
- [ ] `POST` `/v1/suggestions` — usulan topik (login).

### 3.23 search (1)
- [ ] `GET` `/v1/search?q=&category=&space=&cursor=&limit=20` — pencarian
  global. WAJIB: `targetHref` kanonis dari server (UI tidak menebak route).

### 3.24 security (3)
- [ ] `POST` `/v1/security/inspect` — inspeksi ancaman.
- [ ] `POST` `/v1/security/quarantine` — karantina (guard terpusat).
- [ ] `POST,GET` `/v1/security/threats` — log ancaman (redaksi ketat).

### 3.25 social (25) — DM, posting, proteksi
- [ ] `GET,POST` `/v1/social/posts` — posting (rate limit, filter kata).
- [ ] `PATCH,DELETE` `/v1/social/posts/[id]` — edit/hapus posting.
- [ ] `PUT,DELETE` `/v1/social/posts/[id]/reaction` — reaksi.
- [ ] `PUT,DELETE` `/v1/social/posts/[id]/save` — simpan posting.
- [ ] `GET,POST` `/v1/social/posts/[id]/comments` — komentar.
- [ ] `PATCH,DELETE` `/v1/social/comments/[id]` — edit/hapus komentar.
- [ ] `GET` `/v1/social/posts/[id]/attachments/[attachmentId]` — lampiran.
- [ ] `POST` `/v1/social/uploads` — upload ke karantina pra-moderasi.
- [ ] `POST` `/v1/social/reports` — laporkan konten (6 kategori).
- [ ] `GET` `/v1/social/me/posts` — posting milik sendiri.
- [ ] `GET` `/v1/social/notifications` — inbox notif + unread count.
- [ ] `POST` `/v1/social/notifications/read` — tandai dibaca.
- [ ] `GET,POST` `/v1/social/conversations` — daftar DM.
- [ ] `GET,POST` `/v1/social/conversations/[id]/messages` — pesan
  (idempotencyKey anti-duplikat).
- [ ] `PUT` `/v1/social/conversations/[id]/preference` — arsip/keluar.
- [ ] `DELETE` `/v1/social/messages/[id]` — hapus pesan.
- [ ] `POST` `/v1/social/messages/[id]/report` — laporkan pesan.
- [ ] `GET,POST` `/v1/social/message-requests` — permintaan pesan;
  `POST /v1/social/message-requests/[id]` (terima/tolak).
- [ ] `GET` `/v1/social/people` — cari orang.
- [ ] `GET,DELETE` `/v1/social/friends` — daftar/hapus teman.
- [ ] `PUT,DELETE` `/v1/social/blocks/[principalId]` — blokir.
- [ ] `GET` `/v1/social/mutes` — daftar mute; `PUT,DELETE /v1/social/mutes/[principalId]`.
- [ ] `GET` `/v1/social/quota` — kuota sosial.

### 3.26 software (7)
- [ ] `GET` `/v1/software` — katalog publik (cursor, limit 50).
- [ ] `GET` `/v1/software/[slug]` — detail software.
- [ ] `POST` `/v1/software/propose` — usulkan software (login).
- [ ] `POST` `/v1/software/[slug]/review` — rating/ulasan (login).
- [ ] `POST` `/v1/software/[slug]/report` — laporkan software.
- [ ] `GET` `/v1/software/versions/[id]` — daftar versi.
- [ ] `POST` `/v1/software/versions/[id]/download` — catat unduhan.

### 3.27 taxonomy (1)
- [ ] `GET` `/v1/taxonomy?path=&q=&cursor=&limit=20` — baca taksonomi publik.

### 3.28 telemetry (1)
- [ ] `POST` `/v1/telemetry` — telemetri client (selalu 200).

### 3.29 tools (5)
- [ ] `POST,GET` `/v1/tools/[toolId]/execute` — eksekusi tool (registry tunggal).
- [ ] `POST` `/v1/tools/circuit-emulator/session` — sesi emulator
  (reserve/commit/release trial).
- [ ] `POST` `/v1/tools-trial/reserve` — reservasi 1 eksekusi trial.
- [ ] `POST` `/v1/tools-trial/commit` — konfirmasi pasca-sukses.
- [ ] `POST` `/v1/tools-trial/release` — lepas reservasi.

### 3.30 utilities (3)
- [ ] `GET,POST` `/v1/utilities/rumus` — daftar rumus (publik baca).
- [ ] `GET,POST` `/v1/utilities/workspace` — workspace tersimpan (pemilik).
- [ ] `GET,DELETE` `/v1/utilities/workspace/[id]` — muat/hapus workspace.

## 4. Komponen kunci + fungsi yang WAJIB dipertahankan

### 4.1 `src/components/header.tsx`
- [ ] Brand "Madevi" (link ke `/`), tanpa popup otomatis.
- [ ] Search pill (kapsul) sebagai SATU-SATUNYA pemilik `SearchOverlay`
      (L02 G-02-03); tombol breadcrumb hanya meminta via event
      `madevi:open-search` agar tidak ada overlay ganda.
- [ ] Sinkron state search ke URL (`?q=`, `?category=`, `?space=`) via
      `history.replaceState`; saat tutup, parameter dibersihkan.
- [ ] Toggle sidebar via event `madevi:open-sidebar` /
      `madevi:close-sidebar`; icon hamburger berubah jadi X mengikuti event
      `madevi:sidebar-state`.
- [ ] Kategori search kanonis: MENU, ARTICLE, PROFILE, SOFTWARE, PAGE,
      SERVICE, PRODUCT, POST. Ruang kanonis: explore, tutorial, school,
      line, services, shop, tools.
- [ ] Aksesibilitas dialog: `useDialogBehavior` (Escape menutup, fokus awal
      ke input, fokus kembali ke tombol search).
- [ ] Bilingual id/en untuk semua label.

### 4.2 `src/components/sidebar.tsx`
- [ ] Slide dari kanan, dibuka DI BAWAH header; backdrop blur, klik di luar
      menutup.
- [ ] `SidebarClock`: jam HH:MM:SS + tanggal Indonesia, update tiap detik.
- [ ] Tombol gear membuka `SettingsPopup` (bukan halaman baru).
- [ ] Developer card: logo `/madevi-emblem.svg` + teks "Madevi developer".
- [ ] 3 icon sosmed custom (Gmail, Instagram, TikTok), link eksternal
      `target=_blank rel=noopener noreferrer`.
- [ ] Kolom "Laporkan masalah" ke `/laporkan-masalah`.
- [ ] Tepat 7 ruang dari `MADEVI_SPACES` (`@/contracts/navigation`),
      status aktif via pencocokan prefix pathname, `aria-current="page"`.
- [ ] Icon per ruang tidak boleh tertukar; urutan ruang tidak berubah.

### 4.3 `src/components/search-overlay.tsx`
- [ ] Debounce 300ms, batalkan request lama via `AbortController`.
- [ ] Minimal 2 karakter untuk mencari; hint, loading, error + tombol
      "Coba lagi" (retryKey).
- [ ] Filter ruang (7, kanonis) + filter kategori (8) sebagai toggle
      `aria-pressed`.
- [ ] Riwayat pencarian: localStorage `madevi:recent-searches`, maks 8,
      bisa dihapus satu per satu (klik untuk pakai lagi).
- [ ] Load more via `nextCursor` server.
- [ ] Deep-link: pakai `targetHref` tervalidasi server (L06); fallback legacy
      per `entryType` (ARTICLE ke `/artikel/[id]`, PRODUCT ke
      `/belanja/[id]`, dst). UI dilarang menebak route.
- [ ] Highlight kata kunci (`<mark>`) pada judul dan snippet.

### 4.4 `src/components/settings-popup.tsx`
- [ ] Popup terpusat (dialog), klik backdrop menutup, `stopPropagation`
      di dalam dialog, Escape menutup, fokus kembali ke tombol gear.
- [ ] Bahasa: radio Indonesia / English via `useLanguage`.
- [ ] Tema: radio Terang (`light`) / Gelap (`dark`) / Madevi On Style
      (`madevi-on`) via `useTheme`, dengan preview, deskripsi bilingual,
      tanda centang pada tema aktif, dan status "Tema aktif: ...".
- [ ] Madevi On = identitas brand opt-in (kaca navy di atas latar gelap),
      bukan sekadar dark kedua.

### 4.5 `src/components/theme-provider.tsx`
- [ ] Tipe tema: `light | dark | madevi-on`; default `dark`
      (Madevi On hanya opt-in). Bahasa default `id`.
- [ ] Inline script pra-hydration anti-flash: baca `madevi-theme` dan
      `madevi-language` dari localStorage SEBELUM React render.
- [ ] Sinkron akun: preferensi tema/bahasa dari `GET /v1/profile`
      menimpa localStorage (jangan sampai reset pilihan user).
- [ ] Set `data-theme`, `data-language`, dan `document.documentElement.lang`.
- [ ] Event `madevi:theme-change` / `madevi:language-change` + listener
      `storage` agar sinkron antar tab.
- [ ] `useSyncExternalStore` untuk snapshot tema/bahasa (aman SSR).

### 4.6 `src/components/home-content.tsx`
- [ ] Menerima `articles` dan `spaces` dari server (bukan fetch client).
- [ ] Copy intent per ruang (7 kunci: explore, tutorial, school, line,
      services, shop, tools) bilingual; copy hanya mengarah ke route yang
      memang ada (tidak membuat layanan/aksi baru).
- [ ] `LanjutkanMembaca`: lanjutkan artikel terakhir dari riwayat.
- [ ] Icon `SpaceGlyph` per ruang konsisten dengan sidebar.

### 4.7 `src/components/footer.tsx`
- [ ] 4 link: Tentang and FAQ (`/tentang`), Fitur Review (`/review`),
      Ketentuan and Layanan (`/ketentuan`), Privasi (`/privasi`).
- [ ] Baris copy "Madevi · Pengetahuan dan tindakan lokal" (bilingual).
- [ ] Kontrak v15: baris utama footer memuat "Madevi @2027" dengan jelas.

### 4.8 `src/components/breadcrumb.tsx`
- [ ] Label bilingual per segmen via `ROUTE_LABELS`; segmen tak dikenal
      memakai label ruang dari `resolveSpaceFromPath` /
      `MADEVI_SPACES` (jangan tampilkan slug mentah).
- [ ] Breadcrumb tidak membuka search overlay sendiri; bila perlu search,
      dispatch event `madevi:open-search` ke header.

### 4.9 Komponen pendukung yang tidak boleh hilang
- [ ] `public-shell.tsx` — kerangka publik (header + footer + slot konten).
- [ ] `private-route.tsx` — guard auth: belum login diarahkan/tampilkan
      konten tamu (cek via `GET /v1/profile`).
- [ ] `dialog-behavior.ts` — focus trap, Escape, return focus
      (dipakai header search, sidebar, settings).
- [ ] `crisis-help-card.tsx` — hanya muncul saat indikasi krisis terdeteksi.
- [ ] `article-reading-tools.tsx` + `fokus-baca.tsx` — alat baca artikel
      (ukuran font, mode fokus).
- [ ] `daftar-isi.tsx` — daftar isi artikel/bab.
- [ ] `lanjutkan-membaca.tsx` — widget lanjutkan membaca.
- [ ] `ai-button.tsx` — tombol + panel chat AI asisten (gelembung kanan
      bawah, popup chat, keyword lokal).
- [ ] `breadcrumb-bar.tsx` — bar breadcrumb di halaman konten.
- [ ] `calm-mode-toggle.tsx` + `calm-post-card.tsx` — Zona Tenang.

## 5. Dependensi database per fitur (skema `madevi`)

- [ ] Auth/akun: `principals`, `account_credentials`, `auth_sessions`,
      `used_refresh_tokens`, `mfa_factors`, `mfa_challenges`,
      `contact_verifications`, `terms_consents`, `account_appeals`,
      `account_data_requests`, `deletion_ledger`, `api_rate_limits`,
      `rate_limits`.
- [ ] Artikel/konten: `articles`, `article_blocks`, `article_sources`,
      `article_corrections`, `article_revisions`, `article_aliases`,
      `article_relations`, `article_claims`, `article_claim_evidence`,
      `article_facet_assignments`, `article_safety_profiles`,
      `article_review_records`, `article_auto_checks`,
      `article_suggestions`, `fixture_articles`.
- [ ] Shop: `ebelanja_products`, `ebelanja_saved_products`,
      `ebelanja_partners`, `fixture_products`.
- [ ] Tools: `utilities_workspaces`, `tools_trial_reservations`,
      `quota_accounts`, `quota_reservations`.
- [ ] Services/pembayaran: `jobs`, `invitation_orders`,
      `invitation_templates`, `logo_orders`, `payment_orders`,
      `payment_codes`, `payment_promos`, `payment_settings`,
      `entitlement_ledger`, `entitlements`,
      `principal_entitlement_current`.
- [ ] School/ujian: `learning_paths`, `learning_path_articles`,
      `learning_progress`, `learning_cycles`, `exam_attempts`,
      `attempt_mc_answers`, `attempt_essay_answers`, `grade_reviews`,
      `score_revisions`, `exam_capacity_control`, `question_banks`,
      `questions_mc`, `questions_essay`, `certificates`,
      `certificate_audits`, `guardian_submissions`.
- [ ] Line/sosial: `social_posts`, `social_comments`, `social_reactions`,
      `social_post_attachments`, `social_reports`, `social_blocks`,
      `social_mutes`, `social_restrictions`, `saved_social_posts`,
      `direct_conversations`, `direct_messages`, `message_requests`,
      `message_evidence`, `message_tombstones`, `friend_connections`,
      `moderation_cases`, `moderation_case_evidence`,
      `moderation_appeals`, `moderation_assessments`,
      `moderation_rulesets`, `moderation_strikes`,
      `notification_outbox`, `public_groups`, `group_memberships`,
      `group_appeals`.
- [ ] Taksonomi/search: `taxonomy_nodes`, `taxonomy_aliases`,
      `taxonomy_revisions`, `taxonomy_change_log`,
      `taxonomy_import_batches`, `taxonomy_stable_ids`,
      `taxonomy_state`, `search_index_entries`, `search_index_jobs`,
      `search_consistency_runs`, `content_facet_definitions`,
      `content_facet_values`, `content_families`, `content_packets`,
      `content_relations`.
- [ ] AI: `ai_conversations`, `ai_messages`, `ai_quota_days`,
      `ai_guest_usage`, `ai_adapters`, `ai_audit_events`.
- [ ] Software: `software_catalog`, `software_versions`,
      `software_platforms`, `software_reviews`, `software_reports`,
      `software_proposed`, `software_downloads`,
      `software_download_log`, `software_installation_threads`.
- [ ] Kontribusi/aktivitas: `user_contributions`,
      `suggestion_supports`, `user_activity_logs`,
      `madevi_access_events`, `api_records`, `fixture_activities`.
- [ ] Site/operasi: `site_pages`, `site_page_blocks`, `owner_devices`,
      `owner_device_challenges`, `owner_inbox`, `owner_inbox_items`,
      `owner_mailbox`, `admin_sessions`, `admin_audit_logs`,
      `admin_alerts`, `audit_events`, `backup_runs`, `backup_logs`,
      `email_outbox`, `security_threat_logs`, `quarantined_files`,
      `storage_objects`, `social_retention_runs`, `recovery_cases`.

## 6. Fitur proteksi (tidak boleh rusak saat rombak)
- [ ] Rate limit login 2 lapis (per-akun hash + per-IP); helper IP terpusat,
      jangan percaya `X-Forwarded-For` mentah (`src/server/client-ip.ts`).
- [ ] Filter blocked-words Line (130+ entri) tetap jalan di client dan server.
- [ ] Tombol Laporkan + 6 kategori + antrean moderasi admin.
- [ ] `CrisisHelpCard` hanya muncul saat indikasi krisis.
- [ ] Mode anonim Line (`is_anonymous`).
- [ ] Rate limit createPost/addComment dan verify-contact.
- [ ] Respons undangan/order privat memakai DTO whitelist
      (jangan `SELECT o.*` lalu hapus `secret_token`).
- [ ] Upload sosial masuk karantina sebelum moderasi.

## 7. Catatan perubahan yang disetujui Ade
- 15 Okt 2026: desain v15 dinyatakan FIX (fondasi). Rombak desain ke
  project mengikuti `RENCANA-ROMBAK-DESAIN-V15.md`, fitur per fitur,
  tanpa ada yang hilang.

## 8. Ringkasan verifikasi

- Total halaman terdaftar: **57** (`find src/app -name page.tsx`).
- Total API route terdaftar: **234** (`find src/app/api -name route.ts`).
- Komponen kunci didokumentasikan: **8** (+ 11 pendukung).
- Tabel DB dipetakan: **~130** dalam 13 kelompok fitur.
- Domain API: **30** kelompok (health, auth, account, ai, articles,
  certificates, ebelanja, exams, foundation, groups, jasa, kontribusi,
  learning-paths, line, moderation, notifications, operasi, owner,
  payment, pdf, profile(s), public-feedback/recovery/suggestions,
  search, security, social, software, taxonomy, telemetry,
  tools(+trial), utilities).

### 10 fungsi paling berisiko hilang saat rombak desain
1. **Event bus header/sidebar** (`madevi:sidebar-state`,
   `madevi:open-search`, `madevi:open-sidebar`) — rombak visual sering
   menghapus event tak terlihat ini; akibat: search dan sidebar mati.
2. **Sinkron URL search** (`?q=&category=&space=`) — state di URL mudah
   hilang saat search ditulis ulang; akibat: filter tidak terbagi.
3. **`targetHref` kanonis search (L06)** — jika UI kembali menebak route,
   deep-link rusak untuk entry lama.
4. **Pre-hydration theme script** — jika dihapus, terjadi flash tema salah
   dan default bisa bergeser dari `dark`.
5. **Sinkron preferensi akun** (`GET /v1/profile` menimpa localStorage) —
   jika urutan init salah, pilihan tema/bahasa user ter-reset.
6. **Focus trap + return focus** (`useDialogBehavior`) — popup yang
   ditulis ulang tanpa ini merusak aksesibilitas dan Escape.
7. **Proteksi Line** (blocked-words, laporkan, CrisisHelpCard, anonim,
   rate limit) — komponen sosial baru sering melupakan satu dari ini.
8. **`PrivateRoute` + konten tamu** (`LineGuestView`) — halaman yang
   ditulis ulang bisa mengunci tamu sepenuhnya atau membuka data privat.
9. **Kejujuran affiliate Shop** (tanpa checkout palsu, disclosure,
   `rel="sponsored"`, track-click) — kartu produk baru rentan menambah
   tombol "Beli" yang tidak ke mana-mana.
10. **Token privat order/undangan** (DTO whitelist, secret token tidak
    bocor) — form status order baru bisa mengekspos `secret_token`
    lewat `SELECT o.*`.
