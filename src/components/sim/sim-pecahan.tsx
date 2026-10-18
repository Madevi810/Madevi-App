'use client';

import { useState } from 'react';

import { ParamSlider } from '@/components/ui/param-slider';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { analisisPecahan } from '@/services/sim-fisika';

/**
 * SimPecahan — pola PhET: klik potongan pizza/batang → pecahan + desimal + persen sinkron.
 */
export function SimPecahan() {
  const [pembilang, setPembilang] = useState(3);
  const [penyebut, setPenyebut] = useState(4);
  const h = analisisPecahan(Math.round(pembilang), Math.round(penyebut));

  // Gambar lingkaran terbagi
  const R = 70;
  const cx = 90;
  const cy = 90;
  const slices = Array.from({ length: h.penyebut }, (_, i) => {
    const a0 = (i / h.penyebut) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / h.penyebut) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const besar = h.penyebut > 2 ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${besar} 1 ${x1} ${y1} Z`, aktif: i < h.pembilang };
  });

  return (
    <Card>
      <CardHeader>
        <h3>Pecahan Visual</h3>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <ParamSlider label="Pembilang" value={pembilang} min={0} max={12} onValueChange={setPembilang} />
            <ParamSlider label="Penyebut" value={penyebut} min={1} max={12} onValueChange={setPenyebut} />
          </div>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', gap: 16, alignItems: 'center' }}>
            <svg viewBox="0 0 180 180" width={160} role="img" aria-label={`Pecahan ${h.pembilang} per ${h.penyebut}`}>
              <circle cx={cx} cy={cy} r={R} fill="#f3f4f6" />
              {slices.map((s, i) => (
                <path key={i} d={s.d} fill={s.aktif ? '#0ea5e9' : 'transparent'} stroke="#9ca3af" strokeWidth={1} />
              ))}
            </svg>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 16 }}>
              <dt>Pecahan</dt><dd><strong style={{ fontSize: 20 }}>{h.pembilang}/{h.penyebut}</strong></dd>
              <dt>Desimal</dt><dd><strong>{h.desimal}</strong></dd>
              <dt>Persen</dt><dd><strong>{h.persen}%</strong></dd>
              <dt>Senilai</dt><dd><strong>{h.senilai}</strong></dd>
            </dl>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>
          <strong>Coba pikirkan:</strong> pecahan apa yang senilai dengan 2/4?
          Mana lebih besar: 2/3 atau 3/4?
        </p>
      </CardContent>
    </Card>
  );
}
