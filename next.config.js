/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable SW in dev to avoid caching issues
  fallbacks: {
    document: '/offline.html', // served when a page is not cached and user is offline
  },
  additionalManifestEntries: [
    { url: '/expo', revision: null },       // precache the expo page so it works offline immediately
    { url: '/offline.html', revision: null },
  ],
  runtimeCaching: [
    {
      // Cache all /public/data/ JSON files (the offline data store)
      urlPattern: /\/data\/.*\.json$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'uclean-data-cache',
        expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      // Cache all static Next.js assets
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      // Cache all page navigations
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'uclean-pages-cache',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  // Allow building without errors on type issues during expo
  typescript: { ignoreBuildErrors: false },
};

module.exports = withPWA(nextConfig);
