'use client';

/**
 * useCurrentUser — status login pembuat jasa/alat bantu.
 * Memakai endpoint member yang sudah ada (sama pola dengan sidebar).
 * Tidak bergantung next-auth.
 */

import { useEffect, useState } from 'react';

export function useCurrentUser() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/profile', { cache: 'no-store' })
      .then((r) => r.ok)
      .then((ok) => {
        if (active) {
          setLoggedIn(ok);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoggedIn(false);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { loggedIn, loading };
}
