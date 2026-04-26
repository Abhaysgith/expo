'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

// ── ROI tiers ─────────────────────────────────────────────
const TIERS = {
  metro: {
    label: 'Metro City',
    examples: 'Delhi · Mumbai · Bengaluru',
    investment: 1_500_000,
    avgOrderValue: 380,
    monthlyOpEx: 42_000,
    color: '#22D3EE',
  },
  tier2: {
    label: 'Tier-2 City',
    examples: 'Jaipur · Pune · Chandigarh',
    investment: 1_100_000,
    avgOrderValue: 290,
    monthlyOpEx: 28_000,
    color: '#818CF8',
  },
  tier3: {
    label: 'Tier-3 City',
    examples: 'Agra · Mysore · Jodhpur',
    investment: 800_000,
    avgOrderValue: 220,
    monthlyOpEx: 18_000,
    color: '#10B981',
  },
} as const;

type TierKey = keyof typeof TIERS;

function fmt(n: number): string {
  if (n >= 10_00_000) return `₹${(n / 10_00_000).toFixed(1)}L`;
  if (n >= 1_000)     return `₹${Math.round(n / 1_000)}K`;
  return `₹${n}`;
}

interface Lead {
  city: string;
  tier: TierKey;
  monthlyOrders: number;
  ts: number;
}

export default function FranchiseCTA() {
  const [tier, setTier]               = useState<TierKey>('metro');
  const [dailyOrders, setDailyOrders] = useState(20);
  const [city, setCity]               = useState('');
  const [phone, setPhone]             = useState('');
  const [submitted, setSubmitted]     = useState(false);

  const t = TIERS[tier];

  const roi = useMemo(() => {
    const monthlyOrders  = dailyOrders * 30;
    const monthlyRevenue = monthlyOrders * t.avgOrderValue;
    const monthlyProfit  = monthlyRevenue - t.monthlyOpEx;
    const breakevenMonths = Math.ceil(t.investment / Math.max(monthlyProfit, 1));
    const yearOneProfit  = monthlyProfit * 12 - t.investment;
    const roiPct         = Math.round((yearOneProfit / t.investment) * 100);

    return { monthlyOrders, monthlyRevenue, monthlyProfit, breakevenMonths, yearOneProfit, roiPct };
  }, [tier, dailyOrders, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !phone.trim()) return;

    const lead: Lead = {
      city: city.trim(),
      tier,
      monthlyOrders: roi.monthlyOrders,
      ts: Date.now(),
    };

    try {
      const existing: Lead[] = JSON.parse(localStorage.getItem('uclean-expo-leads') ?? '[]');
      localStorage.setItem('uclean-expo-leads', JSON.stringify([lead, ...existing].slice(0, 200)));
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCity('');
      setPhone('');
    }, 5000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* ── Left: Calculator ── */}
      <div className="flex-1 space-y-5">
        {/* Tier selector */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono mb-2">City Type</p>
          <div className="flex gap-2">
            {(Object.keys(TIERS) as TierKey[]).map(k => (
              <button
                key={k}
                onClick={() => setTier(k)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200"
                style={{
                  background: tier === k ? `${TIERS[k].color}18` : 'rgba(20,30,55,0.5)',
                  border:     `1px solid ${tier === k ? TIERS[k].color + '50' : 'rgba(71,85,105,0.3)'}`,
                  color:      tier === k ? TIERS[k].color : '#64748B',
                  boxShadow:  tier === k ? `0 0 16px ${TIERS[k].color}20` : 'none',
                }}
              >
                {TIERS[k].label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 font-mono mt-1.5">{t.examples}</p>
        </div>

        {/* Daily orders slider */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Daily Orders</p>
            <span className="text-sm font-black num" style={{ color: t.color }}>{dailyOrders} orders/day</span>
          </div>
          <input
            type="range"
            min={8} max={60} step={1}
            value={dailyOrders}
            onChange={e => setDailyOrders(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: t.color }}
          />
          <div className="flex justify-between text-[10px] text-slate-700 font-mono mt-1">
            <span>8/day</span><span>60/day</span>
          </div>
        </div>

        {/* Result grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Monthly Revenue', value: fmt(roi.monthlyRevenue), icon: DollarSign, color: t.color },
            { label: 'Monthly Profit',  value: fmt(roi.monthlyProfit),  icon: TrendingUp, color: '#10B981' },
            { label: 'Breakeven',       value: `${roi.breakevenMonths}mo`,   icon: Clock,      color: '#F59E0B' },
            { label: 'Year-1 ROI',      value: `${roi.roiPct}%`,        icon: Zap,        color: '#818CF8' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
              className="rounded-xl p-3"
              style={{
                background: `${color}08`,
                border: `1px solid ${color}25`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3 h-3" style={{ color }} />
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">{label}</span>
              </div>
              <p className="text-xl font-black num" style={{ color, textShadow: `0 0 16px ${color}50` }}>
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Investment note */}
        <div className="rounded-xl px-3 py-2.5 text-xs"
          style={{ background: 'rgba(20,30,55,0.5)', border: '1px solid rgba(6,182,212,0.1)' }}>
          <span className="text-slate-500 font-mono">Total investment: </span>
          <span className="font-black" style={{ color: t.color }}>{fmt(t.investment)}</span>
          <span className="text-slate-600 font-mono"> · Avg order value: ₹{t.avgOrderValue}</span>
        </div>
      </div>

      {/* ── Right: Lead form ── */}
      <div
        className="lg:w-72 rounded-2xl p-5 flex flex-col"
        style={{
          background: 'rgba(8,13,28,0.85)',
          border: '1px solid rgba(6,182,212,0.15)',
          boxShadow: '0 0 40px rgba(6,182,212,0.06)',
        }}
      >
        {/* Top shimmer */}
        <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="w-14 h-14" style={{ color: '#10B981' }} />
              </motion.div>
              <div>
                <p className="text-lg font-black" style={{ color: '#10B981' }}>Request Received!</p>
                <p className="text-xs text-slate-500 mt-1.5 font-mono leading-relaxed">
                  Our franchise expert will call you within 24 hours.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-2 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                {city} · {TIERS[tier].label} · {roi.monthlyOrders} orders/mo
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-4"
            >
              <div>
                <p className="text-base font-black text-slate-100 leading-tight">
                  Start Your Own
                </p>
                <p className="text-base font-black leading-tight" style={{
                  background: 'linear-gradient(135deg, #22D3EE, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  UClean Store
                </p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  No franchise fee call needed. Just 2 fields.
                </p>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1.5">
                    Your City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Jaipur, Pune..."
                    required
                    className="input-premium text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1.5">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="input-premium text-sm"
                  />
                </div>
              </div>

              {/* Projected metric teaser */}
              <div className="rounded-xl p-3 text-center"
                style={{ background: `${t.color}08`, border: `1px solid ${t.color}20` }}>
                <p className="text-[10px] text-slate-500 font-mono mb-0.5">Your projected profit</p>
                <p className="text-2xl font-black num" style={{ color: t.color }}>
                  {fmt(roi.monthlyProfit)}/mo
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 btn-glow"
              >
                Get Franchise Details
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-700 text-center font-mono">
                No spam. Our team calls once, personally.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
