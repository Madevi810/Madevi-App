'use client';

import Link from 'next/link';

import { useLanguage } from './theme-provider';

/**
 * Peta Konsep (P09): relasi konsep yang kuat, bukan kedalaman menu.
 *
 * Sengaja menggabungkan TIGA sumber relasi yang sudah ada:
 *  - breadcrumb taxonomy (posisi konsep di pohon)
 *  - artikel terkait (relasi horizontal)
 *  - seri/posisi (relasi sekuensial)
 *
 * Tujuan P09: "Satu fakta penting harus dapat ditelusuri ke sumber" dan
 * "jangan mengandalkan kedalaman menu sebagai satu-satunya discovery".
 * Peta Koncep memberi lompatan kontekstual di akhir artikel.
 *
 * Tidak ada taxonomy hard-code: semua node datang sebagai prop dari data
 * artikel. Komponen siap menerima paket Menu/Artikel terpisah (lulus P09).
 */

export interface ConceptNode {
  id: string;
  name: string;
  /** Path slug untuk link, mis. `/ruang/sains/fisika`. */
  href: string;
  /** Tingkat kedalaman untuk indentasi visual; 0 = root. */
  level: number;
}

export interface ConceptRelation {
  id: string;
  title: string;
  href: string;
  kind: 'RELATED' | 'SERIES' | 'PARENT' | 'CHILD';
}

export function ConceptMap({
  nodes,
  relations,
}: {
  nodes: ConceptNode[];
  relations: ConceptRelation[];
}) {
  const { language } = useLanguage();
  const isId = language === 'id';

  if (nodes.length === 0 && relations.length === 0) return null;

  const related = relations.filter((r) => r.kind === 'RELATED');
  const series = relations.filter((r) => r.kind === 'SERIES');
  const hierarchy = relations.filter((r) => r.kind === 'PARENT' || r.kind === 'CHILD');

  return (
    <nav className="concept-map" aria-label={isId ? 'Peta Konsep' : 'Concept Map'}>
      <h2 className="concept-map__title">{isId ? 'Peta Konsep' : 'Concept Map'}</h2>

      {/* Posisi dalam pohon konsep */}
      {nodes.length > 0 && (
        <ol className="concept-map__tree">
          {nodes.map((node) => (
            <li
              key={node.id}
              className="concept-map__node"
              style={{ marginLeft: `${node.level * 16}px` }}
            >
              <Link href={node.href} className="concept-map__link">
                {node.name}
              </Link>
            </li>
          ))}
        </ol>
      )}

      {/* Relasi horizontal: artikel terkait */}
      {related.length > 0 && (
        <div className="concept-map__group">
          <h3 className="concept-map__group-title">
            {isId ? 'Artikel terkait' : 'Related articles'}
          </h3>
          <ul className="concept-map__list">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="concept-map__link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Relasi sekuensial: seri */}
      {series.length > 0 && (
        <div className="concept-map__group">
          <h3 className="concept-map__group-title">
            {isId ? 'Dalam seri yang sama' : 'In the same series'}
          </h3>
          <ul className="concept-map__list">
            {series.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="concept-map__link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hierarki konsep: naik/turun */}
      {hierarchy.length > 0 && (
        <div className="concept-map__group">
          <h3 className="concept-map__group-title">
            {isId ? 'Konsep terkait' : 'Connected concepts'}
          </h3>
          <ul className="concept-map__list">
            {hierarchy.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="concept-map__link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
