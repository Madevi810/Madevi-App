# INDEX — Rencana Aktif Madevi (Sumber Status Tunggal)

Dokumen ini adalah satu-satunya sumber status item kerja. `memory/STATE.md`,
`memory/CHECKPOINT.md`, `memory/BACKLOG.md`, dan changelog memberi konteks, bukti, atau
ide; mereka tidak boleh mengubah status item di bawah ini.

## Aturan status dan lock

- Status yang sah: `BELUM`, `PROSES`, `REVISI`, `PASS`, `GAGAL-AUDIT`, `TERBLOKIR`, dan
  `DITUNDA`.
- Agent 2 hanya boleh mengubah `BELUM → PROSES`. Agent 4 hanya boleh mengubah
  `GAGAL-AUDIT → REVISI` dan `REVISI → PASS` setelah laporan Agent 3 menyatakan lulus.
  Agent 5 satu-satunya yang boleh memberi `TERBLOKIR`, `DITUNDA`, atau memutus konflik.
- Setiap item aktif harus punya satu lock. Sebelum menyentuh source, tulis `ID`, pemegang,
  waktu UTC, batas file, dan fase di tabel lock. Hapus lock hanya setelah handoff/checkpoint.
- Item `PASS` tidak diedit langsung. Buat ID baru dengan akhiran `-REV1`, referensikan item
  asal, lalu jalankan siklus baru.

## Lock aktif

| ID | Pemegang | Fase | Batas file | Mulai UTC | Catatan |
|---|---|---|---|---|---|
| EMULATOR-001 | Owner takeover / Agent 2→3 | PROSES | `src/app/alat-bantu/emulator/page.tsx`, `src/components/circuit-emulator.tsx`, `src/components/circuit-emulator.module.css`, `src/components/utilities-page.tsx`, `src/lib/emulator/`, `src/workers/circuit-solver.worker.ts`, `src/app/api/v1/utilities/workspace/`, `src/app/api/v1/utilities/workspace/[id]/route.ts`, `src/services/utilities.ts`, `database/migrations/0040-emulator-workspaces.*.sql`, `tests/unit/circuit-solver.test.ts`, `blueprint/fitur/WORKSPACE-DAN-TOOLS.md`, `blueprint/produk/USULAN-EMULATOR.md`, QA item/control EMULATOR-001 | 2026-09-28T01:52Z | Owner takeover. Audit Agent 3 `blueprint/qa/audits/EMULATOR-001.md` authoritative: static scope 12/12 lulus; M-01 tetap BELUM-DIVERIFIKASI karena test runner diblokir guardrail. Laporan pertama Agent 2 ditolak sebagai wrong-scope/unrelated paths. Migration hanya source. |
| UX-REFINE-001 | Executor (takeover 2026-10-15, bot dihentikan atas perintah Owner) | PROSES | `Madevi_Off/src/styles/{globals,tokens,redesign,interface-refresh,madevi-on,atlas-redesign}.css`, `Madevi_Off/src/app/layout.tsx`, `Madevi_Off/src/components/{public-shell,header,sidebar,motion-orchestrator,home-content}.tsx`, `Madevi-Control/blueprint/qa/items/UX-REFINE-001.md`, `Madevi-Control/blueprint/INDEX.md`, `Madevi-Control/memory/{CHECKPOINT,DECISIONS}.md`, `Madevi_Off/tests/unit/madevi-on-css-contract.test.ts` | 2026-10-09T00:00Z | Izin Owner eksplisit untuk build/test/browser smoke lokal tercatat di DECISIONS.md; tidak menyentuh `utilities-page.tsx`, emulator/worker/API/data. |
| DESAIN-V15-001 | Executor | SELESAI | `Madevi_Off/src/components/{header,sidebar,home-content,footer,breadcrumb,search-overlay,settings-popup,theme-provider}.tsx`, `Madevi_Off/src/app/ai-asisten/`, route Shop + komponen katalog Shop, komponen article reader, `Madevi_Off/src/styles/*.css`, `Madevi-Control/kontrak-visual/simulasi-madevi-v15.html`, `Madevi-Control/RENCANA-ROMBAK-DESAIN-V15.md`, `Madevi-Control/FITUR-INVENTARIS.md` | 2026-10-14T21:55Z | Migrasi kontrak visual v15 (FIX 2026-10-15) ke project asli, 10 fase. Prinsip: nol fitur hilang, data dari project asli. Tidak menyentuh proteksi Line, auth, API jasa, emulator/worker. |



