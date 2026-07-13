"use server";

import { connectDB } from "@/lib/database/mongoose";
import { requireShopOwner } from "@/lib/permissions/authorize";
import { Order } from "@/models/Order";

export async function getDashboardStats() {
  const session = await requireShopOwner();
  await connectDB();

  const storeId = session.user.storeId;

  const [
    totalOrders,
    totalSales,
    newLeads,
    pendingOrders,
    confirmedOrders,
    completedOrders,
    cancelledOrders,
    recentOrders,
    recentLeads,
  ] = await Promise.all([
    Order.countDocuments({
      storeId,
      status: { $in: ["CONFIRMED", "COMPLETED"] },
    }),
    Order.aggregate([
      { $match: { storeId: storeId, status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ storeId, status: "NEW" }),
    Order.countDocuments({
      storeId,
      status: { $in: ["NEW", "CONTACTED", "CONFIRMED"] },
    }),
    Order.countDocuments({ storeId, status: "CONFIRMED" }),
    Order.countDocuments({ storeId, status: "COMPLETED" }),
    Order.countDocuments({ storeId, status: "CANCELLED" }),
    Order.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Order.find({ storeId, status: { $in: ["NEW", "CONTACTED"] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    totalOrders,
    totalSales: totalSales[0]?.total ?? 0,
    newLeads,
    pendingOrders,
    confirmedOrders,
    completedOrders,
    cancelledOrders,
    recentOrders: recentOrders.map((o) => ({
      _id: (o._id as string).toString(),
      orderId: o.orderId,
      customerName: o.customer.name,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt?.toISOString() ?? "",
    })),
    recentLeads: recentLeads.map((o) => ({
      _id: (o._id as string).toString(),
      orderId: o.orderId,
      customerName: o.customer.name,
      phone: o.customer.phone,
      status: o.status,
      createdAt: o.createdAt?.toISOString() ?? "",
    })),
  };
}
