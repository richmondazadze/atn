import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Listing = Tables<'listings'> & {
  provider_name?: string;
  provider_avatar_url?: string | null;
};

interface ListingFilters {
  featured?: boolean;
  category?: string;
  providerId?: string;
  status?: string;
  search?: string;
  listingIds?: string[];
}

export function useListings(filters?: ListingFilters) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filters?.listingIds && filters.listingIds.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }
    let query = supabase
      .from('listings')
      .select('*, providers!listings_provider_id_fkey(id, profiles!providers_id_fkey(name, avatar_url))')
      .order('created_at', { ascending: false });

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    if (filters?.category) {
      query = query.eq('category_slug', filters.category);
    }
    if (filters?.providerId) {
      query = query.eq('provider_id', filters.providerId);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    } else if (!filters?.status) {
      query = query.eq('status', 'active');
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters?.listingIds) {
      if (filters.listingIds.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }
      query = query.in('id', filters.listingIds);
    }

    query.then(({ data }) => {
      const mapped = (data ?? []).map((row: Record<string, unknown>) => {
        const provider = row.providers as { profiles: { name: string; avatar_url: string | null } | null } | null;
        return {
          ...(row as Tables<'listings'>),
          provider_name: provider?.profiles?.name ?? '',
          provider_avatar_url: provider?.profiles?.avatar_url ?? null,
        };
      });
      setListings(mapped);
      setLoading(false);
    });
  }, [filters?.featured, filters?.category, filters?.providerId, filters?.status, filters?.search, filters?.listingIds?.length]);

  return { listings, loading, setListings };
}

export function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    supabase
      .from('listings')
      .select('*, providers!listings_provider_id_fkey(id, profiles!providers_id_fkey(name, avatar_url))')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          const provider = (data as Record<string, unknown>).providers as { profiles: { name: string; avatar_url: string | null } | null } | null;
          setListing({
            ...(data as unknown as Tables<'listings'>),
            provider_name: provider?.profiles?.name ?? '',
            provider_avatar_url: provider?.profiles?.avatar_url ?? null,
          });
        }
        setLoading(false);
      });
  }, [id]);

  return { listing, loading };
}
