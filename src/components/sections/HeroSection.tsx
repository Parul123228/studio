"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden py-32 md:py-48">
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5d5d5,transparent)]"></div></div>
      <div
        className="relative z-10 text-center container mx-auto px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 tracking-tight"
        >
            Welcome to NextGenAI
          <br />
           <span className="text-3xl sm:text-4xl md:text-5xl">by Parul</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
         Futuristic AI for the New Generation
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/#features">
              <Sparkles className="h-5 w-5"/>
              Try Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/signup">
              <UserPlus className="h-5 w-5" />
              Join Us
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
