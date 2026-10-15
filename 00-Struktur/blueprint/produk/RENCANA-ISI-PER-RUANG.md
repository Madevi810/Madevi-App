# Rencana Isi dan Data per Ruang Madevi

**Status:** blueprint kandidat, bukan katalog terbit. Tidak ada judul, jumlah materi,
harga, mitra, sertifikat, atau layanan yang dinyatakan tersedia oleh dokumen ini.
Peta ini menjawab **isi apa yang harus disiapkan**, urutan produksi, dan bukti penerbitannya.
Data yang aktif hanya ditentukan oleh source/database serta policy Owner.

## 1. Unit isi kanonis dan hubungan antarunit

| Unit | Rumah utama | Identitas dan isi minimum | Hubungan ke unit lain |
|---|---|---|---|
| Node taxonomy | Explore, Tutorial, School | ID/code/slug, parent, label, definisi batas, status, alias | satu rumah utama untuk artikel; route/search |
| Content Packet/artikel | Atlas, Praktik, School | canonical key, edisi, profil, ringkasan, blok, dossier, claim map, safety/freshness/review | satu node utama; facet dan relasi beralasan |
| Jalur belajar | School | tujuan, jenjang, prasyarat, langkah, assessment versi, akses | artikel, progres, soal, hasil |
| Soal/rubrik | School | kompetensi, stem, pilihan/jawaban, rubrik, versi, review | assessment dan attempt yang tidak berubah diam-diam |
| Post/grup/pesan | Line | pemilik, izin, isi, waktu, moderasi, retensi | profil dan laporan; tidak jadi artikel ensiklopedia |
| Layanan/template/order | Services | cakupan, pratinjau, versi, harga/quote, lisensi, brief, status | akun, pembayaran sah, hasil/revisi |
| Produk/mitra/pertanyaan | Shop | identitas, spesifikasi, sumber, hak gambar, mitra, status/harga | saved item, pertanyaan, kategori |
| Tool Brief/hasil | Tools | input, mesin, output, risiko, retensi, lifecycle | artikel panduan atau proyek privat |
| Halaman situs | dukungan | pemilik, versi/tanggal, isi, tautan, persetujuan | auth/profile/report dan operasi Owner |

**Aturan utama:** setiap unit memiliki pemilik data, status lifecycle, sumber fakta,
prosedur koreksi/retire, dan URL/ID yang stabil. Hubungan tidak boleh mengubah izin unit
tujuan. Hasil search/Asisten hanya mengambil isi yang sudah boleh dibaca principal.

## 2. Explore & Learn — Atlas pengetahuan

Pohon `R→D→K→M→T` adalah pintu masuk; artikel adalah daun konten, facet/relasi adalah
penemuan lintas cabang. Struktur 13 domain di bawah mengikuti
`../../memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`; ini **target cakupan**, bukan node
yang sudah terbit. Domain `sains-alam`, `teknologi-digital`, dan `bahasa-komunikasi` yang
sudah ada tetap dipertahankan sebagai path ketika diperluas.

