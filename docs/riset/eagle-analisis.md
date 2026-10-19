# Riset Referensi: Autodesk Eagle → Fitur Jasa Desain PCB + Simulasi Elektronika Madevi

Tanggal riset: 18 Oktober 2026
Metode: pencarian web publik (tidak membuka aplikasi/desktop; tanpa login).
Tujuan: memahami sistem kerja Eagle/Fusion 360 Electronics/KiCad/alat web, lalu memetakan fitur apa yang bisa di-porting ke Madevi (aplikasi WEB, bukan desktop).

---

## 1. Ringkasan

- **EAGLE** (Easily Applicable Graphical Layout Editor; Jerman: *Einfach Anzuwendender Grafischer Layout-Editor*) adalah aplikasi EDA (Electronic Design Automation) buatan CadSoft (1988), diakuisisi Autodesk pada 2016.
- Versi stabil terakhir: **9.6.2 (27 Mei 2020)**. Autodesk mengumumkan penghentian: **EAGLE tidak lagi dijual/didukung efektif 7 Juni 2026**; penggantinya adalah **Fusion 360 Electronics** (file EAGLE kompatibel penuh dengan Fusion).
- EAGLE terdiri dari 3 modul utama: **Schematic Editor**, **PCB Layout Editor**, **Autorouter** — plus Library Editor, CAM Processor, Text Editor, dan ULP (User Language Programs, bahasa script mirip C).
- **Fusion 360 Electronics** (penerus) menambahkan: simulasi **SPICE terintegrasi** di workspace skematik, MCAD-ECAD unification (sinkronisasi PCB ↔ model 3D mekanik), 3D PCB visualization, dan simulasi pendinginan/thermal (via extension berbayar).
- Pembanding open-source: **KiCad** (GPL-3.0, gratis tanpa batas, versi stabil 10.0.6 per 29 Agustus 2026) — kini standar de-facto komunitas.
- Pembanding berbasis web (paling relevan untuk Madevi): **EasyEDA** (skematik + simulasi ngspice + layout PCB + DRC + export Gerber, semua di browser, gratis) dan **Falstad CircuitJS** (simulator sirkuit interaktif di browser, open-source).

---

## 2. Fitur Inti Eagle (detail per fitur)

### 2.1 Schematic Editor (capture skematik)
- Menggambar diagram rangkaian elektrik multi-sheet (**hingga 99 sheet** per skematik pada versi profesional).
- Komponen diambil dari library: setiap komponen = **Device** yang mengikat **Symbol** (tampilan skematik) + **Package/Footprint** (bentuk fisik di PCB).
- **Forward & Back Annotation** online: perubahan di skematik otomatis tercermin di board dan sebaliknya; "automatic board generation" membuat board awal dari skematik.
- **Electrical Rule Check (ERC)**: cek otomatis kesalahan elektrik di level skematik (mis. pin output bentrok, pin tidak tersambung, net tanpa driver). Ini adalah "validasi logika" sebelum masuk layout.
- Pembuatan sinyal supply otomatis untuk IC.

### 2.2 PCB Layout Editor
- Area gambar hingga 64×64 inci, resolusi 1/10.000 mm (0,1 mikron); grid mm/inci; hingga 255 layer terdefinisi.
- **Hingga 16 signal layer + 14 supply layer** (versi profesional); full SMD support; multilayer penuh.
- **Copper pour / polygon pour**: area tembaga (GND/VCC plane) yang otomatis menghindari trace lain sesuai aturan DRC.
- Penempatan komponen manual bebas (no placement restrictions); routing manual trace-by-trace.

### 2.3 Autorouter
- Terintegrasi penuh; bisa campur manual + otomatis kapan saja.
- Algoritma **ripup & retry** dengan **strategi berbasis cost factor** yang bisa diatur user (bobot biaya untuk via, panjang trace, dll).
- Grid routing hingga 4 mil; mendukung net class berbeda (lebar trace & clearance minimum per net).

