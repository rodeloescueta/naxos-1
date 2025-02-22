"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Carousel } from "./ui/carousel";
import { menuCategories } from "@/lib/data/menu";
import Image from "next/image";

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0].name);

  const currentCategory = menuCategories.find(cat => cat.name === selectedCategory);
  const items = currentCategory?.items || [];

  return (
    <section id="menu" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of authentic Greek dishes
          </p>
        </motion.div>

        {/* Category buttons with horizontal scroll on mobile */}
        <div className="relative mb-12">
          <div className="flex justify-start md:justify-center gap-3 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-none">
            <div className="flex gap-3 md:flex-wrap">
              {menuCategories.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors whitespace-nowrap",
                    selectedCategory === category.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel slideClassName="px-2 md:px-4">
            {items.map((item) => (
              <motion.div
                key={item.name}
                className="bg-card/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02, translateY: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="aspect-[16/10] relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold flex-1">{item.name}</h3>
                    <span className="text-base md:text-lg font-medium text-primary whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex justify-end"
                  >
                    <Button size="icon" className="shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
} 