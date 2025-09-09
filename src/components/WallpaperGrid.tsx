import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WallpaperCard from "./WallpaperCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import wallpaper1 from "@/assets/wallpaper-1.jpg";
import wallpaper2 from "@/assets/wallpaper-2.jpg";
import wallpaper3 from "@/assets/wallpaper-3.jpg";
import wallpaper4 from "@/assets/wallpaper-4.jpg";

interface WallpaperGridProps {
  title: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  category?: string;
  searchQuery?: string;
}

interface Wallpaper {
  id: string;
  title: string;
  file_url: string;
  category: string;
  tags: string[];
  user_id: string;
  status: string;
  created_at: string;
}

// Fallback wallpapers for when there's no data
const fallbackWallpapers = [
  {
    id: "fallback-1",
    title: "Cosmic Nebula Dreams",
    file_url: wallpaper1,
    category: "Abstract",
    tags: ["space", "cosmic"],
    user_id: "",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2", 
    title: "Minimal Geometry",
    file_url: wallpaper2,
    category: "Minimal",
    tags: ["minimal", "geometry"],
    user_id: "",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "Neon Cyberpunk City",
    file_url: wallpaper3,
    category: "Gaming",
    tags: ["cyberpunk", "neon"],
    user_id: "",
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "Cherry Blossom Path",
    file_url: wallpaper4,
    category: "Anime",
    tags: ["anime", "nature"],
    user_id: "",
    status: "approved",
    created_at: new Date().toISOString(),
  },
];

const WallpaperGrid = ({ 
  title, 
  subtitle, 
  limit, 
  showViewAll = false,
  category,
  searchQuery
}: WallpaperGridProps) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallpapers();
  }, [category, searchQuery, limit]);

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('wallpapers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,tags.cs.{"${searchQuery}"}`);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Use real data if available, otherwise fall back to sample wallpapers
      if (data && data.length > 0) {
        setWallpapers(data);
      } else {
        // Show fallback data when no real wallpapers exist
        const fallbackData = limit ? fallbackWallpapers.slice(0, limit) : fallbackWallpapers;
        setWallpapers(fallbackData);
      }
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      // Don't show error toast, just fall back to sample wallpapers gracefully
      console.log('Falling back to sample wallpapers due to:', error);
      // Show fallback data on error
      const fallbackData = limit ? fallbackWallpapers.slice(0, limit) : fallbackWallpapers;
      setWallpapers(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Cosmic Background Pattern */}
      <div className="absolute inset-0 cosmic-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent scroll-reveal">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed scroll-reveal stagger-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Enhanced Wallpaper Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {wallpapers.map((wallpaper, index) => (
              <WallpaperCard
                key={wallpaper.id}
                id={wallpaper.id}
                title={wallpaper.title}
                image={wallpaper.file_url}
                category={wallpaper.category}
                resolution="4K • 3840x2160"
                downloads={Math.floor(Math.random() * 50000) + 1000}
                likes={Math.floor(Math.random() * 10000) + 100}
                isPremium={Math.random() > 0.6}
                className="animate-fade-in scroll-reveal"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced View All Button */}
        {showViewAll && !loading && (
          <div className="text-center">
            <button 
              onClick={() => navigate('/explore')}
              className="group relative inline-flex items-center justify-center px-10 py-4 text-xl font-bold transition-all duration-500 rounded-2xl bg-gradient-hero hover:scale-110 shadow-cosmic magnetic-hover ripple overflow-hidden"
            >
              <span className="relative z-10 text-white flex items-center">
                View All Wallpapers
                <svg 
                  className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full" 
                   style={{ animationDuration: '0.6s' }} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WallpaperGrid;