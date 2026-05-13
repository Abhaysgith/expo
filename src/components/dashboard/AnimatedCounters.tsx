'use client';

import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Star, MapPin, ArrowUpRight } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import type { FranchiseLocation } from '@/lib/dataLoader';
import { formatINR } from '@/lib/dataLoader';

interface Props { locations: FranchiseLocation[] }

const CARDS = (locations: FranchiseLocation[]) => {
  const totalRevenue = locations.reduce((s, l) => s + l.monthlyRevenue, 0);
  const totalOrders  = locations.reduce((s, l) => s + l.monthlyOrders,  0);
  const avgRating    = locations.length > 0
    ? locations.reduce((s, l) => s + l.rating, 0) / locations.length
    : 0;

  return [
    {
      label: 'Monthly Network Revenue',
      value: totalRevenue / 100000,
      prefix: '₹', suffix: 'L', decimals: 1,
      icon: TrendingUp,
      color: '#22C55E',
      glow: 'rgba(34,211,238,0.35)',
      glowSoft: 'rgba(34,211,238,0.08)',
      trend: '+18.4%', sub: 'across all locations',
    },
    {
      label: 'Monthly Orders',
      value: totalOrders,
      prefix: '', suffix: '+', decimals: 0,
      icon: ShoppingBag,
      color: '#818CF8',
      glow: 'rgba(129,140,248,0.35)',
      glowSoft: 'rgba(129,140,248,0.08)',
      trend: '+12.1%', sub: 'wash · dry · iron',
    },
    {
      label: 'Network Avg Rating',
      value: avgRating,
      prefix: '', suffix: ' ★', decimals: 1,
      icon: Star,
      color: '#F59E0B',
      glow: 'rgba(245,158,11,0.35)',
      glowSoft: 'rgba(245,158,11,0.08)',
      trend: '+0.2', sub: 'verified reviews',
    },
    {
      label: 'Active Locations',
      value: locations.length,
      prefix: '', suffix: '', decimals: 0,
      icon: MapPin,
      color: '#10B981',
      glow: 'rgba(16,185,129,0.35)',
      glowSoft: 'rgba(16,185,129,0.08)',
      trend: '3 new Q2', sub: 'global cities',
    },
  ];
};

export default function AnimatedCounters({ locations }: Props) {
  const cards = CARDS(locations);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, prefix, suffix, decimals, icon: Icon, color, glow, glowSoft, trend, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl p-5 group cursor-default"
          style={{
            background: 'rgba(12,20,42,0.72)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${color}18`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 ${color}10`,
            transition: 'box-shadow 0.4s, border-color 0.4s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 40px ${color}15, inset 0 1px 0 ${color}20`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${color}18`;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 ${color}10`;
          }}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

          {/* Radial glow overlay on hover */}
          <div
            className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${glowSoft}, transparent 70%)`,
              transition: 'opacity 0.5s',
            }}
          />

          {/* Corner accent */}
          <div
            className="absolute top-3 right-3 w-4 h-4"
            style={{
              borderTop: `1px solid ${color}40`,
              borderRight: `1px solid ${color}40`,
            }}
          />

          <div className="relative z-10">
            {/* Icon + trend */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: `${color}0F`,
                  border: `1px solid ${color}25`,
                  boxShadow: `0 0 12px ${color}15`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}
              >
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </div>
            </div>

            {/* Value */}
            <div className="mb-1.5">
              <span style={{ color, textShadow: `0 0 20px ${glow}` }}>
                <AnimatedCounter
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                  duration={2.0 + i * 0.15}
                  className="text-3xl font-black num"
                />
              </span>
            </div>

            {/* Label */}
            <p className="text-xs font-bold text-slate-300 mb-0.5 uppercase tracking-wide">{label}</p>
            <p className="text-[11px] text-slate-600 font-mono">{sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
