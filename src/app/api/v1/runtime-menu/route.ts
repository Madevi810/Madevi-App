import { successResponse } from '@/api/response';
import { MADEVI_SPACES } from '@/contracts/navigation';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { RuntimeContentPackageService } from '@/services/runtime-content';
import { requestIdFromHeaders } from '@/server/request-id';

/**
 * L06: runtime menu dibaca dari storage nyata (runtime_content_packages)
 * disatukan dengan kontrak ruang utama. Tidak lagi mengembalikan
 * RUNTIME_MENU_NODES atau status package literal dari array source.
 * Package DRAFT tidak tampil sebagai menu aktif.
 */
export async function GET(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    const service = new RuntimeContentPackageService(
      getDatabaseClients().pool,
      getDatabaseSchema(),
    );
    const menu = await service.getRuntimeMenu();
    return successResponse(menu, requestId);
  } catch {
    // Fail-closed jujur: kontrak ruang utama tetap tersedia sebagai definisi
    // aplikasi; extension package kosong karena storage tidak terbaca.
    // Bukan klaim "tidak ada package" — Admin memeriksa panel + log server.
    const spaces = MADEVI_SPACES.map((s) => ({
      id: s.id,
      label: s.name,
      slug: s.slug,
      href: s.href,
      sortOrder: s.sortOrder,
    }));
    return successResponse(
      { spaces, extensions: [], hasPublishedExtensions: false, storageUnavailable: true },
      requestId,
    );
  }
}