Lock dilepas: `UX-REDESIGN-002` (9/9 AC + 6/6 M), `SEC-001` (0 critical/high), `AMBIENT-001` (6/6 AC + 5/5 M), `ROUTE-FIX-001`
(5/5 AC + 5/5 M), `JASA-API-001` (5/5 AC + 4/4 M), `PKG-REF-001` (4/4 AC + 3/3 M), `RECOVERY-001` bagian rancang
(5/5 AC + 4/4 M), dan `INVITATION-ORDER-001` (5/5 AC, PASS statis; browser template published dan submit belum diverifikasi). Semua status PASS.

Full disclosure:
- `AMBIENT-001`: implementasi dimulai dalam fase PROSES sebelum baris lock terisi; batas
  file yang disentuh tetap sesuai item QA (`public-shell.tsx`, `madevi-on.css`,
  `interface-refresh.css`) — tidak ada file di luar batas yang berubah.
- `ROUTE-FIX-001`: pengerjaan dimulai sebelum kontrol 5-Agent terbaca; `src/services/admin.ts`
  bertumpuk dengan cakupan lock SEC-001 (kini PASS) — perubahan hanya pada 7 href
  getCapabilities. Satu perbaikan tambahan saat audit: `src/app/admin/layout.tsx` tidak lagi
  merender `AdminShell` (menghapus paparan menu `/admin/*` 404). Satu bug produk baru
  ditemukan dan dipromosikan ke item `JASA-API-001` (8.3).
- `JASA-API-001`: ditemukan saat audit ROUTE-FIX-001, langsung didaftarkan ke INDEX sebagai
  item baru sebelum diimplementasikan; batas file hanya 2 (route baru + panel).


## Urutan kerja aktif

