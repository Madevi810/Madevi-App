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

    // Find node_id for J2
    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M1.T1.J2' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi J2 belum ada di database.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;
    console.log(`Ditemukan Taxonomy Node ID J2: ${taxonomyNodeId}`);

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-J2'
    `);
    if (resExist.rows.length > 0) {
      console.log('Artikel ART-R1-J2 sudah ada. Menghapus data lama...');
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-J2'`);
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
        'ART-R1-J2',
        taxonomyNodeId,
        'Penguatan Tonus Otot dan Kelincahan Spasial Anak Usia Dini',
        'penguatan-tonus-otot-dan-kelincahan-spasial-anak-usia-dini',
        'Membangun fondasi motorik yang kuat melalui penguatan tonus otot dan pemahaman kesadaran ruang (kelincahan spasial) pada anak usia dini.',
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

    const blocks = [
      { type: 'HEADING', content: { level: 2, text: 'Pendahuluan' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Perkembangan motorik kasar pada anak usia dini tidak hanya terbatas pada kemampuan berjalan atau berlari, melainkan juga melibatkan pematangan tonus otot (ketegangan otot dasar) dan kelincahan spasial (pemahaman dan kontrol tubuh di dalam ruang). American Academy of Pediatrics (AAP) menyarankan agar anak-anak usia prasekolah terlibat dalam "active play" (bermain aktif) yang dipandu maupun bebas, guna membangun kekuatan inti tubuh (core strength).',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Memahami Tonus Otot pada Anak' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Tonus otot adalah tingkat ketegangan parsial yang terus-menerus ada pada otot saat beristirahat. Penguatan tonus otot yang sehat mutlak diperlukan sebelum anak dituntut untuk duduk diam belajar atau memegang pensil dengan benar.',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Kelincahan Spasial (Kesadaran Ruang)' } },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Kelincahan spasial, atau spatial awareness, adalah kemampuan otak untuk memahami posisi tubuh dalam kaitannya dengan benda-benda di sekitarnya. Keterampilan ini bergantung pada sistem proprioseptif (reseptor di otot dan sendi) serta sistem vestibular (keseimbangan di telinga dalam).',
        },
      },
      { type: 'HEADING', content: { level: 2, text: 'Aktivitas Stimulasi yang Direkomendasikan' } },
      {
        type: 'LIST',
        content: {
          style: 'ordered',
          items: [
            'Bermain Tarik Tambang Sederhana',
            'Merayap di Bawah Rintangan (Commando Crawling)',
            'Bermain "Lampu Merah, Lampu Hijau"',
            'Melompat di Atas Trampolin Kecil (Trampette)',
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
        stem: 'Apa yang dimaksud dengan tonus otot?',
        options: [
          { key: 'A', text: 'Kekuatan maksimal saat mengangkat beban berat' },
          {
            key: 'B',
            text: 'Ketegangan parsial otot yang terus-menerus ada untuk mempertahankan postur',
          },
          { key: 'C', text: 'Kemampuan berlari cepat' },
          { key: 'D', text: 'Kemampuan otak memecahkan masalah' },
        ],
        correct: 'B',
      },
      {
        stem: 'Kelincahan spasial berkaitan erat dengan sistem sensorik apa di tubuh?',
        options: [
          { key: 'A', text: 'Proprioseptif dan vestibular' },
          { key: 'B', text: 'Pengecapan dan penciuman' },
          { key: 'C', text: 'Pendengaran dan vokal' },
          { key: 'D', text: 'Sirkulasi darah' },
        ],
        correct: 'A',
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
          'Sesuai dengan anatomi perkembangan motorik anak.',
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
        'Sebutkan dan jelaskan perbedaan antara hipotonia dan hipertonia!',
        'Hipotonia (lemas) dan hipertonia (kaku).',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log('Berhasil mengimpor Artikel J2 ke database Web App.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding J2:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
