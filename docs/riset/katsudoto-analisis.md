# Analisis Mendalam: Katsudoto.id — Layanan Undangan Pernikahan Digital

**Tanggal riset:** 18 Oktober 2026
**Sumber:** katsudoto.id (homepage, /undangan-website, /undangan-lite, /desain, /about-us), panduan.katsudoto.id (dokumentasi lengkap), hasil pencarian web
**Tujuan:** Referensi untuk porting fitur undangan digital ke project Madevi (ruang Services/Jasa)

---

## Ringkasan

Katsudoto.id adalah platform undangan pernikahan digital Indonesia yang berdiri sejak **14 Oktober 2018** (nama dari Bahasa Jepang "katsu" = menang). Saat ini mengklaim melayani **10.467+ undangan website**, **1.512+ buku tamu digital**, **5.732+ wedding planner**, dan total ~17.600+ customer di dalam dan luar negeri (AS, Belanda, Jerman, Jepang, Malaysia, Singapura, dll).

Ada **3 produk utama** dalam satu platform:
1. **Undangan Website** (Premium) — undangan digital full fitur
2. **Undangan Website Lite** — Rp100.000 flat, fitur dasar
3. **Digital Guestbook** (Buku Tamu Digital) — sistem check-in tamu di hari H
4. **Wedding Planner** — perencana pernikahan (budget, to-do, vendor, dll)

Semua produk dikelola dari satu **Smart Dashboard** per akun.

---

## Fitur Utama

### A. Undangan Website (Premium)

**Kustomisasi desain:**
- Pilih template dari kategori: Semua, Populer, Adat, Floral, Fairytale, Minimalis, Nature, Vintage
- Semua desain bisa dipakai tanpa tambahan biaya
- Bebas ubah warna, font, susunan/section tanpa batasan
- Konsultasi desain dengan tim via WhatsApp

**Konten undangan (diatur dari Smart Dashboard):**
1. **Cover + Cover Pembuka** — halaman sampul sebelum tamu membuka isi undangan; nama tamu personal bisa ditampilkan di cover (`?to=nama_tamu`)
2. **Informasi Mempelai** — detail kedua mempelai + orang tua
3. **Informasi Acara** — nama acara, tanggal, jam, detail lokasi + tombol Google Maps
4. **RSVP** — konfirmasi kehadiran dengan batas akhir (deadline) yang bisa diatur
5. **RSVP+** (fitur add-on) — pertanyaan custom lanjutan: pilihan menu makanan/minuman, kebutuhan akomodasi
6. **Galeri** — foto prewedding + video dokumentasi
7. **Cerita Cinta (Love Story)** — timeline kisah perjalanan pasangan
8. **Hadiah (Amplop Digital)** — dua kategori: transfer rekening bank + dompet digital, plus opsi kirim kado fisik (alamat pengiriman)
9. **Live Streaming** — embed link live streaming dari berbagai platform agar tamu yang tidak hadir tetap bisa menonton
10. **Filter Instagram** — link filter IG (bisa lebih dari satu) untuk dipakai tamu
11. **Ucapan Pernikahan (Wedding Wish)** — buku tamu/ucapan yang tampil di undangan
12. **Rundown Acara** (fitur add-on) — jadwal lengkap dari akad sampai resepsi
13. **Custom Loading** (fitur add-on) — splash screen dengan logo/inisial pasangan saat undangan dibuka
14. **Countdown timer** — hitung mundur ke hari H (terkonfirmasi dari kompetitor sejenis; di Katsudoto tidak disebut eksplisit di halaman yang diakses)

