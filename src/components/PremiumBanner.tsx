import { Crown, Check, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PremiumBanner = () => {
  const features = [
    "Unlimited HD & 4K downloads",
    "Exclusive premium wallpapers", 
    "Ad-free browsing experience",
    "Early access to new collections",
    "Custom resolution requests",
    "Priority customer support"
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cosmic-bg opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 premium-card rounded-full mb-6 pulse-glow">
              <Crown className="h-10 w-10 text-card-foreground" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Unlock Premium
              <span className="bg-gradient-premium bg-clip-text text-transparent block">
                EchoVerse Experience
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators and enthusiasts who've upgraded to premium for unlimited access to our exclusive collection.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">Free</h3>
                <div className="text-4xl font-bold text-muted-foreground mb-4">$0</div>
                <p className="text-muted-foreground">Perfect to get started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Limited HD downloads</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic wallpaper collection</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Community support</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full" size="lg">
                Current Plan
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="relative premium-card rounded-2xl p-8 text-card-foreground transform scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-hero px-6 py-2 rounded-full text-sm font-medium text-white">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">Premium</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-lg ml-2 opacity-80">/month</span>
                </div>
                <p className="opacity-90">Everything you need</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-white text-primary hover:bg-white/90" size="lg">
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBanner;