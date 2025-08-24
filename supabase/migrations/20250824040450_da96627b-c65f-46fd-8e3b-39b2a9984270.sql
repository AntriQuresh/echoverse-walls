-- Create profiles table for creator profile hosting requests
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  portfolio_links JSONB DEFAULT '[]',
  avatar_url TEXT,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure wallpapers bucket exists and has proper policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wallpapers', 'wallpapers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for wallpapers bucket
CREATE POLICY "Wallpapers are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wallpapers');

CREATE POLICY "Authenticated users can upload wallpapers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wallpapers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own wallpapers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = owner);

CREATE POLICY "Users can delete their own wallpapers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = owner);

-- Create profiles bucket for avatars and banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profiles bucket
CREATE POLICY "Profile images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);