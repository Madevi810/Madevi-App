import crypto from 'node:crypto';

import {
  createScriptPool,
  databaseScriptContext,
  parseOptions,
  printSafe,
  quoteIdentifier,
  safeSchema,
} from '../../../scripts/lib/database.mjs';

/**
 * Seed artikel pilot Explore (A00-batch, D05).
 * Tiga artikel untuk tiga leaf J paket madevi-explore-pilot-v1 rev aktif:
 * - Observasi Cuaca Harian (R2.D1.K1.M1.T1.J1)
 * - Membuat Kata Sandi yang Kuat (R2.D2.K1.M1.T1.J1)
 * - Merangkum Paragraf (R2.D3.K1.M1.T1.J1)
 *
 * Idempoten per business_code (hapus lalu tulis ulang dalam satu transaksi).
 * Sumber hanya URL tingkat beranda resmi + tanggal akses (tanpa kutipan palsu).
 * Setiap artikel ikut diproyeksikan ke indeks search (ARTICLE, MEMBER).
 */
const options = parseOptions(process.argv.slice(2));
const { config } = databaseScriptContext(import.meta.url);
const schemaName = safeSchema(options.schema ?? config.MADEVI_DB_SCHEMA ?? 'madevi');
const schema = quoteIdentifier(schemaName);
const pool = createScriptPool(config);

const OWNER_ID = process.env.MADEVI_SEED_OWNER_ID ?? '71000000-0000-4000-8000-000000000001';

