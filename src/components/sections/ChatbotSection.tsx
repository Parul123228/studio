import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Link from "next/link";

const ChatbotSection = () => {
  return (
    <section className="w-full h-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-primary">AI Chatbot</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is a premium feature. Please upgrade your plan to start chatting with our advanced AI.
        </p>
        <div className="mt-4 inline-block glowing-underline-short" />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 border-dashed border-2 rounded-lg max-w-lg mx-auto">
            <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
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

export default ChatbotSection;
