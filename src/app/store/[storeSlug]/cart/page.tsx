"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const { items, updateQuantity, removeItem, clearCart, total, loaded } = useCart();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-4">
        <div className="mx-auto max-w-2xl py-8 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-4">
        <div className="mx-auto max-w-2xl py-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Add some products to get started
          </p>
          <Link href={`/store/${storeSlug}`}>
            <Button className="bg-[#1565C0] hover:bg-[#0D47A1]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasMultipleStores =
    new Set(items.map((i) => i.productId)).size > 1;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href={`/store/${storeSlug}`}
              className="mb-2 flex items-center gap-2 text-sm text-[#1565C0] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
          <Button variant="outline" size="sm" onClick={clearCart}>
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </Button>
        </div>

        {hasMultipleStores && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
            Your cart contains items from different stores. Please complete checkout
            for one store before adding items from another.
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${JSON.stringify(item.selectedVariants)}`}
              className="flex gap-4 rounded-xl border bg-white p-4"
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F7FA]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.selectedColor && <span>Colour: {item.selectedColor}</span>}
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedVariants &&
                    Object.entries(item.selectedVariants).map(([k, v]) => (
                      <span key={k}>
                        {k}: {v}
                      </span>
                    ))}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() => updateQuantity(i, item.quantity - 1)}
                      className="p-1 hover:bg-[#F5F7FA]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(i, item.quantity + 1)}
                      className="p-1 hover:bg-[#F5F7FA]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1565C0]">
                      Rs.{" "}
                      {(
                        (item.offerPrice ?? item.regularPrice) * item.quantity
                      ).toLocaleString("en-LK")}
                    </span>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-destructive hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-[#1565C0]">
              Rs. {total.toLocaleString("en-LK")}
            </span>
          </div>
          <Link href={`/store/${storeSlug}/checkout`}>
            <Button className="mt-4 w-full bg-[#1565C0] hover:bg-[#0D47A1]">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
