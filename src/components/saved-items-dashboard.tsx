'use client';

import { useState } from 'react';
import { useLanguage } from './theme-provider';

export function SavedItemsDashboard() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [activeTab, setActiveTab] = useState<'artikel' | 'belanja'>('artikel');

  return (
    <section className="account-panel saved-items-panel">
      <h1>{isId ? 'Daftar Simpan' : 'Saved Items'}</h1>
      <p className="account-panel__intro">
        {isId
          ? 'Koleksi artikel dan keranjang belanja yang Anda simpan.'
          : 'Collection of saved articles and shopping carts.'}
      </p>

      <div className="profile-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'artikel'}
          onClick={() => setActiveTab('artikel')}
        >
          {isId ? 'Artikel' : 'Articles'}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'belanja'}
          onClick={() => setActiveTab('belanja')}
        >
          {isId ? 'Belanja' : 'Shop'}
        </button>
      </div>

      <div className="account-empty-state">
        {activeTab === 'artikel' ? (
          <p>{isId ? 'Belum ada artikel yang disimpan.' : 'No saved articles yet.'}</p>
        ) : (
          <p>{isId ? 'Belanja/keranjang Anda masih kosong.' : 'Your shop/cart is still empty.'}</p>
        )}
      </div>
    </section>
  );
}
