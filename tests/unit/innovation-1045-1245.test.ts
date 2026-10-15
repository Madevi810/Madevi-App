/**
 * Unit test fitur inovasi INOVASI-1045 + INOVASI-1145 + INOVASI-1245.
 * Verifikasi static/unit-level saja (INSTRUKSI-02 — tanpa runtime).
 *
 * Cakupan:
 *   1. Giliran Dengar — assertResponseAllowed (SARAN ditolak jika
 *      needs_advice=false), isValidResponseBody.
 *   2. Duel Produk — isValidVoteReason (≥30), isValidDuelPoint (≥20),
 *      isValidDuelPair.
 *   3. Sidang Warga — allowedArgumentKinds per fase, canOpenVoting,
 *      quorumMet, makeVoterHash anonymitas.
 *   4. Klinik Ide — allowedFeedbackKind per fase, phaseGuidanceMessage.
 *   5. Silsilah Karya — buildLineageTree (pohon 3 tingkat),
 *      wouldCreateCycle, badgesForRemixCount.
 *   6. Petisi Katalog — isValidMarketplaceLink, petitionOutcome.
 */

import { describe, expect, it } from 'vitest';

import {
  LISTEN_RESPONSE_MAX_CHARS,
  assertResponseAllowed,
  isValidResponseBody,
} from '@/services/listen';
import {
  isValidDuelPair,
  isValidDuelPoint,
  isValidVoteReason,
} from '@/services/duel';
import {
  SIDANG_MIN_SANGGAH,
  allowedArgumentKinds,
  canOpenVoting,
  makeVoterHash,
  quorumMet,
} from '@/services/sidang';
import {
  CLINIC_FEEDBACK_PER_HOUR,
  allowedFeedbackKind,
  phaseGuidanceMessage,
} from '@/services/clinic';
import {
  LINEAGE_MAX_DEPTH,
  badgesForRemixCount,
  buildLineageTree,
  wouldCreateCycle,
} from '@/services/lineage';
import {
  PETITION_TARGET_VOTES,
  isValidMarketplaceLink,
  petitionOutcome,
} from '@/services/petition';

describe('Giliran Dengar (INOVASI-1045 IDE 1)', () => {
  it('assertResponseAllowed: SARAN ditolak saat needs_advice=false', () => {
    expect(() =>
      assertResponseAllowed({ kind: 'SARAN', needsAdvice: false }),
    ).toThrow();
  });

  it('assertResponseAllowed: SARAN diizinkan saat needs_advice=true', () => {
    expect(() =>
      assertResponseAllowed({ kind: 'SARAN', needsAdvice: true }),
    ).not.toThrow();
  });

  it('assertResponseAllowed: REFLEKSI/SEMANGAT selalu diizinkan', () => {
    for (const kind of ['REFLEKSI', 'SEMANGAT'] as const) {
      expect(() =>
        assertResponseAllowed({ kind, needsAdvice: false }),
      ).not.toThrow();
      expect(() =>
        assertResponseAllowed({ kind, needsAdvice: true }),
      ).not.toThrow();
    }
  });

  it('isValidResponseBody: batas 2 hingga LISTEN_RESPONSE_MAX_CHARS', () => {
    expect(isValidResponseBody('')).toBe(false);
    expect(isValidResponseBody('a')).toBe(false);
    expect(isValidResponseBody('baik')).toBe(true);
    expect(
      isValidResponseBody('x'.repeat(LISTEN_RESPONSE_MAX_CHARS + 1)),
    ).toBe(false);
  });
});

describe('Duel Produk (INOVASI-1045 IDE 2)', () => {
  it('isValidVoteReason: minimal 30 karakter', () => {
    expect(isValidVoteReason(''.padEnd(29, 'a'))).toBe(false);
    expect(isValidVoteReason(''.padEnd(30, 'a'))).toBe(true);
    expect(isValidVoteReason('  '.padEnd(40, ' ') + 'karakter')).toBe(false);
  });

  it('isValidDuelPoint: minimal 20 karakter', () => {
    expect(isValidDuelPoint(''.padEnd(19, 'b'))).toBe(false);
    expect(isValidDuelPoint(''.padEnd(20, 'b'))).toBe(true);
  });

  it('isValidDuelPair: produk harus berbeda dan non-kosong', () => {
    expect(isValidDuelPair('', 'b')).toBe(false);
    expect(isValidDuelPair('a', '')).toBe(false);
    expect(isValidDuelPair('a', 'a')).toBe(false);
    expect(isValidDuelPair('a', 'b')).toBe(true);
  });
});

