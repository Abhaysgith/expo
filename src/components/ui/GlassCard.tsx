'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
  onClick?: () => void;
  topGlow?: boolean;
  neon?: boolean;
  holo?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  delay = 0,
  onClick,
  topGlow = false,
  neon = false,
  holo = false,
}: GlassCardProps) {
  const baseStyle = holo
    ? {
        background: 'rgba(10,15,32,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '1.25rem',
        border: '1px solid rgba(6,182,212,0.18)',
        boxShadow: `
          0 0 60px rgba(6,182,212,0.10),
          0 0 120px rgba(30,58,138,0.06),
          inset 0 1px 0 rgba(255,255,255,0.05),
          inset 0 -1px 0 rgba(6,182,212,0.06),
          0 12px 40px rgba(0,0,0,0.5)
        `,
      }
    : {
        background: 'rgba(14,22,44,0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '1.25rem',
        border: '1px solid rgba(6,182,212,0.1)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(6,182,212,0.07),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `,
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? {
        y: -5,
        scale: 1.015,
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      } : undefined}
      onClick={onClick}
      className={[
        'relative overflow-hidden',
        glow ? 'animate-pulse-glow' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
      style={{
        ...baseStyle,
        transition: 'box-shadow 0.4s, border-color 0.4s',
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Top shimmer edge */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.5) 30%, rgba(0,255,234,0.3) 50%, rgba(6,182,212,0.5) 70%, transparent 100%)',
        }}
      />

      {/* Inner top glow */}
      {topGlow && (
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(6,182,212,0.14) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Hover border glow (pseudo via box-shadow — handled in CSS) */}
      {neon && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ border: '1px solid rgba(0,255,234,0.0)' }}
          whileHover={{ borderColor: 'rgba(0,255,234,0.5)', boxShadow: '0 0 20px rgba(0,255,234,0.15) inset' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
