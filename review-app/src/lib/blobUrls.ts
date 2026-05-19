import { getBlob } from './db';

const cache = new Map<string, string>();

export async function getBlobUrl(blobId: string): Promise<string | null> {
  const existing = cache.get(blobId);
  if (existing) return existing;
  const record = await getBlob(blobId);
  if (!record) return null;
  const url = URL.createObjectURL(record.blob);
  cache.set(blobId, url);
  return url;
}

export function releaseAllBlobUrls() {
  for (const url of cache.values()) {
    URL.revokeObjectURL(url);
  }
  cache.clear();
}
