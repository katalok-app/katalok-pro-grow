CREATE POLICY "No direct public access to waitlist signups"
ON public.waitlist_signups
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No direct public access to prelaunch profiles"
ON public.pro_profiles
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No direct public access to portfolio posts"
ON public.portfolio_posts
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);