'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface EntryStripProps {
  isLight: boolean;
}

/**
 * Persistent top context bar — visible at 8–12ft.
 * Always tells the viewer who UClean is, no matter which slide they land on.
 */
export default function EntryStrip({ isLight }: EntryStripProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-14 sm:h-20 flex items-center justify-between px-4 sm:px-8"
      animate={isLight
        ? { backgroundColor: 'rgba(255,255,255,0.97)', borderBottomColor: 'rgba(22,163,74,0.18)' }
        : { backgroundColor: 'rgba(6,10,20,0.97)', borderBottomColor: 'rgba(22,163,74,0.14)' }
      }
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(22,163,74,0.14)',
      }}
    >
      {/* Brand identity — left */}
      <div className="flex items-center gap-4">
        <Image
          src="/uclean-logo.png"
          alt="UClean"
          width={120}
          height={32}
          className="w-20 sm:w-[120px]"
          style={{ objectFit: 'contain' }}
          priority
        />
        <span
          className="hidden sm:block font-semibold"
          style={{ fontSize: '1.35rem', color: isLight ? '#1F2937' : '#D1D5DB' }}
        >
          World&apos;s Largest Laundry Network
        </span>
      </div>

      {/* Key stats — right */}
      <motion.div
        className="flex items-center gap-2 sm:gap-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { v: '900+', l: 'Stores' },
          { v: '5M+',  l: 'Customers' },
          { v: '10+',  l: 'Countries' },
        ].map(({ v, l }, i) => (
          <div key={l} className="flex items-center gap-1 sm:gap-2">
            <span
              className="font-black text-sm sm:text-2xl"
              style={{ color: isLight ? '#15803D' : '#4ADE80' }}
            >
              {v}
            </span>
            <span
              className="font-semibold hidden sm:inline text-xs sm:text-xl"
              style={{ color: isLight ? '#374151' : '#9CA3AF' }}
            >
              {l}
            </span>
            {i < 2 && (
              <span className="font-bold text-xs sm:text-base" style={{ color: isLight ? '#9CA3AF' : '#374151', marginLeft: 2 }}>·</span>
            )}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
