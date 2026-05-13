'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import type { FranchiseLocation } from '@/lib/dataLoader';
import { generateRevenueTrend, formatINR } from '@/lib/dataLoader';

// Custom Recharts tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 min-w-[130px]">
      <p className="text-xs text-green-400 font-semibold mb-2">{label}</p>
      <p className="text-lg font-bold text-slate-50 num">{formatINR(payload[0].value)}</p>
      <p className="text-xs text-slate-500">daily revenue</p>
    </div>
  );
}

export default function RevenueChart({ locations }: { locations: FranchiseLocation[] }) {
  const data = generateRevenueTrend(locations);
  const peak = Math.max(...data.map(d => d.revenue));
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10">
            <BarChart2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Revenue Trend</h3>
            <p className="text-xs text-slate-500">Last 7 days — all 28 locations</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <TrendingUp className="w-3 h-3" />
          +22% vs last week
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#16A34A" stopOpacity={0.4} />
                <stop offset="50%"  stopColor="#16A34A" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(51, 65, 85, 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatINR(v)}
              width={62}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6,182,212,0.2)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#16A34A"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: '#16A34A',
                stroke: 'rgba(6,182,212,0.3)',
                strokeWidth: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/60">
        {[
          { label: 'Peak Day', value: 'Saturday', sub: formatINR(peak) },
          { label: '7-Day Total', value: formatINR(total), sub: 'all locations' },
          { label: 'Daily Avg', value: formatINR(Math.round(total / 7)), sub: 'per day' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="text-center">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-100 num">{value}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
