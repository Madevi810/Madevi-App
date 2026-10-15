# ATURAN WAJIB — Madevi

Disimpan 14 Okt 2026 23:25 WIB atas perintah Ade. Ini aturan wajib yang tidak boleh dilanggar.

## ALUR KERJA

1. Saya sebagai executor
2. Siklus: rencana → eksekusi → edit/ubah/revisi
3. Tiap 30 menit: cek hasil vs rencana — sesuai tidak? Kalau tidak, langsung revisi
4. Tiap 1 jam: rencana baru masuk → langsung dikerjakan (harus ada kode yang berubah, bukan cuma ide)
5. Tiap 12 jam: cek runtime
6. Hasil dikirim ke Ade, lalu kerja lagi tanpa berhenti
7. Status harus terus update biar Ade bisa pantau semua

## ATURAN KERJA

1. Jangan ngawur — kerja teliti, telusuri seluruh isi project sebelum selesai
2. Jangan berspekulasi atau mengarang fakta yang tidak diketahui
3. Jangan berhenti, jangan tanya/minta konfirmasi untuk hal teknis rutin
4. Jangan ubah stack: Next.js 16, React 19, TypeScript, Drizzle, pg, PostgreSQL 16
5. Jangan ubah cara kerja Termux dan jangan ubah cara kerja system
6. Tepat 7 ruang, tidak boleh tambah ruang/menu utama baru
7. Urutan pengerjaan: Shop → Tools → Services → Tutorial → Explore → School → Line (mudah ke berat)
8. Tidak ada laporan realtime — hanya update berkala (apa yang selesai + hasilnya)
9. Hanya hubungi Ade jika benar-benar buntu dan butuh keputusan yang cuma dia bisa ambil
10. Jangan mengganggu bot LightVela lain yang sedang bekerja
11. Bot LightVela tidak dipakai lagi
12. Hasil hanya dikirim ke Ade
13. Semua pekerjaan dicatat di Madevi-Control
14. Database, source, SQL seed, control-plane tidak boleh hilang/rusak
15. Timebox rabbit-hole maksimal 30 menit, fokus hasil nyata per ruang
16. Jangan sync zip ke live sebelum Ade menjawab/memerintah

## ATURAN TEKNIS

17. Semua pembayaran, OAuth, OTP, email, mode online = simulasi berlabel jujur (SIMULASI)
18. Tidak boleh bergantung pada API/runtime online
19. Framework simulasi = abstraction layer — saat go-live tinggal ganti adapter
20. Tidak ada splash, intro, popup, modal, atau animasi otomatis yang menyela
21. Animasi hanya untuk feedback aksi user
22. Semua yang tampil harus atas aksi user atau konteks yang jelas
23. Dark = default, Light = tema kerja, Madevi On = opt-in identitas brand
24. Desain harus sangat modern, tanpa generic "AI slop" — saya diberi kebebasan penuh

## ATURAN KONTEN

25. Taksonomi harus rapi dan tepat — hierarki yang salah merusak semua (prinsip kritis)
26. Untuk Explore/School/Tutorial: siapkan taksonomi dulu sampai hierarki lengkap dan terverifikasi, baru isi kontennya
27. Pengetahuan itu hidup dan tidak pernah selesai — tidak ada topik yang boleh dinyatakan "sudah selesai"
28. Semua ruang harus berfungsi nyata, bukan gimmick/dummy
29. Semua judul, menu, konten harus terisi — tidak boleh ada bagian kosong
30. Jangan mengarang produk afiliasi — harus data asli
31. Jangan menebak harga/kualitas barang dari tampilan atau desainnya

## ATURAN STRUKTUR PAKET

32. Madevi_Off murni source (tanpa campur file lain)
33. Semua .md hanya di Madevi-Control
34. File .sh di top-level (di luar kedua folder)

## VISI TIAP RUANG

35. Shop: affiliate — jual barang orang lain via link, katalog foto+deskripsi harus sama persis dengan di marketplace, untuk penghasilan sampingan, link pakai rel="sponsored" + disclosure eksplisit
36. Tools: jasa versi gratis — jangan dicampur dengan yang berbayar, saya bebas kasih inovasi
37. Services: usaha penghasilan, full digital/internet bukan barang fisik — saya harus proaktif cari inovasi jasa terus-menerus
38. Tutorial: format masalah → penjelasan → persiapan alat → cara → resiko → penyelesaian
39. School: harus terasa seperti sekolah nyata (aturan, bab, materi, semester, ujian, kenaikan kelas)
40. Line: sosial karya + sosial curhat dipisah, wajib perlindungan dari pornografi/kekerasan/pelecehan, postingan curhat ada catatan krisis otomatis (hotline 119 ext 8)

## SYARAT IDE INOVASI

41. Inspirasi bebas dari mana saja (Indonesia/luar) asal berguna dan bisa dipakai
42. Wajib bukan yang umum — baru/unik, belum ada atau cuma segelintir di web
43. Ide jasa wajib menghasilkan uang dengan 2 tier: HEMAT Rp10rb–50rb dan PRO Rp50rb–150rb
44. Tiap ide wajib lengkap 6 bagian: ide, tujuan, rencana, desain, fitur, fungsi
