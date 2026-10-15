# Arsitektur Atlas Pengetahuan & Jalur Praktik Madevi

**Status:** `DIRENCANAKAN / KANONIS UNTUK PENGEMBANGAN BERIKUTNYA`  
**Ruang:** R2 Explore & Learn dan R7 Tutorial & Problem Solve  
**Versi:** 1.1 · 2026-09-24  
**Batas operasi:** dokumen ini hanya rencana. Tidak ada taxonomy, artikel, migration, atau data aktif yang dipromosikan.

## Keputusan inti

Madevi tidak akan menjadi salinan ensiklopedia, katalog tag, atau kumpulan artikel panjang dengan susunan bab yang sama.

- **Explore adalah Atlas Madevi:** pengguna menelusuri hubungan, skala, perubahan, bukti, dan pertanyaan untuk memahami dunia.
- **Tutorial & Problem Solve adalah Jalur Praktik Madevi:** pengguna mengenali keadaan, melewati batas keselamatan, memilih tindakan, memeriksa hasil, atau berhenti dan eskalasi untuk menyelesaikan kebutuhan nyata.

Keduanya berbagi sumber, taxonomy, pencarian, dan relasi; tetapi tidak berbagi bentuk artikel, bahasa navigasi, atau alur pengguna. Artikel Explore dapat menjelaskan cara kerja baterai. Panduan Tutorial dapat menunjuk penjelasan itu sebagai latar konsep tanpa menyalin tulisan dan tanpa menyamar sebagai prosedur perbaikan yang sudah aman diterbitkan.

## 1. Model skala: pohon navigasi + graf pengetahuan

Pohon taxonomy hanya menjawab **di mana pengguna masuk dan kembali**. Ia harus stabil, dangkal, dan dapat dibaca manusia. Graf pengetahuan menjawab **apa yang terhubung dengan apa**. Ia dapat tumbuh sangat besar.

```text
Pohon navigasi (satu rumah)              Graf pengetahuan (banyak hubungan)
Ruang → Domain → Kelompok → Fokus → Rak  Artikel ↔ konsep ↔ objek ↔ peristiwa ↔ panduan
```

Satu artikel memiliki satu rumah taxonomy utama. Ia dapat memiliki banyak facet dan relasi. Aturan ini mencegah artikel yang sama ditulis ulang di empat cabang hanya untuk muncul di lebih dari satu menu.

### Kedalaman kanonis source saat ini

```text
R  Ruang        — Explore atau Tutorial
D  Domain       — wilayah besar yang dipahami pengguna
K  Kelompok     — keluarga topik atau keluarga kebutuhan
M  Fokus        — konteks, mekanisme, atau situasi yang lebih spesifik
T  Rak          — daun navigasi tempat artikel yang relevan dikumpulkan
Artikel         — data konten yang menempel pada satu node, bukan level taxonomy baru
```

Kode ini internal; pengguna melihat nama manusiawi. Jangan menambah level `S`, `J`, atau cabang bebas tanpa migration, validator, kontrak paket, dan keputusan. Sinonim, tipe artikel, usia, status, tag, atau kata kunci bukan node; gunakan alias, facet, atau metadata.

### Aturan kapasitas

- Root ruang menampilkan paling banyak 9–14 domain. Jika lebih, kelompokkan berdasarkan prinsip yang dapat dijelaskan, bukan grid puluhan kartu.
- Daftar node maupun judul tetap dipaginasi cursor. Jangan memuat seluruh pohon atau seluruh artikel ke browser.
- Jika satu kelompok memiliki lebih dari sekitar 24 anak yang benar-benar berbeda, pecah menurut skala, sistem, fungsi, atau tahap. Jika hanya sinonim, buat alias pencarian.
- Leaf dapat memiliki jutaan artikel. Query artikel membawa cursor, urutan, facet, dan konteks jalur.
- Slug dan business code stabil. Perubahan path menghasilkan alias agar tautan, pencarian, dan riwayat tidak putus.

