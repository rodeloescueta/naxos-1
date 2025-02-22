import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Naxos - Fresh and Healthy Food Delivery",
  description: "Fresh and healthy food delivered to your doorstep",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="antialiased relative min-h-screen">
        {/* Background image */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: 'url(/images/decorative/bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9
          }}
        />
        
        {/* Dark overlay */}
        <div className="fixed inset-0 -z-10 bg-black/40" />

        {children}
      </body>
    </html>
  );
}
