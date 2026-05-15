'use client';

import Image from 'next/image';
import FranchiseCTA from '@/components/expo/FranchiseCTA';
import OfflineSyncProvider from '@/components/sales/OfflineSyncProvider';

export default function FormPage() {
  return (
    <OfflineSyncProvider>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Image
              src="/uclean-logo.png"
              alt="UClean"
              width={110}
              height={32}
              style={{ objectFit: 'contain' }}
              priority
            />
            <p className="text-xs font-semibold text-gray-400 tracking-wide hidden sm:block">
              Franchise Lead Capture
            </p>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-2xl mx-auto px-4 py-8">
          <FranchiseCTA />
        </main>

      </div>
    </OfflineSyncProvider>
  );
}