### Facet dan relasi, bukan menu tambahan

Facet Explore: bentuk pengetahuan, skala, waktu, lokasi, organisme, metode, tingkat kepastian, dan bahasa. Facet Tutorial: maksud tindakan, gejala/keadaan, risiko, alat, waktu, tingkat keterampilan, dan hasil akhir.

Relasi minimal: `BAGIAN_DARI`, `MEMENGARUHI`, `MENYEBABKAN`, `MENGGUNAKAN`, `MENGAMATI`, `MENGUJI`, `BERTENTANGAN_DENGAN`, `LATAR_KONSEP_UNTUK`, `PRASYARAT_UNTUK`, `ALTERNATIF_AMAN`, dan `BANTUAN_PROFESIONAL`. Setiap relasi harus memiliki arah, alasan, lifecycle, dan provenance; ia bukan tag dekoratif.

## 2. Peta akar Explore — Atlas Madevi (R2)

Ini blueprint revisi multi-root berikutnya, bukan klaim node aktif. Domain R2 yang sudah aktif—`sains-alam`, `teknologi-digital`, dan `bahasa-komunikasi`—dipertahankan sebagai path. Perluasan tidak boleh meretire mereka hanya demi perubahan nama.

| Kode rencana | Domain tampilan | Contoh kelompok (K) | Prinsip masuk |
|---|---|---|---|
| R2.D1 | Sains Alam | materi & energi; gerak; pola; pengamatan | memahami gejala alam dan modelnya |
| R2.D2 | Kosmos, Bumi & Iklim | langit; bintang/galaksi; planet; bumi; cuaca/iklim | bergerak dari skala lokal sampai kosmik |
| R2.D3 | Kehidupan, Evolusi & Keanekaragaman | sel/DNA; bakteri/virus; organisme; ekosistem; klasifikasi | menghubungkan bentuk hidup, proses, dan kekerabatan |
| R2.D4 | Tubuh, Indra & Kesehatan Publik | anatomi; sistem tubuh; perkembangan; kesehatan populasi | pengetahuan, bukan diagnosis atau tindakan medis |
| R2.D5 | Teknologi Digital | komputasi; jaringan; perangkat; keamanan; data/AI | fungsi, batas, dan dampak teknologi |
| R2.D6 | Rekayasa, Benda & Energi Terapan | mesin; bahan; konstruksi; listrik sebagai konsep; transportasi | menjelaskan sistem buatan tanpa menggantikan panduan keselamatan |
| R2.D7 | Pikiran, Perilaku & Psikologi | persepsi; belajar; emosi; keputusan; relasi sosial | bukti, batas studi, dan variasi manusia |
| R2.D8 | Bahasa, Komunikasi & Penalaran | membaca; menulis; bahasa; media; logika | bagaimana makna dibangun dan diuji |
| R2.D9 | Sejarah, Peradaban & Perubahan | zaman; peristiwa; penemuan; migrasi; perubahan sosial | lintasan waktu, bukti, dan banyak sudut pandang |
| R2.D10 | Masyarakat, Negara, Ekonomi & Kerja | institusi; hukum sebagai informasi; pekerjaan; pertukaran; kota | sistem sosial tanpa nasihat personal tanpa dasar |
| R2.D11 | Budaya, Agama, Kepercayaan & Kitab | tradisi; teks; ritual; seni budaya; perbandingan sumber | hormat, plural, membedakan fakta, tafsir, dan keyakinan |
| R2.D12 | Seni, Desain & Cipta | gambar; musik; cerita; bentuk; desain | proses, bahasa karya, dan konteks budaya |
| R2.D13 | Penemuan, Metode & Bukti | pengamatan; eksperimen; arsip; data; perdebatan | cara manusia mengetahui dan memperbaiki pengetahuan |

Setiap domain Explore memiliki peta masuk, kelompok inti yang dapat dipindai, jalur lintas-domain, rak artikel cursor, dan pintu tindakan ke Tutorial bila kebutuhan pengguna berubah dari memahami menjadi mengerjakan.

