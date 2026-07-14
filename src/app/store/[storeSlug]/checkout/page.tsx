"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { checkoutSchema, CheckoutInput } from "@/validations/schemas";
import { checkout } from "@/actions/storefront/checkout";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ShoppingBag, ArrowLeft, ShieldCheck, RotateCcw, LockKeyhole, ChevronRight, Truck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const steps = ["Information", "Review", "Confirm"];

export default function CheckoutPage() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-lg py-24 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mb-8 text-gray-500">Add some items before checking out.</p>
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

  async function onSubmit(data: CheckoutInput, option: "WHATSAPP" | "WEBSITE") {
    setIsLoading(option);
    try {
      const cartItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        selectedVariants: item.selectedVariants,
        quantity: item.quantity,
      }));
      const result = await checkout(storeSlug, data, option, cartItems);
      clearCart();
      if (option === "WHATSAPP" && result.redirectUrl) {
        window.open(result.redirectUrl, "_blank");
        router.push(`/store/${storeSlug}/order-success/${result.orderId}`);
      } else {
        router.push(result.redirectUrl);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href={`/store/${storeSlug}/cart`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                i <= step ? "bg-[var(--primary)] text-white shadow-md" : "bg-gray-200 text-gray-400"
              }`}>
                {i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${i <= step ? "text-[var(--primary)]" : "text-gray-400"}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-12 ${i < step ? "bg-[var(--primary)]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left — Customer Details */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <h2 className="mb-6 text-lg font-bold text-gray-900">Contact Information</h2>
              <form className="space-y-4" id="checkout-form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input id="customerName" {...register("customerName")} className="h-11 rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="John Silva" />
                    {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input id="phone" {...register("phone")} className="h-11 rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="0771234567" />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email (optional)</Label>
                  <Input id="email" type="email" {...register("email")} className="h-11 rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <h2 className="mb-6 text-lg font-bold text-gray-900">Delivery Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                  <Textarea id="address" {...register("address")} rows={2} className="rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="123 Main Street, Colombo" />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City (optional)</Label>
                    <Input id="city" {...register("city")} className="h-11 rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="Colombo 05" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-sm font-medium text-gray-700">Order Note (optional)</Label>
                  <Textarea id="note" {...register("note")} rows={2} className="rounded-xl border-gray-200 focus:border-[var(--primary)] focus:ring-[#1565C0]/20" placeholder="Delivery instructions, special requests..." />
                </div>
              </div>
            </motion.div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 text-xs text-gray-400">
              <div className="flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" /> SSL Secure</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Buyer Protection</div>
              <div className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> Free Returns</div>
              <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Free Shipping*</div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="mb-5 text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                        {item.selectedColor && <span>Colour: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[var(--primary)]">
                        Rs. {((item.offerPrice ?? item.regularPrice) * item.quantity).toLocaleString("en-LK")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">Rs. {total.toLocaleString("en-LK")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[var(--primary)]">Rs. {total.toLocaleString("en-LK")}</span>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mt-5 rounded-xl bg-gray-50 p-3 text-xs text-gray-500 flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--primary)]" />
                Estimated delivery: <span className="font-medium text-gray-700">3-5 business days</span>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit((data) => onSubmit(data, "WEBSITE"))}
                  disabled={isLoading !== null}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isLoading === "WEBSITE" ? "Processing..." : "Place Order"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit((data) => onSubmit(data, "WHATSAPP"))}
                  disabled={isLoading !== null}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-green-600 py-3.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isLoading === "WHATSAPP" ? "Processing..." : "Continue with WhatsApp"}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
