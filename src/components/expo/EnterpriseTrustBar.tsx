'use client';

import { motion } from 'framer-motion';

interface Enterprise {
  name: string;
  sector: string;
  icon: string;
}

const ENTERPRISES: Enterprise[] = [
  { name: 'Amazon',       sector: 'E-Commerce',  icon: '📦' },
  { name: 'Myntra',       sector: 'Fashion',      icon: '👗' },
  { name: 'Marriott',     sector: 'Hospitality',  icon: '🏨' },
  { name: 'Radisson Blu', sector: 'Hospitality',  icon: '🌟' },
  { name: 'Mahindra',     sector: 'Automotive',   icon: '🚗' },
  { name: 'ISKCON',       sector: 'Religious',    icon: '🙏' },
  { name: 'OYO Rooms',    sector: 'Hospitality',  icon: '🛎️' },
  { name: 'Recipto',      sector: 'Technology',   icon: '🔁' },
];

// Double for seamless loop
const DOUBLED = [...ENTERPRISES, ...ENTERPRISES];

export default function EnterpriseTrustBar() {
  return (
    <div className="relative overflow-hidden rounded-2xl py-4"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(22,163,74,0.14)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(22,163,74,0.08)',
      }}
    >
      {/* Label */}
      <div className="text-center mb-4">
        <span className="text-xl font-bold uppercase tracking-[0.18em]"
          style={{ color: '#15803D' }}>
          Trusted by Enterprise Leaders
        </span>
      </div>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.95), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)' }} />

      {/* Scrolling row */}
      <div className="overflow-hidden">
        <motion.div
          className="flex items-center gap-6"
          style={{ width: 'max-content' }}
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {DOUBLED.map((ent, i) => (
            <div
              key={`${ent.name}-${i}`}
              className="flex items-center gap-2.5 flex-shrink-0 px-5 py-2.5 rounded-xl"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(22,163,74,0.12)',
                minWidth: 140,
              }}
            >
              <span className="text-xl">{ent.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-700 whitespace-nowrap">{ent.name}</p>
                <p className="text-base font-medium whitespace-nowrap" style={{ color: '#4B5563' }}>{ent.sector}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
