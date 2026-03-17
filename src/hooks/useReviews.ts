import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Review = Tables<'reviews'>;

export function useReviews(opts?: { listingId?: string; providerId?: string; customerId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (opts?.listingId) {
      query = query.eq('listing_id', opts.listingId);
    }
    if (opts?.providerId) {
      query = query.eq('provider_id', opts.providerId);
    }
    if (opts?.customerId) {
      query = query.eq('customer_id', opts.customerId);
    }

    const { data } = await query;
    setReviews(data ?? []);
    setLoading(false);
  }, [opts?.listingId, opts?.providerId, opts?.customerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, setReviews, refetch: fetchReviews };
}
