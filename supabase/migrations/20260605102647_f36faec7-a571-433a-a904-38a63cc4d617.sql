ALTER TABLE public.waitlist_signups ADD COLUMN IF NOT EXISTS work_location text;
ALTER TABLE public.pro_profiles ADD COLUMN IF NOT EXISTS work_location text;
ALTER TABLE public.waitlist_signups ALTER COLUMN profession DROP NOT NULL;
ALTER TABLE public.pro_profiles ALTER COLUMN profession DROP NOT NULL;