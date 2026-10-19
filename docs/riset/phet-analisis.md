# Analisis Referensi: PhET Interactive Simulations (phet.colorado.edu)

Tanggal riset: 18 Oktober 2026
Sumber: phet.colorado.edu (halaman utama, browse, teaching-resources, licensing, help center) + Wikipedia + SceneryStack docs + artikel pihak ketiga.
Status: semua klaim di bawah diverifikasi dari sumber-sumber tersebut. Tidak ada kunjungan interaktif ke dalam simulasi (hanya teks halaman).

---

## 1. Ringkasan

PhET Interactive Simulations adalah proyek University of Colorado Boulder, didirikan 2002 oleh peraih Nobel Fisika **Carl Wieman**. Non-profit. Misi: simulasi STEM interaktif **gratis** berbasis riset pendidikan.

Skala (per data situs):
- **173** simulasi interaktif
- **132** terjemahan bahasa
- **3703** pelajaran yang dikirim guru (teacher-submitted lessons)
- **1,8 miliar+** simulasi telah dijalankan/delivered
- Tim ~16 orang: profesor, postdoc, peneliti pendidikan, spesialis edukasi, software engineer, guru, admin. Direktur: Dr. Katherine Perkins.

Filosofi inti (dari halaman Teaching Resources): "siswa belajar paling baik saat menjadi **partisipan aktif**, bukan penerima informasi pasif." Simulasi dirancang memancing rasa ingin tahu dan "productive struggle" — siswa bereksplorasi seperti ilmuwan: mengubah variabel, melihat hasil seketika, menguji hipotesis di lingkungan aman.

---

## 2. Katalog Simulasi

Lima kategori utama (halaman Browse):

### Fisika (terbanyak)
Contoh populer (terverifikasi dari daftar kurikulum/IB mapping):
- **Ohm's Law** — slider tegangan & resistansi, arus berubah real-time; ukuran simbol persamaan V=IR ikut berubah mengikuti diagram rangkaian
- **Circuit Construction Kit: DC** (dan versi AC) — rakit rangkaian virtual: baterai, resistor, kabel, ammeter; ukur tegangan/arus
- **Forces and Motion: Basics**, **Projectile Motion** — atur sudut/laju awal, hambatan udara; amati lintasan parabola
- **Masses and Springs** — gantung beban di pegas, ukur regangan/periode osilasi, perlambat waktu, ganti planet (gravitasi), ubah konstanta pegas
- **Energy Skate Park** — konversi energi kinetik/potensial skater
- **Pendulum Lab**, **Gravity Force Lab**, **Wave on a String** (ujung tali bisa "diwiggle" pakai mouse), **Balloons and Static Electricity**, **John Travoltage**

### Matematika & Statistika
- **Graphing Lines**, **Graphing Quadratics**, **Graphing Slope-Intercept**
- **Build a Fraction**, **Fraction Matcher**, **Fractions: Intro**
- **Area Builder**, **Proportion Playground**
- **Plinko Probability** (probabilitas), **Curve Fitting**, **Least-Squares Regression**, **Calculus Grapher**

### Kimia
- **Balancing Chemical Equations** (setarakan persamaan reaksi)
- **Build an Atom**, **Build a Molecule**
- **Molarity**, **pH Scale**, **Acid-Base Solutions**
- **States of Matter**, **Gas Properties**, **Reactants, Products and Leftovers**

### Earth & Space
- **Gravity and Orbits**, **My Solar System**, **The Greenhouse Effect**

### Biologi
- **Natural Selection**, dan sim biologi lain (katalog biologi lebih kecil dibanding fisika)

Cara kerja tiap simulasi (pola umum):
1. **Fenomena divisualkan** — yang tak kasat mata (arus listrik, gaya, medan) digambar sebagai animasi/simbol yang bergerak.
2. **Parameter dimanipulasi langsung** — slider, drag objek, tombol radio; hasil terlihat **seketika**.
3. **Hubungan sebab-akibat dieksplorasi** — siswa mengubah satu variabel, variabel lain merespons; konsep muncul dari pola yang diamati, bukan dari ceramah.
4. **Alat ukur virtual** — penggaris, stopwatch, voltmeter, termometer tersedia di dalam sim untuk eksplorasi kuantitatif.

---

## 3. Pola Interaksi (UX yang berulang)

Pola desain yang konsisten di semua sim (dari dokumentasi CU Boulder + SceneryStack):

