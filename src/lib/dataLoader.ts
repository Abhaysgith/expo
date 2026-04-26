/**
 * Data loading utilities — all data comes from local JSON files.
 * Works offline because next-pwa caches /public/data/*.json via CacheFirst.
 */

export interface FranchiseLocation {
  id: string;
  city: string;
  state: string;
  tier: 1 | 2 | 3;
  lat: number;
  lng: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  rating: number;
  joinedDate: string;
  owner: string;
  area: string;
  status: string;
}

export interface LiveOrder {
  orderId: string;
  city: string;
  area: string;
  serviceType: string;
  weightKg: number;
  amount: number;
  status: string;
  timestamp: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  businessAge: string;
  monthlyRevenue: string;
  rating: number;
  photo: string;
  quote: string;
  highlight: string;
  tier: number;
}

export interface ROITier {
  label: string;
  cities: string[];
  investmentBreakdown: {
    franchiseFee: number;
    equipmentCost: number;
    interiorSetup: number;
    workingCapital: number;
    miscellaneous: number;
    total: number;
  };
  monthlyOperatingCost: { total: number; [key: string]: number };
  revenueMetrics: {
    avgOrderValue: number;
    expectedMonthlyOrders: number;
    expectedMonthlyRevenue: number;
    expectedMonthlyProfit: number;
    profitMargin: number;
    roiMonths: number;
    yearOneProfit: number;
    yearThreeProfit: number;
  };
  services: Record<string, { pricePerKg?: number; pricePerPiece?: number; avgOrderKg?: number; avgPieces?: number }>;
}

// Generic fetcher — uses /public/data/ which is cached by the service worker
async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function loadFranchiseStats() {
  return fetchJSON<{ locations: FranchiseLocation[]; totalLocations: number }>('/data/franchise-stats.json');
}

export async function loadLiveOrders() {
  return fetchJSON<{ orders: LiveOrder[] }>('/data/live-orders.json');
}

export async function loadTestimonials() {
  return fetchJSON<{ testimonials: Testimonial[] }>('/data/testimonials.json');
}

export async function loadROIData() {
  return fetchJSON<{ tiers: Record<string, ROITier>; revenueChart: Record<string, number[]> }>('/data/roi-calculator.json');
}

/** Generate fake 7-day revenue trend from franchise stats */
export function generateRevenueTrend(locations: FranchiseLocation[]) {
  const totalDaily = locations.reduce((s, l) => s + l.monthlyRevenue, 0) / 30;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Add realistic variance — weekends higher
  const multipliers = [0.88, 0.92, 0.95, 1.0, 1.08, 1.22, 1.14];
  return days.map((day, i) => ({
    day,
    revenue: Math.round(totalDaily * multipliers[i]),
    orders: Math.round((totalDaily / 450) * multipliers[i]), // avg ₹450/order
  }));
}

/** Pick n unique random items from an array */
export function pickRandom<T>(arr: T[], n = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** Format number as Indian currency string */
export function formatINR(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
