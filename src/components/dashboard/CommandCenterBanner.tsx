'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, Globe, Zap } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface Props {
  locationCount: number;
  lastRefresh: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const STATUS_ITEMS = [
  { label: 'SYSTEM',   value: 'ONLINE',    color: '#00FF88' },
  { label: 'FEED',     value: 'LIVE',      color: '#00FFEA' },
  { label: 'SYNC',     value: '30s',       color: '#22D3EE' },
  { label: 'COVERAGE', value: 'PAN-INDIA', color: '#818CF8' },
];

export default function CommandCenterBanner({ locationCount, lastRefresh, isRefreshing, onRefresh }: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8"
      style={{
        background: 'linear-gradient(180deg, rgba(6,182,212,0.06) 0%, rgba(10,15,30,0) 100%)',
        border: '1px solid rgba(6,182,212,0.15)',
        boxShadow: '0 0 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(6,182,212,0.3)',
      }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 30%, rgba(0,255,234,0.8) 50%, rgba(6,182,212,0.6) 70%, transparent 100%)',
          boxShadow: '0 0 12px rgba(6,182,212,0.6)',
        }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner accents */}
      {[
        'top-0 left-0 border-t border-l',
        'top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l',
        'bottom-0 right-0 border-b border-r',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${cls}`}
          style={{ borderColor: 'rgba(6,182,212,0.6)' }}
        />
      ))}

      <div className="relative z-10 px-6 py-5 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Left: title block */}
          <div className="flex items-center gap-4">
            {/* Radar icon */}
            <div className="relative flex-shrink-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  boxShadow: '0 0 20px rgba(6,182,212,0.15)',
                }}
              >
                <Globe className="w-6 h-6" style={{ color: '#22D3EE' }} />
              </div>
              {/* Radar ring */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: '1px solid rgba(6,182,212,0.5)' }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="live-dot-cyan" />
                <span className="cmd-tag">UClean · Command Center · Live</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-50 tracking-tight leading-tight">
                Network{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #22D3EE 0%, #818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Operations Dashboard
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {locationCount} nodes active · Refreshed {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Right: live KPI strip + refresh */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mini KPIs */}
            <div className="flex items-center gap-1 divide-x divide-slate-700/60">
              {[
                { icon: Zap,      label: 'Orders/hr',  value: 847,  suffix: '', color: '#22D3EE', decimals: 0 },
                { icon: Activity, label: 'Uptime',      value: 99.9, suffix: '%', color: '#00FF88', decimals: 1 },
                { icon: Cpu,      label: 'Nodes',       value: locationCount, suffix: '', color: '#818CF8', decimals: 0 },
              ].map(({ icon: Icon, label, value, suffix, color, decimals }, i) => (
                <div key={i} className="flex items-center gap-2 px-3 first:pl-0">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                  <div>
                    <div className="num text-sm font-bold" style={{ color }}>
                      <AnimatedCounter value={value} suffix={suffix} decimals={decimals} duration={2} className="" />
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium uppercase tracking-wide">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40"
              style={{
                background: 'rgba(6,182,212,0.06)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: '#22D3EE',
              }}
            >
              <Activity className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-slate-800/60 flex-wrap">
          {STATUS_ITEMS.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">{label}</span>
              <span
                className="text-[10px] font-bold font-mono uppercase"
                style={{ color, textShadow: `0 0 8px ${color}60` }}
              >
                {value}
              </span>
            </div>
          ))}
          {/* Divider */}
          <div className="flex-1 hidden md:block" />
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-slate-600">
            <span style={{ color: 'rgba(6,182,212,0.5)' }}>{'>'}</span>
            <span>pan_india.network.connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
