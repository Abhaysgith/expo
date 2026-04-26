'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { loadTestimonials } from '@/lib/dataLoader';
import type { Testimonial } from '@/lib/dataLoader';

const AVATAR_GRADIENTS = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-700',
  'from-indigo-500 to-blue-700',
  'from-green-500 to-emerald-700',
  'from-cyan-400 to-violet-600',
  'from-red-500 to-pink-600',
  'from-sky-500 to-indigo-600',
];

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    loadTestimonials().then(d => setTestimonials(d.testimonials)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const t = setInterval(() => { setDir(1); setIdx(i => (i + 1) % testimonials.length); }, 6000);
    return () => clearInterval(t);
  }, [testimonials]);

  const goTo = (newIdx: number) => {
    setDir(newIdx > idx ? 1 : -1);
    setIdx(newIdx);
  };
  const prev = () => goTo((idx - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((idx + 1) % testimonials.length);

  if (!testimonials.length) {
    return (
      <div className="glass-card p-8 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-40 mb-4" />
        <div className="h-24 bg-slate-800/50 rounded-xl mb-4" />
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800" />
          <div className="flex-1">
            <div className="h-3 bg-slate-800 rounded w-32 mb-2" />
            <div className="h-2 bg-slate-800/50 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  const t = testimonials[idx];
  const initials = t.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

  const variants = {
    enter: { opacity: 0, x: dir * 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: dir * -40 },
  };

  return (
    <GlassCard className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-yellow-500/10">
          <Quote className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Franchisee Stories</h3>
          <p className="text-xs text-slate-500">From real UClean owners</p>
        </div>
      </div>

      {/* Carousel area */}
      <div className="relative overflow-hidden" style={{ minHeight: 270 }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {/* Highlight badge */}
            <div className="inline-flex items-center gap-2 badge-cyan mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {t.highlight}
            </div>

            {/* Quote */}
            <blockquote className="text-slate-300 text-[0.9375rem] leading-relaxed italic mb-6">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white text-base flex-shrink-0`}>
                {initials}
              </div>
              <div>
                <p className="font-semibold text-slate-100">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{t.businessAge}</span>
                  <span className="text-xs font-bold text-emerald-400 num">{t.monthlyRevenue}/mo</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800/60">
        <button
          onClick={prev}
          className="p-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-200 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`carousel-dot transition-all ${i === idx ? 'active' : ''}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-200 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
