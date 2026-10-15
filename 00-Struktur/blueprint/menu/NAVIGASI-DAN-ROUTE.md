# Blueprint Menu — Navigasi, Route, dan Deep Link

## Aturan

1. Menu mengarah hanya ke route/alur yang tersedia. Ia tidak menjadi daftar roadmap atau status
   produk palsu.
2. URL adalah sumber state kanonis untuk pilihan ruang yang dapat dibagikan, reload,
   Back/Forward, dan deep-link.
3. Header/search/sidebar/breadcrumb memiliki hierarki berbeda dan tidak boleh berlomba sebagai
   navigasi utama yang sama.
4. Search adalah satu modal plane di atas drawer/sidebar; dropdown harus berada dalam viewport
   dan dapat ditutup Escape/klik luar bila relevan.
5. Route tiga tingkat atau lebih memakai breadcrumb yang ringkas tanpa mengambil ruang konten.

## Peta ruang publik yang dipertahankan

Explore, Tutorial, School, Line, Services, Shop, Tools, Profile, Auth, dan Admin hanya boleh
ditampilkan menurut kontrak navigasi/data aktif di `../../Madevi_Off/src/contracts/navigation`.
Item menu baru memerlukan ID blueprint dan QA route/deep-link sebelum diaktifkan.
