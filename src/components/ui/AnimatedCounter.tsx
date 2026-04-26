'use client';

import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  separator?: string;
}

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2.2,
  className = '',
  separator = ',',
}: AnimatedCounterProps) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Trigger when element enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`num tabular-nums ${className}`}>
      {started ? (
        <CountUp
          start={0}
          end={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={duration}
          separator={separator}
          useEasing
          easingFn={(t, b, c, d) => {
            // Cubic ease-out for smooth deceleration
            t /= d;
            return -c * (--t) * t * t * t + c + b;
          }}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
