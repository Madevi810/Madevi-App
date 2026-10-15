'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  path: string;
  childCount?: number;
}

export function CategoryBrowser() {
  const [items, setItems] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/taxonomy?limit=50')
      .then((res) => res.json())
      .then((json) => setItems(json.data?.children ?? json.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat kategori...</p>;

  return (
    <div className="taxonomy-grid">
      {items.map((item) => (
        <Link key={item.id} href={`/ruang/${item.path}`} className="taxonomy-card">
          <h2 className="taxonomy-card__name">{item.name}</h2>
          {typeof item.childCount === 'number' && <p>{item.childCount} subruang</p>}
        </Link>
      ))}
      {!items.length && <p className="taxonomy-empty">Kategori sedang disiapkan.</p>}
    </div>
  );
}

export function Component() {
  return <CategoryBrowser />;
}
