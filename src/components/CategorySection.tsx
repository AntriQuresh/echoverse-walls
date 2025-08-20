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
                className="group relative glass rounded-2xl p-8 cursor-pointer transition-all duration-500 animate-fade-in magnetic-hover tilt-card neon-border spotlight"
                style={{ animationDelay: `${index * 0.15}s` } as React.CSSProperties}
              >
                {/* Enhanced Background Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-all duration-500 bg-gradient-to-br from-${category.color.replace('gem-', '')} via-transparent to-transparent blur-xl`} />
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-300 bg-gradient-to-br from-${category.color.replace('gem-', '')} to-transparent`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-elevated mb-8 group-hover:scale-125 transition-all duration-500 neon-border`}>
                    <IconComponent className={`h-10 w-10 ${category.color} group-hover:drop-shadow-[0_0_12px_currentColor] transition-all duration-300`} />
                  </div>

                  {/* Enhanced Category Info */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors group-hover:drop-shadow-[0_0_8px_currentColor]">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors">
                      {category.description}
                    </p>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${category.color} group-hover:scale-110 transition-transform count-up`}>
                      {category.count}
                    </span>
                    <span className="text-base text-muted-foreground font-medium">
                      wallpapers
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-surface-elevated rounded-full mt-4 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-${category.color.replace('gem-', '')} to-primary rounded-full transition-all duration-1000 group-hover:w-full`} 
                         style={{ width: '60%' }}></div>
                  </div>
                </div>

                {/* Enhanced Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <div className={`w-10 h-10 rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center neon-border`}>
                    <svg 
                      className="w-5 h-5 text-primary drop-shadow-lg" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced View All Categories Button */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-primary border-2 border-primary/30 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:scale-105 neon-border magnetic-hover ripple">
            <span className="relative z-10">View All Categories</span>
            <svg 
              className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;