import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { useAuth } from '../app/context/AuthContext';

export type Favorite = Tables<'favorites'>;

export function useFavorites() {
  const { user, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !user.id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('customer_id', user.id);

    setFavoriteIds(new Set((data ?? []).map(f => f.listing_id)));
    setLoading(false);
  }, [user.id, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  async function toggleFavorite(listingId: string) {
    if (!user.id) return;

    if (favoriteIds.has(listingId)) {
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(listingId); return s; });
      await supabase
        .from('favorites')
        .delete()
        .eq('customer_id', user.id)
        .eq('listing_id', listingId);
    } else {
      setFavoriteIds(prev => new Set(prev).add(listingId));
      await supabase
        .from('favorites')
        .insert({ customer_id: user.id, listing_id: listingId });
    }
  }

  return { favoriteIds, loading, toggleFavorite, refetch: fetchFavorites };
}
