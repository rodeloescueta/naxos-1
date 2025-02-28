"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Plus } from "lucide-react";
// import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Carousel } from "./ui/carousel";
import Image from "next/image";
import { getCategories } from "@/lib/categories";
import { getMenuItemsByCategory } from "@/lib/menu-items";
import type { Category } from "@/lib/categories";
import type { MenuItem } from "@/lib/menu-items";

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Set the first category as selected by default
        if (categoriesData.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedCategory]);

  // Fetch menu items when selected category changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!selectedCategory) return;
      
      setLoading(true);
      try {
        const items = await getMenuItemsByCategory(selectedCategory);
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

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
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors whitespace-nowrap",
                    selectedCategory === category.id
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
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">Loading menu items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items found in this category.</p>
            </div>
          ) : (
            <Carousel slideClassName="pl-4 md:px-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="relative rounded-xl overflow-hidden shadow-lg mr-4 md:mr-0"
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Wooden board background */}
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/decorative/board.jpeg)' }} />
                  
                  {/* Dark overlay for better readability */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Content container with glass effect */}
                  <div className="relative">
                    <div className="aspect-[16/10] relative">
                      <Image
                        src={item.photo_url || '/images/placeholder-food.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 md:p-6 backdrop-blur-sm bg-black/30">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-lg md:text-xl font-semibold flex-1 text-white">
                          {item.title}
                        </h3>
                        <span className="text-base md:text-lg font-medium text-white whitespace-nowrap">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex justify-end"
                      >
                        {/* Add to cart button could go here */}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
} 