-- Update users table with proper role structure
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE public.users ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
    ALTER TABLE public.users ADD COLUMN display_name text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.users ADD COLUMN avatar_url text;
  END IF;
END $$;

-- Update wallpapers table with proper structure
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wallpapers' AND column_name = 'download_count') THEN
    ALTER TABLE public.wallpapers ADD COLUMN download_count integer DEFAULT 0;
  END IF;
END $$;

-- Create downloads table for tracking
CREATE TABLE IF NOT EXISTS public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallpaper_id uuid REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(wallpaper_id, user_id) -- Prevent duplicate downloads by same user
);

-- Create profile submissions table
CREATE TABLE IF NOT EXISTS public.profile_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  bio text,
  links jsonb DEFAULT '[]'::jsonb,
  avatar_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_submissions ENABLE ROW LEVEL SECURITY;

-- Function to increment download count atomically
CREATE OR REPLACE FUNCTION public.increment_download_count(wallpaper_uuid uuid, user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert download record (will fail if duplicate due to unique constraint)
  INSERT INTO public.downloads (wallpaper_id, user_id)
  VALUES (wallpaper_uuid, user_uuid)
  ON CONFLICT (wallpaper_id, user_id) DO NOTHING;
  
  -- Only increment if this was a new download
  IF FOUND THEN
    UPDATE public.wallpapers 
    SET download_count = download_count + 1 
    WHERE id = wallpaper_uuid;
  END IF;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND (email = 'happyshops786@gmail.com' OR role = 'admin')
  );
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(role, 'user') FROM public.users WHERE id = user_id;
$$;

-- RLS Policies for downloads table
CREATE POLICY "Users can view their own downloads" 
ON public.downloads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads" 
ON public.downloads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all downloads" 
ON public.downloads FOR SELECT 
USING (public.is_admin());

-- RLS Policies for profile_submissions table
CREATE POLICY "Users can view their own profile submissions" 
ON public.profile_submissions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile submissions" 
ON public.profile_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending profile submissions" 
ON public.profile_submissions FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admin can view all profile submissions" 
ON public.profile_submissions FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admin can update all profile submissions" 
ON public.profile_submissions FOR UPDATE 
USING (public.is_admin());

-- Update wallpapers RLS policies for creator role
DROP POLICY IF EXISTS "Creators can insert wallpapers" ON public.wallpapers;
CREATE POLICY "Creators can insert wallpapers" 
ON public.wallpapers FOR INSERT 
WITH CHECK (
  auth.uid() = uploaded_by AND 
  (public.get_user_role() IN ('creator', 'admin') OR public.is_admin())
);

-- Update users table to set admin role for the specified email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'happyshops786@gmail.com';

-- Trigger for profile_submissions updated_at
CREATE OR REPLACE FUNCTION public.update_profile_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profile_submissions_updated_at ON public.profile_submissions;
CREATE TRIGGER update_profile_submissions_updated_at
  BEFORE UPDATE ON public.profile_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_submissions_updated_at();