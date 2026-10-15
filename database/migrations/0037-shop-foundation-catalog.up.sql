-- 0037: Reservasi kompatibilitas katalog Shop.
--
-- Versi awal file ini akan membuat produk PUBLISHED yang seluruh detail
-- mitra, harga, dan URL belinya belum terverifikasi. Migrasi tersebut belum
-- pernah diterapkan dan tidak boleh menambah katalog atau alur afiliasi palsu
-- ke database lokal. Katalog hanya boleh diisi lewat workflow Owner setelah
-- sumber, harga, status mitra, dan tindakan pengguna benar-benar tersedia.
--
-- File tetap dipertahankan sebagai no-op agar urutan migrasi historis stabil.
SELECT 1;
