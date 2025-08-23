-- Create storage bucket for wallpapers
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true);

-- Create wallpapers table with verification system
CREATE TABLE public.wallpapers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;

-- RLS policies for wallpapers table
CREATE POLICY "Users can view approved wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Users can view their own wallpapers" 
ON public.wallpapers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallpapers" 
ON public.wallpapers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallpapers" 
ON public.wallpapers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Storage policies for wallpapers bucket
CREATE POLICY "Users can view wallpaper files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wallpapers');

CREATE POLICY "Authenticated users can upload wallpapers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wallpapers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own wallpaper files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own wallpaper files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'wallpapers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wallpapers_updated_at
BEFORE UPDATE ON public.wallpapers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();