"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, UserCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";

const navLinks = [
  { href: "#tools", label: "Tools" },
  { href: "#generate", label: "Generate" },
  { href: "#features", label: "Features" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} asChild variant="ghost">
          <Link href={link.href} onClick={() => setMobileMenuOpen(false)}>
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
        <nav className="hidden items-center gap-2 md:flex">
          <NavItems />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <UserCircle2 className="h-6 w-6" />
            <span className="sr-only">Profile</span>
          </Button>
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col p-6 pt-12">
                   <div className="mb-8">
                     <Logo />
                   </div>
                  <nav className="flex flex-col gap-4">
                    <NavItems />
                  </nav>
                  <Button variant="outline" className="mt-8">
                    <UserCircle2 className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
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