**Manajemen tamu (Kelola Tamu):**
- **3 cara tambah tamu:** (1) manual via dashboard, (2) impor file (Excel/CSV), (3) bagikan form link agar calon tamu mengisi sendiri (data otomatis masuk dashboard)
- **Grup tamu** — kategorisasi tamu
- **Sesi acara** — pembagian sesi (mis. akad vs resepsi)
- **Batas pax RSVP per undangan** — limit jumlah orang per undangan
- **Smart WhatsApp** — kirim undangan ke banyak tamu sekaligus dari dashboard; template pesan WA bisa dikustomisasi (Custom Template WhatsApp)
- **RSVP Tracking** — pantau status kehadiran real-time
- **Reminder RSVP** — pengingat otomatis ke tamu yang belum konfirmasi
- **Auto Wedding Day Reminder** — pengingat otomatis di hari H ke tamu yang sudah konfirmasi hadir
- **Statistik** — data siapa membuka undangan, berapa kali dibuka, status kirim

### B. Digital Guestbook (Buku Tamu Digital)

Sistem check-in tamu di hari acara, terpisah dari undangan website:

1. **QR Check-in** — tiap tamu punya QR code; scan saat kedatangan, data tercatat real-time
2. **3 cara registrasi check-in:** scan QR code, cari nama tamu, tambah tamu manual (onsite)
3. **Selfie Check-in** — tamu bisa selfie saat check-in (pengalaman berkesan)
4. **Auto Thank You Message** — pesan terima kasih otomatis setelah check-in
5. **Layar Sapa (Greeting Screen)** — layar display di venue menyapa tamu yang baru check-in
6. **Table Management** — atur tempat duduk/denah meja tamu
7. **Souvenir Management** — atur dan pantau distribusi souvenir ke tamu
8. **E-Invitation** — undangan elektronik terintegrasi guestbook
9. **Print Penomoran Hadiah** — cetak nomor untuk hadiah/doorprize
10. **Doorprize** — manajemen undian hadiah
11. **Pesan Reminder & Thank You** — kirim pesan lanjutan ke tamu
12. **App Penerima Tamu** — aplikasi khusus untuk petugas penerima tamu (usher) dengan:
    - Kelola akses petugas (tambah daftar penerima tamu, atur login mereka)
    - Statistik buku tamu, souvenir, table management
    - Riwayat check-in
    - WO Tracking (pantauan wedding organizer)
    - Hybrid Mode (kombinasi online/offline)
13. **Keamanan:** minim sentuhan fisik, identifikasi kategori tamu, data akurat real-time

### C. Wedding Planner

Perencana pernikahan dalam dashboard:

1. **Budget Planner** — rencanakan dan pantau anggaran pernikahan detail
2. **To-Do List** — susun dan pantau persiapan hingga detail terkecil
3. **Rundown** — susun jadwal acara
4. **Seserahan** — daftar barang seserahan + kisaran biaya + sumber pembelian
5. **Seragam** — data penerima seragam pernikahan
6. **Tabungan Nikah** — target tabungan bersama pasangan
7. **Vendor List** — tambah dan bandingkan vendor, pilih yang sesuai
8. **Administrasi** — dokumen/administrasi pernikahan

### D. Fitur Pendukung Platform

- **Smart Dashboard** — satu dashboard untuk semua produk
- **Kelola Akun** — ubah profil, password; halaman **Tagihan** (invoice belum dibayar, riwayat pembayaran, jatuh tempo); pengaturan **Notifikasi**
- **Upgrade Paket** — upgrade kapan saja + tambah fitur add-on
- **Panduan lengkap** — dokumentasi GitBook (panduan.katsudoto.id) + video tutorial Google Drive per fitur
- **Program Mitra/Referral** — komisi 15% (hingga Rp600rb), tanpa minimum followers, tanpa deposit, penarikan dari dashboard
- **Undangan Event** — varian untuk acara non-pernikahan
- **Konsultasi via WhatsApp** — tim support responsif

---

## Alur User (User Journey)

### Alur Pembelian (dari panduan resmi)

