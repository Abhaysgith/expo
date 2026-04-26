import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 36, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/uclean-logo.png"
        alt="UClean Logo"
        width={size * 4}
        height={size}
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
}
