"use client"

import { Github, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "../ui/button";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/ig_parul_", name: "Instagram" },
  { icon: Mail, href: "mailto:wantedgamingyt12@gmail.com", name: "Email" },
  { icon: Twitter, href: "https://twitter.com", name: "Twitter" },
  { icon: Github, href: "https://github.com", name: "GitHub" },
];

const footerLinks = [
  { 
    title: "AI Tools", 
    links: [
      { label: "Art Generator", href: "/generate" },
      { label: "AI Chatbot", href: "/chatbot" },
    ] 
  },
  { 
    title: "Account", 
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" },
      { label: "Plans", href: "/plans" },
    ] 
  },
  { 
    title: "Company", 
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/about#contact" },
      { label: "Admin", href: "/admin" }
    ] 
  },
];

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-1 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Futuristic AI for the New Generation.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.name} asChild variant="ghost" size="icon" className="group">
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-lg text-muted-foreground font-bold">
            Built by <span className="text-primary">Parul</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
