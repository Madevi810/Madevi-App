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

    // Find node_id for M2/T1/J1
    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M2.T1.J1' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi M2/T1/J1 belum ada di database.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;
    console.log(`Ditemukan Taxonomy Node ID: ${taxonomyNodeId}`);

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-M2-T1-J1'
    `);
    if (resExist.rows.length > 0) {
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-M2-T1-J1'`);
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
        'ART-R1-M2-T1-J1',
        taxonomyNodeId,
        'Pemrosesan Instruksi Verbal Bertingkat dan Pemahaman Cerita',
        'pemrosesan-instruksi-verbal-bertingkat-dan-pemahaman-cerita',
        'Membahas perkembangan bahasa reseptif anak dalam memproses memori auditori jangka pendek dan memahami instruksi dengan kompleksitas bertahap.',
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
      { type: 'HEADING', content: { level: 2, text: 'Pendahuluan: Bahasa Reseptif' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Bahasa reseptif adalah kemampuan anak untuk "menerima" dan memahami bahasa yang didengarnya, jauh sebelum ia mampu mengucapkannya (bahasa ekspresif). Pemrosesan instruksi verbal bertingkat merupakan tolak ukur penting dalam perkembangan kognitif anak usia prasekolah, karena melibatkan kombinasi pemahaman kosakata dan memori kerja auditori.',
        },
      },

      { type: 'HEADING', content: { level: 3, text: 'Tahapan Pemrosesan Instruksi Bertingkat' } },
      {
        type: 'TABLE',
        content: {
          headers: ['Usia Anak', 'Kompleksitas Instruksi', 'Contoh Instruksi'],
          rows: [
            ['1 - 2 tahun', 'Instruksi 1 Tahap Sederhana', '"Ambil bolanya."'],
            ['2 - 3 tahun', 'Instruksi 2 Tahap (Terkait)', '"Ambil sepatumu dan pakai di kaki."'],
            [
              '3 - 4 tahun',
              'Instruksi 2 Tahap (Tidak Terkait)',
              '"Tutup pintunya lalu ambilkan buku itu."',
            ],
            [
              '4 - 5 tahun',
              'Instruksi 3 Tahap',
              '"Cuci tanganmu, duduk di kursi, lalu makan kue ini."',
            ],
          ],
        },
      },

      {
        type: 'WARNING',
        content: {
          text: 'Perhatian: Jangan membanjiri anak usia 3 tahun dengan instruksi 4 tahap sekaligus. Hal ini akan menyebabkan Cognitive Overload (kelebihan beban kognitif) sehingga anak tampak "mengabaikan" Anda, padahal memori kerjanya tidak sanggup menampungnya.',
        },
      },

      { type: 'HEADING', content: { level: 2, text: 'Pemahaman Cerita (Story Comprehension)' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Pemahaman cerita adalah tingkat lanjut dari bahasa reseptif di mana anak harus mempertahankan serangkaian informasi auditori dalam jangka waktu yang lebih lama (attention span), memvisualisasikannya di otak, dan menghubungkannya.',
        },
      },

      {
        type: 'NOTE',
        content: {
          text: 'Metode Read-Aloud (Membacakan Nyaring) sangat direkomendasikan oleh pakar literasi dini. Berhenti sejenak di tengah cerita dan bertanya, "Menurutmu, apa yang terjadi selanjutnya?" adalah teknik "Dialogic Reading" yang menstimulasi pemahaman cerita.',
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
        stem: 'Mana yang merupakan contoh instruksi 2 tahap tidak terkait (unrelated)?',
        options: [
          { key: 'A', text: 'Ambil sepatu dan pakai di kaki' },
          { key: 'B', text: 'Ambil buku dan buka halamannya' },
          { key: 'C', text: 'Tutup pintu lalu ambil mainan' },
          { key: 'D', text: 'Makan rotinya' },
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
          'Instruksi tidak terkait membutuhkan memori kerja yang lebih tinggi.',
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
        'Jelaskan apa yang dimaksud dengan dialogic reading dan sebutkan satu contohnya!',
        'Metode membaca interaktif yang melibatkan anak (bukan sekadar pasif mendengar).',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log('Berhasil mengimpor Artikel M2/T1/J1 ke database Web App.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding M2/T1/J1:', err);
  } finally {
    client.release();
    pool.end();
  }
}
run();
