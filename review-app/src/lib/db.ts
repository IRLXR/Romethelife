import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'review-app';
const DB_VERSION = 1;

interface BlobRecord {
  id: string;
  blob: Blob;
  name: string;
  mime: string;
  createdAt: number;
}

interface KvRecord {
  key: string;
  value: unknown;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('blobs')) {
          db.createObjectStore('blobs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('kv')) {
          db.createObjectStore('kv', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function putBlob(record: BlobRecord): Promise<void> {
  const db = await getDb();
  await db.put('blobs', record);
}

export async function getBlob(id: string): Promise<BlobRecord | undefined> {
  const db = await getDb();
  return db.get('blobs', id);
}

export async function deleteBlob(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('blobs', id);
}

export async function listBlobs(): Promise<BlobRecord[]> {
  const db = await getDb();
  return db.getAll('blobs');
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  const record: KvRecord = { key, value };
  await db.put('kv', record);
}

export async function kvGet<T = unknown>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const record = (await db.get('kv', key)) as KvRecord | undefined;
  return record?.value as T | undefined;
}
