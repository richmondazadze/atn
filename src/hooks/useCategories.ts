import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Category = Tables<'categories'>;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        setCategories(data ?? []);
        setLoading(false);
      });
  }, []);

  return { categories, loading, setCategories };
}