1. **Landing** di katsudoto.id/undangan-website → klik "Daftar" / "Buat Undangan"
2. **Isi data awal:** nama kamu + pasangan, judul undangan, tanggal pernikahan, tahap persiapan
3. **Isi info akun:** email + nomor WhatsApp (sistem cek duplikat — tidak boleh sama dengan yang sudah terdaftar)
4. **Verifikasi OTP** via email → klik "Verifikasi" (bisa kirim ulang)
5. **Akun berhasil dibuat** → isi form detail pernikahan: alamat venue, estimasi jumlah tamu (bisa diubah nanti di dashboard)
6. **Pilih paket + fitur add-on** → klik "Beli Sekarang"
7. **Pembayaran:** bisa pakai kode voucher/referral → klik "Bayar" → diarahkan ke payment gateway (kartu kredit, transfer bank, e-wallet). **Invoice berlaku 1x24 jam.**
8. Setelah bayar → akses penuh Smart Dashboard terbuka

### Alur Pembuatan Undangan (setelah bayar)

1. **Pilih template** dari galeri desain (kategori: Adat, Floral, Fairytale, Minimalis, Nature, Vintage)
2. **Kustomisasi:** ubah warna, font (typography), susunan section
3. **Isi konten bertahap:** info mempelai → info acara → RSVP (atur deadline) → cerita cinta → galeri (foto/video) → hadiah/ amplop digital → live streaming link → filter IG → rundown → ucapan
4. **Kelola tamu:** tambah manual / impor file / sebar form link → buat grup → atur sesi → atur pax
5. **Kirim undangan:** via Smart WhatsApp (broadcast sekaligus, template pesan bisa dikustom)
6. **Pantau:** RSVP tracking real-time, statistik buka undangan, kirim reminder ke yang belum RSVP
7. **Hari H:** Auto wedding day reminder terkirim; guestbook QR check-in berjalan via App Penerima Tamu; layar sapa menyambut tamu
8. **Setelah acara:** kirim thank you message; unduh rekap data

### Alur Tamu (penerima undangan)

1. Terima link WA personal (`nama.katsudoto.id` atau `katsudoto.id/nama?to=Tamu`)
2. Buka → cover pembuka dengan nama tamu → klik buka undangan (custom loading muncul)
3. Baca: info mempelai, detail acara + maps, countdown, galeri, love story, rundown
4. Isi RSVP (+ RSVP+ bila ada: pilih menu, akomodasi) sebelum deadline
5. Tulis ucapan di wedding wish
6. Lihat info amplop digital bila ingin memberi hadiah
7. Hari H: tunjukkan QR → check-in → selfie → terima ucapan terima kasih otomatis

---

## Model Bisnis

### Paket yang terverifikasi

| Paket | Harga | Fitur |
|---|---|---|
| **Undangan Lite** | **Rp100.000 flat** | Fitur dasar: info acara, galeri, RSVP; template terbatas tapi modern; self-service via dashboard; proses kilat; bisa upgrade ke Premium kapan saja |

### Paket Premium — harga TIDAK terverifikasi
Harga paket Premium **tidak dipublikasikan** di halaman yang bisa diakses (kemungkinan via konsultasi WA atau setelah login). Yang terverifikasi:
- Sistem **paket + fitur add-on** (RSVP+, Custom Loading, Rundown Acara bisa dibeli terpisah)
- **Upgrade paket** kapan saja
- **Kode voucher & referral** didukung
- **Invoice 1x24 jam**, payment gateway (kartu kredit, transfer bank, e-wallet)
- Ada halaman Tagihan untuk invoice & riwayat bayar

### Produk lain — harga tidak terverifikasi
- Digital Guestbook dan Wedding Planner kemungkinan dijual terpisah atau sebagai add-on; harga tidak ditemukan di halaman publik.

### Model bisnis ringkas
- **Sekali bayar** (bukan langganan) — konsisten dengan Lite Rp100rb flat
- **Upsell:** Lite → Premium upgrade; fitur add-on (RSVP+, Custom Loading, Rundown)
- **Akuisisi:** program mitra referral 15% komisi; testimoni influencer (banyak content creator/artis sebagai social proof)
- **Diferensiasi:** positioning premium ("desain bukan pasaran", "made by expert"), bukan perang harga termurah

