import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { useAuth } from '../app/context/AuthContext';

export type Booking = Tables<'bookings'> & {
  customer_name?: string;
  provider_name?: string;
};

export function useBookings() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated || !user.id) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });

    if (user.role === 'customer') {
      query = query.eq('customer_id', user.id);
    } else if (user.role === 'provider') {
      query = query.eq('provider_id', user.id);
    }

    const { data } = await query;
    setBookings(data ?? []);
    setLoading(false);
  }, [user.id, user.role, isAuthenticated]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, setBookings, refetch: fetchBookings };
}
