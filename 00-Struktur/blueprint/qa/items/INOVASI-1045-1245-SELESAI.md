# INOVASI-1045 + INOVASI-1145 + INOVASI-1245 — SELESAI

Batch 6 ide inovasi dari 3 file lampiran (0945 selesai di batch sebelumnya).

## Ringkasan 6 ide

| # | Ide | Sumber | Ruang | Status |
|---|-----|--------|-------|--------|
| 1 | Giliran Dengar | INOVASI-1045 IDE 1 | Madevi Line | SELESAI (statis) |
| 2 | Duel Produk | INOVASI-1045 IDE 2 | Madevi Shop | SELESAI (statis) |
| 3 | Sidang Warga | INOVASI-1145 IDE 1 | Madevi Line (grup) | SELESAI (statis) |
| 4 | Klinik Ide | INOVASI-1145 IDE 2 | Madevi Line (karya) | SELESAI (statis) |
| 5 | Silsilah Karya | INOVASI-1245 IDE 1 | Madevi Line (karya) | SELESAI (statis) |
| 6 | Petisi Katalog | INOVASI-1245 IDE 2 | Madevi Shop | SELESAI (statis) |

## 1. Giliran Dengar (INOVASI-1045 IDE 1)

Sesi curhat berbasis giliran: pembicara bicara, pendengar hanya merespons
dengan REFLEKSI/SEMANGAT. SARAN baru diizinkan setelah pembicara
mengaktifkan "Saya butuh saran".

**Logika kunci:**
- `assertResponseAllowed()` — SARAN ditolak selama `needs_advice=false`
  (dipaksa di service layer, bukan hanya UI).
- Maks 12 pendengar per sesi (`LISTEN_MAX_LISTENERS`).
- Rate limit: 20 respons/jam per user.
- Sesi anonim opsional (bawaan INSTRUKSI-03).

**File:**
- `src/services/listen.ts` — service layer (433 lines)
- `src/app/api/v1/line/listen/route.ts` — GET list + POST create
- `src/app/api/v1/line/listen/[id]/responses/route.ts` — GET detail + POST respons
- `src/app/api/v1/line/listen/[id]/join/route.ts` — POST gabung pendengar
- `src/app/api/v1/line/listen/[id]/needs-advice/route.ts` — POST toggle saran
- `src/components/listen-turn.tsx` — UI (inline, anti-popup)
- Migrasi: `0044-listen-turn.up.sql` / `.down.sql` (`listen_sessions`,
  `listen_session_listeners`, `listen_responses`)

## 2. Duel Produk (INOVASI-1045 IDE 2)

Komparasi head-to-head 2 produk afiliasi sejenis: kartu pro/kontra per
produk yang diisi komunitas + vote produk pilihan dengan alasan wajib.

**Logika kunci:**
- `isValidVoteReason()` — alasan vote minimal 30 karakter (mendorong vote
  beralasan, bukan asal pilih).
- `isValidDuelPoint()` — kartu pro/kontra minimal 20 karakter.
- Vote sekali per user; pemenang ditentukan setelah duel berakhir.
- Deteksi vote mencurigakan (bursts dalam 5 menit dari 1 user > 10 vote).

**File:**
- `src/services/duel.ts` (452 lines)
- `src/app/api/v1/ebelanja/route-utils.ts` — factory bersama (duel + petition)
- `src/app/api/v1/ebelanja/duels/route.ts` — GET list + POST create
- `src/app/api/v1/ebelanja/duels/[id]/route.ts` — GET detail (publik)
- `src/app/api/v1/ebelanja/duels/[id]/points/route.ts` — POST pro/kontra
- `src/app/api/v1/ebelanja/duels/[id]/vote/route.ts` — POST vote + alasan
- `src/components/duel-compare.tsx`
- Migrasi: `0045-duel.up.sql` / `.down.sql` (`product_duels`, `duel_points`,
  `duel_votes`)

## 3. Sidang Warga (INOVASI-1145 IDE 1)