1. **Kontrol langsung (direct manipulation)** — click-and-drag objek (mis. seret beban ke pegas, wiggle ujung tali), slider untuk parameter numerik, radio button untuk mode.
2. **Umpan balik real-time** — setiap perubahan parameter langsung mengubah visualisasi; tidak ada tombol "hitung/submit".
3. **Multi-representasi sinkron** — contoh Ohm's Law: slider tegangan + diagram rangkaian + persamaan V=IR yang simbolnya membesar/mengecil **bersamaan**. Satu aksi → tiga representasi berubah.
4. **Kontrol simulasi waktu** — tombol play/pause, reset, dan (di sim fisika) *slow motion* / step.
5. **Panel kontrol minimal** — checkbox untuk menampilkan/menyembunyikan elemen (Force, Values, Masses, Speed pada Forces and Motion); tidak membanjiri layar.
6. **Layar ganda (multiple screens)** — sim kompleks dibagi beberapa "screen" per topik; bisa dikustom hanya menampilkan screen tertentu ("Custom Screens").
7. **Aksesibilitas** — sim HTML5 baru punya: alternative input, sound & sonification, interactive description (screen reader), pan & zoom, interactive highlights.
8. **Tanpa teks instruksi panjang** — desain "intuitif, game-like"; panduan eksplorasi datang dari aktivitas guru (worksheet), bukan dari dalam sim.

---

## 4. Pedagogi

Model pedagogi resmi PhET (halaman Teaching Resources):

- **Inquiry-based / guided discovery**: aktivitas harus punya *learning goals* yang jelas, memandu tapi **tidak terlalu mengekang** eksplorasi siswa. Tujuannya "genuine inquiry, bukan answer-seeking".
- **Tiga komponen**: (1) simulasi, (2) desain aktivitas yang thoughtful (tujuan belajar + pertanyaan strategis), (3) fasilitasi guru yang menghargai ide siswa.
- **Pendamping guru**: tiap sim punya *teacher tips* dan *video primer*; database **3703 aktivitas** kiriman guru (ada yang bertanda "gold star" = contoh terbaik); panduan "Writing Learning Goals" dan "Active Learning with PhET".
- **Proses desain berbasis riset**: tiap sim dimulai dari 3–5 orang (ahli konten, guru, peneliti pendidikan, developer). Langkah: identifikasi learning goals yang terbukti sulit di kelas → storyboard → coding → **uji wawancara dengan siswa** → revisi → uji kelas → rilis. Riset mereka menunjukkan pemahaman konsep meningkat saat siswa mengeksplorasi sim **ditambah** lab tradisional.
- **Fleksibel**: bisa dipakai sebagai demo kuliah, lab kelompok kecil, atau PR.

---

## 5. Teknologi

- **HTML5** untuk semua sim modern (jalan di iPad, Chromebook, PC, Mac, Linux, browser modern). Sim lama: Java (dijalankan via CheerpJ di browser) dan Flash (end-of-life 2021, tidak jalan lagi).
- **Open source**: codebase "SceneryStack" di GitHub (github.com/phetsims). Dibangun dengan **JavaScript ES6 modules** + library grafis Scenery milik mereka. Ada sim contoh (example-sim) sebagai template.
- **Lisensi kode**: sim baru dirilis **GPLv3**; library reusable **MIT** (per SceneryStack dev docs).
- **Offline**: sim bisa **diunduh dan dijalankan offline** (terverifikasi dari beberapa sumber).
- **Embed**: bisa di-embed ke blog/website sendiri (untuk penggunaan edukasi non-komersial).
- **PhET-iO**: varian "interoperable" dengan API, kustomisasi, dan streaming data output — **dilisensikan terpisah** (produk berbayar untuk institusi/edtech).
- **Persyaratan**: tidak butuh server khusus; file statis HTML5/JS. Performa di tablet kadang butuh optimasi.

---

## 6. Lisensi / Model Bisnis