| Domain kandidat | Isi awal yang perlu direncanakan | Bukti/risiko khusus |
|---|---|---|
| Sains Alam | materi/energi, gerak, pengamatan, metode dasar | satuan, model, batas kondisi percobaan |
| Kosmos, Bumi & Iklim | langit, planet, bumi, cuaca/iklim, skala ruang-waktu | tanggal data, ketidakpastian dan sumber observasi |
| Kehidupan, Evolusi & Keanekaragaman | sel/DNA, organisme, ekosistem, kekerabatan | klasifikasi berubah; bedakan organisme dan penyakit |
| Tubuh, Indra & Kesehatan Publik | anatomi, sistem tubuh, kesehatan populasi | pengetahuan umum, tanpa diagnosis/perawatan personal |
| Teknologi Digital | komputer, jaringan, keamanan, data/AI | versi teknologi, privasi dan potensi penyalahgunaan |
| Rekayasa, Benda & Energi Terapan | bagian sistem, listrik sebagai konsep, material/mesin | konsep terpisah dari prosedur berisiko di Tutorial |
| Pikiran, Perilaku & Psikologi | persepsi, belajar, emosi, keputusan | kualitas studi dan variasi manusia |
| Bahasa, Komunikasi & Penalaran | baca/tulis, bahasa, media, logika | contoh orisinal dan sumber untuk klaim linguistik |
| Sejarah, Peradaban & Perubahan | peristiwa, penemuan, migrasi, kronologi | sumber primer, sudut pandang, tanggal dan sengketa |
| Masyarakat, Negara, Ekonomi & Kerja | institusi, hukum sebagai informasi, pasar, kerja | yurisdiksi/tanggal untuk hal berubah; tanpa nasihat hukum/keuangan personal |
| Budaya, Agama, Kepercayaan & Kitab | tradisi, teks, ritual, perbandingan sumber | hormat, atribusi, pisahkan fakta/tafsir/keyakinan |
| Seni, Desain & Cipta | bentuk, musik, gambar, cerita, karya | hak cipta gambar/contoh dan konteks budaya |
| Penemuan, Metode & Bukti | eksperimen, data, arsip, cara memeriksa klaim | metode dapat direplikasi; kelemahan data dinyatakan |

Setiap domain dimulai dari **peta masuk singkat → 3–5 kelompok yang benar-benar berbeda →
artikel jangkar bersumber → relasi lintas domain → titik lanjut**. Jumlah per domain tidak
menjadi target produksi; batch pertama dipilih berdasarkan kebutuhan pembaca dan kelayakan
sumber. Tujuh profil komposisi Atlas yang sudah disepakati dipilih menurut pertanyaan,
bukan disalin menjadi satu format untuk semua artikel.

### Paket kerja satu artikel Atlas

1. Kebutuhan pembaca dan batas pertanyaan; cek judul/slug/family duplikat.
2. Rumah taxonomy, profil, facet yang dapat dibuktikan, dan relasi yang beralasan.
3. Source dossier lokal: jenis sumber, URL/identitas, tanggal akses, lisensi/hak pakai,
   status verifikasi; klaim penting ditautkan ke bukti.
4. Struktur asli Madevi, penjelasan bertahap, ketidakpastian, hal yang berubah seiring
   waktu, dan rute lanjut ke konsep atau Tutorial.
5. Review sesuai sensitivitas, preview, publish oleh pihak berizin, freshness review,
   koreksi/edisi/arsip dengan alias URL.

## 3. Tutorial & Problem Solve — Jalur praktik

Tujuh domain R7 adalah vocabulary rencana yang sudah diputuskan; database aktif belum
memuat node/panduan R7 terbit menurut catatan state. Berikut peta **jenis isi** yang perlu
disiapkan sebelum judul panduan dipilih. Untuk setiap domain, mulai dari situasi risiko rendah
yang dapat diverifikasi, lalu pertimbangkan materi `CONTROLLED` hanya setelah safety policy,
sumber dan review Owner berjalan.

| Domain R7 | Keluarga kebutuhan yang perlu dicakup | Batas terpenting |
|---|---|---|
| Rumah, Listrik & Instalasi | inspeksi non-tegangan, air/sanitasi, ventilasi, pintu/permukaan, penghematan | tegangan, gas, struktur: `CONTROLLED`/`STOP` sesuai keadaan |
| Kendaraan & Motor | pemeriksaan awal, ban/roda, perawatan ringan, gejala mesin, mobilitas | rem, bahan bakar, kerusakan ban/komponen keselamatan: stop condition |
| Perangkat Digital & Elektronik | HP/komputer/TV/audio, jaringan rumah, data, perangkat lunak | backup data, baterai, tegangan dan bongkar perangkat |
| Dapur & Rumah Tangga | persiapan, memasak, penyimpanan, kebersihan, alat rumah | api/gas, pangan, bahan kimia dan kontaminasi |
| Karya & DIY | rancangan, bahan, potong/rakit, cetak, prototipe | mata pisau, panas, debu/kimia, alat listrik |
| Kerja & Peralatan | setup kerja, alat tangan, ukur, dokumen, alur usaha | mesin, beban, APD, izin pekerjaan |
| Perawatan & Kehidupan Sehari-hari | pakaian, barang rumah, organisasi, kebiasaan | bukan diagnosis medis atau tindakan darurat |

