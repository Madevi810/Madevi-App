import { ArticlePageClient } from '@/components/article-page-client';
import { PublicShell } from '@/components/public-shell';
import { StarterArticlePage } from '@/components/starter-article-page';
import { starterArticleById } from '@/content/starter-articles';

export const dynamic = 'force-dynamic';

export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const starter = starterArticleById(id);

  return (
    <PublicShell>
      {starter ? <StarterArticlePage article={starter} /> : <ArticlePageClient id={id} />}
    </PublicShell>
  );
}
