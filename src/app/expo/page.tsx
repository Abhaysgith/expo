'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, ChevronLeft, ChevronRight,
  Globe, Zap, Star, TrendingUp, Users, Store,
  Droplets, Settings, Truck, Scan, CheckCircle2, ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { useSimulationEngine }       from '@/hooks/useSimulationEngine';
import { useDemoLoop, DEMO_SLIDES }  from '@/hooks/useDemoLoop';
import { useAttentionSpike }         from '@/hooks/useAttentionSpike';
import GlobalMap                     from '@/components/expo/GlobalMap';
import EnterpriseTrustBar            from '@/components/expo/EnterpriseTrustBar';
import FranchiseCTA                  from '@/components/expo/FranchiseCTA';
import AnimatedCounter               from '@/components/ui/AnimatedCounter';
import EntryStrip                    from '@/components/expo/EntryStrip';
import OfflineSyncProvider           from '@/components/sales/OfflineSyncProvider';

// ─── Helpers ──────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 10_00_000)   return `₹${(n / 10_00_000).toFixed(1)}L`;
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

// ─── Background ───────────────────────────────────────────
const PARTICLE_LIST = Array.from({ length: 20 }, (_, i) => ({
  id: i, size: (i % 3) + 1.5,
  x: `${(i * 37 + 13) % 100}%`,
  y: `${(i * 53 + 7) % 100}%`,
  color: i % 4 === 0 ? '#22C55E' : i % 4 === 1 ? '#818CF8' : i % 4 === 2 ? '#10B981' : '#4ADE80',
  opacity: 0.06 + (i % 6) * 0.02,
  dur: 7 + (i % 7),
  delay: (i * 0.6) % 6,
}));

