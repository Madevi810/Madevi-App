import type { MetadataRoute } from 'next';

/**
 * Manifest PWA Madevi — memungkinkan "Install" ke home screen HP.
 * Berjalan 100% lokal via Termux; tidak ada dependensi online.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Madevi — Platform Edukasi & Jasa Digital',
    short_name: 'Madevi',
    description:
      'Platform edukasi Indonesia: 7 ruang belajar, tutorial, sekolah digital, komunitas, shop, tools, dan jasa.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0f1a',
    theme_color: '#0d9488',
    lang: 'id',
    dir: 'ltr',
    categories: ['education', 'productivity', 'social'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
