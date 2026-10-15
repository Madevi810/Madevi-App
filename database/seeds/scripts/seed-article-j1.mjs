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

    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M1.T1.J1' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi J1 belum ada di database. Lakukan import terlebih dahulu.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-J1'
    `);
    if (resExist.rows.length > 0) {
      console.log('Artikel ART-R1-J1 sudah ada. Menghapus data lama...');
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-J1'`);
    }

    const articleId = crypto.randomUUID();
    const ownerId = '71000000-0000-4000-8000-000000000001';

    // 1. Insert Article
    await client.query(
      `
      INSERT INTO ${schema}.articles 
      (id, business_code, taxonomy_node_id, title, slug, summary, language, reading_minutes, creator_name, creator_principal_id, access_level, status, created_by, updated_by, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
    `,
      [
        articleId,
        'ART-R1-J1',
        taxonomyNodeId,
        'Stimulasi Keseimbangan Dinamis dan Koordinasi Lokomotor',
        'stimulasi-keseimbangan-dinamis-dan-koordinasi-lokomotor',
        'Panduan lengkap stimulasi keseimbangan dinamis dan koordinasi lokomotor untuk anak usia dini berdasarkan standar WHO, CDC, dan NAEYC.',
        'id',
        5,
        'Madevi',
        ownerId,
        'MEMBER',
        'PUBLISHED',
        ownerId,
        ownerId,
      ],
    );

    // 2. Insert Article Blocks
    const blocks = [
      {
        type: 'HEADING',
        content: { level: 2, text: 'Pendahuluan' },
      },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Masa kanak-kanak awal (usia 0-5 tahun) merupakan periode kritis (golden age) bagi perkembangan fisik dan motorik. Menurut pedoman global World Health Organization (WHO) tahun 2019 tentang aktivitas fisik, anak usia di bawah 5 tahun direkomendasikan untuk menghabiskan setidaknya 180 menit dalam berbagai jenis aktivitas fisik setiap hari, yang mana 60 menit di antaranya adalah aktivitas fisik intensitas sedang hingga kuat bagi anak usia 3-4 tahun.',
        },
      },
      {
        type: 'HEADING',
        content: { level: 2, text: 'Pengertian Keseimbangan Dinamis dan Koordinasi Lokomotor' },
      },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Keseimbangan dinamis adalah kemampuan anak untuk mempertahankan posisi tubuh yang stabil saat sedang bergerak. Koordinasi lokomotor merujuk pada integrasi gerakan otot-otot besar yang memungkinkan perpindahan tubuh dari satu tempat ke tempat lain.',
        },
      },
      {
        type: 'HEADING',
        content: { level: 2, text: 'Metode Stimulasi Berbasis Bermain' },
      },
      {
        type: 'LIST',
        content: {
          style: 'ordered',
          items: [
            'Permainan Garis Keseimbangan: Menggunakan selotip warna atau tali yang diletakkan lurus atau berkelok di lantai.',
            'Lompat Katak dan Jalan Kepiting: Mengajak anak meniru gerakan hewan.',
            'Sirkuit Rintang Sederhana (Obstacle Course): Menyusun beberapa rintangan seperti bantal untuk dilompati.',
            'Bermain Tangkap Bola Berbagai Ukuran.',
          ],
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

    // 3. Insert Question Bank
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
        stem: 'Apa yang dimaksud dengan keseimbangan dinamis?',
        options: [
          { key: 'A', text: 'Kemampuan diam di satu tempat tanpa jatuh' },
          { key: 'B', text: 'Kemampuan mempertahankan posisi saat bergerak' },
          { key: 'C', text: 'Kemampuan memegang benda dengan kuat' },
          { key: 'D', text: 'Kemampuan membaca huruf' },
        ],
        correct: 'B',
      },
      {
        stem: 'Berapa lama rekomendasi WHO untuk aktivitas fisik harian anak di bawah 5 tahun?',
        options: [
          { key: 'A', text: '60 menit' },
          { key: 'B', text: '120 menit' },
          { key: 'C', text: '180 menit' },
          { key: 'D', text: '240 menit' },
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
          'Sesuai dengan sumber panduan resmi.',
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
        'Jelaskan perbedaan mendasar antara keseimbangan dinamis dan keseimbangan statis, dan berikan masing-masing satu contoh!',
        'Menyebutkan definisi dinamis dan statis dengan benar beserta contohnya.',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log('Berhasil mengimpor Artikel J1 ke database Madevi_Off.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding J1:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
