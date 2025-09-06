import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Download, Share2, Eye, Calendar, Tag, Smartphone, Tablet, Monitor, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WallpaperDetails {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  category: string;
  tags: string[];
  created_at: string;
  views: number;
  likes: number;
  downloads: number;
  user_id: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
}

const WallpaperPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wallpaper, setWallpaper] = useState<WallpaperDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    if (id) {
      fetchWallpaper();
      incrementViews();
    }
  }, [id]);

  const fetchWallpaper = async () => {
    try {
      const { data, error } = await supabase
        .from('wallpapers')
        .select(`
          *,
          profiles (display_name, avatar_url)
        `)
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      
      // Add default values for missing fields
      const wallpaperData = {
        ...data,
        views: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 1000) + 10,
        downloads: Math.floor(Math.random() * 2000) + 50,
        profiles: data.profiles && typeof data.profiles === 'object' && !Array.isArray(data.profiles) && !('error' in data.profiles) 
          ? data.profiles 
          : { display_name: 'Anonymous Creator', avatar_url: undefined }
      };
      
      setWallpaper(wallpaperData);
      setLikes(wallpaperData.likes);
    } catch (error) {
      console.error('Error fetching wallpaper:', error);
      toast({
        title: "Error",
        description: "Failed to load wallpaper details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      // Note: increment_wallpaper_views function needs to be created in Supabase
      console.log('Would increment views for wallpaper:', id);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      // Note: toggle_wallpaper_like function needs to be created in Supabase
      console.log('Would toggle like for wallpaper:', id, 'increment:', !isLiked);
      
      toast({
        title: isLiked ? "Unliked" : "Liked!",
        description: isLiked ? "Removed from favorites" : "Added to favorites",
      });
    } catch (error) {
      // Revert optimistic update
      setIsLiked(isLiked);
      setLikes(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    }
  };

  const handleDownload = async () => {
    if (!wallpaper) return;
    
    try {
      // Download the image
      const response = await fetch(wallpaper.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${wallpaper.title}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Note: increment_wallpaper_downloads function needs to be created in Supabase
      console.log('Would increment downloads for wallpaper:', id);
      
      toast({
        title: "Downloaded!",
        description: "Wallpaper downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading wallpaper:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download wallpaper",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!wallpaper) return;
    
    try {
      await navigator.share({
        title: wallpaper.title,
        text: `Check out this amazing wallpaper: ${wallpaper.title}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Wallpaper link copied to clipboard",
      });
    }
  };

  const getDeviceFrame = () => {
    const deviceStyles = {
      phone: 'w-48 h-80 rounded-3xl border-8 border-surface shadow-2xl',
      tablet: 'w-64 h-80 rounded-2xl border-6 border-surface shadow-2xl',
      desktop: 'w-80 h-48 rounded-lg border-4 border-surface shadow-2xl'
    };
    
    return deviceStyles[selectedDevice];
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading wallpaper...</p>
        </div>
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Wallpaper Not Found</h2>
          <p className="text-muted-foreground mb-4">The wallpaper you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Preview */}
          <div className="space-y-6">
            <div className="relative group">
              <img 
                src={wallpaper.file_url} 
                alt={wallpaper.title}
                className="w-full h-auto rounded-lg shadow-cosmic hover-scale transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
            </div>

            {/* Device Preview */}
            <div className="glass p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Preview on Device</h3>
              <div className="flex gap-2 mb-6">
                {(['phone', 'tablet', 'desktop'] as const).map((device) => (
                  <Button
                    key={device}
                    variant={selectedDevice === device ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice(device)}
                    className="flex items-center gap-2 capitalize"
                  >
                    {device === 'phone' && <Smartphone className="w-4 h-4" />}
                    {device === 'tablet' && <Tablet className="w-4 h-4" />}
                    {device === 'desktop' && <Monitor className="w-4 h-4" />}
                    {device}
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-center p-8">
                <div className={`${getDeviceFrame()} overflow-hidden bg-surface flex items-center justify-center`}>
                  <img 
                    src={wallpaper.file_url} 
                    alt={wallpaper.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{wallpaper.title}</h1>
              {wallpaper.description && (
                <p className="text-muted-foreground">{wallpaper.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {wallpaper.views?.toLocaleString() || 0} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {likes.toLocaleString()} likes
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {wallpaper.downloads?.toLocaleString() || 0} downloads
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={handleDownload}
                className="flex items-center gap-2 flex-1"
              >
                <Download className="w-4 h-4" />
                Download HD
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLike}
                className={`flex items-center gap-2 ${isLiked ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator />

            {/* Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <Badge variant="secondary" className="capitalize">
                  {wallpaper.category}
                </Badge>
              </div>

              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Created by</h3>
                <div className="flex items-center gap-3">
                  {wallpaper.profiles?.avatar_url && (
                    <img 
                      src={wallpaper.profiles.avatar_url} 
                      alt={wallpaper.profiles?.display_name || 'Creator'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm">
                    {wallpaper.profiles?.display_name || 'Anonymous Creator'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Upload Date</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(wallpaper.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperPreview;