
DROP POLICY IF EXISTS "Lookup by id" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Update own signup by id" ON public.waitlist_signups;
REVOKE SELECT, UPDATE ON public.waitlist_signups FROM anon, authenticated;
