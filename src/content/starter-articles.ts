export interface StarterArticle {
  id: string;
  title: string;
  space: 'Madevi School' | 'Explore & Learn';
  category: string;
  summary: string;
  source: { title: string; publisher: string; url: string };
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  safety?: string;
}

/**
 * L06: STARTER_ARTICLES adalah fixture development berlabel CONTOH/DRAFT.
 * Bukan artikel terbit database, bukan package production, dan tidak boleh
 * menentukan availability/published state runtime. Route `/artikel/[id]`
 * merender fixture ini via StarterArticlePage berlabel DRAFT; daftar runtime
 * (Home/Explore/School) hanya menampilkan artikel PUBLISHED via API + policy.
 */

export const STARTER_ARTICLES: readonly StarterArticle[] = [
  {
    id: 'school-belajar-dengan-tujuan', title: 'Belajar dengan Tujuan yang Bisa Dilihat', space: 'Madevi School', category: 'Brosur Program',
    summary: 'Mengubah keinginan belajar yang luas menjadi tujuan kecil dengan bukti yang dapat diamati.',
    source: { title: 'Education 2030: Incheon Declaration and Framework for Action', publisher: 'UNESCO', url: 'https://unesdoc.unesco.org/ark:/48223/pf0000245656' },
    sections: [
      { heading: 'Tujuan baca', paragraphs: ['Pembaca dapat mengubah keinginan umum menjadi satu tujuan belajar yang dapat diamati, tanpa klaim nilai atau sertifikat resmi.'] },
      { heading: 'Langkah sederhana', paragraphs: ['Tulis kemampuan yang ingin dilatih, pilih bukti kecil berupa penjelasan atau latihan, tentukan waktu yang realistis, lalu catat hal yang belum jelas.'] },
      { heading: 'Contoh orisinal', paragraphs: ['Alih-alih “ingin memahami matematika”, tulis “saya dapat menjelaskan mengapa pecahan 1/2 dan 2/4 bernilai sama dengan gambar sendiri”.'] },
      { heading: 'Ringkasan', paragraphs: ['Tujuan yang terlihat membantu memilih latihan dan langkah berikutnya. Ini bukan janji hasil akademik.'] },
    ],
  },
  {
    id: 'school-peta-belajar', title: 'Membuat Peta Belajar Sederhana', space: 'Madevi School', category: 'Brosur Program',
    summary: 'Peta ringkas untuk menghubungkan tujuan, prasyarat, latihan, dan bukti belajar.',
    source: { title: 'Metacognition and Self-Regulated Learning', publisher: 'Education Endowment Foundation', url: 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation' },
    sections: [
      { heading: 'Empat kotak', paragraphs: ['Mulai dari tujuan, prasyarat, latihan, dan bukti. Jika satu langkah terlalu besar, pecah menjadi dua.'] },
      { heading: 'Contoh', paragraphs: ['Untuk menjelaskan siklus air: prasyaratnya penguapan dan kondensasi; latihan berupa diagram; bukti berupa penjelasan satu menit.'] },
      { heading: 'Batas akses', paragraphs: ['Artikel ini tidak membuka modul, ujian, progres, atau sertifikat yang belum tersedia.'] },
    ],
  },
  {
    id: 'school-refleksi-belajar', title: 'Refleksi Setelah Belajar', space: 'Madevi School', category: 'Brosur Program',
    summary: 'Tiga pertanyaan refleksi untuk memilih langkah belajar berikutnya.',
    source: { title: 'Retrieval Practice', publisher: 'The Learning Scientists', url: 'https://www.learningscientists.org/blog/2016/6/23-1' },
    sections: [
      { heading: 'Tiga pertanyaan', paragraphs: ['Apa yang sekarang lebih dipahami? Bukti apa yang mendukungnya? Bagian mana yang perlu dicoba lagi?'] },
      { heading: 'Kesalahan umum', paragraphs: ['Menulis “semuanya sudah jelas” tanpa bukti, atau menganggap kesulitan sebagai kegagalan tetap.'] },
      { heading: 'Ringkasan', paragraphs: ['Refleksi singkat dan spesifik membantu merencanakan latihan berikutnya. Preview ini tidak menyimpan jawaban.'] },
    ],
  },
  {
    id: 'explore-mengamati-langit', title: 'Mengamati Langit dengan Catatan', space: 'Explore & Learn', category: 'Sains & Alam',
    summary: 'Mengubah pengamatan langit menjadi catatan sederhana yang dapat dibandingkan.',
    source: { title: 'Skywatching Tips', publisher: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/skywatching/en/' },
    safety: 'Jangan menatap Matahari langsung. Pilih tempat aman dengan pandangan terbuka.',
    sections: [
      { heading: 'Langkah', paragraphs: ['Catat tanggal, waktu, arah pandang, kondisi awan, dan hal yang terlihat. Gambar bentuk umum tanpa mengubah dugaan menjadi fakta.'] },
      { heading: 'Kesalahan umum', paragraphs: ['Mengandalkan ingatan atau mencatat detail yang tidak dapat diperiksa.'] },
      { heading: 'Jalur lanjut', paragraphs: ['Gunakan pola yang sama untuk mengamati perubahan awan atau panjang bayangan.'] },
    ],
  },
  {
    id: 'explore-siklus-air', title: 'Siklus Air di Sekitar Kita', space: 'Explore & Learn', category: 'Sains & Alam',
    summary: 'Peta dasar perpindahan air antara permukaan Bumi, tanah, dan atmosfer.',
    source: { title: 'The Water Cycle', publisher: 'U.S. Geological Survey', url: 'https://www.usgs.gov/special-topics/water-science-school/science/water-cycle' },
    sections: [
      { heading: 'Konsep inti', paragraphs: ['Penguapan, kondensasi, presipitasi, dan aliran permukaan membantu memetakan sebagian perpindahan air.'] },
      { heading: 'Pengamatan aman', paragraphs: ['Amati genangan yang berkurang tanpa menyentuh air yang tidak diketahui kebersihannya.'] },
      { heading: 'Ringkasan', paragraphs: ['Siklus air adalah jaringan perpindahan, bukan urutan lurus yang selalu sama.'] },
    ],
  },
  {
    id: 'explore-eksperimen-bayangan', title: 'Eksperimen Bayangan Sederhana', space: 'Explore & Learn', category: 'Sains & Alam',
    summary: 'Mengamati hubungan arah cahaya, posisi benda, dan bentuk bayangan.',
    source: { title: 'What Is a Shadow?', publisher: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/review/shadows/shadows.html' },
    safety: 'Gunakan senter aman; jangan memakai api, listrik terbuka, laser, atau menyorot mata. Anak perlu pendampingan orang dewasa.',
    sections: [
      { heading: 'Perlengkapan', paragraphs: ['Senter kecil yang aman, benda tidak tajam, kertas, dan pensil.'] },
      { heading: 'Langkah', paragraphs: ['Letakkan benda di depan kertas, arahkan cahaya dari satu sisi, tandai bayangan, lalu ubah jarak cahaya secara perlahan.'] },
      { heading: 'Kesalahan umum', paragraphs: ['Mengubah banyak variabel sekaligus atau menyimpulkan lebih luas daripada pengamatan.'] },
    ],
  },
];

export function starterArticleById(id: string) {
  return STARTER_ARTICLES.find((article) => article.id === id) ?? null;
}
