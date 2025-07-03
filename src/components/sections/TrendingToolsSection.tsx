import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { BrainCircuit, Mic, Palette, Film, Music, Code, ScanText, FileText, Bot } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  "AI": Bot,
  "Art": Palette,
  "Speech": Mic,
  "Video": Film,
  "Music": Music,
  "Code": Code,
  "Text": FileText,
  "Detection": ScanText,
  "default": BrainCircuit,
};

const trendingTools = [
  {
    toolName: "Chroma-Synth",
    description: "Generate photorealistic images and intricate illustrations from simple text prompts.",
    category: "Art",
  },
  {
    toolName: "Polyglot AI",
    description: "A real-time AI chat assistant that can understand and respond in multiple languages.",
    category: "AI",
  },
  {
    toolName: "Code-Crafter",
    description: "Automate boilerplate and generate functional code snippets in Python, JavaScript, and more.",
    category: "Code",
  },
  {
    toolName: "Echo-Weaver",
    description: "Create unique, royalty-free music compositions tailored to the mood of your content.",
    category: "Music",
  },
  {
    toolName: "Render-Flow",
    description: "Produce short, AI-powered video clips for social media from text or image inputs.",
    category: "Video",
  },
  {
    toolName: "Veritas-AI",
    description: "Quickly detect AI-generated content and ensure the authenticity of written text.",
    category: "Detection",
  },
];


const TrendingToolsSection = () => {
  const tools = trendingTools;

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Trending Tools</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the most popular and powerful AI tools curated for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => {
          const Icon = iconMap[tool.category] || iconMap.default;
          return (
            <Card 
              key={index} 
              className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-primary"
            >
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-secondary">
                          <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline">{tool.category}</Badge>
                  </div>
                  <CardTitle className="text-xl pt-4">{tool.toolName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingToolsSection;