"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./scroll-reveal";

interface HeroSectionProps {
  storeName: string;
  storeSlug: string;
  bannerUrl?: string;
  logoUrl?: string;
}

export function HeroSection({ storeName, storeSlug, bannerUrl, logoUrl }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0"
      >
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={storeName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{background: `linear-gradient(135deg, var(--hero-from), var(--primary), var(--hero-to))`}} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {logoUrl && (
            <img src={logoUrl} alt={storeName} className="mx-auto mb-6 h-20 w-20 rounded-full border-2 border-white/30 object-cover shadow-xl" />
          )}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-lg">
            {storeName}
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-white/80 sm:text-xl">
            Discover premium products curated just for you
          </p>
          <motion.a
            href={`/store/${storeSlug}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold shadow-xl hover:bg-white/90 transition-colors" style={{color: "var(--primary-dark)"}}
          >
            Shop Now
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 animate-bounce"
        >
          <ArrowDown className="h-6 w-6 text-white/60" />
        </motion.div>
      </motion.div>
    </div>
  );
}
