import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Provider = Tables<'providers'> & {
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
};

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('providers')
      .select('*, profiles!providers_id_fkey(name, email, avatar_url, bio, phone)')
      .order('rating', { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map((row: Record<string, unknown>) => {
          const profile = row.profiles as { name: string; email: string; avatar_url: string | null; bio: string | null; phone: string | null } | null;
          return {
            ...(row as Tables<'providers'>),
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            avatar_url: profile?.avatar_url ?? null,
            bio: profile?.bio ?? null,
            phone: profile?.phone ?? null,
          };
        });
        setProviders(mapped);
        setLoading(false);
      });
  }, []);

  return { providers, loading, setProviders };
}

export function useProvider(id: string | undefined) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    supabase
      .from('providers')
      .select('*, profiles!providers_id_fkey(name, email, avatar_url, bio, phone)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          const profile = (data as Record<string, unknown>).profiles as { name: string; email: string; avatar_url: string | null; bio: string | null; phone: string | null } | null;
          setProvider({
            ...(data as unknown as Tables<'providers'>),
            name: profile?.name ?? '',
            email: profile?.email ?? '',
            avatar_url: profile?.avatar_url ?? null,
            bio: profile?.bio ?? null,
            phone: profile?.phone ?? null,
          });
        }
        setLoading(false);
      });
  }, [id]);

  return { provider, loading };
}
