'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed');
        return;
      }
      if (data.data.user.role !== 'admin') {
        setError('This login is for admin users only');
        return;
      }
      router.push('/admin/leads');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-command flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background mesh */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(at 30% 30%, rgba(22,163,74,0.08) 0px, transparent 50%), radial-gradient(at 70% 70%, rgba(21,128,61,0.06) 0px, transparent 50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4 relative">
            <span className="text-2xl font-black text-green-400">U</span>
            <Shield className="w-4 h-4 text-green-500 absolute -top-1.5 -right-1.5" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">
            UClean Lead Management System
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(15, 23, 42, 0.60)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(22,163,74,0.20)',
          }}
        >
          <h2 className="text-lg font-bold text-white mb-6">
            Administrator Sign In
          </h2>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-500" />
                Email or Username
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-premium"
                placeholder="admin@uclean.in or admin"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Admin access only — UClean Franchise Management
        </p>
      </motion.div>
    </div>
  );
}
