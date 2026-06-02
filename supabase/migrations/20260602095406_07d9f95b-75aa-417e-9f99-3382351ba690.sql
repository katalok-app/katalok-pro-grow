REVOKE SELECT, INSERT, UPDATE, DELETE ON public.waitlist_signups FROM anon, authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.pro_profiles FROM anon, authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.portfolio_posts FROM anon, authenticated;

DROP POLICY IF EXISTS "Anyone can sign up to waitlist" ON public.waitlist_signups;

DROP POLICY IF EXISTS "Public insert profiles" ON public.pro_profiles;
DROP POLICY IF EXISTS "Public read profiles" ON public.pro_profiles;
DROP POLICY IF EXISTS "Public update profiles" ON public.pro_profiles;

DROP POLICY IF EXISTS "Public insert portfolio" ON public.portfolio_posts;
DROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio_posts;
DROP POLICY IF EXISTS "Public update portfolio" ON public.portfolio_posts;
DROP POLICY IF EXISTS "Public delete portfolio" ON public.portfolio_posts;

DROP POLICY IF EXISTS "Public read portfolio bucket" ON storage.objects;

GRANT ALL ON public.waitlist_signups TO service_role;
GRANT ALL ON public.pro_profiles TO service_role;
GRANT ALL ON public.portfolio_posts TO service_role;