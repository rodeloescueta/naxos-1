"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen pt-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-1/4 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            style={{ y: titleY }}
            className="text-5xl md:text-7xl font-display text-foreground max-w-4xl leading-tight"
          >
            Tea captivates our hearts, and invites us
            <br />
            on an inspirational Journey.
          </motion.h1>
          <motion.p 
            style={{ y: subtitleY }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            Experience the authentic taste of Greek cuisine in every bite.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10"
          >
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Our Menu
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 