## 3. Peta akar Tutorial — Jalur Praktik Madevi (R7)

Tujuh domain R7 yang telah diputuskan tetap menjadi akar awal. Nama dan slug tidak diubah oleh rencana ini; penambahan domain hanya boleh terjadi setelah ada bukti bahwa satu domain tidak lagi dapat dipahami atau dioperasikan dengan aman.

| Kode | Domain | Contoh kelompok (K) | Risiko awal |
|---|---|---|---|
| R7.D1 | Rumah, Listrik & Instalasi | penerangan/perangkat; air & sanitasi; ventilasi; pintu/permukaan; penghematan | `CONTROLLED` untuk listrik bertegangan, struktur, gas, atau instalasi |
| R7.D2 | Kendaraan & Motor | pemeriksaan awal; roda/ban; kelistrikan rendah; perawatan; mobilitas ringan | `CONTROLLED`; rem, bahan bakar, ban rusak, dan keselamatan jalan punya stop condition |
| R7.D3 | Perangkat Digital & Elektronik | HP; komputer; TV/audio; jaringan rumah; data/perangkat lunak | `GENERAL` sebelum bongkar/tegangan, lalu `CONTROLLED` |
| R7.D4 | Dapur & Rumah Tangga | persiapan; memasak; penyimpanan; kebersihan; peralatan rumah | `GENERAL` dengan jalur khusus gas, api, bahan kimia, dan pangan |
| R7.D5 | Karya & DIY | ide; bahan; potong/rakit; cetak; kerajinan; prototipe | naik risiko untuk panas, mata pisau, bahan kimia, atau alat listrik |
| R7.D6 | Kerja & Peralatan | setup kerja; peralatan tangan; pengukuran; dokumen; alur usaha lokal | `CONTROLLED` untuk mesin, beban, listrik, atau APD |
| R7.D7 | Perawatan & Kehidupan Sehari-hari | pakaian; barang rumah; kebiasaan; organisasi; komunitas | `GENERAL`; bukan diagnosis medis atau layanan darurat |

Di atas pohon R7 ada empat pintu maksud yang ringkas: **Perbaiki/cari penyebab**, **Buat/pasang**, **Rawat/cegah**, dan **Pilih/gunakan**. Ini adalah facet query, bukan domain baru atau halaman kosong. Hasil selalu menunjukkan rumah taxonomy utamanya agar pengguna tidak kehilangan konteks.

## 4. Format Madevi, bukan template ensiklopedia

### Aturan editorial bersama

- Artikel dimulai dari pertanyaan atau keadaan pengguna, bukan salinan heading situs lain. Judul menjanjikan lingkup yang benar-benar dapat dipenuhi.
- Sumber adalah bukti dan bahan riset, bukan bentuk tulisan. Klaim penting harus dapat ditelusuri pada source dossier lokal; parafrase, alur, dan contoh ditulis dengan komposisi Madevi sendiri.
- Tidak ada susunan wajib “pengertian → sejarah → jenis → kesimpulan”. Profil dipilih menurut persoalan. Artikel tanpa perubahan waktu tidak diberi timeline hanya demi template.
- Kutipan, gambar, tabel, dan klasifikasi pihak lain hanya dipakai ketika hak pakai, atribusi, dan batas kutip jelas. Jangan mengimpor teks, taxonomy, atau struktur data web lain 1:1.
- Setiap artikel memberikan satu arah lanjut yang jujur: lanjut memahami, bandingkan bukti, lihat hubungan, coba tindakan aman, atau cari bantuan profesional.

### Profil komposisi Explore

