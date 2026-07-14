"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
  storeSlug: string;
}

export function FeaturedCategories({ categories, storeSlug }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Shop by Category
          </h2>
          <p className="mb-10 text-center text-gray-500">
            Find exactly what you&apos;re looking for
          </p>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.slice(0, 3).map((cat, i) => (
            <motion.div
              key={cat._id}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/store/${storeSlug}?category=${cat._id}`}
                className="group relative block overflow-hidden rounded-2xl p-8" style={{background: "linear-gradient(135deg, var(--primary), var(--primary-dark))"}}
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  <p className="mt-2 text-sm text-white/70">Explore Collection</p>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="mt-4"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </motion.div>
                </div>
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
