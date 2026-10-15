import {
  createScriptPool,
  databaseScriptContext,
  quoteIdentifier,
  safeSchema,
} from '../../../scripts/lib/database.mjs';
import crypto from 'node:crypto';

const { config } = databaseScriptContext(import.meta.url);
const schema = quoteIdentifier(safeSchema(config.MADEVI_DB_SCHEMA || 'madevi'));
const pool = createScriptPool(config);

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Find node_id for T2/J1
    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M1.T2.J1' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi T2/J1 belum ada di database.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;
    console.log(`Ditemukan Taxonomy Node ID: ${taxonomyNodeId}`);

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-T2-J1'
    `);
    if (resExist.rows.length > 0) {
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-T2-J1'`);
    }

    const articleId = crypto.randomUUID();
    const ownerId = '71000000-0000-4000-8000-000000000001';

    await client.query(
      `
      INSERT INTO ${schema}.articles 
      (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
    `,
      [
        articleId,
        'ART-R1-T2-J1',
        taxonomyNodeId,
        'Latihan Koordinasi Bilateral dan Kekuatan Menjepit Pincer Grasp',
        'latihan-koordinasi-bilateral-dan-pincer-grasp',
        'Ensiklopedia komprehensif mengenai perkembangan motorik halus, koordinasi dua sisi tubuh, dan teknik menjepit (pincer grasp) pada anak.',
        'id',
        8,
        'Madevi',
        ownerId,
        'MEMBER',
        'PUBLISHED',
        ownerId,
        ownerId,
      ],
    );

    // Rich Wikipedia-style Blocks
    const blocks = [
      { type: 'HEADING', content: { level: 2, text: 'Pendahuluan Konseptual' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Perkembangan motorik halus (fine motor development) merupakan salah satu pencapaian paling vital pada anak usia prasekolah. Di antara berbagai keterampilan tangan, koordinasi bilateral dan pincer grasp (kemampuan menjepit dengan ibu jari dan telunjuk) memegang peranan krusial sebagai fondasi dasar bagi kemandirian (seperti mengancingkan baju, mengikat tali sepatu) dan kesiapan akademis (menggenggam pensil untuk menulis).',
        },
      },

      {
        type: 'IMAGE',
        content: {
          url: '/placeholder-pincer-grasp.jpg',
          alt: 'Ilustrasi Pincer Grasp',
          caption:
            'Gambar 1: Posisi ideal pincer grasp menggunakan ujung ibu jari dan jari telunjuk.',
        },
      },

      { type: 'HEADING', content: { level: 3, text: 'Tahapan Perkembangan Pincer Grasp' } },
      {
        type: 'TABLE',
        content: {
          headers: ['Usia Anak', 'Jenis Genggaman', 'Deskripsi'],
          rows: [
            [
              '4 - 6 bulan',
              'Palmar Grasp',
              'Menggenggam benda menggunakan seluruh telapak tangan tanpa keterlibatan ibu jari aktif.',
            ],
            [
              '7 - 9 bulan',
              'Inferior Pincer Grasp',
              'Menjepit objek menggunakan bantalan ibu jari dan sisi jari telunjuk (belum menggunakan ujung jari).',
            ],
            [
              '10 - 12 bulan',
              'Superior/Neat Pincer Grasp',
              'Menjepit presisi menggunakan ujung ibu jari dan ujung jari telunjuk. Memungkinkan mengambil benda sekecil kacang.',
            ],
          ],
        },
      },

      {
        type: 'NOTE',
        content: {
          text: 'Berdasarkan pedoman dari Centers for Disease Control and Prevention (CDC), jika anak usia 12 bulan belum menunjukkan inisiatif menggunakan ibu jari dan telunjuk untuk menjepit makanan kecil, orang tua disarankan untuk berkonsultasi dengan dokter spesialis anak.',
        },
      },

      { type: 'HEADING', content: { level: 2, text: 'Koordinasi Bilateral' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Koordinasi bilateral adalah kemampuan untuk menggunakan kedua sisi tubuh (kanan dan kiri) secara bersamaan secara terkontrol dan terorganisir. Kemampuan ini mengindikasikan bahwa kedua belahan otak (hemisfer kanan dan kiri) saling berkomunikasi secara efisien melalui corpus callosum.',
        },
      },

      {
        type: 'EXAMPLE',
        content: {
          text: 'Contoh penerapan koordinasi bilateral asimetris dalam keseharian: Satu tangan memegang kertas agar tidak bergeser (tangan penstabil), sementara tangan yang lain menggunakan gunting untuk memotong kertas (tangan dominan/pekerja).',
        },
      },

      { type: 'HEADING', content: { level: 2, text: 'Langkah-Langkah Stimulasi (Step-by-Step)' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Pendidik dan orang tua dapat menerapkan aktivitas berikut untuk melatih pincer grasp dan koordinasi bilateral:',
        },
      },

      {
        type: 'STEP',
        content: {
          title: 'Langkah 1: Merobek Kertas (Tearing Paper)',
          description:
            'Minta anak memegang selembar kertas bekas dengan kedua tangan. Gunakan ibu jari dan telunjuk (pincer grasp) pada masing-masing tangan, lalu tarik ke arah berlawanan. Ini menstimulasi koordinasi bilateral dan kekuatan jari secara bersamaan.',
        },
      },
      {
        type: 'STEP',
        content: {
          title: 'Langkah 2: Memindahkan Pom-pom dengan Pinset',
          description:
            'Gunakan capit atau pinset plastik besar. Anak harus memencet pinset (melatih kekuatan pincer) untuk memindahkan pom-pom dari mangkuk kiri ke mangkuk kanan.',
        },
      },
      {
        type: 'STEP',
        content: {
          title: 'Langkah 3: Menguntai Manik-manik (Beading)',
          description:
            'Satu tangan memegang tali kaku (penstabil), sementara tangan lain (pincer) memasukkan manik-manik berlubang besar. Tingkatkan kesulitan dengan manik dan benang yang lebih kecil seiring usia anak.',
        },
      },

      {
        type: 'WARNING',
        content: {
          text: 'Hindari memaksa anak usia di bawah 4 tahun untuk menulis menggunakan pensil kecil jika pincer grasp mereka belum matang. Pemaksaan dapat menyebabkan anak mengembangkan cara menggenggam yang salah (atypical grasp) yang sulit dikoreksi di kemudian hari.',
        },
      },

      {
        type: 'QUOTE',
        content: {
          text: 'Children do not learn motor skills through instruction alone; they learn by manipulating their environment through play.',
          author: 'National Association for the Education of Young Children (NAEYC)',
        },
      },
    ];

    for (let i = 0; i < blocks.length; i++) {
      const blockId = crypto.randomUUID();
      await client.query(
        `
        INSERT INTO ${schema}.article_blocks (id, article_id, block_type, position, content)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [blockId, articleId, blocks[i].type, i + 1, JSON.stringify(blocks[i].content)],
      );
    }

    // 3. Question Bank & Quiz (required by Prompt 16)
    const bankId = crypto.randomUUID();
    await client.query(
      `
      INSERT INTO ${schema}.question_banks (id, article_id, language, status, created_by)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [bankId, articleId, 'id', 'VALIDATED', ownerId],
    );

    const mcqs = [
      {
        stem: 'Apa yang dimaksud dengan superior/neat pincer grasp?',
        options: [
          { key: 'A', text: 'Menggenggam dengan telapak tangan' },
          { key: 'B', text: 'Menjepit menggunakan ujung ibu jari dan telunjuk' },
          { key: 'C', text: 'Menahan beban dengan lengan' },
          { key: 'D', text: 'Menggunakan kedua tangan untuk melempar bola' },
        ],
        correct: 'B',
      },
      {
        stem: 'Mana dari aktivitas berikut yang merupakan contoh koordinasi bilateral asimetris?',
        options: [
          { key: 'A', text: 'Melompat dengan dua kaki' },
          { key: 'B', text: 'Bertepuk tangan' },
          { key: 'C', text: 'Satu tangan memegang kertas, tangan lain menggunting' },
          { key: 'D', text: 'Memejamkan mata' },
        ],
        correct: 'C',
      },
    ];
    for (let i = 0; i < mcqs.length; i++) {
      const qId = crypto.randomUUID();
      await client.query(
        `
        INSERT INTO ${schema}.questions_mc (id, bank_id, position, stem, options, correct_key, explanation)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          qId,
          bankId,
          i + 1,
          mcqs[i].stem,
          JSON.stringify(mcqs[i].options),
          mcqs[i].correct,
          'Sesuai dengan konsep motorik halus.',
        ],
      );
    }

    const essayId = crypto.randomUUID();
    await client.query(
      `
      INSERT INTO ${schema}.questions_essay (id, bank_id, position, stem, rubric, max_score)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [
        essayId,
        bankId,
        1,
        'Mengapa pemaksaan penggunaan pensil kecil pada anak yang pincer grasp-nya belum matang sangat dilarang?',
        'Karena memicu gaya menggenggam yang salah dan tidak efisien.',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log(
      'Berhasil mengimpor Artikel T2/J1 dengan format Wikipedia-rich ke database Web App.',
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding T2/J1:', err);
  } finally {
    client.release();
    pool.end();
  }
}
run();
