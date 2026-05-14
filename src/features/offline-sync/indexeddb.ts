import { openDB } from 'idb';

const DB_NAME = 'expo-leads';
const STORE_NAME = 'pending-leads';

export interface OfflineLead {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  note?: string;
  budget?: string;
  preferredLocation?: string;
  ownerName?: string;
  ownerPhone?: string;
  syncStatus: 'pending' | 'synced';
  createdAt: string;
}

export async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('syncStatus', 'syncStatus');
      }
    },
  });
}

export async function saveLeadOffline(lead: OfflineLead) {
  const db = await getOfflineDb();
  await db.put(STORE_NAME, { ...lead, syncStatus: 'pending' });
}

export async function getPendingLeads(): Promise<OfflineLead[]> {
  const db = await getOfflineDb();
  return db.getAllFromIndex(STORE_NAME, 'syncStatus', 'pending');
}

export async function markLeadSynced(id: string) {
  const db = await getOfflineDb();
  const lead = await db.get(STORE_NAME, id);
  if (lead) await db.put(STORE_NAME, { ...lead, syncStatus: 'synced' });
}

export async function deleteSyncedLeads() {
  const db = await getOfflineDb();
  const all = await db.getAll(STORE_NAME);
  const synced = all.filter((l) => l.syncStatus === 'synced');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(synced.map((l) => tx.store.delete(l.id)));
  await tx.done;
}

export async function getPendingCount(): Promise<number> {
  const db = await getOfflineDb();
  const pending = await db.getAllFromIndex(STORE_NAME, 'syncStatus', 'pending');
  return pending.length;
}
