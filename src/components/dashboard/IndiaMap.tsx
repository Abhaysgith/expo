'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { MapPin, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import type { FranchiseLocation } from '@/lib/dataLoader';
import { formatINR } from '@/lib/dataLoader';

const INDIA_GEO = 'https://cdn.jsdelivr.net/npm/india-atlas@2.0.0/india-atlas.json';

const TIER_CONFIG: Record<number, { color: string; glow: string; size: number }> = {
  1: { color: '#16A34A', glow: 'rgba(6,182,212,0.6)',   size: 7 },
  2: { color: '#818CF8', glow: 'rgba(129,140,248,0.6)', size: 5.5 },
  3: { color: '#10B981', glow: 'rgba(16,185,129,0.6)',  size: 4.5 },
};

interface TooltipState { loc: FranchiseLocation; x: number; y: number }

export default function IndiaMap({ locations }: { locations: FranchiseLocation[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleClick = (loc: FranchiseLocation, e: React.MouseEvent) => {
    const svgRect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    const containerRect = (e.currentTarget as SVGElement).closest('.map-container')?.getBoundingClientRect();
    if (!svgRect || !containerRect) return;
    setTooltip({
      loc,
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });
  };

  return (
    <GlassCard className="p-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10">
            <MapPin className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Network Coverage</h3>
            <p className="text-xs text-slate-500">{locations.length} active franchise locations</p>
          </div>
        </div>

        {/* Tier legend */}
        <div className="hidden sm:flex items-center gap-3">
          {[1, 2, 3].map(tier => (
            <div key={tier} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: TIER_CONFIG[tier].color, boxShadow: `0 0 6px ${TIER_CONFIG[tier].glow}` }} />
              <span className="text-xs text-slate-500">Tier {tier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="map-container relative rounded-xl overflow-hidden h-[240px] sm:h-[380px]" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
        {/* Grid dots overlay */}
        <div className="absolute inset-0 grid-dots opacity-40 pointer-events-none" />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 900, center: [82, 22] }}
          width={600}
          height={380}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup zoom={1}>
            {/* India state fills */}
            <Geographies geography={INDIA_GEO}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(30, 41, 59, 0.6)"
                    stroke="rgba(6, 182, 212, 0.1)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: 'rgba(30, 41, 59, 0.9)', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Franchise markers */}
            {locations.map((loc) => {
              const cfg = TIER_CONFIG[loc.tier];
              return (
                <Marker key={loc.id} coordinates={[loc.lng, loc.lat]}>
                  {/* Outer pulse ring — animates continuously */}
                  <motion.circle
                    r={cfg.size + 6}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.8, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 2.2 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: Math.random() * 2.5,
                      ease: 'easeOut',
                    }}
                  />
                  {/* Second ring */}
                  <motion.circle
                    r={cfg.size + 3}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth={1}
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.8 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: Math.random() * 2.5 + 0.5,
                      ease: 'easeOut',
                    }}
                  />
                  {/* Core dot */}
                  <circle
                    r={cfg.size}
                    fill={cfg.color}
                    fillOpacity={0.95}
                    style={{
                      cursor: 'pointer',
                      filter: `drop-shadow(0 0 4px ${cfg.glow})`,
                    }}
                    onClick={(e) => handleClick(loc, e as unknown as React.MouseEvent)}
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute z-20 pointer-events-none"
              style={{ left: Math.min(tooltip.x + 12, 400), top: Math.max(tooltip.y - 100, 8) }}
            >
              <div className="glass-strong rounded-2xl p-4 w-56 border border-green-500/20">
                <button
                  className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 pointer-events-auto"
                  onClick={() => setTooltip(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: TIER_CONFIG[tooltip.loc.tier].color }} />
                  <p className="font-bold text-slate-50 text-sm">{tooltip.loc.city}</p>
                </div>
                <p className="text-xs text-slate-400 mb-3">{tooltip.loc.area}, {tooltip.loc.state}</p>
                <div className="space-y-1.5">
                  {[
                    ['Revenue', formatINR(tooltip.loc.monthlyRevenue), 'text-green-400'],
                    ['Orders', `${tooltip.loc.monthlyOrders.toLocaleString()}/mo`, 'text-slate-200'],
                    ['Rating', `${'★'.repeat(Math.round(tooltip.loc.rating))} ${tooltip.loc.rating}`, 'text-amber-400'],
                    ['Since', new Date(tooltip.loc.joinedDate).getFullYear().toString(), 'text-slate-400'],
                  ].map(([k, v, cls]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-slate-500">{k}</span>
                      <span className={`font-semibold num ${cls}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
