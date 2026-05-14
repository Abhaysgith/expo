'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Globe, Users, Store } from 'lucide-react';

const WORLD_GEO = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface Country {
  code: string;
  numericCode: string;
  name: string;
  flag: string;
  stores: number;
  cities: number;
  lat: number;
  lng: number;
  status: string;
  launchYear: number;
  color: string;
}

// UClean operating countries with approximate marker coordinates
const UCLEAN_COUNTRIES: Country[] = [
  { code:'IND', numericCode:'356', name:'India',      flag:'🇮🇳', stores:870, cities:200, lat:20.59,  lng:78.96,  status:'flagship',  launchYear:2016, color:'#22C55E' },
  { code:'MNG', numericCode:'496', name:'Mongolia',   flag:'🇲🇳', stores:2,   cities:2,   lat:47.92,  lng:106.92, status:'active',    launchYear:2025, color:'#F472B6' },
  { code:'LKA', numericCode:'144', name:'Sri Lanka',  flag:'🇱🇰', stores:10,  cities:5,   lat:7.87,   lng:80.77,  status:'active',    launchYear:2025, color:'#2DD4BF' },
  { code:'BGD', numericCode:'050', name:'Bangladesh', flag:'🇧🇩', stores:2,   cities:2,   lat:23.69,  lng:90.36,  status:'active',    launchYear:2025, color:'#F59E0B' },
  { code:'GHA', numericCode:'288', name:'Ghana',      flag:'🇬🇭', stores:3,   cities:2,   lat:7.95,   lng:-1.02,  status:'active',    launchYear:2025, color:'#10B981' },
  { code:'COD', numericCode:'180', name:'DR Congo',   flag:'🇨🇩', stores:1,   cities:1,   lat:-4.03,  lng:21.75,  status:'expanding', launchYear:2026, color:'#818CF8' },
  { code:'NPL', numericCode:'524', name:'Nepal',      flag:'🇳🇵', stores:1,   cities:2,   lat:28.39,  lng:84.12,  status:'active',    launchYear:2025, color:'#FB923C' },
  { code:'SOM', numericCode:'706', name:'Somalia',    flag:'🇸🇴', stores:1,   cities:2,   lat:2.04,   lng:45.34,  status:'active',    launchYear:2025, color:'#34D399' },
  { code:'ARE', numericCode:'784', name:'UAE',        flag:'🇦🇪', stores:4,   cities:3,   lat:24.47,  lng:54.37,  status:'active',    launchYear:2025, color:'#10B981' },
  { code:'MUS', numericCode:'480', name:'Mauritius',  flag:'🇲🇺', stores:1,   cities:1,   lat:-20.35, lng:57.55,  status:'active',    launchYear:2025, color:'#A78BFA' },
];

// Map numeric code → color for Geography fill
const COUNTRY_COLOR_MAP: Record<string, string> = Object.fromEntries(
  UCLEAN_COUNTRIES.map(c => [c.numericCode, c.color])
);

interface Props {
  autoHighlight?: boolean;
}

