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
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Wallpaper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {displayWallpapers.map((wallpaper, index) => (
            <WallpaperCard
              key={wallpaper.id}
              {...wallpaper}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium transition-all duration-300 rounded-lg bg-gradient-hero hover:scale-105 shadow-cosmic">
              <span className="relative text-white">
                View All Wallpapers
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WallpaperGrid;