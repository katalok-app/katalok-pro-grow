
DROP POLICY IF EXISTS "Public upload to portfolio bucket" ON storage.objects;

CREATE POLICY "Authenticated users upload to own folder in portfolio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners update own portfolio files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owners delete own portfolio files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
