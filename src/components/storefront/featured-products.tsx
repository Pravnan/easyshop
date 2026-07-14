"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  slug: string;
  regularPrice: number;
  offerPrice?: number;
  images: { url: string; publicId: string }[];
  inStock: boolean;
  categoryId: string;
}

interface FeaturedProductsProps {
  products: Product[];
  storeSlug: string;
}

export function FeaturedProducts({ products, storeSlug }: FeaturedProductsProps) {
  const { addItem, items } = useCart();

  if (products.length === 0) return null;

  function handleQuickAdd(product: Product) {
    const sameStore = items.length === 0 || items[0].productId === product._id;
    if (!sameStore) {
      if (!window.confirm("Your cart contains items from another product. Clear cart and add this item?")) {
        return;
      }
    }

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      regularPrice: product.regularPrice,
      offerPrice: product.offerPrice,
      quantity: 1,
    });
    toast.success("Added to cart");
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <p className="mb-10 text-center text-gray-500">
            Our most popular picks
          </p>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product, i) => {
            const price = product.offerPrice ?? product.regularPrice;
            const discount = product.offerPrice
              ? Math.round((1 - product.offerPrice / product.regularPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product._id}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative"
              >
                <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    {product.images[0] ? (
                      <motion.img
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">No image</div>
                    )}
                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                        -{discount}%
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-900">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success("Added to wishlist");
                      }}
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </motion.button>
                  </div>
                </Link>

                <Link href={`/store/${storeSlug}/product/${product.slug}`}>
                  <h3 className="mb-1 font-medium text-gray-900 group-hover:text-[#1565C0] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                  <span className="ml-1 text-xs text-gray-400">(12)</span>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1565C0]">
                    Rs. {price.toLocaleString("en-LK")}
                  </span>
                  {product.offerPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.regularPrice.toLocaleString("en-LK")}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickAdd(product)}
                  disabled={!product.inStock}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1565C0] py-2.5 text-sm font-medium text-white hover:bg-[#0D47A1] transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.inStock ? "Quick Add" : "Sold Out"}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