| Profil Madevi | Untuk | Alur baca |
|---|---|---|
| **Peta Fenomena** | sistem, proses, sebab-akibat | fokus → batas peta → cara kerja → jejak bukti → sambungan → pertanyaan lanjut |
| **Jejak Perubahan** | sejarah, evolusi, penemuan | titik awal → potongan waktu → titik balik → rekam/bukti → dampak kini → jalur lain |
| **Makhluk & Kekerabatan** | organisme, takson, mikroba, ekosistem | identitas kerja → ciri pembeda → relasi hidup → lingkungan → perubahan → batas pengetahuan |
| **Benda & Sistem Buatan** | alat, teknologi, infrastruktur, artefak | kebutuhan → bagian/sistem → trade-off → penggunaan/dampak → konteks lanjut |
| **Gagasan & Perdebatan** | teori, psikologi, agama, budaya, filsafat | pertanyaan inti → lensa berbeda → bukti/teks → titik setuju-tidak setuju → cara membaca adil |
| **Metode & Bukti** | eksperimen, data, arsip, cara mengetahui | pertanyaan → cara mengamati → apa yang diukur → batas/ketidakpastian → kesimpulan layak |
| **Orang, Tempat & Karya** | tokoh, lokasi, karya, komunitas | posisi/konteks → jejak terperiksa → hubungan → pengaruh → sumber dan sengketa bila ada |

### Profil komposisi Tutorial

| Profil Madevi | Untuk | Alur tindakan |
|---|---|---|
| **Diagnosis Jalur** | masalah dengan banyak kemungkinan penyebab | keadaan awal → batas aman → bukti → cabang keputusan → tindakan minimum → verifikasi/eskalasi |
| **Tindakan Lurus** | tindakan dengan urutan stabil | hasil yang dituju → siap/batas → tindakan → cek hasil → rawat atau ulangi |
| **Bangun Karya** | membuat atau merakit | tujuan karya → rancangan/material → titik ukur → proses tahap → uji fungsi → catatan perbaikan |
| **Rawat Berkala** | pencegahan dan pemeliharaan | objek/kondisi → interval berbukti → pemeriksaan → keputusan kecil → catatan perubahan → batas eskalasi |
| **Pilih & Siapkan** | memilih barang, metode, atau setup | kebutuhan → kriteria → opsi/trade-off → keputusan → setup awal → evaluasi penggunaan |
| **Stop & Eskalasi** | kondisi berbahaya atau di luar kemampuan lokal | tanda berhenti → tindakan aman segera → data yang dibawa → bantuan sesuai; tanpa langkah berisiko |

“Peta”, “jejak”, “sambungan”, dan “jalur” dirender sebagai komposisi blok aman yang sudah didukung source (`PARAGRAPH`, `TABLE`, `NOTE`, `QUOTE`, `IMAGE`, `STEP`, dan lain-lain), bukan HTML bebas. Profil membentuk pengalaman baca tanpa memaksa semua artikel tampak sama.

## 5. Kontrak data dan penerbitan

### Yang sudah ada dan harus dipertahankan

- `articles` sudah memiliki rumah taxonomy tunggal, lifecycle, slug, summary, bahasa, attribution, versi, dan sumber.
- `article_blocks` sudah aman dan berurutan; format Madevi dapat dirender sebagai komposisi blok lokal.
- `article_sources` sudah memuat organisasi/penulis, tanggal, URL, lisensi media, dan status tautan.
- Browser taxonomy sudah memakai `?path=`, breadcrumb, error/retry, dan cursor. Jangan membuat route per tag atau state client yang hilang saat reload.

### Migration source 0039 — disiapkan, belum diterapkan

`database/migrations/0039-content-packets-discovery-and-safety.*.sql` adalah proposal
schema Gelombang B yang sudah ditulis tetapi tetap `PENDING / TIDAK-DIJALANKAN`.
Ia tidak membuat data, taxonomy, atau artikel terbit.

1. **Packet dan edisi:** `content_families` memberi `canonical_key` stabil serta
   supersession; `content_packets` mengikat tepat satu artikel draf/edisi dengan ruang,
   profil, dossier, claim map, hak pakai, freshness, handoff, dan quality gate.
