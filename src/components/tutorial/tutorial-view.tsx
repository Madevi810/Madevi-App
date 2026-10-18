'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tutorial } from '@/services/tutorial';
import { KATEGORI_TUTORIAL_LABEL } from '@/services/tutorial';

export type TutorialViewProps = {
  tutorial: Tutorial;
};

/**
 * Tampilan tutorial format baku: masalah → penjelasan → persiapan →
 * langkah → risiko → penyelesaian. Checklist progres per langkah.
 */
export function TutorialView({ tutorial: t }: TutorialViewProps) {
  const [selesai, setSelesai] = useState<boolean[]>(() => t.langkah.map(() => false));
  const [tampilPenyelesaian, setTampilPenyelesaian] = useState(false);

  const toggle = (i: number) => setSelesai((s) => s.map((v, j) => (j === i ? !v : v)));
  const progres = t.langkah.length === 0 ? 0 : Math.round((selesai.filter(Boolean).length / t.langkah.length) * 100);

  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 48px' }}>
      <header style={{ padding: '24px 0' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Badge variant="info" size="sm">{KATEGORI_TUTORIAL_LABEL[t.kategori]}</Badge>
          <Badge size="sm">{t.tingkat}</Badge>
          <Badge size="sm" variant="neutral">⏱ {t.estimasiMenit} menit</Badge>
        </div>
        <h1 style={{ fontSize: '1.75rem', margin: '0 0 8px' }}>{t.judul}</h1>
        {/* Progres */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
            <span>Progres langkah</span><span>{progres}%</span>
          </div>
          <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progres}%`, background: '#0ea5e9', transition: 'width 0.2s' }} />
          </div>
        </div>
      </header>

      {/* 1. Masalah */}
      <section>
        <h2>🔍 Masalah</h2>
        <Card variant="elevated"><CardContent><p style={{ margin: 0 }}>{t.masalah}</p></CardContent></Card>
      </section>

      {/* 2. Penjelasan */}
      <section style={{ marginTop: 16 }}>
        <h2>💡 Penjelasan</h2>
        <p style={{ lineHeight: 1.7 }}>{t.penjelasan}</p>
      </section>

      {/* 3. Persiapan */}
      <section style={{ marginTop: 16 }}>
        <h2>🧰 Persiapan</h2>
        <h3>Alat</h3>
        <ul>{t.persiapanAlat.map((a, i) => <li key={i}>{a}</li>)}</ul>
        {t.persiapanBahan && t.persiapanBahan.length > 0 && (
          <>
            <h3>Bahan</h3>
            <ul>{t.persiapanBahan.map((b, i) => <li key={i}>{b}</li>)}</ul>
          </>
        )}
      </section>

      {/* 4. Cara (langkah checklist) */}
      <section style={{ marginTop: 16 }}>
        <h2>📝 Cara — {t.langkah.length} langkah</h2>
        {t.langkah.map((l, i) => (
          <Card key={i} style={{ opacity: selesai[i] ? 0.7 : 1 }}>
            <CardContent>
              <label style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selesai[i]}
                  onChange={() => toggle(i)}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: '#0ea5e9' }}
                  aria-label={`Tandai langkah ${i + 1} selesai`}
                />
                <div>
                  <strong style={{ textDecoration: selesai[i] ? 'line-through' : 'none' }}>
                    Langkah {i + 1}: {l.judul}
                  </strong>
                  <p style={{ margin: '4px 0', lineHeight: 1.6 }}>{l.detail}</p>
                  {l.tips && <p style={{ fontSize: 13, color: '#0284c7', margin: '4px 0' }}>💡 {l.tips}</p>}
                  {l.peringatan && <p style={{ fontSize: 13, color: '#b45309', margin: '4px 0' }}>⚠️ {l.peringatan}</p>}
                </div>
              </label>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 5. Risiko */}
      <section style={{ marginTop: 16 }}>
        <h2>⚠️ Risiko</h2>
        {t.risiko.map((r, i) => (
          <Card key={i}>
            <CardContent>
              <p style={{ margin: '0 0 4px' }}><strong>Risiko:</strong> {r.risiko}</p>
              <p style={{ margin: 0, fontSize: 14, color: '#166534' }}><strong>Pencegahan:</strong> {r.pencegahan}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 6. Penyelesaian */}
      <section style={{ marginTop: 16 }}>
        <h2>✅ Penyelesaian</h2>
        {!tampilPenyelesaian ? (
          <Button onClick={() => setTampilPenyelesaian(true)}>Lihat penyelesaian</Button>
        ) : (
          <Card variant="elevated">
            <CardContent>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{t.penyelesaian}</p>
            </CardContent>
          </Card>
        )}
      </section>

      {t.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 24 }}>
          {t.tags.map((tag) => (
            <Badge key={tag} size="sm" variant="neutral">#{tag}</Badge>
          ))}
        </div>
      )}
    </article>
  );
}
