'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, DollarSign, Code2, Activity,
  Shield, Award, Users, Sparkles, ChevronDown, Zap, TrendingUp,
} from 'lucide-react';
import NavBar from '@/components/shared/NavBar';
import OfflineBanner from '@/components/shared/OfflineBanner';
import ActivityTicker from '@/components/shared/ActivityTicker';
import ROICalculator from '@/components/nfc/ROICalculator';
import TestimonialCarousel from '@/components/nfc/TestimonialCarousel';
import BookDemoForm from '@/components/nfc/BookDemoForm';
import ComparisonTable from '@/components/nfc/ComparisonTable';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import GradientText from '@/components/ui/GradientText';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Logo from '@/components/ui/Logo';

// ── Particle field ────────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: (i % 3) + 1.5,
  x: `${(i * 41 + 13) % 100}%`,
  y: `${(i * 61 + 7)  % 100}%`,
  color: i % 4 === 0 ? '#06B6D4' : i % 4 === 1 ? '#818CF8' : i % 4 === 2 ? '#10B981' : '#00FFEA',
  opacity: 0.07 + (i % 6) * 0.03,
  dur: 7 + (i % 7),
  delay: (i * 0.6) % 6,
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map(({ id, size, x, y, color, opacity, dur, delay }) => (
        <div
          key={id}
          className="absolute rounded-full"
          style={{
            width: size, height: size,
            left: x, top: y,
            background: color, opacity,
            animation: `particle ${dur}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Holographic orbs ──────────────────────────────────────
function HoloOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 65%)' }} />
      <div className="absolute top-[30%] right-[-15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(30,58,138,0.10) 0%, transparent 65%)',
          animation: 'float 14s ease-in-out infinite',
        }} />
      <div className="absolute bottom-[5%] left-[15%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,234,0.04) 0%, transparent 65%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
      {/* Neon beam top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.5) 25%, rgba(0,255,234,0.3) 50%, rgba(6,182,212,0.5) 75%, transparent 100%)',
        }} />
    </div>
  );
}

// ── Floating geometric shapes ─────────────────────────────
const GEO_SHAPES = [
  { size: 64, x: '7%',  y: '22%', delay: 0,   dur: 7  },
  { size: 44, x: '86%', y: '14%', delay: 1.5, dur: 9  },
  { size: 28, x: '72%', y: '58%', delay: 3,   dur: 6  },
  { size: 52, x: '14%', y: '68%', delay: 2,   dur: 11 },
  { size: 34, x: '92%', y: '78%', delay: 0.5, dur: 8  },
  { size: 20, x: '50%', y: '30%', delay: 4,   dur: 13 },
];

function GeometricShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {GEO_SHAPES.map(({ size, x, y, delay, dur }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: size, height: size,
            left: x, top: y,
            borderRadius: '30%',
            border: '1px solid rgba(6,182,212,0.10)',
            background: 'rgba(6,182,212,0.02)',
            boxShadow: '0 0 20px rgba(6,182,212,0.05)',
            animation: `float ${dur}s ease-in-out ${delay}s infinite`,
          }}
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: dur * 3, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────
const sectionVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={sectionVariants}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}

// ── Section label ──────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
      style={{
        background: 'rgba(6,182,212,0.06)',
        border: '1px solid rgba(6,182,212,0.2)',
        boxShadow: '0 0 16px rgba(6,182,212,0.08)',
      }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22D3EE', boxShadow: '0 0 6px #22D3EE' }} />
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#22D3EE' }}>{children}</span>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────
const USP_FEATURES = [
  {
    icon: DollarSign,
    title: '₹0 Monthly Software Fees',
    sub: 'Save ₹60,000+ annually vs third-party platforms',
    detail: 'Competitors charge ₹3,000–₹6,000/month for basic software. UClean builds and maintains everything in-house.',
    color: '#22D3EE', bg: 'rgba(34,211,238,0.07)', border: 'rgba(34,211,238,0.2)', glow: 'rgba(34,211,238,0.08)',
  },
  {
    icon: Code2,
    title: 'Built In-House',
    sub: 'Custom-built for laundry workflows only',
    detail: 'Every feature — order tracking, driver assignment, invoice generation — designed specifically for laundry operations.',
    color: '#818CF8', bg: 'rgba(129,140,248,0.07)', border: 'rgba(129,140,248,0.2)', glow: 'rgba(129,140,248,0.08)',
  },
  {
    icon: Activity,
    title: 'Real-Time Analytics',
    sub: 'Live dashboard insights, always',
    detail: 'Monitor every order, rupee, and customer rating from your phone. Full transparency across your entire operation.',
    color: '#10B981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.08)',
  },
];

const TRUST_BADGES = [
  { icon: Shield,   label: 'ISO Certified',    sub: 'Quality assured' },
  { icon: Award,    label: '500+ Outlets',     sub: 'Pan-India' },
  { icon: Users,    label: '50K+ Customers',   sub: 'Served daily' },
  { icon: Sparkles, label: '4.7★ Avg Rating',  sub: 'All locations' },
];

const STEPS = [
  { num: '01', title: 'Apply Online',     desc: 'Short form. No fees, no commitment. We review in 24 hours.' },
  { num: '02', title: 'Discovery Call',   desc: 'Our franchise expert explains the model, answers every question.' },
  { num: '03', title: 'Site Evaluation',  desc: 'We help find and assess the perfect location in your city.' },
  { num: '04', title: 'Training & Setup', desc: '3-week intensive program. We handle all equipment and interior.' },
  { num: '05', title: 'Launch & Scale',   desc: 'Grand opening support, first 60 days mentoring, then you own it.' },
];

const STATS = [
  { value: 180,  suffix: 'Cr+', prefix: '₹', label: 'Network Revenue', sub: 'FY 2023–24', color: '#22D3EE' },
  { value: 500,  suffix: '+',   prefix: '',   label: 'Franchises',       sub: 'active outlets', color: '#818CF8' },
  { value: 94,   suffix: '%',   prefix: '',   label: 'Renewal Rate',     sub: 'franchisees renew', color: '#10B981' },
  { value: 4.7,  suffix: '★',  prefix: '',   label: 'Avg Rating',       sub: 'verified reviews', color: '#F59E0B', decimals: 1 },
];

const HEADLINE_WORDS = ["India's", "Most Advanced", "Laundry Network"];

// ── Page ──────────────────────────────────────────────────
export default function NFCPage() {
  return (
    <div className="min-h-screen relative" style={{ background: '#0A0F1E' }}>
      <HoloOrbs />
      <div className="fixed inset-0 circuit-bg opacity-15 pointer-events-none" />
      <div className="fixed inset-0 grid-dots opacity-25 pointer-events-none" />
      <OfflineBanner />
      <NavBar />

      {/* ════════════════════════════════════════════════════ */}
      {/*  HERO — Full-screen exhibition experience          */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-12 px-4 overflow-hidden">
        <ParticleField />
        <GeometricShapes />

        {/* Horizontal scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 20%, rgba(0,255,234,0.8) 50%, rgba(6,182,212,0.6) 80%, transparent 100%)',
            boxShadow: '0 0 12px rgba(6,182,212,0.5)',
          }}
          animate={{ top: ['-2%', '102%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />

        {/* Corner HUD brackets */}
        {[
          'top-6 left-6 border-t-2 border-l-2',
          'top-6 right-6 border-t-2 border-r-2',
          'bottom-16 left-6 border-b-2 border-l-2',
          'bottom-16 right-6 border-b-2 border-r-2',
        ].map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute ${cls} w-8 h-8 md:w-12 md:h-12`}
            style={{ borderColor: 'rgba(6,182,212,0.4)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          />
        ))}

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="badge-neon mb-8 flex items-center gap-2.5"
        >
          <span className="live-dot-cyan" />
          <span>You just tapped into a ₹1000Cr opportunity</span>
        </motion.div>

        {/* Headline — word-by-word reveal */}
        <div className="text-center max-w-4xl mb-6">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              {i === 1 ? (
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight gradient-text-hero">
                  {word}
                </h1>
              ) : (
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-slate-50">
                  {word}
                </h1>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-lg md:text-xl text-slate-400 text-center max-w-xl leading-relaxed mb-8"
        >
          500+ entrepreneurs. ₹180Cr network revenue. Zero monthly software fees.{' '}
          <span className="text-slate-200 font-medium">Start from ₹13L, break even in 20 months.</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <GlowButton href="#roi-calc" size="lg">
            Calculate My ROI
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
          <GlowButton href="#demo-form" variant="outline" size="lg">
            Book Free Demo
          </GlowButton>
        </motion.div>

        {/* Mini live stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex items-center gap-6 mt-10 flex-wrap justify-center"
        >
          {[
            { v: '500+', l: 'Stores', color: '#22D3EE' },
            { v: '₹180Cr', l: 'Revenue', color: '#818CF8' },
            { v: '4.7★', l: 'Rating', color: '#F59E0B' },
            { v: '94%', l: 'Renewal', color: '#10B981' },
          ].map(({ v, l, color }) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-2xl font-black num" style={{ color, textShadow: `0 0 20px ${color}60` }}>{v}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-600 font-mono mt-0.5">{l}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, delay: 1.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ color: 'rgba(6,182,212,0.5)' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── Activity Ticker ── */}
      <div className="relative z-10 px-4 mb-4">
        <ActivityTicker />
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/*  STATS BAR                                         */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
              background: 'rgba(10,15,30,0.8)',
              border: '1px solid rgba(6,182,212,0.15)',
              boxShadow: '0 0 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(6,182,212,0.2)',
            }}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)' }} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x"
              style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {STATS.map(({ value, suffix, prefix, label, sub, color, decimals }, i) => (
                <div key={label} className="text-center px-4 relative">
                  <span style={{ color, textShadow: `0 0 24px ${color}50` }}>
                    <AnimatedCounter
                      value={value}
                      prefix={prefix}
                      suffix={suffix}
                      decimals={decimals ?? 0}
                      duration={2.5}
                      className="text-3xl md:text-4xl font-black num"
                    />
                  </span>
                  <p className="text-sm font-semibold text-slate-300 mt-1">{label}</p>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  USP FEATURES                                      */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Why UClean Stands Apart</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              Built for <GradientText>franchisee success</GradientText>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {USP_FEATURES.map(({ icon: Icon, title, sub, detail, color, bg, border, glow }, i) => (
              <GlassCard key={title} delay={i * 0.1} className="p-6 group" holo topGlow>
                <div
                  className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: bg, border: `1px solid ${border}`, boxShadow: `0 0 20px ${glow}` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="relative text-lg font-bold text-slate-100 mb-2">{title}</h3>
                <p className="relative text-sm font-semibold text-slate-400 mb-3">{sub}</p>
                <p className="relative text-sm text-slate-500 leading-relaxed">{detail}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  ROI CALCULATOR                                    */}
      {/* ════════════════════════════════════════════════════ */}
      <Section id="roi-calc" className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Interactive Calculator</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              See your <GradientText>exact returns</GradientText>
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              Based on averages from 500+ existing franchises. Adjust for your city.
            </p>
          </div>
          <ROICalculator />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  KEY NUMBERS GRID                                  */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
              background: 'rgba(10,15,30,0.7)',
              border: '1px solid rgba(6,182,212,0.12)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)' }} />
            <h3 className="text-xl font-black text-slate-100 mb-6 text-center">The UClean Advantage by Numbers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { v: '₹180Cr+', l: 'Network Revenue',    s: 'FY 2023–24',         c: '#22D3EE' },
                { v: '8 Months', l: 'Fastest Breakeven', s: 'on record',            c: '#10B981' },
                { v: '28 States', l: 'Pan-India Presence',s: '& growing',           c: '#818CF8' },
                { v: '94%',      l: 'Renewal Rate',       s: 'franchisees renew',   c: '#F59E0B' },
                { v: '6 Years',  l: 'Industry Experience',s: 'since 2018',          c: '#3B82F6' },
                { v: '24/7',     l: 'Dedicated Support',  s: 'manager assigned',    c: '#F472B6' },
              ].map(({ v, l, s, c }) => (
                <motion.div
                  key={l}
                  whileHover={{ scale: 1.04, y: -3 }}
                  className="text-center p-4 rounded-xl cursor-default"
                  style={{
                    background: 'rgba(20,30,55,0.5)',
                    border: `1px solid ${c}25`,
                    boxShadow: `0 0 20px ${c}08`,
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  <p className="text-2xl font-black num" style={{ color: c, textShadow: `0 0 20px ${c}50` }}>{v}</p>
                  <p className="text-sm font-semibold text-slate-300 mt-1">{l}</p>
                  <p className="text-xs text-slate-600">{s}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  TESTIMONIALS                                      */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Real Owners. Real Results.</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              Hear from our <GradientText>franchisees</GradientText>
            </h2>
          </div>
          <TestimonialCarousel />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  COMPARISON TABLE                                  */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Informed Decision</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              Compare before you <GradientText>decide</GradientText>
            </h2>
          </div>
          <ComparisonTable />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  HOW IT WORKS                                      */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>5-Step Journey</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              From interest to <GradientText>open store</GradientText>
            </h2>
          </div>
          <div className="relative">
            {/* Vertical connector */}
            <div
              className="absolute left-5 top-10 bottom-10 w-px"
              style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.1) 100%)' }}
            />

            <div className="space-y-4">
              {STEPS.map(({ num, title, desc }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-5 p-4 rounded-xl"
                  style={{
                    background: 'rgba(12,20,42,0.6)',
                    border: '1px solid rgba(6,182,212,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
                      border: '1px solid rgba(6,182,212,0.3)',
                      color: '#22D3EE',
                      boxShadow: '0 0 16px rgba(6,182,212,0.15)',
                    }}
                  >
                    {num}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-bold text-slate-100 text-sm">{title}</p>
                    <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  BOOK DEMO FORM                                    */}
      {/* ════════════════════════════════════════════════════ */}
      <Section id="demo-form" className="px-4 pb-20">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Get Started Today</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-slate-50">
              Book your <GradientText>free demo</GradientText>
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              No pressure. Just clarity. Our expert calls you within 24 hours.
            </p>
          </div>
          <BookDemoForm />
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  TRUST BADGES                                      */}
      {/* ════════════════════════════════════════════════════ */}
      <Section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }, i) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-5 text-center rounded-2xl"
              style={{
                background: 'rgba(10,15,30,0.7)',
                border: '1px solid rgba(6,182,212,0.12)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.3s',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.2)',
                  boxShadow: '0 0 16px rgba(6,182,212,0.1)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: '#22D3EE' }} />
              </div>
              <p className="text-sm font-bold text-slate-200">{label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  FOOTER                                            */}
      {/* ════════════════════════════════════════════════════ */}
      <footer className="relative z-10 py-12 px-4">
        <div className="divider-neon mb-8" />
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <Logo size={40} />
          <p className="text-slate-500 text-sm font-medium">India&apos;s premium tech-first laundry franchise network</p>
          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
            <Zap className="w-3 h-3" />
            <span>UClean Command Center · Exhibition Mode · Live Data</span>
          </div>
          <p className="text-xs text-slate-700 text-center max-w-md mt-2">
            ROI figures are indicative based on network averages. Individual results may vary.
            UClean is a registered trademark.
          </p>
        </div>
      </footer>
    </div>
  );
}
