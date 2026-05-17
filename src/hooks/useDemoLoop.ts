'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type DemoSlide = 'hero' | 'metrics' | 'process' | 'map' | 'enterprise';

export const DEMO_SLIDES: DemoSlide[] = [
  'hero',
  'metrics',
  'process',
  'map',
  'enterprise',
];

const SLIDE_DURATION: Record<DemoSlide, number> = {
  hero:       7000,   // extended — big impact moment needs time to land
  metrics:    12000,
  process:    10000,
  map:        10000,
  enterprise: 7000,
};

interface DemoLoopState {
  currentSlide: DemoSlide;
  currentIndex: number;
  progress: number;       // 0–100, for progress bar
  isPlaying: boolean;
  goTo: (slide: DemoSlide) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
}

export function useDemoLoop(): DemoLoopState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(true);
  const [progress, setProgress]         = useState(0);

  const progressRef  = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const startRef     = useRef<number>(performance.now());
  const isPlayingRef = useRef(true);
  const indexRef     = useRef(0);

  const currentSlide = DEMO_SLIDES[currentIndex];
  const duration     = SLIDE_DURATION[currentSlide];

  const advance = useCallback(() => {
    setCurrentIndex(prev => {
      const next = (prev + 1) % DEMO_SLIDES.length;
      indexRef.current = next;
      return next;
    });
    progressRef.current = 0;
    startRef.current    = performance.now();
  }, []);

  // ── RAF progress loop ─────────────────────────────────
  useEffect(() => {
    const dur = SLIDE_DURATION[DEMO_SLIDES[currentIndex]];

    const tick = (now: number) => {
      if (!isPlayingRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed  = now - startRef.current;
      const pct      = Math.min((elapsed / dur) * 100, 100);
      progressRef.current = pct;
      setProgress(Math.floor(pct));

      if (pct >= 100) {
        advance();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    startRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentIndex, advance]);

  const goTo = useCallback((slide: DemoSlide) => {
    const idx = DEMO_SLIDES.indexOf(slide);
    if (idx !== -1) {
      setCurrentIndex(idx);
      indexRef.current    = idx;
      progressRef.current = 0;
      startRef.current    = performance.now();
      setProgress(0);
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      isPlayingRef.current = !prev;
      if (!prev) startRef.current = performance.now() - (progressRef.current / 100) * duration;
      return !prev;
    });
  }, [duration]);

  const pause = useCallback(() => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (!isPlayingRef.current) {
      startRef.current = performance.now() - (progressRef.current / 100) * SLIDE_DURATION[DEMO_SLIDES[indexRef.current]];
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(prev => {
      const n = (prev + 1) % DEMO_SLIDES.length;
      indexRef.current    = n;
      progressRef.current = 0;
      startRef.current    = performance.now();
      setProgress(0);
      return n;
    });
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex(prev => {
      const n = (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length;
      indexRef.current    = n;
      progressRef.current = 0;
      startRef.current    = performance.now();
      setProgress(0);
      return n;
    });
  }, []);

  return { currentSlide, currentIndex, progress, isPlaying, goTo, togglePlay, pause, resume, next, prev };
}
