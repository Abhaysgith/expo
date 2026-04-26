import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'subtle';
}

const variants = {
  default: 'gradient-text',
  hero: 'gradient-text-hero',
  subtle: 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent',
};

export default function GradientText({ children, className = '', variant = 'default' }: GradientTextProps) {
  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
