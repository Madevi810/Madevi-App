'use client';

import Link from 'next/link';
import { useLanguage } from './theme-provider';

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" />
      <path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function LineGuestView() {
  const { language } = useLanguage();
  const isId = language === 'id';

  const features = [
    {
      icon: <SparkIcon />,
      title: isId ? 'Sosial Karya' : 'Karya',
      desc: isId
        ? 'Bagikan ide, karya, dan inovasi ke seluruh pengguna Madevi.'
        : 'Share ideas, works, and innovations with all Madevi users.',
    },
    {
      icon: <HeartIcon />,
      title: isId ? 'Sosial Curhat' : 'Curhat',
      desc: isId
        ? 'Ceritakan isi hati dan dapatkan dukungan dari komunitas.'
        : 'Share your feelings and get support from the community.',
    },
    {
      icon: <UsersIcon />,
      title: isId ? 'Grup & Komunitas' : 'Groups',
      desc: isId
        ? 'Bergabung dengan grup sesuai minat, seperti layaknya Facebook.'
        : 'Join interest-based groups, just like Facebook.',
    },
    {
      icon: <ChatIcon />,
      title: isId ? 'Pesan & Berteman' : 'Messages',
      desc: isId
        ? 'Tambah teman, kirim pesan langsung, berbagi file dan foto.'
        : 'Add friends, send direct messages, share files and photos.',
    },
  ];

  return (
    <div className="line-guest page-container">
      <div className="line-guest__hero">
        <span className="line-guest__mark" aria-hidden="true">
          <ChatIcon />
        </span>
        <p className="eyebrow" style={{ margin: 0 }}>MADEVI LINE</p>
        <h1>{isId ? 'Ruang sosialnya pengguna Madevi' : 'The social space for Madevi users'}</h1>
        <p>
          {isId
            ? 'Berkumpul, berbagi karya, curhat, dan berdiskusi dengan komunitas — dalam ruang yang aman dan termoderasi.'
            : 'Gather, share works, open up, and discuss with the community — in a safe, moderated space.'}
        </p>
        <div className="line-guest__cta">
          <Link href="/auth" className="button">
            {isId ? 'Masuk / Daftar gratis' : 'Log in / Sign up free'}
          </Link>
          <Link href="/" className="button button--secondary">
            {isId ? 'Jelajahi dulu' : 'Explore first'}
          </Link>
        </div>
      </div>
      <div className="line-guest__features card-grid">
        {features.map((f) => (
          <article key={f.title} className="line-guest__feature card">
            <span className="line-guest__feature-icon" aria-hidden="true">{f.icon}</span>
            <h2>{f.title}</h2>
            <p>{f.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
