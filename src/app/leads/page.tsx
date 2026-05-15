'use client';

import OfflineSyncProvider from '@/components/sales/OfflineSyncProvider';
import FranchiseCTA from '@/components/expo/FranchiseCTA';

export default function LeadsPage() {
  return (
    <OfflineSyncProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FFFFFF 55%, #DCFCE7 100%)' }}
      >
        <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-xl">
            <FranchiseCTA />
          </div>
        </div>
      </div>
    </OfflineSyncProvider>
  );
}
