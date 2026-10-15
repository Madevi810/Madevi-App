/**
 * Tes Prompt 03 — Desain dan Layout Global
 *
 * Karena environment tes adalah Node (bukan browser/jsdom), tes ini memverifikasi:
 * 1. Keberadaan dan struktur file komponen UI yang wajib ada
 * 2. Konten penting dalam file CSS (token warna, breakpoint, ukuran sentuh)
 * 3. Keberadaan halaman informasi yang dipersyaratkan
 * 4. Keberadaan font Noto Sans lokal
 * 5. Aturan aksesibilitas dalam CSS (reduced-motion, focus-visible)
 * 6. Tidak ada horizontal overflow CSS global
 *
 * Tes visual viewport (360/412/768/1280px) dan tema gelap memerlukan
 * browser runner dan dikerjakan via smoke test.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const APP_ROOT = join(import.meta.dirname, '..', '..');

function readFile(rel: string) {
  return readFileSync(join(APP_ROOT, rel), 'utf-8');
}

function fileExists(rel: string) {
  return existsSync(join(APP_ROOT, rel));
}

// ===== F03-01: Komponen UI wajib ada =====
describe('F03-01: Komponen UI global tersedia', () => {
  const components = [
    'src/components/header.tsx',
    'src/components/sidebar.tsx',
    'src/components/footer.tsx',
    'src/components/search-overlay.tsx',
    'src/components/settings-popup.tsx',
    'src/components/ai-button.tsx',
    'src/components/public-shell.tsx',
    'src/components/home-content.tsx',
    'src/components/theme-provider.tsx',
    'src/components/dialog-behavior.ts',
    'src/components/feedback-form.tsx',
    'src/components/information-page.tsx',
  ];

  for (const comp of components) {
    it(`exists: ${comp}`, () => {
      expect(fileExists(comp), `${comp} harus ada`).toBe(true);
    });
  }
});

// ===== F03-02: Halaman informasi wajib ada =====
describe('F03-02: Halaman informasi tersedia', () => {
  const pages = [
    'src/app/tentang/page.tsx',
    'src/app/review/page.tsx',
    'src/app/ketentuan/page.tsx',
    'src/app/privasi/page.tsx',
    'src/app/laporkan-masalah/page.tsx',
  ];

  for (const page of pages) {
    it(`exists: ${page}`, () => {
      expect(fileExists(page), `${page} harus ada`).toBe(true);
    });
  }
});

// ===== F03-03: Font Noto Sans lokal =====
describe('F03-03: Font Noto Sans terinstall lokal', () => {
  it('paket @fontsource/noto-sans tersedia di node_modules', () => {
    expect(fileExists('node_modules/@fontsource/noto-sans')).toBe(true);
  });

  it('file wght 400 tersedia', () => {
    expect(fileExists('node_modules/@fontsource/noto-sans/400.css')).toBe(true);
  });

  it('file wght 600 tersedia', () => {
    expect(fileExists('node_modules/@fontsource/noto-sans/600.css')).toBe(true);
  });

  it('file wght 700 tersedia', () => {
    expect(fileExists('node_modules/@fontsource/noto-sans/700.css')).toBe(true);
  });

  it('globals.css mengimport @fontsource/noto-sans', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('@fontsource/noto-sans');
  });

  it('globals.css menyetel font-family Noto Sans', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain("'Noto Sans'");
  });
});

// ===== F03-04: Token desain dikunci =====
describe('F03-04: Token desain wajib', () => {
  it('aksen teal #0D9488 dikunci di tokens.css', () => {
    const tokens = readFile('src/styles/tokens.css');
    expect(tokens.toLowerCase()).toContain('#0d9488');
  });

  it('tema gelap ada di tokens.css', () => {
    const tokens = readFile('src/styles/tokens.css');
    expect(tokens).toContain("[data-theme='dark']");
  });

  it('--accent-strong tersedia', () => {
    const tokens = readFile('src/styles/tokens.css');
    expect(tokens).toContain('--accent-strong');
  });

  it('Tema Madevi On terdaftar di stylesheet khusus', () => {
    // UX-REDESIGN-001: Madevi On pindah dari komentar placeholder tokens.css
    // menjadi sheet khusus dengan atribut data-theme='madevi-on'.
    const onSheet = readFile('src/styles/madevi-on.css');
    expect(onSheet).toContain("[data-theme='madevi-on']");
  });
});

// ===== F03-05: Ukuran sentuh minimum 44px =====
describe('F03-05: Ukuran sentuh minimum 44px', () => {
  it('CSS mendefinisikan min-height 44px untuk button', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('min-height: 44px');
  });

  it('Tombol kapsul memiliki min-height 44px (.button)', () => {
    const css = readFile('src/styles/globals.css');
    // Cari blok .button yang mengandung min-height 44px
    const buttonBlock = css.split('.button')[1];
    expect(buttonBlock).toContain('44px');
  });
});

// ===== F03-06: Aksesibilitas — reduced-motion, focus-visible =====
describe('F03-06: CSS aksesibilitas', () => {
  it('globals.css mengandung reduced-motion', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('prefers-reduced-motion');
  });

  it('globals.css mengandung :focus-visible', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain(':focus-visible');
  });

  it('globals.css mengandung skip-link', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('.skip-link');
  });

  it('globals.css mengandung .sr-only untuk screen reader', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('.sr-only');
  });
});

// ===== F03-07: Breakpoints dan lebar konten =====
describe('F03-07: Breakpoints dan layout', () => {
  it('breakpoint HP 640px ada', () => {
    const css = readFile('src/styles/globals.css');
    // Breakpoint HP menggunakan min-width: 640px (mobile-first)
    expect(css).toMatch(/640px/);
  });

  it('breakpoint desktop >=1024px ada', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('1024px');
  });

  it('lebar konten mobile-first ditetapkan', () => {
    // UX-REDESIGN-001: full-bleed HP dengan batas 72rem pada layar lebar
    // (sebelumnya calc(100% - 24px)).
    const tokens = readFile('src/styles/tokens.css');
    expect(tokens).toContain('--content-width: min(100% - 2rem, 72rem)');
  });

  it('margin minimum 12px mobile-first ditetapkan via token', () => {
    // UX-REDESIGN-001: content-gap kini clamp — floor 1rem (16px) di mobile,
    // hingga 1.5rem (24px) pada layar lebar.
    const tokens = readFile('src/styles/tokens.css');
    expect(tokens).toContain('--content-gap: clamp(1rem, 3vw, 1.5rem)');
  });
});

// ===== F03-08: Sidebar 80vw dari kanan =====
describe('F03-08: Sidebar HP 80vw', () => {
  it('CSS sidebar mengatur width 80vw', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('80vw');
  });

  it('sidebar backdrop blur ada', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('.sidebar-backdrop');
  });
});

// ===== F03-09: ThemeProvider anti-flash =====
describe('F03-09: ThemeProvider tanpa flash tema', () => {
  it('theme-provider.tsx mengekspor THEME_SCRIPT', () => {
    const src = readFile('src/components/theme-provider.tsx');
    expect(src).toContain('THEME_SCRIPT');
  });

  it('THEME_SCRIPT menggunakan localStorage', () => {
    const src = readFile('src/components/theme-provider.tsx');
    expect(src).toContain('localStorage');
  });

  it('layout.tsx menyisipkan THEME_SCRIPT sebelum hydration', () => {
    const src = readFile('src/app/layout.tsx');
    expect(src).toContain('dangerouslySetInnerHTML');
    expect(src).toContain('THEME_SCRIPT');
  });

  it('layout.tsx menggunakan suppressHydrationWarning', () => {
    const src = readFile('src/app/layout.tsx');
    expect(src).toContain('suppressHydrationWarning');
  });
});

// ===== F03-10: AI popup placeholder =====
describe('F03-10: AI FAB dan popup', () => {
  it('ai-button.tsx mengekspor AiButton', () => {
    const src = readFile('src/components/ai-button.tsx');
    expect(src).toContain('export function AiButton');
  });

  it('AI popup menampilkan status kesiapan sumber lokal', () => {
    // Mock adapter Asisten telah dihapus (STATE: jawaban dari retrieval artikel
    // lokal); popup jujur memberi sinyal kesiapan sumber lokal, bukan
    // placeholder "belum aktif" warisan Prompt 03.
    const src = readFile('src/components/ai-button.tsx');
    expect(src).toContain('Sumber lokal');
  });

  it('AI popup memiliki link ke halaman penuh', () => {
    const src = readFile('src/components/ai-button.tsx');
    expect(src).toContain('/ai-asisten');
  });
});

// ===== F03-11: Footer mengandung tagline dan semua tautan =====
describe('F03-11: Footer permanen', () => {
  it('footer.tsx mengandung tagline produk', () => {
    // UX-REDESIGN-001: copyright tahun diganti tagline produk permanen.
    const src = readFile('src/components/footer.tsx');
    expect(src).toContain('Pengetahuan dan tindakan');
  });

  it('footer.tsx mengandung tautan /tentang', () => {
    const src = readFile('src/components/footer.tsx');
    expect(src).toContain('/tentang');
  });

  it('footer.tsx mengandung tautan /review', () => {
    const src = readFile('src/components/footer.tsx');
    expect(src).toContain('/review');
  });

  it('footer.tsx mengandung tautan /ketentuan', () => {
    const src = readFile('src/components/footer.tsx');
    expect(src).toContain('/ketentuan');
  });

  it('footer.tsx mengandung tautan /privasi', () => {
    const src = readFile('src/components/footer.tsx');
    expect(src).toContain('/privasi');
  });
});

// ===== F03-12: Halaman informasi berisi keterangan "Draf / simulasi" =====
describe('F03-12: Halaman informasi berlabel draf', () => {
  const pages = [
    { name: 'tentang', file: 'src/app/tentang/page.tsx' },
    { name: 'review', file: 'src/app/review/page.tsx' },
    { name: 'ketentuan', file: 'src/app/ketentuan/page.tsx' },
    { name: 'privasi', file: 'src/app/privasi/page.tsx' },
    { name: 'laporkan-masalah', file: 'src/app/laporkan-masalah/page.tsx' },
  ];

  for (const { name, file } of pages) {
    it(`halaman /${name} menggunakan InformationPage`, () => {
      const src = readFile(file);
      expect(src).toContain('InformationPage');
    });
  }

  it('InformationPage memakai PublicShell dan memberi label draf/simulasi', () => {
    const src = readFile('src/components/information-page.tsx');
    expect(src).toContain('PublicShell');
    expect(src.toLowerCase()).toMatch(/draf|simulasi/);
  });
});

// ===== F03-13: Sidebar DESAIN TERKUNCI 20261015 (spek Ade) =====
// Tab Website/Profil + tombol auth guest dipensiunkan; sidebar kini:
// jam+tanggal+pengaturan, developer card, 3 icon sosmed, laporkan masalah,
// divider, 7 kolom ruang.
describe('F03-13: Sidebar desain terkunci', () => {
  it('sidebar.tsx memuat kolom Laporkan masalah menuju /laporkan-masalah', () => {
    const src = readFile('src/components/sidebar.tsx');
    expect(src).toContain('/laporkan-masalah');
    expect(src).toContain('sidebar-report');
  });

  it('sidebar.tsx tidak lagi memakai tab Website/Profil atau kartu profil', () => {
    const src = readFile('src/components/sidebar.tsx');
    expect(src).not.toContain('sidebar__tab');
    expect(src).not.toContain('GuestProfileCard');
    expect(src).not.toContain('MemberProfileCard');
    expect(src).not.toContain('Daftar / Login');
  });

  it('sidebar.tsx merender 7 kolom ruang dari MADEVI_SPACES', () => {
    const src = readFile('src/components/sidebar.tsx');
    expect(src).toContain('MADEVI_SPACES');
    expect(src).toContain('sidebar-room');
    expect(src).toContain('sidebar-room--active');
  });

  it('sidebar.tsx menampilkan jam+tanggal dan tombol pengaturan bahasa/tema', () => {
    const src = readFile('src/components/sidebar.tsx');
    expect(src).toContain('sidebar__clock');
    expect(src).toContain('SettingsPopup');
    expect(src).toContain('madevi:sidebar-state');
  });

  it('header.tsx memakai teks Madevi + search kapsul + toggle hamburger/X', () => {
    const src = readFile('src/components/header.tsx');
    expect(src).toContain('site-header__brand-name');
    expect(src).toContain('>Madevi<');
    expect(src).toContain('site-header__search-pill');
    expect(src).toContain('madevi:sidebar-state');
    expect(src).not.toContain('AtlasWordmark');
  });

  it('desain-terkunci.css menempatkan sidebar di bawah header', () => {
    const css = readFile('src/styles/desain-terkunci.css');
    expect(css).toContain('locked-header-height');
    expect(css).toContain('.public-shell > .sidebar');
    expect(css).toContain('.sidebar-room--active::after');
  });
});

// ===== F03-14: Tidak ada PWA, service worker, tombol pasang =====
describe('F03-14: Bukan PWA', () => {
  it('layout.tsx tidak mengandung service-worker', () => {
    const src = readFile('src/app/layout.tsx');
    expect(src).not.toContain('service-worker');
    expect(src).not.toContain('serviceWorker');
  });

  it('next.config.ts tidak mengaktifkan PWA', () => {
    const src = readFile('next.config.ts');
    expect(src).not.toContain('withPWA');
    expect(src).not.toContain('pwa');
  });
});

// ===== F03-15: Route fondasi tidak mati dan kontrak masukan publik tercatat =====
describe('F03-15: Navigasi fondasi dan feedback simulasi', () => {
  const routes = [
    'src/app/auth/page.tsx',
    'src/app/ai-asisten/page.tsx',
    'src/app/software/page.tsx',
    'src/app/belanja/page.tsx',
    'src/app/ruang/[slug]/page.tsx',
    'src/app/api/v1/public-feedback/route.ts',
  ];

  for (const route of routes) {
    it(`exists: ${route}`, () => {
      expect(fileExists(route), `${route} harus ada`).toBe(true);
    });
  }

  it('OpenAPI mendeklarasikan endpoint feedback simulasi', () => {
    const contract = JSON.parse(readFile('docs/openapi.json')) as {
      info: { version: string };
      paths: Record<string, unknown>;
    };
    expect(contract.info.version).toBe('0.5.0');
    expect(contract.paths).toHaveProperty('/public-feedback');
  });

  it('CSS mempertahankan aturan zoom teks browser dan mencegah overflow global', () => {
    const css = readFile('src/styles/globals.css');
    expect(css).toContain('-webkit-text-size-adjust: 100%');
    expect(css).toContain('overflow-x: clip');
  });
});
