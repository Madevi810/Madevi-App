// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthCard } from '@/components/auth-card';
import { OwnerLoginForm } from '@/components/owner-login-form';
import { ProfileDashboard } from '@/components/profile-dashboard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('UI Prompt 04', () => {
  it('auth memakai dua tab, tiga identifier, Google nonaktif, dan anak fail-closed O-01', async () => {
    const user = userEvent.setup();
    render(<AuthCard />);
    expect(screen.getByRole('tab', { name: 'Login' }).getAttribute('aria-selected')).toBe('true');
    expect(
      (screen.getByLabelText('Username, email, atau nomor') as HTMLInputElement).required,
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: /Google OAuth/ }) as HTMLButtonElement).disabled,
    ).toBe(true);
    await user.click(screen.getByRole('tab', { name: 'Daftar' }));
    fireEvent.change(screen.getByLabelText('Tanggal lahir'), { target: { value: '2015-01-01' } });
    expect(screen.getByText(/Jangan kirim data\/foto anak nyata/)).not.toBeNull();
    expect(screen.getByText(/O-01/)).not.toBeNull();
    expect((screen.getByLabelText(/Foto bersama wali/) as HTMLInputElement).disabled).toBe(true);
  });

  it('profil memusatkan informasi akun dan kontrol keamanan tanpa tab duplikat', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: {
              display_name: 'Anggota TEST',
              username: 'anggota.test',
              approval_status: 'APPROVED',
              entitlement_status: 'NONE',
              email: 'member@example.test',
              phone: null,
              city: 'Kota TEST',
              profile_description: '',
              access: { status: 'RESTRICTED', label: 'Akses Dibatasi' },
            },
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
      ),
    );
    render(<ProfileDashboard />);
    await screen.findByText('Anggota TEST');
    expect(screen.getByRole('heading', { name: 'Kelola akun Anda' })).not.toBeNull();
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.getByRole('button', { name: 'Aktifkan 2FA email' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Ganti dan cabut sesi' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Minta ekspor data' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Minta hapus akun' })).not.toBeNull();
    expect(screen.getByText(/Akses Dibatasi/).className).toContain('profile-access--restricted');
  });

  it('login Admin memakai identifier dan password; perangkat diikat server-side', () => {
    // Kontrak nyata (bukti: challenge 410 obsolete; login hanya identifier+password;
    // owner_devices di-LEFT-JOIN server-side di AccountsService.ownerLogin).
    // UI device-first tanpa endpoint verifikasi akan menjadi kontrol palsu.
    render(<OwnerLoginForm />);
    expect((screen.getByLabelText('Username / Email') as HTMLInputElement).required).toBe(true);
    expect((screen.getByLabelText('Password') as HTMLInputElement).required).toBe(true);
    expect(screen.queryByLabelText('ID Perangkat')).toBeNull();
  });

  it('profil publik dan konsol Admin ditandai noindex dalam metadata route', async () => {
    const publicProfile = await import('@/app/profil/[username]/page');
    const owner = await import('@/app/owner/page');
    expect(publicProfile.metadata.robots).toEqual({ index: false, follow: false });
    expect(owner.metadata.robots).toEqual({ index: false, follow: false });
  });
});
