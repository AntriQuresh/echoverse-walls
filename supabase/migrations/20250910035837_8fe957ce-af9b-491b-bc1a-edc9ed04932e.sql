-- First, add the missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add missing column to wallpapers table
ALTER TABLE public.wallpapers 
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;

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

-- Enable RLS on new tables
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_submissions ENABLE ROW LEVEL SECURITY;

-- Update users table to set admin role for the specified email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'happyshops786@gmail.com';