'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

interface LogoutButtonProps {
  redirectTo?: string;
}

export default function LogoutButton({ redirectTo = '/' }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(redirectTo);
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 text-gray-800 font-semibold hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      Sign Out
    </button>
  );
}
