'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, IndianRupee, MessageSquare,
  Send, CheckCircle2, ArrowRight, Loader2, ChevronDown, WifiOff, Download,
  LogIn, Lock, X, ShieldCheck
} from 'lucide-react';
import { saveLeadOffline, getPendingLeads } from '@/features/offline-sync/indexeddb';
import { v4 as uuidv4 } from 'uuid';

// ── Inline Login Modal ─────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess }: {
  onClose: () => void;
  onSuccess: (role: string) => void;
}) {
  const [tab, setTab]           = useState<'sales' | 'admin'>('sales');
  const [identifier, setId]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid credentials'); return; }
      onSuccess(data.data.user.role);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <h2 className="text-xl font-black text-slate-800 mb-1">Sign In</h2>
        <p className="text-xs text-slate-400 mb-5">Access your UClean account</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-slate-100 rounded-xl p-1">
          {(['sales', 'admin'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize flex items-center justify-center gap-1.5"
              style={{
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#15803D' : '#94A3B8',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {t === 'sales' ? 'Sales' : 'Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
              {tab === 'admin' ? 'Username / Email' : 'Phone / Email'}
            </label>
            <input
              required
              value={identifier}
              onChange={e => setId(e.target.value)}
              placeholder={tab === 'admin' ? 'admin@uclean.in' : 'your phone or email'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-1"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const BUDGET_OPTIONS = [
  { value: "22L - 24L", label: "₹22 Lakhs - ₹24 Lakhs" },
  { value: "45L - 65L", label: "₹45 Lakhs - ₹65 Lakhs" },
  { value: "Depends on City", label: "Varies by City Price" },
];

export default function FranchiseCTA() {
  const [salesUser, setSalesUser] = useState<{ name: string; phone: string } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    preferredLocation: '',
    investmentBudget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check if a sales person is logged in
  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data?.data?.user?.role === 'sales') {
          setSalesUser({ name: data.data.user.name, phone: data.data.user.phone });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      city: formData.city,
      preferredLocation: formData.preferredLocation,
      budget: formData.investmentBudget,
      note: formData.message,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to save. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      // Only save offline for true network failures (TypeError = fetch failed)
      if (err instanceof TypeError) {
        await saveLeadOffline({
          id: uuidv4(),
          customerName: formData.name,
          customerEmail: formData.email || undefined,
          customerPhone: formData.phone,
          city: formData.city,
          preferredLocation: formData.preferredLocation || undefined,
          budget: formData.investmentBudget || undefined,
          note: formData.message || undefined,
          ownerName: salesUser?.name,
          ownerPhone: salesUser?.phone,
          syncStatus: 'pending',
          createdAt: new Date().toISOString(),
        });
        setSavedOffline(true);
        setSubmitted(true);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = (role: string) => {
    setShowLogin(false);
    if (role === 'admin') {
      window.location.href = '/admin/leads';
    } else {
      // Redirect to dedicated form page after sales login
      window.location.href = '/form';
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', city: '', preferredLocation: '', investmentBudget: '', message: '' });
    setSubmitted(false);
    setSavedOffline(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch server leads (may fail if offline)
      type ServerLead = Record<string, string | null>;
      let serverLeads: ServerLead[] = [];
      try {
        const res = await fetch('/api/leads/my');
        if (res.ok) {
          const { data } = await res.json();
          serverLeads = data?.leads ?? [];
        }
      } catch { /* offline — skip server fetch */ }

      // Always fetch offline pending leads from IndexedDB
      const offlineLeads = await getPendingLeads();
      // Filter to only this sales person's offline leads
      const myOffline = offlineLeads.filter(
        l => !salesUser || l.ownerName === salesUser.name
      );

      // Build unified rows — server leads first, then pending offline
      const serverRows = serverLeads.map((l: ServerLead) => [
        l.customer_name ?? '', l.customer_phone ?? '', l.customer_email ?? '',
        l.city ?? '', l.preferred_location ?? '', l.budget ?? '', (l.note ?? '').replace(/,/g, ';'),
        l.status ?? '', l.whatsapp_status ?? '',
        new Date(l.created_at as string).toLocaleString('en-IN'),
        'Synced',
      ]);
      const offlineRows = myOffline.map(l => [
        l.customerName, l.customerPhone, l.customerEmail ?? '',
        l.city, l.preferredLocation ?? '', l.budget ?? '', (l.note ?? '').replace(/,/g, ';'),
        'new', '—',
        new Date(l.createdAt).toLocaleString('en-IN'),
        'Pending (offline)',
      ]);

      const allRows = [...serverRows, ...offlineRows];
      if (allRows.length === 0) { alert('No leads yet.'); setDownloading(false); return; }

      const headers = ['Name', 'Phone', 'Email', 'City', 'Preferred Location', 'Budget', 'Note', 'Status', 'WhatsApp', 'Created At', 'Sync'];
      const csv = [headers, ...allRows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ }
    setDownloading(false);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center text-center px-6"
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${savedOffline ? 'bg-amber-500/10' : 'bg-green-500/10'}`}>
          {savedOffline
            ? <WifiOff className="w-12 h-12 text-amber-500" />
            : <CheckCircle2 className="w-12 h-12 text-green-500" />
          }
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-4">
          {savedOffline ? 'Saved Offline!' : 'Lead Captured!'}
        </h2>
        <p className="text-slate-600 text-xl max-w-md mb-8">
          {savedOffline
            ? 'No network detected. Lead saved locally and will sync automatically when back online.'
            : 'Prospect details saved securely. Ready for the next one.'
          }
        </p>
        <button
          onClick={handleReset}
          className="px-10 py-4 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          Capture Next Lead
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
        )}
      </AnimatePresence>

    <div className="flex flex-col items-center justify-start sm:justify-center w-full max-w-xl mx-auto pb-8">
      <div className="w-full">
        <div className="text-center mb-6 relative">
          {/* Login button — only shown when not logged in */}
          {!salesUser && (
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="absolute right-0 top-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#15803D' }}
            >
              <LogIn className="w-3 h-3" />
              Login
            </button>
          )}

          {salesUser && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-xs font-semibold text-green-600 tracking-wide">
                👤 {salesUser.name}
              </p>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                title="Download my leads"
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-green-100 disabled:opacity-50"
                style={{ color: '#16A34A' }}
              >
                {downloading
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Download className="w-3 h-3" />
                }
              </button>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: '#000000' }}>
            Capture <span className="text-green-600">Lead</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: '#374151' }}>Enter prospective partner details</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-2 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                Email <span className="text-slate-500 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all"
                placeholder="john@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all"
                placeholder="+91 98765..."
              />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all"
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              Preferred Location <span className="text-slate-500 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.preferredLocation}
              onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
              className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all"
              placeholder="e.g. Andheri West, Mumbai"
            />
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
              <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              Investment Budget <span className="text-slate-500 normal-case font-normal">(optional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border ${isDropdownOpen ? 'border-green-500' : 'border-slate-400'} rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-left transition-all flex items-center justify-between outline-none ${!formData.investmentBudget ? 'text-slate-500' : 'text-slate-900'}`}
              >
                {formData.investmentBudget ? BUDGET_OPTIONS.find(o => o.value === formData.investmentBudget)?.label : 'Select Range'}
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-green-500' : 'text-slate-400'}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden"
                  >
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, investmentBudget: option.value });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm sm:text-base hover:bg-green-50 transition-colors ${
                          formData.investmentBudget === option.value 
                            ? 'bg-green-50/80 text-green-700 font-bold' 
                            : 'text-slate-700 font-medium'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              Note <span className="text-slate-500 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              rows={1}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white border border-slate-400 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 focus:outline-none focus:border-green-500 transition-all resize-none"
              placeholder="Any specific questions?"
            />
          </div>

          {submitError && (
            <div className="text-red-500 text-xs text-center bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 mt-2 sm:mt-4 group"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Save Lead Details
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
