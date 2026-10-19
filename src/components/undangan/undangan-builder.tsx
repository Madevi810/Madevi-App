'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UndanganView } from './undangan-view';
import { TEMPLATE_UNDANGAN, templateById, KATEGORI_LABEL } from '@/services/undangan-template';
import type { DataUndangan, KategoriTemplate } from '@/services/undangan';

const LANGKAH = [
  'Template',
  'Mempelai',
  'Acara',
  'Galeri & Cerita',
  'RSVP & Amplop',
  'Pratinjau',
] as const;

function undanganAwal(): DataUndangan {
  return {
    slug: '',
    templateId: 'minimal-putih',
    kategori: 'minimalis',
    warnaUtama: '#4A5568',
    fontJudul: 'serif',
    mempelaiPria: { namaLengkap: '', namaPanggilan: '', putraDari: '' },
    mempelaiWanita: { namaLengkap: '', namaPanggilan: '', putraDari: '' },
    coverSambutan: 'Kami mengundang Anda ke acara pernikahan kami',
    acara: [
      {
        nama: 'Akad Nikah',
        tanggal: '',
        jamMulai: '08:00',
        jamSelesai: '10:00',
        tempat: '',
        alamat: '',
      },
    ],
    rsvp: { aktif: true, pertanyaanCustom: [] },
    amplop: {},
    rundown: [],
  };
}

/**
 * Builder undangan bertahap: 6 langkah dengan pratinjau live.
 * Pola katsudoto, dibuat lebih ringan untuk HP.
 */
