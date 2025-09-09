-- First, let's ensure proper RLS policies for public access to approved wallpapers
-- Drop existing policy that might be too restrictive
DROP POLICY IF EXISTS "Users can view approved wallpapers" ON public.wallpapers;

-- Create a policy that allows everyone (including anonymous users) to view approved wallpapers
CREATE POLICY "Everyone can view approved wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (status = 'approved'::text);

-- Insert some sample approved wallpapers for testing
INSERT INTO public.wallpapers (id, user_id, title, description, category, tags, file_url, file_path, status, created_at, updated_at) 
VALUES 
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Cosmic Nebula Dreams',
    'A stunning cosmic nebula with vibrant colors and stellar formations',
    'Abstract',
    ARRAY['space', 'cosmic', 'nebula', 'abstract'],
    '/src/assets/wallpaper-1.jpg',
    'wallpapers/cosmic-nebula.jpg',
    'approved',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Minimal Geometry',
    'Clean geometric patterns with modern minimal design',
    'Minimal',
    ARRAY['minimal', 'geometry', 'clean', 'modern'],
    '/src/assets/wallpaper-2.jpg',
    'wallpapers/minimal-geometry.jpg',
    'approved',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Neon Cyberpunk City',
    'Futuristic cyberpunk cityscape with neon lights',
    'Gaming',
    ARRAY['cyberpunk', 'neon', 'gaming', 'futuristic'],
    '/src/assets/wallpaper-3.jpg',
    'wallpapers/neon-cyberpunk.jpg',
    'approved',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Cherry Blossom Path',
    'Beautiful cherry blossom trees along a peaceful path',
    'Anime',
    ARRAY['anime', 'nature', 'cherry blossom', 'peaceful'],
    '/src/assets/wallpaper-4.jpg',
    'wallpapers/cherry-blossom.jpg',
    'approved',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '5 hours'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Ocean Sunset Reflection',
    'Stunning ocean sunset with perfect reflections',
    'Nature',
    ARRAY['nature', 'sunset', 'ocean', 'reflection'],
    '/src/assets/hero-bg.jpg',
    'wallpapers/ocean-sunset.jpg',
    'approved',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour'
  )
ON CONFLICT (id) DO NOTHING;