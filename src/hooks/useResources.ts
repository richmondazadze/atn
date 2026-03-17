import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Resource = Tables<'resources'>;

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async () => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('updated_at', { ascending: false });
    setResources(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, loading, setResources, refetch: fetchResources };
}