2. **Facet terkelola:** registry/value/assignment memaksa nilai tervalidasi dan memasangkan
   value kepada definisinya; tidak ada tag bebas dari client.
3. **Relasi dan alias:** `content_relations` membawa target artikel, taxonomy, atau family
   dengan alasan/lifecycle; `article_aliases` memelihara alamat lama secara eksplisit.
4. **Claim/evidence ledger:** setiap claim dapat menunjuk block dan satu atau lebih
   `article_sources`, beserta peran bukti, kepastian, review, dan tanggal cek ulang.
5. **Safety/review R7:** profile menyimpan `GENERAL`/`CONTROLLED`/`STOP`, prasyarat,
   alat, APD, stop condition, recovery, eskalasi, dan status review Owner. `CONTROLLED`
   wajib menandai review Owner; approval membutuhkan reviewer dan waktu review.
6. **Koreksi pembaca:** kategori `SAFETY`, `RIGHTS`, dan `DISCOVERY` ditambah tanpa
   menghapus kategori lama.

Lifecycle artikel lama tetap kanonis. Packet tidak menggantikan `articles.status`; policy
server berikutnya harus mengizinkan publikasi Tutorial hanya setelah packet/safety/review
yang relevan lolos. Artikel lama tanpa packet tetap dapat dibaca agar migration kompatibel.
Data ini tidak boleh disimpan sementara di `owner_notes` atau JSON client. Setiap migration
memerlukan audit permission dan tidak dijalankan selama batas Owner melarang operasi database.

### Alur produksi Madevi

```text
Usulan kebutuhan → source dossier lokal + hak pakai → pilih rumah taxonomy + profil Madevi
→ tulis komposisi asli berbasis claim → validasi struktur/sumber/alias/risiko
→ AUTO_CHECK atau review sesuai level → APPROVED/PUBLISHED → koreksi, relasi, dan pembaruan
```

R7 `CONTROLLED` tidak boleh melewati review Owner. R7 `STOP` tidak menjadi prosedur. Explore yang menyentuh kesehatan, hukum, keuangan, agama, atau sejarah kontroversial harus menyimpan evidence ledger dan batas yang proporsional; perbedaan tafsir tidak boleh disamarkan sebagai fakta tunggal.

### Identitas, edisi, dan supersession konten

Judul bukan identitas teknis. Untuk menghindari artikel ganda saat koleksi dan bahasa bertumbuh, setiap artikel memerlukan `content_family_id` dan `canonical_key` yang stabil; slug hanya alamat yang dapat memiliki alias. Terjemahan, penyederhanaan untuk pembaca berbeda, atau pembaruan besar adalah **edisi** dari keluarga konten bila menjawab pertanyaan inti yang sama. Jika lingkup atau klaimnya berubah material, buat keluarga baru dan relasikan secara eksplisit.

Aturan perubahan:

- Perbaikan ejaan, tautan, atau tata letak membuat revisi kecil dan tidak mengganti alamat kanonis.
- Koreksi fakta membuat event koreksi dengan klaim terdampak, alasan, sumber baru, dan tanggal.
- Artikel yang dibagi, digabung, dipindahkan, atau ditarik tidak menghilang: ia memiliki `superseded_by`, alias atau redirect jujur, serta alasan yang dapat dibaca pengguna.
- Peristiwa dan riwayat dapat mempertahankan edisi lama sebagai konteks; konten berubah cepat menampilkan `as_of` dan status freshness, bukan diperlakukan sebagai fakta abadi.
- Registry konsep atau objek dibuat hanya untuk hubungan lintas-artikel yang memang membutuhkan ID stabil. Jangan membuat entitas untuk setiap kata benda dalam teks.

Target status editorial di atas lifecycle data yang sudah ada:

```text
PROPOSED → DOSSIER_READY → DRAFT → REVIEW → APPROVED → PUBLISHED
                                             ↘ CORRECTION_PENDING
PUBLISHED → SUPERSEDED / ARCHIVED
```