Fakta lisensi (halaman https://phet.colorado.edu/en/licensing, diverifikasi langsung):

- **Simulasi**: **CC BY-NC 4.0** (Creative Commons Attribution–NonCommercial). Gratis untuk **penggunaan non-komersial** (kelas, PR, proyek siswa, riset) **dengan atribusi wajib**: "Simulation by PhET Interactive Simulations, University of Colorado Boulder, licensed under CC BY-NC 4.0 (https://phet.colorado.edu)". Logo PhET di dalam sim tidak boleh disembunyikan/diubah.
- **"Commercial use" menurut PhET** = segala penggunaan yang memberi keuntungan komersial atau kompensasi moneter, termasuk: produk berbayar/berlangganan, **website yang didukung iklan**, channel YouTube yang dimonetisasi, materi di Teachers Pay Teachers, penggunaan di marketing/iklan, program distribusi pemerintah/institusi.
- **Penggunaan komersial WAJIB lisensi komersial** dari University of Colorado Boulder (model partnership; ada benefit & layanan tambahan).
- **Implikasi untuk Madevi — PENTING**: Madevi adalah proyek komersial (ada jasa berbayar, paket Plus/Pro). Maka **men-embed langsung sim PhET ke Madevi = penggunaan komersial → butuh lisensi komersial** dari UC Boulder. Jangan embed sim PhET tanpa lisensi tersebut.

---

## 7. Rekomendasi Porting ke Madevi

Prinsip: **jangan porting sim PhET-nya** (terkendala lisensi komersial + atribusi + logo). **Porting yang dimaksud = adopsi pola interaksi, pola pedagogi, dan arsitektur teknisnya**, lalu bangun simulasi edukasi **orisinal** Madevi.

### 7.1. Simulasi edukasi yang bisa dibangun (prioritas)

Bangun sebagai komponen web mandiri (React + Canvas/SVG), pola "satu sim = satu file/page":

1. **Lab Rangkaian DC sederhana** (mirip pola Circuit Construction Kit, tapi versi ringkas): drag baterai/resistor/lampu ke papan, slider tegangan & resistansi, arus & kecerahan lampu berubah real-time + tampilkan V=IR sinkron. → Masuk akal untuk ruang **Tutorial** (elektronika) dan **Tools**.
2. **Gerak parabola interaktif** (pola Projectile Motion): slider sudut & kecepatan awal, tombol "tembak", jejak lintasan + tabel jarak/tinggi. → Tutorial fisika.
3. **Pegas & osilasi** (pola Masses and Springs): drag beban, slider massa & konstanta pegas, grafik simpangan vs waktu real-time. → Tutorial fisika.
4. **Grafik fungsi interaktif** (pola Graphing Lines/Quadratics): slider koefisien a, b, c → kurva y=ax²+bx+c berubah langsung + titik potong ditandai. → School (matematika).
5. **pH & larutan** (pola pH Scale): slider konsentrasi → warna + nilai pH berubah. → School (kimia).
6. **Pecahan visual** (pola Build a Fraction): klik/potong pizza/batang → pecahan senilai. → School (matematika SD).

### 7.2. Pola UX yang diadopsi (konsisten dengan saran Ade: reuse elemen)

- **Slider + hasil real-time** sebagai komponen standar `ParamSlider` (satu komponen, dipakai semua sim).
- **Play/pause/reset** sebagai `SimControls` standar.
- **Multi-representasi sinkron**: tiap sim wajib punya ≥2 representasi yang berubah bersamaan (visual + angka + grafik). Ini pembeda kualitas vs kalkulator biasa.
- **Panel opsi minimal**: checkbox tampil/sembunyi elemen, bukan menu bertingkat.
- **Alat ukur virtual**: penggaris/stopwatch sebagai komponen reuse.
- **Tanpa instruksi panjang**: maksimal 1 kalimat pembuka per sim; panduan dalam bentuk worksheet/artikel pendamping (pola PhET: sim + aktivitas guru).

### 7.3. Pola pedagogi yang diadopsi

- Tiap sim edukasi ditemani **1 artikel/worksheet** format baku Madevi (masalah → penjelasan → persiapan → langkah eksplorasi → pertanyaan "coba pikirkan" → penyelesaian). Ini meniru pasangan "sim + teacher activity" PhET.
- Cantumkan **tujuan belajar eksplisit** di awal tiap sim (pola "Writing Learning Goals" PhET).
- Pertanyaan eksplorasi bersifat terbuka ("apa yang terjadi jika...?"), bukan pilihan ganda semata.

### 7.4. Pola teknis yang diadopsi

- **File statis, tanpa backend**: sim berjalan 100% di browser (Canvas/SVG + requestAnimationFrame) — cocok untuk hosting Vercel dan murah.
- **Satu sim = satu komponen terisolasi** dengan state parameter → fungsi render. Mudah di-test (unit test untuk fungsi fisikanya, mis. hukum Ohm, kinematika).
- **Struktur kode**: pisahkan *model* (fisika/matematika murni, bisa di-unit-test) dari *view* (rendering). Ini meniru pemisahan SceneryStack.
- **Aksesibilitas bertahap**: label ARIA di slider, dukungan keyboard untuk kontrol utama (tidak harus sonifikasi penuh di awal).

### 7.5. Yang TIDAK dilakukan

- Tidak meng-embed iframe phet.colorado.edu (butuh lisensi komersial).
- Tidak menyalin aset/gambar/desain visual PhET (logo & brand dilindungi trademark).
- Tidak mengklaim konten sebagai "PhET".

---

## 8. Sumber

- https://phet.colorado.edu/ (homepage: 173 sims, 132 translations, 3703 lessons, founded 2002 by Carl Wieman)
- https://phet.colorado.edu/en/simulations/browse (5 kategori)
- https://phet.colorado.edu/en/teaching-resources (filosofi pedagogi, guides, videos)
- https://phet.colorado.edu/en/licensing (CC BY-NC 4.0, definisi commercial use, atribusi)
- https://phet.colorado.edu/en/help-center/running-sims (HTML5/Java/Flash, CheerpJ, system requirements)
- https://en.wikipedia.org/wiki/PhET (tim ~16 orang, proses desain: learning goals → storyboard → student interviews → classroom testing)
- http://scenerystack.org/info-sync/simulation-development-overview/ (GPLv3 untuk sim, MIT untuk library, ES6 modules)
- https://www.colorado.edu/csl/programs/phet-interactive-simulations (click-and-drag, sliders, radio buttons, rulers/stopwatches/voltmeters/thermometers)
- https://learntoscale.org/stories-of-scaling/phet/ (CC BY licensing, SceneryStack open-source community)
