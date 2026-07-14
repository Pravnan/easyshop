"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  regularPrice: number;
  offerPrice?: number;
  images: { url: string; publicId: string }[];
  inStock: boolean;
}

interface ProductGridProps {
  products: ProductData[];
  storeSlug: string;
}

export function ProductGrid({ products, storeSlug }: ProductGridProps) {
  const { addItem, items } = useCart();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-400">No products found</p>
      </div>
    );
  }

  function handleQuickAdd(product: ProductData) {
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
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product, i) => {
        const price = product.offerPrice ?? product.regularPrice;
        return (
          <motion.div
            key={product._id}
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group"
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
                {product.offerPrice && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                    -{Math.round((1 - product.offerPrice / product.regularPrice) * 100)}%
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-900">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <Link href={`/store/${storeSlug}/product/${product.slug}`}>
              <h3 className="mb-1 font-medium text-gray-900 hover:text-[var(--primary)] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <div className="mb-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3 w-3 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg font-bold text-[var(--primary)]">
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
