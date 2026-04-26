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
import GlobalMap                     from '@/components/expo/GlobalMap';
import EnterpriseTrustBar            from '@/components/expo/EnterpriseTrustBar';
import FranchiseCTA                  from '@/components/expo/FranchiseCTA';
import AnimatedCounter               from '@/components/ui/AnimatedCounter';

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
  color: i % 4 === 0 ? '#06B6D4' : i % 4 === 1 ? '#818CF8' : i % 4 === 2 ? '#10B981' : '#00FFEA',
  opacity: 0.07 + (i % 6) * 0.03,
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
      {/* Horizontal scan beam */}
      <motion.div
        className="fixed left-0 right-0 h-[1px] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.35) 30%, rgba(0,255,234,0.5) 50%, rgba(6,182,212,0.35) 70%, transparent 100%)',
          boxShadow: '0 0 10px rgba(6,182,212,0.3)',
        }}
        animate={{ top: ['-1%', '101%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />
    </>
  );
}

// ─── Nav bar ──────────────────────────────────────────────
function ExpoNav({
  currentIndex, total, progress, isPlaying,
  onPrev, onNext, onToggle, onGoTo,
}: {
  currentIndex: number; total: number; progress: number;
  isPlaying: boolean;
  onPrev: () => void; onNext: () => void; onToggle: () => void;
  onGoTo: (i: number) => void;
}) {
  const labels = ['HERO', 'METRICS', 'PROCESS', 'MAP', 'CLIENTS', 'FRANCHISE'];
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{
        background: 'rgba(8,13,28,0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(6,182,212,0.2)',
        boxShadow: '0 0 40px rgba(6,182,212,0.08)',
      }}
    >
      <button onClick={onPrev} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-800">
        <ChevronLeft className="w-4 h-4 text-slate-400" />
      </button>

      {/* Slide dots */}
      {labels.map((lbl, i) => (
        <button
          key={i}
          onClick={() => onGoTo(i)}
          className="flex flex-col items-center gap-1 group"
        >
          <span className={`text-[9px] font-bold font-mono uppercase tracking-wider transition-colors ${i === currentIndex ? 'text-cyan-400' : 'text-slate-700 group-hover:text-slate-500'}`}>
            {lbl}
          </span>
          <div className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === currentIndex ? 28 : 16, background: 'rgba(71,85,105,0.5)' }}>
            {i === currentIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #22D3EE, #818CF8)', width: `${progress}%` }}
              />
            )}
            {i !== currentIndex && i < currentIndex && (
              <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(6,182,212,0.4)' }} />
            )}
          </div>
        </button>
      ))}

      <button onClick={onNext} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-800">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
      <div className="w-px h-5 bg-slate-800 mx-1" />
      <button onClick={onToggle} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-800">
        {isPlaying
          ? <Pause className="w-3.5 h-3.5 text-slate-400" />
          : <Play  className="w-3.5 h-3.5 text-slate-400" />
        }
      </button>
    </div>
  );
}

