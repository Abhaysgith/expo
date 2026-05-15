import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UClean — Tech-First Laundry Franchise',
  description: 'World\'s most advanced laundry franchise. Real-time analytics, zero software fees, proven ROI.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'UClean' },
  icons: { icon: '/fevicon.png', apple: '/fevicon.png' },
};

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/fevicon.png" />
        {/* Capture PWA install prompt before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.__pwaPrompt = null;
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window.__pwaPrompt = e;
          });
        ` }} />
      </head>
      <body className="bg-slate-950 text-slate-300 min-h-screen antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
