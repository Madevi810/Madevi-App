# Rencana Workflow dan Policy Content Packet 0039

Dokumen ini memetakan arsitektur operasi, lifecycle, dan policy server untuk fitur Content Packet (berdasarkan rancangan schema `0039-content-packets-discovery-and-safety.sql`). Ini merupakan prasyarat sebelum schema diterapkan pada database produksi/lokal.

## 1. Arsitektur Data & Lifecycle

Content Packet memungkinkan artikel digabungkan sebagai satu "edisi" (packet) di bawah sebuah "keluarga" (family).
Lifecycle entitas (Artikel, Packet) bergerak melalui tiga status utama:
1. **DRAFT:** Pembuatan konten dasar, penambahan claim & evidence, penyusunan blok teks, serta penempatan pada facet/taxonomy.
2. **REVIEW_REQUESTED (PENDING):** Artikel yang telah siap dinaikkan statusnya. Jika memiliki profil keamanan tingkat `CONTROLLED` atau `STOP`, wajib melewati pemeriksaan dari sisi *Safety*. Hak cipta (*Rights*) dan substansi (*Editorial*) juga diverifikasi pada fase ini.
3. **PUBLISHED (ACTIVE):** Dapat diakses oleh pembaca reguler (publik). Alias aktif bekerja, relasi (*content_relations*) mengarah pada konten terbit ini.

## 2. Policy Server: Keamanan & Hak Akses (R7 Safety)

Profil keamanan (`article_safety_profiles`) sangat krusial bagi ruang Tutorial & Problem Solve (R7):
- **GENERAL:** Risiko rendah. Dapat dipublikasikan langsung atau dengan review Editorial biasa.
- **CONTROLLED:** Mengandung panduan teknis yang butuh perlengkapan (mis. kelistrikan, bahan kimia). **Server Policy:** Tidak dapat berstatus `PUBLISHED` kecuali `article_review_records` untuk tipe `SAFETY` tercatat `APPROVED` oleh Owner (atau principal dengan otorisasi Owner).
- **STOP:** Artikel ini bukan instruksi teknis penuh, melainkan batas peringatan ("Jangan lakukan ini, hubungi profesional"). **Server Policy:** Wajib memuat `professional_escalation` dan juga harus lolos verifikasi *Safety*.

## 3. Workflow Owner (Konsol Admin)

### 3.1. Manajemen Content Family & Packet
1. Owner membuat `content_family` (mis. "Panduan Perbaikan Kendaraan Dasar").
2. Owner membuat `content_packet` berstatus `DRAFT` di bawah family tersebut (mis. Edisi 2026).
3. Artikel-artikel di-assign ke packet ini melalui tabel `article_packets`.

### 3.2. Penanganan Claim & Evidence
1. Penulis (atau AI Asisten pada saat draft) memasukkan `article_claims`.
2. Setiap claim yang bertipe `SYNTHESIS`, `INTERPRETATION`, atau `INSTRUCTION` idealnya memiliki rujukan `article_claim_evidence`.
3. Reviewer dapat menandai `review_status` menjadi `CHALLENGED` jika bukti tidak valid.

### 3.3. Dashboard Review (Antrean)
Konsol Admin harus memiliki layar *Review Dashboard* yang membaca `article_review_records` dengan status `REQUESTED`:
- Menampilkan tab: *Editorial*, *Safety*, *Rights*, *Technical*.
- Owner dapat melihat dokumen artikel, membandingkan profil keselamatan (mis. alat yang dibutuhkan, stop conditions).
- Aksi: `APPROVE` atau `REJECT` (mengisi `reviewed_by`, `reviewed_at`, dan `note`).

### 3.4. Rilis (Publish)
Hanya setelah semua status review berlabel `APPROVED` (untuk yang membutuhkannya), Owner dapat mengubah status Packet / Artikel menjadi `PUBLISHED`.

## 4. Mitigasi Risiko & Recovery
- Jika ditemukan kesalahan pasca rilis, Owner atau Pembaca dapat membuat `article_corrections`.
- Artikel dapat diturunkan statusnya secara sepihak oleh Owner jika koreksi `SAFETY` dilaporkan.
- Alias URL (`article_aliases`) memastikan link lama tidak rusak/menghasilkan 404 ketika slug artikel diperbarui.

## 5. Langkah Implementasi Selanjutnya
1. Laksanakan migrasi database `0039`.
2. Integrasikan CRUD *Content Family*, *Content Packet*, dan *Safety Profile* pada `/api/v1/owner/content`.
3. Bangun *Review Dashboard* di `owner-console.tsx` dengan memanfaatkan permission Owner.
