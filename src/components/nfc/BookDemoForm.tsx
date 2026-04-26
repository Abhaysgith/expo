'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, WifiOff, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { generateLeadId, type Lead } from '@/lib/exportLeads';

const BUDGETS = ['Under ₹15 Lakhs', '₹15L – ₹20L', '₹20L – ₹30L', '₹30L+'];
const TIERS = ['Tier 1 (Metro)', 'Tier 2 (Large City)', 'Tier 3 (Small City)'];

const INIT = { name: '', email: '', phone: '', city: '', investmentBudget: BUDGETS[1], cityTier: TIERS[0], message: '' };

function SuccessScreen({ offline, onReset }: { offline: boolean; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </motion.div>

      <h3 className="text-2xl font-bold text-slate-50 mb-2">Request Received! 🎉</h3>
      <p className="text-slate-400 mb-4">
        Our franchise expert will call you within <span className="text-cyan-400 font-semibold">24 hours</span>.
      </p>

      {offline && (
        <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-400 mb-5">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Saved locally — will sync when you're back online.</span>
        </div>
      )}

      <button
        onClick={onReset}
        className="text-sm text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors"
      >
        Submit another enquiry
      </button>
    </motion.div>
  );
}

export default function BookDemoForm() {
  const isOffline = useOfflineStatus();
  const [leads, setLeads] = useLocalStorage<Lead[]>('uclean-leads', []);
  const [form, setForm] = useState(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confettiLoaded, setConfettiLoaded] = useState(false);

  // Lazy-load confetti only in browser
  useEffect(() => { setConfettiLoaded(true); }, []);

  const fireConfetti = async () => {
    if (typeof window === 'undefined' || !confettiLoaded) return;
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#06B6D4', '#22D3EE', '#818CF8', '#10B981', '#F59E0B'],
      });
    } catch { /* ignore */ }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const lead: Lead = {
      id: generateLeadId(),
      ...form,
      submittedAt: new Date().toISOString(),
      source: 'nfc',
      syncStatus: isOffline ? 'pending' : 'synced',
    };

    setLeads(prev => [...prev, lead]);
    setLoading(false);
    setSubmitted(true);
    fireConfetti();
  };

  if (submitted) {
    return (
      <GlassCard className="p-8">
        <SuccessScreen offline={isOffline} onReset={() => { setSubmitted(false); setForm(INIT); }} />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8" topGlow>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-50">Book a Free Demo</h3>
          <p className="text-sm text-slate-500">
            No pressure. Just answers.
            {isOffline && <span className="ml-2 text-amber-400 text-xs">(Offline: saved locally)</span>}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Full Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Rahul Sharma" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Phone *</label>
            <input name="phone" required type="tel" pattern="[6-9][0-9]{9}" value={form.phone} onChange={handleChange} placeholder="9876543210" className="input-premium" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Your City *</label>
            <input name="city" required value={form.city} onChange={handleChange} placeholder="Pune" className="input-premium" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Investment Budget</label>
            <select name="investmentBudget" value={form.investmentBudget} onChange={handleChange} className="input-premium">
              {BUDGETS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">City Type</label>
            <select name="cityTier" value={form.cityTier} onChange={handleChange} className="input-premium">
              {TIERS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 font-medium mb-1.5">Message (optional)</label>
          <textarea
            name="message" rows={3} value={form.message} onChange={handleChange}
            placeholder="Questions about investment, location, ROI..."
            className="input-premium resize-none"
          />
        </div>

        <GlowButton type="submit" loading={loading} className="w-full justify-center py-4 text-base mt-2">
          <Send className="w-4 h-4" />
          Book Free Demo
        </GlowButton>

        <p className="text-center text-xs text-slate-600">
          🔒 Your information is stored locally. We never share your data.
        </p>
      </form>
    </GlassCard>
  );
}