| Urut | ID | Area | Status | Dependensi | Ringkasan |
|---:|---|---|---|---|---|
| 0 | CTRL-5A-001 | Kontrol | PASS | — | Migrasi control-plane lima peran, blueprint, QA, lock, dan guardrail selesai secara statis. |
| 1 | UX-001 | Desain | PASS | CTRL-5A-001 | Audit visual statis tujuh ruang: overlap control, responsive reflow, fokus, dan tiga tema. |
| 1.1 | UX-001-REV1 | Desain | DITUNDA | UX-001 | Implementasi sebelumnya tetap tersimpan; audit lama digantikan scope redesign Owner terbaru pada UX-REDESIGN-001. |
| 1.2 | UX-REDESIGN-001 | Desain | PASS | UX-001 | Redesign total sesuai scope Owner 2026-09-25; fondasi motion, atmosfer On, wordmark Home, Basic, reskin sidebar. (Audit selesai) |
| 2 | CONTENT-001 | Artikel/Data | PASS | UX-001 | Petakan policy server/workflow Owner untuk Content Packet 0039 yang masih pending. |
| 3 | PROFILE-001 | Fitur/Security | PASS | CONTENT-001 | Audit permission, CSRF, ekspor, hapus akun, dan recovery Profil. |
| 4 | ADMIN-001 | Fitur/API | PASS | PROFILE-001 | Audit dashboard Admin: route nyata, state loading/empty/error, tabel mobile, dan aksi berbahaya. |
| 4.1 | ADMIN-001-REV1 | Fitur/API | PASS | ADMIN-001 | Revisi pasca-audit dashboard: state kegagalan operasi yang jujur dan navigasi pengguna tanpa fragmen palsu. (Audit ADMIN-001-REV1 lulus) |
| 5 | SEARCH-001 | API/QA | PASS | ADMIN-001 | Verifikasi search permission-aware, filter ruang/kategori, dan pemulihan zero-result. |
| 6 | ASSESS-001 | Data/Security | PASS | SEARCH-001 | Bounded P-03 slice: presentasi aturan assessment versioned; audit statis Agent 3 lulus AC-01–AC-05 dan M-01–M-03. Runtime/full verification tetap BELUM-DIVERIFIKASI. |
| 7 | SEC-001 | Security | PASS | ASSESS-001 | Hardening IDOR, CORS, backup exposure, aksesibilitas, dan performa Android. (Audit SEC-001 lulus — 0 temuan critical/high) |
| 8 | RECOVERY-001 | Data/QA | PASS (rancang) | SEC-001 | Rancang lalu jalankan, bila Owner mengizinkan, drill restore non-production dan rollback. (Rancangan selesai + audit lulus 5/5 AC; eksekusi drill menunggu izin eksplisit Owner — lihat `memory/RECOVERY-PLAN.md`) |
| 8.1 | AMBIENT-001 | Desain | PASS | UX-REDESIGN-001 | Lapisan ambient Madevi On: glow blobs parallax + fading grid + aksen plum/amethyst/amber (mengacu gamenative.app, disesuaikan). (Audit AMBIENT-001 lulus — 6/6 AC, 5/5 M) |
| 8.2 | ROUTE-FIX-001 | Fitur/QA | PASS | ADMIN-001-REV1 | Route `/admin` buntu dialihkan ke `/owner` kanonis; href capability AdminService diperbarui; path paket taxonomy kanonis dipindah ke `content-local`; 5 assertion kontrak desain `prompt03` diperbarui pasca-UX-REDESIGN-001. (Audit ROUTE-FIX-001 lulus — 5/5 AC, 5/5 M; temuan tambahan: `admin/layout.tsx` diperbaiki saat audit, `JASA-API-001` dipromosikan ke 8.3) |
| 8.3 | JASA-API-001 | Fitur/API | PASS | ROUTE-FIX-001 | Panel Owner Jasa memanggil `GET /api/v1/admin/jasa/orders?kind=UNDANGAN/LOGO/SERVICE` (3 daftar) tetapi route list tersebut tidak ada — hanya `/jasa/queue` dan `/jasa/orders/[id]/*`. Daftar Undangan/Logo/Order layanan diam-diam gagal (error ditelan, array kosong). Route list kanonis ditambahkan + error panel jujur. (Audit JASA-API-001 lulus — 5/5 AC, 4/4 M) |
| 8.4 | UX-REDESIGN-002 | Desain | PASS | UX-REDESIGN-001, AMBIENT-001 | Implementasi Owner-approved: Fieldbook, Night Ledger, Signal Atlas, overlay, Atlas Assembly header, dan motion UI terarah tanpa mengubah sidebar/route/API/data. (Audit UX-REDESIGN-002 lulus) |
| 8.5 | JASA-ROUTE-001 | Fitur/Route | PASS | ROUTE-FIX-001 | Compatibility redirect token lama diterapkan pada form; audit ulang statis lulus. Runtime tetap belum diverifikasi sesuai guardrail. |
| 8.6 | EMULATOR-001 | Tools/Pendidikan | PROSES | ROUTE-FIX-001 | Emulator sirkuit DC edukasi lokal di Next.js: Canvas, solver MNA Web Worker, dan workspace privat lokal; tidak termasuk Laravel/Octane atau tier/fitur yang belum ditetapkan. Migration source saja, runtime dan DB tidak dijalankan. |
| 8.7 | PKG-REF-001 | Content/QA | PASS | ROUTE-FIX-001 | Konsistensi tiga sourceRef fixture pada panel paket Owner dengan manifest lokal yang benar; bila sumber lokal belum ada, tampilkan status jujur tanpa membuat path rekaan. Audit statis lulus — 4/4 AC dan 3/3 M; runtime tetap belum diverifikasi sesuai guardrail. |
| 8.8 | P06-SHELL-A11Y-001 | Desain/Aksesibilitas | PASS | UX-REDESIGN-002, AMBIENT-001 | P-06 bounded public-shell focus, overlay, touch-target, and reduced-motion contract. Audit revisi lulus statis; runtime/performance tetap BELUM-DIVERIFIKASI. |
| 8.9 | UX-REFINE-001 | Desain | PROSES | UX-REDESIGN-002, AMBIENT-001, P06-SHELL-A11Y-001 | Revisi sistem UI/UX global: tema/motion, shell/header/sidebar, komponen, border, responsif lintas perangkat; izin tes lokal terdokumentasi. |
| 9 | ARTICLE-READER-001 | Pengalaman artikel | PASS (statis) | UX-REFINE-001 (tidak overlap: kontrol pembaca di komponen article; CSS module lokal) | Skala teks isi dan mode fokus pada reader database dan starter draft. Audit statis Agent 3 lulus AC-01–AC-05; implementer melaporkan tes 4/4, typecheck/build lulus dan smoke browser starter. Artikel database runtime, no-JS DB, Termux, suite penuh, matriks device/theme belum diverifikasi. |
| 9.1 | TOOLS-PORT-001 | Tools/Inovasi | PASS | EMULATOR-001 (lock `src/services/utilities.ts` dihormati; perubahan additive) | Port 7 formula elektronika & utilitas dari zip (Oct 13) ke live: hukum_ohm, pembagi_tegangan, kode_warna_resistor (ELECTRONICS baru), konversi_suhu, bmi, persen, konversi_panjang. Identik 100% dengan zip. Bukti: typecheck EXIT 0, unit test 14/14, API 17 formula (sebelumnya 10). |
| 9.2 | JASA-PORT-001 | Madevi Services | PASS | EMULATOR-001 (overlap: src/components/jasa/* + jasa-page.tsx) | Port 5 jalur layanan dari zip (sebelumnya 3): tambah Desain Logo + Undangan Digital. Merge BreadcrumbBar live. Bukti: typecheck EXIT 0, 5/5 tab HTTP 200, browser nyata 5 path items + panel Logo & Undangan, flow order undangan end-to-end tersimpan di DB (PENDING_APPROVAL, slug budi-santoso-sari-dewi-20122026-4e7c). | blueprint/qa/items/JASA-PORT-001.md |
| 9.3 | TPS-PORT-001 | Tutorial & Problem Solve | PASS | EMULATOR-001 (overlap: tutorial-problem-foundation.tsx) | Port category cards + timeline + badge waktu baca dari zip; BreadcrumbBar live dipertahankan. Bukti: typecheck EXIT 0, HTTP 200, browser merender PETA TINDAKAN + peringatan batas aman + empty state jujur (taxonomy belum terbit, 7 menu fondasi). | blueprint/qa/items/TPS-PORT-001.md |
| 9.4 | EXPLORE-PORT-001 | Explore & Learn | PASS | EMULATOR-001 (overlap: explore-foundation.tsx) | Port design system mdv2 dari zip: category cards + skeleton grid + filter search + load-more Button. BreadcrumbBar live dipertahankan. Bukti: typecheck EXIT 0, browser: skeleton 6 → 3 cat cards (Sains Alam/Teknologi Digital/Bahasa Komunikasi), klik card navigasi level + breadcrumb konteks, filter "teknologi" → 1 card. | blueprint/qa/items/EXPLORE-PORT-001.md |
| 9.5 | SCHOOL-PORT-001 | Madevi School | PASS | EMULATOR-001 (overlap: r1-navigator.tsx) | Port dashboard jenjang dari zip: 7 kartu jenjang (PAUD/SD/SMP/SMA/PT/Spesialis/Nonformal) dengan ikon SVG + meta unit/kelas + pintasan quickJenjang; unit card redesign (badge jenjang, count kelas, chevron SVG); class card dengan progress bar ARIA. Bukti: typecheck EXIT 0. BreadcrumbBar: tidak ada di kedua versi (PublicShell). | blueprint/qa/items/SCHOOL-PORT-001.md |
| 9.6 | LINE-PORT-001 | Madevi Line | PASS (visual) | EMULATOR-001 (overlap: social-feed/tabs) | Port redesign visual 13 Okt dari zip: ikon SVG inline (no emoji), class .line-* lengkap. Bukti: typecheck EXIT 0, import kompatibel (3 export dipakai dashboard live), CSS .line-* terisolasi dari .social-*. | blueprint/qa/items/LINE-PORT-001.md |
| 10.1 | LINE-CALM-001 | Madevi Line (Inovasi) | PASS | INOVASI-0841 (additive: calm-mode.ts, calm-post-card.tsx, use-calm-mode.tsx, calm-mode-toggle.tsx; overlap terbatas social-feed.tsx/social-dashboard.tsx) | Zona Tenang: mode baca anti-engagement (toggle inline header Line; feed tanpa angka like/komentar/badge; counter → "Ada dukungan"; kronologis murni; Laporkan + Kirim semangat tetap utuh; preferensi login = ui_preferences DB, tamu = localStorage + label jujur). Bukti: tsc EXIT 0, 7/7 render test calm-post-card, 18/18 unit test gabungan. | blueprint/qa/items/INOVASI-0841-0940-SELESAI.md |
| 10.2 | LINE-KINDNESS-001 | Madevi Line (Inovasi) | PASS | INOVASI-0841 (tabel baru + service/api/UI baru; migration 0042) | Peta Kebaikan: laporan kebaikan per kota (dropdown kota terkunci, kategori 5 nilai, anonim "Seorang warga [kota]", status ANTRI/TAYANG/DITOLAK + trigger guard), peta SVG Indonesia 20 pin, filter kota, antrean moderasi reuse INSTRUKSI-03. Bukti: tsc EXIT 0, 18/18 unit test gabungan. | blueprint/qa/items/INOVASI-0841-0940-SELESAI.md |
| 10.3 | LINE-STORY-001 | Madevi Line (Inovasi) | PASS | INOVASI-0940 (tabel baru + service/api/UI baru; migration 0042) | Dongeng Bareng: cerita bersambung (utas, bab maks 300 kata CHECK, 1 ajian aktif/user/utas, vote idempoten toggle, kanonisasi mingguan MAX vote + tie created_at ASC + kalah ARSIP, tutup utas oleh pembuat). Bukti: tsc EXIT 0, 18/18 unit test gabungan. | blueprint/qa/items/INOVASI-0841-0940-SELESAI.md |
| 10.4 | SHOP-BUNDLE-001 | Madevi Shop (Inovasi) | PASS | INOVASI-0940 (tabel baru + service/api/UI baru; migration 0043) | Bundel Ongkir Tetangga: patungan ongkir sekota maks 5 orang, createBundle/joinBundle (tolak double-slot + autoClose PENUH)/leaveBundle (hanya sebelum PENUH), estimateSaving rumus (single×n−bundle)÷n dari tarif statis berlabel "simulasi", tanpa uang lewat Madevi, form inline (bukan prompt). Bukti: tsc EXIT 0, rumus teruji unit (n=1→0; Jakarta n=5→Rp10.600; capped slot; tidak negatif). | blueprint/qa/items/INOVASI-0841-0940-SELESAI.md |

| 10.5 | LINE-LISTEN-001 | Madevi Line (Inovasi) | PASS | INOVASI-1045 (tabel baru + service/api/UI baru; migration 0044) | Giliran Dengar: sesi curhat giliran (pembicara bicara, pendengar respon REFLEKSI/SEMANGAT; SARAN ditolak service-layer sampai pembicara aktifkan "Saya butuh saran"; maks 12 pendengar; rate limit 20/jam; anonim opsional). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 10.6 | SHOP-DUEL-001 | Madevi Shop (Inovasi) | PASS | INOVASI-1045 (tabel baru + service/api/UI baru; migration 0045) | Duel Produk: komparasi 2 produk afiliasi (kartu pro/kontra ≥20 char, vote + alasan ≥30 char, 1 vote/user, pemenang setelah duel berakhir, deteksi vote mencurigakan). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 10.7 | LINE-SIDANG-001 | Madevi Line (Inovasi) | PASS | INOVASI-1145 (tabel baru + service/api/UI baru; migration 0046) | Sidang Warga: musyawarah formal 3 fase TANYA→SANGGAH→VOTING anonim HMAC hash (argumen dibatasi per fase; voting baru bisa dibuka ≥2 sanggah; kuorum 60% else DIBATALKAN; hasil tersembunyi sampai tutup; maks 2 sidang/grup). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 10.8 | LINE-CLINIC-001 | Madevi Line (Inovasi) | PASS | INOVASI-1145 (tabel baru + service/api/UI baru; migration 0047) | Klinik Ide: kritik karya 3 fase BERTANYA→MEMBEDAH→APRESIASI (kind feedback dibatasi per fase, pelanggaran ditolak sistem; template komentar berpemandu; 1 klinik/karya; vote Pilihan Klinik di fase APRESIASI). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 10.9 | LINE-LINEAGE-001 | Madevi Line (Inovasi) | PASS | INOVASI-1245 (tabel baru + service/api/UI baru; migration 0048) | Silsilah Karya: pohon remix (parent_karya_id, anti-siklus, maks 3 tingkat, recursive CTE ke atas/bawah, badge PERTAMA/REMIXED/POPULER/LEGENDA via refresh_karya_badges()). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 10.10 | SHOP-PETITION-001 | Madevi Shop (Inovasi) | PASS | INOVASI-1245 (tabel baru + service/api/UI baru; migration 0049) | Petisi Katalog: usulan produk afiliasi (link harus marketplace resmi Tokopedia/Shopee/Bukalapak/Lazada; vote ≥50 → DIKIRIM ke antrean moderasi pemilik else DITOLAK; maks 3 usulan aktif/user; vote idempoten). Bukti: tsc EXIT 0, 32/32 unit test batch. | blueprint/qa/items/INOVASI-1045-1245-SELESAI.md |
| 11 | DESAIN-V15-001 | Desain | SELESAI | UX-REFINE-001, UX-001 | Migrasi kontrak visual v15 (FIX 2026-10-15, `kontrak-visual/simulasi-madevi-v15.html`) ke project asli dalam 10 fase: tema, header, sidebar, dashboard, shop, artikel reader, AI asisten, footer, bahasa, verifikasi. Nol fitur hilang; data dari project asli. Rencana: `RENCANA-ROMBAK-DESAIN-V15.md`. |

## Hubungan dengan backlog

Agent 1 hanya menambahkan ide baru ke `../memory/BACKLOG.md` sebagai entri tanpa status
implementasi. Agent 5 memeriksa guardrail, dependency, dan kapasitas lock sebelum memindahkan
ide ke tabel ini. Item yang sedang diimplementasikan atau diaudit tidak boleh mendapat
requirement baru di tengah siklus. Agent 5 dapat mempromosikan item independen saat lock lain
aktif bila batas file/data dan dependency tidak bertabrakan.

Rencana baru ditulis sebagai satu hasil per bidang, bukan urutan tahap mikro. Satu item dapat
mencakup seluruh bagian yang saling terkait bila batas file, dependency, dan acceptance criteria
jelas. Pecah hanya untuk hasil independen, lock yang bertabrakan, atau perubahan berisiko/di
luar wewenang. Riwayat ID lama dan auditnya tetap bukti; aturan ini berlaku untuk rencana baru.
Agent 1 terus menyiapkan usul selama runner aktif; Agent 2–5 melanjutkan checkpoint dan item
siap tanpa menunggu arahan teknis baru, selama tidak ada gerbang Owner yang wajib.

## Review gate

Agent 5 membuat ringkasan progres tanpa menghentikan kerja rutin setiap lima item `PASS`.
Eskalasi Owner wajib sebelum batch berikutnya bila salah satu batas berikut tercapai:

- tiga item berturut-turut menyentuh auth, permission, migration, data pribadi, harga, atau
  tindakan destruktif;
- lebih dari 20 file source berubah dalam satu batch; atau
- Agent 4 gagal dua kali pada ID yang sama.

## Fondasi Kerja Muse (18 Okt 2026) — Rencana Fase A

Sumber: perintah Ade 18 Okt 2026 malam. Satu item dalam satu waktu, tanpa paralel.
Branch kerja: `muse/kerja`. Push otomatis ke branch kerja setelah tiap item lulus.

### Fase A1: Perbaiki temuan deploy
| Item | Status | Catatan |
|---|---|---|
| A1-1 | PROSES | Teks loading sesuai lingkungan (lokal/demo online). File: `src/app/loading.tsx` |
| A1-2 | BELUM | Data Explore tampil di Vercel (cek koneksi DB, fallback seed) |
| A1-3 | PASS | Duplikasi "Madevi" header/footer: tidak ada duplikasi visual (logo animasi + sr-only disengaja) |
| A1-4 | PASS | noindex dipertahankan (`robots: index false, follow false` di layout) |

### Fase A2-A5: (menyusul setelah A1)
- A2: Design system tokens + hapus CSS duplikat
- A3: Mesin simulasi terpusat
- A4: Seed data realistis ID
- A5: Navigasi, pencarian, Asisten Madevi

### Fase B: Ruang (urutan)
Explore & Learn → Tutorial & Problem Solve → Madevi School → Tools & Equipment → Madevi Services → Madevi Line