Empat pintu maksud `Perbaiki/cari penyebab`, `Buat/pasang`, `Rawat/cegah`, dan
`Pilih/gunakan` adalah **facet**, bukan menu/domain tambahan. Profil artikel dipilih dari
Diagnosis Jalur, Tindakan Lurus, Bangun Karya, Rawat Berkala, Pilih & Siapkan, atau Stop &
Eskalasi. Paket wajib memuat keadaan awal, batas aman, alat/prasyarat, langkah yang dapat
diuji, hasil normal/abnormal, pemulihan, dan bantuan. Materi `STOP` tidak mempunyai langkah
teknis. Review safety dan hak pakai dilakukan sebelum publish, bukan sesudah UI jadi.

## 4. Madevi School — kurikulum yang dapat dilanjutkan

School tidak cukup dengan daftar jenjang atau kartu materi. Satu unit belajar harus
menjelaskan **kompetensi → prasyarat → bahan → latihan → bukti kemajuan → evaluasi →
langkah berikutnya**. R1/taxonomy aktif dan jalur terbit menjadi sumber; jenjang PAUD sampai
Perguruan Tinggi adalah cakupan produk, bukan klaim bahwa semua materi telah tersedia.

| Lapisan isi | Rencana minimum | Gate |
|---|---|---|
| Peta jenjang | jenjang, fokus belajar, cara masuk, akses dan jalur terbit | label belum tersedia bila jalur belum ada |
| Jalur belajar | tujuan, urutan topik, prasyarat, artikel/latihan, estimasi hanya bila data sah | versi serta dampak pada progres lama |
| Materi | penjelasan, contoh orisinal, sumber, latihan, alternatif aksesibilitas | read policy dan review kualitas |
| Latihan | prompt, cara mengerjakan, umpan balik yang dapat dibuktikan | tidak berpura-pura menilai otomatis bila belum ada engine |
| Ujian | eligibility, aturan versi, bank soal/rubrik, attempt, review | tidak ada angka UI global yang hardcode |
| Progres/sertifikat | progres dari server, hasil, nomor/validasi sertifikat bila tersedia | hanya terbit bila seluruh syarat sah |

Batch konten dimulai dari satu jalur lengkap yang dapat diselesaikan dan diuji, lalu
memperluas jenjang lain. Tiap penambahan harus menguji bahwa akun yang telah berprogres tetap
dapat melanjutkan setelah artikel/jalur direvisi.

## 5. Madevi Line — isi sosial dan kebijakan

Line adalah ruang buatan pengguna, sehingga perencanaannya mencakup **aturan isi dan
pengelolaan**, bukan menulis post contoh untuk mengisi feed.

| Permukaan | Isi/data yang sah | Pengaman dan pengalaman wajib |
|---|---|---|
| Feed/post/komentar | konten milik pengguna dengan visibility dan waktu | quota, block/mute, report, edit/hapus sesuai policy, empty state |
| Grup | tujuan, aturan, pengelola, anggota, status join/banding | izin anggota, pergantian manager, moderasi |
| Pesan | percakapan dan permintaan pesan privat | peserta sah, block/report, retensi, no leak di search/log |
| Profil publik | identitas dan konten yang memang dibuka pemilik | kontrol privasi, status blokir, akun nonaktif |
| Moderasi/banding | alasan, bukti, kebijakan, status dan keputusan | reviewer, audit, jalur banding, retensi bukti |

