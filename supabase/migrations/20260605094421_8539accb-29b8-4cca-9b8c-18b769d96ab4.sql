
ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS quarter text,
  ADD COLUMN IF NOT EXISTS services text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.pro_profiles
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS quarter text;
