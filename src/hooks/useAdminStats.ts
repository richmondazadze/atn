import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AdminStats {
  totalProviders: number;
  activeListings: number;
  bookingsThisWeek: number;
  pendingApprovals: number;
  totalRevenue: number;
  disputesOpen: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalProviders: 0,
    activeListings: 0,
    bookingsThisWeek: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    disputesOpen: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [providers, listings, bookings, disputes] = await Promise.all([
        supabase.from('providers').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('bookings').select('price, status'),
        supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ]);

      const bookingRows = bookings.data ?? [];
      const totalRevenue = bookingRows.reduce((sum, b) => sum + (b.price ?? 0), 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      setStats({
        totalProviders: providers.count ?? 0,
        activeListings: listings.count ?? 0,
        bookingsThisWeek: bookingRows.length,
        pendingApprovals: 0,
        totalRevenue,
        disputesOpen: disputes.count ?? 0,
      });
      setLoading(false);
    }
    fetch();
  }, []);

  return { stats, loading };
}
