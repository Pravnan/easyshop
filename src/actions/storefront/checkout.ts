"use server";

import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Counter } from "@/models/Counter";
import { checkoutSchema, CheckoutInput } from "@/validations/schemas";
import { generateOrderId } from "@/lib/order-id/generate";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp/message";
import { revalidatePath } from "next/cache";

interface CartItemInput {
  productId: string;
  name: string;
  image?: string;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariants?: Record<string, string>;
  quantity: number;
}

export async function checkout(
  storeSlug: string,
  data: CheckoutInput,
  option: "WHATSAPP" | "WEBSITE",
  cartItems: CartItemInput[]
) {
  await connectDB();

  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const store = await Store.findOne({ slug: storeSlug });
  if (!store) throw new Error("Store not found");
  if (!store.isActive) throw new Error("Store is unavailable");

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = [];
  let calculatedSubtotal = 0;

  for (const cartItem of cartItems) {
    const product = await Product.findOne({
      _id: cartItem.productId,
      storeId: store._id,
    });

    if (!product) {
      throw new Error(`Product "${cartItem.name}" not found`);
    }

    const unitPrice = product.offerPrice ?? product.regularPrice;
    const subtotal = unitPrice * cartItem.quantity;
    calculatedSubtotal += subtotal;

    items.push({
      productId: product._id,
      productName: product.name,
      productImage: product.images[0]?.url ?? cartItem.image,
      selectedColor: cartItem.selectedColor,
      selectedSize: cartItem.selectedSize,
      selectedVariants: cartItem.selectedVariants,
      quantity: cartItem.quantity,
      unitPrice,
      subtotal,
    });
  }

  const total = calculatedSubtotal;

  const orderId = await generateOrderId(
    (store._id as string).toString(),
    store.slug
  );

  const order = await Order.create({
    storeId: store._id,
    orderId,
    customer: {
      name: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      address: parsed.data.address,
      city: parsed.data.city || undefined,
      note: parsed.data.note || undefined,
    },
    items,
    subtotal: calculatedSubtotal,
    total,
    source: option,
    status: "NEW",
  });

  revalidatePath(`/store/${storeSlug}`);

  if (option === "WHATSAPP") {
    const message = buildWhatsAppMessage(order);
    const whatsappUrl = buildWhatsAppUrl(store.whatsappNumber, message);
    return {
      success: true,
      orderId: order.orderId,
      redirectUrl: whatsappUrl,
    };
  }

  return {
    success: true,
    orderId: order.orderId,
    redirectUrl: `/store/${storeSlug}/order-success/${order.orderId}`,
  };
}