function BgLayer() {
  return (
    <>
      <div className="fixed inset-0 bg-command pointer-events-none" />
      <div className="fixed inset-0 circuit-bg opacity-15 pointer-events-none"
        style={{ animation: 'gridMove 14s linear infinite' }} />
      <div className="fixed inset-0 grid-dots opacity-25 pointer-events-none" />
      {PARTICLE_LIST.map(({ id, size, x, y, color, opacity, dur, delay }) => (
        <div key={id} className="fixed rounded-full pointer-events-none"
          style={{ width: size, height: size, left: x, top: y, background: color, opacity,
            animation: `particle ${dur}s ease-in-out ${delay}s infinite` }} />
      ))}
      {/* Horizontal scan beam — toned down */}
      <motion.div
        className="fixed left-0 right-0 h-[1px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(22,163,74,0.25) 30%, rgba(34,197,94,0.38) 50%, rgba(22,163,74,0.25) 70%, transparent 100%)',
          boxShadow: '0 0 8px rgba(22,163,74,0.20)',
        }}
        animate={{ top: ['-1%', '101%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
      />
    </>
  );
}

// ─── Nav bar ──────────────────────────────────────────────
function ExpoNav({
  currentIndex, total, progress, isPlaying, isLight,
  onPrev, onNext, onToggle, onGoTo,
}: {
  currentIndex: number; total: number; progress: number;
  isPlaying: boolean; isLight: boolean;
  onPrev: () => void; onNext: () => void; onToggle: () => void;
  onGoTo: (i: number) => void;
}) {
  const labels = ['HERO', 'METRICS', 'PROCESS', 'MAP', 'CLIENTS', 'FRANCHISE'];
  return (
    <motion.div
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl max-w-[95vw] overflow-x-auto scrollbar-hide"
      animate={isLight
        ? { background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(22,163,74,0.20)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
        : { background: 'rgba(8,13,28,0.94)', borderColor: 'rgba(22,163,74,0.18)', boxShadow: '0 0 24px rgba(22,163,74,0.06)' }
      }
      transition={{ duration: 0.6 }}
      style={{ backdropFilter: 'blur(24px)', border: '1px solid rgba(22,163,74,0.18)' }}
    >
      <button onClick={onPrev} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}>
        <ChevronLeft className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>

      {/* Slide dots */}
      {labels.map((lbl, i) => (
        <button
          key={i}
          onClick={() => onGoTo(i)}
          className="flex flex-col items-center gap-1 group"
        >
          <span className={`hidden sm:block text-[9px] sm:text-xs font-bold font-mono uppercase tracking-wider transition-colors ${
            i === currentIndex
              ? 'text-green-500'
              : isLight ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-700 group-hover:text-slate-500'
          }`}>
            {lbl}
          </span>
          <div className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === currentIndex ? 28 : 16, background: 'rgba(71,85,105,0.5)' }}>
            {i === currentIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)', width: `${progress}%` }}
              />
            )}
            {i !== currentIndex && i < currentIndex && (
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(22,163,74,0.35)' }} />
            )}
          </div>
        </button>
      ))}

      <button onClick={onNext} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}>
        <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>
      <div className={`w-px h-5 mx-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
      <button onClick={onToggle} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}>
        {isPlaying
          ? <Pause className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          : <Play  className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
        }
      </button>
    </motion.div>
  );
}

// ─── Slide wrapper — smooth scale+blur (no harsh Y jump) ──
const slideVariants = {
  enter:  { opacity: 0, scale: 0.985, filter: 'blur(6px)' },
  center: { opacity: 1, scale: 1,     filter: 'blur(0px)', transition: { duration: 0.70, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 1.008, filter: 'blur(4px)', transition: { duration: 0.50, ease: [0.4, 0, 0.2, 1] } },
};

// ─── Light / dark slide map ────────────────────────────────
const LIGHT_SLIDES = new Set(['hero', 'enterprise', 'franchise']);

// ─── Freshness bubbles (brand slides only) ─────────────────
const FRESHNESS_BUBBLES = [
  { id:0, size:5,  left:'7%',  delay:0,    dur:18, opacity:0.07 },
  { id:1, size:3,  left:'15%', delay:3,    dur:22, opacity:0.05 },
  { id:2, size:7,  left:'26%', delay:1.5,  dur:20, opacity:0.06 },
  { id:3, size:4,  left:'38%', delay:5,    dur:16, opacity:0.05 },
  { id:4, size:6,  left:'52%', delay:2.5,  dur:24, opacity:0.07 },
  { id:5, size:3,  left:'63%', delay:7,    dur:19, opacity:0.05 },
  { id:6, size:5,  left:'75%', delay:4,    dur:21, opacity:0.06 },
  { id:7, size:4,  left:'87%', delay:1,    dur:17, opacity:0.05 },
  { id:8, size:8,  left:'44%', delay:9,    dur:25, opacity:0.04 },
  { id:9, size:3,  left:'92%', delay:6,    dur:20, opacity:0.05 },
];

function FreshnessLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {FRESHNESS_BUBBLES.map(({ id, size, left, delay, dur, opacity }) => (
        <div
          key={id}
          className="freshness-bubble"
          style={{
            width: size,
            height: size,
            left,
            bottom: 0,
            opacity,
            background: id % 3 === 0
              ? 'rgba(22,163,74,0.5)'
              : id % 3 === 1
              ? 'rgba(255,255,255,0.7)'
              : 'rgba(74,222,128,0.4)',
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────
function SLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  if (light) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
        style={{ background: 'rgba(22,163,74,0.10)', border: '1px solid rgba(22,163,74,0.28)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#16A34A' }} />
        <span className="text-xl font-bold uppercase tracking-[0.18em]" style={{ color: '#15803D' }}>{children}</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.22)', boxShadow: '0 0 12px rgba(22,163,74,0.06)' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E', boxShadow: '0 0 5px rgba(34,197,94,0.7)' }} />
      <span className="text-xl font-bold uppercase tracking-[0.18em]" style={{ color: '#22C55E' }}>{children}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 1 — HERO
// ══════════════════════════════════════════════════════════
function SlideHero({ latestEvent }: { latestEvent: { text: string; color: string } | null }) {
  return (
    <div className="flex flex-col items-center justify-start h-full text-center px-6 py-6 relative overflow-y-auto"
      style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FFFFFF 55%, #DCFCE7 100%)' }}>

      {/* Ambient freshness bubbles */}
      <FreshnessLayer />

      {/* Subtle corner accents */}
      {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r',
        'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c, i) => (
        <div key={i} className={`absolute ${c} w-8 h-8`}
          style={{ borderColor: 'rgba(22,163,74,0.20)', zIndex: 2 }} />
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="mb-3 relative z-10"
      >
        <Image src="/uclean-logo.png" alt="UClean" width={180} height={46} style={{ objectFit: 'contain' }} priority />
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="mb-2 relative z-10"
      >
        <h1 className="font-black leading-tight tracking-tight text-slate-800"
          style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}>
          Global Leaders in{' '}
          <span style={{
            background: 'linear-gradient(120deg, #15803D, #16A34A, #22C55E)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Laundry & Dry Cleaning
          </span>
        </h1>
      </motion.div>

      {/* ── BIG IMPACT MOMENT ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 my-4"
      >
        {/* Soft glow halo behind number */}
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(22,163,74,0.12) 0%, transparent 70%)',
            transform: 'scale(2.5)',
          }}
        />
        <p className="impact-number text-5xl sm:text-7xl md:text-8xl">
          3,000,000+
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-semibold tracking-widest uppercase mt-1 text-sm sm:text-xl md:text-2xl"
          style={{ letterSpacing: '0.18em', color: '#374151' }}
        >
          Garments Cared For Every Year
        </motion.p>
      </motion.div>

      {/* Key trust stats — 4 clean pills */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-wrap gap-2.5 justify-center relative z-10"
      >
        {[
          { v: '900+',  l: 'Stores',     c: '#16A34A' },
          { v: '10+',   l: 'Countries',  c: '#818CF8' },
          { v: '4.7★',  l: 'Rating',     c: '#F59E0B' },
          { v: '94%',   l: 'Renewal Rate', c: '#10B981' },
        ].map(({ v, l, c }) => (
          <div key={l}
            className="px-5 py-2.5 rounded-2xl bg-white text-center"
            style={{
              border: `1px solid ${c}22`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              minWidth: 80,
            }}
          >
            <p className="font-black num leading-none text-xl sm:text-2xl md:text-3xl" style={{ color: c }}>{v}</p>
            <p className="text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5" style={{ color: '#374151' }}>{l}</p>
          </div>
        ))}
      </motion.div>

      {/* Live event toast */}
      <div className="mt-3 h-9 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {latestEvent && (
            <motion.div
              key={latestEvent.text}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-2 rounded-full text-base font-semibold bg-white"
              style={{
                border: `1px solid ${latestEvent.color}20`,
                color: latestEvent.color,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                letterSpacing: '0.01em',
              }}
            >
              {latestEvent.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 2 — LIVE METRICS
// ══════════════════════════════════════════════════════════
function SlideMetrics({ metrics, liveEvents, tick }: {
  metrics: { ordersToday: number; revenueToday: number; activeStores: number; processingNow: number; customersServed: number; countriesOnline: number };
  liveEvents: Array<{ id: string; text: string; color: string; ts: number }>;
  tick: number;
}) {
  const spiking = useAttentionSpike(12000, 1200);
  const BIG = [
    { label: 'Orders Today',     value: metrics.ordersToday,   suffix: '',    color: '#22C55E', size: 'text-4xl sm:text-6xl md:text-8xl' },
    { label: 'Revenue Today',    value: null, raw: fmt(metrics.revenueToday), color: '#10B981', size: 'text-3xl sm:text-5xl md:text-7xl' },
    { label: 'Stores Active',    value: metrics.activeStores,  suffix: '+',   color: '#818CF8', size: 'text-4xl sm:text-6xl md:text-8xl' },
    { label: 'Processing Now',   value: metrics.processingNow, suffix: '',    color: '#F59E0B', size: 'text-3xl sm:text-5xl md:text-7xl' },
  ];

  return (
    <div className="flex flex-col h-full px-4 py-4">
      <div className="text-center mb-6 flex-shrink-0">
        <SLabel>Live Command Center</SLabel>
        <h2 className="font-black text-slate-50 leading-tight text-3xl sm:text-5xl md:text-7xl">
          Real-time Network{' '}
          <span style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Performance
          </span>
        </h2>
      </div>

      {/* Big metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
        {BIG.map(({ label, value, raw, color, size }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4 text-center relative overflow-hidden"
            style={{
              background: `${color}06`,
              border: `1px solid ${color}20`,
              boxShadow: spiking ? `0 0 32px ${color}38` : tick % (i + 2) === 0 ? `0 0 24px ${color}20` : 'none',
              transform: spiking ? 'scale(1.04)' : 'scale(1)',
              transition: 'box-shadow 0.6s, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
            <div className={`${size} font-black num leading-none mb-2`} style={{ color }}>
              {raw ?? (
                <AnimatedCounter value={value ?? 0} suffix={BIG[i]?.suffix ?? ''} decimals={0} duration={1.5} className="" />
              )}
            </div>
            <p className="text-[10px] sm:text-lg md:text-xl uppercase tracking-wide font-semibold font-mono mt-1" style={{ color: `${color}CC` }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live event feed */}
      <div className="live-feed-panel flex-1 min-h-0">
        <div className="live-feed-header">
          <span className="live-dot-green" style={{ width: 7, height: 7, flexShrink: 0 }} />
          <span className="text-xs sm:text-lg md:text-xl font-bold uppercase tracking-widest font-mono" style={{ color: '#4ADE80' }}>Live Activity Feed</span>
        </div>
        <div className="overflow-y-auto h-[calc(100%-40px)] divide-y divide-slate-800/40">
          <AnimatePresence initial={false}>
            {liveEvents.slice(0, 8).map(ev => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -16, height: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.color, boxShadow: `0 0 8px ${ev.color}` }} />
                <span className="text-xs sm:text-lg md:text-xl font-mono" style={{ color: ev.color }}>{ev.text}</span>
                <span className="ml-auto text-[10px] sm:text-base md:text-lg text-slate-400 font-mono flex-shrink-0">
                  {Math.floor((Date.now() - ev.ts) / 1000)}s ago
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 3 — AI PROCESS
// ══════════════════════════════════════════════════════════
const PROCESS_STEPS = [
  { icon: Scan,         label: 'PICKUP',   title: 'Pickup Scheduled',   detail: 'GPS-verified driver assigned',  color: '#22C55E' },
  { icon: Droplets,     label: 'CLEAN',    title: 'AI Cleaning Cycle',  detail: 'Optimal temp & time selected',  color: '#818CF8' },
  { icon: Settings,     label: 'QUALITY',  title: 'QC Inspection',      detail: 'Computer vision scan',          color: '#F59E0B' },
  { icon: CheckCircle2, label: 'PACK',     title: 'Eco-Pack & Seal',    detail: 'Biodegradable packaging',       color: '#10B981' },
  { icon: Truck,        label: 'DELIVER',  title: 'Express Delivery',   detail: 'Live GPS, 48–72h guaranteed',  color: '#F472B6' },
];

function SlideProcess() {
  const [active, setActive] = useState(0);
  const [orderId, setOrderId] = useState('UCO-8319');

  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % PROCESS_STEPS.length;
        if (next === 0) setOrderId(`UCO-${8300 + Math.floor(Math.random() * 200)}`);
        return next;
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const s = PROCESS_STEPS[active];

  return (
    <div className="flex flex-col items-center justify-start h-full px-6 py-6 overflow-y-auto">
      <SLabel>AI Laundry Pipeline</SLabel>
      <h2 className="font-black text-slate-50 text-center mb-2 text-2xl sm:text-5xl md:text-7xl">
        Every Order,{' '}
        <span style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Precision-Tracked
        </span>
      </h2>
      <p className="text-xl font-mono mb-5" style={{ color: '#9CA3AF' }}>Order ID: <span style={{ color: '#22C55E' }}>{orderId}</span></p>

      {/* Steps timeline */}
      <div className="flex items-center w-full max-w-3xl mb-5 gap-2">
        {PROCESS_STEPS.map((step, i) => {
          const isDone    = i < active;
          const isCurrent = i === active;
          return (
            <div key={step.label} className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: isCurrent ? `${step.color}18` : isDone ? 'rgba(16,185,129,0.1)' : 'rgba(20,30,55,0.5)',
                    border: `1.5px solid ${isCurrent ? step.color : isDone ? '#10B981' : 'rgba(71,85,105,0.3)'}`,
                    boxShadow: isCurrent ? `0 0 16px ${step.color}30` : 'none',
                  }}
                  animate={isCurrent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isCurrent ? Infinity : 0 }}
                >
                  {isDone
                    ? <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                    : <step.icon className="w-5 h-5" style={{ color: isCurrent ? step.color : '#475569' }} />
                  }
                  {isCurrent && (
                    <motion.div className="absolute inset-0 rounded-2xl"
                      style={{ border: `1.5px solid ${step.color}` }}
                      animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity }} />
                  )}
                </motion.div>
                <span className="text-[8px] sm:text-xs md:text-base font-bold uppercase tracking-wider"
                  style={{ color: isCurrent ? step.color : isDone ? '#10B981' : '#64748B' }}>
                  {step.label}
                </span>
              </div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 relative overflow-hidden rounded-full mx-1"
                  style={{ background: 'rgba(51,65,85,0.5)' }}>
                  {isDone && <div className="absolute inset-0" style={{ background: '#10B981' }} />}
                  {isCurrent && (
                    <motion.div className="absolute top-0 bottom-0 w-12"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
                      animate={{ x: ['-100%', '500%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step detail — big */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg rounded-2xl p-6 text-center"
          style={{
            background: `${s.color}06`,
            border: `1px solid ${s.color}30`,
            boxShadow: `0 0 40px ${s.color}12`,
          }}
        >
          <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
          <motion.div
            animate={{ rotate: s.label === 'QUALITY' ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="inline-flex mb-4"
          >
            <s.icon className="w-10 h-10" style={{ color: s.color }} />
          </motion.div>
          <p className="text-4xl font-black" style={{ color: s.color }}>{s.title}</p>
          <p className="text-xl mt-2 font-mono" style={{ color: '#9CA3AF' }}>{s.detail}</p>

          {/* Progress bar */}
          <div className="mt-5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(71,85,105,0.4)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
              initial={{ width: '0%' }} animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'linear' }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* USP pills */}
      <div className="flex flex-wrap gap-3 mt-5 justify-center">
        {[
          { v: '48–72h', l: 'Turnaround',     c: '#22C55E' },
          { v: 'Free',   l: 'Pickup/Delivery', c: '#10B981' },
          { v: 'Eco',    l: 'Low-Water',        c: '#34D399' },
          { v: 'ISO',    l: 'Certified',         c: '#818CF8' },
        ].map(({ v, l, c }) => (
          <div key={l} className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ background: `${c}0A`, border: `1px solid ${c}25` }}>
            <span className="font-black text-2xl" style={{ color: c }}>{v}</span>
            <span className="text-xl font-semibold" style={{ color: '#9CA3AF' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 4 — GLOBAL MAP
// ══════════════════════════════════════════════════════════
function SlideMap() {
  return (
    <div className="flex flex-col h-full px-4 py-4">
      <div className="text-center mb-4 flex-shrink-0">
        <SLabel>Global Presence</SLabel>
        <h2 className="font-black text-slate-50" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>
          UClean Worldwide —{' '}
          <span style={{ background: 'linear-gradient(135deg, #22C55E, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            10+ Countries
          </span>
        </h2>
      </div>
      <div className="flex-1 min-h-0">
        <GlobalMap autoHighlight />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 5 — ENTERPRISE CLIENTS
// ══════════════════════════════════════════════════════════
function SlideEnterprise() {
  const SERVICES = [
    { icon: '👔', name: 'Dry Cleaning',    desc: '48h turnaround' },
    { icon: '🧺', name: 'Wash & Fold',     desc: '₹79/kg onwards' },
    { icon: '♨️', name: 'Steam Press',    desc: 'Express 12h' },
    { icon: '✨', name: 'Premium Laundry', desc: 'White glove care' },
    { icon: '👟', name: 'Shoe Cleaning',   desc: 'Brand safe process' },
    { icon: '🌿', name: 'Eco Wash',        desc: '0.5L water / kg' },
  ];

  return (
    <div className="flex flex-col h-full px-4 py-4"
      style={{ background: 'linear-gradient(160deg, #F8FAFC 0%, #FFFFFF 60%, #F0FDF4 100%)' }}>
      <div className="text-center mb-6 flex-shrink-0">
        <SLabel light>Enterprise Clients</SLabel>
        <h2 className="font-black text-slate-800 text-2xl sm:text-5xl md:text-7xl">
          World&apos;s Most Trusted{' '}
          <span style={{ background: 'linear-gradient(135deg, #15803D, #22C55E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Laundry Partner
          </span>
        </h2>
      </div>

      {/* Trust bar */}
      <div className="mb-6 flex-shrink-0">
        <EnterpriseTrustBar />
      </div>

      {/* Services grid */}
      <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-3 content-start">
        {SERVICES.map(({ icon, name, desc }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="rounded-xl p-4 text-center bg-white"
            style={{ border: '1px solid rgba(22,163,74,0.12)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="text-xl sm:text-3xl mb-2">{icon}</div>
            <p className="text-[10px] sm:text-lg font-bold text-slate-700">{name}</p>
            <p className="text-[8px] sm:text-base font-medium mt-0.5" style={{ color: '#4B5563' }}>{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 flex-shrink-0">
        {[
          { v: '50K+',   l: 'Daily Garments',  c: '#16A34A' },
          { v: '250+',   l: 'Cities Served',   c: '#818CF8' },
          { v: '₹0',     l: 'Hidden Charges',  c: '#10B981' },
        ].map(({ v, l, c }) => (
          <div key={l} className="rounded-xl p-3 text-center bg-white"
            style={{ border: `1px solid ${c}25`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <p className="text-xl sm:text-5xl font-black num" style={{ color: c }}>{v}</p>
            <p className="text-[10px] sm:text-xl uppercase tracking-wide font-semibold mt-1" style={{ color: '#374151' }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 6 — FRANCHISE CTA
// ══════════════════════════════════════════════════════════
function SlideFranchise() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-2 sm:px-4 pt-2 pb-6 sm:py-8 scrollbar-hide"
      style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)' }}>
      <div className="flex-1 flex flex-col items-center justify-start sm:justify-center min-h-max pb-16">
        <FranchiseCTA />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN EXPO PAGE
// ══════════════════════════════════════════════════════════
export default function ExpoPage() {
  const { metrics, liveEvents, latestEvent, tick } = useSimulationEngine();
  const { currentSlide, currentIndex, progress, isPlaying, goTo, togglePlay, next, prev } = useDemoLoop();

  const isLightSlide = LIGHT_SLIDES.has(currentSlide);

  const slides: Record<string, React.ReactNode> = {
    hero:       <SlideHero latestEvent={latestEvent} />,
    metrics:    <SlideMetrics metrics={metrics} liveEvents={liveEvents} tick={tick} />,
    process:    <SlideProcess />,
    map:        <SlideMap />,
    enterprise: <SlideEnterprise />,
    franchise:  <SlideFranchise />,
  };

  return (
    <OfflineSyncProvider>
    <motion.div
      className="relative w-screen h-screen overflow-hidden"
      animate={{ backgroundColor: isLightSlide ? '#F5F9F6' : '#0A0F1E' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Dark-section ambient layer — only visible on dark slides */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: isLightSlide ? 0 : 1 }}
        transition={{ duration: 0.7 }}
      >
        <BgLayer />
      </motion.div>

      {/* Persistent top brand context bar */}
      <EntryStrip isLight={isLightSlide} />


      {/* Main slide area — offset by EntryStrip (80px) + bottom nav (80px) */}
      <div className="relative z-10 w-full overflow-hidden" style={{ height: 'calc(100vh - 80px - 80px)', marginTop: 80 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <ExpoNav
        currentIndex={currentIndex}
        total={DEMO_SLIDES.length}
        progress={progress}
        isPlaying={isPlaying}
        isLight={isLightSlide}
        onPrev={prev}
        onNext={next}
        onToggle={togglePlay}
        onGoTo={(i) => goTo(DEMO_SLIDES[i])}
      />
    </motion.div>
    </OfflineSyncProvider>
  );
}
