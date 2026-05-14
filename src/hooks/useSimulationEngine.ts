'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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

// ── Time-based progression constants ──────────────────────
// Business day: 9:30 AM → 9:30 PM (12 hours)
const DAY_START_MIN = 9 * 60 + 30;   // 570 minutes from midnight
const DAY_END_MIN   = 21 * 60 + 30;  // 1290 minutes from midnight
const DAY_TOTAL_MIN = DAY_END_MIN - DAY_START_MIN; // 720 min

const START_ORDERS     = 440;
const END_ORDERS       = 16_800;
const START_GSV        = 215_600;
const END_GSV          = 8_736_000;
const START_PROCESSING = 50;
const END_PROCESSING   = 1_850;
const START_STORES     = 895;
const END_STORES       = 910;

/** Returns 0.0 → 1.0 based on current time within business hours */
function getDayProgress(): number {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  return Math.max(0, Math.min(1, (currentMin - DAY_START_MIN) / DAY_TOTAL_MIN));
}

function lerp(start: number, end: number, t: number) {
  return Math.round(start + (end - start) * t);
}

function buildSeed(): SimMetrics {
  const t = getDayProgress();
  return {
    ordersToday:     lerp(START_ORDERS,     END_ORDERS,     t),
    revenueToday:    lerp(START_GSV,        END_GSV,        t),
    activeStores:    lerp(START_STORES,     END_STORES,     t),
    customersServed: 5_000_000,
    processingNow:   lerp(START_PROCESSING, END_PROCESSING, t),
    countriesOnline: 10,
  };
}

// ── Order rate: ~16,360 orders over 720 min = ~22.7/min = ~3.8 per 10s ──────
// Per tick (avg 10s): 3-5 orders, avg order GSV ≈ ₹521
const AVG_ORDER_GSV = Math.round((END_GSV - START_GSV) / (END_ORDERS - START_ORDERS)); // ~521

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
    ...generateEvent(),
    id: `seed-${i}`,
    ts: Date.now() - (count - i) * 8000,
  }));
}

// ─────────────────────────────────────────────────────────
export function useSimulationEngine() {
  const [metrics, setMetrics] = useState<SimMetrics>(buildSeed);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(seedEvents);
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
  const [tick, setTick] = useState(0);

  const ordersRef     = useRef(metrics.ordersToday);
  const revenueRef    = useRef(metrics.revenueToday);
  const processingRef = useRef(metrics.processingNow);

  // ── Order increment: every 6–14 seconds ─────────────────
  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 8000;
      const t = setTimeout(() => {
        // 3–5 new orders per tick (≈10s avg → ~22/min → ~16K/day)
        const newOrders = 3 + Math.floor(Math.random() * 3);
        ordersRef.current  += newOrders;
        revenueRef.current += newOrders * (AVG_ORDER_GSV + Math.floor(Math.random() * 200 - 100));

        // Processing: ~11% of current orders ± small noise
        processingRef.current = Math.round(ordersRef.current * 0.11 + Math.random() * 20 - 10);

        // Stores: fluctuate between START_STORES and END_STORES based on time
        const t2 = getDayProgress();
        const stores = lerp(START_STORES, END_STORES, t2) + Math.floor(Math.random() * 4 - 2);

        setMetrics(prev => ({
          ...prev,
          ordersToday:   ordersRef.current,
          revenueToday:  revenueRef.current,
          processingNow: Math.max(1, processingRef.current),
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

  // ── Live event generator: every 4–9 seconds ──────────────
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
