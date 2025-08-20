import Hero from "@/components/Hero";
import WallpaperGrid from "@/components/WallpaperGrid";
import CategorySection from "@/components/CategorySection";
import PremiumBanner from "@/components/PremiumBanner";

const Index = () => {
  return (
    <div>
      <Hero />
      <WallpaperGrid 
        title="Featured Wallpapers" 
        subtitle="Handpicked by our curators for exceptional quality and creativity"
        limit={8}
        showViewAll={true}
      />
      <CategorySection />
      <WallpaperGrid 
        title="Trending Now" 
        subtitle="The most downloaded wallpapers this week"
        limit={4}
      />
      <PremiumBanner />
    </div>
  );
};

export default Index;
