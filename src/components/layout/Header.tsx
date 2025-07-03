"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Menu, UserCircle, Bot, Code, Mic, ScanText, FileText, Image as ImageIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useAuth } from "@/contexts/auth-context";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/generate", label: "Art Generator", icon: ImageIcon },
  { href: "/voice-generator", label: "Voice Generator", icon: Mic },
  { href: "/chatbot", label: "AI Chatbot", icon: Bot },
  { href: "/summarizer", label: "Summarizer", icon: FileText },
  { href: "/ai-detector", label: "AI Detector", icon: ScanText },
  { href: "/auto-coder", label: "Auto Coder", icon: Code },
];

const Header = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItems = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} asChild variant="ghost" className={isMobile ? "w-full justify-start" : ""}>
          <Link href={link.href} onClick={() => setMobileMenuOpen(false)}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-primary/10 bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          <NavItems />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt="User Avatar" />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6"/>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="glowing-border" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-[300px] bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col p-6 pt-12 h-full">
                   <div className="mb-8">
                     <Logo />
                   </div>
                  <nav className="flex flex-col gap-2">
                    <NavItems isMobile={true} />
                  </nav>
                  {!user && (
                    <div className="mt-auto flex flex-col gap-2">
                       <Button variant="outline" asChild>
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                       </Button>
                       <Button className="glowing-border" asChild>
                          <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                       </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
