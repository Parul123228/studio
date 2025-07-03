import Link from "next/link";
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Sparkles className="h-7 w-7 text-primary transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 motion-safe:animate-pulse" />
      <span className="font-headline text-2xl font-bold text-foreground transition-all group-hover:glowing-text">
        NextGenAI
      </span>
    </Link>
  );
};

export default Logo;
