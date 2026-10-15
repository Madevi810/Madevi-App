import { errorResponse, successResponse } from '@/api/response';
import { ApiError } from '@/api/errors';
import { assertRequestCsrf, authenticateRequest } from '@/auth/http';
import { getPool } from '@/db/pool';
import { getServerEnv } from '@/server/env';
import { requestIdFromHeaders } from '@/server/request-id';
import { EBelanjaService } from '@/services/ebelanja';
import { removeShopImage, storeShopImage } from '@/services/shop-image-storage';

export const dynamic = 'force-dynamic';

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  const storedImageNames: string[] = [];
  let runtimeRoot = '';
  try {
    const auth = await authenticateRequest(request, 'OWNER', { humanActivity: true });
    await assertRequestCsrf(request, auth.sessionId, 'OWNER');
    const form = await request.formData();
    const files = form.getAll('files').filter((item): item is File => item instanceof File);
    if (!files.length) {
      throw new ApiError('VALIDATION_FAILED', 'Foto produk wajib dipilih.');
    }
    if (files.length > 8) throw new ApiError('VALIDATION_FAILED', 'Maksimal 8 foto untuk satu produk.');

    runtimeRoot = getServerEnv().MADEVI_RUNTIME_ROOT;
    const images = [];
    for (const file of files) {
      const image = await storeShopImage({ runtimeRoot, file });
      storedImageNames.push(image.name);
      images.push(image);
    }

    const product = await new EBelanjaService(await getPool()).createProduct({
      title: formText(form, 'title'),
      imageUrl: images[0]!.url,
      mediaUrls: images.map((image) => image.url),
      originalPrice: Number(formText(form, 'originalPrice')),
      brand: formText(form, 'brand'),
      category: formText(form, 'category'),
      subcategory: formText(form, 'subcategory'),
      condition: 'NEW',
      stockStatus: formText(form, 'stockStatus') as 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN',
      sourceDescription: formText(form, 'sourceDescription'),
      ownerDescription: formText(form, 'ownerDescription'),
      externalUrl: formText(form, 'externalUrl'),
    });
    return successResponse(product, requestId, { status: 201 });
  } catch (error) {
    if (storedImageNames.length && runtimeRoot) {
      for (const name of storedImageNames) {
        try {
          await removeShopImage(runtimeRoot, name);
        } catch {
          // Kesalahan awal tetap menjadi respons; file yang tidak dapat dibersihkan tidak dipublikasikan.
        }
      }
    }
    return errorResponse(error, requestId);
  }
}
