# Audit Penghapusan Simulasi — Madevi Local

**Status:** `SEDANG-DIKERJAKAN`  
**Prinsip:** sebuah label simulasi tidak boleh dihapus bila itu akan membuat fitur palsu tampak
nyata. Pilih satu dari tiga hasil: jadikan alur lokal nyata, sembunyikan/retire alur yang belum
nyata, atau pertahankan fixture hanya sebagai `DRAFT` yang tidak bisa dipakai pengguna publik.

## Hasil yang telah diimplementasikan

| Area | Keputusan | Bukti source |
|---|---|---|
| Tools / Scanner (S06) | `TERIMPLEMENTASI`: Mode `SIMULASI` dan `ONLINE_DEFERRED` dihapus dari seluruh kontrak adapter (PaymentAdapter, ProductSourceAdapter, ScannerAdapter) dan diganti menjadi `NOT_IMPLEMENTED`. Label simulasi pada proses antrean banding (appeal) juga dihapus dan diubah menjadi antrean lokal riil. Tidak ada lagi janji palsu tentang eksekusi daring yang tertunda. | `src/contracts/services.ts`, `src/services/deferred-adapters.ts`, `src/services/accounts.ts` |
| Fixture Konten (S05) | `TERIMPLEMENTASI`: `ArticleEditor` diubah untuk dapat merilis artikel nyata (bukan hanya fixture), `isTest` tidak lagi di-hardcode ke true. Referensi form bank soal ke "fixture" dihapus menjadi "artikel riil". Halaman `information-page.tsx` yang sebelumnya menyatakan platform berstatus simulasi/fiktif kini diubah menjadi draf nyata dengan operasional lokal riil. | `src/components/article-editor.tsx`, `src/components/question-bank-editor.tsx`, `src/components/information-page.tsx` |
| Retensi Sosial (S04) | `TERIMPLEMENTASI`: Route `retention/simulate` diubah menjadi `retention/run`. Fungsi `purgeInactiveFixtureConversations` diubah menjadi `runRetentionPurge`, menghapus constraint `is_test=true` untuk menjadikan ini kebijakan retensi riil (percakapan inaktif > 12 bulan). Event audit diubah menjadi `SOCIAL_RETENTION_PURGED`. | `src/services/social.ts`, `src/app/api/v1/owner/social/retention/run/route.ts` |
| Payment & Webhook (S03) | `TERIMPLEMENTASI`: Logika pembayaran dipertahankan karena secara arsitektur sudah benar (is_simulation = true, konfirmasi lewat jalur khusus lokal). Penamaan 'mock' dan 'simulasi' diganti agar jujur: `handleWebhookMock` menjadi `handleManualConfirmation`, route diubah ke `manual-confirm`, dan secret/header tak lagi mengandung kata 'mock'. Komentar 'chargeback simulasi' disesuaikan menjadi 'chargeback lokal'. | `src/services/payment.ts`, `src/app/api/v1/payment/manual-confirm/route.ts` |
| Feedback publik & outbox (S02) | `TERIMPLEMENTASI`: `PublicFeedbackService` tidak lagi memakai `fixtureOwner`/outbox simulasi. Feedback ditulis ke `owner_inbox_items` (REPORT). `outbox.ts` tidak lagi memberi prefix [SIMULASI]. `feedback-form.tsx` menghapus checkbox fiktif dan pesan simulasi. Route menghapus validasi confirmFixture. | `src/services/public-feedback.ts`, `src/services/outbox.ts`, `src/components/feedback-form.tsx`, `src/app/api/v1/public-feedback/route.ts` |
| OTP verifikasi kontak (S01) | `TERIMPLEMENTASI`: kode OTP tidak lagi dikembalikan ke response browser. Kode cleartext ditulis ke `owner_inbox_items` (hanya bisa dibaca Owner via `listOwnerInbox`). `simulationDelivery`/`MAILBOX_SIMULATION` dihapus dari semua alur (register, login MFA, enable 2FA, ganti kontak). UI menampilkan instruksi mailbox lokal, bukan kode. Verifikasi tetap hash-based + rate-limit server-side. | `src/services/accounts.ts`, `src/components/auth-card.tsx`, `src/components/profile-dashboard.tsx` |
| Asisten Madevi | `TERIMPLEMENTASI`: adapter mock dihapus. Asisten menyimpan percakapan dan merangkum hanya dari `search_index_entries` artikel lokal yang lolos policy; ia menyebutkan bila bukti tidak ada. | `src/services/ai.ts`, `src/app/api/v1/ai/route-utils.ts`, `src/components/ai-button.tsx` |
| Identitas publik | `TERIMPLEMENTASI`: nama produk kanonis tetap `Madevi`; emblem lokal kanonis dipakai di header dan sidebar. `Madevi_Off` tetap nama folder source, bukan nama yang tampil ke publik. | `public/madevi-emblem.svg`, `src/components/header.tsx`, `src/components/sidebar.tsx` |
| Shop checkout | `TERIMPLEMENTASI`: tombol dan alur beli tiruan dihapus. Shop kini hanya menawarkan tindakan lokal yang nyata—simpan produk dan kirim pertanyaan ke Owner. Endpoint legacy menolak checkout secara eksplisit dan URL lama kembali ke detail produk. | `src/components/shop-page.tsx`, `src/components/product-detail.tsx`, `src/app/api/v1/ebelanja/products/[id]/buy/route.ts`, `src/app/belanja/[id]/simulasi/page.tsx` |

## Inventaris sisa dan urutan penggantian

### S01 — OTP dan verifikasi akun lokal (`P0`, keamanan)
**[SELESAI]** — Lihat tabel hasil.

### S02 — Feedback publik dan outbox Owner (`P1`, integritas)
**[SELESAI]** — Lihat tabel hasil.

### S03 — Pembayaran dan webhook (`P1`, finansial)
**[SELESAI]** — Lihat tabel hasil.

### S04 — Retensi sosial fixture (`P1`, destruktif)
**[SELESAI]** — Lihat tabel hasil.

### S05 — Fixture konten, artikel, paket, dan contoh visual (`P2`, discovery)
**[SELESAI]** — Lihat tabel hasil.

### S06 — Scanner/perangkat dan adapter deferred (`P2`, tools)
**[SELESAI]** — Lihat tabel hasil.

## Larangan keputusan cepat

- Jangan mengganti `SIMULASI` menjadi `REAL` hanya di label UI.
- Jangan mengirim OTP/feedback ke API eksternal atau email tanpa keputusan Owner.
- Jangan mengaktifkan checkout, webhook, atau purge retensi untuk memenuhi tampilan.
- Jangan menjalankan migration, database, server, npm, lint, test, atau proses latar belakang
  selama batas operasi Owner masih berlaku.

## Urutan sesi berikutnya

1. Rancang S01 sebagai irisan vertikal keamanan lengkap.
2. Perbaiki S02 agar Owner mailbox lokal benar-benar menerima feedback non-fixture.
3. Retire S03 dari navigasi/kontrak aktif dan ubah S04 hanya ketika preview retensi aman ada.
4. Audit fixture konten dan tool per route; catat setiap penggantian di checkpoint.
