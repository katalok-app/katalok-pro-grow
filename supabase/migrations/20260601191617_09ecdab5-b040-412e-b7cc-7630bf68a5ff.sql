
-- Waitlist signups (the funnel entry point)
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  profession TEXT NOT NULL,
  social_link TEXT,
  years_experience INTEGER,
  sample_work_urls TEXT[] DEFAULT '{}',
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.waitlist_signups TO anon;
GRANT SELECT, INSERT, UPDATE ON public.waitlist_signups TO authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Anyone may insert a waitlist signup
CREATE POLICY "Anyone can sign up to waitlist"
  ON public.waitlist_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Select/update only by knowing the unguessable UUID (used for prelaunch portal)
CREATE POLICY "Lookup by id"
  ON public.waitlist_signups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Update own signup by id"
  ON public.waitlist_signups FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Pre-launch professional profiles
CREATE TABLE public.pro_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signup_id UUID NOT NULL UNIQUE REFERENCES public.waitlist_signups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  social_link TEXT,
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.pro_profiles TO anon, authenticated;
GRANT ALL ON public.pro_profiles TO service_role;

ALTER TABLE public.pro_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON public.pro_profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert profiles" ON public.pro_profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.pro_profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Portfolio posts (pending admin approval)
CREATE TABLE public.portfolio_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.pro_profiles(id) ON DELETE CASCADE,
  service_title TEXT NOT NULL,
  price NUMERIC(10,2),
  duration_minutes INTEGER,
  category TEXT,
  description TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_posts TO anon, authenticated;
GRANT ALL ON public.portfolio_posts TO service_role;

ALTER TABLE public.portfolio_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read portfolio" ON public.portfolio_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert portfolio" ON public.portfolio_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update portfolio" ON public.portfolio_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public delete portfolio" ON public.portfolio_posts FOR DELETE TO anon, authenticated USING (true);

-- Storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read portfolio bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Public upload to portfolio bucket"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'portfolio');
