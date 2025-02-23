"use client";

import { motion } from "framer-motion";

const LocationSection = () => {
  return (
    <section id="location" className="py-20">
      <div className="container mx-auto px-4 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            Find Us Here
          </h2>
          <p className="text-muted-foreground">
            Visit us at our location in Mansfield, UK
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2404.957216825324!2d-1.2033368839673614!3d53.13749997993501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879832c4f7b4a6d%3A0x8b8b2dd8726be3c2!2sMansfield%2C%20UK!5e0!3m2!1sen!2s!4v1645000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection; 