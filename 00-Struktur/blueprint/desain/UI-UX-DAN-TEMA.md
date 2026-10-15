# Blueprint Desain — UI/UX, Tema, dan Motion

## Kontrak yang diwariskan

- Light adalah kanvas putih/netral dan Dark adalah black-on-black/netral. Keduanya memakai token
  semantik dan tidak menerima wash warna kosmik.
- Madevi On adalah identitas lebih ekspresif: black/plum, amethyst/amber, starfield/meteor, dan
  glass hanya pada chrome atau panel sementara. Kolom artikel tetap padat dan stabil.
- Nama produk adalah **Madevi**. Treatment wordmark dapat bergerak, tetapi tidak mengubah nama,
  ukuran layout, atau accessibility name.
- Motion lintas tema bersifat opt-in, memakai transform/opacity, dapat dibatalkan, dan tunduk
  pada reduced motion. Route artikel tidak boleh menyembunyikan teks atau bergeser saat dibaca.

## Acceptance desain lintas ruang

1. Pada 320px, 375px, 768px, 1024px, dan desktop, tidak ada scroll horizontal atau control
   yang saling menutup.
2. Header, sidebar, search modal, popup, dropdown, dan focus ring memakai z-layer yang jelas.
3. Semua control sentuh minimal 44px bila konteks memungkinkan; label tetap dapat dibaca/wrap.
4. State loading, empty, error, locked, dan success bukan sekadar perbedaan warna.
5. Tidak ada animasi yang membuat konten utama tidak terbaca tanpa fallback final no-JS/reduced-motion.

## Referensi yang dipertahankan

- `../../memory/DECISIONS.md` — keputusan visual dan trade-off yang telah diambil.
- `../../memory/CHANGELOG.md` D03–D09 — perubahan source yang telah terjadi.
- `../../memory/TEST-REPORT.md` — hanya bukti verifikasi yang benar-benar ada.

Item audit berikutnya: `UX-001` di `../INDEX.md`.

## Rencana lanjutan pengalaman pengguna

Rencana terperinci untuk pembaca artikel (ukuran teks, TTS, mode baca), galeri template,
form pemesanan, halaman undangan terbit, serta pola UX ruang lainnya ada di
[`RENCANA-PENGALAMAN-ARTIKEL-UNDANGAN-DAN-RUANG.md`](RENCANA-PENGALAMAN-ARTIKEL-UNDANGAN-DAN-RUANG.md).
Dokumen itu adalah usulan perencanaan berbasis inventaris/spesifikasi; tidak membuka lock
atau menambah cakupan item aktif.

## UX-REDESIGN-001 — Arahan Owner 2026-09-25

Scope Owner terbaru menggantikan arah visual UX-001-REV1 yang bertentangan. Struktur,
urutan, label, link, dan logika expand/collapse sidebar dikunci; styling boleh
berubah. Artikel dan halaman Admin tetap tenang; tidak ada entrance teks atau
meteor berjalan ketika membaca artikel. Semua motion berhenti total pada
`prefers-reduced-motion: reduce`.

Madevi On memakai starfield shell publik, meteor dengan jeda acak 3,5–7 detik
per jalur, blur-text sekali saat elemen non-bacaan memasuki viewport, dan
wordmark Home yang bergerak sekali. Header/sidebar memakai identitas statis.
Glass dibatasi pada chrome dan panel sementara. Basic Light/Dark memakai
tipografi editorial, panel berbatas tipis, dan entrance section singkat tanpa
blur atau atmosfer. Kartu kerja generik tidak memakai hover transform; desain
radius, border, icon, dan bayangan mengikuti peran komponen.

API backend tetap mengikuti kontrak yang ada. Bila sebuah kebutuhan UI kelak
memerlukan data baru, Agent harus membuktikan kebutuhan dan strategi kompatibilitas
sebelum perubahan backend. Detail acceptance dan batas file ada di
`../qa/items/UX-REDESIGN-001.md`.
