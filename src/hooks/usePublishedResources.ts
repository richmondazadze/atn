import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Resource = Tables<'resources'>;

/** Fetch published resources for the given audience (customer, provider, or both) */
export function usePublishedResources(audience: 'customer' | 'provider') {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async () => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('status', 'published')
      .in('category', [audience, 'both'])
      .order('updated_at', { ascending: false });
    setResources(data ?? []);
    setLoading(false);
  }, [audience]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, loading, refetch: fetchResources };
}
