# Riset Lintas Ruang (19 Okt 2026)

Pola yang berlaku di SEMUA ruang Madevi.

## 1. Bahasa Indonesia yang Wajar
**Sumber**: Kok Bisa?, Zenius, Hipwee, Alodokter, pajak.go.id
**Prinsip**: Tulis seperti menjelaskan ke teman. Hindari istilah internal ("baris seed", "entitas", "agregasi").
**Aturan**: Setiap konten melewati cek "apakah ibu saya paham?".

## 2. Mobile-First
**Sumber**: Data HP Ade (Galaxy A54), mayoritas pengguna Indonesia via HP.
**Prinsip**: Desain untuk layar 360px dulu. Tabel → kartu di mobile. Form satu kolom.
**Aturan**: Tidak ada hover-only interaction; semua bisa disentuh.

## 3. Simulasi Jujur
**Sumber**: Aturan #17, pola fintech sandbox.
**Prinsip**: Label "Simulasi" yang tenang, bukan banner mengganggu. Status berubah nyata di DB.
**Aturan**: Data dummy tidak disajikan sebagai nyata. Tokoh fiktif tidak meniru orang nyata.

## 4. Tidak Ada Interupsi
**Sumber**: Aturan #20-22.
**Prinsip**: Tanpa popup/modal/animasi otomatis. Semua tampil atas aksi user.
**Aturan**: Animasi hanya feedback aksi. Tanpa bottom navigation.

## 5. Aksesibilitas Dasar
**Sumber**: WCAG 2.1 AA (disederhanakan).
**Prinsip**: Kontras cukup, bisa keyboard, aria-label di interaktif, alt bermakna.
**Aturan**: Cek tiap item baru.

## 6. Aset Visual Orisinal
**Sumber**: Aturan #13.
**Prinsip**: Buat sendiri (SVG prosedural, CSS, generator). Jangan tiru orang/logo/karya.
**Aturan**: Simpan di public/, alt bermakna, catat "dibuat Muse" di INDEX.md.

## 7. Keamanan Konten
**Sumber**: Alodokter (disclaimer), brosur obat (kontraindikasi), Line (moderasi).
**Prinsip**: Topik kesehatan/hukum/teknis = akurat dan hati-hati. Ada disclaimer.
**Aturan**: Jangan mengarang fakta. Rujuk sumber bila perlu.

## 8. Konsistensi Design System
**Sumber**: docs/DESIGN-SYSTEM.md, tokens.css.
**Prinsip**: Pakai token dan komponen yang ada. Jangan buat CSS baru bila tidak perlu.
**Aturan**: Komponen baru hanya di ui-components.css.

## 9. SEO Bertahap
**Sumber**: Praktik umum.
**Prinsip**: noindex sampai launching. Setelah itu: metadata per halaman, sitemap, struktur heading.
**Aturan**: Jangan buka index sebelum konten mencapai lantai.

## 10. Performa
**Sumber**: Target HP menengah Indonesia.
**Prinsip**: Halaman < 3 detik di 4G. Gambar dioptimalkan. Hindari JS berat.
**Aturan**: Cek build tiap item; perhatikan bundle size.
