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

    // Find node_id for T2/J2
    const resTax = await client.query(`
      SELECT node_id FROM ${schema}.taxonomy_nodes 
      WHERE path_code = 'R1.D2.K1.M1.T2.J2' LIMIT 1
    `);

    if (resTax.rows.length === 0) {
      console.log('Node taksonomi T2/J2 belum ada di database.');
      await client.query('ROLLBACK');
      return;
    }
    const taxonomyNodeId = resTax.rows[0].node_id;
    console.log(`Ditemukan Taxonomy Node ID: ${taxonomyNodeId}`);

    const resExist = await client.query(`
      SELECT id FROM ${schema}.articles WHERE business_code = 'ART-R1-T2-J2'
    `);
    if (resExist.rows.length > 0) {
      await client.query(`DELETE FROM ${schema}.articles WHERE business_code = 'ART-R1-T2-J2'`);
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
        'ART-R1-T2-J2',
        taxonomyNodeId,
        'Integrasi Sensori Perabaan dan Keterampilan Memanipulasi Benda',
        'integrasi-sensori-perabaan-dan-keterampilan-memanipulasi-benda',
        'Panduan lengkap mengenai peran sistem taktil (perabaan) dalam mendukung kemampuan motorik halus dan manipulasi benda pada anak usia dini.',
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

    // Rich Wikipedia-style Blocks
    const blocks = [
      {
        type: 'HEADING',
        content: { level: 2, text: 'Pendahuluan: Apa itu Integrasi Sensori Perabaan?' },
      },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Integrasi sensori perabaan (sistem taktil) adalah cara otak menerima, memproses, dan merespons informasi sentuhan dari kulit. Kulit adalah organ sensorik terbesar di tubuh manusia. Pada anak usia dini, sistem taktil bukan sekadar untuk merasakan panas atau dingin, melainkan menjadi "mata kedua" bagi jari-jari untuk memahami tekstur, berat, dan bentuk suatu benda tanpa harus melihatnya (stereognosis).',
        },
      },

      { type: 'HEADING', content: { level: 3, text: 'Dua Fungsi Utama Sistem Taktil' } },
      {
        type: 'LIST',
        content: {
          style: 'unordered',
          items: [
            'Fungsi Protektif: Memberi sinyal peringatan saat tubuh menyentuh benda berbahaya (misal: panci panas atau duri tajam).',
            'Fungsi Diskriminatif: Membantu jari-jari membedakan tekstur (halus/kasar) dan mengenali karakteristik objek untuk dimanipulasi.',
          ],
        },
      },

      {
        type: 'WARNING',
        content: {
          text: 'Anak dengan "Tactile Defensiveness" (Hipersensitif Taktil) mungkin akan menangis atau menolak menyentuh lem, cat air, atau pasir. Jangan paksa anak! Berikan pengenalan tekstur secara bertahap menggunakan alat bantu (seperti kuas atau sarung tangan) sebelum melibatkan sentuhan langsung.',
        },
      },

      {
        type: 'HEADING',
        content: { level: 2, text: 'Kaitan Sensori Taktil dengan Keterampilan Memanipulasi Benda' },
      },
      {
        type: 'PARAGRAPH',
        content: {
          text: 'Kemampuan memanipulasi benda (in-hand manipulation) sangat bergantung pada umpan balik taktil. Ada tiga kategori utama manipulasi objek di dalam telapak tangan (in-hand manipulation) menurut teori okupasi terapi:',
        },
      },

      {
        type: 'TABLE',
        content: {
          headers: ['Keterampilan', 'Deskripsi', 'Contoh Aktivitas'],
          rows: [
            [
              'Translation',
              'Memindahkan objek dari ujung jari ke telapak tangan (atau sebaliknya).',
              'Mengambil koin lalu menyimpannya di telapak tangan tanpa bantuan tangan lain.',
            ],
            [
              'Shift',
              'Menggeser objek secara linear menggunakan ujung jari.',
              'Menyesuaikan posisi pensil agar pas sebelum mulai menulis.',
            ],
            [
              'Rotation',
              'Memutar objek di sekitar satu sumbu menggunakan jari-jari.',
              'Memutar koin, atau memutar pensil untuk menggunakan penghapus di ujungnya.',
            ],
          ],
        },
      },

      {
        type: 'NOTE',
        content: {
          text: 'Aktivitas manipulasi benda (in-hand manipulation) biasanya mulai berkembang pesat pada usia 3 hingga 5 tahun, seiring dengan matangnya sistem saraf pusat anak.',
        },
      },

      { type: 'HEADING', content: { level: 2, text: 'Aktivitas Stimulasi Taktil dan Manipulasi' } },

      {
        type: 'STEP',
        content: {
          title: 'Mencari Harta Karun di Dalam Pasir Kinetik',
          description:
            'Sembunyikan kancing atau manik-manik kecil di dalam sewadah pasir kinetik (sensori). Minta anak mencari dan menjepit benda tersebut. Ini merangsang fungsi diskriminatif.',
        },
      },
      {
        type: 'STEP',
        content: {
          title: 'Finger Painting (Melukis dengan Jari)',
          description:
            'Biarkan anak melukis bebas menggunakan jari pada kanvas atau kertas besar. Aktivitas ini sangat baik untuk anak yang masih menghindari tekstur basah/lengket (desensitisasi taktil).',
        },
      },
      {
        type: 'STEP',
        content: {
          title: 'Bermain Playdough (Malam/Plastisin)',
          description:
            'Ajak anak memilin playdough menjadi bentuk "ular panjang" atau membulatkannya menjadi bola. Gerakan menekan dan memutar ini melatih in-hand manipulation.',
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

    // Question Bank
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
        stem: 'Apa yang dimaksud dengan "in-hand manipulation" tipe Translation?',
        options: [
          { key: 'A', text: 'Memutar benda di antara ujung jari' },
          { key: 'B', text: 'Memindahkan objek dari ujung jari ke telapak tangan' },
          { key: 'C', text: 'Menekan benda dengan keras' },
          { key: 'D', text: 'Melempar bola sejauh mungkin' },
        ],
        correct: 'B',
      },
      {
        stem: 'Sistem taktil pada kulit manusia memiliki dua fungsi utama, yaitu:',
        options: [
          { key: 'A', text: 'Mendengar dan melihat' },
          { key: 'B', text: 'Protektif dan Diskriminatif' },
          { key: 'C', text: 'Kognitif dan Afektif' },
          { key: 'D', text: 'Reseptif dan Ekspresif' },
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
          'Sesuai dengan konsep integrasi sensori.',
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
        'Mengapa anak yang memiliki "Tactile Defensiveness" tidak boleh dipaksa memegang tekstur lengket secara langsung?',
        'Karena akan memicu respons melawan (fight-or-flight) dan trauma. Harus dilakukan perlahan (desensitisasi).',
        8,
      ],
    );

    await client.query('COMMIT');
    console.log('Berhasil mengimpor Artikel T2/J2 ke database Web App.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding T2/J2:', err);
  } finally {
    client.release();
    pool.end();
  }
}
run();
