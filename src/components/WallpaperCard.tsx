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
        "group relative bg-card rounded-lg overflow-hidden hover-scale cursor-pointer",
        "border border-border/50 hover:border-primary/50 transition-all duration-300",
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
          <div className="absolute top-3 left-3 premium-card px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-xs font-medium">
          {category}
        </div>

        {/* Hover Overlay */}
        <div 
          className={cn(
            "absolute inset-0 image-overlay transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="glass hover:bg-primary hover:text-primary-foreground"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="glass hover:bg-primary hover:text-primary-foreground"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className={cn("h-4 w-4", isLiked && "fill-current text-red-500")} />
                <span>{(likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm mb-1 line-clamp-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{resolution}</p>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0",
              isLiked && "text-red-500 hover:text-red-600"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;