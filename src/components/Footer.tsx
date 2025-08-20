import { Facebook, Twitter, Instagram, Youtube, Mail, Heart } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Explore", href: "/explore" },
      { name: "Categories", href: "/categories" },
      { name: "Premium", href: "/premium" },
      { name: "Mobile App", href: "/mobile" },
    ],
    Resources: [
      { name: "Help Center", href: "/help" },
      { name: "API Documentation", href: "/api" },
      { name: "Brand Guidelines", href: "/brand" },
      { name: "Creator Program", href: "/creators" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
      { name: "Contact", href: "/contact" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "DMCA", href: "/dmca" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-surface border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/a0f7a28c-4a76-4122-a8f1-fe0cdc119362.png" 
                alt="EchoVerse" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                EchoVerse
              </span>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              The universe's most beautiful collection of wallpapers. Discover, download, and transform your digital canvas with premium quality artwork.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold">Stay Updated</h4>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-l-lg focus:outline-none focus:border-primary text-sm"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
              <span>© 2024 EchoVerse. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for creators worldwide.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="gem-purple font-semibold">1M+</div>
                <div>Wallpapers</div>
              </div>
              <div className="text-center">
                <div className="gem-blue font-semibold">500K+</div>
                <div>Users</div>
              </div>
              <div className="text-center">
                <div className="gem-green font-semibold">99.9%</div>
                <div>Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;