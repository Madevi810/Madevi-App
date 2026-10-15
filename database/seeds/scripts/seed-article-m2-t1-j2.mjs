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

    // Find node_id for M2/T1/J2
    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M2.T1.J2' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi M2/T1/J2 belum ada di database.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-M2-T1-J2'
    `);
    if (resExist.rows.length > 0) {
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-M2-T1-J2'`);
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
        'ART-R1-M2-T1-J2',
        taxonomyNodeId,
        'Diferensiasi Fonologis dan Pengenalan Ritme Bunyi Bahasa',
        'diferensiasi-fonologis-dan-pengenalan-ritme-bunyi',
        'Membedah pentingnya kesadaran fonologis dalam mendeteksi dan membedakan unit-unit bunyi terkecil dalam bahasa lisan.',
        'id',
        6,
        'Madevi',
        ownerId,
        'MEMBER',
        'PUBLISHED',
        ownerId,
        ownerId,
      ],
    );

    const blocks = [
      { type: 'HEADING', content: { level: 2, text: 'Konsep Dasar Kesadaran Fonologis' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Diferensiasi fonologis adalah kepekaan sistem pendengaran anak untuk mendeteksi, membedakan, dan memanipulasi unit-unit bunyi (fonem) dalam bahasa lisan. Sebelum anak belajar membaca abjad (huruf tertulis), telinganya harus terlebih dahulu "dilatih" untuk mengenali bahwa kata "buku" dan "kuku" terdengar mirip namun berbeda makna hanya karena satu fonem.',
        },
      },

      {
        type: 'NOTE',
        content: {
          text: 'Kesadaran fonologis (auditori) tidak sama dengan Phonics (visual-auditori). Kesadaran fonologis bisa dilatih bahkan dalam keadaan mata tertutup (hanya mendengarkan bunyi).',
        },
      },

      { type: 'HEADING', content: { level: 3, text: 'Tahapan Pengenalan Bunyi' } },
      {
        type: 'TABLE',
        content: {
          headers: ['Tahap', 'Keterampilan', 'Contoh Aktivitas'],
          rows: [
            [
              '1. Deteksi Kata',
              'Menyadari bahwa kalimat terdiri dari kata-kata terpisah.',
              'Bertepuk tangan untuk setiap kata dalam kalimat "Saya suka apel" (3 tepukan).',
            ],
            [
              '2. Silabel (Suku Kata)',
              'Memecah kata menjadi suku kata.',
              'Melompat untuk kata "bo-la" (2 lompatan).',
            ],
            [
              '3. Rima (Rhyme)',
              'Mengenali akhiran bunyi yang sama.',
              'Mencocokkan gambar "Topi" dengan "Kopi".',
            ],
            [
              '4. Fonem Awal',
              'Mengisolasi bunyi pertama dari sebuah kata.',
              'Menyebutkan bahwa kata "Susu" berawalan bunyi /s/ (bukan huruf S).',
            ],
          ],
        },
      },

      { type: 'HEADING', content: { level: 2, text: 'Pengenalan Ritme Bunyi Bahasa' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Ritme atau prosodi (nada, jeda, intonasi) adalah elemen musikal dari bahasa lisan. Anak-anak yang banyak terpapar lagu anak-anak (nursery rhymes) atau pantun sejak bayi secara otomatis akan mengembangkan pemetaan saraf (neural mapping) yang lebih kuat untuk struktur silabel.',
        },
      },

      {
        type: 'STEP',
        content: {
          title: 'Bermain Tebak Bunyi Hewan Bertingkat',
          description:
            'Jangan hanya meminta anak menirukan suara sapi. Berikan pola ritme: "Moo... Moo... Moooooo". Minta anak menirukan pola panjang-pendek suara tersebut (memori sekuensial auditori).',
        },
      },

      {
        type: 'WARNING',
        content: {
          text: 'Gangguan pemrosesan auditori sentral (CAPD) sering kali tidak terdeteksi hingga anak masuk sekolah dasar. Jika anak usia 4-5 tahun kesulitan mendeteksi rima yang sangat jelas (contoh: Kucing - Guling), lakukan konsultasi dengan terapis wicara.',
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
        stem: 'Kesadaran fonologis sepenuhnya berfokus pada sistem indera...',
        options: [
          { key: 'A', text: 'Visual (Penglihatan)' },
          { key: 'B', text: 'Auditori (Pendengaran)' },
          { key: 'C', text: 'Taktil (Perabaan)' },
          { key: 'D', text: 'Olfactory (Penciuman)' },
        ],
        correct: 'B',
      },
      {
        stem: 'Manakah dari berikut ini yang merupakan contoh rima (rhyme)?',
        options: [
          { key: 'A', text: 'Baju - Celana' },
          { key: 'B', text: 'Topi - Kopi' },
          { key: 'C', text: 'Kucing - Anjing' },
          { key: 'D', text: 'Meja - Kursi' },
        ],
        correct: 'B',
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
          'Sesuai dengan konsep fonologi.',
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
        'Mengapa pengenalan huruf tertulis (abjad) sebaiknya ditunda hingga anak memiliki kesadaran fonologis yang matang?',
        'Karena anak harus paham bunyi terlebih dahulu sebelum bisa mencocokkannya dengan simbol visual.',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log('Berhasil mengimpor Artikel M2/T1/J2 ke database Web App.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding M2/T1/J2:', err);
  } finally {
    client.release();
    pool.end();
  }
}
run();
