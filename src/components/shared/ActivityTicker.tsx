'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BASE_EVENTS = [
  '🛵  Order picked up · Koramangala, Bengaluru',
  '✅  Order delivered in 4.2 hrs · Indiranagar',
  '🧺  Premium Wash · Hauz Khas, Delhi',
  '⭐  5-star rating received · Powai, Mumbai',
  '🔵  New franchise connected · Chandigarh',
  '⚡  Express Wash completed · Anna Nagar, Chennai',
  '📦  Order received · Banjara Hills, Hyderabad',
  '👔  Dry Clean processed · Salt Lake, Kolkata',
  '🌟  4.9★ rating · Viman Nagar, Pune',
  '🚀  New outlet onboarded · Jaipur',
  '🔁  Repeat customer · Lajpat Nagar, Delhi',
  '💳  ₹1,240 order · Whitefield, Bengaluru',
  '🛡️  Quality check passed · Connaught Place',
  '📍  28 cities · 50,000+ garments/month',
  '💰  Network revenue milestone · ₹180Cr FY24',
  '🤝  Franchise renewal · Andheri, Mumbai',
];

export default function ActivityTicker() {
  const [events, setEvents] = useState(BASE_EVENTS);

  useEffect(() => {
    const t = setInterval(() => {
      const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Jaipur'];
      const services = ['Premium Wash', 'Dry Clean', 'Express Wash', 'Iron Only'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const svc  = services[Math.floor(Math.random() * services.length)];
      const amt  = Math.floor(200 + Math.random() * 1200);
      const event = `⚡  ₹${amt} · ${svc} · ${city}`;
      setEvents(prev => [event, ...prev.slice(0, 19)]);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Duplicate for seamless loop
  const doubled = [...events, ...events];

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-6"
      style={{
        background: 'rgba(10,15,30,0.7)',
        borderTop:    '1px solid rgba(6,182,212,0.2)',
        borderBottom: '1px solid rgba(6,182,212,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(6,182,212,0.15)',
      }}
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(10,15,30,0.95), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(10,15,30,0.95), transparent)' }} />

      {/* Label */}
      <div className="absolute left-4 top-0 bottom-0 z-20 flex items-center">
        <div className="flex items-center gap-1.5 pr-3"
          style={{ borderRight: '1px solid rgba(6,182,212,0.2)' }}>
          <span className="live-dot-cyan" style={{ width: 6, height: 6 }} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest"
            style={{ color: '#22D3EE' }}>
            Live
          </span>
        </div>
      </div>

      <div className="pl-24 py-2.5 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: [0, `-${100 / 2}%`] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((event, i) => (
            <span
              key={i}
              className="text-xs text-slate-500 flex-shrink-0"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {event}
              <span className="mx-4" style={{ color: 'rgba(6,182,212,0.3)' }}>·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
