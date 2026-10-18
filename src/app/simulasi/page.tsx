import { SimHukumOhm } from '@/components/sim/sim-hukum-ohm';
import { SimParabola } from '@/components/sim/sim-parabola';
import { SimPegas } from '@/components/sim/sim-pegas';
import { SimGrafikFungsi } from '@/components/sim/sim-grafik-fungsi';
import { SimPH } from '@/components/sim/sim-ph';
import { SimPecahan } from '@/components/sim/sim-pecahan';
import { WorksheetView } from '@/components/sim/worksheet-view';
import { worksheetBySimId } from '@/services/sim-worksheet';
import { PublicShell } from '@/components/public-shell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Simulasi Interaktif — Madevi',
  description: 'Simulasi edukasi interaktif: fisika, matematika, kimia. Ubah parameter, lihat hasil real-time.',
};

/**
 * Galeri simulasi edukasi — pola PhET, dibangun orisinal untuk Madevi.
 * Tiap sim: kontrol parameter → multi-representasi sinkron → pertanyaan eksplorasi.
 */
export default function SimulasiPage() {
  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Simulasi Interaktif</h1>
        <p style={{ color: '#6b7280', marginBottom: 24, maxWidth: '70ch' }}>
          Belajar dengan bereksperimen: geser parameter, amati perubahan secara langsung.
          Setiap simulasi punya pertanyaan untuk menguji pemahamanmu.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { id: 'hukum-ohm', el: <SimHukumOhm /> },
            { id: 'parabola', el: <SimParabola /> },
            { id: 'pegas', el: <SimPegas /> },
            { id: 'grafik-fungsi', el: <SimGrafikFungsi /> },
            { id: 'ph', el: <SimPH /> },
            { id: 'pecahan', el: <SimPecahan /> },
          ].map(({ id, el }) => {
            const ws = worksheetBySimId(id);
            return (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {el}
                {ws && <WorksheetView worksheet={ws} />}
              </div>
            );
          })}
        </div>
      </main>
    </PublicShell>
  );
}
