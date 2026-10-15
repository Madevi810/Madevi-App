'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { AiButton } from '@/components/ai-button';
import { Breadcrumb } from '@/components/breadcrumb';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { MADEVI_SPACES, resolveSpaceFromPath } from '@/contracts/navigation';

const METEOR_TRACKS = [
  {
    from: 'translate3d(-12rem, -5rem, 0) rotate(-29deg) scaleX(0.35)',
    middle: 'translate3d(12vw, 7rem, 0) rotate(-29deg) scaleX(0.72)',
    to: 'translate3d(35vw, 17rem, 0) rotate(-29deg) scaleX(1)',
  },
  {
    from: 'translate3d(108vw, -4rem, 0) rotate(148deg) scaleX(0.3)',
    middle: 'translate3d(78vw, 6rem, 0) rotate(148deg) scaleX(0.65)',
    to: 'translate3d(48vw, 14rem, 0) rotate(148deg) scaleX(0.9)',
  },
  {
    from: 'translate3d(8vw, -5rem, 0) rotate(-25deg) scaleX(0.25)',
    middle: 'translate3d(22vw, 3rem, 0) rotate(-25deg) scaleX(0.5)',
    to: 'translate3d(42vw, 11rem, 0) rotate(-25deg) scaleX(0.8)',
  },
] as const;

function MadeviSky({ paused, signalActive }: { paused: boolean; signalActive: boolean }) {
  const meteorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionTokens = getComputedStyle(document.documentElement);
    const meteorMin = Number.parseFloat(motionTokens.getPropertyValue('--on-motion-meteor-min')) || 3500;
    const meteorMax = Number.parseFloat(motionTokens.getPropertyValue('--on-motion-meteor-max')) || 7000;
    const timers = new Set<number>();
    const animations = new Set<Animation>();
    let generation = 0;

    const stop = () => {
      generation += 1;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };

    const schedule = (index: number, delay: number, currentGeneration: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (currentGeneration !== generation) return;
        const element = meteorRefs.current[index];
        const track = METEOR_TRACKS[index];
        if (!element || !track || !element.animate) return;

        const animation = element.animate(
          [
            { opacity: 0, transform: track.from },
            { opacity: 0.72, transform: track.middle, offset: 0.42 },
            { opacity: 0, transform: track.to },
          ],
          { duration: 1200 + Math.random() * 600, easing: 'linear' },
        );
        animations.add(animation);
        animation.onfinish = () => {
          animations.delete(animation);
        };
        schedule(index, meteorMin + Math.random() * (meteorMax - meteorMin), currentGeneration);
      }, delay);
      timers.add(timer);
    };

    const restart = () => {
      stop();
      if (paused || !signalActive || document.hidden || motionPreference.matches || document.documentElement.dataset.theme !== 'madevi-on') return;
      const currentGeneration = generation;
      METEOR_TRACKS.forEach((_, index) => {
        // Independent start phases avoid a repeating three-lane sequence.
        schedule(index, Math.random() * meteorMin, currentGeneration);
      });
    };

    const themeObserver = new MutationObserver(restart);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    motionPreference.addEventListener('change', restart);
    document.addEventListener('visibilitychange', restart);
    restart();

    // AMBIENT-001: satu scroll listener throttled (rAF) memperbarui custom property
    // parallax. Pasif, tidak memicu layout, dan berhenti saat reduced-motion/artikel.
    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        scrollTicking = false;
        if (paused || !signalActive || document.hidden || motionPreference.matches) return;
        document.documentElement.style.setProperty('--madevi-sky-parallax', String(window.scrollY));
      });
    };
    let scrollTicking = false;
    if (!paused && signalActive && !motionPreference.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    return () => {
      themeObserver.disconnect();
      motionPreference.removeEventListener('change', restart);
      document.removeEventListener('visibilitychange', restart);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.style.removeProperty('--madevi-sky-parallax');
      stop();
    };
  }, [paused, signalActive]);

  return (
    <div className="madevi-sky" aria-hidden="true">
      <div className="madevi-sky__blobs">
        <span className="madevi-sky__blob madevi-sky__blob--amethyst" />
        <span className="madevi-sky__blob madevi-sky__blob--ember" />
        <span className="madevi-sky__blob madevi-sky__blob--plum" />
      </div>
      <div className="madevi-sky__grid" />
      <svg className="madevi-sky__stars" viewBox="0 0 1440 960" preserveAspectRatio="xMidYMid slice">
        <circle cx="77" cy="91" r="1.4" />
        <circle cx="218" cy="248" r="1" />
        <circle cx="342" cy="74" r="1.6" />
        <circle cx="463" cy="412" r="1" />
        <circle cx="581" cy="180" r="1.3" />
        <circle cx="698" cy="314" r="1" />
        <circle cx="817" cy="86" r="1.5" />
        <circle cx="943" cy="517" r="1.1" />
        <circle cx="1064" cy="203" r="1.3" />
        <circle cx="1178" cy="684" r="1" />
        <circle cx="1277" cy="332" r="1.6" />
        <circle cx="1371" cy="115" r="1" />
        <circle cx="172" cy="741" r="1.2" />
        <circle cx="739" cy="790" r="1" />
        <circle cx="1324" cy="847" r="1.4" />
        <circle cx="38" cy="516" r=".9" />
        <circle cx="126" cy="382" r="1.5" />
        <circle cx="254" cy="642" r=".8" />
        <circle cx="396" cy="214" r="1.1" />
        <circle cx="532" cy="604" r="1.5" />
        <circle cx="649" cy="44" r=".8" />
        <circle cx="756" cy="547" r="1.2" />
        <circle cx="873" cy="378" r=".9" />
        <circle cx="988" cy="93" r="1.5" />
        <circle cx="1109" cy="457" r=".8" />
        <circle cx="1216" cy="244" r="1.1" />
        <circle cx="1413" cy="596" r="1.3" />
        <circle cx="302" cy="906" r="1" />
        <circle cx="892" cy="904" r=".9" />
        <circle cx="1180" cy="816" r="1.2" />
        <circle cx="562" cy="722" r="1" />
        <circle cx="614" cy="454" r="1.3" />
        <circle cx="704" cy="674" r=".9" />
        <circle cx="829" cy="236" r="1.2" />
        <circle cx="856" cy="693" r="1" />
      </svg>
      <svg className="madevi-sky__atlas" viewBox="0 0 1440 960" preserveAspectRatio="xMidYMid slice">
        <path d="M188 626 356 398 574 564 728 308 921 454 1132 238 1268 568" />
        <path d="M356 398 612 210 921 454 1084 712" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--explore" cx="188" cy="626" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--tutorial" cx="356" cy="398" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--school" cx="574" cy="564" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--line" cx="728" cy="308" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--services" cx="921" cy="454" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--shop" cx="1132" cy="238" r="6" />
        <circle className="madevi-sky__atlas-node madevi-sky__atlas-node--tools" cx="1268" cy="568" r="6" />
      </svg>
      <span className="madevi-sky__scan" />
      <span ref={(node) => { meteorRefs.current[0] = node; }} className="madevi-sky__meteor madevi-sky__meteor--one" />
      <span ref={(node) => { meteorRefs.current[1] = node; }} className="madevi-sky__meteor madevi-sky__meteor--two" />
      <span ref={(node) => { meteorRefs.current[2] = node; }} className="madevi-sky__meteor madevi-sky__meteor--three" />
    </div>
  );
}