### 2.4 Design Rule Check (DRC)
- Verifikasi otomatis layout terhadap constraint manufaktur: **lebar trace minimum, clearance antar trace, ukuran drill, annulus, dll.**
- Mencegah error level produksi sebelum file dikirim ke pabrik.

### 2.5 Library Management
- Library Editor untuk membuat **Symbol** (skematik), **Package** (footprint PCB), dan **Device** (pengikat keduanya).
- Asosiasi footprint dengan model 3D untuk visualisasi.

### 2.6 3D Preview / Visualisasi
- Melihat PCB dalam ruang 3D; di Fusion 360 Electronics diperkuat menjadi **unified MCAD-ECAD**: PCB di-push ke environment mekanik 3D untuk cek kesesuaian dengan enclosure (lubang mounting, interferensi komponen) sebelum prototipe fisik.

### 2.7 Manufacturing Output (CAM Processor)
- Menghasilkan file standar industri: **Gerber RS-274X**, **Excellon drill**, **Bill of Materials (BOM)**, pick-and-place, netlist, PDF dokumentasi.

### 2.8 ULP (User Language Programs)
- Bahasa script mirip C untuk otomasi dan ekstensi (mis. generate BOM kustom, cek aturan sendiri).

---

## 3. Alur Kerja User (schematic → produksi)

Alur kanonis di Eagle / Fusion 360 Electronics / KiCad / EasyEDA, yang konsisten di semua sumber:

1. **Buat skematik** — pasang komponen dari library, hubungkan dengan net/wire, beri nama net yang deskriptif.
2. **Jalankan ERC** — perbaiki pin tak tersambung, konflik output, net tanpa driver.
3. **(Opsional tapi krusial) Simulasi SPICE** — validasi perilaku rangkaian (tegangan, arus, respons frekuensi) sebelum layout. Di Fusion: langsung di workspace skematik, mode transient & AC sweep, dengan model SPICE komponen.
4. **Generate board dari skematik** — footprint muncul dengan "airwires" (garis koneksi logis yang belum di-routing).
5. **Placement** — susun komponen di board (pertimbangkan aliran sinyal, thermal, ukuran enclosure).
6. **Routing** — tarik trace manual dan/atau jalankan autorouter; atur net class (lebar trace, clearance).
7. **Copper pour** — tambahkan ground/power plane.
8. **Jalankan DRC** — perbaiki pelanggaran aturan manufaktur hingga bersih.
9. **3D check** — verifikasi mekanik (khusus Fusion).
10. **CAM output** — export Gerber + drill + BOM → kirim ke pabrik PCB.

Prinsip yang bisa dicuri untuk Madevi: **validasi berlapis** (ERC di level logika → simulasi perilaku → DRC di level fisik → output manufaktur). Tiap tahap punya "gate" yang harus lolos.

---

## 4. Validasi & Simulasi

### 4.1 ERC (Electrical Rule Check) — level skematik
- Cek konektivitas logis: pin input/output/power yang salah sambung atau menggantung.
- Di EasyEDA disebut "Check Net": flag untuk unconnected pins, shorted nets, duplicate designators, komponen tanpa footprint.

### 4.2 SPICE Simulation — level perilaku
- **Fusion 360 Electronics**: SPICE terintegrasi di schematic workspace; simulasi "any valid SPICE circuit"; komponen memakai model SPICE (primitif R/C/transistor atau model pabrikan); mode **transient** dan **AC sweep**; sumber tegangan & kondisi beban bisa didefinisikan; hasil berupa waveform/plot respons frekuensi; feedback real-time saat skematik diubah.
- **KiCad**: memakai engine **ngspice**; analisis DC operating point, DC sweep, AC small-signal, transient, noise, pole-zero, S-parameter; hasil grafis interaktif.
- **EasyEDA**: simulasi ngspice (edisi Standard memakai LTspice) + waveform viewer, langsung di browser.
- Catatan penting: **Eagle klasik (9.x) TIDAK punya simulasi SPICE bawaan** — simulasi adalah fitur era Fusion 360 Electronics. (Terverifikasi dari dokumentasi Autodesk; bila butuh kutipan lebih dalam, tandai untuk verifikasi lanjutan.)

