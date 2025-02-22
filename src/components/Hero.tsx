"use client";

import Image from "next/image";
import { featuredDish } from "@/lib/data/menu";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-16">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="text-5xl md:text-7xl font-display text-foreground max-w-4xl leading-tight">
            Fresh and Healthy
            <br />
            Food Specialties
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Variety of fresh and fresh food served just for you.
          </p>
        </motion.div>

        {/* Featured Dish */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-2xl aspect-[4/3]">
            <Image
              src={featuredDish.image}
              alt={featuredDish.name}
              fill
              className="object-cover rounded-lg"
              priority
            />
            {/* Decorative leaves */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.5, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -left-20 -bottom-10 w-40 h-40"
            >
              {/* <Image
                src="/images/decorative/leaf.webp"
                alt="Decorative leaf"
                fill
                className="object-contain"
              /> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.5, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -right-20 -top-10 w-40 h-40"
            >
              {/* <Image
                src="/images/decorative/leaf.webp"
                alt="Decorative leaf"
                fill
                className="object-contain"
              /> */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 