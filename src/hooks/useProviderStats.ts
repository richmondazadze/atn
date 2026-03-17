import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type ProviderStatsMap = Record<string, { earnings: number; completedBookings: number }>;

export function useProviderStats(providerIds: string[]) {
  const [stats, setStats] = useState<ProviderStatsMap>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (providerIds.length === 0) {
      setStats({});
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('bookings')
      .select('provider_id, price, status')
      .in('provider_id', providerIds)
      .eq('status', 'completed');
    const map: ProviderStatsMap = {};
    providerIds.forEach(id => { map[id] = { earnings: 0, completedBookings: 0 }; });
    (data ?? []).forEach(b => {
      const cur = map[b.provider_id] ?? { earnings: 0, completedBookings: 0 };
      map[b.provider_id] = {
        earnings: cur.earnings + (b.price ?? 0),
        completedBookings: cur.completedBookings + 1,
      };
    });
    setStats(map);
    setLoading(false);
  }, [providerIds.join(',')]);

  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}
