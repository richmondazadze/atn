import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type PlatformSettings = {
  platformFee: string;
  minBooking: string;
  maxBooking: string;
  requireBackgroundCheck: boolean;
  autoApproveProviders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
  adminEmails: string;
  maintenanceMessage: string;
};

const DEFAULT_SETTINGS: PlatformSettings = {
  platformFee: '8',
  minBooking: '25',
  maxBooking: '500',
  requireBackgroundCheck: true,
  autoApproveProviders: false,
  emailNotifications: true,
  smsNotifications: true,
  maintenanceMode: false,
  adminEmails: '',
  maintenanceMessage: '',
};

export function usePlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'global')
      .single();
    const val = data?.value as Partial<PlatformSettings> | null;
    if (val && typeof val === 'object') {
      setSettings({ ...DEFAULT_SETTINGS, ...val });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = useCallback(async (updates: Partial<PlatformSettings>) => {
    const next = { ...settings, ...updates };
    const { error } = await supabase
      .from('platform_settings')
      .upsert({ key: 'global', value: next, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
    setSettings(next);
  }, [settings]);

  return { settings, loading, saveSettings, refetch: fetchSettings };
}
