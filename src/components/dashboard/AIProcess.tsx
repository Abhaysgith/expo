'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Droplets, Settings, Truck, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    id: 0,
    icon: Scan,
    label: 'SCAN',
    title: 'Order Received',
    detail: 'QR / NFC tag verified',
    color: '#22C55E',
    glow: 'rgba(34,211,238,0.4)',
  },
  {
    id: 1,
    icon: Droplets,
    label: 'CLEAN',
    title: 'AI Cleaning',
    detail: 'Optimal cycle selected',
    color: '#818CF8',
    glow: 'rgba(129,140,248,0.4)',
  },
  {
    id: 2,
    icon: Settings,
    label: 'PROCESS',
    title: 'QC Inspection',
    detail: 'Computer vision scan',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.4)',
  },
  {
    id: 3,
    icon: Truck,
    label: 'DELIVER',
    title: 'Out for Delivery',
    detail: 'Live GPS tracking on',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.4)',
  },
];

const ORDER_IDS = ['UCO-8291', 'UCO-8304', 'UCO-8317', 'UCO-8339', 'UCO-8351'];

export default function AIProcess() {
  const [active, setActive] = useState(0);
  const [orderId, setOrderId] = useState(ORDER_IDS[0]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setActive(prev => {
        if (prev >= STEPS.length - 1) {
          setOrderId(ORDER_IDS[Math.floor(Math.random() * ORDER_IDS.length)]);
          return 0;
        }
        return prev + 1;
      });
    }, 2200);
    return () => clearInterval(cycle);
  }, []);

  const handleManualTrigger = () => {
    if (processing) return;
    setProcessing(true);
    setActive(0);
    setOrderId(`UCO-${8400 + Math.floor(Math.random() * 99)}`);
    setTimeout(() => setProcessing(false), 2200 * STEPS.length);
  };

  const currentStep = STEPS[active];

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 md:p-6"
      style={{
        background: 'rgba(10,15,30,0.8)',
        border: '1px solid rgba(6,182,212,0.14)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Corner brackets */}
      {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c, i) => (
        <div key={i} className={`absolute ${c} w-5 h-5`} style={{ borderColor: 'rgba(6,182,212,0.4)' }} />
      ))}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <Scan className="w-4 h-4" style={{ color: '#22C55E' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Process Engine</h3>
            <p className="text-[10px] text-slate-600 font-mono">Order: {orderId}</p>
          </div>
        </div>
        <button
          onClick={handleManualTrigger}
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all"
          style={{
            color: '#22C55E',
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.2)',
          }}
        >
          Trigger
        </button>
      </div>

      {/* Steps row */}
      <div className="flex items-center gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {STEPS.map((step, i) => {
          const isDone   = i < active;
          const isCurrent = i === active;
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 min-w-0">
              {/* Step node */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center relative z-10 cursor-pointer"
                  style={{
                    background: isCurrent
                      ? `rgba(${step.color === '#22C55E' ? '34,197,94' : step.color === '#818CF8' ? '129,140,248' : step.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.15)`
                      : isDone ? 'rgba(16,185,129,0.12)' : 'rgba(30,41,59,0.6)',
                    border: `1px solid ${isCurrent ? step.color : isDone ? '#10B981' : 'rgba(71,85,105,0.5)'}`,
                    boxShadow: isCurrent ? `0 0 16px ${step.glow}` : 'none',
                  }}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: isCurrent ? Infinity : 0 }}
                  onClick={() => setActive(i)}
                >
                  {isDone
                    ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#10B981' }} />
                    : <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: isCurrent ? step.color : '#475569' }} />
                  }
                </motion.div>
                {/* Pulse ring */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1px solid ${step.color}` }}
                    animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px relative overflow-hidden"
                  style={{ background: 'rgba(71,85,105,0.4)' }}>
                  {isDone && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(90deg, #10B981, rgba(16,185,129,0.3))' }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  {isCurrent && (
                    <motion.div
                      className="absolute top-0 left-0 h-full w-10"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)' }}
                      animate={{ x: ['-100%', '800%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl p-4"
          style={{
            background: `rgba(${currentStep.color === '#22C55E' ? '34,197,94' : currentStep.color === '#818CF8' ? '129,140,248' : currentStep.color === '#F59E0B' ? '245,158,11' : '16,185,129'},0.05)`,
            border: `1px solid ${currentStep.color}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: currentStep.label === 'PROCESS' ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <currentStep.icon className="w-5 h-5" style={{ color: currentStep.color }} />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: currentStep.color }}>{currentStep.title}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider"
                  style={{ color: `${currentStep.color}80` }}>
                  [{currentStep.label}]
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentStep.detail}</p>
            </div>
            {/* Progress bar */}
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(71,85,105,0.4)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: currentStep.color, boxShadow: `0 0 8px ${currentStep.glow}` }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step labels */}
      <div className="flex mt-3 gap-2">
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest"
            style={{ color: i === active ? step.color : i < active ? '#10B981' : '#334155' }}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
