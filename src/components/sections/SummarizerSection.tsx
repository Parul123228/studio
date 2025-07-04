import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Link from "next/link";

const SummarizerSection = () => {
  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-accent">Smart Summarizer</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is a premium feature. Please upgrade your plan to generate concise summaries of long texts.
        </p>
        <div className="mt-4 inline-block glowing-underline-short bg-accent shadow-accent/50" />
      </div>
       <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="text-center p-8 border-dashed border-2 rounded-lg max-w-lg mx-auto">
            <Rocket className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Upgrade to Unlock</h3>
            <p className="text-muted-foreground mb-6">
                Join our premium members to access this and many other powerful tools.
            </p>
            <Button asChild size="lg">
                <Link href="/plans">View Plans & Upgrade</Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default SummarizerSection;
