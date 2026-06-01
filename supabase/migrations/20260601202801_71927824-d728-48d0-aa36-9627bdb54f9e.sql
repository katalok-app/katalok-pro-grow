GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
GRANT SELECT, INSERT ON public.waitlist_signups TO anon, authenticated;