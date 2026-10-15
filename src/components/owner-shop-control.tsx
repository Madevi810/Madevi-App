'use client';

import Link from 'next/link';
import { readCookie } from '@/lib/cookies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';

interface ShopProduct {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  original_price: number | string;
  currency: string;
  category: string;
  subcategory: string;
  stock_status: StockStatus;
  external_url: string;
  created_at?: string;
}

interface OwnerShopQuestion {
  id: string;
  productId: string;
  productTitle: string;
  authorLabel: string;
  questionText: string;
  answerText: string;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
  answeredAt: string | null;
}

interface ProductForm {
  title: string;
  category: string;
  subcategory: string;
  brand: string;
  originalPrice: string;
  stockStatus: StockStatus;
  sourceDescription: string;
  ownerDescription: string;
  externalUrl: string;
}

const EMPTY_FORM: ProductForm = {
  title: '',
  category: '',
  subcategory: '',
  brand: '',
  originalPrice: '',
  stockStatus: 'UNKNOWN',
  sourceDescription: '',
  ownerDescription: '',
  externalUrl: '',
};

const CATEGORY_SUGGESTIONS = [
  'Elektronik & Perbaikan',
  'Rumah & Dapur',
  'Kreator & Kerja',
  'Buku & Belajar',
  'Kesehatan & Perawatan',
  'Otomotif & Perkakas',
];

function ownerCsrfToken() {
  return (
    readCookie('madevi_owner_csrf') ||
    readCookie('madevi_admin_csrf') ||
    readCookie('madevi_csrf')
  );
}

function formatPrice(value: number | string, currency = 'IDR') {
  if (typeof value === 'string' && !value.trim()) return 'Masukkan nominal harga';
  const price = Number(value);
  if (!Number.isFinite(price)) return 'Masukkan nominal harga';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function responseMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    payload.error &&
    typeof payload.error === 'object' &&
    'message' in payload.error &&
    typeof payload.error.message === 'string'
  ) {
    return payload.error.message;
  }
  return fallback;
}

function stockLabel(value: StockStatus) {
  if (value === 'IN_STOCK') return 'Tersedia';
  if (value === 'OUT_OF_STOCK') return 'Habis';
  return 'Perlu dicek';
}

