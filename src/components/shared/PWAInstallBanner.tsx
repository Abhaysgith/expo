'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Share, X } from 'lucide-react';

export default function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('pwa-banner-dismissed')) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as unknown as { standalone?: boolean }).standalone;
    if (ios) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__pwaPrompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deferredPrompt.current = (window as any).__pwaPrompt;
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__pwaPrompt = e;
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('pwa-banner-dismissed', '1');
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') deferredPrompt.current = null;
    dismiss();
  };

  if (!show) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex items-center gap-2 px-3 py-2 sm:hidden"
      style={{
        background: 'linear-gradient(90deg, #052e16, #14532d)',
        borderBottom: '1px solid rgba(34,197,94,0.3)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <Download className="w-3.5 h-3.5 text-green-400" />
      </div>
      <div className="flex-1 min-w-0">
        {isIOS ? (
          <p className="text-[11px] text-green-100 leading-tight">
            Install app: tap <Share className="w-3 h-3 inline text-green-300 mx-0.5" /> then <strong className="text-white">Add to Home Screen</strong>
          </p>
        ) : (
          <p className="text-[11px] text-green-100 leading-tight">
            <strong className="text-white">Install UClean app</strong> — works offline, no app store needed
          </p>
        )}
      </div>
      {!isIOS && (
        <button
          onClick={install}
          className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
          style={{ background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.4)' }}
        >
          Install
        </button>
      )}
      <button onClick={dismiss} className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
        <X className="w-3.5 h-3.5 text-green-400" />
      </button>
    </div>
  );
}
