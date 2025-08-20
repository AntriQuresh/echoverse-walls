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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:scale-105 transition-transform shadow-cosmic text-lg px-8 py-6 h-auto"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Explore Wallpapers
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="premium-card text-card-foreground hover:scale-105 transition-transform text-lg px-8 py-6 h-auto"
            >
              <Crown className="h-5 w-5 mr-2" />
              Get Premium
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="glass rounded-lg p-6 hover-scale">
              <div className="gem-purple text-3xl font-bold mb-2">1M+</div>
              <div className="text-muted-foreground">Premium Wallpapers</div>
            </div>
            
            <div className="glass rounded-lg p-6 hover-scale">
              <div className="gem-blue text-3xl font-bold mb-2">500K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            
            <div className="glass rounded-lg p-6 hover-scale">
              <div className="gem-green text-3xl font-bold mb-2">50+</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 gem-purple text-4xl opacity-20 float" style={{ animationDelay: '0s' }}>
        ⬡
      </div>
      <div className="absolute top-32 right-20 gem-blue text-3xl opacity-20 float" style={{ animationDelay: '1s' }}>
        ⬢
      </div>
      <div className="absolute bottom-20 left-20 gem-orange text-5xl opacity-20 float" style={{ animationDelay: '2s' }}>
        ⬣
      </div>
      <div className="absolute bottom-32 right-10 gem-green text-3xl opacity-20 float" style={{ animationDelay: '3s' }}>
        ⬡
      </div>
    </section>
  );
};

export default Hero;