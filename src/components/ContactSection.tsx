"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import data from "@/lib/data/data.json";

const ContactSection = () => {
  const { title, subtitle, email, phone, address, hours, social } = data.contact;

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Address</h3>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Opening Hours</h3>
                <p className="text-muted-foreground">
                  {hours.weekdays}<br />
                  {hours.weekends}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Reservation</h3>
                <p className="text-muted-foreground">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </div>
          </motion.div>

          {/* Map or Additional Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm rounded-xl p-6 space-y-6"
          >
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <p className="text-muted-foreground mb-6">
              Follow us on social media for updates, special offers, and behind-the-scenes content.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent/10 p-3 rounded-full text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="w-6 h-6" />
              </motion.a>
              <motion.a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent/10 p-3 rounded-full text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent/10 p-3 rounded-full text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 