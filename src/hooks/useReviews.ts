import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Review = Tables<'reviews'>;

export function useReviews(opts?: { listingId?: string; providerId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    query.then(({ data }) => {
      setReviews(data ?? []);
      setLoading(false);
    });
  }, [opts?.listingId, opts?.providerId]);

  return { reviews, loading, setReviews };
}
