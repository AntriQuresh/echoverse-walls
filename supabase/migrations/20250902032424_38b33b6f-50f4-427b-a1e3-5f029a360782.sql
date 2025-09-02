-- Update RLS policies for wallpapers table to allow admin access

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view approved wallpapers" ON public.wallpapers;
DROP POLICY IF EXISTS "Users can view their own wallpapers" ON public.wallpapers;

-- Create new policies with admin access
CREATE POLICY "Users can view approved wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (status = 'approved'::text);

CREATE POLICY "Users can view their own wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow admin to view ALL wallpapers
CREATE POLICY "Admin can view all wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'happyshops786@gmail.com'
);

-- Allow admin to update ALL wallpapers (for approval/rejection)
CREATE POLICY "Admin can update all wallpapers" 
ON public.wallpapers 
FOR UPDATE 
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'happyshops786@gmail.com'
);

-- Similar policies for profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new profile policies
CREATE POLICY "Approved profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (status = 'approved'::text);

CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow admin to view ALL profiles
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'happyshops786@gmail.com'
);

-- Allow admin to update ALL profiles (for approval/rejection)
CREATE POLICY "Admin can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'happyshops786@gmail.com'
);