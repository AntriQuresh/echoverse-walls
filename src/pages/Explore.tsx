import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WallpaperGrid from "@/components/WallpaperGrid";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "All", "Abstract", "Anime", "Gaming", "Cars", "Marvel", "Minimal", "Cyberpunk"
  ];

  const filters = [
    { name: "Resolution", options: ["All", "HD", "2K", "4K", "8K"] },
    { name: "Orientation", options: ["All", "Landscape", "Portrait", "Square"] },
    { name: "Color", options: ["All", "Dark", "Light", "Colorful", "Monochrome"] },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 cosmic-bg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore the
            <span className="bg-gradient-hero bg-clip-text text-transparent block">
              EchoVerse Collection
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover over 1 million premium wallpapers across every category imaginable
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by keyword, color, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-surface border-border/50 focus:border-primary rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-glow-primary"
                      : "bg-surface hover:bg-surface-elevated text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Advanced Filters Button */}
              <Button variant="outline" size="sm" className="glass">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-surface rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {selectedCategory === "All" ? "All Wallpapers" : `${selectedCategory} Wallpapers`}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : "Showing latest uploads"}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="gem-purple font-semibold">24,567</span> wallpapers found
            </div>
          </div>

          <WallpaperGrid 
            title="" 
            limit={20}
            showViewAll={false}
            category={selectedCategory}
            searchQuery={searchQuery}
          />

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Wallpapers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;