'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-4 text-lg',
};

export default function GlowButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  loading = false,
}: GlowButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-300 relative overflow-hidden select-none
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-950
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${sizes[size]} ${className}
  `;

  const variants = {
    primary: 'btn-glow text-white',
    outline: 'btn-outline',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/50 px-4',
  };

  const content = (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.03, y: -1 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={`${base} ${variants[variant]}`}
    >
      {/* Shine sweep on hover */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}

      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