/**
 * Shell layout publik: header permanen (atas), sidebar (overlay kanan),
 * konten halaman di tengah dengan lebar 90% dan margin min 16px, footer (bawah).
 * Footer global tidak dirender di ruang Shop karena detail produk memiliki
 * footer aksi khusus sendiri di bagian bawah layar.
 *
 * `<main id="main-content">` hanya dideklarasikan di sini (satu-satunya skip-link
 * target). Halaman tidak boleh membuat `id="main-content"` kedua di dalamnya.
 */
export function PublicShell({
  children,
  hideAi = false,
}: {
  children: ReactNode;
  hideAi?: boolean;
}) {
  const pathname = usePathname();
  const spaceKey = resolveSpaceFromPath(pathname ?? '/')?.presentationKey ?? null;
  const isShopRoute = pathname === '/belanja' || pathname?.startsWith('/belanja/');
  const isReadingRoute = pathname?.startsWith('/artikel') ?? false;
  const isSignalRoute = pathname === '/' || MADEVI_SPACES.some((space) => space.href === pathname);
  return (
    <div
      className="public-shell"
      data-space={spaceKey ?? undefined}
      data-reading-mode={isReadingRoute ? 'true' : undefined}
      data-atlas-signal={isSignalRoute ? 'true' : undefined}
    >
      <MadeviSky paused={isReadingRoute} signalActive={isSignalRoute} />
      <Header />
      <Sidebar />
      {/* Breadcrumbs for room orientation */}
      <Breadcrumb />
      {/* Konten halaman — skip-link target tunggal */}
      <main id="main-content" className="public-shell__body" data-motion-scope="public">
        {children}
      </main>
      {!isShopRoute && <Footer />}
      {/* AI hanya bagian shell publik, tidak merender pada konsol Admin. */}
      {!hideAi && <AiButton />}
    </div>
  );
}