### 4.3 DRC — level fisik/manufaktur
- Seperti dijelaskan di 2.4: aturan geometris agar board bisa diproduksi (trace width, clearance, drill).

### 4.4 Simulasi thermal/pendingin (Fusion, extension berbayar)
- Mengidentifikasi hotspot dan skenario pendinginan (kipas, heatsink) pada model 3D PCB.

---

## 5. Model Bisnis

### Eagle / Fusion 360 Electronics
- 2016–2020: model subscription-only (kontroversial saat itu); 2020: EAGLE digabung menjadi bundle dengan Fusion 360.
- Harga (sumber G2, data ~2024, **tidak terverifikasi langsung ke halaman harga Autodesk**): **Fusion 360 with EAGLE $545/tahun atau $70/bulan**.
- Versi gratis EAGLE (legacy): **2 schematic sheet, 2 signal layer, luas board 80 cm²** (versi Light lama: 1 sheet, 4×3,2 inci, 2 layer). Reviewer G2 menyebut batas luas board sebagai pain point utama.
- Timeline penghentian (dari FAQ resmi Autodesk): renewal EAGLE Standard dihentikan 31 Mar 2025; **EAGLE tidak tersedia/didukung setelah 7 Juni 2026**; jalan ke depan = Fusion 360 Electronics.
- Fusion 360: gratis untuk pelajar/pendidik; personal use gratis bila pendapatan tahunan < $1.000 (sumber ensiklopedia pihak ketiga; **tidak terverifikasi langsung**).

### KiCad (pembanding)
- **Gratis penuh, open-source (GPL-3.0), tanpa batasan fitur**: tanpa cap ukuran board, tanpa batas layer, tanpa lisensi berlangganan.

### EasyEDA (pembanding web)
- **Editor 100% gratis** untuk skematik, layout, simulasi, dan export file fabrikasi (Gerber bisa diunduh dan dikirim ke pabrik mana pun — no lock-in).
- Monetisasi: **layanan manufaktur PCB** (terintegrasi JLCPCB — order langsung dari dalam tool). Pola bisnis = "tool gratis, produksi berbayar".

### Pelajaran model bisnis untuk Madevi
- Pola EasyEDA paling cocok untuk Madevi: **simulator & validator web gratis** (menarik user, edukasi), **jasa desain PCB berbayar** (desain dilakukan/direview manusia atau pipeline semi-otomatis).
- Hindari pola "versi gratis yang menjebak" (batas ukuran board ala Eagle) — review negatifnya terdokumentasi.

---

## 6. Perbandingan KiCad vs Eagle/Fusion

| Aspek | Eagle 9.x (legacy) | Fusion 360 Electronics | KiCad 10.x |
|---|---|---|---|
| Harga | Subscription (bundel Fusion) | Subscription | Gratis (GPL-3.0), tanpa batas |
| Status | Dihentikan 7 Jun 2026 | Aktif (penerus resmi) | Aktif, komunitas besar |
| Schematic | s.d. 99 sheet, ERC | + SPICE terintegrasi | Hierarchical, ERC |
| Layout | 16 signal layer | Sama + MCAD sync | **32 copper layer** |
| Autorouter | Ya (ripup&retry, cost-based) | Ya | Tidak ada autorouter penuh; interactive push-and-shove |
| DRC | Ya | Ya | Ya (visual DRC) |
| Simulasi | Tidak bawaan | SPICE (transient, AC sweep) | ngspice (DC/AC/transient/noise/dll) |
| 3D | Viewer dasar | Unified MCAD-ECAD + thermal | 3D viewer + export STEP |
| Output | Gerber, Excellon, BOM | + ODB++ | Gerber, drill, BOM, ODB++ |
| Platform | Win/Mac/Linux | Cloud-based | Win/Mac/Linux |
| Library | Terbuka, besar | Cloud + lokal | Besar, komunitas |

---

