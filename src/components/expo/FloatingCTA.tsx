'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

const SHOW_AFTER_MS  = 18000;   // first appearance
const VISIBLE_FOR_MS = 6000;    // how long it stays
const REPEAT_EVERY_MS = 28000;  // cycle interval

/**
 * Non-intrusive floating franchise CTA.
 * Appears bottom-right every ~28s, auto-dismisses after 6s.
 * Never blocks the main content.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let hideTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), VISIBLE_FOR_MS);
    };

    const initial = setTimeout(show, SHOW_AFTER_MS);
    const loop    = setInterval(show, REPEAT_EVERY_MS);

    return () => {
      clearTimeout(initial);
      clearTimeout(hideTimer);
      clearInterval(loop);
    };
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-24 right-5 z-[55] w-72 rounded-2xl bg-white"
          style={{
            border: '1px solid rgba(22,163,74,0.22)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(22,163,74,0.06)',
          }}
        >
          {/* Top green accent line */}
          <div className="h-1 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #15803D, #22C55E, #4ADE80)' }} />

          <div className="p-5">
            {/* Dismiss */}
            <button
              onClick={() => { setVisible(false); setDismissed(true); }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Icon badge */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(22,163,74,0.10)', border: '1px solid rgba(22,163,74,0.20)' }}>
              <span className="text-xl">🧺</span>
            </div>

            {/* Copy */}
            <p className="font-black text-slate-800 leading-tight mb-1"
              style={{ fontSize: '1.3rem' }}>
              Start Your UClean Store
            </p>
            <p className="mb-4 leading-snug font-medium"
              style={{ fontSize: '1.1rem', color: '#374151' }}>
              Be fully operational in{' '}
              <span className="font-bold text-green-700">30 days</span>.
              Starts from ₹22L.
            </p>

            {/* QR placeholder + CTA row */}
            <div className="flex items-center gap-3">
              {/* QR placeholder */}
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.18)' }}>
                <div className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        background: [0,2,4,6,8].includes(i)
                          ? 'rgba(22,163,74,0.85)'
                          : 'rgba(22,163,74,0.20)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <p className="mb-2 font-bold uppercase tracking-widest" style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#374151' }}>
                  SCAN TO APPLY
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #16A34A, #15803D)',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                  }}
                >
                  Learn More
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* Trust micro-line */}
            <p className="text-center mt-3 font-medium" style={{ fontSize: '0.95rem', color: '#374151' }}>
              ⭐ 4.7 rated · 94% franchise renewal rate
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
