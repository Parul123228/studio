"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Menu, UserCircle, Bot, Image as ImageIcon, LayoutDashboard, User, Rocket, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import MembershipModal from "../shared/MembershipModal";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/generate", label: "Art Generator", icon: ImageIcon, premium: false },
  { href: "/chatbot", label: "AI Chatbot", icon: Bot, premium: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, premium: true },
  { href: "/discover", label: "Discover", icon: Rocket, premium: true },
  { href: "/plans", label: "Plans", icon: User, premium: false },
];

const Header = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isMembershipModalOpen, setMembershipModalOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
      toast({ title: 'Logout Failed', description: 'An error occurred while logging out.', variant: 'destructive' });
    } finally {
        setIsLoggingOut(false);
    }
  };
  
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    const isLocked = link.premium && (!user || user.plan === 'Free');
    if (isLocked) {
      e.preventDefault();
      setMembershipModalOpen(true);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } else {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };
  
  const getPlanVariant = () => {
    if (!user) return 'secondary';
    switch (user.plan) {
        case 'Premium': return 'default';
        case 'Ultra Premium': return 'secondary';
        default: return 'outline';
    }
  };

  const NavItems = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} asChild variant={isMobile ? 'ghost' : 'ghost'} className={isMobile ? 'justify-start' : ''}>
          <Link
            href={link.href}
            onClick={(e) => handleLinkClick(e, link)}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <>
      <MembershipModal open={isMembershipModalOpen} onOpenChange={setMembershipModalOpen} />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/80 backdrop-blur-lg"
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
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-6 w-6"/>}
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
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <Badge variant={getPlanVariant()} className="ml-auto">{user.plan}</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            <span>Logging out...</span>
                        </>
                    ) : (
                        <>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
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
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <SheetDescription className="sr-only">A list of navigation links and user actions.</SheetDescription>
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
                         <Button asChild>
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
    </>
  );
};

export default Header;