export function OwnerShopControl() {
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const pricePreview = useMemo(() => formatPrice(form.originalPrice), [form.originalPrice]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/ebelanja/products?limit=50&sortBy=NEWEST', {
        cache: 'no-store',
      });
      const payload = (await response.json().catch(() => null)) as { data?: ShopProduct[] } | null;
      if (!response.ok) throw new Error(responseMessage(payload, 'Katalog tidak dapat dimuat.'));
      setProducts(Array.isArray(payload?.data) ? payload.data : []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Katalog tidak dapat dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function updateField<Key extends keyof ProductForm>(key: Key, value: ProductForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function choosePhotos(files: FileList | null) {
    const selected = files ? Array.from(files) : [];
    setError('');
    if (selected.length > 8) {
      setPhotos([]);
      setPreviewUrls([]);
      setPhotoInputKey((current) => current + 1);
      setError('Maksimal delapan foto dapat diterbitkan untuk satu produk.');
      return;
    }
    setPhotos(selected);
    setPreviewUrls(selected.map((file) => URL.createObjectURL(file)));
  }

  function createDescriptionDraft() {
    const title = form.title.trim();
    const category = form.category.trim();
    const price = Number(form.originalPrice);
    if (!title || !category || !form.originalPrice.trim() || !Number.isFinite(price) || price < 0) {
      setError('Isi nama, kategori, dan nominal harga sebelum membuat draf deskripsi.');
      return;
    }
    const classification = form.subcategory.trim()
      ? `${category} / ${form.subcategory.trim()}`
      : category;
    updateField(
      'sourceDescription',
      `${title} berada pada kategori ${classification}. Harga referensi saat ini ${formatPrice(price)}. Periksa varian, spesifikasi, ketersediaan, dan ketentuan mitra pada tautan pembelian sebelum memutuskan membeli.`,
    );
    setError('');
    setMessage('Draf deskripsi dibuat dari data yang Anda isi. Tinjau dan lengkapi sebelum menerbitkan.');
  }

  async function publishProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!photos.length) {
      setError('Minimal satu foto lokal produk wajib dipilih sebelum produk diterbitkan.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const csrf = ownerCsrfToken();
      if (!csrf) throw new Error('Sesi Owner atau token keamanan tidak tersedia. Masuk kembali lalu ulangi.');

      const publishForm = new FormData();
      photos.forEach((photo) => publishForm.append('files', photo));
      Object.entries(form).forEach(([key, value]) => publishForm.set(key, value));
      const productResponse = await fetch('/api/v1/owner/shop/products', {
        method: 'POST',
        headers: { 'x-csrf-token': csrf },
        body: publishForm,
      });
      const productPayload = (await productResponse.json().catch(() => null)) as { data?: ShopProduct } | null;
      if (!productResponse.ok || !productPayload?.data) {
        throw new Error(responseMessage(productPayload, 'Produk tidak dapat diterbitkan.'));
      }

      const publishedProduct = productPayload.data;
      setProducts((current) => [publishedProduct, ...current.filter((item) => item.id !== publishedProduct.id)]);
      setForm(EMPTY_FORM);
      setPhotos([]);
      setPreviewUrls([]);
      setPhotoInputKey((current) => current + 1);
      setMessage('Produk telah diterbitkan dan langsung tersedia pada katalog Madevi Shop.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Produk tidak dapat diterbitkan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell owner-shop-control" id="main-content">
      <header className="owner-shop-control__header">
        <div>
          <p className="eyebrow">MADEVI SHOP · OWNER</p>
          <h1>Kontrol katalog Shop</h1>
          <p>Terbitkan produk lokal dengan kategori, harga, deskripsi, foto, dan tautan afiliasi yang dapat ditinjau.</p>
        </div>
        <Link href="/belanja" className="button button--secondary">Buka katalog Shop</Link>
      </header>

      <div className="owner-shop-control__layout">
        <section className="owner-shop-control__card" aria-labelledby="owner-shop-publish-title">
          <div className="owner-shop-control__card-heading">
            <div>
              <p className="eyebrow">PENERBITAN LANGSUNG</p>
              <h2 id="owner-shop-publish-title">Produk baru</h2>
            </div>
            <span className="owner-shop-control__state">Akan terbit</span>
          </div>

          <form className="owner-shop-control__form" onSubmit={(event) => void publishProduct(event)}>
            <fieldset>
              <legend>Identitas produk</legend>
              <label className="owner-shop-control__field owner-shop-control__field--wide">
                <span>Nama produk</span>
                <input
                  required
                  minLength={2}
                  maxLength={200}
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Contoh: Multimeter Digital True RMS"
                />
              </label>
              <label className="owner-shop-control__field">
                <span>Kategori</span>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  list="owner-shop-categories"
                  value={form.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  placeholder="Pilih atau tulis kategori"
                />
              </label>
              <label className="owner-shop-control__field">
                <span>Subkategori <small>opsional</small></span>
                <input
                  maxLength={120}
                  value={form.subcategory}
                  onChange={(event) => updateField('subcategory', event.target.value)}
                  placeholder="Contoh: Alat ukur"
                />
              </label>
              <label className="owner-shop-control__field">
                <span>Merek <small>opsional</small></span>
                <input
                  maxLength={120}
                  value={form.brand}
                  onChange={(event) => updateField('brand', event.target.value)}
                  placeholder="Merek atau pilihan Madevi"
                />
              </label>
              <label className="owner-shop-control__field">
                <span>Status stok</span>
                <select value={form.stockStatus} onChange={(event) => updateField('stockStatus', event.target.value as StockStatus)}>
                  <option value="UNKNOWN">Perlu dicek</option>
                  <option value="IN_STOCK">Tersedia</option>
                  <option value="OUT_OF_STOCK">Habis</option>
                </select>
              </label>
            </fieldset>

            <fieldset>
              <legend>Harga & tautan</legend>
              <label className="owner-shop-control__field">
                <span>Harga referensi (IDR)</span>
                <input
                  required
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="999999999"
                  step="1"
                  value={form.originalPrice}
                  onChange={(event) => updateField('originalPrice', event.target.value)}
                  placeholder="289000"
                />
              </label>
              <output className="owner-shop-control__price-preview" aria-live="polite">
                <span>Format otomatis</span>
                <strong>{pricePreview}</strong>
              </output>
              <label className="owner-shop-control__field owner-shop-control__field--wide">
                <span>Tautan afiliasi HTTPS</span>
                <input
                  required
                  type="url"
                  inputMode="url"
                  maxLength={2000}
                  value={form.externalUrl}
                  onChange={(event) => updateField('externalUrl', event.target.value)}
                  placeholder="https://mitra.example/produk"
                />
                <small>Disimpan sebagai tujuan beli langsung; Madevi tidak mengambil data dari tautan ini.</small>
              </label>
            </fieldset>

            <fieldset className="owner-shop-control__description-set">
              <legend>Deskripsi yang dapat ditinjau</legend>
              <div className="owner-shop-control__draft-row">
                <p>Draf hanya memakai nama, kategori, dan harga yang Anda isi—bukan spesifikasi yang dibuat-buat.</p>
                <button type="button" className="button button--small button--secondary" onClick={createDescriptionDraft}>
                  Buat draf deskripsi
                </button>
              </div>
              <label className="owner-shop-control__field owner-shop-control__field--wide">
                <span>Deskripsi katalog</span>
                <textarea
                  required
                  minLength={20}
                  maxLength={4000}
                  rows={5}
                  value={form.sourceDescription}
                  onChange={(event) => updateField('sourceDescription', event.target.value)}
                  placeholder="Jelaskan kegunaan produk dan informasi yang sudah diverifikasi."
                />
              </label>
              <label className="owner-shop-control__field owner-shop-control__field--wide">
                <span>Catatan Owner <small>opsional</small></span>
                <textarea
                  maxLength={2000}
                  rows={3}
                  value={form.ownerDescription}
                  onChange={(event) => updateField('ownerDescription', event.target.value)}
                  placeholder="Contoh: harga dan ketersediaan mengikuti halaman mitra."
                />
              </label>
            </fieldset>

            <fieldset className="owner-shop-control__photo-set">
              <legend>Foto produk lokal</legend>
              <div className="owner-shop-control__photo-layout">
                <label className="owner-shop-control__upload">
                  <span>JPG, PNG, atau WebP · 1–8 foto · tiap file maksimal 5 MB</span>
                  <input
                    key={photoInputKey}
                    required
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => choosePhotos(event.target.files)}
                  />
                  <small>Urutan pilihan menjadi urutan galeri. File diperiksa kembali oleh server sebelum disimpan di runtime lokal.</small>
                </label>
                <div className="owner-shop-control__previews" aria-label="Pratinjau foto produk">
                  {previewUrls.length ? previewUrls.map((url, index) => <img src={url} alt={`Pratinjau foto produk ${index + 1}`} key={url} />) : <span>Pratinjau foto</span>}
                </div>
              </div>
            </fieldset>

            <div className="owner-shop-control__actions">
              <button className="button button--primary" type="submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Menyimpan produk…' : 'Terbitkan ke katalog'}
              </button>
              <p>Harga diformat otomatis. Foto dan detail yang diterbitkan muncul langsung di Shop setelah penyimpanan berhasil.</p>
            </div>
          </form>
          <datalist id="owner-shop-categories">
            {CATEGORY_SUGGESTIONS.map((category) => <option key={category} value={category} />)}
          </datalist>
        </section>

        <aside className="owner-shop-control__catalog" aria-labelledby="owner-shop-catalog-title">
          <div className="owner-shop-control__card-heading">
            <div>
              <p className="eyebrow">TERBIT DI SHOP</p>
              <h2 id="owner-shop-catalog-title">Katalog aktif</h2>
            </div>
            <span className="owner-shop-control__count">{products.length}</span>
          </div>
          <p className="owner-shop-control__catalog-note">Hanya produk berstatus terbit ditampilkan di sini dan pada Madevi Shop.</p>
          {loading ? <p className="owner-shop-control__status">Memuat katalog…</p> : null}
          {!loading && !error && !products.length ? <p className="owner-shop-control__status">Belum ada produk terbit.</p> : null}
          {error ? <p className="owner-shop-control__notice owner-shop-control__notice--error" role="alert">{error}</p> : null}
          {message ? <p className="owner-shop-control__notice" aria-live="polite">{message}</p> : null}
          <ul className="owner-shop-control__product-list">
            {products.map((product) => (
              <li key={product.id}>
                <Link href={`/belanja/${product.id}`} className="owner-shop-control__product">
                  <img src={product.image_url} alt="" />
                  <span>
                    <small>{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</small>
                    <strong>{product.title}</strong>
                    <em>{formatPrice(product.original_price, product.currency || 'IDR')}</em>
                    <i>{stockLabel(product.stock_status)}</i>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <OwnerShopQuestions />
    </main>
  );
}

function OwnerShopQuestions() {
  const [questions, setQuestions] = useState<OwnerShopQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/owner/shop/questions', { cache: 'no-store' });
      const payload = (await response.json().catch(() => null)) as { data?: OwnerShopQuestion[] } | null;
      if (!response.ok) throw new Error(responseMessage(payload, 'Antrean tanya jawab tidak dapat dimuat.'));
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      setQuestions(rows);
      setAnswers((current) => Object.fromEntries(rows.map((question) => [question.id, current[question.id] ?? question.answerText ?? ''])));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Antrean tanya jawab tidak dapat dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  async function answerQuestion(questionId: string) {
    const answer = (answers[questionId] ?? '').trim();
    if (answer.length < 2) {
      setError('Jawaban Admin minimal dua karakter.');
      return;
    }
    setPendingId(questionId);
    setError('');
    setMessage('');
    try {
      const csrf = ownerCsrfToken();
      if (!csrf) throw new Error('Sesi Owner atau token keamanan tidak tersedia. Masuk kembali lalu ulangi.');
      const response = await fetch(`/api/v1/owner/shop/questions/${questionId}/answer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf-token': csrf },
        body: JSON.stringify({ answer }),
      });
      const payload = (await response.json().catch(() => null)) as { data?: OwnerShopQuestion } | null;
      if (!response.ok || !payload?.data) throw new Error(responseMessage(payload, 'Jawaban tidak dapat diterbitkan.'));
      const answeredQuestion = payload.data;
      setQuestions((current) => current.map((question) => question.id === questionId ? { ...question, ...answeredQuestion } : question));
      setMessage('Jawaban diterbitkan dan kini dapat dibaca pada halaman produk.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Jawaban tidak dapat diterbitkan.');
    } finally {
      setPendingId('');
    }
  }

  return (
    <section className="owner-shop-questions" aria-labelledby="owner-shop-questions-title">
      <header className="owner-shop-control__card-heading">
        <div>
          <p className="eyebrow">TANYA & JAWAB PRODUK</p>
          <h2 id="owner-shop-questions-title">Antrean jawaban Owner</h2>
          <p>Pertanyaan tidak tampil publik sebelum Anda menjawabnya. Pertanyaan dengan teks yang sama otomatis ditahan agar tidak berulang.</p>
        </div>
        <span className="owner-shop-control__count">{questions.filter((question) => question.status === 'PENDING').length}</span>
      </header>
      {loading ? <p className="owner-shop-control__status" role="status">Memuat antrean pertanyaan…</p> : null}
      {error ? <p className="owner-shop-control__notice owner-shop-control__notice--error" role="alert">{error}</p> : null}
      {message ? <p className="owner-shop-control__notice" aria-live="polite">{message}</p> : null}
      {!loading && !error && !questions.length ? <p className="owner-shop-control__status">Belum ada pertanyaan produk yang menunggu atau telah dijawab.</p> : null}
      <ol className="owner-shop-questions__list">
        {questions.map((question) => (
          <li key={question.id} className={`owner-shop-questions__item owner-shop-questions__item--${question.status.toLowerCase()}`}>
            <div className="owner-shop-questions__question">
              <span>{question.status === 'PENDING' ? 'Menunggu jawaban' : 'Sudah terbit'}</span>
              <small>{question.productTitle}</small>
              <h3>{question.questionText}</h3>
            </div>
            <label>
              <span>Jawaban Admin</span>
              <textarea rows={3} maxLength={4000} value={answers[question.id] ?? ''} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Jawab dengan informasi yang sudah diverifikasi." />
            </label>
            <button type="button" className="button button--small button--primary" disabled={pendingId === question.id} onClick={() => void answerQuestion(question.id)}>
              {pendingId === question.id ? 'Menerbitkan…' : question.status === 'PENDING' ? 'Terbitkan jawaban' : 'Perbarui jawaban'}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
