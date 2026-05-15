'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, Lock, LogIn, UserPlus, Loader2, AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import PWAInstallBanner from '@/components/shared/PWAInstallBanner';

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
      router.push('/form');
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
          name, phone, email: signupEmail, username,
          password: signupPassword, role: 'sales',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Signup failed');
        return;
      }
      router.push('/form');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all";
  const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2";

  return (
    <>
    <PWAInstallBanner />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-green-50 border border-green-200">
              <Image src="/uclean-logo.png" alt="UClean" width={44} height={44} style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900">UClean Sales</h1>
          <p className="text-gray-500 text-sm mt-1">Lead capture portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8">

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-7">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m
                    ? 'bg-white text-green-700 shadow-sm border border-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
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
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm"
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
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    <Mail className="w-3.5 h-3.5 text-green-600" />
                    Email or Username
                  </label>
                  <input
                    type="text" required value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={inputClass}
                    placeholder="john@example.com or johndoe"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    <Lock className="w-3.5 h-3.5 text-green-600" />
                    Password
                  </label>
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-green-600/20 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      <User className="w-3 h-3 text-green-600" />
                      Name
                    </label>
                    <input
                      type="text" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass} placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      <Phone className="w-3 h-3 text-green-600" />
                      Phone
                    </label>
                    <input
                      type="tel" required value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass} placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    <Mail className="w-3.5 h-3.5 text-green-600" />
                    Email <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="email" value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={inputClass} placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    <User className="w-3.5 h-3.5 text-green-600" />
                    Username <span className="text-gray-400 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="text" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass} placeholder="johndoe"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    <Lock className="w-3.5 h-3.5 text-green-600" />
                    Password
                  </label>
                  <input
                    type="password" required value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={inputClass} placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-green-600/20 mt-1"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Sales portal — UClean Franchise Management
        </p>
      </motion.div>
    </div>
    </>
  );
}