### Konteks pasar (dari kompetitor)
- Kompetitor sejenis: Rp25rb–155rb sekali bayar (mengundang.co.id, harikita.id, kartukenangan.id, festa.id)
- Katsudoto Lite Rp100rb berada di segmen menengah-atas; kompetitor termurah mulai Rp25rb

---

## Kelebihan

1. **Ekosistem lengkap 3 produk** — undangan + guestbook + planner dalam satu akun/dashboard; kompetitor umumnya hanya undangan.
2. **Guestbook onsite sangat matang** — QR check-in, selfie check-in, layar sapa, table & souvenir management, app khusus usher dengan role akses, WO tracking, hybrid mode. Ini pembeda utama.
3. **Smart WhatsApp** — broadcast + template kustom + reminder RSVP otomatis + wedding day reminder; alur distribusi dipikirkan end-to-end.
4. **Manajemen tamu fleksibel** — 3 cara input (manual, impor, form publik), grup, sesi acara, batas pax per undangan.
5. **RSVP+** — kuesioner lanjutan (menu, akomodasi) langsung di undangan; berguna untuk katering/logistik.
6. **Dokumentasi luar biasa lengkap** — panduan GitBook per fitur + video tutorial; mengurangi beban support.
7. **Social proof kuat** — 17rb+ customer, testimoni influencer/artis, peta sebaran internasional.
8. **Desain positioning premium** — "bukan template pasaran", bebas ubah warna/font/susunan.
9. **Program mitra** — 15% komisi, tanpa deposit/follower minimum; channel akuisisi murah.
10. **Upgrade path jelas** — Lite → Premium; add-on modular.

## Kelemahan

1. **Harga Premium tidak transparan** — calon pembeli harus konsultasi WA dulu; menambah friksi dibanding kompetitor yang pajang harga jelas.
2. **Registrasi berat di awal** — wajib daftar akun + OTP email + isi banyak form sebelum tahu harga paket; risiko drop-off tinggi.
3. **Ketergantungan WhatsApp manual** — konsultasi desain dan "diskusi di WA" berarti sentuhan manusia; sulit scale dan bukan self-service penuh (bertentangan dengan klaim Lite yang self-service).
4. **Contoh undangan tidak bisa dibuka** — subdomain contoh (imazreza, neidadhika, dll) me-redirect ke homepage saat diakses (kemungkinan expired/dihapus); calon pembeli tidak bisa melihat produk nyata.
5. **Risiko vendor lock-in** — data tamu, RSVP, dan undangan hidup di platform mereka; tidak disebut fitur export data tamu.
6. **Fitur add-on terfragmentasi** — RSVP+, Custom Loading, Rundown dijual terpisah; total cost of ownership tidak jelas di muka.
7. **Tidak ada uji coba gratis** — kompetitor (harikita, bacaunduh) kasih free trial/preview sebelum bayar; Katsudoto langsung ke pembelian.
8. **Guestbook butuh perangkat & petugas sendiri** — paket enterprise kompetitor menyertakan tablet/modem/usher; di Katsudoto (berdasar panduan) app + akses yang disediakan, perangkat dari panitia.

---

## Rekomendasi Porting ke Madevi

Prinsip Ade: porting dengan karakter berbeda, bukan sama persis; kalau bisa lebih baik dari aslinya. Semua pembayaran Madevi = simulasi jujur (sesuai strategi prototype).

### Fitur yang diadopsi (prioritas tinggi)