// ─── Slide wrapper ────────────────────────────────────────
const slideVariants = {
  enter:  { opacity: 0, y: 24, filter: 'blur(4px)' },
  center: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, y: -24, filter: 'blur(4px)', transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

// ─── Section label ────────────────────────────────────────
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 14px rgba(6,182,212,0.08)' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22D3EE', boxShadow: '0 0 6px #22D3EE' }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#22D3EE' }}>{children}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 1 — HERO
// ══════════════════════════════════════════════════════════
function SlideHero({ latestEvent }: { latestEvent: { text: string; color: string } | null }) {
  const words = ['Global Leaders in', 'Laundry &', 'Dry Cleaning'];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative">
      {/* HUD corners */}
      {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c, i) => (
        <div key={i} className={`absolute ${c} w-10 h-10`} style={{ borderColor: 'rgba(6,182,212,0.35)' }} />
      ))}

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mb-8">
        <Image src="/uclean-logo.png" alt="UClean" width={200} height={56} style={{ objectFit: 'contain' }} priority />
      </motion.div>

      {/* Headline */}
      <div className="mb-6">
        {words.map((w, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1
              className="font-black leading-[1.05] tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                ...(i === 1
                  ? { background: 'linear-gradient(120deg, #67E8F9, #22D3EE, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                  : { color: '#F8FAFC' }),
              }}
            >
              {w}
            </h1>
          </motion.div>
        ))}
      </div>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-slate-400 mb-8 max-w-xl"
        style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)' }}
      >
        <span className="text-slate-200 font-semibold">800+ Stores.</span> &nbsp;
        <span className="text-slate-200 font-semibold">3M+ Customers.</span> &nbsp;
        <span className="text-slate-200 font-semibold">10+ Countries.</span>
      </motion.p>

      {/* Live stat pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
        className="flex flex-wrap gap-3 justify-center mb-8"
      >
        {[
          { v: '10+',   l: 'Countries',  c: '#22D3EE' },
          { v: '800+',  l: 'Stores',     c: '#818CF8' },
          { v: '3M+',   l: 'Customers',  c: '#10B981' },
          { v: '4.7★',  l: 'Rating',     c: '#F59E0B' },
          { v: '94%',   l: 'Renewal',    c: '#F472B6' },
          { v: '₹0',    l: 'SaaS Fees',  c: '#34D399' },
        ].map(({ v, l, c }) => (
          <div key={l} className="px-4 py-2 rounded-xl text-center"
            style={{ background: `${c}0A`, border: `1px solid ${c}30` }}>
            <p className="font-black num" style={{ color: c, fontSize: 'clamp(1rem, 2vw, 1.4rem)', textShadow: `0 0 16px ${c}60` }}>{v}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono mt-0.5">{l}</p>
          </div>
        ))}
      </motion.div>

      {/* Live event toast */}
      <AnimatePresence mode="wait">
        {latestEvent && (
          <motion.div
            key={latestEvent.text}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium font-mono"
            style={{
              background: 'rgba(10,15,30,0.9)',
              border: `1px solid ${latestEvent.color}30`,
              color: latestEvent.color,
              boxShadow: `0 0 20px ${latestEvent.color}15`,
            }}
          >
            {latestEvent.text}
          </motion.div>
        )}
      </AnimatePresence>
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
  const BIG = [
    { label: 'Orders Today',     value: metrics.ordersToday,   suffix: '',    color: '#22D3EE', size: 'text-8xl' },
    { label: 'Revenue Today',    value: null, raw: fmt(metrics.revenueToday), color: '#10B981', size: 'text-7xl' },
    { label: 'Stores Active',    value: metrics.activeStores,  suffix: '+',   color: '#818CF8', size: 'text-8xl' },
    { label: 'Processing Now',   value: metrics.processingNow, suffix: '',    color: '#F59E0B', size: 'text-7xl' },
  ];

  return (
    <div className="flex flex-col h-full px-4 py-4">
      <div className="text-center mb-6 flex-shrink-0">
        <SLabel>Live Command Center</SLabel>
        <h2 className="font-black text-slate-50 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          Real-time Network{' '}
          <span style={{ background: 'linear-gradient(135deg, #22D3EE, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
              boxShadow: tick % (i + 2) === 0 ? `0 0 40px ${color}30` : 'none',
              transition: 'box-shadow 0.6s',
            }}
          >
            <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
            <div className={`${size} font-black num leading-none mb-2`} style={{ color, textShadow: `0 0 30px ${color}60` }}>
              {raw ?? (
                <AnimatedCounter value={value ?? 0} suffix={BIG[i]?.suffix ?? ''} decimals={0} duration={1.5} className="" />
              )}
            </div>
            <p className="text-xs uppercase tracking-wider font-mono" style={{ color: `${color}80` }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Live event feed */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(8,13,28,0.7)', border: '1px solid rgba(6,182,212,0.1)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/60">
          <span className="live-dot-cyan" style={{ width: 7, height: 7 }} />
          <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: '#22D3EE' }}>Live Activity Feed</span>
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
                <span className="text-sm font-mono" style={{ color: ev.color }}>{ev.text}</span>
                <span className="ml-auto text-[10px] text-slate-700 font-mono flex-shrink-0">
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
  { icon: Scan,         label: 'PICKUP',   title: 'Pickup Scheduled',   detail: 'GPS-verified driver assigned',  color: '#22D3EE' },
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
    <div className="flex flex-col items-center justify-center h-full px-6">
      <SLabel>AI Laundry Pipeline</SLabel>
      <h2 className="font-black text-slate-50 text-center mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}>
        Every Order,{' '}
        <span style={{ background: 'linear-gradient(135deg, #22D3EE, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Precision-Tracked
        </span>
      </h2>
      <p className="text-slate-500 text-sm font-mono mb-8">Order ID: <span style={{ color: '#22D3EE' }}>{orderId}</span></p>

      {/* Steps timeline */}
      <div className="flex items-center w-full max-w-3xl mb-8 gap-2">
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
                    boxShadow: isCurrent ? `0 0 24px ${step.color}40` : 'none',
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
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest"
                  style={{ color: isCurrent ? step.color : isDone ? '#10B981' : '#334155' }}>
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
          <p className="text-2xl font-black" style={{ color: s.color, textShadow: `0 0 24px ${s.color}60` }}>{s.title}</p>
          <p className="text-slate-500 text-sm mt-2 font-mono">{s.detail}</p>

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
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        {[
          { v: '48–72h', l: 'Turnaround',     c: '#22D3EE' },
          { v: 'Free',   l: 'Pickup/Delivery', c: '#10B981' },
          { v: 'Eco',    l: 'Low-Water',        c: '#34D399' },
          { v: 'ISO',    l: 'Certified',         c: '#818CF8' },
        ].map(({ v, l, c }) => (
          <div key={l} className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ background: `${c}0A`, border: `1px solid ${c}25` }}>
            <span className="font-black text-sm" style={{ color: c }}>{v}</span>
            <span className="text-xs text-slate-500 font-mono">{l}</span>
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
        <h2 className="font-black text-slate-50" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          UClean Worldwide —{' '}
          <span style={{ background: 'linear-gradient(135deg, #22D3EE, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
    <div className="flex flex-col h-full px-4 py-4">
      <div className="text-center mb-6 flex-shrink-0">
        <SLabel>Enterprise Clients</SLabel>
        <h2 className="font-black text-slate-50" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          India&apos;s Most Trusted{' '}
          <span style={{ background: 'linear-gradient(135deg, #22D3EE, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
            whileHover={{ y: -4, scale: 1.04 }}
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(14,22,44,0.7)', border: '1px solid rgba(6,182,212,0.1)' }}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-xs font-bold text-slate-200">{name}</p>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 flex-shrink-0">
        {[
          { v: '50K+',   l: 'Daily Garments',  c: '#22D3EE' },
          { v: '200+',   l: 'Cities Served',   c: '#818CF8' },
          { v: '₹0',     l: 'Hidden Charges',  c: '#10B981' },
        ].map(({ v, l, c }) => (
          <div key={l} className="rounded-xl p-3 text-center"
            style={{ background: `${c}06`, border: `1px solid ${c}20` }}>
            <p className="text-2xl font-black num" style={{ color: c, textShadow: `0 0 16px ${c}50` }}>{v}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mt-0.5">{l}</p>
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
    <div className="flex flex-col h-full px-4 py-4">
      <div className="text-center mb-6 flex-shrink-0">
        <SLabel>Franchise Opportunity</SLabel>
        <h2 className="font-black text-slate-50" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          Own a UClean Store —{' '}
          <span style={{ background: 'linear-gradient(135deg, #22D3EE, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Calculate Your Returns
          </span>
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 font-mono">
          Based on 800+ existing franchisees · Starts from ₹8L
        </p>
      </div>
      <div className="flex-1 min-h-0">
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

  const slides: Record<string, React.ReactNode> = {
    hero:       <SlideHero latestEvent={latestEvent} />,
    metrics:    <SlideMetrics metrics={metrics} liveEvents={liveEvents} tick={tick} />,
    process:    <SlideProcess />,
    map:        <SlideMap />,
    enterprise: <SlideEnterprise />,
    franchise:  <SlideFranchise />,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0A0F1E' }}>
      <BgLayer />

      {/* Main slide area */}
      <div className="relative z-10 w-full" style={{ height: 'calc(100vh - 80px)' }}>
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
        onPrev={prev}
        onNext={next}
        onToggle={togglePlay}
        onGoTo={(i) => goTo(DEMO_SLIDES[i])}
      />
    </div>
  );
}
