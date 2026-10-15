/**
 * Kontrak DTO kanonis Madevi Line (L05).
 *
 * Seluruh route sosial mengembalikan DTO camelCase viewer-aware ini, bukan
 * baris SQL mentah. Consumer UI hanya boleh membaca field yang terdaftar di
 * sini; field moderasi internal tidak pernah dikirim ke browser.
 */

export interface SocialPostView {
  id: string;
  body: string;
  linkUrl: string | null;
  groupId: string | null;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  status: 'PUBLISHED' | 'PENDING_MODERATION' | 'QUARANTINED';
  /** Subset aman tanpa path/URL (path hanya lewat route attachment bertoken). */
  attachments: Array<{ id: string; mediaType: string; sizeBytes: number }>;
  attachmentCount: number;
  commentCount: number;
  reactionCount: number;
  /** State viewer; null bila tamu. */
  myReaction: string | null;
  isSaved: boolean;
  mine: boolean;
}

export interface SocialCommentView {
  id: string;
  postId: string;
  parentCommentId: string | null;
  body: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  mine: boolean;
}

export interface SocialConversationView {
  id: string;
  otherId: string;
  otherName: string;
  otherUsername: string;
  lastMessage: string | null;
  updatedAt: string;
  archived: boolean;
}

export interface SocialMessageView {
  id: string;
  conversationId: string;
  senderId: string;
  mine: boolean;
  body: string;
  status: string;
  sentAt: string;
}

export interface SocialGroupView {
  id: string;
  businessCode: string;
  name: string;
  description: string;
  status: string;
  memberCount: number;
  membershipStatus: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'REMOVED' | null;
  mine: boolean;
  managedByMe: boolean;
}

export interface SocialProfileCard {
  username: string;
  displayName: string;
  bio: string;
  friends: boolean;
  /** Alasan generik agar tidak membocorkan relasi blokir. */
  unavailable: boolean;
}

export interface SocialFriendView {
  id: string;
  displayName: string;
  username: string;
  friendsSince: string;
}

export interface SocialPersonView {
  id: string;
  displayName: string;
  username: string;
}

export interface SocialNotificationView {
  id: string;
  type: string;
  actorId: string | null;
  objectType: string;
  objectId: string | null;
  summary: string;
  read: boolean;
  createdAt: string;
}

export interface SocialCursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

/**
 * Batas pendengar sesi "Dengar" (Line). Konstanta shared agar komponen client
 * tidak perlu mengimpor service server (yang memakai node:crypto).
 */
export const LISTEN_MAX_LISTENERS = 12;

/* Konstanta kindness — shared agar client tidak impor service (node:crypto). */

export const KINDNESS_CITIES: readonly string[] = [
  'Ambon',
  'Balikpapan',
  'Bandung',
  'Banjar',
  'Banjarmasin',
  'Batam',
  'Batu',
  'Bekasi',
  'Bengkulu',
  'Bima',
  'Binjai',
  'Bitung',
  'Blitar',
  'Bogor',
  'Bontang',
  'Bukittinggi',
  'Cilegon',
  'Cimahi',
  'Cirebon',
  'Denpasar',
  'Depok',
  'Dumai',
  'Gorontalo',
  'Gunungsitoli',
  'Indramayu',
  'Jakarta',
  'Jambi',
  'Jayapura',
  'Kediri',
  'Kendari',
  'Kupang',
  'Langsa',
  'Lhokseumawe',
  'Lubuklinggau',
  'Madiun',
  'Magelang',
  'Malang',
  'Manado',
  'Mataram',
  'Medan',
  'Metro',
  'Mojokerto',
  'Padang',
  'Palangkaraya',
  'Palembang',
  'Palopo',
  'Palu',
  'Pangkalpinang',
  'Pekalongan',
  'Pekanbaru',
  'Pontianak',
  'Prabumulih',
  'Probolinggo',
  'Sabang',
  'Salatiga',
  'Samarinda',
  'Sanana',
  'Sawahlunto',
  'Serang',
  'Sibolga',
  'Singkawang',
  'Solok',
  'Sorong',
  'Subulussalam',
  'Sukabumi',
  'Sungai Penuh',
  'Surabaya',
  'Surakarta',
  'Tangerang',
  'Tangerang Selatan',
  'Tanjungbalai',
  'Tanjungpinang',
  'Tebing Tinggi',
  'Ternate',
  'Tidore Kepulauan',
  'Tual',
  'Yogyakarta',
];

export const KINDNESS_CATEGORIES: readonly {
  key: string;
  labelId: string;
  labelEn: string;
}[] = [
  { key: 'BANTU_TETANGGA', labelId: 'Bantu tetangga', labelEn: 'Helping a neighbor' },
  { key: 'BANTU_JALAN', labelId: 'Bantu di jalan', labelEn: 'Helping on the street' },
  { key: 'LINGKUNGAN', labelId: 'Lingkungan', labelEn: 'Environment' },
  { key: 'PENDIDIKAN', labelId: 'Pendidikan', labelEn: 'Education' },
  { key: 'LAINNYA', labelId: 'Lainnya', labelEn: 'Other' },
];

/**
 * Nama tampilan pelapor: anonim → "Seorang warga [kota]" (INOVASI-0841).
 */
export function kindnessReporterLabel(input: {
  isAnonymous: boolean;
  reporterName: string | null;
  city: string;
}): string {
  if (input.isAnonymous || !input.reporterName) {
    return `Seorang warga ${input.city}`;
  }
  return input.reporterName;
}

/* Tipe + helper sidang — shared agar client tidak impor service (node:crypto). */

export type SidangPhase = 'TANYA' | 'SANGGAH' | 'VOTING';
export type SidangArgumentKind = 'TANYA' | 'JAWAB' | 'SANGGAH' | 'DUKUNG';

/**
 * Kind argumen yang diperbolehkan per fase. PURE — dasar unit test
 * "menolak argumen kind yang tidak sesuai fase aktif".
 */
export function allowedArgumentKinds(phase: SidangPhase): readonly SidangArgumentKind[] {
  switch (phase) {
    case 'TANYA':
      return ['TANYA', 'JAWAB'];
    case 'SANGGAH':
      return ['SANGGAH', 'DUKUNG'];
    case 'VOTING':
      return [];
  }
}
