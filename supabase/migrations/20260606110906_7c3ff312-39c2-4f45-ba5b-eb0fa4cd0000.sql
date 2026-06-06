CREATE TABLE public.client_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  quarter text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.client_signups TO service_role;

ALTER TABLE public.client_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct public access to client signups"
ON public.client_signups
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);