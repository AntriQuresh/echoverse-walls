import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/70 cosmic-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <img 
              src="/lovable-uploads/a0f7a28c-4a76-4122-a8f1-fe0cdc119362.png" 
              alt="EchoVerse Logo" 
              className="h-20 w-20 float"
            />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              EchoVerse
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl md:text-4xl font-light text-foreground/90 mb-6">
            The Universe of 
            <span className="gem-purple font-semibold"> Premium </span>
            Wallpapers
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover millions of stunning wallpapers crafted by talented artists worldwide. 
            From cosmic abstracts to minimalist designs, find your perfect digital canvas.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:scale-110 transition-all duration-500 shadow-cosmic text-lg px-10 py-7 h-auto ripple neon-border group"
            >
              <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Explore Wallpapers</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="premium-card text-card-foreground hover:scale-110 transition-all duration-500 text-lg px-10 py-7 h-auto ripple group backdrop-blur-sm"
            >
              <Crown className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Get Premium</span>
            </Button>
          </div>

          {/* Stats with Animated Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-8 magnetic-hover spotlight neon-border">
              <div className="gem-purple text-4xl font-bold mb-3 count-up">1M+</div>
              <div className="text-muted-foreground font-medium">Premium Wallpapers</div>
              <div className="w-full h-1 bg-surface-elevated rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gem-purple to-primary w-3/4 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 magnetic-hover spotlight neon-border stagger-1">
              <div className="gem-blue text-4xl font-bold mb-3 count-up">500K+</div>
              <div className="text-muted-foreground font-medium">Active Users</div>
              <div className="w-full h-1 bg-surface-elevated rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gem-blue to-accent w-4/5 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 magnetic-hover spotlight neon-border stagger-2">
              <div className="gem-green text-4xl font-bold mb-3 count-up">50+</div>
              <div className="text-muted-foreground font-medium">Categories</div>
              <div className="w-full h-1 bg-surface-elevated rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gem-green to-primary w-2/3 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements with Particles */}
      <div className="absolute top-20 left-10 gem-purple text-5xl opacity-30 float particle-float" style={{ animationDelay: '0s' }}>
        ⬡
      </div>
      <div className="absolute top-32 right-20 gem-blue text-4xl opacity-30 float particle-float" style={{ animationDelay: '1s' }}>
        ⬢
      </div>
      <div className="absolute bottom-20 left-20 gem-orange text-6xl opacity-30 float particle-float" style={{ animationDelay: '2s' }}>
        ⬣
      </div>
      <div className="absolute bottom-32 right-10 gem-green text-4xl opacity-30 float particle-float" style={{ animationDelay: '3s' }}>
        ⬡
      </div>
      <div className="absolute top-1/2 left-1/4 gem-yellow text-3xl opacity-20 float particle-float" style={{ animationDelay: '4s' }}>
        ⬢
      </div>
      <div className="absolute top-1/3 right-1/3 gem-red text-4xl opacity-20 float particle-float" style={{ animationDelay: '5s' }}>
        ⬣
      </div>
    </section>
  );
};

export default Hero;