## 7. Referensi Khusus Web (paling relevan untuk Madevi)

### Falstad CircuitJS (CircuitJS1)
- Simulator sirkuit **di browser**, dibuat Paul Falstad (~2000-an, Java applet → HTML5), open-source **GPL v2**.
- Keunggulan: **arus digambarkan sebagai titik-titik bergerak, tegangan sebagai warna**; 1.000+ contoh rangkaian; tanpa install/akun; bisa dibagikan via link.
- Keterbatasan: **bukan SPICE** — engine sendiri yang dioptimasi untuk kecepatan & interaktivitas, bukan akurasi presisi. Cocok untuk belajar & PoC, bukan validasi produksi.
- Pelajaran: visualisasi arus/tegangan real-time adalah standar emas UX simulator edukasi.

### EasyEDA
- **EDA penuh di browser**: schematic capture → simulasi ngspice → PCB layout → DRC → export Gerber/BOM → order manufaktur. Library 1M+ komponen (sinkron katalog LCSC).
- Membuktikan bahwa alur EDA lengkap **bisa** berjalan di web.

---

## 8. Rekomendasi Porting ke Madevi

Konteks Madevi: aplikasi **WEB** (Next.js), target user Indonesia termasuk pelajar/SMK/pekerja. Visi jasa yang sudah ditetapkan: **"SIMULASI ELEKTRONIKA WEB: user menyambung komponen sesuai tujuan, lalu dicek 'rangkaian ini jalan tidak, aman tidak'"**. Eagle/Fusion/KiCad adalah aplikasi desktop berat — yang di-porting adalah **konsep dan fasenya**, bukan softwarenya, dengan karakter berbeda (lebih ringan, edukatif, Bahasa Indonesia).

### 8.1 Fitur yang diadopsi (dipetakan ke fase Eagle)

| Fase Eagle | Porting web Madevi | Status di Madevi |
|---|---|---|
| Schematic Editor | **Canvas skematik SVG** drag-and-drop di browser (komponen → kabel). Sederhana ala Falstad, bukan CAD penuh | Baru (EMULATOR-001 sudah ada untuk DC; perlu perluasan) |
| Library komponen | **Pustaka komponen web**: resistor, kapasitor, induktor, LED, dioda, transistor, IC umum (555, 741, 7805), baterai — tiap komponen punya nilai & batas aman | Perlu dibangun |
| ERC (cek logika) | **"Cek Sambungan"**: deteksi pin menggantung, kabel putus (flying wire), short VCC–GND, duplikat label | Perlu dibangun |
| SPICE (cek perilaku) | **Simulasi DC (solver MNA)** yang sudah ada di EMULATOR-001 + visualisasi arus/tegangan ala Falstad; kembangkan ke analisis transient sederhana (RC charging) | Sebagian ada |
| "Aman tidak?" | **Cek keamanan**: arus LED tanpa resistor pembatas, tegangan melebihi rating kapasitor, daya resistor terlampaui → peringatan Bahasa Indonesia yang menjelaskan bahaya + saran perbaikan | Perlu dibangun (nilai jual utama jasa) |
| DRC (cek fisik) | **DRC-lite untuk protoboard/stripboard**: cek jarak antar jalur, overlap, ukuran lubang — relevan karena user pemula merakit di breadboard/PCB lubang, bukan pabrik | Perlu dibangun |
| Autorouter | **Tidak di-porting** — terlalu berat & tidak relevan untuk web edukasi. Ganti dengan **"saran perapihan kabel"** (penataan otomatis sederhana) | Tidak |
| CAM/Gerber | **Tidak di-porting** ke web (butuh presisi CAD). Output Madevi = **laporan simulasi + diagram + daftar belanja komponen (BOM sederhana)** | Tidak |
| 3D preview | **Tidak di-porting**; ganti dengan **tampilan breadboard virtual** (komponen di atas breadboard seperti Tinkercad) bila memungkinkan | Opsional |
| Jasa PCB_LAYOUT | Tetap sebagai **jasa berbayar manusia**: user upload skematik/gambar keinginan → desainer Madevi mengerjakan di KiCad → deliver file Gerber + BOM. Web hanya untuk order, tracking, dan simulasi pra-desain | Model bisnis |

