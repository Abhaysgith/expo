'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export default function OfflineBanner() {
  const isOffline = useOfflineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2.5 px-4 py-2.5"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="flex-shrink-0 p-1 rounded-full bg-amber-500/15">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <p className="text-sm text-amber-300 font-medium">
            📡 Running in Offline Mode — Your data is saved locally and synced on reconnect.
          </p>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
            Offline
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
