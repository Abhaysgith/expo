'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type Mode = 'login' | 'signup';

export default function SalesLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [username, setUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

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
      if (data.data.user.role !== 'sales') {
        setError('This login is for sales users only');
        return;
      }
      router.push('/expo');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: signupEmail,
          username,
          password: signupPassword,
          role: 'sales',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Signup failed');
        return;
      }
      router.push('/expo');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-command flex items-center justify-center p-4 relative overflow-hidden">
      {/* Expo-style background */}
      <div className="fixed inset-0 circuit-bg opacity-15 pointer-events-none" style={{ animation: 'gridMove 14s linear infinite' }} />
      <div className="fixed inset-0 grid-dots opacity-20 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(at 20% 20%, rgba(22,163,74,0.12) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(21,128,61,0.08) 0px, transparent 50%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
            <span className="text-2xl font-black text-green-400">U</span>
          </div>
          <h1 className="text-2xl font-black text-white">UClean Sales</h1>
          <p className="text-slate-400 text-sm mt-1">Lead capture portal</p>
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
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-slate-900/60 p-1 mb-8">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m
                    ? 'bg-green-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

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

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
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
                    placeholder="john@example.com or johndoe"
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-green-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-premium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-green-500" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-premium"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-green-500" />
                    Email
                    <span className="text-slate-600 normal-case font-normal tracking-normal">
                      (or username below)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="input-premium"
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-green-500" />
                    Username
                    <span className="text-slate-600 normal-case font-normal tracking-normal">
                      (or email above)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-premium"
                    placeholder="johndoe"
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
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input-premium"
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                </div>

                <input type="hidden" name="role" value="sales" />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Sales portal — UClean Franchise Management
        </p>
      </motion.div>
    </div>
  );
}
