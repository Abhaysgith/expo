'use client';

import { motion } from 'framer-motion';

interface Enterprise {
  name: string;
  sector: string;
  icon: string;
}

const ENTERPRISES: Enterprise[] = [
  { name: 'Amazon',     sector: 'E-Commerce',  icon: '📦' },
  { name: 'Myntra',     sector: 'Fashion',     icon: '👗' },
  { name: 'Marriott',   sector: 'Hospitality', icon: '🏨' },
  { name: 'MakeMyTrip', sector: 'Travel',      icon: '✈️' },
  { name: 'Britannia',  sector: 'FMCG',        icon: '🍪' },
  { name: 'Mahindra',   sector: 'Automotive',  icon: '🚗' },
  { name: 'ISKCON',     sector: 'Religious',   icon: '🙏' },
  { name: 'ITC Hotels', sector: 'Hospitality', icon: '🌟' },
  { name: 'Lenskart',   sector: 'Retail',      icon: '👓' },
  { name: 'OYO Rooms',  sector: 'Hospitality', icon: '🛎️' },
];

// Double for seamless loop
const DOUBLED = [...ENTERPRISES, ...ENTERPRISES];

export default function EnterpriseTrustBar() {
  return (
    <div className="relative overflow-hidden rounded-2xl py-4"
      style={{
        background: 'rgba(8,13,28,0.8)',
        border: '1px solid rgba(6,182,212,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(6,182,212,0.1)',
      }}
    >
      {/* Label */}
      <div className="text-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono"
          style={{ color: 'rgba(6,182,212,0.5)' }}>
          Trusted by Enterprise Leaders
        </span>
      </div>

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(8,13,28,0.95), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(8,13,28,0.95), transparent)' }} />

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
                background: 'rgba(20,30,55,0.6)',
                border: '1px solid rgba(6,182,212,0.1)',
                minWidth: 140,
              }}
            >
              <span className="text-xl">{ent.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-200 whitespace-nowrap">{ent.name}</p>
                <p className="text-[10px] text-slate-600 font-mono whitespace-nowrap">{ent.sector}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
