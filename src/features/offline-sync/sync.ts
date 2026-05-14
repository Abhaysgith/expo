import {
  getPendingLeads,
  markLeadSynced,
  deleteSyncedLeads,
} from './indexeddb';

export async function syncPendingLeads(): Promise<{
  success: boolean;
  synced: number;
  error?: string;
}> {
  try {
    const pending = await getPendingLeads();
    if (pending.length === 0) {
      return { success: true, synced: 0 };
    }

    const res = await fetch('/api/leads/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: pending }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        synced: 0,
        error: data.error || 'Sync failed',
      };
    }

    const data = await res.json();

    // Mark all as synced
    await Promise.all(pending.map((l) => markLeadSynced(l.id)));
    await deleteSyncedLeads();

    return { success: true, synced: data.data?.synced ?? pending.length };
  } catch (err) {
    return {
      success: false,
      synced: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
