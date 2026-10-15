'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from './theme-provider';
import { SocialFeed } from './social-feed';
import { GroupsPage } from './groups-page';
import { MessagesPage } from './messages-page';
import { FriendsTab, MyPostsTab, NotificationsTab } from './social-tabs';
import { CalmModeProvider } from './use-calm-mode';
import { CalmModeToggle } from './calm-mode-toggle';
import { KindnessMap } from './kindness-map';
import { StoryWeave } from './story-weave';
import { ListenTurn } from './listen-turn';
import { SidangWarga } from './sidang-warga';
import { KlinikIde } from './klinik-ide';
import { SilsilahKarya } from './silsilah-karya';

type SocialTabId =
  | 'Feed'
  | 'Teman'
  | 'Pesan'
  | 'Grup'
  | 'Postingan'
  | 'Notifikasi'
  | 'Kebaikan'
  | 'Dongeng'
  | 'Dengar'
  | 'Sidang'
  | 'Klinik'
  | 'Silsilah';

export function SocialDashboard() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabGroups: Array<{
    label: string;
    description: string;
    tabs: Array<{ id: SocialTabId; label: string }>;
  }> = [
    {
      label: isId ? 'Ruang Saya' : 'My space',
      description: isId ? 'Ikuti percakapan dan aktivitas Anda.' : 'Follow conversations and your activity.',
      tabs: [
        { id: 'Feed', label: 'Feed' },
        { id: 'Postingan', label: isId ? 'Postingan' : 'Posts' },
        { id: 'Notifikasi', label: isId ? 'Notifikasi' : 'Notifications' },
      ],
    },
    {
      label: isId ? 'Teman & Pesan' : 'Friends & messages',
      description: isId ? 'Kelola hubungan dan percakapan langsung.' : 'Manage connections and direct conversations.',
      tabs: [
        { id: 'Teman', label: isId ? 'Teman' : 'Friends' },
        { id: 'Pesan', label: isId ? 'Pesan' : 'Messages' },
      ],
    },
    {
      label: isId ? 'Komunitas' : 'Community',
      description: isId ? 'Temukan atau ajukan grup publik.' : 'Find or propose a public group.',
      tabs: [{ id: 'Grup', label: isId ? 'Grup' : 'Groups' }],
    },
    {
      label: isId ? 'Kolaborasi' : 'Collaboration',
      description: isId
        ? 'Cerita bersambung dan kebaikan sekota.'
        : 'Round-robin stories and city kindness.',
      tabs: [
        { id: 'Dongeng', label: isId ? 'Dongeng Bareng' : 'Story Weave' },
        { id: 'Kebaikan', label: isId ? 'Peta Kebaikan' : 'Kindness Map' },
        { id: 'Dengar', label: isId ? 'Giliran Dengar' : 'Listen Turn' },
        { id: 'Sidang', label: isId ? 'Sidang Warga' : 'Town Assembly' },
        { id: 'Klinik', label: isId ? 'Klinik Ide' : 'Idea Clinic' },
        { id: 'Silsilah', label: isId ? 'Silsilah Karya' : 'Work Lineage' },
      ],
    },
  ];
  const availableTabs = tabGroups.flatMap((group) => group.tabs);
  const requestedTab = searchParams?.get('tab') as SocialTabId | null;
  const activeTab: SocialTabId =
    requestedTab !== null && availableTabs.some((tab) => tab.id === requestedTab)
      ? requestedTab
      : 'Feed';

  function handleTabChange(tabId: SocialTabId) {
    if (tabId === activeTab) return;
    router.push(`/sosial?tab=${tabId}`);
  }

  return (
    <div className="social-dashboard page-container">

      <CalmModeProvider>
      <header className="social-dashboard__header">
        <p className="eyebrow">MADEVI LINE</p>
        <h1>{isId ? 'Ruang sosial yang terarah' : 'A social space with direction'}</h1>
        <p>
          {isId
            ? 'Pilih aktivitas yang ingin Anda kelola—mengikuti feed, membalas pesan, atau berpartisipasi dalam komunitas—tanpa mencampurkan semuanya dalam satu layar.'
            : 'Choose the activity you want to manage—following the feed, replying to messages, or joining a community—without mixing everything into one screen.'}
        </p>
        {/* Zona Tenang (INOVASI-0841): toggle inline, bukan popup. */}
        <CalmModeToggle />
        <p className="line-safety-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>
            {isId
              ? 'Ruang ini termoderasi. Menemukan konten bermasalah? Gunakan tombol Lapor di tiap postingan.'
              : 'This space is moderated. Spotted something wrong? Use the Report button on any post.'}
          </span>
        </p>
      </header>
      <div className="social-dashboard__tab-groups" role="tablist" aria-label={isId ? 'Navigasi Madevi Line' : 'Madevi Line navigation'}>
        {tabGroups.map((group) => (
          <section key={group.label} className="social-dashboard__tab-group">
            <div className="social-dashboard__tab-group-heading">
              <h2>{group.label}</h2>
              <p>{group.description}</p>
            </div>
            <div className="profile-tabs social-dashboard__tabs">
              {group.tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`madevi-line-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls="madevi-line-panel"
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div
        id="madevi-line-panel"
        className="social-dashboard__content"
        role="tabpanel"
        aria-labelledby={`madevi-line-tab-${activeTab}`}
      >
        {activeTab === 'Feed' && <SocialFeed />}
        {activeTab === 'Teman' && <FriendsTab />}
        {activeTab === 'Pesan' && <MessagesPage />}
        {activeTab === 'Grup' && <GroupsPage />}
        {activeTab === 'Postingan' && <MyPostsTab />}
        {activeTab === 'Notifikasi' && <NotificationsTab />}
        {activeTab === 'Kebaikan' && <KindnessMap />}
        {activeTab === 'Dongeng' && <StoryWeave />}
        {activeTab === 'Dengar' && <ListenTurn />}
        {activeTab === 'Sidang' && <SidangWarga />}
        {activeTab === 'Klinik' && <KlinikIde />}
        {activeTab === 'Silsilah' && <SilsilahKarya />}
      </div>
      </CalmModeProvider>
    </div>
  );
}
