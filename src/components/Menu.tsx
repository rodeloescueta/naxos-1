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
import data from "@/lib/data/data.json";

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <section id="menu" className="py-16 bg-[#121212] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider">DISCOVER OUR MENU</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {data.menu.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 text-sm font-medium transition-all duration-300 uppercase tracking-wider ${
                selectedCategory === category.id
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-400">Loading menu items...</p>
          ) : menuItems.length === 0 ? (
            <p className="text-center text-gray-400">No items found for this category.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative h-40 w-40 rounded-full overflow-hidden mb-4">
                    {item.photo_url ? (
                      <Image
                        src={item.photo_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 max-w-xs">{item.description}</p>
                  <span className="text-yellow-400 font-semibold">
                    {formatPrice(item.price)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
} 