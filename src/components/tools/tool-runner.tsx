'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ToolDefinition } from '@/contracts/tools-registry';

export type ToolRunnerProps = {
  tool: ToolDefinition;
};

/**
 * ToolRunner generik: render form dari inputSchema, jalankan handler,
 * tampilkan hasil. Satu komponen untuk semua tools di registry.
 */
export function ToolRunner({ tool }: ToolRunnerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [hasil, setHasil] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const jalankan = async () => {
    setLoading(true);
    setError(null);
    setHasil(null);
    try {
      // Validasi required
      for (const f of tool.inputSchema) {
        if (f.required && !values[f.key]?.trim()) {
          throw new Error(`'${f.labelId}' wajib diisi.`);
        }
      }
      const ctx = {
        values,
        tool,
        now: new Date(),
      };
      const result = await tool.handler(ctx as never);
      const output = result.output as Record<string, unknown>;
      setHasil(
        typeof output.teks === 'string'
          ? output.teks
          : JSON.stringify(output, null, 2),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 48px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Badge variant="info" size="sm">{tool.category}</Badge>
        <Badge size="sm" variant="neutral">v{tool.version}</Badge>
      </div>
      <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px' }}>{tool.nameId}</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>{tool.descriptionId}</p>

      <Card>
        <CardHeader><h3>Input</h3></CardHeader>
        <CardContent>
          {tool.inputSchema.map((f) => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label
                htmlFor={`tool-${f.key}`}
                style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}
              >
                {f.labelId}
                {f.required && <span style={{ color: '#ef4444' }}> *</span>}
                {f.unit && <span style={{ color: '#6b7280', fontWeight: 400 }}> ({f.unit})</span>}
              </label>
              {f.type === 'boolean' ? (
                <input
                  id={`tool-${f.key}`}
                  type="checkbox"
                  checked={values[f.key] === 'true'}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked ? 'true' : 'false' }))}
                  style={{ width: 20, height: 20, accentColor: '#0ea5e9' }}
                />
              ) : (
                <input
                  id={`tool-${f.key}`}
                  type={f.type === 'number' ? 'number' : 'text'}
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  min={f.minimum}
                  max={f.maximum}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
                />
              )}
            </div>
          ))}
          <Button onClick={jalankan} disabled={loading}>
            {loading ? 'Menghitung…' : '▶ Jalankan'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card style={{ marginTop: 16, borderColor: '#fecaca' }}>
          <CardContent>
            <p style={{ color: '#b91c1c', margin: 0 }}>⚠️ {error}</p>
          </CardContent>
        </Card>
      )}

      {hasil && (
        <Card variant="elevated" style={{ marginTop: 16 }}>
          <CardHeader><h3>Hasil</h3></CardHeader>
          <CardContent>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {hasil}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
