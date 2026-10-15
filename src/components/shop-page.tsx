'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useLanguage } from './theme-provider';
import { ShippingBundleSection } from './shipping-bundle-section';
import { DuelCompare } from './duel-compare';
import { PetisiKatalog } from './petisi-katalog';

interface Product {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  original_price: number;
  currency: string;
  stock_status: string;
  brand: string;
  category: string;
  subcategory: string;
  condition: string;
}

type ShopSort = 'RELEVANT' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC';

type ProductCatalogResponse = {
  data?: Product[];
  total?: number;
  facets?: { categories?: string[] };
  error?: { message?: string };
};

const PAGE_SIZE = 20;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SavedCartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5h2l1.35 8.1a1.8 1.8 0 0 0 1.78 1.5h7.84a1.8 1.8 0 0 0 1.74-1.33L20 8H7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19.25h.01M17 19.25h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7.8h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 13v6a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton" style={{ width: '40%', height: '0.75rem' }} />
        <div className="skeleton" style={{ width: '90%', height: '1.1rem' }} />
        <div className="skeleton" style={{ width: '60%', height: '1.1rem' }} />
        <div className="skeleton" style={{ width: '50%', height: '1.5rem', marginTop: '0.5rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '2.75rem', borderRadius: '9999px', marginTop: 'auto' }} />
      </div>
    </div>
  );
}

function isExampleProduct(title: string): boolean {
  return /\[CONTOH\]/i.test(title);
}

function cleanTitle(title: string): string {
  return title.replace(/\[CONTOH\]\s*/gi, '').trim();
}

const SORT_OPTIONS: ReadonlyArray<{ value: ShopSort; id: string; en: string }> = [
  { value: 'RELEVANT', id: 'Relevan', en: 'Relevant' },
  { value: 'NEWEST', id: 'Terbaru', en: 'Newest' },
  { value: 'PRICE_ASC', id: 'Termurah', en: 'Lowest price' },
  { value: 'PRICE_DESC', id: 'Termahal', en: 'Highest price' },
];

