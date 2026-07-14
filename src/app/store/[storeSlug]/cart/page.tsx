"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, ShieldCheck } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartPage() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const { items, updateQuantity, removeItem, clearCart, total, loaded } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const shippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-6xl py-20 text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-lg py-24 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mb-8 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
            <Link href={`/store/${storeSlug}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href={`/store/${storeSlug}`} className="mb-2 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? "item" : "items"}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearCart}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </motion.button>
        </div>

        {/* Shipping progress */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Truck className="h-5 w-5 text-[var(--primary)]" />
            {remainingForFree > 0 ? (
              <p className="text-sm text-gray-600">
                Add <span className="font-bold text-[var(--primary)]">Rs. {remainingForFree.toLocaleString("en-LK")}</span> more for <span className="font-semibold">free shipping</span>
              </p>
            ) : (
              <p className="text-sm font-medium text-green-600">You qualify for free shipping! 🎉</p>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(shippingProgress, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#1565C0] to-[#1E88E5]"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left — Cart Items */}
          <div className="lg:col-span-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                    variants={fadeInUp}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex gap-5">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">No img</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <span className="text-lg font-bold text-[var(--primary)]">
                              Rs. {((item.offerPrice ?? item.regularPrice) * item.quantity).toLocaleString("en-LK")}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            {item.selectedColor && <span>Colour: <span className="text-gray-700">{item.selectedColor}</span></span>}
                            {item.selectedSize && <span>Size: <span className="text-gray-700">{item.selectedSize}</span></span>}
                            {item.selectedVariants &&
                              Object.entries(item.selectedVariants).map(([k, v]) => (
                                <span key={k}>{k}: <span className="text-gray-700">{v}</span></span>
                              ))}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-xl border-2 border-gray-200">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(i, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-l-xl"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </motion.button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(i, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-r-xl"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItem(i)}
                            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {total.toLocaleString("en-LK")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={`font-medium ${total >= FREE_SHIPPING_THRESHOLD ? "text-green-600" : "text-gray-900"}`}>
                    {total >= FREE_SHIPPING_THRESHOLD ? "Free" : "Calculated at checkout"}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-medium">-Rs. {Math.round(total * 0.1).toLocaleString("en-LK")}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-[var(--primary)]">
                      Rs. {(couponApplied ? total * 0.9 : total).toLocaleString("en-LK")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                {couponApplied ? (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                    <Tag className="h-4 w-4" />
                    Coupon applied — 10% off
                    <button onClick={() => setCouponApplied(false)} className="ml-auto text-green-500 hover:text-green-700">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="h-10 rounded-xl border-gray-200 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (coupon.trim()) {
                          setCouponApplied(true);
                          setCoupon("");
                        }
                      }}
                      className="h-10 rounded-xl bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </motion.button>
                  </div>
                )}
              </div>

              <Link href={`/store/${storeSlug}/checkout`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Proceed to Checkout
                </motion.button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure SSL checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
