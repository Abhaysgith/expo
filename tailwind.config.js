/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0F172A',
          900: '#1E293B',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#94A3B8',
          400: '#CBD5E1',
          300: '#E2E8F0',
          200: '#F1F5F9',
          100: '#F8FAFC',
        },
        brand: {
          DEFAULT: '#1E3A8A',
          light: '#2563EB',
          dark: '#1E40AF',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          400: '#22D3EE',
          300: '#67E8F9',
          200: '#A5F3FC',
          glow: 'rgba(6, 182, 212, 0.15)',
          'glow-strong': 'rgba(6, 182, 212, 0.35)',
        },
        // New: neon intensity palette
        neon: {
          cyan:   '#00FFEA',
          blue:   '#0066FF',
          violet: '#9F00FF',
          green:  '#00FF88',
          amber:  '#FFB700',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display':  ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-2':['5rem',   { lineHeight: '1.0',  letterSpacing: '-0.04em', fontWeight: '900' }],
        'h1':       ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2':       ['2rem',   { lineHeight: '1.2',  fontWeight: '700' }],
        'h3':       ['1.5rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'body-lg':  ['1.125rem', { lineHeight: '1.6', fontWeight: '500' }],
        'body':     ['1rem',   { lineHeight: '1.6' }],
        'sm':       ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'xs':       ['0.75rem', { lineHeight: '1.5' }],
      },
      backgroundImage: {
        'gradient-hero':    'linear-gradient(135deg, #06B6D4 0%, #1E3A8A 100%)',
        'gradient-card':    'radial-gradient(circle at top, rgba(6, 182, 212, 0.12), transparent 70%)',
        'gradient-border':  'linear-gradient(90deg, #06B6D4, #1E3A8A)',
        'gradient-text':    'linear-gradient(135deg, #22D3EE 0%, #3B82F6 50%, #1E3A8A 100%)',
        'gradient-radial':  'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 100%)',
        'gradient-neon':    'linear-gradient(135deg, #00FFEA 0%, #0066FF 50%, #9F00FF 100%)',
        'gradient-scan':    'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.04) 50%, transparent 100%)',
        'gradient-command': 'linear-gradient(180deg, rgba(6,182,212,0.06) 0%, rgba(15,23,42,0) 100%)',
        // Backgrounds
        'grid-dots':  'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.08) 1px, transparent 0)',
        'grid-fine':  'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.04) 1px, transparent 0)',
        'circuit':    'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(to right, rgba(6,182,212,0.04) 1px, transparent 1px)',
        'mesh-hero': `
          radial-gradient(at 20% 20%, rgba(6,182,212,0.18) 0px, transparent 50%),
          radial-gradient(at 80% 10%, rgba(30,58,138,0.25) 0px, transparent 50%),
          radial-gradient(at 50% 90%, rgba(6,182,212,0.10) 0px, transparent 50%)
        `,
        'mesh-command': `
          radial-gradient(at 0%   0%,   rgba(0,255,234,0.07) 0px, transparent 40%),
          radial-gradient(at 100% 0%,   rgba(0,102,255,0.10) 0px, transparent 40%),
          radial-gradient(at 50%  100%, rgba(6,182,212,0.06) 0px, transparent 40%)
        `,
      },
      backgroundSize: {
        'grid':    '40px 40px',
        'circuit': '60px 60px',
      },
      boxShadow: {
        // Base glows
        'glow-sm':  '0 0 20px rgba(6, 182, 212, 0.2)',
        'glow':     '0 0 40px rgba(6, 182, 212, 0.3)',
        'glow-lg':  '0 0 60px rgba(6, 182, 212, 0.45)',
        'glow-xl':  '0 0 100px rgba(6, 182, 212, 0.5)',
        // Cards
        'card':     '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(6,182,212,0.1) inset',
        'card-hover':'0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.2)',
        // Buttons
        'button':   '0 4px 20px rgba(6,182,212,0.4)',
        'button-hover':'0 8px 40px rgba(6,182,212,0.6)',
        // Neon
        'neon-cyan':   '0 0 4px #00FFEA, 0 0 16px rgba(0,255,234,0.5), 0 0 40px rgba(0,255,234,0.2)',
        'neon-blue':   '0 0 4px #0066FF, 0 0 16px rgba(0,102,255,0.5), 0 0 40px rgba(0,102,255,0.2)',
        'neon-violet': '0 0 4px #9F00FF, 0 0 16px rgba(159,0,255,0.5), 0 0 40px rgba(159,0,255,0.2)',
        'neon-green':  '0 0 4px #00FF88, 0 0 16px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.2)',
        // Command center holo card
        'holo': '0 0 60px rgba(6,182,212,0.15), 0 0 120px rgba(30,58,138,0.10), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(6,182,212,0.08)',
        'holo-hover': '0 0 80px rgba(6,182,212,0.25), 0 0 160px rgba(30,58,138,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        // Edge lighting
        'edge-top':   'inset 0 1px 0 rgba(6,182,212,0.5)',
        'edge-bottom':'inset 0 -1px 0 rgba(6,182,212,0.2)',
      },
      animation: {
        // Existing
        'pulse-glow':  'pulseGlow 2.5s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 10s ease-in-out infinite',
        'ticker':      'ticker 35s linear infinite',
        'gradient-shift':'gradientShift 8s ease infinite',
        'slide-in-right':'slideInRight 0.4s ease-out',
        'fade-up':     'fadeUp 0.5s ease-out',
        'shimmer':     'shimmer 2s linear infinite',
        'border-spin': 'borderSpin 4s linear infinite',
        'particle':    'particle 8s ease-in-out infinite',
        // New
        'scan':        'scan 4s linear infinite',
        'scan-fast':   'scan 2s linear infinite',
        'streak':      'streak 5s ease-in-out infinite',
        'radar':       'radar 4s linear infinite',
        'data-flow':   'dataFlow 3s linear infinite',
        'pulse-neon':  'pulseNeon 2s ease-in-out infinite',
        'flicker':     'flicker 0.15s ease-in-out infinite',
        'type':        'type 0.5s steps(20) forwards',
        'glow-border': 'glowBorder 3s linear infinite',
        'bg-pan':      'bgPan 20s linear infinite',
        'grid-move':   'gridMove 8s linear infinite',
      },
      keyframes: {
        // Existing
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6,182,212,0.2)' },
          '50%':      { boxShadow: '0 0 80px rgba(6,182,212,0.6), 0 0 160px rgba(6,182,212,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        borderSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        particle: {
          '0%,100%': { transform: 'translateY(0) translateX(0) scale(1)',    opacity: '0.3' },
          '33%':     { transform: 'translateY(-30px) translateX(15px) scale(1.1)', opacity: '0.6' },
          '66%':     { transform: 'translateY(-10px) translateX(-10px) scale(0.9)', opacity: '0.4' },
        },
        // New keyframes
        scan: {
          '0%':   { top: '-2%',   opacity: '1' },
          '80%':  { opacity: '1' },
          '100%': { top: '102%',  opacity: '0' },
        },
        streak: {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '10%':  { opacity: '0.7' },
          '90%':  { opacity: '0.7' },
          '100%': { transform: 'translateX(400%)', opacity: '0' },
        },
        radar: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        dataFlow: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 60px' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%':      { opacity: '1',   filter: 'brightness(1.4)' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
        },
        glowBorder: {
          '0%':   { borderColor: 'rgba(6,182,212,0.3)' },
          '50%':  { borderColor: 'rgba(6,182,212,0.8)' },
          '100%': { borderColor: 'rgba(6,182,212,0.3)' },
        },
        bgPan: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        gridMove: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs':  '2px',
        'sm':  '4px',
        DEFAULT: '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};
