import type { NextConfig } from 'next';

/**
 * P17: header keamanan dengan profile localhost/production.
 *
 * Kebutuhan: "Header keamanan dan cookie flags sesuai localhost/production
 * profile TANPA melemahkan local development."
 *
 * - HSTS hanya untuk production (HTTPS). Di localhost HTTP, HSTS akan
 *   merusak dev — itulah mengapa profile dipisah, bukan satu set kasar.
 * - CSP memakai 'unsafe-inline' untuk script & style SAJA karena:
 *     * theme bootstrap adalah inline script statis (THEME_SCRIPT, aman)
 *     * 17 komponen memakai inline style
 *   Bukan kelemahan yang diterima begitu saja — lihat catatan + usulan
 *   nonce di laporan P17 (§Sisa risiko).
 * - Tidak ada font/CDN eksternal; semua aset lokal → CSP ketat di sisi itu.
 */
function securityHeaders(isProduction: boolean) {
  const connectSrc = isProduction ? "'self'" : "'self' localhost:* http://localhost:*";
  return [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      // Kamera/mikrofon/lokasi tidak dipakai Madevi; matikan by default.
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        `connect-src ${connectSrc}`,
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        // Blok mixed content di production (HTTP subresource di halaman HTTPS).
        isProduction ? 'upgrade-insecure-requests' : '',
      ]
        .filter(Boolean)
        .join('; '),
    },
    // HANYA production: HSTS butuh HTTPS. Di localhost ini akan merusak dev.
    ...(isProduction
      ? [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ]
      : []),
  ];
}

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    // D03: /admin adalah surface non-fungsional (hanya layout + redirect ke
    // /admin/operasi yang tidak ada). Source nyata Admin ada di /owner/*
    // (19 halaman + shell + cookie). Alihkan ke /owner agar deep link lama
    // pulih, bukan 404. permanent:false karena ini alias, bukan pindah permanen.
    return [
      { source: '/admin', destination: '/owner', permanent: false },
      { source: '/admin/:path*', destination: '/owner/:path*', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders(isProduction),
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/Aturan/**',
          '**/Menu/**',
          '**/Artikel/**',
        ],
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