describe('Sidang Warga (INOVASI-1145 IDE 1)', () => {
  it('allowedArgumentKinds: TANYA hanya TANYA/JAWAB', () => {
    expect(allowedArgumentKinds('TANYA')).toEqual(['TANYA', 'JAWAB']);
  });

  it('allowedArgumentKinds: SANGGAH hanya SANGGAH/DUKUNG', () => {
    expect(allowedArgumentKinds('SANGGAH')).toEqual(['SANGGAH', 'DUKUNG']);
  });

  it('allowedArgumentKinds: VOTING tidak ada argumen', () => {
    expect(allowedArgumentKinds('VOTING')).toEqual([]);
  });

  it('canOpenVoting: butuh minimal 2 argumen sanggah', () => {
    expect(canOpenVoting(0)).toBe(false);
    expect(canOpenVoting(1)).toBe(false);
    expect(canOpenVoting(SIDANG_MIN_SANGGAH)).toBe(true);
    expect(canOpenVoting(5)).toBe(true);
  });

  it('quorumMet: 60% dari 10 anggota = minimal 6 suara', () => {
    const base = { SETUJU: 4, TOLAK: 0, ABSTAIN: 1 };
    expect(quorumMet(base, 10, 60)).toBe(false); // 5 suara < 60%
    expect(quorumMet({ ...base, TOLAK: 1 }, 10, 60)).toBe(true); // 6 suara = 60%
    expect(quorumMet({ SETUJU: 10, TOLAK: 0, ABSTAIN: 0 }, 10, 60)).toBe(true);
  });

  it('quorumMet: anggota nol selalu false', () => {
    expect(quorumMet({ SETUJU: 10, TOLAK: 0, ABSTAIN: 0 }, 0, 60)).toBe(false);
  });

  it('makeVoterHash: deterministik & anonymized (bukan id mentah)', () => {
    const hash = makeVoterHash('secret', 'user-1', 'session-1');
    expect(hash).toBe(makeVoterHash('secret', 'user-1', 'session-1'));
    expect(hash).not.toContain('user-1');
    expect(hash).toHaveLength(64);
    expect(makeVoterHash('secret', 'user-2', 'session-1')).not.toBe(hash);
  });
});

describe('Klinik Ide (INOVASI-1145 IDE 2)', () => {
  it('allowedFeedbackKind: BERTANYA hanya PERTANYAAN', () => {
    expect(allowedFeedbackKind('BERTANYA')).toEqual(['PERTANYAAN']);
  });

  it('allowedFeedbackKind: MEMBEDAH hanya SARAN', () => {
    expect(allowedFeedbackKind('MEMBEDAH')).toEqual(['SARAN']);
  });

  it('allowedFeedbackKind: APRESIASI hanya APRESIASI', () => {
    expect(allowedFeedbackKind('APRESIASI')).toEqual(['APRESIASI']);
  });

  it('phaseGuidanceMessage: pesan panduan per fase (id)', () => {
    expect(phaseGuidanceMessage('BERTANYA')).toContain('BERTANYA');
    expect(phaseGuidanceMessage('MEMBEDAH')).toContain('MEMBEDAH');
    expect(phaseGuidanceMessage('APRESIASI')).toContain('APRESIASI');
  });

  it('CLINIC_FEEDBACK_PER_HOUR: batas rate limit terdefinisi', () => {
    expect(CLINIC_FEEDBACK_PER_HOUR).toBeGreaterThan(0);
  });
});

