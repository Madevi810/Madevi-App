# Riset: Tools & Equipment (19 Okt 2026)

Referensi utama pola interaksi: phet-analisis.md (sudah ada).
Tambahan 15+ sumber:

## 15+ Sumber Dianalisis

### 1. PhET Colorado (phet.colorado.edu)
Lihat phet-analisis.md. **Keputusan**: ✅ Diadopsi (ParamSlider, SimControls, multi-representasi)

### 2. Calculator.net
**AMATI**: 200+ kalkulator, tiap alat fokus satu tugas, hasil instan, penjelasan rumus.
**TIRU**: Satu tool = satu tugas; hasil + rumus ditampilkan.
**MODIFIKASI**: Bahasa Indonesia; contoh terisi otomatis.
**Keputusan**: ✅ Diadopsi (pola kalkulator fokus)

### 3. Omni Calculator
**AMATI**: Kalkulator dengan konteks ("untuk apa"), slider interaktif, penjelasan visual.
**TIRU**: Slider untuk input; konteks penggunaan.
**MODIFIKASI**: Sudah ada ParamSlider.
**Keputusan**: ✅ Diadopsi

### 4. RapidTables
**AMATI**: Konversi satuan lengkap, tabel referensi, tanpa distraksi.
**TIRU**: Tabel konversi cepat; minim klik.
**MODIFIKASI**: Sudah ada tools konversi.
**Keputusan**: ✅ Diadopsi

### 5. Desmos (desmos.com/calculator)
**AMATI**: Grafik interaktif real-time, geser parameter lihat perubahan.
**TIRU**: Grafik fungsi sudah ada (sim-grafik-fungsi).
**MODIFIKASI**: Tambah input fungsi bebas (rencana).
**Keputusan**: ✅ Diadopsi sebagian

### 6. GeoGebra
**AMATI**: Geometri interaktif, konstruksi langkah demi langkah.
**TIRU**: Konstruksi geometri bertahap.
**MODIFIKASI**: Rencana Fase C lanjutan (belum).
**Keputusan**: ⏳ Ditunda (kompleksitas tinggi)

### 7. QR Code Generator (qr-code-generator.com)
**AMATI**: Opsi lengkap (warna, logo, format unduh), pratinjau live.
**TIRU**: Pratinjau live + unduh.
**MODIFIKASI**: Tool QR sudah ada; tambah unduh PNG/SVG.
**Keputusan**: ✅ Diadopsi

### 8. Canva (bagian alat gratis)
**AMATI**: Template + drag-drop, hasil langsung terlihat.
**TIRU**: Pratinjau langsung untuk tool desain.
**MODIFIKASI**: Tanpa drag-drop kompleks (HP); form + pratinjau.
**Keputusan**: ✅ Diadopsi sebagian

### 9. Figma Community (alat gratis)
**AMATI**: Plugin kecil yang menyelesaikan satu masalah.
**TIRU**: Filosofi "satu tool satu masalah".
**MODIFIKASI**: Sudah sesuai registry.
**Keputusan**: ✅ Diadopsi (filosofi)

### 10. WolframAlpha
**AMATI**: Input bahasa natural, langkah penyelesaian, multi-representasi.
**TIRU**: "Langkah penyelesaian" untuk kalkulator matematika.
**MODIFIKASI**: Tambah langkah di tool matematika (rencana).
**Keputusan**: ✅ Diadopsi sebagian

### 11. Symbolab
**AMATI**: Langkah demi langkah penyelesaian soal matematika.
**TIRU**: Langkah penyelesaian rinci.
**MODIFIKASI**: Bahasa Indonesia.
**Keputusan**: ✅ Diadopsi (rencana)

### 12. Aplikasi "Kalkulator Kehamilan" (lokal Indonesia)
**AMATI**: Input tanggal → output kalender; konteks lokal.
**TIRU**: Tool kalender haid sudah ada; pola sama untuk tool tanggal lain.
**MODIFIKASI**: Sudah ada.
**Keputusan**: ✅ Diadopsi

### 13. Zakat Calculator (baznas.go.id)
**AMATI**: Perhitungan sesuai fikih, nisab terkini, penjelasan dalil.
**TIRU**: Tool zakat sudah ada; pastikan nisab bisa diperbarui.
**MODIFIKASI**: Nisab sebagai konstanta yang mudah diubah.
**Keputusan**: ✅ Diadopsi

### 14. Situs Pajak (pajak.go.id - kalkulator PPh)
**AMATI**: Tarif progresif, PTKP, contoh kasus.
**TIRU**: Tool PPh sudah ada; tambah contoh kasus.
**MODIFIKASI**: Tarif sebagai konstanta; catat tahun berlaku.
**Keputusan**: ✅ Diadopsi

### 15. BMI Calculator (kemkes.go.id)
**AMATI**: Kategori + saran kesehatan, bukan sekadar angka.
**TIRU**: Tiap tool beri interpretasi, bukan angka mentah.
**MODIFIKASI**: Sudah ada di beberapa; standarkan ke semua.
**Keputusan**: ✅ Diadopsi (interpretasi hasil)

### 16. Random Picker (pickerwheel.com)
**AMATI**: Visual memutar, adil, bisa eliminasi.
**TIRU**: Tool acak nama sudah ada; tambah mode eliminasi.
**MODIFIKASI**: Rencana kecil.
**Keputusan**: ✅ Diadopsi sebagian

## Daftar Ditolak / Ditunda
- GeoGebra penuh (ditunda, kompleksitas tinggi)

## Fitur Terpilih untuk Tools
1. Satu tool = satu tugas, hasil instan (Calculator.net)
2. Tiap hasil ada interpretasi, bukan angka mentah (Kemkes)
3. Langkah penyelesaian untuk matematika (Symbolab/Wolfram)
4. Pratinjau live + unduh (QR Generator)
5. Konstanta lokal mudah diperbarui (nisab, tarif pajak, PTKP)
6. Contoh terisi otomatis di tiap tool
7. ToolRunner generik sudah ada — pertahankan
