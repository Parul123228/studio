"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, UserPlus } from 'lucide-react';
import Typewriter from "@/components/shared/Typewriter";
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import dynamic from 'next/dynamic';

const Orb = dynamic(() => import('@/components/shared/Orb'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 h-full w-full opacity-30" />,
});

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Orb isMobile={isMobile} />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(circle_500px_at_50%_200px,#0d253a,transparent)]"></div>
      
      <div
        style={{
          perspective: '1000px',
        }}
        className="relative z-10 text-center container mx-auto px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 tracking-tight"
        >
          <span className="glowing-text">Welcome to NextGenAI</span>
          <br />
           <span className="text-3xl sm:text-4xl md:text-5xl">by Parul</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
         <Typewriter text="Futuristic AI for the New Generation" speed={50} />
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="glowing-border" asChild>
            <Link href="/#features">
              <Sparkles className="mr-2 h-5 w-5"/>
              Try Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/signup">
              <UserPlus className="mr-2 h-5 w-5" />
              Join Us
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
