'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Smartphone, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { exportLeadsToCSV } from '@/lib/exportLeads';
import type { Lead } from '@/lib/exportLeads';

export default function NavBar() {
  const pathname = usePathname();
  const isOffline = useOfflineStatus();

  const handleExport = () => {
    try {
      const raw = localStorage.getItem('uclean-leads');
      const leads: Lead[] = raw ? JSON.parse(raw) : [];
      exportLeadsToCSV(leads);
    } catch {
      alert('No leads found to export.');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/nfc',       label: 'Franchise Info',  icon: Smartphone },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[60px]"
        style={{
          background: 'rgba(8, 13, 28, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(6,182,212,0.12)',
          boxShadow: '0 1px 0 rgba(6,182,212,0.18), 0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Neon top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 25%, rgba(0,255,234,0.4) 50%, rgba(6,182,212,0.6) 75%, transparent 100%)',
            boxShadow: '0 0 8px rgba(6,182,212,0.4)',
          }}
        />

        {/* Scan line (very subtle) */}
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.25), transparent)',
            filter: 'blur(1px)',
          }}
          animate={{ left: ['-2%', '102%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />

        <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 flex items-center gap-4">

          {/* Logo */}
          <Logo size={30} />

          {/* Divider */}
          <div className="w-px h-6 hidden sm:block"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.3), transparent)' }}
          />

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                    active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-200',
                  ].join(' ')}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(6,182,212,0.07)',
                        border: '1px solid rgba(6,182,212,0.22)',
                        boxShadow: '0 0 12px rgba(6,182,212,0.1)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:block">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Export button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              color: '#64748B',
              border: '1px solid rgba(71,85,105,0.4)',
              background: 'rgba(30,41,59,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#22D3EE';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(6,182,212,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(71,85,105,0.4)';
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Export Leads</span>
          </button>

          {/* Live/Offline badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
            style={isOffline
              ? { background: 'rgba(245,158,11,0.08)', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.25)' }
              : {
                  background: 'rgba(0,255,136,0.06)',
                  color: '#00FF88',
                  borderColor: 'rgba(0,255,136,0.25)',
                  boxShadow: '0 0 12px rgba(0,255,136,0.1)',
                }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isOffline ? '#F59E0B' : '#00FF88',
                boxShadow: isOffline ? 'none' : '0 0 6px #00FF88',
                animation: isOffline ? 'none' : 'livePulseCyan 2s infinite',
              }}
            />
            <span className="hidden sm:block uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>
              {isOffline ? 'Offline' : 'Live'}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
