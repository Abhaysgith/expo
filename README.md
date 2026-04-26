# UClean Expo PWA

Offline-first Next.js 14 trade show experience for UClean franchise.

## Quick Start

```bash
cd urcup
npm install
node generate-icons.js   # creates placeholder PNG icons
npm run dev
```

Open:
- **Dashboard**: http://localhost:3000/dashboard
- **NFC / Franchise page**: http://localhost:3000/nfc

## Build & Deploy (Vercel)

```bash
npm run build
npm start
# or push to GitHub → import on vercel.com (zero config)
```

## Pages

| Route | Purpose |
|-------|---------|
| `/dashboard` | LED-style live analytics for booth TV/screen |
| `/nfc` | Mobile landing page for NFC tap / QR code |

## Offline Testing

1. `npm run build && npm start`
2. Open Chrome DevTools → Application → Service Workers → check "Offline"
3. Refresh — everything still works from cache

## Export Leads

Click **Export Leads** in the navbar — downloads a CSV of all form submissions stored in localStorage.

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Framer Motion (animations)
- Recharts (revenue chart)
- React Simple Maps (India map)
- next-pwa (service worker)
- Lucide React (icons)

## Brand Colors

| Token | Hex |
|-------|-----|
| Navy | `#0A2463` |
| Cyan (neon) | `#00D9FF` |
| Dark bg | `#051232` |
