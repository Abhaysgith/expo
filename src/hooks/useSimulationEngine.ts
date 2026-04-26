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
  revenueToday: number;       // in rupees
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

// ── Seed values based on real UClean scale ────────────────
const SEED: SimMetrics = {
  ordersToday:      1_247,
  revenueToday:     4_836_000,  // ~₹48L/day across network
  activeStores:     823,
  customersServed:  3_000_000,
  processingNow:    184,
  countriesOnline:  10,
};

const CITIES = [
  'Gurgaon', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Chandigarh', 'Lucknow',
  'Noida', 'Andheri', 'Koramangala', 'Indiranagar', 'Powai', 'Salt Lake',
  'Whitefield', 'Hauz Khas', 'Lajpat Nagar', 'Banjara Hills', 'Anna Nagar',
  'Dubai', 'Kathmandu', 'Colombo', 'Dhaka', 'Accra', 'Mauritius',
];

const SERVICES = ['Dry Clean', 'Wash & Fold', 'Steam Press', 'Premium Laundry', 'Shoe Clean'];

const EVENT_TEMPLATES: Array<{ type: string; color: string; gen: () => string }> = [
  { type: 'pickup',   color: '#22D3EE', gen: () => `📦 Pickup scheduled · ${rnd(CITIES)}` },
  { type: 'cleaning', color: '#818CF8', gen: () => `🧺 Cleaning in progress · ${rnd(CITIES)}` },
  { type: 'quality',  color: '#10B981', gen: () => `✅ QC passed · ${rnd(CITIES)}` },
  { type: 'delivery', color: '#F59E0B', gen: () => `🚚 Delivered in ${12 + Math.floor(Math.random() * 40)} mins · ${rnd(CITIES)}` },
  { type: 'order',    color: '#22D3EE', gen: () => `⚡ New order · ${rnd(SERVICES)} · ${rnd(CITIES)}` },
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

// ── Seed initial event list ───────────────────────────────
function seedEvents(count = 12): LiveEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    ...generateEvent(),
    id: `seed-${i}`,
    ts: Date.now() - (count - i) * 8000,
  }));
}

// ─────────────────────────────────────────────────────────
export function useSimulationEngine() {
  const [metrics, setMetrics] = useState<SimMetrics>(SEED);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(seedEvents);
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
  const [tick, setTick] = useState(0);

  const ordersRef = useRef(SEED.ordersToday);
  const revenueRef = useRef(SEED.revenueToday);
  const processingRef = useRef(SEED.processingNow);

  // ── Order increment: every 6–14 seconds ─────────────────
  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 8000;
      const t = setTimeout(() => {
        const newOrders = 1 + Math.floor(Math.random() * 3);
        const avgOrderValue = 250 + Math.floor(Math.random() * 400);
        ordersRef.current += newOrders;
        revenueRef.current += newOrders * avgOrderValue;
        processingRef.current = 150 + Math.floor(Math.random() * 80);

        setMetrics(prev => ({
          ...prev,
          ordersToday:  ordersRef.current,
          revenueToday: revenueRef.current,
          processingNow: processingRef.current,
          activeStores: 820 + Math.floor(Math.random() * 8),
        }));
        setTick(t => t + 1);
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

  // ── Occasional "glow spike" — just a tick bump ───────────
  useEffect(() => {
    const t = setInterval(() => {
      setTick(n => n + 1);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  return { metrics, liveEvents, latestEvent, tick } satisfies SimState;
}