### 8.2 Prinsip UX yang dicuri
1. **Validasi berlapis dengan gate jelas** (sambungan → simulasi → keamanan → fisik), tiap gate menampilkan pesan Bahasa Indonesia yang bisa ditindaklanjuti — bukan kode error misterius.
2. **Visualisasi real-time** ala Falstad: arus sebagai titik bergerak, tegangan sebagai warna. Ini pembeda utama vs "kalkulator biasa".
3. **Contoh rangkaian siap pakai** (1-klik load): LED + resistor, pembagi tegangan, 555 astable, catu daya 7805 — menurunkan barrier pemula.
4. **Elemen UI reuse**: satu set komponen kecil (badge status lolos/gagal, panel peringatan, kartu komponen) dipakai konsisten di semua fase; jangan buat gaya visual berbeda per fase.
5. **Bahasa Indonesia penuh** di semua label, pesan error, dan saran — ini karakter pembeda Madevi vs tool impor.

### 8.3 Yang TIDAK di-porting (dan alasannya)
- Autorouter penuh, Gerber/CAM presisi, 3D MCAD: butuh engine CAD berat, tidak cocok untuk browser HP (user utama Madevi) dan bukan kebutuhan user pemula.
- Model bisnis "gratis tapi menjebak" (batas ukuran): merusak kepercayaan; pakai pola EasyEDA (tool gratis, jasa produksi/desain berbayar).

---

## 9. Catatan verifikasi

- Harga $545/tahun & $70/bulan: dari G2 (~2024), **belum diverifikasi ke halaman harga resmi Autodesk**.
- Klaim "Eagle 9.x tidak punya SPICE bawaan": disimpulkan dari dokumentasi Autodesk yang menempatkan SPICE sebagai fitur Fusion 360 Electronics; **perlu verifikasi lanjutan bila dijadikan klaim publik**.
- Batas versi gratis Eagle (2 sheet / 2 layer / 80 cm²): dari beberapa sumber sekunder yang konsisten; versi Light lama (1 sheet, 4×3,2 inci) dari tutorial SFU.
- Tanggal penghentian 7 Juni 2026: dari FAQ resmi Autodesk (help.autodesk.com) dan forum resmi — terverifikasi kuat.
- Detail KiCad 10.0.6 (29 Agu 2026), 32 copper layer, ngspice: dari Wikipedia & linuxlinks — terverifikasi baik.
- Detail Falstad/CircuitJS1 (GPL v2, bukan SPICE): dari freecircuitsim.com & electronicsinfoline — terverifikasi baik.

## Sumber utama
- https://en.wikipedia.org/wiki/Eagle_(program)
- https://www.hackster.io/news/autodesk-announces-the-end-of-eagle-707864d95d7e
- https://help.autodesk.com/view/MAP/2026/ENU/?caas=caas/sfdcarticles/sfdcarticles/Autodesk-EAGLE-Announcement-Next-steps-and-FAQ.html
- https://www.autodesk.com/products/fusion-360/blog/18-things-need-to-know-fusion-360-electronics/
- https://www.autodesk.com/products/fusion-360/blog/pcb-design-with-autodesk-fusion-everything-you-need-to-know/
- https://www.autodesk.com/products/fusion-360/blog/what-is-spice-simulation/
- https://www.g2.com/products/autodesk-eagle/pricing
- https://en.wikipedia.org/wiki/KiCad
- https://www.linuxlinks.com/kicad/
- https://buildpcb.tech/guides/pcb-design-software-beginners.html
- https://www.electronicsinfoline.com/resources/circuit-simulators
- https://freecircuitsim.com/about.html
- https://www.schemalyzer.com/en/blog/easyeda/tutorials/complete-easyeda-tutorial-2025
- https://www.wellpcb.com/blog/pcb-manufacturing/easyeda/