Peta kebijakan perlu menjawab: jenis konten apa yang ditolak, bagaimana upload dikarantina,
siapa dapat melihat post/pesan setelah block, kapan data disimpan/dihapus, dan bagaimana
pengguna mengajukan banding. Jangan menciptakan komunitas atau metrik aktivitas palsu saat
ruang kosong.

## 6. Madevi Services — isi katalog dan kontrak pesanan

| Isi yang direncanakan | Data minimum sebelum terbit | Hasil dan pengelolaan |
|---|---|---|
| Layout/template | preview nyata, versi, fitur, input, format hasil, lisensi, harga tetap, revision limit | order memakai snapshot; arsip tidak merusak order lama |
| Desain custom | brief, batas pekerjaan, contoh hasil berhak pakai, mekanisme quote, revisi | quote Owner sebelum kewajiban harga; status kerja jelas |
| PCB layout | kebutuhan teknis, file input, batas kemampuan, keluaran/validasi, risiko | review kebutuhan dan output yang dapat diperiksa |
| Undangan | template terbit/brief, data acara, preview, publikasi slug, privasi tamu | hasil hanya setelah persetujuan; order privat |
| Invoice/pembayaran manual | snapshot item/price, status, cara konfirmasi yang sah, bukti minimum | `pending` tidak menjadi `paid` tanpa verifikasi |

Katalog contoh dari source bukan otoritas harga/publikasi. Setiap layanan aktif harus memiliki
operator, state order, cara menangani gagal/berhenti, dan hasil yang dapat dibuka pemesan.
Permintaan legal, harga, dan pembayaran menunggu keputusan Owner yang tepat.

## 7. Madevi Shop — kurasi produk, bukan transaksi semu

| Jenis isi | Yang harus dicatat | Gate dan penarikan |
|---|---|---|
| Produk | nama, kategori, spesifikasi yang diverifikasi, gambar dan hak pakai, sumber/tanggal, status/harga | hanya `PUBLISHED` dari data sah; update/arsip saat fakta berubah |
| Mitra | identitas, hubungan, tautan/ketentuan bila ada, status verifikasi | tidak tampil sebagai mitra aktif sebelum disetujui |
| Panduan memilih | kriteria, trade-off dan batas klaim | artikel Explore/Tutorial terkait, bukan iklan berkedok panduan |
| Pertanyaan/simpanan | pemilik, produk, waktu, jawaban, status | privasi dan notification; produk arsip tetap dapat dijelaskan |

Katalog kosong adalah hasil yang jujur. CTA saat ini terbatas pada simpan dan tanya sesuai
alur aktif. Checkout/afiliasi hanya dapat direncanakan sebagai item masa depan dengan
kontrak uang, hukum, stok/mitra, keamanan, dan persetujuan Owner tersendiri.

## 8. Tools & Equipment dan Asisten

| Isi/kapabilitas | Rencana | Gate |
|---|---|---|
| Rumus & Kalkulasi | daftar operasi yang ada, asumsi, satuan, contoh input berlabel, pembulatan, batas hasil | hasil deterministik diuji, input salah dan copy/save jelas |
| PDF Workspace | tujuh operasi lokal, jenis/ukuran berkas, batas halaman, privasi, output/cleanup | file validation, timeout, hasil tidak menimpa asli |
| Dokumen Karier | struktur CV/surat/portofolio, preview, ekspor HTML/cetak, simpan privat | template tidak mengarang pengalaman pengguna |
| Kandidat tool baru | Group→Family→Tool→Operation, Tool Brief, engine, status lifecycle | `PUBLISHED` hanya setelah `VERIFIED_LOCAL` |
| Asisten | cakupan korpus lokal, retrieval izin, sumber jawaban, uncertainty, riwayat privat | tidak mengklaim web/AI online, tidak menjawab tanpa dasar |

