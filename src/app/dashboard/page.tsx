'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import NavBar from '@/components/shared/NavBar';
import OfflineBanner from '@/components/shared/OfflineBanner';
import ActivityTicker from '@/components/shared/ActivityTicker';
import CommandCenterBanner from '@/components/dashboard/CommandCenterBanner';
import AnimatedCounters from '@/components/dashboard/AnimatedCounters';
import LiveOrderFeed from '@/components/dashboard/LiveOrderFeed';
import Leaderboard from '@/components/dashboard/Leaderboard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import IndiaMap from '@/components/dashboard/IndiaMap';
import AIProcess from '@/components/dashboard/AIProcess';
import {
  loadFranchiseStats,
  loadLiveOrders,
  type FranchiseLocation,
  type LiveOrder,
} from '@/lib/dataLoader';

// ── Skeleton ──────────────────────────────────────────────
function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl p-5 shimmer ${className}`}
      style={{ background: 'rgba(14,22,44,0.6)', border: '1px solid rgba(6,182,212,0.08)' }}>
      <div className="h-3 rounded-full w-24 mb-4" style={{ background: 'rgba(51,65,85,0.6)' }} />
      <div className="h-8 rounded-full w-36 mb-2" style={{ background: 'rgba(51,65,85,0.6)' }} />
      <div className="h-2 rounded-full w-20"      style={{ background: 'rgba(51,65,85,0.3)' }} />
    </div>
  );
}

// ── Floating particles ────────────────────────────────────
const PARTICLE_DATA = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  w: (i % 3) + 2,
  left: `${(i * 37 + 11) % 100}%`,
  top:  `${(i * 53 + 7)  % 100}%`,
  color: i % 4 === 0 ? '#06B6D4' : i % 4 === 1 ? '#818CF8' : i % 4 === 2 ? '#10B981' : '#00FFEA',
  opacity: 0.08 + (i % 5) * 0.04,
  dur: 7 + (i % 5),
  delay: (i * 0.7) % 5,
}));

function Particles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map(({ id, w, left, top, color, opacity, dur, delay }) => (
        <div
          key={id}
          className="absolute rounded-full"
          style={{
            width: w, height: w,
            left, top,
            background: color,
            opacity,
            animation: `particle ${dur}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Background streaks ────────────────────────────────────
function BackgroundStreaks() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[
        { top: '15%', dur: 8,  delay: 0,   opacity: 0.04 },
        { top: '45%', dur: 12, delay: 3,   opacity: 0.03 },
        { top: '75%', dur: 9,  delay: 6,   opacity: 0.05 },
      ].map(({ top, dur, delay, opacity }, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-64"
          style={{
            top,
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)',
            opacity,
          }}
          animate={{ x: ['-20%', '120vw'] }}
          transition={{ duration: dur, repeat: Infinity, delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [locations, setLocations] = useState<FranchiseLocation[]>([]);
  const [orders,    setOrders]    = useState<LiveOrder[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading,   setLoading]   = useState(true);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [stats, orderData] = await Promise.all([loadFranchiseStats(), loadLiveOrders()]);
      setLocations(stats.locations);
      setOrders(orderData.orders);
      setLastRefresh(new Date());
    } catch (e) {
      console.error('Data load failed (offline?):', e);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => {
    const t = setInterval(loadData, 30_000);
    return () => clearInterval(t);
  }, [loadData]);

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-command flex items-center justify-center relative">
        <div className="fixed inset-0 circuit-bg opacity-30 pointer-events-none" />
        <NavBar />
        <div className="text-center relative z-10">
          {/* Radar spinner */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(6,182,212,0.2)' }}
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{ border: '2px solid rgba(6,182,212,0.4)', borderTopColor: '#22D3EE' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22D3EE', boxShadow: '0 0 12px #22D3EE' }} />
            </div>
          </div>
          <p className="text-sm font-semibold font-mono" style={{ color: '#22D3EE' }}>
            INITIALIZING COMMAND CENTER...
          </p>
          <p className="text-xs text-slate-600 mt-1 font-mono">connecting to live network</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0A0F1E' }}>
      {/* ── Fixed background layers ── */}
      <div className="fixed inset-0 bg-command pointer-events-none" />
      <div className="fixed inset-0 circuit-bg opacity-20 pointer-events-none"
        style={{ animation: 'gridMove 12s linear infinite' }} />
      <div className="fixed inset-0 grid-dots opacity-30 pointer-events-none" />
      <Particles />
      <BackgroundStreaks />

      {/* ── UI ── */}
      <OfflineBanner />
      <NavBar />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8 pt-20 pb-16">

        {/* ── Command Center Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CommandCenterBanner
            locationCount={locations.length}
            lastRefresh={lastRefresh}
            isRefreshing={isRefreshing}
            onRefresh={loadData}
          />
        </motion.div>

        {/* ── Activity Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ActivityTicker />
        </motion.div>

        {/* ── KPI Row ── */}
        <AnimatedCounters locations={locations} />

        {/* ── Map + Order Feed + AI Process ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <IndiaMap locations={locations} />
            <AIProcess />
          </div>
          <div style={{ minHeight: 440 }}>
            <LiveOrderFeed allOrders={orders} />
          </div>
        </div>

        {/* ── Revenue Chart + Leaderboard ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart locations={locations} />
          </div>
          <Leaderboard locations={locations} />
        </div>

        {/* ── Footer ── */}
        <div className="mt-12 text-center">
          <div className="divider-neon mb-5" />
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-mono">
            <Activity className="w-3.5 h-3.5" style={{ color: 'rgba(6,182,212,0.4)' }} />
            <span>UClean Command Center · PWA · Live data every 30s · Exhibition demo mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
