'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import type { FranchiseLocation } from '@/lib/dataLoader';
import { formatINR } from '@/lib/dataLoader';

const MEDAL_COLORS = [
  { bg: 'from-yellow-400/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', emoji: '🥇' },
  { bg: 'from-slate-400/20 to-slate-600/10',  border: 'border-slate-400/30',  text: 'text-slate-300',  emoji: '🥈' },
  { bg: 'from-amber-600/20 to-amber-800/10',  border: 'border-amber-600/30',  text: 'text-amber-600',  emoji: '🥉' },
  { bg: 'from-slate-700/20 to-slate-800/10',  border: 'border-slate-600/30',  text: 'text-slate-400',  emoji: '4' },
  { bg: 'from-slate-700/20 to-slate-800/10',  border: 'border-slate-600/30',  text: 'text-slate-400',  emoji: '5' },
];

const TIER_CHIP: Record<number, string> = {
  1: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  2: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  3: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
};

export default function Leaderboard({ locations }: { locations: FranchiseLocation[] }) {
  const top5 = [...locations].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).slice(0, 5);
  const maxRev = top5[0]?.monthlyRevenue ?? 1;

  return (
    <GlassCard className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Top Performers</h3>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {top5.map((loc, idx) => {
          const medal = MEDAL_COLORS[idx];
          const pct = (loc.monthlyRevenue / maxRev) * 100;
          return (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, type: 'spring', stiffness: 250, damping: 22 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-1.5">
                {/* Rank medal */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${medal.bg} border ${medal.border} flex items-center justify-center flex-shrink-0`}>
                  {idx < 3 ? (
                    <span className="text-base leading-none">{medal.emoji}</span>
                  ) : (
                    <span className={`text-xs font-bold ${medal.text}`}>{medal.emoji}</span>
                  )}
                </div>

                {/* City + owner */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-semibold text-slate-100">{loc.city}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-medium ${TIER_CHIP[loc.tier]}`}>
                      T{loc.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{loc.area} · {loc.owner}</p>
                </div>

                {/* Revenue */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-50 num">{formatINR(loc.monthlyRevenue)}</p>
                  <p className="text-[11px] text-slate-500 num">{loc.monthlyOrders.toLocaleString()} orders</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="ml-11 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: idx * 0.07 + 0.3, duration: 0.9, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                />
              </div>

              {/* Stars */}
              <div className="ml-11 mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className={s < Math.round(loc.rating) ? 'text-amber-400' : 'text-slate-700'} style={{ fontSize: 10 }}>★</span>
                ))}
                <span className="text-[10px] text-slate-600 ml-0.5">{loc.rating.toFixed(1)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        All top stores grew 10%+ vs last month
      </div>
    </GlassCard>
  );
}