describe('Silsilah Karya (INOVASI-1245 IDE 1)', () => {
  const rows = [
    { post_id: 'a', parent_karya_id: null },
    { post_id: 'b', parent_karya_id: 'a' },
    { post_id: 'c', parent_karya_id: 'b' },
    { post_id: 'd', parent_karya_id: 'a' },
    { post_id: 'e', parent_karya_id: null },
  ];

  it('buildLineageTree: pohon multi-tingkat terbentuk benar', () => {
    const tree = buildLineageTree(rows);
    expect(tree).toHaveLength(2);
    const a = tree.find((n) => n.postId === 'a');
    expect(a).toBeDefined();
    expect(a!.children.map((c) => c.postId).sort()).toEqual(['b', 'd']);
    const b = a!.children.find((c) => c.postId === 'b');
    expect(b!.children.map((c) => c.postId)).toEqual(['c']);
    expect(b!.depth).toBe(1);
    expect(b!.children[0]!.depth).toBe(2);
  });

  it('buildLineageTree: node dengan parent tidak ada jadi root', () => {
    const tree = buildLineageTree([
      { post_id: 'x', parent_karya_id: 'missing' },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0]!.postId).toBe('x');
  });

  it('wouldCreateCycle: self-reference ditolak', () => {
    expect(wouldCreateCycle('a', 'a', rows)).toBe(true);
  });

  it('wouldCreateCycle: chain a→b→c, jadikan a child dari c = siklus', () => {
    expect(wouldCreateCycle('a', 'c', rows)).toBe(true);
  });

  it('wouldCreateCycle: parent valid tidak bersiklus', () => {
    expect(wouldCreateCycle('e', 'a', rows)).toBe(false);
  });

  it('badgesForRemixCount: ambang PERTAMA/REMIXED/POPULER/LEGENDA', () => {
    expect(badgesForRemixCount(0, true)).toEqual(['PERTAMA']);
    expect(badgesForRemixCount(1, false)).toEqual(['REMIXED']);
    expect(badgesForRemixCount(3, false)).toEqual(['REMIXED', 'POPULER']);
    expect(badgesForRemixCount(10, false)).toEqual([
      'REMIXED',
      'POPULER',
      'LEGENDA',
    ]);
    expect(badgesForRemixCount(0, false)).toEqual([]);
  });

  it('LINEAGE_MAX_DEPTH: maksimum 3 tingkat', () => {
    expect(LINEAGE_MAX_DEPTH).toBe(3);
  });
});

describe('Petisi Katalog (INOVASI-1245 IDE 2)', () => {
  it('isValidMarketplaceLink: marketplace resmi diterima', () => {
    expect(isValidMarketplaceLink('https://www.tokopedia.com/p/123')).toBe(true);
    expect(isValidMarketplaceLink('https://shopee.co.id/product-1')).toBe(true);
    expect(isValidMarketplaceLink('https://bukalapak.com/p/a')).toBe(true);
    expect(isValidMarketplaceLink('https://lazada.co.id/x')).toBe(true);
  });

  it('isValidMarketplaceLink: domain asing/aneh ditolak', () => {
    expect(isValidMarketplaceLink('https://example.com/p')).toBe(false);
    expect(isValidMarketplaceLink('bukan-url')).toBe(false);
    expect(isValidMarketplaceLink('')).toBe(false);
    expect(isValidMarketplaceLink('https://evil.com/tokopedia.com')).toBe(false);
  });

  it('petitionOutcome: vote >= target → DIKIRIM', () => {
    expect(petitionOutcome(50).status).toBe('DIKIRIM');
    expect(petitionOutcome(100).status).toBe('DIKIRIM');
    expect(petitionOutcome(50).message).toContain('moderasi');
  });

  it('petitionOutcome: vote < target → DITOLAK', () => {
    expect(petitionOutcome(49).status).toBe('DITOLAK');
    expect(petitionOutcome(0).status).toBe('DITOLAK');
    expect(petitionOutcome(49).message).toContain('target');
  });

  it('petitionOutcome: target kustom dihormati', () => {
    expect(petitionOutcome(5, 5).status).toBe('DIKIRIM');
    expect(petitionOutcome(4, 5).status).toBe('DITOLAK');
  });

  it('PETITION_TARGET_VOTES: target default 50', () => {
    expect(PETITION_TARGET_VOTES).toBe(50);
  });
});
