import WallpaperCard from "./WallpaperCard";
import wallpaper1 from "@/assets/wallpaper-1.jpg";
import wallpaper2 from "@/assets/wallpaper-2.jpg";
import wallpaper3 from "@/assets/wallpaper-3.jpg";
import wallpaper4 from "@/assets/wallpaper-4.jpg";

interface WallpaperGridProps {
  title: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
}

// Mock data - in a real app, this would come from an API
const mockWallpapers = [
  {
    id: "1",
    title: "Cosmic Nebula Dreams",
    image: wallpaper1,
    category: "Abstract",
    resolution: "4K • 3840x2160",
    downloads: 12450,
    likes: 3201,
    isPremium: true,
  },
  {
    id: "2", 
    title: "Minimal Geometry",
    image: wallpaper2,
    category: "Minimal",
    resolution: "2K • 2560x1440",
    downloads: 8932,
    likes: 1876,
    isPremium: false,
  },
  {
    id: "3",
    title: "Neon Cyberpunk City",
    image: wallpaper3,
    category: "Gaming",
    resolution: "4K • 3840x2160",
    downloads: 15623,
    likes: 4105,
    isPremium: true,
  },
  {
    id: "4",
    title: "Cherry Blossom Path",
    image: wallpaper4,
    category: "Anime",
    resolution: "HD • 1920x1080",
    downloads: 22134,
    likes: 5892,
    isPremium: false,
  },
  // Duplicate some for demonstration
  {
    id: "5",
    title: "Abstract Waves",
    image: wallpaper1,
    category: "Abstract",
    resolution: "4K • 3840x2160",
    downloads: 9876,
    likes: 2340,
    isPremium: true,
  },
  {
    id: "6",
    title: "Clean Lines",
    image: wallpaper2,
    category: "Minimal",
    resolution: "2K • 2560x1440",
    downloads: 6543,
    likes: 1254,
    isPremium: false,
  },
  {
    id: "7",
    title: "Digital Landscape",
    image: wallpaper3,
    category: "Gaming",
    resolution: "4K • 3840x2160",
    downloads: 11087,
    likes: 2987,
    isPremium: true,
  },
  {
    id: "8",
    title: "Peaceful Garden",
    image: wallpaper4,
    category: "Anime",
    resolution: "HD • 1920x1080",
    downloads: 18234,
    likes: 4567,
    isPremium: false,
  },
];

const WallpaperGrid = ({ 
  title, 
  subtitle, 
  limit, 
  showViewAll = false 
}: WallpaperGridProps) => {
  const displayWallpapers = limit ? mockWallpapers.slice(0, limit) : mockWallpapers;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {displayWallpapers.map((wallpaper, index) => (
            <WallpaperCard
              key={wallpaper.id}
              {...wallpaper}
              className="animate-fade-in scroll-reveal"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            />
          ))}
        </div>

        {/* Enhanced View All Button */}
        {showViewAll && (
          <div className="text-center">
            <button className="group relative inline-flex items-center justify-center px-10 py-4 text-xl font-bold transition-all duration-500 rounded-2xl bg-gradient-hero hover:scale-110 shadow-cosmic magnetic-hover ripple overflow-hidden">
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