Peta 10 kelompok dan roadmap R0–R7 yang detail tetap berada di
`../../memory/TOOLS-AND-EQUIPMENT-ARCHITECTURE.md`. Rencana di sini mengikat setiap tool
ke isi Tool Brief dan halaman yang membukanya, bukan menambah tombol kandidat.

## 9. Isi lintas web dan halaman dukungan

| Isi | Sumber keputusan | Siklus review |
|---|---|---|
| Beranda dan deskripsi tujuh ruang | kontrak navigasi, fungsi yang benar-benar tersedia | ketika route/kapabilitas berubah |
| Label status, empty/error, onboarding | API/state nyata dan hasil pengguna | ketika alur berubah; uji bahasa jelas |
| Tentang/FAQ | operasi produk dan pertanyaan pengguna yang dapat dibuktikan | tanggal tinjau dan Owner/editor |
| Ketentuan dan Privasi | operasi data/layanan aktual serta keputusan Owner | versi, tanggal efektif, persetujuan bila material |
| Bantuan, Review, Laporkan Masalah | jalur feedback/inbox aktif | penanganan, retensi dan eskalasi |
| Search metadata | taxonomy, artikel, produk/tool terbit sesuai izin | per publish/retire, zero-result dan link |
| SEO/metadata online nanti | konten publik terbit, canonical URL, hak aset | hanya saat tahap online dan kebijakan indexing diputuskan |

## 10. Kalender produksi tanpa tanggal/jumlah fiktif

Gunakan **batch kecil** yang memiliki satu tema masalah pengguna dan satu pemilik review.
Setiap batch harus mencatat daftar packet/record, sumber, reviewer, risiko, taxonomy, route,
tes query/akses, rollback/retire, serta hasil pengukuran. Urutan yang aman:

1. Audit isi yang saat ini tampil: pisahkan data aktif, contoh, draft, dan klaim yang perlu
   diperbaiki. Catat per route, bukan menebak dari tampilan.
2. Selesaikan policy dan workflow penerbitan konten, izin, serta migrasi pending hanya setelah
   gerbang Owner dan pemulihan tersedia.
3. Isi satu alur lengkap per ruang: satu topik Atlas terbit, satu panduan risiko rendah,
   satu jalur School, satu layanan/tool nyata, dan satu halaman dukungan yang teruji.
   Ini **target urutan**, bukan klaim bahwa kontennya tersedia sekarang.
4. Perluas berdasarkan kebutuhan pengguna/search/report yang terbukti, bukan target jumlah
   judul. Tambahkan relasi, facet, dan revisi sebelum memperbesar taxonomy.
5. Tinjau freshness secara berkala menurut sifat isi: harga/mitra dan aturan berubah lebih
   cepat daripada konsep stabil. Tanggal review per item disimpan sebagai data.

## 11. Formulir perencanaan satu unit isi

```text
ID/kunci kanonis, tipe, bahasa/edisi, pemilik:
Masalah pengguna dan janji judul:
Rumah taxonomy/route utama; facet/relasi beralasan:
Sumber, tanggal akses, lisensi/hak pakai, klaim yang didukung:
Struktur isi dan contoh yang dibuat sendiri:
Risiko, klasifikasi safety, prasyarat dan stop condition:
Permission, lifecycle, freshness, reviewer dan keputusan Owner:
Search/Asisten/tautan silang yang boleh menampilkan unit ini:
State kosong/gagal/ditarik dan jalur koreksi:
Acceptance criteria, bukti, alias/kompatibilitas dan rollback:
```

Jika salah satu informasi belum diketahui, tandai `BELUM-DIVERIFIKASI` atau `PERLU
KEPUTUSAN OWNER`; jangan mengisi dengan fakta, harga, sumber, atau review rekaan.
