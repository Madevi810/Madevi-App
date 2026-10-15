/* ===================================================
   THEME VALUES — JS mirror dari tokens.css
   Untuk kasus di mana CSS var() tidak bisa dipakai
   (mis. <input type="color">, canvas, SVG attribute).
   Nilai HARUS sinkron dengan src/styles/tokens.css.
   =================================================== */

export const THEME_ACCENT_HEX: Record<'light' | 'dark' | 'madevi-on', string> = {
  'light': '#0d9488',
  'dark': '#5eead4',
  'madevi-on': '#a78bfa',
};

export const THEME_BG_HEX: Record<'light' | 'dark' | 'madevi-on', string> = {
  'light': '#FAFAF8',
  'dark': '#0A0C0B',
  'madevi-on': '#0D0714',
};

export const THEME_TEXT_HEX: Record<'light' | 'dark' | 'madevi-on', string> = {
  'light': '#1A1A18',
  'dark': '#E8E8E6',
  'madevi-on': '#F5F0FA',
};

/** Default accent untuk color picker / fallback — sinkron dengan --accent (light). */
export const DEFAULT_ACCENT_HEX = THEME_ACCENT_HEX['light'];

/* ===================================================
   CV DOCUMENT PALETTE
   Palet desain untuk dokumen CV yang diekspor (standalone HTML).
   Ini adalah design token dokumen, bukan UI aplikasi —
   didefinisikan sekali di sini agar tidak tersebar di template.
   =================================================== */
export const CV_DOCUMENT_COLORS = {
  ink: '#172033',
  paper: '#ffffff',
  accent: '#176b5b',
  muted: '#526273',
  body: '#344256',
  editorialAccent: '#a05031',
} as const;

/* ===================================================
   INVITATION TEMPLATE PALETTE
   Warna default desain template undangan (bukan UI aplikasi).
   Dipakai hanya sebagai fallback bila template tidak
   mendefinisikan warnanya sendiri.
   =================================================== */
export const INVITATION_TEMPLATE_COLORS = {
  modern: { primary: '#2C3E50', accent: '#E74C3C' },
  classic: { primary: '#8B7355', accent: '#D4AF37' },
} as const;

/* ===================================================
   INTRO ANIMATION PALETTE
   Palet untuk animasi intro Madevi (framer-motion, JS-driven).
   Nilai sinkron dengan tokens.css per tema.
   =================================================== */
export interface IntroPalette {
  bg: string;
  text: string;
  accent: string;
  accentGlow: string;
  boltBlue: string;
  boltYellow: string;
}

export const INTRO_PALETTE: Record<'light' | 'dark' | 'madevi-on', IntroPalette> = {
  'light': {
    bg: '#FAFAF8',
    text: '#1A1A18',
    accent: '#0d9488',
    accentGlow: 'rgba(13, 148, 136, 0.4)',
    boltBlue: '#0ea5e9',
    boltYellow: '#f59e0b',
  },
  'dark': {
    bg: '#0A0C0B',
    text: '#E8E8E6',
    accent: '#5eead4',
    accentGlow: 'rgba(94, 234, 212, 0.4)',
    boltBlue: '#38bdf8',
    boltYellow: '#fbbf24',
  },
  'madevi-on': {
    bg: '#0D0714',
    text: '#F5F0FA',
    accent: '#a78bfa',
    accentGlow: 'rgba(167, 139, 250, 0.6)',
    boltBlue: '#67c5ff',
    boltYellow: '#f0ad63',
  },
};
