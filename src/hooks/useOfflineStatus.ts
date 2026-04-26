'use client';

import { useState, useEffect } from 'react';

/**
 * Tracks browser online/offline status.
 * Returns true when offline, false when online.
 * Safe for SSR — defaults to false (assume online until mounted).
 */
export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set initial state from browser API
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return isOffline;
}
