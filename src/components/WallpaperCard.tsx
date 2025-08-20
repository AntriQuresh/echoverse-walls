import { useState } from "react";
import { Heart, Download, Share, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WallpaperCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  resolution: string;
  downloads: number;
  likes: number;
  isPremium?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const WallpaperCard = ({
  id,
  title,
  image,
  category,
  resolution,
  downloads,
  likes,
  isPremium = false,
  className,
  style
}: WallpaperCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement download logic
    console.log("Download wallpaper:", id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement share logic
    console.log("Share wallpaper:", id);
  };

  return (
    <div 
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden cursor-pointer neon-border magnetic-hover tilt-card",
        "border border-border/30 transition-all duration-500",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 left-4 premium-card px-3 py-1.5 rounded-full text-xs font-semibold flex items-center z-10 neon-border">
            <Crown className="h-3 w-3 mr-1.5" />
            Premium
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm z-10">
          {category}
        </div>

        {/* Hover Overlay */}
        <div 
          className={cn(
            "absolute inset-0 image-overlay transition-all duration-500 backdrop-blur-[2px]",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="glass hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 backdrop-blur-md ripple"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"  
                className="glass hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 backdrop-blur-md ripple"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-4 text-sm backdrop-blur-sm bg-black/20 rounded-full px-3 py-1.5">
              <div className="flex items-center space-x-1.5">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Heart className={cn("h-4 w-4 transition-colors", isLiked && "fill-current text-red-400")} />
                <span className="font-medium">{(likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Card Footer */}
      <div className="p-5 bg-gradient-to-t from-surface-elevated to-surface">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary/60 mr-2"></span>
              {resolution}
            </p>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-9 w-9 p-0 ml-3 hover:scale-110 transition-all duration-300 spotlight",
              isLiked ? "text-red-400 hover:text-red-500" : "hover:text-primary"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5 transition-all", isLiked && "fill-current scale-110")} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;