'use client';

import { useState } from 'react';
import Link from 'next/link';

import { PublicShell } from '@/components/public-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TEMPLATE_UNDANGAN, KATEGORI_LABEL } from '@/services/undangan-template';
import type { KategoriTemplate } from '@/services/undangan';

export const dynamic = 'force-dynamic';

/**
 * Galeri template undangan: filter per kategori, preview karakter tiap template.
 */
export default function GaleriTemplatePage() {
  const [filter, setFilter] = useState<KategoriTemplate | 'semua'>('semua');
  const tampil = TEMPLATE_UNDANGAN.filter((t) => filter === 'semua' || t.kategori === filter);

  return (
    <PublicShell>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px 48px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Galeri Template Undangan</h1>
        <p style={{ color: '#6b7280', marginBottom: 16, maxWidth: '70ch' }}>
          12 template dalam 6 kategori. Setiap paket berisi 2 template pilihan.
          Preview gratis sebelum membayar — beda dari kompetitor.
        </p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {(['semua', 'adat', 'floral', 'minimalis', 'nature', 'vintage', 'fairytale'] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={filter === k ? 'default' : 'ghost'}
              onClick={() => setFilter(k)}
            >
              {k === 'semua' ? 'Semua' : KATEGORI_LABEL[k]}
            </Button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {tampil.map((t) => (
            <Card key={t.id} variant="interactive">
              <CardContent>
                <div
                  style={{
                    height: 120,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${t.warnaDefault}33, ${t.warnaDefault}11)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    marginBottom: 12,
                  }}
                  aria-hidden
                >
                  {t.previewEmoji}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <strong>{t.nama}</strong>
                  <Badge size="sm" variant="neutral">{KATEGORI_LABEL[t.kategori]}</Badge>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5 }}>
                  {t.deskripsi}
                </p>
                <Link href={`/undangan/buat?template=${t.id}`}>
                  <Button size="sm">Pakai Template Ini</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