Ini adalah kontrak target yang harus dipetakan kompatibel ke lifecycle schema saat migration dirancang; ia bukan izin mengubah status database sekarang. `PUBLISHED` berarti dapat dibaca, bukan berarti semua klaim sama kuat. Kematangan sumber, risiko, dan freshness adalah metadata yang terpisah dari status publikasi.

### Source dossier, claim map, dan quality gate

Satu daftar sumber di akhir artikel tidak cukup untuk koleksi ilmiah, sejarah, budaya, atau panduan berisiko. Setiap artikel menyimpan dossier lokal yang memisahkan sumber primer, otoritatif, sekunder, dan kontekstual; hak pakai; bahasa; tanggal akses; alasan relevansi; serta status link. Claim map menghubungkan klaim atau blok penting dengan bukti, jenis klaim, tingkat kepastian, dan catatan perbedaan sumber.

Jenis claim minimal: `OBSERVATION`, `REFERENCE`, `SYNTHESIS`, `INTERPRETATION`, dan `INSTRUCTION`. Inferensi agent diberi penanda sebagai sintesis, bukan disamarkan sebagai kutipan. Konflik sumber dicatat sebagai hubungan atau catatan sengketa, bukan dipaksa menjadi satu narasi seolah-olah selesai.

| Kelas konten | Gate minimum sebelum publikasi | Gate tambahan |
| --- | --- | --- |
| Explore umum yang stabil | struktur, dossier, claim map proporsional, hak pakai, pemeriksaan duplikasi | review editorial bila cakupan atau ketidakpastian tinggi |
| Explore sensitif atau diperdebatkan | semua gate umum | review Owner/domain dan representasi perspektif yang adil |
| Tutorial `GENERAL` | tujuan, prasyarat, verifikasi hasil, batas/escalation, sumber | review prosedur bila dampak salah langkah berarti |
| Tutorial `CONTROLLED` | semua gate `GENERAL` | review Owner wajib, safety profile, stop condition, APD/izin bila relevan |
| Tutorial `STOP` | bukan prosedur | hanya tanda bahaya, tindakan aman segera, dan arah bantuan |

Tidak ada jumlah target yang membenarkan melewati dossier, claim map, atau review. Pemeriksaan otomatis hanya memeriksa struktur dan konsistensi; ia tidak menggantikan bukti atau review risiko.

### Paket konten dan handover agent

Unit kerja terkecil yang dapat disimpan, diperiksa, dan diteruskan kepada agent lain adalah **Content Packet**, bukan daftar judul. Satu packet memiliki ID dan memuat:

```text
brief masalah pembaca + batas lingkup + rumah taxonomy + profil Madevi
canonical key/family + bahasa/edisi + intent/facet awal + relasi yang diusulkan
source dossier + hak pakai + claim map + outline/blok komposisi asli
safety/freshness/review matrix + acceptance checklist + status lifecycle
catatan keputusan, risiko terbuka, titik lanjut, dan riwayat perubahan
```

Agent boleh menyiapkan `PROPOSED`, `DOSSIER_READY`, atau `DRAFT` yang jelas, tetapi tidak menyebut packet sebagai artikel terbit sebelum gate terpenuhi. Saat konteks atau kuota agent habis, packet menyimpan fakta terakhir, sumber yang telah diperiksa, keputusan belum selesai, dan langkah kecil berikutnya sehingga agent pengganti tidak memulai dari nol atau menulis ulang isi.

### Freshness, koreksi, dan laporan pembaca

Setiap artikel mempunyai policy freshness: `STABLE` untuk recheck ketika ada bukti baru, `CHECK_PERIODIC` untuk tanggal cek yang ditentukan dossier, atau `VOLATILE` yang wajib memakai `as_of` dan prioritas cek lebih tinggi. Data berubah seperti aturan, harga, perangkat lunak, kesehatan publik, dan statistik tidak boleh diperlakukan seperti konsep fisika dasar.

