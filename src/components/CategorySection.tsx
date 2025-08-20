import { Gamepad2, Palette, Car, Sparkles, Minimize, Zap } from "lucide-react";

const categories = [
  {
    name: "Abstract",
    icon: Palette,
    color: "gem-purple",
    count: "15.2K",
    description: "Mind-bending artistic creations"
  },
  {
    name: "Gaming", 
    icon: Gamepad2,
    color: "gem-green",
    count: "22.8K",
    description: "Epic gaming landscapes & characters"
  },
  {
    name: "Cars",
    icon: Car,
    color: "gem-red", 
    count: "18.1K",
    description: "Luxury vehicles & racing scenes"
  },
  {
    name: "Anime",
    icon: Sparkles,
    color: "gem-blue",
    count: "31.5K",
    description: "Beautiful anime art & characters"
  },
  {
    name: "Minimal",
    icon: Minimize,
    color: "gem-yellow",
    count: "12.7K", 
    description: "Clean & simple aesthetic designs"
  },
  {
    name: "Cyberpunk",
    icon: Zap,
    color: "gem-orange",
    count: "9.3K",
    description: "Futuristic neon-lit worlds"
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 cosmic-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into carefully curated collections designed to match your style and passion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            
            return (
              <div
                key={category.name}
                className="group relative glass rounded-xl p-8 hover-scale cursor-pointer transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-${category.color.replace('gem-', '')} to-transparent`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-elevated mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${category.color}`} />
                  </div>

                  {/* Category Info */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${category.color}`}>
                      {category.count}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      wallpapers
                    </span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center`}>
                    <svg 
                      className="w-4 h-4 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center px-6 py-3 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <span>View All Categories</span>
            <svg 
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;