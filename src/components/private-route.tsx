'use client';

import { useEffect, useState, ReactNode } from 'react';
import { AuthCard } from './auth-card';
import { useLanguage } from './theme-provider';

export function PrivateRoute({
  children,
  guestContent,
}: {
  children: ReactNode;
  guestContent?: ReactNode;
}) {
  const [status, setStatus] = useState<'loading' | 'member' | 'guest'>('loading');
  const { language } = useLanguage();

  useEffect(() => {
    fetch('/api/v1/profile', { cache: 'no-store' })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response }) => {
        if (response.ok) {
          setStatus('member');
        } else {
          setStatus('guest');
        }
      })
      .catch(() => {
        setStatus('guest');
      });
  }, []);

  if (status === 'loading') {
    return (
      <p className="private-route__status">
        {language === 'id' ? 'Memuat profil...' : 'Loading profile...'}
      </p>
    );
  }

  if (status === 'guest') {
    if (guestContent) {
      return <>{guestContent}</>;
    }
    return (
      <section className="private-route__gate" aria-labelledby="private-route-title">
        <h1 id="private-route-title">
          {language === 'id' ? 'Akses Terbatas' : 'Restricted Access'}
        </h1>
        <p>
          {language === 'id'
            ? 'Silakan masuk atau mendaftar untuk mengakses menu profil privat.'
            : 'Please log in or register to access private profile menus.'}
        </p>
        <AuthCard />
      </section>
    );
  }

  return <>{children}</>;
}
