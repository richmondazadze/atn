import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type Testimonial = Tables<'testimonials'>;

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials(data ?? []);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading };
}
