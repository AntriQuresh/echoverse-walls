-- Insert some sample approved wallpapers for testing if they don't exist
INSERT INTO public.wallpapers (user_id, title, description, category, tags, file_url, file_path, status) 
VALUES 
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Cosmic Nebula Dreams',
    'A stunning cosmic nebula with vibrant colors and stellar formations',
    'Abstract',
    ARRAY['space', 'cosmic', 'nebula', 'abstract'],
    '/src/assets/wallpaper-1.jpg',
    'wallpapers/cosmic-nebula.jpg',
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Minimal Geometry',
    'Clean geometric patterns with modern minimal design',
    'Minimal',
    ARRAY['minimal', 'geometry', 'clean', 'modern'],
    '/src/assets/wallpaper-2.jpg',
    'wallpapers/minimal-geometry.jpg',
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Neon Cyberpunk City',
    'Futuristic cyberpunk cityscape with neon lights',
    'Gaming',
    ARRAY['cyberpunk', 'neon', 'gaming', 'futuristic'],
    '/src/assets/wallpaper-3.jpg',
    'wallpapers/neon-cyberpunk.jpg',
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Cherry Blossom Path',
    'Beautiful cherry blossom trees along a peaceful path',
    'Anime',
    ARRAY['anime', 'nature', 'cherry blossom', 'peaceful'],
    '/src/assets/wallpaper-4.jpg',
    'wallpapers/cherry-blossom.jpg',
    'approved'
  ),
  (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Ocean Sunset Reflection',
    'Stunning ocean sunset with perfect reflections',
    'Nature',
    ARRAY['nature', 'sunset', 'ocean', 'reflection'],
    '/src/assets/hero-bg.jpg',
    'wallpapers/ocean-sunset.jpg',
    'approved'
  )
ON CONFLICT DO NOTHING;