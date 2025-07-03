import Link from "next/link";
import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Sparkles className="h-7 w-7 text-primary transition-all duration-500 group-hover:rotate-180" />
      <span className="text-2xl font-bold text-foreground">
        NextGenAI
      </span>
    </Link>
  );
};

export default Logo;
