"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Navbar = () => {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Only show auth buttons on admin pages or when user is logged in
  const showAuthButtons = pathname.includes('/admin') || 
                          pathname.includes('/login') || 
                          pathname.includes('/signup') || 
                          user !== null;

  // Function to check which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "menu", "location", "contact"];
      const scrollPosition = window.scrollY + 100; // Adding offset for navbar height
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      
      // If no section is in view, set to null
      setActiveSection(null);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Helper function to determine nav item classes
  const getNavItemClasses = (sectionId: string) => {
    const baseClasses = "text-lg font-semibold transition-all duration-200 relative";
    const activeClasses = activeSection === sectionId 
      ? "text-primary font-bold" 
      : "text-foreground hover:text-primary";
    
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white"
    >
      {/* Social Media Bar */}
      <div className="bg-gray-100 py-1">
        <div className="container mx-auto px-4 flex justify-end">
          <div className="flex items-center space-x-4">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <Facebook className="w-4 h-4 text-gray-600 hover:text-primary" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
              <Twitter className="w-4 h-4 text-gray-600 hover:text-primary" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <Instagram className="w-4 h-4 text-gray-600 hover:text-primary" />
            </Link>
            <Link href="mailto:info@naxos.com" aria-label="Email">
              <Mail className="w-4 h-4 text-gray-600 hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
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
              onClick={() => scrollToSection("home")}
              className={getNavItemClasses("home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to home section"
            >
              Home
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("menu")}
              className={getNavItemClasses("menu")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to menu section"
            >
              Our Menu
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("location")}
              className={getNavItemClasses("location")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to location section"
            >
              Our Location
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("contact")}
              className={getNavItemClasses("contact")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to contact section"
            >
              Contact
            </motion.button>
            
            {/* Admin Link - Only visible when user is logged in */}
            {!isLoading && user && (
              <motion.button
                onClick={() => router.push('/direct-admin')}
                className="text-white bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin
              </motion.button>
            )}
          </div>

          {/* Auth Actions - Only shown on admin pages or when logged in */}
          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {user ? (
                    <motion.button
                      onClick={handleSignOut}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Out
                    </motion.button>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/login" 
                        className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 