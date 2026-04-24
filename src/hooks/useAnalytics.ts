import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type AnalyticsData = {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  avgRating: string;
  revenueData: { month: string; revenue: number; bookings: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  userGrowth: { month: string; providers: number; customers: number }[];
  topProviders: { name: string; category: string; bookings: number; revenue: string; rating: number }[];
};

const CHART_COLORS = ['#1A6B6B', '#D4A853', '#E8694A', '#7C5CBF', '#2A9090', '#94A3B8'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useAnalytics(periodDays: number = 30) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - periodDays);
      const cutoffStr = cutoff.toISOString();

      const [
        { data: bookings },
        { data: reviews },
        { data: profiles },
        { data: listings },
      ] = await Promise.all([
        supabase.from('bookings').select('provider_id, price, status, created_at, listing_id, listings!inner(category_slug)').eq('status', 'completed').gte('created_at', cutoffStr),
        supabase.from('reviews').select('rating'),
        supabase.from('profiles').select('role, created_at').gte('created_at', cutoffStr),
        supabase.from('listings').select('id, provider_id, category_slug'),
      ]);

      const completed = (bookings ?? []) as { price: number; provider_id: string; created_at: string; listings: { category_slug: string } }[];
      const totalRevenue = completed.reduce((s, b) => s + (b.price ?? 0), 0);
      const totalBookings = completed.length;
      const activeUsers = new Set([...(profiles ?? []).map(p => (p as { role: string }).role)]).size;
      const allReviews = reviews ?? [];
      const avgRating = allReviews.length > 0
        ? (allReviews.reduce((s, r) => s + (r as { rating: number }).rating, 0) / allReviews.length).toFixed(2)
        : '—';

      const revenueByMonth: Record<string, { revenue: number; bookings: number }> = {};
      const now = new Date();
      for (let i = Math.min(6, periodDays / 30) - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        revenueByMonth[key] = { revenue: 0, bookings: 0 };
      }
      completed.forEach(b => {
        if (!b.created_at) return;
        const key = b.created_at.slice(0, 7);
        if (revenueByMonth[key]) {
          revenueByMonth[key].revenue += b.price ?? 0;
          revenueByMonth[key].bookings += 1;
        }
      });
      const revenueData = Object.entries(revenueByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => {
          const [, m] = k.split('-');
          return { month: MONTHS[parseInt(m, 10) - 1], revenue: v.revenue, bookings: v.bookings };
        });

      const byCat: Record<string, number> = {};
      completed.forEach(b => {
        const slug = b.listings?.category_slug ?? 'other';
        byCat[slug] = (byCat[slug] ?? 0) + 1;
      });
      const categoryBreakdown = Object.entries(byCat)
        .map(([slug, count], i) => ({
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

      const userByMonth: Record<string, { providers: number; customers: number }> = {};
      (profiles ?? []).forEach(p => {
        const row = p as { role: string; created_at: string };
        const key = row.created_at?.slice(0, 7);
        if (!key) return;
        if (!userByMonth[key]) userByMonth[key] = { providers: 0, customers: 0 };
        if (row.role === 'provider') userByMonth[key].providers += 1;
        else if (row.role === 'customer') userByMonth[key].customers += 1;
      });
      const userGrowth = Object.entries(userByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => {
          const [, m] = k.split('-');
          return { month: MONTHS[parseInt(m, 10) - 1], providers: v.providers, customers: v.customers };
        });

      const providerBookings: Record<string, { bookings: number; revenue: number }> = {};
      completed.forEach(b => {
        const id = b.provider_id;
        if (!providerBookings[id]) providerBookings[id] = { bookings: 0, revenue: 0 };
        providerBookings[id].bookings += 1;
        providerBookings[id].revenue += b.price ?? 0;
      });
      const topProviderIds = Object.entries(providerBookings)
        .sort((a, b) => b[1].bookings - a[1].bookings)
        .slice(0, 5)
        .map(([id]) => id);

      let topProviders: { name: string; category: string; bookings: number; revenue: string; rating: number }[] = [];
      if (topProviderIds.length > 0) {
        const { data: provData } = await supabase
          .from('providers')
          .select('id, rating, categories, profiles!providers_id_fkey(name)')
          .in('id', topProviderIds);
        const listData = listings ?? [];
        topProviders = (provData ?? []).map(p => {
          const profile = (p as { profiles: { name: string } | null }).profiles;
          const name = profile?.name ?? 'Provider';
          const list = listData.find((l: { provider_id: string }) => l.provider_id === p.id);
          return {
            name,
            category: (list as { category_slug?: string })?.category_slug?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? 'General',
            bookings: providerBookings[p.id]?.bookings ?? 0,
            revenue: `$${(providerBookings[p.id]?.revenue ?? 0).toLocaleString()}`,
            rating: (p as { rating: number }).rating ?? 0,
          };
        }).sort((a, b) => b.bookings - a.bookings);
      }

      setData({
        totalRevenue,
        totalBookings,
        activeUsers: (profiles ?? []).length,
        avgRating,
        revenueData,
        categoryBreakdown,
        userGrowth,
        topProviders,
      });
      setLoading(false);
    }
    fetchAnalytics();
  }, [periodDays]);

  return { data, loading };
}
