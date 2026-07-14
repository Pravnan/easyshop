"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface StoreData {
  name: string;
  slug: string;
  logo?: { url: string; publicId: string };
  categories?: { name: string; slug: string; _id: string }[];
}

interface StoreHeaderProps {
  store: StoreData;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href={`/store/${store.slug}`} className="flex items-center gap-2">
              {store.logo?.url ? (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={store.logo.url}
                  alt={store.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : null}
              <span className="text-xl font-bold tracking-tight" style={{color: "var(--primary-dark)"}}>
                {store.name}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors">
                  Categories
                  <ChevronDown className={`h-3 w-3 transition-transform ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full z-50 w-64 rounded-xl border bg-white p-4 shadow-xl"
                    >
                      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Categories</p>
                      <div className="space-y-1">
                        {store.categories?.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/store/${store.slug}?category=${cat._id}`}
                            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <Link
                          href={`/store/${store.slug}`}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"
                        >
                          View All
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href={`/store/${store.slug}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href={`/store/${store.slug}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Sale
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-2 text-gray-600 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block rounded-lg p-2 text-gray-600 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block rounded-lg p-2 text-gray-600 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </motion.button>
            <Link href={`/store/${store.slug}/cart`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-lg p-2 text-gray-600 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white"
                  >
                    {items.length}
                  </motion.span>
                )}
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b px-4 py-4">
                <span className="font-bold text-[var(--primary)]">{store.name}</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-1 p-4">
                <Link
                  href={`/store/${store.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {store.categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/store/${store.slug}?category=${cat._id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href={`/store/${store.slug}/cart`}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({items.length})
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
