"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Carousel } from "./ui/carousel";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-display text-foreground mb-4">
            What Our
            <br />
            Customers Say
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <Carousel slideClassName="px-4">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Image - Overlapped */}
                <div className="absolute -top-32 md:-top-40 right-8 w-64 h-64 md:w-96 md:h-96 z-10">
                  <div className="relative w-full h-full">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Testimonial Card */}
                <div className="bg-[#1a1512]/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 mt-48 md:mt-64">
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-accent/5 rounded-full blur-xl" />
                  <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-accent/5 rounded-full blur-xl" />

                  {/* Content */}
                  <div className="relative max-w-xl">
                    <p className="text-[#c4a484] text-lg md:text-xl leading-relaxed mb-8">
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-[#e6c9a2]">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#a68a6c] text-lg">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Leaves */}
                <div className="absolute -left-8 top-32 md:top-40 w-24 h-24 text-[#4a9e5f]/20">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.86 7.37c-.237-3.89-3.23-6.87-7.12-7.11C13.76.23 12.77 0 11.8 0 8.87 0 6.17 1.08 4.12 3.13 2.08 5.18 1 7.88 1 10.8c0 .97.23 1.96.26 2.94.24 3.89 3.22 6.87 7.11 7.12.98.03 1.97.26 2.94.26 2.92 0 5.62-1.08 7.67-3.13 2.05-2.05 3.13-4.75 3.13-7.67 0-.97-.23-1.96-.26-2.94zM12 20c-.97 0-1.96-.23-2.94-.26-2.83-.17-5.07-2.41-5.24-5.24C3.79 13.52 3.56 12.53 3.56 11.56c0-2.33.91-4.5 2.56-6.15C7.77 3.77 9.94 2.86 12.27 2.86c.97 0 1.96.23 2.94.26 2.83.17 5.07 2.41 5.24 5.24.03.98.26 1.97.26 2.94 0 2.33-.91 4.5-2.56 6.15-1.65 1.65-3.82 2.56-6.15 2.56z"/>
                  </svg>
                </div>
                <div className="absolute -right-8 bottom-8 w-24 h-24 text-[#4a9e5f]/20 transform rotate-180">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.86 7.37c-.237-3.89-3.23-6.87-7.12-7.11C13.76.23 12.77 0 11.8 0 8.87 0 6.17 1.08 4.12 3.13 2.08 5.18 1 7.88 1 10.8c0 .97.23 1.96.26 2.94.24 3.89 3.22 6.87 7.11 7.12.98.03 1.97.26 2.94.26 2.92 0 5.62-1.08 7.67-3.13 2.05-2.05 3.13-4.75 3.13-7.67 0-.97-.23-1.96-.26-2.94zM12 20c-.97 0-1.96-.23-2.94-.26-2.83-.17-5.07-2.41-5.24-5.24C3.79 13.52 3.56 12.53 3.56 11.56c0-2.33.91-4.5 2.56-6.15C7.77 3.77 9.94 2.86 12.27 2.86c.97 0 1.96.23 2.94.26 2.83.17 5.07 2.41 5.24 5.24.03.98.26 1.97.26 2.94 0 2.33-.91 4.5-2.56 6.15-1.65 1.65-3.82 2.56-6.15 2.56z"/>
                  </svg>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
} 