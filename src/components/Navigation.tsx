import { useState } from "react";
import { Search, Menu, User, Crown, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Abstract", color: "gem-purple" },
    { name: "Anime", color: "gem-blue" },
    { name: "Gaming", color: "gem-green" },
    { name: "Cars", color: "gem-red" },
    { name: "Marvel", color: "gem-orange" },
    { name: "Minimal", color: "gem-yellow" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a0f7a28c-4a76-4122-a8f1-fe0cdc119362.png" 
              alt="EchoVerse" 
              className="h-10 w-10 float"
            />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              EchoVerse
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="/explore" className="hover:text-primary transition-colors">Explore</a>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="hover:text-primary transition-colors">Categories</button>
                <div className="absolute top-full left-0 mt-2 w-48 glass rounded-lg border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    {categories.map((category) => (
                      <a
                        key={category.name}
                        href={`/category/${category.name.toLowerCase()}`}
                        className={cn(
                          "block px-3 py-2 rounded-md hover:bg-surface-elevated transition-colors",
                          category.color
                        )}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search wallpapers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface border-border/50 focus:border-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="premium-card text-card-foreground">
                <Crown className="h-4 w-4 mr-2" />
                Premium
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-surface border-border/50"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <a href="/" className="py-2 hover:text-primary transition-colors">Home</a>
                <a href="/explore" className="py-2 hover:text-primary transition-colors">Explore</a>
                
                {/* Mobile Categories */}
                <div className="py-2">
                  <span className="text-sm font-medium text-muted-foreground">Categories</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category) => (
                      <a
                        key={category.name}
                        href={`/category/${category.name.toLowerCase()}`}
                        className={cn(
                          "px-3 py-2 rounded-md bg-surface hover:bg-surface-elevated transition-colors text-sm",
                          category.color
                        )}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Button className="premium-card text-card-foreground justify-start">
                  <Crown className="h-4 w-4 mr-2" />
                  Get Premium
                </Button>
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Wallpaper
                </Button>
                <Button variant="outline" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;