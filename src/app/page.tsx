import HeroSection from '@/components/sections/HeroSection';
import ImageGeneratorSection from '@/components/sections/ImageGeneratorSection';
import TrendingToolsSection from '@/components/sections/TrendingToolsSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="container mx-auto px-4 py-16 sm:py-24 space-y-24 sm:space-y-32">
        <TrendingToolsSection />
        <ImageGeneratorSection />
      </div>
    </div>
  );
}
