import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((destination: string) => {
    throw new Error(`REDIRECT:${destination}`);
  }),
}));

vi.mock('next/navigation', () => ({ redirect: redirectMock }));
vi.mock('@/components/public-shell', () => ({
  PublicShell: ({ children }: { children: React.ReactNode }) =>
    createElement('main', null, children),
}));
vi.mock('@/components/jasa/invitation-gallery', () => ({
  InvitationGallery: ({ isId }: { isId: boolean }) =>
    createElement(
      'section',
      { 'data-gallery-language': isId ? 'id' : 'en' },
      'Invitation gallery',
    ),
}));
vi.mock('@/components/jasa/invitation-order-form', () => ({
  InvitationOrderForm: () => createElement('form', { 'data-custom-brief-form': true }),
}));

import UndanganOrderFormPage from '@/app/jasa/undangan/order/page';

describe('UndanganOrderFormPage', () => {
  it('renders standalone order introduction and existing invitation gallery without token', async () => {
    redirectMock.mockClear();
    const element = await UndanganOrderFormPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('Pesan Undangan Baru');
    expect(html).toContain('Invitation gallery');
    expect(html).toContain('data-gallery-language="id"');
    expect(html).toContain('data-custom-brief-form="true"');
    expect(html.match(/<main\b/g) ?? []).toHaveLength(1);
    expect(html).not.toContain('akan diimplementasikan di sini');
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('keeps legacy private token links on the canonical tracking route', async () => {
    redirectMock.mockClear();
    await expect(
      UndanganOrderFormPage({ searchParams: Promise.resolve({ token: 'a b&c' }) }),
    ).rejects.toThrow('REDIRECT:/jasa/tracking?token=a%20b%26c');
    expect(redirectMock).toHaveBeenCalledWith('/jasa/tracking?token=a%20b%26c');
  });
});
