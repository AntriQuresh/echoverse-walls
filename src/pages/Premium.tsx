import { Crown, Check, X, Zap, Shield, Star, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumBanner from "@/components/PremiumBanner";

const Premium = () => {
  const freeFeatures = [
    { name: "Basic wallpaper collection", included: true },
    { name: "Standard resolution downloads", included: true },
    { name: "Limited downloads per day", included: true },
    { name: "Community support", included: true },
    { name: "Ad-supported experience", included: true },
    { name: "HD & 4K wallpapers", included: false },
    { name: "Exclusive premium content", included: false },
    { name: "Unlimited downloads", included: false },
    { name: "Ad-free browsing", included: false },
    { name: "Priority support", included: false },
    { name: "Early access to new collections", included: false },
    { name: "Custom resolution requests", included: false },
  ];

  const premiumFeatures = [
    { name: "Everything in Free", included: true },
    { name: "HD & 4K wallpapers", included: true },
    { name: "Exclusive premium content", included: true },
    { name: "Unlimited downloads", included: true },
    { name: "Ad-free browsing", included: true },
    { name: "Priority support", included: true },
    { name: "Early access to new collections", included: true },
    { name: "Custom resolution requests", included: true },
    { name: "Advanced search filters", included: true },
    { name: "Personal collections", included: true },
    { name: "Download history", included: true },
    { name: "Mobile app premium features", included: true },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      content: "EchoVerse Premium has transformed my workflow. The quality and variety are unmatched!",
      rating: 5,
    },
    {
      name: "Mike Rodriguez", 
      role: "Content Creator",
      content: "Best investment I've made for my creative projects. The exclusive content is incredible.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Digital Artist",
      content: "The ad-free experience and unlimited downloads save me so much time. Worth every penny!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 cosmic-bg relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 premium-card rounded-full mb-8 pulse-glow">
            <Crown className="h-12 w-12 text-card-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unlock Premium
            <span className="bg-gradient-premium bg-clip-text text-transparent block">
              EchoVerse Experience
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Join over 100,000 creators, designers, and enthusiasts who've upgraded to premium for unlimited access to our exclusive collection of stunning wallpapers.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="gem-purple text-3xl font-bold mb-2">500K+</div>
              <div className="text-sm text-muted-foreground">Exclusive Wallpapers</div>
            </div>
            <div className="text-center">
              <div className="gem-blue text-3xl font-bold mb-2">4K/8K</div>
              <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
            </div>
            <div className="text-center">
              <div className="gem-green text-3xl font-bold mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Unlimited Downloads</div>
            </div>
            <div className="text-center">
              <div className="gem-orange text-3xl font-bold mb-2">0</div>
              <div className="text-sm text-muted-foreground">Ads</div>
            </div>
          </div>
        </div>

        {/* Floating Premium Icons */}
        <div className="absolute top-20 left-10 gem-purple text-6xl opacity-10 float">
          <Crown />
        </div>
        <div className="absolute bottom-20 right-10 gem-blue text-5xl opacity-10 float" style={{ animationDelay: '2s' }}>
          <Star />
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare our plans and see why Premium is the perfect choice for serious wallpaper enthusiasts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">Free Plan</h3>
                <div className="text-5xl font-bold text-muted-foreground mb-4">$0</div>
                <p className="text-muted-foreground">Perfect to get started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground line-through"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full" size="lg">
                Current Plan
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="relative premium-card rounded-2xl p-8 text-card-foreground">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-hero px-6 py-2 rounded-full text-sm font-medium text-white flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">Premium Plan</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold">$9.99</span>
                  <div className="ml-3">
                    <div className="text-lg">/month</div>
                    <div className="text-sm opacity-80 line-through">$19.99</div>
                  </div>
                </div>
                <p className="opacity-90">50% off for early adopters!</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-white text-primary hover:bg-white/90 mb-4" size="lg">
                <Crown className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              
              <div className="text-center text-sm opacity-80">
                7-day free trial • Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 cosmic-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our premium users have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass rounded-xl p-6 hover-scale">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Banner CTA */}
      <PremiumBanner />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What's included in the free trial?",
                answer: "You get full access to all premium features for 7 days, including unlimited downloads, ad-free browsing, and exclusive content."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your current billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and various local payment methods depending on your region."
              },
              {
                question: "Do you offer student discounts?",
                answer: "Yes! Students with a valid .edu email address can get 50% off their first year of premium membership."
              },
            ].map((faq, index) => (
              <div key={index} className="glass rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-lg">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium;