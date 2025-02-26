"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, userRole, signOut, isLoading } = useAuth();
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    {userRole === 'admin' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link 
                          href="/admin" 
                          className="text-white bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                        >
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.button
                      onClick={handleSignOut}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Out
                    </motion.button>
                  </div>
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
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 