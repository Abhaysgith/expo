'use client';

import { useState, useEffect, useRef } from 'react';

export interface LiveEvent {
  id: string;
  text: string;
  color: string;
  type: string;
  ts: number;
}

export interface SimMetrics {
  ordersToday: number;
  revenueToday: number;       // GSV in rupees
  activeStores: number;
  customersServed: number;
  processingNow: number;
  countriesOnline: number;
}

export interface SimState {
  metrics: SimMetrics;
  liveEvents: LiveEvent[];
  latestEvent: LiveEvent | null;
  tick: number;
}

// ── Per-day configuration ──────────────────────────────────
// Add new dates here whenever needed.
// startTime / endTime in "HH:MM" 24-hour format.
interface DayConfig {
  startOrders:  number;
  endOrders:    number;
  startGSV:     number;
  endGSV:       number;
  startTime:    string;  // "HH:MM"
  endTime:      string;  // "HH:MM"
}

const DAILY_CONFIG: Record<string, DayConfig> = {
  '2026-05-14': { startOrders: 440,   endOrders: 16_800,  startGSV: 215_600,  endGSV: 8_736_000, startTime: '09:30', endTime: '18:30' },
  '2026-05-15': { startOrders: 440,   endOrders: 16_800,  startGSV: 215_600,  endGSV: 8_736_000, startTime: '09:30', endTime: '18:30' },
  '2026-05-16': { startOrders: 440,   endOrders: 16_800,  startGSV: 215_600,  endGSV: 8_736_000, startTime: '09:30', endTime: '18:30' },
  '2026-05-17': { startOrders: 515,   endOrders: 18_600,  startGSV: 260_075,  endGSV: 9_660_000, startTime: '09:30', endTime: '18:30' },
};

// Fallback if today has no config
const DEFAULT_CONFIG: DayConfig = {
  startOrders: 440, endOrders: 16_800, startGSV: 215_600, endGSV: 8_736_000,
  startTime: '09:30', endTime: '21:30',
};

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayConfig(): DayConfig {
  return DAILY_CONFIG[getTodayKey()] ?? DEFAULT_CONFIG;
}

function timeStrToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Returns 0.0 → 1.0 based on current time within today's business hours */
function getDayProgress(cfg: DayConfig): number {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const startMin   = timeStrToMinutes(cfg.startTime);
  const endMin     = timeStrToMinutes(cfg.endTime);
  return Math.max(0, Math.min(1, (currentMin - startMin) / (endMin - startMin)));
}

function lerp(start: number, end: number, t: number) {
  return Math.round(start + (end - start) * t);
}

function buildSeed(): SimMetrics {
  const cfg = getTodayConfig();
  const t   = getDayProgress(cfg);
  const avgOrderGSV = Math.round((cfg.endGSV - cfg.startGSV) / (cfg.endOrders - cfg.startOrders));
  return {
    ordersToday:     lerp(cfg.startOrders, cfg.endOrders, t),
    revenueToday:    lerp(cfg.startGSV,    cfg.endGSV,    t),
    activeStores:    lerp(895, 910, t),
    customersServed: 5_000_000,
    processingNow:   Math.max(1, Math.round(lerp(cfg.startOrders, cfg.endOrders, t) * 0.11)),
    countriesOnline: 10,
  };
}

// ── Cities & event templates ───────────────────────────────
const CITIES = [
  'Gurgaon', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Chandigarh', 'Lucknow',
  'Noida', 'Andheri', 'Koramangala', 'Indiranagar', 'Powai', 'Salt Lake',
  'Whitefield', 'Hauz Khas', 'Lajpat Nagar', 'Banjara Hills', 'Anna Nagar',
  'Dubai', 'Kathmandu', 'Colombo', 'Dhaka', 'Accra', 'Mauritius',
];
const SERVICES = ['Dry Clean', 'Wash & Fold', 'Steam Press', 'Premium Laundry', 'Shoe Clean'];

const EVENT_TEMPLATES: Array<{ type: string; color: string; gen: () => string }> = [
  { type: 'pickup',   color: '#22C55E', gen: () => `📦 Pickup scheduled · ${rnd(CITIES)}` },
  { type: 'cleaning', color: '#818CF8', gen: () => `🧺 Cleaning in progress · ${rnd(CITIES)}` },
  { type: 'quality',  color: '#10B981', gen: () => `✅ QC passed · ${rnd(CITIES)}` },
  { type: 'delivery', color: '#F59E0B', gen: () => `🚚 Delivered in ${12 + Math.floor(Math.random() * 40)} mins · ${rnd(CITIES)}` },
  { type: 'order',    color: '#22C55E', gen: () => `⚡ New order · ${rnd(SERVICES)} · ${rnd(CITIES)}` },
  { type: 'rating',   color: '#FCD34D', gen: () => `⭐ ${Math.random() > 0.3 ? '5' : '4'}★ rating · ${rnd(CITIES)}` },
  { type: 'express',  color: '#F472B6', gen: () => `🔥 Express · ₹${200 + Math.floor(Math.random() * 1200)} · ${rnd(CITIES)}` },
  { type: 'eco',      color: '#34D399', gen: () => `🌿 Eco wash · 0.${1 + Math.floor(Math.random() * 6)}L water saved · ${rnd(CITIES)}` },
];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function uid() { return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function generateEvent(): LiveEvent {
  const tmpl = rnd(EVENT_TEMPLATES);
  return { id: uid(), text: tmpl.gen(), color: tmpl.color, type: tmpl.type, ts: Date.now() };
}
function seedEvents(count = 12): LiveEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    ...generateEvent(), id: `seed-${i}`, ts: Date.now() - (count - i) * 8000,
  }));
}

// ─────────────────────────────────────────────────────────
export function useSimulationEngine() {
  const seed = buildSeed();
  const [metrics, setMetrics]         = useState<SimMetrics>(seed);
  const [liveEvents, setLiveEvents]   = useState<LiveEvent[]>(seedEvents);
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
  const [tick, setTick]               = useState(0);

  const ordersRef     = useRef(seed.ordersToday);
  const revenueRef    = useRef(seed.revenueToday);

  // ── Order increment every 6–14s ──────────────────────────
  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 8000;
      const t = setTimeout(() => {
        const cfg         = getTodayConfig();
        const avgOrderGSV = Math.round((cfg.endGSV - cfg.startGSV) / (cfg.endOrders - cfg.startOrders));
        const newOrders   = 3 + Math.floor(Math.random() * 3);

        ordersRef.current  += newOrders;
        revenueRef.current += newOrders * (avgOrderGSV + Math.floor(Math.random() * 200 - 100));

        const processing = Math.max(1, Math.round(ordersRef.current * 0.11 + Math.random() * 20 - 10));
        const stores     = lerp(895, 910, getDayProgress(cfg)) + Math.floor(Math.random() * 4 - 2);

        setMetrics(prev => ({
          ...prev,
          ordersToday:   ordersRef.current,
          revenueToday:  revenueRef.current,
          processingNow: processing,
          activeStores:  stores,
        }));
        setTick(n => n + 1);
        schedule();
      }, delay);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // ── Live event every 4–9s ─────────────────────────────────
  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 5000;
      const t = setTimeout(() => {
        const ev = generateEvent();
        setLatestEvent(ev);
        setLiveEvents(prev => [ev, ...prev].slice(0, 20));
        schedule();
      }, delay);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // ── Tick bump every 15s ───────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  return { metrics, liveEvents, latestEvent, tick } satisfies SimState;
}
