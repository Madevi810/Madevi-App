'use client';

import Link from 'next/link';

import { useLanguage } from './theme-provider';

const FOOTER_LINKS = [
  { id: 'Tentang & FAQ', en: 'About & FAQ', href: '/tentang' },
  { id: 'Fitur Review', en: 'Feature Review', href: '/review' },
  { id: 'Ketentuan & Layanan', en: 'Terms & Services', href: '/ketentuan' },
  { id: 'Privasi', en: 'Privacy', href: '/privasi' },
];

export function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <nav
          className="site-footer__nav"
          aria-label={language === 'id' ? 'Tautan footer' : 'Footer links'}
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="site-footer__link">
              {link[language]}
            </Link>
          ))}
        </nav>
        <p className="site-footer__brand">Madevi @2027</p>
        <p className="site-footer__copy">
          {language === 'id' ? 'Madevi · Pengetahuan dan tindakan lokal' : 'Madevi · Local knowledge and action'}
        </p>
      </div>
    </footer>
  );
}
