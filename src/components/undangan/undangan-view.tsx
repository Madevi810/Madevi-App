'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DataUndangan } from '@/services/undangan';

export type UndanganViewProps = {
  data: DataUndangan;
  namaTamu?: string;
};

/**
 * Tampilan undangan publik: cover personal, countdown, acara, RSVP, galeri, amplop, rundown.
 * Dibuat lebih baik dari referensi: rundown gratis, tanpa registrasi untuk melihat.
 */
export function UndanganView({ data, namaTamu }: UndanganViewProps) {
  const [buka, setBuka] = useState(false);
  const [sekarang, setSekarang] = useState(() => Date.now());

  const acaraPertama = data.acara[0];
  const target = acaraPertama ? new Date(`${acaraPertama.tanggal}T${acaraPertama.jamMulai}`).getTime() : 0;

  useEffect(() => {
    if (!buka) return;
    const t = setInterval(() => setSekarang(Date.now()), 1000);
    return () => clearInterval(t);
  }, [buka ]);

  if (!buka) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${data.warnaUtama}22, ${data.warnaUtama}11)`,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6b7280', marginBottom: 8 }}>{data.coverSambutan}</p>
        {namaTamu && (
          <p style={{ fontSize: 14, marginBottom: 4 }}>
            Kepada Yth.<br />
            <strong style={{ fontSize: 18 }}>{namaTamu}</strong>
          </p>
        )}
        <h1 style={{ fontFamily: data.fontJudul, fontSize: '2rem', margin: '12px 0', color: data.warnaUtama }}>
          {data.mempelaiPria.namaPanggilan} &amp; {data.mempelaiWanita.namaPanggilan}
        </h1>
        <Button size="lg" onClick={() => setBuka(true)}>
          ✉ Buka Undangan
        </Button>
      </div>
    );
  }

  const sisa = Math.max(0, target - sekarang);
  const hari = Math.floor(sisa / 86400000);
  const jam = Math.floor((sisa % 86400000) / 3600000);
  const menit = Math.floor((sisa % 3600000) / 60000);
  const detik = Math.floor((sisa % 60000) / 1000);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px 48px' }}>
      {/* Header mempelai */}
      <header style={{ textAlign: 'center', padding: '40px 0 24px' }}>
        <p style={{ color: '#6b7280' }}>Assalamu&apos;alaikum Wr. Wb.</p>
        <h1 style={{ fontFamily: data.fontJudul, fontSize: '2.2rem', color: data.warnaUtama, margin: '12px 0' }}>
          {data.mempelaiPria.namaPanggilan} &amp; {data.mempelaiWanita.namaPanggilan}
        </h1>
        <p style={{ color: '#6b7280' }}>{data.coverSambutan}</p>
      </header>

      {/* Countdown */}
      {target > 0 && (
        <Card>
          <CardContent>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', textAlign: 'center' }}>
              {[{ n: hari, l: 'Hari' }, { n: jam, l: 'Jam' }, { n: menit, l: 'Menit' }, { n: detik, l: 'Detik' }].map((u) => (
                <div key={u.l} style={{ minWidth: 64 }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: data.warnaUtama }}>{u.n}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{u.l}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mempelai */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ textAlign: 'center' }}>Mempelai</h2>
        {[
          { m: data.mempelaiPria, l: 'Mempelai Pria' },
          { m: data.mempelaiWanita, l: 'Mempelai Wanita' },
        ].map(({ m, l }) => (
          <Card key={l}>
            <CardContent>
              <Badge size="sm">{l}</Badge>
              <h3 style={{ margin: '8px 0 4px' }}>{m.namaLengkap}</h3>
              <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>{m.putraDari}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Acara */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ textAlign: 'center' }}>Waktu &amp; Tempat</h2>
        {data.acara.map((a, i) => (
          <Card key={i}>
            <CardContent>
              <h3 style={{ margin: '0 0 8px' }}>{a.nama}</h3>
              <p style={{ margin: '4px 0' }}>📅 {a.tanggal} • {a.jamMulai}–{a.jamSelesai}</p>
              <p style={{ margin: '4px 0' }}>📍 {a.tempat}<br /><span style={{ color: '#6b7280', fontSize: 14 }}>{a.alamat}</span></p>
              {a.mapsUrl && (
                <a href={a.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">Buka Google Maps</Button>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Rundown (gratis — pembeda Madevi) */}
      {data.rundown && data.rundown.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Rundown Acara</h2>
          <Card>
            <CardContent>
              {data.rundown.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < data.rundown!.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <strong style={{ minWidth: 56, color: data.warnaUtama }}>{r.jam}</strong>
                  <span>{r.kegiatan}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Love story */}
      {data.loveStory && data.loveStory.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ textAlign: 'center' }}>Cerita Kami</h2>
          {data.loveStory.map((s, i) => (
            <Card key={i}>
              <CardContent>
                <Badge size="sm" variant="info">{s.tanggal}</Badge>
                <h4 style={{ margin: '8px 0 4px' }}>{s.judul}</h4>
                <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{s.cerita}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Amplop digital */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ textAlign: 'center' }}>Amplop Digital</h2>
        <Card>
          <CardContent>
            {data.amplop.bank?.map((b, i) => (
              <p key={i} style={{ margin: '8px 0', fontSize: 14 }}>
                🏦 <strong>{b.bank}</strong><br />
                {b.nomor} a.n. {b.atasNama}
              </p>
            ))}
            {data.amplop.ewallet?.map((e, i) => (
              <p key={i} style={{ margin: '8px 0', fontSize: 14 }}>
                📱 <strong>{e.provider}</strong><br />
                {e.nomor} a.n. {e.atasNama}
              </p>
            ))}
            {data.amplop.alamatKado && (
              <p style={{ margin: '8px 0', fontSize: 14 }}>🎁 Kirim kado fisik ke:<br />{data.amplop.alamatKado}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <footer style={{ textAlign: 'center', marginTop: 32, color: '#6b7280', fontSize: 13 }}>
        <p>Dibuat dengan Madevi Undangan</p>
      </footer>
    </div>
  );
}
