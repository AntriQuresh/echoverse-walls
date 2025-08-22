-- Create categories table first
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wallpapers table
CREATE TABLE public.wallpapers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tags TEXT[],
  resolution TEXT,
  file_size BIGINT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE public.wallpaper_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallpaper_id UUID NOT NULL REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  user_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallpaper_id, user_profile_id)
);

-- Create downloads tracking table
CREATE TABLE public.wallpaper_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallpaper_id UUID NOT NULL REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  user_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpaper_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpaper_downloads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for wallpapers
CREATE POLICY "Wallpapers are viewable by everyone" 
ON public.wallpapers FOR SELECT USING (true);

CREATE POLICY "Users can insert their own wallpapers" 
ON public.wallpapers FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = uploader_id));

CREATE POLICY "Users can update their own wallpapers" 
ON public.wallpapers FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = uploader_id));

CREATE POLICY "Users can delete their own wallpapers" 
ON public.wallpapers FOR DELETE 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = uploader_id));

-- Create RLS policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.wallpaper_likes FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.wallpaper_likes FOR ALL 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_profile_id));

-- Create RLS policies for downloads (read-only for stats)
CREATE POLICY "Downloads are viewable by everyone" 
ON public.wallpaper_downloads FOR SELECT USING (true);

CREATE POLICY "Anyone can insert download records" 
ON public.wallpaper_downloads FOR INSERT WITH CHECK (true);

-- Create storage buckets for wallpapers
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for wallpapers
CREATE POLICY "Wallpaper images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'wallpapers');

CREATE POLICY "Authenticated users can upload wallpapers" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'wallpapers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own wallpaper uploads" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = owner);

CREATE POLICY "Users can delete their own wallpaper uploads" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = owner);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
('Nature', 'nature', 'Beautiful landscapes and natural scenery'),
('Anime', 'anime', 'Anime characters and artwork'),
('Abstract', 'abstract', 'Abstract art and geometric patterns'),
('Cars', 'cars', 'Automotive photography and illustrations'),
('Gaming', 'gaming', 'Video game screenshots and artwork'),
('Technology', 'technology', 'Tech-related imagery and futuristic designs'),
('Space', 'space', 'Astronomy and space exploration'),
('Minimal', 'minimal', 'Clean and minimalistic designs');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallpapers_updated_at
  BEFORE UPDATE ON public.wallpapers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();