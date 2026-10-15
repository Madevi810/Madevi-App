'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './article-reading-tools.module.css';

const MIN_SCALE = 0.8;
const MAX_SCALE = 1.4;
const SCALE_STEP = 0.1;
const DEFAULT_SCALE = 1;

export function ArticleReadingTools({
  children,
  isId = true,
  speakText = '',
}: {
  children?: ReactNode;
  isId?: boolean;
  speakText?: string;
}) {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [focusMode, setFocusMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const atMinimum = scale <= MIN_SCALE;
  const atMaximum = scale >= MAX_SCALE;

  // Deteksi TTS hanya di client (hindari mismatch hydration).
  useEffect(() => {
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  function stopSpeak() {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* abaikan */
    }
    setSpeaking(false);
  }

  function toggleSpeak() {
    if (speaking) {
      stopSpeak();
      return;
    }
    if (!speakText || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(speakText);
      utter.lang = isId ? 'id-ID' : 'en-US';
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
      setSpeaking(true);
    } catch {
      setSpeaking(false);
    }
  }

  // Hentikan bacaan saat komponen dilepas.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* abaikan */
      }
    };
  }, []);

  return (
    <section
      className={styles.reader}
      aria-label={isId ? 'Alat baca artikel' : 'Article reading tools'}
    >
      <div
        className={styles.toolbar}
        role="group"
        aria-label={isId ? 'Tampilan bacaan' : 'Reading display'}
      >
        <button
          type="button"
          className="button button--small button--secondary"
          aria-label={isId ? 'Perkecil teks' : 'Decrease text size'}
          onClick={() =>
            setScale((current) => Math.max(MIN_SCALE, Number((current - SCALE_STEP).toFixed(1))))
          }
          disabled={atMinimum}
        >
          A−
        </button>
        <button
          type="button"
          className="button button--small button--secondary"
          aria-label={isId ? 'Perbesar teks' : 'Increase text size'}
          onClick={() =>
            setScale((current) => Math.min(MAX_SCALE, Number((current + SCALE_STEP).toFixed(1))))
          }
          disabled={atMaximum}
        >
          A+
        </button>
        <span className={styles.scale} aria-live="polite">
          {isId ? 'Ukuran' : 'Text'} {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          className="button button--small button--secondary"
          aria-label={isId ? 'Atur ulang ukuran teks' : 'Reset text size'}
          onClick={() => setScale(DEFAULT_SCALE)}
          disabled={scale === DEFAULT_SCALE}
        >
          {isId ? 'Atur ulang' : 'Reset'}
        </button>
        <button
          type="button"
          className="button button--small button--secondary"
          aria-label={isId ? 'Mode fokus' : 'Focus mode'}
          aria-pressed={focusMode}
          onClick={() => setFocusMode((current) => !current)}
        >
          {focusMode ? (isId ? 'Keluar fokus' : 'Exit focus') : isId ? 'Mode fokus' : 'Focus mode'}
        </button>
        {speakText && canSpeak && (
          <button
            type="button"
            className="button button--small button--secondary"
            aria-label={isId ? 'Dengarkan artikel' : 'Listen to article'}
            aria-pressed={speaking}
            onClick={toggleSpeak}
          >
            {speaking ? (isId ? 'Berhenti' : 'Stop') : isId ? 'Dengarkan' : 'Listen'}
          </button>
        )}
      </div>
      <div
        className={`${styles.content}${focusMode ? ` ${styles.focus}` : ''}`}
        data-testid="article-reading-content"
        data-text-scale={scale}
        style={{ '--article-text-scale': scale } as CSSProperties}
      >
        {children}
      </div>
    </section>
  );
}
