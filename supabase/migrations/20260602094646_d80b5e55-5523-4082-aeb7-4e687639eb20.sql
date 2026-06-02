GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.pro_profiles TO anon, authenticated;
GRANT ALL ON public.pro_profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_posts TO anon, authenticated;
GRANT ALL ON public.portfolio_posts TO service_role;