export function ShopPage() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const toolbarRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [cat, setCat] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<ShopSort>('RELEVANT');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [openMenu, setOpenMenu] = useState<'category' | 'sort' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const parameters = new URLSearchParams({
        sortBy: sort,
        limit: String(PAGE_SIZE),
        offset: String(page * PAGE_SIZE),
      });
      if (query) parameters.set('query', query);
      if (cat) parameters.set('category', cat);
      const response = await fetch(`/api/v1/ebelanja/products?${parameters.toString()}`, { cache: 'no-store' });
      const payload = (await response.json().catch(() => null)) as ProductCatalogResponse | null;
      if (!response.ok) throw new Error(payload?.error?.message ?? (isId ? 'Katalog tidak dapat dimuat.' : 'The catalog could not be loaded.'));
      const catalog = payload?.data ?? [];
      setProducts(catalog);
      setTotal(typeof payload?.total === 'number' ? payload.total : catalog.length);
      setCategories(Array.isArray(payload?.facets?.categories) ? payload.facets.categories : []);
    } catch (error) {
      setProducts([]);
      setTotal(0);
      setLoadError(error instanceof Error ? error.message : (isId ? 'Katalog tidak dapat dimuat.' : 'The catalog could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, [cat, isId, page, query, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!openMenu) return;

    const closeFromOutside = (event: PointerEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('pointerdown', closeFromOutside);
    document.addEventListener('keydown', closeFromKeyboard);
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside);
      document.removeEventListener('keydown', closeFromKeyboard);
    };
  }, [openMenu]);

  function resetPage() {
    setPage(0);
  }

  const maxPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
  const activeCategoryLabel = cat || (isId ? 'Semua kategori' : 'All categories');
  const activeSort = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  return (
    <div className="page-shell shop-page">

      <header className="shop-page__header shop-page__header--compact">
        <div>
          <p className="eyebrow">MADEVI SHOP</p>
          <h1>{isId ? 'Belanja dengan lebih jelas' : 'Shop with more clarity'}</h1>
          <p>{isId ? 'Produk pilihan dan tautan afiliasi.' : 'Curated products and affiliate links.'}</p>
        </div>
        <p className="shop-affiliate-note" role="note">
          <InfoIcon />
          <span>
            {isId ? (
              <><strong>Transparan:</strong> tautan beli adalah afiliasi — pembelian dilakukan di marketplace, bukan di Madevi.</>
            ) : (
              <><strong>Transparent:</strong> buy links are affiliate — purchases happen on the marketplace, not on Madevi.</>
            )}
          </span>
        </p>
      </header>

      <section className="shop-catalog" aria-label={isId ? 'Kontrol katalog' : 'Catalog controls'}>
        <form
          className="shop-catalog__filters"
          ref={toolbarRef}
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(queryInput.trim());
            resetPage();
          }}
        >
          <Link
            href="/simpan"
            className="shop-catalog__saved-icon"
            aria-label={isId ? 'Buka produk tersimpan' : 'Open saved products'}
            title={isId ? 'Simpanan' : 'Saved items'}
          >
            <SavedCartIcon />
          </Link>

          <div className="shop-catalog__dropdown shop-catalog__dropdown--category">
            <button
              id="shop-category-trigger"
              type="button"
              className="shop-catalog__dropdown-trigger"
              aria-haspopup="menu"
              aria-expanded={openMenu === 'category'}
              aria-controls="shop-category-menu"
              onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
            >
              <span>{isId ? 'Kategori' : 'Category'}</span>
              <small>{activeCategoryLabel}</small>
              <ChevronDownIcon />
            </button>
            <div id="shop-category-menu" className="shop-catalog__dropdown-menu" role="menu" aria-labelledby="shop-category-trigger" hidden={openMenu !== 'category'}>
              <button type="button" role="menuitemradio" aria-checked={cat === ''} className={cat === '' ? 'is-selected' : ''} onClick={() => { setCat(''); resetPage(); setOpenMenu(null); }}>
                {isId ? 'Semua kategori' : 'All categories'}
              </button>
              {categories.map((category) => (
                <button key={category} type="button" role="menuitemradio" aria-checked={cat === category} className={cat === category ? 'is-selected' : ''} onClick={() => { setCat(category); resetPage(); setOpenMenu(null); }}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-catalog__dropdown shop-catalog__dropdown--sort">
            <button
              id="shop-sort-trigger"
              type="button"
              className="shop-catalog__dropdown-trigger"
              aria-haspopup="menu"
              aria-expanded={openMenu === 'sort'}
              aria-controls="shop-sort-menu"
              onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
            >
              <span>{isId ? 'Urutan' : 'Sort'}</span>
              <small>{isId ? activeSort.id : activeSort.en}</small>
              <ChevronDownIcon />
            </button>
            <div id="shop-sort-menu" className="shop-catalog__dropdown-menu" role="menu" aria-labelledby="shop-sort-trigger" hidden={openMenu !== 'sort'}>
              {SORT_OPTIONS.map((option) => (
                <button key={option.value} type="button" role="menuitemradio" aria-checked={sort === option.value} className={sort === option.value ? 'is-selected' : ''} onClick={() => { setSort(option.value); resetPage(); setOpenMenu(null); }}>
                  {isId ? option.id : option.en}
                </button>
              ))}
            </div>
          </div>

          <label className="shop-catalog__query">
            <span className="sr-only">{isId ? 'Cari barang' : 'Search products'}</span>
            <SearchIcon />
            <input
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder={isId ? 'Cari barang' : 'Search products'}
            />
          </label>
          <button type="submit" className="button shop-catalog__search-action">{isId ? 'Cari' : 'Search'}</button>
        </form>
      </section>

      <section className="shop-results" aria-label={isId ? 'Hasil katalog' : 'Catalog results'}>
        <header className="shop-results__heading">
          <p aria-live="polite">
            {loading
              ? (isId ? 'Memuat katalog…' : 'Loading catalog…')
              : (isId ? `${total} produk ditemukan` : `${total} products found`)}
          </p>
          {(query || cat) && <span>{isId ? 'Saringan aktif' : 'Filters active'}</span>}
        </header>

        {loading ? (
          <div className="shop-grid" role="status" aria-label={isId ? 'Memuat katalog' : 'Loading catalog'}>
            <span className="sr-only">{isId ? 'Memuat produk dari katalog…' : 'Loading products from the catalog…'}</span>
            {Array.from({ length: 8 }).map((_, index) => (
              <ShopCardSkeleton key={index} />
            ))}
          </div>
        ) : loadError ? (
          <section className="shop-page__error" role="alert" aria-labelledby="shop-load-error-title">
            <div>
              <h2 id="shop-load-error-title">{isId ? 'Katalog belum dapat dimuat' : 'The catalog could not be loaded'}</h2>
              <p>{loadError}</p>
            </div>
            <button type="button" className="button button--secondary" onClick={() => void load()}>{isId ? 'Coba lagi' : 'Try again'}</button>
          </section>
        ) : products.length === 0 ? (
          <div className="shop-results__empty">
            <strong>{isId ? 'Tidak ada produk pada pilihan ini.' : 'No product matches this selection.'}</strong>
            <p>{isId ? 'Ubah kata kunci atau kategori; katalog tidak menganggap hasil kosong sebagai produk yang tersedia.' : 'Change the query or category; an empty result is never treated as an available product.'}</p>
          </div>
        ) : (
          <>
            <div className="shop-grid">
              {products.map((product) => {
                const example = isExampleProduct(product.title);
                const title = cleanTitle(product.title);
                const stockClass = product.stock_status === 'OUT_OF_STOCK'
                  ? 'shop-card__stock--out'
                  : product.stock_status === 'LOW_STOCK'
                    ? 'shop-card__stock--low'
                    : '';
                return (
                <article key={product.id} className="shop-card">
                  <Link href={`/belanja/${product.id}`} className="shop-card__image-link" aria-label={isId ? `Buka detail ${title}` : `Open ${title} details`}>
                    <div className="shop-card__img">
                      {product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={product.image_url} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span aria-hidden="true">{product.brand?.[0] || 'P'}</span>
                      )}
                    </div>
                    {example && (
                      <span className="shop-card__badge-contoh" title={isId ? 'Produk contoh untuk prototype' : 'Example product for prototype'}>
                        {isId ? 'Contoh' : 'Example'}
                      </span>
                    )}
                  </Link>
                  <div className="shop-card__body">
                    {product.brand && <p className="shop-card__brand">{product.brand}</p>}
                    <h3 className="shop-card__title"><Link href={`/belanja/${product.id}`}>{title}</Link></h3>
                    <p className="shop-card__price">{formatPrice(product.original_price, product.currency, language)}</p>
                    <p className="shop-card__meta">
                      <span className={`shop-card__stock ${stockClass}`}>
                        {product.stock_status === 'OUT_OF_STOCK'
                          ? (isId ? 'Stok habis' : 'Out of stock')
                          : (isId ? 'Stok tersedia' : 'In stock')}
                      </span>
                      {product.condition && <span>· {product.condition}</span>}
                    </p>
                    <Link href={`/belanja/${product.id}`} className="shop-card__cta">
                      {isId ? 'Beli di marketplace' : 'Buy on marketplace'}
                      <ExternalIcon />
                    </Link>
                    <p className="shop-card__affiliate">
                      <InfoIcon />
                      <span>{isId ? 'Tautan afiliasi' : 'Affiliate link'}</span>
                    </p>
                  </div>
                </article>
                );
              })}
            </div>
            {maxPage > 0 && (
              <nav className="shop-pager" aria-label={isId ? 'Halaman katalog' : 'Catalog pages'}>
                <button type="button" className="button button--small button--secondary" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{isId ? 'Sebelumnya' : 'Previous'}</button>
                <span>{isId ? `Halaman ${page + 1} dari ${maxPage + 1}` : `Page ${page + 1} of ${maxPage + 1}`}</span>
                <button type="button" className="button button--small button--secondary" disabled={page >= maxPage} onClick={() => setPage((current) => Math.min(maxPage, current + 1))}>{isId ? 'Berikutnya' : 'Next'}</button>
              </nav>
            )}
          </>
        )}
      </section>

      {/* Bundel Ongkir Tetangga (INOVASI-0940 IDE 2): patungan ongkir sekota. */}
      <ShippingBundleSection />

      {/* Duel Produk (INOVASI-1045 IDE 2): komparasi head-to-head. */}
      <DuelCompare />

      {/* Petisi Katalog (INOVASI-1245 IDE 2): usulan produk afiliasi. */}
      <PetisiKatalog />
    </div>
  );
}

function formatPrice(value: number, currency: string, language: 'id' | 'en') {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} —`;
  try {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}`;
  }
}
