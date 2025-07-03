"use client";

import { Mail, Instagram, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const AboutContactSection = () => {
    return (
        <div className="relative isolate overflow-hidden bg-background py-16 sm:py-24 text-foreground">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(circle_800px_at_50%_200px,#1e0a3c,transparent)] opacity-50"></div>

            <div className="container mx-auto px-4 text-center">
                {/* About Us Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-24"
                >
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 animate-pulse glowing-text-secondary">
                        About NextGenAI
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground glowing-text-accent">
                        Revolutionizing AI experiences, built by Parul
                    </p>
                    <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-muted-foreground">
                        NextGenAI is a cutting-edge platform where futuristic design meets the limitless power of artificial intelligence. We provide a suite of tools for art generation, intelligent chatbots, realistic voice synthesis, and more, all wrapped in a seamless, creative experience. Our mission is to empower creators and innovators like you with intelligent, intuitive, and inspiring AI.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                        <span>Created by <span className="text-primary font-bold">Parul</span></span>
                        <div className="h-4 w-px bg-border hidden sm:block"></div>
                        <Link href="https://instagram.com/ig_parul_" target="_blank" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Instagram className="h-5 w-5" /> @ig_parul_
                        </Link>
                        <div className="h-4 w-px bg-border hidden sm:block"></div>
                        <Link href="mailto:wantedgamingyt12@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Mail className="h-5 w-5" /> wantedgamingyt12@gmail.com
                        </Link>
                    </div>
                </motion.div>

                {/* Contact Us Section */}
                <div id="contact" className="scroll-mt-20">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 glowing-text-primary"
                    >
                        Get in Touch
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground"
                    >
                        Have a question, a project idea, or just want to connect? We would love to hear from you.
                    </motion.p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Email Card */}
                        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true, amount: 0.5 }} className="glass-card p-8 rounded-xl glowing-border transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-2">
                             <Mail className="h-10 w-10 mx-auto text-primary mb-4" />
                             <h3 className="text-xl font-bold">Email Us</h3>
                             <p className="text-muted-foreground mt-2 break-all">wantedgamingyt12@gmail.com</p>
                        </motion.div>
                        {/* Instagram Card */}
                        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true, amount: 0.5 }} className="glass-card p-8 rounded-xl glowing-border transition-all duration-300 hover:shadow-secondary/40 hover:-translate-y-2">
                            <Instagram className="h-10 w-10 mx-auto text-secondary mb-4" />
                            <h3 className="text-xl font-bold">Follow Us</h3>
                            <p className="text-muted-foreground mt-2">@ig_parul_</p>
                        </motion.div>
                        {/* Support Hours Card */}
                        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true, amount: 0.5 }} className="glass-card p-8 rounded-xl glowing-border transition-all duration-300 hover:shadow-accent-foreground/40 hover:-translate-y-2">
                            <Clock className="h-10 w-10 mx-auto text-accent-foreground mb-4" />
                            <h3 className="text-xl font-bold">Support Hours</h3>
                            <p className="text-muted-foreground mt-2">9 AM – 11 PM IST, Mon–Sat</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutContactSection;
