import type { StarterArticle } from '@/content/starter-articles';
import { ArticleReadingTools } from './article-reading-tools';

/**
 * L06: halaman fixture CONTOH — bukan artikel terbit database.
 * Selalu berlabel CONTOH/DRAFT agar tidak disalahartikan sebagai kurikulum,
 * nilai, atau sertifikat resmi. Daftar runtime memakai ArticlePageClient
 * (API + ArticleReadPolicy), bukan jalur ini.
 */
export function StarterArticlePage({ article }: { article: StarterArticle }) {
  return (
    <article className="article-page starter-article-page page-container prose" data-motion-reading>
      <p className="article-meta">
        CONTOH · DRAFT · {article.space} · {article.category}
      </p>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-summary">{article.summary}</p>
      <ArticleReadingTools>
        {article.sections.map((section) => (
          <section key={section.heading} className="article-section">
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        {article.safety && (
          <aside className="article-safety">
            <strong>Catatan keselamatan:</strong> {article.safety}
          </aside>
        )}
        <footer className="article-source">
          <strong>Sumber:</strong> {article.source.title} — {article.source.publisher}.{' '}
          <a href={article.source.url} target="_blank" rel="noopener noreferrer">
            Buka sumber
          </a>
          . Diperiksa 20 September 2026. Teks Madevi orisinal; contoh development, bukan akreditasi
          atau hasil resmi.
        </footer>
      </ArticleReadingTools>
    </article>
  );
}
