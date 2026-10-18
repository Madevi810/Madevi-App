import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';
import '@/styles/redesign.css';
import '@/styles/madevi-on.css';
import '@/styles/interface-refresh.css';
import '@/styles/atlas-redesign.css';
import '@/styles/jasa-redesign.css';
import '@/styles/room-tps-school.css';
import '@/styles/home-explore-redesign.css';
import '@/styles/social-redesign.css';
import '@/styles/shop-redesign.css';
import '@/styles/madevi-overhaul.css';
import '@/styles/desain-terkunci.css';
import '@/styles/ui-components.css';

import { RootLayoutClient } from '@/components/root-layout-client';
import { THEME_SCRIPT } from '@/components/theme-provider';

export const viewport: Viewport = {
  themeColor: '#0d9488',
};

export const metadata: Metadata = {
  title: {
    default: 'Madevi',
    template: '%s — Madevi',
  },
  description:
    'Ruang mandiri untuk belajar, menjelajah pengetahuan, memakai alat, berkarya, berbelanja, dan terhubung.',
  icons: {
    icon: '/madevi-emblem.svg',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Madevi',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {/* Skip-link aksesibilitas */}
        <a href="#main-content" className="skip-link">
          Langsung ke konten
        </a>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
