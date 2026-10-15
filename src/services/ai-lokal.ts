/**
 * Asisten Lokal Madevi — penjawab offline berbasis aturan.
 *
 * Ini adalah SIMULASI yang jujur: tidak ada AI eksternal, tidak ada API.
 * Semua jawaban dihasilkan lokal dari pengetahuan tentang struktur Madevi.
 * Dilabeli jelas sebagai "Mode Lokal" di UI.
 */

export interface LocalAnswer {
  answer: string;
  suggestions: string[];
}

interface Rule {
  patterns: RegExp[];
  answerId: string;
  answerEn: string;
  suggestionsId: string[];
  suggestionsEn: string[];
}

const RULES: Rule[] = [
  {
    patterns: [/ruang|room|fitur|menu/i],
    answerId: 'Madevi punya 7 ruang:\n\n1. **Explore & Learn** — peta konsep dan pengetahuan\n2. **Tutorial & Problem Solve** — panduan langkah-demi-langkah\n3. **Madevi School** — sekolah digital berjenjang\n4. **Madevi Line** — komunitas sosial\n5. **Madevi Shop** — katalog afiliasi\n6. **Tools & Equipment** — peralatan gratis\n7. **Madevi Services** — jasa digital berbayar\n\nBuka menu sidebar untuk menjelajah.',
    answerEn: 'Madevi has 7 rooms:\n\n1. **Explore & Learn** — concept and knowledge map\n2. **Tutorial & Problem Solve** — step-by-step guides\n3. **Madevi School** — tiered digital school\n4. **Madevi Line** — social community\n5. **Madevi Shop** — affiliate catalog\n6. **Tools & Equipment** — free tools\n7. **Madevi Services** — paid digital services\n\nOpen the sidebar menu to explore.',
    suggestionsId: ['Apa itu Tutorial & Problem Solve?', 'Bagaimana cara belanja di Madevi Shop?'],
    suggestionsEn: ['What is Tutorial & Problem Solve?', 'How to shop at Madevi Shop?'],
  },
  {
    patterns: [/tutorial|panduan|cara|langkah|problem/i],
    answerId: '**Tutorial & Problem Solve** berisi panduan menyelesaikan masalah apapun: kehidupan, kerja, alat, belajar, perbaikan, hingga kesehatan mental.\n\nFormat setiap panduan:\n• Masalah → penjelasan\n• Persiapan alat\n• Cara/langkah\n• Risiko\n• Penyelesaian\n\nTips: gunakan tombol "Jadikan checklist" pada daftar langkah agar bisa dicentang satu per satu.',
    answerEn: '**Tutorial & Problem Solve** contains guides for solving any problem: life, work, tools, learning, repairs, even mental health.\n\nEach guide format:\n• Problem → explanation\n• Tool preparation\n• Steps\n• Risks\n• Resolution\n\nTip: use the "Make checklist" button on step lists to check them off one by one.',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Madevi School?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Madevi School?'],
  },
  {
    patterns: [/sekolah|school|kelas|ujian|semester|belajar/i],
    answerId: '**Madevi School** adalah sekolah digital berjenjang:\n• Anak usia dini → pendidikan tinggi\n• Termasuk sekolah kebutuhan khusus & sekolah agama\n• Sistem: aturan, bab, materi, semester, soal latihan, ujian, kenaikan kelas\n• SMK/Diploma punya kejuruan/jurusan\n\nKurikulum mengikuti tahun ajaran yang berlaku.',
    answerEn: '**Madevi School** is a tiered digital school:\n• Early childhood → higher education\n• Includes special-needs & religious schools\n• System: rules, chapters, materials, semesters, exercises, exams, grade promotion\n• Vocational tracks for SMK/Diploma\n\nCurriculum follows the current academic year.',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Madevi Line?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Madevi Line?'],
  },
  {
    patterns: [/line|sosial|social|komunitas|community|teman|curhat/i],
    answerId: '**Madevi Line** adalah ruang sosial semua pengguna:\n• **Sosial Karya** — bagikan ide/karya/inovasi; jika admin suka, diposting sebagai sumbangsih\n• **Sosial Curhat** — keluarkan isi hati; pengguna lain bisa memberi saran & semangat\n\nSeperti sosmed: tambah teman, inbox, kirim file/foto/video, buat grup.\n\nDilindungi dari: pornografi, pengancaman, kekerasan, pelecehan.',
    answerEn: '**Madevi Line** is the social space for all users:\n• **Sosial Karya** — share ideas/works/innovations; if admin likes it, posted as contribution\n• **Sosial Curhat** — express feelings; others can give advice & support\n\nLike social media: add friends, inbox, send files/photos/videos, create groups.\n\nProtected from: pornography, threats, violence, harassment.',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Bagaimana cara belanja di Madevi Shop?'],
    suggestionsEn: ['What rooms are in Madevi?', 'How to shop at Madevi Shop?'],
  },
  {
    patterns: [/shop|belanja|beli|affiliate|afiliasi|toko/i],
    answerId: '**Madevi Shop** adalah katalog afiliasi:\n• Menampilkan barang orang lain lewat link afiliasi\n• Foto & deskripsi sama persis dengan di marketplace\n• Pembelian dilakukan LANGSUNG di link marketplace (bukan di web Madevi)\n• Bisa tanya admin via chat & simpan ke wishlist',
    answerEn: '**Madevi Shop** is an affiliate catalog:\n• Shows others\' products via affiliate links\n• Photos & descriptions match the marketplace exactly\n• Purchase happens DIRECTLY on the marketplace link (not on Madevi web)\n• Can ask admin via chat & save to wishlist',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Tools & Equipment?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Tools & Equipment?'],
  },
  {
    patterns: [/tool|alat|equipment|gratis|free/i],
    answerId: '**Tools & Equipment** adalah versi GRATIS dari fitur web.\n\nPrinsip: jangan dicampur dengan jasa berbayar. Semua yang di sini bisa dipakai bebas tanpa bayar.',
    answerEn: '**Tools & Equipment** is the FREE version of web features.\n\nPrinciple: never mixed with paid services. Everything here is free to use.',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Madevi Services?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Madevi Services?'],
  },
  {
    patterns: [/jasa|service|layanan|bayar|harga|price/i],
    answerId: '**Madevi Services** adalah jasa digital berbayar — usaha penghasilan.\n\nSemua pembayaran dalam mode prototype adalah SIMULASI berlabel jujur. Saat go-live, tinggal ganti ke gateway nyata.',
    answerEn: '**Madevi Services** are paid digital services — a revenue business.\n\nAll payments in prototype mode are honestly-labeled SIMULATIONS. At go-live, just swap to a real gateway.',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Tools & Equipment?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Tools & Equipment?'],
  },
  {
    patterns: [/halo|hai|hello|hi|pagi|siang|sore|malam/i],
    answerId: 'Halo! Saya asisten lokal Madevi (Mode Lokal — bekerja offline tanpa AI eksternal).\n\nSaya bisa membantu menjelaskan 7 ruang Madevi, cara memakai fitur, dan navigasi web. Mau tahu tentang apa?',
    answerEn: 'Hello! I\'m Madevi\'s local assistant (Local Mode — works offline, no external AI).\n\nI can explain Madevi\'s 7 rooms, how to use features, and web navigation. What would you like to know?',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Tutorial & Problem Solve?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Tutorial & Problem Solve?'],
  },
  {
    patterns: [/tema|theme|dark|light|gelap|terang|madevi on/i],
    answerId: 'Madevi punya 3 tema:\n• **Dark** (default) — nyaman untuk kerja malam\n• **Light** — tema kerja terang\n• **Madevi On** — identitas brand (opt-in)\n\nGanti tema lewat tombol tema di header.',
    answerEn: 'Madevi has 3 themes:\n• **Dark** (default) — comfortable for night work\n• **Light** — bright work theme\n• **Madevi On** — brand identity (opt-in)\n\nSwitch themes via the theme button in the header.',
    suggestionsId: ['Ruang apa saja di Madevi?'],
    suggestionsEn: ['What rooms are in Madevi?'],
  },
  {
    patterns: [/bantuan|help|tolong|bingung/i],
    answerId: 'Saya bisa membantu dengan:\n• Penjelasan 7 ruang Madevi\n• Cara memakai fitur (checklist, tema, pencarian)\n• Navigasi web\n\nCoba tanya: "Ruang apa saja di Madevi?" atau "Apa itu Madevi School?"',
    answerEn: 'I can help with:\n• Explaining Madevi\'s 7 rooms\n• How to use features (checklists, themes, search)\n• Web navigation\n\nTry asking: "What rooms are in Madevi?" or "What is Madevi School?"',
    suggestionsId: ['Ruang apa saja di Madevi?', 'Apa itu Tutorial & Problem Solve?'],
    suggestionsEn: ['What rooms are in Madevi?', 'What is Tutorial & Problem Solve?'],
  },
];

const FALLBACK_ID = 'Maaf, saya hanya asisten lokal dengan pengetahuan terbatas tentang Madevi. Saya bisa menjelaskan 7 ruang, fitur, dan cara memakai web ini.\n\nCoba tanya tentang: ruang, tutorial, sekolah, line, shop, tools, jasa, atau tema.';
const FALLBACK_EN = 'Sorry, I\'m only a local assistant with limited knowledge about Madevi. I can explain the 7 rooms, features, and how to use this web.\n\nTry asking about: rooms, tutorials, school, line, shop, tools, services, or themes.';

export function answerLocally(message: string, isId: boolean): LocalAnswer {
  const text = message.trim();

  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      return {
        answer: isId ? rule.answerId : rule.answerEn,
        suggestions: isId ? rule.suggestionsId : rule.suggestionsEn,
      };
    }
  }

  return {
    answer: isId ? FALLBACK_ID : FALLBACK_EN,
    suggestions: isId
      ? ['Ruang apa saja di Madevi?', 'Bantuan']
      : ['What rooms are in Madevi?', 'Help'],
  };
}