Protokol musyawarah formal 3 fase untuk grup Line: TANYA (klarifikasi) →
SANGGAH (argumen kontra wajib) → VOTING anonim berkuorum → keputusan
tercatat permanen.

**Logika kunci:**
- `allowedArgumentKinds(phase)` — kind argumen dibatasi per fase aktif
  (dipaksa server-side). Fase VOTING: tidak ada argumen.
- `canOpenVoting()` — voting tidak boleh dibuka sebelum ≥2 argumen
  SANGGAH tercatat (anti ruang gema).
- `makeVoterHash()` — suara anonim via HMAC(secret, user:session); 1 suara
  per anggota (UNIQUE).
- `quorumMet()` — partisipasi < kuorum (default 60%) → DIBATALKAN.
- Hasil vote hanya ditampilkan setelah voting ditutup (anti-bandwagon).
- Maks 2 sidang aktif per grup.
- Timer fase simulasi: TANYA 24 jam, SANGGAH 24 jam, VOTING 48 jam.

**File:**
- `src/services/sidang.ts` (532 lines)
- `src/app/api/v1/line/sidang/route.ts` — GET list (per groupId) + POST ajukan
- `src/app/api/v1/line/sidang/[id]/route.ts` — GET detail
- `src/app/api/v1/line/sidang/[id]/arguments/route.ts` — POST argumen
- `src/app/api/v1/line/sidang/[id]/advance/route.ts` — POST maju fase
- `src/app/api/v1/line/sidang/[id]/vote/route.ts` — POST suara anonim
- `src/components/sidang-warga.tsx`
- Migrasi: `0046-sidang-warga.up.sql` / `.down.sql` (`sidang_sessions`,
  `sidang_arguments`, `sidang_votes`)

## 4. Klinik Ide (INOVASI-1145 IDE 2)

Protokol kritik karya 3 fase: BERTANYA (hanya pertanyaan) → MEMBEDAH
(hanya saran konstruktif berpola) → APRESIASI (vote Pilihan Klinik +
komentar bebas).

**Logika kunci:**
- `allowedFeedbackKind(phase)` — BERTANYA→PERTANYAAN, MEMBEDAH→SARAN,
  APRESIASI→APRESIASI. Pelanggaran DITOLAK sistem (bukan dihapus admin).
- `phaseGuidanceMessage()` — pesan panduan saat melanggar fase.
- `CLINIC_TEMPLATES` — template komentar berpemandu per fase (sekali-klik,
  opsional; mendorong partisipasi tanpa mental block).
- 1 klinik aktif per karya; hanya pemilik karya yang bisa memajukan fase.
- Rate limit: 15 feedback/jam per user.

**File:**
- `src/services/clinic.ts` (425 lines)
- `src/app/api/v1/line/clinic/route.ts` — GET list + POST buka klinik
- `src/app/api/v1/line/clinic/[id]/route.ts` — GET detail
- `src/app/api/v1/line/clinic/[id]/feedback/route.ts` — POST feedback
- `src/app/api/v1/line/clinic/[id]/advance/route.ts` — POST maju fase
- `src/app/api/v1/line/clinic/[id]/vote/route.ts` — POST vote Pilihan Klinik
- `src/components/klinik-ide.tsx`
- Migrasi: `0047-klinik-ide.up.sql` / `.down.sql` (`clinic_sessions`,
  `clinic_feedback`, `clinic_votes`)

## 5. Silsilah Karya (INOVASI-1245 IDE 1)

Pohon remix karya: post KARYA bisa ditandai sebagai remix dari karya lain;
lineage graph divisualisasikan sebagai pohon nested; badge otomatis.

**Logika kunci:**
- `wouldCreateCycle()` — anti-siklus (cek chain ke atas sebelum insert).
- `buildLineageTree()` — bangun pohon dari baris datar (PURE, unit-testable).
- Maks 3 tingkat remix (`LINEAGE_MAX_DEPTH`) — mencegah lineage sangat dalam.
- `badgesForRemixCount()` — PERTAMA/REMIXED (≥1)/POPULER (≥3)/LEGENDA (≥10).
- `refresh_karya_badges()` — fungsi DB trigger untuk badge.
- Parent harus KARYA PUBLISHED; hanya pemilik yang bisa menandai remix.

