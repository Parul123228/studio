import AllFeaturesSection from '@/components/sections/AllFeaturesSection';

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Tools</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          This page is no longer in use. Please check out the new features on the home page.
        </p>
      </div>
      <AllFeaturesSection />
    </div>
  );
}
