-- Create wallpapers storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('wallpapers', 'wallpapers', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Create profiles storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profiles', 'profiles', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for wallpapers bucket
-- Allow authenticated users to upload
CREATE POLICY "Users can upload wallpapers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view wallpapers
CREATE POLICY "Anyone can view wallpapers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wallpapers');

-- Allow users to update their own wallpapers
CREATE POLICY "Users can update their own wallpapers" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own wallpapers
CREATE POLICY "Users can delete their own wallpapers" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for profiles bucket
-- Allow authenticated users to upload profile images
CREATE POLICY "Users can upload profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view profile images
CREATE POLICY "Anyone can view profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);