Laporan pembaca tidak langsung mengubah artikel. Ia membuat antrean lokal dengan kategori `ERROR`, `OUTDATED`, `SAFETY`, `RIGHTS`, atau `DISCOVERY`; lalu ditautkan ke claim/block dan ditriase. Koreksi yang diterima meninggalkan jejak perubahan. Tidak ada telemetry isi bacaan atau riwayat pencarian yang dikumpulkan tanpa kebutuhan dan persetujuan lokal yang jelas.

## 6. UI untuk skala besar

### Explore

1. Breadcrumb satu baris kecil; heading kiri menjelaskan batas domain secara singkat.
2. Root menampilkan domain, bukan kartu hero besar atau seluruh cabang pohon.
3. Setelah path dipilih, anak taxonomy tampil lebih dahulu, lalu rak artikel ber-cursor. Facet dan relasi adalah filter/jalur samping, bukan pohon kedua.
4. Peta hubungan hanya merender relasi yang benar-benar ada dari data; tidak ada graph dekoratif atau node fiktif.

### Tutorial

1. Breadcrumb kecil, heading yang menyatakan objek/tujuan, lalu empat pintu maksud sebagai kontrol query berukuran target sentuh layak.
2. Kartu panduan hanya menampilkan fakta operasional yang tersedia: tujuan, risiko tekstual, prasyarat, alat, estimasi bila bersumber, dan status review.
3. Safety gate berada sebelum langkah. Bila data belum terbit, UI menyatakan belum tersedia dan memberi jalur kembali/cari berbeda—bukan checklist rekaan.
4. Back/Forward, reload, dan tautan langsung memulihkan path serta filter melalui URL; konten panjang tidak diletakkan di sidebar.

### Pembaca artikel Madevi

Halaman artikel mengikuti prinsip ruang yang ringkas: breadcrumb kecil, judul/fungsi di kiri, deskripsi atau janji lingkup pendek, lalu strip fakta yang hanya menampilkan metadata nyata seperti status, `as_of` bila perlu, risiko Tutorial, dan batas lingkup. Tubuh artikel memakai profil komposisi yang dipilih; ia bukan tumpukan card seragam atau heading ensiklopedia.

- Claim penting dapat membawa penanda sumber yang membuka konteks bukti tanpa memutus alur baca.
- Artikel Explore menampilkan sambungan konsep/bukti bila relasinya nyata; artikel Tutorial menampilkan prasyarat, stop condition, verifikasi hasil, dan eskalasi sebelum atau di sekitar langkah yang relevan.
- Artikel panjang menawarkan daftar bagian dari heading yang benar-benar ada dan navigasi kembali ke rak atau hasil sebelumnya; tidak memaksa sidebar global menjadi daftar isi.
- Status DRAFT, REVIEW, tidak tersedia, atau superseded tidak boleh disamarkan dengan layout artikel terbit. Tautan alternatif menjelaskan alasan dan tujuan berikutnya.

### Kontrak discovery dan pencarian lokal

Skala besar memerlukan discovery selain pohon. Pencarian lokal memproses istilah melalui nama kanonis, alias/sinonim terkelola, bahasa, jenis ruang, facet, dan konteks path. Urutan hasil harus deterministik serta dapat dijelaskan: kecocokan tepat/alias → kecocokan ruang/path → relevansi facet → status publikasi/freshness → relasi yang benar-benar ada. Ia tidak boleh mengarang hasil semantik atau memuat seluruh indeks ke browser.

Setiap hasil menyatakan ruang, rumah taxonomy, profil, status, dan risiko bila Tutorial. Zero result dicatat sebagai sinyal kebutuhan agregat lokal tanpa menyimpan query identitas pengguna; sinyal itu dapat memunculkan `PROPOSED` packet, bukan artikel otomatis. Bookmark, catatan, atau progres hanya ditambahkan setelah kontrak penyimpanan privat, ekspor, dan penghapusan nyata tersedia.