export function UndanganBuilder() {
  const [langkah, setLangkah] = useState(0);
  const [data, setData] = useState<DataUndangan>(undanganAwal);
  const [filterKategori, setFilterKategori] = useState<KategoriTemplate | 'semua'>('semua');

  const ubah = (patch: Partial<DataUndangan>) => setData((d) => ({ ...d, ...patch }));
  const template = templateById(data.templateId);
  const templateTampil = TEMPLATE_UNDANGAN.filter(
    (t) => filterKategori === 'semua' || t.kategori === filterKategori,
  );

  const inputStyle = {
    width: '100%',
    padding: 8,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    marginBottom: 8,
  } as const;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Buat Undangan Digital</h1>

      {/* Indikator langkah */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {LANGKAH.map((l, i) => (
          <button
            key={l}
            onClick={() => setLangkah(i)}
            style={{
              padding: '6px 12px',
              borderRadius: 9999,
              border: '1px solid #d1d5db',
              background: i === langkah ? '#0ea5e9' : i < langkah ? '#e0f2fe' : '#fff',
              color: i === langkah ? '#fff' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: i === langkah ? 700 : 400,
            }}
          >
            {i + 1}. {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Form */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {langkah === 0 && (
            <Card>
              <CardHeader><h3>Pilih Template</h3></CardHeader>
              <CardContent>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(['semua', 'adat', 'floral', 'minimalis', 'nature', 'vintage', 'fairytale'] as const).map((k) => (
                    <Button
                      key={k}
                      size="sm"
                      variant={filterKategori === k ? 'default' : 'ghost'}
                      onClick={() => setFilterKategori(k)}
                    >
                      {k === 'semua' ? 'Semua' : KATEGORI_LABEL[k]}
                    </Button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                  {templateTampil.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => ubah({ templateId: t.id, kategori: t.kategori, warnaUtama: t.warnaDefault, fontJudul: t.fontDefault })}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: data.templateId === t.id ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
                        background: '#fff',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.8rem' }}>{t.previewEmoji}</div>
                      <strong style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{t.nama}</strong>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{KATEGORI_LABEL[t.kategori]}</span>
                    </button>
                  ))}
                </div>
                {template && (
                  <p style={{ fontSize: 13, color: '#6b7280', marginTop: 12 }}>{template.deskripsi}</p>
                )}
              </CardContent>
            </Card>
          )}

          {langkah === 1 && (
            <Card>
              <CardHeader><h3>Data Mempelai</h3></CardHeader>
              <CardContent>
                {(['mempelaiPria', 'mempelaiWanita'] as const).map((key) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <Badge size="sm" style={{ marginBottom: 8 }}>
                      {key === 'mempelaiPria' ? 'Mempelai Pria' : 'Mempelai Wanita'}
                    </Badge>
                    <input
                      placeholder="Nama lengkap"
                      value={data[key].namaLengkap}
                      onChange={(e) => ubah({ [key]: { ...data[key], namaLengkap: e.target.value } })}
                      style={inputStyle}
                    />
                    <input
                      placeholder="Nama panggilan"
                      value={data[key].namaPanggilan}
                      onChange={(e) => ubah({ [key]: { ...data[key], namaPanggilan: e.target.value } })}
                      style={inputStyle}
                    />
                    <input
                      placeholder="Putra/Putri dari (contoh: Putra dari Bpk. X & Ibu Y)"
                      value={data[key].putraDari}
                      onChange={(e) => ubah({ [key]: { ...data[key], putraDari: e.target.value } })}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <input
                  placeholder="Kalimat sambutan cover"
                  value={data.coverSambutan}
                  onChange={(e) => ubah({ coverSambutan: e.target.value })}
                  style={inputStyle}
                />
              </CardContent>
            </Card>
          )}

          {langkah === 2 && (
            <Card>
              <CardHeader><h3>Waktu & Tempat Acara</h3></CardHeader>
              <CardContent>
                {data.acara.map((a, i) => (
                  <div key={i} style={{ marginBottom: 16, padding: 12, border: '1px solid #f3f4f6', borderRadius: 8 }}>
                    <input
                      placeholder="Nama acara (Akad Nikah / Resepsi)"
                      value={a.nama}
                      onChange={(e) => {
                        const acara = [...data.acara];
                        acara[i] = { ...a, nama: e.target.value };
                        ubah({ acara });
                      }}
                      style={inputStyle}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="date"
                        value={a.tanggal}
                        onChange={(e) => {
                          const acara = [...data.acara];
                          acara[i] = { ...a, tanggal: e.target.value };
                          ubah({ acara });
                        }}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <input
                        type="time"
                        value={a.jamMulai}
                        onChange={(e) => {
                          const acara = [...data.acara];
                          acara[i] = { ...a, jamMulai: e.target.value };
                          ubah({ acara });
                        }}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                    <input
                      placeholder="Tempat (Gedung Serbaguna ...)"
                      value={a.tempat}
                      onChange={(e) => {
                        const acara = [...data.acara];
                        acara[i] = { ...a, tempat: e.target.value };
                        ubah({ acara });
                      }}
                      style={inputStyle}
                    />
                    <input
                      placeholder="Alamat lengkap"
                      value={a.alamat}
                      onChange={(e) => {
                        const acara = [...data.acara];
                        acara[i] = { ...a, alamat: e.target.value };
                        ubah({ acara });
                      }}
                      style={inputStyle}
                    />
                    <input
                      placeholder="Link Google Maps (opsional)"
                      value={a.mapsUrl ?? ''}
                      onChange={(e) => {
                        const acara = [...data.acara];
                        acara[i] = { ...a, mapsUrl: e.target.value };
                        ubah({ acara });
                      }}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    ubah({
                      acara: [
                        ...data.acara,
                        { nama: 'Resepsi', tanggal: '', jamMulai: '11:00', jamSelesai: '13:00', tempat: '', alamat: '' },
                      ],
                    })
                  }
                >
                  ＋ Tambah acara
                </Button>
              </CardContent>
            </Card>
          )}

          {langkah === 5 && (
            <Card>
              <CardHeader><h3>Pratinjau & Simpan</h3></CardHeader>
              <CardContent>
                <p style={{ fontSize: 14, color: '#6b7280' }}>
                  Ini pratinjau live undangan Anda. Klik "Buka Undangan" di pratinjau untuk melihat tampilan tamu.
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button>💾 Simpan sebagai Draf</Button>
                  <Button variant="outline">🚀 Terbitkan</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {langkah === 3 && (
            <Card>
              <CardHeader><h3>Galeri & Cerita Cinta</h3></CardHeader>
              <CardContent>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Foto Galeri (URL)</h4>
                {(data.galeriFoto ?? []).map((url, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      placeholder={`URL foto ${i + 1}`}
                      value={url}
                      onChange={(e) => {
                        const galeriFoto = [...(data.galeriFoto ?? [])];
                        galeriFoto[i] = e.target.value;
                        ubah({ galeriFoto });
                      }}
                      style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => ubah({ galeriFoto: (data.galeriFoto ?? []).filter((_, j) => j !== i) })}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => ubah({ galeriFoto: [...(data.galeriFoto ?? []), ''] })}
                >
                  ＋ Tambah foto
                </Button>

                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Cerita Cinta</h4>
                {(data.loveStory ?? []).map((s, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 12, border: '1px solid #f3f4f6', borderRadius: 8 }}>
                    <input
                      placeholder="Judul (Pertama Bertemu)"
                      value={s.judul}
                      onChange={(e) => {
                        const loveStory = [...(data.loveStory ?? [])];
                        loveStory[i] = { ...s, judul: e.target.value };
                        ubah({ loveStory });
                      }}
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      value={s.tanggal}
                      onChange={(e) => {
                        const loveStory = [...(data.loveStory ?? [])];
                        loveStory[i] = { ...s, tanggal: e.target.value };
                        ubah({ loveStory });
                      }}
                      style={inputStyle}
                    />
                    <textarea
                      placeholder="Ceritakan momen ini..."
                      value={s.cerita}
                      onChange={(e) => {
                        const loveStory = [...(data.loveStory ?? [])];
                        loveStory[i] = { ...s, cerita: e.target.value };
                        ubah({ loveStory });
                      }}
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => ubah({ loveStory: (data.loveStory ?? []).filter((_, j) => j !== i) })}
                    >
                      Hapus cerita
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    ubah({ loveStory: [...(data.loveStory ?? []), { judul: '', tanggal: '', cerita: '' }] })
                  }
                >
                  ＋ Tambah cerita
                </Button>

                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Video & Musik (opsional)</h4>
                <input
                  placeholder="URL video (YouTube/mp4)"
                  value={data.videoUrl ?? ''}
                  onChange={(e) => ubah({ videoUrl: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="URL musik latar (mp3)"
                  value={data.musikUrl ?? ''}
                  onChange={(e) => ubah({ musikUrl: e.target.value })}
                  style={inputStyle}
                />
              </CardContent>
            </Card>
          )}

          {langkah === 4 && (
            <Card>
              <CardHeader><h3>RSVP & Amplop Digital</h3></CardHeader>
              <CardContent>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={data.rsvp.aktif}
                    onChange={(e) => ubah({ rsvp: { ...data.rsvp, aktif: e.target.checked } })}
                  />
                  Aktifkan RSVP (konfirmasi kehadiran)
                </label>
                {data.rsvp.aktif && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, color: '#6b7280' }}>Batas RSVP</label>
                    <input
                      type="date"
                      value={data.rsvp.deadline ?? ''}
                      onChange={(e) => ubah({ rsvp: { ...data.rsvp, deadline: e.target.value } })}
                      style={inputStyle}
                    />
                    <h4 style={{ fontSize: 14, fontWeight: 600, margin: '8px 0' }}>Pertanyaan tambahan</h4>
                    {(data.rsvp.pertanyaanCustom ?? []).map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          placeholder="Contoh: Alergi makanan?"
                          value={p.pertanyaan}
                          onChange={(e) => {
                            const pertanyaanCustom = [...(data.rsvp.pertanyaanCustom ?? [])];
                            pertanyaanCustom[i] = { ...p, pertanyaan: e.target.value };
                            ubah({ rsvp: { ...data.rsvp, pertanyaanCustom } });
                          }}
                          style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            ubah({
                              rsvp: {
                                ...data.rsvp,
                                pertanyaanCustom: (data.rsvp.pertanyaanCustom ?? []).filter((_, j) => j !== i),
                              },
                            })
                          }
                        >
                          Hapus
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        ubah({
                          rsvp: {
                            ...data.rsvp,
                            pertanyaanCustom: [
                              ...(data.rsvp.pertanyaanCustom ?? []),
                              { id: `q-${Date.now()}`, pertanyaan: '', tipe: 'teks' as const },
                            ],
                          },
                        })
                      }
                    >
                      ＋ Tambah pertanyaan
                    </Button>
                  </div>
                )}

                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Rekening Bank</h4>
                {(data.amplop.bank ?? []).map((b, i) => (
                  <div key={i} style={{ marginBottom: 8, padding: 8, border: '1px solid #f3f4f6', borderRadius: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        placeholder="Bank (BCA)"
                        value={b.bank}
                        onChange={(e) => {
                          const bank = [...(data.amplop.bank ?? [])];
                          bank[i] = { ...b, bank: e.target.value };
                          ubah({ amplop: { ...data.amplop, bank } });
                        }}
                        style={{ ...inputStyle, flex: 1, marginBottom: 4 }}
                      />
                      <input
                        placeholder="Nomor rekening"
                        value={b.nomor}
                        onChange={(e) => {
                          const bank = [...(data.amplop.bank ?? [])];
                          bank[i] = { ...b, nomor: e.target.value };
                          ubah({ amplop: { ...data.amplop, bank } });
                        }}
                        style={{ ...inputStyle, flex: 2, marginBottom: 4 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        placeholder="Atas nama"
                        value={b.atasNama}
                        onChange={(e) => {
                          const bank = [...(data.amplop.bank ?? [])];
                          bank[i] = { ...b, atasNama: e.target.value };
                          ubah({ amplop: { ...data.amplop, bank } });
                        }}
                        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          ubah({ amplop: { ...data.amplop, bank: (data.amplop.bank ?? []).filter((_, j) => j !== i) } })
                        }
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    ubah({
                      amplop: {
                        ...data.amplop,
                        bank: [...(data.amplop.bank ?? []), { bank: '', nomor: '', atasNama: '' }],
                      },
                    })
                  }
                >
                  ＋ Tambah rekening
                </Button>

                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>E-Wallet</h4>
                {(data.amplop.ewallet ?? []).map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      placeholder="Provider (DANA/OVO/GoPay)"
                      value={w.provider}
                      onChange={(e) => {
                        const ewallet = [...(data.amplop.ewallet ?? [])];
                        ewallet[i] = { ...w, provider: e.target.value };
                        ubah({ amplop: { ...data.amplop, ewallet } });
                      }}
                      style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                    />
                    <input
                      placeholder="Nomor"
                      value={w.nomor}
                      onChange={(e) => {
                        const ewallet = [...(data.amplop.ewallet ?? [])];
                        ewallet[i] = { ...w, nomor: e.target.value };
                        ubah({ amplop: { ...data.amplop, ewallet } });
                      }}
                      style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        ubah({
                          amplop: { ...data.amplop, ewallet: (data.amplop.ewallet ?? []).filter((_, j) => j !== i) },
                        })
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    ubah({
                      amplop: {
                        ...data.amplop,
                        ewallet: [...(data.amplop.ewallet ?? []), { provider: '', nomor: '', atasNama: '' }],
                      },
                    })
                  }
                >
                  ＋ Tambah e-wallet
                </Button>

                <h4 style={{ fontSize: 14, fontWeight: 600, margin: '16px 0 8px' }}>Alamat Kirim Kado</h4>
                <textarea
                  placeholder="Alamat lengkap untuk kirim kado fisik"
                  value={data.amplop.alamatKado ?? ''}
                  onChange={(e) => ubah({ amplop: { ...data.amplop, alamatKado: e.target.value } })}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                  Simulasi: pembayaran dan transfer tidak nyata — data hanya tersimpan sebagai draf.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigasi */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Button variant="outline" disabled={langkah === 0} onClick={() => setLangkah((l) => l - 1)}>
              ← Kembali
            </Button>
            <Button disabled={langkah === LANGKAH.length - 1} onClick={() => setLangkah((l) => l + 1)}>
              Lanjut →
            </Button>
          </div>
        </div>

        {/* Pratinjau live */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ position: 'sticky', top: 16 }}>
            <Badge size="sm" variant="info" style={{ marginBottom: 8 }}>Pratinjau Live</Badge>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', maxHeight: 600, overflowY: 'auto' }}>
              <UndanganView data={{ ...data, slug: data.slug || 'pratinjau' }} namaTamu="Tamu Undangan" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
