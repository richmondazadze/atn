-- Run this migration in Supabase SQL Editor (Dashboard > SQL Editor) before using Admin Resources and Settings.
-- Resources table for admin help content / CMS
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'guide' CHECK (type IN ('guide', 'tutorial', 'article', 'faq')),
  category text NOT NULL DEFAULT 'both' CHECK (category IN ('provider', 'customer', 'both')),
  content text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);

-- Platform settings (single-row key-value store)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings row (we use key='global' for all admin settings)
INSERT INTO public.platform_settings (key, value)
VALUES ('global', '{
  "platformFee": "8",
  "minBooking": "25",
  "maxBooking": "500",
  "requireBackgroundCheck": true,
  "autoApproveProviders": false,
  "emailNotifications": true,
  "smsNotifications": true,
  "maintenanceMode": false,
  "adminEmails": "",
  "maintenanceMessage": ""
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS (optional - adjust as needed for your auth)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated admin reads/writes (adjust to your auth)
CREATE POLICY "Admins can manage resources" ON public.resources
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can manage platform_settings" ON public.platform_settings
  FOR ALL USING (true) WITH CHECK (true);
