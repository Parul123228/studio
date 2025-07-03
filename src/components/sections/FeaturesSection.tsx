import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Code, Images, Film, Music, Rocket } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Advanced AI Models",
    description: "Utilize state-of-the-art AI to generate text, images, and more with incredible quality and speed.",
  },
  {
    icon: Images,
    title: "High-Res Image Generation",
    description: "Create stunning, high-resolution images in various styles, from photorealistic to abstract art.",
  },
  {
    icon: Film,
    title: "AI Video Tools",
    description: "Bring your stories to life with AI-powered video generation and editing capabilities.",
  },
  {
    icon: Music,
    title: "Music Composition",
    description: "Generate unique, royalty-free music tracks for your projects in a wide range of genres.",
  },
  {
    icon: Code,
    title: "Code Assistance",
    description: "Accelerate your development workflow with AI that can write, debug, and explain code.",
  },
  {
    icon: Rocket,
    title: "Rapid Prototyping",
    description: "Quickly turn your ideas into functional prototypes and creative assets with our intuitive tools.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-primary">Platform Features</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the powerful capabilities that make LuminousAI the ultimate creative partner.
        </p>
        <div className="mt-4 inline-block glowing-underline-short" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className="glass-card group overflow-hidden transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-2 hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                   <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                      <Icon className="h-6 w-6 text-primary" />
                   </div>
                   <CardTitle className="text-xl font-headline mt-1">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
