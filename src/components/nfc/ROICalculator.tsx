'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, ArrowRight, IndianRupee } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { loadROIData, formatINR } from '@/lib/dataLoader';
import type { ROITier } from '@/lib/dataLoader';

type TierKey = 'tier1' | 'tier2' | 'tier3';

const TIER_CONFIG: Record<TierKey, { label: string; tag: string; color: string; border: string }> = {
  tier1: { label: 'Metro City', tag: 'Mumbai, Delhi, Bangalore', color: 'text-cyan-400', border: 'border-cyan-500/50' },
  tier2: { label: 'Tier 2 City', tag: 'Jaipur, Indore, Surat', color: 'text-violet-400', border: 'border-violet-500/50' },
  tier3: { label: 'Tier 3 City', tag: 'Agra, Jodhpur, Mysuru', color: 'text-emerald-400', border: 'border-emerald-500/50' },
};

export default function ROICalculator() {
  const [tiers, setTiers] = useState<Record<string, ROITier> | null>(null);
  const [selected, setSelected] = useState<TierKey>('tier1');
  const [months, setMonths] = useState(24);

  useEffect(() => {
    loadROIData().then(d => setTiers(d.tiers)).catch(console.error);
  }, []);

  if (!tiers) {
    return (
      <div className="glass-card p-8 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-40 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const tier = tiers[selected];
  const monthlyProfit = tier.revenueMetrics.expectedMonthlyProfit;
  const investment = tier.investmentBreakdown.total;
  const projected = monthlyProfit * months;
  const net = projected - investment;

  return (
    <GlassCard className="p-6 md:p-8" topGlow>
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <Calculator className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-50">ROI Calculator</h3>
          <p className="text-sm text-slate-500">See your real return before you invest</p>
        </div>
      </div>

      {/* City tier selector */}
      <div className="mb-7">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Your City Type</p>
        <div className="grid grid-cols-3 gap-2.5">
          {(Object.entries(TIER_CONFIG) as [TierKey, typeof TIER_CONFIG.tier1][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={[
                'p-3 rounded-xl border text-left transition-all duration-250',
                selected === key
                  ? `bg-slate-800 ${cfg.border} shadow-glow-sm`
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600',
              ].join(' ')}
            >
              <p className={`text-xs font-bold ${selected === key ? cfg.color : 'text-slate-400'}`}>{cfg.label}</p>
              <p className="text-[10px] text-slate-600 mt-0.5 truncate">{cfg.tag}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Time slider */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projection Period</p>
          <span className="text-sm font-bold text-cyan-400 num">{months} months</span>
        </div>
        <input
          type="range" min={6} max={60} step={6}
          value={months} onChange={e => setMonths(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: '#06B6D4' }}
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>6 mo</span><span>2 yr</span><span>5 yr</span>
        </div>
      </div>

      {/* Result cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selected}-${months}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {[
            { label: 'Total Investment', value: investment / 100000, suffix: 'L', color: 'text-amber-400', bg: 'bg-amber-500/8', sub: 'one-time setup cost' },
            { label: 'Monthly Profit', value: monthlyProfit / 1000, suffix: 'K', color: 'text-emerald-400', bg: 'bg-emerald-500/8', sub: `${tier.revenueMetrics.profitMargin}% net margin` },
            { label: `${months}M Earnings`, value: projected / 100000, suffix: 'L', color: 'text-cyan-400', bg: 'bg-cyan-500/8', sub: `over ${months} months` },
            { label: 'Net ROI', value: net > 0 ? net / 100000 : 0, suffix: net > 0 ? 'L' : '', color: net > 0 ? 'text-yellow-400' : 'text-slate-500', bg: 'bg-yellow-500/8', sub: net > 0 ? 'after investment recovery' : `breakeven ~${tier.revenueMetrics.roiMonths}mo` },
          ].map(({ label, value, suffix, color, bg, sub }) => (
            <div key={label} className={`${bg} border border-slate-700/40 rounded-2xl p-4`}>
              <p className="text-xs text-slate-500 mb-1.5">{label}</p>
              <p className={`text-xl font-bold num ${color}`}>
                {value > 0 ? `₹` : ''}<AnimatedCounter value={value} decimals={1} suffix={suffix} className="text-xl font-bold" />
              </p>
              <p className="text-[11px] text-slate-600 mt-1">{sub}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Breakeven callout */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 mb-6">
        <div className="p-2 rounded-xl bg-emerald-500/15 flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">
            Break-even at <span className="text-emerald-400 num">{tier.revenueMetrics.roiMonths} months</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Avg {tier.revenueMetrics.expectedMonthlyOrders.toLocaleString()} orders/mo · ₹{tier.revenueMetrics.avgOrderValue} avg order value
          </p>
        </div>
      </div>

      {/* Investment breakdown */}
      <div>
        <p className="text-xs text-slate-600 uppercase tracking-wider mb-3 font-semibold">Investment Breakdown</p>
        <div className="space-y-2">
          {[
            ['Franchise Fee', tier.investmentBreakdown.franchiseFee],
            ['Equipment', tier.investmentBreakdown.equipmentCost],
            ['Interior Setup', tier.investmentBreakdown.interiorSetup],
            ['Working Capital', tier.investmentBreakdown.workingCapital],
            ['Miscellaneous', tier.investmentBreakdown.miscellaneous],
          ].map(([label, amount]) => (
            <div key={label as string} className="flex justify-between items-center text-sm py-1">
              <span className="text-slate-500">{label as string}</span>
              <span className="text-slate-300 font-medium num">{formatINR(amount as number)}</span>
            </div>
          ))}
          <div className="divider-gradient my-2" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-200">Total Investment</span>
            <span className="font-bold text-cyan-400 num text-lg">{formatINR(tier.investmentBreakdown.total)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
