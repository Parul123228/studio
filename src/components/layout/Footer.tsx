"use client"

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "../ui/button";

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", name: "Twitter" },
  { icon: Github, href: "https://github.com", name: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
];

const footerLinks = [
  { title: "Platform", links: ["Generate", "Tools", "Features", "Pricing"] },
  { title: "Company", links: ["About Us", "Careers", "Contact", "Blog"] },
  { title: "Resources", links: ["Documentation", "API", "Support", "Status"] },
];

const Footer = () => {
  return (
    <footer className="glass-card mt-auto border-t border-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-1 lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Transforming Creativity with Next-Gen AI.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Button key={social.name} asChild variant="ghost" size="icon" className="group">
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:scale-110 group-hover:animate-pulse" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-headline text-base font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary hover:glowing-text">
                        {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-primary/10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Built by Parul — Powered by 
            <span className="animate-background-pan bg-gradient-to-r from-electric-blue via-magenta to-cyber-purple bg-[200%_auto] bg-clip-text text-transparent"> Firebase & Genkit</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
