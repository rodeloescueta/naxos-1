"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-muted"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo.png"
                alt="Naxos Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold font-display text-foreground">Naxos</span>
          </motion.button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.button
              onClick={() => scrollToSection("menu")}
              className="text-muted-foreground text-lg text-boldtext-white hover:text-accent transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Menu
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("location")}
              className="text-muted-foreground text-lg text-bold text-white hover:text-accent transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Location
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("contact")}
              className="text-muted-foreground text-lg text-bold text-white hover:text-accent transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>

          {/* Cart */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button> */}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 