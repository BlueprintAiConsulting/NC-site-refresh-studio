-- Create storage bucket for church photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('church-photos', 'church-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public read access
CREATE POLICY "Public can view church photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'church-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'church-photos');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'church-photos');

-- Allow authenticated users to delete photos
CREATE POLICY "Authenticated users can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'church-photos');