export default function GlobalMap({ autoHighlight = true }: Props) {
  const [activeCountry, setActiveCountry] = useState<Country | null>(UCLEAN_COUNTRIES[0]);
  const [autoIdx, setAutoIdx] = useState(0);

  // Auto-cycle highlight
  useEffect(() => {
    if (!autoHighlight) return;
    const t = setInterval(() => {
      setAutoIdx(prev => {
        const next = (prev + 1) % UCLEAN_COUNTRIES.length;
        setActiveCountry(UCLEAN_COUNTRIES[next]);
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [autoHighlight]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            <Globe className="w-5 h-5" style={{ color: '#22C55E' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Global Footprint</h3>
            <p className="text-xs text-slate-500 font-mono">{UCLEAN_COUNTRIES.length} countries · 900+ stores</p>
          </div>
        </div>

        {/* Country pill strip */}
        <div className="hidden lg:flex items-center gap-1.5 flex-wrap justify-end max-w-[380px]">
          {UCLEAN_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setActiveCountry(c); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: activeCountry?.code === c.code ? `${c.color}18` : 'rgba(30,41,59,0.4)',
                border: `1px solid ${activeCountry?.code === c.code ? c.color + '50' : 'rgba(71,85,105,0.3)'}`,
                color: activeCountry?.code === c.code ? c.color : '#64748B',
              }}
            >
              <span>{c.flag}</span>
              <span className="hidden xl:inline">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Map */}
        <div
          className="flex-1 relative rounded-xl overflow-hidden"
          style={{ background: 'rgba(8,13,28,0.8)', border: '1px solid rgba(6,182,212,0.1)', minHeight: 200 }}
        >
          <div className="absolute inset-0 grid-dots opacity-30 pointer-events-none" />

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140, center: [60, 20] }}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={WORLD_GEO}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  const numId  = String(geo.id);
                  const color  = COUNTRY_COLOR_MAP[numId];
                  const isActive = activeCountry && UCLEAN_COUNTRIES.find(c => c.numericCode === numId)?.code === activeCountry.code;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        isActive
                          ? color ?? 'rgba(30,41,59,0.4)'
                          : color
                            ? `${color}22`
                            : 'rgba(20,30,55,0.5)'
                      }
                      stroke={color ? `${color}30` : 'rgba(6,182,212,0.06)'}
                      strokeWidth={color ? 0.8 : 0.3}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.4s' },
                        hover:   { fill: color ? `${color}55` : 'rgba(30,41,59,0.7)', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                      onClick={() => {
                        const c = UCLEAN_COUNTRIES.find(c => c.numericCode === numId);
                        if (c) setActiveCountry(c);
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Pulsing markers */}
            {UCLEAN_COUNTRIES.map((country) => {
              const isActive = activeCountry?.code === country.code;
              return (
                <Marker key={country.code} coordinates={[country.lng, country.lat]}>
                  {/* Outer pulse ring */}
                  <motion.circle
                    r={isActive ? 14 : 9}
                    fill="none"
                    stroke={country.color}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.8, scale: 0.8 }}
                    animate={{ opacity: 0, scale: isActive ? 2.8 : 2 }}
                    transition={{ duration: isActive ? 1.4 : 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                  {/* Core dot */}
                  <motion.circle
                    r={isActive ? 6 : 4}
                    fill={country.color}
                    fillOpacity={isActive ? 1 : 0.8}
                    style={{
                      cursor: 'pointer',
                      filter: `drop-shadow(0 0 ${isActive ? '8px' : '4px'} ${country.color})`,
                    }}
                    animate={isActive ? { r: [5, 7, 5] } : { r: 4 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    onClick={() => setActiveCountry(country)}
                  />
                  {/* Flag label on active */}
                  {isActive && (
                    <text
                      y={-14}
                      textAnchor="middle"
                      style={{ fontSize: '10px', fill: country.color, fontFamily: 'monospace', fontWeight: 700 }}
                    >
                      {country.flag} {country.name}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Country detail card */}
        <div className="w-full lg:w-44 flex-shrink-0">
          <AnimatePresence mode="wait">
            {activeCountry && (
              <motion.div
                key={activeCountry.code}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl p-4 h-full"
                style={{
                  background: `rgba(10,15,30,0.9)`,
                  border: `1px solid ${activeCountry.color}30`,
                  boxShadow: `0 0 20px ${activeCountry.color}10`,
                }}
              >
                {/* Top shimmer */}
                <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${activeCountry.color}60, transparent)` }} />

                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{activeCountry.flag}</div>
                  <p className="font-black text-sm" style={{ color: activeCountry.color }}>{activeCountry.name}</p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${activeCountry.color}15`, color: activeCountry.color }}
                  >
                    {activeCountry.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Store, label: 'Stores',   value: activeCountry.stores },
                    { icon: Globe, label: 'Cities',   value: activeCountry.cities },
                    { icon: Users, label: 'Since',    value: activeCountry.launchYear },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3" style={{ color: activeCountry.color }} />
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">{label}</span>
                      </div>
                      <span className="text-xs font-black num" style={{ color: activeCountry.color }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[9px] text-slate-600 font-mono mb-1">
                    <span>Network share</span>
                    <span>{Math.round((activeCountry.stores / 900) * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(71,85,105,0.4)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: activeCountry.color, boxShadow: `0 0 8px ${activeCountry.color}` }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.max(1, (activeCountry.stores / 900) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Country grid (mobile) */}
      <div className="lg:hidden mt-3 flex flex-wrap gap-2">
        {UCLEAN_COUNTRIES.map(c => (
          <button
            key={c.code}
            onClick={() => setActiveCountry(c)}
            className="text-sm px-2 py-1 rounded-lg"
            style={{
              background: activeCountry?.code === c.code ? `${c.color}18` : 'rgba(30,41,59,0.4)',
              border: `1px solid ${activeCountry?.code === c.code ? c.color + '50' : 'rgba(71,85,105,0.3)'}`,
              color: activeCountry?.code === c.code ? c.color : '#64748B',
            }}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