const ARTICLES = [
  {
    businessCode: 'ART-PILOT-CUACA-HARIAN',
    pathCode: 'R2.D1.K1.M1.T1.J1',
    title: 'Observasi Cuaca Harian',
    slug: 'observasi-cuaca-harian',
    summary:
      'Cara mengamati cuaca harian secara mandiri: suhu, awan, angin, dan hujan dengan alat sederhana serta pencatatan rutin.',
    language: 'id',
    readingMinutes: 6,
    blocks: [
      { type: 'HEADING', content: { level: 2, text: 'Tujuan' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Setelah membaca artikel ini, kamu dapat mencatat kondisi cuaca harian — suhu, jenis awan, arah angin, dan curah hujan — memakai alat sederhana di rumah atau sekolah.',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Empat hal yang diamati' } },
      {
        type: 'LIST',
        content: {
          style: 'ordered',
          items: [
            'Suhu: baca termometer pada waktu yang sama setiap hari (misalnya pukul 07.00 dan 14.00).',
            'Awan: catat jenis dominan — cerah, berawan sebagian, mendung, atau hujan.',
            'Angin: perhatikan arah (gunakan kompas atau bendera) dan kekuatannya.',
            'Hujan: ukur dengan gelas penampung sederhana dalam milimeter per hari.',
          ],
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Langkah pencatatan' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Siapkan tabel tanggal, suhu pagi, suhu siang, awan, angin, dan hujan. Isi setiap hari selama minimal dua minggu agar polanya terlihat. Bandingkan catatanmu dengan prakiraan resmi untuk melatih ketelitian.',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Kesalahan umum' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Jangan mengukur suhu di bawah sinar matahari langsung atau dekat dinding panas. Jangan menyimpulkan iklim dari satu hari pengamatan — cuaca adalah kondisi harian, iklim adalah pola jangka panjang.',
        },
      },
    ],
    sources: [
      {
        title: 'BMKG — Informasi Cuaca Indonesia',
        author: 'Badan Meteorologi, Klimatologi, dan Geofisika',
        publisher: 'BMKG',
        url: 'https://www.bmkg.go.id',
        accessed: '2026-09-23',
      },
      {
        title: 'WMO — Weather Basics',
        author: 'World Meteorological Organization',
        publisher: 'WMO',
        url: 'https://wmo.int',
        accessed: '2026-09-23',
      },
    ],
    mcqs: [
      {
        stem: 'Empat unsur cuaca harian yang dicatat dalam artikel ini adalah?',
        options: [
          { key: 'A', text: 'Suhu, awan, angin, dan hujan' },
          { key: 'B', text: 'Iklim, musim, garis lintang, dan ketinggian' },
          { key: 'C', text: 'Gempa, tsunami, banjir, dan longsor' },
          { key: 'D', text: 'Pagi, siang, sore, dan malam' },
        ],
        correct: 'A',
      },
      {
        stem: 'Mengapa pengukuran suhu tidak boleh di bawah sinar matahari langsung?',
        options: [
          { key: 'A', text: 'Agar termometer tidak rusak permanen' },
          { key: 'B', text: 'Karena hasilnya memantulkan suhu permukaan, bukan suhu udara' },
          { key: 'C', text: 'Karena melanggar aturan BMKG' },
          { key: 'D', text: 'Agar pengamatan lebih cepat selesai' },
        ],
        correct: 'B',
      },
    ],
    essay: {
      stem: 'Jelaskan perbedaan cuaca dan iklim, lalu sebutkan mengapa pencatatan minimal dua minggu dianjurkan!',
      rubric:
        'Menjelaskan cuaca sebagai kondisi harian dan iklim sebagai pola jangka panjang, serta alasan melihat pola bukan titik tunggal.',
      maxScore: 8,
    },
  },
  {
    businessCode: 'ART-PILOT-KATA-SANDI-KUAT',
    pathCode: 'R2.D2.K1.M1.T1.J1',
    title: 'Membuat Kata Sandi yang Kuat',
    slug: 'membuat-kata-sandi-yang-kuat',
    summary:
      'Panduan membuat kata sandi kuat: frasa acak panjang, unik per akun, verifikasi dua langkah, dan pengelola kata sandi.',
    language: 'id',
    readingMinutes: 5,
    blocks: [
      { type: 'HEADING', content: { level: 2, text: 'Tujuan' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Setelah membaca artikel ini, kamu dapat membuat kata sandi yang kuat, berbeda untuk setiap akun penting, dan melindunginya dengan verifikasi dua langkah.',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Aturan praktis' } },
      {
        type: 'LIST',
        content: {
          style: 'ordered',
          items: [
            'Panjang minimal 12 karakter; frasa 4–5 kata acak lebih kuat dan mudah diingat daripada 8 karakter rumit.',
            'Satu akun satu kata sandi — jangan mendaur ulang kata sandi email untuk akun lain.',
            'Aktifkan verifikasi dua langkah (OTP/aplikasi autentikator) pada email dan akun penting.',
            'Simpan di pengelola kata sandi, bukan di catatan, tangkapan layar, atau chat.',
          ],
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Yang harus dihindari' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Hindari nama, tanggal lahir, nomor HP, dan pola keyboard. Jangan pernah memberikan kode OTP kepada siapa pun — termasuk yang mengaku petugas. Ganti segera kata sandi yang pernah bocor atau dipakai ulang.',
        },
      },
    ],
    sources: [
      {
        title: 'NIST Digital Identity Guidelines',
        author: 'National Institute of Standards and Technology',
        publisher: 'NIST',
        url: 'https://pages.nist.gov/800-63-3/',
        accessed: '2026-09-23',
      },
      {
        title: 'Google Safety Center Indonesia',
        author: 'Google',
        publisher: 'Google',
        url: 'https://safety.google/intl/id_id/',
        accessed: '2026-09-23',
      },
    ],
    mcqs: [
      {
        stem: 'Mengapa satu kata sandi tidak boleh dipakai ulang untuk banyak akun?',
        options: [
          { key: 'A', text: 'Agar mudah diingat semuanya' },
          { key: 'B', text: 'Karena satu kebocoran akan membuka semua akun' },
          { key: 'C', text: 'Karena melanggar hukum' },
          { key: 'D', text: 'Agar email tidak penuh' },
        ],
        correct: 'B',
      },
      {
        stem: 'Praktik teraman untuk menyimpan banyak kata sandi unik adalah?',
        options: [
          { key: 'A', text: 'Tangkapan layar di galeri HP' },
          { key: 'B', text: 'Catatan di aplikasi chat' },
          { key: 'C', text: 'Pengelola kata sandi' },
          { key: 'D', text: 'Menghafal semuanya tanpa pola' },
        ],
        correct: 'C',
      },
    ],
    essay: {
      stem: 'Jelaskan mengapa frasa panjang lebih baik daripada kata pendek rumit, dan apa peran verifikasi dua langkah!',
      rubric:
        'Menjelaskan hubungan panjang-kekuatan terhadap tebakan dan peran lapisan kedua saat kata sandi bocor.',
      maxScore: 8,
    },
  },
  {
    businessCode: 'ART-PILOT-MERANGKUM-PARAGRAF',
    pathCode: 'R2.D3.K1.M1.T1.J1',
    title: 'Merangkum Paragraf',
    slug: 'merangkum-paragraf',
    summary:
      'Teknik merangkum paragraf: temukan ide pokok, buang detail pendukung, dan tulis ulang maksimal sepertiga panjang asli.',
    language: 'id',
    readingMinutes: 5,
    blocks: [
      { type: 'HEADING', content: { level: 2, text: 'Tujuan' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Setelah membaca artikel ini, kamu dapat merangkum satu paragraf menjadi satu-dua kalimat tanpa menghilangkan ide pokoknya.',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Tiga langkah' } },
      {
        type: 'LIST',
        content: {
          style: 'ordered',
          items: [
            'Baca utuh lalu tanyakan: apa satu hal terpenting yang disampaikan penulis?',
            'Coret contoh, data ilustratif, dan pengulangan — simpan hanya klaim utama.',
            'Tulis ulang dengan kalimatmu sendiri, maksimal sepertiga panjang asli.',
          ],
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Cara memeriksa' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Bandingkan ringkasan dengan paragraf asli: tidak boleh ada fakta baru, tidak boleh ada opini yang tidak ada di teks, dan pembaca ringkasan harus memahami inti tanpa membaca aslinya.',
        },
      },
    ],
    sources: [
      {
        title: 'Kementerian Pendidikan Dasar dan Menengah',
        author: 'Kemendikdasmen',
        publisher: 'Kemendikdasmen',
        url: 'https://www.kemdikbud.go.id',
        accessed: '2026-09-23',
      },
    ],
    mcqs: [
      {
        stem: 'Langkah pertama yang benar saat merangkum paragraf adalah?',
        options: [
          { key: 'A', text: 'Menyalin kalimat pertama apa adanya' },
          { key: 'B', text: 'Membaca utuh lalu menemukan ide pokok' },
          { key: 'C', text: 'Menghitung jumlah kata' },
          { key: 'D', text: 'Mencari kata sulit lalu berhenti' },
        ],
        correct: 'B',
      },
      {
        stem: 'Ciri ringkasan yang baik adalah?',
        options: [
          { key: 'A', text: 'Lebih panjang dari teks asli agar lengkap' },
          { key: 'B', text: 'Menambah opini pribadi agar menarik' },
          { key: 'C', text: 'Menyampaikan inti tanpa fakta baru' },
          { key: 'D', text: 'Memakai kalimat asli seluruhnya' },
        ],
        correct: 'C',
      },
    ],
    essay: {
      stem: 'Rangkumlah satu paragraf berita pilihanmu menjadi maksimal dua kalimat, lalu jelaskan apa yang kamu buang dan mengapa!',
      rubric:
        'Ringkasan memuat ide pokok, membuang detail pendukung secara sadar, dan alasannya dijelaskan.',
      maxScore: 8,
    },
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const article of ARTICLES) {
      const tax = await client.query(
        `SELECT node_id FROM ${schema}.taxonomy_nodes
          WHERE path_code = $1
          ORDER BY revision_id DESC LIMIT 1`,
        [article.pathCode],
      );
      if (tax.rows.length === 0) throw new Error(`Node taxonomy hilang: ${article.pathCode}`);
      const taxonomyNodeId = tax.rows[0].node_id;
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = $1`, [
        article.businessCode,
      ]);
      const articleId = crypto.randomUUID();
      await client.query(
        `INSERT INTO ${schema}.articles
           (id, business_code, taxonomy_node_id, title, slug, summary, language,
            reading_minutes, creator_name, creator_principal_id, access_level,
            status, created_by, updated_by, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Madevi',$9,'MEMBER','PUBLISHED',$9,$9,NOW())`,
        [
          articleId,
          article.businessCode,
          taxonomyNodeId,
          article.title,
          article.slug,
          article.summary,
          article.language,
          article.readingMinutes,
          OWNER_ID,
        ],
      );
      for (let i = 0; i < article.blocks.length; i++) {
        await client.query(
          `INSERT INTO ${schema}.article_blocks (id, article_id, block_type, position, content)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            crypto.randomUUID(),
            articleId,
            article.blocks[i].type,
            i + 1,
            JSON.stringify(article.blocks[i].content),
          ],
        );
      }
      for (let i = 0; i < article.sources.length; i++) {
        const source = article.sources[i];
        await client.query(
          `INSERT INTO ${schema}.article_sources
             (id, article_id, position, title, author_or_org, publisher, url, accessed_date)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            crypto.randomUUID(),
            articleId,
            i,
            source.title,
            source.author,
            source.publisher,
            source.url,
            source.accessed,
          ],
        );
      }
      const bankId = crypto.randomUUID();
      await client.query(
        `INSERT INTO ${schema}.question_banks (id, article_id, language, status, created_by)
         VALUES ($1,$2,'id','VALIDATED',$3)`,
        [bankId, articleId, OWNER_ID],
      );
      for (let i = 0; i < article.mcqs.length; i++) {
        const mcq = article.mcqs[i];
        await client.query(
          `INSERT INTO ${schema}.questions_mc
             (id, bank_id, position, stem, options, correct_key, explanation)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            crypto.randomUUID(),
            bankId,
            i + 1,
            mcq.stem,
            JSON.stringify(mcq.options),
            mcq.correct,
            'Sesuai isi artikel.',
          ],
        );
      }
      await client.query(
        `INSERT INTO ${schema}.questions_essay (id, bank_id, position, stem, rubric, max_score)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          crypto.randomUUID(),
          bankId,
          1,
          article.essay.stem,
          article.essay.rubric,
          article.essay.maxScore,
        ],
      );
      await client.query(
        `INSERT INTO ${schema}.search_index_entries
           (id, entry_type, object_id, title, slug, summary, searchable_body,
            access_level, source_key, language, is_indexed, is_test,
            space_key, target_href, subject_principal_id, visibility, publication_state)
         VALUES (gen_random_uuid(),'ARTICLE',$1,$2,$3,$4,$5,'MEMBER',$6,'id',true,false,
            'explore',$7,NULL,'MEMBER','PUBLISHED')
         ON CONFLICT (source_key) DO UPDATE SET
           title = EXCLUDED.title, slug = EXCLUDED.slug, summary = EXCLUDED.summary,
           searchable_body = EXCLUDED.searchable_body, is_indexed = true,
           target_href = EXCLUDED.target_href, updated_at = CURRENT_TIMESTAMP`,
        [
          articleId,
          article.title,
          article.slug,
          article.summary,
          `${article.title}\n${article.summary}`,
          `ARTICLE:${articleId}`,
          `/artikel/${articleId}`,
        ],
      );
    }
    await client.query('COMMIT');
    printSafe({ ok: true, schema: schemaName, articles: ARTICLES.length });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

await run();
