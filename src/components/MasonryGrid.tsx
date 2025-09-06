import { useState, useEffect, useRef } from 'react';
import WallpaperCard from './WallpaperCard';
import { Skeleton } from './ui/skeleton';

interface MasonryGridProps {
  wallpapers: any[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MasonryGrid = ({ wallpapers, loading, onLoadMore, hasMore }: MasonryGridProps) => {
  const [columns, setColumns] = useState(4);
  const [columnHeight, setColumnHeight] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns = 4;
      
      if (width < 640) newColumns = 2;
      else if (width < 1024) newColumns = 3;
      else if (width < 1440) newColumns = 4;
      else newColumns = 5;
      
      setColumns(newColumns);
      setColumnHeight(new Array(newColumns).fill(0));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, loading]);

  // Calculate item positions
  const getItemStyle = (index: number) => {
    if (columnHeight.length === 0) return {};
    
    const columnIndex = index % columns;
    const baseHeight = 250; // Base card height
    const randomHeight = Math.floor(Math.random() * 100) + 50; // Random additional height
    const itemHeight = baseHeight + randomHeight;
    
    const style = {
      position: 'absolute' as const,
      width: `calc((100% - ${(columns - 1) * 1}rem) / ${columns})`,
      left: `calc(${columnIndex} * (100% / ${columns}) + ${columnIndex * 1}rem)`,
      top: `${columnHeight[columnIndex]}px`,
      transition: 'all 0.3s ease',
    };

    // Update column height
    columnHeight[columnIndex] += itemHeight + 16; // 16px gap

    return style;
  };

  const containerHeight = Math.max(...columnHeight);

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className="relative w-full transition-all duration-300"
        style={{ height: `${containerHeight}px` }}
      >
        {wallpapers.map((wallpaper, index) => (
          <div
            key={wallpaper.id}
            style={getItemStyle(index)}
            className="animate-fade-in opacity-0"
            onLoad={() => {
              // Trigger fade in animation
              setTimeout(() => {
                const element = document.querySelector(`[data-wallpaper-id="${wallpaper.id}"]`);
                if (element) element.classList.remove('opacity-0');
              }, index * 50);
            }}
            data-wallpaper-id={wallpaper.id}
          >
            <WallpaperCard
              id={wallpaper.id}
              title={wallpaper.title}
              image={wallpaper.file_url}
              category={wallpaper.category}
              resolution="4K • 3840x2160"
              downloads={wallpaper.downloads || Math.floor(Math.random() * 5000) + 100}
              likes={wallpaper.likes || Math.floor(Math.random() * 1000) + 10}
              isPremium={wallpaper.isPremium || false}
              className="w-full h-auto magnetic-hover"
            />
          </div>
        ))}
        
        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                style={getItemStyle(wallpapers.length + index)}
                className="animate-pulse"
              >
                <Skeleton className="w-full h-64 rounded-lg bg-surface/50" />
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading more wallpapers...
            </div>
          ) : (
            <div className="text-muted-foreground">Scroll for more</div>
          )}
        </div>
      )}
    </div>
  );
};