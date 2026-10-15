import { describe, expect, it } from 'vitest';

import { parseServerEnv } from '@/server/env';

const valid = {
  APP_ENV: 'test',
  APP_HOST: '127.0.0.1',
  APP_PORT: '3000',
  APP_ORIGIN: 'http://localhost:3000',
  DATABASE_URL: 'postgresql://local:secret@127.0.0.1:5432/madevi_off',
  MADEVI_RUNTIME_ROOT: '/sdcard/project/Madevi/Madevi_Off/cloud-local',
  LOG_LEVEL: 'info',
};

describe('parseServerEnv', () => {
  it('menerima konfigurasi localhost di workspace Admin', () => {
    expect(parseServerEnv(valid)).toMatchObject({ APP_ENV: 'test', APP_PORT: 3000 });
  });

  it('tetap menerima lokasi workspace Termux lama yang didukung', () => {
    expect(
      parseServerEnv({
        ...valid,
        MADEVI_RUNTIME_ROOT: '/mnt/sdcard/project/Madevi/Madevi_Off/cloud-local',
      }),
    ).toMatchObject({ APP_ENV: 'test', APP_PORT: 3000 });
  });

  it('memvalidasi runtime di path alternatif Termux 2', () => {
    expect(
      parseServerEnv({
        ...valid,
        MADEVI_RUNTIME_ROOT: '/storage/emulated/0/project/Madevi/Madevi_Off/cloud-local',
      }),
    ).toMatchObject({ APP_ENV: 'test', APP_PORT: 3000 });
  });

  it.each([
    ['host publik', { APP_HOST: '0.0.0.0' }],
    ['origin luar', { APP_ORIGIN: 'https://example.com:3000' }],
    ['database luar', { DATABASE_URL: 'postgresql://local:secret@db.example.com/madevi' }],
    ['runtime di luar workspace', { MADEVI_RUNTIME_ROOT: '/mnt/sdcard/madevi/cloud-local' }],
    ['mode Online', { APP_ENV: 'production' }],
  ])('menolak %s', (_label, replacement) => {
    expect(() => parseServerEnv({ ...valid, ...replacement })).toThrow(
      'Konfigurasi lokal tidak valid',
    );
  });

  it('tidak memantulkan password pada pesan kegagalan', () => {
    const password = 'RAHASIA-JANGAN-BOCOR';
    expect(() =>
      parseServerEnv({ ...valid, DATABASE_URL: `mysql://local:${password}@localhost/db` }),
    ).toThrowError(expect.not.stringContaining(password));
  });
});
