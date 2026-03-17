import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type AdminStats = {
  providerCount: number;
  providerCountPending: number;
  bookingCount: number;
  revenueMtd: number;
  disputeCountOpen: number;
  disputeCountUrgent: number;
  listingCount: number;
  listingCountFlagged: number;
  listingCountFeatured: number;
};

export type RevenueDataPoint = { month: string; revenue: number };
export type CategoryDataPoint = { name: string; bookings: number };

export type RecentActivityItem = {
  id: string;
  type: 'provider' | 'dispute' | 'listing' | 'booking';
  message: string;
  time: string;
  createdAt: string;
  status: 'pending' | 'urgent' | 'review' | 'complete';
  link?: string;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenueDataPoint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

      const [
        { count: providerCount },
        { count: providerCountPending },
        { data: bookings },
        { data: bookingsForCharts },
        { count: disputeCountOpen },
        { data: disputes },
        { count: listingCount },
        { data: listings },
      ] = await Promise.all([
        supabase.from('providers').select('*', { count: 'exact', head: true }),
        supabase.from('providers').select('*', { count: 'exact', head: true }).eq('verified', false),
        supabase.from('bookings').select('price, status, created_at'),
        supabase.from('bookings').select('price, created_at, listings!inner(category_slug)').eq('status', 'completed'),
        supabase.from('disputes').select('*', { count: 'exact', head: true }).in('status', ['open', 'in-progress']),
        supabase.from('disputes').select('id, status, priority, created_at, listing_title').order('created_at', { ascending: false }).limit(5),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('id, status, featured, created_at'),
      ]);

      const completedBookings = (bookings ?? []).filter(b => b.status === 'completed');
      const revenueMtd = completedBookings
        .filter(b => b.created_at && b.created_at.slice(0, 10) >= monthStart)
        .reduce((sum, b) => sum + (b.price ?? 0), 0);

      const disputeCountUrgent = (disputes ?? []).filter(d => d.priority === 'high' && d.status !== 'resolved' && d.status !== 'closed').length;
      const listingCountFlagged = (listings ?? []).filter(l => l.status === 'suspended').length;
      const listingCountFeatured = (listings ?? []).filter(l => l.featured).length;

      setStats({
        providerCount: providerCount ?? 0,
        bookingCount: (bookings ?? []).length,
        revenueMtd,
        disputeCountOpen: disputeCountOpen ?? 0,
        disputeCountUrgent,
        providerCountPending: providerCountPending ?? 0,
        listingCount: listingCount ?? 0,
        listingCountFlagged,
        listingCountFeatured,
      });

      const activities: RecentActivityItem[] = [];
      (disputes ?? []).forEach(d => {
        activities.push({
          id: d.id,
          type: 'dispute',
          message: `Dispute requires review`,
          time: formatTimeAgo(d.created_at),
          createdAt: d.created_at,
          status: d.priority === 'high' ? 'urgent' : 'review',
          link: `/admin/disputes`,
        });
      });
      (listings ?? [])
        .filter(l => l.status === 'suspended')
        .forEach(l => {
          activities.push({
            id: l.id,
            type: 'listing',
            message: `Listing suspended`,
            time: formatTimeAgo(l.created_at),
            createdAt: l.created_at,
            status: 'review',
            link: `/admin/listings`,
          });
        });
      activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setActivity(activities.slice(0, 5));

      const completed = (bookingsForCharts ?? []) as { price: number; created_at: string; listings: { category_slug: string } | null }[];
      const revenueByMonth: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        revenueByMonth[key] = 0;
      }
      completed.forEach(b => {
        if (!b.created_at) return;
        const key = b.created_at.slice(0, 7);
        if (revenueByMonth[key] !== undefined) revenueByMonth[key] += b.price ?? 0;
      });
      setRevenueTrend(
        Object.entries(revenueByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => {
            const [y, m] = k.split('-');
            return { month: MONTHS[parseInt(m, 10) - 1], revenue: v };
          })
      );

      const byCat: Record<string, number> = {};
      completed.forEach(b => {
        const slug = b.listings?.category_slug ?? 'other';
        byCat[slug] = (byCat[slug] ?? 0) + 1;
      });
      setCategoryBreakdown(
        Object.entries(byCat)
          .map(([slug, count]) => ({ name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), bookings: count }))
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 8)
      );

      setLoading(false);
    }
    fetchStats();
  }, []);

  return { stats, activity, revenueTrend, categoryBreakdown, loading };
}

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  return `${Math.floor(sec / 86400)} days ago`;
}
