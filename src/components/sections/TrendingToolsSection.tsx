import { suggestToolsAction } from "@/app/actions";
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

const TrendingToolsSection = async () => {
  const tools = await suggestToolsAction();

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-secondary">Trending Tools</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the most popular and powerful AI tools curated for you.
        </p>
        <div className="mt-4 inline-block glowing-underline-short" />
      </div>

      {tools && tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => {
            const Icon = iconMap[tool.category] || iconMap.default;
            return (
              <Card 
                key={index} 
                className="glass-card group overflow-hidden transition-all duration-300 hover:shadow-secondary/30 hover:-translate-y-2 hover:border-secondary/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                        <Icon className="h-6 w-6 text-secondary" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-headline">{tool.toolName}</CardTitle>
                        <Badge variant="outline" className="mt-1 border-secondary/50 text-secondary">{tool.category}</Badge>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
         <p className="text-center text-muted-foreground">Could not load trending tools at the moment. Please try again later.</p>
      )}
    </section>
  );
};

export default TrendingToolsSection;
