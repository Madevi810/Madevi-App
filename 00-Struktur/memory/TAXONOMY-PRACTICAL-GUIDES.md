# Taxonomy Tutorial & Problem Solve

**Status:** `DIRENCANAKAN / BELUM-DIPUBLIKASIKAN-KE-TAXONOMY-LOKAL`  
**Ruang kanonis:** `space-tutorial-problem-solve` → `/ruang/tutorial-problem-solve`  
**Kode root yang dicadangkan:** `R7`  
**Tujuan:** menjadikan panduan memperbaiki, membuat, dan menyelesaikan kebutuhan sehari-hari
sebagai katalog tindakan yang aman, dapat ditelusuri, dan tidak tercampur dengan ensiklopedia Explore.

Arsitektur menu, format artikel, facet, relasi, dan urutan ekspansi kanonis ada di
`memory/KNOWLEDGE-AND-PRACTICE-ARCHITECTURE.md`. Dokumen ini tetap menjadi aturan risiko R7.

## Batas produk

- Explore menjawab konsep, studi, sejarah, dan hubungan pengetahuan.
- Tutorial & Problem Solve menjawab tindakan praktis: apa yang diperiksa, alat/bahan yang
  diperlukan, langkah yang dapat dilakukan, cara memverifikasi, serta kapan harus berhenti.
- Satu panduan memiliki **satu jalur taxonomy utama**. Hubungan ke konsep Explore ditulis sebagai
  relasi, bukan menyalin panduan ke banyak kategori.
- `Tutorial`, `checklist`, `diagnostic flow`, dan `problem solve` adalah **tipe konten**, bukan
  domain root. Dengan begitu, satu masalah HP atau motor tidak terpecah ke katalog paralel.

## Vocabulary root awal

Belum ada node atau artikel pada database aktif. Daftar berikut adalah vocabulary yang harus
menjadi paket taxonomy multi-root berikutnya—bukan klaim bahwa panduannya sudah terbit.

| Kode | Slug | Nama | Catatan keselamatan awal |
|---|---|---|---|
| R7.D1 | `rumah-listrik-dan-instalasi` | Rumah, Listrik & Instalasi | `CONTROLLED`; listrik bertegangan dan instalasi tetap berujung pada teknisi berwenang. |
| R7.D2 | `kendaraan-dan-motor` | Kendaraan & Motor | `CONTROLLED`; rem, bahan bakar, ban berbahaya, dan komponen keselamatan harus punya stop condition. |
| R7.D3 | `perangkat-digital-dan-elektronik` | Perangkat Digital & Elektronik | `GENERAL` sampai perangkat dibuka/bertegangan; lalu `CONTROLLED`. |
| R7.D4 | `dapur-dan-rumah-tangga` | Dapur & Rumah Tangga | `GENERAL`; gas, api, bahan kimia, dan pangan aman diberi batas khusus. |
| R7.D5 | `karya-dan-diy` | Karya & DIY | `GENERAL`; alat potong, panas, dan bahan kimia menaikkan risiko. |
| R7.D6 | `kerja-dan-peralatan` | Kerja & Peralatan | `CONTROLLED`; kebutuhan APD, listrik, beban, dan mesin wajib nyata. |
| R7.D7 | `perawatan-dan-kehidupan-sehari-hari` | Perawatan & Kehidupan Sehari-hari | `GENERAL`; tidak memuat diagnosis medis atau tindakan darurat profesional. |

Kedalaman standar yang benar pada schema/paket saat ini: `R7` ruang → `D` bidang → `K` kelompok
masalah/tujuan → `M` fokus/situasi → `T` rak. Judul/prosedur adalah data artikel yang menempel
pada node, bukan level taxonomy baru. Jangan membuat level baru tanpa migration dan keputusan.

## Kontrak panduan yang boleh terbit

Setiap panduan perlu memuat data nyata berikut sebelum `PUBLISHED`:

1. tujuan dan batas masalah yang spesifik;
2. tingkat risiko `GENERAL`, `CONTROLLED`, atau `STOP` beserta alasan;
3. alat, bahan, prasyarat, dan kondisi yang membuat pengguna harus berhenti;
4. langkah berurutan yang dapat diverifikasi, hasil yang diharapkan, serta pemulihan bila gagal;
5. sumber lokal: penulis/penerbit, URL asal bila relevan, tanggal akses, lisensi/hak pakai,
   tanggal review, dan status verifikasi;
6. hubungan ke konsep Explore bila pengguna perlu memahami teori; dan
7. review Owner untuk materi `CONTROLLED` atau materi yang dapat menimbulkan cedera, kerusakan,
   kebakaran, sengatan, keracunan, atau kerugian material.

`STOP` bukan panduan langkah. Ia hanya mengarahkan pengguna untuk memutus tindakan berbahaya
dan mencari bantuan profesional/layanan setempat yang sesuai. Madevi tidak boleh berpura-pura
menjadi teknisi, dokter, atau layanan darurat.

## Kontrak implementasi yang masih diperlukan

- Browser root sudah memakai endpoint taxonomy lokal, pagination cursor, URL `?path=`, retry,
  jalur kembali, dan daftar artikel terbit pada daun taxonomy.
- Paket R7 harus digabung ke **satu revisi multi-root** bersama root aktif lain. Jangan melakukan
  promote paket R7 terpisah karena `taxonomy_state` hanya memiliki satu revisi aktif.
- `scripts/taxonomy-import.mjs` telah memetakan `R7` ke filter pencarian `tutorial`; perubahan
  database/package belum dipromosikan pada sesi ini. Source migration 0036 untuk constraint
  `search_index_entries.space_key` juga masih `PENDING` dan belum diterapkan.
- Sebelum taxonomy R7 dipublikasikan, UI wajib menunjukkan state `belum diterbitkan`. UI boleh
  menampilkan **fondasi katalog statis** yang mengambil tujuh vocabulary R7 pada dokumen ini,
  asalkan diberi status `FONDASI KATALOG · BELUM TERBIT`, tidak membuat tautan seolah node sudah
  ada, dan tidak menghitungnya sebagai hasil endpoint taxonomy.
- Fondasi UI saat ini hanya memiliki satu judul `DRAFT`: **Memulai Perbaikan dengan Pemeriksaan
  Aman**. Ini adalah kerangka lintas bidang (batas aman → bukti → keputusan lanjut/eskalasi),
  bukan artikel `PUBLISHED`, bukan prosedur, dan bukan pengganti review/sumber.
- Tidak boleh menampilkan contoh langkah, daftar artikel, atau ketersediaan panduan sebagai nyata
  sebelum node dan artikel telah melewati alur sumber, risiko, review, dan publikasi Owner.
- Artikel masa depan perlu membawa metadata risiko dan source/review yang dapat diquery API.
  Jangan mengisi nilai risiko hanya di komponen client.

## Urutan kerja berikutnya

1. Tetapkan schema metadata risiko + review pada kontrak konten dan migration kompatibel.
2. Buat paket taxonomy multi-root revisi berikutnya dengan root R7 dan tujuh domain di atas.
3. Validasi paket secara foreground ketika batas Owner mengizinkan; stage/promote hanya dengan
   alur Owner yang sah.
4. Tambahkan batch panduan risiko rendah yang bersumber dan ditinjau, lalu baru kategori
   `CONTROLLED` per domain.
5. Periksa filter search, route deep-link, dan state mobile pada runtime lokal; catat bukti
   aktual di `TEST-REPORT.md`.
