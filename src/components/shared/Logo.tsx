import Link from "next/link";
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Sparkles className="h-7 w-7 text-primary animate-pulse" />
      <span className="font-headline text-2xl font-bold text-foreground transition-all hover:glowing-text">
        LuminousAI
      </span>
    </Link>
  );
};

export default Logo;
