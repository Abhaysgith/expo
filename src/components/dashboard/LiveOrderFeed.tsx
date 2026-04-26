'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Circle } from 'lucide-react';
import type { LiveOrder } from '@/lib/dataLoader';
import { pickRandom } from '@/lib/dataLoader';

const SERVICE_ICONS: Record<string, string> = {
  'Premium Wash': '🫧',
  'Dry Clean': '👔',
  'Iron Only': '♨️',
  'Express Wash': '⚡',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  processing: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  pickup:     { bg: 'bg-blue-500/10',   text: 'text-blue-400',   dot: 'bg-blue-400'   },
  delivered:  { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400' },
};

interface FeedOrder extends LiveOrder { _key: string; _ts: number }

export default function LiveOrderFeed({ allOrders }: { allOrders: LiveOrder[] }) {
  const [feed, setFeed] = useState<FeedOrder[]>([]);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!allOrders.length) return;
    const seed = pickRandom(allOrders, 6).map((o, i) => ({ ...o, _key: `s${i}`, _ts: Date.now() - i * 12000 }));
    setFeed(seed);
  }, [allOrders]);

  useEffect(() => {
    if (!allOrders.length) return;
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000;
      timerRef.current = setTimeout(() => {
        const [o] = pickRandom(allOrders, 1);
        const statuses = ['pickup', 'processing', 'completed', 'delivered'];
        setFeed(prev => [
          {
            ...o,
            orderId: `UCO-${8000 + Math.floor(Math.random() * 999)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            amount: Math.floor(180 + Math.random() * 900),
            _key: `live-${Date.now()}`,
            _ts: Date.now(),
          },
          ...prev,
        ].slice(0, 8));
        setTick(t => t + 1);
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [allOrders]);

  const age = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col" style={{ minHeight: 420 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Live Order Feed</h3>
            <p className="text-xs text-slate-500">Updates every 8–12 seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
        <AnimatePresence initial={false}>
          {feed.map((order) => {
            const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.processing;
            return (
              <motion.div
                key={order._key}
                initial={{ opacity: 0, x: 24, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -24, height: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-700/50 bg-slate-900/50 hover:border-cyan-500/20 hover:bg-slate-900/80 transition-all duration-200 group">
                  {/* Left: service icon */}
                  <div className="text-xl flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800">
                    {SERVICE_ICONS[order.serviceType] ?? '🧺'}
                  </div>

                  {/* Middle: details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-mono text-cyan-400 font-medium">{order.orderId}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium truncate">
                      {order.city} · {order.serviceType}
                    </p>
                  </div>

                  {/* Right: amount + status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-50 num">₹{order.amount}</p>
                    <span className={`inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {order.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Ticker */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 overflow-hidden">
        <motion.p
          className="text-[11px] text-slate-600 whitespace-nowrap"
          animate={{ x: ['100%', '-200%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          🔴 LIVE &nbsp;·&nbsp; Orders across 28 Indian cities &nbsp;·&nbsp; Premium Wash · Dry Clean · Express Wash &nbsp;·&nbsp; 50,000+ satisfied customers &nbsp;·&nbsp;
        </motion.p>
      </div>
    </div>
  );
}
