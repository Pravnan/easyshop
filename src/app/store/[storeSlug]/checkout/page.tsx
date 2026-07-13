"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutInput } from "@/validations/schemas";
import { checkout } from "@/actions/storefront/checkout";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-4">
        <div className="mx-auto max-w-2xl py-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
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
      toast.error(
        error instanceof Error ? error.message : "Checkout failed"
      );
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            href={`/store/${storeSlug}/cart`}
            className="mb-2 flex items-center gap-2 text-sm text-[#1565C0] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.name} x {item.quantity}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.selectedColor && (
                          <span>Colour: {item.selectedColor}</span>
                        )}
                        {item.selectedSize && (
                          <span>Size: {item.selectedSize}</span>
                        )}
                      </div>
                    </div>
                    <span>
                      Rs.{" "}
                      {(
                        (item.offerPrice ?? item.regularPrice) * item.quantity
                      ).toLocaleString("en-LK")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#1565C0]">
                    Rs. {total.toLocaleString("en-LK")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name</Label>
                    <Input id="customerName" {...register("customerName")} />
                    {errors.customerName && (
                      <p className="text-sm text-destructive">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea id="address" {...register("address")} rows={2} />
                  {errors.address && (
                    <p className="text-sm text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City / Delivery Area (optional)
                    </Label>
                    <Input id="city" {...register("city")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Order Note (optional)</Label>
                  <Textarea id="note" {...register("note")} rows={2} />
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleSubmit((data) => onSubmit(data, "WHATSAPP"))}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading !== null}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isLoading === "WHATSAPP"
                ? "Processing..."
                : "Continue with WhatsApp"}
            </Button>
            <Button
              onClick={handleSubmit((data) => onSubmit(data, "WEBSITE"))}
              className="flex-1 bg-[#1565C0] hover:bg-[#0D47A1]"
              disabled={isLoading !== null}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {isLoading === "WEBSITE" ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
