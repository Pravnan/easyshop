"use server";

import { connectDB } from "@/lib/database/mongoose";
import { requireShopOwner } from "@/lib/permissions/authorize";
import { Order, IOrder, OrderStatus } from "@/models/Order";
import { Store } from "@/models/Store";
import { Counter } from "@/models/Counter";
import { manualOrderSchema, ManualOrderInput } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export async function getOrders(status?: string, search?: string) {
  const session = await requireShopOwner();
  await connectDB();

  const filter: Record<string, unknown> = {
    storeId: session.user.storeId,
  };

  if (status && status !== "all") {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((o) => ({
    _id: (o._id as string).toString(),
    orderId: o.orderId,
    customerName: o.customer.name,
    customerPhone: o.customer.phone,
    items: o.items,
    total: o.total,
    source: o.source,
    status: o.status,
    createdAt: o.createdAt?.toISOString() ?? "",
  }));
}

export async function getOrderById(orderId: string) {
  const session = await requireShopOwner();
  await connectDB();

  const order = await Order.findOne({
    _id: orderId,
    storeId: session.user.storeId,
  }).lean();

  if (!order) throw new Error("Order not found");

  return {
    _id: (order._id as string).toString(),
    orderId: order.orderId,
    externalOrderId: order.externalOrderId,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    total: order.total,
    source: order.source,
    status: order.status,
    internalNote: order.internalNote,
    createdAt: order.createdAt?.toISOString() ?? "",
    updatedAt: order.updatedAt?.toISOString() ?? "",
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await requireShopOwner();
  await connectDB();

  const order = await Order.findOne({
    _id: orderId,
    storeId: session.user.storeId,
  });

  if (!order) throw new Error("Order not found");

  order.status = status;
  await order.save();
  revalidatePath("/dashboard/orders");

  return { success: true };
}

export async function updateInternalNote(orderId: string, note: string) {
  const session = await requireShopOwner();
  await connectDB();

  const order = await Order.findOne({
    _id: orderId,
    storeId: session.user.storeId,
  });

  if (!order) throw new Error("Order not found");

  order.internalNote = note;
  await order.save();
  revalidatePath("/dashboard/orders");

  return { success: true };
}

export async function createManualOrder(data: ManualOrderInput) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = manualOrderSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const store = await Store.findById(session.user.storeId);
  if (!store) throw new Error("Store not found");

  const counter = await Counter.findOneAndUpdate(
    { storeId: session.user.storeId },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.sequence).padStart(6, "0");
  const slug = store.slug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const orderId = parsed.data.externalOrderId || `ES-${slug}-${seq}`;

  if (parsed.data.externalOrderId) {
    const existing = await Order.findOne({
      storeId: session.user.storeId,
      orderId,
    });
    if (existing) {
      throw new Error("An order with this ID already exists");
    }
  }

  const itemSubtotal = parsed.data.totalAmount;
  const order = await Order.create({
    storeId: session.user.storeId,
    orderId,
    externalOrderId: parsed.data.externalOrderId || undefined,
    customer: {
      name: parsed.data.customerName,
      phone: parsed.data.customerPhone,
      email: parsed.data.customerEmail || undefined,
      address: parsed.data.customerAddress,
      city: parsed.data.customerCity || undefined,
      note: parsed.data.customerNote || undefined,
    },
    items: [
      {
        productName: parsed.data.productDescription,
        quantity: parsed.data.quantity,
        unitPrice: parsed.data.totalAmount / parsed.data.quantity,
        subtotal: itemSubtotal,
      },
    ],
    subtotal: itemSubtotal,
    total: itemSubtotal,
    source: "MANUAL",
    status: (parsed.data.status as OrderStatus) || "NEW",
    internalNote: parsed.data.internalNote || undefined,
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");

  return {
    success: true,
    orderId: order.orderId,
  };
}