**File:**
- `src/services/lineage.ts` (367 lines)
- `src/app/api/v1/line/karya/route.ts` — GET list + POST set parent
- `src/app/api/v1/line/karya/[id]/lineage/route.ts` — GET pohon
- `src/app/api/v1/line/karya/[id]/parent/route.ts` — DELETE hapus parent
- `src/components/silsilah-karya.tsx`
- Migrasi: `0048-silsilah-karya.up.sql` / `.down.sql`
  (`social_posts.parent_karya_id`, `karya_lineage`, `karya_badges`)

## 6. Petisi Katalog (INOVASI-1245 IDE 2)

Pengguna mengusulkan produk afiliasi untuk masuk katalog Shop; usulan
divote; yang mencapai target masuk antrean moderasi pemilik.

**Logika kunci:**
- `isValidMarketplaceLink()` — link harus dari marketplace resmi
  (Tokopedia/Shopee/Bukalapak/Lazada) — konsisten dengan aturan "katalog
  harus SAMA PERSIS dengan marketplace aslinya, tidak boleh mengarang".
- `petitionOutcome()` — vote ≥ target (default 50) → DIKIRIM ke antrean
  moderasi pemilik; < target → DITOLAK.
- Maks 3 usulan aktif per user; 1 usulan aktif per user per nama produk.
- Vote idempoten (UNIQUE petition_id + voter_id).

**File:**
- `src/services/petition.ts` (310 lines)
- `src/app/api/v1/ebelanja/petitions/route.ts` — GET list + POST usul
- `src/app/api/v1/ebelanja/petitions/[id]/vote/route.ts` — POST dukung
- `src/app/api/v1/ebelanja/petitions/[id]/outcome/route.ts` — POST tutup (admin)
- `src/components/petisi-katalog.tsx`
- Migrasi: `0049-petition.up.sql` / `.down.sql` (`product_petitions`,
  `petition_votes`)

## Integrasi UI (tetap 7 ruang)

- Tab grup "Kolaborasi" di dashboard Line bertambah 4 tab: Giliran Dengar,
  Sidang Warga, Klinik Ide, Silsilah Karya.
- Shop page bertambah 2 section: Duel Produk + Petisi Katalog.
- **Tidak ada ruang ke-8** (sesuai aturan keras).
- CSS: block `.listen-turn`, `.duel-compare`, `.sidang-warga`, `.klinik-ide`,
  `.silsilah`, `.petisi` di `src/styles/social-redesign.css` (1867 lines).
- Semua aksi inline (form, tombol) — tidak ada popup/modal (Prinsip UI).

## Verifikasi (INSTRUKSI-02 — statis saja)

- `tsc --noEmit`: **EXIT=0**
- `vitest run` full suite: **15/15 file, 197 lulus, 5 skipped, EXIT=0**
  (di-exclude: prompt03-behavior (hang, K-02), prompt04-ui, invitation-order-form
  (pre-existing, JASA-PORT-001) — lihat KNOWN-ISSUES)
- Unit test batch ini: `innovation-1045-1245.test.ts` — **32/32 lulus**
  (pure function coverage: assertResponseAllowed, isValidVoteReason,
  allowedArgumentKinds, canOpenVoting, quorumMet, makeVoterHash,
  allowedFeedbackKind, buildLineageTree, wouldCreateCycle,
  badgesForRemixCount, isValidMarketplaceLink, petitionOutcome)

## Tindakan runtime untuk Muse

1. Jalankan migrasi: `node scripts/migrate.mjs up` — 0044 sampai 0049
   (0041–0043 dari batch sebelumnya juga masih tertunda).
2. Setelah migrasi: verifikasi tabel `listen_sessions`,
   `product_duels`, `sidang_sessions`, `clinic_sessions`, `karya_lineage`,
   `product_petitions` ada di DB.
3. Tes klik manual: tab Kolaborasi di dashboard Line + section Duel/Petisi
   di Shop.
