import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Dispute = Tables<'disputes'> & {
  customer_name?: string;
  customer_email?: string;
  provider_name?: string;
  provider_email?: string;
};

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('disputes')
      .select('*, customer:profiles!disputes_customer_id_fkey(name, email), provider:providers!disputes_provider_id_fkey(id, profiles!providers_id_fkey(name, email))')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map((row: Record<string, unknown>) => {
          const customer = row.customer as { name: string; email?: string } | null;
          const provider = row.provider as { profiles: { name: string; email?: string } | null } | null;
          return {
            ...(row as Tables<'disputes'>),
            customer_name: customer?.name ?? '',
            customer_email: customer?.email ?? '',
            provider_name: provider?.profiles?.name ?? '',
            provider_email: provider?.profiles?.email ?? '',
          };
        });
        setDisputes(mapped);
        setLoading(false);
      });
  }, []);

  return { disputes, loading, setDisputes };
}
