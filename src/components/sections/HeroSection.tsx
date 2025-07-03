"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import Typewriter from "@/components/shared/Typewriter";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const Orb = dynamic(() => import('@/components/shared/Orb'), { 
  ssr: false,
  loading: () => <Skeleton className="absolute inset-0 h-full w-full opacity-30 rounded-full" />
});

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,109,111,0.3),rgba(255,255,255,0))]"></div>
        <Suspense fallback={null}>
            <Orb />
        </Suspense>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center container mx-auto px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 font-headline">
          <Typewriter text="Welcome to Future Intelligence" />
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Designed by Parul | Transforming Creativity with Next-Gen AI
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="relative overflow-hidden group glowing-border bg-primary/20 text-primary-foreground hover:bg-primary/30">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00FFF7_0%,#9D00FF_50%,#00FFF7_100%)]" />
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-5 w-5"/>
              Generate AI Art
            </span>
          </Button>
          <Button size="lg" variant="outline" className="glowing-border hover:bg-primary/10">
            See Features
            <ArrowDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
