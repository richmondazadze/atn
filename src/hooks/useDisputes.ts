import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Dispute = Tables<'disputes'> & {
  customer_name?: string;
  provider_name?: string;
};

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('disputes')
      .select('*, customer:profiles!disputes_customer_id_fkey(name), provider:providers!disputes_provider_id_fkey(id, profiles!providers_id_fkey(name))')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map((row: Record<string, unknown>) => {
          const customer = row.customer as { name: string } | null;
          const provider = row.provider as { profiles: { name: string } | null } | null;
          return {
            ...(row as Tables<'disputes'>),
            customer_name: customer?.name ?? '',
            provider_name: provider?.profiles?.name ?? '',
          };
        });
        setDisputes(mapped);
        setLoading(false);
      });
  }, []);

  return { disputes, loading, setDisputes };
}
