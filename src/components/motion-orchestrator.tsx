'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** A route owns one entrance. Content remains readable without JavaScript. */
export function MotionOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/artikel')) return;

    const preference = window.matchMedia(REDUCED_MOTION);
    const motionTokens = getComputedStyle(document.documentElement);
    const basicDuration = Number.parseFloat(motionTokens.getPropertyValue('--basic-motion-enter')) || 300;
    const basicDistance = Number.parseFloat(motionTokens.getPropertyValue('--basic-motion-distance')) || 6;
    const onDuration = Number.parseFloat(motionTokens.getPropertyValue('--on-motion-enter')) || 620;
    const onStagger = Number.parseFloat(motionTokens.getPropertyValue('--on-motion-stagger')) || 75;
    const seen = new WeakSet<HTMLElement>();
    const running = new Set<{ cancel: () => void }>();
    const splitters = new Map<HTMLElement, { revert: () => unknown }>();
    let observer: IntersectionObserver | null = null;
    let generation = 0;
    let disposed = false;
    const scopes = Array.from(document.querySelectorAll<HTMLElement>('.public-shell [data-motion-scope]'));

    const reset = () => {
      generation += 1;
      observer?.disconnect();
      observer = null;
      running.forEach((animation) => animation.cancel());
      running.clear();
      splitters.forEach((splitter) => splitter.revert());
      splitters.clear();
      scopes.forEach((scope) => delete scope.dataset.motionRuntime);
    };

    const start = async () => {
      reset();
      if (disposed || preference.matches || !scopes.length) return;
      const currentGeneration = generation;
      const isOn = document.documentElement.dataset.theme === 'madevi-on';

      if (isOn) {
        const { animate, splitText, stagger } = await import('animejs');
        if (disposed || preference.matches || currentGeneration !== generation) return;

        const targets = scopes.flatMap((scope) =>
          Array.from(scope.querySelectorAll<HTMLElement>(
            '[data-motion-intro], .home-content-wrapper > section:first-child h1, .page-shell > header h1',
          )),
        )
          .filter((target) => target.childElementCount === 0 && (target.textContent?.trim().length ?? 0) > 0)
          .slice(0, 2);

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            observer?.unobserve(target);
            if (seen.has(target) || preference.matches) return;
            seen.add(target);

            const splitter = splitText(target, { words: true, accessible: true });
            if (!splitter.words.length) {
              splitter.revert();
              return;
            }
            splitters.set(target, splitter);
            const animation = animate(splitter.words, {
              opacity: [0, 1],
              filter: ['blur(12px)', 'blur(0px)'],
              duration: onDuration,
              delay: stagger(onStagger),
              ease: 'out(2)',
              onComplete: () => {
                running.delete(animation);
                if (splitters.get(target) === splitter) {
                  splitter.revert();
                  splitters.delete(target);
                }
              },
            });
            running.add(animation);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        targets.forEach((target) => observer?.observe(target));
      } else {
        const targets = scopes.flatMap((scope) =>
          Array.from(scope.querySelectorAll<HTMLElement>(
            [
              '.home-content-wrapper > section',
              '.page-shell > header',
              '.page-shell > section',
              '.jasa-page__content > header',
              '.jasa-page__content > section',
              '.info-page__inner > section',
              '.profile-main > section',
              'section[data-motion-scroll]',
              'section[data-motion-enter]',
            ].join(', '),
          )).filter((target) => target.closest('[data-motion-scope]') === scope),
        ).slice(0, 3);

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            observer?.unobserve(target);
            if (seen.has(target) || preference.matches) return;
            seen.add(target);
            const animation = target.animate(
              [
                { opacity: 0.76, transform: `translateY(${basicDistance}px)` },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: basicDuration,
                delay: Math.min(targets.indexOf(target), 4) * 45,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              },
            );
            running.add(animation);
            animation.onfinish = () => running.delete(animation);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        targets.forEach((target) => observer?.observe(target));
      }

      scopes.forEach((scope) => { scope.dataset.motionRuntime = 'ready'; });
    };

    const themeObserver = new MutationObserver(() => { void start(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onPreferenceChange = () => { void start(); };
    preference.addEventListener('change', onPreferenceChange);
    void start();

    return () => {
      disposed = true;
      themeObserver.disconnect();
      preference.removeEventListener('change', onPreferenceChange);
      reset();
    };
  }, [pathname]);

  return null;
}
