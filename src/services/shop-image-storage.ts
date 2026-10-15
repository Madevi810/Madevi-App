import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { ApiError } from '@/api/errors';

const MAX_SHOP_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

type ShopImageType = keyof typeof IMAGE_TYPES;

export async function storeShopImage(input: { runtimeRoot: string; file: File }) {
  const mediaType = input.file.type.toLowerCase() as ShopImageType;
  const extension = IMAGE_TYPES[mediaType];
  if (!extension) {
    throw new ApiError('VALIDATION_FAILED', 'Foto produk harus berformat JPG, PNG, atau WebP.');
  }
  if (input.file.size < 1 || input.file.size > MAX_SHOP_IMAGE_BYTES) {
    throw new ApiError('PAYLOAD_TOO_LARGE', 'Ukuran foto produk harus antara 1 byte dan 5 MB.');
  }

  const bytes = new Uint8Array(await input.file.arrayBuffer());
  if (!matchesImageSignature(bytes, mediaType)) {
    throw new ApiError('VALIDATION_FAILED', 'Isi file tidak cocok dengan format foto yang dipilih.');
  }

  const directory = shopImageDirectory(input.runtimeRoot);
  const name = `${randomUUID()}.${extension}`;
  const finalPath = path.join(directory, name);
  const temporaryPath = `${finalPath}.${randomUUID()}.tmp`;
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  await fs.writeFile(temporaryPath, bytes, { flag: 'wx', mode: 0o600 });
  await fs.rename(temporaryPath, finalPath);

  return {
    name,
    url: `/api/v1/ebelanja/images/${name}`,
    mediaType,
    sizeBytes: bytes.byteLength,
  };
}

export async function readShopImage(runtimeRoot: string, name: string) {
  if (!isSafeShopImageName(name)) return null;
  const extension = name.split('.').pop();
  const mediaType = extension === 'jpg' ? 'image/jpeg' : extension === 'png' ? 'image/png' : 'image/webp';
  try {
    const bytes = await fs.readFile(path.join(shopImageDirectory(runtimeRoot), name));
    return { bytes, mediaType };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

/** Bersihkan unggahan yang gagal dipasangkan ke produk pada proses penerbitan yang sama. */
export async function removeShopImage(runtimeRoot: string, name: string) {
  if (!isSafeShopImageName(name)) return;
  try {
    await fs.unlink(path.join(shopImageDirectory(runtimeRoot), name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

function shopImageDirectory(runtimeRoot: string) {
  const root = path.resolve(runtimeRoot, 'shop-images');
  const projectRoot = path.resolve(process.cwd());
  if (!root.startsWith(`${projectRoot}${path.sep}`)) {
    throw new ApiError('INTERNAL_ERROR', 'Penyimpanan foto Shop berada di luar proyek lokal.');
  }
  if (root.includes(`${path.sep}public${path.sep}`)) {
    throw new ApiError('INTERNAL_ERROR', 'Penyimpanan foto Shop tidak boleh berada di folder public.');
  }
  return root;
}

function isSafeShopImageName(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(value);
}

function matchesImageSignature(bytes: Uint8Array, mediaType: ShopImageType) {
  if (mediaType === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mediaType === 'image/png') {
    return bytes.length >= 8
      && bytes[0] === 0x89
      && bytes[1] === 0x50
      && bytes[2] === 0x4e
      && bytes[3] === 0x47
      && bytes[4] === 0x0d
      && bytes[5] === 0x0a
      && bytes[6] === 0x1a
      && bytes[7] === 0x0a;
  }
  return bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
}
