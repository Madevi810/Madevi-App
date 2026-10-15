// @vitest-environment happy-dom

import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AiButton } from '@/components/ai-button';
import { FeedbackForm } from '@/components/feedback-form';
import { Header } from '@/components/header';
import { PublicShell } from '@/components/public-shell';
import { SearchOverlay } from '@/components/search-overlay';
import { ThemeProvider } from '@/components/theme-provider';

function providers(child: React.ReactNode) {
  return <ThemeProvider>{child}</ThemeProvider>;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = 'id';
  document.documentElement.setAttribute('data-language', 'id');
  document.documentElement.removeAttribute('data-theme');
  document.body.style.overflow = '';
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Prompt 03 — perilaku dialog dan preferensi', () => {
  it('search mengambil fokus, terkunci dalam dialog, Escape menutup dan memulihkan fokus', async () => {
    const user = userEvent.setup();
    render(providers(<Header />));
    const trigger = screen.getByRole('button', { name: 'Buka pencarian' });
    await user.click(trigger);
    const input = screen.getByRole('searchbox');
    await waitFor(() => expect(document.activeElement).toBe(input));
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.queryByText('Madevi')).toBeNull();
    await user.tab();
    // Header search merender tombol MENU (buka sidebar) setelah input,
    // lalu SearchOverlay merender tombol Tutup pencarian.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Buka menu' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Tutup pencarian' }));
    // Filter ruang (L06) dan filter kategori adalah kontrol pencarian yang
    // sengaja dapat dijangkau keyboard; urutan mengikuti DOM.
    const spaceFilters = [
      'Explore & Learn',
      'Tutorial & Problem Solve',
      'Madevi School',
      'Madevi Line',
      'Madevi Services',
      'Madevi Shop',
      'Tools & Equipment',
    ];
    for (const name of spaceFilters) {
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name }));
    }
    for (const name of ['MENU', 'ARTICLE', 'PROFILE', 'SOFTWARE', 'PAGE', 'SERVICE', 'PRODUCT', 'POST']) {
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name }));
    }
    // Fokus terakhir di dialog → Tab kembali ke elemen pertama (focus trap).
    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'POST' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('searchbox')).toBeNull());
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Buka pencarian' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('sidebar desain terkunci: 7 ruang + laporkan masalah, backdrop/Escape menutup', async () => {
    const user = userEvent.setup();
    const { container } = render(
      providers(
        <PublicShell>
          <main id="main-content">Konten</main>
        </PublicShell>,
      ),
    );
    const trigger = screen.getByRole('button', { name: 'Buka menu' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    // Desain terkunci 20261015: 7 kolom ruang, tanpa tab Website/Profil.
    const rooms = within(dialog).getAllByRole('link', {
      name: /Explore & Learn|Tutorial & Problem Solve|Madevi School|Madevi Line|Madevi Services|Madevi Shop|Tools & Equipment/,
    });
    expect(rooms).toHaveLength(7);
    expect(
      within(dialog).getByRole('link', { name: 'Laporkan masalah' }).getAttribute('href'),
    ).toBe('/laporkan-masalah');
    expect(within(dialog).queryByRole('tab')).toBeNull();
    // Icon header berganti jadi X saat sidebar terbuka.
    expect(screen.getByRole('button', { name: 'Tutup menu' })).toBe(trigger);
    await user.click(container.querySelector('.sidebar-backdrop')!);
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull());
    expect(document.activeElement).toBe(trigger);
    expect(screen.getByRole('button', { name: 'Buka menu' })).toBe(trigger);
    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('settings menyimpan tema/bahasa, tidak membuka halaman, dan kembali ke sidebar', async () => {
    const user = userEvent.setup();
    render(
      providers(
        <PublicShell>
          <main id="main-content">Konten</main>
        </PublicShell>,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Buka menu' }));
    const settingsTrigger = screen.getByRole('button', { name: 'Pengaturan' });
    await user.click(settingsTrigger);
    const settings = screen.getByRole('dialog', { name: 'Pengaturan' });
    // Nama aksesibel radio memuat juga deskripsi tema di dalam label.
    // Tema default adalah Gelap (radio sudah tercentang) sehingga klik Gelap
    // langsung tidak memicu onChange; pilih Terang dulu agar ada perubahan.
    await user.click(within(settings).getByRole('radio', { name: /^Terang/ }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    await user.click(within(settings).getByRole('radio', { name: /^Gelap/ }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('madevi-theme')).toBe('dark');
    await user.click(within(settings).getByRole('radio', { name: 'English' }));
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('madevi-language')).toBe('en');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Settings' })).toBeNull());
    expect(screen.getByRole('dialog', { name: 'Menu' })).not.toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Settings' }));
  });

  it('AI memiliki tepat tiga riwayat ringkas serta memulihkan fokus saat ditutup', async () => {
    // Tiap fetch harus dapat Response baru: body Response hanya bisa dibaca sekali,
    // dan AiButton memanggil /api/v1/ai/availability sebelum /api/v1/ai/conversations.
    const historyBody = () =>
      new Response(
        JSON.stringify({
          data: [
            { id: 'history-1', title: 'Percakapan satu', updatedAt: '2026-09-13T00:00:00.000Z' },
            { id: 'history-2', title: 'Percakapan dua', updatedAt: '2026-09-13T00:00:00.000Z' },
            { id: 'history-3', title: 'Percakapan tiga', updatedAt: '2026-09-13T00:00:00.000Z' },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(historyBody())),
    );
    const user = userEvent.setup();
    render(providers(<AiButton />));
    // Label komponen kini "Asisten Madevi" (drift dari "AI Asisten" diperbaiki di test).
    const trigger = screen.getByRole('button', { name: /^Buka Asisten Madevi/ });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Asisten Madevi' });
    await user.click(within(dialog).getByRole('button', { name: 'Riwayat percakapan' }));
    await waitFor(() => expect(within(dialog).getAllByRole('listitem')).toHaveLength(3));
    await user.click(within(dialog).getByRole('button', { name: 'Tutup Asisten Madevi' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Asisten Madevi' })).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('search membaca array data API dan mengarahkan artikel memakai object ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [
              {
                entryType: 'ARTICLE',
                objectId: 'article-123',
                title: 'Artikel contoh',
                slug: 'artikel-contoh',
                summary: 'Ringkasan contoh',
                accessLevel: 'PUBLIC',
                snippet: 'Ringkasan contoh',
              },
            ],
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      ),
    );
    render(<SearchOverlay query="contoh" onClose={() => {}} language="id" />);
    // SearchOverlay mendebose kueri 300 ms sebelum memanggil API.
    const link = await screen.findByRole(
      'link',
      { name: /Artikel contoh/ },
      { timeout: 15_000 },
    );
    expect(link.getAttribute('href')).toBe('/artikel/article-123');
  });

  it('search membedakan kegagalan layanan dari hasil kosong', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('gagal', { status: 503 })));
    render(<SearchOverlay query="contoh" onClose={() => {}} language="id" />);
    // SearchOverlay mendebose kueri 300 ms sebelum memanggil API.
    expect(
      await screen.findByText('Pencarian belum dapat dimuat. Coba lagi.', {}, { timeout: 15_000 }),
    ).not.toBeNull();
    expect(screen.queryByText('Tidak ditemukan')).toBeNull();
  });
});

describe('Prompt 03 — form simulasi', () => {
  it('mengirim data fiktif dengan idempotency key dan menampilkan sukses', async () => {
    // Response baru per panggilan: ThemeProvider ikut fetch saat mount.
    const okBody = () =>
      new Response(JSON.stringify({ data: { queued: true }, requestId: crypto.randomUUID() }), {
        status: 202,
        headers: { 'content-type': 'application/json' },
      });
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(okBody()));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(providers(<FeedbackForm kind="REVIEW" />));
    await user.type(screen.getByLabelText('Fitur'), 'Fitur contoh');
    await user.type(screen.getByLabelText('Ulasan'), 'Ulasan fiktif untuk pengujian lokal.');
    await user.click(screen.getByRole('button', { name: 'Kirim Ulasan' }));
    await screen.findByText(/berhasil dikirim ke inbox Owner/);
    const submitCalls = fetchMock.mock.calls.filter((call) =>
      String(call[0]).includes('/api/v1/public-feedback'),
    );
    expect(submitCalls).toHaveLength(1);
    const [, init] = submitCalls[0]!;
    expect((init as RequestInit).headers).toMatchObject({
      'content-type': 'application/json',
      'idempotency-key': expect.any(String),
    });
  });

  it('memakai idempotency key yang sama saat kiriman identik dicoba ulang setelah gagal', async () => {
    const okBody = () =>
      new Response(JSON.stringify({ data: { queued: true }, requestId: crypto.randomUUID() }), {
        status: 202,
        headers: { 'content-type': 'application/json' },
      });
    // Penolakan hanya untuk panggilan submit pertama; fetch mount ThemeProvider
    // (/api/v1/profile) harus tetap dijawab agar tidak ikut gagal.
    let submitAttempts = 0;
    const fetchMock = vi.fn().mockImplementation((url: unknown) => {
      if (String(url).includes('/api/v1/public-feedback') && submitAttempts++ === 0) {
        return Promise.reject(new Error('Simulasi jaringan gagal'));
      }
      return Promise.resolve(okBody());
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(providers(<FeedbackForm kind="REPORT" />));
    // Topik laporan kini dipilih lewat kapsul, bukan select.
    await user.click(screen.getByRole('button', { name: 'Bug / error teknis' }));
    await user.type(screen.getByLabelText('Deskripsi'), 'Laporan fiktif untuk mencoba ulang.');
    await user.click(screen.getByRole('button', { name: 'Kirim Laporan' }));
    await screen.findByText('Simulasi jaringan gagal');
    await user.click(screen.getByRole('button', { name: 'Kirim Laporan' }));
    await screen.findByText(/berhasil dikirim ke inbox Owner/);
    const submitCalls = fetchMock.mock.calls.filter((call) =>
      String(call[0]).includes('/api/v1/public-feedback'),
    );
    expect(submitCalls).toHaveLength(2);
    const firstHeaders = submitCalls[0]![1]!.headers as Record<string, string>;
    const retryHeaders = submitCalls[1]![1]!.headers as Record<string, string>;
    expect(retryHeaders['idempotency-key']).toBe(firstHeaders['idempotency-key']);
  });
});