Kedua ruang harus memiliki target sentuh minimum 44 px, focus state terlihat, empty/error/retry, responsive layout, dan reduced-motion. Atlas memberi orientasi/hubungan; Jalur Praktik memberi keputusan/bukti tindakan. Keduanya tidak boleh menjadi panel identik dengan isi diganti.

## 7. Gelombang pembangunan

| Gelombang | Hasil nyata | Batas keras |
|---|---|---|
| A. Kontrak kanonis | blueprint, glosarium, aturan slug/alias, dan registry profil draft | tidak membuat artikel contoh massal |
| B. Data keselamatan & relasi | proposal migration, policy server, dan Owner workflow untuk profile/facet/relation/evidence/safety | tidak menjalankan migration tanpa izin Owner |
| C. Paket taxonomy multi-root | package draft yang mempertahankan R1/R2 dan menambah R7 serta perluasan R2 bertahap | tidak promote paket tunggal yang meretire root lain |
| D. Browser skala | query facet server-side, cursor artikel, alias, panel relasi, zero-result recovery, state mobile | tidak memuat seluruh indeks ke client |
| E. Batch editorial rendah risiko | dossier, artikel asli, review, dan publikasi batch kecil yang dapat diaudit | tidak mengisi judul kosong atau konten salinan |
| F. Controlled practice | listrik, kendaraan, panas, kimia, kesehatan setelah workflow safety/review terbukti | disclaimer bukan pengganti safety |
| G. Ekspansi berulang | perbaikan taxonomy dari bukti query/zero-result; tambah relasi; archive/supersede dengan alias | tidak mengubah struktur besar tanpa compatibility plan |

Setiap gelombang adalah irisan vertikal: UI, data, API, permission, state error, dan dokumentasi harus selesai bersama. Ukuran koleksi tumbuh melalui paket yang dapat diaudit, bukan generator judul tanpa sumber.

## 8. Acceptance criteria ekspansi

- Pengguna dapat membedakan “memahami” dan “melakukan” dari menu awal tanpa konten duplikat.
- Setiap artikel memiliki satu rumah taxonomy, profil Madevi, status sumber, dan arah lanjut.
- Risiko Tutorial dipaksa melalui data server-side, bukan hanya teks client.
- Taxonomy dipromosikan hanya sebagai package multi-root tervalidasi, dengan alias dan rollback reference.
- Semua daftar besar memakai cursor; pencarian/facet tidak memuat semua data ke browser; URL memulihkan konteks.
- Tidak ada jumlah, menu, artikel, relasi, atau status yang belum benar-benar ada.
- Provenance, hak pakai, koreksi, dan supersession dapat ditelusuri lokal.
- Setiap packet dapat diteruskan lintas agent tanpa kehilangan lingkup, dossier, claim map, keputusan, risiko terbuka, atau langkah berikutnya.
- Pencarian tidak menampilkan DRAFT sebagai artikel terbit dan dapat menjelaskan alasan hasil atau zero-result tanpa menyimpan riwayat baca secara tersembunyi.
- Konten yang berubah memiliki status freshness, `as_of` bila perlu, dan jalur koreksi yang tidak menghapus riwayat tanpa penjelasan.

## Langkah berikutnya

Lanjutkan Gelombang B dengan policy server dan workflow Owner yang memakai migration `0039`
setelah migration itu disetujui/dijalankan: buat packet, isi dossier/claim/evidence, atur
facet/relasi/alias, lalu paksa gate publikasi Tutorial pada server. Sesudah kontrak itu siap,
buat package taxonomy multi-root **DRAFT** yang menambah R7 dan memperluas R2 tanpa mengubah
path aktif. Tidak ada artikel/node yang dipublikasikan sebelum validator, review, dan batas
operasi Owner mengizinkan.

Dokumen ini menggantikan asumsi bahwa setiap topik harus berbentuk ensiklopedia. Menu tetap dapat dipahami manusia, sedangkan pengetahuan dan praktik dapat tumbuh sangat besar lewat relasi, facet, bukti, dan penerbitan yang disiplin.
