'use client';

import { useEffect, useState, useCallback } from 'react';
import { syncPendingLeads } from '@/features/offline-sync/sync';
import { getPendingCount } from '@/features/offline-sync/indexeddb';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncMsg, setLastSyncMsg] = useState('');

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
    } catch {
      // IndexedDB not available
    }
  }, []);

  const doSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    setLastSyncMsg('');
    try {
      const result = await syncPendingLeads();
      if (result.success && result.synced > 0) {
        setLastSyncMsg(`${result.synced} lead${result.synced > 1 ? 's' : ''} synced`);
        await refreshPendingCount();
        setTimeout(() => setLastSyncMsg(''), 4000);
      }
    } catch {
      // silent
    } finally {
      setSyncing(false);
    }
  }, [syncing, refreshPendingCount]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      doSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Poll pending count every 30 seconds
    const interval = setInterval(refreshPendingCount, 30_000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [doSync, refreshPendingCount]);

  return (
    <div>
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800/50 text-xs">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-400 font-medium">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-400 font-medium">Offline</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastSyncMsg && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3 h-3" />
              {lastSyncMsg}
            </span>
          )}
          {pendingCount > 0 && (
            <button
              onClick={doSync}
              disabled={!isOnline || syncing}
              className="flex items-center gap-1 text-slate-400 hover:text-green-400 disabled:opacity-50 transition-colors"
              title="Sync pending leads"
            >
              <RefreshCw
                className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`}
              />
              <span
                className="bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full px-1.5 py-0.5 text-xs font-bold"
              >
                {pendingCount} pending
              </span>
            </button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
