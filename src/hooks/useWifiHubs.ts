import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type WifiHub = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number;
  lng: number;
  description: string | null;
  hours: string | null;
  network_name: string | null;
  access_notes: string | null;
  active: boolean;
};

type WifiHubsOptions = {
  includeInactive?: boolean;
};

function normalize(row: Record<string, unknown>): WifiHub {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    created_by: row.created_by ? String(row.created_by) : null,
    name: String(row.name ?? ''),
    address: String(row.address ?? ''),
    city: row.city ? String(row.city) : null,
    state: row.state ? String(row.state) : null,
    zip: row.zip ? String(row.zip) : null,
    lat: Number(row.lat),
    lng: Number(row.lng),
    description: row.description ? String(row.description) : null,
    hours: row.hours ? String(row.hours) : null,
    network_name: row.network_name ? String(row.network_name) : null,
    access_notes: row.access_notes ? String(row.access_notes) : null,
    active: Boolean(row.active),
  };
}

export function useWifiHubs(options: WifiHubsOptions = {}) {
  const includeInactive = options.includeInactive ?? false;
  const [hubs, setHubs] = useState<WifiHub[]>([]);
  const [loading, setLoading] = useState(true);

  const queryFilter = useMemo(() => ({ includeInactive }), [includeInactive]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    let query = supabase
      .from('wifi_hubs')
      .select('*')
      .order('name', { ascending: true });

    if (!includeInactive) query = query.eq('active', true);

    query.then(({ data }) => {
      if (!mounted) return;
      const mapped = (data ?? []).map((r: Record<string, unknown>) => normalize(r));
      setHubs(mapped);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [queryFilter]);

  useEffect(() => {
    const channel = supabase
      .channel('wifi_hubs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wifi_hubs' }, (payload) => {
        setHubs((prev) => {
          const event = payload.eventType;
          if (event === 'INSERT') {
            const next = normalize(payload.new as unknown as Record<string, unknown>);
            if (!includeInactive && !next.active) return prev;
            if (prev.some(h => h.id === next.id)) return prev;
            return [...prev, next].sort((a, b) => a.name.localeCompare(b.name));
          }
          if (event === 'UPDATE') {
            const next = normalize(payload.new as unknown as Record<string, unknown>);
            const exists = prev.some(h => h.id === next.id);
            if (!includeInactive && !next.active) {
              return prev.filter(h => h.id !== next.id);
            }
            if (!exists) return [...prev, next].sort((a, b) => a.name.localeCompare(b.name));
            return prev.map(h => h.id === next.id ? next : h).sort((a, b) => a.name.localeCompare(b.name));
          }
          if (event === 'DELETE') {
            const deletedId = String((payload.old as { id?: unknown } | null)?.id ?? '');
            if (!deletedId) return prev;
            return prev.filter(h => h.id !== deletedId);
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [includeInactive]);

  return { hubs, loading, setHubs };
}

