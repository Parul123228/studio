import AllFeaturesSection from '@/components/sections/AllFeaturesSection';
import HeroSection from '@/components/sections/HeroSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AllFeaturesSection />
    </div>
  );
}
