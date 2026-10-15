# INOVASI-0841+0940 — Rencana 4 ide (catatan pra-coding)

Sesuai INOVASI-20261014-0841.md: "Catat tiap implementasi di Madevi-Control
SEBELUM coding (tujuan, alur, desain — maks 15 baris per item)".
Status saat ini: INSTRUKSI-03 Line Protection 6/6 SELESAI + tsc bersih + 22/22
unit test lulus. Migrasi 0041 (post_type/reason_category/is_anonymous) sudah
ditulis, menunggu Muse menjalankannya.

## LINE-CALM-001 — "Zona Tenang" (INOVASI-0841 IDE 1, ruang Line)
Tujuan: mode baca anti-engagement — feed tanpa like/counter/badge, kronologis murni.
Alur: toggle inline di header Line → state `calmMode` (login: preferensi DB;
tamu: localStorage `madevi_calm_mode`) → feed render `CalmPostCard` (isi, penulis,
waktu + baris kecil "Laporkan · Kirim semangat" tanpa angka). Filter 7 ruang tetap.
Desain: ketenangan dari KETIADAAN elemen; tanpa popup/animasi; ikon daun inline.

## LINE-KINDNESS-001 — "Peta Kebaikan" (INOVASI-0841 IDE 2, ruang Line)
Tujuan: kontra-narasi positif berbasis bukti — kebaikan nyata per kota.
Alur: tabel `kindness_report` (judul ≤500 char, kota dropdown, kategori, anonim,
status ANTRI/TAYANG/DITOLAK) → filter kata + antrean admin reuse INSTRUKSI-03 →
peta SVG Indonesia (50 kota statis, pin per kota) + daftar terbaru + panel inline
per kota. Tanpa alamat detail, tanpa ranking antar-kota (alfabetis).
Desain: SVG murni tanpa library peta eksternal; semua inline.

## LINE-STORY-001 — "Dongeng Bareng" (INOVASI-0940 IDE 1, ruang Line)
Tujuan: cerita fiksi bersambung bergiliran — alasan member kembali tiap hari.
Alur: `story_threads` + `story_chapters` (migrasi 0042) → API buat utas, ajukan
bab (maks 300 kata, 1 ajuan aktif/user/utas), vote (idempoten), kanonisasi
mingguan (MAX vote → KANON; tie → bab lebih awal; lainnya ARSIP), Laporkan reuse
INSTRUKSI-03. Job mingguan = simulasi cron berlabel jujur.
Desain: buku digital — serif untuk isi, pemisah bab angka romawi; semua inline.

## SHOP-BUNDLE-001 — "Bundel Ongkir Tetangga" (INOVASI-0940 IDE 2, ruang Shop)
Tujuan: patungan ongkir sekota — hambatan beli jadi fitur sosial.
Alur: `shipping_bundles` + `bundle_items` (migrasi 0043) → bentuk bundel (kota
dari daftar), gabung (tolak jika PENUH/double-slot sekota), kalkulator hemat
SIMULASI dari tabel tarif statis admin, auto-close saat 5 orang, keluar sebelum
penuh. Tidak ada uang lewat Madevi — checkout tetap di marketplace masing-masing.
Desain: kartu bundel (sisa slot 3/5, estimasi hemat angka besar); koordinasi via
inbox Line yang sudah ada; semua inline.

Urutan kerja: LINE-CALM-001 → LINE-KINDNESS-001 → LINE-STORY-001 → SHOP-BUNDLE-001.
Verifikasi: tsc + vitest saja (INSTRUKSI-02 — tanpa runtime).