1. **Builder undangan bertahap** — alur isi konten step-by-step (mempelai → acara → RSVP → galeri → hadiah → live streaming). Di Madevi sudah ada fondasi order undangan; lengkapi menjadi wizard form + live preview.
2. **Template multi-kategori** — Adat (Jawa, Minang, dll), Floral, Minimalis, Nature, Vintage + kustomisasi warna/font/susunan. Madevi: buat 2 template per paket (sesuai visi Ade: 1 paket = 2 template), tiap template beda karakter kuat.
3. **RSVP + RSVP+** — konfirmasi hadir dengan deadline + pertanyaan custom (menu, akomodasi). Ini nilai jual katering; wajib ada.
4. **Amplop digital** — rekening + e-wallet + QRIS + opsi kirim kado fisik. Versi Madevi: tambah **rekap amplop** untuk mempelai.
5. **Manajemen tamu 3 cara** — manual, impor Excel/CSV, form publik. Plus grup tamu, sesi acara, batas pax.
6. **Broadcast WhatsApp** — template pesan kustom + kirim sekaligus + reminder RSVP otomatis. (Di Madevi sebagai simulasi: generate link WA `wa.me` per tamu.)
7. **Galeri + love story timeline + countdown + maps + musik latar** — paket standar undangan digital; wajib ada semua.
8. **Cover personal (`?to=nama_tamu`)** — nama tamu di cover = kesan eksklusif dengan biaya teknis nol.
9. **QR check-in guestbook (versi ringan)** — tanpa app usher dulu; cukup halaman scan QR + pencarian nama + tandai hadir, real-time via dashboard. Ini pembeda vs kompetitor murah.
10. **Rundown acara di undangan** — tampilkan jadwal di halaman undangan (di Katsudoto ini add-on berbayar; di Madevi jadikan **gratis** = keunggulan).

### Dibuat lebih baik dari aslinya

| Aspek | Katsudoto | Madevi (diusulkan) |
|---|---|---|
| Transparansi harga | Harga premium disembunyikan | Semua paket + harga jelas di halaman, tanpa harus chat admin |
| Coba sebelum bayar | Tidak ada | Mode preview/draft gratis; bayar (simulasi) saat publish |
| Registrasi | Wajib akun + OTP sebelum lihat harga | Jelajahi template & buat draft tanpa akun; akun hanya saat publish |
| Contoh nyata | Subdomain contoh mati/redirect | Galeri contoh undangan yang selalu hidup + bisa diklik |
| Export data | Tidak disebut | Export tamu/RSVP/ucapan ke Excel/CSV kapan saja, gratis |
| Rundown | Add-on berbayar | Termasuk gratis di semua paket |
| Bahasa & aksesibilitas | Indonesia saja | Indonesia + Inggris (Madevi sudah bilingual id/en) |
| Privasi tamu | Tidak disebut | Opsi undangan ber-password / link privat per grup tamu |
| Integrasi planner | Produk terpisah (kemungkinan bayar lagi) | Wedding planner (budget, to-do, vendor) terintegrasi dalam satu paket undangan |

### Tidak diadopsi (tahap awal)
- App Penerima Tamu native + role usher + WO tracking + hybrid mode (berat; cukup web check-in responsif dulu)
- Layar sapa venue (butuh hardware di lokasi)
- Table & souvenir management detail (bisa tahap 2)
- Program mitra referral (tahap monetisasi nanti)

### Struktur data yang disarankan (untuk implementasi)
- `invitation_orders` (sudah ada di Madevi) + tabel: `invitation_guests` (nama, WA, grup, sesi, pax, status RSVP, jawaban RSVP+), `invitation_rsvp` (log konfirmasi), `invitation_greetings` (ucapan/wedding wish), `invitation_checkins` (QR check-in log), `invitation_templates` (katalog template + kategori + config warna/font default)
- Slug publik: `/undangan/[slug]` (sudah ada per visi Ade) + query `?to=` untuk nama tamu personal
- Dashboard: tab Kelola Tamu | RSVP Tracking | Broadcast WA | Galeri | Hadiah | Pengaturan Desain | Check-in H-1

---

**Catatan verifikasi:** Harga paket Premium, harga Digital Guestbook, harga Wedding Planner, dan masa aktif undangan **tidak ditemukan** di halaman publik katsudoto.id (tidak terverifikasi). Semua klaim fitur di atas berasal dari halaman resmi dan panduan resmi mereka. Data kompetitor (harga Rp25rb–155rb) berasal dari situs kompetitor, bukan Katsudoto.
