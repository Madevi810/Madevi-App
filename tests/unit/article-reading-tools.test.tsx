// @vitest-environment happy-dom

import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ArticleReadingTools } from '@/components/article-reading-tools';
import { StarterArticlePage } from '@/components/starter-article-page';
import { starterArticleById } from '@/content/starter-articles';

afterEach(() => cleanup());

describe('ArticleReadingTools', () => {
  it('adjusts article text within bounds and resets to default', () => {
    render(<ArticleReadingTools />);
    const article = screen.getByTestId('article-reading-content');
    const increase = screen.getByRole('button', { name: 'Perbesar teks' });
    const decrease = screen.getByRole('button', { name: 'Perkecil teks' });

    expect(article.getAttribute('data-text-scale')).toBe('1');
    fireEvent.click(increase);
    expect(article.getAttribute('data-text-scale')).toBe('1.1');
    fireEvent.click(decrease);
    expect(article.getAttribute('data-text-scale')).toBe('1');

    for (let index = 0; index < 6; index += 1) fireEvent.click(decrease);
    expect(article.getAttribute('data-text-scale')).toBe('0.8');
    expect((decrease as HTMLButtonElement).disabled).toBe(true);

    for (let index = 0; index < 6; index += 1) fireEvent.click(increase);
    expect(article.getAttribute('data-text-scale')).toBe('1.4');
    expect((increase as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang ukuran teks' }));
    expect(article.getAttribute('data-text-scale')).toBe('1');
  });

  it('keeps starter examples labeled as drafts and places reading controls around the body only', () => {
    const article = starterArticleById('explore-mengamati-langit');
    expect(article).not.toBeNull();
    render(<StarterArticlePage article={article!} />);

    expect(screen.getByText(/CONTOH · DRAFT/)).not.toBeNull();
    const reader = screen.getByRole('region', { name: 'Alat baca artikel' });
    expect(within(reader).getByText('Langkah')).not.toBeNull();
    expect(within(reader).getByText(/Catatan keselamatan/)).not.toBeNull();
    expect(within(reader).getByText(/Sumber:/)).not.toBeNull();
    expect(within(reader).getByText(/contoh development/)).not.toBeNull();
  });

  it('applies the selected scale to all supported body block selectors', () => {
    const css = readFileSync('src/components/article-reading-tools.module.css', 'utf8');
    const ast = postcss.parse(css);
    const scaledRules = ast.nodes
      .filter(
        (node) =>
          node.type === 'rule' &&
          node.nodes?.some((child) => child.type === 'decl' && child.prop === 'font-size'),
      )
      .map((node) => (node.type === 'rule' ? node.selector : ''))
      .join(' ');
    for (const selector of [
      '.article-blocks',
      '.article-section',
      'p',
      'li',
      'blockquote',
      'figcaption',
      'th',
      'td',
      'code',
      'pre',
      '.article-step-card',
      '.article-callout',
      '.article-figure-placeholder__text',
      '.article-video__title',
      '.article-video__desc',
      '.article-safety',
      '.article-source',
      '.article-guardrail',
      '.article-sources__popup',
    ]) {
      expect(scaledRules).toContain(selector);
    }
    expect(scaledRules).not.toContain('h1');
    expect(scaledRules).not.toContain('h2');
    expect(css).toContain('font-size: calc(1rem * var(--article-text-scale, 1))');
  });

  it('toggles focus mode with an announced pressed state', () => {
    render(<ArticleReadingTools />);
    const content = screen.getByTestId('article-reading-content');
    const toggle = screen.getByRole('button', { name: 'Mode fokus' });

    const initialClass = content.className;
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(content.className).not.toBe(initialClass);
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(content.className).toBe(initialClass);
  });
});
