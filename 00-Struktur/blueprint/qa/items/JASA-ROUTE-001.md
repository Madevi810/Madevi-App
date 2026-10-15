# Item QA: JASA-ROUTE-001

**Area:** Fitur/Route  
**Dependensi:** `ROUTE-FIX-001`  

## Masalah dan Kebutuhan

`INVENTARIS-HALAMAN.md` menetapkan rute `/jasa/undangan/order` sebagai tempat pengguna mengisi formulir pemesanan undangan. Namun, berkas sumber (source) `src/app/jasa/undangan/order/page.tsx` saat ini diimplementasikan sebagai `PrivateOrderViewer` yang menggunakan `?token=` untuk melacak pesanan yang sudah ada. Fungsi pelacakan (tracking) ini juga mencakup pesanan Logo, yang tidak relevan dengan hirarki URL `/undangan`.

Kebutuhan:
1. Pindahkan `PrivateOrderViewer` ke rute yang lebih netral dan kanonis untuk fungsi pelacakan: `/jasa/tracking`.
2. Hapus direktori `jasa/undangan/order` yang ada dan ganti dengan rute statis/form pesanan (sementara bisa berupa stub UI atau form nyata jika sudah ada) pada `/jasa/undangan/order/page.tsx` sesuai *blueprint*.
3. Perbarui `INVENTARIS-HALAMAN.md` jika diperlukan untuk merefleksikan perubahan rute `/jasa/tracking`.

## Batas modifikasi (Lock)

- `src/app/jasa/undangan/order/page.tsx`
- `src/app/jasa/tracking/page.tsx` (rute baru)
- `blueprint/produk/INVENTARIS-HALAMAN.md`
- Dokumen QA terkait

*(Dilarang mengubah API `jasa` maupun skema basis data dalam cakupan tugas ini.)*

## Acceptance criteria wajib

- [ ] AC-01 — Direktori rute `src/app/jasa/tracking/page.tsx` berhasil dibuat dan berisi `PrivateOrderViewer` untuk menangani fungsi *tracking* pesanan Undangan dan Logo via parameter query `?token=`.
- [ ] AC-02 — Rute `src/app/jasa/undangan/order/page.tsx` diubah menjadi halaman pembuatan pesanan undangan (seperti judul "Pesan Undangan Baru") dan tidak lagi bertindak sebagai *viewer* token.
- [ ] AC-03 — Metadata SEO pada rute `/jasa/tracking` tetap diatur sebagai `robots: { index: false, follow: false }` karena berisi informasi privat.
- [ ] AC-04 — `INVENTARIS-HALAMAN.md` telah diperbarui dengan mencatatkan `/jasa/tracking` sebagai halaman pemantauan pesanan privat, serta `/jasa/undangan/order` tetap dijaga batasannya sebagai form pemesanan.

## Acceptance criteria terukur

| ID | Unit | Metode | Ambang | Hasil |
|---|---:|---|---:|---|
| M-01 | Rute Tracking | Inspeksi `tracking/page.tsx` | URL kanonis pemantauan memanggil komponen `PrivateOrderViewer` | belum |
| M-02 | Form Undangan | Inspeksi `undangan/order/page.tsx` | Tidak ada pemanggilan/injeksi `token` untuk `PrivateOrderViewer` pada page ini | belum |
| M-03 | Inventaris | Inspeksi `INVENTARIS-HALAMAN.md` | Memuat referensi eksklusif ke `/jasa/tracking` | belum |

## Verifikasi yang diizinkan

Pemeriksaan sintaks TSX/TypeScript, pembandingan batas berkas. Runtime tidak diperlukan untuk memverifikasi lokasi berkas statis rute.
